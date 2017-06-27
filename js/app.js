var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.7413549, lng: -73.9980244},
		zoom:13
	});

	var usp = {lat: -23.561155, lng:-46.731033};

	var marker = new google.maps.Marker({
		position: usp,
		map:map,
		title: 'USP'
	});
}