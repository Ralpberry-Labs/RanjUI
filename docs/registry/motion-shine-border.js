RanjDocs.add({
  id: 'shine-border',
  name: 'Shine Border',
  group: 'Interactions',
  description: 'A full multicolor gradient rotates around the border, optionally with a blurred glow behind the element or a gentle pulse.',
  tags: ['new', 'fx'],
  keywords: ['rainbow border', 'gradient border', 'conic border', 'glow', 'animated outline'],
  demos: [
    {
      title: 'Card with glow',
      height: 320,
      html: `
<div class="shine-border shine-border-glow demo-shine-border-card">
  <span class="demo-shine-border-tag">NEW</span>
  <h3>Ranj AI</h3>
  <p>Describe a screen, get production-ready Ranj UI markup in seconds.</p>
  <button class="btn btn-primary btn-sm">Try it free</button>
</div>`,
      css: `.demo-shine-border-card { width: min(100%, 340px); padding: 1.75rem; border-radius: var(--radius-2xl); background: var(--card); display: grid; gap: .6rem; justify-items: start; }
.demo-shine-border-card p { color: var(--muted-fg); font-size: .9rem; }
.demo-shine-border-tag { font-size: .7rem; font-weight: 800; letter-spacing: .12em; padding: .2rem .55rem; border-radius: 99px; background: linear-gradient(90deg, #a855f7, #3b82f6); color: #fff; }`
    },
    {
      title: 'Variants',
      height: 220,
      html: `
<div class="shine-border demo-shine-border-chip">Default</div>
<div class="shine-border shine-border-pulse demo-shine-border-chip" style="--shine-colors: #f97316, #facc15, #f43f5e, #f97316">Pulse · warm</div>
<div class="shine-border demo-shine-border-chip" style="--shine-width: 3px; --shine-speed: 3s; --shine-colors: #22d3ee, transparent 30%, transparent 70%, #22d3ee">Fast, partial</div>`,
      css: `.demo-shine-border-chip { padding: .9rem 1.3rem; border-radius: var(--radius-lg); background: var(--card); font-weight: 600; font-size: .9rem; }`
    }
  ],
  api: [
    { name: '.shine-border', type: 'class', desc: 'Rotating gradient border on any element.' },
    { name: '.shine-border-glow', type: 'class', desc: 'Adds a blurred glow behind.' },
    { name: '.shine-border-pulse', type: 'class', desc: 'Border breathes in opacity.' },
    { name: '--shine-colors', type: 'var', desc: 'Comma-separated conic stops (repeat the first at the end for a seamless loop).' },
    { name: '--shine-width / --shine-speed / --shine-inset', type: 'var', default: '2px / 7s / -1px', desc: 'Thickness, rotation time and offset.' }
  ]
});
