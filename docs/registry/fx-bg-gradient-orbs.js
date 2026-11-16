RanjDocs.add({
  id: 'bg-gradient-orbs',
  name: 'Gradient Orbs',
  group: 'Backgrounds',
  description: 'Large blurred orbs that wander on their own and softly chase the cursor, each with its own lag.',
  tags: ['new', 'fx', 'js'],
  keywords: ['orbs', 'blobs', 'cursor follow', 'glow', 'interactive gradient'],
  demos: [
    { title: 'Cursor follow', description: 'Move your pointer over the hero.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-gradient-orbs"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Design</b> Figma plugin available</span>
    <h2>Color systems that adapt</h2>
    <p>Generate accessible palettes from a single brand color.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Generate palette</a></div>
  </div>
</div>` },
    { title: 'Custom colors, idle only', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-gradient-orbs" data-follow="false" data-count="3" data-colors="#22d3ee,#a78bfa,#f472b6"></div>
  <div class="bg-hero"><h2>Ambient mode</h2><p>Orbs drift on their own when <code>data-follow="false"</code>.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-gradient-orbs', type: 'class', desc: 'Orb container.' },
    { name: 'data-count', type: 'attr', default: '4', desc: 'Number of orbs.' },
    { name: 'data-follow', type: 'attr', default: 'true', desc: 'Chase the cursor.' },
    { name: 'data-colors', type: 'attr', desc: 'Comma-separated colors (default <code>--c1 … --c4</code>).' },
    { name: '--blur / --opacity', type: 'var', default: '70px / .6', desc: 'Softness and strength.' }
  ]
});
