class Vis2DoughnutChart {
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

        // Define the dimensions and margins for the chart
        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        vis.width = 900 - vis.margin.left - vis.margin.right;
        vis.height = 900 - vis.margin.top - vis.margin.bottom;
        vis.radius = Math.min(vis.width, vis.height) / 2;

        // Create the SVG container
        vis.svg = d3.select('#' + vis.containerId).append('svg')
            .attr('width', vis.width)
            .attr('height', vis.height)
            .append('g')
            .attr('transform', 'translate(' + vis.width / 2 + ',' + vis.height / 2 + ')');

        // Create the pie layout function
        vis.pie = d3.pie()
            .sort(null) // Do not sort group by size
            .value(d => d.Count);

        vis.outerRadius = 390; // This controls the overall size of the doughnut chart
        vis.innerRadius = 375; // This controls the size of the hole, thus creating the "cutout"

        // Define the arc generator
        vis.arc = d3.arc()
            .innerRadius(vis.innerRadius) // Inner radius: defines the hole's size
            .outerRadius(vis.outerRadius); // Outer radius: defines the size of the doughnut

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
        // console.log("SELECTION UPDATED:   SUBJECT=\"" + selectedSubject + "\"   YEAR=\"" + selectedYear + "\"   TOPIC=\"" + selectedTopic + "\"");


        // update pie / bubble chart data (size / tooltips) to show data only for currently selected year, or for all years.

