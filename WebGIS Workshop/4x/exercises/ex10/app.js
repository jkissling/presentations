require([
	"esri/Map",
	"esri/views/MapView",
	"esri/views/SceneView",
	"esri/layers/FeatureLayer",
	"esri/PopupTemplate",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/Color",
	"esri/widgets/Legend",
	"esri/widgets/LayerList",
	"esri/core/watchUtils",
	"dojo/domReady!"
], function (Map, MapView, SceneView, FeatureLayer, PopupTemplate, SimpleMarkerSymbol, Color, Legend, LayerList, watchUtils) {

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


	var sceneViewOptions = {
		container: "sceneDiv",
		map: myMap,
		center: [8.22670, 46.80136], // Lon/ Lat
		zoom: 5
	}
	var sceneView = new SceneView(sceneViewOptions)

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
			{ minValue: 0, maxValue: 3, symbol: veryLowSymbol },
			{ minValue: 3, maxValue: 5, symbol: lowSymbol },
			{ minValue: 5, maxValue: 6, symbol: mediumSymbol },
			{ minValue: 6, maxValue: 7, symbol: highSymbol },
			{ minValue: 7, maxValue: Infinity, symbol: veryHighSymbol }
		]
	}

	// Approach 2: Creating a Renderer using a Function
	function totalHarmedPersons(feature) {
		var deaths = feature.attributes.Num_Deaths || 0;
		var injured = feature.attributes.Num_Injured || 0;
		return deaths + injured
	}

	var cbRenderer2 = {
		type: "class-breaks", 									// Renderer type. Will be autocasted to ClassBreaksRenderer
		field: totalHarmedPersons,   							// Assigning our function as field
		defaultSymbol: defaultSymbol,
		classBreakInfos: [										// Class Breaks
			{ minValue: 0, maxValue: 10, symbol: veryLowSymbol },
			{ minValue: 10, maxValue: 25, symbol: lowSymbol },
			{ minValue: 25, maxValue: 50, symbol: mediumSymbol },
			{ minValue: 50, maxValue: 100, symbol: highSymbol },
			{ minValue: 100, maxValue: Infinity, symbol: veryHighSymbol }
		]
	}

	// Approach 3: Creating a Renderer using an Expression
	function totalHarmedPersons(feature) {
		var deaths = feature.attributes.Num_Deaths || 0;
		var injured = feature.attributes.Num_Injured || 0;
		return deaths + injured
	}

	var cbRenderer3 = {
		type: "class-breaks", 									// Renderer type. Will be autocasted to ClassBreaksRenderer
		valueExpression: "$feature.Num_Deaths * 100",   							// Arcade Expression
		defaultSymbol: defaultSymbol,
		classBreakInfos: [										// Class Breaks
			{ minValue: 0, maxValue: 100, symbol: veryLowSymbol },
			{ minValue: 100, maxValue: 250, symbol: lowSymbol },
			{ minValue: 250, maxValue: 500, symbol: mediumSymbol },
			{ minValue: 500, maxValue: 1000, symbol: highSymbol },
			{ minValue: 1000, maxValue: Infinity, symbol: veryHighSymbol }
		]
	}


	// Apply renderer
	// Change the renderer based on what approach you want to show on the map: cbRenderer, cbRenderer2
	featureLayer.renderer = cbRenderer3;

	// Add FeatureLayer to Map
	myMap.add(featureLayer);


	// Create a Legend Widget
	var legend = new Legend({
		view: mapView,
		style: "classic"  // other styles include 'card'
	});

	// Add the Widget to your MapView
	mapView.ui.add(legend, "bottom-left");


	// Create a LayerList Widget
	var layerList = new LayerList({
		view: mapView,
		listItemCreatedFunction: function (event) {							// Optional: Define Custom Actions
			
			// The event object contains properties of the
			// layer in the LayerList widget.
			var item = event.item;

			if (item.title === "Earthquakes Since 1970 - Earthquakes1970") {
				item.title = "Earthquakes Since 1970";
				item.open = true;
				item.actionsSections = [[{
					title: "Go to full extent",
					className: "esri-icon-zoom-out-fixed",
					id: "full-extent"
				}]];
			}
		}
	});

	// Custom Actions
	layerList.on("trigger-action", function(event) {
		// Capture the action id.
		var id = event.action.id;
		// Get the Layer
		var layer = event.item.layer;
		
		if (id === "full-extent") {
		  // If the full-extent action is triggered then navigate
		  mapView.goTo(layer.fullExtent);
		}
	});

	// Add the LayerList Widget to your MapView
	mapView.ui.add(layerList, "bottom-left");


	// Watching the visibility of our FeatureLayer
	featureLayer.watch("visible", function(visible) {
		console.log("visible", visible)
		
		// Change Basemap if not visible
		if (!visible) {
			myMap.basemap = "satellite"
		} else {
			myMap.basemap = "dark-gray"
		}
	})


	var synchronizeView = function(view, others) {
        others = Array.isArray(others) ? others : [others];

        var viewpointWatchHandle;
        var viewStationaryHandle;
        var otherInteractHandlers;
        var scheduleId;

        var clear = function() {
          if (otherInteractHandlers) {
            otherInteractHandlers.forEach(function(handle) {
              handle.remove();
            });
          }
          viewpointWatchHandle && viewpointWatchHandle.remove();
          viewStationaryHandle && viewStationaryHandle.remove();
          scheduleId && clearTimeout(scheduleId);
          otherInteractHandlers = viewpointWatchHandle =
            viewStationaryHandle = scheduleId = null;
        };

        var interactWatcher = view.watch('interacting,animation',
          function(newValue) {
            if (!newValue) {
              return;
            }
            if (viewpointWatchHandle || scheduleId) {
              return;
            }

            // start updating the other views at the next frame
            scheduleId = setTimeout(function() {
              scheduleId = null;
              viewpointWatchHandle = view.watch('viewpoint',
                function(newValue) {
                  others.forEach(function(otherView) {
                    otherView.viewpoint = newValue;
                  });
                });
            }, 0);

            // stop as soon as another view starts interacting, like if the user starts panning
            otherInteractHandlers = others.map(function(otherView) {
              return watchUtils.watch(otherView,
                'interacting,animation',
                function(
                  value) {
                  if (value) {
                    clear();
                  }
                });
            });

            // or stop when the view is stationary again
            viewStationaryHandle = watchUtils.whenTrue(view,
              'stationary', clear);
          });

        return {
          remove: function() {
            this.remove = function() {};
            clear();
            interactWatcher.remove();
          }
        }
      };

      /**
       * utility method that synchronizes the viewpoints of multiple views
       */
      var synchronizeViews = function(views) {
        var handles = views.map(function(view, idx, views) {
          var others = views.concat();
          others.splice(idx, 1);
          return synchronizeView(view, others);
        });

        return {
          remove: function() {
            this.remove = function() {};
            handles.forEach(function(h) {
              h.remove();
            });
            handles = null;
          }
        }
      }

      // bind the views
      synchronizeViews([mapView, sceneView]);
});


