RanjDocs.add({
  id: 'search-reveal',
  name: 'Search Reveal',
  group: 'Micro-interactions',
  description: 'A search icon that springs open into a full search field. Escape or blurring while empty closes it again.',
  tags: ['new', 'fx', 'js'],
  keywords: ['search bar', 'expanding search', 'search icon', 'collapsible search'],
  demos: [
    { title: 'Default', description: 'Click the magnifier. Press / anywhere on the page to open it too.', html: `
<div class="search-reveal" data-shortcut="/">
  <button class="search-reveal-btn"></button>
  <input class="search-reveal-input" type="search" placeholder="Search docs, components…">
  <kbd class="search-reveal-kbd">/</kbd>
  <button class="search-reveal-clear"></button>
</div>` },
    { title: 'In a toolbar', height: 220, html: `
<div style="width:520px;max-width:100%;display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.5rem .6rem .5rem 1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <b>Inbox <span style="color:var(--muted-fg);font-weight:500">· 24</span></b>
  <div class="search-reveal" style="--open:min(280px, 60vw);--h:38px;--closed:38px">
    <button class="search-reveal-btn"></button>
    <input class="search-reveal-input" type="search" placeholder="Search mail">
    <button class="search-reveal-clear"></button>
  </div>
</div>` }
  ],
  api: [
    { name: '.search-reveal', type: 'class', desc: 'Wrapper with <code>.search-reveal-btn</code>, <code>.search-reveal-input</code>, optional <code>.search-reveal-kbd</code> and <code>.search-reveal-clear</code>.' },
    { name: 'data-state', type: 'attr', default: 'closed', desc: '<code>open</code> to start expanded.' },
    { name: 'data-shortcut', type: 'attr', desc: 'Key that opens it from anywhere, e.g. <code>/</code>.' },
    { name: 'data-keep-open', type: 'attr', desc: 'Do not collapse on blur.' },
    { name: '--open / --closed / --h', type: 'var', default: '300px / 44px / 44px', desc: 'Widths and height.' },
    { name: 'ranj:search', type: 'event', desc: 'detail: { query } on Enter.' },
    { name: 'ranj:open / ranj:close', type: 'event', desc: 'Fired on toggle.' }
  ]
});
