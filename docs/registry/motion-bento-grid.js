RanjDocs.add({
  id: 'bento-grid',
  name: 'Bento Grid',
  group: 'Motion',
  description: 'Feature cards on the core .bento layout with a cursor-following glow: the fill lights the hovered card while the border light spills across neighbours.',
  tags: ['new', 'fx', 'js'],
  keywords: ['bento', 'feature grid', 'cards', 'glow', 'spotlight', 'landing page'],
  demos: [
    {
      title: 'Feature bento',
      pad: false,
      html: `
<div class="demo-bento-grid-wrap">
<div class="bento" data-spotlight-group style="--row: 170px">
  <div class="bento-card col-span-2 row-span-2">
    <div class="bento-visual"><div class="demo-bento-grid-chart"><i style="height:40%"></i><i style="height:62%"></i><i style="height:48%"></i><i style="height:80%"></i><i style="height:66%"></i><i style="height:94%"></i><i style="height:72%"></i></div></div>
    <h3>Real-time analytics</h3><p>Every event streams to your dashboard in under 200ms, no polling.</p>
  </div>
  <div class="bento-card col-span-2">
    <div class="bento-visual"><div class="demo-bento-grid-avatars"><span>AM</span><span>JL</span><span>SK</span><span>+9</span></div></div>
    <h3>Multiplayer by default</h3><p>Presence, cursors and comments built in.</p>
  </div>
  <div class="bento-card">
    <div class="bento-visual demo-bento-grid-big">99.99%</div>
    <h3>Uptime</h3><p>Across 14 regions.</p>
  </div>
  <div class="bento-card">
    <div class="bento-visual demo-bento-grid-big">⌘K</div>
    <h3>Command menu</h3><p>Do anything, fast.</p>
  </div>
  <div class="bento-card col-span-4" style="min-height: 120px">
    <h3>Ship faster with Ranj UI</h3><p>Copy a component, paste it in, and it just works — in plain HTML, React, Vue, Svelte or anything else.</p>
  </div>
</div>
</div>`,
      css: `.demo-bento-grid-wrap { width: 100%; padding: 1.5rem; max-width: 960px; margin: 0 auto; }
.demo-bento-grid-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; width: 80%; }
.demo-bento-grid-chart i { flex: 1; border-radius: 6px 6px 2px 2px; background: linear-gradient(180deg, var(--primary), color-mix(in oklab, var(--primary) 30%, transparent)); }
.demo-bento-grid-avatars { display: flex; } .demo-bento-grid-avatars span { width: 44px; height: 44px; margin-left: -10px; border-radius: 50%; display: grid; place-items: center; font-size: .75rem; font-weight: 700; color: #fff; border: 3px solid var(--card); background: linear-gradient(135deg, #f97316, #ec4899); }
.demo-bento-grid-avatars span:nth-child(2) { background: linear-gradient(135deg, #22c55e, #0ea5e9); } .demo-bento-grid-avatars span:nth-child(3) { background: linear-gradient(135deg, #8b5cf6, #6366f1); } .demo-bento-grid-avatars span:nth-child(4) { background: var(--secondary); color: var(--fg); }
.demo-bento-grid-big { font-family: var(--font-display); font-size: 2.25rem; font-weight: 800; letter-spacing: -.04em; }`
    }
  ],
  api: [
    { name: '.bento', type: 'class', desc: 'Core layout grid (4 columns, 2 on mobile). Use <code>col-span-*</code> / <code>row-span-*</code>; <code>--row</code> sets row height.' },
    { name: '.bento-card', type: 'class', desc: 'Card with hover lift and spotlight glow. <code>.bento-visual</code> fills the space above the copy.' },
    { name: 'data-spotlight-group', type: 'attr', desc: 'On the grid: one pointer handler drives every card so border light crosses card boundaries.' },
    { name: '--spot / --spot-border / --spot-size', type: 'var', desc: 'Glow fill color, border light color and radius.' }
  ]
});
