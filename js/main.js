

/*
    INSTRUCTIONS
    ------------
    1. add your html pages in pageNames (the pageLoader will load these pages for your)
    2. Add your js files/class in js directory
    3. For a vis: create your initialize function and add the name to loadData()
    4. Remember to always get the latest version and commit when you are done!
 */



/*
    GLOBAL VARIABLES
*/
// Common variables used by all Visualizations
let userAge = 30; // default age


// Visualization Level Variables
let vis1Data = null;
let vis1Google = null;

let vis2Data = null;
let vis3Data = null;
let vis4Data = null;
let vis5Data = null;




/*
    PAGE LOADING - this area will load all the individual pages and scripts
 */

// Array of script names in the desired order
const scriptNames = [
    'Vis1Service',
    'Vis1Google',
    'Vis2bubblechart',
    'Vis2doughnutchart'
    ];


// Array of page names in the desired order
const pageNames = [
    'get_started',
    'p1_title',
    'p2_ask_age',

    // brad
    'vis1_header',
    'vis1_main',
    'vis1_text',

    // jess
    'vis2_header',
    'vis2_main',
    'vis2_text',

    // filip
    'vis3_header',
    'vis3_main',
    'vis3_text',

    // to do - simple line chart
    'vis4_header',
    'vis4_main',
    'vis4_text',

    // to do - show what people can do (game or animation to show specific initiative
    'vis5_header',
    'vis5_main',

    // close
    'closing',
    'next_steps',
    'authors',

    // Add more page names here
    // make sure your page includes the id for your visualization !

];


// Add the name of the initialize function for each visualization here
function loadData() {
    initializeVis1();
    initializeVis2();
}


// Create your own visualizations including data loading
function initializeVis1() {
    d3.csv("data/google_trends_relative_by_year.csv")
        .then(data => {
            data.forEach(d => {
                // Convert year columns to numbers
                for (const key in d) {
                    if (key !== "Topic") {
                        d[key] = parseFloat(d[key]);
                    }
                }
            });
            vis1Data = data;
            // clean data
            console.log("initializeVis1 vis1Google", vis1Data)
            vis1Google = new Vis1Google('vis1Google');

        }).catch(function(err) {
        console.log(err)
    });
    // let vis1Google = new GoogleVis('vis1Google');

}

function initializeVis2() {
    // main.js
// Load both CSV files concurrently using Promise.all
    Promise.all([
        d3.csv("data/tweets_per_topic.csv"),
        d3.csv("data/tweets_per_topic_per_year.csv")  // Assuming this is your second CSV file
    ]).then(function([tweets_per_topic, tweets_per_topic_per_year]) {
        // Process the first dataset (tweets_per_topic.csv)
        tweets_per_topic.forEach(function(d) {
            d.Topic = d.Topic;
            d.Count = +d.Count; // Convert Count from string to number
        });

        // Process the second dataset (tweets_per_topic_per_year.csv)
        tweets_per_topic_per_year.forEach(function(d) {
            d.Topic = d.Topic;
            d.Year = +d.Year; //convert year to number
            d.Count = +d.Count; //convert count from string to number
        });

        // Initialize your charts with the processed data
        const myBubbleChart = new Vis2bubblechart('bubbleChartContainer', tweets_per_topic, tweets_per_topic_per_year);
        const myDoughnutChart = new Vis2doughnutchart('doughnutChartContainer', tweets_per_topic, tweets_per_topic_per_year);

        // Event listener for the topic dropdown
        document.getElementById('topic-dropdown').addEventListener('change', function() {
            const selectedTopic = this.value;
            myBubbleChart.updateTopicHighlight(selectedTopic);
            myDoughnutChart.updateTopicHighlight(selectedTopic);
        });

        // Event listener for the topic dropdown
        document.getElementById('year-dropdown').addEventListener('change', function() {
            const selectedYear = this.value;
            myBubbleChart.updateChartForYear(selectedYear);
            myDoughnutChart.updateChartForYear(selectedYear);
        });

    });
}


// Load pages and scripts in order using pageLoader.js
window.addEventListener('load', () => {

    // Load JavaScript files and HTML pages
    loadPagesAndScripts(pageNames)
        .then(() => {

            new fullpage('#fullpage', {
                anchors: pageNames,
                navigationTooltips: pageNames,
                css3: true,
                scrollingSpeed: 1000,
                navigation: true,
                slidesNavigation: false,
                controlArrows: false,

            });

            // Now that the pages are loaded, loadData can be called to load data and initialize visualizations
            loadData();
        })
        .catch(error => {
            console.error(error);
        });
});