/*! Ranj UI v2.0.0 | MIT | https://alps-is-core.github.io/RanjUI/ */
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

;
/*!
 * Ranj UI — accordion + collapsible.
 * Accordion: .accordion > .accordion-item[data-state] > .accordion-trigger + .accordion-content > .accordion-body
 *   Single by default (opening one closes others); data-multiple (v1) or data-type="multiple" for many.
 *   data-collapsible="false" keeps one item always open. ↑ ↓ Home End move between triggers.
 * Collapsible: .collapsible[data-state] > .collapsible-trigger + .collapsible-content
 * Events: ranj:change { item, open } on the accordion / collapsible. API: Ranj.accordion.toggle(item, open?), Ranj.collapsible.toggle(el, open?)
 */
(function (R) {
  'use strict';
  var d = document;

  function wrapInner(content, cls) {
    var kids = Array.prototype.filter.call(content.childNodes, function (n) { return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()); });
    if (kids.length === 1 && kids[0].nodeType === 1) return kids[0];
    var w = d.createElement('div'); w.className = cls;
    while (content.firstChild) w.appendChild(content.firstChild);
    content.appendChild(w);
    return w;
  }
  function setOpen(item, trigger, content, open) {
    item.setAttribute('data-state', open ? 'open' : 'closed');
    trigger.setAttribute('aria-expanded', String(open));
    if (content) { content.inert = !open; if (!open) content.setAttribute('aria-hidden', 'true'); else content.removeAttribute('aria-hidden'); }
  }

  R.define('accordion', {
    selector: '.accordion',
    mount: function (acc) {
      var multiple = acc.hasAttribute('data-multiple') || acc.getAttribute('data-type') === 'multiple';
      var collapsible = acc.getAttribute('data-collapsible') !== 'false';
      function items() { return R.$$('.accordion-item', acc).filter(function (i) { return i.closest('.accordion') === acc; }); }
      function parts(item) {
        return { t: item.querySelector(':scope > .accordion-trigger') || item.querySelector('.accordion-trigger'), c: item.querySelector(':scope > .accordion-content') };
      }
      items().forEach(function (item) {
        var p = parts(item); if (!p.t) return;
        if (p.t.tagName === 'BUTTON' && !p.t.getAttribute('type')) p.t.setAttribute('type', 'button');
        if (p.c) {
          wrapInner(p.c, 'accordion-body');
          p.c.setAttribute('role', 'region');
          p.t.setAttribute('aria-controls', R.ensureId(p.c, 'acc'));
          p.c.setAttribute('aria-labelledby', R.ensureId(p.t, 'acc-t'));
        }
        setOpen(item, p.t, p.c, item.getAttribute('data-state') === 'open' || item.hasAttribute('open'));
      });
      function toggle(item, force) {
        var p = parts(item); if (!p.t) return;
        var open = force != null ? !!force : item.getAttribute('data-state') !== 'open';
        if (!open && !collapsible && !multiple) return;
        if (open && !multiple) items().forEach(function (o) { if (o !== item && o.getAttribute('data-state') === 'open') { var q = parts(o); setOpen(o, q.t, q.c, false); R.emit(acc, 'change', { item: o, open: false }); } });
        setOpen(item, p.t, p.c, open);
        R.emit(acc, 'change', { item: item, open: open, value: item.getAttribute('data-value') });
      }
      var offs = [
        R.on(acc, 'click', '.accordion-trigger', function (e, t) { var item = t.closest('.accordion-item'); if (item && item.closest('.accordion') === acc) toggle(item); }),
        R.on(acc, 'keydown', '.accordion-trigger', function (e, t) {
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].indexOf(e.key) < 0) return;
          var ts = items().map(function (i) { return parts(i).t; }).filter(function (x) { return x && !x.disabled; });
          var i = ts.indexOf(t); if (i < 0) return;
          e.preventDefault();
          var n = e.key === 'ArrowDown' ? (i + 1) % ts.length : e.key === 'ArrowUp' ? (i - 1 + ts.length) % ts.length : e.key === 'Home' ? 0 : ts.length - 1;
          ts[n].focus();
        })
      ];
      acc.__acc = { toggle: toggle };
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  R.define('collapsible', {
    selector: '.collapsible',
    mount: function (el) {
      var t = R.$$('.collapsible-trigger', el).filter(function (x) { return x.closest('.collapsible') === el; })[0];
      var c = R.$$('.collapsible-content', el).filter(function (x) { return x.closest('.collapsible') === el; })[0];
      if (!t) return;
      if (t.tagName === 'BUTTON' && !t.getAttribute('type')) t.setAttribute('type', 'button');
      if (!/^(BUTTON|A|SUMMARY)$/.test(t.tagName) && !t.hasAttribute('tabindex')) { t.setAttribute('tabindex', '0'); t.setAttribute('role', 'button'); }
      if (c) { wrapInner(c, 'collapsible-inner'); t.setAttribute('aria-controls', R.ensureId(c, 'col')); }
      setOpen(el, t, c, el.getAttribute('data-state') === 'open');
      function toggle(force) {
        var open = force != null ? !!force : el.getAttribute('data-state') !== 'open';
        setOpen(el, t, c, open);
        R.emit(el, 'change', { open: open });
      }
      var offs = [
        R.on(t, 'click', function (e) { if (t.tagName === 'A') e.preventDefault(); toggle(); }),
        R.on(t, 'keydown', function (e) { if (t.getAttribute('role') === 'button' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggle(); } })
      ];
      el.__col = { toggle: toggle };
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  R.accordion = { toggle: function (item, open) { item = typeof item === 'string' ? d.querySelector(item) : item; var acc = item && item.closest('.accordion'); if (acc && acc.__acc) acc.__acc.toggle(item, open); } };
  R.collapsible = { toggle: function (el, open) { el = typeof el === 'string' ? d.querySelector(el) : el; if (el && el.__col) el.__col.toggle(open); } };
})(window.Ranj);

;
/*!
 * Ranj UI — action loading dialog. A .action-dialog holds .action-view[data-view="confirm|loading|success|error"].
 * Only one view shows; switching morphs the panel height and crossfades.
 *   Ranj.actionDialog.view(el, 'loading')                → switch view
 *   Ranj.actionDialog.run(el, () => promise, { autoClose }) → loading → success/error (closes after success)
 *   [data-action-run] button: runs the task set with Ranj.actionDialog.task(el, fn); without one it fires
 *   ranj:run { done(), fail(msg) } on the dialog, and falls back to a simulated success after data-duration (1600ms).
 * .action-status[data-messages="Validating…|Charging…"] cycles while loading. Events: ranj:change { view }.
 */
(function (R) {
  'use strict';
  var d = document;
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var CROSS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>';

  function get(x) {
    var el = typeof x === 'string' ? d.getElementById(x) : x;
    if (el && !el.classList.contains('action-dialog')) el = el.querySelector('.action-dialog') || el.closest('.action-dialog');
    return el;
  }
  function confetti(view) {
    if (R.reducedMotion || view.querySelector('.action-confetti')) return;
    var c = d.createElement('div'); c.className = 'action-confetti';
    var cols = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--info)', '#f472b6'];
    for (var i = 0; i < 22; i++) {
      var a = (i / 22) * Math.PI * 2, r = 70 + Math.random() * 70;
      c.innerHTML += '<i style="--c:' + cols[i % cols.length] + ';--x:' + Math.round(Math.cos(a) * r) + 'px;--y:' + Math.round(Math.sin(a) * r * .8 - 20) + 'px;--r:' + Math.round(Math.random() * 540) + 'deg;--d:' + (120 + Math.random() * 120 | 0) + 'ms"></i>';
    }
    view.appendChild(c);
    setTimeout(function () { c.remove(); }, 1500);
  }

  function setView(el, name, info) {
    el = get(el); if (!el) return;
    var views = R.$$(':scope > .action-view', el), next = views.filter(function (v) { return v.getAttribute('data-view') === name; })[0];
    var cur = views.filter(function (v) { return v.hasAttribute('data-active'); })[0];
    if (!next || next === cur) return;
    if (info) {
      if (info.title) { var t = next.querySelector('h3,.action-title'); if (t) t.textContent = info.title; }
      if (info.text) { var p = next.querySelector('p,.action-text'); if (p) p.textContent = info.text; }
    }
    var from = el.offsetHeight;
    if (cur) { cur.removeAttribute('data-active'); cur.setAttribute('data-leaving', ''); setTimeout(function () { cur.removeAttribute('data-leaving'); }, 230); }
    next.setAttribute('data-active', '');
    el.setAttribute('data-view', name);
    el.setAttribute('aria-busy', String(name === 'loading'));
    // morph height
    if (from && !R.reducedMotion) {
      el.style.height = 'auto';
      var to = el.offsetHeight;
      el.style.height = from + 'px'; void el.offsetHeight; el.style.height = to + 'px';
      clearTimeout(el.__hT); el.__hT = setTimeout(function () { el.style.height = ''; }, 480);
    }
    var status = next.querySelector('.action-status[data-messages]');
    clearInterval(el.__msg);
    if (status) {
      var msgs = status.getAttribute('data-messages').split('|'), i = 0;
      status.textContent = msgs[0];
      el.__msg = setInterval(function () { i = (i + 1) % msgs.length; if (i === 0 && next.hasAttribute('data-once')) return; status.textContent = msgs[i]; status.removeAttribute('data-swap'); void status.offsetWidth; status.setAttribute('data-swap', ''); }, +(status.getAttribute('data-interval') || 900));
    }
    if (name === 'success' && el.hasAttribute('data-celebrate')) confetti(next);
    var focusT = next.querySelector('[autofocus],.btn');
    if (focusT && el.contains(d.activeElement)) setTimeout(function () { try { focusT.focus({ preventScroll: true }); } catch (x) {} }, 60);
    else if (el.contains(d.activeElement) || d.activeElement === d.body) try { el.focus({ preventScroll: true }); } catch (x) {}
    R.emit(el, 'change', { view: name });
  }

  function run(x, task, o) {
    var el = get(x); if (!el) return Promise.resolve();
    o = o || {};
    var ov = el.closest('.dialog-overlay');
    if (ov && R.dialog && !R.dialog.isOpen(ov)) R.dialog.open(ov);
    setView(el, 'loading');
    var started = performance.now(), min = o.minDuration == null ? 900 : o.minDuration;
    var p = Promise.resolve(typeof task === 'function' ? task() : task);
    function after(fn) { return function (v) { var wait = Math.max(0, min - (performance.now() - started)); setTimeout(function () { fn(v); }, wait); return v; }; }
    p.then(after(function (v) {
      setView(el, 'success', typeof o.success === 'function' ? o.success(v) : o.success);
      var ac = o.autoClose != null ? o.autoClose : parseFloat(el.getAttribute('data-autoclose'));
      if (ov && ac > 0) setTimeout(function () { if (el.getAttribute('data-view') === 'success') R.dialog.close(ov, { reason: 'success' }); }, ac);
    }), after(function (er) {
      setView(el, 'error', typeof o.error === 'function' ? o.error(er) : (o.error || (er && er.message ? { text: er.message } : null)));
    }));
    return p;
  }

  R.define('action-loading', {
    selector: '.action-dialog',
    setup: function () {
      R.on(d, 'click', '[data-action-run]', function (e, b) {
        var el = b.closest('.action-dialog') || get(b.getAttribute('data-action-run'));
        if (!el) return;
        e.preventDefault();
        if (el.__task) { run(el, el.__task); return; }
        var settled = false, res, rej;
        var p = new Promise(function (a, r) { res = a; rej = r; });
        var handled = !R.emit(el, 'run', { done: function (v) { settled = true; res(v); }, fail: function (m) { settled = true; rej(new Error(m || 'Something went wrong')); } });
        if (!handled) setTimeout(function () { if (!settled) res(); }, parseFloat(el.getAttribute('data-duration')) || 1600);
        run(el, p, { minDuration: 0 });
      });
      R.on(d, 'click', '[data-action-view]', function (e, b) { var el = b.closest('.action-dialog'); if (el) setView(el, b.getAttribute('data-action-view')); });
    },
    mount: function (el) {
      if (!el.getAttribute('role') && !el.classList.contains('action-inline')) el.setAttribute('role', 'dialog');
      el.setAttribute('aria-live', 'polite');
      R.$$('.action-check:empty', el).forEach(function (c) { c.innerHTML = CHECK; });
      R.$$('.action-cross:empty', el).forEach(function (c) { c.innerHTML = CROSS; });
      var views = R.$$(':scope > .action-view', el);
      var start = el.getAttribute('data-view') || (views[0] && views[0].getAttribute('data-view'));
      views.forEach(function (v) { if (v.getAttribute('data-view') === start) v.setAttribute('data-active', ''); else v.removeAttribute('data-active'); });
      el.setAttribute('data-view', start);
      if (start === 'loading') setTimeout(function () { var s = el.getAttribute('data-view'); el.removeAttribute('data-view'); views.forEach(function (v) { v.removeAttribute('data-active'); }); setView(el, s); }, 0);
      var ov = el.closest('.dialog-overlay');
      var initial = start;
      var off = ov ? R.on(ov, 'ranj:closed', function () { setView(el, initial); clearInterval(el.__msg); }) : null;
      var off2 = ov ? R.on(ov, 'ranj:close', function () { clearInterval(el.__msg); }) : null;
      return function () { clearInterval(el.__msg); if (off) off(); if (off2) off2(); };
    }
  });

  R.actionDialog = {
    view: setView, run: run,
    task: function (x, fn) { var el = get(x); if (el) el.__task = fn; },
    open: function (x) { var el = get(x), ov = el && el.closest('.dialog-overlay'); if (ov) R.dialog.open(ov); }
  };
})(window.Ranj);

;
/*!
 * Ranj UI — alert dialog helpers.
 * Ranj.confirm({ title, description, confirmText, cancelText, danger, icon, onConfirm }) → Promise<boolean>
 * Ranj.prompt({ title, description, label, placeholder, defaultValue, type, confirmText, validate }) → Promise<string|null>
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var ICONS = {
    danger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    question: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
  };

  function build(o, kind) {
    var ov = d.createElement('div');
    ov.className = 'dialog-overlay';
    ov.id = R.uid('confirm');
    var icon = o.icon === false ? '' : (o.icon || (o.danger ? ICONS.danger : kind === 'prompt' ? ICONS.edit : ICONS.question));
    var field = '';
    if (kind === 'prompt') {
      var fid = R.uid('prompt');
      field = '<div class="alert-dialog-field">' + (o.label ? '<label class="label" for="' + fid + '">' + R.esc(o.label) + '</label>' : '') +
        '<input class="input" id="' + fid + '" type="' + R.esc(o.type || 'text') + '" autocomplete="off" placeholder="' + R.esc(o.placeholder || '') + '" value="' + R.esc(o.defaultValue || '') + '" data-autofocus>' +
        '<div class="alert-dialog-error" role="alert"></div></div>';
    }
    ov.innerHTML =
      '<div class="dialog alert-dialog' + (o.danger ? ' alert-dialog-danger' : '') + (o.centered ? ' alert-dialog-centered' : '') + '" role="alertdialog">' +
        '<form class="alert-dialog-form" novalidate>' +
          '<div class="alert-dialog-body">' + (icon ? '<div class="alert-dialog-media">' + icon + '</div>' : '') +
            '<div class="alert-dialog-text"><h2 class="alert-dialog-title">' + (o.html ? o.title : R.esc(o.title || 'Are you sure?')) + '</h2>' +
            (o.description ? '<p class="alert-dialog-description">' + (o.html ? o.description : R.esc(o.description)) + '</p>' : '') + field + '</div>' +
          '</div>' +
          '<div class="alert-dialog-footer">' +
            (o.cancelText === false ? '' : '<button type="button" class="btn btn-outline" data-act="cancel"' + (kind === 'confirm' && o.danger ? ' data-autofocus' : '') + '>' + R.esc(o.cancelText || 'Cancel') + '</button>') +
            '<button type="submit" class="btn' + (o.danger ? ' btn-destructive' : '') + '" data-act="ok"' + (kind === 'confirm' && !o.danger ? ' data-autofocus' : '') + '>' + R.esc(o.confirmText || (kind === 'prompt' ? 'Save' : 'Continue')) + '</button>' +
          '</div>' +
        '</form>' +
      '</div>';
    d.body.appendChild(ov);
    return ov;
  }

  function run(o, kind) {
    if (typeof o === 'string') o = { title: o };
    o = o || {};
    return new Promise(function (resolve) {
      var ov = build(o, kind), form = ov.querySelector('form'), ok = ov.querySelector('[data-act="ok"]');
      var input = ov.querySelector('.input'), err = ov.querySelector('.alert-dialog-error'), result = kind === 'prompt' ? null : false, busy = false;
      function finish(v) { result = v; R.dialog.close(ov, { reason: 'button', force: true }); }
      ov.addEventListener('ranj:beforeclose', function (e) { if (busy) e.preventDefault(); });
      ov.addEventListener('ranj:close', function () {
        resolve(result);
        setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 600);
      }, { once: true });
      ov.querySelector('[data-act="cancel"]') && ov.querySelector('[data-act="cancel"]').addEventListener('click', function () { if (!busy) finish(kind === 'prompt' ? null : false); });
      if (input) input.addEventListener('input', function () { err.textContent = ''; input.parentNode.removeAttribute('data-invalid'); input.removeAttribute('aria-invalid'); });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (busy) return;
        var val = input ? input.value : true;
        if (input && o.validate) {
          var msg = o.validate(val);
          if (msg !== true && msg !== undefined && msg !== null && msg !== '') {
            err.textContent = typeof msg === 'string' ? msg : 'Invalid value';
            input.parentNode.setAttribute('data-invalid', ''); input.setAttribute('aria-invalid', 'true'); input.focus();
            return;
          }
        }
        if (o.onConfirm) {
          var p = o.onConfirm(val);
          if (p && p.then) {
            busy = true; ok.classList.add('btn-loading'); ok.setAttribute('aria-busy', 'true'); ok.disabled = true;
            p.then(function () { busy = false; finish(kind === 'prompt' ? val : true); }, function (er) {
              busy = false; ok.classList.remove('btn-loading'); ok.disabled = false; ok.removeAttribute('aria-busy');
              if (err) err.textContent = (er && er.message) || 'Something went wrong';
            });
            return;
          }
        }
        finish(kind === 'prompt' ? val : true);
      });
      requestAnimationFrame(function () { R.dialog.open(ov); });
    });
  }

  R.confirm = function (o) { return run(o, 'confirm'); };
  R.prompt = function (o) { return run(o, 'prompt'); };
})(window.Ranj);

;
/*!
 * Ranj UI — alert dismiss. Click .alert-close (or [data-alert-close]) to collapse and remove the alert.
 * data-alert-hide on .alert → hide instead of removing (restore with Ranj.alert.show(el)).
 * Events: ranj:close (cancelable) on the alert before it collapses.
 */
(function (R) {
  'use strict';
  var d = document;

  function dismiss(el) {
    if (!el || el.hasAttribute('data-closing')) return;
    if (!R.emit(el, 'close', {})) return;
    var done = function () {
      if (el.hasAttribute('data-alert-hide')) { el.hidden = true; el.removeAttribute('data-closing'); el.removeAttribute('style'); }
      else if (el.parentNode) el.parentNode.removeChild(el);
    };
    if (R.reducedMotion) return done();
    el.style.height = el.offsetHeight + 'px';
    el.setAttribute('data-closing', '');
    void el.offsetHeight;
    el.style.height = '0px'; el.style.opacity = '0'; el.style.transform = 'translateY(-4px) scale(.98)';
    el.style.paddingTop = el.style.paddingBottom = '0px'; el.style.marginTop = el.style.marginBottom = '0px'; el.style.borderTopWidth = el.style.borderBottomWidth = '0px';
    var fin = false, f = function () { if (fin) return; fin = true; done(); };
    el.addEventListener('transitionend', function te(e) { if (e.target === el && e.propertyName === 'height') { el.removeEventListener('transitionend', te); f(); } });
    setTimeout(f, 450);
  }
  function show(el) {
    if (!el) return;
    el.hidden = false; el.removeAttribute('data-closing'); el.removeAttribute('style');
    el.removeAttribute('data-enter'); void el.offsetWidth; el.setAttribute('data-enter', '');
    R.emit(el, 'open', {});
  }

  R.define('alert', {
    selector: '.alert',
    setup: function () {
      R.on(d, 'click', '.alert-close,[data-alert-close]', function (e, b) { var el = b.closest('.alert'); if (el) { e.preventDefault(); dismiss(el); } });
    },
    mount: function (el) {
      if (!el.getAttribute('role')) el.setAttribute('role', el.matches('.alert-destructive,.alert-error,.alert-danger,.alert-warning') ? 'alert' : 'status');
      var c = el.querySelector('.alert-close');
      if (c && !c.getAttribute('aria-label')) c.setAttribute('aria-label', 'Dismiss');
    }
  });

  R.alert = { dismiss: function (el) { dismiss(typeof el === 'string' ? d.querySelector(el) : el); }, show: function (el) { show(typeof el === 'string' ? d.querySelector(el) : el); } };
})(window.Ranj);

;
/*!
 * Ranj UI — back to top + scrollspy.
 * <button class="back-to-top" data-target="#scroller" data-offset="320" aria-label="Back to top"></button>
 *   Shows after scrolling data-offset px in the target (default: the page); ring shows progress (--p 0..1).
 * <nav class="toc" data-target="#article" data-offset="24"><a class="toc-link" href="#intro">…</a>…</nav>
 *   Highlights the link of the section in view, slides an indicator, smooth-scrolls on click (no hash change).
 *   Events: ranj:change { id, link } on .toc.
 */
(function (R) {
  'use strict';
  var d = document, w = window;

  function rootOf(el) {
    var sel = el.getAttribute('data-target');
    var t = sel ? d.querySelector(sel) : null;
    return t || w;
  }
  function metrics(root) {
    if (root === w) { var de = d.documentElement; return { top: w.scrollY, max: Math.max(1, de.scrollHeight - w.innerHeight), h: w.innerHeight, rectTop: 0 }; }
    return { top: root.scrollTop, max: Math.max(1, root.scrollHeight - root.clientHeight), h: root.clientHeight, rectTop: root.getBoundingClientRect().top };
  }
  function scrollTo(root, y) {
    var b = R.reducedMotion ? 'auto' : 'smooth';
    if (root === w) w.scrollTo({ top: y, behavior: b }); else root.scrollTo({ top: y, behavior: b });
  }
  var ARROW = '<svg class="back-to-top-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7M12 19V5"/></svg>';
  var RING = '<svg class="back-to-top-ring" viewBox="0 0 36 36" aria-hidden="true"><circle class="btt-track" cx="18" cy="18" r="16.6" pathLength="100"/><circle class="btt-bar" cx="18" cy="18" r="16.6" pathLength="100"/></svg>';

  R.define('back-to-top', {
    selector: '.back-to-top',
    mount: function (btn) {
      if (!btn.children.length && !btn.textContent.trim()) btn.innerHTML = ARROW;
      if (!btn.querySelector('.back-to-top-ring') && !btn.classList.contains('back-to-top-pill')) btn.insertAdjacentHTML('afterbegin', RING);
      if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) btn.setAttribute('aria-label', 'Back to top');
      var root = rootOf(btn), off = R.attr(btn, 'data-offset', 320), raf = 0;
      btn.tabIndex = -1;
      function upd() {
        raf = 0;
        var m = metrics(root);
        btn.style.setProperty('--p', (m.top / m.max).toFixed(4));
        var vis = m.top > off;
        if (vis !== btn.hasAttribute('data-visible')) { if (vis) btn.setAttribute('data-visible', ''); else btn.removeAttribute('data-visible'); btn.tabIndex = vis ? 0 : -1; }
      }
      function sch() { if (!raf) raf = requestAnimationFrame(upd); }
      root.addEventListener('scroll', sch, { passive: true });
      w.addEventListener('resize', sch);
      var offC = R.on(btn, 'click', function () { scrollTo(root, 0); R.emit(btn, 'select', {}); });
      upd();
      return function () { root.removeEventListener('scroll', sch); w.removeEventListener('resize', sch); offC(); cancelAnimationFrame(raf); };
    }
  });

  R.define('scrollspy', {
    selector: '.toc,[data-scrollspy]',
    mount: function (nav) {
      var root = rootOf(nav), raf = 0, current = null;
      var off = R.attr(nav, 'data-offset', 24);
      var links = R.$$('a[href^="#"]', nav).filter(function (a) { return a.getAttribute('href').length > 1; });
      var pairs = links.map(function (a) { var id = decodeURIComponent(a.getAttribute('href').slice(1)); return { a: a, id: id, el: d.getElementById(id) }; }).filter(function (p) { return p.el; });
      if (!pairs.length) return;
      var ind = nav.querySelector(':scope > .toc-indicator');
      if (!ind && nav.classList.contains('toc')) { ind = d.createElement('span'); ind.className = 'toc-indicator'; ind.setAttribute('aria-hidden', 'true'); nav.insertBefore(ind, nav.firstChild); }
      var prog = nav.querySelector('.toc-progress');
      function sectionTop(el) { var m = metrics(root); return el.getBoundingClientRect().top - m.rectTop + m.top; }
      function upd() {
        raf = 0;
        var m = metrics(root), line = m.top + off + Math.min(120, m.h * .25), act = pairs[0];
        pairs.forEach(function (p) { if (sectionTop(p.el) <= line) act = p; });
        if (m.top >= m.max - 2) act = pairs[pairs.length - 1];
        if (prog) prog.style.setProperty('--p', (m.top / m.max).toFixed(4));
        if (act === current) return;
        current = act;
        var passed = true;
        pairs.forEach(function (p) {
          if (p === act) { p.a.setAttribute('aria-current', 'true'); p.a.classList.add('active'); passed = false; p.a.removeAttribute('data-passed'); }
          else { p.a.removeAttribute('aria-current'); p.a.classList.remove('active'); if (passed) p.a.setAttribute('data-passed', ''); else p.a.removeAttribute('data-passed'); }
        });
        if (ind) { nav.style.setProperty('--ty', act.a.offsetTop + 'px'); nav.style.setProperty('--th', act.a.offsetHeight + 'px'); }
        R.emit(nav, 'change', { id: act.id, link: act.a });
      }
      function sch() { if (!raf) raf = requestAnimationFrame(upd); }
      root.addEventListener('scroll', sch, { passive: true });
      w.addEventListener('resize', sch);
      var offC = R.on(nav, 'click', 'a[href^="#"]', function (e, a) {
        var p = pairs.filter(function (x) { return x.a === a; })[0]; if (!p) return;
        e.preventDefault();
        scrollTo(root, Math.max(0, sectionTop(p.el) - off));
        if (!p.el.hasAttribute('tabindex')) p.el.setAttribute('tabindex', '-1');
        setTimeout(function () { try { p.el.focus({ preventScroll: true }); } catch (x) {} }, R.reducedMotion ? 0 : 450);
      });
      upd();
      requestAnimationFrame(function () { if (current && ind) { nav.style.setProperty('--ty', current.a.offsetTop + 'px'); nav.style.setProperty('--th', current.a.offsetHeight + 'px'); } nav.setAttribute('data-ready', ''); });
      return function () { root.removeEventListener('scroll', sch); w.removeEventListener('resize', sch); offC(); cancelAnimationFrame(raf); };
    }
  });
})(window.Ranj);

;
/*!
 * Ranj UI — bottom nav + side rail: an active pill/indicator that glides to the selected item.
 * .bottom-nav > .bottom-nav-item[aria-current="page"] (> .bottom-nav-icon > svg + .bottom-nav-label)
 * .side-rail > .side-rail-item[aria-current="page"] (> svg + .side-rail-label)
 * Clicking an item selects it (data-static to opt out). ← → (bottom nav) / ↑ ↓ (rail) move focus.
 * Events: ranj:change { item, index, value }.
 */
(function (R) {
  'use strict';
  var d = document;

  function make(name, cfg) {
    R.define(name, {
      selector: cfg.root,
      mount: function (el) {
        var ind = el.querySelector(':scope > .' + cfg.ind);
        if (!ind) { ind = d.createElement('span'); ind.className = cfg.ind; ind.setAttribute('aria-hidden', 'true'); el.insertBefore(ind, el.firstChild); }
        function items() { return R.$$(':scope > ' + cfg.item, el); }
        function cur() { return items().filter(function (i) { return i.getAttribute('aria-current') === 'page' || i.classList.contains('active'); })[0]; }
        function place() {
          var c = cur();
          ind.style.opacity = c ? '' : '0';
          if (c) cfg.place(el, c, ind);
        }
        function select(it) {
          items().forEach(function (i) { if (i === it) i.setAttribute('aria-current', 'page'); else i.removeAttribute('aria-current'); i.classList.remove('active'); });
          place();
          R.emit(el, 'change', { item: it, index: items().indexOf(it), value: it.getAttribute('data-value') || it.textContent.trim() });
        }
        items().forEach(function (i) { if (i.tagName === 'BUTTON' && !i.getAttribute('type')) i.setAttribute('type', 'button'); });
        place();
        requestAnimationFrame(function () { place(); requestAnimationFrame(function () { el.setAttribute('data-ready', ''); }); });
        var offs = [
          R.on(el, 'click', cfg.item, function (e, it) {
            if (el.hasAttribute('data-static')) return;
            if (it.getAttribute('href') === '#') e.preventDefault();
            select(it);
          }),
          R.on(el, 'keydown', cfg.item, function (e, it) {
            var ks = cfg.keys; var dir = e.key === ks[1] ? 1 : e.key === ks[0] ? -1 : 0;
            if (!dir) return;
            e.preventDefault();
            var is = items(), n = is[(is.indexOf(it) + dir + is.length) % is.length];
            n.focus();
          })
        ];
        var ro = window.ResizeObserver ? new ResizeObserver(place) : null;
        if (ro) { ro.observe(el); items().forEach(function (i) { ro.observe(i); }); }
        // label width transitions in expand mode: re-place while they run
        var off2 = R.on(el, 'transitionend', function (e) { if (e.target !== ind) place(); });
        el['__' + name] = { select: function (i) { var it = typeof i === 'number' ? items()[i] : i; if (it) select(it); }, refresh: place };
        return function () { offs.forEach(function (f) { f(); }); off2(); if (ro) ro.disconnect(); };
      }
    });
  }

  make('bottom-nav', {
    root: '.bottom-nav', item: '.bottom-nav-item', ind: 'bottom-nav-pill', keys: ['ArrowLeft', 'ArrowRight'],
    place: function (el, c, ind) {
      if (el.classList.contains('bottom-nav-expand')) {
        el.style.setProperty('--pw', c.offsetWidth + 'px');
        ind.style.left = '0px';
        el.style.setProperty('--px', c.offsetLeft + 'px');
        ind.style.transform = 'translateX(' + c.offsetLeft + 'px)';
      } else {
        var icon = c.querySelector('.bottom-nav-icon') || c;
        var x = c.offsetLeft + icon.offsetLeft + (icon.offsetWidth - ind.offsetWidth) / 2;
        ind.style.transform = 'translateX(' + x + 'px)';
      }
    }
  });
  make('side-rail', {
    root: '.side-rail', item: '.side-rail-item', ind: 'side-rail-indicator', keys: ['ArrowUp', 'ArrowDown'],
    place: function (el, c, ind) { el.style.setProperty('--iy', c.offsetTop + 'px'); el.style.setProperty('--ih', c.offsetHeight + 'px'); }
  });

  R.bottomNav = { select: function (el, i) { el = typeof el === 'string' ? d.querySelector(el) : el; if (el && el['__bottom-nav']) el['__bottom-nav'].select(i); } };
})(window.Ranj);

;
/*!
 * Ranj UI — command palette. Fuzzy filter with match highlighting, groups, keyboard,
 * recent items (data-recent="storage-key"), opt-in global hotkey (data-hotkey="k" → ⌘K / Ctrl+K).
 * Inline: <div class="command">…</div> · Modal: <div class="command-overlay" id="x"><div class="command-dialog">…</div></div>
 * Items: .command-item[data-value][data-keywords][data-href][data-keep-open]
 * API: Ranj.command.open(id) / close(id) / toggle(id). Events: ranj:select { value, item } (cancelable) from the item.
 */
(function (R) {
  'use strict';
  var d = document;

  function score(q, s) {
    if (!q) return 1;
    var i = s.indexOf(q);
    if (i === 0) return 2000 - s.length;
    if (i > 0) return (/[\s\-_/]/.test(s[i - 1]) ? 1500 : 1000) - i;
    var si = 0, sc = 0, prev = -2, run = 0;
    for (var k = 0; k < q.length; k++) {
      var c = q[k]; if (c === ' ') continue;
      var f = s.indexOf(c, si); if (f < 0) return 0;
      sc += 10;
      if (f === prev + 1) { run++; sc += 12 * run; } else run = 0;
      if (f === 0 || /[\s\-_/]/.test(s[f - 1])) sc += 18;
      sc -= Math.min(10, f - si) * .6;
      prev = f; si = f + 1;
    }
    return Math.max(1, sc);
  }
  function matchIdx(q, s) {
    var out = [], i = s.indexOf(q);
    if (q && i > -1) { for (var k = 0; k < q.length; k++) out.push(i + k); return out; }
    var si = 0;
    for (var j = 0; j < q.length; j++) { if (q[j] === ' ') continue; var f = s.indexOf(q[j], si); if (f < 0) return []; out.push(f); si = f + 1; }
    return out;
  }

  R.define('command', {
    selector: '.command,.command-dialog',
    mount: function (root) {
      var input = root.querySelector('.command-input');
      var list = root.querySelector('.command-list');
      if (!input || !list) return;
      var ov = root.closest('.command-overlay');
      var key = root.getAttribute('data-recent') || (ov && ov.getAttribute('data-recent'));
      var recentLabel = root.getAttribute('data-recent-label') || 'Recent';
      var items = [], active = null, recentGroup = null;

      R.ensureId(list, 'cmd-list');
      list.setAttribute('role', 'listbox');
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-controls', list.id);
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('spellcheck', 'false');

      function collect() {
        items = R.$$('.command-item', list).filter(function (it) { return !it.hasAttribute('data-recent-clone'); });
        items.forEach(function (it, n) {
          it.setAttribute('role', 'option');
          R.ensureId(it, 'cmd-opt');
          it.__order = n;
          if (!it.__label) {
            var lab = it.querySelector('.command-label');
            if (!lab) {
              var tn = Array.prototype.filter.call(it.childNodes, function (c) { return c.nodeType === 3 && c.textContent.trim(); })[0];
              if (tn) { lab = d.createElement('span'); lab.className = 'command-label'; lab.textContent = tn.textContent.trim(); it.replaceChild(lab, tn); }
            }
            it.__label = lab;
            it.__text = lab ? lab.textContent : it.textContent.trim();
          }
          if (!it.hasAttribute('data-value')) it.setAttribute('data-value', it.__text.trim());
        });
        R.$$('.command-group', list).forEach(function (g) {
          g.setAttribute('role', 'group');
          var l = g.querySelector('.command-group-label');
          if (l) g.setAttribute('aria-labelledby', R.ensureId(l, 'cmd-g'));
        });
      }
      collect();

      function visible() { return R.$$('.command-item', list).filter(function (i) { return !i.hidden && !i.closest('[hidden]') && i.getAttribute('aria-disabled') !== 'true'; }); }
      function setActive(it, scroll) {
        if (active === it) return;
        if (active) active.removeAttribute('aria-selected');
        active = it;
        if (it) {
          it.setAttribute('aria-selected', 'true');
          input.setAttribute('aria-activedescendant', it.id);
          if (scroll) it.scrollIntoView({ block: 'nearest' });
        } else input.removeAttribute('aria-activedescendant');
      }
      function readRecent() { if (!key) return []; try { return JSON.parse(localStorage.getItem('ranj-cmd:' + key) || '[]'); } catch (e) { return []; } }
      function pushRecent(v) {
        if (!key) return;
        var r = readRecent().filter(function (x) { return x !== v; }); r.unshift(v);
        try { localStorage.setItem('ranj-cmd:' + key, JSON.stringify(r.slice(0, 4))); } catch (e) {}
      }
      function buildRecent() {
        if (recentGroup) { recentGroup.remove(); recentGroup = null; }
        var r = readRecent(); if (!r.length) return;
        var g = d.createElement('div'); g.className = 'command-group'; g.setAttribute('data-recent-group', ''); g.setAttribute('role', 'group');
        g.innerHTML = '<div class="command-group-label">' + R.esc(recentLabel) + '</div>';
        r.forEach(function (v) {
          var src = items.filter(function (i) { return i.getAttribute('data-value') === v; })[0];
          if (!src) return;
          var c = src.cloneNode(true); c.id = R.uid('cmd-opt'); c.setAttribute('data-recent-clone', ''); c.removeAttribute('aria-selected'); c.removeAttribute('hidden'); c.__src = src;
          var cl = c.querySelector('.command-label'); if (cl) cl.textContent = src.__text;
          g.appendChild(c);
        });
        if (g.children.length < 2) return;
        var first = list.querySelector('.command-group,.command-item');
        list.insertBefore(g, first || null);
        var sep = d.createElement('div'); sep.className = 'command-separator'; sep.setAttribute('data-recent-sep', '');
        g.appendChild(sep);
        recentGroup = g;
      }

      function filter() {
        var q = input.value.trim().toLowerCase();
        var groups = R.$$('.command-group', list).filter(function (g) { return !g.hasAttribute('data-recent-group'); });
        if (recentGroup) recentGroup.hidden = !!q;
        items.forEach(function (it) {
          var hay = (it.__text + ' ' + (it.getAttribute('data-keywords') || '') + ' ' + (it.getAttribute('data-value') || '')).toLowerCase();
          var s = it.hasAttribute('data-always') ? 1 : score(q, hay);
          it.__score = s;
          it.hidden = !s;
          if (it.__label) {
            var t = it.__text, idx = q ? matchIdx(q, t.toLowerCase()) : [];
            if (idx.length) {
              var html = '', set = {}; idx.forEach(function (n) { set[n] = 1; });
              for (var c = 0; c < t.length; c++) html += set[c] ? '<mark>' + R.esc(t[c]) + '</mark>' : R.esc(t[c]);
              it.__label.innerHTML = html.replace(/<\/mark><mark>/g, '');
            } else if (it.__label.firstElementChild) it.__label.textContent = t;
          }
        });
        groups.forEach(function (g) {
          var gi = items.filter(function (i) { return i.parentNode === g; });
          gi.sort(function (a, b) { return q ? (b.__score - a.__score) || (a.__order - b.__order) : a.__order - b.__order; });
          gi.forEach(function (i) { g.appendChild(i); });
          g.hidden = !gi.some(function (i) { return !i.hidden; });
        });
        R.$$('.command-separator', list).forEach(function (s) { if (!s.hasAttribute('data-recent-sep')) s.hidden = !!q; });
        var any = items.some(function (i) { return !i.hidden; });
        if (any) root.removeAttribute('data-empty'); else root.setAttribute('data-empty', '');
        var v = visible();
        setActive(null);
        setActive(v[0] || null, true);
        list.scrollTop = 0;
        R.emit(root, 'filter', { query: q, count: items.filter(function (i) { return !i.hidden; }).length });
      }

      function select(it) {
        if (!it || it.getAttribute('aria-disabled') === 'true') return;
        var src = it.__src || it;
        var ok = R.emit(src, 'select', { value: src.getAttribute('data-value'), item: src, query: input.value });
        if (!ok) return;
        pushRecent(src.getAttribute('data-value'));
        var href = src.getAttribute('data-href') || (src.tagName === 'A' ? src.getAttribute('href') : null);
        if (ov && !src.hasAttribute('data-keep-open') && R.dialog) R.dialog.close(ov, { reason: 'select' });
        if (href && src.tagName !== 'A') location.href = href;
      }

      function reset() {
        input.value = '';
        buildRecent();
        filter();
      }

      var offs = [
        R.on(input, 'input', filter),
        R.on(input, 'keydown', function (e) {
          var v = visible(), i = v.indexOf(active);
          if (e.key === 'ArrowDown' || (e.ctrlKey && (e.key === 'n' || e.key === 'j'))) { e.preventDefault(); setActive(v[(i + 1) % v.length] || null, true); }
          else if (e.key === 'ArrowUp' || (e.ctrlKey && (e.key === 'p' || e.key === 'k'))) { e.preventDefault(); setActive(v[i <= 0 ? v.length - 1 : i - 1] || null, true); }
          else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); setActive(v[0], true); }
          else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); setActive(v[v.length - 1], true); }
          else if (e.key === 'Enter') { e.preventDefault(); select(active); }
          else if (e.key === 'Escape' && !ov && input.value) { e.preventDefault(); e.stopPropagation(); input.value = ''; filter(); }
        }),
        R.on(list, 'pointermove', function (e) {
          var it = e.target.closest('.command-item');
          if (it && !it.hidden && it !== active && it.getAttribute('aria-disabled') !== 'true') setActive(it, false);
        }),
        R.on(list, 'click', function (e) {
          var it = e.target.closest('.command-item');
          if (it) { if (it.tagName === 'A' && ov && !it.hasAttribute('data-keep-open')) { /* navigate */ } else e.preventDefault(); select(it); }
        }),
        R.on(root, 'click', '.command-esc,[data-command-close]', function () { if (ov && R.dialog) R.dialog.close(ov, { reason: 'button' }); })
      ];
      if (ov) offs.push(R.on(ov, 'ranj:open', function (e) { if (e.target === ov) reset(); }));
      root.__command = { filter: filter, reset: reset, refresh: function () { collect(); filter(); }, select: select };
      reset();
      return function () { offs.forEach(function (f) { f(); }); if (recentGroup) recentGroup.remove(); };
    }
  });

  // Opt-in global hotkey: <div class="command-overlay" data-hotkey="k">
  R.define('command-hotkey', {
    setup: function () {
      d.addEventListener('keydown', function (e) {
        if (!(e.metaKey || e.ctrlKey) || e.altKey || !e.key) return;
        var k = e.key.toLowerCase();
        var ov = R.$$('.command-overlay[data-hotkey]').filter(function (o) { return o.getAttribute('data-hotkey').toLowerCase() === k; })[0];
        if (!ov || !R.dialog) return;
        e.preventDefault();
        R.dialog.toggle(ov);
      });
    }
  });

  R.command = {
    open: function (id) { return R.dialog && R.dialog.open(id); },
    close: function (id) { return R.dialog && R.dialog.close(id); },
    toggle: function (id) { return R.dialog && R.dialog.toggle(id); },
    refresh: function (el) { el = typeof el === 'string' ? d.getElementById(el) : el; var r = el && (el.__command ? el : el.querySelector('.command,.command-dialog')); if (r && r.__command) r.__command.refresh(); }
  };
})(window.Ranj);

