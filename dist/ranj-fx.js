/*! Ranj UI v2.0.0 | MIT | https://ralpberry-labs.github.io/RanjUI/ */
/* Ranj UI — Stateful action buttons (send, download, continue, add to cart), copy, subscribe, glow pointer */
(function (R) {
  'use strict';
  if (!R) return;
  var D = document;

  function kindOf(el) {
    return el.classList.contains('dl-btn') ? 'download' : el.classList.contains('continue-btn') ? 'continue' : el.classList.contains('cart-btn') ? 'cart' : el.classList.contains('send-btn') ? 'send' : 'generic';
  }
  var DUR = { send: 1100, download: 2400, continue: 1500, cart: 1650, generic: 1200 };

  function setState(el, s) {
    el.setAttribute('data-state', s);
    el.setAttribute('aria-busy', String(s === 'busy'));
    var live = el.querySelector('.fxb-texts [data-for="' + s + '"]');
    if (live && s !== 'idle') { var lr = el._live; if (lr) lr.textContent = live.textContent; }
  }
  function progress(el, p) {
    p = R.clamp(p, 0, 1);
    el.style.setProperty('--p', p.toFixed(3));
    R.$$('[data-progress-text]', el).forEach(function (t) { t.textContent = Math.round(p * 100) + '%'; });
    el.setAttribute('aria-valuenow', Math.round(p * 100));
  }
  function collapse(el, on) {
    if (kindOf(el) !== 'continue') return;
    if (on) {
      if (!el._w) el._w = el.offsetWidth;
      el.style.width = el._w + 'px'; void el.offsetWidth;
      el.style.width = el.offsetHeight + 'px';
    } else if (el._w) {
      el.style.width = el._w + 'px';
      setTimeout(function () { if (el.getAttribute('data-state') === 'idle') { el.style.width = ''; el._w = 0; } }, 500);
    }
  }
  function done(el) {
    clearInterval(el._timer); clearTimeout(el._t2);
    if (kindOf(el) === 'download') progress(el, 1);
    setState(el, 'done');
    if (kindOf(el) === 'cart') bumpCart(el);
    R.emit(el, 'done', {});
    var reset = R.attr(el, 'data-reset', 2600);
    if (reset > 0) el._t3 = setTimeout(function () { api.reset(el); }, reset);
  }
  function bumpCart(el) {
    var sel = el.getAttribute('data-cart-target'), b = sel && D.querySelector(sel);
    if (!b) return;
    var n = (parseInt(b.textContent, 10) || 0) + 1; b.textContent = n; b.hidden = false;
    b.classList.remove('cart-badge-bump'); void b.offsetWidth; b.classList.add('cart-badge-bump');
  }
  function start(el) {
    if ((el.getAttribute('data-state') || 'idle') !== 'idle') return;
    if (!R.emit(el, 'start', {})) return;
    var k = kindOf(el);
    clearTimeout(el._t3);
    collapse(el, true);
    setState(el, 'busy');
    if (k === 'download') progress(el, 0);
    if (el.hasAttribute('data-manual')) return;
    var dur = R.attr(el, 'data-duration', DUR[k]);
    if (k === 'download') {
      var t0 = performance.now();
      el._timer = setInterval(function () {
        var x = (performance.now() - t0) / dur;
        // eased, slightly irregular progress so it feels like a real download
        var p = Math.min(1, x < 1 ? 1 - Math.pow(1 - x, 1.6) + Math.sin(x * 20) * 0.01 : 1);
        progress(el, p);
        if (x >= 1) done(el);
      }, 60);
    } else el._t2 = setTimeout(function () { done(el); }, dur);
  }
  var api = R.fxButton = {
    start: function (el) { start(el); },
    progress: function (el, p) { progress(el, p); },
    done: function (el) { done(el); },
    error: function (el) {
      clearInterval(el._timer); clearTimeout(el._t2); setState(el, 'error');
      el._t3 = setTimeout(function () { api.reset(el); }, R.attr(el, 'data-reset', 2600) || 2600);
    },
    reset: function (el) { clearInterval(el._timer); clearTimeout(el._t2); clearTimeout(el._t3); setState(el, 'idle'); progress(el, 0); collapse(el, false); }
  };

  R.define('fx-button', {
    selector: '.fxb',
    mount: function (el) {
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      if (!el.getAttribute('data-state')) el.setAttribute('data-state', 'idle');
      var live = D.createElement('span'); live.setAttribute('aria-live', 'polite');
      live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';
      el.appendChild(live); el._live = live;
      var off = R.on(el, 'click', function () { start(el); });
      return function () { off(); clearInterval(el._timer); clearTimeout(el._t2); clearTimeout(el._t3); live.remove(); };
    }
  });

  /* ---------- Copy ---------- */
  var COPY = '<svg class="copy-btn-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>' +
    '<svg class="copy-btn-check" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function writeClip(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(function () { return legacy(text); });
    return legacy(text);
  }
  function legacy(text) {
    return new Promise(function (res, rej) {
      var ta = D.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'; D.body.appendChild(ta); ta.select();
      try { D.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); } ta.remove();
    });
  }
  R.copyText = writeClip;
  R.define('copy-btn', {
    selector: '.copy-btn',
    mount: function (el) {
      if (!el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', COPY);
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      if (!el.hasAttribute('data-copied-label')) el.setAttribute('data-copied-label', 'Copied!');
      if (!el.hasAttribute('aria-label') && !el.textContent.trim()) el.setAttribute('aria-label', 'Copy to clipboard');
      var label = el.getAttribute('aria-label'), textNode = el.querySelector('.copy-btn-label'), idleText = textNode && textNode.textContent, t = 0;
      return R.on(el, 'click', function () {
        var src = el.getAttribute('data-copy-target'), text = el.getAttribute('data-copy');
        if (src) { var n = D.querySelector(src); text = n ? (n.value != null && n.tagName !== 'DIV' ? n.value : n.textContent) : ''; }
        text = (text || '').trim();
        writeClip(text).then(function () {
          el.setAttribute('data-state', 'done');
          if (label) el.setAttribute('aria-label', el.getAttribute('data-copied-label'));
          if (textNode) textNode.textContent = el.getAttribute('data-copied-label');
          R.emit(el, 'copy', { text: text });
          clearTimeout(t); t = setTimeout(function () {
            el.setAttribute('data-state', 'idle'); if (label) el.setAttribute('aria-label', label); if (textNode) textNode.textContent = idleText;
          }, 1600);
        }, function () { R.emit(el, 'copyerror', { text: text }); });
      });
    }
  });

  /* ---------- Subscribe ---------- */
  var RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  R.define('subscribe', {
    selector: '.subscribe',
    mount: function (el) {
      var input = el.querySelector('.subscribe-input'), btn = el.querySelector('.subscribe-btn');
      if (!input || !btn) return;
      if (btn.tagName === 'BUTTON' && !btn.hasAttribute('type')) btn.type = 'submit';
      if (!btn.querySelector('.fxb-spin')) btn.insertAdjacentHTML('afterbegin', '<i class="fxb-spin" aria-hidden="true"></i>');
      var ok = el.querySelector('.subscribe-success');
      if (ok && ok.parentNode !== btn) btn.appendChild(ok);
      var msg = el.querySelector('.subscribe-msg');
      if (!msg) { msg = D.createElement('div'); msg.className = 'subscribe-msg'; msg.setAttribute('aria-live', 'polite'); el.appendChild(msg); }
      function measure() { var s = btn.querySelector('span'); if (s && el.getAttribute('data-state') !== 'busy' && el.getAttribute('data-state') !== 'done') el.style.setProperty('--bw', Math.ceil(s.offsetWidth + 40) + 'px'); }
      measure();
      var ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null; if (ro) ro.observe(btn);
      var t = 0;
      function finish(success, text) {
        if (success) { el.setAttribute('data-state', 'done'); input.disabled = true; msg.textContent = ''; }
        else { el.setAttribute('data-state', 'error'); msg.textContent = text || 'Something went wrong.'; setTimeout(function () { if (el.getAttribute('data-state') === 'error') el.setAttribute('data-state', 'idle'); }, 500); }
      }
      var offs = [];
      offs.push(R.on(el, 'submit', function (e) {
        e.preventDefault();
        var st = el.getAttribute('data-state'); if (st === 'busy' || st === 'done') return;
        var v = input.value.trim();
        if (!RE.test(v)) {
          input.setAttribute('aria-invalid', 'true'); msg.textContent = el.getAttribute('data-invalid') || 'Please enter a valid email address.';
          el.setAttribute('data-state', 'error'); input.focus();
          clearTimeout(t); t = setTimeout(function () { el.setAttribute('data-state', 'idle'); }, 500);
          return;
        }
        input.removeAttribute('aria-invalid'); msg.textContent = '';
        el.setAttribute('data-state', 'busy');
        var handled = false;
        var detail = { email: v, done: function () { handled = true; finish(true); }, fail: function (m) { handled = true; finish(false, m); } };
        R.emit(el, 'subscribe', detail);
        if (!el.hasAttribute('data-manual')) setTimeout(function () { if (!handled) finish(true); }, R.attr(el, 'data-delay', 1300));
      }));
      offs.push(R.on(input, 'input', function () { if (input.hasAttribute('aria-invalid')) { input.removeAttribute('aria-invalid'); msg.textContent = ''; } }));
      return function () { offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); clearTimeout(t); };
    }
  });
  R.subscribe = { reset: function (el) { if (typeof el === 'string') el = D.querySelector(el); if (!el) return; el.setAttribute('data-state', 'idle'); var i = el.querySelector('.subscribe-input'); if (i) { i.disabled = false; i.value = ''; } } };

  /* ---------- Glow button pointer light ---------- */
  R.define('glow-btn', {
    setup: function () {
      R.on(D, 'pointermove', '.glow-btn', function (e, el) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    }
  });
})(window.Ranj);

;
/* Ranj UI — Animated backgrounds (canvas + generated DOM layers)
 * All canvas effects: DPR capped at 2, ResizeObserver sizing, R.loop (pauses offscreen / hidden tab),
 * colors from CSS vars (re-read when theme / accent changes), static frame under reduced motion.
 */
