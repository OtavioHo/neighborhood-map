//places oject
var places = [
	{
		"index" : "0",
		"name" : "Instituto de Matematica e Estatistica",
		"initials" : "IME",
		"coords" : {"lat" : -23.559276, "lng": -46.731292}
	},
	{
		"index" : "1",
		"name" : "Faculdade de Arquitetura e Urbanismo",
		"initials" : "FAU",
		"coords" : {"lat" : -23.560191, "lng" : -46.729939}
	},
	{
		"index" : "2",
		"name" : "Instituto de Quimica",
		"initials" : "IQ",
		"coords" : {"lat" : -23.564750, "lng" : -46.726121}
	},
	{
		"index" : "3",
		"name" : "Escola Politecnica",
		"initials" : "Poli",
		"coords" : {"lat" : -23.557037, "lng" : -46.732809}
	},
	{
		"index" : "4",
		"name" : "Instituto de Biociencias",
		"initials" : "IB",
		"coords" : {"lat" : -23.564911, "lng" : -46.730179}
	},
	{
		"index" : "5",
		"name" : "Faculdade de Odontologia",
		"initials" : "FOUSP",
		"coords" : {"lat" : -23.567576, "lng" : -46.738860}
	},
	{
		"index" : "6",
		"name" : "Escola de Educacao Fisica e Esporte",
		"initials" : "EEFE",
		"coords" : {"lat" : -23.562759, "lng" : -46.713505}
	},
	{
		"index" : "7",
		"name" : "Fonoaudiologia, Fisioterapia, Terapia Ocupacional - FMUSP",
		"initials" : "FOFITO",
		"coords" : {"lat" : -23.567515, "lng" : -46.740526}
	},
	{
		"index" : "8",
		"name" : "Faculdade de Filosofia, Letra e Ciencias Humanas",
		"initials" : "FFLCH",
		"coords" : {"lat" : -23.561545, "lng" : -46.729167}
	},
	{
		"index" : "9",
		"name" : "Instituto de Oceanografia",
		"initials" : "IO",
		"coords" : {"lat" : -23.560876, "lng" : -46.731911}
	},
	{
		"index" : "10",
		"name" : "Instituto de Fisica",
		"initials" : "IF",
		"coords" : {"lat" : -23.560412, "lng" : -46.734570}
	}
	];
var markers = [];
var url = window.location.href;

var infowindow;
var labelwindow;
var infowindowlist;

$(document).ready(function(e){
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
			timeout: 3000
		}).done(function(data){
				console.log(data);
				if(data.meta.code == 200){
					$("#username").append(" "+ data.data.full_name);
					$("#prof").attr("src", data.data.profile_picture);
					$.ajax({
						url: "https://api.instagram.com/v1/locations/221343661/media/recent", //USP id
        				dataType: "jsonp",
		        		type: "GET",
		        		data: {access_token: loggedIn(url)},
		        		timeout: 3000
		        	}).done(function(data){
			        			console.log(data);
			        			if (data.meta.code == 200){
				        			for (i = 0; i < 16; i++){
			        						if (data.data[i]) {
			        							//console.log(data.data[i]);
			        							$("#usp-thumbs").append('<img src="'+data.data[i].images.thumbnail.url+'" class="thumbs">');
			        						}
			        					}
			        				} else {
			        					$("#logged").append("Error to comunicate with Instagram API: " + data.meta.code + " - " + data.meta.error_message + '<a href="http://www.instagram.com/oauth/authorize/?client_id=b341fc6acf6d4a8ba5e12eb3556c4def&redirect_uri=http://localhost:8000&response_type=token&scope=basic+public_content" class="fa fa-instagram" style="text-align:center"> <span style="font-family: Roboto;"> | SignUp</span></a>');
			        				}
		        			}).fail(function(){
								instaInfoError();
							});
				} else {
					//$("#logged").append("Error to comunicate with Instagram API: " + data.meta.code + " - " + data.meta.error_message + '<a href="http://www.instagram.com/oauth/authorize/?client_id=b341fc6acf6d4a8ba5e12eb3556c4def&redirect_uri=http://localhost:8000&response_type=token&scope=basic+public_content" class="fa fa-instagram" style="text-align:center"> <span style="font-family: Roboto;"> | SignUp</span></a>');
					alert("Error: " + data);
				}
		}).fail(function(data){
			instaInfoError();
			console.log(data);
		});
	}	
	$("#open_menu").click(function(){
		var status = $("#menu").css("display");
			$("#menu").slideToggle();
			$("#map").slideToggle();
	});
});

