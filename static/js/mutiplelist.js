

////////////////////////////////////////////////////
// function1: while click right arrow 
////////////////////////////////////////////////////
function moveRight() {

    //get the data from the first list
    var selectElement = document.getElementById("first");
    var optionElements = selectElement.getElementsByTagName("option");
    var len = optionElements.length;

    if (!(selectElement.selectedIndex == -1)) {
        //add new input to secend list 
        var selectElement2 = document.getElementById("secend");
        for (var i = 0; i < len; i++) {
            if (selectElement.selectedIndex >= 0) {
                selectElement2.appendChild(optionElements[selectElement.selectedIndex]);
            }
        }

        //update chart info 
        mutiListChanged();
    } else {
        alert("Please select one！");
    }
}


////////////////////////////////////////////////////
// function2: while click left arrow 
////////////////////////////////////////////////////
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
        //update chart info 
        mutiListChanged();
    } else {
        alert("Please select one！");
    }
}

////////////////////////////////////////////////////
// function3: get the data from flask interface 
////////////////////////////////////////////////////
function mutipleIni() {

    var selector5 = d3.select("#first");

    var selector6 = d3.select("#secend");


    d3.json("/getCountryName", function (countryName) {
        //add 10 country names into left dropdown list
        countryName.slice(0, 10).forEach((instance) => {
            selector6
                .append("option")
                .text(instance)
                .property("value", instance);
        });
        //add the rest country names into left dropdown list
        countryName.slice(11, countryName.length).forEach((instance) => {
            selector5
                .append("option")
                .text(instance)
                .property("value", instance);
        });

        //update chart info 
        mutiListChanged();
    });
}

////////////////////////////////////////////////////
// function4: update list info
////////////////////////////////////////////////////
function mutiListChanged() {
    var selectElement = document.getElementById("secend");
    var optionElement = selectElement.getElementsByTagName("option");
    var len = optionElement.length;
    var selectCountry = [];
    if (len > 0) {
        for (i = 0; i < len; i++) {
            selectCountry.push(optionElement[i].value);
        }
        //build the chart
        buildMutipleList(selectCountry);

    } else {
        alert("Please add country!!");
    }
}
////////////////////////////////////////////////////
// function5: get data from flask and creat json list for display
////////////////////////////////////////////////////
function buildMutipleList(selectCountry) {

    d3.json(`/metafindselectcountries/${selectCountry}`, function (countryJsonList) {

        var checkedOption = getCheckedRadioValue("radio2");
        var checkedChart = getCheckedRadioValue("radio4");
        countryJsonList = countryJsonList.sort((a, b) => b[checkedOption] - a[checkedOption]);

        var data = countryJsonList.map(item => {
            return {
                "country": item.country,
                visits: item[checkedOption],
                value: item[checkedOption]
            }
        })

        d3.select("#mutipleradar").style("height", "400px");
        d3.select("#mutipleradar").style("width", "500px");

        d3.select("#mutipleBar").style("height", "400px");
        d3.select("#mutipleBar").style("width", "auto");
        //build bar chart
        showBarChart(data);
        //build radar chart
        showRadarChart(data);
    })

}
////////////////////////////////////////////////////
// function6: radar chart
////////////////////////////////////////////////////
function showRadarChart(data) {

    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_material);
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("mutipleradar", am4charts.RadarChart);

        chart.data = data;

        chart.innerRadius = am4core.percent(40)

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.minGridDistance = 60;
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.grid.template.strokeOpacity = 0.08;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.extraMax = 0.1;
        valueAxis.renderer.grid.template.strokeOpacity = 0.08;

        chart.seriesContainer.zIndex = -10;


        var series = chart.series.push(new am4charts.RadarColumnSeries());
        series.dataFields.categoryX = "country";
        series.dataFields.valueY = "visits";
        series.tooltipText = "{valueY.value}"
        series.columns.template.strokeOpacity = 0;
        series.columns.template.radarColumn.cornerRadius = 5;
        series.columns.template.radarColumn.innerCornerRadius = 0;

        chart.zoomOutButton.disabled = true;

        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
        series.columns.template.adapter.add("fill", (fill, target) => {
            return chart.colors.getIndex(target.dataItem.index);
        });

        setInterval(() => {
            am4core.array.each(chart.data, (item) => {
                item.visits *= Math.random() * 0.5 + 0.5;
                item.visits += 10;
            })
            chart.invalidateRawData();
        }, 2000)

        categoryAxis.sortBySeries = series;

        chart.cursor = new am4charts.RadarCursor();
        chart.cursor.behavior = "none";
        chart.cursor.lineX.disabled = true;
        chart.cursor.lineY.disabled = true;

    });
}
////////////////////////////////////////////////////
// function6: bar chart
////////////////////////////////////////////////////
function showBarChart(data) {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_material);
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("mutipleBar", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

        chart.data = data;
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.minGridDistance = 40;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        var series = chart.series.push(new am4charts.CurvedColumnSeries());
        series.dataFields.categoryX = "country";
        series.dataFields.valueY = "value";
        series.tooltipText = "{valueY.value}"
        series.columns.template.strokeOpacity = 0;

        series.columns.template.fillOpacity = 0.75;

        var hoverState = series.columns.template.states.create("hover");
        hoverState.properties.fillOpacity = 1;
        hoverState.properties.tension = 0.4;

        chart.cursor = new am4charts.XYCursor();

        // Add distinctive colors for each column using adapter
        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });

        chart.scrollbarX = new am4core.Scrollbar();

    });
}
////////////////////////////////////////////////////
// function7: radio value
////////////////////////////////////////////////////

function getCheckedRadioValue(radioGroupName) {
    var rads = document.getElementsByName(radioGroupName);
    for (i = 0; i < rads.length; i++)
        if (rads[i].checked)
            return rads[i].value;
    return null; // or undefined, or your preferred default for none checked
}

// program entrance
mutipleIni();