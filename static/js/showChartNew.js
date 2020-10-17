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

/////////////////////////////////////////////////////////////////////////////////////////////////////
// function3: radio check value
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getCheckedRadioValue(radioGroupName) {
    var rads = document.getElementsByName(radioGroupName);
    for (i = 0; i < rads.length; i++)
        if (rads[i].checked)
            return rads[i].value;
    return null; // or undefined, or your preferred default for none checked
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
// function4: get the top 10 country by json Key
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getTop10(sample, option, sortType) {
    // option is key
    var sortedList;


    if (sortType === 0) {

        sortedList = sample.sort((a, b) => b[option] - a[option]);

    } else {

        sortedList = sample.sort((a, b) => a[option] - b[option]);
    }

    // cut 10 json from list 
    var showData = sortedList.slice(0, 10)

    return showData;

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// function5: build bar charts
/////////////////////////////////////////////////////////////////////////////////////////////////////

function buildBar(countryInfo, compartion) {


    checkedValue = getCheckedRadioValue("type");
    if (checkedValue === 'Ascent') {

        showData = getTop10(countryInfo, compartion, 0); // ascent 


    } else {

        showData = getTop10(countryInfo, compartion, 1); //Descend

    }


    // showData = getTop10(countryInfo, compartion);

    var traceDisplay1 = [{
        // x value 
        x: showData.map(item => item[compartion]).reverse(),
        // y value 
        y: showData.map(item => item.country).reverse(),
        // set y value as the lable 
        labels: showData.map(item => item.country).reverse(),
        //show label for text display 
        text: showData.map(item => item[compartion]).reverse(),
        //show bar chart
        type: "bar",
        //set the orient
        orientation: "h",

        marker: {
            color: checkedValue === 'Ascent' ? 'blue' : 'red',
            opacity: 0.7,
        }

    }];
    // Bar layout
    var disPlayLayout1 = {
        title: { text: (checkedValue === 'Ascent' ? "The top 10 country for " : "The last 10 country for ") + getDropDown(compartion) },
        autosize: true,
        // height: 400,
        // width: 400,
        margin: {
            l: 100,
            r: 10,
            b: 20,
            t: 30,
            pad: 0
        },
        showlegend: false
    };
    //Plotly to plot bar chart layout 
    Plotly.newPlot("bar", traceDisplay1, disPlayLayout1, { displayModeBar: false });

}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// function6: bubble chart
/////////////////////////////////////////////////////////////////////////////////////////////////////

function showbubbleChart(countryInfo, compartion) {


    checkedValue = getCheckedRadioValue("type");

    if (checkedValue === 'Ascent') {

        showData = getTop10(countryInfo, compartion, 0); // ascent 

    } else {

        showData = getTop10(countryInfo, compartion, 1); //Descend

    }


    var scaleMax = d3.max(showData.map(item => item[compartion]))

    showBubbleSize = showData.map(item => item[compartion] / scaleMax * 50)



    //create a trace bubble
    var traceDisplay2 = [{
        x: showData.map(item => item.country), //X axis, show experiment ID
        y: showData.map(item => item[compartion]), //Y axis, show experiment result
        text: showData.map(item => item[compartion]), // show dynamic info on the bar

        textposition: 'auto',
        mode: 'markers',
        marker: {
            size: showBubbleSize, // the size of the bubble by the value of experiment 
            color: showBubbleSize
            // colorscale: "Earth"
        }

    }];

    // BUbble chart layout 
    var disPlayLayout2 = {
        autosize: true,
        xaxis: { title: "Country" },
        title: (checkedValue === 'Ascent' ? "The top 10 country for " : "The last 10 country for ") + getDropDown(compartion),
        config: {
            'displayModeBar': true
        }
    };
    // bubble chart layout
    Plotly.newPlot('bubble', traceDisplay2, disPlayLayout2);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// function7: build box chart
/////////////////////////////////////////////////////////////////////////////////////////////////////
function buildBox(newOption, displaySwitch) {

    if ((newOption === "gdp_per_capita") && !displaySwitch) {


        Plotly.purge("boxChart");



    } else if ((newOption === "growthrate") && !displaySwitch) {
        Plotly.purge("boxChart2");
    } else if ((newOption === "happiestScore") && !displaySwitch) {
        Plotly.purge("boxChart3");

    } else {
        d3.json(`/getCountryData`, function (countryInfo) {

            var trace1 = {
                y: countryInfo.map(item => item[newOption]),
                boxpoints: "all",
                text: countryInfo.map(item => item.country),
                type: "box",
                labels: getDropDown(newOption)
            };

            var data = [trace1];

            var layout = {
                title: `${getDropDown(newOption)} box plot`
            };

            switch (newOption) {
                case 'happiestScore':
                    Plotly.newPlot("boxChart3", data, layout);

                    break;
                case 'growthrate':
                    Plotly.newPlot("boxChart2", data, layout);
                    break;
                case 'gdp_per_capita':
                    Plotly.newPlot("boxChart", data, layout);
                    break;
                default:
                    return '';
            }



        });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// function8: show country info
/////////////////////////////////////////////////////////////////////////////////////////////////////
function showInfo(countryName) {



    //lookup the data by experiment name 
    d3.json(`/metadata/${countryName}`, function (countryIno) {


        // selection variable in order to update info
        var sample_metadata = d3.select("#sample-metadata");
        // clear the html
        sample_metadata.html("");

        var nf = Intl.NumberFormat();

        var row = sample_metadata.append("h4");
        row.text(`Country: ${countryIno["Country Name"]}`);
        row = sample_metadata.append("p");
        row.text(`GDP per capita: $${nf.format(countryIno["GDP per capita"])}`);
        row = sample_metadata.append("p");
        row.text(`Population: ${nf.format(countryIno["Population"])}`);
        row = sample_metadata.append("p");
        row.text(`Growth Rate: ${nf.format(countryIno["Growth Rate"] * 100)}%`);
        row = sample_metadata.append("p");
        row.text(`Area: ${nf.format(countryIno["Area"])} km²`);
        row = sample_metadata.append("p");
        row.text(`Population Density: ${nf.format(countryIno["Population Density"])}km²`);


        // Use Object.entries to add each key and value pair to the panel
        // Object.entries(showJson).forEach(([key, value]) => {
        //     var row = sample_metadata.append("p");
        //     row.text(`${key}: ${value}`);
        // })
    })

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// function9: for the licener, when you click submit
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Submit Button handler
function handleSubmit() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
    // Select the input value from the form
    var countryInput = d3.select("#countryInput").node().value;
    // clear the input value
    d3.select("#countryInput").node().value = "";

    d3.json(`/metafindcountry/${countryInput}`, function (findCountry) {



        if (findCountry["findIt"] === 1) {

 
            console.log("--------2------------")

            changeCountry(countryInput);
            showInfo(countryInput);

        } else {
            alert("Sorry, Country not found.");
        }


    })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// function10: when dropdown option change for country name 
/////////////////////////////////////////////////////////////////////////////////////////////////////
function counrtyChanged(countryName) {

    changeCountry(countryName);
    showInfo(countryName);
 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
// function11: when dropdown option change for option
/////////////////////////////////////////////////////////////////////////////////////////////////////

function optionChanged(column) {

    var newOption = getColumnsName(column);

    buildCharts(newOption);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// function12 : when dropdown option change for option
/////////////////////////////////////////////////////////////////////////////////////////////////////
// function optionBoxChanged(column) {

//     var newOption = getColumnsName(column);

//     buildBox(newOption);
// }


/////////////////////////////////////////////////////////////////////////////////////////////////////
// function13: build all charts
/////////////////////////////////////////////////////////////////////////////////////////////////////
function buildCharts(compartion) {

    d3.json(`/getCountryData`, function (countryInfo) {
        // Build bar chart
        buildBar(countryInfo, compartion);
        // build bubble Chart
        showbubbleChart(countryInfo, compartion);
        //build box Chart

        buildBox('gdp_per_capita', true)
        // buildBox('growthrate', true);
        // buildBox('happiestScore', true);



    });

}
/////////////////////////////////////////////////////////////////////////////////////////////////////
// function14: init the page when loading data 
/////////////////////////////////////////////////////////////////////////////////////////////////////
function init() {
    // Set up the dropdown menu
    // Grab a reference to the dropdown select element
    var selector1 = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/getCompartionList", function (compartion) {

        var dropcontent = compartion.map(item => getDropDown(item));

        dropcontent.forEach((instance) => {
            selector1
                .append("option")
                .text(instance)
                .property("value", instance);
        });



        const defaultCompartion = compartion[0];

        buildCharts(defaultCompartion);


    });

    var selector2 = d3.select("#selCountry");
    d3.json("/getCountryName", function (countryName) {

        countryName.forEach((instance) => {
            selector2
                .append("option")
                .text(instance)
                .property("value", instance);
        });
        showInfo(countryName[0]);

    });

    d3.select("#submit").on("click", handleSubmit);


}




init();

function checkboxChanged1(value) {


    buildBox('gdp_per_capita', value)
}
function checkboxChanged2(value) {

    buildBox('growthrate', value);
}

function checkboxChanged3(value) {

    buildBox('happiestScore', value);
}











