RanjDocs.add({
  id: 'bookmark-button',
  name: 'Bookmark Button',
  group: 'Micro-interactions',
  description: 'The ribbon fills from the bottom, hops and sparkles, while the label flips from Save to Saved.',
  tags: ['new', 'fx', 'js'],
  keywords: ['bookmark', 'save', 'favorite', 'read later'],
  demos: [
    { title: 'Article row', height: 240, html: `
<div style="width:min(440px,100%);display:flex;gap:1rem;align-items:center;padding:1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <div style="width:72px;height:72px;flex:none;border-radius:var(--radius-lg);background:linear-gradient(135deg,#fde68a,#f97316)"></div>
  <div style="flex:1;min-width:0"><small style="color:var(--muted-fg)">Design · 6 min read</small><div style="font-weight:700;line-height:1.3">Why great buttons feel physical</div></div>
  <button class="bookmark-btn" aria-label="Save article"></button>
</div>` },
    { title: 'With label and count', html: `<button class="bookmark-btn"><span class="bookmark-btn-label"><span>Save</span><span>Saved</span></span></button>
<button class="bookmark-btn" aria-pressed="true" style="--on:var(--primary)" aria-label="Saved"><span class="bookmark-btn-count">318</span></button>` }
  ],
  api: [
    { name: '.bookmark-btn', type: 'class', desc: 'A <code>&lt;button&gt;</code>; icon injected.' },
    { name: '.bookmark-btn-label', type: 'class', desc: 'Two spans: idle and saved text.' },
    { name: '.bookmark-btn-count', type: 'class', desc: 'Rolling count.' },
    { name: '--on', type: 'var', default: '--warning', desc: 'Fill color.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { pressed }' }
  ]
});
