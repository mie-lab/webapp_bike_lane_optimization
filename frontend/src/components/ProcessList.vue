<template>
  <div class="running-requests-list">
    <h3>Running Requests</h3>
    <div class="list-header">
      <div class="header-item">Name</div>
      <div class="header-item"><i class="fa-solid fa-gears"></i></div>
      <div class="header-item"><i class="fa-solid fa-bicycle"></i></div>
      <div class="header-item"><i class="fa-solid fa-shield-heart"></i></div>

      <div class="header-item"><i class="fa-solid fa-car"></i></div>
      <div class="header-item">
        <i class="fa-solid fa-arrow-up-short-wide"></i>
      </div>

      <div class="header-item"><i class="fa-solid fa-spinner"></i></div>
    </div>
    <ul class="listContent">
      <li v-for="process in runningProcesses" :key="process.id">
        <div class="process-details">
          <div class="process-name">{{ process.name }}</div>
          <div class="process-algorithm">
            {{ convertAlgName(process.algorithm) }}
          </div>
          <div class="process-bike-ratio">{{ process.bike_ratio.toFixed(2) * 100 }}%</div>
          <div class="process-safety-penalty">
            {{ parseFloat(process.bike_safety_penalty).toFixed(1) }}
          </div>
          <div class="process-car_weight">
            {{ isNaN(parseFloat(process.car_weight)) ? ' -' : parseFloat(process.car_weight).toFixed(1) }} 
          </div>
          <div class="process-optimize-frequency">
            {{ isNaN(parseFloat(process.optimize_frequency)) ? ' -' : parseFloat(process.optimize_frequency).toFixed(1) }} 
          </div>
          <div class="process-status">
            <template v-if="process.status === 'pending'">
              <BeatLoader :color="'#123abc'" class="rotated-beat-loader" />
              <!-- Display ring loader -->
            </template>
            <template v-else-if="process.status === 'done'">
              <i class="fa-solid fa-check"></i>
              <!-- Display check symbol -->
            </template>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { runningProcessStore } from "../stores/processListStore.js";
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import { watch } from "vue";

export default {
  name: "ProcessList",
  components: {
    BeatLoader,
  },
  setup() {
    const runningProcessesStore = runningProcessStore();

    // watcher keeps list up to date
    watch(
      () => runningProcessesStore.runningProcesses,
      (newProcesses, oldProcesses) => {
        this.runningProcesses = newProcesses;
      }
    );

    return {
      runningProcesses: runningProcessesStore.runningProcesses,
    };
  },

  methods: {
    convertAlgName(algorithm) {
      if (algorithm.trim().toLowerCase() === "betweenness_biketime") {
        return "BB";
      } else if (algorithm.trim().toLowerCase() === "betweenness_cartime") {
        return "BC";
      } else if (algorithm.trim().toLowerCase() === "optimize") {
        return "O";
      } else {
        return algorithm;
      }
    },
  },
};
</script>

<style scoped>
@import "../styles/processList.css";
</style>
