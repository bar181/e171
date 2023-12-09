// pageLoader.js
let isPageLoadSuccess = false;
// Function to load a page and return a promise
function loadPage(pageName) {
    console.log("+++  P   +++++++++Loading Page Name "+ pageName + " +++++++++++++")
    return fetch(`pages/${pageName}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${pageName}`);
            }
            return response.text();
        });
}

// Function to load a script and return a promise
function loadScript(scriptName) {
    console.log("+++++   S   +++++++Loading Script "+ scriptName + " +++++++++++++")
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `js/${scriptName}.js`;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// Function to load pages and scripts in order
async function loadPagesAndScripts(pageNames) {
    console.log("++++++   PS   ++++++Loading pages and Script "+ pageNames + " +++++++++++++")
    try {

        //Loading Initialization Variables
      //  loadScript(scriptNames[0]);

        for (const pageName of pageNames) {
            const pageContent = await loadPage(pageName);
            document.querySelector('#fullpage').insertAdjacentHTML('beforeend', pageContent);
        }

        for (const scriptName of scriptNames) {
          //  if (scriptName != scriptNames[0])
          //       loadScript(scriptName);
            await loadScript(scriptName);
        }
        isPageLoadSuccess = true;
        // Add more script loading here if needed
    } catch (error) {
        console.error(error);
    }

}