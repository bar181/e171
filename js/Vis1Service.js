
const yearButtonsContainer = document.getElementById("emailYearButtons");
const backButtonsContainer = document.getElementById("vis1-back-button");
const nextButtonsContainer = document.getElementById("vis1-next-button");

const emailSections = document.querySelectorAll('.email-section');
const fbSections = document.querySelectorAll('.fb-section');

backButtonsContainer.onclick = function() {
    vis1Google.vis1BackButton();
};
nextButtonsContainer.onclick = function() {
    vis1Google.vis1NextButton();
};

// Create buttons for each year from 2004 to 2023
for (let year = 2004; year <= 2009; year++) {
    const listItem = document.createElement("li");
    listItem.className = "nav-item"; // Add the nav-item class to the wrapper

    // Create the button element
    const button = document.createElement("button");
    button.textContent = year.toString() + " Climate Email";
    button.onclick = function() {
        vis1YearChange(year);
    };

    // Add the btn and vis1-year-button classes to the button
    button.className = "btn vis1-year-button btn-info";

    // Append the button to the list item
    listItem.appendChild(button);

    // Append the list item to the yearButtonsContainer
    yearButtonsContainer.appendChild(listItem);
}

function vis1YearChange(year) {
    // Call the onYearChange method of your Vis1Google instance
    vis1Google.onYearChange(year);
}
