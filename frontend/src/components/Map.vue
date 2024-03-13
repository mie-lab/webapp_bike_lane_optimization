<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { XYZ } from "ol/source";
import olms from "ol-mapbox-style";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxGLDrawRectangleDrag from "mapboxgl-draw-rectangle-drag";
import { enableDrawRectangle, onDrawCreate } from "../scripts/draw.js";
import { userInputStore } from "../stores/userInputStore.js";
import { statusVariablesStore } from "../stores/statusVariablesStore.js";

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

    // Draw Polygon Object
    this.drawPolygonObject = new MapboxDraw({
      displayControlsDefault: false,
    });
    inputStore.setDrawPolygon(this.drawPolygonObject);

    // Draw Rectanlge Object
    this.drawRectangleObject = new MapboxDraw({
      displayControlsDefault: false,
      modes: {
        ...MapboxDraw.modes,
        draw_rectangle_drag: mapboxGLDrawRectangleDrag,
      },
    });
    inputStore.setDrawRectangle(this.drawRectangleObject);

    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: mapboxmaps.dark,
      center: [8.5417, 47.3769], // Zurich's coordinates
      zoom: 12, // Adjust zoom level to your preference
    });

    this.map.addControl(this.drawRectangleObject, "top-left");
    //this.map.addControl(this.drawPolygonObject, "top-left");

    this.map.on("draw.create", (event) => {
      onDrawCreate(event, this);
      statusStore.toggleDrawingRectangleEnabled();
      this.saveBoundingBox(event.features[0].geometry.coordinates[0]);
    });
  },
  methods: {
    enableDrawRectangle() {
      enableDrawRectangle(this.drawRectangleObject);
    },
    saveBoundingBox(boundingBox) {
      const inputStore = userInputStore();
      inputStore.setBoundingBox(boundingBox);
      console.log(boundingBox);
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
