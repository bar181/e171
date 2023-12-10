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




        var script = document.createElement('script');
        script.src = 'https://unpkg.com/rabbit-lyrics';
        script.onload = function() {
            console.log('Rabbit-Lyrics script loaded successfully.');
            console.log('ADDING RABBIT LYRICS HTML');
            var gretaElement = document.getElementById('greta-full');
            if (gretaElement) {
                gretaElement.innerHTML = `
                    <div class="rabbit-lyrics" data-media="#greta-audio">
                        [00:04.00] We are right now in the beginning of a climate and ecological crisis
                        [00:06.00] And we need to call it what it is
                        [00:11.00] An emergency
                        [00:15.00] We must acknowledge that we do not have the situation under control
                        [00:21.00] And that we don't have all the solutions yet
                        [00:26.00] Unless those solutions mean that we simply stop doing certain things
                
                        [00:32.00] We must admit that we are losing this battle
                        [00:37.00] We have to acknowledge that the older generations have failed
                        [00:43.00] All political movements in their present form have failed
                        [00:48.00] But Homo sapiens have not yet failed
                        [00:54.00] Yes, we are failing, but there is still time to turn everything around
                        [01:00.00] We can still fix this
                        [01:04.00] We still have everything in our own hands
                        [01:09.00] But unless we recognise the overall failures of our current systems
                        [01:16.00] We most probably don't stand a chance
                
                        [01:21.00] We are facing a disaster of unspoken sufferings for enormous amounts of people
                        [01:28.00] And now is not the time for speaking politely or focusing on what we can or cannot say
                        [01:36.00] Now is the time to speak clearly
                        [01:40.00] Solving the climate crisis is the greatest and most complex challenge that Homo sapiens have ever faced
                        [01:49.00] The main solution, however, is so simple that even a small child can understand it
                        [01:56.00] We have to stop our emissions of greenhouse gases
                        [02:02.00] And either we do that, or we don't
                        [02:07.00] You say that nothing in life is black or white
                        [02:12.00] But that is a lie, a very dangerous lie
                
                        [02:18.00] Either we prevent a 1.5-degree of warming, or we don't
                        [02:24.00] Either we avoid setting off that irreversible chain reaction beyond human control, or we don't
                        [02:32.00] Either we choose to go on as our civilization, or we don't
                        [02:38.00] That is as black or white as it gets
                        [02:42.00] Because there are no grey areas when it comes to survival. Now, we all have a choice
                        [02:50.00] We can create transformational action that will safeguard the living conditions for future generations
                        [02:58.00] Or we can continue with our business as usual and fail
                
                        [03:04.00] That is up to you and me
                        [03:09.00] And yes, we need a system change rather than individual change
                        [03:15.00] But you cannot have one without the other
                        [03:20.00] If you look through history
                        [03:24.00] All the big changes in society have been started by people at the grassroots level
                        [03:32.00] People like you and me
                        [03:36.00] So, I ask you to please wake up and make the changes required possible
                        [03:43.00] To do your best is no longer good enough
                        [03:49.00] We must all do the seemingly impossible
                
                        [03:54.00] Today, we use about 100 million barrels of oil every single day
                        [04:02.00] There are no politics to change that
                        [04:06.00] There are no rules to keep that oil in the ground
                        [04:12.00] So, we can no longer save the world by playing by the rules
                        [04:18.00] Because the rules have to be changed
                        [04:23.00] Everything needs to change, and it has to start today
                
                        [04:29.00] So, everyone out there, it is now time for civil disobedience
                        [04:36.00] It is time to rebel.
                    </div>
                    <audio id="greta-audio" controls>
                        <source src="audio/greta-audio.mp3" type="audio/mpeg">
                    </audio>`;
            }
        };
        script.onerror = function() {
            console.log('Error loading Rabbit-Lyrics script.');
        };
        document.head.appendChild(script);
        document.body.appendChild(script);





    } catch (error) {
        console.error(error);
    }

}