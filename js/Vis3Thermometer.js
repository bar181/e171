// Vis 3 Thermometer Viz



class Vis3Thermometer {

    constructor(parentElement, warmingData) {
        this.parentElement = parentElement;
        this.warmingData = warmingData;
        this.date = moment(vis3MapDate.innerText, "MMM YYYY").format("YYYY-MM-DD"); // Dependent on MapVis Slider Date
        this.warmingRow = null;

        this.barWidth = 25;
        this.barShift = 15;

        // define colors
        this.colors = ['#b2182b', "#67001f"]

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 5, right: 20, bottom: 40, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (5, ${vis.margin.top})`);

        // Format the data
        vis.warmingData.forEach(d => {
            d.projected_warming = +d.projected_warming;
            d.actual_warming = +d.actual_warming;
        })

        // Get the initial row
        vis.warmingRow = vis.warmingData.filter(d => d.date === vis.date)[0];

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
        vis.barGroup = vis.svg.append("g")
            .attr("class", "warming-bar")
            .attr("transform", "translate(" + (vis.margin.left + vis.barShift) + ", 0)");

        vis.currentBar = vis.barGroup.append("rect")
            .attr("class", "currentBar")
            .attr("x", 0)
            .attr("y", vis.y(vis.warmingRow.actual_warming))
            .attr("width", vis.barWidth)
            .attr("height", vis.y(0) - vis.y(vis.warmingRow.actual_warming))
            .attr("fill", vis.colors[0]);

        // Bar - Projected warming
        vis.projectedBar = vis.barGroup.append("rect")
            .attr("class", "projectedBar")
            .attr("x", 0)
            .attr("y", vis.y(vis.warmingRow.projected_warming))
            .attr("width", vis.barWidth)
            .attr("height", vis.y(vis.warmingRow.actual_warming) - vis.y(vis.warmingRow.projected_warming))
            .attr("fill", vis.colors[1]);

        // Add y-axis
        let yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(d => "+" + d + "°C");

        vis.svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis)
            .attr("transform", "translate(" + vis.margin.left + ", 0)");

        //  LINES

        // Current warming line
        vis.currentLine = vis.barGroup.append("line")
            .attr("class", "currentLine")
            .attr("x1", -vis.barShift)
            .attr("y1", vis.y(vis.warmingRow.actual_warming))
            .attr("x2", 40)
            .attr("y2", vis.y(vis.warmingRow.actual_warming))
            .attr("stroke-width", 2)
            .attr("stroke", vis.colors[0]);


        // Projected Warming line
        vis.projectedLine = vis.barGroup.append("line")
            .attr("class", "projectedLine")
            .style("stroke-dasharray", ("4, 3"))  // Set the stroke to a dotted line
            .attr("x1", -vis.barShift)
            .attr("y1", vis.y(vis.warmingRow.projected_warming))
            .attr("x2", 40)
            .attr("y2", vis.y(vis.warmingRow.projected_warming))
            .attr("stroke-width", 2)
            .attr("stroke", vis.colors[1]);

        // Paris Agreement line
        vis.parisLine = vis.barGroup.append("line")
            .attr("class", "parisLine")
            .attr("x1", -vis.barShift)
            .attr("y1", vis.y(1.5))
            .attr("x2", 40)  // Adjust the length of the line as needed
            .attr("y2", vis.y(1.5))
            .attr("stroke-width", 2)
            .attr("stroke", "green");

        // CIRCLE

        // Append circle
        vis.barGroup.append("circle")
            .attr("cx", vis.barWidth/2)
            .attr("cy", vis.height - vis.margin.bottom + vis.barShift)
            .attr("r", 22)
            .attr("fill", vis.colors[0]);

        // TEXT Labels

        vis.projectedLabel = vis.barGroup.append("text")
            .text("Projected for 2100")
            .attr("id", "projected-warming-label")
            .attr("class", "h6")
            .attr("x", (2*vis.barShift) + vis.barWidth)
            .attr("y", vis.y(vis.warmingRow.projected_warming));

        vis.currentLabel = vis.barGroup.append("text")
            .text(moment(vis.warmingRow.date, "YYYY-MM-DD").format("YYYY") + " Warming")
            .attr("class", "h6")
            .attr("id", "current-warming-label")
            .attr("x", (2*vis.barShift) + vis.barWidth)
            .attr("y", vis.y(vis.warmingRow.actual_warming));

        vis.parisLabel = vis.barGroup.append("text")
            .text("Paris Agreement")
            .attr("id", "paris-agreement-temperature-label")
            .attr("class", "h6")
            .attr("x", (2*vis.barShift) + vis.barWidth)
            .attr("y", vis.y(1.5));

        // Define additional listener on the Map SLider
        vis3MapSlider.noUiSlider.on('update', function (values) {
            vis.wrangleData();
        });

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        // Update the vis date
        this.date = moment(vis3MapDate.innerText, "MMM YYYY").format("YYYY-MM-DD");

        // Get the new row
        vis.warmingRow = vis.warmingData.filter(d => d.date === vis.date)[0];

        // Bar - Current warming
        vis.svg.selectAll("rect.currentBar")
            .attr("y", vis.y(vis.warmingRow.actual_warming))
            .attr("height", vis.y(0) - vis.y(vis.warmingRow.actual_warming));

        // Bar - Projected warming
        vis.svg.selectAll("rect.projectedBar")
            .attr("y", vis.y(vis.warmingRow.projected_warming))
            .attr("height", vis.y(vis.warmingRow.actual_warming) - vis.y(vis.warmingRow.projected_warming));

        // Line - Current warming
        vis.currentLine
            .attr("y1", vis.y(vis.warmingRow.actual_warming))
            .attr("y2", vis.y(vis.warmingRow.actual_warming));

        // Line - Projected warming
        vis.projectedLine
            .attr("y1", vis.y(vis.warmingRow.projected_warming))
            .attr("y2", vis.y(vis.warmingRow.projected_warming));

        // Text - Current warming
        vis.currentLabel
            .text(moment(vis.warmingRow.date, "YYYY-MM-DD").format("YYYY") + " Warming")
            .attr("y", vis.y(vis.warmingRow.actual_warming));

        // Text - Projected warming
        vis.projectedLabel
            .attr("y", vis.y(vis.warmingRow.projected_warming));


        vis.updateVis()
    }

    updateVis() {
        let vis = this;

    }
}

