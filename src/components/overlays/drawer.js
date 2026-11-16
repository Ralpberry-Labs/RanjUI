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
