// Vis 3 Thermometer Viz

class Vis3Thermometer {

    constructor(parentElement, warmingData) {
        this.parentElement = parentElement;
        this.warmingData = warmingData;

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

        // // add title
        // vis.svg.append('g')
        //     .attr('class', 'title')
        //     .attr('id', 'map-title')
        //     .append('text')
        //     .text('Title for Map')
        //     .attr('transform', `translate(${vis.width / 2}, 20)`)
        //     .attr('text-anchor', 'middle');

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        vis.updateVis()
    }

    updateVis() {
        let vis = this;


    }
}