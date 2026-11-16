(function () {
  var up = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';
  RanjDocs.add({
    id: 'stats-block',
    name: 'Stats Section',
    group: 'Blocks',
    description: 'Big-number sections that prove traction: a bordered metric strip, a copy-plus-stats split and a dark gradient band.',
    tags: ['new'],
    keywords: ['metrics', 'numbers', 'kpi section', 'traction'],
    demos: [
      {
        title: 'Metric strip',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head">
      <h2 class="block-title">Trusted at serious scale</h2>
      <p class="block-lead">Numbers from the last 30 days across every Northwind region.</p>
    </div>
    <div class="block-stats">
      <div class="block-stat"><div class="block-stat-value">4.2<small>B</small></div><div class="block-stat-label">Requests served</div><div class="block-stat-desc">Peak of 310k per second on Black Friday.</div></div>
      <div class="block-stat"><div class="block-stat-value">99.99<small>%</small></div><div class="block-stat-label">Uptime</div><div class="block-stat-desc">Backed by a financial SLA on Team.</div></div>
      <div class="block-stat"><div class="block-stat-value">12<small>ms</small></div><div class="block-stat-label">Median latency</div><div class="block-stat-desc">Measured from 42 edge locations.</div></div>
      <div class="block-stat"><div class="block-stat-value">18<small>k</small></div><div class="block-stat-label">Teams shipping</div><div class="block-stat-desc">From two-person startups to the Fortune 500.</div></div>
    </div>
  </div>
</section>`
      },
      {
        title: 'Split with copy',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container block-split">
    <div class="block-head block-head-start" style="margin-bottom:0">
      <span class="block-eyebrow">Impact</span>
      <h2 class="block-title">Results our customers see in the first quarter</h2>
      <p class="block-lead">We surveyed 1,240 teams six months after they migrated. The short version: less waiting, more shipping.</p>
    </div>
    <div class="block-stats-plain">
      <div class="block-stat"><div class="block-stat-value">3.4×</div><div class="block-stat-label">More deploys per week</div><span class="block-stat-delta">${up} from 9 to 31</span></div>
      <div class="block-stat"><div class="block-stat-value">-47<small>%</small></div><div class="block-stat-label">Infrastructure spend</div><span class="block-stat-delta">${up} $18k saved / mo</span></div>
      <div class="block-stat"><div class="block-stat-value">8<small>min</small></div><div class="block-stat-label">Mean time to recovery</div><div class="block-stat-desc">Down from 2.5 hours.</div></div>
      <div class="block-stat"><div class="block-stat-value">72</div><div class="block-stat-label">Net promoter score</div><div class="block-stat-desc">Industry average is 31.</div></div>
    </div>
  </div>
</section>`
      },
      {
        title: 'Dark band',
        description: 'Fixed dark art that looks the same in both themes.',
        pad: false, center: false,
        html: `<section class="block block-band">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow">2026 in numbers</span>
      <h2 class="block-title">A record year, thanks to you</h2>
    </div>
    <div class="block-stats">
      <div class="block-stat"><div class="block-stat-value">$48<small>M</small></div><div class="block-stat-label">ARR</div><div class="block-stat-desc">Up 212% year over year.</div></div>
      <div class="block-stat"><div class="block-stat-value">190</div><div class="block-stat-label">Countries</div><div class="block-stat-desc">With paying customers.</div></div>
      <div class="block-stat"><div class="block-stat-value">1.6<small>M</small></div><div class="block-stat-label">Developers</div><div class="block-stat-desc">Signed up since launch.</div></div>
      <div class="block-stat"><div class="block-stat-value">4.9<small>/5</small></div><div class="block-stat-label">G2 rating</div><div class="block-stat-desc">From 3,800 reviews.</div></div>
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-stats', type: 'class', desc: 'Bordered 4-up strip with dividers; 2×2 under 760px.' },
      { name: '.block-stat', type: 'class', desc: 'One metric: .block-stat-value (with optional <small> unit), .block-stat-label, .block-stat-desc, .block-stat-delta.' },
      { name: '.block-stats-plain', type: 'class', desc: 'Borderless 2-column stats with an accent rule.' },
      { name: '.block-split', type: 'class', desc: 'Two-column copy + content layout.' },
      { name: '.block-band', type: 'class', desc: 'Dark gradient section (on .block).' }
    ]
  });
})();
