// Vis 3 Thermometer Viz

let barWidth = 25;

class Vis3Thermometer {

    constructor(parentElement, warmingData) {
        this.parentElement = parentElement;
        this.warmingData = warmingData;
        this.date = moment(vis3MapDate.innerText, "MMM YYYY").format("YYYY-MM-DD"); // Dependent on MapVis Slider Date
        this.warmingRow = null;

        // define colors
        this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b']

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 40, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Format the data
        vis.warmingData.forEach(d => {
            d.projected_warming = +d.projected_warming;
            d.actual_warming = +d.actual_warming;
        })

        // Get the initial row
        vis.warmingRow = vis.warmingData.filter(d => d.date === vis.date)[0];
        console.log(vis.warmingRow)

        // Get data
        console.log("vis3MapDate:", vis.date);

        // // add title
        // vis.svg.append('g')
        //     .attr('class', 'title')
        //     .attr('id', 'map-title')
        //     .append('text')
        //     .text('Title for Map')
        //     .attr('transform', `translate(${vis.width / 2}, 20)`)
        //     .attr('text-anchor', 'middle');


        // Scales
        vis.y = d3.scaleLinear()
            .domain([0, 3.5])
            .range([vis.height - vis.margin.bottom, vis.margin.top]);

        // Bar - Current warming
        vis.currentBar = vis.svg.append("rect")
            .attr("class", "currentBar")
            .attr("x", vis.margin.left + 15)
            .attr("y", vis.y(vis.warmingRow.actual_warming))
            .attr("width", barWidth)
            .attr("height", vis.y(0) - vis.y(vis.warmingRow.actual_warming))
            .attr("fill", vis.colors[2]);

        // Bar - Projected warming
        vis.projectedBar =vis.svg.append("rect")
            .attr("class", "projectedBar")
            .attr("x", vis.margin.left + 15)
            .attr("y", vis.y(vis.warmingRow.projected_warming))
            .attr("width", barWidth)
            .attr("height", vis.y(vis.warmingRow.actual_warming) - vis.y(vis.warmingRow.projected_warming))
            .attr("fill", vis.colors[3]);

        // Add y-axis
        let yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(d => "+" + d + "°C");

        vis.svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis)
            .attr("transform", "translate(" + vis.margin.left + ", 0)");

        // Current warming label


        // Projected Warming Label



        // Define additional listener on the Map SLider
        vis3MapSlider.noUiSlider.on('update', function (values) {
            vis.wrangleData();
        });

        // Append circle
        vis.svg.append("circle")
            .attr("cx", vis.margin.left + 15 + barWidth/2)
            .attr("cy", vis.height - vis.margin.bottom + 15)
            .attr("r", 20)
            .attr("fill", vis.colors[2]);


        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        // Update the vis date
        this.date = moment(vis3MapDate.innerText, "MMM YYYY").format("YYYY-MM-DD");

        // Get the new row
        vis.warmingRow = vis.warmingData.filter(d => d.date === vis.date)[0];
        console.log("New row:", vis.warmingRow)

        // Bar - Current warming
        vis.svg.selectAll("rect.currentBar")
            .attr("y", vis.y(vis.warmingRow.actual_warming))
            .attr("height", vis.y(0) - vis.y(vis.warmingRow.actual_warming));

        // Bar - Projected warming
        vis.svg.selectAll("rect.projectedBar")
            .attr("y", vis.y(vis.warmingRow.projected_warming))
            .attr("height", vis.y(vis.warmingRow.actual_warming) - vis.y(vis.warmingRow.projected_warming));
        vis.updateVis()
    }

    updateVis() {
        let vis = this;

    }
}

