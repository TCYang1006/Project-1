var myApiKey = "kHDMctExxPE8FJUNZrAuZBPqgpONcvnq"
var searchButton = document.getElementById('searchBtn')
var searchedCities = [];
var cityList = $("#city-list");
var startDate = moment().format();
var daysAdd = 6;
var endDate = moment().add(6, 'd').format();
var TCYang100622ApiKey = "f6f99b4eef66d2120612d0e1e2bb8814";
var units = "Imperial";
var longitude;
var lattitude;
var coordinates = [];

/* function eventSearch() {
    var search = document.getElementById('search').value;
    fetch (
    'https://app.ticketmaster.com/discovery/v2/events?' + 'apikey=' + myApiKey + '&radius=50&locale=*&city=' + search + '&includeSpellcheck=yes'
    )
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        console.log(response);
    });
}
 */

function getEvents(search) {
  var search = document.getElementById('search').value;
  $('#events-panel').show();

  if (search < 0) {
    search = 0;
    return;
  }
  if (search > 0) {
    if (search > getEvents.json.search) {
      search = 0;
    }
  }

  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + search + "&units=" + units + "&appid=" + TCYang100622ApiKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);

      lattitude = response.coord.lat;
      longitude = response.coord.lon;

      coordinates[0] = lattitude;
      coordinates[1] = longitude;


  mapboxgl.accessToken = 'pk.eyJ1IjoidGN5YW5nMTAwNjIyMjIiLCJhIjoiY2t0dzQwN3BjMHE0cjJ3cW1hODZrajdqbyJ9.mLUECHrYP03JAM8bV78VpQ';
  const start = [-100.86, 38.27];
  const end = [longitude, lattitude];
  const map = new mapboxgl.Map({
    container: 'map2',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: start,
    zoom: 3
  });

  let isAtStart = true;

  document.getElementById('fly').addEventListener('click', () => {
    // depending on whether we're currently at point a or b, aim for
    // point a or b
    const target = isAtStart ? end : start;

    // and now we're at the opposite point
    isAtStart = !isAtStart;

    map.flyTo({
      // These options control the ending camera position: centered at
      // the target, at zoom level 9, and north up.
      center: target,
      zoom: 9,
      bearing: 0,

      // These options control the flight curve, making it move
      // slowly and zoom out almost completely before starting
      // to pan.
      speed: 0.2, // make the flying slow
      curve: 1, // change the speed at which it zooms out

      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing: (t) => t,

      // this animation is considered essential with respect to prefers-reduced-motion
      essential: true
    });
  });
});

  $.ajax({
    type: "GET",
    url: 'https://app.ticketmaster.com/discovery/v2/events?' + 'apikey=' + myApiKey + '&radius=50&locale=*&city=' + search + '&startDateTime=' + startDate + '&endDateTime=' + endDate + '&includeSpellcheck=yes',
    async: true,
    dataType: "json",
    success: function (json) {
      getEvents.json = json;
      showEvents(json);
      console.log(showEvents);
    },
    error: function (xhr, status, err) {
      console.log(err);
    }
  });
}

function showEvents(json) {
  var items = $('#events .list-group-item');
  items.hide();
  var events = json._embedded.events;
  var item = items.first();
  for (var i = 0; i < events.length; i++) {
    item.children('.list-group-item-heading').text(events[i].name);
    item.children('.list-group-item-text').text(events[i].dates.start.localDate);
    try {
      item.children('.venue').text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
    } catch (err) {
      console.log(err);
    }
    item.show();
    item.off("click");
    item.click(events[i], function (eventObject) {
      console.log(eventObject.data);
      try {
        getAttraction(eventObject.data._embedded.attractions[0].id);
      } catch (err) {
        console.log(err);
      }
    });
    item = item.next();
  }
}

/* init();
function init(){
    var storedCities = JSON.parse(localStorage.getItem("searchedCities"));

    if (storedCities !== null) {
        cities = storedCities;
    }
    getEvents();
}
 */
function storeCities() {
  localStorage.setItem("searchedCities", JSON.stringify(cities));
  console.log(localStorage);
}

function renderCities() {
  cityList.empty();

  for (var i = 0; i < cities.length; i++) {
    var city = searchedCities[i];

    var li = $("<li>").text(city);
    li.attr("id", "listC");
    li.attr("data-city", city);
    li.attr("class", "list-group-item");
    console.log(li);
    cityList.prepend(li);
  }
  if (!city) {
    return
  }
  else {
    eventSearch(city)
  };
}
function clearSaved() {
  localStorage.clear();
}