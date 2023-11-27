class Vis4Race  {

    constructor(_parentElement) {

        this.parentElement = _parentElement;
        this.data = vis1Data;
        this.userAge = userAge;
        this.year = 2004;
        this.itemsToShow = 12;
        this.animationDuration = 800;

        this.barsHeight = 50;
        this.barsPadding = 4;
        this.initVis();
    }

    initVis() {
        let vis = this;

        // Define margins and dimensions
        vis.margin = { top: 20, right: 80, bottom: 10, left: 20 };
        const yHeight = vis.itemsToShow * ( vis.barsHeight + vis.barsPadding) +vis.barsHeight; //
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

        // Update the yScale domain with the new topics
        vis.yScale.domain(vis.data.map(d => d.topic));
        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        // Update the xScale domain to always have a minimum of 0 and a maximum of 100
        vis.xScale.domain([0, 100]);

        // Adjust the yScale range to accommodate fixed bar height
        vis.yScale.range([0, vis.data.length * (vis.barsHeight + vis.barsPadding)]);

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
            .attr("x", 60) // Starting position for animation
            .attr("y", d => vis.yScale(d.topic))
            .attr("width", 0) // Starting width for animation
            // .attr("height", vis.yScale.bandwidth()) // Height of the bars
            .attr("height", vis.barsHeight) // Height of the bars
            .style("fill", "steelblue");

        bars.merge(enterBars)
            .transition()
            .duration(vis.animationDuration)
            .attr("x", (vis.barsHeight + vis.barsPadding *2 ) )
            .attr("y", d => vis.yScale(d.topic))
            .attr("width", d => vis.xScale(d.value))
            .attr("height", vis.barsHeight)
            .style("fill", "steelblue")
            .on("start", (d, i) => {
                // Start the image transition at the same time as the bar transition
                updateAxisLabel(d, i);
            });


        function updateAxisLabel(data, index) {
            // Select the corresponding y-axis label
            let axisLabel = vis.svg.select(".y-axis")
                .selectAll(".axis-label")
                .filter((d, i) => i === index);

            // If the label does not exist, create it
            if (axisLabel.empty()) {
                axisLabel = vis.svg.select(".y-axis")
                    .append("image")
                    .attr("class", "axis-label")
                    .attr("xlink:href", data.image)
                    // .attr("x", -60)
                    .attr("x", 0)
                    .attr("y", vis.yScale(data.topic) - (vis.barsHeight / 2))
                    .attr("width", 50)
                    .attr("height", 50)
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .style("opacity", 0); // Start with opacity 0
            }

            // Transition the label
            axisLabel.transition()
                .duration(vis.animationDuration)
                .style("opacity", 1); // Transition to full opacity

            vis.svg.select(".y-axis").selectAll(".axis-label").remove();

            // Create or update y-axis labels with images
            const yAxisLabels = vis.svg.select(".y-axis")
                .selectAll(".axis-label")
                .data(vis.data, d => d.topic);

            yAxisLabels.enter()
                .append("image")
                .attr("class", "axis-label")
                .attr("xlink:href", d => d.image) // Set the image source
                // .attr("x", -60) // Adjust x position as needed
                .attr("x", 0) // Adjust x position as needed
                .attr("y", d => vis.yScale(d.topic)) // Center the image in the band
                // .attr("y", d => vis.yScale(d.topic) - (vis.barsHeight / 2) + 20)
                .attr("width", vis.barsHeight) // Set image width
                .attr("height", vis.barsHeight) // Set image height
                .attr("preserveAspectRatio", "xMidYMid meet");

            // Optionally, you can update the y-axis with no text labels
            vis.svg.select(".y-axis").call(vis.yAxis)
                .selectAll("text").remove(); // Remove text labels, as we are using images
        }

        // Add or update labels within bars
        vis.svg.selectAll(".bar-label").remove();

        const barLabels = vis.svg.selectAll(".bar-label")
            .data(vis.data, d => d.topic);

        barLabels.enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", d => 60)
            .attr("y", d => vis.yScale(d.topic) + vis.yScale.bandwidth() / 2 + 2)
            .text(d => d.topic)
            .style("font-size", "12px")
            .style("fill", "white")
            .style("opacity", 0) // Start with opacity 0
            .merge(barLabels)
            .transition() // Start a transition
            .duration(vis.animationDuration + 500) // Duration of 100 milliseconds
            .style("opacity", 1); // Transition to full opacity


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
                setTimeout(() => {
                    d3.select("#vis4-year-display").text(currentYear - 1);
                    setTimeout(animate, vis.animationDuration); // Additional pause after year change
                }, 500); // Pause after year changes
            } else {
                // Enable the "Start Again" button when the animation is complete
                startAgainButton.disabled = false;
            }
        }

        animate();
    }

}