var myMap = L.map("map2", {
  center: [65.800720, 26.489941],
  zoom: 4
});

var worldGeoMap;


function buildMaps2(countrys_info) {

  d3.json("/static/data/countries.geo.json", function (countryMapData) {
    updataJsonData2(countryMapData, countrys_info);

    worldGeoMap = countryMapData;
    createFeatures2(countryMapData);
  });
}

function changeCountry(countryName) {



  function getName(countryGeo) {

    if ((countryGeo.properties.admin === countryName) || ((countryGeo.properties.admin === 'United States of America') && (countryName === 'United States')))
      return true;
    return false;
  }
  // console.log(worldGeoMap.features.filter(getName));

  // console.log(worldGeoMap.features.filter(getName)[0].geometry);

  if (worldGeoMap.features.filter(getName).length > 0) {
    address = worldGeoMap.features.filter(getName)[0].geometry.coordinates[0][0];

    // console.log(address)
    if (address.length > 2) {
      address = address[0]
    }


    myMap.setView({lat:address[1], lng:address[0]}, 3)
  }

}


function init2() {

  d3.json("/getCountryData", function (countrys_info) {
    buildMaps2(countrys_info);
  });


}

init2();

///////////////////////////////////////////////////////////////////////
// function1: load data  
///////////////////////////////////////////////////////////////////////
function updataJsonData2(countryMapData, countrys_info) {

  countryMapData.features.forEach(countryInfo => {

    var varcountryName = countryInfo.properties.admin
    function findCountry2(country) {
      if ((country.country.toLowerCase() === varcountryName.toLowerCase()) ||
        ((varcountryName === 'United States of America') && (country.country === 'United States'))) {

        // add new feature for geojson
        countryInfo.properties.population = country.population;
        countryInfo.properties.growthrate = country.growthrate;
        countryInfo.properties.gdp_per_capita = country.gdp_per_capita;
        countryInfo.properties.countrysize = country.countrysize;
        countryInfo.properties.happiestScore = country.happiestScore;
        return true;
      } else {
        return false;
      }
    }
    // filter() uses the custom function as its argument
    countrys_info.filter(findCountry2);
  })

}

///////////////////////////////////////////////////////////////////////
// function1: end 
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// function2: return the color value 
///////////////////////////////////////////////////////////////////////

function getColorValue(number) {

  if (number >= 50000) {
    return 'green'
  } else if (number >= 35000) {
    return '#32CD32'
  } else if (number >= 20000) {
    return '#00FA9A'
  } else if (number >= 10000) {
    return '#FF8C00'
  } else if (number >= 5000) {
    return '#FFA07A'
  } else if (number >= 2000) {
    return '#FF00FF'
  } else if (number > 0) {
    return '#B22222'
  } else {
    return '#B22222'
  }
}


///////////////////////////////////////////////////////////////////////
// function2: end
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// function3: add Legend
///////////////////////////////////////////////////////////////////////

function addLegend() {
  // Create a legend for the map
  var legend = L.control({ position: 'bottomleft' });
  // Legend will be called once map is displayed
  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');

    var legendInfo = "<p>GDP per capita (Int$)</p>";

    div.innerHTML = legendInfo;

    // setup the depth 
    var limits = [0, 2000, 5000, 10000, 20000, 35000, 50000];
    // Loop through our magnitude intervals and generate a label with a colored square for each interval
    for (var i = 0; i < limits.length; i++) {
      var newHtml = `<i style="background: ${getColorValue(limits[i])}"></i>`;
      newHtml += limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
      div.innerHTML += newHtml;
    }

    return div;
  };
  // Add the legend to the map
  return legend;
}

///////////////////////////////////////////////////////////////////////
// function3: end 
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// function4: create circles and tectonicplates
///////////////////////////////////////////////////////////////////////
function createFeatures2(countryData) {

  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);



  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var choroplethMap =
    L.geoJson(countryData, {
      // Style each feature (in this case a neighborhood)
      style: function (feature) {
        return {
          color: "white",
          // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
          fillColor: getColorValue(feature.properties.gdp_per_capita),
          fillOpacity: 0.5,
          weight: 1.5
        };
      },
      // Called on each feature
      onEachFeature: function (feature, layer) {
        // Set mouse events to change map styling
        layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function (event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function (event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
          // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
          click: function (event) {
            myMap.fitBounds(event.target.getBounds());
          }
        });

        var popupString = `<h5>Country: ${feature.properties.admin}</h5><hr>`;
        var nf = Intl.NumberFormat();

        if (feature.properties.population) {
          popupString += `<p>Population: ${nf.format(feature.properties.population)}</p>`;
          popupString += `<p>Population growth rate: ${nf.format(feature.properties.growthrate * 100)}%</p>`;
          popupString += `<p>GDP per Capita: ${nf.format(feature.properties.gdp_per_capita)} USD</p>`;
          popupString += `<p>Country Size: ${nf.format(feature.properties.countrysize)} (km²)</p>`;
          popupString += `<p>Happiest: ${nf.format(feature.properties.happiestScore)} Score</p>`;
        } else {
          popupString += `<p>Data is not available for the country. </p>`;
        }

        layer.bindPopup(popupString);

      }
    }).addTo(myMap);


  // createMap(choroplethMap, myMap)

}

///////////////////////////////////////////////////////////////////////
// function4: end
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// function5: create the map 
///////////////////////////////////////////////////////////////////////
function createMap(choroplethMap, myMap) {

  // Adding tile layer
  var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  })

  // Define streetmap and darkmap layers
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.satellite", //satellite
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Grayscale": grayscaleMap,
    "Satellite": satelliteMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Choropleth": choroplethMap
  };

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  addLegend().addTo(myMap);

}


  ///////////////////////////////////////////////////////////////////////
  // function5: end
  ///////////////////////////////////////////////////////////////////////
