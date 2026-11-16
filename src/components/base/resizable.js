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
