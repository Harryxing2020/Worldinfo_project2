
function moveRight() {


    var selectElement = document.getElementById("first");
    var optionElements = selectElement.getElementsByTagName("option");
    var len = optionElements.length;


    if (!(selectElement.selectedIndex == -1))   
    {

        var selectElement2 = document.getElementById("secend");


        for (var i = 0; i < len; i++) {
            if (selectElement.selectedIndex >= 0) {
                selectElement2.appendChild(optionElements[selectElement.selectedIndex]);
            }
        }
    } else {
        alert("Please select one！");
    }
}


 
function moveLeft() {
    var selectElement = document.getElementById("secend");
    var optionElement = selectElement.getElementsByTagName("option");
    var len = optionElement.length;

    if (!(selectElement.selectedIndex == -1)) {
        var firstSelectElement = document.getElementById("first");

        for (i = 0; i < len; i++) {

            if (selectElement.selectedIndex >= 0) {

                firstSelectElement.appendChild(optionElement[selectElement.selectedIndex]);
            }

        }
    } else {
        alert("Please select one！");
    }
}


function mutipleIni() {

    var selector5 = d3.select("#first");
    d3.json("/getCountryName", function (countryName) {
        countryName.forEach((instance) => {
            selector5
                .append("option")
                .text(instance)
                .property("value", instance);
        });

    });

}

mutipleIni();



function mutiListChanged() {

    var selectElement = document.getElementById("secend");
    var optionElement = selectElement.getElementsByTagName("option");
    var len = optionElement.length;


    var selectCountry = [];

    if (len > 0) {
        for (i = 0; i < len; i++) {
            selectCountry.push(optionElement[i].value);
        }

        buildMutipleList(selectCountry);
    } else {
        alert("Please add country!!");
    }


}

function buildMutipleList(selectCountry) {

    d3.json(`/metafindselectcountries/${selectCountry}`, function (countryJsonList) {

        var checkedOption = getCheckedRadioValue("radio2");
        var checkedColor = getCheckedRadioValue("radio3");
        var checkedChart = getCheckedRadioValue("radio4");


        countryJsonList = countryJsonList.sort((a, b) => b[checkedOption] - a[checkedOption]);

        var nf = Intl.NumberFormat();

        // // /metadata/<country>
        var traceDisplay1 = [{
            // x value 
            x: countryJsonList.map(item => item.country),
            // y value 
            y: countryJsonList.map(item => {

                if (checkedOption === 'Growth Rate') {

                    return nf.format(item[checkedOption] * 100)

                } else {

                    return nf.format(item[checkedOption])
                }
            }),
            // set y value as the lable 
            labels: countryJsonList.map(item => {

                if (checkedOption === 'Growth Rate') {

                    return nf.format(item[checkedOption] * 100) + '%'

                } else {

                    return nf.format(item[checkedOption])
                }
            }),
            //show label for text display 
            text: countryJsonList.map(item => {

                if (checkedOption === 'Growth Rate') {

                    return  item.country + nf.format(item[checkedOption] * 100) + '%'

                } else if (checkedOption === 'GDP per Capita') {

                    return   item.country + " $"+ nf.format(item[checkedOption])
                }else if (checkedOption === 'Populcation Density') {

                    return   item.country + nf.format(item[checkedOption]) + "km²"
                } else {

                    return   item.country + nf.format(item[checkedOption])
                }
            }),

            // GDP per Capita
            // Happiest Score
            // Populcation Density
            // Growth Rate
            //show bar chart
            type: checkedChart,
            //set the orient
            // orientation: "h",

            marker: {
                color: checkedColor,
                opacity: 0.7,
            }

        }];
        // Bar layout
        var disPlayLayout1 = {
            title: { text: checkedOption + "Chart" },
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
        Plotly.newPlot("mutipleBar", traceDisplay1, disPlayLayout1, { displayModeBar: false });
    })


}




function getCheckedRadioValue(radioGroupName) {
    var rads = document.getElementsByName(radioGroupName);
    for (i = 0; i < rads.length; i++)
        if (rads[i].checked)
            return rads[i].value;
    return null; // or undefined, or your preferred default for none checked
}

