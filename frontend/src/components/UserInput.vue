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
          @click= setTimeWeight(timeWeighting);
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
          @click= setLaneAllocation(laneAllocation);
        />
      </div>
      <p>Chosen Value in percent: {{ laneAllocation }} %</p>
      <br />
      <button @click="runConstructGraph">Run </button>
    </div>
  </div>
</template>


<script>
import { runConstructGraph,runOptimization } from "../scripts/api.js";
import { useInputStore } from "../stores/usertInputStore.js";

export default {
    
  name: "UserInput",
  data() {
    
    return {
      timeWeighting: 0.7,
      laneAllocation: 10,
    };
  },
  methods: {
    setTimeWeight(value){
      const InputStore = useInputStore();
      InputStore.setTimeWeighting(value);
    },
    setLaneAllocation(value){
      const InputStore = useInputStore();
      InputStore.setLaneAllocation(value);
    },

    async runConstructGraph() {
      const coordinates = [
        [2678000.0, 1247000.0],
        [2678000.0, 1250000.0],
        [2681000.0, 1250000.0],
        [2681000.0, 1247000.0]
      ]; // Example coordinates

      try {
        const response = await runConstructGraph(
          coordinates, "test_elina"
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
  opacity: 1; 
  cursor: pointer;
}

.slider {
  width: 80%;
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: var(--darkgrey-bg); 
  border-radius: 5px;
  outline: none;
}


.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--pink-color); 
  border-radius: 50%;
  cursor: pointer;
}


.slider:hover::-webkit-slider-thumb {
  background: var(--pink-color); 
}


.slider:active::-webkit-slider-thumb {
  background: var(--blue-color); 
}
</style>
