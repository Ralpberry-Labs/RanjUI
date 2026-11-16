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
