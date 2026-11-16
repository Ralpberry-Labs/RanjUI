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
