require(["esri/map", 
"esri/layers/FeatureLayer", 
"esri/InfoTemplate",
"esri/renderers/HeatmapRenderer",
"esri/symbols/SimpleMarkerSymbol",
"esri/renderers/ClassBreaksRenderer",
"esri/Color",
"esri/dijit/Legend",
"esri/dijit/LayerList"
], 
function(Map, FeatureLayer, InfoTemplate,HeatmapRenderer, SimpleMarkerSymbol,ClassBreaksRenderer, Color,Legend,LayerList){
	
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
    // featureLayer.setRenderer(heatmapRenderer);
	
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
	featureLayer.setRenderer(cbRenderer);
	
	// Listening if a Layer is added to the Map
	myMap.on("layers-add-result", function () {
		
		// Extracting the Layer information of our FeatureLayer
		var layerInfo = [{layer: featureLayer, title: featureLayer.name}]

		// Creating our Legend
		// Reference the Element you created in the Index.html (Don't forget to style the Element in app.css)
		var legendDijit = new Legend({
			map: myMap,
			layerInfos: layerInfo
			}, "legendDiv");
		legendDijit.startup();
		
		// Create a Layer Listening
		// Reference the Element you created in the Index.html
		var layerList = new LayerList({
           map: myMap,
		   showLegend: true,
        },"layerList");
        layerList.startup();
    });
	
	// Add FeatureLayer to Map
	myMap.addLayers([featureLayer]);
	
	// Adding a Zoom Listener to our map
	// Get the current Zoom Level of the map
	// Toggle of FeatureLayer if Zoom Level > 8
	myMap.on("zoom", function() {
		var zoomLevel = myMap.getZoom();
		if (zoomLevel > 8){
			featureLayer.hide();
		} else {
			featureLayer.show();
		}
	})
	
	
	
	
});
