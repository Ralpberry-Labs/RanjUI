/*! Ranj UI v2.0.0 | MIT | https://ralpberry-labs.github.io/RanjUI/ */
/* --- core/core.js --- */
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

;
/* --- components/base/banner.js --- */
/* Ranj UI — Banner + Callout dismiss (optionally remembered with data-dismiss-key) */
(function (R) {
  'use strict';
  function key(el) { var k = el.getAttribute('data-dismiss-key'); return k ? 'ranj-dismiss:' + k : null; }
  function close(el) {
    if (!el || el.getAttribute('data-state') === 'closed') return;
    if (!R.emit(el, 'dismiss', {})) return;
    var k = key(el); if (k) try { localStorage.setItem(k, '1'); } catch (e) {}
    var finish = function () { el.setAttribute('data-state', 'closed'); R.emit(el, 'dismissed', {}); };
    if (R.reducedMotion || !el.classList.contains('banner')) return finish();
    el.style.height = el.offsetHeight + 'px';
    el.setAttribute('data-state', 'closing');
    setTimeout(finish, 340);
  }
  R.define('banner', {
    selector: '.banner[data-dismiss-key], .callout[data-dismiss-key]',
    setup: function () {
      R.on(document, 'click', '.banner-close, .callout-close', function (e, btn) { close(btn.closest('.banner, .callout')); });
    },
    mount: function (el) {
      var k = key(el);
      try { if (k && localStorage.getItem(k)) el.setAttribute('data-state', 'closed'); } catch (e) {}
    }
  });
  R.banner = {
    close: close,
    reset: function (el) { var k = key(el); if (k) try { localStorage.removeItem(k); } catch (e) {} el.removeAttribute('data-state'); el.style.height = ''; }
  };
})(window.Ranj);

;
/* --- components/base/blocks.js --- */
/* Ranj UI — Blocks: pricing period toggle.
 * <section class="block-pricing" data-period="monthly">
 *   <div class="block-pricing-toggle"><button data-period="monthly">…</button><button data-period="yearly">…</button></div>
 *   <span class="block-plan-amount" data-monthly="$29" data-yearly="$24">$29</span>
 *   <span data-monthly="billed monthly" data-yearly="billed $288 yearly"></span>
 * </section>
 * Fires ranj:change { period } on the .block-pricing element. */
(function (R) {
  'use strict';
  R.define('block-pricing', {
    selector: '.block-pricing',
    mount: function (el) {
      var toggle = R.$('.block-pricing-toggle', el);
      if (!toggle) return;
      var btns = R.$$('button[data-period]', toggle);
      var thumb = R.$('.block-pricing-toggle-thumb', toggle);
      if (!thumb) { thumb = document.createElement('span'); thumb.className = 'block-pricing-toggle-thumb'; thumb.setAttribute('aria-hidden', 'true'); toggle.insertBefore(thumb, toggle.firstChild); }
      toggle.setAttribute('role', 'group');
      if (!toggle.hasAttribute('aria-label')) toggle.setAttribute('aria-label', 'Billing period');

      function place() {
        var on = btns.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0];
        if (!on || !on.offsetWidth) return;
        thumb.style.width = on.offsetWidth + 'px';
        thumb.style.transform = 'translateX(' + on.offsetLeft + 'px)';
      }
      function set(period, animate) {
        el.setAttribute('data-period', period);
        btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-period') === period)); });
        R.$$('[data-' + period + ']', el).forEach(function (n) {
          if (n.closest('.block-pricing') !== el) return;
          var v = n.getAttribute('data-' + period);
          if (n.textContent === v) return;
          n.textContent = v;
          if (animate && !R.reducedMotion && n.classList.contains('block-plan-amount')) {
            n.classList.remove('is-swapping'); void n.offsetWidth; n.classList.add('is-swapping');
          }
        });
        place();
      }
      var offClick = R.on(toggle, 'click', 'button[data-period]', function (e, b) {
        var p = b.getAttribute('data-period');
        if (p === el.getAttribute('data-period')) return;
        set(p, true);
        R.emit(el, 'change', { period: p });
      });
      var offKey = R.roving(toggle, 'button[data-period]', { orientation: 'horizontal' });
      thumb.style.transition = 'none';
      set(el.getAttribute('data-period') || btns[0].getAttribute('data-period'), false);
      requestAnimationFrame(function () { place(); requestAnimationFrame(function () { thumb.style.transition = ''; }); });
      var ro = 'ResizeObserver' in window ? new ResizeObserver(place) : null;
      if (ro) ro.observe(toggle);
      el.blockPricing = { set: function (p) { set(p, true); } };
      return function () { offClick(); offKey(); if (ro) ro.disconnect(); };
    }
  });
})(window.Ranj);

;
/* --- components/base/breadcrumb.js --- */
/* Ranj UI — Breadcrumb: clicking the "…" crumb of a .breadcrumb-collapsed list reveals the full path. */
(function (R) {
  'use strict';
  R.define('breadcrumb', {
    setup: function () {
      R.on(document, 'click', '.breadcrumb .breadcrumb-ellipsis button', function (e, b) {
        var list = b.closest('.breadcrumb'); if (!list) return;
        list.classList.remove('breadcrumb-collapsed', 'breadcrumb-responsive');
        var first = list.querySelector('li.breadcrumb-hidden a, li.breadcrumb-hidden button');
        R.emit(list, 'expand', {});
        if (first) first.focus();
      });
    }
  });
})(window.Ranj);

;
/* --- components/base/button.js --- */
/* Ranj UI — Button helpers: loading state, toggle groups, image fallback */
(function (R) {
  'use strict';
  function loading(btn, on) {
    if (!btn) return;
    on = on !== false;
    btn.setAttribute('data-loading', on ? 'true' : 'false');
    btn.setAttribute('aria-busy', on ? 'true' : 'false');
    if (on) { btn.__wasDisabled = btn.disabled; btn.disabled = true; } else { btn.disabled = !!btn.__wasDisabled; btn.removeAttribute('aria-busy'); btn.removeAttribute('data-loading'); }
  }
  R.button = { loading: loading };

  // Toggle groups: <div class="btn-group" data-toggle="single|multiple"> with buttons carrying aria-pressed
  R.define('btn-toggle', {
    selector: '.btn-group[data-toggle]',
    mount: function (el) {
      var single = el.getAttribute('data-toggle') !== 'multiple';
      var btns = R.$$(':scope > .btn', el);
      if (!el.hasAttribute('role')) el.setAttribute('role', 'group');
      btns.forEach(function (b) { if (!b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', 'false'); });
      var off = R.on(el, 'click', '.btn', function (e, b) {
        if (b.parentElement !== el) return;
        var on = b.getAttribute('aria-pressed') !== 'true';
        if (single) { if (!on) return; btns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); }
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        R.emit(el, 'change', { value: btns.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).map(function (x) { return x.getAttribute('data-value') || x.textContent.trim(); }) });
      });
      var offKey = single ? R.roving(el, ':scope > .btn', { orientation: el.classList.contains('btn-group-vertical') ? 'vertical' : 'horizontal' }) : null;
      return function () { off(); if (typeof offKey === 'function') offKey(); };
    }
  });

  // Image frames: mark broken images so CSS can show a placeholder
  R.define('img-frame', {
    selector: '.img-frame img',
    mount: function (img) {
      var host = img.closest('.img-frame');
      var fail = function () { host.setAttribute('data-state', 'error'); };
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
      img.addEventListener('error', fail);
      return function () { img.removeEventListener('error', fail); };
    }
  });
})(window.Ranj);

;
/* --- components/base/carousel.js --- */
/* Ranj UI — Carousel: pointer drag/swipe, keyboard, dots, arrows, thumbnails, autoplay (pauses on hover/focus/offscreen),
 * infinite loop, multiple slides per view (--per-view), centered peek and fade. */
(function (R) {
  'use strict';
  var PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
  var NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

  R.define('carousel', {
    selector: '.carousel',
    mount: function (el) {
      var viewport = el.querySelector('.carousel-viewport');
      var track = el.querySelector('.carousel-track');
      if (!track) return;
      if (!viewport) { viewport = document.createElement('div'); viewport.className = 'carousel-viewport'; track.parentNode.insertBefore(viewport, track); viewport.appendChild(track); }
      var o = R.opts(el, { loop: false, autoplay: 0, startIndex: 0, drag: true, arrows: true, dots: true, thumbs: false, label: 'Carousel', pauseOnHover: true });
      var fade = el.classList.contains('carousel-fade');
      var center = el.classList.contains('carousel-peek') || el.hasAttribute('data-center');
      var slides = [].slice.call(track.children).filter(function (c) { return c.classList.contains('carousel-slide'); });
      var count = slides.length;
      if (!count) return;
      var loop = o.loop && count > 1 && !fade;
      var offs = [], timers = {}, index = R.clamp(o.startIndex, 0, count - 1), pos = 0, nc = 0, all = slides, x = 0, snaps = count, maxX = 0;

      el.setAttribute('role', 'region');
      el.setAttribute('aria-roledescription', 'carousel');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', o.label);
      viewport.tabIndex = 0;
      viewport.setAttribute('aria-live', o.autoplay ? 'off' : 'polite');
      slides.forEach(function (s, i) {
        s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', 'slide');
        if (!s.hasAttribute('aria-label')) s.setAttribute('aria-label', (i + 1) + ' of ' + count);
      });

      /* Loop clones */
      function makeClones() {
        R.$$('.carousel-clone', track).forEach(function (c) { c.remove(); });
        nc = 0;
        if (!loop) { all = slides; return; }
        var pv = perView();
        nc = Math.min(count, Math.ceil(pv) + (center ? 2 : 1));
        var head = [], tail = [];
        for (var i = 0; i < nc; i++) {
          var a = slides[(count - nc + i) % count].cloneNode(true), b = slides[i % count].cloneNode(true);
          [a, b].forEach(function (c) { c.classList.add('carousel-clone'); c.setAttribute('aria-hidden', 'true'); c.inert = true; c.removeAttribute('id'); });
          head.push(a); tail.push(b);
        }
        head.forEach(function (c) { track.insertBefore(c, slides[0]); });
        tail.forEach(function (c) { track.appendChild(c); });
        all = [].slice.call(track.children);
      }
      function perView() { var v = parseFloat(getComputedStyle(el).getPropertyValue('--per-view')); return v > 0 ? v : 1; }

      /* Controls */
      var prev = el.querySelector('.carousel-prev'), next = el.querySelector('.carousel-next');
      if (o.arrows && !prev && count > 1) {
        prev = document.createElement('button'); prev.className = 'carousel-prev'; prev.innerHTML = PREV; el.appendChild(prev); prev.__gen = true;
        next = document.createElement('button'); next.className = 'carousel-next'; next.innerHTML = NEXT; el.appendChild(next); next.__gen = true;
      }
      [prev, next].forEach(function (b, i) {
        if (!b) return; b.type = 'button';
        if (!b.hasAttribute('aria-label')) b.setAttribute('aria-label', i ? 'Next slide' : 'Previous slide');
        if (!b.innerHTML.trim()) b.innerHTML = i ? NEXT : PREV;
        offs.push(R.on(b, 'click', function () { go(index + (i ? 1 : -1), true); }));
      });
      var dotsEl = el.querySelector('.carousel-dots');
      if (dotsEl) offs.push(R.on(dotsEl, 'click', '.carousel-dot', function (e, d) { go(+d.getAttribute('data-i'), true); }));
      var thumbsEl = el.querySelector('.carousel-thumbs');
      if (thumbsEl && !thumbsEl.children.length) {
        thumbsEl.innerHTML = slides.map(function (s, i) {
          var img = s.querySelector('img'), src = s.getAttribute('data-thumb') || (img && (img.currentSrc || img.src)) || '';
          return '<button type="button" class="carousel-thumb" data-i="' + i + '" aria-label="Show slide ' + (i + 1) + '">' + (src ? '<img src="' + R.esc(src) + '" alt="" loading="lazy">' : (i + 1)) + '</button>';
        }).join('');
      }
      if (thumbsEl) offs.push(R.on(thumbsEl, 'click', '.carousel-thumb', function (e, b) { go(+b.getAttribute('data-i'), true); }));
      var counterEl = el.querySelector('.carousel-counter');

      function buildDots() {
        if (!dotsEl || !o.dots) return;
        var n = loop || center || fade ? count : snaps;
        if (dotsEl.children.length === n && dotsEl.__gen) return;
        dotsEl.__gen = true;
        var h = '';
        for (var i = 0; i < n; i++) h += '<button type="button" class="carousel-dot" data-i="' + i + '" aria-label="Go to slide ' + (i + 1) + '"></button>';
        dotsEl.innerHTML = h;
      }

      /* Geometry */
      var vw = 0;
      function measure() {
        vw = viewport.clientWidth;
        var last = slides[count - 1];
        maxX = Math.max(0, last.offsetLeft + last.offsetWidth - vw);
        if (loop || center || fade) snaps = count;
        else { snaps = count; for (var i = 0; i < count; i++) if (slides[i].offsetLeft >= maxX - 1) { snaps = i + 1; break; } }
        buildDots();
      }
      function offsetAt(p) {
        var s = all[p]; if (!s) return 0;
        var v = s.offsetLeft;
        if (center) v -= (vw - s.offsetWidth) / 2;
        else if (!loop) v = Math.min(v, maxX);
        return v;
      }
      function setX(v, animate) {
        x = v;
        if (fade) return;
        if (!animate || R.reducedMotion) { el.classList.add('is-jumping'); track.style.transform = 'translate3d(' + (-v) + 'px,0,0)'; void track.offsetWidth; el.classList.remove('is-jumping'); }
        else track.style.transform = 'translate3d(' + (-v) + 'px,0,0)';
      }
      function mod(n) { return ((n % count) + count) % count; }

      function paint() {
        var real = mod(index), pv = perView();
        all.forEach(function (s, p) {
          var r = loop ? mod(p - nc) : p;
          var active = p === pos || (!loop && r === real);
          s.classList.toggle('is-active', active);
          var vis = fade ? r === real : (loop ? (p >= pos && p < pos + Math.ceil(pv)) : (r >= real && r < real + Math.ceil(pv)) || (!center && offsetAt(p) <= x + vw - 4 && s.offsetLeft + s.offsetWidth >= x + 4 && !s.classList.contains('carousel-clone')));
          if (center) vis = p === pos;
          if (!s.classList.contains('carousel-clone')) { s.inert = !vis; s.setAttribute('aria-hidden', vis ? 'false' : 'true'); }
        });
        if (dotsEl) R.$$('.carousel-dot', dotsEl).forEach(function (d, i) { if (i === real) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
        if (thumbsEl) R.$$('.carousel-thumb', thumbsEl).forEach(function (t, i) {
          if (i === real) { t.setAttribute('aria-current', 'true'); var l = t.offsetLeft - thumbsEl.clientWidth / 2 + t.offsetWidth / 2; thumbsEl.scrollTo({ left: l, behavior: R.reducedMotion ? 'auto' : 'smooth' }); }
          else t.removeAttribute('aria-current');
        });
        if (counterEl) counterEl.innerHTML = '<b>' + (real + 1) + '</b> / ' + count;
        if (!loop) {
          if (prev) prev.disabled = !center && !fade ? real <= 0 : real <= 0;
          if (next) next.disabled = real >= (center || fade ? count : snaps) - 1;
        }
      }

      var settleT = 0;
      function go(i, user, fromAuto) {
        var before = mod(index);
        if (fade) i = mod(i);
        else if (loop) i = R.clamp(i, index - nc + 1, index + nc - 1);
        else if (fromAuto && i >= (center ? count : snaps)) i = 0;
        else i = R.clamp(i, 0, (center ? count : snaps) - 1);
        index = i; pos = loop ? i + nc : i;
        setX(offsetAt(pos), true);
        paint();
        clearTimeout(settleT);
        if (loop && (i < 0 || i >= count)) {
          settleT = setTimeout(normalize, R.reducedMotion ? 0 : parseFloat(getComputedStyle(el).getPropertyValue('--duration')) || 520);
        }
        if (mod(index) !== before) R.emit(el, 'change', { index: mod(index), previous: before, count: count, user: !!user });
        restartAuto();
      }
      function normalize() {
        index = mod(index); pos = index + nc;
        el.classList.add('is-jumping');
        paint(); setX(offsetAt(pos), false);
        requestAnimationFrame(function () { el.classList.remove('is-jumping'); });
      }

      function relayout() {
        var pv = perView();
        if (loop && relayout.pv !== pv) { relayout.pv = pv; makeClones(); }
        measure();
        if (!loop && !center && !fade) index = Math.min(index, snaps - 1);
        pos = loop ? mod(index) + nc : index;
        if (loop) index = mod(index);
        setX(offsetAt(pos), false);
        paint();
      }

      /* Drag / swipe */
      var drag = null, suppressClick = false;
      if (o.drag && count > 1 && !fade) {
        offs.push(R.on(viewport, 'pointerdown', function (e) {
          if (e.button !== 0 || e.target.closest('a, button, input, select, textarea, [contenteditable]') && e.pointerType === 'mouse' && !e.target.closest('.carousel-slide')) return;
          drag = { x0: e.clientX, y0: e.clientY, t0: performance.now(), base: x, id: e.pointerId, active: false, lastX: e.clientX, lastT: performance.now(), v: 0 };
          suppressClick = false;
        }));
        offs.push(R.on(window, 'pointermove', function (e) {
          if (!drag || e.pointerId !== drag.id) return;
          var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
          if (!drag.active) {
            if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
            if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
            drag.active = true; el.classList.add('is-dragging'); pause('drag');
            try { viewport.setPointerCapture(e.pointerId); } catch (er) {}
          }
          e.preventDefault();
          var now = performance.now(); drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT); drag.lastX = e.clientX; drag.lastT = now;
          var v = drag.base - dx;
          if (!loop) { var lo = offsetAt(0), hi = center ? offsetAt(count - 1) : maxX; if (v < lo) v = lo - (lo - v) * .35; if (v > hi) v = hi + (v - hi) * .35; }
          x = v; track.style.transform = 'translate3d(' + (-v) + 'px,0,0)';
        }, { passive: false }));
        var end = function (e) {
          if (!drag || (e && e.pointerId !== drag.id)) return;
          var d = drag; drag = null;
          if (!d.active) return;
          el.classList.remove('is-dragging'); resume('drag');
          suppressClick = true; setTimeout(function () { suppressClick = false; }, 0);
          var dx = d.lastX - d.x0, step = (slides[0].offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0)) || vw;
          var n = -Math.round(dx / step);
          if (n === 0 && (Math.abs(dx) > 40 || Math.abs(d.v) > .45)) n = dx < 0 ? 1 : -1;
          go(index + n, true);
        };
        offs.push(R.on(window, 'pointerup', end), R.on(window, 'pointercancel', end));
        offs.push(R.on(viewport, 'click', function (e) { if (suppressClick) { e.preventDefault(); e.stopPropagation(); } }, true));
        offs.push(R.on(viewport, 'dragstart', function (e) { e.preventDefault(); }));
      }
      // Click a peeking neighbour to bring it to the center
      if (center) offs.push(R.on(track, 'click', '.carousel-slide', function (e, s) {
        if (suppressClick || s.classList.contains('is-active')) return;
        var p = all.indexOf(s); if (p < 0) return;
        e.preventDefault(); go(index + (p - pos), true);
      }));

      /* Keyboard */
      offs.push(R.on(viewport, 'keydown', function (e) {
        if (e.target !== viewport) return;
        var k = e.key;
        if (k === 'ArrowLeft') go(index - 1, true); else if (k === 'ArrowRight') go(index + 1, true);
        else if (k === 'Home') go(0, true); else if (k === 'End') go((center || loop || fade ? count : snaps) - 1, true);
        else return;
        e.preventDefault();
      }));

      /* Autoplay with pause reasons and synced progress */
      var autoMs = o.autoplay > 0 && count > 1 && !R.reducedMotion ? (o.autoplay === 1 ? 5000 : o.autoplay) : 0;
      var reasons = {}, started = 0, remaining = autoMs, playing = false;
      function isPaused() { for (var k in reasons) if (reasons[k]) return true; return false; }
      function schedule() {
        clearTimeout(timers.auto); started = 0;
        if (!autoMs || isPaused()) return;
        started = performance.now();
        timers.auto = setTimeout(function () { started = 0; remaining = autoMs; go(index + 1, false, true); }, remaining);
      }
      function restartAuto() {
        if (!autoMs) return;
        remaining = autoMs;
        // restart dot progress animation
        if (dotsEl) { var d = dotsEl.querySelector('[aria-current="true"]'); if (d) { d.style.animation = 'none'; void d.offsetWidth; d.style.animation = ''; } }
        schedule();
      }
      function pause(r) {
        if (!autoMs || reasons[r]) return;
        var was = isPaused(); reasons[r] = true;
        if (!was) { clearTimeout(timers.auto); if (started) remaining = Math.max(60, remaining - (performance.now() - started)); started = 0; el.classList.add('is-paused'); }
      }
      function resume(r) {
        if (!autoMs || !reasons[r]) return;
        reasons[r] = false;
        if (!isPaused()) { el.classList.remove('is-paused'); schedule(); }
      }
      if (autoMs) {
        el.setAttribute('data-autoplay-on', '');
        el.style.setProperty('--autoplay', autoMs + 'ms');
        if (o.pauseOnHover) {
          offs.push(R.on(el, 'pointerenter', function (e) { if (e.pointerType === 'mouse') pause('hover'); }));
          offs.push(R.on(el, 'pointerleave', function () { resume('hover'); }));
        }
        offs.push(R.on(el, 'focusin', function () { pause('focus'); }));
        offs.push(R.on(el, 'focusout', function (e) { if (!el.contains(e.relatedTarget)) resume('focus'); }));
        offs.push(R.on(document, 'visibilitychange', function () { if (document.hidden) pause('hidden'); else resume('hidden'); }));
        var playBtn = el.querySelector('.carousel-play');
        if (playBtn) offs.push(R.on(playBtn, 'click', function () {
          var on = !reasons.user; if (on) pause('user'); else resume('user');
          playBtn.setAttribute('aria-pressed', String(on)); playBtn.setAttribute('aria-label', on ? 'Play slideshow' : 'Pause slideshow');
        }));
        pause('offscreen');
        offs.push(R.inView(el, function () { resume('offscreen'); }, { repeat: true, threshold: .3, onLeave: function () { pause('offscreen'); } }));
      }

      /* Init */
      makeClones(); relayout.pv = perView();
      measure();
      pos = loop ? index + nc : index;
      setX(offsetAt(pos), false);
      paint();
      el.setAttribute('data-ready', '');
      var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { if (viewport.clientWidth !== vw) relayout(); }) : null;
      if (ro) ro.observe(viewport);
      // images may change slide widths (auto-width slides)
      R.$$('img', track).forEach(function (img) { if (!img.complete) offs.push(R.on(img, 'load', function () { measure(); setX(offsetAt(pos), false); })); });

      var api = {
        next: function () { go(index + 1, true); }, prev: function () { go(index - 1, true); },
        goTo: function (i) { go(i, true); },
        get index() { return mod(index); }, count: count,
        play: function () { resume('user'); }, pause: function () { pause('user'); }
      };
      el.ranjCarousel = api;
      return {
        api: api,
        destroy: function () {
          offs.forEach(function (f) { f(); }); clearTimeout(timers.auto); clearTimeout(settleT);
          if (ro) ro.disconnect();
          R.$$('.carousel-clone', track).forEach(function (c) { c.remove(); });
          if (prev && prev.__gen) prev.remove(); if (next && next.__gen) next.remove();
          delete el.ranjCarousel;
        }
      };
    }
  });
})(window.Ranj);

;
/* --- components/base/charts.js --- */
/*!
 * Ranj UI — Charts: sparkline, bar-chart, line-chart, donut-chart, gauge, heatmap.
 * Tiny dependency-free SVG charts driven by data attributes. Every chart:
 *  - sizes itself to its container (ResizeObserver) and re-renders when data-* changes,
 *  - animates in once when it enters the viewport (skipped with reduced motion),
 *  - reads colors from CSS tokens (--chart-1..8, --primary, --success …) so themes just work.
 * Imperative: Ranj.chart.bar(el, opts), .line, .donut, .gauge, .heatmap, .sparkline
 */
(function (R) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var gid = 0;

  /* ---------------- helpers ---------------- */
  function nums(s) {
    if (Array.isArray(s)) return s.map(Number);
    return String(s == null ? '' : s).split(',').map(function (x) { return parseFloat(x); }).filter(function (n) { return !isNaN(n); });
  }
  function strs(s) {
    if (Array.isArray(s)) return s.map(String);
    return s ? String(s).split(',').map(function (x) { return x.trim(); }) : [];
  }
  function json(s, fb) { if (!s) return fb; if (typeof s === 'object') return s; try { return JSON.parse(s); } catch (e) { return fb; } }
  function color(c, i) {
    if (!c) return 'var(--chart-' + ((i || 0) % 8 + 1) + ')';
    if (/^(primary|success|warning|destructive|info|muted-fg|muted|fg|border|border-strong)$/.test(c)) return 'var(--' + c + ')';
    if (/^chart-\d$/.test(c)) return 'var(--' + c + ')';
    return c;
  }
  function f2(n) { return Math.round(n * 100) / 100; }
  function h(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function div(cls, parent, html) {
    var e = document.createElement('div');
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  /** Number formatter from options: format (number|currency|percent|compact), currency, decimals, prefix, suffix. */
  function fmter(o) {
    return function (v, short) {
      if (v == null || isNaN(v)) return '–';
      var op = { minimumFractionDigits: 0 };
      var dec = o.decimals != null && o.decimals !== '' ? +o.decimals : (Math.abs(v) < 10 && v % 1 ? 1 : 0);
      op.maximumFractionDigits = dec;
      if ((short && Math.abs(v) >= 1000) || o.format === 'compact') { op.notation = 'compact'; op.maximumFractionDigits = Math.abs(v) >= 1000 ? 1 : dec; }
      if (o.format === 'currency') { op.style = 'currency'; op.currency = o.currency || 'USD'; }
      var s;
      try { s = new Intl.NumberFormat(o.locale || 'en-US', op).format(v); } catch (e) { s = String(v); }
      if (o.format === 'percent') s += '%';
      return (o.prefix || '') + s + (o.suffix || '');
    };
  }
  function niceNum(range, round) {
    var e = Math.floor(Math.log10(range)), f = range / Math.pow(10, e), nf;
    if (round) nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
    else nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
    return nf * Math.pow(10, e);
  }
  function ticks(min, max, n) {
    if (max === min) { max = min + 1; }
    var step = niceNum(niceNum(max - min, false) / Math.max(1, n - 1), true);
    var lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step, out = [];
    for (var v = lo; v <= hi + step / 2; v += step) out.push(+v.toFixed(10));
    return out;
  }
  /** Monotone cubic (Fritsch–Carlson) path through points; never overshoots. */
  function pathD(p, smooth) {
    if (!p.length) return '';
    var i, d = 'M' + f2(p[0][0]) + ',' + f2(p[0][1]);
    if (!smooth || p.length < 3) { for (i = 1; i < p.length; i++) d += 'L' + f2(p[i][0]) + ',' + f2(p[i][1]); return d; }
    var n = p.length, dx = [], m = [], t = [];
    for (i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0]; m[i] = (p[i + 1][1] - p[i][1]) / (dx[i] || 1); }
    t[0] = m[0]; t[n - 1] = m[n - 2];
    for (i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : 3 * (dx[i - 1] + dx[i]) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
    for (i = 0; i < n - 1; i++) {
      var k = dx[i] / 3;
      d += 'C' + f2(p[i][0] + k) + ',' + f2(p[i][1] + t[i] * k) + ',' + f2(p[i + 1][0] - k) + ',' + f2(p[i + 1][1] - t[i + 1] * k) + ',' + f2(p[i + 1][0]) + ',' + f2(p[i + 1][1]);
    }
    return d;
  }
  function roundTop(x, y, w, hh, r) {
    r = Math.max(0, Math.min(r, w / 2, hh));
    return 'M' + f2(x) + ',' + f2(y + hh) + 'V' + f2(y + r) + 'Q' + f2(x) + ',' + f2(y) + ' ' + f2(x + r) + ',' + f2(y) +
      'H' + f2(x + w - r) + 'Q' + f2(x + w) + ',' + f2(y) + ' ' + f2(x + w) + ',' + f2(y + r) + 'V' + f2(y + hh) + 'Z';
  }
  function gradient(svg, c, top, bottom) {
    var id = 'rch-g' + (++gid);
    var defs = svg.querySelector('defs') || h('defs', {}, svg);
    var g = h('linearGradient', { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    h('stop', { offset: '0%', style: 'stop-color:' + c + ';stop-opacity:' + top }, g);
    h('stop', { offset: '100%', style: 'stop-color:' + c + ';stop-opacity:' + bottom }, g);
    return 'url(#' + id + ')';
  }
  function getSeries(o) {
    var s = json(o.series, null);
    if (!s || !s.length) s = [{ name: o.name || 'Value', values: nums(o.values), color: o.color }];
    return s.map(function (x, i) { return { name: x.name || 'Series ' + (i + 1), values: nums(x.values || []), color: color(x.color, i) }; });
  }
  function legendHtml(series) {
    return series.map(function (s) {
      return '<span class="chart-legend-item"><i style="background:' + s.color + '"></i>' + R.esc(s.name) + '</span>';
    }).join('');
  }

  /* ---------------- shared tooltip ---------------- */
  var tip = null, tipTimer = 0;
  function showTip(html, x, y) {
    if (!tip) { tip = document.createElement('div'); tip.className = 'chart-tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip); }
    clearTimeout(tipTimer);
    tip.innerHTML = html;
    tip.setAttribute('data-state', 'open');
    R.position(tip, { x: x, y: y }, { placement: 'top', offset: 10 });
  }
  function hideTip() { if (tip) { tip.setAttribute('data-state', 'closed'); } }
  function tipRows(title, rows) {
    return (title ? '<div class="chart-tip-title">' + R.esc(title) + '</div>' : '') + rows.map(function (r) {
      return '<div class="chart-tip-row">' + (r.c ? '<i style="background:' + r.c + '"></i>' : '') + '<span>' + R.esc(r.k) + '</span><b>' + R.esc(r.v) + '</b></div>';
    }).join('');
  }

  /** Index-based hover/keyboard for x-axis charts. xs = pixel x of each index (svg coords). */
  function bindIndex(svg, xs, show, hide) {
    var cur = -1;
    function at(i) { if (i === cur) return; cur = i; show(i); }
    function nearest(cx) {
      var best = 0, bd = Infinity;
      for (var i = 0; i < xs.length; i++) { var dd = Math.abs(xs[i] - cx); if (dd < bd) { bd = dd; best = i; } }
      return best;
    }
    function move(e) { var r = svg.getBoundingClientRect(); at(nearest((e.clientX - r.left) * (svg.viewBox.baseVal.width / r.width || 1))); }
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' || !e.pointerType) { cur = -1; hide(); } });
    svg.addEventListener('blur', function () { cur = -1; hide(); });
    svg.addEventListener('keydown', function (e) {
      var n = xs.length, i = cur < 0 ? n - 1 : cur;
      if (e.key === 'ArrowRight') i = Math.min(n - 1, cur < 0 ? 0 : cur + 1);
      else if (e.key === 'ArrowLeft') i = Math.max(0, cur < 0 ? n - 1 : cur - 1);
      else if (e.key === 'Home') i = 0;
      else if (e.key === 'End') i = n - 1;
      else if (e.key === 'Escape') { cur = -1; hide(); return; }
      else return;
      e.preventDefault(); at(i);
    });
  }
  function svgPoint(svg, x, y) {
    var r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, sx = r.width / (vb.width || r.width), sy = r.height / (vb.height || r.height);
    return { x: r.left + x * sx, y: r.top + y * sy };
  }

  /* ---------------- count-up for [data-count] ---------------- */
  function countUp(node) {
    var to = parseFloat(node.getAttribute('data-count')), fmt = node.__fmt || String, from = 0, t0 = 0, dur = 1100;
    if (isNaN(to)) return;
    function step(t) {
      if (!node.isConnected) return;
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      node.textContent = fmt(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    }
    node.textContent = fmt(from);
    requestAnimationFrame(step);
  }

  /* ---------------- renderers ---------------- */
  var T = {};

  /* Sparkline ------------------------------------------------------------ */
  T.sparkline = {
    cls: 'sparkline',
    defaults: { values: '', type: 'line', color: 'primary', curve: true, dot: true, min: '', max: '', stroke: 1.75, labels: '', tooltip: true, format: '', prefix: '', suffix: '', decimals: '', currency: '' },
    render: function (el, o, W) {
      var H = el.clientHeight || 40, v = nums(o.values), n = v.length;
      el.innerHTML = '';
      if (!n) return;
      var c = color(o.color), sw = +o.stroke || 1.75, pad = o.type === 'bar' ? 0 : sw + (o.dot ? 2.5 : 0);
      var mn = o.min !== '' ? +o.min : Math.min.apply(null, v), mx = o.max !== '' ? +o.max : Math.max.apply(null, v);
      if (o.type === 'bar') mn = Math.min(0, mn);
      if (mx === mn) { mx += 1; mn -= 1; }
      var svg = h('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, class: 'chart-svg', 'aria-hidden': 'true', style: '--c:' + c }, el);
      var sy = function (x) { return pad + (H - pad * 2) * (1 - (x - mn) / (mx - mn)); };
      var xs = [], labels = strs(o.labels), F = fmter(o);
      if (o.type === 'bar') {
        var bw = W / n, g = Math.max(1, Math.min(3, bw * 0.25));
        v.forEach(function (x, i) {
          var y = sy(Math.max(x, mn)), y0 = sy(Math.max(0, mn));
          h('rect', { x: f2(i * bw + g / 2), y: f2(Math.min(y, y0 - 1)), width: f2(Math.max(1, bw - g)), height: f2(Math.max(1, Math.abs(y0 - y))), rx: Math.min(2, (bw - g) / 2), class: 'ch-bar ch-spark-bar' + (i === n - 1 ? ' is-last' : ''), style: '--i:' + i }, svg);
          xs.push(i * bw + bw / 2);
        });
      } else {
        var pts = v.map(function (x, i) { var px = n === 1 ? W / 2 : pad + i * (W - pad * 2) / (n - 1); xs.push(px); return [px, sy(x)]; });
        var d = pathD(pts, o.curve);
        if (o.type === 'area') h('path', { d: d + 'L' + f2(pts[n - 1][0]) + ',' + H + 'L' + f2(pts[0][0]) + ',' + H + 'Z', fill: gradient(svg, c, 0.32, 0), class: 'ch-area' }, svg);
        h('path', { d: d, class: 'ch-line', 'stroke-width': sw, pathLength: 1 }, svg);
        if (o.dot) h('circle', { cx: f2(pts[n - 1][0]), cy: f2(pts[n - 1][1]), r: 2.5, class: 'ch-end' }, svg);
        var hov = h('circle', { r: 3.5, class: 'ch-hover-dot', cx: -10, cy: -10 }, svg);
      }
      if (o.tooltip) {
        bindIndex(svg, xs, function (i) {
          if (hov) { hov.setAttribute('cx', xs[i]); hov.setAttribute('cy', sy(v[i])); hov.style.opacity = 1; }
          else R.$$('.ch-spark-bar', svg).forEach(function (b, j) { b.classList.toggle('is-hover', j === i); });
          var p = svgPoint(svg, xs[i], o.type === 'bar' ? 0 : sy(v[i]));
          showTip(tipRows('', [{ k: labels[i] || '', v: F(v[i]), c: c }]), p.x, p.y);
        }, function () {
          if (hov) hov.style.opacity = 0; else R.$$('.ch-spark-bar', svg).forEach(function (b) { b.classList.remove('is-hover'); });
          hideTip();
        });
      }
    }
  };

  /* Axis frame shared by bar + line ------------------------------------------ */
  function frame(el, o, W, series, labels, mn, mx) {
    el.innerHTML = '';
    var F = fmter(o), H = +o.height || 260;
    var head = null;
    if (o.legend !== false && (series.length > 1 || o.legend === true)) head = div('chart-legend', el, legendHtml(series));
    var tk = ticks(mn, mx, +o.yTicks || 5), y0 = tk[0], y1 = tk[tk.length - 1];
    var showY = o.yAxis !== false;
    var ml = showY ? Math.max.apply(null, tk.map(function (t) { return F(t, true).length; })) * 6.4 + 14 : 4;
    var mt = 8, mb = o.xAxis !== false ? 28 : 6, mr = 6;
    var svg = h('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, class: 'chart-svg', role: 'img', tabindex: 0, 'aria-label': o.title || el.getAttribute('aria-label') || 'Chart' }, el);
    var iw = W - ml - mr, ih = H - mt - mb;
    var sy = function (x) { return mt + ih - (x - y0) / (y1 - y0) * ih; };
    var grid = h('g', { class: 'ch-grid' }, svg);
    if (o.grid !== false) tk.forEach(function (t) { h('line', { x1: ml, x2: W - mr, y1: f2(sy(t)), y2: f2(sy(t)), class: t === 0 ? 'is-zero' : null }, grid); });
    if (showY) {
      var ya = h('g', { class: 'ch-axis ch-axis-y' }, svg);
      tk.forEach(function (t) { var tx = h('text', { x: ml - 10, y: f2(sy(t) + 4), 'text-anchor': 'end' }, ya); tx.textContent = F(t, true); });
    }
    return { svg: svg, F: F, H: H, ml: ml, mt: mt, mb: mb, mr: mr, iw: iw, ih: ih, sy: sy, y0: y0, W: W };
  }
  function xLabels(fr, labels, xs, band) {
    var g = h('g', { class: 'ch-axis ch-axis-x' }, fr.svg), maxLen = 0;
    labels.forEach(function (l) { maxLen = Math.max(maxLen, l.length); });
    var step = Math.max(1, Math.ceil((maxLen * 6.6 + 12) / Math.max(1, band)));
    labels.forEach(function (l, i) {
      if (i % step && i !== labels.length - 1) return;
      if (i === labels.length - 1 && i % step && (i % step) < step * 0.6) return;
      var anchor = 'middle', x = xs[i];
      if (!fr.band) { if (i === 0) anchor = 'start'; else if (i === labels.length - 1) anchor = 'end'; }
      var t = h('text', { x: f2(x), y: fr.H - 8, 'text-anchor': anchor }, g); t.textContent = l;
    });
  }

  /* Bar chart ------------------------------------------------------------ */
  T.bar = {
    cls: 'bar-chart',
    defaults: { labels: '', values: '', series: '', stacked: false, height: 260, format: '', currency: '', decimals: '', prefix: '', suffix: '', legend: 'auto', grid: true, yAxis: true, xAxis: true, yTicks: 5, radius: 4, color: '', name: '', title: '' },
    render: function (el, o, W) {
      var series = getSeries(o), labels = strs(o.labels), S = series.length;
      var n = Math.max(labels.length, Math.max.apply(null, series.map(function (s) { return s.values.length; })));
      if (!n) { el.innerHTML = ''; return; }
      while (labels.length < n) labels.push('');
      var mx = 0, mn = 0;
      for (var i = 0; i < n; i++) {
        var tot = 0;
        series.forEach(function (s) { var x = s.values[i] || 0; tot += Math.max(0, x); mx = Math.max(mx, x); mn = Math.min(mn, x); });
        if (o.stacked) mx = Math.max(mx, tot);
      }
      if (o.legend === 'auto') o.legend = S > 1 ? 'auto' : false;
      var fr = frame(el, o, W, series, labels, mn, mx); fr.band = true;
      var svg = fr.svg, bw = fr.iw / n, grouped = S > 1 && !o.stacked;
      var gpad = bw * (grouped ? 0.16 : 0.2), gap = grouped ? Math.min(4, bw * 0.06) : 0;
      var inner = bw - gpad * 2, barW = grouped ? (inner - gap * (S - 1)) / S : inner;
      if (barW > 44) { barW = 44; inner = grouped ? barW * S + gap * (S - 1) : barW; }
      var bands = h('g', {}, svg), bars = h('g', { class: 'ch-bars' }, svg), xs = [], tops = [];
      var zero = fr.sy(Math.max(0, fr.y0));
      for (i = 0; i < n; i++) {
        var bx = fr.ml + i * bw, start = bx + (bw - inner) / 2, acc = 0, top = zero;
        xs.push(bx + bw / 2);
        h('rect', { x: f2(bx + 2), y: fr.mt, width: f2(Math.max(0, bw - 4)), height: fr.ih, rx: 6, class: 'ch-band' }, bands);
        var col = h('g', { class: 'ch-col', 'data-i': i }, bars);
        var lastIdx = -1;
        if (o.stacked) series.forEach(function (s, si) { if ((s.values[i] || 0) > 0) lastIdx = si; });
        series.forEach(function (s, si) {
          var val = s.values[i] || 0, x, y, hh, d;
          if (o.stacked) {
            if (val <= 0) return;
            y = fr.sy(acc + val); hh = fr.sy(acc) - y; x = start; acc += val;
            d = si === lastIdx ? roundTop(x, y, barW, hh, +o.radius) : 'M' + f2(x) + ',' + f2(y) + 'h' + f2(barW) + 'v' + f2(hh) + 'h' + f2(-barW) + 'Z';
            top = Math.min(top, y);
          } else {
            x = start + si * (barW + gap);
            y = fr.sy(Math.max(0, val)); hh = Math.abs(fr.sy(val) - zero);
            if (val < 0) { y = zero; d = 'M' + f2(x) + ',' + f2(y) + 'h' + f2(barW) + 'v' + f2(hh) + 'h' + f2(-barW) + 'Z'; }
            else d = roundTop(x, y, barW, Math.max(hh, val > 0 ? 1 : 0), +o.radius);
            top = Math.min(top, y);
          }
          h('path', { d: d, fill: s.color, class: 'ch-bar', style: '--i:' + i + (o.stacked ? ';transform-origin:center ' + f2(zero) + 'px' : '') }, col);
        });
        tops.push(top);
      }
      if (o.xAxis !== false) xLabels(fr, labels, xs, bw);
      bindIndex(svg, xs, function (k) {
        R.$$('.ch-band', svg).forEach(function (b, j) { b.classList.toggle('is-active', j === k); });
        el.setAttribute('data-hover', '');
        R.$$('.ch-col', svg).forEach(function (c, j) { c.classList.toggle('is-active', j === k); });
        var rows = series.map(function (s) { return { k: s.name, v: fr.F(s.values[k] || 0), c: s.color }; });
        if (o.stacked && S > 1) rows.push({ k: 'Total', v: fr.F(series.reduce(function (a, s) { return a + (s.values[k] || 0); }, 0)) });
        var p = svgPoint(svg, xs[k], tops[k]);
        showTip(tipRows(labels[k], rows), p.x, p.y);
      }, function () {
        el.removeAttribute('data-hover');
        R.$$('.ch-band.is-active, .ch-col.is-active', svg).forEach(function (b) { b.classList.remove('is-active'); });
        hideTip();
      });
    }
  };

  /* Line / area chart ------------------------------------------------------ */
  T.line = {
    cls: 'line-chart',
    defaults: { labels: '', values: '', series: '', type: 'line', curve: true, dots: false, zero: true, height: 260, format: '', currency: '', decimals: '', prefix: '', suffix: '', legend: 'auto', grid: true, yAxis: true, xAxis: true, yTicks: 5, stroke: 2, color: '', name: '', title: '' },
    render: function (el, o, W) {
      var series = getSeries(o), labels = strs(o.labels), S = series.length;
      var n = Math.max(labels.length, Math.max.apply(null, series.map(function (s) { return s.values.length; })));
      if (!n) { el.innerHTML = ''; return; }
      while (labels.length < n) labels.push('');
      var all = [];
      series.forEach(function (s) { all = all.concat(s.values); });
      var mn = Math.min.apply(null, all), mx = Math.max.apply(null, all);
      if (o.zero) mn = Math.min(0, mn);
      else { var padv = (mx - mn) * 0.1; mn -= padv; mx += padv; }
      if (o.legend === 'auto') o.legend = S > 1 ? 'auto' : false;
      var fr = frame(el, o, W, series, labels, mn, mx), svg = fr.svg;
      var px = 6, xs = [];
      for (var i = 0; i < n; i++) xs.push(fr.ml + px + (n === 1 ? (fr.iw - px * 2) / 2 : i * (fr.iw - px * 2) / (n - 1)));
      var area = o.type === 'area', bottom = fr.sy(fr.y0);
      var g = h('g', { class: 'ch-series' }, svg);
      series.forEach(function (s, si) {
        var pts = [];
        s.values.forEach(function (v, j) { if (v != null && !isNaN(v)) pts.push([xs[j], fr.sy(v)]); });
        if (!pts.length) return;
        var d = pathD(pts, o.curve);
        if (area) h('path', { d: d + 'L' + f2(pts[pts.length - 1][0]) + ',' + f2(bottom) + 'L' + f2(pts[0][0]) + ',' + f2(bottom) + 'Z', fill: gradient(svg, s.color, S > 1 ? 0.18 : 0.28, 0), class: 'ch-area', style: '--i:' + si }, g);
        h('path', { d: d, stroke: s.color, 'stroke-width': +o.stroke || 2, class: 'ch-line', pathLength: 1, style: '--i:' + si }, g);
        if (o.dots) pts.forEach(function (p) { h('circle', { cx: f2(p[0]), cy: f2(p[1]), r: 3, fill: s.color, class: 'ch-dot' }, g); });
      });
      if (o.xAxis !== false) xLabels(fr, labels, xs, (fr.iw) / Math.max(1, n - 1));
      var cross = h('line', { x1: 0, x2: 0, y1: fr.mt, y2: fr.mt + fr.ih, class: 'ch-cross' }, svg);
      var hd = series.map(function (s) { return h('circle', { r: 4.5, cx: -20, cy: -20, fill: s.color, class: 'ch-hover-dot' }, svg); });
      bindIndex(svg, xs, function (k) {
        cross.setAttribute('x1', xs[k]); cross.setAttribute('x2', xs[k]); cross.style.opacity = 1;
        var top = Infinity;
        series.forEach(function (s, si) {
          var v = s.values[k];
          if (v == null || isNaN(v)) { hd[si].style.opacity = 0; return; }
          var y = fr.sy(v); top = Math.min(top, y);
          hd[si].setAttribute('cx', xs[k]); hd[si].setAttribute('cy', f2(y)); hd[si].style.opacity = 1;
        });
        var p = svgPoint(svg, xs[k], top === Infinity ? fr.mt : top);
        showTip(tipRows(labels[k], series.map(function (s) { return { k: s.name, v: fr.F(s.values[k]), c: s.color }; })), p.x, p.y);
      }, function () {
        cross.style.opacity = 0; hd.forEach(function (c) { c.style.opacity = 0; }); hideTip();
      });
    }
  };

  /* Donut / pie --------------------------------------------------------------- */
  T.donut = {
    cls: 'donut-chart',
    defaults: { values: '', labels: '', colors: '', label: 'Total', value: '', pie: false, thickness: 0, size: 200, legend: 'auto', gap: 0.7, format: '', currency: '', decimals: '', prefix: '', suffix: '', title: '' },
    render: function (el, o, W) {
      var v = nums(o.values), labels = strs(o.labels), cols = strs(o.colors), F = fmter(o);
      el.innerHTML = '';
      if (!v.length) return;
      var total = v.reduce(function (a, b) { return a + b; }, 0) || 1;
      var legend = o.legend, size = Math.min(+o.size || 200, W);
      if (legend === 'auto') legend = W >= size + 230 ? 'right' : 'bottom';
      el.setAttribute('data-layout', legend);
      var pctData = o.format === 'percent' || o.suffix === '%';
      el.classList.toggle('donut-pct', pctData);
      var wrap = div('donut-wrap', el);
      var fig = div('donut-figure', wrap); fig.style.width = size + 'px'; fig.style.height = size + 'px';
      var th = o.pie ? size / 2 : (+o.thickness || Math.max(10, Math.round(size * 0.12)));
      var r = o.pie ? size / 4 : (size - th) / 2 - 1, c = size / 2;
      var svg = h('svg', { width: size, height: size, viewBox: '0 0 ' + size + ' ' + size, class: 'chart-svg', role: 'img', 'aria-label': o.title || 'Donut chart' }, fig);
      if (!o.pie) h('circle', { cx: c, cy: c, r: r, class: 'ch-track', 'stroke-width': th }, svg);
      var g = h('g', { transform: 'rotate(-90 ' + c + ' ' + c + ')' }, svg);
      var gap = v.length > 1 ? +o.gap : 0, acc = 0, segs = [];
      v.forEach(function (x, i) {
        var len = x / total * 100, col = color(cols[i], i);
        var seg = h('circle', { cx: c, cy: c, r: r, fill: 'none', stroke: col, 'stroke-width': th, pathLength: 100, class: 'ch-seg', tabindex: 0,
          style: '--len:' + f2(Math.max(0.01, len - gap)) + ';--off:' + f2(-(acc + gap / 2)) + ';--i:' + i, 'aria-label': (labels[i] || '') + ' ' + F(x) }, g);
        acc += len; segs.push(seg);
      });
      var center = null, cv, cl;
      if (!o.pie) {
        center = div('donut-center', fig);
        cv = document.createElement('b'); cl = document.createElement('span'); center.appendChild(cv); center.appendChild(cl);
        cv.style.fontSize = Math.max(14, Math.round(size * 0.12)) + 'px';
      }
      function setCenter(i) {
        if (!center) return;
        if (i == null) {
          cv.textContent = o.value !== '' ? o.value : F(total, true);
          if (o.value === '') { cv.setAttribute('data-count', total); cv.__fmt = function (x) { return F(x, true); }; }
          cl.textContent = o.label;
        } else { cv.removeAttribute('data-count'); cv.textContent = F(v[i], true); cl.textContent = (labels[i] || '') + (pctData ? '' : ' · ' + Math.round(v[i] / total * 1000) / 10 + '%'); }
      }
      setCenter(null);
      var items = [];
      if (legend !== 'none' && legend !== false) {
        var ul = document.createElement('ul'); ul.className = 'donut-legend'; wrap.appendChild(ul);
        v.forEach(function (x, i) {
          var li = document.createElement('li'); li.tabIndex = 0;
          li.innerHTML = '<i style="background:' + color(cols[i], i) + '"></i><span>' + R.esc(labels[i] || '') + '</span><b>' + R.esc(F(x)) + '</b>' + (pctData ? '' : '<em>' + Math.round(x / total * 1000) / 10 + '%</em>');
          ul.appendChild(li); items.push(li);
        });
      }
      function act(i, e) {
        el.toggleAttribute('data-active', i != null);
        segs.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
        items.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
        setCenter(i);
        if (i != null && (o.pie || !center) && e) {
          showTip(tipRows('', [{ k: labels[i] || '', v: F(v[i]) + (pctData ? '' : '  ·  ' + Math.round(v[i] / total * 100) + '%'), c: color(cols[i], i) }]), e.clientX, e.clientY - 4);
        } else hideTip();
      }
      segs.concat(items).forEach(function (n, k) {
        var i = k % v.length;
        n.addEventListener('pointerenter', function (e) { act(i, e); });
        n.addEventListener('pointermove', function (e) { if (o.pie || !center) act(i, e); });
        n.addEventListener('pointerleave', function () { act(null); });
        n.addEventListener('focus', function () { act(i); });
        n.addEventListener('blur', function () { act(null); });
      });
    }
  };

  /* Gauge / radial progress -------------------------------------------------- */
  T.gauge = {
    cls: 'gauge',
    defaults: { value: 0, min: 0, max: 100, label: '', type: 'ring', color: 'primary', size: 160, thickness: 0, text: '', format: '', currency: '', decimals: '', prefix: '', suffix: '%', title: '' },
    render: function (el, o, W) {
      var size = Math.min(+o.size || 160, W || 160), F = fmter(o);
      var th = +o.thickness || Math.max(6, Math.round(size * 0.085));
      var pct = R.clamp((+o.value - +o.min) / ((+o.max - +o.min) || 1), 0, 1);
      var span = o.type === 'half' ? 50 : o.type === 'arc' ? 75 : 100, rot = o.type === 'half' ? 180 : o.type === 'arc' ? 135 : -90;
      var r = (size - th) / 2 - 1, c = size / 2, vh = o.type === 'half' ? Math.ceil(c + th / 2 + 2) : size;
      el.innerHTML = '';
      var fig = div('gauge-figure', el); fig.style.width = size + 'px'; fig.style.height = vh + 'px';
      var col = color(o.color);
      var svg = h('svg', { width: size, height: vh, viewBox: '0 0 ' + size + ' ' + vh, class: 'chart-svg', role: 'meter', 'aria-valuemin': o.min, 'aria-valuemax': o.max, 'aria-valuenow': o.value, 'aria-label': o.title || o.label || 'Gauge' }, fig);
      var g = h('g', { transform: 'rotate(' + rot + ' ' + c + ' ' + c + ')' }, svg);
      h('circle', { cx: c, cy: c, r: r, fill: 'none', 'stroke-width': th, pathLength: 100, class: 'ch-track', style: 'stroke-dasharray:' + span + ' 100' }, g);
      h('circle', { cx: c, cy: c, r: r, fill: 'none', 'stroke-width': th, stroke: col, pathLength: 100, class: 'ch-seg ch-gauge-val', style: '--len:' + f2(Math.max(0.001, span * pct)) + ';--off:0' }, g);
      var center = div('gauge-center', fig);
      var b = document.createElement('b'); center.appendChild(b);
      b.style.fontSize = Math.max(13, Math.round(size * (o.type === 'half' ? 0.17 : 0.2))) + 'px';
      if (o.text) b.textContent = o.text;
      else { b.textContent = F(+o.value); b.setAttribute('data-count', +o.value); b.__fmt = function (x) { return F(Math.abs(+o.value) >= 10 && o.decimals === '' ? Math.round(x) : x); }; }
      if (o.label) { var s = document.createElement('span'); s.textContent = o.label; center.appendChild(s); }
      if (o.type === 'half') {
        var ends = div('gauge-ends', el); ends.style.width = size + 'px';
        ends.innerHTML = '<span>' + R.esc(F(+o.min)) + '</span><span>' + R.esc(F(+o.max)) + '</span>';
      }
    }
  };

  /* Heatmap calendar ------------------------------------------------------------ */
  function rng(seed) {
    var a = seed >>> 0;
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function parseDate(s) { if (!s) { var d = new Date(); d.setHours(0, 0, 0, 0); return d; } var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +(p[2] || 1)); }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  T.heatmap = {
    cls: 'heatmap',
    defaults: { values: '', end: '', weeks: 53, seed: 0, color: 'primary', label: 'contributions', unit: '', legend: true, summary: true, cell: 0, title: '' },
    render: function (el, o, W) {
      var weeks = Math.max(1, +o.weeks || 53), end = parseDate(o.end);
      var start = new Date(end); start.setDate(end.getDate() - end.getDay() - (weeks - 1) * 7);
      var days = Math.round((end - start) / 864e5) + 1, v = nums(o.values);
      if (!v.length) {
        var rnd = rng(+o.seed || 7), streak = 0;
        for (var i = 0; i < days; i++) {
          var dt = new Date(start); dt.setDate(start.getDate() + i);
          var wk = dt.getDay() === 0 || dt.getDay() === 6, season = 0.6 + 0.4 * Math.sin(i / 38);
          if (rnd() < 0.08) streak = Math.floor(rnd() * 6) + 2;
          var p = (wk ? 0.35 : 0.78) * season + (streak > 0 ? 0.3 : 0);
          v.push(rnd() < p ? Math.round((rnd() * rnd() * 14 + 1) * (streak > 0 ? 1.8 : 1) * season) : 0);
          if (streak > 0) streak--;
        }
      }
      // align: last value = end date
      var vals = new Array(days).fill(0), off = days - v.length;
      v.forEach(function (x, j) { if (j + off >= 0) vals[j + off] = x; });
      var nz = vals.filter(function (x) { return x > 0; }).sort(function (a, b) { return a - b; });
      var q = function (k) { return nz.length ? nz[Math.min(nz.length - 1, Math.floor(nz.length * k))] : 1; };
      var th = [q(0.25), q(0.5), q(0.75)];
      var lvl = function (x) { return x <= 0 ? 0 : x <= th[0] ? 1 : x <= th[1] ? 2 : x <= th[2] ? 3 : 4; };
      var left = 30, top = 18, gap = 3;
      var cell = +o.cell || R.clamp(Math.floor((W - left) / weeks) - gap, 7, 15);
      if (cell < 10) gap = 2;
      var gw = left + weeks * (cell + gap), gh = top + 7 * (cell + gap);
      el.innerHTML = '';
      el.style.setProperty('--c', color(o.color));
      var sc = div('heatmap-scroll', el);
      var svg = h('svg', { width: gw, height: gh, viewBox: '0 0 ' + gw + ' ' + gh, class: 'chart-svg', role: 'img', 'aria-label': o.title || 'Activity calendar' }, sc);
      var ax = h('g', { class: 'ch-axis' }, svg);
      [1, 3, 5].forEach(function (d) { var t = h('text', { x: 0, y: top + d * (cell + gap) + cell - 2 }, ax); t.textContent = DAYS[d]; });
      var lastM = -1, cells = h('g', {}, svg), total = 0;
      for (i = 0; i < days; i++) {
        var d2 = new Date(start); d2.setDate(start.getDate() + i);
        var w = Math.floor(i / 7), x = left + w * (cell + gap), y = top + d2.getDay() * (cell + gap);
        if (d2.getDate() <= 7 && d2.getMonth() !== lastM && d2.getDay() === 0) {
          lastM = d2.getMonth();
          if (w < weeks - 1) { var mt = h('text', { x: x, y: 11 }, ax); mt.textContent = MONTHS[lastM]; }
        }
        total += vals[i];
        h('rect', { x: x, y: y, width: cell, height: cell, rx: Math.max(2, cell * 0.22), class: 'hm-cell hm-l' + lvl(vals[i]), style: '--i:' + w, 'data-i': i }, cells);
      }
      var unit = o.label;
      var foot = div('heatmap-foot', el);
      foot.innerHTML = (o.summary ? '<span><b>' + total.toLocaleString('en-US') + '</b> ' + R.esc(unit) + ' in the last ' + (weeks >= 52 ? 'year' : weeks + ' weeks') + '</span>' : '<span></span>') +
        (o.legend ? '<span class="heatmap-legend">Less<i class="hm-l0"></i><i class="hm-l1"></i><i class="hm-l2"></i><i class="hm-l3"></i><i class="hm-l4"></i>More</span>' : '');
      svg.addEventListener('pointerover', function (e) {
        var t = e.target; if (!t.classList || !t.classList.contains('hm-cell')) return;
        var k = +t.getAttribute('data-i'), dd = new Date(start); dd.setDate(start.getDate() + k);
        var r = t.getBoundingClientRect(), n = vals[k];
        showTip('<div class="chart-tip-title">' + (n ? n.toLocaleString('en-US') : 'No') + ' ' + R.esc(unit) + '</div><div class="chart-tip-sub">' + DAYS[dd.getDay()] + ', ' + MONTHS[dd.getMonth()] + ' ' + dd.getDate() + ', ' + dd.getFullYear() + '</div>', r.left + r.width / 2, r.top);
      });
      svg.addEventListener('pointerleave', hideTip);
      // Most recent weeks visible on narrow screens
      sc.scrollLeft = sc.scrollWidth;
    }
  };

  /* ---------------- mounting ---------------- */
  function define(type) {
    var t = T[type];
    R.define('chart-' + type, {
      selector: '.' + t.cls,
      mount: function (el) {
        var lastW = -1, lastH = -1, raf = 0;
        function draw() {
          raf = 0;
          var W = el.clientWidth;
          if (!W && type !== 'gauge') return;
          lastW = W; lastH = el.clientHeight;
          var o = R.opts(el, t.defaults);
          if (o.decimals === '') { var mm = ((el.getAttribute('data-values') || '') + (el.getAttribute('data-series') || '')).match(/\.\d+/g); if (mm) o.decimals = Math.min(2, Math.max.apply(null, mm.map(function (x) { return x.length - 1; }))); }
          if (o.legend === 'false') o.legend = false; else if (o.legend === 'true') o.legend = true;
          try { t.render(el, o, W); } catch (e) { console.error('[Ranj] chart ' + type, e); }
          if (el.classList.contains('is-in')) R.$$('[data-count]', el).forEach(function (n) { n.textContent = (n.__fmt || String)(+n.getAttribute('data-count')); });
        }
        function schedule() { if (!raf) raf = requestAnimationFrame(draw); }
        var anim = !R.reducedMotion && !el.hasAttribute('data-static');
        if (anim) el.classList.add('chart-anim'); else el.classList.add('is-in');
        draw();
        var ro = 'ResizeObserver' in window ? new ResizeObserver(function () {
          if (Math.abs(el.clientWidth - lastW) > 1 || (type === 'sparkline' && Math.abs(el.clientHeight - lastH) > 1)) schedule();
        }) : null;
        if (ro) ro.observe(el);
        var mo = new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) if (/^data-/.test(ms[i].attributeName) && ms[i].attributeName !== 'data-active' && ms[i].attributeName !== 'data-hover' && ms[i].attributeName !== 'data-layout') { schedule(); return; } });
        mo.observe(el, { attributes: true });
        var stopView = anim ? R.inView(el, function () {
          el.classList.add('is-in');
          R.$$('[data-count]', el).forEach(countUp);
        }, { threshold: 0.2 }) : function () {};
        return function () { if (ro) ro.disconnect(); mo.disconnect(); stopView(); cancelAnimationFrame(raf); hideTip(); };
      }
    });
  }
  Object.keys(T).forEach(define);

  /** Ranj.chart.bar(el, { labels: [...], series: [...] }) — sets data-* and (re)renders. */
  function api(type) {
    return function (el, o) {
      if (typeof el === 'string') el = R.$(el);
      if (!el) return null;
      el.classList.add(T[type].cls);
      o = o || {};
      for (var k in o) {
        var name = 'data-' + k.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); });
        var val = o[k];
        if (val === false) val = 'false';
        else if (Array.isArray(val) && typeof val[0] !== 'object') val = val.join(',');
        else if (typeof val === 'object') val = JSON.stringify(val);
        el.setAttribute(name, String(val));
      }
      R.init(el);
      return el;
    };
  }
  R.chart = { sparkline: api('sparkline'), bar: api('bar'), line: api('line'), donut: api('donut'), gauge: api('gauge'), heatmap: api('heatmap'), format: function (v, o) { return fmter(o || {})(v); } };
})(window.Ranj);

;
/* --- components/base/chip.js --- */
/* Ranj UI — Chip: toggle, single-select groups, remove, and chip input */
(function (R) {
  'use strict';
  var X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  function removeChip(chip) {
    if (!chip || chip.hasAttribute('data-removing')) return;
    var label = (chip.getAttribute('data-value') || chip.textContent || '').trim();
    if (!R.emit(chip, 'remove', { value: label })) return; // cancelable
    var group = chip.parentElement;
    var next = chip.nextElementSibling || chip.previousElementSibling;
    var done = function () {
      chip.remove();
      if (group) R.emit(group, 'change', { values: values(group) });
      var f = next && (next.querySelector('.chip-remove, .badge-remove') || (next.matches('input') ? next : null));
      if (f) f.focus();
    };
    if (R.reducedMotion) return done();
    chip.setAttribute('data-removing', '');
    setTimeout(done, 200);
  }

  function values(group) {
    return R.$$('.chip, .badge', group).filter(function (c) {
      return !c.hasAttribute('aria-pressed') || c.getAttribute('aria-pressed') === 'true';
    }).map(function (c) { return (c.getAttribute('data-value') || c.textContent).trim(); });
  }

  function makeChip(text) {
    var c = document.createElement('span');
    c.className = 'chip chip-enter';
    c.setAttribute('data-value', text);
    c.innerHTML = R.esc(text) + '<button type="button" class="chip-remove" aria-label="Remove ' + R.esc(text) + '">' + X + '</button>';
    return c;
  }

  R.define('chip', {
    selector: '.chip-input',
    setup: function () {
      // Toggle chips (aria-pressed). In [data-single] groups only one can be on.
      R.on(document, 'click', '.chip[aria-pressed]', function (e, chip) {
        if (e.target.closest('.chip-remove')) return;
        var group = chip.closest('.chip-group');
        var on = chip.getAttribute('aria-pressed') !== 'true';
        if (group && group.hasAttribute('data-single')) {
          if (!on && group.hasAttribute('data-required')) return;
          R.$$('.chip[aria-pressed]', group).forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        }
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
        R.emit(chip, 'toggle', { pressed: on, value: (chip.getAttribute('data-value') || chip.textContent).trim() });
        if (group) R.emit(group, 'change', { values: values(group) });
      });
      R.on(document, 'click', '.chip-remove, .badge-remove', function (e, btn) {
        e.preventDefault(); e.stopPropagation();
        removeChip(btn.closest('.chip, .tag, .badge'));
      });
      R.on(document, 'keydown', '.chip[data-removable], .chip-input .chip', function (e, chip) {
        if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); removeChip(chip); }
      });
    },
    mount: function (el) {
      var input = R.$('input', el);
      if (!input) return;
      var offClick = R.on(el, 'click', function (e) { if (e.target === el) input.focus(); });
      var offKey = R.on(input, 'keydown', function (e) {
        var v = input.value.trim();
        if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && v) {
          if (e.key !== 'Tab') e.preventDefault(); else if (!v) return;
          var exists = R.$$('.chip', el).some(function (c) { return (c.getAttribute('data-value') || '').toLowerCase() === v.toLowerCase(); });
          if (!exists) {
            if (!R.emit(el, 'add', { value: v })) return;
            el.insertBefore(makeChip(v), input);
            R.emit(el, 'change', { values: values(el) });
          }
          input.value = '';
          if (e.key === 'Tab') e.preventDefault();
        } else if (e.key === 'Backspace' && !input.value) {
          var chips = R.$$('.chip', el), last = chips[chips.length - 1];
          if (last) removeChip(last);
        }
      });
      return function () { offClick(); offKey(); };
    }
  });
  R.chip = { remove: removeChip, values: values, create: makeChip };
})(window.Ranj);

;
/* --- components/base/code-block.js --- */
/* Ranj UI — Code block: copy, line numbers, highlighted lines, tabs, tiny highlighter */
(function (R) {
  'use strict';

  function ranges(str) {
    var set = {};
    String(str || '').split(',').forEach(function (part) {
      part = part.trim(); if (!part) return;
      var m = part.split('-'), a = parseInt(m[0], 10), b = parseInt(m[1] || m[0], 10);
      for (var i = a; i <= b; i++) set[i] = true;
    });
    return set;
  }

  /* Small, safe highlighter for js/ts/html/css/bash/json. Works line by line on escaped text. */
  var KW = /\b(const|let|var|function|return|if|else|for|while|import|from|export|default|new|class|extends|async|await|try|catch|throw|typeof|interface|type|true|false|null|undefined|this)\b/g;
  function hl(line, lang) {
    var s = R.esc(line), out = [];
    function stash(cls) { return function (m) { out.push('<span class="tok-' + cls + '">' + m + '</span>'); return '\u0000' + String.fromCharCode(0xE000 + out.length - 1); }; }
    if (lang === 'html' || lang === 'xml' || lang === 'svg') {
      s = s.replace(/&lt;!--[\s\S]*?--&gt;/g, stash('c'))
        .replace(/(&lt;\/?)([\w-]+)([^]*?)(\/?&gt;)/g, function (m, a, tag, rest, b) {
          rest = rest.replace(/([\w:@.-]+)(=)(&quot;[^]*?&quot;|&#39;[^]*?&#39;)/g, function (mm, n, eq, v) { return stash('a')(n) + eq + stash('s')(v); });
          return stash('p')(a) + stash('t')(tag) + rest + stash('p')(b);
        });
    } else if (lang === 'css' || lang === 'scss') {
      s = s.replace(/\/\*[^]*?\*\//g, stash('c'))
        .replace(/(&quot;[^]*?&quot;|&#39;[^]*?&#39;)/g, stash('s'))
        .replace(/([\w-]+)(?=\s*:[^:])/g, stash('a'))
        .replace(/#[0-9a-fA-F]{3,8}\b|\b\d+(\.\d+)?(px|rem|em|%|ms|s|deg|vh|vw|fr)?\b/g, stash('n'))
        .replace(/([.#][\w-]+)(?=[^;]*\{)/g, stash('t'));
    } else if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
      s = s.replace(/^(\$|&gt;)\s/, stash('prompt'))
        .replace(/(&quot;[^]*?&quot;|&#39;[^]*?&#39;)/g, stash('s'))
        .replace(/(^|\s)#.*$/g, stash('c'))
        .replace(/(^|\s)(--?[\w-]+)/g, function (m, sp, f) { return sp + stash('a')(f); })
        .replace(/^(\s*)(npm|npx|pnpm|yarn|bun|git|cd|node|curl|brew)\b/, function (m, sp, c) { return sp + stash('f')(c); });
    } else {
      s = s.replace(/(&quot;[^]*?&quot;|&#39;[^]*?&#39;|`[^`]*`)/g, stash('s'))
        .replace(/\/\/.*$|\/\*[^]*?\*\//g, stash('c'))
        .replace(KW, stash('k'))
        .replace(/\b\d+(\.\d+)?\b/g, stash('n'))
        .replace(/\b([a-zA-Z_$][\w$]*)(?=\()/g, stash('f'));
    }
    // Resolve stashed tokens (they may nest: resolve repeatedly)
    for (var i = 0; i < 4 && s.indexOf('\u0000') > -1; i++) s = s.replace(/\u0000([\uE000-\uF8FF])/g, function (m, c) { return out[c.charCodeAt(0) - 0xE000]; });
    return s;
  }

  function build(el) {
    R.$$('pre > code', el).forEach(function (code) {
      if (code.__lined) return; code.__lined = true;
      var lang = code.getAttribute('data-lang') || el.getAttribute('data-lang');
      var plain = !code.children.length;
      var raw = plain ? code.textContent : code.innerHTML;
      raw = raw.replace(/^\n/, '').replace(/\s+$/, '');
      var lines = raw.split('\n');
      var src = el.querySelector('[data-code-panel]') ? code.closest('[data-code-panel]') || el : el;
      var hlSet = ranges(src.getAttribute('data-highlight') || el.getAttribute('data-highlight'));
      var addSet = ranges(src.getAttribute('data-added') || el.getAttribute('data-added'));
      var delSet = ranges(src.getAttribute('data-removed') || el.getAttribute('data-removed'));
      code.innerHTML = lines.map(function (l, i) {
        var n = i + 1, cls = 'line' + (hlSet[n] ? ' hl' : '') + (addSet[n] ? ' add' : '') + (delSet[n] ? ' del' : '');
        var html = plain ? (lang ? hl(l, lang) : R.esc(l)) : l;
        return '<span class="' + cls + '">' + (html || '​') + '</span>';
      }).join('');
      code.setAttribute('data-raw', lines.map(function (l) { return plain ? l : l.replace(/<[^>]+>/g, ''); }).join('\n'));
    });
  }

  function textOf(el) {
    var panel = R.$('[data-code-panel]:not([hidden])', el) || el;
    var code = R.$('pre > code', panel) || R.$('code', panel);
    if (!code) return '';
    var raw = code.getAttribute('data-raw');
    if (raw != null) {
      var txt = document.createElement('textarea'); txt.innerHTML = raw; raw = txt.value;
      return raw.split('\n').map(function (l) { return l.replace(/^\$\s/, ''); }).join('\n');
    }
    return code.textContent.replace(/^\$\s/gm, '');
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext !== false) return navigator.clipboard.writeText(text);
    return new Promise(function (res) {
      var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove(); res();
    });
  }

  R.copy = R.copy || copyText;

  R.define('code-block', {
    selector: '.code-block, .code-inline',
    setup: function () {
      R.on(document, 'click', '.code-block-copy', function (e, btn) {
        var host = btn.closest('.code-block, .code-inline');
        var text = btn.getAttribute('data-copy-text') || (host ? textOf(host) : '');
        var done = function () {
          btn.setAttribute('data-copied', '');
          var label = btn.querySelector('.code-block-copy-label');
          if (label) { label.__old = label.__old || label.textContent; label.textContent = btn.getAttribute('data-copied-label') || 'Copied'; }
          var live = btn.getAttribute('aria-label'); btn.setAttribute('aria-label', 'Copied');
          clearTimeout(btn.__t);
          btn.__t = setTimeout(function () { btn.removeAttribute('data-copied'); if (label) label.textContent = label.__old; if (live) btn.setAttribute('aria-label', live); }, 1600);
          if (host) R.emit(host, 'copy', { text: text });
        };
        copyText(text).then(done, done);
      });
    },
    mount: function (el) {
      if (el.classList.contains('code-inline')) return;
      build(el);
      var tabs = R.$$('.code-block-tabs [data-code-tab]', el);
      if (!tabs.length) return;
      var list = R.$('.code-block-tabs', el);
      list.setAttribute('role', 'tablist');
      function select(btn, focus) {
        var key = btn.getAttribute('data-code-tab');
        tabs.forEach(function (t) {
          var on = t === btn;
          t.setAttribute('role', 'tab'); t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
        });
        R.$$('[data-code-panel]', el).forEach(function (p) { p.hidden = p.getAttribute('data-code-panel') !== key; p.setAttribute('role', 'tabpanel'); });
        if (focus) btn.focus();
        R.emit(el, 'change', { tab: key });
      }
      var initial = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
      select(initial);
      var off1 = R.on(list, 'click', '[data-code-tab]', function (e, btn) { select(btn); });
      var off2 = R.on(list, 'keydown', function (e) {
        var i = tabs.indexOf(document.activeElement); if (i < 0) return;
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (n == null) return; e.preventDefault(); select(tabs[(n + tabs.length) % tabs.length], true);
      });
      return function () { off1(); off2(); };
    }
  });
  R.highlight = hl;
})(window.Ranj);

;
/* --- components/base/countdown.js --- */
/* Ranj UI — Countdown to data-to (ISO date). Styles: default, .countdown-boxed, .countdown-inline, .countdown-flip. */
(function (R) {
  'use strict';
  var NAMES = { d: ['Days', 'd'], h: ['Hours', 'h'], m: ['Minutes', 'm'], s: ['Seconds', 's'] };
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function parts(ms) {
    var t = Math.max(0, Math.floor(ms / 1000));
    return { d: Math.floor(t / 86400), h: Math.floor(t % 86400 / 3600), m: Math.floor(t % 3600 / 60), s: t % 60 };
  }
  R.define('countdown', {
    selector: '.countdown[data-to], .countdown[data-seconds]',
    mount: function (el) {
      var o = R.opts(el, { to: '', seconds: 0, units: 'dhms', labels: true, separator: '', urgent: 0, hideZeroDays: false });
      var inline = el.classList.contains('countdown-inline'), flip = el.classList.contains('countdown-flip');
      var target = o.to ? new Date(o.to).getTime() : Date.now() + o.seconds * 1000;
      if (isNaN(target)) { console.warn('[Ranj] countdown: invalid data-to', o.to); return; }
      var units = o.units.split('').filter(function (u) { return NAMES[u]; });
      if (o.hideZeroDays && parts(target - Date.now()).d === 0) units = units.filter(function (u) { return u !== 'd'; });
      el.setAttribute('role', 'timer');
      el.setAttribute('aria-live', 'off');
      var sep = o.separator || (el.classList.contains('countdown-boxed') || flip ? ':' : '');
      el.innerHTML = units.map(function (u, i) {
        return (i && sep && !inline ? '<span class="countdown-sep" aria-hidden="true">' + R.esc(sep) + '</span>' : '') +
          '<span class="countdown-unit" data-unit="' + u + '"><span class="countdown-num"></span>' +
          (o.labels ? '<span class="countdown-label">' + (inline ? NAMES[u][1] : NAMES[u][0]) + '</span>' : '') + '</span>';
      }).join('');
      var nums = {}; units.forEach(function (u) { nums[u] = el.querySelector('[data-unit="' + u + '"] .countdown-num'); });
      var last = {}, timer = 0, done = false;
      function fmt(u, v) { return u === 'd' && v > 99 ? '' + v : pad(v); }
      function flipSet(box, str) {
        var cards = box.children;
        if (cards.length !== str.length) {
          box.innerHTML = str.split('').map(function (c) { return card(c); }).join('');
          return;
        }
        str.split('').forEach(function (c, i) {
          var cd = cards[i], cur = cd.getAttribute('data-v');
          if (cur === c) return;
          cd.setAttribute('data-v', c);
          cd.querySelector('.cd-top > span').textContent = c;
          cd.querySelector('.cd-flap-top > span').textContent = cur;
          cd.querySelector('.cd-flap-bottom > span').textContent = c;
          cd.querySelector('.cd-bottom > span').textContent = cur;
          if (R.reducedMotion) { cd.querySelector('.cd-bottom > span').textContent = c; cd.querySelector('.cd-flap-top > span').textContent = c; return; }
          cd.classList.remove('is-flipping'); void cd.offsetWidth; cd.classList.add('is-flipping');
          clearTimeout(cd.__t);
          cd.__t = setTimeout(function () { cd.querySelector('.cd-bottom > span').textContent = c; cd.querySelector('.cd-flap-top > span').textContent = c; cd.classList.remove('is-flipping'); }, 620);
        });
      }
      function card(c) {
        return '<span class="cd-card" data-v="' + c + '" aria-hidden="true"><span class="cd-half cd-top"><span>' + c + '</span></span><span class="cd-half cd-bottom"><span>' + c + '</span></span>' +
          '<span class="cd-half cd-flap-top"><span>' + c + '</span></span><span class="cd-half cd-flap-bottom"><span>' + c + '</span></span></span>';
      }
      function tick() {
        var left = target - Date.now(), p = parts(left);
        if (units.indexOf('d') < 0) p.h += p.d * 24;
        units.forEach(function (u) {
          var v = fmt(u, p[u]);
          if (last[u] === v) return;
          if (flip) flipSet(nums[u], v);
          else {
            nums[u].textContent = v;
            if (last[u] != null && !R.reducedMotion) { nums[u].classList.remove('is-tick'); void nums[u].offsetWidth; nums[u].classList.add('is-tick'); }
          }
          last[u] = v;
        });
        el.setAttribute('aria-label', units.map(function (u) { return p[u] + ' ' + NAMES[u][0].toLowerCase(); }).join(', ') + ' remaining');
        el.classList.toggle('is-urgent', o.urgent > 0 && left > 0 && left <= o.urgent * 1000);
        R.emit(el, 'tick', { remaining: Math.max(0, left), days: p.d, hours: p.h, minutes: p.m, seconds: p.s });
        if (left <= 0) {
          if (!done) { done = true; el.classList.add('is-done'); R.emit(el, 'done', {}); }
          return;
        }
        timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
      }
      tick();
      el.ranjCountdown = { set: function (d) { target = new Date(d).getTime(); done = false; el.classList.remove('is-done'); clearTimeout(timer); tick(); } };
      return function () { clearTimeout(timer); delete el.ranjCountdown; };
    }
  });
})(window.Ranj);

;
/* --- components/base/data-table.js --- */
/* Ranj UI — Data table: sort, search, column visibility, selection, pagination, bulk actions.
 * Enhance a plain <table class="table" data-table ...> or render from JSON with Ranj.dataTable(el, opts). */
(function (R) {
  'use strict';
  var NS = 'data-table';
  var I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    sort: '<svg class="dt-sort-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="up" d="M5 6.5 8 3.5l3 3"/><path class="down" d="M5 9.5l3 3 3-3"/></svg>',
    cols: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h10M4 18h6"/><circle cx="18" cy="16" r="3"/><path d="M18 11.5v1.5M18 19v1.5M21.9 16h-1.5M15.6 16h-1.5"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>',
    first: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    last: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>',
    empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8.5 11h5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  };

  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function slug(s) { return String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'col'; }
  function numOf(s) {
    if (typeof s === 'number') return s;
    var t = String(s).replace(/[\s,$€£¥₹%]/g, '').replace(/^\((.*)\)$/, '-$1').replace(/[−–]/g, '-');
    var m = /^([+-]?\d*\.?\d+)([kmb])?$/i.exec(t); if (!m) return NaN;
    return parseFloat(m[1]) * ({ k: 1e3, m: 1e6, b: 1e9 }[(m[2] || '').toLowerCase()] || 1);
  }
  function dateOf(s) { if (s instanceof Date) return +s; var t = String(s).trim(); if (!/[a-z]|-|\//i.test(t) || /^\d+$/.test(t)) return NaN; var v = Date.parse(t); return isNaN(v) ? NaN : v; }
  function detect(vals) {
    var vs = vals.filter(function (v) { return String(v).trim() !== '' && String(v).trim() !== '—'; });
    if (!vs.length) return 'text';
    if (vs.every(function (v) { return !isNaN(numOf(v)); })) return 'number';
    if (vs.every(function (v) { return !isNaN(dateOf(v)); })) return 'date';
    return 'text';
  }
  function keyOf(v, type) {
    if (type === 'number' || type === 'currency' || type === 'percent') { var n = numOf(v); return isNaN(n) ? -Infinity : n; }
    if (type === 'date') { var d = dateOf(v); return isNaN(d) ? -Infinity : d; }
    return String(v == null ? '' : v).toLowerCase();
  }
  var collator = typeof Intl !== 'undefined' ? new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }) : null;

  function DataTable(table, cfg) {
    var self = this;
    cfg = cfg || {};
    var o = R.opts(table, { pageSize: 10, pageSizes: '5,10,20,50', search: true, columnsMenu: true, select: false, pagination: true, bulk: '', searchPlaceholder: 'Search…', emptyTitle: 'No results', emptyText: 'Try a different search term.', info: true });
    for (var k in cfg) if (cfg[k] !== undefined && k in o) o[k] = cfg[k];
    if (typeof o.bulk === 'string') o.bulk = o.bulk ? o.bulk.split(',').map(function (s) { s = s.trim(); return { label: s, action: slug(s), danger: /delete|remove|archive/i.test(s) }; }) : [];
    if (o.bulk.length && !table.hasAttribute('data-select') && cfg.select === undefined) o.select = true;
    this.table = table; this.o = o;
    var thead = table.tHead, tbody = table.tBodies[0];
    if (!tbody) { tbody = document.createElement('tbody'); table.appendChild(tbody); }
    this.tbody = tbody;
    var ths = thead ? [].slice.call(thead.rows[0].cells) : [];
    var cols = this.cols = ths.map(function (th, i) {
      var c = (cfg.columns && cfg.columns[i]) || {};
      return {
        th: th, i: i,
        key: c.key || th.getAttribute('data-key') || slug(th.textContent),
        label: c.label || th.getAttribute('data-label') || th.textContent.trim() || ('Column ' + (i + 1)),
        type: c.type || th.getAttribute('data-type') || '',
        sortable: c.sortable != null ? c.sortable : (th.hasAttribute('data-sort') || th.hasAttribute('data-sortable') || table.hasAttribute('data-sort-all')) && th.getAttribute('data-sort') !== 'false',
        hidden: c.hidden != null ? !!c.hidden : th.hasAttribute('data-hidden'),
        hideable: c.hideable != null ? c.hideable : th.getAttribute('data-hideable') !== 'false' && !!th.textContent.trim()
      };
    });
    var trs = [].slice.call(tbody.rows);
    this.rows = trs.map(function (tr, ri) { return self._row(tr, (cfg.rows && cfg.rows[ri]) || null); });
    cols.forEach(function (c) {
      if (!c.type) c.type = detect(self.rows.map(function (r) { return r.raw[c.i]; }));
      if (c.type === 'number' || c.type === 'currency' || c.type === 'percent') c.th.classList.add('num');
    });
    this.rows.forEach(function (r) { r.keys = cols.map(function (c) { return keyOf(r.raw[c.i], c.type); }); });
    this.sortCol = -1; this.sortDir = 0; this.page = 1; this.q = '';
    this.pageSize = o.pagination ? o.pageSize : Infinity;
    this.offs = [];
    this._build();
    // initial sort from aria-sort / data-sort="asc|desc"
    cols.forEach(function (c) { var s = c.th.getAttribute('data-sort'); if (s === 'asc' || s === 'desc') { self.sortCol = c.i; self.sortDir = s === 'asc' ? 1 : -1; } });
    this.render();
  }

  DataTable.prototype._row = function (tr, data) {
    var cells = [].slice.call(tr.cells), self = this;
    var raw = cells.map(function (td) { return td.hasAttribute('data-value') ? td.getAttribute('data-value') : td.textContent.trim(); });
    var obj = data;
    if (!obj) { obj = {}; this.cols.forEach(function (c, i) { obj[c.key] = raw[i]; }); }
    var r = { tr: tr, raw: raw, data: obj, text: cells.map(function (td) { return td.textContent; }).join(' \u0001 ').toLowerCase(), sel: tr.getAttribute('aria-selected') === 'true' };
    if (this.cols && this.cols.length && this.rows) r.keys = this.cols.map(function (c) { return keyOf(raw[c.i], c.type); });
    if (this.o.select) self._addCheck(r);
    return r;
  };

  DataTable.prototype._addCheck = function (r) {
    var td = h('td', 'dt-check-cell'), cb = h('input', 'dt-check');
    cb.type = 'checkbox'; cb.setAttribute('aria-label', 'Select row'); cb.checked = r.sel;
    td.appendChild(cb); r.tr.insertBefore(td, r.tr.firstChild); r.cb = cb;
  };

  DataTable.prototype._build = function () {
    var self = this, o = this.o, table = this.table;
    var host = table.parentElement && /\btable-wrap(per)?\b/.test(table.parentElement.className) ? table.parentElement : null;
    if (!host) { host = h('div', 'table-wrapper'); table.parentNode.insertBefore(host, table); host.appendChild(table); }
    var shell = host.parentElement && host.parentElement.classList.contains('data-table') ? host.parentElement : null;
    if (!shell) { shell = h('div', 'data-table'); host.parentNode.insertBefore(shell, host); shell.appendChild(host); this._ownShell = true; }
    this.shell = shell; this.host = host;
    table.classList.add('table');

    // Header: sort buttons
    this.cols.forEach(function (c) {
      if (!c.sortable) return;
      var label = c.th.innerHTML;
      c.th.innerHTML = '';
      var b = h('button', 'dt-sort', '<span>' + label + '</span>' + I.sort);
      b.type = 'button';
      c.th.appendChild(b); c.btn = b; c.th.classList.add('dt-sortable');
      c.th.setAttribute('aria-sort', 'none');
      self.offs.push(R.on(b, 'click', function () { self.sortBy(c.i); }));
    });
    if (o.select) {
      var th = h('th', 'dt-check-cell'); th.setAttribute('scope', 'col');
      var all = h('input', 'dt-check'); all.type = 'checkbox'; all.setAttribute('aria-label', 'Select all rows');
      th.appendChild(all); this.allCb = all;
      if (table.tHead) table.tHead.rows[0].insertBefore(th, table.tHead.rows[0].firstChild);
      this.offs.push(R.on(all, 'change', function () { self.selectAll(all.checked); }));
      this.offs.push(R.on(this.tbody, 'change', '.dt-check', function (e, cb) {
        var r = self._byTr(cb.closest('tr')); if (!r) return;
        r.sel = cb.checked; self._syncSel(); self._emitSel();
      }));
      this.offs.push(R.on(this.tbody, 'click', 'td', function (e, td) {
        // Shift-click range select
        var tr = td.closest('tr'); var r = self._byTr(tr); if (!r || !e.shiftKey || !e.target.classList.contains('dt-check')) { if (r) self._last = r; return; }
        var vis = self._visible, a = vis.indexOf(self._last), b = vis.indexOf(r);
        if (a > -1 && b > -1) { var lo = Math.min(a, b), hi = Math.max(a, b); for (var i = lo; i <= hi; i++) vis[i].sel = r.cb.checked; self._syncSel(); self._emitSel(); }
        self._last = r;
      }));
    }

    // Toolbar
    var tb = shell.querySelector(':scope > .dt-toolbar');
    var needToolbar = o.search || o.columnsMenu;
    if (needToolbar) {
      if (!tb) { tb = h('div', 'dt-toolbar'); shell.insertBefore(tb, host); this._ownTb = tb; }
      var custom = [].slice.call(tb.children);
      if (o.search) {
        var s = h('label', 'dt-search', I.search + '<input type="search" autocomplete="off" spellcheck="false">');
        var inp = s.querySelector('input'); inp.placeholder = o.searchPlaceholder; inp.setAttribute('aria-label', o.searchPlaceholder.replace(/…$/, ''));
        tb.insertBefore(s, tb.firstChild); this.input = inp;
        var t;
        this.offs.push(R.on(inp, 'input', function () { clearTimeout(t); t = setTimeout(function () { self.search(inp.value); }, 90); }));
        this.offs.push(R.on(inp, 'keydown', function (e) { if (e.key === 'Escape' && inp.value) { e.stopPropagation(); inp.value = ''; self.search(''); } }));
      }
      var sp = h('div', 'dt-spacer'); tb.insertBefore(sp, custom[0] || null);
      if (o.columnsMenu && this.cols.some(function (c) { return c.hideable; })) {
        var cb = h('button', 'dt-btn', I.cols + '<span>Columns</span>'); cb.type = 'button';
        cb.setAttribute('aria-haspopup', 'menu'); cb.setAttribute('aria-expanded', 'false');
        tb.appendChild(cb); this.colBtn = cb;
        this.offs.push(R.on(cb, 'click', function () { self.menu ? self.closeMenu() : self.openMenu(); }));
      }
    }

    // Bulk bar
    if (o.select && o.bulk.length) {
      var bar = h('div', 'dt-bulk'); bar.hidden = true; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Bulk actions');
      bar.innerHTML = '<span class="dt-bulk-count" aria-live="polite"></span><div class="dt-bulk-scroll"></div><button type="button" class="dt-btn dt-btn-icon" aria-label="Clear selection" data-dt-clear>' + I.x + '</button>';
      var sc = bar.querySelector('.dt-bulk-scroll');
      o.bulk.forEach(function (a) {
        var b = h('button', 'dt-btn' + (a.danger ? ' dt-btn-danger' : ''), (a.icon || '') + '<span>' + R.esc(a.label) + '</span>'); b.type = 'button'; b.setAttribute('data-dt-action', a.action || slug(a.label));
        sc.appendChild(b);
      });
      shell.appendChild(bar); this.bulkBar = bar;
      this.offs.push(R.on(bar, 'click', 'button', function (e, b) {
        if (b.hasAttribute('data-dt-clear')) { self.selectAll(false); return; }
        var act = b.getAttribute('data-dt-action'), rows = self.getSelected();
        var def = o.bulk.filter(function (x) { return (x.action || slug(x.label)) === act; })[0];
        var ok = R.emit(table, 'bulk', { action: act, rows: rows, count: rows.length });
        if (ok && def && typeof def.onClick === 'function') def.onClick(rows, self);
      }));
    }

    // Footer
    if (o.pagination || o.info || o.select) {
      var ft = h('div', 'dt-footer');
      ft.innerHTML = '<div class="dt-info" aria-live="polite"></div><div class="dt-footer-right"></div>';
      var right = ft.lastChild;
      if (o.pagination) {
        var sizes = String(o.pageSizes).split(',').map(Number).filter(Boolean);
        if (sizes.indexOf(o.pageSize) < 0) { sizes.push(o.pageSize); sizes.sort(function (a, b) { return a - b; }); }
        var sz = h('label', 'dt-size', '<span>Rows per page</span><select>' + sizes.map(function (n) { return '<option' + (n === o.pageSize ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select>');
        right.appendChild(sz);
        var pg = h('div', 'dt-pages');
        pg.innerHTML = '<button type="button" class="dt-btn dt-btn-icon" data-go="first" aria-label="First page">' + I.first + '</button>' +
          '<button type="button" class="dt-btn dt-btn-icon" data-go="prev" aria-label="Previous page">' + I.prev + '</button>' +
          '<span class="dt-page-label"></span>' +
          '<button type="button" class="dt-btn dt-btn-icon" data-go="next" aria-label="Next page">' + I.next + '</button>' +
          '<button type="button" class="dt-btn dt-btn-icon" data-go="last" aria-label="Last page">' + I.last + '</button>';
        right.appendChild(pg); this.pager = pg;
        this.offs.push(R.on(sz.querySelector('select'), 'change', function () { self.setPageSize(+this.value); }));
        this.offs.push(R.on(pg, 'click', 'button', function (e, b) {
          var g = b.getAttribute('data-go'), n = self.pages();
          self.goTo(g === 'first' ? 1 : g === 'prev' ? self.page - 1 : g === 'next' ? self.page + 1 : n);
        }));
      }
      shell.appendChild(ft); this.footer = ft; this.infoEl = ft.firstChild;
    }
  };

  DataTable.prototype._byTr = function (tr) { for (var i = 0; i < this.rows.length; i++) if (this.rows[i].tr === tr) return this.rows[i]; return null; };

  DataTable.prototype.filtered = function () {
    var q = this.q, rows = this.rows.slice();
    if (q) {
      var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      rows = rows.filter(function (r) { return terms.every(function (t) { return r.text.indexOf(t) > -1; }); });
    }
    if (this.sortDir && this.sortCol > -1) {
      var c = this.sortCol, d = this.sortDir, idx = this.rows;
      rows.sort(function (a, b) {
        var x = a.keys[c], y = b.keys[c], r;
        if (typeof x === 'string') r = collator ? collator.compare(x, y) : (x < y ? -1 : x > y ? 1 : 0);
        else r = x - y;
        return (r * d) || (idx.indexOf(a) - idx.indexOf(b));
      });
    }
    return rows;
  };
  DataTable.prototype.pages = function () { return Math.max(1, Math.ceil(this._count / this.pageSize) || 1); };

  DataTable.prototype.render = function (animate) {
    var self = this, o = this.o;
    var rows = this.filtered();
    this._count = rows.length; this._visible = rows;
    this.page = R.clamp(this.page, 1, this.pages());
    var start = (this.page - 1) * this.pageSize, pageRows = isFinite(this.pageSize) ? rows.slice(start, start + this.pageSize) : rows;
    var frag = document.createDocumentFragment();
    var hidden = this.cols.map(function (c) { return c.hidden; }), off = o.select ? 1 : 0;
    this.cols.forEach(function (c) { c.th.hidden = c.hidden; });
    pageRows.forEach(function (r) {
      var cells = r.tr.cells;
      for (var i = 0; i < hidden.length; i++) if (cells[i + off]) cells[i + off].hidden = hidden[i];
      r.tr.setAttribute('aria-selected', r.sel ? 'true' : 'false');
      if (r.cb) r.cb.checked = r.sel;
      frag.appendChild(r.tr);
    });
    if (!pageRows.length) {
      var span = this.cols.filter(function (c) { return !c.hidden; }).length + off;
      var tr = h('tr', 'dt-empty'), td = h('td');
      td.colSpan = span;
      td.innerHTML = '<div class="dt-empty-inner">' + I.empty + '<b>' + R.esc(this.q ? o.emptyTitle : 'Nothing here yet') + '</b><span>' + (this.q ? 'No rows match “' + R.esc(this.q) + '”. ' + R.esc(o.emptyText) : 'There are no rows to show.') + '</span>' + (this.q ? '<button type="button" class="dt-btn" data-dt-reset>Clear search</button>' : '') + '</div>';
      tr.appendChild(td); frag.appendChild(tr);
      var btn = td.querySelector('[data-dt-reset]');
      if (btn) btn.onclick = function () { if (self.input) { self.input.value = ''; self.input.focus(); } self.search(''); };
    }
    this.tbody.replaceChildren ? this.tbody.replaceChildren(frag) : (this.tbody.innerHTML = '', this.tbody.appendChild(frag));
    if (animate && !R.reducedMotion) {
      this.shell.classList.remove('is-animating'); void this.shell.offsetWidth; this.shell.classList.add('is-animating');
      clearTimeout(this._at); this._at = setTimeout(function () { self.shell.classList.remove('is-animating'); }, 260);
    }
    // header sort state
    this.cols.forEach(function (c) { if (c.btn) c.th.setAttribute('aria-sort', c.i === self.sortCol && self.sortDir ? (self.sortDir > 0 ? 'ascending' : 'descending') : 'none'); });
    if (this.pager) {
      var n = this.pages();
      this.pager.querySelector('.dt-page-label').textContent = 'Page ' + this.page + ' of ' + n;
      this.pager.querySelector('[data-go="first"]').disabled = this.pager.querySelector('[data-go="prev"]').disabled = this.page <= 1;
      this.pager.querySelector('[data-go="last"]').disabled = this.pager.querySelector('[data-go="next"]').disabled = this.page >= n;
    }
    this._syncSel();
  };

  DataTable.prototype._syncSel = function () {
    var o = this.o, vis = this._visible || [], sel = this.rows.filter(function (r) { return r.sel; });
    var visSel = vis.filter(function (r) { return r.sel; }).length;
    if (this.allCb) {
      this.allCb.checked = vis.length > 0 && visSel === vis.length;
      this.allCb.indeterminate = visSel > 0 && visSel < vis.length;
    }
    vis.forEach(function (r) { if (r.tr.isConnected) { r.tr.setAttribute('aria-selected', r.sel ? 'true' : 'false'); if (r.cb) r.cb.checked = r.sel; } });
    if (this.infoEl) {
      if (o.select && sel.length) this.infoEl.textContent = sel.length + ' of ' + this.rows.length + ' row' + (this.rows.length === 1 ? '' : 's') + ' selected';
      else if (isFinite(this.pageSize) && this._count) {
        var a = (this.page - 1) * this.pageSize + 1, b = Math.min(this._count, this.page * this.pageSize);
        this.infoEl.textContent = 'Showing ' + a + '–' + b + ' of ' + this._count + (this.q ? ' results' : ' rows');
      } else this.infoEl.textContent = this._count + ' row' + (this._count === 1 ? '' : 's');
    }
    if (this.bulkBar) {
      this.bulkBar.hidden = !sel.length;
      this.shell.classList.toggle('has-selection', sel.length > 0);
      if (sel.length) this.bulkBar.querySelector('.dt-bulk-count').textContent = sel.length + ' selected';
    }
  };
  DataTable.prototype._emitSel = function () { var s = this.getSelected(); R.emit(this.table, 'select', { rows: s, count: s.length }); };

  /* ---------- Public methods ---------- */
  DataTable.prototype.sortBy = function (i, dir) {
    if (dir === undefined) dir = this.sortCol === i ? (this.sortDir === 1 ? -1 : this.sortDir === -1 ? 0 : 1) : 1;
    else dir = dir === 'asc' || dir === 1 ? 1 : dir === 'desc' || dir === -1 ? -1 : 0;
    this.sortCol = dir ? i : -1; this.sortDir = dir;
    this.render(true);
    var c = this.cols[i];
    R.emit(this.table, 'sort', { key: c && c.key, column: i, dir: dir > 0 ? 'asc' : dir < 0 ? 'desc' : 'none' });
  };
  DataTable.prototype.search = function (q) {
    this.q = String(q || '').trim(); this.page = 1; this.render(true);
    R.emit(this.table, 'search', { query: this.q, count: this._count });
  };
  DataTable.prototype.goTo = function (p) {
    var n = R.clamp(p, 1, this.pages()); if (n === this.page) return;
    this.page = n; this.render(true);
    R.emit(this.table, 'page', { page: n, pageSize: this.pageSize, pages: this.pages() });
  };
  DataTable.prototype.setPageSize = function (n) {
    var first = (this.page - 1) * this.pageSize;
    this.pageSize = n; this.page = Math.floor(first / n) + 1; this.render(true);
    R.emit(this.table, 'page', { page: this.page, pageSize: n, pages: this.pages() });
  };
  DataTable.prototype.selectAll = function (on) {
    var vis = this._visible || this.rows;
    (on ? vis : this.rows).forEach(function (r) { r.sel = !!on; });
    this._syncSel(); this._emitSel();
  };
  DataTable.prototype.getSelected = function () { return this.rows.filter(function (r) { return r.sel; }).map(function (r) { return r.data; }); };
  DataTable.prototype.setColumn = function (i, visible) {
    var c = typeof i === 'number' ? this.cols[i] : this.cols.filter(function (x) { return x.key === i; })[0];
    if (!c) return; c.hidden = !visible; this.render();
    R.emit(this.table, 'columns', { key: c.key, visible: !!visible, hidden: this.cols.filter(function (x) { return x.hidden; }).map(function (x) { return x.key; }) });
  };
  DataTable.prototype.removeRows = function (pred) {
    var self = this;
    this.rows = this.rows.filter(function (r) { return !pred(r.data, r); });
    this.render(true); this._emitSel();
    return self;
  };
  DataTable.prototype.openMenu = function () {
    var self = this, m = h('div', 'dt-menu');
    m.setAttribute('role', 'menu'); m.setAttribute('aria-label', 'Toggle columns');
    m.innerHTML = '<div class="dt-menu-label">Toggle columns</div>' + this.cols.map(function (c) {
      return c.hideable ? '<button type="button" role="menuitemcheckbox" class="dt-menu-item" data-i="' + c.i + '" aria-checked="' + !c.hidden + '"><span class="dt-menu-check">' + I.check + '</span>' + R.esc(c.label) + '</button>' : '';
    }).join('');
    document.body.appendChild(m); this.menu = m;
    this.colBtn.setAttribute('aria-expanded', 'true');
    var stopPos = R.autoPosition(m, this.colBtn, { placement: 'bottom-end', offset: 6 });
    var offOut = R.onOutside([m, this.colBtn], function () { self.closeMenu(); });
    var pop = R.pushLayer(function () { self.closeMenu(true); });
    var offRov = R.roving(m, '.dt-menu-item');
    var offClick = R.on(m, 'click', '.dt-menu-item', function (e, b) {
      var on = b.getAttribute('aria-checked') !== 'true';
      var visible = self.cols.filter(function (c) { return !c.hidden; }).length;
      if (!on && visible <= 1) return;
      b.setAttribute('aria-checked', String(on)); self.setColumn(+b.getAttribute('data-i'), on);
    });
    this._menuOff = function () { stopPos(); offOut(); pop(); offRov(); offClick(); };
    var f = m.querySelector('.dt-menu-item'); if (f) f.focus({ preventScroll: true });
  };
  DataTable.prototype.closeMenu = function (refocus) {
    if (!this.menu) return;
    this._menuOff(); this.menu.remove(); this.menu = null;
    this.colBtn.setAttribute('aria-expanded', 'false');
    if (refocus) this.colBtn.focus();
  };
  DataTable.prototype.destroy = function () {
    this.offs.forEach(function (f) { f(); }); this.offs = [];
    this.closeMenu(); clearTimeout(this._at);
  };

  R.define(NS, {
    selector: 'table[data-table]',
    mount: function (el) {
      var inst = new DataTable(el);
      return { destroy: function () { inst.destroy(); }, api: inst };
    }
  });

  /**
   * Ranj.dataTable(container, { columns: [{ key, label, type, sortable, align, render(value,row), hidden, hideable, width }], rows: [{…}],
   *   pageSize, pageSizes, search, select, columnsMenu, bulk: [{ label, action, danger, icon, onClick(rows, table) }], emptyTitle, emptyText, className })
   * Returns the instance (sortBy, search, goTo, setPageSize, selectAll, getSelected, setColumn, removeRows, setRows, destroy).
   * If container is a <table data-table> already mounted, returns its instance.
   */
  R.dataTable = function (el, cfg) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el) return null;
    if (el.tagName === 'TABLE') {
      var ex = R.instance(el, NS); if (ex && ex.api) return ex.api;
      var inst0 = new DataTable(el, cfg || {});
      el.__ranj = el.__ranj || {}; el.__ranj[NS] = { destroy: function () { inst0.destroy(); }, api: inst0 };
      return inst0;
    }
    cfg = cfg || {};
    var cols = cfg.columns || Object.keys((cfg.rows || [])[0] || {}).map(function (k) { return { key: k, label: k }; });
    var table = document.createElement('table');
    table.className = 'table ' + (cfg.className || 'table-hover');
    var thead = table.createTHead().insertRow();
    cols.forEach(function (c) {
      var th = document.createElement('th'); th.scope = 'col';
      th.innerHTML = R.esc(c.label != null ? c.label : c.key);
      if (c.type) th.setAttribute('data-type', c.type);
      if (c.align === 'right' || c.type === 'number' || c.type === 'currency') th.classList.add('num');
      if (c.width) th.style.width = c.width;
      thead.appendChild(th);
    });
    var tbody = table.createTBody();
    function rowEl(row) {
      var tr = document.createElement('tr');
      cols.forEach(function (c) {
        var td = tr.insertCell(), v = row[c.key];
        if (c.align === 'right' || c.type === 'number' || c.type === 'currency') td.className = 'num';
        if (c.className) td.className += ' ' + c.className;
        if (c.render) { var out = c.render(v, row); if (out && out.nodeType) td.appendChild(out); else td.innerHTML = out == null ? '' : out; td.setAttribute('data-value', v == null ? '' : (v instanceof Date ? v.toISOString() : v)); }
        else td.textContent = v == null ? '' : v;
      });
      return tr;
    }
    (cfg.rows || []).forEach(function (r) { tbody.appendChild(rowEl(r)); });
    var wrap = document.createElement('div'); wrap.className = 'table-wrapper';
    if (cfg.maxHeight) { wrap.style.maxHeight = cfg.maxHeight; table.classList.add('table-sticky'); }
    wrap.appendChild(table);
    el.innerHTML = ''; el.appendChild(wrap);
    cfg = Object.assign({}, cfg, { columns: cols.map(function (c) { return { key: c.key, label: c.label, type: c.type === 'currency' ? 'number' : c.type, sortable: c.sortable !== false, hidden: c.hidden, hideable: c.hideable } }) });
    var inst = new DataTable(table, cfg);
    table.__ranj = table.__ranj || {}; table.__ranj[NS] = { destroy: function () { inst.destroy(); }, api: inst };
    inst.setRows = function (rows) {
      var self = this;
      this.rows = rows.map(function (r) { var o = self._row(rowEl(r), r); o.keys = self.cols.map(function (c) { return keyOf(o.raw[c.i], c.type); }); return o; });
      this.page = 1; this.render(true);
    };
    return inst;
  };
})(window.Ranj);

;
/* --- components/base/gallery.js --- */
/* Ranj UI — Gallery lightbox. Any [data-gallery] container: clicking a .gallery-item (or a[data-lightbox]) opens a
 * fullscreen viewer with zoom-from-thumbnail, arrows, swipe, keyboard, captions, thumbnails, focus trap and Escape. */
(function (R) {
  'use strict';
  var I = {
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
  };
  function itemsOf(root) { return R.$$('.gallery-item, [data-lightbox]', root).filter(function (a) { return !a.closest('.lightbox'); }); }
  function srcOf(a) { var img = a.querySelector('img'); return a.getAttribute('data-src') || a.getAttribute('href') || (img && (img.currentSrc || img.src)) || ''; }
  function thumbOf(a) { var img = a.querySelector('img'); return (img && (img.currentSrc || img.src)) || srcOf(a); }
  function capOf(a) {
    var c = a.getAttribute('data-caption'); if (c != null) return R.esc(c);
    var el = a.querySelector('.gallery-caption'); if (el) return el.innerHTML;
    var img = a.querySelector('img'); return img && img.alt ? R.esc(img.alt) : '';
  }

  function open(root, start) {
    var items = itemsOf(root), n = items.length, i = R.clamp(start, 0, n - 1), o = R.opts(root, { thumbs: true, loop: true });
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', root.getAttribute('aria-label') || 'Image viewer');
    lb.innerHTML = '<div class="lightbox-bar"><span class="lightbox-count" aria-live="polite"></span><button type="button" class="lightbox-btn lightbox-close" aria-label="Close">' + I.x + '</button></div>' +
      '<div class="lightbox-stage"><img class="lightbox-img" alt="">' +
      (n > 1 ? '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous image">' + I.prev + '</button><button type="button" class="lightbox-btn lightbox-next" aria-label="Next image">' + I.next + '</button>' : '') + '</div>' +
      '<div><div class="lightbox-caption"></div>' + (o.thumbs && n > 1 ? '<div class="lightbox-thumbs">' + items.map(function (a, k) { return '<button type="button" data-i="' + k + '" aria-label="Image ' + (k + 1) + '"><img src="' + R.esc(thumbOf(a)) + '" alt=""></button>'; }).join('') + '</div>' : '') + '</div>';
    document.body.appendChild(lb);
    var img = lb.querySelector('.lightbox-img'), count = lb.querySelector('.lightbox-count'), cap = lb.querySelector('.lightbox-caption');
    var prevB = lb.querySelector('.lightbox-prev'), nextB = lb.querySelector('.lightbox-next'), thumbs = lb.querySelector('.lightbox-thumbs');
    R.scrollLock.lock();
    var offs = [], release = R.trapFocus(lb, lb.querySelector('.lightbox-close')), pop = R.pushLayer(close);

    function show(k, dir) {
      if (!o.loop) k = R.clamp(k, 0, n - 1);
      i = ((k % n) + n) % n;
      var a = items[i];
      img.classList.remove('is-entering-next', 'is-entering-prev');
      var full = srcOf(a), th = thumbOf(a), want = i;
      img.alt = (a.querySelector('img') || {}).alt || '';
      if (th && th !== full) {
        img.src = th;
        var pre = new Image();
        pre.onload = function () { if (i === want && img.isConnected) img.src = full; };
        pre.src = full;
      } else img.src = full;
      if (dir && !R.reducedMotion) { void img.offsetWidth; img.classList.add(dir > 0 ? 'is-entering-next' : 'is-entering-prev'); }
      img.style.transform = '';
      count.textContent = (i + 1) + ' / ' + n;
      cap.innerHTML = capOf(a);
      if (!o.loop) { if (prevB) prevB.disabled = i === 0; if (nextB) nextB.disabled = i === n - 1; }
      if (thumbs) R.$$('button', thumbs).forEach(function (b, k2) {
        if (k2 === i) { b.setAttribute('aria-current', 'true'); b.scrollIntoView({ block: 'nearest', inline: 'center' }); } else b.removeAttribute('aria-current');
      });
      // preload neighbours
      [i + 1, i - 1].forEach(function (j) { var s = items[((j % n) + n) % n]; if (s) { var p = new Image(); p.src = srcOf(s); } });
      R.emit(root, 'change', { index: i, item: a });
    }

    // Zoom from the thumbnail (FLIP)
    var from = items[i], fromImg = from.querySelector('img');
    show(i, 0);
    if (fromImg && !R.reducedMotion) {
      var fr = fromImg.getBoundingClientRect();
      var go = function () {
        var to = img.getBoundingClientRect(); if (!to.width) return;
        var s = Math.max(fr.width / to.width, fr.height / to.height);
        img.animate([
          { transform: 'translate(' + (fr.left + fr.width / 2 - (to.left + to.width / 2)) + 'px,' + (fr.top + fr.height / 2 - (to.top + to.height / 2)) + 'px) scale(' + s + ')', clipPath: 'inset(' + Math.max(0, (to.height * s - fr.height) / 2 / s) + 'px ' + Math.max(0, (to.width * s - fr.width) / 2 / s) + 'px round 12px)' },
          { transform: 'none', clipPath: 'inset(0 round 8px)' }
        ], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
      };
      if (img.complete && img.naturalWidth) go(); else img.addEventListener('load', go, { once: true });
    }

    function close() {
      if (lb.classList.contains('is-closing')) return;
      lb.classList.add('is-closing');
      pop(); offs.forEach(function (f) { f(); });
      var target = items[i];
      setTimeout(function () { lb.remove(); R.scrollLock.unlock(); release(); if (target && target.focus) try { target.focus({ preventScroll: true }); } catch (e) {} }, R.reducedMotion ? 0 : 190);
      R.emit(root, 'close', { index: i });
    }
    offs.push(R.on(lb, 'click', function (e) {
      var t = e.target;
      if (t.closest('.lightbox-close')) close();
      else if (t.closest('.lightbox-prev')) show(i - 1, -1);
      else if (t.closest('.lightbox-next')) show(i + 1, 1);
      else if (t.closest('.lightbox-thumbs button')) { var k = +t.closest('button').getAttribute('data-i'); show(k, k > i ? 1 : -1); }
      else if (t === lb || t.classList.contains('lightbox-stage') || t.classList.contains('lightbox-caption')) close();
    }));
    offs.push(R.on(lb, 'keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1, -1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1, 1); }
      else if (e.key === 'Home') { e.preventDefault(); show(0, -1); }
      else if (e.key === 'End') { e.preventDefault(); show(n - 1, 1); }
    }));
    // Swipe
    var sw = null;
    offs.push(R.on(img, 'pointerdown', function (e) { sw = { x: e.clientX, y: e.clientY, id: e.pointerId }; try { img.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); }));
    offs.push(R.on(img, 'pointermove', function (e) {
      if (!sw || e.pointerId !== sw.id) return;
      var dx = e.clientX - sw.x, dy = e.clientY - sw.y;
      img.style.transition = 'none';
      img.style.transform = Math.abs(dy) > Math.abs(dx) && dy > 0 ? 'translateY(' + dy + 'px) scale(' + Math.max(.85, 1 - dy / 1200) + ')' : 'translateX(' + dx + 'px)';
      lb.style.backgroundColor = Math.abs(dy) > Math.abs(dx) && dy > 0 ? 'rgb(6 6 8 / ' + Math.max(.4, .92 - dy / 600) + ')' : '';
    }));
    offs.push(R.on(img, 'pointerup', function (e) {
      if (!sw) return; var dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
      img.style.transition = ''; lb.style.backgroundColor = '';
      if (dy > 110 && Math.abs(dy) > Math.abs(dx)) close();
      else if (dx < -60) show(i + 1, 1);
      else if (dx > 60) show(i - 1, -1);
      else img.style.transform = '';
    }));
    offs.push(R.on(img, 'pointercancel', function () { sw = null; img.style.transition = ''; img.style.transform = ''; lb.style.backgroundColor = ''; }));
    R.emit(root, 'open', { index: i });
    return { close: close, show: function (k) { show(k, k > i ? 1 : -1); } };
  }

  R.define('gallery', {
    selector: '[data-gallery]',
    mount: function (root) {
      itemsOf(root).forEach(function (a) {
        if (a.tagName !== 'A' && a.tagName !== 'BUTTON' && !a.hasAttribute('tabindex')) { a.tabIndex = 0; a.setAttribute('role', 'button'); }
        if (!a.hasAttribute('aria-label')) { var im = a.querySelector('img'); a.setAttribute('aria-label', 'Open image' + (im && im.alt ? ': ' + im.alt : '')); }
      });
      var off1 = R.on(root, 'click', '.gallery-item, [data-lightbox]', function (e, a) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
        e.preventDefault();
        open(root, itemsOf(root).indexOf(a));
      });
      var off2 = R.on(root, 'keydown', '.gallery-item, [data-lightbox]', function (e, a) {
        if ((e.key === 'Enter' || e.key === ' ') && a.tagName !== 'A' && a.tagName !== 'BUTTON') { e.preventDefault(); open(root, itemsOf(root).indexOf(a)); }
      });
      root.ranjGallery = { open: function (k) { return open(root, k || 0); } };
      return function () { off1(); off2(); delete root.ranjGallery; };
    }
  });
  R.lightbox = function (root, index) { return open(root, index || 0); };
})(window.Ranj);

;
/* --- components/base/image-compare.js --- */
/* Ranj UI — Image compare: drag (or hover with data-hover) to reveal before/after; keyboard on the handle. */
(function (R) {
  'use strict';
  R.define('image-compare', {
    selector: '.image-compare',
    mount: function (el) {
      var o = R.opts(el, { start: 50, hover: false, step: 5, intro: false, labelBefore: 'Before', labelAfter: 'After' });
      var vertical = el.classList.contains('image-compare-vertical');
      var h = el.querySelector('.image-compare-handle');
      if (!h) { h = document.createElement('div'); h.className = 'image-compare-handle'; el.appendChild(h); h.__gen = true; }
      h.tabIndex = 0;
      h.setAttribute('role', 'slider');
      h.setAttribute('aria-label', el.getAttribute('aria-label') || 'Comparison position');
      h.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');
      h.setAttribute('aria-valuemin', '0'); h.setAttribute('aria-valuemax', '100');
      var pos = 50, offs = [], drag = false;
      function set(v, animate, user) {
        v = R.clamp(v, 0, 100);
        if (animate && !R.reducedMotion) { el.classList.add('is-animating'); clearTimeout(set.t); set.t = setTimeout(function () { el.classList.remove('is-animating'); }, 650); }
        pos = v;
        el.style.setProperty('--pos', v + '%');
        h.setAttribute('aria-valuenow', Math.round(v));
        h.setAttribute('aria-valuetext', Math.round(v) + '% ' + o.labelBefore.toLowerCase());
        el.setAttribute('data-edge', v < 8 ? 'start' : v > 92 ? 'end' : 'mid');
        if (user) R.emit(el, 'change', { value: v });
      }
      function fromEvent(e) {
        var r = el.getBoundingClientRect();
        return vertical ? (e.clientY - r.top) / r.height * 100 : (e.clientX - r.left) / r.width * 100;
      }
      offs.push(R.on(el, 'pointerdown', function (e) {
        if (e.button !== 0) return;
        drag = true; el.classList.add('is-dragging');
        try { el.setPointerCapture(e.pointerId); } catch (er) {}
        set(fromEvent(e), e.pointerType === 'mouse' && e.target !== h, true);
        if (e.pointerType === 'mouse') e.preventDefault();
        h.focus({ preventScroll: true });
      }));
      offs.push(R.on(el, 'pointermove', function (e) {
        if (drag) { el.classList.remove('is-animating'); set(fromEvent(e), false, true); }
        else if (o.hover && e.pointerType === 'mouse') set(fromEvent(e), false, true);
      }));
      var end = function () { drag = false; el.classList.remove('is-dragging'); };
      offs.push(R.on(el, 'pointerup', end), R.on(el, 'pointercancel', end), R.on(el, 'lostpointercapture', end));
      offs.push(R.on(h, 'keydown', function (e) {
        var s = e.shiftKey ? o.step * 4 : o.step, k = e.key;
        if (k === 'ArrowLeft' || k === 'ArrowUp') set(pos - s, true, true);
        else if (k === 'ArrowRight' || k === 'ArrowDown') set(pos + s, true, true);
        else if (k === 'Home') set(0, true, true);
        else if (k === 'End') set(100, true, true);
        else if (k === 'PageUp') set(pos - 25, true, true);
        else if (k === 'PageDown') set(pos + 25, true, true);
        else return;
        e.preventDefault();
      }));
      set(o.start);
      var stop = null;
      if (o.intro && !R.reducedMotion) {
        set(o.start + 22);
        stop = R.inView(el, function () { setTimeout(function () { set(o.start - 18, true); setTimeout(function () { set(o.start, true); }, 650); }, 200); });
      }
      el.ranjCompare = { set: function (v) { set(v, true); }, get value() { return pos; } };
      return function () { offs.forEach(function (f) { f(); }); if (stop) stop(); if (h.__gen) h.remove(); delete el.ranjCompare; };
    }
  });
})(window.Ranj);

;
/* --- components/base/kanban.js --- */
/* Ranj UI — Kanban: drag cards between columns with pointer events (mouse, touch, pen) or the keyboard.
 * Emits ranj:move { id, card, from, to, index, fromIndex } on the board (cancelable). */
(function (R) {
  'use strict';
  R.define('kanban', {
    selector: '.kanban[data-kanban], .kanban:not([data-kanban="false"])',
    mount: function (board) {
      var offs = [], drag = null, live = document.createElement('div');
      live.className = 'kanban-sr'; live.setAttribute('aria-live', 'assertive'); board.appendChild(live);
      function lists() { return R.$$('.kanban-list', board); }
      function cards(list) { return R.$$(':scope > .kanban-card', list); }
      function colOf(list) { var c = list.closest('.kanban-column'); return c ? (c.getAttribute('data-column') || (c.querySelector('.kanban-title, h3') || {}).textContent || '') : ''; }
      function nameOf(card) { var t = card.querySelector('.kanban-card-title'); return (t ? t.textContent : card.textContent).trim().slice(0, 60); }
      function counts() {
        lists().forEach(function (l) {
          var col = l.closest('.kanban-column'), c = col && col.querySelector('.kanban-count'), n = cards(l).length;
          if (c) { if (c.textContent !== String(n)) c.textContent = n; var lim = +(col.getAttribute('data-limit') || 0); c.classList.toggle('is-over-limit', lim > 0 && n > lim); }
          l.classList.toggle('is-empty', !n && !l.querySelector('.kanban-placeholder'));
        });
      }
      function prep() {
        R.$$('.kanban-card', board).forEach(function (c) {
          if (!c.hasAttribute('tabindex')) c.tabIndex = 0;
          c.setAttribute('aria-roledescription', 'Draggable card');
          if (!c.hasAttribute('aria-grabbed')) c.setAttribute('aria-grabbed', 'false');
        });
        lists().forEach(function (l) { l.setAttribute('role', 'list'); });
        counts();
      }
      prep();

      /* FLIP helper for smooth reflow of siblings */
      function snapshot(els) { var m = new Map(); els.forEach(function (e) { m.set(e, e.getBoundingClientRect()); }); return m; }
      function flip(before) {
        if (R.reducedMotion) return;
        before.forEach(function (r, e) {
          if (!e.isConnected || e.classList.contains('is-source')) return;
          var n = e.getBoundingClientRect(), dx = r.left - n.left, dy = r.top - n.top;
          if (!dx && !dy) return;
          e.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,0,0,1)' });
        });
      }
      function allCards() { return R.$$('.kanban-card, .kanban-placeholder', board); }

      function commit(card, fromList, fromIndex) {
        var toList = card.parentElement, index = cards(toList).indexOf(card);
        if (toList === fromList && index === fromIndex) return true;
        var ok = R.emit(board, 'move', { id: card.getAttribute('data-id') || null, card: card, from: colOf(fromList), to: colOf(toList), index: index, fromIndex: fromIndex });
        if (!ok) { var ref = cards(fromList)[fromIndex]; fromList.insertBefore(card, ref && ref !== card ? ref : null); }
        counts();
        return ok;
      }

      /* ---------- Pointer drag ---------- */
      offs.push(R.on(board, 'pointerdown', '.kanban-card', function (e, card) {
        if (e.button !== 0 || e.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
        drag = { card: card, x0: e.clientX, y0: e.clientY, id: e.pointerId, started: false, type: e.pointerType };
        if (e.pointerType === 'touch') {
          // long-press on touch so the board can still scroll
          drag.timer = setTimeout(function () { if (drag && !drag.started) start(e.clientX, e.clientY); }, 220);
        }
      }));
      function start(x, y) {
        var card = drag.card, r = card.getBoundingClientRect();
        drag.started = true;
        drag.fromList = card.parentElement; drag.fromIndex = cards(drag.fromList).indexOf(card);
        drag.dx = x - r.left; drag.dy = y - r.top;
        var ph = document.createElement('div'); ph.className = 'kanban-placeholder'; ph.style.height = r.height + 'px';
        var ghost = card.cloneNode(true); ghost.classList.add('kanban-ghost'); ghost.removeAttribute('tabindex');
        ghost.style.width = r.width + 'px'; ghost.style.height = r.height + 'px';
        document.body.appendChild(ghost);
        drag.ph = ph; drag.ghost = ghost; drag.rot = 0;
        card.parentElement.insertBefore(ph, card);
        card.classList.add('is-source'); card.style.display = 'none';
        document.documentElement.classList.add('kanban-dragging');
        move(x, y);
        if (navigator.vibrate && drag.type === 'touch') try { navigator.vibrate(8); } catch (er) {}
      }
      function move(x, y) {
        var d = drag, vx = x - (d.lx == null ? x : d.lx); d.lx = x;
        d.rot = R.lerp(d.rot, R.clamp(vx * .6, -6, 6), .25);
        d.ghost.style.transform = 'translate3d(' + (x - d.dx) + 'px,' + (y - d.dy) + 'px,0) rotate(' + (R.reducedMotion ? 0 : d.rot.toFixed(2)) + 'deg) scale(1.03)';
        // find list under pointer
        var el = document.elementFromPoint(x, y), list = el && el.closest && el.closest('.kanban-list');
        if (!list || !board.contains(list)) { var col = el && el.closest && el.closest('.kanban-column'); list = col && board.contains(col) ? col.querySelector('.kanban-list') : null; }
        R.$$('.kanban-column.is-over', board).forEach(function (c) { if (!list || c !== list.closest('.kanban-column')) c.classList.remove('is-over'); });
        if (list) {
          var colEl = list.closest('.kanban-column'); if (colEl) colEl.classList.add('is-over');
          var sibs = cards(list).filter(function (c) { return c !== d.card; }), ref = null;
          for (var i = 0; i < sibs.length; i++) { var rr = sibs[i].getBoundingClientRect(); if (y < rr.top + rr.height / 2) { ref = sibs[i]; break; } }
          if (d.ph.parentElement !== list || d.ph.nextElementSibling !== ref) {
            var before = snapshot(allCards());
            list.insertBefore(d.ph, ref);
            flip(before);
            counts();
          }
          // auto-scroll inside list
          var lr = list.getBoundingClientRect();
          if (y < lr.top + 30) list.scrollTop -= 8; else if (y > lr.bottom - 30) list.scrollTop += 8;
        }
        // auto-scroll board horizontally
        var br = board.getBoundingClientRect();
        if (x < br.left + 40) board.scrollLeft -= 12; else if (x > br.right - 40) board.scrollLeft += 12;
      }
      offs.push(R.on(window, 'pointermove', function (e) {
        if (!drag || e.pointerId !== drag.id) return;
        if (!drag.started) {
          var dist = Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0);
          if (drag.type === 'touch') { if (dist > 10) { clearTimeout(drag.timer); drag = null; } return; }
          if (dist < 5) return;
          start(e.clientX, e.clientY);
        }
        e.preventDefault();
        move(e.clientX, e.clientY);
      }, { passive: false }));
      offs.push(R.on(window, 'touchmove', function (e) { if (drag && drag.started) e.preventDefault(); }, { passive: false }));
      function end(cancel) {
        var d = drag; drag = null;
        if (!d) return;
        clearTimeout(d.timer);
        if (!d.started) return;
        document.documentElement.classList.remove('kanban-dragging');
        R.$$('.kanban-column.is-over', board).forEach(function (c) { c.classList.remove('is-over'); });
        var card = d.card;
        if (cancel) { d.ph.remove(); } else { d.ph.parentElement.insertBefore(card, d.ph); d.ph.remove(); }
        card.style.display = '';
        var to = card.getBoundingClientRect(), g = d.ghost, gr = g.getBoundingClientRect();
        card.classList.remove('is-source');
        if (!R.reducedMotion) {
          card.animate([{ transform: 'translate(' + (gr.left - to.left) + 'px,' + (gr.top - to.top) + 'px) rotate(' + d.rot.toFixed(2) + 'deg) scale(1.03)', boxShadow: 'var(--shadow-xl)' }, { transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.9,.3,1.15)' });
        }
        g.remove();
        if (!cancel) {
          var ok = commit(card, d.fromList, d.fromIndex);
          if (ok) live.textContent = nameOf(card) + ' moved to ' + colOf(card.parentElement) + ', position ' + (cards(card.parentElement).indexOf(card) + 1);
        }
        counts();
      }
      offs.push(R.on(window, 'pointerup', function (e) { if (drag && e.pointerId === drag.id) end(false); }));
      offs.push(R.on(window, 'pointercancel', function (e) { if (drag && e.pointerId === drag.id) end(true); }));
      var popEsc = null;
      offs.push(R.on(document, 'keydown', function (e) { if (e.key === 'Escape' && drag && drag.started) { e.preventDefault(); end(true); } }));

      /* ---------- Keyboard: Space/Enter lift, arrows move, Space/Enter drop, Escape cancel ---------- */
      var held = null;
      function dropHeld(cancel) {
        if (!held) return;
        var h = held; held = null;
        h.card.setAttribute('aria-grabbed', 'false'); h.card.classList.remove('is-lifted');
        if (popEsc) { popEsc(); popEsc = null; }
        if (cancel) {
          var ref = cards(h.fromList).filter(function (c) { return c !== h.card; })[h.fromIndex];
          var before = snapshot(allCards()); h.fromList.insertBefore(h.card, ref || null); flip(before);
          live.textContent = 'Move cancelled.';
        } else if (commit(h.card, h.fromList, h.fromIndex)) live.textContent = nameOf(h.card) + ' dropped in ' + colOf(h.card.parentElement) + ', position ' + (cards(h.card.parentElement).indexOf(h.card) + 1);
        h.card.focus(); counts();
      }
      offs.push(R.on(board, 'keydown', '.kanban-card', function (e, card) {
        if (e.target !== card) return;
        var k = e.key;
        if (!held) {
          if (k === ' ' || k === 'Enter') {
            e.preventDefault();
            held = { card: card, fromList: card.parentElement, fromIndex: cards(card.parentElement).indexOf(card) };
            card.setAttribute('aria-grabbed', 'true'); card.classList.add('is-lifted');
            popEsc = R.pushLayer(function () { dropHeld(true); });
            live.textContent = nameOf(card) + ' lifted. Use arrow keys to move, Space to drop, Escape to cancel.';
          } else if (/^Arrow/.test(k)) {
            // focus navigation between cards
            var ls = lists(), li = ls.indexOf(card.parentElement), cs = cards(card.parentElement), ci = cs.indexOf(card), t = null;
            if (k === 'ArrowDown') t = cs[ci + 1]; else if (k === 'ArrowUp') t = cs[ci - 1];
            else { var nl = ls[li + (k === 'ArrowRight' ? 1 : -1)]; if (nl) { var nc = cards(nl); t = nc[Math.min(ci, nc.length - 1)]; } }
            if (t) { e.preventDefault(); t.focus(); }
          }
          return;
        }
        var list = card.parentElement, ls2 = lists(), li2 = ls2.indexOf(list), cs2 = cards(list), ci2 = cs2.indexOf(card);
        var before = snapshot(allCards());
        if (k === 'ArrowUp' && ci2 > 0) list.insertBefore(card, cs2[ci2 - 1]);
        else if (k === 'ArrowDown' && ci2 < cs2.length - 1) list.insertBefore(card, cs2[ci2 + 1].nextSibling);
        else if ((k === 'ArrowLeft' || k === 'ArrowRight') && ls2[li2 + (k === 'ArrowRight' ? 1 : -1)]) {
          var tl = ls2[li2 + (k === 'ArrowRight' ? 1 : -1)], tc = cards(tl);
          tl.insertBefore(card, tc[Math.min(ci2, tc.length)] || null);
          tl.closest('.kanban-column') && tl.closest('.kanban-column').scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: R.reducedMotion ? 'auto' : 'smooth' });
        } else if (k === ' ' || k === 'Enter') { e.preventDefault(); dropHeld(false); return; }
        else if (k === 'Tab') { dropHeld(true); return; }
        else return;
        e.preventDefault();
        flip(before); counts(); card.focus();
        live.textContent = colOf(card.parentElement) + ', position ' + (cards(card.parentElement).indexOf(card) + 1);
      }));

      // New cards added later get prepared
      var mo = new MutationObserver(function () { if (!drag) prep(); });
      mo.observe(board, { childList: true, subtree: true });

      board.ranjKanban = { refresh: prep };
      return function () { offs.forEach(function (f) { f(); }); mo.disconnect(); if (drag && drag.ghost) drag.ghost.remove(); live.remove(); if (popEsc) popEsc(); delete board.ranjKanban; };
    }
  });
})(window.Ranj);

;
/* --- components/base/pagination.js --- */
/* Ranj UI — Pagination renderer.
 * <nav class="pagination" data-pagination data-total="20" data-page="1" data-siblings="1"></nav>
 * or Ranj.pagination(el, { total, page, siblings, boundaries, onChange }) */
(function (R) {
  'use strict';
  var PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  var NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';

  /** Page range with ellipses: returns e.g. [1, '…', 4, 5, 6, '…', 20] */
  function range(page, total, siblings, boundaries) {
    siblings = siblings == null ? 1 : siblings; boundaries = boundaries == null ? 1 : boundaries;
    var out = [], i;
    if (total <= siblings * 2 + 3 + boundaries * 2) { for (i = 1; i <= total; i++) out.push(i); return out; }
    var sStart = Math.max(Math.min(page - siblings, total - boundaries - siblings * 2 - 1), boundaries + 2);
    var sEnd = Math.min(Math.max(page + siblings, boundaries + siblings * 2 + 2), total - boundaries - 1);
    for (i = 1; i <= boundaries; i++) out.push(i);
    out.push(sStart > boundaries + 2 ? '\u2026' : boundaries + 1);
    for (i = sStart; i <= sEnd; i++) out.push(i);
    out.push(sEnd < total - boundaries - 1 ? '\u2026' : total - boundaries);
    for (i = total - boundaries + 1; i <= total; i++) out.push(i);
    return out;
  }

  function Pager(el, cfg) {
    var o = R.opts(el, { total: 1, page: 1, siblings: 1, boundaries: 1, labels: true, prevLabel: 'Previous', nextLabel: 'Next', mode: 'numbers' });
    for (var k in cfg) if (cfg[k] !== undefined) o[k] = cfg[k];
    this.el = el; this.o = o; this.page = o.page;
    if (el.tagName === 'NAV' || !el.hasAttribute('role')) el.setAttribute('aria-label', el.getAttribute('aria-label') || 'Pagination');
    var self = this;
    this.off = R.on(el, 'click', 'button[data-page]', function (e, b) { self.set(+b.getAttribute('data-page'), true); });
    this.offIn = R.on(el, 'change', 'input', function (e, inp) { self.set(parseInt(inp.value, 10) || 1, true); });
    this.offKey = R.on(el, 'keydown', function (e) {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); self.set(self.page - 1, true, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); self.set(self.page + 1, true, true); }
    });
    this.render();
  }
  Pager.prototype.render = function (focus) {
    var o = this.o, p = this.page, t = Math.max(1, o.total), h = '';
    var prevLbl = o.labels ? '<span class="pagination-label">' + R.esc(o.prevLabel) + '</span>' : '';
    var nextLbl = o.labels ? '<span class="pagination-label">' + R.esc(o.nextLabel) + '</span>' : '';
    var btn = function (n, inner, cls, aria) {
      return '<button type="button" class="' + (cls || '') + '" data-page="' + n + '"' + (aria ? ' aria-label="' + aria + '"' : '') + '>' + inner + '</button>';
    };
    h += btn(p - 1, PREV + prevLbl, 'pagination-prev', 'Previous page').replace('<button', p <= 1 ? '<button disabled' : '<button');
    if (o.mode === 'compact') {
      h += '<span class="pagination-current"><input type="number" min="1" max="' + t + '" value="' + p + '" aria-label="Page"> / ' + t + '</span>';
    } else if (o.mode === 'simple') {
      h += '<span class="pagination-info">Page <b>' + p + '</b> of <b>' + t + '</b></span>';
    } else if (o.mode === 'dots') {
      for (var d = 1; d <= t; d++) h += btn(d, d, '', 'Page ' + d).replace('<button', d === p ? '<button aria-current="page"' : '<button');
    } else {
      range(p, t, o.siblings, o.boundaries).forEach(function (n) {
        if (n === '…') h += '<span class="pagination-ellipsis" aria-hidden="true">…</span>';
        else h += btn(n, n, '', 'Page ' + n).replace('<button', n === p ? '<button aria-current="page"' : '<button');
      });
    }
    h += btn(p + 1, nextLbl + NEXT, 'pagination-next', 'Next page').replace('<button', p >= t ? '<button disabled' : '<button');
    if (o.mode === 'dots') h = h.replace(/<button[^>]*pagination-(prev|next)[^]*?<\/button>/g, '');
    this.el.innerHTML = h;
    if (focus) { var c = this.el.querySelector('[aria-current="page"]') || this.el.querySelector('input'); if (c) c.focus(); }
  };
  Pager.prototype.set = function (n, user, focus) {
    var t = Math.max(1, this.o.total); n = R.clamp(n | 0, 1, t);
    if (n === this.page) { if (this.o.mode === 'compact') this.render(); return; }
    var prev = this.page; this.page = n; this.el.setAttribute('data-page', n);
    this.render(focus);
    R.emit(this.el, 'change', { page: n, previous: prev, total: t, user: !!user });
    if (this.o.onChange) this.o.onChange(n, prev);
  };
  Pager.prototype.setTotal = function (t) { this.o.total = t; this.page = R.clamp(this.page, 1, Math.max(1, t)); this.render(); };
  Pager.prototype.destroy = function () { this.off(); this.offIn(); this.offKey(); };

  R.define('pagination', {
    selector: '.pagination[data-pagination], nav[data-pagination]',
    mount: function (el) { var p = new Pager(el, {}); return { destroy: function () { p.destroy(); }, api: p }; }
  });

  /** Ranj.pagination(el, { total, page, siblings, boundaries, mode: 'numbers'|'simple'|'compact'|'dots', labels, onChange(page, prev) }) → { set, setTotal, page, destroy } */
  R.pagination = function (el, cfg) {
    if (typeof el === 'string') el = document.querySelector(el);
    var ex = R.instance(el, 'pagination'); if (ex && ex.api) { if (cfg) { for (var k in cfg) ex.api.o[k] = cfg[k]; ex.api.render(); } return ex.api; }
    var p = new Pager(el, cfg || {});
    el.__ranj = el.__ranj || {}; el.__ranj.pagination = { destroy: function () { p.destroy(); }, api: p };
    return p;
  };
  R.pagination.range = range;
})(window.Ranj);

;
/* --- components/base/resizable.js --- */
/* Ranj UI — Resizable panel groups. Panels: data-size (percent), data-min, data-max, data-collapsible, data-collapsed-size.
 * Handles: pointer drag, arrows (Shift = 10%), Home/End, Enter toggles collapse. data-autosave="key" persists sizes. */
(function (R) {
  'use strict';
  R.define('resizable', {
    selector: '.resizable',
    mount: function (group) {
      var vertical = group.classList.contains('resizable-vertical');
      var o = R.opts(group, { autosave: '', step: 5, labels: false });
      var panels = [].slice.call(group.children).filter(function (c) { return c.classList.contains('resizable-panel'); });
      var handles = [].slice.call(group.children).filter(function (c) { return c.classList.contains('resizable-handle'); });
      if (panels.length < 2) return;
      var meta = panels.map(function (p) {
        return { el: p, min: R.attr(p, 'data-min', 0), max: R.attr(p, 'data-max', 100), collapsible: p.hasAttribute('data-collapsible'), collapsedSize: R.attr(p, 'data-collapsed-size', 0), size: R.attr(p, 'data-size', NaN), prev: 0 };
      });
      // default sizes: split remaining evenly
      var known = meta.filter(function (m) { return !isNaN(m.size); }), rest = 100 - known.reduce(function (s, m) { return s + m.size; }, 0), unknown = meta.length - known.length;
      meta.forEach(function (m) { if (isNaN(m.size)) m.size = unknown ? rest / unknown : 100 / meta.length; });
      if (o.autosave) try { var saved = JSON.parse(localStorage.getItem('ranj-resizable:' + o.autosave) || 'null'); if (saved && saved.length === meta.length) saved.forEach(function (s, i) { meta[i].size = s; }); } catch (e) {}
      var offs = [];
      function apply(emit) {
        meta.forEach(function (m) {
          m.el.style.setProperty('--size', m.size.toFixed(3));
          m.el.style.flexGrow = m.size.toFixed(3);
          if (o.labels) m.el.setAttribute('data-label', Math.round(m.size) + '%');
          if (m.collapsible && m.size <= m.collapsedSize + .01) m.el.setAttribute('data-collapsed', ''); else m.el.removeAttribute('data-collapsed');
        });
        handles.forEach(function (h, i) {
          var a = meta[i]; if (!a) return;
          h.setAttribute('aria-valuenow', Math.round(a.size)); h.setAttribute('aria-valuemin', Math.round(a.collapsible ? a.collapsedSize : a.min)); h.setAttribute('aria-valuemax', Math.round(a.max));
        });
        if (emit) {
          var sizes = meta.map(function (m) { return +m.size.toFixed(2); });
          R.emit(group, 'resize', { sizes: sizes });
          if (o.autosave) try { localStorage.setItem('ranj-resizable:' + o.autosave, JSON.stringify(sizes)); } catch (e) {}
        }
      }
      // move boundary i (between panel i and i+1) by delta percent
      function shift(i, delta) {
        var a = meta[i], b = meta[i + 1]; if (!a || !b) return;
        var total = a.size + b.size;
        var na = a.size + delta;
        var aMin = a.min, bMin = b.min;
        // collapse snapping
        if (a.collapsible && na < a.min) na = na < a.min / 2 ? a.collapsedSize : a.min;
        else na = Math.max(aMin, na);
        na = Math.min(na, a.max, total - (b.collapsible && total - na < b.min / 2 ? b.collapsedSize : bMin));
        var nb = total - na;
        if (b.collapsible && nb < b.min && nb > b.collapsedSize) { nb = nb < b.min / 2 ? b.collapsedSize : b.min; na = total - nb; }
        if (nb > b.max) { nb = b.max; na = total - nb; }
        a.size = na; b.size = nb;
      }
      handles.forEach(function (h, i) {
        h.setAttribute('role', 'separator');
        h.setAttribute('aria-orientation', vertical ? 'horizontal' : 'vertical');
        if (!h.hasAttribute('tabindex')) h.tabIndex = 0;
        var p = meta[i].el; R.ensureId(p, 'panel'); h.setAttribute('aria-controls', p.id);
        if (!h.hasAttribute('aria-label')) h.setAttribute('aria-label', 'Resize panel');
        if (h.hasAttribute('data-grip') && !h.querySelector('.resizable-grip')) { var g = document.createElement('span'); g.className = 'resizable-grip'; h.appendChild(g); }
        offs.push(R.on(h, 'pointerdown', function (e) {
          if (e.button !== 0) return; e.preventDefault();
          var rect = group.getBoundingClientRect(), totalPx = vertical ? rect.height : rect.width;
          var start = vertical ? e.clientY : e.clientX, base = meta.map(function (m) { return m.size; });
          h.classList.add('is-dragging'); group.classList.add('is-resizing');
          document.documentElement.classList.add(vertical ? 'resizable-row' : 'resizable-col');
          try { h.setPointerCapture(e.pointerId); } catch (er) {}
          var mv = function (ev) {
            meta.forEach(function (m, k) { m.size = base[k]; });
            shift(i, ((vertical ? ev.clientY : ev.clientX) - start) / totalPx * 100);
            apply(false);
          };
          var up = function () {
            h.classList.remove('is-dragging'); group.classList.remove('is-resizing');
            document.documentElement.classList.remove('resizable-row', 'resizable-col');
            h.removeEventListener('pointermove', mv); h.removeEventListener('pointerup', up); h.removeEventListener('pointercancel', up);
            apply(true);
          };
          h.addEventListener('pointermove', mv); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
        }));
        offs.push(R.on(h, 'dblclick', function () { var a = meta[i], b = meta[i + 1], t = a.size + b.size; a.size = t / 2; b.size = t / 2; apply(true); }));
        offs.push(R.on(h, 'keydown', function (e) {
          var s = e.shiftKey ? o.step * 2 : o.step, k = e.key, a = meta[i];
          var dec = vertical ? 'ArrowUp' : 'ArrowLeft', inc = vertical ? 'ArrowDown' : 'ArrowRight';
          if (k === dec) shift(i, -s); else if (k === inc) shift(i, s);
          else if (k === 'Home') shift(i, -100); else if (k === 'End') shift(i, 100);
          else if (k === 'Enter' && (a.collapsible || meta[i + 1].collapsible)) {
            var target = a.collapsible ? a : meta[i + 1], other = a.collapsible ? meta[i + 1] : a, t = target.size + other.size;
            if (target.size <= target.collapsedSize + .01) { target.size = target.prev || Math.max(target.min, 25); }
            else { target.prev = target.size; target.size = target.collapsedSize; }
            other.size = t - target.size;
          } else return;
          e.preventDefault(); apply(true);
        }));
      });
      apply(false);
      group.ranjResizable = {
        get sizes() { return meta.map(function (m) { return m.size; }); },
        setSizes: function (arr) { arr.forEach(function (s, k) { if (meta[k]) meta[k].size = s; }); apply(true); }
      };
      return function () { offs.forEach(function (f) { f(); }); delete group.ranjResizable; };
    }
  });
})(window.Ranj);

;
/* --- components/base/scroll-area.js --- */
/* Ranj UI — Scroll area: overlay scrollbars that fade in on hover/scroll, draggable thumbs, edge fades. */
(function (R) {
  'use strict';
  R.define('scroll-area', {
    selector: '.scroll-area:not([data-native])',
    mount: function (el) {
      var vp = el.querySelector(':scope > .scroll-area-viewport');
      var created = !vp;
      if (!vp) {
        vp = document.createElement('div'); vp.className = 'scroll-area-viewport';
        while (el.firstChild) vp.appendChild(el.firstChild);
        el.appendChild(vp);
      }
      el.classList.add('is-enhanced');
      if (!vp.hasAttribute('tabindex') && !R.focusables(vp).length) vp.tabIndex = 0;
      var allowX = !el.classList.contains('scroll-area-y'), allowY = !el.classList.contains('scroll-area-x');
      function bar(axis) {
        var b = document.createElement('div'); b.className = 'scroll-area-bar'; b.setAttribute('data-axis', axis); b.setAttribute('aria-hidden', 'true');
        b.innerHTML = '<div class="scroll-area-thumb"></div>'; el.appendChild(b); return b;
      }
      var by = allowY ? bar('y') : null, bx = allowX ? bar('x') : null;
      var ty = by && by.firstChild, tx = bx && bx.firstChild;
      var timer = 0, raf = 0, offs = [];
      function update() {
        raf = 0;
        var sh = vp.scrollHeight, ch = vp.clientHeight, sw = vp.scrollWidth, cw = vp.clientWidth;
        var hasY = allowY && sh > ch + 1, hasX = allowX && sw > cw + 1;
        if (by) {
          by.hidden = !hasY; by.classList.toggle('has-x', hasX);
          if (hasY) { var trk = by.clientHeight - 4, h = Math.max(24, trk * ch / sh), y = (trk - h) * (vp.scrollTop / (sh - ch)); ty.style.height = h + 'px'; ty.style.transform = 'translateY(' + y + 'px)'; }
        }
        if (bx) {
          bx.hidden = !hasX;
          if (hasX) { var trk2 = bx.clientWidth - 4, w = Math.max(24, trk2 * cw / sw), x = (trk2 - w) * (vp.scrollLeft / (sw - cw)); tx.style.width = w + 'px'; tx.style.transform = 'translateX(' + x + 'px)'; }
        }
        var t = vp.scrollTop > 1, bo = vp.scrollTop < sh - ch - 1, l = vp.scrollLeft > 1, r = vp.scrollLeft < sw - cw - 1;
        flag('top', hasY && t); flag('bottom', hasY && bo); flag('left', hasX && l); flag('right', hasX && r);
      }
      function flag(n, on) { if (on) el.setAttribute('data-more-' + n, ''); else el.removeAttribute('data-more-' + n); }
      function schedule() { if (!raf) raf = requestAnimationFrame(update); }
      offs.push(R.on(vp, 'scroll', function () {
        schedule();
        el.classList.add('is-scrolling'); clearTimeout(timer);
        timer = setTimeout(function () { el.classList.remove('is-scrolling'); }, 900);
        R.emit(el, 'scroll', { top: vp.scrollTop, left: vp.scrollLeft });
      }, { passive: true }));
      // Drag thumbs / click track
      [[by, ty, 'y'], [bx, tx, 'x']].forEach(function (p) {
        var b = p[0], th = p[1], ax = p[2]; if (!b) return;
        offs.push(R.on(b, 'pointerdown', function (e) {
          if (e.button !== 0) return; e.preventDefault();
          var r = th.getBoundingClientRect(), br = b.getBoundingClientRect();
          var onThumb = e.target === th;
          var start = ax === 'y' ? e.clientY : e.clientX, s0 = ax === 'y' ? vp.scrollTop : vp.scrollLeft;
          var trk = (ax === 'y' ? br.height - r.height : br.width - r.width) - 4;
          var max = ax === 'y' ? vp.scrollHeight - vp.clientHeight : vp.scrollWidth - vp.clientWidth;
          if (!onThumb) {
            var page = ax === 'y' ? vp.clientHeight : vp.clientWidth, before = ax === 'y' ? e.clientY < r.top : e.clientX < r.left;
            vp.scrollBy({ top: ax === 'y' ? (before ? -page : page) * .9 : 0, left: ax === 'x' ? (before ? -page : page) * .9 : 0, behavior: R.reducedMotion ? 'auto' : 'smooth' });
            return;
          }
          b.classList.add('is-dragging');
          try { b.setPointerCapture(e.pointerId); } catch (er) {}
          var mv = function (ev) { var d = ((ax === 'y' ? ev.clientY : ev.clientX) - start) / Math.max(1, trk) * max; if (ax === 'y') vp.scrollTop = s0 + d; else vp.scrollLeft = s0 + d; };
          var up = function () { b.classList.remove('is-dragging'); b.removeEventListener('pointermove', mv); b.removeEventListener('pointerup', up); b.removeEventListener('pointercancel', up); };
          b.addEventListener('pointermove', mv); b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
        }));
      });
      // Horizontal-only areas: map vertical wheel to horizontal scroll
      if (!allowY) offs.push(R.on(vp, 'wheel', function (e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && vp.scrollWidth > vp.clientWidth) {
          var atEnd = (e.deltaY > 0 && vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 1) || (e.deltaY < 0 && vp.scrollLeft <= 0);
          if (!atEnd) { e.preventDefault(); vp.scrollLeft += e.deltaY; }
        }
      }, { passive: false }));
      var ro = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null;
      if (ro) { ro.observe(vp); [].forEach.call(vp.children, function (c) { ro.observe(c); }); }
      var mo = new MutationObserver(schedule); mo.observe(vp, { childList: true, subtree: true });
      update();
      el.ranjScrollArea = { viewport: vp, update: update };
      return function () {
        offs.forEach(function (f) { f(); }); clearTimeout(timer); if (raf) cancelAnimationFrame(raf);
        if (ro) ro.disconnect(); mo.disconnect();
        if (by) by.remove(); if (bx) bx.remove();
        el.classList.remove('is-enhanced');
        if (created && vp.parentNode === el) { while (vp.firstChild) el.insertBefore(vp.firstChild, vp); vp.remove(); }
        delete el.ranjScrollArea;
      };
    }
  });
})(window.Ranj);

;
/* --- components/base/timeline.js --- */
/* Ranj UI — Timeline reveal: items of .timeline-reveal fade up as they scroll into view. */
(function (R) {
  'use strict';
  R.define('timeline-reveal', {
    selector: '.timeline-reveal',
    mount: function (el) {
      var items = R.$$(':scope > .timeline-item', el), stops = [];
      if (R.reducedMotion) return;
      el.classList.add('is-ready');
      items.forEach(function (it, i) {
        stops.push(R.inView(it, function () {
          it.style.setProperty('--i', i % 4);
          it.classList.add('is-in');
        }, { threshold: 0.2 }));
      });
      return function () { stops.forEach(function (s) { s(); }); el.classList.remove('is-ready'); };
    }
  });
})(window.Ranj);

;
/* --- components/base/tree-view.js --- */
/* Ranj UI — Tree view.
 * <ul class="tree" data-tree> <li data-open>src <ul> <li>index.ts</li> </ul></li> </ul>
 * Turns nested lists into an accessible ARIA tree with expand/collapse, keyboard, file icons, selection and optional tri-state checkboxes. */
(function (R) {
  'use strict';
  var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
  var CHECK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>';
  var ICONS = {
    folder: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h3.6a2 2 0 0 1 1.5.7L12 6.3h6.5A2.5 2.5 0 0 1 21 8.8v8.7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/></svg>',
    'folder-open': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h3.6a2 2 0 0 1 1.5.7L12 6.3h6a2.5 2.5 0 0 1 2.5 2.5V10H8.2a2 2 0 0 0-1.9 1.4L3.4 19.6A2.5 2.5 0 0 1 3 18.2z" opacity=".55"/><path d="M6.7 11.6A1.5 1.5 0 0 1 8.1 10.5h13a1.2 1.2 0 0 1 1.1 1.6l-2 6.3A2.5 2.5 0 0 1 17.8 20H4.6a1 1 0 0 1-1-1.3z"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M10 12.5 8.5 14l1.5 1.5M14 12.5l1.5 1.5-1.5 1.5"/></svg>',
    img: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-9 9"/></svg>',
    md: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M6 15V9l2.5 3L11 9v6M15.5 9v6m0 0 2.5-2.5M15.5 15 13 12.5"/></svg>',
    json: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
  };
  var EXT = { ts: 'ts', tsx: 'ts', js: 'js', jsx: 'js', mjs: 'js', cjs: 'js', css: 'css', scss: 'css', html: 'html', json: 'json', md: 'md', mdx: 'md', png: 'img', jpg: 'img', jpeg: 'img', svg: 'img', webp: 'img', gif: 'img', lock: 'lock', env: 'env' };
  function kindOf(name) {
    var n = name.toLowerCase();
    if (/^\.env/.test(n)) return 'env';
    var m = /\.([a-z0-9]+)$/.exec(n); return m ? (EXT[m[1]] || 'file') : 'file';
  }
  function iconFor(kind, open) {
    if (kind === 'folder') return ICONS[open ? 'folder-open' : 'folder'];
    if (kind === 'ts' || kind === 'js' || kind === 'css' || kind === 'html') return ICONS.code;
    if (kind === 'none') return '';
    return ICONS[kind] || ICONS.file;
  }

  R.define('tree', {
    selector: '.tree[data-tree], [data-tree]:not(.tree)',
    mount: function (root) {
      var o = R.opts(root, { checkboxes: false, icons: true, select: 'single', openAll: false });
      root.classList.add('tree');
      root.setAttribute('role', 'tree');
      if (o.select === 'multiple') root.setAttribute('aria-multiselectable', 'true');
      var items = [];

      function build(ul, level) {
        [].slice.call(ul.children).forEach(function (li) {
          if (li.tagName !== 'LI' || li.__tree) return;
          li.__tree = true;
          var sub = null, label = [];
          [].slice.call(li.childNodes).forEach(function (n) {
            if (n.nodeType === 1 && (n.tagName === 'UL' || n.tagName === 'OL')) sub = n;
            else if (!(n.nodeType === 3 && !n.textContent.trim()) && !(n.nodeType === 1 && n.classList.contains('tree-row'))) label.push(n);
          });
          var row = li.querySelector(':scope > .tree-row');
          var hasKids = !!(sub && sub.children.length) || li.hasAttribute('data-lazy');
          var name = label.filter(function (n) { return !(n.nodeType === 1 && n.classList.contains('tree-meta')); }).map(function (n) { return n.textContent; }).join('').trim();
          var kind = li.getAttribute('data-icon') || (hasKids || sub ? 'folder' : kindOf(name));
          if (!row) {
            row = document.createElement('div'); row.className = 'tree-row';
            var lab = document.createElement('span'); lab.className = 'tree-label';
            label.forEach(function (n) { if (n.nodeType === 1 && n.classList.contains('tree-meta')) return; lab.appendChild(n); });
            var meta = label.filter(function (n) { return n.nodeType === 1 && n.classList.contains('tree-meta'); });
            row.innerHTML = '<span class="tree-toggle' + (hasKids || sub ? '' : ' is-leaf') + '" aria-hidden="true">' + CHEV + '</span>' +
              (o.checkboxes ? '<span class="tree-check" aria-hidden="true">' + CHECK + '<span class="tree-dash"></span></span>' : '') +
              (o.icons && kind !== 'none' ? '<span class="tree-icon" data-kind="' + kind + '" aria-hidden="true"></span>' : '');
            row.appendChild(lab);
            meta.forEach(function (m) { row.appendChild(m); });
            li.insertBefore(row, li.firstChild);
          }
          li.setAttribute('role', 'treeitem');
          li.setAttribute('aria-level', level);
          li.tabIndex = -1;
          if (o.select !== 'none' && !li.hasAttribute('aria-selected')) li.setAttribute('aria-selected', 'false');
          if (o.checkboxes && !li.hasAttribute('data-checked')) li.setAttribute('data-checked', 'false');
          li.__kind = kind;
          if (sub) {
            var wrap = document.createElement('div'); wrap.className = 'tree-group';
            li.insertBefore(wrap, sub); wrap.appendChild(sub);
            sub.setAttribute('role', 'group');
            var open = li.hasAttribute('data-open') || o.openAll || li.getAttribute('aria-expanded') === 'true';
            li.setAttribute('aria-expanded', open ? 'true' : 'false');
            build(sub, level + 1);
          }
          paintIcon(li);
          items.push(li);
        });
      }
      function paintIcon(li) {
        var ic = li.querySelector(':scope > .tree-row > .tree-icon');
        if (ic) ic.innerHTML = iconFor(li.__kind, li.getAttribute('aria-expanded') === 'true');
      }
      build(root, 1);
      if (o.checkboxes) items.slice().reverse().forEach(function (li) { if (li.hasAttribute('aria-expanded')) syncUp(li); });

      function visible() {
        return R.$$('li[role="treeitem"]', root).filter(function (li) {
          var p = li.parentElement.closest('li[role="treeitem"]');
          while (p) { if (p.getAttribute('aria-expanded') !== 'true') return false; p = p.parentElement.closest('li[role="treeitem"]'); }
          return true;
        });
      }
      var cur = R.$('li[aria-selected="true"]', root) || items[0];
      function focus(li) {
        if (!li) return;
        if (cur && cur !== li) cur.tabIndex = -1;
        cur = li; li.tabIndex = 0; li.focus({ preventScroll: false });
      }
      if (cur) { cur.tabIndex = 0; }
      // Make sure the first item reachable when selected is hidden in a collapsed branch
      if (cur && visible().indexOf(cur) < 0) { cur.tabIndex = -1; cur = visible()[0]; if (cur) cur.tabIndex = 0; }

      function setOpen(li, open) {
        if (!li.hasAttribute('aria-expanded')) return;
        var was = li.getAttribute('aria-expanded') === 'true';
        if (was === open) return;
        if (open && li.hasAttribute('data-lazy') && !R.emit(li, 'load', { item: li })) { /* consumer handles */ }
        li.setAttribute('aria-expanded', open ? 'true' : 'false');
        paintIcon(li);
        R.emit(li, open ? 'expand' : 'collapse', { item: li, label: labelOf(li) });
      }
      function labelOf(li) { var l = li.querySelector(':scope > .tree-row .tree-label'); return l ? l.textContent.trim() : ''; }
      function valueOf(li) { return li.getAttribute('data-value') || labelOf(li); }
      function select(li, additive) {
        if (o.select === 'none' || li.getAttribute('aria-disabled') === 'true') return;
        if (o.select !== 'multiple' || !additive) R.$$('li[aria-selected="true"]', root).forEach(function (x) { if (x !== li) x.setAttribute('aria-selected', 'false'); });
        var on = o.select === 'multiple' && additive ? li.getAttribute('aria-selected') !== 'true' : true;
        li.setAttribute('aria-selected', on ? 'true' : 'false');
        R.emit(root, 'select', { item: li, value: valueOf(li), label: labelOf(li), selected: R.$$('li[aria-selected="true"]', root).map(valueOf) });
      }
      // Checkbox tri-state
      function kids(li) { var g = li.querySelector(':scope > .tree-group > ul'); return g ? [].slice.call(g.children).filter(function (c) { return c.getAttribute('role') === 'treeitem'; }) : []; }
      function setDown(li, v) { li.setAttribute('data-checked', v ? 'true' : 'false'); kids(li).forEach(function (k) { setDown(k, v); }); }
      function syncUp(li) {
        var ks = kids(li); if (!ks.length) return;
        var t = ks.filter(function (k) { return k.getAttribute('data-checked') === 'true'; }).length;
        var m = ks.some(function (k) { return k.getAttribute('data-checked') === 'mixed'; });
        li.setAttribute('data-checked', t === ks.length ? 'true' : (t || m) ? 'mixed' : 'false');
      }
      function toggleCheck(li) {
        setDown(li, li.getAttribute('data-checked') !== 'true');
        var p = li.parentElement.closest('li[role="treeitem"]');
        while (p) { syncUp(p); p = p.parentElement.closest('li[role="treeitem"]'); }
        R.$$('li[role="treeitem"]', root).forEach(function (x) { x.setAttribute('aria-checked', x.getAttribute('data-checked') === 'mixed' ? 'mixed' : x.getAttribute('data-checked')); });
        R.emit(root, 'check', { item: li, checked: R.$$('li[data-checked="true"]', root).filter(function (x) { return !kids(x).length; }).map(valueOf) });
      }
      if (o.checkboxes) R.$$('li[role="treeitem"]', root).forEach(function (x) { x.setAttribute('aria-checked', x.getAttribute('data-checked')); });

      var offClick = R.on(root, 'click', '.tree-row', function (e, row) {
        var li = row.parentElement; if (!li || li.getAttribute('aria-disabled') === 'true') return;
        focus(li);
        if (e.target.closest('.tree-check')) { toggleCheck(li); return; }
        if (e.target.closest('.tree-toggle')) { setOpen(li, li.getAttribute('aria-expanded') !== 'true'); return; }
        if (li.hasAttribute('aria-expanded')) setOpen(li, li.getAttribute('aria-expanded') !== 'true');
        if (o.checkboxes && o.select === 'none') toggleCheck(li); else select(li, e.metaKey || e.ctrlKey);
      });
      var offKey = R.on(root, 'keydown', function (e) {
        var li = e.target.closest && e.target.closest('li[role="treeitem"]'); if (!li || !root.contains(li)) return;
        var vis = visible(), i = vis.indexOf(li), exp = li.getAttribute('aria-expanded');
        switch (e.key) {
          case 'ArrowDown': focus(vis[Math.min(vis.length - 1, i + 1)]); break;
          case 'ArrowUp': focus(vis[Math.max(0, i - 1)]); break;
          case 'Home': focus(vis[0]); break;
          case 'End': focus(vis[vis.length - 1]); break;
          case 'ArrowRight':
            if (exp === 'false') setOpen(li, true); else if (exp === 'true') focus(kids(li)[0]); else return; break;
          case 'ArrowLeft':
            if (exp === 'true') setOpen(li, false); else { var p = li.parentElement.closest('li[role="treeitem"]'); if (p) focus(p); else return; } break;
          case 'Enter': if (exp) setOpen(li, exp !== 'true'); select(li, e.metaKey || e.ctrlKey); break;
          case ' ': if (o.checkboxes) toggleCheck(li); else select(li, e.metaKey || e.ctrlKey); break;
          case '*': var par = li.parentElement; [].slice.call(par.children).forEach(function (s) { setOpen(s, true); }); break;
          default:
            if (e.key.length === 1 && /\S/.test(e.key)) {
              var k = e.key.toLowerCase(), order = vis.slice(i + 1).concat(vis.slice(0, i + 1));
              var hit = order.filter(function (x) { return labelOf(x).toLowerCase().indexOf(k) === 0; })[0];
              if (hit) focus(hit); else return;
            } else return;
        }
        e.preventDefault();
      });
      var offFocus = R.on(root, 'focusin', function (e) { var li = e.target.closest('li[role="treeitem"]'); if (li && li !== cur) { if (cur) cur.tabIndex = -1; cur = li; li.tabIndex = 0; } });

      var api = {
        expand: function (li) { setOpen(li, true); }, collapse: function (li) { setOpen(li, false); },
        expandAll: function () { items.forEach(function (li) { setOpen(li, true); }); },
        collapseAll: function () { items.forEach(function (li) { setOpen(li, false); }); },
        select: select,
        checked: function () { return R.$$('li[data-checked="true"]', root).filter(function (x) { return !kids(x).length; }).map(valueOf); }
      };
      root.ranjTree = api;
      return { destroy: function () { offClick(); offKey(); offFocus(); delete root.ranjTree; }, api: api };
    }
  });
})(window.Ranj);

;
/* --- components/forms/0-forms.js --- */
/* Ranj UI — Forms: shared private helpers (icons, floating panels, hidden inputs).
   Exposed as Ranj._forms for the other forms components; not a public API. */
(function (R) {
  'use strict';
  if (!R || R._forms) return;

  function svg(d, extra) {
    return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + d + '</svg>';
  }
  var icons = {
    chevronDown: svg('<path d="m6 9 6 6 6-6"/>'),
    chevronUpDown: svg('<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>'),
    chevronLeft: svg('<path d="m15 18-6-6 6-6"/>'),
    chevronRight: svg('<path d="m9 18 6-6-6-6"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
    x: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
    xCircle: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" opacity=".9"/><path d="m15 9-6 6m0-6 6 6" stroke="var(--bg)" stroke-width="2" stroke-linecap="round"/></svg>',
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    eye: svg('<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: svg('<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="m2 2 20 20"/>'),
    calendar: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    minus: svg('<path d="M5 12h14"/>'),
    upload: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>'),
    file: svg('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/>'),
    pencil: svg('<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>'),
    spinner: '<svg class="f-spin" viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity=".2" stroke-width="2.5"/><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'
  };

  /** Copy scoped theme/accent from the anchor's ancestors so panels in <body> match. */
  function inheritScope(panel, anchor) {
    var t = anchor.closest && anchor.closest('[data-theme]:not(html)');
    var a = anchor.closest && anchor.closest('[data-accent]:not(html)');
    if (t) panel.setAttribute('data-theme', t.getAttribute('data-theme')); else panel.removeAttribute('data-theme');
    if (a) panel.setAttribute('data-accent', a.getAttribute('data-accent')); else panel.removeAttribute('data-accent');
  }

  /**
   * Open a floating panel anchored to `anchor`. Returns close(reason).
   * o: { placement, offset, matchWidth, onClose(reason), outside:[extra els], focusReturn }
   */
  function float(panel, anchor, o) {
    o = o || {};
    inheritScope(panel, anchor);
    if (panel.parentNode !== document.body) document.body.appendChild(panel);
    if (panel.__closeT) { clearTimeout(panel.__closeT); panel.__closeT = 0; }
    panel.hidden = false;
    panel.setAttribute('data-state', 'open');
    if (o.matchWidth) panel.style.minWidth = anchor.getBoundingClientRect().width + 'px';
    // Measure without the scale-in transform (getBoundingClientRect includes it), then start the animation
    panel.style.animation = 'none';
    var stopPos = R.autoPosition(panel, anchor, { placement: o.placement || 'bottom-start', offset: o.offset == null ? 6 : o.offset });
    void panel.offsetWidth;
    panel.style.animation = '';
    var closed = false;
    var offOut = R.onOutside([panel, anchor].concat(o.outside || []), function () { close('outside'); });
    var popLayer = R.pushLayer(function () { close('escape'); });
    function close(reason) {
      if (closed) return; closed = true;
      stopPos(); offOut(); popLayer();
      panel.setAttribute('data-state', 'closed');
      var done = function () { if (panel.getAttribute('data-state') === 'closed') { panel.hidden = true; } };
      panel.__closeT = setTimeout(done, R.reducedMotion ? 0 : 140);
      if (o.onClose) o.onClose(reason || 'close');
    }
    close.isOpen = function () { return !closed; };
    return close;
  }

  /** Get or create a hidden input inside host. */
  function hidden(host, name, value) {
    if (!name) return null;
    var sel = 'input[type="hidden"][data-f-hidden="' + name.replace(/"/g, '') + '"]';
    var h = host.querySelector(sel);
    if (!h) {
      h = document.createElement('input'); h.type = 'hidden'; h.name = name; h.setAttribute('data-f-hidden', name);
      host.appendChild(h);
    }
    if (value != null) h.value = value;
    return h;
  }

  /** Fire both a native-ish input/change on a real input (for frameworks) and ranj:change on host. */
  function changed(host, detail, input) {
    if (input) {
      try { input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
    }
    R.emit(host, 'change', detail);
  }

  /** Scroll an option into view inside a scrolling list without moving the page. */
  function scrollIntoList(list, item) {
    if (!list || !item) return;
    var lt = list.scrollTop, lh = list.clientHeight, it = item.offsetTop, ih = item.offsetHeight;
    if (it < lt) list.scrollTop = it - 4; else if (it + ih > lt + lh) list.scrollTop = it + ih - lh + 4;
  }

  function norm(s) { return String(s || '').toLowerCase().normalize ? String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') : String(s || '').toLowerCase(); }

  /** Highlight matched query text in a label (escaped). */
  function mark(label, q) {
    if (!q) return R.esc(label);
    var i = norm(label).indexOf(norm(q));
    if (i < 0) return R.esc(label);
    return R.esc(label.slice(0, i)) + '<mark>' + R.esc(label.slice(i, i + q.length)) + '</mark>' + R.esc(label.slice(i + q.length));
  }

  function shake(el) {
    if (!el || R.reducedMotion) return;
    el.classList.remove('f-shake'); void el.offsetWidth; el.classList.add('f-shake');
    setTimeout(function () { el.classList.remove('f-shake'); }, 500);
  }

  /**
   * Listbox controller shared by custom-select / combobox / multi-select.
   * list = makeList(panel, { host: el that gets aria-activedescendant, onPick(item, ev), multi })
   * items: [{ value, label, icon, desc, meta, disabled, group, selected, create }]
   */
  function makeList(panel, o) {
    o = o || {};
    panel.classList.add('listbox');
    panel.setAttribute('role', 'listbox');
    if (o.multi) panel.setAttribute('aria-multiselectable', 'true');
    R.ensureId(panel, 'lb');
    var all = [], shown = [], hi = -1, body = panel;
    if (o.header) { panel.appendChild(o.header); body = document.createElement('div'); body.className = 'listbox-body'; panel.appendChild(body); }
    function optHTML(it, q) {
      return (it.icon ? '<span class="listbox-icon">' + it.icon + '</span>' : '') +
        '<span class="listbox-text">' + mark(it.label, q) + (it.desc ? '<span class="listbox-desc">' + R.esc(it.desc) + '</span>' : '') + '</span>' +
        (it.meta ? '<span class="listbox-meta">' + R.esc(it.meta) + '</span>' : '') +
        (it.create ? '' : '<span class="listbox-check">' + icons.check + '</span>');
    }
    var api = {
      panel: panel,
      set: function (items) { all = items; return api; },
      items: function () { return all; },
      shown: function () { return shown; },
      render: function (q, filter) {
        q = q || '';
        var nq = norm(q).trim();
        shown = all.filter(function (it) {
          if (it.create) return true;
          if (filter === false || !nq) return true;
          return norm(it.label + ' ' + (it.keywords || '')).indexOf(nq) > -1;
        });
        var html = '', lastGroup = null, gi = 0;
        shown.forEach(function (it, i) {
          if (it.group !== lastGroup) {
            if (lastGroup !== null) html += '</div>';
            if (it.group) { gi++; html += '<div role="group" aria-labelledby="' + panel.id + '-g' + gi + '"><div class="listbox-label" id="' + panel.id + '-g' + gi + '">' + R.esc(it.group) + '</div>'; }
            else html += '<div role="presentation">';
            lastGroup = it.group;
          }
          it.id = panel.id + '-o' + i;
          html += '<div class="listbox-option" role="option" id="' + it.id + '" data-i="' + i + '"' +
            (it.create ? ' data-create' : '') +
            ' aria-selected="' + (!!it.selected) + '"' + (it.disabled ? ' aria-disabled="true"' : '') + '>' +
            (it.create ? icons.plus + '<span class="listbox-text">Create “' + R.esc(it.label) + '”</span>' : optHTML(it, nq ? q.trim() : '')) + '</div>';
        });
        if (lastGroup !== null) html += '</div>';
        if (!shown.length) html = '<div class="listbox-empty" role="presentation">' + R.esc(o.empty || 'No results found.') + '</div>';
        body.innerHTML = html;
        hi = -1;
        return api;
      },
      el: function (i) { return body.querySelector('[data-i="' + i + '"]'); },
      highlight: function (i, scroll) {
        var prev = api.el(hi); if (prev) prev.removeAttribute('data-highlighted');
        hi = i;
        var cur = api.el(i);
        if (cur) { cur.setAttribute('data-highlighted', ''); if (scroll !== false) scrollIntoList(panel, cur); }
        if (o.host) { if (cur) o.host.setAttribute('aria-activedescendant', cur.id); else o.host.removeAttribute('aria-activedescendant'); }
        return api;
      },
      index: function () { return hi; },
      current: function () { return shown[hi]; },
      move: function (d) {
        if (!shown.length) return api;
        var n = shown.length, i = hi;
        if (d === 'first') { i = -1; d = 1; } else if (d === 'last') { i = n; d = -1; }
        var step = d > 0 ? 1 : -1, count = Math.abs(d), guard = 0;
        while (count > 0 && guard++ < n * 2) {
          var j = i + step;
          if (j < 0 || j >= n) { if (Math.abs(d) > 1 || o.noWrap) break; j = (j + n) % n; }
          i = j;
          if (!shown[i].disabled) count--;
        }
        if (shown[i] && !shown[i].disabled) api.highlight(i);
        return api;
      },
      /** typeahead: find next enabled item starting with str after current */
      seek: function (str) {
        var s = norm(str), n = shown.length; if (!n) return -1;
        var same = s.split('').every(function (c) { return c === s[0]; });
        var start = hi + (same || s.length === 1 ? 1 : 0);
        for (var k = 0; k < n; k++) {
          var i = (start + k + n) % n, it = shown[i];
          if (it.disabled || it.create) continue;
          var l = norm(it.label);
          if (l.indexOf(s) === 0 || (same && l[0] === s[0])) { api.highlight(i); return i; }
        }
        return -1;
      }
    };
    on(panel, 'mousedown', function (e) { if (!e.target.closest('input')) e.preventDefault(); });
    on(panel, 'click', '.listbox-option', function (e, opt) {
      var it = shown[+opt.getAttribute('data-i')];
      if (it && !it.disabled && o.onPick) o.onPick(it, e);
    });
    on(panel, 'pointermove', '.listbox-option', function (e, opt) {
      var i = +opt.getAttribute('data-i');
      if (i !== hi && !(shown[i] && shown[i].disabled)) api.highlight(i, false);
    });
    return api;
  }
  var on = R.on;

  /** Typeahead buffer: returns fn(char) → accumulated string */
  function typeahead() {
    var buf = '', t = 0;
    return function (ch) { clearTimeout(t); buf += ch; t = setTimeout(function () { buf = ''; }, 600); return buf; };
  }

  /** Read items from a native <select> */
  function itemsFromSelect(sel) {
    var out = [];
    R.$$('option', sel).forEach(function (op) {
      if (op.hidden && op.value === '') return;
      var g = op.parentElement && op.parentElement.tagName === 'OPTGROUP' ? op.parentElement : null;
      out.push({
        value: op.value, label: op.getAttribute('data-label') || op.textContent.trim(),
        icon: op.getAttribute('data-icon') || '', desc: op.getAttribute('data-description') || '', meta: op.getAttribute('data-meta') || '',
        keywords: op.getAttribute('data-keywords') || '',
        disabled: op.disabled || (g && g.disabled), group: g ? g.label : '', selected: op.selected && !(op.value === '' && !op.hasAttribute('selected')), option: op
      });
    });
    return out;
  }

  R._forms = { icons: icons, makeList: makeList, typeahead: typeahead, itemsFromSelect: itemsFromSelect, float: float, hidden: hidden, changed: changed, scrollIntoList: scrollIntoList, norm: norm, mark: mark, shake: shake, inheritScope: inheritScope };
})(window.Ranj);

;
/* --- components/forms/calendar.js --- */
/* Calendar — inline month grid: keyboard grid nav, month/year views, min/max, disabled dates, range + multiple modes.
   v1 compat: .calendar auto-mounts (unless data-manual) and Ranj.calendar(el, { onSelect }) still works. */
(function (R) {
  'use strict';
  var F = R._forms;
  var DAY = 864e5;

  function d0(d) { return d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null; }
  function iso(d) { if (!d) return ''; var m = d.getMonth() + 1, x = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (x < 10 ? '0' : '') + x; }
  function parseISO(s) {
    if (!s) return null; if (s instanceof Date) return d0(s);
    s = String(s).trim();
    if (s === 'today') return d0(new Date());
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    var rel = /^([+-]\d+)([dwmy])$/.exec(s);
    if (rel) { var t = d0(new Date()), n = +rel[1]; if (rel[2] === 'd') return addDays(t, n); if (rel[2] === 'w') return addDays(t, n * 7); if (rel[2] === 'm') return addMonths(t, n); return addMonths(t, n * 12); }
    var p = new Date(s); return isNaN(p) ? null : d0(p);
  }
  function same(a, b) { return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function addMonths(d, n) { var t = new Date(d.getFullYear(), d.getMonth() + n, 1); var last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate(); return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last)); }
  function cmp(a, b) { return a - b; }

  function create(el, opts) {
    var o = {
      mode: 'single', value: null, min: null, max: null, disabled: null, weekStart: 0, months: 1, locale: undefined,
      onSelect: null, onChange: null, name: '', outside: true, focusOnRender: false, todayButton: false, fixedWeeks: true
    };
    for (var k in opts) if (opts[k] !== undefined) o[k] = opts[k];
    var today = d0(new Date());
    var min = parseISO(o.min), max = parseISO(o.max);
    var disabledSet = {}, disabledFn = null;
    function setDisabled(dis) {
      disabledSet = {}; disabledFn = null;
      if (typeof dis === 'function') disabledFn = dis;
      else if (dis === 'weekends') disabledFn = function (d) { var w = d.getDay(); return w === 0 || w === 6; };
      else if (dis === 'past') disabledFn = function (d) { return d < today; };
      else if (dis) [].concat(typeof dis === 'string' ? dis.split(',') : dis).forEach(function (s) { var d = parseISO(s); if (d) disabledSet[iso(d)] = 1; });
    }
    setDisabled(o.disabled);
    function isDisabled(d) { return (min && d < min) || (max && d > max) || !!disabledSet[iso(d)] || (disabledFn ? !!disabledFn(d) : false); }

    // State
    var sel = [];               // single: [d] | range: [start, end?] | multiple: [d...]
    function setValue(v) {
      if (o.mode === 'range') { var a = [].concat(v || []).map(parseISO); sel = a[0] ? (a[1] ? [a[0], a[1]].sort(cmp) : [a[0]]) : []; }
      else if (o.mode === 'multiple') sel = [].concat(v || []).map(parseISO).filter(Boolean).sort(cmp);
      else sel = v ? [parseISO(v)].filter(Boolean) : [];
    }
    setValue(o.value);
    var view = d0(sel[0] || (min && min > today ? min : max && max < today ? max : today));
    view = new Date(view.getFullYear(), view.getMonth(), 1);
    // With several months and a max date, keep the last visible month at or before max
    if (o.months > 1 && max) { var lastShown = new Date(view.getFullYear(), view.getMonth() + o.months - 1, 1); if (lastShown > max) view = new Date(max.getFullYear(), max.getMonth() - o.months + 1, 1); }
    var focusDate = d0(sel[0] || (isDisabled(today) ? null : today) || view);
    if (focusDate < view || focusDate > new Date(view.getFullYear(), view.getMonth() + o.months, 0)) focusDate = view;
    var mode = 'days';        // days | months | years
    var hover = null;
    var hiddenA = null, hiddenB = null;
    if (o.name) {
      if (o.mode === 'range') { hiddenA = F.hidden(el, o.name + '_start'); hiddenB = F.hidden(el, o.name + '_end'); }
      else hiddenA = F.hidden(el, o.name);
    }

    var fmtMonth = new Intl.DateTimeFormat(o.locale, { month: 'long', year: 'numeric' });
    var fmtMonthShort = new Intl.DateTimeFormat(o.locale, { month: 'short' });
    var fmtLong = new Intl.DateTimeFormat(o.locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    var wd = [], base = new Date(2023, 0, 1); // a Sunday
    var fmtWd = new Intl.DateTimeFormat(o.locale, { weekday: 'short' }), fmtWdLong = new Intl.DateTimeFormat(o.locale, { weekday: 'long' });
    for (var i = 0; i < 7; i++) { var dd = addDays(base, (i + o.weekStart) % 7); wd.push({ s: fmtWd.format(dd).slice(0, 2), l: fmtWdLong.format(dd) }); }

    el.classList.add('calendar');
    if (o.months > 1) el.setAttribute('data-months', o.months);
    el.setAttribute('data-mode', o.mode);
    var live = document.createElement('div'); live.className = 'f-sr'; live.setAttribute('aria-live', 'polite');

    function inRange(d) {
      if (o.mode !== 'range' || !sel[0]) return 0;
      var a = sel[0], b = sel[1] || hover;
      if (!b) return 0;
      var lo = a < b ? a : b, hi = a < b ? b : a;
      return d >= lo && d <= hi ? 1 : 0;
    }
    function isSel(d) { return sel.some(function (s) { return same(s, d); }); }

    function dayGrid(month) {
      var y = month.getFullYear(), m = month.getMonth();
      var first = new Date(y, m, 1), offset = (first.getDay() - o.weekStart + 7) % 7;
      var start = addDays(first, -offset);
      var weeks = o.fixedWeeks ? 6 : Math.ceil((offset + new Date(y, m + 1, 0).getDate()) / 7);
      var h = '<div class="calendar-grid" role="grid" aria-label="' + R.esc(fmtMonth.format(first)) + '"><div class="calendar-row calendar-weekdays" role="row">';
      wd.forEach(function (w) { h += '<span class="calendar-day-header" role="columnheader" aria-label="' + R.esc(w.l) + '">' + R.esc(w.s) + '</span>'; });
      h += '</div>';
      var a = sel[0], b = o.mode === 'range' ? (sel[1] || hover) : null;
      var lo = a && b ? (a < b ? a : b) : a, hi = a && b ? (a < b ? b : a) : null;
      for (var wk = 0; wk < weeks; wk++) {
        h += '<div class="calendar-row" role="row">';
        for (var di = 0; di < 7; di++) {
          var d = addDays(start, wk * 7 + di), other = d.getMonth() !== m;
          var cls = 'calendar-day', cell = 'calendar-cell';
          var dis = isDisabled(d), s = isSel(d) && (o.mode !== 'range' || !other);
          if (same(d, today)) cls += ' today';
          if (other) { cls += ' other-month'; cell += ' is-outside'; }
          if (dis) cls += ' disabled';
          if (s) cls += ' selected';
          if (o.mode === 'range' && lo && hi && !other) {
            if (same(d, lo)) { cls += ' range-start'; cell += ' range-start'; }
            if (same(d, hi)) { cls += ' range-end'; cell += ' range-end'; }
            if (d > lo && d < hi) { cls += ' in-range'; cell += ' in-range'; }
            if (!sel[1] && hover) cell += ' is-preview';
            if (same(lo, hi)) cell += ' range-single';
          }
          if (other && !o.outside) { h += '<span class="' + cell + '" role="gridcell"></span>'; continue; }
          var focusable = same(d, focusDate) && !other;
          h += '<span class="' + cell + '" role="gridcell"' + (s ? ' aria-selected="true"' : '') + '>' +
            '<button type="button" class="' + cls + '" data-date="' + iso(d) + '" tabindex="' + (focusable ? 0 : -1) + '"' +
            (dis ? ' aria-disabled="true"' : '') + (same(d, today) ? ' aria-current="date"' : '') + (s ? ' aria-pressed="true"' : '') +
            ' aria-label="' + R.esc(fmtLong.format(d)) + '">' + d.getDate() + '</button></span>';
        }
        h += '</div>';
      }
      return h + '</div>';
    }
    function monthGrid() {
      var y = view.getFullYear(), h = '<div class="calendar-picker-grid" role="grid" aria-label="' + y + '"><div role="row" class="calendar-picker-row">';
      for (var mi = 0; mi < 12; mi++) {
        if (mi && mi % 3 === 0) h += '</div><div role="row" class="calendar-picker-row">';
        var first = new Date(y, mi, 1), last = new Date(y, mi + 1, 0);
        var dis = (min && last < min) || (max && first > max);
        var cur = mi === focusDate.getMonth();
        var isS = sel[0] && sel[0].getFullYear() === y && sel[0].getMonth() === mi;
        h += '<span role="gridcell"><button type="button" class="calendar-pick' + (isS ? ' selected' : '') + (today.getFullYear() === y && today.getMonth() === mi ? ' today' : '') + '" data-month="' + mi + '" tabindex="' + (cur ? 0 : -1) + '"' + (dis ? ' aria-disabled="true"' : '') + '>' + R.esc(fmtMonthShort.format(first)) + '</button></span>';
      }
      return h + '</div></div>';
    }
    function yearGrid() {
      var y0 = Math.floor(view.getFullYear() / 12) * 12, h = '<div class="calendar-picker-grid" role="grid" aria-label="' + y0 + '–' + (y0 + 11) + '"><div role="row" class="calendar-picker-row">';
      for (var yi = 0; yi < 12; yi++) {
        if (yi && yi % 3 === 0) h += '</div><div role="row" class="calendar-picker-row">';
        var y = y0 + yi, dis = (min && y < min.getFullYear()) || (max && y > max.getFullYear());
        var isS = sel[0] && sel[0].getFullYear() === y;
        h += '<span role="gridcell"><button type="button" class="calendar-pick' + (isS ? ' selected' : '') + (today.getFullYear() === y ? ' today' : '') + '" data-year="' + y + '" tabindex="' + (y === focusDate.getFullYear() ? 0 : -1) + '"' + (dis ? ' aria-disabled="true"' : '') + '>' + y + '</button></span>';
      }
      return h + '</div></div>';
    }
    function canPrev() {
      if (!min) return true;
      if (mode === 'days') return new Date(view.getFullYear(), view.getMonth(), 0) >= min;
      if (mode === 'months') return view.getFullYear() > min.getFullYear();
      return Math.floor(view.getFullYear() / 12) * 12 > min.getFullYear();
    }
    function canNext() {
      if (!max) return true;
      var span = mode === 'days' ? o.months : 1;
      if (mode === 'days') return new Date(view.getFullYear(), view.getMonth() + span, 1) <= max;
      if (mode === 'months') return view.getFullYear() < max.getFullYear();
      return Math.floor(view.getFullYear() / 12) * 12 + 11 < max.getFullYear();
    }

    var CHEV_L = F.icons.chevronLeft, CHEV_R = F.icons.chevronRight;
    function render(dir, focus) {
      var label = mode === 'days' ? 'month' : mode === 'months' ? 'year' : 'years';
      var h = '<div class="calendar-header">' +
        '<button type="button" class="calendar-nav" data-cal-prev aria-label="Previous ' + label + '"' + (canPrev() ? '' : ' disabled') + '>' + CHEV_L + '</button>';
      if (mode === 'days') {
        for (var mi = 0; mi < o.months; mi++) {
          var mm = new Date(view.getFullYear(), view.getMonth() + mi, 1);
          h += o.months === 1 && !el.hasAttribute('data-no-views')
            ? '<button type="button" class="calendar-title" data-cal-view aria-label="' + R.esc(fmtMonth.format(mm)) + ', choose month">' + R.esc(fmtMonth.format(mm)) + '<span class="calendar-title-caret">' + F.icons.chevronDown + '</span></button>'
            : '<span class="calendar-title">' + R.esc(fmtMonth.format(mm)) + '</span>';
        }
      } else if (mode === 'months') {
        h += '<button type="button" class="calendar-title" data-cal-view aria-label="' + view.getFullYear() + ', choose year">' + view.getFullYear() + '<span class="calendar-title-caret">' + F.icons.chevronDown + '</span></button>';
      } else {
        var y0 = Math.floor(view.getFullYear() / 12) * 12;
        h += '<span class="calendar-title">' + y0 + ' – ' + (y0 + 11) + '</span>';
      }
      h += '<button type="button" class="calendar-nav" data-cal-next aria-label="Next ' + label + '"' + (canNext() ? '' : ' disabled') + '>' + CHEV_R + '</button></div>';
      h += '<div class="calendar-body' + (dir ? ' cal-slide-' + (dir > 0 ? 'next' : 'prev') : '') + (mode !== 'days' ? ' cal-zoom' : '') + '">';
      if (mode === 'days') {
        h += '<div class="calendar-months">';
        for (var mj = 0; mj < o.months; mj++) h += dayGrid(new Date(view.getFullYear(), view.getMonth() + mj, 1));
        h += '</div>';
      } else h += mode === 'months' ? monthGrid() : yearGrid();
      h += '</div>';
      if (o.todayButton) h += '<div class="calendar-foot"><button type="button" class="calendar-today-btn" data-cal-today>Today</button></div>';
      el.innerHTML = h;
      el.appendChild(live);
      if (hiddenA) el.appendChild(hiddenA);
      if (hiddenB) el.appendChild(hiddenB);
      if (focus) { var f = el.querySelector('.calendar-body [tabindex="0"]'); if (f) f.focus({ preventScroll: true }); }
    }

    function emitSelect() {
      var v = o.mode === 'single' ? sel[0] || null : sel.slice();
      if (hiddenA) hiddenA.value = o.mode === 'multiple' ? sel.map(iso).join(',') : iso(sel[0]);
      if (hiddenB) hiddenB.value = iso(sel[1]);
      var detail = { value: o.mode === 'single' ? iso(sel[0]) : sel.map(iso), date: v, complete: o.mode !== 'range' || sel.length === 2 };
      if (o.onSelect) o.onSelect(v, detail);
      R.emit(el, 'change', detail);
      if (o.onChange) o.onChange(detail);
    }
    function pick(d) {
      if (isDisabled(d)) return;
      if (o.mode === 'single') sel = [d];
      else if (o.mode === 'multiple') { var i = sel.map(iso).indexOf(iso(d)); if (i > -1) sel.splice(i, 1); else sel.push(d); sel.sort(cmp); }
      else {
        if (!sel[0] || sel[1]) sel = [d];
        else {
          var a = sel[0], lo = a < d ? a : d, hi = a < d ? d : a;
          // reject ranges spanning disabled days if data-no-gaps
          if (o.noGaps) for (var t = lo; t <= hi; t = addDays(t, 1)) if (isDisabled(t)) { sel = [d]; focusDate = d; render(0, true); return; }
          sel = [lo, hi];
        }
        hover = null;
      }
      focusDate = d;
      if (d.getMonth() !== view.getMonth() && o.months === 1) view = new Date(d.getFullYear(), d.getMonth(), 1);
      render(0, true);
      live.textContent = o.mode === 'range' ? (sel[1] ? 'Selected ' + fmtLong.format(sel[0]) + ' to ' + fmtLong.format(sel[1]) : 'Start date ' + fmtLong.format(sel[0]) + '. Choose an end date.') : fmtLong.format(d) + (isSel(d) ? ' selected' : ' removed');
      emitSelect();
    }
    function visible(d) {
      var first = view, last = new Date(view.getFullYear(), view.getMonth() + o.months, 0);
      return d >= first && d <= last;
    }
    function moveFocus(d, animate) {
      if (min && d < min) d = min; if (max && d > max) d = max;
      var dir = 0;
      if (!visible(d)) { dir = d < view ? -1 : 1; view = dir < 0 ? new Date(d.getFullYear(), d.getMonth(), 1) : new Date(d.getFullYear(), d.getMonth() - o.months + 1, 1); }
      focusDate = d;
      if (o.mode === 'range' && sel[0] && !sel[1]) hover = d;
      render(animate === false ? 0 : dir, true);
    }
    function nav(n) {
      if (mode === 'days') { view = addMonths(view, n); focusDate = addMonths(focusDate, n); if (!visible(focusDate)) focusDate = new Date(view.getFullYear(), view.getMonth(), 1); }
      else if (mode === 'months') { view = new Date(view.getFullYear() + n, 0, 1); focusDate = new Date(view.getFullYear(), focusDate.getMonth(), 1); }
      else { view = new Date(view.getFullYear() + n * 12, 0, 1); focusDate = new Date(focusDate.getFullYear() + n * 12, 0, 1); }
      render(n);
      live.textContent = el.querySelector('.calendar-title').textContent;
    }

    var offs = [
      R.on(el, 'click', function (e) {
        var t = e.target.closest('button'); if (!t || !el.contains(t) || t.disabled || t.getAttribute('aria-disabled') === 'true') return;
        if (t.hasAttribute('data-cal-prev')) nav(-1);
        else if (t.hasAttribute('data-cal-next')) nav(1);
        else if (t.hasAttribute('data-cal-view')) { mode = mode === 'days' ? 'months' : 'years'; render(0, true); }
        else if (t.hasAttribute('data-cal-today')) { view = new Date(today.getFullYear(), today.getMonth(), 1); mode = 'days'; pick(today); }
        else if (t.hasAttribute('data-month')) { view = new Date(view.getFullYear(), +t.getAttribute('data-month'), 1); focusDate = addMonths(focusDate, 0); focusDate = new Date(view.getFullYear(), view.getMonth(), Math.min(focusDate.getDate(), new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate())); mode = 'days'; render(0, true); }
        else if (t.hasAttribute('data-year')) { view = new Date(+t.getAttribute('data-year'), view.getMonth(), 1); focusDate = new Date(view.getFullYear(), focusDate.getMonth(), 1); mode = 'months'; render(0, true); }
        else if (t.hasAttribute('data-date')) { var d = parseISO(t.getAttribute('data-date')); if (d.getMonth() !== view.getMonth() && o.months === 1 && !visible(d)) view = new Date(d.getFullYear(), d.getMonth(), 1); pick(d); }
      }),
      R.on(el, 'pointerover', function (e) {
        if (o.mode !== 'range' || !sel[0] || sel[1]) return;
        var t = e.target.closest('[data-date]'); if (!t) return;
        var d = parseISO(t.getAttribute('data-date'));
        if (!same(d, hover)) { hover = d; paintPreview(); }
      }),
      R.on(el, 'pointerleave', function () { if (hover && o.mode === 'range' && !sel[1]) { hover = null; paintPreview(); } }),
      R.on(el, 'keydown', function (e) {
        var t = e.target, k = e.key;
        if (t.hasAttribute('data-date')) {
          var d = parseISO(t.getAttribute('data-date')), n = null;
          if (k === 'ArrowLeft') n = addDays(d, -1); else if (k === 'ArrowRight') n = addDays(d, 1);
          else if (k === 'ArrowUp') n = addDays(d, -7); else if (k === 'ArrowDown') n = addDays(d, 7);
          else if (k === 'Home') n = addDays(d, -((d.getDay() - o.weekStart + 7) % 7));
          else if (k === 'End') n = addDays(d, 6 - ((d.getDay() - o.weekStart + 7) % 7));
          else if (k === 'PageUp') n = e.shiftKey ? addMonths(d, -12) : addMonths(d, -1);
          else if (k === 'PageDown') n = e.shiftKey ? addMonths(d, 12) : addMonths(d, 1);
          else if (k === 'Enter' || k === ' ') { e.preventDefault(); pick(d); return; }
          if (n) { e.preventDefault(); moveFocus(n); }
        } else if (t.hasAttribute('data-month') || t.hasAttribute('data-year')) {
          var isM = t.hasAttribute('data-month'), cur = +(t.getAttribute(isM ? 'data-month' : 'data-year')), step = 0;
          if (k === 'ArrowLeft') step = -1; else if (k === 'ArrowRight') step = 1; else if (k === 'ArrowUp') step = -3; else if (k === 'ArrowDown') step = 3;
          if (step) {
            e.preventDefault();
            var nv = cur + step;
            if (isM) { if (nv < 0 || nv > 11) { view = new Date(view.getFullYear() + (nv < 0 ? -1 : 1), 0, 1); nv = (nv + 12) % 12; } focusDate = new Date(view.getFullYear(), nv, 1); render(0, true); }
            else { var y0 = Math.floor(view.getFullYear() / 12) * 12; if (nv < y0 || nv > y0 + 11) view = new Date(nv, 0, 1); focusDate = new Date(nv, focusDate.getMonth(), 1); render(0, true); }
          } else if (k === 'Escape' && mode !== 'days') { e.preventDefault(); e.stopPropagation(); mode = mode === 'years' ? 'months' : 'days'; render(0, true); }
        }
      })
    ];
    function paintPreview() {
      R.$$('.calendar-cell', el).forEach(function (c) {
        var b = c.querySelector('[data-date]'); if (!b || c.classList.contains('is-outside')) return;
        var d = parseISO(b.getAttribute('data-date'));
        var a = sel[0], bb = hover, lo = a && bb ? (a < bb ? a : bb) : a, hi = a && bb ? (a < bb ? bb : a) : a;
        var start = lo && same(d, lo), end = hi && same(d, hi), mid = lo && hi && d > lo && d < hi;
        c.classList.toggle('range-start', !!start); b.classList.toggle('range-start', !!start);
        c.classList.toggle('range-end', !!end); b.classList.toggle('range-end', !!end);
        c.classList.toggle('in-range', !!mid); b.classList.toggle('in-range', !!mid);
        c.classList.toggle('is-preview', !!hover);
        c.classList.toggle('range-single', !!(lo && hi && same(lo, hi)));
      });
    }

    render(0, o.focusOnRender);
    if (hiddenA) { hiddenA.value = o.mode === 'multiple' ? sel.map(iso).join(',') : iso(sel[0]); }
    if (hiddenB) hiddenB.value = iso(sel[1]);

    var inst = {
      el: el,
      destroy: function () { offs.forEach(function (f) { f(); }); },
      get: function () { return o.mode === 'single' ? sel[0] || null : sel.slice(); },
      set: function (v, silent) { setValue(v); if (sel[0]) { view = new Date(sel[0].getFullYear(), sel[0].getMonth(), 1); focusDate = sel[0]; } hover = null; render(0); if (!silent) emitSelect(); else { if (hiddenA) hiddenA.value = iso(sel[0]); if (hiddenB) hiddenB.value = iso(sel[1]); } },
      goTo: function (d) { d = parseISO(d); if (!d) return; view = new Date(d.getFullYear(), d.getMonth(), 1); focusDate = d; render(0); },
      focus: function () { var f = el.querySelector('.calendar-body [tabindex="0"]') || el.querySelector('[data-date]:not([aria-disabled])'); if (f) f.focus({ preventScroll: true }); },
      configure: function (x) { for (var k in x) if (x[k] !== undefined) o[k] = x[k]; if ('min' in x) min = parseISO(x.min); if ('max' in x) max = parseISO(x.max); if ('disabled' in x) setDisabled(x.disabled); if ('value' in x) setValue(x.value); render(0); },
      isDisabled: isDisabled
    };
    return inst;
  }

  function dataOpts(el) {
    var o = R.opts(el, { mode: 'single', value: '', min: '', max: '', disabled: '', weekStart: 0, months: 1, locale: '', name: '', outside: true, todayButton: false, noGaps: false });
    return {
      mode: o.mode, value: o.mode === 'single' ? o.value || null : (o.value ? o.value.split(/[,/]/) : null),
      min: o.min || null, max: o.max || null, disabled: o.disabled || null, weekStart: o.weekStart, months: o.months,
      locale: o.locale || undefined, name: o.name, outside: o.outside, todayButton: o.todayButton, noGaps: o.noGaps
    };
  }

  R.define('calendar', {
    selector: '.calendar:not([data-manual])',
    mount: function (el) { return create(el, dataOpts(el)); }
  });

  /** Ranj.calendar(el, { mode, value, min, max, disabled, weekStart, months, onSelect(date, detail) }) → instance */
  R.calendar = function (el, opts) {
    if (typeof el === 'string') el = document.querySelector(el);
    opts = opts || {};
    var cur = R.instance(el, 'calendar');
    if (cur && cur.configure) { cur.configure(opts); return cur; }
    var d = dataOpts(el); for (var k in opts) d[k] = opts[k];
    var inst = create(el, d);
    el.__ranj = el.__ranj || {};
    el.__ranj.calendar = inst;
    return inst;
  };
  R._cal = { create: create, iso: iso, parse: parseISO, same: same, addDays: addDays, addMonths: addMonths, d0: d0 };
})(window.Ranj);

;
/* --- components/forms/checkbox.js --- */
/* Checkbox — inserts missing marks, data-indeterminate, and "select all" parents (data-check-all="name") */
(function (R) {
  'use strict';

  R.define('checkbox', {
    selector: 'label.checkbox, .checkbox-card, input[data-indeterminate]',
    mount: function (el) {
      if (el.tagName === 'INPUT') { el.indeterminate = el.getAttribute('data-indeterminate') !== 'false'; return; }
      var inp = el.querySelector(':scope > input[type="checkbox"]');
      if (inp && !el.querySelector('.checkbox-mark') && el.classList.contains('checkbox')) {
        var m = document.createElement('span'); m.className = 'checkbox-mark'; m.setAttribute('aria-hidden', 'true');
        inp.insertAdjacentElement('afterend', m);
      }
      if (inp && inp.hasAttribute('data-indeterminate')) inp.indeterminate = true;
    }
  });

  R.define('checkbox-all', {
    selector: 'input[type="checkbox"][data-check-all]',
    mount: function (all) {
      var name = all.getAttribute('data-check-all');
      var scope = all.form || all.closest('[data-check-scope]') || document;
      function kids() { return R.$$('input[type="checkbox"][name="' + name + '"]', scope).filter(function (k) { return !k.disabled; }); }
      function sync() {
        var k = kids(), n = k.filter(function (x) { return x.checked; }).length;
        all.checked = n > 0 && n === k.length;
        all.indeterminate = n > 0 && n < k.length;
        all.setAttribute('aria-checked', all.indeterminate ? 'mixed' : String(all.checked));
      }
      var off1 = R.on(all, 'change', function () {
        kids().forEach(function (k) { k.checked = all.checked; });
        sync();
        R.emit(all, 'change', { value: kids().filter(function (x) { return x.checked; }).map(function (x) { return x.value; }) });
      });
      var off2 = R.on(scope, 'change', function (e) { if (e.target !== all && e.target.name === name) sync(); });
      sync();
      return function () { off1(); off2(); };
    }
  });
})(window.Ranj);

;
/* --- components/forms/color-picker.js --- */
/* Color picker — saturation/value area, hue slider, hex input, swatches, eyedropper; popover or inline */
(function (R) {
  'use strict';
  var F = R._forms;
  var DEFAULT_SWATCHES = '#0f172a,#ef4444,#f97316,#f59e0b,#84cc16,#10b981,#06b6d4,#3b82f6,#6366f1,#8b5cf6,#d946ef,#ec4899';

  function hexToRgb(h) {
    h = String(h || '').trim().replace(/^#/, '');
    if (h.length === 3 || h.length === 4) h = h.split('').map(function (c) { return c + c; }).join('');
    if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  function rgbToHex(c) { return '#' + [c.r, c.g, c.b].map(function (v) { v = Math.round(v).toString(16); return v.length < 2 ? '0' + v : v; }).join(''); }
  function rgbToHsv(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return { h: h, s: mx ? d / mx : 0, v: mx };
  }
  function hsvToRgb(h, s, v) {
    var c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c, r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
  }
  function readable(c) { return (c.r * 299 + c.g * 587 + c.b * 114) / 1000 > 150 ? '#09090b' : '#ffffff'; }

  R.define('color-picker', {
    selector: '.color-picker',
    mount: function (el) {
      var o = R.opts(el, { value: '#6366f1', name: '', swatches: DEFAULT_SWATCHES, inline: false, placement: 'bottom-start', label: 'Color' });
      var rgb = hexToRgb(o.value) || { r: 99, g: 102, b: 241 }, hsv = rgbToHsv(rgb);
      var hidden = F.hidden(el, o.name || null, rgbToHex(rgb));
      var trigger = null;
      if (!o.inline) {
        trigger = el.querySelector('.color-picker-trigger');
        if (!trigger) {
          trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'color-picker-trigger';
          trigger.innerHTML = '<span class="color-swatch" aria-hidden="true"></span><span class="color-picker-hex"></span><span class="color-picker-caret">' + F.icons.chevronDown + '</span>';
          el.insertBefore(trigger, el.firstChild);
        }
        trigger.setAttribute('aria-haspopup', 'dialog'); trigger.setAttribute('aria-expanded', 'false');
      }
      var panel = document.createElement('div');
      panel.className = 'color-panel' + (o.inline ? '' : ' picker-popover');
      panel.setAttribute('role', o.inline ? 'group' : 'dialog');
      panel.setAttribute('aria-label', o.label + ' picker');
      var sw = o.swatches ? o.swatches.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];
      panel.innerHTML =
        '<div class="color-area" role="slider" tabindex="0" aria-label="Saturation and brightness" aria-valuemin="0" aria-valuemax="100"><div class="color-area-thumb"></div></div>' +
        '<div class="color-row">' +
          ('EyeDropper' in window ? '<button type="button" class="color-eyedropper" aria-label="Pick a color from the screen"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/></svg></button>' : '') +
          '<div class="color-hue" role="slider" tabindex="0" aria-label="Hue" aria-valuemin="0" aria-valuemax="360"><div class="color-hue-thumb"></div></div>' +
        '</div>' +
        '<div class="color-fields"><span class="color-swatch color-preview" aria-hidden="true"></span><label class="color-hex-field"><span>HEX</span><input type="text" class="color-hex-input" spellcheck="false" maxlength="7" aria-label="Hex color"></label></div>' +
        (sw.length ? '<div class="color-swatches" role="group" aria-label="Swatches">' + sw.map(function (c) { return '<button type="button" class="color-swatch-btn" data-color="' + R.esc(c) + '" style="--c:' + R.esc(c) + '" aria-label="' + R.esc(c) + '"></button>'; }).join('') + '</div>' : '');
      if (o.inline) el.appendChild(panel); else panel.hidden = true;
      var area = panel.querySelector('.color-area'), aThumb = panel.querySelector('.color-area-thumb');
      var hue = panel.querySelector('.color-hue'), hThumb = panel.querySelector('.color-hue-thumb');
      var hexIn = panel.querySelector('.color-hex-input');

      function paint(skipHex) {
        rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
        var hex = rgbToHex(rgb);
        el.style.setProperty('--color', hex);
        panel.style.setProperty('--color', hex);
        panel.style.setProperty('--hue-color', rgbToHex(hsvToRgb(hsv.h, 1, 1)));
        aThumb.style.left = (hsv.s * 100) + '%'; aThumb.style.top = ((1 - hsv.v) * 100) + '%';
        hThumb.style.left = (hsv.h / 360 * 100) + '%';
        area.setAttribute('aria-valuenow', Math.round(hsv.s * 100));
        area.setAttribute('aria-valuetext', 'Saturation ' + Math.round(hsv.s * 100) + '%, brightness ' + Math.round(hsv.v * 100) + '%');
        hue.setAttribute('aria-valuenow', Math.round(hsv.h)); hue.setAttribute('aria-valuetext', Math.round(hsv.h) + ' degrees');
        if (!skipHex) hexIn.value = hex.toUpperCase();
        if (trigger) { trigger.querySelector('.color-picker-hex').textContent = hex.toUpperCase(); trigger.setAttribute('aria-label', o.label + ': ' + hex.toUpperCase() + '. Change color'); }
        R.$$('.color-swatch-btn', panel).forEach(function (b) { var on = (hexToRgb(b.getAttribute('data-color')) && rgbToHex(hexToRgb(b.getAttribute('data-color')))) === hex; b.toggleAttribute('data-active', on); b.setAttribute('aria-pressed', String(on)); b.style.setProperty('--ck', readable(hexToRgb(b.getAttribute('data-color')) || rgb)); });
        if (hidden) hidden.value = hex;
        return hex;
      }
      var emitT = 0;
      function changed(final) {
        var hex = paint(document.activeElement === hexIn);
        R.emit(el, 'input', { value: hex, rgb: { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) }, hsv: hsv });
        clearTimeout(emitT);
        var fire = function () { if (hidden) try { hidden.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {} R.emit(el, 'change', { value: hex, rgb: { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) }, hsv: hsv }); };
        if (final) fire(); else emitT = setTimeout(fire, 120);
      }
      function setHex(h, final) { var c = hexToRgb(h); if (!c) return false; var nh = rgbToHsv(c); if (nh.s === 0 || nh.v === 0) nh.h = hsv.h; hsv = nh; changed(final); return true; }

      function drag(target, onMove) {
        return R.on(target, 'pointerdown', function (e) {
          if (e.button) return;
          e.preventDefault(); target.focus({ preventScroll: true });
          target.setAttribute('data-dragging', '');
          try { target.setPointerCapture(e.pointerId); } catch (err) {}
          var r = target.getBoundingClientRect();
          var mv = function (ev) { onMove(R.clamp((ev.clientX - r.left) / r.width, 0, 1), R.clamp((ev.clientY - r.top) / r.height, 0, 1)); };
          var up = function () { target.removeAttribute('data-dragging'); target.removeEventListener('pointermove', mv); target.removeEventListener('pointerup', up); target.removeEventListener('pointercancel', up); changed(true); };
          target.addEventListener('pointermove', mv); target.addEventListener('pointerup', up); target.addEventListener('pointercancel', up);
          mv(e);
        });
      }
      var offs = [
        drag(area, function (x, y) { hsv.s = x; hsv.v = 1 - y; changed(); }),
        drag(hue, function (x) { hsv.h = Math.min(359.9, x * 360); changed(); }),
        R.on(area, 'keydown', function (e) {
          var st = e.shiftKey ? .1 : .01, k = e.key;
          if (k === 'ArrowLeft') hsv.s = R.clamp(hsv.s - st, 0, 1); else if (k === 'ArrowRight') hsv.s = R.clamp(hsv.s + st, 0, 1);
          else if (k === 'ArrowUp') hsv.v = R.clamp(hsv.v + st, 0, 1); else if (k === 'ArrowDown') hsv.v = R.clamp(hsv.v - st, 0, 1); else return;
          e.preventDefault(); changed();
        }),
        R.on(hue, 'keydown', function (e) {
          var st = e.shiftKey ? 15 : 1, k = e.key;
          if (k === 'ArrowLeft' || k === 'ArrowDown') hsv.h = (hsv.h - st + 360) % 360; else if (k === 'ArrowRight' || k === 'ArrowUp') hsv.h = (hsv.h + st) % 360;
          else if (k === 'Home') hsv.h = 0; else if (k === 'End') hsv.h = 359; else return;
          e.preventDefault(); changed();
        }),
        R.on(hexIn, 'input', function () { var v = hexIn.value.trim(); if (v[0] !== '#') v = '#' + v; if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) setHex(v); }),
        R.on(hexIn, 'blur', function () { paint(); }),
        R.on(hexIn, 'keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); paint(); if (closeFn) { closeFn(); trigger.focus(); } } }),
        R.on(panel, 'click', '.color-swatch-btn', function (e, b) { setHex(b.getAttribute('data-color'), true); }),
        R.on(panel, 'click', '.color-eyedropper', function () {
          try { new window.EyeDropper().open().then(function (res) { setHex(res.sRGBHex, true); }, function () {}); } catch (e) {}
        })
      ];
      var closeFn = null;
      if (trigger) {
        offs.push(R.on(trigger, 'click', function () {
          if (closeFn) { closeFn(); return; }
          el.setAttribute('data-state', 'open'); trigger.setAttribute('aria-expanded', 'true');
          closeFn = F.float(panel, trigger, { placement: o.placement, offset: 6, onClose: function (why) { closeFn = null; el.setAttribute('data-state', 'closed'); trigger.setAttribute('aria-expanded', 'false'); if (why === 'escape') trigger.focus(); } });
          paint();
          setTimeout(function () { area.focus({ preventScroll: true }); }, 20);
        }));
        offs.push(R.on(panel, 'focusout', function (e) { if (closeFn && e.relatedTarget && !panel.contains(e.relatedTarget) && e.relatedTarget !== trigger) closeFn(); }));
      }
      paint();
      return {
        destroy: function () { if (closeFn) closeFn(); offs.forEach(function (f) { f(); }); if (!o.inline) panel.remove(); },
        get value() { return rgbToHex(rgb); },
        set value(v) { setHex(v, false); }
      };
    }
  });
  R.color = { hexToRgb: hexToRgb, rgbToHex: rgbToHex, rgbToHsv: rgbToHsv, hsvToRgb: hsvToRgb };
})(window.Ranj);

;
/* --- components/forms/combobox.js --- */
/* Combobox — editable input + filtered listbox (aria-activedescendant), create-new, async sources.
   v1 markup (.combobox > .combobox-input + .combobox-list > .combobox-option) still works. */
(function (R) {
  'use strict';
  var F = R._forms;

  function readItems(el) {
    var items = [];
    var data = el.getAttribute('data-options');
    if (data) { try { items = JSON.parse(data); } catch (e) {} }
    var ul = el.querySelector('.combobox-list');
    if (ul) {
      var group = '';
      R.$$('.combobox-option, .combobox-group', ul).forEach(function (li) {
        if (li.classList.contains('combobox-group')) { group = li.textContent.trim(); return; }
        items.push({
          value: li.getAttribute('data-value') || li.textContent.trim(), label: li.getAttribute('data-label') || li.textContent.trim(),
          desc: li.getAttribute('data-description') || '', icon: li.getAttribute('data-icon') || '', meta: li.getAttribute('data-meta') || '',
          disabled: li.hasAttribute('data-disabled') || li.getAttribute('aria-disabled') === 'true', group: li.getAttribute('data-group') || group,
          selected: li.hasAttribute('data-selected')
        });
      });
      ul.remove();
    }
    var dl = el.querySelector('datalist');
    if (dl) { R.$$('option', dl).forEach(function (op) { items.push({ value: op.value, label: op.label || op.value }); }); dl.remove(); }
    return items.map(function (it) { return typeof it === 'string' ? { value: it, label: it } : it; });
  }

  R.define('combobox', {
    selector: '.combobox',
    mount: function (el) {
      var o = R.opts(el, { name: '', create: false, strict: false, openOnFocus: true, debounce: 180, minChars: 0, empty: 'No results found.', placement: 'bottom-start' });
      var input = el.querySelector('.combobox-input, input:not([type="hidden"])');
      if (!input) return;
      input.classList.add('combobox-input');
      var wrap = input.closest('.input-wrap');
      if (!wrap || !el.contains(wrap)) {
        wrap = document.createElement('div');
        wrap.className = 'input-wrap combobox-wrap';
        ['input-sm', 'input-lg', 'input-filled'].forEach(function (c) { if (input.classList.contains(c)) { wrap.classList.add(c); input.classList.remove(c); } });
        input.classList.remove('input');
        input.parentNode.insertBefore(wrap, input);
        wrap.appendChild(input);
      }
      var toggle = wrap.querySelector('.combobox-toggle');
      if (!toggle && !el.hasAttribute('data-no-toggle')) {
        toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'input-btn combobox-toggle';
        toggle.tabIndex = -1; toggle.setAttribute('aria-label', 'Show options'); toggle.innerHTML = F.icons.chevronDown;
        wrap.appendChild(toggle);
      }
      var spinner = document.createElement('span'); spinner.className = 'input-icon combobox-spinner'; spinner.hidden = true; spinner.innerHTML = F.icons.spinner;
      wrap.insertBefore(spinner, toggle || null);

      var items = readItems(el), source = null, selected = items.filter(function (i) { return i.selected; })[0] || null;
      var hidden = F.hidden(el, o.name || null, selected ? selected.value : '');
      if (selected && !input.value) input.value = selected.label;

      var panel = document.createElement('div'); panel.className = 'combobox-list'; panel.hidden = true;
      var list = F.makeList(panel, { host: input, empty: o.empty, onPick: function (it) { pick(it); close(); } });
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-controls', panel.id);
      input.setAttribute('autocomplete', 'off');
      if (!input.hasAttribute('spellcheck')) input.spellcheck = false;

      var closeFn = null, req = 0, timer = 0;

      function build(q, base) {
        var arr = (base || items).map(function (it) {
          var c = {}; for (var k in it) c[k] = it[k];
          c.selected = !!selected && selected.value === it.value; return c;
        });
        var qt = (q || '').trim();
        if (o.create && qt && !arr.some(function (i) { return F.norm(i.label) === F.norm(qt); })) arr.push({ value: qt, label: qt, create: true });
        list.set(arr).render(q, base ? false : true);
        var first = list.shown().map(function (i) { return i.selected; }).indexOf(true);
        if (first > -1 && !qt) list.highlight(first); else if (qt || el.hasAttribute('data-autohighlight')) list.move('first'); else list.highlight(-1);
        el.toggleAttribute('data-empty', !list.shown().length);
      }
      function update() {
        var q = input.value;
        if (source) {
          clearTimeout(timer);
          if (q.trim().length < o.minChars) { list.set([]); list.render(''); panel.querySelector('.listbox-empty').textContent = 'Type ' + o.minChars + '+ characters to search'; return; }
          var my = ++req;
          spinner.hidden = false; el.setAttribute('data-loading', '');
          if (!list.shown().length) panel.innerHTML = '<div class="listbox-loading">' + F.icons.spinner + 'Searching…</div>';
          timer = setTimeout(function () {
            Promise.resolve(source(q)).then(function (res) {
              if (my !== req) return;
              spinner.hidden = true; el.removeAttribute('data-loading');
              build(q, (res || []).map(function (it) { return typeof it === 'string' ? { value: it, label: it } : it; }));
              if (closeFn) R.position(panel, wrap, { placement: o.placement, offset: 6 });
            }, function () { if (my === req) { spinner.hidden = true; el.removeAttribute('data-loading'); list.set([]); list.render(''); panel.querySelector('.listbox-empty').textContent = 'Couldn’t load results.'; } });
          }, o.debounce);
        } else build(q);
      }
      function open() {
        if (closeFn || input.disabled || input.readOnly) return;
        el.setAttribute('data-state', 'open');
        input.setAttribute('aria-expanded', 'true');
        update();
        closeFn = F.float(panel, wrap, { matchWidth: true, placement: o.placement, onClose: function () {
          closeFn = null; el.setAttribute('data-state', 'closed'); input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant');
        } });
      }
      function close() { if (closeFn) closeFn(); }
      function pick(it) {
        if (!it || it.disabled) return;
        var isNew = !!it.create;
        if (isNew) {
          it = { value: it.value, label: it.label };
          items.push(it);
          R.emit(el, 'create', { value: it.value, label: it.label });
        }
        selected = it;
        input.value = it.label;
        if (hidden) hidden.value = it.value;
        F.changed(el, { value: it.value, label: it.label, item: it, created: isNew }, null);
        try { input.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
      }
      function revert() {
        if (!o.strict) {
          if (selected && input.value !== selected.label) { selected = null; if (hidden) hidden.value = ''; }
          if (!selected && hidden && o.create === false) hidden.value = '';
          return;
        }
        var match = items.filter(function (i) { return F.norm(i.label) === F.norm(input.value.trim()); })[0];
        if (match) { if (!selected || selected.value !== match.value) pick(match); }
        else input.value = selected ? selected.label : '';
      }

      var offs = [
        R.on(input, 'input', function () { if (!closeFn) open(); else update(); }),
        R.on(input, 'focus', function () { if (o.openOnFocus && !el.__skipFocusOpen) open(); el.__skipFocusOpen = false; }),
        R.on(input, 'click', function () { open(); }),
        R.on(input, 'blur', function () { setTimeout(function () { if (document.activeElement !== input) { close(); revert(); } }, 0); }),
        R.on(input, 'keydown', function (e) {
          var k = e.key;
          if (k === 'ArrowDown' || k === 'ArrowUp') {
            e.preventDefault();
            if (!closeFn) { open(); if (k === 'ArrowUp') list.move('last'); return; }
            if (e.altKey && k === 'ArrowUp') { close(); return; }
            list.move(k === 'ArrowDown' ? 1 : -1);
          } else if (k === 'PageDown' && closeFn) { e.preventDefault(); list.move(8); }
          else if (k === 'PageUp' && closeFn) { e.preventDefault(); list.move(-8); }
          else if (k === 'Enter') {
            if (closeFn && list.current()) { e.preventDefault(); pick(list.current()); close(); }
            else if (closeFn && o.create && input.value.trim()) { e.preventDefault(); pick({ value: input.value.trim(), label: input.value.trim(), create: true }); close(); }
          } else if (k === 'Escape') {
            if (!closeFn && input.value) { e.preventDefault(); input.value = ''; selected = null; if (hidden) hidden.value = ''; F.changed(el, { value: '', label: '' }); }
          } else if (k === 'Tab' && closeFn) {
            if (list.current() && el.hasAttribute('data-autohighlight')) pick(list.current());
            close();
          }
        })
      ];
      if (toggle) offs.push(R.on(toggle, 'click', function () { if (closeFn) close(); else { el.__skipFocusOpen = true; input.focus(); open(); } }));

      var inst = {
        destroy: function () { close(); clearTimeout(timer); offs.forEach(function (f) { f(); }); panel.remove(); },
        open: open, close: close,
        setItems: function (arr) { items = arr.map(function (it) { return typeof it === 'string' ? { value: it, label: it } : it; }); if (closeFn) update(); },
        setSource: function (fn) { source = fn; },
        get value() { return selected ? selected.value : ''; },
        set value(v) { var m = items.filter(function (i) { return String(i.value) === String(v); })[0]; if (m) pick(m); else { selected = null; input.value = ''; if (hidden) hidden.value = ''; } }
      };
      return inst;
    }
  });

  /** Ranj.combobox(el, { source(query) → items|Promise, items: [] }) → instance */
  R.combobox = function (el, opts) {
    if (typeof el === 'string') el = document.querySelector(el);
    R.init(el.parentNode || el);
    var inst = R.instance(el, 'combobox');
    if (inst && opts) { if (opts.source) inst.setSource(opts.source); if (opts.items) inst.setItems(opts.items); }
    return inst;
  };
})(window.Ranj);

;
/* --- components/forms/custom-select.js --- */
/* Custom select — button + listbox popover that drives a hidden native <select> (forms submit natively) */
(function (R) {
  'use strict';
  var F = R._forms;

  function buildSelect(el) {
    var sel = el.querySelector('select');
    if (sel) return sel;
    sel = document.createElement('select');
    var data = [];
    try { data = JSON.parse(el.getAttribute('data-options') || '[]'); } catch (e) {}
    var groups = {};
    data.forEach(function (d) {
      if (typeof d === 'string') d = { value: d, label: d };
      var op = new Option(d.label || d.value, d.value == null ? d.label : d.value);
      if (d.icon) op.setAttribute('data-icon', d.icon);
      if (d.description) op.setAttribute('data-description', d.description);
      if (d.meta) op.setAttribute('data-meta', d.meta);
      if (d.disabled) op.disabled = true;
      if (d.selected) op.selected = op.defaultSelected = true;
      var parent = sel;
      if (d.group) { parent = groups[d.group]; if (!parent) { parent = groups[d.group] = document.createElement('optgroup'); parent.label = d.group; sel.appendChild(parent); } }
      parent.appendChild(op);
    });
    el.appendChild(sel);
    return sel;
  }

  R.define('custom-select', {
    selector: '.custom-select',
    mount: function (el) {
      var o = R.opts(el, { placeholder: 'Select…', search: false, searchPlaceholder: 'Search…', name: '', placement: 'bottom-start', empty: 'No results found.' });
      var sel = buildSelect(el);
      if (o.name && !sel.name) sel.name = o.name;
      var hasExplicit = R.$$('option', sel).some(function (op) { return op.hasAttribute('selected'); });
      if (!hasExplicit && el.hasAttribute('data-placeholder') && !R.$$('option', sel).some(function (op) { return op.value === ''; })) sel.selectedIndex = -1;
      sel.classList.add('f-sr'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true'); sel.setAttribute('data-f-native', '');

      var trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-select-trigger';
      trigger.setAttribute('role', 'combobox');
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      if (sel.getAttribute('aria-label')) trigger.setAttribute('aria-label', sel.getAttribute('aria-label'));
      if (el.getAttribute('aria-label')) trigger.setAttribute('aria-label', el.getAttribute('aria-label'));
      trigger.innerHTML = '<span class="custom-select-value"></span><span class="custom-select-caret">' + F.icons.chevronUpDown + '</span>';
      el.insertBefore(trigger, sel);
      var valueEl = trigger.firstChild;

      var panel = document.createElement('div');
      panel.className = 'custom-select-panel';
      panel.hidden = true;
      var header = null, search = null;
      if (o.search) {
        header = document.createElement('div'); header.className = 'listbox-search';
        header.innerHTML = F.icons.search + '<input type="text" autocomplete="off" spellcheck="false" aria-autocomplete="list" placeholder="' + R.esc(o.searchPlaceholder) + '">';
        search = header.querySelector('input');
        search.setAttribute('role', 'combobox');
        search.setAttribute('aria-expanded', 'true');
        search.setAttribute('aria-label', o.searchPlaceholder);
      }
      var list = F.makeList(panel, { host: search || trigger, empty: o.empty, header: header, onPick: function (it) { choose(it); close(); trigger.focus(); } });
      trigger.setAttribute('aria-controls', panel.id);
      if (search) search.setAttribute('aria-controls', panel.id);

      var closeFn = null, ta = F.typeahead();

      function refresh() {
        var items = F.itemsFromSelect(sel);
        list.set(items);
        var cur = items.filter(function (i) { return i.selected; })[0];
        if (cur) {
          valueEl.innerHTML = (cur.icon ? '<span class="custom-select-icon">' + cur.icon + '</span>' : '') + '<span class="custom-select-label">' + R.esc(cur.label) + '</span>';
          el.removeAttribute('data-placeholder-shown');
        } else {
          valueEl.innerHTML = '<span class="custom-select-label">' + R.esc(o.placeholder) + '</span>';
          el.setAttribute('data-placeholder-shown', '');
        }
        trigger.disabled = sel.disabled;
        el.toggleAttribute('data-disabled', sel.disabled);
        return items;
      }
      function choose(it) {
        if (!it || it.disabled) return;
        var changedNow = sel.value !== it.value || sel.selectedIndex < 0;
        it.option.selected = true;
        refresh();
        if (changedNow) {
          try { sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
          R.emit(el, 'change', { value: it.value, label: it.label });
        }
      }
      function open() {
        if (closeFn || sel.disabled) return;
        refresh();
        list.render('');
        el.setAttribute('data-state', 'open');
        trigger.setAttribute('aria-expanded', 'true');
        closeFn = F.float(panel, trigger, { matchWidth: true, placement: o.placement, onClose: function () {
          closeFn = null; el.setAttribute('data-state', 'closed'); trigger.setAttribute('aria-expanded', 'false'); trigger.removeAttribute('aria-activedescendant');
          if (search && document.activeElement === search) trigger.focus();
        } });
        var si = list.shown().map(function (i) { return i.selected; }).indexOf(true);
        if (si > -1) list.highlight(si); else list.move('first');
        if (search) { search.value = ''; setTimeout(function () { search.focus(); }, 0); }
      }
      function close() { if (closeFn) closeFn(); }

      function onKey(e) {
        var k = e.key, isOpen = !!closeFn;
        if (!isOpen) {
          if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') { e.preventDefault(); open(); if (k === 'ArrowUp' && list.index() < 0) list.move('last'); return; }
          if (k === 'Home' || k === 'End') { e.preventDefault(); refresh(); list.render(''); list.move(k === 'Home' ? 'first' : 'last'); choose(list.current()); return; }
          if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            refresh(); list.render('');
            var si = list.shown().map(function (i) { return i.selected; }).indexOf(true); list.highlight(si, false);
            if (list.seek(ta(k)) > -1) choose(list.current());
          }
          return;
        }
        if (k === 'ArrowDown') { e.preventDefault(); if (e.altKey) return; list.move(1); }
        else if (k === 'ArrowUp') { e.preventDefault(); if (e.altKey) { choose(list.current()); close(); return; } list.move(-1); }
        else if (k === 'Home' && e.currentTarget !== search) { e.preventDefault(); list.move('first'); }
        else if (k === 'End' && e.currentTarget !== search) { e.preventDefault(); list.move('last'); }
        else if (k === 'PageDown') { e.preventDefault(); list.move(8); }
        else if (k === 'PageUp') { e.preventDefault(); list.move(-8); }
        else if (k === 'Enter' || (k === ' ' && e.currentTarget !== search)) { e.preventDefault(); choose(list.current()); close(); trigger.focus(); }
        else if (k === 'Tab') { choose(list.current()); close(); }
        else if (k.length === 1 && e.currentTarget !== search && !e.metaKey && !e.ctrlKey) { list.seek(ta(k)); }
      }

      var offs = [
        R.on(trigger, 'click', function () { if (closeFn) close(); else open(); }),
        R.on(trigger, 'keydown', onKey),
        R.on(sel, 'change', function () { if (!closeFn) refresh(); }),
        R.on(sel.form || el, 'reset', function () { setTimeout(refresh, 0); })
      ];
      if (search) {
        offs.push(R.on(search, 'keydown', onKey));
        offs.push(R.on(search, 'input', function () { list.render(search.value); list.move('first'); }));
      }
      // Label click focuses the trigger
      var lab = sel.id && document.querySelector('label[for="' + sel.id + '"]');
      if (lab) { lab.htmlFor = R.ensureId(trigger, 'cs'); }
      refresh();

      return {
        destroy: function () { close(); offs.forEach(function (f) { f(); }); panel.remove(); },
        open: open, close: close, refresh: refresh,
        get value() { return sel.value; },
        set value(v) { sel.value = v; refresh(); }
      };
    }
  });
})(window.Ranj);

;
/* --- components/forms/date-picker.js --- */
/* Date picker — input + calendar popover (single or range), presets, typed dates, hidden ISO inputs */
(function (R) {
  'use strict';
  var F = R._forms;

  function presetsFor(mode, C) {
    var t = C.d0(new Date());
    if (mode === 'range') {
      var som = new Date(t.getFullYear(), t.getMonth(), 1);
      return [
        { label: 'Today', value: [t, t] },
        { label: 'Yesterday', value: [C.addDays(t, -1), C.addDays(t, -1)] },
        { label: 'Last 7 days', value: [C.addDays(t, -6), t] },
        { label: 'Last 30 days', value: [C.addDays(t, -29), t] },
        { label: 'This month', value: [som, new Date(t.getFullYear(), t.getMonth() + 1, 0)] },
        { label: 'Last month', value: [new Date(t.getFullYear(), t.getMonth() - 1, 1), new Date(t.getFullYear(), t.getMonth(), 0)] },
        { label: 'Year to date', value: [new Date(t.getFullYear(), 0, 1), t] }
      ];
    }
    return [
      { label: 'Today', value: t },
      { label: 'Tomorrow', value: C.addDays(t, 1) },
      { label: 'In 3 days', value: C.addDays(t, 3) },
      { label: 'Next week', value: C.addDays(t, 7) },
      { label: 'In a month', value: C.addMonths(t, 1) }
    ];
  }

  R.define('date-picker', {
    selector: '.date-picker',
    mount: function (el) {
      var C = R._cal;
      var o = R.opts(el, { mode: 'single', value: '', min: '', max: '', disabled: '', weekStart: 0, months: 0, locale: '', name: '', nameStart: '', nameEnd: '',
        presets: false, placeholder: '', format: 'medium', closeOnSelect: true, placement: 'bottom-start', noGaps: false });
      var range = o.mode === 'range';
      var input = el.querySelector('input:not([type="hidden"])');
      var wrap = input && input.closest('.input-wrap');
      if (!input) {
        el.insertAdjacentHTML('afterbegin', '<div class="input-wrap"><span class="input-icon">' + F.icons.calendar + '</span><input type="text"></div>');
        input = el.querySelector('input'); wrap = input.parentNode;
      } else if (!wrap) {
        wrap = document.createElement('div'); wrap.className = 'input-wrap';
        input.classList.remove('input'); input.parentNode.insertBefore(wrap, input); wrap.appendChild(input);
        wrap.insertAdjacentHTML('afterbegin', '<span class="input-icon">' + F.icons.calendar + '</span>');
      }
      var trigger = document.createElement('button');
      trigger.type = 'button'; trigger.className = 'input-btn date-picker-trigger';
      trigger.setAttribute('aria-label', range ? 'Choose dates' : 'Choose date');
      trigger.setAttribute('aria-haspopup', 'dialog'); trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = F.icons.chevronDown;
      wrap.appendChild(trigger);
      input.autocomplete = 'off';
      input.setAttribute('data-picker', '');
      if (range) input.readOnly = true;
      if (!input.placeholder) input.placeholder = o.placeholder || (range ? 'Pick a date range' : 'Pick a date');
      if (input.name && !o.name) { o.name = input.name; input.removeAttribute('name'); }
      var hA = null, hB = null;
      if (range) { hA = F.hidden(el, o.nameStart || (o.name ? o.name + '_start' : null)); hB = F.hidden(el, o.nameEnd || (o.name ? o.name + '_end' : null)); }
      else hA = F.hidden(el, o.name || null);

      var fmt = new Intl.DateTimeFormat(o.locale || undefined, o.format === 'long' ? { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' } : o.format === 'short' ? { month: 'numeric', day: 'numeric', year: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' });
      var fmtNoYear = new Intl.DateTimeFormat(o.locale || undefined, { month: 'short', day: 'numeric' });
      var value = range ? (o.value ? o.value.split(/[,/]/).map(C.parse).filter(Boolean) : []) : (o.value ? C.parse(o.value) : (input.value ? C.parse(input.value) : null));

      function text() {
        if (!range) return value ? fmt.format(value) : '';
        if (!value[0]) return '';
        if (!value[1]) return fmt.format(value[0]) + ' – …';
        if (C.same(value[0], value[1])) return fmt.format(value[0]);
        var sameYear = value[0].getFullYear() === value[1].getFullYear();
        return (sameYear && o.format === 'medium' ? fmtNoYear.format(value[0]) : fmt.format(value[0])) + ' – ' + fmt.format(value[1]);
      }
      function sync() {
        input.value = text();
        if (range) { if (hA) hA.value = C.iso(value[0]); if (hB) hB.value = C.iso(value[1]); }
        else if (hA) hA.value = C.iso(value);
        el.toggleAttribute('data-has-value', range ? !!value[0] : !!value);
      }
      function commit() {
        sync();
        var detail = range ? { value: [C.iso(value[0]), C.iso(value[1])], date: value.slice() } : { value: C.iso(value), date: value };
        if (hA) try { hA.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
        R.emit(el, 'change', detail);
      }

      // Panel
      var panel = document.createElement('div');
      panel.className = 'picker-popover date-picker-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', range ? 'Choose date range' : 'Choose date');
      panel.hidden = true;
      var presets = o.presets ? presetsFor(o.mode, C) : null;
      if (el.__presets) presets = el.__presets;
      var calHost = document.createElement('div'); calHost.setAttribute('data-manual', '');
      var side = null, foot = null;
      if (presets) {
        side = document.createElement('div'); side.className = 'date-picker-presets';
        side.innerHTML = presets.map(function (p, i) { return '<button type="button" data-preset="' + i + '">' + R.esc(p.label) + '</button>'; }).join('');
        panel.appendChild(side);
      }
      var main = document.createElement('div'); main.className = 'date-picker-main';
      main.appendChild(calHost);
      if (range) {
        foot = document.createElement('div'); foot.className = 'date-picker-foot';
        foot.innerHTML = '<span class="date-picker-summary"></span><div class="date-picker-actions"><button type="button" class="picker-btn" data-dp-clear>Clear</button><button type="button" class="picker-btn picker-btn-primary" data-dp-apply>Apply</button></div>';
        main.appendChild(foot);
      }
      panel.appendChild(main);
      if (presets) panel.setAttribute('data-presets', '');

      var cal = null, closeFn = null, draft = null;
      function summary() {
        if (!foot) return;
        var s = foot.querySelector('.date-picker-summary'), d = draft || [];
        if (!d[0]) s.textContent = 'Select a start date';
        else if (!d[1]) s.textContent = fmt.format(d[0]) + ' – select end';
        else { var n = Math.round((d[1] - d[0]) / 864e5) + 1; s.textContent = n + ' day' + (n === 1 ? '' : 's') + ' selected'; }
        foot.querySelector('[data-dp-apply]').disabled = !(d[0] && d[1]);
      }
      function markPreset() {
        if (!side) return;
        R.$$('[data-preset]', side).forEach(function (b, i) {
          var p = presets[i].value, cur = range ? draft || value : value;
          var on = range ? (cur && cur[0] && cur[1] && C.same(p[0], cur[0]) && C.same(p[1], cur[1])) : C.same(p, cur);
          b.toggleAttribute('data-active', !!on);
        });
      }
      function months() { return o.months || (range && window.innerWidth >= 720 ? 2 : 1); }
      function open(focusGrid) {
        if (closeFn || input.disabled) return;
        draft = range ? value.slice() : null;
        calHost.innerHTML = '';
        cal = C.create(calHost, {
          mode: o.mode, value: range ? value.map(C.iso) : C.iso(value), min: o.min || null, max: o.max || null, disabled: el.__disabledFn || o.disabled || null,
          weekStart: o.weekStart, months: months(), locale: o.locale || undefined, noGaps: o.noGaps,
          onChange: function (d) {
            if (range) {
              draft = d.date.slice(); summary(); markPreset();
              if (d.complete && el.hasAttribute('data-auto-apply')) { value = draft.slice(); commit(); setTimeout(close, 180); }
            } else {
              value = d.date; commit(); markPreset();
              if (o.closeOnSelect) setTimeout(function () { close(); input.focus(); }, R.reducedMotion ? 0 : 120);
            }
          }
        });
        summary(); markPreset();
        el.setAttribute('data-state', 'open');
        trigger.setAttribute('aria-expanded', 'true');
        closeFn = F.float(panel, wrap, { placement: o.placement, offset: 6, onClose: function (why) {
          closeFn = null; el.setAttribute('data-state', 'closed'); trigger.setAttribute('aria-expanded', 'false');
          if (why === 'escape') input.focus();
        } });
        if (focusGrid) setTimeout(function () { cal.focus(); }, 20);
      }
      function close() { if (closeFn) closeFn('close'); }

      function parseTyped(str) {
        str = str.trim(); if (!str) return null;
        var d = C.parse(str);
        if (!d) { var m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/.exec(str); if (m) { var y = +m[3]; if (y < 100) y += 2000; d = new Date(y, +m[1] - 1, +m[2]); } }
        if (d && !isNaN(d) && d.getFullYear() < 1000) d = null;
        return d && !isNaN(d) ? d : null;
      }

      var offs = [
        R.on(trigger, 'click', function () { if (closeFn) close(); else open(true); }),
        R.on(input, 'click', function () { if (range || el.hasAttribute('data-open-on-click')) open(false); }),
        R.on(input, 'keydown', function (e) {
          if ((e.key === 'ArrowDown' && (e.altKey || range || closeFn)) || (range && (e.key === 'Enter' || e.key === ' '))) { e.preventDefault(); if (!closeFn) open(true); else cal.focus(); }
          else if (e.key === 'Enter' && !range) { var d = parseTyped(input.value); if (d && !(cal && cal.isDisabled(d))) { value = d; commit(); } else sync(); }
        }),
        R.on(input, 'blur', function () {
          if (range) return;
          setTimeout(function () {
            if (panel.contains(document.activeElement)) return;
            var d = parseTyped(input.value);
            if (input.value.trim() === '') { if (value) { value = null; commit(); } }
            else if (d && (!value || !C.same(d, value))) { value = d; commit(); }
            else sync();
          }, 0);
        }),
        R.on(panel, 'click', function (e) {
          var p = e.target.closest('[data-preset]');
          if (p) {
            var v = presets[+p.getAttribute('data-preset')].value;
            if (range) { draft = v.slice(); cal.set(draft.map(C.iso), true); cal.goTo(draft[0]); value = draft.slice(); commit(); summary(); markPreset(); setTimeout(close, R.reducedMotion ? 0 : 160); }
            else { value = v; commit(); setTimeout(function () { close(); input.focus(); }, R.reducedMotion ? 0 : 120); }
            return;
          }
          if (e.target.closest('[data-dp-clear]')) { draft = []; cal.set([], true); value = []; commit(); summary(); markPreset(); }
          if (e.target.closest('[data-dp-apply]')) { if (draft && draft[1]) { value = draft.slice(); commit(); } close(); input.focus(); }
        }),
        R.on(panel, 'focusout', function (e) {
          if (!e.relatedTarget) return;
          if (!panel.contains(e.relatedTarget) && !wrap.contains(e.relatedTarget)) close();
        })
      ];
      sync();
      return {
        destroy: function () { close(); offs.forEach(function (f) { f(); }); panel.remove(); },
        open: function () { open(true); }, close: close,
        get value() { return range ? value.map(C.iso) : C.iso(value); },
        set value(v) { value = range ? [].concat(v || []).map(C.parse).filter(Boolean) : C.parse(v); sync(); },
        setDisabled: function (fn) { el.__disabledFn = fn; }
      };
    }
  });

  /** Ranj.datePicker(el) → instance { value, open(), close(), setDisabled(fn) }. Set el.__presets = [{label, value}] before mount for custom presets. */
  R.datePicker = function (el) { if (typeof el === 'string') el = document.querySelector(el); return R.instance(el, 'date-picker'); };
})(window.Ranj);

;
/* --- components/forms/field.js --- */
/* Field — aria wiring (label/hint/error) and Ranj.validate(form) built on native constraint validation */
(function (R) {
  'use strict';
  var F = R._forms;
  var ERR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5.2M12 16.3v.2"/></svg>';
  var CONTROL = 'input:not([type="hidden"]):not([data-f-hidden]), select, textarea';
  var VISIBLE = '[data-field-control], .custom-select-trigger, .combobox-input, .multi-select-input, .tag-input-field, .otp-slot, [role="slider"], [role="switch"], ' + CONTROL;

  function labelOf(field) { return field.querySelector(':scope > .label, :scope > .field-row > .label, :scope > .field-label-block > .label, :scope > label:not(.checkbox):not(.radio):not(.switch):not(.radio-card):not(.checkbox-card)'); }
  function visibleControl(field) {
    var list = R.$$(VISIBLE, field).filter(function (c) {
      if (c.classList.contains('f-sr') || c.getAttribute('aria-hidden') === 'true' || c.hasAttribute('data-f-native')) return false;
      if (c.type === 'file' && c.closest('.dropzone')) return false;
      return true;
    });
    return list[0] || null;
  }
  function natives(root) {
    return R.$$(CONTROL, root).filter(function (c) { return !c.disabled && c.willValidate !== false && !c.closest('fieldset[disabled]'); });
  }

  function wire(field) {
    var label = labelOf(field), ctrl = visibleControl(field);
    var hint = field.querySelector(':scope > .field-hint, :scope > .field-label-block > .field-hint, :scope > .field-row ~ .field-hint');
    var err = field.querySelector('.field-error');
    var group = R.$$('input[type="checkbox"], input[type="radio"]', field).length > 1;
    if (label) R.ensureId(label, 'lbl');
    if (hint) R.ensureId(hint, 'hint');
    if (err) { R.ensureId(err, 'err'); err.setAttribute('aria-live', 'polite'); }
    if (group) {
      if (!field.hasAttribute('role')) field.setAttribute('role', 'group');
      if (label) field.setAttribute('aria-labelledby', label.id);
      return;
    }
    if (!ctrl) return;
    var labelable = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(ctrl.tagName);
    if (label) {
      if (label.tagName === 'LABEL' && labelable && !label.htmlFor && !label.contains(ctrl)) label.htmlFor = R.ensureId(ctrl, 'ctl');
      else if (!labelable && !ctrl.hasAttribute('aria-labelledby') && !ctrl.hasAttribute('aria-label')) ctrl.setAttribute('aria-labelledby', label.id);
      else if (ctrl.tagName === 'BUTTON' && !ctrl.hasAttribute('aria-labelledby')) {
        ctrl.setAttribute('aria-labelledby', label.id + ' ' + R.ensureId(ctrl, 'ctl'));
      }
    }
    var ids = (ctrl.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    [hint, err].forEach(function (x) { if (x && ids.indexOf(x.id) < 0) ids.push(x.id); });
    if (ids.length) ctrl.setAttribute('aria-describedby', ids.join(' '));
    var nat = natives(field)[0];
    if (label && nat && nat.required && !label.classList.contains('label-required')) label.setAttribute('data-required', '');
    if (err && err.textContent.trim()) { field.setAttribute('data-invalid', ''); ctrl.setAttribute('aria-invalid', 'true'); }
  }

  function message(c) {
    var v = c.validity, d = function (k) { return c.getAttribute('data-error-' + k) || c.getAttribute('data-error'); };
    var name = (c.getAttribute('data-label') || '').trim();
    if (v.valueMissing) return d('required') || (c.type === 'checkbox' ? 'Please check this box to continue.' : c.tagName === 'SELECT' ? 'Please choose an option.' : (name ? name + ' is required.' : 'This field is required.'));
    if (v.typeMismatch) return d('type') || (c.type === 'email' ? 'Enter a valid email, like name@company.com.' : c.type === 'url' ? 'Enter a full URL, like https://example.com.' : c.validationMessage);
    if (v.tooShort) return d('minlength') || 'Use at least ' + c.minLength + ' characters (you have ' + c.value.length + ').';
    if (v.tooLong) return d('maxlength') || 'Use ' + c.maxLength + ' characters or fewer.';
    if (v.rangeUnderflow) return d('min') || 'Must be ' + c.min + ' or more.';
    if (v.rangeOverflow) return d('max') || 'Must be ' + c.max + ' or less.';
    if (v.stepMismatch) return d('step') || c.validationMessage;
    if (v.patternMismatch) return d('pattern') || c.title || 'Please match the requested format.';
    if (v.customError) return c.validationMessage;
    return c.validationMessage;
  }

  function errorEl(field, create) {
    var e = field.querySelector('.field-error');
    if (!e && create) {
      e = document.createElement('p'); e.className = 'field-error';
      e.setAttribute('aria-live', 'polite'); R.ensureId(e, 'err');
      field.appendChild(e);
      var c = visibleControl(field);
      if (c) { var ids = (c.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean); ids.push(e.id); c.setAttribute('aria-describedby', ids.join(' ')); }
    }
    return e;
  }

  function setError(target, msg, opts) {
    opts = opts || {};
    var field = target.classList && target.classList.contains('field') ? target : target.closest('.field');
    var ctrls = field ? natives(field) : [target];
    var vis = field ? visibleControl(field) : target;
    if (msg) {
      if (field) {
        var wasInvalid = field.hasAttribute('data-invalid');
        field.setAttribute('data-invalid', '');
        var e = errorEl(field, true);
        if (e.__msg !== msg) { e.innerHTML = ERR_ICON + '<span>' + R.esc(msg) + '</span>'; e.__msg = msg; e.removeAttribute('data-live'); void e.offsetWidth; e.setAttribute('data-live', ''); }
        if (opts.shake !== false && (!wasInvalid || opts.shake)) F.shake(shakeTarget(field, vis));
      }
      ctrls.forEach(function (c) { c.setAttribute('aria-invalid', 'true'); });
      if (vis) vis.setAttribute('aria-invalid', 'true');
      var box = vis && vis.closest('.custom-select, .combobox, .multi-select, .tag-input, .otp, .date-picker, .time-picker');
      if (box) box.setAttribute('aria-invalid', 'true');
    } else {
      if (field) {
        field.removeAttribute('data-invalid');
        var e2 = errorEl(field, false); if (e2) { e2.innerHTML = ''; e2.__msg = ''; }
        R.$$('[aria-invalid="true"]', field).forEach(function (x) { x.removeAttribute('aria-invalid'); });
      } else ctrls.forEach(function (c) { c.removeAttribute('aria-invalid'); });
    }
  }
  function shakeTarget(field, vis) {
    if (!vis) return field;
    var n = vis;
    while (n.parentElement && n.parentElement !== field) n = n.parentElement;
    return n.parentElement === field ? n : vis;
  }

  /** Validate one field (or bare control). Returns true when valid. */
  function check(target, opts) {
    var field = target.classList && target.classList.contains('field') ? target : null;
    var ctrls = field ? natives(field) : [target];
    var msg = '';
    for (var i = 0; i < ctrls.length && !msg; i++) {
      var c = ctrls[i];
      var match = c.getAttribute('data-match');
      if (match) {
        var other = (c.form || document).querySelector(match);
        c.setCustomValidity(other && c.value && other.value !== c.value ? (c.getAttribute('data-error-match') || 'These don’t match.') : '');
      }
      if (c.checkValidity && !c.checkValidity()) msg = message(c);
    }
    if (!msg && field) {
      var req = field.querySelector('[data-required]:not(.label)');
      if (req) {
        var hid = R.$$('input[type="hidden"]', req).filter(function (h) { return h.value; });
        if (!hid.length) msg = req.getAttribute('data-error-required') || req.getAttribute('data-error') || 'This field is required.';
      }
    }
    setError(field || target, msg, opts);
    return !msg;
  }

  /** Ranj.validate(form, { focus: true, shake: true }) → boolean */
  R.validate = function (form, opts) {
    opts = opts || {};
    if (typeof form === 'string') form = document.querySelector(form);
    if (!form) return true;
    var ok = true, first = null;
    var fields = R.$$('.field', form);
    fields.forEach(function (f) {
      if (f.closest('fieldset[disabled]')) return;
      if (!natives(f).length && !f.querySelector('[data-required]:not(.label)')) return;
      if (!check(f, { shake: opts.shake })) { ok = false; if (!first) first = f; }
    });
    natives(form).forEach(function (c) {
      if (c.closest('.field')) return;
      if (!check(c, opts)) { ok = false; if (!first) first = c; }
    });
    if (!ok && opts.focus !== false && first) {
      var v = first.classList && first.classList.contains('field') ? visibleControl(first) : first;
      if (v && v.focus) try { v.focus({ preventScroll: false }); } catch (e) {}
    }
    form.setAttribute('data-validated', '');
    R.emit(form, ok ? 'valid' : 'invalid', {});
    return ok;
  };
  R.fieldError = function (el, msg) { setError(el, msg, { shake: true }); };
  R.validateField = function (el) { return check(el); };

  R.define('field', {
    selector: '.field',
    mount: function (field) { wire(field); }
  });

  R.define('form-validate', {
    selector: 'form[data-validate]',
    mount: function (form) {
      form.noValidate = true;
      var offs = [];
      offs.push(R.on(form, 'submit', function (e) {
        if (!R.validate(form)) { e.preventDefault(); e.stopImmediatePropagation(); }
      }));
      function live(e) {
        var field = e.target.closest && e.target.closest('.field');
        if (!field || !form.contains(field)) return;
        if (form.hasAttribute('data-validated') || field.hasAttribute('data-invalid') || (e.type === 'focusout' && field.hasAttribute('data-touched'))) check(field, { shake: false });
      }
      offs.push(R.on(form, 'input', function (e) { var f = e.target.closest && e.target.closest('.field'); if (f) { f.setAttribute('data-touched', ''); if (f.hasAttribute('data-invalid')) check(f, { shake: false }); } }));
      offs.push(R.on(form, 'change', live));
      offs.push(R.on(form, 'ranj:change', live));
      offs.push(R.on(form, 'focusout', function (e) {
        var f = e.target.closest && e.target.closest('.field');
        if (f && !f.contains(e.relatedTarget) && f.hasAttribute('data-touched')) check(f, { shake: false });
      }));
      offs.push(R.on(form, 'reset', function () {
        form.removeAttribute('data-validated');
        R.$$('.field', form).forEach(function (f) { f.removeAttribute('data-touched'); setError(f, ''); });
      }));
      return function () { offs.forEach(function (o) { o(); }); };
    }
  });
})(window.Ranj);

;
/* --- components/forms/file-upload.js --- */
/* File upload — dropzone (drag-over state, click/keyboard to browse), file list with previews, sizes, remove,
   simulated progress, accept / max-size / max-files validation. Keeps input.files in sync so forms submit natively. */
(function (R) {
  'use strict';
  var F = R._forms;

  function parseSize(s) {
    if (!s) return 0;
    var m = String(s).trim().match(/^([\d.]+)\s*(b|kb|mb|gb)?$/i); if (!m) return parseFloat(s) || 0;
    var n = parseFloat(m[1]), u = (m[2] || 'b').toLowerCase();
    return n * ({ b: 1, kb: 1024, mb: 1048576, gb: 1073741824 })[u];
  }
  function human(b) {
    if (b < 1024) return b + ' B';
    var u = ['KB', 'MB', 'GB'], i = -1;
    do { b /= 1024; i++; } while (b >= 1024 && i < 2);
    return (b >= 100 ? Math.round(b) : b.toFixed(1)) + ' ' + u[i];
  }
  function accepts(file, accept) {
    if (!accept) return true;
    var name = file.name.toLowerCase(), type = (file.type || '').toLowerCase();
    return accept.split(',').some(function (a) {
      a = a.trim().toLowerCase(); if (!a) return false;
      if (a[0] === '.') return name.slice(-a.length) === a;
      if (/\/\*$/.test(a)) return type.indexOf(a.slice(0, -1)) === 0;
      return type === a;
    });
  }
  function ext(name) { var m = /\.([a-z0-9]{1,5})$/i.exec(name); return m ? m[1].toUpperCase() : 'FILE'; }
  function kind(file) {
    var t = file.type || '';
    if (/^image\//.test(t)) return 'image';
    if (/pdf/.test(t) || /\.pdf$/i.test(file.name)) return 'pdf';
    if (/^video\//.test(t)) return 'video';
    if (/^audio\//.test(t)) return 'audio';
    if (/zip|compressed|tar/.test(t) || /\.(zip|rar|7z|gz)$/i.test(file.name)) return 'archive';
    if (/sheet|excel|csv/.test(t) || /\.(xlsx?|csv)$/i.test(file.name)) return 'sheet';
    return 'doc';
  }

  R.define('dropzone', {
    selector: '.dropzone',
    mount: function (el) {
      var input = el.querySelector('input[type="file"]');
      if (!input) { input = document.createElement('input'); input.type = 'file'; el.appendChild(input); }
      var o = R.opts(el, { maxSize: '', maxFiles: 0, simulate: false, list: '', accept: '' });
      var accept = o.accept || input.accept || '';
      var maxSize = parseSize(o.maxSize), multi = input.multiple, maxFiles = multi ? o.maxFiles : 1;
      var imageMode = el.classList.contains('dropzone-image');
      input.classList.add('f-sr'); input.tabIndex = -1; input.setAttribute('aria-hidden', 'true');
      if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
      el.setAttribute('role', 'button');
      if (!el.hasAttribute('aria-label')) {
        var t = el.querySelector('.dropzone-title');
        el.setAttribute('aria-label', (t ? t.textContent.trim() + '. ' : '') + 'Press Enter to browse' + (accept ? ' (' + accept + ')' : '') + '.');
      }
      var list = o.list ? document.querySelector(o.list) : null;
      var ownList = false;
      if (!list && !imageMode) { list = document.createElement('ul'); list.className = 'file-list'; ownList = true; el.insertAdjacentElement('afterend', list); }
      if (list) { list.setAttribute('aria-live', 'polite'); list.setAttribute('aria-label', 'Selected files'); }
      var preview = imageMode ? (el.querySelector('.dropzone-preview') || (function () { var p = document.createElement('div'); p.className = 'dropzone-preview'; el.appendChild(p); return p; })()) : null;
      var entries = [];   // { file, url, row, pct, status, error, timer }
      var dragDepth = 0;

      function syncInput() {
        try {
          var dt = new DataTransfer();
          entries.forEach(function (e) { if (!e.error) dt.items.add(e.file); });
          input.files = dt.files;
        } catch (err) {}
        el.toggleAttribute('data-has-files', entries.some(function (e) { return !e.error; }));
        R.emit(el, 'change', { files: entries.filter(function (e) { return !e.error; }).map(function (e) { return e.file; }) });
      }
      function rowHTML(e) {
        var f = e.file, k = kind(f);
        var thumb = e.url ? '<img src="' + e.url + '" alt="">' : '<span class="file-ext" data-kind="' + k + '">' + R.esc(ext(f.name)) + '</span>';
        return '<div class="file-thumb">' + thumb + '</div>' +
          '<div class="file-main"><div class="file-top"><span class="file-name" title="' + R.esc(f.name) + '">' + R.esc(f.name) + '</span>' +
          '<span class="file-size">' + human(f.size) + '</span></div>' +
          (e.error ? '<div class="file-error">' + R.esc(e.error) + '</div>' :
            '<div class="file-progress"' + (o.simulate ? '' : ' hidden') + '><div class="file-bar"><span></span></div><span class="file-pct">0%</span></div>') +
          '</div>' +
          '<button type="button" class="file-remove" aria-label="Remove ' + R.esc(f.name) + '">' + F.icons.x + '</button>';
      }
      function progress(e, pct, status) {
        e.pct = pct; if (status) e.status = status;
        if (!e.row) return;
        var bar = e.row.querySelector('.file-bar span'), txt = e.row.querySelector('.file-pct'), wrap = e.row.querySelector('.file-progress');
        if (wrap) wrap.hidden = false;
        if (bar) bar.style.transform = 'scaleX(' + pct / 100 + ')';
        if (txt) txt.textContent = e.status === 'done' ? 'Uploaded' : Math.round(pct) + '%';
        e.row.setAttribute('data-status', e.status || 'uploading');
      }
      function simulate(e) {
        var pct = 0;
        e.status = 'uploading';
        e.timer = setInterval(function () {
          pct = Math.min(100, pct + Math.random() * 18 + 4 * (1 + 1e6 / Math.max(e.file.size, 2e5)) / 3);
          if (pct >= 100) { clearInterval(e.timer); progress(e, 100, 'done'); R.emit(el, 'uploaded', { file: e.file }); }
          else progress(e, pct, 'uploading');
        }, R.reducedMotion ? 30 : 220);
      }
      function add(files) {
        var arr = [].slice.call(files || []);
        if (!multi) { clear(true); arr = arr.slice(0, 1); }
        arr.forEach(function (f) {
          var e = { file: f, url: null, pct: 0, status: 'ready', error: '' };
          var valid = entries.filter(function (x) { return !x.error; }).length;
          if (!accepts(f, accept)) e.error = 'File type not allowed' + (accept ? ' — use ' + accept.replace(/,/g, ', ') : '');
          else if (maxSize && f.size > maxSize) e.error = 'Too large — max ' + human(maxSize);
          else if (maxFiles && valid >= maxFiles) e.error = 'Limit reached — up to ' + maxFiles + ' files';
          else if (entries.some(function (x) { return !x.error && x.file.name === f.name && x.file.size === f.size; })) e.error = 'Already added';
          if (!e.error && /^image\//.test(f.type) && window.URL && URL.createObjectURL) e.url = URL.createObjectURL(f);
          if (e.error) R.emit(el, 'reject', { file: f, reason: e.error });
          entries.push(e);
          if (list) {
            var li = document.createElement('li'); li.className = 'file-item'; if (e.error) li.setAttribute('data-error', '');
            li.innerHTML = rowHTML(e); e.row = li; list.appendChild(li);
          }
          if (imageMode && !e.error) { preview.innerHTML = '<img src="' + e.url + '" alt="">'; el.setAttribute('data-has-preview', ''); }
          if (!e.error && o.simulate) simulate(e);
        });
        if (arr.some(function (f) { return entries.filter(function (x) { return x.file === f && x.error; }).length; })) F.shake(el);
        syncInput();
      }
      function removeEntry(e) {
        var i = entries.indexOf(e); if (i < 0) return;
        clearInterval(e.timer);
        if (e.url) URL.revokeObjectURL(e.url);
        entries.splice(i, 1);
        if (e.row) {
          var row = e.row;
          if (R.reducedMotion) row.remove();
          else { row.style.height = row.offsetHeight + 'px'; row.setAttribute('data-leaving', ''); void row.offsetHeight; row.style.height = '0px'; setTimeout(function () { row.remove(); }, 260); }
        }
        if (imageMode) { preview.innerHTML = ''; el.removeAttribute('data-has-preview'); }
        syncInput();
      }
      function clear(silent) {
        entries.slice().forEach(function (e) { clearInterval(e.timer); if (e.url) URL.revokeObjectURL(e.url); if (e.row) e.row.remove(); });
        entries = [];
        if (imageMode) { preview.innerHTML = ''; el.removeAttribute('data-has-preview'); }
        if (!silent) syncInput();
      }
      function browse() { input.value = ''; input.click(); }

      var offs = [
        R.on(el, 'click', function (e) { if (e.target === input || e.target.closest('a, .dropzone-clear')) return; browse(); }),
        R.on(el, 'keydown', function (e) { if (e.target === el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); browse(); } }),
        R.on(input, 'change', function () { if (input.files && input.files.length && !input.__syncing) { var fl = [].slice.call(input.files); add(fl); } }),
        R.on(el, 'dragenter', function (e) { e.preventDefault(); dragDepth++; el.setAttribute('data-dragover', ''); }),
        R.on(el, 'dragover', function (e) { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; }),
        R.on(el, 'dragleave', function () { if (--dragDepth <= 0) { dragDepth = 0; el.removeAttribute('data-dragover'); } }),
        R.on(el, 'drop', function (e) { e.preventDefault(); dragDepth = 0; el.removeAttribute('data-dragover'); if (e.dataTransfer && e.dataTransfer.files.length) add(e.dataTransfer.files); })
      ];
      if (list) offs.push(R.on(list, 'click', '.file-remove', function (ev, b) { var row = b.closest('.file-item'); var en = entries.filter(function (x) { return x.row === row; })[0]; if (en) removeEntry(en); el.focus(); }));
      var clr = el.querySelector('.dropzone-clear');
      if (clr) offs.push(R.on(clr, 'click', function (ev) { ev.stopPropagation(); clear(); }));
      if (input.form) offs.push(R.on(input.form, 'reset', function () { clear(); }));

      return {
        destroy: function () { offs.forEach(function (f) { f(); }); clear(true); if (ownList) list.remove(); },
        get files() { return entries.filter(function (e) { return !e.error; }).map(function (e) { return e.file; }); },
        add: add, clear: function () { clear(); },
        remove: function (file) { var e = entries.filter(function (x) { return x.file === file; })[0]; if (e) removeEntry(e); },
        progress: function (file, pct, status) { var e = entries.filter(function (x) { return x.file === file; })[0]; if (e) progress(e, pct, status || (pct >= 100 ? 'done' : 'uploading')); }
      };
    }
  });

  /** Ranj.fileUpload(el) → { files, add(files), remove(file), clear(), progress(file, pct, status) } */
  R.fileUpload = function (el) { if (typeof el === 'string') el = document.querySelector(el); return R.instance(el, 'dropzone'); };
  R.formatBytes = human;
})(window.Ranj);

;
/* --- components/forms/inline-edit.js --- */
/* Inline edit — click (or Enter) to edit text in place; Enter saves, Escape cancels, blur saves */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('inline-edit', {
    selector: '.inline-edit',
    mount: function (el) {
      var o = R.opts(el, { name: '', placeholder: 'Click to edit', multiline: false, required: false, maxlength: 0, blur: 'save', label: '' });
      var display = el.querySelector('.inline-edit-text');
      if (!display) {
        display = document.createElement('span'); display.className = 'inline-edit-text';
        while (el.firstChild) display.appendChild(el.firstChild);
        el.appendChild(display);
      }
      var value = display.textContent.trim();
      var icon = document.createElement('span'); icon.className = 'inline-edit-icon'; icon.setAttribute('aria-hidden', 'true'); icon.innerHTML = F.icons.pencil;
      el.appendChild(icon);
      var hidden = F.hidden(el, o.name || null, value);
      el.setAttribute('role', 'button'); el.tabIndex = 0;
      function aria() { el.setAttribute('aria-label', (o.label ? 'Edit ' + o.label.toLowerCase() : 'Edit') + ': ' + (value || 'empty')); }
      function paintDisplay() { display.textContent = value || o.placeholder; el.toggleAttribute('data-empty', !value); aria(); }
      var editor = null, editing = false;

      function start() {
        if (editing || el.hasAttribute('data-disabled')) return;
        editing = true;
        el.setAttribute('data-editing', '');
        el.removeAttribute('role'); el.removeAttribute('tabindex'); el.removeAttribute('aria-label');
        editor = document.createElement(o.multiline ? 'textarea' : 'input');
        editor.className = 'inline-edit-input';
        if (!o.multiline) editor.type = 'text';
        editor.value = value;
        editor.placeholder = o.placeholder;
        editor.setAttribute('aria-label', o.label || 'Edit text');
        if (o.maxlength) editor.maxLength = o.maxlength;
        var cs = getComputedStyle(display);
        editor.style.font = cs.font; editor.style.letterSpacing = cs.letterSpacing; editor.style.lineHeight = cs.lineHeight;
        editor.style.minWidth = Math.max(display.offsetWidth + 24, 64) + 'px';
        display.hidden = true; icon.hidden = true;
        el.insertBefore(editor, display);
        var grow = function () {
          if (o.multiline) { editor.style.height = 'auto'; editor.style.height = editor.scrollHeight + 'px'; }
          else { editor.style.width = '1px'; editor.style.width = Math.max(editor.scrollWidth + 6, 64) + 'px'; }
        };
        editor.addEventListener('input', grow);
        editor.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); }
          else if (e.key === 'Enter' && (!o.multiline || e.metaKey || e.ctrlKey)) { e.preventDefault(); finish(true); }
        });
        editor.addEventListener('blur', function () { if (editing) finish(o.blur !== 'cancel'); });
        grow();
        editor.focus(); editor.select();
        R.emit(el, 'edit', { value: value });
      }
      function finish(save) {
        if (!editing) return;
        var next = editor.value.trim(), prev = value;
        if (save && o.required && !next) { F.shake(editor); editor.setAttribute('aria-invalid', 'true'); editor.focus(); return; }
        if (save && next !== prev) {
          var ok = R.emit(el, 'save', { value: next, previous: prev });
          if (!ok) save = false;
        }
        editing = false;
        var hadFocus = document.activeElement === editor;
        editor.remove(); editor = null;
        display.hidden = false; icon.hidden = false;
        el.removeAttribute('data-editing');
        el.setAttribute('role', 'button'); el.tabIndex = 0;
        if (save && next !== prev) {
          value = next; if (hidden) hidden.value = value;
          paintDisplay();
          if (!R.reducedMotion) { el.classList.remove('inline-edit-saved'); void el.offsetWidth; el.classList.add('inline-edit-saved'); }
          R.emit(el, 'change', { value: value, previous: prev });
        } else { paintDisplay(); R.emit(el, 'cancel', { value: value }); }
        if (hadFocus) el.focus({ preventScroll: true });
      }
      var offs = [
        R.on(el, 'click', function (e) { if (!editing && !e.target.closest('a')) start(); }),
        R.on(el, 'keydown', function (e) { if (!editing && (e.key === 'Enter' || e.key === ' ' || e.key === 'F2') && e.target === el) { e.preventDefault(); start(); } })
      ];
      paintDisplay();
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); },
        edit: start, save: function () { finish(true); }, cancel: function () { finish(false); },
        get value() { return value; }, set value(v) { value = String(v); if (hidden) hidden.value = value; paintDisplay(); }
      };
    }
  });
})(window.Ranj);

;
/* --- components/forms/input.js --- */
/* Input — clearable shells, click-to-focus shells */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('input-wrap', {
    selector: '.input-wrap',
    setup: function () {
      // Clicking the shell's padding/icons focuses the inner input
      R.on(document, 'mousedown', '.input-wrap', function (e, wrap) {
        if (e.target.closest('button, a, input, textarea, select, [tabindex]')) return;
        var inp = wrap.querySelector('input, textarea');
        if (inp && !inp.disabled) { e.preventDefault(); inp.focus(); }
      });
    },
    mount: function (wrap) {
      if (!wrap.hasAttribute('data-clearable')) return;
      var inp = wrap.querySelector('input'); if (!inp) return;
      var btn = wrap.querySelector('.input-clear');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'input-btn input-clear';
        btn.setAttribute('aria-label', 'Clear'); btn.innerHTML = F.icons.x;
        var after = wrap.querySelector('.input-kbd, .input-suffix');
        if (after && after.parentNode === wrap) wrap.insertBefore(btn, after); else wrap.appendChild(btn);
      }
      btn.tabIndex = -1;
      function sync() { if (inp.value) wrap.setAttribute('data-has-value', ''); else wrap.removeAttribute('data-has-value'); }
      var off1 = R.on(inp, 'input', sync);
      var off2 = R.on(btn, 'click', function () {
        inp.value = ''; sync(); inp.focus();
        F.changed(wrap, { value: '' }, inp);
        R.emit(wrap, 'clear', {});
      });
      var off3 = R.on(inp, 'keydown', function (e) {
        if (e.key === 'Escape' && inp.value && wrap.hasAttribute('data-clear-on-escape')) { e.stopPropagation(); btn.click(); }
      });
      sync();
      return function () { off1(); off2(); off3(); };
    }
  });
})(window.Ranj);

;
/* --- components/forms/multi-select.js --- */
/* Multi-select — chips inside the field, filterable listbox, backspace removes. Drives a hidden <select multiple>. */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('multi-select', {
    selector: '.multi-select',
    mount: function (el) {
      var o = R.opts(el, { placeholder: 'Select…', max: 0, name: '', closeOnSelect: false, empty: 'No matches.' });
      var sel = el.querySelector('select');
      if (!sel) {
        sel = document.createElement('select');
        var data = []; try { data = JSON.parse(el.getAttribute('data-options') || '[]'); } catch (e) {}
        data.forEach(function (d) { if (typeof d === 'string') d = { value: d, label: d }; var op = new Option(d.label, d.value, d.selected, d.selected); if (d.icon) op.setAttribute('data-icon', d.icon); if (d.group) op.setAttribute('data-group', d.group); sel.appendChild(op); });
        el.appendChild(sel);
      }
      if (!sel.multiple) { sel.multiple = true; R.$$('option', sel).forEach(function (op) { op.selected = op.defaultSelected; }); }
      if (o.name && !sel.name) sel.name = o.name;
      sel.classList.add('f-sr'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true'); sel.setAttribute('data-f-native', '');

      var box = document.createElement('div'); box.className = 'chip-box multi-select-box';
      var input = document.createElement('input');
      input.type = 'text'; input.className = 'multi-select-input'; input.autocomplete = 'off'; input.spellcheck = false;
      input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list'); input.setAttribute('aria-expanded', 'false');
      if (el.getAttribute('aria-label')) input.setAttribute('aria-label', el.getAttribute('aria-label'));
      var caret = document.createElement('button'); caret.type = 'button'; caret.className = 'input-btn'; caret.tabIndex = -1;
      caret.setAttribute('aria-label', 'Show options'); caret.innerHTML = F.icons.chevronDown;
      box.appendChild(input); box.appendChild(caret);
      el.insertBefore(box, sel);
      var live = document.createElement('span'); live.className = 'f-sr'; live.setAttribute('aria-live', 'polite'); el.appendChild(live);

      var panel = document.createElement('div'); panel.className = 'multi-select-panel'; panel.hidden = true;
      var list = F.makeList(panel, { host: input, multi: true, empty: o.empty, onPick: function (it) { toggle(it); } });
      input.setAttribute('aria-controls', panel.id);
      var closeFn = null;

      function options() { return F.itemsFromSelect(sel).map(function (it) { it.selected = it.option.selected; if (!it.group) it.group = it.option.getAttribute('data-group') || ''; return it; }); }
      function chips() {
        R.$$('.input-chip', box).forEach(function (c) { c.remove(); });
        var chosen = options().filter(function (i) { return i.selected; });
        chosen.forEach(function (it) {
          var c = document.createElement('span'); c.className = 'input-chip'; c.setAttribute('data-value', it.value);
          c.innerHTML = (it.icon ? '<span class="input-chip-icon">' + it.icon + '</span>' : '') + '<span class="input-chip-label">' + R.esc(it.label) + '</span>' +
            '<button type="button" class="input-chip-remove" tabindex="-1" aria-label="Remove ' + R.esc(it.label) + '">' + F.icons.x + '</button>';
          box.insertBefore(c, input);
        });
        if (box.__noAnim) R.$$('.input-chip', box).forEach(function (c) { c.style.animation = 'none'; });
        input.placeholder = chosen.length ? '' : o.placeholder;
        el.toggleAttribute('data-has-value', chosen.length > 0);
        el.toggleAttribute('data-full', !!o.max && chosen.length >= o.max);
        return chosen;
      }
      function render() {
        var full = !!o.max && options().filter(function (i) { return i.selected; }).length >= o.max;
        var items = options().map(function (it) { if (full && !it.selected) it.disabled = true; return it; });
        var keep = list.current() && list.current().value;
        list.set(items).render(input.value);
        var idx = keep != null ? list.shown().map(function (i) { return i.value; }).indexOf(keep) : -1;
        if (idx > -1) list.highlight(idx); else list.move('first');
      }
      function emit() {
        var vals = R.$$('option', sel).filter(function (op) { return op.selected; }).map(function (op) { return op.value; });
        el.__emitting = true;
        try { sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
        el.__emitting = false;
        R.emit(el, 'change', { value: vals });
      }
      function toggle(it) {
        if (!it || it.disabled) return;
        it.option.selected = !it.option.selected;
        live.textContent = it.label + (it.option.selected ? ' selected' : ' removed');
        box.__noAnim = false;
        var prevChips = R.$$('.input-chip', box).map(function (c) { return c.getAttribute('data-value'); });
        chips();
        R.$$('.input-chip', box).forEach(function (c) { if (prevChips.indexOf(c.getAttribute('data-value')) > -1) c.style.animation = 'none'; });
        if (input.value) { input.value = ''; }
        render(); emit();
        if (o.closeOnSelect) close();
        else if (closeFn) R.position(panel, box, { placement: 'bottom-start', offset: 6 });
      }
      function removeValue(v) {
        var op = R.$$('option', sel).filter(function (x) { return x.value === v; })[0]; if (!op) return;
        var chip = box.querySelector('.input-chip[data-value="' + CSS.escape(v) + '"]');
        op.selected = false; live.textContent = op.textContent.trim() + ' removed';
        var finish = function () { box.__noAnim = true; chips(); box.__noAnim = false; if (closeFn) { render(); R.position(panel, box, { placement: 'bottom-start', offset: 6 }); } emit(); };
        if (chip && !R.reducedMotion) { chip.setAttribute('data-leaving', ''); setTimeout(finish, 150); } else finish();
      }
      function open() {
        if (closeFn || sel.disabled) return;
        render();
        el.setAttribute('data-state', 'open'); input.setAttribute('aria-expanded', 'true');
        closeFn = F.float(panel, box, { matchWidth: true, onClose: function () { closeFn = null; el.setAttribute('data-state', 'closed'); input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); input.value = ''; } });
      }
      function close() { if (closeFn) closeFn(); }
      function clearActive() { R.$$('.input-chip[data-active]', box).forEach(function (c) { c.removeAttribute('data-active'); }); }

      var offs = [
        R.on(box, 'mousedown', function (e) {
          if (e.target.closest('.input-chip-remove')) { e.preventDefault(); return; }
          if (e.target !== input) { e.preventDefault(); input.focus(); if (closeFn && e.target.closest('.input-btn')) close(); else open(); }
        }),
        R.on(box, 'click', '.input-chip-remove', function (e, b) { e.stopPropagation(); removeValue(b.parentNode.getAttribute('data-value')); input.focus(); }),
        R.on(input, 'focus', function () { el.setAttribute('data-focus', ''); }),
        R.on(input, 'blur', function () { el.removeAttribute('data-focus'); clearActive(); setTimeout(function () { if (document.activeElement !== input) close(); }, 0); }),
        R.on(input, 'input', function () { clearActive(); if (!closeFn) open(); else render(); }),
        R.on(input, 'keydown', function (e) {
          var k = e.key, active = box.querySelector('.input-chip[data-active]');
          if (k === 'Backspace' && !input.value) {
            e.preventDefault();
            var all = R.$$('.input-chip', box);
            if (active) removeValue(active.getAttribute('data-value'));
            else if (all.length) all[all.length - 1].setAttribute('data-active', '');
            return;
          }
          if (k === 'ArrowLeft' && !input.selectionStart && !input.value) {
            var cs = R.$$('.input-chip', box); var i = active ? cs.indexOf(active) - 1 : cs.length - 1;
            clearActive(); if (cs[Math.max(0, i)]) cs[Math.max(0, i)].setAttribute('data-active', ''); return;
          }
          if (k === 'ArrowRight' && active) { var cs2 = R.$$('.input-chip', box), j = cs2.indexOf(active) + 1; clearActive(); if (cs2[j]) cs2[j].setAttribute('data-active', ''); return; }
          if (k === 'Delete' && active) { e.preventDefault(); removeValue(active.getAttribute('data-value')); return; }
          clearActive();
          if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); if (!closeFn) { open(); return; } list.move(k === 'ArrowDown' ? 1 : -1); }
          else if (k === 'Home' && closeFn && !input.value) { e.preventDefault(); list.move('first'); }
          else if (k === 'End' && closeFn && !input.value) { e.preventDefault(); list.move('last'); }
          else if (k === 'Enter') { if (closeFn && list.current()) { e.preventDefault(); toggle(list.current()); } else if (!closeFn) { e.preventDefault(); open(); } }
          else if (k === 'Tab') close();
        }),
        R.on(sel, 'change', function () { if (!el.__emitting) { box.__noAnim = true; chips(); box.__noAnim = false; } })
      ];
      box.__noAnim = true; chips(); box.__noAnim = false;
      return {
        destroy: function () { close(); offs.forEach(function (f) { f(); }); panel.remove(); },
        open: open, close: close,
        get value() { return R.$$('option', sel).filter(function (op) { return op.selected; }).map(function (op) { return op.value; }); },
        set value(arr) { R.$$('option', sel).forEach(function (op) { op.selected = arr.indexOf(op.value) > -1; }); chips(); }
      };
    }
  });
})(window.Ranj);

;
/* --- components/forms/number-input.js --- */
/* Number input — − / + steppers with hold-to-repeat, min/max/step, keyboard, optional wheel, Intl formatting */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('number-input', {
    selector: '.number-input',
    mount: function (el) {
      var inp = el.querySelector('input'); if (!inp) return;
      var o = R.opts(el, { format: '', prefix: '', suffix: '', decimals: -1, wheel: false, locale: '' });
      var min = inp.min !== '' ? parseFloat(inp.min) : -Infinity, max = inp.max !== '' ? parseFloat(inp.max) : Infinity;
      var step = parseFloat(inp.step) || 1;
      var dec = o.decimals > -1 ? o.decimals : (String(step).split('.')[1] || '').length;
      var name = inp.name;
      // Use a text field so we can format; the real value lives in a hidden input
      inp.type = 'text';
      inp.setAttribute('inputmode', dec ? 'decimal' : 'numeric');
      inp.setAttribute('role', 'spinbutton');
      inp.setAttribute('autocomplete', 'off');
      if (name) { inp.removeAttribute('name'); }
      var hidden = F.hidden(el, name || null);
      var nf;
      var loc = o.locale || undefined;
      try {
        var p = o.format.split(':');
        if (p[0] === 'currency') nf = new Intl.NumberFormat(loc, { style: 'currency', currency: p[1] || 'USD', minimumFractionDigits: dec, maximumFractionDigits: dec });
        else if (p[0] === 'percent') nf = { format: function (v) { return v.toFixed(dec) + '%'; } };
        else nf = new Intl.NumberFormat(loc, { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: o.format !== 'plain' });
      } catch (e) { nf = { format: function (v) { return v.toFixed(dec); } }; }
      function fmt(v) { return v == null || isNaN(v) ? '' : o.prefix + nf.format(v) + o.suffix; }
      function parse(s) {
        s = String(s).replace(/[^\d.,\-]/g, '');
        if (!s) return null;
        // accept both 1,234.5 and 1.234,5
        var lc = s.lastIndexOf(','), ld = s.lastIndexOf('.');
        if (lc > ld && s.length - lc - 1 !== 3) s = s.replace(/\./g, '').replace(',', '.');
        else s = s.replace(/,/g, '');
        var v = parseFloat(s); return isNaN(v) ? null : v;
      }
      var val = parse(inp.value);
      if (inp.hasAttribute('value') && inp.getAttribute('value') !== '') val = parseFloat(inp.getAttribute('value'));

      // Build steppers if missing
      var dn = el.querySelector('[data-step-down]'), up = el.querySelector('[data-step-up]');
      if (!dn) { dn = document.createElement('button'); dn.setAttribute('data-step-down', ''); dn.innerHTML = F.icons.minus; el.insertBefore(dn, inp); }
      if (!up) { up = document.createElement('button'); up.setAttribute('data-step-up', ''); up.innerHTML = F.icons.plus; inp.insertAdjacentElement('afterend', up); }
      [dn, up].forEach(function (b, i) { b.type = 'button'; b.classList.add('number-input-btn'); b.tabIndex = -1; b.setAttribute('aria-label', (i ? 'Increase' : 'Decrease') + (inp.getAttribute('aria-label') ? ' ' + inp.getAttribute('aria-label').toLowerCase() : '')); });
      if (el.classList.contains('number-input-stacked')) {
        var stack = document.createElement('div'); stack.className = 'number-input-stack';
        up.innerHTML = F.icons.chevronDown; dn.innerHTML = F.icons.chevronDown;
        stack.appendChild(up); stack.appendChild(dn); el.appendChild(stack);
      }

      function render(focused) {
        inp.value = val == null ? '' : focused ? String(+val.toFixed(dec)) : fmt(val);
        if (hidden) hidden.value = val == null ? '' : String(+val.toFixed(dec));
        if (val != null) { inp.setAttribute('aria-valuenow', val); inp.setAttribute('aria-valuetext', fmt(val)); } else { inp.removeAttribute('aria-valuenow'); inp.removeAttribute('aria-valuetext'); }
        if (isFinite(min)) inp.setAttribute('aria-valuemin', min);
        if (isFinite(max)) inp.setAttribute('aria-valuemax', max);
        dn.disabled = inp.disabled || (val != null && val <= min);
        up.disabled = inp.disabled || (val != null && val >= max);
        el.toggleAttribute('data-at-min', val != null && val <= min);
        el.toggleAttribute('data-at-max', val != null && val >= max);
      }
      function set(v, dir) {
        if (v != null) v = R.clamp(+(+v).toFixed(dec), min, max);
        var changed = v !== val;
        val = v;
        render(document.activeElement === inp);
        if (changed) {
          if (dir && !R.reducedMotion) { inp.classList.remove('num-up', 'num-down'); void inp.offsetWidth; inp.classList.add(dir > 0 ? 'num-up' : 'num-down'); }
          if (hidden) try { hidden.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
          R.emit(el, 'change', { value: val });
        } else if (dir) F.shake(el);
        return changed;
      }
      function stepBy(n) {
        if (val == null) return set(isFinite(min) ? min : isFinite(max) ? Math.min(0, max) : 0, n);
        var base = val;
        // snap to step grid
        var origin = isFinite(min) ? min : 0;
        var next = Math.round((base + n * step - origin) / step) * step + origin;
        return set(next, n);
      }

      var hold = 0, rep = 0;
      function stopHold() { clearTimeout(hold); clearInterval(rep); hold = rep = 0; }
      function startHold(n) {
        stopHold();
        if (!stepBy(n)) return;
        var speed = 120;
        hold = setTimeout(function tick() {
          if (!stepBy(n)) { stopHold(); return; }
          speed = Math.max(30, speed * 0.88);
          hold = setTimeout(tick, speed);
        }, 420);
      }
      var offs = [
        R.on(dn, 'pointerdown', function (e) { if (e.button) return; e.preventDefault(); inp.focus({ preventScroll: true }); startHold(-1); }),
        R.on(up, 'pointerdown', function (e) { if (e.button) return; e.preventDefault(); inp.focus({ preventScroll: true }); startHold(1); }),
        R.on(window, 'pointerup', stopHold), R.on(window, 'pointercancel', stopHold), R.on(window, 'blur', stopHold),
        R.on(dn, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stepBy(-1); } }),
        R.on(up, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stepBy(1); } }),
        R.on(inp, 'focus', function () { render(true); setTimeout(function () { try { inp.select(); } catch (e) {} }, 0); }),
        R.on(inp, 'blur', function () { var v = parse(inp.value); set(v); render(false); }),
        R.on(inp, 'keydown', function (e) {
          var k = e.key, mult = e.shiftKey ? 10 : 1;
          if (k === 'ArrowUp') { e.preventDefault(); stepBy(mult); }
          else if (k === 'ArrowDown') { e.preventDefault(); stepBy(-mult); }
          else if (k === 'PageUp') { e.preventDefault(); stepBy(10); }
          else if (k === 'PageDown') { e.preventDefault(); stepBy(-10); }
          else if (k === 'Home' && isFinite(min)) { e.preventDefault(); set(min, -1); }
          else if (k === 'End' && isFinite(max)) { e.preventDefault(); set(max, 1); }
          else if (k === 'Enter') { set(parse(inp.value)); render(true); }
        }),
        R.on(inp, 'input', function () { inp.value = inp.value.replace(/[^\d.,\-]/g, ''); })
      ];
      if (o.wheel) offs.push(R.on(inp, 'wheel', function (e) { if (document.activeElement !== inp) return; e.preventDefault(); stepBy(e.deltaY < 0 ? 1 : -1); }, { passive: false }));
      if (inp.form) offs.push(R.on(inp.form, 'reset', function () { setTimeout(function () { val = parse(inp.getAttribute('value')); render(false); }, 0); }));
      render(false);
      return {
        destroy: function () { stopHold(); offs.forEach(function (f) { f(); }); },
        get value() { return val; }, set value(v) { set(v); },
        stepUp: function () { stepBy(1); }, stepDown: function () { stepBy(-1); }
      };
    }
  });
})(window.Ranj);

;
/* --- components/forms/otp-input.js --- */
/* OTP input — n slots, auto-advance, paste fills all, backspace goes back, masked, complete event */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('otp', {
    selector: '.otp',
    mount: function (el) {
      var o = R.opts(el, { length: 6, name: '', group: 0, type: 'numeric', masked: false, autofocus: false, label: 'Verification code' });
      var slots = R.$$('input.otp-slot', el);
      if (!slots.length) {
        var html = '';
        for (var i = 0; i < o.length; i++) {
          if (o.group && i && i % o.group === 0) html += '<span class="otp-sep" aria-hidden="true"></span>';
          html += '<input class="otp-slot">';
        }
        el.insertAdjacentHTML('beforeend', html);
        slots = R.$$('input.otp-slot', el);
      }
      var n = slots.length;
      var re = o.type === 'alphanumeric' ? /[a-z0-9]/i : o.type === 'alpha' ? /[a-z]/i : /\d/;
      if (!el.hasAttribute('role')) el.setAttribute('role', 'group');
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) el.setAttribute('aria-label', o.label);
      slots.forEach(function (s, i) {
        s.type = o.masked ? 'password' : 'text';
        s.setAttribute('inputmode', o.type === 'numeric' ? 'numeric' : 'text');
        s.setAttribute('autocomplete', i === 0 ? 'one-time-code' : 'off');
        s.setAttribute('aria-label', 'Character ' + (i + 1) + ' of ' + n);
        s.setAttribute('maxlength', i === 0 ? String(n) : '1');
        s.spellcheck = false;
        if (o.type !== 'numeric') s.setAttribute('autocapitalize', 'characters');
      });
      var hidden = F.hidden(el, o.name || null, '');

      function value() { return slots.map(function (s) { return s.value; }).join(''); }
      function sync(silent) {
        var v = value();
        if (hidden) hidden.value = v;
        slots.forEach(function (s) { s.toggleAttribute('data-filled', !!s.value); });
        el.toggleAttribute('data-complete', v.length === n);
        if (el.getAttribute('data-state') === 'error') el.removeAttribute('data-state');
        if (silent === true) return;
        R.emit(el, 'change', { value: v, complete: v.length === n });
        if (v.length === n && el.__last !== v) { R.emit(el, 'complete', { value: v }); }
        el.__last = v;
      }
      function clean(str) { return String(str).split('').filter(function (c) { return re.test(c); }).map(function (c) { return o.type === 'numeric' ? c : c.toUpperCase(); }); }
      function fill(start, chars) {
        var i = start;
        chars.forEach(function (c) { if (i < n) { slots[i].value = c; pop(slots[i]); i++; } });
        sync();
        focusAt(Math.min(i, n - 1));
      }
      function pop(s) { if (R.reducedMotion) return; s.classList.remove('otp-pop'); void s.offsetWidth; s.classList.add('otp-pop'); }
      function focusAt(i) { var s = slots[R.clamp(i, 0, n - 1)]; s.focus(); try { s.setSelectionRange(0, s.value.length); } catch (e) {} }
      function firstEmpty() { for (var i = 0; i < n; i++) if (!slots[i].value) return i; return n - 1; }

      var offs = [];
      slots.forEach(function (s, i) {
        offs.push(R.on(s, 'input', function () {
          var chars = clean(s.value);
          if (!chars.length) { s.value = ''; sync(); return; }
          if (chars.length > 1) { s.value = ''; fill(chars.length >= n ? 0 : i, chars); return; }
          s.value = chars[0]; pop(s); sync();
          if (i < n - 1) focusAt(i + 1);
        }));
        offs.push(R.on(s, 'keydown', function (e) {
          var k = e.key;
          if (k === 'Backspace') {
            e.preventDefault();
            if (s.value) { s.value = ''; sync(); }
            else if (i > 0) { slots[i - 1].value = ''; sync(); focusAt(i - 1); }
          } else if (k === 'Delete') { e.preventDefault(); s.value = ''; sync(); }
          else if (k === 'ArrowLeft') { e.preventDefault(); focusAt(i - 1); }
          else if (k === 'ArrowRight') { e.preventDefault(); focusAt(i + 1); }
          else if (k === 'Home') { e.preventDefault(); focusAt(0); }
          else if (k === 'End') { e.preventDefault(); focusAt(firstEmpty()); }
          else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            if (!re.test(k)) { e.preventDefault(); return; }
            if (s.value) { e.preventDefault(); s.value = o.type === 'numeric' ? k : k.toUpperCase(); pop(s); sync(); if (i < n - 1) focusAt(i + 1); }
          }
        }));
        offs.push(R.on(s, 'paste', function (e) {
          var t = (e.clipboardData || window.clipboardData).getData('text');
          var chars = clean(t);
          e.preventDefault();
          if (!chars.length) return;
          fill(chars.length >= n ? 0 : i, chars);
        }));
        offs.push(R.on(s, 'focus', function () {
          // Don't let people skip ahead past empty slots
          var fe = firstEmpty();
          if (!s.value && i > fe && !el.hasAttribute('data-free')) { focusAt(fe); return; }
          setTimeout(function () { try { s.setSelectionRange(0, s.value.length); } catch (e) {} }, 0);
        }));
      });
      if (o.autofocus) setTimeout(function () { focusAt(0); }, 50);
      sync(true);
      el.__last = value();
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); },
        get value() { return value(); },
        set value(v) { slots.forEach(function (s) { s.value = ''; }); fill(0, clean(v)); },
        clear: function () { slots.forEach(function (s) { s.value = ''; }); sync(); focusAt(0); },
        setState: function (st) {
          if (st) el.setAttribute('data-state', st); else el.removeAttribute('data-state');
          if (st === 'error') F.shake(el);
          slots.forEach(function (s) { if (st === 'error') s.setAttribute('aria-invalid', 'true'); else s.removeAttribute('aria-invalid'); });
        }
      };
    }
  });

  /** Ranj.otp(el) → instance { value, clear(), setState('error'|'success'|null) } */
  R.otp = function (el) { if (typeof el === 'string') el = document.querySelector(el); return R.instance(el, 'otp'); };
})(window.Ranj);

;
/* --- components/forms/password.js --- */
/* Password — reveal toggle, caps-lock hint, strength meter with rules checklist */
(function (R) {
  'use strict';
  var F = R._forms;
  var RULES = {
    length: function (n) { return { label: 'At least ' + n + ' characters', test: function (v) { return v.length >= n; } }; },
    lower: function () { return { label: 'A lowercase letter', test: function (v) { return /[a-z]/.test(v); } }; },
    upper: function () { return { label: 'An uppercase letter', test: function (v) { return /[A-Z]/.test(v); } }; },
    number: function () { return { label: 'A number', test: function (v) { return /\d/.test(v); } }; },
    symbol: function () { return { label: 'A symbol (!@#$…)', test: function (v) { return /[^A-Za-z0-9\s]/.test(v); } }; }
  };
  var LEVELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  var COMMON = /^(password|123456|qwerty|letmein|welcome|admin|iloveyou|abc123|111111|monkey)/i;

  function score(v, rules) {
    if (!v) return 0;
    var passed = rules.filter(function (r) { return r.test(v); }).length;
    var s = Math.round(passed / rules.length * 3);
    if (v.length >= 12) s++;
    if (v.length >= 16 && passed >= rules.length - 1) s++;
    if (COMMON.test(v) || /^(.)\1+$/.test(v)) s = Math.min(s, 1);
    if (v.length < 6) s = Math.min(s, 1);
    return R.clamp(s, v ? 1 : 0, 4);
  }

  R.define('password', {
    selector: '.password',
    mount: function (el) {
      var inp = el.querySelector('input'); if (!inp) return;
      var o = R.opts(el, { strength: false, rules: 'length:8,lower,upper,number,symbol', toggle: true, capslock: true });
      var wrap = el.classList.contains('input-wrap') ? el : inp.closest('.input-wrap');
      if (!wrap || !el.contains(wrap) && wrap !== el) {
        wrap = document.createElement('div'); wrap.className = 'input-wrap';
        inp.classList.remove('input');
        inp.parentNode.insertBefore(wrap, inp); wrap.appendChild(inp);
      }
      var offs = [], btn = null;
      if (o.toggle) {
        btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'input-btn password-toggle';
        btn.setAttribute('aria-label', 'Show password'); btn.setAttribute('aria-pressed', 'false');
        if (inp.id) btn.setAttribute('aria-controls', inp.id);
        btn.innerHTML = '<span class="password-eye">' + F.icons.eye + '</span><span class="password-eye-off">' + F.icons.eyeOff + '</span>';
        wrap.appendChild(btn);
        offs.push(R.on(btn, 'mousedown', function (e) { e.preventDefault(); }));
        offs.push(R.on(btn, 'click', function () {
          var show = inp.type === 'password';
          var a = inp.selectionStart, b = inp.selectionEnd;
          inp.type = show ? 'text' : 'password';
          btn.setAttribute('aria-pressed', String(show));
          btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
          el.toggleAttribute('data-revealed', show);
          if (document.activeElement === inp) try { inp.setSelectionRange(a, b); } catch (e) {}
          R.emit(el, 'reveal', { visible: show });
        }));
      }
      var caps = null;
      if (o.capslock) {
        caps = document.createElement('p'); caps.className = 'field-hint password-caps'; caps.hidden = true;
        caps.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 4 8 8h-4v4H8v-4H4z"/><path d="M8 20h8"/></svg>Caps Lock is on';
        caps.setAttribute('aria-live', 'polite');
        wrap.insertAdjacentElement('afterend', caps);
        var ck = function (e) { if (e.getModifierState) caps.hidden = !e.getModifierState('CapsLock'); };
        offs.push(R.on(inp, 'keydown', ck), R.on(inp, 'keyup', ck), R.on(inp, 'blur', function () { caps.hidden = true; }));
      }
      if (o.strength) {
        var rules = o.rules.split(',').map(function (r) { var p = r.trim().split(':'); return RULES[p[0]] ? RULES[p[0]](parseInt(p[1], 10) || 8) : null; }).filter(Boolean);
        var meter = document.createElement('div'); meter.className = 'password-meter'; meter.setAttribute('data-score', '0');
        meter.innerHTML = '<div class="password-bars" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
          '<div class="password-meter-text"><span class="password-level">Enter a password</span></div>';
        var listEl = null;
        if (!el.hasAttribute('data-no-rules')) {
          listEl = document.createElement('ul'); listEl.className = 'password-rules';
          listEl.innerHTML = rules.map(function (r) { return '<li><span class="password-rule-icon" aria-hidden="true">' + F.icons.check + '</span><span>' + R.esc(r.label) + '</span><span class="f-sr"> — not met</span></li>'; }).join('');
        }
        var after = caps || wrap;
        after.insertAdjacentElement('afterend', meter);
        if (listEl) meter.insertAdjacentElement('afterend', listEl);
        var level = meter.querySelector('.password-level');
        level.setAttribute('aria-live', 'polite');
        R.ensureId(meter, 'pwm');
        inp.setAttribute('aria-describedby', ((inp.getAttribute('aria-describedby') || '') + ' ' + meter.id).trim());
        var upd = function () {
          var v = inp.value, s = score(v, rules);
          meter.setAttribute('data-score', String(s));
          level.textContent = v ? LEVELS[s] : 'Enter a password';
          if (listEl) R.$$('li', listEl).forEach(function (li, i) { var ok = rules[i].test(v); li.toggleAttribute('data-met', ok); li.lastChild.textContent = ok ? ' — met' : ' — not met'; });
          R.emit(el, 'strength', { score: s, label: LEVELS[s] });
        };
        offs.push(R.on(inp, 'input', upd));
        upd();
      }
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });
  R.passwordScore = function (v, rules) {
    rules = (rules || 'length:8,lower,upper,number,symbol').split(',').map(function (r) { var p = r.split(':'); return RULES[p[0]](parseInt(p[1], 10) || 8); });
    return score(v, rules);
  };
})(window.Ranj);

;
/* --- components/forms/rating-input.js --- */
/* Rating — stars (or any icon), hover preview, half steps, keyboard (role="slider"), readonly display */
(function (R) {
  'use strict';
  var F = R._forms;
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6.06 6.6.8-4.87 4.56 1.27 6.54L12 17.3l-5.9 3.26 1.27-6.54L2.5 9.46l6.6-.8z"/></svg>';
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.1C.9 8.6 3 5 6.6 5c2.1 0 3.6 1.1 5.4 3 1.8-1.9 3.3-3 5.4-3C21 5 23.1 8.6 21.6 11.9 19.5 16.4 12 21 12 21z"/></svg>';

  R.define('rating', {
    selector: '.rating',
    mount: function (el) {
      var o = R.opts(el, { value: 0, max: 5, half: false, readonly: false, name: '', labels: '', icon: 'star', clearable: true, label: 'Rating' });
      var step = o.half ? 0.5 : 1, val = R.clamp(o.value, 0, o.max), hover = null;
      var icon = o.icon === 'heart' ? HEART : STAR;
      var labels = o.labels ? o.labels.split('|') : null;
      el.innerHTML = '';
      var stars = document.createElement('span'); stars.className = 'rating-stars';
      for (var i = 0; i < o.max; i++) stars.insertAdjacentHTML('beforeend', '<span class="rating-star" data-i="' + i + '">' + icon + '<span class="rating-fill">' + icon + '</span></span>');
      el.appendChild(stars);
      var text = null;
      if (labels || el.hasAttribute('data-show-value')) { text = document.createElement('span'); text.className = 'rating-text'; el.appendChild(text); }
      var hidden = F.hidden(el, o.name || null);
      if (!o.readonly) { el.tabIndex = 0; el.setAttribute('role', 'slider'); el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', String(o.max)); }
      else { el.setAttribute('role', 'img'); el.setAttribute('data-readonly', ''); }
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', o.label);
      var starEls = R.$$('.rating-star', stars);

      function word(v) { if (labels) { var i = Math.ceil(v) - 1; return labels[i] || ''; } return ''; }
      function paint() {
        var v = hover != null ? hover : val;
        starEls.forEach(function (s, i) {
          var f = R.clamp(v - i, 0, 1);
          s.style.setProperty('--fill', (f * 100) + '%');
          s.toggleAttribute('data-on', f > 0);
          s.toggleAttribute('data-hover', hover != null && f > 0);
        });
        el.toggleAttribute('data-previewing', hover != null);
        if (text) text.textContent = v ? (labels ? word(v) : v + ' / ' + o.max) : (el.getAttribute('data-empty-text') || '');
        var vt = val + ' out of ' + o.max + (labels && val ? ', ' + word(val) : '');
        if (o.readonly) el.setAttribute('aria-label', o.label + ': ' + vt); else { el.setAttribute('aria-valuenow', String(val)); el.setAttribute('aria-valuetext', vt); }
        if (hidden) hidden.value = val || '';
      }
      function at(e) {
        var s = e.target.closest('.rating-star'); if (!s) return null;
        var i = +s.getAttribute('data-i'), r = s.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        if (document.dir === 'rtl' || getComputedStyle(el).direction === 'rtl') x = 1 - x;
        return o.half ? i + (x <= .5 ? .5 : 1) : i + 1;
      }
      function set(v, pulse) {
        v = R.clamp(Math.round(v / step) * step, 0, o.max);
        if (v === val) return;
        val = v; paint();
        if (pulse && !R.reducedMotion) {
          var s = starEls[Math.ceil(v) - 1];
          if (s) { s.classList.remove('rating-pulse'); void s.offsetWidth; s.classList.add('rating-pulse'); }
        }
        if (hidden) try { hidden.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
        R.emit(el, 'change', { value: val, label: word(val) });
      }
      var offs = [];
      if (!o.readonly) {
        offs.push(R.on(stars, 'pointermove', function (e) { if (e.pointerType === 'touch') return; var v = at(e); if (v != null && v !== hover) { hover = v; paint(); } }));
        offs.push(R.on(stars, 'pointerleave', function () { hover = null; paint(); }));
        offs.push(R.on(stars, 'click', function (e) { var v = at(e); if (v == null) return; hover = null; if (v === val && o.clearable) set(0); else set(v, true); }));
        offs.push(R.on(el, 'keydown', function (e) {
          var k = e.key, v = null;
          if (k === 'ArrowRight' || k === 'ArrowUp') v = val + step; else if (k === 'ArrowLeft' || k === 'ArrowDown') v = val - step;
          else if (k === 'Home') v = 0; else if (k === 'End') v = o.max;
          else if (/^[0-9]$/.test(k) && +k <= o.max) v = +k;
          if (v != null) { e.preventDefault(); set(v, true); }
        }));
      }
      paint();
      return { destroy: function () { offs.forEach(function (f) { f(); }); }, get value() { return val; }, set value(v) { set(v); } };
    }
  });
})(window.Ranj);

;
/* --- components/forms/search-input.js --- */
/* Search input — icon, ⌘K / Ctrl K shortcut hint, loading spinner, clear, debounced ranj:search */
(function (R) {
  'use strict';
  var F = R._forms;
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  R.define('search-input', {
    selector: '.search-input',
    mount: function (el) {
      var inp = el.querySelector('input'); if (!inp) return;
      var o = R.opts(el, { shortcut: '', debounce: 250, minChars: 0 });
      el.classList.add('input-wrap');
      if (!inp.type || inp.type === 'text') inp.type = 'search';
      if (!inp.hasAttribute('aria-label') && !inp.id) inp.setAttribute('aria-label', inp.placeholder || 'Search');
      inp.autocomplete = 'off';
      if (!el.querySelector('.input-icon')) el.insertAdjacentHTML('afterbegin', '<span class="input-icon search-input-icon">' + F.icons.search + '</span>');
      var icon = el.querySelector('.input-icon');
      var spin = document.createElement('span'); spin.className = 'search-input-spinner'; spin.innerHTML = F.icons.spinner; spin.setAttribute('aria-hidden', 'true');
      icon.appendChild(spin);
      var clear = document.createElement('button'); clear.type = 'button'; clear.className = 'input-btn input-clear'; clear.tabIndex = -1;
      clear.setAttribute('aria-label', 'Clear search'); clear.innerHTML = F.icons.x;
      inp.insertAdjacentElement('afterend', clear);
      var kbd = null;
      if (o.shortcut) {
        kbd = document.createElement('kbd'); kbd.className = 'input-kbd search-input-kbd';
        var key = o.shortcut.length === 1 ? o.shortcut.toUpperCase() : o.shortcut;
        kbd.innerHTML = o.shortcut === '/' ? '/' : (mac ? '<span>⌘</span>' : '<span>Ctrl</span>') + key;
        kbd.setAttribute('aria-hidden', 'true');
        el.appendChild(kbd);
        inp.setAttribute('aria-keyshortcuts', o.shortcut === '/' ? '/' : (mac ? 'Meta+' : 'Control+') + key);
      }
      var t = 0, last = inp.value;
      function sync() { el.toggleAttribute('data-has-value', !!inp.value); }
      function fire(now) {
        clearTimeout(t);
        var run = function () { if (inp.value === last && !now) return; last = inp.value; if (inp.value.length >= o.minChars || !inp.value) R.emit(el, 'search', { value: inp.value, query: inp.value.trim() }); };
        if (now) run(); else t = setTimeout(run, o.debounce);
      }
      var offs = [
        R.on(inp, 'input', function () { sync(); R.emit(el, 'change', { value: inp.value }); fire(false); }),
        R.on(inp, 'keydown', function (e) {
          if (e.key === 'Enter') { fire(true); R.emit(el, 'submit', { value: inp.value }); }
          else if (e.key === 'Escape') { if (inp.value) { e.preventDefault(); e.stopPropagation(); inp.value = ''; sync(); R.emit(el, 'change', { value: '' }); fire(true); } else inp.blur(); }
        }),
        R.on(clear, 'click', function () { inp.value = ''; sync(); inp.focus(); R.emit(el, 'change', { value: '' }); fire(true); R.emit(el, 'clear', {}); })
      ];
      if (o.shortcut) offs.push(R.on(document, 'keydown', function (e) {
        var k = e.key && e.key.toLowerCase();
        var hit = o.shortcut === '/' ? (k === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable)
          : (k === o.shortcut.toLowerCase() && (mac ? e.metaKey : e.ctrlKey) && !e.altKey);
        if (hit && el.isConnected && el.offsetParent !== null) { e.preventDefault(); inp.focus(); inp.select(); }
      }));
      sync();
      return {
        destroy: function () { clearTimeout(t); offs.forEach(function (f) { f(); }); },
        loading: function (on) { el.toggleAttribute('data-loading', !!on); inp.setAttribute('aria-busy', String(!!on)); },
        get value() { return inp.value; }, set value(v) { inp.value = v; sync(); }
      };
    }
  });
  /** Ranj.searchLoading(el, bool) — toggle the spinner */
  R.searchLoading = function (el, on) { var i = R.instance(el, 'search-input'); if (i) i.loading(on); else el.toggleAttribute('data-loading', !!on); };
})(window.Ranj);

;
/* --- components/forms/segmented.js --- */
/* Segmented control — positions a sliding indicator under the checked radio */
(function (R) {
  'use strict';
  R.define('segmented', {
    selector: '.segmented',
    mount: function (el) {
      if (!el.hasAttribute('role')) el.setAttribute('role', 'radiogroup');
      var ind = el.querySelector('.segmented-indicator');
      if (!ind) { ind = document.createElement('span'); ind.className = 'segmented-indicator'; ind.setAttribute('aria-hidden', 'true'); el.insertBefore(ind, el.firstChild); }
      function current() { var i = el.querySelector('input:checked'); return i ? i.closest('label') : null; }
      function place(instant) {
        var c = current();
        if (!c) { ind.style.opacity = '0'; return; }
        ind.style.opacity = '';
        if (instant) el.setAttribute('data-instant', '');
        ind.style.setProperty('--x', c.offsetLeft + 'px');
        ind.style.setProperty('--w', c.offsetWidth + 'px');
        if (instant) { void ind.offsetWidth; el.removeAttribute('data-instant'); }
        el.setAttribute('data-ready', '');
      }
      var offs = [R.on(el, 'change', function (e) {
        if (e.target.type !== 'radio') return;
        place(false);
        R.emit(el, 'change', { value: e.target.value });
        var c = current(); if (c && c.scrollIntoView && el.scrollWidth > el.clientWidth) c.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      })];
      var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { place(true); }) : null;
      if (ro) { ro.observe(el); R.$$('label', el).forEach(function (l) { ro.observe(l); }); }
      var form = el.closest('form');
      if (form) offs.push(R.on(form, 'reset', function () { setTimeout(function () { place(false); }, 0); }));
      place(true);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { place(true); });
      return { destroy: function () { offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); }, update: function () { place(false); } };
    }
  });
})(window.Ranj);

;
/* --- components/forms/slider.js --- */
/* Slider (native range enhanced) + Range slider (custom dual thumb) */
(function (R) {
  'use strict';
  var F = R._forms;

  function formatter(el) {
    var f = el.getAttribute('data-format') || '', pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var nf = null, parts = f.split(':');
    try {
      if (parts[0] === 'currency') nf = new Intl.NumberFormat(undefined, { style: 'currency', currency: parts[1] || 'USD', maximumFractionDigits: 0 });
      else if (parts[0] === 'percent') nf = { format: function (v) { return Math.round(v) + '%'; } };
      else if (parts[0] === 'compact') nf = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });
      else nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
    } catch (e) { nf = { format: String }; }
    var labels = null;
    if (el.getAttribute('data-labels')) labels = el.getAttribute('data-labels').split('|');
    return function (v, min, step) {
      if (labels) { var i = Math.round((v - (min || 0)) / (step || 1)); if (labels[i] != null) return labels[i]; }
      return pre + nf.format(v) + suf;
    };
  }
  function parseMarks(el, min, max, step, fmt) {
    var m = el.getAttribute('data-marks');
    if (m == null) return null;
    if (m === '' || m === 'true' || m === 'steps') {
      var out = [], n = Math.round((max - min) / step);
      var every = n > 10 ? Math.ceil(n / 5) : 1;
      for (var i = 0; i <= n; i += every) out.push({ v: min + i * step, label: fmt(min + i * step, min, step) });
      if ((n % every) !== 0) out.push({ v: max, label: fmt(max, min, step) });
      return out;
    }
    return m.split(',').map(function (s) { var p = s.split(':'); var v = parseFloat(p[0]); return { v: v, label: p[1] != null ? p.slice(1).join(':') : fmt(v, min, step) }; });
  }
  function decimals(step) { var s = String(step); return s.indexOf('.') > -1 ? s.split('.')[1].length : 0; }
  function snap(v, min, max, step) { var r = Math.round((v - min) / step) * step + min; return R.clamp(+r.toFixed(decimals(step)), min, max); }

  /* ---------- Native range enhancement ---------- */
  R.define('slider', {
    selector: '.slider',
    mount: function (el) {
      var inp = el.querySelector('input[type="range"]'); if (!inp) return;
      var inner = el.querySelector('.slider-inner');
      if (!inner) { inner = document.createElement('div'); inner.className = 'slider-inner'; inp.parentNode.insertBefore(inner, inp); inner.appendChild(inp); }
      var fmt = formatter(el);
      var bubble = null;
      if (el.hasAttribute('data-bubble')) { bubble = document.createElement('span'); bubble.className = 'slider-bubble'; bubble.setAttribute('aria-hidden', 'true'); inner.appendChild(bubble); }
      var min = parseFloat(inp.min || 0), max = parseFloat(inp.max || 100), step = parseFloat(inp.step) || 1;
      var marks = parseMarks(el, min, max, step, fmt), tickEls = [], markEls = [];
      if (marks) {
        var ticks = document.createElement('div'); ticks.className = 'slider-ticks'; ticks.setAttribute('aria-hidden', 'true');
        var row = document.createElement('div'); row.className = 'slider-marks'; row.setAttribute('aria-hidden', 'true');
        marks.forEach(function (mk) {
          var p = (mk.v - min) / (max - min);
          var t = document.createElement('span'); t.className = 'slider-tick'; t.style.left = 'calc(var(--thumb) / 2 + (100% - var(--thumb)) * ' + p + ')'; ticks.appendChild(t); tickEls.push(t);
          if (!el.hasAttribute('data-ticks-only')) {
            var l = document.createElement('span'); l.className = 'slider-mark'; l.textContent = mk.label; l.style.left = 'calc(var(--thumb) / 2 + (100% - var(--thumb)) * ' + p + ')';
            l.addEventListener('click', function () { inp.value = mk.v; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); });
            row.appendChild(l); markEls.push(l);
          }
        });
        inner.appendChild(ticks);
        if (markEls.length) el.appendChild(row);
      }
      var scope = el.closest('.field') || el.parentNode;
      var outs = R.$$('[data-slider-output]', scope).filter(function (o) { var t = o.getAttribute('data-slider-output'); return !t || (inp.id && t === '#' + inp.id); });
      function upd() {
        var v = parseFloat(inp.value), p = max > min ? (v - min) / (max - min) : 0;
        el.style.setProperty('--p', p);
        var txt = fmt(v, min, step);
        if (bubble) bubble.textContent = txt;
        outs.forEach(function (o) { o.textContent = txt; });
        if (el.hasAttribute('data-format') || el.hasAttribute('data-prefix') || el.hasAttribute('data-suffix') || el.hasAttribute('data-labels')) inp.setAttribute('aria-valuetext', txt);
        if (marks) marks.forEach(function (mk, i) { var on = mk.v <= v; if (tickEls[i]) tickEls[i].toggleAttribute('data-on', on); if (markEls[i]) markEls[i].toggleAttribute('data-on', mk.v === v); });
      }
      var offs = [
        R.on(inp, 'input', function () { upd(); R.emit(el, 'input', { value: parseFloat(inp.value) }); }),
        R.on(inp, 'change', function () { R.emit(el, 'change', { value: parseFloat(inp.value) }); }),
        R.on(inp, 'pointerdown', function () { el.setAttribute('data-dragging', ''); var up = function () { el.removeAttribute('data-dragging'); window.removeEventListener('pointerup', up); }; window.addEventListener('pointerup', up); })
      ];
      if (inp.form) offs.push(R.on(inp.form, 'reset', function () { setTimeout(upd, 0); }));
      upd();
      return { destroy: function () { offs.forEach(function (f) { f(); }); }, update: upd };
    }
  });

  /* ---------- Custom range slider (one or two thumbs) ---------- */
  R.define('range-slider', {
    selector: '.range-slider',
    mount: function (el) {
      var o = R.opts(el, { min: 0, max: 100, step: 1, value: '25,75', minGap: 0, name: '', nameMin: '', nameMax: '', labelMin: 'Minimum', labelMax: 'Maximum', disabled: false });
      var min = o.min, max = o.max, step = o.step, fmt = formatter(el);
      var vals = String(o.value).split(',').map(function (s) { return snap(parseFloat(s), min, max, step); });
      var single = vals.length === 1;
      if (single) el.setAttribute('data-single', '');
      el.innerHTML = '';
      var hist = el.getAttribute('data-histogram');
      var histEl = null;
      if (hist) {
        histEl = document.createElement('div'); histEl.className = 'slider-histogram'; histEl.setAttribute('aria-hidden', 'true');
        var hv = hist.split(',').map(Number), hm = Math.max.apply(null, hv);
        hv.forEach(function (h) { var s = document.createElement('span'); s.style.height = (6 + 94 * h / hm) + '%'; histEl.appendChild(s); });
        el.appendChild(histEl);
      }
      var rail = document.createElement('div'); rail.className = 'slider-rail';
      var range = document.createElement('div'); range.className = 'slider-range';
      rail.appendChild(range);
      el.appendChild(rail);
      var marks = parseMarks(el, min, max, step, fmt), tickEls = [], markEls = [];
      if (marks) {
        var ticks = document.createElement('div'); ticks.className = 'slider-ticks'; ticks.setAttribute('aria-hidden', 'true');
        var row = document.createElement('div'); row.className = 'slider-marks'; row.setAttribute('aria-hidden', 'true');
        marks.forEach(function (mk) {
          var p = (mk.v - min) / (max - min);
          var t = document.createElement('span'); t.className = 'slider-tick'; t.style.left = (p * 100) + '%'; ticks.appendChild(t); tickEls.push(t);
          if (!el.hasAttribute('data-ticks-only')) { var l = document.createElement('span'); l.className = 'slider-mark'; l.textContent = mk.label; l.style.left = (p * 100) + '%'; row.appendChild(l); markEls.push(l); }
        });
        rail.appendChild(ticks);
        if (markEls.length) el.appendChild(row);
      }
      var groupLabel = el.getAttribute('aria-label') || '';
      var thumbs = vals.map(function (v, i) {
        var t = document.createElement('div');
        t.className = 'slider-thumb'; t.tabIndex = o.disabled ? -1 : 0;
        t.setAttribute('role', 'slider');
        t.setAttribute('aria-orientation', 'horizontal');
        t.setAttribute('aria-label', single ? (groupLabel || 'Value') : ((groupLabel ? groupLabel + ' ' : '') + (i ? o.labelMax : o.labelMin).toLowerCase()).replace(/^./, function (c) { return c.toUpperCase(); }));
        if (el.hasAttribute('data-bubble')) t.innerHTML = '<span class="slider-bubble" aria-hidden="true"></span>';
        rail.appendChild(t);
        return t;
      });
      if (o.disabled) el.setAttribute('aria-disabled', 'true');
      var hiddenA, hiddenB;
      if (single) hiddenA = F.hidden(el, o.name || o.nameMin || null);
      else {
        hiddenA = F.hidden(el, o.nameMin || (o.name ? o.name + '[min]' : null));
        hiddenB = F.hidden(el, o.nameMax || (o.name ? o.name + '[max]' : null));
      }
      var outs = R.$$('[data-slider-output]', el.closest('.field') || el.parentNode);

      function render() {
        var pa = (vals[0] - min) / (max - min), pb = single ? pa : (vals[1] - min) / (max - min);
        el.style.setProperty('--a', single ? 0 : pa); el.style.setProperty('--b', pb);
        thumbs.forEach(function (t, i) {
          var v = vals[i];
          t.style.setProperty('--p', (v - min) / (max - min));
          t.setAttribute('aria-valuenow', v);
          t.setAttribute('aria-valuemin', i === 1 ? vals[0] + o.minGap : min);
          t.setAttribute('aria-valuemax', i === 0 && !single ? vals[1] - o.minGap : max);
          t.setAttribute('aria-valuetext', fmt(v, min, step));
          var b = t.querySelector('.slider-bubble'); if (b) b.textContent = fmt(v, min, step);
        });
        if (hiddenA) hiddenA.value = vals[0];
        if (hiddenB) hiddenB.value = vals[1];
        var txt = single ? fmt(vals[0], min, step) : fmt(vals[0], min, step) + ' – ' + fmt(vals[1], min, step);
        outs.forEach(function (x) { x.textContent = txt; });
        var lo = single ? min : vals[0], hi = single ? vals[0] : vals[1];
        tickEls.forEach(function (t, i) { t.toggleAttribute('data-on', marks[i].v >= lo && marks[i].v <= hi); });
        markEls.forEach(function (m, i) { m.toggleAttribute('data-on', marks[i].v === vals[0] || marks[i].v === vals[1]); });
        if (histEl) R.$$('span', histEl).forEach(function (s, i, arr) { var v = min + (i + .5) * (max - min) / arr.length; s.toggleAttribute('data-on', v >= lo && v <= hi); });
      }
      function set(i, v, commit) {
        v = snap(v, min, max, step);
        if (!single) { if (i === 0) v = Math.min(v, vals[1] - o.minGap); else v = Math.max(v, vals[0] + o.minGap); }
        if (v === vals[i] && !commit) return;
        var changed = v !== vals[i];
        vals[i] = v; render();
        var detail = { value: single ? vals[0] : vals.slice() };
        if (changed) R.emit(el, 'input', detail);
        if (commit) R.emit(el, 'change', detail);
        if (changed && hiddenA) try { hiddenA.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
      }
      function valueAt(x) { var r = rail.getBoundingClientRect(); return min + R.clamp((x - r.left) / r.width, 0, 1) * (max - min); }

      var drag = -1, startVals = null;
      function down(e) {
        if (o.disabled || e.button > 0) return;
        var v = valueAt(e.clientX), i = 0;
        var th = e.target.closest('.slider-thumb');
        if (th) i = thumbs.indexOf(th);
        else if (!single) { i = Math.abs(v - vals[0]) <= Math.abs(v - vals[1]) ? 0 : 1; if (vals[0] === vals[1]) i = v < vals[0] ? 0 : 1; }
        drag = i; startVals = vals.slice();
        e.preventDefault();
        thumbs[i].focus({ preventScroll: true });
        thumbs[i].setAttribute('data-dragging', '');
        try { rail.setPointerCapture(e.pointerId); } catch (err) {}
        if (!th) { el.setAttribute('data-animate', ''); set(i, v); setTimeout(function () { el.removeAttribute('data-animate'); }, 300); }
      }
      function move(e) { if (drag < 0) return; el.removeAttribute('data-animate'); set(drag, valueAt(e.clientX)); }
      function up() {
        if (drag < 0) return;
        thumbs[drag].removeAttribute('data-dragging');
        var changed = startVals.some(function (v, i) { return v !== vals[i]; });
        if (changed) R.emit(el, 'change', { value: single ? vals[0] : vals.slice() });
        drag = -1;
      }
      function key(e) {
        var i = thumbs.indexOf(e.currentTarget), big = Math.max(step, (max - min) / 10), v = vals[i];
        var k = e.key;
        if (k === 'ArrowRight' || k === 'ArrowUp') v += e.shiftKey ? big : step;
        else if (k === 'ArrowLeft' || k === 'ArrowDown') v -= e.shiftKey ? big : step;
        else if (k === 'PageUp') v += big;
        else if (k === 'PageDown') v -= big;
        else if (k === 'Home') v = i === 1 ? vals[0] + o.minGap : min;
        else if (k === 'End') v = i === 0 && !single ? vals[1] - o.minGap : max;
        else return;
        e.preventDefault();
        set(i, v, true);
      }
      var offs = [R.on(rail, 'pointerdown', down), R.on(rail, 'pointermove', move), R.on(rail, 'pointerup', up), R.on(rail, 'pointercancel', up), R.on(rail, 'lostpointercapture', up)];
      thumbs.forEach(function (t) { offs.push(R.on(t, 'keydown', key)); });
      render();
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); },
        get value() { return single ? vals[0] : vals.slice(); },
        set value(v) { var a = [].concat(v); a.forEach(function (x, i) { vals[i] = snap(+x, min, max, step); }); render(); }
      };
    }
  });
})(window.Ranj);

;
/* --- components/forms/switch.js --- */
/* Switch — role="switch", missing track/thumb insertion, async loading helper */
(function (R) {
  'use strict';
  R.define('switch', {
    selector: 'label.switch',
    mount: function (el) {
      var inp = el.querySelector(':scope > input[type="checkbox"]'); if (!inp) return;
      if (!inp.hasAttribute('role')) inp.setAttribute('role', 'switch');
      var track = el.querySelector('.switch-track');
      if (!track) {
        track = document.createElement('span'); track.className = 'switch-track'; track.setAttribute('aria-hidden', 'true');
        track.innerHTML = '<span class="switch-thumb"></span>';
        inp.insertAdjacentElement('afterend', track);
      } else if (!track.querySelector('.switch-thumb')) track.insertAdjacentHTML('beforeend', '<span class="switch-thumb"></span>');
      function sync() { inp.setAttribute('aria-checked', String(inp.checked)); }
      var off = R.on(inp, 'change', function () { sync(); R.emit(el, 'change', { value: inp.checked, checked: inp.checked }); });
      sync();
      return off;
    }
  });
  /** Ranj.switchLoading(labelEl, true|false) — shows a spinner in the thumb and sets aria-busy */
  R.switchLoading = function (el, on) {
    el.toggleAttribute('data-loading', !!on);
    var inp = el.querySelector('input'); if (inp) inp.setAttribute('aria-busy', String(!!on));
  };
})(window.Ranj);

;
/* --- components/forms/tag-input.js --- */
/* Tag input — type and press Enter / comma to add, paste to split, Backspace to remove, max tags, pattern check */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('tag-input', {
    selector: '.tag-input',
    mount: function (el) {
      var o = R.opts(el, { name: '', value: '', max: 0, placeholder: 'Add a tag…', separators: ',;', pattern: '', allowDuplicates: false, lowercase: false, maxLength: 0, suggestions: '' });
      var box = el.querySelector('.chip-box');
      if (!box) { box = document.createElement('div'); box.className = 'chip-box tag-input-box'; el.appendChild(box); }
      var input = box.querySelector('input');
      if (!input) { input = document.createElement('input'); input.type = 'text'; box.appendChild(input); }
      input.classList.add('tag-input-field'); input.autocomplete = 'off';
      if (el.getAttribute('aria-label') && !input.hasAttribute('aria-label')) input.setAttribute('aria-label', el.getAttribute('aria-label'));
      var describe = document.createElement('span'); describe.className = 'f-sr'; describe.id = R.uid('tagh');
      describe.textContent = 'Press Enter or comma to add. Backspace removes the last tag.';
      el.appendChild(describe);
      input.setAttribute('aria-describedby', ((input.getAttribute('aria-describedby') || '') + ' ' + describe.id).trim());
      var live = document.createElement('span'); live.className = 'f-sr'; live.setAttribute('aria-live', 'polite'); el.appendChild(live);
      var re = o.pattern ? new RegExp(o.pattern === 'email' ? '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' : o.pattern) : null;
      var multi = /\[\]$/.test(o.name);
      var tags = [];
      R.$$('.input-chip', box).forEach(function (c) { tags.push(c.getAttribute('data-value') || c.textContent.trim()); c.remove(); });
      if (o.value) String(o.value).split(',').forEach(function (t) { t = t.trim(); if (t) tags.push(t); });
      var count = el.querySelector('.tag-input-count');

      function sync(anim) {
        R.$$('.input-chip', box).forEach(function (c) { c.remove(); });
        tags.forEach(function (t, i) {
          var c = document.createElement('span'); c.className = 'input-chip'; c.setAttribute('data-value', t);
          if (re && !re.test(t)) c.setAttribute('data-invalid', '');
          if (anim !== i) c.style.animation = 'none';
          c.innerHTML = '<span class="input-chip-label">' + R.esc(t) + '</span><button type="button" class="input-chip-remove" tabindex="-1" aria-label="Remove ' + R.esc(t) + '">' + F.icons.x + '</button>';
          box.insertBefore(c, input);
        });
        input.placeholder = tags.length ? (el.getAttribute('data-placeholder-more') || '') : o.placeholder;
        var full = !!o.max && tags.length >= o.max;
        el.toggleAttribute('data-full', full);
        input.readOnly = full;
        if (full) input.placeholder = '';
        if (count) count.textContent = tags.length + (o.max ? ' / ' + o.max : '');
        // hidden inputs
        R.$$('input[data-f-hidden]', el).forEach(function (h) { h.remove(); });
        if (o.name) {
          if (multi) tags.forEach(function (t) { var h = document.createElement('input'); h.type = 'hidden'; h.name = o.name; h.value = t; h.setAttribute('data-f-hidden', ''); el.appendChild(h); });
          else F.hidden(el, o.name, tags.join(','));
        }
      }
      function emit() { R.emit(el, 'change', { value: tags.slice() }); }
      function add(raw) {
        var t = String(raw).trim().replace(/\s+/g, ' ');
        if (!t) return false;
        if (o.lowercase) t = t.toLowerCase();
        if (o.maxLength) t = t.slice(0, o.maxLength);
        if (o.max && tags.length >= o.max) { F.shake(box); R.emit(el, 'reject', { value: t, reason: 'max' }); return false; }
        if (!o.allowDuplicates) {
          var i = tags.map(function (x) { return x.toLowerCase(); }).indexOf(t.toLowerCase());
          if (i > -1) { var c = R.$$('.input-chip', box)[i]; F.shake(c); R.emit(el, 'reject', { value: t, reason: 'duplicate' }); return false; }
        }
        var ev = R.emit(el, 'add', { value: t });
        if (!ev) return false;
        tags.push(t); sync(tags.length - 1); live.textContent = t + ' added';
        return true;
      }
      function removeAt(i) {
        if (i < 0 || i >= tags.length) return;
        var chip = R.$$('.input-chip', box)[i], t = tags[i];
        var done = function () { tags.splice(i, 1); sync(-1); live.textContent = t + ' removed'; R.emit(el, 'remove', { value: t }); emit(); };
        if (chip && !R.reducedMotion) { chip.setAttribute('data-leaving', ''); setTimeout(done, 150); } else done();
      }
      function commit() {
        var v = input.value;
        if (!v.trim()) return false;
        var parts = v.split(new RegExp('[' + o.separators.replace(/[\]\\^-]/g, '\\$&') + '\\n]'));
        var any = false;
        parts.forEach(function (p) { if (add(p)) any = true; });
        input.value = '';
        if (any) emit();
        return true;
      }
      function clearActive() { R.$$('.input-chip[data-active]', box).forEach(function (c) { c.removeAttribute('data-active'); }); }

      var offs = [
        R.on(box, 'mousedown', function (e) { if (e.target !== input) { e.preventDefault(); input.focus(); } }),
        R.on(box, 'click', '.input-chip-remove', function (e, b) { removeAt(R.$$('.input-chip', box).indexOf(b.parentNode)); input.focus(); }),
        R.on(input, 'keydown', function (e) {
          var k = e.key, active = box.querySelector('.input-chip[data-active]');
          if (e.isComposing) return;
          if (k === 'Enter' || (o.separators.indexOf(k) > -1 && k.length === 1) || (k === 'Tab' && input.value.trim())) {
            if (input.value.trim()) { e.preventDefault(); commit(); }
            else if (k !== 'Tab' && k !== 'Enter') e.preventDefault();
            return;
          }
          if (k === 'Backspace' && !input.value) {
            e.preventDefault();
            if (active) removeAt(R.$$('.input-chip', box).indexOf(active));
            else { var all = R.$$('.input-chip', box); if (all.length) all[all.length - 1].setAttribute('data-active', ''); }
            return;
          }
          if (k === 'Escape' && active) { clearActive(); return; }
          clearActive();
        }),
        R.on(input, 'paste', function (e) {
          var text = (e.clipboardData || window.clipboardData).getData('text');
          if (!text || !new RegExp('[' + o.separators.replace(/[\]\\^-]/g, '\\$&') + '\\n\\t]').test(text)) return;
          e.preventDefault();
          var any = false;
          text.split(new RegExp('[' + o.separators.replace(/[\]\\^-]/g, '\\$&') + '\\n\\t]')).forEach(function (p) { if (add(p)) any = true; });
          if (any) emit();
        }),
        R.on(input, 'blur', function () { clearActive(); if (el.hasAttribute('data-add-on-blur')) commit(); })
      ];
      sync(-1);
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); },
        add: function (t) { if (add(t)) emit(); }, remove: function (t) { removeAt(tags.indexOf(t)); },
        get value() { return tags.slice(); },
        set value(arr) { tags = (arr || []).slice(); sync(-1); }
      };
    }
  });
})(window.Ranj);

;
/* --- components/forms/textarea.js --- */
/* Textarea — data-autosize (auto-grow) and data-maxlength (live counter with ring) */
(function (R) {
  'use strict';
  var C = 2 * Math.PI * 6;

  R.define('textarea-autosize', {
    selector: 'textarea[data-autosize]',
    mount: function (ta) {
      var o = R.opts(ta, { maxRows: 0, minRows: 0 });
      function fit() {
        var cs = getComputedStyle(ta);
        var lh = parseFloat(cs.lineHeight) || 20, pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom), bd = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        var prev = ta.style.transition; ta.style.transition = 'none';
        ta.style.height = 'auto';
        var h = ta.scrollHeight + bd;
        if (o.minRows) h = Math.max(h, o.minRows * lh + pad + bd);
        if (o.maxRows) { var max = o.maxRows * lh + pad + bd; ta.style.overflowY = h > max ? 'auto' : 'hidden'; h = Math.min(h, max); }
        ta.style.height = h + 'px';
        void ta.offsetHeight; ta.style.transition = prev;
      }
      var off = R.on(ta, 'input', fit);
      var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { if (ta.__w !== ta.offsetWidth) { ta.__w = ta.offsetWidth; fit(); } }) : null;
      if (ro) ro.observe(ta);
      fit();
      ta.__fit = fit;
      return function () { off(); if (ro) ro.disconnect(); };
    }
  });

  R.define('char-counter', {
    selector: '[data-maxlength]',
    mount: function (el) {
      if (!/^(TEXTAREA|INPUT)$/.test(el.tagName)) return;
      var max = parseInt(el.getAttribute('data-maxlength'), 10); if (!max) return;
      var counter = el.getAttribute('data-counter') ? document.querySelector(el.getAttribute('data-counter')) : null;
      var scope = el.closest('.field, .textarea-box');
      if (!counter && scope) counter = scope.querySelector('.field-counter');
      var created = null;
      if (!counter) {
        created = document.createElement('div'); created.className = 'textarea-counter-row';
        counter = document.createElement('span'); counter.className = 'field-counter';
        created.appendChild(counter);
        var anchor = el.closest('.input-wrap') || el;
        var hint = scope && scope.querySelector(':scope > .field-hint');
        if (hint && hint.previousElementSibling === anchor) { created.insertBefore(hint, counter); }
        anchor.insertAdjacentElement('afterend', created);
      }
      counter.setAttribute('aria-live', 'polite');
      var ring = el.hasAttribute('data-counter-ring');
      function upd() {
        var n = [].slice.call(el.value).length, left = max - n;
        var html = ring ? '<svg class="field-counter-ring" viewBox="0 0 16 16" aria-hidden="true"><circle class="track" cx="8" cy="8" r="6"/><circle class="bar" cx="8" cy="8" r="6" stroke-dasharray="' + C + '" stroke-dashoffset="' + (C * (1 - Math.min(1, n / max))) + '"/></svg>' : '';
        counter.innerHTML = html + '<span>' + (ring && left <= 20 ? left : n + ' / ' + max) + '</span>';
        counter.toggleAttribute('data-warn', left <= Math.max(10, max * 0.1) && left >= 0);
        counter.toggleAttribute('data-over', left < 0);
        if (left < 0) { el.setAttribute('aria-invalid', 'true'); el.__overMax = true; }
        else if (el.__overMax) { el.removeAttribute('aria-invalid'); el.__overMax = false; }
        counter.setAttribute('aria-label', left < 0 ? Math.abs(left) + ' characters over the limit' : left + ' characters left');
      }
      var off = R.on(el, 'input', upd);
      upd();
      return function () { off(); if (created) created.remove(); };
    }
  });
})(window.Ranj);

;
/* --- components/forms/time-picker.js --- */
/* Time picker — input + popover with hour / minute (/ AM-PM) columns, typed times, min/max, step */
(function (R) {
  'use strict';
  var F = R._forms;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function parse(s) {
    if (!s) return null;
    s = String(s).trim().toLowerCase().replace(/\s+/g, '');
    var m = /^(\d{1,2})(?::?(\d{2}))?(a|am|p|pm)?$/.exec(s);
    if (!m) return null;
    var h = +m[1], mi = m[2] ? +m[2] : 0;
    if (m[3]) { if (h < 1 || h > 12) return null; if (m[3][0] === 'p' && h < 12) h += 12; if (m[3][0] === 'a' && h === 12) h = 0; }
    if (h > 23 || mi > 59) return null;
    return h * 60 + mi;
  }

  R.define('time-picker', {
    selector: '.time-picker',
    mount: function (el) {
      var o = R.opts(el, { value: '', step: 5, format: '12', name: '', min: '', max: '', placeholder: 'Pick a time' });
      var h12 = String(o.format) === '12';
      var min = parse(o.min), max = parse(o.max);
      var input = el.querySelector('input:not([type="hidden"])'), wrap;
      if (!input) { el.insertAdjacentHTML('afterbegin', '<div class="input-wrap"><span class="input-icon">' + F.icons.clock + '</span><input type="text"></div>'); input = el.querySelector('input'); }
      wrap = input.closest('.input-wrap');
      if (!wrap) { wrap = document.createElement('div'); wrap.className = 'input-wrap'; input.classList.remove('input'); input.parentNode.insertBefore(wrap, input); wrap.appendChild(input); wrap.insertAdjacentHTML('afterbegin', '<span class="input-icon">' + F.icons.clock + '</span>'); }
      if (input.name && !o.name) { o.name = input.name; input.removeAttribute('name'); }
      input.autocomplete = 'off'; input.setAttribute('data-picker', '');
      if (!input.placeholder) input.placeholder = o.placeholder;
      var trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'input-btn time-picker-trigger';
      trigger.setAttribute('aria-label', 'Choose time'); trigger.setAttribute('aria-haspopup', 'dialog'); trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = F.icons.chevronDown; wrap.appendChild(trigger);
      var hidden = F.hidden(el, o.name || null);
      var val = parse(o.value || input.value);

      function label(v) { if (v == null) return ''; var h = Math.floor(v / 60), m = v % 60; return h12 ? ((h % 12) || 12) + ':' + pad(m) + ' ' + (h < 12 ? 'AM' : 'PM') : pad(h) + ':' + pad(m); }
      function ok(v) { return (min == null || v >= min) && (max == null || v <= max); }
      function sync() { input.value = label(val); if (hidden) hidden.value = val == null ? '' : pad(Math.floor(val / 60)) + ':' + pad(val % 60); el.toggleAttribute('data-has-value', val != null); }
      function commit() { sync(); if (hidden) try { hidden.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {} R.emit(el, 'change', { value: hidden ? hidden.value : (val == null ? '' : pad(Math.floor(val / 60)) + ':' + pad(val % 60)), minutes: val }); }

      var panel = document.createElement('div'); panel.className = 'picker-popover time-picker-panel'; panel.hidden = true;
      panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Choose time');
      var cols = [];
      function col(name, items) {
        var c = document.createElement('div'); c.className = 'time-col'; c.setAttribute('role', 'listbox'); c.setAttribute('aria-label', name);
        c.innerHTML = items.map(function (it) { return '<div class="time-opt" role="option" tabindex="-1" data-v="' + it.v + '" aria-selected="false">' + it.l + '</div>'; }).join('');
        panel.appendChild(c); cols.push(c); return c;
      }
      var hours = [];
      if (h12) for (var i = 1; i <= 12; i++) hours.push({ v: i % 12, l: String(i) }); else for (var j = 0; j < 24; j++) hours.push({ v: j, l: pad(j) });
      var mins = []; for (var m = 0; m < 60; m += Math.max(1, o.step)) mins.push({ v: m, l: pad(m) });
      var cH = col('Hours', hours), cM = col('Minutes', mins), cP = h12 ? col('AM or PM', [{ v: 0, l: 'AM' }, { v: 1, l: 'PM' }]) : null;

      function parts(v) { if (v == null) v = (min != null ? min : 9 * 60); var h = Math.floor(v / 60); return { h: h12 ? h % 12 : h, m: v % 60, p: h >= 12 ? 1 : 0 }; }
      function from(p) { return ((h12 ? p.h + (p.p ? 12 : 0) : p.h) * 60) + p.m; }
      function paint(scroll) {
        var p = parts(val);
        [[cH, p.h], [cM, p.m - (p.m % Math.max(1, o.step))], [cP, p.p]].forEach(function (pair) {
          var c = pair[0]; if (!c) return;
          R.$$('.time-opt', c).forEach(function (op) {
            var on = +op.getAttribute('data-v') === pair[1];
            op.setAttribute('aria-selected', String(on)); op.tabIndex = on ? 0 : -1;
            // disable options that would fall outside min/max
            var q = parts(val); if (c === cH) q.h = +op.getAttribute('data-v'); else if (c === cM) q.m = +op.getAttribute('data-v'); else q.p = +op.getAttribute('data-v');
            var t = from(q), dis = !ok(t);
            if (c === cH && dis) { var anyOk = false; for (var mm = 0; mm < 60; mm += Math.max(1, o.step)) { q.m = mm; if (ok(from(q))) { anyOk = true; break; } } dis = !anyOk; }
            op.toggleAttribute('data-disabled', dis); op.setAttribute('aria-disabled', String(dis));
            if (on && scroll) c.scrollTo({ top: op.offsetTop - c.clientHeight / 2 + op.offsetHeight / 2, behavior: scroll === 'smooth' && !R.reducedMotion ? 'smooth' : 'auto' });
          });
          if (!c.querySelector('[tabindex="0"]')) { var f = c.querySelector('.time-opt'); if (f) f.tabIndex = 0; }
        });
      }
      function choose(c, v) {
        var p = parts(val);
        if (c === cH) p.h = v; else if (c === cM) p.m = v; else p.p = v;
        var t = from(p);
        if (!ok(t)) { if (min != null && t < min) t = min; else if (max != null && t > max) t = max; }
        val = t; commit(); paint('smooth');
      }
      var closeFn = null;
      function open(focus) {
        if (closeFn || input.disabled) return;
        el.setAttribute('data-state', 'open'); trigger.setAttribute('aria-expanded', 'true');
        closeFn = F.float(panel, wrap, { placement: 'bottom-start', offset: 6, onClose: function (why) { closeFn = null; el.setAttribute('data-state', 'closed'); trigger.setAttribute('aria-expanded', 'false'); if (why === 'escape') input.focus(); } });
        paint(true);
        if (focus) setTimeout(function () { var f = cH.querySelector('[tabindex="0"]'); if (f) f.focus({ preventScroll: true }); }, 20);
      }
      function close() { if (closeFn) closeFn(); }

      var offs = [
        R.on(trigger, 'click', function () { if (closeFn) close(); else open(true); }),
        R.on(input, 'click', function () { open(false); }),
        R.on(input, 'keydown', function (e) {
          if (e.key === 'ArrowDown') { e.preventDefault(); open(true); }
          else if (e.key === 'Enter') { var v = parse(input.value); if (v != null && ok(v)) { val = v; commit(); } else sync(); close(); }
        }),
        R.on(input, 'blur', function () { setTimeout(function () { if (panel.contains(document.activeElement)) return; var v = parse(input.value); if (!input.value.trim()) { if (val != null) { val = null; commit(); } } else if (v != null && ok(v) && v !== val) { val = v; commit(); } else sync(); }, 0); }),
        R.on(panel, 'mousedown', function (e) { e.preventDefault(); }),
        R.on(panel, 'click', '.time-opt', function (e, op) { if (op.hasAttribute('data-disabled')) return; choose(op.parentNode, +op.getAttribute('data-v')); op.focus({ preventScroll: true }); }),
        R.on(panel, 'keydown', function (e) {
          var op = e.target.closest('.time-opt'); if (!op) return;
          var c = op.parentNode, list = R.$$('.time-opt:not([data-disabled])', c), i = list.indexOf(op), ci = cols.indexOf(c), n = null;
          if (e.key === 'ArrowDown') n = list[Math.min(list.length - 1, i + 1)];
          else if (e.key === 'ArrowUp') n = list[Math.max(0, i - 1)];
          else if (e.key === 'Home') n = list[0];
          else if (e.key === 'End') n = list[list.length - 1];
          else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); var nc = cols[(ci + (e.key === 'ArrowRight' ? 1 : -1) + cols.length) % cols.length]; var f = nc.querySelector('[aria-selected="true"]') || nc.querySelector('.time-opt'); if (f) f.focus(); return; }
          else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!op.hasAttribute('data-disabled')) choose(c, +op.getAttribute('data-v')); close(); input.focus(); return; }
          else if (e.key === 'Tab') { close(); return; }
          if (n) { e.preventDefault(); choose(c, +n.getAttribute('data-v')); n.focus({ preventScroll: true }); }
        })
      ];
      sync();
      return {
        destroy: function () { close(); offs.forEach(function (f) { f(); }); panel.remove(); },
        get value() { return hidden ? hidden.value : val; },
        set value(v) { val = parse(v); sync(); }
      };
    }
  });
})(window.Ranj);

;
/* --- components/forms/toggle.js --- */
/* Toggle (aria-pressed button) + Toggle group (single | multiple, roving tabindex, hidden input) */
(function (R) {
  'use strict';
  var F = R._forms;

  function pressed(t) { return t.getAttribute('aria-pressed') === 'true'; }
  function setPressed(t, on) { t.setAttribute('aria-pressed', String(on)); t.classList.toggle('active', on); t.setAttribute('data-state', on ? 'on' : 'off'); }
  function valueOf(t) { return t.getAttribute('data-value') || t.getAttribute('value') || t.getAttribute('aria-label') || t.textContent.trim(); }

  R.define('toggle', {
    selector: '.toggle',
    setup: function () {
      R.on(document, 'click', '.toggle', function (e, t) {
        if (t.disabled || t.getAttribute('aria-disabled') === 'true') return;
        var group = t.closest('.toggle-group');
        if (group && group.__ranjGroup) { group.__ranjGroup(t); return; }
        setPressed(t, !pressed(t));
        R.emit(t, 'change', { pressed: pressed(t), value: pressed(t) });
      });
    },
    mount: function (t) {
      if (t.tagName === 'BUTTON' && !t.hasAttribute('type')) t.type = 'button';
      if (!t.hasAttribute('aria-pressed')) setPressed(t, t.classList.contains('active') || t.getAttribute('data-state') === 'on');
      else t.setAttribute('data-state', pressed(t) ? 'on' : 'off');
    }
  });

  R.define('toggle-group', {
    selector: '.toggle-group',
    mount: function (g) {
      var multi = g.hasAttribute('data-multiple');
      var required = g.hasAttribute('data-required-one');   // single: can't deselect the last one
      var o = R.opts(g, { name: '', orientation: g.classList.contains('toggle-group-vertical') ? 'vertical' : 'horizontal' });
      if (!g.hasAttribute('role')) g.setAttribute('role', 'group');
      var hidden = F.hidden(g, o.name || null);
      function items() { return R.$$('.toggle', g); }
      function enabled() { return items().filter(function (t) { return !t.disabled; }); }
      function value() { var v = items().filter(pressed).map(valueOf); return multi ? v : (v[0] || ''); }
      function sync() {
        var list = enabled(), on = list.filter(pressed)[0] || list[0];
        list.forEach(function (t) { t.tabIndex = t === on ? 0 : -1; });
        items().forEach(function (t) { if (t.disabled) t.tabIndex = -1; });
        if (hidden) hidden.value = multi ? value().join(',') : value();
      }
      g.__ranjGroup = function (t) {
        var was = pressed(t);
        if (multi) setPressed(t, !was);
        else {
          if (was && required) return;
          items().forEach(function (x) { setPressed(x, false); });
          setPressed(t, !was);
        }
        sync();
        t.tabIndex = 0; items().forEach(function (x) { if (x !== t) x.tabIndex = -1; });
        R.emit(g, 'change', { value: value() });
      };
      var offRov = R.roving(g, '.toggle', { orientation: o.orientation, onMove: function (t) { items().forEach(function (x) { x.tabIndex = x === t ? 0 : -1; }); } });
      sync();
      return {
        destroy: function () { offRov(); g.__ranjGroup = null; },
        get value() { return value(); },
        set value(v) { var arr = [].concat(v); items().forEach(function (t) { setPressed(t, arr.indexOf(valueOf(t)) > -1); }); sync(); }
      };
    }
  });
})(window.Ranj);

;
/* --- components/overlays/00-kit.js --- */
/*!
 * Ranj UI — overlay kit (private helpers shared by the overlays group)
 * Presence (animate-then-hide), portals, floating placement that survives
 * transformed ancestors, and a full menu engine (roving, typeahead, submenus,
 * checkbox/radio items) used by dropdown-menu, context-menu and menubar.
 * Exposed as Ranj.__ov — internal, may change between versions.
 */
(function (R) {
  'use strict';
  if (R.__ov) return;
  var d = document, w = window;
  var K = R.__ov = {};

  /* ---------- Presence ---------- */
  /** Call cb once every finite animation in el's subtree has finished (max ms fallback). */
  K.afterAnim = function (el, cb, max) {
    var done = false;
    function fin() { if (done) return; done = true; cb(); }
    var list = [];
    try {
      list = (el.getAnimations ? el.getAnimations({ subtree: true }) : []).filter(function (a) {
        var t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
        return t && t.iterations !== Infinity && t.activeDuration !== Infinity && a.playState !== 'finished';
      });
    } catch (e) {}
    if (!list.length) { fin(); return; }
    Promise.all(list.map(function (a) { return a.finished.catch(function () {}); })).then(fin);
    setTimeout(fin, max || 800);
  };
  /** Show: data-state=open. Optional measure() runs while the element is laid out but invisible & un-animated. */
  K.show = function (el, measure) {
    el.__hideTok = null;
    el.removeAttribute('data-closing');
    if (el.hidden) el.hidden = false;
    if (measure) { el.setAttribute('data-measure', ''); try { measure(); } finally { el.removeAttribute('data-measure'); } }
    el.setAttribute('data-state', 'open');
  };
  /** Hide: data-state=closed + data-closing while the exit animation plays, then cb. */
  K.hide = function (el, cb) {
    if (el.getAttribute('data-state') !== 'open' && !el.hasAttribute('data-closing')) { if (cb) cb(); return; }
    el.setAttribute('data-state', 'closed');
    el.setAttribute('data-closing', '');
    var tok = el.__hideTok = {};
    K.afterAnim(el, function () {
      if (el.__hideTok !== tok) return;
      el.__hideTok = null;
      el.removeAttribute('data-closing');
      if (cb) cb();
    });
  };

  /* ---------- Portal (escape transformed / overflow ancestors) ---------- */
  K.portal = function (el) {
    if (el.__ph || el.parentNode === d.body) return;
    var ph = d.createComment('ranj-portal');
    el.parentNode.insertBefore(ph, el);
    el.__ph = ph;
    // keep scoped theme/accent when leaving its subtree
    var scope = ph.parentNode && ph.parentNode.closest ? ph.parentNode.closest('[data-accent],[data-theme]') : null;
    if (scope && scope !== d.documentElement) {
      ['data-accent', 'data-theme', 'data-radius'].forEach(function (a) { if (scope.hasAttribute(a) && !el.hasAttribute(a)) { el.setAttribute(a, scope.getAttribute(a)); (el.__phAttrs = el.__phAttrs || []).push(a); } });
    }
    d.body.appendChild(el);
  };
  K.unportal = function (el) {
    var ph = el.__ph; if (!ph) return;
    el.__ph = null;
    (el.__phAttrs || []).forEach(function (a) { el.removeAttribute(a); }); el.__phAttrs = null;
    if (ph.parentNode) { ph.parentNode.insertBefore(el, ph); ph.parentNode.removeChild(ph); }
    else if (el.parentNode) el.parentNode.removeChild(el);
  };

  /* ---------- Floating placement ---------- */
  /** R.position + correction when a transformed ancestor becomes the containing block of position:fixed. */
  K.place = function (fl, anchor, o) {
    var side = R.position(fl, anchor, o);
    var p = fl.parentNode;
    if (p && p !== d.body && p.nodeType === 1) {
      var pr = d.createElement('i');
      pr.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none';
      p.appendChild(pr);
      var r = pr.getBoundingClientRect();
      p.removeChild(pr);
      if (Math.abs(r.left) > .5 || Math.abs(r.top) > .5) {
        fl.style.left = Math.round(parseFloat(fl.style.left) - r.left) + 'px';
        fl.style.top = Math.round(parseFloat(fl.style.top) - r.top) + 'px';
      }
    }
    return side;
  };
  K.autoPlace = function (fl, anchor, o) {
    var raf = 0;
    function upd() { raf = 0; if (anchor.nodeType === 1 && !anchor.isConnected) return; K.place(fl, anchor, o); }
    function sch() { if (!raf) raf = requestAnimationFrame(upd); }
    w.addEventListener('scroll', sch, true);
    w.addEventListener('resize', sch);
    var ro = w.ResizeObserver ? new ResizeObserver(sch) : null;
    if (ro) { ro.observe(fl); if (anchor.nodeType === 1) ro.observe(anchor); }
    return function () { cancelAnimationFrame(raf); w.removeEventListener('scroll', sch, true); w.removeEventListener('resize', sch); if (ro) ro.disconnect(); };
  };

  /**
   * Open a floating element anchored to anchor. Returns handle { close(reason), el, open }.
   * o: placement, offset, shift, outside (true), layer (true), ignore [els], onClose(reason, e), onHidden()
   */
  K.float = function (fl, anchor, o) {
    o = o || {};
    var h = { el: fl, open: true };
    var po = { placement: o.placement || 'bottom', offset: o.offset == null ? 8 : o.offset, shift: o.shift, flip: o.flip };
    K.show(fl, function () { K.place(fl, anchor, po); });
    var stop = K.autoPlace(fl, anchor, po);
    var pop = o.layer === false ? null : R.pushLayer(function () { h.close('escape'); });
    var off = o.outside === false ? null : R.onOutside([fl].concat(o.ignore || []), function (e) { h.close('outside', e); });
    h.reposition = function () { K.place(fl, anchor, po); };
    h.close = function (reason, e) {
      if (!h.open) return;
      h.open = false;
      stop(); if (pop) pop(); if (off) off();
      if (o.onClose) o.onClose(reason, e);
      K.hide(fl, o.onHidden);
    };
    return h;
  };

  /** Add an arrow element to a floating panel once. */
  K.arrow = function (fl, cls) {
    if (!fl.querySelector(':scope > .ov-arrow')) {
      var a = d.createElement('span'); a.className = 'ov-arrow' + (cls ? ' ' + cls : ''); a.setAttribute('aria-hidden', 'true');
      fl.appendChild(a);
    }
  };

  /* ---------- Menu engine ---------- */
  var MENU = '.dropdown-menu,.context-menu,.menubar-content,[role="menu"]';
  var ITEM = '.dropdown-item,.context-menu-item,.menu-item,[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]';
  var SUBWRAP = '.dropdown-sub,.context-menu-sub,.menu-sub';
  K.MENU = MENU; K.ITEM = ITEM;

  function ownItems(menu, all) {
    return R.$$(ITEM, menu).filter(function (i) {
      return i.closest(MENU) === menu && (all || (!i.hasAttribute('disabled') && i.getAttribute('aria-disabled') !== 'true' && i.getClientRects().length));
    });
  }
  function subOf(item) {
    var p = item.parentElement;
    if (p && p.matches(SUBWRAP)) { var m = p.querySelector(':scope > ' + MENU.split(',').join(', :scope > ')); if (m && m !== item.closest(MENU)) return m; }
    var nx = item.nextElementSibling;
    if (nx && nx.matches(MENU)) return nx;
    return null;
  }
  function label(item) { return (item.getAttribute('data-text') || item.textContent || '').trim().toLowerCase(); }

  K.prepMenu = function (menu) {
    if (menu.__prepped) return;
    menu.__prepped = true;
    R.ensureId(menu, 'menu');
    if (!menu.getAttribute('role')) menu.setAttribute('role', 'menu');
    menu.setAttribute('tabindex', '-1');
    menu.setAttribute('aria-orientation', 'vertical');
    R.$$('.dropdown-separator,.context-menu-separator,.menu-separator', menu).forEach(function (s) { s.setAttribute('role', 'separator'); });
    R.$$('.dropdown-radio-group,.menu-radio-group,[data-radio-group]', menu).forEach(function (g) { g.setAttribute('role', 'group'); });
    R.$$(ITEM, menu).forEach(function (i) {
      if (!i.getAttribute('role')) {
        if (i.closest('.dropdown-radio-group,.menu-radio-group,[data-radio-group]')) i.setAttribute('role', 'menuitemradio');
        else if (i.hasAttribute('data-checkbox') || i.hasAttribute('aria-checked')) i.setAttribute('role', 'menuitemcheckbox');
        else i.setAttribute('role', 'menuitem');
      }
      var r = i.getAttribute('role');
      if ((r === 'menuitemcheckbox' || r === 'menuitemradio') && !i.hasAttribute('aria-checked')) i.setAttribute('aria-checked', 'false');
      i.setAttribute('tabindex', '-1');
      if (i.hasAttribute('disabled') || i.hasAttribute('data-disabled')) i.setAttribute('aria-disabled', 'true');
      if (i.tagName === 'BUTTON' && !i.getAttribute('type')) i.setAttribute('type', 'button');
      var sm = subOf(i);
      if (sm) { i.setAttribute('aria-haspopup', 'menu'); i.setAttribute('aria-expanded', 'false'); i.setAttribute('data-sub-trigger', ''); i.setAttribute('aria-controls', R.ensureId(sm, 'menu')); }
    });
  };

  /**
   * K.menu(menuEl, anchorElOr{x,y}, o) → handle
   * o: placement, offset, focus ('first'|'last'|'menu'), parent, trigger, ignore, onClose(reason), onArrow(dir) → true if handled
   */
  K.menu = function (menu, anchor, o) {
    o = o || {};
    K.prepMenu(menu);
    var h = { menu: menu, parent: o.parent || null, sub: null, open: true, trigger: o.trigger || null };
    var po = { placement: o.placement || 'bottom-start', offset: o.offset == null ? 6 : o.offset };
    K.show(menu, function () { K.place(menu, anchor, po); });
    var stop = K.autoPlace(menu, anchor, po);
    var pop = R.pushLayer(function () { h.close('escape'); });
    var off = h.parent ? null : R.onOutside([menu].concat(o.ignore || []), function (e) { h.closeAll('outside', e); });
    var subTimer = 0, ta = '', taTimer = 0;

    function focusItem(it) { if (it) try { it.focus({ preventScroll: false }); } catch (e) {} }
    function cur() { var a = d.activeElement; return a && a.closest && a.closest(MENU) === menu ? a.closest(ITEM) : null; }

    function openSub(item, focus) {
      clearTimeout(subTimer);
      if (h.sub && h.sub.trigger === item) { if (focus) { var f = ownItems(h.sub.menu)[0]; focusItem(f); } return; }
      closeSub();
      var sm = subOf(item); if (!sm) return;
      item.setAttribute('aria-expanded', 'true'); item.setAttribute('data-state', 'open');
      h.sub = K.menu(sm, item, { placement: 'right-start', offset: 4, parent: h, trigger: item, focus: focus ? 'first' : 'none', onArrow: o.onArrow });
    }
    function closeSub() { clearTimeout(subTimer); if (h.sub) h.sub.close('sub'); }

    function activate(item, e) {
      if (!item || item.getAttribute('aria-disabled') === 'true') return;
      if (item.hasAttribute('data-sub-trigger')) { openSub(item, true); return; }
      var role = item.getAttribute('role'), checked;
      if (role === 'menuitemcheckbox') { checked = item.getAttribute('aria-checked') !== 'true'; item.setAttribute('aria-checked', String(checked)); }
      else if (role === 'menuitemradio') {
        var g = item.closest('[role="group"]') || menu;
        R.$$('[role="menuitemradio"]', g).forEach(function (r) { r.setAttribute('aria-checked', r === item ? 'true' : 'false'); });
        checked = true;
      }
      var ok = R.emit(item, 'select', { item: item, value: item.getAttribute('data-value') || item.textContent.trim(), checked: checked });
      var keep = item.hasAttribute('data-keep-open') || ((role === 'menuitemcheckbox' || role === 'menuitemradio') && !item.hasAttribute('data-close'));
      if (ok && !keep) {
        h.closeAll('select');
        // anchors navigate naturally; buttons fire their own click handlers
        if (e && e.type === 'keydown' && item.tagName === 'A') item.click();
      }
    }

    function onKey(e) {
      if (e.target !== menu && (!e.target.closest || e.target.closest(MENU) !== menu)) return;
      var list = ownItems(menu), c = cur(), i = list.indexOf(c), k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowUp') {
        e.preventDefault();
        if (!list.length) return;
        var n = k === 'ArrowDown' ? (i < 0 ? 0 : (i + 1) % list.length) : (i <= 0 ? list.length - 1 : i - 1);
        focusItem(list[n]);
      } else if (k === 'Home' || k === 'PageUp') { e.preventDefault(); focusItem(list[0]); }
      else if (k === 'End' || k === 'PageDown') { e.preventDefault(); focusItem(list[list.length - 1]); }
      else if (k === 'ArrowRight') {
        e.preventDefault();
        if (c && c.hasAttribute('data-sub-trigger')) openSub(c, true);
        else if (o.onArrow) o.onArrow('right', h);
      } else if (k === 'ArrowLeft') {
        e.preventDefault();
        if (h.parent) { var t = h.trigger; h.close('left'); focusItem(t); }
        else if (o.onArrow) o.onArrow('left', h);
      } else if (k === 'Enter' || k === ' ') {
        if (c) { e.preventDefault(); activate(c, e); }
      } else if (k === 'Tab') {
        e.preventDefault(); h.closeAll('tab');
      } else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        clearTimeout(taTimer); ta += k.toLowerCase(); taTimer = setTimeout(function () { ta = ''; }, 600);
        var start = i < 0 ? 0 : (ta.length === 1 ? i + 1 : i), m = null;
        for (var j = 0; j < list.length; j++) { var it = list[(start + j) % list.length]; if (label(it).indexOf(ta) === 0) { m = it; break; } }
        if (m) { e.preventDefault(); focusItem(m); }
      }
    }
    function onMove(e) {
      if (e.pointerType === 'touch' || !e.target.closest) return;
      if (e.target.closest(MENU) !== menu) { clearTimeout(subTimer); return; } // pointer reached a submenu
      var it = e.target.closest(ITEM);
      if (!it) return;
      if (it.getAttribute('aria-disabled') === 'true') { if (d.activeElement !== menu && cur()) menu.focus({ preventScroll: true }); return; }
      if (d.activeElement !== it) try { it.focus({ preventScroll: true }); } catch (x) {}
      clearTimeout(subTimer);
      if (it.hasAttribute('data-sub-trigger')) subTimer = setTimeout(function () { openSub(it, false); }, 90);
      else if (h.sub) subTimer = setTimeout(closeSub, 260);
    }
    function onLeave(e) {
      if (e.pointerType === 'touch') return;
      if (!h.sub && cur() && !(e.relatedTarget && menu.contains(e.relatedTarget))) try { menu.focus({ preventScroll: true }); } catch (x) {}
    }
    function onClick(e) {
      var it = e.target.closest && e.target.closest(ITEM);
      if (!it || it.closest(MENU) !== menu) return;
      if (it.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      activate(it, e);
    }
    menu.addEventListener('keydown', onKey);
    menu.addEventListener('pointermove', onMove);
    menu.addEventListener('pointerleave', onLeave);
    menu.addEventListener('click', onClick);

    h.close = function (reason) {
      if (!h.open) return;
      h.open = false;
      closeSub();
      clearTimeout(taTimer);
      stop(); pop(); if (off) off();
      menu.removeEventListener('keydown', onKey);
      menu.removeEventListener('pointermove', onMove);
      menu.removeEventListener('pointerleave', onLeave);
      menu.removeEventListener('click', onClick);
      if (h.parent) { h.parent.sub = null; if (h.trigger) { h.trigger.setAttribute('aria-expanded', 'false'); h.trigger.removeAttribute('data-state'); } }
      K.hide(menu);
      if (o.onClose) o.onClose(reason);
    };
    h.closeAll = function (reason, e) { var r = h; while (r.parent) r = r.parent; r.close(reason, e); };
    h.focusFirst = function () { focusItem(ownItems(menu)[0]); };

    var f = o.focus || 'menu';
    if (f === 'first') focusItem(ownItems(menu)[0]);
    else if (f === 'last') { var l = ownItems(menu); focusItem(l[l.length - 1]); }
    else if (f !== 'none') try { menu.focus({ preventScroll: true }); } catch (x) {}
    return h;
  };

  /* ---------- Tiny shared utils ---------- */
  K.icon = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.7 7.7a1 1 0 0 0-1.4-1.4L10.5 13l-1.8-1.8a1 1 0 1 0-1.4 1.4l2.5 2.5a1 1 0 0 0 1.4 0l5.5-5.4Z" clip-rule="evenodd"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5a1 1 0 0 1 1 1v4.5a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm0 8.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" clip-rule="evenodd"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10.3 3.3a2 2 0 0 1 3.4 0l8 13.8A2 2 0 0 1 20 20H4a2 2 0 0 1-1.7-2.9l8-13.8ZM12 8a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Zm0 7.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" clip-rule="evenodd"/></svg>',
    infoFill: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5.3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 11a1 1 0 0 0-1 1v4.5a1 1 0 1 0 2 0V12a1 1 0 0 0-1-1Z" clip-rule="evenodd"/></svg>'
  };
})(window.Ranj);

;
/* --- components/overlays/accordion.js --- */
/*!
 * Ranj UI — accordion + collapsible.
 * Accordion: .accordion > .accordion-item[data-state] > .accordion-trigger + .accordion-content > .accordion-body
 *   Single by default (opening one closes others); data-multiple (v1) or data-type="multiple" for many.
 *   data-collapsible="false" keeps one item always open. ↑ ↓ Home End move between triggers.
 * Collapsible: .collapsible[data-state] > .collapsible-trigger + .collapsible-content
 * Events: ranj:change { item, open } on the accordion / collapsible. API: Ranj.accordion.toggle(item, open?), Ranj.collapsible.toggle(el, open?)
 */
(function (R) {
  'use strict';
  var d = document;

  function wrapInner(content, cls) {
    var kids = Array.prototype.filter.call(content.childNodes, function (n) { return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()); });
    if (kids.length === 1 && kids[0].nodeType === 1) return kids[0];
    var w = d.createElement('div'); w.className = cls;
    while (content.firstChild) w.appendChild(content.firstChild);
    content.appendChild(w);
    return w;
  }
  function setOpen(item, trigger, content, open) {
    item.setAttribute('data-state', open ? 'open' : 'closed');
    trigger.setAttribute('aria-expanded', String(open));
    if (content) { content.inert = !open; if (!open) content.setAttribute('aria-hidden', 'true'); else content.removeAttribute('aria-hidden'); }
  }

  R.define('accordion', {
    selector: '.accordion',
    mount: function (acc) {
      var multiple = acc.hasAttribute('data-multiple') || acc.getAttribute('data-type') === 'multiple';
      var collapsible = acc.getAttribute('data-collapsible') !== 'false';
      function items() { return R.$$('.accordion-item', acc).filter(function (i) { return i.closest('.accordion') === acc; }); }
      function parts(item) {
        return { t: item.querySelector(':scope > .accordion-trigger') || item.querySelector('.accordion-trigger'), c: item.querySelector(':scope > .accordion-content') };
      }
      items().forEach(function (item) {
        var p = parts(item); if (!p.t) return;
        if (p.t.tagName === 'BUTTON' && !p.t.getAttribute('type')) p.t.setAttribute('type', 'button');
        if (p.c) {
          wrapInner(p.c, 'accordion-body');
          p.c.setAttribute('role', 'region');
          p.t.setAttribute('aria-controls', R.ensureId(p.c, 'acc'));
          p.c.setAttribute('aria-labelledby', R.ensureId(p.t, 'acc-t'));
        }
        setOpen(item, p.t, p.c, item.getAttribute('data-state') === 'open' || item.hasAttribute('open'));
      });
      function toggle(item, force) {
        var p = parts(item); if (!p.t) return;
        var open = force != null ? !!force : item.getAttribute('data-state') !== 'open';
        if (!open && !collapsible && !multiple) return;
        if (open && !multiple) items().forEach(function (o) { if (o !== item && o.getAttribute('data-state') === 'open') { var q = parts(o); setOpen(o, q.t, q.c, false); R.emit(acc, 'change', { item: o, open: false }); } });
        setOpen(item, p.t, p.c, open);
        R.emit(acc, 'change', { item: item, open: open, value: item.getAttribute('data-value') });
      }
      var offs = [
        R.on(acc, 'click', '.accordion-trigger', function (e, t) { var item = t.closest('.accordion-item'); if (item && item.closest('.accordion') === acc) toggle(item); }),
        R.on(acc, 'keydown', '.accordion-trigger', function (e, t) {
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].indexOf(e.key) < 0) return;
          var ts = items().map(function (i) { return parts(i).t; }).filter(function (x) { return x && !x.disabled; });
          var i = ts.indexOf(t); if (i < 0) return;
          e.preventDefault();
          var n = e.key === 'ArrowDown' ? (i + 1) % ts.length : e.key === 'ArrowUp' ? (i - 1 + ts.length) % ts.length : e.key === 'Home' ? 0 : ts.length - 1;
          ts[n].focus();
        })
      ];
      acc.__acc = { toggle: toggle };
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  R.define('collapsible', {
    selector: '.collapsible',
    mount: function (el) {
      var t = R.$$('.collapsible-trigger', el).filter(function (x) { return x.closest('.collapsible') === el; })[0];
      var c = R.$$('.collapsible-content', el).filter(function (x) { return x.closest('.collapsible') === el; })[0];
      if (!t) return;
      if (t.tagName === 'BUTTON' && !t.getAttribute('type')) t.setAttribute('type', 'button');
      if (!/^(BUTTON|A|SUMMARY)$/.test(t.tagName) && !t.hasAttribute('tabindex')) { t.setAttribute('tabindex', '0'); t.setAttribute('role', 'button'); }
      if (c) { wrapInner(c, 'collapsible-inner'); t.setAttribute('aria-controls', R.ensureId(c, 'col')); }
      setOpen(el, t, c, el.getAttribute('data-state') === 'open');
      function toggle(force) {
        var open = force != null ? !!force : el.getAttribute('data-state') !== 'open';
        setOpen(el, t, c, open);
        R.emit(el, 'change', { open: open });
      }
      var offs = [
        R.on(t, 'click', function (e) { if (t.tagName === 'A') e.preventDefault(); toggle(); }),
        R.on(t, 'keydown', function (e) { if (t.getAttribute('role') === 'button' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggle(); } })
      ];
      el.__col = { toggle: toggle };
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  R.accordion = { toggle: function (item, open) { item = typeof item === 'string' ? d.querySelector(item) : item; var acc = item && item.closest('.accordion'); if (acc && acc.__acc) acc.__acc.toggle(item, open); } };
  R.collapsible = { toggle: function (el, open) { el = typeof el === 'string' ? d.querySelector(el) : el; if (el && el.__col) el.__col.toggle(open); } };
})(window.Ranj);

;
/* --- components/overlays/action-loading.js --- */
/*!
 * Ranj UI — action loading dialog. A .action-dialog holds .action-view[data-view="confirm|loading|success|error"].
 * Only one view shows; switching morphs the panel height and crossfades.
 *   Ranj.actionDialog.view(el, 'loading')                → switch view
 *   Ranj.actionDialog.run(el, () => promise, { autoClose }) → loading → success/error (closes after success)
 *   [data-action-run] button: runs the task set with Ranj.actionDialog.task(el, fn); without one it fires
 *   ranj:run { done(), fail(msg) } on the dialog, and falls back to a simulated success after data-duration (1600ms).
 * .action-status[data-messages="Validating…|Charging…"] cycles while loading. Events: ranj:change { view }.
 */
(function (R) {
  'use strict';
  var d = document;
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var CROSS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>';

  function get(x) {
    var el = typeof x === 'string' ? d.getElementById(x) : x;
    if (el && !el.classList.contains('action-dialog')) el = el.querySelector('.action-dialog') || el.closest('.action-dialog');
    return el;
  }
  function confetti(view) {
    if (R.reducedMotion || view.querySelector('.action-confetti')) return;
    var c = d.createElement('div'); c.className = 'action-confetti';
    var cols = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--info)', '#f472b6'];
    for (var i = 0; i < 22; i++) {
      var a = (i / 22) * Math.PI * 2, r = 70 + Math.random() * 70;
      c.innerHTML += '<i style="--c:' + cols[i % cols.length] + ';--x:' + Math.round(Math.cos(a) * r) + 'px;--y:' + Math.round(Math.sin(a) * r * .8 - 20) + 'px;--r:' + Math.round(Math.random() * 540) + 'deg;--d:' + (120 + Math.random() * 120 | 0) + 'ms"></i>';
    }
    view.appendChild(c);
    setTimeout(function () { c.remove(); }, 1500);
  }

  function setView(el, name, info) {
    el = get(el); if (!el) return;
    var views = R.$$(':scope > .action-view', el), next = views.filter(function (v) { return v.getAttribute('data-view') === name; })[0];
    var cur = views.filter(function (v) { return v.hasAttribute('data-active'); })[0];
    if (!next || next === cur) return;
    if (info) {
      if (info.title) { var t = next.querySelector('h3,.action-title'); if (t) t.textContent = info.title; }
      if (info.text) { var p = next.querySelector('p,.action-text'); if (p) p.textContent = info.text; }
    }
    var from = el.offsetHeight;
    if (cur) { cur.removeAttribute('data-active'); cur.setAttribute('data-leaving', ''); setTimeout(function () { cur.removeAttribute('data-leaving'); }, 230); }
    next.setAttribute('data-active', '');
    el.setAttribute('data-view', name);
    el.setAttribute('aria-busy', String(name === 'loading'));
    // morph height
    if (from && !R.reducedMotion) {
      el.style.height = 'auto';
      var to = el.offsetHeight;
      el.style.height = from + 'px'; void el.offsetHeight; el.style.height = to + 'px';
      clearTimeout(el.__hT); el.__hT = setTimeout(function () { el.style.height = ''; }, 480);
    }
    var status = next.querySelector('.action-status[data-messages]');
    clearInterval(el.__msg);
    if (status) {
      var msgs = status.getAttribute('data-messages').split('|'), i = 0;
      status.textContent = msgs[0];
      el.__msg = setInterval(function () { i = (i + 1) % msgs.length; if (i === 0 && next.hasAttribute('data-once')) return; status.textContent = msgs[i]; status.removeAttribute('data-swap'); void status.offsetWidth; status.setAttribute('data-swap', ''); }, +(status.getAttribute('data-interval') || 900));
    }
    if (name === 'success' && el.hasAttribute('data-celebrate')) confetti(next);
    var focusT = next.querySelector('[autofocus],.btn');
    if (focusT && el.contains(d.activeElement)) setTimeout(function () { try { focusT.focus({ preventScroll: true }); } catch (x) {} }, 60);
    else if (el.contains(d.activeElement) || d.activeElement === d.body) try { el.focus({ preventScroll: true }); } catch (x) {}
    R.emit(el, 'change', { view: name });
  }

  function run(x, task, o) {
    var el = get(x); if (!el) return Promise.resolve();
    o = o || {};
    var ov = el.closest('.dialog-overlay');
    if (ov && R.dialog && !R.dialog.isOpen(ov)) R.dialog.open(ov);
    setView(el, 'loading');
    var started = performance.now(), min = o.minDuration == null ? 900 : o.minDuration;
    var p = Promise.resolve(typeof task === 'function' ? task() : task);
    function after(fn) { return function (v) { var wait = Math.max(0, min - (performance.now() - started)); setTimeout(function () { fn(v); }, wait); return v; }; }
    p.then(after(function (v) {
      setView(el, 'success', typeof o.success === 'function' ? o.success(v) : o.success);
      var ac = o.autoClose != null ? o.autoClose : parseFloat(el.getAttribute('data-autoclose'));
      if (ov && ac > 0) setTimeout(function () { if (el.getAttribute('data-view') === 'success') R.dialog.close(ov, { reason: 'success' }); }, ac);
    }), after(function (er) {
      setView(el, 'error', typeof o.error === 'function' ? o.error(er) : (o.error || (er && er.message ? { text: er.message } : null)));
    }));
    return p;
  }

  R.define('action-loading', {
    selector: '.action-dialog',
    setup: function () {
      R.on(d, 'click', '[data-action-run]', function (e, b) {
        var el = b.closest('.action-dialog') || get(b.getAttribute('data-action-run'));
        if (!el) return;
        e.preventDefault();
        if (el.__task) { run(el, el.__task); return; }
        var settled = false, res, rej;
        var p = new Promise(function (a, r) { res = a; rej = r; });
        var handled = !R.emit(el, 'run', { done: function (v) { settled = true; res(v); }, fail: function (m) { settled = true; rej(new Error(m || 'Something went wrong')); } });
        if (!handled) setTimeout(function () { if (!settled) res(); }, parseFloat(el.getAttribute('data-duration')) || 1600);
        run(el, p, { minDuration: 0 });
      });
      R.on(d, 'click', '[data-action-view]', function (e, b) { var el = b.closest('.action-dialog'); if (el) setView(el, b.getAttribute('data-action-view')); });
    },
    mount: function (el) {
      if (!el.getAttribute('role') && !el.classList.contains('action-inline')) el.setAttribute('role', 'dialog');
      el.setAttribute('aria-live', 'polite');
      R.$$('.action-check:empty', el).forEach(function (c) { c.innerHTML = CHECK; });
      R.$$('.action-cross:empty', el).forEach(function (c) { c.innerHTML = CROSS; });
      var views = R.$$(':scope > .action-view', el);
      var start = el.getAttribute('data-view') || (views[0] && views[0].getAttribute('data-view'));
      views.forEach(function (v) { if (v.getAttribute('data-view') === start) v.setAttribute('data-active', ''); else v.removeAttribute('data-active'); });
      el.setAttribute('data-view', start);
      if (start === 'loading') setTimeout(function () { var s = el.getAttribute('data-view'); el.removeAttribute('data-view'); views.forEach(function (v) { v.removeAttribute('data-active'); }); setView(el, s); }, 0);
      var ov = el.closest('.dialog-overlay');
      var initial = start;
      var off = ov ? R.on(ov, 'ranj:closed', function () { setView(el, initial); clearInterval(el.__msg); }) : null;
      var off2 = ov ? R.on(ov, 'ranj:close', function () { clearInterval(el.__msg); }) : null;
      return function () { clearInterval(el.__msg); if (off) off(); if (off2) off2(); };
    }
  });

  R.actionDialog = {
    view: setView, run: run,
    task: function (x, fn) { var el = get(x); if (el) el.__task = fn; },
    open: function (x) { var el = get(x), ov = el && el.closest('.dialog-overlay'); if (ov) R.dialog.open(ov); }
  };
})(window.Ranj);

;
/* --- components/overlays/alert-dialog.js --- */
/*!
 * Ranj UI — alert dialog helpers.
 * Ranj.confirm({ title, description, confirmText, cancelText, danger, icon, onConfirm }) → Promise<boolean>
 * Ranj.prompt({ title, description, label, placeholder, defaultValue, type, confirmText, validate }) → Promise<string|null>
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var ICONS = {
    danger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    question: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
  };

  function build(o, kind) {
    var ov = d.createElement('div');
    ov.className = 'dialog-overlay';
    ov.id = R.uid('confirm');
    var icon = o.icon === false ? '' : (o.icon || (o.danger ? ICONS.danger : kind === 'prompt' ? ICONS.edit : ICONS.question));
    var field = '';
    if (kind === 'prompt') {
      var fid = R.uid('prompt');
      field = '<div class="alert-dialog-field">' + (o.label ? '<label class="label" for="' + fid + '">' + R.esc(o.label) + '</label>' : '') +
        '<input class="input" id="' + fid + '" type="' + R.esc(o.type || 'text') + '" autocomplete="off" placeholder="' + R.esc(o.placeholder || '') + '" value="' + R.esc(o.defaultValue || '') + '" data-autofocus>' +
        '<div class="alert-dialog-error" role="alert"></div></div>';
    }
    ov.innerHTML =
      '<div class="dialog alert-dialog' + (o.danger ? ' alert-dialog-danger' : '') + (o.centered ? ' alert-dialog-centered' : '') + '" role="alertdialog">' +
        '<form class="alert-dialog-form" novalidate>' +
          '<div class="alert-dialog-body">' + (icon ? '<div class="alert-dialog-media">' + icon + '</div>' : '') +
            '<div class="alert-dialog-text"><h2 class="alert-dialog-title">' + (o.html ? o.title : R.esc(o.title || 'Are you sure?')) + '</h2>' +
            (o.description ? '<p class="alert-dialog-description">' + (o.html ? o.description : R.esc(o.description)) + '</p>' : '') + field + '</div>' +
          '</div>' +
          '<div class="alert-dialog-footer">' +
            (o.cancelText === false ? '' : '<button type="button" class="btn btn-outline" data-act="cancel"' + (kind === 'confirm' && o.danger ? ' data-autofocus' : '') + '>' + R.esc(o.cancelText || 'Cancel') + '</button>') +
            '<button type="submit" class="btn' + (o.danger ? ' btn-destructive' : '') + '" data-act="ok"' + (kind === 'confirm' && !o.danger ? ' data-autofocus' : '') + '>' + R.esc(o.confirmText || (kind === 'prompt' ? 'Save' : 'Continue')) + '</button>' +
          '</div>' +
        '</form>' +
      '</div>';
    d.body.appendChild(ov);
    return ov;
  }

  function run(o, kind) {
    if (typeof o === 'string') o = { title: o };
    o = o || {};
    return new Promise(function (resolve) {
      var ov = build(o, kind), form = ov.querySelector('form'), ok = ov.querySelector('[data-act="ok"]');
      var input = ov.querySelector('.input'), err = ov.querySelector('.alert-dialog-error'), result = kind === 'prompt' ? null : false, busy = false;
      function finish(v) { result = v; R.dialog.close(ov, { reason: 'button', force: true }); }
      ov.addEventListener('ranj:beforeclose', function (e) { if (busy) e.preventDefault(); });
      ov.addEventListener('ranj:close', function () {
        resolve(result);
        setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 600);
      }, { once: true });
      ov.querySelector('[data-act="cancel"]') && ov.querySelector('[data-act="cancel"]').addEventListener('click', function () { if (!busy) finish(kind === 'prompt' ? null : false); });
      if (input) input.addEventListener('input', function () { err.textContent = ''; input.parentNode.removeAttribute('data-invalid'); input.removeAttribute('aria-invalid'); });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (busy) return;
        var val = input ? input.value : true;
        if (input && o.validate) {
          var msg = o.validate(val);
          if (msg !== true && msg !== undefined && msg !== null && msg !== '') {
            err.textContent = typeof msg === 'string' ? msg : 'Invalid value';
            input.parentNode.setAttribute('data-invalid', ''); input.setAttribute('aria-invalid', 'true'); input.focus();
            return;
          }
        }
        if (o.onConfirm) {
          var p = o.onConfirm(val);
          if (p && p.then) {
            busy = true; ok.classList.add('btn-loading'); ok.setAttribute('aria-busy', 'true'); ok.disabled = true;
            p.then(function () { busy = false; finish(kind === 'prompt' ? val : true); }, function (er) {
              busy = false; ok.classList.remove('btn-loading'); ok.disabled = false; ok.removeAttribute('aria-busy');
              if (err) err.textContent = (er && er.message) || 'Something went wrong';
            });
            return;
          }
        }
        finish(kind === 'prompt' ? val : true);
      });
      requestAnimationFrame(function () { R.dialog.open(ov); });
    });
  }

  R.confirm = function (o) { return run(o, 'confirm'); };
  R.prompt = function (o) { return run(o, 'prompt'); };
})(window.Ranj);

;
/* --- components/overlays/alert.js --- */
/*!
 * Ranj UI — alert dismiss. Click .alert-close (or [data-alert-close]) to collapse and remove the alert.
 * data-alert-hide on .alert → hide instead of removing (restore with Ranj.alert.show(el)).
 * Events: ranj:close (cancelable) on the alert before it collapses.
 */
(function (R) {
  'use strict';
  var d = document;

  function dismiss(el) {
    if (!el || el.hasAttribute('data-closing')) return;
    if (!R.emit(el, 'close', {})) return;
    var done = function () {
      if (el.hasAttribute('data-alert-hide')) { el.hidden = true; el.removeAttribute('data-closing'); el.removeAttribute('style'); }
      else if (el.parentNode) el.parentNode.removeChild(el);
    };
    if (R.reducedMotion) return done();
    el.style.height = el.offsetHeight + 'px';
    el.setAttribute('data-closing', '');
    void el.offsetHeight;
    el.style.height = '0px'; el.style.opacity = '0'; el.style.transform = 'translateY(-4px) scale(.98)';
    el.style.paddingTop = el.style.paddingBottom = '0px'; el.style.marginTop = el.style.marginBottom = '0px'; el.style.borderTopWidth = el.style.borderBottomWidth = '0px';
    var fin = false, f = function () { if (fin) return; fin = true; done(); };
    el.addEventListener('transitionend', function te(e) { if (e.target === el && e.propertyName === 'height') { el.removeEventListener('transitionend', te); f(); } });
    setTimeout(f, 450);
  }
  function show(el) {
    if (!el) return;
    el.hidden = false; el.removeAttribute('data-closing'); el.removeAttribute('style');
    el.removeAttribute('data-enter'); void el.offsetWidth; el.setAttribute('data-enter', '');
    R.emit(el, 'open', {});
  }

  R.define('alert', {
    selector: '.alert',
    setup: function () {
      R.on(d, 'click', '.alert-close,[data-alert-close]', function (e, b) { var el = b.closest('.alert'); if (el) { e.preventDefault(); dismiss(el); } });
    },
    mount: function (el) {
      if (!el.getAttribute('role')) el.setAttribute('role', el.matches('.alert-destructive,.alert-error,.alert-danger,.alert-warning') ? 'alert' : 'status');
      var c = el.querySelector('.alert-close');
      if (c && !c.getAttribute('aria-label')) c.setAttribute('aria-label', 'Dismiss');
    }
  });

  R.alert = { dismiss: function (el) { dismiss(typeof el === 'string' ? d.querySelector(el) : el); }, show: function (el) { show(typeof el === 'string' ? d.querySelector(el) : el); } };
})(window.Ranj);

;
/* --- components/overlays/back-to-top.js --- */
/*!
 * Ranj UI — back to top + scrollspy.
 * <button class="back-to-top" data-target="#scroller" data-offset="320" aria-label="Back to top"></button>
 *   Shows after scrolling data-offset px in the target (default: the page); ring shows progress (--p 0..1).
 * <nav class="toc" data-target="#article" data-offset="24"><a class="toc-link" href="#intro">…</a>…</nav>
 *   Highlights the link of the section in view, slides an indicator, smooth-scrolls on click (no hash change).
 *   Events: ranj:change { id, link } on .toc.
 */
(function (R) {
  'use strict';
  var d = document, w = window;

  function rootOf(el) {
    var sel = el.getAttribute('data-target');
    var t = sel ? d.querySelector(sel) : null;
    return t || w;
  }
  function metrics(root) {
    if (root === w) { var de = d.documentElement; return { top: w.scrollY, max: Math.max(1, de.scrollHeight - w.innerHeight), h: w.innerHeight, rectTop: 0 }; }
    return { top: root.scrollTop, max: Math.max(1, root.scrollHeight - root.clientHeight), h: root.clientHeight, rectTop: root.getBoundingClientRect().top };
  }
  function scrollTo(root, y) {
    var b = R.reducedMotion ? 'auto' : 'smooth';
    if (root === w) w.scrollTo({ top: y, behavior: b }); else root.scrollTo({ top: y, behavior: b });
  }
  var ARROW = '<svg class="back-to-top-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7M12 19V5"/></svg>';
  var RING = '<svg class="back-to-top-ring" viewBox="0 0 36 36" aria-hidden="true"><circle class="btt-track" cx="18" cy="18" r="16.6" pathLength="100"/><circle class="btt-bar" cx="18" cy="18" r="16.6" pathLength="100"/></svg>';

  R.define('back-to-top', {
    selector: '.back-to-top',
    mount: function (btn) {
      if (!btn.children.length && !btn.textContent.trim()) btn.innerHTML = ARROW;
      if (!btn.querySelector('.back-to-top-ring') && !btn.classList.contains('back-to-top-pill')) btn.insertAdjacentHTML('afterbegin', RING);
      if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) btn.setAttribute('aria-label', 'Back to top');
      var root = rootOf(btn), off = R.attr(btn, 'data-offset', 320), raf = 0;
      btn.tabIndex = -1;
      function upd() {
        raf = 0;
        var m = metrics(root);
        btn.style.setProperty('--p', (m.top / m.max).toFixed(4));
        var vis = m.top > off;
        if (vis !== btn.hasAttribute('data-visible')) { if (vis) btn.setAttribute('data-visible', ''); else btn.removeAttribute('data-visible'); btn.tabIndex = vis ? 0 : -1; }
      }
      function sch() { if (!raf) raf = requestAnimationFrame(upd); }
      root.addEventListener('scroll', sch, { passive: true });
      w.addEventListener('resize', sch);
      var offC = R.on(btn, 'click', function () { scrollTo(root, 0); R.emit(btn, 'select', {}); });
      upd();
      return function () { root.removeEventListener('scroll', sch); w.removeEventListener('resize', sch); offC(); cancelAnimationFrame(raf); };
    }
  });

  R.define('scrollspy', {
    selector: '.toc,[data-scrollspy]',
    mount: function (nav) {
      var root = rootOf(nav), raf = 0, current = null;
      var off = R.attr(nav, 'data-offset', 24);
      var links = R.$$('a[href^="#"]', nav).filter(function (a) { return a.getAttribute('href').length > 1; });
      var pairs = links.map(function (a) { var id = decodeURIComponent(a.getAttribute('href').slice(1)); return { a: a, id: id, el: d.getElementById(id) }; }).filter(function (p) { return p.el; });
      if (!pairs.length) return;
      var ind = nav.querySelector(':scope > .toc-indicator');
      if (!ind && nav.classList.contains('toc')) { ind = d.createElement('span'); ind.className = 'toc-indicator'; ind.setAttribute('aria-hidden', 'true'); nav.insertBefore(ind, nav.firstChild); }
      var prog = nav.querySelector('.toc-progress');
      function sectionTop(el) { var m = metrics(root); return el.getBoundingClientRect().top - m.rectTop + m.top; }
      function upd() {
        raf = 0;
        var m = metrics(root), line = m.top + off + Math.min(120, m.h * .25), act = pairs[0];
        pairs.forEach(function (p) { if (sectionTop(p.el) <= line) act = p; });
        if (m.top >= m.max - 2) act = pairs[pairs.length - 1];
        if (prog) prog.style.setProperty('--p', (m.top / m.max).toFixed(4));
        if (act === current) return;
        current = act;
        var passed = true;
        pairs.forEach(function (p) {
          if (p === act) { p.a.setAttribute('aria-current', 'true'); p.a.classList.add('active'); passed = false; p.a.removeAttribute('data-passed'); }
          else { p.a.removeAttribute('aria-current'); p.a.classList.remove('active'); if (passed) p.a.setAttribute('data-passed', ''); else p.a.removeAttribute('data-passed'); }
        });
        if (ind) { nav.style.setProperty('--ty', act.a.offsetTop + 'px'); nav.style.setProperty('--th', act.a.offsetHeight + 'px'); }
        R.emit(nav, 'change', { id: act.id, link: act.a });
      }
      function sch() { if (!raf) raf = requestAnimationFrame(upd); }
      root.addEventListener('scroll', sch, { passive: true });
      w.addEventListener('resize', sch);
      var offC = R.on(nav, 'click', 'a[href^="#"]', function (e, a) {
        var p = pairs.filter(function (x) { return x.a === a; })[0]; if (!p) return;
        e.preventDefault();
        scrollTo(root, Math.max(0, sectionTop(p.el) - off));
        if (!p.el.hasAttribute('tabindex')) p.el.setAttribute('tabindex', '-1');
        setTimeout(function () { try { p.el.focus({ preventScroll: true }); } catch (x) {} }, R.reducedMotion ? 0 : 450);
      });
      upd();
      requestAnimationFrame(function () { if (current && ind) { nav.style.setProperty('--ty', current.a.offsetTop + 'px'); nav.style.setProperty('--th', current.a.offsetHeight + 'px'); } nav.setAttribute('data-ready', ''); });
      return function () { root.removeEventListener('scroll', sch); w.removeEventListener('resize', sch); offC(); cancelAnimationFrame(raf); };
    }
  });
})(window.Ranj);

;
/* --- components/overlays/bottom-nav.js --- */
/*!
 * Ranj UI — bottom nav + side rail: an active pill/indicator that glides to the selected item.
 * .bottom-nav > .bottom-nav-item[aria-current="page"] (> .bottom-nav-icon > svg + .bottom-nav-label)
 * .side-rail > .side-rail-item[aria-current="page"] (> svg + .side-rail-label)
 * Clicking an item selects it (data-static to opt out). ← → (bottom nav) / ↑ ↓ (rail) move focus.
 * Events: ranj:change { item, index, value }.
 */
(function (R) {
  'use strict';
  var d = document;

  function make(name, cfg) {
    R.define(name, {
      selector: cfg.root,
      mount: function (el) {
        var ind = el.querySelector(':scope > .' + cfg.ind);
        if (!ind) { ind = d.createElement('span'); ind.className = cfg.ind; ind.setAttribute('aria-hidden', 'true'); el.insertBefore(ind, el.firstChild); }
        function items() { return R.$$(':scope > ' + cfg.item, el); }
        function cur() { return items().filter(function (i) { return i.getAttribute('aria-current') === 'page' || i.classList.contains('active'); })[0]; }
        function place() {
          var c = cur();
          ind.style.opacity = c ? '' : '0';
          if (c) cfg.place(el, c, ind);
        }
        function select(it) {
          items().forEach(function (i) { if (i === it) i.setAttribute('aria-current', 'page'); else i.removeAttribute('aria-current'); i.classList.remove('active'); });
          place();
          R.emit(el, 'change', { item: it, index: items().indexOf(it), value: it.getAttribute('data-value') || it.textContent.trim() });
        }
        items().forEach(function (i) { if (i.tagName === 'BUTTON' && !i.getAttribute('type')) i.setAttribute('type', 'button'); });
        place();
        requestAnimationFrame(function () { place(); requestAnimationFrame(function () { el.setAttribute('data-ready', ''); }); });
        var offs = [
          R.on(el, 'click', cfg.item, function (e, it) {
            if (el.hasAttribute('data-static')) return;
            if (it.getAttribute('href') === '#') e.preventDefault();
            select(it);
          }),
          R.on(el, 'keydown', cfg.item, function (e, it) {
            var ks = cfg.keys; var dir = e.key === ks[1] ? 1 : e.key === ks[0] ? -1 : 0;
            if (!dir) return;
            e.preventDefault();
            var is = items(), n = is[(is.indexOf(it) + dir + is.length) % is.length];
            n.focus();
          })
        ];
        var ro = window.ResizeObserver ? new ResizeObserver(place) : null;
        if (ro) { ro.observe(el); items().forEach(function (i) { ro.observe(i); }); }
        // label width transitions in expand mode: re-place while they run
        var off2 = R.on(el, 'transitionend', function (e) { if (e.target !== ind) place(); });
        el['__' + name] = { select: function (i) { var it = typeof i === 'number' ? items()[i] : i; if (it) select(it); }, refresh: place };
        return function () { offs.forEach(function (f) { f(); }); off2(); if (ro) ro.disconnect(); };
      }
    });
  }

  make('bottom-nav', {
    root: '.bottom-nav', item: '.bottom-nav-item', ind: 'bottom-nav-pill', keys: ['ArrowLeft', 'ArrowRight'],
    place: function (el, c, ind) {
      if (el.classList.contains('bottom-nav-expand')) {
        el.style.setProperty('--pw', c.offsetWidth + 'px');
        ind.style.left = '0px';
        el.style.setProperty('--px', c.offsetLeft + 'px');
        ind.style.transform = 'translateX(' + c.offsetLeft + 'px)';
      } else {
        var icon = c.querySelector('.bottom-nav-icon') || c;
        var x = c.offsetLeft + icon.offsetLeft + (icon.offsetWidth - ind.offsetWidth) / 2;
        ind.style.transform = 'translateX(' + x + 'px)';
      }
    }
  });
  make('side-rail', {
    root: '.side-rail', item: '.side-rail-item', ind: 'side-rail-indicator', keys: ['ArrowUp', 'ArrowDown'],
    place: function (el, c, ind) { el.style.setProperty('--iy', c.offsetTop + 'px'); el.style.setProperty('--ih', c.offsetHeight + 'px'); }
  });

  R.bottomNav = { select: function (el, i) { el = typeof el === 'string' ? d.querySelector(el) : el; if (el && el['__bottom-nav']) el['__bottom-nav'].select(i); } };
})(window.Ranj);

;
/* --- components/overlays/command.js --- */
/*!
 * Ranj UI — command palette. Fuzzy filter with match highlighting, groups, keyboard,
 * recent items (data-recent="storage-key"), opt-in global hotkey (data-hotkey="k" → ⌘K / Ctrl+K).
 * Inline: <div class="command">…</div> · Modal: <div class="command-overlay" id="x"><div class="command-dialog">…</div></div>
 * Items: .command-item[data-value][data-keywords][data-href][data-keep-open]
 * API: Ranj.command.open(id) / close(id) / toggle(id). Events: ranj:select { value, item } (cancelable) from the item.
 */
(function (R) {
  'use strict';
  var d = document;

  function score(q, s) {
    if (!q) return 1;
    var i = s.indexOf(q);
    if (i === 0) return 2000 - s.length;
    if (i > 0) return (/[\s\-_/]/.test(s[i - 1]) ? 1500 : 1000) - i;
    var si = 0, sc = 0, prev = -2, run = 0;
    for (var k = 0; k < q.length; k++) {
      var c = q[k]; if (c === ' ') continue;
      var f = s.indexOf(c, si); if (f < 0) return 0;
      sc += 10;
      if (f === prev + 1) { run++; sc += 12 * run; } else run = 0;
      if (f === 0 || /[\s\-_/]/.test(s[f - 1])) sc += 18;
      sc -= Math.min(10, f - si) * .6;
      prev = f; si = f + 1;
    }
    return Math.max(1, sc);
  }
  function matchIdx(q, s) {
    var out = [], i = s.indexOf(q);
    if (q && i > -1) { for (var k = 0; k < q.length; k++) out.push(i + k); return out; }
    var si = 0;
    for (var j = 0; j < q.length; j++) { if (q[j] === ' ') continue; var f = s.indexOf(q[j], si); if (f < 0) return []; out.push(f); si = f + 1; }
    return out;
  }

  R.define('command', {
    selector: '.command,.command-dialog',
    mount: function (root) {
      var input = root.querySelector('.command-input');
      var list = root.querySelector('.command-list');
      if (!input || !list) return;
      var ov = root.closest('.command-overlay');
      var key = root.getAttribute('data-recent') || (ov && ov.getAttribute('data-recent'));
      var recentLabel = root.getAttribute('data-recent-label') || 'Recent';
      var items = [], active = null, recentGroup = null;

      R.ensureId(list, 'cmd-list');
      list.setAttribute('role', 'listbox');
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-controls', list.id);
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('spellcheck', 'false');

      function collect() {
        items = R.$$('.command-item', list).filter(function (it) { return !it.hasAttribute('data-recent-clone'); });
        items.forEach(function (it, n) {
          it.setAttribute('role', 'option');
          R.ensureId(it, 'cmd-opt');
          it.__order = n;
          if (!it.__label) {
            var lab = it.querySelector('.command-label');
            if (!lab) {
              var tn = Array.prototype.filter.call(it.childNodes, function (c) { return c.nodeType === 3 && c.textContent.trim(); })[0];
              if (tn) { lab = d.createElement('span'); lab.className = 'command-label'; lab.textContent = tn.textContent.trim(); it.replaceChild(lab, tn); }
            }
            it.__label = lab;
            it.__text = lab ? lab.textContent : it.textContent.trim();
          }
          if (!it.hasAttribute('data-value')) it.setAttribute('data-value', it.__text.trim());
        });
        R.$$('.command-group', list).forEach(function (g) {
          g.setAttribute('role', 'group');
          var l = g.querySelector('.command-group-label');
          if (l) g.setAttribute('aria-labelledby', R.ensureId(l, 'cmd-g'));
        });
      }
      collect();

      function visible() { return R.$$('.command-item', list).filter(function (i) { return !i.hidden && !i.closest('[hidden]') && i.getAttribute('aria-disabled') !== 'true'; }); }
      function setActive(it, scroll) {
        if (active === it) return;
        if (active) active.removeAttribute('aria-selected');
        active = it;
        if (it) {
          it.setAttribute('aria-selected', 'true');
          input.setAttribute('aria-activedescendant', it.id);
          if (scroll) it.scrollIntoView({ block: 'nearest' });
        } else input.removeAttribute('aria-activedescendant');
      }
      function readRecent() { if (!key) return []; try { return JSON.parse(localStorage.getItem('ranj-cmd:' + key) || '[]'); } catch (e) { return []; } }
      function pushRecent(v) {
        if (!key) return;
        var r = readRecent().filter(function (x) { return x !== v; }); r.unshift(v);
        try { localStorage.setItem('ranj-cmd:' + key, JSON.stringify(r.slice(0, 4))); } catch (e) {}
      }
      function buildRecent() {
        if (recentGroup) { recentGroup.remove(); recentGroup = null; }
        var r = readRecent(); if (!r.length) return;
        var g = d.createElement('div'); g.className = 'command-group'; g.setAttribute('data-recent-group', ''); g.setAttribute('role', 'group');
        g.innerHTML = '<div class="command-group-label">' + R.esc(recentLabel) + '</div>';
        r.forEach(function (v) {
          var src = items.filter(function (i) { return i.getAttribute('data-value') === v; })[0];
          if (!src) return;
          var c = src.cloneNode(true); c.id = R.uid('cmd-opt'); c.setAttribute('data-recent-clone', ''); c.removeAttribute('aria-selected'); c.removeAttribute('hidden'); c.__src = src;
          var cl = c.querySelector('.command-label'); if (cl) cl.textContent = src.__text;
          g.appendChild(c);
        });
        if (g.children.length < 2) return;
        var first = list.querySelector('.command-group,.command-item');
        list.insertBefore(g, first || null);
        var sep = d.createElement('div'); sep.className = 'command-separator'; sep.setAttribute('data-recent-sep', '');
        g.appendChild(sep);
        recentGroup = g;
      }

      function filter() {
        var q = input.value.trim().toLowerCase();
        var groups = R.$$('.command-group', list).filter(function (g) { return !g.hasAttribute('data-recent-group'); });
        if (recentGroup) recentGroup.hidden = !!q;
        items.forEach(function (it) {
          var hay = (it.__text + ' ' + (it.getAttribute('data-keywords') || '') + ' ' + (it.getAttribute('data-value') || '')).toLowerCase();
          var s = it.hasAttribute('data-always') ? 1 : score(q, hay);
          it.__score = s;
          it.hidden = !s;
          if (it.__label) {
            var t = it.__text, idx = q ? matchIdx(q, t.toLowerCase()) : [];
            if (idx.length) {
              var html = '', set = {}; idx.forEach(function (n) { set[n] = 1; });
              for (var c = 0; c < t.length; c++) html += set[c] ? '<mark>' + R.esc(t[c]) + '</mark>' : R.esc(t[c]);
              it.__label.innerHTML = html.replace(/<\/mark><mark>/g, '');
            } else if (it.__label.firstElementChild) it.__label.textContent = t;
          }
        });
        groups.forEach(function (g) {
          var gi = items.filter(function (i) { return i.parentNode === g; });
          gi.sort(function (a, b) { return q ? (b.__score - a.__score) || (a.__order - b.__order) : a.__order - b.__order; });
          gi.forEach(function (i) { g.appendChild(i); });
          g.hidden = !gi.some(function (i) { return !i.hidden; });
        });
        R.$$('.command-separator', list).forEach(function (s) { if (!s.hasAttribute('data-recent-sep')) s.hidden = !!q; });
        var any = items.some(function (i) { return !i.hidden; });
        if (any) root.removeAttribute('data-empty'); else root.setAttribute('data-empty', '');
        var v = visible();
        setActive(null);
        setActive(v[0] || null, true);
        list.scrollTop = 0;
        R.emit(root, 'filter', { query: q, count: items.filter(function (i) { return !i.hidden; }).length });
      }

      function select(it) {
        if (!it || it.getAttribute('aria-disabled') === 'true') return;
        var src = it.__src || it;
        var ok = R.emit(src, 'select', { value: src.getAttribute('data-value'), item: src, query: input.value });
        if (!ok) return;
        pushRecent(src.getAttribute('data-value'));
        var href = src.getAttribute('data-href') || (src.tagName === 'A' ? src.getAttribute('href') : null);
        if (ov && !src.hasAttribute('data-keep-open') && R.dialog) R.dialog.close(ov, { reason: 'select' });
        if (href && src.tagName !== 'A') location.href = href;
      }

      function reset() {
        input.value = '';
        buildRecent();
        filter();
      }

      var offs = [
        R.on(input, 'input', filter),
        R.on(input, 'keydown', function (e) {
          var v = visible(), i = v.indexOf(active);
          if (e.key === 'ArrowDown' || (e.ctrlKey && (e.key === 'n' || e.key === 'j'))) { e.preventDefault(); setActive(v[(i + 1) % v.length] || null, true); }
          else if (e.key === 'ArrowUp' || (e.ctrlKey && (e.key === 'p' || e.key === 'k'))) { e.preventDefault(); setActive(v[i <= 0 ? v.length - 1 : i - 1] || null, true); }
          else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); setActive(v[0], true); }
          else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); setActive(v[v.length - 1], true); }
          else if (e.key === 'Enter') { e.preventDefault(); select(active); }
          else if (e.key === 'Escape' && !ov && input.value) { e.preventDefault(); e.stopPropagation(); input.value = ''; filter(); }
        }),
        R.on(list, 'pointermove', function (e) {
          var it = e.target.closest('.command-item');
          if (it && !it.hidden && it !== active && it.getAttribute('aria-disabled') !== 'true') setActive(it, false);
        }),
        R.on(list, 'click', function (e) {
          var it = e.target.closest('.command-item');
          if (it) { if (it.tagName === 'A' && ov && !it.hasAttribute('data-keep-open')) { /* navigate */ } else e.preventDefault(); select(it); }
        }),
        R.on(root, 'click', '.command-esc,[data-command-close]', function () { if (ov && R.dialog) R.dialog.close(ov, { reason: 'button' }); })
      ];
      if (ov) offs.push(R.on(ov, 'ranj:open', function (e) { if (e.target === ov) reset(); }));
      root.__command = { filter: filter, reset: reset, refresh: function () { collect(); filter(); }, select: select };
      reset();
      return function () { offs.forEach(function (f) { f(); }); if (recentGroup) recentGroup.remove(); };
    }
  });

  // Opt-in global hotkey: <div class="command-overlay" data-hotkey="k">
  R.define('command-hotkey', {
    setup: function () {
      d.addEventListener('keydown', function (e) {
        if (!(e.metaKey || e.ctrlKey) || e.altKey || !e.key) return;
        var k = e.key.toLowerCase();
        var ov = R.$$('.command-overlay[data-hotkey]').filter(function (o) { return o.getAttribute('data-hotkey').toLowerCase() === k; })[0];
        if (!ov || !R.dialog) return;
        e.preventDefault();
        R.dialog.toggle(ov);
      });
    }
  });

  R.command = {
    open: function (id) { return R.dialog && R.dialog.open(id); },
    close: function (id) { return R.dialog && R.dialog.close(id); },
    toggle: function (id) { return R.dialog && R.dialog.toggle(id); },
    refresh: function (el) { el = typeof el === 'string' ? d.getElementById(el) : el; var r = el && (el.__command ? el : el.querySelector('.command,.command-dialog')); if (r && r.__command) r.__command.refresh(); }
  };
})(window.Ranj);

;
/* --- components/overlays/context-menu.js --- */
/*!
 * Ranj UI — context menu. Right-click (or long-press on touch, or Shift+F10 / Menu key) inside
 * [data-context-menu="menuId"] opens .context-menu#menuId at the pointer. Empty value → first
 * .context-menu inside the area. Shares the menu engine with dropdown-menu (submenus, checkbox/radio, typeahead).
 * Events: ranj:open { x, y, target } / ranj:close on the menu, ranj:select from items.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var current = null;

  function menuFor(area) {
    var id = area.getAttribute('data-context-menu');
    return id ? d.getElementById(id) : area.querySelector('.context-menu');
  }
  function open(area, x, y, target, kb) {
    var menu = menuFor(area);
    if (!menu) return;
    if (current) current.close('reopen');
    menu.__ctxTarget = target || area;
    area.setAttribute('data-state', 'open');
    var h = current = K.menu(menu, { x: x, y: y }, {
      placement: 'right-start', offset: 2, focus: kb ? 'first' : 'menu',
      onClose: function (reason) {
        if (current === h) current = null;
        area.removeAttribute('data-state');
        if (reason === 'escape' || reason === 'select' || reason === 'tab') { if (area.hasAttribute('tabindex') || R.focusables(area.parentNode || d.body).indexOf(area) > -1) try { area.focus({ preventScroll: true }); } catch (e) {} }
        R.emit(menu, 'close', { reason: reason });
      }
    });
    R.emit(menu, 'open', { x: x, y: y, target: menu.__ctxTarget });
  }

  R.define('context-menu', {
    selector: '[data-context-menu]',
    setup: function () {
      R.on(d, 'contextmenu', '[data-context-menu]', function (e, area) {
        if (e.shiftKey && e.altKey) return; // escape hatch for native menu
        e.preventDefault();
        if (e.target.closest('.context-menu')) return;
        if (e.button === -1 || (e.clientX === 0 && e.clientY === 0)) { var r = area.getBoundingClientRect(); open(area, r.left + 12, r.top + 12, e.target, true); return; }
        open(area, e.clientX, e.clientY, e.target, false);
      });
      // touch long-press
      var lp = null;
      R.on(d, 'pointerdown', '[data-context-menu]', function (e, area) {
        if (e.pointerType !== 'touch') return;
        var x = e.clientX, y = e.clientY, tgt = e.target;
        lp = { x: x, y: y, t: setTimeout(function () { lp = null; open(area, x, y, tgt, false); if (navigator.vibrate) try { navigator.vibrate(8); } catch (er) {} }, 520) };
      });
      function cancel(e) { if (lp && (e.type !== 'pointermove' || Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 8)) { clearTimeout(lp.t); lp = null; } }
      d.addEventListener('pointermove', cancel, { passive: true });
      d.addEventListener('pointerup', cancel);
      d.addEventListener('pointercancel', cancel);
      R.on(d, 'keydown', '[data-context-menu]', function (e, area) {
        if ((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu') {
          e.preventDefault();
          var r = (d.activeElement && area.contains(d.activeElement) ? d.activeElement : area).getBoundingClientRect();
          open(area, r.left + Math.min(24, r.width / 2), r.top + Math.min(24, r.height / 2), d.activeElement, true);
        }
      });
    },
    mount: function (area) {
      var menu = menuFor(area);
      if (menu) { K.prepMenu(menu); area.setAttribute('aria-haspopup', 'menu'); }
    }
  });

  R.contextMenu = {
    open: function (area, x, y) { area = typeof area === 'string' ? d.querySelector(area) : area; if (area) open(area, x, y, area, false); },
    close: function () { if (current) current.close('api'); }
  };
})(window.Ranj);

;
/* --- components/overlays/dialog.js --- */
/*!
 * Ranj UI — modal overlay engine: dialog, alert-dialog, sheet, drawer, command palette.
 * Markup:  <div class="dialog-overlay" id="x"><div class="dialog">…</div></div>
 * Open:    data-dialog-open="x" (also data-sheet-open / data-drawer-open) · Ranj.dialog.open('x')
 * Close:   data-dialog-close inside · backdrop click · Escape · Ranj.dialog.close('x')
 * Events:  ranj:open, ranj:close on the overlay (ranj:beforeclose is cancelable)
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var OVERLAY = '.dialog-overlay,.command-overlay';
  var CONTENT = '.dialog,.sheet,.drawer,.command-dialog,.alert-dialog,.action-dialog';
  var stack = [];

  function resolve(x) {
    var el = typeof x === 'string' ? d.getElementById(x.replace(/^#/, '')) : x;
    if (!el) return null;
    if (el.matches(OVERLAY)) return el;
    var ov = el.closest(OVERLAY);
    if (ov) return ov;
    // v1: <div class="dialog-overlay"></div><div class="sheet"> — content as next sibling
    var prev = el.previousElementSibling;
    if (prev && prev.matches(OVERLAY) && el.matches('.sheet,.drawer')) return prev;
    return null;
  }
  function contentOf(ov) {
    var c = null;
    for (var i = 0; i < ov.children.length; i++) if (ov.children[i].matches(CONTENT)) { c = ov.children[i]; break; }
    if (c) return { el: c, sibling: false };
    var nx = ov.nextElementSibling;
    if (nx && nx.matches('.sheet,.drawer')) return { el: nx, sibling: true };
    return { el: ov.firstElementChild || ov, sibling: false };
  }
  function isStatic(ov, c) {
    return ov.hasAttribute('data-static') || ov.getAttribute('data-backdrop') === 'static' || c.classList.contains('alert-dialog') || c.getAttribute('role') === 'alertdialog';
  }
  function bump(c) {
    if (R.reducedMotion) return;
    c.removeAttribute('data-bump'); void c.offsetWidth; c.setAttribute('data-bump', '');
    setTimeout(function () { c.removeAttribute('data-bump'); }, 340);
  }

  function open(x, o) {
    o = o || {};
    var ov = resolve(x);
    if (!ov) return false;
    if (ov.__dlg) return true;
    var info = contentOf(ov), c = info.el;
    if (!R.emit(ov, 'beforeopen', {})) return false;
    var st = ov.__dlg = { c: c, sibling: info.sibling, trigger: o.trigger || d.activeElement };

    // ARIA
    if (c !== ov) {
      if (!c.getAttribute('role')) c.setAttribute('role', c.classList.contains('alert-dialog') ? 'alertdialog' : 'dialog');
      c.setAttribute('aria-modal', 'true');
      var t = c.querySelector('.dialog-title,.sheet-title,.drawer-title,.alert-dialog-title,[data-dialog-title]');
      var ds = c.querySelector('.dialog-description,.sheet-description,.drawer-description,.alert-dialog-description,[data-dialog-description]');
      if (t && !c.hasAttribute('aria-labelledby')) c.setAttribute('aria-labelledby', R.ensureId(t, 'dlg-t'));
      if (ds && !c.hasAttribute('aria-describedby')) c.setAttribute('aria-describedby', R.ensureId(ds, 'dlg-d'));
      if (!c.hasAttribute('tabindex')) c.setAttribute('tabindex', '-1');
    }
    R.$$('[data-dialog-open="' + ov.id + '"],[data-sheet-open="' + ov.id + '"],[data-drawer-open="' + ov.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });

    // Stacking
    var below = stack[stack.length - 1];
    if (below) { below.__dlg.c.setAttribute('data-nested', ''); ov.setAttribute('data-stacked', ''); }
    stack.push(ov);

    K.portal(ov);
    if (st.sibling) K.portal(c);
    K.show(ov);
    if (c !== ov) K.show(c);
    if (c.__onOpen) c.__onOpen(o);
    R.scrollLock.lock();

    var initial = o.focus || c.querySelector('[autofocus],[data-autofocus]') ||
      (c.matches('.command-dialog') ? c.querySelector('.command-input') : null) ||
      R.focusables(c).filter(function (f) { return !f.matches('.dialog-close,[data-dialog-close]:not(.btn)'); })[0] || c;
    st.release = R.trapFocus(c, initial);
    st.pop = R.pushLayer(function () { if (ov.hasAttribute('data-static') && !ov.hasAttribute('data-escape')) bump(c); else close(ov, { reason: 'escape' }); });
    R.emit(ov, 'open', { trigger: st.trigger });
    return true;
  }

  function close(x, o) {
    o = o || {};
    var ov = resolve(x), st = ov && ov.__dlg;
    if (!st) return false;
    if (!o.force && !R.emit(ov, 'beforeclose', { reason: o.reason || 'api' })) return false;
    ov.__dlg = null;
    st.pop();
    st.release();
    R.scrollLock.unlock();
    var i = stack.indexOf(ov); if (i > -1) stack.splice(i, 1);
    var top = stack[stack.length - 1];
    if (top && i === stack.length) top.__dlg.c.removeAttribute('data-nested');
    R.$$('[data-dialog-open="' + ov.id + '"],[data-sheet-open="' + ov.id + '"],[data-drawer-open="' + ov.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    var c = st.c;
    if (c.__onClose) c.__onClose(o);
    var pending = c !== ov ? 2 : 1;
    function done() {
      if (--pending) return;
      ov.removeAttribute('data-stacked');
      K.unportal(ov);
      if (st.sibling) K.unportal(c);
      R.emit(ov.isConnected ? ov : d, 'closed', { reason: o.reason || 'api' });
      if (o.onHidden) o.onHidden();
    }
    if (c !== ov) K.hide(c, done);
    K.hide(ov, done);
    R.emit(ov, 'close', { reason: o.reason || 'api', value: o.value });
    return true;
  }

  function toggle(x, o) { var ov = resolve(x); if (!ov) return; return ov.__dlg ? close(ov, o) : open(ov, o); }
  function isOpen(x) { var ov = resolve(x); return !!(ov && ov.__dlg); }

  R.define('dialog', {
    setup: function () {
      R.on(d, 'click', '[data-dialog-open],[data-sheet-open],[data-drawer-open]', function (e, el) {
        e.preventDefault();
        open(el.getAttribute('data-dialog-open') || el.getAttribute('data-sheet-open') || el.getAttribute('data-drawer-open'), { trigger: el });
      });
      R.on(d, 'click', '[data-dialog-close],[data-sheet-close],[data-drawer-close]', function (e, el) {
        var target = el.getAttribute('data-dialog-close') || el.getAttribute('data-sheet-close') || el.getAttribute('data-drawer-close');
        var ov = target ? resolve(target) : resolve(el);
        if (!ov) { var c = el.closest(CONTENT); ov = c && resolve(c); }
        if (ov) { e.preventDefault(); close(ov, { reason: 'button', value: el.getAttribute('data-value') }); }
      });
      // Backdrop click: only when the press both started and ended on the overlay itself
      var downOn = null;
      d.addEventListener('pointerdown', function (e) { downOn = e.target; }, true);
      R.on(d, 'click', OVERLAY, function (e, ov) {
        if (e.target !== ov || downOn !== ov || !ov.__dlg) return;
        if (isStatic(ov, ov.__dlg.c)) bump(ov.__dlg.c); else close(ov, { reason: 'backdrop' });
      });
    }
  });

  R.dialog = { open: open, close: close, toggle: toggle, isOpen: isOpen, stack: function () { return stack.slice(); } };
  R.sheet = R.dialog; R.drawer = R.drawer || {};
  R.drawer.open = open; R.drawer.close = close; R.drawer.toggle = toggle;
})(window.Ranj);

;
/* --- components/overlays/drawer.js --- */
/*!
 * Ranj UI — drawer: drag-to-dismiss with velocity, rubber-banding and snap points.
 * <div class="dialog-overlay" id="d"><div class="drawer" data-snap-points="0.45,1"><div class="drawer-handle"></div>…</div></div>
 * data-snap-points: visible fractions of the drawer (1 = fully open). data-snap: initial index (default last).
 * Events: ranj:snap { index, point } on the drawer.
 */
(function (R) {
  'use strict';
  var d = document;
  var NO_DRAG = 'input,textarea,select,button,a,[contenteditable="true"],[data-no-drag],.slider,[role="slider"]';

  R.define('drawer', {
    selector: '.drawer',
    mount: function (el) {
      var horiz = el.classList.contains('drawer-right') || el.classList.contains('drawer-left');
      var sign = el.classList.contains('drawer-left') ? -1 : 1;
      var snaps = (el.getAttribute('data-snap-points') || '').split(',').map(parseFloat).filter(function (n) { return n > 0 && n <= 1; }).sort(function (a, b) { return a - b; });
      var idx = 0, offset = 0, drag = null;

      function size() { return horiz ? el.offsetWidth : el.offsetHeight; }
      function snapY(i) { return snaps.length ? (1 - snaps[i]) * size() : 0; }
      function overlay() { return el.closest('.dialog-overlay') || el.previousElementSibling; }
      function setY(y, live) {
        offset = y;
        el.style.setProperty('--drawer-y', y.toFixed(1) + 'px');
        var ov = overlay();
        if (ov && ov.classList && ov.classList.contains('dialog-overlay')) {
          var base = snaps.length ? snapY(0) : 0, span = Math.max(1, size() - base);
          var o = R.clamp(1 - (y - base) / span, 0, 1);
          ov.style.setProperty('--backdrop-o', y <= base ? '1' : o.toFixed(3));
        }
      }
      function snapTo(i) { idx = R.clamp(i, 0, snaps.length - 1); setY(snapY(idx)); R.emit(el, 'snap', { index: idx, point: snaps[idx] }); }

      el.__onOpen = function () {
        var ov = overlay(); if (ov && ov.style) ov.style.removeProperty('--backdrop-o');
        if (snaps.length) {
          var start = parseInt(el.getAttribute('data-snap'), 10);
          idx = isNaN(start) ? snaps.length - 1 : R.clamp(start, 0, snaps.length - 1);
          setY(snapY(idx));
        } else setY(0);
      };
      el.__snapTo = snapTo;
      el.__onClose = function () { el.removeAttribute('data-dragging'); drag = null; };

      function scrollParent(t) {
        for (var n = t; n && n !== el; n = n.parentElement) if (n.scrollHeight > n.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(n).overflowY)) return n;
        return null;
      }
      function down(e) {
        if (e.button !== 0 || el.getAttribute('data-state') !== 'open') return;
        var onHandle = e.target.closest('.drawer-handle');
        if (!onHandle && e.target.closest(NO_DRAG)) return;
        var sp = onHandle ? null : scrollParent(e.target);
        drag = { x: e.clientX, y: e.clientY, t: performance.now(), start: offset, active: false, sp: sp, samples: [], id: e.pointerId };
        d.addEventListener('pointermove', move, { passive: false });
        d.addEventListener('pointerup', up);
        d.addEventListener('pointercancel', up);
      }
      function unbind() { d.removeEventListener('pointermove', move); d.removeEventListener('pointerup', up); d.removeEventListener('pointercancel', up); }
      function move(e) {
        if (!drag || e.pointerId !== drag.id) return;
        var raw = horiz ? (e.clientX - drag.x) * sign : e.clientY - drag.y;
        var cross = horiz ? e.clientY - drag.y : e.clientX - drag.x;
        if (!drag.active) {
          if (Math.abs(raw) < 5) return;
          if (Math.abs(cross) > Math.abs(raw)) { drag = null; unbind(); return; }
          // inside a scrolled list: only drag when at top and pulling down
          if (drag.sp && (drag.sp.scrollTop > 0 || raw < 0)) { drag = null; unbind(); return; }
          drag.active = true;
          el.setAttribute('data-dragging', '');
          try { el.setPointerCapture(e.pointerId); } catch (x) {}
        }
        e.preventDefault();
        var y = drag.start + raw;
        var min = 0;
        if (y < min) y = min - Math.pow(min - y, .72); // rubber band past fully-open
        setY(y, true);
        var now = performance.now();
        drag.samples.push({ t: now, y: y }); if (drag.samples.length > 6) drag.samples.shift();
      }
      function up(e) {
        if (!drag || (e.pointerId !== drag.id && e.type !== 'lostpointercapture')) return;
        var g = drag; drag = null; unbind();
        if (!g.active) return;
        el.removeAttribute('data-dragging');
        var s = g.samples, v = 0;
        if (s.length > 1) { var a = s[0], b = s[s.length - 1]; v = (b.y - a.y) / Math.max(1, b.t - a.t); } // px/ms, + = toward close
        var h = size();
        if (snaps.length) {
          var projected = offset + v * 180;
          var lowest = snapY(0);
          if (projected > lowest + (h - lowest) * .45 || (v > .9 && idx === 0)) return dismiss();
          var best = 0, bd = Infinity;
          snaps.forEach(function (p, i) { var dd = Math.abs(snapY(i) - projected); if (dd < bd) { bd = dd; best = i; } });
          snapTo(best);
        } else {
          if (offset > h * .3 || v > .45) return dismiss();
          setY(0);
        }
      }
      function dismiss() {
        var ov = overlay();
        if (ov && ov.style) ov.style.setProperty('--backdrop-o', '0');
        if (R.dialog) R.dialog.close(el, { reason: 'swipe' });
      }
      el.addEventListener('pointerdown', down);

      return function () {
        el.removeEventListener('pointerdown', down); unbind();
        el.__onOpen = el.__onClose = el.__snapTo = null;
      };
    }
  });

  R.drawer = R.drawer || {};
  R.drawer.snap = function (el, i) { el = typeof el === 'string' ? d.getElementById(el) : el; if (el && el.__snapTo) el.__snapTo(i); };
})(window.Ranj);

;
/* --- components/overlays/dropdown-menu.js --- */
/*!
 * Ranj UI — dropdown menu (v1 compatible: .dropdown > [data-dropdown-trigger] + .dropdown-menu).
 * Keyboard: Enter/Space/↓ open + focus first, ↑ opens on last, ↑↓ Home End move, → ← submenus,
 * type to jump, Esc closes (focus returns to trigger). Items: .dropdown-item, data-checkbox / aria-checked,
 * .dropdown-radio-group, .dropdown-sub (> item + .dropdown-menu), .dropdown-item-destructive, data-keep-open.
 * Placement: data-placement="bottom-start" on .dropdown (.dropdown-right → bottom-end).
 * Events: ranj:open, ranj:close on .dropdown; ranj:select { item, value, checked } bubbles from the item.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;

  function parts(trigger) {
    var dd = trigger.closest('.dropdown');
    var id = trigger.getAttribute('data-dropdown-trigger');
    var menu = id ? d.getElementById(id) : null;
    if (!menu && dd) for (var i = 0; i < dd.children.length; i++) if (dd.children[i].classList.contains('dropdown-menu')) { menu = dd.children[i]; break; }
    if (!menu && dd) menu = dd.querySelector('.dropdown-menu');
    return { dd: dd || trigger, menu: menu };
  }

  function open(trigger, focus) {
    var p = parts(trigger);
    if (!p.menu) return;
    if (trigger.__menu) return;
    var dd = p.dd;
    var placement = dd.getAttribute('data-placement') || trigger.getAttribute('data-placement') || (dd.classList && dd.classList.contains('dropdown-right') ? 'bottom-end' : dd.classList && dd.classList.contains('dropdown-top') ? 'top-start' : 'bottom-start');
    trigger.setAttribute('aria-expanded', 'true');
    if (dd !== trigger) dd.setAttribute('data-state', 'open');
    trigger.setAttribute('data-state', 'open');
    trigger.__menu = K.menu(p.menu, trigger, {
      placement: placement, offset: parseFloat(dd.getAttribute('data-offset')) || 6,
      focus: focus || 'menu', trigger: trigger, ignore: [trigger],
      onClose: function (reason) {
        trigger.__menu = null;
        trigger.setAttribute('aria-expanded', 'false');
        trigger.removeAttribute('data-state');
        if (dd !== trigger) dd.setAttribute('data-state', 'closed');
        var ae = d.activeElement;
        if (reason !== 'outside' || !ae || ae === d.body || p.menu.contains(ae)) try { trigger.focus({ preventScroll: true }); } catch (x) {}
        R.emit(dd, 'close', { reason: reason });
      }
    });
    R.emit(dd, 'open', {});
  }
  function close(trigger) { if (trigger && trigger.__menu) trigger.__menu.close('api'); }

  R.define('dropdown-menu', {
    selector: '[data-dropdown-trigger]',
    setup: function () {
      R.on(d, 'click', '[data-dropdown-trigger]', function (e, t) {
        e.preventDefault();
        if (e.detail === 0 && performance.now() - (t.__kb || 0) < 400) return;
        if (t.__menu) t.__menu.close('trigger'); else open(t, e.detail === 0 ? 'first' : 'menu');
      });
      R.on(d, 'keydown', '[data-dropdown-trigger]', function (e, t) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.__kb = performance.now(); if (!t.__menu) open(t, 'first'); else t.__menu.focusFirst(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); t.__kb = performance.now(); if (!t.__menu) open(t, 'last'); }
      });
    },
    mount: function (t) {
      var p = parts(t);
      t.setAttribute('aria-haspopup', 'menu');
      t.setAttribute('aria-expanded', 'false');
      if (p.menu) { t.setAttribute('aria-controls', R.ensureId(p.menu, 'menu')); K.prepMenu(p.menu); p.menu.setAttribute('aria-labelledby', R.ensureId(t, 'menu-t')); }
      return function () { if (t.__menu) t.__menu.close('destroy'); };
    }
  });

  R.dropdown = {
    open: function (x, focus) { var t = typeof x === 'string' ? d.querySelector(x) : x; if (t && !t.hasAttribute('data-dropdown-trigger')) t = t.querySelector('[data-dropdown-trigger]'); if (t) open(t, focus); },
    close: function (x) { var t = typeof x === 'string' ? d.querySelector(x) : x; if (t && !t.hasAttribute('data-dropdown-trigger')) t = t.querySelector('[data-dropdown-trigger]'); close(t); }
  };
})(window.Ranj);

;
/* --- components/overlays/floating-action-menu.js --- */
/*!
 * Ranj UI — floating action menu.
 * <div class="fab-menu" data-direction="up"><div class="fab-actions"><button class="fab-action" data-label="Photo">…</button>…</div>
 *   <button class="fab" aria-label="Create">+</button></div>
 * data-direction: up | down | left | right. .fab-radial + data-arc="180" data-start="-90" (degrees) for an arc.
 * Esc / outside click closes; ↑ ↓ ← → move between actions. Events: ranj:open / ranj:close, ranj:select { action }.
 */
(function (R) {
  'use strict';
  var d = document;

  R.define('floating-action-menu', {
    selector: '.fab-menu',
    mount: function (el) {
      var fab = el.querySelector(':scope > .fab'), wrap = el.querySelector('.fab-actions');
      if (!fab || !wrap) return;
      var acts = R.$$('.fab-action', wrap), n = acts.length;
      var radial = el.classList.contains('fab-radial');
      var o = R.opts(el, { direction: 'up', arc: 90, start: -90, radius: 0 });
      var scrim = el.nextElementSibling && el.nextElementSibling.classList.contains('fab-scrim') ? el.nextElementSibling : null;
      var pop = null, out = null;
      fab.setAttribute('aria-haspopup', 'menu');
      fab.setAttribute('aria-expanded', 'false');
      wrap.setAttribute('role', 'menu');
      fab.setAttribute('aria-controls', R.ensureId(wrap, 'fab'));

      function layout() {
        var cs = getComputedStyle(el), rem = parseFloat(getComputedStyle(d.documentElement).fontSize) || 16;
        var fabS = fab.offsetWidth, actS = acts[0] ? acts[0].offsetWidth : 44, gap = parseFloat(cs.getPropertyValue('--fab-gap')) * rem || 12;
        var r = o.radius || parseFloat(cs.getPropertyValue('--fab-radius')) * rem || 96;
        acts.forEach(function (a, i) {
          a.style.setProperty('--i', i); a.style.setProperty('--n', n);
          a.setAttribute('role', 'menuitem'); a.setAttribute('tabindex', '-1');
          if (!a.getAttribute('aria-label') && a.getAttribute('data-label')) a.setAttribute('aria-label', a.getAttribute('data-label'));
          var dx = 0, dy = 0;
          if (radial) {
            var ang = (o.start - o.arc / 2 + (n === 1 ? o.arc / 2 : o.arc * i / (n - 1))) * Math.PI / 180;
            dx = Math.cos(ang) * r; dy = Math.sin(ang) * r;
            if (a.getAttribute('data-label') && !a.hasAttribute('data-tooltip')) { a.setAttribute('data-tooltip', a.getAttribute('data-label')); a.setAttribute('data-tooltip-delay', '0'); }
          } else {
            var step = (fabS + actS) / 2 + gap + i * (actS + gap * .75);
            if (o.direction === 'up') dy = -step; else if (o.direction === 'down') dy = step; else if (o.direction === 'left') dx = -step; else dx = step;
          }
          a.style.setProperty('--dx', dx.toFixed(1) + 'px'); a.style.setProperty('--dy', dy.toFixed(1) + 'px');
        });
      }
      function setOpen(open, focus) {
        if (open === el.hasAttribute('data-open')) return;
        fab.setAttribute('aria-expanded', String(open));
        if (open) {
          layout();
          el.setAttribute('data-open', '');
          if (scrim) scrim.setAttribute('data-open', '');
          pop = R.pushLayer(function () { setOpen(false); fab.focus(); });
          out = R.onOutside([el], function () { setOpen(false); });
          if (focus) setTimeout(function () { acts[0] && acts[0].focus(); }, 60);
          R.emit(el, 'open', {});
        } else {
          el.removeAttribute('data-open');
          if (scrim) scrim.removeAttribute('data-open');
          if (pop) pop(); if (out) out(); pop = out = null;
          if (acts.indexOf(d.activeElement) > -1) fab.focus();
          R.emit(el, 'close', {});
        }
      }
      layout();
      var offs = [
        R.on(fab, 'click', function (e) { setOpen(!el.hasAttribute('data-open'), e.detail === 0); }),
        R.on(wrap, 'click', '.fab-action', function (e, a) { R.emit(a, 'select', { action: a.getAttribute('data-label') || a.getAttribute('aria-label') }); if (!a.hasAttribute('data-keep-open')) setOpen(false); }),
        R.on(el, 'keydown', function (e) {
          if (!el.hasAttribute('data-open')) return;
          if (!/^Arrow/.test(e.key) && e.key !== 'Home' && e.key !== 'End') return;
          var i = acts.indexOf(d.activeElement), next;
          var fwd = radial ? /Right|Down/ : (o.direction === 'up' ? /Up/ : o.direction === 'down' ? /Down/ : o.direction === 'left' ? /Left/ : /Right/);
          if (e.key === 'Home') next = 0; else if (e.key === 'End') next = n - 1;
          else next = fwd.test(e.key) ? (i + 1) % n : (i <= 0 ? n - 1 : i - 1);
          e.preventDefault(); acts[next].focus();
        }),
        scrim ? R.on(scrim, 'click', function () { setOpen(false); }) : function () {}
      ];
      el.__fab = { open: function () { setOpen(true); }, close: function () { setOpen(false); }, toggle: function () { setOpen(!el.hasAttribute('data-open')); } };
      return function () { setOpen(false); offs.forEach(function (f) { f(); }); };
    }
  });
})(window.Ranj);

;
/* --- components/overlays/hover-card.js --- */
/*!
 * Ranj UI — hover card. Opens after data-open-delay (500ms) on hover or keyboard focus,
 * stays open while the pointer is over the trigger or the card, closes after data-close-delay (250ms).
 * <span class="hover-card" data-placement="bottom"><a class="hover-card-trigger">@vercel</a><div class="hover-card-content">…</div></span>
 */
(function (R) {
  'use strict';
  var K = R.__ov;

  R.define('hover-card', {
    selector: '.hover-card',
    mount: function (el) {
      var content = el.querySelector(':scope > .hover-card-content') || el.querySelector('.hover-card-content');
      if (!content) return;
      var trigger = el.querySelector('[data-hover-card-trigger]') || (el.firstElementChild !== content ? el.firstElementChild : el);
      var o = R.opts(el, { placement: 'bottom', offset: 8, openDelay: 500, closeDelay: 250, arrow: false });
      var h = null, t = 0;
      if (o.arrow) K.arrow(content);
      R.ensureId(content, 'hc');

      function open() {
        clearTimeout(t);
        if (h) return;
        el.setAttribute('data-state', 'open');
        h = K.float(content, trigger, {
          placement: o.placement, offset: o.offset, ignore: [trigger],
          onClose: function (reason) { h = null; el.setAttribute('data-state', 'closed'); R.emit(el, 'close', { reason: reason }); }
        });
        R.emit(el, 'open', {});
      }
      function close() { clearTimeout(t); if (h) h.close('hover'); }
      function enter(e) { if (e.pointerType === 'touch') return; clearTimeout(t); if (!h) t = setTimeout(open, o.openDelay); }
      function leave(e) { if (e.pointerType === 'touch') return; clearTimeout(t); t = setTimeout(close, o.closeDelay); }
      var offs = [
        R.on(trigger, 'pointerenter', enter), R.on(trigger, 'pointerleave', leave),
        R.on(content, 'pointerenter', enter), R.on(content, 'pointerleave', leave),
        R.on(trigger, 'focusin', function () { var fv = false; try { fv = trigger.matches(':focus-visible') || !!trigger.querySelector(':focus-visible'); } catch (x) {} if (fv) { clearTimeout(t); t = setTimeout(open, 200); } }),
        R.on(el, 'focusout', function (e) { if (!(e.relatedTarget && (el.contains(e.relatedTarget) || content.contains(e.relatedTarget)))) { clearTimeout(t); t = setTimeout(close, 100); } })
      ];
      el.__hoverCard = { open: open, close: close };
      return function () { clearTimeout(t); if (h) h.close('destroy'); offs.forEach(function (f) { f(); }); };
    }
  });
})(window.Ranj);

;
/* --- components/overlays/menubar.js --- */
/*!
 * Ranj UI — menubar. .menubar > .menubar-menu > (.menubar-trigger + .menubar-content)
 * ← → move between menus (and switch the open one), ↓ Enter Space open, hover switches while open.
 * Events: ranj:open { menu } / ranj:close on .menubar; ranj:select from items.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;

  R.define('menubar', {
    selector: '.menubar',
    mount: function (bar) {
      bar.setAttribute('role', 'menubar');
      var menus = R.$$(':scope > .menubar-menu', bar);
      var triggers = menus.map(function (m) { return m.querySelector(':scope > .menubar-trigger, :scope > .menubar-item'); }).filter(Boolean);
      var active = null; // { t, h }
      triggers.forEach(function (t, i) {
        var c = t.parentNode.querySelector(':scope > .menubar-content');
        t.setAttribute('role', 'menuitem');
        t.setAttribute('tabindex', i === 0 ? '0' : '-1');
        if (t.tagName === 'BUTTON' && !t.getAttribute('type')) t.setAttribute('type', 'button');
        if (c) { t.setAttribute('aria-haspopup', 'menu'); t.setAttribute('aria-expanded', 'false'); t.setAttribute('aria-controls', R.ensureId(c, 'mb')); K.prepMenu(c); c.setAttribute('aria-labelledby', R.ensureId(t, 'mbt')); }
      });
      function contentOf(t) { return t.parentNode.querySelector(':scope > .menubar-content'); }
      function rove(t) { triggers.forEach(function (x) { x.setAttribute('tabindex', x === t ? '0' : '-1'); }); }
      function openMenu(t, focus) {
        var c = contentOf(t);
        if (active && active.t === t) return;
        if (active) active.h.close('switch');
        rove(t);
        if (!c) { t.focus(); return; }
        t.setAttribute('aria-expanded', 'true');
        var h = K.menu(c, t, {
          placement: 'bottom-start', offset: 6, focus: focus || 'menu', trigger: t, ignore: triggers,
          onArrow: function (dir) { step(t, dir === 'right' ? 1 : -1, true); },
          onClose: function (reason) {
            t.setAttribute('aria-expanded', 'false');
            if (active && active.h === h) active = null;
            if (reason === 'escape' || reason === 'select' || reason === 'tab') try { t.focus({ preventScroll: true }); } catch (x) {}
            if (reason !== 'switch') R.emit(bar, 'close', { reason: reason });
          }
        });
        active = { t: t, h: h };
        R.emit(bar, 'open', { menu: t.parentNode });
      }
      function step(t, dir, keepOpen) {
        var i = triggers.indexOf(t), n = triggers[(i + dir + triggers.length) % triggers.length];
        if (keepOpen || active) { n.focus({ preventScroll: true }); openMenu(n, 'first'); }
        else { rove(n); n.focus(); }
      }
      var offs = [
        R.on(bar, 'click', '.menubar-trigger,.menubar-item', function (e, t) {
          if (triggers.indexOf(t) < 0) return;
          if (active && active.t === t) active.h.close('trigger'); else openMenu(t, e.detail === 0 ? 'first' : 'menu');
        }),
        R.on(bar, 'pointerover', function (e) {
          var t = e.target.closest && e.target.closest('.menubar-trigger,.menubar-item');
          if (t && active && active.t !== t && triggers.indexOf(t) > -1 && e.pointerType !== 'touch') openMenu(t, 'menu');
        }),
        R.on(bar, 'keydown', function (e) {
          var t = e.target.closest && e.target.closest('.menubar-trigger,.menubar-item');
          if (!t || triggers.indexOf(t) < 0) return;
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); step(t, e.key === 'ArrowRight' ? 1 : -1, false); }
          else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); var n = e.key === 'Home' ? triggers[0] : triggers[triggers.length - 1]; rove(n); n.focus(); }
          else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMenu(t, 'first'); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); openMenu(t, 'last'); }
        })
      ];
      return function () { if (active) active.h.close('destroy'); offs.forEach(function (f) { f(); }); };
    }
  });
})(window.Ranj);

;
/* --- components/overlays/navbar.js --- */
/*!
 * Ranj UI — navbar: hamburger panel (Escape / outside / link click closes), hover pill that glides
 * between links, data-scrolled once the page (or nearest scroll container) scrolls past data-offset (8px).
 * Events: ranj:open / ranj:close on .navbar.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document, w = window;

  function scrollParent(el) {
    for (var n = el.parentElement; n && n !== d.body && n !== d.documentElement; n = n.parentElement) {
      var s = getComputedStyle(n).overflowY;
      if ((s === 'auto' || s === 'scroll') && n.scrollHeight > n.clientHeight) return n;
    }
    return w;
  }

  R.define('navbar', {
    selector: '.navbar',
    mount: function (nav) {
      var toggle = nav.querySelector('.navbar-toggle'), panel = nav.querySelector('.navbar-mobile');
      var links = nav.querySelector('.navbar-nav');
      var offs = [], pop = null, outside = null;
      var o = R.opts(nav, { offset: 8 });

      // hover pill
      if (links && !links.querySelector('.navbar-hover') && !nav.hasAttribute('data-no-hover')) {
        var pill = d.createElement('span'); pill.className = 'navbar-hover'; pill.setAttribute('aria-hidden', 'true');
        links.insertBefore(pill, links.firstChild);
        offs.push(R.on(links, 'pointerover', function (e) {
          var a = e.target.closest('.navbar-link'); if (!a || e.pointerType === 'touch') return;
          links.style.setProperty('--hx', a.offsetLeft + 'px'); links.style.setProperty('--hw', a.offsetWidth + 'px');
          if (links.hasAttribute('data-hovering')) links.setAttribute('data-moved', '');
          links.setAttribute('data-hovering', '');
        }), R.on(links, 'pointerleave', function () { links.removeAttribute('data-hovering'); links.removeAttribute('data-moved'); }));
      }

      function setOpen(open) {
        if (!toggle || !panel) return;
        if (open === nav.hasAttribute('data-open')) return;
        toggle.setAttribute('aria-expanded', String(open));
        if (open) {
          panel.removeAttribute('data-closing');
          R.$$(':scope > *', panel).forEach(function (c, i) { c.style.setProperty('--i', i); });
          nav.setAttribute('data-open', '');
          pop = R.pushLayer(function () { setOpen(false); toggle.focus(); });
          outside = R.onOutside([nav], function () { setOpen(false); });
          R.emit(nav, 'open', {});
        } else {
          nav.removeAttribute('data-open');
          panel.setAttribute('data-closing', '');
          K.afterAnim(panel, function () { panel.removeAttribute('data-closing'); }, 300);
          if (pop) pop(); if (outside) outside(); pop = outside = null;
          R.emit(nav, 'close', {});
        }
      }
      if (toggle) {
        if (!toggle.querySelector('span')) toggle.innerHTML = '<span></span><span></span>';
        toggle.setAttribute('aria-expanded', 'false');
        if (!toggle.getAttribute('aria-label')) toggle.setAttribute('aria-label', 'Menu');
        if (panel) toggle.setAttribute('aria-controls', R.ensureId(panel, 'nav'));
        offs.push(R.on(toggle, 'click', function () { setOpen(!nav.hasAttribute('data-open')); }));
      }
      if (panel) offs.push(R.on(panel, 'click', 'a,[data-navbar-close]', function () { setOpen(false); }));

      // scrolled state
      var sp = scrollParent(nav), raf = 0;
      function onScroll() {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var y = sp === w ? w.scrollY : sp.scrollTop;
          if (y > o.offset) nav.setAttribute('data-scrolled', ''); else nav.removeAttribute('data-scrolled');
        });
      }
      sp.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      // close the mobile panel if the navbar grows past the breakpoint
      var ro = w.ResizeObserver ? new ResizeObserver(function () { if (nav.hasAttribute('data-open') && toggle && getComputedStyle(toggle).display === 'none') setOpen(false); }) : null;
      if (ro) ro.observe(nav);
      return function () { setOpen(false); offs.forEach(function (f) { f(); }); sp.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); if (ro) ro.disconnect(); };
    }
  });
})(window.Ranj);

;
/* --- components/overlays/navigation-menu.js --- */
/*!
 * Ranj UI — navigation menu (mega menu).
 * <nav class="nav-menu"><ul class="nav-menu-list"><li class="nav-menu-item"><button class="nav-menu-trigger">Products</button>
 *   <div class="nav-menu-content">…</div></li><li class="nav-menu-item"><a class="nav-menu-link" href="…">Pricing</a></li></ul></nav>
 * Opens on hover (data-delay 120ms) or click; the shared viewport morphs between panels and content slides in the
 * direction of travel. ← → move between items, ↓ / Enter opens and focuses the panel, Esc closes.
 * Events: ranj:change { value, open } on .nav-menu.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document, w = window;

  R.define('navigation-menu', {
    selector: '.nav-menu',
    mount: function (nav) {
      var list = nav.querySelector('.nav-menu-list'); if (!list) return;
      var o = R.opts(nav, { delay: 120, closeDelay: 260 });
      var items = R.$$(':scope > .nav-menu-item', list);
      var triggers = [], contents = [];
      var vp = d.createElement('div'); vp.className = 'nav-menu-viewport';
      var ind = d.createElement('span'); ind.className = 'nav-menu-indicator'; ind.setAttribute('aria-hidden', 'true');
      list.appendChild(ind);
      nav.appendChild(vp);
      items.forEach(function (it) {
        var t = it.querySelector(':scope > .nav-menu-trigger'), c = it.querySelector(':scope > .nav-menu-content');
        if (t && c) {
          triggers.push(t); contents.push(c);
          if (t.tagName === 'BUTTON' && !t.getAttribute('type')) t.setAttribute('type', 'button');
          t.setAttribute('aria-expanded', 'false');
          t.setAttribute('aria-controls', R.ensureId(c, 'navm'));
          c.__trigger = t; c.__home = it;
          vp.appendChild(c);
        }
      });
      var tops = R.$$(':scope > .nav-menu-item > .nav-menu-trigger, :scope > .nav-menu-item > .nav-menu-link', list);
      var active = null, openT = 0, closeT = 0, stopOut = null, pop = null, rafPos = 0;

      function anchorFor(t) {
        return { getBoundingClientRect: function () {
          var lr = list.getBoundingClientRect(), tr = t.getBoundingClientRect();
          var x = nav.getAttribute('data-align') === 'center' ? lr.left + lr.width / 2 - vp.offsetWidth / 2 : tr.left - 8;
          return { left: x, right: x, top: lr.top, bottom: lr.bottom, width: 0, height: lr.height };
        } };
      }
      function size(c) { vp.style.setProperty('--vw', c.offsetWidth + 'px'); vp.style.setProperty('--vh', c.offsetHeight + 'px'); }
      function place(instant) {
        if (!active) return;
        if (instant) vp.setAttribute('data-instant', '');
        K.place(vp, anchorFor(active), { placement: 'bottom-start', offset: 8, flip: false });
        var tr = active.getBoundingClientRect(), lr = list.getBoundingClientRect();
        list.style.setProperty('--ix', (tr.left - lr.left + tr.width / 2 - 6) + 'px');
        if (instant) { void vp.offsetWidth; vp.removeAttribute('data-instant'); }
      }
      function onScroll() { if (!rafPos) rafPos = requestAnimationFrame(function () { rafPos = 0; place(true); }); }

      function open(t, focusFirst) {
        clearTimeout(openT); clearTimeout(closeT);
        var i = triggers.indexOf(t); if (i < 0) return;
        var c = contents[i];
        if (active === t) { if (focusFirst) { var f0 = R.focusables(c)[0]; if (f0) f0.focus(); } return; }
        var prevI = active ? triggers.indexOf(active) : -1, prevC = prevI > -1 ? contents[prevI] : null;
        var wasOpen = !!active;
        if (active) active.setAttribute('aria-expanded', 'false');
        active = t;
        t.setAttribute('aria-expanded', 'true');
        if (prevC) {
          prevC.removeAttribute('data-active');
          prevC.setAttribute('data-leaving', '');
          prevC.setAttribute('data-motion', i > prevI ? 'to-start' : 'to-end');
          setTimeout(function () { if (!prevC.hasAttribute('data-active')) { prevC.removeAttribute('data-leaving'); prevC.removeAttribute('data-motion'); } }, 320);
        }
        c.removeAttribute('data-leaving');
        c.setAttribute('data-active', '');
        c.setAttribute('data-motion', wasOpen ? (i > prevI ? 'from-end' : 'from-start') : '');
        if (!wasOpen) {
          nav.setAttribute('data-open', '');
          nav.removeAttribute('data-moved');
          K.show(vp, function () { size(c); place(true); });
          stopOut = R.onOutside([nav], function () { close(); });
          pop = R.pushLayer(function () { var a = active; close(); if (a) a.focus(); });
          w.addEventListener('scroll', onScroll, true); w.addEventListener('resize', onScroll);
        } else { nav.setAttribute('data-moved', ''); size(c); place(false); }
        if (focusFirst) setTimeout(function () { var f = R.focusables(c)[0]; if (f) f.focus(); }, 30);
        R.emit(nav, 'change', { value: t.textContent.trim(), open: true });
      }
      function close() {
        clearTimeout(openT); clearTimeout(closeT);
        if (!active) return;
        var i = triggers.indexOf(active), c = contents[i];
        active.setAttribute('aria-expanded', 'false');
        active = null;
        nav.removeAttribute('data-open');
        if (stopOut) stopOut(); if (pop) pop(); stopOut = pop = null;
        w.removeEventListener('scroll', onScroll, true); w.removeEventListener('resize', onScroll);
        K.hide(vp, function () { if (c) { c.removeAttribute('data-active'); c.removeAttribute('data-motion'); } });
        R.emit(nav, 'change', { value: null, open: false });
      }

      var offs = [
        R.on(list, 'pointerover', function (e) {
          if (e.pointerType === 'touch') return;
          var t = e.target.closest('.nav-menu-trigger,.nav-menu-link'); if (!t || !list.contains(t)) return;
          clearTimeout(closeT); clearTimeout(openT);
          if (t.classList.contains('nav-menu-link')) { if (active) closeT = setTimeout(close, 150); return; }
          if (active) open(t); else openT = setTimeout(function () { open(t); }, o.delay);
        }),
        R.on(nav, 'pointerleave', function (e) { if (e.pointerType === 'touch') return; clearTimeout(openT); closeT = setTimeout(close, o.closeDelay); }),
        R.on(nav, 'pointerenter', function () { clearTimeout(closeT); }),
        R.on(list, 'click', '.nav-menu-trigger', function (e, t) {
          clearTimeout(openT);
          if (active === t && (e.detail === 0 || performance.now() - (t.__opened || 0) > 400)) close();
          else { open(t, e.detail === 0); t.__opened = performance.now(); }
        }),
        R.on(list, 'keydown', function (e) {
          var t = e.target.closest('.nav-menu-trigger,.nav-menu-link'); if (!t) return;
          var i = tops.indexOf(t);
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            var n = tops[(i + (e.key === 'ArrowRight' ? 1 : -1) + tops.length) % tops.length];
            n.focus();
            if (active && n.classList.contains('nav-menu-trigger')) open(n); else if (active) close();
          } else if (e.key === 'ArrowDown' && t.classList.contains('nav-menu-trigger')) { e.preventDefault(); open(t, true); }
          else if (e.key === 'Tab' && !e.shiftKey && active === t) {
            var f = R.focusables(contents[triggers.indexOf(t)])[0]; if (f) { e.preventDefault(); f.focus(); }
          }
        }),
        R.on(vp, 'keydown', function (e) {
          if (e.key !== 'Tab' || !active) return;
          var c = contents[triggers.indexOf(active)], f = R.focusables(c);
          if (!e.shiftKey && d.activeElement === f[f.length - 1]) { e.preventDefault(); var i = tops.indexOf(active), n = tops[i + 1]; close(); if (n) n.focus(); else tops[i].focus(); }
          else if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); active.focus(); }
        }),
        R.on(vp, 'click', 'a', function () { close(); })
      ];
      return function () {
        close(); offs.forEach(function (f) { f(); });
        contents.forEach(function (c) { if (c.__home) c.__home.appendChild(c); });
        vp.remove(); ind.remove(); cancelAnimationFrame(rafPos);
      };
    }
  });
})(window.Ranj);

;
/* --- components/overlays/notification-center.js --- */
/*!
 * Ranj UI — notification center + iOS push stack.
 * .notification-center > .notif-trigger (+ .notif-count) + .notif-panel (.notif-list > .notif-item[data-unread])
 *   .notif-mark-all marks everything read; clicking an item marks it read; .notif-tabs [data-filter="all|unread"].
 *   Ranj.notifications.add(el, { html | title, text, time, media, href }) · Ranj.notifications.markAllRead(el)
 *   Events: ranj:change { unread } on .notification-center, ranj:open / ranj:close.
 * .push-stack > .push-cards > .push-card — collapsed iOS-style pile; click to expand / collapse.
 *   Ranj.push(stackEl, { app, title, body, time, icon, color }) prepends a card.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;

  R.define('notification-center', {
    selector: '.notification-center',
    mount: function (el) {
      var trigger = el.querySelector('.notif-trigger'), panel = el.querySelector('.notif-panel');
      if (!trigger || !panel) return;
      var count = trigger.querySelector('.notif-count'), list = panel.querySelector('.notif-list');
      var markAll = panel.querySelector('.notif-mark-all'), filter = 'all', h = null;
      var o = R.opts(el, { placement: 'bottom-end', offset: 10 });
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', R.ensureId(panel, 'notif'));
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('tabindex', '-1');
      if (!panel.getAttribute('aria-label')) panel.setAttribute('aria-label', 'Notifications');

      function items() { return R.$$('.notif-item', list); }
      function sync(pop) {
        var unread = items().filter(function (i) { return i.hasAttribute('data-unread'); }).length;
        if (count) {
          count.textContent = unread > 99 ? '99+' : unread;
          if (unread) count.removeAttribute('data-empty'); else count.setAttribute('data-empty', '');
          if (pop && unread) { count.removeAttribute('data-pop'); void count.offsetWidth; count.setAttribute('data-pop', ''); }
        }
        var lbl = trigger.getAttribute('data-label') || 'Notifications';
        trigger.setAttribute('aria-label', lbl + (unread ? ' (' + unread + ' unread)' : ''));
        if (markAll) markAll.disabled = !unread;
        R.$$('[data-filter="unread"] span', panel).forEach(function (s) { s.textContent = unread; });
        var vis = 0;
        items().forEach(function (i) { var show = filter === 'all' || i.hasAttribute('data-unread'); i.hidden = !show; if (show) vis++; });
        if (!vis) panel.setAttribute('data-empty', ''); else panel.removeAttribute('data-empty');
        return unread;
      }
      function change(pop) { var u = sync(pop); R.emit(el, 'change', { unread: u }); }
      function open() {
        if (h) return;
        trigger.setAttribute('aria-expanded', 'true');
        h = K.float(panel, trigger, { placement: o.placement, offset: o.offset, ignore: [trigger], onClose: function (reason) {
          h = null; trigger.setAttribute('aria-expanded', 'false');
          if (reason === 'escape') trigger.focus();
          R.emit(el, 'close', { reason: reason });
        } });
        setTimeout(function () { try { panel.focus({ preventScroll: true }); } catch (x) {} }, 0);
        R.emit(el, 'open', {});
      }
      var offs = [
        R.on(trigger, 'click', function () { if (h) h.close('trigger'); else open(); }),
        R.on(panel, 'click', '.notif-mark-all', function () { items().forEach(function (i) { i.removeAttribute('data-unread'); }); change(); }),
        R.on(panel, 'click', '.notif-item', function (e, it) { if (e.target.closest('button,a:not(.notif-item)') && e.target.closest('.notif-actions')) return; if (it.hasAttribute('data-unread')) { it.removeAttribute('data-unread'); change(); } }),
        R.on(panel, 'click', '.notif-tabs [data-filter]', function (e, b) {
          filter = b.getAttribute('data-filter');
          R.$$('.notif-tabs [data-filter]', panel).forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
          sync();
        }),
        R.on(panel, 'click', '[data-notif-close]', function () { if (h) h.close('button'); })
      ];
      R.$$('.notif-tabs [data-filter]', panel).forEach(function (b) { b.setAttribute('role', 'tab'); if (!b.hasAttribute('aria-selected')) b.setAttribute('aria-selected', String(b.getAttribute('data-filter') === 'all')); });
      sync();
      el.__notif = {
        open: open, close: function () { if (h) h.close('api'); },
        add: function (n) {
          var it = d.createElement(n.href ? 'a' : 'div');
          it.className = 'notif-item'; it.setAttribute('data-unread', ''); it.setAttribute('data-new', '');
          if (n.href) it.href = n.href;
          it.innerHTML = n.html || ((n.media ? '<div class="notif-media">' + n.media + '</div>' : '') +
            '<div class="notif-body"><p>' + (n.title ? '<b>' + R.esc(n.title) + '</b> ' : '') + R.esc(n.text || '') + '</p>' + (n.time ? '<small>' + R.esc(n.time) + '</small>' : '') + '</div>');
          list.insertBefore(it, list.firstChild);
          trigger.removeAttribute('data-ring'); void trigger.offsetWidth; trigger.setAttribute('data-ring', '');
          setTimeout(function () { trigger.removeAttribute('data-ring'); it.removeAttribute('data-new'); }, 900);
          change(true);
          if (h) h.reposition();
          return it;
        },
        markAllRead: function () { items().forEach(function (i) { i.removeAttribute('data-unread'); }); change(); }
      };
      return function () { if (h) h.close('destroy'); offs.forEach(function (f) { f(); }); };
    }
  });

  function inst(el) { el = typeof el === 'string' ? d.querySelector(el) : el; return el && el.__notif; }
  R.notifications = {
    add: function (el, n) { var i = inst(el); return i && i.add(n || {}); },
    markAllRead: function (el) { var i = inst(el); if (i) i.markAllRead(); },
    open: function (el) { var i = inst(el); if (i) i.open(); },
    close: function (el) { var i = inst(el); if (i) i.close(); }
  };

  /* ---------- iOS push stack ---------- */
  R.define('push-stack', {
    selector: '.push-stack',
    mount: function (el) {
      var wrap = el.querySelector('.push-cards') || el;
      var more = el.querySelector('.push-more');
      var gap = 8, peek = 10, maxPeek = 2;
      function cards() { return R.$$('.push-card', wrap).filter(function (c) { return !c.hasAttribute('data-removed'); }); }
      function layout() {
        var cs = cards(), exp = el.hasAttribute('data-expanded'), off = 0, frontH = 0;
        cs.forEach(function (c, i) {
          var prev = c.style.height; c.style.height = 'auto'; var hh = c.offsetHeight; c.style.height = prev; c.__h = hh;
          if (i === 0) frontH = hh;
        });
        el.style.setProperty('--push-front-h', frontH + 'px');
        cs.forEach(function (c, i) {
          c.style.setProperty('--i', i);
          if (exp) { c.style.setProperty('--y', off + 'px'); c.style.setProperty('--s', 1); c.removeAttribute('data-hidden'); off += c.__h + gap; }
          else {
            c.style.setProperty('--y', Math.min(i, maxPeek) * peek + 'px');
            c.style.setProperty('--s', (1 - Math.min(i, maxPeek) * .05).toFixed(3));
            if (i > maxPeek) c.setAttribute('data-hidden', ''); else c.removeAttribute('data-hidden');
          }
          c.setAttribute('aria-setsize', cs.length); c.setAttribute('aria-posinset', i + 1);
        });
        var hgt = !cs.length ? 0 : exp ? off - gap : frontH + Math.min(cs.length - 1, maxPeek) * peek;
        wrap.style.setProperty('--push-h', hgt + 'px');
        el.setAttribute('data-count', cs.length);
        if (more) more.textContent = cs.length > 1 ? (cs.length - 1) + ' more notification' + (cs.length > 2 ? 's' : '') : '';
      }
      function toggle(force) {
        var exp = force != null ? force : !el.hasAttribute('data-expanded');
        if (exp) el.setAttribute('data-expanded', ''); else el.removeAttribute('data-expanded');
        R.$$('.push-card', wrap).forEach(function (c) { c.setAttribute('aria-expanded', String(exp)); });
        layout();
        R.emit(el, exp ? 'open' : 'close', {});
      }
      var offs = [
        R.on(wrap, 'click', '.push-card', function () { if (!el.hasAttribute('data-expanded') && cards().length > 1) toggle(true); }),
        R.on(el, 'click', '[data-push-collapse]', function () { toggle(false); }),
        R.on(el, 'click', '[data-push-clear]', function () {
          cards().forEach(function (c, i) { setTimeout(function () { c.setAttribute('data-removed', ''); }, i * 60); });
          setTimeout(function () { R.$$('.push-card', wrap).forEach(function (c) { c.remove(); }); toggle(false); R.emit(el, 'change', { count: 0 }); }, cards().length * 60 + 400);
        }),
        R.on(wrap, 'keydown', '.push-card', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } })
      ];
      R.$$('.push-card', wrap).forEach(function (c) { c.setAttribute('tabindex', '0'); c.setAttribute('role', 'article'); });
      var ro = window.ResizeObserver ? new ResizeObserver(function () { layout(); }) : null;
      if (ro) ro.observe(el);
      layout();
      el.__push = {
        add: function (n) {
          var c = d.createElement('div');
          c.className = 'push-card'; c.setAttribute('tabindex', '0'); c.setAttribute('role', 'article'); c.setAttribute('data-enter', '');
          c.innerHTML = '<div class="push-icon" style="--push-icon-bg:' + R.esc(n.color || '#34c759') + '">' + (n.icon || '') + '</div>' +
            '<div class="push-text"><div class="push-top"><b>' + R.esc(n.title || n.app || '') + '</b><small>' + R.esc(n.time || 'now') + '</small></div><p>' + R.esc(n.body || '') + '</p></div>';
          wrap.insertBefore(c, wrap.firstChild);
          layout();
          setTimeout(function () { c.removeAttribute('data-enter'); }, 650);
          R.emit(el, 'change', { count: cards().length });
          return c;
        },
        toggle: toggle, layout: layout
      };
      return function () { offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); };
    }
  });
  R.push = function (el, n) { el = typeof el === 'string' ? d.querySelector(el) : el; return el && el.__push ? el.__push.add(n || {}) : null; };
})(window.Ranj);

;
/* --- components/overlays/popover.js --- */
/*!
 * Ranj UI — popover.
 * <div class="popover" data-placement="bottom" data-arrow><button data-popover-trigger>…</button><div class="popover-content">…</div></div>
 * Standalone: <button data-popover-target="pid">…</button> … <div class="popover-content" id="pid">…</div>
 * Events: ranj:open / ranj:close on the .popover (or the trigger when standalone).
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;

  R.define('popover', {
    selector: '.popover,[data-popover-target]',
    mount: function (el) {
      var standalone = el.hasAttribute('data-popover-target');
      var trigger = standalone ? el : el.querySelector('[data-popover-trigger]');
      var content = standalone ? d.getElementById(el.getAttribute('data-popover-target')) : el.querySelector('.popover-content');
      if (!trigger || !content) return;
      var host = standalone ? trigger : el;
      var o = R.opts(host, { placement: 'bottom', offset: 8, arrow: false, trigger: 'click', openDelay: 120, closeDelay: 200 });
      var h = null, kb = false, timer = 0;
      if (o.arrow || host.hasAttribute('data-arrow')) K.arrow(content);
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', R.ensureId(content, 'pop'));
      if (!content.getAttribute('role')) content.setAttribute('role', 'dialog');
      if (!content.hasAttribute('tabindex')) content.setAttribute('tabindex', '-1');

      function open() {
        if (h) return;
        host.setAttribute('data-state', 'open');
        trigger.setAttribute('aria-expanded', 'true');
        h = K.float(content, trigger, {
          placement: o.placement, offset: o.offset, ignore: [trigger],
          onClose: function (reason) {
            var had = content.contains(d.activeElement);
            h = null;
            host.setAttribute('data-state', 'closed');
            trigger.setAttribute('aria-expanded', 'false');
            if (reason === 'escape' || (had && reason !== 'outside' && reason !== 'blur')) try { trigger.focus({ preventScroll: true }); } catch (x) {}
            R.emit(host, 'close', { reason: reason });
          }
        });
        if (o.trigger === 'click') {
          var f = content.querySelector('[autofocus],[data-autofocus]') || (kb ? R.focusables(content)[0] : null);
          setTimeout(function () { try { (f || content).focus({ preventScroll: true }); } catch (x) {} }, 0);
        }
        R.emit(host, 'open', {});
      }
      function close(reason) { if (h) h.close(reason || 'api'); }
      function toggle() { if (h) close('trigger'); else open(); }

      var offs = [];
      if (o.trigger === 'hover') {
        var enter = function (e) { if (e.pointerType === 'touch') return; clearTimeout(timer); timer = setTimeout(open, o.openDelay); };
        var leave = function (e) { if (e.pointerType === 'touch') return; clearTimeout(timer); timer = setTimeout(function () { close('hover'); }, o.closeDelay); };
        [trigger, content].forEach(function (n) { offs.push(R.on(n, 'pointerenter', enter), R.on(n, 'pointerleave', leave)); });
        offs.push(R.on(trigger, 'focus', open), R.on(trigger, 'click', function (e) { if (e.pointerType === 'touch' || e.detail === 0) toggle(); }));
      } else {
        offs.push(R.on(trigger, 'click', function (e) { e.preventDefault(); kb = e.detail === 0; toggle(); }));
      }
      offs.push(R.on(content, 'click', '[data-popover-close],.popover-close', function () { close('button'); }));
      offs.push(R.on(content, 'focusout', function (e) {
        var to = e.relatedTarget;
        if (h && to && !content.contains(to) && !trigger.contains(to)) close('blur');
      }));
      el.__popover = { open: open, close: close, toggle: toggle };
      return function () { clearTimeout(timer); close('destroy'); offs.forEach(function (f) { f(); }); };
    }
  });

  function inst(x) { var el = typeof x === 'string' ? d.getElementById(x) : x; return el && el.__popover; }
  R.popover = {
    open: function (x) { var i = inst(x); if (i) i.open(); },
    close: function (x) { var i = inst(x); if (i) i.close(); },
    toggle: function (x) { var i = inst(x); if (i) i.toggle(); }
  };
})(window.Ranj);

;
/* --- components/overlays/sidebar.js --- */
/*!
 * Ranj UI — sidebar. [data-sidebar-toggle="id"] collapses .sidebar to an icon rail (v1: .sidebar-collapsed),
 * or opens it off-canvas when its .sidebar-shell is narrow. Collapsed items get tooltips automatically.
 * Nested: .sidebar-sub > .sidebar-item + .sidebar-sub-content. Clicking an item moves aria-current.
 * data-persist="key" remembers the collapsed state. Events: ranj:change { collapsed } / { item } on .sidebar.
 */
(function (R) {
  'use strict';
  var d = document;

  function isMobile(sb) { return getComputedStyle(sb).getPropertyValue('--sidebar-mobile').trim() === '1'; }
  function textOf(it) { var t = it.querySelector('.sidebar-item-text'); return t ? t.textContent.trim() : ''; }

  function syncTips(sb) {
    var on = sb.classList.contains('sidebar-collapsed') && !isMobile(sb);
    R.$$('.sidebar-item', sb).forEach(function (it) {
      if (on) {
        if (!it.hasAttribute('data-tooltip') || it.hasAttribute('data-sb-tip')) {
          var t = textOf(it); if (!t) return;
          var b = it.querySelector('.sidebar-badge');
          it.setAttribute('data-tooltip', t + (b && b.textContent.trim() ? ' · ' + b.textContent.trim() : ''));
          it.setAttribute('data-tooltip-placement', 'right'); it.setAttribute('data-tooltip-delay', '0'); it.setAttribute('data-sb-tip', '');
          if (!it.getAttribute('aria-label')) { it.setAttribute('aria-label', t); it.setAttribute('data-sb-label', ''); }
        }
      } else if (it.hasAttribute('data-sb-tip')) {
        ['data-tooltip', 'data-tooltip-placement', 'data-tooltip-delay', 'data-sb-tip'].forEach(function (a) { it.removeAttribute(a); });
        if (it.hasAttribute('data-sb-label')) { it.removeAttribute('aria-label'); it.removeAttribute('data-sb-label'); }
      }
    });
  }

  function setMobile(layout, sb, open) {
    if (!layout) return;
    if (open) {
      layout.setAttribute('data-mobile-open', '');
      sb.__pop = R.pushLayer(function () { setMobile(layout, sb, false); });
      var f = R.focusables(sb)[0]; if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 50);
    } else {
      layout.removeAttribute('data-mobile-open');
      if (sb.__pop) { sb.__pop(); sb.__pop = null; }
    }
    R.emit(sb, open ? 'open' : 'close', {});
  }
  function toggle(sb, force) {
    var layout = sb.closest('.sidebar-shell');
    if (isMobile(sb)) { setMobile(layout, sb, force != null ? force : !layout.hasAttribute('data-mobile-open')); return; }
    var c = force != null ? !!force : !sb.classList.contains('sidebar-collapsed');
    sb.classList.toggle('sidebar-collapsed', c);
    sb.setAttribute('data-state', c ? 'collapsed' : 'expanded');
    var key = sb.getAttribute('data-persist');
    if (key) try { localStorage.setItem('ranj-sidebar:' + key, c ? '1' : '0'); } catch (e) {}
    R.$$('[data-sidebar-toggle]').forEach(function (b) { var id = b.getAttribute('data-sidebar-toggle'); if (!id || id === sb.id) b.setAttribute('aria-expanded', String(!c)); });
    syncTips(sb);
    R.emit(sb, 'change', { collapsed: c });
  }

  R.define('sidebar', {
    selector: '.sidebar',
    setup: function () {
      R.on(d, 'click', '[data-sidebar-toggle]', function (e, b) {
        var id = b.getAttribute('data-sidebar-toggle');
        var sb = (id && d.getElementById(id)) || (b.closest('.sidebar-shell') && b.closest('.sidebar-shell').querySelector('.sidebar')) || b.closest('.sidebar') || d.querySelector('.sidebar');
        if (sb) toggle(sb);
      });
      R.on(d, 'click', '.sidebar-backdrop', function (e, bd) { var l = bd.closest('.sidebar-shell'), sb = l && l.querySelector('.sidebar'); if (sb) setMobile(l, sb, false); });
    },
    mount: function (sb) {
      var key = sb.getAttribute('data-persist');
      if (key) try { var v = localStorage.getItem('ranj-sidebar:' + key); if (v) sb.classList.toggle('sidebar-collapsed', v === '1'); } catch (e) {}
      if (!sb.getAttribute('aria-label') && sb.tagName !== 'NAV') sb.setAttribute('aria-label', 'Sidebar');
      R.$$('.sidebar-sub', sb).forEach(function (sub) {
        var t = sub.querySelector(':scope > .sidebar-item'), c = sub.querySelector(':scope > .sidebar-sub-content');
        if (!t) return;
        if (t.tagName === 'BUTTON' && !t.getAttribute('type')) t.setAttribute('type', 'button');
        var open = sub.getAttribute('data-state') === 'open';
        sub.setAttribute('data-state', open ? 'open' : 'closed');
        t.setAttribute('aria-expanded', String(open));
        if (c) { t.setAttribute('aria-controls', R.ensureId(c, 'sbs')); c.inert = !open; }
      });
      syncTips(sb);
      var offs = [
        R.on(sb, 'click', '.sidebar-item', function (e, it) {
          var sub = it.parentElement && it.parentElement.classList.contains('sidebar-sub') && it === it.parentElement.querySelector(':scope > .sidebar-item') ? it.parentElement : null;
          if (sub) {
            e.preventDefault();
            if (sb.classList.contains('sidebar-collapsed') && !isMobile(sb)) { toggle(sb, false); sub.setAttribute('data-state', 'closed'); }
            var open = sub.getAttribute('data-state') !== 'open';
            sub.setAttribute('data-state', open ? 'open' : 'closed');
            it.setAttribute('aria-expanded', String(open));
            var c = sub.querySelector(':scope > .sidebar-sub-content'); if (c) c.inert = !open;
            return;
          }
          if (sb.hasAttribute('data-static') || it.hasAttribute('data-no-select')) return;
          if (it.getAttribute('href') === '#') e.preventDefault();
          R.$$('.sidebar-item[aria-current]', sb).forEach(function (x) { x.removeAttribute('aria-current'); });
          it.setAttribute('aria-current', 'page');
          R.emit(sb, 'change', { item: it, value: it.getAttribute('data-value') || textOf(it) });
          var layout = sb.closest('.sidebar-shell');
          if (layout && layout.hasAttribute('data-mobile-open')) setMobile(layout, sb, false);
        })
      ];
      var ro = window.ResizeObserver ? new ResizeObserver(function () {
        syncTips(sb);
        var l = sb.closest('.sidebar-shell'); if (l && l.hasAttribute('data-mobile-open') && !isMobile(sb)) setMobile(l, sb, false);
      }) : null;
      if (ro) ro.observe(sb.closest('.sidebar-shell') || sb);
      return function () { offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); if (sb.__pop) sb.__pop(); };
    }
  });

  R.sidebar = {
    toggle: function (el, c) { el = typeof el === 'string' ? d.getElementById(el) || d.querySelector(el) : el; if (el) toggle(el, c); },
    collapse: function (el) { R.sidebar.toggle(el, true); }, expand: function (el) { R.sidebar.toggle(el, false); }
  };
})(window.Ranj);

;
/* --- components/overlays/stepper.js --- */
/*!
 * Ranj UI — stepper.
 * <ol class="stepper" id="s" data-current="1" data-clickable><li class="stepper-item"><span class="stepper-indicator"></span>
 *   <div class="stepper-text"><b class="stepper-title">Account</b><span class="stepper-desc">…</span></div></li>…</ol>
 * States are derived from data-current (0-based): before → complete, at → current, after → upcoming.
 * data-clickable: click/Enter on completed steps (data-clickable="all": any step) to jump back.
 * Buttons: [data-stepper-next="id"] / [data-stepper-prev="id"]. Panels: [data-step-panel="n"] inside [data-stepper-panels="id"].
 * API: Ranj.stepper(el).next() / prev() / go(i) / error(i). Events: ranj:change { index, total, done }.
 */
(function (R) {
  'use strict';
  var d = document;

  R.define('stepper', {
    selector: '.stepper',
    setup: function () {
      R.on(d, 'click', '[data-stepper-next],[data-stepper-prev]', function (e, b) {
        var id = b.getAttribute('data-stepper-next') || b.getAttribute('data-stepper-prev');
        var el = d.getElementById(id); if (!el || !el.__stepper) return;
        if (b.hasAttribute('data-stepper-next')) el.__stepper.next(); else el.__stepper.prev();
      });
    },
    mount: function (el) {
      var clickable = el.getAttribute('data-clickable');
      function items() { return R.$$(':scope > .stepper-item', el); }
      var cur = R.clamp(parseInt(el.getAttribute('data-current'), 10) || 0, 0, items().length);
      var errors = {};
      el.setAttribute('role', 'list');
      items().forEach(function (it, i) {
        it.setAttribute('role', 'listitem');
        if (clickable !== null) { it.setAttribute('data-clickable', ''); it.setAttribute('tabindex', '-1'); }
      });
      function render(silent) {
        var n = items().length;
        items().forEach(function (it, i) {
          var st = errors[i] ? 'error' : i < cur ? 'complete' : i === cur ? 'current' : 'upcoming';
          it.setAttribute('data-state', st);
          if (i === cur) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
          if (clickable !== null) {
            var can = clickable === 'all' || i < cur;
            it.setAttribute('tabindex', can || i === cur ? '0' : '-1');
            it.setAttribute('aria-disabled', String(!can && i !== cur));
          }
          var t = it.querySelector('.stepper-title');
          var lbl = (t ? t.textContent.trim() : 'Step ' + (i + 1)) + ', ' + (st === 'complete' ? 'completed' : st === 'current' ? 'current step' : st === 'error' ? 'has an error' : 'not started');
          it.setAttribute('aria-label', 'Step ' + (i + 1) + ' of ' + n + ': ' + lbl);
        });
        el.setAttribute('data-current', cur);
        R.$$('[data-stepper-panels="' + el.id + '"] [data-step-panel]').forEach(function (p) { p.hidden = +p.getAttribute('data-step-panel') !== cur; });
        R.$$('[data-stepper-prev="' + el.id + '"]').forEach(function (b) { b.disabled = cur <= 0; });
        R.$$('[data-stepper-next="' + el.id + '"]').forEach(function (b) {
          b.disabled = cur >= n;
          var last = b.getAttribute('data-last-label'), lab = b.querySelector('[data-label]') || b;
          if (last) { if (!b.__lbl) b.__lbl = lab.textContent; lab.textContent = cur >= n - 1 ? last : b.__lbl; }
        });
        if (!silent) R.emit(el, 'change', { index: cur, total: n, done: cur >= n });
      }
      function go(i) { cur = R.clamp(i, 0, items().length); render(); }
      var api = {
        next: function () { delete errors[cur]; go(cur + 1); }, prev: function () { go(cur - 1); }, go: go,
        error: function (i, on) { if (on === false) delete errors[i]; else errors[i == null ? cur : i] = true; render(); },
        get index() { return cur; }
      };
      el.__stepper = api;
      render(true);
      var offs = [];
      if (clickable !== null) {
        offs.push(R.on(el, 'click', '.stepper-item', function (e, it) { var i = items().indexOf(it); if (clickable === 'all' || i < cur) go(i); }));
        offs.push(R.on(el, 'keydown', '.stepper-item', function (e, it) {
          var i = items().indexOf(it);
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (clickable === 'all' || i < cur) go(i); }
          else if (/Arrow(Right|Down|Left|Up)/.test(e.key)) {
            e.preventDefault();
            var dir = /Right|Down/.test(e.key) ? 1 : -1, is = items(), j = i + dir;
            while (j >= 0 && j < is.length && is[j].getAttribute('tabindex') === '-1') j += dir;
            if (is[j]) is[j].focus();
          }
        }));
      }
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  R.stepper = function (el) { el = typeof el === 'string' ? d.getElementById(el) || d.querySelector(el) : el; return el && el.__stepper; };
})(window.Ranj);

;
/* --- components/overlays/tabs.js --- */
/*!
 * Ranj UI — tabs (v1 compatible: .tabs > .tabs-list > .tabs-trigger[data-tab] + .tab-panel[data-tab-panel]).
 * Sliding indicator, roving arrows / Home / End (automatic activation; data-activation="manual" to require Enter),
 * lazy panels (<div class="tab-panel" data-lazy><template>…</template></div>), ranj:change { value, index }.
 * API: Ranj.tabs.select(tabsEl, value)
 */
(function (R) {
  'use strict';
  var d = document;

  R.define('tabs', {
    selector: '.tabs',
    mount: function (el) {
      var list = R.$$('.tabs-list', el).filter(function (l) { return l.closest('.tabs') === el; })[0];
      if (!list) return;
      var vertical = el.classList.contains('tabs-vertical');
      var manual = el.getAttribute('data-activation') === 'manual';
      function triggers() { return R.$$('.tabs-trigger', list).filter(function (t) { return t.closest('.tabs') === el; }); }
      function panels() { return R.$$('[data-tab-panel],.tab-panel,.tabs-panel', el).filter(function (p) { return p.closest('.tabs') === el; }); }
      function val(t) { return t.getAttribute('data-tab') || t.getAttribute('data-value'); }
      function panelFor(v) { return panels().filter(function (p) { return (p.getAttribute('data-tab-panel') || p.getAttribute('data-value')) === v; })[0]; }

      list.setAttribute('role', 'tablist');
      if (vertical) list.setAttribute('aria-orientation', 'vertical');
      triggers().forEach(function (t, i) {
        t.setAttribute('role', 'tab');
        if (t.tagName === 'BUTTON' && !t.getAttribute('type')) t.setAttribute('type', 'button');
        if (!val(t)) t.setAttribute('data-tab', 'tab-' + i);
        var p = panelFor(val(t)) || panels()[i];
        if (p) {
          if (!p.hasAttribute('data-tab-panel') && !p.hasAttribute('data-value')) p.setAttribute('data-tab-panel', val(t));
          p.setAttribute('role', 'tabpanel');
          if (!p.hasAttribute('tabindex')) p.setAttribute('tabindex', '0');
          t.setAttribute('aria-controls', R.ensureId(p, 'tabp'));
          p.setAttribute('aria-labelledby', R.ensureId(t, 'tab'));
        }
      });

      var ind = list.querySelector(':scope > .tabs-indicator');
      if (!ind && el.getAttribute('data-indicator') !== 'false') {
        ind = d.createElement('span'); ind.className = 'tabs-indicator'; ind.setAttribute('aria-hidden', 'true');
        list.insertBefore(ind, list.firstChild);
      }
      var current = null;
      function place() {
        if (!ind || !current) return;
        list.style.setProperty('--tab-x', current.offsetLeft + 'px');
        list.style.setProperty('--tab-y', current.offsetTop + 'px');
        list.style.setProperty('--tab-w', current.offsetWidth + 'px');
        list.style.setProperty('--tab-h', current.offsetHeight + 'px');
      }
      function select(t, o) {
        o = o || {};
        if (!t || t.disabled || t.getAttribute('aria-disabled') === 'true') return;
        var changed = current !== t;
        current = t;
        var v = val(t);
        triggers().forEach(function (x) {
          var on = x === t;
          x.setAttribute('aria-selected', String(on));
          x.setAttribute('tabindex', on ? '0' : '-1');
          x.classList.toggle('active', on);
          x.setAttribute('data-state', on ? 'active' : 'inactive');
        });
        panels().forEach(function (p) {
          var on = (p.getAttribute('data-tab-panel') || p.getAttribute('data-value')) === v;
          p.classList.toggle('active', on);
          p.setAttribute('data-state', on ? 'active' : 'inactive');
          if (on && p.hasAttribute('data-lazy')) {
            var tpl = p.querySelector(':scope > template');
            if (tpl) { p.removeAttribute('data-lazy'); p.appendChild(tpl.content.cloneNode(true)); tpl.remove(); R.init(p); R.emit(p, 'load', {}); }
          }
        });
        place();
        // keep the active tab visible in a scrolling list
        if (list.scrollWidth > list.clientWidth + 1) {
          var l = t.offsetLeft, r = l + t.offsetWidth;
          if (l < list.scrollLeft) list.scrollTo({ left: l - 16, behavior: o.instant ? 'auto' : 'smooth' });
          else if (r > list.scrollLeft + list.clientWidth) list.scrollTo({ left: r - list.clientWidth + 16, behavior: o.instant ? 'auto' : 'smooth' });
        }
        if (o.focus) t.focus();
        if (changed && !o.silent) R.emit(el, 'change', { value: v, index: triggers().indexOf(t), trigger: t });
      }

      var initial = triggers().filter(function (t) { return t.getAttribute('aria-selected') === 'true' || t.classList.contains('active'); })[0] ||
        (el.getAttribute('data-default') && triggers().filter(function (t) { return val(t) === el.getAttribute('data-default'); })[0]) ||
        triggers().filter(function (t) { return !t.disabled; })[0];
      select(initial, { silent: true, instant: true });
      requestAnimationFrame(function () { place(); requestAnimationFrame(function () { el.setAttribute('data-ready', ''); }); });

      var offs = [
        R.on(list, 'click', '.tabs-trigger', function (e, t) { if (t.closest('.tabs') === el) select(t); }),
        R.on(list, 'keydown', '.tabs-trigger', function (e, t) {
          if (t.closest('.tabs') !== el) return;
          var ts = triggers().filter(function (x) { return !x.disabled && x.getAttribute('aria-disabled') !== 'true'; });
          var i = ts.indexOf(t), n = -1;
          var next = vertical ? 'ArrowDown' : 'ArrowRight', prev = vertical ? 'ArrowUp' : 'ArrowLeft';
          if (e.key === next || (!vertical && e.key === 'ArrowDown' && false)) n = (i + 1) % ts.length;
          else if (e.key === prev) n = (i - 1 + ts.length) % ts.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = ts.length - 1;
          else if ((e.key === 'Enter' || e.key === ' ') && manual) { e.preventDefault(); select(t); return; }
          if (n < 0) return;
          e.preventDefault();
          if (manual) { ts[n].focus(); } else select(ts[n], { focus: true });
        })
      ];
      var ro = window.ResizeObserver ? new ResizeObserver(function () { place(); }) : null;
      if (ro) { ro.observe(list); triggers().forEach(function (t) { ro.observe(t); }); }
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(place);
      el.__tabs = { select: function (v) { var t = triggers().filter(function (x) { return val(x) === String(v); })[0] || triggers()[v]; select(t); }, refresh: place };
      return function () { offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); };
    }
  });

  R.tabs = { select: function (el, v) { el = typeof el === 'string' ? d.querySelector(el) : el; if (el && el.__tabs) el.__tabs.select(v); } };
})(window.Ranj);

;
/* --- components/overlays/toast.js --- */
/*!
 * Ranj UI — toast (Sonner-style).
 *   Ranj.toast('Saved')                                     → id
 *   Ranj.toast({ title, description, type, duration, position, action: { label, onClick }, cancel, closeButton, rich, progress, icon, html })
 *   Ranj.toast.success / error / warning / info / loading (title, opts)
 *   Ranj.toast.promise(promise, { loading, success, error })  (success/error may be functions of the value/error)
 *   Ranj.toast.update(id, opts) · Ranj.toast.dismiss(id?) · Ranj.toast.config({ position, duration, visible, gap, rich, closeButton, expand })
 * Declarative: <button data-toast="Saved" data-toast-type="success" data-toast-description="…" data-toast-position="top-center">
 * Hover expands the stack and pauses timers; swipe sideways to dismiss; Alt+T focuses the newest toast.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var cfg = { position: 'bottom-right', duration: 4000, visible: 3, gap: 14, rich: false, closeButton: false, expand: false, progress: true, max: 8 };
  var boxes = {}, all = {}, seq = 0;
  var POS = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
  var TYPES = { success: 'success', error: 'error', destructive: 'error', danger: 'error', warning: 'warning', info: 'info', loading: 'loading', default: 'default' };

  function box(pos) {
    if (POS.indexOf(pos) < 0) pos = cfg.position;
    var b = boxes[pos];
    if (b && b.el.isConnected) return b;
    var el = d.createElement('section');
    el.className = 'toaster';
    el.setAttribute('data-position', pos);
    el.setAttribute('aria-label', 'Notifications (Alt+T)');
    el.setAttribute('tabindex', '-1');
    el.innerHTML = '<ol class="toaster-list" aria-live="polite" aria-relevant="additions text"></ol>';
    d.body.appendChild(el);
    b = boxes[pos] = { el: el, list: el.firstChild, items: [], pos: pos, hover: false, focus: false };
    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'touch') return; b.hover = true; sync(b); });
    el.addEventListener('pointerleave', function (e) { if (b.swiping) return; b.hover = false; sync(b); });
    el.addEventListener('focusin', function () { b.focus = true; sync(b); });
    el.addEventListener('focusout', function (e) { if (!el.contains(e.relatedTarget)) { b.focus = false; sync(b); } });
    return b;
  }

  function norm(a, b) {
    var o = typeof a === 'string' ? { title: a } : Object.assign({}, a || {});
    if (b) Object.assign(o, b);
    if (o.variant && !o.type) o.type = o.variant;
    o.type = TYPES[o.type] || 'default';
    if (o.message && !o.title) o.title = o.message;
    return o;
  }
  function txt(o, k) { var v = o[k]; if (v == null || v === '') return ''; return o.html ? String(v) : R.esc(v); }

  function iconFor(o) {
    if (o.icon === false) return '';
    if (o.icon) return '<div class="toast-icon">' + o.icon + '</div>';
    if (o.avatar) return '<img class="toast-avatar" src="' + R.esc(o.avatar) + '" alt="">';
    if (o.type === 'loading') return '<div class="toast-icon" aria-hidden="true"><span class="toast-spinner"></span></div>';
    var m = { success: K.icon.success, error: K.icon.error, warning: K.icon.warning, info: K.icon.infoFill }[o.type];
    return m ? '<div class="toast-icon">' + m + '</div>' : '';
  }
  function paint(t) {
    var o = t.o, el = t.el;
    el.className = 'toast toast-' + o.type + ((o.rich != null ? o.rich : cfg.rich) ? ' toast-rich' : '') + (o.className ? ' ' + o.className : '');
    el.setAttribute('data-type', o.type);
    el.setAttribute('role', o.type === 'error' ? 'alert' : 'status');
    var dur = duration(o);
    el.innerHTML = iconFor(o) +
      '<div class="toast-content">' + (o.title ? '<div class="toast-title">' + txt(o, 'title') + '</div>' : '') +
      (o.description ? '<div class="toast-description">' + txt(o, 'description') + '</div>' : '') + '</div>' +
      ((o.action || o.cancel) ? '<div class="toast-actions">' +
        (o.cancel ? '<button type="button" class="toast-cancel" data-toast-cancel>' + R.esc(o.cancel.label || 'Cancel') + '</button>' : '') +
        (o.action ? '<button type="button" class="toast-action" data-toast-action>' + R.esc(o.action.label || 'Undo') + '</button>' : '') + '</div>' : '') +
      (o.dismissible === false ? '' : '<button type="button" class="toast-close" aria-label="Close notification" data-toast-close>' + K.icon.x + '</button>') +
      ((o.progress != null ? o.progress : cfg.progress) && isFinite(dur) && dur > 0 ? '<div class="toast-progress" aria-hidden="true"><span style="--toast-dur:' + dur + 'ms"></span></div>' : '');
    if (o.closeButton || cfg.closeButton) el.querySelector('.toast-close') && el.querySelector('.toast-close').style.setProperty('opacity', '1');
  }
  function duration(o) { return o.duration != null ? o.duration : o.type === 'loading' ? Infinity : cfg.duration; }
  function measure(t) {
    var el = t.el, prev = el.style.height;
    el.style.height = 'auto';
    var h = el.getBoundingClientRect().height / (t.scale || 1);
    el.style.height = prev;
    t.h = Math.round(el.offsetHeight || h);
  }

  function layout(b) {
    var live = b.items.filter(function (t) { return !t.removed; });
    var expanded = cfg.expand || b.hover || b.focus || b.swiping;
    var gap = cfg.gap, off = 0, frontH = live[0] ? live[0].h : 0;
    b.items.forEach(function (t) {
      var i = live.indexOf(t);
      if (i < 0) return;
      t.el.style.setProperty('--i', i);
      t.el.style.setProperty('--offset', off + 'px');
      t.el.style.setProperty('--h', t.h + 'px');
      if (i === 0) t.el.setAttribute('data-front', ''); else t.el.removeAttribute('data-front');
      if (i >= cfg.visible) t.el.setAttribute('data-hidden', ''); else t.el.removeAttribute('data-hidden');
      off += t.h + gap;
    });
    var vis = Math.min(live.length, cfg.visible);
    var hh = !live.length ? 0 : expanded ? off - gap : frontH + (vis - 1) * 14;
    b.el.style.setProperty('--toaster-h', hh + 'px');
    b.el.style.setProperty('--front-h', frontH + 'px');
    b.el.style.setProperty('--toast-gap', gap + 'px');
    if (expanded && live.length) b.el.setAttribute('data-expanded', ''); else b.el.removeAttribute('data-expanded');
  }
  function sync(b) {
    var paused = b.hover || b.focus || b.swiping || d.hidden;
    if (paused) b.el.setAttribute('data-paused', ''); else b.el.removeAttribute('data-paused');
    b.items.forEach(function (t) { if (paused) pause(t); else resume(t); });
    layout(b);
  }
  function pause(t) { if (t.timer) { clearTimeout(t.timer); t.timer = 0; t.left -= performance.now() - t.start; } }
  function resume(t) {
    if (t.removed || t.timer || !isFinite(t.left)) return;
    t.start = performance.now();
    t.timer = setTimeout(function () { t.timer = 0; dismiss(t.id, 'timeout'); }, Math.max(0, t.left));
  }

  function create(o) {
    var id = o.id != null ? String(o.id) : 'toast-' + (++seq);
    if (all[id] && !all[id].removed) return update(id, o);
    var b = box(o.position || cfg.position);
    var el = d.createElement('li');
    el.setAttribute('data-mounted', 'false');
    el.setAttribute('tabindex', '0');
    el.id = id;
    var t = all[id] = { id: id, o: o, el: el, b: b, h: 0, left: duration(o), timer: 0, start: 0, removed: false };
    paint(t);
    b.list.insertBefore(el, b.list.firstChild);
    b.items.unshift(t);
    measure(t);
    bind(t);
    // overflow: retire the oldest
    var live = b.items.filter(function (x) { return !x.removed; });
    if (live.length > cfg.max) dismiss(live[live.length - 1].id, 'overflow');
    layout(b);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.setAttribute('data-mounted', 'true'); }); });
    if (b.hover || b.focus || d.hidden) b.el.setAttribute('data-paused', ''); else resume(t);
    return id;
  }

  function update(id, patch) {
    var t = all[id]; if (!t || t.removed) return id;
    var p = typeof patch === 'string' ? { title: patch } : Object.assign({}, patch || {});
    if (p.variant && !p.type) p.type = p.variant;
    if (p.type) p.type = TYPES[p.type] || 'default';
    t.o = Object.assign({}, t.o, p);
    paint(t);
    measure(t);
    pause(t);
    t.left = duration(t.o);
    if (!t.b.el.hasAttribute('data-paused')) resume(t);
    layout(t.b);
    return id;
  }

  function dismiss(id, reason) {
    if (id == null) { Object.keys(all).forEach(function (k) { dismiss(k, reason || 'api'); }); return; }
    var t = all[id]; if (!t || t.removed) return;
    t.removed = true;
    clearTimeout(t.timer); t.timer = 0;
    t.el.setAttribute('data-removed', '');
    layout(t.b);
    if (reason === 'timeout' && t.o.onAutoClose) t.o.onAutoClose(id);
    if (t.o.onDismiss) t.o.onDismiss(id, reason);
    R.emit(t.b.el, 'toastdismiss', { id: id, reason: reason });
    setTimeout(function () {
      if (t.el.parentNode) t.el.parentNode.removeChild(t.el);
      var i = t.b.items.indexOf(t); if (i > -1) t.b.items.splice(i, 1);
      if (all[id] === t) delete all[id];
      if (!t.b.items.length) { t.b.hover = false; t.b.focus = false; t.b.swiping = false; }
      layout(t.b);
    }, reason === 'swipe' ? 260 : 400);
  }

  function bind(t) {
    var el = t.el, sw = null;
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-toast-close]')) { dismiss(t.id, 'close'); return; }
      var a = e.target.closest('[data-toast-action]'), c = e.target.closest('[data-toast-cancel]');
      if (a && t.o.action) { var r = t.o.action.onClick && t.o.action.onClick(e, t.id); if (r !== false && !e.defaultPrevented) dismiss(t.id, 'action'); }
      else if (c) { if (t.o.cancel && t.o.cancel.onClick) t.o.cancel.onClick(e, t.id); dismiss(t.id, 'cancel'); }
      else if (t.o.onClick) t.o.onClick(e, t.id);
    });
    el.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Delete' || e.key === 'Backspace') && e.target === el && t.o.dismissible !== false) { e.preventDefault(); e.stopPropagation(); var nx = el.nextElementSibling || el.previousElementSibling; dismiss(t.id, 'keyboard'); if (nx) nx.focus(); }
    });
    el.addEventListener('pointerdown', function (e) {
      if (t.o.dismissible === false || e.button !== 0 || e.target.closest('button,a,input')) return;
      sw = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, on: false };
    });
    el.addEventListener('pointermove', function (e) {
      if (!sw || e.pointerId !== sw.id) return;
      var dx = e.clientX - sw.x;
      if (!sw.on) {
        if (Math.abs(dx) < 4) return;
        if (Math.abs(e.clientY - sw.y) > Math.abs(dx)) { sw = null; return; }
        sw.on = true; t.b.swiping = true; el.setAttribute('data-swiping', '');
        try { el.setPointerCapture(e.pointerId); } catch (x) {}
        sync(t.b);
      }
      sw.dx = dx;
      el.style.setProperty('--sx', dx + 'px');
      el.style.opacity = String(R.clamp(1 - Math.abs(dx) / (el.offsetWidth * 1.1), .25, 1));
    });
    function end(e) {
      if (!sw || (e.pointerId !== sw.id)) { sw = null; return; }
      var s = sw; sw = null;
      if (!s.on) return;
      el.removeAttribute('data-swiping');
      t.b.swiping = false;
      var dx = s.dx || 0, v = Math.abs(dx) / Math.max(1, performance.now() - s.t);
      el.style.opacity = '';
      if (Math.abs(dx) > Math.min(90, el.offsetWidth * .35) || v > .45) {
        el.style.setProperty('--swipe-end', (dx > 0 ? 1 : -1) * (el.offsetWidth + 60) + 'px');
        el.setAttribute('data-swipe-out', '');
        dismiss(t.id, 'swipe');
      } else el.style.setProperty('--sx', '0px');
      var r = t.b.el.getBoundingClientRect();
      t.b.hover = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom && e.pointerType !== 'touch';
      sync(t.b);
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }

  var toast = function (a, b) { return create(norm(a, b)); };
  ['success', 'error', 'warning', 'info', 'loading'].forEach(function (k) {
    toast[k] = function (a, b) { var o = norm(a, b); o.type = k; return create(o); };
  });
  toast.message = function (a, b) { return create(norm(a, b)); };
  toast.custom = function (html, o) { o = Object.assign({ html: true, icon: false }, o || {}); o.title = html; return create(norm(o)); };
  toast.update = function (id, o) { return update(id, o); };
  toast.dismiss = function (id) { dismiss(id, 'api'); };
  toast.config = function (o) { Object.assign(cfg, o || {}); Object.keys(boxes).forEach(function (k) { layout(boxes[k]); }); return Object.assign({}, cfg); };
  toast.promise = function (p, m) {
    m = m || {};
    if (typeof p === 'function') p = p();
    var first = m.loading == null ? 'Loading…' : m.loading;
    var id = create(Object.assign(norm(first, { position: m.position, description: m.description }), { type: 'loading' }));
    function resolveMsg(x, v) { x = typeof x === 'function' ? x(v) : x; return typeof x === 'string' ? { title: x, description: '' } : (x || {}); }
    Promise.resolve(p).then(function (v) {
      var o = resolveMsg(m.success == null ? 'Done' : m.success, v); o.type = 'success'; if (!('description' in o)) o.description = '';
      update(id, o);
    }, function (er) {
      var o = resolveMsg(m.error == null ? 'Something went wrong' : m.error, er); o.type = 'error'; if (!('description' in o)) o.description = '';
      update(id, o);
    });
    return p;
  };
  R.toast = toast;

  R.define('toast', {
    setup: function () {
      R.on(d, 'click', '[data-toast]', function (e, el) {
        var o = { title: el.getAttribute('data-toast'), description: el.getAttribute('data-toast-description') || undefined, type: el.getAttribute('data-toast-type') || undefined };
        if (el.hasAttribute('data-toast-position')) o.position = el.getAttribute('data-toast-position');
        if (el.hasAttribute('data-toast-duration')) o.duration = parseFloat(el.getAttribute('data-toast-duration'));
        toast(o);
      });
      d.addEventListener('keydown', function (e) {
        if (e.altKey && (e.code === 'KeyT')) {
          var b = Object.keys(boxes).map(function (k) { return boxes[k]; }).filter(function (x) { return x.items.some(function (t) { return !t.removed; }); })[0];
          if (b) { e.preventDefault(); var f = b.list.querySelector('.toast:not([data-removed])'); if (f) f.focus(); }
        }
      });
      d.addEventListener('visibilitychange', function () { Object.keys(boxes).forEach(function (k) { sync(boxes[k]); }); });
    }
  });
})(window.Ranj);

;
/* --- components/overlays/tooltip.js --- */
/*!
 * Ranj UI — tooltip. Works on ANY element with no extra markup:
 *   <button data-tooltip="Save" data-tooltip-kbd="⌘ S" data-tooltip-placement="bottom">…</button>
 * Rich:   <span class="tooltip" data-placement="right"><button>…</button><div class="tooltip-content tooltip-rich">…</div></span>
 * Options (attributes on the trigger): data-tooltip-placement, data-tooltip-delay (ms, 400), data-tooltip-kbd,
 *   data-tooltip-variant="primary|rich", data-tooltip-arrow="false". Changing data-tooltip while open updates it live.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var SEL = '[data-tooltip],.tooltip';
  var tip = null, cur = null, fl = null, stop = null, pop = null, mo = null;
  var showTimer = 0, hideTimer = 0, lastClose = 0, suppressed = null;

  function single() {
    if (!tip) {
      tip = d.createElement('div');
      tip.className = 'tooltip-content';
      tip.id = 'ranj-tooltip';
      tip.setAttribute('role', 'tooltip');
    }
    if (!tip.isConnected) d.body.appendChild(tip);
    return tip;
  }
  function richOf(t) { return t.classList.contains('tooltip') ? t.querySelector(':scope > .tooltip-content') : null; }
  function fill(t, el) {
    var txt = t.getAttribute('data-tooltip') || t.getAttribute('aria-label') || '';
    var kbd = t.getAttribute('data-tooltip-kbd');
    el.className = 'tooltip-content' + (t.getAttribute('data-tooltip-variant') ? ' tooltip-' + t.getAttribute('data-tooltip-variant') : '');
    el.innerHTML = R.esc(txt) + (kbd ? '<span class="tooltip-kbd">' + kbd.split(/\s+/).map(function (k) { return '<kbd>' + R.esc(k) + '</kbd>'; }).join('') + '</span>' : '');
    if (t.getAttribute('data-tooltip-arrow') !== 'false') K.arrow(el);
  }
  function placement(t) {
    return t.getAttribute('data-tooltip-placement') || (t.classList.contains('tooltip') && t.getAttribute('data-placement')) ||
      (t.classList.contains('tooltip-bottom') ? 'bottom' : t.classList.contains('tooltip-left') ? 'left' : t.classList.contains('tooltip-right') ? 'right' : 'top');
  }

  function show(t) {
    clearTimeout(showTimer); clearTimeout(hideTimer);
    if (cur === t) return;
    if (cur) hide(true);
    var rich = richOf(t);
    if (!rich && !t.getAttribute('data-tooltip')) return;
    cur = t;
    fl = rich || single();
    if (rich) { if (!fl.getAttribute('role')) fl.setAttribute('role', 'tooltip'); R.ensureId(fl, 'tip'); if (t.getAttribute('data-arrow') !== 'false') K.arrow(fl); }
    else fill(t, fl);
    var anchor = rich ? (t.firstElementChild !== rich ? t.firstElementChild : t) : t;
    var po = { placement: placement(t), offset: parseFloat(t.getAttribute('data-tooltip-offset')) || 7 };
    K.show(fl, function () { K.place(fl, anchor, po); });
    stop = K.autoPlace(fl, anchor, po);
    pop = R.pushLayer(function () { hide(); suppressed = t; });
    var lbl = anchor.getAttribute('aria-label');
    if (!(lbl && lbl === t.getAttribute('data-tooltip'))) {
      var ref = (anchor.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (ref.indexOf(fl.id) < 0) { ref.push(fl.id); anchor.setAttribute('aria-describedby', ref.join(' ')); anchor.__tipRef = fl.id; }
    }
    if (!rich && window.MutationObserver) {
      mo = new MutationObserver(function () { if (cur === t) { fill(t, fl); K.place(fl, anchor, po); } });
      mo.observe(t, { attributes: true, attributeFilter: ['data-tooltip', 'data-tooltip-kbd'] });
    }
    R.emit(t, 'open', { tooltip: fl });
  }
  function hide(instant) {
    clearTimeout(showTimer); clearTimeout(hideTimer);
    if (!cur) return;
    var t = cur, el = fl;
    cur = null; fl = null;
    if (stop) stop(); if (pop) pop(); if (mo) mo.disconnect();
    stop = pop = mo = null;
    var anchor = t.classList.contains('tooltip') && t.firstElementChild ? t.firstElementChild : t;
    if (anchor.__tipRef) {
      var ref = (anchor.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== anchor.__tipRef; });
      if (ref.length) anchor.setAttribute('aria-describedby', ref.join(' ')); else anchor.removeAttribute('aria-describedby');
      anchor.__tipRef = null;
    }
    lastClose = performance.now();
    if (instant) { el.removeAttribute('data-closing'); el.setAttribute('data-state', 'closed'); el.__hideTok = null; }
    else K.hide(el);
    R.emit(t, 'close', {});
  }
  function schedule(t) {
    clearTimeout(hideTimer);
    if (cur === t) return;
    var warm = cur || performance.now() - lastClose < 450;
    var delay = warm ? 0 : parseFloat(t.getAttribute('data-tooltip-delay') || (t.classList.contains('tooltip') && t.getAttribute('data-delay')));
    if (isNaN(delay)) delay = 400;
    clearTimeout(showTimer);
    if (!delay) show(t); else showTimer = setTimeout(function () { if (t.isConnected) show(t); }, delay);
  }

  R.define('tooltip', {
    setup: function () {
      d.addEventListener('pointerover', function (e) {
        if (cur && !cur.isConnected) hide(true);
        if (e.pointerType === 'touch') return;
        var t = e.target.closest && e.target.closest(SEL);
        if (!t) return;
        if (t === suppressed) return;
        if (t.hasAttribute('data-tooltip-disabled')) return;
        // ignore pointer over the rich content itself (non-interactive)
        schedule(t);
      }, true);
      d.addEventListener('pointerout', function (e) {
        var t = e.target.closest && e.target.closest(SEL);
        if (!t) return;
        if (e.relatedTarget && t.contains(e.relatedTarget)) return;
        if (t === suppressed) suppressed = null;
        clearTimeout(showTimer);
        if (cur === t) { clearTimeout(hideTimer); hideTimer = setTimeout(function () { hide(); }, 70); }
      }, true);
      d.addEventListener('focusin', function (e) {
        var t = e.target.closest && e.target.closest(SEL);
        if (!t) return;
        var fv = false; try { fv = e.target.matches(':focus-visible'); } catch (x) {}
        if (fv) show(t);
      });
      d.addEventListener('focusout', function (e) {
        var t = e.target.closest && e.target.closest(SEL);
        if (t && cur === t && !(e.relatedTarget && t.contains(e.relatedTarget))) hide();
      });
      d.addEventListener('pointerdown', function (e) {
        var t = e.target.closest && e.target.closest(SEL);
        if (cur) hide(true);
        clearTimeout(showTimer);
        if (t) suppressed = t;
      }, true);
    }
  });

  R.tooltip = {
    show: function (el) { el = typeof el === 'string' ? d.querySelector(el) : el; if (el) show(el); },
    hide: function () { hide(); }
  };
})(window.Ranj);

;
/* --- components/overlays/tour.js --- */
/*!
 * Ranj UI — product tour. Spotlight cutout that glides between targets + a step popover.
 *   var t = Ranj.tour([{ target: '#new-btn', title: 'Create', body: 'Start here.', placement: 'bottom' }, …], { onEnd(done) {} })
 *   t.next() t.prev() t.go(i) t.end()
 * Declarative: elements with data-tour="name" data-tour-step="1" data-tour-title data-tour-body, and a
 * button with data-tour-start="name". A step without target is shown centered.
 * Keys: → / Enter next, ← back, Esc ends. Events: ranj:tourstep { index }, ranj:tourend { completed } on document.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document, w = window;
  var active = null;

  function resolve(t) { if (!t) return null; if (typeof t === 'string') return d.querySelector(t); return t.nodeType === 1 ? t : null; }

  R.tour = function (steps, o) {
    if (typeof steps === 'string') {
      var name = steps;
      steps = R.$$('[data-tour="' + name + '"]').sort(function (a, b) { return (+a.getAttribute('data-tour-step') || 0) - (+b.getAttribute('data-tour-step') || 0); })
        .map(function (el) { return { target: el, title: el.getAttribute('data-tour-title') || '', body: el.getAttribute('data-tour-body') || '', placement: el.getAttribute('data-tour-placement') || undefined }; });
    }
    o = o || {};
    if (!steps || !steps.length) return null;
    if (active) active.end(false);

    var prevFocus = d.activeElement, i = -1, done = false, raf = 0;
    var spot = d.createElement('div'); spot.className = 'tour-spotlight'; spot.setAttribute('aria-hidden', 'true');
    var block = o.allowInteraction ? null : d.createElement('div');
    if (block) { block.className = 'tour-blocker'; block.setAttribute('aria-hidden', 'true'); }
    var pop = d.createElement('div'); pop.className = 'tour-popover'; pop.setAttribute('role', 'dialog'); pop.setAttribute('tabindex', '-1');
    var tid = R.uid('tour');
    pop.setAttribute('aria-labelledby', tid + '-t'); pop.setAttribute('aria-describedby', tid + '-b');
    if (block) d.body.appendChild(block);
    d.body.appendChild(spot); d.body.appendChild(pop);
    K.arrow(pop);
    var rect = null, el = null;
    var anchor = { getBoundingClientRect: function () { return rect; } };

    function measure(step) {
      var pad = step.padding == null ? (o.padding == null ? 6 : o.padding) : step.padding;
      var r = el.getBoundingClientRect();
      rect = { left: r.left - pad, top: r.top - pad, right: r.right + pad, bottom: r.bottom + pad, width: r.width + pad * 2, height: r.height + pad * 2 };
    }
    function paint(instant) {
      var step = steps[i];
      if (instant) spot.style.transition = 'none';
      if (el) {
        measure(step);
        spot.removeAttribute('data-center'); pop.removeAttribute('data-center');
        spot.style.left = rect.left + 'px'; spot.style.top = rect.top + 'px';
        spot.style.width = rect.width + 'px'; spot.style.height = rect.height + 'px';
        var rad = step.radius != null ? step.radius : getComputedStyle(el).borderTopLeftRadius;
        spot.style.borderRadius = typeof rad === 'number' ? rad + 'px' : 'calc(' + (rad || '0px') + ' + 4px)';
        if (instant) pop.style.transition = 'none';
        K.place(pop, anchor, { placement: step.placement || o.placement || 'bottom', offset: 14 });
      } else {
        spot.setAttribute('data-center', ''); pop.setAttribute('data-center', '');
        var vw = w.innerWidth, vh = d.documentElement.clientHeight;
        spot.style.left = vw / 2 + 'px'; spot.style.top = vh / 2 + 'px'; spot.style.width = '0px'; spot.style.height = '0px';
        pop.style.position = 'fixed';
        pop.style.left = Math.max(8, (vw - pop.offsetWidth) / 2) + 'px';
        pop.style.top = Math.max(8, (vh - pop.offsetHeight) / 2) + 'px';
      }
      if (instant) { void spot.offsetWidth; spot.style.transition = ''; pop.style.transition = ''; }
    }
    function onScroll() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; if (!done && i > -1) paint(true); }); }

    function render() {
      var step = steps[i], n = steps.length, last = i === n - 1;
      var dots = ''; for (var k = 0; k < n; k++) dots += '<i' + (k === i ? ' data-on' : k < i ? ' data-done' : '') + '></i>';
      pop.innerHTML =
        '<div class="tour-step-body">' +
          (step.media ? '<div class="tour-media">' + step.media + '</div>' : '') +
          '<div class="tour-head"><span class="tour-badge">' + (step.badge || ((i + 1) + ' of ' + n)) + '</span>' +
            '<button type="button" class="tour-close" aria-label="End tour" data-tour-act="end">' + K.icon.x + '</button></div>' +
          '<div class="tour-title" id="' + tid + '-t">' + (step.title || '') + '</div>' +
          '<div class="tour-body" id="' + tid + '-b">' + (step.body || '') + '</div>' +
        '</div>' +
        '<div class="tour-foot"><div class="tour-dots" aria-hidden="true">' + dots + '</div>' +
          (i === 0 && o.skip !== false && n > 1 ? '<button type="button" class="tour-skip" data-tour-act="end">' + (o.skipText || 'Skip') + '</button>' : '') +
          (i > 0 ? '<button type="button" class="btn btn-outline btn-sm" data-tour-act="prev">' + (o.backText || 'Back') + '</button>' : '') +
          '<button type="button" class="btn btn-sm" data-tour-act="next">' + (last ? (o.doneText || 'Finish') : (o.nextText || 'Next')) + '</button>' +
        '</div>' +
        '<div class="tour-progress" aria-hidden="true"><span style="transform:scaleX(' + ((i + 1) / n) + ')"></span></div>';
      K.arrow(pop);
    }

    function go(n) {
      if (done || n < 0 || n >= steps.length) return;
      var first = i < 0, dir = n >= i ? 1 : -1;
      i = n;
      var step = steps[i];
      if (el) el.classList.remove('tour-target-active');
      el = resolve(step.target);
      if (el && !el.getClientRects().length) el = null;
      if (step.target && !el && o.skipMissing !== false) { if (first) i = -1; return go(n + dir); }
      render();
      if (!first) { pop.removeAttribute('data-swap'); void pop.offsetWidth; pop.setAttribute('data-swap', ''); }
      var settle = function () {
        if (done) return;
        if (first) { K.show(spot, function () { paint(true); }); K.show(pop, function () { paint(true); }); }
        else paint(false);
        try { (pop.querySelector('[data-tour-act="next"]') || pop).focus({ preventScroll: true }); } catch (x) {}
      };
      if (el) {
        el.classList.add('tour-target-active');
        var r = el.getBoundingClientRect(), vh = d.documentElement.clientHeight;
        if (r.top < 80 || r.bottom > vh - 80) { el.scrollIntoView({ block: 'center', behavior: R.reducedMotion ? 'auto' : 'smooth' }); setTimeout(settle, R.reducedMotion ? 0 : 380); }
        else settle();
      } else settle();
      if (step.onEnter) try { step.onEnter(el, i); } catch (x) {}
      if (o.onStep) o.onStep(i, step);
      R.emit(d, 'tourstep', { index: i, step: step });
    }
    function end(completed) {
      if (done) return;
      done = true;
      active = null;
      popLayer(); w.removeEventListener('scroll', onScroll, true); w.removeEventListener('resize', onScroll);
      d.removeEventListener('keydown', onKey, true);
      if (el) el.classList.remove('tour-target-active');
      K.hide(spot, function () { spot.remove(); });
      K.hide(pop, function () { pop.remove(); });
      if (block) block.remove();
      try { if (prevFocus && prevFocus.focus) prevFocus.focus({ preventScroll: true }); } catch (x) {}
      if (o.onEnd) o.onEnd(!!completed);
      R.emit(d, 'tourend', { completed: !!completed, index: i });
    }
    function next() { if (i >= steps.length - 1) end(true); else go(i + 1); }
    function prev() { go(i - 1); }
    function onKey(e) {
      if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable="true"]')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'Tab') { // keep focus in the step card
        var f = R.focusables(pop); if (!f.length) return;
        var a = d.activeElement, fi = f.indexOf(a);
        if (fi < 0 || (e.shiftKey && fi === 0) || (!e.shiftKey && fi === f.length - 1)) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); }
      }
    }
    pop.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tour-act]'); if (!b) return;
      var a = b.getAttribute('data-tour-act');
      if (a === 'next') next(); else if (a === 'prev') prev(); else end(false);
    });
    var popLayer = R.pushLayer(function () { end(false); });
    w.addEventListener('scroll', onScroll, true); w.addEventListener('resize', onScroll);
    d.addEventListener('keydown', onKey, true);
    active = { next: next, prev: prev, go: go, end: end, get index() { return i; } };
    go(o.startAt || 0);
    return active;
  };
  R.tour.end = function () { if (active) active.end(false); };

  R.define('tour', {
    setup: function () {
      R.on(d, 'click', '[data-tour-start]', function (e, b) { e.preventDefault(); R.tour(b.getAttribute('data-tour-start')); });
    }
  });
})(window.Ranj);

;
/* --- components/motion/interact.js --- */
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
/* --- components/motion/motion.js --- */
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
/* --- components/motion/text.js --- */
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

;
/* --- components/fx/action-buttons.js --- */
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
/* --- components/fx/backgrounds.js --- */
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
/* --- components/fx/icons.js --- */
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
/* --- components/fx/loaders.js --- */
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
/* --- components/fx/social.js --- */
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
/* --- components/fx/toggles.js --- */
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
/* --- components/fx/widgets.js --- */
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
