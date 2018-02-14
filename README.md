Nearest Bus Stop
in Chapel Hill, North Carolina

App available on [Github Pages](https://tsehayegh.github.io/bus-stops/)

<img width="1665" alt="start page large screen" src="https://user-images.githubusercontent.com/34139675/36075446-184b5bee-0f1d-11e8-82a3-ff0e925cb4c2.png">
<img width="573" alt="start page small screen" src="https://user-images.githubusercontent.com/34139675/36075452-225b6ce6-0f1d-11e8-85b2-fef645c4375b.png">
<img width="1675" alt="display page large screen" src="https://user-images.githubusercontent.com/34139675/36075455-29bf5a7e-0f1d-11e8-8ef4-2a4490f8caa5.png">
<img width="322" alt="display page small screen" src="https://user-images.githubusercontent.com/34139675/36075460-3794cc4c-0f1d-11e8-9ee9-d86743a4c7ab.png">

People always travel to different cities whether for a business, vacation, or other issues. Most of them depend on public transportation to visit places during their stay in the city. Some may take taxis, trains, or buses. This web application is designed to help anyone looking to find the closest bus stop(s) from their current locations in Chapel Hill, North Carolina. The user will enter a full address of the current location and the app will show all bus stops within half a kilometer(assuming a half kilomter is a reasonal walking distance) from the current location. For this capstone project, Chapel Hill, a city in North Carolina, which has open data and API for its transit system is used and I was able to apply all of the technical requirements for the the capstone project.But the app can be scaled for any city.

Once the user enters the complete address of the current location and hit enter key or press the Search button, a list of bus stops within half of a kilomter radius will be shown on the right or top side of the screen. The position of the list depends on the device screen size and its orientation. The list of bus stops is sorted in ascending order based on the straight line distance from the current location of the user. The user can scroll up and down the list and when selected any of the bus stops, a zoomed in of the bus stop location and walking route will be shown on the map. The walking distance and the straight line distance my not be the same. Google Matrix Api allows only 2500 requests per day, as such I used a straight line distance in order to avoid quota limit. 

For the future, the app can be sclaed up to work in any city, and other features can be added to it. For example, it can be developed more to show the bus schedules and list them by time that the bus arrives at the bus stop or show walking distance and time to the selected bus stop.

Technologies used
HTML/CSS/JAVASCRIPT/JQUERY/AJAX/API
