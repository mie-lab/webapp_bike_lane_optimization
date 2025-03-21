<template>
  <div class="container">
    <div class="sidebar-container"><SideBar /></div>
    <div class="map-container"><MapVue /></div>
    <div class="dashboard-container-outer"><DashboardVue /></div>
    <div class="help-details-container" v-show="isHelpDetailsVisible">
      <HelpDetails />
    </div>
    <div
      class="base-layer-switch-container"
      :style="calculateBaseLayerSwitchPosition()"
    >
      <BaseLayerSwitch />
    </div>
    <MobileWarning v-show="isMobile" />
    <div v-show="isStartingPageVisible">
      <StartingPage v-show="!isMobile" />
    </div>
  </div>
</template>

<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import SideBar from "./components/SideBar.vue";
import MapVue from "./components/Map.vue";
import DashboardVue from "./components/EvaluationDashboard.vue";
import BaseLayerSwitch from "./components/BaseLayerSwitch.vue";
import { statusVariablesStore } from "./stores/statusVariablesStore.js";
import HelpDetails from "./components/HelpDetails.vue";
import MobileWarning from "./components/MobileWarning.vue";
import StartingPage from "./components/StartingPage.vue";
import { watch, ref, onMounted, onUnmounted } from "vue";

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeUpdate", (e) => {
    const updatePaths = e.updates.map((update) => update.path);
    if (updatePaths.includes("/src/App.vue")) location.reload();
  });
}

const statusStore = statusVariablesStore();
const isHelpDetailsVisible = ref(false);
const isStartingPageVisible = ref(true);
watch(
  () => statusStore.helpDetailsPage,
  (newProcesses, oldProcesses) => {
    isHelpDetailsVisible.value = !isHelpDetailsVisible.value;
  }
);

watch(
  () => statusStore.startingPage,
  (newProcesses, oldProcesses) => {
    isStartingPageVisible.value = !isStartingPageVisible.value;
  }
);

const calculateBaseLayerSwitchPosition = () => {
  const statusStore = statusVariablesStore();
  const activeTab = statusStore.activeTab;
  // Calculate position based on active tab
  if (activeTab === "None") {
    return {
      position: "absolute",
      bottom: "20px", // Adjust as needed
      left: "70px", // Adjust as needed
    };
  } else {
    return {
      position: "absolute",
      bottom: "20px", // Adjust as needed
      left: "520px", // Adjust as needed
    };
  }
};

const isMobile = ref(window.innerHeight <= 600);

const updateIsMobile = () => {
  isMobile.value = window.innerHeight <= 600;
};
onMounted(() => {
  window.addEventListener("resize", updateIsMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateIsMobile);
});
</script>

<style scoped>
@import "./styles/app.css";
@import "./styles/appMobile.css";
</style>
