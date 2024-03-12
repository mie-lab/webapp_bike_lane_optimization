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
          @input="setTimeWeighting($event.target.value)"
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
          @input="setLaneAllocation($event.target.value)"
        />
      </div>
      <p>Chosen Value in percent: {{ laneAllocation }} %</p>
      <br />
      <button @click="runOptimization">Run </button>
    </div>
  </div>
</template>

<script>
import { runOptimization } from "../scripts/api.js";
import { useInputStore } from "../stores/usertInputStore.js";

export default {
  setup () {
      const { timeWeighting, laneAllocation, boundingBox } = useInputStore();
     

      // Return the variables and methods needed in the template
      return {
        laneAllocation,
        timeWeighting,
       
      };
    },
    
  name: "UserInput",
  
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

.slider {
  width: 80%;
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: var(--darkgrey-bg); /* Use light grey background color */
  border-radius: 5px;
  outline: none;
}

/* Style for slider thumb (handle) */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--pink-color); /* Use pink color for slider thumb */
  border-radius: 50%;
  cursor: pointer;
}

/* Style for slider thumb (handle) when hovered */
.slider:hover::-webkit-slider-thumb {
  background: var(--pink-color); /* Change to blue color when hovered */
}

/* Style for slider thumb (handle) when active (clicked and dragged) */
.slider:active::-webkit-slider-thumb {
  background: var(--blue-color); /* Change to dark grey color when active */
}
</style>
