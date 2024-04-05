<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script>
import "ol/ol.css";
import proj4 from "proj4";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { enableDrawRectangle, onDrawCreate } from "../scripts/draw.js";
import { userInputStore } from "../stores/userInputStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { mapStore } from "../stores/mapStore.js";

// Define projection definitions
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs"); // WGS84
proj4.defs(
  "EPSG:2056",
  "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"
);

// Function to convert coordinates from EPSG:4326 to EPSG:2056
function convertCoordinatesTo2056(coordinates) {
  return coordinates.map((coord) => proj4("EPSG:4326", "EPSG:2056", coord));
}

export default {
  name: "Map",
  data() {
    return {
      map: null,
      draw: null,
      rectangleCoordinates: null,
    };
  },
  mounted() {
    const inputStore = userInputStore();
    const statusStore = statusVariablesStore();

    // Mapbox custom map (https://account.mapbox.com)
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWlzY2hhYmNraGciLCJhIjoiY2p1Zm4xYjZhMGRrNjN5cGdxemxqaGdkNiJ9.jc7oGXFR8YcFJQTTEeXYEg";

    const mapboxmaps = {
      bright: "mapbox://styles/mischabckhg/cltifweha00dh01pkehdc2de1",
      dark: "mapbox://styles/mischabckhg/cltiglf9g00an01qwbinn48w5",
    };

    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: mapboxmaps.dark,
      center: [8.5417, 47.3769], // Zurich's coordinates
      zoom: 12, // Adjust zoom level to your preference
    });

    const mapStoreInstance = mapStore();
    mapStoreInstance.setMap(this.map);

    this.map.on("draw.create", (event) => {
      onDrawCreate(event, this);
      if (statusStore.drawingRectangleEnabled) {
        statusStore.toggleDrawingRectangleEnabled();
      }
      if (statusStore.drawingPolygonEnabled) {
        statusStore.toggleDrawingPolygonEnabled();
      }

      this.saveBoundingBox(event.features[0].geometry.coordinates[0]);
    });
    this.map.on("draw.update", (event) => {
      onDrawCreate(event, this);
      this.saveBoundingBox(event.features[0].geometry.coordinates[0]);
    });
  },
  methods: {
    enableDrawRectangle() {
      enableDrawRectangle(this.drawRectangleObject);
    },

    saveBoundingBox(boundingBox) {
      const coordinatesWithoutLast = boundingBox.slice(0, -1); // don't save the last point
      const convertedCoordinates = convertCoordinatesTo2056(
        coordinatesWithoutLast
      ); // transform coordinates to EPSG:2056

      const inputStore = userInputStore();
      inputStore.setBoundingBox(convertedCoordinates);
    },
  },
  computed: {
    mapDrawInstance() {
      return this.drawRectangleObject;
    },
  },
};
</script>

<style scoped>
.map-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
.enable {
  position: absolute;
  top: 10px;
  left: 800px;
  z-index: 10;
}
</style>
