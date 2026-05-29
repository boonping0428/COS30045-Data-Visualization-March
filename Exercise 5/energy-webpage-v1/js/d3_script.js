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
      // width 95% keeps the chart slightly smaller than full width.
      .style("width", "95%")
      .style("max-width", "1400px")
      .style("margin-left", "0")
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
    // 1. Use the actual container width, but keep the chart compact and left-aligned.
    const containerWidth = Math.max(1000, svg.node().parentNode.getBoundingClientRect().width || 1000);
    const chartWidth = Math.max(1200, Math.min(containerWidth, 1600));
    const barHeight = 44;
    const barSpacing = 54;
    const maxBrandLength = d3.max(data, d => d.brand.length);
    const labelMargin = Math.max(220, Math.min(340, maxBrandLength * 8 + 20));
    const chartMargin = { top: 50, right: 50, bottom: 50, left: labelMargin };
    const chartHeight = Math.max(1200, chartMargin.top + chartMargin.bottom + data.length * barSpacing);

    // Sync your SVG canvas viewBox with the current dimensions
    svg.attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`);

    // Linear scale for mapping counts cleanly along the X-Axis
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([0, chartWidth - chartMargin.left - chartMargin.right]);

    // Band scale for partitioning rows cleanly along the Y-Axis
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.brand))
        .range([chartMargin.top, chartHeight - chartMargin.bottom])
        .padding(0.12);


    // =========================================================================
    // Step 2: Add an object to hold structural groups (of text and rectangles)
    // =========================================================================
    // This selection creates a structural '<g>' container for every data row.
    const barAndLabel = svg
        .selectAll("g.bar-group")
        .data(data)
        .join("g")
        .attr("class", "bar-group")
        // The transform pushes the entire group vertically to its correct yScale position
        .attr("transform", d => `translate(0, ${yScale(d.brand)})`);


    // =========================================================================
    // Step 3: Add back the rectangles (Nested inside the group)
    // =========================================================================
    barAndLabel
        .append("rect")
        .attr("class", d => `bar bar-${d.count}`)
        // The group handles the row's Y position, so we set 'y' relative to 0 here
        .attr("x", chartMargin.left)
        .attr("y", 0)
        // Bar width maps seamlessly through our scale function
        .attr("width", d => xScale(d.count))
        // Bar height dynamically scales down matching your uniform band widths
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue");


    // =========================================================================
    // Step 4: Add the category text labels (Brand Name)
    // =========================================================================
    barAndLabel
        .append("text")
        .text(d => d.brand)
        .attr("x", chartMargin.left - 8)
        .attr("y", yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .style("font-family", "sans-serif")
        .style("font-size", "13px")
        .style("fill", "#333");


    // =========================================================================
    // Step 5: Add the count value text labels
    // =========================================================================
    barAndLabel
        .append("text")
        .text(d => d.count)
        // Positioned dynamically at the end of the bar length, plus a small padding gap
        .attr("x", d => chartMargin.left + xScale(d.count) + 8) 
        // Centers text vertically within the calculated band height
        .attr("y", yScale.bandwidth() / 2 + 4) 
        .attr("text-anchor", "start")
        .style("font-family", "sans-serif")
        .style("font-size", "13px")
        .style("font-weight", "bold")
        .style("fill", "#111");
};