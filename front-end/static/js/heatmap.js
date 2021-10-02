var myMap = L.map("map", {
  // center: [37.7749, -122.4194],
  center: [27.571944301, -99.4350287877],
  zoom: 7
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// var url = "https://data.sfgov.org/resource/cuks-n6tp.json?$limit=10000";

d3.json("location.json").then(function(response) {

  console.log(response);
  
  var heatArray = [];

  for (var i = 0; i < response.length; i++) {
    // var location = response[i].location;
    var long = response[i].longitude
    var latt = response[i].latt
    console.log(latt)
    console.log(long)
    if (latt) {
      L.marker([latt, long]).addTo(myMap);
    }
  }

  // var heat = L.marker(heatArray).addTo(myMap);

});
