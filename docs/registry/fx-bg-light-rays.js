RanjDocs.add({
  id: 'bg-light-rays',
  name: 'Light Rays',
  group: 'Backgrounds',
  description: 'God rays pour down from the top and sway slowly, like light through a cathedral window.',
  tags: ['new', 'fx'],
  keywords: ['god rays', 'sun rays', 'spotlight', 'volumetric light'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-light-rays"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Studio</b> Now with 8K exports</span>
    <h2>Every frame, perfectly lit</h2>
    <p>Pro color grading in your browser. No installs, no render farm.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Open the studio</a><a class="btn btn-outline" href="#">Watch reel</a></div>
  </div>
</div>` },
    { title: 'Warm rays on dark', center: false, pad: false, height: 320, html: `
<div class="bg-host" style="height:320px;background:#0c0a09">
  <div class="bg-light-rays" style="--ray:#fcd34d;--opacity:.6"></div>
  <div class="bg-hero bg-hero-dark"><h2>Golden hour, all day</h2><p>Smart bulbs that follow the sun.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-light-rays', type: 'class', desc: 'Two layers of conic rays with soft sway.' },
    { name: '--ray', type: 'var', default: 'primary + white', desc: 'Ray color.' },
    { name: '--opacity', type: 'var', default: '.55', desc: 'Ray strength.' },
    { name: '--speed', type: 'var', default: '14s', desc: 'Sway cycle.' }
  ]
});
