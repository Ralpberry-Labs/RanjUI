RanjDocs.add({
  id: 'bg-beams',
  name: 'Light Beams',
  group: 'Backgrounds',
  description: 'Glowing streaks fall along faint vertical rails while two soft light cones sweep behind them.',
  tags: ['new', 'fx', 'js'],
  keywords: ['beams', 'rails', 'streaks', 'falling lines', 'spotlight'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-beams"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Launch</b> Realtime sync is here</span>
    <h2>Data that moves at light speed</h2>
    <p>Sub-50ms sync between every client, server and edge cache.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Get the SDK</a><a class="btn btn-outline" href="#">Benchmarks</a></div>
  </div>
</div>` },
    { title: 'More beams, custom color', center: false, pad: false, height: 320, html: `
<div class="bg-host" style="height:320px">
  <div class="bg-beams" data-count="14" style="--gap:48px;--beam:#22d3ee"></div>
  <div class="bg-hero"><h2>Pipeline status: green</h2><p>1,284 jobs ran in the last hour.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-beams', type: 'class', desc: 'Rails and sweeping cones are CSS; falling beams need ranj.js.' },
    { name: 'data-count', type: 'attr', default: '7', desc: 'Number of falling beams.' },
    { name: '--gap', type: 'var', default: '72px', desc: 'Rail spacing.' },
    { name: '--beam', type: 'var', default: '--primary', desc: 'Beam color.' }
  ]
});
