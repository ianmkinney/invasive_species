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
var observations_json = "../static/data/introduced.json"

// Get the data with d3.
d3.json(observations_json).then(function (data) {

  // Create a new marker cluster group.
  var markers = L.markerClusterGroup();

  // Loop through the data.
  for (var i = 0; i < data['values'].length; i++) {

    // Set the data location property to a variable.
    var location = data['values'][i][4];

    location = location.replace("{", "").replace("}", "").split(",");

    // Check for the location property.
    if (location) {

      // Add a new marker to the cluster group, and bind a popup.
      markers.addLayer(L.marker([location[0], location[1]])
        .bindPopup(data['values'][i][7], data['values'][i][6]));
    }

  }

  // Add our marker cluster layer to the map.
  myMap.addLayer(markers);
  // console.log(data)

  objList = [];
  obj = {};
  values = data.values.map(obj => obj[5])
  values.forEach(item => {
    if (!objList.includes(item)) {
      objList.push(item);
      obj[item] = 0;
    };
    obj[item] += 1
  })

  var data = [
    {
      x: Object.keys(obj),
      y: Object.values(obj),
      type: 'bar'
    }
  ];
  
  var layout = {
    title: {
      text:'Plot Title',
      font: {
        family: 'Courier New, monospace',
        size: 24
      },
      xref: 'paper',
      x: 0.05,
    },
    xaxis: {
      title: {
        text: 'Taxon Species Name',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
    },
    yaxis: {
      title: {
        text: 'Number of Observations',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      }
    }
  };

  Plotly.newPlot('bar', data, layout);
});
