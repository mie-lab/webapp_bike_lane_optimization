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
  lts: "Measures how well a cycling network supports stress-free travel. Based on street and crossing classifications, it reflects what share of trips can be completed using only low-stress routes without major detours, highlighting network gaps and barriers.",
  bci: "Rates how comfortable and safe a roadway is for shared use between cars and bikes. It uses traffic speed, lane width, volume, and roadside conditions to calculate a score, where lower values mean better biking compatibility.",
  bsl: "Evaluates how mentally stressful a roadway is for bicyclists based on traffic volume, speed, and lane width. Streets are rated from 1 (low stress) to 5 (high stress), reflecting how comfortable and safe they feel for cyclists across different conditions.",
  blos_grade: "Grades how well a roadway serves bicyclists based on factors like traffic speed, volume, lane width, and heavy vehicles. Scores range from A (high comfort) to F (low comfort), helping identify roads needing bike-friendly improvements.",
  porter: "A transportation bikeability index that captures how supportive the environment is for biking to destinations. It combines factors like bike lanes, density, parks, and transit access, and is strongly associated with how often people bike for transportation.",
  weikl: "A data-driven index that evaluates overall bicycle network quality based on planning criteria like safety, coherence, directness, comfort, and attractiveness. It combines local, route-wide, and network-wide indicators into a single comprehensive score.",
  anp: "A bikeability index that uses analytic network process (ANP) and a knowledge graph of evaluation studies to weight and combine over 270 metrics and 40 criteria. It reflects scholarly consensus and captures complex relationships between bike planning factors.",
  



};
