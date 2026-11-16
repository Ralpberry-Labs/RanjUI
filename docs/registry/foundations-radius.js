(function () {
  var tiles = ['xs', 'sm', '', 'lg', 'xl', '2xl', 'full'].map(function (s) {
    var t = s ? '--radius-' + s : '--radius';
    return '<div class="demo-radius-tile"><div style="border-radius:var(' + t + ')"></div><b>' + (s || 'base') + '</b><code>' + t + '</code></div>';
  }).join('\n  ');
  RanjDocs.add({
    id: 'radius',
    name: 'Radius',
    group: 'Foundations',
    description: 'One <code>--radius</code> value drives the whole corner scale, so a single change makes the library sharper or softer.',
    tags: ['new'],
    keywords: ['border-radius', 'corners', 'rounded', 'shape'],
    demos: [
      {
        title: 'Radius scale',
        center: false,
        html: '<div class="demo-radius-grid">\n  ' + tiles + '\n</div>',
        css: `.demo-radius-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1.25rem; }
.demo-radius-tile { display: flex; flex-direction: column; gap: .2rem; }
.demo-radius-tile div { height: 5rem; margin-bottom: .5rem; background: var(--primary-soft); border: 2px solid color-mix(in oklab, var(--primary) 55%, transparent); }
.demo-radius-tile b { font-size: .85rem; } .demo-radius-tile code { font-size: .7rem; background: none; padding: 0; color: var(--muted-fg); }`
      },
      {
        title: 'Radius presets',
        center: false,
        description: 'Set <code>data-radius</code> on <code>&lt;html&gt;</code> (or override <code>--radius</code> on any section) to reshape every component.',
        html: `<div class="demo-radius-presets">
  <div class="btn-group btn-group-pill" data-toggle="single" aria-label="Radius">
    <button class="btn btn-sm" data-value="0rem">None</button><button class="btn btn-sm" data-value=".35rem">Small</button><button class="btn btn-sm" data-value=".625rem" aria-pressed="true">Medium</button><button class="btn btn-sm" data-value=".9rem">Large</button><button class="btn btn-sm" data-value="1.25rem">Full</button>
  </div>
  <div class="demo-radius-preview">
    <div class="card card-sm" style="width:min(100%,20rem)">
      <div class="card-header"><div class="card-title">Invite teammates</div><div class="card-description">They will get an email with a magic link.</div></div>
      <div class="card-content cluster"><span class="chip">design@acme.co</span><span class="badge badge-soft">Editor</span></div>
      <div class="card-footer"><button class="btn btn-outline btn-sm">Cancel</button><button class="btn btn-sm">Send invites</button></div>
    </div>
  </div>
</div>`,
        css: `.demo-radius-presets { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; width: 100%; }
.demo-radius-preview { --radius-xs: calc(var(--radius) * .4); --radius-sm: calc(var(--radius) * .7); --radius-lg: calc(var(--radius) * 1.3); --radius-xl: calc(var(--radius) * 1.8); display: flex; justify-content: center; width: 100%; }`,
        js: "var p = root.querySelector('.demo-radius-preview');\nroot.querySelector('.btn-group').addEventListener('ranj:change', function (e) { p.style.setProperty('--radius', e.detail.value[0]); });",
        height: 320
      }
    ],
    api: [
      { name: '--radius', type: 'var', default: '0.625rem', desc: 'Base radius. Everything else is derived from it.' },
      { name: '--radius-xs', type: 'var', desc: '0.4×, 0.7×, 1.3×, 1.8×, 2.6× the base. Also: <code>--radius-sm</code> <code>--radius-lg</code> <code>--radius-xl</code> <code>--radius-2xl</code>' },
      { name: '--radius-full', type: 'var', default: '9999px', desc: 'Pills and circles.' },
      { name: 'data-radius', type: 'attr', desc: 'none · sm · md · lg · full on <code>&lt;html&gt;</code>.' },
      { name: '.rounded-* ', type: 'class', desc: 'Utility classes: none, xs, sm, (base), lg, xl, 2xl, full.' }
    ]
  });
})();
