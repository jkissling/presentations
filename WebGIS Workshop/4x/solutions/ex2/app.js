require(["esri/Map", "esri/views/MapView", "dojo/domReady!"], function(Map, MapView){
	
	var mapOptions = {
		basemap : "dark-gray"
	};
	
	var myMap = new Map(mapOptions);

	var viewOptions = {
		container: "mapDiv",
		map: myMap,
		center: [8.22670, 46.80136], // Lon/ Lat
		zoom: 9
	}
	var mapView = new MapView(viewOptions)
});
