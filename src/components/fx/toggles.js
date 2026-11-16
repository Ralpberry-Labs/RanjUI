/* Ranj UI — Fancy toggles (day/night, liquid glass toggle, toggle pack) + liquid glass menu */
(function (R) {
  'use strict';
  if (!R) return;
  var D = document;

  var INNER = {
    daynight: '<span class="daynight-sky" aria-hidden="true"><span class="daynight-stars"><i></i><i></i><i></i><i></i><i></i></span><span class="daynight-clouds"><i></i><i></i><i></i></span></span>' +
      '<span class="daynight-knob" aria-hidden="true"><span class="daynight-moon"><i></i><i></i><i></i></span></span>',
    'lg-toggle': '<span class="lg-toggle-knob" aria-hidden="true"></span>',
    tgl: '<span class="tgl-knob" aria-hidden="true"></span>',
    'tgl-icon': '<span class="tgl-knob" aria-hidden="true"><span class="tgl-ico"><i></i><i></i></span></span>'
  };

  /** Shared switch behaviour: role=switch button, click/Space/Enter toggles, emits ranj:change */
  R.define('fx-switch', {
    selector: '.daynight, .lg-toggle, .tgl',
    mount: function (el) {
      var kind = el.classList.contains('daynight') ? 'daynight' : el.classList.contains('lg-toggle') ? 'lg-toggle' : el.classList.contains('tgl-icon') ? 'tgl-icon' : 'tgl';
      if (!el.children.length) el.insertAdjacentHTML('beforeend', INNER[kind]);
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      if (el.tagName !== 'BUTTON' && !el.hasAttribute('tabindex')) el.tabIndex = 0;
      el.setAttribute('role', 'switch');
      var themed = el.hasAttribute('data-theme-toggle');
      if (themed) el.setAttribute('aria-checked', String(R.theme.get() === 'dark'));
      else if (!el.hasAttribute('aria-checked')) el.setAttribute('aria-checked', 'false');
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby') && kind === 'daynight') el.setAttribute('aria-label', 'Dark mode');
      var offs = [];
      function set(v) {
        if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return;
        el.setAttribute('aria-checked', String(v));
        var k = el.querySelector('.tgl-knob'); if (k) k.setAttribute('data-touched', '');
        if (themed) R.theme.set(v ? 'dark' : 'light');
        R.emit(el, 'change', { checked: v });
      }
      offs.push(R.on(el, 'click', function () { set(el.getAttribute('aria-checked') !== 'true'); }));
      if (el.tagName !== 'BUTTON') offs.push(R.on(el, 'keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); el.click(); } }));
      // pressing state (liquid lens)
      offs.push(R.on(el, 'pointerdown', function () { el.setAttribute('data-pressing', ''); }));
      var up = function () { el.removeAttribute('data-pressing'); };
      offs.push(R.on(D, 'pointerup', up)); offs.push(R.on(D, 'pointercancel', up));
      if (themed) offs.push(R.on(D.documentElement, 'ranj:theme', function (e) { el.setAttribute('aria-checked', String(e.detail.theme === 'dark')); }));
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  /** Liquid glass menu: a glass lens slides (and stretches) to the active item */
  R.define('lg-menu', {
    selector: '.lg-menu',
    mount: function (el) {
      var vertical = el.classList.contains('lg-menu-vertical');
      var lens = D.createElement('span'); lens.className = 'lg-menu-lens'; lens.setAttribute('aria-hidden', 'true');
      el.insertBefore(lens, el.firstChild);
      var items = function () { return R.$$('.lg-menu-item', el); };
      var tmr = 0, offs = [];
      function current() { return el.querySelector('.lg-menu-item[aria-current], .lg-menu-item[aria-selected="true"]') || items()[0]; }
      function moveTo(it, instant) {
        if (!it) return;
        if (instant) lens.style.transition = 'none';
        if (vertical) { lens.style.transform = 'translateY(' + it.offsetTop + 'px)'; lens.style.height = it.offsetHeight + 'px'; }
        else { lens.style.transform = 'translateX(' + it.offsetLeft + 'px)'; lens.style.width = it.offsetWidth + 'px'; }
        if (instant) { lens.offsetWidth; lens.style.transition = ''; return; }
        el.setAttribute('data-moving', ''); clearTimeout(tmr);
        tmr = setTimeout(function () { el.removeAttribute('data-moving'); }, 260);
      }
      function select(it) {
        items().forEach(function (i) {
          var on = i === it;
          if (i.hasAttribute('aria-selected')) i.setAttribute('aria-selected', String(on));
          else if (on) i.setAttribute('aria-current', 'page'); else i.removeAttribute('aria-current');
        });
        moveTo(it);
        R.emit(el, 'change', { item: it, value: it.getAttribute('data-value') || it.textContent.trim() });
      }
      offs.push(R.on(el, 'click', '.lg-menu-item', function (e, it) { if (it.getAttribute('href') === '#') e.preventDefault(); select(it); }));
      offs.push(R.roving(el, '.lg-menu-item', { orientation: vertical ? 'vertical' : 'horizontal' }));
      var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { moveTo(current(), true); }) : null;
      if (ro) ro.observe(el);
      requestAnimationFrame(function () { moveTo(current(), true); });
      return function () { offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); clearTimeout(tmr); lens.remove(); };
    }
  });
})(window.Ranj);
