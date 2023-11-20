class Vis2doughnutchart {
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


        // Add an event listener to the year dropdown
        const yearSelect = document.getElementById("year-dropdown");
        yearSelect.addEventListener("change", function() {
            // console.log("Year dropdown changed");
            vis.updateChartForYear(yearSelect.value);
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




    // Add a method to update the chart based on the selected year
    updateChartForYear(selectedYear) {
        let vis = this;

        console.log("Complete data:", vis.tweets_per_topic);
        console.log("Data sample:", vis.tweets_per_topic.slice(0, 5));

        // Ensure the year is correctly formatted (number or string)
        // selectedYear =  vis.data.filter(d => d.Year === selectedYear);

        // Correctly parse the selected year
        selectedYear = parseInt(selectedYear);
        console.log("Selected Year:", selectedYear, "Type:", typeof selectedYear);

        // Filter data based on the selected year
        let filteredData = vis.tweets_per_topic_per_year.filter(d => d.Year === selectedYear);
        console.log("Filtered Data for Year", selectedYear, ":", filteredData);

        // console.log("Filtered Data for Year", selectedYear, ":", filteredData);
        //
        // console.log("Year values in data:", vis.data.map(d => d.Year));
        // console.log(filteredData);
        // console.log("Selected Year:", selectedYear, "Type:", typeof selectedYear);
        // console.log("Data sample:", vis.data.slice(0, 5));


        // Check if filteredData is empty or invalid
        if (!filteredData.length) {
            console.warn("No data available for the selected year:", selectedYear);
            return; // Exit the function if no data is available
        }



        // Update the pie data
        vis.pieData = vis.pie(filteredData);
        console.log("Pie Data:", vis.pieData);

        // Handle the data join in D3
        let paths = vis.svg.selectAll('path')
            .data(vis.pieData, d => d.data.Topic); // Use a key function for proper binding

        // Exit selection: Remove old elements
        paths.exit().remove();

        // Enter selection: Add new elements
        paths.enter()
            .append('path')
            .merge(paths) // Merge enter and update selections
            .transition()
            .duration(1000)// Add a transition
            .attr('d', vis.arc)
            .attr('fill', (d, i) => vis.getColor(i));

    }





    createChart() {
        let vis = this;

        // Prepare the data for the pie layout
        vis.pieData = vis.pie(vis.tweets_per_topic);

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

    // initializeColorMap() {
    //     return {
    //         'Global stance': '#f01703',
    //         'Importance of Human Intervention': '#d3830c',
    //         'Weather Extremes': '#574739',
    //         'Politics': '#750a47',
    //         'Undefined / One Word Hashtags': '#033f46',
    //         'Donald Trump versus Science': '#be82bf',
    //         'Seriousness of Gas Emissions': '#859a59',
    //         'Ideological Positions on Global Warming': '#16ea08',
    //         'Impact of Resource Overconsumption': '#f4f4a1',
    //         'Significance of Pollution Awareness Events': '#1d739e'
    //     };
    // }

}

