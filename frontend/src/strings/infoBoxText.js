// infoBoxText.js

export const infoBoxTexts = {
  // create new run page
  run_name:
    "Enter a name for your run. You can find your run later by searching for this name.",
  run_algorithm:
    "Select on of the available algorithms. Each algorithm is described in the help tab.",
  run_bike_ratio:
    "The ratio of edges that is converted into bike lanes. The actual number of bike edges might be lower than your input.",
  run_bike_safety_penalty: "The assumption is that cyclists prefer to ride on dedicated bike lanes. When this is not possible, their experience deteriorates, which manifests as an increased perceived travel time.",
  run_car_weight: "Importance of car travel times in relation to the bike travel time. ",
  run_optimize_frequency: "The more the optimization is re-run, the better the results are. But the runtime increases as well.",

  // dashboard
  evaluation_pareto: "Represents the trade-off between car and bike travel times, illustrating the optimal balance where any improvement in one mode's travel time would result in a deterioration of the other's.",
  evaluation_travel_time_changes:"Shows the relative change in travel time for cars and bikes compared to the initial network.",
  evaluation_distances_per_type:"Shows the distribution of distances in kilometers for cars and bikes in the optimized network.",
  evaluation_network_bearing : "Average turn angle between two connected edges in the optimized network.",
  evaluation_network_complexity: " Illustrates the percentage of intersection sizes in the optimized networks, categorized by node degree.",

  // evaluation dashboard
  lts: "test lts",
  bci: "test bts",
  bsl: "test",
  blos_grade: "test",
  porter: "test",
  weikl: "test",
  anp: "test"



};
