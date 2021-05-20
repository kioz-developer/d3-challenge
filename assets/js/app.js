var dataArray = [];
var dataAxisY = [];
var dataAxisX = [];
var selection = {
    'y': 'healthcare',
    'x': 'poverty',
    'yLabel': {
        'obesity': 'Obese (%)',
        'smokes': 'Smokes (%)',
        'healthcare': 'Lacks Healthcare (%)'
    }, 
    'xLabel': {
        'poverty': 'In Poverty (%)',
        'age': 'Age (Median)',
        'income': 'Household Income (Median)'
    }
};

// Fetch csv file
d3.csv("assets/data/data.csv").then(function(csvData) {
    dataArray = csvData;
    drawResponsiveChart();
}).catch(function(error) {
    console.log(error);
});

// Event listener for window resize.
// When the browser window is resized, drawResponsiveChart() is called.
d3.select(window).on("resize", drawResponsiveChart);

// Function to draw the responsive chart
function drawResponsiveChart() {
    var svgArea = d3.select("#scatter").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Selecting data
    console.log(`Crossing ${selection.y} with ${selection.x}`)
    dataAxisY = dataArray.map(d => +d[selection.y]);
    dataAxisX = dataArray.map(d => +d[selection.x]);

    // svg params
    var svgHeight = 400;
    var svgWidth = document.getElementById("scatter").offsetWidth;

    var margin = {
        top: 20,
        right: 50,
        bottom: 80,
        left: 90
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
    var xDist = 35;
    Object.keys(selection.xLabel).forEach(d => {
        svg.append("text")
            .data(d)
            .classed(selection.x == d ? 'active' : "inactive", true)
            .attr("x", (chartWidth/2) + margin.left)
            .attr("y", chartHeight + margin.top + xDist)
            .attr("value", d)
            .attr("axis", "x")
            .text(`${selection.xLabel[d]}`);
        
        xDist = xDist + 20;
    });

    // Y axis label:
    var yDist = 16;
    Object.keys(selection.yLabel).forEach(d => {
        svg.append("text")
            .data(d)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .classed(selection.y == d ? 'active' : "inactive", true)
            .attr("y", yDist)
            .attr("x", -(chartHeight/2))
            .attr("value", d)
            .attr("axis", "y")
            .text(`${selection.yLabel[d]}`);
        
        yDist = yDist + 20;
    });

    // set x to the bottom of the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    // Append lines by quartiles
    appendQuartiles(chartGroup, chartHeight, chartWidth, 0.25);
    appendQuartiles(chartGroup, chartHeight, chartWidth, 0.5);
    appendQuartiles(chartGroup, chartHeight, chartWidth, 0.75);
    
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
        .attr("fill", "#158cba")
        .attr("opacity", ".6");

    /* Create the text for each entry */
    var text = elemEnter.append("text")
        .attr("x", d => xScale(d[selection.x]))
        .attr("y", d => yScale(d[selection.y]))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(function(d){return d.abbr});    

    var toolTip = d3.tip()
	    .attr("class", "tooltip")
	    .offset([-10, 0])
	    .html(function(d) {
	      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
	    });

    /* Create the tooltip for each entry */
    elemEnter.call(toolTip);

    elemEnter
		.on("mouseover", function(d) {
		    toolTip.show(d, this);
		})
		.on("mouseout", function(d, index) {
		    toolTip.hide(d, this);
	    });

    d3.selectAll("text")
    .on("click", function(d, i) {
        var axis = d3.select(this).attr("axis");
        var value = d3.select(this).attr("value");
        console.log(axis, value);

        if (axis == 'x') {
            selection.x = value;
        } else {
            selection.y = value
        }

        drawResponsiveChart();
    })
}

function appendQuartiles(chartGroup, chartHeight, chartWidth, quartile) {
    // Plot quartile in y axis
    chartGroup.append('line')
        .style("stroke", "darkgray")
        .style("stroke-width", 1)
        .attr("x1", 0)
        .attr("y1", chartHeight*quartile)
        .attr("x2", chartWidth)
        .attr("y2", chartHeight*quartile);

    // Plot quartile in x axis
    chartGroup.append('line')
        .style("stroke", "darkgray")
        .style("stroke-width", 1)
        .attr("x1", chartWidth*quartile)
        .attr("y1", 0)
        .attr("x2", chartWidth*quartile)
        .attr("y2", chartHeight);
}