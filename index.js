
//Initialize google maps
function initMap() {
  let currentLoc = {lat: 35.913200, lng: -79.055847};
  state.map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 15,
    center: currentLoc,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
 state.infoWindow = new google.maps.InfoWindow({
  content: ''
});
 state.directionsDisplay = new google.maps.DirectionsRenderer;
}

//open search area
function openApp(){
  $('.start-page').on('submit', function(event){
    event.preventDefault();
    showHideForm($('.start-page, .overlay'));
    $('#search-box').focus();
  })
}
$(openApp);

//toggle class names (hide/unhide)
function showHideForm(frmName) {
  frmName.toggleClass('hidden');
}

//Geocoding address on form submit event
function searchNearestBus(){
  $('.frm-search-box').on('submit',function(event){
    event.preventDefault();
    deleteMarkers();
    clearRoute();
    $('#bus-stop-list').empty();
    geocodeAddress();
  });

}
$(searchNearestBus);

//Find lat & long coordinate of a given address
function geocodeAddress(){
    let currentAddress = $('#search-box').val();
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': currentAddress}, function(results, status) {
      if(status === 'OK') {
        state.currentLocation = {'lat': results[0].geometry.location.lat(), 
                          'lng':results[0].geometry.location.lng()};
        addMarkerOnCurrentLoc(state.currentLocation);
        getBusStopLocation(state.currentLocation);
        state.map .setCenter(state.currentLocation);
        state.map .setZoom(16);

      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
        showErrorMessage(status);
      }
    });
}

//Get bus stop location from Chapel Hill Town API
function getBusStopLocation(currentCoord){
  let ajaxParam = {
    url:  "https://www.chapelhillopendata.org/api/records/1.0/search//",
    data: {
      dataset: 'bus-stops',
      type: "GET",
      lang: 'en',
      format: 'json',
      rows: 700
    },
    success: function(busLocation){
        successResult(busLocation, currentCoord);
    },
    failure: errorFunction
  };
  $.ajax(ajaxParam);
}

//call back function to work with returned result when successful
function successResult(busLocation, currentCoord){
  let markerLocation = {};
  let busStopStreet;
  let busStopAt;
  let direction;
  let route = [];
  let routeFields = ['a', 'ccx', 'cl', 'cm', 'cpx', 'cw', 'd', 'dx', 
                      'f', 'fcx', 'g', 'hs', 'hu','hx', 'j', 'jfx', 'n',
                      'ns', 'nu', 'px', 'ru', 's', 't', 'u', 'v'];
  busLocation.records.map(function(record, index){
    route = [];
    markerLocation = {'lat': record.fields.geo_point_2d[0], 
                      'lng': record.fields.geo_point_2d[1]};
    for (let i = 0; i < routeFields.length; i++) {
      if(record.fields[routeFields[i]] === 1) {
        route.push(routeFields[i].toUpperCase());
      }
    }
    busStopStreet = record.fields.name.replace('at', '&');
    busStopAt = record.fields.at;
    direction = record.fields.dir;
    let busStopCount = 0;
    addBusStopMarkers(currentCoord, markerLocation, 
                      busStopStreet, busStopAt,
                      direction, route);
  });
}

