/*! Ranj UI v2.0.0 | MIT | https://ralpberry-labs.github.io/RanjUI/ */
/* Ranj UI — Interactions
 * magnetic, tilt, spotlight (card + grid), ripple, click-spark, confetti, cursor-follower, pixel-transition
 */
(function (R) {
  'use strict';
  var d = document, w = window;
  var coarse = w.matchMedia ? w.matchMedia('(pointer: coarse)') : { matches: false };

  function ensurePositioned(el) {
    if (getComputedStyle(el).position === 'static') { el.style.position = 'relative'; return function () { el.style.position = ''; }; }
    return function () {};
  }
  function resolveColor(el, value, fallbackVar) {
    var probe = d.createElement('span');
    probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;color:' + (value || 'var(' + (fallbackVar || '--primary') + ')');
    el.appendChild(probe);
    var c = getComputedStyle(probe).color; probe.remove();
    return c || '#6366f1';
  }
  function canvasFor(host, cls) {
    var c = d.createElement('canvas'); c.className = cls; c.setAttribute('aria-hidden', 'true');
    host.appendChild(c);
    var ctx = c.getContext('2d'), dpr = 1, W = 0, H = 0;
    function size() {
      dpr = Math.min(2, w.devicePixelRatio || 1);
      W = c.clientWidth || host.clientWidth; H = c.clientHeight || host.clientHeight;
      c.width = Math.max(1, Math.round(W * dpr)); c.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    var ro = 'ResizeObserver' in w ? new ResizeObserver(size) : null; if (ro) ro.observe(host);
    return { el: c, ctx: ctx, size: function () { return { w: W, h: H }; }, destroy: function () { if (ro) ro.disconnect(); c.remove(); } };
  }

  /* ---------- Magnetic ---------- */
  R.define('magnetic', {
    selector: '[data-magnetic]',
    mount: function (el) {
      if (R.reducedMotion) return;
      var strength = parseFloat(el.getAttribute('data-magnetic')); if (isNaN(strength)) strength = 0.35;
      var o = R.opts(el, { magneticArea: 70 });
      var inner = R.$('[data-magnetic-inner]', el);
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, visible = false;
      function frame() {
        cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
        if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05) { cx = tx; cy = ty; }
        el.style.transform = cx || cy ? 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)' : '';
        if (inner) inner.style.transform = cx || cy ? 'translate3d(' + (cx * 0.6).toFixed(2) + 'px,' + (cy * 0.6).toFixed(2) + 'px,0)' : '';
        raf = (cx !== tx || cy !== ty) ? requestAnimationFrame(frame) : 0;
      }
      function kick() { if (!raf) raf = requestAnimationFrame(frame); }
      var io = 'IntersectionObserver' in w ? new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }) : null;
      if (io) io.observe(el); else visible = true;
      var off = R.on(w, 'pointermove', function (e) {
        if (!visible || e.pointerType === 'touch') return;
        var r = el.getBoundingClientRect();
        var mx = r.left - cx + r.width / 2, my = r.top - cy + r.height / 2;
        var a = o.magneticArea, inside = e.clientX > r.left - cx - a && e.clientX < r.right - cx + a && e.clientY > r.top - cy - a && e.clientY < r.bottom - cy + a;
        var nx = inside ? (e.clientX - mx) * strength : 0, ny = inside ? (e.clientY - my) * strength : 0;
        if (nx !== tx || ny !== ty) { tx = nx; ty = ny; el.toggleAttribute('data-magnetic-active', inside); kick(); }
      }, { passive: true });
      return function () { off(); if (io) io.disconnect(); cancelAnimationFrame(raf); el.style.transform = ''; if (inner) inner.style.transform = ''; };
    }
  });

  /* ---------- Tilt ---------- */
  R.define('tilt', {
    selector: '[data-tilt]',
    mount: function (el) {
      var o = R.opts(el, { tiltMax: 12, tiltPerspective: 900, tiltScale: 1.03, tiltGlare: false, tiltReverse: false, tiltGlareMax: 0.45 });
      R.$$('[data-tilt-depth]', el).forEach(function (n) { n.style.setProperty('--tilt-z', (parseFloat(n.getAttribute('data-tilt-depth')) || 0) + 'px'); });
      if (R.reducedMotion) return;
      var glare = null;
      if (o.tiltGlare) { glare = d.createElement('div'); glare.className = 'tilt-glare'; glare.setAttribute('aria-hidden', 'true'); el.appendChild(glare); el.style.setProperty('--glare-max', o.tiltGlareMax); }
      var rx = 0, ry = 0, s = 1, trx = 0, tryy = 0, ts = 1, raf = 0, sign = o.tiltReverse ? -1 : 1;
      function frame() {
        rx += (trx - rx) * 0.14; ry += (tryy - ry) * 0.14; s += (ts - s) * 0.14;
        var settled = Math.abs(trx - rx) < 0.01 && Math.abs(tryy - ry) < 0.01 && Math.abs(ts - s) < 0.0005;
        if (settled) { rx = trx; ry = tryy; s = ts; }
        el.style.transform = (rx || ry || s !== 1) ? 'perspective(' + o.tiltPerspective + 'px) rotateX(' + rx.toFixed(3) + 'deg) rotateY(' + ry.toFixed(3) + 'deg) scale3d(' + s.toFixed(4) + ',' + s.toFixed(4) + ',1)' : '';
        raf = settled ? 0 : requestAnimationFrame(frame);
      }
      function kick() { if (!raf) raf = requestAnimationFrame(frame); }
      var offs = [
        R.on(el, 'pointermove', function (e) {
          var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          trx = sign * -(py - 0.5) * 2 * o.tiltMax; tryy = sign * (px - 0.5) * 2 * o.tiltMax; ts = o.tiltScale;
          el.style.setProperty('--gx', (px * 100).toFixed(1) + '%'); el.style.setProperty('--gy', (py * 100).toFixed(1) + '%'); el.style.setProperty('--go', 1);
          el.style.setProperty('--px', px.toFixed(3)); el.style.setProperty('--py', py.toFixed(3));
          kick();
        }),
        R.on(el, 'pointerleave', function () { trx = tryy = 0; ts = 1; el.style.setProperty('--go', 0); kick(); })
      ];
      return function () { offs.forEach(function (f) { f(); }); cancelAnimationFrame(raf); el.style.transform = ''; if (glare) glare.remove(); };
    }
  });

  /* ---------- Spotlight (card / grid / bento) ---------- */
  R.define('spotlight', {
    selector: '.spotlight-card, .bento-card, .spotlight-grid, [data-spotlight-group]',
    mount: function (el) {
      var isGroup = el.matches('.spotlight-grid, [data-spotlight-group]');
      if (!isGroup && el.parentElement && el.parentElement.closest('.spotlight-grid, [data-spotlight-group]')) return;
      var cards = isGroup ? R.$$('.spotlight-card, .bento-card', el) : [el];
      var raf = 0, ev = null;
      function frame() {
        raf = 0; if (!ev) return;
        var rects = cards.map(function (c) { return c.getBoundingClientRect(); });
        cards.forEach(function (c, i) {
          var r = rects[i];
          c.style.setProperty('--mx', (ev.x - r.left).toFixed(1) + 'px'); c.style.setProperty('--my', (ev.y - r.top).toFixed(1) + 'px');
          c.style.setProperty('--spot-o', 1);
          c.style.setProperty('--spot-in', ev.x >= r.left && ev.x <= r.right && ev.y >= r.top && ev.y <= r.bottom ? 1 : 0);
        });
      }
      var offs = [
        R.on(el, 'pointermove', function (e) { ev = { x: e.clientX, y: e.clientY }; if (!raf) raf = requestAnimationFrame(frame); }),
        R.on(el, 'pointerleave', function () { ev = null; cards.forEach(function (c) { c.style.setProperty('--spot-o', 0); c.style.setProperty('--spot-in', 0); }); })
      ];
      return function () { offs.forEach(function (f) { f(); }); cancelAnimationFrame(raf); };
    }
  });

  /* ---------- Ripple (delegated, any [data-ripple]) ---------- */
  function ripple(host, x, y) {
    if (R.reducedMotion || host.disabled || host.getAttribute('aria-disabled') === 'true') return null;
    ensurePositioned(host);
    var layer = host.querySelector(':scope > .ripple-layer');
    if (!layer) { layer = d.createElement('span'); layer.className = 'ripple-layer'; layer.setAttribute('aria-hidden', 'true'); host.appendChild(layer); }
    var r = host.getBoundingClientRect(), lx = x - r.left, ly = y - r.top;
    var size = 2 * Math.max(Math.hypot(lx, ly), Math.hypot(r.width - lx, ly), Math.hypot(lx, r.height - ly), Math.hypot(r.width - lx, r.height - ly));
    var wv = d.createElement('span'); wv.className = 'ripple-wave';
    wv.style.width = wv.style.height = size + 'px';
    wv.style.left = (lx - size / 2) + 'px'; wv.style.top = (ly - size / 2) + 'px';
    var c = host.getAttribute('data-ripple');
    if (c === 'light') wv.style.background = '#fff'; else if (c === 'dark') wv.style.background = '#000'; else if (c) wv.style.background = c;
    layer.appendChild(wv);
    var t0 = performance.now();
    return function release() {
      setTimeout(function () {
        wv.classList.add('ripple-out');
        setTimeout(function () { wv.remove(); if (!layer.children.length) layer.remove(); }, 480);
      }, Math.max(0, 260 - (performance.now() - t0)));
    };
  }
  R.ripple = function (el, x, y) { var r = el.getBoundingClientRect(); var rel = ripple(el, x == null ? r.left + r.width / 2 : x, y == null ? r.top + r.height / 2 : y); if (rel) rel(); };
  R.define('ripple', {
    setup: function () {
      R.on(d, 'pointerdown', '[data-ripple]', function (e, host) {
        if (e.button > 0) return;
        var rel = ripple(host, e.clientX, e.clientY); if (!rel) return;
        var done = false, fin = function () { if (done) return; done = true; rel(); offs.forEach(function (f) { f(); }); };
        var offs = [R.on(w, 'pointerup', fin), R.on(w, 'pointercancel', fin), R.on(host, 'pointerleave', fin)];
      });
      R.on(d, 'keydown', '[data-ripple]', function (e, host) { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat && e.target === host) R.ripple(host); });
    }
  });

  /* ---------- Click spark ---------- */
  R.define('click-spark', {
    selector: '[data-click-spark]',
    mount: function (el) {
      if (R.reducedMotion) return;
      var o = R.opts(el, { sparkColor: '', sparkCount: 8, sparkSize: 12, sparkRadius: 22, sparkDuration: 450, sparkWidth: 2 });
      var unpos = ensurePositioned(el);
      var cv = canvasFor(el, 'spark-canvas'), ctx = cv.ctx, sparks = [], raf = 0, color = resolveColor(el, o.sparkColor || el.getAttribute('data-click-spark') || '');
      function frame(t) {
        var sz = cv.size(); ctx.clearRect(0, 0, sz.w, sz.h);
        sparks = sparks.filter(function (s) {
          var k = (t - s.t) / o.sparkDuration; if (k >= 1) return false;
          var e = 1 - Math.pow(1 - k, 3), dist = e * o.sparkRadius * s.m, len = o.sparkSize * (1 - e) * s.m;
          ctx.strokeStyle = color; ctx.lineWidth = o.sparkWidth; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(s.x + s.cos * dist, s.y + s.sin * dist);
          ctx.lineTo(s.x + s.cos * (dist + len), s.y + s.sin * (dist + len));
          ctx.stroke();
          return true;
        });
        raf = sparks.length ? requestAnimationFrame(frame) : 0;
      }
      var offs = [
        R.on(el, 'pointerdown', function (e) {
          var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, now = performance.now();
          for (var i = 0; i < o.sparkCount; i++) { var a = Math.PI * 2 * i / o.sparkCount; sparks.push({ x: x, y: y, cos: Math.cos(a), sin: Math.sin(a), t: now, m: 0.85 + Math.random() * 0.3 }); }
          if (!raf) raf = requestAnimationFrame(frame);
        }),
        R.on(d.documentElement, 'ranj:theme', function () { color = resolveColor(el, o.sparkColor || el.getAttribute('data-click-spark') || ''); })
      ];
      return function () { offs.forEach(function (f) { f(); }); cancelAnimationFrame(raf); cv.destroy(); unpos(); };
    }
  });

  /* ---------- Confetti ---------- */
  var CF = { canvas: null, ctx: null, parts: [], raf: 0, w: 0, h: 0, waiters: [] };
  var DEFAULT_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#22d3ee'];
  function cfResize() {
    if (!CF.canvas) return;
    var dpr = Math.min(2, w.devicePixelRatio || 1);
    CF.w = w.innerWidth; CF.h = w.innerHeight;
    CF.canvas.width = Math.round(CF.w * dpr); CF.canvas.height = Math.round(CF.h * dpr);
    CF.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function cfEnsure() {
    if (CF.canvas && CF.canvas.isConnected) return;
    CF.canvas = d.createElement('canvas'); CF.canvas.className = 'confetti-canvas'; CF.canvas.setAttribute('aria-hidden', 'true');
    d.body.appendChild(CF.canvas); CF.ctx = CF.canvas.getContext('2d');
    cfResize(); w.addEventListener('resize', cfResize);
  }
  function star(ctx, r) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) { var rr = i % 2 ? r * 0.45 : r, a = Math.PI / 5 * i - Math.PI / 2; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill();
  }
  function cfFrame(t) {
    var ctx = CF.ctx; ctx.clearRect(0, 0, CF.w, CF.h);
    var last = CF.last || t, k = Math.min(3, (t - last) / 16.667); CF.last = t;
    CF.parts = CF.parts.filter(function (p) {
      p.tick += k;
      p.x += (Math.cos(p.angle) * p.v + p.drift) * k;
      p.y += (Math.sin(p.angle) * p.v + p.gravity) * k;
      p.v *= Math.pow(p.decay, k);
      p.wobble += p.ws * k; p.tilt += p.ts * k;
      var life = p.tick / p.ticks; if (life >= 1 || p.y > CF.h + 60) return false;
      ctx.save();
      ctx.globalAlpha = life > 0.7 ? 1 - (life - 0.7) / 0.3 : 1;
      ctx.translate(p.x + Math.cos(p.wobble) * 4 * p.scalar, p.y + Math.sin(p.wobble) * 2 * p.scalar);
      ctx.rotate(p.tilt);
      ctx.scale(1, Math.cos(p.wobble * 1.3) || 0.05);
      ctx.fillStyle = p.color;
      var s = p.size;
      if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2); ctx.fill(); }
      else if (p.shape === 'strip') ctx.fillRect(-s * 0.2, -s * 0.9, s * 0.4, s * 1.8);
      else if (p.shape === 'star') star(ctx, s * 0.7);
      else if (p.shape === 'square') ctx.fillRect(-s / 2, -s / 2, s, s * 0.7);
      else { ctx.font = (s * 2) + 'px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(p.shape, 0, 0); }
      ctx.restore();
      return true;
    });
    if (CF.parts.length) CF.raf = requestAnimationFrame(cfFrame);
    else {
      CF.raf = 0; CF.last = 0;
      w.removeEventListener('resize', cfResize);
      if (CF.canvas) { CF.canvas.remove(); CF.canvas = null; }
      var ws = CF.waiters; CF.waiters = []; ws.forEach(function (f) { f(); });
    }
  }
  /**
   * Ranj.confetti({ x, y, particleCount, angle, spread, startVelocity, decay, gravity, drift, ticks, colors, shapes, scalar })
   * x/y: 0..1 fractions of the viewport, or px values when > 1. Returns a Promise resolved when particles settle.
   */
  function confetti(opts) {
    var o = opts || {};
    if (R.reducedMotion && !o.force) return Promise.resolve();
    cfEnsure();
    var count = o.particleCount == null ? 80 : o.particleCount, spread = o.spread == null ? 60 : o.spread;
    var angle = o.angle == null ? 90 : o.angle, vel = o.startVelocity == null ? 45 : o.startVelocity;
    var colors = o.colors || DEFAULT_COLORS, shapes = o.shapes || ['square', 'circle', 'strip'], scalar = o.scalar || 1;
    var ox = o.x == null ? (o.origin && o.origin.x != null ? o.origin.x : 0.5) : o.x, oy = o.y == null ? (o.origin && o.origin.y != null ? o.origin.y : 0.6) : o.y;
    var px = ox > 1 ? ox : ox * CF.w, py = oy > 1 ? oy : oy * CF.h;
    for (var i = 0; i < count; i++) {
      var a = -(angle + (Math.random() - 0.5) * spread) * Math.PI / 180;
      CF.parts.push({
        x: px, y: py, angle: a, v: vel * (0.5 + Math.random() * 0.5) * 0.55,
        decay: o.decay == null ? 0.92 : o.decay, gravity: (o.gravity == null ? 1 : o.gravity) * 2.4, drift: o.drift || 0,
        ticks: (o.ticks || 200) * (0.8 + Math.random() * 0.4), tick: 0,
        color: colors[(Math.random() * colors.length) | 0], shape: shapes[(Math.random() * shapes.length) | 0],
        size: (6 + Math.random() * 6) * scalar, scalar: scalar,
        wobble: Math.random() * 10, ws: 0.05 + Math.random() * 0.1, tilt: Math.random() * Math.PI, ts: (Math.random() - 0.5) * 0.3
      });
    }
    if (!CF.raf) CF.raf = requestAnimationFrame(cfFrame);
    return new Promise(function (res) { CF.waiters.push(res); });
  }
  confetti.reset = function () { CF.parts = []; };
  confetti.burst = function (el, o) {
    var r = el.getBoundingClientRect();
    return confetti(Object.assign({ x: r.left + r.width / 2 || 1.01, y: r.top + r.height / 2 || 1.01, particleCount: 70, spread: 70, startVelocity: 38 }, o || {}));
  };
  confetti.realistic = function (o) {
    o = o || {}; var base = Object.assign({ y: 0.7 }, o), n = o.particleCount || 200;
    return Promise.all([
      confetti(Object.assign({}, base, { particleCount: n * 0.25 | 0, spread: 26, startVelocity: 55 })),
      confetti(Object.assign({}, base, { particleCount: n * 0.2 | 0, spread: 60 })),
      confetti(Object.assign({}, base, { particleCount: n * 0.35 | 0, spread: 100, decay: 0.91, scalar: 0.8 })),
      confetti(Object.assign({}, base, { particleCount: n * 0.1 | 0, spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })),
      confetti(Object.assign({}, base, { particleCount: n * 0.1 | 0, spread: 120, startVelocity: 45 }))
    ]);
  };
  confetti.fireworks = function (o) {
    o = o || {}; var dur = o.duration || 3000, end = performance.now() + dur;
    return new Promise(function (res) {
      (function shot() {
        var left = end - performance.now(); if (left <= 0) { res(); return; }
        var n = Math.max(12, 50 * (left / dur)) | 0;
        [[0.1, 0.3], [0.7, 0.9]].forEach(function (rg) {
          confetti({ particleCount: n, spread: 360, startVelocity: 30, ticks: 70, gravity: 0.6, decay: 0.94, x: rg[0] + Math.random() * (rg[1] - rg[0]), y: Math.random() * 0.4 + 0.05, colors: o.colors, shapes: o.shapes || ['circle', 'square'], force: o.force });
        });
        setTimeout(shot, 260);
      })();
    });
  };
  confetti.schoolPride = function (o) {
    o = o || {}; var end = performance.now() + (o.duration || 2500), colors = o.colors || ['#6366f1', '#f8fafc', '#f59e0b'];
    return new Promise(function (res) {
      (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, x: 0, y: 0.65, startVelocity: 60, colors: colors, force: o.force });
        confetti({ particleCount: 3, angle: 120, spread: 55, x: 1, y: 0.65, startVelocity: 60, colors: colors, force: o.force });
        if (performance.now() < end) requestAnimationFrame(frame); else res();
      })();
    });
  };
  confetti.stars = function (o) {
    o = o || {};
    var b = Object.assign({ spread: 360, ticks: 60, gravity: 0, decay: 0.94, startVelocity: 30, shapes: ['star'], colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'] }, o);
    confetti(Object.assign({}, b, { particleCount: 40, scalar: 1.2 }));
    return confetti(Object.assign({}, b, { particleCount: 12, scalar: 0.75, shapes: ['circle'] }));
  };
  confetti.emoji = function (emoji, o) { return confetti(Object.assign({ shapes: [].concat(emoji || '🎉'), particleCount: 30, scalar: 1.6, spread: 100 }, o || {})); };
  R.confetti = confetti;
  R.define('confetti', {
    setup: function () {
      R.on(d, 'click', '[data-confetti]', function (e, el) {
        var r = el.getBoundingClientRect(), x = (r.left + r.width / 2) / w.innerWidth, y = (r.top + r.height / 2) / w.innerHeight;
        var preset = el.getAttribute('data-confetti'), colors = el.getAttribute('data-confetti-colors');
        var o = { x: x, y: y, colors: colors ? colors.split(',').map(function (s) { return s.trim(); }) : undefined };
        var p;
        if (preset === 'fireworks') p = confetti.fireworks(o);
        else if (preset === 'pride' || preset === 'school-pride') p = confetti.schoolPride(o);
        else if (preset === 'realistic') p = confetti.realistic(o);
        else if (preset === 'stars') p = confetti.stars(o);
        else if (preset && preset.length <= 4 && /[^\x00-\x7F]/.test(preset)) p = confetti.emoji(preset, o);
        else p = confetti(Object.assign({ particleCount: 90, spread: 75, startVelocity: 40 }, o));
        R.emit(el, 'confetti', { preset: preset || 'burst', done: p });
      });
    }
  });

  /* ---------- Cursor follower (opt-in, scoped) ---------- */
  var HOVER_SEL = 'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor], [data-cursor-text]';
  R.define('cursor-follower', {
    selector: '.cursor-follower',
    mount: function (el) {
      var o = R.opts(el, { variant: 'ring', scope: 'parent', hide: true, smoothing: 0.16, force: false });
      if ((coarse.matches || R.reducedMotion) && !o.force) return;
      var page = o.scope === 'page', scope = page ? d.documentElement : el.parentElement;
      if (!scope) return;
      el.setAttribute('aria-hidden', 'true'); el.setAttribute('data-scope', page ? 'page' : 'parent');
      var unpos = page ? function () {} : ensurePositioned(scope);
      if (o.hide) scope.classList.add('cursor-none');
      var x = -100, y = -100, rx = -100, ry = -100, on = false, made = [];
      function add(cls, html) { var n = d.createElement('div'); n.className = cls; if (html) n.innerHTML = html; el.appendChild(n); made.push(n); return n; }
      var v = o.variant, dot, ring, label, blobs = [], cv = null, pts = [], parts = [], hue = 0, color = resolveColor(el, getComputedStyle(el).getPropertyValue('--cursor-color').trim());
      if (v === 'ring' || v === 'dot') {
        dot = add('cf-dot');
        if (v === 'ring') { ring = add('cf-ring', '<b></b><span class="cf-label"></span>'); label = R.$('.cf-label', ring); }
      } else if (v === 'blob') {
        var gid = R.uid('goo');
        add('cf-goo', '<svg width="0" height="0" style="position:absolute"><filter id="' + gid + '"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -9"/></filter></svg>');
        var wrap = add('cf-blob'); wrap.style.filter = 'url(#' + gid + ')';
        [56, 40, 28].forEach(function (s, i) { var b = d.createElement('span'); b.style.width = b.style.height = s + 'px'; b.style.margin = (-s / 2) + 'px 0 0 ' + (-s / 2) + 'px'; wrap.appendChild(b); blobs.push({ el: b, x: -100, y: -100, k: [0.28, 0.16, 0.1][i] }); });
      } else {
        cv = canvasFor(el, 'cf-canvas');
      }
      function local(e) {
        if (page) return { x: e.clientX, y: e.clientY };
        var r = scope.getBoundingClientRect(); return { x: e.clientX - r.left + (el.offsetParent === scope ? 0 : 0), y: e.clientY - r.top };
      }
      var lastMove = { x: 0, y: 0 };
      var offs = [
        R.on(page ? d : scope, 'pointermove', function (e) {
          if (e.pointerType === 'touch') return;
          var p = local(e);
          if (!on) { rx = p.x; ry = p.y; blobs.forEach(function (b) { b.x = p.x; b.y = p.y; }); }
          lastMove = { x: p.x - x, y: p.y - y };
          x = p.x; y = p.y; on = true; el.setAttribute('data-cf-on', '');
          var t = e.target.closest ? e.target.closest(HOVER_SEL) : null;
          if (t && !scope.contains(t)) t = null;
          var txt = t && t.getAttribute('data-cursor-text');
          el.toggleAttribute('data-cf-hover', !!t);
          el.toggleAttribute('data-cf-text', !!txt);
          if (label && txt && label.textContent !== txt) label.textContent = txt;
          if (v === 'trail') pts.push({ x: x, y: y, t: performance.now() });
          if (v === 'splash') {
            var sp = Math.min(40, Math.hypot(lastMove.x, lastMove.y));
            for (var i = 0; i < Math.ceil(sp / 6); i++) parts.push({ x: x, y: y, vx: lastMove.x * 0.15 + (Math.random() - 0.5) * 2, vy: lastMove.y * 0.15 + (Math.random() - 0.5) * 2, r: 6 + Math.random() * 10 + sp * 0.3, life: 1, h: (hue += 2) % 360 });
          }
        }),
        R.on(page ? d.documentElement : scope, 'pointerleave', function () { on = false; el.removeAttribute('data-cf-on'); }),
        R.on(page ? d : scope, 'pointerdown', function () { el.setAttribute('data-cf-down', ''); }),
        R.on(w, 'pointerup', function () { el.removeAttribute('data-cf-down'); })
      ];
      offs.push(R.loop(page ? null : scope, function (t, dt) {
        var k = 1 - Math.pow(1 - o.smoothing, dt / 16.667);
        rx += (x - rx) * k; ry += (y - ry) * k;
        if (dot) dot.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
        if (ring) ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
        if (blobs.length) blobs.forEach(function (b) { var kk = 1 - Math.pow(1 - b.k, dt / 16.667); b.x += (x - b.x) * kk; b.y += (y - b.y) * kk; b.el.style.transform = 'translate3d(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px,0)'; });
        if (cv) {
          var sz = cv.size(), ctx = cv.ctx; ctx.clearRect(0, 0, sz.w, sz.h);
          if (v === 'trail') {
            var now = performance.now(); pts = pts.filter(function (p) { return now - p.t < 450; });
            if (pts.length > 1) {
              ctx.lineCap = 'round'; ctx.lineJoin = 'round';
              for (var i = 1; i < pts.length; i++) {
                var a = 1 - (now - pts[i].t) / 450;
                ctx.strokeStyle = color; ctx.globalAlpha = a; ctx.lineWidth = 2 + a * 8;
                ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
              }
              ctx.globalAlpha = 1;
            }
            if (on) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); }
          } else {
            ctx.globalCompositeOperation = 'lighter';
            parts = parts.filter(function (p) {
              p.life -= dt / 900; if (p.life <= 0) return false;
              p.x += p.vx; p.y += p.vy; p.vx *= 0.94; p.vy *= 0.94; p.r *= 1.012;
              var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
              g.addColorStop(0, 'hsla(' + p.h + ',90%,62%,' + (p.life * 0.5).toFixed(3) + ')'); g.addColorStop(1, 'hsla(' + p.h + ',90%,62%,0)');
              ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
              return true;
            });
            ctx.globalCompositeOperation = 'source-over';
          }
        }
      }));
      return function () { offs.forEach(function (f) { f(); }); made.forEach(function (n) { n.remove(); }); if (cv) cv.destroy(); scope.classList.remove('cursor-none'); unpos(); };
    }
  });

  /* ---------- Pixel transition ---------- */
  R.define('pixel-transition', {
    selector: '.pixel-transition',
    mount: function (el) {
      var o = R.opts(el, { grid: 10, duration: 700, trigger: 'hover' });
      var grid = d.createElement('div'); grid.className = 'pt-grid'; grid.setAttribute('aria-hidden', 'true');
      el.appendChild(grid);
      var cells = [], cols = o.grid, rows = o.grid;
      function build() {
        var wd = el.offsetWidth || 1, ht = el.offsetHeight || 1;
        cols = o.grid; rows = Math.max(1, Math.round(o.grid * ht / wd));
        if (cells.length === cols * rows) return;
        grid.innerHTML = ''; cells = [];
        grid.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)'; grid.style.gridTemplateRows = 'repeat(' + rows + ',1fr)';
        for (var i = 0; i < cols * rows; i++) { var c = d.createElement('i'); grid.appendChild(c); cells.push(c); }
      }
      build();
      var ro = 'ResizeObserver' in w ? new ResizeObserver(build) : null; if (ro) ro.observe(el);
      var raf = 0, active = false;
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      function shuffle() { var a = cells.slice(); for (var i = a.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
      function run(on) {
        if (on === active) return; active = on;
        cancelAnimationFrame(raf);
        if (R.reducedMotion) { el.setAttribute('data-state', on ? 'active' : ''); return; }
        var inOrder = shuffle(), outOrder = shuffle(), half = o.duration / 2, t0 = 0, swapped = false;
        cells.forEach(function (c) { c.classList.remove('on'); });
        function f(t) {
          if (!t0) t0 = t;
          var e = t - t0;
          if (e < half) { var n = Math.ceil(inOrder.length * e / half); for (var i = 0; i < n; i++) inOrder[i].classList.add('on'); }
          else {
            if (!swapped) { swapped = true; cells.forEach(function (c) { c.classList.add('on'); }); el.setAttribute('data-state', on ? 'active' : ''); R.emit(el, 'change', { active: on }); }
            var m = Math.ceil(outOrder.length * Math.min(1, (e - half) / half)); for (var j = 0; j < m; j++) outOrder[j].classList.remove('on');
          }
          if (e < o.duration) raf = requestAnimationFrame(f); else cells.forEach(function (c) { c.classList.remove('on'); });
        }
        raf = requestAnimationFrame(f);
      }
      var offs = [
        R.on(el, 'click', function () { if (o.trigger === 'click' || coarse.matches) run(!active); }),
        R.on(el, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); run(!active); } })
      ];
      if (o.trigger === 'hover') offs.push(
        R.on(el, 'pointerenter', function (e) { if (e.pointerType !== 'touch') run(true); }),
        R.on(el, 'pointerleave', function (e) { if (e.pointerType !== 'touch') run(false); })
      );
      return function () { offs.forEach(function (f) { f(); }); cancelAnimationFrame(raf); if (ro) ro.disconnect(); grid.remove(); el.removeAttribute('data-state'); };
    }
  });
})(window.Ranj);

