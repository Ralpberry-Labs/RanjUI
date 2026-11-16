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
