// api.js
export async function runOptimization(timeWeighting, laneAllocation) {
  console.log("timeWeighting", timeWeighting);
  console.log("laneAllocation", laneAllocation);
  const url = "http://localhost:8989/construct_graph"; // Replace with your server URL
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeWeighting,
      laneAllocation,
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
