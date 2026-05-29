const scatterContainer = d3.select('#scatter-viz');
const parseNumericScatter = value => {
    const cleaned = (value || '').toString().replace(/"/g, '').trim();
    return cleaned === '' || cleaned === '-' ? NaN : +cleaned;
};

d3.csv('data/data.csv', d => ({
    brand: d.Brand_Reg,
    screenTech: d.Screen_Tech,
    energy: parseNumericScatter(d['Labelled energy consumption (kWh/year)']),
    stars: parseNumericScatter(d.Star2)
})).then(raw => {
    const data = raw.filter(d => d.screenTech && d.energy > 0 && d.stars > 0);
    const width = 900;
    const height = 520;
    const margin = { top: 40, right: 30, bottom: 60, left: 70 };

    const svg = scatterContainer.append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMin meet');

    const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.stars)).nice()
        .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energy) * 1.05]).nice()
        .range([height - margin.top - margin.bottom, 0]);

    const techColors = d3.scaleOrdinal(d3.schemeTableau10)
        .domain(Array.from(new Set(data.map(d => d.screenTech))).sort());

    chart.append('g')
        .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(7).tickFormat(d3.format('~f')))
        .call(g => g.append('text')
            .attr('x', (width - margin.left - margin.right) / 2)
            .attr('y', 44)
            .attr('fill', '#333')
            .style('font-size', '13px')
            .style('font-weight', '600')
            .attr('text-anchor', 'middle')
            .text('Energy rating stars'));

    chart.append('g')
        .call(d3.axisLeft(yScale).ticks(6))
        .call(g => g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -((height - margin.top - margin.bottom) / 2))
            .attr('y', -52)
            .attr('fill', '#333')
            .style('font-size', '13px')
            .style('font-weight', '600')
            .attr('text-anchor', 'middle')
            .text('Labelled energy consumption (kWh/year)'));

    chart.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', d => xScale(d.stars))
        .attr('cy', d => yScale(d.energy))
        .attr('r', 5.5)
        .attr('fill', d => techColors(d.screenTech))
        .attr('opacity', 0.85)
        .append('title')
        .text(d => `${d.brand}: ${d.screenTech}\nStars: ${d.stars}\nEnergy: ${d.energy.toFixed(1)} kWh/year`);

    const legend = svg.append('g')
        .attr('transform', `translate(${width - margin.right - 170}, ${margin.top})`);

    legend.selectAll('g')
        .data(techColors.domain())
        .join('g')
        .attr('transform', (d, i) => `translate(0, ${i * 22})`)
        .call(g => {
            g.append('rect')
                .attr('width', 14)
                .attr('height', 14)
                .attr('fill', d => techColors(d));
            g.append('text')
                .attr('x', 18)
                .attr('y', 11)
                .style('font-size', '12px')
                .style('fill', '#333')
                .text(d => d);
        });
}).catch(error => console.error('Scatter chart error:', error));
