/* Ranj UI docs app — hash router, live previews, code view, search, customizer. */
(function () {
  'use strict';
  var D = window.RanjDocs, R = window.Ranj;
  var main = document.getElementById('dx-main');
  var nav = document.getElementById('dx-nav');
  var toc = document.getElementById('dx-toc');
  var REPO = 'https://github.com/Ralpberry-Labs/RanjUI';
  var CDN = 'https://cdn.jsdelivr.net/gh/Ralpberry-Labs/RanjUI@master/dist';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Tiny syntax highlighter (html / css / js / bash) ---------- */
  function hl(code, lang) {
    var s = esc(code);
    if (lang === 'html') {
      s = s.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '\u0001c$1\u0002')
        .replace(/(&lt;\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?&gt;)/g, function (m, a, tag, rest, b) {
          rest = rest.replace(/([\w:@.-]+)(=)(&quot;[\s\S]*?&quot;|'[^']*')/g, '\u0001a$1\u0002$2\u0001s$3\u0002')
            .replace(/(\s)([\w:@.-]+)(?=\s|$)/g, '$1\u0001a$2\u0002');
          return '\u0001p' + a + '\u0002\u0001t' + tag + '\u0002' + rest + '\u0001p' + b + '\u0002';
        });
    } else if (lang === 'css') {
      s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '\u0001c$1\u0002')
        .replace(/([\w-]+)(\s*:)(?=[^;{}]*[;}])/g, '\u0001a$1\u0002$2')
        .replace(/(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|ms|s|deg|vh|vw)?\b)/g, '\u0001n$1\u0002')
        .replace(/(var\()(--[\w-]+)/g, '$1\u0001s$2\u0002');
    } else if (lang === 'js' || lang === 'bash') {
      s = s.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|^#[^\n]*)/gm, '\u0001c$1\u0002')
        .replace(/(&quot;[^&\n]*?&quot;|'[^'\n]*'|`[^`]*`)/g, '\u0001s$1\u0002')
        .replace(/\b(var|let|const|function|return|if|else|for|new|this|true|false|null|await|async|import|from|export|npm|npx)\b/g, '\u0001k$1\u0002')
        .replace(/\b(\d+(?:\.\d+)?)\b/g, '\u0001n$1\u0002');
    }
    // \u0001X ... \u0002 → span. Nested markers are flattened (inner wins visually).
    return s.replace(/\u0001([a-z])/g, '<span class="hl-$1">').replace(/\u0002/g, '</span>');
  }

  /* Pretty-print demo HTML: trim common indent. */
  function dedent(str) {
    var lines = String(str || '').replace(/^\n+|\s+$/g, '').split('\n');
    var min = Infinity;
    lines.forEach(function (l) { if (l.trim()) min = Math.min(min, l.match(/^\s*/)[0].length); });
    return lines.map(function (l) { return l.slice(min === Infinity ? 0 : min); }).join('\n');
  }

  function copy(text, btn) {
    var done = function () {
      if (!btn) return;
      btn.classList.add('copied'); var old = btn.getAttribute('data-label') || btn.textContent;
      btn.setAttribute('data-label', old); btn.textContent = 'Copied';
      setTimeout(function () { btn.classList.remove('copied'); btn.textContent = old; }, 1400);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done);
    else { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); done(); }
  }

  function codeBlock(code, lang, label) {
    return '<div class="dx-code"><div class="dx-code-head"><span>' + (label || lang) + '</span><button class="dx-copy" data-copy>Copy</button></div>' +
      '<pre><code data-raw="' + esc(code) + '">' + hl(code, lang) + '</code></pre></div>';
  }

  /* ---------- Grouping ---------- */
  function groups() {
    var map = {};
    D.items.forEach(function (it) { (map[it.group] = map[it.group] || []).push(it); });
    var names = Object.keys(map).sort(function (a, b) {
      var ia = D.groupOrder.indexOf(a), ib = D.groupOrder.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
    });
    return names.map(function (n) { return { name: n, items: map[n].sort(function (a, b) { return a.name.localeCompare(b.name); }) }; });
  }

  var GUIDES = [
    { id: '', name: 'Introduction' },
    { id: 'install', name: 'Installation' },
    { id: 'theming', name: 'Theming' },
    { id: 'motion', name: 'Motion & a11y' },
    { id: 'js', name: 'JavaScript API' },
    { id: 'changelog', name: 'Changelog' }
  ];

  function renderNav(filter) {
    filter = (filter || '').toLowerCase().trim();
    var html = '';
    if (!filter) {
      html += '<div class="dx-nav-group"><div class="dx-nav-label">Getting started</div>';
      GUIDES.forEach(function (g) { html += '<a href="#/' + g.id + '" data-route="/' + g.id + '">' + g.name + '</a>'; });
      html += '</div>';
    }
    groups().forEach(function (g) {
      var its = g.items.filter(function (i) { return !filter || (i.name + ' ' + (i.keywords || []).join(' ') + ' ' + g.name).toLowerCase().indexOf(filter) > -1; });
      if (!its.length) return;
      html += '<div class="dx-nav-group"><a class="dx-nav-label" href="#/g/' + encodeURIComponent(g.name) + '">' + g.name + '<span>' + its.length + '</span></a>';
      its.forEach(function (i) {
        var tag = (i.tags || []).indexOf('new') > -1 ? '<em>New</em>' : '';
        html += '<a href="#/c/' + i.id + '" data-route="/c/' + i.id + '">' + esc(i.name) + tag + '</a>';
      });
      html += '</div>';
    });
    nav.innerHTML = html || '<p class="dx-empty">No matches</p>';
    markActive();
  }

  function markActive() {
    var r = location.hash.replace(/^#/, '') || '/';
    R.$$('a[data-route]', nav).forEach(function (a) {
      var on = a.getAttribute('data-route') === r;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------- Demo rendering ---------- */
  var demoStyles = document.createElement('style');
  demoStyles.id = 'dx-demo-styles';
  document.head.appendChild(demoStyles);

  function demoHTML(it, d, idx) {
    var id = it.id + '-' + idx;
    var code = dedent(d.html);
    var tabs = '<button class="active" data-tab="preview">Preview</button><button data-tab="html">HTML</button>' +
      (d.css ? '<button data-tab="css">CSS</button>' : '') + (d.js ? '<button data-tab="js">JS</button>' : '');
    var cls = 'dx-preview' + (d.center === false ? '' : ' dx-center') + (d.pad === false ? ' nopad' : '') + (d.bg ? ' bg-' + d.bg : ' bg-dots');
    var style = d.height ? ' style="min-height:' + (typeof d.height === 'number' ? d.height + 'px' : d.height) + '"' : '';
    return '<section class="dx-demo" id="' + id + '">' +
      (d.title ? '<h3 class="dx-demo-title"><a href="#/c/' + it.id + '?d=' + idx + '">' + esc(d.title) + '</a></h3>' : '') +
      (d.description ? '<p class="dx-demo-desc">' + d.description + '</p>' : '') +
      '<div class="dx-frame"><div class="dx-frame-bar"><div class="dx-tabs" role="tablist">' + tabs + '</div><div class="dx-frame-actions">' +
      '<button class="dx-mini" data-replay title="Replay">↻ Replay</button>' +
      '<button class="dx-mini" data-full title="Fullscreen">⤢</button>' +
      '<button class="dx-mini" data-copy-demo>Copy</button></div></div>' +
      '<div class="dx-pane" data-pane="preview"><div class="' + cls + '"' + style + ' data-demo="' + idx + '"></div></div>' +
      '<div class="dx-pane" data-pane="html" hidden>' + codeBlock(code, 'html', 'index.html') + '</div>' +
      (d.css ? '<div class="dx-pane" data-pane="css" hidden>' + codeBlock(dedent(d.css), 'css', 'styles.css') + '</div>' : '') +
      (d.js ? '<div class="dx-pane" data-pane="js" hidden>' + codeBlock(dedent(d.js), 'js', 'script.js') + '</div>' : '') +
      '</div></section>';
  }

  var cleanup = [];
  function mountDemo(host, d) {
    // Tear down whatever was there (components clean themselves via MutationObserver)
    host.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'dx-demo-root';
    wrap.innerHTML = dedent(d.html);
    host.appendChild(wrap);
    R.init(wrap);
    if (d.js) {
      try {
        var r = new Function('root', 'Ranj', dedent(d.js))(wrap, R);
        if (typeof r === 'function') cleanup.push(r);
      } catch (e) { console.error('[docs] demo js failed', e); }
    }
  }

  function renderComponent(it, focusDemo) {
    var css = '';
    it.demos.forEach(function (d) { if (d.css) css += '\n' + d.css; });
    demoStyles.textContent = css;
    var g = it.group;
    var siblings = (groups().filter(function (x) { return x.name === g; })[0] || { items: [] }).items;
    var all = [].concat.apply([], groups().map(function (x) { return x.items; }));
    var i = all.indexOf(it), prev = all[i - 1], next = all[i + 1];
    var tags = (it.tags || []).filter(function (t) { return t !== 'js'; }).map(function (t) { return '<span class="dx-tag dx-tag-' + t + '">' + t + '</span>'; }).join('');
    var html = '<article class="dx-article">' +
      '<div class="dx-crumbs"><a href="#/">Docs</a><span>/</span><a href="#/g/' + encodeURIComponent(g) + '">' + g + '</a><span>/</span>' + esc(it.name) + '</div>' +
      '<h1 class="dx-h1">' + esc(it.name) + tags + '</h1>' +
      '<p class="dx-lead">' + (it.description || '') + '</p>' +
      '<div class="dx-meta"><a class="dx-pill" target="_blank" rel="noopener" href="' + REPO + '/tree/master/src/components">Source</a>' +
      '<span class="dx-pill">' + it.demos.length + ' example' + (it.demos.length === 1 ? '' : 's') + '</span>' +
      ((it.tags || []).indexOf('js') > -1 ? '<span class="dx-pill">Needs ranj.js</span>' : '<span class="dx-pill">CSS only</span>') + '</div>';
    it.demos.forEach(function (d, idx) { html += demoHTML(it, d, idx); });
    if (it.api && it.api.length) {
      html += '<section class="dx-demo" id="api"><h3 class="dx-demo-title">API reference</h3><div class="dx-table-wrap"><table class="dx-api"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>';
      it.api.forEach(function (a) {
        html += '<tr><td><code>' + esc(a.name) + '</code></td><td><span class="dx-type dx-type-' + (a.type || 'class') + '">' + (a.type || 'class') + '</span></td><td>' + (a.default != null ? '<code>' + esc(a.default) + '</code>' : '—') + '</td><td>' + (a.desc || '') + '</td></tr>';
      });
      html += '</tbody></table></div></section>';
    }
    if (it.notes) html += '<section class="dx-demo dx-notes" id="notes"><h3 class="dx-demo-title">Notes</h3>' + it.notes + '</section>';
    html += '<nav class="dx-pager">' + (prev ? '<a href="#/c/' + prev.id + '"><small>Previous</small>' + esc(prev.name) + '</a>' : '<span></span>') +
      (next ? '<a class="next" href="#/c/' + next.id + '"><small>Next</small>' + esc(next.name) + '</a>' : '') + '</nav></article>';
    main.innerHTML = html;
    R.$$('[data-demo]', main).forEach(function (host) { mountDemo(host, it.demos[+host.getAttribute('data-demo')]); });
    // TOC
    var t = '<div class="dx-toc-label">On this page</div>';
    it.demos.forEach(function (d, idx) { if (d.title) t += '<a href="#/c/' + it.id + '?d=' + idx + '" data-toc="' + it.id + '-' + idx + '">' + esc(d.title) + '</a>'; });
    if (it.api && it.api.length) t += '<a href="#/c/' + it.id + '?d=api" data-toc="api">API reference</a>';
    t += '<div class="dx-toc-label" style="margin-top:1.5rem">More in ' + g + '</div>';
    siblings.slice(0, 12).forEach(function (s) { if (s !== it) t += '<a href="#/c/' + s.id + '">' + esc(s.name) + '</a>'; });
    toc.innerHTML = t;
    document.title = it.name + ' — Ranj UI';
    if (focusDemo != null) {
      var target = document.getElementById(focusDemo === 'api' ? 'api' : it.id + '-' + focusDemo);
      if (target) setTimeout(function () { target.scrollIntoView({ block: 'start' }); }, 30);
    }
  }

  function renderGroup(name) {
    var g = groups().filter(function (x) { return x.name === name; })[0];
    if (!g) return renderNotFound();
    demoStyles.textContent = g.items.map(function (it) { return it.demos[0] && it.demos[0].css || ''; }).join('\n');
    var html = '<article class="dx-article wide"><div class="dx-crumbs"><a href="#/">Docs</a><span>/</span>' + esc(name) + '</div><h1 class="dx-h1">' + esc(name) + '</h1>' +
      '<p class="dx-lead">' + g.items.length + ' components. Click any card to see every variant, the code, and the API.</p><div class="dx-cards">';
    g.items.forEach(function (it, idx) {
      html += '<a class="dx-card" href="#/c/' + it.id + '"><div class="dx-card-preview" data-gdemo="' + idx + '"></div><div class="dx-card-body"><b>' + esc(it.name) + '</b><span>' + esc((it.description || '').replace(/<[^>]+>/g, '').slice(0, 90)) + '</span></div></a>';
    });
    html += '</div></article>';
    main.innerHTML = html;
    R.$$('[data-gdemo]', main).forEach(function (host) {
      var it = g.items[+host.getAttribute('data-gdemo')];
      if (it.demos[0]) mountDemo(host, it.demos[0]);
    });
    toc.innerHTML = '';
    document.title = name + ' — Ranj UI';
  }

  function renderNotFound() {
    main.innerHTML = '<article class="dx-article"><h1 class="dx-h1">Not found</h1><p class="dx-lead">That page does not exist. <a href="#/">Back to docs</a>.</p></article>';
    toc.innerHTML = '';
  }

  /* ---------- Guide pages ---------- */
  function guide(id) {
    demoStyles.textContent = '';
    var count = D.items.length, demos = D.items.reduce(function (n, i) { return n + i.demos.length; }, 0);
    var P = {};
    P[''] = '<h1 class="dx-h1">Introduction</h1><p class="dx-lead">Ranj UI is a zero-dependency component library for the plain web. Drop in one CSS file and one JS file and you get <b>' + count + ' components</b> and <b>' + demos + ' live examples</b>: forms, overlays, data display, motion effects, animated backgrounds and micro-interactions. It works with any framework or none.</p>' +
      '<div class="dx-feature-grid">' +
      feat('Zero dependencies', 'No React, no Tailwind, no build step. Semantic HTML plus classes and data attributes.') +
      feat('Auto-mounting', 'Components mount on load and whenever HTML is added later, so it works with htmx, Turbo, Alpine, React or innerHTML.') +
      feat('Themeable', 'One <code>--hue</code> changes the brand. Dark mode, 13 accent presets, radius and density scales.') +
      feat('Accessible', 'Focus traps, roving tabindex, ARIA roles, Escape stacking and reduced-motion support are built in.') +
      feat('Motion built in', 'Text effects, scroll reveals, magnetic and tilt interactions, canvas backgrounds and micro-interactions.') +
      feat('Tree-shakeable', 'Use the full bundle, a group bundle (forms, overlays, fx…) or individual source files.') +
      '</div>' + quick() +
      '<h2 class="dx-h2">Browse</h2><div class="dx-group-links">' + groups().map(function (g) { return '<a href="#/g/' + encodeURIComponent(g.name) + '"><b>' + g.name + '</b><span>' + g.items.length + ' components</span></a>'; }).join('') + '</div>';
    P.install = '<h1 class="dx-h1">Installation</h1><p class="dx-lead">Pick whichever fits your project. All of them give you the same files.</p>' +
      '<h2 class="dx-h2">CDN</h2>' + codeBlock('<link rel="stylesheet" href="' + CDN + '/ranj.min.css">\n<script src="' + CDN + '/ranj.min.js" defer></script>', 'html') +
      '<h2 class="dx-h2">npm</h2>' + codeBlock('npm install github:Ralpberry-Labs/RanjUI', 'bash') + codeBlock("import 'ranj-ui/dist/ranj.css';\nimport 'ranj-ui/dist/ranj.js';", 'js') +
      '<h2 class="dx-h2">Only what you need</h2><p>Every group ships as its own bundle. Always include the core first.</p>' +
      codeBlock('<link rel="stylesheet" href="' + CDN + '/ranj-core.css">\n<link rel="stylesheet" href="' + CDN + '/ranj-forms.css">\n<script src="' + CDN + '/ranj-core.js" defer></script>\n<script src="' + CDN + '/ranj-forms.js" defer></script>', 'html') +
      '<table class="dx-api"><thead><tr><th>Bundle</th><th>Contains</th></tr></thead><tbody>' +
      '<tr><td><code>ranj-core</code></td><td>Tokens, reset, typography, layout, utilities, runtime</td></tr><tr><td><code>ranj-base</code></td><td>Buttons, cards, badges, tables, data display</td></tr><tr><td><code>ranj-forms</code></td><td>Inputs, selects, pickers, sliders, uploads</td></tr><tr><td><code>ranj-overlays</code></td><td>Dialogs, sheets, menus, popovers, toasts, navigation</td></tr><tr><td><code>ranj-motion</code></td><td>Text effects, reveals, interactions</td></tr><tr><td><code>ranj-fx</code></td><td>Backgrounds, loaders, micro-interactions</td></tr></tbody></table>' +
      '<h2 class="dx-h2">Build from source</h2>' + codeBlock('git clone https://github.com/Ralpberry-Labs/RanjUI\ncd RanjUI && npm install\nnpm run build   # writes dist/\nnpm run dev     # rebuild on change', 'bash');
    P.theming = '<h1 class="dx-h1">Theming</h1><p class="dx-lead">Everything is a CSS variable. Change the hue and the whole library follows, including focus rings, soft fills and glows.</p>' +
      '<div class="dx-theme-live">' + R.$$('#dx-accents button').length + '</div>' +
      '<h2 class="dx-h2">Presets</h2>' + codeBlock('<html data-theme="dark" data-accent="violet" data-radius="lg" data-density="compact">', 'html') +
      '<p>Accents: blue, indigo, violet, purple, pink, rose, orange, amber, lime, green, teal, cyan, mono. Radius: none, sm, md, lg, full. These attributes work on any element, so you can theme a single section.</p>' +
      '<h2 class="dx-h2">Custom brand</h2>' + codeBlock(':root {\n  --hue: 162;              /* any OKLCH hue */\n  --radius: 0.75rem;\n  --font-sans: "Geist", system-ui, sans-serif;\n}\n/* or set exact colors */\n:root { --primary: #ff5a1f; --primary-hover: #e14a12; }', 'css') +
      '<h2 class="dx-h2">From JavaScript</h2>' + codeBlock("Ranj.theme.set('dark');      // 'light' | 'dark'\nRanj.theme.toggle();\nRanj.theme.accent('rose');\nRanj.theme.radius('full');\ndocument.addEventListener('ranj:theme', e => console.log(e.detail.theme));", 'js') +
      '<h2 class="dx-h2">Token reference</h2><table class="dx-api"><thead><tr><th>Token</th><th>Use</th></tr></thead><tbody>' +
      [['--bg / --fg', 'Page background and text'], ['--card / --popover', 'Raised surfaces'], ['--primary / --primary-fg / --primary-soft', 'Brand fills, text on brand, tinted backgrounds'], ['--muted / --muted-fg', 'Quiet fills and secondary text'], ['--border / --input / --ring', 'Lines, control borders, focus ring'], ['--success / --warning / --destructive / --info (+ -soft, -soft-fg)', 'Status colors'], ['--radius (xs…2xl, full)', 'Corner scale derived from one value'], ['--shadow-xs … --shadow-xl, --shadow-glow', 'Elevation'], ['--ease, --ease-out, --ease-spring, --dur-*', 'Motion curves and durations'], ['--z-dropdown … --z-tooltip', 'Layering']].map(function (r) { return '<tr><td><code>' + r[0] + '</code></td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table>';
    P.motion = '<h1 class="dx-h1">Motion & accessibility</h1><p class="dx-lead">Animation is there to help people see what changed. Ranj UI uses quick, eased motion by default and turns it off when people ask for less.</p>' +
      '<ul class="dx-list"><li><b>Reduced motion.</b> With <code>prefers-reduced-motion: reduce</code>, CSS animations collapse to a single frame, and JS effects (text scramble, particles, tilt) render their final state. Read <code>Ranj.reducedMotion</code> in your own code.</li>' +
      '<li><b>Offscreen pausing.</b> Canvas backgrounds and loops pause when they scroll out of view or the tab is hidden, so they cost nothing.</li>' +
      '<li><b>Keyboard.</b> Menus, tabs, listboxes and toggle groups use arrow keys, Home/End, Enter/Space. Overlays trap focus and give it back on close. Escape closes the topmost layer only.</li>' +
      '<li><b>Screen readers.</b> Components set <code>role</code>, <code>aria-expanded</code>, <code>aria-selected</code>, <code>aria-controls</code> and live regions for toasts.</li></ul>' +
      '<h2 class="dx-h2">Easing tokens</h2>' + codeBlock('--ease: cubic-bezier(.2, 0, 0, 1);         /* UI default */\n--ease-out: cubic-bezier(.16, 1, .3, 1);    /* entering */\n--ease-spring: cubic-bezier(.34, 1.56, .64, 1); /* playful overshoot */\n--dur-fast: 120ms; --dur: 200ms; --dur-slow: 350ms;', 'css');
    P.js = '<h1 class="dx-h1">JavaScript API</h1><p class="dx-lead">Most components need no JavaScript from you; data attributes are enough. When you want control, everything lives on <code>window.Ranj</code>.</p>' +
      '<h2 class="dx-h2">Lifecycle</h2>' + codeBlock("// Components mount automatically, including HTML you add later.\nel.innerHTML = '<div class=\"carousel\">…</div>'; // just works\n\nRanj.init(root);      // force-mount inside root\nRanj.destroy(root);   // tear down listeners/timers\n\ndocument.addEventListener('ranj:ready', () => {});", 'js') +
      '<h2 class="dx-h2">Imperative helpers</h2>' + codeBlock("Ranj.toast({ title: 'Saved', description: 'All changes stored', type: 'success' });\nRanj.toast.promise(fetch('/api'), { loading: 'Saving…', success: 'Done', error: 'Failed' });\nRanj.dialog.open('my-dialog');\nRanj.confirm({ title: 'Delete project?', danger: true }).then(ok => …);\nRanj.confetti({ x: 0.5, y: 0.6 });", 'js') +
      '<h2 class="dx-h2">Write your own component</h2>' + codeBlock("Ranj.define('hello', {\n  selector: '[data-hello]',\n  setup() { /* once: delegated listeners */ },\n  mount(el, R) {\n    const off = R.on(el, 'click', () => el.classList.toggle('on'));\n    return () => off();   // cleanup when el leaves the DOM\n  }\n});", 'js') +
      '<h2 class="dx-h2">Utilities</h2><table class="dx-api"><tbody>' + [['Ranj.position(floating, anchor, {placement, offset})', 'Places a floating element with flip and shift'], ['Ranj.trapFocus(el)', 'Traps Tab inside el, returns release()'], ['Ranj.scrollLock.lock() / unlock()', 'Ref-counted body scroll lock'], ['Ranj.pushLayer(close)', 'Adds to the Escape stack'], ['Ranj.inView(el, fn, opts)', 'Runs fn when el scrolls into view'], ['Ranj.loop(el, frame)', 'rAF loop paused offscreen'], ['Ranj.opts(el, defaults)', 'Reads data-* options with types'], ['Ranj.emit(el, name, detail)', 'Dispatches ranj:name events']].map(function (r) { return '<tr><td><code>' + r[0] + '</code></td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table>';
    P.changelog = '<h1 class="dx-h1">Changelog</h1><h2 class="dx-h2">2.0.0 — Ranj UI</h2><ul class="dx-list"><li>Renamed from RanjuUI to <b>Ranj UI</b>. <code>window.Ranju</code> still works as an alias.</li><li>New runtime: auto-mount with MutationObserver, cleanup, focus traps, floating positioning, Escape stack.</li><li>Rebuilt all 40 v1 components with keyboard support and ARIA, and added more than 100 new ones.</li><li>New groups: Text Effects, Motion, Interactions, Backgrounds, Micro-interactions, Loaders, Blocks.</li><li>OKLCH theming with one <code>--hue</code>, 13 accents, radius and density scales.</li><li>Per-group bundles and minified builds.</li></ul><h2 class="dx-h2">1.0.0 — RanjuUI</h2><p>First release: 40 components.</p>';
    if (!(id in P)) return renderNotFound();
    main.innerHTML = '<article class="dx-article">' + P[id] + '</article>';
    toc.innerHTML = '<div class="dx-toc-label">On this page</div>' + R.$$('.dx-h2', main).map(function (h, i) { h.id = 'sec-' + i; return '<a href="#/' + id + '?d=sec-' + i + '" data-toc="sec-' + i + '">' + h.textContent + '</a>'; }).join('');
    var live = R.$('.dx-theme-live', main);
    if (live) { live.innerHTML = ''; live.appendChild(customBody(true)); }
    document.title = (GUIDES.filter(function (g) { return g.id === id; })[0] || {}).name + ' — Ranj UI';
  }
  function feat(t, d) { return '<div class="dx-feature"><b>' + t + '</b><p>' + d + '</p></div>'; }
  function quick() {
    return '<h2 class="dx-h2">Quick start</h2>' + codeBlock('<!doctype html>\n<html lang="en">\n<head>\n  <link rel="stylesheet" href="' + CDN + '/ranj.min.css">\n  <script src="' + CDN + '/ranj.min.js" defer></script>\n</head>\n<body>\n  <button class="btn" onclick="Ranj.toast({ title: \'Hello from Ranj UI\' })">Say hi</button>\n</body>\n</html>', 'html');
  }

  /* ---------- Router ---------- */
  function route() {
    cleanup.forEach(function (f) { try { f(); } catch (e) {} }); cleanup = [];
    var h = location.hash.replace(/^#/, '') || '/';
    var q = h.split('?'), path = q[0], d = (q[1] || '').replace(/^d=/, '') || null;
    var m;
    if ((m = path.match(/^\/c\/(.+)$/))) {
      var it = D.items.filter(function (i) { return i.id === m[1]; })[0];
      it ? renderComponent(it, d) : renderNotFound();
    } else if ((m = path.match(/^\/g\/(.+)$/))) renderGroup(decodeURIComponent(m[1]));
    else guide(path.slice(1));
    markActive();
    if (!d) window.scrollTo(0, 0);
    else if (!path.match(/^\/c\//)) { var t = document.getElementById(d); if (t) t.scrollIntoView(); }
    document.body.classList.remove('nav-open');
    var act = R.$('a.active', nav); if (act && act.scrollIntoViewIfNeeded) act.scrollIntoViewIfNeeded(false);
  }
  window.addEventListener('hashchange', route);

  /* ---------- Delegated interactions ---------- */
  R.on(main, 'click', '[data-tab]', function () {
    var frame = this.closest('.dx-frame'), tab = this.getAttribute('data-tab');
    R.$$('[data-tab]', frame).forEach(function (b) { b.classList.toggle('active', b === this); }, this);
    R.$$('.dx-pane', frame).forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== tab; });
  });
  R.on(main, 'click', '[data-copy]', function () { var c = this.closest('.dx-code').querySelector('code'); copy(c.getAttribute('data-raw'), this); });
  R.on(main, 'click', '[data-copy-demo]', function () { var c = this.closest('.dx-frame').querySelector('[data-pane="html"] code'); copy(c.getAttribute('data-raw'), this); });
  R.on(main, 'click', '[data-replay]', function () {
    var host = this.closest('.dx-frame').querySelector('[data-demo]');
    var it = currentItem(); if (it) mountDemo(host, it.demos[+host.getAttribute('data-demo')]);
  });
  R.on(main, 'click', '[data-full]', function () {
    var frame = this.closest('.dx-frame');
    frame.classList.toggle('full');
    document.documentElement.classList.toggle('dx-noscroll', frame.classList.contains('full'));
  });
  function currentItem() { var m = location.hash.match(/#\/c\/([^?]+)/); return m && D.items.filter(function (i) { return i.id === m[1]; })[0]; }

  document.getElementById('dx-filter').addEventListener('input', function () { renderNav(this.value); });
  document.getElementById('dx-menu').addEventListener('click', function () { document.body.classList.toggle('nav-open'); });
  document.getElementById('dx-scrim').addEventListener('click', function () { document.body.classList.remove('nav-open'); });
  document.getElementById('dx-theme').addEventListener('click', function () { R.theme.toggle(); syncCustom(); });

  /* ---------- Search palette ---------- */
  var pal = document.getElementById('dx-palette'), pin = document.getElementById('dx-palette-input'), plist = document.getElementById('dx-palette-list');
  var pIdx = 0, pRes = [], releaseTrap = null, popLayer = null;
  function openPalette() {
    pal.hidden = false; pin.value = ''; searchPalette('');
    releaseTrap = R.trapFocus(pal, pin); popLayer = R.pushLayer(closePalette);
  }
  function closePalette() { pal.hidden = true; if (releaseTrap) releaseTrap(); if (popLayer) popLayer(); releaseTrap = popLayer = null; }
  function score(it, q) {
    var n = it.name.toLowerCase(), k = (it.keywords || []).join(' ').toLowerCase() + ' ' + it.group.toLowerCase() + ' ' + (it.description || '').toLowerCase();
    if (!q) return 1; if (n === q) return 100; if (n.indexOf(q) === 0) return 80; if (n.indexOf(q) > -1) return 60; if (k.indexOf(q) > -1) return 30;
    var i = 0; for (var c = 0; c < n.length && i < q.length; c++) if (n[c] === q[i]) i++; return i === q.length ? 10 : 0;
  }
  function searchPalette(q) {
    q = q.toLowerCase().trim();
    var guides = GUIDES.filter(function (g) { return !q || g.name.toLowerCase().indexOf(q) > -1; }).map(function (g) { return { href: '#/' + g.id, name: g.name, group: 'Guide' }; });
    pRes = guides.concat(D.items.map(function (i) { return { it: i, s: score(i, q) }; }).filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s || a.it.name.localeCompare(b.it.name); }).slice(0, 40)
      .map(function (x) { return { href: '#/c/' + x.it.id, name: x.it.name, group: x.it.group }; }));
    pIdx = 0; drawPalette();
  }
  function drawPalette() {
    plist.innerHTML = pRes.length ? pRes.map(function (r, i) { return '<a role="option" href="' + r.href + '"' + (i === pIdx ? ' aria-selected="true"' : '') + '><span>' + esc(r.name) + '</span><small>' + esc(r.group) + '</small></a>'; }).join('') : '<p class="dx-empty">Nothing found.</p>';
    var sel = R.$('[aria-selected]', plist); if (sel) sel.scrollIntoView({ block: 'nearest' });
  }
  pin.addEventListener('input', function () { searchPalette(pin.value); });
  pin.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); pIdx = Math.min(pRes.length - 1, pIdx + 1); drawPalette(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); pIdx = Math.max(0, pIdx - 1); drawPalette(); }
    else if (e.key === 'Enter' && pRes[pIdx]) { location.hash = pRes[pIdx].href; closePalette(); }
  });
  plist.addEventListener('click', function (e) { if (e.target.closest('a')) closePalette(); });
  pal.addEventListener('mousedown', function (e) { if (e.target === pal) closePalette(); });
  document.getElementById('dx-search-btn').addEventListener('click', openPalette);
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? openPalette() : closePalette(); }
    else if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { e.preventDefault(); openPalette(); }
  });

  /* ---------- Customizer ---------- */
  var ACCENTS = [['blue', 255], ['indigo', 270], ['violet', 292], ['purple', 305], ['pink', 350], ['rose', 15], ['orange', 45], ['amber', 70], ['lime', 130], ['green', 150], ['teal', 185], ['cyan', 215], ['mono', null]];
  function customBody(inline) {
    var box = document.createElement('div');
    box.className = 'dx-custom-inline';
    box.innerHTML = '<div class="dx-custom-label">Accent</div><div class="dx-swatches">' + ACCENTS.map(function (a) {
      return '<button data-accent-set="' + a[0] + '" title="' + a[0] + '" style="--sw:' + (a[1] == null ? 'var(--fg)' : 'oklch(0.6 0.2 ' + a[1] + ')') + '"></button>';
    }).join('') + '</div><div class="dx-custom-label">Radius</div><div class="dx-seg">' + ['none', 'sm', 'md', 'lg', 'full'].map(function (r) { return '<button data-radius-set="' + r + '">' + r + '</button>'; }).join('') +
      '</div><div class="dx-custom-label">Mode</div><div class="dx-seg">' + ['light', 'dark'].map(function (m) { return '<button data-mode-set="' + m + '">' + m + '</button>'; }).join('') + '</div>';
    return box;
  }
  var cust = document.getElementById('dx-custom');
  function fillCustom() {
    var body = customBody();
    var hue = '<div class="dx-custom-label">Custom hue <span id="dx-hue-val"></span></div><input type="range" min="0" max="360" id="dx-hue" class="dx-hue">';
    cust.innerHTML = '<div class="dx-custom-head"><b>Customize</b><button class="dx-icon-btn" data-close aria-label="Close">✕</button></div>';
    cust.appendChild(body); cust.insertAdjacentHTML('beforeend', hue);
    var h = document.getElementById('dx-hue');
    h.value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hue')) || 252;
    document.getElementById('dx-hue-val').textContent = h.value;
    h.addEventListener('input', function () {
      document.documentElement.removeAttribute('data-accent');
      document.documentElement.style.setProperty('--hue', h.value);
      document.getElementById('dx-hue-val').textContent = h.value;
      try { localStorage.removeItem('ranj-accent'); } catch (e) {}
    });
    syncCustom();
  }
  function syncCustom() {
    var root = document.documentElement;
    R.$$('[data-accent-set]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-accent-set') === (root.getAttribute('data-accent') || '')); });
    R.$$('[data-radius-set]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-radius-set') === (root.getAttribute('data-radius') || 'md')); });
    R.$$('[data-mode-set]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-mode-set') === R.theme.get()); });
  }
  R.on(document, 'click', '[data-accent-set]', function () { document.documentElement.style.removeProperty('--hue'); R.theme.accent(this.getAttribute('data-accent-set')); syncCustom(); });
  R.on(document, 'click', '[data-radius-set]', function () { R.theme.radius(this.getAttribute('data-radius-set')); syncCustom(); });
  R.on(document, 'click', '[data-mode-set]', function () { R.theme.set(this.getAttribute('data-mode-set')); syncCustom(); });
  var custOff = null;
  document.getElementById('dx-customize').addEventListener('click', function (e) {
    e.stopPropagation();
    if (!cust.hidden) { closeCust(); return; }
    fillCustom(); cust.hidden = false;
    var pop = R.pushLayer(closeCust), out = R.onOutside([cust, this], closeCust);
    custOff = function () { pop(); out(); };
  });
  function closeCust() { cust.hidden = true; if (custOff) custOff(); custOff = null; }
  R.on(cust, 'click', '[data-close]', closeCust);

  /* ---------- Boot ---------- */
  renderNav();
  route();
})();
