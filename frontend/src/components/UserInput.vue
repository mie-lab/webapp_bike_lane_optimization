<template>
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 24px"></i>
    </button>
    <h1 class="text-pink">User Input</h1>
    <div v-show="!statusStore.userInputSide" class="user-input-container">
     
      <p> Create your own project and run the optimization algorithm for an area of your choice. </p>

      <h2 class="text-blue">Project name</h2>
      <input
        class="project-name-input"
        type="text"
        v-model="projectName"
        @input="setProjectName($event.target.value)"
      />

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
      

      <br />
      <button
        :class="{ 'disabled-button': isButtonDisabled || !projectName }"
        @click="toggleUserInputNextSide"
      >
        Continue
      </button>

    </div>
    <div v-show="statusStore.userInputSide"> 
      <UserInputSecondPageVue />
    </div>

  </div>
</template>

<script>
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
import UserInputSecondPageVue from './UserInputSecondPage.vue';

export default {
  name: "UserInput",
  components: {
    UserInputSecondPageVue,
  },
  setup() {
    const statusStore = statusVariablesStore();
    const inputStore = userInputStore();
    const resultsStore = useResultsStore();

    return {
      statusStore,
      resultsStore,
      projectName: inputStore.projectName,
      setProjectName: inputStore.setProjectName,
      continue: statusStore.userInputSide,
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
      continue: statusStore.userInputSide,
      
    };
  },

  methods: {
    
    toggleUserInputNextSide(){
      const statusStore = statusVariablesStore();
      statusStore.changeUserInputSide();
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
