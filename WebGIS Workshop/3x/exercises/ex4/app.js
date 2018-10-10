require(["esri/map", 
"esri/layers/FeatureLayer", 
"esri/InfoTemplate",
"esri/renderers/HeatmapRenderer",
"esri/symbols/SimpleMarkerSymbol",
"esri/renderers/ClassBreaksRenderer",
"esri/Color"], 
function(Map, FeatureLayer, InfoTemplate,HeatmapRenderer, SimpleMarkerSymbol,ClassBreaksRenderer, Color){
	
	var options = {
		basemap : "dark-gray",
		center: [8.22670, 46.80136], // Lon/ Lat
		zoom: 5, // Adjust Zoom Level to see "more"
		nav: true
	};
	
	var myMap = new Map("mapDiv", options);
	
	// URL of the Service
	var serviceUrl = "//services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Earthquakes_Since_1970/FeatureServer/0";
	
	// Options of the FeatureLayer
	var featureLayerOptions = {
		outFields: ["Date_", "Magnitude"],

	};
	
	// Create FeatureLayer --> Load the FeatureLayer Module
	var featureLayer = new FeatureLayer(serviceUrl, featureLayerOptions);
	// Add FeatureLayer to Map
	myMap.addLayer(featureLayer);
	
	
	// Creating a PopUp --> Load the InfoWindow
	// Attributes of the service: http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Earthquakes_Since_1970/FeatureServer/0
	var infoTemplate = new InfoTemplate(
		"Ich bin ein Titel", // Titel
		"Magnitude: ${Magnitude}" +
		"<br>" + // Neue Zeile
		"Date: ${Date_}"
		);
	
	featureLayer.setInfoTemplate(infoTemplate);
	
});
