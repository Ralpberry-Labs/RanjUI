/* Ranj UI — Loaders: infinite loop SVG, progress pie/donut, spinner-to-success, page-top loading bar */
(function (R) {
  'use strict';
  if (!R) return;
  var D = document;

  /* ∞ loader: SVG injected */
  R.define('loader-infinite', {
    selector: '.loader-infinite',
    mount: function (el) {
      if (el.querySelector('svg')) return;
      var id = R.uid('linf'), grad = el.classList.contains('loader-infinite-gradient');
      var d = 'M50 25C60 10 90 8 90 25S60 40 50 25 10 8 10 25 40 40 50 25z';
      el.innerHTML = '<svg viewBox="0 0 100 50" aria-hidden="true">' +
        (grad ? '<defs><linearGradient id="' + id + '" x1="0" x2="1"><stop offset="0" stop-color="var(--_c)"/><stop offset="1" stop-color="oklch(.75 .18 calc(var(--hue) + 80))"/></linearGradient></defs>' : '') +
        '<path class="li-track" d="' + d + '"/><path class="li-run" pathLength="1" d="' + d + '"' + (grad ? ' style="stroke:url(#' + id + ')"' : '') + '/></svg>';
      if (!el.hasAttribute('role')) el.setAttribute('role', 'status');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Loading');
    }
  });

  /* Pie / donut progress */
  function setP(el, v) {
    v = R.clamp(+v || 0, 0, 100);
    el.style.setProperty('--p', v);
    el.setAttribute('aria-valuenow', Math.round(v));
    var t = el.querySelector('[data-progress-text]');
    if (t) t.innerHTML = Math.round(v) + '<small>%</small>';
  }
  R.define('loader-progress', {
    selector: '.loader-pie, .loader-donut',
    mount: function (el) {
      el.setAttribute('role', 'progressbar'); el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', '100');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Progress');
      if (el.classList.contains('loader-donut') && !el.querySelector('[data-progress-text]') && !el.hasAttribute('data-no-label')) {
        var s = D.createElement('span'); s.setAttribute('data-progress-text', ''); el.appendChild(s);
      }
      if (el.hasAttribute('data-indeterminate')) { el.removeAttribute('aria-valuenow'); return; }
      var v = R.attr(el, 'data-value', 0);
      setP(el, 0);
      return R.inView(el, function () { requestAnimationFrame(function () { setP(el, v); }); }, { threshold: 0.3 });
    }
  });
  /** Ranj.progress(el, 0..100) — set a pie, donut or .loader-bar value */
  R.progress = function (el, v) {
    if (typeof el === 'string') el = D.querySelector(el);
    if (!el) return;
    if (el.classList.contains('loader-bar')) { el.style.setProperty('--p', R.clamp(+v, 0, 100)); el.setAttribute('aria-valuenow', Math.round(v)); return; }
    setP(el, v);
  };

  /* Spinner -> success / error */
  var SS = '<svg viewBox="0 0 56 56" aria-hidden="true"><circle class="ss-track" cx="28" cy="28" r="24"/><circle class="ss-fill" cx="28" cy="28" r="20"/>' +
    '<g class="ss-spin"><circle class="ss-circle" cx="28" cy="28" r="24" pathLength="1" transform="rotate(-90 28 28)"/></g>' +
    '<path class="ss-mark ss-ok" pathLength="1" d="M19 28.5l6 6L37.5 22"/><path class="ss-mark ss-bad" pathLength="1" d="M21.5 21.5l13 13"/><path class="ss-mark ss-bad" pathLength="1" d="M34.5 21.5l-13 13"/></svg>';
  var LBL = { loading: 'Loading', success: 'Done', error: 'Failed' };
  R.define('spin-success', {
    selector: '.spin-success',
    mount: function (el) {
      if (!el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', SS);
      el.setAttribute('role', 'status');
      if (!el.getAttribute('data-state')) el.setAttribute('data-state', 'loading');
      el.setAttribute('aria-label', LBL[el.getAttribute('data-state')] || 'Loading');
      var after = R.attr(el, 'data-auto', 0), t = 0;
      if (after > 0) t = setTimeout(function () { R.spinSuccess(el, el.getAttribute('data-auto-state') || 'success'); }, after);
      return function () { clearTimeout(t); };
    }
  });
  /** Ranj.spinSuccess(el, 'loading' | 'success' | 'error') */
  R.spinSuccess = function (el, state) {
    if (typeof el === 'string') el = D.querySelector(el);
    if (!el) return;
    state = state || 'success';
    if (state === 'loading' && el.getAttribute('data-state') !== 'loading') {
      // restart cleanly: rebuild the SVG so the arc starts small again
      el.querySelector('svg') && el.querySelector('svg').remove(); el.insertAdjacentHTML('afterbegin', SS);
    }
    el.setAttribute('data-state', state); el.setAttribute('aria-label', LBL[state] || state);
    R.emit(el, 'change', { state: state });
  };

  /* Page-top loading bar (NProgress-like) */
  function LoadingBar(opts) {
    opts = opts || {};
    this.parent = opts.parent || null;
    this.color = opts.color; this.height = opts.height;
    this.p = 0; this.el = null; this.timer = 0;
  }
  LoadingBar.prototype._ensure = function () {
    if (this.el && this.el.isConnected) return;
    var el = D.createElement('div'); el.className = 'loading-bar'; el.setAttribute('role', 'progressbar'); el.setAttribute('aria-label', 'Page loading');
    el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', '100');
    if (this.parent) { el.setAttribute('data-local', ''); if (getComputedStyle(this.parent).position === 'static') this.parent.style.position = 'relative'; }
    if (this.color) el.style.setProperty('--color', this.color);
    if (this.height) el.style.setProperty('--h', typeof this.height === 'number' ? this.height + 'px' : this.height);
    el.innerHTML = '<div class="loading-bar-fill"></div><div class="loading-bar-peg"></div>';
    (this.parent || D.body).appendChild(el); this.el = el;
  };
  LoadingBar.prototype.set = function (p) {
    this._ensure();
    this.p = R.clamp(p, 0, 1);
    this.el.removeAttribute('data-done');
    this.el.firstChild.style.transform = 'scaleX(' + this.p + ')';
    this.el.style.setProperty('--lb', this.p);
    this.el.setAttribute('aria-valuenow', Math.round(this.p * 100));
    return this;
  };
  LoadingBar.prototype.start = function () {
    var self = this; clearInterval(this.timer); clearTimeout(this._rm);
    if (this.el && this.el.hasAttribute('data-done')) { this.el.remove(); this.el = null; }
    this._ensure(); this.el.firstChild.style.transition = 'none'; this.set(0); void this.el.offsetWidth; this.el.firstChild.style.transition = '';
    this.set(0.08);
    this.timer = setInterval(function () { self.inc(); }, 380);
    return this;
  };
  LoadingBar.prototype.inc = function (amount) {
    var p = this.p;
    if (p >= 0.994) return this;
    amount = amount || (p < 0.2 ? 0.1 : p < 0.5 ? 0.04 : p < 0.8 ? 0.02 : 0.005);
    return this.set(Math.min(0.994, p + amount * (0.6 + Math.random() * 0.8)));
  };
  LoadingBar.prototype.done = function () {
    var self = this; clearInterval(this.timer);
    if (!this.el) return this;
    this.set(1);
    var el = this.el;
    setTimeout(function () { el.setAttribute('data-done', ''); }, 250);
    clearTimeout(this._rm); this._rm = setTimeout(function () { if (el.hasAttribute('data-done')) { el.remove(); if (self.el === el) self.el = null; } }, 1000);
    return this;
  };
  var global = new LoadingBar();
  R.loadingBar = {
    start: function () { return global.start(); },
    set: function (p) { return global.set(p); },
    inc: function (a) { return global.inc(a); },
    done: function () { return global.done(); },
    /** Separate bar inside a container: Ranj.loadingBar.create({ parent, color, height }) */
    create: function (o) { return new LoadingBar(o); }
  };
})(window.Ranj);
