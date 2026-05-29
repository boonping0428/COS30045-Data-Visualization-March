// Select the h2 element specifically inside our D3 Demo section and turn it green
d3.select("#d3-demo h2")
  .style("color", "#4f772d") // Vibrant green matching your house lawn
  .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.1)");


// Step 3: Dynamically generate a scaling, responsive SVG container inside your styled sandbox box
const svg = d3.select("#d3-sandbox")
    .append("svg")
      // A viewBox makes the SVG scalable while preserving the aspect ratio.
      .attr("viewBox", "0 0 1200 1600")
      .attr("preserveAspectRatio", "xMinYMin meet")
      // Styling here is purely for visual debugging and container layout.
      .style("border", "2px dashed #3a5f7b")
      .style("background-color", "#fcfbf7")
      .style("display", "block")
      // width 100% fills the parent container.
      .style("width", "100%")
      // height auto keeps the SVG proportional as the page resizes.
      .style("height", "auto")
      .style("margin-top", "15px");


// =========================================================================
// Exercise 4.4: Loading and formatting data from CSV
// =========================================================================

d3.csv("data/TV_Brand_Model_Countdata.csv", d => {
    // Each row from the CSV is passed through this row conversion function.
    // The returned object becomes one item in the final data array.
    return {
        // These keys match the actual CSV headers in the file.
        brand: d["Brand_Reg"],
        // d["Count(Model_No)"] is initially a string, so '+' converts it to a number.
        count: +d["Count(Model_No)"]
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


const createBarChart = data => {
    // 1. Setup dimensions based on your predefined SVG viewBox width (1200)
    const chartWidth = 1200; 
    const chartHeight = 1600; // Matching your SVG viewBox height
    const chartMargin = { top: 40, right: 40, bottom: 40, left: 120 }; // Increased left margin for brand labels later

    // Update the SVG viewBox dynamically to match our predefined dimensions
    svg.attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`);

    // =========================================================================
    // Step 1: Add Linear scale for count data (X-Axis)
    // =========================================================================
    const xScale = d3.scaleLinear()
        // Domain spans from 0 to the maximum count in your dataset
        .domain([0, d3.max(data, d => d.count)])
        // Range maps it inside the available SVG width canvas area
        .range([chartMargin.left, chartWidth - chartMargin.right]);


    // =========================================================================
    // Step 2: Add a band scale for categories (Y-Axis)
    // =========================================================================
    const yScale = d3.scaleBand()
        // Domain maps every unique brand name from your dataset
        .domain(data.map(d => d.brand))
        // Range spans the available height canvas area
        .range([chartMargin.top, chartHeight - chartMargin.bottom])
        // Added padding (0.2 means 20% of the band height is empty space/gap)
        .padding(0.2);


    // =========================================================================
    // Render Bars using the new Scales
    // =========================================================================
    svg
        .selectAll("rect.bar")
        .data(data)
        .join("rect")
        .attr("class", d => `bar bar-${d.count}`)

        // X position: Starts at the left edge of your range allocation
        .attr("x", chartMargin.left)

        // Y position: Automatically computed by yScale based on the brand string
        .attr("y", d => yScale(d.brand))

        // Bar width: Calculated dynamically using the data value and xScale
        // We subtract the left margin so widths calculate properly relative to the origin
        .attr("width", d => xScale(d.count) - chartMargin.left)

        // Bar height: Automatically calculated by the band scale less padding
        .attr("height", yScale.bandwidth())

        // Styling
        .attr("fill", "steelblue");
};