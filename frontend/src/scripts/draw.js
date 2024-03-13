// MapMethods.js
export function enableDrawRectangle(draw) {
  // Change mode to draw_rectangle_drag
  draw.changeMode("draw_rectangle_drag");
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
