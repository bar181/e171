// pageLoader.js

// Function to load a page and return a promise
function loadPage(pageName) {
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
    try {
        for (const pageName of pageNames) {
            const pageContent = await loadPage(pageName);
            document.querySelector('#fullpage').insertAdjacentHTML('beforeend', pageContent);
        }

        for (const scriptName of scriptNames) {
            loadScript(scriptName);
        }

        // Add more script loading here if needed
    } catch (error) {
        console.error(error);
    }
}