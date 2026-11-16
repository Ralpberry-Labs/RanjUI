(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'tour',
    name: 'Product Tour',
    group: 'Overlays',
    description: 'A guided walkthrough: a spotlight cutout glides from one element to the next while a step card explains it, with progress dots, back/next and keyboard arrows. Start it from JavaScript or declare steps in your markup.',
    tags: ['js', 'new'],
    keywords: ['walkthrough', 'onboarding', 'coachmark', 'spotlight', 'guide', 'intro', 'shepherd'],
    demos: [
      {
        title: 'Onboarding walkthrough',
        height: 340,
        html: `
<div class="demo-tour-app">
  <div class="demo-tour-top">
    <b class="demo-tour-logo">${I.layers} Northwind</b>
    <div class="demo-tour-search" id="tour-search">${I.search} Search… <kbd>⌘K</kbd></div>
    <button class="btn btn-sm" id="tour-new">${I.plus} New project</button>
    <span class="demo-ov-avatar" id="tour-avatar" style="--h:20;width:30px;height:30px;font-size:11px">MO</span>
  </div>
  <div class="demo-tour-main">
    <div class="demo-tour-stats" id="tour-stats">
      <div><small>Revenue</small><b>$48.2k</b><em>+12.4%</em></div>
      <div><small>Active users</small><b>2,931</b><em>+4.1%</em></div>
      <div><small>Churn</small><b>1.8%</b><em class="down">−0.3%</em></div>
    </div>
    <button class="btn" id="tour-start">${I.compass} Take the tour</button>
  </div>
</div>`,
        js: `root.querySelector('#tour-start').onclick = function () {
  Ranj.tour([
    { title: 'Welcome to Northwind', body: 'A 30-second tour of the essentials. Use ← → or the buttons.', media: '${I.svg('sparkles', 34).replace(/'/g, "\\'")}' },
    { target: root.querySelector('#tour-search'), title: 'Search everything', body: 'Jump to any project, doc or person. Press <b>⌘K</b> from anywhere.', placement: 'bottom' },
    { target: root.querySelector('#tour-new'), title: 'Start a project', body: 'Templates for roadmaps, sprints and OKRs are one click away.', placement: 'bottom' },
    { target: root.querySelector('#tour-stats'), title: 'Your numbers, live', body: 'These update in realtime as data flows in from Stripe and Segment.', placement: 'top' },
    { target: root.querySelector('#tour-avatar'), title: 'Make it yours', body: 'Set your theme, notifications and integrations in your profile.', placement: 'bottom-end' }
  ], { onEnd: function (done) { if (done && Ranj.toast) Ranj.toast.success('Tour complete', { description: 'You can restart it any time.' }); } });
};`,
        css: `.demo-tour-app { width: min(40rem, calc(100vw - 4rem)); border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); overflow: hidden; }
.demo-tour-top { display: flex; align-items: center; gap: .75rem; padding: .7rem .9rem; border-bottom: 1px solid var(--border); }
.demo-tour-logo { display: flex; align-items: center; gap: .4rem; font-size: .875rem; white-space: nowrap; } .demo-tour-logo svg { width: 1.1rem; height: 1.1rem; color: var(--primary); }
.demo-tour-search { flex: 1; display: flex; align-items: center; gap: .45rem; height: 2rem; padding: 0 .65rem; border: 1px solid var(--border); border-radius: var(--radius); font-size: .8125rem; color: var(--muted-fg); min-width: 0; }
.demo-tour-search svg { width: .9rem; height: .9rem; } .demo-tour-search kbd { margin-left: auto; font-family: var(--font-sans); font-size: .65rem; }
.demo-tour-top .btn svg { width: .9rem; height: .9rem; }
.demo-tour-main { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; padding: 1.25rem; }
.demo-tour-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; width: 100%; }
.demo-tour-stats div { display: flex; flex-direction: column; padding: .75rem .9rem; border: 1px solid var(--border); border-radius: var(--radius-lg); }
.demo-tour-stats small { font-size: .72rem; color: var(--muted-fg); } .demo-tour-stats b { font-size: 1.25rem; letter-spacing: -.02em; }
.demo-tour-stats em { font-style: normal; font-size: .72rem; color: var(--success); } .demo-tour-stats em.down { color: var(--success); }
@media (max-width: 560px) { .demo-tour-search { display: none; } .demo-tour-stats { grid-template-columns: 1fr 1fr; } .demo-tour-stats div:last-child { display: none; } }`
      },
      {
        title: 'Declarative steps',
        description: 'Mark elements with <code>data-tour="name"</code>, <code>data-tour-step</code>, <code>data-tour-title</code> and <code>data-tour-body</code>, then add <code>data-tour-start="name"</code> to a button. No JavaScript needed.',
        html: `
<div class="demo-tour-row">
  <button class="btn btn-outline" data-tour="editor" data-tour-step="1" data-tour-title="Write" data-tour-body="Draft with markdown shortcuts. Type / for blocks.">${I.pencil} Write</button>
  <button class="btn btn-outline" data-tour="editor" data-tour-step="2" data-tour-title="Collaborate" data-tour-body="Mention a teammate with @ to pull them into a thread.">${I.users} Collaborate</button>
  <button class="btn btn-outline" data-tour="editor" data-tour-step="3" data-tour-title="Publish" data-tour-body="Share a link or publish to your docs site in one click." data-tour-placement="top">${I.send} Publish</button>
</div>
<button class="btn" data-tour-start="editor">${I.compass} Start tour</button>`,
        css: `.demo-tour-row { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; width: 100%; margin-bottom: .5rem; }`
      }
    ],
    api: [
      { name: 'Ranj.tour(steps, opts)', type: 'js', desc: 'Starts a tour and returns <code>{ next, prev, go(i), end(), index }</code>. Step: <code>{ target, title, body, placement, media, padding, radius, badge, onEnter }</code>; no target → centered card.' },
      { name: 'opts', type: 'js', desc: '<code>onEnd(completed)</code>, <code>onStep(i)</code>, <code>nextText</code>, <code>backText</code>, <code>doneText</code>, <code>skip</code> (true), <code>allowInteraction</code>, <code>startAt</code>, <code>padding</code>.' },
      { name: 'Ranj.tour("name")', type: 'js', desc: 'Builds steps from <code>[data-tour="name"]</code> elements ordered by <code>data-tour-step</code>.' },
      { name: 'data-tour-start="name"', type: 'attr', desc: 'Button that starts a declarative tour.' },
      { name: 'data-tour-title / -body / -placement', type: 'attr', desc: 'Step content on the target element.' },
      { name: '--tour-mask', type: 'var', desc: 'Color of the dimmed area around the spotlight.' },
      { name: 'ranj:tourstep / ranj:tourend', type: 'event', desc: 'On <code>document</code>: <code>{ index, step }</code> / <code>{ completed }</code>.' }
    ]
  });
})();
