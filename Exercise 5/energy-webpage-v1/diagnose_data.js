const fs = require('fs');
const text = fs.readFileSync('data/data.csv', 'utf8');
const rows = text.split(/\r?\n/);
const header = rows[0].split(',');
const idx = name => header.findIndex(h => h === name);
console.log('Screen_Tech index', idx('Screen_Tech'));
console.log('Energy index', idx('Labelled energy consumption (kWh/year)'));
console.log('Screen size index', idx('screensize'));
console.log('Star2 index', idx('Star2'));
const data = rows.slice(1).map(r => {
  const cols = r.split(/,(?=(?:(?:[^\"]*\"){2})*[^\"]*$)/);
  return {
    tech: cols[idx('Screen_Tech')]?.replace(/"/g, '').trim(),
    energy: parseFloat(cols[idx('Labelled energy consumption (kWh/year)')]?.replace(/"/g, '')),
    size: parseFloat(cols[idx('screensize')]?.replace(/"/g, ''))
  };
}).filter(d => d.tech);
const byTech = {};
const by55 = {};
data.forEach(d => {
  if (!Number.isNaN(d.energy) && d.energy > 0) {
    byTech[d.tech] = (byTech[d.tech] || 0) + d.energy;
  }
  if (!Number.isNaN(d.size) && d.size >= 136 && d.size <= 142 && !Number.isNaN(d.energy) && d.energy > 0) {
    by55[d.tech] = by55[d.tech] || { sum: 0, count: 0 };
    by55[d.tech].sum += d.energy;
    by55[d.tech].count += 1;
  }
});
console.log('byTech keys', Object.keys(byTech).slice(0,20));
console.log('by55', Object.entries(by55));
