/*! Ranj UI v2.0.0 | MIT | https://alps-is-core.github.io/RanjUI/ */
/* Ranj UI — Forms: shared private helpers (icons, floating panels, hidden inputs).
   Exposed as Ranj._forms for the other forms components; not a public API. */
(function (R) {
  'use strict';
  if (!R || R._forms) return;

  function svg(d, extra) {
    return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + d + '</svg>';
  }
  var icons = {
    chevronDown: svg('<path d="m6 9 6 6 6-6"/>'),
    chevronUpDown: svg('<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>'),
    chevronLeft: svg('<path d="m15 18-6-6 6-6"/>'),
    chevronRight: svg('<path d="m9 18 6-6-6-6"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
    x: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
    xCircle: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" opacity=".9"/><path d="m15 9-6 6m0-6 6 6" stroke="var(--bg)" stroke-width="2" stroke-linecap="round"/></svg>',
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    eye: svg('<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: svg('<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="m2 2 20 20"/>'),
    calendar: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    minus: svg('<path d="M5 12h14"/>'),
    upload: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>'),
    file: svg('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/>'),
    pencil: svg('<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>'),
    spinner: '<svg class="f-spin" viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity=".2" stroke-width="2.5"/><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'
  };

  /** Copy scoped theme/accent from the anchor's ancestors so panels in <body> match. */
  function inheritScope(panel, anchor) {
    var t = anchor.closest && anchor.closest('[data-theme]:not(html)');
    var a = anchor.closest && anchor.closest('[data-accent]:not(html)');
    if (t) panel.setAttribute('data-theme', t.getAttribute('data-theme')); else panel.removeAttribute('data-theme');
    if (a) panel.setAttribute('data-accent', a.getAttribute('data-accent')); else panel.removeAttribute('data-accent');
  }

  /**
   * Open a floating panel anchored to `anchor`. Returns close(reason).
   * o: { placement, offset, matchWidth, onClose(reason), outside:[extra els], focusReturn }
   */
  function float(panel, anchor, o) {
    o = o || {};
    inheritScope(panel, anchor);
    if (panel.parentNode !== document.body) document.body.appendChild(panel);
    if (panel.__closeT) { clearTimeout(panel.__closeT); panel.__closeT = 0; }
    panel.hidden = false;
    panel.setAttribute('data-state', 'open');
    if (o.matchWidth) panel.style.minWidth = anchor.getBoundingClientRect().width + 'px';
    // Measure without the scale-in transform (getBoundingClientRect includes it), then start the animation
    panel.style.animation = 'none';
    var stopPos = R.autoPosition(panel, anchor, { placement: o.placement || 'bottom-start', offset: o.offset == null ? 6 : o.offset });
    void panel.offsetWidth;
    panel.style.animation = '';
    var closed = false;
    var offOut = R.onOutside([panel, anchor].concat(o.outside || []), function () { close('outside'); });
    var popLayer = R.pushLayer(function () { close('escape'); });
    function close(reason) {
      if (closed) return; closed = true;
      stopPos(); offOut(); popLayer();
      panel.setAttribute('data-state', 'closed');
      var done = function () { if (panel.getAttribute('data-state') === 'closed') { panel.hidden = true; } };
      panel.__closeT = setTimeout(done, R.reducedMotion ? 0 : 140);
      if (o.onClose) o.onClose(reason || 'close');
    }
    close.isOpen = function () { return !closed; };
    return close;
  }

  /** Get or create a hidden input inside host. */
  function hidden(host, name, value) {
    if (!name) return null;
    var sel = 'input[type="hidden"][data-f-hidden="' + name.replace(/"/g, '') + '"]';
    var h = host.querySelector(sel);
    if (!h) {
      h = document.createElement('input'); h.type = 'hidden'; h.name = name; h.setAttribute('data-f-hidden', name);
      host.appendChild(h);
    }
    if (value != null) h.value = value;
    return h;
  }

  /** Fire both a native-ish input/change on a real input (for frameworks) and ranj:change on host. */
  function changed(host, detail, input) {
    if (input) {
      try { input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
    }
    R.emit(host, 'change', detail);
  }

  /** Scroll an option into view inside a scrolling list without moving the page. */
  function scrollIntoList(list, item) {
    if (!list || !item) return;
    var lt = list.scrollTop, lh = list.clientHeight, it = item.offsetTop, ih = item.offsetHeight;
    if (it < lt) list.scrollTop = it - 4; else if (it + ih > lt + lh) list.scrollTop = it + ih - lh + 4;
  }

  function norm(s) { return String(s || '').toLowerCase().normalize ? String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') : String(s || '').toLowerCase(); }

  /** Highlight matched query text in a label (escaped). */
  function mark(label, q) {
    if (!q) return R.esc(label);
    var i = norm(label).indexOf(norm(q));
    if (i < 0) return R.esc(label);
    return R.esc(label.slice(0, i)) + '<mark>' + R.esc(label.slice(i, i + q.length)) + '</mark>' + R.esc(label.slice(i + q.length));
  }

  function shake(el) {
    if (!el || R.reducedMotion) return;
    el.classList.remove('f-shake'); void el.offsetWidth; el.classList.add('f-shake');
    setTimeout(function () { el.classList.remove('f-shake'); }, 500);
  }

  /**
   * Listbox controller shared by custom-select / combobox / multi-select.
   * list = makeList(panel, { host: el that gets aria-activedescendant, onPick(item, ev), multi })
   * items: [{ value, label, icon, desc, meta, disabled, group, selected, create }]
   */
  function makeList(panel, o) {
    o = o || {};
    panel.classList.add('listbox');
    panel.setAttribute('role', 'listbox');
    if (o.multi) panel.setAttribute('aria-multiselectable', 'true');
    R.ensureId(panel, 'lb');
    var all = [], shown = [], hi = -1, body = panel;
    if (o.header) { panel.appendChild(o.header); body = document.createElement('div'); body.className = 'listbox-body'; panel.appendChild(body); }
    function optHTML(it, q) {
      return (it.icon ? '<span class="listbox-icon">' + it.icon + '</span>' : '') +
        '<span class="listbox-text">' + mark(it.label, q) + (it.desc ? '<span class="listbox-desc">' + R.esc(it.desc) + '</span>' : '') + '</span>' +
        (it.meta ? '<span class="listbox-meta">' + R.esc(it.meta) + '</span>' : '') +
        (it.create ? '' : '<span class="listbox-check">' + icons.check + '</span>');
    }
    var api = {
      panel: panel,
      set: function (items) { all = items; return api; },
      items: function () { return all; },
      shown: function () { return shown; },
      render: function (q, filter) {
        q = q || '';
        var nq = norm(q).trim();
        shown = all.filter(function (it) {
          if (it.create) return true;
          if (filter === false || !nq) return true;
          return norm(it.label + ' ' + (it.keywords || '')).indexOf(nq) > -1;
        });
        var html = '', lastGroup = null, gi = 0;
        shown.forEach(function (it, i) {
          if (it.group !== lastGroup) {
            if (lastGroup !== null) html += '</div>';
            if (it.group) { gi++; html += '<div role="group" aria-labelledby="' + panel.id + '-g' + gi + '"><div class="listbox-label" id="' + panel.id + '-g' + gi + '">' + R.esc(it.group) + '</div>'; }
            else html += '<div role="presentation">';
            lastGroup = it.group;
          }
          it.id = panel.id + '-o' + i;
          html += '<div class="listbox-option" role="option" id="' + it.id + '" data-i="' + i + '"' +
            (it.create ? ' data-create' : '') +
            ' aria-selected="' + (!!it.selected) + '"' + (it.disabled ? ' aria-disabled="true"' : '') + '>' +
            (it.create ? icons.plus + '<span class="listbox-text">Create “' + R.esc(it.label) + '”</span>' : optHTML(it, nq ? q.trim() : '')) + '</div>';
        });
        if (lastGroup !== null) html += '</div>';
        if (!shown.length) html = '<div class="listbox-empty" role="presentation">' + R.esc(o.empty || 'No results found.') + '</div>';
        body.innerHTML = html;
        hi = -1;
        return api;
      },
      el: function (i) { return body.querySelector('[data-i="' + i + '"]'); },
      highlight: function (i, scroll) {
        var prev = api.el(hi); if (prev) prev.removeAttribute('data-highlighted');
        hi = i;
        var cur = api.el(i);
        if (cur) { cur.setAttribute('data-highlighted', ''); if (scroll !== false) scrollIntoList(panel, cur); }
        if (o.host) { if (cur) o.host.setAttribute('aria-activedescendant', cur.id); else o.host.removeAttribute('aria-activedescendant'); }
        return api;
      },
      index: function () { return hi; },
      current: function () { return shown[hi]; },
      move: function (d) {
        if (!shown.length) return api;
        var n = shown.length, i = hi;
        if (d === 'first') { i = -1; d = 1; } else if (d === 'last') { i = n; d = -1; }
        var step = d > 0 ? 1 : -1, count = Math.abs(d), guard = 0;
        while (count > 0 && guard++ < n * 2) {
          var j = i + step;
          if (j < 0 || j >= n) { if (Math.abs(d) > 1 || o.noWrap) break; j = (j + n) % n; }
          i = j;
          if (!shown[i].disabled) count--;
        }
        if (shown[i] && !shown[i].disabled) api.highlight(i);
        return api;
      },
      /** typeahead: find next enabled item starting with str after current */
      seek: function (str) {
        var s = norm(str), n = shown.length; if (!n) return -1;
        var same = s.split('').every(function (c) { return c === s[0]; });
        var start = hi + (same || s.length === 1 ? 1 : 0);
        for (var k = 0; k < n; k++) {
          var i = (start + k + n) % n, it = shown[i];
          if (it.disabled || it.create) continue;
          var l = norm(it.label);
          if (l.indexOf(s) === 0 || (same && l[0] === s[0])) { api.highlight(i); return i; }
        }
        return -1;
      }
    };
    on(panel, 'mousedown', function (e) { if (!e.target.closest('input')) e.preventDefault(); });
    on(panel, 'click', '.listbox-option', function (e, opt) {
      var it = shown[+opt.getAttribute('data-i')];
      if (it && !it.disabled && o.onPick) o.onPick(it, e);
    });
    on(panel, 'pointermove', '.listbox-option', function (e, opt) {
      var i = +opt.getAttribute('data-i');
      if (i !== hi && !(shown[i] && shown[i].disabled)) api.highlight(i, false);
    });
    return api;
  }
  var on = R.on;

  /** Typeahead buffer: returns fn(char) → accumulated string */
  function typeahead() {
    var buf = '', t = 0;
    return function (ch) { clearTimeout(t); buf += ch; t = setTimeout(function () { buf = ''; }, 600); return buf; };
  }

  /** Read items from a native <select> */
  function itemsFromSelect(sel) {
    var out = [];
    R.$$('option', sel).forEach(function (op) {
      if (op.hidden && op.value === '') return;
      var g = op.parentElement && op.parentElement.tagName === 'OPTGROUP' ? op.parentElement : null;
      out.push({
        value: op.value, label: op.getAttribute('data-label') || op.textContent.trim(),
        icon: op.getAttribute('data-icon') || '', desc: op.getAttribute('data-description') || '', meta: op.getAttribute('data-meta') || '',
        keywords: op.getAttribute('data-keywords') || '',
        disabled: op.disabled || (g && g.disabled), group: g ? g.label : '', selected: op.selected && !(op.value === '' && !op.hasAttribute('selected')), option: op
      });
    });
    return out;
  }

  R._forms = { icons: icons, makeList: makeList, typeahead: typeahead, itemsFromSelect: itemsFromSelect, float: float, hidden: hidden, changed: changed, scrollIntoList: scrollIntoList, norm: norm, mark: mark, shake: shake, inheritScope: inheritScope };
})(window.Ranj);

;
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

;
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

;
/* Color picker — saturation/value area, hue slider, hex input, swatches, eyedropper; popover or inline */
(function (R) {
  'use strict';
  var F = R._forms;
  var DEFAULT_SWATCHES = '#0f172a,#ef4444,#f97316,#f59e0b,#84cc16,#10b981,#06b6d4,#3b82f6,#6366f1,#8b5cf6,#d946ef,#ec4899';

  function hexToRgb(h) {
    h = String(h || '').trim().replace(/^#/, '');
    if (h.length === 3 || h.length === 4) h = h.split('').map(function (c) { return c + c; }).join('');
    if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  function rgbToHex(c) { return '#' + [c.r, c.g, c.b].map(function (v) { v = Math.round(v).toString(16); return v.length < 2 ? '0' + v : v; }).join(''); }
  function rgbToHsv(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return { h: h, s: mx ? d / mx : 0, v: mx };
  }
  function hsvToRgb(h, s, v) {
    var c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c, r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
  }
  function readable(c) { return (c.r * 299 + c.g * 587 + c.b * 114) / 1000 > 150 ? '#09090b' : '#ffffff'; }

  R.define('color-picker', {
    selector: '.color-picker',
    mount: function (el) {
      var o = R.opts(el, { value: '#6366f1', name: '', swatches: DEFAULT_SWATCHES, inline: false, placement: 'bottom-start', label: 'Color' });
      var rgb = hexToRgb(o.value) || { r: 99, g: 102, b: 241 }, hsv = rgbToHsv(rgb);
      var hidden = F.hidden(el, o.name || null, rgbToHex(rgb));
      var trigger = null;
      if (!o.inline) {
        trigger = el.querySelector('.color-picker-trigger');
        if (!trigger) {
          trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'color-picker-trigger';
          trigger.innerHTML = '<span class="color-swatch" aria-hidden="true"></span><span class="color-picker-hex"></span><span class="color-picker-caret">' + F.icons.chevronDown + '</span>';
          el.insertBefore(trigger, el.firstChild);
        }
        trigger.setAttribute('aria-haspopup', 'dialog'); trigger.setAttribute('aria-expanded', 'false');
      }
      var panel = document.createElement('div');
      panel.className = 'color-panel' + (o.inline ? '' : ' picker-popover');
      panel.setAttribute('role', o.inline ? 'group' : 'dialog');
      panel.setAttribute('aria-label', o.label + ' picker');
      var sw = o.swatches ? o.swatches.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];
      panel.innerHTML =
        '<div class="color-area" role="slider" tabindex="0" aria-label="Saturation and brightness" aria-valuemin="0" aria-valuemax="100"><div class="color-area-thumb"></div></div>' +
        '<div class="color-row">' +
          ('EyeDropper' in window ? '<button type="button" class="color-eyedropper" aria-label="Pick a color from the screen"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/></svg></button>' : '') +
          '<div class="color-hue" role="slider" tabindex="0" aria-label="Hue" aria-valuemin="0" aria-valuemax="360"><div class="color-hue-thumb"></div></div>' +
        '</div>' +
        '<div class="color-fields"><span class="color-swatch color-preview" aria-hidden="true"></span><label class="color-hex-field"><span>HEX</span><input type="text" class="color-hex-input" spellcheck="false" maxlength="7" aria-label="Hex color"></label></div>' +
        (sw.length ? '<div class="color-swatches" role="group" aria-label="Swatches">' + sw.map(function (c) { return '<button type="button" class="color-swatch-btn" data-color="' + R.esc(c) + '" style="--c:' + R.esc(c) + '" aria-label="' + R.esc(c) + '"></button>'; }).join('') + '</div>' : '');
      if (o.inline) el.appendChild(panel); else panel.hidden = true;
      var area = panel.querySelector('.color-area'), aThumb = panel.querySelector('.color-area-thumb');
      var hue = panel.querySelector('.color-hue'), hThumb = panel.querySelector('.color-hue-thumb');
      var hexIn = panel.querySelector('.color-hex-input');

      function paint(skipHex) {
        rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
        var hex = rgbToHex(rgb);
        el.style.setProperty('--color', hex);
        panel.style.setProperty('--color', hex);
        panel.style.setProperty('--hue-color', rgbToHex(hsvToRgb(hsv.h, 1, 1)));
        aThumb.style.left = (hsv.s * 100) + '%'; aThumb.style.top = ((1 - hsv.v) * 100) + '%';
        hThumb.style.left = (hsv.h / 360 * 100) + '%';
        area.setAttribute('aria-valuenow', Math.round(hsv.s * 100));
        area.setAttribute('aria-valuetext', 'Saturation ' + Math.round(hsv.s * 100) + '%, brightness ' + Math.round(hsv.v * 100) + '%');
        hue.setAttribute('aria-valuenow', Math.round(hsv.h)); hue.setAttribute('aria-valuetext', Math.round(hsv.h) + ' degrees');
        if (!skipHex) hexIn.value = hex.toUpperCase();
        if (trigger) { trigger.querySelector('.color-picker-hex').textContent = hex.toUpperCase(); trigger.setAttribute('aria-label', o.label + ': ' + hex.toUpperCase() + '. Change color'); }
        R.$$('.color-swatch-btn', panel).forEach(function (b) { var on = (hexToRgb(b.getAttribute('data-color')) && rgbToHex(hexToRgb(b.getAttribute('data-color')))) === hex; b.toggleAttribute('data-active', on); b.setAttribute('aria-pressed', String(on)); b.style.setProperty('--ck', readable(hexToRgb(b.getAttribute('data-color')) || rgb)); });
        if (hidden) hidden.value = hex;
        return hex;
      }
      var emitT = 0;
      function changed(final) {
        var hex = paint(document.activeElement === hexIn);
        R.emit(el, 'input', { value: hex, rgb: { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) }, hsv: hsv });
        clearTimeout(emitT);
        var fire = function () { if (hidden) try { hidden.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {} R.emit(el, 'change', { value: hex, rgb: { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) }, hsv: hsv }); };
        if (final) fire(); else emitT = setTimeout(fire, 120);
      }
      function setHex(h, final) { var c = hexToRgb(h); if (!c) return false; var nh = rgbToHsv(c); if (nh.s === 0 || nh.v === 0) nh.h = hsv.h; hsv = nh; changed(final); return true; }

      function drag(target, onMove) {
        return R.on(target, 'pointerdown', function (e) {
          if (e.button) return;
          e.preventDefault(); target.focus({ preventScroll: true });
          target.setAttribute('data-dragging', '');
          try { target.setPointerCapture(e.pointerId); } catch (err) {}
          var r = target.getBoundingClientRect();
          var mv = function (ev) { onMove(R.clamp((ev.clientX - r.left) / r.width, 0, 1), R.clamp((ev.clientY - r.top) / r.height, 0, 1)); };
          var up = function () { target.removeAttribute('data-dragging'); target.removeEventListener('pointermove', mv); target.removeEventListener('pointerup', up); target.removeEventListener('pointercancel', up); changed(true); };
          target.addEventListener('pointermove', mv); target.addEventListener('pointerup', up); target.addEventListener('pointercancel', up);
          mv(e);
        });
      }
      var offs = [
        drag(area, function (x, y) { hsv.s = x; hsv.v = 1 - y; changed(); }),
        drag(hue, function (x) { hsv.h = Math.min(359.9, x * 360); changed(); }),
        R.on(area, 'keydown', function (e) {
          var st = e.shiftKey ? .1 : .01, k = e.key;
          if (k === 'ArrowLeft') hsv.s = R.clamp(hsv.s - st, 0, 1); else if (k === 'ArrowRight') hsv.s = R.clamp(hsv.s + st, 0, 1);
          else if (k === 'ArrowUp') hsv.v = R.clamp(hsv.v + st, 0, 1); else if (k === 'ArrowDown') hsv.v = R.clamp(hsv.v - st, 0, 1); else return;
          e.preventDefault(); changed();
        }),
        R.on(hue, 'keydown', function (e) {
          var st = e.shiftKey ? 15 : 1, k = e.key;
          if (k === 'ArrowLeft' || k === 'ArrowDown') hsv.h = (hsv.h - st + 360) % 360; else if (k === 'ArrowRight' || k === 'ArrowUp') hsv.h = (hsv.h + st) % 360;
          else if (k === 'Home') hsv.h = 0; else if (k === 'End') hsv.h = 359; else return;
          e.preventDefault(); changed();
        }),
        R.on(hexIn, 'input', function () { var v = hexIn.value.trim(); if (v[0] !== '#') v = '#' + v; if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) setHex(v); }),
        R.on(hexIn, 'blur', function () { paint(); }),
        R.on(hexIn, 'keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); paint(); if (closeFn) { closeFn(); trigger.focus(); } } }),
        R.on(panel, 'click', '.color-swatch-btn', function (e, b) { setHex(b.getAttribute('data-color'), true); }),
        R.on(panel, 'click', '.color-eyedropper', function () {
          try { new window.EyeDropper().open().then(function (res) { setHex(res.sRGBHex, true); }, function () {}); } catch (e) {}
        })
      ];
      var closeFn = null;
      if (trigger) {
        offs.push(R.on(trigger, 'click', function () {
          if (closeFn) { closeFn(); return; }
          el.setAttribute('data-state', 'open'); trigger.setAttribute('aria-expanded', 'true');
          closeFn = F.float(panel, trigger, { placement: o.placement, offset: 6, onClose: function (why) { closeFn = null; el.setAttribute('data-state', 'closed'); trigger.setAttribute('aria-expanded', 'false'); if (why === 'escape') trigger.focus(); } });
          paint();
          setTimeout(function () { area.focus({ preventScroll: true }); }, 20);
        }));
        offs.push(R.on(panel, 'focusout', function (e) { if (closeFn && e.relatedTarget && !panel.contains(e.relatedTarget) && e.relatedTarget !== trigger) closeFn(); }));
      }
      paint();
      return {
        destroy: function () { if (closeFn) closeFn(); offs.forEach(function (f) { f(); }); if (!o.inline) panel.remove(); },
        get value() { return rgbToHex(rgb); },
        set value(v) { setHex(v, false); }
      };
    }
  });
  R.color = { hexToRgb: hexToRgb, rgbToHex: rgbToHex, rgbToHsv: rgbToHsv, hsvToRgb: hsvToRgb };
})(window.Ranj);

;
/* Combobox — editable input + filtered listbox (aria-activedescendant), create-new, async sources.
   v1 markup (.combobox > .combobox-input + .combobox-list > .combobox-option) still works. */
(function (R) {
  'use strict';
  var F = R._forms;

  function readItems(el) {
    var items = [];
    var data = el.getAttribute('data-options');
    if (data) { try { items = JSON.parse(data); } catch (e) {} }
    var ul = el.querySelector('.combobox-list');
    if (ul) {
      var group = '';
      R.$$('.combobox-option, .combobox-group', ul).forEach(function (li) {
        if (li.classList.contains('combobox-group')) { group = li.textContent.trim(); return; }
        items.push({
          value: li.getAttribute('data-value') || li.textContent.trim(), label: li.getAttribute('data-label') || li.textContent.trim(),
          desc: li.getAttribute('data-description') || '', icon: li.getAttribute('data-icon') || '', meta: li.getAttribute('data-meta') || '',
          disabled: li.hasAttribute('data-disabled') || li.getAttribute('aria-disabled') === 'true', group: li.getAttribute('data-group') || group,
          selected: li.hasAttribute('data-selected')
        });
      });
      ul.remove();
    }
    var dl = el.querySelector('datalist');
    if (dl) { R.$$('option', dl).forEach(function (op) { items.push({ value: op.value, label: op.label || op.value }); }); dl.remove(); }
    return items.map(function (it) { return typeof it === 'string' ? { value: it, label: it } : it; });
  }

  R.define('combobox', {
    selector: '.combobox',
    mount: function (el) {
      var o = R.opts(el, { name: '', create: false, strict: false, openOnFocus: true, debounce: 180, minChars: 0, empty: 'No results found.', placement: 'bottom-start' });
      var input = el.querySelector('.combobox-input, input:not([type="hidden"])');
      if (!input) return;
      input.classList.add('combobox-input');
      var wrap = input.closest('.input-wrap');
      if (!wrap || !el.contains(wrap)) {
        wrap = document.createElement('div');
        wrap.className = 'input-wrap combobox-wrap';
        ['input-sm', 'input-lg', 'input-filled'].forEach(function (c) { if (input.classList.contains(c)) { wrap.classList.add(c); input.classList.remove(c); } });
        input.classList.remove('input');
        input.parentNode.insertBefore(wrap, input);
        wrap.appendChild(input);
      }
      var toggle = wrap.querySelector('.combobox-toggle');
      if (!toggle && !el.hasAttribute('data-no-toggle')) {
        toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'input-btn combobox-toggle';
        toggle.tabIndex = -1; toggle.setAttribute('aria-label', 'Show options'); toggle.innerHTML = F.icons.chevronDown;
        wrap.appendChild(toggle);
      }
      var spinner = document.createElement('span'); spinner.className = 'input-icon combobox-spinner'; spinner.hidden = true; spinner.innerHTML = F.icons.spinner;
      wrap.insertBefore(spinner, toggle || null);

      var items = readItems(el), source = null, selected = items.filter(function (i) { return i.selected; })[0] || null;
      var hidden = F.hidden(el, o.name || null, selected ? selected.value : '');
      if (selected && !input.value) input.value = selected.label;

      var panel = document.createElement('div'); panel.className = 'combobox-list'; panel.hidden = true;
      var list = F.makeList(panel, { host: input, empty: o.empty, onPick: function (it) { pick(it); close(); } });
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-controls', panel.id);
      input.setAttribute('autocomplete', 'off');
      if (!input.hasAttribute('spellcheck')) input.spellcheck = false;

      var closeFn = null, req = 0, timer = 0;

      function build(q, base) {
        var arr = (base || items).map(function (it) {
          var c = {}; for (var k in it) c[k] = it[k];
          c.selected = !!selected && selected.value === it.value; return c;
        });
        var qt = (q || '').trim();
        if (o.create && qt && !arr.some(function (i) { return F.norm(i.label) === F.norm(qt); })) arr.push({ value: qt, label: qt, create: true });
        list.set(arr).render(q, base ? false : true);
        var first = list.shown().map(function (i) { return i.selected; }).indexOf(true);
        if (first > -1 && !qt) list.highlight(first); else if (qt || el.hasAttribute('data-autohighlight')) list.move('first'); else list.highlight(-1);
        el.toggleAttribute('data-empty', !list.shown().length);
      }
      function update() {
        var q = input.value;
        if (source) {
          clearTimeout(timer);
          if (q.trim().length < o.minChars) { list.set([]); list.render(''); panel.querySelector('.listbox-empty').textContent = 'Type ' + o.minChars + '+ characters to search'; return; }
          var my = ++req;
          spinner.hidden = false; el.setAttribute('data-loading', '');
          if (!list.shown().length) panel.innerHTML = '<div class="listbox-loading">' + F.icons.spinner + 'Searching…</div>';
          timer = setTimeout(function () {
            Promise.resolve(source(q)).then(function (res) {
              if (my !== req) return;
              spinner.hidden = true; el.removeAttribute('data-loading');
              build(q, (res || []).map(function (it) { return typeof it === 'string' ? { value: it, label: it } : it; }));
              if (closeFn) R.position(panel, wrap, { placement: o.placement, offset: 6 });
            }, function () { if (my === req) { spinner.hidden = true; el.removeAttribute('data-loading'); list.set([]); list.render(''); panel.querySelector('.listbox-empty').textContent = 'Couldn’t load results.'; } });
          }, o.debounce);
        } else build(q);
      }
      function open() {
        if (closeFn || input.disabled || input.readOnly) return;
        el.setAttribute('data-state', 'open');
        input.setAttribute('aria-expanded', 'true');
        update();
        closeFn = F.float(panel, wrap, { matchWidth: true, placement: o.placement, onClose: function () {
          closeFn = null; el.setAttribute('data-state', 'closed'); input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant');
        } });
      }
      function close() { if (closeFn) closeFn(); }
      function pick(it) {
        if (!it || it.disabled) return;
        var isNew = !!it.create;
        if (isNew) {
          it = { value: it.value, label: it.label };
          items.push(it);
          R.emit(el, 'create', { value: it.value, label: it.label });
        }
        selected = it;
        input.value = it.label;
        if (hidden) hidden.value = it.value;
        F.changed(el, { value: it.value, label: it.label, item: it, created: isNew }, null);
        try { input.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
      }
      function revert() {
        if (!o.strict) {
          if (selected && input.value !== selected.label) { selected = null; if (hidden) hidden.value = ''; }
          if (!selected && hidden && o.create === false) hidden.value = '';
          return;
        }
        var match = items.filter(function (i) { return F.norm(i.label) === F.norm(input.value.trim()); })[0];
        if (match) { if (!selected || selected.value !== match.value) pick(match); }
        else input.value = selected ? selected.label : '';
      }

      var offs = [
        R.on(input, 'input', function () { if (!closeFn) open(); else update(); }),
        R.on(input, 'focus', function () { if (o.openOnFocus && !el.__skipFocusOpen) open(); el.__skipFocusOpen = false; }),
        R.on(input, 'click', function () { open(); }),
        R.on(input, 'blur', function () { setTimeout(function () { if (document.activeElement !== input) { close(); revert(); } }, 0); }),
        R.on(input, 'keydown', function (e) {
          var k = e.key;
          if (k === 'ArrowDown' || k === 'ArrowUp') {
            e.preventDefault();
            if (!closeFn) { open(); if (k === 'ArrowUp') list.move('last'); return; }
            if (e.altKey && k === 'ArrowUp') { close(); return; }
            list.move(k === 'ArrowDown' ? 1 : -1);
          } else if (k === 'PageDown' && closeFn) { e.preventDefault(); list.move(8); }
          else if (k === 'PageUp' && closeFn) { e.preventDefault(); list.move(-8); }
          else if (k === 'Enter') {
            if (closeFn && list.current()) { e.preventDefault(); pick(list.current()); close(); }
            else if (closeFn && o.create && input.value.trim()) { e.preventDefault(); pick({ value: input.value.trim(), label: input.value.trim(), create: true }); close(); }
          } else if (k === 'Escape') {
            if (!closeFn && input.value) { e.preventDefault(); input.value = ''; selected = null; if (hidden) hidden.value = ''; F.changed(el, { value: '', label: '' }); }
          } else if (k === 'Tab' && closeFn) {
            if (list.current() && el.hasAttribute('data-autohighlight')) pick(list.current());
            close();
          }
        })
      ];
      if (toggle) offs.push(R.on(toggle, 'click', function () { if (closeFn) close(); else { el.__skipFocusOpen = true; input.focus(); open(); } }));

      var inst = {
        destroy: function () { close(); clearTimeout(timer); offs.forEach(function (f) { f(); }); panel.remove(); },
        open: open, close: close,
        setItems: function (arr) { items = arr.map(function (it) { return typeof it === 'string' ? { value: it, label: it } : it; }); if (closeFn) update(); },
        setSource: function (fn) { source = fn; },
        get value() { return selected ? selected.value : ''; },
        set value(v) { var m = items.filter(function (i) { return String(i.value) === String(v); })[0]; if (m) pick(m); else { selected = null; input.value = ''; if (hidden) hidden.value = ''; } }
      };
      return inst;
    }
  });

  /** Ranj.combobox(el, { source(query) → items|Promise, items: [] }) → instance */
  R.combobox = function (el, opts) {
    if (typeof el === 'string') el = document.querySelector(el);
    R.init(el.parentNode || el);
    var inst = R.instance(el, 'combobox');
    if (inst && opts) { if (opts.source) inst.setSource(opts.source); if (opts.items) inst.setItems(opts.items); }
    return inst;
  };
})(window.Ranj);

;
/* Custom select — button + listbox popover that drives a hidden native <select> (forms submit natively) */
(function (R) {
  'use strict';
  var F = R._forms;

  function buildSelect(el) {
    var sel = el.querySelector('select');
    if (sel) return sel;
    sel = document.createElement('select');
    var data = [];
    try { data = JSON.parse(el.getAttribute('data-options') || '[]'); } catch (e) {}
    var groups = {};
    data.forEach(function (d) {
      if (typeof d === 'string') d = { value: d, label: d };
      var op = new Option(d.label || d.value, d.value == null ? d.label : d.value);
      if (d.icon) op.setAttribute('data-icon', d.icon);
      if (d.description) op.setAttribute('data-description', d.description);
      if (d.meta) op.setAttribute('data-meta', d.meta);
      if (d.disabled) op.disabled = true;
      if (d.selected) op.selected = op.defaultSelected = true;
      var parent = sel;
      if (d.group) { parent = groups[d.group]; if (!parent) { parent = groups[d.group] = document.createElement('optgroup'); parent.label = d.group; sel.appendChild(parent); } }
      parent.appendChild(op);
    });
    el.appendChild(sel);
    return sel;
  }

  R.define('custom-select', {
    selector: '.custom-select',
    mount: function (el) {
      var o = R.opts(el, { placeholder: 'Select…', search: false, searchPlaceholder: 'Search…', name: '', placement: 'bottom-start', empty: 'No results found.' });
      var sel = buildSelect(el);
      if (o.name && !sel.name) sel.name = o.name;
      var hasExplicit = R.$$('option', sel).some(function (op) { return op.hasAttribute('selected'); });
      if (!hasExplicit && el.hasAttribute('data-placeholder') && !R.$$('option', sel).some(function (op) { return op.value === ''; })) sel.selectedIndex = -1;
      sel.classList.add('f-sr'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true'); sel.setAttribute('data-f-native', '');

      var trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-select-trigger';
      trigger.setAttribute('role', 'combobox');
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      if (sel.getAttribute('aria-label')) trigger.setAttribute('aria-label', sel.getAttribute('aria-label'));
      if (el.getAttribute('aria-label')) trigger.setAttribute('aria-label', el.getAttribute('aria-label'));
      trigger.innerHTML = '<span class="custom-select-value"></span><span class="custom-select-caret">' + F.icons.chevronUpDown + '</span>';
      el.insertBefore(trigger, sel);
      var valueEl = trigger.firstChild;

      var panel = document.createElement('div');
      panel.className = 'custom-select-panel';
      panel.hidden = true;
      var header = null, search = null;
      if (o.search) {
        header = document.createElement('div'); header.className = 'listbox-search';
        header.innerHTML = F.icons.search + '<input type="text" autocomplete="off" spellcheck="false" aria-autocomplete="list" placeholder="' + R.esc(o.searchPlaceholder) + '">';
        search = header.querySelector('input');
        search.setAttribute('role', 'combobox');
        search.setAttribute('aria-expanded', 'true');
        search.setAttribute('aria-label', o.searchPlaceholder);
      }
      var list = F.makeList(panel, { host: search || trigger, empty: o.empty, header: header, onPick: function (it) { choose(it); close(); trigger.focus(); } });
      trigger.setAttribute('aria-controls', panel.id);
      if (search) search.setAttribute('aria-controls', panel.id);

      var closeFn = null, ta = F.typeahead();

      function refresh() {
        var items = F.itemsFromSelect(sel);
        list.set(items);
        var cur = items.filter(function (i) { return i.selected; })[0];
        if (cur) {
          valueEl.innerHTML = (cur.icon ? '<span class="custom-select-icon">' + cur.icon + '</span>' : '') + '<span class="custom-select-label">' + R.esc(cur.label) + '</span>';
          el.removeAttribute('data-placeholder-shown');
        } else {
          valueEl.innerHTML = '<span class="custom-select-label">' + R.esc(o.placeholder) + '</span>';
          el.setAttribute('data-placeholder-shown', '');
        }
        trigger.disabled = sel.disabled;
        el.toggleAttribute('data-disabled', sel.disabled);
        return items;
      }
      function choose(it) {
        if (!it || it.disabled) return;
        var changedNow = sel.value !== it.value || sel.selectedIndex < 0;
        it.option.selected = true;
        refresh();
        if (changedNow) {
          try { sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
          R.emit(el, 'change', { value: it.value, label: it.label });
        }
      }
      function open() {
        if (closeFn || sel.disabled) return;
        refresh();
        list.render('');
        el.setAttribute('data-state', 'open');
        trigger.setAttribute('aria-expanded', 'true');
        closeFn = F.float(panel, trigger, { matchWidth: true, placement: o.placement, onClose: function () {
          closeFn = null; el.setAttribute('data-state', 'closed'); trigger.setAttribute('aria-expanded', 'false'); trigger.removeAttribute('aria-activedescendant');
          if (search && document.activeElement === search) trigger.focus();
        } });
        var si = list.shown().map(function (i) { return i.selected; }).indexOf(true);
        if (si > -1) list.highlight(si); else list.move('first');
        if (search) { search.value = ''; setTimeout(function () { search.focus(); }, 0); }
      }
      function close() { if (closeFn) closeFn(); }

      function onKey(e) {
        var k = e.key, isOpen = !!closeFn;
        if (!isOpen) {
          if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') { e.preventDefault(); open(); if (k === 'ArrowUp' && list.index() < 0) list.move('last'); return; }
          if (k === 'Home' || k === 'End') { e.preventDefault(); refresh(); list.render(''); list.move(k === 'Home' ? 'first' : 'last'); choose(list.current()); return; }
          if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            refresh(); list.render('');
            var si = list.shown().map(function (i) { return i.selected; }).indexOf(true); list.highlight(si, false);
            if (list.seek(ta(k)) > -1) choose(list.current());
          }
          return;
        }
        if (k === 'ArrowDown') { e.preventDefault(); if (e.altKey) return; list.move(1); }
        else if (k === 'ArrowUp') { e.preventDefault(); if (e.altKey) { choose(list.current()); close(); return; } list.move(-1); }
        else if (k === 'Home' && e.currentTarget !== search) { e.preventDefault(); list.move('first'); }
        else if (k === 'End' && e.currentTarget !== search) { e.preventDefault(); list.move('last'); }
        else if (k === 'PageDown') { e.preventDefault(); list.move(8); }
        else if (k === 'PageUp') { e.preventDefault(); list.move(-8); }
        else if (k === 'Enter' || (k === ' ' && e.currentTarget !== search)) { e.preventDefault(); choose(list.current()); close(); trigger.focus(); }
        else if (k === 'Tab') { choose(list.current()); close(); }
        else if (k.length === 1 && e.currentTarget !== search && !e.metaKey && !e.ctrlKey) { list.seek(ta(k)); }
      }

      var offs = [
        R.on(trigger, 'click', function () { if (closeFn) close(); else open(); }),
        R.on(trigger, 'keydown', onKey),
        R.on(sel, 'change', function () { if (!closeFn) refresh(); }),
        R.on(sel.form || el, 'reset', function () { setTimeout(refresh, 0); })
      ];
      if (search) {
        offs.push(R.on(search, 'keydown', onKey));
        offs.push(R.on(search, 'input', function () { list.render(search.value); list.move('first'); }));
      }
      // Label click focuses the trigger
      var lab = sel.id && document.querySelector('label[for="' + sel.id + '"]');
      if (lab) { lab.htmlFor = R.ensureId(trigger, 'cs'); }
      refresh();

      return {
        destroy: function () { close(); offs.forEach(function (f) { f(); }); panel.remove(); },
        open: open, close: close, refresh: refresh,
        get value() { return sel.value; },
        set value(v) { sel.value = v; refresh(); }
      };
    }
  });
})(window.Ranj);

;
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

;
/* Field — aria wiring (label/hint/error) and Ranj.validate(form) built on native constraint validation */
(function (R) {
  'use strict';
  var F = R._forms;
  var ERR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5.2M12 16.3v.2"/></svg>';
  var CONTROL = 'input:not([type="hidden"]):not([data-f-hidden]), select, textarea';
  var VISIBLE = '[data-field-control], .custom-select-trigger, .combobox-input, .multi-select-input, .tag-input-field, .otp-slot, [role="slider"], [role="switch"], ' + CONTROL;

  function labelOf(field) { return field.querySelector(':scope > .label, :scope > .field-row > .label, :scope > .field-label-block > .label, :scope > label:not(.checkbox):not(.radio):not(.switch):not(.radio-card):not(.checkbox-card)'); }
  function visibleControl(field) {
    var list = R.$$(VISIBLE, field).filter(function (c) {
      if (c.classList.contains('f-sr') || c.getAttribute('aria-hidden') === 'true' || c.hasAttribute('data-f-native')) return false;
      if (c.type === 'file' && c.closest('.dropzone')) return false;
      return true;
    });
    return list[0] || null;
  }
  function natives(root) {
    return R.$$(CONTROL, root).filter(function (c) { return !c.disabled && c.willValidate !== false && !c.closest('fieldset[disabled]'); });
  }

  function wire(field) {
    var label = labelOf(field), ctrl = visibleControl(field);
    var hint = field.querySelector(':scope > .field-hint, :scope > .field-label-block > .field-hint, :scope > .field-row ~ .field-hint');
    var err = field.querySelector('.field-error');
    var group = R.$$('input[type="checkbox"], input[type="radio"]', field).length > 1;
    if (label) R.ensureId(label, 'lbl');
    if (hint) R.ensureId(hint, 'hint');
    if (err) { R.ensureId(err, 'err'); err.setAttribute('aria-live', 'polite'); }
    if (group) {
      if (!field.hasAttribute('role')) field.setAttribute('role', 'group');
      if (label) field.setAttribute('aria-labelledby', label.id);
      return;
    }
    if (!ctrl) return;
    var labelable = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(ctrl.tagName);
    if (label) {
      if (label.tagName === 'LABEL' && labelable && !label.htmlFor && !label.contains(ctrl)) label.htmlFor = R.ensureId(ctrl, 'ctl');
      else if (!labelable && !ctrl.hasAttribute('aria-labelledby') && !ctrl.hasAttribute('aria-label')) ctrl.setAttribute('aria-labelledby', label.id);
      else if (ctrl.tagName === 'BUTTON' && !ctrl.hasAttribute('aria-labelledby')) {
        ctrl.setAttribute('aria-labelledby', label.id + ' ' + R.ensureId(ctrl, 'ctl'));
      }
    }
    var ids = (ctrl.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    [hint, err].forEach(function (x) { if (x && ids.indexOf(x.id) < 0) ids.push(x.id); });
    if (ids.length) ctrl.setAttribute('aria-describedby', ids.join(' '));
    var nat = natives(field)[0];
    if (label && nat && nat.required && !label.classList.contains('label-required')) label.setAttribute('data-required', '');
    if (err && err.textContent.trim()) { field.setAttribute('data-invalid', ''); ctrl.setAttribute('aria-invalid', 'true'); }
  }

  function message(c) {
    var v = c.validity, d = function (k) { return c.getAttribute('data-error-' + k) || c.getAttribute('data-error'); };
    var name = (c.getAttribute('data-label') || '').trim();
    if (v.valueMissing) return d('required') || (c.type === 'checkbox' ? 'Please check this box to continue.' : c.tagName === 'SELECT' ? 'Please choose an option.' : (name ? name + ' is required.' : 'This field is required.'));
    if (v.typeMismatch) return d('type') || (c.type === 'email' ? 'Enter a valid email, like name@company.com.' : c.type === 'url' ? 'Enter a full URL, like https://example.com.' : c.validationMessage);
    if (v.tooShort) return d('minlength') || 'Use at least ' + c.minLength + ' characters (you have ' + c.value.length + ').';
    if (v.tooLong) return d('maxlength') || 'Use ' + c.maxLength + ' characters or fewer.';
    if (v.rangeUnderflow) return d('min') || 'Must be ' + c.min + ' or more.';
    if (v.rangeOverflow) return d('max') || 'Must be ' + c.max + ' or less.';
    if (v.stepMismatch) return d('step') || c.validationMessage;
    if (v.patternMismatch) return d('pattern') || c.title || 'Please match the requested format.';
    if (v.customError) return c.validationMessage;
    return c.validationMessage;
  }

  function errorEl(field, create) {
    var e = field.querySelector('.field-error');
    if (!e && create) {
      e = document.createElement('p'); e.className = 'field-error';
      e.setAttribute('aria-live', 'polite'); R.ensureId(e, 'err');
      field.appendChild(e);
      var c = visibleControl(field);
      if (c) { var ids = (c.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean); ids.push(e.id); c.setAttribute('aria-describedby', ids.join(' ')); }
    }
    return e;
  }

  function setError(target, msg, opts) {
    opts = opts || {};
    var field = target.classList && target.classList.contains('field') ? target : target.closest('.field');
    var ctrls = field ? natives(field) : [target];
    var vis = field ? visibleControl(field) : target;
    if (msg) {
      if (field) {
        var wasInvalid = field.hasAttribute('data-invalid');
        field.setAttribute('data-invalid', '');
        var e = errorEl(field, true);
        if (e.__msg !== msg) { e.innerHTML = ERR_ICON + '<span>' + R.esc(msg) + '</span>'; e.__msg = msg; e.removeAttribute('data-live'); void e.offsetWidth; e.setAttribute('data-live', ''); }
        if (opts.shake !== false && (!wasInvalid || opts.shake)) F.shake(shakeTarget(field, vis));
      }
      ctrls.forEach(function (c) { c.setAttribute('aria-invalid', 'true'); });
      if (vis) vis.setAttribute('aria-invalid', 'true');
      var box = vis && vis.closest('.custom-select, .combobox, .multi-select, .tag-input, .otp, .date-picker, .time-picker');
      if (box) box.setAttribute('aria-invalid', 'true');
    } else {
      if (field) {
        field.removeAttribute('data-invalid');
        var e2 = errorEl(field, false); if (e2) { e2.innerHTML = ''; e2.__msg = ''; }
        R.$$('[aria-invalid="true"]', field).forEach(function (x) { x.removeAttribute('aria-invalid'); });
      } else ctrls.forEach(function (c) { c.removeAttribute('aria-invalid'); });
    }
  }
  function shakeTarget(field, vis) {
    if (!vis) return field;
    var n = vis;
    while (n.parentElement && n.parentElement !== field) n = n.parentElement;
    return n.parentElement === field ? n : vis;
  }

  /** Validate one field (or bare control). Returns true when valid. */
  function check(target, opts) {
    var field = target.classList && target.classList.contains('field') ? target : null;
    var ctrls = field ? natives(field) : [target];
    var msg = '';
    for (var i = 0; i < ctrls.length && !msg; i++) {
      var c = ctrls[i];
      var match = c.getAttribute('data-match');
      if (match) {
        var other = (c.form || document).querySelector(match);
        c.setCustomValidity(other && c.value && other.value !== c.value ? (c.getAttribute('data-error-match') || 'These don’t match.') : '');
      }
      if (c.checkValidity && !c.checkValidity()) msg = message(c);
    }
    if (!msg && field) {
      var req = field.querySelector('[data-required]:not(.label)');
      if (req) {
        var hid = R.$$('input[type="hidden"]', req).filter(function (h) { return h.value; });
        if (!hid.length) msg = req.getAttribute('data-error-required') || req.getAttribute('data-error') || 'This field is required.';
      }
    }
    setError(field || target, msg, opts);
    return !msg;
  }

  /** Ranj.validate(form, { focus: true, shake: true }) → boolean */
  R.validate = function (form, opts) {
    opts = opts || {};
    if (typeof form === 'string') form = document.querySelector(form);
    if (!form) return true;
    var ok = true, first = null;
    var fields = R.$$('.field', form);
    fields.forEach(function (f) {
      if (f.closest('fieldset[disabled]')) return;
      if (!natives(f).length && !f.querySelector('[data-required]:not(.label)')) return;
      if (!check(f, { shake: opts.shake })) { ok = false; if (!first) first = f; }
    });
    natives(form).forEach(function (c) {
      if (c.closest('.field')) return;
      if (!check(c, opts)) { ok = false; if (!first) first = c; }
    });
    if (!ok && opts.focus !== false && first) {
      var v = first.classList && first.classList.contains('field') ? visibleControl(first) : first;
      if (v && v.focus) try { v.focus({ preventScroll: false }); } catch (e) {}
    }
    form.setAttribute('data-validated', '');
    R.emit(form, ok ? 'valid' : 'invalid', {});
    return ok;
  };
  R.fieldError = function (el, msg) { setError(el, msg, { shake: true }); };
  R.validateField = function (el) { return check(el); };

  R.define('field', {
    selector: '.field',
    mount: function (field) { wire(field); }
  });

  R.define('form-validate', {
    selector: 'form[data-validate]',
    mount: function (form) {
      form.noValidate = true;
      var offs = [];
      offs.push(R.on(form, 'submit', function (e) {
        if (!R.validate(form)) { e.preventDefault(); e.stopImmediatePropagation(); }
      }));
      function live(e) {
        var field = e.target.closest && e.target.closest('.field');
        if (!field || !form.contains(field)) return;
        if (form.hasAttribute('data-validated') || field.hasAttribute('data-invalid') || (e.type === 'focusout' && field.hasAttribute('data-touched'))) check(field, { shake: false });
      }
      offs.push(R.on(form, 'input', function (e) { var f = e.target.closest && e.target.closest('.field'); if (f) { f.setAttribute('data-touched', ''); if (f.hasAttribute('data-invalid')) check(f, { shake: false }); } }));
      offs.push(R.on(form, 'change', live));
      offs.push(R.on(form, 'ranj:change', live));
      offs.push(R.on(form, 'focusout', function (e) {
        var f = e.target.closest && e.target.closest('.field');
        if (f && !f.contains(e.relatedTarget) && f.hasAttribute('data-touched')) check(f, { shake: false });
      }));
      offs.push(R.on(form, 'reset', function () {
        form.removeAttribute('data-validated');
        R.$$('.field', form).forEach(function (f) { f.removeAttribute('data-touched'); setError(f, ''); });
      }));
      return function () { offs.forEach(function (o) { o(); }); };
    }
  });
})(window.Ranj);

;
/* File upload — dropzone (drag-over state, click/keyboard to browse), file list with previews, sizes, remove,
   simulated progress, accept / max-size / max-files validation. Keeps input.files in sync so forms submit natively. */
(function (R) {
  'use strict';
  var F = R._forms;

  function parseSize(s) {
    if (!s) return 0;
    var m = String(s).trim().match(/^([\d.]+)\s*(b|kb|mb|gb)?$/i); if (!m) return parseFloat(s) || 0;
    var n = parseFloat(m[1]), u = (m[2] || 'b').toLowerCase();
    return n * ({ b: 1, kb: 1024, mb: 1048576, gb: 1073741824 })[u];
  }
  function human(b) {
    if (b < 1024) return b + ' B';
    var u = ['KB', 'MB', 'GB'], i = -1;
    do { b /= 1024; i++; } while (b >= 1024 && i < 2);
    return (b >= 100 ? Math.round(b) : b.toFixed(1)) + ' ' + u[i];
  }
  function accepts(file, accept) {
    if (!accept) return true;
    var name = file.name.toLowerCase(), type = (file.type || '').toLowerCase();
    return accept.split(',').some(function (a) {
      a = a.trim().toLowerCase(); if (!a) return false;
      if (a[0] === '.') return name.slice(-a.length) === a;
      if (/\/\*$/.test(a)) return type.indexOf(a.slice(0, -1)) === 0;
      return type === a;
    });
  }
  function ext(name) { var m = /\.([a-z0-9]{1,5})$/i.exec(name); return m ? m[1].toUpperCase() : 'FILE'; }
  function kind(file) {
    var t = file.type || '';
    if (/^image\//.test(t)) return 'image';
    if (/pdf/.test(t) || /\.pdf$/i.test(file.name)) return 'pdf';
    if (/^video\//.test(t)) return 'video';
    if (/^audio\//.test(t)) return 'audio';
    if (/zip|compressed|tar/.test(t) || /\.(zip|rar|7z|gz)$/i.test(file.name)) return 'archive';
    if (/sheet|excel|csv/.test(t) || /\.(xlsx?|csv)$/i.test(file.name)) return 'sheet';
    return 'doc';
  }

  R.define('dropzone', {
    selector: '.dropzone',
    mount: function (el) {
      var input = el.querySelector('input[type="file"]');
      if (!input) { input = document.createElement('input'); input.type = 'file'; el.appendChild(input); }
      var o = R.opts(el, { maxSize: '', maxFiles: 0, simulate: false, list: '', accept: '' });
      var accept = o.accept || input.accept || '';
      var maxSize = parseSize(o.maxSize), multi = input.multiple, maxFiles = multi ? o.maxFiles : 1;
      var imageMode = el.classList.contains('dropzone-image');
      input.classList.add('f-sr'); input.tabIndex = -1; input.setAttribute('aria-hidden', 'true');
      if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
      el.setAttribute('role', 'button');
      if (!el.hasAttribute('aria-label')) {
        var t = el.querySelector('.dropzone-title');
        el.setAttribute('aria-label', (t ? t.textContent.trim() + '. ' : '') + 'Press Enter to browse' + (accept ? ' (' + accept + ')' : '') + '.');
      }
      var list = o.list ? document.querySelector(o.list) : null;
      var ownList = false;
      if (!list && !imageMode) { list = document.createElement('ul'); list.className = 'file-list'; ownList = true; el.insertAdjacentElement('afterend', list); }
      if (list) { list.setAttribute('aria-live', 'polite'); list.setAttribute('aria-label', 'Selected files'); }
      var preview = imageMode ? (el.querySelector('.dropzone-preview') || (function () { var p = document.createElement('div'); p.className = 'dropzone-preview'; el.appendChild(p); return p; })()) : null;
      var entries = [];   // { file, url, row, pct, status, error, timer }
      var dragDepth = 0;

      function syncInput() {
        try {
          var dt = new DataTransfer();
          entries.forEach(function (e) { if (!e.error) dt.items.add(e.file); });
          input.files = dt.files;
        } catch (err) {}
        el.toggleAttribute('data-has-files', entries.some(function (e) { return !e.error; }));
        R.emit(el, 'change', { files: entries.filter(function (e) { return !e.error; }).map(function (e) { return e.file; }) });
      }
      function rowHTML(e) {
        var f = e.file, k = kind(f);
        var thumb = e.url ? '<img src="' + e.url + '" alt="">' : '<span class="file-ext" data-kind="' + k + '">' + R.esc(ext(f.name)) + '</span>';
        return '<div class="file-thumb">' + thumb + '</div>' +
          '<div class="file-main"><div class="file-top"><span class="file-name" title="' + R.esc(f.name) + '">' + R.esc(f.name) + '</span>' +
          '<span class="file-size">' + human(f.size) + '</span></div>' +
          (e.error ? '<div class="file-error">' + R.esc(e.error) + '</div>' :
            '<div class="file-progress"' + (o.simulate ? '' : ' hidden') + '><div class="file-bar"><span></span></div><span class="file-pct">0%</span></div>') +
          '</div>' +
          '<button type="button" class="file-remove" aria-label="Remove ' + R.esc(f.name) + '">' + F.icons.x + '</button>';
      }
      function progress(e, pct, status) {
        e.pct = pct; if (status) e.status = status;
        if (!e.row) return;
        var bar = e.row.querySelector('.file-bar span'), txt = e.row.querySelector('.file-pct'), wrap = e.row.querySelector('.file-progress');
        if (wrap) wrap.hidden = false;
        if (bar) bar.style.transform = 'scaleX(' + pct / 100 + ')';
        if (txt) txt.textContent = e.status === 'done' ? 'Uploaded' : Math.round(pct) + '%';
        e.row.setAttribute('data-status', e.status || 'uploading');
      }
      function simulate(e) {
        var pct = 0;
        e.status = 'uploading';
        e.timer = setInterval(function () {
          pct = Math.min(100, pct + Math.random() * 18 + 4 * (1 + 1e6 / Math.max(e.file.size, 2e5)) / 3);
          if (pct >= 100) { clearInterval(e.timer); progress(e, 100, 'done'); R.emit(el, 'uploaded', { file: e.file }); }
          else progress(e, pct, 'uploading');
        }, R.reducedMotion ? 30 : 220);
      }
      function add(files) {
        var arr = [].slice.call(files || []);
        if (!multi) { clear(true); arr = arr.slice(0, 1); }
        arr.forEach(function (f) {
          var e = { file: f, url: null, pct: 0, status: 'ready', error: '' };
          var valid = entries.filter(function (x) { return !x.error; }).length;
          if (!accepts(f, accept)) e.error = 'File type not allowed' + (accept ? ' — use ' + accept.replace(/,/g, ', ') : '');
          else if (maxSize && f.size > maxSize) e.error = 'Too large — max ' + human(maxSize);
          else if (maxFiles && valid >= maxFiles) e.error = 'Limit reached — up to ' + maxFiles + ' files';
          else if (entries.some(function (x) { return !x.error && x.file.name === f.name && x.file.size === f.size; })) e.error = 'Already added';
          if (!e.error && /^image\//.test(f.type) && window.URL && URL.createObjectURL) e.url = URL.createObjectURL(f);
          if (e.error) R.emit(el, 'reject', { file: f, reason: e.error });
          entries.push(e);
          if (list) {
            var li = document.createElement('li'); li.className = 'file-item'; if (e.error) li.setAttribute('data-error', '');
            li.innerHTML = rowHTML(e); e.row = li; list.appendChild(li);
          }
          if (imageMode && !e.error) { preview.innerHTML = '<img src="' + e.url + '" alt="">'; el.setAttribute('data-has-preview', ''); }
          if (!e.error && o.simulate) simulate(e);
        });
        if (arr.some(function (f) { return entries.filter(function (x) { return x.file === f && x.error; }).length; })) F.shake(el);
        syncInput();
      }
      function removeEntry(e) {
        var i = entries.indexOf(e); if (i < 0) return;
        clearInterval(e.timer);
        if (e.url) URL.revokeObjectURL(e.url);
        entries.splice(i, 1);
        if (e.row) {
          var row = e.row;
          if (R.reducedMotion) row.remove();
          else { row.style.height = row.offsetHeight + 'px'; row.setAttribute('data-leaving', ''); void row.offsetHeight; row.style.height = '0px'; setTimeout(function () { row.remove(); }, 260); }
        }
        if (imageMode) { preview.innerHTML = ''; el.removeAttribute('data-has-preview'); }
        syncInput();
      }
      function clear(silent) {
        entries.slice().forEach(function (e) { clearInterval(e.timer); if (e.url) URL.revokeObjectURL(e.url); if (e.row) e.row.remove(); });
        entries = [];
        if (imageMode) { preview.innerHTML = ''; el.removeAttribute('data-has-preview'); }
        if (!silent) syncInput();
      }
      function browse() { input.value = ''; input.click(); }

      var offs = [
        R.on(el, 'click', function (e) { if (e.target === input || e.target.closest('a, .dropzone-clear')) return; browse(); }),
        R.on(el, 'keydown', function (e) { if (e.target === el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); browse(); } }),
        R.on(input, 'change', function () { if (input.files && input.files.length && !input.__syncing) { var fl = [].slice.call(input.files); add(fl); } }),
        R.on(el, 'dragenter', function (e) { e.preventDefault(); dragDepth++; el.setAttribute('data-dragover', ''); }),
        R.on(el, 'dragover', function (e) { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; }),
        R.on(el, 'dragleave', function () { if (--dragDepth <= 0) { dragDepth = 0; el.removeAttribute('data-dragover'); } }),
        R.on(el, 'drop', function (e) { e.preventDefault(); dragDepth = 0; el.removeAttribute('data-dragover'); if (e.dataTransfer && e.dataTransfer.files.length) add(e.dataTransfer.files); })
      ];
      if (list) offs.push(R.on(list, 'click', '.file-remove', function (ev, b) { var row = b.closest('.file-item'); var en = entries.filter(function (x) { return x.row === row; })[0]; if (en) removeEntry(en); el.focus(); }));
      var clr = el.querySelector('.dropzone-clear');
      if (clr) offs.push(R.on(clr, 'click', function (ev) { ev.stopPropagation(); clear(); }));
      if (input.form) offs.push(R.on(input.form, 'reset', function () { clear(); }));

      return {
        destroy: function () { offs.forEach(function (f) { f(); }); clear(true); if (ownList) list.remove(); },
        get files() { return entries.filter(function (e) { return !e.error; }).map(function (e) { return e.file; }); },
        add: add, clear: function () { clear(); },
        remove: function (file) { var e = entries.filter(function (x) { return x.file === file; })[0]; if (e) removeEntry(e); },
        progress: function (file, pct, status) { var e = entries.filter(function (x) { return x.file === file; })[0]; if (e) progress(e, pct, status || (pct >= 100 ? 'done' : 'uploading')); }
      };
    }
  });

  /** Ranj.fileUpload(el) → { files, add(files), remove(file), clear(), progress(file, pct, status) } */
  R.fileUpload = function (el) { if (typeof el === 'string') el = document.querySelector(el); return R.instance(el, 'dropzone'); };
  R.formatBytes = human;
})(window.Ranj);

;
/* Inline edit — click (or Enter) to edit text in place; Enter saves, Escape cancels, blur saves */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('inline-edit', {
    selector: '.inline-edit',
    mount: function (el) {
      var o = R.opts(el, { name: '', placeholder: 'Click to edit', multiline: false, required: false, maxlength: 0, blur: 'save', label: '' });
      var display = el.querySelector('.inline-edit-text');
      if (!display) {
        display = document.createElement('span'); display.className = 'inline-edit-text';
        while (el.firstChild) display.appendChild(el.firstChild);
        el.appendChild(display);
      }
      var value = display.textContent.trim();
      var icon = document.createElement('span'); icon.className = 'inline-edit-icon'; icon.setAttribute('aria-hidden', 'true'); icon.innerHTML = F.icons.pencil;
      el.appendChild(icon);
      var hidden = F.hidden(el, o.name || null, value);
      el.setAttribute('role', 'button'); el.tabIndex = 0;
      function aria() { el.setAttribute('aria-label', (o.label ? 'Edit ' + o.label.toLowerCase() : 'Edit') + ': ' + (value || 'empty')); }
      function paintDisplay() { display.textContent = value || o.placeholder; el.toggleAttribute('data-empty', !value); aria(); }
      var editor = null, editing = false;

      function start() {
        if (editing || el.hasAttribute('data-disabled')) return;
        editing = true;
        el.setAttribute('data-editing', '');
        el.removeAttribute('role'); el.removeAttribute('tabindex'); el.removeAttribute('aria-label');
        editor = document.createElement(o.multiline ? 'textarea' : 'input');
        editor.className = 'inline-edit-input';
        if (!o.multiline) editor.type = 'text';
        editor.value = value;
        editor.placeholder = o.placeholder;
        editor.setAttribute('aria-label', o.label || 'Edit text');
        if (o.maxlength) editor.maxLength = o.maxlength;
        var cs = getComputedStyle(display);
        editor.style.font = cs.font; editor.style.letterSpacing = cs.letterSpacing; editor.style.lineHeight = cs.lineHeight;
        editor.style.minWidth = Math.max(display.offsetWidth + 24, 64) + 'px';
        display.hidden = true; icon.hidden = true;
        el.insertBefore(editor, display);
        var grow = function () {
          if (o.multiline) { editor.style.height = 'auto'; editor.style.height = editor.scrollHeight + 'px'; }
          else { editor.style.width = '1px'; editor.style.width = Math.max(editor.scrollWidth + 6, 64) + 'px'; }
        };
        editor.addEventListener('input', grow);
        editor.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); }
          else if (e.key === 'Enter' && (!o.multiline || e.metaKey || e.ctrlKey)) { e.preventDefault(); finish(true); }
        });
        editor.addEventListener('blur', function () { if (editing) finish(o.blur !== 'cancel'); });
        grow();
        editor.focus(); editor.select();
        R.emit(el, 'edit', { value: value });
      }
      function finish(save) {
        if (!editing) return;
        var next = editor.value.trim(), prev = value;
        if (save && o.required && !next) { F.shake(editor); editor.setAttribute('aria-invalid', 'true'); editor.focus(); return; }
        if (save && next !== prev) {
          var ok = R.emit(el, 'save', { value: next, previous: prev });
          if (!ok) save = false;
        }
        editing = false;
        var hadFocus = document.activeElement === editor;
        editor.remove(); editor = null;
        display.hidden = false; icon.hidden = false;
        el.removeAttribute('data-editing');
        el.setAttribute('role', 'button'); el.tabIndex = 0;
        if (save && next !== prev) {
          value = next; if (hidden) hidden.value = value;
          paintDisplay();
          if (!R.reducedMotion) { el.classList.remove('inline-edit-saved'); void el.offsetWidth; el.classList.add('inline-edit-saved'); }
          R.emit(el, 'change', { value: value, previous: prev });
        } else { paintDisplay(); R.emit(el, 'cancel', { value: value }); }
        if (hadFocus) el.focus({ preventScroll: true });
      }
      var offs = [
        R.on(el, 'click', function (e) { if (!editing && !e.target.closest('a')) start(); }),
        R.on(el, 'keydown', function (e) { if (!editing && (e.key === 'Enter' || e.key === ' ' || e.key === 'F2') && e.target === el) { e.preventDefault(); start(); } })
      ];
      paintDisplay();
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); },
        edit: start, save: function () { finish(true); }, cancel: function () { finish(false); },
        get value() { return value; }, set value(v) { value = String(v); if (hidden) hidden.value = value; paintDisplay(); }
      };
    }
  });
})(window.Ranj);

;
/* Input — clearable shells, click-to-focus shells */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('input-wrap', {
    selector: '.input-wrap',
    setup: function () {
      // Clicking the shell's padding/icons focuses the inner input
      R.on(document, 'mousedown', '.input-wrap', function (e, wrap) {
        if (e.target.closest('button, a, input, textarea, select, [tabindex]')) return;
        var inp = wrap.querySelector('input, textarea');
        if (inp && !inp.disabled) { e.preventDefault(); inp.focus(); }
      });
    },
    mount: function (wrap) {
      if (!wrap.hasAttribute('data-clearable')) return;
      var inp = wrap.querySelector('input'); if (!inp) return;
      var btn = wrap.querySelector('.input-clear');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'input-btn input-clear';
        btn.setAttribute('aria-label', 'Clear'); btn.innerHTML = F.icons.x;
        var after = wrap.querySelector('.input-kbd, .input-suffix');
        if (after && after.parentNode === wrap) wrap.insertBefore(btn, after); else wrap.appendChild(btn);
      }
      btn.tabIndex = -1;
      function sync() { if (inp.value) wrap.setAttribute('data-has-value', ''); else wrap.removeAttribute('data-has-value'); }
      var off1 = R.on(inp, 'input', sync);
      var off2 = R.on(btn, 'click', function () {
        inp.value = ''; sync(); inp.focus();
        F.changed(wrap, { value: '' }, inp);
        R.emit(wrap, 'clear', {});
      });
      var off3 = R.on(inp, 'keydown', function (e) {
        if (e.key === 'Escape' && inp.value && wrap.hasAttribute('data-clear-on-escape')) { e.stopPropagation(); btn.click(); }
      });
      sync();
      return function () { off1(); off2(); off3(); };
    }
  });
})(window.Ranj);

