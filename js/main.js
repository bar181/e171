

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

let vis2BubbleChart = null;
let vis2DoughnutChart = null;

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
    'Vis2Service',
    'Vis2BubbleChart',
    'Vis2DoughnutChart'
    ];


// Array of page names in the desired order
const pageNames = [

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
            //console.log("initializeVis1 vis1Google", vis1Data)
            vis1Google = new Vis1Google('vis1Google');

        }).catch(function(err) {
        console.log(err)
    });
}

function initializeVis2() {
    // Load all CSV files concurrently using Promise.all
    Promise.all([
        d3.csv("data/tweets_per_topic.csv"),
        d3.csv("data/tweets_per_topic_per_year.csv"),
        d3.csv("data/aggressiveness_per_topic.csv"),
        d3.csv("data/aggressiveness_per_topic_per_year.csv"),
        d3.csv("data/sentiment_per_topic.csv"),
        d3.csv("data/sentiment_per_topic_per_year.csv"),
        d3.csv("data/stance_per_topic.csv"),
        d3.csv("data/stance_per_topic_per_year.csv")
    ]).then(function([
            tweets_per_topic,
            tweets_per_topic_per_year,
            aggressiveness_per_topic,
            aggressiveness_per_topic_per_year,
            sentiment_per_topic,
            sentiment_per_topic_per_year,
            stance_per_topic,
            stance_per_topic_per_year
        ]) {

        // For all datasets containing numerical columns (integers or floats)
        // loop through each row and convert strings to int/floats
        tweets_per_topic.forEach(function(d) {
            d.Topic = d.Topic;
            d.Count = +d.Count; // Convert Count from string to number
        });
        tweets_per_topic_per_year.forEach(function(d) {
            d.Topic = d.Topic;
            d.Year = +d.Year; //convert year to number
            d.Count = +d.Count; //convert count from string to number
        });
        aggressiveness_per_topic.forEach(function(d){
            d.Topic = d.Topic;
            d.Year = +d.Year;
            d.Aggressiveness = +d.Aggressiveness;
            d.Count = +d.Count;

        });
        aggressiveness_per_topic_per_year.forEach(function(d){
            d.Topic = d.Topic;
            d.Aggressiveness = +d.Aggressiveness;
            d.Count = +d.Count;
        });
        sentiment_per_topic.forEach(function(d){
            d.Topic = d.Topic;
            d.Sentiment = +d.Sentiment;
            d.Count = +d.Count;
        });
        sentiment_per_topic_per_year.forEach(function(d){
            d.Topic = d.Topic;
            d.Year = +d.Year;
            d.Sentiment = +d.Sentiment;
            d.Count = +d.Count;
        });
        stance_per_topic.forEach(function(d){
            d.Topic = d.Topic;
            d.most_popular_stance = d.most_popular_stance;
            d.Count = +d.Count;
        });
        stance_per_topic_per_year.forEach(function(d){
            d.Topic = d.Topic;
            d.Year = +d.Year;
            d.most_popular_stance = d.most_popular_stance;
            d.Count = +d.Count;
        });
        // No need to do this ^^ for stance_per_topic and stance_per_topic_per_year
        // because there are no numerical columns in these csv files.

        // Initialize your charts with the processed data
        vis2BubbleChart = new Vis2BubbleChart(
            'bubbleChartContainer',
            tweets_per_topic,
            tweets_per_topic_per_year,
            aggressiveness_per_topic,
            aggressiveness_per_topic_per_year,
            sentiment_per_topic,
            sentiment_per_topic_per_year,
            stance_per_topic,
            stance_per_topic_per_year
        );
        vis2DoughnutChart = new Vis2DoughnutChart(
            'doughnutChartContainer',
            tweets_per_topic,
            tweets_per_topic_per_year,
            aggressiveness_per_topic,
            aggressiveness_per_topic_per_year,
            sentiment_per_topic,
            sentiment_per_topic_per_year,
            stance_per_topic,
            stance_per_topic_per_year
        );
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