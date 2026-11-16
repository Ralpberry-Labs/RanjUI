(function () {
  var I = RB.ic;
  function boxes(n, label) { var s = ''; for (var i = 1; i <= n; i++) s += '<div class="demo-grid-box">' + (label || i) + '</div>'; return s; }
  RanjDocs.add({
    id: 'grid',
    name: 'Grid',
    group: 'Layout',
    description: '12-column CSS grid with responsive <code>sm-</code>, <code>md-</code>, <code>lg-</code> and <code>xl-</code> variants, an auto-fit grid that needs no breakpoints, and a bento layout.',
    keywords: ['columns', 'responsive', 'bento', 'auto-fit', 'css grid'],
    demos: [
      {
        title: 'Responsive columns',
        description: '1 column on phones, 2 from <code>sm</code>, 4 from <code>lg</code>.',
        center: false,
        html: '<div class="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-4 gap-4">' + boxes(8) + '</div>',
        css: '.demo-grid-box { display: grid; place-items: center; min-height: 3.5rem; border-radius: var(--radius); background: var(--primary-soft); color: var(--primary-soft-fg); font-family: var(--font-mono); font-size: .8rem; font-weight: 600; border: 1px solid color-mix(in oklab, var(--primary) 25%, transparent); }'
      },
      {
        title: 'Spans',
        center: false,
        html: `<div class="grid grid-cols-12 gap-3">
  <div class="demo-grid-box col-span-12">col-span-12</div>
  <div class="demo-grid-box col-span-8">col-span-8</div><div class="demo-grid-box col-span-4">4</div>
  <div class="demo-grid-box col-span-6">col-span-6</div><div class="demo-grid-box col-span-6">col-span-6</div>
  <div class="demo-grid-box col-span-3">3</div><div class="demo-grid-box col-span-3">3</div><div class="demo-grid-box col-span-3">3</div><div class="demo-grid-box col-span-3">3</div>
</div>`
      },
      {
        title: 'Auto-fit (no breakpoints)',
        description: 'As many columns as fit, each at least <code>--min</code> wide.',
        center: false,
        html: '<div class="grid grid-auto" style="--min:160px">' + boxes(6, 'min 160px') + '</div>'
      },
      {
        title: 'Bento',
        center: false,
        html: `<div class="bento" style="--row:150px">
  <div class="card col-span-2 row-span-2 demo-grid-bento"><span class="icon-box icon-box-solid icon-box-lg">${I('rocket')}</span><div><h3 class="h3">Deploy on push</h3><p class="muted small" style="font-weight:400">Every commit becomes a preview URL your whole team can comment on.</p></div></div>
  <div class="card col-span-2 demo-grid-bento"><div class="card-stat" style="padding:0;border:0"><div class="stat-label">Uptime, 90 days</div><div class="stat-value">99.998%</div></div></div>
  <div class="card demo-grid-bento"><span class="icon-box icon-box-success">${I('shield')}</span><b class="small">SOC 2 Type II</b></div>
  <div class="card demo-grid-bento"><span class="icon-box icon-box-info">${I('globe')}</span><b class="small">38 edge regions</b></div>
</div>`,
        css: '.demo-grid-bento { padding: 1.25rem; justify-content: space-between; gap: 1rem; }'
      }
    ],
    api: [
      { name: '.grid', type: 'class', desc: 'Grid with <code>--gap</code> (1rem).' },
      { name: '.grid-cols-1 … .grid-cols-12', type: 'class', desc: 'Fixed column counts. 3+ columns drop to 2 (and 2 to 1) under 640px unless you add <code>.grid-keep</code>.' },
      { name: '.sm-/.md-/.lg-/.xl-grid-cols-N', type: 'class', desc: 'Responsive column counts at 640 / 768 / 1024 / 1280px.' },
      { name: '.col-span-N', type: 'class', desc: 'Spanning, with <code>.md-col-span-N</code> and <code>.lg-col-span-N</code> variants. Also: <code>.col-span-full</code> <code>.row-span-N</code>' },
      { name: '.grid-auto / .grid-auto-fill', type: 'class', desc: 'Auto-fit grid driven by <code>--min</code> (220px).' },
      { name: '.bento', type: 'class', desc: '4-column dense grid (2 on mobile) with <code>--row</code> height.' },
      { name: '.split-even / .sidebar-layout', type: 'class', desc: 'Two equal columns that stack when narrow / sidebar + main that wraps intrinsically.' }
    ]
  });
})();
