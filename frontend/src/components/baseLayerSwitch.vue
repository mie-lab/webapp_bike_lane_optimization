<template>
  <div class="layer-switcher">
    <div class="button-container">
      <button
        @click="switchToDarkMap"
        class="layer-button"
        :class="{ active: activeLayer === 'dark' }"
        @mouseenter="showOverlay(true, 'Dark')"
        @mouseleave="showOverlay(false)"
      >
        <div class="button-mask">
          <img src="../assets/map_thumbnails/dark.png" alt="Dark" />
          <div v-if="showButtonOverlay" class="overlay">
            <div class="overlay-text">{{ overlayText }}</div>
          </div>
        </div>
      </button>
      <button
        @click="switchToBrightMap"
        class="layer-button"
        :class="{ active: activeLayer === 'bright' }"
        @mouseenter="showOverlay(true, 'Bright')"
        @mouseleave="showOverlay(false)"
      >
        <div class="button-mask">
          <img src="../assets/map_thumbnails/bright.png" alt="Bright" />
          <div v-if="showButtonOverlay" class="overlay">
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

      this.overlayText = text;
    },
  },
};
</script>

<style scoped>
.button-container {
  display: flex; /* Use flexbox to align buttons in a row */
  gap: 10px; /* Adjust the gap between buttons as needed */
}

.layer-button {
  position: relative;
  background-color: transparent;
  border: 2px solid white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.button-mask {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
}

.button-mask img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.checkmark-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 128, 0, 0.5); /* Transparent green background */
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkmark-container i {
  color: white; /* Icon color */
  font-size: 1em; /* Adjust icon size as needed */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3); /* Transparent gray overlay */
  display: none;
}

.overlay-text {
  color: white;
  font-size: 0.65em;
  font-weight: bold;
  margin-top: 16.5px;
}

/* Apply hover effect to the button */
.layer-button:hover .overlay {
  display: block;
}

.layer-button.active {
  border: 2px solid #b5bf9f;
}

.layer-button:hover {
  transform: scale(1.2) translateY(-5px); /* Increase the scale on hover */
  z-index: 1; /* Ensure the hovered button is above other buttons */
}

.layer-button:not(:hover) {
  transform: translateY(5px); /* Move the non-hovered buttons down */
}
</style>
