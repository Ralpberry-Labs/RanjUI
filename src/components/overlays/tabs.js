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
