// api.js
export async function runConstructGraph(boundingBox, projectName) {
  const url = `http://localhost:8989/construct_graph?project_name=${projectName}`;
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(boundingBox),
  };
  console.log("params", params);

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
  projectName,
  algorithm,
  bikeRatio,
  optimizeFrequency,
  carWeight,
  bikeSafetyPenalty
) {
  const runName = "_" + bikeRatio + "_" + carWeight;
  const runNameFix = runName.replace(/\./g, "_");

  const url =
    `http://localhost:8989/optimize?` +
    `project_name=${encodeURIComponent(projectName)}` +
    `&run_name=${encodeURIComponent(runNameFix)}` +
    `&algorithm=${encodeURIComponent(algorithm)}` +
    `&bike_ratio=${encodeURIComponent(bikeRatio)}` +
    `&optimize_frequency=${encodeURIComponent(optimizeFrequency)}` +
    `&car_weight=${encodeURIComponent(carWeight)}` +
    `&bike_safety_penalty=${encodeURIComponent(bikeSafetyPenalty)}`;

  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  console.log("params optimize", params);

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
