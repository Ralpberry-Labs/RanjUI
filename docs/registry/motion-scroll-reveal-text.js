RanjDocs.add({
  id: 'scroll-reveal-text',
  name: 'Scroll Reveal Text',
  group: 'Text Effects',
  description: 'A paragraph whose words light up one after another as you scroll through it, scrubbed directly by scroll position. Works in the page or any scroll container.',
  tags: ['new', 'fx', 'js'],
  keywords: ['scroll text', 'scrub', 'reading', 'opacity', 'apple style'],
  demos: [
    {
      title: 'Scroll inside the box',
      description: 'Scroll the panel; words brighten as the paragraph passes through the viewport.',
      pad: false,
      center: false,
      html: `
<div class="demo-scroll-reveal-text-box">
  <p class="demo-scroll-reveal-text-hint">Scroll ↓</p>
  <p class="demo-scroll-reveal-text-p" data-scroll-reveal>
    We believe the best interfaces disappear. They respond before you finish the thought, explain themselves through motion, and never make you wait. Every component in Ranj UI is built around that idea — small, fast, accessible, and genuinely delightful to use.
  </p>
  <div class="demo-scroll-reveal-text-end"></div>
</div>`,
      css: `.demo-scroll-reveal-text-box { height: 380px; overflow-y: auto; padding: 0 clamp(1rem, 5vw, 4rem); }
.demo-scroll-reveal-text-hint { height: 300px; display: grid; place-items: center; color: var(--muted-fg); font-size: .875rem; }
.demo-scroll-reveal-text-p { font-family: var(--font-display); font-size: clamp(1.5rem, 1rem + 2vw, 2.5rem); font-weight: 700; line-height: 1.25; letter-spacing: -.03em; max-width: 820px; margin: 0 auto; }
.demo-scroll-reveal-text-end { height: 300px; }`
    },
    {
      title: 'With blur and tilt',
      pad: false,
      center: false,
      html: `
<div class="demo-scroll-reveal-text-box">
  <p class="demo-scroll-reveal-text-hint">Scroll ↓</p>
  <p class="demo-scroll-reveal-text-p" data-scroll-reveal data-blur data-rotate>
    Motion should feel like physics, not decoration. When it is done right, nobody notices the animation — they just notice that everything makes sense.
  </p>
  <div class="demo-scroll-reveal-text-end"></div>
</div>`,
      css: ``
    }
  ],
  api: [
    { name: 'data-scroll-reveal', type: 'attr', desc: 'Enable on a paragraph or heading.' },
    { name: 'data-start / data-end', type: 'attr', default: '0.9 / 0.35', desc: 'Viewport fractions where the reveal starts (top edge) and finishes (bottom edge).' },
    { name: 'data-blur', type: 'attr', desc: 'Unrevealed words are also blurred.' },
    { name: 'data-rotate', type: 'attr', desc: 'Paragraph straightens from a 3° tilt as it reveals.' },
    { name: '--sr-min', type: 'var', default: '.14', desc: 'Opacity of words not yet revealed.' },
    { name: '--p', type: 'var', desc: 'Live progress 0–1 written on the element; use it in your own CSS.' }
  ]
});
