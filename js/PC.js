var PC = {};

PC.core = (function(core, $, undefined){
	
	var section,
	step
	;
	
	var wizardManager = function(){
	
		var pubCrawl = [],
		pubs = [
			{
				id: 0,
				name : 'The Australian Heritage Hotel',
				address : '100 Cumberland Street, The Rocks NSW, Australia',
				latlng : new google.maps.LatLng(-33.859583,151.207038)
			},
			{
				id: 1,
				name : 'The Glenmore Hotel',
				address : '96 Cumberland Street, The Rocks NSW, Australia',
				latlng : new google.maps.LatLng(-33.858778,151.207294)
			},
			{
				id: 2,
				name : 'Lowenbrau Keller',
				address : '18 Argyle Street, The Rocks NSW, Australia',
				latlng : new google.maps.LatLng(-33.859079,151.207838)
			}
		];
		
		mediator.on('mapInitialised', function(){
			//PC.wizard.init();
		});
		mediator.on('addPub', function(data){
			var id = data[0].get('id'),
			newPub = true;
			if(pubs[id]){
				for(var i=0, l = pubCrawl.length; i<l; i++){
					if(pubCrawl[i].id === id) newPub = false;  
				}
				if (newPub) pubCrawl.push(pubs[id]);
			}
			
			PC.mapManager.route({pubCrawl:pubCrawl, travelMode : 'WALKING'});
			//PC.wizard.updatePubCrawl(pubCrawl);
		});
		if(PC.mapManager){
			var map = {
				element : $('#mapContainer')[0],
				options : {
					center: new google.maps.LatLng(-33.859635,151.208701),
					zoom: 17,
					panControl: false,
					streetViewControl: false,
					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.SMALL
					},
					mapTypeControl: true,
					mapTypeControlOptions: {
						position: google.maps.ControlPosition.TOP_LEFT
					},
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}
			},
			directions = {
				options : {
					draggable : true,
					suppressMarkers : true
				}
			}
			
			PC.mapManager.init({map : map, directions : directions, pubs : pubs});
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
	
	var loadBars = function(pubs){
		var closure = function(i){
			return function(){ return i};
		}();
			
		for (var i=0, l = pubs.length; i<l; i++){	
			
			
			geocoder.geocode( { 'address': pubs[i].address}, function(results, status) {
			console.log(closure(i));
				if (status == google.maps.GeocoderStatus.OK) {
					 pubs[closure(i)].latlng = results[0].geometry.location; 

				} else {
					console.log("Geocode was not successful for the following reason: " + status);
				}
			});
			var marker = new google.maps.Marker({
				position: pubs[i].latlng,
				map: map
			});
			marker.set('id', pubs[i].id);
			google.maps.event.addListener(marker,'click', function() {
				if (mediator) mediator.publish('displayPubDetails',this);
				else console.log('mediator is missing');
			});
			google.maps.event.addListener(marker,'dblclick', function() {
				if (mediator) mediator.publish('addPub',this);
				else console.log('mediator is missing');
			});
			google.maps.event.addListener(marker, 'mouseover', function() {
				// Handle over
			});
		}
	};
	
	mapManager.init = function(config){
		map = new google.maps.Map(config.map.element, config.map.options);
		directionsDisplay = new google.maps.DirectionsRenderer(config.directions.options);
		directionsService = new google.maps.DirectionsService();
		geocoder = new google.maps.Geocoder();
		directionsDisplay.setMap(map);
		
		var $wizardSearchBar = $('<div id="wizardSearch"><input type="text" value="Search" name="wizardSearchBar" id="wizardSearchBar"/></div>');
		map.controls[google.maps.ControlPosition.TOP_LEFT].push($wizardSearchBar[0]);

		if (config.pubs.length > 0){
			loadBars(config.pubs)
		} else console.log('Pubs object is empty');
		
		google.maps.event.addListener(map, 'click', function(e) {
			// Handle adding a new venue
		});
		
		/*
			Handle click in path
			Handle drag in path
		*/
		
		if (mediator){ mediator.publish('mapInitialised');}
		else console.log('mediator is missing');
	};
	
	mapManager.route = function(config){
		
		var request = {
			travelMode :  google.maps.TravelMode[config.travelMode]
		};
		
		if(config.pubCrawl){
			request.origin = config.pubCrawl[0].address;
			request.destination = config.pubCrawl[config.pubCrawl.length-1].address;
			request.waypoints = [];
			for (var i=1, l = config.pubCrawl.length-1; i<l; i++) { 
				request.waypoints.push({
					location: config.pubCrawl[i].address,
					stopover: true
				});
			}
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
				  directionsDisplay.setDirections(response);
				}
			});
			
		} else console.log('Pub Crawl object is empty')
	};
	
	return mapManager;

})(PC.mapManager || {}, jQuery);

/*	
	


	
    
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
	
*/