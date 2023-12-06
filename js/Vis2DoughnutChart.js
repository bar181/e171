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
        vis.width = 1000 - vis.margin.left - vis.margin.right;
        vis.height = 1000 - vis.margin.top - vis.margin.bottom;
        vis.radius = Math.min(vis.width, vis.height) / 2;


        // Create the SVG container
        vis.svg = d3.select('#' + vis.containerId).append('svg')
            .attr('width', vis.width)
            .attr('height', vis.height)

        vis.createStanceLegend();
        vis.createSentimentLegend();
        vis.createAggressivenssLegend();

        vis.stanceLegend.style('opacity', 0);
        vis.sentimentLegend.style('opacity', 0);
        vis.agressivenessLegend.style('opacity', 0);

        vis.svg = vis.svg.append('g')
            .style('stroke', 'white') // Set the stroke color
            .style('stroke-width', '3.5px') // Set the stroke width
            .attr('transform', 'translate(' + vis.width / 2 + ',' + vis.height / 2 + ')')


        // Create the pie layout function
        vis.pie = d3.pie()
            .sort(null) // Do not sort group by size
            .value(d => d.Count);

        // vis.outerRadius = 290; // This controls the overall size of the doughnut chart
        // vis.innerRadius = 275; // This controls the size of the hole, thus creating the "cutout"
        vis.outerRadius = 290; // This controls the overall size of the doughnut chart
        vis.innerRadius = 275; // This controls the size of the hole, thus creating the "cutout"

        // Define the arc generator
        vis.arc = d3.arc()
            .innerRadius(vis.innerRadius) // Inner radius: defines the hole's size
            .outerRadius(vis.outerRadius); // Outer radius: defines the size of the doughnut

        vis.tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 1)
            .style('position', 'absolute')
            .style('text-align', 'left')
            .style('width', '320px')
            .style('height', 'auto')
            .style('padding', '5px')
            .style('font', '20px sans-serif')
            .style('background', 'lightsteelblue')
            .style('border', '0px')
            .style('border-radius', '8px')
            .style('pointer-events', 'none');

        vis.createChart();
    }

    createAggressivenssLegend() {
        let vis = this;

        // Calculate the position for the legend (lower right corner)
        const legendX = 660; // Adjust width for legend width and padding
        const legendY = 730; // Adjust height for legend height and padding

        // Define a scale for sentiment to color mapping
        let aggressivenessScale = d3.scaleLinear()
            .domain([d3.min(vis.aggressiveness_per_topic, d => d.Aggressiveness), d3.max(vis.aggressiveness_per_topic, d => d.Aggressiveness)])
            .range(['#FFB6C1', '#880469']);

        // Assuming you have an SVG element with id 'legend-svg'
        vis.agressivenessLegend = vis.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${legendX}, ${legendY})`);

        // Create a gradient for the legend
        let agressivenessGradient = vis.agressivenessLegend.append('defs')
            .append('linearGradient')
            .attr('id', 'agressivenessGradient')
            .selectAll('stop')
            .data(aggressivenessScale.range())
            .enter().append('stop')
            .attr('stop-color', d => d)
            .attr('offset', (d, i) => i);

        // Draw the color bar
        vis.agressivenessLegend.append('rect')
            .attr('width', 200) // Adjust the width as needed
            .attr('height', 15) // Adjust the height as needed
            .style('fill', 'url(#agressivenessGradient)');

        // Define the scale for the legend axis
        let axisScale = d3.scaleLinear()
            .domain([d3.min(vis.aggressiveness_per_topic, d => d.Aggressiveness), d3.max(vis.aggressiveness_per_topic, d => d.Aggressiveness)])
            .range([0, 200]); // Width of the legend bar

        let legendDomain = axisScale.domain();
        let tickValues = [legendDomain[0], legendDomain[1]];

        // Define the axis
        let legendAxis = d3.axisBottom(axisScale)
            .tickValues(tickValues)

        // Append the axis to the legend
        vis.agressivenessLegend.append('g')
            .attr('class', 'legend-axis')
            .attr('transform', `translate(0, 20)`) // Position below the rectangle
            .call(legendAxis);

        // Add title
        vis.agressivenessLegend.append('text')
            .attr('x', 100) // Center the title
            .attr('y', -10) // Adjust vertical position as needed
            .style('text-anchor', 'middle')
            .text('Aggressiveness Scale');
    }

    createSentimentLegend() {
        let vis = this;

        // Calculate the position for the legend (lower right corner)
        const legendX = 660; // Adjust width for legend width and padding
        const legendY = 730; // Adjust height for legend height and padding


        // Define a scale for sentiment to color mapping
        let sentimentScale = d3.scaleLinear()
            .domain([d3.min(vis.sentiment_per_topic, d => d.Sentiment), d3.max(vis.sentiment_per_topic, d => d.Sentiment)])
            .range(['#af1d34', '#389161']);

        // Assuming you have an SVG element with id 'legend-svg'
        vis.sentimentLegend = vis.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${legendX}, ${legendY})`);

        // Create a gradient for the legend
        let sentimentGradient = vis.sentimentLegend.append('defs')
            .append('linearGradient')
            .attr('id', 'sentimentGradient')
            .selectAll('stop')
            .data(sentimentScale.range())
            .enter().append('stop')
            .attr('stop-color', d => d)
            .attr('offset', (d, i) => i);

        // Draw the color bar
        vis.sentimentLegend.append('rect')
            .attr('width', 200) // Adjust the width as needed
            .attr('height', 15) // Adjust the height as needed
            .style('fill', 'url(#sentimentGradient)');

        // Define the scale for the legend axis
        let axisScale = d3.scaleLinear()
            .domain([d3.min(vis.sentiment_per_topic, d => d.Sentiment), d3.max(vis.sentiment_per_topic, d => d.Sentiment)])
            .range([0, 200]); // Width of the legend bar

        let legendDomain = axisScale.domain();
        let tickValues = [legendDomain[0], legendDomain[1]];

        // Define the axis
        let legendAxis = d3.axisBottom(axisScale)
            //.ticks(2) // Two ticks: min and max
            //.tickSize(2); // Adjust the size of the ticks
            .tickValues(tickValues)

        // Append the axis to the legend
        vis.sentimentLegend.append('g')
            .attr('class', 'legend-axis')
            .attr('transform', `translate(0, 20)`) // Position below the rectangle
            .call(legendAxis);

        // Add title
        vis.sentimentLegend.append('text')
            .attr('x', 100) // Center the title
            .attr('y', -10) // Adjust vertical position as needed
            .style('text-anchor', 'middle')
            .text('Sentiment Scale');
    }


    createStanceLegend() {
        let vis = this;

        // Legend data
        const legendData = [
            { stance: 'believer', color: '#2d9c2d' },
            { stance: 'neutral', color: '#d7af49' },
            { stance: 'denier', color: '#a02c3d' }
        ];

        // Calculate the position for the legend (lower right corner)
        const legendX = 710; // Adjust width for legend width and padding
        const legendY = 680; // Adjust height for legend height and padding

        // Create legend group, positioned in the top left corner
        vis.stanceLegend = vis.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${legendX}, ${legendY})`);

        // Add legend title
        vis.stanceLegend.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .text('Most Popular Stance:')
            .style('font-weight', 'bold');

        // Add legend items
        const itemHeight = 25; // height of each legend item
        const titleOffset = 20; // space for the title

        vis.stanceLegend.selectAll('.legend-item')
            .data(legendData)
            .enter().append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${titleOffset + i * itemHeight})`)
            .each(function(d) {
                const g = d3.select(this);

                // Add colored rectangle
                g.append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', 20)
                    .attr('height', 20)
                    .style('fill', d.color);

                // Add text label with debugging styles
                g.append('text')
                    .attr('x', 30) // Adjust text position if needed
                    .attr('y', 15) // Align text with the box
                    .text(d.stance)
                    .style('font-size', '16px') // Larger font size for debugging
                    .style('fill', 'black'); // Contrasting color for debugging


            });
    }

    updateSelection(selectedSubject, selectedYear, selectedTopic) {
        let vis = this;
        // update pie / bubble chart data (size / tooltips) to show data only for currently selected year, or for all years.
        if (selectedSubject === 'Aggressiveness') {
            vis.stanceLegend.style('opacity', 0);
            vis.sentimentLegend.style('opacity', 0);
            vis.agressivenessLegend.style('opacity', 1);
            vis.additionalTooltipContent = (data) => `<b>Mean Aggressiveness: ${Math.round(data.Aggressiveness * 100) / 100}</b>`;
            if (selectedYear === 'All Years') {
                vis.displayAggressivenessAllYears(selectedTopic)
            } else {
                vis.displayAggressivenessSingleYear(selectedYear, selectedTopic)
            }
        } else if (selectedSubject === 'Sentiment') {
            vis.stanceLegend.style('opacity', 0);
            vis.sentimentLegend.style('opacity', 1);
            vis.agressivenessLegend.style('opacity', 0);
            vis.additionalTooltipContent = (data) => `<b>Mean Sentiment: ${Math.round(data.Sentiment * 100) / 100}</b>`;
            if (selectedYear === 'All Years') {
                vis.displaySentimentAllYears(selectedTopic)
            } else {
                vis.displaySentimentSingleYear(selectedYear, selectedTopic)
            }
        } else if (selectedSubject === 'Stance') {
            vis.stanceLegend.style('opacity', 1);
            vis.sentimentLegend.style('opacity', 0);
            vis.agressivenessLegend.style('opacity', 0);
            vis.additionalTooltipContent = (data) => `<b>Most Popular Stance: ${data.most_popular_stance}</b>`;
            if (selectedYear === 'All Years') {
                vis.displayStanceAllYears(selectedTopic)
            } else {
                vis.displayStanceSingleYear(selectedYear, selectedTopic)
            }
        }
        else if (selectedSubject === 'None') {
            vis.stanceLegend.style('opacity', 0);
            vis.sentimentLegend.style('opacity', 0);
            vis.agressivenessLegend.style('opacity', 0);
            vis.additionalTooltipContent = (data) => ``;
            if (selectedYear === 'All Years') {
                vis.displayDefaultSubjectAllYears(selectedTopic)
            } else {
                vis.displayDefaultSubjectSingleyear(selectedYear, selectedTopic)
            }
        }

        // add tooltips back to all paths
        vis.svg.selectAll('path')
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
                d3.select(this).attr('fill', vis.lastMouseoverPathFillColor);
                vis.tooltip.style('opacity', 0);
            });

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
                    return vis.getColor(d.data.Topic);
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
                    return vis.getColor(d.data.Topic);
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

        // Bind the data to the arcs and append each arc path
        vis.svg.selectAll('path')
            .data(vis.pieData)
            .enter()
            .append('path')
            .attr('d', vis.arc)
            .attr('fill', d => vis.getColor(d.data.Topic)) // Use the topic name to get the color
            .style('opacity', 1)
            .style('pointer-events', 'all')
            .on('mouseover', function(event, d){
                vis.lastMouseoverPathFillColor = window.getComputedStyle(event.target).getPropertyValue('fill');
                d3.select(this).attr('fill', 'gray');
                vis.tooltip.style('opacity', 1);
                vis.tooltip.html(`Topic: ${d.data.Topic}<br/><b>Number of Tweets: ${d.data.Count}</b>`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function(event, d) {
                d3.select(this).attr('fill', vis.lastMouseoverPathFillColor); // Reset color based on the topic
                vis.tooltip.style('opacity', 0);
            });
    }

    getColor(topicName) {
        const colorMap ={
            'Global stance': '#d3830c',
            'Importance of Human Intervention': '#574739',
            'Politics': '#be82bf',
            'Undefined / One Word Hashtags': '#750a47',
            'Donald Trump versus Science': '#f01703',
            'Seriousness of Gas Emissions': '#033f46',
            'Ideological Positions on Global Warming': '#859a59',
            'Weather Extremes': '#1d739e',
            'Impact of Resource Overconsumption': '#e1e10f',
            'Significance of Pollution Awareness Events': '#16ea08'
        }
        return colorMap[topicName];
    }
}

