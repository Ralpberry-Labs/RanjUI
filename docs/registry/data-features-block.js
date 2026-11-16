(function () {
  function ic(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var I = {
    bolt: ic('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
    shield: ic('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>'),
    globe: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    branch: ic('<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7v10M18 10c0 4-6 3-12 7"/>'),
    chart: ic('<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>'),
    lock: ic('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    sparkle: ic('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
    layers: ic('<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>')
  };
  var arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function f(icon, tone, t, d) { return `      <article class="block-feature">
        <div class="block-icon" data-tone="${tone}">${I[icon]}</div>
        <h3>${t}</h3>
        <p>${d}</p>
      </article>`; }
  RanjDocs.add({
    id: 'features-block',
    name: 'Features',
    group: 'Blocks',
    description: 'Feature sections: an icon card grid, a bento layout with visuals, and a compact two-column list.',
    tags: ['new'],
    keywords: ['feature grid', 'bento', 'benefits', 'services'],
    demos: [
      {
        title: 'Icon grid',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow">Platform</span>
      <h2 class="block-title">Everything you need to ship faster</h2>
      <p class="block-lead">From the first commit to millions of requests, Northwind handles the infrastructure so your team can focus on the product.</p>
    </div>
    <div class="block-features">
${f('bolt', 0, 'Instant deploys', 'Push to main and go live in under 20 seconds with incremental builds and smart caching.')}
${f('globe', 1, 'Global edge network', 'Serve every request from 42 regions with automatic failover and 12 ms median latency.')}
${f('branch', 2, 'Preview every PR', 'Each pull request gets its own URL, seeded database and shareable comments.')}
${f('shield', 3, 'Secure by default', 'Managed TLS, DDoS protection and SOC 2 Type II controls on every plan.')}
${f('chart', 4, 'Real-time analytics', 'Core Web Vitals, traffic and error rates without adding a single script.')}
${f('lock', 5, 'Granular access', 'Roles, SSO and audit logs so the right people touch the right things.')}
    </div>
  </div>
</section>`
      },
      {
        title: 'Bento',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container">
    <div class="block-head block-head-start">
      <span class="block-eyebrow">Why teams switch</span>
      <h2 class="block-title">Built for the way you actually work</h2>
    </div>
    <div class="block-bento">
      <article class="block-feature span-4">
        <div class="block-visual block-visual-grid">
          <div class="demo-features-block-bars"><i style="--h:38%"></i><i style="--h:52%"></i><i style="--h:44%"></i><i style="--h:68%"></i><i style="--h:60%"></i><i style="--h:82%"></i><i style="--h:74%"></i><i style="--h:94%"></i></div>
        </div>
        <div class="block-feature-body">
          <h3>Analytics that answer questions</h3>
          <p>Slice revenue, retention and funnels by any property. Results in under 200 ms, even on billions of events.</p>
        </div>
      </article>
      <article class="block-feature span-2">
        <div class="block-visual"><div class="demo-features-block-orb">${I.sparkle}</div></div>
        <div class="block-feature-body">
          <h3>AI summaries</h3>
          <p>A plain-English digest of what changed every Monday.</p>
        </div>
      </article>
      <article class="block-feature span-3">
        <div class="block-feature-body">
          <div class="block-icon" data-tone="2">${I.layers}</div>
          <h3>Workspaces for every team</h3>
          <p>Separate data, dashboards and permissions for marketing, product and finance, with one bill.</p>
          <a class="block-link" href="#">Learn about workspaces ${arrow}</a>
        </div>
      </article>
      <article class="block-feature span-3">
        <div class="block-feature-body">
          <div class="block-icon" data-tone="4">${I.shield}</div>
          <h3>Enterprise-grade privacy</h3>
          <p>EU data residency, field-level encryption and automatic PII redaction, all on by default.</p>
          <a class="block-link" href="#">Read the security whitepaper ${arrow}</a>
        </div>
      </article>
    </div>
  </div>
</section>`,
        css: `.demo-features-block-bars { position: absolute; inset: 1.5rem 1.5rem 0; display: flex; align-items: flex-end; gap: 6%; }
.demo-features-block-bars i { flex: 1; height: var(--h); border-radius: 6px 6px 0 0; background: linear-gradient(180deg, var(--primary), color-mix(in oklab, var(--primary) 30%, transparent)); opacity: .85; }
.demo-features-block-bars i:nth-child(odd) { opacity: .45; }
.demo-features-block-orb { position: absolute; inset: 0; display: grid; place-items: center; }
.demo-features-block-orb svg { width: 4.5rem; height: 4.5rem; padding: 1.1rem; border-radius: 50%; color: #fff; background: radial-gradient(circle at 30% 30%, oklch(0.75 0.17 calc(var(--hue) + 60)), var(--primary)); box-shadow: 0 0 0 10px color-mix(in oklab, var(--primary) 12%, transparent), 0 0 0 22px color-mix(in oklab, var(--primary) 6%, transparent), 0 20px 40px -10px var(--primary); }`
      },
      {
        title: 'Two-column list',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head block-head-start">
      <h2 class="block-title">Less glue code. More product.</h2>
      <p class="block-lead">The boring parts, handled.</p>
    </div>
    <div class="block-features-list">
      <article class="block-feature"><div class="block-icon">${I.bolt}</div><div><h3>Background jobs</h3><p>Retries, cron and fan-out queues with a dashboard you will actually open.</p></div></article>
      <article class="block-feature"><div class="block-icon">${I.lock}</div><div><h3>Auth in one line</h3><p>Passkeys, magic links and OAuth for 30 providers, with session management built in.</p></div></article>
      <article class="block-feature"><div class="block-icon">${I.layers}</div><div><h3>Typed database</h3><p>Postgres with branching, migrations and generated TypeScript types on every push.</p></div></article>
      <article class="block-feature"><div class="block-icon">${I.chart}</div><div><h3>Usage-based billing</h3><p>Meter anything, invoice through Stripe, and show customers live usage.</p></div></article>
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-features', type: 'class', desc: 'Responsive 3 / 2 / 1 column grid of .block-feature cards.' },
      { name: '.block-feature', type: 'class', desc: 'Card with hover lift and a brand-tinted glow.' },
      { name: '.block-icon', type: 'class', desc: 'Tinted icon tile. data-tone="1…5" rotates the hue for variety.' },
      { name: '.block-bento + .span-2/.span-3/.span-4', type: 'class', desc: 'Six-column bento grid; collapses to one column under 760px.' },
      { name: '.block-visual / .block-visual-grid', type: 'class', desc: 'Art area at the top of a bento card.' },
      { name: '.block-features-list', type: 'class', desc: 'Icon-left, borderless two-column list.' },
      { name: '.block-head / .block-head-start', type: 'class', desc: 'Centered or left-aligned section heading with .block-eyebrow, .block-title, .block-lead.' }
    ]
  });
})();
