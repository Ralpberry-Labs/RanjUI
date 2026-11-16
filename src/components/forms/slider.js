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