//Add clickable markers for each bus stop within 500 meters of radius
function addBusStopMarkers(currentCoord, coordLocation, 
                          streetLocation, busStopAt,
                          direction,route){             
  let marker = new google.maps.Marker();  
  if (calcDistance(currentCoord.lat, currentCoord.lng, 
                  coordLocation.lat, coordLocation.lng) <= 1640.42){
      marker = new google.maps.Marker({
          position: coordLocation,
          map: state.map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
      state.markers.push(marker);
      showBusStopsList(coordLocation, route, streetLocation, busStopAt, direction);
      $('.lists').first().focus();
      let contentString = `<div class ="info-window">
                          <h3><i class="fa fa-bus"></i> ${route}</h3>
                          <p>${streetLocation}</p>
                          <p>At: ${busStopAt}</p>
                          <p>Heading: ${busDirection[direction]}</p>
                        </div>`;
  addEventListner(marker, contentString);
  } 
}

//add marker event listner
function addEventListner(marker, markerString){
  google.maps.event.addListener(marker, 'click', function(){
    state.infoWindow.close();
    state.infoWindow.setContent(markerString);
    state.infoWindow.open(state.map ,marker);
    
  }); 
}

//display bus stops within 1km radius
function showBusStopsList(coordLocation, route, 
                          streetLocation, 
                          busStopAt,
                          direction){ 
  let distance = parseInt(calcDistance(state.currentLocation.lat, 
                                      state.currentLocation.lng, 
                                      coordLocation.lat, 
                                      coordLocation.lng));
  $('#bus-stop-list').append(`<li class = "lists" tabindex ='0' 
                                                  data-lat = ${coordLocation.lat}
                                                  data-lng = ${coordLocation.lng}
                                                  data-distance = ${distance}>
                                <div class ="listing" data-lat = ${coordLocation.lat} 
                                                      data-lng = ${coordLocation.lng}
                                                      data-distance = ${distance}>
                                  <p>
                                    <a href = "#">
                                      <i class="fa fa-bus"></i> ${route} 
                                    </a>
                                    , ${streetLocation}
                                    @ ${busStopAt}, Heading ${busDirection[direction]}, ${distance} feet
                                  </p>
                                </div>
                            </li>`);  
sortList();                 
}

//sort the bus stop list
function sortList() {
  $('#bus-stop-list').html(
    $('#bus-stop-list').children('li').sort(function (a,b){
      return $(a).data('distance') - $(b).data('distance');
    })
  );
};

//Add clickable markers on current location
function addMarkerOnCurrentLoc(currentCoord){
  let marker = new google.maps.Marker();  
  marker = new google.maps.Marker({
      position: currentCoord,
      map: state.map ,
      label: {
      fontFamily: 'Fontawesome', text: '\uf015', color: 'green'}
  });
    
  state.markers.push(marker);
  let contentString = `<div class ="info-window">
                        <h3><i class="fa fa-home"></i></h3>
                        <p>${$('#search-box').val()}</p>
                      </div>`;
  addEventListner(marker, contentString);
}

//calculate straight line distance from current location to bus stops
function calcDistance (fromLat, fromLng, toLat, toLng) {
      return google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng))*(3.28084);
   }


//zooms in to the selected bus stop location after click event
function selectBusStopFromList(){
  $('#bus-stop-list').on('click', '.listing', function(event){
    event.preventDefault();
    let dest = {'lat': $(this).data('lat'), 'lng': $(this).data('lng')};
    zoomIn($(this));
    calcAndDisplayRoute(dest);
  });
}
$(selectBusStopFromList);

//zooms in to the selected bus stop location after enter key event
function selectBusStopFromListKey(){
  $('#bus-stop-list').on('keydown', '.lists',(function(e){
    if (e.which === 13) {
    let dest = {'lat': $(this).data('lat'), 'lng': $(this).data('lng')};
    zoomIn($(this));
    calcAndDisplayRoute(dest);
  };
  }));
}
$(selectBusStopFromListKey);

//Zoomin to the selected bus stop
function zoomIn(currentElem, ind){

  selectedBusStopLoc = {'lat': $(currentElem).data('lat'), 
                        'lng': $(currentElem).data('lng')};
  state.map .setCenter(selectedBusStopLoc);
  state.map .setZoom(15);
  for (let i = 0; i < state.markers.length; i++){
    if(state.markers[i].getPosition().lat() === $(currentElem).data('lat')) {
      state.markers[i].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    } else {
      state.markers[i].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
    }
  }
}

//Create walking route
function calcAndDisplayRoute(dest) {
  let directionsService = new google.maps.DirectionsService;
  clearRoute();
  state.directionsDisplay.setMap(state.map);
  directionsService.route({
      origin: state.currentLocation,  
      destination: dest,  
      travelMode: 'WALKING'
    }, function(response, status) {
      if (status == 'OK') {
          let trip ={'dist': response.routes[0].legs[0].distance.text,
            'dur' : response.routes[0].legs[0].duration.text}
          state.directionsDisplay.setDirections(response);
      } else {
        showErrorMessage(status);
      }
    });
  sortList();
}

//Callback function to display error messange (if any)
function errorFunction(xhr, status, errorThrown){
  let errorStatus =  errorThrown + ',' + status;
  showErrorMessage(errorStatus);
}

function showErrorMessage(error){
    if (responseStatus[error]) {
      $('#bus-stop-list').html(`${error}: ${responseStatus[error]}`)
    } else {

      $('#bus-stop-list').html(`Error occurred: ${error}`)
    }
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  for (let i = 0; i < state.markers.length; i++) {
    state.markers[i].setMap(null);
  }
  state.markers = [];
}

//clear route information
function clearRoute(){
    if (state.directionsDisplay != null) {
      state.directionsDisplay.setMap(null);
  }
}


