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
};