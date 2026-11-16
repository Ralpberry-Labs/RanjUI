(function () {
  var I = RB.ic;
  var tiles = ['xs', 'sm', '', 'md', 'lg', 'xl', 'glow'].map(function (s) {
    var t = s ? '--shadow-' + s : '--shadow';
    return '<div class="demo-shadows-tile" style="box-shadow:var(' + t + ')"><b>' + (s || 'default') + '</b><code>' + t + '</code></div>';
  }).join('\n  ');
  RanjDocs.add({
    id: 'shadows',
    name: 'Shadows & elevation',
    group: 'Foundations',
    description: 'Seven layered shadows tuned separately for light and dark themes, plus a brand glow. Higher layers sit closer to the viewer.',
    tags: ['new'],
    keywords: ['elevation', 'box-shadow', 'depth', 'glow', 'z-index'],
    demos: [
      {
        title: 'Shadow scale',
        center: false,
        bg: 'none',
        html: '<div class="demo-shadows-grid">\n  ' + tiles + '\n</div>',
        css: `.demo-shadows-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.5rem; padding: .5rem; }
.demo-shadows-tile { display: flex; flex-direction: column; justify-content: flex-end; gap: .2rem; height: 7.5rem; padding: .9rem; border-radius: var(--radius-lg); background: var(--card); border: 1px solid color-mix(in oklab, var(--border) 50%, transparent); }
.demo-shadows-tile b { font-size: .9rem; } .demo-shadows-tile code { font-size: .7rem; background: none; padding: 0; color: var(--muted-fg); }`
      },
      {
        title: 'Elevation in context',
        center: false,
        description: 'Page (0) → card (xs) → raised card (md) → popover (lg) → modal (xl). Pair each level with its <code>--z-*</code> layer.',
        height: 340,
        html: `<div class="demo-shadows-stage">
  <div class="card" style="width:min(100%,22rem)">
    <div class="card-header"><div class="card-title">Team activity</div><div class="card-description">Last 24 hours</div></div>
    <div class="card-content stack gap-3">
      <div class="avatar-label"><span class="avatar avatar-sm avatar-tint" style="--avatar-hue:20">MR</span><div><b>Maya Rossi merged #482</b><span>Fix billing rounding</span></div></div>
      <div class="avatar-label"><span class="avatar avatar-sm avatar-tint" style="--avatar-hue:160">JK</span><div><b>Jun Kim deployed to prod</b><span>v2.14.0 · 3m ago</span></div></div>
    </div>
  </div>
  <div class="demo-shadows-pop">
    <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;width:100%">${I('edit')} Edit</button>
    <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;width:100%">${I('copy')} Duplicate</button>
    <hr class="separator separator-flush" style="margin:.25rem 0">
    <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;width:100%;color:var(--destructive)">${I('trash')} Delete</button>
  </div>
</div>`,
        css: `.demo-shadows-stage { position: relative; display: flex; justify-content: center; width: 100%; padding-right: 4rem; }
.demo-shadows-pop { position: absolute; right: max(0px, calc(50% - 15rem)); top: 55%; width: 11rem; padding: .3rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--popover); box-shadow: var(--shadow-lg); }
@media (max-width: 600px) { .demo-shadows-stage { padding-right: 0; } .demo-shadows-pop { right: 0; top: 70%; } }`
      }
    ],
    api: [
      { name: '--shadow-xs … --shadow-xl', type: 'var', desc: 'Elevation scale (redefined in dark mode with deeper, darker shadows).' },
      { name: '--shadow-glow', type: 'var', desc: 'Brand-colored ring + glow, follows <code>--hue</code>.' },
      { name: '.shadow-xs … .shadow-xl', type: 'class', desc: 'Utility classes. Also: <code>.shadow-glow</code>' },
      { name: '--z-dropdown … --z-tooltip', type: 'var', desc: 'Layer order: dropdown 50, sticky 60, overlay 80, modal 90, popover 100, toast 110, tooltip 120.' }
    ]
  });
})();
