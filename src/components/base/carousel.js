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
