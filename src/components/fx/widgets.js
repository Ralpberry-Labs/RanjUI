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