;
/* Multi-select — chips inside the field, filterable listbox, backspace removes. Drives a hidden <select multiple>. */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('multi-select', {
    selector: '.multi-select',
    mount: function (el) {
      var o = R.opts(el, { placeholder: 'Select…', max: 0, name: '', closeOnSelect: false, empty: 'No matches.' });
      var sel = el.querySelector('select');
      if (!sel) {
        sel = document.createElement('select');
        var data = []; try { data = JSON.parse(el.getAttribute('data-options') || '[]'); } catch (e) {}
        data.forEach(function (d) { if (typeof d === 'string') d = { value: d, label: d }; var op = new Option(d.label, d.value, d.selected, d.selected); if (d.icon) op.setAttribute('data-icon', d.icon); if (d.group) op.setAttribute('data-group', d.group); sel.appendChild(op); });
        el.appendChild(sel);
      }
      if (!sel.multiple) { sel.multiple = true; R.$$('option', sel).forEach(function (op) { op.selected = op.defaultSelected; }); }
      if (o.name && !sel.name) sel.name = o.name;
      sel.classList.add('f-sr'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true'); sel.setAttribute('data-f-native', '');

      var box = document.createElement('div'); box.className = 'chip-box multi-select-box';
      var input = document.createElement('input');
      input.type = 'text'; input.className = 'multi-select-input'; input.autocomplete = 'off'; input.spellcheck = false;
      input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list'); input.setAttribute('aria-expanded', 'false');
      if (el.getAttribute('aria-label')) input.setAttribute('aria-label', el.getAttribute('aria-label'));
      var caret = document.createElement('button'); caret.type = 'button'; caret.className = 'input-btn'; caret.tabIndex = -1;
      caret.setAttribute('aria-label', 'Show options'); caret.innerHTML = F.icons.chevronDown;
      box.appendChild(input); box.appendChild(caret);
      el.insertBefore(box, sel);
      var live = document.createElement('span'); live.className = 'f-sr'; live.setAttribute('aria-live', 'polite'); el.appendChild(live);

      var panel = document.createElement('div'); panel.className = 'multi-select-panel'; panel.hidden = true;
      var list = F.makeList(panel, { host: input, multi: true, empty: o.empty, onPick: function (it) { toggle(it); } });
      input.setAttribute('aria-controls', panel.id);
      var closeFn = null;

      function options() { return F.itemsFromSelect(sel).map(function (it) { it.selected = it.option.selected; if (!it.group) it.group = it.option.getAttribute('data-group') || ''; return it; }); }
      function chips() {
        R.$$('.input-chip', box).forEach(function (c) { c.remove(); });
        var chosen = options().filter(function (i) { return i.selected; });
        chosen.forEach(function (it) {
          var c = document.createElement('span'); c.className = 'input-chip'; c.setAttribute('data-value', it.value);
          c.innerHTML = (it.icon ? '<span class="input-chip-icon">' + it.icon + '</span>' : '') + '<span class="input-chip-label">' + R.esc(it.label) + '</span>' +
            '<button type="button" class="input-chip-remove" tabindex="-1" aria-label="Remove ' + R.esc(it.label) + '">' + F.icons.x + '</button>';
          box.insertBefore(c, input);
        });
        if (box.__noAnim) R.$$('.input-chip', box).forEach(function (c) { c.style.animation = 'none'; });
        input.placeholder = chosen.length ? '' : o.placeholder;
        el.toggleAttribute('data-has-value', chosen.length > 0);
        el.toggleAttribute('data-full', !!o.max && chosen.length >= o.max);
        return chosen;
      }
      function render() {
        var full = !!o.max && options().filter(function (i) { return i.selected; }).length >= o.max;
        var items = options().map(function (it) { if (full && !it.selected) it.disabled = true; return it; });
        var keep = list.current() && list.current().value;
        list.set(items).render(input.value);
        var idx = keep != null ? list.shown().map(function (i) { return i.value; }).indexOf(keep) : -1;
        if (idx > -1) list.highlight(idx); else list.move('first');
      }
      function emit() {
        var vals = R.$$('option', sel).filter(function (op) { return op.selected; }).map(function (op) { return op.value; });
        el.__emitting = true;
        try { sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
        el.__emitting = false;
        R.emit(el, 'change', { value: vals });
      }
      function toggle(it) {
        if (!it || it.disabled) return;
        it.option.selected = !it.option.selected;
        live.textContent = it.label + (it.option.selected ? ' selected' : ' removed');
        box.__noAnim = false;
        var prevChips = R.$$('.input-chip', box).map(function (c) { return c.getAttribute('data-value'); });
        chips();
        R.$$('.input-chip', box).forEach(function (c) { if (prevChips.indexOf(c.getAttribute('data-value')) > -1) c.style.animation = 'none'; });
        if (input.value) { input.value = ''; }
        render(); emit();
        if (o.closeOnSelect) close();
        else if (closeFn) R.position(panel, box, { placement: 'bottom-start', offset: 6 });
      }
      function removeValue(v) {
        var op = R.$$('option', sel).filter(function (x) { return x.value === v; })[0]; if (!op) return;
        var chip = box.querySelector('.input-chip[data-value="' + CSS.escape(v) + '"]');
        op.selected = false; live.textContent = op.textContent.trim() + ' removed';
        var finish = function () { box.__noAnim = true; chips(); box.__noAnim = false; if (closeFn) { render(); R.position(panel, box, { placement: 'bottom-start', offset: 6 }); } emit(); };
        if (chip && !R.reducedMotion) { chip.setAttribute('data-leaving', ''); setTimeout(finish, 150); } else finish();
      }
      function open() {
        if (closeFn || sel.disabled) return;
        render();
        el.setAttribute('data-state', 'open'); input.setAttribute('aria-expanded', 'true');
        closeFn = F.float(panel, box, { matchWidth: true, onClose: function () { closeFn = null; el.setAttribute('data-state', 'closed'); input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); input.value = ''; } });
      }
      function close() { if (closeFn) closeFn(); }
      function clearActive() { R.$$('.input-chip[data-active]', box).forEach(function (c) { c.removeAttribute('data-active'); }); }

      var offs = [
        R.on(box, 'mousedown', function (e) {
          if (e.target.closest('.input-chip-remove')) { e.preventDefault(); return; }
          if (e.target !== input) { e.preventDefault(); input.focus(); if (closeFn && e.target.closest('.input-btn')) close(); else open(); }
        }),
        R.on(box, 'click', '.input-chip-remove', function (e, b) { e.stopPropagation(); removeValue(b.parentNode.getAttribute('data-value')); input.focus(); }),
        R.on(input, 'focus', function () { el.setAttribute('data-focus', ''); }),
        R.on(input, 'blur', function () { el.removeAttribute('data-focus'); clearActive(); setTimeout(function () { if (document.activeElement !== input) close(); }, 0); }),
        R.on(input, 'input', function () { clearActive(); if (!closeFn) open(); else render(); }),
        R.on(input, 'keydown', function (e) {
          var k = e.key, active = box.querySelector('.input-chip[data-active]');
          if (k === 'Backspace' && !input.value) {
            e.preventDefault();
            var all = R.$$('.input-chip', box);
            if (active) removeValue(active.getAttribute('data-value'));
            else if (all.length) all[all.length - 1].setAttribute('data-active', '');
            return;
          }
          if (k === 'ArrowLeft' && !input.selectionStart && !input.value) {
            var cs = R.$$('.input-chip', box); var i = active ? cs.indexOf(active) - 1 : cs.length - 1;
            clearActive(); if (cs[Math.max(0, i)]) cs[Math.max(0, i)].setAttribute('data-active', ''); return;
          }
          if (k === 'ArrowRight' && active) { var cs2 = R.$$('.input-chip', box), j = cs2.indexOf(active) + 1; clearActive(); if (cs2[j]) cs2[j].setAttribute('data-active', ''); return; }
          if (k === 'Delete' && active) { e.preventDefault(); removeValue(active.getAttribute('data-value')); return; }
          clearActive();
          if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); if (!closeFn) { open(); return; } list.move(k === 'ArrowDown' ? 1 : -1); }
          else if (k === 'Home' && closeFn && !input.value) { e.preventDefault(); list.move('first'); }
          else if (k === 'End' && closeFn && !input.value) { e.preventDefault(); list.move('last'); }
          else if (k === 'Enter') { if (closeFn && list.current()) { e.preventDefault(); toggle(list.current()); } else if (!closeFn) { e.preventDefault(); open(); } }
          else if (k === 'Tab') close();
        }),
        R.on(sel, 'change', function () { if (!el.__emitting) { box.__noAnim = true; chips(); box.__noAnim = false; } })
      ];
      box.__noAnim = true; chips(); box.__noAnim = false;
      return {
        destroy: function () { close(); offs.forEach(function (f) { f(); }); panel.remove(); },
        open: open, close: close,
        get value() { return R.$$('option', sel).filter(function (op) { return op.selected; }).map(function (op) { return op.value; }); },
        set value(arr) { R.$$('option', sel).forEach(function (op) { op.selected = arr.indexOf(op.value) > -1; }); chips(); }
      };
    }
  });
})(window.Ranj);

