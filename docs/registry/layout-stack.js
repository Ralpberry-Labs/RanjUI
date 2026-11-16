(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'stack',
    name: 'Stack',
    group: 'Layout',
    description: 'Flexbox primitives for spacing things in a line: vertical <code>.stack</code>, horizontal <code>.hstack</code>, wrapping <code>.cluster</code>, and <code>.split</code> for "left thing, right thing".',
    keywords: ['flex', 'vstack', 'hstack', 'cluster', 'split', 'spacing', 'gap'],
    demos: [
      {
        title: 'Stack and hstack',
        center: false,
        html: `<div class="grid grid-cols-2" style="--gap:2rem">
  <div class="stack gap-3">
    <div class="demo-stack-box">.stack</div><div class="demo-stack-box">gap-3</div><div class="demo-stack-box">children</div>
  </div>
  <div class="hstack gap-2" style="align-self:start;flex-wrap:wrap">
    <div class="demo-stack-box">.hstack</div><div class="demo-stack-box">gap-2</div><div class="demo-stack-box">row</div>
  </div>
</div>`,
        css: '.demo-stack-box { padding: .6rem .9rem; border-radius: var(--radius); background: var(--primary-soft); color: var(--primary-soft-fg); font-family: var(--font-mono); font-size: .75rem; border: 1px solid color-mix(in oklab, var(--primary) 25%, transparent); }'
      },
      {
        title: 'Split: header row',
        description: 'The first child grows; the rest wrap below on narrow screens.',
        center: false,
        html: `<div class="split" style="max-width:44rem;margin:0 auto">
  <div class="stack gap-1">
    <h3 class="h4">API keys</h3>
    <p class="small muted" style="font-weight:400">Keys give full access to your workspace. Keep them secret.</p>
  </div>
  <div class="cluster">
    <button class="btn btn-outline btn-sm">${I('download')} Export</button>
    <button class="btn btn-sm">${I('plus')} New key</button>
  </div>
</div>`
      },
      {
        title: 'Cluster: wrapping tags',
        html: `<div class="cluster" style="max-width:28rem">
  <span class="chip">${I('mapPin')} Remote</span><span class="chip">Full-time</span><span class="chip">$140k – $180k</span><span class="chip">TypeScript</span><span class="chip">Postgres</span><span class="chip">Design systems</span><span class="chip">4-day week</span>
</div>`
      },
      {
        title: 'Divided stack',
        center: false,
        html: `<div class="stack stack-divided gap-4" style="max-width:26rem;margin:0 auto">
  <div class="split"><span class="small">Two-factor authentication</span><span class="badge badge-soft badge-success badge-dot">Enabled</span></div>
  <div class="split"><span class="small">Login alerts</span><span class="badge badge-soft badge-dot badge-neutral">Email</span></div>
  <div class="split"><span class="small">Session timeout</span><span class="small muted">30 minutes</span></div>
</div>`
      }
    ],
    api: [
      { name: '.stack / .vstack', type: 'class', desc: 'Column flex with <code>--gap</code> (default 1rem).' },
      { name: '.hstack', type: 'class', desc: 'Row flex, items centered, default gap .75rem.' },
      { name: '.gap-0 … .gap-16', type: 'class', desc: 'Gap scale (also sets <code>--gap</code>).' },
      { name: '.stack-divided', type: 'class', desc: 'Hairline between children.' },
      { name: '.cluster', type: 'class', desc: 'Wrapping row of items. <code>.cluster-between</code>, <code>.cluster-end</code>.' },
      { name: '.split', type: 'class', desc: 'Space-between row whose first child grows and wraps under <code>--split-basis</code> (10rem).' },
      { name: '.center / .spacer', type: 'class', desc: 'Center both axes / flexible spacer.' },
      { name: '.md-hstack / .sm-hstack', type: 'class', desc: 'Stack on mobile, row from that breakpoint up.' }
    ]
  });
})();
