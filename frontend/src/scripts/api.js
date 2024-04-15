// api.js
import { userInputStore } from "../stores/userInputStore.js";

export async function runConstructGraph(boundingBox, projectName) {
  const url = `http://localhost:8989/construct_graph?project_name=${projectName}`;
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
    `http://localhost:8989/optimize?` +
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

export async function getProjectList() {
  const url = `http://localhost:8989/get_projects`;
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

export async function getRunList(projectID) {
  const url =
    `http://localhost:8989/get_runs?` +
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

export async function getNewRunID(projectID) {
  const url =
    `http://localhost:8989/get_new_run_id?` +
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

export async function createView(projectID, runID, layerName) {
  const url =
    `http://localhost:8989/create_view?` +
    `project_id=${encodeURIComponent(projectID)}` +
    `&run_id=${encodeURIComponent(runID)}` +
    `&layer=${encodeURIComponent(layerName)}`;

  const params = {
    method: "POST",
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
    if (layerName === "v_bound" && responseData.bounding_box) {
      const userInput = userInputStore();
      userInput.setBoundingBox(responseData.bounding_box);
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function evalTravelTime(projectID, runID) {
  const url =
    `http://localhost:8989/eval_travel_time?` +
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

export async function getPareto(projectID, runID) {
  const url =
    `http://localhost:8989/get_pareto?` +
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
