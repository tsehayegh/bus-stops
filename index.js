let map;
let infoWindow = null;
let markers = [];
let directionsDisplay;
let currentLocation = {};

//Initialize google maps
function initMap() {
  let currentLoc = {lat: 35.913200, lng: -79.055847};
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 15,
    center: currentLoc,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
 infoWindow = new google.maps.InfoWindow({
  content: ''
});
 directionsDisplay = new google.maps.DirectionsRenderer;
}


//open search area
function openApp(){
  $('#map-canvas').css('width', '100%');
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
        currentLocation = {'lat': results[0].geometry.location.lat(), 
                          'lng':results[0].geometry.location.lng()};
        addMarkerOnCurrentLoc(currentLocation);
        getBusStopLocation(currentLocation);
        map.setCenter(currentLocation);
        map.setZoom(16);

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
    addBusStopMarkers(currentCoord, markerLocation, 
                    busStopStreet, busStopAt,
                    direction, route);
  });


}

//Add clickable markers for each bus stop
function addBusStopMarkers(currentCoord, coordLocation, 
                          streetLocation, busStopAt,
                          direction,route){             
  let marker = new google.maps.Marker();  
  if (calcDistance(currentCoord.lat, currentCoord.lng, 
                  coordLocation.lat, coordLocation.lng) <= 500){
        marker = new google.maps.Marker({
            position: coordLocation,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            //label: {fontFamily: 'Fontawesome', text: '\uf207', color: 'blue'}
        });
        markers.push(marker);
        showBusStopsList(coordLocation, route, streetLocation, busStopAt, direction);
        $('.lists').first().focus();
        
     let contentString = `<div class ="info-window">
                            <h3><i class="fa fa-bus"></i> ${route}</h3>
                            <p>${streetLocation}</p>
                            <p>At: ${busStopAt}</p>
                            <p>Heading: ${direction}</p>
                          </div>`;
      google.maps.event.addListener(marker, 'click', function(){
        infoWindow.close();
        infoWindow.setContent(contentString);
        infoWindow.open(map,marker);
        
      });
    } 
}

//display bus stops within 1km radius
function showBusStopsList(coordLocation, route, 
                          streetLocation, 
                          busStopAt,
                          direction){ 
  if (direction ==='E'){
    direction = 'East';
  } else if (direction=== 'W') {
    direction ='West';
  } else if(direction=== 'S') {
    direction = 'South';
  } else if (direction=== 'N') {
    direction = 'North';
  }
  let distance = parseInt(calcDistance(currentLocation.lat, currentLocation.lng, 
                              coordLocation.lat, coordLocation.lng));

  $('#bus-stop-list').append(`<li class = "lists" tabindex ='0' data-lat = ${coordLocation.lat}
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
                                  @ ${busStopAt}, Heading ${direction}, ${distance} meters</p>
                                </div>
                            </li>`);  
sortList();                 
}

//Add clickable markers for each bus stop
function addMarkerOnCurrentLoc(currentCoord){
  let marker = new google.maps.Marker();  
  marker = new google.maps.Marker({
      position: currentCoord,
      map: map,
      label: {
      fontFamily: 'Fontawesome', text: '\uf015', color: 'green'}
  });
    
  markers.push(marker);
  let contentString = `<div class ="info-window">
                        <h3><i class="fa fa-home"></i></h3>
                        <p>${$('#search-box').val()}</p>
                      </div>`;
     
  google.maps.event.addListener(marker, 'click', function(){
    infoWindow.close();
    infoWindow.setContent(contentString);
    infoWindow.open(map,marker);
  });
}

//calculate straight line distance from current location to bus stops
function calcDistance (fromLat, fromLng, toLat, toLng) {
      return google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
   }

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

//zooms in to the selected bus stop location after click event
function selectBusStopFromList(){
  $('#bus-stop-list').on('click', '.listing', function(event){
    event.preventDefault();
    let dest = {'lat': $(this).data('lat'), 'lng': $(this).data('lng')};
    calcAndDisplayRoute(dest);
    zoomIn($(this));
  });
}
$(selectBusStopFromList);

//zooms in to the selected bus stop location after enter key event
function selectBusStopFromListKey(){
  $('#bus-stop-list').on('keydown', '.lists',(function(e){
    if (e.which === 13) {
    let dest = {'lat': $(this).data('lat'), 'lng': $(this).data('lng')};
    calcAndDisplayRoute(dest);
    zoomIn($(this));
  };
  }));
}
$(selectBusStopFromListKey);


//Zoomin to the selected bus stop
function zoomIn(currentElem, ind){

  selectedBusStopLoc = {'lat': $(currentElem).data('lat'), 
                        'lng': $(currentElem).data('lng')};
  map.setCenter(selectedBusStopLoc);
  map.setZoom(15);

  for (let i = 0; i < markers.length; i++){
    if(markers[i].getPosition().lat() === $(currentElem).data('lat')) {
      markers[i].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    } else {
      markers[i].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
    }
  }
}

//Callback function to display error messange (if any)
function errorFunction(xhr, status, errorThrown){
  let errorStatus =  errorThrown + ',' + status;
  showErrorMessage(errorStatus);
}

function showErrorMessage(error){
    $('#bus-stop-list').html(`Error occurred: ${error}`)
}

//Create walking route
function calcAndDisplayRoute(dest) {
  let directionsService = new google.maps.DirectionsService;
  clearRoute();
  directionsDisplay.setMap(map);
  directionsService.route({
      origin: currentLocation,  
      destination: dest,  
      travelMode: 'WALKING'
    }, function(response, status) {
      if (status == 'OK') {
          let trip ={'dist': response.routes[0].legs[0].distance.text,
            'dur' : response.routes[0].legs[0].duration.text}
          directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  sortList();
}

//clear route information
function clearRoute(){
    if (directionsDisplay != null) {
      directionsDisplay.setMap(null);
  }
}

//sort the bus stop list
function sortList() {
  $('#bus-stop-list').html(
    $('#bus-stop-list').children('li').sort(function (a,b){
      return $(a).data('distance') - $(b).data('distance');
    })
  );
};