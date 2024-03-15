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

export default {
  name: "UserInput",
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();

    return {
      statusStore,
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
    };
  },
  methods: {
    enableDrawRectangle() {
      drawRectangle();
      this.isButtonDisabled = false;
    },
    enableDrawPolygon() {
      drawPolygon();
      this.isButtonDisabled = false;
    },
    setTimeWeight(value) {
      const inputStore = useInputStore();
      inputStore.setTimeWeighting(value);
    },
    setLaneAllocation(value) {
      const inputStore = useInputStore();
      inputStore.setLaneAllocation(value);
    },

    async runConstructGraph() {
      const coordinates = [
        [2678000.0, 1247000.0],
        [2678000.0, 1250000.0],
        [2681000.0, 1250000.0],
        [2681000.0, 1247000.0],
      ]; // Example coordinates

      try {
        const response = await runConstructGraph(coordinates, "test_elina");
        console.log("Response:", response);
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
  },
};
</script>

<style scoped>
@import "../styles/UserInputStyles.css";

.disabled-button {
  background-color: #ccc; /* Grey color */
  color: #666; /* Darker grey color for text */
  cursor: not-allowed; /* Change cursor to not-allowed */
}
</style>
