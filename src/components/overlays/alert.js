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
