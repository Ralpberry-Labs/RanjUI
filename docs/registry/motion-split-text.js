RanjDocs.add({
  id: 'split-text',
  name: 'Split Text',
  group: 'Text Effects',
  description: 'Splits a heading into characters, words or lines and reveals them with a stagger when it scrolls into view. Seven entrance effects, any order, and inline markup like gradient text is kept intact.',
  tags: ['new', 'fx', 'js'],
  keywords: ['text animation', 'stagger', 'reveal', 'letters', 'chars', 'words', 'lines', 'headline', 'hero'],
  demos: [
    {
      title: 'Hero headline',
      description: 'Characters rise in with a 28ms stagger, the gradient survives the split, and the lead paragraph blurs in by word.',
      height: 340,
      html: `
<div class="demo-split-text-hero">
  <span class="badge badge-soft" data-blur-text data-delay="0">Ranj UI v2 is here</span>
  <h1 class="display-2" data-split-text="chars" data-stagger="24" data-delay="150">Build interfaces that <span class="gradient-text">feel alive</span></h1>
  <p class="lead" data-split-text="words" data-effect="blur" data-stagger="35" data-delay="900">Zero-dependency components with motion baked in. Copy, paste, ship.</p>
</div>`,
      css: `.demo-split-text-hero { text-align: center; max-width: 760px; display: grid; justify-items: center; gap: 1rem; }`
    },
    {
      title: 'Effects',
      description: 'Set <code>data-effect</code> to fade-up (default), fade, fade-down, blur, rotate-in, scale, flip, mask or elastic. Press Replay to watch again.',
      height: 380,
      html: `
<div class="demo-split-text-grid">
  <div><small>fade-up</small><h2 data-split-text>Momentum</h2></div>
  <div><small>blur</small><h2 data-split-text data-effect="blur">Momentum</h2></div>
  <div><small>rotate-in</small><h2 data-split-text data-effect="rotate-in">Momentum</h2></div>
  <div><small>scale</small><h2 data-split-text data-effect="scale">Momentum</h2></div>
  <div><small>flip</small><h2 data-split-text data-effect="flip" data-stagger="45">Momentum</h2></div>
  <div><small>mask</small><h2 data-split-text data-effect="mask">Momentum</h2></div>
  <div><small>elastic</small><h2 data-split-text data-effect="elastic" data-stagger="40">Momentum</h2></div>
  <div><small>order: center</small><h2 data-split-text data-effect="scale" data-order="center" data-stagger="50">Momentum</h2></div>
</div>`,
      css: `.demo-split-text-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1rem; width: 100%; max-width: 900px; }
.demo-split-text-grid > div { padding: 1.25rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); text-align: center; }
.demo-split-text-grid small { display: block; color: var(--muted-fg); font-family: var(--font-mono); font-size: .72rem; margin-bottom: .35rem; }
.demo-split-text-grid h2 { font-size: 1.9rem; }`
    },
    {
      title: 'Lines with mask',
      description: 'Line mode groups words by their rendered row; combined with the mask effect each line slides up from behind a clip.',
      height: 300,
      html: `
<p class="demo-split-text-quote" data-split-text="lines" data-effect="mask" data-stagger="140">“Motion is the difference between an interface that works and one that people remember. Every transition should explain where something came from and where it went.”</p>`,
      css: `.demo-split-text-quote { max-width: 620px; font-family: var(--font-display); font-size: clamp(1.25rem, 1rem + 1vw, 1.75rem); font-weight: 600; line-height: 1.35; letter-spacing: -.02em; text-align: center; }`
    },
    {
      title: 'Replay on hover',
      description: '<code>data-trigger="hover"</code> plays once on load and replays every time the pointer enters.',
      html: `
<a href="#" class="demo-split-text-link" data-split-text data-trigger="hover" data-effect="flip" data-stagger="22" onclick="return false">Hover to replay this →</a>`,
      css: `.demo-split-text-link { font-size: 1.5rem; font-weight: 700; color: var(--fg); text-decoration: none !important; }`
    }
  ],
  api: [
    { name: 'data-split-text', type: 'attr', default: 'chars', desc: 'Split mode: <code>chars</code>, <code>words</code> or <code>lines</code>.' },
    { name: 'data-effect', type: 'attr', default: 'fade-up', desc: 'fade-up, fade, fade-down, blur, rotate-in, scale, flip, mask, elastic.' },
    { name: 'data-stagger', type: 'attr', default: '30', desc: 'Milliseconds between pieces (lines default to 120).' },
    { name: 'data-duration', type: 'attr', default: '700', desc: 'Per-piece animation length in ms.' },
    { name: 'data-delay', type: 'attr', default: '0', desc: 'Delay before the first piece, in ms.' },
    { name: 'data-order', type: 'attr', default: 'start', desc: 'start, end, center or random.' },
    { name: 'data-trigger', type: 'attr', default: 'view', desc: '<code>view</code> (on scroll into view), <code>load</code>, or <code>hover</code> (replays on pointer enter).' },
    { name: 'data-repeat', type: 'attr', default: 'false', desc: 'Re-hide when leaving the viewport and replay on re-entry.' },
    { name: 'data-split-skip', type: 'attr', desc: 'Put on a child element to leave its text unsplit.' },
    { name: '--st-ease', type: 'var', default: 'var(--ease-out)', desc: 'Timing function. Also <code>--st-distance</code> (rise distance, default .6em).' },
    { name: 'Ranj.splitText(el, mode)', type: 'js', desc: 'Low-level splitter. Returns <code>{ pieces, words, chars, restore() }</code>.' },
    { name: 'ranj:done', type: 'event', desc: 'Fires after the last piece finished.' }
  ],
  notes: '<p>The parent keeps an <code>aria-label</code> with the full sentence and every piece is <code>aria-hidden</code>, so screen readers read it normally. With reduced motion the text appears immediately.</p>'
});