;
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

;
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

;
/*!
 * Ranj UI — drawer: drag-to-dismiss with velocity, rubber-banding and snap points.
 * <div class="dialog-overlay" id="d"><div class="drawer" data-snap-points="0.45,1"><div class="drawer-handle"></div>…</div></div>
 * data-snap-points: visible fractions of the drawer (1 = fully open). data-snap: initial index (default last).
 * Events: ranj:snap { index, point } on the drawer.
 */
(function (R) {
  'use strict';
  var d = document;
  var NO_DRAG = 'input,textarea,select,button,a,[contenteditable="true"],[data-no-drag],.slider,[role="slider"]';

  R.define('drawer', {
    selector: '.drawer',
    mount: function (el) {
      var horiz = el.classList.contains('drawer-right') || el.classList.contains('drawer-left');
      var sign = el.classList.contains('drawer-left') ? -1 : 1;
      var snaps = (el.getAttribute('data-snap-points') || '').split(',').map(parseFloat).filter(function (n) { return n > 0 && n <= 1; }).sort(function (a, b) { return a - b; });
      var idx = 0, offset = 0, drag = null;

      function size() { return horiz ? el.offsetWidth : el.offsetHeight; }
      function snapY(i) { return snaps.length ? (1 - snaps[i]) * size() : 0; }
      function overlay() { return el.closest('.dialog-overlay') || el.previousElementSibling; }
      function setY(y, live) {
        offset = y;
        el.style.setProperty('--drawer-y', y.toFixed(1) + 'px');
        var ov = overlay();
        if (ov && ov.classList && ov.classList.contains('dialog-overlay')) {
          var base = snaps.length ? snapY(0) : 0, span = Math.max(1, size() - base);
          var o = R.clamp(1 - (y - base) / span, 0, 1);
          ov.style.setProperty('--backdrop-o', y <= base ? '1' : o.toFixed(3));
        }
      }
      function snapTo(i) { idx = R.clamp(i, 0, snaps.length - 1); setY(snapY(idx)); R.emit(el, 'snap', { index: idx, point: snaps[idx] }); }

      el.__onOpen = function () {
        var ov = overlay(); if (ov && ov.style) ov.style.removeProperty('--backdrop-o');
        if (snaps.length) {
          var start = parseInt(el.getAttribute('data-snap'), 10);
          idx = isNaN(start) ? snaps.length - 1 : R.clamp(start, 0, snaps.length - 1);
          setY(snapY(idx));
        } else setY(0);
      };
      el.__snapTo = snapTo;
      el.__onClose = function () { el.removeAttribute('data-dragging'); drag = null; };

      function scrollParent(t) {
        for (var n = t; n && n !== el; n = n.parentElement) if (n.scrollHeight > n.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(n).overflowY)) return n;
        return null;
      }
      function down(e) {
        if (e.button !== 0 || el.getAttribute('data-state') !== 'open') return;
        var onHandle = e.target.closest('.drawer-handle');
        if (!onHandle && e.target.closest(NO_DRAG)) return;
        var sp = onHandle ? null : scrollParent(e.target);
        drag = { x: e.clientX, y: e.clientY, t: performance.now(), start: offset, active: false, sp: sp, samples: [], id: e.pointerId };
        d.addEventListener('pointermove', move, { passive: false });
        d.addEventListener('pointerup', up);
        d.addEventListener('pointercancel', up);
      }
      function unbind() { d.removeEventListener('pointermove', move); d.removeEventListener('pointerup', up); d.removeEventListener('pointercancel', up); }
      function move(e) {
        if (!drag || e.pointerId !== drag.id) return;
        var raw = horiz ? (e.clientX - drag.x) * sign : e.clientY - drag.y;
        var cross = horiz ? e.clientY - drag.y : e.clientX - drag.x;
        if (!drag.active) {
          if (Math.abs(raw) < 5) return;
          if (Math.abs(cross) > Math.abs(raw)) { drag = null; unbind(); return; }
          // inside a scrolled list: only drag when at top and pulling down
          if (drag.sp && (drag.sp.scrollTop > 0 || raw < 0)) { drag = null; unbind(); return; }
          drag.active = true;
          el.setAttribute('data-dragging', '');
          try { el.setPointerCapture(e.pointerId); } catch (x) {}
        }
        e.preventDefault();
        var y = drag.start + raw;
        var min = 0;
        if (y < min) y = min - Math.pow(min - y, .72); // rubber band past fully-open
        setY(y, true);
        var now = performance.now();
        drag.samples.push({ t: now, y: y }); if (drag.samples.length > 6) drag.samples.shift();
      }
      function up(e) {
        if (!drag || (e.pointerId !== drag.id && e.type !== 'lostpointercapture')) return;
        var g = drag; drag = null; unbind();
        if (!g.active) return;
        el.removeAttribute('data-dragging');
        var s = g.samples, v = 0;
        if (s.length > 1) { var a = s[0], b = s[s.length - 1]; v = (b.y - a.y) / Math.max(1, b.t - a.t); } // px/ms, + = toward close
        var h = size();
        if (snaps.length) {
          var projected = offset + v * 180;
          var lowest = snapY(0);
          if (projected > lowest + (h - lowest) * .45 || (v > .9 && idx === 0)) return dismiss();
          var best = 0, bd = Infinity;
          snaps.forEach(function (p, i) { var dd = Math.abs(snapY(i) - projected); if (dd < bd) { bd = dd; best = i; } });
          snapTo(best);
        } else {
          if (offset > h * .3 || v > .45) return dismiss();
          setY(0);
        }
      }
      function dismiss() {
        var ov = overlay();
        if (ov && ov.style) ov.style.setProperty('--backdrop-o', '0');
        if (R.dialog) R.dialog.close(el, { reason: 'swipe' });
      }
      el.addEventListener('pointerdown', down);

      return function () {
        el.removeEventListener('pointerdown', down); unbind();
        el.__onOpen = el.__onClose = el.__snapTo = null;
      };
    }
  });

  R.drawer = R.drawer || {};
  R.drawer.snap = function (el, i) { el = typeof el === 'string' ? d.getElementById(el) : el; if (el && el.__snapTo) el.__snapTo(i); };
})(window.Ranj);

