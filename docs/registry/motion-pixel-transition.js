RanjDocs.add({
  id: 'pixel-transition',
  name: 'Pixel Transition',
  group: 'Interactions',
  description: 'On hover, a grid of pixels fills in random order, swaps the content underneath, then dissolves away to reveal the second side.',
  tags: ['new', 'fx', 'js'],
  keywords: ['pixel', 'dissolve', 'image reveal', 'hover reveal', 'mosaic', 'transition'],
  demos: [
    {
      title: 'Product reveal',
      height: 360,
      html: `
<div class="pixel-transition demo-pixel-transition" data-grid="12" style="--pixel-color: #fafafa">
  <div class="pt-front demo-pixel-transition-face" style="background:linear-gradient(150deg,#1e1b4b,#4338ca)"><span>🎧</span><b>Aero One</b></div>
  <div class="pt-back demo-pixel-transition-face" style="background:linear-gradient(150deg,#fde68a,#f97316)"><b>$249</b><small>Spatial audio · 40h battery</small></div>
</div>
<div class="pixel-transition demo-pixel-transition" data-grid="7" data-duration="900" style="--pixel-color: var(--primary)">
  <div class="pt-front demo-pixel-transition-face" style="background:var(--card);color:var(--fg);border:1px solid var(--border)"><span>👾</span><b>Chunky pixels</b></div>
  <div class="pt-back demo-pixel-transition-face" style="background:var(--primary)"><b>Hello!</b><small>data-grid="7"</small></div>
</div>`,
      css: `.demo-pixel-transition { width: 240px; aspect-ratio: 1; box-shadow: var(--shadow-lg); }
.demo-pixel-transition-face { display: grid; place-content: center; justify-items: center; gap: .35rem; color: #fff; text-align: center; }
.demo-pixel-transition-face span { font-size: 4rem; } .demo-pixel-transition-face b { font-size: 1.4rem; } .demo-pixel-transition-face small { opacity: .85; }`
    }
  ],
  api: [
    { name: '.pixel-transition', type: 'class', desc: 'Container with <code>.pt-front</code> and <code>.pt-back</code> children.' },
    { name: 'data-grid', type: 'attr', default: '10', desc: 'Pixels per row (rows follow the aspect ratio).' },
    { name: 'data-duration', type: 'attr', default: '700', desc: 'Total transition time in ms.' },
    { name: 'data-trigger', type: 'attr', default: 'hover', desc: '<code>click</code> to toggle on click. Touch devices and Enter/Space always toggle.' },
    { name: '--pixel-color', type: 'var', default: 'var(--fg)', desc: 'Pixel color.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ active }</code>' }
  ]
});
