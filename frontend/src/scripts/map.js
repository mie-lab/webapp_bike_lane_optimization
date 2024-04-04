import { mapStore } from "../stores/mapStore.js";
import mapboxgl from "mapbox-gl";
import { userInputStore } from "../stores/userInputStore.js";
import proj4 from "proj4";

export function loadLayer(layerID, layerSource) {
  const mapStoreInstance = mapStore();
  const map = mapStoreInstance.map;

  if (map.getLayer(layerID)) {
    map.removeLayer(layerID);
  }

  if (map.getSource(layerSource)) {
    map.removeSource(layerSource);
  }

  const tile =
    "https://baug-ikg-gis-01.ethz.ch:8443/geoserver/GMP_EBC/wms?REQUEST=GetMap&SERVICE=WMS&layers=GMP_EBC:layername&bbox={bbox-N}&transparent=true&width=256&height=256&srs=EPSG:3857&styles=&format=image/png".replace(
      "layername",
      layerID
    );

  map.addSource(layerSource, {
    type: "raster",
    tiles: [tile],
    tileSize: 256,
  });

  map.addLayer({
    id: layerID,
    type: "raster",
    source: layerSource,
    paint: {},
  });

  const userInput = userInputStore();

  const east = userInput.boundingBox.bbox_east;
  const west = userInput.boundingBox.bbox_west;
  const north = userInput.boundingBox.bbox_north;
  const south = userInput.boundingBox.bbox_south;
  // Define EPSG:2056 and EPSG:4326 projections
  const epsg2056 =
    "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";
  const epsg4326 = "+proj=longlat +datum=WGS84 +no_defs";

  // Convert bounding box coordinates from EPSG:2056 to EPSG:4326
  const sw = proj4(epsg2056, epsg4326, [west, south]);
  const ne = proj4(epsg2056, epsg4326, [east, north]);

  // Create MapboxGL LngLat objects for the bounding box
  const swLngLat = new mapboxgl.LngLat(sw[0], sw[1]);
  const neLngLat = new mapboxgl.LngLat(ne[0], ne[1]);

  // Create MapboxGL Bounds object
  const bounds = new mapboxgl.LngLatBounds(swLngLat, neLngLat);

  map.fitBounds(bounds, {
    padding: 300, // Adjust padding as needed
    offset: [50, 0],
  });
}
