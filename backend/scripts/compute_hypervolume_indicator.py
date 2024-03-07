import os
import argparse
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from ebike_city_tools.optimize.rounding_utils import combine_pareto_frontiers
from ebike_city_tools.metrics import hypervolume_indicator
import warnings

warnings.filterwarnings("ignore")

parser = argparse.ArgumentParser()
parser.add_argument("-i", "--in_path", type=str, default="outputs/integer_vs_linear.csv")
parser.add_argument("-o", "--out_path", type=str, default="figures")
parser.add_argument("-p", "--plot", action="store_true")
args = parser.parse_args()


int_vs_lin = pd.read_csv(args.in_path)

out_path_figures = os.path.join(args.out_path, "pareto_examples")

os.makedirs(out_path_figures, exist_ok=True)

number_trials = int_vs_lin["car_weight"].nunique()
# ref_point = np.max(int_vs_lin[["bike_time", "car_time"]].values, axis=0)
# set refpoint to 0 (0% bike time decrease) and 100% car time increase
ref_point = np.array([0, 100])

i = 0
hi_res = []
for (nodes, edges, od_size), part_df in int_vs_lin.groupby(["nodes", "edges", "od_size"]):
    integer = part_df[part_df["name"] == "integer"]
    linear = part_df[part_df["name"] == "linear"]

    base_car, base_bike = linear.iloc[0]["car_time"], linear.iloc[0]["bike_time"]

    # compute percentage difference
    for df in [integer, linear]:
        df["car_time"] = (df["car_time"] - base_car) / base_car * 100
        df["bike_time"] = (df["bike_time"] - base_bike) / base_bike * 100

    if sum(part_df["name"] == "integer") > number_trials:
        continue

    # compute hypervolume indicator
    integer_solutions = integer[
        ["bike_time", "car_time"]
    ].values  # .sort_values(["bike_time", "car_time"], ascending=[True, False]).values
    hi_integer = hypervolume_indicator(integer_solutions, ref_point)

    res_p = []
    for _, one_car_weight_df in linear.groupby("car_weight"):
        res_p.append(one_car_weight_df)
    combined_linear = (
        combine_pareto_frontiers(res_p)
        .drop_duplicates(subset=["bike_time", "car_time"])
        .sort_values(["bike_time", "car_time"], ascending=[True, False])
    )

    best_linear_vals = combined_linear[["bike_time", "car_time"]].values
    closest_linear_solutions = []
    for int_sol in integer_solutions:
        dist = np.linalg.norm(best_linear_vals - int_sol, axis=1)
        closest_linear_solutions.append(best_linear_vals[np.argmin(dist)])
        # use two closest points --> find the one above or below
        if best_linear_vals[np.argmin(dist)][0] > int_sol[0]:
            closest_linear_solutions.append(best_linear_vals[np.argmin(dist) - 1])
        else:
            closest_linear_solutions.append(best_linear_vals[np.argmin(dist) + 1])
    closest_linear_solutions = np.array(closest_linear_solutions)

    hi_linear = hypervolume_indicator(closest_linear_solutions, ref_point)
    if args.plot:
        plt.figure(figsize=(4, 3.3))
        plt.scatter(
            linear["bike_time"], linear["car_time"], c=linear["car_weight"].values, marker=".", label="linear solutions"
        )
        plt.plot(combined_linear["bike_time"], combined_linear["car_time"], c="grey", alpha=0.5, label="linear pareto")
        plt.scatter(
            integer["bike_time"],
            integer["car_time"],
            c=integer["car_weight"].values,
            marker="x",
            label="integer pareto",
            s=60,
        )  # c=integer["car_weight"].values,
        plt.scatter(
            closest_linear_solutions[:, 0], closest_linear_solutions[:, 1], c="red", marker=".", label="matched points"
        )
        plt.xlabel("Change in perceived bike travel time [%]")
        plt.ylabel("Increase in car travel time [%]")
        plt.legend()  # title="IP or LP formulation")
        plt.colorbar(label=r"$\gamma$ (weighting of car time in objective)")
        plt.tight_layout()
        plt.savefig(os.path.join(out_path_figures, f"example_{i}.pdf"))
        # plt.show()

    print(i, round(hi_integer), round(hi_linear), "Difference:", (hi_linear - hi_integer) / hi_integer * 100)
    hi_res.append({"HI integer": hi_integer, "HI linear": hi_linear, "edges": edges, "od_size": od_size})
    i += 1


hi_res = pd.DataFrame(hi_res)
hi_res["increase_percent"] = (hi_res["HI linear"] - hi_res["HI integer"]) / hi_res["HI integer"] * 100
hi_res.to_csv(os.path.join(args.out_path, "hypervolume_indicator.csv"), index=False)
