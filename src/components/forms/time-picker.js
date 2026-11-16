/* Time picker — input + popover with hour / minute (/ AM-PM) columns, typed times, min/max, step */
(function (R) {
  'use strict';
  var F = R._forms;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function parse(s) {
    if (!s) return null;
    s = String(s).trim().toLowerCase().replace(/\s+/g, '');
    var m = /^(\d{1,2})(?::?(\d{2}))?(a|am|p|pm)?$/.exec(s);
    if (!m) return null;
    var h = +m[1], mi = m[2] ? +m[2] : 0;
    if (m[3]) { if (h < 1 || h > 12) return null; if (m[3][0] === 'p' && h < 12) h += 12; if (m[3][0] === 'a' && h === 12) h = 0; }
    if (h > 23 || mi > 59) return null;
    return h * 60 + mi;
  }

  R.define('time-picker', {
    selector: '.time-picker',
    mount: function (el) {
      var o = R.opts(el, { value: '', step: 5, format: '12', name: '', min: '', max: '', placeholder: 'Pick a time' });
      var h12 = String(o.format) === '12';
      var min = parse(o.min), max = parse(o.max);
      var input = el.querySelector('input:not([type="hidden"])'), wrap;
      if (!input) { el.insertAdjacentHTML('afterbegin', '<div class="input-wrap"><span class="input-icon">' + F.icons.clock + '</span><input type="text"></div>'); input = el.querySelector('input'); }
      wrap = input.closest('.input-wrap');
      if (!wrap) { wrap = document.createElement('div'); wrap.className = 'input-wrap'; input.classList.remove('input'); input.parentNode.insertBefore(wrap, input); wrap.appendChild(input); wrap.insertAdjacentHTML('afterbegin', '<span class="input-icon">' + F.icons.clock + '</span>'); }
      if (input.name && !o.name) { o.name = input.name; input.removeAttribute('name'); }
      input.autocomplete = 'off'; input.setAttribute('data-picker', '');
      if (!input.placeholder) input.placeholder = o.placeholder;
      var trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'input-btn time-picker-trigger';
      trigger.setAttribute('aria-label', 'Choose time'); trigger.setAttribute('aria-haspopup', 'dialog'); trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = F.icons.chevronDown; wrap.appendChild(trigger);
      var hidden = F.hidden(el, o.name || null);
      var val = parse(o.value || input.value);

      function label(v) { if (v == null) return ''; var h = Math.floor(v / 60), m = v % 60; return h12 ? ((h % 12) || 12) + ':' + pad(m) + ' ' + (h < 12 ? 'AM' : 'PM') : pad(h) + ':' + pad(m); }
      function ok(v) { return (min == null || v >= min) && (max == null || v <= max); }
      function sync() { input.value = label(val); if (hidden) hidden.value = val == null ? '' : pad(Math.floor(val / 60)) + ':' + pad(val % 60); el.toggleAttribute('data-has-value', val != null); }
      function commit() { sync(); if (hidden) try { hidden.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {} R.emit(el, 'change', { value: hidden ? hidden.value : (val == null ? '' : pad(Math.floor(val / 60)) + ':' + pad(val % 60)), minutes: val }); }

      var panel = document.createElement('div'); panel.className = 'picker-popover time-picker-panel'; panel.hidden = true;
      panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Choose time');
      var cols = [];
      function col(name, items) {
        var c = document.createElement('div'); c.className = 'time-col'; c.setAttribute('role', 'listbox'); c.setAttribute('aria-label', name);
        c.innerHTML = items.map(function (it) { return '<div class="time-opt" role="option" tabindex="-1" data-v="' + it.v + '" aria-selected="false">' + it.l + '</div>'; }).join('');
        panel.appendChild(c); cols.push(c); return c;
      }
      var hours = [];
      if (h12) for (var i = 1; i <= 12; i++) hours.push({ v: i % 12, l: String(i) }); else for (var j = 0; j < 24; j++) hours.push({ v: j, l: pad(j) });
      var mins = []; for (var m = 0; m < 60; m += Math.max(1, o.step)) mins.push({ v: m, l: pad(m) });
      var cH = col('Hours', hours), cM = col('Minutes', mins), cP = h12 ? col('AM or PM', [{ v: 0, l: 'AM' }, { v: 1, l: 'PM' }]) : null;

      function parts(v) { if (v == null) v = (min != null ? min : 9 * 60); var h = Math.floor(v / 60); return { h: h12 ? h % 12 : h, m: v % 60, p: h >= 12 ? 1 : 0 }; }
      function from(p) { return ((h12 ? p.h + (p.p ? 12 : 0) : p.h) * 60) + p.m; }
      function paint(scroll) {
        var p = parts(val);
        [[cH, p.h], [cM, p.m - (p.m % Math.max(1, o.step))], [cP, p.p]].forEach(function (pair) {
          var c = pair[0]; if (!c) return;
          R.$$('.time-opt', c).forEach(function (op) {
            var on = +op.getAttribute('data-v') === pair[1];
            op.setAttribute('aria-selected', String(on)); op.tabIndex = on ? 0 : -1;
            // disable options that would fall outside min/max
            var q = parts(val); if (c === cH) q.h = +op.getAttribute('data-v'); else if (c === cM) q.m = +op.getAttribute('data-v'); else q.p = +op.getAttribute('data-v');
            var t = from(q), dis = !ok(t);
            if (c === cH && dis) { var anyOk = false; for (var mm = 0; mm < 60; mm += Math.max(1, o.step)) { q.m = mm; if (ok(from(q))) { anyOk = true; break; } } dis = !anyOk; }
            op.toggleAttribute('data-disabled', dis); op.setAttribute('aria-disabled', String(dis));
            if (on && scroll) c.scrollTo({ top: op.offsetTop - c.clientHeight / 2 + op.offsetHeight / 2, behavior: scroll === 'smooth' && !R.reducedMotion ? 'smooth' : 'auto' });
          });
          if (!c.querySelector('[tabindex="0"]')) { var f = c.querySelector('.time-opt'); if (f) f.tabIndex = 0; }
        });
      }
      function choose(c, v) {
        var p = parts(val);
        if (c === cH) p.h = v; else if (c === cM) p.m = v; else p.p = v;
        var t = from(p);
        if (!ok(t)) { if (min != null && t < min) t = min; else if (max != null && t > max) t = max; }
        val = t; commit(); paint('smooth');
      }
      var closeFn = null;
      function open(focus) {
        if (closeFn || input.disabled) return;
        el.setAttribute('data-state', 'open'); trigger.setAttribute('aria-expanded', 'true');
        closeFn = F.float(panel, wrap, { placement: 'bottom-start', offset: 6, onClose: function (why) { closeFn = null; el.setAttribute('data-state', 'closed'); trigger.setAttribute('aria-expanded', 'false'); if (why === 'escape') input.focus(); } });
        paint(true);
        if (focus) setTimeout(function () { var f = cH.querySelector('[tabindex="0"]'); if (f) f.focus({ preventScroll: true }); }, 20);
      }
      function close() { if (closeFn) closeFn(); }

      var offs = [
        R.on(trigger, 'click', function () { if (closeFn) close(); else open(true); }),
        R.on(input, 'click', function () { open(false); }),
        R.on(input, 'keydown', function (e) {
          if (e.key === 'ArrowDown') { e.preventDefault(); open(true); }
          else if (e.key === 'Enter') { var v = parse(input.value); if (v != null && ok(v)) { val = v; commit(); } else sync(); close(); }
        }),
        R.on(input, 'blur', function () { setTimeout(function () { if (panel.contains(document.activeElement)) return; var v = parse(input.value); if (!input.value.trim()) { if (val != null) { val = null; commit(); } } else if (v != null && ok(v) && v !== val) { val = v; commit(); } else sync(); }, 0); }),
        R.on(panel, 'mousedown', function (e) { e.preventDefault(); }),
        R.on(panel, 'click', '.time-opt', function (e, op) { if (op.hasAttribute('data-disabled')) return; choose(op.parentNode, +op.getAttribute('data-v')); op.focus({ preventScroll: true }); }),
        R.on(panel, 'keydown', function (e) {
          var op = e.target.closest('.time-opt'); if (!op) return;
          var c = op.parentNode, list = R.$$('.time-opt:not([data-disabled])', c), i = list.indexOf(op), ci = cols.indexOf(c), n = null;
          if (e.key === 'ArrowDown') n = list[Math.min(list.length - 1, i + 1)];
          else if (e.key === 'ArrowUp') n = list[Math.max(0, i - 1)];
          else if (e.key === 'Home') n = list[0];
          else if (e.key === 'End') n = list[list.length - 1];
          else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); var nc = cols[(ci + (e.key === 'ArrowRight' ? 1 : -1) + cols.length) % cols.length]; var f = nc.querySelector('[aria-selected="true"]') || nc.querySelector('.time-opt'); if (f) f.focus(); return; }
          else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!op.hasAttribute('data-disabled')) choose(c, +op.getAttribute('data-v')); close(); input.focus(); return; }
          else if (e.key === 'Tab') { close(); return; }
          if (n) { e.preventDefault(); choose(c, +n.getAttribute('data-v')); n.focus({ preventScroll: true }); }
        })
      ];
      sync();
      return {
        destroy: function () { close(); offs.forEach(function (f) { f(); }); panel.remove(); },
        get value() { return hidden ? hidden.value : val; },
        set value(v) { val = parse(v); sync(); }
      };
    }
  });
})(window.Ranj);
