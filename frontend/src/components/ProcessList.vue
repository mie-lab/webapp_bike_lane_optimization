<template>
  <div class="running-requests-list">
    <h3>Running Requests</h3>
    <div class="list-header">
      <div class="header-item">Name</div>
      <div class="header-item"><i class="far fa-clock"></i></div>
      <div class="header-item"><i class="fa-solid fa-lines-leaning"></i></div>
      <div class="header-item"><i class="fa-solid fa-spinner"></i></div>
    </div>
    <ul>
      <li v-for="process in runningProcesses" :key="process.id">
        <div class="process-details">
          <div class="process-name">{{ process.name }}</div>
          <div class="process-bike-ratio">{{ process.bike_ratio }}</div>
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
        console.log("Running processes updated:", newProcesses);
        // You can update any local state or computed property here
        // For example:
        this.runningProcesses = newProcesses;
      }
    );

    return {
      runningProcesses: runningProcessesStore.runningProcesses,
    };
  },
};
</script>

<style scoped>
.rotated-beat-loader {
  transform: scale(0.4) rotate(90deg); /* Rotate the loader by 90 degrees */
  height: 20px; /* Adjust the size as needed */
}

.running-requests-list {
  /* Your existing styles */
}

.list-header {
  margin-left: 30px;
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr; /* Adjusted grid template columns */
  align-items: center; /* Center items vertically */
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  margin-right: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.8em;
  color: var(--black);
  font-weight: bold;
}

.process-details {
  display: grid;
  text-align: left;
  align-items: center;
  grid-template-columns: 5fr 1.4fr 1.4fr 0.5fr;
}

.header-item {
  padding: 5px;
  text-align: right; /* Center the icons horizontally */
}

.header-item:first-child {
  text-align: left; /* Align the text to the left in the first column */
}

.header-item:last-child {
  text-align: right; /* Align the text to the right in the last column */
}
</style>