(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'icon-box',
    name: 'Icon box',
    group: 'Base',
    description: 'A tinted tile that frames an icon, plus <code>.feature</code> layouts for feature grids. Soft, solid gradient, outline and glow styles.',
    tags: ['new'],
    keywords: ['feature icon', 'icon tile', 'icon container', 'features', 'benefits'],
    demos: [
      {
        title: 'Styles and tones',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="icon-box">${I('zap')}</span>
<span class="icon-box icon-box-success">${I('checkCircle')}</span>
<span class="icon-box icon-box-warning">${I('alert')}</span>
<span class="icon-box icon-box-destructive">${I('trash')}</span>
<span class="icon-box icon-box-info">${I('info')}</span>
<span class="icon-box icon-box-neutral">${I('settings')}</span>
<span class="icon-box icon-box-solid">${I('sparkles')}</span>
<span class="icon-box icon-box-solid" style="--icon-box-hue:150">${I('shield')}</span>
<span class="icon-box icon-box-solid" style="--icon-box-hue:30">${I('rocket')}</span>
<span class="icon-box icon-box-outline">${I('command')}</span>
<span class="icon-box icon-box-glow icon-box-circle">${I('star')}</span>
</div>`
      },
      {
        title: 'Sizes',
        html: `<span class="icon-box icon-box-sm">${I('globe')}</span><span class="icon-box">${I('globe')}</span><span class="icon-box icon-box-lg">${I('globe')}</span><span class="icon-box icon-box-xl icon-box-solid icon-box-glow">${I('globe')}</span>`
      },
      {
        title: 'Feature grid',
        center: false,
        html: `<div class="grid grid-auto" style="--min:220px;--gap:1.25rem">
  <div class="feature feature-card"><span class="icon-box icon-box-outline">${I('zap')}</span><div class="feature-title">Edge rendering</div><p class="feature-text">Pages render in the region closest to each visitor, in under 50 ms.</p></div>
  <div class="feature feature-card"><span class="icon-box icon-box-outline">${I('database')}</span><div class="feature-title">Managed Postgres</div><p class="feature-text">Branching databases for every preview, with point-in-time restore.</p></div>
  <div class="feature feature-card"><span class="icon-box icon-box-outline">${I('shield')}</span><div class="feature-title">Firewall included</div><p class="feature-text">Bot protection and rate limits with no config and no extra bill.</p></div>
</div>`
      },
      {
        title: 'Feature rows',
        center: false,
        html: `<div class="stack gap-6" style="max-width:30rem;margin:0 auto">
  <div class="feature feature-row"><span class="icon-box icon-box-solid">${I('rocket')}</span><div><div class="feature-title">Ship in minutes</div><p class="feature-text">Connect a repo and every push becomes a live URL.</p></div></div>
  <div class="feature feature-row"><span class="icon-box icon-box-solid" style="--icon-box-hue:150">${I('chart')}</span><div><div class="feature-title">Analytics built in</div><p class="feature-text">Privacy-friendly traffic and Web Vitals, no script tag.</p></div></div>
  <div class="feature feature-row"><span class="icon-box icon-box-solid" style="--icon-box-hue:30">${I('users')}</span><div><div class="feature-title">Made for teams</div><p class="feature-text">Comments on previews, roles, and SSO on every plan.</p></div></div>
</div>`
      }
    ],
    api: [
      { name: '.icon-box', type: 'class', desc: 'Soft brand tile; the icon scales to 46% of the box.' },
      { name: '.icon-box-success', type: 'class', desc: 'Tones. Also: <code>.icon-box-warning</code> <code>.icon-box-destructive</code> <code>.icon-box-info</code> <code>.icon-box-neutral</code>' },
      { name: '.icon-box-solid', type: 'class', desc: 'Glossy gradient (hue via <code>--icon-box-hue</code>), bordered tile, halo glow, circle. Also: <code>.icon-box-outline</code> <code>.icon-box-glow</code> <code>.icon-box-circle</code>' },
      { name: '.icon-box-sm / -lg / -xl', type: 'class', desc: '32 / (44) / 56 / 72px; or set <code>--icon-box-size</code>.' },
      { name: '.feature', type: 'class', desc: 'Icon + title + text block. <code>.feature-row</code> puts the icon on the left; <code>.feature-card</code> adds a hover card. Also: <code>.feature-title</code> <code>.feature-text</code>' }
    ]
  });
})();
