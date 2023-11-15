

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

let vis1Data = null;
let vis2Data = null;
let vis3Data = null;
let vis4Data = null;
let vis5Data = null;

let userAge = 30; // default age

/*
    PAGE LOADING - this area will load all the individual pages and scripts
 */

// Array of page names in the desired order
const pageNames = [
    'get_started',
    'p1_title',
    'p2_ask_age',
    'p3_vis1_header',
    'p3_vis1_text',
    'p3_vis1_main',

    // Add more page names here
    // make sure your page includes the id for your visualization !

];


// Add the name of the initialize function for each visualization here
function loadData() {
    initializeVis1();
}


// Create your own visualizations including data loading
function initializeVis1() {
    // d3.csv("data/vis1.csv")
    //     .then(data => {
    //         vis1Data = data;
    //         let myVis1 = new Vis1('vis1');
    //         console.log("vis1", myVis1, vis1Data)
    //     }).catch(function(err) {
    //     console.log(err)
    // });
    // let myVis1 = new Vis1('vis1');
    console.log("vis1", vis1Data)

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
                slidesNavigation: true,
                controlArrows: false
            });

            // Now that the pages are loaded, loadData can be called to load data and initialize visualizations
            loadData();
        })
        .catch(error => {
            console.error(error);
        });
});