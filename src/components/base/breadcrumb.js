/* Ranj UI — Breadcrumb: clicking the "…" crumb of a .breadcrumb-collapsed list reveals the full path. */
(function (R) {
  'use strict';
  R.define('breadcrumb', {
    setup: function () {
      R.on(document, 'click', '.breadcrumb .breadcrumb-ellipsis button', function (e, b) {
        var list = b.closest('.breadcrumb'); if (!list) return;
        list.classList.remove('breadcrumb-collapsed', 'breadcrumb-responsive');
        var first = list.querySelector('li.breadcrumb-hidden a, li.breadcrumb-hidden button');
        R.emit(list, 'expand', {});
        if (first) first.focus();
      });
    }
  });
})(window.Ranj);
