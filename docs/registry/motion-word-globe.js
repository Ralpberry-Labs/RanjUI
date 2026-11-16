RanjDocs.add({
  id: 'word-globe',
  name: 'Word Globe',
  group: 'Motion',
  description: 'Words evenly distributed on a 3D sphere that slowly spins, steers toward the pointer and can be dragged and flung with inertia. Depth drives scale, opacity and blur.',
  tags: ['new', 'fx', 'js'],
  keywords: ['tag cloud', 'sphere', '3d text', 'skills globe', 'orbital text', 'tag sphere'],
  demos: [
    {
      title: 'Skills globe',
      description: 'Drag to spin it; hover steers it.',
      height: 420,
      html: `
<div class="word-globe" style="--globe-size: 380px">
  <span class="wg-accent">HTML</span><span>CSS</span><span class="wg-accent">JavaScript</span><span>TypeScript</span><span>React</span><span>Vue</span><span>Svelte</span><span>Astro</span><span class="wg-accent">Figma</span><span>Node</span><span>Deno</span><span>Bun</span><span>Vite</span><span>Tailwind</span><span>Motion</span><span>A11y</span><span>WebGL</span><span>SVG</span><span>Canvas</span><span class="wg-accent">Ranj UI</span><span>Rust</span><span>Go</span><span>Postgres</span><span>Redis</span><span>GraphQL</span><span>Docker</span><span>Edge</span><span>Workers</span><span>OKLCH</span><span>Grid</span>
</div>`
    },
    {
      title: 'From data-words, tinted',
      height: 360,
      html: `
<div class="word-globe" style="--globe-size: 300px; --globe-color: var(--primary)" data-speed="1.6" data-words="design|motion|type|color|grid|space|rhythm|contrast|depth|texture|balance|scale|weight|tone|form|light"></div>`
    }
  ],
  api: [
    { name: '.word-globe', type: 'class', desc: 'Container; each child is a word (or use <code>data-words</code>).' },
    { name: '.wg-accent', type: 'class', desc: 'Highlight a word.' },
    { name: 'data-words', type: 'attr', desc: 'Pipe-separated words to generate.' },
    { name: 'data-speed', type: 'attr', default: '1', desc: 'Auto-rotation and steering multiplier.' },
    { name: 'data-radius', type: 'attr', default: '0.78', desc: 'Sphere radius as a fraction of half the width.' },
    { name: '--globe-size / --globe-color / --globe-accent', type: 'var', default: '340px / var(--fg) / var(--primary)', desc: 'Size and colors.' }
  ]
});
