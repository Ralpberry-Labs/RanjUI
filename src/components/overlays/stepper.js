/*!
 * Ranj UI — stepper.
 * <ol class="stepper" id="s" data-current="1" data-clickable><li class="stepper-item"><span class="stepper-indicator"></span>
 *   <div class="stepper-text"><b class="stepper-title">Account</b><span class="stepper-desc">…</span></div></li>…</ol>
 * States are derived from data-current (0-based): before → complete, at → current, after → upcoming.
 * data-clickable: click/Enter on completed steps (data-clickable="all": any step) to jump back.
 * Buttons: [data-stepper-next="id"] / [data-stepper-prev="id"]. Panels: [data-step-panel="n"] inside [data-stepper-panels="id"].
 * API: Ranj.stepper(el).next() / prev() / go(i) / error(i). Events: ranj:change { index, total, done }.
 */
(function (R) {
  'use strict';
  var d = document;

  R.define('stepper', {
    selector: '.stepper',
    setup: function () {
      R.on(d, 'click', '[data-stepper-next],[data-stepper-prev]', function (e, b) {
        var id = b.getAttribute('data-stepper-next') || b.getAttribute('data-stepper-prev');
        var el = d.getElementById(id); if (!el || !el.__stepper) return;
        if (b.hasAttribute('data-stepper-next')) el.__stepper.next(); else el.__stepper.prev();
      });
    },
    mount: function (el) {
      var clickable = el.getAttribute('data-clickable');
      function items() { return R.$$(':scope > .stepper-item', el); }
      var cur = R.clamp(parseInt(el.getAttribute('data-current'), 10) || 0, 0, items().length);
      var errors = {};
      el.setAttribute('role', 'list');
      items().forEach(function (it, i) {
        it.setAttribute('role', 'listitem');
        if (clickable !== null) { it.setAttribute('data-clickable', ''); it.setAttribute('tabindex', '-1'); }
      });
      function render(silent) {
        var n = items().length;
        items().forEach(function (it, i) {
          var st = errors[i] ? 'error' : i < cur ? 'complete' : i === cur ? 'current' : 'upcoming';
          it.setAttribute('data-state', st);
          if (i === cur) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
          if (clickable !== null) {
            var can = clickable === 'all' || i < cur;
            it.setAttribute('tabindex', can || i === cur ? '0' : '-1');
            it.setAttribute('aria-disabled', String(!can && i !== cur));
          }
          var t = it.querySelector('.stepper-title');
          var lbl = (t ? t.textContent.trim() : 'Step ' + (i + 1)) + ', ' + (st === 'complete' ? 'completed' : st === 'current' ? 'current step' : st === 'error' ? 'has an error' : 'not started');
          it.setAttribute('aria-label', 'Step ' + (i + 1) + ' of ' + n + ': ' + lbl);
        });
        el.setAttribute('data-current', cur);
        R.$$('[data-stepper-panels="' + el.id + '"] [data-step-panel]').forEach(function (p) { p.hidden = +p.getAttribute('data-step-panel') !== cur; });
        R.$$('[data-stepper-prev="' + el.id + '"]').forEach(function (b) { b.disabled = cur <= 0; });
        R.$$('[data-stepper-next="' + el.id + '"]').forEach(function (b) {
          b.disabled = cur >= n;
          var last = b.getAttribute('data-last-label'), lab = b.querySelector('[data-label]') || b;
          if (last) { if (!b.__lbl) b.__lbl = lab.textContent; lab.textContent = cur >= n - 1 ? last : b.__lbl; }
        });
        if (!silent) R.emit(el, 'change', { index: cur, total: n, done: cur >= n });
      }
      function go(i) { cur = R.clamp(i, 0, items().length); render(); }
      var api = {
        next: function () { delete errors[cur]; go(cur + 1); }, prev: function () { go(cur - 1); }, go: go,
        error: function (i, on) { if (on === false) delete errors[i]; else errors[i == null ? cur : i] = true; render(); },
        get index() { return cur; }
      };
      el.__stepper = api;
      render(true);
      var offs = [];
      if (clickable !== null) {
        offs.push(R.on(el, 'click', '.stepper-item', function (e, it) { var i = items().indexOf(it); if (clickable === 'all' || i < cur) go(i); }));
        offs.push(R.on(el, 'keydown', '.stepper-item', function (e, it) {
          var i = items().indexOf(it);
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (clickable === 'all' || i < cur) go(i); }
          else if (/Arrow(Right|Down|Left|Up)/.test(e.key)) {
            e.preventDefault();
            var dir = /Right|Down/.test(e.key) ? 1 : -1, is = items(), j = i + dir;
            while (j >= 0 && j < is.length && is[j].getAttribute('tabindex') === '-1') j += dir;
            if (is[j]) is[j].focus();
          }
        }));
      }
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  R.stepper = function (el) { el = typeof el === 'string' ? d.getElementById(el) || d.querySelector(el) : el; return el && el.__stepper; };
})(window.Ranj);
