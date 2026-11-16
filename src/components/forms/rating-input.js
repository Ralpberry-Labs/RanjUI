/* Rating — stars (or any icon), hover preview, half steps, keyboard (role="slider"), readonly display */
(function (R) {
  'use strict';
  var F = R._forms;
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6.06 6.6.8-4.87 4.56 1.27 6.54L12 17.3l-5.9 3.26 1.27-6.54L2.5 9.46l6.6-.8z"/></svg>';
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.1C.9 8.6 3 5 6.6 5c2.1 0 3.6 1.1 5.4 3 1.8-1.9 3.3-3 5.4-3C21 5 23.1 8.6 21.6 11.9 19.5 16.4 12 21 12 21z"/></svg>';

  R.define('rating', {
    selector: '.rating',
    mount: function (el) {
      var o = R.opts(el, { value: 0, max: 5, half: false, readonly: false, name: '', labels: '', icon: 'star', clearable: true, label: 'Rating' });
      var step = o.half ? 0.5 : 1, val = R.clamp(o.value, 0, o.max), hover = null;
      var icon = o.icon === 'heart' ? HEART : STAR;
      var labels = o.labels ? o.labels.split('|') : null;
      el.innerHTML = '';
      var stars = document.createElement('span'); stars.className = 'rating-stars';
      for (var i = 0; i < o.max; i++) stars.insertAdjacentHTML('beforeend', '<span class="rating-star" data-i="' + i + '">' + icon + '<span class="rating-fill">' + icon + '</span></span>');
      el.appendChild(stars);
      var text = null;
      if (labels || el.hasAttribute('data-show-value')) { text = document.createElement('span'); text.className = 'rating-text'; el.appendChild(text); }
      var hidden = F.hidden(el, o.name || null);
      if (!o.readonly) { el.tabIndex = 0; el.setAttribute('role', 'slider'); el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', String(o.max)); }
      else { el.setAttribute('role', 'img'); el.setAttribute('data-readonly', ''); }
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', o.label);
      var starEls = R.$$('.rating-star', stars);

      function word(v) { if (labels) { var i = Math.ceil(v) - 1; return labels[i] || ''; } return ''; }
      function paint() {
        var v = hover != null ? hover : val;
        starEls.forEach(function (s, i) {
          var f = R.clamp(v - i, 0, 1);
          s.style.setProperty('--fill', (f * 100) + '%');
          s.toggleAttribute('data-on', f > 0);
          s.toggleAttribute('data-hover', hover != null && f > 0);
        });
        el.toggleAttribute('data-previewing', hover != null);
        if (text) text.textContent = v ? (labels ? word(v) : v + ' / ' + o.max) : (el.getAttribute('data-empty-text') || '');
        var vt = val + ' out of ' + o.max + (labels && val ? ', ' + word(val) : '');
        if (o.readonly) el.setAttribute('aria-label', o.label + ': ' + vt); else { el.setAttribute('aria-valuenow', String(val)); el.setAttribute('aria-valuetext', vt); }
        if (hidden) hidden.value = val || '';
      }
      function at(e) {
        var s = e.target.closest('.rating-star'); if (!s) return null;
        var i = +s.getAttribute('data-i'), r = s.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        if (document.dir === 'rtl' || getComputedStyle(el).direction === 'rtl') x = 1 - x;
        return o.half ? i + (x <= .5 ? .5 : 1) : i + 1;
      }
      function set(v, pulse) {
        v = R.clamp(Math.round(v / step) * step, 0, o.max);
        if (v === val) return;
        val = v; paint();
        if (pulse && !R.reducedMotion) {
          var s = starEls[Math.ceil(v) - 1];
          if (s) { s.classList.remove('rating-pulse'); void s.offsetWidth; s.classList.add('rating-pulse'); }
        }
        if (hidden) try { hidden.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
        R.emit(el, 'change', { value: val, label: word(val) });
      }
      var offs = [];
      if (!o.readonly) {
        offs.push(R.on(stars, 'pointermove', function (e) { if (e.pointerType === 'touch') return; var v = at(e); if (v != null && v !== hover) { hover = v; paint(); } }));
        offs.push(R.on(stars, 'pointerleave', function () { hover = null; paint(); }));
        offs.push(R.on(stars, 'click', function (e) { var v = at(e); if (v == null) return; hover = null; if (v === val && o.clearable) set(0); else set(v, true); }));
        offs.push(R.on(el, 'keydown', function (e) {
          var k = e.key, v = null;
          if (k === 'ArrowRight' || k === 'ArrowUp') v = val + step; else if (k === 'ArrowLeft' || k === 'ArrowDown') v = val - step;
          else if (k === 'Home') v = 0; else if (k === 'End') v = o.max;
          else if (/^[0-9]$/.test(k) && +k <= o.max) v = +k;
          if (v != null) { e.preventDefault(); set(v, true); }
        }));
      }
      paint();
      return { destroy: function () { offs.forEach(function (f) { f(); }); }, get value() { return val; }, set value(v) { set(v); } };
    }
  });
})(window.Ranj);
