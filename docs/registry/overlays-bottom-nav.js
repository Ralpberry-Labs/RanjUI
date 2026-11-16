(function () {
  var I = window.__ovI;
  function item(icon, label, cur, badge) {
    return '<a class="bottom-nav-item" href="#"' + (cur ? ' aria-current="page"' : '') + '><span class="bottom-nav-icon">' + I[icon] + (badge != null ? '<span class="bottom-nav-badge">' + badge + '</span>' : '') + '</span><span class="bottom-nav-label">' + label + '</span></a>';
  }
  function phone(inner, cls) { return '<div class="demo-bn-phone ' + (cls || '') + '"><div class="demo-bn-screen"><div class="demo-bn-bar"></div><div class="demo-bn-card"></div><div class="demo-bn-card short"></div><div class="demo-bn-card"></div></div>' + inner + '</div>'; }
  var css = `.demo-bn-phone { position: relative; display: flex; flex-direction: column; width: 18.5rem; max-width: calc(100vw - 3rem); height: 25rem; border-radius: 2rem; overflow: hidden; border: 1px solid var(--border); background: var(--bg); box-shadow: var(--shadow-lg); }
.demo-bn-screen { flex: 1; display: flex; flex-direction: column; gap: .75rem; padding: 1.25rem 1rem; }
.demo-bn-bar { height: 1.75rem; width: 60%; border-radius: 99px; background: var(--muted); }
.demo-bn-card { height: 5.5rem; border-radius: 1rem; background: var(--muted); opacity: .7; } .demo-bn-card.short { height: 3.5rem; }
.demo-bn-grad { background: linear-gradient(170deg, color-mix(in oklab, var(--primary) 18%, var(--bg)), var(--bg) 55%); }
.demo-bn-grad .demo-bn-card { background: var(--card); opacity: 1; border: 1px solid var(--border); }`;
  RanjDocs.add({
    id: 'bottom-nav',
    name: 'Bottom Navigation',
    group: 'Navigation',
    description: 'A mobile tab bar with an animated active pill that glides between destinations. Material-style by default, an expanding label variant, and a floating glass bar.',
    tags: ['js', 'new'],
    keywords: ['tab bar', 'mobile navigation', 'bottom bar', 'app bar', 'dock'],
    demos: [
      {
        title: 'Variants',
        html: `
${phone('<nav class="bottom-nav">' + item('home', 'Home', true) + item('compass', 'Explore') + item('bell', 'Activity', false, 3) + item('user', 'Profile') + '</nav>')}
${phone('<nav class="bottom-nav bottom-nav-expand">' + item('home', 'Home') + item('search', 'Search', true) + item('heart', 'Saved', false, '') + item('user', 'Account') + '</nav>')}
${phone('<nav class="bottom-nav bottom-nav-float">' + item('home', 'Home', true) + item('calendar', 'Plans') + item('message', 'Chat', false, 2) + item('settings', 'Settings') + '</nav>', 'demo-bn-grad')}`,
        css: css
      }
    ],
    api: [
      { name: '.bottom-nav', type: 'class', desc: 'Bar. <code>.bottom-nav-fixed</code> pins it to the viewport bottom (with safe-area padding).' },
      { name: '.bottom-nav-item', type: 'class', desc: 'Destination: <code>.bottom-nav-icon</code> (svg + optional <code>.bottom-nav-badge</code>, empty = dot) and <code>.bottom-nav-label</code>. <code>aria-current="page"</code> marks the active one.' },
      { name: '.bottom-nav-expand', type: 'class', desc: 'Active item grows to reveal its label inside the pill.' },
      { name: '.bottom-nav-float', type: 'class', desc: 'Floating, frosted, rounded bar.' },
      { name: 'data-static', type: 'attr', desc: "Don't change selection on click (for router-driven apps)." },
      { name: 'Ranj.bottomNav.select(el, index)', type: 'js', desc: 'Select programmatically.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ item, index, value }</code>.' }
    ]
  });

  RanjDocs.add({
    id: 'side-rail',
    name: 'Side Rail',
    group: 'Navigation',
    description: 'A slim vertical icon rail that expands over the page on hover or focus to reveal labels, with a springy indicator that slides to the active item. Its layout footprint never changes, so content does not jump.',
    tags: ['js', 'new'],
    keywords: ['navigation rail', 'icon sidebar', 'mini sidebar', 'expand on hover'],
    demos: [
      {
        title: 'Expand on hover',
        pad: false, center: false, height: 440,
        html: `
<div class="demo-rail">
  <nav class="side-rail" aria-label="Main">
    <div class="side-rail-brand"><span class="side-rail-logo">${I.zap}</span><span>Voltage</span></div>
    <a class="side-rail-item" href="#" aria-current="page">${I.home}<span class="side-rail-label">Home</span></a>
    <a class="side-rail-item" href="#">${I.inbox}<span class="side-rail-label">Inbox</span><span class="side-rail-badge">8</span></a>
    <a class="side-rail-item" href="#">${I.chart}<span class="side-rail-label">Reports</span></a>
    <a class="side-rail-item" href="#">${I.calendar}<span class="side-rail-label">Schedule</span></a>
    <a class="side-rail-item" href="#">${I.users}<span class="side-rail-label">Customers</span></a>
    <div class="side-rail-spacer"></div>
    <div class="side-rail-sep"></div>
    <a class="side-rail-item" href="#">${I.settings}<span class="side-rail-label">Settings</span></a>
  </nav>
  <main class="demo-rail-main"><h4>Good morning, Dana</h4><p>Hover the rail to expand it. It floats over this content instead of pushing it.</p><div class="demo-rail-grid"><div></div><div></div><div></div><div></div></div></main>
</div>`,
        css: `.demo-rail { display: flex; height: 440px; background: var(--bg); }
.demo-rail-main { flex: 1; min-width: 0; padding: 1.5rem; } .demo-rail-main h4 { font-size: 1.15rem; font-weight: 700; letter-spacing: -.02em; } .demo-rail-main p { color: var(--muted-fg); font-size: .875rem; margin: .25rem 0 1rem; }
.demo-rail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr)); gap: .75rem; } .demo-rail-grid div { height: 6rem; border-radius: var(--radius-lg); background: var(--muted); }`
      }
    ],
    api: [
      { name: '.side-rail', type: 'class', desc: 'Rail. Children: <code>.side-rail-brand</code>, <code>.side-rail-item</code> (svg + <code>.side-rail-label</code> + optional <code>.side-rail-badge</code>), <code>.side-rail-spacer</code>, <code>.side-rail-sep</code>.' },
      { name: 'data-expanded / data-pinned', type: 'attr', desc: 'Keep expanded; pinned also pushes content instead of overlaying it.' },
      { name: '--rail-w / --rail-open', type: 'var', default: '4.25rem / 14rem', desc: 'Collapsed and expanded widths.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ item, index, value }</code>.' }
    ]
  });
})();
