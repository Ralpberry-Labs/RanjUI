/*!
 * Ranj UI — modal overlay engine: dialog, alert-dialog, sheet, drawer, command palette.
 * Markup:  <div class="dialog-overlay" id="x"><div class="dialog">…</div></div>
 * Open:    data-dialog-open="x" (also data-sheet-open / data-drawer-open) · Ranj.dialog.open('x')
 * Close:   data-dialog-close inside · backdrop click · Escape · Ranj.dialog.close('x')
 * Events:  ranj:open, ranj:close on the overlay (ranj:beforeclose is cancelable)
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var OVERLAY = '.dialog-overlay,.command-overlay';
  var CONTENT = '.dialog,.sheet,.drawer,.command-dialog,.alert-dialog,.action-dialog';
  var stack = [];

  function resolve(x) {
    var el = typeof x === 'string' ? d.getElementById(x.replace(/^#/, '')) : x;
    if (!el) return null;
    if (el.matches(OVERLAY)) return el;
    var ov = el.closest(OVERLAY);
    if (ov) return ov;
    // v1: <div class="dialog-overlay"></div><div class="sheet"> — content as next sibling
    var prev = el.previousElementSibling;
    if (prev && prev.matches(OVERLAY) && el.matches('.sheet,.drawer')) return prev;
    return null;
  }
  function contentOf(ov) {
    var c = null;
    for (var i = 0; i < ov.children.length; i++) if (ov.children[i].matches(CONTENT)) { c = ov.children[i]; break; }
    if (c) return { el: c, sibling: false };
    var nx = ov.nextElementSibling;
    if (nx && nx.matches('.sheet,.drawer')) return { el: nx, sibling: true };
    return { el: ov.firstElementChild || ov, sibling: false };
  }
  function isStatic(ov, c) {
    return ov.hasAttribute('data-static') || ov.getAttribute('data-backdrop') === 'static' || c.classList.contains('alert-dialog') || c.getAttribute('role') === 'alertdialog';
  }
  function bump(c) {
    if (R.reducedMotion) return;
    c.removeAttribute('data-bump'); void c.offsetWidth; c.setAttribute('data-bump', '');
    setTimeout(function () { c.removeAttribute('data-bump'); }, 340);
  }

  function open(x, o) {
    o = o || {};
    var ov = resolve(x);
    if (!ov) return false;
    if (ov.__dlg) return true;
    var info = contentOf(ov), c = info.el;
    if (!R.emit(ov, 'beforeopen', {})) return false;
    var st = ov.__dlg = { c: c, sibling: info.sibling, trigger: o.trigger || d.activeElement };

    // ARIA
    if (c !== ov) {
      if (!c.getAttribute('role')) c.setAttribute('role', c.classList.contains('alert-dialog') ? 'alertdialog' : 'dialog');
      c.setAttribute('aria-modal', 'true');
      var t = c.querySelector('.dialog-title,.sheet-title,.drawer-title,.alert-dialog-title,[data-dialog-title]');
      var ds = c.querySelector('.dialog-description,.sheet-description,.drawer-description,.alert-dialog-description,[data-dialog-description]');
      if (t && !c.hasAttribute('aria-labelledby')) c.setAttribute('aria-labelledby', R.ensureId(t, 'dlg-t'));
      if (ds && !c.hasAttribute('aria-describedby')) c.setAttribute('aria-describedby', R.ensureId(ds, 'dlg-d'));
      if (!c.hasAttribute('tabindex')) c.setAttribute('tabindex', '-1');
    }
    R.$$('[data-dialog-open="' + ov.id + '"],[data-sheet-open="' + ov.id + '"],[data-drawer-open="' + ov.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });

    // Stacking
    var below = stack[stack.length - 1];
    if (below) { below.__dlg.c.setAttribute('data-nested', ''); ov.setAttribute('data-stacked', ''); }
    stack.push(ov);

    K.portal(ov);
    if (st.sibling) K.portal(c);
    K.show(ov);
    if (c !== ov) K.show(c);
    if (c.__onOpen) c.__onOpen(o);
    R.scrollLock.lock();

    var initial = o.focus || c.querySelector('[autofocus],[data-autofocus]') ||
      (c.matches('.command-dialog') ? c.querySelector('.command-input') : null) ||
      R.focusables(c).filter(function (f) { return !f.matches('.dialog-close,[data-dialog-close]:not(.btn)'); })[0] || c;
    st.release = R.trapFocus(c, initial);
    st.pop = R.pushLayer(function () { if (ov.hasAttribute('data-static') && !ov.hasAttribute('data-escape')) bump(c); else close(ov, { reason: 'escape' }); });
    R.emit(ov, 'open', { trigger: st.trigger });
    return true;
  }

  function close(x, o) {
    o = o || {};
    var ov = resolve(x), st = ov && ov.__dlg;
    if (!st) return false;
    if (!o.force && !R.emit(ov, 'beforeclose', { reason: o.reason || 'api' })) return false;
    ov.__dlg = null;
    st.pop();
    st.release();
    R.scrollLock.unlock();
    var i = stack.indexOf(ov); if (i > -1) stack.splice(i, 1);
    var top = stack[stack.length - 1];
    if (top && i === stack.length) top.__dlg.c.removeAttribute('data-nested');
    R.$$('[data-dialog-open="' + ov.id + '"],[data-sheet-open="' + ov.id + '"],[data-drawer-open="' + ov.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    var c = st.c;
    if (c.__onClose) c.__onClose(o);
    var pending = c !== ov ? 2 : 1;
    function done() {
      if (--pending) return;
      ov.removeAttribute('data-stacked');
      K.unportal(ov);
      if (st.sibling) K.unportal(c);
      R.emit(ov.isConnected ? ov : d, 'closed', { reason: o.reason || 'api' });
      if (o.onHidden) o.onHidden();
    }
    if (c !== ov) K.hide(c, done);
    K.hide(ov, done);
    R.emit(ov, 'close', { reason: o.reason || 'api', value: o.value });
    return true;
  }

  function toggle(x, o) { var ov = resolve(x); if (!ov) return; return ov.__dlg ? close(ov, o) : open(ov, o); }
  function isOpen(x) { var ov = resolve(x); return !!(ov && ov.__dlg); }

  R.define('dialog', {
    setup: function () {
      R.on(d, 'click', '[data-dialog-open],[data-sheet-open],[data-drawer-open]', function (e, el) {
        e.preventDefault();
        open(el.getAttribute('data-dialog-open') || el.getAttribute('data-sheet-open') || el.getAttribute('data-drawer-open'), { trigger: el });
      });
      R.on(d, 'click', '[data-dialog-close],[data-sheet-close],[data-drawer-close]', function (e, el) {
        var target = el.getAttribute('data-dialog-close') || el.getAttribute('data-sheet-close') || el.getAttribute('data-drawer-close');
        var ov = target ? resolve(target) : resolve(el);
        if (!ov) { var c = el.closest(CONTENT); ov = c && resolve(c); }
        if (ov) { e.preventDefault(); close(ov, { reason: 'button', value: el.getAttribute('data-value') }); }
      });
      // Backdrop click: only when the press both started and ended on the overlay itself
      var downOn = null;
      d.addEventListener('pointerdown', function (e) { downOn = e.target; }, true);
      R.on(d, 'click', OVERLAY, function (e, ov) {
        if (e.target !== ov || downOn !== ov || !ov.__dlg) return;
        if (isStatic(ov, ov.__dlg.c)) bump(ov.__dlg.c); else close(ov, { reason: 'backdrop' });
      });
    }
  });

  R.dialog = { open: open, close: close, toggle: toggle, isOpen: isOpen, stack: function () { return stack.slice(); } };
  R.sheet = R.dialog; R.drawer = R.drawer || {};
  R.drawer.open = open; R.drawer.close = close; R.drawer.toggle = toggle;
})(window.Ranj);
