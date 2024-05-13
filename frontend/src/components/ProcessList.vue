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
    <ul>
      <li v-for="process in runningProcesses" :key="process.id">
        <div class="process-details">
          <div class="process-name">{{ process.name }}</div>
          <div class="process-algorithm">
            {{ convertAlgName(process.algorithm) }}
          </div>
          <div class="process-bike-ratio">{{ process.bike_ratio * 100 }}%</div>
          <div class="process-safety-penalty">
            {{ process.bike_safety_penalty }}
          </div>
          <div class="process-car_weight">{{ process.car_weight }}</div>
          <div class="process-optimize-frequency">
            {{ process.optimize_frequency }}
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

    // Use a watcher to keep the list up to date
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
.running-requests-list {
  margin-left: 30px;
}
.rotated-beat-loader {
  transform: scale(0.4) rotate(90deg);
  height: 20px;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  align-items: center;
  margin-bottom: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--black);
  margin-right: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.8em;
  color: var(--black);
  font-weight: bold;
}

.process-details {
  display: grid;
  text-align: center;
  align-items: center;
  grid-template-columns: 2.9fr 1fr 1.1fr 1.1fr 1.1fr 1.1fr 0.8fr;
}

.header-item {
  text-align: right;
}

.header-item:first-child {
  text-align: left;
}

.header-item:last-child {
  text-align: right;
}

.process-details:first-child {
  text-align: left;
}
</style>
