RanjDocs.add({
  id: 'wave-text',
  name: 'Wave Text',
  group: 'Text Effects',
  description: 'Letters bob in a continuous travelling wave. Variants scale, recolor or squash like jelly; a hover mode lifts each letter in sequence.',
  tags: ['new', 'fx', 'js'],
  keywords: ['bounce', 'bob', 'wavy', 'loading text', 'jelly'],
  demos: [
    {
      title: 'Variants',
      height: 300,
      html: `
<div class="demo-wave-text-list">
  <h2 data-wave-text>Loading your workspace…</h2>
  <h2 data-wave-text data-wave="scale">Scale wave</h2>
  <h2 data-wave-text data-wave="color" style="--wt-step: 50ms">Color sweep</h2>
  <h2 data-wave-text data-wave="jelly" style="--wt-dur: 2.2s">Jelly letters</h2>
</div>`,
      css: `.demo-wave-text-list { display: grid; gap: 1rem; text-align: center; }`
    },
    {
      title: 'Lift on hover',
      html: `
<a href="#" onclick="return false" class="demo-wave-text-link" data-wave-text data-trigger="hover">Hover this link</a>`,
      css: `.demo-wave-text-link { font-size: 2rem; font-weight: 800; color: var(--fg); text-decoration: none !important; letter-spacing: -.02em; }`
    }
  ],
  api: [
    { name: 'data-wave-text', type: 'attr', default: 'chars', desc: 'Enable; value <code>words</code> waves by word.' },
    { name: 'data-wave', type: 'attr', default: 'bob', desc: 'bob, scale, color, jelly.' },
    { name: 'data-trigger="hover"', type: 'attr', desc: 'Static until hovered, then letters lift in sequence.' },
    { name: '--wt-amp / --wt-dur / --wt-step', type: 'var', default: '.22em / 1.6s / 70ms', desc: 'Height, cycle length and per-letter offset.' }
  ]
});
