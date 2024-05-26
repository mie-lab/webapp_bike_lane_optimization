import { useResultsStore } from "../stores/runResultsStore.js";
import { userInputStore } from "../stores/userInputStore.js";
import { loadingStore } from "../stores/loadingStore.js";
import {
  getPareto,
  getKmDistancePerLaneType,
  getComplexity,
  getNetworkBearing,
} from "../scripts/api.js";
export async function extractParetoEvaluation(run) {
  const resultsStore = useResultsStore();
  const inputStore = userInputStore();
  const loading = loadingStore();

  // set loading state
  loading.setParetoIsLoading(true);

  // create evaluation for the selected run
  const paretoEvaluation = await getPareto(inputStore.projectID, run.id_run);

  // Extracting data from paretoEvaluation
  const projects = paretoEvaluation.projects;
  const bikeTimes = projects.map((project) => project.bike_time_change);
  const carTimes = projects.map((project) => project.car_time_change);

  resultsStore.setTraveltimes(bikeTimes, carTimes);
  loading.setParetoIsLoading(false);
}

export async function extractDistancesPerLane(run) {
  const resultsStore = useResultsStore();
  const inputStore = userInputStore();
  const loading = loadingStore();

  // set loading state
  loading.setDistancesIsLoading(true);

  // get km per bike / car lane
  const distanceEvaluation = await getKmDistancePerLaneType(
    inputStore.projectID,
    run.id_run
  );

  resultsStore.setDistancesKM(
    distanceEvaluation.distance_bike[0].total_bike_lane_distance,
    distanceEvaluation.distance_car[0].total_car_lane_distance
  );
  resultsStore.setRunName(run.run_name);
  loading.setDistancesIsLoading(false);
}

export async function extractComplexity(run) {
  const resultsStore = useResultsStore();
  const inputStore = userInputStore();
  const loading = loadingStore();

  // set loading state
  loading.setComplexityIsLoading(true);

  // get complexity
  const complexityEvaluation = await getComplexity(
    inputStore.projectID,
    run.id_run
  );
  resultsStore.setComplexity(
    complexityEvaluation.bike_degree_ratio,
    complexityEvaluation.car_degree_ratios
  );
  loading.setComplexityIsLoading(false);
}

export async function extractBearing(run) {
  const resultsStore = useResultsStore();
  const inputStore = userInputStore();
  const loading = loadingStore();

  // set loading state
  loading.setBearingIsLoading(true);

  // get network bearing
  const bearingEvaluation = await getNetworkBearing(
    inputStore.projectID,
    run.id_run
  );
  resultsStore.setNetworkBearing(
    bearingEvaluation.bike_network_bearings,
    bearingEvaluation.car_network_bearings
  );

  loading.setBearingIsLoading(false);
}