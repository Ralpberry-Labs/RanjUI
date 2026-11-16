RanjDocs.add({
  id: 'bar-chart',
  name: 'Bar Chart',
  group: 'Data Display',
  description: 'Vertical bar chart in SVG with grid, axes, grouped or stacked series, hover tooltip and a grow-in animation.',
  tags: ['new', 'js'],
  keywords: ['column chart', 'histogram', 'stacked bar', 'grouped bar', 'graph'],
  demos: [
    {
      title: 'Monthly revenue',
      center: false,
      html: `<div class="chart-card" style="max-width:820px;margin:auto">
  <div class="chart-head">
    <div><div class="chart-title">Net revenue · 2026</div><div class="chart-kpi">$1,284,630 <span class="chart-delta">▲ 18.2%</span></div></div>
    <div class="chart-sub">Jan – Dec, USD</div>
  </div>
  <div class="bar-chart" data-format="currency" data-name="Revenue" aria-label="Net revenue by month"
    data-labels="Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec"
    data-values="78400,81200,92600,88100,97300,104800,99600,112400,118900,121300,138200,151830"></div>
</div>`
    },
    {
      title: 'Grouped series',
      description: 'Pass data-series as JSON: [{ "name", "values", "color" }]. A legend appears automatically.',
      center: false,
      html: `<div class="chart-card" style="max-width:820px;margin:auto">
  <div class="chart-head"><div><div class="chart-title">New signups by quarter</div><div class="chart-kpi">9,412</div></div></div>
  <div class="bar-chart" data-height="240" data-labels="Q1,Q2,Q3,Q4"
    data-series='[{"name":"2025","values":[1420,1690,1810,2050],"color":"chart-7"},{"name":"2026","values":[1980,2240,2390,2802],"color":"chart-1"}]'></div>
</div>`
    },
    {
      title: 'Stacked',
      center: false,
      html: `<div class="chart-card" style="max-width:820px;margin:auto">
  <div class="chart-head"><div><div class="chart-title">MRR by plan</div><div class="chart-kpi">$212.4k</div></div><div class="chart-sub">Last 8 months</div></div>
  <div class="bar-chart" data-stacked data-format="currency" data-height="260" data-radius="5"
    data-labels="Apr,May,Jun,Jul,Aug,Sep,Oct,Nov"
    data-series='[{"name":"Starter","values":[22100,23400,24200,25900,26300,27800,28400,29100]},{"name":"Pro","values":[61200,64800,68900,71300,75600,79200,83400,88600]},{"name":"Enterprise","values":[58000,61000,61000,72000,76000,81000,89000,94700]}]'></div>
</div>`
    },
    {
      title: 'Imperative API',
      description: 'Ranj.chart.bar(el, opts) sets the data and re-renders; values accept arrays.',
      center: false,
      html: `<div class="chart-card" style="max-width:640px;margin:auto">
  <div class="chart-head">
    <div><div class="chart-title">Orders by weekday</div><div class="chart-sub">Click to load another week</div></div>
    <button type="button" class="demo-bar-chart-btn" data-shuffle>Next week →</button>
  </div>
  <div data-orders></div>
</div>`,
      css: `.demo-bar-chart-btn { font-size: .8rem; font-weight: 500; padding: .4rem .8rem; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--fg); }
.demo-bar-chart-btn:hover { background: var(--muted); }`,
      js: `const el = root.querySelector('[data-orders]');
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const week = () => days.map((d, i) => Math.round((i > 4 ? 340 : 520) + Math.random() * 260));
Ranj.chart.bar(el, { labels: days, values: week(), color: 'chart-3', height: 220, name: 'Orders' });
root.querySelector('[data-shuffle]').onclick = () => Ranj.chart.bar(el, { values: week() });`
    }
  ],
  api: [
    { name: '.bar-chart', type: 'class', desc: 'Host element; fills its container width.' },
    { name: 'data-labels', type: 'attr', desc: 'Comma-separated x-axis labels.' },
    { name: 'data-values', type: 'attr', desc: 'Single series as comma-separated numbers.' },
    { name: 'data-series', type: 'attr', desc: 'JSON array of { name, values, color } for multiple series.' },
    { name: 'data-stacked', type: 'attr', default: 'false', desc: 'Stack series instead of grouping them.' },
    { name: 'data-height', type: 'attr', default: '260', desc: 'Height in px.' },
    { name: 'data-format', type: 'attr', desc: 'number | currency | percent | compact, plus data-currency, data-prefix, data-suffix, data-decimals.' },
    { name: 'data-radius', type: 'attr', default: '4', desc: 'Top corner radius.' },
    { name: 'data-legend', type: 'attr', default: 'auto', desc: 'true | false; auto shows it for 2+ series.' },
    { name: 'data-y-axis / data-x-axis / data-grid', type: 'attr', default: 'true', desc: 'Toggle axes and grid lines.' },
    { name: 'data-y-ticks', type: 'attr', default: '5', desc: 'Approximate number of y ticks (nice-rounded).' },
    { name: 'data-color', type: 'attr', desc: 'Color for a single series (token name or CSS color).' },
    { name: 'data-static', type: 'attr', desc: 'Skip the grow-in animation.' },
    { name: 'Ranj.chart.bar(el, opts)', type: 'js', desc: 'Same options as attributes (camelCase), arrays/objects allowed. Returns el.' },
    { name: 'Ranj.chart.format(value, opts)', type: 'js', desc: 'The number formatter used by all charts.' }
  ]
});
