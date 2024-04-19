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
}

export function createDrawPolygonObject() {
  return new MapboxDraw({
    id: "drawPolygon",
    displayControlsDefault: false,
    controls: {
      polygon: true,
    },
  });
}

export function createDrawRectangleObject() {
  return new MapboxDraw({
    id: "drawRectangle",
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

  /*
  const mapStoreInstance = mapStore();
  mapStoreInstance.setDrawRectangle(null);
  mapStoreInstance.setDrawPolygon(null);*/
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
    //mapStoreInstance.setDrawPolygon(null);
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
      mapStoreInstance.setLastControl("draw-rectangle");
    }
    drawObjectRectangle.deleteAll();
    enableDrawRectangle(drawObjectRectangle);
    statusStore.toggleDrawingRectangleEnabled();
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

      mapStoreInstance.setLastControl("draw-polygon");
    }
    drawObjectPolygon.deleteAll();
    enableDrawPolygon(drawObjectPolygon);
    statusStore.toggleDrawingPolygonEnabled();
  } else {
    console.error("Draw object not found in Pinia store.");
  }
}

function checkSources() {
  const mapStoreInstance = mapStore();
  const map = mapStoreInstance.map;
  // Get the current style object
  const style = map.getStyle();

  // Check if the style object exists and contains sources
  if (style && style.sources) {
    // Get an array of source IDs
    const sourceIds = Object.keys(style.sources);

    // Log the array of source IDs
    console.log("Available sources:", sourceIds);
  } else {
    console.log("No sources available in the map style.");
  }
}

function removeLayersAndSource() {
  const mapStoreInstance = mapStore();
  const map = mapStoreInstance.map;
  // Get the map's style object
  const style = map.getStyle();

  // Check if the style object exists and contains the layers
  if (style && style.layers) {
    // Filter out layers that start with "gl-draw-..."
    const drawLayers = style.layers.filter((layer) =>
      layer.id.startsWith("gl-draw-")
    );

    // Remove each draw layer
    drawLayers.forEach((drawLayer) => {
      const layerIndex = style.layers.findIndex(
        (layer) => layer.id === drawLayer.id
      );
      if (layerIndex !== -1) {
        style.layers.splice(layerIndex, 1);
      }
    });

    // Set the updated style to the map
    map.setStyle(style);
    console.log("Draw layers removed from the map style.");
  } else {
    console.log("No layers available in the map style.");
  }

  // Check if the source exists on the map
  if (map.getSource("mapbox-gl-draw-cold")) {
    // Remove the source from the map
    map.removeSource("mapbox-gl-draw-cold");
    console.log("Source mapbox-gl-draw-cold removed from the map");
  } else {
    console.log("Source does not exist on the map");
  }

  // Check if the source exists on the map
  if (map.getSource("mapbox-gl-draw-hot")) {
    // Remove the source from the map
    map.removeSource("mapbox-gl-draw-hot");
    console.log("Source mapbox-gl-draw-hot removed from the map");
  } else {
    console.log("Source does not exist on the map");
  }
}
