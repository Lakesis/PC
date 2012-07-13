var PC = {};

PC.core = (function(core, $, undefined){
	
	var section,
	step
	;
	
	var wizardManager = function(){
		
		mediator.on('mapInitialised', function(){
			//PC.wizard.init();
		});
		if(PC.mapManager){
			var map = {
				element : $('#mapContainer')[0],
				options : {
					center: new google.maps.LatLng(-34.397, 150.644),
					zoom: 8,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}
			},
			directions = {
				options : {draggable : true}
			};
			PC.mapManager.init({map : map, directions : directions});
		}
	};
	
	var init = function(){
		var mapping = {
			wizard : wizardManager
		};
	
		$(document).ready(function(){
			section = $('body').data('section');
			step = $('body').data('step');
			
			mapping[section]();
			
		});
	}();
	
	return core;

})(PC.core || {}, jQuery);

PC.mapManager = (function(mapManager, $, undefined){

	var map,
	directionsDisplay,
	directionsService,
	geocoder
	;
	
	mapManager.init = function(config){
		map = new google.maps.Map(config.map.element, config.map.options);
		directionsDisplay = new google.maps.DirectionsRenderer(config.directions.options);
		directionsService = new google.maps.DirectionsService();
		geocoder = new google.maps.Geocoder();
		
		if (mediator){ mediator.publish('mapInitialised');}
	};
	
	return mapManager;

})(PC.mapManager || {}, jQuery);

/*	
	
	var myOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	var locations = [];
    var map = new google.maps.Map(document.getElementById("mapContainer"), myOptions);
	var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
	var directionsService = new google.maps.DirectionsService();
	var geocoder = new google.maps.Geocoder(); 
	
	
	directionsDisplay.setMap(map);
	 
	var request = {
		origin: "Sydney, NSW",
		destination: "Sydney, NSW",
		waypoints:[{location: "Bourke, NSW"}, {location: "Broken Hill, NSW"}],
		travelMode: google.maps.TravelMode.DRIVING
	};	
	
	
    
	var address = document.getElementById("location");
	address.onblur = function(){
		console.log(this.value);
	/*	geocoder.geocode( { 'address': address.value}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				locations.push({location: results[0].geometry.location} )
			} else {
				console.log("Geocode was not successful for the following reason: " + status);
			}
		});
		locations.push(this.value);
		this.value='';
		console.log(locations);
	}
	
	var button = document.getElementById("submit");
	submit.onclick = function(e){
		e.preventDefault();
		request.origin = locations[0];
		request.destination = locations[locations.length-1];
		request.waypoints = [];
		for (var i=1, l = locations.length-1; i<l; i++) {request.waypoints.push(locations[i])}
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
			  directionsDisplay.setDirections(response);
			}
		});
	};
	
	return PC;
	
})(PC || {}, window, document); */