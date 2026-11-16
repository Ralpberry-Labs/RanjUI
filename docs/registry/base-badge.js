(function () {
  var I = RB.ic;
  var tones = [['', 'Primary'], ['badge-secondary', 'Neutral'], ['badge-success', 'Paid'], ['badge-warning', 'Pending'], ['badge-destructive', 'Overdue'], ['badge-info', 'Draft']];
  function row(extra) { return tones.map(function (t) { return '<span class="badge ' + t[0] + (extra ? ' ' + extra : '') + '">' + t[1] + '</span>'; }).join('\n'); }
  RanjDocs.add({
    id: 'badge',
    name: 'Badge',
    group: 'Base',
    description: 'Small status labels in solid, soft, outline and dot styles across six tones, plus live pulse, counts and removable badges.',
    keywords: ['label', 'status', 'pill', 'tag', 'count', 'notification', 'indicator'],
    demos: [
      {
        title: 'Tones and styles',
        description: 'Solid, <code>.badge-soft</code> and <code>.badge-outline</code> across every tone.',
        html: '<div class="demo-badge-matrix">\n  <span>Solid</span><div class="cluster">' + row('') + '</div>\n  <span>Soft</span><div class="cluster">' + row('badge-soft') + '</div>\n  <span>Outline</span><div class="cluster">' + row('badge-outline') + '</div>\n</div>',
        css: '.demo-badge-matrix { display: grid; grid-template-columns: 4.5rem auto; gap: 1rem 1.25rem; align-items: center; }\n.demo-badge-matrix > span { font-size: .75rem; color: var(--muted-fg); font-weight: 500; }\n@media (max-width: 480px) { .demo-badge-matrix { grid-template-columns: 1fr; gap: .4rem; } }'
      },
      {
        title: 'Dot, pulse and icons',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="badge badge-dot badge-success">Operational</span>
<span class="badge badge-dot badge-warning">Degraded</span>
<span class="badge badge-dot badge-destructive">Outage</span>
<span class="badge badge-soft badge-success badge-pulse">Live</span>
<span class="badge badge-soft badge-destructive badge-pulse">Recording</span>
<span class="badge badge-soft badge-info">${I('clock')} 2h left</span>
<span class="badge badge-soft">${I('sparkles')} AI</span>
<span class="badge badge-gradient">${I('zap')} Pro</span>
<span class="badge badge-contrast badge-square">v2.4.0</span>
</div>`
      },
      {
        title: 'Counts and indicators',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="badge-anchor"><button class="btn btn-outline btn-icon" aria-label="Notifications, 3 unread">${I('bell')}</button><span class="badge badge-destructive badge-count">3</span></span>
<span class="badge-anchor"><button class="btn btn-outline btn-icon" aria-label="Inbox, 128 unread">${I('inbox')}</button><span class="badge badge-count">99+</span></span>
<span class="badge-anchor"><span class="avatar avatar-tint" style="--avatar-hue:200">LP</span><span class="badge-indicator" style="background:var(--success)"></span></span>
<button class="btn btn-ghost">Messages <span class="badge badge-secondary badge-count">12</span></button>
</div>`
      },
      {
        title: 'Removable and sizes',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="badge badge-soft badge-lg">react <button class="badge-remove" aria-label="Remove react">${I('x')}</button></span>
<span class="badge badge-soft badge-lg">typescript <button class="badge-remove" aria-label="Remove typescript">${I('x')}</button></span>
<span class="badge badge-outline badge-lg">design <button class="badge-remove" aria-label="Remove design">${I('x')}</button></span>
<span class="badge badge-sm">Small</span><span class="badge">Default</span><span class="badge badge-lg">Large</span>
</div>`
      }
    ],
    api: [
      { name: '.badge', type: 'class', desc: 'Solid primary badge.' },
      { name: '.badge-secondary', type: 'class', desc: 'Tones (<code>.badge-neutral</code>, <code>.badge-danger</code> are aliases). Also: <code>.badge-success</code> <code>.badge-warning</code> <code>.badge-destructive</code> <code>.badge-info</code> <code>.badge-contrast</code>' },
      { name: '.badge-soft', type: 'class', desc: 'Styles; combine with any tone. Also: <code>.badge-outline</code> <code>.badge-dot</code> <code>.badge-ghost</code> <code>.badge-gradient</code>' },
      { name: '.badge-pulse', type: 'class', desc: 'Pulsing live dot.' },
      { name: '.badge-count + .badge-anchor', type: 'class', desc: 'Numeric counter pinned to the corner of its anchor.' },
      { name: '.badge-indicator', type: 'class', desc: 'Bare dot indicator for an anchor.' },
      { name: '.badge-remove', type: 'class', desc: 'Close button; removed by ranj.js with an exit animation (fires cancelable <code>ranj:remove</code>).' },
      { name: '.badge-sm', type: 'class', desc: 'Sizes and shape. Also: <code>.badge-lg</code> <code>.badge-square</code>' }
    ]
  });
})();
