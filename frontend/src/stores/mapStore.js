import { defineStore } from "pinia";

export const mapStore = defineStore("mapStore", {
  id: "mapStore",
  state: () => ({
    map: null,
    mapControl: null,
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
