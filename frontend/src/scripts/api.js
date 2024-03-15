// api.js
export async function runConstructGraph(boundingBox,projectName) {

  const url = `http://localhost:8989/construct_graph?project_name=${projectName}`; 
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify(boundingBox),

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



export async function runOptimization(projectName, runName, algorithm, bikeRatio, optimizeFrequency, carWeight, bikeSafetyPenalty) {
  
  const url = "http://localhost:8989/optimize"; 
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_name: projectName,
      run_name: runName,
      algorithm: algorithm,
      bike_ratio: bikeRatio,
      optimize_frequency: optimizeFrequency,
      car_weight: carWeight,
      bike_safety_penalty: bikeSafetyPenalty
    }),
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

