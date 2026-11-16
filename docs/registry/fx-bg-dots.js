RanjDocs.add({
  id: 'bg-dots',
  name: 'Dot Pattern',
  group: 'Backgrounds',
  description: 'A soft dot matrix that fades at the edges. Move the cursor over it and a spotlight of accent dots follows.',
  tags: ['new', 'fx', 'js'],
  keywords: ['dots', 'pattern', 'spotlight', 'hover', 'matrix'],
  demos: [
    { title: 'Hover spotlight', description: 'Move your pointer over the hero.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-dot-pattern"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>AI</b> Now with natural language search</span>
    <h2>Find anything in your docs</h2>
    <p>Ask a question, get the exact paragraph. Works across Notion, Drive and GitHub.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Try it free</a></div>
  </div>
</div>` },
    { title: 'Dense, larger spotlight', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-dot-pattern" style="--gap:14px;--dot:1px;--spot-size:260px;--spot:oklch(.7 .2 calc(var(--hue) + 60))"></div>
  <div class="bg-hero"><h2>Hover me</h2><p>Spotlight size, dot gap and colors are all CSS variables.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-dot-pattern', type: 'class', desc: 'Dot matrix layer. Spotlight needs ranj.js.' },
    { name: 'data-no-spotlight', type: 'attr', desc: 'Disable the cursor spotlight.' },
    { name: '--gap', type: 'var', default: '22px', desc: 'Distance between dots.' },
    { name: '--dot', type: 'var', default: '1.3px', desc: 'Dot radius.' },
    { name: '--dot-color / --spot', type: 'var', desc: 'Base and spotlight colors.' },
    { name: '--spot-size', type: 'var', default: '180px', desc: 'Spotlight radius.' }
  ]
});
