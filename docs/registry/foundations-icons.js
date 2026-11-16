(function () {
  var I = RB.ic;
  var names = ['search', 'bell', 'settings', 'user', 'mail', 'calendar', 'heart', 'star', 'download', 'upload', 'trash', 'edit', 'lock', 'globe', 'zap', 'rocket', 'cloud', 'database', 'terminal', 'git', 'chart', 'layers', 'shield', 'package'];
  RanjDocs.add({
    id: 'icons',
    name: 'Icons',
    group: 'Foundations',
    description: 'Ranj UI ships no icon font. Paste inline SVG (we recommend <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a>): icons inherit <code>currentColor</code> and size themselves inside buttons, badges, chips and inputs.',
    tags: ['new'],
    keywords: ['svg', 'lucide', 'heroicons', 'icon', 'glyph', 'symbol'],
    demos: [
      {
        title: 'Inline SVG grid',
        description: 'Copy any SVG from Lucide. Use <code>stroke="currentColor"</code> so color follows text.',
        center: false,
        html: '<div class="demo-icons-grid">\n' + names.map(function (n) { return '  <div title="' + n + '">' + I(n) + '<span>' + n + '</span></div>'; }).join('\n') + '\n</div>',
        css: `.demo-icons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: .5rem; }
.demo-icons-grid > div { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 1rem .5rem .75rem; border-radius: var(--radius-lg); border: 1px solid transparent; color: var(--fg); transition: background var(--transition), border-color var(--transition), color var(--transition); }
.demo-icons-grid > div:hover { background: var(--card); border-color: var(--border); color: var(--primary); }
.demo-icons-grid svg { width: 1.5rem; height: 1.5rem; }
.demo-icons-grid span { font-size: .7rem; color: var(--muted-fg); }`
      },
      {
        title: 'Sizes, stroke and color',
        description: 'Set width/height (or <code>.size-4</code>, <code>.size-5</code>, <code>.size-6</code>), change <code>stroke-width</code>, and color with any text utility.',
        html: `<div class="cluster" style="gap:1.5rem">
  <span class="size-4">${I('rocket', 'class="size-4"')}</span>
  ${I('rocket', 'class="size-5"')}
  ${I('rocket', 'class="size-6"')}
  ${I('rocket', 'class="size-8" stroke-width="1.5"')}
  ${I('rocket', 'class="size-10" stroke-width="1.25"')}
  <span class="separator-vertical separator" style="height:2rem"></span>
  ${I('heart', 'class="size-6 text-destructive"')}
  ${I('checkCircle', 'class="size-6 text-success"')}
  ${I('alert', 'class="size-6 text-warning"')}
  ${I('sparkles', 'class="size-6 text-primary"')}
</div>`
      },
      {
        title: 'Icons inside components',
        description: 'No extra classes needed: components size their icons at about 1.1em.',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn">${I('download')} Download</button>
<button class="btn btn-outline">Continue ${I('arrowRight')}</button>
<button class="btn btn-secondary btn-icon" aria-label="Settings">${I('settings')}</button>
<span class="badge badge-soft badge-success">${I('check')} Verified</span>
<span class="chip">${I('mapPin')} Lisbon</span>
<span class="icon-box">${I('zap')}</span>
</div>`
      },
      {
        title: 'Using Lucide from a CDN',
        description: 'Prefer not to paste SVG? Load Lucide once and use <code>&lt;i data-lucide="name"&gt;</code>. Ranj UI styles the generated SVG the same way.',
        center: false,
        html: `<div class="code-block" data-lang="html">
  <div class="code-block-header"><span class="code-block-filename">${I('fileCode')} index.html</span><button class="code-block-copy" aria-label="Copy code">${I('copy', 'class="icon-copy"')}${I('check', 'class="icon-done"')}</button></div>
  <pre><code>&lt;script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"&gt;&lt;/script&gt;

&lt;button class="btn"&gt;&lt;i data-lucide="download"&gt;&lt;/i&gt; Download&lt;/button&gt;

&lt;script&gt;
  lucide.createIcons();
  // Re-run after injecting HTML, or on ranj:ready
  document.addEventListener('ranj:ready', () =&gt; lucide.createIcons());
&lt;/script&gt;</code></pre>
</div>`
      }
    ],
    api: [
      { name: '.btn > svg', type: 'class', desc: 'Auto-sized to the component (about 1–1.1em) and non-interactive. Also: <code>.badge > svg</code> <code>.chip > svg</code>' },
      { name: '.size-4', type: 'class', desc: 'Square sizing utilities for icons. Also: <code>.size-5</code> <code>.size-6</code> <code>.size-8</code> <code>.size-10</code>' },
      { name: 'stroke="currentColor"', type: 'attr', desc: 'Lets icons follow the surrounding text color, including hover and dark mode.' },
      { name: 'aria-hidden="true"', type: 'attr', desc: 'Decorative icons should be hidden; icon-only buttons need an <code>aria-label</code>.' }
    ]
  });
})();
