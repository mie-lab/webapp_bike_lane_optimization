// map.js
// --------------------------
// This file contains functions to load WFS and WMS layers on the map.

import { mapStore } from "../stores/mapStore.js";
import mapboxgl from "mapbox-gl";
import { userInputStore } from "../stores/userInputStore.js";
import proj4 from "proj4";

export async function removeLayer(layerID, layerSource) {
  const mapStoreInstance = mapStore();
  const map = mapStoreInstance.map;
  if (map.getLayer(layerID)) {
    map.removeLayer(layerID);
  }

  if (map.getSource(layerSource)) {
    map.removeSource(layerSource);
  }
}

export async function loadWFS(layerID, layerSource, projectID, runID, metricKey = null, networkType = null) {
  const mapStoreInstance = mapStore();
  const map = mapStoreInstance.map;
  var wfsURL = "";

await removeLayer("v_eval_pivoted_wfs", "wfs_eval_pivoted");
await removeLayer("v_optimized_wfs", "wfs_optimized");

  if (map.getLayer(layerID)) {
    map.removeLayer(layerID);
  }

  if (map.getSource(layerSource)) {
    map.removeSource(layerSource);
  }

  if (layerID === "v_optimized_wfs") {
    if (projectID === undefined || runID === undefined) {
      throw new Error("Project ID and Run ID are required for v_optimized_wfs");
    }

    let laneFilter = "";
    if (networkType === "Bike Network") {
      laneFilter = `;lanetype:P`;
    } else if (networkType === "Car Network") {
      laneFilter = `;lanetype:M`;
    } else {
      laneFilter = `;lanetype:ALL`;
    }

    wfsURL =
      "https://baug-ikg-gis-01.ethz.ch:8443/geoserver/GMP_EBC/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GMP_EBC:layername&outputFormat=application/json&viewparams=prj:projectID;run:runIDLANEFILTER"
        .replace("layername", layerID.replace("_wfs", ""))
        .replace("projectID", projectID)
        .replace("runID", runID)
        .replace("LANEFILTER", laneFilter);

    console.log("WFS layer loaded: ", wfsURL);
  } else if (layerID === "v_eval_pivoted_wfs") {
    if (projectID === undefined || runID === undefined) {
      throw new Error("Project ID and Run ID are required for v_eval_pivoted_wfs");
    }
  
    const viewParams = `prj:${projectID};run:${runID}`;
    wfsURL =
      `https://baug-ikg-gis-01.ethz.ch:8443/geoserver/GMP_EBC/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GMP_EBC:v_eval_pivoted&outputFormat=application/json&viewparams=${viewParams}`;
  
    console.log("WFS layer loaded: ", wfsURL);
  } else {
    wfsURL =
      "https://baug-ikg-gis-01.ethz.ch:8443/geoserver/GMP_EBC/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GMP_EBC:layername&outputFormat=application/json".replace(
        "layername",
        layerID.replace("_wfs", "")
      );
  }

  // Define projection definitions for LV95 and WGS84
  proj4.defs(
    "EPSG:2056",
    "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"
  );
  proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

  try {
    const response = await (async () => {
      return await fetch(wfsURL);
    })();

    const data = await response.json();

    // Convert GeoJSON coordinates from LV95 to WGS84
    const features = data.features.map((feature) => {
      const geometry = feature.geometry;
      const coordinates = geometry.coordinates;
      let convertedCoordinates = [];
    
      if (layerID === "v_bound") {
        convertedCoordinates = coordinates.map((ring) =>
          ring.map((point) => proj4("EPSG:2056", "EPSG:4326", point))
        );
      }
    
      if (layerID === "v_optimized_wfs" || layerID === "v_eval_pivoted_wfs") {
        convertedCoordinates = coordinates.map((point) =>
          proj4("EPSG:2056", "EPSG:4326", point)
        );
      }
    
      geometry.coordinates = convertedCoordinates;
      return feature;
    });
    

    // Update the original GeoJSON data with converted coordinates
    data.features = features;

    map.addSource(layerSource, {
      type: "geojson",
      data: data,
      generateId: true,
    });

    if (layerID == "v_bound") {
      map.addLayer({
        id: layerID,
        type: "line",
        source: layerSource,
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#AAD700",
            "#transparent",
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            5,
            20,
          ],
        },
      });
    }

    if (layerID === "v_optimized_wfs" || layerID === "v_eval_pivoted_wfs") {
      map.addLayer({
        id: layerID,
        type: "line",
        source: layerSource,
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#AAD700",
            "#FFA500",
          ],
          "line-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0,
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            5,
            1,
          ],
        },
      });
    }
  } catch (error) {
    console.error("Error loading WFS data:", error);
  }

  //----------------------TOOLTIP----------------------//

  const tooltip = createTooltip(map, layerID, layerSource, metricKey);

  map.on("mousemove", (e) => {
    if (tooltip.isOpen()) {
      tooltip.setLngLat(e.lngLat);
    }
  });

  map.on("mouseleave", layerID, () => {
    // Remove the feature state to unhighlight the feature
    map.removeFeatureState({ source: layerSource });

    tooltip.remove();
  });
}

