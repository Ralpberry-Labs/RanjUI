RanjDocs.add({
  id: 'text-pressure',
  name: 'Text Pressure',
  group: 'Text Effects',
  description: 'Letters near the cursor swell in weight and height using the Inter variable font axis, easing back as the pointer moves away.',
  tags: ['new', 'fx', 'js'],
  keywords: ['variable font', 'font weight', 'cursor', 'proximity', 'hover text', 'interactive type'],
  demos: [
    {
      title: 'Move across the word',
      height: 300,
      html: `
<div class="demo-text-pressure-area">
  <h1 class="demo-text-pressure-h" data-text-pressure data-min="200" data-max="900">PRESSURE</h1>
  <p>Move your pointer over the letters</p>
</div>`,
      css: `.demo-text-pressure-area { width: 100%; padding: 2rem 0; display: grid; justify-items: center; gap: 1rem; }
.demo-text-pressure-h { font-family: var(--font-sans); font-size: clamp(3rem, 1rem + 9vw, 8rem); letter-spacing: -.02em; }
.demo-text-pressure-area p { color: var(--muted-fg); font-size: .85rem; }`
    },
    {
      title: 'Subtle, weight only',
      html: `
<h2 class="demo-text-pressure-sub" data-text-pressure data-min="300" data-max="800" data-scale="0" data-radius="120">Hover over this sentence</h2>`,
      css: `.demo-text-pressure-sub { font-family: var(--font-sans); font-size: 2.25rem; letter-spacing: -.02em; }`
    }
  ],
  api: [
    { name: 'data-text-pressure', type: 'attr', desc: 'Enable on a heading. Uses <code>font-variation-settings: "wght"</code>, so a variable font (Inter) is required.' },
    { name: 'data-min / data-max', type: 'attr', default: '300 / 900', desc: 'Weight range.' },
    { name: 'data-radius', type: 'attr', default: '2.6 × font size', desc: 'Influence radius in px.' },
    { name: 'data-scale', type: 'attr', default: '0.18', desc: 'Extra vertical stretch at full pressure (0 to disable).' },
    { name: 'data-area', type: 'attr', default: 'parent', desc: 'Selector of the element that listens for the pointer; or mark an ancestor with <code>data-pressure-area</code>.' }
  ]
});
