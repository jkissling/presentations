require(["esri/Map", "esri/views/MapView", "dojo/domReady!"], function(Map, MapView){
	
	var mapOptions = {
		basemap : "topo"
	};
	
	var myMap = new Map(mapOptions);

	var viewOptions = {
		container: "mapDiv",
		map: myMap
	}
	var mapView = new MapView(viewOptions)
});
