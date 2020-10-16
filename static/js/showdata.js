
var tbody = d3.select("tbody");
var table = d3.select("table");
tbody.style("text-align", "center")
/////////////////////////////////////////////////////////////////////
//Display tables
function displayData(showData) {
    // clear data 
    tbody.html("");
    // cannot find any data 
    if (showData.length == 0) {
        d3.select("tbody")
            .append("tr")
            .append("td")
            .attr("colspan", 7)
            .html("<h5>Sorry, no records found</h5>");
    } else {
        // show the data from json data
        showData.forEach(function (countrydata) {
            var row = tbody.append("tr")
            Object.entries(countrydata).forEach(function ([key, value]) {
                var cell = row.append("td")

                var nf = Intl.NumberFormat();

                if (key === 'growthrate') {

                    cell.text(nf.format(value * 100) + "%")

                } else if (key === 'countrysize') {

                    cell.text(value + " km²");
                } else if (key === 'gdp_per_capita') {

                    cell.text("$" + nf.format(value));
                } else if (key === 'pop_den') {

                    cell.text(nf.format(value) + "/km²");
                }
                else if (key === 'country'){
                    cell.text(value);
                } else {
                    cell.text(nf.format(value));
                }



            })
        })

    }

}

/////////////////////////////////////////////////////////////////////
// show all ufo data in dataset
/////////////////////////////////////////////////////////////////////


function init() {

    d3.json("/getCountryData", function (conntryinfo) {

        displayData(conntryinfo);

    });

}


init()



