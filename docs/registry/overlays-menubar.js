(function () {
  var I = window.__ovI;
  function mi(label, sc, attrs) { return '<button class="menu-item"' + (attrs || '') + '>' + label + (sc ? '<span class="menu-shortcut">' + sc + '</span>' : '') + '</button>'; }
  var sep = '<div class="menu-separator"></div>';
  RanjDocs.add({
    id: 'menubar',
    name: 'Menubar',
    group: 'Navigation',
    description: 'A desktop-app style menu bar (File, Edit, View…). Click or press ↓ to open, hover to switch between menus while one is open, and use ← → to walk across menus, including from inside a submenu.',
    tags: ['js'],
    keywords: ['app menu', 'file menu', 'toolbar menu', 'desktop'],
    demos: [
      {
        title: 'Editor menubar',
        height: 300,
        html: `
<div class="menubar">
  <span class="menubar-brand">${I.svg('command', 15)}</span>
  <div class="menubar-menu">
    <button class="menubar-trigger">File</button>
    <div class="menubar-content">
      ${mi('New Tab', '⌘T')}${mi('New Window', '⌘N')}${mi('New Incognito Window', '', ' disabled')}${sep}
      <div class="menu-sub"><button class="menu-item">Share</button><div class="menubar-content">${mi('Email link')}${mi('Messages')}${mi('Notes')}</div></div>
      ${sep}${mi('Print…', '⌘P')}
    </div>
  </div>
  <div class="menubar-menu">
    <button class="menubar-trigger">Edit</button>
    <div class="menubar-content">
      ${mi('Undo', '⌘Z')}${mi('Redo', '⇧⌘Z')}${sep}
      <div class="menu-sub"><button class="menu-item">Find</button><div class="menubar-content">${mi('Search the web')}${sep}${mi('Find…', '⌘F')}${mi('Find Next', '⌘G')}${mi('Find Previous', '⇧⌘G')}</div></div>
      ${sep}${mi('Cut', '⌘X')}${mi('Copy', '⌘C')}${mi('Paste', '⌘V')}
    </div>
  </div>
  <div class="menubar-menu">
    <button class="menubar-trigger">View</button>
    <div class="menubar-content">
      ${mi('Always Show Bookmarks Bar', '', ' aria-checked="false"')}${mi('Always Show Full URLs', '', ' aria-checked="true"')}${sep}
      ${mi('Reload', '⌘R')}${mi('Force Reload', '⇧⌘R', ' disabled')}${sep}${mi('Toggle Fullscreen', '⌃⌘F')}${sep}${mi('Hide Sidebar')}
    </div>
  </div>
  <div class="menubar-menu">
    <button class="menubar-trigger">Profiles</button>
    <div class="menubar-content">
      <div class="menu-radio-group">${mi('Andy', '', ' aria-checked="false"')}${mi('Benoit', '', ' aria-checked="true"')}${mi('Luis', '', ' aria-checked="false"')}</div>
      ${sep}${mi('Edit…')}${sep}${mi('Add Profile…')}
    </div>
  </div>
</div>`
      }
    ],
    api: [
      { name: '.menubar', type: 'class', desc: 'Bar (<code>role="menubar"</code>). <code>.menubar-flat</code> removes the frame; <code>.menubar-brand</code> for a logo.' },
      { name: '.menubar-menu > .menubar-trigger + .menubar-content', type: 'class', desc: 'One menu. v1 <code>.menubar-item</code> also works as a trigger.' },
      { name: '.menu-item / .menu-separator / .menu-label / .menu-shortcut', type: 'class', desc: 'Menu contents (same engine and options as the dropdown menu).' },
      { name: '.menu-sub', type: 'class', desc: 'Item + nested <code>.menubar-content</code> → submenu.' },
      { name: 'aria-checked / .menu-radio-group', type: 'attr', desc: 'Checkbox and radio items.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On <code>.menubar</code>; <code>ranj:select</code> bubbles from items.' }
    ]
  });
})();
