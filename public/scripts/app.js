$(document).ready(function() {
  loadMap(); // load empty map

  const $createButton = $('#create');
  const $profileButton = $('#profile');
  const $dropdown = $('#dropdown');

  const $registerDiv = $('#register');
  const $registerForm = $registerDiv.find('#register-form');
  const $registerInput = $registerDiv.find('input');
  const $cancelRegister = $registerDiv.find('a');

  const $mapInfoDiv = $('#enter-map-info');
  const $mapForm = $mapInfoDiv.find('#map-form'); // where the user submits the map name
  const $nameInput = $mapForm.find('input');
  const $cancelCreate = $mapInfoDiv.find('a');

  const $newMapContainer = $('#new-map'); // container that appears following map name submission
  const $markerContainer = $newMapContainer.find('#marker-container');
  const $submitMapButton = $newMapContainer.find('#submit-map-button');
  const $cancelSubmit = $newMapContainer.find('#cancel-create');
  const $favorites = $('#dropdown').find('a:contains("Favorites")');
  const $myMaps = $('#dropdown').find('a:contains("My Maps")');

  const $mapsFeedHeader = $('#maps-feed').find('h2');
  const $map = $('#maps-container').find('div');

  $dropdown.hide();
  $registerDiv.hide();
  $mapInfoDiv.hide();
  $newMapContainer.hide();
  $('#error-maps').hide();

  loadMapsFeed(); // loads all maps in database to the feed
  enableMarkerAdding(); // enables adding of markers when a location is searched

  $profileButton.click(function(event) {
    event.preventDefault();

    $.post('/')
      .then(() => {
        if ($mapInfoDiv.is(':visible')) {
          $mapInfoDiv.hide();
        };

        if ($newMapContainer.is(':visible')) {
          cancelMap($newMapContainer);
        };

        if ($dropdown.is(':hidden')) {
          $dropdown.slideDown();
        } else {
          $dropdown.hide();
        };
      })
      .catch(() => {
        if ($registerDiv.is(':hidden')) {
          $('#map').addClass('greyscale');
          $registerDiv.fadeIn();
        } else {
          $('#map').removeClass('greyscale');
          $registerDiv.hide();
          $registerForm.find('input').val('');
        };
      });
  });

  $createButton.click(function(event) {
    event.preventDefault();

    $.post('/')
      .then(() => {
        if ($dropdown.is(':visible')) {
          $dropdown.hide();
        };

        if ($newMapContainer.is(":visible")) {
          $mapInfoDiv.hide();
          cancelMap($newMapContainer);
        };

        if ($mapInfoDiv.is(":hidden")) {
          $nameInput.val('');
          $mapInfoDiv.fadeIn();
        } else {
          $mapInfoDiv.hide();
        };
      })
      .catch(() => {
        if ($registerDiv.is(':hidden')) {
          $('#map').addClass('greyscale');
          $registerDiv.fadeIn();
        } else {
          $('#map').removeClass('greyscale');
          $registerDiv.hide();
          $registerForm.find('input').val('');
        }
      });
  });

  $mapForm.submit(function(event) { // upon submission of map name...
    event.preventDefault();
    $('#error-maps').css('display:none');

    const mapName = $('#map-form input:nth-child(1)').val().trim();
    const mapCity = $('#map-form input:nth-child(2)').val().trim();

    $.get('/api/maps/user/:user', function(data) {
      console.log(data);
      let mapNames = [];
      data.forEach(map => mapNames.push(map.name))
      console.log(mapNames)

      if (mapNames.includes(mapName)) {
        $('#error-maps').empty().prepend(`<i class="fas fa-exclamation-circle"></i><div>Map name already exists. Please enter a new one.</div>`)
        $('#error-maps').slideDown(300)
      } else {
        //If Map name and city is not empty, execute
        if (mapName && mapCity) {
          $mapInfoDiv.hide();
          $('#error-maps').hide()
          createNewMap($mapForm, $newMapContainer); // hide the map name submission container, show new map container
        } else {
          $('#error-maps').empty().prepend(`<i class="fas fa-exclamation-circle"></i><div>Please enter a name and/or city.</div>`)
          $('#error-maps').slideDown(300)
        }
      }
    })
  })

  $(document).mouseup(function(e){
    let errorMaps = $("#error-maps");
    // If the target of the click isn't the container
    if(!errorMaps.is(e.target) && errorMaps.has(e.target).length === 0){
        errorMaps.hide();
    }
  });

  $cancelCreate.click(function(event) {
    event.preventDefault();
    $mapInfoDiv.hide();
  });

  $submitMapButton.click(function() {
    if (!$('#marker-container').is(':empty')) {
      submitMap($newMapContainer, $markerContainer);
    };
  });

  $cancelSubmit.click(function() {
    cancelMap($newMapContainer);
  });

  $registerForm.submit(function(event) {
    event.preventDefault();

    const values = `email=${$registerInput.val()}`

    if ($registerInput.val().includes(' ') || !$registerInput.val().includes('@') || !$registerInput.val().includes('.com') || !$registerInput.val()) {
      return;
      //Either had whitespace, did not include the '@', did not have '.com or was an empty string
    } else {
      $.get('/users/register/all', function (data) {
        if (data.find(obj => obj.email === $registerInput.val())) {
          return;
          //Email already taken, do nothing
        }
        $.post('/users/register/', values);
        $('#map').removeClass('greyscale');
        $registerDiv.hide();
      })
    }

  });

  $cancelRegister.click(function(event) {
    event.preventDefault();
    $registerDiv.hide();
    $registerForm.find('input').val('');
  });

  $('#maps-container').on('click', '.favorite-map', function() {
    const mapID = $(this).attr('id').slice(13);
    $.post('/api/favorites/', {mapID});
  });

  $favorites.click(function(event) {
    event.preventDefault();
    $mapsFeedHeader.html('Favorites');
    $( "#maps-container" ).empty();
    loadFavoritesFeed();
  });

  $myMaps.click(function(event) {
    event.preventDefault();
    $mapsFeedHeader.html('My Maps');
    $( "#maps-container" ).empty();
    loadMyMaps();
  });

  google.maps.event.addDomListener(window, 'load', function() {
    $('#maps-container').on( 'click', '.map', function() {
      $('#map').removeClass('greyscale');
      $registerDiv.hide();
      $mapInfoDiv.hide();
      $dropdown.hide();
      const mapID = $(this).attr('id').slice(4);
      showMap(mapID);
    });
  });
});
