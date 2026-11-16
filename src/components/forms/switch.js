/* Switch — role="switch", missing track/thumb insertion, async loading helper */
(function (R) {
  'use strict';
  R.define('switch', {
    selector: 'label.switch',
    mount: function (el) {
      var inp = el.querySelector(':scope > input[type="checkbox"]'); if (!inp) return;
      if (!inp.hasAttribute('role')) inp.setAttribute('role', 'switch');
      var track = el.querySelector('.switch-track');
      if (!track) {
        track = document.createElement('span'); track.className = 'switch-track'; track.setAttribute('aria-hidden', 'true');
        track.innerHTML = '<span class="switch-thumb"></span>';
        inp.insertAdjacentElement('afterend', track);
      } else if (!track.querySelector('.switch-thumb')) track.insertAdjacentHTML('beforeend', '<span class="switch-thumb"></span>');
      function sync() { inp.setAttribute('aria-checked', String(inp.checked)); }
      var off = R.on(inp, 'change', function () { sync(); R.emit(el, 'change', { value: inp.checked, checked: inp.checked }); });
      sync();
      return off;
    }
  });
  /** Ranj.switchLoading(labelEl, true|false) — shows a spinner in the thumb and sets aria-busy */
  R.switchLoading = function (el, on) {
    el.toggleAttribute('data-loading', !!on);
    var inp = el.querySelector('input'); if (inp) inp.setAttribute('aria-busy', String(!!on));
  };
})(window.Ranj);
