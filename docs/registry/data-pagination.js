RanjDocs.add({
  id: 'pagination',
  name: 'Pagination',
  group: 'Data Display',
  description: 'Page navigation with smart ellipses, prev/next, compact jump-to-page and dot styles. Write the markup yourself, or let <code>data-pagination</code> render and manage it and listen for <code>ranj:change</code>.',
  tags: ['js'],
  keywords: ['pager', 'pages', 'paging', 'next', 'previous'],
  demos: [
    {
      title: 'Numbered with ellipsis',
      description: 'Rendered from <code>data-total</code> and <code>data-page</code>. Arrow keys move between pages.',
      html: `<nav class="pagination" data-pagination data-total="24" data-page="7"></nav>`
    },
    {
      title: 'Styles',
      description: 'Solid, outline, joined and rounded. Every style works with hand-written markup too.',
      html: `<div style="display:grid;gap:1.25rem;justify-items:center">
  <nav class="pagination pagination-solid" data-pagination data-total="12" data-page="3" data-labels="false"></nav>
  <nav class="pagination pagination-outline pagination-rounded" data-pagination data-total="12" data-page="5" data-labels="false"></nav>
  <nav class="pagination pagination-joined" data-pagination data-total="9" data-page="2" data-labels="false"></nav>
</div>`
    },
    {
      title: 'Hand-written markup',
      description: 'No JavaScript needed: links with <code>aria-current="page"</code>.',
      html: `<nav aria-label="Pagination">
  <ul class="pagination">
    <li><a class="pagination-prev" href="#" aria-label="Previous page"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg><span class="pagination-label">Previous</span></a></li>
    <li><a href="#">1</a></li>
    <li><a href="#" aria-current="page">2</a></li>
    <li><a href="#">3</a></li>
    <li><span class="pagination-ellipsis">…</span></li>
    <li><a href="#">18</a></li>
    <li><a class="pagination-next" href="#" aria-label="Next page"><span class="pagination-label">Next</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></a></li>
  </ul>
</nav>`
    },
    {
      title: 'Simple, compact and dots',
      center: false,
      html: `<div style="display:grid;gap:1.5rem;max-width:560px;margin:auto">
  <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">
    <span class="pagination-info">Showing <b>41–60</b> of <b>1,284</b> orders</span>
    <nav class="pagination pagination-sm" data-pagination data-mode="simple" data-total="65" data-page="3"></nav>
  </div>
  <div style="display:flex;justify-content:center"><nav class="pagination pagination-compact" data-pagination data-mode="compact" data-total="128" data-page="12" data-labels="false"></nav></div>
  <div style="display:flex;justify-content:center"><nav class="pagination pagination-dots" data-pagination data-mode="dots" data-total="6" data-page="2"></nav></div>
</div>`
    },
    {
      title: 'Controlled with JS',
      html: `<div style="display:grid;gap:1rem;justify-items:center">
  <nav class="pagination pagination-solid demo-pagination-js"></nav>
  <p class="pagination-info demo-pagination-out">Viewing page <b>1</b> of 40</p>
</div>`,
      js: `const out = root.querySelector('.demo-pagination-out');
Ranj.pagination(root.querySelector('.demo-pagination-js'), {
  total: 40, page: 1, siblings: 2,
  onChange: (page) => { out.innerHTML = 'Viewing page <b>' + page + '</b> of 40'; }
});`
    }
  ],
  api: [
    { name: '.pagination', type: 'class', desc: 'Container (nav, ul or div). Items are a/button; current item uses aria-current="page".' },
    { name: '.pagination-solid / -outline / -joined / -rounded', type: 'class', desc: 'Visual styles.' },
    { name: '.pagination-sm / .pagination-lg', type: 'class', desc: 'Sizes.' },
    { name: '.pagination-compact / .pagination-dots / .pagination-simple', type: 'class', desc: 'Layouts for the compact, dots and simple modes.' },
    { name: '.pagination-ellipsis / .pagination-info / .pagination-label', type: 'class', desc: 'Gap marker, "Page 3 of 9" text, Prev/Next labels (hidden below 480px).' },
    { name: 'data-pagination', type: 'attr', desc: 'Render and manage the pager from data attributes.' },
    { name: 'data-total / data-page', type: 'attr', default: '1 / 1', desc: 'Page count and current page.' },
    { name: 'data-siblings / data-boundaries', type: 'attr', default: '1 / 1', desc: 'Pages shown around the current page and at each end.' },
    { name: 'data-mode', type: 'attr', default: 'numbers', desc: 'numbers | simple | compact | dots.' },
    { name: 'data-labels', type: 'attr', default: 'true', desc: 'Show "Previous"/"Next" text.' },
    { name: '--pg-size / --pg-gap', type: 'var', default: '2.25rem / .25rem', desc: 'Item size and spacing.' },
    { name: 'Ranj.pagination(el, opts)', type: 'js', desc: '{ total, page, siblings, boundaries, mode, labels, onChange(page, prev) } → { set(n), setTotal(n), page }.' },
    { name: 'Ranj.pagination.range(page, total, siblings, boundaries)', type: 'js', desc: 'Returns the page list with "…" gaps, for custom renderers.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { page, previous, total, user }' }
  ]
});
