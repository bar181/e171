/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */

let vis3SelectedCategory = "ratifiedParisDate";


// Initialize slider
vis3MapSlider = document.getElementById('map-slider');
vis3MapDate = document.getElementById('map-date');

let sliderDate2010 = moment('2010-01-01', "YYYY-MM-DD").valueOf();
let sliderDate2016 = moment('2016-01-01', "YYYY-MM-DD").valueOf();
let sliderDate2017 = moment('2017-01-01', "YYYY-MM-DD").valueOf();
let sliderDate2018 = moment('2018-01-01', "YYYY-MM-DD").valueOf();
let sliderDate2023 = moment('2023-12-01', "YYYY-MM-DD").valueOf();


let isVis3Playing = false;
let animationIntervalVis3;

let mapGray = "#8d918c";
let mapGreen = "green";
let mapNoInfo = "#5a5e5a";

class Vis3Map {

    constructor(parentElement, geoData, governmentData, emissionsData, parisData) {
        this.parentElement = parentElement;
        this.governmentData = governmentData;
        this.geoData = geoData;
        this.emissionsData = emissionsData;
        this.parisData = parisData;

        // define colors
        this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b']

        this.initVis()
    }

    initVis() {
        let vis = this;

        // console.log("Vis 3 init vis")

        // Initiliaze map date
        vis3MapDate.innerText = moment(sliderDate2023);


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

            let parisData = vis.parisData.find(e => e.Entity === d.properties.name);
            let ratifiedParisDate = "No data";
            try {
                ratifiedParisDate = parisData["legal_date"];
            } catch {
                // console.log("no data for", d.properties.name)
            }
            d.properties["ratifiedParisDate"] = ratifiedParisDate;
        });


        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // vis.height = vis.height * 0.5;

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
        // vis.projection = d3.geoMercator()
        //     .translate([vis.width / 2, vis.height / 2])
        //     .scale(230)

        // Create projection for a flat map
        vis.projection = d3.geoMercator()
            .translate([vis.width / 2, vis.height / 2]) // Centers the map in the SVG
            .scale((vis.width - 3) / (2 * Math.PI)) // Scales the map to fit within the SVG width
            .center([0, 0]) // Centers the map at the longitude and latitude origin point
            .rotate([0,0]); // Ensures the map is not rotated

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
                        <h4>Signed 2015 Paris Agreement: ${d.properties.ratifiedParisDate}</h4>
                        <h4>Net Zero Law: ${d.properties.net_2050_law}</h4>
                        <h4>Have Reduced Emissions (2015-2021): ${d.properties.have_reduced}</h4>
                     </div>`);

            })
            .on("mouseout", function(d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr('fill', d => {
                        if (d.properties[vis3SelectedCategory] === "No data") {
                            return mapNoInfo
                        } if ((moment(d.properties[vis3SelectedCategory], "YYYY-MM-DD").isBefore(moment(vis3MapDate.innerText))) || (d.properties[vis3SelectedCategory] === "TRUE")) {
                            return mapGreen
                        } else {
                            return mapGray
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

        // Create the slider
        noUiSlider.create(vis3MapSlider, {
            start: [sliderDate2023],
            range: {
                'min': [sliderDate2010],
                '15%': [sliderDate2016],
                '80%': [sliderDate2018],
                'max': [sliderDate2023]
            },
            pips: {
                mode: 'values',
                values: [sliderDate2010, sliderDate2016, sliderDate2018, sliderDate2023],
                format: {
                    to: function (value) {
                        return moment.unix(value / 1000).format('YYYY');
                    },
                    from: function (value) {
                        return moment(value, 'YYYY-MM-DD').unix() * 1000;
                    }
                }
            }
        });

        vis3MapSlider.noUiSlider.on('update', function (values) {
            let thisDate = moment.unix(values[0]/1000);
            // console.log('Selected Date Range: ' + thisDate.format('YYYY-MM-DD'));
            vis3MapDate.innerText = thisDate.format('MMM YYYY');
            vis.wrangleData();
        });

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

            if (d.properties[vis3SelectedCategory] === "No data") {
                return mapNoInfo
            } if ((moment(d.properties[vis3SelectedCategory], "YYYY-MM-DD").isBefore(moment(vis3MapDate.innerText))) || (d.properties[vis3SelectedCategory] === "TRUE")) {
                return mapGreen
            } else {
                return mapGray
            }
        });


    }
}

function vis3CategoryChange() {
    vis3SelectedCategory = document.getElementById('mapSelector').value;
    vis3map.wrangleData();
}

function togglePlayPauseVis3() {
    isVis3Playing = !isVis3Playing;

    // Get the current slider value
    let currentValue = vis3MapSlider.noUiSlider.get();
    let currentDate = moment.unix(currentValue / 1000);

    // Reset the animation if the slider is at the end
    if (isVis3Playing && (currentDate.isSame(sliderDate2023))) {
        vis3MapSlider.noUiSlider.set(sliderDate2010);
    }

    // Start or stop the animation
    if (isVis3Playing) {
        document.getElementById('playPauseButton').innerText = 'Pause';
        startAnimationVis3();
    } else {
        document.getElementById('playPauseButton').innerText = 'Play';
        clearInterval(animationIntervalVis3);
    }
}

function startAnimationVis3() {
    animationIntervalVis3 = setInterval(function () {

        // Get the current slider value
        let currentValue = vis3MapSlider.noUiSlider.get()
        let currentDate = moment.unix(currentValue / 1000).startOf('month');

        if (!isVis3Playing) {
            // Stop the animation if paused
            clearInterval(animationIntervalVis3);
            return;
        }

        // Increment the date by one month
        if (currentDate.isSameOrBefore(moment(sliderDate2016).add(-11, 'months'))) {
            currentDate.add(1, 'years');
        } else if (currentDate.isBefore(sliderDate2018)) {
            currentDate.add(1, 'months');
        } else if (currentDate.isSameOrBefore(moment(sliderDate2023).add(-1, 'years'))) {
            currentDate.add(1, 'years');
        } else {
            // Handle the case when less than a year is left
            currentDate = moment(sliderDate2023);
            togglePlayPauseVis3();
        }

        console.log(currentDate.format("YYYY-MM-DD"));

        // Check if the new date is within the allowed range
        if (currentDate.isSameOrBefore(moment(sliderDate2023).add(30, 'days'))) {
            // Update the slider value
            vis3MapSlider.noUiSlider.set(currentDate.valueOf());

            // Update the map
            vis3map.wrangleData();
        } else {
            togglePlayPauseVis3();
        }
    }, 350);
}