export async function loadWMS(layerID, layerSource, projectID, runID, metricKey = null, networkType = null) {
  const mapStoreInstance = mapStore();
  const map = mapStoreInstance.map;
  var tile = "";

  // Clean up conflicting layers before adding new one
  await removeLayer("v_eval_pivoted", "wms_eval_pivoted");
  await removeLayer("v_optimized", "wms_optimized");

  if (map.getLayer(layerID)) {
    map.removeLayer(layerID);
  }

  if (map.getSource(layerSource)) {
    map.removeSource(layerSource);
  }

  if (layerID === "v_optimized") {
    if (projectID === undefined || runID === undefined) {
      throw new Error("Project ID and Run ID are required for v_optimized");
    }
  
    let laneFilter = "";
    if (networkType === "Bike Network") {
      laneFilter = `;lanetype:P`;
    } else if (networkType === "Car Network") {
      laneFilter = `;lanetype:M`; 
    } else {
      laneFilter = `;lanetype:ALL`; 
    }


    
  
    const viewParams = `prj:${projectID};run:${runID}${laneFilter}`;

  
    tile = `https://baug-ikg-gis-01.ethz.ch:8443/geoserver/GMP_EBC/wms?REQUEST=GetMap&SERVICE=WMS&layers=GMP_EBC:${layerID}&bbox={bbox-epsg-3857}&transparent=true&width=256&height=256&srs=EPSG:3857&styles=&format=image/png&viewparams=${viewParams}`;
  
    console.log("WMS layer loaded: ", tile);
  }
  
  if (layerID === "v_bound") {
    if (projectID === undefined) {
      throw new Error("Project ID is required for v_optimized");
    }
    tile =
      "https://baug-ikg-gis-01.ethz.ch:8443/geoserver/GMP_EBC/wms?REQUEST=GetMap&SERVICE=WMS&layers=GMP_EBC:layername&bbox={bbox-epsg-3857}&transparent=true&width=256&height=256&srs=EPSG:3857&styles=&format=image/png&viewparams=prj:projectID"
        .replace("layername", layerID)
        .replace("projectID", projectID);

    console.log("WMS layer loaded: ", tile);
  }
  //if (layerID !== "v_optimized" && layerID !== "v_bound") {
  //  console.log("LOADING WRONG LAYER");
  //  tile =
  //    "https://baug-ikg-gis-01.ethz.ch:8443/geoserver/GMP_EBC/wms?REQUEST=GetMap&SERVICE=WMS&layers=GMP_EBC:layername&bbox={bbox-epsg-3857}&transparent=true&width=256&height=256&srs=EPSG:3857&styles=&format=image/png".replace(
  //      "layername",
  //      layerID
  //    );
  //}
  if (layerID === "v_eval_pivoted") {
    if (projectID === undefined || runID === undefined) {
      throw new Error("Project ID and Run ID are required for v_eval_pivoted");
    }
  
    const viewParams = `prj:${projectID};run:${runID}`;
    tile = `https://baug-ikg-gis-01.ethz.ch:8443/geoserver/GMP_EBC/wms?REQUEST=GetMap&SERVICE=WMS&layers=GMP_EBC:${layerID}&bbox={bbox-epsg-3857}&transparent=true&width=256&height=256&srs=EPSG:3857&format=image/png&viewparams=${viewParams}`;
  
    if (metricKey) {
      tile += `&styles=v_eval_pivoted_${metricKey}`;
    }
  
    console.log("WMS layer loaded: ", tile);
  }
  if (layerID !== "v_optimized" && layerID !== "v_bound" && layerID !=="v_eval_pivoted") {
    console.log("LOADING WRONG LAYER");
    tile =
      "https://baug-ikg-gis-01.ethz.ch:8443/geoserver/GMP_EBC/wms?REQUEST=GetMap&SERVICE=WMS&layers=GMP_EBC:layername&bbox={bbox-epsg-3857}&transparent=true&width=256&height=256&srs=EPSG:3857&styles=&format=image/png".replace(
        "layername",
        layerID
      );
  }
  
  
  

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

  //console.log("WMS layer loaded: ", tile);

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

  console.log("Bounds: ", bounds);

  if (window.innerWidth > 768) {
    map.fitBounds(bounds, {
      padding: 300,
      offset: [50, 0],
    });
  } else {
    map.fitBounds(bounds, {});
  }
}

