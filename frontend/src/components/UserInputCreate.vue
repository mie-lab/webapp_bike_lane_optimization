<template>
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i
        class="fa-solid fa-times"
        style="font-size: 20px; color: var(--darkgrey-bg)"
      ></i>
    </button>
    <div v-show="!statusStore.runPage" class="user-input-container">
      <p class="info-text">
        Create your own project and run the optimization algorithm for an area
        of your choice.
      </p>

      <h3 class="text-blue">Project name</h3>
      <input
        class="project-name-input"
        type="text"
        v-model="projectName"
        @input="setProjectName($event.target.value)"
      />

      <h3 class="text-blue">Area of interest</h3>
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

      <br />
      <button @click="toggleUserInputPreviousSide" class="back-button">
        Back
      </button>
      <button
        :class="{ 'disabled-button': isButtonDisabled || !projectName }"
        @click="createProject"
      >
        Continue
      </button>
    </div>
    <div v-show="statusStore.runPage">
      <UserInputRun />
    </div>
  </div>
</template>

<script>
import { userInputStore } from "../stores/userInputStore.js";
import {
  drawRectangle,
  drawPolygon,
  removeDrawFromMap,
} from "../scripts/draw.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { mapStore } from "../stores/mapStore.js";
import UserInputRun from "./UserInputRun.vue";
import { create } from "ol/transform";
import { loadLayer } from "../scripts/map.js";
import { createView, runConstructGraph } from "../scripts/api.js";

export default {
  name: "UserInputCreate",
  components: {
    UserInputRun,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();

    return {
      statusStore,
      projectName: inputStore.projectName,
      setProjectName: inputStore.setProjectName,
      continue: statusStore.runPage,
    };
  },
  data() {
    const inputStore = userInputStore();
    const statusStore = statusVariablesStore();
    return {
      isButtonDisabled: true,
      projectName: inputStore.projectName,
      color: "#da5268",
      size: "25px",
      continue: statusStore.runPage,
    };
  },

  methods: {
    async createProject() {
      const mapStoreInstance = mapStore();
      const drawObjectRectangle = mapStoreInstance.drawRectangleObject;
      const drawObjectPolygon = mapStoreInstance.drawPolygonObject;
      const mapObject = mapStoreInstance.map;
      removeDrawFromMap(mapObject, drawObjectRectangle);

      this.toggleUserInputNextSide();
      const inputStore = userInputStore();

      try {
        const response = await runConstructGraph(
          inputStore.boundingBox,
          inputStore.projectName
        );
        //console.log("Construct Graph respose: ", response);

        inputStore.setProjectID(response.project_id);
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await createView(inputStore.projectID, 1, "v_bound");

        loadLayer("v_bound", "wms_bound");
      } catch (error) {
        console.error(error);
      }
    },

    toggleUserInputNextSide() {
      const statusStore = statusVariablesStore();
      statusStore.toggleRunPage();
    },
    toggleUserInputPreviousSide() {
      const statusStore = statusVariablesStore();
      statusStore.toggleCreatePage();
      statusStore.toggleLoadPage();
    },
    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility();
    },
    enableDrawRectangle() {
      drawRectangle();
      this.isButtonDisabled = false;
    },
    enableDrawPolygon() {
      drawPolygon();
      this.isButtonDisabled = false;
    },
  },
};
</script>

<style scoped>
@import "../styles/UserInputStyles.css";
@import "../styles/SideBarStyle.css";

.disabled-button {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
</style>
