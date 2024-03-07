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

export default {
  name: "Map",
  mounted() {
    /*
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
    });*/

    const styleUrl = `https://api.maptiler.com/maps/b6c446fe-e69d-4ba7-aaa2-ff9d9a986edd/style.json?key=0dJLMrCXtW7PeQcQWx8a`;

    const map = new Map({
      target: this.$refs.mapContainer,
      view: new View({
        center: fromLonLat([8.5417, 47.3769]), // Convert Zurich's coordinates to EPSG:3857
        zoom: 12, // Adjust zoom level to your preference
      }),
    });

    olms(map, styleUrl);
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
