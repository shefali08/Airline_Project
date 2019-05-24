//Plotting the chart
let svgChart = document.getElementById('svgChart');

function calculateSVGData(graphData, width, height) {
    let values = graphData;
    return getCoordinates(values, width, height)
}

function getCoordinates(values, width, height) {
    let min = Math.floor(Math.min.apply(null, values) * 0.95)
    let max = Math.ceil(Math.max.apply(null, values) * 1.05)

    let yRatio = (max - min) / height
    let xRatio = width / (values.length)

    return values.map( (value, i) => {
        let y = height - ((value - min) / yRatio);
        let x = (xRatio * i) + (xRatio / 2);
        let g = (xRatio * i);
        return [x, y, g]
    })
}

function plotSvgChart(svgData) {
    let lineData = "";
    svgData.map((coordinates, i) => {
        let gldata = `m${coordinates[2]} 0 v200`
        let gline = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        gline.setAttribute("d", gldata);
        gline.setAttribute("fill", "none");
        gline.setAttribute("stroke", "lightgray");
        gline.setAttribute("stroke-width", .5);
        svgChart.appendChild(gline);

        if (i === 0) {
            lineData = `${lineData} m ${coordinates[0]},${coordinates[1]}`
        }
        else {
            lineData = `${lineData} l ${coordinates[0] - svgData[i - 1][0]},${coordinates[1] - svgData[i - 1][1]}`
        }
    });
    let line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    line.setAttribute("d", lineData);
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "#5CC0C0");
    line.setAttribute("stroke-width", 2);
    svgChart.appendChild(line);
}