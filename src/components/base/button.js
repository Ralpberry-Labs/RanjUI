/* Ranj UI — Button helpers: loading state, toggle groups, image fallback */
(function (R) {
  'use strict';
  function loading(btn, on) {
    if (!btn) return;
    on = on !== false;
    btn.setAttribute('data-loading', on ? 'true' : 'false');
    btn.setAttribute('aria-busy', on ? 'true' : 'false');
    if (on) { btn.__wasDisabled = btn.disabled; btn.disabled = true; } else { btn.disabled = !!btn.__wasDisabled; btn.removeAttribute('aria-busy'); btn.removeAttribute('data-loading'); }
  }
  R.button = { loading: loading };

  // Toggle groups: <div class="btn-group" data-toggle="single|multiple"> with buttons carrying aria-pressed
  R.define('btn-toggle', {
    selector: '.btn-group[data-toggle]',
    mount: function (el) {
      var single = el.getAttribute('data-toggle') !== 'multiple';
      var btns = R.$$(':scope > .btn', el);
      if (!el.hasAttribute('role')) el.setAttribute('role', 'group');
      btns.forEach(function (b) { if (!b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', 'false'); });
      var off = R.on(el, 'click', '.btn', function (e, b) {
        if (b.parentElement !== el) return;
        var on = b.getAttribute('aria-pressed') !== 'true';
        if (single) { if (!on) return; btns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); }
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        R.emit(el, 'change', { value: btns.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).map(function (x) { return x.getAttribute('data-value') || x.textContent.trim(); }) });
      });
      var offKey = single ? R.roving(el, ':scope > .btn', { orientation: el.classList.contains('btn-group-vertical') ? 'vertical' : 'horizontal' }) : null;
      return function () { off(); if (typeof offKey === 'function') offKey(); };
    }
  });

  // Image frames: mark broken images so CSS can show a placeholder
  R.define('img-frame', {
    selector: '.img-frame img',
    mount: function (img) {
      var host = img.closest('.img-frame');
      var fail = function () { host.setAttribute('data-state', 'error'); };
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
      img.addEventListener('error', fail);
      return function () { img.removeEventListener('error', fail); };
    }
  });
})(window.Ranj);
