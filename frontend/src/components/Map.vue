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

export default {
  name: "Map",
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

    // Mapbox custom map
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWlzY2hhYmNraGciLCJhIjoiY2p1Zm4xYjZhMGRrNjN5cGdxemxqaGdkNiJ9.jc7oGXFR8YcFJQTTEeXYEg";

    const mapboxmaps = {
      bright: "mapbox://styles/mischabckhg/cltifweha00dh01pkehdc2de1",
      dark: "mapbox://styles/mischabckhg/cltiglf9g00an01qwbinn48w5",
    };

    this.$nextTick(() => {
      var map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: mapboxmaps.dark,
        center: [8.5417, 47.3769], // Zurich's coordinates
        zoom: 12, // Adjust zoom level to your preference
      });
    });
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
