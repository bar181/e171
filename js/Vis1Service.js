
const yearButtonsContainer = document.getElementById("emailYearButtons");
const backButtonsContainer = document.getElementById("vis1-back-button");
const nextButtonsContainer = document.getElementById("vis1-next-button");

backButtonsContainer.onclick = function() {
    vis1Google.vis1BackButton();
};
nextButtonsContainer.onclick = function() {
    vis1Google.vis1NextButton();
};

function vis1YearChange(year) {
    // Call the onYearChange method of your Vis1Google instance
    vis1Google.onYearChange(year);
}


// Get references to the slider and current-year elements
const slider = document.getElementById("vis1-slider");
const currentYearLabel = document.getElementById("vis1-current-year");

// Add an event listener to the slider
slider.addEventListener("input", function () {
    const selectedYear = parseInt(slider.value);
    // console.log("selectedYear", selectedYear);
    currentYearLabel.textContent = selectedYear;
    vis1YearChange(selectedYear); // Call your function with the selected year
});

