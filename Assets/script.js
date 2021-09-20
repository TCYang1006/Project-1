var myApiKey = 	"kHDMctExxPE8FJUNZrAuZBPqgpONcvnq"
var searchButton = document.getElementById('searchBtn')
var searchedCities = [];
var cityList =$("#city-list");
var startDate = moment().format();
var daysAdd = 6;
var endDate = moment().add(6, 'd').format();
  console.log(endDate)
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
        search=0;
      }
    }
    
    $.ajax({
      type:"GET",
      url:'https://app.ticketmaster.com/discovery/v2/events?' + 'apikey=' + myApiKey + '&radius=50&locale=*&city=' + search + '&startDateTime='+ startDate + '&endDateTime=' + endDate + '&includeSpellcheck=yes',
      async:true,
      dataType: "json",
      success: function(json) {
            getEvents.json = json;
                  showEvents(json);
               },
      error: function(xhr, status, err) {
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

/* init();
function init(){
    var storedCities = JSON.parse(localStorage.getItem("searchedCities"));

    if (storedCities !== null) {
        cities = storedCities;
    }
    getEvents();
}
 */
function storeCities(){
    localStorage.setItem("searchedCities", JSON.stringify(cities));
    console.log(localStorage);
}

function renderCities() {
    cityList.empty();
    
    for (var i = 0; i < cities.length; i++) {
      var city = searchedCities[i];
      
      var li = $("<li>").text(city);
      li.attr("id","listC");
      li.attr("data-city", city);
      li.attr("class", "list-group-item");
      console.log(li);
      cityList.prepend(li);
    }
    if (!city){
        return
    } 
    else{
        eventSearch(city)
    };
}   
function clearSaved() {
    localStorage.clear();
}