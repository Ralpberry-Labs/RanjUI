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
