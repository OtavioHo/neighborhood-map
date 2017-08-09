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
var url = window.location.href;

$(document).ready(function(){
	var token = loggedIn(url);
	if (token){
		$("#insta").hide();
		$("#logged").show();

		//ajax request to instagram api
		$.ajax({
			url: 'https://api.instagram.com/v1/users/'+userId(token)+'/',
			dataType: 'jsonp',
			type: 'GET',
			data: {access_token: token},
			success: function(data){
				$("#logged").append(data.data.username);
				console.log(data.data.username);
			},
			error: function(data){
				console.log(data);
			}
		});
	}
});

//verify if the user is logged in on instagram
//returns the access token or false
function loggedIn(url){
	var split = url.split("#");
	if (split.length > 1){
		var token = split[1].split("=")[1];
		return token;
	}
	return false;
}

//returns the user id
function userId(token){
	if(token) return token.split('.')[0];
	return false;
}

console.log(userId(loggedIn(url)));

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
			populateInfoWindow(this, infowindow);
		});
		markers.push(marker);
	}

	//bounds.extend(marker.position);
	//map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow){
	// from Project_Code_10_DisplayingRoutesDirectionsService.html on the project github
	// Check to make sure the infowindow is not already opened on this marker.
	 if (infowindow.marker != marker) {
        	// Clear the infowindow content to give the streetview time to load.
        	infowindow.setContent('');
        	var content = "<div class='infowindow'>";
        	for (i = 0; i < 9; i++){
        		content += '<img src="/img/loading.gif" class="thumbs" id="thumb-'+ i +'">';
        	}
        	content += "</div>";
        	infowindow.setContent(content);
        	infowindow.marker = marker;
        	// Make sure the marker property is cleared if the infowindow is closed.
        	infowindow.addListener('closeclick', function() {
            	infowindow.marker = null;
         	});

        	//request the locations for the marker's coords
        	$.ajax({
        		url: "https://api.instagram.com/v1/locations/search",
        		dataType: "jsonp",
        		type: "GET",
        		data: {access_token: loggedIn(url), lat: marker.position.lat, lng: marker.position.lng},
        		success: function(data){
        			//get the id of the first place in the list
        			var placeId = data.data[0].id;
        			//request the recent media of the place
        			$.ajax({
        				url: "https://api.instagram.com/v1/locations/" + placeId + "/media/recent",
        				dataType: "jsonp",
        				type: "GET",
        				//had to use a diferent token for authorization purpose
        				data: {access_token: "327238536.e029fea.868198a8006b4c0bbab397174aa761d5"},
        				success: function(data){
        					console.log(data);
        					for (i = 0; i < 9; i++){
        						var imgId = "#thumb-" + i;
        						if (data.data[i]) {
        							$(imgId).show().attr("src",data.data[i].images.thumbnail.url);
        						} else {
        							$(imgId).hide();
        						}
        					}
        				},
        				error: function(data){
        					console.log(data);
        				}
        			})
        		},
        		error: function(data){
        			console.log(data);	
        		}
        	})
        	infowindow.open(map, marker);
		}
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