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

        console.log("Vis2BubbleChart constructor called!");
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 40, right: 40, bottom: 40, left: 40 };
        vis.width = 380 - vis.margin.left - vis.margin.right;
        vis.height = 380 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select('#' + vis.containerId).append('svg')
            .attr('width', vis.width + vis.margin.left + vis.margin.right)
            .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .style('stroke', 'gray') // Set the stroke color
            .style('stroke-width', '0.5px') // Set the stroke width
            .attr('transform', `translate(${vis.margin.left},${vis.margin.top})`)



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
            })



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

        // Update the pie layout with the filtered data
        let pack = d3.pack().size([vis.width, vis.height]).padding(1.5);
        let root = d3.hierarchy({ children: vis.aggressiveness_per_topic}).sum(d => d.Count);
        let nodes = pack(root).leaves();

        // Define a scale for aggressiveness to color mapping
        let aggressivenessScale = d3.scaleLinear()
            .domain([d3.min(vis.aggressiveness_per_topic, d => d.Aggressiveness), d3.max(vis.aggressiveness_per_topic, d => d.Aggressiveness)])
            .range(['#FFB6C1', '#880469']);

        // enter / update / exit paths
        let circles = vis.svg.selectAll('circle').data(nodes);
        circles.exit().remove();
        circles.enter().append('circle')
            .merge(circles)
            .transition().duration(1000)
            .attr('r', d => d.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', function(d, i) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return aggressivenessScale(d.data.Aggressiveness);
                } else {
                    return 'lightgray';
                }
            });
    }

    displaySentimentAllYears(selectedTopic) {
        let vis = this;

        // Update the pie layout with the filtered data
        let pack = d3.pack().size([vis.width, vis.height]).padding(1.5);
        let root = d3.hierarchy({ children: vis.sentiment_per_topic}).sum(d => d.Count);
        let nodes = pack(root).leaves();

        // Define a scale for sentiment to color mapping
        let sentimentScale = d3.scaleLinear()
            .domain([d3.min(vis.sentiment_per_topic, d => d.Sentiment), d3.max(vis.sentiment_per_topic, d => d.Sentiment)])
            .range(['#af1d34', '#389161']);

        // enter / update / exit paths
        let circles = vis.svg.selectAll('circle').data(nodes);
        circles.exit().remove();
        circles.enter().append('circle')
            .merge(circles)
            .transition().duration(1000)
            .attr('r', d => d.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', function(d, i) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return sentimentScale(d.data.Sentiment);
                } else {
                    return 'lightgray';
                }
            });
    }

    displayStanceAllYears(selectedTopic) {
        let vis = this;

        // Update the pie layout with the filtered data
        let pack = d3.pack().size([vis.width, vis.height]).padding(1.5);
        let root = d3.hierarchy({ children: vis.stance_per_topic}).sum(d => d.Count);
        let nodes = pack(root).leaves();

        // Define a scale for stance to color mapping
        let stanceColorScale = d3.scaleOrdinal()
            .domain(['believer', 'neutral', 'denier'])
            .range(['#2d9c2d', '#d7af49', '#a02c3d']); // blue for believer, orange for neutral, green for denier

        // enter / update / exit paths
        let circles = vis.svg.selectAll('circle').data(nodes);
        circles.exit().remove();
        circles.enter().append('circle')
            .merge(circles)
            .transition().duration(1000)
            .attr('r', d => d.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', function(d, i) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return stanceColorScale(d.data.most_popular_stance);
                } else {
                    return 'lightgray';
                }
            });
    }




    displayDefaultSubjectAllYears(selectedTopic) {
        let vis = this;

        // Update the pie layout with the filtered data
        let pack = d3.pack().size([vis.width, vis.height]).padding(1.5);
        let root = d3.hierarchy({ children: vis.tweets_per_topic}).sum(d => d.Count);
        let nodes = pack(root).leaves();

        // enter / update / exit paths
        let circles = vis.svg.selectAll('circle').data(nodes);
        circles.exit().remove();
        circles.enter().append('circle')
            .merge(circles)
            .transition().duration(1000)
            .attr('r', d => d.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
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

        // Update the pie layout with the filtered data
        let filteredData = vis.aggressiveness_per_topic_per_year.filter(d => d.Year === selectedYear);
        let pack = d3.pack().size([vis.width, vis.height]).padding(1.5);
        let root = d3.hierarchy({ children: filteredData}).sum(d => d.Count);
        let nodes = pack(root).leaves();

        let aggressivenessScale = d3.scaleLinear()
            .domain([d3.min(filteredData, d => d.Aggressiveness), d3.max(filteredData, d => d.Aggressiveness)])
            .range(['#FFB6C1', '#880469']);

        // enter / update / exit paths
        let circles = vis.svg.selectAll('circle').data(nodes);
        circles.exit().remove();
        circles.enter().append('circle')
            .merge(circles)
            .transition().duration(1000)
            .attr('r', d => d.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', function(d, i) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return aggressivenessScale(d.data.Aggressiveness);
                } else {
                    return 'lightgray';
                }
            });
    }

    displaySentimentSingleYear(selectedYear, selectedTopic) {
        let vis = this;

        // Update the pie layout with the filtered data
        let filteredData = vis.sentiment_per_topic_per_year.filter(d => d.Year === +selectedYear);
        let pack = d3.pack().size([vis.width, vis.height]).padding(1.5);
        let root = d3.hierarchy({ children: filteredData}).sum(d => d.Count);
        let nodes = pack(root).leaves();

        let sentimentScale = d3.scaleLinear()
            .domain([d3.min(filteredData, d => d.Sentiment), d3.max(filteredData, d => d.Sentiment)])
            .range(['#af1d34', '#389161']);

        // enter / update / exit paths
        let circles = vis.svg.selectAll('circle').data(nodes);
        circles.exit().remove();
        circles.enter().append('circle')
            .merge(circles)
            .transition().duration(1000)
            .attr('r', d => d.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', function(d, i) {
                if ((selectedTopic === 'All Topics') || (selectedTopic === d.data.Topic)) {
                    return sentimentScale(d.data.Sentiment);
                } else {
                    return 'lightgray';
                }
            });
    }

    displayStanceSingleYear(selectedYear, selectedTopic) {
        let vis = this;

        // Update the pie layout with the filtered data
        let filteredData = vis.stance_per_topic_per_year.filter(d => d.Year === +selectedYear);
        let pack = d3.pack().size([vis.width, vis.height]).padding(1.5);
        let root = d3.hierarchy({ children: filteredData}).sum(d => d.Count);
        let nodes = pack(root).leaves();

        let stanceColorScale = d3.scaleOrdinal()
            .domain(['believer', 'neutral', 'denier'])
            .range(['#2d9c2d', '#d7af49', '#a02c3d']);

        // enter / update / exit paths
        let circles = vis.svg.selectAll('circle').data(nodes);
        circles.exit().remove();
        circles.enter().append('circle')
            .merge(circles)
            .transition().duration(1000)
            .attr('r', d => d.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', function(d, i) {
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
        let pack = d3.pack().size([vis.width, vis.height]).padding(1.5);
        let root = d3.hierarchy({ children: filteredData}).sum(d => d.Count);
        let nodes = pack(root).leaves();

        // enter / update / exit paths
        let circles = vis.svg.selectAll('circle').data(nodes);
        circles.exit().remove();
        circles.enter().append('circle')
            .merge(circles)
            .transition().duration(1000)
            .attr('r', d => d.r)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
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
            .attr('fill', (d, i) => vis.getColor(i))
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

        // Define an array of 10 distinct colors
        const colors = [
            '#f01703', '#d3830c', '#574739', '#750a47',
            '#033f46', '#be82bf', '#859a59', '#16ea08',
            '#e1e10f', '#1d739e'
        ];
        // Return the color corresponding to the given index
        return colors[index % colors.length];
    }

}

