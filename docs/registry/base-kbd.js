(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'kbd',
    name: 'Kbd',
    group: 'Base',
    description: 'Keyboard keys and shortcut combos with a subtle keycap bevel. Looks right inside buttons, menus and body text.',
    keywords: ['keyboard', 'shortcut', 'hotkey', 'key', 'keycap'],
    demos: [
      {
        title: 'Keys and combos',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<kbd class="kbd">⌘</kbd>
<kbd class="kbd">Shift</kbd>
<kbd class="kbd">Esc</kbd>
<kbd class="kbd">↵</kbd>
<span class="kbd-combo"><kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd></span>
<span class="kbd-combo"><kbd class="kbd">Ctrl</kbd><span class="kbd-sep">+</span><kbd class="kbd">Shift</kbd><span class="kbd-sep">+</span><kbd class="kbd">P</kbd></span>
<span class="kbd-combo"><kbd class="kbd">G</kbd><span class="kbd-sep">then</span><kbd class="kbd">I</kbd></span>
</div>`
      },
      {
        title: 'Sizes',
        html: `<kbd class="kbd kbd-sm">⌘K</kbd><kbd class="kbd">⌘K</kbd><kbd class="kbd kbd-lg">⌘K</kbd><kbd class="kbd kbd-lg kbd-mono">Tab</kbd>`
      },
      {
        title: 'Shortcut list',
        html: `<div class="list-group list-group-sm" style="width:min(100%,22rem)">
  <div class="list-group-item"><span class="list-group-content">Search</span><span class="kbd-combo"><kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd></span></div>
  <div class="list-group-item"><span class="list-group-content">New issue</span><kbd class="kbd">C</kbd></div>
  <div class="list-group-item"><span class="list-group-content">Go to inbox</span><span class="kbd-combo"><kbd class="kbd">G</kbd><span class="kbd-sep">then</span><kbd class="kbd">I</kbd></span></div>
  <div class="list-group-item"><span class="list-group-content">Toggle sidebar</span><span class="kbd-combo"><kbd class="kbd">⌘</kbd><kbd class="kbd">\\</kbd></span></div>
</div>`
      },
      {
        title: 'Live keys',
        description: 'Press arrow keys while this demo is focused: keys use <code>data-state="active"</code> to look pressed.',
        html: `<div class="demo-kbd-pad" tabindex="0" aria-label="Arrow key visualizer">
  <span></span><kbd class="kbd kbd-lg" data-key="ArrowUp">↑</kbd><span></span>
  <kbd class="kbd kbd-lg" data-key="ArrowLeft">←</kbd><kbd class="kbd kbd-lg" data-key="ArrowDown">↓</kbd><kbd class="kbd kbd-lg" data-key="ArrowRight">→</kbd>
</div>`,
        css: '.demo-kbd-pad { display: grid; grid-template-columns: repeat(3, 2.25rem); gap: .35rem; padding: 1rem; border-radius: var(--radius-lg); outline-offset: 4px; }\n.demo-kbd-pad .kbd { width: 2.25rem; }',
        js: "var pad = root.querySelector('.demo-kbd-pad');\nfunction set(e, on) { var k = pad.querySelector('[data-key=\"' + e.key + '\"]'); if (!k) return; e.preventDefault(); if (on) k.setAttribute('data-state', 'active'); else k.removeAttribute('data-state'); }\npad.addEventListener('keydown', function (e) { set(e, true); });\npad.addEventListener('keyup', function (e) { set(e, false); });"
      }
    ],
    api: [
      { name: '.kbd', type: 'class', desc: 'A single key. Use the <code>&lt;kbd&gt;</code> element.' },
      { name: '.kbd-combo', type: 'class', desc: 'Groups keys; add <code>.kbd-sep</code> spans for "+" or "then".' },
      { name: '.kbd-sm', type: 'class', desc: 'Sizes, monospaced and borderless. Also: <code>.kbd-lg</code> <code>.kbd-mono</code> <code>.kbd-ghost</code>' },
      { name: 'data-state="active"', type: 'attr', desc: 'Pressed look for live visualizers.' }
    ]
  });
})();
