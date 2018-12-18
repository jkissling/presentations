require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer",  "dojo/domReady!"], function(Map, MapView, FeatureLayer){
	
	var mapOptions = {
		basemap : "dark-gray"
	};
	
	var myMap = new Map(mapOptions);

	var viewOptions = {
		container: "mapDiv",
		map: myMap,
		center: [8.22670, 46.80136], // Lon/ Lat
		zoom: 5
	}
	var mapView = new MapView(viewOptions)

	// Options of the FeatureLayer
	var featureLayerOptions = {
		url: "//services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Earthquakes_Since_1970/FeatureServer/0",
		outFields: ["Date_", "Magnitude"]
	};
	
	// Create FeatureLayer --> Load the FeatureLayer Module
	var featureLayer = new FeatureLayer(featureLayerOptions);
	// Add FeatureLayer to Map
	myMap.add(featureLayer);
});

