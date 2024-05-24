<template>
  <div class="parent-container">
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <div class="header-container">
      <h1 class="text-pink">Project Info</h1>
      <img :src="logoImage" alt="Logo" class="logo-image" />
    </div>
    <div class="sidebar-content-container">
      
      <p class="info-text">{{ projectInfoText.text1 }}</p>
      <p class="info-text">{{ projectInfoText.text2 }}</p>
      <p class="info-text">{{ projectInfoText.contactInfo }}</p>

    </div>
  </div>
</template>

<script>
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { projectInfoText } from "../strings/projectInfoText.js";
import logoImage from "../assets/GIS-Logo_RGB.png";

export default {
  name: "ProjectInfo",
  data: () => ({
    projectInfoText,
    logoImage,
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

.logo-image {
  width: 30%;
  margin: 0 auto;
  display: block;
}
.header-container {
  display: flex;
  align-items: center; /* Optional: if you want to align items vertically */
}
</style>
