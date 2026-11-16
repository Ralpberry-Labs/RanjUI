(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'button',
    name: 'Button',
    group: 'Base',
    description: 'Thirteen variants from quiet ghost to glossy 3D, five sizes, icon-only and pill shapes, loading state, and keyboard hints. All v1 classes still work.',
    tags: ['js'],
    keywords: ['btn', 'cta', 'action', 'submit', 'gradient button', 'shine', 'glow', '3d', 'pushable', 'loading'],
    demos: [
      {
        title: 'Variants',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-link">Link</button>
<button class="btn btn-soft">Soft</button>
<button class="btn btn-destructive">Delete</button>
<button class="btn btn-success">${I('check')} Approve</button>
<button class="btn btn-contrast">Contrast</button>
</div>`
      },
      {
        title: 'Expressive',
        description: 'Gradient, shine sweep (hover), continuous shimmer, glow, glass and 3D pushable.',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn btn-gradient btn-lg">${I('sparkles')} Generate</button>
<button class="btn btn-shine btn-lg">Hover to shine</button>
<button class="btn btn-shimmer btn-contrast btn-lg btn-pill">Get early access ${I('arrowRight')}</button>
<button class="btn btn-glow btn-lg">${I('zap')} Upgrade to Pro</button>
<button class="btn btn-3d btn-lg">Press me</button>
<button class="btn btn-3d btn-success btn-lg">Claim reward</button>
</div>`,
        height: 200
      },
      {
        title: 'Glass',
        center: false,
        bg: 'none',
        pad: false,
        height: 220,
        html: `<div class="demo-button-glass">
  ${RB.art(0, 'demo-button-art')}
  <div class="cluster" style="position:relative;justify-content:center">
    <button class="btn btn-glass btn-lg">${I('play')} Watch trailer</button>
    <button class="btn btn-glass btn-lg btn-icon btn-pill" aria-label="Like">${I('heart')}</button>
  </div>
</div>`,
        css: '.demo-button-glass { position: relative; width: 100%; display: grid; place-items: center; min-height: 220px; overflow: hidden; }\n.demo-button-art { position: absolute; inset: 0; width: 100%; height: 100%; }\n.demo-button-glass .btn-glass { --btn-fg: #fff; --btn-bg: rgb(255 255 255 / .14); --btn-bg-hover: rgb(255 255 255 / .24); --btn-border: rgb(255 255 255 / .3); }'
      },
      {
        title: 'Sizes',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn btn-xs">Extra small</button>
<button class="btn btn-sm">Small</button>
<button class="btn">Medium</button>
<button class="btn btn-lg">Large</button>
<button class="btn btn-xl">Extra large</button>
</div>`
      },
      {
        title: 'Icons, pills and keyboard hints',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn btn-outline btn-icon" aria-label="Search">${I('search')}</button>
<button class="btn btn-secondary btn-icon btn-pill" aria-label="Notifications">${I('bell')}</button>
<button class="btn btn-icon btn-sm" aria-label="Add">${I('plus')}</button>
<button class="btn btn-pill">${I('download')} Download</button>
<button class="btn btn-outline">${I('search')} Search docs <kbd class="kbd">⌘K</kbd></button>
<button class="btn">Save changes <kbd class="kbd">⌘S</kbd></button>
</div>`
      },
      {
        title: 'Loading, disabled and full width',
        description: 'Click to load. Use <code>data-loading="true"</code> or <code>Ranj.button.loading(el, true)</code>; add <code>.btn-loading-inline</code> to keep the label visible.',
        html: `<div class="stack gap-3" style="width:min(100%,20rem)">
  <button class="btn btn-block demo-button-load">${I('send')} Send invoice</button>
  <button class="btn btn-outline btn-block btn-loading-inline" data-loading="true">Saving draft</button>
  <button class="btn btn-secondary btn-block" disabled>Disabled</button>
</div>`,
        js: "root.querySelector('.demo-button-load').addEventListener('click', function (e) {\n  var b = e.currentTarget; Ranj.button.loading(b, true);\n  setTimeout(function () { Ranj.button.loading(b, false); }, 1600);\n});"
      }
    ],
    api: [
      { name: '.btn', type: 'class', desc: 'Base button (primary). Works on <code>button</code> and <code>a</code>.' },
      { name: '.btn-secondary', type: 'class', desc: 'Variants. <code>.btn-soft</code> combines with a tone: <code>.btn-soft.btn-destructive</code>. Also: <code>.btn-outline</code> <code>.btn-ghost</code> <code>.btn-link</code> <code>.btn-soft</code> <code>.btn-destructive</code> <code>.btn-success</code> <code>.btn-warning</code> <code>.btn-contrast</code>' },
      { name: '.btn-gradient', type: 'class', desc: 'Expressive styles. Combine freely with variants and sizes. Also: <code>.btn-shine</code> <code>.btn-shimmer</code> <code>.btn-glow</code> <code>.btn-glass</code> <code>.btn-3d</code>' },
      { name: '.btn-xs / -sm / -lg / -xl', type: 'class', desc: 'Sizes (follow the density tokens <code>--control-h*</code>).' },
      { name: '.btn-icon', type: 'class', desc: 'Square icon-only, fully rounded, full width. Also: <code>.btn-pill</code> <code>.btn-block</code>' },
      { name: 'data-loading="true"', type: 'attr', desc: 'Shows a spinner, hides the label and blocks clicks. <code>.btn-loading</code> works too.' },
      { name: '.btn-loading-inline', type: 'class', desc: 'Keep the label visible next to the spinner.' },
      { name: '--btn-bg', type: 'var', desc: 'Per-button overrides for custom variants. Also: <code>--btn-fg</code> <code>--btn-bg-hover</code> <code>--btn-border</code> <code>--btn-h</code> <code>--btn-px</code> <code>--btn-radius</code>' },
      { name: '--btn-depth', type: 'var', default: '4px', desc: 'Depth of <code>.btn-3d</code>.' },
      { name: 'Ranj.button.loading(el, on)', type: 'js', desc: 'Toggle the loading state (also sets <code>disabled</code> and <code>aria-busy</code>).' }
    ]
  });
})();
