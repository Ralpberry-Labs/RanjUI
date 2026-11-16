RanjDocs.add({
  id: 'sparkline',
  name: 'Sparkline',
  group: 'Data Display',
  description: 'Word-sized trend line, area or bar chart that fills its container. Hover for values; draws itself in when it scrolls into view.',
  tags: ['new', 'js'],
  keywords: ['trend', 'mini chart', 'micro chart', 'inline chart', 'kpi'],
  demos: [
    {
      title: 'KPI cards',
      center: false,
      html: `<div class="demo-sparkline-grid">
  <div class="chart-card">
    <div class="chart-title">Monthly recurring revenue</div>
    <div class="chart-kpi">$48,290 <span class="chart-delta">▲ 12.4%</span></div>
    <span class="sparkline" data-type="area" data-color="success" data-format="currency"
      data-values="31200,32900,32100,34800,36500,35900,38700,40100,41800,43900,46200,48290"
      style="--h: 56px; margin-top: .75rem"></span>
  </div>
  <div class="chart-card">
    <div class="chart-title">Churn rate</div>
    <div class="chart-kpi">2.8% <span class="chart-delta is-down">▼ 0.6 pts</span></div>
    <span class="sparkline" data-type="area" data-color="destructive" data-format="percent" data-decimals="1"
      data-values="4.1,3.9,4.3,3.8,3.6,3.7,3.4,3.3,3.5,3.1,3.0,2.8" style="--h: 56px; margin-top: .75rem"></span>
  </div>
  <div class="chart-card">
    <div class="chart-title">Weekly active users</div>
    <div class="chart-kpi">18.6k <span class="chart-delta">▲ 4.1%</span></div>
    <span class="sparkline" data-type="bar" data-color="primary"
      data-values="12100,13400,12900,14800,15200,14900,16100,16600,17200,16900,17800,18600" style="--h: 56px; margin-top: .75rem"></span>
  </div>
</div>`,
      css: `.demo-sparkline-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; width: 100%; }`
    },
    {
      title: 'Types and colors',
      description: 'Line (default), area and bar. Color takes primary, success, warning, destructive, info, chart-1…chart-8 or any CSS color.',
      center: false,
      html: `<div class="demo-sparkline-types">
  <span class="sparkline" data-values="8,12,9,14,13,18,16,22,19,25,23,29"></span>
  <span class="sparkline" data-type="area" data-color="chart-2" data-values="20,18,24,21,27,25,30,28,26,33,31,36"></span>
  <span class="sparkline" data-type="bar" data-color="chart-4" data-values="5,9,7,12,10,8,14,11,13,9,15,17"></span>
  <span class="sparkline" data-curve="false" data-color="chart-5" data-values="30,26,28,22,24,19,21,16,18,13,15,11"></span>
</div>`,
      css: `.demo-sparkline-types { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.75rem; width: 100%; max-width: 760px; margin: auto; }`
    },
    {
      title: 'Inline in a list',
      description: 'Add .sparkline-inline to sit in a line of text (5.5em × 1.25em).',
      html: `<div class="chart-card demo-sparkline-list">
  <div class="demo-sparkline-row"><span><b>api-gateway</b><small>p95 latency</small></span>
    <span class="sparkline sparkline-inline" data-color="success" data-suffix=" ms" data-values="182,176,170,168,171,160,152,149,151,143"></span><b>143 ms</b></div>
  <div class="demo-sparkline-row"><span><b>checkout-svc</b><small>p95 latency</small></span>
    <span class="sparkline sparkline-inline" data-color="warning" data-suffix=" ms" data-values="210,215,232,228,251,244,262,270,266,284"></span><b>284 ms</b></div>
  <div class="demo-sparkline-row"><span><b>search-index</b><small>p95 latency</small></span>
    <span class="sparkline sparkline-inline" data-color="destructive" data-suffix=" ms" data-values="90,94,92,118,140,133,162,190,214,236"></span><b>236 ms</b></div>
  <div class="demo-sparkline-row"><span><b>auth</b><small>p95 latency</small></span>
    <span class="sparkline sparkline-inline" data-color="success" data-suffix=" ms" data-values="64,66,61,63,60,62,58,57,59,55"></span><b>55 ms</b></div>
</div>`,
      css: `.demo-sparkline-list { width: 100%; max-width: 420px; padding: .5rem 1.1rem; }
.demo-sparkline-row { display: grid; grid-template-columns: 1fr auto 4.5rem; align-items: center; gap: 1rem; padding: .7rem 0; border-bottom: 1px solid var(--border); font-size: .875rem; }
.demo-sparkline-row:last-child { border-bottom: 0; }
.demo-sparkline-row small { display: block; color: var(--muted-fg); font-size: .75rem; }
.demo-sparkline-row > b { text-align: right; font-variant-numeric: tabular-nums; }`
    },
    {
      title: 'Live data',
      description: 'Change data-values (or call Ranj.chart.sparkline) and it re-renders.',
      html: `<div class="chart-card" style="width:100%;max-width:420px">
  <div class="chart-head" style="margin-bottom:.5rem">
    <div><div class="chart-title">Requests / second</div><div class="chart-kpi" data-live-value>1,204</div></div>
    <span class="chart-delta" style="background:var(--info-soft);color:var(--info-soft-fg)">● Live</span>
  </div>
  <span class="sparkline" data-live data-type="area" data-color="info" data-dot data-tooltip="false" style="--h: 72px"
    data-values="1100,1180,1150,1220,1190,1260,1210,1240,1300,1270,1230,1204"></span>
</div>`,
      js: `const s = root.querySelector('[data-live]'), out = root.querySelector('[data-live-value]');
const t = setInterval(() => {
  const v = s.dataset.values.split(',').map(Number);
  const next = Math.max(800, Math.round(v[v.length - 1] + (Math.random() - .48) * 90));
  v.push(next); v.shift();
  s.dataset.values = v.join(',');
  out.textContent = next.toLocaleString();
}, 1200);
return () => clearInterval(t);`
    }
  ],
  api: [
    { name: '.sparkline', type: 'class', desc: 'Block-level, 100% wide, height from --h.' },
    { name: '.sparkline-inline', type: 'class', desc: 'Inline size for use inside text or table cells.' },
    { name: 'data-values', type: 'attr', desc: 'Comma-separated numbers, oldest first.' },
    { name: 'data-type', type: 'attr', default: 'line', desc: 'line | area | bar.' },
    { name: 'data-color', type: 'attr', default: 'primary', desc: 'primary, success, warning, destructive, info, chart-1…8 or any CSS color.' },
    { name: 'data-curve', type: 'attr', default: 'true', desc: 'Smooth monotone curve; false for straight segments.' },
    { name: 'data-dot', type: 'attr', default: 'true', desc: 'Dot on the last point (line/area).' },
    { name: 'data-min / data-max', type: 'attr', desc: 'Fix the vertical range instead of fitting the data.' },
    { name: 'data-stroke', type: 'attr', default: '1.75', desc: 'Line width in px.' },
    { name: 'data-labels', type: 'attr', desc: 'Optional comma-separated labels shown in the tooltip.' },
    { name: 'data-tooltip', type: 'attr', default: 'true', desc: 'Hover tooltip with the value.' },
    { name: 'data-format', type: 'attr', desc: 'number | currency | percent | compact (also data-prefix, data-suffix, data-decimals, data-currency).' },
    { name: 'data-static', type: 'attr', desc: 'Skip the draw-in animation.' },
    { name: '--h', type: 'var', default: '40px', desc: 'Height.' },
    { name: '--chart-1 … --chart-8', type: 'var', desc: 'Categorical palette derived from --hue (shared by all charts).' },
    { name: 'Ranj.chart.sparkline(el, opts)', type: 'js', desc: 'Set options (same names as the attributes, arrays allowed) and render.' }
  ]
});
