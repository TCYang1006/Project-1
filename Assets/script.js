// hard coded map 
// var map = new ol.Map({
// target: 'map',
  //  layers: [
    //  new ol.layer.Tile({
      //  source: new ol.source.OSM()
      //})
    // ],
    // view: new ol.View({
      // center: ol.proj.fromLonLat([-86.1581, 39.7684]),
      // zoom: 4
   // })
  // });

  document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems);
  });