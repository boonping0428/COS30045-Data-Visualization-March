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
    const containerWidth = parseInt(d3.select("#d3-sandbox").style("width"), 10) || 1100;
    const chartWidth = Math.max(containerWidth, 1100);
    const chartMargin = { top: 40, right: 40, bottom: 40, left: 50 };
    const barHeight = 24;
    const barSpacing = 28;
    const chartHeight = chartMargin.top + chartMargin.bottom + data.length * barSpacing;

    const widthScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([0, chartWidth - chartMargin.left - chartMargin.right]);

    svg.attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`);

    svg
        .selectAll("rect.bar")
        .data(data)
        .join("rect")

        // Add class names
        .attr("class", d => {
            console.log(d);
            return `bar bar-${d.count}`;
        })

        // X position
        .attr("x", chartMargin.left)

        // Y position
        .attr("y", (d, i) => chartMargin.top + i * barSpacing)

        // Bar width based on count, scaled to the chart width
        .attr("width", d => widthScale(d.count))

        // Constant bar height
        .attr("height", barHeight)

        // Styling
        .attr("fill", "steelblue");

};