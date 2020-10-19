
////////////////////////////////////////////////////
// function : show gauge chart
////////////////////////////////////////////////////
function gauges(countryData){

  am4core.ready(function() {
  
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    var chartMin = 0;
    var chartMax = 8;
    
    var data = {

      //get Happiest Score 
      score: countryData["Happiest Score"],

      //setup the scape 
      gradingData: [
        {
          title: "Worst",
          color: "#ee1f25",
          lowScore: 0,
          highScore: 2
        },
        {
          title: "Poor",
          color: "#f04922",
          lowScore: 2,
          highScore: 3
        },
        {
          title: "Fair",
          color: "#fdae19",
          lowScore: 3,
          highScore: 4
        },
        {
          title: "Average",
          color: "#f3eb0c",
          lowScore: 4,
          highScore: 5
        },
        {
          title: "Good",
          color: "#b0d136",
          lowScore: 5,
          highScore: 6
        },
        {
          title: "Happiest",
          color: "#54b947",
          lowScore: 6,
          highScore: 7
        },
        {
          title: "Excellent",
          color: "#0f9747",
          lowScore: 7,
          highScore: 8
        }
      ]
    };
    
    /**
    Grading Lookup
     */
    function lookUpGrade(lookupScore, grades) {
      // Only change code below this line
      for (var i = 0; i < grades.length; i++) {
        if (
          grades[i].lowScore < lookupScore &&
          grades[i].highScore >= lookupScore
        ) {
          return grades[i];
        }
      }
      return null;
    }
    
    // create chart
    var chart = am4core.create("myGauges", am4charts.GaugeChart);
    chart.hiddenState.properties.opacity = 0;
    chart.fontSize = 11;
    chart.innerRadius = am4core.percent(80);
    chart.resizable = true;
    
    /**
     * Normal axis
     */
    
    var axis = chart.xAxes.push(new am4charts.ValueAxis());
    axis.min = chartMin;
    axis.max = chartMax;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(80);
    axis.renderer.inside = true;
    axis.renderer.line.strokeOpacity = 0.1;
    axis.renderer.ticks.template.disabled = false;
    axis.renderer.ticks.template.strokeOpacity = 1;
    axis.renderer.ticks.template.strokeWidth = 0.5;
    axis.renderer.ticks.template.length = 5;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = am4core.percent(15);
    axis.renderer.labels.template.fontSize = "0.9em";
    
    /**
     * Axis for ranges
     */
    
    var axis2 = chart.xAxes.push(new am4charts.ValueAxis());
    axis2.min = chartMin;
    axis2.max = chartMax;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = false;
    axis2.renderer.grid.template.opacity = 0.5;
    axis2.renderer.labels.template.bent = true;
    axis2.renderer.labels.template.fill = am4core.color("#000");
    axis2.renderer.labels.template.fontWeight = "bold";
    axis2.renderer.labels.template.fillOpacity = 0.3;
    
    
    
    /**
    Ranges
    */
    
    for (let grading of data.gradingData) {
      var range = axis2.axisRanges.create();
      range.axisFill.fill = am4core.color(grading.color);
      range.axisFill.fillOpacity = 0.8;
      range.axisFill.zIndex = -1;
      range.value = grading.lowScore > chartMin ? grading.lowScore : chartMin;
      range.endValue = grading.highScore < chartMax ? grading.highScore : chartMax;
      range.grid.strokeOpacity = 0;
      range.stroke = am4core.color(grading.color).lighten(-0.1);
      range.label.inside = true;
      range.label.text = grading.title.toUpperCase();
      range.label.inside = true;
      range.label.location = 0.5;
      range.label.inside = true;
      range.label.radius = am4core.percent(10);
      range.label.paddingBottom = -5; // ~half font size
      range.label.fontSize = "0.9em";
    }
    
    var matchingGrade = lookUpGrade(data.score, data.gradingData);
    
    /**
     * Label 1
     */
    
    var label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = "6em";
    label.x = am4core.percent(50);
    label.paddingBottom = 15;
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    //label.dataItem = data;
    label.text = data.score.toFixed(1);
    //label.text = "{score}";
    label.fill = am4core.color(matchingGrade.color);
    
    /**
     * Label 2
     */
    
    var label2 = chart.radarContainer.createChild(am4core.Label);
    label2.isMeasured = false;
    label2.fontSize = "2em";
    label2.horizontalCenter = "middle";
    label2.verticalCenter = "bottom";
    label2.text = matchingGrade.title.toUpperCase();
    label2.fill = am4core.color(matchingGrade.color);
    
    
    /**
     * Hand
     */
    
    var hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(55);
    hand.startWidth = 8;
    hand.pin.disabled = true;
    hand.value = data.score;
    hand.fill = am4core.color("#444");
    hand.stroke = am4core.color("#000");
    
    hand.events.on("positionchanged", function(){
      label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
      var value2 = axis.positionToValue(hand.currentPosition);
      var matchingGrade = lookUpGrade(axis.positionToValue(hand.currentPosition), data.gradingData);
      label2.text = matchingGrade.title.toUpperCase();
      label2.fill = am4core.color(matchingGrade.color);
      label2.stroke = am4core.color(matchingGrade.color);  
      label.fill = am4core.color(matchingGrade.color);
    })
    
    
    }); // end am4core.ready()



}