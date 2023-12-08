class Vis4Race  {

    constructor(_parentElement) {

        this.parentElement = _parentElement;
        this.data = vis1Data;
        this.userAge = userAge;
        this.userTopic = userTopic;
            //let userTopicOptions = ['Human Impact', 'Gas Emissions', 'Global Warming', 'Pollution and Nature'];
        this.year = 2004;
        this.itemsToShow = 12;
        this.animationDuration = 800;
        this.animationPause = 800;
        this.topicImage = topicImage;

        this.barsHeight = 42;
        this.barsPadding = 4;

        this.whatPeaked = "";
        this.topicHuman = ['Activist', 'Global warming', 'Genetically modified', 'EPA', 'Greta Thunberg', 'Climate action'];
        this.topicEmissions = ['Carbon emissions', 'Greenhouse gases', 'Sustainability', 'Green ai'];
        this.topicWarming = ['Environment', 'Global warming', 'Renewable energy', 'Ecosystem'];
        this.topicPollution= ['Habitats', 'Ice caps', 'Ocean', 'Sea ice', 'Wildfires'];
        this.topicSelected = this.topicHuman;

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Define margins and dimensions
        vis.margin = { top: 0, right: 80, bottom: 10, left: 40 };
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

        // Append a label to the x-axis
        vis.svg.append("text")
            .attr("class", "x-axis-label label-small")
            .attr("x", vis.width / 2) // Position the label in the center of the x-axis
            .attr("y", vis.height + vis.margin.bottom - 5) // Adjust the y position as needed
            .style("text-anchor", "middle") // Center the text horizontally
            .style("font-size", "20px")
            .text("Year over Year relative searches on Google from 2004-2023");


        // Create a line on the right with the text "Peak"
        vis.svg.append("line")
            .attr("x1", vis.width + (vis.barsHeight + vis.barsPadding *2))
            .attr("y1", 0)
            .attr("x2", vis.width + (vis.barsHeight + vis.barsPadding *2))
            .attr("y2", vis.height)
            .attr("stroke", "black");


        vis.svg.append("text")
            .attr("x", -30) // Adjust the x position as needed
            .attr("y", vis.height / 2)  // Adjust the y position as needed
            .attr("dy", "0.35em") // Adjust vertical alignment
            .style("text-anchor", "start")
            .style("font-size", "12px")
            .attr("transform", "rotate(270, " + (-20) + ", " + (vis.height / 2) + ")") // Rotate 90 degrees
            .text("Relative Search Popularity");

        vis.svg.append("text")
            .attr("x", vis.width + 50) // Adjust the x position as needed
            .attr("y", vis.height / 2)  // Adjust the y position as needed
            .attr("dy", "0.35em") // Adjust vertical alignment
            .style("text-anchor", "start")
            .style("font-size", "20px")
            .attr("transform", "rotate(270, " + (vis.width + 60) + ", " + (vis.height / 2) + ")") // Rotate 90 degrees
            .text("Search Terms Peak Here");

        vis.wrangleData();

    }
    wrangleData() {
        let vis = this;

        vis.data = vis4Data;
        vis.userTopic = userTopic;

        // Filter the data for the selected year (vis.year)
        vis.yearData = vis.data.filter(d => d[vis.year]);

        if (vis.userTopic === 'Human Impact') {
            vis.topicSelected = vis.topicHuman;
        }
        if (vis.userTopic === 'Gas Emissions') {
            vis.topicSelected = vis.topicEmissions;
        }
        if (vis.userTopic === 'Global Warming') {
            vis.topicSelected = vis.topicWarming;
        }
        if (vis.userTopic === 'Pollution and Nature') {
            vis.topicSelected = vis.topicPollution;
        }


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

        // Filter the topics with a value of 100 for the selected year
        let topicsWithValue100 = vis.topTopics
            .filter(d => d.value === 100 && vis.topicSelected.includes(d.topic));

        // Map the topics to include the year in the text
        const topicText = topicsWithValue100
            .map(d => `${d.topic} in ${vis.year} •  `)
            .join(' ');

        vis.whatPeaked = vis.whatPeaked + " " + topicText;

        // Select the span element and add the text

        const spanElement = d3.select('#vis4-peaked-span')
            .html(''); // Clear the existing content
        spanElement
            .append('span')
            .attr('id', 'peakTopicText')
            .text(`${vis.whatPeaked}`);


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


        console.log("vis.topicSelected", vis.topicSelected)
        // ENTER phase: Add new bars for incoming data
        const enterBars = bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 60) // Starting position for animation
            .attr("y", d => vis.yScale(d.topic))
            .attr("width", 0) // Starting width for animation
            // .attr("height", vis.yScale.bandwidth()) // Height of the bars
            .attr("height", vis.barsHeight) // Height of the bars
            .style("fill", d => {
                // Check if the topic is in the topicsArray
                if (vis.topicSelected.includes(d.topic)) {
                    return "#596a48"; // Set fill color based on topic
                } else {
                    return "#999788"; // Default color for topics not in the array
                }
            });


        bars.merge(enterBars)
            .transition()
            .duration(vis.animationDuration)
            .attr("x", (vis.barsHeight + vis.barsPadding *2 ) )
            .attr("y", d => vis.yScale(d.topic))
            .attr("width", d => vis.xScale(d.value))
            .attr("height", vis.barsHeight)
            // .style("fill", "steelblue")
            .style("fill", d => {
                // Check if the topic is in the topicsArray
                if (vis.topicSelected.includes(d.topic)) {
                    return "#596a48"; // Set fill color based on topic
                } else {
                    return "#999788"; // Default color for topics not in the array
                }
            })
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
                    .attr("height", vis.barsHeight)
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
            .style("font-size", "20px")
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
        vis.whatPeaked = "";

        // Disable the "Start Again" button
        startAgainButton.disabled = true;

        function animate() {
            if (currentYear <= 2023) {
                vis.updateChartForYear(currentYear);
                currentYear++;
                setTimeout(() => {
                    d3.select("#vis4-year-display").text(currentYear - 1);
                    setTimeout(animate, vis.animationDuration); // Additional pause after year change
                }, vis.animationPause); // Pause after year changes
            } else {
                // Enable the "Start Again" button when the animation is complete
                startAgainButton.disabled = false;
            }
        }

        animate();
    }

}