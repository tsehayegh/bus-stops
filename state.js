let state = (function() {
   return {
      map: null,
      infoWindow: null,
      markers: [],
      directionsDisplay: null,
      currentLocation: {}
   };
}());

let busDirection = (function() {
   return {
      E: 'East',
      W: 'West',
      S: 'South',
      N: 'North'
   };
}());

let responseStatus = (function() {
   return {
      'ZERO_RESULTS': 'No results, non-existent address.',
      'OVER_QUERY_LIMIT': 'You are over your quota.',
      'REQUEST_DENIED': 'Your request was denied.',
      'INVALID_REQUEST': 'The query (address, components, or latlng is missing',
      'UNKNOWN_ERROR': 'The request could not be processed due to a server error. Try again!',
      'busStopCount': 0
   };
}());
