/*!
 * Ranj UI — core runtime
 * Zero dependencies. Every component registers itself with Ranj.define().
 * Elements are mounted automatically on load AND whenever they are added to the
 * DOM later (MutationObserver), so you can inject HTML and it just works.
 */
(function (w, d) {
  'use strict';
  if (w.Ranj && w.Ranj.__core) return;

  var defs = [];          // [{ name, selector, mount, setup, didSetup }]
  var started = false;
  var reduced = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  function $(sel, ctx) { return (ctx || d).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }

  /** on(target, event, [selector], handler, [options]) — delegated when selector given */
  function on(el, evt, sel, fn, opts) {
    if (typeof sel === 'function') { opts = fn; fn = sel; sel = null; }
    var h = function (e) {
      if (!sel) return fn.call(el, e, el);
      var t = e.target && e.target.closest ? e.target.closest(sel) : null;
      if (t && (el === d || el === w || el.contains(t))) fn.call(t, e, t);
    };
    el.addEventListener(evt, h, opts);
    return function off() { el.removeEventListener(evt, h, opts); };
  }

  function attr(el, name, fallback) {
    var v = el.getAttribute(name);
    if (v === null || v === '') return fallback;
    if (typeof fallback === 'number') { var n = parseFloat(v); return isNaN(n) ? fallback : n; }
    if (typeof fallback === 'boolean') return v !== 'false';
    return v;
  }

  /** Read data-* options with defaults: opts(el, {speed: 1, loop: true}) reads data-speed, data-loop */
  function opts(el, defaults) {
    var out = {};
    for (var k in defaults) {
      var name = 'data-' + k.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); });
      out[k] = el.hasAttribute(name) ? attr(el, name, defaults[k]) : defaults[k];
      if (typeof defaults[k] === 'boolean' && el.hasAttribute(name) && el.getAttribute(name) === '') out[k] = true;
    }
    return out;
  }

  function emit(el, name, detail) {
    var ev = new CustomEvent('ranj:' + name, { bubbles: true, cancelable: true, detail: detail });
    return el.dispatchEvent(ev);
  }

  var uidN = 0;
  function uid(prefix) { return (prefix || 'r') + '-' + (++uidN).toString(36) + Math.random().toString(36).slice(2, 6); }
  function ensureId(el, prefix) { if (!el.id) el.id = uid(prefix); return el.id; }

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  /** Run fn once el enters the viewport (or immediately if IO unsupported). */
  function inView(el, fn, o) {
    o = o || {};
    if (!('IntersectionObserver' in w)) { fn(el); return function () {}; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { fn(el, e); if (!o.repeat) io.disconnect(); }
        else if (o.onLeave) o.onLeave(el, e);
      });
    }, { threshold: o.threshold == null ? 0.15 : o.threshold, rootMargin: o.rootMargin || '0px' });
    io.observe(el);
    return function () { io.disconnect(); };
  }

  /** rAF loop that pauses when the element is offscreen or the tab is hidden. Returns stop(). */
  function loop(el, frame) {
    var raf = 0, visible = true, running = true, last = performance.now();
    function tick(t) {
      if (!running) return;
      var dt = Math.min(64, t - last); last = t;
      if (visible && !d.hidden) frame(t, dt);
      raf = requestAnimationFrame(tick);
    }
    var io = 'IntersectionObserver' in w ? new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }) : null;
    if (io && el) io.observe(el);
    raf = requestAnimationFrame(tick);
    return function stop() { running = false; cancelAnimationFrame(raf); if (io) io.disconnect(); };
  }

  /* ---------- Focus management ---------- */
  var FOCUSABLE = 'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
  function focusables(root) {
    return $$(FOCUSABLE, root).filter(function (el) { return el.offsetParent !== null || el.getClientRects().length; });
  }
  /** Trap Tab focus inside root. Returns release() which restores previous focus. */
  function trapFocus(root, initial) {
    var prev = d.activeElement;
    function key(e) {
      if (e.key !== 'Tab') return;
      var f = focusables(root); if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    root.addEventListener('keydown', key);
    setTimeout(function () {
      var target = initial || $('[autofocus]', root) || focusables(root)[0] || root;
      if (target === root && !root.hasAttribute('tabindex')) root.setAttribute('tabindex', '-1');
      try { target.focus({ preventScroll: true }); } catch (e) {}
    }, 30);
    return function release() {
      root.removeEventListener('keydown', key);
      if (prev && prev.focus) try { prev.focus({ preventScroll: true }); } catch (e) {}
    };
  }

  /* ---------- Scroll lock (ref-counted) ---------- */
  var lockCount = 0, savedPad = '';
  var scrollLock = {
    lock: function () {
      if (lockCount++ === 0) {
        var sb = w.innerWidth - d.documentElement.clientWidth;
        savedPad = d.body.style.paddingRight;
        if (sb > 0) d.body.style.paddingRight = sb + 'px';
        d.documentElement.style.overflow = 'hidden';
      }
    },
    unlock: function () {
      if (lockCount === 0) return;
      if (--lockCount === 0) { d.documentElement.style.overflow = ''; d.body.style.paddingRight = savedPad; }
    }
  };

  /* ---------- Escape stack: topmost layer closes first ---------- */
  var layers = [];
  function pushLayer(close) { layers.push(close); return function pop() { var i = layers.indexOf(close); if (i > -1) layers.splice(i, 1); }; }
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && layers.length) { e.preventDefault(); layers[layers.length - 1](); }
  });

  /* ---------- Floating positioning (flip + shift) ---------- */
  /**
   * position(floating, anchor, { placement: 'bottom-start', offset: 8, flip: true, shift: 8, strategy:'fixed' })
   * placement: top|bottom|left|right + optional -start|-end. Sets data-side on floating.
   * Anchor may also be a {x, y} point (context menus).
   */
  function position(fl, anchor, o) {
    o = o || {};
    var pl = (o.placement || 'bottom').split('-'), side = pl[0], align = pl[1] || 'center';
    var off = o.offset == null ? 8 : o.offset, pad = o.shift == null ? 8 : o.shift;
    var a = anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : { left: anchor.x, top: anchor.y, right: anchor.x, bottom: anchor.y, width: 0, height: 0 };
    fl.style.position = 'fixed'; fl.style.left = '0px'; fl.style.top = '0px'; fl.style.margin = '0';
    var f = fl.getBoundingClientRect(), vw = w.innerWidth, vh = d.documentElement.clientHeight;
    var opp = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
    function calc(s) {
      var x, y;
      if (s === 'top' || s === 'bottom') {
        y = s === 'top' ? a.top - f.height - off : a.bottom + off;
        x = align === 'start' ? a.left : align === 'end' ? a.right - f.width : a.left + a.width / 2 - f.width / 2;
      } else {
        x = s === 'left' ? a.left - f.width - off : a.right + off;
        y = align === 'start' ? a.top : align === 'end' ? a.bottom - f.height : a.top + a.height / 2 - f.height / 2;
      }
      return { x: x, y: y };
    }
    var p = calc(side);
    if (o.flip !== false) {
      var overflow = side === 'top' ? p.y < pad : side === 'bottom' ? p.y + f.height > vh - pad : side === 'left' ? p.x < pad : p.x + f.width > vw - pad;
      if (overflow) { var q = calc(opp[side]); var ok = opp[side] === 'top' ? q.y >= pad : opp[side] === 'bottom' ? q.y + f.height <= vh - pad : opp[side] === 'left' ? q.x >= pad : q.x + f.width <= vw - pad; if (ok) { side = opp[side]; p = q; } }
    }
    p.x = clamp(p.x, pad, Math.max(pad, vw - f.width - pad));
    p.y = clamp(p.y, pad, Math.max(pad, vh - f.height - pad));
    fl.style.left = Math.round(p.x) + 'px'; fl.style.top = Math.round(p.y) + 'px';
    fl.setAttribute('data-side', side);
    // Arrow / transform-origin hints
    var ox = side === 'left' ? '100%' : side === 'right' ? '0%' : (clamp(a.left + a.width / 2 - p.x, 0, f.width)) + 'px';
    var oy = side === 'top' ? '100%' : side === 'bottom' ? '0%' : (clamp(a.top + a.height / 2 - p.y, 0, f.height)) + 'px';
    fl.style.transformOrigin = ox + ' ' + oy;
    fl.style.setProperty('--arrow-x', (clamp(a.left + a.width / 2 - p.x, 12, f.width - 12)) + 'px');
    fl.style.setProperty('--arrow-y', (clamp(a.top + a.height / 2 - p.y, 12, f.height - 12)) + 'px');
    return side;
  }
  /** Keep a floating element positioned while open. Returns stop(). */
  function autoPosition(fl, anchor, o) {
    var upd = function () { position(fl, anchor, o); };
    upd();
    w.addEventListener('scroll', upd, true); w.addEventListener('resize', upd);
    var ro = 'ResizeObserver' in w ? new ResizeObserver(upd) : null; if (ro) ro.observe(fl);
    return function () { w.removeEventListener('scroll', upd, true); w.removeEventListener('resize', upd); if (ro) ro.disconnect(); };
  }

  /** Close callback when pointer goes down outside any of the given elements. Returns off(). */
  function onOutside(els, fn) {
    els = [].concat(els);
    var h = function (e) { for (var i = 0; i < els.length; i++) if (els[i] && els[i].contains(e.target)) return; fn(e); };
    setTimeout(function () { d.addEventListener('pointerdown', h, true); }, 0);
    return function () { d.removeEventListener('pointerdown', h, true); };
  }

  /** Roving arrow-key navigation inside a list of items. */
  function roving(container, itemSel, o) {
    o = o || {};
    return on(container, 'keydown', function (e) {
      var items = $$(itemSel, container).filter(function (i) { return !i.hasAttribute('disabled') && i.getAttribute('aria-disabled') !== 'true' && i.offsetParent !== null; });
      if (!items.length) return;
      var i = items.indexOf(d.activeElement), n = -1;
      var vert = o.orientation !== 'horizontal', hor = o.orientation !== 'vertical';
      if ((vert && e.key === 'ArrowDown') || (hor && e.key === 'ArrowRight')) n = i < 0 ? 0 : (i + 1) % items.length;
      else if ((vert && e.key === 'ArrowUp') || (hor && e.key === 'ArrowLeft')) n = i <= 0 ? items.length - 1 : i - 1;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = items.length - 1;
      if (n > -1) { e.preventDefault(); items[n].focus(); if (o.onMove) o.onMove(items[n]); }
    });
  }

  /* ---------- Component registry ---------- */
  /**
   * Ranj.define(name, {
   *   selector: '.carousel',         // elements to mount (optional)
   *   setup: function () {},          // runs ONCE globally (delegated listeners) (optional)
   *   mount: function (el, R) {       // runs once per matching element
   *     return function destroy() {}  // optional cleanup, called when el leaves DOM
   *   }
   * })
   */
  function define(name, def) {
    def.name = name;
    defs.push(def);
    if (started) { runSetup(def); mountAll(d.body, def); }
    return def;
  }
  function runSetup(def) { if (def.setup && !def.didSetup) { def.didSetup = true; try { def.setup(api); } catch (e) { console.error('[Ranj] ' + def.name + ' setup failed', e); } } }
  function mountEl(el, def) {
    var key = def.name;
    el.__ranj = el.__ranj || {};
    if (el.__ranj[key]) return;
    el.__ranj[key] = { destroy: null };
    try { var r = def.mount(el, api); if (typeof r === 'function') el.__ranj[key].destroy = r; else if (r && r.destroy) el.__ranj[key] = r; }
    catch (e) { console.error('[Ranj] ' + key + ' mount failed', e, el); }
  }
  function mountAll(root, only) {
    if (!root || root.nodeType !== 1) return;
    (only ? [only] : defs).forEach(function (def) {
      if (!def.selector || !def.mount) return;
      if (root.matches && root.matches(def.selector)) mountEl(root, def);
      $$(def.selector, root).forEach(function (el) { mountEl(el, def); });
    });
  }
  function destroyTree(root) {
    if (!root || root.nodeType !== 1) return;
    var list = [root].concat($$('*', root));
    list.forEach(function (el) {
      if (!el.__ranj) return;
      for (var k in el.__ranj) { var inst = el.__ranj[k]; if (inst && inst.destroy) try { inst.destroy(); } catch (e) {} }
      el.__ranj = null;
    });
  }
  /** Get a component instance stored by mount (when mount returns an object). */
  function instance(el, name) { return el && el.__ranj ? el.__ranj[name] : null; }

  /* ---------- Theme ---------- */
  var theme = {
    get: function () { return d.documentElement.getAttribute('data-theme') || 'light'; },
    set: function (t) {
      d.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('ranj-theme', t); } catch (e) {}
      emit(d.documentElement, 'theme', { theme: t });
    },
    toggle: function () { theme.set(theme.get() === 'dark' ? 'light' : 'dark'); },
    accent: function (a) { d.documentElement.setAttribute('data-accent', a); try { localStorage.setItem('ranj-accent', a); } catch (e) {} },
    radius: function (r) { d.documentElement.setAttribute('data-radius', r); try { localStorage.setItem('ranj-radius', r); } catch (e) {} },
    init: function () {
      var root = d.documentElement, s;
      if (root.hasAttribute('data-theme-lock')) return;
      try {
        s = localStorage.getItem('ranj-theme') || localStorage.getItem('ranju-theme');
        var a = localStorage.getItem('ranj-accent'), r = localStorage.getItem('ranj-radius');
        if (a && !root.hasAttribute('data-accent')) root.setAttribute('data-accent', a);
        if (r && !root.hasAttribute('data-radius')) root.setAttribute('data-radius', r);
      } catch (e) {}
      if (s) root.setAttribute('data-theme', s);
      else if (!root.hasAttribute('data-theme')) root.setAttribute('data-theme', w.matchMedia && w.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  };
  theme.current = theme.get; // v1 compat

  /* ---------- Boot ---------- */
  function start() {
    if (started) return; started = true;
    theme.init();
    defs.forEach(runSetup);
    mountAll(d.body);
    if ('MutationObserver' in w) {
      var pending = [], scheduled = false;
      new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          m.addedNodes.forEach(function (n) { if (n.nodeType === 1) pending.push(n); });
          m.removedNodes.forEach(function (n) { if (n.nodeType === 1 && !n.isConnected) destroyTree(n); });
        });
        if (!scheduled && pending.length) {
          scheduled = true;
          requestAnimationFrame(function () {
            scheduled = false;
            var list = pending; pending = [];
            list.forEach(function (n) { if (n.isConnected) mountAll(n); });
          });
        }
      }).observe(d.body, { childList: true, subtree: true });
    }
    emit(d, 'ready', {});
  }

  var api = w.Ranj = {
    __core: true,
    version: '2.0.0',
    $: $, $$: $$, on: on, attr: attr, opts: opts, emit: emit, uid: uid, ensureId: ensureId,
    clamp: clamp, lerp: lerp, esc: esc, inView: inView, loop: loop,
    focusables: focusables, trapFocus: trapFocus, scrollLock: scrollLock, pushLayer: pushLayer,
    position: position, autoPosition: autoPosition, onOutside: onOutside, roving: roving,
    define: define, init: function (root) { mountAll(root || d.body); }, destroy: destroyTree, instance: instance,
    theme: theme,
    get reducedMotion() { return reduced.matches; }
  };
  w.Ranju = api; // v1 compat alias

  // Apply saved theme ASAP to avoid flash, then mount when DOM is ready.
  theme.init();
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else setTimeout(start, 0);
})(window, document);
