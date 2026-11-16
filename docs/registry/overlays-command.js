(function () {
  var I = window.__ovI;
  function item(icon, label, extra, attrs) {
    return '<div class="command-item"' + (attrs || '') + '>' + I[icon] + label + (extra || '') + '</div>';
  }
  function kbd() { return '<span class="command-shortcut">' + Array.prototype.map.call(arguments, function (k) { return '<kbd>' + k + '</kbd>'; }).join('') + '</span>'; }
  var searchIcon = I.search;
  var palette = `
  <div class="command-input-wrapper">${searchIcon}<input class="command-input" placeholder="Type a command or search…"><span class="command-esc" data-command-close>esc</span></div>
  <div class="command-list">
    <div class="command-empty">No results found. Try “invoice” or “theme”.</div>
    <div class="command-group">
      <div class="command-group-label">Suggestions</div>
      ${item('calendar', 'Calendar', '', ' data-keywords="schedule events dates"')}
      ${item('sparkles', 'Search with AI', '<span class="command-meta">New</span>', ' data-keywords="ask assistant gpt"')}
      ${item('rocket', 'Deploy to production', kbd('⌘', '⇧', 'D'), ' data-keywords="ship release"')}
    </div>
    <div class="command-separator"></div>
    <div class="command-group">
      <div class="command-group-label">Projects</div>
      ${item('folder', 'Atlas redesign', '<span class="command-meta">12 files</span>')}
      ${item('folder', 'Billing migration', '<span class="command-meta">48 files</span>', ' data-keywords="stripe invoices"')}
      ${item('folder', 'Mobile onboarding', '<span class="command-meta">7 files</span>')}
    </div>
    <div class="command-separator"></div>
    <div class="command-group">
      <div class="command-group-label">Settings</div>
      ${item('user', 'Profile', kbd('⌘', 'P'))}
      ${item('card', 'Billing & invoices', kbd('⌘', 'B'), ' data-keywords="payment plan subscription"')}
      ${item('moon', 'Toggle dark theme', kbd('⌘', '⇧', 'L'), ' data-value="theme" data-keywords="appearance light mode"')}
      ${item('keyboard', 'Keyboard shortcuts', kbd('?'))}
      ${item('logout', 'Sign out', '', ' aria-disabled="true"')}
    </div>
  </div>`;

  RanjDocs.add({
    id: 'command',
    name: 'Command Palette',
    group: 'Overlays',
    description: 'A fast, keyboard-first launcher. Fuzzy matching with highlighted characters, ranked results, groups, recent items and an opt-in global shortcut. Use it inline or as a modal.',
    tags: ['js'],
    keywords: ['cmdk', 'command k', 'spotlight', 'launcher', 'search', 'quick open', 'kbar'],
    demos: [
      {
        title: 'Inline',
        description: 'Type “bill”, “dpl” or “thm”: matches are fuzzy, ranked, and highlighted.',
        html: `<div class="command demo-cmd-inline">${palette}
  <div class="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> select</span><span class="command-footer-end">${I.svg('command', 13)} Northwind</span></div>
</div>`,
        css: `.demo-cmd-inline { width: min(34rem, calc(100vw - 4rem)); }`,
        js: `root.addEventListener('ranj:select', function (e) {
  if (e.detail.value === 'theme') Ranj.theme.toggle();
  else Ranj.toast && Ranj.toast(e.detail.value, { description: 'Selected from the command palette' });
});`
      },
      {
        title: 'Modal with ⌘J and recents',
        description: '<code>data-hotkey="j"</code> on the overlay opens it with ⌘J / Ctrl+J from anywhere. <code>data-recent</code> remembers your last picks.',
        html: `
<button class="btn btn-outline demo-cmd-trigger" id="command-open">${searchIcon}<span>Search Northwind…</span><kbd>⌘J</kbd></button>

<div class="command-overlay" id="command-demo" data-hotkey="j" data-recent="docs-demo">
  <div class="command-dialog">${palette}
    <div class="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>
  </div>
</div>`,
        js: `root.querySelector('#command-open').onclick = function () { Ranj.command.open('command-demo'); };
root.querySelector('#command-demo').addEventListener('ranj:select', function (e) {
  if (e.detail.value === 'theme') Ranj.theme.toggle();
  else Ranj.toast && Ranj.toast.success(e.detail.value);
});`,
        css: `.demo-cmd-trigger { width: min(20rem, calc(100vw - 4rem)); justify-content: flex-start; color: var(--muted-fg); font-weight: 400; }
.demo-cmd-trigger svg { width: 1rem; height: 1rem; } .demo-cmd-trigger span { flex: 1; text-align: left; }
.demo-cmd-trigger kbd { font-family: var(--font-sans); font-size: .6875rem; padding: .1rem .4rem; border: 1px solid var(--border); border-radius: 5px; background: var(--bg-subtle); }`
      }
    ],
    api: [
      { name: '.command', type: 'class', desc: 'Inline palette. In a modal use <code>.command-overlay#id > .command-dialog</code>.' },
      { name: '.command-input-wrapper > .command-input', type: 'class', desc: 'Search field (becomes a combobox).' },
      { name: '.command-list', type: 'class', desc: 'Holds <code>.command-group</code>s (with <code>.command-group-label</code>), <code>.command-separator</code> and <code>.command-empty</code>.' },
      { name: '.command-item', type: 'class', desc: 'An option. Adornments: <code>.command-shortcut</code> (with kbd), <code>.command-meta</code>, <code>.command-item-icon</code>.' },
      { name: 'data-value / data-keywords', type: 'attr', desc: 'On items: value reported on select, extra search terms.' },
      { name: 'data-href', type: 'attr', desc: 'On items: navigate on select.' },
      { name: 'data-keep-open', type: 'attr', desc: 'On items: keep the modal open after select.' },
      { name: 'data-hotkey="k"', type: 'attr', desc: 'On the overlay: ⌘/Ctrl + key toggles it (opt-in).' },
      { name: 'data-recent="key"', type: 'attr', desc: 'Remember the last 4 picks in localStorage and show them first.' },
      { name: '--command-w', type: 'var', default: '40rem', desc: 'Max width.' },
      { name: 'Ranj.command.open(id) / close(id) / toggle(id)', type: 'js', desc: 'Control the modal. <code>Ranj.command.refresh(el)</code> after changing items.' },
      { name: 'ranj:select', type: 'event', desc: 'From the item: <code>{ value, item, query }</code>. Cancelable.' },
      { name: 'ranj:filter', type: 'event', desc: 'On the palette: <code>{ query, count }</code>.' }
    ]
  });
})();
