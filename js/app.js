//places oject
var places = [
	{
		"name" : "Instituto de Matematica e Estatistica",
		"initials" : "IME",
		"coords" : {"lat" : -23.559276, "lng": -46.731292}
	},
	{
		"name" : "Faculdade de Arquitetura e Urbanismo",
		"initials" : "FAU",
		"coords" : {"lat" : -23.560191, "lng" : -46.729939}
	},
	{
		"name" : "Instituto de Quimica",
		"initials" : "IQ",
		"coords" : {"lat" : -23.564750, "lng" : -46.726121}
	},
	{
		"name" : "Escola Politecnica",
		"initials" : "Poli",
		"coords" : {"lat" : -23.557037, "lng" : -46.732809}
	},
	{
		"name" : "Instituto de Biologia",
		"initials" : "IB",
		"coords" : {"lat" : -23.564911, "lng" : -46.730179}
	}
	];
var markers = [];

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -23.561155, lng:-46.731033},
		zoom:15,
		styles: [
			    {
			        "featureType": "administrative",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "administrative",
			        "elementType": "labels.text.fill",
			        "stylers": [
			            {
			                "color": "#444444"
			            }
			        ]
			    },
			    {
			        "featureType": "landscape",
			        "elementType": "all",
			        "stylers": [
			            {
			                "color": "#f2f2f2"
			            },
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "road",
			        "elementType": "all",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "lightness": 45
			            },
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "simplified"
			            }
			        ]
			    },
			    {
			        "featureType": "road.arterial",
			        "elementType": "labels.icon",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "transit",
			        "elementType": "all",
			        "stylers": [
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "elementType": "all",
			        "stylers": [
			            {
			                "color": "#3591b7"
			            },
			            {
			                "visibility": "on"
			            }
			        ]
			    }
			]
	});

	//var bounds = new google.maps.LatLngBounds();

	for (i = 0; i < places.length; i++){
		var marker = new google.maps.Marker({
			position: places[i].coords,
			map: map,
			title: places[i].initials
		});

		var infowindow = new google.maps.InfoWindow();

		marker.addListener('click', function(){
			infowindow.open(map, this);
		});

		markers.push(marker);
	}

	//bounds.extend(marker.position);
	//map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow){

}

function hasSubstring(string, substring){
	var lstring = string.toLowerCase();
	var lsubstring = substring.toLowerCase();
	if (lstring.indexOf(lsubstring) > -1){
		return true;
	}
	return false;
}

function AppViewModel() {
    var self = this;

    //Function tha filters the list of places
    function filter(){
    	var resultsList = [];
    	self.obsResults = ko.mapping.fromJS(resultsList);
    	//Search for matches in the array
    	for (i = 0; i < places.length; i++){
    		//if the name or initials contains the search string
    		if (hasSubstring(places[i].name, self.search()) || hasSubstring(places[i].initials, self.search())) {
    			//push the object to the new array
    			self.obsResults.push(places[i]);
    			if (markers.length > 0){
    				markers[i].setMap(map);
    			}
    		}
    		else {
    			if (markers.length > 0){
    				markers[i].setMap(null);
    			}
    		}
    	}
    	return  self.obsResults();
	}

    self.title = ko.observable("Neighborhood Map");
    self.search = ko.observable("");

   	//updates the list
    self.compResults = ko.computed(function(){
    	return filter();
    },self);



    //Search in Places API
   	self.searchPlacesAPI = function () {
   		var results = document.getElementById("results");
   		var resultsList;

   		results.innerHTML = resultsList;
    }

}

ko.applyBindings(new AppViewModel());