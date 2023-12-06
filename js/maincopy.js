/*
    Coding sources: chatGpt, co-pilot
    Licenses: This project uses FullPage.js and is in a public repository
 */

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
// let userAge = 30; // default age
//
// let userTopic = 'Human Impact'; // default Human Impact
// let userTopicOptions = ['Human Impact', 'Gas Emissions', 'Global Warming', 'Pollution and Nature'];
// let topicImage = 'images/emojis/emmett.png'; // default Human Impact
//
// // Visualization Level Variables
// let vis1Data = null;
// let vis1Google = null;
// let vis1News = null;
//
// let vis2BubbleChart = null;
// let vis2DoughnutChart = null;
//
// let vis3Data = null;
// let vis4Data = null;
// let vis5Data = null;
//
// let vis3map = null;

const userAgeInput = document.getElementById("userAgeInput");

/*
    PAGE LOADING - this area will load all the individual pages and scripts
 */

// Array of script names in the desired order
const scriptNames = [
    'variables',
    'UserTopicService',
    'Vis1Service',
    'Vis1Google',
    'Vis2Service',
    'Vis4Service',
    'Vis4Race',
    'Vis5Line',
    'Vis2BubbleChart',
    'Vis2DoughnutChart',
    'Vis3map',
];


// Array of page names in the desired order
const pageNames = [

    'p1_title',
    // 'p2_ask_age',
    'p2_ask_topic',
    'p3_intro',

    // brad - vis4 Race Bar Chart fits better here for the story
    'vis4_header',
    'vis4_main',
    // 'vis4_text',

    // brad - Year by Year Google Trends and News Topics
    // 'vis1_header',
    'vis1_main',
    'vis1_text',

    // brad - vis4 line chart with descriptions
    'vis5_header',
    'vis5_main',
    'vis1_text',

    // jess
    'vis2_header',
    'vis2_main',
    'vis2_text',

    // filip
    'vis3_header',
    'vis3_main',
    'vis3_text',

    // brad - next steps reader can take
    // 'next_steps_header',
    'next_steps',

    // wrap up  - to be updated with a game
    'closing',

    'authors',

    // Add more page names here
    // make sure your page includes the id for your visualization !

];


// Add the name of the initialize function for each visualization here
function loadData() {


    initializeVis1();
    initializeVis2();
    initializeVis3();
}

// add any functions that need to be called when the user changes their age
function userAgeButton(age) {
    userAge = age;
    console.log("User changed their age: ", userAge);
    vis1Google.onAgeChange(age);

}

// Create your own visualizations including data loading
function initializeVis1() {
    // save News events first;
    d3.json("data/vis1_news.json")
        .then(data => {
            // Your data is now loaded as JSON, and you don't need to worry about single quotes
            vis1News = data;
            initializeVis1Main();
            console.log("initializeVis1 vis1News", vis1News);
        })
        .catch(function(err) {
            console.log(err);
        });

}

function initializeVis1Main() {
    d3.csv("data/google_trends_with_images.csv")
        .then(data => {
            data.forEach(d => {
                // Convert year columns to numbers
                for (const key in d) {
                    if (key !== "Topic" && key !== "Image") {
                        d[key] = parseFloat(d[key]);
                    }
                }
            });
            vis1Data = data;
            //console.log("initializeVis1 vis1Google", vis1Data)
            vis1Google = new Vis1Google('vis1Google');

            vis4Data = data;
            vis4Race = new Vis4Race('vis4Race');
            console.log("vis4Race", vis4Race);

            vis5Data = data;
            vis5Line = new Vis5Line('vis5Line');
            // vis4Race.startAnimation();

        }).catch(function(err) {
        console.log(err)
    });
}

