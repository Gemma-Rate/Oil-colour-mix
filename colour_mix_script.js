
//* Input data //*

var ultramarine = Color().cmyk(100, 50, 0, 70);
var titaniumWhite = Color().cmyk(0, 0, 0, 0);
var viridian = Color().cmyk(100, 42, 58, 60);
var cadmiumRed = Color().cmyk(0, 100, 100, 15);
var cadmiumYellow = Color().cmyk(0, 10, 100, 0);
// Define the colours in terms of cmyk.

availableColors = [ultramarine, titaniumWhite, viridian, cadmiumRed, cadmiumYellow];

//* Style the sliders //*

var i;
for (i = 0; i < availableColors.length; i++) {
    document.getElementsByClassName("slider")[i].style.backgroundColor = availableColors[i].rgbString()
}

function displayPercent(i) {
// Function to change the percentage displayed by the bar.
    document.getElementsByClassName("percent")[i].innerHTML = document.getElementsByClassName("slider")[i].value;
    // Get the value of slider i.
    document.getElementsByClassName("slider")[i].oninput = function() {
    // ith Slider changed from input.
      document.getElementsByClassName("percent")[i].innerHTML = this.value;
      // Set the ith percent html element to the value from the html.
     }
}

displayPercent(0);
displayPercent(1);
displayPercent(2);
displayPercent(3);
displayPercent(4);

//* Get data weights from slider //*

dataWeights = [];
colorList = [];
// List of the cmyk colour objects

var i=0;
for (i = 0; i < availableColors.length; i++) {
    var outputVal = document.getElementsByClassName("slider")[i].value
    // Get slider value.
    console.log(i)
    if (outputVal === "0") {
        // Do nothing if value is zero.
    }
    else{
      console.log(outputVal)
      console.log(i)
      dataWeights.push(outputVal)
      colorList.push(availableColors[i])
      // Update colour list with non zero percentages.
    }
}
// Percentage of pie chart for each colour.


//* Show the pie chart //*

var ctx2 = document.getElementById("upperChart").getContext('2d');
// Get canvas element.
var myChart = new Chart(ctx2, {
    type: 'doughnut',
    data: {
        labels: ['Ultramarine', 'Titanium White', 'Viridian', 'Cadmium Red', 'Cadmium Yellow'],
        datasets: [{
            label: '# of Votes',
            data: dataWeights,
            backgroundColor: colorList.map(x => x.rgbString()), // Convert color list to rgb string values.
            borderColor: [
                'rgb(255, 255, 255)',
                'rgb(255, 255, 255)',
                'rgb(255, 255, 255)',
                'rgb(255, 255, 255)',
                'rgb(255, 255, 255)'
            ],
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


// Mix the colours. //

var cmykSum = colorList[-1]

if (colorList.length > 1) {
// Only run pop and sum if length of the color list is > 1 color.

var cmykSum = colorList.pop();
// Remove list end element and assign it to the cmyk variable.
var i;
var j;
// Define loop variables.

var scaleTot = 1;
// Total initial scale for the popped last element (dataWeights[end]/dataWeights[end]=1).
for (i = 0; i < colorList.length; i++) {

  if (dataWeights[i] === "0") {
  // Do nothing if percent value of the colour is zero.
  }
  else {
  console.log(dataWeights[i])
    for (j = 0; j < colorList.length; j++) {
      if (dataWeights[j] === "0") {
        // Do nothing if percent value of the colour is zero.
        }
      else{
        scaleTot += dataWeights[j]/dataWeights.slice(-1)[0]
        // Get total scaling (first/last+second/last+...)
        console.log(scaleTot)
      }
    scaling = dataWeights[i]/dataWeights.slice(-1)[0]
    cmykSum = colorList[i].mix(cmykSum, scaling/scaleTot);
    }
  }
}

}

document.getElementsByClassName("circle_base")[0].style.backgroundColor = cmykSum.rgbString()
