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
