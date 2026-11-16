RanjDocs.add({
  id: 'bg-particles',
  name: 'Particles',
  group: 'Backgrounds',
  description: 'A drifting constellation of particles joined by lines. The cursor gently pushes them away.',
  tags: ['new', 'fx', 'js'],
  keywords: ['particles', 'constellation', 'network', 'nodes', 'canvas'],
  demos: [
    { title: 'Hero', description: 'Move your pointer through the particles.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-particles"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Graph</b> Map every dependency</span>
    <h2>See how your services connect</h2>
    <p>Automatic service maps from your traces. No config, no agents to babysit.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Connect a cluster</a></div>
  </div>
</div>` },
    { title: 'Dots only, more of them', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-particles" data-lines="false" data-count="180" data-speed="0.6" data-color="#f472b6"></div>
  <div class="bg-hero"><h2>Snow globe mode</h2><p><code>data-lines="false"</code> and a custom color.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-particles', type: 'class', desc: 'Canvas particle field.' },
    { name: 'data-count', type: 'attr', default: 'auto', desc: 'Particle count (auto scales with area, max 150).' },
    { name: 'data-link', type: 'attr', default: '120', desc: 'Max distance for connecting lines (px).' },
    { name: 'data-lines', type: 'attr', default: 'true', desc: 'Draw connecting lines.' },
    { name: 'data-speed', type: 'attr', default: '0.35', desc: 'Drift speed.' },
    { name: 'data-repel', type: 'attr', default: '110', desc: 'Cursor repel radius (px).' },
    { name: 'data-color / --color', type: 'attr', default: '--primary', desc: 'Particle color.' }
  ]
});
