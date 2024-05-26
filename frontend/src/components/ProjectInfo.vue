<template>
  <div class="parent-container">
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <div class="header-container">
      <h1 class="text-pink">Project Info</h1>
    </div>
    <div class="sidebar-content-container">
      <p class="info-text">{{ projectInfoText.text1 }}</p>
      <p class="info-text">{{ projectInfoText.text2 }}</p>
      <p class="info-text">{{ projectInfoText.contactInfo }}</p>
      <div class="logo-container">
        <img :src="logoETH" alt="Logo" class="logo-image" />
        <img :src="logoGeoInformation" alt="Logo" class="logo-image" />
      </div>
    </div>
  </div>
</template>

<script>
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { projectInfoText } from "../strings/projectInfoText.js";
import logoGeoInformation from "../assets/GIS-Logo_RGB.png";
import logoETH from "../assets/eth_logo_kurz_pos.png";

export default {
  name: "ProjectInfo",
  data: () => ({
    projectInfoText,
    logoGeoInformation,
    logoETH,
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
.logo-container {
  display: flex;
  justify-content: left;
  margin-right: 20%;
}
.logo-image {
  width: 30%;
  margin: 0;
  display: block;
}
.header-container {
  display: flex;
  align-items: center; /* Optional: if you want to align items vertically */
}
</style>
