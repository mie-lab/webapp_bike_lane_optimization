<template>
    <div>
      <UserInputDashboard v-if="DashboardMode === 'UserInput'" />
      <EvaluationDashboard v-else-if="DashboardMode === 'Evaluation'" />
    </div>
  </template>
  
  <script>
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
  import UserInputDashboard from "../components/UserInputDashboard.vue";
  import EvaluationDashboard from "../components/EvaluationDashboard.vue";
  
  export default {
    name: "Dashboard",
    components: {
      UserInputDashboard,
      EvaluationDashboard,
    },
    computed: {
      DashboardMode() {
        return statusVariablesStore().DashboardMode;
      },
    },
  };
  </script>
  