<template>
  <!-- Component to create a new project -->
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <div v-show="!statusStore.runPage" class="user-input-container">
      <p class="info-text">
        Create your own project and run the optimization algorithm for an area
        of your choice.
      </p>

      <h3 class="text-blue">
        <span class="project_name_text">Project name</span>

        <span class="ring-loader-container">
          <div class="ring-loader">
            <RingLoader v-if="isLoading" :size="'80'" :color="'#123abc'" />
          </div>
        </span>
      </h3>
      <input
        class="project-name-input"
        type="text"
        v-model="projectName"
        @input="setProjectName($event.target.value)"
      />
      <p class="missing-input" v-show="nameIsEmpty">* Enter a project name!</p>

      <!-- define the area with a bounding box-->
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
            :class="{
              'draw-square-icon-active': statusStore.drawingRectangleEnabled,
            }"
            src="../assets/draw-square.svg"
            alt="Draw Polygon"
          />
        </button>
        <button
          @click="deleteDrawing"
          class="delete-button"
          :class="{ 'button-disabled': isButtonDisabled }"
        >
          <i class="fa-regular fa-trash-can"></i>
        </button>
        <p class="missing-input" v-show="boundingBoxIsEmpty">
          *Draw an area of interest!
        </p>
      </div>
      <br />

      <br />
      <!-- buttons to go back or to continue-->
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
  cancleDrawing,
} from "../scripts/draw.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { mapStore } from "../stores/mapStore.js";
import UserInputRun from "./UserInputRun.vue";
import { loadWMS } from "../scripts/map.js";
import { getBoundingBox, runConstructGraph } from "../scripts/api.js";
import { watch, ref } from "vue";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import { projectsStore } from "../stores/projectsStore.js";

export default {
  name: "UserInputCreate",
  components: {
    UserInputRun,
    RingLoader,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const drawingEnabled = ref(statusStore.drawingRectangleEnabled);

    watch(
      () => statusStore.drawingRectangleEnabled,
      (newValue, oldValue) => {
        console.log("Drawing enabled:", newValue);
        drawingEnabled.value = newValue;
      }
    );

    return {
      statusStore,
      projectName: inputStore.projectName,
      setProjectName: inputStore.setProjectName,
      continue: statusStore.runPage,
      drawingEnabled,
    };
  },
  data() {
    const inputStore = userInputStore();
    const statusStore = statusVariablesStore();
    const prjStore = projectsStore();
    return {
      isButtonDisabled: true,
      projectName: inputStore.projectName,
      color: "#da5268",
      size: "25px",
      continue: statusStore.runPage,
      isLoading: false,
      prjStore,
      nameIsEmpty: false,
      boundingBoxIsEmpty: false,
      inputStore,
      statusStore,
    };
  },

  methods: {
    async createProject() {
      this.isLoading = true;
      this.nameIsEmpty = false;
      this.boundingBoxIsEmpty = false;

      const mapStoreInstance = mapStore();
      const drawObjectRectangle = mapStoreInstance.drawRectangleObject;
      const drawObjectPolygon = mapStoreInstance.drawPolygonObject;
      const mapObject = mapStoreInstance.map;
      this.prjStore.setRuns([]);

      mapStoreInstance.setLastControl("");

      mapStoreInstance.setDrawPolygon(null);
      mapStoreInstance.setDrawRectangle(null);

      // check if project name is empty
      if (this.inputStore.projectName == "" || this.inputStore.projectName == null) {
        this.isLoading = false;
        this.nameIsEmpty = true;
        return;
      }

      // check if the user has drawn a polygon or rectangle
      if (drawObjectRectangle === null && drawObjectPolygon === null) {
        this.isLoading = false;
        this.boundingBoxIsEmpty = true;
        return;
      }

      try {
        const response = await runConstructGraph(
          this.inputStore.boundingBox,
          this.inputStore.projectName
        );

        this.inputStore.setProjectID(response.project_id);
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await getBoundingBox(this.inputStore.projectID);

        if (drawObjectRectangle !== null) {
          removeDrawFromMap(mapObject, drawObjectRectangle);
        }

        if (drawObjectPolygon !== null) {
          removeDrawFromMap(mapObject, drawObjectPolygon);
        }
        // draw the bounding box on the map
        loadWMS("v_bound", "wms_bound", this.inputStore.projectID);
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
        this.toggleUserInputNextSide();
      }
    },

    toggleUserInputNextSide() {
      this.statusStore.toggleRunPage();
      cancleDrawing();
    },
    toggleUserInputPreviousSide() {
      this.statusStore.toggleCreatePage();
      this.statusStore.toggleLoadPage();
      cancleDrawing();
      this.statusStore.setDrawingRectangle(false);
      this.statusStore.setDrawingPolygon(false);
      this.isButtonDisabled = true;
    },

    deleteDrawing() {
      cancleDrawing();
      this.isButtonDisabled = true;
      this.statusStore.setDrawingRectangle(false);
      this.statusStore.setDrawingPolygon(false);
    },

    toggleTabsVisibility() {
      this.statusStore.toggleTabsVisibility();
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
@import "../styles/UserInputStylesMobile.css";
@import "../styles/SideBarStyle.css";
@import "../styles/SideBarStyleMobile.css";

.disabled-button {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.ring-loader-container {
  position: relative;
}

.ring-loader {
  position: absolute;
  top: 4px;
  left: 8px;
}

.enablepolygon {
  background-color: var(--pink-color-selected);
  color: white;
}

.enablerectangle {
  background-color: var(--pink-color-selected);
  color: white;
}

.draw-square-icon-active {
  filter: invert(1);
}

.delete-button {
  background-color: transparent;
  color: black;
  padding: 0;
  margin: 0;
  margin-left: 5px;
}

.delete-button:hover {
  border-radius: 0;
  border-color: transparent;
  color: var(--pink-color);
}

.button-disabled {
  color: var(--darkgrey-3-bg);
  cursor: not-allowed;
}
</style>
