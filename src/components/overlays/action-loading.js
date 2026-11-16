/*!
 * Ranj UI — action loading dialog. A .action-dialog holds .action-view[data-view="confirm|loading|success|error"].
 * Only one view shows; switching morphs the panel height and crossfades.
 *   Ranj.actionDialog.view(el, 'loading')                → switch view
 *   Ranj.actionDialog.run(el, () => promise, { autoClose }) → loading → success/error (closes after success)
 *   [data-action-run] button: runs the task set with Ranj.actionDialog.task(el, fn); without one it fires
 *   ranj:run { done(), fail(msg) } on the dialog, and falls back to a simulated success after data-duration (1600ms).
 * .action-status[data-messages="Validating…|Charging…"] cycles while loading. Events: ranj:change { view }.
 */
(function (R) {
  'use strict';
  var d = document;
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var CROSS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>';

  function get(x) {
    var el = typeof x === 'string' ? d.getElementById(x) : x;
    if (el && !el.classList.contains('action-dialog')) el = el.querySelector('.action-dialog') || el.closest('.action-dialog');
    return el;
  }
  function confetti(view) {
    if (R.reducedMotion || view.querySelector('.action-confetti')) return;
    var c = d.createElement('div'); c.className = 'action-confetti';
    var cols = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--info)', '#f472b6'];
    for (var i = 0; i < 22; i++) {
      var a = (i / 22) * Math.PI * 2, r = 70 + Math.random() * 70;
      c.innerHTML += '<i style="--c:' + cols[i % cols.length] + ';--x:' + Math.round(Math.cos(a) * r) + 'px;--y:' + Math.round(Math.sin(a) * r * .8 - 20) + 'px;--r:' + Math.round(Math.random() * 540) + 'deg;--d:' + (120 + Math.random() * 120 | 0) + 'ms"></i>';
    }
    view.appendChild(c);
    setTimeout(function () { c.remove(); }, 1500);
  }

  function setView(el, name, info) {
    el = get(el); if (!el) return;
    var views = R.$$(':scope > .action-view', el), next = views.filter(function (v) { return v.getAttribute('data-view') === name; })[0];
    var cur = views.filter(function (v) { return v.hasAttribute('data-active'); })[0];
    if (!next || next === cur) return;
    if (info) {
      if (info.title) { var t = next.querySelector('h3,.action-title'); if (t) t.textContent = info.title; }
      if (info.text) { var p = next.querySelector('p,.action-text'); if (p) p.textContent = info.text; }
    }
    var from = el.offsetHeight;
    if (cur) { cur.removeAttribute('data-active'); cur.setAttribute('data-leaving', ''); setTimeout(function () { cur.removeAttribute('data-leaving'); }, 230); }
    next.setAttribute('data-active', '');
    el.setAttribute('data-view', name);
    el.setAttribute('aria-busy', String(name === 'loading'));
    // morph height
    if (from && !R.reducedMotion) {
      el.style.height = 'auto';
      var to = el.offsetHeight;
      el.style.height = from + 'px'; void el.offsetHeight; el.style.height = to + 'px';
      clearTimeout(el.__hT); el.__hT = setTimeout(function () { el.style.height = ''; }, 480);
    }
    var status = next.querySelector('.action-status[data-messages]');
    clearInterval(el.__msg);
    if (status) {
      var msgs = status.getAttribute('data-messages').split('|'), i = 0;
      status.textContent = msgs[0];
      el.__msg = setInterval(function () { i = (i + 1) % msgs.length; if (i === 0 && next.hasAttribute('data-once')) return; status.textContent = msgs[i]; status.removeAttribute('data-swap'); void status.offsetWidth; status.setAttribute('data-swap', ''); }, +(status.getAttribute('data-interval') || 900));
    }
    if (name === 'success' && el.hasAttribute('data-celebrate')) confetti(next);
    var focusT = next.querySelector('[autofocus],.btn');
    if (focusT && el.contains(d.activeElement)) setTimeout(function () { try { focusT.focus({ preventScroll: true }); } catch (x) {} }, 60);
    else if (el.contains(d.activeElement) || d.activeElement === d.body) try { el.focus({ preventScroll: true }); } catch (x) {}
    R.emit(el, 'change', { view: name });
  }

  function run(x, task, o) {
    var el = get(x); if (!el) return Promise.resolve();
    o = o || {};
    var ov = el.closest('.dialog-overlay');
    if (ov && R.dialog && !R.dialog.isOpen(ov)) R.dialog.open(ov);
    setView(el, 'loading');
    var started = performance.now(), min = o.minDuration == null ? 900 : o.minDuration;
    var p = Promise.resolve(typeof task === 'function' ? task() : task);
    function after(fn) { return function (v) { var wait = Math.max(0, min - (performance.now() - started)); setTimeout(function () { fn(v); }, wait); return v; }; }
    p.then(after(function (v) {
      setView(el, 'success', typeof o.success === 'function' ? o.success(v) : o.success);
      var ac = o.autoClose != null ? o.autoClose : parseFloat(el.getAttribute('data-autoclose'));
      if (ov && ac > 0) setTimeout(function () { if (el.getAttribute('data-view') === 'success') R.dialog.close(ov, { reason: 'success' }); }, ac);
    }), after(function (er) {
      setView(el, 'error', typeof o.error === 'function' ? o.error(er) : (o.error || (er && er.message ? { text: er.message } : null)));
    }));
    return p;
  }

  R.define('action-loading', {
    selector: '.action-dialog',
    setup: function () {
      R.on(d, 'click', '[data-action-run]', function (e, b) {
        var el = b.closest('.action-dialog') || get(b.getAttribute('data-action-run'));
        if (!el) return;
        e.preventDefault();
        if (el.__task) { run(el, el.__task); return; }
        var settled = false, res, rej;
        var p = new Promise(function (a, r) { res = a; rej = r; });
        var handled = !R.emit(el, 'run', { done: function (v) { settled = true; res(v); }, fail: function (m) { settled = true; rej(new Error(m || 'Something went wrong')); } });
        if (!handled) setTimeout(function () { if (!settled) res(); }, parseFloat(el.getAttribute('data-duration')) || 1600);
        run(el, p, { minDuration: 0 });
      });
      R.on(d, 'click', '[data-action-view]', function (e, b) { var el = b.closest('.action-dialog'); if (el) setView(el, b.getAttribute('data-action-view')); });
    },
    mount: function (el) {
      if (!el.getAttribute('role') && !el.classList.contains('action-inline')) el.setAttribute('role', 'dialog');
      el.setAttribute('aria-live', 'polite');
      R.$$('.action-check:empty', el).forEach(function (c) { c.innerHTML = CHECK; });
      R.$$('.action-cross:empty', el).forEach(function (c) { c.innerHTML = CROSS; });
      var views = R.$$(':scope > .action-view', el);
      var start = el.getAttribute('data-view') || (views[0] && views[0].getAttribute('data-view'));
      views.forEach(function (v) { if (v.getAttribute('data-view') === start) v.setAttribute('data-active', ''); else v.removeAttribute('data-active'); });
      el.setAttribute('data-view', start);
      if (start === 'loading') setTimeout(function () { var s = el.getAttribute('data-view'); el.removeAttribute('data-view'); views.forEach(function (v) { v.removeAttribute('data-active'); }); setView(el, s); }, 0);
      var ov = el.closest('.dialog-overlay');
      var initial = start;
      var off = ov ? R.on(ov, 'ranj:closed', function () { setView(el, initial); clearInterval(el.__msg); }) : null;
      var off2 = ov ? R.on(ov, 'ranj:close', function () { clearInterval(el.__msg); }) : null;
      return function () { clearInterval(el.__msg); if (off) off(); if (off2) off2(); };
    }
  });

  R.actionDialog = {
    view: setView, run: run,
    task: function (x, fn) { var el = get(x); if (el) el.__task = fn; },
    open: function (x) { var el = get(x), ov = el && el.closest('.dialog-overlay'); if (ov) R.dialog.open(ov); }
  };
})(window.Ranj);