;
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

;
/*!
 * Ranj UI — floating action menu.
 * <div class="fab-menu" data-direction="up"><div class="fab-actions"><button class="fab-action" data-label="Photo">…</button>…</div>
 *   <button class="fab" aria-label="Create">+</button></div>
 * data-direction: up | down | left | right. .fab-radial + data-arc="180" data-start="-90" (degrees) for an arc.
 * Esc / outside click closes; ↑ ↓ ← → move between actions. Events: ranj:open / ranj:close, ranj:select { action }.
 */
(function (R) {
  'use strict';
  var d = document;

  R.define('floating-action-menu', {
    selector: '.fab-menu',
    mount: function (el) {
      var fab = el.querySelector(':scope > .fab'), wrap = el.querySelector('.fab-actions');
      if (!fab || !wrap) return;
      var acts = R.$$('.fab-action', wrap), n = acts.length;
      var radial = el.classList.contains('fab-radial');
      var o = R.opts(el, { direction: 'up', arc: 90, start: -90, radius: 0 });
      var scrim = el.nextElementSibling && el.nextElementSibling.classList.contains('fab-scrim') ? el.nextElementSibling : null;
      var pop = null, out = null;
      fab.setAttribute('aria-haspopup', 'menu');
      fab.setAttribute('aria-expanded', 'false');
      wrap.setAttribute('role', 'menu');
      fab.setAttribute('aria-controls', R.ensureId(wrap, 'fab'));

      function layout() {
        var cs = getComputedStyle(el), rem = parseFloat(getComputedStyle(d.documentElement).fontSize) || 16;
        var fabS = fab.offsetWidth, actS = acts[0] ? acts[0].offsetWidth : 44, gap = parseFloat(cs.getPropertyValue('--fab-gap')) * rem || 12;
        var r = o.radius || parseFloat(cs.getPropertyValue('--fab-radius')) * rem || 96;
        acts.forEach(function (a, i) {
          a.style.setProperty('--i', i); a.style.setProperty('--n', n);
          a.setAttribute('role', 'menuitem'); a.setAttribute('tabindex', '-1');
          if (!a.getAttribute('aria-label') && a.getAttribute('data-label')) a.setAttribute('aria-label', a.getAttribute('data-label'));
          var dx = 0, dy = 0;
          if (radial) {
            var ang = (o.start - o.arc / 2 + (n === 1 ? o.arc / 2 : o.arc * i / (n - 1))) * Math.PI / 180;
            dx = Math.cos(ang) * r; dy = Math.sin(ang) * r;
            if (a.getAttribute('data-label') && !a.hasAttribute('data-tooltip')) { a.setAttribute('data-tooltip', a.getAttribute('data-label')); a.setAttribute('data-tooltip-delay', '0'); }
          } else {
            var step = (fabS + actS) / 2 + gap + i * (actS + gap * .75);
            if (o.direction === 'up') dy = -step; else if (o.direction === 'down') dy = step; else if (o.direction === 'left') dx = -step; else dx = step;
          }
          a.style.setProperty('--dx', dx.toFixed(1) + 'px'); a.style.setProperty('--dy', dy.toFixed(1) + 'px');
        });
      }
      function setOpen(open, focus) {
        if (open === el.hasAttribute('data-open')) return;
        fab.setAttribute('aria-expanded', String(open));
        if (open) {
          layout();
          el.setAttribute('data-open', '');
          if (scrim) scrim.setAttribute('data-open', '');
          pop = R.pushLayer(function () { setOpen(false); fab.focus(); });
          out = R.onOutside([el], function () { setOpen(false); });
          if (focus) setTimeout(function () { acts[0] && acts[0].focus(); }, 60);
          R.emit(el, 'open', {});
        } else {
          el.removeAttribute('data-open');
          if (scrim) scrim.removeAttribute('data-open');
          if (pop) pop(); if (out) out(); pop = out = null;
          if (acts.indexOf(d.activeElement) > -1) fab.focus();
          R.emit(el, 'close', {});
        }
      }
      layout();
      var offs = [
        R.on(fab, 'click', function (e) { setOpen(!el.hasAttribute('data-open'), e.detail === 0); }),
        R.on(wrap, 'click', '.fab-action', function (e, a) { R.emit(a, 'select', { action: a.getAttribute('data-label') || a.getAttribute('aria-label') }); if (!a.hasAttribute('data-keep-open')) setOpen(false); }),
        R.on(el, 'keydown', function (e) {
          if (!el.hasAttribute('data-open')) return;
          if (!/^Arrow/.test(e.key) && e.key !== 'Home' && e.key !== 'End') return;
          var i = acts.indexOf(d.activeElement), next;
          var fwd = radial ? /Right|Down/ : (o.direction === 'up' ? /Up/ : o.direction === 'down' ? /Down/ : o.direction === 'left' ? /Left/ : /Right/);
          if (e.key === 'Home') next = 0; else if (e.key === 'End') next = n - 1;
          else next = fwd.test(e.key) ? (i + 1) % n : (i <= 0 ? n - 1 : i - 1);
          e.preventDefault(); acts[next].focus();
        }),
        scrim ? R.on(scrim, 'click', function () { setOpen(false); }) : function () {}
      ];
      el.__fab = { open: function () { setOpen(true); }, close: function () { setOpen(false); }, toggle: function () { setOpen(!el.hasAttribute('data-open')); } };
      return function () { setOpen(false); offs.forEach(function (f) { f(); }); };
    }
  });
})(window.Ranj);

