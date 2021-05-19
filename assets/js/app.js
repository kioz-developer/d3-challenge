var dataArray = [];
var dataAxisY = [];
var dataAxisX = [];
var selection = {
    'y': 'healthcare',
    'x': 'poverty'
};


d3.csv("assets/data/data.csv").then(function(csvData) {
    dataArray = csvData;

    dataAxisY = dataArray.map(d => +d[selection.y]);
    dataAxisX = dataArray.map(d => +d[selection.x]);

    drawChart();
    
    //console.log(dataAxisY);
    //console.log("dataAxisY: " + d3.max(dataAxisY));

    //console.log(dataAxisX);
    //console.log("dataAxisX: " + d3.max(dataAxisX));
}).catch(function(error) {
    console.log(error);
});

// Event listener for window resize.
// When the browser window is resized, drawChart() is called.
d3.select(window).on("resize", drawChart);

function drawChart() {
    var svgArea = d3.select("#scatter").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // svg params
    var svgHeight = 400;
    var svgWidth = document.getElementById("scatter").offsetWidth;

    var margin = {
        top: 20,
        right: 50,
        bottom: 50,
        left: 50
    };

    // chart area minus margins
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    // create svg container
    var svg = d3.select("#scatter").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // shift everything over by the margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // scale y to chart height
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataAxisY)])
        .range([chartHeight, 0]);

    // scale x to chart width
    var xScale = d3.scaleBand()
        .domain(dataAxisX)
        .range([0, chartWidth])
        .padding(0.5);

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // set y to the y axis
    chartGroup.append("g")
        .call(yAxis);

    // Add X axis label:
    svg.append("text")
        .attr("x", chartWidth/1.9)
        .attr("y", chartHeight + margin.top + 35)
        .text(`${selection.x}`);

    // Y axis label:
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 16)
        .attr("x", -(chartHeight - margin.top - 60))
        .text(`${selection.y}`)

    // set x to the bottom of the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);
    
    /* Define the data for the circles */
    var elem = chartGroup.selectAll("circle")
    .data(dataArray);

    /*Create a container for each circle */  
    var elemEnter = elem.enter()
        .append("g");

    /* Create a circle for each entry */
    var circle = elemEnter.append("circle")
    .attr("cx", d => xScale(d[selection.x]))
    .attr("cy", d => yScale(d[selection.y]))
    .attr("r", 15)
    .attr("fill", "pink")
    .attr("opacity", ".6");

    /* Create the text for each entry */
    elemEnter.append("text")
    .attr("x", d => xScale(d[selection.x]))
    .attr("y", d => yScale(d[selection.y]))
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text(function(d){return d.abbr});

}