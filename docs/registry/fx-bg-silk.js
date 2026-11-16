RanjDocs.add({
  id: 'bg-silk',
  name: 'Silk',
  group: 'Backgrounds',
  description: 'Smooth folds of fabric with soft specular highlights. Rendered at low resolution and upscaled, so it stays cheap.',
  tags: ['new', 'fx', 'js'],
  keywords: ['silk', 'fabric', 'satin', 'flowing', 'canvas', 'shader'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-silk"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>FW26</b> The Evening Collection</span>
    <h2>Made to move with you</h2>
    <p>Mulberry silk, cut and sewn in Como. Limited to 400 pieces.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Shop the collection</a></div>
  </div>
</div>` },
    { title: 'Champagne', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-silk" data-color="#d6b58a" data-scale="1.6" data-speed="0.7"></div>
  <div class="bg-hero"><h2>Maison Lumière</h2><p>Fine fragrance since 1921.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-silk', type: 'class', desc: 'Canvas silk.' },
    { name: 'data-color / --color', type: 'attr', default: '--c1', desc: 'Fabric color (shading adapts to theme).' },
    { name: 'data-scale', type: 'attr', default: '2.2', desc: 'Fold density.' },
    { name: 'data-speed', type: 'attr', default: '1', desc: 'Flow speed.' },
    { name: 'data-res', type: 'attr', default: '6', desc: 'Pixels per sample (higher = cheaper, softer).' }
  ]
});
