/* Ranj UI — Data table: sort, search, column visibility, selection, pagination, bulk actions.
 * Enhance a plain <table class="table" data-table ...> or render from JSON with Ranj.dataTable(el, opts). */
(function (R) {
  'use strict';
  var NS = 'data-table';
  var I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    sort: '<svg class="dt-sort-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="up" d="M5 6.5 8 3.5l3 3"/><path class="down" d="M5 9.5l3 3 3-3"/></svg>',
    cols: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h10M4 18h6"/><circle cx="18" cy="16" r="3"/><path d="M18 11.5v1.5M18 19v1.5M21.9 16h-1.5M15.6 16h-1.5"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>',
    first: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    last: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>',
    empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8.5 11h5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  };

  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function slug(s) { return String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'col'; }
  function numOf(s) {
    if (typeof s === 'number') return s;
    var t = String(s).replace(/[\s,$€£¥₹%]/g, '').replace(/^\((.*)\)$/, '-$1').replace(/[−–]/g, '-');
    var m = /^([+-]?\d*\.?\d+)([kmb])?$/i.exec(t); if (!m) return NaN;
    return parseFloat(m[1]) * ({ k: 1e3, m: 1e6, b: 1e9 }[(m[2] || '').toLowerCase()] || 1);
  }
  function dateOf(s) { if (s instanceof Date) return +s; var t = String(s).trim(); if (!/[a-z]|-|\//i.test(t) || /^\d+$/.test(t)) return NaN; var v = Date.parse(t); return isNaN(v) ? NaN : v; }
  function detect(vals) {
    var vs = vals.filter(function (v) { return String(v).trim() !== '' && String(v).trim() !== '—'; });
    if (!vs.length) return 'text';
    if (vs.every(function (v) { return !isNaN(numOf(v)); })) return 'number';
    if (vs.every(function (v) { return !isNaN(dateOf(v)); })) return 'date';
    return 'text';
  }
  function keyOf(v, type) {
    if (type === 'number' || type === 'currency' || type === 'percent') { var n = numOf(v); return isNaN(n) ? -Infinity : n; }
    if (type === 'date') { var d = dateOf(v); return isNaN(d) ? -Infinity : d; }
    return String(v == null ? '' : v).toLowerCase();
  }
  var collator = typeof Intl !== 'undefined' ? new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }) : null;

  function DataTable(table, cfg) {
    var self = this;
    cfg = cfg || {};
    var o = R.opts(table, { pageSize: 10, pageSizes: '5,10,20,50', search: true, columnsMenu: true, select: false, pagination: true, bulk: '', searchPlaceholder: 'Search…', emptyTitle: 'No results', emptyText: 'Try a different search term.', info: true });
    for (var k in cfg) if (cfg[k] !== undefined && k in o) o[k] = cfg[k];
    if (typeof o.bulk === 'string') o.bulk = o.bulk ? o.bulk.split(',').map(function (s) { s = s.trim(); return { label: s, action: slug(s), danger: /delete|remove|archive/i.test(s) }; }) : [];
    if (o.bulk.length && !table.hasAttribute('data-select') && cfg.select === undefined) o.select = true;
    this.table = table; this.o = o;
    var thead = table.tHead, tbody = table.tBodies[0];
    if (!tbody) { tbody = document.createElement('tbody'); table.appendChild(tbody); }
    this.tbody = tbody;
    var ths = thead ? [].slice.call(thead.rows[0].cells) : [];
    var cols = this.cols = ths.map(function (th, i) {
      var c = (cfg.columns && cfg.columns[i]) || {};
      return {
        th: th, i: i,
        key: c.key || th.getAttribute('data-key') || slug(th.textContent),
        label: c.label || th.getAttribute('data-label') || th.textContent.trim() || ('Column ' + (i + 1)),
        type: c.type || th.getAttribute('data-type') || '',
        sortable: c.sortable != null ? c.sortable : (th.hasAttribute('data-sort') || th.hasAttribute('data-sortable') || table.hasAttribute('data-sort-all')) && th.getAttribute('data-sort') !== 'false',
        hidden: c.hidden != null ? !!c.hidden : th.hasAttribute('data-hidden'),
        hideable: c.hideable != null ? c.hideable : th.getAttribute('data-hideable') !== 'false' && !!th.textContent.trim()
      };
    });
    var trs = [].slice.call(tbody.rows);
    this.rows = trs.map(function (tr, ri) { return self._row(tr, (cfg.rows && cfg.rows[ri]) || null); });
    cols.forEach(function (c) {
      if (!c.type) c.type = detect(self.rows.map(function (r) { return r.raw[c.i]; }));
      if (c.type === 'number' || c.type === 'currency' || c.type === 'percent') c.th.classList.add('num');
    });
    this.rows.forEach(function (r) { r.keys = cols.map(function (c) { return keyOf(r.raw[c.i], c.type); }); });
    this.sortCol = -1; this.sortDir = 0; this.page = 1; this.q = '';
    this.pageSize = o.pagination ? o.pageSize : Infinity;
    this.offs = [];
    this._build();
    // initial sort from aria-sort / data-sort="asc|desc"
    cols.forEach(function (c) { var s = c.th.getAttribute('data-sort'); if (s === 'asc' || s === 'desc') { self.sortCol = c.i; self.sortDir = s === 'asc' ? 1 : -1; } });
    this.render();
  }

  DataTable.prototype._row = function (tr, data) {
    var cells = [].slice.call(tr.cells), self = this;
    var raw = cells.map(function (td) { return td.hasAttribute('data-value') ? td.getAttribute('data-value') : td.textContent.trim(); });
    var obj = data;
    if (!obj) { obj = {}; this.cols.forEach(function (c, i) { obj[c.key] = raw[i]; }); }
    var r = { tr: tr, raw: raw, data: obj, text: cells.map(function (td) { return td.textContent; }).join(' \u0001 ').toLowerCase(), sel: tr.getAttribute('aria-selected') === 'true' };
    if (this.cols && this.cols.length && this.rows) r.keys = this.cols.map(function (c) { return keyOf(raw[c.i], c.type); });
    if (this.o.select) self._addCheck(r);
    return r;
  };

  DataTable.prototype._addCheck = function (r) {
    var td = h('td', 'dt-check-cell'), cb = h('input', 'dt-check');
    cb.type = 'checkbox'; cb.setAttribute('aria-label', 'Select row'); cb.checked = r.sel;
    td.appendChild(cb); r.tr.insertBefore(td, r.tr.firstChild); r.cb = cb;
  };

  DataTable.prototype._build = function () {
    var self = this, o = this.o, table = this.table;
    var host = table.parentElement && /\btable-wrap(per)?\b/.test(table.parentElement.className) ? table.parentElement : null;
    if (!host) { host = h('div', 'table-wrapper'); table.parentNode.insertBefore(host, table); host.appendChild(table); }
    var shell = host.parentElement && host.parentElement.classList.contains('data-table') ? host.parentElement : null;
    if (!shell) { shell = h('div', 'data-table'); host.parentNode.insertBefore(shell, host); shell.appendChild(host); this._ownShell = true; }
    this.shell = shell; this.host = host;
    table.classList.add('table');

    // Header: sort buttons
    this.cols.forEach(function (c) {
      if (!c.sortable) return;
      var label = c.th.innerHTML;
      c.th.innerHTML = '';
      var b = h('button', 'dt-sort', '<span>' + label + '</span>' + I.sort);
      b.type = 'button';
      c.th.appendChild(b); c.btn = b; c.th.classList.add('dt-sortable');
      c.th.setAttribute('aria-sort', 'none');
      self.offs.push(R.on(b, 'click', function () { self.sortBy(c.i); }));
    });
    if (o.select) {
      var th = h('th', 'dt-check-cell'); th.setAttribute('scope', 'col');
      var all = h('input', 'dt-check'); all.type = 'checkbox'; all.setAttribute('aria-label', 'Select all rows');
      th.appendChild(all); this.allCb = all;
      if (table.tHead) table.tHead.rows[0].insertBefore(th, table.tHead.rows[0].firstChild);
      this.offs.push(R.on(all, 'change', function () { self.selectAll(all.checked); }));
      this.offs.push(R.on(this.tbody, 'change', '.dt-check', function (e, cb) {
        var r = self._byTr(cb.closest('tr')); if (!r) return;
        r.sel = cb.checked; self._syncSel(); self._emitSel();
      }));
      this.offs.push(R.on(this.tbody, 'click', 'td', function (e, td) {
        // Shift-click range select
        var tr = td.closest('tr'); var r = self._byTr(tr); if (!r || !e.shiftKey || !e.target.classList.contains('dt-check')) { if (r) self._last = r; return; }
        var vis = self._visible, a = vis.indexOf(self._last), b = vis.indexOf(r);
        if (a > -1 && b > -1) { var lo = Math.min(a, b), hi = Math.max(a, b); for (var i = lo; i <= hi; i++) vis[i].sel = r.cb.checked; self._syncSel(); self._emitSel(); }
        self._last = r;
      }));
    }

    // Toolbar
    var tb = shell.querySelector(':scope > .dt-toolbar');
    var needToolbar = o.search || o.columnsMenu;
    if (needToolbar) {
      if (!tb) { tb = h('div', 'dt-toolbar'); shell.insertBefore(tb, host); this._ownTb = tb; }
      var custom = [].slice.call(tb.children);
      if (o.search) {
        var s = h('label', 'dt-search', I.search + '<input type="search" autocomplete="off" spellcheck="false">');
        var inp = s.querySelector('input'); inp.placeholder = o.searchPlaceholder; inp.setAttribute('aria-label', o.searchPlaceholder.replace(/…$/, ''));
        tb.insertBefore(s, tb.firstChild); this.input = inp;
        var t;
        this.offs.push(R.on(inp, 'input', function () { clearTimeout(t); t = setTimeout(function () { self.search(inp.value); }, 90); }));
        this.offs.push(R.on(inp, 'keydown', function (e) { if (e.key === 'Escape' && inp.value) { e.stopPropagation(); inp.value = ''; self.search(''); } }));
      }
      var sp = h('div', 'dt-spacer'); tb.insertBefore(sp, custom[0] || null);
      if (o.columnsMenu && this.cols.some(function (c) { return c.hideable; })) {
        var cb = h('button', 'dt-btn', I.cols + '<span>Columns</span>'); cb.type = 'button';
        cb.setAttribute('aria-haspopup', 'menu'); cb.setAttribute('aria-expanded', 'false');
        tb.appendChild(cb); this.colBtn = cb;
        this.offs.push(R.on(cb, 'click', function () { self.menu ? self.closeMenu() : self.openMenu(); }));
      }
    }

    // Bulk bar
    if (o.select && o.bulk.length) {
      var bar = h('div', 'dt-bulk'); bar.hidden = true; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Bulk actions');
      bar.innerHTML = '<span class="dt-bulk-count" aria-live="polite"></span><div class="dt-bulk-scroll"></div><button type="button" class="dt-btn dt-btn-icon" aria-label="Clear selection" data-dt-clear>' + I.x + '</button>';
      var sc = bar.querySelector('.dt-bulk-scroll');
      o.bulk.forEach(function (a) {
        var b = h('button', 'dt-btn' + (a.danger ? ' dt-btn-danger' : ''), (a.icon || '') + '<span>' + R.esc(a.label) + '</span>'); b.type = 'button'; b.setAttribute('data-dt-action', a.action || slug(a.label));
        sc.appendChild(b);
      });
      shell.appendChild(bar); this.bulkBar = bar;
      this.offs.push(R.on(bar, 'click', 'button', function (e, b) {
        if (b.hasAttribute('data-dt-clear')) { self.selectAll(false); return; }
        var act = b.getAttribute('data-dt-action'), rows = self.getSelected();
        var def = o.bulk.filter(function (x) { return (x.action || slug(x.label)) === act; })[0];
        var ok = R.emit(table, 'bulk', { action: act, rows: rows, count: rows.length });
        if (ok && def && typeof def.onClick === 'function') def.onClick(rows, self);
      }));
    }

    // Footer
    if (o.pagination || o.info || o.select) {
      var ft = h('div', 'dt-footer');
      ft.innerHTML = '<div class="dt-info" aria-live="polite"></div><div class="dt-footer-right"></div>';
      var right = ft.lastChild;
      if (o.pagination) {
        var sizes = String(o.pageSizes).split(',').map(Number).filter(Boolean);
        if (sizes.indexOf(o.pageSize) < 0) { sizes.push(o.pageSize); sizes.sort(function (a, b) { return a - b; }); }
        var sz = h('label', 'dt-size', '<span>Rows per page</span><select>' + sizes.map(function (n) { return '<option' + (n === o.pageSize ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select>');
        right.appendChild(sz);
        var pg = h('div', 'dt-pages');
        pg.innerHTML = '<button type="button" class="dt-btn dt-btn-icon" data-go="first" aria-label="First page">' + I.first + '</button>' +
          '<button type="button" class="dt-btn dt-btn-icon" data-go="prev" aria-label="Previous page">' + I.prev + '</button>' +
          '<span class="dt-page-label"></span>' +
          '<button type="button" class="dt-btn dt-btn-icon" data-go="next" aria-label="Next page">' + I.next + '</button>' +
          '<button type="button" class="dt-btn dt-btn-icon" data-go="last" aria-label="Last page">' + I.last + '</button>';
        right.appendChild(pg); this.pager = pg;
        this.offs.push(R.on(sz.querySelector('select'), 'change', function () { self.setPageSize(+this.value); }));
        this.offs.push(R.on(pg, 'click', 'button', function (e, b) {
          var g = b.getAttribute('data-go'), n = self.pages();
          self.goTo(g === 'first' ? 1 : g === 'prev' ? self.page - 1 : g === 'next' ? self.page + 1 : n);
        }));
      }
      shell.appendChild(ft); this.footer = ft; this.infoEl = ft.firstChild;
    }
  };

  DataTable.prototype._byTr = function (tr) { for (var i = 0; i < this.rows.length; i++) if (this.rows[i].tr === tr) return this.rows[i]; return null; };

  DataTable.prototype.filtered = function () {
    var q = this.q, rows = this.rows.slice();
    if (q) {
      var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      rows = rows.filter(function (r) { return terms.every(function (t) { return r.text.indexOf(t) > -1; }); });
    }
    if (this.sortDir && this.sortCol > -1) {
      var c = this.sortCol, d = this.sortDir, idx = this.rows;
      rows.sort(function (a, b) {
        var x = a.keys[c], y = b.keys[c], r;
        if (typeof x === 'string') r = collator ? collator.compare(x, y) : (x < y ? -1 : x > y ? 1 : 0);
        else r = x - y;
        return (r * d) || (idx.indexOf(a) - idx.indexOf(b));
      });
    }
    return rows;
  };
  DataTable.prototype.pages = function () { return Math.max(1, Math.ceil(this._count / this.pageSize) || 1); };

  DataTable.prototype.render = function (animate) {
    var self = this, o = this.o;
    var rows = this.filtered();
    this._count = rows.length; this._visible = rows;
    this.page = R.clamp(this.page, 1, this.pages());
    var start = (this.page - 1) * this.pageSize, pageRows = isFinite(this.pageSize) ? rows.slice(start, start + this.pageSize) : rows;
    var frag = document.createDocumentFragment();
    var hidden = this.cols.map(function (c) { return c.hidden; }), off = o.select ? 1 : 0;
    this.cols.forEach(function (c) { c.th.hidden = c.hidden; });
    pageRows.forEach(function (r) {
      var cells = r.tr.cells;
      for (var i = 0; i < hidden.length; i++) if (cells[i + off]) cells[i + off].hidden = hidden[i];
      r.tr.setAttribute('aria-selected', r.sel ? 'true' : 'false');
      if (r.cb) r.cb.checked = r.sel;
      frag.appendChild(r.tr);
    });
    if (!pageRows.length) {
      var span = this.cols.filter(function (c) { return !c.hidden; }).length + off;
      var tr = h('tr', 'dt-empty'), td = h('td');
      td.colSpan = span;
      td.innerHTML = '<div class="dt-empty-inner">' + I.empty + '<b>' + R.esc(this.q ? o.emptyTitle : 'Nothing here yet') + '</b><span>' + (this.q ? 'No rows match “' + R.esc(this.q) + '”. ' + R.esc(o.emptyText) : 'There are no rows to show.') + '</span>' + (this.q ? '<button type="button" class="dt-btn" data-dt-reset>Clear search</button>' : '') + '</div>';
      tr.appendChild(td); frag.appendChild(tr);
      var btn = td.querySelector('[data-dt-reset]');
      if (btn) btn.onclick = function () { if (self.input) { self.input.value = ''; self.input.focus(); } self.search(''); };
    }
    this.tbody.replaceChildren ? this.tbody.replaceChildren(frag) : (this.tbody.innerHTML = '', this.tbody.appendChild(frag));
    if (animate && !R.reducedMotion) {
      this.shell.classList.remove('is-animating'); void this.shell.offsetWidth; this.shell.classList.add('is-animating');
      clearTimeout(this._at); this._at = setTimeout(function () { self.shell.classList.remove('is-animating'); }, 260);
    }
    // header sort state
    this.cols.forEach(function (c) { if (c.btn) c.th.setAttribute('aria-sort', c.i === self.sortCol && self.sortDir ? (self.sortDir > 0 ? 'ascending' : 'descending') : 'none'); });
    if (this.pager) {
      var n = this.pages();
      this.pager.querySelector('.dt-page-label').textContent = 'Page ' + this.page + ' of ' + n;
      this.pager.querySelector('[data-go="first"]').disabled = this.pager.querySelector('[data-go="prev"]').disabled = this.page <= 1;
      this.pager.querySelector('[data-go="last"]').disabled = this.pager.querySelector('[data-go="next"]').disabled = this.page >= n;
    }
    this._syncSel();
  };

  DataTable.prototype._syncSel = function () {
    var o = this.o, vis = this._visible || [], sel = this.rows.filter(function (r) { return r.sel; });
    var visSel = vis.filter(function (r) { return r.sel; }).length;
    if (this.allCb) {
      this.allCb.checked = vis.length > 0 && visSel === vis.length;
      this.allCb.indeterminate = visSel > 0 && visSel < vis.length;
    }
    vis.forEach(function (r) { if (r.tr.isConnected) { r.tr.setAttribute('aria-selected', r.sel ? 'true' : 'false'); if (r.cb) r.cb.checked = r.sel; } });
    if (this.infoEl) {
      if (o.select && sel.length) this.infoEl.textContent = sel.length + ' of ' + this.rows.length + ' row' + (this.rows.length === 1 ? '' : 's') + ' selected';
      else if (isFinite(this.pageSize) && this._count) {
        var a = (this.page - 1) * this.pageSize + 1, b = Math.min(this._count, this.page * this.pageSize);
        this.infoEl.textContent = 'Showing ' + a + '–' + b + ' of ' + this._count + (this.q ? ' results' : ' rows');
      } else this.infoEl.textContent = this._count + ' row' + (this._count === 1 ? '' : 's');
    }
    if (this.bulkBar) {
      this.bulkBar.hidden = !sel.length;
      this.shell.classList.toggle('has-selection', sel.length > 0);
      if (sel.length) this.bulkBar.querySelector('.dt-bulk-count').textContent = sel.length + ' selected';
    }
  };
  DataTable.prototype._emitSel = function () { var s = this.getSelected(); R.emit(this.table, 'select', { rows: s, count: s.length }); };

  /* ---------- Public methods ---------- */
  DataTable.prototype.sortBy = function (i, dir) {
    if (dir === undefined) dir = this.sortCol === i ? (this.sortDir === 1 ? -1 : this.sortDir === -1 ? 0 : 1) : 1;
    else dir = dir === 'asc' || dir === 1 ? 1 : dir === 'desc' || dir === -1 ? -1 : 0;
    this.sortCol = dir ? i : -1; this.sortDir = dir;
    this.render(true);
    var c = this.cols[i];
    R.emit(this.table, 'sort', { key: c && c.key, column: i, dir: dir > 0 ? 'asc' : dir < 0 ? 'desc' : 'none' });
  };
  DataTable.prototype.search = function (q) {
    this.q = String(q || '').trim(); this.page = 1; this.render(true);
    R.emit(this.table, 'search', { query: this.q, count: this._count });
  };
  DataTable.prototype.goTo = function (p) {
    var n = R.clamp(p, 1, this.pages()); if (n === this.page) return;
    this.page = n; this.render(true);
    R.emit(this.table, 'page', { page: n, pageSize: this.pageSize, pages: this.pages() });
  };
  DataTable.prototype.setPageSize = function (n) {
    var first = (this.page - 1) * this.pageSize;
    this.pageSize = n; this.page = Math.floor(first / n) + 1; this.render(true);
    R.emit(this.table, 'page', { page: this.page, pageSize: n, pages: this.pages() });
  };
  DataTable.prototype.selectAll = function (on) {
    var vis = this._visible || this.rows;
    (on ? vis : this.rows).forEach(function (r) { r.sel = !!on; });
    this._syncSel(); this._emitSel();
  };
  DataTable.prototype.getSelected = function () { return this.rows.filter(function (r) { return r.sel; }).map(function (r) { return r.data; }); };
  DataTable.prototype.setColumn = function (i, visible) {
    var c = typeof i === 'number' ? this.cols[i] : this.cols.filter(function (x) { return x.key === i; })[0];
    if (!c) return; c.hidden = !visible; this.render();
    R.emit(this.table, 'columns', { key: c.key, visible: !!visible, hidden: this.cols.filter(function (x) { return x.hidden; }).map(function (x) { return x.key; }) });
  };
  DataTable.prototype.removeRows = function (pred) {
    var self = this;
    this.rows = this.rows.filter(function (r) { return !pred(r.data, r); });
    this.render(true); this._emitSel();
    return self;
  };
  DataTable.prototype.openMenu = function () {
    var self = this, m = h('div', 'dt-menu');
    m.setAttribute('role', 'menu'); m.setAttribute('aria-label', 'Toggle columns');
    m.innerHTML = '<div class="dt-menu-label">Toggle columns</div>' + this.cols.map(function (c) {
      return c.hideable ? '<button type="button" role="menuitemcheckbox" class="dt-menu-item" data-i="' + c.i + '" aria-checked="' + !c.hidden + '"><span class="dt-menu-check">' + I.check + '</span>' + R.esc(c.label) + '</button>' : '';
    }).join('');
    document.body.appendChild(m); this.menu = m;
    this.colBtn.setAttribute('aria-expanded', 'true');
    var stopPos = R.autoPosition(m, this.colBtn, { placement: 'bottom-end', offset: 6 });
    var offOut = R.onOutside([m, this.colBtn], function () { self.closeMenu(); });
    var pop = R.pushLayer(function () { self.closeMenu(true); });
    var offRov = R.roving(m, '.dt-menu-item');
    var offClick = R.on(m, 'click', '.dt-menu-item', function (e, b) {
      var on = b.getAttribute('aria-checked') !== 'true';
      var visible = self.cols.filter(function (c) { return !c.hidden; }).length;
      if (!on && visible <= 1) return;
      b.setAttribute('aria-checked', String(on)); self.setColumn(+b.getAttribute('data-i'), on);
    });
    this._menuOff = function () { stopPos(); offOut(); pop(); offRov(); offClick(); };
    var f = m.querySelector('.dt-menu-item'); if (f) f.focus({ preventScroll: true });
  };
  DataTable.prototype.closeMenu = function (refocus) {
    if (!this.menu) return;
    this._menuOff(); this.menu.remove(); this.menu = null;
    this.colBtn.setAttribute('aria-expanded', 'false');
    if (refocus) this.colBtn.focus();
  };
  DataTable.prototype.destroy = function () {
    this.offs.forEach(function (f) { f(); }); this.offs = [];
    this.closeMenu(); clearTimeout(this._at);
  };

  R.define(NS, {
    selector: 'table[data-table]',
    mount: function (el) {
      var inst = new DataTable(el);
      return { destroy: function () { inst.destroy(); }, api: inst };
    }
  });

  /**
   * Ranj.dataTable(container, { columns: [{ key, label, type, sortable, align, render(value,row), hidden, hideable, width }], rows: [{…}],
   *   pageSize, pageSizes, search, select, columnsMenu, bulk: [{ label, action, danger, icon, onClick(rows, table) }], emptyTitle, emptyText, className })
   * Returns the instance (sortBy, search, goTo, setPageSize, selectAll, getSelected, setColumn, removeRows, setRows, destroy).
   * If container is a <table data-table> already mounted, returns its instance.
   */
  R.dataTable = function (el, cfg) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el) return null;
    if (el.tagName === 'TABLE') {
      var ex = R.instance(el, NS); if (ex && ex.api) return ex.api;
      var inst0 = new DataTable(el, cfg || {});
      el.__ranj = el.__ranj || {}; el.__ranj[NS] = { destroy: function () { inst0.destroy(); }, api: inst0 };
      return inst0;
    }
    cfg = cfg || {};
    var cols = cfg.columns || Object.keys((cfg.rows || [])[0] || {}).map(function (k) { return { key: k, label: k }; });
    var table = document.createElement('table');
    table.className = 'table ' + (cfg.className || 'table-hover');
    var thead = table.createTHead().insertRow();
    cols.forEach(function (c) {
      var th = document.createElement('th'); th.scope = 'col';
      th.innerHTML = R.esc(c.label != null ? c.label : c.key);
      if (c.type) th.setAttribute('data-type', c.type);
      if (c.align === 'right' || c.type === 'number' || c.type === 'currency') th.classList.add('num');
      if (c.width) th.style.width = c.width;
      thead.appendChild(th);
    });
    var tbody = table.createTBody();
    function rowEl(row) {
      var tr = document.createElement('tr');
      cols.forEach(function (c) {
        var td = tr.insertCell(), v = row[c.key];
        if (c.align === 'right' || c.type === 'number' || c.type === 'currency') td.className = 'num';
        if (c.className) td.className += ' ' + c.className;
        if (c.render) { var out = c.render(v, row); if (out && out.nodeType) td.appendChild(out); else td.innerHTML = out == null ? '' : out; td.setAttribute('data-value', v == null ? '' : (v instanceof Date ? v.toISOString() : v)); }
        else td.textContent = v == null ? '' : v;
      });
      return tr;
    }
    (cfg.rows || []).forEach(function (r) { tbody.appendChild(rowEl(r)); });
    var wrap = document.createElement('div'); wrap.className = 'table-wrapper';
    if (cfg.maxHeight) { wrap.style.maxHeight = cfg.maxHeight; table.classList.add('table-sticky'); }
    wrap.appendChild(table);
    el.innerHTML = ''; el.appendChild(wrap);
    cfg = Object.assign({}, cfg, { columns: cols.map(function (c) { return { key: c.key, label: c.label, type: c.type === 'currency' ? 'number' : c.type, sortable: c.sortable !== false, hidden: c.hidden, hideable: c.hideable } }) });
    var inst = new DataTable(table, cfg);
    table.__ranj = table.__ranj || {}; table.__ranj[NS] = { destroy: function () { inst.destroy(); }, api: inst };
    inst.setRows = function (rows) {
      var self = this;
      this.rows = rows.map(function (r) { var o = self._row(rowEl(r), r); o.keys = self.cols.map(function (c) { return keyOf(o.raw[c.i], c.type); }); return o; });
      this.page = 1; this.render(true);
    };
    return inst;
  };
})(window.Ranj);
