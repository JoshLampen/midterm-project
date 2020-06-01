const enableMapShow = function() {
  console.log('inside enableMapShow function')
  google.maps.event.addDomListener(window, 'load', function() {
    console.log('inside google maps event listener')
    $('#maps-container').on( 'click', '.map', function () {
      const mapID = $(this).attr('id').slice(4);
      console.log(mapID);
      showMap(mapID);
    });
  })
};

const showMap = function(mapID) {
  console.log('inside showMap function')
  $.get('api/markers/', { mapID })
    .done(markers => displayMarkers(markers))
}

const displayMarkers = (markers) => {
  const options = {
    center: { lat: 43.654, lng: -79.383 },
    zoom: 10,
    maxZoom: 15,
    disableDefaultUI: true
  };
  const map = new google.maps.Map(document.getElementById('map'), options);
  const bounds = new google.maps.LatLngBounds();
  const locations = [];

  markers.forEach(marker => {
    locations.push(new google.maps.Marker({
      //Here we put in any details we want. We can insert that info into an infoWindow such that when we click the icon, the infow window shows
      map: map,
      title: marker.name,
      position: {lat: marker.latitude, lng: marker.longitude}
    }));
  });

  //Centers the map such that we can see all the markers
  locations.forEach(marker => bounds.extend(marker.position));

  map.fitBounds(bounds);
}