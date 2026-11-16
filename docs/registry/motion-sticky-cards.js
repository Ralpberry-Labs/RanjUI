RanjDocs.add({
  id: 'sticky-cards',
  name: 'Sticky Scroll Cards',
  group: 'Motion',
  description: 'Cards pin as you scroll and stack on top of each other; the ones underneath scale down and dim in proportion to how many cards cover them.',
  tags: ['new', 'fx', 'js'],
  keywords: ['stacking cards', 'sticky', 'scroll stack', 'deck', 'card stack scroll'],
  demos: [
    {
      title: 'Process steps',
      description: 'Scroll inside the panel.',
      pad: false, center: false,
      html: `
<div class="demo-sticky-cards-box">
  <p class="demo-sticky-cards-hint">Scroll ↓</p>
  <div class="sticky-cards">
    <div class="sticky-card demo-sticky-cards-card" style="--c1:#6366f1;--c2:#8b5cf6"><span>01</span><h3>Discover</h3><p>Interviews, analytics and a teardown of what already works.</p></div>
    <div class="sticky-card demo-sticky-cards-card" style="--c1:#0ea5e9;--c2:#14b8a6"><span>02</span><h3>Design</h3><p>Flows, wireframes and a living prototype you can click through.</p></div>
    <div class="sticky-card demo-sticky-cards-card" style="--c1:#f59e0b;--c2:#ef4444"><span>03</span><h3>Build</h3><p>Production code with Ranj UI, reviewed and tested every day.</p></div>
    <div class="sticky-card demo-sticky-cards-card" style="--c1:#ec4899;--c2:#f43f5e"><span>04</span><h3>Launch</h3><p>Ship, measure, iterate. We stay on for the first 90 days.</p></div>
  </div>
  <div style="height: 180px"></div>
</div>`,
      css: `.demo-sticky-cards-box { height: 420px; overflow-y: auto; padding: 0 1.25rem; }
.demo-sticky-cards-hint { height: 120px; display: grid; place-items: center; color: var(--muted-fg); font-size: .875rem; }
.demo-sticky-cards-card { max-width: 560px; margin: 0 auto; width: 100%; min-height: 240px; padding: 1.75rem; border-radius: var(--radius-2xl); color: #fff; display: grid; align-content: end; gap: .35rem; background: linear-gradient(140deg, var(--c1), var(--c2)); box-shadow: 0 -10px 40px -12px rgb(0 0 0 / .35); }
.demo-sticky-cards-card span { font-family: var(--font-mono); opacity: .7; } .demo-sticky-cards-card h3 { font-size: 2rem; } .demo-sticky-cards-card p { opacity: .9; }`
    }
  ],
  api: [
    { name: '.sticky-cards', type: 'class', desc: 'Container; children with <code>.sticky-card</code> pin and stack.' },
    { name: '--top / --step', type: 'var', default: '1.5rem / 14px', desc: 'Pin offset and extra offset per card (so edges peek out).' },
    { name: '--scale-step', type: 'var', default: '.05', desc: 'Scale lost per covering card.' },
    { name: '--depth', type: 'var', desc: 'Written per card: how many cards cover it (fractional). Use it for your own effects.' }
  ]
});
