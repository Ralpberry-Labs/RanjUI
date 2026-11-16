(function () {
  var I = window.__ovI;
  function card(icon, t, d) { return '<a class="nav-menu-card" href="#"><span class="nav-menu-card-icon">' + I[icon] + '</span><span><b>' + t + '</b><span>' + d + '</span></span></a>'; }
  RanjDocs.add({
    id: 'navigation-menu',
    name: 'Navigation Menu',
    group: 'Navigation',
    description: 'A mega menu for site headers. One shared panel morphs its size as you move between items, content slides in from the direction you travelled, and a small arrow tracks the active trigger. Works with hover, click and keyboard.',
    tags: ['js', 'new'],
    keywords: ['mega menu', 'dropdown navigation', 'header menu', 'flyout'],
    demos: [
      {
        title: 'Mega menu',
        description: 'Hover across Products → Solutions → Resources and watch the panel morph.',
        height: 460, center: false,
        html: `
<nav class="nav-menu demo-navm" aria-label="Main">
  <ul class="nav-menu-list">
    <li class="nav-menu-item">
      <button class="nav-menu-trigger">Products</button>
      <div class="nav-menu-content">
        <div class="demo-navm-products">
          <a class="nav-menu-feature" href="#">${I.svg('sparkles', 22)}<b>Northwind AI</b><span>Draft, summarize and search across every doc in your workspace.</span></a>
          <div class="nav-menu-grid" style="--cols:1">
            ${card('layout', 'Docs', 'Collaborative pages with blocks and embeds.')}
            ${card('grid', 'Boards', 'Kanban, timelines and sprints.')}
            ${card('chart', 'Insights', 'Dashboards that update in realtime.')}
          </div>
        </div>
      </div>
    </li>
    <li class="nav-menu-item">
      <button class="nav-menu-trigger">Solutions</button>
      <div class="nav-menu-content">
        <div class="nav-menu-label">By team</div>
        <div class="nav-menu-grid">
          ${card('pencil', 'Design', 'Critique, specs and handoff.')}
          ${card('code', 'Engineering', 'Roadmaps linked to your PRs.')}
          ${card('rocket', 'Product', 'Discovery to launch in one place.')}
          ${card('target', 'Marketing', 'Campaign plans and briefs.')}
          ${card('users', 'HR', 'Onboarding that people finish.')}
          ${card('shield', 'Enterprise', 'SSO, audit logs, data residency.')}
        </div>
        <div class="nav-menu-footer"><span>New: Northwind for startups, free for a year.</span><a href="#">Apply ${I.svg('arrowRight', 12)}</a></div>
      </div>
    </li>
    <li class="nav-menu-item">
      <button class="nav-menu-trigger">Resources</button>
      <div class="nav-menu-content">
        <div class="nav-menu-grid" style="--cols:1; width: 17rem">
          ${card('book', 'Guides', 'Best practices from 4,000 teams.')}
          ${card('video', 'Webinars', 'Live sessions every Thursday.')}
          ${card('lifebuoy', 'Help center', 'Answers in under a minute.')}
        </div>
      </div>
    </li>
    <li class="nav-menu-item"><a class="nav-menu-link" href="#">Pricing</a></li>
    <li class="nav-menu-item"><a class="nav-menu-link" href="#">Changelog</a></li>
  </ul>
</nav>`,
        css: `.demo-navm { margin: 0 auto; width: max-content; max-width: 100%; }
.demo-navm .nav-menu-list { flex-wrap: wrap; justify-content: center; }
.demo-navm-products { display: grid; grid-template-columns: 13rem 17rem; gap: .5rem; }
.nav-menu-feature svg { margin-bottom: auto; }
.nav-menu-footer a { display: inline-flex; align-items: center; gap: .25rem; font-weight: 600; }
@media (max-width: 640px) { .demo-navm-products { grid-template-columns: minmax(0, 1fr); } .demo-navm-products .nav-menu-feature { min-height: 8rem; } }`
      }
    ],
    api: [
      { name: '.nav-menu > .nav-menu-list > .nav-menu-item', type: 'class', desc: 'Structure. An item holds a <code>.nav-menu-trigger</code> + <code>.nav-menu-content</code>, or a plain <code>.nav-menu-link</code>.' },
      { name: '.nav-menu-content', type: 'class', desc: 'Panel content, moved into a shared <code>.nav-menu-viewport</code> that animates width/height.' },
      { name: '.nav-menu-grid / -card / -feature / -label / -footer', type: 'class', desc: 'Content helpers. <code>--cols</code> sets grid columns.' },
      { name: 'data-delay / data-close-delay', type: 'attr', default: '120 / 260', desc: 'Hover intent timings (ms).' },
      { name: 'data-align="center"', type: 'attr', desc: 'Center the panel under the list instead of under the trigger.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ value, open }</code> on <code>.nav-menu</code>.' }
    ]
  });
})();
