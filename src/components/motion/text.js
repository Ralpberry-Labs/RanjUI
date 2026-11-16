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
