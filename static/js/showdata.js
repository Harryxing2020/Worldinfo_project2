
var listData;



/////////////////////////////////////////////////////////////////////////////////////////////////////
// function1: return the name for display
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getDropDown(item) {

    switch (item) {
        case 'happiestScore':
            return 'Happiest Score';
            break;
        case 'population':
            return 'Population';
            break;
        case 'growthrate':
            return 'Growth Rate';
            break;
        case 'countrysize':
            return 'Area';
            break;
        case 'pop_den':
            return 'Population Density';
            break;
        case 'gdp_per_capita':
            return 'GDP Per Capita';
            break;

        default:
            return '';
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// function2: return the name for option
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getColumnsName(item) {

    switch (item) {
        case 'Happiest Score':
            return 'happiestScore';
            break;
        case 'Population':
            return 'population';
            break;
        case 'Growth Rate':
            return 'growthrate';
            break;
        case 'Area':
            return 'countrysize';
            break;
        case 'Population Density':
            return 'pop_den';
            break;
        case 'GDP Per Capita':
            return 'gdp_per_capita';
            break;

        default:
            return '';
    }
}





/////////////////////////////////////////////////////////////////////
function sortData(headListText) {

    if (listData[0][headListText] < listData[1][headListText]) {
        sortedData = listData.sort((a, b) => b[headListText] - a[headListText]);
    } else {

        sortedData = listData.sort((a, b) => a[headListText] - b[headListText]);
    }

    return sortedData;
}
/////////////////////////////////////////////////////////////////////
function displayDataBody(displayData) {

    var tbody = d3.select("tbody");
    // tbody.style("text-align", "center");
    tbody.style("text-align", "center")
    tbody.html("");
    if (displayData.length == 0) {
        d3.select("tbody")
            .append("tr")
            .append("td")
            .attr("colspan", 7)
            .html("<h5>Sorry, no country records found</h5>");
    } else {
        // show the data from json data
        displayData.forEach(function (countrydata) {
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
                else if (key === 'country') {
                    cell.text(value);
                } else {
                    cell.text(nf.format(value));
                }
            })
        })

    }

}

/////////////////////////////////////////////////////////////////////


function displayDataHead() {

    d3.select("#filter-btn-filter").on("click", function () {

        var inputvalue = d3.select("#inputvalue").node().value;

        if (isNaN(inputvalue) || inputvalue==="" ) {
            alert("Must input numbers");

        } else {

            compareValue = parseInt(inputvalue);
            var critial =getColumnsName( d3.select("#critial").node().value);
            var fomula = d3.select("#fomula").node().value;

            function compareFilter(item) {
                if (fomula === 'morethan') {

                    return item[critial] > compareValue

                } else if (fomula === 'lessthan') {
                    return item[critial] < compareValue

                } else {

                    return item[critial] === compareValue

                }

            };
        
            displayDataBody(listData.filter(compareFilter));

        }

    });




    d3.select(".ufo-table").style("text-align", "center");
    var thead = d3.select("thead");
    var row = thead.append("tr");
    var table = d3.select("table");

    table.style("border", "1px solid black")

    thead.style("text-align", "center")

    thead.style("background-color", "grey")
    thead.style("color", "black")

    columns = Object.keys(listData[0]);


    columns.forEach(item => {
        var cell = row.append("th");


        if (item != 'country') {

            cell.attr("id", "listContent");

            var button = cell.append("button");
            button.text(getDropDown(item));

        } else {
            cell.text("Country: ");
            var input = cell.append("input");

            input.attr("id", "countryinput");
        }

    });

    d3.selectAll("#listContent").on("click", function () {
        var headList = d3.select(this);
        var headListText = headList.text();
        displayDataBody(sortData(getColumnsName(headListText)));


    });


    d3.select("#countryinput").on("change", function () {
        var newText = d3.event.target.value;
        d3.event.target.value = "";

        function getCountryData(country) {
            return country.country === newText

        }


        displayDataBody(listData.filter(getCountryData));

    });

}

/////////////////////////////////////////////////////////////////////
// 
/////////////////////////////////////////////////////////////////////

function buliddropdown(conntryinfo) {


    var selector10 = d3.select("#critial");

    var dropcontent = Object.keys(conntryinfo[0]);

    dropcontent.forEach((instance) => {

        if (instance != 'country') {

            selector10
                .append("option")
                .text(getDropDown(instance))
                .property("value", getDropDown(instance));
        }
    });



}



var counter = 1;


function init() {

    d3.json("/getCountryData", function (conntryinfo) {
        listData = conntryinfo;
        displayDataHead();
        displayDataBody(conntryinfo);
        buliddropdown(conntryinfo);
    });

}


init()