;
/* Number input — − / + steppers with hold-to-repeat, min/max/step, keyboard, optional wheel, Intl formatting */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('number-input', {
    selector: '.number-input',
    mount: function (el) {
      var inp = el.querySelector('input'); if (!inp) return;
      var o = R.opts(el, { format: '', prefix: '', suffix: '', decimals: -1, wheel: false, locale: '' });
      var min = inp.min !== '' ? parseFloat(inp.min) : -Infinity, max = inp.max !== '' ? parseFloat(inp.max) : Infinity;
      var step = parseFloat(inp.step) || 1;
      var dec = o.decimals > -1 ? o.decimals : (String(step).split('.')[1] || '').length;
      var name = inp.name;
      // Use a text field so we can format; the real value lives in a hidden input
      inp.type = 'text';
      inp.setAttribute('inputmode', dec ? 'decimal' : 'numeric');
      inp.setAttribute('role', 'spinbutton');
      inp.setAttribute('autocomplete', 'off');
      if (name) { inp.removeAttribute('name'); }
      var hidden = F.hidden(el, name || null);
      var nf;
      var loc = o.locale || undefined;
      try {
        var p = o.format.split(':');
        if (p[0] === 'currency') nf = new Intl.NumberFormat(loc, { style: 'currency', currency: p[1] || 'USD', minimumFractionDigits: dec, maximumFractionDigits: dec });
        else if (p[0] === 'percent') nf = { format: function (v) { return v.toFixed(dec) + '%'; } };
        else nf = new Intl.NumberFormat(loc, { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: o.format !== 'plain' });
      } catch (e) { nf = { format: function (v) { return v.toFixed(dec); } }; }
      function fmt(v) { return v == null || isNaN(v) ? '' : o.prefix + nf.format(v) + o.suffix; }
      function parse(s) {
        s = String(s).replace(/[^\d.,\-]/g, '');
        if (!s) return null;
        // accept both 1,234.5 and 1.234,5
        var lc = s.lastIndexOf(','), ld = s.lastIndexOf('.');
        if (lc > ld && s.length - lc - 1 !== 3) s = s.replace(/\./g, '').replace(',', '.');
        else s = s.replace(/,/g, '');
        var v = parseFloat(s); return isNaN(v) ? null : v;
      }
      var val = parse(inp.value);
      if (inp.hasAttribute('value') && inp.getAttribute('value') !== '') val = parseFloat(inp.getAttribute('value'));

      // Build steppers if missing
      var dn = el.querySelector('[data-step-down]'), up = el.querySelector('[data-step-up]');
      if (!dn) { dn = document.createElement('button'); dn.setAttribute('data-step-down', ''); dn.innerHTML = F.icons.minus; el.insertBefore(dn, inp); }
      if (!up) { up = document.createElement('button'); up.setAttribute('data-step-up', ''); up.innerHTML = F.icons.plus; inp.insertAdjacentElement('afterend', up); }
      [dn, up].forEach(function (b, i) { b.type = 'button'; b.classList.add('number-input-btn'); b.tabIndex = -1; b.setAttribute('aria-label', (i ? 'Increase' : 'Decrease') + (inp.getAttribute('aria-label') ? ' ' + inp.getAttribute('aria-label').toLowerCase() : '')); });
      if (el.classList.contains('number-input-stacked')) {
        var stack = document.createElement('div'); stack.className = 'number-input-stack';
        up.innerHTML = F.icons.chevronDown; dn.innerHTML = F.icons.chevronDown;
        stack.appendChild(up); stack.appendChild(dn); el.appendChild(stack);
      }

      function render(focused) {
        inp.value = val == null ? '' : focused ? String(+val.toFixed(dec)) : fmt(val);
        if (hidden) hidden.value = val == null ? '' : String(+val.toFixed(dec));
        if (val != null) { inp.setAttribute('aria-valuenow', val); inp.setAttribute('aria-valuetext', fmt(val)); } else { inp.removeAttribute('aria-valuenow'); inp.removeAttribute('aria-valuetext'); }
        if (isFinite(min)) inp.setAttribute('aria-valuemin', min);
        if (isFinite(max)) inp.setAttribute('aria-valuemax', max);
        dn.disabled = inp.disabled || (val != null && val <= min);
        up.disabled = inp.disabled || (val != null && val >= max);
        el.toggleAttribute('data-at-min', val != null && val <= min);
        el.toggleAttribute('data-at-max', val != null && val >= max);
      }
      function set(v, dir) {
        if (v != null) v = R.clamp(+(+v).toFixed(dec), min, max);
        var changed = v !== val;
        val = v;
        render(document.activeElement === inp);
        if (changed) {
          if (dir && !R.reducedMotion) { inp.classList.remove('num-up', 'num-down'); void inp.offsetWidth; inp.classList.add(dir > 0 ? 'num-up' : 'num-down'); }
          if (hidden) try { hidden.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
          R.emit(el, 'change', { value: val });
        } else if (dir) F.shake(el);
        return changed;
      }
      function stepBy(n) {
        if (val == null) return set(isFinite(min) ? min : isFinite(max) ? Math.min(0, max) : 0, n);
        var base = val;
        // snap to step grid
        var origin = isFinite(min) ? min : 0;
        var next = Math.round((base + n * step - origin) / step) * step + origin;
        return set(next, n);
      }

      var hold = 0, rep = 0;
      function stopHold() { clearTimeout(hold); clearInterval(rep); hold = rep = 0; }
      function startHold(n) {
        stopHold();
        if (!stepBy(n)) return;
        var speed = 120;
        hold = setTimeout(function tick() {
          if (!stepBy(n)) { stopHold(); return; }
          speed = Math.max(30, speed * 0.88);
          hold = setTimeout(tick, speed);
        }, 420);
      }
      var offs = [
        R.on(dn, 'pointerdown', function (e) { if (e.button) return; e.preventDefault(); inp.focus({ preventScroll: true }); startHold(-1); }),
        R.on(up, 'pointerdown', function (e) { if (e.button) return; e.preventDefault(); inp.focus({ preventScroll: true }); startHold(1); }),
        R.on(window, 'pointerup', stopHold), R.on(window, 'pointercancel', stopHold), R.on(window, 'blur', stopHold),
        R.on(dn, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stepBy(-1); } }),
        R.on(up, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stepBy(1); } }),
        R.on(inp, 'focus', function () { render(true); setTimeout(function () { try { inp.select(); } catch (e) {} }, 0); }),
        R.on(inp, 'blur', function () { var v = parse(inp.value); set(v); render(false); }),
        R.on(inp, 'keydown', function (e) {
          var k = e.key, mult = e.shiftKey ? 10 : 1;
          if (k === 'ArrowUp') { e.preventDefault(); stepBy(mult); }
          else if (k === 'ArrowDown') { e.preventDefault(); stepBy(-mult); }
          else if (k === 'PageUp') { e.preventDefault(); stepBy(10); }
          else if (k === 'PageDown') { e.preventDefault(); stepBy(-10); }
          else if (k === 'Home' && isFinite(min)) { e.preventDefault(); set(min, -1); }
          else if (k === 'End' && isFinite(max)) { e.preventDefault(); set(max, 1); }
          else if (k === 'Enter') { set(parse(inp.value)); render(true); }
        }),
        R.on(inp, 'input', function () { inp.value = inp.value.replace(/[^\d.,\-]/g, ''); })
      ];
      if (o.wheel) offs.push(R.on(inp, 'wheel', function (e) { if (document.activeElement !== inp) return; e.preventDefault(); stepBy(e.deltaY < 0 ? 1 : -1); }, { passive: false }));
      if (inp.form) offs.push(R.on(inp.form, 'reset', function () { setTimeout(function () { val = parse(inp.getAttribute('value')); render(false); }, 0); }));
      render(false);
      return {
        destroy: function () { stopHold(); offs.forEach(function (f) { f(); }); },
        get value() { return val; }, set value(v) { set(v); },
        stepUp: function () { stepBy(1); }, stepDown: function () { stepBy(-1); }
      };
    }
  });
})(window.Ranj);

