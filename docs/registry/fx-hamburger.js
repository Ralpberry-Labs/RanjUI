RanjDocs.add({
  id: 'hamburger',
  name: 'Hamburger',
  group: 'Micro-interactions',
  description: 'Menu icons that morph into a close X or a back arrow. Five motion styles, all CSS transitions.',
  tags: ['new', 'fx', 'js'],
  keywords: ['menu icon', 'burger', 'nav toggle', 'close', 'x'],
  demos: [
    { title: 'Variants', description: 'Click each one.', html: `
<div class="demo-ham-row">
  <div><button class="hamburger" aria-label="Menu"></button><small>Default</small></div>
  <div><button class="hamburger hamburger-spin" aria-label="Menu"></button><small>Spin</small></div>
  <div><button class="hamburger hamburger-arrow" aria-label="Menu"></button><small>Arrow</small></div>
  <div><button class="hamburger hamburger-squeeze" aria-label="Menu"></button><small>Squeeze</small></div>
  <div><button class="hamburger hamburger-stagger" aria-label="Menu"></button><small>Stagger</small></div>
</div>`, css: `
.demo-ham-row { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; }
.demo-ham-row > div { display: flex; flex-direction: column; align-items: center; gap: .4rem; }
.demo-ham-row small { color: var(--muted-fg); font-size: .75rem; }` },
    { title: 'Controls a menu', description: '<code>aria-controls</code> sets <code>data-state</code> on the target.', height: 300, center: false, html: `
<div class="demo-ham-nav">
  <header><b>Northwind</b><button class="hamburger hamburger-spin" aria-controls="hamburger-demo-menu" aria-label="Menu"></button></header>
  <nav id="hamburger-demo-menu" data-state="closed"><a href="#">Products</a><a href="#">Pricing</a><a href="#">Customers</a><a href="#">Careers</a></nav>
</div>`, css: `
.demo-ham-nav { width: min(380px, 100%); margin: 1.5rem auto; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); overflow: hidden; }
.demo-ham-nav header { display: flex; align-items: center; justify-content: space-between; padding: .4rem .5rem .4rem 1rem; }
.demo-ham-nav nav { display: grid; padding: 0 .5rem; max-height: 0; opacity: 0; transition: max-height .4s var(--ease-out), opacity .3s, padding .3s; }
.demo-ham-nav nav[data-state="open"] { max-height: 220px; opacity: 1; padding: .25rem .5rem .6rem; }
.demo-ham-nav nav a { padding: .55rem .6rem; border-radius: var(--radius); color: var(--fg); font-weight: 500; }
.demo-ham-nav nav a:hover { background: var(--muted); text-decoration: none; }` },
    { title: 'Sizes', html: `<button class="hamburger" style="--size:16px;--gap:4.5px" aria-label="Menu"></button>
<button class="hamburger" aria-label="Menu"></button>
<button class="hamburger" style="--size:30px;--thick:3px;--gap:8px" aria-label="Menu"></button>` }
  ],
  api: [
    { name: '.hamburger', type: 'class', desc: 'Empty <code>&lt;button&gt;</code>; three bars injected.' },
    { name: '.hamburger-spin / -arrow / -squeeze / -stagger', type: 'class', desc: 'Motion styles.' },
    { name: 'aria-expanded', type: 'attr', default: 'false', desc: 'Open state.' },
    { name: 'aria-controls', type: 'attr', desc: 'Target id; receives <code>data-state="open|closed"</code>.' },
    { name: 'data-manual', type: 'attr', desc: 'Do not toggle on click; set <code>aria-expanded</code> yourself.' },
    { name: '--size / --thick / --gap / --speed', type: 'var', default: '22px / 2px / 6px / .22s', desc: 'Geometry and timing.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { open }' }
  ]
});
