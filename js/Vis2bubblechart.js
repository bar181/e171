class Vis2bubblechart {
    constructor(containerId, tweets_per_topic, tweets_per_topic_per_year) {
        this.containerId = containerId;
        this.tweets_per_topic = tweets_per_topic;
        this.tweets_per_topic_per_year = tweets_per_topic_per_year;
        this.initVis();

        // Initialize the color map
        // this.colorMap = this.initializeColorMap();

    }


    initVis() {
        let vis = this;

        vis.margin = { top: 40, right: 40, bottom: 40, left: 40 };
        vis.width = 960 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

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

        // Add an event listener to the dropdown to handle topic selection
        const topicSelect = document.getElementById("topic-dropdown");
        topicSelect.addEventListener("change", () => {
            vis.updateTopicHighlight();
        });

        // Add an event listener to the year dropdown
        const yearSelect = document.getElementById("year-dropdown");
        yearSelect.addEventListener("change", function() {
            vis.updateChartForYear(yearSelect.value);
        });


        vis.createChart();
    }







    // Add this function to update the bubble chart
    updateTopicHighlight() {
        let vis = this;

        // Get the selected topic from the dropdown
        let topicSelect = document.getElementById("topic-dropdown");
        vis.selectedTopic = topicSelect.value;

        // Update the doughnut chart based on the filtered data
        vis.updateBubbles();
    }

    updateBubbles() {
        let vis = this;

        vis.svg.selectAll('circle').style('fill', (d, i) => {

            if ((vis.selectedTopic === 'all') || (vis.selectedTopic === d.data.Topic)) {
                return vis.getColor(i);
            } else {
                return 'lightgray';
            }
        })
    }

    updateChartForYear(selectedYear) {
        let vis = this;

        selectedYear = parseInt(selectedYear);
        console.log("Selected Year:", selectedYear);

        let filteredData = vis.tweets_per_topic_per_year.filter(d => d.Year === selectedYear);
        console.log("Filtered Data for Year", selectedYear, ":", filteredData);

        // if (!filteredData.length) {
        //     console.warn("No data available for the selected year:", selectedYear);
        //     return; // Exit if no data is available
        // }

        // Re-calculate the layout with the new data
        let pack = d3.pack()
            .size([vis.width, vis.height])
            .padding(1.5);

        let root = d3.hierarchy({ children: filteredData })
            .sum(d => d.Count);

        let nodes = pack(root).leaves();

        // Use d3.forceSimulation for collision detection
        let simulation = d3.forceSimulation(nodes)
            .force("x", d3.forceX(d => d.x).strength(0.5))
            .force("y", d3.forceY(d => d.y).strength(0.5))
            .force("collide", d3.forceCollide(d => d.r + 1)) // add padding between bubbles
            .alphaDecay(0.02)
            .alpha(1)
            .on("tick", ticked);

        function ticked() {
            vis.svg.selectAll('circle')
                .data(nodes, d => d.data.Topic)
                .join('circle') // Handles the enter, update, and exit
                .transition(1000)
                .attr('r', d => d.r)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .style('fill', (d, i) => vis.getColor(i));
        }
        // Update the bubbles
        // vis.svg.selectAll('circle')
        //     .data(nodes, d => d.data.Topic)
        //     .transition()
        //     .duration(1000)
        //     .attr('r', d => d.r)
        //     .attr('cx', d => d.x)
        //     .attr('cy', d => d.y);
    }

    createChart() {
        let vis = this;

        //sets up D3 pack layout which will compute the position
        // and size of each bubble based on count
        let pack = d3.pack()
            .size([vis.width, vis.height])
            .padding(1.5);

        //constructs a root node from the hierarchical data with the count determining bubble size
        let root = d3.hierarchy({ children: vis.tweets_per_topic })
            .sum(d => d.Count);

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

