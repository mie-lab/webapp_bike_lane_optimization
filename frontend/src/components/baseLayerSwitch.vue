<template>
  <div class="layer-switcher">
    <div class="button-container">
      <!-- dark base map button -->  
      <button
        @click="switchToDarkMap"
        class="layer-button"
        :class="{ active: activeLayer === 'dark' }"
        @mouseenter="showOverlay(true, 'Dark')"
        @mouseleave="showOverlay(false)"
      >
        <div class="button-mask">
          <img src="../assets/map_thumbnails/dark.png" alt="Dark" />
          <div v-if="showButtonOverlay && hoveredButton === 'Dark'" class="overlay">
            <div class="overlay-text">{{ overlayText }}</div>
          </div>
        </div>
      </button>
      <!-- bright base map button -->  
      <button
        @click="switchToBrightMap"
        class="layer-button"
        :class="{ active: activeLayer === 'bright' }"
        @mouseenter="showOverlay(true, 'Bright')"
        @mouseleave="showOverlay(false)"
      >
        <div class="button-mask">
          <img src="../assets/map_thumbnails/bright.png" alt="Bright" />
          <div v-if="showButtonOverlay && hoveredButton === 'Bright'" class="overlay">
            <div class="overlay-text">{{ overlayText }}</div>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
<script>
import { mapStore } from "../stores/mapStore.js";
export default {
  name: "BaseLayerSwitch",
  data() {
    const mapStoreInstance = mapStore();
    return {
      landerskarteFrabigWMS: null,
      swisstopoTLMMap: null,
      terrainActive: false,
      showButtonOverlay: false,
      overlayText: "",
      activeLayer: null,
      mapStoreInstance,
      hoveredButton:null,
    };
  },

  methods: {
    switchToDarkMap() {
      this.mapStoreInstance.setMapStyle(
        "mapbox://styles/mischabckhg/cltiglf9g00an01qwbinn48w5"
      );
      this.activeLayer = "dark";
    },
    switchToBrightMap() {
      this.mapStoreInstance.setMapStyle(
        "mapbox://styles/mischabckhg/cltifweha00dh01pkehdc2de1"
      );
      this.activeLayer = "bright";
    },
    showOverlay(value, text = "") {
      this.showButtonOverlay = value;
      this.hoveredButton = text;

      this.overlayText = text;
    },
  },
};
</script>

<style scoped>
@import "../styles/BaseLayerSwitch.css";
</style>
