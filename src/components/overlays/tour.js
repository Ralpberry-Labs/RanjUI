/*!
 * Ranj UI — product tour. Spotlight cutout that glides between targets + a step popover.
 *   var t = Ranj.tour([{ target: '#new-btn', title: 'Create', body: 'Start here.', placement: 'bottom' }, …], { onEnd(done) {} })
 *   t.next() t.prev() t.go(i) t.end()
 * Declarative: elements with data-tour="name" data-tour-step="1" data-tour-title data-tour-body, and a
 * button with data-tour-start="name". A step without target is shown centered.
 * Keys: → / Enter next, ← back, Esc ends. Events: ranj:tourstep { index }, ranj:tourend { completed } on document.
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document, w = window;
  var active = null;

  function resolve(t) { if (!t) return null; if (typeof t === 'string') return d.querySelector(t); return t.nodeType === 1 ? t : null; }

  R.tour = function (steps, o) {
    if (typeof steps === 'string') {
      var name = steps;
      steps = R.$$('[data-tour="' + name + '"]').sort(function (a, b) { return (+a.getAttribute('data-tour-step') || 0) - (+b.getAttribute('data-tour-step') || 0); })
        .map(function (el) { return { target: el, title: el.getAttribute('data-tour-title') || '', body: el.getAttribute('data-tour-body') || '', placement: el.getAttribute('data-tour-placement') || undefined }; });
    }
    o = o || {};
    if (!steps || !steps.length) return null;
    if (active) active.end(false);

    var prevFocus = d.activeElement, i = -1, done = false, raf = 0;
    var spot = d.createElement('div'); spot.className = 'tour-spotlight'; spot.setAttribute('aria-hidden', 'true');
    var block = o.allowInteraction ? null : d.createElement('div');
    if (block) { block.className = 'tour-blocker'; block.setAttribute('aria-hidden', 'true'); }
    var pop = d.createElement('div'); pop.className = 'tour-popover'; pop.setAttribute('role', 'dialog'); pop.setAttribute('tabindex', '-1');
    var tid = R.uid('tour');
    pop.setAttribute('aria-labelledby', tid + '-t'); pop.setAttribute('aria-describedby', tid + '-b');
    if (block) d.body.appendChild(block);
    d.body.appendChild(spot); d.body.appendChild(pop);
    K.arrow(pop);
    var rect = null, el = null;
    var anchor = { getBoundingClientRect: function () { return rect; } };

    function measure(step) {
      var pad = step.padding == null ? (o.padding == null ? 6 : o.padding) : step.padding;
      var r = el.getBoundingClientRect();
      rect = { left: r.left - pad, top: r.top - pad, right: r.right + pad, bottom: r.bottom + pad, width: r.width + pad * 2, height: r.height + pad * 2 };
    }
    function paint(instant) {
      var step = steps[i];
      if (instant) spot.style.transition = 'none';
      if (el) {
        measure(step);
        spot.removeAttribute('data-center'); pop.removeAttribute('data-center');
        spot.style.left = rect.left + 'px'; spot.style.top = rect.top + 'px';
        spot.style.width = rect.width + 'px'; spot.style.height = rect.height + 'px';
        var rad = step.radius != null ? step.radius : getComputedStyle(el).borderTopLeftRadius;
        spot.style.borderRadius = typeof rad === 'number' ? rad + 'px' : 'calc(' + (rad || '0px') + ' + 4px)';
        if (instant) pop.style.transition = 'none';
        K.place(pop, anchor, { placement: step.placement || o.placement || 'bottom', offset: 14 });
      } else {
        spot.setAttribute('data-center', ''); pop.setAttribute('data-center', '');
        var vw = w.innerWidth, vh = d.documentElement.clientHeight;
        spot.style.left = vw / 2 + 'px'; spot.style.top = vh / 2 + 'px'; spot.style.width = '0px'; spot.style.height = '0px';
        pop.style.position = 'fixed';
        pop.style.left = Math.max(8, (vw - pop.offsetWidth) / 2) + 'px';
        pop.style.top = Math.max(8, (vh - pop.offsetHeight) / 2) + 'px';
      }
      if (instant) { void spot.offsetWidth; spot.style.transition = ''; pop.style.transition = ''; }
    }
    function onScroll() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; if (!done && i > -1) paint(true); }); }

    function render() {
      var step = steps[i], n = steps.length, last = i === n - 1;
      var dots = ''; for (var k = 0; k < n; k++) dots += '<i' + (k === i ? ' data-on' : k < i ? ' data-done' : '') + '></i>';
      pop.innerHTML =
        '<div class="tour-step-body">' +
          (step.media ? '<div class="tour-media">' + step.media + '</div>' : '') +
          '<div class="tour-head"><span class="tour-badge">' + (step.badge || ((i + 1) + ' of ' + n)) + '</span>' +
            '<button type="button" class="tour-close" aria-label="End tour" data-tour-act="end">' + K.icon.x + '</button></div>' +
          '<div class="tour-title" id="' + tid + '-t">' + (step.title || '') + '</div>' +
          '<div class="tour-body" id="' + tid + '-b">' + (step.body || '') + '</div>' +
        '</div>' +
        '<div class="tour-foot"><div class="tour-dots" aria-hidden="true">' + dots + '</div>' +
          (i === 0 && o.skip !== false && n > 1 ? '<button type="button" class="tour-skip" data-tour-act="end">' + (o.skipText || 'Skip') + '</button>' : '') +
          (i > 0 ? '<button type="button" class="btn btn-outline btn-sm" data-tour-act="prev">' + (o.backText || 'Back') + '</button>' : '') +
          '<button type="button" class="btn btn-sm" data-tour-act="next">' + (last ? (o.doneText || 'Finish') : (o.nextText || 'Next')) + '</button>' +
        '</div>' +
        '<div class="tour-progress" aria-hidden="true"><span style="transform:scaleX(' + ((i + 1) / n) + ')"></span></div>';
      K.arrow(pop);
    }

    function go(n) {
      if (done || n < 0 || n >= steps.length) return;
      var first = i < 0, dir = n >= i ? 1 : -1;
      i = n;
      var step = steps[i];
      if (el) el.classList.remove('tour-target-active');
      el = resolve(step.target);
      if (el && !el.getClientRects().length) el = null;
      if (step.target && !el && o.skipMissing !== false) { if (first) i = -1; return go(n + dir); }
      render();
      if (!first) { pop.removeAttribute('data-swap'); void pop.offsetWidth; pop.setAttribute('data-swap', ''); }
      var settle = function () {
        if (done) return;
        if (first) { K.show(spot, function () { paint(true); }); K.show(pop, function () { paint(true); }); }
        else paint(false);
        try { (pop.querySelector('[data-tour-act="next"]') || pop).focus({ preventScroll: true }); } catch (x) {}
      };
      if (el) {
        el.classList.add('tour-target-active');
        var r = el.getBoundingClientRect(), vh = d.documentElement.clientHeight;
        if (r.top < 80 || r.bottom > vh - 80) { el.scrollIntoView({ block: 'center', behavior: R.reducedMotion ? 'auto' : 'smooth' }); setTimeout(settle, R.reducedMotion ? 0 : 380); }
        else settle();
      } else settle();
      if (step.onEnter) try { step.onEnter(el, i); } catch (x) {}
      if (o.onStep) o.onStep(i, step);
      R.emit(d, 'tourstep', { index: i, step: step });
    }
    function end(completed) {
      if (done) return;
      done = true;
      active = null;
      popLayer(); w.removeEventListener('scroll', onScroll, true); w.removeEventListener('resize', onScroll);
      d.removeEventListener('keydown', onKey, true);
      if (el) el.classList.remove('tour-target-active');
      K.hide(spot, function () { spot.remove(); });
      K.hide(pop, function () { pop.remove(); });
      if (block) block.remove();
      try { if (prevFocus && prevFocus.focus) prevFocus.focus({ preventScroll: true }); } catch (x) {}
      if (o.onEnd) o.onEnd(!!completed);
      R.emit(d, 'tourend', { completed: !!completed, index: i });
    }
    function next() { if (i >= steps.length - 1) end(true); else go(i + 1); }
    function prev() { go(i - 1); }
    function onKey(e) {
      if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable="true"]')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'Tab') { // keep focus in the step card
        var f = R.focusables(pop); if (!f.length) return;
        var a = d.activeElement, fi = f.indexOf(a);
        if (fi < 0 || (e.shiftKey && fi === 0) || (!e.shiftKey && fi === f.length - 1)) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); }
      }
    }
    pop.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tour-act]'); if (!b) return;
      var a = b.getAttribute('data-tour-act');
      if (a === 'next') next(); else if (a === 'prev') prev(); else end(false);
    });
    var popLayer = R.pushLayer(function () { end(false); });
    w.addEventListener('scroll', onScroll, true); w.addEventListener('resize', onScroll);
    d.addEventListener('keydown', onKey, true);
    active = { next: next, prev: prev, go: go, end: end, get index() { return i; } };
    go(o.startAt || 0);
    return active;
  };
  R.tour.end = function () { if (active) active.end(false); };

  R.define('tour', {
    setup: function () {
      R.on(d, 'click', '[data-tour-start]', function (e, b) { e.preventDefault(); R.tour(b.getAttribute('data-tour-start')); });
    }
  });
})(window.Ranj);