;
/*!
 * Ranj UI — hover card. Opens after data-open-delay (500ms) on hover or keyboard focus,
 * stays open while the pointer is over the trigger or the card, closes after data-close-delay (250ms).
 * <span class="hover-card" data-placement="bottom"><a class="hover-card-trigger">@vercel</a><div class="hover-card-content">…</div></span>
 */
(function (R) {
  'use strict';
  var K = R.__ov;

  R.define('hover-card', {
    selector: '.hover-card',
    mount: function (el) {
      var content = el.querySelector(':scope > .hover-card-content') || el.querySelector('.hover-card-content');
      if (!content) return;
      var trigger = el.querySelector('[data-hover-card-trigger]') || (el.firstElementChild !== content ? el.firstElementChild : el);
      var o = R.opts(el, { placement: 'bottom', offset: 8, openDelay: 500, closeDelay: 250, arrow: false });
      var h = null, t = 0;
      if (o.arrow) K.arrow(content);
      R.ensureId(content, 'hc');

      function open() {
        clearTimeout(t);
        if (h) return;
        el.setAttribute('data-state', 'open');
        h = K.float(content, trigger, {
          placement: o.placement, offset: o.offset, ignore: [trigger],
          onClose: function (reason) { h = null; el.setAttribute('data-state', 'closed'); R.emit(el, 'close', { reason: reason }); }
        });
        R.emit(el, 'open', {});
      }
      function close() { clearTimeout(t); if (h) h.close('hover'); }
      function enter(e) { if (e.pointerType === 'touch') return; clearTimeout(t); if (!h) t = setTimeout(open, o.openDelay); }
      function leave(e) { if (e.pointerType === 'touch') return; clearTimeout(t); t = setTimeout(close, o.closeDelay); }
      var offs = [
        R.on(trigger, 'pointerenter', enter), R.on(trigger, 'pointerleave', leave),
        R.on(content, 'pointerenter', enter), R.on(content, 'pointerleave', leave),
        R.on(trigger, 'focusin', function () { var fv = false; try { fv = trigger.matches(':focus-visible') || !!trigger.querySelector(':focus-visible'); } catch (x) {} if (fv) { clearTimeout(t); t = setTimeout(open, 200); } }),
        R.on(el, 'focusout', function (e) { if (!(e.relatedTarget && (el.contains(e.relatedTarget) || content.contains(e.relatedTarget)))) { clearTimeout(t); t = setTimeout(close, 100); } })
      ];
      el.__hoverCard = { open: open, close: close };
      return function () { clearTimeout(t); if (h) h.close('destroy'); offs.forEach(function (f) { f(); }); };
    }
  });
})(window.Ranj);

