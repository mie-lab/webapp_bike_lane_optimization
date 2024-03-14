import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxGLDrawRectangleDrag from "mapboxgl-draw-rectangle-drag";
import mapboxgl from "mapbox-gl";

import { statusVariablesStore } from "../stores/statusVariablesStore.js";
import { mapStore } from "../stores/mapStore.js";
import { userInputStore } from "../stores/userInputStore.js";

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

export function drawRectangle() {
  const userInput = userInputStore();
  const statusStore = statusVariablesStore();
  const mapStoreInstance = mapStore();

  statusStore.setDrawingPolygon(false);

  // Draw-Rectanlge Object
  if (!mapStoreInstance.drawRectangleObject) {
    const drawRectangleObject = createDrawRectangleObject();
    mapStoreInstance.setDrawRectangle(drawRectangleObject);
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
}

export function drawPolygon() {
  const userInput = userInputStore();
  const statusStore = statusVariablesStore();
  const mapStoreInstance = mapStore();

  statusStore.setDrawingRectangle(false);

  // Draw-Polygon Object
  if (!mapStoreInstance.drawPolygonObject) {
    const drawPolygonObject = createDrawPolygonObject();
    mapStoreInstance.setDrawPolygon(drawPolygonObject);
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
}
