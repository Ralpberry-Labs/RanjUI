RanjDocs.add({
  id: 'bg-retro-grid',
  name: 'Retro Grid',
  group: 'Backgrounds',
  description: 'A synthwave floor grid racing toward a glowing horizon, built with a single CSS perspective transform.',
  tags: ['new', 'fx'],
  keywords: ['synthwave', 'outrun', 'perspective', '80s', 'vaporwave', 'grid floor'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-retro-grid"></div>
  <div class="bg-hero" style="justify-content:flex-start;padding-top:3rem">
    <span class="bg-hero-badge"><b>Drop</b> Neon Highway vinyl, out now</span>
    <h2>Drive into the night</h2>
    <p>Twelve tracks of analog synths, recorded live to tape.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Listen now</a></div>
  </div>
</div>` },
    { title: 'Sunset palette', center: false, pad: false, height: 320, html: `
<div class="bg-host" style="height:320px;background:linear-gradient(#1a0b2e, #3b0d45 55%, #12051f);--bg:#12051f">
  <div class="bg-retro-grid" style="--line:#f472b6;--cell:44px;--speed:.9s"></div>
  <div class="bg-hero bg-hero-dark" style="justify-content:flex-start;padding-top:3rem"><h2 style="background:linear-gradient(#fde68a,#f472b6);-webkit-background-clip:text;background-clip:text;color:transparent">ARCADE 1986</h2><p>Insert coin to continue.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-retro-grid', type: 'class', desc: 'Perspective grid floor with a horizon glow.' },
    { name: '--line', type: 'var', default: 'primary 55%', desc: 'Grid line color.' },
    { name: '--cell', type: 'var', default: '56px', desc: 'Cell size.' },
    { name: '--angle', type: 'var', default: '68deg', desc: 'Tilt of the floor.' },
    { name: '--speed', type: 'var', default: '1.4s', desc: 'Time to travel one cell.' }
  ]
});
