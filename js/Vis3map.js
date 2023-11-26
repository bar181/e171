/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */


class Vis3Map {

    constructor(parentElement, governmentData, geoData) {
        this.parentElement = parentElement;
        this.governmentData = governmentData;
        this.geoData = geoData;

        // define colors
        this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b']

        this.initVis()
    }

    initVis() {
        let vis = this;

        console.log("Vis 3 init vis")


        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title')
            .attr('id', 'map-title')
            .append('text')
            .text('Title for Map')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

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
                console.log(event);
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
                        <h4>Category: ${vis.countryInfo[d.properties.name].category}</h4>
                        <h4>Value: ${vis.countryInfo[d.properties.name].value}</h4>
                        <h4>Color: ${vis.countryInfo[d.properties.name].color}</h4>
                        <h4>data: ${JSON.stringify(vis.countryInfo[d.properties.name])}</h4>
                     </div>`);

            })
            .on("mouseout", function(d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr('fill', d => vis.countryInfo[d.properties.name].color)

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
        *       DRAW AIRPORTS      *
        * * * * * * * * * * * * * */

        // Code below adapted from https://stackoverflow.com/questions/22366749/how-can-i-determine-if-a-point-is-hidden-on-a-projection
        function getVisibility(d) {
            const visible = vis.path(
                {type: 'Point', coordinates: [d.longitude, d.latitude]});

            return visible ? 'visible' : 'hidden';
        }

        vis.svg.selectAll(".airport")
            .data(vis.governmentData.nodes)
            .enter()
            .append("circle")
            .attr("class", "airport")
            .attr("cx", d => vis.projection([d.longitude, d.latitude])[0])
            .attr("cy", d => vis.projection([d.longitude, d.latitude])[1])
            .attr("r", 3)
            .attr("fill", "black")
            .attr('visibility', getVisibility);

        /* * * * * * * * * * * * * *
        *        DRAW ROUTES       *
        * * * * * * * * * * * * * */

        // Create a GeoJSON FeatureCollection for nodes
        const routeFeatures = vis.governmentData.links.map((d) => {
            return {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [vis.governmentData.nodes[d.source].longitude, vis.governmentData.nodes[d.source].latitude],
                        [vis.governmentData.nodes[d.target].longitude, vis.governmentData.nodes[d.target].latitude],
                    ],
                },
            };
        });
        console.log(routeFeatures);

        vis.svg.selectAll(".route")
            .data(routeFeatures)
            .enter().append("path")
            .attr("class", "route")
            .attr("d", vis.path)
            .attr('stroke-width', '2px')
            .attr('stroke', 'black')
            .attr('fill', "none");

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

        // create random data structure with information for each land
        vis.countryInfo = {};
        vis.geoData.objects.countries.geometries.forEach(d => {
            let randomCountryValue = Math.random() * 4
            vis.countryInfo[d.properties.name] = {
                name: d.properties.name,
                category: 'category_' + Math.floor(randomCountryValue),
                color: vis.colors[Math.floor(randomCountryValue)],
                value: randomCountryValue / 4 * 100
            }
        })

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        console.log(vis.countryInfo)

        // Update country fill
        vis.countries.attr("fill", d => vis.countryInfo[d.properties.name].color);


    }
}