;
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

;
/*!
 * Ranj UI — navbar: hamburger panel (Escape / outside / link click closes), hover pill that glides
 * between links, data-scrolled once the page (or nearest scroll container) scrolls past data-offset (8px).
 * Events: ranj:open / ranj:close on .navbar.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document, w = window;

  function scrollParent(el) {
    for (var n = el.parentElement; n && n !== d.body && n !== d.documentElement; n = n.parentElement) {
      var s = getComputedStyle(n).overflowY;
      if ((s === 'auto' || s === 'scroll') && n.scrollHeight > n.clientHeight) return n;
    }
    return w;
  }

  R.define('navbar', {
    selector: '.navbar',
    mount: function (nav) {
      var toggle = nav.querySelector('.navbar-toggle'), panel = nav.querySelector('.navbar-mobile');
      var links = nav.querySelector('.navbar-nav');
      var offs = [], pop = null, outside = null;
      var o = R.opts(nav, { offset: 8 });

      // hover pill
      if (links && !links.querySelector('.navbar-hover') && !nav.hasAttribute('data-no-hover')) {
        var pill = d.createElement('span'); pill.className = 'navbar-hover'; pill.setAttribute('aria-hidden', 'true');
        links.insertBefore(pill, links.firstChild);
        offs.push(R.on(links, 'pointerover', function (e) {
          var a = e.target.closest('.navbar-link'); if (!a || e.pointerType === 'touch') return;
          links.style.setProperty('--hx', a.offsetLeft + 'px'); links.style.setProperty('--hw', a.offsetWidth + 'px');
          if (links.hasAttribute('data-hovering')) links.setAttribute('data-moved', '');
          links.setAttribute('data-hovering', '');
        }), R.on(links, 'pointerleave', function () { links.removeAttribute('data-hovering'); links.removeAttribute('data-moved'); }));
      }

      function setOpen(open) {
        if (!toggle || !panel) return;
        if (open === nav.hasAttribute('data-open')) return;
        toggle.setAttribute('aria-expanded', String(open));
        if (open) {
          panel.removeAttribute('data-closing');
          R.$$(':scope > *', panel).forEach(function (c, i) { c.style.setProperty('--i', i); });
          nav.setAttribute('data-open', '');
          pop = R.pushLayer(function () { setOpen(false); toggle.focus(); });
          outside = R.onOutside([nav], function () { setOpen(false); });
          R.emit(nav, 'open', {});
        } else {
          nav.removeAttribute('data-open');
          panel.setAttribute('data-closing', '');
          K.afterAnim(panel, function () { panel.removeAttribute('data-closing'); }, 300);
          if (pop) pop(); if (outside) outside(); pop = outside = null;
          R.emit(nav, 'close', {});
        }
      }
      if (toggle) {
        if (!toggle.querySelector('span')) toggle.innerHTML = '<span></span><span></span>';
        toggle.setAttribute('aria-expanded', 'false');
        if (!toggle.getAttribute('aria-label')) toggle.setAttribute('aria-label', 'Menu');
        if (panel) toggle.setAttribute('aria-controls', R.ensureId(panel, 'nav'));
        offs.push(R.on(toggle, 'click', function () { setOpen(!nav.hasAttribute('data-open')); }));
      }
      if (panel) offs.push(R.on(panel, 'click', 'a,[data-navbar-close]', function () { setOpen(false); }));

      // scrolled state
      var sp = scrollParent(nav), raf = 0;
      function onScroll() {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var y = sp === w ? w.scrollY : sp.scrollTop;
          if (y > o.offset) nav.setAttribute('data-scrolled', ''); else nav.removeAttribute('data-scrolled');
        });
      }
      sp.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      // close the mobile panel if the navbar grows past the breakpoint
      var ro = w.ResizeObserver ? new ResizeObserver(function () { if (nav.hasAttribute('data-open') && toggle && getComputedStyle(toggle).display === 'none') setOpen(false); }) : null;
      if (ro) ro.observe(nav);
      return function () { setOpen(false); offs.forEach(function (f) { f(); }); sp.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); if (ro) ro.disconnect(); };
    }
  });
})(window.Ranj);

;
/*!
 * Ranj UI — navigation menu (mega menu).
 * <nav class="nav-menu"><ul class="nav-menu-list"><li class="nav-menu-item"><button class="nav-menu-trigger">Products</button>
 *   <div class="nav-menu-content">…</div></li><li class="nav-menu-item"><a class="nav-menu-link" href="…">Pricing</a></li></ul></nav>
 * Opens on hover (data-delay 120ms) or click; the shared viewport morphs between panels and content slides in the
 * direction of travel. ← → move between items, ↓ / Enter opens and focuses the panel, Esc closes.
 * Events: ranj:change { value, open } on .nav-menu.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document, w = window;

  R.define('navigation-menu', {
    selector: '.nav-menu',
    mount: function (nav) {
      var list = nav.querySelector('.nav-menu-list'); if (!list) return;
      var o = R.opts(nav, { delay: 120, closeDelay: 260 });
      var items = R.$$(':scope > .nav-menu-item', list);
      var triggers = [], contents = [];
      var vp = d.createElement('div'); vp.className = 'nav-menu-viewport';
      var ind = d.createElement('span'); ind.className = 'nav-menu-indicator'; ind.setAttribute('aria-hidden', 'true');
      list.appendChild(ind);
      nav.appendChild(vp);
      items.forEach(function (it) {
        var t = it.querySelector(':scope > .nav-menu-trigger'), c = it.querySelector(':scope > .nav-menu-content');
        if (t && c) {
          triggers.push(t); contents.push(c);
          if (t.tagName === 'BUTTON' && !t.getAttribute('type')) t.setAttribute('type', 'button');
          t.setAttribute('aria-expanded', 'false');
          t.setAttribute('aria-controls', R.ensureId(c, 'navm'));
          c.__trigger = t; c.__home = it;
          vp.appendChild(c);
        }
      });
      var tops = R.$$(':scope > .nav-menu-item > .nav-menu-trigger, :scope > .nav-menu-item > .nav-menu-link', list);
      var active = null, openT = 0, closeT = 0, stopOut = null, pop = null, rafPos = 0;

      function anchorFor(t) {
        return { getBoundingClientRect: function () {
          var lr = list.getBoundingClientRect(), tr = t.getBoundingClientRect();
          var x = nav.getAttribute('data-align') === 'center' ? lr.left + lr.width / 2 - vp.offsetWidth / 2 : tr.left - 8;
          return { left: x, right: x, top: lr.top, bottom: lr.bottom, width: 0, height: lr.height };
        } };
      }
      function size(c) { vp.style.setProperty('--vw', c.offsetWidth + 'px'); vp.style.setProperty('--vh', c.offsetHeight + 'px'); }
      function place(instant) {
        if (!active) return;
        if (instant) vp.setAttribute('data-instant', '');
        K.place(vp, anchorFor(active), { placement: 'bottom-start', offset: 8, flip: false });
        var tr = active.getBoundingClientRect(), lr = list.getBoundingClientRect();
        list.style.setProperty('--ix', (tr.left - lr.left + tr.width / 2 - 6) + 'px');
        if (instant) { void vp.offsetWidth; vp.removeAttribute('data-instant'); }
      }
      function onScroll() { if (!rafPos) rafPos = requestAnimationFrame(function () { rafPos = 0; place(true); }); }

      function open(t, focusFirst) {
        clearTimeout(openT); clearTimeout(closeT);
        var i = triggers.indexOf(t); if (i < 0) return;
        var c = contents[i];
        if (active === t) { if (focusFirst) { var f0 = R.focusables(c)[0]; if (f0) f0.focus(); } return; }
        var prevI = active ? triggers.indexOf(active) : -1, prevC = prevI > -1 ? contents[prevI] : null;
        var wasOpen = !!active;
        if (active) active.setAttribute('aria-expanded', 'false');
        active = t;
        t.setAttribute('aria-expanded', 'true');
        if (prevC) {
          prevC.removeAttribute('data-active');
          prevC.setAttribute('data-leaving', '');
          prevC.setAttribute('data-motion', i > prevI ? 'to-start' : 'to-end');
          setTimeout(function () { if (!prevC.hasAttribute('data-active')) { prevC.removeAttribute('data-leaving'); prevC.removeAttribute('data-motion'); } }, 320);
        }
        c.removeAttribute('data-leaving');
        c.setAttribute('data-active', '');
        c.setAttribute('data-motion', wasOpen ? (i > prevI ? 'from-end' : 'from-start') : '');
        if (!wasOpen) {
          nav.setAttribute('data-open', '');
          nav.removeAttribute('data-moved');
          K.show(vp, function () { size(c); place(true); });
          stopOut = R.onOutside([nav], function () { close(); });
          pop = R.pushLayer(function () { var a = active; close(); if (a) a.focus(); });
          w.addEventListener('scroll', onScroll, true); w.addEventListener('resize', onScroll);
        } else { nav.setAttribute('data-moved', ''); size(c); place(false); }
        if (focusFirst) setTimeout(function () { var f = R.focusables(c)[0]; if (f) f.focus(); }, 30);
        R.emit(nav, 'change', { value: t.textContent.trim(), open: true });
      }
      function close() {
        clearTimeout(openT); clearTimeout(closeT);
        if (!active) return;
        var i = triggers.indexOf(active), c = contents[i];
        active.setAttribute('aria-expanded', 'false');
        active = null;
        nav.removeAttribute('data-open');
        if (stopOut) stopOut(); if (pop) pop(); stopOut = pop = null;
        w.removeEventListener('scroll', onScroll, true); w.removeEventListener('resize', onScroll);
        K.hide(vp, function () { if (c) { c.removeAttribute('data-active'); c.removeAttribute('data-motion'); } });
        R.emit(nav, 'change', { value: null, open: false });
      }

      var offs = [
        R.on(list, 'pointerover', function (e) {
          if (e.pointerType === 'touch') return;
          var t = e.target.closest('.nav-menu-trigger,.nav-menu-link'); if (!t || !list.contains(t)) return;
          clearTimeout(closeT); clearTimeout(openT);
          if (t.classList.contains('nav-menu-link')) { if (active) closeT = setTimeout(close, 150); return; }
          if (active) open(t); else openT = setTimeout(function () { open(t); }, o.delay);
        }),
        R.on(nav, 'pointerleave', function (e) { if (e.pointerType === 'touch') return; clearTimeout(openT); closeT = setTimeout(close, o.closeDelay); }),
        R.on(nav, 'pointerenter', function () { clearTimeout(closeT); }),
        R.on(list, 'click', '.nav-menu-trigger', function (e, t) {
          clearTimeout(openT);
          if (active === t && (e.detail === 0 || performance.now() - (t.__opened || 0) > 400)) close();
          else { open(t, e.detail === 0); t.__opened = performance.now(); }
        }),
        R.on(list, 'keydown', function (e) {
          var t = e.target.closest('.nav-menu-trigger,.nav-menu-link'); if (!t) return;
          var i = tops.indexOf(t);
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            var n = tops[(i + (e.key === 'ArrowRight' ? 1 : -1) + tops.length) % tops.length];
            n.focus();
            if (active && n.classList.contains('nav-menu-trigger')) open(n); else if (active) close();
          } else if (e.key === 'ArrowDown' && t.classList.contains('nav-menu-trigger')) { e.preventDefault(); open(t, true); }
          else if (e.key === 'Tab' && !e.shiftKey && active === t) {
            var f = R.focusables(contents[triggers.indexOf(t)])[0]; if (f) { e.preventDefault(); f.focus(); }
          }
        }),
        R.on(vp, 'keydown', function (e) {
          if (e.key !== 'Tab' || !active) return;
          var c = contents[triggers.indexOf(active)], f = R.focusables(c);
          if (!e.shiftKey && d.activeElement === f[f.length - 1]) { e.preventDefault(); var i = tops.indexOf(active), n = tops[i + 1]; close(); if (n) n.focus(); else tops[i].focus(); }
          else if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); active.focus(); }
        }),
        R.on(vp, 'click', 'a', function () { close(); })
      ];
      return function () {
        close(); offs.forEach(function (f) { f(); });
        contents.forEach(function (c) { if (c.__home) c.__home.appendChild(c); });
        vp.remove(); ind.remove(); cancelAnimationFrame(rafPos);
      };
    }
  });
})(window.Ranj);

;
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

;
/*!
 * Ranj UI — popover.
 * <div class="popover" data-placement="bottom" data-arrow><button data-popover-trigger>…</button><div class="popover-content">…</div></div>
 * Standalone: <button data-popover-target="pid">…</button> … <div class="popover-content" id="pid">…</div>
 * Events: ranj:open / ranj:close on the .popover (or the trigger when standalone).
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;

  R.define('popover', {
    selector: '.popover,[data-popover-target]',
    mount: function (el) {
      var standalone = el.hasAttribute('data-popover-target');
      var trigger = standalone ? el : el.querySelector('[data-popover-trigger]');
      var content = standalone ? d.getElementById(el.getAttribute('data-popover-target')) : el.querySelector('.popover-content');
      if (!trigger || !content) return;
      var host = standalone ? trigger : el;
      var o = R.opts(host, { placement: 'bottom', offset: 8, arrow: false, trigger: 'click', openDelay: 120, closeDelay: 200 });
      var h = null, kb = false, timer = 0;
      if (o.arrow || host.hasAttribute('data-arrow')) K.arrow(content);
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', R.ensureId(content, 'pop'));
      if (!content.getAttribute('role')) content.setAttribute('role', 'dialog');
      if (!content.hasAttribute('tabindex')) content.setAttribute('tabindex', '-1');

      function open() {
        if (h) return;
        host.setAttribute('data-state', 'open');
        trigger.setAttribute('aria-expanded', 'true');
        h = K.float(content, trigger, {
          placement: o.placement, offset: o.offset, ignore: [trigger],
          onClose: function (reason) {
            var had = content.contains(d.activeElement);
            h = null;
            host.setAttribute('data-state', 'closed');
            trigger.setAttribute('aria-expanded', 'false');
            if (reason === 'escape' || (had && reason !== 'outside' && reason !== 'blur')) try { trigger.focus({ preventScroll: true }); } catch (x) {}
            R.emit(host, 'close', { reason: reason });
          }
        });
        if (o.trigger === 'click') {
          var f = content.querySelector('[autofocus],[data-autofocus]') || (kb ? R.focusables(content)[0] : null);
          setTimeout(function () { try { (f || content).focus({ preventScroll: true }); } catch (x) {} }, 0);
        }
        R.emit(host, 'open', {});
      }
      function close(reason) { if (h) h.close(reason || 'api'); }
      function toggle() { if (h) close('trigger'); else open(); }

      var offs = [];
      if (o.trigger === 'hover') {
        var enter = function (e) { if (e.pointerType === 'touch') return; clearTimeout(timer); timer = setTimeout(open, o.openDelay); };
        var leave = function (e) { if (e.pointerType === 'touch') return; clearTimeout(timer); timer = setTimeout(function () { close('hover'); }, o.closeDelay); };
        [trigger, content].forEach(function (n) { offs.push(R.on(n, 'pointerenter', enter), R.on(n, 'pointerleave', leave)); });
        offs.push(R.on(trigger, 'focus', open), R.on(trigger, 'click', function (e) { if (e.pointerType === 'touch' || e.detail === 0) toggle(); }));
      } else {
        offs.push(R.on(trigger, 'click', function (e) { e.preventDefault(); kb = e.detail === 0; toggle(); }));
      }
      offs.push(R.on(content, 'click', '[data-popover-close],.popover-close', function () { close('button'); }));
      offs.push(R.on(content, 'focusout', function (e) {
        var to = e.relatedTarget;
        if (h && to && !content.contains(to) && !trigger.contains(to)) close('blur');
      }));
      el.__popover = { open: open, close: close, toggle: toggle };
      return function () { clearTimeout(timer); close('destroy'); offs.forEach(function (f) { f(); }); };
    }
  });

  function inst(x) { var el = typeof x === 'string' ? d.getElementById(x) : x; return el && el.__popover; }
  R.popover = {
    open: function (x) { var i = inst(x); if (i) i.open(); },
    close: function (x) { var i = inst(x); if (i) i.close(); },
    toggle: function (x) { var i = inst(x); if (i) i.toggle(); }
  };
})(window.Ranj);

;
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

;
/*!
 * Ranj UI — stepper.
 * <ol class="stepper" id="s" data-current="1" data-clickable><li class="stepper-item"><span class="stepper-indicator"></span>
 *   <div class="stepper-text"><b class="stepper-title">Account</b><span class="stepper-desc">…</span></div></li>…</ol>
 * States are derived from data-current (0-based): before → complete, at → current, after → upcoming.
 * data-clickable: click/Enter on completed steps (data-clickable="all": any step) to jump back.
 * Buttons: [data-stepper-next="id"] / [data-stepper-prev="id"]. Panels: [data-step-panel="n"] inside [data-stepper-panels="id"].
 * API: Ranj.stepper(el).next() / prev() / go(i) / error(i). Events: ranj:change { index, total, done }.
 */
