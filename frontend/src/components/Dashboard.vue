<template>
  <div class="dashboard-container">
    <div class="dashboard-navigation bg-darkgrey" @click="toggleDashboard">
      <i
        :class="
          statusStore.dashboard ? 'fa-solid fa-angle-right' : 'fa-solid fa-angle-left'
        "
      ></i>
    </div>
    <div v-show="statusStore.dashboard" class="dashboard-content bg-lightgrey">
      <h1 class="text-pink">Dashboard</h1>
      
      <h2 class="h2_override">{{ inputStore.projectName }} | {{ inputStore.runName }}</h2>
      <p >Bike Travel Time: {{ Math.round(ResultsStore.bikeTravelTime*100/100) }} min</p>
      <p >Car Travel Time: {{ Math.round(ResultsStore.carTravelTime*100)/100 }} min</p>
          
    </div>
  </div>
</template>

<script>
import { useResultsStore } from '../stores/algorithmResultsStore.js';
import {statusVariablesStore} from '../stores/statusVariablesStore.js';
import { userInputStore } from "../stores/userInputStore.js";

export default {
  name: "Dashboard",

  setup() {
  const ResultsStore = useResultsStore();
  const statusStore = statusVariablesStore(); 
  const inputStore = userInputStore();
  return { ResultsStore, statusStore,inputStore }; 
},
  methods: {
    toggleDashboard() {
      this.statusStore.toggleDashboard();
    },
    
  },
  data() {
    const statusStore = statusVariablesStore();
    return {
      
      dashboard: this.statusStore.dashboard,
      
    };
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
