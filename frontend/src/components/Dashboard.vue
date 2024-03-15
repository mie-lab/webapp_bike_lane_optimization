<template>
  <div class="dashboard-container">
    <div class="dashboard-navigation bg-darkgrey" @click="toggleDashboard">
      <i
        :class="
          dashboardStatus ? 'fa-solid fa-angle-right' : 'fa-solid fa-angle-left'
        "
      ></i>
    </div>
    <div v-show="dashboardStatus" class="dashboard-content bg-lightgrey">
      <h1 class="text-pink">Dashboard</h1>
      <p class="text-blue">Dashboard content goes here</p>

      <!-- Display all results -->
      <div v-for="(result, index) in results" :key="index">
        <p>Project Name: {{ result.project_name }}</p>
        <p>Expected Runtime: {{ result.expected_runtime }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useResultsStore } from '../stores/algorithmResultsStore.js';

export default {
  name: "Dashboard",
  data() {
    return {
      dashboardStatus: false,
    };
  },
  computed: {
    results() {
      // Fetch results from the store
      const resultsStore = useResultsStore();
      return resultsStore.results;
    }
  },
  methods: {
    toggleDashboard() {
      this.dashboardStatus = !this.dashboardStatus;
    },
    // Your methods go here
  },
  mounted() {
    
    // Code to run when the component is mounted goes here
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex; 
  height: 100vh; 
  position: absolute;
  right: 0;
}

.dashboard-navigation {
  background-color: rgba(149, 149, 149, 0.5);
  height: 100%; 
  width: 20px; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  flex-direction: column; 
  cursor: pointer; 
}

.dashboard-content {
  flex-grow: 1;
  width: 300px;
}
.close-open {
  background-color: #e16ece;
}

.angle-div {
  z-index: 10;
  background-color: red;
}
</style>
