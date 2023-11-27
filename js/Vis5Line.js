class Vis5Line  {

    constructor(_parentElement) {

        this.parentElement = _parentElement;
        this.data = vis5Data;
        this.userAge = userAge;
        this.year = 2004;

        // get list of topics
        let topicsSet = new Set();
        this.data.forEach(d => {
            topicsSet.add(d.Topic);
        });
        this.topicList = Array.from(topicsSet);

        // default topic
        this.selectedTopic = this.topicList[0];

        // Step 1: Group your data by Topic
        const dataByTopic = d3.group(this.data, d => d.Topic);

        // Step 2 and 3: Find the year with the maximum value for each Topic and create a new array
        this.topicWithMaxYear = Array.from(dataByTopic, ([topic, topicData]) => {
            let maxYear = null;
            let maxValue = -Infinity;

            for (const entry of topicData) {
                for (const year in entry) {
                    if (year !== 'Image' && year !== 'Topic') {
                        const value = entry[year];
                        if (value > maxValue) {
                            maxValue = value;
                            maxYear = year;
                        }
                    }
                }
            }

            return { topic, year: maxYear };
        });

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Select the parent div where the dropdown should be placed
        let dropdownDiv = d3.select("#vis5-topics");

        // Create a select element
        let select = dropdownDiv.append("select")
            .attr("id", "vis5-menu")
            .attr("class", "form-control"); // Add any classes you need

        // Add a default option (optional)
        select.append("option")
            .attr("value", "")
            .text("Select a Topic");

        // Populate the dropdown with options from topicList
        select.selectAll("option.topic")
            .data(vis.topicList)
            .enter()
            .append("option")
            .attr("class", "topic")
            .attr("value", d => d)
            .text(d => d);

        // Event listener for dropdown changes
        select.on("change", function() {
            let selectedTopic = d3.select(this).property("value");
            vis.updateVis(selectedTopic); // You need to define updateVis method
        });

        // Define margins and dimensions
        vis.margin = { top: 20, right: 80, bottom: 60, left: 40 };
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

        // Create the SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Set the scales for x and y axes
        vis.xScale = d3.scaleLinear()
            .domain([2004, 2022]) // Assuming the data spans from 2004 to 2022
            .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
            .domain([0, 100]) // Assuming the values range from 0 to 100
            .range([vis.height, 0]);

        // Create the x and y axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(10)
            .tickFormat(d3.format("d")); // Use 'd' format to display years without commas

        vis.yAxis = d3.axisLeft(vis.yScale).ticks(5);

        // Append the x and y axes to the SVG
        vis.svg.append("g")
            .attr("class", "vis5-x-axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis);

        vis.svg.append("g")
            .attr("class", "vis5-y-axis")
            .call(vis.yAxis);

        vis.svg.append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + vis.margin.bottom - 10) // Adjust this as needed
            .text("Year");

        // Add a gray line to represent the data (you will update this in the updateVis method)
        vis.svg.append("path")
            .attr("class", "vis5-data-line")
            .attr("stroke", "lightgray")
            .attr("stroke-width", 2)
            .attr("fill", "none");

        vis.linesGroup = vis.svg.append("g");

        // Create a tooltip div (if not already in HTML)
        vis.tooltip = d3.select("body").append("div")
            .attr("class", "vis5-tooltip") // Add your tooltip class for styling
            .style("opacity", 0);

        // Define the line function for drawing the lines
        let line = d3.line()
            .x(d => vis.xScale(d.year))
            .y(d => vis.yScale(d.value));

        // Loop through each topic in the topic list
        vis.topicList.forEach(topic => {
            // Find the object for the current topic
            let topicData = vis.data.find(d => d.Topic === topic);

            // Transform the data into an array of { year, value } objects
            let topicFilteredData = Object.keys(topicData)
                .filter(key => key !== 'Topic' && parseInt(key) <= 2023 ) // Exclude 'Topic' key
                .map(year => {
                    // Check if the value is NaN, if so, replace with 0
                    let value = isNaN(topicData[year]) ? 0 : topicData[year];
                    return {
                        year: parseInt(year),
                        value: value
                    };
                });

            // console.log("Filtered Data for Topic:", topic, topicFilteredData);

            // Bind topicFilteredData to a line
            let linePath = vis.linesGroup.append("path")
                .datum(topicFilteredData) // Bind the data to the path
                .attr("class", "vis-data-line")
                .attr("data-topic", topic)
                .attr("stroke", "lightgray") // Thin gray line for each topic
                .attr("stroke-width", 1)
                .attr("fill", "none")
                .attr("d", line);

            linePath
                .on("mouseover", function(event, d) {
                    vis.tooltip.transition()
                        .duration(50)
                        .style("opacity", .9);
                    vis.tooltip.html(topic + "<br/>")
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    vis.tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on("click", function(d) {
                    vis.updateVis(topic);
                });


        });

        vis.wrangleData();
    }


    wrangleData() {
        let vis = this;

        vis.updateVis(vis.selectedTopic);

    }

    updateVis(selectedTopic) {
        let vis = this;

        d3.selectAll(".vis5-topicName").text(selectedTopic);

        // Reset all lines to default style
        vis.linesGroup.selectAll(".vis-data-line")
            .attr("stroke", "lightgray")
            .attr("stroke-width", 1);

        // Highlight the line for the selected topic
        vis.linesGroup.selectAll(".vis-data-line")
            .filter(function(d) { return d3.select(this).attr("data-topic") === selectedTopic; })
            .attr("stroke", "steelblue")
            .attr("stroke-width", 8);

        let selectedTopicData = vis.data.find(d => d.Topic === selectedTopic);
        if (selectedTopicData && selectedTopicData.Image) {
            // Update the div to show the image
            d3.select("#vis5-image")
                .html("") // Clear existing content
                .append("img")
                .attr("src", 'images/vis1top/' + selectedTopicData.Image)
                .attr("alt", "Image of " + selectedTopic)
                .style("width", "100%");
        } else {
            // Handle cases where the image is not found
            d3.select("#vis5-image").html("No image available for " + selectedTopic);
        }

        // this.topicWithMaxYear
        // Find the entry in vis.topicWithMaxYear for the selected topic
        const selectedEntry = vis.topicWithMaxYear.find(entry => entry.topic === selectedTopic);

        // Update the HTML <span> element with the year
        const spanElement = document.getElementById("vis5-topicUserAge");
        if (spanElement && selectedEntry) {
            let peakYear = selectedEntry.year;
            let peakPhrase = "Peaked when you were " + (peakYear - 2023 + vis.userAge ) + " years old";
            spanElement.textContent = peakPhrase;
        } else {
            spanElement.textContent = "";
        }
        // console.log("selectedTopicData", selectedTopicData);

    }

}