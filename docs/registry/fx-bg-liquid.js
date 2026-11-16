RanjDocs.add({
  id: 'bg-liquid',
  name: 'Liquid Swirl',
  group: 'Backgrounds',
  description: 'Psychedelic swirling paint that twists around the center. Turn on pixel mode for a retro card-game look.',
  tags: ['new', 'fx', 'js'],
  keywords: ['swirl', 'liquid', 'paint', 'psychedelic', 'balatro', 'marble', 'canvas'],
  demos: [
    { title: 'Smooth', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-liquid"></div>
  <div class="bg-hero bg-hero-dark">
    <span class="bg-hero-badge"><b>Fest</b> Doors open at 8pm</span>
    <h2 style="text-shadow:0 2px 24px rgb(0 0 0 / .35)">Kaleidoscope Night</h2>
    <p style="text-shadow:0 1px 12px rgb(0 0 0 / .4)">Live visuals, analog synths and a 4am sunrise set.</p>
    <div class="bg-hero-actions"><a class="btn btn-contrast" href="#">RSVP</a></div>
  </div>
</div>` },
    { title: 'Pixel mode', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-liquid" data-pixel data-res="8" data-colors="#ef4444,#2563eb,#111827"></div>
  <div class="bg-hero bg-hero-dark"><h2 style="font-family:var(--font-mono);letter-spacing:0">HIGH SCORE 1,048,576</h2></div>
</div>` }
  ],
  api: [
    { name: '.bg-liquid', type: 'class', desc: 'Canvas swirl.' },
    { name: 'data-colors', type: 'attr', default: '--c1, --c2, --c3', desc: 'Three paint colors.' },
    { name: 'data-swirl', type: 'attr', default: '2.6', desc: 'Twist strength.' },
    { name: 'data-pixel', type: 'attr', desc: 'Nearest-neighbour upscaling for a pixel-art look.' },
    { name: 'data-res', type: 'attr', default: '5', desc: 'Pixels per sample.' },
    { name: 'data-speed', type: 'attr', default: '1', desc: 'Flow speed.' }
  ]
});
