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
