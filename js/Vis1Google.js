class Vis1Google  {

    constructor(_parentElement) {
        this.parentElement = _parentElement;
        this.data = vis1Data;
        this.userAge = userAge;
        this.year = 2004;
        this.itemsToShow = 15;
        this.news = vis1News;

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

        // update labels (beck/next buttons, age and dynamic text)
        vis.hideOrShow();

        // update images
        vis.setVis1Images();

        // update news
        vis.setVis1News()

        // console.log("vis1Google", vis.year, vis)

    }



    onYearChange(year) {
        // this updates the year, and calls the wrangleData for re-sorting
        let vis = this;

        vis.year = year;
        vis.wrangleData();
        // console.log("vis1Google onYearChange", year)
    }

    onAgeChange(age) {
        // this updates the year, and calls the wrangleData for re-sorting
        let vis = this;

        vis.userAge = age;
        vis.wrangleData();
    }

    setVis1Images() {
        let vis = this;
        let numberOfImages = 4;

        // add year (e.g. 2012)
        const vis1ImageElement = document.getElementById("vis1-images");
        vis1ImageElement.innerHTML = '';

        // Select the top 3 topics and images
        const topTopics = vis.topTopics.slice(0, numberOfImages);

        // Create a Bootstrap row to hold the cards
        const row = document.createElement("div");
        row.classList.add("row");

        // Loop through the top 3 topics and create a card for each
        topTopics.forEach(topicData => {
            const cardCol = document.createElement("div");
            cardCol.classList.add("col-md-3");
            cardCol.classList.add("pb-3");
            cardCol.classList.add("col-6");

            const card = document.createElement("div");
            card.classList.add("card");

            // Add the topic as the card title
            const cardTitle = document.createElement("div");
            cardTitle.classList.add("vis1-image-title");
            cardTitle.textContent = topicData.topic;

            // Add the image as the card content
            const cardImage = document.createElement("img");
            cardImage.classList.add("card-img-top");
            cardImage.src = topicData.image;
            cardImage.alt = topicData.topic; // You can set an alt attribute for accessibility

            // Append the card title and image to the card
            card.appendChild(cardImage);
            card.appendChild(cardTitle);

            // Append the card to the column and the column to the row
            cardCol.appendChild(card);
            row.appendChild(cardCol);
        });

        // Append the row to the container
        vis1ImageElement.appendChild(row);

    }

    setVis1News() {
        let vis = this;
        const filteredNews = vis.news.find(item => item.Year === vis.year);

        if (!filteredNews) {
            console.log("No news found for the selected year.");
            return;
        }

        // console.log("filteredNews", filteredNews);

        const vis1NewsElement = d3.select("#vis1-news");
        vis1NewsElement.html(''); // Clear existing content

        // Function to create a row with transition
        function createRowWithTransition(selector, text, className) {
            const randomDuration = Math.floor(Math.random() * (2000 - 500 + 1)) + 500; // Random between 500 and 2000 ms

            vis1NewsElement
                .append("div")
                .classed(className, true)
                .style("opacity", 0) // Set initial opacity to 0
                .text(text)
                .transition() // Apply transition
                .duration(randomDuration) // Transition duration in milliseconds (adjust as needed)
                .style("opacity", 1); // Transition to opacity 1
        }

        if (filteredNews.Lead.length > 2) {
            createRowWithTransition(".vis1-news-lead", filteredNews.Lead, "vis1-news-lead");
        }
        if (filteredNews.Second.length > 2) {
            createRowWithTransition(".vis1-news-second", filteredNews.Second, "vis1-news-second");
        }
        if (filteredNews.Social.length > 2) {
            createRowWithTransition(".vis1-news-social", filteredNews.Social, "vis1-news-social");
        }
        if (filteredNews.Item3.length > 2) {
            createRowWithTransition(".vis1-news-item3", filteredNews.Item3, "vis1-news-item3");
        }
        if (filteredNews.Item4.length > 2) {
            createRowWithTransition(".vis1-news-item4", filteredNews.Item4, "vis1-news-item4");
        }
        if (filteredNews.Item5.length > 2) {
            createRowWithTransition(".vis1-news-item5", filteredNews.Item5, "vis1-news-item5");
        }
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

        // add year (e.g. 2012)
        const vis1YearElements = document.getElementsByClassName("vis1-year");
        for (let i = 0; i < vis1YearElements.length; i++) {
            vis1YearElements[i].innerHTML = vis.year;
        }

        // reader's age
        let tempAge = vis.userAge - (2023 - vis.year);
        let tempAgetext = "when you were " + tempAge + " years old";
        let tempAgeYears = tempAge + " years old";
        if(tempAge < 0){
            tempAgetext = "Before you Were Born" ;
            tempAgeYears = "Before you Were Born" ;
        }

        const yearLessUserAge = document.getElementsByClassName("vis1-yearLessUserAge");
        for (let i = 0; i < yearLessUserAge.length; i++) {
            yearLessUserAge[i].innerHTML = tempAgetext;
        }

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

    }

}