;
/* OTP input — n slots, auto-advance, paste fills all, backspace goes back, masked, complete event */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('otp', {
    selector: '.otp',
    mount: function (el) {
      var o = R.opts(el, { length: 6, name: '', group: 0, type: 'numeric', masked: false, autofocus: false, label: 'Verification code' });
      var slots = R.$$('input.otp-slot', el);
      if (!slots.length) {
        var html = '';
        for (var i = 0; i < o.length; i++) {
          if (o.group && i && i % o.group === 0) html += '<span class="otp-sep" aria-hidden="true"></span>';
          html += '<input class="otp-slot">';
        }
        el.insertAdjacentHTML('beforeend', html);
        slots = R.$$('input.otp-slot', el);
      }
      var n = slots.length;
      var re = o.type === 'alphanumeric' ? /[a-z0-9]/i : o.type === 'alpha' ? /[a-z]/i : /\d/;
      if (!el.hasAttribute('role')) el.setAttribute('role', 'group');
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) el.setAttribute('aria-label', o.label);
      slots.forEach(function (s, i) {
        s.type = o.masked ? 'password' : 'text';
        s.setAttribute('inputmode', o.type === 'numeric' ? 'numeric' : 'text');
        s.setAttribute('autocomplete', i === 0 ? 'one-time-code' : 'off');
        s.setAttribute('aria-label', 'Character ' + (i + 1) + ' of ' + n);
        s.setAttribute('maxlength', i === 0 ? String(n) : '1');
        s.spellcheck = false;
        if (o.type !== 'numeric') s.setAttribute('autocapitalize', 'characters');
      });
      var hidden = F.hidden(el, o.name || null, '');

      function value() { return slots.map(function (s) { return s.value; }).join(''); }
      function sync(silent) {
        var v = value();
        if (hidden) hidden.value = v;
        slots.forEach(function (s) { s.toggleAttribute('data-filled', !!s.value); });
        el.toggleAttribute('data-complete', v.length === n);
        if (el.getAttribute('data-state') === 'error') el.removeAttribute('data-state');
        if (silent === true) return;
        R.emit(el, 'change', { value: v, complete: v.length === n });
        if (v.length === n && el.__last !== v) { R.emit(el, 'complete', { value: v }); }
        el.__last = v;
      }
      function clean(str) { return String(str).split('').filter(function (c) { return re.test(c); }).map(function (c) { return o.type === 'numeric' ? c : c.toUpperCase(); }); }
      function fill(start, chars) {
        var i = start;
        chars.forEach(function (c) { if (i < n) { slots[i].value = c; pop(slots[i]); i++; } });
        sync();
        focusAt(Math.min(i, n - 1));
      }
      function pop(s) { if (R.reducedMotion) return; s.classList.remove('otp-pop'); void s.offsetWidth; s.classList.add('otp-pop'); }
      function focusAt(i) { var s = slots[R.clamp(i, 0, n - 1)]; s.focus(); try { s.setSelectionRange(0, s.value.length); } catch (e) {} }
      function firstEmpty() { for (var i = 0; i < n; i++) if (!slots[i].value) return i; return n - 1; }

      var offs = [];
      slots.forEach(function (s, i) {
        offs.push(R.on(s, 'input', function () {
          var chars = clean(s.value);
          if (!chars.length) { s.value = ''; sync(); return; }
          if (chars.length > 1) { s.value = ''; fill(chars.length >= n ? 0 : i, chars); return; }
          s.value = chars[0]; pop(s); sync();
          if (i < n - 1) focusAt(i + 1);
        }));
        offs.push(R.on(s, 'keydown', function (e) {
          var k = e.key;
          if (k === 'Backspace') {
            e.preventDefault();
            if (s.value) { s.value = ''; sync(); }
            else if (i > 0) { slots[i - 1].value = ''; sync(); focusAt(i - 1); }
          } else if (k === 'Delete') { e.preventDefault(); s.value = ''; sync(); }
          else if (k === 'ArrowLeft') { e.preventDefault(); focusAt(i - 1); }
          else if (k === 'ArrowRight') { e.preventDefault(); focusAt(i + 1); }
          else if (k === 'Home') { e.preventDefault(); focusAt(0); }
          else if (k === 'End') { e.preventDefault(); focusAt(firstEmpty()); }
          else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            if (!re.test(k)) { e.preventDefault(); return; }
            if (s.value) { e.preventDefault(); s.value = o.type === 'numeric' ? k : k.toUpperCase(); pop(s); sync(); if (i < n - 1) focusAt(i + 1); }
          }
        }));
        offs.push(R.on(s, 'paste', function (e) {
          var t = (e.clipboardData || window.clipboardData).getData('text');
          var chars = clean(t);
          e.preventDefault();
          if (!chars.length) return;
          fill(chars.length >= n ? 0 : i, chars);
        }));
        offs.push(R.on(s, 'focus', function () {
          // Don't let people skip ahead past empty slots
          var fe = firstEmpty();
          if (!s.value && i > fe && !el.hasAttribute('data-free')) { focusAt(fe); return; }
          setTimeout(function () { try { s.setSelectionRange(0, s.value.length); } catch (e) {} }, 0);
        }));
      });
      if (o.autofocus) setTimeout(function () { focusAt(0); }, 50);
      sync(true);
      el.__last = value();
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); },
        get value() { return value(); },
        set value(v) { slots.forEach(function (s) { s.value = ''; }); fill(0, clean(v)); },
        clear: function () { slots.forEach(function (s) { s.value = ''; }); sync(); focusAt(0); },
        setState: function (st) {
          if (st) el.setAttribute('data-state', st); else el.removeAttribute('data-state');
          if (st === 'error') F.shake(el);
          slots.forEach(function (s) { if (st === 'error') s.setAttribute('aria-invalid', 'true'); else s.removeAttribute('aria-invalid'); });
        }
      };
    }
  });

  /** Ranj.otp(el) → instance { value, clear(), setState('error'|'success'|null) } */
  R.otp = function (el) { if (typeof el === 'string') el = document.querySelector(el); return R.instance(el, 'otp'); };
})(window.Ranj);

