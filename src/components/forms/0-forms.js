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
