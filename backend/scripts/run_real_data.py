import time
import os
import json
import argparse
import pandas as pd
import numpy as np
import geopandas as gpd
import networkx as nx

from ebike_city_tools.graph_utils import (
    lane_to_street_graph,
    keep_only_the_largest_connected_component,
    load_lane_graph,
)
from ebike_city_tools.optimize.wrapper import generate_motorized_lane_graph
from ebike_city_tools.od_utils import extend_od_circular
from ebike_city_tools.optimize.rounding_utils import combine_paretos_from_path, combine_pareto_frontiers
from ebike_city_tools.iterative_algorithms import betweenness_pareto, topdown_betweenness_pareto
from ebike_city_tools.optimize.round_optimized import ParetoRoundOptimize

ROUNDING_METHOD = "round_bike_optimize"
IGNORE_FIXED = True
FIX_MULTILANE = True
FLOW_CONSTANT = 1  # how much flow to send through a path
WEIGHT_OD_FLOW = False
RATIO_BIKE_EDGES = 0.4
algorithm_dict = {
    "betweenness_topdown": (topdown_betweenness_pareto, {}),
    "betweenness_cartime": (betweenness_pareto, {"betweenness_attr": "car_time"}),
    "betweenness_biketime": (betweenness_pareto, {"betweenness_attr": "bike_time"}),
}

od_quantile_used = {"chicago": 0.9, "cambridge": 0.5}  # set this with the final parameters


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--data_path", default="../street_network_data", type=str)
    parser.add_argument("-i", "--instance", default="affoltern", type=str)
    parser.add_argument("-o", "--out_path", default="outputs", type=str)
    parser.add_argument("-k", "--optimize_every_k", default=50, type=int, help="how often to re-optimize")
    parser.add_argument("-c", "--car_weight", default=1, type=float, help="weighting of cars in objective function")
    parser.add_argument(
        "-v", "--valid_edges_k", default=0, type=int, help="if subsampling edges, the number of nodes around SP"
    )
    parser.add_argument(
        "-p", "--penalty_shared", default=2, type=int, help="penalty factor for driving on a car lane by bike"
    )
    parser.add_argument(
        "-s", "--sp_method", default="od", type=str, help="Compute the shortest path either 'all_pairs' or 'od'"
    )
    parser.add_argument("--save_graph", action="store_true", help="if true, only creating one graph and saving it")
    parser.add_argument(
        "-a",
        "--algorithm",
        type=str,
        default="optimize",
        help="One of optimize, betweenness_topdown, betweenness_cartime, betweenness_biketime",
    )
    args = parser.parse_args()

    instance_name = args.instance
    path = os.path.join(args.data_path, instance_name)
    shared_lane_factor = args.penalty_shared  # how much to penalize biking on car lanes
    out_path = os.path.join(args.out_path, args.instance)
    sp_method = args.sp_method
    algorithm = args.algorithm
    assert algorithm in ["optimize", "betweenness_topdown", "betweenness_cartime", "betweenness_biketime"]
    out_path_ending = "_od" if sp_method == "od" else ""
    os.makedirs(out_path, exist_ok=True)

    np.random.seed(42)  # random seed for extending the od matrix
    # V1: generate lane graph with my code
    G_lane = load_lane_graph(path)
    print("Loaded lane graph:", G_lane.number_of_nodes(), G_lane.number_of_edges())
    G_lane = keep_only_the_largest_connected_component(G_lane)
    print("Size after reducing to connected comp:", G_lane.number_of_nodes(), G_lane.number_of_edges())
    # # V2: SNMan lane graph
    # G_lane = generate_motorized_lane_graph(
    #     os.path.join(path, "edges_all_attributes.gpkg"), os.path.join(path, "nodes_all_attributes.gpkg")
    # )

    # save lane graph
    # import pickle
    # with open("real_lane_graph.p", "wb") as outfile:
    #     pickle.dump(G_lane, outfile)
    # # nx.write_gpickle(G_lane, "real_lane_graph.gpickle")
    # exit()

    # load OD
    od = pd.read_csv(os.path.join(path, "od_matrix.csv"))
    od = od[od["s"] != od["t"]]
    # reduce OD matrix to nodes that are in G_lane
    node_list = list(G_lane.nodes())
    od = od[(od["s"].isin(node_list)) & (od["t"].isin(node_list))]

    # # Code to output instance properties
    # print(args.data_path.split(os.sep)[-1], ",", G_lane.number_of_nodes(), ",", G_lane.number_of_edges(), ",", len(od))
    # exit()

    assert nx.is_strongly_connected(G_lane), "G not connected"

    if "betweenness" in algorithm:
        print(f"Running betweenness algorithm {algorithm}")
        # get algorithm method
        algorithm_func, kwargs = algorithm_dict[algorithm]
        save_graph_path = (
            os.path.join(out_path, f"{algorithm}{out_path_ending}") if args.save_graph is not None else None
        )

        # run betweenness centrality algorithm for comparison
        pareto_between = algorithm_func(
            G_lane.copy(),
            sp_method=sp_method,
            od_matrix=od,
            weight_od_flow=WEIGHT_OD_FLOW,
            fix_multilane=FIX_MULTILANE,
            save_graph_path=save_graph_path,
            save_graph_every_x=args.optimize_every_k,
            **kwargs,
        )
        pareto_between.to_csv(os.path.join(out_path, f"real_pareto_{algorithm}{out_path_ending}.csv"), index=False)
        exit()

    # from here on, algorithm is "optimize"
    assert algorithm == "optimize"

    # extend OD matrix because otherwise we get disconnected car graph
    od = extend_od_circular(od, node_list)

    # tune the car_weight
    runtimes_pareto = []
    for car_weight in [float(args.car_weight)]:  # [0.1, 0.25, 0.5, 1, 2, 4, 8]:
        print(f"Running LP for pareto frontier (car weight={car_weight})...")

        # set the filename to save the results
        fn_with_parameters = f"optimize{out_path_ending}_{car_weight}_{args.optimize_every_k}"

        # compute the paretor frontier
        tic = time.time()

        # initialize Pareto optimizer
        opt = ParetoRoundOptimize(
            G_lane.copy(),
            od.copy(),
            optimize_every_x=args.optimize_every_k,
            car_weight=car_weight,
            sp_method=sp_method,
            shared_lane_factor=shared_lane_factor,
            weight_od_flow=WEIGHT_OD_FLOW,
            valid_edges_k=args.valid_edges_k,
        )
        # RUN pareto optimization, potentially with saving the graph after each optimization step
        save_graph_path = os.path.join(out_path, fn_with_parameters) if args.save_graph else None
        pareto_df = opt.pareto(fix_multilane=FIX_MULTILANE, save_graph_path=save_graph_path)

        # save runtimes
        print("Time pareto", time.time() - tic)
        runtime_dict_from_pareto = opt.runtimes
        runtime_dict_from_pareto["time_pareto"] = time.time() - tic
        runtimes_pareto.append(runtime_dict_from_pareto)

        # save to file
        pareto_df.to_csv(
            os.path.join(out_path, f"real_pareto_{fn_with_parameters}.csv"),
            index=False,
        )

    # save runtimes
    with open(os.path.join(out_path, f"runtime_pareto_{fn_with_parameters}.json"), "w") as outfile:
        json.dump(runtimes_pareto, outfile)

    # combine all pareto frontiers
    combined_pareto = combine_pareto_frontiers(combine_paretos_from_path(out_path))
    combined_pareto.to_csv(os.path.join(out_path, f"real_pareto_combined_optimize{out_path_ending}.csv"), index=False)
