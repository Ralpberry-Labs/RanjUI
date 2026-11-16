/* Calendar — inline month grid: keyboard grid nav, month/year views, min/max, disabled dates, range + multiple modes.
   v1 compat: .calendar auto-mounts (unless data-manual) and Ranj.calendar(el, { onSelect }) still works. */
(function (R) {
  'use strict';
  var F = R._forms;
  var DAY = 864e5;

  function d0(d) { return d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null; }
  function iso(d) { if (!d) return ''; var m = d.getMonth() + 1, x = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (x < 10 ? '0' : '') + x; }
  function parseISO(s) {
    if (!s) return null; if (s instanceof Date) return d0(s);
    s = String(s).trim();
    if (s === 'today') return d0(new Date());
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    var rel = /^([+-]\d+)([dwmy])$/.exec(s);
    if (rel) { var t = d0(new Date()), n = +rel[1]; if (rel[2] === 'd') return addDays(t, n); if (rel[2] === 'w') return addDays(t, n * 7); if (rel[2] === 'm') return addMonths(t, n); return addMonths(t, n * 12); }
    var p = new Date(s); return isNaN(p) ? null : d0(p);
  }
  function same(a, b) { return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function addMonths(d, n) { var t = new Date(d.getFullYear(), d.getMonth() + n, 1); var last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate(); return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last)); }
  function cmp(a, b) { return a - b; }

  function create(el, opts) {
    var o = {
      mode: 'single', value: null, min: null, max: null, disabled: null, weekStart: 0, months: 1, locale: undefined,
      onSelect: null, onChange: null, name: '', outside: true, focusOnRender: false, todayButton: false, fixedWeeks: true
    };
    for (var k in opts) if (opts[k] !== undefined) o[k] = opts[k];
    var today = d0(new Date());
    var min = parseISO(o.min), max = parseISO(o.max);
    var disabledSet = {}, disabledFn = null;
    function setDisabled(dis) {
      disabledSet = {}; disabledFn = null;
      if (typeof dis === 'function') disabledFn = dis;
      else if (dis === 'weekends') disabledFn = function (d) { var w = d.getDay(); return w === 0 || w === 6; };
      else if (dis === 'past') disabledFn = function (d) { return d < today; };
      else if (dis) [].concat(typeof dis === 'string' ? dis.split(',') : dis).forEach(function (s) { var d = parseISO(s); if (d) disabledSet[iso(d)] = 1; });
    }
    setDisabled(o.disabled);
    function isDisabled(d) { return (min && d < min) || (max && d > max) || !!disabledSet[iso(d)] || (disabledFn ? !!disabledFn(d) : false); }

    // State
    var sel = [];               // single: [d] | range: [start, end?] | multiple: [d...]
    function setValue(v) {
      if (o.mode === 'range') { var a = [].concat(v || []).map(parseISO); sel = a[0] ? (a[1] ? [a[0], a[1]].sort(cmp) : [a[0]]) : []; }
      else if (o.mode === 'multiple') sel = [].concat(v || []).map(parseISO).filter(Boolean).sort(cmp);
      else sel = v ? [parseISO(v)].filter(Boolean) : [];
    }
    setValue(o.value);
    var view = d0(sel[0] || (min && min > today ? min : max && max < today ? max : today));
    view = new Date(view.getFullYear(), view.getMonth(), 1);
    // With several months and a max date, keep the last visible month at or before max
    if (o.months > 1 && max) { var lastShown = new Date(view.getFullYear(), view.getMonth() + o.months - 1, 1); if (lastShown > max) view = new Date(max.getFullYear(), max.getMonth() - o.months + 1, 1); }
    var focusDate = d0(sel[0] || (isDisabled(today) ? null : today) || view);
    if (focusDate < view || focusDate > new Date(view.getFullYear(), view.getMonth() + o.months, 0)) focusDate = view;
    var mode = 'days';        // days | months | years
    var hover = null;
    var hiddenA = null, hiddenB = null;
    if (o.name) {
      if (o.mode === 'range') { hiddenA = F.hidden(el, o.name + '_start'); hiddenB = F.hidden(el, o.name + '_end'); }
      else hiddenA = F.hidden(el, o.name);
    }

    var fmtMonth = new Intl.DateTimeFormat(o.locale, { month: 'long', year: 'numeric' });
    var fmtMonthShort = new Intl.DateTimeFormat(o.locale, { month: 'short' });
    var fmtLong = new Intl.DateTimeFormat(o.locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    var wd = [], base = new Date(2023, 0, 1); // a Sunday
    var fmtWd = new Intl.DateTimeFormat(o.locale, { weekday: 'short' }), fmtWdLong = new Intl.DateTimeFormat(o.locale, { weekday: 'long' });
    for (var i = 0; i < 7; i++) { var dd = addDays(base, (i + o.weekStart) % 7); wd.push({ s: fmtWd.format(dd).slice(0, 2), l: fmtWdLong.format(dd) }); }

    el.classList.add('calendar');
    if (o.months > 1) el.setAttribute('data-months', o.months);
    el.setAttribute('data-mode', o.mode);
    var live = document.createElement('div'); live.className = 'f-sr'; live.setAttribute('aria-live', 'polite');

    function inRange(d) {
      if (o.mode !== 'range' || !sel[0]) return 0;
      var a = sel[0], b = sel[1] || hover;
      if (!b) return 0;
      var lo = a < b ? a : b, hi = a < b ? b : a;
      return d >= lo && d <= hi ? 1 : 0;
    }
    function isSel(d) { return sel.some(function (s) { return same(s, d); }); }

    function dayGrid(month) {
      var y = month.getFullYear(), m = month.getMonth();
      var first = new Date(y, m, 1), offset = (first.getDay() - o.weekStart + 7) % 7;
      var start = addDays(first, -offset);
      var weeks = o.fixedWeeks ? 6 : Math.ceil((offset + new Date(y, m + 1, 0).getDate()) / 7);
      var h = '<div class="calendar-grid" role="grid" aria-label="' + R.esc(fmtMonth.format(first)) + '"><div class="calendar-row calendar-weekdays" role="row">';
      wd.forEach(function (w) { h += '<span class="calendar-day-header" role="columnheader" aria-label="' + R.esc(w.l) + '">' + R.esc(w.s) + '</span>'; });
      h += '</div>';
      var a = sel[0], b = o.mode === 'range' ? (sel[1] || hover) : null;
      var lo = a && b ? (a < b ? a : b) : a, hi = a && b ? (a < b ? b : a) : null;
      for (var wk = 0; wk < weeks; wk++) {
        h += '<div class="calendar-row" role="row">';
        for (var di = 0; di < 7; di++) {
          var d = addDays(start, wk * 7 + di), other = d.getMonth() !== m;
          var cls = 'calendar-day', cell = 'calendar-cell';
          var dis = isDisabled(d), s = isSel(d) && (o.mode !== 'range' || !other);
          if (same(d, today)) cls += ' today';
          if (other) { cls += ' other-month'; cell += ' is-outside'; }
          if (dis) cls += ' disabled';
          if (s) cls += ' selected';
          if (o.mode === 'range' && lo && hi && !other) {
            if (same(d, lo)) { cls += ' range-start'; cell += ' range-start'; }
            if (same(d, hi)) { cls += ' range-end'; cell += ' range-end'; }
            if (d > lo && d < hi) { cls += ' in-range'; cell += ' in-range'; }
            if (!sel[1] && hover) cell += ' is-preview';
            if (same(lo, hi)) cell += ' range-single';
          }
          if (other && !o.outside) { h += '<span class="' + cell + '" role="gridcell"></span>'; continue; }
          var focusable = same(d, focusDate) && !other;
          h += '<span class="' + cell + '" role="gridcell"' + (s ? ' aria-selected="true"' : '') + '>' +
            '<button type="button" class="' + cls + '" data-date="' + iso(d) + '" tabindex="' + (focusable ? 0 : -1) + '"' +
            (dis ? ' aria-disabled="true"' : '') + (same(d, today) ? ' aria-current="date"' : '') + (s ? ' aria-pressed="true"' : '') +
            ' aria-label="' + R.esc(fmtLong.format(d)) + '">' + d.getDate() + '</button></span>';
        }
        h += '</div>';
      }
      return h + '</div>';
    }
    function monthGrid() {
      var y = view.getFullYear(), h = '<div class="calendar-picker-grid" role="grid" aria-label="' + y + '"><div role="row" class="calendar-picker-row">';
      for (var mi = 0; mi < 12; mi++) {
        if (mi && mi % 3 === 0) h += '</div><div role="row" class="calendar-picker-row">';
        var first = new Date(y, mi, 1), last = new Date(y, mi + 1, 0);
        var dis = (min && last < min) || (max && first > max);
        var cur = mi === focusDate.getMonth();
        var isS = sel[0] && sel[0].getFullYear() === y && sel[0].getMonth() === mi;
        h += '<span role="gridcell"><button type="button" class="calendar-pick' + (isS ? ' selected' : '') + (today.getFullYear() === y && today.getMonth() === mi ? ' today' : '') + '" data-month="' + mi + '" tabindex="' + (cur ? 0 : -1) + '"' + (dis ? ' aria-disabled="true"' : '') + '>' + R.esc(fmtMonthShort.format(first)) + '</button></span>';
      }
      return h + '</div></div>';
    }
    function yearGrid() {
      var y0 = Math.floor(view.getFullYear() / 12) * 12, h = '<div class="calendar-picker-grid" role="grid" aria-label="' + y0 + '–' + (y0 + 11) + '"><div role="row" class="calendar-picker-row">';
      for (var yi = 0; yi < 12; yi++) {
        if (yi && yi % 3 === 0) h += '</div><div role="row" class="calendar-picker-row">';
        var y = y0 + yi, dis = (min && y < min.getFullYear()) || (max && y > max.getFullYear());
        var isS = sel[0] && sel[0].getFullYear() === y;
        h += '<span role="gridcell"><button type="button" class="calendar-pick' + (isS ? ' selected' : '') + (today.getFullYear() === y ? ' today' : '') + '" data-year="' + y + '" tabindex="' + (y === focusDate.getFullYear() ? 0 : -1) + '"' + (dis ? ' aria-disabled="true"' : '') + '>' + y + '</button></span>';
      }
      return h + '</div></div>';
    }
    function canPrev() {
      if (!min) return true;
      if (mode === 'days') return new Date(view.getFullYear(), view.getMonth(), 0) >= min;
      if (mode === 'months') return view.getFullYear() > min.getFullYear();
      return Math.floor(view.getFullYear() / 12) * 12 > min.getFullYear();
    }
    function canNext() {
      if (!max) return true;
      var span = mode === 'days' ? o.months : 1;
      if (mode === 'days') return new Date(view.getFullYear(), view.getMonth() + span, 1) <= max;
      if (mode === 'months') return view.getFullYear() < max.getFullYear();
      return Math.floor(view.getFullYear() / 12) * 12 + 11 < max.getFullYear();
    }

    var CHEV_L = F.icons.chevronLeft, CHEV_R = F.icons.chevronRight;
    function render(dir, focus) {
      var label = mode === 'days' ? 'month' : mode === 'months' ? 'year' : 'years';
      var h = '<div class="calendar-header">' +
        '<button type="button" class="calendar-nav" data-cal-prev aria-label="Previous ' + label + '"' + (canPrev() ? '' : ' disabled') + '>' + CHEV_L + '</button>';
      if (mode === 'days') {
        for (var mi = 0; mi < o.months; mi++) {
          var mm = new Date(view.getFullYear(), view.getMonth() + mi, 1);
          h += o.months === 1 && !el.hasAttribute('data-no-views')
            ? '<button type="button" class="calendar-title" data-cal-view aria-label="' + R.esc(fmtMonth.format(mm)) + ', choose month">' + R.esc(fmtMonth.format(mm)) + '<span class="calendar-title-caret">' + F.icons.chevronDown + '</span></button>'
            : '<span class="calendar-title">' + R.esc(fmtMonth.format(mm)) + '</span>';
        }
      } else if (mode === 'months') {
        h += '<button type="button" class="calendar-title" data-cal-view aria-label="' + view.getFullYear() + ', choose year">' + view.getFullYear() + '<span class="calendar-title-caret">' + F.icons.chevronDown + '</span></button>';
      } else {
        var y0 = Math.floor(view.getFullYear() / 12) * 12;
        h += '<span class="calendar-title">' + y0 + ' – ' + (y0 + 11) + '</span>';
      }
      h += '<button type="button" class="calendar-nav" data-cal-next aria-label="Next ' + label + '"' + (canNext() ? '' : ' disabled') + '>' + CHEV_R + '</button></div>';
      h += '<div class="calendar-body' + (dir ? ' cal-slide-' + (dir > 0 ? 'next' : 'prev') : '') + (mode !== 'days' ? ' cal-zoom' : '') + '">';
      if (mode === 'days') {
        h += '<div class="calendar-months">';
        for (var mj = 0; mj < o.months; mj++) h += dayGrid(new Date(view.getFullYear(), view.getMonth() + mj, 1));
        h += '</div>';
      } else h += mode === 'months' ? monthGrid() : yearGrid();
      h += '</div>';
      if (o.todayButton) h += '<div class="calendar-foot"><button type="button" class="calendar-today-btn" data-cal-today>Today</button></div>';
      el.innerHTML = h;
      el.appendChild(live);
      if (hiddenA) el.appendChild(hiddenA);
      if (hiddenB) el.appendChild(hiddenB);
      if (focus) { var f = el.querySelector('.calendar-body [tabindex="0"]'); if (f) f.focus({ preventScroll: true }); }
    }

    function emitSelect() {
      var v = o.mode === 'single' ? sel[0] || null : sel.slice();
      if (hiddenA) hiddenA.value = o.mode === 'multiple' ? sel.map(iso).join(',') : iso(sel[0]);
      if (hiddenB) hiddenB.value = iso(sel[1]);
      var detail = { value: o.mode === 'single' ? iso(sel[0]) : sel.map(iso), date: v, complete: o.mode !== 'range' || sel.length === 2 };
      if (o.onSelect) o.onSelect(v, detail);
      R.emit(el, 'change', detail);
      if (o.onChange) o.onChange(detail);
    }
    function pick(d) {
      if (isDisabled(d)) return;
      if (o.mode === 'single') sel = [d];
      else if (o.mode === 'multiple') { var i = sel.map(iso).indexOf(iso(d)); if (i > -1) sel.splice(i, 1); else sel.push(d); sel.sort(cmp); }
      else {
        if (!sel[0] || sel[1]) sel = [d];
        else {
          var a = sel[0], lo = a < d ? a : d, hi = a < d ? d : a;
          // reject ranges spanning disabled days if data-no-gaps
          if (o.noGaps) for (var t = lo; t <= hi; t = addDays(t, 1)) if (isDisabled(t)) { sel = [d]; focusDate = d; render(0, true); return; }
          sel = [lo, hi];
        }
        hover = null;
      }
      focusDate = d;
      if (d.getMonth() !== view.getMonth() && o.months === 1) view = new Date(d.getFullYear(), d.getMonth(), 1);
      render(0, true);
      live.textContent = o.mode === 'range' ? (sel[1] ? 'Selected ' + fmtLong.format(sel[0]) + ' to ' + fmtLong.format(sel[1]) : 'Start date ' + fmtLong.format(sel[0]) + '. Choose an end date.') : fmtLong.format(d) + (isSel(d) ? ' selected' : ' removed');
      emitSelect();
    }
    function visible(d) {
      var first = view, last = new Date(view.getFullYear(), view.getMonth() + o.months, 0);
      return d >= first && d <= last;
    }
    function moveFocus(d, animate) {
      if (min && d < min) d = min; if (max && d > max) d = max;
      var dir = 0;
      if (!visible(d)) { dir = d < view ? -1 : 1; view = dir < 0 ? new Date(d.getFullYear(), d.getMonth(), 1) : new Date(d.getFullYear(), d.getMonth() - o.months + 1, 1); }
      focusDate = d;
      if (o.mode === 'range' && sel[0] && !sel[1]) hover = d;
      render(animate === false ? 0 : dir, true);
    }
    function nav(n) {
      if (mode === 'days') { view = addMonths(view, n); focusDate = addMonths(focusDate, n); if (!visible(focusDate)) focusDate = new Date(view.getFullYear(), view.getMonth(), 1); }
      else if (mode === 'months') { view = new Date(view.getFullYear() + n, 0, 1); focusDate = new Date(view.getFullYear(), focusDate.getMonth(), 1); }
      else { view = new Date(view.getFullYear() + n * 12, 0, 1); focusDate = new Date(focusDate.getFullYear() + n * 12, 0, 1); }
      render(n);
      live.textContent = el.querySelector('.calendar-title').textContent;
    }

    var offs = [
      R.on(el, 'click', function (e) {
        var t = e.target.closest('button'); if (!t || !el.contains(t) || t.disabled || t.getAttribute('aria-disabled') === 'true') return;
        if (t.hasAttribute('data-cal-prev')) nav(-1);
        else if (t.hasAttribute('data-cal-next')) nav(1);
        else if (t.hasAttribute('data-cal-view')) { mode = mode === 'days' ? 'months' : 'years'; render(0, true); }
        else if (t.hasAttribute('data-cal-today')) { view = new Date(today.getFullYear(), today.getMonth(), 1); mode = 'days'; pick(today); }
        else if (t.hasAttribute('data-month')) { view = new Date(view.getFullYear(), +t.getAttribute('data-month'), 1); focusDate = addMonths(focusDate, 0); focusDate = new Date(view.getFullYear(), view.getMonth(), Math.min(focusDate.getDate(), new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate())); mode = 'days'; render(0, true); }
        else if (t.hasAttribute('data-year')) { view = new Date(+t.getAttribute('data-year'), view.getMonth(), 1); focusDate = new Date(view.getFullYear(), focusDate.getMonth(), 1); mode = 'months'; render(0, true); }
        else if (t.hasAttribute('data-date')) { var d = parseISO(t.getAttribute('data-date')); if (d.getMonth() !== view.getMonth() && o.months === 1 && !visible(d)) view = new Date(d.getFullYear(), d.getMonth(), 1); pick(d); }
      }),
      R.on(el, 'pointerover', function (e) {
        if (o.mode !== 'range' || !sel[0] || sel[1]) return;
        var t = e.target.closest('[data-date]'); if (!t) return;
        var d = parseISO(t.getAttribute('data-date'));
        if (!same(d, hover)) { hover = d; paintPreview(); }
      }),
      R.on(el, 'pointerleave', function () { if (hover && o.mode === 'range' && !sel[1]) { hover = null; paintPreview(); } }),
      R.on(el, 'keydown', function (e) {
        var t = e.target, k = e.key;
        if (t.hasAttribute('data-date')) {
          var d = parseISO(t.getAttribute('data-date')), n = null;
          if (k === 'ArrowLeft') n = addDays(d, -1); else if (k === 'ArrowRight') n = addDays(d, 1);
          else if (k === 'ArrowUp') n = addDays(d, -7); else if (k === 'ArrowDown') n = addDays(d, 7);
          else if (k === 'Home') n = addDays(d, -((d.getDay() - o.weekStart + 7) % 7));
          else if (k === 'End') n = addDays(d, 6 - ((d.getDay() - o.weekStart + 7) % 7));
          else if (k === 'PageUp') n = e.shiftKey ? addMonths(d, -12) : addMonths(d, -1);
          else if (k === 'PageDown') n = e.shiftKey ? addMonths(d, 12) : addMonths(d, 1);
          else if (k === 'Enter' || k === ' ') { e.preventDefault(); pick(d); return; }
          if (n) { e.preventDefault(); moveFocus(n); }
        } else if (t.hasAttribute('data-month') || t.hasAttribute('data-year')) {
          var isM = t.hasAttribute('data-month'), cur = +(t.getAttribute(isM ? 'data-month' : 'data-year')), step = 0;
          if (k === 'ArrowLeft') step = -1; else if (k === 'ArrowRight') step = 1; else if (k === 'ArrowUp') step = -3; else if (k === 'ArrowDown') step = 3;
          if (step) {
            e.preventDefault();
            var nv = cur + step;
            if (isM) { if (nv < 0 || nv > 11) { view = new Date(view.getFullYear() + (nv < 0 ? -1 : 1), 0, 1); nv = (nv + 12) % 12; } focusDate = new Date(view.getFullYear(), nv, 1); render(0, true); }
            else { var y0 = Math.floor(view.getFullYear() / 12) * 12; if (nv < y0 || nv > y0 + 11) view = new Date(nv, 0, 1); focusDate = new Date(nv, focusDate.getMonth(), 1); render(0, true); }
          } else if (k === 'Escape' && mode !== 'days') { e.preventDefault(); e.stopPropagation(); mode = mode === 'years' ? 'months' : 'days'; render(0, true); }
        }
      })
    ];
    function paintPreview() {
      R.$$('.calendar-cell', el).forEach(function (c) {
        var b = c.querySelector('[data-date]'); if (!b || c.classList.contains('is-outside')) return;
        var d = parseISO(b.getAttribute('data-date'));
        var a = sel[0], bb = hover, lo = a && bb ? (a < bb ? a : bb) : a, hi = a && bb ? (a < bb ? bb : a) : a;
        var start = lo && same(d, lo), end = hi && same(d, hi), mid = lo && hi && d > lo && d < hi;
        c.classList.toggle('range-start', !!start); b.classList.toggle('range-start', !!start);
        c.classList.toggle('range-end', !!end); b.classList.toggle('range-end', !!end);
        c.classList.toggle('in-range', !!mid); b.classList.toggle('in-range', !!mid);
        c.classList.toggle('is-preview', !!hover);
        c.classList.toggle('range-single', !!(lo && hi && same(lo, hi)));
      });
    }

    render(0, o.focusOnRender);
    if (hiddenA) { hiddenA.value = o.mode === 'multiple' ? sel.map(iso).join(',') : iso(sel[0]); }
    if (hiddenB) hiddenB.value = iso(sel[1]);

    var inst = {
      el: el,
      destroy: function () { offs.forEach(function (f) { f(); }); },
      get: function () { return o.mode === 'single' ? sel[0] || null : sel.slice(); },
      set: function (v, silent) { setValue(v); if (sel[0]) { view = new Date(sel[0].getFullYear(), sel[0].getMonth(), 1); focusDate = sel[0]; } hover = null; render(0); if (!silent) emitSelect(); else { if (hiddenA) hiddenA.value = iso(sel[0]); if (hiddenB) hiddenB.value = iso(sel[1]); } },
      goTo: function (d) { d = parseISO(d); if (!d) return; view = new Date(d.getFullYear(), d.getMonth(), 1); focusDate = d; render(0); },
      focus: function () { var f = el.querySelector('.calendar-body [tabindex="0"]') || el.querySelector('[data-date]:not([aria-disabled])'); if (f) f.focus({ preventScroll: true }); },
      configure: function (x) { for (var k in x) if (x[k] !== undefined) o[k] = x[k]; if ('min' in x) min = parseISO(x.min); if ('max' in x) max = parseISO(x.max); if ('disabled' in x) setDisabled(x.disabled); if ('value' in x) setValue(x.value); render(0); },
      isDisabled: isDisabled
    };
    return inst;
  }

  function dataOpts(el) {
    var o = R.opts(el, { mode: 'single', value: '', min: '', max: '', disabled: '', weekStart: 0, months: 1, locale: '', name: '', outside: true, todayButton: false, noGaps: false });
    return {
      mode: o.mode, value: o.mode === 'single' ? o.value || null : (o.value ? o.value.split(/[,/]/) : null),
      min: o.min || null, max: o.max || null, disabled: o.disabled || null, weekStart: o.weekStart, months: o.months,
      locale: o.locale || undefined, name: o.name, outside: o.outside, todayButton: o.todayButton, noGaps: o.noGaps
    };
  }

  R.define('calendar', {
    selector: '.calendar:not([data-manual])',
    mount: function (el) { return create(el, dataOpts(el)); }
  });

  /** Ranj.calendar(el, { mode, value, min, max, disabled, weekStart, months, onSelect(date, detail) }) → instance */
  R.calendar = function (el, opts) {
    if (typeof el === 'string') el = document.querySelector(el);
    opts = opts || {};
    var cur = R.instance(el, 'calendar');
    if (cur && cur.configure) { cur.configure(opts); return cur; }
    var d = dataOpts(el); for (var k in opts) d[k] = opts[k];
    var inst = create(el, d);
    el.__ranj = el.__ranj || {};
    el.__ranj.calendar = inst;
    return inst;
  };
  R._cal = { create: create, iso: iso, parse: parseISO, same: same, addDays: addDays, addMonths: addMonths, d0: d0 };
})(window.Ranj);
