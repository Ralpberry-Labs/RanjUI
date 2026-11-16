RanjDocs.add({
  id: 'bg-squares',
  name: 'Squares',
  group: 'Backgrounds',
  description: 'A slowly sliding grid of squares. Cells light up under the cursor and leave a fading trail, with random flickers.',
  tags: ['new', 'fx', 'js'],
  keywords: ['squares', 'grid', 'hover trail', 'tiles', 'canvas'],
  demos: [
    { title: 'Hover trail', description: 'Sweep your pointer across the grid.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-squares bg-fade"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Open source</b> 12k stars on GitHub</span>
    <h2>Build blocks, not boilerplate</h2>
    <p>A component kit with 200+ pieces that snap together.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Star on GitHub</a></div>
  </div>
</div>` },
    { title: 'Big tiles moving up', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-squares" data-size="64" data-direction="up" data-speed="0.5" style="--fill:#10b981"></div>
  <div class="bg-hero"><h2>All systems operational</h2><p>99.998% uptime over the last 90 days.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-squares', type: 'class', desc: 'Canvas square grid.' },
    { name: 'data-size', type: 'attr', default: '40', desc: 'Square size (px).' },
    { name: 'data-direction', type: 'attr', default: 'diagonal', desc: '<code>diagonal up down left right none</code>.' },
    { name: 'data-speed', type: 'attr', default: '0.35', desc: 'Slide speed (px per frame).' },
    { name: 'data-flicker', type: 'attr', default: 'true', desc: 'Random cell flicker.' },
    { name: '--fill', type: 'var', default: '--primary', desc: 'Highlight color.' }
  ]
});
