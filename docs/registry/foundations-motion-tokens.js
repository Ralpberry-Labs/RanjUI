(function () {
  var I = RB.ic;
  var eases = [
    ['--ease', 'UI default: hovers, color, small moves'],
    ['--ease-out', 'Things entering: menus, toasts, reveals'],
    ['--ease-in-out', 'Moving between two on-screen states'],
    ['--ease-spring', 'Playful overshoot: toggles, pops'],
    ['--ease-bounce', 'Anticipation + overshoot, use rarely']
  ];
  var rows = eases.map(function (e) {
    return '<div class="demo-motion-row"><div class="demo-motion-meta"><code>' + e[0] + '</code><span>' + e[1] + '</span></div><div class="demo-motion-track"><i style="--e:var(' + e[0] + ')"></i></div></div>';
  }).join('\n  ');
  var durs = [['--dur-fast', '120ms'], ['--dur', '200ms'], ['--dur-slow', '350ms'], ['--dur-slower', '600ms']].map(function (d) {
    return '<div class="demo-motion-dur"><div class="demo-motion-track"><i style="--d:var(' + d[0] + ')"></i></div><code>' + d[0] + '</code><span>' + d[1] + '</span></div>';
  }).join('\n  ');
  RanjDocs.add({
    id: 'motion-tokens',
    name: 'Motion tokens',
    group: 'Foundations',
    description: 'Five easing curves and four durations used across every component. Hover or press Play to compare them side by side.',
    tags: ['new'],
    keywords: ['easing', 'duration', 'animation', 'transition', 'cubic-bezier', 'spring'],
    demos: [
      {
        title: 'Easing curves',
        center: false,
        html: '<div class="demo-motion" data-run="false">\n  <button class="btn btn-sm btn-outline demo-motion-play">' + I('play') + ' Play</button>\n  ' + rows + '\n</div>',
        css: `.demo-motion { display: grid; gap: .9rem; }
.demo-motion-play { justify-self: start; }
.demo-motion-row { display: grid; grid-template-columns: 15rem minmax(0, 1fr); gap: 1.25rem; align-items: center; }
.demo-motion-meta { display: flex; flex-direction: column; gap: .1rem; }
.demo-motion-meta code { font-size: .78rem; justify-self: start; width: fit-content; }
.demo-motion-meta span { font-size: .75rem; color: var(--muted-fg); }
.demo-motion-track { position: relative; height: 2.25rem; border-radius: var(--radius-full); background: var(--muted); }
.demo-motion-track i { position: absolute; left: .25rem; top: .25rem; width: 1.75rem; height: 1.75rem; border-radius: 50%; background: var(--primary); box-shadow: 0 4px 12px -2px color-mix(in oklab, var(--primary) 60%, transparent); transition: left 1s var(--e, var(--ease)); }
.demo-motion[data-run="true"] .demo-motion-track i { left: calc(100% - 2rem); }
@media (max-width: 640px) { .demo-motion-row { grid-template-columns: 1fr; gap: .4rem; } }`,
        js: "var m = root.querySelector('.demo-motion');\nvar go = function () { m.dataset.run = m.dataset.run === 'true' ? 'false' : 'true'; };\nroot.querySelector('.demo-motion-play').addEventListener('click', go);\nvar t = setTimeout(go, 400), iv = setInterval(go, 2200);\nreturn function () { clearTimeout(t); clearInterval(iv); };"
      },
      {
        title: 'Durations',
        center: false,
        html: '<div class="demo-motion demo-motion-d" data-run="false">\n  ' + durs + '\n</div>',
        css: `.demo-motion-dur { display: grid; grid-template-columns: minmax(0, 1fr) 8rem 3.5rem; gap: 1rem; align-items: center; font-size: .8rem; }
.demo-motion-dur span { color: var(--muted-fg); text-align: right; font-variant-numeric: tabular-nums; }
.demo-motion-d .demo-motion-track i { transition: left var(--d) var(--ease-out); }`,
        js: "var m = root.querySelector('.demo-motion-d');\nvar iv = setInterval(function () { m.dataset.run = m.dataset.run === 'true' ? 'false' : 'true'; }, 1100);\nreturn function () { clearInterval(iv); };"
      },
      {
        title: 'In practice',
        description: 'Hover the cards: lift uses <code>--ease-out</code>, the icon pops with <code>--ease-spring</code>.',
        html: `<div class="feature feature-card" style="width:15rem"><span class="icon-box">${I('zap')}</span><div class="feature-title">Instant previews</div><p class="feature-text">Every push gets a URL in under 10 seconds.</p></div>
<div class="feature feature-card" style="width:15rem"><span class="icon-box icon-box-success">${I('shield')}</span><div class="feature-title">Secure by default</div><p class="feature-text">SSO, audit logs and SOC 2 on every plan.</p></div>`
      }
    ],
    api: [
      { name: '--ease', type: 'var', default: 'cubic-bezier(.2, 0, 0, 1)', desc: 'Default UI curve.' },
      { name: '--ease-out', type: 'var', default: 'cubic-bezier(.16, 1, .3, 1)', desc: 'Entering elements.' },
      { name: '--ease-in-out', type: 'var', default: 'cubic-bezier(.65, 0, .35, 1)', desc: 'State to state.' },
      { name: '--ease-spring', type: 'var', default: 'cubic-bezier(.34, 1.56, .64, 1)', desc: 'Overshoot.' },
      { name: '--ease-bounce', type: 'var', default: 'cubic-bezier(.68, -.6, .32, 1.6)', desc: 'Anticipation and overshoot.' },
      { name: '--dur-fast', type: 'var', desc: '120 / 200 / 350 / 600 ms. Also: <code>--dur</code> <code>--dur-slow</code> <code>--dur-slower</code>' },
      { name: '--transition', type: 'var', desc: 'Shorthand: <code>var(--dur) var(--ease)</code>.' },
      { name: 'prefers-reduced-motion', type: 'attr', desc: 'All CSS animation collapses to one frame when the user asks for less motion.' }
    ]
  });
})();
