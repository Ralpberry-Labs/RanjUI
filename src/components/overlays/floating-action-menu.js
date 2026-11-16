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
