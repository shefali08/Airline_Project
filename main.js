this.airlines = airlines
this.flights_jan_01_2008 = flights_jan_01_2008;
let hour = [];

//Finding valid flights from Flight Data
let countColon = (time) => {
  let count = 0;
  for (let x of time) {
    if (x === ':')
      count++;
  }
  if (count === 2)
    return true;
}
let validFlights = flights_jan_01_2008.filter((item) => {
  return (item && item.airline && item.time && countColon(item.time) && parseInt(item.time.substring(0, 2)) < 24)
});

const totalFlightCount = validFlights.length;
// Creating the hour object
// (() => {
  for (let i = 0; i < 24; i++) {
    let obj = {};
    obj.total = 0;
    for (let key in airlines) {
      obj[key] = 0;
    }
    hour.push(obj);
  }
// })();

//segregation of data as per airline and hour
validFlights.forEach( (item) => {
  let i = parseInt(item.time.substring(0, 2));
  let v = item.airline;
  hour[i][v] += 1;
  hour[i]['total'] += 1;
})

// graphData array for svg chart plotting
let graphData = hour.map((i) => i.total)

//Plotting the chart first time
let svgViewBox = svgChart.getAttribute('viewBox');
let split = svgViewBox.split(" ");
let svgWidth = split[2];
let svgHeight = split[3]
let svgData = calculateSVGData(graphData, svgWidth, svgHeight);
plotSvgChart(svgData);
document.getElementById("totalFlightCount").innerHTML = `${totalFlightCount} Flights All Airlines`;


//Filtering based on input text value
let textInput = document.getElementById('searchText');
let checkEnterKey = () => {
  if (event.key === 'Enter')
    filterAirlines();
}

let filterAirlines = () => {
  let flightAcronym = "";
  let textValue = textInput.value.toUpperCase();
  for (let key in airlines) {
    let v = airlines[key].toUpperCase();
    if (v.includes(textValue)) {
      flightAcronym = key;
      break;
    }
  }

  let newGraphData = hour.map((i) => i[flightAcronym]);
  let flightCount = hour.reduce((total, val) => { return total + val[flightAcronym] }, 0);
  while (svgChart.firstChild) {
    svgChart.removeChild(svgChart.firstChild);
  }
  if (textValue === "" || !flightAcronym) {
    svgData = calculateSVGData(graphData, svgWidth, svgHeight);
    plotSvgChart(svgData);
    document.getElementById("totalFlightCount").innerHTML = `${totalFlightCount} Flights All Airlines`;
  }
  else {
    svgData = calculateSVGData(newGraphData, svgWidth, svgHeight);
    plotSvgChart(svgData);
    document.getElementById("totalFlightCount").innerHTML = `${flightCount} Flights ${airlines[flightAcronym]}`;
  }
};