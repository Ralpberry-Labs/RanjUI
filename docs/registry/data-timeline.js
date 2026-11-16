(function () {
var I = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="M12 15 9 12a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/></svg>',
  git: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 3-10.5 6"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>'
};
var face = function (id) { return 'https://images.unsplash.com/' + id + '?w=96&h=96&fit=crop&crop=faces&q=70'; };
RanjDocs.add({
  id: 'timeline',
  name: 'Timeline',
  group: 'Data Display',
  description: 'Chronological events with icon, avatar or dot markers connected by a line. Vertical, alternating (collapses on narrow containers), activity feed and horizontal layouts, with an optional reveal-on-scroll.',
  tags: ['new'],
  keywords: ['history', 'changelog', 'activity', 'feed', 'events', 'roadmap', 'steps', 'audit log'],
  demos: [
    {
      title: 'Deployment history',
      center: false,
      html: `<ol class="timeline" style="max-width: 560px; margin: auto">
  <li class="timeline-item">
    <span class="timeline-marker is-primary is-pulse">${I.rocket}</span>
    <div class="timeline-content">
      <div class="timeline-head"><span class="timeline-title">Promoted to production</span><time class="timeline-time">2 min ago</time></div>
      <p class="timeline-body">Build <b>#4821</b> rolled out to 100% of traffic in us-east-1 and eu-west-2.</p>
    </div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker is-success">${I.check}</span>
    <div class="timeline-content">
      <div class="timeline-head"><span class="timeline-title">Checks passed</span><time class="timeline-time">9 min ago</time></div>
      <p class="timeline-body">412 tests, lint, type-check and Lighthouse (score 98) all green.</p>
    </div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker is-warning">${I.alert}</span>
    <div class="timeline-content">
      <div class="timeline-head"><span class="timeline-title">Bundle size warning</span><time class="timeline-time">11 min ago</time></div>
      <p class="timeline-body">checkout.js grew by 14.2 kB gzipped (budget: 10 kB).</p>
    </div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker">${I.git}</span>
    <div class="timeline-content">
      <div class="timeline-head"><span class="timeline-title">Merged <span style="font-family:var(--font-mono);font-weight:500">feat/apple-pay</span></span><time class="timeline-time">14 min ago</time></div>
      <p class="timeline-body">Maya Chen merged 7 commits into main.</p>
    </div>
  </li>
</ol>`
    },
    {
      title: 'Activity feed',
      description: '<code>.timeline-feed</code> for inline sentences with avatar markers, small icon markers and nested cards.',
      center: false,
      html: `<ol class="timeline timeline-feed" style="max-width: 620px; margin: auto">
  <li class="timeline-item">
    <span class="timeline-marker"><img src="${face('photo-1494790108377-be9c29b29330')}" alt=""></span>
    <div class="timeline-content">
      <b>Sofia Rossi</b> commented on <b>ENG-1432</b><time class="timeline-time">12m</time>
      <div class="timeline-card">Repro'd on Safari 17.4 only. The <code>ResizeObserver</code> loop fires before layout settles; wrapping in rAF fixes it. PR incoming.</div>
    </div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker is-small">${I.tag}</span>
    <div class="timeline-content"><b>Daniel Okafor</b> added labels <span class="timeline-tag">bug</span> <span class="timeline-tag">p1</span><time class="timeline-time">40m</time></div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker is-small">${I.user}</span>
    <div class="timeline-content"><b>Daniel Okafor</b> assigned the issue to <b>Sofia Rossi</b><time class="timeline-time">41m</time></div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker"><img src="${face('photo-1500648767791-00dcc994a43e')}" alt=""></span>
    <div class="timeline-content">
      <b>Marcus Lee</b> opened this issue<time class="timeline-time">2h</time>
      <div class="timeline-card">Charts flicker when the dashboard sidebar collapses. Happens on every resize in Safari, never in Chrome.</div>
    </div>
  </li>
</ol>`
    },
    {
      title: 'Alternating roadmap',
      description: 'Center line with items on alternating sides. Below 640px of container width it falls back to a single column. <code>.timeline-reveal</code> fades items in on scroll.',
      center: false,
      html: `<ol class="timeline timeline-alternate timeline-boxed timeline-reveal">
  <li class="timeline-item is-done">
    <span class="timeline-aside">Q1 2026</span>
    <span class="timeline-marker is-success">${I.check}</span>
    <div class="timeline-content"><span class="timeline-eyebrow">Shipped</span><div class="timeline-title">Realtime collaboration</div><p class="timeline-body">Live cursors, presence and conflict-free editing for every document.</p><div class="timeline-tags"><span class="timeline-tag">Editor</span><span class="timeline-tag">CRDT</span></div></div>
  </li>
  <li class="timeline-item is-done">
    <span class="timeline-aside">Q2 2026</span>
    <span class="timeline-marker is-success">${I.check}</span>
    <div class="timeline-content"><span class="timeline-eyebrow">Shipped</span><div class="timeline-title">Public API v2</div><p class="timeline-body">REST and webhooks with typed SDKs for TypeScript, Python and Go.</p><div class="timeline-tags"><span class="timeline-tag">Platform</span></div></div>
  </li>
  <li class="timeline-item">
    <span class="timeline-aside">Q3–Q4 2026</span>
    <span class="timeline-marker is-primary is-pulse">${I.rocket}</span>
    <div class="timeline-content"><span class="timeline-eyebrow">In progress</span><div class="timeline-title">AI workspace search</div><p class="timeline-body">Ask questions across docs, issues and chat with cited answers.</p><div class="timeline-tags"><span class="timeline-tag">AI</span><span class="timeline-tag">Search</span></div></div>
  </li>
  <li class="timeline-item">
    <span class="timeline-aside">2027</span>
    <span class="timeline-marker"></span>
    <div class="timeline-content"><span class="timeline-eyebrow" style="color:var(--muted-fg)">Planned</span><div class="timeline-title">Self-hosted edition</div><p class="timeline-body">Single-binary deploy with SSO, audit logs and air-gapped licensing.</p></div>
  </li>
</ol>`
    },
    {
      title: 'Horizontal',
      description: 'Scrolls sideways on small screens.',
      center: false,
      html: `<ol class="timeline timeline-horizontal">
  <li class="timeline-item is-done"><span class="timeline-marker is-success">${I.check}</span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Order placed</span><time class="timeline-time">Nov 12, 09:14</time></div></div></li>
  <li class="timeline-item is-done"><span class="timeline-marker is-success">${I.check}</span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Packed</span><time class="timeline-time">Nov 12, 16:40</time></div></div></li>
  <li class="timeline-item"><span class="timeline-marker is-primary is-pulse">${I.rocket}</span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">In transit</span><time class="timeline-time">Nov 14, 07:02</time></div><p class="timeline-body">Newark, NJ hub</p></div></li>
  <li class="timeline-item"><span class="timeline-marker"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Out for delivery</span><time class="timeline-time">Expected Nov 17</time></div></div></li>
  <li class="timeline-item"><span class="timeline-marker"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Delivered</span><time class="timeline-time">—</time></div></div></li>
</ol>`
    },
    {
      title: 'Compact dots',
      html: `<ol class="timeline timeline-sm" style="max-width: 360px">
  <li class="timeline-item"><span class="timeline-marker is-primary"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Invoice paid</span><time class="timeline-time">Today</time></div></div></li>
  <li class="timeline-item"><span class="timeline-marker"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Reminder sent</span><time class="timeline-time">Nov 10</time></div></div></li>
  <li class="timeline-item"><span class="timeline-marker is-danger"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Payment failed</span><time class="timeline-time">Nov 08</time></div></div></li>
  <li class="timeline-item"><span class="timeline-marker"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Invoice issued</span><time class="timeline-time">Nov 01</time></div></div></li>
</ol>`
    }
  ],
  api: [
    { name: '.timeline', type: 'class', desc: 'An ol of .timeline-item. Each item has a .timeline-marker and a .timeline-content.' },
    { name: '.timeline-marker', type: 'class', desc: 'Icon, initials or img. Empty marker renders a dot. Tones: .is-primary, .is-success, .is-warning, .is-danger, .is-info; .is-pulse adds a live ping; .is-small (feed) shrinks it.' },
    { name: '.timeline-head / -title / -time / -body / -eyebrow / -card / -tags / -tag', type: 'class', desc: 'Content parts.' },
    { name: '.timeline-item.is-done', type: 'class', desc: 'Tints the connector line below the item with the brand color.' },
    { name: '.timeline-boxed', type: 'class', desc: 'Puts each item’s content in a card.' },
    { name: '.timeline-feed', type: 'class', desc: 'Activity-feed layout for inline sentences with avatars.' },
    { name: '.timeline-alternate', type: 'class', desc: 'Center line, alternating sides from 640px of container width. .timeline-aside shows a date on the opposite side.' },
    { name: '.timeline-horizontal', type: 'class', desc: 'Left-to-right steps; scrolls horizontally when space runs out.' },
    { name: '.timeline-sm', type: 'class', desc: 'Compact dot timeline.' },
    { name: '.timeline-reveal', type: 'class', desc: 'With ranj.js, items fade up as they enter the viewport (instant with reduced motion).' },
    { name: '--tl-marker / --tl-dot / --tl-gap', type: 'var', default: '2rem / .75rem / 1.75rem', desc: 'Marker size, dot size, space between items.' },
    { name: '--tl-line / --tl-line-w / --tl-ring', type: 'var', default: 'var(--border) / 2px / var(--bg)', desc: 'Connector color and width; ring around markers (set to your surface color).' }
  ]
});
})();
