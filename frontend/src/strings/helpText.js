// helpText.js

export const helpText = {
  introduction:
    "Transform the street network of Zurich city, reallocating lanes from cars to bikes while ensuring full connectivity for vehicles",
  howTo1:
    "to define a perimeter where the optimization will take place by drawing a polygon or a rectangle on the map",
  howTo2:
    "for your defined perimeter with different optimization algorithms and parameters",
  howTo3: 
    "of the different runs on the map and in the dashboard",
  howTo4:
    "for multiple runs of a project",
  howTo5:
    "of the different runs on the map and in the dashboard ",



  // algorithm descriptions
  optimize:
    "The Optimize-algorithm is a linear programming (LP) formulation that minimises a weighted sum of car and bike travel times. A post-processing algorithm iteratively allocates bike lanes, prioritising those with the highest values according to the LP solution.",
  betweenessBiketime:
    "Starting from a car network with no cycle lanes, edges are iteratively allocated to cycling, starting with the lanes with the lowest betweenness centrality in the car network. The reasoning is that the lanes that are least important for car travel can easily be converted into cycle lanes.",
  betweenessCartime:
    "Starting with a car network without cycle lanes, edges are iteratively allocated to cycling, starting with the lanes with the highest betweenness centrality in the cycle network. The edges that are most central for cyclists are converted first.",

// Input Parameter description
  bikeLaneRatio: "This percentage determines the amount of car lanes that are converted into bike lanes. So the value can vary from 0 to 100%. The actual number of bike lanes might be lower than your input.",
  safetyPenalty: "The higher this value, the less cyclists prefer riding on streets without bike lanes. A value of 1 indicates a neutral attitude, meaning that cyclists see riding on the street as equally preferable as riding on bike paths. ",
  carWeight: "The car weight shows the importance of car travel time in relation to the bike travel time. A value of 0.1 means that the bike travel times are 10 times more important than the car travel times, 10 means the other way round. ",
  optimizeFrequency: "Can also be seen as the optimization exactness, because the more often it's re-run, the better the result should be. But the runtime increases as well.",




  // evaluation descriptions
  pareto: "The Pareto front shows the trade-off between car and bike travel times. The points on the Pareto front are the solutions that are not dominated by any other solution. The Pareto front is a useful tool to understand the trade-offs between different objectives.",
  travelTimeChanges: "The travel time changes for cars and bikes are calculated as the difference between the travel times in the original and optimized networks. The travel time changes are a useful metric to understand the impact of the optimization on car and bike travel times.",
  distancesPerLaneType: "The distances per lane type show the amount of kilometers that are allocated to cars and bikes in the optimized network.",
  networkBearing:
  "The network bearing, reflecting the average turn angle across all shortest paths in the optimized network, impacts safety, speed, and flow. A smaller average turn angle can lead to a steadier speed and a better cycling experience.",

  networkComplexity:
  "The percentage distribution of intersection sizes based on node degree in the optimized network offers insight into network complexity, known to influence travel behavior.",


  // advanced evaluation
  

lts: "The Level of Traffic Stress measures how accessible and low-stress a cycling network is. It evaluates whether cyclists can reach destinations using only low-stress routes, based on street types and intersection complexity. A higher LTS indicates more barriers and stress-inducing segments in the network.",

bci: "The Bicycle Compatibility Index assesses how safely and comfortably a roadway accommodates cyclists riding alongside motor vehicles. It incorporates factors such as traffic speed, volume, lane width, and roadside conditions. Lower scores indicate better compatibility and a more bike-friendly environment.",

bsl: "The Bicycle Stress Level quantifies the psychological stress experienced by cyclists on different road segments. It accounts for traffic volume, vehicle speed, and lane characteristics, and rates roads on a scale from 1 (low stress) to 5 (high stress), reflecting their comfort level for cycling.",

blos_grade: "The Bicycle Level of Service grade rates roadways from A to F based on how well they support safe and efficient bicycle travel. The grade considers factors like traffic speed, volume, lane width, and the presence of heavy vehicles, helping identify corridors that need infrastructure improvements.",

porter: "The Porter Index evaluates the suitability of urban environments for transportation cycling. It combines spatial factors like land use density, access to parks and public transit, and the availability of bike lanes to reflect how supportive an area is for everyday cycling activity.",

weikl: "The Weikl Index is a comprehensive, data-driven assessment of bicycle network quality. It integrates criteria such as safety, directness, comfort, and connectivity across local and regional scales to produce a single score that reflects overall network performance and planning quality.",

anp: "The ANP metric uses the Analytic Network Process to calculate a composite bikeability score. It synthesizes over 270 indicators across 40 planning criteria, weighted by a knowledge graph of academic studies. This method reflects expert consensus and captures complex interdependencies in network evaluation.",

};