;
/* Ranj UI — Motion
 * reveal, parallax (scroll + pointer), marquee, animated-list, stack-cards, flip-card, orbit, dock,
 * word-globe, scroll-progress, sticky-cards, flowing-menu
 */
(function (R) {
  'use strict';
  var d = document;

  /* ---------- private helpers ---------- */
  function scrollRoot(el) {
    var p = el.parentElement;
    while (p && p !== d.body && p !== d.documentElement) {
      var s = getComputedStyle(p);
      if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 1) return p;
      p = p.parentElement;
    }
    return null;
  }
  function viewRect(root) {
    if (root) return root.getBoundingClientRect();
    var h = window.innerHeight; return { top: 0, bottom: h, height: h };
  }
  function onScroll(fn) {
    var raf = 0, h = function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; fn(); }); };
    window.addEventListener('scroll', h, { capture: true, passive: true });
    window.addEventListener('resize', h);
    h();
    return function () { cancelAnimationFrame(raf); window.removeEventListener('scroll', h, { capture: true, passive: true }); window.removeEventListener('resize', h); };
  }
  function ro(el, fn) {
    if (!('ResizeObserver' in window)) return function () {};
    var raf = 0, o = new ResizeObserver(function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(fn); });
    [].concat(el).forEach(function (e) { o.observe(e); });
    return function () { cancelAnimationFrame(raf); o.disconnect(); };
  }
  function cssPx(el, name, fallback) {
    var v = getComputedStyle(el).getPropertyValue(name).trim();
    if (!v) return fallback;
    var n = parseFloat(v);
    if (/rem$/.test(v)) n *= parseFloat(getComputedStyle(d.documentElement).fontSize) || 16;
    return isNaN(n) ? fallback : n;
  }
  function stripClone(node) {
    node.setAttribute('aria-hidden', 'true');
    node.setAttribute('inert', '');
    node.removeAttribute('id');
    R.$$('[id]', node).forEach(function (n) { n.removeAttribute('id'); });
    R.$$('a,button,input,select,textarea,[tabindex]', node).forEach(function (n) { n.setAttribute('tabindex', '-1'); });
    return node;
  }

  /* ---------- Reveal ---------- */
  R.define('reveal', {
    selector: '[data-reveal]',
    mount: function (el) {
      if (R.reducedMotion) return;
      var o = R.opts(el, { revealDelay: 0, revealDuration: 0, revealOnce: true, revealThreshold: 0.15, revealDistance: '' });
      var stag = el.hasAttribute('data-reveal-stagger'), sv = parseFloat(el.getAttribute('data-reveal-stagger'));
      var kids = stag ? Array.prototype.slice.call(el.children) : [];
      kids.forEach(function (c, i) { c.style.setProperty('--ri', i); });
      if (stag && !isNaN(sv)) el.style.setProperty('--reveal-stagger', sv + 'ms');
      if (o.revealDelay) el.style.setProperty('--reveal-delay', o.revealDelay + 'ms');
      if (o.revealDuration) el.style.setProperty('--reveal-dur', o.revealDuration + 'ms');
      if (o.revealDistance) el.style.setProperty('--reveal-distance', o.revealDistance);
      el.setAttribute('data-reveal-state', 'out');
      var t = 0;
      function show() {
        el.setAttribute('data-reveal-state', 'in');
        clearTimeout(t);
        if (o.revealOnce) {
          var cs = getComputedStyle(el);
          var total = parseFloat(cs.getPropertyValue('--reveal-dur')) + parseFloat(cs.getPropertyValue('--reveal-delay')) + (stag ? kids.length * (parseFloat(cs.getPropertyValue('--reveal-stagger')) || 90) : 0);
          t = setTimeout(function () { el.setAttribute('data-reveal-state', 'done'); R.emit(el, 'reveal', {}); }, (total || 900) + 80);
        } else R.emit(el, 'reveal', {});
      }
      var stop = R.inView(el, show, { threshold: o.revealThreshold, repeat: !o.revealOnce, rootMargin: '0px 0px -6% 0px', onLeave: o.revealOnce ? null : function () { clearTimeout(t); el.setAttribute('data-reveal-state', 'out'); } });
      return function () { stop(); clearTimeout(t); el.removeAttribute('data-reveal-state'); };
    }
  });

  /* ---------- Parallax: scroll ---------- */
  R.define('parallax', {
    selector: '[data-parallax]',
    mount: function (el) {
      if (R.reducedMotion) return;
      var speed = parseFloat(el.getAttribute('data-parallax')); if (isNaN(speed)) speed = 0.2;
      var axis = el.getAttribute('data-parallax-axis') || 'y';
      var ref = el.parentElement || el, root = null;
      var stop = onScroll(function () {
        if (!root || !root.isConnected) root = scrollRoot(el);
        var vr = viewRect(root), r = ref.getBoundingClientRect();
        var off = (r.top + r.height / 2) - (vr.top + vr.height / 2);
        var v = (-off * speed).toFixed(2);
        el.style.transform = axis === 'x' ? 'translate3d(' + v + 'px,0,0)' : 'translate3d(0,' + v + 'px,0)';
      });
      return function () { stop(); el.style.transform = ''; };
    }
  });

  /* ---------- Parallax: pointer layers ---------- */
  R.define('parallax-scene', {
    selector: '.parallax-scene',
    mount: function (el) {
      if (R.reducedMotion) return;
      var o = R.opts(el, { max: 40, sceneTilt: 0 });
      var layers = R.$$('[data-depth]', el).map(function (n) { return { el: n, depth: parseFloat(n.getAttribute('data-depth')) || 0 }; });
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      function frame() {
        cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
        layers.forEach(function (l) { l.el.style.transform = 'translate3d(' + (cx * l.depth * o.max).toFixed(2) + 'px,' + (cy * l.depth * o.max).toFixed(2) + 'px,0)'; });
        if (o.sceneTilt) el.style.transform = 'perspective(1000px) rotateX(' + (-cy * o.sceneTilt).toFixed(2) + 'deg) rotateY(' + (cx * o.sceneTilt).toFixed(2) + 'deg)';
        raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(frame) : 0;
      }
      function kick() { if (!raf) raf = requestAnimationFrame(frame); }
      var offs = [
        R.on(el, 'pointermove', function (e) { var r = el.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ty = ((e.clientY - r.top) / r.height - 0.5) * 2; kick(); }),
        R.on(el, 'pointerleave', function () { tx = 0; ty = 0; kick(); })
      ];
      return function () { offs.forEach(function (f) { f(); }); cancelAnimationFrame(raf); layers.forEach(function (l) { l.el.style.transform = ''; }); el.style.transform = ''; };
    }
  });

  /* ---------- Marquee ---------- */
  R.define('marquee', {
    selector: '.marquee',
    mount: function (el) {
      var o = R.opts(el, { speed: 0, clones: 0 });
      var content = R.$('.marquee-content', el);
      if (!content) {
        content = d.createElement('div'); content.className = 'marquee-content';
        while (el.firstChild) content.appendChild(el.firstChild);
        el.appendChild(content);
      }
      var vertical = el.classList.contains('marquee-vertical');
      var clones = [], lastKey = '';
      function fill() {
        var cs = getComputedStyle(el), gap = parseFloat(vertical ? cs.rowGap : cs.columnGap) || 0;
        var size = vertical ? content.offsetHeight : content.offsetWidth;
        // measure the box without clones so content-sized containers can't feed back into more clones
        clones.forEach(function (c) { c.style.position = 'absolute'; });
        var box = vertical ? el.clientHeight : el.clientWidth;
        clones.forEach(function (c) { c.style.position = ''; });
        if (!size) return;
        var need = o.clones || Math.min(24, Math.max(1, Math.ceil(box / (size + gap))));
        var key = need + ':' + size;
        if (key !== lastKey) {
          lastKey = key;
          while (clones.length > need) clones.pop().remove();
          while (clones.length < need) { var c = stripClone(content.cloneNode(true)); el.appendChild(c); clones.push(c); }
          // restart every copy together so clones stay in phase with the original
          var all = [content].concat(clones);
          all.forEach(function (n) { n.style.animation = 'none'; });
          void el.offsetWidth;
          all.forEach(function (n) { n.style.animation = ''; });
        }
        if (o.speed > 0) el.style.setProperty('--duration', ((size + gap) / o.speed).toFixed(2) + 's');
      }
      fill();
      var stopRo = ro([el, content], fill);
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { if (el.isConnected) fill(); });
      return function () { stopRo(); clones.forEach(function (c) { c.remove(); }); };
    }
  });

  /* ---------- Animated list (notification feed) ---------- */
  R.define('animated-list', {
    selector: '.animated-list',
    mount: function (el) {
      var o = R.opts(el, { interval: 1100, loop: false, max: 0, trigger: 'view', delay: 200 });
      var up = el.classList.contains('animated-list-up');
      var items = Array.prototype.slice.call(el.children);
      var slots = items.map(function (it) {
        var s = d.createElement('div'); s.className = 'al-slot';
        var inner = d.createElement('div'); inner.className = 'al-inner';
        it.classList.add('al-item');
        el.insertBefore(s, it); inner.appendChild(it); s.appendChild(inner);
        s.setAttribute('data-al', 'hidden');
        return s;
      });
      var max = o.max || (o.loop ? Math.max(1, Math.min(slots.length - 1, 4)) : slots.length);
      var visible = [], k = 0, t = 0, timers = [], dur = 600;
      function enter(s) {
        if (up) el.appendChild(s); else el.insertBefore(s, el.firstChild);
        s.setAttribute('data-al', 'enter'); void s.offsetHeight;
        requestAnimationFrame(function () { s.removeAttribute('data-al'); });
        if (up) visible.push(s); else visible.unshift(s);
        if (visible.length > max) {
          var old = up ? visible.shift() : visible.pop();
          old.setAttribute('data-al', 'exit');
          timers.push(setTimeout(function () { if (old.getAttribute('data-al') === 'exit') old.setAttribute('data-al', 'hidden'); }, dur));
        }
        R.emit(el, 'item', { item: s.firstChild.firstChild });
      }
      function tick() {
        if (!o.loop && k >= slots.length) { R.emit(el, 'done', {}); return; }
        var s = slots[k % slots.length]; k++;
        if (visible.indexOf(s) < 0) enter(s);
        t = setTimeout(tick, o.interval);
      }
      if (R.reducedMotion) {
        slots.slice(0, max).forEach(function (s) { s.removeAttribute('data-al'); visible.push(s); });
      } else {
        var stopView = o.trigger === 'load' ? (t = setTimeout(tick, o.delay), function () {}) : R.inView(el, function () { t = setTimeout(tick, o.delay); });
      }
      return {
        destroy: function () {
          clearTimeout(t); timers.forEach(clearTimeout); if (stopView) stopView();
          items.forEach(function (it, i) { it.classList.remove('al-item'); el.insertBefore(it, slots[i]); });
          slots.forEach(function (s) { s.remove(); });
        },
        /** add(node) — push a new item to the feed right now */
        add: function (node) {
          var s = d.createElement('div'); s.className = 'al-slot';
          var inner = d.createElement('div'); inner.className = 'al-inner';
          node.classList.add('al-item'); inner.appendChild(node); s.appendChild(inner);
          enter(s);
        },
        pause: function () { clearTimeout(t); },
        resume: function () { clearTimeout(t); t = setTimeout(tick, o.interval); }
      };
    }
  });

  /* ---------- Stack cards (swipe deck) ---------- */
  R.define('stack-cards', {
    selector: '.stack-cards',
    mount: function (el) {
      var o = R.opts(el, { loop: true, threshold: 110, visible: 3 });
      var cards = R.$$(':scope > .stack-card', el);
      var order = cards.slice();
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'group');
      if (!el.hasAttribute('aria-roledescription')) el.setAttribute('aria-roledescription', 'card stack');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Card stack, use left and right arrow keys to swipe');
      function layout() {
        order.forEach(function (c, k) {
          c.style.setProperty('--sc-i', Math.min(k, o.visible));
          c.style.zIndex = String(order.length - k);
          c.toggleAttribute('data-sc-top', k === 0);
          c.setAttribute('aria-hidden', k === 0 ? 'false' : 'true');
          if (k > o.visible) c.setAttribute('data-sc-depth', 'hidden'); else c.removeAttribute('data-sc-depth');
        });
      }
      layout();
      var drag = null, busy = false;
      function fling(dir, card, vy) {
        card = card || order[0]; if (!card || busy) return;
        busy = true;
        var w = el.offsetWidth || 300;
        card.removeAttribute('data-sc-dragging');
        card.setAttribute('data-sc-flying', '');
        card.style.transform = 'translate(' + (dir * w * 1.7) + 'px,' + ((vy || 0) * 220 - 30) + 'px) rotate(' + (dir * 28) + 'deg)';
        R.emit(el, 'swipe', { direction: dir > 0 ? 'right' : 'left', card: card, index: cards.indexOf(card) });
        setTimeout(function () {
          card.setAttribute('data-sc-dragging', '');
          card.removeAttribute('data-sc-flying');
          card.style.transform = ''; card.style.removeProperty('--sc-drag');
          order.shift();
          if (o.loop) order.push(card); else { card.setAttribute('data-sc-depth', 'hidden'); card.removeAttribute('data-sc-top'); }
          layout();
          void card.offsetWidth;
          card.removeAttribute('data-sc-dragging');
          busy = false;
          if (!order.length) R.emit(el, 'empty', {});
        }, 420);
      }
      function down(e) {
        var card = e.target.closest('.stack-card');
        if (!card || card !== order[0] || busy || e.button > 0) return;
        if (e.target.closest('button, a, input, [data-no-drag]')) return;
        drag = { card: card, x: e.clientX, y: e.clientY, dx: 0, dy: 0, hist: [[e.clientX, e.clientY, performance.now()]], id: e.pointerId };
        try { card.setPointerCapture(e.pointerId); } catch (err) {}
        card.setAttribute('data-sc-dragging', '');
      }
      function move(e) {
        if (!drag || e.pointerId !== drag.id) return;
        drag.dx = e.clientX - drag.x; drag.dy = e.clientY - drag.y;
        drag.hist.push([e.clientX, e.clientY, performance.now()]); if (drag.hist.length > 5) drag.hist.shift();
        drag.card.style.transform = 'translate(' + drag.dx + 'px,' + drag.dy + 'px) rotate(' + (drag.dx * 0.07).toFixed(2) + 'deg)';
        drag.card.style.setProperty('--sc-drag', (drag.dx / o.threshold).toFixed(3));
      }
      function upH(e) {
        if (!drag || e.pointerId !== drag.id) return;
        var g = drag; drag = null;
        var h0 = g.hist[0], h1 = g.hist[g.hist.length - 1], dt = Math.max(1, h1[2] - h0[2]);
        var vx = (h1[0] - h0[0]) / dt, vy = (h1[1] - h0[1]) / dt;
        if (Math.abs(g.dx) > o.threshold || (Math.abs(vx) > 0.55 && Math.abs(g.dx) > 24)) fling(g.dx > 0 ? 1 : -1, g.card, vy);
        else { g.card.removeAttribute('data-sc-dragging'); g.card.style.transform = ''; g.card.style.removeProperty('--sc-drag'); }
      }
      var host = el.parentElement || el;
      var offs = [
        R.on(el, 'pointerdown', down), R.on(el, 'pointermove', move), R.on(el, 'pointerup', upH), R.on(el, 'pointercancel', upH),
        R.on(el, 'keydown', function (e) { if (e.key === 'ArrowLeft') { e.preventDefault(); fling(-1); } else if (e.key === 'ArrowRight') { e.preventDefault(); fling(1); } }),
        R.on(host, 'click', '[data-swipe]', function (e, b) { fling(b.getAttribute('data-swipe') === 'left' ? -1 : 1); })
      ];
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); cards.forEach(function (c) { c.style.transform = ''; c.style.zIndex = ''; c.removeAttribute('data-sc-top'); c.removeAttribute('data-sc-depth'); c.removeAttribute('aria-hidden'); }); },
        swipe: function (dir) { fling(dir === 'left' ? -1 : 1); }
      };
    }
  });

  /* ---------- Flip card (click mode) ---------- */
  R.define('flip-card', {
    selector: '.flip-card-click',
    mount: function (el) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-pressed', 'false');
      function toggle() {
        var on = el.getAttribute('data-state') !== 'flipped';
        el.setAttribute('data-state', on ? 'flipped' : 'front'); el.setAttribute('aria-pressed', String(on));
        R.emit(el, 'flip', { flipped: on });
      }
      var offs = [
        R.on(el, 'click', function (e) { if (e.target.closest('a, button, input, select, textarea')) return; toggle(); }),
        R.on(el, 'keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); toggle(); } })
      ];
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  /* ---------- Orbit ---------- */
  R.define('orbit', {
    selector: '.orbit-ring',
    mount: function (el) {
      var o = R.opts(el, { radius: 0, duration: 0, offset: 0 });
      var items = Array.prototype.slice.call(el.children);
      items.forEach(function (it, i) {
        it.classList.add('orbit-item');
        it.style.setProperty('--a', (o.offset + 360 / items.length * i).toFixed(2) + 'deg');
        if (!it.querySelector(':scope > .orbit-counter')) {
          var c = d.createElement('span'); c.className = 'orbit-counter';
          while (it.firstChild) c.appendChild(it.firstChild);
          it.appendChild(c);
        }
      });
      if (o.duration) el.style.setProperty('--duration', o.duration + 's');
      var stop = function () {};
      if (o.radius && o.radius <= 1) {
        var host = el.closest('.orbit') || el.parentElement;
        var fit = function () { el.style.setProperty('--radius', (host.offsetWidth / 2 * o.radius).toFixed(1) + 'px'); };
        fit(); stop = ro(host, fit);
      } else if (o.radius) el.style.setProperty('--radius', o.radius + 'px');
      return function () { stop(); };
    }
  });

  /* ---------- Dock magnification ---------- */
  R.define('dock', {
    selector: '.dock',
    mount: function (el) {
      var o = R.opts(el, { distance: 150, bounce: true });
      var items = R.$$('.dock-item', el);
      var base = cssPx(el, '--dock-size', 48), max = cssPx(el, '--dock-max', 84);
      var cur = items.map(function () { return base; }), mx = null, raf = 0;
      if (!el.hasAttribute('role')) el.setAttribute('role', 'toolbar');
      function frame() {
        raf = 0;
        var rects = items.map(function (it) { return it.getBoundingClientRect(); });
        var moving = false;
        for (var i = 0; i < items.length; i++) {
          var t = base;
          if (mx !== null) {
            var c = rects[i].left + rects[i].width / 2, f = Math.max(0, 1 - Math.abs(mx - c) / o.distance);
            t = base + (max - base) * (1 - Math.cos(Math.PI * f)) / 2;
          }
          var v = cur[i] + (t - cur[i]) * 0.28;
          if (Math.abs(v - t) < 0.3) v = t; else moving = true;
          cur[i] = v;
        }
        for (var j = 0; j < items.length; j++) { items[j].style.width = items[j].style.height = cur[j].toFixed(2) + 'px'; }
        if (moving) raf = requestAnimationFrame(frame);
        else if (mx === null) { el.removeAttribute('data-dock-active'); items.forEach(function (it) { it.style.width = it.style.height = ''; }); }
      }
      function kick() { if (!raf) raf = requestAnimationFrame(frame); }
      var offs = [R.on(el, 'click', '.dock-item', function (e, it) {
        if (o.bounce && !R.reducedMotion) { it.classList.remove('dock-bounce'); void it.offsetWidth; it.classList.add('dock-bounce'); }
        it.setAttribute('data-active', '');
        R.emit(el, 'select', { item: it, label: it.getAttribute('data-label') });
      }), R.on(el, 'animationend', '.dock-item', function (e, it) { it.classList.remove('dock-bounce'); })];
      if (!R.reducedMotion) offs.push(
        R.on(el, 'pointermove', function (e) { if (e.pointerType === 'touch' && e.buttons === 0) return; mx = e.clientX; el.setAttribute('data-dock-active', ''); kick(); }),
        R.on(el, 'pointerleave', function () { mx = null; kick(); })
      );
      offs.push(R.roving(el, '.dock-item', { orientation: 'horizontal' }));
      return function () { offs.forEach(function (f) { f(); }); cancelAnimationFrame(raf); items.forEach(function (it) { it.style.width = it.style.height = ''; }); };
    }
  });

  /* ---------- Word globe ---------- */
  R.define('word-globe', {
    selector: '.word-globe',
    mount: function (el) {
      var o = R.opts(el, { words: '', speed: 1, radius: 0.78 });
      var made = [];
      if (o.words) o.words.split('|').forEach(function (w) { var s = d.createElement('span'); s.textContent = w; el.appendChild(s); made.push(s); });
      var nodes = Array.prototype.slice.call(el.children), n = nodes.length;
      if (!el.hasAttribute('role')) { el.setAttribute('role', 'list'); nodes.forEach(function (x) { if (!x.hasAttribute('role')) x.setAttribute('role', 'listitem'); }); }
      var golden = Math.PI * (3 - Math.sqrt(5));
      var pts = nodes.map(function (node, i) {
        var y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), phi = i * golden;
        return { x: Math.cos(phi) * r, y: y, z: Math.sin(phi) * r, el: node, w: 0, h: 0 };
      });
      var R0 = 120;
      function measure() { R0 = el.offsetWidth / 2 * o.radius; pts.forEach(function (p) { p.w = p.el.offsetWidth; p.h = p.el.offsetHeight; }); }
      measure();
      var auto = 0.00035 * o.speed, vx = 0, vy = auto, hover = null, dragging = null;
      function rot(ax, ay) {
        var cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
        for (var i = 0; i < n; i++) {
          var p = pts[i];
          var x = p.x * cy + p.z * sy, z = -p.x * sy + p.z * cy; // around Y
          var y = p.y * cx - z * sx; z = p.y * sx + z * cx;       // around X
          p.x = x; p.y = y; p.z = z;
        }
      }
      function render() {
        for (var i = 0; i < n; i++) {
          var p = pts[i], s = 0.6 + (p.z + 1) * 0.3, op = 0.18 + (p.z + 1) * 0.41;
          p.el.style.transform = 'translate3d(' + (p.x * R0 - p.w / 2).toFixed(1) + 'px,' + (p.y * R0 - p.h / 2).toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
          p.el.style.opacity = op.toFixed(3);
          p.el.style.zIndex = String(Math.round((p.z + 1) * 50));
          p.el.style.filter = p.z < -0.35 ? 'blur(' + ((-p.z - 0.35) * 2.2).toFixed(2) + 'px)' : '';
        }
      }
      render();
      var offs = [ro(el, function () { measure(); render(); })];
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { if (el.isConnected) { measure(); render(); } });
      if (R.reducedMotion) return function () { offs.forEach(function (f) { f(); }); made.forEach(function (m) { m.remove(); }); };
      offs.push(
        R.on(el, 'pointerdown', function (e) { dragging = { x: e.clientX, y: e.clientY, t: performance.now() }; try { el.setPointerCapture(e.pointerId); } catch (err) {} }),
        R.on(el, 'pointermove', function (e) {
          var r = el.getBoundingClientRect();
          if (dragging) {
            var now = performance.now(), dt = Math.max(8, now - dragging.t);
            vy = (e.clientX - dragging.x) / R0 / dt; vx = -(e.clientY - dragging.y) / R0 / dt;
            dragging.x = e.clientX; dragging.y = e.clientY; dragging.t = now;
          } else hover = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
        }),
        R.on(el, 'pointerup', function () { dragging = null; }),
        R.on(el, 'pointercancel', function () { dragging = null; }),
        R.on(el, 'pointerleave', function () { hover = null; })
      );
      offs.push(R.loop(el, function (t, dt) {
        if (!dragging) {
          var tx = hover ? -hover.y * 0.0016 * o.speed : 0, ty = hover ? hover.x * 0.0016 * o.speed : auto;
          vx += (tx - vx) * Math.min(1, dt / 600); vy += (ty - vy) * Math.min(1, dt / 600);
        }
        rot(vx * dt, vy * dt);
        render();
      }));
      return function () { offs.forEach(function (f) { f(); }); nodes.forEach(function (x) { x.style.transform = x.style.opacity = x.style.zIndex = x.style.filter = ''; }); made.forEach(function (m) { m.remove(); }); };
    }
  });

  /* ---------- Scroll progress (bar + ring) ---------- */
  R.define('scroll-progress', {
    selector: '.scroll-progress, .scroll-ring',
    mount: function (el) {
      var sel = el.getAttribute('data-target'), target = null, made = null;
      if (el.classList.contains('scroll-ring') && !R.$('svg', el)) {
        made = d.createElementNS('http://www.w3.org/2000/svg', 'svg');
        made.setAttribute('viewBox', '0 0 36 36'); made.setAttribute('aria-hidden', 'true');
        made.innerHTML = '<circle class="sr-track" cx="18" cy="18" r="16"/><circle class="sr-bar" cx="18" cy="18" r="16" pathLength="1"/>';
        el.insertBefore(made, el.firstChild);
      }
      if (el.hasAttribute('data-value')) { // static ring / bar
        var v = parseFloat(el.getAttribute('data-value')) || 0; if (v > 1) v /= 100;
        el.style.setProperty('--progress', v);
        return function () { if (made) made.remove(); };
      }
      if (!el.hasAttribute('role')) { el.setAttribute('role', 'progressbar'); el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', '100'); el.setAttribute('aria-label', el.getAttribute('aria-label') || 'Reading progress'); }
      var last = -1;
      var stop = onScroll(function () {
        if (!target || !target.isConnected) target = sel ? (sel === 'parent' ? scrollRoot(el) : d.querySelector(sel)) : scrollRoot(el);
        var p;
        if (target && target.scrollHeight > target.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(target).overflowY)) {
          p = target.scrollTop / (target.scrollHeight - target.clientHeight);
        } else if (target) {
          var r = target.getBoundingClientRect(), vh = window.innerHeight;
          p = R.clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
        } else {
          var de = d.documentElement; p = (window.scrollY || de.scrollTop) / Math.max(1, de.scrollHeight - window.innerHeight);
        }
        p = R.clamp(Math.round(p * 1000) / 1000, 0, 1);
        if (p !== last) { last = p; el.style.setProperty('--progress', p); el.setAttribute('aria-valuenow', Math.round(p * 100)); }
      });
      var offClick = el.hasAttribute('data-scroll-top') ? R.on(el, 'click', function () { (target && target.scrollTo ? target : window).scrollTo({ top: 0, behavior: R.reducedMotion ? 'auto' : 'smooth' }); }) : function () {};
      return function () { stop(); offClick(); if (made) made.remove(); };
    }
  });

  /* ---------- Sticky stacking cards ---------- */
  R.define('sticky-cards', {
    selector: '.sticky-cards',
    mount: function (el) {
      var cards = R.$$(':scope > .sticky-card', el);
      cards.forEach(function (c, i) { c.style.setProperty('--sk-i', i); });
      if (R.reducedMotion) return function () {};
      var root = null, last = [];
      var stop = onScroll(function () {
        if (!root || !root.isConnected) root = scrollRoot(el);
        var vr = viewRect(root), n = cards.length;
        var rects = cards.map(function (c) { return c.getBoundingClientRect(); });
        var tops = cards.map(function (c) { return parseFloat(getComputedStyle(c).top) || 0; });
        var arrive = [];
        for (var j = 0; j < n; j++) {
          if (j === 0) { arrive.push(0); continue; }
          var stick = vr.top + tops[j], H = rects[j - 1].height || 1;
          arrive.push(R.clamp(1 - (rects[j].top - stick) / H, 0, 1));
        }
        for (var i = 0; i < n; i++) {
          var depth = 0; for (var k = i + 1; k < n; k++) depth += arrive[k];
          depth = Math.round(depth * 1000) / 1000;
          if (last[i] !== depth) { last[i] = depth; cards[i].style.setProperty('--depth', depth); }
        }
      });
      return function () { stop(); cards.forEach(function (c) { c.style.removeProperty('--depth'); }); };
    }
  });

  /* ---------- Flowing menu ---------- */
  R.define('flowing-menu', {
    selector: '.flowing-menu',
    mount: function (el) {
      var items = R.$$('.fm-item', el), bands = [];
      items.forEach(function (it) {
        var text = it.getAttribute('data-text') || it.textContent.trim();
        var img = it.getAttribute('data-image'), grad = it.getAttribute('data-gradient');
        var chip = img ? 'url("' + img.replace(/"/g, '') + '")' : grad || '';
        var band = d.createElement('div'); band.className = 'fm-band'; band.setAttribute('aria-hidden', 'true');
        var unit = '<span>' + R.esc(text) + '<i' + (chip ? ' style="--fm-chip:' + R.esc(chip) + '"' : '') + '></i></span>';
        var track = '<div class="fm-track">' + unit + unit + unit + unit + '</div>';
        band.innerHTML = track + track;
        it.appendChild(band); bands.push(band);
      });
      function edge(it, e) { var r = it.getBoundingClientRect(); return (e.clientY - r.top) < r.height / 2 ? -1 : 1; }
      function slide(band, from, to) {
        band.removeAttribute('data-anim');
        if (from !== null) { band.style.transform = 'translateY(' + (from * 101) + '%)'; void band.offsetWidth; }
        band.setAttribute('data-anim', '');
        band.style.transform = 'translateY(' + (to * 101) + '%)';
      }
      var offs = [
        R.on(el, 'pointerover', '.fm-item', function (e, it) {
          if (it.contains(e.relatedTarget)) return;
          var b = R.$('.fm-band', it); slide(b, R.reducedMotion ? 0 : edge(it, e), 0);
        }),
        R.on(el, 'pointerout', '.fm-item', function (e, it) {
          if (it.contains(e.relatedTarget)) return;
          var b = R.$('.fm-band', it); slide(b, null, R.reducedMotion ? 1 : edge(it, e));
        }),
        R.on(el, 'focusin', '.fm-item', function (e, it) { slide(R.$('.fm-band', it), 1, 0); }),
        R.on(el, 'focusout', '.fm-item', function (e, it) { slide(R.$('.fm-band', it), null, 1); })
      ];
      return function () { offs.forEach(function (f) { f(); }); bands.forEach(function (b) { b.remove(); }); };
    }
  });
})(window.Ranj);

