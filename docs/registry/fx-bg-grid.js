RanjDocs.add({
  id: 'bg-grid',
  name: 'Grid',
  group: 'Backgrounds',
  description: 'A fine line grid with a radial fade. Add a scanning light, or let random cells glow on and off.',
  tags: ['new', 'fx', 'js'],
  keywords: ['grid', 'lines', 'graph paper', 'blueprint', 'scan'],
  demos: [
    { title: 'Glowing cells', description: '<code>data-cells="10"</code> lights random cells (needs ranj.js). Without it the grid is pure CSS.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-line-grid" data-cells="10"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>v4</b> Edge functions in 30 regions</span>
    <h2>Deploy at the speed of thought</h2>
    <p>Push to main and your app is live worldwide in under ten seconds.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Deploy now</a><a class="btn btn-outline" href="#">Talk to sales</a></div>
  </div>
</div>` },
    { title: 'Scan line', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-line-grid bg-line-grid-scan" style="--cell:28px"></div>
  <div class="bg-hero">
    <h2>Security scanning, continuously</h2>
    <p>Every commit checked for leaked secrets and vulnerable packages.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Scan my repo</a></div>
  </div>
</div>` }
  ],
  api: [
    { name: '.bg-line-grid', type: 'class', desc: 'Line grid with radial mask.' },
    { name: '.bg-line-grid-scan', type: 'class', desc: 'Adds a light band sweeping down.' },
    { name: 'data-cells', type: 'attr', default: '—', desc: 'Number of randomly glowing cells (JS).' },
    { name: '--cell', type: 'var', default: '40px', desc: 'Cell size.' },
    { name: '--line', type: 'var', default: 'fg 10%', desc: 'Line color.' },
    { name: '--glow', type: 'var', default: '--primary', desc: 'Scan and cell color.' }
  ]
});
