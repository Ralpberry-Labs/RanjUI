RanjDocs.add({
  id: 'glare-hover',
  name: 'Glare Hover',
  group: 'Interactions',
  description: 'A diagonal band of light sweeps across the surface on hover, like light catching glass. Pure CSS; a loop variant sweeps on its own.',
  tags: ['new', 'fx'],
  keywords: ['shine', 'sheen', 'glass', 'light sweep', 'hover shine'],
  demos: [
    {
      title: 'Cards & buttons',
      height: 300,
      html: `
<div class="glare-hover demo-glare-hover-card"><b>Hover me</b><span>The glare follows a 45° path.</span></div>
<button class="btn btn-primary btn-lg glare-hover">Upgrade to Pro</button>
<div class="glare-hover glare-hover-loop demo-glare-hover-card demo-glare-hover-dark" style="--glare-color: rgb(255 255 255 / .35)"><b>Looping</b><span>.glare-hover-loop</span></div>`,
      css: `.demo-glare-hover-card { width: 220px; height: 150px; border-radius: var(--radius-xl); padding: 1.25rem; display: flex; flex-direction: column; justify-content: flex-end; color: #fff; background: linear-gradient(135deg, #f97316, #db2777); box-shadow: var(--shadow-lg); }
.demo-glare-hover-card span { opacity: .8; font-size: .85rem; }
.demo-glare-hover-dark { background: linear-gradient(135deg, #1e293b, #0f172a); }`
    }
  ],
  api: [
    { name: '.glare-hover', type: 'class', desc: 'Sweep on hover / focus-visible.' },
    { name: '.glare-hover-loop', type: 'class', desc: 'Sweep automatically every 3.5s.' },
    { name: '--glare-color', type: 'var', default: 'rgb(255 255 255 / .55)', desc: 'Light color.' },
    { name: '--glare-angle / --glare-band / --glare-dur', type: 'var', default: '-45deg / 18% / 750ms', desc: 'Angle, band width and sweep time.' }
  ]
});
