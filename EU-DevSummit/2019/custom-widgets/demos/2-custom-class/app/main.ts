import Map  from "esri/Map";
import MapView from "esri/views/MapView";

//----------------
//  map setup
//----------------

const map = new Map({
  basemap: "streets-vector"
});

const view = new MapView({
  map,
  container: "viewDiv",
  center: [13.404954, 52.520008],
  zoom: 15
});
