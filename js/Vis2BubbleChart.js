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

    //initiates bubble chart
    initVis() {
        let vis = this;

        vis.margin = { top: 40, right: 40, bottom: 40, left: 40 };
        vis.width = 360 - vis.margin.left - vis.margin.right;
        vis.height = 360 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select('#' + vis.containerId).append('svg')
            .attr('width', vis.width + vis.margin.left + vis.margin.right)
            .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .style('stroke', 'gray') // Set the stroke color
            .style('stroke-width', '0.5px') // Set the stroke width
            .attr('transform', `translate(${vis.margin.left},${vis.margin.top})`)

        vis.tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 1)
            .style('position', 'absolute')
            .style('text-align', 'left')
            .style('width', '320px')
            .style('height', 'auto')
            .style('padding', '5px')
            .style('font', '20px sans-serif')
            .style('background', '#c9c1b6')
            .style('border', '1px solid #403b35')
            .style('border-radius', '8px')
            .style('pointer-events', 'none');

        vis.createChart();
    }

    //update selection
    updateSelection(selectedSubject, selectedYear, selectedTopic) {
        let vis = this;
        // update pie / bubble chart data (size / tooltips) to show data only for currently selected year, or for all years.
        if (selectedSubject === 'Aggressiveness') {
            vis.additionalTooltipContent = (data) => `<b>Mean Aggressiveness: ${Math.round(data.Aggressiveness * 100) / 100}</b>`;
            if (selectedYear === 'All Years') {
                vis.displayAggressivenessAllYears(selectedTopic)
            } else {
                vis.displayAggressivenessSingleYear(selectedYear, selectedTopic)
            }
        } else if (selectedSubject === 'Sentiment') {
            vis.additionalTooltipContent = (data) => `<b>Mean Sentiment: ${Math.round(data.Sentiment * 100) / 100}</b>`;
            if (selectedYear === 'All Years') {
                vis.displaySentimentAllYears(selectedTopic)
            } else {
                vis.displaySentimentSingleYear(selectedYear, selectedTopic)
            }
        } else if (selectedSubject === 'Stance') {
            vis.additionalTooltipContent = (data) => `<b>Most Popular Stance: ${data.most_popular_stance}</b>`;
            if (selectedYear === 'All Years') {
                vis.displayStanceAllYears(selectedTopic)
            } else {
                vis.displayStanceSingleYear(selectedYear, selectedTopic)
            }
        }
        else if (selectedSubject === 'None') {
            vis.additionalTooltipContent = (data) => ``;
            if (selectedYear === 'All Years') {
                vis.displayDefaultSubjectAllYears(selectedTopic)
            } else {
                vis.displayDefaultSubjectSingleyear(selectedYear, selectedTopic)
            }
        }

        // add tooltips back to all paths
        vis.svg.selectAll('circle')
            .style('pointer-events', 'all')
            .on('mouseover', function(event, d){
                vis.lastMouseoverPathFillColor = window.getComputedStyle(event.target).getPropertyValue('fill');
                d3.select(this).attr('fill', 'gray');
                vis.tooltip.style('opacity', 1);
                let tooltip_content = `Topic: ${d.data.Topic}<br/>Number of Tweets: ${d.data.Count}<br/>`
                tooltip_content = tooltip_content + vis.additionalTooltipContent(d.data)
                vis.tooltip.html(tooltip_content)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function(d) {
                d3.select(this).attr('fill', vis.lastMouseoverPathFillColor); // Reset color based on the topic
                vis.tooltip.style('opacity', 0);
            });

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
                    return vis.getColor(d.data.Topic);
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
                    return vis.getColor(d.data.Topic);
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
            .attr('fill', (d, i) => vis.getColor(d.data.Topic))
            .style('pointer-events', 'all')
            .on('mouseover', function(event, d) {
                vis.lastMouseoverPathFillColor = window.getComputedStyle(event.target).getPropertyValue('fill');
                d3.select(this).attr('fill', 'gray');
                vis.tooltip.style('opacity', 1);
                vis.tooltip.html(`Topic: ${d.data.Topic}<br/><b>Number of Tweets: ${d.data.Count}</b>`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function(d) {
                d3.select(this).attr('fill', vis.lastMouseoverPathFillColor); // Reset color based on the topic
                vis.tooltip.style('opacity', 0);
            });
    }


    //hard coded the colors
    getColor(topicName) {
        const colorMap ={
            'Global stance': '#b25e18',
            'Importance of Human Intervention': '#574739',
            'Politics': '#8473a1',
            'Undefined / One Word Hashtags': '#942d45',
            'Donald Trump versus Science': '#e7866e',
            'Seriousness of Gas Emissions': '#b59c59',
            'Ideological Positions on Global Warming': '#99b489',
            'Weather Extremes': '#048685',
            'Impact of Resource Overconsumption': '#ffc84a',
            'Significance of Pollution Awareness Events': '#21724e'
        }
        return colorMap[topicName];
    }

}

