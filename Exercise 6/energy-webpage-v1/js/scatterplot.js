// Step 2.1: Main Scatterplot drawing framework system
function drawScatterplot(data) {
    // Reset workspace layer
    d3.select("#scatter-plot-6").html("");

    // Mount fluid responsive SVG canvas context
    const svg = d3.select("#scatter-plot-6")
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("width", "100%")
        .attr("height", "100%");

    // Step 2.2: Assign inner layout directly to the globally declared innerChartS variable
    innerChartS = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Step 2.3: Calculate domains for X (Star Rating) and Y (Energy Consumption)
    xScaleS.domain([0, d3.max(data, d => d.star)]).nice();
    yScaleS.domain([0, d3.max(data, d => d.energyConsumption)]).nice();

    // Step 2.4: Set up qualitative categorical color scale hues
    colorScale
        .domain(["LED", "OLED", "LCD"])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    // Step 2.5: Draw circle markers with 0.5 opacity and pointer cursor
    innerChartS.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("r", 5)
        .attr("opacity", 0.5)
        .style("fill", d => colorScale(d.screenTech))
        .style("cursor", "pointer");

    // Step 2.6: Append Bottom Horizontal axis lines
    innerChartS.append("g")
        .attr("class", "x-axis-s")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScaleS))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "#222222")
        .style("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "600")
        .text("Star Rating");

    // Step 2.6: Append Left Vertical axis lines
    innerChartS.append("g")
        .attr("class", "y-axis-s")
        .call(d3.axisLeft(yScaleS))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -45)
        .attr("x", -height / 2)
        .attr("fill", "#222222")
        .style("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "600")
        .text("Annual Energy Consumption (kWh/year)");

    // Step 2.7: Append Color Coding Legend
    const legend = innerChartS.append("g")
        .attr("transform", `translate(${width - 120}, 10)`);

    const technologies = ["LED", "OLED", "LCD"];
    technologies.forEach((tech, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);
            
        legendRow.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", colorScale(tech));
            
        legendRow.append("text")
            .attr("x", 20)
            .attr("y", 11)
            .attr("fill", "#333333")
            .style("font-size", "12px")
            .style("font-weight", "500")
            .text(tech);
    });
}