(function (R) {
  'use strict';
  if (!R) return;
  var W = window, D = document;

  /* ---------- private helpers ---------- */
  var pc, px;
  function rgb(c, fb) {
    if (!pc) { pc = D.createElement('canvas'); pc.width = pc.height = 1; px = pc.getContext('2d', { willReadFrequently: true }); }
    px.clearRect(0, 0, 1, 1); px.fillStyle = fb || '#888'; px.fillStyle = c || fb || '#888'; px.fillRect(0, 0, 1, 1);
    var d = px.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]];
  }
  function cssv(el, n) { return getComputedStyle(el).getPropertyValue(n).trim(); }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a < 0 ? 0 : a > 1 ? 1 : a).toFixed(3) + ')'; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function lum(c) { return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255; }
  /** Palette: data-colors="#f0f,#0ff" overrides --c1..--c4; data-color overrides --color */
  function palette(el) {
    var list = (el.getAttribute('data-colors') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var out = [];
    for (var i = 0; i < 4; i++) out.push(rgb(list[i] || cssv(el, '--c' + (i + 1)), '#8b5cf6'));
    return {
      list: out,
      color: rgb(el.getAttribute('data-color') || cssv(el, '--color') || cssv(el, '--c1'), '#8b5cf6'),
      bg: rgb(cssv(el, '--bg') || '#fff'),
      fg: rgb(cssv(el, '--fg') || '#000')
    };
  }
  var subs = [], mo = null;
  function onTheme(fn) {
    subs.push(fn);
    if (!mo && 'MutationObserver' in W) {
      mo = new MutationObserver(function () { setTimeout(function () { subs.slice().forEach(function (f) { try { f(); } catch (e) {} }); }, 0); });
      mo.observe(D.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-accent', 'style', 'class'] });
    }
    return function () { var i = subs.indexOf(fn); if (i > -1) subs.splice(i, 1); };
  }
  function rand(a, b) { return a + Math.random() * (b - a); }
  /** Pointer tracking on the host (the bg itself has pointer-events:none so content stays clickable) */
  function pointer(el, onMove, onLeave, onDown, onUp) {
    var host = el.parentElement || el, offs = [];
    offs.push(R.on(host, 'pointermove', function (e) { var r = el.getBoundingClientRect(); onMove(e.clientX - r.left, e.clientY - r.top, e); }));
    offs.push(R.on(host, 'pointerleave', function () { if (onLeave) onLeave(); }));
    if (onDown) offs.push(R.on(host, 'pointerdown', function (e) { onDown(e); }));
    if (onUp) { offs.push(R.on(W, 'pointerup', function (e) { onUp(e); })); offs.push(R.on(W, 'pointercancel', function (e) { onUp(e); })); }
    return function () { offs.forEach(function (f) { f(); }); };
  }

  /**
   * Canvas surface: handles sizing, DPR, loop, theme, reduced motion, cleanup.
   * spec: { resize(w,h), colors(pal), frame(ctx,w,h,t,dt), still: time (ms) for reduced motion frame, scale }
   */
  function surface(el, spec) {
    var cv = D.createElement('canvas'); cv.setAttribute('aria-hidden', 'true');
    el.appendChild(cv);
    var ctx = cv.getContext('2d'), w = 0, h = 0, stop = null, t = 0, ro = null, ready = false;
    var still = R.reducedMotion || el.hasAttribute('data-static');
    function readColors() { if (spec.colors) spec.colors(palette(el)); }
    function size() {
      var r = el.getBoundingClientRect();
      var nw = Math.max(1, Math.round(r.width)), nh = Math.max(1, Math.round(r.height));
      if (nw === w && nh === h && ready) return;
      w = nw; h = nh;
      var dpr = Math.min(2, W.devicePixelRatio || 1) * (spec.scale || 1);
      cv.width = Math.max(1, Math.round(w * dpr)); cv.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (spec.resize) spec.resize(w, h, dpr);
      ready = true;
      if (still) draw(spec.still || 4000, 16);
    }
    function draw(tt, dt) { spec.frame(ctx, w, h, tt, dt); }
    readColors();
    size();
    if ('ResizeObserver' in W) { ro = new ResizeObserver(size); ro.observe(el); }
    var offTheme = onTheme(function () { readColors(); if (still) draw(spec.still || 4000, 16); });
    if (!still) stop = R.loop(el, function (_, dt) { t += dt; draw(t, dt); });
    return {
      canvas: cv, ctx: ctx,
      redraw: function () { if (still) draw(spec.still || 4000, 16); },
      destroy: function () { if (stop) stop(); if (ro) ro.disconnect(); offTheme(); if (cv.parentNode) cv.parentNode.removeChild(cv); }
    };
  }

  /* =====================================================================
     Particles: drifting nodes joined by lines; the cursor pushes them away
     ===================================================================== */
  R.define('bg-particles', {
    selector: '.bg-particles',
    mount: function (el) {
      var o = R.opts(el, { count: 0, link: 120, speed: 0.35, repel: 110, size: 1.6, lines: true });
      var ps = [], col = [0, 0, 0], mouse = null, W0 = 0, H0 = 0;
      function seed(w, h) {
        var n = o.count || Math.min(150, Math.max(24, Math.round(w * h / 8500)));
        ps = [];
        for (var i = 0; i < n; i++) {
          var a = Math.random() * Math.PI * 2, s = rand(0.3, 1) * o.speed;
          ps.push({ x: Math.random() * w, y: Math.random() * h, vx: Math.cos(a) * s, vy: Math.sin(a) * s, bx: Math.cos(a) * s, by: Math.sin(a) * s, r: rand(0.6, 1.4) * o.size });
        }
      }
      var s = surface(el, {
        colors: function (p) { col = p.color; },
        resize: function (w, h) { if (!ps.length || Math.abs(w * h - W0 * H0) > W0 * H0 * 0.3) seed(w, h); W0 = w; H0 = h; },
        frame: function (c, w, h, t, dt) {
          var k = dt / 16.67, L = o.link, L2 = L * L, i, j, p, q;
          c.clearRect(0, 0, w, h);
          for (i = 0; i < ps.length; i++) {
            p = ps[i];
            if (mouse) {
              var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy, rr = o.repel * o.repel;
              if (d2 < rr && d2 > 0.01) { var d = Math.sqrt(d2), f = (1 - d / o.repel) * 1.6; p.vx += dx / d * f * k; p.vy += dy / d * f * k; }
            }
            p.vx += (p.bx - p.vx) * 0.04 * k; p.vy += (p.by - p.vy) * 0.04 * k;
            p.x += p.vx * k; p.y += p.vy * k;
            if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
          }
          if (o.lines) {
            c.lineWidth = 1;
            for (i = 0; i < ps.length; i++) {
              p = ps[i];
              for (j = i + 1; j < ps.length; j++) {
                q = ps[j];
                var ex = p.x - q.x; if (ex > L || ex < -L) continue;
                var ey = p.y - q.y; if (ey > L || ey < -L) continue;
                var e2 = ex * ex + ey * ey;
                if (e2 < L2) { c.strokeStyle = rgba(col, (1 - Math.sqrt(e2) / L) * 0.45); c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke(); }
              }
            }
          }
          c.fillStyle = rgba(col, 0.9);
          for (i = 0; i < ps.length; i++) { p = ps[i]; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.2832); c.fill(); }
        }
      });
      var offP = pointer(el, function (x, y) { mouse = { x: x, y: y }; }, function () { mouse = null; });
      return function () { s.destroy(); offP(); };
    }
  });

  /* =====================================================================
     Stars: twinkling drift, or warp speed (data-mode="warp"; hold to boost)
     ===================================================================== */
  R.define('bg-stars', {
    selector: '.bg-stars',
    mount: function (el) {
      var o = R.opts(el, { mode: 'drift', count: 0, speed: 1, boost: true });
      var stars = [], col = [255, 255, 255], warp = o.mode === 'warp', boost = 0, target = 0;
      function seed(w, h) {
        var n = o.count || Math.round(Math.min(700, w * h / (warp ? 1300 : 2200)));
        stars = [];
        for (var i = 0; i < n; i++) stars.push(warp ? newWarp(true) : { x: Math.random() * w, y: Math.random() * h, z: Math.pow(Math.random(), 2.2), ph: Math.random() * 6.28, tw: rand(0.6, 2.2) });
      }
      function newWarp(any) { return { x: rand(-1, 1), y: rand(-1, 1), z: any ? rand(0.05, 1) : rand(0.85, 1), pz: 0 }; }
      var s = surface(el, {
        still: 2500,
        colors: function (p) { col = p.color; },
        resize: function (w, h) { seed(w, h); },
        frame: function (c, w, h, t, dt) {
          var k = dt / 16.67, i, st;
          boost += (target - boost) * 0.06 * k;
          if (!warp) {
            c.clearRect(0, 0, w, h);
            for (i = 0; i < stars.length; i++) {
              st = stars[i];
              var sp = (0.05 + st.z * 0.35) * o.speed * (1 + boost * 8);
              st.x -= sp * k * 0.6; st.y += sp * k * 0.25;
              if (st.x < -2) st.x = w + 2; if (st.y > h + 2) st.y = -2;
              var a = (0.25 + st.z * 0.75) * (0.55 + 0.45 * Math.sin(t / 1000 * st.tw + st.ph));
              var r = 0.4 + st.z * 1.3;
              c.fillStyle = rgba(col, a);
              if (r > 1.1) { c.beginPath(); c.arc(st.x, st.y, r, 0, 6.2832); c.fill(); if (st.z > 0.85) { c.fillStyle = rgba(col, a * 0.15); c.beginPath(); c.arc(st.x, st.y, r * 3.2, 0, 6.2832); c.fill(); } }
              else c.fillRect(st.x - r, st.y - r, r * 2, r * 2);
            }
            return;
          }
          // warp: trails by fading previous frame
          c.globalCompositeOperation = 'destination-out';
          c.fillStyle = 'rgba(0,0,0,' + (0.32 - boost * 0.18) + ')'; c.fillRect(0, 0, w, h);
          c.globalCompositeOperation = 'source-over';
          var cx = w / 2, cy = h / 2, f = Math.max(w, h) * 0.5, v = 0.0045 * o.speed * (1 + boost * 6) * k;
          c.lineCap = 'round';
          for (i = 0; i < stars.length; i++) {
            st = stars[i];
            var pz = st.z; st.z -= v;
            if (st.z <= 0.02) { stars[i] = newWarp(false); continue; }
            var sx = cx + st.x / st.z * f, sy = cy + st.y / st.z * f, ox = cx + st.x / pz * f, oy = cy + st.y / pz * f;
            if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) { stars[i] = newWarp(false); continue; }
            var depth = 1 - st.z;
            c.strokeStyle = rgba(col, Math.min(1, depth * 1.4));
            c.lineWidth = Math.max(0.4, depth * 2.6);
            c.beginPath(); c.moveTo(ox, oy); c.lineTo(sx, sy); c.stroke();
          }
        }
      });
      var offP = o.boost ? pointer(el, function () {}, function () { target = 0; }, function () { target = 1; }, function () { target = 0; }) : function () {};
      return function () { s.destroy(); offP(); };
    }
  });

  /* =====================================================================
     Waves: layered filled sine waves, or many thin lines (data-style="lines")
     ===================================================================== */
  R.define('bg-waves', {
    selector: '.bg-waves',
    mount: function (el) {
      var o = R.opts(el, { layers: 4, amplitude: 28, speed: 1, style: 'fill', lines: 22 });
      var pal = null;
      var s = surface(el, {
        still: 3000,
        colors: function (p) { pal = p; },
        frame: function (c, w, h, t) {
          c.clearRect(0, 0, w, h);
          var T = t / 1000 * o.speed, A = o.amplitude, x, y, i;
          if (o.style === 'lines') {
            var n = o.lines;
            c.lineWidth = 1.1;
            for (i = 0; i < n; i++) {
              var f = i / (n - 1), g = c.createLinearGradient(0, 0, w, 0);
              var ca = pal.list[0], cb = pal.list[1];
              g.addColorStop(0, rgba(ca, 0)); g.addColorStop(0.3, rgba(mix(ca, cb, f), 0.55)); g.addColorStop(0.7, rgba(mix(cb, ca, f), 0.55)); g.addColorStop(1, rgba(cb, 0));
              c.strokeStyle = g; c.beginPath();
              for (x = 0; x <= w + 10; x += 10) {
                y = h * 0.5 + (f - 0.5) * h * 0.55 + Math.sin(x * 0.006 + T * 0.9 + f * 2.2) * A * 1.4 + Math.sin(x * 0.013 - T * 0.6 + f * 4) * A * 0.5;
                if (x === 0) c.moveTo(x, y); else c.lineTo(x, y);
              }
              c.stroke();
            }
            return;
          }
          for (i = 0; i < o.layers; i++) {
            var base = h * (0.5 + i * (0.42 / o.layers)), cc = pal.list[i % 4];
            var gr = c.createLinearGradient(0, base - A * 2, 0, h);
            gr.addColorStop(0, rgba(cc, 0.42 - i * 0.05)); gr.addColorStop(1, rgba(cc, 0.04));
            c.fillStyle = gr; c.beginPath(); c.moveTo(0, h);
            for (x = 0; x <= w + 8; x += 8) {
              y = base + Math.sin(x * (0.004 + i * 0.0012) + T * (0.6 + i * 0.22) + i * 1.7) * A + Math.sin(x * (0.011 - i * 0.001) - T * (0.9 - i * 0.1) + i) * A * 0.45;
              c.lineTo(x, y);
            }
            c.lineTo(w, h); c.closePath(); c.fill();
          }
        }
      });
      return s.destroy;
    }
  });

  /* =====================================================================
     Squares: moving grid; cells light up under the cursor + random flicker
     ===================================================================== */
  R.define('bg-squares', {
    selector: '.bg-squares',
    mount: function (el) {
      var o = R.opts(el, { size: 40, direction: 'diagonal', speed: 0.35, flicker: true });
      var line = [0, 0, 0], fill = [0, 0, 0], cells = {}, ox = 0, oy = 0, mouse = null, acc = 0;
      var dirs = { diagonal: [1, 1], up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0], none: [0, 0] }, dv = dirs[o.direction] || dirs.diagonal;
      var lineA = 0.1;
      var s = surface(el, {
        still: 1000,
        colors: function (p) { fill = rgb(el.getAttribute('data-color') || cssv(el, '--fill'), '#8b5cf6'); line = p.fg; lineA = lum(p.bg) > 0.5 ? 0.09 : 0.11; },
        frame: function (c, w, h, t, dt) {
          var S = o.size, k = dt / 16.67;
          ox = (ox + dv[0] * o.speed * k + S) % S; oy = (oy + dv[1] * o.speed * k + S) % S;
          c.clearRect(0, 0, w, h);
          var cols = Math.ceil(w / S) + 2, rows = Math.ceil(h / S) + 2;
          if (mouse) { var mi = Math.floor((mouse.x + ox) / S), mj = Math.floor((mouse.y + oy) / S); cells[mi + ',' + mj] = 1; }
          acc += dt;
          if (o.flicker && acc > 140 && !R.reducedMotion) { acc = 0; var ri = Math.floor(Math.random() * cols), rj = Math.floor(Math.random() * rows); if (!cells[ri + ',' + rj]) cells[ri + ',' + rj] = 0.55; }
          for (var key in cells) {
            var v = cells[key]; if (v <= 0) { delete cells[key]; continue; }
            var p = key.split(','), cx = p[0] * S - ox, cy = p[1] * S - oy;
            c.fillStyle = rgba(fill, v * 0.32); c.fillRect(cx, cy, S, S);
            c.strokeStyle = rgba(fill, v * 0.7); c.lineWidth = 1; c.strokeRect(cx + 0.5, cy + 0.5, S - 1, S - 1);
            cells[key] = v - dt / 1100;
          }
          c.strokeStyle = rgba(line, lineA); c.lineWidth = 1; c.beginPath();
          for (var i = 0; i < cols; i++) { var x = Math.round(i * S - ox) + 0.5; c.moveTo(x, 0); c.lineTo(x, h); }
          for (var j = 0; j < rows; j++) { var y = Math.round(j * S - oy) + 0.5; c.moveTo(0, y); c.lineTo(w, y); }
          c.stroke();
        }
      });
      var offP = pointer(el, function (x, y) { mouse = { x: x, y: y }; }, function () { mouse = null; });
      return function () { s.destroy(); offP(); };
    }
  });

  /* =====================================================================
     Flickering grid: tiny squares randomly changing opacity
     ===================================================================== */
  R.define('bg-flicker-grid', {
    selector: '.bg-flicker-grid',
    mount: function (el) {
      var o = R.opts(el, { square: 4, gap: 6, rate: 0.35, max: 0.32 });
      var col = [0, 0, 0], a = null, cols = 0, rows = 0;
      var s = surface(el, {
        still: 100,
        colors: function (p) { col = p.color; },
        resize: function (w, h) {
          var step = o.square + o.gap; cols = Math.ceil(w / step); rows = Math.ceil(h / step);
          a = new Float32Array(cols * rows); for (var i = 0; i < a.length; i++) a[i] = Math.random() * o.max;
        },
        frame: function (c, w, h, t, dt) {
          var step = o.square + o.gap, p = o.rate * dt / 1000, i, j, n = 0;
          c.clearRect(0, 0, w, h); c.fillStyle = rgba(col, 1);
          for (i = 0; i < cols; i++) for (j = 0; j < rows; j++, n++) {
            if (Math.random() < p) a[n] = Math.random() * o.max;
            c.globalAlpha = a[n]; c.fillRect(i * step, j * step, o.square, o.square);
          }
          c.globalAlpha = 1;
        }
      });
      return s.destroy;
    }
  });

  /* =====================================================================
     Silk + Liquid: low-res per-pixel field, upscaled smoothly (cheap)
     ===================================================================== */
  function field(el, o, shade) {
    var small = D.createElement('canvas'), sx = small.getContext('2d'), img = null, gw = 0, gh = 0, pal = null, dark = false;
    var s = surface(el, {
      still: 6000,
      colors: function (p) { pal = p; dark = lum(p.bg) < 0.5; },
      resize: function (w, h) {
        gw = Math.max(8, Math.ceil(w / o.res)); gh = Math.max(8, Math.ceil(h / o.res));
        small.width = gw; small.height = gh; img = sx.createImageData(gw, gh);
      },
      frame: function (c, w, h, t) {
        var d = img.data, T = t / 1000 * o.speed, asp = gw / gh, i = 0;
        for (var y = 0; y < gh; y++) {
          var v = y / gh;
          for (var x = 0; x < gw; x++, i += 4) {
            var out = shade(x / gw * asp, v, T, pal, dark, asp);
            d[i] = out[0]; d[i + 1] = out[1]; d[i + 2] = out[2]; d[i + 3] = 255;
          }
        }
        sx.putImageData(img, 0, 0);
        c.imageSmoothingEnabled = !o.pixel; c.imageSmoothingQuality = 'high';
        c.drawImage(small, 0, 0, w, h);
      }
    });
    return s.destroy;
  }

  R.define('bg-silk', {
    selector: '.bg-silk',
    mount: function (el) {
      var o = R.opts(el, { speed: 1, scale: 2.2, res: 6, pixel: false });
      var lo, hi, mid, cache = null;
      return field(el, o, function (u, v, T, p, dark) {
        if (cache !== p) {
          cache = p; var c = p.color, white = [255, 255, 255];
          lo = dark ? mix(p.bg, c, 0.16) : mix(c, p.bg, 0.5);
          mid = dark ? mix(p.bg, c, 0.55) : mix(c, white, 0.62);
          hi = dark ? mix(c, white, 0.45) : mix(c, white, 0.92);
        }
        var x = u * o.scale, y = v * o.scale;
        var a = x * 1.3 + Math.sin(y * 1.9 + T * 0.33) * 0.9;
        var b = y * 1.15 + Math.sin(x * 1.5 - T * 0.27) * 0.7;
        var f = Math.sin(a * 2.1 + Math.sin(b * 2.8 + T * 0.38) * 1.4 + T * 0.18);
        var s1 = 0.5 + 0.5 * f;
        var spec = Math.pow(Math.max(0, f), 7);
        var base = s1 < 0.5 ? mix(lo, mid, s1 * 2) : mix(mid, hi, (s1 - 0.5) * 2 * 0.6);
        return mix(base, hi, spec * 0.85);
      });
    }
  });

  R.define('bg-liquid', {
    selector: '.bg-liquid',
    mount: function (el) {
      var o = R.opts(el, { speed: 1, res: 5, swirl: 2.6, pixel: false });
      return field(el, o, function (u, v, T, p, dark, asp) {
        var dx = u - asp / 2, dy = v - 0.5, r = Math.sqrt(dx * dx + dy * dy);
        var ang = Math.atan2(dy, dx) + T * 0.18 + o.swirl * Math.max(0, 1.1 - r) + Math.sin(r * 6 - T * 0.7) * 0.25;
        var px = Math.cos(ang) * r * 4, py = Math.sin(ang) * r * 4;
        for (var k = 0; k < 3; k++) { var nx = px + Math.sin(py * 1.3 + T * 0.4 + k) * 0.6; py = py + Math.cos(px * 1.1 - T * 0.3 + k * 1.7) * 0.6; px = nx; }
        var n = 0.5 + 0.5 * Math.sin(px + py * 0.7);
        var m = 0.5 + 0.5 * Math.sin(px * 0.6 - py * 1.2 + 1.4);
        var c1 = p.list[0], c2 = p.list[1], c3 = p.list[2];
        var col = mix(mix(c1, c2, smooth(n)), c3, smooth(m) * 0.75);
        return dark ? mix(col, [9, 9, 11], 0.22) : col;
      });
    }
  });
  function smooth(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; t = (t - 0.3) / 0.4; t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }

  /* =====================================================================
     Gradient orbs: blurred orbs that softly chase the cursor
     ===================================================================== */
  R.define('bg-gradient-orbs', {
    selector: '.bg-gradient-orbs',
    mount: function (el) {
      var o = R.opts(el, { count: 4, follow: true });
      var orbs = [], mouse = null, w = 0, h = 0, ro;
      var vars = ['--c1', '--c2', '--c3', '--c4'];
      var custom = (el.getAttribute('data-colors') || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
      for (var i = 0; i < o.count; i++) {
        var s = D.createElement('span'); s.className = 'bg-orb'; s.setAttribute('aria-hidden', 'true');
        s.style.setProperty('--oc', custom[i % 4] || 'var(' + vars[i % 4] + ')');
        el.appendChild(s);
        orbs.push({ el: s, x: 0, y: 0, k: 0.018 + i * 0.012, ph: i * 1.7, size: 0 });
      }
      function size() {
        w = el.clientWidth; h = el.clientHeight;
        orbs.forEach(function (b, i) { b.size = Math.max(160, Math.min(w, h) * (0.75 - i * 0.1)); b.el.style.setProperty('--s', b.size + 'px'); if (!b.x) { b.x = w / 2; b.y = h / 2; } });
      }
      size();
      if ('ResizeObserver' in W) { ro = new ResizeObserver(size); ro.observe(el); }
      function place(t, k) {
        orbs.forEach(function (b, i) {
          var T = t / 1000;
          var tx = w * (0.5 + 0.32 * Math.cos(T * (0.13 + i * 0.04) + b.ph)), ty = h * (0.5 + 0.3 * Math.sin(T * (0.17 + i * 0.03) + b.ph * 1.3));
          if (mouse) { var off = (i - (orbs.length - 1) / 2) * 50; tx = mouse.x + off; ty = mouse.y - off * 0.6; }
          b.x += (tx - b.x) * Math.min(1, b.k * k); b.y += (ty - b.y) * Math.min(1, b.k * k);
          b.el.style.transform = 'translate3d(' + (b.x - b.size / 2).toFixed(1) + 'px,' + (b.y - b.size / 2).toFixed(1) + 'px,0)';
        });
      }
      var stop = null, t = 0;
      if (R.reducedMotion) { orbs.forEach(function (b) { b.k = 1; }); place(2000, 1); }
      else stop = R.loop(el, function (_, dt) { t += dt; place(t, dt / 16.67); });
      var offP = o.follow ? pointer(el, function (x, y) { mouse = { x: x, y: y }; }, function () { mouse = null; }) : function () {};
      return function () { if (stop) stop(); if (ro) ro.disconnect(); offP(); orbs.forEach(function (b) { b.el.remove(); }); };
    }
  });

  /* =====================================================================
     Dots spotlight (CSS does the drawing; JS only feeds the cursor)
     ===================================================================== */
  R.define('bg-dot-pattern', {
    selector: '.bg-dot-pattern',
    mount: function (el) {
      if (el.hasAttribute('data-no-spotlight')) return;
      return pointer(el, function (x, y) {
        el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px'); el.setAttribute('data-active', '');
      }, function () { el.removeAttribute('data-active'); });
    }
  });

  /* ---------- generic generator for DOM-span effects with resize ---------- */
  function spans(el, cls, n, place) {
    var list = [], ro = null;
    for (var i = 0; i < n; i++) {
      var s = D.createElement('span'); s.className = cls; s.setAttribute('aria-hidden', 'true');
      el.appendChild(s); list.push(s);
    }
    function all() { var w = el.clientWidth, h = el.clientHeight; list.forEach(function (s, i) { place(s, i, w, h, true); }); }
    all();
    var offIt = R.on(el, 'animationiteration', function (e) { if (e.target.parentNode === el && list.indexOf(e.target) > -1) place(e.target, list.indexOf(e.target), el.clientWidth, el.clientHeight, false); });
    if ('ResizeObserver' in W) { ro = new ResizeObserver(all); ro.observe(el); }
    return function () { offIt(); if (ro) ro.disconnect(); list.forEach(function (s) { s.remove(); }); };
  }

  /* Grid glow cells */
  R.define('bg-line-grid', {
    selector: '.bg-line-grid[data-cells]',
    mount: function (el) {
      var n = R.attr(el, 'data-cells', 8);
      return spans(el, 'bg-line-grid-cell', n, function (s, i, w, h, first) {
        var cell = parseFloat(cssv(el, '--cell')) || 40;
        var x0 = ((w / 2) % cell), y0 = ((h / 2) % cell);
        var cols = Math.floor((w - x0) / cell), rows = Math.floor((h - y0) / cell);
        var cx = Math.floor(cols * (0.15 + Math.random() * 0.7)), cy = Math.floor(rows * (0.1 + Math.random() * 0.7));
        s.style.left = (x0 + cx * cell + 1) + 'px'; s.style.top = (y0 + cy * cell + 1) + 'px';
        if (first) { s.style.setProperty('--d', rand(2.5, 5).toFixed(2) + 's'); s.style.setProperty('--delay', (-rand(0, 5)).toFixed(2) + 's'); }
      });
    }
  });

  /* Beams falling along the rails */
  R.define('bg-beams', {
    selector: '.bg-beams',
    mount: function (el) {
      var n = R.attr(el, 'data-count', 7);
      return spans(el, 'bg-beam', n, function (s, i, w, h, first) {
        var gap = parseFloat(cssv(el, '--gap')) || 72, x0 = (w / 2) % gap, rails = Math.max(1, Math.floor((w - x0) / gap) + 1);
        var len = Math.round(rand(70, 180));
        s.style.left = (x0 + Math.floor(Math.random() * rails) * gap) + 'px';
        s.style.setProperty('--len', len + 'px'); s.style.setProperty('--travel', (h + len) + 'px');
        if (first) { s.style.setProperty('--d', rand(3, 7).toFixed(2) + 's'); s.style.setProperty('--delay', (-rand(0, 7)).toFixed(2) + 's'); }
      });
    }
  });

  /* Meteors */
  R.define('bg-meteors', {
    selector: '.bg-meteors',
    mount: function (el) {
      var n = R.attr(el, 'data-count', 14), ang = R.attr(el, 'data-angle', 145);
      return spans(el, 'bg-meteor', n, function (s, i, w, h, first) {
        s.style.left = rand(0.1, 1.15) * w + 'px'; s.style.top = rand(-0.15, 0.45) * h + 'px';
        s.style.setProperty('--ang', ang + 'deg'); s.style.setProperty('--dist', Math.round(Math.max(w, h) * rand(0.8, 1.3)) + 'px');
        s.style.setProperty('--tail', Math.round(rand(50, 120)) + 'px');
        if (first) { s.style.setProperty('--d', rand(3.5, 9).toFixed(2) + 's'); s.style.setProperty('--delay', (-rand(0, 9)).toFixed(2) + 's'); }
      });
    }
  });

  /* Ripple rings */
  R.define('bg-ripple', {
    selector: '.bg-ripple',
    mount: function (el) {
      var o = R.opts(el, { rings: 8, size: 130, step: 84 });
      var list = [];
      for (var i = 0; i < o.rings; i++) {
        var s = D.createElement('span'); s.className = 'bg-ripple-ring'; s.setAttribute('aria-hidden', 'true');
        s.style.setProperty('--s', (o.size + i * o.step) + 'px');
        s.style.setProperty('--o', (0.75 - i * (0.7 / o.rings)).toFixed(3));
        s.style.setProperty('--delay', (i * 0.09).toFixed(2) + 's');
        s.style.zIndex = String(o.rings - i);
        el.appendChild(s); list.push(s);
      }
      return function () { list.forEach(function (s) { s.remove(); }); };
    }
  });
})(window.Ranj);

