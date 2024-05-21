<template>
  <div class="parent-container">
    <button class="close-btn" @click="toggleTabsVisibility">
      <i class="fa-solid fa-times" style="font-size: 20px"></i>
    </button>
    <h1 class="text-pink">E-Bike City Zurich</h1>
    <div class="sidebar-content-container">
      <p class="info-text">{{ EBikeCityInfoText.GeneralText }}
        <br />
        More information about the 
        <a
          href="https://storymaps.arcgis.com/stories/f6d216846a5644728ca6c95ead55d3f0"
          target="_blank"
          class="link-style"
          >E-Bike City Project</a>.</p>
      <img :src="algorithmIllustration" alt="AlgorthmIllustraion" class="algo-image" />
      <p class="info-text">
        {{ EBikeCityInfoText.AlgorithmText }}
        Find out more about the 
        <a class="link-style" href="#" @click="openHelpDetails()"
            >algorithms, their parameters and the evaluation methods.</a>
      </p>
      <p class="info-text">{{ EBikeCityInfoText.AlgorithmText2 }}</p>

    </div>
  </div>
</template>

<script>
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import algorithmIllustration from "../assets/algorithm-illustration.png";
import { EBikeCityInfoText } from "../strings/EBikeCityInfoText.js";

export default {
  name: "BikeInfo",
  data: () => ({
    algorithmIllustration,
    EBikeCityInfoText,
  }),

  methods: {
    toggleTabsVisibility() {
      const statusStore = statusVariablesStore();
      statusStore.toggleTabsVisibility(); // Toggle the visibility of the tabs using the Pinia store
    },
    openHelpDetails() {
      const statusStore = statusVariablesStore();
      statusStore.toggleHelpDetailsPage();
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

.algo-image {
  width: 100%;
  margin: 0 auto;
  display: block;
}
</style>
