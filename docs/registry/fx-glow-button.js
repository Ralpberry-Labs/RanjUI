RanjDocs.add({
  id: 'glow-button',
  name: 'Glow Button',
  group: 'Micro-interactions',
  description: 'A dark pill with a rotating color aura behind it and a soft light that follows your cursor across the surface.',
  tags: ['new', 'fx', 'js'],
  keywords: ['glow', 'neon button', 'aura', 'cta', 'gradient glow'],
  demos: [
    { title: 'Default', description: 'Hover to intensify the glow and move the light.', html: `
<button class="glow-btn">Get early access</button>
<button class="glow-btn glow-btn-primary">Start free trial</button>
<button class="glow-btn" style="--g1:#f97316;--g2:#ec4899;--g3:#facc15">Launch party</button>` },
    { title: 'Hero call to action', pad: false, center: false, height: 300, html: `
<div class="bg-host" style="height:300px;background:#07070b">
  <div class="bg-dot-pattern" style="--dot-color:rgb(255 255 255 / .12)"></div>
  <div class="bg-hero bg-hero-dark"><h2>Your AI pair designer</h2><p>Describe a screen. Get production-ready HTML in seconds.</p><div class="bg-hero-actions"><button class="glow-btn">Try it free</button></div></div>
</div>` }
  ],
  api: [
    { name: '.glow-btn', type: 'class', desc: 'Glow button. Cursor light uses ranj.js (optional).' },
    { name: '.glow-btn-primary', type: 'class', desc: 'Accent-colored surface.' },
    { name: '--g1 / --g2 / --g3', type: 'var', desc: 'Aura colors.' }
  ]
});
