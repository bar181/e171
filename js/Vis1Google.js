class Vis1Google  {

    constructor(_parentElement) {
        this.parentElement = _parentElement;
        this.data = vis1Data;
        this.userAge = userAge;
        this.year = 2010;

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Calculate the height of the y-axis based on the number of items in vis.data
        const yHeight = 10 * 30; // Adjust the multiplier as needed for spacing

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
        vis.data = vis1Data;
        // Filter the data for the selected year (vis.year)
        vis.yearData = vis.data.filter(d => d[vis.year]);

        // Sort the filtered data by the values for the selected year in descending order
        vis.yearData.sort((a, b) => b[vis.year] - a[vis.year]);

        // Select the top 10 topics for the year (or all topics if there are fewer than 10)
        vis.topTopics = vis.yearData.slice(0, Math.min(10, vis.yearData.length))
            .map((d, i) => ({ rank: i + 1, topic: d.Topic, value: parseInt(d[vis.year]) })); // Add rank starting at 1

        // Update vis.data with the sorted and filtered data
        vis.data = vis.topTopics;

        // Update the visualization
        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        // Define the transition duration for animations
        const transitionDuration = 1000;

        // Remove all existing bars and labels
        vis.svg.selectAll(".bar").remove();
        vis.svg.selectAll(".value-label").remove();
        vis.svg.selectAll(".rank-label").remove();


        // Update the xScale domain to always have a minimum of 0 and a maximum of 100
        vis.xScale.domain([0, 100]);

        // Select and bind data to bars
        const bars = vis.svg.selectAll(".bar")
            .data(vis.data, d => d.topic);

        // EXIT phase: Remove bars that are no longer in the data
        bars.exit()
            .transition()
            .duration(transitionDuration)
            .attr("width", 0)
            .remove();

        // ENTER phase: Add new bars for incoming data
        const enterBars = bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0) // Starting position for animation
            .attr("y", (d, i) => i * 25) // Vertical position for each bar
            .attr("width", 0) // Starting width for animation
            .attr("height", 20) // Height of the bars
            .style("fill", "steelblue");

        // UPDATE phase: Update properties of existing bars (including animations)
        bars.merge(enterBars)
            .transition()
            .duration(transitionDuration)
            .attr("x", 0) // Starting position for animation
            .attr("y", (d, i) => i * 25) // Vertical position for each bar
            .attr("width", d => vis.xScale(d.value)) // Bar width based on value
            .attr("height", 20) // Height of the bars
            .style("fill", "steelblue");

        // Add value labels to the right of the bars
        const valueLabels = vis.svg.selectAll(".value-label")
            .data(vis.data, d => d.topic);

        valueLabels.exit().remove();

        valueLabels.enter()
            .append("text")
            .attr("class", "value-label")
            .attr("x", d => vis.xScale(d.value) + 5) // Adjust the position for the label
            .attr("y", (d, i) => i * 25 + 15) // Adjust the vertical position for the label
            .text(d => d.value)
            .style("font-size", "12px"); // Adjust the font size


        const rankLabels = vis.svg.selectAll(".rank-label")
            .data(vis.data, d => d.topic);

        rankLabels.exit().remove();

        rankLabels.enter()
            .append("text")
            .attr("class", "rank-label")
            .attr("x", -5) // Adjust the position for the label
            .attr("y", (d, i) => i * 25 + 15) // Adjust the vertical position for the label
            .text(d => `${d.rank}. ${d.topic}`)
            .style("font-size", "12px")
            .style("text-anchor", "end");

        // Update the y-axis
        vis.svg.select(".y-axis")
            .transition()
            .duration(transitionDuration)
            .call(vis.yAxis);

        vis.hideOrShow();
        console.log("vis1Google", vis.year, vis)

    }

    onYearChange(year) {
        // this updates the year, and calls the wrangleData for re-sorting
        let vis = this;

        vis.year = year;
        vis.wrangleData();
        console.log("vis1Google onYearChange", year)
    }

    vis1NextButton(){
        let vis = this;
        vis.onYearChange(vis.year + 1)
    }
    vis1BackButton(){
        let vis = this;
        vis.onYearChange(vis.year - 1)
    }

    hideOrShow(){
        let vis = this;
        const vis1Year = document.getElementById("vis1-year");
        vis1Year.innerHTML = vis.year;

        // top back and next page
        if(vis.year <2005){
            backButtonsContainer.style.visibility = "hidden";
        } else {
            backButtonsContainer.style.visibility = "visible";
        }
        if(vis.year >2022){
            nextButtonsContainer.style.visibility = "hidden";
        } else {
            nextButtonsContainer.style.visibility = "visible";
        }

        // email - years 2004 to 2008
        if(vis.year <2009){
            vis.updateEmailLabels(vis.year);
            emailSections.forEach(section => {
                section.style.display = 'block';
            });
        } else {
            emailSections.forEach(section => {
                section.style.display = 'none';
            });
        }
        if(vis.year >=2009 && vis.year <=2013){
            vis.updateFbLabels(vis.year);
            fbSections.forEach(section => {
                section.style.display = 'block';
            });
        } else {
            fbSections.forEach(section => {
                section.style.display = 'none';
            });
        }

    }

    updateEmailLabels(year) {
        console.log("vis1Google updateEmailLabels", year)
        const emailTitle = document.getElementById("vis1Google-email-title");
        emailTitle.innerHTML ="Topic: Check out the Climate keywords that peaked in " + year + "!";

        const emailYear = document.getElementById("vis1Google-email-year");
        emailYear.innerHTML ="Date: From " + year;

        const vis1Year = document.getElementById("vis1-year");
        vis1Year.innerHTML = year;
    }

    updateFbLabels(year) {
        console.log("vis1Google updateFbLabels", year)
        // const emailTitle = document.getElementById("vis1Google-email-title");
        // emailTitle.innerHTML ="Topic: Check out the Climate keywords that peaked in " + year + "!";
        //
        // const emailYear = document.getElementById("vis1Google-email-year");
        // emailYear.innerHTML ="Date: From " + year;
        //
        // const vis1Year = document.getElementById("vis1-year");
        // vis1Year.innerHTML = year;
    }
}
