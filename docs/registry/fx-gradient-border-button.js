RanjDocs.add({
  id: 'gradient-border-button',
  name: 'Gradient Border Button',
  group: 'Micro-interactions',
  description: 'A rotating conic gradient border. On hover the fill melts away and the gradient floods the button.',
  tags: ['new', 'fx'],
  keywords: ['gradient border', 'animated border', 'rainbow button', 'conic'],
  demos: [
    { title: 'Default', description: 'Hover to flood the button with the gradient.', html: `
<button class="gborder-btn">Upgrade to Pro</button>
<button class="gborder-btn" style="--g1:#22d3ee;--g2:#a78bfa;--g3:#f472b6">Generate with AI</button>
<button class="gborder-btn gborder-btn-static">Static gradient</button>` },
    { title: 'Keep the fill', description: '<code>.gborder-btn-keep</code> glows instead of filling on hover.', html: `
<button class="gborder-btn gborder-btn-keep" style="--bw:1.5px">Connect wallet</button>
<button class="gborder-btn gborder-btn-keep" style="--bw:3px;--g1:#f59e0b;--g2:#ef4444;--g3:#f59e0b">Hot deal</button>` }
  ],
  api: [
    { name: '.gborder-btn', type: 'class', desc: 'Rotating gradient border; fills on hover.' },
    { name: '.gborder-btn-static', type: 'class', desc: 'No rotation.' },
    { name: '.gborder-btn-keep', type: 'class', desc: 'Keep the inner fill on hover and glow instead.' },
    { name: '--g1 / --g2 / --g3 / --bw', type: 'var', desc: 'Gradient colors and border width.' }
  ]
});
