/*
    INSTRUCTIONS
    ------------
    1. html pages in the pages diretory, js files/class in js directory
    3. Be aware any changes to this page will affect all other coders.  You should mainly be working on your individual html/js pages and have minimal changes to this page.
    4. Remember to always get the latest version and commit when you are done!
 */



/*
    GLOBAL VARIABLES
 */



/*
    PAGE LOADING - this area will load all the individual pages and scripts
 */

// Define a function to load and insert pages
// Define a function to load and insert pages
function loadPage(pageName) {
    fetch(`pages/${pageName}.html`)
        .then(response => response.text())
        .then(content => {
            // Append the content to #pages-div
            document.querySelector('#pages-div').insertAdjacentHTML('beforeend', content);
        })
        .catch(error => {
            console.error(`Error loading ${pageName}:`, error);
        });
}

// Define a function to load JavaScript files dynamically
function loadScript(scriptName) {
    const script = document.createElement('script');
    script.src = `js/${scriptName}.js`;
    script.async = true;
    document.body.appendChild(script);
}

// Load an initial page (e.g., p1_title.html) when the page loads
window.addEventListener('load', () => {
    // load html files
    loadPage('p1_title');
    loadPage('p2_ask_age');

    // load classes and visualizations
    loadScript('vis1');
});