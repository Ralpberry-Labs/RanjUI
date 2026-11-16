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