(function (R) {
  'use strict';
  var d = document;

  R.define('stepper', {
    selector: '.stepper',
    setup: function () {
      R.on(d, 'click', '[data-stepper-next],[data-stepper-prev]', function (e, b) {
        var id = b.getAttribute('data-stepper-next') || b.getAttribute('data-stepper-prev');
        var el = d.getElementById(id); if (!el || !el.__stepper) return;
        if (b.hasAttribute('data-stepper-next')) el.__stepper.next(); else el.__stepper.prev();
      });
    },
    mount: function (el) {
      var clickable = el.getAttribute('data-clickable');
      function items() { return R.$$(':scope > .stepper-item', el); }
      var cur = R.clamp(parseInt(el.getAttribute('data-current'), 10) || 0, 0, items().length);
      var errors = {};
      el.setAttribute('role', 'list');
      items().forEach(function (it, i) {
        it.setAttribute('role', 'listitem');
        if (clickable !== null) { it.setAttribute('data-clickable', ''); it.setAttribute('tabindex', '-1'); }
      });
      function render(silent) {
        var n = items().length;
        items().forEach(function (it, i) {
          var st = errors[i] ? 'error' : i < cur ? 'complete' : i === cur ? 'current' : 'upcoming';
          it.setAttribute('data-state', st);
          if (i === cur) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
          if (clickable !== null) {
            var can = clickable === 'all' || i < cur;
            it.setAttribute('tabindex', can || i === cur ? '0' : '-1');
            it.setAttribute('aria-disabled', String(!can && i !== cur));
          }
          var t = it.querySelector('.stepper-title');
          var lbl = (t ? t.textContent.trim() : 'Step ' + (i + 1)) + ', ' + (st === 'complete' ? 'completed' : st === 'current' ? 'current step' : st === 'error' ? 'has an error' : 'not started');
          it.setAttribute('aria-label', 'Step ' + (i + 1) + ' of ' + n + ': ' + lbl);
        });
        el.setAttribute('data-current', cur);
        R.$$('[data-stepper-panels="' + el.id + '"] [data-step-panel]').forEach(function (p) { p.hidden = +p.getAttribute('data-step-panel') !== cur; });
        R.$$('[data-stepper-prev="' + el.id + '"]').forEach(function (b) { b.disabled = cur <= 0; });
        R.$$('[data-stepper-next="' + el.id + '"]').forEach(function (b) {
          b.disabled = cur >= n;
          var last = b.getAttribute('data-last-label'), lab = b.querySelector('[data-label]') || b;
          if (last) { if (!b.__lbl) b.__lbl = lab.textContent; lab.textContent = cur >= n - 1 ? last : b.__lbl; }
        });
        if (!silent) R.emit(el, 'change', { index: cur, total: n, done: cur >= n });
      }
      function go(i) { cur = R.clamp(i, 0, items().length); render(); }
      var api = {
        next: function () { delete errors[cur]; go(cur + 1); }, prev: function () { go(cur - 1); }, go: go,
        error: function (i, on) { if (on === false) delete errors[i]; else errors[i == null ? cur : i] = true; render(); },
        get index() { return cur; }
      };
      el.__stepper = api;
      render(true);
      var offs = [];
      if (clickable !== null) {
        offs.push(R.on(el, 'click', '.stepper-item', function (e, it) { var i = items().indexOf(it); if (clickable === 'all' || i < cur) go(i); }));
        offs.push(R.on(el, 'keydown', '.stepper-item', function (e, it) {
          var i = items().indexOf(it);
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (clickable === 'all' || i < cur) go(i); }
          else if (/Arrow(Right|Down|Left|Up)/.test(e.key)) {
            e.preventDefault();
            var dir = /Right|Down/.test(e.key) ? 1 : -1, is = items(), j = i + dir;
            while (j >= 0 && j < is.length && is[j].getAttribute('tabindex') === '-1') j += dir;
            if (is[j]) is[j].focus();
          }
        }));
      }
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  R.stepper = function (el) { el = typeof el === 'string' ? d.getElementById(el) || d.querySelector(el) : el; return el && el.__stepper; };
})(window.Ranj);

;
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

;
/*!
 * Ranj UI — toast (Sonner-style).
 *   Ranj.toast('Saved')                                     → id
 *   Ranj.toast({ title, description, type, duration, position, action: { label, onClick }, cancel, closeButton, rich, progress, icon, html })
 *   Ranj.toast.success / error / warning / info / loading (title, opts)
 *   Ranj.toast.promise(promise, { loading, success, error })  (success/error may be functions of the value/error)
 *   Ranj.toast.update(id, opts) · Ranj.toast.dismiss(id?) · Ranj.toast.config({ position, duration, visible, gap, rich, closeButton, expand })
 * Declarative: <button data-toast="Saved" data-toast-type="success" data-toast-description="…" data-toast-position="top-center">
 * Hover expands the stack and pauses timers; swipe sideways to dismiss; Alt+T focuses the newest toast.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var cfg = { position: 'bottom-right', duration: 4000, visible: 3, gap: 14, rich: false, closeButton: false, expand: false, progress: true, max: 8 };
  var boxes = {}, all = {}, seq = 0;
  var POS = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
  var TYPES = { success: 'success', error: 'error', destructive: 'error', danger: 'error', warning: 'warning', info: 'info', loading: 'loading', default: 'default' };

  function box(pos) {
    if (POS.indexOf(pos) < 0) pos = cfg.position;
    var b = boxes[pos];
    if (b && b.el.isConnected) return b;
    var el = d.createElement('section');
    el.className = 'toaster';
    el.setAttribute('data-position', pos);
    el.setAttribute('aria-label', 'Notifications (Alt+T)');
    el.setAttribute('tabindex', '-1');
    el.innerHTML = '<ol class="toaster-list" aria-live="polite" aria-relevant="additions text"></ol>';
    d.body.appendChild(el);
    b = boxes[pos] = { el: el, list: el.firstChild, items: [], pos: pos, hover: false, focus: false };
    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'touch') return; b.hover = true; sync(b); });
    el.addEventListener('pointerleave', function (e) { if (b.swiping) return; b.hover = false; sync(b); });
    el.addEventListener('focusin', function () { b.focus = true; sync(b); });
    el.addEventListener('focusout', function (e) { if (!el.contains(e.relatedTarget)) { b.focus = false; sync(b); } });
    return b;
  }

  function norm(a, b) {
    var o = typeof a === 'string' ? { title: a } : Object.assign({}, a || {});
    if (b) Object.assign(o, b);
    if (o.variant && !o.type) o.type = o.variant;
    o.type = TYPES[o.type] || 'default';
    if (o.message && !o.title) o.title = o.message;
    return o;
  }
  function txt(o, k) { var v = o[k]; if (v == null || v === '') return ''; return o.html ? String(v) : R.esc(v); }

  function iconFor(o) {
    if (o.icon === false) return '';
    if (o.icon) return '<div class="toast-icon">' + o.icon + '</div>';
    if (o.avatar) return '<img class="toast-avatar" src="' + R.esc(o.avatar) + '" alt="">';
    if (o.type === 'loading') return '<div class="toast-icon" aria-hidden="true"><span class="toast-spinner"></span></div>';
    var m = { success: K.icon.success, error: K.icon.error, warning: K.icon.warning, info: K.icon.infoFill }[o.type];
    return m ? '<div class="toast-icon">' + m + '</div>' : '';
  }
  function paint(t) {
    var o = t.o, el = t.el;
    el.className = 'toast toast-' + o.type + ((o.rich != null ? o.rich : cfg.rich) ? ' toast-rich' : '') + (o.className ? ' ' + o.className : '');
    el.setAttribute('data-type', o.type);
    el.setAttribute('role', o.type === 'error' ? 'alert' : 'status');
    var dur = duration(o);
    el.innerHTML = iconFor(o) +
      '<div class="toast-content">' + (o.title ? '<div class="toast-title">' + txt(o, 'title') + '</div>' : '') +
      (o.description ? '<div class="toast-description">' + txt(o, 'description') + '</div>' : '') + '</div>' +
      ((o.action || o.cancel) ? '<div class="toast-actions">' +
        (o.cancel ? '<button type="button" class="toast-cancel" data-toast-cancel>' + R.esc(o.cancel.label || 'Cancel') + '</button>' : '') +
        (o.action ? '<button type="button" class="toast-action" data-toast-action>' + R.esc(o.action.label || 'Undo') + '</button>' : '') + '</div>' : '') +
      (o.dismissible === false ? '' : '<button type="button" class="toast-close" aria-label="Close notification" data-toast-close>' + K.icon.x + '</button>') +
      ((o.progress != null ? o.progress : cfg.progress) && isFinite(dur) && dur > 0 ? '<div class="toast-progress" aria-hidden="true"><span style="--toast-dur:' + dur + 'ms"></span></div>' : '');
    if (o.closeButton || cfg.closeButton) el.querySelector('.toast-close') && el.querySelector('.toast-close').style.setProperty('opacity', '1');
  }
  function duration(o) { return o.duration != null ? o.duration : o.type === 'loading' ? Infinity : cfg.duration; }
  function measure(t) {
    var el = t.el, prev = el.style.height;
    el.style.height = 'auto';
    var h = el.getBoundingClientRect().height / (t.scale || 1);
    el.style.height = prev;
    t.h = Math.round(el.offsetHeight || h);
  }

  function layout(b) {
    var live = b.items.filter(function (t) { return !t.removed; });
    var expanded = cfg.expand || b.hover || b.focus || b.swiping;
    var gap = cfg.gap, off = 0, frontH = live[0] ? live[0].h : 0;
    b.items.forEach(function (t) {
      var i = live.indexOf(t);
      if (i < 0) return;
      t.el.style.setProperty('--i', i);
      t.el.style.setProperty('--offset', off + 'px');
      t.el.style.setProperty('--h', t.h + 'px');
      if (i === 0) t.el.setAttribute('data-front', ''); else t.el.removeAttribute('data-front');
      if (i >= cfg.visible) t.el.setAttribute('data-hidden', ''); else t.el.removeAttribute('data-hidden');
      off += t.h + gap;
    });
    var vis = Math.min(live.length, cfg.visible);
    var hh = !live.length ? 0 : expanded ? off - gap : frontH + (vis - 1) * 14;
    b.el.style.setProperty('--toaster-h', hh + 'px');
    b.el.style.setProperty('--front-h', frontH + 'px');
    b.el.style.setProperty('--toast-gap', gap + 'px');
    if (expanded && live.length) b.el.setAttribute('data-expanded', ''); else b.el.removeAttribute('data-expanded');
  }
  function sync(b) {
    var paused = b.hover || b.focus || b.swiping || d.hidden;
    if (paused) b.el.setAttribute('data-paused', ''); else b.el.removeAttribute('data-paused');
    b.items.forEach(function (t) { if (paused) pause(t); else resume(t); });
    layout(b);
  }
  function pause(t) { if (t.timer) { clearTimeout(t.timer); t.timer = 0; t.left -= performance.now() - t.start; } }
  function resume(t) {
    if (t.removed || t.timer || !isFinite(t.left)) return;
    t.start = performance.now();
    t.timer = setTimeout(function () { t.timer = 0; dismiss(t.id, 'timeout'); }, Math.max(0, t.left));
  }

  function create(o) {
    var id = o.id != null ? String(o.id) : 'toast-' + (++seq);
    if (all[id] && !all[id].removed) return update(id, o);
    var b = box(o.position || cfg.position);
    var el = d.createElement('li');
    el.setAttribute('data-mounted', 'false');
    el.setAttribute('tabindex', '0');
    el.id = id;
    var t = all[id] = { id: id, o: o, el: el, b: b, h: 0, left: duration(o), timer: 0, start: 0, removed: false };
    paint(t);
    b.list.insertBefore(el, b.list.firstChild);
    b.items.unshift(t);
    measure(t);
    bind(t);
    // overflow: retire the oldest
    var live = b.items.filter(function (x) { return !x.removed; });
    if (live.length > cfg.max) dismiss(live[live.length - 1].id, 'overflow');
    layout(b);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.setAttribute('data-mounted', 'true'); }); });
    if (b.hover || b.focus || d.hidden) b.el.setAttribute('data-paused', ''); else resume(t);
    return id;
  }

  function update(id, patch) {
    var t = all[id]; if (!t || t.removed) return id;
    var p = typeof patch === 'string' ? { title: patch } : Object.assign({}, patch || {});
    if (p.variant && !p.type) p.type = p.variant;
    if (p.type) p.type = TYPES[p.type] || 'default';
    t.o = Object.assign({}, t.o, p);
    paint(t);
    measure(t);
    pause(t);
    t.left = duration(t.o);
    if (!t.b.el.hasAttribute('data-paused')) resume(t);
    layout(t.b);
    return id;
  }

  function dismiss(id, reason) {
    if (id == null) { Object.keys(all).forEach(function (k) { dismiss(k, reason || 'api'); }); return; }
    var t = all[id]; if (!t || t.removed) return;
    t.removed = true;
    clearTimeout(t.timer); t.timer = 0;
    t.el.setAttribute('data-removed', '');
    layout(t.b);
    if (reason === 'timeout' && t.o.onAutoClose) t.o.onAutoClose(id);
    if (t.o.onDismiss) t.o.onDismiss(id, reason);
    R.emit(t.b.el, 'toastdismiss', { id: id, reason: reason });
    setTimeout(function () {
      if (t.el.parentNode) t.el.parentNode.removeChild(t.el);
      var i = t.b.items.indexOf(t); if (i > -1) t.b.items.splice(i, 1);
      if (all[id] === t) delete all[id];
      if (!t.b.items.length) { t.b.hover = false; t.b.focus = false; t.b.swiping = false; }
      layout(t.b);
    }, reason === 'swipe' ? 260 : 400);
  }

  function bind(t) {
    var el = t.el, sw = null;
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-toast-close]')) { dismiss(t.id, 'close'); return; }
      var a = e.target.closest('[data-toast-action]'), c = e.target.closest('[data-toast-cancel]');
      if (a && t.o.action) { var r = t.o.action.onClick && t.o.action.onClick(e, t.id); if (r !== false && !e.defaultPrevented) dismiss(t.id, 'action'); }
      else if (c) { if (t.o.cancel && t.o.cancel.onClick) t.o.cancel.onClick(e, t.id); dismiss(t.id, 'cancel'); }
      else if (t.o.onClick) t.o.onClick(e, t.id);
    });
    el.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Delete' || e.key === 'Backspace') && e.target === el && t.o.dismissible !== false) { e.preventDefault(); e.stopPropagation(); var nx = el.nextElementSibling || el.previousElementSibling; dismiss(t.id, 'keyboard'); if (nx) nx.focus(); }
    });
    el.addEventListener('pointerdown', function (e) {
      if (t.o.dismissible === false || e.button !== 0 || e.target.closest('button,a,input')) return;
      sw = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, on: false };
    });
    el.addEventListener('pointermove', function (e) {
      if (!sw || e.pointerId !== sw.id) return;
      var dx = e.clientX - sw.x;
      if (!sw.on) {
        if (Math.abs(dx) < 4) return;
        if (Math.abs(e.clientY - sw.y) > Math.abs(dx)) { sw = null; return; }
        sw.on = true; t.b.swiping = true; el.setAttribute('data-swiping', '');
        try { el.setPointerCapture(e.pointerId); } catch (x) {}
        sync(t.b);
      }
      sw.dx = dx;
      el.style.setProperty('--sx', dx + 'px');
      el.style.opacity = String(R.clamp(1 - Math.abs(dx) / (el.offsetWidth * 1.1), .25, 1));
    });
    function end(e) {
      if (!sw || (e.pointerId !== sw.id)) { sw = null; return; }
      var s = sw; sw = null;
      if (!s.on) return;
      el.removeAttribute('data-swiping');
      t.b.swiping = false;
      var dx = s.dx || 0, v = Math.abs(dx) / Math.max(1, performance.now() - s.t);
      el.style.opacity = '';
      if (Math.abs(dx) > Math.min(90, el.offsetWidth * .35) || v > .45) {
        el.style.setProperty('--swipe-end', (dx > 0 ? 1 : -1) * (el.offsetWidth + 60) + 'px');
        el.setAttribute('data-swipe-out', '');
        dismiss(t.id, 'swipe');
      } else el.style.setProperty('--sx', '0px');
      var r = t.b.el.getBoundingClientRect();
      t.b.hover = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom && e.pointerType !== 'touch';
      sync(t.b);
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }

  var toast = function (a, b) { return create(norm(a, b)); };
  ['success', 'error', 'warning', 'info', 'loading'].forEach(function (k) {
    toast[k] = function (a, b) { var o = norm(a, b); o.type = k; return create(o); };
  });
  toast.message = function (a, b) { return create(norm(a, b)); };
  toast.custom = function (html, o) { o = Object.assign({ html: true, icon: false }, o || {}); o.title = html; return create(norm(o)); };
  toast.update = function (id, o) { return update(id, o); };
  toast.dismiss = function (id) { dismiss(id, 'api'); };
  toast.config = function (o) { Object.assign(cfg, o || {}); Object.keys(boxes).forEach(function (k) { layout(boxes[k]); }); return Object.assign({}, cfg); };
  toast.promise = function (p, m) {
    m = m || {};
    if (typeof p === 'function') p = p();
    var first = m.loading == null ? 'Loading…' : m.loading;
    var id = create(Object.assign(norm(first, { position: m.position, description: m.description }), { type: 'loading' }));
    function resolveMsg(x, v) { x = typeof x === 'function' ? x(v) : x; return typeof x === 'string' ? { title: x, description: '' } : (x || {}); }
    Promise.resolve(p).then(function (v) {
      var o = resolveMsg(m.success == null ? 'Done' : m.success, v); o.type = 'success'; if (!('description' in o)) o.description = '';
      update(id, o);
    }, function (er) {
      var o = resolveMsg(m.error == null ? 'Something went wrong' : m.error, er); o.type = 'error'; if (!('description' in o)) o.description = '';
      update(id, o);
    });
    return p;
  };
  R.toast = toast;

  R.define('toast', {
    setup: function () {
      R.on(d, 'click', '[data-toast]', function (e, el) {
        var o = { title: el.getAttribute('data-toast'), description: el.getAttribute('data-toast-description') || undefined, type: el.getAttribute('data-toast-type') || undefined };
        if (el.hasAttribute('data-toast-position')) o.position = el.getAttribute('data-toast-position');
        if (el.hasAttribute('data-toast-duration')) o.duration = parseFloat(el.getAttribute('data-toast-duration'));
        toast(o);
      });
      d.addEventListener('keydown', function (e) {
        if (e.altKey && (e.code === 'KeyT')) {
          var b = Object.keys(boxes).map(function (k) { return boxes[k]; }).filter(function (x) { return x.items.some(function (t) { return !t.removed; }); })[0];
          if (b) { e.preventDefault(); var f = b.list.querySelector('.toast:not([data-removed])'); if (f) f.focus(); }
        }
      });
      d.addEventListener('visibilitychange', function () { Object.keys(boxes).forEach(function (k) { sync(boxes[k]); }); });
    }
  });
})(window.Ranj);

;
/*!
 * Ranj UI — tooltip. Works on ANY element with no extra markup:
 *   <button data-tooltip="Save" data-tooltip-kbd="⌘ S" data-tooltip-placement="bottom">…</button>
 * Rich:   <span class="tooltip" data-placement="right"><button>…</button><div class="tooltip-content tooltip-rich">…</div></span>
 * Options (attributes on the trigger): data-tooltip-placement, data-tooltip-delay (ms, 400), data-tooltip-kbd,
 *   data-tooltip-variant="primary|rich", data-tooltip-arrow="false". Changing data-tooltip while open updates it live.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var SEL = '[data-tooltip],.tooltip';
  var tip = null, cur = null, fl = null, stop = null, pop = null, mo = null;
  var showTimer = 0, hideTimer = 0, lastClose = 0, suppressed = null;

  function single() {
    if (!tip) {
      tip = d.createElement('div');
      tip.className = 'tooltip-content';
      tip.id = 'ranj-tooltip';
      tip.setAttribute('role', 'tooltip');
    }
    if (!tip.isConnected) d.body.appendChild(tip);
    return tip;
  }
  function richOf(t) { return t.classList.contains('tooltip') ? t.querySelector(':scope > .tooltip-content') : null; }
  function fill(t, el) {
    var txt = t.getAttribute('data-tooltip') || t.getAttribute('aria-label') || '';
    var kbd = t.getAttribute('data-tooltip-kbd');
    el.className = 'tooltip-content' + (t.getAttribute('data-tooltip-variant') ? ' tooltip-' + t.getAttribute('data-tooltip-variant') : '');
    el.innerHTML = R.esc(txt) + (kbd ? '<span class="tooltip-kbd">' + kbd.split(/\s+/).map(function (k) { return '<kbd>' + R.esc(k) + '</kbd>'; }).join('') + '</span>' : '');
    if (t.getAttribute('data-tooltip-arrow') !== 'false') K.arrow(el);
  }
  function placement(t) {
    return t.getAttribute('data-tooltip-placement') || (t.classList.contains('tooltip') && t.getAttribute('data-placement')) ||
      (t.classList.contains('tooltip-bottom') ? 'bottom' : t.classList.contains('tooltip-left') ? 'left' : t.classList.contains('tooltip-right') ? 'right' : 'top');
  }

  function show(t) {
    clearTimeout(showTimer); clearTimeout(hideTimer);
    if (cur === t) return;
    if (cur) hide(true);
    var rich = richOf(t);
    if (!rich && !t.getAttribute('data-tooltip')) return;
    cur = t;
    fl = rich || single();
    if (rich) { if (!fl.getAttribute('role')) fl.setAttribute('role', 'tooltip'); R.ensureId(fl, 'tip'); if (t.getAttribute('data-arrow') !== 'false') K.arrow(fl); }
    else fill(t, fl);
    var anchor = rich ? (t.firstElementChild !== rich ? t.firstElementChild : t) : t;
    var po = { placement: placement(t), offset: parseFloat(t.getAttribute('data-tooltip-offset')) || 7 };
    K.show(fl, function () { K.place(fl, anchor, po); });
    stop = K.autoPlace(fl, anchor, po);
    pop = R.pushLayer(function () { hide(); suppressed = t; });
    var lbl = anchor.getAttribute('aria-label');
    if (!(lbl && lbl === t.getAttribute('data-tooltip'))) {
      var ref = (anchor.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (ref.indexOf(fl.id) < 0) { ref.push(fl.id); anchor.setAttribute('aria-describedby', ref.join(' ')); anchor.__tipRef = fl.id; }
    }
    if (!rich && window.MutationObserver) {
      mo = new MutationObserver(function () { if (cur === t) { fill(t, fl); K.place(fl, anchor, po); } });
      mo.observe(t, { attributes: true, attributeFilter: ['data-tooltip', 'data-tooltip-kbd'] });
    }
    R.emit(t, 'open', { tooltip: fl });
  }
  function hide(instant) {
    clearTimeout(showTimer); clearTimeout(hideTimer);
    if (!cur) return;
    var t = cur, el = fl;
    cur = null; fl = null;
    if (stop) stop(); if (pop) pop(); if (mo) mo.disconnect();
    stop = pop = mo = null;
    var anchor = t.classList.contains('tooltip') && t.firstElementChild ? t.firstElementChild : t;
    if (anchor.__tipRef) {
      var ref = (anchor.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== anchor.__tipRef; });
      if (ref.length) anchor.setAttribute('aria-describedby', ref.join(' ')); else anchor.removeAttribute('aria-describedby');
      anchor.__tipRef = null;
    }
    lastClose = performance.now();
    if (instant) { el.removeAttribute('data-closing'); el.setAttribute('data-state', 'closed'); el.__hideTok = null; }
    else K.hide(el);
    R.emit(t, 'close', {});
  }
  function schedule(t) {
    clearTimeout(hideTimer);
    if (cur === t) return;
    var warm = cur || performance.now() - lastClose < 450;
    var delay = warm ? 0 : parseFloat(t.getAttribute('data-tooltip-delay') || (t.classList.contains('tooltip') && t.getAttribute('data-delay')));
    if (isNaN(delay)) delay = 400;
    clearTimeout(showTimer);
    if (!delay) show(t); else showTimer = setTimeout(function () { if (t.isConnected) show(t); }, delay);
  }

  R.define('tooltip', {
    setup: function () {
      d.addEventListener('pointerover', function (e) {
        if (cur && !cur.isConnected) hide(true);
        if (e.pointerType === 'touch') return;
        var t = e.target.closest && e.target.closest(SEL);
        if (!t) return;
        if (t === suppressed) return;
        if (t.hasAttribute('data-tooltip-disabled')) return;
        // ignore pointer over the rich content itself (non-interactive)
        schedule(t);
      }, true);
      d.addEventListener('pointerout', function (e) {
        var t = e.target.closest && e.target.closest(SEL);
        if (!t) return;
        if (e.relatedTarget && t.contains(e.relatedTarget)) return;
        if (t === suppressed) suppressed = null;
        clearTimeout(showTimer);
        if (cur === t) { clearTimeout(hideTimer); hideTimer = setTimeout(function () { hide(); }, 70); }
      }, true);
      d.addEventListener('focusin', function (e) {
        var t = e.target.closest && e.target.closest(SEL);
        if (!t) return;
        var fv = false; try { fv = e.target.matches(':focus-visible'); } catch (x) {}
        if (fv) show(t);
      });
      d.addEventListener('focusout', function (e) {
        var t = e.target.closest && e.target.closest(SEL);
        if (t && cur === t && !(e.relatedTarget && t.contains(e.relatedTarget))) hide();
      });
      d.addEventListener('pointerdown', function (e) {
        var t = e.target.closest && e.target.closest(SEL);
        if (cur) hide(true);
        clearTimeout(showTimer);
        if (t) suppressed = t;
      }, true);
    }
  });

  R.tooltip = {
    show: function (el) { el = typeof el === 'string' ? d.querySelector(el) : el; if (el) show(el); },
    hide: function () { hide(); }
  };
})(window.Ranj);

;
/*!
 * Ranj UI — product tour. Spotlight cutout that glides between targets + a step popover.
 *   var t = Ranj.tour([{ target: '#new-btn', title: 'Create', body: 'Start here.', placement: 'bottom' }, …], { onEnd(done) {} })
 *   t.next() t.prev() t.go(i) t.end()
 * Declarative: elements with data-tour="name" data-tour-step="1" data-tour-title data-tour-body, and a
 * button with data-tour-start="name". A step without target is shown centered.
 * Keys: → / Enter next, ← back, Esc ends. Events: ranj:tourstep { index }, ranj:tourend { completed } on document.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document, w = window;
  var active = null;

  function resolve(t) { if (!t) return null; if (typeof t === 'string') return d.querySelector(t); return t.nodeType === 1 ? t : null; }

  R.tour = function (steps, o) {
    if (typeof steps === 'string') {
      var name = steps;
      steps = R.$$('[data-tour="' + name + '"]').sort(function (a, b) { return (+a.getAttribute('data-tour-step') || 0) - (+b.getAttribute('data-tour-step') || 0); })
        .map(function (el) { return { target: el, title: el.getAttribute('data-tour-title') || '', body: el.getAttribute('data-tour-body') || '', placement: el.getAttribute('data-tour-placement') || undefined }; });
    }
    o = o || {};
    if (!steps || !steps.length) return null;
    if (active) active.end(false);

    var prevFocus = d.activeElement, i = -1, done = false, raf = 0;
    var spot = d.createElement('div'); spot.className = 'tour-spotlight'; spot.setAttribute('aria-hidden', 'true');
    var block = o.allowInteraction ? null : d.createElement('div');
    if (block) { block.className = 'tour-blocker'; block.setAttribute('aria-hidden', 'true'); }
    var pop = d.createElement('div'); pop.className = 'tour-popover'; pop.setAttribute('role', 'dialog'); pop.setAttribute('tabindex', '-1');
    var tid = R.uid('tour');
    pop.setAttribute('aria-labelledby', tid + '-t'); pop.setAttribute('aria-describedby', tid + '-b');
    if (block) d.body.appendChild(block);
    d.body.appendChild(spot); d.body.appendChild(pop);
    K.arrow(pop);
    var rect = null, el = null;
    var anchor = { getBoundingClientRect: function () { return rect; } };

    function measure(step) {
      var pad = step.padding == null ? (o.padding == null ? 6 : o.padding) : step.padding;
      var r = el.getBoundingClientRect();
      rect = { left: r.left - pad, top: r.top - pad, right: r.right + pad, bottom: r.bottom + pad, width: r.width + pad * 2, height: r.height + pad * 2 };
    }
    function paint(instant) {
      var step = steps[i];
      if (instant) spot.style.transition = 'none';
      if (el) {
        measure(step);
        spot.removeAttribute('data-center'); pop.removeAttribute('data-center');
        spot.style.left = rect.left + 'px'; spot.style.top = rect.top + 'px';
        spot.style.width = rect.width + 'px'; spot.style.height = rect.height + 'px';
        var rad = step.radius != null ? step.radius : getComputedStyle(el).borderTopLeftRadius;
        spot.style.borderRadius = typeof rad === 'number' ? rad + 'px' : 'calc(' + (rad || '0px') + ' + 4px)';
        if (instant) pop.style.transition = 'none';
        K.place(pop, anchor, { placement: step.placement || o.placement || 'bottom', offset: 14 });
      } else {
        spot.setAttribute('data-center', ''); pop.setAttribute('data-center', '');
        var vw = w.innerWidth, vh = d.documentElement.clientHeight;
        spot.style.left = vw / 2 + 'px'; spot.style.top = vh / 2 + 'px'; spot.style.width = '0px'; spot.style.height = '0px';
        pop.style.position = 'fixed';
        pop.style.left = Math.max(8, (vw - pop.offsetWidth) / 2) + 'px';
        pop.style.top = Math.max(8, (vh - pop.offsetHeight) / 2) + 'px';
      }
      if (instant) { void spot.offsetWidth; spot.style.transition = ''; pop.style.transition = ''; }
    }
    function onScroll() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; if (!done && i > -1) paint(true); }); }

    function render() {
      var step = steps[i], n = steps.length, last = i === n - 1;
      var dots = ''; for (var k = 0; k < n; k++) dots += '<i' + (k === i ? ' data-on' : k < i ? ' data-done' : '') + '></i>';
      pop.innerHTML =
        '<div class="tour-step-body">' +
          (step.media ? '<div class="tour-media">' + step.media + '</div>' : '') +
          '<div class="tour-head"><span class="tour-badge">' + (step.badge || ((i + 1) + ' of ' + n)) + '</span>' +
            '<button type="button" class="tour-close" aria-label="End tour" data-tour-act="end">' + K.icon.x + '</button></div>' +
          '<div class="tour-title" id="' + tid + '-t">' + (step.title || '') + '</div>' +
          '<div class="tour-body" id="' + tid + '-b">' + (step.body || '') + '</div>' +
        '</div>' +
        '<div class="tour-foot"><div class="tour-dots" aria-hidden="true">' + dots + '</div>' +
          (i === 0 && o.skip !== false && n > 1 ? '<button type="button" class="tour-skip" data-tour-act="end">' + (o.skipText || 'Skip') + '</button>' : '') +
          (i > 0 ? '<button type="button" class="btn btn-outline btn-sm" data-tour-act="prev">' + (o.backText || 'Back') + '</button>' : '') +
          '<button type="button" class="btn btn-sm" data-tour-act="next">' + (last ? (o.doneText || 'Finish') : (o.nextText || 'Next')) + '</button>' +
        '</div>' +
        '<div class="tour-progress" aria-hidden="true"><span style="transform:scaleX(' + ((i + 1) / n) + ')"></span></div>';
      K.arrow(pop);
    }

    function go(n) {
      if (done || n < 0 || n >= steps.length) return;
      var first = i < 0, dir = n >= i ? 1 : -1;
      i = n;
      var step = steps[i];
      if (el) el.classList.remove('tour-target-active');
      el = resolve(step.target);
      if (el && !el.getClientRects().length) el = null;
      if (step.target && !el && o.skipMissing !== false) { if (first) i = -1; return go(n + dir); }
      render();
      if (!first) { pop.removeAttribute('data-swap'); void pop.offsetWidth; pop.setAttribute('data-swap', ''); }
      var settle = function () {
        if (done) return;
        if (first) { K.show(spot, function () { paint(true); }); K.show(pop, function () { paint(true); }); }
        else paint(false);
        try { (pop.querySelector('[data-tour-act="next"]') || pop).focus({ preventScroll: true }); } catch (x) {}
      };
      if (el) {
        el.classList.add('tour-target-active');
        var r = el.getBoundingClientRect(), vh = d.documentElement.clientHeight;
        if (r.top < 80 || r.bottom > vh - 80) { el.scrollIntoView({ block: 'center', behavior: R.reducedMotion ? 'auto' : 'smooth' }); setTimeout(settle, R.reducedMotion ? 0 : 380); }
        else settle();
      } else settle();
      if (step.onEnter) try { step.onEnter(el, i); } catch (x) {}
      if (o.onStep) o.onStep(i, step);
      R.emit(d, 'tourstep', { index: i, step: step });
    }
    function end(completed) {
      if (done) return;
      done = true;
      active = null;
      popLayer(); w.removeEventListener('scroll', onScroll, true); w.removeEventListener('resize', onScroll);
      d.removeEventListener('keydown', onKey, true);
      if (el) el.classList.remove('tour-target-active');
      K.hide(spot, function () { spot.remove(); });
      K.hide(pop, function () { pop.remove(); });
      if (block) block.remove();
      try { if (prevFocus && prevFocus.focus) prevFocus.focus({ preventScroll: true }); } catch (x) {}
      if (o.onEnd) o.onEnd(!!completed);
      R.emit(d, 'tourend', { completed: !!completed, index: i });
    }
    function next() { if (i >= steps.length - 1) end(true); else go(i + 1); }
    function prev() { go(i - 1); }
    function onKey(e) {
      if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable="true"]')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'Tab') { // keep focus in the step card
        var f = R.focusables(pop); if (!f.length) return;
        var a = d.activeElement, fi = f.indexOf(a);
        if (fi < 0 || (e.shiftKey && fi === 0) || (!e.shiftKey && fi === f.length - 1)) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); }
      }
    }
    pop.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tour-act]'); if (!b) return;
      var a = b.getAttribute('data-tour-act');
      if (a === 'next') next(); else if (a === 'prev') prev(); else end(false);
    });
    var popLayer = R.pushLayer(function () { end(false); });
    w.addEventListener('scroll', onScroll, true); w.addEventListener('resize', onScroll);
    d.addEventListener('keydown', onKey, true);
    active = { next: next, prev: prev, go: go, end: end, get index() { return i; } };
    go(o.startAt || 0);
    return active;
  };
  R.tour.end = function () { if (active) active.end(false); };

  R.define('tour', {
    setup: function () {
      R.on(d, 'click', '[data-tour-start]', function (e, b) { e.preventDefault(); R.tour(b.getAttribute('data-tour-start')); });
    }
  });
})(window.Ranj);
