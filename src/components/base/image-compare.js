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