function googleError(){
	alert("Failed to comunicate with google maps API");
}

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

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -23.561155, lng:-46.731033},
		zoom:15,
		styles: [
				    {
				        "featureType": "landscape.man_made",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            }
				        ]
				    },
				    {
				        "featureType": "landscape.natural.landcover",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            }
				        ]
				    },
				    {
				        "featureType": "landscape.natural.terrain",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            }
				        ]
				    },
				    {
				        "featureType": "landscape.natural",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            }
				        ]
				    },
				    {
				        "featureType": "landscape",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            }
				        ]
				    },
				    {
				        "featureType": "water",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            },
				            {
				                "lightness": 10
				            }
				        ]
				    },
				    {
				        "featureType": "road",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            },
				            {
				                "lightness": 17
				            }
				        ]
				    },
				    {
				        "featureType": "administrative.locality",
				        "elementType": "labels.text",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            },
				            {
				                "saturation": 5
				            },
				            {
				                "lightness": 46
				            }
				        ]
				    },
				    {
				        "featureType": "administrative.locality",
				        "elementType": "labels.text.stroke",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            },
				            {
				                "hue": "#000000"
				            }
				        ]
				    },
				    {
				        "featureType": "road",
				        "elementType": "labels.text",
				        "stylers": [
				            {
				                "invert_lightness": false
				            },
				            {
				                "color": "#3D3C3A"
				            },
				            {
				                "saturation": -3
				            },
				            {
				                "lightness": 36
				            }
				        ]
				    },
				    {
				        "featureType": "road",
				        "elementType": "labels.text.stroke",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            }
				        ]
				    },
				    {
				        "featureType": "poi",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            }
				        ]
				    },
				    {
				        "featureType": "poi",
				        "elementType": "labels.text",
				        "stylers": [
				            {
				                "visibility": "off"
				            },
				            {
				                "color": "#3D3C3A"
				            },
				            {
				                "saturation": 10
				            },
				            {
				                "lightness": 57
				            }
				        ]
				    },
				    {
				        "featureType": "poi",
				        "elementType": "labels.text.stroke",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            }
				        ]
				    },
				    {
				        "featureType": "transit",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            },
				            {
				                "lightness": 23
				            }
				        ]
				    },
				    {
				        "featureType": "transit",
				        "elementType": "labels.text",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            },
				            {
				                "saturation": 7
				            },
				            {
				                "lightness": 33
				            }
				        ]
				    },
				    {
				        "featureType": "transit",
				        "elementType": "labels.text.stroke",
				        "stylers": [
				            {
				                "color": "#3D3C3A"
				            }
				        ]
				    },
				    {
				        "featureType": "poi",
				        "elementType": "labels.icon",
				        "stylers": [
				            {
				                "visibility": "off"
				            }
				        ]
				    },
				    {
				        "featureType": "transit",
				        "elementType": "labels.icon",
				        "stylers": [
				            {
				                "hue": "#ff7300"
				            }
				        ]
				    }
				]						
	});
	infowindow = new google.maps.InfoWindow();
	labelwindow = new google.maps.InfoWindow();
	infowindowlist = new google.maps.InfoWindow();
	//icon  imgs
	var markerImg = "img/marker.png";
	var markerHighImg = "img/marker_high.png";

	//populate markers array
	for (i = 0; i < places.length; i++){
		var marker = new google.maps.Marker({
			position: places[i].coords,
			map: map,
			animation: google.maps.Animation.DROP,
			icon: markerImg,
			title: places[i].initials,
			description: places[i].name,
			index: i
		});

		google.maps.event.addDomListener(document.getElementById("menu"), 'click', function(){
			infowindow.close();
			//map.setCenter({lat:-23.561273, lng:-46.730958});
		});

		marker.addListener('click', function(){
			populateInfoWindow(this, infowindow);
			bounce(this.index);
			labelwindow.close();
			infowindowlist.close();
		});

		marker.addListener('mouseover', function(){
			this.setIcon(markerHighImg);
			labelwindow.setContent(this.title);
			labelwindow.open(map, this);
		});

		marker.addListener('mouseout', function(){
			this.setIcon(markerImg);
			labelwindow.close();
		});

		markers.push(marker);
	}
}

function instaInfoError(){
	alert("Error: instagram api not availble");
}

