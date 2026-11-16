(function () {
  var I = window.__ovI;
  function panel(v, html) { return '<div class="tab-panel" data-tab-panel="' + v + '">' + html + '</div>'; }
  var account = '<div class="demo-tabs-card"><b>Account</b><p>Make changes to your account here. Click save when you\'re done.</p><label class="label">Name</label><input class="input" value="Pedro Duarte"><label class="label">Username</label><input class="input" value="@peduarte"><button class="btn btn-sm" style="justify-self:start;margin-top:.5rem">Save changes</button></div>';
  var password = '<div class="demo-tabs-card"><b>Password</b><p>Change your password here. After saving, you\'ll be logged out.</p><label class="label">Current password</label><input class="input" type="password" value="hunter22"><label class="label">New password</label><input class="input" type="password"><button class="btn btn-sm" style="justify-self:start;margin-top:.5rem">Save password</button></div>';
  RanjDocs.add({
    id: 'tabs',
    name: 'Tabs',
    group: 'Navigation',
    description: 'Switch between related panels. A sliding indicator glides to the selected tab in every style (underline, pills, segmented, vertical); arrow keys move and select; panels can render lazily on first open. v1 markup keeps working.',
    tags: ['js'],
    keywords: ['tab bar', 'segmented control', 'tablist', 'switcher'],
    demos: [
      {
        title: 'Underline',
        center: false,
        html: `
<div class="tabs" style="max-width: 32rem; margin: 0 auto">
  <div class="tabs-list">
    <button class="tabs-trigger" data-tab="overview" aria-selected="true">${I.layout} Overview</button>
    <button class="tabs-trigger" data-tab="activity">${I.chart} Activity <span class="tabs-badge">12</span></button>
    <button class="tabs-trigger" data-tab="settings">${I.settings} Settings</button>
    <button class="tabs-trigger" data-tab="billing" disabled>${I.card} Billing</button>
  </div>
  <div class="tabs-content">
    ${panel('overview', '<div class="demo-tabs-stats"><div><small>Visitors</small><b>24.8k</b><em>+18%</em></div><div><small>Conversion</small><b>3.42%</b><em>+0.4%</em></div><div><small>Revenue</small><b>$9,120</b><em>+12%</em></div></div>')}
    ${panel('activity', '<ul class="demo-tabs-feed"><li><span class="demo-ov-avatar" style="--h:20;width:26px;height:26px;font-size:10px">AK</span><span><b>Alex Kim</b> merged <code>#482</code> into main</span><small>2m</small></li><li><span class="demo-ov-avatar" style="--h:170;width:26px;height:26px;font-size:10px">JS</span><span><b>Jo Silva</b> opened an issue</span><small>1h</small></li><li><span class="demo-ov-avatar" style="--h:300;width:26px;height:26px;font-size:10px">RT</span><span><b>Ravi Tan</b> deployed v2.3.0</span><small>3h</small></li></ul>')}
    ${panel('settings', '<p class="demo-tabs-p">Project settings live here: domains, environment variables and access control.</p>')}
    ${panel('billing', '<p class="demo-tabs-p">Billing</p>')}
  </div>
</div>`,
        css: `.demo-tabs-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; }
.demo-tabs-stats div { display: flex; flex-direction: column; padding: .85rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); }
.demo-tabs-stats small { color: var(--muted-fg); font-size: .75rem; } .demo-tabs-stats b { font-size: 1.35rem; letter-spacing: -.02em; } .demo-tabs-stats em { font-style: normal; font-size: .75rem; color: var(--success); }
.demo-tabs-feed { list-style: none; display: grid; gap: .25rem; }
.demo-tabs-feed li { display: flex; align-items: center; gap: .625rem; padding: .5rem; border-radius: var(--radius); font-size: .8438rem; color: var(--muted-fg); }
.demo-tabs-feed li:hover { background: var(--muted); } .demo-tabs-feed b { color: var(--fg); font-weight: 600; } .demo-tabs-feed span:nth-child(2) { flex: 1; } .demo-tabs-feed small { font-size: .72rem; }
.demo-tabs-feed code { font-family: var(--font-mono); font-size: .8em; }
.demo-tabs-p { color: var(--muted-fg); font-size: .875rem; }
@media (max-width: 480px) { .demo-tabs-stats { grid-template-columns: 1fr 1fr; } }`
      },
      {
        title: 'Segmented (enclosed)',
        description: 'The shadcn classic. Add <code>.tabs-full</code> to stretch the triggers.',
        center: false,
        html: `
<div class="tabs tabs-enclosed tabs-full" style="max-width: 25rem; margin: 0 auto">
  <div class="tabs-list">
    <button class="tabs-trigger" data-tab="account">Account</button>
    <button class="tabs-trigger" data-tab="password">Password</button>
  </div>
  <div class="tabs-content">
    ${panel('account', account)}
    ${panel('password', password)}
  </div>
</div>`,
        css: `.demo-tabs-card { display: grid; gap: .45rem; padding: 1.25rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); }
.demo-tabs-card b { font-size: 1rem; } .demo-tabs-card p { color: var(--muted-fg); font-size: .8125rem; margin-bottom: .5rem; } .demo-tabs-card .label { margin: .25rem 0 0; font-size: .8125rem; }`
      },
      {
        title: 'Pills',
        html: `
<div class="tabs tabs-pills">
  <div class="tabs-list">
    <button class="tabs-trigger">All</button>
    <button class="tabs-trigger">Design <span class="tabs-badge">8</span></button>
    <button class="tabs-trigger">Engineering</button>
    <button class="tabs-trigger">Marketing</button>
    <button class="tabs-trigger">Sales</button>
  </div>
</div>`
      },
      {
        title: 'Vertical & lazy panels',
        description: 'Panels with <code>data-lazy</code> render their <code>&lt;template&gt;</code> the first time they open. Becomes horizontal on phones.',
        center: false,
        html: `
<div class="tabs tabs-vertical tabs-pills" style="max-width: 36rem; margin: 0 auto">
  <div class="tabs-list">
    <button class="tabs-trigger" data-tab="general">${I.settings} General</button>
    <button class="tabs-trigger" data-tab="security">${I.shield} Security</button>
    <button class="tabs-trigger" data-tab="notifications">${I.bell} Notifications</button>
    <button class="tabs-trigger" data-tab="integrations">${I.layers} Integrations</button>
  </div>
  <div class="tabs-content">
    <div class="tab-panel" data-tab-panel="general"><h4 class="demo-tabs-h">General</h4><p class="demo-tabs-p">Workspace name, URL and default language.</p></div>
    <div class="tab-panel" data-tab-panel="security" data-lazy><template><h4 class="demo-tabs-h">Security</h4><p class="demo-tabs-p">Loaded lazily at <b id="tabs-lazy-time"></b>. Enforce SSO, 2FA and session length.</p></template></div>
    <div class="tab-panel" data-tab-panel="notifications"><h4 class="demo-tabs-h">Notifications</h4><p class="demo-tabs-p">Choose what lands in your inbox and what stays in the app.</p></div>
    <div class="tab-panel" data-tab-panel="integrations"><h4 class="demo-tabs-h">Integrations</h4><p class="demo-tabs-p">Slack, GitHub, Linear, Figma and 40 more.</p></div>
  </div>
</div>`,
        js: `root.querySelector('.tabs').addEventListener('ranj:change', function (e) {
  var t = root.querySelector('#tabs-lazy-time'); if (t && !t.textContent) t.textContent = new Date().toLocaleTimeString();
});`,
        css: `.demo-tabs-h { font-size: 1rem; font-weight: 600; margin-bottom: .25rem; }`
      }
    ],
    api: [
      { name: '.tabs > .tabs-list > .tabs-trigger', type: 'class', desc: 'Triggers (buttons). <code>.tabs-badge</code> for counts.' },
      { name: '.tab-panel[data-tab-panel]', type: 'class', desc: 'Panels, matched to triggers by <code>data-tab</code> (or by order). Wrap in <code>.tabs-content</code>.' },
      { name: '.tabs-pills / -enclosed / -vertical', type: 'class', desc: 'Styles; combine <code>.tabs-vertical.tabs-pills</code>. <code>.tabs-full</code> stretches, <code>.tabs-sm / -lg</code> sizes.' },
      { name: 'aria-selected="true"', type: 'attr', desc: 'Initially selected trigger (or <code>data-default</code> on <code>.tabs</code>).' },
      { name: 'data-activation="manual"', type: 'attr', desc: 'Arrows move focus only; Enter/Space selects.' },
      { name: 'data-lazy', type: 'attr', desc: 'On a panel: render its <code>&lt;template&gt;</code> on first activation (fires <code>ranj:load</code>).' },
      { name: 'data-indicator="false"', type: 'attr', desc: 'Disable the sliding indicator.' },
      { name: 'Ranj.tabs.select(el, value)', type: 'js', desc: 'Select by value or index.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ value, index, trigger }</code> on <code>.tabs</code>.' }
    ]
  });
})();
