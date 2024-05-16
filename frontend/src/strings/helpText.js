// helpText.js

export const helpText = {
  introduction:
    "Welcome to the Zurich Bike Lane Optimizer! Transform the street network of Zurich city, reallocating lanes from cars to bikes while ensuring full connectivity for vehicles",
  howTo1:
    "to define a perimeter where the optimization will take place by drawing a polygon or a rectangle on the map",
  howTo2:
    "for your defined perimeter with different optimization algorithms and parameters",
  howTo3: "of the different runs on the map and in the dashboard",
  optimize:
    "The Optimize-algorithm is a linear programming (LP) formulation that minimises a weighted sum of car and bike travel times. A post-processing algorithm iteratively allocates bike lanes, prioritising those with the highest values according to the LP solution.",
  betweenessBiketime:
    "Starting from a car network with no cycle lanes, edges are iteratively allocated to cycling, starting with the lanes with the lowest betweenness centrality in the car network. The reasoning is that the lanes that are least important for car travel can easily be converted into cycle lanes.",
  betweenessCartime:
    "Starting with a car network without cycle lanes, edges are iteratively allocated to cycling, starting with the lanes with the highest betweenness centrality in the cycle network. The edges that are most central for cyclists are converted first.",
};
