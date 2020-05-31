// this script loads the initial empty map

const loadMap = function() {
  let map, infoWindow;

  // initial map load
  const options = {
    center: { lat: 43.654, lng: -79.383 },
    zoom: 10,
    disableDefaultUI: true // this removes all the in-map features e.g. zoom
    // draggable: false --> this would disable the ability to drag on the map
  };

  map = new google.maps.Map(document.getElementById('map'), options);

  // load user position if possible, if not handle edge cases
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(p) {
      const position = {
        lat: p.coords.latitude,
        lng: p.coords.longitude
      };

      infoWindow.setPosition(position);
      infoWindow.setContent('Your location!');
      infoWindow.open(map.setCenter(position));

    }, function() {
      handleLocationError('Geolocation service failed', map.center());

    });
  } else {
    handleLocationError('No geolocation available', map.center());

  }

  // load search bar
  const input = document.getElementById('search');
  const searchBox = new google.maps.places.SearchBox(input);

  enableSearch(searchBox, map);
};