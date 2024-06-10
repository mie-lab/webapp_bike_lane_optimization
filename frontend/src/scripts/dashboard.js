// dashboard.js
// -----------------
// contains functions to extract evaluation data for a given run and update the appropriate result store.

import { useResultsStore } from "../stores/runResultsStore.js";
import { userInputStore } from "../stores/userInputStore.js";
import { loadingStore } from "../stores/loadingStore.js";
import { useCompareRunEvaluation } from "../stores/compareRunResultStore.js";
import {
  getPareto,
  getKmDistancePerLaneType,
  getComplexity,
  getNetworkBearing,
} from "../scripts/api.js";

/**
 * Extracts Pareto evaluation data for a given run and updates the appropriate result store.
 *
 * @param {Object} run - The run object containing run details.
 * @param {boolean} compareMode - Indicates whether the function is in compare mode.
 * @returns {Promise<void>} - The function does not return a value but updates the state.
 */
export async function extractParetoEvaluation(run, compareMode = false) {
  // save in result store or in compare result store
  let resultsStore;
  if (compareMode) {
    resultsStore = useCompareRunEvaluation();
  } else {
    resultsStore = useResultsStore();
  }

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

/**
 * Extracts distances per lane type for a given run and updates the appropriate result store.
 *
 * @param {Object} run - The run object containing run details.
 * @param {boolean} compareMode - Indicates whether the function is in compare mode.
 * @returns {Promise<void>} - The function does not return a value but updates the state.
 */
export async function extractDistancesPerLane(run, compareMode = false) {
  // save in result store or in compare result store
  let resultsStore;
  if (compareMode) {
    resultsStore = useCompareRunEvaluation();
  } else {
    resultsStore = useResultsStore();
  }
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

/**
 * Extracts complexity data for a given run and updates the appropriate result store.
 *
 * @param {Object} run - The run object containing run details.
 * @param {boolean} compareMode - Indicates whether the function is in compare mode.
 * @returns {Promise<void>} - The function does not return a value but updates the state.
 */
export async function extractComplexity(run, compareMode = false) {
  // save in result store or in compare result store
  let resultsStore;
  if (compareMode) {
    resultsStore = useCompareRunEvaluation();
  } else {
    resultsStore = useResultsStore();
  }
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

/**
 * Extracts network bearing data for a given run and updates the appropriate result store.
 *
 * @param {Object} run - The run object containing run details.
 * @param {boolean} compareMode - Indicates whether the function is in compare mode.
 * @returns {Promise<void>} - The function does not return a value but updates the state.
 */
export async function extractBearing(run, compareMode = false) {
  // save in result store or in compare result store
  let resultsStore;
  if (compareMode) {
    resultsStore = useCompareRunEvaluation();
  } else {
    resultsStore = useResultsStore();
  }
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
