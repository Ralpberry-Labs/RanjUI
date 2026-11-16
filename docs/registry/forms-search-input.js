RanjDocs.add({
  id: 'search-input',
  name: 'Search input',
  group: 'Forms',
  description: 'A search field with a ⌘K / Ctrl K shortcut hint that focuses it from anywhere, a spinner that replaces the icon while loading, a clear button, Escape to clear, and a debounced <code>ranj:search</code> event.',
  tags: ['new', 'js'],
  keywords: ['search bar', 'search box', 'cmd k', 'keyboard shortcut', 'filter', 'debounce'],
  demos: [
    {
      title: 'Live search',
      description: 'Press ⌘K (or Ctrl K) to focus. Results load after you pause typing.',
      height: 300,
      html: `
<div style="width:26rem;max-width:100%">
  <div class="input-wrap search-input" data-shortcut="k"><input placeholder="Search components…"></div>
  <div class="search-results" id="search-input-results"></div>
</div>`,
      js: `
const names = ['Accordion','Alert','Avatar','Badge','Button','Calendar','Card','Checkbox','Color picker','Combobox','Date picker','Dialog','Drawer','File upload','Input','Multi-select','Number input','OTP input','Password','Popover','Radio','Range slider','Rating','Search input','Segmented control','Select','Slider','Switch','Tabs','Tag input','Textarea','Time picker','Toast','Toggle','Tooltip'];
const el = root.querySelector('.search-input'), out = root.querySelector('#search-input-results');
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
el.addEventListener('ranj:search', e => {
  const q = e.detail.query.toLowerCase();
  if (!q) { out.innerHTML = ''; return; }
  Ranj.searchLoading(el, true);
  setTimeout(() => {
    Ranj.searchLoading(el, false);
    const hits = names.filter(n => n.toLowerCase().includes(q)).slice(0, 5);
    out.innerHTML = hits.length ? hits.map((n, i) => { const k = n.toLowerCase().indexOf(q); return '<div class="search-result" style="animation-delay:' + i * 30 + 'ms">' + esc(n.slice(0, k)) + '<mark>' + esc(n.slice(k, k + q.length)) + '</mark>' + esc(n.slice(k + q.length)) + '<small>Forms</small></div>'; }).join('') : '<div class="search-result" style="color:var(--muted-fg)">No components match “' + esc(q) + '”</div>';
  }, 500);
});`
    },
    {
      title: 'Variants',
      html: `
<div style="width:24rem;max-width:100%;display:grid;gap:.75rem">
  <div class="input-wrap search-input search-input-pill input-filled" data-shortcut="/"><input placeholder="Type / to search"></div>
  <div class="input-wrap search-input input-sm"><input placeholder="Filter rows…" value="invoice"></div>
  <div class="input-wrap search-input search-input-lg" data-loading><input placeholder="Searching…" value="quarterly revenue"></div>
</div>`
    }
  ],
  api: [
    { name: '.search-input', type: 'class', desc: 'Put on an <code>.input-wrap</code> containing an input. Adds the icon, spinner and clear button.' },
    { name: '.search-input-pill / .search-input-lg', type: 'class', desc: 'Rounded and large variants; combine with <code>.input-filled</code>, <code>.input-sm</code>.' },
    { name: 'data-shortcut', type: 'attr', desc: 'A letter for ⌘/Ctrl + key, or <code>/</code>. Shows a hint and focuses the input from anywhere.' },
    { name: 'data-debounce / data-min-chars', type: 'attr', default: '250 / 0', desc: 'Delay and minimum length before <code>ranj:search</code>.' },
    { name: 'data-loading', type: 'attr', desc: 'Show the spinner.' },
    { name: 'Ranj.searchLoading(el, on)', type: 'js', desc: 'Toggle the spinner and <code>aria-busy</code>.' },
    { name: 'ranj:search / ranj:change / ranj:submit / ranj:clear', type: 'event', desc: '<code>search</code> detail: <code>{ value, query }</code> (debounced); <code>submit</code> on Enter.' }
  ]
});
