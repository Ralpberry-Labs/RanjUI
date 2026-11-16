RanjDocs.add({
  id: 'ios-toggle-pack',
  name: 'Toggle Pack',
  group: 'Micro-interactions',
  description: 'Five stylish switch variants: squishy knob, X to check morph, neon glow, inline labels and a jelly bounce.',
  tags: ['new', 'fx', 'js'],
  keywords: ['switch', 'toggle', 'ios switch', 'neon', 'squish', 'checkbox switch'],
  demos: [
    { title: 'All variants', description: 'Press and hold the squish one to see it stretch.', html: `
<div class="demo-tglp-grid">
  <div><button class="tgl tgl-squish" aria-checked="true" aria-label="Squish"></button><span>Squish</span></div>
  <div><button class="tgl tgl-icon" aria-label="Icon morph"></button><span>Icon morph</span></div>
  <div><button class="tgl tgl-neon" aria-checked="true" aria-label="Neon"></button><span>Neon</span></div>
  <div><button class="tgl tgl-text" data-on="ON" data-off="OFF" aria-label="Labels"></button><span>Labels</span></div>
  <div><button class="tgl tgl-bounce" aria-label="Bounce"></button><span>Bounce</span></div>
</div>`, css: `
.demo-tglp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); gap: 1.5rem 1rem; width: 560px; max-width: 100%; }
.demo-tglp-grid > div { display: flex; flex-direction: column; align-items: center; gap: .6rem; font-size: .8rem; color: var(--muted-fg); }` },
    { title: 'Settings list', height: 300, html: `
<div style="width:min(380px,100%);border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);overflow:hidden">
  <label class="demo-tglp-row"><span><b>Push notifications</b><small>Mentions, replies and DMs</small></span><button class="tgl tgl-icon" aria-checked="true" aria-label="Push notifications"></button></label>
  <label class="demo-tglp-row"><span><b>Weekly digest</b><small>Every Monday at 9:00</small></span><button class="tgl tgl-squish" aria-label="Weekly digest"></button></label>
  <label class="demo-tglp-row"><span><b>Beta features</b><small>Try things before everyone else</small></span><button class="tgl tgl-sm" aria-checked="true" aria-label="Beta features"></button></label>
</div>`, css: `
.demo-tglp-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .9rem 1.1rem; }
.demo-tglp-row + .demo-tglp-row { border-top: 1px solid var(--border); }
.demo-tglp-row b { display: block; font-weight: 600; font-size: .92rem; }
.demo-tglp-row small { color: var(--muted-fg); font-size: .8rem; }` },
    { title: 'Neon on dark', bg: 'dark', html: `<button class="tgl tgl-neon tgl-lg" aria-checked="true" aria-label="Neon"></button>
<button class="tgl tgl-neon tgl-lg" style="--on:#f472b6" aria-label="Neon pink"></button>
<button class="tgl tgl-neon tgl-lg" style="--on:#a3e635" aria-checked="true" aria-label="Neon lime"></button>` }
  ],
  api: [
    { name: '.tgl', type: 'class', desc: 'Base switch on an empty <code>&lt;button&gt;</code>.' },
    { name: '.tgl-squish / .tgl-icon / .tgl-neon / .tgl-text / .tgl-bounce', type: 'class', desc: 'Variants.' },
    { name: '.tgl-sm / .tgl-lg', type: 'class', desc: 'Sizes.' },
    { name: 'data-on / data-off', type: 'attr', desc: 'Labels for <code>.tgl-text</code>.' },
    { name: '--on / --w / --h / --knob', type: 'var', desc: 'On color, track size, knob color.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { checked }' }
  ]
});
