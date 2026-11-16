/* Segmented control — positions a sliding indicator under the checked radio */
(function (R) {
  'use strict';
  R.define('segmented', {
    selector: '.segmented',
    mount: function (el) {
      if (!el.hasAttribute('role')) el.setAttribute('role', 'radiogroup');
      var ind = el.querySelector('.segmented-indicator');
      if (!ind) { ind = document.createElement('span'); ind.className = 'segmented-indicator'; ind.setAttribute('aria-hidden', 'true'); el.insertBefore(ind, el.firstChild); }
      function current() { var i = el.querySelector('input:checked'); return i ? i.closest('label') : null; }
      function place(instant) {
        var c = current();
        if (!c) { ind.style.opacity = '0'; return; }
        ind.style.opacity = '';
        if (instant) el.setAttribute('data-instant', '');
        ind.style.setProperty('--x', c.offsetLeft + 'px');
        ind.style.setProperty('--w', c.offsetWidth + 'px');
        if (instant) { void ind.offsetWidth; el.removeAttribute('data-instant'); }
        el.setAttribute('data-ready', '');
      }
      var offs = [R.on(el, 'change', function (e) {
        if (e.target.type !== 'radio') return;
        place(false);
        R.emit(el, 'change', { value: e.target.value });
        var c = current(); if (c && c.scrollIntoView && el.scrollWidth > el.clientWidth) c.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      })];
      var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { place(true); }) : null;
      if (ro) { ro.observe(el); R.$$('label', el).forEach(function (l) { ro.observe(l); }); }
      var form = el.closest('form');
      if (form) offs.push(R.on(form, 'reset', function () { setTimeout(function () { place(false); }, 0); }));
      place(true);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { place(true); });
      return { destroy: function () { offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); }, update: function () { place(false); } };
    }
  });
})(window.Ranj);
