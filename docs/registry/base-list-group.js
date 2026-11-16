(function () {
  var I = RB.ic, F = RB.face;
  var chev = I('chevronRight', 'class="list-group-chevron"');
  RanjDocs.add({
    id: 'list-group',
    name: 'List group',
    group: 'Base',
    description: 'A bordered list of rows with icons, descriptions, meta and actions. Good for settings, files, notifications and navigation.',
    tags: ['new'],
    keywords: ['list', 'rows', 'item group', 'settings list', 'menu list'],
    demos: [
      {
        title: 'Settings',
        center: false,
        html: `<nav class="list-group" style="max-width:26rem;margin:0 auto" aria-label="Settings">
  <a class="list-group-item" href="#"><span class="list-group-icon">${I('user')}</span><span class="list-group-content"><span class="list-group-title">Profile</span><span class="list-group-description">Name, photo and bio</span></span>${chev}</a>
  <a class="list-group-item" href="#" aria-current="true"><span class="list-group-icon">${I('lock')}</span><span class="list-group-content"><span class="list-group-title">Security</span><span class="list-group-description">Passkeys and two-factor</span></span>${chev}</a>
  <a class="list-group-item" href="#"><span class="list-group-icon">${I('bell')}</span><span class="list-group-content"><span class="list-group-title">Notifications</span><span class="list-group-description">Email, push and Slack</span></span><span class="badge badge-soft badge-sm">3 new</span>${chev}</a>
  <a class="list-group-item" href="#"><span class="list-group-icon">${I('creditCard')}</span><span class="list-group-content"><span class="list-group-title">Billing</span><span class="list-group-description">Pro plan · renews Dec 1</span></span>${chev}</a>
</nav>`
      },
      {
        title: 'Files with hover actions',
        center: false,
        html: `<ul class="list-group list-group-hover-actions" style="max-width:30rem;margin:0 auto">
  <li class="list-group-header">Recent files</li>
  <li class="list-group-item"><span class="list-group-icon" style="background:var(--info-soft);color:var(--info-soft-fg)">${I('fileCode')}</span><span class="list-group-content"><span class="list-group-title">checkout-flow.tsx</span><span class="list-group-description">Edited by Jun Kim</span></span><span class="list-group-meta">2m ago</span><span class="list-group-action"><button class="btn btn-ghost btn-icon btn-sm" aria-label="Download">${I('download')}</button><button class="btn btn-ghost btn-icon btn-sm" aria-label="More">${I('more')}</button></span></li>
  <li class="list-group-item"><span class="list-group-icon" style="background:var(--success-soft);color:var(--success-soft-fg)">${I('image')}</span><span class="list-group-content"><span class="list-group-title">hero-dark@2x.png</span><span class="list-group-description">2.4 MB · 2880×1620</span></span><span class="list-group-meta">1h ago</span><span class="list-group-action"><button class="btn btn-ghost btn-icon btn-sm" aria-label="Download">${I('download')}</button><button class="btn btn-ghost btn-icon btn-sm" aria-label="More">${I('more')}</button></span></li>
  <li class="list-group-item"><span class="list-group-icon" style="background:var(--warning-soft);color:var(--warning-soft-fg)">${I('folder')}</span><span class="list-group-content"><span class="list-group-title">Brand assets</span><span class="list-group-description">48 files</span></span><span class="list-group-meta">Yesterday</span><span class="list-group-action"><button class="btn btn-ghost btn-icon btn-sm" aria-label="Download">${I('download')}</button><button class="btn btn-ghost btn-icon btn-sm" aria-label="More">${I('more')}</button></span></li>
</ul>`
      },
      {
        title: 'Notifications',
        center: false,
        html: `<ul class="list-group" style="max-width:28rem;margin:0 auto">
  <li class="list-group-item" style="align-items:flex-start"><img class="avatar avatar-sm" src="${F(20)}" alt=""><span class="list-group-content"><span class="small"><b>Ana Silva</b> commented on <b>Q4 roadmap</b></span><span class="list-group-description">"Can we move the pricing launch up a week?"</span></span><span class="badge-indicator" style="background:var(--primary);margin-top:.4rem"></span></li>
  <li class="list-group-item" style="align-items:flex-start"><span class="avatar avatar-sm avatar-tint" style="--avatar-hue:150">JK</span><span class="list-group-content"><span class="small"><b>Jun Kim</b> assigned you <b>ACME-482</b></span><span class="list-group-description">Fix rounding on annual invoices</span></span><span class="list-group-meta">1h</span></li>
  <li class="list-group-item" style="align-items:flex-start"><span class="list-group-icon" style="width:2rem;height:2rem;background:var(--success-soft);color:var(--success-soft-fg)">${I('rocket')}</span><span class="list-group-content"><span class="small"><b>Production deploy</b> succeeded</span><span class="list-group-description">v2.14.0 · 48s</span></span><span class="list-group-meta">3h</span></li>
</ul>`
      },
      {
        title: 'Inset navigation',
        html: `<nav class="list-group list-group-inset" style="width:14rem" aria-label="Workspace">
  <a class="list-group-item" href="#" aria-current="true"><span>${I('inbox', 'class="size-4"')}</span><span class="list-group-content">Inbox</span><span class="list-group-meta">12</span></a>
  <a class="list-group-item" href="#"><span>${I('layers', 'class="size-4"')}</span><span class="list-group-content">Projects</span></a>
  <a class="list-group-item" href="#"><span>${I('users', 'class="size-4"')}</span><span class="list-group-content">Team</span></a>
  <a class="list-group-item" href="#"><span>${I('settings', 'class="size-4"')}</span><span class="list-group-content">Settings</span></a>
</nav>`
      }
    ],
    api: [
      { name: '.list-group', type: 'class', desc: 'Bordered container (<code>ul</code>, <code>nav</code> or <code>div</code>). v1 <code>.item-group</code> still works.' },
      { name: '.list-group-item', type: 'class', desc: 'Row. Hover state when it is an <code>a</code>, <code>button</code> or has <code>data-clickable</code>.' },
      { name: 'aria-current="true"', type: 'attr', desc: 'Selected row with an accent bar. <code>aria-disabled</code> dims it.' },
      { name: '.list-group-icon', type: 'class', desc: 'Row parts. Also: <code>.list-group-content</code> <code>.list-group-title</code> <code>.list-group-description</code> <code>.list-group-meta</code> <code>.list-group-action</code> <code>.list-group-chevron</code>' },
      { name: '.list-group-header', type: 'class', desc: 'Section label row.' },
      { name: '.list-group-hover-actions', type: 'class', desc: 'Reveal actions on hover/focus (always visible on touch).' },
      { name: '.list-group-flush', type: 'class', desc: 'No border, sidebar style, compact, counters. Also: <code>.list-group-inset</code> <code>.list-group-sm</code> <code>.list-group-numbered</code>' }
    ]
  });
})();
