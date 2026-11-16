/* Textarea — data-autosize (auto-grow) and data-maxlength (live counter with ring) */
(function (R) {
  'use strict';
  var C = 2 * Math.PI * 6;

  R.define('textarea-autosize', {
    selector: 'textarea[data-autosize]',
    mount: function (ta) {
      var o = R.opts(ta, { maxRows: 0, minRows: 0 });
      function fit() {
        var cs = getComputedStyle(ta);
        var lh = parseFloat(cs.lineHeight) || 20, pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom), bd = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        var prev = ta.style.transition; ta.style.transition = 'none';
        ta.style.height = 'auto';
        var h = ta.scrollHeight + bd;
        if (o.minRows) h = Math.max(h, o.minRows * lh + pad + bd);
        if (o.maxRows) { var max = o.maxRows * lh + pad + bd; ta.style.overflowY = h > max ? 'auto' : 'hidden'; h = Math.min(h, max); }
        ta.style.height = h + 'px';
        void ta.offsetHeight; ta.style.transition = prev;
      }
      var off = R.on(ta, 'input', fit);
      var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { if (ta.__w !== ta.offsetWidth) { ta.__w = ta.offsetWidth; fit(); } }) : null;
      if (ro) ro.observe(ta);
      fit();
      ta.__fit = fit;
      return function () { off(); if (ro) ro.disconnect(); };
    }
  });

  R.define('char-counter', {
    selector: '[data-maxlength]',
    mount: function (el) {
      if (!/^(TEXTAREA|INPUT)$/.test(el.tagName)) return;
      var max = parseInt(el.getAttribute('data-maxlength'), 10); if (!max) return;
      var counter = el.getAttribute('data-counter') ? document.querySelector(el.getAttribute('data-counter')) : null;
      var scope = el.closest('.field, .textarea-box');
      if (!counter && scope) counter = scope.querySelector('.field-counter');
      var created = null;
      if (!counter) {
        created = document.createElement('div'); created.className = 'textarea-counter-row';
        counter = document.createElement('span'); counter.className = 'field-counter';
        created.appendChild(counter);
        var anchor = el.closest('.input-wrap') || el;
        var hint = scope && scope.querySelector(':scope > .field-hint');
        if (hint && hint.previousElementSibling === anchor) { created.insertBefore(hint, counter); }
        anchor.insertAdjacentElement('afterend', created);
      }
      counter.setAttribute('aria-live', 'polite');
      var ring = el.hasAttribute('data-counter-ring');
      function upd() {
        var n = [].slice.call(el.value).length, left = max - n;
        var html = ring ? '<svg class="field-counter-ring" viewBox="0 0 16 16" aria-hidden="true"><circle class="track" cx="8" cy="8" r="6"/><circle class="bar" cx="8" cy="8" r="6" stroke-dasharray="' + C + '" stroke-dashoffset="' + (C * (1 - Math.min(1, n / max))) + '"/></svg>' : '';
        counter.innerHTML = html + '<span>' + (ring && left <= 20 ? left : n + ' / ' + max) + '</span>';
        counter.toggleAttribute('data-warn', left <= Math.max(10, max * 0.1) && left >= 0);
        counter.toggleAttribute('data-over', left < 0);
        if (left < 0) { el.setAttribute('aria-invalid', 'true'); el.__overMax = true; }
        else if (el.__overMax) { el.removeAttribute('aria-invalid'); el.__overMax = false; }
        counter.setAttribute('aria-label', left < 0 ? Math.abs(left) + ' characters over the limit' : left + ' characters left');
      }
      var off = R.on(el, 'input', upd);
      upd();
      return function () { off(); if (created) created.remove(); };
    }
  });
})(window.Ranj);
