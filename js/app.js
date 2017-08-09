//places oject
var places = [
	{
		"name" : "Instituto de Matematica e Estatistica",
		"initials" : "IME",
		"coords" : {"lat" : 0000, "lng": 0000}
	},
	{
		"name" : "Faculdade de Arquitetura e Urbanismo",
		"initials" : "FAU",
		"coords" : {"lat" : 000, "lng" : 0000}
	},
	{
		"name" : "Instituto de Quimica",
		"initials" : "IQ",
		"coords" : {"lat" : 000, "lng" : 0000}
	},
	{
		"name" : "Escola Politecnica",
		"initials" : "Poli",
		"coords" : {"lat" : 000, "lng" : 0000}
	},
	{
		"name" : "Instituto de Biologia",
		"initials" : "IB",
		"coords" : {"lat" : 000, "lng" : 0000}
	}
	];


var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 0, lng:0},
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

	var usp = {lat: -23.561155, lng:-46.731033};

	var bounds = new google.maps.LatLngBounds();

	var marker = new google.maps.Marker({
		position: usp,
		map:map,
		title: 'USP'
	});

	bounds.extend(marker.position);
	map.fitBounds(bounds);

	var infowindow = new google.maps.InfoWindow({
		content: 'Universidade de Sao Paulo'
	});

	marker.addListener('click', function(){
		infowindow.open(map, marker);
	});
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