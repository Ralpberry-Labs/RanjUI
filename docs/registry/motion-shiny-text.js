RanjDocs.add({
  id: 'shiny-text',
  name: 'Shiny Text',
  group: 'Text Effects',
  description: 'A soft band of light sweeps across muted text on a loop. Pure CSS, great for announcement pills and secondary buttons.',
  tags: ['new', 'fx'],
  keywords: ['shimmer', 'shine', 'sheen', 'gloss', 'announcement'],
  demos: [
    {
      title: 'Announcement pill',
      html: `
<a href="#" class="demo-shiny-text-pill" onclick="return false">
  <span class="demo-shiny-text-dot"></span>
  <span class="shiny-text">Introducing Ranj UI v2 — 160 components</span>
  <span aria-hidden="true">→</span>
</a>`,
      css: `.demo-shiny-text-pill { display: inline-flex; align-items: center; gap: .6rem; padding: .45rem .9rem .45rem .6rem; border-radius: 99px; border: 1px solid var(--border); background: var(--card); font-size: .875rem; font-weight: 500; color: var(--muted-fg); text-decoration: none !important; box-shadow: var(--shadow-sm); }
.demo-shiny-text-dot { width: .5rem; height: .5rem; border-radius: 50%; background: var(--success); box-shadow: 0 0 0 4px color-mix(in oklab, var(--success) 25%, transparent); }`
    },
    {
      title: 'Display size & colors',
      height: 280,
      html: `
<div class="demo-shiny-text-stack">
  <h2 class="display-2 shiny-text">Shine on.</h2>
  <h3 class="shiny-text shiny-text-primary" style="--shine-speed: 2.2s">Primary tint, faster</h3>
  <h3 class="shiny-text shiny-text-gold">Gold edition</h3>
</div>`,
      css: `.demo-shiny-text-stack { display: grid; gap: .5rem; text-align: center; }`
    },
    {
      title: 'Only while hovered',
      html: `
<button class="btn btn-outline btn-lg"><span class="shiny-text shiny-text-hover">Hover me to shine</span></button>`
    }
  ],
  api: [
    { name: '.shiny-text', type: 'class', desc: 'Base effect.' },
    { name: '.shiny-text-primary / .shiny-text-gold', type: 'class', desc: 'Color presets.' },
    { name: '.shiny-text-hover', type: 'class', desc: 'Pauses until the text (or its parent) is hovered.' },
    { name: '--shine-speed', type: 'var', default: '3s', desc: 'Loop length.' },
    { name: '--shine-base / --shine-color', type: 'var', desc: 'Resting text color and highlight color.' },
    { name: '--shine-width / --shine-angle', type: 'var', default: '30% / 110deg', desc: 'Band width and angle.' }
  ]
});
