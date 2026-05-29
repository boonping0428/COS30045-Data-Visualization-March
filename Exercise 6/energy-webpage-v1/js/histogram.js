function drawHistogram(data) {
    // Reset workspace layer
    d3.select("#histogram").html("");

    // Mount structural SVG canvas wrapper viewport
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Define X domain based on data bounds
    xScale.domain([0, d3.max(data, d => d.energyConsumption)]);

    // Generate numeric frequency bin intervals
    const bins = binGenerator.domain(xScale.domain())(data);

    // Define Y vertical frequency domain scale
    yScale.domain([0, d3.max(bins, d => d.length)]).nice();

    // Map rectangle vectors into workspace layout
    svg.selectAll(".bar")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.x0) + 1)
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("height", d => height - yScale(d.length))
        .style("fill", barColor)
        .style("cursor", "pointer")
        .on("mouseover", function() { d3.select(this).style("fill", hoverBarColor); })
        .on("mouseout", function() { d3.select(this).style("fill", barColor); });

    // Step 6.5: Render X horizontal baseline mapping grid axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "#222222")
        .style("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "600")
        .text("Annual Energy Consumption (kWh/year)");

    // Step 6.6: Render Y vertical frequency axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -45)
        .attr("x", -height / 2)
        .attr("fill", "#222222")
        .style("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "600")
        .text("Frequency (Number of Models)");
}