/* Checkbox — inserts missing marks, data-indeterminate, and "select all" parents (data-check-all="name") */
(function (R) {
  'use strict';

  R.define('checkbox', {
    selector: 'label.checkbox, .checkbox-card, input[data-indeterminate]',
    mount: function (el) {
      if (el.tagName === 'INPUT') { el.indeterminate = el.getAttribute('data-indeterminate') !== 'false'; return; }
      var inp = el.querySelector(':scope > input[type="checkbox"]');
      if (inp && !el.querySelector('.checkbox-mark') && el.classList.contains('checkbox')) {
        var m = document.createElement('span'); m.className = 'checkbox-mark'; m.setAttribute('aria-hidden', 'true');
        inp.insertAdjacentElement('afterend', m);
      }
      if (inp && inp.hasAttribute('data-indeterminate')) inp.indeterminate = true;
    }
  });

  R.define('checkbox-all', {
    selector: 'input[type="checkbox"][data-check-all]',
    mount: function (all) {
      var name = all.getAttribute('data-check-all');
      var scope = all.form || all.closest('[data-check-scope]') || document;
      function kids() { return R.$$('input[type="checkbox"][name="' + name + '"]', scope).filter(function (k) { return !k.disabled; }); }
      function sync() {
        var k = kids(), n = k.filter(function (x) { return x.checked; }).length;
        all.checked = n > 0 && n === k.length;
        all.indeterminate = n > 0 && n < k.length;
        all.setAttribute('aria-checked', all.indeterminate ? 'mixed' : String(all.checked));
      }
      var off1 = R.on(all, 'change', function () {
        kids().forEach(function (k) { k.checked = all.checked; });
        sync();
        R.emit(all, 'change', { value: kids().filter(function (x) { return x.checked; }).map(function (x) { return x.value; }) });
      });
      var off2 = R.on(scope, 'change', function (e) { if (e.target !== all && e.target.name === name) sync(); });
      sync();
      return function () { off1(); off2(); };
    }
  });
})(window.Ranj);
