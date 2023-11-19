class Vis2bubblechart {
    constructor(containerId, data) {
        this.containerId = containerId;
        this.data = data;
        this.initVis();

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

    createChart() {
        let vis = this;

        //sets up D3 pack layout which will compute the position
        // and size of each bubble based on count
        let pack = d3.pack()
            .size([vis.width, vis.height])
            .padding(1.5);

        //constructs a root node from the hierarchical data with the count determining bubble size
        let root = d3.hierarchy({ children: vis.data })
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
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        return colors[index % colors.length];
    }

}
