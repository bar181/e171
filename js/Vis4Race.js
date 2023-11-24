class Vis4Race  {

    constructor(_parentElement) {

        this.parentElement = _parentElement;
        this.data = vis1Data;
        this.userAge = userAge;
        this.year = 2004;
        this.itemsToShow = 15;
        this.animationDuration = 1200;

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Calculate the height of the y-axis based on the number of items in vis.data
        const yHeight = vis.itemsToShow * 29; // Adjust the multiplier as needed for spacing

        // Define margins and dimensions
        vis.margin = { top: 20, right: 60, bottom: 40, left: 160 };
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = yHeight - vis.margin.top - vis.margin.bottom; // Use the calculated yHeight

        // Create the SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Initialize scales and axes
        vis.xScale = d3.scaleLinear()
            .range([0, vis.width]);

        vis.yScale = d3.scaleBand()
            .range([0, vis.height])
            .padding(0.1);

        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);

        // Append axes to the SVG
        vis.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis");

        vis.wrangleData();

    }
    wrangleData() {
        let vis = this;

        vis.data = vis4Data;

        vis.data = vis1Data;
        // Filter the data for the selected year (vis.year)
        vis.yearData = vis.data.filter(d => d[vis.year]);

        // Sort the filtered data by the values for the selected year in descending order
        vis.yearData.sort((a, b) => b[vis.year] - a[vis.year]);

        // Select the top 10 topics for the year (or all topics if there are fewer than 10)
        vis.topTopics = vis.yearData.slice(0, Math.min(vis.itemsToShow, vis.yearData.length))
            .map((d, i) => ({
                rank: i + 1,
                topic: d.Topic,
                image: 'images/vis1top/' + d.Image,
                value: parseInt(d[vis.year]) })); // Add
        // rank starting at 1

        // Update vis.data with the sorted and filtered data
        vis.data = vis.topTopics;
        // console.log("topTopics", vis.topTopics)
        // Update the visualization
        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        // Update the xScale domain to always have a minimum of 0 and a maximum of 100
        vis.xScale.domain([0, 100]);

        // Select and bind data to bars
        const bars = vis.svg.selectAll(".bar")
            .data(vis.data, d => d.topic);

        // EXIT phase: Remove bars that are no longer in the data
        bars.exit()
            .transition()
            .duration(vis.animationDuration)
            .attr("width", 0)
            .remove();

        // ENTER phase: Add new bars for incoming data
        const enterBars = bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0) // Starting position for animation
            .attr("y", d => vis.yScale(d.topic))
            .attr("width", 0) // Starting width for animation
            .attr("height", vis.yScale.bandwidth()) // Height of the bars
            .style("fill", "steelblue");

        // UPDATE phase: Update properties of existing bars (including animations)
        bars.merge(enterBars)
            .transition()
            .duration(vis.animationDuration)
            .attr("x", 0) // Starting position for animation
            .attr("y", (d, i) => i * 25) // Vertical position for each bar
            .attr("width", d => vis.xScale(d.value)) // Bar width based on value
            .attr("height", 20) // Height of the bars
            .style("fill", "steelblue");

        vis.svg.selectAll(".rank-label").remove();

        const rankLabels = vis.svg.selectAll(".rank-label")
            .data(vis.data, d => d.topic);

        // rankLabels.exit().remove();

        rankLabels.enter()
            .append("text")
            .attr("class", "rank-label")
            .attr("x", -5) // Adjust the position for the label
            .attr("y", (d, i) => i * 25 + 15) // Adjust the vertical position for the label
            .text(d => `${d.rank}. ${d.topic}`)
            .style("font-size", "12px")
            .style("text-anchor", "end");

        // update year
        d3.select("#vis4-year-display")
            .text(vis.year);

    }

    // Add a method to update the chart for a specific year
    updateChartForYear(year) {
        this.year = year;
        this.wrangleData();
    }

    // Add a method to control the animation
    startAnimation(currentYear = 2004) {
        const vis = this;
        // let currentYear = 2004;

        // Disable the "Start Again" button
        startAgainButton.disabled = true;

        function animate() {
            if (currentYear <= 2023) {
                vis.updateChartForYear(currentYear);
                currentYear++;
                d3.select("#vis4-year-display").text(currentYear);
                setTimeout(animate, vis.animationDuration); // Delay between years
            } else {
                // Enable the "Start Again" button when the animation is complete
                startAgainButton.disabled = false;
            }
        }

        animate();
    }

}