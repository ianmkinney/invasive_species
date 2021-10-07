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
var observations_json = "../static/data/threatened.json"

// Get the data with d3.
d3.json(observations_json).then(function(data) {

  console.log(data['values']);

  // Create a new marker cluster group.
  var markers = L.markerClusterGroup();

  // Loop through the data.
  for (var i = 0; i < data['values'].length; i++) {

    // Set the data location property to a variable.
    var location = data['values'][i][4];

    location = location.replace("{","").replace("}","").split(",");

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
      text:'Bar graph For Taxon Observed',
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
          color: '#7F7F7F'
        }
      },
    },
    yaxis: {
      title: {
        text: 'Number of Observations',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7F7F7F'
        }
      }
    }
  };
  Plotly.newPlot('bar', data, layout);
});
am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_material);
  am4core.useTheme(am4themes_animated);
  // Themes end
  
  // Create chart instance
  var chart = am4core.create("chartdiv", am4charts.XYChart);
  
  
  var observations_json = 'https://raw.githubusercontent.com/ianmkinney/invasive_species/main/static/data/threatened.json'
  
  // Get the data with d3.
  d3.json(observations_json).then(function (data) {
  console.log(data);
  
  var dates = {}
  
    // Loop through the data.
    for (var i = 0; i < data['values'].length; i++) {
  
      // Set the data location property to a variable.
      var time = data['values'][i][1];
      if (time == null) {
          continue
      }
      var date = time.substring(0,9)
      if (date in dates) {
          dates[date] += 1 
          
      } else {
          dates[date] = 1
      }
    }
  
  console.log(dates)
  var date_entry = Object.entries(dates).map(function(entry){
      return{
          "date": entry[0], 
          "value": entry[1]
      }
  }).sort(function(a, b) {
      var dateA = a.date.toUpperCase(); // ignore upper and lowercase
      var dateB = b.date.toUpperCase(); // ignore upper and lowercase
      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
  
  console.log(date_entry)
  
  chart.data = date_entry
  
  });
  
  
  
  // Set input format for the dates
  chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
  
  // Create axes
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  
  // Create series
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "value";
  series.dataFields.dateX = "date";
  series.tooltipText = "{value}"
  series.strokeWidth = 2;
  series.minBulletDistance = 15;
  
  // Drop-shaped tooltips
  series.tooltip.background.cornerRadius = 20;
  series.tooltip.background.strokeOpacity = 0;
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.label.minWidth = 40;
  series.tooltip.label.minHeight = 100;
  series.tooltip.label.textAlign = "middle";
  series.tooltip.label.textValign = "middle";
  
  // Make bullets grow on hover
  var bullet = series.bullets.push(new am4charts.CircleBullet());
  bullet.circle.strokeWidth = 2;
  bullet.circle.radius = 4;
  bullet.circle.fill = am4core.color("#fff");
  
  var bullethover = bullet.states.create("hover");
  bullethover.properties.scale = 1.3;
  
  // Make a panning cursor
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.behavior = "panXY";
  chart.cursor.xAxis = dateAxis;
  chart.cursor.snapToSeries = series;

  var label = chart.createChild(am4core.Label);
  label.text = "Number of Observations over Time";
  label.fontSize = 20;
  label.align = "center";
  
  // Create vertical scrollbar and place it before the value axis
   chart.scrollbarY = new am4core.Scrollbar();
  chart.scrollbarY.parent = chart.leftAxesContainer;
  chart.scrollbarY.toBack();
  
  // Create a horizontal scrollbar with previe and place it underneath the date axis
  // chart.scrollbarX = new am4charts.XYChartScrollbar();
  // chart.scrollbarX.series.push(series);
  // chart.scrollbarX.parent = chart.bottomAxesContainer;
  
  dateAxis.start = 0.79;
  dateAxis.keepSelection = true;
  
  
  }); // end am4core.ready()