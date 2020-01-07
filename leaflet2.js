
// Create tile layer
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.streets",
accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
    eng_less_100: new L.LayerGroup(),
    eng_less_200: new L.LayerGroup(),
    eng_less_300: new L.LayerGroup(),
    eng_less_400: new L.LayerGroup(),
    eng_great_400: new L.LayerGroup()
  };

// Creating map object
// Chose Merch Mart as the center coordinate
var map = L.map("map2", {
    center: [41.8885, -87.6355],
    zoom: 11,
    layers: [
        layers.eng_less_100,
        layers.eng_less_200,
        layers.eng_less_300,
        layers.eng_less_400,
        layers.eng_great_400
    ]
  });

lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
    "kBTU/sq ft < 100": layers.eng_less_100,
    "kBTU/sq ft < 200": layers.eng_less_200,
    "kBTU/sq ft < 300": layers.eng_less_300,
    "kBTU/sq ft < 400": layers.eng_less_400,
    "kBTU/sq ft >= 400": layers.eng_great_400
  };

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
    position: "bottomleft"
  });
  
  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map
  info.addTo(map);
  
// Initialize an object containing icons for each layer group
var icons = {
    eng_less_100: L.ExtraMarkers.icon({
      icon: "ion-settings",
      iconColor: "white",
      markerColor: "#edf8fb",
      shape: "circle"
    }),
    eng_less_200: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "white",
        markerColor: "#ccece6",
        shape: "circle"
      }),
    eng_less_300: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "white",
        markerColor: "#99d8c9",
        shape: "circle"
    }),
    eng_less_400: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "white",
        markerColor: "#66c2a4",
        shape: "circle"
        }),
    eng_great_400: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "white",
        markerColor: "#005824",
        shape: "circle"
        })
}
d3.csv("Buildings.csv").then((data) => {
        // Create an object to keep of the number of markers in each layer
        var buildingCount = {
            eng_less_100: 0,
            eng_less_200: 0,
            eng_less_300: 0,
            eng_less_400: 0,
            eng_great_400: 0
          };
      
          // Initialize a buildingAge, which will be used as a key to access the appropriate layers, icons, and building age for layer group
          var buildingEff;
      
    // Create a new marker cluster group
    // var markers = L.markerClusterGroup();

    // locations = [];
    for (i = 0; i < data.length; i++) {
        if (data[i].Data_Year >= 2017 && Number(data[i].Site_EUI_kBtu_sqft)<=500) {
            var dataItem = data[i];
            var lat = dataItem.Latitude;
            var long = dataItem.Longitude;
            var energy = parseInt(dataItem.Site_EUI_kBtu_sqft);
            var sqFt = dataItem.SqFt;
            var age = dataItem.Year_Built;
            var color;
            if (energy > 0) {

              if (energy < 100) {
                  buildingEff = "eng_less_100";
                  color = "#edf8fb";
              }
              else if (energy < 200) {
                  buildingEff = "eng_less_200";
                  color = "#ccece6";
              }
              else if (energy < 300) {
                  buildingEff = "eng_less_300";
                  color = "#99d8c9";
              }
              else if (energy < 400) {
                  buildingEff = "eng_less_400";
                  color = "#66c2a4";
              }
              else {
                  buildingEff = "eng_great_400";
                  color = "#005824";
              }
            }
            buildingCount[buildingEff]++;
            // var latLong = [lat, long];
            var newMarker = L.marker([lat, long]
              , {
            icon: icons[buildingEff]
            }
            )
              // Add the new marker to the appropriate layer
            newMarker.addTo(layers[buildingEff]);

                // .addTo(layers[buildingAge])
            newMarker.bindPopup("<h1>" + data[i].Name 
            + "</h1> <hr> <h3>" 
            + "Energy Consumption: " 
            + energy
            + " kBtu/sq ft </h3> <h3>" 
            + "Square Footage: "
            + sqFt
            + " ft^2</h3>"
            + "<h3>"
            + "Year Built: "
            + age
            + "</h3>"
            );
            // locations.push(latLong);
            // console.log(latLong);
        }
    }
    // Call the updateLegend function, which will... update the legend!
    updateLegend(buildingCount);


// map.addLayer(markers);
});

// Update the legend's innerHTML with the last updated time and station count
function updateLegend(buildingCount) {
    document.querySelector(".legend").innerHTML = [
      "<p class='before-1900'>Buildings Where kBTU/sq ft < 100: " + buildingCount.eng_less_100 + "</p>",
      "<p class='between-1900-1920'>Buildings Where kBTU/sq ft Between 100 & 200: " + buildingCount.eng_less_200 + "</p>",
      "<p class='between-1920-1940'>Buildings Where kBTU/sq ft Between 200 & 300: " + buildingCount.eng_less_300 + "</p>",
      "<p class='between-1940-1960'>Buildings Where kBTU/sq ft Between 300 & 400: " + buildingCount.eng_less_400 + "</p>",
      "<p class='between-1960-1980'>Buildings Where kBTU/sq ft > 400: " + buildingCount.eng_great_400 + "</p>"
    ].join("");
  }