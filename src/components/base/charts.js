/*!
 * Ranj UI — Charts: sparkline, bar-chart, line-chart, donut-chart, gauge, heatmap.
 * Tiny dependency-free SVG charts driven by data attributes. Every chart:
 *  - sizes itself to its container (ResizeObserver) and re-renders when data-* changes,
 *  - animates in once when it enters the viewport (skipped with reduced motion),
 *  - reads colors from CSS tokens (--chart-1..8, --primary, --success …) so themes just work.
 * Imperative: Ranj.chart.bar(el, opts), .line, .donut, .gauge, .heatmap, .sparkline
 */
(function (R) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var gid = 0;

  /* ---------------- helpers ---------------- */
  function nums(s) {
    if (Array.isArray(s)) return s.map(Number);
    return String(s == null ? '' : s).split(',').map(function (x) { return parseFloat(x); }).filter(function (n) { return !isNaN(n); });
  }
  function strs(s) {
    if (Array.isArray(s)) return s.map(String);
    return s ? String(s).split(',').map(function (x) { return x.trim(); }) : [];
  }
  function json(s, fb) { if (!s) return fb; if (typeof s === 'object') return s; try { return JSON.parse(s); } catch (e) { return fb; } }
  function color(c, i) {
    if (!c) return 'var(--chart-' + ((i || 0) % 8 + 1) + ')';
    if (/^(primary|success|warning|destructive|info|muted-fg|muted|fg|border|border-strong)$/.test(c)) return 'var(--' + c + ')';
    if (/^chart-\d$/.test(c)) return 'var(--' + c + ')';
    return c;
  }
  function f2(n) { return Math.round(n * 100) / 100; }
  function h(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function div(cls, parent, html) {
    var e = document.createElement('div');
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  /** Number formatter from options: format (number|currency|percent|compact), currency, decimals, prefix, suffix. */
  function fmter(o) {
    return function (v, short) {
      if (v == null || isNaN(v)) return '–';
      var op = { minimumFractionDigits: 0 };
      var dec = o.decimals != null && o.decimals !== '' ? +o.decimals : (Math.abs(v) < 10 && v % 1 ? 1 : 0);
      op.maximumFractionDigits = dec;
      if ((short && Math.abs(v) >= 1000) || o.format === 'compact') { op.notation = 'compact'; op.maximumFractionDigits = Math.abs(v) >= 1000 ? 1 : dec; }
      if (o.format === 'currency') { op.style = 'currency'; op.currency = o.currency || 'USD'; }
      var s;
      try { s = new Intl.NumberFormat(o.locale || 'en-US', op).format(v); } catch (e) { s = String(v); }
      if (o.format === 'percent') s += '%';
      return (o.prefix || '') + s + (o.suffix || '');
    };
  }
  function niceNum(range, round) {
    var e = Math.floor(Math.log10(range)), f = range / Math.pow(10, e), nf;
    if (round) nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
    else nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
    return nf * Math.pow(10, e);
  }
  function ticks(min, max, n) {
    if (max === min) { max = min + 1; }
    var step = niceNum(niceNum(max - min, false) / Math.max(1, n - 1), true);
    var lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step, out = [];
    for (var v = lo; v <= hi + step / 2; v += step) out.push(+v.toFixed(10));
    return out;
  }
  /** Monotone cubic (Fritsch–Carlson) path through points; never overshoots. */
  function pathD(p, smooth) {
    if (!p.length) return '';
    var i, d = 'M' + f2(p[0][0]) + ',' + f2(p[0][1]);
    if (!smooth || p.length < 3) { for (i = 1; i < p.length; i++) d += 'L' + f2(p[i][0]) + ',' + f2(p[i][1]); return d; }
    var n = p.length, dx = [], m = [], t = [];
    for (i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0]; m[i] = (p[i + 1][1] - p[i][1]) / (dx[i] || 1); }
    t[0] = m[0]; t[n - 1] = m[n - 2];
    for (i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : 3 * (dx[i - 1] + dx[i]) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
    for (i = 0; i < n - 1; i++) {
      var k = dx[i] / 3;
      d += 'C' + f2(p[i][0] + k) + ',' + f2(p[i][1] + t[i] * k) + ',' + f2(p[i + 1][0] - k) + ',' + f2(p[i + 1][1] - t[i + 1] * k) + ',' + f2(p[i + 1][0]) + ',' + f2(p[i + 1][1]);
    }
    return d;
  }
  function roundTop(x, y, w, hh, r) {
    r = Math.max(0, Math.min(r, w / 2, hh));
    return 'M' + f2(x) + ',' + f2(y + hh) + 'V' + f2(y + r) + 'Q' + f2(x) + ',' + f2(y) + ' ' + f2(x + r) + ',' + f2(y) +
      'H' + f2(x + w - r) + 'Q' + f2(x + w) + ',' + f2(y) + ' ' + f2(x + w) + ',' + f2(y + r) + 'V' + f2(y + hh) + 'Z';
  }
  function gradient(svg, c, top, bottom) {
    var id = 'rch-g' + (++gid);
    var defs = svg.querySelector('defs') || h('defs', {}, svg);
    var g = h('linearGradient', { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    h('stop', { offset: '0%', style: 'stop-color:' + c + ';stop-opacity:' + top }, g);
    h('stop', { offset: '100%', style: 'stop-color:' + c + ';stop-opacity:' + bottom }, g);
    return 'url(#' + id + ')';
  }
  function getSeries(o) {
    var s = json(o.series, null);
    if (!s || !s.length) s = [{ name: o.name || 'Value', values: nums(o.values), color: o.color }];
    return s.map(function (x, i) { return { name: x.name || 'Series ' + (i + 1), values: nums(x.values || []), color: color(x.color, i) }; });
  }
  function legendHtml(series) {
    return series.map(function (s) {
      return '<span class="chart-legend-item"><i style="background:' + s.color + '"></i>' + R.esc(s.name) + '</span>';
    }).join('');
  }

  /* ---------------- shared tooltip ---------------- */
  var tip = null, tipTimer = 0;
  function showTip(html, x, y) {
    if (!tip) { tip = document.createElement('div'); tip.className = 'chart-tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip); }
    clearTimeout(tipTimer);
    tip.innerHTML = html;
    tip.setAttribute('data-state', 'open');
    R.position(tip, { x: x, y: y }, { placement: 'top', offset: 10 });
  }
  function hideTip() { if (tip) { tip.setAttribute('data-state', 'closed'); } }
  function tipRows(title, rows) {
    return (title ? '<div class="chart-tip-title">' + R.esc(title) + '</div>' : '') + rows.map(function (r) {
      return '<div class="chart-tip-row">' + (r.c ? '<i style="background:' + r.c + '"></i>' : '') + '<span>' + R.esc(r.k) + '</span><b>' + R.esc(r.v) + '</b></div>';
    }).join('');
  }

  /** Index-based hover/keyboard for x-axis charts. xs = pixel x of each index (svg coords). */
  function bindIndex(svg, xs, show, hide) {
    var cur = -1;
    function at(i) { if (i === cur) return; cur = i; show(i); }
    function nearest(cx) {
      var best = 0, bd = Infinity;
      for (var i = 0; i < xs.length; i++) { var dd = Math.abs(xs[i] - cx); if (dd < bd) { bd = dd; best = i; } }
      return best;
    }
    function move(e) { var r = svg.getBoundingClientRect(); at(nearest((e.clientX - r.left) * (svg.viewBox.baseVal.width / r.width || 1))); }
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' || !e.pointerType) { cur = -1; hide(); } });
    svg.addEventListener('blur', function () { cur = -1; hide(); });
    svg.addEventListener('keydown', function (e) {
      var n = xs.length, i = cur < 0 ? n - 1 : cur;
      if (e.key === 'ArrowRight') i = Math.min(n - 1, cur < 0 ? 0 : cur + 1);
      else if (e.key === 'ArrowLeft') i = Math.max(0, cur < 0 ? n - 1 : cur - 1);
      else if (e.key === 'Home') i = 0;
      else if (e.key === 'End') i = n - 1;
      else if (e.key === 'Escape') { cur = -1; hide(); return; }
      else return;
      e.preventDefault(); at(i);
    });
  }
  function svgPoint(svg, x, y) {
    var r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, sx = r.width / (vb.width || r.width), sy = r.height / (vb.height || r.height);
    return { x: r.left + x * sx, y: r.top + y * sy };
  }

  /* ---------------- count-up for [data-count] ---------------- */
  function countUp(node) {
    var to = parseFloat(node.getAttribute('data-count')), fmt = node.__fmt || String, from = 0, t0 = 0, dur = 1100;
    if (isNaN(to)) return;
    function step(t) {
      if (!node.isConnected) return;
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      node.textContent = fmt(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    }
    node.textContent = fmt(from);
    requestAnimationFrame(step);
  }

  /* ---------------- renderers ---------------- */
  var T = {};

  /* Sparkline ------------------------------------------------------------ */
  T.sparkline = {
    cls: 'sparkline',
    defaults: { values: '', type: 'line', color: 'primary', curve: true, dot: true, min: '', max: '', stroke: 1.75, labels: '', tooltip: true, format: '', prefix: '', suffix: '', decimals: '', currency: '' },
    render: function (el, o, W) {
      var H = el.clientHeight || 40, v = nums(o.values), n = v.length;
      el.innerHTML = '';
      if (!n) return;
      var c = color(o.color), sw = +o.stroke || 1.75, pad = o.type === 'bar' ? 0 : sw + (o.dot ? 2.5 : 0);
      var mn = o.min !== '' ? +o.min : Math.min.apply(null, v), mx = o.max !== '' ? +o.max : Math.max.apply(null, v);
      if (o.type === 'bar') mn = Math.min(0, mn);
      if (mx === mn) { mx += 1; mn -= 1; }
      var svg = h('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, class: 'chart-svg', 'aria-hidden': 'true', style: '--c:' + c }, el);
      var sy = function (x) { return pad + (H - pad * 2) * (1 - (x - mn) / (mx - mn)); };
      var xs = [], labels = strs(o.labels), F = fmter(o);
      if (o.type === 'bar') {
        var bw = W / n, g = Math.max(1, Math.min(3, bw * 0.25));
        v.forEach(function (x, i) {
          var y = sy(Math.max(x, mn)), y0 = sy(Math.max(0, mn));
          h('rect', { x: f2(i * bw + g / 2), y: f2(Math.min(y, y0 - 1)), width: f2(Math.max(1, bw - g)), height: f2(Math.max(1, Math.abs(y0 - y))), rx: Math.min(2, (bw - g) / 2), class: 'ch-bar ch-spark-bar' + (i === n - 1 ? ' is-last' : ''), style: '--i:' + i }, svg);
          xs.push(i * bw + bw / 2);
        });
      } else {
        var pts = v.map(function (x, i) { var px = n === 1 ? W / 2 : pad + i * (W - pad * 2) / (n - 1); xs.push(px); return [px, sy(x)]; });
        var d = pathD(pts, o.curve);
        if (o.type === 'area') h('path', { d: d + 'L' + f2(pts[n - 1][0]) + ',' + H + 'L' + f2(pts[0][0]) + ',' + H + 'Z', fill: gradient(svg, c, 0.32, 0), class: 'ch-area' }, svg);
        h('path', { d: d, class: 'ch-line', 'stroke-width': sw, pathLength: 1 }, svg);
        if (o.dot) h('circle', { cx: f2(pts[n - 1][0]), cy: f2(pts[n - 1][1]), r: 2.5, class: 'ch-end' }, svg);
        var hov = h('circle', { r: 3.5, class: 'ch-hover-dot', cx: -10, cy: -10 }, svg);
      }
      if (o.tooltip) {
        bindIndex(svg, xs, function (i) {
          if (hov) { hov.setAttribute('cx', xs[i]); hov.setAttribute('cy', sy(v[i])); hov.style.opacity = 1; }
          else R.$$('.ch-spark-bar', svg).forEach(function (b, j) { b.classList.toggle('is-hover', j === i); });
          var p = svgPoint(svg, xs[i], o.type === 'bar' ? 0 : sy(v[i]));
          showTip(tipRows('', [{ k: labels[i] || '', v: F(v[i]), c: c }]), p.x, p.y);
        }, function () {
          if (hov) hov.style.opacity = 0; else R.$$('.ch-spark-bar', svg).forEach(function (b) { b.classList.remove('is-hover'); });
          hideTip();
        });
      }
    }
  };

  /* Axis frame shared by bar + line ------------------------------------------ */
  function frame(el, o, W, series, labels, mn, mx) {
    el.innerHTML = '';
    var F = fmter(o), H = +o.height || 260;
    var head = null;
    if (o.legend !== false && (series.length > 1 || o.legend === true)) head = div('chart-legend', el, legendHtml(series));
    var tk = ticks(mn, mx, +o.yTicks || 5), y0 = tk[0], y1 = tk[tk.length - 1];
    var showY = o.yAxis !== false;
    var ml = showY ? Math.max.apply(null, tk.map(function (t) { return F(t, true).length; })) * 6.4 + 14 : 4;
    var mt = 8, mb = o.xAxis !== false ? 28 : 6, mr = 6;
    var svg = h('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, class: 'chart-svg', role: 'img', tabindex: 0, 'aria-label': o.title || el.getAttribute('aria-label') || 'Chart' }, el);
    var iw = W - ml - mr, ih = H - mt - mb;
    var sy = function (x) { return mt + ih - (x - y0) / (y1 - y0) * ih; };
    var grid = h('g', { class: 'ch-grid' }, svg);
    if (o.grid !== false) tk.forEach(function (t) { h('line', { x1: ml, x2: W - mr, y1: f2(sy(t)), y2: f2(sy(t)), class: t === 0 ? 'is-zero' : null }, grid); });
    if (showY) {
      var ya = h('g', { class: 'ch-axis ch-axis-y' }, svg);
      tk.forEach(function (t) { var tx = h('text', { x: ml - 10, y: f2(sy(t) + 4), 'text-anchor': 'end' }, ya); tx.textContent = F(t, true); });
    }
    return { svg: svg, F: F, H: H, ml: ml, mt: mt, mb: mb, mr: mr, iw: iw, ih: ih, sy: sy, y0: y0, W: W };
  }
  function xLabels(fr, labels, xs, band) {
    var g = h('g', { class: 'ch-axis ch-axis-x' }, fr.svg), maxLen = 0;
    labels.forEach(function (l) { maxLen = Math.max(maxLen, l.length); });
    var step = Math.max(1, Math.ceil((maxLen * 6.6 + 12) / Math.max(1, band)));
    labels.forEach(function (l, i) {
      if (i % step && i !== labels.length - 1) return;
      if (i === labels.length - 1 && i % step && (i % step) < step * 0.6) return;
      var anchor = 'middle', x = xs[i];
      if (!fr.band) { if (i === 0) anchor = 'start'; else if (i === labels.length - 1) anchor = 'end'; }
      var t = h('text', { x: f2(x), y: fr.H - 8, 'text-anchor': anchor }, g); t.textContent = l;
    });
  }

  /* Bar chart ------------------------------------------------------------ */
  T.bar = {
    cls: 'bar-chart',
    defaults: { labels: '', values: '', series: '', stacked: false, height: 260, format: '', currency: '', decimals: '', prefix: '', suffix: '', legend: 'auto', grid: true, yAxis: true, xAxis: true, yTicks: 5, radius: 4, color: '', name: '', title: '' },
    render: function (el, o, W) {
      var series = getSeries(o), labels = strs(o.labels), S = series.length;
      var n = Math.max(labels.length, Math.max.apply(null, series.map(function (s) { return s.values.length; })));
      if (!n) { el.innerHTML = ''; return; }
      while (labels.length < n) labels.push('');
      var mx = 0, mn = 0;
      for (var i = 0; i < n; i++) {
        var tot = 0;
        series.forEach(function (s) { var x = s.values[i] || 0; tot += Math.max(0, x); mx = Math.max(mx, x); mn = Math.min(mn, x); });
        if (o.stacked) mx = Math.max(mx, tot);
      }
      if (o.legend === 'auto') o.legend = S > 1 ? 'auto' : false;
      var fr = frame(el, o, W, series, labels, mn, mx); fr.band = true;
      var svg = fr.svg, bw = fr.iw / n, grouped = S > 1 && !o.stacked;
      var gpad = bw * (grouped ? 0.16 : 0.2), gap = grouped ? Math.min(4, bw * 0.06) : 0;
      var inner = bw - gpad * 2, barW = grouped ? (inner - gap * (S - 1)) / S : inner;
      if (barW > 44) { barW = 44; inner = grouped ? barW * S + gap * (S - 1) : barW; }
      var bands = h('g', {}, svg), bars = h('g', { class: 'ch-bars' }, svg), xs = [], tops = [];
      var zero = fr.sy(Math.max(0, fr.y0));
      for (i = 0; i < n; i++) {
        var bx = fr.ml + i * bw, start = bx + (bw - inner) / 2, acc = 0, top = zero;
        xs.push(bx + bw / 2);
        h('rect', { x: f2(bx + 2), y: fr.mt, width: f2(Math.max(0, bw - 4)), height: fr.ih, rx: 6, class: 'ch-band' }, bands);
        var col = h('g', { class: 'ch-col', 'data-i': i }, bars);
        var lastIdx = -1;
        if (o.stacked) series.forEach(function (s, si) { if ((s.values[i] || 0) > 0) lastIdx = si; });
        series.forEach(function (s, si) {
          var val = s.values[i] || 0, x, y, hh, d;
          if (o.stacked) {
            if (val <= 0) return;
            y = fr.sy(acc + val); hh = fr.sy(acc) - y; x = start; acc += val;
            d = si === lastIdx ? roundTop(x, y, barW, hh, +o.radius) : 'M' + f2(x) + ',' + f2(y) + 'h' + f2(barW) + 'v' + f2(hh) + 'h' + f2(-barW) + 'Z';
            top = Math.min(top, y);
          } else {
            x = start + si * (barW + gap);
            y = fr.sy(Math.max(0, val)); hh = Math.abs(fr.sy(val) - zero);
            if (val < 0) { y = zero; d = 'M' + f2(x) + ',' + f2(y) + 'h' + f2(barW) + 'v' + f2(hh) + 'h' + f2(-barW) + 'Z'; }
            else d = roundTop(x, y, barW, Math.max(hh, val > 0 ? 1 : 0), +o.radius);
            top = Math.min(top, y);
          }
          h('path', { d: d, fill: s.color, class: 'ch-bar', style: '--i:' + i + (o.stacked ? ';transform-origin:center ' + f2(zero) + 'px' : '') }, col);
        });
        tops.push(top);
      }
      if (o.xAxis !== false) xLabels(fr, labels, xs, bw);
      bindIndex(svg, xs, function (k) {
        R.$$('.ch-band', svg).forEach(function (b, j) { b.classList.toggle('is-active', j === k); });
        el.setAttribute('data-hover', '');
        R.$$('.ch-col', svg).forEach(function (c, j) { c.classList.toggle('is-active', j === k); });
        var rows = series.map(function (s) { return { k: s.name, v: fr.F(s.values[k] || 0), c: s.color }; });
        if (o.stacked && S > 1) rows.push({ k: 'Total', v: fr.F(series.reduce(function (a, s) { return a + (s.values[k] || 0); }, 0)) });
        var p = svgPoint(svg, xs[k], tops[k]);
        showTip(tipRows(labels[k], rows), p.x, p.y);
      }, function () {
        el.removeAttribute('data-hover');
        R.$$('.ch-band.is-active, .ch-col.is-active', svg).forEach(function (b) { b.classList.remove('is-active'); });
        hideTip();
      });
    }
  };

  /* Line / area chart ------------------------------------------------------ */
  T.line = {
    cls: 'line-chart',
    defaults: { labels: '', values: '', series: '', type: 'line', curve: true, dots: false, zero: true, height: 260, format: '', currency: '', decimals: '', prefix: '', suffix: '', legend: 'auto', grid: true, yAxis: true, xAxis: true, yTicks: 5, stroke: 2, color: '', name: '', title: '' },
    render: function (el, o, W) {
      var series = getSeries(o), labels = strs(o.labels), S = series.length;
      var n = Math.max(labels.length, Math.max.apply(null, series.map(function (s) { return s.values.length; })));
      if (!n) { el.innerHTML = ''; return; }
      while (labels.length < n) labels.push('');
      var all = [];
      series.forEach(function (s) { all = all.concat(s.values); });
      var mn = Math.min.apply(null, all), mx = Math.max.apply(null, all);
      if (o.zero) mn = Math.min(0, mn);
      else { var padv = (mx - mn) * 0.1; mn -= padv; mx += padv; }
      if (o.legend === 'auto') o.legend = S > 1 ? 'auto' : false;
      var fr = frame(el, o, W, series, labels, mn, mx), svg = fr.svg;
      var px = 6, xs = [];
      for (var i = 0; i < n; i++) xs.push(fr.ml + px + (n === 1 ? (fr.iw - px * 2) / 2 : i * (fr.iw - px * 2) / (n - 1)));
      var area = o.type === 'area', bottom = fr.sy(fr.y0);
      var g = h('g', { class: 'ch-series' }, svg);
      series.forEach(function (s, si) {
        var pts = [];
        s.values.forEach(function (v, j) { if (v != null && !isNaN(v)) pts.push([xs[j], fr.sy(v)]); });
        if (!pts.length) return;
        var d = pathD(pts, o.curve);
        if (area) h('path', { d: d + 'L' + f2(pts[pts.length - 1][0]) + ',' + f2(bottom) + 'L' + f2(pts[0][0]) + ',' + f2(bottom) + 'Z', fill: gradient(svg, s.color, S > 1 ? 0.18 : 0.28, 0), class: 'ch-area', style: '--i:' + si }, g);
        h('path', { d: d, stroke: s.color, 'stroke-width': +o.stroke || 2, class: 'ch-line', pathLength: 1, style: '--i:' + si }, g);
        if (o.dots) pts.forEach(function (p) { h('circle', { cx: f2(p[0]), cy: f2(p[1]), r: 3, fill: s.color, class: 'ch-dot' }, g); });
      });
      if (o.xAxis !== false) xLabels(fr, labels, xs, (fr.iw) / Math.max(1, n - 1));
      var cross = h('line', { x1: 0, x2: 0, y1: fr.mt, y2: fr.mt + fr.ih, class: 'ch-cross' }, svg);
      var hd = series.map(function (s) { return h('circle', { r: 4.5, cx: -20, cy: -20, fill: s.color, class: 'ch-hover-dot' }, svg); });
      bindIndex(svg, xs, function (k) {
        cross.setAttribute('x1', xs[k]); cross.setAttribute('x2', xs[k]); cross.style.opacity = 1;
        var top = Infinity;
        series.forEach(function (s, si) {
          var v = s.values[k];
          if (v == null || isNaN(v)) { hd[si].style.opacity = 0; return; }
          var y = fr.sy(v); top = Math.min(top, y);
          hd[si].setAttribute('cx', xs[k]); hd[si].setAttribute('cy', f2(y)); hd[si].style.opacity = 1;
        });
        var p = svgPoint(svg, xs[k], top === Infinity ? fr.mt : top);
        showTip(tipRows(labels[k], series.map(function (s) { return { k: s.name, v: fr.F(s.values[k]), c: s.color }; })), p.x, p.y);
      }, function () {
        cross.style.opacity = 0; hd.forEach(function (c) { c.style.opacity = 0; }); hideTip();
      });
    }
  };

  /* Donut / pie --------------------------------------------------------------- */
  T.donut = {
    cls: 'donut-chart',
    defaults: { values: '', labels: '', colors: '', label: 'Total', value: '', pie: false, thickness: 0, size: 200, legend: 'auto', gap: 0.7, format: '', currency: '', decimals: '', prefix: '', suffix: '', title: '' },
    render: function (el, o, W) {
      var v = nums(o.values), labels = strs(o.labels), cols = strs(o.colors), F = fmter(o);
      el.innerHTML = '';
      if (!v.length) return;
      var total = v.reduce(function (a, b) { return a + b; }, 0) || 1;
      var legend = o.legend, size = Math.min(+o.size || 200, W);
      if (legend === 'auto') legend = W >= size + 230 ? 'right' : 'bottom';
      el.setAttribute('data-layout', legend);
      var pctData = o.format === 'percent' || o.suffix === '%';
      el.classList.toggle('donut-pct', pctData);
      var wrap = div('donut-wrap', el);
      var fig = div('donut-figure', wrap); fig.style.width = size + 'px'; fig.style.height = size + 'px';
      var th = o.pie ? size / 2 : (+o.thickness || Math.max(10, Math.round(size * 0.12)));
      var r = o.pie ? size / 4 : (size - th) / 2 - 1, c = size / 2;
      var svg = h('svg', { width: size, height: size, viewBox: '0 0 ' + size + ' ' + size, class: 'chart-svg', role: 'img', 'aria-label': o.title || 'Donut chart' }, fig);
      if (!o.pie) h('circle', { cx: c, cy: c, r: r, class: 'ch-track', 'stroke-width': th }, svg);
      var g = h('g', { transform: 'rotate(-90 ' + c + ' ' + c + ')' }, svg);
      var gap = v.length > 1 ? +o.gap : 0, acc = 0, segs = [];
      v.forEach(function (x, i) {
        var len = x / total * 100, col = color(cols[i], i);
        var seg = h('circle', { cx: c, cy: c, r: r, fill: 'none', stroke: col, 'stroke-width': th, pathLength: 100, class: 'ch-seg', tabindex: 0,
          style: '--len:' + f2(Math.max(0.01, len - gap)) + ';--off:' + f2(-(acc + gap / 2)) + ';--i:' + i, 'aria-label': (labels[i] || '') + ' ' + F(x) }, g);
        acc += len; segs.push(seg);
      });
      var center = null, cv, cl;
      if (!o.pie) {
        center = div('donut-center', fig);
        cv = document.createElement('b'); cl = document.createElement('span'); center.appendChild(cv); center.appendChild(cl);
        cv.style.fontSize = Math.max(14, Math.round(size * 0.12)) + 'px';
      }
      function setCenter(i) {
        if (!center) return;
        if (i == null) {
          cv.textContent = o.value !== '' ? o.value : F(total, true);
          if (o.value === '') { cv.setAttribute('data-count', total); cv.__fmt = function (x) { return F(x, true); }; }
          cl.textContent = o.label;
        } else { cv.removeAttribute('data-count'); cv.textContent = F(v[i], true); cl.textContent = (labels[i] || '') + (pctData ? '' : ' · ' + Math.round(v[i] / total * 1000) / 10 + '%'); }
      }
      setCenter(null);
      var items = [];
      if (legend !== 'none' && legend !== false) {
        var ul = document.createElement('ul'); ul.className = 'donut-legend'; wrap.appendChild(ul);
        v.forEach(function (x, i) {
          var li = document.createElement('li'); li.tabIndex = 0;
          li.innerHTML = '<i style="background:' + color(cols[i], i) + '"></i><span>' + R.esc(labels[i] || '') + '</span><b>' + R.esc(F(x)) + '</b>' + (pctData ? '' : '<em>' + Math.round(x / total * 1000) / 10 + '%</em>');
          ul.appendChild(li); items.push(li);
        });
      }
      function act(i, e) {
        el.toggleAttribute('data-active', i != null);
        segs.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
        items.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
        setCenter(i);
        if (i != null && (o.pie || !center) && e) {
          showTip(tipRows('', [{ k: labels[i] || '', v: F(v[i]) + (pctData ? '' : '  ·  ' + Math.round(v[i] / total * 100) + '%'), c: color(cols[i], i) }]), e.clientX, e.clientY - 4);
        } else hideTip();
      }
      segs.concat(items).forEach(function (n, k) {
        var i = k % v.length;
        n.addEventListener('pointerenter', function (e) { act(i, e); });
        n.addEventListener('pointermove', function (e) { if (o.pie || !center) act(i, e); });
        n.addEventListener('pointerleave', function () { act(null); });
        n.addEventListener('focus', function () { act(i); });
        n.addEventListener('blur', function () { act(null); });
      });
    }
  };

  /* Gauge / radial progress -------------------------------------------------- */
  T.gauge = {
    cls: 'gauge',
    defaults: { value: 0, min: 0, max: 100, label: '', type: 'ring', color: 'primary', size: 160, thickness: 0, text: '', format: '', currency: '', decimals: '', prefix: '', suffix: '%', title: '' },
    render: function (el, o, W) {
      var size = Math.min(+o.size || 160, W || 160), F = fmter(o);
      var th = +o.thickness || Math.max(6, Math.round(size * 0.085));
      var pct = R.clamp((+o.value - +o.min) / ((+o.max - +o.min) || 1), 0, 1);
      var span = o.type === 'half' ? 50 : o.type === 'arc' ? 75 : 100, rot = o.type === 'half' ? 180 : o.type === 'arc' ? 135 : -90;
      var r = (size - th) / 2 - 1, c = size / 2, vh = o.type === 'half' ? Math.ceil(c + th / 2 + 2) : size;
      el.innerHTML = '';
      var fig = div('gauge-figure', el); fig.style.width = size + 'px'; fig.style.height = vh + 'px';
      var col = color(o.color);
      var svg = h('svg', { width: size, height: vh, viewBox: '0 0 ' + size + ' ' + vh, class: 'chart-svg', role: 'meter', 'aria-valuemin': o.min, 'aria-valuemax': o.max, 'aria-valuenow': o.value, 'aria-label': o.title || o.label || 'Gauge' }, fig);
      var g = h('g', { transform: 'rotate(' + rot + ' ' + c + ' ' + c + ')' }, svg);
      h('circle', { cx: c, cy: c, r: r, fill: 'none', 'stroke-width': th, pathLength: 100, class: 'ch-track', style: 'stroke-dasharray:' + span + ' 100' }, g);
      h('circle', { cx: c, cy: c, r: r, fill: 'none', 'stroke-width': th, stroke: col, pathLength: 100, class: 'ch-seg ch-gauge-val', style: '--len:' + f2(Math.max(0.001, span * pct)) + ';--off:0' }, g);
      var center = div('gauge-center', fig);
      var b = document.createElement('b'); center.appendChild(b);
      b.style.fontSize = Math.max(13, Math.round(size * (o.type === 'half' ? 0.17 : 0.2))) + 'px';
      if (o.text) b.textContent = o.text;
      else { b.textContent = F(+o.value); b.setAttribute('data-count', +o.value); b.__fmt = function (x) { return F(Math.abs(+o.value) >= 10 && o.decimals === '' ? Math.round(x) : x); }; }
      if (o.label) { var s = document.createElement('span'); s.textContent = o.label; center.appendChild(s); }
      if (o.type === 'half') {
        var ends = div('gauge-ends', el); ends.style.width = size + 'px';
        ends.innerHTML = '<span>' + R.esc(F(+o.min)) + '</span><span>' + R.esc(F(+o.max)) + '</span>';
      }
    }
  };

  /* Heatmap calendar ------------------------------------------------------------ */
  function rng(seed) {
    var a = seed >>> 0;
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function parseDate(s) { if (!s) { var d = new Date(); d.setHours(0, 0, 0, 0); return d; } var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +(p[2] || 1)); }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  T.heatmap = {
    cls: 'heatmap',
    defaults: { values: '', end: '', weeks: 53, seed: 0, color: 'primary', label: 'contributions', unit: '', legend: true, summary: true, cell: 0, title: '' },
    render: function (el, o, W) {
      var weeks = Math.max(1, +o.weeks || 53), end = parseDate(o.end);
      var start = new Date(end); start.setDate(end.getDate() - end.getDay() - (weeks - 1) * 7);
      var days = Math.round((end - start) / 864e5) + 1, v = nums(o.values);
      if (!v.length) {
        var rnd = rng(+o.seed || 7), streak = 0;
        for (var i = 0; i < days; i++) {
          var dt = new Date(start); dt.setDate(start.getDate() + i);
          var wk = dt.getDay() === 0 || dt.getDay() === 6, season = 0.6 + 0.4 * Math.sin(i / 38);
          if (rnd() < 0.08) streak = Math.floor(rnd() * 6) + 2;
          var p = (wk ? 0.35 : 0.78) * season + (streak > 0 ? 0.3 : 0);
          v.push(rnd() < p ? Math.round((rnd() * rnd() * 14 + 1) * (streak > 0 ? 1.8 : 1) * season) : 0);
          if (streak > 0) streak--;
        }
      }
      // align: last value = end date
      var vals = new Array(days).fill(0), off = days - v.length;
      v.forEach(function (x, j) { if (j + off >= 0) vals[j + off] = x; });
      var nz = vals.filter(function (x) { return x > 0; }).sort(function (a, b) { return a - b; });
      var q = function (k) { return nz.length ? nz[Math.min(nz.length - 1, Math.floor(nz.length * k))] : 1; };
      var th = [q(0.25), q(0.5), q(0.75)];
      var lvl = function (x) { return x <= 0 ? 0 : x <= th[0] ? 1 : x <= th[1] ? 2 : x <= th[2] ? 3 : 4; };
      var left = 30, top = 18, gap = 3;
      var cell = +o.cell || R.clamp(Math.floor((W - left) / weeks) - gap, 7, 15);
      if (cell < 10) gap = 2;
      var gw = left + weeks * (cell + gap), gh = top + 7 * (cell + gap);
      el.innerHTML = '';
      el.style.setProperty('--c', color(o.color));
      var sc = div('heatmap-scroll', el);
      var svg = h('svg', { width: gw, height: gh, viewBox: '0 0 ' + gw + ' ' + gh, class: 'chart-svg', role: 'img', 'aria-label': o.title || 'Activity calendar' }, sc);
      var ax = h('g', { class: 'ch-axis' }, svg);
      [1, 3, 5].forEach(function (d) { var t = h('text', { x: 0, y: top + d * (cell + gap) + cell - 2 }, ax); t.textContent = DAYS[d]; });
      var lastM = -1, cells = h('g', {}, svg), total = 0;
      for (i = 0; i < days; i++) {
        var d2 = new Date(start); d2.setDate(start.getDate() + i);
        var w = Math.floor(i / 7), x = left + w * (cell + gap), y = top + d2.getDay() * (cell + gap);
        if (d2.getDate() <= 7 && d2.getMonth() !== lastM && d2.getDay() === 0) {
          lastM = d2.getMonth();
          if (w < weeks - 1) { var mt = h('text', { x: x, y: 11 }, ax); mt.textContent = MONTHS[lastM]; }
        }
        total += vals[i];
        h('rect', { x: x, y: y, width: cell, height: cell, rx: Math.max(2, cell * 0.22), class: 'hm-cell hm-l' + lvl(vals[i]), style: '--i:' + w, 'data-i': i }, cells);
      }
      var unit = o.label;
      var foot = div('heatmap-foot', el);
      foot.innerHTML = (o.summary ? '<span><b>' + total.toLocaleString('en-US') + '</b> ' + R.esc(unit) + ' in the last ' + (weeks >= 52 ? 'year' : weeks + ' weeks') + '</span>' : '<span></span>') +
        (o.legend ? '<span class="heatmap-legend">Less<i class="hm-l0"></i><i class="hm-l1"></i><i class="hm-l2"></i><i class="hm-l3"></i><i class="hm-l4"></i>More</span>' : '');
      svg.addEventListener('pointerover', function (e) {
        var t = e.target; if (!t.classList || !t.classList.contains('hm-cell')) return;
        var k = +t.getAttribute('data-i'), dd = new Date(start); dd.setDate(start.getDate() + k);
        var r = t.getBoundingClientRect(), n = vals[k];
        showTip('<div class="chart-tip-title">' + (n ? n.toLocaleString('en-US') : 'No') + ' ' + R.esc(unit) + '</div><div class="chart-tip-sub">' + DAYS[dd.getDay()] + ', ' + MONTHS[dd.getMonth()] + ' ' + dd.getDate() + ', ' + dd.getFullYear() + '</div>', r.left + r.width / 2, r.top);
      });
      svg.addEventListener('pointerleave', hideTip);
      // Most recent weeks visible on narrow screens
      sc.scrollLeft = sc.scrollWidth;
    }
  };

  /* ---------------- mounting ---------------- */
  function define(type) {
    var t = T[type];
    R.define('chart-' + type, {
      selector: '.' + t.cls,
      mount: function (el) {
        var lastW = -1, lastH = -1, raf = 0;
        function draw() {
          raf = 0;
          var W = el.clientWidth;
          if (!W && type !== 'gauge') return;
          lastW = W; lastH = el.clientHeight;
          var o = R.opts(el, t.defaults);
          if (o.decimals === '') { var mm = ((el.getAttribute('data-values') || '') + (el.getAttribute('data-series') || '')).match(/\.\d+/g); if (mm) o.decimals = Math.min(2, Math.max.apply(null, mm.map(function (x) { return x.length - 1; }))); }
          if (o.legend === 'false') o.legend = false; else if (o.legend === 'true') o.legend = true;
          try { t.render(el, o, W); } catch (e) { console.error('[Ranj] chart ' + type, e); }
          if (el.classList.contains('is-in')) R.$$('[data-count]', el).forEach(function (n) { n.textContent = (n.__fmt || String)(+n.getAttribute('data-count')); });
        }
        function schedule() { if (!raf) raf = requestAnimationFrame(draw); }
        var anim = !R.reducedMotion && !el.hasAttribute('data-static');
        if (anim) el.classList.add('chart-anim'); else el.classList.add('is-in');
        draw();
        var ro = 'ResizeObserver' in window ? new ResizeObserver(function () {
          if (Math.abs(el.clientWidth - lastW) > 1 || (type === 'sparkline' && Math.abs(el.clientHeight - lastH) > 1)) schedule();
        }) : null;
        if (ro) ro.observe(el);
        var mo = new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) if (/^data-/.test(ms[i].attributeName) && ms[i].attributeName !== 'data-active' && ms[i].attributeName !== 'data-hover' && ms[i].attributeName !== 'data-layout') { schedule(); return; } });
        mo.observe(el, { attributes: true });
        var stopView = anim ? R.inView(el, function () {
          el.classList.add('is-in');
          R.$$('[data-count]', el).forEach(countUp);
        }, { threshold: 0.2 }) : function () {};
        return function () { if (ro) ro.disconnect(); mo.disconnect(); stopView(); cancelAnimationFrame(raf); hideTip(); };
      }
    });
  }
  Object.keys(T).forEach(define);

  /** Ranj.chart.bar(el, { labels: [...], series: [...] }) — sets data-* and (re)renders. */
  function api(type) {
    return function (el, o) {
      if (typeof el === 'string') el = R.$(el);
      if (!el) return null;
      el.classList.add(T[type].cls);
      o = o || {};
      for (var k in o) {
        var name = 'data-' + k.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); });
        var val = o[k];
        if (val === false) val = 'false';
        else if (Array.isArray(val) && typeof val[0] !== 'object') val = val.join(',');
        else if (typeof val === 'object') val = JSON.stringify(val);
        el.setAttribute(name, String(val));
      }
      R.init(el);
      return el;
    };
  }
  R.chart = { sparkline: api('sparkline'), bar: api('bar'), line: api('line'), donut: api('donut'), gauge: api('gauge'), heatmap: api('heatmap'), format: function (v, o) { return fmter(o || {})(v); } };
})(window.Ranj);
