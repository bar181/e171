
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

let firstYearFb = 2012;

// Create buttons for each year from 2004 to 2023
for (let year = 2004; year <= firstYearFb; year++) {
    const listItem = document.createElement("li");
    listItem.className = "nav-item"; // Add the nav-item class to the wrapper

    // Create the button element
    const button = document.createElement("button");
    if(year >= firstYearFb){
        button.textContent = "2012+ Facebook Posts";
    } else {
        button.textContent = year.toString() + " Climate Email";
    }

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

const fbYearData = [
    // { year: 2010, imageURL: 'images/vis1_fb1.webp' },
    // { year: 2011, imageURL: 'images/vis1_fb2.webp' },
    { year: 2012, imageURL: 'images/vis1_fb3.webp' },
    { year: 2013, imageURL: 'images/vis1_fb4.webp' },
    { year: 2014, imageURL: 'images/vis1_fb5.webp' },
    { year: 2015, imageURL: 'images/vis1_fb1.webp' },
    { year: 2016, imageURL: 'images/vis1_fb2.webp' },
    { year: 2017, imageURL: 'images/vis1_fb3.webp' },
    { year: 2018, imageURL: 'images/vis1_fb4.webp' },
    { year: 2019, imageURL: 'images/vis1_fb5.webp' },
    { year: 2020, imageURL: 'images/vis1_fb1.webp' },
    { year: 2021, imageURL: 'images/vis1_fb2.webp' },
    { year: 2022, imageURL: 'images/vis1_fb3.webp' },
    { year: 2023, imageURL: 'images/vis1_fb4.webp' },
];

// Create FB Buttons
function createFbDivElements() {
    const container = document.getElementById('fb-posts'); // Replace with your container ID
    fbYearData.forEach(item => {
        const divCol = document.createElement('div');
        divCol.className = 'col-md-3 p-2';
        divCol.onclick = function() {
            vis1YearChange(item.year);
        };

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card vis1-fb-top fb-section vis1_fb_images';
        cardDiv.style.backgroundImage = `url('${item.imageURL}')`;

        const cardTitle = document.createElement('div');
        cardTitle.className = 'card-title-small';
        cardTitle.innerText = item.year;

        const viewButton = document.createElement('button');
        viewButton.className = 'btn btn-sm btn-primary';
        viewButton.innerText = 'View Post';

        cardDiv.appendChild(cardTitle);
        cardDiv.appendChild(viewButton);
        divCol.appendChild(cardDiv);
        container.appendChild(divCol);
    });
}

createFbDivElements();


function vis1YearChange(year) {
    // Call the onYearChange method of your Vis1Google instance
    vis1Google.onYearChange(year);
}
