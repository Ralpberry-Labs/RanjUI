RanjDocs.add({
  id: 'line-chart',
  name: 'Line & Area Chart',
  group: 'Data Display',
  description: 'Smooth line or gradient area chart with axes, grid, a crosshair and a multi-series tooltip. Arrow keys step through points.',
  tags: ['new', 'js'],
  keywords: ['area chart', 'time series', 'trend', 'graph', 'plot'],
  demos: [
    {
      title: 'Area',
      center: false,
      html: `<div class="chart-card" style="max-width:820px;margin:auto">
  <div class="chart-head">
    <div><div class="chart-title">Monthly recurring revenue</div><div class="chart-kpi">$212,430 <span class="chart-delta">▲ 6.8% MoM</span></div></div>
    <div class="chart-sub">Dec 2025 – Nov 2026</div>
  </div>
  <div class="line-chart" data-type="area" data-format="currency" data-name="MRR" aria-label="MRR over the last 12 months"
    data-labels="Dec,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov"
    data-values="118400,124900,131200,129800,141300,152600,158900,171200,176400,189300,198900,212430"></div>
</div>`
    },
    {
      title: 'Multiple series',
      center: false,
      html: `<div class="chart-card" style="max-width:820px;margin:auto">
  <div class="chart-head"><div><div class="chart-title">Sessions by channel</div><div class="chart-kpi">284,912</div></div><div class="chart-sub">Last 14 days</div></div>
  <div class="line-chart" data-height="280"
    data-labels="Nov 3,Nov 4,Nov 5,Nov 6,Nov 7,Nov 8,Nov 9,Nov 10,Nov 11,Nov 12,Nov 13,Nov 14,Nov 15,Nov 16"
    data-series='[{"name":"Organic","values":[9800,10400,11200,10900,11800,8400,7900,11900,12600,13100,12800,13900,9600,9200]},{"name":"Paid","values":[6200,6900,7400,7100,7800,5100,4800,6600,7100,7500,8200,8800,6300,6000]},{"name":"Referral","values":[2100,2300,2200,2600,2900,1800,1700,2800,3100,3400,3300,3700,2500,2400]}]'></div>
</div>`
    },
    {
      title: 'Stacked areas, compact',
      description: 'Hide axes with data-y-axis="false"; fit the y range with data-zero="false".',
      center: false,
      html: `<div class="demo-line-chart-grid">
  <div class="chart-card">
    <div class="chart-title">CPU utilisation</div><div class="chart-kpi" style="font-size:1.35rem">63%</div>
    <div class="line-chart" data-type="area" data-color="chart-3" data-height="120" data-y-axis="false" data-x-axis="false" data-grid="false" data-suffix="%"
      data-values="41,44,39,52,58,55,61,57,66,72,64,59,63"></div>
  </div>
  <div class="chart-card">
    <div class="chart-title">p95 latency</div><div class="chart-kpi" style="font-size:1.35rem">184 ms</div>
    <div class="line-chart" data-type="area" data-color="chart-5" data-zero="false" data-height="120" data-y-axis="false" data-x-axis="false" data-grid="false" data-suffix=" ms"
      data-values="210,204,198,221,236,212,199,191,188,195,190,186,184"></div>
  </div>
</div>`,
      css: `.demo-line-chart-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; width: 100%; max-width: 820px; margin: auto; }`
    }
  ],
  api: [
    { name: '.line-chart', type: 'class', desc: 'Host element; fills its container width.' },
    { name: 'data-labels', type: 'attr', desc: 'Comma-separated x-axis labels.' },
    { name: 'data-values', type: 'attr', desc: 'Single series as comma-separated numbers.' },
    { name: 'data-series', type: 'attr', desc: 'JSON array of { name, values, color }.' },
    { name: 'data-type', type: 'attr', default: 'line', desc: 'line | area (gradient fill).' },
    { name: 'data-curve', type: 'attr', default: 'true', desc: 'Monotone smoothing; false for straight segments.' },
    { name: 'data-dots', type: 'attr', default: 'false', desc: 'Draw a dot on every point.' },
    { name: 'data-zero', type: 'attr', default: 'true', desc: 'Start the y axis at zero; false fits the data range.' },
    { name: 'data-height', type: 'attr', default: '260', desc: 'Height in px.' },
    { name: 'data-stroke', type: 'attr', default: '2', desc: 'Line width.' },
    { name: 'data-format', type: 'attr', desc: 'number | currency | percent | compact, plus data-prefix, data-suffix, data-decimals.' },
    { name: 'data-legend / data-y-axis / data-x-axis / data-grid', type: 'attr', desc: 'Toggle chrome.' },
    { name: 'Ranj.chart.line(el, opts)', type: 'js', desc: 'Set options and render.' }
  ]
});
