Nearest Bus Stop
Chapel Hill, North Carolina

<img width="1680" alt="start page large screen" src="https://user-images.githubusercontent.com/34139675/36075239-05d813d8-0f1a-11e8-8b0d-c2438051ad24.png">
<img width="1680" alt="start page small screen" src="https://user-images.githubusercontent.com/34139675/36075240-161843e4-0f1a-11e8-9d60-8995b347f7fa.png">
<img width="1680" alt="display page small screen" src="https://user-images.githubusercontent.com/34139675/36075242-1ecef14a-0f1a-11e8-8596-49376bf156c8.png">
<img width="1680" alt="display page large screen" src="https://user-images.githubusercontent.com/34139675/36075245-23fc9258-0f1a-11e8-8750-c2a571454c62.png">

People always travel to different cities whether for a business, vacation, or other issues. Most of them depend on public transportation to visit places during their stay in the city. Some may take taxis, trains, or buses. This web application is designed to help anyone looking to find the closest bus stop(s) from their current locations in Chapel Hill, North Carolina. The user will enter a full address of the current location and the app will show all bus stops within half a kilometer(assuming a half kilomter is a reasonal walking distance) from the current location. For this capstone project, Chapel Hill, a city in North Carolina, which has open data and API for its transit system is used and I was able to apply all of the technical requirements for the the capstone project.But the app can be scaled for any city.

Once the user enters the complete address of the current location and hit enter key or press the Search button, a list of bus stops within half of a kilomter radius will be shown on the right or top side of the screen. The position of the list depends on the device screen size and its orientation. The list of bus stops is sorted in ascending order based on the straight line distance from the current location of the user. The user can scroll up and down the list and when selected any of the bus stops, a zoomed in of the bus stop location and walking route will be shown on the map. The walking distance and the straight line distance my not be the same. Google Matrix Api allows only 2500 requests per day, as such I used a straight line distance in order to avoid quota limit. 

For the future, the app can be sclaed up to work in any city, and other features can be added to it. For example, it can be developed more to show the bus schedules and list them by time that the bus arrives at the bus stop or show walking distance and time to the selected bus stop.

Technologies used
HTML/CSS/JAVASCRIPT/JQUERY/AJAX/API
