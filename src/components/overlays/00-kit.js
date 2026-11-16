/*!
 * Ranj UI — overlay kit (private helpers shared by the overlays group)
 * Presence (animate-then-hide), portals, floating placement that survives
 * transformed ancestors, and a full menu engine (roving, typeahead, submenus,
 * checkbox/radio items) used by dropdown-menu, context-menu and menubar.
 * Exposed as Ranj.__ov — internal, may change between versions.
 */
(function (R) {
  'use strict';
  if (R.__ov) return;
  var d = document, w = window;
  var K = R.__ov = {};

  /* ---------- Presence ---------- */
  /** Call cb once every finite animation in el's subtree has finished (max ms fallback). */
  K.afterAnim = function (el, cb, max) {
    var done = false;
    function fin() { if (done) return; done = true; cb(); }
    var list = [];
    try {
      list = (el.getAnimations ? el.getAnimations({ subtree: true }) : []).filter(function (a) {
        var t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
        return t && t.iterations !== Infinity && t.activeDuration !== Infinity && a.playState !== 'finished';
      });
    } catch (e) {}
    if (!list.length) { fin(); return; }
    Promise.all(list.map(function (a) { return a.finished.catch(function () {}); })).then(fin);
    setTimeout(fin, max || 800);
  };
  /** Show: data-state=open. Optional measure() runs while the element is laid out but invisible & un-animated. */
  K.show = function (el, measure) {
    el.__hideTok = null;
    el.removeAttribute('data-closing');
    if (el.hidden) el.hidden = false;
    if (measure) { el.setAttribute('data-measure', ''); try { measure(); } finally { el.removeAttribute('data-measure'); } }
    el.setAttribute('data-state', 'open');
  };
  /** Hide: data-state=closed + data-closing while the exit animation plays, then cb. */
  K.hide = function (el, cb) {
    if (el.getAttribute('data-state') !== 'open' && !el.hasAttribute('data-closing')) { if (cb) cb(); return; }
    el.setAttribute('data-state', 'closed');
    el.setAttribute('data-closing', '');
    var tok = el.__hideTok = {};
    K.afterAnim(el, function () {
      if (el.__hideTok !== tok) return;
      el.__hideTok = null;
      el.removeAttribute('data-closing');
      if (cb) cb();
    });
  };

  /* ---------- Portal (escape transformed / overflow ancestors) ---------- */
  K.portal = function (el) {
    if (el.__ph || el.parentNode === d.body) return;
    var ph = d.createComment('ranj-portal');
    el.parentNode.insertBefore(ph, el);
    el.__ph = ph;
    // keep scoped theme/accent when leaving its subtree
    var scope = ph.parentNode && ph.parentNode.closest ? ph.parentNode.closest('[data-accent],[data-theme]') : null;
    if (scope && scope !== d.documentElement) {
      ['data-accent', 'data-theme', 'data-radius'].forEach(function (a) { if (scope.hasAttribute(a) && !el.hasAttribute(a)) { el.setAttribute(a, scope.getAttribute(a)); (el.__phAttrs = el.__phAttrs || []).push(a); } });
    }
    d.body.appendChild(el);
  };
  K.unportal = function (el) {
    var ph = el.__ph; if (!ph) return;
    el.__ph = null;
    (el.__phAttrs || []).forEach(function (a) { el.removeAttribute(a); }); el.__phAttrs = null;
    if (ph.parentNode) { ph.parentNode.insertBefore(el, ph); ph.parentNode.removeChild(ph); }
    else if (el.parentNode) el.parentNode.removeChild(el);
  };

  /* ---------- Floating placement ---------- */
  /** R.position + correction when a transformed ancestor becomes the containing block of position:fixed. */
  K.place = function (fl, anchor, o) {
    var side = R.position(fl, anchor, o);
    var p = fl.parentNode;
    if (p && p !== d.body && p.nodeType === 1) {
      var pr = d.createElement('i');
      pr.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none';
      p.appendChild(pr);
      var r = pr.getBoundingClientRect();
      p.removeChild(pr);
      if (Math.abs(r.left) > .5 || Math.abs(r.top) > .5) {
        fl.style.left = Math.round(parseFloat(fl.style.left) - r.left) + 'px';
        fl.style.top = Math.round(parseFloat(fl.style.top) - r.top) + 'px';
      }
    }
    return side;
  };
  K.autoPlace = function (fl, anchor, o) {
    var raf = 0;
    function upd() { raf = 0; if (anchor.nodeType === 1 && !anchor.isConnected) return; K.place(fl, anchor, o); }
    function sch() { if (!raf) raf = requestAnimationFrame(upd); }
    w.addEventListener('scroll', sch, true);
    w.addEventListener('resize', sch);
    var ro = w.ResizeObserver ? new ResizeObserver(sch) : null;
    if (ro) { ro.observe(fl); if (anchor.nodeType === 1) ro.observe(anchor); }
    return function () { cancelAnimationFrame(raf); w.removeEventListener('scroll', sch, true); w.removeEventListener('resize', sch); if (ro) ro.disconnect(); };
  };

  /**
   * Open a floating element anchored to anchor. Returns handle { close(reason), el, open }.
   * o: placement, offset, shift, outside (true), layer (true), ignore [els], onClose(reason, e), onHidden()
   */
  K.float = function (fl, anchor, o) {
    o = o || {};
    var h = { el: fl, open: true };
    var po = { placement: o.placement || 'bottom', offset: o.offset == null ? 8 : o.offset, shift: o.shift, flip: o.flip };
    K.show(fl, function () { K.place(fl, anchor, po); });
    var stop = K.autoPlace(fl, anchor, po);
    var pop = o.layer === false ? null : R.pushLayer(function () { h.close('escape'); });
    var off = o.outside === false ? null : R.onOutside([fl].concat(o.ignore || []), function (e) { h.close('outside', e); });
    h.reposition = function () { K.place(fl, anchor, po); };
    h.close = function (reason, e) {
      if (!h.open) return;
      h.open = false;
      stop(); if (pop) pop(); if (off) off();
      if (o.onClose) o.onClose(reason, e);
      K.hide(fl, o.onHidden);
    };
    return h;
  };

  /** Add an arrow element to a floating panel once. */
  K.arrow = function (fl, cls) {
    if (!fl.querySelector(':scope > .ov-arrow')) {
      var a = d.createElement('span'); a.className = 'ov-arrow' + (cls ? ' ' + cls : ''); a.setAttribute('aria-hidden', 'true');
      fl.appendChild(a);
    }
  };

  /* ---------- Menu engine ---------- */
  var MENU = '.dropdown-menu,.context-menu,.menubar-content,[role="menu"]';
  var ITEM = '.dropdown-item,.context-menu-item,.menu-item,[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]';
  var SUBWRAP = '.dropdown-sub,.context-menu-sub,.menu-sub';
  K.MENU = MENU; K.ITEM = ITEM;

  function ownItems(menu, all) {
    return R.$$(ITEM, menu).filter(function (i) {
      return i.closest(MENU) === menu && (all || (!i.hasAttribute('disabled') && i.getAttribute('aria-disabled') !== 'true' && i.getClientRects().length));
    });
  }
  function subOf(item) {
    var p = item.parentElement;
    if (p && p.matches(SUBWRAP)) { var m = p.querySelector(':scope > ' + MENU.split(',').join(', :scope > ')); if (m && m !== item.closest(MENU)) return m; }
    var nx = item.nextElementSibling;
    if (nx && nx.matches(MENU)) return nx;
    return null;
  }
  function label(item) { return (item.getAttribute('data-text') || item.textContent || '').trim().toLowerCase(); }

  K.prepMenu = function (menu) {
    if (menu.__prepped) return;
    menu.__prepped = true;
    R.ensureId(menu, 'menu');
    if (!menu.getAttribute('role')) menu.setAttribute('role', 'menu');
    menu.setAttribute('tabindex', '-1');
    menu.setAttribute('aria-orientation', 'vertical');
    R.$$('.dropdown-separator,.context-menu-separator,.menu-separator', menu).forEach(function (s) { s.setAttribute('role', 'separator'); });
    R.$$('.dropdown-radio-group,.menu-radio-group,[data-radio-group]', menu).forEach(function (g) { g.setAttribute('role', 'group'); });
    R.$$(ITEM, menu).forEach(function (i) {
      if (!i.getAttribute('role')) {
        if (i.closest('.dropdown-radio-group,.menu-radio-group,[data-radio-group]')) i.setAttribute('role', 'menuitemradio');
        else if (i.hasAttribute('data-checkbox') || i.hasAttribute('aria-checked')) i.setAttribute('role', 'menuitemcheckbox');
        else i.setAttribute('role', 'menuitem');
      }
      var r = i.getAttribute('role');
      if ((r === 'menuitemcheckbox' || r === 'menuitemradio') && !i.hasAttribute('aria-checked')) i.setAttribute('aria-checked', 'false');
      i.setAttribute('tabindex', '-1');
      if (i.hasAttribute('disabled') || i.hasAttribute('data-disabled')) i.setAttribute('aria-disabled', 'true');
      if (i.tagName === 'BUTTON' && !i.getAttribute('type')) i.setAttribute('type', 'button');
      var sm = subOf(i);
      if (sm) { i.setAttribute('aria-haspopup', 'menu'); i.setAttribute('aria-expanded', 'false'); i.setAttribute('data-sub-trigger', ''); i.setAttribute('aria-controls', R.ensureId(sm, 'menu')); }
    });
  };

  /**
   * K.menu(menuEl, anchorElOr{x,y}, o) → handle
   * o: placement, offset, focus ('first'|'last'|'menu'), parent, trigger, ignore, onClose(reason), onArrow(dir) → true if handled
   */
  K.menu = function (menu, anchor, o) {
    o = o || {};
    K.prepMenu(menu);
    var h = { menu: menu, parent: o.parent || null, sub: null, open: true, trigger: o.trigger || null };
    var po = { placement: o.placement || 'bottom-start', offset: o.offset == null ? 6 : o.offset };
    K.show(menu, function () { K.place(menu, anchor, po); });
    var stop = K.autoPlace(menu, anchor, po);
    var pop = R.pushLayer(function () { h.close('escape'); });
    var off = h.parent ? null : R.onOutside([menu].concat(o.ignore || []), function (e) { h.closeAll('outside', e); });
    var subTimer = 0, ta = '', taTimer = 0;

    function focusItem(it) { if (it) try { it.focus({ preventScroll: false }); } catch (e) {} }
    function cur() { var a = d.activeElement; return a && a.closest && a.closest(MENU) === menu ? a.closest(ITEM) : null; }

    function openSub(item, focus) {
      clearTimeout(subTimer);
      if (h.sub && h.sub.trigger === item) { if (focus) { var f = ownItems(h.sub.menu)[0]; focusItem(f); } return; }
      closeSub();
      var sm = subOf(item); if (!sm) return;
      item.setAttribute('aria-expanded', 'true'); item.setAttribute('data-state', 'open');
      h.sub = K.menu(sm, item, { placement: 'right-start', offset: 4, parent: h, trigger: item, focus: focus ? 'first' : 'none', onArrow: o.onArrow });
    }
    function closeSub() { clearTimeout(subTimer); if (h.sub) h.sub.close('sub'); }

    function activate(item, e) {
      if (!item || item.getAttribute('aria-disabled') === 'true') return;
      if (item.hasAttribute('data-sub-trigger')) { openSub(item, true); return; }
      var role = item.getAttribute('role'), checked;
      if (role === 'menuitemcheckbox') { checked = item.getAttribute('aria-checked') !== 'true'; item.setAttribute('aria-checked', String(checked)); }
      else if (role === 'menuitemradio') {
        var g = item.closest('[role="group"]') || menu;
        R.$$('[role="menuitemradio"]', g).forEach(function (r) { r.setAttribute('aria-checked', r === item ? 'true' : 'false'); });
        checked = true;
      }
      var ok = R.emit(item, 'select', { item: item, value: item.getAttribute('data-value') || item.textContent.trim(), checked: checked });
      var keep = item.hasAttribute('data-keep-open') || ((role === 'menuitemcheckbox' || role === 'menuitemradio') && !item.hasAttribute('data-close'));
      if (ok && !keep) {
        h.closeAll('select');
        // anchors navigate naturally; buttons fire their own click handlers
        if (e && e.type === 'keydown' && item.tagName === 'A') item.click();
      }
    }

    function onKey(e) {
      if (e.target !== menu && (!e.target.closest || e.target.closest(MENU) !== menu)) return;
      var list = ownItems(menu), c = cur(), i = list.indexOf(c), k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowUp') {
        e.preventDefault();
        if (!list.length) return;
        var n = k === 'ArrowDown' ? (i < 0 ? 0 : (i + 1) % list.length) : (i <= 0 ? list.length - 1 : i - 1);
        focusItem(list[n]);
      } else if (k === 'Home' || k === 'PageUp') { e.preventDefault(); focusItem(list[0]); }
      else if (k === 'End' || k === 'PageDown') { e.preventDefault(); focusItem(list[list.length - 1]); }
      else if (k === 'ArrowRight') {
        e.preventDefault();
        if (c && c.hasAttribute('data-sub-trigger')) openSub(c, true);
        else if (o.onArrow) o.onArrow('right', h);
      } else if (k === 'ArrowLeft') {
        e.preventDefault();
        if (h.parent) { var t = h.trigger; h.close('left'); focusItem(t); }
        else if (o.onArrow) o.onArrow('left', h);
      } else if (k === 'Enter' || k === ' ') {
        if (c) { e.preventDefault(); activate(c, e); }
      } else if (k === 'Tab') {
        e.preventDefault(); h.closeAll('tab');
      } else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        clearTimeout(taTimer); ta += k.toLowerCase(); taTimer = setTimeout(function () { ta = ''; }, 600);
        var start = i < 0 ? 0 : (ta.length === 1 ? i + 1 : i), m = null;
        for (var j = 0; j < list.length; j++) { var it = list[(start + j) % list.length]; if (label(it).indexOf(ta) === 0) { m = it; break; } }
        if (m) { e.preventDefault(); focusItem(m); }
      }
    }
    function onMove(e) {
      if (e.pointerType === 'touch' || !e.target.closest) return;
      if (e.target.closest(MENU) !== menu) { clearTimeout(subTimer); return; } // pointer reached a submenu
      var it = e.target.closest(ITEM);
      if (!it) return;
      if (it.getAttribute('aria-disabled') === 'true') { if (d.activeElement !== menu && cur()) menu.focus({ preventScroll: true }); return; }
      if (d.activeElement !== it) try { it.focus({ preventScroll: true }); } catch (x) {}
      clearTimeout(subTimer);
      if (it.hasAttribute('data-sub-trigger')) subTimer = setTimeout(function () { openSub(it, false); }, 90);
      else if (h.sub) subTimer = setTimeout(closeSub, 260);
    }
    function onLeave(e) {
      if (e.pointerType === 'touch') return;
      if (!h.sub && cur() && !(e.relatedTarget && menu.contains(e.relatedTarget))) try { menu.focus({ preventScroll: true }); } catch (x) {}
    }
    function onClick(e) {
      var it = e.target.closest && e.target.closest(ITEM);
      if (!it || it.closest(MENU) !== menu) return;
      if (it.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      activate(it, e);
    }
    menu.addEventListener('keydown', onKey);
    menu.addEventListener('pointermove', onMove);
    menu.addEventListener('pointerleave', onLeave);
    menu.addEventListener('click', onClick);

    h.close = function (reason) {
      if (!h.open) return;
      h.open = false;
      closeSub();
      clearTimeout(taTimer);
      stop(); pop(); if (off) off();
      menu.removeEventListener('keydown', onKey);
      menu.removeEventListener('pointermove', onMove);
      menu.removeEventListener('pointerleave', onLeave);
      menu.removeEventListener('click', onClick);
      if (h.parent) { h.parent.sub = null; if (h.trigger) { h.trigger.setAttribute('aria-expanded', 'false'); h.trigger.removeAttribute('data-state'); } }
      K.hide(menu);
      if (o.onClose) o.onClose(reason);
    };
    h.closeAll = function (reason, e) { var r = h; while (r.parent) r = r.parent; r.close(reason, e); };
    h.focusFirst = function () { focusItem(ownItems(menu)[0]); };

    var f = o.focus || 'menu';
    if (f === 'first') focusItem(ownItems(menu)[0]);
    else if (f === 'last') { var l = ownItems(menu); focusItem(l[l.length - 1]); }
    else if (f !== 'none') try { menu.focus({ preventScroll: true }); } catch (x) {}
    return h;
  };

  /* ---------- Tiny shared utils ---------- */
  K.icon = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.7 7.7a1 1 0 0 0-1.4-1.4L10.5 13l-1.8-1.8a1 1 0 1 0-1.4 1.4l2.5 2.5a1 1 0 0 0 1.4 0l5.5-5.4Z" clip-rule="evenodd"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5a1 1 0 0 1 1 1v4.5a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm0 8.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" clip-rule="evenodd"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10.3 3.3a2 2 0 0 1 3.4 0l8 13.8A2 2 0 0 1 20 20H4a2 2 0 0 1-1.7-2.9l8-13.8ZM12 8a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Zm0 7.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" clip-rule="evenodd"/></svg>',
    infoFill: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5.3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 11a1 1 0 0 0-1 1v4.5a1 1 0 1 0 2 0V12a1 1 0 0 0-1-1Z" clip-rule="evenodd"/></svg>'
  };
})(window.Ranj);
