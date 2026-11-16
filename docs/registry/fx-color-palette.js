RanjDocs.add({
  id: 'color-palette',
  name: 'Color Palette',
  group: 'Micro-interactions',
  description: 'Swatches that spring wider on hover to reveal the name and hex. Click to copy. Text color adapts to each swatch.',
  tags: ['new', 'fx', 'js'],
  keywords: ['swatches', 'palette', 'colors', 'copy hex', 'brand colors'],
  demos: [
    { title: 'Brand palette', description: 'Hover a swatch, click to copy its hex.', height: 260, html: `
<div class="palette">
  <button class="palette-swatch" style="--c:#0f172a" data-name="Midnight"></button>
  <button class="palette-swatch" style="--c:#3730a3" data-name="Indigo"></button>
  <button class="palette-swatch" style="--c:#7c3aed" data-name="Violet"></button>
  <button class="palette-swatch" style="--c:#db2777" data-name="Fuchsia"></button>
  <button class="palette-swatch" style="--c:#fb923c" data-name="Apricot"></button>
  <button class="palette-swatch" style="--c:#fde68a" data-name="Butter"></button>
</div>` },
    { title: 'Your accent scale', description: 'Swatches can use CSS variables; hex values update when the theme or accent changes.', height: 260, html: `
<div class="palette" style="height:120px">
  <button class="palette-swatch" style="--c:oklch(.95 .03 var(--hue))" data-name="50"></button>
  <button class="palette-swatch" style="--c:oklch(.85 .08 var(--hue))" data-name="200"></button>
  <button class="palette-swatch" style="--c:oklch(.7 .16 var(--hue))" data-name="400"></button>
  <button class="palette-swatch" style="--c:var(--primary)" data-name="Primary"></button>
  <button class="palette-swatch" style="--c:oklch(.42 .18 var(--hue))" data-name="700"></button>
  <button class="palette-swatch" style="--c:oklch(.28 .12 var(--hue))" data-name="900"></button>
</div>` }
  ],
  api: [
    { name: '.palette', type: 'class', desc: 'Row of <code>.palette-swatch</code> buttons. <code>.palette-vertical</code> stacks them.' },
    { name: '--c', type: 'var', desc: 'Swatch color (any CSS color).' },
    { name: 'data-name / data-hex', type: 'attr', desc: 'Label, and an optional explicit hex to copy.' },
    { name: 'ranj:copy', type: 'event', desc: 'detail: { hex, name }' }
  ]
});
