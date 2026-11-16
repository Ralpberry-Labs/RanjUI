RanjDocs.add({
  id: 'bg-meteors',
  name: 'Meteors',
  group: 'Backgrounds',
  description: 'Shooting stars streak across the area at random intervals, each with a fading tail.',
  tags: ['new', 'fx', 'js'],
  keywords: ['shooting stars', 'meteor shower', 'comets'],
  demos: [
    { title: 'Night hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px;background:radial-gradient(120% 90% at 50% 0%, #1e1b4b, #07070d 70%)">
  <div class="bg-meteors" style="--meteor:#e0e7ff"></div>
  <div class="bg-hero bg-hero-dark">
    <span class="bg-hero-badge"><b>Live</b> Perseids peak tonight</span>
    <h2>Never miss a meteor shower</h2>
    <p>Sky alerts tuned to your exact location and cloud cover.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Download the app</a></div>
  </div>
</div>` },
    { title: 'Theme-aware', description: 'By default meteors use the foreground color mixed with your accent.', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-meteors" data-count="20" data-angle="160"></div>
  <div class="bg-hero"><h2>Make a wish</h2><p>Twenty meteors at a shallower 160 degree angle.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-meteors', type: 'class', desc: 'Meteor container (spawns spans with JS).' },
    { name: 'data-count', type: 'attr', default: '14', desc: 'Number of meteors.' },
    { name: 'data-angle', type: 'attr', default: '145', desc: 'Travel direction in degrees.' },
    { name: '--meteor', type: 'var', desc: 'Meteor color.' }
  ]
});
