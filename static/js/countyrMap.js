function buildMap(country) {
   
    d3.json("/getCountryData", countrys =>{


        // https://harryxing2020.github.io/worldecomic/static/data/countries.geo.json
        //https://gist.githubusercontent.com/michellechandra/0b2ce4923dc9b5809922/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json

        console.log(countrys);
    })
}


function init() {
    // Set up the dropdown menu
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selmap");

    // Use the list of sample names to populate the select options
    d3.json("/getCountryData", countrys => {
        countrys.forEach((country) => {
            selector
            .append("option")
            .text(country.country)
            .property("value", country.country);
            });
        buildMap(countrys[0].country);
    });
}

function mapChanged(country) {
    // Fetch new data each time a new state is selected
    buildMap(country);
}

init();