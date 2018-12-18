require([
	"esri/Map",
	"esri/views/MapView",
	"esri/layers/FeatureLayer",
	"esri/PopupTemplate",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/Color",
	"esri/widgets/Legend",
	"dojo/domReady!"
], function (Map, MapView, FeatureLayer, PopupTemplate, SimpleMarkerSymbol, Color, Legend) {

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

	// Options of the FeatureLayer
	var featureLayerOptions = {
		url: "//services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Earthquakes_Since_1970/FeatureServer/0",
		outFields: ["Date_", "Magnitude"]
	};

	// Create FeatureLayer --> Load the FeatureLayer Module
	var featureLayer = new FeatureLayer(featureLayerOptions);

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
	var popupTemplate = new PopupTemplate(popupOptions2);

	featureLayer.popupTemplate = popupTemplate;


	// Creating Symbols for use in a Renderer
	var defaultSymbol = new SimpleMarkerSymbol({
		color: new Color([0, 0, 0, 0.5])
	});

	var veryLowSymbol = new SimpleMarkerSymbol({
		color: new Color([56, 168, 0, 0.5])
	});

	var lowSymbol = new SimpleMarkerSymbol({
		color: new Color([139, 209, 0, 0.5])
	});

	var mediumSymbol = new SimpleMarkerSymbol({
		color: new Color([255, 255, 0, 0.5])
	});

	var highSymbol = new SimpleMarkerSymbol({
		color: new Color([255, 128, 0, 0.5])
	});

	var veryHighSymbol = new SimpleMarkerSymbol({
		color: new Color([255, 0, 0, 0.5])
	});


	// Approach 1: Creating a Renderer wit a fixed Field
	var cbRenderer = {
		type: "class-breaks", 									// Renderer type. Will be autocasted to ClassBreaksRenderer
		field: "Magnitude",   
		defaultSymbol: defaultSymbol,
		classBreakInfos: [										// Class Breaks
			{minValue: 0, maxValue: 3, symbol: veryLowSymbol},
			{minValue: 3, maxValue: 5, symbol: lowSymbol},
			{minValue: 5, maxValue: 6, symbol: mediumSymbol},
			{minValue: 6, maxValue: 7, symbol: highSymbol},
			{minValue: 7, maxValue: Infinity, symbol: veryHighSymbol}
		]
	}

	// Approach 2: Creating a Renderer using an Expression

	var cbRenderer2 = {
		type: "class-breaks", 									// Renderer type. Will be autocasted to ClassBreaksRenderer
		valueExpression: "$feature.Num_Deaths * 100",   							// Arcade Expression
		defaultSymbol: defaultSymbol,
		classBreakInfos: [										// Class Breaks
			{minValue: 0, maxValue: 100, symbol: veryLowSymbol},
			{minValue: 100, maxValue: 250, symbol: lowSymbol},
			{minValue: 250, maxValue: 500, symbol: mediumSymbol},
			{minValue: 500, maxValue: 1000, symbol: highSymbol},
			{minValue: 1000, maxValue: Infinity, symbol: veryHighSymbol}
		]
	}


	// Apply renderer
	// Change the renderer based on what approach you want to show on the map: cbRenderer, cbRenderer2
	featureLayer.renderer = cbRenderer2;

	// Add FeatureLayer to Map
	myMap.add(featureLayer);


	// Create a Legend Widget
	var legend = new Legend({
		view: mapView,
		style: "classic"  // other styles include 'card'
	});

	// Add the Widget to your MapView
	mapView.ui.add(legend, "bottom-left");
});


