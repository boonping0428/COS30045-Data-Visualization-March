// Step 3: Dynamically generate a scaling, responsive SVG container inside your styled sandbox box
const svg = d3.select("#d3-sandbox")
    .append("svg")
      // A viewBox makes the SVG scalable while preserving the aspect ratio.
      .attr("viewBox", "0 0 1200 1600")
      // Styling here is purely for visual debugging and container layout.
      .style("border", "2px dashed #3a5f7b")
      .style("background-color", "#fcfbf7")
      .style("display", "block")
      // width 100% fills the parent container.
      .style("width", "100%")
      // height auto keeps the SVG proportional as the page resizes.
      .style("height", "auto")
      .style("margin-top", "15px");

// Step 4: Append a simple rectangle that helps verify the SVG is scaling correctly.
svg.append("rect")
    .attr("x", 10)      // distance from left edge
    .attr("y", 10)      // distance from top edge
    .attr("width", 414) // fixed width for visual testing
    .attr("height", 16) // fixed height
    .attr("fill", "blue");


// =========================================================================
// Exercise 4.4: Loading and formatting data from CSV
// =========================================================================

d3.csv("data/TV_Brand_Model_Countdata.csv", d => {
    // Each row from the CSV is passed through this row conversion function.
    // The returned object becomes one item in the final data array.
    return {
        // These keys must match the CSV column names exactly.
        brand: d.brand,
        // d.count is initially a string, so '+' converts it to a number.
        count: +d.count
    };
}).then(data => {
    // This block runs after the CSV file is loaded and parsed successfully.
    console.log("Loaded Array Data:", data);

    // Diagnostics: inspect dataset size and numeric value range.
    console.log("Total Dataset Rows (Length):", data.length);
    console.log("Maximum Count Value:", d3.max(data, d => d.count));
    console.log("Minimum Count Value:", d3.min(data, d => d.count));
    console.log("Dataset Range Extent [Min, Max]:", d3.extent(data, d => d.count));

    // Sort descending by count so the largest bars appear first in the chart.
    data.sort((a, b) => b.count - a.count);
    console.log("Sorted Data (Descending):", data);

    // Pass the cleaned and sorted data into the chart-building function.
    createBarChart(data);
}).catch(error => {
    // If the CSV file cannot be loaded, this block logs the error.
    console.error("Error loading the CSV data file:", error);
});


const createBarChart = (data) => {
    // This is the function where you will add bars, axes, labels, and interactivity.
    // Right now it only confirms that the data arrived correctly.
    console.log("createBarChart function successfully received clean data:", data);
};