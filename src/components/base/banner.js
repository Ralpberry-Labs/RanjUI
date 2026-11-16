/* Ranj UI — Banner + Callout dismiss (optionally remembered with data-dismiss-key) */
(function (R) {
  'use strict';
  function key(el) { var k = el.getAttribute('data-dismiss-key'); return k ? 'ranj-dismiss:' + k : null; }
  function close(el) {
    if (!el || el.getAttribute('data-state') === 'closed') return;
    if (!R.emit(el, 'dismiss', {})) return;
    var k = key(el); if (k) try { localStorage.setItem(k, '1'); } catch (e) {}
    var finish = function () { el.setAttribute('data-state', 'closed'); R.emit(el, 'dismissed', {}); };
    if (R.reducedMotion || !el.classList.contains('banner')) return finish();
    el.style.height = el.offsetHeight + 'px';
    el.setAttribute('data-state', 'closing');
    setTimeout(finish, 340);
  }
  R.define('banner', {
    selector: '.banner[data-dismiss-key], .callout[data-dismiss-key]',
    setup: function () {
      R.on(document, 'click', '.banner-close, .callout-close', function (e, btn) { close(btn.closest('.banner, .callout')); });
    },
    mount: function (el) {
      var k = key(el);
      try { if (k && localStorage.getItem(k)) el.setAttribute('data-state', 'closed'); } catch (e) {}
    }
  });
  R.banner = {
    close: close,
    reset: function (el) { var k = key(el); if (k) try { localStorage.removeItem(k); } catch (e) {} el.removeAttribute('data-state'); el.style.height = ''; }
  };
})(window.Ranj);
