/* Ranj UI — Timeline reveal: items of .timeline-reveal fade up as they scroll into view. */
(function (R) {
  'use strict';
  R.define('timeline-reveal', {
    selector: '.timeline-reveal',
    mount: function (el) {
      var items = R.$$(':scope > .timeline-item', el), stops = [];
      if (R.reducedMotion) return;
      el.classList.add('is-ready');
      items.forEach(function (it, i) {
        stops.push(R.inView(it, function () {
          it.style.setProperty('--i', i % 4);
          it.classList.add('is-in');
        }, { threshold: 0.2 }));
      });
      return function () { stops.forEach(function (s) { s(); }); el.classList.remove('is-ready'); };
    }
  });
})(window.Ranj);
