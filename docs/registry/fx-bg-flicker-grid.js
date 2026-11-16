RanjDocs.add({
  id: 'bg-flicker-grid',
  name: 'Flickering Grid',
  group: 'Backgrounds',
  description: 'Thousands of tiny squares twinkling at random, like a data center seen from far away.',
  tags: ['new', 'fx', 'js'],
  keywords: ['flicker', 'pixels', 'matrix', 'led', 'canvas'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-flicker-grid bg-fade"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>GPU</b> H200 clusters available</span>
    <h2>Compute for the next frontier</h2>
    <p>Spin up 8 to 4,096 GPUs in minutes, billed by the second.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Reserve capacity</a></div>
  </div>
</div>` },
    { title: 'Bigger pixels, faster', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-flicker-grid bg-fade-b" data-square="8" data-gap="4" data-rate="1.2" data-max="0.45" data-color="#f59e0b"></div>
  <div class="bg-hero"><h2>Retro LED wall</h2></div>
</div>` }
  ],
  api: [
    { name: '.bg-flicker-grid', type: 'class', desc: 'Canvas flickering grid.' },
    { name: 'data-square', type: 'attr', default: '4', desc: 'Square size (px).' },
    { name: 'data-gap', type: 'attr', default: '6', desc: 'Gap between squares (px).' },
    { name: 'data-rate', type: 'attr', default: '0.35', desc: 'Flicker chance per square per second.' },
    { name: 'data-max', type: 'attr', default: '0.32', desc: 'Max opacity.' },
    { name: 'data-color', type: 'attr', default: '--primary', desc: 'Square color.' }
  ]
});
