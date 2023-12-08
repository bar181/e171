// topicImage = "images/emojis/herbie.png";

// Get all the topic options
const topicOptions = document.querySelectorAll('.topic-option');
console.log("topicOptions started")
// Attach an onclick event listener to each option
topicOptions.forEach(option => {

    option.addEventListener('click', () => {
        // console.log("topicOptions clicked")
        // Remove the 'emoji_big_selected' class from all options
        topicOptions.forEach(opt => {
            opt.querySelector('img').classList.remove('emoji_big_selected');
        });

        // Add the 'emoji_big_selected' class to the clicked option
        option.querySelector('img').classList.add('emoji_big_selected');

        // Update the userTopic variable based on the clicked option
        const optionId = option.getAttribute('id');
        switch (optionId) {
            case 'option1':
                userTopic = 'Human Impact';
                emojiName = 'Emmett';
                topicImage = "images/emojis/emmett.png";
                break;
            case 'option2':
                userTopic = 'Gas Emissions';
                emojiName = 'Herbie';
                topicImage = "images/emojis/herbie.png";
                break;
            case 'option3':
                userTopic = 'Global Warming';
                emojiName = 'Sunny';
                topicImage = "images/emojis/sunny.png";
                break;
            case 'option4':
                userTopic = 'Pollution and Nature';
                emojiName = 'Oscar';
                topicImage = "images/emojis/oscar.png";
                break;
            default:
                userTopic = 'Human Impact'; // Default to 'Human Impact' if none matched
        }

        // change global items
        globalTopicChanges()

        // vis and specific updates - any text changes and call required wrangleData functions
        vis4TopicChanges()
    });
});

// updates the userTopic variable based on the selected option
function globalTopicChanges() {
    // src of the image changes to new topic image
    const imgSpanElements = document.querySelectorAll('.user-topic-image');
    imgSpanElements.forEach(spanElement => {
        spanElement.src = topicImage;
    });

    console.log("imgSpanElements clicked", imgSpanElements)

// All text with class "globalTopic" changes to new topic name
    const vis4SpanElements = document.querySelectorAll('.globalTopic');
    vis4SpanElements.forEach(spanElement => {
        spanElement.textContent = userTopic;
    });

    const emojiNameElements = document.querySelectorAll('.emojiName');
    emojiNameElements.forEach(spanElement => {
        spanElement.textContent = emojiName;
    });

    toggleParagraphVisibility();
}

function vis4TopicChanges() {
    console.log("vis4TopicChanges clicked", userTopic)
    vis4Race.wrangleData();

}

function toggleParagraphVisibility() {
    var topicEmmett = document.getElementById('topic-emmett');
    var topicHerbie = document.getElementById('topic-herbie');
    var topicSunny = document.getElementById('topic-sunny');
    var topicOscar = document.getElementById('topic-oscar');

    // Hide all paragraphs initially
    topicEmmett.classList.add('d-none');
    topicHerbie.classList.add('d-none');
    topicSunny.classList.add('d-none');
    topicOscar.classList.add('d-none');

    // Show the appropriate paragraph based on emojiName
    if (emojiName === 'Emmett') {
        topicEmmett.classList.remove('d-none');
    } else if (emojiName === 'Herbie') {
        topicHerbie.classList.remove('d-none');
    } else if (emojiName === 'Sunny') {
        topicSunny.classList.remove('d-none');
    } else if (emojiName === 'Oscar') {
        topicOscar.classList.remove('d-none');
    }
}






