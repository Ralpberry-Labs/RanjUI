(function () {
var home = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>';
var folder = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-8l-2-3H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1z"/></svg>';
var file = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/></svg>';
RanjDocs.add({
  id: 'breadcrumb',
  name: 'Breadcrumb',
  group: 'Data Display',
  description: 'Shows where the current page sits in a hierarchy. Slash, chevron, arrow and dot separators, icons, pill and step styles, and a collapsed “…” variant that expands in place without a dropdown.',
  tags: [],
  keywords: ['path', 'trail', 'navigation', 'crumbs'],
  demos: [
    {
      title: 'Separators',
      html: `<div style="display:grid;gap:1rem">
  <nav aria-label="Breadcrumb"><ol class="breadcrumb">
    <li><a href="#">Dashboard</a></li><li><a href="#">Projects</a></li><li aria-current="page">Atlas redesign</li>
  </ol></nav>
  <nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-chevron">
    <li><a href="#">Dashboard</a></li><li><a href="#">Projects</a></li><li aria-current="page">Atlas redesign</li>
  </ol></nav>
  <nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-arrow">
    <li><a href="#">Dashboard</a></li><li><a href="#">Projects</a></li><li aria-current="page">Atlas redesign</li>
  </ol></nav>
  <nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-dot">
    <li><a href="#">Dashboard</a></li><li><a href="#">Projects</a></li><li aria-current="page">Atlas redesign</li>
  </ol></nav>
</div>`
    },
    {
      title: 'With icons',
      html: `<nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-chevron">
  <li><a href="#" aria-label="Home">${home}</a></li>
  <li><a href="#">${folder}acme-web</a></li>
  <li><a href="#">${folder}src</a></li>
  <li><a href="#">${folder}components</a></li>
  <li aria-current="page">${file}DataTable.tsx</li>
</ol></nav>`
    },
    {
      title: 'Collapsed',
      description: 'Middle crumbs carry <code>.breadcrumb-hidden</code>; the list has <code>.breadcrumb-collapsed</code>. Clicking “…” reveals the full path. No dropdown needed.',
      html: `<nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-chevron breadcrumb-collapsed">
  <li><a href="#">Acme Inc.</a></li>
  <li class="breadcrumb-ellipsis"><button type="button" aria-label="Show full path">…</button></li>
  <li class="breadcrumb-hidden"><a href="#">Engineering</a></li>
  <li class="breadcrumb-hidden"><a href="#">Platform</a></li>
  <li class="breadcrumb-hidden"><a href="#">Q4 Planning</a></li>
  <li><a href="#">Roadmap</a></li>
  <li aria-current="page">Edge caching RFC</li>
</ol></nav>`
    },
    {
      title: 'Pill and steps',
      html: `<div style="display:grid;gap:1.25rem;justify-items:center">
  <nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-chevron breadcrumb-pill">
    <li><a href="#">${home}Home</a></li><li><a href="#">Settings</a></li><li aria-current="page">Billing</li>
  </ol></nav>
  <nav aria-label="Checkout steps"><ol class="breadcrumb breadcrumb-steps">
    <li><a href="#">1. Cart</a></li><li><a href="#">2. Shipping</a></li><li aria-current="step">3. Payment</li>
  </ol></nav>
</div>`,
      css: `.breadcrumb-steps [aria-current="step"] { padding: .3rem .7rem; border-radius: var(--radius-sm); background: var(--primary-soft); color: var(--primary-soft-fg); font-weight: 500; }`
    }
  ],
  api: [
    { name: '.breadcrumb', type: 'class', desc: 'An ol/ul of li items. Links are muted; the last item uses aria-current="page". Wrap it in nav aria-label="Breadcrumb".' },
    { name: '.breadcrumb-chevron / -arrow / -dot / -slash', type: 'class', desc: 'Separator style (slash is the default).' },
    { name: '.breadcrumb-pill / .breadcrumb-steps', type: 'class', desc: 'Contained pill or step-chip appearance.' },
    { name: '.breadcrumb-collapsed + .breadcrumb-hidden + .breadcrumb-ellipsis', type: 'class', desc: 'Hide middle items behind a "…" button. With ranj.js, clicking it reveals them (ranj:expand fires).' },
    { name: '.breadcrumb-responsive', type: 'class', desc: 'Below 520px, hides every item except the first and last two (pair with a .breadcrumb-ellipsis item).' },
    { name: '.breadcrumb-truncate', type: 'class', desc: 'Long crumbs get an ellipsis at 12rem.' },
    { name: '--bc-sep', type: 'var', default: "'/'", desc: 'Separator content: any string, e.g. "›" or "·".' },
    { name: '--bc-gap', type: 'var', default: '.5rem', desc: 'Space around separators.' },
    { name: 'ranj:expand', type: 'event', desc: 'Fired on the list when a collapsed path is expanded.' }
  ]
});
})();