function createTooltip(map, layerID, layerSource, metricKey) {
  let tooltip = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  // Highlighted feature style
  const highlightedStyle = {
    "line-color": "#FFFF00", // Bright yellow color
    "line-width": 4, // Increased line width
  };

  // Original feature style
  let originalStyle;

  // Tooltip handler for v_bound layer
  if (layerID === "v_bound") {
    map.on("mouseenter", layerID, (e) => {
      const feature = e.features[0];
      originalStyle = map.getPaintProperty(layerID, "line-color");
      const coordinates = e.lngLat;

      tooltip
        .setLngLat(coordinates)
        .setHTML(`<h3>Feature</h3><p>ID: ${feature.properties.id}</p>`)
        .addTo(map);
    });

    return tooltip;
  }

  // Tooltip handler for v_optimized_wfs layer
  if (layerID === "v_optimized_wfs") {
    map.on("mouseenter", layerID, (e) => {
      const feature = e.features[0];
      console.log("Feature:", feature);

      const featureId = feature.id;

      // Highlight the feature
      map.setFeatureState(
        { source: layerSource, id: featureId },
        { hover: true }
      );
      const coordinates = e.lngLat;

      // Extract properties from the feature
      const lanetype = feature.properties.lanetype;
      const speedLimit = feature.properties.maxspeed;
      const gradient = feature.properties.gradient;
      const lanes = feature.properties.lanes;

      // Process lanetype
      let laneTypeText;
      if (lanetype === "P") {
        laneTypeText = "Bike";
      } else if (lanetype === "M>") {
        laneTypeText = "Motorized";
      } else {
        laneTypeText = "Unknown";
      }

      // Process gradient
      let gradientText;
      const roundedGradient = Math.round(gradient * 100 * 10) / 10;
      if (isNaN(roundedGradient) || roundedGradient > 1000) {
        gradientText = "Undefined";
      } else {
        gradientText = `${roundedGradient}%`;
      }

      const tableContent = `
      <h2 style="margin: 10px;">Lane Information</h2>
      <table style="width: 100%; table-layout: fixed; text-align: left; margin-left: 10px">
        <colgroup>
            <col style="width: 40%;">
            <col style="width: 60%;">
        </colgroup>
       
        <tr>
            <td><b>Lanetype:</b></td>
            <td>${laneTypeText}</td>
        </tr>
        <tr>
            <td><b>Speedlimit:</b></td>
            <td>${speedLimit}</td>
        </tr>
        <tr>
            <td><b>Gradient:</b></td>
            <td>${gradientText}</td>
        </tr>
    </table>
    `;

      // Set the HTML content with the table
      tooltip.setLngLat(coordinates).setHTML(tableContent).addTo(map);
    });

    return tooltip;
  }
  // Tooltip handler for v_eval_pivoted_wfs layer
// Tooltip handler for v_eval_pivoted_wfs layer
if (layerID === "v_eval_pivoted_wfs") {
  const inputStore = userInputStore();
  const metricLabel =
    inputStore.allMetrics.find((m) => m.key === metricKey)?.label || metricKey;

  map.on("mouseenter", layerID, (e) => {
    const feature = e.features[0];
    const featureId = feature.id;
    const coordinates = e.lngLat;

    // Highlight the feature
    map.setFeatureState(
      { source: layerSource, id: featureId },
      { hover: true }
    );

    const metricValue = feature.properties[metricKey];

    const decimals = metricKey === 'anp' ? 5 : 3;

    const tableContent = `
      <h2 style="margin: 10px;">Metric</h2>
      <table style="width: 100%; table-layout: fixed; text-align: left; margin-left: 10px">
        <colgroup>
            <col style="width: 40%;">
            <col style="width: 60%;">
        </colgroup>
        <tr>
            <td><b>${metricLabel}:</b></td>
            <td>${typeof metricValue === 'number' ? metricValue.toFixed(decimals) : "N/A"}</td>
        </tr>
      </table>
    `;

    tooltip.setLngLat(coordinates).setHTML(tableContent).addTo(map);
  });

  return tooltip;
}



  
}
