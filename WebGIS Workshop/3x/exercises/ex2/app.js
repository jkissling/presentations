require(["esri/map"], function(Map){
	
	var options = {
		basemap : "dark-gray",
		center: [8.22670, 46.80136], // Lon/ Lat
		zoom: 9,
		nav: true
	};
	
	var myMap = new Map("mapDiv", options);
});