;
/* Ranj UI — Animated icons: hamburger, morph icons, status icons */
(function (R) {
  'use strict';
  if (!R) return;
  var D = document;

  /* Hamburger: toggles aria-expanded (and the element in aria-controls gets data-state) */
  R.define('hamburger', {
    selector: '.hamburger',
    mount: function (el) {
      if (!el.children.length) el.innerHTML = '<span></span><span></span><span></span>';
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      if (!el.hasAttribute('aria-expanded')) el.setAttribute('aria-expanded', 'false');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Menu');
      return R.on(el, 'click', function () {
        if (el.hasAttribute('data-manual')) return;
        var open = el.getAttribute('aria-expanded') !== 'true';
        el.setAttribute('aria-expanded', String(open));
        var t = el.getAttribute('aria-controls') && D.getElementById(el.getAttribute('aria-controls'));
        if (t) t.setAttribute('data-state', open ? 'open' : 'closed');
        R.emit(el, 'change', { open: open });
      });
    }
  });

  var MORPH = {
    'play-pause': '<span class="morph-box" aria-hidden="true"><i></i><i></i></span>',
    'plus-close': '<span class="morph-box" aria-hidden="true"><i class="mb"></i><i class="mb"></i></span>',
    chevron: '<span class="morph-box" aria-hidden="true"><i class="mb"></i><i class="mb"></i></span>',
    'search-close': '<span class="morph-box" aria-hidden="true"><i class="morph-ring"></i><i class="mb"></i><i class="mb"></i></span>',
    volume: '<span class="morph-box" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path class="mv-wave" d="M15.5 9.5a4 4 0 0 1 0 5"/><path class="mv-wave" d="M18.5 6.5a8 8 0 0 1 0 11"/><path class="mv-x" pathLength="1" d="M16 9.5l5 5"/><path class="mv-x" pathLength="1" d="M21 9.5l-5 5"/></svg></span>',
    weather: '<span class="morph-box" aria-hidden="true"><svg viewBox="0 0 32 32"><g class="mw-sun"><g class="mw-rays"><path d="M16 3v2.5M16 22.5V25M5 14h2.5M24.5 14H27M8.2 6.2l1.8 1.8M22 20l1.8 1.8M8.2 21.8 10 20M22 8l1.8-1.8"/></g><circle cx="16" cy="14" r="5.5"/></g>' +
      '<path class="mw-cloud" d="M10.5 26h12.2a5.3 5.3 0 0 0 .6-10.6 7.2 7.2 0 0 0-13.6 2.3A4.2 4.2 0 0 0 10.5 26z"/><g class="mw-drops"><line x1="12" y1="28" x2="11" y2="30.5"/><line x1="17" y1="28" x2="16" y2="30.5"/><line x1="22" y1="28" x2="21" y2="30.5"/></g></svg></span>'
  };
  var LABELS = { 'play-pause': ['Play', 'Pause'], 'plus-close': ['Open', 'Close'], chevron: ['Expand', 'Collapse'], 'search-close': ['Search', 'Close search'], volume: ['Mute', 'Unmute'] };
  var WEATHER = ['sun', 'cloud', 'rain'];

  R.define('morph-icon', {
    selector: '.morph-icon',
    mount: function (el) {
      var kind = el.getAttribute('data-morph') || 'play-pause';
      if (!el.querySelector('.morph-box') && MORPH[kind]) el.insertAdjacentHTML('afterbegin', MORPH[kind]);
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      var weather = kind === 'weather';
      if (weather) { if (!el.getAttribute('data-state')) el.setAttribute('data-state', 'sun'); }
      else if (!el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', 'false');
      function label() {
        if (el.hasAttribute('data-keep-label')) return;
        if (weather) el.setAttribute('aria-label', 'Weather: ' + el.getAttribute('data-state'));
        else if (LABELS[kind]) el.setAttribute('aria-label', LABELS[kind][el.getAttribute('aria-pressed') === 'true' ? 1 : 0]);
      }
      label();
      return R.on(el, 'click', function () {
        if (weather) {
          var i = (WEATHER.indexOf(el.getAttribute('data-state')) + 1) % 3;
          el.setAttribute('data-state', WEATHER[i]); label();
          R.emit(el, 'change', { state: WEATHER[i] });
        } else {
          var on = el.getAttribute('aria-pressed') !== 'true';
          el.setAttribute('aria-pressed', String(on)); label();
          R.emit(el, 'change', { pressed: on });
        }
      });
    }
  });

  /* Status icons: drawn SVG that plays when it scrolls into view */
  var SI = {
    success: '<circle class="si-bg" cx="24" cy="24" r="22"/><circle class="si-ring" pathLength="1" cx="24" cy="24" r="21" transform="rotate(-90 24 24)"/><path class="si-mark" pathLength="1" d="M15 24.5l6 6L33.5 18"/>',
    error: '<circle class="si-bg" cx="24" cy="24" r="22"/><circle class="si-ring" pathLength="1" cx="24" cy="24" r="21" transform="rotate(-90 24 24)"/><path class="si-mark" pathLength="1" d="M17 17l14 14"/><path class="si-mark" pathLength="1" d="M31 17 17 31"/>',
    warning: '<path class="si-bg" d="M24 4 45 41H3z"/><path class="si-ring" pathLength="1" d="M24 5.5 2.8 42h42.4z" stroke-linejoin="round"/><path class="si-mark" pathLength="1" d="M24 18v11"/><circle class="si-dot" cx="24" cy="35" r="2"/>',
    info: '<circle class="si-bg" cx="24" cy="24" r="22"/><circle class="si-ring" pathLength="1" cx="24" cy="24" r="21" transform="rotate(-90 24 24)"/><circle class="si-dot" cx="24" cy="15.5" r="2.2"/><path class="si-mark" pathLength="1" d="M24 21.5v12"/>'
  };
  function play(el) {
    var t = el.getAttribute('data-type') || 'success';
    el.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true">' + (SI[t] || SI.success) + '</svg>';
    if (R.reducedMotion) { R.$$('.si-ring, .si-mark', el).forEach(function (p) { p.style.strokeDashoffset = '0'; }); R.$$('.si-dot', el).forEach(function (p) { p.style.opacity = 1; }); R.$$('.si-bg', el).forEach(function (p) { p.style.opacity = .14; }); return; }
    el.removeAttribute('data-play'); void el.offsetWidth; el.setAttribute('data-play', '');
  }
  R.define('status-icon', {
    selector: '.status-icon',
    mount: function (el) {
      if (!el.hasAttribute('role')) el.setAttribute('role', 'img');
      if (!el.hasAttribute('aria-label')) { var t = el.getAttribute('data-type') || 'success'; el.setAttribute('aria-label', t.charAt(0).toUpperCase() + t.slice(1)); }
      el.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"></svg>';
      return R.inView(el, function () { play(el); }, { threshold: 0.4 });
    }
  });
  /** Ranj.statusIcon(el, [type]) — (re)play the draw animation, optionally switching type. */
  R.statusIcon = function (el, type) { if (typeof el === 'string') el = D.querySelector(el); if (!el) return; if (type) { el.setAttribute('data-type', type); el.setAttribute('aria-label', type.charAt(0).toUpperCase() + type.slice(1)); } play(el); };
})(window.Ranj);

;
/* Ranj UI — Loaders: infinite loop SVG, progress pie/donut, spinner-to-success, page-top loading bar */
(function (R) {
  'use strict';
  if (!R) return;
  var D = document;

  /* ∞ loader: SVG injected */
  R.define('loader-infinite', {
    selector: '.loader-infinite',
    mount: function (el) {
      if (el.querySelector('svg')) return;
      var id = R.uid('linf'), grad = el.classList.contains('loader-infinite-gradient');
      var d = 'M50 25C60 10 90 8 90 25S60 40 50 25 10 8 10 25 40 40 50 25z';
      el.innerHTML = '<svg viewBox="0 0 100 50" aria-hidden="true">' +
        (grad ? '<defs><linearGradient id="' + id + '" x1="0" x2="1"><stop offset="0" stop-color="var(--_c)"/><stop offset="1" stop-color="oklch(.75 .18 calc(var(--hue) + 80))"/></linearGradient></defs>' : '') +
        '<path class="li-track" d="' + d + '"/><path class="li-run" pathLength="1" d="' + d + '"' + (grad ? ' style="stroke:url(#' + id + ')"' : '') + '/></svg>';
      if (!el.hasAttribute('role')) el.setAttribute('role', 'status');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Loading');
    }
  });

  /* Pie / donut progress */
  function setP(el, v) {
    v = R.clamp(+v || 0, 0, 100);
    el.style.setProperty('--p', v);
    el.setAttribute('aria-valuenow', Math.round(v));
    var t = el.querySelector('[data-progress-text]');
    if (t) t.innerHTML = Math.round(v) + '<small>%</small>';
  }
  R.define('loader-progress', {
    selector: '.loader-pie, .loader-donut',
    mount: function (el) {
      el.setAttribute('role', 'progressbar'); el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', '100');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Progress');
      if (el.classList.contains('loader-donut') && !el.querySelector('[data-progress-text]') && !el.hasAttribute('data-no-label')) {
        var s = D.createElement('span'); s.setAttribute('data-progress-text', ''); el.appendChild(s);
      }
      if (el.hasAttribute('data-indeterminate')) { el.removeAttribute('aria-valuenow'); return; }
      var v = R.attr(el, 'data-value', 0);
      setP(el, 0);
      return R.inView(el, function () { requestAnimationFrame(function () { setP(el, v); }); }, { threshold: 0.3 });
    }
  });
  /** Ranj.progress(el, 0..100) — set a pie, donut or .loader-bar value */
  R.progress = function (el, v) {
    if (typeof el === 'string') el = D.querySelector(el);
    if (!el) return;
    if (el.classList.contains('loader-bar')) { el.style.setProperty('--p', R.clamp(+v, 0, 100)); el.setAttribute('aria-valuenow', Math.round(v)); return; }
    setP(el, v);
  };

  /* Spinner -> success / error */
  var SS = '<svg viewBox="0 0 56 56" aria-hidden="true"><circle class="ss-track" cx="28" cy="28" r="24"/><circle class="ss-fill" cx="28" cy="28" r="20"/>' +
    '<g class="ss-spin"><circle class="ss-circle" cx="28" cy="28" r="24" pathLength="1" transform="rotate(-90 28 28)"/></g>' +
    '<path class="ss-mark ss-ok" pathLength="1" d="M19 28.5l6 6L37.5 22"/><path class="ss-mark ss-bad" pathLength="1" d="M21.5 21.5l13 13"/><path class="ss-mark ss-bad" pathLength="1" d="M34.5 21.5l-13 13"/></svg>';
  var LBL = { loading: 'Loading', success: 'Done', error: 'Failed' };
  R.define('spin-success', {
    selector: '.spin-success',
    mount: function (el) {
      if (!el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', SS);
      el.setAttribute('role', 'status');
      if (!el.getAttribute('data-state')) el.setAttribute('data-state', 'loading');
      el.setAttribute('aria-label', LBL[el.getAttribute('data-state')] || 'Loading');
      var after = R.attr(el, 'data-auto', 0), t = 0;
      if (after > 0) t = setTimeout(function () { R.spinSuccess(el, el.getAttribute('data-auto-state') || 'success'); }, after);
      return function () { clearTimeout(t); };
    }
  });
  /** Ranj.spinSuccess(el, 'loading' | 'success' | 'error') */
  R.spinSuccess = function (el, state) {
    if (typeof el === 'string') el = D.querySelector(el);
    if (!el) return;
    state = state || 'success';
    if (state === 'loading' && el.getAttribute('data-state') !== 'loading') {
      // restart cleanly: rebuild the SVG so the arc starts small again
      el.querySelector('svg') && el.querySelector('svg').remove(); el.insertAdjacentHTML('afterbegin', SS);
    }
    el.setAttribute('data-state', state); el.setAttribute('aria-label', LBL[state] || state);
    R.emit(el, 'change', { state: state });
  };

  /* Page-top loading bar (NProgress-like) */
  function LoadingBar(opts) {
    opts = opts || {};
    this.parent = opts.parent || null;
    this.color = opts.color; this.height = opts.height;
    this.p = 0; this.el = null; this.timer = 0;
  }
  LoadingBar.prototype._ensure = function () {
    if (this.el && this.el.isConnected) return;
    var el = D.createElement('div'); el.className = 'loading-bar'; el.setAttribute('role', 'progressbar'); el.setAttribute('aria-label', 'Page loading');
    el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', '100');
    if (this.parent) { el.setAttribute('data-local', ''); if (getComputedStyle(this.parent).position === 'static') this.parent.style.position = 'relative'; }
    if (this.color) el.style.setProperty('--color', this.color);
    if (this.height) el.style.setProperty('--h', typeof this.height === 'number' ? this.height + 'px' : this.height);
    el.innerHTML = '<div class="loading-bar-fill"></div><div class="loading-bar-peg"></div>';
    (this.parent || D.body).appendChild(el); this.el = el;
  };
  LoadingBar.prototype.set = function (p) {
    this._ensure();
    this.p = R.clamp(p, 0, 1);
    this.el.removeAttribute('data-done');
    this.el.firstChild.style.transform = 'scaleX(' + this.p + ')';
    this.el.style.setProperty('--lb', this.p);
    this.el.setAttribute('aria-valuenow', Math.round(this.p * 100));
    return this;
  };
  LoadingBar.prototype.start = function () {
    var self = this; clearInterval(this.timer); clearTimeout(this._rm);
    if (this.el && this.el.hasAttribute('data-done')) { this.el.remove(); this.el = null; }
    this._ensure(); this.el.firstChild.style.transition = 'none'; this.set(0); void this.el.offsetWidth; this.el.firstChild.style.transition = '';
    this.set(0.08);
    this.timer = setInterval(function () { self.inc(); }, 380);
    return this;
  };
  LoadingBar.prototype.inc = function (amount) {
    var p = this.p;
    if (p >= 0.994) return this;
    amount = amount || (p < 0.2 ? 0.1 : p < 0.5 ? 0.04 : p < 0.8 ? 0.02 : 0.005);
    return this.set(Math.min(0.994, p + amount * (0.6 + Math.random() * 0.8)));
  };
  LoadingBar.prototype.done = function () {
    var self = this; clearInterval(this.timer);
    if (!this.el) return this;
    this.set(1);
    var el = this.el;
    setTimeout(function () { el.setAttribute('data-done', ''); }, 250);
    clearTimeout(this._rm); this._rm = setTimeout(function () { if (el.hasAttribute('data-done')) { el.remove(); if (self.el === el) self.el = null; } }, 1000);
    return this;
  };
  var global = new LoadingBar();
  R.loadingBar = {
    start: function () { return global.start(); },
    set: function (p) { return global.set(p); },
    inc: function (a) { return global.inc(a); },
    done: function () { return global.done(); },
    /** Separate bar inside a container: Ranj.loadingBar.create({ parent, color, height }) */
    create: function (o) { return new LoadingBar(o); }
  };
})(window.Ranj);

;
/* Ranj UI — Social micro-interactions: like, bookmark, reactions, notification bell */
(function (R) {
  'use strict';
  if (!R) return;
  var D = document;

  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.2-4.4-9.4-9C1.2 8.4 3 4.5 6.9 4.5c2.2 0 3.7 1.2 4.6 2.7.2.3.8.3 1 0 .9-1.5 2.4-2.7 4.6-2.7 3.9 0 5.7 3.9 4.3 7-2.2 4.6-9.4 9-9.4 9z"/></svg>';
  var MARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="bm-line" d="M6 3.5h12a1 1 0 0 1 1 1v16l-7-4.5-7 4.5v-16a1 1 0 0 1 1-1z"/><path class="bm-fill" d="M6 3.5h12a1 1 0 0 1 1 1v16l-7-4.5-7 4.5v-16a1 1 0 0 1 1-1z"/></svg>';

  function restart(el, attr, ms) {
    el.removeAttribute(attr); void el.offsetWidth; el.setAttribute(attr, '');
    clearTimeout(el['_t' + attr]); el['_t' + attr] = setTimeout(function () { el.removeAttribute(attr); }, ms || 700);
  }
  /** Roll a number/text inside .fx-roll: up when increasing */
  function roll(el, text, up) {
    if (!el.classList.contains('fx-roll')) { el.classList.add('fx-roll'); el.innerHTML = '<span>' + R.esc(el.textContent) + '</span>'; }
    if (R.reducedMotion) { el.innerHTML = '<span>' + R.esc(text) + '</span>'; return; }
    var old = el.lastElementChild, nu = D.createElement('span');
    nu.textContent = text; nu.className = up ? 'fx-roll-in-up' : 'fx-roll-in-down';
    el.appendChild(nu); void nu.offsetWidth;
    nu.className = '';
    if (old) { old.className = up ? 'fx-roll-out-up' : 'fx-roll-out-down'; setTimeout(function () { old.remove(); }, 380); }
  }
  R.fxRoll = roll;
  function fmt(n) { return n >= 10000 ? (n / 1000).toFixed(n >= 100000 ? 0 : 1).replace(/\.0$/, '') + 'k' : n.toLocaleString('en-US'); }
  /** Radial particle burst inside host */
  function burst(host, colors, n, dist) {
    if (R.reducedMotion) return;
    for (var i = 0; i < n; i++) {
      var p = D.createElement('i'), a = (i / n) * Math.PI * 2 + Math.random() * 0.4, d = dist * (0.7 + Math.random() * 0.5);
      p.className = 'fx-particle'; p.setAttribute('aria-hidden', 'true');
      p.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px');
      p.style.setProperty('--dy', (Math.sin(a) * d).toFixed(1) + 'px');
      p.style.setProperty('--s', (3 + Math.random() * 4).toFixed(1) + 'px');
      p.style.setProperty('--c', colors[i % colors.length]);
      host.appendChild(p);
      setTimeout(p.remove.bind(p), 800);
    }
  }
  R.fxBurst = burst;

  /** Toggle buttons with counts: .like-btn, .bookmark-btn */
  function pressable(kind, svg, colors) {
    return {
      selector: '.' + kind,
      mount: function (el) {
        var icon = el.querySelector('.' + kind + '-icon');
        if (!icon) { icon = D.createElement('span'); icon.className = kind + '-icon'; icon.innerHTML = svg; el.insertBefore(icon, el.firstChild); }
        else if (!icon.querySelector('svg')) icon.innerHTML = svg;
        if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
        if (!el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', 'false');
        var count = el.querySelector('[data-count], .' + kind + '-count');
        return R.on(el, 'click', function () {
          var on = el.getAttribute('aria-pressed') !== 'true';
          el.setAttribute('aria-pressed', String(on));
          if (count) {
            var n = parseInt(count.getAttribute('data-count') || count.textContent.replace(/[^\d]/g, ''), 10) || 0;
            n += on ? 1 : -1; count.setAttribute('data-count', n); roll(count, fmt(n), on);
          }
          if (on) { restart(el, 'data-burst', 700); burst(icon, colors(el), kind === 'like-btn' ? 10 : 6, kind === 'like-btn' ? 22 : 16); }
          R.emit(el, 'change', { pressed: on });
        });
      }
    };
  }
  R.define('like-btn', pressable('like-btn', HEART, function (el) { var c = getComputedStyle(el).getPropertyValue('--on').trim() || '#f43f5e'; return [c, '#fb923c', '#facc15', '#a78bfa', c]; }));
  R.define('bookmark-btn', pressable('bookmark-btn', MARK, function (el) { var c = getComputedStyle(el).getPropertyValue('--on').trim() || '#f59e0b'; return [c, '#fde68a']; }));

  /* ---------- Reactions ---------- */
  var DEFAULT_REACTIONS = [
    { e: '👍', l: 'Like', c: '#3b82f6' }, { e: '❤️', l: 'Love', c: '#f43f5e' }, { e: '😂', l: 'Haha', c: '#f59e0b' },
    { e: '😮', l: 'Wow', c: '#f59e0b' }, { e: '😢', l: 'Sad', c: '#f59e0b' }, { e: '🔥', l: 'Fire', c: '#f97316' }
  ];
  R.define('reaction', {
    selector: '.reaction',
    mount: function (el) {
      var trig = el.querySelector('.reaction-trigger'); if (!trig) return;
      var idle = trig.innerHTML, list = DEFAULT_REACTIONS;
      try { if (el.getAttribute('data-reactions')) list = JSON.parse(el.getAttribute('data-reactions')); } catch (e) {}
      var picker = null, hoverT = 0, leaveT = 0, longT = 0, pop = null, stopPos = null, offOut = null, current = null, offs = [];
      trig.setAttribute('aria-haspopup', 'menu'); trig.setAttribute('aria-expanded', 'false');
      if (trig.tagName === 'BUTTON' && !trig.hasAttribute('type')) trig.type = 'button';
      function open(focus) {
        if (picker) return;
        picker = D.createElement('div'); picker.className = 'reaction-picker'; picker.setAttribute('role', 'menu');
        picker.setAttribute('aria-label', 'Reactions');
        picker.innerHTML = list.map(function (r, i) { return '<button type="button" role="menuitem" class="reaction-option" style="--i:' + i + '" data-i="' + i + '" data-label="' + R.esc(r.l) + '" aria-label="' + R.esc(r.l) + '">' + r.e + '</button>'; }).join('');
        D.body.appendChild(picker);
        stopPos = R.autoPosition(picker, trig, { placement: 'top-start', offset: 8 });
        trig.setAttribute('aria-expanded', 'true');
        picker.addEventListener('click', function (e) { var b = e.target.closest('.reaction-option'); if (b) choose(+b.getAttribute('data-i')); });
        picker.addEventListener('pointerenter', function () { clearTimeout(leaveT); });
        picker.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') leaveT = setTimeout(close, 300); });
        R.roving(picker, '.reaction-option', { orientation: 'horizontal' });
        pop = R.pushLayer(function () { close(); trig.focus(); });
        offOut = R.onOutside([picker, trig], function () { close(); });
        if (focus) setTimeout(function () { var f = picker && picker.querySelector('.reaction-option'); if (f) f.focus(); }, 30);
      }
      function close() {
        if (!picker) return;
        var p = picker; picker = null;
        if (stopPos) stopPos(); if (pop) pop(); if (offOut) offOut();
        trig.setAttribute('aria-expanded', 'false');
        p.setAttribute('data-closing', ''); setTimeout(function () { p.remove(); }, 170);
      }
      function apply(r) {
        current = r;
        if (r) {
          el.setAttribute('data-reacted', ''); el.style.setProperty('--reaction-color', r.c || 'var(--primary)');
          trig.innerHTML = '<span class="reaction-emoji" aria-hidden="true">' + r.e + '</span><span>' + R.esc(r.l) + '</span>';
          trig.setAttribute('aria-pressed', 'true'); restart(trig, 'data-pop', 600);
          if (!R.reducedMotion) burst(trig.querySelector('.reaction-emoji'), [r.c || '#3b82f6', '#facc15', '#f472b6'], 8, 18);
        } else {
          el.removeAttribute('data-reacted'); trig.innerHTML = idle; trig.setAttribute('aria-pressed', 'false');
        }
        R.emit(el, 'change', { reaction: r ? r.l : null, emoji: r ? r.e : null });
      }
      function choose(i) { close(); apply(list[i]); trig.focus(); }
      offs.push(R.on(trig, 'click', function () {
        if (trig._long) { trig._long = false; return; }
        close(); apply(current ? null : list[0]);
      }));
      offs.push(R.on(trig, 'pointerenter', function (e) { if (e.pointerType !== 'mouse') return; clearTimeout(leaveT); hoverT = setTimeout(function () { open(false); }, 450); }));
      offs.push(R.on(trig, 'pointerleave', function (e) { clearTimeout(hoverT); if (e.pointerType === 'mouse') leaveT = setTimeout(close, 350); }));
      offs.push(R.on(trig, 'pointerdown', function (e) { if (e.pointerType === 'mouse') return; longT = setTimeout(function () { trig._long = true; open(false); }, 420); }));
      offs.push(R.on(trig, 'pointerup', function () { clearTimeout(longT); }));
      offs.push(R.on(trig, 'contextmenu', function (e) { if (picker) e.preventDefault(); }));
      offs.push(R.on(trig, 'keydown', function (e) { if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); open(true); } }));
      return function () { offs.forEach(function (f) { f(); }); clearTimeout(hoverT); clearTimeout(leaveT); close(); };
    }
  });

  /* ---------- Notification bell ---------- */
  var BELL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="bell-body" d="M6 9a6 6 0 0 1 12 0c0 6.5 2.5 8.5 2.5 8.5h-17S6 15.5 6 9z"/><path class="bell-clapper" d="M10 20.5a2.2 2.2 0 0 0 4 0"/></svg>';
  function setBell(el, n, ring) {
    var b = el.querySelector('.bell-badge');
    if (!b) { b = D.createElement('span'); b.className = 'bell-badge'; b.setAttribute('aria-hidden', 'true'); el.appendChild(b); }
    var prev = parseInt(el.getAttribute('data-count') || '0', 10);
    n = Math.max(0, n | 0);
    if (n > 0) { el.setAttribute('data-count', n); b.textContent = n > 99 ? '99+' : n; } else el.removeAttribute('data-count');
    var base = el.getAttribute('data-label') || 'Notifications';
    el.setAttribute('aria-label', n ? base + ', ' + n + ' unread' : base);
    if (ring !== false && n > prev) { restart(el, 'data-ring', 1000); restart(el, 'data-bump', 900); }
  }
  R.define('bell', {
    selector: '.bell',
    mount: function (el) {
      if (!el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', BELL);
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      if (!el.getAttribute('data-label')) el.setAttribute('data-label', el.getAttribute('aria-label') || 'Notifications');
      setBell(el, R.attr(el, 'data-count', 0), false);
      return R.on(el, 'pointerenter', function () { if (!el.hasAttribute('data-ring') && !R.reducedMotion) restart(el, 'data-ring', 1000); });
    }
  });
  /** Ranj.bell(el, count) — set the unread count; rings + bumps when it goes up. */
  R.bell = function (el, n) { if (typeof el === 'string') el = D.querySelector(el); if (el) setBell(el, n); };
})(window.Ranj);

;
/* Ranj UI — Fancy toggles (day/night, liquid glass toggle, toggle pack) + liquid glass menu */
(function (R) {
  'use strict';
  if (!R) return;
  var D = document;

  var INNER = {
    daynight: '<span class="daynight-sky" aria-hidden="true"><span class="daynight-stars"><i></i><i></i><i></i><i></i><i></i></span><span class="daynight-clouds"><i></i><i></i><i></i></span></span>' +
      '<span class="daynight-knob" aria-hidden="true"><span class="daynight-moon"><i></i><i></i><i></i></span></span>',
    'lg-toggle': '<span class="lg-toggle-knob" aria-hidden="true"></span>',
    tgl: '<span class="tgl-knob" aria-hidden="true"></span>',
    'tgl-icon': '<span class="tgl-knob" aria-hidden="true"><span class="tgl-ico"><i></i><i></i></span></span>'
  };

  /** Shared switch behaviour: role=switch button, click/Space/Enter toggles, emits ranj:change */
  R.define('fx-switch', {
    selector: '.daynight, .lg-toggle, .tgl',
    mount: function (el) {
      var kind = el.classList.contains('daynight') ? 'daynight' : el.classList.contains('lg-toggle') ? 'lg-toggle' : el.classList.contains('tgl-icon') ? 'tgl-icon' : 'tgl';
      if (!el.children.length) el.insertAdjacentHTML('beforeend', INNER[kind]);
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      if (el.tagName !== 'BUTTON' && !el.hasAttribute('tabindex')) el.tabIndex = 0;
      el.setAttribute('role', 'switch');
      var themed = el.hasAttribute('data-theme-toggle');
      if (themed) el.setAttribute('aria-checked', String(R.theme.get() === 'dark'));
      else if (!el.hasAttribute('aria-checked')) el.setAttribute('aria-checked', 'false');
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby') && kind === 'daynight') el.setAttribute('aria-label', 'Dark mode');
      var offs = [];
      function set(v) {
        if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return;
        el.setAttribute('aria-checked', String(v));
        var k = el.querySelector('.tgl-knob'); if (k) k.setAttribute('data-touched', '');
        if (themed) R.theme.set(v ? 'dark' : 'light');
        R.emit(el, 'change', { checked: v });
      }
      offs.push(R.on(el, 'click', function () { set(el.getAttribute('aria-checked') !== 'true'); }));
      if (el.tagName !== 'BUTTON') offs.push(R.on(el, 'keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); el.click(); } }));
      // pressing state (liquid lens)
      offs.push(R.on(el, 'pointerdown', function () { el.setAttribute('data-pressing', ''); }));
      var up = function () { el.removeAttribute('data-pressing'); };
      offs.push(R.on(D, 'pointerup', up)); offs.push(R.on(D, 'pointercancel', up));
      if (themed) offs.push(R.on(D.documentElement, 'ranj:theme', function (e) { el.setAttribute('aria-checked', String(e.detail.theme === 'dark')); }));
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  /** Liquid glass menu: a glass lens slides (and stretches) to the active item */
  R.define('lg-menu', {
    selector: '.lg-menu',
    mount: function (el) {
      var vertical = el.classList.contains('lg-menu-vertical');
      var lens = D.createElement('span'); lens.className = 'lg-menu-lens'; lens.setAttribute('aria-hidden', 'true');
      el.insertBefore(lens, el.firstChild);
      var items = function () { return R.$$('.lg-menu-item', el); };
      var tmr = 0, offs = [];
      function current() { return el.querySelector('.lg-menu-item[aria-current], .lg-menu-item[aria-selected="true"]') || items()[0]; }
      function moveTo(it, instant) {
        if (!it) return;
        if (instant) lens.style.transition = 'none';
        if (vertical) { lens.style.transform = 'translateY(' + it.offsetTop + 'px)'; lens.style.height = it.offsetHeight + 'px'; }
        else { lens.style.transform = 'translateX(' + it.offsetLeft + 'px)'; lens.style.width = it.offsetWidth + 'px'; }
        if (instant) { lens.offsetWidth; lens.style.transition = ''; return; }
        el.setAttribute('data-moving', ''); clearTimeout(tmr);
        tmr = setTimeout(function () { el.removeAttribute('data-moving'); }, 260);
      }
      function select(it) {
        items().forEach(function (i) {
          var on = i === it;
          if (i.hasAttribute('aria-selected')) i.setAttribute('aria-selected', String(on));
          else if (on) i.setAttribute('aria-current', 'page'); else i.removeAttribute('aria-current');
        });
        moveTo(it);
        R.emit(el, 'change', { item: it, value: it.getAttribute('data-value') || it.textContent.trim() });
      }
      offs.push(R.on(el, 'click', '.lg-menu-item', function (e, it) { if (it.getAttribute('href') === '#') e.preventDefault(); select(it); }));
      offs.push(R.roving(el, '.lg-menu-item', { orientation: vertical ? 'vertical' : 'horizontal' }));
      var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { moveTo(current(), true); }) : null;
      if (ro) ro.observe(el);
      requestAnimationFrame(function () { moveTo(current(), true); });
      return function () { offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); clearTimeout(tmr); lens.remove(); };
    }
  });
})(window.Ranj);

;
/* Ranj UI — Interactive widgets: search reveal, odometer, counters, charging, swipe to confirm, arc slider, color palette */
(function (R) {
  'use strict';
  if (!R) return;
  var D = document, W = window;

  /* =====================================================================
     Search reveal
     ===================================================================== */
  R.define('search-reveal', {
    selector: '.search-reveal',
    mount: function (el) {
      var btn = el.querySelector('.search-reveal-btn'), input = el.querySelector('.search-reveal-input'), clear = el.querySelector('.search-reveal-clear');
      if (!btn || !input) return;
      if (!btn.querySelector('svg')) btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>';
      if (clear && !clear.querySelector('svg')) clear.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
      if (btn.tagName === 'BUTTON' && !btn.hasAttribute('type')) btn.type = 'button';
      if (clear && clear.tagName === 'BUTTON' && !clear.hasAttribute('type')) clear.type = 'button';
      if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', 'Search');
      if (clear && !clear.hasAttribute('aria-label')) clear.setAttribute('aria-label', 'Clear search');
      if (!input.hasAttribute('aria-label')) input.setAttribute('aria-label', input.getAttribute('placeholder') || 'Search');
      var open = el.getAttribute('data-state') === 'open';
      function set(o, focus) {
        open = o; el.setAttribute('data-state', o ? 'open' : 'closed');
        btn.setAttribute('aria-expanded', String(o)); input.tabIndex = o ? 0 : -1;
        if (o && focus !== false) setTimeout(function () { input.focus(); }, 60);
        R.emit(el, o ? 'open' : 'close', {});
      }
      function sync() { if (input.value) el.setAttribute('data-has-value', ''); else el.removeAttribute('data-has-value'); }
      set(open, false); sync();
      var offs = [];
      offs.push(R.on(btn, 'click', function () {
        if (!open) set(true);
        else if (input.value) R.emit(el, 'search', { query: input.value });
        else set(false);
      }));
      offs.push(R.on(input, 'input', sync));
      offs.push(R.on(input, 'keydown', function (e) {
        if (e.key === 'Escape') { e.stopPropagation(); if (input.value) { input.value = ''; sync(); } else { set(false); btn.focus(); } }
        if (e.key === 'Enter') R.emit(el, 'search', { query: input.value });
      }));
      if (clear) offs.push(R.on(clear, 'click', function () { input.value = ''; sync(); input.focus(); }));
      offs.push(R.on(el, 'focusout', function () {
        setTimeout(function () { if (open && !el.contains(D.activeElement) && !input.value && !el.hasAttribute('data-keep-open')) set(false); }, 120);
      }));
      // optional "/" shortcut
      if (el.hasAttribute('data-shortcut')) offs.push(R.on(D, 'keydown', function (e) {
        var tag = (D.activeElement && D.activeElement.tagName) || '';
        if (e.key === el.getAttribute('data-shortcut') && !/INPUT|TEXTAREA|SELECT/.test(tag) && !D.activeElement.isContentEditable) { e.preventDefault(); set(true); }
      }));
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  /* =====================================================================
     Odometer
     ===================================================================== */
  function formatNum(el, v) {
    var dec = R.attr(el, 'data-decimals', -1);
    if (dec < 0) { var s = String(el._raw != null ? el._raw : v); dec = s.indexOf('.') > -1 ? s.split('.')[1].length : 0; }
    var str = el.getAttribute('data-format') === 'none' ? Number(v).toFixed(dec) : Number(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    return (el.getAttribute('data-prefix') || '') + str + (el.getAttribute('data-suffix') || '');
  }
  function digitCol(d) {
    var c = D.createElement('span'); c.className = 'odo-digit';
    var strip = D.createElement('span'); strip.className = 'odo-strip';
    for (var i = 0; i < 10; i++) { var s = D.createElement('span'); s.textContent = i; strip.appendChild(s); }
    c.appendChild(strip); strip.style.setProperty('--d', d);
    return c;
  }
  function odometer(el, value) {
    if (typeof el === 'string') el = D.querySelector(el);
    if (!el) return;
    el._raw = value;
    var text = formatNum(el, value), prev = el._text || '';
    el._text = text;
    el.setAttribute('aria-label', text); el.setAttribute('role', el.getAttribute('role') || 'img');
    var chars = text.split(''), cols = Array.prototype.slice.call(el.children);
    var same = prev.length === text.length && cols.length === chars.length && chars.every(function (ch, i) { return /\d/.test(ch) === /\d/.test(prev[i]) && (/\d/.test(ch) || ch === prev[i]); });
    if (!same) {
      // rebuild, aligning old digits from the right so the roll continues naturally
      var old = prev.split(''), frag = D.createDocumentFragment();
      chars.forEach(function (ch, i) {
        var oi = old.length - (chars.length - i), oc = oi >= 0 ? old[oi] : null;
        if (/\d/.test(ch)) { var col = digitCol(oc && /\d/.test(oc) ? +oc : 0); if (oi < 0 && prev) col.classList.add('odo-enter'); frag.appendChild(col); }
        else { var sp = D.createElement('span'); sp.className = 'odo-sep'; sp.textContent = ch; frag.appendChild(sp); }
      });
      el.innerHTML = ''; el.appendChild(frag); void el.offsetWidth;
      cols = Array.prototype.slice.call(el.children);
    }
    var n = chars.length;
    chars.forEach(function (ch, i) {
      if (!/\d/.test(ch)) return;
      var strip = cols[i].firstChild;
      strip.style.setProperty('--odo-delay', ((n - 1 - i) * 0.05).toFixed(2) + 's');
      strip.style.setProperty('--d', ch);
    });
  }
  R.odometer = odometer;
  R.define('odometer', {
    selector: '.odometer',
    mount: function (el) {
      var target = R.attr(el, 'data-value', parseFloat(el.textContent.replace(/[^\d.-]/g, '')) || 0);
      var raw = el.getAttribute('data-value') || el.textContent.replace(/[^\d.-]/g, '');
      el.textContent = '';
      if (el.hasAttribute('data-from') && !R.reducedMotion) {
        el._raw = raw; odometer(el, R.attr(el, 'data-from', 0));
        return R.inView(el, function () { setTimeout(function () { el._raw = raw; odometer(el, target); }, 120); }, { threshold: 0.5 });
      }
      el._raw = raw; odometer(el, target);
    }
  });

  /* =====================================================================
     Counters (glass / dotted circle / progress ring)
     ===================================================================== */
  R.define('counter', {
    selector: '.counter',
    mount: function (el) {
      var o = R.opts(el, { value: 0, min: 0, max: 99, step: 1 });
      var v = o.value, out = el.querySelector('[data-counter-value]'), inc = el.querySelector('[data-counter="inc"]'), dec = el.querySelector('[data-counter="dec"]');
      var dots = [], ring = el.querySelector('.counter-dots-ring');
      if (ring) {
        var n = R.attr(el, 'data-dots', 30);
        for (var i = 0; i < n; i++) {
          var d = D.createElement('i'); d.className = 'counter-dot'; d.setAttribute('aria-hidden', 'true');
          d.style.setProperty('--a', (i / n * 360) + 'deg'); ring.insertBefore(d, ring.firstChild); dots.push(d);
        }
      }
      if (out) { out.setAttribute('aria-live', 'polite'); if (out.classList.contains('odometer')) out.setAttribute('data-value', v); }
      [inc, dec].forEach(function (b) { if (b && b.tagName === 'BUTTON' && !b.hasAttribute('type')) b.type = 'button'; });
      if (inc && !inc.hasAttribute('aria-label')) inc.setAttribute('aria-label', 'Increase');
      if (dec && !dec.hasAttribute('aria-label')) dec.setAttribute('aria-label', 'Decrease');
      var last = v;
      function render(first) {
        var p = (v - o.min) / Math.max(1e-9, o.max - o.min);
        el.style.setProperty('--p', p.toFixed(4));
        if (out) { if (out.classList.contains('odometer')) { if (!first) odometer(out, v); } else out.textContent = v; }
        if (inc) inc.disabled = v >= o.max; if (dec) dec.disabled = v <= o.min;
        var on = Math.round(p * dots.length), up = v >= last;
        dots.forEach(function (d, i) {
          d.style.setProperty('--dl', (up ? Math.max(0, i - Math.round(((last - o.min) / Math.max(1e-9, o.max - o.min)) * dots.length)) : 0) * 18 + 'ms');
          if (i < on) d.setAttribute('data-on', ''); else d.removeAttribute('data-on');
        });
        last = v;
      }
      function set(nv) {
        nv = R.clamp(Math.round(nv / o.step) * o.step, o.min, o.max);
        if (nv === v) return; v = nv; render(); R.emit(el, 'change', { value: v });
      }
      render(true);
      var offs = [], hold = 0, rep = 0;
      function startHold(dir) { stopHold(); hold = setTimeout(function () { rep = setInterval(function () { set(v + dir * o.step); }, 90); }, 420); }
      function stopHold() { clearTimeout(hold); clearInterval(rep); }
      [[inc, 1], [dec, -1]].forEach(function (pair) {
        var b = pair[0], dir = pair[1]; if (!b) return;
        offs.push(R.on(b, 'click', function () { set(v + dir * o.step); }));
        offs.push(R.on(b, 'pointerdown', function () { startHold(dir); }));
      });
      offs.push(R.on(D, 'pointerup', stopHold)); offs.push(R.on(D, 'pointercancel', stopHold));
      offs.push(R.on(el, 'keydown', function (e) {
        if (e.target.closest('input')) return;
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); set(v + o.step); }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); set(v - o.step); }
        else if (e.key === 'Home') { e.preventDefault(); set(o.min); } else if (e.key === 'End') { e.preventDefault(); set(o.max); }
      }));
      el._counterSet = set;
      return function () { offs.forEach(function (f) { f(); }); stopHold(); dots.forEach(function (d) { d.remove(); }); };
    }
  });
  R.counter = function (el, v) { if (typeof el === 'string') el = D.querySelector(el); if (el && el._counterSet) el._counterSet(v); };

  /* =====================================================================
     Charging
     ===================================================================== */
  var BOLT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4.5 13.5h6L9.5 22l9-11.5h-6z"/></svg>';
  function setCharge(el, level) {
    level = R.clamp(+level || 0, 0, 100);
    var txt = el.querySelector('[data-charging-text]'), from = el._lvl || 0;
    el._lvl = level;
    el.style.setProperty('--level', level);
    if (level <= R.attr(el, 'data-low-at', 20)) el.setAttribute('data-low', ''); else el.removeAttribute('data-low');
    el.setAttribute('aria-valuenow', Math.round(level));
    if (!txt) return;
    if (R.reducedMotion) { txt.textContent = Math.round(level) + '%'; return; }
    var t0 = performance.now(), dur = 1600;
    cancelAnimationFrame(el._raf);
    (function tick(t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      txt.textContent = Math.round(from + (level - from) * e) + '%';
      if (k < 1) el._raf = requestAnimationFrame(tick);
    })(t0);
  }
  R.define('charging', {
    selector: '.charging',
    mount: function (el) {
      var info = el.querySelector('.charging-info');
      if (info && !info.querySelector('svg')) info.insertAdjacentHTML('afterbegin', BOLT);
      el.setAttribute('role', 'meter'); el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', '100');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Battery level');
      var lvl = R.attr(el, 'data-level', 0);
      return R.inView(el, function () { setCharge(el, lvl); }, { threshold: 0.3 });
    }
  });
  /** Ranj.charging(el, level 0..100) */
  R.charging = function (el, lvl) { if (typeof el === 'string') el = D.querySelector(el); if (el) setCharge(el, lvl); };

  /* =====================================================================
     Swipe to confirm
     ===================================================================== */
  R.define('swipe', {
    selector: '.swipe',
    mount: function (el) {
      var handle = el.querySelector('.swipe-handle'); if (!handle) return;
      if (!handle.querySelector('svg')) handle.innerHTML = '<svg class="sw-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 6l6 6-6 6"/></svg><svg class="sw-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
      el.setAttribute('role', 'slider'); el.tabIndex = 0;
      el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', '100'); el.setAttribute('aria-valuenow', '0');
      if (!el.hasAttribute('aria-label')) { var t = el.querySelector('.swipe-text'); el.setAttribute('aria-label', t ? t.textContent.trim() : 'Slide to confirm'); }
      var x = 0, max = 0, startX = 0, startPos = 0, drag = false, done = false, resetT = 0;
      function measure() { max = el.clientWidth - handle.offsetWidth - 2 * (handle.offsetLeft); }
      function setX(nx) {
        x = R.clamp(nx, 0, max); el.style.setProperty('--x', x + 'px'); el.style.setProperty('--t', (max ? x / max : 0).toFixed(3));
        el.setAttribute('aria-valuenow', Math.round(max ? x / max * 100 : 0));
      }
      function complete() {
        measure(); done = true; setX(max); el.setAttribute('data-state', 'done'); el.setAttribute('aria-valuetext', 'Confirmed');
        R.emit(el, 'confirm', {});
        var r = R.attr(el, 'data-reset', 0); if (r > 0) { clearTimeout(resetT); resetT = setTimeout(reset, r); }
      }
      function reset() { done = false; el.removeAttribute('data-state'); el.removeAttribute('aria-valuetext'); setX(0); }
      var offs = [];
      offs.push(R.on(handle, 'pointerdown', function (e) {
        if (done) return; measure(); drag = true; startX = e.clientX; startPos = x;
        handle.setPointerCapture(e.pointerId); el.setAttribute('data-dragging', ''); e.preventDefault();
      }));
      offs.push(R.on(handle, 'pointermove', function (e) { if (drag) setX(startPos + e.clientX - startX); }));
      function end() {
        if (!drag) return; drag = false; el.removeAttribute('data-dragging');
        if (x >= max * 0.88) complete(); else setX(0);
      }
      offs.push(R.on(handle, 'pointerup', end)); offs.push(R.on(handle, 'pointercancel', end));
      offs.push(R.on(el, 'keydown', function (e) {
        if (done) return; measure();
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'End') { e.preventDefault(); complete(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); setX(x + max * 0.25); if (x >= max * 0.99) complete(); }
        else if (e.key === 'ArrowLeft' || e.key === 'Home') { e.preventDefault(); setX(e.key === 'Home' ? 0 : x - max * 0.25); }
      }));
      el._swipeReset = reset;
      return function () { offs.forEach(function (f) { f(); }); clearTimeout(resetT); };
    }
  });
  R.swipe = { reset: function (el) { if (typeof el === 'string') el = D.querySelector(el); if (el && el._swipeReset) el._swipeReset(); } };

  /* =====================================================================
     Circular arc slider (270 degree dial)
     ===================================================================== */
  var NS = 'http://www.w3.org/2000/svg';
  R.define('arc-slider', {
    selector: '.arc-slider',
    mount: function (el) {
      var o = R.opts(el, { value: 50, min: 0, max: 100, step: 1, unit: '', label: '', ticks: 24 });
      var id = R.uid('arc'), C = 100, Rr = 80, A0 = 135, SW = 270;
      var svg = '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="var(--c1)"/><stop offset="1" stop-color="var(--c2)"/></linearGradient></defs>';
      for (var i = 0; i <= o.ticks; i++) {
        var a = (A0 + SW * i / o.ticks) * Math.PI / 180, r1 = 96, r2 = i % 6 === 0 ? 103 : 100;
        svg += '<line class="arc-tick" data-i="' + i + '" x1="' + (C + r1 * Math.cos(a)).toFixed(2) + '" y1="' + (C + r1 * Math.sin(a)).toFixed(2) + '" x2="' + (C + r2 * Math.cos(a)).toFixed(2) + '" y2="' + (C + r2 * Math.sin(a)).toFixed(2) + '"/>';
      }
      svg += '<circle class="arc-track" cx="100" cy="100" r="80" pathLength="100" stroke-dasharray="75 100" transform="rotate(135 100 100)"/>' +
        '<circle class="arc-value" cx="100" cy="100" r="80" pathLength="100" stroke-dasharray="0 100" transform="rotate(135 100 100)" stroke="url(#' + id + ')"/>' +
        '<circle class="arc-thumb" r="10" cx="100" cy="100"/></svg>' +
        '<div class="arc-center"><b><span class="arc-num"></span><small>' + R.esc(o.unit) + '</small></b>' + (o.label ? '<span>' + R.esc(o.label) + '</span>' : '') + '</div>';
      el.innerHTML = svg;
      el.setAttribute('role', 'slider'); el.tabIndex = 0;
      el.setAttribute('aria-valuemin', o.min); el.setAttribute('aria-valuemax', o.max);
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', o.label || 'Value');
      var val = el.querySelector('.arc-value'), thumb = el.querySelector('.arc-thumb'), num = el.querySelector('.arc-num'), ticks = R.$$('.arc-tick', el);
      var v = o.value, p = 0;
      function render() {
        p = (v - o.min) / Math.max(1e-9, o.max - o.min);
        val.setAttribute('stroke-dasharray', (75 * p).toFixed(3) + ' 100');
        var a = (A0 + SW * p) * Math.PI / 180;
        thumb.setAttribute('cx', (C + Rr * Math.cos(a)).toFixed(2)); thumb.setAttribute('cy', (C + Rr * Math.sin(a)).toFixed(2));
        num.textContent = (o.step < 1 ? v.toFixed(String(o.step).split('.')[1].length) : Math.round(v));
        ticks.forEach(function (t, i) { if (i / o.ticks <= p + 1e-6) t.setAttribute('data-on', ''); else t.removeAttribute('data-on'); });
        el.setAttribute('aria-valuenow', v); el.setAttribute('aria-valuetext', num.textContent + (o.unit || ''));
      }
      function set(nv, commit) {
        nv = R.clamp(Math.round((nv - o.min) / o.step) * o.step + o.min, o.min, o.max);
        nv = +nv.toFixed(6);
        if (nv !== v) { v = nv; render(); R.emit(el, 'input', { value: v }); }
        if (commit) R.emit(el, 'change', { value: v });
      }
      function fromPoint(e) {
        var r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        var ang = Math.atan2(dy, dx) * 180 / Math.PI; if (ang < 0) ang += 360;
        var rel = (ang - A0 + 360) % 360;
        var np = rel > SW ? (rel < SW + 45 ? 1 : 0) : rel / SW;
        if (dragging && Math.abs(np - p) > 0.5) np = p > 0.5 ? 1 : 0; // no jumping across the gap
        set(o.min + np * (o.max - o.min));
      }
      render();
      var dragging = false, offs = [];
      offs.push(R.on(el, 'pointerdown', function (e) { dragging = false; fromPoint(e); dragging = true; el.setPointerCapture(e.pointerId); el.setAttribute('data-dragging', ''); e.preventDefault(); el.focus({ preventScroll: true }); }));
      offs.push(R.on(el, 'pointermove', function (e) { if (dragging) fromPoint(e); }));
      function up() { if (!dragging) return; dragging = false; el.removeAttribute('data-dragging'); R.emit(el, 'change', { value: v }); }
      offs.push(R.on(el, 'pointerup', up)); offs.push(R.on(el, 'pointercancel', up));
      offs.push(R.on(el, 'keydown', function (e) {
        var big = (o.max - o.min) / 10, k = e.key;
        if (k === 'ArrowRight' || k === 'ArrowUp') set(v + o.step, true);
        else if (k === 'ArrowLeft' || k === 'ArrowDown') set(v - o.step, true);
        else if (k === 'PageUp') set(v + big, true); else if (k === 'PageDown') set(v - big, true);
        else if (k === 'Home') set(o.min, true); else if (k === 'End') set(o.max, true);
        else return;
        e.preventDefault();
      }));
      el._arcSet = function (nv) { set(nv, true); };
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });
  R.arcSlider = function (el, v) { if (typeof el === 'string') el = D.querySelector(el); if (el && el._arcSet) el._arcSet(v); };

  /* =====================================================================
     Color palette
     ===================================================================== */
  var cv, cx;
  function toHex(c) {
    if (!cv) { cv = D.createElement('canvas'); cv.width = cv.height = 1; cx = cv.getContext('2d', { willReadFrequently: true }); }
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
    var d = cx.getImageData(0, 0, 1, 1).data;
    return { hex: '#' + [d[0], d[1], d[2]].map(function (n) { return ('0' + n.toString(16)).slice(-2); }).join(''), lum: (0.2126 * d[0] + 0.7152 * d[1] + 0.0722 * d[2]) / 255 };
  }
  R.define('palette', {
    selector: '.palette',
    mount: function (el) {
      var sw = R.$$('.palette-swatch', el), offs = [];
      el.setAttribute('role', el.getAttribute('role') || 'list');
      function paint() {
        sw.forEach(function (s) {
          var c = toHex(getComputedStyle(s).backgroundColor);
          s._hex = s.getAttribute('data-hex') || c.hex;
          if (c.lum > 0.6) s.setAttribute('data-light', ''); else s.removeAttribute('data-light');
          var code = s.querySelector('.palette-meta code'); if (code) code.textContent = s._hex;
          s.setAttribute('aria-label', (s.getAttribute('data-name') || 'Color') + ' ' + s._hex + ', copy');
        });
      }
      sw.forEach(function (s) {
        if (s.tagName === 'BUTTON' && !s.hasAttribute('type')) s.type = 'button';
        s.setAttribute('role', 'listitem');
        if (!s.querySelector('.palette-meta')) s.insertAdjacentHTML('beforeend', '<span class="palette-meta"><b>' + R.esc(s.getAttribute('data-name') || '') + '</b><code></code></span><span class="palette-copied" aria-hidden="true">Copied</span>');
      });
      paint();
      var t = 0;
      offs.push(R.on(el, 'click', '.palette-swatch', function (e, s) {
        var copy = R.copyText || function (x) { return navigator.clipboard.writeText(x); };
        Promise.resolve(copy(s._hex)).then(function () {
          sw.forEach(function (o) { o.removeAttribute('data-copied'); });
          s.setAttribute('data-copied', ''); clearTimeout(t); t = setTimeout(function () { s.removeAttribute('data-copied'); }, 1300);
          R.emit(el, 'copy', { hex: s._hex, name: s.getAttribute('data-name') });
        }, function () {});
      }));
      offs.push(R.roving(el, '.palette-swatch', { orientation: el.classList.contains('palette-vertical') ? 'vertical' : 'horizontal' }));
      var mo = new MutationObserver(function () { setTimeout(paint, 0); });
      mo.observe(D.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-accent'] });
      return function () { offs.forEach(function (f) { f(); }); mo.disconnect(); clearTimeout(t); };
    }
  });
})(window.Ranj);
