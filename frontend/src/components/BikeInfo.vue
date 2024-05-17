<template>
  <div class="parent-container">
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <h1 class="text-pink">E-Bike City Zurich</h1>
    <div class="sidebar-content-container">
      <p class="text-blue justified-text">
        E-Bike City is a forward-thinking urban initiative that aims to
        revolutionize transportation dynamics within city limits. At its core,
        E-Bike City is about reallocating road space to prioritize alternative
        modes of transportation such as walking, cycling, and micromobility
        options like e-bikes and e-scooters. By reclaiming 50% of road space
        traditionally occupied by parked and moving cars, E-Bike City seeks to
        create more pedestrian-friendly environments while simultaneously
        reducing traffic congestion and carbon emissions.

        <br /><br />
        More information about
        <a
          href="https://storymaps.arcgis.com/stories/f6d216846a5644728ca6c95ead55d3f0"
          target="_blank"
          class="website-link"
          >E-Bike City</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
export default {
  name: "BikeInfo",

  methods: {
    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility(); // Toggle the visibility of the tabs using the Pinia store
    },
  },
};
</script>

<style scoped>
@import "../styles/SideBarStyle.css";
@import "../styles/SideBarStyleMobile.css";

.justified-text {
  text-align: justify;
  max-width: 390px;
  word-wrap: break-word;
  padding-top: 10px;
}

.website-link {
  color: var(--blue);
}
</style>
