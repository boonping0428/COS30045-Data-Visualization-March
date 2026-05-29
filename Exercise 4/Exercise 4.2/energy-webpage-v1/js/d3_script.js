// =========================================================================
// Step 2: Apply style to HTML element using D3
// =========================================================================
// Select the h2 element specifically inside our D3 Demo section and turn it green
d3.select("#d3-demo h2")
  .style("color", "#4f772d") // Vibrant green matching your house lawn
  .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.1)");


// =========================================================================
// Step 3: Append an element using D3
// =========================================================================
// Target our sandbox block and append a paragraph warning at the end of it
d3.select("#d3-sandbox")
  .append("p")
    .text("Purchasing a low energy consumption TV will help with your energy bills!")
    .style("color", "#2b2b2b")
    .style("font-size", "15px")
    .style("margin-top", "15px")
    .style("font-style", "italic")
    .style("border-left", "4px solid #a7d379")
    .style("padding-left", "10px");


// =========================================================================
// Step 4: Append a SVG using D3
// =========================================================================
// 1. Generate an empty SVG sheet and nest it within the sandbox container
const d3SvgCanvas = d3.select("#d3-sandbox")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "120")
    .style("background-color", "#fcfbf7")
    .style("border", "1px dashed #b8860b")
    .style("margin-top", "20px")
    .style("border-radius", "4px");

// 2. Build the green data rectangle inside the newly created SVG sheet
d3SvgCanvas.append("rect")
   .attr("x", 50)
   .attr("y", 45)
   .attr("width", 100)
   .attr("height", 30)
   .attr("rx", 4) // Subtle rounded corners
   .style("fill", "#4f772d")
   .style("stroke", "#3e1f06")
   .style("stroke-width", "1.5");

// 3. Add descriptive text label over the graphic so viewers know what it means
d3SvgCanvas.append("text")
  .attr("x", 50)
  .attr("y", 30)
  .attr("font-family", "Arial, sans-serif")
  .attr("font-size", "14px")
  .attr("fill", "#5c2e0a")
  .attr("font-weight", "bold")
  .text("D3 Programmatic Shape Indicator");