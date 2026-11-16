/* Input — clearable shells, click-to-focus shells */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('input-wrap', {
    selector: '.input-wrap',
    setup: function () {
      // Clicking the shell's padding/icons focuses the inner input
      R.on(document, 'mousedown', '.input-wrap', function (e, wrap) {
        if (e.target.closest('button, a, input, textarea, select, [tabindex]')) return;
        var inp = wrap.querySelector('input, textarea');
        if (inp && !inp.disabled) { e.preventDefault(); inp.focus(); }
      });
    },
    mount: function (wrap) {
      if (!wrap.hasAttribute('data-clearable')) return;
      var inp = wrap.querySelector('input'); if (!inp) return;
      var btn = wrap.querySelector('.input-clear');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'input-btn input-clear';
        btn.setAttribute('aria-label', 'Clear'); btn.innerHTML = F.icons.x;
        var after = wrap.querySelector('.input-kbd, .input-suffix');
        if (after && after.parentNode === wrap) wrap.insertBefore(btn, after); else wrap.appendChild(btn);
      }
      btn.tabIndex = -1;
      function sync() { if (inp.value) wrap.setAttribute('data-has-value', ''); else wrap.removeAttribute('data-has-value'); }
      var off1 = R.on(inp, 'input', sync);
      var off2 = R.on(btn, 'click', function () {
        inp.value = ''; sync(); inp.focus();
        F.changed(wrap, { value: '' }, inp);
        R.emit(wrap, 'clear', {});
      });
      var off3 = R.on(inp, 'keydown', function (e) {
        if (e.key === 'Escape' && inp.value && wrap.hasAttribute('data-clear-on-escape')) { e.stopPropagation(); btn.click(); }
      });
      sync();
      return function () { off1(); off2(); off3(); };
    }
  });
})(window.Ranj);
