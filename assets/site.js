/* Ranj UI landing page: mounts live demos straight from the docs registry. */
(function () {
  'use strict';
  var R = window.Ranj, D = window.RanjDocs;
  var byId = {};
  D.items.forEach(function (i) { byId[i.id] = i; });
  var styleEl = document.createElement('style');
  document.head.appendChild(styleEl);
  var usedCss = {};

  function dedent(str) {
    var lines = String(str || '').replace(/^\n+|\s+$/g, '').split('\n'), min = Infinity;
    lines.forEach(function (l) { if (l.trim()) min = Math.min(min, l.match(/^\s*/)[0].length); });
    return lines.map(function (l) { return l.slice(min === Infinity ? 0 : min); }).join('\n');
  }
  /** Mount demo #idx of component id into host. Returns false if missing. */
  function mount(host, id, idx) {
    var it = byId[id]; if (!it) return false;
    var d = it.demos[idx || 0] || it.demos[0]; if (!d) return false;
    it.demos.forEach(function (x, i) { if (x.css && !usedCss[id + i]) { usedCss[id + i] = 1; styleEl.textContent += '\n' + x.css; } });
    var wrap = document.createElement('div');
    wrap.className = 's-demo-root';
    wrap.innerHTML = dedent(d.html);
    host.appendChild(wrap);
    R.init(wrap);
    if (d.js) { try { new Function('root', 'Ranj', dedent(d.js))(wrap, R); } catch (e) { console.warn('[site] demo', id, e); } }
    return true;
  }
  function first(host, list) {
    for (var i = 0; i < list.length; i++) { var p = list[i].split(':'); if (mount(host, p[0], +p[1] || 0)) return p[0]; }
    return null;
  }

  /* Counts */
  var count = D.items.length, demos = D.items.reduce(function (n, i) { return n + i.demos.length; }, 0);
  var roundDown = function (n, s) { return Math.floor(n / s) * s; };
  R.$$('.js-count').forEach(function (el) { el.textContent = el.textContent.replace(/\d+\+?/, roundDown(count, 10) + '+'); });
  R.$$('.js-count-up').forEach(function (el) { el.setAttribute('data-to', roundDown(count, 10)); el.textContent = roundDown(count, 10) + '+'; });
  R.$$('.js-demos-up').forEach(function (el) { el.setAttribute('data-to', roundDown(demos, 50)); el.textContent = roundDown(demos, 50) + '+'; });
  fetch('dist/ranj.min.css', { method: 'HEAD' }).catch(function () {});

  /* Hero window: a realistic dashboard composed from live components */
  var hero = document.getElementById('s-hero-demo');
  if (hero) {
    var a = document.createElement('div'); a.className = 's-hero-col';
    var b = document.createElement('div'); b.className = 's-hero-col';
    hero.appendChild(a); hero.appendChild(b);
    first(a, ['stat:0']);
    first(a, ['line-chart:0', 'bar-chart:0', 'sparkline:0']);
    first(b, ['data-table:0', 'table:0']);
  }

  /* Strip of component names */
  var names = D.items.map(function (i) { return i.name; });
  function strip(id, list) {
    var el = document.getElementById(id); if (!el) return;
    el.innerHTML = list.map(function (n) { return '<span class="s-chip">' + R.esc(n) + '</span>'; }).join('');
  }
  strip('s-strip-a', names.filter(function (_, i) { return i % 2 === 0; }));
  strip('s-strip-b', names.filter(function (_, i) { return i % 2 === 1; }));

  /* Bento of live components */
  var tiles = [
    { cls: 'w2', title: 'Toasts', ids: ['toast:0'] },
    { cls: '', title: 'Switch', ids: ['switch:0'] },
    { cls: '', title: 'One-time code', ids: ['otp-input:0'] },
    { cls: '', title: 'Dropdown menu', ids: ['dropdown-menu:0'] },
    { cls: 'w2', title: 'Tabs', ids: ['tabs:0'] },
    { cls: '', title: 'Date picker', ids: ['date-picker:0', 'calendar:0'] },
    { cls: '', title: 'Slider', ids: ['range-slider:0', 'slider:0'] },
    { cls: '', title: 'Dialog', ids: ['alert-dialog:0', 'dialog:0'] },
    { cls: 'w2', title: 'Command palette', ids: ['command:0'] },
    { cls: '', title: 'Segmented control', ids: ['segmented:0'] },
    { cls: '', title: 'Avatars', ids: ['avatar:0'] },
    { cls: '', title: 'Tag input', ids: ['tag-input:0', 'multi-select:0'] },
    { cls: 'w2', title: 'Charts', ids: ['donut-chart:0', 'bar-chart:0'] },
    { cls: '', title: 'Buttons', ids: ['button:0'] },
    { cls: '', title: 'Accordion', ids: ['accordion:0'] },
    { cls: '', title: 'File upload', ids: ['file-upload:0'] }
  ];
  var bento = document.getElementById('s-bento');
  tiles.forEach(function (t, i) {
    var card = document.createElement('div');
    card.className = 's-tile ' + t.cls;
    card.setAttribute('data-reveal', 'fade-up');
    card.setAttribute('data-delay', String((i % 4) * 60));
    var body = document.createElement('div'); body.className = 's-tile-body';
    card.appendChild(body);
    var got = first(body, t.ids);
    if (!got) return;
    card.insertAdjacentHTML('beforeend', '<a class="s-tile-foot" href="docs/#/c/' + got + '"><span>' + t.title + '</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>');
    bento.appendChild(card);
  });

  /* Motion showcase */
  var fx = [
    ['Split text', 'split-text:0'], ['Decrypt', 'decrypt-text:0'], ['Tilt + glare', 'tilt:0'], ['Spotlight', 'spotlight-card:0'],
    ['Dock', 'dock:0'], ['Border beam', 'border-beam:0'], ['Card stack', 'stack-cards:0'], ['Word globe', 'word-globe:0'], ['Orbit', 'orbit:0']
  ];
  var fxEl = document.getElementById('s-fx');
  fx.forEach(function (f) {
    var card = document.createElement('div'); card.className = 's-fx'; card.setAttribute('data-reveal', 'fade-up');
    var body = document.createElement('div'); body.className = 's-fx-body'; card.appendChild(body);
    var got = first(body, [f[1]]); if (!got) return;
    card.insertAdjacentHTML('beforeend', '<a class="s-tile-foot" href="docs/#/c/' + got + '"><span>' + f[0] + '</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>');
    fxEl.appendChild(card);
  });

  /* Backgrounds */
  var bgs = ['bg-aurora', 'bg-particles', 'bg-meteors', 'bg-mesh', 'bg-retro-grid', 'bg-light-rays', 'bg-waves', 'bg-squares', 'bg-stars'];
  var bgEl = document.getElementById('s-bgs');
  bgs.forEach(function (id) {
    var it = byId[id]; if (!it) return;
    var a = document.createElement('a'); a.className = 's-bg'; a.href = 'docs/#/c/' + id; a.setAttribute('data-reveal', 'zoom');
    var host = document.createElement('div'); host.className = 's-bg-host'; a.appendChild(host);
    var cls = id === 'bg-grid' ? 'bg-line-grid' : id;
    host.innerHTML = '<div class="' + cls + '"></div>';
    a.insertAdjacentHTML('beforeend', '<span class="s-bg-name">' + R.esc(it.name) + '</span>');
    bgEl.appendChild(a);
  });

  /* Micro-interactions */
  var micro = ['like-button:0', 'day-night-toggle:0', 'download-button:0', 'morph-icons:0', 'send-button:0', 'add-to-cart:0', 'copy-button:0', 'progress-donut:0', 'search-reveal:0', 'animated-checkbox:0', 'spinner-success:0', 'reaction-button:0'];
  var mEl = document.getElementById('s-micro');
  micro.forEach(function (m) {
    var card = document.createElement('div'); card.className = 's-micro'; card.setAttribute('data-reveal', 'fade-up');
    var body = document.createElement('div'); body.className = 's-micro-body'; card.appendChild(body);
    var got = first(body, [m]); if (!got) return;
    card.insertAdjacentHTML('beforeend', '<a class="s-tile-foot" href="docs/#/c/' + got + '"><span>' + R.esc(byId[got].name) + '</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>');
    mEl.appendChild(card);
  });

  /* Theming */
  var ACC = [['violet', 292], ['blue', 255], ['cyan', 215], ['teal', 185], ['green', 150], ['lime', 130], ['amber', 70], ['orange', 45], ['rose', 15], ['pink', 350], ['purple', 305], ['indigo', 270]];
  var sw = document.getElementById('s-swatches'), out = document.getElementById('s-hue-out');
  function syncSw() {
    var cur = document.documentElement.getAttribute('data-accent') || '';
    R.$$('button', sw).forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-a') === cur); });
    var h = (ACC.filter(function (a) { return a[0] === cur; })[0] || [0, 252])[1];
    out.textContent = h;
  }
  sw.innerHTML = ACC.map(function (a) { return '<button data-a="' + a[0] + '" title="' + a[0] + '" aria-label="' + a[0] + ' accent" style="--sw:oklch(.62 .2 ' + a[1] + ')"></button>'; }).join('');
  R.on(sw, 'click', 'button', function () { R.theme.accent(this.getAttribute('data-a')); syncSw(); });
  syncSw();
  var td = document.getElementById('s-theme-demo');
  ['button:0', 'switch:0', 'segmented:0', 'progress:0', 'badge:0'].forEach(function (x) { first(td, [x]); });

  /* Install copy */
  var inst = document.getElementById('s-install');
  inst.addEventListener('click', function () {
    var txt = inst.querySelector('code').textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () {
      inst.classList.add('copied');
      if (R.toast) R.toast({ title: 'Copied install command', type: 'success' });
      setTimeout(function () { inst.classList.remove('copied'); }, 1500);
    }, function () {});
  });

  /* Theme toggle */
  document.getElementById('s-theme').addEventListener('click', function () { R.theme.toggle(); });

  /* Size badge from the real file (gzip estimate ~ 27% of minified size) */
  Promise.all(['dist/ranj.min.css', 'dist/ranj.min.js'].map(function (u) { return fetch(u).then(function (r) { return r.text(); }); })).then(function (t) {
    var kb = Math.round((t[0].length + t[1].length) * 0.24 / 1024);
    R.$$('.js-gz').forEach(function (el) { el.textContent = '~' + kb + 'KB'; });
  }).catch(function () {});
})();
