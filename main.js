const TOTAL_HOURS = 24;
const ALL_AIRLINE = 'total';
const ALL_AIRLINE_TEXT = 'All Airlines';
let hour = [];
let svgHeight = 0, svgWidth = 0;
let svgData, prevSvgData, graphData;
let totalFlightCount;

/**
 * Finds valid flights from available Flights Data
 * @returns {*} - array of the flights having valid data
 */
let validateData = () => {
  let countColon = (time) => {
    let count = 0;
    for (let x of time) {
      if (x === ':')
        count++;
    }
    if (count === 2)
      return true;
  }
  return flights_jan_01_2008.filter((item) => {
    return (item && item.airline && item.time && countColon(item.time) && parseInt(item.time.substring(0, 2)) < TOTAL_HOURS)
  });
}

// Creates hour element which is an array of objects and populates it.
// The hour has 24 objects for each hour and each object contains airlines
// as keys and their count as values. 
let parseData = (validFlights) => {
  //Initializes an object with airline keys and a 'total' key to hold 
  //count for respective ailrlines and total count per hour. 
  for (let i = 0; i < TOTAL_HOURS; i++) {
    let obj = {};
    obj[ALL_AIRLINE] = 0;
    for (let key in airlines) {
      obj[key] = 0;
    }
    hour.push(obj);
  }

  //segregation of data as per airline and hour
  validFlights.forEach((item) => {
    let i = parseInt(item.time.substring(0, 2));
    let v = item.airline;
    hour[i][v] += 1;
    hour[i][ALL_AIRLINE] += 1;
  })
}

/**
 * Returns flight array containing count for 24 hour
 * @param attribute - the selected airline's key
 * @returns {*} - array of the flight's count
 */
let getGraphData = (attribute) => {
  return hour.map((i) => i[attribute] || 0)
}

/**
 * Returns total number of flights
 * @param attribute - the selected airline's key
 * @returns {*} - Total value
 */
let getflightCount = (attribute) => {
  return hour.reduce((total, val) => { return total + val[attribute] }, 0);
}

//Initializes the graph parameters
let initializeGraphParameters = () => {
  var svgChart = document.getElementById('svgChart');
  let svgViewBox = svgChart.getAttribute('viewBox');
  let split = svgViewBox.split(" ");
  svgWidth = split[2];
  svgHeight = split[3];
}

/**
 * Calculates coordinates for the points on line chart and plots the chart 
 * @param graphData - the processed graphData to be plotted
 * @param count - count of selected airline
 * @param displayName - Name of the selected airline
 */
let drawGraph = (graphData, count, displayName) => {
  svgData = calculateSVGData(graphData, svgWidth, svgHeight);
  drawGridLines(svgChart, svgData);
  drawPath(svgChart, svgData, prevSvgData);
  prevSvgData = svgData;
  document.getElementById("totalFlightCount").innerHTML = `${count} Flights ${displayName}`;
}

//When page is loaded, validates and parses the data,and renders graph
let init = () => {
  validFlights = validateData();
  parseData(validFlights);
  initializeGraphParameters();
  prevSvgData = calculateSVGData(getGraphData(), svgWidth, svgHeight);
  totalFlightCount = getflightCount(ALL_AIRLINE);
  graphData = getGraphData(ALL_AIRLINE);
  drawGraph(graphData, totalFlightCount, ALL_AIRLINE_TEXT);
}
//Function to run when the page is loaded
window.onload = init();

/**
 * Re-renders graph based on input text value
 * @param e
 */
let filterAirlines = (e) => {
  let textInput = document.getElementById('searchText');
  if (e.type === 'keypress' && e.key === 'Enter' || e.type === 'focusout') {
    let flightAcronym = "";
    let textValue = textInput.value.toUpperCase();
    for (let key in airlines) {
      let v = airlines[key].toUpperCase();
      if (v.includes(textValue)) {
        flightAcronym = key;
        break;
      }
    }

    let newGraphData = getGraphData(flightAcronym);
    let flightCount = getflightCount(flightAcronym);
    while (svgChart.firstChild) {
      svgChart.removeChild(svgChart.firstChild);
    }
    if (!flightAcronym && textValue !== "") {
      alert("Airline does not exist");
      e.target.value = "";
    }
    else if (textValue === "") {
      drawGraph(graphData, totalFlightCount, ALL_AIRLINE_TEXT);
    }
    else {
      drawGraph(newGraphData, flightCount, airlines[flightAcronym]);
    }
  }
};