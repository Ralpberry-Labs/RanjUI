(function () {
  var I = RB.ic;
  var check = I('check');
  RanjDocs.add({
    id: 'card',
    name: 'Card',
    group: 'Base',
    description: 'A surface for grouped content, with header/content/footer slots and ready-made variants: interactive, glass, animated gradient border, image, pricing, profile and stat.',
    keywords: ['panel', 'tile', 'surface', 'pricing card', 'profile card', 'stat card', 'kpi', 'glass card'],
    demos: [
      {
        title: 'Default',
        html: `<div class="card" style="width:min(100%,24rem)">
  <div class="card-header">
    <div class="card-title">Create project</div>
    <div class="card-description">Deploy your new project in one click.</div>
  </div>
  <div class="card-content stack gap-3">
    <div class="stack gap-1"><label class="label" for="card-name">Name</label><input id="card-name" class="input" placeholder="acme-dashboard"></div>
    <div class="stack gap-1"><span class="label">Framework</span><div class="cluster"><button type="button" class="chip chip-sm" aria-pressed="true">Next.js</button><button type="button" class="chip chip-sm" aria-pressed="false">Astro</button><button type="button" class="chip chip-sm" aria-pressed="false">Vanilla</button></div></div>
  </div>
  <div class="card-footer" style="justify-content:space-between"><button class="btn btn-outline">Cancel</button><button class="btn">Deploy</button></div>
</div>`,
        height: 360
      },
      {
        title: 'Interactive and image cards',
        description: '<code>.card-interactive</code> lifts on hover; images zoom gently.',
        center: false,
        html: `<div class="grid grid-auto" style="--min:220px;--gap:1.25rem">
  <a class="card card-interactive" href="#">
    <div class="card-image">${RB.art(0)}</div>
    <div class="card-content stack gap-2"><span class="badge badge-soft badge-sm" style="align-self:start">Guide</span><div class="card-title">Designing calm dashboards</div><p class="card-description">How to cut chart noise by half without losing signal.</p></div>
    <div class="card-footer small muted">${I('clock', 'class="size-4"')} 8 min read</div>
  </a>
  <a class="card card-interactive" href="#">
    <div class="card-image">${RB.art(1)}</div>
    <div class="card-content stack gap-2"><span class="badge badge-soft badge-info badge-sm" style="align-self:start">Changelog</span><div class="card-title">Edge functions are GA</div><p class="card-description">Run code in 38 regions with 9 ms cold starts.</p></div>
    <div class="card-footer small muted">${I('calendar', 'class="size-4"')} Nov 12, 2026</div>
  </a>
  <div class="card card-cover card-interactive">
    ${RB.art(3)}
    <div class="card-overlay stack gap-1"><span class="small" style="opacity:.8">Case study</span><div class="h4">How Lumen cut infra costs 41%</div></div>
  </div>
</div>`
      },
      {
        title: 'Pricing',
        center: false,
        html: `<div class="grid grid-auto" style="--min:230px;--gap:1.25rem;align-items:start;padding-top:.75rem">
  <div class="card card-pricing">
    <div class="card-content">
      <div class="card-title">Hobby</div><p class="card-description">For side projects.</p>
      <div class="price"><span class="price-amount">$0</span><span class="price-period">/ month</span></div>
      <ul class="card-features"><li>${check} 1 project</li><li>${check} 10k requests / day</li><li>${check} Community support</li><li data-off>${I('x')} Custom domains</li></ul>
      <button class="btn btn-outline btn-block">Start free</button>
    </div>
  </div>
  <div class="card card-pricing card-gradient">
    <span class="card-ribbon">Most popular</span>
    <div class="card-content">
      <div class="card-title">Pro</div><p class="card-description">For growing teams.</p>
      <div class="price"><span class="price-amount">$24</span><span class="price-period">/ user / month</span></div>
      <ul class="card-features"><li>${check} Unlimited projects</li><li>${check} 1M requests / day</li><li>${check} Custom domains + SSL</li><li>${check} Priority support</li></ul>
      <button class="btn btn-block btn-shine">Upgrade to Pro</button>
    </div>
  </div>
  <div class="card card-pricing">
    <div class="card-content">
      <div class="card-title">Enterprise</div><p class="card-description">Security and scale.</p>
      <div class="price"><span class="price-amount" style="font-size:2.1rem">Custom</span></div>
      <ul class="card-features"><li>${check} SSO & SCIM</li><li>${check} 99.99% uptime SLA</li><li>${check} Audit logs</li><li>${check} Dedicated engineer</li></ul>
      <button class="btn btn-secondary btn-block">Contact sales</button>
    </div>
  </div>
</div>`
      },
      {
        title: 'Stat cards',
        center: false,
        html: `<div class="grid grid-auto" style="--min:200px">
  <div class="card card-stat"><div class="stat-label">Revenue ${I('dollar')}</div><div class="stat-value">$48,294</div><div class="stat-meta"><span class="stat-trend up">${I('trendUp')} 12.4%</span> vs last month</div>
    <svg class="stat-spark" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M0 24 12 20 24 22 36 14 48 16 60 9 72 12 84 5 100 3" vector-effect="non-scaling-stroke"/></svg></div>
  <div class="card card-stat"><div class="stat-label">Active users ${I('users')}</div><div class="stat-value">2,841</div><div class="stat-meta"><span class="stat-trend up">${I('trendUp')} 4.1%</span> vs last week</div>
    <svg class="stat-spark" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M0 18 12 20 24 14 36 17 48 12 60 15 72 9 84 11 100 6" vector-effect="non-scaling-stroke"/></svg></div>
  <div class="card card-stat"><div class="stat-label">Churn ${I('activity')}</div><div class="stat-value">1.8%</div><div class="stat-meta"><span class="stat-trend down">${I('trendDown')} 0.3%</span> vs last month</div>
    <svg class="stat-spark" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none" stroke="var(--destructive)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M0 8 12 10 24 9 36 14 48 12 60 18 72 16 84 21 100 24" vector-effect="non-scaling-stroke"/></svg></div>
</div>`
      },
      {
        title: 'Profile and glass',
        center: false,
        bg: 'none',
        pad: false,
        height: 420,
        html: `<div class="demo-card-scene">
  ${RB.art(0, 'demo-card-bg')}
  <div class="card card-profile" style="width:16rem">
    <div class="card-banner"></div>
    <img class="avatar avatar-xl" src="${RB.face(20)}" alt="Ana Silva">
    <div class="card-content stack gap-1" style="padding-top:.75rem">
      <div class="card-title">Ana Silva</div>
      <p class="card-description">Staff designer at Linea · Lisbon</p>
      <div class="cluster" style="justify-content:center;margin-top:.75rem"><button class="btn btn-sm">Follow</button><button class="btn btn-sm btn-outline">Message</button></div>
    </div>
    <div class="card-stats"><div><b>184</b><span>Posts</span></div><div><b>12.4k</b><span>Followers</span></div><div><b>312</b><span>Following</span></div></div>
  </div>
  <div class="card card-glass" style="width:16rem">
    <div class="card-header"><div class="card-title">Now playing</div><div class="card-description">Discover Weekly</div></div>
    <div class="card-content stack gap-3">
      <div class="avatar-label"><span class="avatar avatar-lg avatar-square avatar-gradient" style="--avatar-hue:330">${I('play')}</span><div><b>Midnight City</b><span>M83 · Hurry Up, We're Dreaming</span></div></div>
      <div class="progress progress-sm" style="--value:42"><div class="progress-fill"></div></div>
      <div class="split small muted" style="font-weight:400"><span>1:48</span><span>4:03</span></div>
    </div>
  </div>
</div>`,
        css: `.demo-card-scene { position: relative; width: 100%; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1.5rem; padding: 2rem 1rem; min-height: 420px; overflow: hidden; }
.demo-card-bg { position: absolute; inset: 0; width: 100%; height: 100%; }
.demo-card-scene > .card { position: relative; }`
      }
    ],
    api: [
      { name: '.card', type: 'class', desc: 'Surface with border, radius and a hairline shadow.' },
      { name: '.card-header', type: 'class', desc: 'Slots (v1 compatible). <code>.card-header-row</code> puts an action on the right; <code>.card-footer-bordered</code> adds a tinted footer bar. Also: <code>.card-title</code> <code>.card-description</code> <code>.card-content</code> <code>.card-footer</code>' },
      { name: '.card-interactive', type: 'class', desc: 'Lift + deeper shadow on hover. Also: <code>.card-hover</code>' },
      { name: '.card-glass', type: 'class', desc: 'Frosted translucent surface.' },
      { name: '.card-gradient', type: 'class', desc: 'Animated conic gradient border; <code>.card-gradient-static</code> to stop it.' },
      { name: '.card-image', type: 'class', desc: 'Top media, full-bleed background media, and a legible text overlay. Also: <code>.card-cover</code> <code>.card-overlay</code>' },
      { name: '.card-pricing', type: 'class', desc: 'Pricing parts. <code>li[data-off]</code> marks a missing feature. Also: <code>.price</code> <code>.card-features</code> <code>.card-ribbon</code>' },
      { name: '.card-profile', type: 'class', desc: 'Profile layout. Also: <code>.card-banner</code> <code>.card-stats</code>' },
      { name: '.card-stat', type: 'class', desc: 'KPI tile. Also: <code>.stat-label</code> <code>.stat-value</code> <code>.stat-meta</code> <code>.stat-trend.up|down</code> <code>.stat-spark</code>' },
      { name: '.card-sm', type: 'class', desc: 'Padding, elevation, highlight and horizontal layout. Also: <code>.card-lg</code> <code>.card-flat</code> <code>.card-elevated</code> <code>.card-featured</code> <code>.card-row</code>' },
      { name: '--card-pad / --card-radius', type: 'var', default: '1.5rem / --radius-xl', desc: 'Spacing and corner radius.' }
    ]
  });
})();
