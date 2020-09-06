
//* Input data //*

var ultramarine = Color().cmyk(87, 93, 0, 40);
var titaniumWhite = Color().cmyk(3, 5, 4, 0);
var viridian = Color().cmyk(76, 30, 63, 11);
var cadmiumRed = Color().cmyk(0, 100, 85, 11);
var cadmiumYellow = Color().cmyk(0, 4, 100, 0);
// Define the colours in terms of cmyk.

availableColors = [ultramarine, titaniumWhite, viridian, cadmiumRed, cadmiumYellow];
initialLabels = ['Ultramarine', 'Titanium White', 'Viridian', 'Cadmium Red', 'Cadmium Yellow']

//* Style the sliders //*

function newSlider(i, availableColors, labels){
    // Make a new slider colour.
        document.getElementsByClassName("slider")[i].style.backgroundColor = availableColors[i].rgbString()
        document.getElementsByClassName("colourname")[i].innerHTML = labels[i]
}

function displayPercent(i, document) {
// Function to change the percentage displayed by the bar.
    document.getElementsByClassName("percent")[i].innerHTML = document.getElementsByClassName("slider")[i].value;
    // Get the value of slider i.
    document.getElementsByClassName("slider")[i].oninput = function() {
    // ith Slider changed from input.
      document.getElementsByClassName("percent")[i].innerHTML = this.value;
      // Set the ith percent html element to the value from the html.
     }
}

var i;
for (i = 0; i < availableColors.length; i++) {
    // Update the display percent and sliders.
    document.getElementsByClassName("slider").onchange = displayPercent(i, document);
    newSlider(i, availableColors, initialLabels);
}


//* Get data weights from slider //*

function getSliderVals(availableColors){
    dataWeights = [];
    colourList = [];
    // List of the cmyk colour objects
    var i=0;
    for (i = 0; i < availableColors.length; i++) {
        var outputVal = document.getElementsByClassName("slider")[i].value;
        // Get slider value.
        if (outputVal === "0") {
            // Do nothing if value is zero.
        }
        else{
          dataWeights.push(outputVal);
          colourList.push(availableColors[i]);
          // Update colour list with non zero percentages and available colours.
        }
        console.log(colourList)
    }
    return dataWeights, colourList;
}

var dataWeights, colourList = getSliderVals(availableColors)

// Percentage of pie chart for each colour.


//* Show the pie chart //*

var doughnut = document.getElementById("upperChart").getContext('2d');
// Get canvas element.
var doughnutChart = new Chart(doughnut, {
    type: 'doughnut',
    data: {
        labels: initialLabels,
        datasets: [{
            label: '# of Votes',
            data: dataWeights,
            backgroundColor: colourList.map(x => x.rgbString()), // Convert colour list to rgb string values.
            // Set the border colours.
            borderWidth: 2
        }]
    },
    options: {
               legend : {
                   display: false
                   }
    }
});


// Update the pie chart with slider values.

function updateChart() {
    // Add a new colour to the chart.

    dataWeights, colourList = getSliderVals(availableColors)
    console.log(colourList)
    doughnutChart.data.datasets.forEach((dataset) => {
        dataset.data = dataWeights;
        dataset.backgroundColor = colourList.map(x => x.rgbString());
    });
    //chart.style.backgroundColor = chart.style.backgroundColor.push(newColour.rgbString())
    doughnutChart.update();
    mixColours(dataWeights, colourList);
}


// Mix the colours. //

function mixColours(dataWeights, colourList) {

    if (colourList.length > 1) {
    // Only run pop and sum if length of the colour list is > 1 colour.

        var cmykSum = Color();
        // Remove list end element and assign it to the cmyk variable.
        var i;
        var j;
        // Define loop variables.

        var scaleTot = 1;
        // Total initial scale for the popped last element (dataWeights[end]/dataWeights[end]=1).
        for (i = 0; i < colourList.length; i++) {

          if (dataWeights[i] === "0") {
          // Do nothing if percent value of the colour is zero.
          }
          else {
            for (j = 0; j < colourList.length; j++) {
              if (dataWeights[j] === "0") {
                // Do nothing if percent value of the colour is zero.
                }
              else{
                scaleTot += dataWeights[j]/dataWeights.slice(-1)[0]
                // Get total scaling (first/last+second/last+...)
              }

              mixClone = colourList[i].clone()
              // Clone for mixing.
            scaling = dataWeights[i]/dataWeights.slice(-1)[0]
            cmykSum = mixClone.mix(cmykSum, scaling/scaleTot);
            //cmykSum = colourList[i].mix(cmykSum, dataWeights[i]/100);
            }
          }
        }
        document.getElementsByClassName("circle_base")[0].style.backgroundColor = cmykSum.rgbString()
        // Background circle to fill doughnut.
    }
    else{
    //console.log(colourList)
        document.getElementsByClassName("circle_base")[0].style.backgroundColor = colourList[0].rgbString()

    }

};

//* Add new colours //*

function addColour(name, c, m, y, k){

    var c = parseInt(c)
    var m = parseInt(m)
    var y = parseInt(y)
    var k = parseInt(k)

    var newColour = Color().cmyk(c, m, y, k);

    var colourName = name;

    var sliderList = document.getElementById("sliderscol");
    var newP = document.createElement("p");
    // Add new paragraph to slider list.

    var newLabel = document.createElement("label");
    newLabel.className = "text1";


    var newColourName = document.createElement("span");
    newColourName.className = "text1";
    newColourName.textContent = colourName+":";
    newLabel.appendChild(newColourName);
    // Make new colour label span and add it to the label.

    var newPercent = document.createElement("span");
    newPercent.class="percent";
    newLabel.appendChild(newPercent);

    sliderList.appendChild(newLabel);
    // Add new label element.

    var newSlider = document.createElement("input");
    newSlider.type = "range";
    newSlider.className = "slider";
    // Make a new slider and style it.
    newP.appendChild(newSlider);
    // Add new slider to new paragraph.
    sliderList.appendChild(newSlider);
    // Make a new slider and add it to the slider list.

    sliderList.appendChild(document.createElement("br"))

    var existingSliders = document.getElementsByClassName("slider")

    newSlider.style.backgroundColor = newColour.rgbString()
    //document.getElementsByClassName("colourname")[-1].innerHTML = colourName
    newPercent = newSlider.value;

    // Get chart object.
    addColourChart(doughnutChart, colourName, newPercent, newColour);

}

//* Update the doughnut plot with new or removed colours //*

function addColourChart(chart, newChartLabel, newData, newColour) {
    // Add a new colour to the chart.
    chart.data.labels.push(newChartLabel);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
        dataset.backgroundColor.push(newColour.rgbString())
    });
    //chart.style.backgroundColor = chart.style.backgroundColor.push(newColour.rgbString())
    chart.update();
}

function removeColourChart(chart) {
    // Remove a colour from the chart.
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

