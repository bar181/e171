class Vis2BubbleChart {
    constructor(
        containerId,
        tweets_per_topic,
        tweets_per_topic_per_year,
        aggressiveness_per_topic,
        aggressiveness_per_topic_per_year,
        sentiment_per_topic,
        sentiment_per_topic_per_year,
        stance_per_topic,
        stance_per_topic_per_year
    ){
        this.containerId = containerId;
        this.tweets_per_topic = tweets_per_topic;
        this.tweets_per_topic_per_year = tweets_per_topic_per_year;
        this.aggressiveness_per_topic = aggressiveness_per_topic;
        this.aggressiveness_per_topic_per_year = aggressiveness_per_topic_per_year;
        this.sentiment_per_topic = sentiment_per_topic;
        this.sentiment_per_topic_per_year = sentiment_per_topic_per_year;
        this.stance_per_topic = stance_per_topic;
        this.stance_per_topic_per_year = stance_per_topic_per_year;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 40, right: 40, bottom: 40, left: 40 };
        vis.width = 940 - vis.margin.left - vis.margin.right;
        vis.height = 450 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select('#' + vis.containerId).append('svg')
            .attr('width', vis.width + vis.margin.left + vis.margin.right)
            .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate(${vis.margin.left},${vis.margin.top})`);

        vis.tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('text-align', 'center')
            .style('width', '120px')
            .style('height', 'auto')
            .style('padding', '2px')
            .style('font', '12px sans-serif')
            .style('background', 'lightsteelblue')
            .style('border', '0px')
            .style('border-radius', '8px')
            .style('pointer-events', 'none');

        vis.createChart();
    }

    updateSelection(selectedSubject, selectedYear, selectedTopic) {
        let vis = this;

        console.log("SELECTION UPDATED:   SUBJECT=\"" + selectedSubject + "\"   YEAR=\"" + selectedYear + "\"   TOPIC=\"" + selectedTopic + "\"");


        // update pie / bubble chart data (size / tooltips) to show data only for currently selected year, or for all years.


        if (selectedSubject === 'Aggressiveness' && selectedYear === 'All Years') {
            vis.displayAggressivenessAllYears()

        } else if (selectedSubject === 'Sentiment' && selectedYear === 'All Years') {
            vis.displaySentimentAllYears()

        } else if (selectedSubject === 'Stance' && selectedYear === 'All Years') {
            vis.displayStanceAllYears()

        } else if (selectedSubject === 'None' && selectedYear === 'All Years') {
            vis.displayDefaultSubjectAllYears()


        } else if (selectedSubject === 'Aggressiveness' && selectedYear != 'All Years') {
            vis.displayAggressivenessSingleYear(selectedYear)

        } else if (selectedSubject === 'Sentiment' && selectedYear != 'All Years') {
            vis.displaySentimentSingleYear(selectedYear)

        } else if (selectedSubject === 'Stance' && selectedYear != 'All Years') {
            vis.displayStanceSingleYear(selectedYear)

        } else if (selectedSubject === 'None' && selectedYear != 'All Years') {
            vis.displayDefaultSubjectSingleyear(selectedYear)

        }


        // This should be last, because it doesn't add anything, it only makes some stuff gray.
        if (selectedTopic != 'All Topics' && selectedYear != 'All Years') {
            // make all bubbles / pie sections that != selectedTopic gray
            // do not change the color of the bubble / pie section whose topic is currently selected
        }
    }

    // updateSelection(selectedSubject, selectedYear, selectedTopic) {
    //     // Initial console log for debugging
    //     // console.log("updateSelection function is called");
    //     let vis = this;
    //     // Log to check if the function is called and the parameters received
    //     // console.log("updateSelection called with:", selectedSubject, selectedYear, selectedTopic);
    //
    //     // update pie / bubble chart data (size / tooltips) to show data only for currently selected year, or for all years.
    //
    //
    //     // update colors based on selected subject
    //     if (selectedSubject === 'Aggressiveness' && selectedYear === 'All Years') {
    //         // compute average aggressiveness per topic
    //         // color each bubble (topic) with a color representing that topics average aggressiveness
    //
    //
    //
    //     } else if (selectedSubject === 'Aggressiveness' && selectedYear != 'All Years') {
            // filter vis.aggressiveness_per_topic_per_year to only rows where Year === vis.currentYear
            // color each bubble (topic) with a color representing that topics aggressiveness
            // Filter data for the selected year
            // Filter data for the selected year

    displayAggressivenessAllYears() {
        let vis = this;

        let unfilteredData = (vis.aggressiveness_per_topic);

        // Define a scale for aggressiveness to color mapping
        let aggressivenessScale = d3.scaleLinear()
            .domain([d3.min(vis.aggressiveness_per_topic, d => d.Aggressiveness), d3.max(vis.aggressiveness_per_topic, d => d.Aggressiveness)])
            .range(['#FFB6C1', '#880469']);

        // enter / update / exit paths
        // Update the bubbles' colors based on Aggressiveness
        vis.svg.selectAll('circle')
            .data(unfilteredData)
            .transition() // Apply a transition if desired
            .duration(1000) // Duration of transition
            .style('fill', d => aggressivenessScale(d.Aggressiveness));
    }

    displaySentimentAllYears() {
        let vis = this;

        let unfilteredData = (vis.sentiment_per_topic);

        // Define a scale for sentiment to color mapping
        let sentimentScale = d3.scaleLinear()
            .domain([d3.min(vis.sentiment_per_topic, d => d.Sentiment), d3.max(vis.sentiment_per_topic, d => d.Sentiment)])
            .range(['#af1d34', '#389161']);

        // enter / update / exit paths
        vis.svg.selectAll('circle')
            .data(unfilteredData)
            .transition() // Apply a transition if desired
            .duration(1000) // Duration of transition
            .style('fill', d => sentimentScale(d.Sentiment));
    }

    displayStanceAllYears() {
        let vis = this;

        let unfilteredData = (vis.stance_per_topic);

        // Define a scale for stance to color mapping
        let stanceColorScale = d3.scaleOrdinal()
            .domain(['believer', 'neutral', 'denier'])
            .range(['#2d9c2d', '#d7af49', '#a02c3d']); // Example colors: blue for believer, orange for neutral, green for denier

        // enter / update / exit paths
        vis.svg.selectAll('circle')
            .data(unfilteredData)
            .transition() // Apply a transition if desired
            .duration(1000) // Duration of transition
            .style('fill', d => stanceColorScale(d.most_popular_stance));
    }

    displayDefaultSubjectAllYears() {
        let vis = this;

        //recreate pie data from the original dataset
        let originalData = (vis.tweets_per_topic);

        // enter / update / exit paths
        vis.svg.selectAll('circle')
            .data(originalData)
            .transition() // Apply a transition if desired
            .duration(1000) // Duration of transition
            .style('fill', (d, i) => vis.getColor(i));
    }

    displayAggressivenessSingleYear(selectedYear) {
        let vis = this;
        console.log("Aggressiveness Data Before Filtering:", vis.aggressiveness_per_topic_per_year);

        let filteredData = vis.aggressiveness_per_topic_per_year.filter(d => d.Year === selectedYear);

        console.log("Filtered Data for Aggressiveness in Year " + selectedYear + ":", filteredData);

        // Define a scale for aggressiveness to color mapping
        let aggressivenessScale = d3.scaleLinear()
            .domain([d3.min(filteredData, d => d.Aggressiveness), d3.max(filteredData, d => d.Aggressiveness)])
            .range(['#FFB6C1', '#880469']);
        console.log("Aggressiveness Scale:", aggressivenessScale);

        // Update the bubbles' colors based on Aggressiveness
        vis.svg.selectAll('circle')
            .data(filteredData)
            .transition() // Apply a transition if desired
            .duration(1000) // Duration of transition
            .style('fill', d => aggressivenessScale(d.Aggressiveness));

    }

    displaySentimentSingleYear(selectedYear){
        // filter vis.aggressiveness_per_topic_per_year to only rows where Year === vis.currentYear
        // color each bubble (topic) with a color representing that topics aggressiveness
        // Filter data for the selected year
        // Filter data for the selected year
        console.log("Sentiment Data Before Filtering:", vis.sentiment_per_topic_per_year);

        let filteredData = vis.sentiment_per_topic_per_year.filter(d => d.Year === +selectedYear);
        console.log("Filtered Data for Sentiment in Year " + selectedYear + ":", filteredData);


        let sentimentScale = d3.scaleLinear()
            .domain([d3.min(filteredData, d => d.Sentiment), d3.max(filteredData, d => d.Sentiment)])
            .range(['#af1d34', '#389161']); // Red for negative, Green for positive

        console.log("Sentiment Scale:", sentimentScale);

        // Update the bubbles' colors based on Sentiment
        vis.svg.selectAll('circle')
            .data(filteredData)
            .transition()
            .duration(1000)
            .style('fill', d => sentimentScale(d.Sentiment));
    }
    displayStanceSingleYear(selectedYear) {
        console.log("Stance Data Before Filtering:", vis.stance_per_topic_per_year);

        let filteredData = vis.stance_per_topic_per_year.filter(d => d.Year === +selectedYear);
        console.log("Filtered Data for Stance in Year " + selectedYear + ":", filteredData);


        let stanceColorScale = d3.scaleOrdinal()
            .domain(['believer', 'neutral', 'denier'])
            .range(['#2d9c2d', '#d7af49', '#a02c3d']); // Colors for believer, neutral, denier

        // Update the bubbles' colors based on Stance
        vis.svg.selectAll('circle')
            .data(filteredData)
            .transition()
            .duration(1000)
            .style('fill', function (d) {
                return stanceColorScale(d.most_popular_stance)
            })
    }

    displayDefaultSubjectSingleyear(selectedYear) {
        let vis = this;

        // Update the pie layout with the filtered data
        let filteredData = vis.tweets_per_topic_per_year.filter(d => d.Year === +selectedYear);

        // enter / update / exit paths
        let circles = vis.svg.selectAll('circle').data(filteredData);
        circles.exit().remove();
        circles.enter().append('path')
            .merge(circles)
            .transition().duration(1000)
            .attr('d', circles) //not sure this is correct
            .attr('fill', (d, i) => vis.getColor(i))
    }



    //
    //
    //
    //
    //
    //     } else if (selectedSubject === 'Sentiment' && selectedYear === 'All Years') {
    //
    //
    //
    //
    //
    //     } else if (selectedSubject === 'Sentiment' && selectedYear != 'All Years') {
    //         // filter vis.aggressiveness_per_topic_per_year to only rows where Year === vis.currentYear
    //         // color each bubble (topic) with a color representing that topics aggressiveness
    //         // Filter data for the selected year
    //         // Filter data for the selected year
    //         console.log("Sentiment Data Before Filtering:", vis.sentiment_per_topic_per_year);
    //
    //         let filteredData = vis.sentiment_per_topic_per_year.filter(d => d.Year === +selectedYear);
    //         console.log("Filtered Data for Sentiment in Year " + selectedYear + ":", filteredData);
    //
    //         if (filteredData.length > 0) {
    //             let sentimentScale = d3.scaleLinear()
    //                 .domain([d3.min(filteredData, d => d.Sentiment), d3.max(filteredData, d => d.Sentiment)])
    //                 .range(['#af1d34', '#389161']); // Red for negative, Green for positive
    //
    //             console.log("Sentiment Scale:", sentimentScale);
    //
    //             // Update the bubbles' colors based on Sentiment
    //             vis.svg.selectAll('circle')
    //                 .data(filteredData)
    //                 .transition()
    //                 .duration(1000)
    //                 .style('fill', d => sentimentScale(d.Sentiment));
    //         } else {
    //             console.log("No data available for Sentiment in Year " + selectedYear);
    //         }
    //
    //
    //
    //     } else if (selectedSubject === 'Stance' && vis.currentYear === 'All Years') {
    //
    //
    //
    //
    //     } else if (selectedSubject === 'Stance' && vis.currentYear != 'All Years') {
    //         console.log("Stance Data Before Filtering:", vis.stance_per_topic_per_year);
    //
    //         let filteredData = vis.stance_per_topic_per_year.filter(d => d.Year === +selectedYear);
    //         console.log("Filtered Data for Stance in Year " + selectedYear + ":", filteredData);
    //
    //         if (filteredData.length > 0) {
    //             let stanceColorScale = d3.scaleOrdinal()
    //                 .domain(['believer', 'neutral', 'denier'])
    //                 .range(['#2d9c2d', '#d7af49', '#a02c3d']); // Colors for believer, neutral, denier
    //
    //             // Update the bubbles' colors based on Stance
    //             vis.svg.selectAll('circle')
    //                 .data(filteredData)
    //                 .transition()
    //                 .duration(1000)
    //                 .style('fill', function(d) {return stanceColorScale(d.most_popular_stance)})
    //         } else {
    //             console.log("No data available for Stance in Year " + selectedYear);
    //         }
    //     }
    //
    //
    //     // This should be last, because it doesn't add anything, it only makes some stuff gray.
    //     if (selectedTopic != 'All Topics') {
    //         // make all bubbles / pie sections that != selectedTopic gray
    //         // do not change the color of the bubble / pie section whose topic is currently selected
    //     }
    // }

    updateSelectedSubject(newSubject) {
        let vis = this;

        // code to update the viz for this subject.
    }

    updateSelectedTopic(newTopic) {
        let vis = this;
        vis.svg.selectAll('circle').style('fill', (d, i) => {
            if ((newTopic === 'All Topics') || (newTopic === d.data.Topic)) {
                return vis.getColor(i);
            } else {
                return 'lightgray';
            }
        })
    }

    updateSelectedYear(newYear) {
        let vis = this;
        let filteredData = null;

        if (newYear === 'all') {
            // Compute total num tweets per topic across all years.
            filteredData = vis.tweets_per_topic_per_year.reduce((accumulator, current) => {
                let topic = current.Topic;
                let count = current.Count;
                // Initialize the topic in the accumulator if it doesn't exist
                if (!accumulator[topic]) {
                    accumulator[topic] = { Topic: topic, Count: 0 };
                }
                // Add the count to the topic in the accumulator
                accumulator[topic].Count += count;
                return accumulator;
            }, {});
            // Convert back to array
            filteredData = Object.values(filteredData);
        } else {
            filteredData = vis.tweets_per_topic_per_year.filter(d => d.Year === +newYear);
        }

        // Re-calculate the layout with the new data
        let pack = d3.pack().size([vis.width, vis.height]).padding(1.5);
        let root = d3.hierarchy({ children: filteredData }).sum(d => d.Count);
        let nodes = pack(root).leaves();

        // Use d3.forceSimulation for collision detection
        let simulation = d3.forceSimulation(nodes)
            .force("x", d3.forceX(d => d.x).strength(0.5))
            .force("y", d3.forceY(d => d.y).strength(0.5))
            .force("collide", d3.forceCollide(d => d.r + 1)) // add padding between bubbles
            .alphaDecay(1)
            .alpha(0.1)
            .on("tick", ticked);

        function ticked() {
            vis.svg.selectAll('circle')
                .data(nodes, d => d.data.Topic)
                .join('circle') // Handles the enter, update, and exit
                .transition()
                .duration(1000)
                .attr('r', d => d.r)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .style('fill', (d, i) => vis.getColor(i));
        }
    }

    createChart() {
        let vis = this;

        //sets up D3 pack layout which will compute the position
        // and size of each bubble based on count
        let pack = d3.pack().size([vis.width, vis.height]).padding(1.5);

        //constructs a root node from the hierarchical data with the count determining bubble size
        let root = d3.hierarchy({ children: vis.tweets_per_topic }).sum(d => d.Count);

        //calculates the layout of the bubbles
        // and returns an array of bodes with position and size info
        let nodes = pack(root).leaves();

        //binds existing circles to data point that doesn't have circle
        vis.svg.selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', d => d.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .style('fill', (d, i) => vis.getColor(i))
            .on('mouseover', function(event, d) {
                vis.tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9);
                vis.tooltip.html(`Topic: ${d.data.Topic}<br/>Count: ${d.data.Count}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function(d) {
                vis.tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    }

    getColor(index) {
        // const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        // return colors[index % colors.length];

        // Define an array of 10 distinct colors
        const colors = [
            '#f01703', '#d3830c', '#574739', '#750a47',
            '#033f46', '#be82bf', '#859a59', '#16ea08',
            '#f4f4a1', '#1d739e'
        ];
        // Return the color corresponding to the given index
        return colors[index % colors.length];
    }

}

