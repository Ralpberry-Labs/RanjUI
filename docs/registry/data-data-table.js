RanjDocs.add({
  id: 'data-table',
  name: 'Data Table',
  group: 'Data Display',
  description: 'A plain <code>&lt;table&gt;</code> upgraded with type-aware sorting, instant search, column visibility, row selection with select-all, pagination and a floating bulk-action bar. Or render it straight from JSON with <code>Ranj.dataTable()</code>.',
  tags: ['new', 'js'],
  keywords: ['datagrid', 'grid', 'sortable table', 'filter', 'pagination', 'bulk actions', 'tanstack'],
  demos: [
    {
      title: 'Enhanced HTML table',
      description: 'Mark sortable headers with <code>data-sort</code>; numbers, currency and dates are detected automatically. Select rows to reveal the bulk bar. Shift-click selects a range.',
      center: false,
      height: 520,
      html: `<table class="table table-hover" data-table data-page-size="5" data-bulk="Export,Send reminder,Archive">
  <thead>
    <tr>
      <th data-sort>Customer</th>
      <th data-sort>Plan</th>
      <th data-sort>Status</th>
      <th data-sort class="num">MRR</th>
      <th data-sort>Signed up</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><div class="table-cell-user"><span class="table-avatar">AK</span><div><b>Aria Kim</b><small>aria@lumenhealth.com</small></div></div></td><td>Scale</td><td><span class="table-status is-success">Active</span></td><td class="num">$2,400</td><td class="nowrap">Mar 04, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">DO</span><div><b>Daniel Okafor</b><small>dan@orbit.studio</small></div></div></td><td>Pro</td><td><span class="table-status is-warning">Past due</span></td><td class="num">$490</td><td class="nowrap">Jan 18, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">SR</span><div><b>Sofia Rossi</b><small>sofia@fernhill.ai</small></div></div></td><td>Enterprise</td><td><span class="table-status is-success">Active</span></td><td class="num">$12,000</td><td class="nowrap">Aug 22, 2025</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">ML</span><div><b>Marcus Lee</b><small>marcus@parcelkey.co</small></div></div></td><td>Starter</td><td><span class="table-status is-info">Trial</span></td><td class="num">$0</td><td class="nowrap">Nov 10, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">PN</span><div><b>Priya Nair</b><small>priya@northwind.io</small></div></div></td><td>Scale</td><td><span class="table-status is-success">Active</span></td><td class="num">$3,150</td><td class="nowrap">Jun 30, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">TB</span><div><b>Tomás Bauer</b><small>tomas@kitebase.de</small></div></div></td><td>Pro</td><td><span class="table-status is-danger">Churned</span></td><td class="num">$0</td><td class="nowrap">Feb 02, 2025</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">HY</span><div><b>Hana Yamada</b><small>hana@sora.jp</small></div></div></td><td>Pro</td><td><span class="table-status is-success">Active</span></td><td class="num">$590</td><td class="nowrap">Sep 14, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">EW</span><div><b>Elijah Ward</b><small>eli@quarry.dev</small></div></div></td><td>Enterprise</td><td><span class="table-status is-success">Active</span></td><td class="num">$8,750</td><td class="nowrap">Apr 11, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">CM</span><div><b>Camille Martin</b><small>camille@atelier.fr</small></div></div></td><td>Starter</td><td><span class="table-status is-success">Active</span></td><td class="num">$49</td><td class="nowrap">Oct 05, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">RG</span><div><b>Rahul Gupta</b><small>rahul@tiller.in</small></div></div></td><td>Scale</td><td><span class="table-status is-warning">Past due</span></td><td class="num">$1,980</td><td class="nowrap">Jul 27, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">LS</span><div><b>Lena Schmidt</b><small>lena@brightloop.io</small></div></div></td><td>Pro</td><td><span class="table-status is-success">Active</span></td><td class="num">$490</td><td class="nowrap">May 19, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">JA</span><div><b>Jamal Ahmed</b><small>jamal@cobalt.ae</small></div></div></td><td>Enterprise</td><td><span class="table-status is-info">Trial</span></td><td class="num">$0</td><td class="nowrap">Nov 14, 2026</td></tr>
  </tbody>
</table>`,
      js: `const table = root.querySelector('table');
table.addEventListener('ranj:bulk', (e) => {
  Ranj.toast?.({ title: e.detail.action.replace('-', ' '), description: e.detail.count + ' customer(s)' });
});`
    },
    {
      title: 'Rendered from JSON',
      description: '<code>Ranj.dataTable(el, { columns, rows })</code> builds the table for you. <code>render</code> returns HTML for a cell while the raw value is still used for sorting and search.',
      center: false,
      height: 560,
      html: `<div class="demo-dt-json"></div>`,
      js: `const people = ['Maya Chen','Jon Rivera','Priya Nair','Leo Park','Ava Novak','Sam Okoro','Iris Lund','Noah Berg'];
const branches = ['main','feat/checkout-v2','fix/rate-limit','chore/deps','feat/ai-search','release/4.2'];
const states = [['Ready','success'],['Building','info'],['Failed','danger'],['Queued','warning'],['Canceled','']];
const rand = (i, n) => Math.abs(Math.sin(i * 97.13) * 10000) % n | 0;
const rows = Array.from({ length: 46 }, (_, i) => {
  const s = states[i % 9 === 4 ? 2 : i % 7 === 3 ? 1 : i % 11 === 6 ? 3 : i % 13 === 8 ? 4 : 0];
  return {
    id: 'dpl_' + (0x9a3f1 + i * 7919).toString(16),
    branch: branches[rand(i, branches.length)],
    author: people[rand(i + 3, people.length)],
    status: s[0], tone: s[1],
    duration: 28 + rand(i + 9, 190),
    created: new Date(Date.UTC(2026, 10, 16, 14) - i * 3.7 * 3600e3)
  };
});
const fmtDur = (s) => (s >= 60 ? Math.floor(s / 60) + 'm ' : '') + (s % 60) + 's';
const fmtDate = (d) => d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const dt = Ranj.dataTable(root.querySelector('.demo-dt-json'), {
  pageSize: 8,
  select: true,
  bulk: [{ label: 'Redeploy' }, { label: 'Delete', danger: true, onClick: (sel, t) => t.removeRows(r => sel.includes(r)) }],
  searchPlaceholder: 'Filter deployments…',
  columns: [
    { key: 'id', label: 'Deployment', render: (v) => '<span class="mono">' + v + '</span>' },
    { key: 'branch', label: 'Branch', render: (v) => '<span class="nowrap">' + v + '</span>' },
    { key: 'author', label: 'Author', render: (v) => '<div class="table-cell-user"><span class="table-avatar">' + v.split(' ').map(p => p[0]).join('') + '</span><b>' + v + '</b></div>' },
    { key: 'status', label: 'Status', render: (v, r) => '<span class="table-status ' + (r.tone ? 'is-' + r.tone : '') + '">' + v + '</span>' },
    { key: 'duration', label: 'Duration', type: 'number', render: fmtDur },
    { key: 'created', label: 'Created', type: 'date', render: (v) => '<span class="nowrap muted">' + fmtDate(v) + '</span>' }
  ],
  rows
});
dt.sortBy(5, 'desc');`
    },
    {
      title: 'Sort only, compact',
      description: 'Turn features off with <code>data-search="false"</code>, <code>data-columns-menu="false"</code>, <code>data-pagination="false"</code>. <code>data-sort-all</code> makes every column sortable.',
      center: false,
      html: `<table class="table table-compact table-striped" data-table data-sort-all data-search="false" data-columns-menu="false" data-pagination="false">
  <thead><tr><th>Ticker</th><th>Company</th><th class="num">Price</th><th class="num">Change</th><th class="num">Market cap</th></tr></thead>
  <tbody>
    <tr><td class="mono">NVDA</td><td>NVIDIA</td><td class="num">$184.20</td><td class="num pos">+2.41%</td><td class="num">4.48T</td></tr>
    <tr><td class="mono">AAPL</td><td>Apple</td><td class="num">$268.05</td><td class="num neg">−0.62%</td><td class="num">3.97T</td></tr>
    <tr><td class="mono">MSFT</td><td>Microsoft</td><td class="num">$511.34</td><td class="num pos">+0.88%</td><td class="num">3.80T</td></tr>
    <tr><td class="mono">AMZN</td><td>Amazon</td><td class="num">$232.87</td><td class="num pos">+1.15%</td><td class="num">2.48T</td></tr>
    <tr><td class="mono">TSLA</td><td>Tesla</td><td class="num">$402.10</td><td class="num neg">−3.27%</td><td class="num">1.29T</td></tr>
  </tbody>
</table>`
    },
    {
      title: 'Empty state',
      description: 'When a search matches nothing the table shows a friendly message with a reset button.',
      center: false,
      html: `<table class="table" data-table data-page-size="5" data-search-placeholder="Search team…">
  <thead><tr><th data-sort>Name</th><th data-sort>Role</th><th data-sort>Location</th></tr></thead>
  <tbody>
    <tr><td>Maya Chen</td><td>Engineering Manager</td><td>San Francisco</td></tr>
    <tr><td>Jon Rivera</td><td>Product Designer</td><td>Lisbon</td></tr>
    <tr><td>Priya Nair</td><td>Staff Engineer</td><td>Bengaluru</td></tr>
  </tbody>
</table>`,
      js: `setTimeout(() => {
  const input = root.querySelector('.dt-search input');
  if (input) { input.value = 'kubernetes'; input.dispatchEvent(new Event('input', { bubbles: true })); }
}, 120);`
    }
  ],
  api: [
    { name: 'table[data-table]', type: 'attr', desc: 'Enhances the table. It is wrapped in .data-table > .table-wrapper automatically (existing wrappers are reused).' },
    { name: 'th[data-sort]', type: 'attr', desc: 'Makes a column sortable (click cycles ascending, descending, none). data-sort="asc|desc" sets the initial order.' },
    { name: 'th[data-type]', type: 'attr', default: 'auto', desc: 'number | date | text. Auto-detected from cell text ($1,200, 4.2k, −3%, Nov 12, 2026…).' },
    { name: 'th[data-hidden] / th[data-hideable="false"]', type: 'attr', desc: 'Start a column hidden / keep it out of the Columns menu.' },
    { name: 'td[data-value]', type: 'attr', desc: 'Raw value used for sorting instead of the cell text.' },
    { name: 'data-sort-all', type: 'attr', desc: 'Every column is sortable.' },
    { name: 'data-page-size', type: 'attr', default: '10', desc: 'Rows per page. data-page-sizes="5,10,20,50" sets the selector options.' },
    { name: 'data-pagination / data-search / data-columns-menu', type: 'attr', default: 'true', desc: 'Set to "false" to turn a feature off.' },
    { name: 'data-select', type: 'attr', default: 'false', desc: 'Adds a checkbox column with select-all (indeterminate when partial). Implied by data-bulk.' },
    { name: 'data-bulk', type: 'attr', desc: 'Comma-separated bulk actions, e.g. "Export,Archive,Delete". Delete/Remove/Archive are styled as destructive.' },
    { name: 'data-search-placeholder', type: 'attr', default: 'Search…', desc: 'Search input placeholder.' },
    { name: 'Ranj.dataTable(el, opts)', type: 'js', desc: 'Render from JSON: { columns: [{ key, label, type, render(v,row), sortable, hidden, hideable, align, width }], rows, pageSize, select, bulk: [{ label, danger, onClick(rows, table) }], searchPlaceholder, maxHeight }. Returns the instance.' },
    { name: 'instance methods', type: 'js', desc: 'sortBy(col, "asc"|"desc"|"none"), search(q), goTo(page), setPageSize(n), selectAll(bool), getSelected(), setColumn(i|key, visible), removeRows(fn), setRows(rows) (JSON tables), destroy().' },
    { name: 'ranj:sort', type: 'event', desc: 'detail: { key, column, dir }' },
    { name: 'ranj:search', type: 'event', desc: 'detail: { query, count }' },
    { name: 'ranj:page', type: 'event', desc: 'detail: { page, pageSize, pages }' },
    { name: 'ranj:select', type: 'event', desc: 'detail: { rows, count }' },
    { name: 'ranj:bulk', type: 'event', desc: 'detail: { action, rows, count }. Cancelable: preventDefault() skips the action’s onClick.' },
    { name: 'ranj:columns', type: 'event', desc: 'detail: { key, visible, hidden }' }
  ]
});
