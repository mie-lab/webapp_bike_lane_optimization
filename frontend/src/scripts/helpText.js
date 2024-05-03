// helpText.js

export const helpText = {
  optimize:
    "The Optimize-algorithm is a linear programming (LP) formulation that minimises a weighted sum of car and bike travel times. A post-processing algorithm iteratively allocates bike lanes, prioritising those with the highest values according to the LP solution.",
  betweenessBiketime:
    "Starting from a car network with no cycle lanes, edges are iteratively allocated to cycling, starting with the lanes with the lowest betweenness centrality in the car network. The reasoning is that the lanes that are least important for car travel can easily be converted into cycle lanes.",
  betweenessCartime:
    "Starting with a car network without cycle lanes, edges are iteratively allocated to cycling, starting with the lanes with the highest betweenness centrality in the cycle network. The edges that are most central for cyclists are converted first.",
};
