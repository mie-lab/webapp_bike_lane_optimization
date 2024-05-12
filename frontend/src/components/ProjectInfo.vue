<template>
  <div>
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <h1 class="text-pink">Project Info</h1>
    <div class="sidebar-content-container">
      <p class="text-blue">Project info goes here</p>
    </div>
  </div>
</template>

<script>
import { statusVariablesStore } from "../stores/statusVariablesStore.js";

export default {
  name: "ProjectInfo",
  data() {
    return {
      // Your data properties go here
    };
  },
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
</style>
