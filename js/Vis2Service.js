
const topicDropown = document.getElementById('topic-dropdown')
const yearDropown =document.getElementById('year-dropdown')
const nextButton =document.getElementById("vis2-next-button")
const backButton =document.getElementById("vis2-back-button")

const subjects = ["None", "Stance", "Sentiment", "Aggressiveness"];
let subjectIndex = 0;

let currentSubject = "None"
let currentYear = "All Years"
let currentTopic = "All Topics"

topicDropown.addEventListener('change', function() {
    currentTopic = topicDropown.value

    //console.log("NEW TOPIC SELECTED:", currentTopic);
    vis2BubbleChart.updateSelection(currentSubject, currentYear, currentTopic)
    vis2DoughnutChart.updateSelection(currentSubject, currentYear, currentTopic)
});

yearDropown.addEventListener('change', function() {
    currentYear = yearDropown.value

    //console.log("NEW YEAR SELECTED:", currentYear);
    vis2BubbleChart.updateSelection(currentSubject, currentYear, currentTopic)
    vis2DoughnutChart.updateSelection(currentSubject, currentYear, currentTopic)
});

nextButton.onclick = function() {
    subjectIndex = Math.min(subjects.length -1, subjectIndex + 1);
    currentSubject = subjects[subjectIndex]

    //console.log("NEW SUBJECT SELECTED:", currentSubject);
    vis2BubbleChart.updateSelection(currentSubject, currentYear, currentTopic)
    vis2DoughnutChart.updateSelection(currentSubject, currentYear, currentTopic)
};

backButton.onclick = function() {
    subjectIndex = Math.max(0, subjectIndex -1);
    currentSubject = subjects[subjectIndex]

    //console.log("NEW SUBJECT SELECTED:", currentSubject);
    vis2BubbleChart.updateSelection(currentSubject, currentYear, currentTopic)
    vis2DoughnutChart.updateSelection(currentSubject, currentYear, currentTopic)
};