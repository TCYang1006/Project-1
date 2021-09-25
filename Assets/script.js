var myApiKey = "kHDMctExxPE8FJUNZrAuZBPqgpONcvnq"
var searchButton = document.getElementById('searchBtn')
var searchedCities = [];
var TCYang100622ApiKey = "f6f99b4eef66d2120612d0e1e2bb8814";
var units = "Imperial";
var longitude;
var lattitude;
var coordinates = [];
var clearButton = document.getElementById('clear')
var cities = [];
var cityList = $("#city-list");
var startDate = moment().format();
var daysAdd = 6;
var endDate = moment().add(6, 'd').format();
var weatherContainerEl = document.querySelector("#weather-container");
var li = document.getElementById('city-list');


function getEvents(search) {
  var search = document.getElementById('search').value;
  $('#events-panel').show();

  if (search < 0) {
    search = 3;
    return;
  }
  if (search > 0) {
    if (search > getEvents.json.search) {
      search=0;
    }
  }

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
  for (var i=0;i<events.length;i++) {
    item.children('.list-group-item-heading').text(events[i].name);
    item.children('.list-group-item-text').text(events[i].dates.start.localDate);
    try {
      item.children('.venue').text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
    } catch (err) {
      console.log(err);
    }
    item.show();
    item.off("click");
    item.click(events[i], function(eventObject) {
      console.log(eventObject.data);
      try {
        getAttraction(eventObject.data._embedded.attractions[0].id);
      } catch (err) {
      console.log(err);
      }
    });
    item=item.next();
  }
}


init();

function init() {
  var storedCities = JSON.parse(localStorage.getItem("cities"));

  if (storedCities !== null) {
    cities = storedCities;
  }
  renderCities();
}

function storeCities() {
  localStorage.setItem("cities", JSON.stringify(cities));
  console.log(localStorage);
}
function renderCities() {
  cityList.empty();

  for (var i = 0; i < cities.length; i++) {
    var city = cities[i];

    var li = $("<li>").text(city);
    li.attr("id", "list");
    li.attr("data-city", city);
    li.attr("class", "list-group-item");
    console.log(li);
    cityList.prepend(li);
  }
  if (!city) {
    return
  }
  else {
    getEvents(city);
  };
}

$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  var city = $("#search").val().trim();
  if (city === "") {
    return;
  }
  cities.push(city);
  storeCities();
  renderCities();
});

// forecast and weather function //

var sevenDayForecast = function (cityName) {
  var cityName = document.getElementById('search').value.trim()
  var apiKey = "4aa8b0f77c886819d2b920f429db711e"
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=4aa8b0f77c886819d2b920f429db711e`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data, cityName)
          displayForecast(data, cityName)
        });
      }
    });
}

var displayForecast = function (weather) {
  weatherContainerEl.textContent = ""

  var forecast = weather.list;
  for (var i = 5; i < forecast.length; i = i + 8) {
    var daily = forecast[i];

    var fiveDayEl = document.createElement("div");
    fiveDayEl.classList = "card weather-card hoverable col s12 m2 l2";

    var futureDate = document.createElement("div");
    futureDate.textContent = moment.unix(daily.dt).format("M/D");
    futureDate.classList = "card-title weather-title text-center z-depth-2";
    fiveDayEl.appendChild(futureDate);

    var futureIcon = document.createElement("img");
    futureIcon.setAttribute("src", `https://openweathermap.org/img/wn/${daily.weather[0].icon}.png`);
    fiveDayEl.appendChild(futureIcon);

    var futureTemp = document.createElement("span");
    futureTemp.textContent = "Temp:" + Math.floor(daily.main.temp) + "°";
    futureTemp.classList = "col s12 center-align";
    fiveDayEl.appendChild(futureTemp);

    var futureHumidity = document.createElement("span");
    futureHumidity.textContent = "Humidity:" + (daily.main.humidity) + "%";
    futureHumidity.classList = "col s12 center-align";
    fiveDayEl.appendChild(futureHumidity);

    var futureWind = document.createElement("span");
    futureWind.textContent = "Wind:" + Math.floor(daily.wind.speed) + " mph";
    futureWind.classList = "col s12 center-align";
    fiveDayEl.appendChild(futureWind);

    weatherContainerEl.appendChild(fiveDayEl);
  }
}

var mapBox = function (cityName) {
  var cityName = document.getElementById('search').value.trim()

  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=" + units + "&appid=" + TCYang100622ApiKey)
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
    })
}

searchButton.addEventListener("click", sevenDayForecast);
searchButton.addEventListener("click", mapBox);

// Clearing Previous Searches
function clearStorage() {
  localStorage.clear('cities');
  location.reload();
}
clearButton.addEventListener("click", clearStorage);


$(document).on("click", "#list", function () {
  var thisCity = $(this).attr("data-city");
  getEvents(thisCity);
});
