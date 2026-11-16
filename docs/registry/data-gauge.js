RanjDocs.add({
  id: 'gauge',
  name: 'Gauge',
  group: 'Data Display',
  description: 'Radial progress as a full ring, a 270° arc or a half dial. The value counts up as the arc sweeps in.',
  tags: ['new', 'js'],
  keywords: ['radial progress', 'progress ring', 'dial', 'meter', 'score'],
  demos: [
    {
      title: 'Ring, arc and half',
      html: `<div class="demo-gauge-row">
  <div class="chart-card demo-gauge-card"><div class="gauge" data-value="72" data-label="Quota reached" data-color="chart-1"></div><div class="chart-sub">$1.08M of $1.5M</div></div>
  <div class="chart-card demo-gauge-card"><div class="gauge" data-type="arc" data-value="94" data-suffix="" data-label="Performance" data-color="success"></div><div class="chart-sub">Lighthouse, mobile</div></div>
  <div class="chart-card demo-gauge-card"><div class="gauge" data-type="half" data-value="63" data-label="CPU load" data-color="warning" data-size="180"></div><div class="chart-sub">8 cores · us-east-1</div></div>
</div>`,
      css: `.demo-gauge-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; }
.demo-gauge-card { display: grid; justify-items: center; gap: .5rem; min-width: 200px; }`
    },
    {
      title: 'Sizes and colors',
      html: `<div class="demo-gauge-goals">
  <div><div class="gauge" data-size="96" data-value="82" data-color="chart-1"></div><span>Onboarding</span></div>
  <div><div class="gauge" data-size="96" data-value="45" data-color="chart-4"></div><span>Activation</span></div>
  <div><div class="gauge" data-size="96" data-value="91" data-color="chart-3"></div><span>Retention</span></div>
  <div><div class="gauge" data-size="96" data-value="28" data-color="chart-5"></div><span>Expansion</span></div>
  <div><div class="gauge" data-size="64" data-thickness="6" data-value="60" data-color="chart-2" data-text="3/5"></div><span>Tasks</span></div>
</div>`,
      css: `.demo-gauge-goals { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1.5rem 2rem; }
.demo-gauge-goals > div { display: grid; justify-items: center; gap: .4rem; font-size: .8rem; color: var(--muted-fg); }`
    },
    {
      title: 'Live value',
      description: 'Update data-value and the gauge re-renders.',
      html: `<div class="chart-card demo-gauge-card" style="min-width:260px">
  <div class="gauge" data-type="arc" data-size="200" data-value="38" data-label="Disk usage" data-color="info" data-static></div>
  <input type="range" min="0" max="100" value="38" aria-label="Disk usage" style="width:100%;accent-color:var(--primary)">
</div>`,
      css: `.demo-gauge-card { display: grid; justify-items: center; gap: .75rem; }`,
      js: `const g = root.querySelector('.gauge');
root.querySelector('input').oninput = (e) => {
  const v = +e.target.value;
  g.dataset.value = v;
  g.dataset.color = v > 85 ? 'destructive' : v > 65 ? 'warning' : 'info';
};`
    }
  ],
  api: [
    { name: '.gauge', type: 'class', desc: 'Host element (inline-flex).' },
    { name: 'data-value', type: 'attr', default: '0', desc: 'Current value.' },
    { name: 'data-min / data-max', type: 'attr', default: '0 / 100', desc: 'Range.' },
    { name: 'data-type', type: 'attr', default: 'ring', desc: 'ring (360°) | arc (270°) | half (180°, shows min/max).' },
    { name: 'data-size', type: 'attr', default: '160', desc: 'Diameter in px.' },
    { name: 'data-thickness', type: 'attr', default: '8.5% of size', desc: 'Stroke width in px.' },
    { name: 'data-color', type: 'attr', default: 'primary', desc: 'Token name (success, chart-3 …) or CSS color.' },
    { name: 'data-label', type: 'attr', desc: 'Caption under the value.' },
    { name: 'data-text', type: 'attr', desc: 'Replace the center number with custom text.' },
    { name: 'data-suffix', type: 'attr', default: '%', desc: 'Suffix after the value; also data-prefix, data-format, data-decimals.' },
    { name: 'data-static', type: 'attr', desc: 'Skip the sweep / count-up animation.' },
    { name: 'Ranj.chart.gauge(el, opts)', type: 'js', desc: 'Set options and render.' }
  ]
});
