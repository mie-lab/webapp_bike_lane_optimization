<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj"; // Import the fromLonLat function
import { XYZ } from "ol/source";
import olms from "ol-mapbox-style";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxGLDrawRectangleDrag from "mapboxgl-draw-rectangle-drag";
import { enableDraw, onDrawCreate } from "../scripts/draw.js";
import { userInputStore } from "../stores/userInputStore.js";

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
    /*
    // basi OSM map
    new Map({
      target: this.$refs.mapContainer,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([8.5417, 47.3769]), // Convert Zurich's coordinates to EPSG:3857
        zoom: 12, // Adjust zoom level to your preference
      }),
    });

    // Maptile or Geoapify custom maps
    const styleUrl = `https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=3b026fe01d6e4a9ca7a656c8c184708b`; //`https://api.maptiler.com/maps/b6c446fe-e69d-4ba7-aaa2-ff9d9a986edd/style.json?key=0dJLMrCXtW7PeQcQWx8a`;

    const map = new Map({
      target: this.$refs.mapContainer,
      view: new View({
        center: fromLonLat([8.5417, 47.3769]), // Convert Zurich's coordinates to EPSG:3857
        zoom: 12, // Adjust zoom level to your preference
      }),
    });

    olms(map, styleUrl);*/

    // Mapbox custom map (https://account.mapbox.com)
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWlzY2hhYmNraGciLCJhIjoiY2p1Zm4xYjZhMGRrNjN5cGdxemxqaGdkNiJ9.jc7oGXFR8YcFJQTTEeXYEg";

    const mapboxmaps = {
      bright: "mapbox://styles/mischabckhg/cltifweha00dh01pkehdc2de1",
      dark: "mapbox://styles/mischabckhg/cltiglf9g00an01qwbinn48w5",
    };

    /*
    // working polygon draw
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: "draw_polygon",
    });*/

    // MapboxGL Draw
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      modes: {
        ...MapboxDraw.modes,
        draw_rectangle_drag: mapboxGLDrawRectangleDrag,
      },
    });

    const inputStore = userInputStore();
    inputStore.setDraw(this.draw);

    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: mapboxmaps.dark,
      center: [8.5417, 47.3769], // Zurich's coordinates
      zoom: 12, // Adjust zoom level to your preference
    });

    // Add draw control to map
    this.map.addControl(this.draw, "top-left");

    // Listen for draw.create event
    this.map.on("draw.create", (event) => {
      onDrawCreate(event, this);
      this.saveBoundingBox(event.features[0].geometry.coordinates[0]);
    });
  },
  methods: {
    enableDraw() {
      enableDraw(this.draw);
    },
    saveBoundingBox(boundingBox) {
      const InputStore = userInputStore();
      InputStore.setBoundingBox(boundingBox);
      console.log(boundingBox);
    },
  },
  computed: {
    mapDrawInstance() {
      return this.draw;
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
../stores/userInputStore.js
