/*!
 * Ranj UI — dropdown menu (v1 compatible: .dropdown > [data-dropdown-trigger] + .dropdown-menu).
 * Keyboard: Enter/Space/↓ open + focus first, ↑ opens on last, ↑↓ Home End move, → ← submenus,
 * type to jump, Esc closes (focus returns to trigger). Items: .dropdown-item, data-checkbox / aria-checked,
 * .dropdown-radio-group, .dropdown-sub (> item + .dropdown-menu), .dropdown-item-destructive, data-keep-open.
 * Placement: data-placement="bottom-start" on .dropdown (.dropdown-right → bottom-end).
 * Events: ranj:open, ranj:close on .dropdown; ranj:select { item, value, checked } bubbles from the item.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;

  function parts(trigger) {
    var dd = trigger.closest('.dropdown');
    var id = trigger.getAttribute('data-dropdown-trigger');
    var menu = id ? d.getElementById(id) : null;
    if (!menu && dd) for (var i = 0; i < dd.children.length; i++) if (dd.children[i].classList.contains('dropdown-menu')) { menu = dd.children[i]; break; }
    if (!menu && dd) menu = dd.querySelector('.dropdown-menu');
    return { dd: dd || trigger, menu: menu };
  }

  function open(trigger, focus) {
    var p = parts(trigger);
    if (!p.menu) return;
    if (trigger.__menu) return;
    var dd = p.dd;
    var placement = dd.getAttribute('data-placement') || trigger.getAttribute('data-placement') || (dd.classList && dd.classList.contains('dropdown-right') ? 'bottom-end' : dd.classList && dd.classList.contains('dropdown-top') ? 'top-start' : 'bottom-start');
    trigger.setAttribute('aria-expanded', 'true');
    if (dd !== trigger) dd.setAttribute('data-state', 'open');
    trigger.setAttribute('data-state', 'open');
    trigger.__menu = K.menu(p.menu, trigger, {
      placement: placement, offset: parseFloat(dd.getAttribute('data-offset')) || 6,
      focus: focus || 'menu', trigger: trigger, ignore: [trigger],
      onClose: function (reason) {
        trigger.__menu = null;
        trigger.setAttribute('aria-expanded', 'false');
        trigger.removeAttribute('data-state');
        if (dd !== trigger) dd.setAttribute('data-state', 'closed');
        var ae = d.activeElement;
        if (reason !== 'outside' || !ae || ae === d.body || p.menu.contains(ae)) try { trigger.focus({ preventScroll: true }); } catch (x) {}
        R.emit(dd, 'close', { reason: reason });
      }
    });
    R.emit(dd, 'open', {});
  }
  function close(trigger) { if (trigger && trigger.__menu) trigger.__menu.close('api'); }

  R.define('dropdown-menu', {
    selector: '[data-dropdown-trigger]',
    setup: function () {
      R.on(d, 'click', '[data-dropdown-trigger]', function (e, t) {
        e.preventDefault();
        if (e.detail === 0 && performance.now() - (t.__kb || 0) < 400) return;
        if (t.__menu) t.__menu.close('trigger'); else open(t, e.detail === 0 ? 'first' : 'menu');
      });
      R.on(d, 'keydown', '[data-dropdown-trigger]', function (e, t) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.__kb = performance.now(); if (!t.__menu) open(t, 'first'); else t.__menu.focusFirst(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); t.__kb = performance.now(); if (!t.__menu) open(t, 'last'); }
      });
    },
    mount: function (t) {
      var p = parts(t);
      t.setAttribute('aria-haspopup', 'menu');
      t.setAttribute('aria-expanded', 'false');
      if (p.menu) { t.setAttribute('aria-controls', R.ensureId(p.menu, 'menu')); K.prepMenu(p.menu); p.menu.setAttribute('aria-labelledby', R.ensureId(t, 'menu-t')); }
      return function () { if (t.__menu) t.__menu.close('destroy'); };
    }
  });

  R.dropdown = {
    open: function (x, focus) { var t = typeof x === 'string' ? d.querySelector(x) : x; if (t && !t.hasAttribute('data-dropdown-trigger')) t = t.querySelector('[data-dropdown-trigger]'); if (t) open(t, focus); },
    close: function (x) { var t = typeof x === 'string' ? d.querySelector(x) : x; if (t && !t.hasAttribute('data-dropdown-trigger')) t = t.querySelector('[data-dropdown-trigger]'); close(t); }
  };
})(window.Ranj);
