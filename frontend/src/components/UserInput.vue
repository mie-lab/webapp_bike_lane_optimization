<template>
  <div>
    <h1 class="text-pink">User Input</h1>
    <div class="user-input-container">
      <h2 class="text-blue">Car travel time weighting</h2>
      <div class="slide-container">
        <input
          class="slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="timeWeighting"
        />
      </div>
      <p>Chosen weighting: {{ timeWeighting }}</p>
      <br />
      <h2 class="text-blue">Allocation of lanes</h2>
      <div class="slide-container">
        <input
          class="slider"
          type="range"
          min="0"
          max="100"
          v-model="laneAllocation"
        />
      </div>
      <p>Chosen Value in percent: {{ laneAllocation }} %</p>
      <br />
      <button @click="runOptimization">Run</button>
    </div>
  </div>
</template>

<script>
import { runOptimization } from "../api/api.js";

export default {
  name: "UserInput",
  data() {
    return {
      timeWeighting: 0.7,
      laneAllocation: 10,
    };
  },
  methods: {
    async runOptimization() {
      try {
        const response = await runOptimization(
          this.timeWeighting,
          this.laneAllocation
        );
        console.log("Response:", response);
        // Handle response data as needed
      } catch (error) {
        // Handle error
        console.error("Error:", error.message);
      }
    },
  },
};
</script>

<style scoped>
.slider {
  width: 80%;
}
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
  cursor: pointer;
}
</style>
