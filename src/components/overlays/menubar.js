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
