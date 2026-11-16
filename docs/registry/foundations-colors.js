(function () {
  var groups = [
    ['Surfaces', ['bg', 'bg-subtle', 'card', 'popover', 'muted', 'secondary', 'secondary-hover']],
    ['Text', ['fg', 'muted-fg', 'card-fg', 'secondary-fg', 'popover-fg']],
    ['Brand', ['primary', 'primary-hover', 'primary-fg', 'primary-soft', 'primary-soft-fg', 'ring']],
    ['Lines', ['border', 'border-strong', 'input']],
    ['Destructive', ['destructive', 'destructive-hover', 'destructive-soft', 'destructive-soft-fg']],
    ['Success', ['success', 'success-fg', 'success-soft', 'success-soft-fg']],
    ['Warning', ['warning', 'warning-fg', 'warning-soft', 'warning-soft-fg']],
    ['Info', ['info', 'info-fg', 'info-soft', 'info-soft-fg']]
  ];
  var sw = groups.map(function (g) {
    return '<div class="demo-colors-group"><div class="demo-colors-label">' + g[0] + '</div><div class="demo-colors-row">' +
      g[1].map(function (t) {
        return '<button type="button" class="demo-colors-sw" data-token="--' + t + '" title="Copy var(--' + t + ')"><span class="demo-colors-chip" style="background:var(--' + t + ')"></span><b>--' + t + '</b><code data-val></code></button>';
      }).join('') + '</div></div>';
  }).join('\n');

  var scale = [97, 93, 86, 77, 67, 58, 50, 42, 34, 26, 19].map(function (l, i) {
    var name = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950][i];
    var c = (l > 90 ? .04 : l > 80 ? .09 : l > 60 ? .17 : l > 40 ? .21 : .14);
    return '<div class="demo-colors-step" style="background:oklch(' + (l / 100) + ' ' + c + ' var(--hue));color:' + (l > 62 ? '#18181b' : '#fff') + '"><b>' + name + '</b></div>';
  }).join('');

  RanjDocs.add({
    id: 'colors',
    name: 'Colors',
    group: 'Foundations',
    description: 'Every semantic color token, rendered live from the current theme. Toggle light/dark or pick an accent in the customizer and the swatches update. Click a swatch to copy its <code>var()</code>.',
    tags: ['new'],
    keywords: ['palette', 'tokens', 'theme', 'swatch', 'oklch', 'design tokens'],
    demos: [
      {
        title: 'Semantic tokens',
        description: 'Components only read these names, so re-theming is a matter of overriding a few variables.',
        center: false,
        html: '<div class="demo-colors">\n' + sw + '\n</div>',
        css: [
          '.demo-colors { display: grid; gap: 1.5rem; }',
          '.demo-colors-label { font-size: .72rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted-fg); margin-bottom: .6rem; }',
          '.demo-colors-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: .6rem; }',
          '.demo-colors-sw { display: grid; grid-template-columns: 2.25rem 1fr; grid-template-rows: auto auto; column-gap: .65rem; align-items: center; padding: .5rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); text-align: left; transition: border-color var(--transition), transform var(--transition); min-width: 0; }',
          '.demo-colors-sw:hover { border-color: var(--border-strong); transform: translateY(-1px); }',
          '.demo-colors-chip { grid-row: span 2; width: 2.25rem; height: 2.25rem; border-radius: var(--radius); box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--fg) 12%, transparent); }',
          '.demo-colors-sw b { font-family: var(--font-mono); font-size: .72rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
          '.demo-colors-sw code { background: none; padding: 0; font-size: .68rem; color: var(--muted-fg); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
          '.demo-colors-sw[data-copied] code { color: var(--success-soft-fg); }'
        ].join('\n'),
        js: [
          "var cv = document.createElement('canvas'); cv.width = cv.height = 1; var cx = cv.getContext('2d', { willReadFrequently: true });",
          "function hex(v) {",
          "  cx.clearRect(0, 0, 1, 1); cx.fillStyle = v; cx.fillRect(0, 0, 1, 1);",
          "  var d = cx.getImageData(0, 0, 1, 1).data, h = '#' + [d[0], d[1], d[2]].map(function (n) { return n.toString(16).padStart(2, '0'); }).join('');",
          "  return d[3] < 255 ? h + ' · ' + Math.round(d[3] / 2.55) + '%' : h;",
          "}",
          "function paint() {",
          "  root.querySelectorAll('[data-token]').forEach(function (b) {",
          "    var probe = b.querySelector('.demo-colors-chip');",
          "    b.querySelector('[data-val]').textContent = hex(getComputedStyle(probe).backgroundColor);",
          "  });",
          "}",
          "paint();",
          "var t = setTimeout(paint, 60);",
          "var onTheme = function () { setTimeout(paint, 30); };",
          "document.addEventListener('ranj:theme', onTheme);",
          "var mo = new MutationObserver(onTheme); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-accent', 'data-theme', 'style'] });",
          "root.addEventListener('click', function (e) {",
          "  var b = e.target.closest('[data-token]'); if (!b) return;",
          "  (Ranj.copy || function (x) { return navigator.clipboard.writeText(x); })('var(' + b.dataset.token + ')');",
          "  var v = b.querySelector('[data-val]'), old = v.textContent; b.setAttribute('data-copied', ''); v.textContent = 'Copied';",
          "  setTimeout(function () { b.removeAttribute('data-copied'); v.textContent = old; }, 1100);",
          "});",
          "return function () { clearTimeout(t); document.removeEventListener('ranj:theme', onTheme); mo.disconnect(); };"
        ].join('\n')
      },
      {
        title: 'Brand scale from one hue',
        description: 'The brand is driven by <code>--hue</code>. Use <code>oklch(L C var(--hue))</code> for tinted extras; drag to re-hue this panel only.',
        center: false,
        html: '<div class="demo-colors-hue">\n  <div class="demo-colors-scale">' + scale + '</div>\n  <label class="demo-colors-slider"><span>--hue</span><input type="range" min="0" max="360" value="252" aria-label="Hue"><output>252</output></label>\n  <div class="cluster">\n    <button class="btn">Primary</button><button class="btn btn-soft">Soft</button><button class="btn btn-outline">Outline</button>\n    <span class="badge badge-soft badge-dot">Active</span><span class="badge">New</span>\n  </div>\n</div>',
        css: [
          '.demo-colors-hue { display: grid; gap: 1.25rem; --primary: oklch(0.55 0.22 var(--hue)); --primary-hover: oklch(0.49 0.22 var(--hue)); --primary-soft: oklch(0.96 0.03 var(--hue)); --primary-soft-fg: oklch(0.45 0.2 var(--hue)); --ring: color-mix(in oklab, var(--primary) 55%, transparent); }',
          '[data-theme="dark"] .demo-colors-hue { --primary: oklch(0.66 0.2 var(--hue)); --primary-hover: oklch(0.72 0.18 var(--hue)); --primary-soft: oklch(0.27 0.07 var(--hue)); --primary-soft-fg: oklch(0.82 0.12 var(--hue)); }',
          '.demo-colors-scale { display: grid; grid-template-columns: repeat(11, 1fr); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); }',
          '.demo-colors-step { height: 4.5rem; display: flex; align-items: flex-end; padding: .4rem; font-size: .68rem; }',
          '@media (max-width: 600px) { .demo-colors-scale { grid-template-columns: repeat(6, 1fr); } .demo-colors-step { height: 3rem; } }',
          '.demo-colors-slider { display: flex; align-items: center; gap: .75rem; font-family: var(--font-mono); font-size: .8rem; color: var(--muted-fg); }',
          '.demo-colors-slider input { flex: 1; accent-color: var(--primary); }',
          '.demo-colors-slider output { width: 2.5rem; text-align: right; color: var(--fg); font-variant-numeric: tabular-nums; }'
        ].join('\n'),
        js: "var box = root.querySelector('.demo-colors-hue'), r = box.querySelector('input'), o = box.querySelector('output');\nr.addEventListener('input', function () { box.style.setProperty('--hue', r.value); o.textContent = r.value; });"
      },
      {
        title: 'Status pairs',
        center: false,
        description: 'Each status ships a solid color plus a <code>-soft</code> background and readable <code>-soft-fg</code> text, tuned per theme.',
        html: [
          '<div class="demo-colors-status">',
          '  <div style="background:var(--success-soft);color:var(--success-soft-fg)">' + RB.ic('checkCircle') + '<div><b>Payment received</b><span>$1,240.00 from Northwind Traders</span></div></div>',
          '  <div style="background:var(--warning-soft);color:var(--warning-soft-fg)">' + RB.ic('alert') + '<div><b>Usage at 86%</b><span>You will hit the API cap in 4 days</span></div></div>',
          '  <div style="background:var(--destructive-soft);color:var(--destructive-soft-fg)">' + RB.ic('alertCircle') + '<div><b>Deploy failed</b><span>Build exited with code 1 on main</span></div></div>',
          '  <div style="background:var(--info-soft);color:var(--info-soft-fg)">' + RB.ic('info') + '<div><b>Maintenance window</b><span>Sunday 02:00–03:00 UTC</span></div></div>',
          '</div>'
        ].join('\n'),
        css: '.demo-colors-status { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: .75rem; width: 100%; }\n.demo-colors-status > div { display: flex; gap: .75rem; padding: .9rem 1rem; border-radius: var(--radius-lg); font-size: .85rem; }\n.demo-colors-status svg { width: 1.1rem; height: 1.1rem; flex-shrink: 0; margin-top: .1rem; }\n.demo-colors-status b { display: block; font-weight: 600; }\n.demo-colors-status span { opacity: .85; }'
      }
    ],
    api: [
      { name: '--hue', type: 'var', default: '252', desc: 'OKLCH hue that drives every brand color.' },
      { name: '--primary / --primary-fg', type: 'var', desc: 'Brand fill and the text that sits on it.' },
      { name: '--primary-soft', type: 'var', desc: 'Tinted background and its readable text. Also: <code>--primary-soft-fg</code>' },
      { name: '--bg', type: 'var', desc: 'Page and raised surfaces. Also: <code>--bg-subtle</code> <code>--card</code> <code>--popover</code>' },
      { name: '--muted / --muted-fg', type: 'var', desc: 'Quiet fills and secondary text.' },
      { name: '--border', type: 'var', desc: 'Hairlines, control borders and the focus ring. Also: <code>--border-strong</code> <code>--input</code> <code>--ring</code>' },
      { name: '--{tone}-soft / -soft-fg', type: 'var', desc: 'Status colors with soft variants.' },
      { name: 'data-accent', type: 'attr', desc: 'Preset hues on <code>&lt;html&gt;</code>: blue, indigo, violet, purple, pink, rose, orange, amber, lime, green, teal, cyan, mono.' }
    ]
  });
})();