;
/* Password — reveal toggle, caps-lock hint, strength meter with rules checklist */
(function (R) {
  'use strict';
  var F = R._forms;
  var RULES = {
    length: function (n) { return { label: 'At least ' + n + ' characters', test: function (v) { return v.length >= n; } }; },
    lower: function () { return { label: 'A lowercase letter', test: function (v) { return /[a-z]/.test(v); } }; },
    upper: function () { return { label: 'An uppercase letter', test: function (v) { return /[A-Z]/.test(v); } }; },
    number: function () { return { label: 'A number', test: function (v) { return /\d/.test(v); } }; },
    symbol: function () { return { label: 'A symbol (!@#$…)', test: function (v) { return /[^A-Za-z0-9\s]/.test(v); } }; }
  };
  var LEVELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  var COMMON = /^(password|123456|qwerty|letmein|welcome|admin|iloveyou|abc123|111111|monkey)/i;

  function score(v, rules) {
    if (!v) return 0;
    var passed = rules.filter(function (r) { return r.test(v); }).length;
    var s = Math.round(passed / rules.length * 3);
    if (v.length >= 12) s++;
    if (v.length >= 16 && passed >= rules.length - 1) s++;
    if (COMMON.test(v) || /^(.)\1+$/.test(v)) s = Math.min(s, 1);
    if (v.length < 6) s = Math.min(s, 1);
    return R.clamp(s, v ? 1 : 0, 4);
  }

  R.define('password', {
    selector: '.password',
    mount: function (el) {
      var inp = el.querySelector('input'); if (!inp) return;
      var o = R.opts(el, { strength: false, rules: 'length:8,lower,upper,number,symbol', toggle: true, capslock: true });
      var wrap = el.classList.contains('input-wrap') ? el : inp.closest('.input-wrap');
      if (!wrap || !el.contains(wrap) && wrap !== el) {
        wrap = document.createElement('div'); wrap.className = 'input-wrap';
        inp.classList.remove('input');
        inp.parentNode.insertBefore(wrap, inp); wrap.appendChild(inp);
      }
      var offs = [], btn = null;
      if (o.toggle) {
        btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'input-btn password-toggle';
        btn.setAttribute('aria-label', 'Show password'); btn.setAttribute('aria-pressed', 'false');
        if (inp.id) btn.setAttribute('aria-controls', inp.id);
        btn.innerHTML = '<span class="password-eye">' + F.icons.eye + '</span><span class="password-eye-off">' + F.icons.eyeOff + '</span>';
        wrap.appendChild(btn);
        offs.push(R.on(btn, 'mousedown', function (e) { e.preventDefault(); }));
        offs.push(R.on(btn, 'click', function () {
          var show = inp.type === 'password';
          var a = inp.selectionStart, b = inp.selectionEnd;
          inp.type = show ? 'text' : 'password';
          btn.setAttribute('aria-pressed', String(show));
          btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
          el.toggleAttribute('data-revealed', show);
          if (document.activeElement === inp) try { inp.setSelectionRange(a, b); } catch (e) {}
          R.emit(el, 'reveal', { visible: show });
        }));
      }
      var caps = null;
      if (o.capslock) {
        caps = document.createElement('p'); caps.className = 'field-hint password-caps'; caps.hidden = true;
        caps.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 4 8 8h-4v4H8v-4H4z"/><path d="M8 20h8"/></svg>Caps Lock is on';
        caps.setAttribute('aria-live', 'polite');
        wrap.insertAdjacentElement('afterend', caps);
        var ck = function (e) { if (e.getModifierState) caps.hidden = !e.getModifierState('CapsLock'); };
        offs.push(R.on(inp, 'keydown', ck), R.on(inp, 'keyup', ck), R.on(inp, 'blur', function () { caps.hidden = true; }));
      }
      if (o.strength) {
        var rules = o.rules.split(',').map(function (r) { var p = r.trim().split(':'); return RULES[p[0]] ? RULES[p[0]](parseInt(p[1], 10) || 8) : null; }).filter(Boolean);
        var meter = document.createElement('div'); meter.className = 'password-meter'; meter.setAttribute('data-score', '0');
        meter.innerHTML = '<div class="password-bars" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
          '<div class="password-meter-text"><span class="password-level">Enter a password</span></div>';
        var listEl = null;
        if (!el.hasAttribute('data-no-rules')) {
          listEl = document.createElement('ul'); listEl.className = 'password-rules';
          listEl.innerHTML = rules.map(function (r) { return '<li><span class="password-rule-icon" aria-hidden="true">' + F.icons.check + '</span><span>' + R.esc(r.label) + '</span><span class="f-sr"> — not met</span></li>'; }).join('');
        }
        var after = caps || wrap;
        after.insertAdjacentElement('afterend', meter);
        if (listEl) meter.insertAdjacentElement('afterend', listEl);
        var level = meter.querySelector('.password-level');
        level.setAttribute('aria-live', 'polite');
        R.ensureId(meter, 'pwm');
        inp.setAttribute('aria-describedby', ((inp.getAttribute('aria-describedby') || '') + ' ' + meter.id).trim());
        var upd = function () {
          var v = inp.value, s = score(v, rules);
          meter.setAttribute('data-score', String(s));
          level.textContent = v ? LEVELS[s] : 'Enter a password';
          if (listEl) R.$$('li', listEl).forEach(function (li, i) { var ok = rules[i].test(v); li.toggleAttribute('data-met', ok); li.lastChild.textContent = ok ? ' — met' : ' — not met'; });
          R.emit(el, 'strength', { score: s, label: LEVELS[s] });
        };
        offs.push(R.on(inp, 'input', upd));
        upd();
      }
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });
  R.passwordScore = function (v, rules) {
    rules = (rules || 'length:8,lower,upper,number,symbol').split(',').map(function (r) { var p = r.split(':'); return RULES[p[0]](parseInt(p[1], 10) || 8); });
    return score(v, rules);
  };
})(window.Ranj);

;
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

;
/* Search input — icon, ⌘K / Ctrl K shortcut hint, loading spinner, clear, debounced ranj:search */
(function (R) {
  'use strict';
  var F = R._forms;
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  R.define('search-input', {
    selector: '.search-input',
    mount: function (el) {
      var inp = el.querySelector('input'); if (!inp) return;
      var o = R.opts(el, { shortcut: '', debounce: 250, minChars: 0 });
      el.classList.add('input-wrap');
      if (!inp.type || inp.type === 'text') inp.type = 'search';
      if (!inp.hasAttribute('aria-label') && !inp.id) inp.setAttribute('aria-label', inp.placeholder || 'Search');
      inp.autocomplete = 'off';
      if (!el.querySelector('.input-icon')) el.insertAdjacentHTML('afterbegin', '<span class="input-icon search-input-icon">' + F.icons.search + '</span>');
      var icon = el.querySelector('.input-icon');
      var spin = document.createElement('span'); spin.className = 'search-input-spinner'; spin.innerHTML = F.icons.spinner; spin.setAttribute('aria-hidden', 'true');
      icon.appendChild(spin);
      var clear = document.createElement('button'); clear.type = 'button'; clear.className = 'input-btn input-clear'; clear.tabIndex = -1;
      clear.setAttribute('aria-label', 'Clear search'); clear.innerHTML = F.icons.x;
      inp.insertAdjacentElement('afterend', clear);
      var kbd = null;
      if (o.shortcut) {
        kbd = document.createElement('kbd'); kbd.className = 'input-kbd search-input-kbd';
        var key = o.shortcut.length === 1 ? o.shortcut.toUpperCase() : o.shortcut;
        kbd.innerHTML = o.shortcut === '/' ? '/' : (mac ? '<span>⌘</span>' : '<span>Ctrl</span>') + key;
        kbd.setAttribute('aria-hidden', 'true');
        el.appendChild(kbd);
        inp.setAttribute('aria-keyshortcuts', o.shortcut === '/' ? '/' : (mac ? 'Meta+' : 'Control+') + key);
      }
      var t = 0, last = inp.value;
      function sync() { el.toggleAttribute('data-has-value', !!inp.value); }
      function fire(now) {
        clearTimeout(t);
        var run = function () { if (inp.value === last && !now) return; last = inp.value; if (inp.value.length >= o.minChars || !inp.value) R.emit(el, 'search', { value: inp.value, query: inp.value.trim() }); };
        if (now) run(); else t = setTimeout(run, o.debounce);
      }
      var offs = [
        R.on(inp, 'input', function () { sync(); R.emit(el, 'change', { value: inp.value }); fire(false); }),
        R.on(inp, 'keydown', function (e) {
          if (e.key === 'Enter') { fire(true); R.emit(el, 'submit', { value: inp.value }); }
          else if (e.key === 'Escape') { if (inp.value) { e.preventDefault(); e.stopPropagation(); inp.value = ''; sync(); R.emit(el, 'change', { value: '' }); fire(true); } else inp.blur(); }
        }),
        R.on(clear, 'click', function () { inp.value = ''; sync(); inp.focus(); R.emit(el, 'change', { value: '' }); fire(true); R.emit(el, 'clear', {}); })
      ];
      if (o.shortcut) offs.push(R.on(document, 'keydown', function (e) {
        var k = e.key && e.key.toLowerCase();
        var hit = o.shortcut === '/' ? (k === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable)
          : (k === o.shortcut.toLowerCase() && (mac ? e.metaKey : e.ctrlKey) && !e.altKey);
        if (hit && el.isConnected && el.offsetParent !== null) { e.preventDefault(); inp.focus(); inp.select(); }
      }));
      sync();
      return {
        destroy: function () { clearTimeout(t); offs.forEach(function (f) { f(); }); },
        loading: function (on) { el.toggleAttribute('data-loading', !!on); inp.setAttribute('aria-busy', String(!!on)); },
        get value() { return inp.value; }, set value(v) { inp.value = v; sync(); }
      };
    }
  });
  /** Ranj.searchLoading(el, bool) — toggle the spinner */
  R.searchLoading = function (el, on) { var i = R.instance(el, 'search-input'); if (i) i.loading(on); else el.toggleAttribute('data-loading', !!on); };
})(window.Ranj);

;
/* Segmented control — positions a sliding indicator under the checked radio */
(function (R) {
  'use strict';
  R.define('segmented', {
    selector: '.segmented',
    mount: function (el) {
      if (!el.hasAttribute('role')) el.setAttribute('role', 'radiogroup');
      var ind = el.querySelector('.segmented-indicator');
      if (!ind) { ind = document.createElement('span'); ind.className = 'segmented-indicator'; ind.setAttribute('aria-hidden', 'true'); el.insertBefore(ind, el.firstChild); }
      function current() { var i = el.querySelector('input:checked'); return i ? i.closest('label') : null; }
      function place(instant) {
        var c = current();
        if (!c) { ind.style.opacity = '0'; return; }
        ind.style.opacity = '';
        if (instant) el.setAttribute('data-instant', '');
        ind.style.setProperty('--x', c.offsetLeft + 'px');
        ind.style.setProperty('--w', c.offsetWidth + 'px');
        if (instant) { void ind.offsetWidth; el.removeAttribute('data-instant'); }
        el.setAttribute('data-ready', '');
      }
      var offs = [R.on(el, 'change', function (e) {
        if (e.target.type !== 'radio') return;
        place(false);
        R.emit(el, 'change', { value: e.target.value });
        var c = current(); if (c && c.scrollIntoView && el.scrollWidth > el.clientWidth) c.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      })];
      var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { place(true); }) : null;
      if (ro) { ro.observe(el); R.$$('label', el).forEach(function (l) { ro.observe(l); }); }
      var form = el.closest('form');
      if (form) offs.push(R.on(form, 'reset', function () { setTimeout(function () { place(false); }, 0); }));
      place(true);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { place(true); });
      return { destroy: function () { offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); }, update: function () { place(false); } };
    }
  });
})(window.Ranj);