//populate the infowindow
function populateInfoWindow(marker, infowindow){
	// from Project_Code_10_DisplayingRoutesDirectionsService.html on the project github
	// Check to make sure the infowindow is not already opened on this marker.
	 if (infowindow.marker != marker) {
        	// Clear the infowindow content to give the streetview time to load.
        	infowindow.setContent('');
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
        		beforeSend: function(){
        			var content = "<span>" + marker.title +" </span><br><span class='subtitle'>" + marker.description + "</span><hr>";
		        	content += "<span class='subtitle'>Instagram pics at this place:</span><br><br>"
		        	content += "<div class='infowindow'>";
		        	for (i = 0; i < 9; i++){
		        		content += '<img src="img/loading.gif" class="thumbs" id="thumb-'+ i +'">';
		        	}
		        	content += "</div>";
		        	infowindow.setContent(content);
        		},
        		timeout: 3000
        	}).done(function(data){
        			//get the id of the first place in the list
	    			if (loggedIn(url) && data.meta.code == 200){
	        			var placeId = data.data[0].id;
	        			//request the recent media of the place
	        			$.ajax({
	        				url: "https://api.instagram.com/v1/locations/" + placeId + "/media/recent",
	        				dataType: "jsonp",
	        				type: "GET",
	        				//had to use a diferent token for authorization purpose
	        				data: {access_token: loggedIn(url)},
	        				timeout: 3000
	        			}).done(function(data){
	        					console.log(data);
	        					if (data.meta.code == 200){
		        					for (i = 0; i < 9; i++){
		        						var imgId = "#thumb-" + i;
		        						if (data.data[i]) {
		        							$(imgId).show().attr("src",data.data[i].images.thumbnail.url);
		        						} else {
		        							$(imgId).hide();
		        						}
		        					}
	        					} else {
	        						instaInfoError(data, infowindow);
	        					}
	        			}).fail(function(){
	        				instaInfoError();
	        			});
	    			} else {
	    				infowindow.setContent('<div style="width: 150px"><a href="http://www.instagram.com/oauth/authorize/?client_id=b341fc6acf6d4a8ba5e12eb3556c4def&redirect_uri=http://localhost:8000&response_type=token&scope=basic+public_content" class="fa fa-instagram" style="text-align:center"> <span style="font-family: Roboto;"> | SignUp</span></a></div>');
	    			}
        	}).fail(function(data){
        		instaInfoError();
        	});
        infowindow.open(map, marker);
	}
}

//search for substrings withi a string
function hasSubstring(string, substring){
	var lstring = string.toLowerCase();
	var lsubstring = substring.toLowerCase();
	if (lstring.indexOf(lsubstring) > -1){
		return true;
	}
	return false;
}

//Animate the marker to BOUNCE
function bounce(index){
    markers[index].setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ markers[index].setAnimation(null); }, 750);
}

function AppViewModel() {
    var self = this;

    self.title = ko.observable("Universidade de Sao Paulo");
    self.subtitle = ko.observable("University of Sao Paulo");
    self.search = ko.observable("");

   	//updates the list
    self.compResults = ko.computed(function(){
    	var resultsList = [];
    	self.obsResults = ko.mapping.fromJS(resultsList);
    	//Search for matches in the array
    	for (i = 0; i < places.length; i++){
    		//if the name or initials contains the search string
    		if (hasSubstring(places[i].name, self.search()) || hasSubstring(places[i].initials, self.search())) {
    			//push the object to the new array
    			self.obsResults.push(places[i]);
    			if (markers.length > 0){
    				//make the markers visible and DROP then in the map
    				markers[i].setMap(map);
    				markers[i].setAnimation(null);
    				markers[i].setAnimation(google.maps.Animation.DROP);
    			}
    		}
    		else {
    			//if not in the list make marker invisible
    			if (markers.length > 0){
    				markers[i].setMap(null);
    			}
    		}
    	}
    	if (self.obsResults().length > 0){
    		return self.obsResults();
    	} else{
    		self.obsResults.push({initials: "No results found!"});
    		return self.obsResults();
    	}
    },self);

    //get  the index of the clicked place and make the marker BOUNCE
    self.bounceMarker = function(){
    	var index = this.index;
    	map.setCenter(markers[index].getPosition());
    	map.setZoom(16);
    	bounce(index);
    	populateInfoWindow(markers[index], infowindowlist);
    }
}

ko.applyBindings(new AppViewModel());