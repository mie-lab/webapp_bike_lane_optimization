<template>
  <div class="container">
    <div class="sidebar-container"><SidebarVue /></div>
    <div class="map-container"><MapVue /></div>
    <div class="dashboard-container"><DashboardVue /></div>
    <div
      class="base-layer-switch-container"
      :style="calculateBaseLayerSwitchPosition()"
    >
      <baseLayerSwitch />
    </div>
  </div>
</template>

<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import SidebarVue from "./components/Sidebar.vue";
import MapVue from "./components/Map.vue";
import DashboardVue from "./components/Dashboard.vue";
import BaseLayerSwitch from "./components/BaseLayerSwitch.vue";
import { statusVariablesStore } from "./stores/statusVariablesStore.js";

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeUpdate", (e) => {
    const updatePaths = e.updates.map((update) => update.path);
    if (updatePaths.includes("/src/App.vue")) location.reload();
  });
}

const calculateBaseLayerSwitchPosition = () => {
  const statusStore = statusVariablesStore();
  const activeTab = statusStore.activeTab;
  // Calculate position based on active tab
  if (activeTab === "None") {
    return {
      position: "absolute",
      bottom: "20px", // Adjust as needed
      left: "50px", // Adjust as needed
    };
  } else {
    return {
      position: "absolute",
      bottom: "20px", // Adjust as needed
      left: "400px", // Adjust as needed
    };
  }
};
</script>

<style scoped>
.container {
  display: flex;
  position: absolute;
  justify-content: space-between;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.map-container {
  width: 100%;
  background-color: #f0f0f0;
  position: relative;
  z-index: 0;
}
.sidebar-container {
  position: relative;
  z-index: 1;
}
</style>
