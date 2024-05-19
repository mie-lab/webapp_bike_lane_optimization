<template>
  <div class="parent-container">
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <h1 class="text-pink">Project Info</h1>
    <div class="sidebar-content-container">
      <p class="info-text">{{ projectInfoText.text1 }}</p>
    </div>
  </div>
</template>

<script>
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { projectInfoText } from "../strings/projectInfoText.js";

export default {
  name: "ProjectInfo",
  data: () => ({
    projectInfoText,
  }),
  methods: {
    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility();
    },
  },
};
</script>

<style scoped>
@import "../styles/SideBarStyle.css";
@import "../styles/SideBarStyleMobile.css";
</style>
