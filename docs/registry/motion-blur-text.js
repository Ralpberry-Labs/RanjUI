RanjDocs.add({
  id: 'blur-text',
  name: 'Blur Text',
  group: 'Text Effects',
  description: 'Words (or letters) sharpen out of a soft blur as they drop into place. A calmer cousin of Split Text, made for subheads and taglines.',
  tags: ['new', 'fx', 'js'],
  keywords: ['blur in', 'focus', 'text animation', 'fade'],
  demos: [
    {
      title: 'By word',
      height: 260,
      html: `
<h2 class="demo-blur-text-h" data-blur-text>Isn't this so cool?! Words come into focus one at a time.</h2>`,
      css: `.demo-blur-text-h { max-width: 640px; text-align: center; font-size: clamp(1.6rem, 1.2rem + 1.6vw, 2.5rem); }`
    },
    {
      title: 'By letter, from below',
      html: `
<h2 class="demo-blur-text-h" data-blur-text="chars" data-direction="bottom" data-stagger="35">Sharpen up.</h2>`,
      css: `.demo-blur-text-h { text-align: center; }`
    },
    {
      title: 'Hero subhead',
      height: 300,
      html: `
<div class="demo-blur-text-hero">
  <h1 class="display-2" data-blur-text data-stagger="90">Ship calm software.</h1>
  <p class="lead" data-blur-text data-stagger="30" data-delay="500">Observability for teams that would rather sleep through the night than babysit dashboards.</p>
</div>`,
      css: `.demo-blur-text-hero { text-align: center; max-width: 640px; display: grid; gap: 1rem; }`
    }
  ],
  api: [
    { name: 'data-blur-text', type: 'attr', default: 'words', desc: '<code>words</code> or <code>chars</code>.' },
    { name: 'data-direction', type: 'attr', default: 'top', desc: '<code>top</code> drops in from above, <code>bottom</code> rises.' },
    { name: 'data-stagger / data-delay / data-duration', type: 'attr', default: '60 / 0 / 900', desc: 'Timing in ms.' },
    { name: 'data-trigger / data-repeat', type: 'attr', desc: 'Same as Split Text.' }
  ]
});
