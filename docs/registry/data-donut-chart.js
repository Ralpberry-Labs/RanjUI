RanjDocs.add({
  id: 'donut-chart',
  name: 'Donut & Pie Chart',
  group: 'Data Display',
  description: 'Donut or pie chart with an interactive legend and a center label that follows the hovered slice.',
  tags: ['new', 'js'],
  keywords: ['pie chart', 'ring chart', 'share', 'breakdown', 'composition'],
  demos: [
    {
      title: 'Revenue by region',
      center: false,
      html: `<div class="chart-card" style="max-width:620px;margin:auto">
  <div class="chart-head"><div><div class="chart-title">Revenue by region</div><div class="chart-sub">Q3 2026 · hover a slice or a row</div></div></div>
  <div class="donut-chart" data-format="currency" data-label="Total revenue"
    data-labels="North America,Europe,Asia Pacific,Latin America,Middle East"
    data-values="482300,318900,204600,86400,41200"></div>
</div>`
    },
    {
      title: 'Pie with legend below',
      center: false,
      html: `<div class="chart-card" style="max-width:340px;margin:auto">
  <div class="chart-title" style="margin-bottom:1rem">Traffic by browser</div>
  <div class="donut-chart" data-pie data-size="180" data-legend="bottom" data-suffix="%"
    data-labels="Chrome,Safari,Edge,Firefox,Other" data-values="64.2,19.8,7.1,5.4,3.5"
    data-colors="chart-1,chart-2,chart-3,chart-4,muted-fg"></div>
</div>`
    },
    {
      title: 'Compact, no legend',
      html: `<div class="demo-donut-row">
  <div class="demo-donut-item"><div class="donut-chart" data-size="120" data-thickness="12" data-legend="none" data-label="of 2 TB" data-value="68%" data-labels="Used,Free" data-values="1360,640" data-colors="chart-1,border" data-suffix=" GB"></div><b>Storage</b></div>
  <div class="demo-donut-item"><div class="donut-chart" data-size="120" data-thickness="12" data-legend="none" data-label="tickets" data-labels="Resolved,Pending,Escalated" data-values="412,86,23" data-colors="success,warning,destructive"></div><b>Support</b></div>
  <div class="demo-donut-item"><div class="donut-chart" data-size="120" data-thickness="12" data-legend="none" data-label="seats" data-labels="Active,Invited,Idle" data-values="148,22,30" data-colors="chart-3,chart-4,chart-7"></div><b>Licenses</b></div>
</div>`,
      css: `.demo-donut-row { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; }
.demo-donut-item { display: grid; justify-items: center; gap: .6rem; font-size: .85rem; }
.demo-donut-item .donut-chart { width: 120px; }`
    }
  ],
  api: [
    { name: '.donut-chart', type: 'class', desc: 'Host element.' },
    { name: 'data-values', type: 'attr', desc: 'Comma-separated slice values.' },
    { name: 'data-labels', type: 'attr', desc: 'Comma-separated slice names.' },
    { name: 'data-colors', type: 'attr', desc: 'Optional comma-separated colors (token names or CSS); defaults to --chart-1…8.' },
    { name: 'data-pie', type: 'attr', default: 'false', desc: 'Render a full pie instead of a ring.' },
    { name: 'data-size', type: 'attr', default: '200', desc: 'Diameter in px (shrinks to fit).' },
    { name: 'data-thickness', type: 'attr', default: '12% of size', desc: 'Ring thickness in px.' },
    { name: 'data-label', type: 'attr', default: 'Total', desc: 'Caption under the center value.' },
    { name: 'data-value', type: 'attr', desc: 'Override the center value text (defaults to the formatted total).' },
    { name: 'data-legend', type: 'attr', default: 'auto', desc: 'right | bottom | none; auto picks right when there is room.' },
    { name: 'data-gap', type: 'attr', default: '0.7', desc: 'Gap between slices, in percent of the circle.' },
    { name: 'data-format', type: 'attr', desc: 'number | currency | percent | compact, plus prefix/suffix/decimals.' },
    { name: 'Ranj.chart.donut(el, opts)', type: 'js', desc: 'Set options and render.' }
  ]
});
