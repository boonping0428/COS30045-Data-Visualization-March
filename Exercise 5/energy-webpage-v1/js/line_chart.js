const lineContainer = d3.select('#line-viz');
const parseYear = d3.timeParse('%Y');

d3.csv('data/spot_prices.csv', d => ({
    year: parseYear(d.year),
    price: +d.avg_price
})).then(raw => {
    const data = raw.filter(d => d.year && !isNaN(d.price));
    const width = 900;
    const height = 520;
    const margin = { top: 35, right: 40, bottom: 55, left: 60 };

    const svg = lineContainer.append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMin meet');

    const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.year))
        .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price) * 1.1])
        .range([height - margin.top - margin.bottom, 0]);

    chart.append('g')
        .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(d3.timeYear.every(3)).tickFormat(d3.timeFormat('%Y')));

    chart.append('g')
        .call(d3.axisLeft(yScale).ticks(6))
        .call(g => g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -((height - margin.top - margin.bottom) / 2))
            .attr('y', -46)
            .attr('fill', '#333')
            .style('font-size', '13px')
            .style('font-weight', '600')
            .attr('text-anchor', 'middle')
            .text('Spot price (AUD/MWh)'));

    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.price))
        .curve(d3.curveMonotoneX);

    chart.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#2a79ff')
        .attr('stroke-width', 3)
        .attr('d', line);

    chart.append('g')
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', d => xScale(d.year))
        .attr('cy', d => yScale(d.price))
        .attr('r', 4.5)
        .attr('fill', '#ff7a45')
        .append('title')
        .text(d => `${d3.timeFormat('%Y')(d.year)}: ${d.price.toFixed(1)} AUD/MWh`);
}).catch(error => console.error('Line chart error:', error));
