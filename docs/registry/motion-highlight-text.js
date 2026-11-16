RanjDocs.add({
  id: 'highlight-text',
  name: 'Highlight Text',
  group: 'Text Effects',
  description: 'Hand-drawn annotations that draw themselves when the text scrolls into view: marker, underline, scribble, double, circle, box and strike-through.',
  tags: ['new', 'fx', 'js'],
  keywords: ['marker', 'annotate', 'rough notation', 'underline', 'circle', 'emphasis', 'highlighter'],
  demos: [
    {
      title: 'In a paragraph',
      height: 300,
      html: `
<p class="demo-highlight-text-p">
  Ranj UI is <mark class="hl-text">zero dependency</mark>, so it works in
  <mark class="hl-text" data-variant="underline" data-delay="500">any stack</mark>. It ships
  <mark class="hl-text" data-variant="circle" data-delay="1000">160+</mark> components that are
  <mark class="hl-text" data-variant="box" data-delay="1500">accessible</mark> by default, and it's
  <mark class="hl-text" data-variant="strike" data-delay="2000">expensive</mark> free forever.
</p>`,
      css: `.demo-highlight-text-p { max-width: 640px; font-size: clamp(1.25rem, 1rem + 1vw, 1.75rem); font-weight: 600; line-height: 1.7; letter-spacing: -.015em; text-align: center; }`
    },
    {
      title: 'All variants',
      height: 280,
      html: `
<div class="demo-highlight-text-grid">
  <span><mark class="hl-text">marker</mark></span>
  <span><mark class="hl-text" data-variant="underline">underline</mark></span>
  <span><mark class="hl-text" data-variant="scribble">scribble</mark></span>
  <span><mark class="hl-text" data-variant="double">double</mark></span>
  <span><mark class="hl-text" data-variant="circle">circle</mark></span>
  <span><mark class="hl-text" data-variant="box">box</mark></span>
  <span><mark class="hl-text" data-variant="strike">strike</mark></span>
  <span><mark class="hl-text" data-variant="underline" style="--hl-stroke: var(--destructive); --hl-width: 4px">custom</mark></span>
</div>`,
      css: `.demo-highlight-text-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1.75rem 1rem; width: 100%; max-width: 720px; text-align: center; font-size: 1.4rem; font-weight: 700; }`
    }
  ],
  api: [
    { name: '.hl-text', type: 'class', desc: 'Put on a <code>&lt;mark&gt;</code> or <code>&lt;span&gt;</code>. Default is a marker highlight that wraps across lines.' },
    { name: 'data-variant', type: 'attr', default: 'marker', desc: 'marker, underline, scribble, double, circle, box, strike (SVG variants are single-line).' },
    { name: 'data-delay / data-duration', type: 'attr', default: '0 / 900', desc: 'Milliseconds; chain several by staggering delays.' },
    { name: 'data-trigger / data-repeat', type: 'attr', default: 'view / false', desc: '<code>load</code> or <code>hover</code>; repeat redraws on re-entry.' },
    { name: '--hl-color', type: 'var', default: 'soft yellow', desc: 'Marker fill.' },
    { name: '--hl-stroke / --hl-width', type: 'var', default: 'var(--primary) / 2.5px', desc: 'Line color and thickness.' }
  ]
});
