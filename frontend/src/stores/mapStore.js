/**
 * Store for managing the map and its related controls and objects.
 */

import { defineStore } from "pinia";

export const mapStore = defineStore("mapStore", {
  id: "mapStore",
  state: () => ({
    map: null,
    mapControl: null,
    mapStyle: "mapbox://styles/mischabckhg/cltiglf9g00an01qwbinn48w5",
    lastControl: "",
    drawRectangleObject: null,
    drawPolygonObject: null,
    lastDrawObject: null,
  }),
  actions: {
    setMap(map) {
      this.map = map;
    },
    setMapControl(mapControl) {
      this.mapControl = mapControl;
    },
    setMapStyle(mapStyle) {
      this.mapStyle = mapStyle;
    },
    setLastControl(control) {
      this.lastControl = control;
    },
    setDrawRectangle(drawObject) {
      this.drawRectangleObject = drawObject;
    },
    setDrawPolygon(drawObject) {
      this.drawPolygonObject = drawObject;
    },
    setLastDrawObject(drawObject) {
      this.lastDrawObject = drawObject;
    },
  },
});
