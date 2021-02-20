
// API 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  
  

  function pointToLayer(feature, latlng) {

    function getmag (feature) {
        mag = feature.properties.mag
        return mag * 3
    }

    function getdepth (feature) {
        depth = feature.geometry.coordinates[2]

        if (depth <=10) {
            return  "#32a84a"
        }
        else if (depth >10 && depth<= 30) {
            return  "#ebe83b"
        }
        else if (depth >30 && depth<= 50) {
            return  "#f2c530"
        }
        else if (depth >50 && depth<= 70) {
            return  "#f09e1a"
        }
        else if (depth >70 && depth<= 90) {
            return  "#f288e9"
        }
        else {
            return  "#ed183f"
        }
        
    }
  
    var geojsonMarkerOptions = {
      radius: getmag(feature),
      fillColor: getdepth (feature),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    return L.circleMarker(latlng, geojsonMarkerOptions);
    
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
    Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

    // Set up the legend
    // var legend = L.control({ position: "bottomright" });
    // legend.onAdd = function() {
    // var div = L.DomUtil.create("div", "info legend");
    // var limits = geojson.options.limits;
    // var colors = geojson.options.colors;
    // var labels = [];


    // div.innerHTML = legendInfo;

    // limits.forEach(function(limit, index) {
    //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    // });

    // div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    // return div;
    // };

    // // Adding legend to the map
    // legend.addTo(myMap);

}
