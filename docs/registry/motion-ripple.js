RanjDocs.add({
  id: 'ripple',
  name: 'Ripple',
  group: 'Interactions',
  description: 'Material-style ink ripple that grows from the exact press point. Add data-ripple to any element; it holds while pressed and fades on release.',
  tags: ['new', 'fx', 'js'],
  keywords: ['ink', 'material', 'press effect', 'click effect', 'wave'],
  demos: [
    {
      title: 'Buttons',
      html: `
<button class="btn btn-primary btn-lg" data-ripple="light">Primary</button>
<button class="btn btn-outline btn-lg" data-ripple>Outline</button>
<button class="btn btn-secondary btn-lg" data-ripple="#6366f1">Tinted</button>
<button class="btn btn-ghost btn-lg" data-ripple>Ghost</button>`
    },
    {
      title: 'List and card surfaces',
      height: 320,
      html: `
<div class="demo-ripple-list" role="list">
  <button class="demo-ripple-row" data-ripple role="listitem"><span>📥</span>Inbox<b>12</b></button>
  <button class="demo-ripple-row" data-ripple role="listitem"><span>⭐</span>Starred<b>3</b></button>
  <button class="demo-ripple-row" data-ripple role="listitem"><span>📤</span>Sent<b></b></button>
  <button class="demo-ripple-row" data-ripple role="listitem"><span>🗑️</span>Trash<b></b></button>
</div>
<div class="demo-ripple-tile" data-ripple="light" tabindex="0">Press and hold</div>`,
      css: `.demo-ripple-list { width: 260px; padding: .4rem; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-md); display: grid; }
.demo-ripple-row { display: flex; align-items: center; gap: .75rem; padding: .7rem .8rem; border-radius: var(--radius); text-align: left; font-weight: 500; }
.demo-ripple-row b { margin-left: auto; font-size: .75rem; color: var(--muted-fg); }
.demo-ripple-row:hover { background: var(--muted); }
.demo-ripple-tile { width: 220px; height: 180px; border-radius: var(--radius-2xl); display: grid; place-items: center; color: #fff; font-weight: 700; user-select: none; cursor: pointer; background: linear-gradient(135deg, #0ea5e9, #6366f1); box-shadow: var(--shadow-lg); }`
    }
  ],
  api: [
    { name: 'data-ripple', type: 'attr', default: 'currentColor', desc: 'Enable. Value: <code>light</code>, <code>dark</code> or any CSS color.' },
    { name: '--ripple-opacity / --ripple-dur / --ripple-fade', type: 'var', default: '.22 / 550ms / 450ms', desc: 'Ink strength, grow time and fade time.' },
    { name: 'Ranj.ripple(el, x?, y?)', type: 'js', desc: 'Trigger a ripple (centered by default). Enter/Space trigger one too.' }
  ]
});
