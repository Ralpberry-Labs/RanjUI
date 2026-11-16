/* Ranj UI — Blocks: pricing period toggle.
 * <section class="block-pricing" data-period="monthly">
 *   <div class="block-pricing-toggle"><button data-period="monthly">…</button><button data-period="yearly">…</button></div>
 *   <span class="block-plan-amount" data-monthly="$29" data-yearly="$24">$29</span>
 *   <span data-monthly="billed monthly" data-yearly="billed $288 yearly"></span>
 * </section>
 * Fires ranj:change { period } on the .block-pricing element. */
(function (R) {
  'use strict';
  R.define('block-pricing', {
    selector: '.block-pricing',
    mount: function (el) {
      var toggle = R.$('.block-pricing-toggle', el);
      if (!toggle) return;
      var btns = R.$$('button[data-period]', toggle);
      var thumb = R.$('.block-pricing-toggle-thumb', toggle);
      if (!thumb) { thumb = document.createElement('span'); thumb.className = 'block-pricing-toggle-thumb'; thumb.setAttribute('aria-hidden', 'true'); toggle.insertBefore(thumb, toggle.firstChild); }
      toggle.setAttribute('role', 'group');
      if (!toggle.hasAttribute('aria-label')) toggle.setAttribute('aria-label', 'Billing period');

      function place() {
        var on = btns.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0];
        if (!on || !on.offsetWidth) return;
        thumb.style.width = on.offsetWidth + 'px';
        thumb.style.transform = 'translateX(' + on.offsetLeft + 'px)';
      }
      function set(period, animate) {
        el.setAttribute('data-period', period);
        btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-period') === period)); });
        R.$$('[data-' + period + ']', el).forEach(function (n) {
          if (n.closest('.block-pricing') !== el) return;
          var v = n.getAttribute('data-' + period);
          if (n.textContent === v) return;
          n.textContent = v;
          if (animate && !R.reducedMotion && n.classList.contains('block-plan-amount')) {
            n.classList.remove('is-swapping'); void n.offsetWidth; n.classList.add('is-swapping');
          }
        });
        place();
      }
      var offClick = R.on(toggle, 'click', 'button[data-period]', function (e, b) {
        var p = b.getAttribute('data-period');
        if (p === el.getAttribute('data-period')) return;
        set(p, true);
        R.emit(el, 'change', { period: p });
      });
      var offKey = R.roving(toggle, 'button[data-period]', { orientation: 'horizontal' });
      thumb.style.transition = 'none';
      set(el.getAttribute('data-period') || btns[0].getAttribute('data-period'), false);
      requestAnimationFrame(function () { place(); requestAnimationFrame(function () { thumb.style.transition = ''; }); });
      var ro = 'ResizeObserver' in window ? new ResizeObserver(place) : null;
      if (ro) ro.observe(toggle);
      el.blockPricing = { set: function (p) { set(p, true); } };
      return function () { offClick(); offKey(); if (ro) ro.disconnect(); };
    }
  });
})(window.Ranj);
