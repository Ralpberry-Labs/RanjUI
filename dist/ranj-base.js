/*! Ranj UI v2.0.0 | MIT | https://ralpberry-labs.github.io/RanjUI/ */
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
