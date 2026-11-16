(function () {
var I = {
  dollar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 6.5c0-1.9-2.2-3.5-5-3.5s-5 1.6-5 3.5S9.2 10 12 10s5 1.6 5 3.5S14.8 17 12 17s-5-1.6-5-3.5"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 3.1a4 4 0 0 1 0 7.8M22 21a7 7 0 0 0-4-6.3"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6"/></svg>',
  pulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>'
};
RanjDocs.add({
  id: 'stat',
  name: 'Stat',
  group: 'Data Display',
  description: 'KPI cards for dashboards: label, big tabular value, colored delta, icon, and a slot for a sparkline, progress toward a target or a share bar. <code>.stat-grid</code> lays them out responsively, or joins them into one divided card.',
  tags: ['new'],
  keywords: ['kpi', 'metric', 'stats', 'number card', 'dashboard', 'statistic', 'stat grid'],
  demos: [
    {
      title: 'KPI cards with sparklines',
      center: false,
      html: `<div class="stat-grid">
  <div class="stat">
    <div class="stat-head"><span class="stat-label">Revenue</span><span class="stat-icon">${I.dollar}</span></div>
    <div class="stat-value">$184,920</div>
    <div class="stat-foot"><span class="stat-delta is-up">12.4%</span><span class="stat-help">vs. October</span></div>
    <div class="stat-chart"><span class="sparkline" data-type="area" data-color="success" data-format="currency" data-values="121400,128900,126300,139800,144100,141900,152800,158300,163900,171200,176800,184920"></span></div>
  </div>
  <div class="stat">
    <div class="stat-head"><span class="stat-label">Active subscribers</span><span class="stat-icon is-info">${I.users}</span></div>
    <div class="stat-value">12,847</div>
    <div class="stat-foot"><span class="stat-delta is-up">3.1%</span><span class="stat-help">+386 this month</span></div>
    <div class="stat-chart"><span class="sparkline" data-type="area" data-color="info" data-values="10920,11080,11240,11190,11420,11610,11830,12020,12190,12340,12461,12847"></span></div>
  </div>
  <div class="stat">
    <div class="stat-head"><span class="stat-label">Churn</span><span class="stat-icon is-danger">${I.pulse}</span></div>
    <div class="stat-value">2.41<span class="stat-unit">%</span></div>
    <div class="stat-foot"><span class="stat-delta is-down is-inverse">0.38 pts</span><span class="stat-help">lower is better</span></div>
    <div class="stat-chart"><span class="sparkline" data-type="line" data-color="destructive" data-format="percent" data-decimals="2" data-values="3.4,3.2,3.3,3.0,2.95,3.1,2.86,2.79,2.82,2.66,2.79,2.41"></span></div>
  </div>
  <div class="stat">
    <div class="stat-head"><span class="stat-label">Avg. order value</span><span class="stat-icon is-warning">${I.cart}</span></div>
    <div class="stat-value">$86.30</div>
    <div class="stat-foot"><span class="stat-delta is-flat">0.0%</span><span class="stat-help">flat week over week</span></div>
    <div class="stat-chart"><span class="sparkline" data-type="bar" data-color="warning" data-format="currency" data-values="84,88,85,87,86,89,83,86,87,85,86,86.3"></span></div>
  </div>
</div>`
    },
    {
      title: 'Divided grid',
      description: '<code>.stat-grid-divided</code> joins the cells into one card. Use buttons with <code>.is-active</code> to make it a metric switcher.',
      center: false,
      html: `<div class="stat-grid stat-grid-divided" style="--stat-min: 11rem" role="tablist">
  <button class="stat is-active" role="tab" aria-selected="true"><span class="stat-label">Visitors</span><span class="stat-value">48.2k</span><span class="stat-delta stat-delta-pill is-up">18%</span></button>
  <button class="stat" role="tab" aria-selected="false"><span class="stat-label">Page views</span><span class="stat-value">213k</span><span class="stat-delta stat-delta-pill is-up">9%</span></button>
  <button class="stat" role="tab" aria-selected="false"><span class="stat-label">Bounce rate</span><span class="stat-value">38.6%</span><span class="stat-delta stat-delta-pill is-down is-inverse">4%</span></button>
  <button class="stat" role="tab" aria-selected="false"><span class="stat-label">Visit duration</span><span class="stat-value">2m 41s</span><span class="stat-delta stat-delta-pill is-down">7%</span></button>
</div>`,
      js: `const tabs = [...root.querySelectorAll('.stat')];
tabs.forEach(t => t.addEventListener('click', () => tabs.forEach(x => { x.classList.toggle('is-active', x === t); x.setAttribute('aria-selected', x === t); })));`
    },
    {
      title: 'Targets and breakdowns',
      center: false,
      html: `<div class="stat-grid" style="--stat-min: 15rem">
  <div class="stat stat-accent">
    <div class="stat-head"><span class="stat-label">Q4 sales quota</span><span class="stat-delta stat-delta-pill is-up">On track</span></div>
    <div class="stat-value">$1.84M <span class="stat-of">of $2.5M</span></div>
    <div class="stat-progress">
      <div class="stat-progress-bar"><span style="--value: 73.6%"></span></div>
      <div class="stat-progress-meta"><span>73.6% attained</span><span>45 days left</span></div>
    </div>
  </div>
  <div class="stat">
    <div class="stat-head"><span class="stat-label">Traffic by source</span></div>
    <div class="stat-value">96,410 <span class="stat-of">sessions</span></div>
    <div class="stat-split">
      <span style="--v: 46; --c: var(--chart-1, var(--primary))"></span>
      <span style="--v: 28; --c: var(--chart-2, var(--info))"></span>
      <span style="--v: 17; --c: var(--chart-3, var(--success))"></span>
      <span style="--v: 9; --c: var(--chart-4, var(--warning))"></span>
    </div>
    <div class="stat-legend">
      <span style="--c: var(--chart-1, var(--primary))">Organic <b>46%</b></span>
      <span style="--c: var(--chart-2, var(--info))">Direct <b>28%</b></span>
      <span style="--c: var(--chart-3, var(--success))">Social <b>17%</b></span>
      <span style="--c: var(--chart-4, var(--warning))">Email <b>9%</b></span>
    </div>
  </div>
  <div class="stat stat-primary stat-glow">
    <div class="stat-head"><span class="stat-label">API requests today</span><span class="stat-icon">${I.zap}</span></div>
    <div class="stat-value">3.92M</div>
    <div class="stat-foot"><span class="stat-delta stat-delta-pill is-up">21%</span><span class="stat-help">99.98% success</span></div>
  </div>
</div>`
    },
    {
      title: 'Side chart and plain',
      description: '<code>.stat-side</code> puts the chart next to the number; <code>.stat-plain</code> drops the card for use inside your own layouts.',
      center: false,
      html: `<div class="stat-grid" style="--stat-min: 16rem">
  <div class="stat">
    <span class="stat-label">Net revenue retention</span>
    <div class="stat-side">
      <div><div class="stat-value">118%</div><div class="stat-foot"><span class="stat-delta is-up">6 pts</span><span class="stat-help">YoY</span></div></div>
      <div class="stat-chart"><span class="sparkline" data-type="area" data-color="chart-2" data-values="104,106,105,109,111,110,113,114,116,118" style="--h: 52px"></span></div>
    </div>
  </div>
  <div class="stat">
    <span class="stat-label">Uptime, last 90 days</span>
    <div class="stat-side">
      <div><div class="stat-value">99.982%</div><div class="stat-foot"><span class="stat-help">2 incidents · 23 min</span></div></div>
      <div class="stat-chart"><span class="sparkline" data-type="bar" data-color="success" data-values="100,100,99.9,100,100,100,99.4,100,100,100,100,99.95" data-min="98" style="--h: 52px"></span></div>
    </div>
  </div>
  <div class="stat stat-plain">
    <span class="stat-label">Customers</span>
    <div class="stat-value">2,318 <span class="stat-delta stat-delta-pill is-up">142</span></div>
    <span class="stat-help" style="font-size:.8125rem">Across 41 countries</span>
  </div>
</div>`
    }
  ],
  api: [
    { name: '.stat', type: 'class', desc: 'KPI card. Children: .stat-head, .stat-label, .stat-icon, .stat-value, .stat-unit, .stat-of, .stat-foot, .stat-help.' },
    { name: '.stat-delta.is-up|is-down|is-flat', type: 'class', desc: 'Colored change with an arrow. Add .is-inverse when lower is better (churn, latency). .stat-delta-pill adds a tinted background; .no-icon hides the arrow.' },
    { name: '.stat-icon.is-success|warning|danger|info|muted', type: 'class', desc: 'Tinted icon tile (primary by default).' },
    { name: '.stat-chart / .stat-chart-bleed / .stat-side', type: 'class', desc: 'Slot for a .sparkline (see Sparkline). Bleed runs it edge to edge; side places it next to the value.' },
    { name: '.stat-progress / .stat-progress-bar / .stat-progress-meta', type: 'class', desc: 'Progress toward a target. Set --value on the inner span.' },
    { name: '.stat-split / .stat-legend', type: 'class', desc: 'Segmented share bar and legend. Set --v (weight) and --c (color) on each span.' },
    { name: '.stat-accent / .stat-glow / .stat-primary / .stat-plain', type: 'class', desc: 'Gradient top edge, soft corner glow, solid brand card, no card chrome.' },
    { name: '.stat-grid', type: 'class', desc: 'Responsive auto-fit grid. --stat-min sets the minimum card width (14rem).' },
    { name: '.stat-grid-divided', type: 'class', desc: 'One card with divided cells. .stat.is-active highlights a cell.' },
    { name: '--stat-pad', type: 'var', default: '1.25rem', desc: 'Card padding.' }
  ]
});
})();
