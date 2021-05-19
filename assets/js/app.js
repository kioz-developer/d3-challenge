var dataArray = [];
var dataHealthcare = [];
var dataPoverty = [];

d3.csv("assets/data/data.csv").then(function(csvData) {
    dataArray = csvData;

    dataHealthcare = dataArray.map(d => +d.healthcare);
    dataPoverty = dataArray.map(d => +d.poverty);

    drawChart();
    
    //console.log(dataHealthcare);
    //console.log("dataHealthcare: " + d3.max(dataHealthcare));

    //console.log(dataPoverty);
    //console.log("dataPoverty: " + d3.max(dataPoverty));
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
        right: 20,
        bottom: 30,
        left: 20
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
        .domain([0, d3.max(dataHealthcare)])
        .range([chartHeight, 0]);

    // scale x to chart width
    var xScale = d3.scaleBand()
        .domain(dataPoverty)
        .range([0, chartWidth])
        .padding(0.5);

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // set y to the y axis
    chartGroup.append("g")
        .call(yAxis);

    // set x to the bottom of the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);
    
    
}