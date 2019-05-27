/**
 * calculates the svg coordinate data to be used to render the svg graph
 * @param graphData - the processed graph data
 * @param width - the available width for the graph
 * @param height - the available height for the graph
 * @returns {{coordinates}} - object containing array of the point coordinates
 * and interval on x-axis
 */
function calculateSVGData(graphData, width, height) {
    var values = graphData;
    return getCoordinates(values, width, height)
}

/**
 * calculates the svg coordinate data for an array of values(an airline/all airlines)
 * to be used to render the svg graph
 * @param values - array of count of the airlines per hour
 * @param width - the available width for the graph
 * @param height - the available height for the graph
 * @returns {{coordinates}} - object containing array of the point coordinates
 * and interval on x-axis
 */
function getCoordinates(values, width, height) {
    var min = Math.floor(Math.min.apply(null, values) * 0.95)
    var max = Math.ceil(Math.max.apply(null, values) * 1.05)

    var yRatio = (max - min) / height
    var xRatio = width / (values.length)

    return values.map(function (value, i) {
        var y = !yRatio ? height : height - ((value - min) / yRatio);
        var x = (xRatio * i) + (xRatio / 2);
        var g = (xRatio * i);
        return [x, y, g]
    })
}

/**
 * takes the generated svg coordinates and generates a command to draw svg path
 * @param svgData
 * @returns {string} lineData in svg path format
 */
function calculateLineData(svgData) {
    let lineData = "";
    svgData.map((coordinates, i) => {
        if (i === 0) {
            lineData = `m ${coordinates[0]},${coordinates[1]}`
        }
        else {
            lineData = `${lineData} l ${coordinates[0] - svgData[i - 1][0]},${coordinates[1] - svgData[i - 1][1]}`
        }
    });
    return lineData;
}

/**
 * draws the vertical grid lines on the graph showing the 24 hours intervals
 * @param svgElement SVG Chart
 * @param svgData processed coordinates
 */
function drawGridLines(svgElement, svgData) {
    svgData.map((coordinates, i) => {
        var gldata = `m${coordinates[2]} 0 v200`
        var gline = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        gline.setAttribute("d", gldata);
        gline.setAttribute("fill", "none");
        gline.setAttribute("stroke", "lightgray");
        gline.setAttribute("stroke-width", .5);
        svgElement.appendChild(gline);

    })
}

/**
 * creates a path in the specified svg element based on the generated svg coordinates
 * @param svgElement
 * @param svgData
 * @param prevSvgData
 */
function drawPath(svgElement, svgData, prevSvgData) {
    var lineData = calculateLineData(svgData);
    var prevLineData = calculateLineData(prevSvgData);
    var line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    line.setAttribute("d", prevLineData);
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "#5CC0C0");
    line.setAttribute("stroke-width", 2);
    addAnimation(svgElement, line, "d", prevLineData, lineData);
}

/**
 * attaches the animation to component of svg
 * @param rootElement - the parent svg chart
 * @param element - the element to be animated
 * @param attributeName - the atribute of the element to be animated
 * @param from - the start data of the animation
 * @param to - the end data of the animation
 */
function addAnimation(rootElement, element, attributeName, from, to) {
    var animate = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate"
    );
    animate.setAttribute("attributeName", attributeName);
    animate.setAttribute("from", from);
    animate.setAttribute("to", to);
    animate.setAttribute("dur", '1s');
    animate.setAttribute("begin", "indefinite");
    animate.setAttribute("end", "indefinite");
    animate.setAttribute("fill", "freeze");
    animate.setAttribute("calcMode", "spline");
    animate.setAttribute("keySplines", "0.5 0 0.5 1"); //ease-in-out
    animate.setAttribute("keyTimes", "0;1");
    element.appendChild(animate);
    rootElement.appendChild(element);
    animate.beginElement();
}
