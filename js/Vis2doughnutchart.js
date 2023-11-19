class Vis2doughnutchart {
    constructor(containerId, data) {
        this.containerId = containerId;
        this.data = data;
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
            .append('g')
            .attr('transform', 'translate(' + vis.width / 2 + ',' + vis.height / 2 + ')');

        // Create the pie layout function
        vis.pie = d3.pie()
            .sort(null) // Do not sort group by size
            .value(d => d.Count);

        // Define the arc generator
        vis.arc = d3.arc()
            .innerRadius(vis.radius * 0.5) // Inner radius: defines the hole's size
            .outerRadius(vis.radius * 0.8); // Outer radius: defines the size of the doughnut

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
        topicSelect.addEventListener("change", function() {
            console.log("Topic dropdown changed");
            vis.selectedTopic = topicSelect.value;
            vis.updateTopicHighlight();
        });

        vis.createChart();
    }


    // Add this function to update the doughnut chart
    updateTopicHighlight(selectedTopic) {
        let vis = this;

        // Get the selected topic from the dropdown
        const topicSelect = document.getElementById("topic-dropdown");
        vis.selectedTopic = topicSelect.value;

        // Update the doughnut chart based on the filtered data
        vis.updateDoughnut();
    }

    updateDoughnut() {
        let vis= this;

        vis.svg.selectAll('path').style('fill', (d, i) => {

            if ((vis.selectedTopic === 'all') || (vis.selectedTopic === d.data.Topic)) {
                return vis.getColor(i);
            } else {
                return 'lightgray';
            }
        })
    }


    createChart() {
        let vis = this;

        // Prepare the data for the pie layout
        vis.pieData = vis.pie(vis.data);

        // Define the outer radius and the inner radius for the doughnut chart
        vis.outerRadius = 450; // This controls the overall size of the doughnut chart
        vis.innerRadius = 440; // This controls the size of the hole, thus creating the "cutout"

        // Create the arc generator for the doughnut chart
        vis.arc = d3.arc()
            .innerRadius(vis.innerRadius)
            .outerRadius(vis.outerRadius);

        // Create the pie layout generator
        const pie = d3.pie()
            .value(d => d.Count); // Assuming your data's numeric value is stored in 'Count'

        // Bind the data to the arcs and append each arc path
        vis.svg.selectAll('path')
            .data(vis.pieData)
            .enter()
            .append('path')
            .attr('d', vis.arc)
            .attr('fill', (d, i) => vis.getColor(i))
            .style('opacity', 0.7)
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
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        return colors[index % colors.length];
    }


}