;
/* Slider (native range enhanced) + Range slider (custom dual thumb) */
(function (R) {
  'use strict';
  var F = R._forms;

  function formatter(el) {
    var f = el.getAttribute('data-format') || '', pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var nf = null, parts = f.split(':');
    try {
      if (parts[0] === 'currency') nf = new Intl.NumberFormat(undefined, { style: 'currency', currency: parts[1] || 'USD', maximumFractionDigits: 0 });
      else if (parts[0] === 'percent') nf = { format: function (v) { return Math.round(v) + '%'; } };
      else if (parts[0] === 'compact') nf = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });
      else nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
    } catch (e) { nf = { format: String }; }
    var labels = null;
    if (el.getAttribute('data-labels')) labels = el.getAttribute('data-labels').split('|');
    return function (v, min, step) {
      if (labels) { var i = Math.round((v - (min || 0)) / (step || 1)); if (labels[i] != null) return labels[i]; }
      return pre + nf.format(v) + suf;
    };
  }
  function parseMarks(el, min, max, step, fmt) {
    var m = el.getAttribute('data-marks');
    if (m == null) return null;
    if (m === '' || m === 'true' || m === 'steps') {
      var out = [], n = Math.round((max - min) / step);
      var every = n > 10 ? Math.ceil(n / 5) : 1;
      for (var i = 0; i <= n; i += every) out.push({ v: min + i * step, label: fmt(min + i * step, min, step) });
      if ((n % every) !== 0) out.push({ v: max, label: fmt(max, min, step) });
      return out;
    }
    return m.split(',').map(function (s) { var p = s.split(':'); var v = parseFloat(p[0]); return { v: v, label: p[1] != null ? p.slice(1).join(':') : fmt(v, min, step) }; });
  }
  function decimals(step) { var s = String(step); return s.indexOf('.') > -1 ? s.split('.')[1].length : 0; }
  function snap(v, min, max, step) { var r = Math.round((v - min) / step) * step + min; return R.clamp(+r.toFixed(decimals(step)), min, max); }

  /* ---------- Native range enhancement ---------- */
  R.define('slider', {
    selector: '.slider',
    mount: function (el) {
      var inp = el.querySelector('input[type="range"]'); if (!inp) return;
      var inner = el.querySelector('.slider-inner');
      if (!inner) { inner = document.createElement('div'); inner.className = 'slider-inner'; inp.parentNode.insertBefore(inner, inp); inner.appendChild(inp); }
      var fmt = formatter(el);
      var bubble = null;
      if (el.hasAttribute('data-bubble')) { bubble = document.createElement('span'); bubble.className = 'slider-bubble'; bubble.setAttribute('aria-hidden', 'true'); inner.appendChild(bubble); }
      var min = parseFloat(inp.min || 0), max = parseFloat(inp.max || 100), step = parseFloat(inp.step) || 1;
      var marks = parseMarks(el, min, max, step, fmt), tickEls = [], markEls = [];
      if (marks) {
        var ticks = document.createElement('div'); ticks.className = 'slider-ticks'; ticks.setAttribute('aria-hidden', 'true');
        var row = document.createElement('div'); row.className = 'slider-marks'; row.setAttribute('aria-hidden', 'true');
        marks.forEach(function (mk) {
          var p = (mk.v - min) / (max - min);
          var t = document.createElement('span'); t.className = 'slider-tick'; t.style.left = 'calc(var(--thumb) / 2 + (100% - var(--thumb)) * ' + p + ')'; ticks.appendChild(t); tickEls.push(t);
          if (!el.hasAttribute('data-ticks-only')) {
            var l = document.createElement('span'); l.className = 'slider-mark'; l.textContent = mk.label; l.style.left = 'calc(var(--thumb) / 2 + (100% - var(--thumb)) * ' + p + ')';
            l.addEventListener('click', function () { inp.value = mk.v; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true })); });
            row.appendChild(l); markEls.push(l);
          }
        });
        inner.appendChild(ticks);
        if (markEls.length) el.appendChild(row);
      }
      var scope = el.closest('.field') || el.parentNode;
      var outs = R.$$('[data-slider-output]', scope).filter(function (o) { var t = o.getAttribute('data-slider-output'); return !t || (inp.id && t === '#' + inp.id); });
      function upd() {
        var v = parseFloat(inp.value), p = max > min ? (v - min) / (max - min) : 0;
        el.style.setProperty('--p', p);
        var txt = fmt(v, min, step);
        if (bubble) bubble.textContent = txt;
        outs.forEach(function (o) { o.textContent = txt; });
        if (el.hasAttribute('data-format') || el.hasAttribute('data-prefix') || el.hasAttribute('data-suffix') || el.hasAttribute('data-labels')) inp.setAttribute('aria-valuetext', txt);
        if (marks) marks.forEach(function (mk, i) { var on = mk.v <= v; if (tickEls[i]) tickEls[i].toggleAttribute('data-on', on); if (markEls[i]) markEls[i].toggleAttribute('data-on', mk.v === v); });
      }
      var offs = [
        R.on(inp, 'input', function () { upd(); R.emit(el, 'input', { value: parseFloat(inp.value) }); }),
        R.on(inp, 'change', function () { R.emit(el, 'change', { value: parseFloat(inp.value) }); }),
        R.on(inp, 'pointerdown', function () { el.setAttribute('data-dragging', ''); var up = function () { el.removeAttribute('data-dragging'); window.removeEventListener('pointerup', up); }; window.addEventListener('pointerup', up); })
      ];
      if (inp.form) offs.push(R.on(inp.form, 'reset', function () { setTimeout(upd, 0); }));
      upd();
      return { destroy: function () { offs.forEach(function (f) { f(); }); }, update: upd };
    }
  });

  /* ---------- Custom range slider (one or two thumbs) ---------- */
  R.define('range-slider', {
    selector: '.range-slider',
    mount: function (el) {
      var o = R.opts(el, { min: 0, max: 100, step: 1, value: '25,75', minGap: 0, name: '', nameMin: '', nameMax: '', labelMin: 'Minimum', labelMax: 'Maximum', disabled: false });
      var min = o.min, max = o.max, step = o.step, fmt = formatter(el);
      var vals = String(o.value).split(',').map(function (s) { return snap(parseFloat(s), min, max, step); });
      var single = vals.length === 1;
      if (single) el.setAttribute('data-single', '');
      el.innerHTML = '';
      var hist = el.getAttribute('data-histogram');
      var histEl = null;
      if (hist) {
        histEl = document.createElement('div'); histEl.className = 'slider-histogram'; histEl.setAttribute('aria-hidden', 'true');
        var hv = hist.split(',').map(Number), hm = Math.max.apply(null, hv);
        hv.forEach(function (h) { var s = document.createElement('span'); s.style.height = (6 + 94 * h / hm) + '%'; histEl.appendChild(s); });
        el.appendChild(histEl);
      }
      var rail = document.createElement('div'); rail.className = 'slider-rail';
      var range = document.createElement('div'); range.className = 'slider-range';
      rail.appendChild(range);
      el.appendChild(rail);
      var marks = parseMarks(el, min, max, step, fmt), tickEls = [], markEls = [];
      if (marks) {
        var ticks = document.createElement('div'); ticks.className = 'slider-ticks'; ticks.setAttribute('aria-hidden', 'true');
        var row = document.createElement('div'); row.className = 'slider-marks'; row.setAttribute('aria-hidden', 'true');
        marks.forEach(function (mk) {
          var p = (mk.v - min) / (max - min);
          var t = document.createElement('span'); t.className = 'slider-tick'; t.style.left = (p * 100) + '%'; ticks.appendChild(t); tickEls.push(t);
          if (!el.hasAttribute('data-ticks-only')) { var l = document.createElement('span'); l.className = 'slider-mark'; l.textContent = mk.label; l.style.left = (p * 100) + '%'; row.appendChild(l); markEls.push(l); }
        });
        rail.appendChild(ticks);
        if (markEls.length) el.appendChild(row);
      }
      var groupLabel = el.getAttribute('aria-label') || '';
      var thumbs = vals.map(function (v, i) {
        var t = document.createElement('div');
        t.className = 'slider-thumb'; t.tabIndex = o.disabled ? -1 : 0;
        t.setAttribute('role', 'slider');
        t.setAttribute('aria-orientation', 'horizontal');
        t.setAttribute('aria-label', single ? (groupLabel || 'Value') : ((groupLabel ? groupLabel + ' ' : '') + (i ? o.labelMax : o.labelMin).toLowerCase()).replace(/^./, function (c) { return c.toUpperCase(); }));
        if (el.hasAttribute('data-bubble')) t.innerHTML = '<span class="slider-bubble" aria-hidden="true"></span>';
        rail.appendChild(t);
        return t;
      });
      if (o.disabled) el.setAttribute('aria-disabled', 'true');
      var hiddenA, hiddenB;
      if (single) hiddenA = F.hidden(el, o.name || o.nameMin || null);
      else {
        hiddenA = F.hidden(el, o.nameMin || (o.name ? o.name + '[min]' : null));
        hiddenB = F.hidden(el, o.nameMax || (o.name ? o.name + '[max]' : null));
      }
      var outs = R.$$('[data-slider-output]', el.closest('.field') || el.parentNode);

      function render() {
        var pa = (vals[0] - min) / (max - min), pb = single ? pa : (vals[1] - min) / (max - min);
        el.style.setProperty('--a', single ? 0 : pa); el.style.setProperty('--b', pb);
        thumbs.forEach(function (t, i) {
          var v = vals[i];
          t.style.setProperty('--p', (v - min) / (max - min));
          t.setAttribute('aria-valuenow', v);
          t.setAttribute('aria-valuemin', i === 1 ? vals[0] + o.minGap : min);
          t.setAttribute('aria-valuemax', i === 0 && !single ? vals[1] - o.minGap : max);
          t.setAttribute('aria-valuetext', fmt(v, min, step));
          var b = t.querySelector('.slider-bubble'); if (b) b.textContent = fmt(v, min, step);
        });
        if (hiddenA) hiddenA.value = vals[0];
        if (hiddenB) hiddenB.value = vals[1];
        var txt = single ? fmt(vals[0], min, step) : fmt(vals[0], min, step) + ' – ' + fmt(vals[1], min, step);
        outs.forEach(function (x) { x.textContent = txt; });
        var lo = single ? min : vals[0], hi = single ? vals[0] : vals[1];
        tickEls.forEach(function (t, i) { t.toggleAttribute('data-on', marks[i].v >= lo && marks[i].v <= hi); });
        markEls.forEach(function (m, i) { m.toggleAttribute('data-on', marks[i].v === vals[0] || marks[i].v === vals[1]); });
        if (histEl) R.$$('span', histEl).forEach(function (s, i, arr) { var v = min + (i + .5) * (max - min) / arr.length; s.toggleAttribute('data-on', v >= lo && v <= hi); });
      }
      function set(i, v, commit) {
        v = snap(v, min, max, step);
        if (!single) { if (i === 0) v = Math.min(v, vals[1] - o.minGap); else v = Math.max(v, vals[0] + o.minGap); }
        if (v === vals[i] && !commit) return;
        var changed = v !== vals[i];
        vals[i] = v; render();
        var detail = { value: single ? vals[0] : vals.slice() };
        if (changed) R.emit(el, 'input', detail);
        if (commit) R.emit(el, 'change', detail);
        if (changed && hiddenA) try { hiddenA.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
      }
      function valueAt(x) { var r = rail.getBoundingClientRect(); return min + R.clamp((x - r.left) / r.width, 0, 1) * (max - min); }

      var drag = -1, startVals = null;
      function down(e) {
        if (o.disabled || e.button > 0) return;
        var v = valueAt(e.clientX), i = 0;
        var th = e.target.closest('.slider-thumb');
        if (th) i = thumbs.indexOf(th);
        else if (!single) { i = Math.abs(v - vals[0]) <= Math.abs(v - vals[1]) ? 0 : 1; if (vals[0] === vals[1]) i = v < vals[0] ? 0 : 1; }
        drag = i; startVals = vals.slice();
        e.preventDefault();
        thumbs[i].focus({ preventScroll: true });
        thumbs[i].setAttribute('data-dragging', '');
        try { rail.setPointerCapture(e.pointerId); } catch (err) {}
        if (!th) { el.setAttribute('data-animate', ''); set(i, v); setTimeout(function () { el.removeAttribute('data-animate'); }, 300); }
      }
      function move(e) { if (drag < 0) return; el.removeAttribute('data-animate'); set(drag, valueAt(e.clientX)); }
      function up() {
        if (drag < 0) return;
        thumbs[drag].removeAttribute('data-dragging');
        var changed = startVals.some(function (v, i) { return v !== vals[i]; });
        if (changed) R.emit(el, 'change', { value: single ? vals[0] : vals.slice() });
        drag = -1;
      }
      function key(e) {
        var i = thumbs.indexOf(e.currentTarget), big = Math.max(step, (max - min) / 10), v = vals[i];
        var k = e.key;
        if (k === 'ArrowRight' || k === 'ArrowUp') v += e.shiftKey ? big : step;
        else if (k === 'ArrowLeft' || k === 'ArrowDown') v -= e.shiftKey ? big : step;
        else if (k === 'PageUp') v += big;
        else if (k === 'PageDown') v -= big;
        else if (k === 'Home') v = i === 1 ? vals[0] + o.minGap : min;
        else if (k === 'End') v = i === 0 && !single ? vals[1] - o.minGap : max;
        else return;
        e.preventDefault();
        set(i, v, true);
      }
      var offs = [R.on(rail, 'pointerdown', down), R.on(rail, 'pointermove', move), R.on(rail, 'pointerup', up), R.on(rail, 'pointercancel', up), R.on(rail, 'lostpointercapture', up)];
      thumbs.forEach(function (t) { offs.push(R.on(t, 'keydown', key)); });
      render();
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); },
        get value() { return single ? vals[0] : vals.slice(); },
        set value(v) { var a = [].concat(v); a.forEach(function (x, i) { vals[i] = snap(+x, min, max, step); }); render(); }
      };
    }
  });
})(window.Ranj);

