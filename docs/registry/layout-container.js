(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'container',
    name: 'Container',
    group: 'Layout',
    description: 'Centers content with a max width and fluid side padding that grows from 1rem on phones to 2rem on desktop.',
    keywords: ['wrapper', 'max-width', 'page', 'section', 'layout'],
    demos: [
      {
        title: 'Sizes',
        description: 'Each band is a container; the dashed area is the padding.',
        center: false,
        pad: false,
        html: `<div class="demo-container-bands">
  <div class="container container-xs"><div>container-xs · 480px</div></div>
  <div class="container container-sm"><div>container-sm · 640px</div></div>
  <div class="container container-md"><div>container-md · 768px</div></div>
  <div class="container container-lg"><div>container-lg · 1024px</div></div>
  <div class="container"><div>container · 1200px</div></div>
</div>`,
        css: `.demo-container-bands { display: grid; gap: .6rem; padding: 1.5rem 0; }
.demo-container-bands .container { background: repeating-linear-gradient(-45deg, transparent 0 6px, color-mix(in oklab, var(--primary) 9%, transparent) 6px 7px); }
.demo-container-bands .container > div { padding: .65rem 1rem; border-radius: var(--radius); background: var(--primary-soft); color: var(--primary-soft-fg); font-family: var(--font-mono); font-size: .75rem; font-weight: 500; border: 1px solid color-mix(in oklab, var(--primary) 30%, transparent); }`
      },
      {
        title: 'Page section',
        description: 'Combine <code>.section</code>, <code>.container</code> and <code>.section-header</code> for a landing-page band.',
        center: false,
        pad: false,
        html: `<section class="section section-sm section-muted">
  <div class="container container-lg">
    <div class="section-header">
      <span class="eyebrow">Why teams switch</span>
      <h2 class="h2">Everything you need, nothing you don't</h2>
      <p class="lead">Fast to start, easy to theme, and built to last for years.</p>
    </div>
    <div class="grid grid-auto" style="--min:220px;--gap:1.5rem">
      <div class="feature"><span class="icon-box">${I('zap')}</span><div class="feature-title">Fast by default</div><p class="feature-text">55 KB of gzipped CSS for 150+ components, no runtime framework.</p></div>
      <div class="feature"><span class="icon-box">${I('palette')}</span><div class="feature-title">One-hue theming</div><p class="feature-text">Change <code>--hue</code> and every state color follows.</p></div>
      <div class="feature"><span class="icon-box">${I('shield')}</span><div class="feature-title">Accessible</div><p class="feature-text">Keyboard support, focus rings and ARIA wired in.</p></div>
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.container', type: 'class', desc: 'Centered, max 1200px, fluid padding.' },
      { name: '.container-sm', type: 'class', desc: 'Sizes <code>.container-xs</code> <code>-sm</code> <code>-md</code> <code>-lg</code> <code>-xl</code> <code>-2xl</code>: 480 / 640 / 768 / 1024 / 1280 / 1440px.' },
      { name: '.container-prose', type: 'class', desc: '68ch reading width, no max width, no padding. Also: <code>.container-full</code> <code>.container-flush</code>' },
      { name: '--container-max', type: 'var', desc: 'Override the width or padding for any container. Also: <code>--container-pad</code>' },
      { name: '.section', type: 'class', desc: 'Vertical rhythm for page bands. Also: <code>.section-sm</code> <code>.section-lg</code> <code>.section-muted</code>' },
      { name: '.section-header', type: 'class', desc: 'Centered eyebrow + heading + lead block; add <code>.align-start</code> for left aligned.' }
    ]
  });
})();
