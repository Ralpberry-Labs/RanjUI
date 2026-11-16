RanjDocs.add({
  id: 'gradient-text',
  name: 'Gradient Text',
  group: 'Text Effects',
  description: 'Text filled with a slowly flowing gradient. The default follows your accent hue; presets and a single CSS variable give you any palette.',
  tags: ['new', 'fx'],
  keywords: ['animated gradient', 'rainbow', 'colorful text', 'aurora'],
  demos: [
    {
      title: 'Hero',
      height: 260,
      html: `
<h1 class="display-1 demo-gradient-text-h">Design at the <span class="gradient-text">speed of thought</span></h1>`,
      css: `.demo-gradient-text-h { text-align: center; max-width: 820px; }`
    },
    {
      title: 'Presets',
      height: 320,
      html: `
<div class="demo-gradient-text-list">
  <h2 class="gradient-text gradient-text-aurora">Aurora</h2>
  <h2 class="gradient-text gradient-text-sunset">Sunset</h2>
  <h2 class="gradient-text gradient-text-ocean">Ocean</h2>
  <h2 class="gradient-text gradient-text-candy">Candy</h2>
  <h2 class="gradient-text gradient-text-mono">Monochrome</h2>
</div>`,
      css: `.demo-gradient-text-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem 2rem; width: 100%; max-width: 820px; text-align: center; }
.demo-gradient-text-list h2 { font-size: 2.25rem; }`
    },
    {
      title: 'Custom colors, angle & speed',
      description: 'Pass any comma-separated color list through <code>--gt-colors</code>.',
      html: `
<h2 class="gradient-text demo-gradient-text-custom" style="--gt-colors: #84cc16, #22d3ee, #6366f1, #84cc16; --gt-speed: 3s; --gt-angle: 120deg">Fresh greens &amp; blues</h2>
<h2 class="gradient-text gradient-text-static gradient-text-sunset demo-gradient-text-custom">Static, no motion</h2>`,
      css: `.demo-gradient-text-custom { font-size: 2.5rem; }`
    }
  ],
  api: [
    { name: '.gradient-text', type: 'class', desc: 'Animated gradient fill. Works inline across line breaks.' },
    { name: '.gradient-text-aurora / -sunset / -ocean / -candy / -mono', type: 'class', desc: 'Palette presets.' },
    { name: '.gradient-text-static', type: 'class', desc: 'No animation.' },
    { name: '--gt-colors', type: 'var', default: 'accent hues', desc: 'Comma-separated color stops.' },
    { name: '--gt-speed', type: 'var', default: '6s', desc: 'Half-cycle duration (it flows back and forth).' },
    { name: '--gt-angle / --gt-mult', type: 'var', default: '90deg / 3', desc: 'Gradient angle and how much wider than the text it is.' }
  ],
  notes: '<p>Combine with <a href="#/c/split-text">Split Text</a>: each piece receives its slice of the gradient, so the color stays continuous while letters animate.</p>'
});
