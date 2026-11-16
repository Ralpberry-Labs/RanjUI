/* Ranj UI — Stateful action buttons (send, download, continue, add to cart), copy, subscribe, glow pointer */
(function (R) {
  'use strict';
  if (!R) return;
  var D = document;

  function kindOf(el) {
    return el.classList.contains('dl-btn') ? 'download' : el.classList.contains('continue-btn') ? 'continue' : el.classList.contains('cart-btn') ? 'cart' : el.classList.contains('send-btn') ? 'send' : 'generic';
  }
  var DUR = { send: 1100, download: 2400, continue: 1500, cart: 1650, generic: 1200 };

  function setState(el, s) {
    el.setAttribute('data-state', s);
    el.setAttribute('aria-busy', String(s === 'busy'));
    var live = el.querySelector('.fxb-texts [data-for="' + s + '"]');
    if (live && s !== 'idle') { var lr = el._live; if (lr) lr.textContent = live.textContent; }
  }
  function progress(el, p) {
    p = R.clamp(p, 0, 1);
    el.style.setProperty('--p', p.toFixed(3));
    R.$$('[data-progress-text]', el).forEach(function (t) { t.textContent = Math.round(p * 100) + '%'; });
    el.setAttribute('aria-valuenow', Math.round(p * 100));
  }
  function collapse(el, on) {
    if (kindOf(el) !== 'continue') return;
    if (on) {
      if (!el._w) el._w = el.offsetWidth;
      el.style.width = el._w + 'px'; void el.offsetWidth;
      el.style.width = el.offsetHeight + 'px';
    } else if (el._w) {
      el.style.width = el._w + 'px';
      setTimeout(function () { if (el.getAttribute('data-state') === 'idle') { el.style.width = ''; el._w = 0; } }, 500);
    }
  }
  function done(el) {
    clearInterval(el._timer); clearTimeout(el._t2);
    if (kindOf(el) === 'download') progress(el, 1);
    setState(el, 'done');
    if (kindOf(el) === 'cart') bumpCart(el);
    R.emit(el, 'done', {});
    var reset = R.attr(el, 'data-reset', 2600);
    if (reset > 0) el._t3 = setTimeout(function () { api.reset(el); }, reset);
  }
  function bumpCart(el) {
    var sel = el.getAttribute('data-cart-target'), b = sel && D.querySelector(sel);
    if (!b) return;
    var n = (parseInt(b.textContent, 10) || 0) + 1; b.textContent = n; b.hidden = false;
    b.classList.remove('cart-badge-bump'); void b.offsetWidth; b.classList.add('cart-badge-bump');
  }
  function start(el) {
    if ((el.getAttribute('data-state') || 'idle') !== 'idle') return;
    if (!R.emit(el, 'start', {})) return;
    var k = kindOf(el);
    clearTimeout(el._t3);
    collapse(el, true);
    setState(el, 'busy');
    if (k === 'download') progress(el, 0);
    if (el.hasAttribute('data-manual')) return;
    var dur = R.attr(el, 'data-duration', DUR[k]);
    if (k === 'download') {
      var t0 = performance.now();
      el._timer = setInterval(function () {
        var x = (performance.now() - t0) / dur;
        // eased, slightly irregular progress so it feels like a real download
        var p = Math.min(1, x < 1 ? 1 - Math.pow(1 - x, 1.6) + Math.sin(x * 20) * 0.01 : 1);
        progress(el, p);
        if (x >= 1) done(el);
      }, 60);
    } else el._t2 = setTimeout(function () { done(el); }, dur);
  }
  var api = R.fxButton = {
    start: function (el) { start(el); },
    progress: function (el, p) { progress(el, p); },
    done: function (el) { done(el); },
    error: function (el) {
      clearInterval(el._timer); clearTimeout(el._t2); setState(el, 'error');
      el._t3 = setTimeout(function () { api.reset(el); }, R.attr(el, 'data-reset', 2600) || 2600);
    },
    reset: function (el) { clearInterval(el._timer); clearTimeout(el._t2); clearTimeout(el._t3); setState(el, 'idle'); progress(el, 0); collapse(el, false); }
  };

  R.define('fx-button', {
    selector: '.fxb',
    mount: function (el) {
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      if (!el.getAttribute('data-state')) el.setAttribute('data-state', 'idle');
      var live = D.createElement('span'); live.setAttribute('aria-live', 'polite');
      live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';
      el.appendChild(live); el._live = live;
      var off = R.on(el, 'click', function () { start(el); });
      return function () { off(); clearInterval(el._timer); clearTimeout(el._t2); clearTimeout(el._t3); live.remove(); };
    }
  });

  /* ---------- Copy ---------- */
  var COPY = '<svg class="copy-btn-copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>' +
    '<svg class="copy-btn-check" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function writeClip(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(function () { return legacy(text); });
    return legacy(text);
  }
  function legacy(text) {
    return new Promise(function (res, rej) {
      var ta = D.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'; D.body.appendChild(ta); ta.select();
      try { D.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); } ta.remove();
    });
  }
  R.copyText = writeClip;
  R.define('copy-btn', {
    selector: '.copy-btn',
    mount: function (el) {
      if (!el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', COPY);
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      if (!el.hasAttribute('data-copied-label')) el.setAttribute('data-copied-label', 'Copied!');
      if (!el.hasAttribute('aria-label') && !el.textContent.trim()) el.setAttribute('aria-label', 'Copy to clipboard');
      var label = el.getAttribute('aria-label'), textNode = el.querySelector('.copy-btn-label'), idleText = textNode && textNode.textContent, t = 0;
      return R.on(el, 'click', function () {
        var src = el.getAttribute('data-copy-target'), text = el.getAttribute('data-copy');
        if (src) { var n = D.querySelector(src); text = n ? (n.value != null && n.tagName !== 'DIV' ? n.value : n.textContent) : ''; }
        text = (text || '').trim();
        writeClip(text).then(function () {
          el.setAttribute('data-state', 'done');
          if (label) el.setAttribute('aria-label', el.getAttribute('data-copied-label'));
          if (textNode) textNode.textContent = el.getAttribute('data-copied-label');
          R.emit(el, 'copy', { text: text });
          clearTimeout(t); t = setTimeout(function () {
            el.setAttribute('data-state', 'idle'); if (label) el.setAttribute('aria-label', label); if (textNode) textNode.textContent = idleText;
          }, 1600);
        }, function () { R.emit(el, 'copyerror', { text: text }); });
      });
    }
  });

  /* ---------- Subscribe ---------- */
  var RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  R.define('subscribe', {
    selector: '.subscribe',
    mount: function (el) {
      var input = el.querySelector('.subscribe-input'), btn = el.querySelector('.subscribe-btn');
      if (!input || !btn) return;
      if (btn.tagName === 'BUTTON' && !btn.hasAttribute('type')) btn.type = 'submit';
      if (!btn.querySelector('.fxb-spin')) btn.insertAdjacentHTML('afterbegin', '<i class="fxb-spin" aria-hidden="true"></i>');
      var ok = el.querySelector('.subscribe-success');
      if (ok && ok.parentNode !== btn) btn.appendChild(ok);
      var msg = el.querySelector('.subscribe-msg');
      if (!msg) { msg = D.createElement('div'); msg.className = 'subscribe-msg'; msg.setAttribute('aria-live', 'polite'); el.appendChild(msg); }
      function measure() { var s = btn.querySelector('span'); if (s && el.getAttribute('data-state') !== 'busy' && el.getAttribute('data-state') !== 'done') el.style.setProperty('--bw', Math.ceil(s.offsetWidth + 40) + 'px'); }
      measure();
      var ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null; if (ro) ro.observe(btn);
      var t = 0;
      function finish(success, text) {
        if (success) { el.setAttribute('data-state', 'done'); input.disabled = true; msg.textContent = ''; }
        else { el.setAttribute('data-state', 'error'); msg.textContent = text || 'Something went wrong.'; setTimeout(function () { if (el.getAttribute('data-state') === 'error') el.setAttribute('data-state', 'idle'); }, 500); }
      }
      var offs = [];
      offs.push(R.on(el, 'submit', function (e) {
        e.preventDefault();
        var st = el.getAttribute('data-state'); if (st === 'busy' || st === 'done') return;
        var v = input.value.trim();
        if (!RE.test(v)) {
          input.setAttribute('aria-invalid', 'true'); msg.textContent = el.getAttribute('data-invalid') || 'Please enter a valid email address.';
          el.setAttribute('data-state', 'error'); input.focus();
          clearTimeout(t); t = setTimeout(function () { el.setAttribute('data-state', 'idle'); }, 500);
          return;
        }
        input.removeAttribute('aria-invalid'); msg.textContent = '';
        el.setAttribute('data-state', 'busy');
        var handled = false;
        var detail = { email: v, done: function () { handled = true; finish(true); }, fail: function (m) { handled = true; finish(false, m); } };
        R.emit(el, 'subscribe', detail);
        if (!el.hasAttribute('data-manual')) setTimeout(function () { if (!handled) finish(true); }, R.attr(el, 'data-delay', 1300));
      }));
      offs.push(R.on(input, 'input', function () { if (input.hasAttribute('aria-invalid')) { input.removeAttribute('aria-invalid'); msg.textContent = ''; } }));
      return function () { offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); clearTimeout(t); };
    }
  });
  R.subscribe = { reset: function (el) { if (typeof el === 'string') el = D.querySelector(el); if (!el) return; el.setAttribute('data-state', 'idle'); var i = el.querySelector('.subscribe-input'); if (i) { i.disabled = false; i.value = ''; } } };

  /* ---------- Glow button pointer light ---------- */
  R.define('glow-btn', {
    setup: function () {
      R.on(D, 'pointermove', '.glow-btn', function (e, el) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    }
  });
})(window.Ranj);
