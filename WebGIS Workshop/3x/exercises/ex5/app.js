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
	
	// Set the Symbology/ Renderer --> Load the according Renderer Module
	var heatmapRenderer = new HeatmapRenderer({
          field: "Magnitude",
          blurRadius: 10,
          maxPixelIntensity: 250,
          minPixelIntensity: 0
        });

	// Uncomment if you like a heatmap 
    featureLayer.setRenderer(heatmapRenderer);
	
	// A Class Break Renderer
	// Also Requires SimpleMarkerSymbol 
	var defaultSymbol = new SimpleMarkerSymbol().setColor(new Color([0, 0, 0, 0.5]));
	
	var cbRenderer = new ClassBreaksRenderer(defaultSymbol, "Magnitude");
        cbRenderer.addBreak(0, 3, new SimpleMarkerSymbol().setColor(new Color([56, 168, 0, 0.5])));
        cbRenderer.addBreak(3, 5, new SimpleMarkerSymbol().setColor(new Color([139, 209, 0, 0.5])));
        cbRenderer.addBreak(5, 6, new SimpleMarkerSymbol().setColor(new Color([255, 255, 0, 0.5])));
        cbRenderer.addBreak(6, 7, new SimpleMarkerSymbol().setColor(new Color([255, 128, 0, 0.5])));
        cbRenderer.addBreak(7, Infinity, new SimpleMarkerSymbol().setColor(new Color([255, 0, 0, 0.5])));

	// // Uncomment if you like class breaks 
	//featureLayer.setRenderer(cbRenderer);
	//featureLayer.setRenderer(cbRenderer);
	
	
	
});
