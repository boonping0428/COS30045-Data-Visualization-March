// 1. Navigation Logic
// This function switches the visible page section and highlights the selected nav button.
function switchPage(targetPageId) {
    // Hide all page sections first
    const allPages = document.querySelectorAll('.page-section');
    for (let i = 0; i < allPages.length; i++) {
        allPages[i].classList.remove('active-page');
    }

    // Remove the active state from every navigation button
    const allNavButtons = document.querySelectorAll('.nav-btn');
    for (let i = 0; i < allNavButtons.length; i++) {
        allNavButtons[i].classList.remove('active');
    }

    // Show only the selected page section
    document.getElementById(targetPageId).classList.add('active-page');

    // Find the button whose onclick matches the selected page
    const targetButton = document.querySelector(`.nav-btn[onclick="switchPage('${targetPageId}')"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    } else if (targetPageId === 'home') {
        // Fallback for the home button when the query selector cannot locate it directly
        document.querySelector('.nav-btn[onclick="switchPage(\'home\')"]').classList.add('active');
    }
}

// 2. CSV Loading and Parsing Logic
// This async function loads the TV CSV data, parses it, and forwards the rows to displayData().
async function loadTVData() {
    try {
        // Fetch the CSV file from the data folder
        const response = await fetch('data/data.csv');
        const csvText = await response.text();
        
        // Split the CSV text into rows by newline
        // The row parsing below will also handle quoted values correctly.
        const rows = csvText.split('\n');
        
        // Skip the header row (index 0) and map over the rest
        const parsedData = rows.slice(1).map(row => {
            return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        }).filter(cols => cols.length > 20); // Make sure row isn't empty

        displayData(parsedData);
    } catch (error) {
        console.error('Error loading the CSV file:', error);
        document.getElementById('tv-data').innerHTML = '<p style="color:red;">Error loading TV data. Make sure you are running this via a local server (like Live Server or Mercury) and not just opening the file directly in the browser.</p>';
    }
}

// 3. Render Data into HTML Table
function displayData(dataArray) {
    const container = document.getElementById('tv-data');
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Screen Size (cm)</th>
                    <th>Screen Tech</th>
                    <th>Star Rating</th>
                    <th>Energy (kWh/year)</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Loop through the data to create table rows
    // (Limit to 100 rows so the browser stays responsive)
    const limit = Math.min(dataArray.length, 100);
    
    for (let i = 0; i < limit; i++) {
        const cols = dataArray[i];
        
        // Remove surrounding quotes and provide a fallback when values are missing.
        const brand = cols[2] ? cols[2].replace(/"/g, '') : 'N/A';
        const model = cols[3] ? cols[3].replace(/"/g, '') : 'N/A';
        const size = cols[7] ? Math.round(cols[7]) : 'N/A';
        const tech = cols[9] ? cols[9].replace(/"/g, '') : 'N/A';
        const stars = cols[22] ? cols[22].replace(/"/g, '') : 'N/A';
        const energy = cols[16] ? cols[16].replace(/"/g, '') : 'N/A';

        tableHTML += `
            <tr>
                <td>${brand}</td>
                <td>${model}</td>
                <td>${size}</td>
                <td>${tech}</td>
                <td>${stars}</td>
                <td>${energy}</td>
            </tr>
        `;
    }

    tableHTML += `
            </tbody>
        </table>
    `;
    
    // Put the completed HTML table into the target container element
    container.innerHTML = tableHTML;
}

// 4. Initialization
// Automatically load the data when the script first runs
window.onload = () => {
    loadTVData();
    initializeStoryboard();
    initializeStoryboard2();
};

// 5. Storyboard Functionality
let currentStoryboardIndex = 0;
const storyboardImages = [
    "Storyboard1- picture1.png",
    "Storyboard1- picture2.png",
    "Storyboard1- picture3.png",
    "Storyboard1- picture4.png",
    "Storyboard1- picture5.png",
    "Storyboard1- picture6.png"
];

const storyboardExplanations = [
    "<strong>Storyboard 1:</strong> Sarah is looking for a television, but she doesn't know which type of television she should buy.",
    "<strong>Storyboard 2:</strong> By using KNIME, we analyzed which type of television is the most frequently purchased by people in Australia.",
    "<strong>Storyboard 3:</strong> There are total 3 types of television including, LCD (LED), LCD, and OLED in the Australia market.",
    "<strong>Storyboard 4:</strong> After analyzed, we created a bar chart so that it can differentiate the frequent between the 3 types of televisions.",
    "<strong>Storyboard 5:</strong> The bar chart show LCD (LED) is the most frequent type of television in Australia market.",
    "<strong>Storyboard 6:</strong> Sarah purchase a television that using LCD (LED) technology."
];

// Storyboard 2
let currentStoryboard2Index = 0;
const storyboard2Images = [
    "Storyboard2- picture1.png",
    "Storyboard2- picture2.png",
    "Storyboard2- picture3.png",
    "Storyboard2- picture4.png",
    "Storyboard2- picture5.png",
    "Storyboard2- picture6.png"
];

const storyboard2Explanations = [
    "<strong>Storyboard 1:</strong> Sarah want to lower their electricity bills but don't know which TV screen technology (LED, LCD, OLED) consumes the least amount of power",
    "<strong>Storyboard 2:</strong> By using KNIME, we analyzed which type of television is the least amount of power in Australia.",
    "<strong>Storyboard 3:</strong> There are total 3 types of television including, LCD (LED), LCD, and OLED in the Australia market.",
    "<strong>Storyboard 4:</strong> After analyzed, we created a bar chart so that it can differentiate the amount of power between the 3 types of televisions.",
    "<strong>Storyboard 5:</strong> The bar chart show LCD is the least power usage of television in Australia market. ",
    "<strong>Storyboard 6:</strong> Sarah purchase a television that using LCD technology because this technology is the least power usage compare to others."
];

function initializeStoryboard() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => switchStoryboard(-1));
        nextBtn.addEventListener('click', () => switchStoryboard(1));
    }
    
    updateStoryboard();
}

function switchStoryboard(direction) {
    currentStoryboardIndex += direction;
    const totalStoryboards = storyboardImages.length;
    
    if (currentStoryboardIndex < 0) {
        currentStoryboardIndex = totalStoryboards - 1;
    } else if (currentStoryboardIndex >= totalStoryboards) {
        currentStoryboardIndex = 0;
    }
    
    updateStoryboard();
}

function updateStoryboard() {
    const imageElement = document.getElementById('storyboard-image');
    const explanationElement = document.getElementById('storyboard-explanation');
    
    if (imageElement && explanationElement) {
        const currentImage = storyboardImages[currentStoryboardIndex];
        const imageNumber = currentStoryboardIndex + 1;
        imageElement.src = `images/${currentImage}`;
        imageElement.alt = `Storyboard ${imageNumber}`;
        
        explanationElement.innerHTML = `<p>${storyboardExplanations[currentStoryboardIndex]}</p>`;
    }
}

function initializeStoryboard2() {
    const prevBtn2 = document.getElementById('prev-btn2');
    const nextBtn2 = document.getElementById('next-btn2');
    
    if (prevBtn2 && nextBtn2) {
        prevBtn2.addEventListener('click', () => switchStoryboard2(-1));
        nextBtn2.addEventListener('click', () => switchStoryboard2(1));
    }
    
    updateStoryboard2();
}

function switchStoryboard2(direction) {
    currentStoryboard2Index += direction;
    const totalStoryboards = storyboard2Images.length;
    
    if (currentStoryboard2Index < 0) {
        currentStoryboard2Index = totalStoryboards - 1;
    } else if (currentStoryboard2Index >= totalStoryboards) {
        currentStoryboard2Index = 0;
    }
    
    updateStoryboard2();
}

function updateStoryboard2() {
    const imageElement = document.getElementById('storyboard-image2');
    const explanationElement = document.getElementById('storyboard-explanation2');
    
    if (imageElement && explanationElement) {
        const currentImage = storyboard2Images[currentStoryboard2Index];
        const imageNumber = currentStoryboard2Index + 1;
        imageElement.src = `images/${currentImage}`;
        imageElement.alt = `Storyboard ${imageNumber}`;
        
        explanationElement.innerHTML = `<p>${storyboard2Explanations[currentStoryboard2Index]}</p>`;
    }
}