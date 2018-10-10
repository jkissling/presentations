require([
	"esri/Map",
	"esri/views/MapView",
	"esri/layers/FeatureLayer",
	"esri/PopupTemplate",
	"dojo/domReady!"
], function (Map, MapView, FeatureLayer, PopupTemplate) {

	var mapOptions = {
		basemap: "dark-gray"
	};

	var myMap = new Map(mapOptions);

	var viewOptions = {
		container: "mapDiv",
		map: myMap,
		center: [8.22670, 46.80136], // Lon/ Lat
		zoom: 5
	}
	var mapView = new MapView(viewOptions)

	// URL of the Service
	var serviceUrl = "//services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Earthquakes_Since_1970/FeatureServer/0";

	// Options of the FeatureLayer
	var featureLayerOptions = {
		outFields: ["Date_", "Magnitude"],

	};

	// Create FeatureLayer --> Load the FeatureLayer Module
	var featureLayer = new FeatureLayer(serviceUrl, featureLayerOptions);

	// Creating a PopUp
	// Attributes of the service: http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Earthquakes_Since_1970/FeatureServer/0

	// Approach 1: Use html to define the popup content
	var popupOptions = {
		title: "{Name}",
		content: "Magnitude: {Magnitude}" +
		"<br>" + // Neue Zeile
		"Date: {Date_}"
	};

	// Alternative 2: Creating a Table
	var popupOptions2 = {
		title: "{Name}",
		content: [{
			type: "fields",
			fieldInfos: [{
				fieldName: "Magnitude",
				label: "Magnitude",
			}]
		}, {
			type: "fields",
			fieldInfos: [{
				fieldName: "Date_",
				label: "Date",
				format: {
					dateFormat: "short-date-short-time-24"
				}
			}]
		}, {
			type: "fields",
			fieldInfos: [{
				fieldName: "Num_Deaths",
				label: "Deaths"
			}]
		}, {
			type: "fields",
			fieldInfos: [{
				fieldName: "Num_Injured",
				label: "Injured"
			}]
		}]
	};

	// Alternative 3: Using Arcade Expressions to calculate new Attributes
	var popupOptions3 = {
		title: "{Name}",
		content: [{
			type: "fields",
			fieldInfos: [{
				fieldName: "expression/magnitudetimeshundred"
			}]
		}],
		expressionInfos: [{
		  name: "magnitudetimeshundred",
		  title: "Magnitude x 100",
		  expression: "$feature.Magnitude * 100"
		}]
	};

	// Change the options based on what approach you want to show on the map: popupOptions, popupOptions2 or popupOptions3
	var popupTemplate = new PopupTemplate(popupOptions3);

	featureLayer.popupTemplate = popupTemplate;

	// Add FeatureLayer to Map
	myMap.add(featureLayer);
});


