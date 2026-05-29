const bar55Container = d3.select('#bar55-viz');
const parseNumericBar55 = value => {
    const cleaned = (value || '').toString().replace(/"/g, '').trim();
    return cleaned === '' || cleaned === '-' ? NaN : +cleaned;
};

d3.csv('data/data.csv', d => ({
    tech: d.Screen_Tech,
    screensize: parseNumericBar55(d.screensize),
    energy: parseNumericBar55(d['Labelled energy consumption (kWh/year)'])
})).then(raw => {
    const data55 = raw.filter(d => d.tech && d.energy > 0 && d.screensize >= 136 && d.screensize <= 142);
    const grouped = Array.from(d3.rollup(data55, v => d3.mean(v, d => d.energy), d => d.tech),
        ([tech, averageEnergy]) => ({ tech, averageEnergy }))
        .sort((a, b) => b.averageEnergy - a.averageEnergy);

    const width = 860;
    const height = 440;
    const margin = { top: 35, right: 30, bottom: 50, left: 140 };

    const svg = bar55Container.append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMin meet');

    const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(grouped, d => d.averageEnergy) || 0])
        .nice()
        .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleBand()
        .domain(grouped.map(d => d.tech))
        .range([0, height - margin.top - margin.bottom])
        .padding(0.2);

    chart.append('g')
        .call(d3.axisLeft(yScale).tickSize(0))
        .selectAll('text')
        .style('font-size', '13px');

    chart.append('g')
        .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(5))
        .call(g => g.append('text')
            .attr('x', (width - margin.left - margin.right) / 2)
            .attr('y', 38)
            .attr('fill', '#333')
            .style('font-size', '13px')
            .style('font-weight', '600')
            .attr('text-anchor', 'middle')
            .text('Average energy consumption (kWh/year)'));

    chart.selectAll('rect')
        .data(grouped)
        .join('rect')
        .attr('y', d => yScale(d.tech))
        .attr('width', d => xScale(d.averageEnergy))
        .attr('height', yScale.bandwidth())
        .attr('fill', '#4f77b9');

    chart.selectAll('.bar-label')
        .data(grouped)
        .join('text')
        .attr('class', 'bar-label')
        .attr('x', d => xScale(d.averageEnergy) + 8)
        .attr('y', d => yScale(d.tech) + yScale.bandwidth() / 2 + 4)
        .style('fill', '#222')
        .style('font-size', '13px')
        .text(d => `${d.averageEnergy.toFixed(1)} kWh`);
}).catch(error => console.error('55-inch bar chart error:', error));
