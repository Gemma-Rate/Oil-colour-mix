

function onLoadStart(){
//* Input data //*

    var ultramarine = Color().cmyk(87, 93, 0, 40);
    var titaniumWhite = Color().cmyk(3, 5, 4, 0);
    var viridian = Color().cmyk(76, 30, 63, 11);
    var cadmiumRed = Color().cmyk(0, 100, 85, 11);
    var cadmiumYellow = Color().cmyk(0, 4, 100, 0);
    // Define the colours in terms of cmyk.

    availableColors = [ultramarine, titaniumWhite, viridian, cadmiumRed, cadmiumYellow];
    initialLabels = ['Ultramarine', 'Titanium White', 'Viridian', 'Cadmium Red', 'Cadmium Yellow']

    var i;
    for (i = 0; i < availableColors.length; i++) {
        // Update the display percent and sliders.
        newSlider(i, availableColors, initialLabels);
    }
    var dataWeights, colourList = getSliderVals(availableColors)

    doughnutChart = makeChart()
}

//* Style the sliders //*

function newSlider(i, availableColors, labels){
    // Make a new slider colour.
        document.getElementsByClassName("slider")[i].style.backgroundColor = availableColors[i].rgbString()
        document.getElementsByClassName("colourname")[i].innerHTML = labels[i]
        // Set the colour of the slider and the label name to the colour name.
}

function displayPercent(inputId) {
// Function to change the percentage displayed by the bar.
      var slider = document.getElementById(inputId);
      var name = inputId + "Percent"
      document.getElementById(name).innerHTML = slider.value;
      // Set the ith percent html element to the value from the html.

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
    }
    return dataWeights, colourList;
}

// Percentage of pie chart for each colour.


//* Show the pie chart //*

function makeChart(){

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
    return doughnutChart
}


// Update the pie chart with slider values.

function updateChart() {
    // Update the chart.

    dataWeights, colourList = getSliderVals(availableColors)
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

        var colourListCopy = colourList.slice();
        var cmykSum = colourListCopy.pop()
        // Remove list end element and assign it to the cmyk variable.
        var i;
        var j;
        // Define loop variables.

        var scaleTot = 1;
        // Total initial scale for the popped last element (dataWeights[end]/dataWeights[end]=1).
        for (i = 0; i < colourListCopy.length; i++) {

          if (dataWeights[i] === "0") {
          // Do nothing if percent value of the colour is zero.
          }
          else {
            for (j = 0; j < colourListCopy.length; j++) {
              if (dataWeights[j] === "0") {
                // Do nothing if percent value of the colour is zero.
                }
              else{
                scaleTot += dataWeights[j]/dataWeights.slice(-1)[0]
                // Get total scaling (first/last+second/last+...)
              }

            mixClone = colourListCopy[i].clone()
            // Clone for mixing.
            scaling = dataWeights[i]/dataWeights.slice(-1)[0]
            cmykSum = mixClone.mix(cmykSum, scaling/scaleTot);
           // cmykSum = mixClone.mix(cmykSum, dataWeights[i]/100);
            }
          }
        }
        document.getElementsByClassName("circle_base")[0].style.backgroundColor = cmykSum.rgbString()
        // Background circle to fill doughnut.
    }
    else{
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
    var newP = document.createElement("div");
    newP.id = "colour"+availableColors.length+1
    // Add new div element to slider list.

    var newLabel = document.createElement("label");
    newLabel.className = "text1";

    var newColourName = document.createElement("span");
    newColourName.className = "text1";
    newColourName.textContent = colourName+":";
    newLabel.appendChild(newColourName);
    // Make new colour label span and add it to the label.

    var newPercentName = document.createElement("span");
    newPercentName.className="percent";
    newPercentName.id = colourName+"Percent"
    newLabel.appendChild(newPercentName);

    newP.appendChild(newLabel);
    // Add new label element.

    var newSlider = document.createElement("input");
    newSlider.type = "range";
    newSlider.className = "slider";
    newSlider.id = colourName
    newSlider.onchange = updateChart;
    // Make a new slider and style it.
    newSlider.addEventListener('oninput', function(){displayPercent(colourName)});
    newP.appendChild(newSlider);
    // Add new slider to new paragraph.
    sliderList.appendChild(newP);
    // Make a new slider and add it to the slider list.

    var newButton = document.createElement("button");
    newButton.type = "button";
    newButton.className = "btn";
    newButton.id = newColourName+'Btn'
    newButton.addEventListener('click', function(){removeColour(newButton.id);
    })
    newButton.textContent = "-";
    newP.appendChild(newButton);
    // Make new removal button.

    sliderList.appendChild(document.createElement("br"))
    // Add spacing.

    var existingSliders = document.getElementsByClassName("slider")

    newSlider.style.backgroundColor = newColour.rgbString()
    //document.getElementsByClassName("colourname")[-1].innerHTML = colourName
    newPercent = newSlider.value;
    newPercentName.textContent = newSlider.value;

    // Add to the list of available colours:
    availableColors.push(newColour)

    // Get chart object.
    addColourChart(doughnutChart, colourName, newPercent, newColour);

}


function removeColour(inputId){
    // Remove the colour slider and associated name/percent from the list.
    var parentId = document.getElementById(inputId).parentElement
    // Get parent element id.

    var indexToRemove = Array.from(document.getElementsByClassName("btn")).indexOf(document.getElementById(inputId))
    // document.getElementById(inputId) gets element with input ID, which corresponds to element we want to remove,
    // then indexOf pulls the index for this element within the class list.

    var slidersRemoveList = document.getElementsByClassName("slider");
    slidersRemoveList[indexToRemove].classList.remove("slider");
    // Remove slider element style to remove from class list.

    var percentRemoveList = document.getElementsByClassName("percent");
    percentRemoveList[indexToRemove].classList.remove("percent");
    // Remove percent element style to remove from class list.

    parentId.remove();
    // Delete slider element, name and percent from the row.
    availableColors.splice(indexToRemove, 1)
    // Now remove from master list of colours (to prevent errors elsewhere).
    initialLabels.splice(indexToRemove, 1)

    removeColourChart(doughnutChart, indexToRemove, availableColors)
    // Remove from the chart.
    updateChart()
    // Update the chart automatically.

}


//* Update the doughnut plot with new or removed colours //*

function addColourChart(chart, newChartLabel, newData, newColour) {
    // Add a new colour to the chart.
    chart.data.labels.push(newChartLabel);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
        dataset.backgroundColor.push(newColour.rgbString())
    });
    chart.update();
}

function removeColourChart(chart, idRemove, newColourList) {
    // Remove a colour from the chart.

    chart.data.labels.splice(idRemove, 1);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.splice(idRemove, 1);
        dataset.backgroundColor = newColourList.map(x => x.rgbString());
    });
    chart.update();
}

