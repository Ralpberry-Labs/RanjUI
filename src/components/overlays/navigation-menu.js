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
