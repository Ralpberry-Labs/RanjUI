/*!
 * Ranj UI — toast (Sonner-style).
 *   Ranj.toast('Saved')                                     → id
 *   Ranj.toast({ title, description, type, duration, position, action: { label, onClick }, cancel, closeButton, rich, progress, icon, html })
 *   Ranj.toast.success / error / warning / info / loading (title, opts)
 *   Ranj.toast.promise(promise, { loading, success, error })  (success/error may be functions of the value/error)
 *   Ranj.toast.update(id, opts) · Ranj.toast.dismiss(id?) · Ranj.toast.config({ position, duration, visible, gap, rich, closeButton, expand })
 * Declarative: <button data-toast="Saved" data-toast-type="success" data-toast-description="…" data-toast-position="top-center">
 * Hover expands the stack and pauses timers; swipe sideways to dismiss; Alt+T focuses the newest toast.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var cfg = { position: 'bottom-right', duration: 4000, visible: 3, gap: 14, rich: false, closeButton: false, expand: false, progress: true, max: 8 };
  var boxes = {}, all = {}, seq = 0;
  var POS = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
  var TYPES = { success: 'success', error: 'error', destructive: 'error', danger: 'error', warning: 'warning', info: 'info', loading: 'loading', default: 'default' };

  function box(pos) {
    if (POS.indexOf(pos) < 0) pos = cfg.position;
    var b = boxes[pos];
    if (b && b.el.isConnected) return b;
    var el = d.createElement('section');
    el.className = 'toaster';
    el.setAttribute('data-position', pos);
    el.setAttribute('aria-label', 'Notifications (Alt+T)');
    el.setAttribute('tabindex', '-1');
    el.innerHTML = '<ol class="toaster-list" aria-live="polite" aria-relevant="additions text"></ol>';
    d.body.appendChild(el);
    b = boxes[pos] = { el: el, list: el.firstChild, items: [], pos: pos, hover: false, focus: false };
    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'touch') return; b.hover = true; sync(b); });
    el.addEventListener('pointerleave', function (e) { if (b.swiping) return; b.hover = false; sync(b); });
    el.addEventListener('focusin', function () { b.focus = true; sync(b); });
    el.addEventListener('focusout', function (e) { if (!el.contains(e.relatedTarget)) { b.focus = false; sync(b); } });
    return b;
  }

  function norm(a, b) {
    var o = typeof a === 'string' ? { title: a } : Object.assign({}, a || {});
    if (b) Object.assign(o, b);
    if (o.variant && !o.type) o.type = o.variant;
    o.type = TYPES[o.type] || 'default';
    if (o.message && !o.title) o.title = o.message;
    return o;
  }
  function txt(o, k) { var v = o[k]; if (v == null || v === '') return ''; return o.html ? String(v) : R.esc(v); }

  function iconFor(o) {
    if (o.icon === false) return '';
    if (o.icon) return '<div class="toast-icon">' + o.icon + '</div>';
    if (o.avatar) return '<img class="toast-avatar" src="' + R.esc(o.avatar) + '" alt="">';
    if (o.type === 'loading') return '<div class="toast-icon" aria-hidden="true"><span class="toast-spinner"></span></div>';
    var m = { success: K.icon.success, error: K.icon.error, warning: K.icon.warning, info: K.icon.infoFill }[o.type];
    return m ? '<div class="toast-icon">' + m + '</div>' : '';
  }
  function paint(t) {
    var o = t.o, el = t.el;
    el.className = 'toast toast-' + o.type + ((o.rich != null ? o.rich : cfg.rich) ? ' toast-rich' : '') + (o.className ? ' ' + o.className : '');
    el.setAttribute('data-type', o.type);
    el.setAttribute('role', o.type === 'error' ? 'alert' : 'status');
    var dur = duration(o);
    el.innerHTML = iconFor(o) +
      '<div class="toast-content">' + (o.title ? '<div class="toast-title">' + txt(o, 'title') + '</div>' : '') +
      (o.description ? '<div class="toast-description">' + txt(o, 'description') + '</div>' : '') + '</div>' +
      ((o.action || o.cancel) ? '<div class="toast-actions">' +
        (o.cancel ? '<button type="button" class="toast-cancel" data-toast-cancel>' + R.esc(o.cancel.label || 'Cancel') + '</button>' : '') +
        (o.action ? '<button type="button" class="toast-action" data-toast-action>' + R.esc(o.action.label || 'Undo') + '</button>' : '') + '</div>' : '') +
      (o.dismissible === false ? '' : '<button type="button" class="toast-close" aria-label="Close notification" data-toast-close>' + K.icon.x + '</button>') +
      ((o.progress != null ? o.progress : cfg.progress) && isFinite(dur) && dur > 0 ? '<div class="toast-progress" aria-hidden="true"><span style="--toast-dur:' + dur + 'ms"></span></div>' : '');
    if (o.closeButton || cfg.closeButton) el.querySelector('.toast-close') && el.querySelector('.toast-close').style.setProperty('opacity', '1');
  }
  function duration(o) { return o.duration != null ? o.duration : o.type === 'loading' ? Infinity : cfg.duration; }
  function measure(t) {
    var el = t.el, prev = el.style.height;
    el.style.height = 'auto';
    var h = el.getBoundingClientRect().height / (t.scale || 1);
    el.style.height = prev;
    t.h = Math.round(el.offsetHeight || h);
  }

  function layout(b) {
    var live = b.items.filter(function (t) { return !t.removed; });
    var expanded = cfg.expand || b.hover || b.focus || b.swiping;
    var gap = cfg.gap, off = 0, frontH = live[0] ? live[0].h : 0;
    b.items.forEach(function (t) {
      var i = live.indexOf(t);
      if (i < 0) return;
      t.el.style.setProperty('--i', i);
      t.el.style.setProperty('--offset', off + 'px');
      t.el.style.setProperty('--h', t.h + 'px');
      if (i === 0) t.el.setAttribute('data-front', ''); else t.el.removeAttribute('data-front');
      if (i >= cfg.visible) t.el.setAttribute('data-hidden', ''); else t.el.removeAttribute('data-hidden');
      off += t.h + gap;
    });
    var vis = Math.min(live.length, cfg.visible);
    var hh = !live.length ? 0 : expanded ? off - gap : frontH + (vis - 1) * 14;
    b.el.style.setProperty('--toaster-h', hh + 'px');
    b.el.style.setProperty('--front-h', frontH + 'px');
    b.el.style.setProperty('--toast-gap', gap + 'px');
    if (expanded && live.length) b.el.setAttribute('data-expanded', ''); else b.el.removeAttribute('data-expanded');
  }
  function sync(b) {
    var paused = b.hover || b.focus || b.swiping || d.hidden;
    if (paused) b.el.setAttribute('data-paused', ''); else b.el.removeAttribute('data-paused');
    b.items.forEach(function (t) { if (paused) pause(t); else resume(t); });
    layout(b);
  }
  function pause(t) { if (t.timer) { clearTimeout(t.timer); t.timer = 0; t.left -= performance.now() - t.start; } }
  function resume(t) {
    if (t.removed || t.timer || !isFinite(t.left)) return;
    t.start = performance.now();
    t.timer = setTimeout(function () { t.timer = 0; dismiss(t.id, 'timeout'); }, Math.max(0, t.left));
  }

  function create(o) {
    var id = o.id != null ? String(o.id) : 'toast-' + (++seq);
    if (all[id] && !all[id].removed) return update(id, o);
    var b = box(o.position || cfg.position);
    var el = d.createElement('li');
    el.setAttribute('data-mounted', 'false');
    el.setAttribute('tabindex', '0');
    el.id = id;
    var t = all[id] = { id: id, o: o, el: el, b: b, h: 0, left: duration(o), timer: 0, start: 0, removed: false };
    paint(t);
    b.list.insertBefore(el, b.list.firstChild);
    b.items.unshift(t);
    measure(t);
    bind(t);
    // overflow: retire the oldest
    var live = b.items.filter(function (x) { return !x.removed; });
    if (live.length > cfg.max) dismiss(live[live.length - 1].id, 'overflow');
    layout(b);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.setAttribute('data-mounted', 'true'); }); });
    if (b.hover || b.focus || d.hidden) b.el.setAttribute('data-paused', ''); else resume(t);
    return id;
  }

  function update(id, patch) {
    var t = all[id]; if (!t || t.removed) return id;
    var p = typeof patch === 'string' ? { title: patch } : Object.assign({}, patch || {});
    if (p.variant && !p.type) p.type = p.variant;
    if (p.type) p.type = TYPES[p.type] || 'default';
    t.o = Object.assign({}, t.o, p);
    paint(t);
    measure(t);
    pause(t);
    t.left = duration(t.o);
    if (!t.b.el.hasAttribute('data-paused')) resume(t);
    layout(t.b);
    return id;
  }

  function dismiss(id, reason) {
    if (id == null) { Object.keys(all).forEach(function (k) { dismiss(k, reason || 'api'); }); return; }
    var t = all[id]; if (!t || t.removed) return;
    t.removed = true;
    clearTimeout(t.timer); t.timer = 0;
    t.el.setAttribute('data-removed', '');
    layout(t.b);
    if (reason === 'timeout' && t.o.onAutoClose) t.o.onAutoClose(id);
    if (t.o.onDismiss) t.o.onDismiss(id, reason);
    R.emit(t.b.el, 'toastdismiss', { id: id, reason: reason });
    setTimeout(function () {
      if (t.el.parentNode) t.el.parentNode.removeChild(t.el);
      var i = t.b.items.indexOf(t); if (i > -1) t.b.items.splice(i, 1);
      if (all[id] === t) delete all[id];
      if (!t.b.items.length) { t.b.hover = false; t.b.focus = false; t.b.swiping = false; }
      layout(t.b);
    }, reason === 'swipe' ? 260 : 400);
  }

  function bind(t) {
    var el = t.el, sw = null;
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-toast-close]')) { dismiss(t.id, 'close'); return; }
      var a = e.target.closest('[data-toast-action]'), c = e.target.closest('[data-toast-cancel]');
      if (a && t.o.action) { var r = t.o.action.onClick && t.o.action.onClick(e, t.id); if (r !== false && !e.defaultPrevented) dismiss(t.id, 'action'); }
      else if (c) { if (t.o.cancel && t.o.cancel.onClick) t.o.cancel.onClick(e, t.id); dismiss(t.id, 'cancel'); }
      else if (t.o.onClick) t.o.onClick(e, t.id);
    });
    el.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Delete' || e.key === 'Backspace') && e.target === el && t.o.dismissible !== false) { e.preventDefault(); e.stopPropagation(); var nx = el.nextElementSibling || el.previousElementSibling; dismiss(t.id, 'keyboard'); if (nx) nx.focus(); }
    });
    el.addEventListener('pointerdown', function (e) {
      if (t.o.dismissible === false || e.button !== 0 || e.target.closest('button,a,input')) return;
      sw = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, on: false };
    });
    el.addEventListener('pointermove', function (e) {
      if (!sw || e.pointerId !== sw.id) return;
      var dx = e.clientX - sw.x;
      if (!sw.on) {
        if (Math.abs(dx) < 4) return;
        if (Math.abs(e.clientY - sw.y) > Math.abs(dx)) { sw = null; return; }
        sw.on = true; t.b.swiping = true; el.setAttribute('data-swiping', '');
        try { el.setPointerCapture(e.pointerId); } catch (x) {}
        sync(t.b);
      }
      sw.dx = dx;
      el.style.setProperty('--sx', dx + 'px');
      el.style.opacity = String(R.clamp(1 - Math.abs(dx) / (el.offsetWidth * 1.1), .25, 1));
    });
    function end(e) {
      if (!sw || (e.pointerId !== sw.id)) { sw = null; return; }
      var s = sw; sw = null;
      if (!s.on) return;
      el.removeAttribute('data-swiping');
      t.b.swiping = false;
      var dx = s.dx || 0, v = Math.abs(dx) / Math.max(1, performance.now() - s.t);
      el.style.opacity = '';
      if (Math.abs(dx) > Math.min(90, el.offsetWidth * .35) || v > .45) {
        el.style.setProperty('--swipe-end', (dx > 0 ? 1 : -1) * (el.offsetWidth + 60) + 'px');
        el.setAttribute('data-swipe-out', '');
        dismiss(t.id, 'swipe');
      } else el.style.setProperty('--sx', '0px');
      var r = t.b.el.getBoundingClientRect();
      t.b.hover = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom && e.pointerType !== 'touch';
      sync(t.b);
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }

  var toast = function (a, b) { return create(norm(a, b)); };
  ['success', 'error', 'warning', 'info', 'loading'].forEach(function (k) {
    toast[k] = function (a, b) { var o = norm(a, b); o.type = k; return create(o); };
  });
  toast.message = function (a, b) { return create(norm(a, b)); };
  toast.custom = function (html, o) { o = Object.assign({ html: true, icon: false }, o || {}); o.title = html; return create(norm(o)); };
  toast.update = function (id, o) { return update(id, o); };
  toast.dismiss = function (id) { dismiss(id, 'api'); };
  toast.config = function (o) { Object.assign(cfg, o || {}); Object.keys(boxes).forEach(function (k) { layout(boxes[k]); }); return Object.assign({}, cfg); };
  toast.promise = function (p, m) {
    m = m || {};
    if (typeof p === 'function') p = p();
    var first = m.loading == null ? 'Loading…' : m.loading;
    var id = create(Object.assign(norm(first, { position: m.position, description: m.description }), { type: 'loading' }));
    function resolveMsg(x, v) { x = typeof x === 'function' ? x(v) : x; return typeof x === 'string' ? { title: x, description: '' } : (x || {}); }
    Promise.resolve(p).then(function (v) {
      var o = resolveMsg(m.success == null ? 'Done' : m.success, v); o.type = 'success'; if (!('description' in o)) o.description = '';
      update(id, o);
    }, function (er) {
      var o = resolveMsg(m.error == null ? 'Something went wrong' : m.error, er); o.type = 'error'; if (!('description' in o)) o.description = '';
      update(id, o);
    });
    return p;
  };
  R.toast = toast;

  R.define('toast', {
    setup: function () {
      R.on(d, 'click', '[data-toast]', function (e, el) {
        var o = { title: el.getAttribute('data-toast'), description: el.getAttribute('data-toast-description') || undefined, type: el.getAttribute('data-toast-type') || undefined };
        if (el.hasAttribute('data-toast-position')) o.position = el.getAttribute('data-toast-position');
        if (el.hasAttribute('data-toast-duration')) o.duration = parseFloat(el.getAttribute('data-toast-duration'));
        toast(o);
      });
      d.addEventListener('keydown', function (e) {
        if (e.altKey && (e.code === 'KeyT')) {
          var b = Object.keys(boxes).map(function (k) { return boxes[k]; }).filter(function (x) { return x.items.some(function (t) { return !t.removed; }); })[0];
          if (b) { e.preventDefault(); var f = b.list.querySelector('.toast:not([data-removed])'); if (f) f.focus(); }
        }
      });
      d.addEventListener('visibilitychange', function () { Object.keys(boxes).forEach(function (k) { sync(boxes[k]); }); });
    }
  });
})(window.Ranj);