function initializeVis2() {
    // Load all CSV files concurrently using Promise.all
    let promises = [
        d3.csv("data/tweets_per_topic.csv"),
        d3.csv("data/tweets_per_topic_per_year.csv"),
        d3.csv("data/aggressiveness_per_topic.csv"),
        d3.csv("data/aggressiveness_per_topic_per_year.csv"),
        d3.csv("data/sentiment_per_topic.csv"),
        d3.csv("data/sentiment_per_topic_per_year.csv"),
        d3.csv("data/stance_per_topic.csv"),
        d3.csv("data/stance_per_topic_per_year.csv")
    ];

    Promise.all(promises).then(([
                                    tweets_per_topic,
                                    tweets_per_topic_per_year,
                                    aggressiveness_per_topic,
                                    aggressiveness_per_topic_per_year,
                                    sentiment_per_topic,
                                    sentiment_per_topic_per_year,
                                    stance_per_topic,
                                    stance_per_topic_per_year
                                ]) => {

            // For all datasets containing numerical columns (integers or floats)
            // loop through each row and convert strings to int/floats
            tweets_per_topic.forEach(function (d) {
                d.Topic = d.Topic;
                d.Count = +d.Count; // Convert Count from string to number
            });
            tweets_per_topic_per_year.forEach(function (d) {
                d.Topic = d.Topic;
                d.Year = +d.Year; //convert year to number
                d.Count = +d.Count; //convert count from string to number
            });
            aggressiveness_per_topic.forEach(function (d) {
                d.Topic = d.Topic;
                d.Year = +d.Year;
                d.Aggressiveness = +d.Aggressiveness;
                d.Count = +d.Count;

            });
            aggressiveness_per_topic_per_year.forEach(function (d) {
                d.Topic = d.Topic;
                d.Aggressiveness = +d.Aggressiveness;
                d.Count = +d.Count;
            });
            sentiment_per_topic.forEach(function (d) {
                d.Topic = d.Topic;
                d.Sentiment = +d.Sentiment;
                d.Count = +d.Count;
            });
            sentiment_per_topic_per_year.forEach(function (d) {
                d.Topic = d.Topic;
                d.Year = +d.Year;
                d.Sentiment = +d.Sentiment;
                d.Count = +d.Count;
            });
            stance_per_topic.forEach(function (d) {
                d.Topic = d.Topic;
                d.most_popular_stance = d.most_popular_stance;
                d.Count = +d.Count;
            });
            stance_per_topic_per_year.forEach(function (d) {
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
        }
    );
}
    //     Promise.all(promises).then(function([
//                                             tweets_per_topic,
//                                             tweets_per_topic_per_year,
//                                             aggressiveness_per_topic,
//                                             aggressiveness_per_topic_per_year,
//                                             sentiment_per_topic,
//                                             sentiment_per_topic_per_year,
//                                             stance_per_topic,
//                                             stance_per_topic_per_year
//                                         ]) {
//
//         // For all datasets containing numerical columns (integers or floats)
//         // loop through each row and convert strings to int/floats
//         tweets_per_topic.forEach(function(d) {
//             d.Topic = d.Topic;
//             d.Count = +d.Count; // Convert Count from string to number
//         });
//         tweets_per_topic_per_year.forEach(function(d) {
//             d.Topic = d.Topic;
//             d.Year = +d.Year; //convert year to number
//             d.Count = +d.Count; //convert count from string to number
//         });
//         aggressiveness_per_topic.forEach(function(d){
//             d.Topic = d.Topic;
//             d.Year = +d.Year;
//             d.Aggressiveness = +d.Aggressiveness;
//             d.Count = +d.Count;
//
//         });
//         aggressiveness_per_topic_per_year.forEach(function(d){
//             d.Topic = d.Topic;
//             d.Aggressiveness = +d.Aggressiveness;
//             d.Count = +d.Count;
//         });
//         sentiment_per_topic.forEach(function(d){
//             d.Topic = d.Topic;
//             d.Sentiment = +d.Sentiment;
//             d.Count = +d.Count;
//         });
//         sentiment_per_topic_per_year.forEach(function(d){
//             d.Topic = d.Topic;
//             d.Year = +d.Year;
//             d.Sentiment = +d.Sentiment;
//             d.Count = +d.Count;
//         });
//         stance_per_topic.forEach(function(d){
//             d.Topic = d.Topic;
//             d.most_popular_stance = d.most_popular_stance;
//             d.Count = +d.Count;
//         });
//         stance_per_topic_per_year.forEach(function(d){
//             d.Topic = d.Topic;
//             d.Year = +d.Year;
//             d.most_popular_stance = d.most_popular_stance;
//             d.Count = +d.Count;
//         });
//         // No need to do this ^^ for stance_per_topic and stance_per_topic_per_year
//         // because there are no numerical columns in these csv files.
//
//         // Initialize your charts with the processed data
//         vis2BubbleChart = new Vis2BubbleChart(
//             'bubbleChartContainer',
//             tweets_per_topic,
//             tweets_per_topic_per_year,
//             aggressiveness_per_topic,
//             aggressiveness_per_topic_per_year,
//             sentiment_per_topic,
//             sentiment_per_topic_per_year,
//             stance_per_topic,
//             stance_per_topic_per_year
//         );
//         vis2DoughnutChart = new Vis2DoughnutChart(
//             'doughnutChartContainer',
//             tweets_per_topic,
//             tweets_per_topic_per_year,
//             aggressiveness_per_topic,
//             aggressiveness_per_topic_per_year,
//             sentiment_per_topic,
//             sentiment_per_topic_per_year,
//             stance_per_topic,
//             stance_per_topic_per_year
//         );
//     });


function initializeVis3() {
    Promise.all([
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"),
        d3.csv("data/vis3/vis3_net_zero_targets.csv"),
        d3.csv("data/vis3/vis3-total-ghg-emissions-final.csv"),
        d3.csv("data/vis3/vis3-Ratified-Paris-Agreement-final.csv")
    ])
        .then(function([world, targets, reduced, paris]) {
            vis3map = new Vis3Map('mapContainer', world, targets, reduced, paris);
        })
        .catch(function(err) {
            console.log(err)
        });
}

// Load pages and scripts in order using pageLoader.js
window.addEventListener('load', () => {

    // Load JavaScript files and HTML pages
    loadPagesAndScripts(pageNames)
        .then(() => {

            new fullpage('#fullpage', {
                licenseKey: 'gplv3-license',
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