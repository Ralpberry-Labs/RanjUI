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
