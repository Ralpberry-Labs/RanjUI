(function () {
  var I = window.__ovI;
  function it(icon, label, extra, attrs) { return '<a class="sidebar-item" href="#"' + (attrs || '') + '>' + I[icon] + '<span class="sidebar-item-text">' + label + '</span>' + (extra || '') + '</a>'; }
  var sidebar = `
  <aside class="sidebar" id="sidebar-app">
    <div class="sidebar-header">
      <a class="sidebar-brand" href="#"><span class="sidebar-logo">${I.layers}</span><span class="sidebar-brand-text">Acme Inc.<small>Enterprise</small></span></a>
    </div>
    <div class="sidebar-content">
      <div class="sidebar-group">
        <div class="sidebar-label">Platform</div>
        ${it('home', 'Dashboard', '', ' aria-current="page"')}
        ${it('inbox', 'Inbox', '<span class="sidebar-badge">12</span>')}
        ${it('chart', 'Analytics')}
        <div class="sidebar-sub" data-state="open">
          <button class="sidebar-item">${I.folder}<span class="sidebar-item-text">Projects</span></button>
          <div class="sidebar-sub-content"><div>
            <a class="sidebar-item" href="#"><span class="sidebar-item-text">Atlas redesign</span></a>
            <a class="sidebar-item" href="#"><span class="sidebar-item-text">Mobile app</span></a>
            <a class="sidebar-item" href="#"><span class="sidebar-item-text">Billing v2</span></a>
          </div></div>
        </div>
        ${it('calendar', 'Calendar')}
      </div>
      <div class="sidebar-group">
        <div class="sidebar-label">Team</div>
        ${it('users', 'Members', '<span class="sidebar-badge sidebar-badge-muted">24</span>')}
        ${it('settings', 'Settings', '<span class="sidebar-kbd">⌘,</span>')}
      </div>
    </div>
    <div class="sidebar-footer">
      <div class="sidebar-user"><span class="demo-ov-avatar" style="--h:20;width:32px;height:32px;font-size:12px;flex-shrink:0">SC</span><span class="sidebar-user-text"><b>Sofia Chen</b><small>sofia@acme.co</small></span></div>
    </div>
  </aside>
  <div class="sidebar-backdrop"></div>`;
  RanjDocs.add({
    id: 'sidebar',
    name: 'Sidebar',
    group: 'Navigation',
    description: 'Application navigation with groups, icons, badges and nested sections. Collapses to an icon rail with automatic tooltips, and becomes an off-canvas drawer when its layout is narrow (container query, so it adapts inside any panel).',
    tags: ['js'],
    keywords: ['app shell', 'side nav', 'drawer', 'navigation rail', 'dashboard layout'],
    demos: [
      {
        title: 'App shell',
        description: 'Use the toggle to collapse to a rail; hover the icons for tooltips. Narrow the window (or view on a phone) and it turns into a drawer.',
        pad: false, center: false, height: 520,
        html: `
<div class="sidebar-shell demo-sb" >
  ${sidebar}
  <main class="sidebar-main">
    <div class="demo-sb-top"><button class="sidebar-trigger" data-sidebar-toggle="sidebar-app" aria-label="Toggle sidebar">${I.panel}</button><span class="demo-sb-crumb">Acme Inc. <i>/</i> <b>Dashboard</b></span></div>
    <div class="demo-sb-body">
      <div class="demo-sb-cards"><div></div><div></div><div></div></div>
      <div class="demo-sb-big"></div>
    </div>
  </main>
</div>`,
        js: `var crumb = root.querySelector('.demo-sb-crumb b');
root.querySelector('.sidebar').addEventListener('ranj:change', function (e) { if (e.detail.value) crumb.textContent = e.detail.value; });`,
        css: `.demo-sb { height: 520px; }
.demo-sb-top { display: flex; align-items: center; gap: .5rem; height: 3.5rem; padding: 0 1rem; border-bottom: 1px solid var(--border); }
.demo-sb-crumb { font-size: .8125rem; color: var(--muted-fg); } .demo-sb-crumb i { font-style: normal; margin: 0 .25rem; opacity: .5; } .demo-sb-crumb b { color: var(--fg); font-weight: 500; }
.demo-sb-body { flex: 1; display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }
.demo-sb-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; } .demo-sb-cards div { aspect-ratio: 16/10; border-radius: var(--radius-lg); background: var(--muted); }
.demo-sb-big { flex: 1; border-radius: var(--radius-lg); background: var(--muted); opacity: .6; }`
      },
      {
        title: 'Phone width',
        description: 'The same sidebar inside a 360px layout is off-canvas: the toggle slides it in over a backdrop; Escape or a tap outside closes it.',
        pad: false, height: 520,
        html: `
<div class="sidebar-shell demo-sb demo-sb-phone">
  ${sidebar.replace('id="sidebar-app"', 'id="sidebar-phone"')}
  <main class="sidebar-main">
    <div class="demo-sb-top"><button class="sidebar-trigger" data-sidebar-toggle="sidebar-phone" aria-label="Open navigation">${I.menu}</button><span class="demo-sb-crumb"><b>Dashboard</b></span></div>
    <div class="demo-sb-body"><div class="demo-sb-cards" style="grid-template-columns:1fr 1fr"><div></div><div></div></div><div class="demo-sb-big"></div></div>
  </main>
</div>`,
        css: `.demo-sb-phone { width: min(360px, calc(100vw - 2rem)); height: 480px; margin: 1.25rem 0; border: 1px solid var(--border); border-radius: 1.75rem; box-shadow: var(--shadow-lg); }`
      }
    ],
    api: [
      { name: '.sidebar-shell', type: 'class', desc: 'Flex container holding <code>.sidebar</code>, an optional <code>.sidebar-backdrop</code> and <code>.sidebar-main</code>. Below 40rem wide the sidebar goes off-canvas.' },
      { name: '.sidebar', type: 'class', desc: 'Parts: <code>.sidebar-header</code>, <code>.sidebar-content</code> (groups), <code>.sidebar-footer</code>, <code>.sidebar-brand</code>, <code>.sidebar-user</code>.' },
      { name: '.sidebar-group / .sidebar-label', type: 'class', desc: 'Section with a small caps heading.' },
      { name: '.sidebar-item', type: 'class', desc: 'Link/button with an svg icon and <code>.sidebar-item-text</code>; <code>aria-current="page"</code> for the active one. Adornments: <code>.sidebar-badge</code>, <code>.sidebar-kbd</code>, <code>.sidebar-dot</code>.' },
      { name: '.sidebar-sub', type: 'class', desc: 'Nested section: first <code>.sidebar-item</code> toggles a <code>.sidebar-sub-content</code> (one wrapper div inside).' },
      { name: '.sidebar-collapsed', type: 'class', desc: 'Icon rail (v1 class). Items get tooltips automatically.' },
      { name: 'data-sidebar-toggle="id"', type: 'attr', desc: 'Collapses / expands, or opens off-canvas on narrow layouts. <code>.sidebar-trigger</code> styles an icon button.' },
      { name: 'data-persist="key"', type: 'attr', desc: 'Remember the collapsed state in localStorage.' },
      { name: '--sidebar-w / --sidebar-rail', type: 'var', default: '16rem / 3.75rem', desc: 'Expanded and rail widths.' },
      { name: 'Ranj.sidebar.toggle(el) / collapse(el) / expand(el)', type: 'js', desc: 'Programmatic control.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ collapsed }</code> or <code>{ item, value }</code> when an item is selected.' }
    ]
  });
})();
