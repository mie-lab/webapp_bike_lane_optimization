<template>
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 24px"></i>
    </button>
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
          @click="setTimeWeight(timeWeighting)"
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
          @click="setLaneAllocation(laneAllocation)"
        />
      </div>
      <p>Chosen Value in percent: {{ laneAllocation }} %</p>
      <br />
      <h2 class="text-blue">Area of interest</h2>
      <div class="button-container">
        <button
          :class="{
            enablepolygon: statusStore.drawingPolygonEnabled,
            disablepolygon: !statusStore.drawingPolygonEnabled,
          }"
          @click="enableDrawPolygon"
          class="draw-button"
        >
          <i class="fa-solid fa-draw-polygon"></i>
        </button>
        <button
          :class="{
            enablerectangle: statusStore.drawingRectangleEnabled,
            disablerectangle: !statusStore.drawingRectangleEnabled,
          }"
          @click="enableDrawRectangle"
          class="draw-button"
        >
          <img
            class="draw-square-icon"
            src="../assets/draw-square.svg"
            alt="Draw Polygon"
          />
        </button>
      </div>
      <br />
      <h2 class="text-blue">Project name</h2>
      <input
        class="project-name-input"
        type="text"
        v-model="projectName"
        @input="setProjectName($event.target.value)"
      />

      <br />
      <button
        :class="{ 'disabled-button': isButtonDisabled || !projectName }"
        @click="runConstructGraph"
      >
        Run
      </button>
      <pulse-loader
        :loading="loading"
        :color="color"
        :size="size"
      ></pulse-loader>
      <ring-loader :loading="loading" :color="color" :size="size"></ring-loader>
      <bounce-loader
        :loading="loading"
        :color="color"
        :size="size"
      ></bounce-loader>
    </div>
  </div>
</template>

<script>
import { runConstructGraph, runOptimization } from "../scripts/api.js";
import { userInputStore } from "../stores/userInputStore.js";
import {
  enableDrawRectangle,
  enableDrawPolygon,
  drawRectangle,
  drawPolygon,
} from "../scripts/draw.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { mapStore } from "../stores/mapStore.js";
import { useResultsStore } from "../stores/algorithmResultsStore.js";

import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import BounceLoader from "vue-spinner/src/BounceLoader.vue";

export default {
  name: "UserInput",
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const resultsStore = useResultsStore();

    return {
      statusStore,
      resultsStore,
      projectName: inputStore.projectName,
      setProjectName: inputStore.setProjectName,
    };
  },
  data() {
    const inputStore = userInputStore();
    return {
      timeWeighting: 0.7,
      laneAllocation: 10,
      isButtonDisabled: true,
      projectName: inputStore.projectName,
      color: "#3d91e5",
      size: "35px",
    };
  },
  components: {
    PulseLoader,
    RingLoader,
    BounceLoader,
  },
  methods: {
    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility(); // Toggle the visibility of the tabs using the Pinia store
    },
    enableDrawRectangle() {
      drawRectangle();
      this.isButtonDisabled = false;
    },
    enableDrawPolygon() {
      drawPolygon();
      this.isButtonDisabled = false;
    },
    setTimeWeight(value) {
      const inputStore = userInputStore();
      inputStore.setTimeWeighting(value);
    },
    setLaneAllocation(value) {
      const inputStore = userInputStore();
      inputStore.setLaneAllocation(value);
    },

    async runConstructGraph() {
      const inputStore = userInputStore();
      const resultsStore = useResultsStore();

      try {
        const response = await runConstructGraph(
          inputStore.boundingBox,
          inputStore.projectName
        );
        const result = {
          expected_runtime: response.expected_runtime,
          project_name: inputStore.projectName,
          variables: response.variables,
          internal_project_name: JSON.stringify(inputStore.boundingBox),
          runs: [],
        };
        resultsStore.addResult(result);
        console.log("Response:", result);

        // Display a confirmation dialog
        const continueOperation = window.confirm(
          `Running the algorithm will take ${result.expected_runtime.toFixed(2)} seconds. Do you want to continue?`
        );

        // Check user's response
        if (continueOperation) {
          // User clicked OK, continue with the operation
          console.log("Operation continued!");
          this.callOptimization();
        } else {
          // User clicked Cancel or closed the dialog, abort the operation
          console.log("Operation aborted!");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    },

    async callOptimization() {
      const inputStore = userInputStore();
      const resultsStore = useResultsStore();
      const project_name = inputStore.projectName;
      const algorithm = "betweenness_biketime";
      const bikeRatio = inputStore.laneAllocation;
      const carWeight = inputStore.timeWeighting;
      const bikeSafetyPenatly = 2;
      const optimizeFrequency = 30;
      try {
        const response = await runOptimization(
          project_name,
          algorithm,
          bikeRatio,
          optimizeFrequency,
          carWeight,
          bikeSafetyPenatly

        );

        const result = {
          bikeEdges: response.bike_edges,
          variables: response.run_name,
        };
        resultsStore.addRunResult(response.project_name,result);
        console.log("Response:", result);
        
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
  },
};
</script>

<style scoped>
@import "../styles/UserInputStyles.css";
@import "../styles/SideBarStyle.css";

.disabled-button {
  background-color: #ccc; /* Grey color */
  color: #666; /* Darker grey color for text */
  cursor: not-allowed; /* Change cursor to not-allowed */
}
</style>
