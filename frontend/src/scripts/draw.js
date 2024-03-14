import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxGLDrawRectangleDrag from "mapboxgl-draw-rectangle-drag";
import mapboxgl from "mapbox-gl";

import { mapStore } from "../stores/mapStore.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWlzY2hhYmNraGciLCJhIjoiY2p1Zm4xYjZhMGRrNjN5cGdxemxqaGdkNiJ9.jc7oGXFR8YcFJQTTEeXYEg";

export function enableDrawRectangle(draw) {
  draw.changeMode("draw_rectangle_drag");
}

export function enableDrawPolygon(draw) {
  draw.changeMode("draw_polygon");
}

export function onDrawCreate(event, vm) {
  // Get the coordinates of the rectangle's corners
  const { features } = event;
  if (features.length > 0 && features[0].geometry.type === "Polygon") {
    const coordinates = features[0].geometry.coordinates[0];
    // First and last coordinates are the same for a closed polygon
    const rectangleCoordinates = [
      coordinates[0],
      coordinates[1],
      coordinates[2],
      coordinates[3],
    ];
    vm.rectangleCoordinates = rectangleCoordinates;
  }
  console.log("Rectangle coordinates", vm.rectangleCoordinates);
}

export function createDrawPolygonObject() {
  return new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
    },
  });
}

export function createDrawRectangleObject() {
  return new MapboxDraw({
    displayControlsDefault: false,
    modes: {
      ...MapboxDraw.modes,
      draw_rectangle_drag: mapboxGLDrawRectangleDrag,
    },
  });
}

export function addDrawToMap(map, draw) {
  const mapStoreInstance = mapStore();
  const mapControl = map.addControl(draw, "top-left");
  mapStoreInstance.setMapControl(mapControl);
}

export function removeDrawFromMap(map, draw) {
  draw.deleteAll();
  map.removeControl(draw);
}
