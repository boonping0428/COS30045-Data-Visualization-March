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