RanjDocs.add({
  id: 'tree-view',
  name: 'Tree View',
  group: 'Data Display',
  description: 'Write a nested list, get an accessible file tree: animated expand/collapse, indent guides, file-type icons, selection, tri-state checkboxes and full keyboard support (arrows, Home/End, type-ahead, *).',
  tags: ['new', 'js'],
  keywords: ['file tree', 'explorer', 'folders', 'hierarchy', 'nested list', 'treeview', 'sidebar tree'],
  demos: [
    {
      title: 'File explorer',
      description: 'Icons are picked from the file extension. Add <code>data-open</code> to expand a folder and <code>.tree-meta</code> for trailing info like git status.',
      html: `<ul class="tree tree-panel" data-tree aria-label="Project files" style="width: 300px">
  <li data-open>acme-web
    <ul>
      <li data-open>src
        <ul>
          <li data-open>components
            <ul>
              <li>Button.tsx</li>
              <li aria-selected="true">DataTable.tsx <span class="tree-meta is-modified">M</span></li>
              <li>Sidebar.tsx <span class="tree-meta is-added">U</span></li>
            </ul>
          </li>
          <li>hooks
            <ul><li>useDebounce.ts</li><li>useMediaQuery.ts</li></ul>
          </li>
          <li>styles
            <ul><li>globals.css</li><li>tokens.css</li></ul>
          </li>
          <li>main.tsx</li>
        </ul>
      </li>
      <li>public
        <ul><li>favicon.svg</li><li>og-image.png</li></ul>
      </li>
      <li>.env.local</li>
      <li>package.json</li>
      <li>pnpm-lock.yaml</li>
      <li>README.md</li>
    </ul>
  </li>
</ul>`,
      height: 460
    },
    {
      title: 'Checkboxes',
      description: '<code>data-checkboxes</code> adds tri-state checkboxes that cascade down and roll up. Listen for <code>ranj:check</code>.',
      html: `<div style="display:grid;gap:.75rem;width:320px">
  <ul class="tree tree-panel" data-tree data-checkboxes data-select="none" aria-label="Permissions">
    <li data-open data-icon="none">Billing
      <ul>
        <li data-icon="none" data-checked="true">View invoices</li>
        <li data-icon="none" data-checked="true">Download receipts</li>
        <li data-icon="none">Change payment method</li>
      </ul>
    </li>
    <li data-open data-icon="none">Projects
      <ul>
        <li data-icon="none" data-checked="true">Create projects</li>
        <li data-icon="none" data-checked="true">Archive projects</li>
      </ul>
    </li>
    <li data-icon="none">Members
      <ul>
        <li data-icon="none">Invite members</li>
        <li data-icon="none">Remove members</li>
        <li data-icon="none">Change roles</li>
      </ul>
    </li>
  </ul>
  <p class="demo-tree-out" style="font-size:.8rem;color:var(--muted-fg);margin:0">4 permissions granted</p>
</div>`,
      js: `const out = root.querySelector('.demo-tree-out');
root.addEventListener('ranj:check', (e) => { out.textContent = e.detail.checked.length + ' permission' + (e.detail.checked.length === 1 ? '' : 's') + ' granted'; });`,
      height: 400
    },
    {
      title: 'Navigation tree',
      description: 'No guides, custom icons via <code>data-icon</code>, and the <code>ranj:select</code> event.',
      html: `<div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-start">
  <ul class="tree tree-no-guides tree-sm" data-tree aria-label="Docs" style="width: 240px">
    <li data-open data-icon="md">Getting started
      <ul><li data-icon="none">Installation</li><li data-icon="none" aria-selected="true">Theming</li><li data-icon="none">Dark mode</li></ul>
    </li>
    <li data-icon="code">Components
      <ul><li data-icon="none">Button</li><li data-icon="none">Data table</li><li data-icon="none">Tree view</li></ul>
    </li>
    <li data-icon="json">API reference
      <ul><li data-icon="none">Ranj.define</li><li data-icon="none">Ranj.position</li></ul>
    </li>
  </ul>
  <div class="demo-tree-sel" style="font-size:.85rem;color:var(--muted-fg);padding:.4rem .2rem">Selected: <b style="color:var(--fg)">Theming</b></div>
</div>`,
      js: `const sel = root.querySelector('.demo-tree-sel b');
root.addEventListener('ranj:select', (e) => { sel.textContent = e.detail.label; });`
    }
  ],
  api: [
    { name: '.tree[data-tree]', type: 'attr', desc: 'Nested ul/li becomes an ARIA tree. Text before a nested list is the label.' },
    { name: 'li[data-open]', type: 'attr', desc: 'Start expanded.' },
    { name: 'li[data-icon]', type: 'attr', default: 'auto', desc: 'folder | file | code | ts | js | css | html | json | md | img | lock | env | none. Auto: folders for branches, extension for files.' },
    { name: 'li[data-value]', type: 'attr', desc: 'Value reported in events (defaults to the label).' },
    { name: 'li[aria-selected] / [aria-disabled] / [data-checked]', type: 'attr', desc: 'Initial selection, disabled item, initial check state.' },
    { name: 'data-checkboxes', type: 'attr', default: 'false', desc: 'Tri-state checkboxes that cascade to children and roll up to parents.' },
    { name: 'data-select', type: 'attr', default: 'single', desc: 'single | multiple (Cmd/Ctrl-click) | none.' },
    { name: 'data-open-all / data-icons', type: 'attr', default: 'false / true', desc: 'Expand everything; show file icons.' },
    { name: '.tree-panel / .tree-sm / .tree-no-guides', type: 'class', desc: 'Card frame, compact rows, hide indent guides.' },
    { name: '.tree-meta', type: 'class', desc: 'Right-aligned trailing info in a row. Tones: .is-added, .is-modified, .is-deleted.' },
    { name: '--tree-indent / --tree-row-h', type: 'var', default: '1.1rem / 1.9rem', desc: 'Indent per level and row height. --tree-guide sets the guide color.' },
    { name: 'el.ranjTree', type: 'js', desc: '{ expand(li), collapse(li), expandAll(), collapseAll(), select(li), checked() }' },
    { name: 'ranj:select', type: 'event', desc: 'On the tree. detail: { item, value, label, selected }' },
    { name: 'ranj:check', type: 'event', desc: 'On the tree. detail: { item, checked: [leaf values] }' },
    { name: 'ranj:expand / ranj:collapse', type: 'event', desc: 'On the item. detail: { item, label }' }
  ]
});
