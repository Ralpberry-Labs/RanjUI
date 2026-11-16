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
