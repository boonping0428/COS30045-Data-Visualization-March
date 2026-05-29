const donutContainer = d3.select('#donut-viz');
const parseNumericDonut = value => {
    const cleaned = (value || '').toString().replace(/"/g, '').trim();
    return cleaned === '' || cleaned === '-' ? NaN : +cleaned;
};

d3.csv('data/data.csv', d => ({
    tech: d.Screen_Tech,
    energy: parseNumericDonut(d['Labelled energy consumption (kWh/year)'])
})).then(raw => {
    const data = raw.filter(d => d.tech && d.energy > 0);
    const totals = Array.from(d3.rollup(data, v => d3.sum(v, d => d.energy), d => d.tech),
        ([tech, total]) => ({ tech, total }))
        .sort((a, b) => b.total - a.total);

    const width = 760;
    const height = 520;
    const radius = Math.min(width, height) / 2 - 45;

    const svg = donutContainer.append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMin meet');

    const chart = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeTableau10).domain(totals.map(d => d.tech));
    const pie = d3.pie().value(d => d.total).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.55).outerRadius(radius);
    const labelArc = d3.arc().innerRadius(radius * 0.72).outerRadius(radius * 0.72);

    const arcs = chart.selectAll('path')
        .data(pie(totals))
        .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.tech))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .append('title')
        .text(d => `${d.data.tech}: ${Math.round(d.data.total)} kWh/year`);

    chart.selectAll('text')
        .data(pie(totals))
        .join('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('fill', '#222')
        .text(d => d.data.tech.split(' ')[0]);

    const legend = svg.append('g')
        .attr('transform', `translate(10, 18)`);

    legend.selectAll('g')
        .data(totals)
        .join('g')
        .attr('transform', (d, i) => `translate(0, ${i * 22})`)
        .call(g => {
            g.append('rect')
                .attr('width', 14)
                .attr('height', 14)
                .attr('fill', d => color(d.tech));
            g.append('text')
                .attr('x', 18)
                .attr('y', 11)
                .style('font-size', '12px')
                .style('fill', '#333')
                .text(d => `${d.tech} (${Math.round(d.total)} kWh)`);
        });
}).catch(error => console.error('Donut chart error:', error));
