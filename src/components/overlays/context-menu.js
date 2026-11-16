/*!
 * Ranj UI — context menu. Right-click (or long-press on touch, or Shift+F10 / Menu key) inside
 * [data-context-menu="menuId"] opens .context-menu#menuId at the pointer. Empty value → first
 * .context-menu inside the area. Shares the menu engine with dropdown-menu (submenus, checkbox/radio, typeahead).
 * Events: ranj:open { x, y, target } / ranj:close on the menu, ranj:select from items.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var current = null;

  function menuFor(area) {
    var id = area.getAttribute('data-context-menu');
    return id ? d.getElementById(id) : area.querySelector('.context-menu');
  }
  function open(area, x, y, target, kb) {
    var menu = menuFor(area);
    if (!menu) return;
    if (current) current.close('reopen');
    menu.__ctxTarget = target || area;
    area.setAttribute('data-state', 'open');
    var h = current = K.menu(menu, { x: x, y: y }, {
      placement: 'right-start', offset: 2, focus: kb ? 'first' : 'menu',
      onClose: function (reason) {
        if (current === h) current = null;
        area.removeAttribute('data-state');
        if (reason === 'escape' || reason === 'select' || reason === 'tab') { if (area.hasAttribute('tabindex') || R.focusables(area.parentNode || d.body).indexOf(area) > -1) try { area.focus({ preventScroll: true }); } catch (e) {} }
        R.emit(menu, 'close', { reason: reason });
      }
    });
    R.emit(menu, 'open', { x: x, y: y, target: menu.__ctxTarget });
  }

  R.define('context-menu', {
    selector: '[data-context-menu]',
    setup: function () {
      R.on(d, 'contextmenu', '[data-context-menu]', function (e, area) {
        if (e.shiftKey && e.altKey) return; // escape hatch for native menu
        e.preventDefault();
        if (e.target.closest('.context-menu')) return;
        if (e.button === -1 || (e.clientX === 0 && e.clientY === 0)) { var r = area.getBoundingClientRect(); open(area, r.left + 12, r.top + 12, e.target, true); return; }
        open(area, e.clientX, e.clientY, e.target, false);
      });
      // touch long-press
      var lp = null;
      R.on(d, 'pointerdown', '[data-context-menu]', function (e, area) {
        if (e.pointerType !== 'touch') return;
        var x = e.clientX, y = e.clientY, tgt = e.target;
        lp = { x: x, y: y, t: setTimeout(function () { lp = null; open(area, x, y, tgt, false); if (navigator.vibrate) try { navigator.vibrate(8); } catch (er) {} }, 520) };
      });
      function cancel(e) { if (lp && (e.type !== 'pointermove' || Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 8)) { clearTimeout(lp.t); lp = null; } }
      d.addEventListener('pointermove', cancel, { passive: true });
      d.addEventListener('pointerup', cancel);
      d.addEventListener('pointercancel', cancel);
      R.on(d, 'keydown', '[data-context-menu]', function (e, area) {
        if ((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu') {
          e.preventDefault();
          var r = (d.activeElement && area.contains(d.activeElement) ? d.activeElement : area).getBoundingClientRect();
          open(area, r.left + Math.min(24, r.width / 2), r.top + Math.min(24, r.height / 2), d.activeElement, true);
        }
      });
    },
    mount: function (area) {
      var menu = menuFor(area);
      if (menu) { K.prepMenu(menu); area.setAttribute('aria-haspopup', 'menu'); }
    }
  });

  R.contextMenu = {
    open: function (area, x, y) { area = typeof area === 'string' ? d.querySelector(area) : area; if (area) open(area, x, y, area, false); },
    close: function () { if (current) current.close('api'); }
  };
})(window.Ranj);
