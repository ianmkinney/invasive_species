// Creating the map object
var myMap = L.map("map", {
  center: [33.74, -83.38],
  zoom: 6
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// To do:

// Store the API query variables.
var observations_json = "../static/data/database.json"

// Get the data with d3.
d3.json(observations_json).then(function(data) {

  console.log(data['values']);

  // Create a new marker cluster group.
  var markers = L.markerClusterGroup();

  // Loop through the data.
  for (var i = 0; i < data['values'].length; i++) {

    // Set the data location property to a variable.
    var location = data['values'][i][4];

    location = location.replace("{","").replace("}","").split(",")


    console.log(location[1])

    // Check for the location property.
    if (location) {

      // Add a new marker to the cluster group, and bind a popup.
      markers.addLayer(L.marker([location[0], location[1]])
        .bindPopup(data['values'][i][2]));
    }

  }

  // Add our marker cluster layer to the map.
  myMap.addLayer(markers);
  
});
