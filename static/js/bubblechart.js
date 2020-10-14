function getTop50(sample) {
    var sortedList;
    sortedList = sample.sort((a, b) => b.population - a.population);
    var showData = sortedList.slice(0, 50)
    return showData;
}




////////////////////////////////////////////////////
// define global varable 
////////////////////////////////////////////////////
// init the range size
var svgHeight, svgWidth, width, height, censusData = [];
// Initial Params
var chosenXAxis = "gdp_per_capita";
var chosenYAxis = "happiestScore";

var margin = {
    top: 70,
    right: 80,
    bottom: 80,
    left: 100
};

////////////////////////////////////////////////////
// function 1: updating x-scale var upon click on axis label
////////////////////////////////////////////////////
function xScale(chosenXAxis) {


    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.9,
        d3.max(censusData, d => d[chosenXAxis]) * 1.05
        ])
        .range([0, width]);

    return xLinearScale;

}

////////////////////////////////////////////////////
// function 2:  updating y-scale var upon click on axis label
////////////////////////////////////////////////////
function yScale(chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
        d3.max(censusData, d => d[chosenYAxis] * 1.05)
        ])
        .range([height, 0]);

    return yLinearScale;
}

////////////////////////////////////////////////////
// function 3: used for updating xAxis var upon click on axis label
////////////////////////////////////////////////////
function renderXAxes(newXScale, xAxis) {

    var bottomAxis = d3.axisBottom(newXScale).ticks(8 * window.innerWidth / 1295);

    xAxis.transition()
        .duration(800)
        .call(bottomAxis);

    return xAxis;
}
////////////////////////////////////////////////////
// function 4: used for updating yAxis var upon click on axis label
////////////////////////////////////////////////////
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale).ticks(8 * window.innerHeight / 754);

    yAxis.transition()
        .duration(800)
        .call(leftAxis);

    return yAxis;
}

////////////////////////////////////////////////////
// function 5: used for updating circles group with a transition to
////////////////////////////////////////////////////
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(800)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}

////////////////////////////////////////////////////
// function 6: used for updating circles group with a transition to
////////////////////////////////////////////////////
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()

        .duration(800)
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}


////////////////////////////////////////////////////
// function 7: used for updating circles group with new tooltip
////////////////////////////////////////////////////
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var label1, label2, label1_tail, label2_tail;
    //select lables for the X axis
    switch (chosenXAxis) {
        case 'gdp_per_capita':
            label1 = "GDP per capita: ";
            label1_tail = "";
            break;
        case 'pop_den':
            label1 = "Population density: ";
            label1_tail = "";
            break;
        case 'countrysize':
            label1 = "countrysize: ";
            label1_tail = "";
            break;
        default:
            label1 = "GDP per capita: ";
            label1_tail = "";
    }
    //select lables for the y axis
    switch (chosenYAxis) {
        case 'happiestScore':
            label2 = "Happiest Score: ";
            label2_tail = "";
            break;
        case 'population':
            label2 = "population: ";
            label2_tail = "";
            break;
        case 'growthrate':
            label2 = "growthrate: ";
            label2_tail = "%";
            break;
        default:
            label2 = "Happiest Score: ";
            label2_tail = "";
    }

    var toolTip = d3.tip()
        .attr("class", "mytooltip")
        // .offset([80, -60])
        .html(function (d) {
            var nf = Intl.NumberFormat();

            var popupString = "";

            label2Output= label2=== 'growthrate: '? nf.format(d[chosenYAxis]*100) +'%':nf.format(d[chosenYAxis]);

            popupString = `${d.country}<hr>${label1}${nf.format(d[chosenXAxis])}<hr>${label2}${label2Output}`

            console.log("tag==============",popupString);

            return popupString;
        });


    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

////////////////////////////////////////////////////
// function 8: used for adding lable
////////////////////////////////////////////////////

