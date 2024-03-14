<template>
  <div>
    <h1 class="text-pink">User Input</h1>
    <div class="user-input-container">
      <h2 class="text-blue">Car travel time weighting</h2>
      <div class="slide-container">
        <input
          class="slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="timeWeighting"
          @click="setTimeWeight(timeWeighting)"
        />
      </div>
      <p>Chosen weighting: {{ timeWeighting }}</p>
      <br />
      <h2 class="text-blue">Allocation of lanes</h2>
      <div class="slide-container">
        <input
          class="slider"
          type="range"
          min="0"
          max="100"
          v-model="laneAllocation"
          @click="setLaneAllocation(laneAllocation)"
        />
      </div>
      <p>Chosen Value in percent: {{ laneAllocation }} %</p>
      <br />
      <div class="button-container">
        <button
          :class="{
            enablepolygon: statusStore.drawingPolygonEnabled,
            disablepolygon: !statusStore.drawingPolygonEnabled,
          }"
          @click="enableDrawPolygon"
          class="draw-button"
        >
          <i class="fa-solid fa-draw-polygon"></i>
        </button>
        <button
          :class="{
            enablerectangle: statusStore.drawingRectangleEnabled,
            disablerectangle: !statusStore.drawingRectangleEnabled,
          }"
          @click="enableDrawRectangle"
          class="draw-button"
        >
          <img
            class="draw-square-icon"
            src="../assets/draw-square.svg"
            alt="Draw Polygon"
          />
        </button>
      </div>
      <br />
      <br />
      <button @click="runConstructGraph">Run</button>
    </div>
  </div>
</template>

<script>
import { runConstructGraph, runOptimization } from "../scripts/api.js";
import { userInputStore } from "../stores/userInputStore.js";
import {
  enableDrawRectangle,
  enableDrawPolygon,
  onDrawCreate,
} from "../scripts/draw.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { mapStore } from "../stores/mapStore.js";
import {
  addDrawToMap,
  removeDrawFromMap,
  createDrawRectangleObject,
  createDrawPolygonObject,
} from "../scripts/draw.js";

export default {
  name: "UserInput",
  setup() {
    const statusStore = statusVariablesStore();
    return { statusStore };
  },
  data() {
    return {
      timeWeighting: 0.7,
      laneAllocation: 10,
    };
  },
  methods: {
    enableDrawRectangle() {
      const userInput = userInputStore();
      const statusStore = statusVariablesStore();
      const mapStoreInstance = mapStore();

      // Draw-Rectanlge Object
      if (!mapStoreInstance.drawRectangleObject) {
        this.drawRectangleObject = createDrawRectangleObject();
        mapStoreInstance.setDrawRectangle(this.drawRectangleObject);
      }

      const drawObjectRectangle = mapStoreInstance.drawRectangleObject;
      const drawObjectPolygon = mapStoreInstance.drawPolygonObject;
      const mapObject = mapStoreInstance.map;

      if (drawObjectRectangle) {
        if (drawObjectPolygon) {
          removeDrawFromMap(mapObject, drawObjectPolygon);
          mapStoreInstance.setDrawPolygon(null);
        }
        if (mapStoreInstance.lastControl !== "draw-rectangle") {
          addDrawToMap(mapObject, drawObjectRectangle);
        }
        drawObjectRectangle.deleteAll();
        enableDrawRectangle(drawObjectRectangle);
        statusStore.toggleDrawingRectangleEnabled();
        mapStoreInstance.setLastControl("draw-rectangle");
      } else {
        console.error("Draw object not found in Pinia store.");
      }
    },
    enableDrawPolygon() {
      const userInput = userInputStore();
      const statusStore = statusVariablesStore();
      const mapStoreInstance = mapStore();

      // Draw-Polygon Object
      if (!mapStoreInstance.drawPolygonObject) {
        this.drawPolygonObject = createDrawPolygonObject();
        mapStoreInstance.setDrawPolygon(this.drawPolygonObject);
      }

      const drawObjectPolygon = mapStoreInstance.drawPolygonObject;
      const drawObjectRectangle = mapStoreInstance.drawRectangleObject;
      const mapObject = mapStoreInstance.map;

      if (drawObjectPolygon) {
        if (drawObjectRectangle) {
          removeDrawFromMap(mapObject, drawObjectRectangle);
          mapStoreInstance.setDrawRectangle(null);
        }
        if (mapStoreInstance.lastControl !== "draw-polygon") {
          addDrawToMap(mapObject, drawObjectPolygon);
        }
        drawObjectPolygon.deleteAll();
        enableDrawPolygon(drawObjectPolygon);
        statusStore.toggleDrawingPolygonEnabled();
        mapStoreInstance.setLastControl("draw-polygon");
      } else {
        console.error("Draw object not found in Pinia store.");
      }
    },
    setTimeWeight(value) {
      const InputStore = useInputStore();
      InputStore.setTimeWeighting(value);
    },
    setLaneAllocation(value) {
      const InputStore = useInputStore();
      InputStore.setLaneAllocation(value);
    },

    async runConstructGraph() {
      const coordinates = [
        [2678000.0, 1247000.0],
        [2678000.0, 1250000.0],
        [2681000.0, 1250000.0],
        [2681000.0, 1247000.0],
      ]; // Example coordinates

      try {
        const response = await runConstructGraph(coordinates, "test_elina");
        console.log("Response:", response);
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
  },
};
</script>

<style scoped>
.slider {
  width: 80%;
}
.slider:hover {
  opacity: 1;
  cursor: pointer;
}

.slider {
  width: 80%;
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: var(--darkgrey-bg);
  border-radius: 5px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--pink-color);
  border-radius: 50%;
  cursor: pointer;
}

.slider:hover::-webkit-slider-thumb {
  background: var(--pink-color);
}

.slider:active::-webkit-slider-thumb {
  background: var(--blue-color);
}

.enablerectangle {
  background-color: var(--pink-bright);
}

.disablerectangle {
  background-color: var(--pink-color);
}

.enablepolygon {
  background-color: var(--pink-bright);
}

.disablepolygon {
  background-color: var(--pink-color);
}

.button-container {
  display: flex;
  margin-left: 30px;
}

.draw-button {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  padding: 0%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.draw-square-icon {
  width: 15px;
  height: 15px;
  cursor: pointer;
}
</style>
