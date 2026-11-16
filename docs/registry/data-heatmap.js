RanjDocs.add({
  id: 'heatmap',
  name: 'Heatmap Calendar',
  group: 'Data Display',
  description: 'GitHub-style contribution calendar: one cell per day, five intensity levels, month and weekday labels, tooltips. Scrolls horizontally on small screens.',
  tags: ['new', 'js'],
  keywords: ['contribution graph', 'calendar heatmap', 'activity', 'streak'],
  demos: [
    {
      title: 'Contributions',
      description: 'Without data-values a deterministic sample is generated from data-seed.',
      center: false,
      html: `<div class="chart-card" style="max-width:860px;margin:auto">
  <div class="chart-head"><div><div class="chart-title">Activity</div><div class="chart-sub">Commits, reviews and merged pull requests</div></div></div>
  <div class="heatmap" data-seed="42" data-end="2026-11-14"></div>
</div>`
    },
    {
      title: 'Custom color and range',
      center: false,
      html: `<div class="demo-heatmap-grid">
  <div class="chart-card">
    <div class="chart-title" style="margin-bottom:.75rem">Production deploys · last 26 weeks</div>
    <div class="heatmap" data-weeks="26" data-seed="9" data-end="2026-11-14" data-color="success" data-label="deploys"></div>
  </div>
  <div class="chart-card">
    <div class="chart-title" style="margin-bottom:.75rem">Incidents · last 26 weeks</div>
    <div class="heatmap" data-weeks="26" data-seed="3" data-end="2026-11-14" data-color="destructive" data-label="incidents" data-summary="true"></div>
  </div>
</div>`,
      css: `.demo-heatmap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(330px, 1fr)); gap: 1rem; width: 100%; }
@media (max-width: 420px) { .demo-heatmap-grid { grid-template-columns: 1fr; } }`
    },
    {
      title: 'From your data',
      description: 'data-values is one number per day, oldest first, ending on data-end (default: today).',
      center: false,
      html: `<div class="chart-card" style="max-width:520px;margin:auto">
  <div class="chart-title" style="margin-bottom:.75rem">Workouts</div>
  <div class="heatmap" data-weeks="12" data-cell="14" data-color="chart-6" data-label="workouts" data-end="2026-11-14" data-legend="false"
    data-values="1,0,1,0,1,1,0,1,0,1,1,0,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,0,1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1,1,0,1,0,1,2,0,1,1,1,0,0,1,2,1,0,1,1,0,1,1,1,0,2,1,0,1,1,1,0,1,2,1,1,0,1"></div>
</div>`
    }
  ],
  api: [
    { name: '.heatmap', type: 'class', desc: 'Host element.' },
    { name: 'data-values', type: 'attr', desc: 'One count per day, oldest first. The last value lands on data-end.' },
    { name: 'data-end', type: 'attr', default: 'today', desc: 'Last day shown (YYYY-MM-DD).' },
    { name: 'data-weeks', type: 'attr', default: '53', desc: 'Number of week columns.' },
    { name: 'data-seed', type: 'attr', desc: 'Generate deterministic sample data when no values are given.' },
    { name: 'data-color', type: 'attr', default: 'primary', desc: 'Base color for the intensity scale.' },
    { name: 'data-label', type: 'attr', default: 'contributions', desc: 'Unit used in tooltip and summary.' },
    { name: 'data-cell', type: 'attr', default: 'auto (9–15px)', desc: 'Cell size in px.' },
    { name: 'data-legend / data-summary', type: 'attr', default: 'true', desc: 'Show the Less–More legend and the total line.' },
    { name: 'Ranj.chart.heatmap(el, opts)', type: 'js', desc: 'Set options and render.' }
  ]
});
