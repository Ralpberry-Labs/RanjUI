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
