// Global workspace reference placeholder variable for tooltip group mapping context
let tooltipElement;

// 1. Setup Screen Technology selection filter controls layer inputs button components mapping
function populateFilters(data) {
    const filterContainer = d3.select("#filters_screen");
    filterContainer.html(""); 

    filterContainer.selectAll("button")
        .data(filters_screen)
        .enter()
        .append("button")
        .attr("class", d => d.isActive ? "nav-btn active" : "nav-btn")
        .text(d => d.label)
        .on("click", function(event, selectedFilter) {
            
            filters_screen.forEach(f => f.isActive = (f.id === selectedFilter.id));
            
            filterContainer.selectAll("button")
                .attr("class", d => d.id === selectedFilter.id ? "nav-btn active" : "nav-btn");

            applyCombinedCrossFilters();
        });
}

// 2. Single-Criteria Filter Data Evaluator Controller Engine Core Module System Block
function applyCombinedCrossFilters() {
    const currentActiveTechId = filters_screen.find(f => f.isActive).id;

    let processingOutputDatasetResult = globalTVData;

    if (currentActiveTechId !== "all") {
        processingOutputDatasetResult = processingOutputDatasetResult.filter(
            d => d.screenTech.toLowerCase() === currentActiveTechId.toLowerCase()
        );
    }

    executeHistogramTransitionFramework(processingOutputDatasetResult);
}

// 3. Interface Node Element Vector Scale Canvas Rendering Updates Smooth Transition Engine
function executeHistogramTransitionFramework(filteredData) {
    const updatedBinsMatrix = binGenerator.domain(xScale.domain())(filteredData);

    yScale.domain([0, d3.max(updatedBinsMatrix, d => d.length)]).nice();

    const svgInnerWorkspaceGroupContext = d3.select("#histogram svg g");

    svgInnerWorkspaceGroupContext.select(".y-axis")
        .transition()
        .duration(800)
        .ease(d3.easeQuadOut)
        .call(d3.axisLeft(yScale));

    const columnRectsVectorMapNodes = svgInnerWorkspaceGroupContext.selectAll(".bar")
        .data(updatedBinsMatrix);

    columnRectsVectorMapNodes.transition()
        .duration(800)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => height - yScale(d.length));
}

// Step 3.1 & 3.2: Append a new tool tip group element to the scatterplot's innerChartS
function createTooltip() {
    tooltipElement = innerChartS.append("g")
        .attr("id", "scatterplot-tooltip")
        .style("opacity", 0) 
        .style("pointer-events", "none");

    // Step 3.3: Append tooltip background curved corner rectangle
    tooltipElement.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 6)
        .attr("ry", 6)
        .style("fill", barColor) 
        .style("opacity", 0.9);

    // Step 3.4: Append tooltip text positioning layout rules
    tooltipElement.append("text")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2 + 4)
        .attr("fill", "#ffffff")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text("");
}

// Step 3.5: Add function to react to mouse events
function HandleMouseEvents() {
    // Step 3.6: Select all the circles in our scatter plot
    innerChartS.selectAll("circle")
        // Step 3.7: Attach event listeners to mouseenter and mouseleave events
        .on("mouseenter", function(event, d) {
            console.log("Mouse entered circle node data:", d);

            // Step 3.8: Collect center positions from element attributes
            const cx = +d3.select(this).attr("cx");
            const cy = +d3.select(this).attr("cy");

            // Update text node content with current screen size dimensions
            tooltipElement.select("text")
                .text(`Size: ${d.screenSize} inches`);

            // Position and fade in the tooltip window smoothly
            tooltipElement.attr("transform", `translate(${cx + 12}, ${cy - tooltipHeight / 2})`);
            
            tooltipElement.transition()
                .duration(150)
                .style("opacity", 1);
        })
        .on("mouseleave", function(event, d) {
            console.log("Mouse left circle node");

            // Step 3.8: Reset tooltip back to fully transparent layout bounds
            tooltipElement.transition()
                .duration(150)
                .style("opacity", 0);
        });
}