(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'context-menu',
    name: 'Context Menu',
    group: 'Overlays',
    description: 'A menu that opens at the pointer on right-click, on long-press for touch, or with Shift+F10 / the Menu key. Shares the dropdown engine: submenus, checkbox and radio items, type-ahead and flipping at screen edges.',
    tags: ['js'],
    keywords: ['right click', 'long press', 'menu', 'contextmenu'],
    demos: [
      {
        title: 'Browser-style',
        html: `
<div class="context-area" data-context-menu="context-menu-a" tabindex="0">
  <span>${I.svg('command', 22)}</span>
  <b style="color:var(--fg);font-weight:600">Right-click here</b>
  <span>or long-press on touch · Shift+F10 when focused</span>
</div>
<div class="context-menu" id="context-menu-a">
  <button class="context-menu-item">${I.chevronLeft} Back <span class="shortcut">⌘[</span></button>
  <button class="context-menu-item" disabled>${I.chevronRight} Forward <span class="shortcut">⌘]</span></button>
  <button class="context-menu-item">${I.refresh} Reload <span class="shortcut">⌘R</span></button>
  <div class="context-menu-sub">
    <button class="context-menu-item">${I.layers} More tools</button>
    <div class="context-menu">
      <button class="context-menu-item">${I.download} Save page as… <span class="shortcut">⇧⌘S</span></button>
      <button class="context-menu-item">${I.link} Create shortcut…</button>
      <button class="context-menu-item">${I.pencil} Name window…</button>
      <div class="context-menu-separator"></div>
      <button class="context-menu-item">${I.terminal} Developer tools <span class="shortcut">⌥⌘I</span></button>
    </div>
  </div>
  <div class="context-menu-separator"></div>
  <button class="context-menu-item" aria-checked="true">Show bookmarks bar <span class="shortcut">⇧⌘B</span></button>
  <button class="context-menu-item" aria-checked="false">Show full URLs</button>
  <div class="context-menu-separator"></div>
  <div class="context-menu-label">People</div>
  <div class="menu-radio-group">
    <button class="context-menu-item" aria-checked="true">Pedro Duarte</button>
    <button class="context-menu-item" aria-checked="false">Colm Tuite</button>
  </div>
</div>`
      },
      {
        title: 'File grid',
        description: 'One menu shared by many items. <code>ranj:open</code> tells you which element was right-clicked.',
        html: `
<div class="demo-ctx-grid" data-context-menu="context-menu-files">
  ${[['Brand guidelines', 'fileText', 15], ['Product shots', 'image', 150], ['Pitch deck', 'chart', 260], ['Contracts', 'folder', 60], ['Podcast ep. 12', 'music', 320], ['Launch video', 'video', 200]].map(function (f) { return '<button class="demo-ctx-file" style="--h:' + f[2] + '">' + I[f[1]] + '<span>' + f[0] + '</span></button>'; }).join('')}
</div>
<div class="context-menu" id="context-menu-files">
  <div class="context-menu-label" id="context-menu-files-name">File</div>
  <button class="context-menu-item">${I.eye} Open</button>
  <button class="context-menu-item">${I.share} Share… <span class="shortcut">⌘S</span></button>
  <button class="context-menu-item">${I.star} Add to starred</button>
  <button class="context-menu-item">${I.copy} Duplicate <span class="shortcut">⌘D</span></button>
  <div class="context-menu-separator"></div>
  <button class="context-menu-item dropdown-item-destructive">${I.trash} Move to trash <span class="shortcut">⌫</span></button>
</div>`,
        js: `var label = root.querySelector('#context-menu-files-name'), files = root.querySelectorAll('.demo-ctx-file');
root.querySelector('#context-menu-files').addEventListener('ranj:open', function (e) {
  var f = e.detail.target.closest('.demo-ctx-file');
  files.forEach(function (x) { x.classList.toggle('is-ctx', x === f); });
  label.textContent = f ? f.textContent.trim() : 'Folder';
});
root.querySelector('#context-menu-files').addEventListener('ranj:close', function () { files.forEach(function (x) { x.classList.remove('is-ctx'); }); });`,
        css: `.demo-ctx-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 7rem)); gap: .5rem; padding: .75rem; border-radius: var(--radius-xl); border: 1px solid var(--border); background: var(--card); }
.demo-ctx-file { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: .875rem .25rem .625rem; border-radius: var(--radius-lg); font-size: .75rem; color: var(--fg); text-align: center; border: 1px solid transparent; }
.demo-ctx-file:hover { background: var(--muted); }
.demo-ctx-file.is-ctx { background: var(--primary-soft); border-color: color-mix(in oklab, var(--primary) 40%, transparent); }
.demo-ctx-file svg { width: 2.4rem; height: 2.4rem; padding: .55rem; border-radius: var(--radius); color: oklch(.5 .17 var(--h)); background: oklch(.94 .04 var(--h)); }
[data-theme="dark"] .demo-ctx-file svg { color: oklch(.8 .12 var(--h)); background: oklch(.3 .06 var(--h)); }
.demo-ctx-file span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`
      }
    ],
    api: [
      { name: 'data-context-menu="menuId"', type: 'attr', desc: 'On the area. Leave empty to use the first <code>.context-menu</code> inside it.' },
      { name: '.context-menu', type: 'class', desc: 'The menu. Items: <code>.context-menu-item</code> (or <code>.dropdown-item</code>), <code>.context-menu-separator</code>, <code>.context-menu-label</code>, <code>.shortcut</code>.' },
      { name: '.context-menu-sub', type: 'class', desc: 'Item + nested <code>.context-menu</code> → submenu.' },
      { name: 'aria-checked / .menu-radio-group', type: 'attr', desc: 'Checkbox and radio items.' },
      { name: '.context-area', type: 'class', desc: 'Optional dashed drop-zone style for the trigger area.' },
      { name: 'Ranj.contextMenu.open(area, x, y) / close()', type: 'js', desc: 'Programmatic control.' },
      { name: 'ranj:open', type: 'event', desc: 'On the menu: <code>{ x, y, target }</code> where target is the element that was right-clicked.' },
      { name: 'ranj:select / ranj:close', type: 'event', desc: 'Same as the dropdown menu.' }
    ]
  });
})();
