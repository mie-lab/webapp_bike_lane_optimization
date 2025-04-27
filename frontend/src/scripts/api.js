// api.js
// -----------------
// This file provides functions to interact with a backend server. The file includes functions for
// constructing graphs, running optimizations,
// and retrieving data related to projects, optimization runs, and metrics like distance per lane type
// and network bearing. The functions use the Fetch API to make HTTP requests to the backend.

import { userInputStore } from "../stores/userInputStore.js";

/**
 * Constructs a graph for a given bounding box and project name.
 *
 * @param {Object} boundingBox - The geographic bounding box to construct the graph.
 * @param {string} projectName - The name of the project for which the graph is being constructed.
 * @returns {Promise<Object>} - The JSON response from the backend.
 */

export async function runConstructGraph(boundingBox, projectName) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/construct_graph?project_name=${projectName}`;
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(boundingBox),
  };
  //console.log("params", params);

  try {
    const response = await fetch(url, params);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse and return JSON response
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow error for handling in the Vue component
  }
}

/**
 * Runs optimization for a project with specified parameters.
 *
 * @param {number} projectID - The ID of the project to optimize.
 * @param {string} algorithm - The algorithm to use for optimization.
 * @param {number} bikeRatio - The ratio of bikes to optimize for.
 * @param {number} optimizeFrequency - Optimize frequency.
 * @param {number} carWeight - The weight of cars in the optimization.
 * @param {number} bikeSafetyPenalty - The safety penalty for bikes.
 * @param {string} runName - The name of the optimization run.
 * @returns {Promise<Object>} - The JSON response from the backend.
 */

export async function runOptimization(
  projectID,
  algorithm,
  bikeRatio,
  optimizeFrequency,
  carWeight,
  bikeSafetyPenalty,
  runName
) {
  const url =
    `${import.meta.env.VITE_BACKEND_URL}/optimize?` +
    `project_id=${encodeURIComponent(projectID)}` +
    `&algorithm=${encodeURIComponent(algorithm)}` +
    `&bike_ratio=${encodeURIComponent(bikeRatio)}` +
    `&optimize_frequency=${encodeURIComponent(optimizeFrequency)}` +
    `&car_weight=${encodeURIComponent(carWeight)}` +
    `&bike_safety_penalty=${encodeURIComponent(bikeSafetyPenalty)}` +
    `&run_name=${encodeURIComponent(runName)}`;

  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  //console.log("params optimize", params);

  try {
    const response = await fetch(url, params);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse and return JSON response
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow error for handling in the Vue component
  }
}

/**
 * Retrieves a list of available projects.
 *
 * @returns {Promise<Object[]>} - The JSON response containing the list of projects.
 */
export async function getProjectList() {
  const url = `${import.meta.env.VITE_BACKEND_URL}/get_projects`;
  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(url, params);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse and return JSON response
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow error for handling in the Vue component
  }
}

/**
 * Retrieves a list of optimization runs for a specific project.
 *
 * @param {number} projectID - The ID of the project.
 * @returns {Promise<Object[]>} - The JSON response containing the list of runs.
 */
export async function getRunList(projectID) {
  const url =
    `${import.meta.env.VITE_BACKEND_URL}/get_runs?` +
    `project_id=${encodeURIComponent(projectID)}`;
  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(url, params);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

/**
 * Retrieves a new run ID for a specific project.
 *
 * @param {number} projectID - The ID of the project.
 * @returns {Promise<Object>} - The JSON response containing the new run ID.
 */
export async function getNewRunID(projectID) {
  const url =
    `${import.meta.env.VITE_BACKEND_URL}/get_new_run_id?` +
    `project_id=${encodeURIComponent(projectID)}`;
  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(url, params);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

/**
 * Retrieves the distance per lane type for a specific project and run.
 *
 * @param {number} projectID - The ID of the project.
 * @param {number} runID - The ID of the run.
 * @returns {Promise<Object>} - The JSON response containing the distance per lane type.
 */
export async function getKmDistancePerLaneType(projectID, runID) {
  const url =
    `${import.meta.env.VITE_BACKEND_URL}/get_distance_per_lane_type?` +
    `project_id=${encodeURIComponent(projectID)}` +
    `&run_name=${encodeURIComponent(runID)}`;
  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(url, params);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

/**
 * Retrieves Pareto front data for a specific project and run.
 *
 * @param {number} projectID - The ID of the project.
 * @param {number} runID - The ID of the run.
 * @returns {Promise<Object>} - The JSON response containing Pareto front data.
 */
export async function getPareto(projectID, runID) {
  const url =
    `${import.meta.env.VITE_BACKEND_URL}/get_pareto?` +
    `project_id=${encodeURIComponent(projectID)}` +
    `&run_name=${encodeURIComponent(runID)}`;
  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(url, params);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse and return JSON response
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow error for handling in the Vue component
  }
}

/**
 * Retrieves the complexity measure for a specific project and run.
 *
 * @param {number} projectID - The ID of the project.
 * @param {number} runID - The ID of the run.
 * @returns {Promise<Object>} - The JSON response containing the complexity measure.
 */
export async function getComplexity(projectID, runID) {
  const url =
    `${import.meta.env.VITE_BACKEND_URL}/get_complexity?` +
    `project_id=${encodeURIComponent(projectID)}` +
    `&run_name=${encodeURIComponent(runID)}`;
  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(url, params);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse and return JSON response
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow error for handling in the Vue component
  }
}

/**
 * Retrieves network bearing data for a specific project and run.
 *
 * @param {number} projectID - The ID of the project.
 * @param {number} runID - The ID of the run.
 * @returns {Promise<Object>} - The JSON response containing network bearing data.
 */
export async function getNetworkBearing(projectID, runID) {
  const url =
    `${import.meta.env.VITE_BACKEND_URL}/get_network_bearing?` +
    `project_id=${encodeURIComponent(projectID)}` +
    `&run_name=${encodeURIComponent(runID)}`;
  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(url, params);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse and return JSON response
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow error for handling in the Vue component
  }
}

/**
 * Retrieves the bounding box for a specific project.
 *
 * @param {number} projectID - The ID of the project.
 * @returns {Promise<Object>} - The JSON response containing the bounding box.
 */
export async function getBoundingBox(projectID) {
  const url =
    `${import.meta.env.VITE_BACKEND_URL}/getBoundingBox?` +
    `project_id=${encodeURIComponent(projectID)}`;

  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, params);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();

    // Store bounding box in userInputStore if layer is "v_bound"
    if (responseData.bounding_box) {
      const userInput = userInputStore();
      userInput.setBoundingBox(responseData.bounding_box);
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}


export async function checkIfEvalMetricExists(runID, metric_key, projectID) {
  const url =
    `${import.meta.env.VITE_BACKEND_URL}/check_eval_metric_exists?` +
    `project_id=${encodeURIComponent(projectID)}` +
    `&run_id=${encodeURIComponent(runID)}` +
    `&metric_key=${encodeURIComponent(metric_key)}`;

  const params = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(url, params);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    return result.exists === true;
  } catch (error) {
    console.error("Error checking if metric exists:", error);
    return false;
  }
}

const metricRoutes = {
  lts: "get_lts",
  bci: "get_bci",
  bsl: "get_bsl",
  blos_grade: "get_blos",
  porter: "get_porter",
  weikl: "get_weikl",
};



export async function triggerEvalMetricComputation(runID, metric, projectID) {
  console.log("🟡 triggerEvalMetricComputation called with:", {
    runID,
    metric,
    projectID,
  });

  const endpoint = metricRoutes[metric];
  console.log("🔍 Resolved endpoint:", endpoint);

  if (!endpoint) {
    console.warn(`⚠️ No route mapped for metric: "${metric}"`);
    return;
  }

  const url =
    `${import.meta.env.VITE_BACKEND_URL}/${endpoint}?` +
    `project_id=${encodeURIComponent(projectID)}` +
    `&run_name=${encodeURIComponent(runID)}`;

  const params = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(url, params);
    console.log("📬 Raw response status:", response.status);
  
    const contentType = response.headers.get("content-type");
    const rawText = await response.text();
    console.log("🧾 Raw response body:", rawText);
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} – body: ${rawText}`);
    }
  
    // If content-type is not JSON, warn!
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("❌ Response is not JSON! Content-Type: " + contentType);
    }
  
    return JSON.parse(rawText); // try parse manually for more control
  } catch (error) {
    console.error(`❌ Error while computing metric "${metric}":`, error);
    throw error;
  }
  
};
export async function fetchEvaluationMetricValues(projectID, runID, rawMetricKey) {
  const metricKey = rawMetricKey.replace(/^"(.*)"$/, "$1");
  // Defensive check for invalid input
  if (!projectID || !runID || !metricKey) {
    console.warn("Invalid input for fetchEvaluationMetricValues:", {
      projectID,
      runID,
      metricKey,
    });
    return [];
  }

  const layerName = "v_eval_pivoted";
  const baseUrl = "https://baug-ikg-gis-01.ethz.ch:8443/geoserver/GMP_EBC/ows";
  const viewParams = `prj:${projectID};run:${runID}`;
  const url =
    `${baseUrl}?service=WFS&version=1.0.0&request=GetFeature&typeName=GMP_EBC:${layerName}` +
    `&outputFormat=application/json&viewparams=${viewParams}`;

  // Debug logs
  console.log("Fetching WFS data for metric:");
  console.log("Metric Key:", metricKey);
  console.log("Project ID:", projectID);
  console.log("Run ID:", runID);
  console.log("Full WFS URL:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const rawText = await response.text();
      console.error("WFS request failed:", response.status, rawText);
      throw new Error("Failed to fetch WFS feature data");
    }

    const geojson = await response.json();

    // Extract numeric values for the given metric key
    const values = geojson.features
      .map((feature) => feature.properties?.[metricKey])
      .filter((v) => typeof v === "number" && !isNaN(v));

    console.log(`Extracted ${values.length} values for ${metricKey}`);
    return values;
  } catch (error) {
    console.error("Error fetching metric values:", error);
    return [];
  }
}








