
const topicDropdown = document.getElementById('topic-dropdown')
const yearDropdown =document.getElementById('year-dropdown')
const nextButton =document.getElementById("vis2-next-button")
const backButton =document.getElementById("vis2-back-button")


const subjects = ["None", "Stance", "Sentiment", "Aggressiveness"];
let subjectIndex = 0;

let currentSubject = "None"
let currentYear = "All Years"
let currentTopic = "All Topics"



// This function adds or removes a class to rotate the arrow
// function toggleArrow(dropdownId) {
//     var dropdownArrow = document.getElementById(dropdownId + '-arrow'); // Adjust ID based on your HTML
//     if (dropdownArrow) {
//         dropdownArrow.classList.toggle('rotate-down');
//     }
// }

topicDropdown.addEventListener('change', function() {
    currentTopic = topicDropdown.value
    // toggleArrow('topic'); // Added: Toggle arrow when topic changes



    //console.log("NEW TOPIC SELECTED:", currentTopic);
    vis2BubbleChart.updateSelection(currentSubject, currentYear, currentTopic)
    vis2DoughnutChart.updateSelection(currentSubject, currentYear, currentTopic)
});

yearDropdown.addEventListener('change', function() {
    currentYear = yearDropdown.value
    // toggleArrow('year'); // Added: Toggle arrow when year changes


    // console.log("NEW YEAR SELECTED:", currentYear);
    vis2BubbleChart.updateSelection(currentSubject, currentYear, currentTopic)
    vis2DoughnutChart.updateSelection(currentSubject, currentYear, currentTopic)
});


// // Example usage ADDED
// document.getElementById('year-selector').addEventListener('click', function() {
//     toggleDropdown('year-selector'); // Call this function when year-selector is clicked
// });
//
// document.getElementById('topic-selector').addEventListener('click', function() {
//     toggleDropdown('topic-selector'); // Call this function when topic-selector is clicked
// });


nextButton.onclick = function() {
    subjectIndex = Math.min(subjects.length -1, subjectIndex + 1);
    currentSubject = subjects[subjectIndex]


    // Show p_main and p1 always
    document.querySelector('#p_main').style.display = "block";
    document.querySelector('#p1').style.display = "block";

    // Hide other paragraphs initially
    document.querySelector('#p_stance').style.display = "none";
    document.querySelector('#p_sentiment').style.display = "none";
    document.querySelector('#p_aggressiveness').style.display = "none";

    if (currentSubject === "None") {
        document.querySelector('.top-bar-title').textContent = "No Subject Selected";
    } else if (currentSubject === "Stance") {
        document.querySelector('.top-bar-title').textContent = "Current Subject: " + currentSubject;
        document.querySelector('#p_stance').style.display = "block"; // Show p_stance
        document.querySelector('#p1').style.display = "none";
    } else if (currentSubject === "Sentiment") {
        document.querySelector('.top-bar-title').textContent = "Current Subject: " + currentSubject;
        document.querySelector('#p_sentiment').style.display = "block"; // Show p_sentiment
        document.querySelector('#p_stance').style.display = "none"; // Show p_stance
        document.querySelector('#p1').style.display = "none";
    } else if (currentSubject === "Aggressiveness") {
        document.querySelector('.top-bar-title').textContent = "Current Subject: " + currentSubject;
        document.querySelector('#p_aggressiveness').style.display = "block"; // Show p_aggressiveness
        document.querySelector('#p_sentiment').style.display = "none"; // Show p_sentiment
        document.querySelector('#p_stance').style.display = "none"; // Show p_stance
        document.querySelector('#p1').style.display = "none";
    }



    if (currentSubject === "None") {
        document.querySelector('.top-bar-title').textContent = "No Subject Selected";
    } else {
        document.querySelector('.top-bar-title').textContent = "Current Subject: " + currentSubject;
    }

    //console.log("NEW SUBJECT SELECTED:", currentSubject);
    vis2BubbleChart.updateSelection(currentSubject, currentYear, currentTopic)
    vis2DoughnutChart.updateSelection(currentSubject, currentYear, currentTopic)
};

backButton.onclick = function() {
    subjectIndex = Math.max(0, subjectIndex -1);
    currentSubject = subjects[subjectIndex]

    // Show p_main and p1 always
    document.querySelector('#p_main').style.display = "block";
    document.querySelector('#p1').style.display = "block";

    // Hide other paragraphs initially
    document.querySelector('#p_stance').style.display = "none";
    document.querySelector('#p_sentiment').style.display = "none";
    document.querySelector('#p_aggressiveness').style.display = "none";

    if (currentSubject === "None") {
        document.querySelector('.top-bar-title').textContent = "No Subject Selected";
    } else if (currentSubject === "Stance") {
        document.querySelector('.top-bar-title').textContent = "Current Subject: " + currentSubject;
        document.querySelector('#p_stance').style.display = "block"; // Show p_stance
        document.querySelector('#p1').style.display = "none";
    } else if (currentSubject === "Sentiment") {
        document.querySelector('.top-bar-title').textContent = "Current Subject: " + currentSubject;
        document.querySelector('#p_sentiment').style.display = "block"; // Show p_sentiment
        document.querySelector('#p_stance').style.display = "none"; // Show p_stance
        document.querySelector('#p1').style.display = "none";
    } else if (currentSubject === "Aggressiveness") {
        document.querySelector('.top-bar-title').textContent = "Current Subject: " + currentSubject;
        document.querySelector('#p_aggressiveness').style.display = "block"; // Show p_aggressiveness
        document.querySelector('#p_sentiment').style.display = "none"; // Show p_sentiment
        document.querySelector('#p_stance').style.display = "none"; // Show p_stance
        document.querySelector('#p1').style.display = "none";
    }





    if (currentSubject === "None") {
        document.querySelector('.top-bar-title').textContent = "No Subject Selected";
    } else {
        document.querySelector('.top-bar-title').textContent = "Current Subject: " + currentSubject;
    }

    //console.log("NEW SUBJECT SELECTED:", currentSubject);
    vis2BubbleChart.updateSelection(currentSubject, currentYear, currentTopic)
    vis2DoughnutChart.updateSelection(currentSubject, currentYear, currentTopic)
};
