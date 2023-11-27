/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */

let vis3SelectedCategory = "net_2050_law";

class Vis3Map {

    constructor(parentElement, geoData, governmentData, emissionsData) {
        this.parentElement = parentElement;
        this.governmentData = governmentData;
        this.geoData = geoData;
        this.emissionsData = emissionsData;

        // define colors
        this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b']

        this.initVis()
    }

    initVis() {
        let vis = this;

        // console.log("Vis 3 init vis")


        // convert TopoJSON to GeoJSON
        vis.geoDataJson = topojson.feature(vis.geoData, vis.geoData.objects.countries).features

        vis.geoDataJson.forEach(d => {
            let countryData = vis.governmentData.find(e => e.Entity === d.properties.name);

            let net_2050_law = "No data";
            try {
                net_2050_law = countryData.by_2050_law;
            } catch {
                // console.log("no data for", d.properties.name)
            }
            d.properties["net_2050_law"] = net_2050_law;

            let countryEmissionsData = vis.emissionsData.find(e => e.Entity === d.properties.name);
            let have_reduced = "No data";
            try {
                have_reduced = countryEmissionsData.have_reduced;
            } catch {
                // console.log("no data for", d.properties.name)
            }
            d.properties["have_reduced"] = have_reduced;
        });


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

        // Create projection
        vis.projection = d3.geoOrthographic()
            .translate([vis.width / 2, vis.height / 2])
            .scale(230)

        // Define geo generator with above projection
        vis.path = d3.geoPath()
            .projection(vis.projection)

        // convert TopoJSON to GeoJSON
        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features

        //Draw ocean
        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', '#ADDEFF')
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("d", vis.path);

        // Draw countries with tooltip
        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", vis.path)
            .on("mouseover", function(event, d){
                // console.log(event);
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', "white")

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`<div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                        <h3>${d.properties.name}</h3>
                        <h4>Net Zero Law: ${d.properties.net_2050_law}</h4>
                        <h4>Have Reduced Emissions (2015-2021): ${d.properties.have_reduced}</h4>
                     </div>`);

            })
            .on("mouseout", function(d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr('fill', d => {
                        if (d.properties[vis3SelectedCategory] === "TRUE") {
                            return "green"
                        } if (d.properties[vis3SelectedCategory] === "No data") {
                            return "gray"
                        } else {
                            return "red"
                        }
                    })

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        // append Tooltip
        vis.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .attr("id", "mapTooltip");

        /* * * * * * * * * * * * * *
        *         LEGEND           *
        * * * * * * * * * * * * * */
        const legendSquareSize = 20; // Set the size of legend squares
        const legendSpacing = 0; // Set the spacing between legend items

        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width * 2.8 / 4}, ${vis.height - 40})`);

        vis.legend.selectAll("rect")
            .data(vis.colors)
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * (legendSquareSize + legendSpacing)) // Adjust the x-coordinate to position the legend squares
            .attr('y', 0) // Position each legend square vertically
            .attr('width', legendSquareSize)
            .attr('height', legendSquareSize)
            .style('fill', d => d);


        // Add legend scale
        // Create an ordinal scale for the legend categories
        vis.x = d3.scaleLinear()
            .domain([0,100]) // Provide an array of category labels
            .range([0, 4 * (legendSquareSize + legendSpacing)]);

        vis.legendAxis = d3.axisBottom()
            .scale(vis.x)
            .tickValues([0, 25, 50, 75, 100]);

        // Create a group element for the legend axis
        vis.legendAxisGroup = vis.legend.append("g")
            .attr("class", "legend-axis")
            .call(vis.legendAxis);

        // Adjust the legend axis position
        vis.legendAxisGroup.attr("transform", `translate(0, ${legendSquareSize})`);

        /* * * * * * * * * * * * * *
        *    Make map draggable    *
        * * * * * * * * * * * * * */
        let m0,
            o0;

        vis.svg.call(
            d3.drag()
                .on("start", function (event) {

                    let lastRotationParams = vis.projection.rotate();
                    m0 = [event.x, event.y];
                    o0 = [-lastRotationParams[0], -lastRotationParams[1]];
                })
                .on("drag", function (event) {
                    if (m0) {
                        let m1 = [event.x, event.y],
                            o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
                        vis.projection.rotate([-o1[0], -o1[1]]);
                    }

                    // Update the map
                    vis.path = d3.geoPath().projection(vis.projection);
                    d3.selectAll(".country").attr("d", vis.path)
                    d3.selectAll(".graticule").attr("d", vis.path)
                    d3.selectAll(".airport")
                        .attr("cx", d => vis.projection([d.longitude, d.latitude])[0])
                        .attr("cy", d => vis.projection([d.longitude, d.latitude])[1])
                        .attr('visibility', getVisibility);
                    d3.selectAll(".route").attr("d", vis.path);
                })
        )

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        // Update country fill
        vis.countries.attr('fill', d => {
            if (d.properties[vis3SelectedCategory] === "TRUE") {
                return "green"
            } if (d.properties[vis3SelectedCategory] === "No data") {
                return "gray"
            } else {
                return "red"
            }
        });


    }
}

function vis3CategoryChange() {
    vis3SelectedCategory = document.getElementById('mapSelector').value;
    console.log(vis3SelectedCategory)
    vis3map.wrangleData();
}
