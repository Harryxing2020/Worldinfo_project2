function buildMap(country) {

    d3.json('/getCountryData')
        .then(function (countrys) {

            console.log(countrys);
        });
}


function init() {
    // Set up the dropdown menu
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selmap");

    // Use the list of sample names to populate the select options

    d3.json('/getCountryData')
        .then(function (countrys) {

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