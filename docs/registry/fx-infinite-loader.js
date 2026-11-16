RanjDocs.add({
  id: 'infinite-loader',
  name: 'Infinite Loader',
  group: 'Loaders',
  description: 'A glowing segment chasing itself around an infinity path. SVG drawn by ranj.js, animated with CSS.',
  tags: ['new', 'fx', 'js'],
  keywords: ['infinity', 'loop', 'lemniscate', 'svg loader', 'path animation'],
  demos: [
    { title: 'Default and gradient', html: `
<span class="loader-infinite"></span>
<span class="loader-infinite loader-infinite-gradient" style="--size:56px"></span>
<span class="loader-infinite" style="--size:28px;--color:var(--success)"></span>` },
    { title: 'Full-screen loading state', pad: false, center: false, height: 300, html: `
<div style="min-height:300px;display:grid;place-items:center;align-content:center;gap:1rem;text-align:center;background:var(--bg-subtle)">
  <span class="loader-infinite loader-infinite-gradient" style="--size:48px"></span>
  <div><b>Syncing your workspace</b><div style="color:var(--muted-fg);font-size:.88rem">Pulling 1,204 files from the cloud</div></div>
</div>` }
  ],
  api: [
    { name: '.loader-infinite', type: 'class', desc: 'Empty element; SVG injected. Width is 2 × <code>--size</code>.' },
    { name: '.loader-infinite-gradient', type: 'class', desc: 'Accent-to-complement gradient stroke.' },
    { name: '--size / --color', type: 'var', default: '40px / --primary', desc: 'Height and color.' }
  ]
});
