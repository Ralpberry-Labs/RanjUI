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