        if (selectedSubject === 'Aggressiveness' && selectedYear === 'All Years') {
            vis.displayAggressivenessAllYears(selectedTopic)

        } else if (selectedSubject === 'Sentiment' && selectedYear === 'All Years') {
            vis.displaySentimentAllYears(selectedTopic)

        } else if (selectedSubject === 'Stance' && selectedYear === 'All Years') {
            vis.displayStanceAllYears(selectedTopic)

        } else if (selectedSubject === 'None' && selectedYear === 'All Years') {
            vis.displayDefaultSubjectAllYears(selectedTopic)

        } else if (selectedSubject === 'Aggressiveness' && selectedYear != 'All Years') {
            vis.displayAggressivenessSingleYear(selectedYear, selectedTopic)

        } else if (selectedSubject === 'Sentiment' && selectedYear != 'All Years') {
            vis.displaySentimentSingleYear(selectedYear, selectedTopic)

        } else if (selectedSubject === 'Stance' && selectedYear != 'All Years') {
            vis.displayStanceSingleYear(selectedYear, selectedTopic)

        } else if (selectedSubject === 'None' && selectedYear != 'All Years') {
            vis.displayDefaultSubjectSingleyear(selectedYear, selectedTopic)
        }
    }

    displayAggressivenessAllYears(selectedTopic) {
        let vis = this;

        vis.pieData = vis.pie(vis.aggressiveness_per_topic);

        // Define a scale for aggressiveness to color mapping
        let aggressivenessScale = d3.scaleLinear()
            .domain([d3.min(vis.aggressiveness_per_topic, d => d.Aggressiveness), d3.max(vis.aggressiveness_per_topic, d => d.Aggressiveness)])
            .range(['#FFB6C1', '#880469']);

        // enter / update / exit paths
        let paths = vis.svg.selectAll('path').data(vis.pieData);
        paths.exit().remove();
        paths.enter().append('path')
            .merge(paths)
            .transition().duration(1000)
            .attr('d', vis.arc)
            .attr('fill', function(d) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return aggressivenessScale(d.data.Aggressiveness);
                } else {
                    return 'lightgray';
                }
            });
    }

    displaySentimentAllYears(selectedTopic) {
        let vis = this;

        vis.pieData = vis.pie(vis.sentiment_per_topic);

        // Define a scale for sentiment to color mapping
        let sentimentScale = d3.scaleLinear()
            .domain([d3.min(vis.sentiment_per_topic, d => d.Sentiment), d3.max(vis.sentiment_per_topic, d => d.Sentiment)])
            .range(['#af1d34', '#389161']);

        // enter / update / exit paths
        let paths = vis.svg.selectAll('path').data(vis.pieData);
        paths.exit().remove();
        paths.enter().append('path')
            .merge(paths)
            .transition().duration(1000)
            .attr('d', vis.arc)
            .attr('fill', function(d) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return sentimentScale(d.data.Sentiment);
                } else {
                    return 'lightgray';
                }
            });
    }

    displayStanceAllYears(selectedTopic) {
        let vis = this;

        vis.pieData = vis.pie(vis.stance_per_topic);

        // Define a scale for stance to color mapping
        let stanceColorScale = d3.scaleOrdinal()
            .domain(['believer', 'neutral', 'denier'])
            .range(['#2d9c2d', '#d7af49', '#a02c3d']); // Example colors: blue for believer, orange for neutral, green for denier

        // enter / update / exit paths
        let paths = vis.svg.selectAll('path').data(vis.pieData);
        paths.exit().remove();
        paths.enter().append('path')
            .merge(paths)
            .transition().duration(1000)
            .attr('d', vis.arc)
            .attr('fill', function(d) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return stanceColorScale(d.data.most_popular_stance);
                } else {
                    return 'lightgray';
                }
            });
    }

    displayDefaultSubjectAllYears(selectedTopic) {
        let vis = this;

        //recreate pie data from the original dataset
        vis.pieData = vis.pie(vis.tweets_per_topic);

        // enter / update / exit paths
        let paths = vis.svg.selectAll('path').data(vis.pieData);
        paths.exit().remove();
        paths.enter().append('path')
            .merge(paths)
            .transition().duration(1000)
            .attr('d', vis.arc)
            .attr('fill', function(d, i) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return vis.getColor(i);
                } else {
                    return 'lightgray';
                }
            });
    }

    displayAggressivenessSingleYear(selectedYear, selectedTopic) {
        let vis = this;

        // Update the pie data, for some reason d.Year is a string here not an int
        let filteredData = vis.aggressiveness_per_topic_per_year.filter(d => d.Year === selectedYear);

        vis.pieData = vis.pie(filteredData);

        // Define a scale for aggressiveness to color mapping
        let aggressivenessScale = d3.scaleLinear()
            .domain([d3.min(filteredData, d => d.Aggressiveness), d3.max(filteredData, d => d.Aggressiveness)])
            .range(['#FFB6C1', '#880469']);

        // enter / update / exit paths
        let paths = vis.svg.selectAll('path').data(vis.pieData, d => d.data.Topic);
        paths.exit().remove();
        paths.enter().append('path')
            .merge(paths)
            .transition().duration(1000)
            .attr('d', vis.arc)
            .attr('fill', function(d) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return aggressivenessScale(d.data.Aggressiveness);
                } else {
                    return 'lightgray';
                }
            });
    }

    displaySentimentSingleYear(selectedYear, selectedTopic) {
        let vis = this;

        // Update the pie data
        let filteredData = vis.sentiment_per_topic_per_year.filter(d => d.Year === +selectedYear);
        vis.pieData = vis.pie(filteredData);

        // Define a scale for aggressiveness to color mapping
        let sentimentScale = d3.scaleLinear()
            .domain([d3.min(filteredData, d => d.Sentiment), d3.max(filteredData, d => d.Sentiment)])
            .range(['#af1d34', '#389161']); //red for negative sentiment and green for positive

        // enter / update / exit paths
        let paths = vis.svg.selectAll('path').data(vis.pieData, d => d.data.Topic);
        paths.exit().remove();
        paths.enter().append('path')
            .merge(paths)
            .transition().duration(1000)
            .attr('d', vis.arc)
            .attr('fill', function(d) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return sentimentScale(d.data.Sentiment);
                } else {
                    return 'lightgray';
                }
            });
    }

    displayStanceSingleYear(selectedYear, selectedTopic) {
        let vis = this;

        // Update the pie data
        let filteredData = vis.stance_per_topic_per_year.filter(d => d.Year === +selectedYear);
        vis.pieData = vis.pie(filteredData);

        // Define a scale for stance to color mapping
        let stanceColorScale = d3.scaleOrdinal()
            .domain(['believer', 'neutral', 'denier'])
            .range(['#2d9c2d', '#d7af49', '#a02c3d']); // Example colors: blue for believer, orange for neutral, green for denier

        // enter / update / exit paths
        let paths = vis.svg.selectAll('path').data(vis.pieData, d => d.data.Topic);
        paths.exit().remove();
        paths.enter().append('path')
            .merge(paths)
            .transition().duration(1000)
            .attr('d', vis.arc)
            .attr('fill', function(d) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return stanceColorScale(d.data.most_popular_stance);
                } else {
                    return 'lightgray';
                }
            });
    }

    displayDefaultSubjectSingleyear(selectedYear, selectedTopic) {
        let vis = this;

        // Update the pie layout with the filtered data
        let filteredData = vis.tweets_per_topic_per_year.filter(d => d.Year === +selectedYear);
        vis.pieData = vis.pie(filteredData);

        // enter / update / exit paths
        let paths = vis.svg.selectAll('path').data(vis.pieData);
        paths.exit().remove();
        paths.enter().append('path')
            .merge(paths)
            .transition().duration(1000)
            .attr('d', vis.arc)
            .attr('fill', function(d, i) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return vis.getColor(i);
                } else {
                    return 'lightgray';
                }
            });
    }

    createChart() {
        let vis = this;
        vis.pieData = vis.pie(vis.tweets_per_topic);

        // Create the arc generator for the doughnut chart
        vis.arc = d3.arc().innerRadius(vis.innerRadius).outerRadius(vis.outerRadius);

        // Create the pie layout generator
        const pie = d3.pie().value(d => d.Count);

        // Bind the data to the arcs and append each arc path
        vis.svg.selectAll('path')
            .data(vis.pieData)
            .enter()
            .append('path')
            .attr('d', vis.arc)
            .attr('fill', (d, i) => vis.getColor(i))
            .style('opacity', 1)
            .on('mouseover', function(event, d){
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

        // This function should probably take in the name of a topic and return a color for that topic.
        // This way the same topics always have the same color.


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

