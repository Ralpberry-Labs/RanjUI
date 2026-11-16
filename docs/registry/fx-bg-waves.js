RanjDocs.add({
  id: 'bg-waves',
  name: 'Waves',
  group: 'Backgrounds',
  description: 'Layered sine waves rolling across the bottom, or a bundle of thin flowing lines.',
  tags: ['new', 'fx', 'js'],
  keywords: ['waves', 'ocean', 'sine', 'flowing lines', 'canvas'],
  demos: [
    { title: 'Layered waves', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-waves"></div>
  <div class="bg-hero" style="justify-content:flex-start;padding-top:3.5rem">
    <span class="bg-hero-badge"><b>New</b> Tide tables for 4,000 beaches</span>
    <h2>Catch the perfect wave</h2>
    <p>Swell, wind and tide forecasts in one clean view.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Check today's surf</a></div>
  </div>
</div>` },
    { title: 'Flowing lines', center: false, pad: false, height: 320, html: `
<div class="bg-host" style="height:320px">
  <div class="bg-waves" data-style="lines" data-amplitude="34"></div>
  <div class="bg-hero"><h2>Sound, visualised</h2><p>Lossless streaming with a real-time spectrum.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-waves', type: 'class', desc: 'Canvas waves. Colors come from <code>--c1 … --c4</code>.' },
    { name: 'data-style', type: 'attr', default: 'fill', desc: '<code>fill</code> or <code>lines</code>.' },
    { name: 'data-layers', type: 'attr', default: '4', desc: 'Number of filled layers.' },
    { name: 'data-lines', type: 'attr', default: '22', desc: 'Line count in lines mode.' },
    { name: 'data-amplitude', type: 'attr', default: '28', desc: 'Wave height (px).' },
    { name: 'data-speed', type: 'attr', default: '1', desc: 'Speed multiplier.' }
  ]
});