;
/* Ranj UI — Text effects
 * split-text, blur-text, wave-text, scroll-reveal-text, text-pressure, decrypt-text,
 * rotating-text, typewriter, count-up, glitch-text, highlight-text, circular-text, true-focus
 */
(function (R) {
  'use strict';
  var d = document;

  /* ---------- private helpers ---------- */
  var seg = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  function graphemes(s) {
    if (seg) { var out = []; var it = seg.segment(s)[Symbol.iterator](), n; while (!(n = it.next()).done) out.push(n.value.segment); return out; }
    return Array.from(s);
  }
  function span(cls, text) { var s = d.createElement('span'); s.className = cls; if (text != null) s.textContent = text; return s; }
  function label(el) {
    var had = el.hasAttribute('aria-label');
    if (!had) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    return function () { if (!had) el.removeAttribute('aria-label'); };
  }

  /**
   * Split el's text into spans. mode: 'chars' | 'words' | 'lines'.
   * Keeps inline elements (em, strong, .gradient-text…) intact around the pieces.
   * Returns { pieces, words, chars, restore() }.
   */
  function split(el, mode, o) {
    o = o || {};
    var html = el.innerHTML, unlabel = label(el);
    var words = [], chars = [], pieces = [];
    var walker = d.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) {
      if (n.parentElement && n.parentElement.closest('[data-split-skip]')) continue;
      nodes.push(n);
    }
    nodes.forEach(function (node) {
      var frag = d.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(d.createTextNode(part)); return; }
        var w = span('st-word'); w.setAttribute('aria-hidden', 'true');
        if (mode === 'chars') {
          graphemes(part).forEach(function (g) { var c = span('st-char st-piece', g); w.appendChild(c); chars.push(c); });
        } else if (o.mask) {
          w.classList.add('st-mask'); var inner = span('st-piece', part); w.appendChild(inner);
        } else { w.textContent = part; w.classList.add('st-piece'); }
        words.push(w); frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
    if (mode === 'chars') {
      pieces = chars;
      if (o.mask) words.forEach(function (w) { w.classList.add('st-mask'); });
    } else pieces = words.map(function (w) { return w.classList.contains('st-piece') ? w : w.firstChild; });
    return {
      pieces: pieces, words: words, chars: chars,
      restore: function () { el.innerHTML = html; unlabel(); }
    };
  }
  function offsetIn(el, host) {
    var x = 0, y = 0, n = el;
    while (n && n !== host) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; if (n && n.contains(host) && n !== host) break; }
    if (n !== host) { // host is not in the offsetParent chain: subtract host's own offset
      var hx = 0, hy = 0, h = host; while (h && h !== n) { hx += h.offsetLeft; hy += h.offsetTop; h = h.offsetParent; }
      x -= hx; y -= hy;
    }
    return { x: x, y: y };
  }
  /** Line index for each word (by layout row). */
  function lineIndex(words) {
    var tops = [], out = [];
    words.forEach(function (w) {
      var t = Math.round(w.offsetTop), i = -1;
      for (var k = 0; k < tops.length; k++) if (Math.abs(tops[k] - t) < 4) { i = k; break; }
      if (i < 0) { tops.push(t); i = tops.length - 1; }
      out.push(i);
    });
    return out;
  }
  /** Give split pieces inside .gradient-text their slice of the gradient so it survives transforms. */
  function gradientPieces(el, pieces) {
    var hosts = [];
    if (el.classList.contains('gradient-text')) hosts.push(el);
    R.$$('.gradient-text', el).forEach(function (h) { hosts.push(h); });
    if (!hosts.length) return function () {};
    function layout() {
      hosts.forEach(function (h) {
        var r = h.getBoundingClientRect();
        h.style.setProperty('--st-w', h.offsetWidth + 'px');
        h.style.setProperty('--st-h', (h.offsetHeight || r.height) + 'px');
      });
      pieces.forEach(function (p) {
        var h = p.__gtHost; if (!h) return;
        var o = offsetIn(p, h);
        p.style.setProperty('--st-x', o.x + 'px'); p.style.setProperty('--st-y', o.y + 'px');
      });
    }
    pieces.forEach(function (p) {
      for (var i = hosts.length - 1; i >= 0; i--) if (hosts[i].contains(p)) { p.__gtHost = hosts[i]; p.classList.add('st-grad'); break; }
    });
    layout();
    var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { layout(); }) : null;
    if (ro) ro.observe(el);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(layout);
    return function () { if (ro) ro.disconnect(); };
  }
  function orderIndex(n, order) {
    var idx = [];
    for (var i = 0; i < n; i++) idx.push(i);
    if (order === 'end') idx.reverse();
    else if (order === 'center') idx = idx.map(function (i) { return Math.round(Math.abs(i - (n - 1) / 2)); });
    else if (order === 'random') { for (var j = n - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var t = idx[j]; idx[j] = idx[k]; idx[k] = t; } }
    return idx;
  }
  /** Shared trigger wiring: view (default) | load | hover; repeat re-plays on re-entry. */
  function trigger(el, o, play, reset) {
    var offs = [];
    if (o.trigger === 'load') play();
    else if (o.trigger === 'hover') { play(); offs.push(R.on(el, 'pointerenter', function () { reset(); void el.offsetWidth; play(); })); }
    else offs.push(R.inView(el, play, { threshold: o.threshold, repeat: o.repeat, onLeave: o.repeat ? reset : null }));
    return function () { offs.forEach(function (f) { f(); }); };
  }
  function scrollRoot(el) {
    var p = el.parentElement;
    while (p && p !== d.body && p !== d.documentElement) {
      var s = getComputedStyle(p);
      if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 1) return p;
      p = p.parentElement;
    }
    return null;
  }
  function viewRect(root) {
    if (root) return root.getBoundingClientRect();
    var h = window.innerHeight; return { top: 0, bottom: h, height: h };
  }
  function onScroll(fn) {
    var raf = 0, h = function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; fn(); }); };
    window.addEventListener('scroll', h, { capture: true, passive: true });
    window.addEventListener('resize', h);
    h();
    return function () { cancelAnimationFrame(raf); window.removeEventListener('scroll', h, { capture: true, passive: true }); window.removeEventListener('resize', h); };
  }

  // Expose the splitter for authors who compose their own effects.
  R.splitText = function (el, mode) { return split(el, mode || 'chars'); };

  /* ---------- Split text + Blur text ---------- */
  function mountSplit(el, isBlur) {
    var o = R.opts(el, { stagger: isBlur ? 60 : 30, duration: 0, delay: 0, trigger: 'view', repeat: false, threshold: 0.2, order: 'start', effect: isBlur ? 'blur' : 'fade-up', by: '' });
    var mode = (isBlur ? (o.by || el.getAttribute('data-blur-text')) : el.getAttribute('data-split-text')) || (isBlur ? 'words' : 'chars');
    if (['chars', 'words', 'lines'].indexOf(mode) < 0) mode = 'chars';
    var s = split(el, mode === 'lines' ? 'words' : mode, { mask: o.effect === 'mask' });
    var idx;
    if (mode === 'lines') idx = lineIndex(s.words);
    else idx = orderIndex(s.pieces.length, o.order);
    s.pieces.forEach(function (p, i) { p.style.setProperty('--i', idx[i]); });
    if (mode === 'lines' && !el.hasAttribute('data-stagger')) o.stagger = 120;
    el.style.setProperty('--st-stagger', o.stagger + 'ms');
    if (o.duration) el.style.setProperty('--st-dur', o.duration + 'ms');
    if (o.delay) el.style.setProperty('--st-delay', o.delay + 'ms');
    var stopGrad = gradientPieces(el, s.pieces);
    var doneT = 0;
    function play() {
      if (R.reducedMotion) { el.setAttribute('data-st-state', 'done'); return; }
      el.setAttribute('data-st-state', 'in');
      var max = 0; idx.forEach(function (v) { if (v > max) max = v; });
      var total = (o.delay || 0) + max * o.stagger + (o.duration || 900) + 50;
      clearTimeout(doneT);
      doneT = setTimeout(function () { R.emit(el, 'done', {}); }, total);
    }
    function reset() { el.setAttribute('data-st-state', 'out'); clearTimeout(doneT); }
    el.setAttribute('data-st-state', R.reducedMotion ? 'done' : 'out');
    var stopTrig = trigger(el, o, play, reset);
    return function () { stopTrig(); stopGrad(); clearTimeout(doneT); el.removeAttribute('data-st-state'); s.restore(); };
  }
  R.define('split-text', { selector: '[data-split-text]', mount: function (el) { return mountSplit(el, false); } });
  R.define('blur-text', { selector: '[data-blur-text]', mount: function (el) { return mountSplit(el, true); } });

  /* ---------- Wave text ---------- */
  R.define('wave-text', {
    selector: '[data-wave-text]',
    mount: function (el) {
      var o = R.opts(el, { step: 0, amplitude: '' });
      var s = split(el, el.getAttribute('data-wave-text') === 'words' ? 'words' : 'chars');
      s.pieces.forEach(function (p, i) { p.style.setProperty('--i', i); });
      if (o.step) el.style.setProperty('--wt-step', o.step + 'ms');
      if (o.amplitude) el.style.setProperty('--wt-amp', o.amplitude);
      return function () { s.restore(); };
    }
  });

  /* ---------- Scroll reveal text ---------- */
  R.define('scroll-reveal-text', {
    selector: '[data-scroll-reveal]',
    mount: function (el) {
      var o = R.opts(el, { start: 0.9, end: 0.35 });
      var s = split(el, 'words');
      s.pieces.forEach(function (p, i) { p.style.setProperty('--i', i); });
      el.style.setProperty('--n', s.pieces.length);
      if (R.reducedMotion) { el.style.setProperty('--p', 1); return function () { s.restore(); }; }
      var root = null, last = -1;
      var stop = onScroll(function () {
        if (!root || !root.isConnected) root = scrollRoot(el);
        var vr = viewRect(root), r = el.getBoundingClientRect();
        // p = 0 when the paragraph top sits at `start` of the viewport; 1 when its bottom reaches `end`.
        var a = vr.top + vr.height * o.start, b = vr.top + vr.height * o.end;
        var total = (a - b) + r.height;
        var p = R.clamp((a - r.top) / (total || 1), 0, 1);
        p = Math.round(p * 1000) / 1000;
        if (p !== last) { last = p; el.style.setProperty('--p', p); }
      });
      return function () { stop(); s.restore(); el.style.removeProperty('--p'); };
    }
  });

  /* ---------- Text pressure (variable weight near cursor) ---------- */
  R.define('text-pressure', {
    selector: '[data-text-pressure]',
    mount: function (el) {
      var o = R.opts(el, { min: 300, max: 900, radius: 0, scale: 0.18, area: '' });
      var s = split(el, 'chars');
      var ps = s.pieces, n = ps.length, cur = [], tgt = [], cx = [], cy = [];
      el.style.setProperty('--tp-min', o.min);
      for (var i = 0; i < n; i++) { cur[i] = o.min; tgt[i] = o.min; }
      if (R.reducedMotion) return function () { s.restore(); };
      var area = o.area ? d.querySelector(o.area) : (el.closest('[data-pressure-area]') || el.parentElement || el);
      var raf = 0, px = -1e4, py = -1e4, inside = false, rad = o.radius;
      function measure() {
        var fs = parseFloat(getComputedStyle(el).fontSize) || 48;
        rad = o.radius || fs * 2.6;
        for (var i = 0; i < n; i++) { var r = ps[i].getBoundingClientRect(); cx[i] = r.left + r.width / 2; cy[i] = r.top + r.height / 2; }
      }
      function frame() {
        raf = 0; var moving = false;
        for (var i = 0; i < n; i++) {
          var t = o.min;
          if (inside) { var dx = px - cx[i], dy = py - cy[i], dist = Math.sqrt(dx * dx + dy * dy); var f = Math.max(0, 1 - dist / rad); f = f * f * (3 - 2 * f); t = o.min + (o.max - o.min) * f; }
          tgt[i] = t;
          var v = cur[i] + (t - cur[i]) * 0.2;
          if (Math.abs(v - t) < 0.5) v = t; else moving = true;
          if (v !== cur[i]) {
            cur[i] = v;
            var k = (v - o.min) / ((o.max - o.min) || 1);
            ps[i].style.fontVariationSettings = "'wght' " + v.toFixed(1);
            ps[i].style.transform = o.scale ? 'scaleY(' + (1 + k * o.scale).toFixed(3) + ')' : '';
          }
        }
        if (moving) raf = requestAnimationFrame(frame);
      }
      function kick() { if (!raf) raf = requestAnimationFrame(frame); }
      var offs = [
        R.on(area, 'pointerenter', function () { measure(); inside = true; kick(); }),
        R.on(area, 'pointermove', function (e) { if (!inside) { measure(); inside = true; } px = e.clientX; py = e.clientY; kick(); }),
        R.on(area, 'pointerleave', function () { inside = false; kick(); }),
        R.on(window, 'scroll', function () { if (inside) measure(); }, { passive: true, capture: true })
      ];
      return function () { offs.forEach(function (f) { f(); }); cancelAnimationFrame(raf); s.restore(); };
    }
  });

  /* ---------- Decrypt text ---------- */
  var CHARSETS = {
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    alnum: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    hex: '0123456789ABCDEF',
    binary: '01',
    symbols: '!<>-_\\/[]{}—=+*^?#%&$@'
  };
  function decrypt(el, o) {
    var spans = el.__dtSpans, text = el.__dtText, chars = CHARSETS[o.charset] || o.charset || CHARSETS.alnum, n = spans.length;
    clearInterval(el.__dtTimer);
    if (R.reducedMotion) { spans.forEach(function (s, i) { s.textContent = text[i]; s.classList.remove('dt-enc'); }); return; }
    var order = orderIndex(n, o.sequential ? o.order : 'random');
    var per = o.step || Math.max(1, Math.round(n / 28)), step = 0;
    el.__dtTimer = setInterval(function () {
      step++;
      var upTo = (step - o.iterations) * per, done = true;
      for (var i = 0; i < n; i++) {
        var orig = text[i];
        if (/\s/.test(orig)) continue;
        if (order[i] < upTo) { if (spans[i].textContent !== orig) { spans[i].textContent = orig; spans[i].classList.remove('dt-enc'); } }
        else { done = false; spans[i].textContent = chars[(Math.random() * chars.length) | 0]; spans[i].classList.add('dt-enc'); }
      }
      if (done) { clearInterval(el.__dtTimer); R.emit(el, 'done', {}); }
    }, o.speed);
  }
  var DT_DEFAULTS = { speed: 40, iterations: 4, step: 0, charset: 'alnum', order: 'start', sequential: true, trigger: 'view', hover: true, repeat: false };
  R.define('decrypt-text', {
    selector: '[data-decrypt]',
    mount: function (el) {
      var o = R.opts(el, DT_DEFAULTS);
      var html = el.innerHTML, text = graphemes(el.textContent), unlabel = label(el);
      el.textContent = '';
      var wrap = span('dt-wrap'); wrap.setAttribute('aria-hidden', 'true');
      el.__dtText = text;
      el.__dtSpans = text.map(function (c) { var s = span('dt-char', c); wrap.appendChild(s); return s; });
      el.appendChild(wrap);
      function play() { decrypt(el, o); }
      function scrambleAll() { var cs = CHARSETS[o.charset] || o.charset; el.__dtSpans.forEach(function (s, i) { if (!/\s/.test(text[i])) { s.textContent = cs[(Math.random() * cs.length) | 0]; s.classList.add('dt-enc'); } }); }
      var offs = [];
      if (o.trigger === 'load') play();
      else if (o.trigger === 'view') { if (!R.reducedMotion) scrambleAll(); offs.push(R.inView(el, play, { repeat: o.repeat })); }
      if (o.hover || o.trigger === 'hover') offs.push(R.on(el, 'pointerenter', play), R.on(el, 'focus', play));
      return function () { offs.forEach(function (f) { f(); }); clearInterval(el.__dtTimer); el.innerHTML = html; unlabel(); };
    }
  });
  /** Ranj.decrypt(el) — replay the decode on a mounted [data-decrypt]. */
  R.decrypt = function (el) { if (el && el.__dtSpans) decrypt(el, R.opts(el, DT_DEFAULTS)); };

  /* ---------- Rotating text ---------- */
  R.define('rotating-text', {
    selector: '.rotating-text',
    mount: function (el) {
      var o = R.opts(el, { words: '', interval: 2200, stagger: 0, split: 'chars', pause: true, loop: true });
      var html = el.innerHTML;
      var list = o.words ? o.words.split('|') : R.$$(':scope > *', el).map(function (c) { return c.textContent.trim(); });
      if (!list.length) list = [el.textContent.trim()];
      el.textContent = '';
      var sr = span('sr-only', list.join(', ')); el.appendChild(sr);
      if (o.stagger) el.style.setProperty('--rt-stagger', o.stagger + 'ms');
      var words = list.map(function (w) {
        var we = span('rt-word'); we.setAttribute('aria-hidden', 'true');
        var parts = o.split === 'words' ? w.split(/(\s+)/) : (o.split === 'none' ? [w] : graphemes(w));
        parts.forEach(function (c, i) { var ce = span('rt-char', c); ce.style.setProperty('--i', i); we.appendChild(ce); });
        el.appendChild(we); return we;
      });
      var i = 0, t = 0, hovered = false, cleanT = 0;
      function fit() {
        var cs = getComputedStyle(el), padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        if (el.classList.contains('rotating-text-pill')) padX = 0; // content-box sizing
        el.style.width = (words[i].offsetWidth + (cs.boxSizing === 'border-box' ? padX : 0)) + 'px';
      }
      function show(next, animate) {
        var prev = words[i];
        words.forEach(function (w) { if (w !== prev && w !== words[next]) w.removeAttribute('data-rt'); });
        if (animate && prev !== words[next]) prev.setAttribute('data-rt', 'out'); else prev.removeAttribute('data-rt');
        i = next;
        words[i].removeAttribute('data-rt'); void words[i].offsetWidth;
        words[i].setAttribute('data-rt', 'in');
        fit();
        R.emit(el, 'change', { index: i, word: list[i] });
        clearTimeout(cleanT);
        cleanT = setTimeout(function () { if (prev !== words[i]) prev.removeAttribute('data-rt'); }, 1400);
      }
      function tick() {
        t = setTimeout(function () {
          if (!(o.pause && hovered) && !d.hidden) {
            if (!o.loop && i === list.length - 1) return;
            show((i + 1) % list.length, true);
          }
          tick();
        }, o.interval);
      }
      show(0, false);
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { if (el.isConnected) fit(); });
      var stopView = function () {};
      if (!R.reducedMotion && list.length > 1) {
        var started = false;
        stopView = R.inView(el, function () { if (!started) { started = true; tick(); } });
      }
      var offs = [R.on(el, 'pointerenter', function () { hovered = true; }), R.on(el, 'pointerleave', function () { hovered = false; }), R.on(window, 'resize', fit)];
      el.__rt = { next: function () { show((i + 1) % list.length, true); }, prev: function () { show((i - 1 + list.length) % list.length, true); }, jump: function (k) { show(k % list.length, true); } };
      return function () { clearTimeout(t); clearTimeout(cleanT); stopView(); offs.forEach(function (f) { f(); }); el.innerHTML = html; el.style.width = ''; delete el.__rt; };
    }
  });

  /* ---------- Typewriter ---------- */
  R.define('typewriter', {
    selector: '[data-typewriter]',
    mount: function (el) {
      var o = R.opts(el, { words: '', speed: 60, deleteSpeed: 32, pause: 1600, startDelay: 250, loop: true, cursor: 'bar', trigger: 'view', variable: true, caret: true });
      var html = el.innerHTML;
      var list = (o.words || el.getAttribute('data-typewriter') || el.textContent.trim()).split('|');
      if (o.words === '' && el.getAttribute('data-typewriter') === '') list = [el.textContent.trim()];
      el.textContent = '';
      el.setAttribute('aria-label', list.join(', '));
      var txt = span('tw-text'); txt.setAttribute('aria-hidden', 'true'); el.appendChild(txt);
      var caret = o.caret ? span('tw-caret') : null; if (caret) { caret.setAttribute('aria-hidden', 'true'); el.appendChild(caret); }
      var t = 0, wi = 0, ci = 0, deleting = false;
      if (R.reducedMotion) { txt.textContent = list[list.length - 1]; return function () { el.innerHTML = html; el.removeAttribute('aria-label'); }; }
      function step() {
        var word = graphemes(list[wi]);
        el.setAttribute('data-tw-typing', '');
        if (!deleting) {
          ci++; txt.textContent = word.slice(0, ci).join('');
          if (ci >= word.length) {
            el.removeAttribute('data-tw-typing');
            R.emit(el, 'typed', { index: wi, word: list[wi] });
            if (!o.loop && wi === list.length - 1) return;
            deleting = true; t = setTimeout(step, o.pause); return;
          }
          t = setTimeout(step, o.speed * (o.variable ? 0.55 + Math.random() * 0.9 : 1));
        } else {
          ci--; txt.textContent = word.slice(0, ci).join('');
          if (ci <= 0) { deleting = false; wi = (wi + 1) % list.length; el.removeAttribute('data-tw-typing'); t = setTimeout(step, o.speed * 4); return; }
          t = setTimeout(step, o.deleteSpeed);
        }
      }
      var stop = o.trigger === 'load' ? (t = setTimeout(step, o.startDelay), function () {}) : R.inView(el, function () { t = setTimeout(step, o.startDelay); });
      return function () { stop(); clearTimeout(t); el.innerHTML = html; el.removeAttribute('aria-label'); el.removeAttribute('data-tw-typing'); };
    }
  });

  /* ---------- Count up ---------- */
  function formatter(o) {
    return function (v) {
      var neg = v < 0, s = Math.abs(v).toFixed(o.decimals), parts = s.split('.');
      if (o.separator) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, o.separator);
      return (neg ? '-' : '') + o.prefix + parts.join(o.decimal) + o.suffix;
    };
  }
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function countTo(el, to, from) {
    var o = el.__cu; if (!o) return;
    cancelAnimationFrame(o.raf);
    var fmt = formatter(o), start = from != null ? from : (o.value != null ? o.value : o.from), t0 = 0;
    o.target = to;
    if (R.reducedMotion || o.duration <= 0) { o.value = to; el.textContent = fmt(to); R.emit(el, 'done', { value: to }); return; }
    function f(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / o.duration), v = start + (to - start) * easeOutExpo(k);
      o.value = v; el.textContent = fmt(v);
      if (k < 1) o.raf = requestAnimationFrame(f); else { o.value = to; el.textContent = fmt(to); R.emit(el, 'done', { value: to }); }
    }
    o.raf = requestAnimationFrame(f);
  }
  R.define('count-up', {
    selector: '[data-count-up]',
    mount: function (el) {
      var raw = el.textContent.trim();
      var o = R.opts(el, { to: NaN, from: 0, duration: 2000, decimals: -1, prefix: '', suffix: '', separator: ',', decimal: '.', delay: 0, trigger: 'view', repeat: false });
      if (isNaN(o.to)) o.to = parseFloat(raw.replace(/[^0-9.\-]/g, '')) || 0;
      if (o.decimals < 0) { var m = String(el.getAttribute('data-to') || o.to).split('.')[1]; o.decimals = m ? m.length : 0; }
      el.__cu = o; o.value = null;
      var fmt = formatter(o);
      el.setAttribute('aria-label', fmt(o.to));
      // lock width to the final value so layout never jitters
      el.textContent = fmt(o.to); var w = el.getBoundingClientRect().width; if (w) el.style.minWidth = Math.ceil(w) + 'px';
      el.textContent = fmt(o.from);
      var dt = 0;
      function play() { clearTimeout(dt); dt = setTimeout(function () { countTo(el, o.to, o.from); }, o.delay); }
      var stop = o.trigger === 'load' ? (play(), function () {}) : R.inView(el, play, { repeat: o.repeat, threshold: 0.4 });
      return function () { stop(); clearTimeout(dt); cancelAnimationFrame(o.raf); el.textContent = raw; el.style.minWidth = ''; el.removeAttribute('aria-label'); delete el.__cu; };
    }
  });
  /** Ranj.countUp(el, value) — animate an existing [data-count-up] to a new value. */
  R.countUp = function (el, value) {
    if (!el.__cu) return;
    el.setAttribute('aria-label', formatter(el.__cu)(value));
    el.style.minWidth = '';
    countTo(el, value);
  };

  /* ---------- Glitch text (fills data-text) ---------- */
  R.define('glitch-text', {
    selector: '.glitch-text',
    mount: function (el) {
      var set = !el.hasAttribute('data-text');
      if (set) el.setAttribute('data-text', el.textContent.trim());
      return function () { if (set) el.removeAttribute('data-text'); };
    }
  });

  /* ---------- Highlight text ---------- */
  var HL_PATHS = {
    underline: 'M1 62 C 18 44, 34 70, 52 52 S 84 38, 99 48',
    scribble: 'M1 50 Q 7 10 13 50 T 25 50 T 37 50 T 49 50 T 61 50 T 73 50 T 85 50 T 99 50',
    double: 'M1 34 C 30 22, 70 30, 99 24 M4 76 C 34 64, 68 74, 97 66',
    circle: 'M58 6 C 84 4, 99 22, 98 48 C 97 78, 72 96, 46 95 C 18 94, 2 76, 3 50 C 4 24, 24 6, 50 5 C 62 4, 74 8, 80 13',
    box: 'M3 6 L97 3 M96 2 L98 96 M99 95 L2 97 M3 99 L2 4',
    strike: 'M1 56 C 26 44, 64 60, 99 46'
  };
  R.define('highlight-text', {
    selector: '.hl-text',
    mount: function (el) {
      var o = R.opts(el, { delay: 0, duration: 0, trigger: 'view', repeat: false });
      var v = el.getAttribute('data-variant');
      if (o.delay) el.style.setProperty('--hl-delay', o.delay + 'ms');
      if (o.duration) el.style.setProperty('--hl-dur', o.duration + 'ms');
      var svg = null;
      if (v && HL_PATHS[v]) {
        svg = d.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'hl-svg'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
        HL_PATHS[v].split(' M').forEach(function (seg, k) {
          var p = d.createElementNS('http://www.w3.org/2000/svg', 'path');
          p.setAttribute('d', (k ? 'M' : '') + seg); p.setAttribute('pathLength', '1');
          if (k) p.style.transitionDelay = 'calc(var(--hl-delay) + ' + (k * (v === 'box' ? 0.18 : 0.3)) + 's)';
          svg.appendChild(p);
        });
        if (v === 'box') R.$$('path', svg).forEach(function (p) { p.style.transitionDuration = 'calc(var(--hl-dur) * .35)'; });
        el.appendChild(svg);
        if (!el.style.zIndex && getComputedStyle(el).position === 'relative') el.style.isolation = 'isolate';
      }
      if (R.reducedMotion) { el.setAttribute('data-hl-state', 'in'); return function () { if (svg) svg.remove(); el.removeAttribute('data-hl-state'); }; }
      el.setAttribute('data-hl-state', 'out');
      var stop = trigger(el, { trigger: o.trigger, repeat: o.repeat, threshold: 0.6 }, function () { el.setAttribute('data-hl-state', 'in'); }, function () { el.setAttribute('data-hl-state', 'out'); });
      return function () { stop(); if (svg) svg.remove(); el.removeAttribute('data-hl-state'); el.style.isolation = ''; };
    }
  });

  /* ---------- Circular text ---------- */
  R.define('circular-text', {
    selector: '.circular-text',
    mount: function (el) {
      var o = R.opts(el, { text: '', speed: 20, hover: 'speed', reverse: false, separator: ' • ' });
      var text = o.text || el.getAttribute('aria-label') || 'Ranj UI • Ranj UI • ';
      var uid = R.uid('ct');
      var ns = 'http://www.w3.org/2000/svg';
      var svg = d.createElementNS(ns, 'svg'); svg.setAttribute('class', 'ct-svg'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('aria-hidden', 'true');
      var defs = d.createElementNS(ns, 'defs'), path = d.createElementNS(ns, 'path');
      var r = 40;
      path.setAttribute('id', uid); path.setAttribute('d', 'M50,50 m-' + r + ',0 a' + r + ',' + r + ' 0 1,1 ' + 2 * r + ',0 a' + r + ',' + r + ' 0 1,1 -' + 2 * r + ',0');
      defs.appendChild(path); svg.appendChild(defs);
      var t = d.createElementNS(ns, 'text'), tp = d.createElementNS(ns, 'textPath');
      tp.setAttribute('href', '#' + uid); tp.setAttribute('textLength', (2 * Math.PI * r - 1).toFixed(1)); tp.setAttribute('lengthAdjust', 'spacing');
      tp.textContent = text; t.appendChild(tp); svg.appendChild(t);
      el.insertBefore(svg, el.firstChild);
      if (!el.hasAttribute('aria-label')) { el.setAttribute('aria-label', text.replace(/[•·]/g, ' ').replace(/\s+/g, ' ').trim()); el.setAttribute('role', 'img'); el.__ctLabel = true; }
      // font size in viewBox units: CSS --ct-font is px relative to rendered size
      function fitFont() { var px = parseFloat(getComputedStyle(el).getPropertyValue('--ct-font')) || 13, w = el.offsetWidth || 160; t.style.fontSize = (px * 100 / w).toFixed(2) + 'px'; }
      fitFont();
      var ro = 'ResizeObserver' in window ? new ResizeObserver(fitFont) : null; if (ro) ro.observe(el);
      if (R.reducedMotion) return function () { svg.remove(); if (ro) ro.disconnect(); if (el.__ctLabel) { el.removeAttribute('aria-label'); el.removeAttribute('role'); } };
      var base = 360 / Math.max(1, o.speed) * (o.reverse ? -1 : 1), vel = base, target = base, angle = 0, hovering = false;
      function hoverTarget() {
        switch (o.hover) {
          case 'slow': return base * 0.25;
          case 'pause': return 0;
          case 'reverse': return -base;
          case 'bonkers': return base * 8;
          case 'none': return base;
          default: return base * 3.5;
        }
      }
      var offs = [R.on(el, 'pointerenter', function () { hovering = true; target = hoverTarget(); }), R.on(el, 'pointerleave', function () { hovering = false; target = base; })];
      var stop = R.loop(el, function (now, dt) {
        vel += (target - vel) * Math.min(1, dt / 220);
        angle = (angle + vel * dt / 1000) % 360;
        svg.style.transform = 'rotate(' + angle.toFixed(2) + 'deg)' + (hovering && o.hover === 'bonkers' ? ' scale(.94)' : '');
      });
      return function () { stop(); offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); svg.remove(); if (el.__ctLabel) { el.removeAttribute('aria-label'); el.removeAttribute('role'); } };
    }
  });

  /* ---------- True focus ---------- */
  R.define('true-focus', {
    selector: '[data-true-focus]',
    mount: function (el) {
      var o = R.opts(el, { interval: 1800, trigger: 'auto', blur: '' });
      var s = split(el, 'words');
      if (o.blur) el.style.setProperty('--tf-blur', o.blur);
      var frame = span('tf-frame'); frame.setAttribute('aria-hidden', 'true');
      frame.innerHTML = '<i></i><i></i><i></i><i></i>';
      el.appendChild(frame);
      var i = 0, t = 0, words = s.words;
      function place() {
        var w = words[i]; if (!w) return;
        words.forEach(function (x) { x.toggleAttribute('data-tf-active', x === w); });
        frame.style.transform = 'translate(' + w.offsetLeft + 'px,' + w.offsetTop + 'px)';
        frame.style.width = w.offsetWidth + 'px'; frame.style.height = w.offsetHeight + 'px';
      }
      function go(k) { i = k; place(); R.emit(el, 'change', { index: i }); }
      place();
      var offs = [R.on(window, 'resize', place)];
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { if (el.isConnected) place(); });
      if (o.trigger === 'hover') {
        offs.push(R.on(el, 'pointerover', '.st-word', function (e, w) { var k = words.indexOf(w); if (k > -1 && k !== i) go(k); }));
      } else if (!R.reducedMotion) {
        var stopView = R.inView(el, function () {
          (function tick() { t = setTimeout(function () { if (!d.hidden) go((i + 1) % words.length); tick(); }, o.interval); })();
        });
        offs.push(stopView);
      } else { words.forEach(function (x) { x.setAttribute('data-tf-active', ''); }); }
      return function () { clearTimeout(t); offs.forEach(function (f) { f(); }); frame.remove(); s.restore(); };
    }
  });
})(window.Ranj);
