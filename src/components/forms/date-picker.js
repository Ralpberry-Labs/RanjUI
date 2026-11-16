/* Date picker — input + calendar popover (single or range), presets, typed dates, hidden ISO inputs */
(function (R) {
  'use strict';
  var F = R._forms;

  function presetsFor(mode, C) {
    var t = C.d0(new Date());
    if (mode === 'range') {
      var som = new Date(t.getFullYear(), t.getMonth(), 1);
      return [
        { label: 'Today', value: [t, t] },
        { label: 'Yesterday', value: [C.addDays(t, -1), C.addDays(t, -1)] },
        { label: 'Last 7 days', value: [C.addDays(t, -6), t] },
        { label: 'Last 30 days', value: [C.addDays(t, -29), t] },
        { label: 'This month', value: [som, new Date(t.getFullYear(), t.getMonth() + 1, 0)] },
        { label: 'Last month', value: [new Date(t.getFullYear(), t.getMonth() - 1, 1), new Date(t.getFullYear(), t.getMonth(), 0)] },
        { label: 'Year to date', value: [new Date(t.getFullYear(), 0, 1), t] }
      ];
    }
    return [
      { label: 'Today', value: t },
      { label: 'Tomorrow', value: C.addDays(t, 1) },
      { label: 'In 3 days', value: C.addDays(t, 3) },
      { label: 'Next week', value: C.addDays(t, 7) },
      { label: 'In a month', value: C.addMonths(t, 1) }
    ];
  }

  R.define('date-picker', {
    selector: '.date-picker',
    mount: function (el) {
      var C = R._cal;
      var o = R.opts(el, { mode: 'single', value: '', min: '', max: '', disabled: '', weekStart: 0, months: 0, locale: '', name: '', nameStart: '', nameEnd: '',
        presets: false, placeholder: '', format: 'medium', closeOnSelect: true, placement: 'bottom-start', noGaps: false });
      var range = o.mode === 'range';
      var input = el.querySelector('input:not([type="hidden"])');
      var wrap = input && input.closest('.input-wrap');
      if (!input) {
        el.insertAdjacentHTML('afterbegin', '<div class="input-wrap"><span class="input-icon">' + F.icons.calendar + '</span><input type="text"></div>');
        input = el.querySelector('input'); wrap = input.parentNode;
      } else if (!wrap) {
        wrap = document.createElement('div'); wrap.className = 'input-wrap';
        input.classList.remove('input'); input.parentNode.insertBefore(wrap, input); wrap.appendChild(input);
        wrap.insertAdjacentHTML('afterbegin', '<span class="input-icon">' + F.icons.calendar + '</span>');
      }
      var trigger = document.createElement('button');
      trigger.type = 'button'; trigger.className = 'input-btn date-picker-trigger';
      trigger.setAttribute('aria-label', range ? 'Choose dates' : 'Choose date');
      trigger.setAttribute('aria-haspopup', 'dialog'); trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = F.icons.chevronDown;
      wrap.appendChild(trigger);
      input.autocomplete = 'off';
      input.setAttribute('data-picker', '');
      if (range) input.readOnly = true;
      if (!input.placeholder) input.placeholder = o.placeholder || (range ? 'Pick a date range' : 'Pick a date');
      if (input.name && !o.name) { o.name = input.name; input.removeAttribute('name'); }
      var hA = null, hB = null;
      if (range) { hA = F.hidden(el, o.nameStart || (o.name ? o.name + '_start' : null)); hB = F.hidden(el, o.nameEnd || (o.name ? o.name + '_end' : null)); }
      else hA = F.hidden(el, o.name || null);

      var fmt = new Intl.DateTimeFormat(o.locale || undefined, o.format === 'long' ? { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' } : o.format === 'short' ? { month: 'numeric', day: 'numeric', year: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' });
      var fmtNoYear = new Intl.DateTimeFormat(o.locale || undefined, { month: 'short', day: 'numeric' });
      var value = range ? (o.value ? o.value.split(/[,/]/).map(C.parse).filter(Boolean) : []) : (o.value ? C.parse(o.value) : (input.value ? C.parse(input.value) : null));

      function text() {
        if (!range) return value ? fmt.format(value) : '';
        if (!value[0]) return '';
        if (!value[1]) return fmt.format(value[0]) + ' – …';
        if (C.same(value[0], value[1])) return fmt.format(value[0]);
        var sameYear = value[0].getFullYear() === value[1].getFullYear();
        return (sameYear && o.format === 'medium' ? fmtNoYear.format(value[0]) : fmt.format(value[0])) + ' – ' + fmt.format(value[1]);
      }
      function sync() {
        input.value = text();
        if (range) { if (hA) hA.value = C.iso(value[0]); if (hB) hB.value = C.iso(value[1]); }
        else if (hA) hA.value = C.iso(value);
        el.toggleAttribute('data-has-value', range ? !!value[0] : !!value);
      }
      function commit() {
        sync();
        var detail = range ? { value: [C.iso(value[0]), C.iso(value[1])], date: value.slice() } : { value: C.iso(value), date: value };
        if (hA) try { hA.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
        R.emit(el, 'change', detail);
      }

      // Panel
      var panel = document.createElement('div');
      panel.className = 'picker-popover date-picker-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', range ? 'Choose date range' : 'Choose date');
      panel.hidden = true;
      var presets = o.presets ? presetsFor(o.mode, C) : null;
      if (el.__presets) presets = el.__presets;
      var calHost = document.createElement('div'); calHost.setAttribute('data-manual', '');
      var side = null, foot = null;
      if (presets) {
        side = document.createElement('div'); side.className = 'date-picker-presets';
        side.innerHTML = presets.map(function (p, i) { return '<button type="button" data-preset="' + i + '">' + R.esc(p.label) + '</button>'; }).join('');
        panel.appendChild(side);
      }
      var main = document.createElement('div'); main.className = 'date-picker-main';
      main.appendChild(calHost);
      if (range) {
        foot = document.createElement('div'); foot.className = 'date-picker-foot';
        foot.innerHTML = '<span class="date-picker-summary"></span><div class="date-picker-actions"><button type="button" class="picker-btn" data-dp-clear>Clear</button><button type="button" class="picker-btn picker-btn-primary" data-dp-apply>Apply</button></div>';
        main.appendChild(foot);
      }
      panel.appendChild(main);
      if (presets) panel.setAttribute('data-presets', '');

      var cal = null, closeFn = null, draft = null;
      function summary() {
        if (!foot) return;
        var s = foot.querySelector('.date-picker-summary'), d = draft || [];
        if (!d[0]) s.textContent = 'Select a start date';
        else if (!d[1]) s.textContent = fmt.format(d[0]) + ' – select end';
        else { var n = Math.round((d[1] - d[0]) / 864e5) + 1; s.textContent = n + ' day' + (n === 1 ? '' : 's') + ' selected'; }
        foot.querySelector('[data-dp-apply]').disabled = !(d[0] && d[1]);
      }
      function markPreset() {
        if (!side) return;
        R.$$('[data-preset]', side).forEach(function (b, i) {
          var p = presets[i].value, cur = range ? draft || value : value;
          var on = range ? (cur && cur[0] && cur[1] && C.same(p[0], cur[0]) && C.same(p[1], cur[1])) : C.same(p, cur);
          b.toggleAttribute('data-active', !!on);
        });
      }
      function months() { return o.months || (range && window.innerWidth >= 720 ? 2 : 1); }
      function open(focusGrid) {
        if (closeFn || input.disabled) return;
        draft = range ? value.slice() : null;
        calHost.innerHTML = '';
        cal = C.create(calHost, {
          mode: o.mode, value: range ? value.map(C.iso) : C.iso(value), min: o.min || null, max: o.max || null, disabled: el.__disabledFn || o.disabled || null,
          weekStart: o.weekStart, months: months(), locale: o.locale || undefined, noGaps: o.noGaps,
          onChange: function (d) {
            if (range) {
              draft = d.date.slice(); summary(); markPreset();
              if (d.complete && el.hasAttribute('data-auto-apply')) { value = draft.slice(); commit(); setTimeout(close, 180); }
            } else {
              value = d.date; commit(); markPreset();
              if (o.closeOnSelect) setTimeout(function () { close(); input.focus(); }, R.reducedMotion ? 0 : 120);
            }
          }
        });
        summary(); markPreset();
        el.setAttribute('data-state', 'open');
        trigger.setAttribute('aria-expanded', 'true');
        closeFn = F.float(panel, wrap, { placement: o.placement, offset: 6, onClose: function (why) {
          closeFn = null; el.setAttribute('data-state', 'closed'); trigger.setAttribute('aria-expanded', 'false');
          if (why === 'escape') input.focus();
        } });
        if (focusGrid) setTimeout(function () { cal.focus(); }, 20);
      }
      function close() { if (closeFn) closeFn('close'); }

      function parseTyped(str) {
        str = str.trim(); if (!str) return null;
        var d = C.parse(str);
        if (!d) { var m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/.exec(str); if (m) { var y = +m[3]; if (y < 100) y += 2000; d = new Date(y, +m[1] - 1, +m[2]); } }
        if (d && !isNaN(d) && d.getFullYear() < 1000) d = null;
        return d && !isNaN(d) ? d : null;
      }

      var offs = [
        R.on(trigger, 'click', function () { if (closeFn) close(); else open(true); }),
        R.on(input, 'click', function () { if (range || el.hasAttribute('data-open-on-click')) open(false); }),
        R.on(input, 'keydown', function (e) {
          if ((e.key === 'ArrowDown' && (e.altKey || range || closeFn)) || (range && (e.key === 'Enter' || e.key === ' '))) { e.preventDefault(); if (!closeFn) open(true); else cal.focus(); }
          else if (e.key === 'Enter' && !range) { var d = parseTyped(input.value); if (d && !(cal && cal.isDisabled(d))) { value = d; commit(); } else sync(); }
        }),
        R.on(input, 'blur', function () {
          if (range) return;
          setTimeout(function () {
            if (panel.contains(document.activeElement)) return;
            var d = parseTyped(input.value);
            if (input.value.trim() === '') { if (value) { value = null; commit(); } }
            else if (d && (!value || !C.same(d, value))) { value = d; commit(); }
            else sync();
          }, 0);
        }),
        R.on(panel, 'click', function (e) {
          var p = e.target.closest('[data-preset]');
          if (p) {
            var v = presets[+p.getAttribute('data-preset')].value;
            if (range) { draft = v.slice(); cal.set(draft.map(C.iso), true); cal.goTo(draft[0]); value = draft.slice(); commit(); summary(); markPreset(); setTimeout(close, R.reducedMotion ? 0 : 160); }
            else { value = v; commit(); setTimeout(function () { close(); input.focus(); }, R.reducedMotion ? 0 : 120); }
            return;
          }
          if (e.target.closest('[data-dp-clear]')) { draft = []; cal.set([], true); value = []; commit(); summary(); markPreset(); }
          if (e.target.closest('[data-dp-apply]')) { if (draft && draft[1]) { value = draft.slice(); commit(); } close(); input.focus(); }
        }),
        R.on(panel, 'focusout', function (e) {
          if (!e.relatedTarget) return;
          if (!panel.contains(e.relatedTarget) && !wrap.contains(e.relatedTarget)) close();
        })
      ];
      sync();
      return {
        destroy: function () { close(); offs.forEach(function (f) { f(); }); panel.remove(); },
        open: function () { open(true); }, close: close,
        get value() { return range ? value.map(C.iso) : C.iso(value); },
        set value(v) { value = range ? [].concat(v || []).map(C.parse).filter(Boolean) : C.parse(v); sync(); },
        setDisabled: function (fn) { el.__disabledFn = fn; }
      };
    }
  });

  /** Ranj.datePicker(el) → instance { value, open(), close(), setDisabled(fn) }. Set el.__presets = [{label, value}] before mount for custom presets. */
  R.datePicker = function (el) { if (typeof el === 'string') el = document.querySelector(el); return R.instance(el, 'date-picker'); };
})(window.Ranj);