;
/* Switch — role="switch", missing track/thumb insertion, async loading helper */
(function (R) {
  'use strict';
  R.define('switch', {
    selector: 'label.switch',
    mount: function (el) {
      var inp = el.querySelector(':scope > input[type="checkbox"]'); if (!inp) return;
      if (!inp.hasAttribute('role')) inp.setAttribute('role', 'switch');
      var track = el.querySelector('.switch-track');
      if (!track) {
        track = document.createElement('span'); track.className = 'switch-track'; track.setAttribute('aria-hidden', 'true');
        track.innerHTML = '<span class="switch-thumb"></span>';
        inp.insertAdjacentElement('afterend', track);
      } else if (!track.querySelector('.switch-thumb')) track.insertAdjacentHTML('beforeend', '<span class="switch-thumb"></span>');
      function sync() { inp.setAttribute('aria-checked', String(inp.checked)); }
      var off = R.on(inp, 'change', function () { sync(); R.emit(el, 'change', { value: inp.checked, checked: inp.checked }); });
      sync();
      return off;
    }
  });
  /** Ranj.switchLoading(labelEl, true|false) — shows a spinner in the thumb and sets aria-busy */
  R.switchLoading = function (el, on) {
    el.toggleAttribute('data-loading', !!on);
    var inp = el.querySelector('input'); if (inp) inp.setAttribute('aria-busy', String(!!on));
  };
})(window.Ranj);