function addLabels(circleLabels, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale, duration) {
    circleLabels.transition()
        .duration(duration)
        .attr("x", function (d) {
            return xLinearScale(d[chosenXAxis]);
        })
        .attr("y", function (d) {
            return yLinearScale(d[chosenYAxis]);
        })
        .text(function (d) {
            if ((window.innerHeight / 754) < 0.5 || (window.innerWidth / 1295) < 0.5) {
                // if window too small, the label will be disabled.
                return "";
            }

            return d.country;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", `${10 * window.innerWidth / 1295}px`)
        .attr("text-anchor", "middle")
        .attr("fill", "white");

    return circleLabels;

}

////////////////////////////////////////////////////
// function 9: setup active tag
////////////////////////////////////////////////////

function setActiveXTag(chosenXAxis, povertyRateLabel, ageRateLabel) {
    // enable selected tag and disable other tags
    console.log(chosenXAxis)

    switch (chosenXAxis) {
        case 'gdp_per_capita':
            povertyRateLabel
                .classed("active", true)
                .classed("inactive", false);
            ageRateLabel
                .classed("active", false)
                .classed("inactive", true);
            // incomeLabel
            //     .classed("active", false)
            //     .classed("inactive", true);
            break;
        case 'pop_den':
            povertyRateLabel
                .classed("active", false)
                .classed("inactive", true);
            ageRateLabel
                .classed("active", true)
                .classed("inactive", false);
            // incomeLabel
            //     .classed("active", false)
            //     .classed("inactive", true);
            break;
        case 'countrysize':
            povertyRateLabel
                .classed("active", false)
                .classed("inactive", true);
            ageRateLabel
                .classed("active", false)
                .classed("inactive", true);
            // incomeLabel
            //     .classed("active", true)
            //     .classed("inactive", false);
            break;
        default:
            povertyRateLabel
                .classed("active", true)
                .classed("inactive", false);
            ageRateLabel
                .classed("active", false)
                .classed("inactive", true);
            // incomeLabel
            //     .classed("active", false)
            //     .classed("inactive", true);
    }
}
////////////////////////////////////////////////////
// function 10: setup active tag in Y axis
////////////////////////////////////////////////////

function setActiveYTag(chosenYAxis, healthcareLable, smokesLable) {

    // enable selected tag and disable other tags
    switch (chosenYAxis) {
        case 'happiestScore':
            healthcareLable
                .classed("active", true)
                .classed("inactive", false);
            // obesityLable
            //     .classed("active", false)
            //     .classed("inactive", true);
            smokesLable
                .classed("active", false)
                .classed("inactive", true);
            break;
        case 'population':
            healthcareLable
                .classed("active", false)
                .classed("inactive", true);
            // obesityLable
            //     .classed("active", true)
            //     .classed("inactive", false);
            smokesLable
                .classed("active", false)
                .classed("inactive", true);
            break;
        case 'growthrate':
            healthcareLable
                .classed("active", false)
                .classed("inactive", true);
            // obesityLable
            //     .classed("active", false)
            //     .classed("inactive", true);
            smokesLable
                .classed("active", true)
                .classed("inactive", false);
            break;
        default:
            healthcareLable
                .classed("active", true)
                .classed("inactive", false);
            // obesityLable
            //     .classed("active", false)
            //     .classed("inactive", true);
            smokesLable
                .classed("active", false)
                .classed("inactive", true);
    }
}
////////////////////////////////////////////////////
// function 11: when window size changes, event will call the function
////////////////////////////////////////////////////
function makeResponsive() {


    //select svg area anchor 
    var svgArea = d3.select("body").select("svg");
    // if svg exists, windows will clear the content
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // init the range size
    // svgHeight = 600;
    // svgWidth = 1000;

    svgHeight = (window.innerHeight * 3/4 );
    svgWidth = (window.innerWidth *3 / 4 );
    //setup the margin size for the chart


    //actual size of the chart
    width = svgWidth - margin.left - margin.right;
    height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select(".chartBubble")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    //setup started point of the chart
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // Import Data

    ////////////////////////////////////////////////////
    // loading data from json
    ////////////////////////////////////////////////////
    d3.json("/getCountryData", function (census) {


        census = getTop50(census);

        census.forEach(function (data) {
            //change the import data into numbers 
            data.happiestScore = +data.happiestScore;
            data.population = +data.population;
            data.growthrate = +data.growthrate;
            data.countrysize = +data.countrysize;
            data.pop_den = +data.pop_den;
            data.gdp_per_capita = +data.gdp_per_capita;
        });
        censusData = census;

        // xLinearScale function above csv import
        var xLinearScale = xScale(chosenXAxis);

        // Create y scale function
        var yLinearScale = yScale(chosenYAxis);

        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale).ticks(8 * window.innerWidth / 1295);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(8 * window.innerHeight / 754);

        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // append y axis
        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        // append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 30 * window.innerWidth / 1295)
            .attr("fill", "darkgreen")
            .attr("opacity", ".5");


        // append circle label 
        var circleLabels = chartGroup.selectAll(null).data(censusData).enter().append("text");

        // Create group for three x-axis labels
        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var povertyRateLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "gdp_per_capita") // value to grab for event listener
            .classed("active", true)
            .text("GDP per Capita");

        var ageRateLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "pop_den") // value to grab for event listener
            .classed("inactive", true)
            .text("Population Density");

        // var incomeLabel = xlabelsGroup.append("text")
        //     .attr("x", 0)
        //     .attr("y", 60)
        //     .attr("value", "countrysize") // value to grab for event listener
        //     .classed("inactive", true)
        //     .text("Area km2");

        // Create group for three y-axis labels
        // turn 90 digree 
        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")

        var healthcareLable = ylabelsGroup.append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "4em")
            .attr("value", "happiestScore") // value to grab for event listener
            .classed("active", true)
            .text("Happiest Score");

        // var obesityLable = ylabelsGroup.append("text")
        //     .attr("y", 0 - margin.left)
        //     .attr("x", 0 - (height / 2))
        //     .attr("dy", "3em")
        //     .attr("value", "population") // value to grab for event listener
        //     .classed("inactive", true)
        //     .text("population");

        var smokesLable = ylabelsGroup.append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "2em")
            .attr("value", "growthrate") // value to grab for event listener
            .classed("inactive", true)
            .text("Growth Rate");

        // updateToolTip function
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // updateCircleLabel function
        circleLabels = addLabels(circleLabels, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale, 0);

        //if windows size changes, the X and Y tag select is different from defaut selection
        if (!((chosenXAxis === "gdp_per_capita") && (chosenYAxis === "happiestScore"))) {
            // setActiveXTag(chosenXAxis, povertyRateLabel, ageRateLabel, incomeLabel);
            // setActiveYTag(chosenYAxis, healthcareLable, obesityLable, smokesLable);

            setActiveXTag(chosenXAxis, povertyRateLabel, ageRateLabel);
            setActiveYTag(chosenYAxis, healthcareLable, smokesLable);


        }


        // x axis labels event listener
        xlabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");

                //if select different tag
                if (value !== chosenXAxis) {
                    // replaces chosenXAxis with value
                    chosenXAxis = value;
                    // updates x scale for new data
                    xLinearScale = xScale(chosenXAxis);

                    // updates x axis with transition
                    xAxis = renderXAxes(xLinearScale, xAxis);

                    // updates circles with new x values
                    circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    //updates label with new info
                    circleLabels = addLabels(circleLabels, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale, 800);

                    setActiveXTag(chosenXAxis, povertyRateLabel, ageRateLabel);

                }
            });


        // y axis labels event listener
        ylabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");

                if (value !== chosenYAxis) {
                    // replaces chosenXAxis with value
                    chosenYAxis = value;
                    // updates y scale for new data
                    yLinearScale = yScale(chosenYAxis);
                    // updates y axis with transition
                    yAxis = renderYAxes(yLinearScale, yAxis);
                    // updates circles with new y values
                    circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                    //updates label with new info
                    circleLabels = addLabels(circleLabels, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale, 800);

                    setActiveYTag(chosenYAxis, healthcareLable, smokesLable);
                }
            });

    })

}




//initial default page
makeResponsive();
// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);