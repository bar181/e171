// Vis 3 Thermometer Viz

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

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
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
        console.log("New row:", vis.warmingRow)

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

    }
}

