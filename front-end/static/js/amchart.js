am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);


var observations_json = 'https://raw.githubusercontent.com/ianmkinney/invasive_species/main/static/data/database.json'

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