;
/* Tag input — type and press Enter / comma to add, paste to split, Backspace to remove, max tags, pattern check */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('tag-input', {
    selector: '.tag-input',
    mount: function (el) {
      var o = R.opts(el, { name: '', value: '', max: 0, placeholder: 'Add a tag…', separators: ',;', pattern: '', allowDuplicates: false, lowercase: false, maxLength: 0, suggestions: '' });
      var box = el.querySelector('.chip-box');
      if (!box) { box = document.createElement('div'); box.className = 'chip-box tag-input-box'; el.appendChild(box); }
      var input = box.querySelector('input');
      if (!input) { input = document.createElement('input'); input.type = 'text'; box.appendChild(input); }
      input.classList.add('tag-input-field'); input.autocomplete = 'off';
      if (el.getAttribute('aria-label') && !input.hasAttribute('aria-label')) input.setAttribute('aria-label', el.getAttribute('aria-label'));
      var describe = document.createElement('span'); describe.className = 'f-sr'; describe.id = R.uid('tagh');
      describe.textContent = 'Press Enter or comma to add. Backspace removes the last tag.';
      el.appendChild(describe);
      input.setAttribute('aria-describedby', ((input.getAttribute('aria-describedby') || '') + ' ' + describe.id).trim());
      var live = document.createElement('span'); live.className = 'f-sr'; live.setAttribute('aria-live', 'polite'); el.appendChild(live);
      var re = o.pattern ? new RegExp(o.pattern === 'email' ? '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' : o.pattern) : null;
      var multi = /\[\]$/.test(o.name);
      var tags = [];
      R.$$('.input-chip', box).forEach(function (c) { tags.push(c.getAttribute('data-value') || c.textContent.trim()); c.remove(); });
      if (o.value) String(o.value).split(',').forEach(function (t) { t = t.trim(); if (t) tags.push(t); });
      var count = el.querySelector('.tag-input-count');

      function sync(anim) {
        R.$$('.input-chip', box).forEach(function (c) { c.remove(); });
        tags.forEach(function (t, i) {
          var c = document.createElement('span'); c.className = 'input-chip'; c.setAttribute('data-value', t);
          if (re && !re.test(t)) c.setAttribute('data-invalid', '');
          if (anim !== i) c.style.animation = 'none';
          c.innerHTML = '<span class="input-chip-label">' + R.esc(t) + '</span><button type="button" class="input-chip-remove" tabindex="-1" aria-label="Remove ' + R.esc(t) + '">' + F.icons.x + '</button>';
          box.insertBefore(c, input);
        });
        input.placeholder = tags.length ? (el.getAttribute('data-placeholder-more') || '') : o.placeholder;
        var full = !!o.max && tags.length >= o.max;
        el.toggleAttribute('data-full', full);
        input.readOnly = full;
        if (full) input.placeholder = '';
        if (count) count.textContent = tags.length + (o.max ? ' / ' + o.max : '');
        // hidden inputs
        R.$$('input[data-f-hidden]', el).forEach(function (h) { h.remove(); });
        if (o.name) {
          if (multi) tags.forEach(function (t) { var h = document.createElement('input'); h.type = 'hidden'; h.name = o.name; h.value = t; h.setAttribute('data-f-hidden', ''); el.appendChild(h); });
          else F.hidden(el, o.name, tags.join(','));
        }
      }
      function emit() { R.emit(el, 'change', { value: tags.slice() }); }
      function add(raw) {
        var t = String(raw).trim().replace(/\s+/g, ' ');
        if (!t) return false;
        if (o.lowercase) t = t.toLowerCase();
        if (o.maxLength) t = t.slice(0, o.maxLength);
        if (o.max && tags.length >= o.max) { F.shake(box); R.emit(el, 'reject', { value: t, reason: 'max' }); return false; }
        if (!o.allowDuplicates) {
          var i = tags.map(function (x) { return x.toLowerCase(); }).indexOf(t.toLowerCase());
          if (i > -1) { var c = R.$$('.input-chip', box)[i]; F.shake(c); R.emit(el, 'reject', { value: t, reason: 'duplicate' }); return false; }
        }
        var ev = R.emit(el, 'add', { value: t });
        if (!ev) return false;
        tags.push(t); sync(tags.length - 1); live.textContent = t + ' added';
        return true;
      }
      function removeAt(i) {
        if (i < 0 || i >= tags.length) return;
        var chip = R.$$('.input-chip', box)[i], t = tags[i];
        var done = function () { tags.splice(i, 1); sync(-1); live.textContent = t + ' removed'; R.emit(el, 'remove', { value: t }); emit(); };
        if (chip && !R.reducedMotion) { chip.setAttribute('data-leaving', ''); setTimeout(done, 150); } else done();
      }
      function commit() {
        var v = input.value;
        if (!v.trim()) return false;
        var parts = v.split(new RegExp('[' + o.separators.replace(/[\]\\^-]/g, '\\$&') + '\\n]'));
        var any = false;
        parts.forEach(function (p) { if (add(p)) any = true; });
        input.value = '';
        if (any) emit();
        return true;
      }
      function clearActive() { R.$$('.input-chip[data-active]', box).forEach(function (c) { c.removeAttribute('data-active'); }); }

      var offs = [
        R.on(box, 'mousedown', function (e) { if (e.target !== input) { e.preventDefault(); input.focus(); } }),
        R.on(box, 'click', '.input-chip-remove', function (e, b) { removeAt(R.$$('.input-chip', box).indexOf(b.parentNode)); input.focus(); }),
        R.on(input, 'keydown', function (e) {
          var k = e.key, active = box.querySelector('.input-chip[data-active]');
          if (e.isComposing) return;
          if (k === 'Enter' || (o.separators.indexOf(k) > -1 && k.length === 1) || (k === 'Tab' && input.value.trim())) {
            if (input.value.trim()) { e.preventDefault(); commit(); }
            else if (k !== 'Tab' && k !== 'Enter') e.preventDefault();
            return;
          }
          if (k === 'Backspace' && !input.value) {
            e.preventDefault();
            if (active) removeAt(R.$$('.input-chip', box).indexOf(active));
            else { var all = R.$$('.input-chip', box); if (all.length) all[all.length - 1].setAttribute('data-active', ''); }
            return;
          }
          if (k === 'Escape' && active) { clearActive(); return; }
          clearActive();
        }),
        R.on(input, 'paste', function (e) {
          var text = (e.clipboardData || window.clipboardData).getData('text');
          if (!text || !new RegExp('[' + o.separators.replace(/[\]\\^-]/g, '\\$&') + '\\n\\t]').test(text)) return;
          e.preventDefault();
          var any = false;
          text.split(new RegExp('[' + o.separators.replace(/[\]\\^-]/g, '\\$&') + '\\n\\t]')).forEach(function (p) { if (add(p)) any = true; });
          if (any) emit();
        }),
        R.on(input, 'blur', function () { clearActive(); if (el.hasAttribute('data-add-on-blur')) commit(); })
      ];
      sync(-1);
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); },
        add: function (t) { if (add(t)) emit(); }, remove: function (t) { removeAt(tags.indexOf(t)); },
        get value() { return tags.slice(); },
        set value(arr) { tags = (arr || []).slice(); sync(-1); }
      };
    }
  });
})(window.Ranj);

;
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

;
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

;
/* Toggle (aria-pressed button) + Toggle group (single | multiple, roving tabindex, hidden input) */
(function (R) {
  'use strict';
  var F = R._forms;

  function pressed(t) { return t.getAttribute('aria-pressed') === 'true'; }
  function setPressed(t, on) { t.setAttribute('aria-pressed', String(on)); t.classList.toggle('active', on); t.setAttribute('data-state', on ? 'on' : 'off'); }
  function valueOf(t) { return t.getAttribute('data-value') || t.getAttribute('value') || t.getAttribute('aria-label') || t.textContent.trim(); }

  R.define('toggle', {
    selector: '.toggle',
    setup: function () {
      R.on(document, 'click', '.toggle', function (e, t) {
        if (t.disabled || t.getAttribute('aria-disabled') === 'true') return;
        var group = t.closest('.toggle-group');
        if (group && group.__ranjGroup) { group.__ranjGroup(t); return; }
        setPressed(t, !pressed(t));
        R.emit(t, 'change', { pressed: pressed(t), value: pressed(t) });
      });
    },
    mount: function (t) {
      if (t.tagName === 'BUTTON' && !t.hasAttribute('type')) t.type = 'button';
      if (!t.hasAttribute('aria-pressed')) setPressed(t, t.classList.contains('active') || t.getAttribute('data-state') === 'on');
      else t.setAttribute('data-state', pressed(t) ? 'on' : 'off');
    }
  });

  R.define('toggle-group', {
    selector: '.toggle-group',
    mount: function (g) {
      var multi = g.hasAttribute('data-multiple');
      var required = g.hasAttribute('data-required-one');   // single: can't deselect the last one
      var o = R.opts(g, { name: '', orientation: g.classList.contains('toggle-group-vertical') ? 'vertical' : 'horizontal' });
      if (!g.hasAttribute('role')) g.setAttribute('role', 'group');
      var hidden = F.hidden(g, o.name || null);
      function items() { return R.$$('.toggle', g); }
      function enabled() { return items().filter(function (t) { return !t.disabled; }); }
      function value() { var v = items().filter(pressed).map(valueOf); return multi ? v : (v[0] || ''); }
      function sync() {
        var list = enabled(), on = list.filter(pressed)[0] || list[0];
        list.forEach(function (t) { t.tabIndex = t === on ? 0 : -1; });
        items().forEach(function (t) { if (t.disabled) t.tabIndex = -1; });
        if (hidden) hidden.value = multi ? value().join(',') : value();
      }
      g.__ranjGroup = function (t) {
        var was = pressed(t);
        if (multi) setPressed(t, !was);
        else {
          if (was && required) return;
          items().forEach(function (x) { setPressed(x, false); });
          setPressed(t, !was);
        }
        sync();
        t.tabIndex = 0; items().forEach(function (x) { if (x !== t) x.tabIndex = -1; });
        R.emit(g, 'change', { value: value() });
      };
      var offRov = R.roving(g, '.toggle', { orientation: o.orientation, onMove: function (t) { items().forEach(function (x) { x.tabIndex = x === t ? 0 : -1; }); } });
      sync();
      return {
        destroy: function () { offRov(); g.__ranjGroup = null; },
        get value() { return value(); },
        set value(v) { var arr = [].concat(v); items().forEach(function (t) { setPressed(t, arr.indexOf(valueOf(t)) > -1); }); sync(); }
      };
    }
  });
})(window.Ranj);
