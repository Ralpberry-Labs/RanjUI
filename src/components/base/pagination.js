/* Ranj UI — Pagination renderer.
 * <nav class="pagination" data-pagination data-total="20" data-page="1" data-siblings="1"></nav>
 * or Ranj.pagination(el, { total, page, siblings, boundaries, onChange }) */
(function (R) {
  'use strict';
  var PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  var NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';

  /** Page range with ellipses: returns e.g. [1, '…', 4, 5, 6, '…', 20] */
  function range(page, total, siblings, boundaries) {
    siblings = siblings == null ? 1 : siblings; boundaries = boundaries == null ? 1 : boundaries;
    var out = [], i;
    if (total <= siblings * 2 + 3 + boundaries * 2) { for (i = 1; i <= total; i++) out.push(i); return out; }
    var sStart = Math.max(Math.min(page - siblings, total - boundaries - siblings * 2 - 1), boundaries + 2);
    var sEnd = Math.min(Math.max(page + siblings, boundaries + siblings * 2 + 2), total - boundaries - 1);
    for (i = 1; i <= boundaries; i++) out.push(i);
    out.push(sStart > boundaries + 2 ? '\u2026' : boundaries + 1);
    for (i = sStart; i <= sEnd; i++) out.push(i);
    out.push(sEnd < total - boundaries - 1 ? '\u2026' : total - boundaries);
    for (i = total - boundaries + 1; i <= total; i++) out.push(i);
    return out;
  }

  function Pager(el, cfg) {
    var o = R.opts(el, { total: 1, page: 1, siblings: 1, boundaries: 1, labels: true, prevLabel: 'Previous', nextLabel: 'Next', mode: 'numbers' });
    for (var k in cfg) if (cfg[k] !== undefined) o[k] = cfg[k];
    this.el = el; this.o = o; this.page = o.page;
    if (el.tagName === 'NAV' || !el.hasAttribute('role')) el.setAttribute('aria-label', el.getAttribute('aria-label') || 'Pagination');
    var self = this;
    this.off = R.on(el, 'click', 'button[data-page]', function (e, b) { self.set(+b.getAttribute('data-page'), true); });
    this.offIn = R.on(el, 'change', 'input', function (e, inp) { self.set(parseInt(inp.value, 10) || 1, true); });
    this.offKey = R.on(el, 'keydown', function (e) {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); self.set(self.page - 1, true, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); self.set(self.page + 1, true, true); }
    });
    this.render();
  }
  Pager.prototype.render = function (focus) {
    var o = this.o, p = this.page, t = Math.max(1, o.total), h = '';
    var prevLbl = o.labels ? '<span class="pagination-label">' + R.esc(o.prevLabel) + '</span>' : '';
    var nextLbl = o.labels ? '<span class="pagination-label">' + R.esc(o.nextLabel) + '</span>' : '';
    var btn = function (n, inner, cls, aria) {
      return '<button type="button" class="' + (cls || '') + '" data-page="' + n + '"' + (aria ? ' aria-label="' + aria + '"' : '') + '>' + inner + '</button>';
    };
    h += btn(p - 1, PREV + prevLbl, 'pagination-prev', 'Previous page').replace('<button', p <= 1 ? '<button disabled' : '<button');
    if (o.mode === 'compact') {
      h += '<span class="pagination-current"><input type="number" min="1" max="' + t + '" value="' + p + '" aria-label="Page"> / ' + t + '</span>';
    } else if (o.mode === 'simple') {
      h += '<span class="pagination-info">Page <b>' + p + '</b> of <b>' + t + '</b></span>';
    } else if (o.mode === 'dots') {
      for (var d = 1; d <= t; d++) h += btn(d, d, '', 'Page ' + d).replace('<button', d === p ? '<button aria-current="page"' : '<button');
    } else {
      range(p, t, o.siblings, o.boundaries).forEach(function (n) {
        if (n === '…') h += '<span class="pagination-ellipsis" aria-hidden="true">…</span>';
        else h += btn(n, n, '', 'Page ' + n).replace('<button', n === p ? '<button aria-current="page"' : '<button');
      });
    }
    h += btn(p + 1, nextLbl + NEXT, 'pagination-next', 'Next page').replace('<button', p >= t ? '<button disabled' : '<button');
    if (o.mode === 'dots') h = h.replace(/<button[^>]*pagination-(prev|next)[^]*?<\/button>/g, '');
    this.el.innerHTML = h;
    if (focus) { var c = this.el.querySelector('[aria-current="page"]') || this.el.querySelector('input'); if (c) c.focus(); }
  };
  Pager.prototype.set = function (n, user, focus) {
    var t = Math.max(1, this.o.total); n = R.clamp(n | 0, 1, t);
    if (n === this.page) { if (this.o.mode === 'compact') this.render(); return; }
    var prev = this.page; this.page = n; this.el.setAttribute('data-page', n);
    this.render(focus);
    R.emit(this.el, 'change', { page: n, previous: prev, total: t, user: !!user });
    if (this.o.onChange) this.o.onChange(n, prev);
  };
  Pager.prototype.setTotal = function (t) { this.o.total = t; this.page = R.clamp(this.page, 1, Math.max(1, t)); this.render(); };
  Pager.prototype.destroy = function () { this.off(); this.offIn(); this.offKey(); };

  R.define('pagination', {
    selector: '.pagination[data-pagination], nav[data-pagination]',
    mount: function (el) { var p = new Pager(el, {}); return { destroy: function () { p.destroy(); }, api: p }; }
  });

  /** Ranj.pagination(el, { total, page, siblings, boundaries, mode: 'numbers'|'simple'|'compact'|'dots', labels, onChange(page, prev) }) → { set, setTotal, page, destroy } */
  R.pagination = function (el, cfg) {
    if (typeof el === 'string') el = document.querySelector(el);
    var ex = R.instance(el, 'pagination'); if (ex && ex.api) { if (cfg) { for (var k in cfg) ex.api.o[k] = cfg[k]; ex.api.render(); } return ex.api; }
    var p = new Pager(el, cfg || {});
    el.__ranj = el.__ranj || {}; el.__ranj.pagination = { destroy: function () { p.destroy(); }, api: p };
    return p;
  };
  R.pagination.range = range;
})(window.Ranj);
