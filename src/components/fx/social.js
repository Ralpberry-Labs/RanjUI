/* Ranj UI — Social micro-interactions: like, bookmark, reactions, notification bell */
(function (R) {
  'use strict';
  if (!R) return;
  var D = document;

  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.2-4.4-9.4-9C1.2 8.4 3 4.5 6.9 4.5c2.2 0 3.7 1.2 4.6 2.7.2.3.8.3 1 0 .9-1.5 2.4-2.7 4.6-2.7 3.9 0 5.7 3.9 4.3 7-2.2 4.6-9.4 9-9.4 9z"/></svg>';
  var MARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="bm-line" d="M6 3.5h12a1 1 0 0 1 1 1v16l-7-4.5-7 4.5v-16a1 1 0 0 1 1-1z"/><path class="bm-fill" d="M6 3.5h12a1 1 0 0 1 1 1v16l-7-4.5-7 4.5v-16a1 1 0 0 1 1-1z"/></svg>';

  function restart(el, attr, ms) {
    el.removeAttribute(attr); void el.offsetWidth; el.setAttribute(attr, '');
    clearTimeout(el['_t' + attr]); el['_t' + attr] = setTimeout(function () { el.removeAttribute(attr); }, ms || 700);
  }
  /** Roll a number/text inside .fx-roll: up when increasing */
  function roll(el, text, up) {
    if (!el.classList.contains('fx-roll')) { el.classList.add('fx-roll'); el.innerHTML = '<span>' + R.esc(el.textContent) + '</span>'; }
    if (R.reducedMotion) { el.innerHTML = '<span>' + R.esc(text) + '</span>'; return; }
    var old = el.lastElementChild, nu = D.createElement('span');
    nu.textContent = text; nu.className = up ? 'fx-roll-in-up' : 'fx-roll-in-down';
    el.appendChild(nu); void nu.offsetWidth;
    nu.className = '';
    if (old) { old.className = up ? 'fx-roll-out-up' : 'fx-roll-out-down'; setTimeout(function () { old.remove(); }, 380); }
  }
  R.fxRoll = roll;
  function fmt(n) { return n >= 10000 ? (n / 1000).toFixed(n >= 100000 ? 0 : 1).replace(/\.0$/, '') + 'k' : n.toLocaleString('en-US'); }
  /** Radial particle burst inside host */
  function burst(host, colors, n, dist) {
    if (R.reducedMotion) return;
    for (var i = 0; i < n; i++) {
      var p = D.createElement('i'), a = (i / n) * Math.PI * 2 + Math.random() * 0.4, d = dist * (0.7 + Math.random() * 0.5);
      p.className = 'fx-particle'; p.setAttribute('aria-hidden', 'true');
      p.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px');
      p.style.setProperty('--dy', (Math.sin(a) * d).toFixed(1) + 'px');
      p.style.setProperty('--s', (3 + Math.random() * 4).toFixed(1) + 'px');
      p.style.setProperty('--c', colors[i % colors.length]);
      host.appendChild(p);
      setTimeout(p.remove.bind(p), 800);
    }
  }
  R.fxBurst = burst;

  /** Toggle buttons with counts: .like-btn, .bookmark-btn */
  function pressable(kind, svg, colors) {
    return {
      selector: '.' + kind,
      mount: function (el) {
        var icon = el.querySelector('.' + kind + '-icon');
        if (!icon) { icon = D.createElement('span'); icon.className = kind + '-icon'; icon.innerHTML = svg; el.insertBefore(icon, el.firstChild); }
        else if (!icon.querySelector('svg')) icon.innerHTML = svg;
        if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
        if (!el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', 'false');
        var count = el.querySelector('[data-count], .' + kind + '-count');
        return R.on(el, 'click', function () {
          var on = el.getAttribute('aria-pressed') !== 'true';
          el.setAttribute('aria-pressed', String(on));
          if (count) {
            var n = parseInt(count.getAttribute('data-count') || count.textContent.replace(/[^\d]/g, ''), 10) || 0;
            n += on ? 1 : -1; count.setAttribute('data-count', n); roll(count, fmt(n), on);
          }
          if (on) { restart(el, 'data-burst', 700); burst(icon, colors(el), kind === 'like-btn' ? 10 : 6, kind === 'like-btn' ? 22 : 16); }
          R.emit(el, 'change', { pressed: on });
        });
      }
    };
  }
  R.define('like-btn', pressable('like-btn', HEART, function (el) { var c = getComputedStyle(el).getPropertyValue('--on').trim() || '#f43f5e'; return [c, '#fb923c', '#facc15', '#a78bfa', c]; }));
  R.define('bookmark-btn', pressable('bookmark-btn', MARK, function (el) { var c = getComputedStyle(el).getPropertyValue('--on').trim() || '#f59e0b'; return [c, '#fde68a']; }));

  /* ---------- Reactions ---------- */
  var DEFAULT_REACTIONS = [
    { e: '👍', l: 'Like', c: '#3b82f6' }, { e: '❤️', l: 'Love', c: '#f43f5e' }, { e: '😂', l: 'Haha', c: '#f59e0b' },
    { e: '😮', l: 'Wow', c: '#f59e0b' }, { e: '😢', l: 'Sad', c: '#f59e0b' }, { e: '🔥', l: 'Fire', c: '#f97316' }
  ];
  R.define('reaction', {
    selector: '.reaction',
    mount: function (el) {
      var trig = el.querySelector('.reaction-trigger'); if (!trig) return;
      var idle = trig.innerHTML, list = DEFAULT_REACTIONS;
      try { if (el.getAttribute('data-reactions')) list = JSON.parse(el.getAttribute('data-reactions')); } catch (e) {}
      var picker = null, hoverT = 0, leaveT = 0, longT = 0, pop = null, stopPos = null, offOut = null, current = null, offs = [];
      trig.setAttribute('aria-haspopup', 'menu'); trig.setAttribute('aria-expanded', 'false');
      if (trig.tagName === 'BUTTON' && !trig.hasAttribute('type')) trig.type = 'button';
      function open(focus) {
        if (picker) return;
        picker = D.createElement('div'); picker.className = 'reaction-picker'; picker.setAttribute('role', 'menu');
        picker.setAttribute('aria-label', 'Reactions');
        picker.innerHTML = list.map(function (r, i) { return '<button type="button" role="menuitem" class="reaction-option" style="--i:' + i + '" data-i="' + i + '" data-label="' + R.esc(r.l) + '" aria-label="' + R.esc(r.l) + '">' + r.e + '</button>'; }).join('');
        D.body.appendChild(picker);
        stopPos = R.autoPosition(picker, trig, { placement: 'top-start', offset: 8 });
        trig.setAttribute('aria-expanded', 'true');
        picker.addEventListener('click', function (e) { var b = e.target.closest('.reaction-option'); if (b) choose(+b.getAttribute('data-i')); });
        picker.addEventListener('pointerenter', function () { clearTimeout(leaveT); });
        picker.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') leaveT = setTimeout(close, 300); });
        R.roving(picker, '.reaction-option', { orientation: 'horizontal' });
        pop = R.pushLayer(function () { close(); trig.focus(); });
        offOut = R.onOutside([picker, trig], function () { close(); });
        if (focus) setTimeout(function () { var f = picker && picker.querySelector('.reaction-option'); if (f) f.focus(); }, 30);
      }
      function close() {
        if (!picker) return;
        var p = picker; picker = null;
        if (stopPos) stopPos(); if (pop) pop(); if (offOut) offOut();
        trig.setAttribute('aria-expanded', 'false');
        p.setAttribute('data-closing', ''); setTimeout(function () { p.remove(); }, 170);
      }
      function apply(r) {
        current = r;
        if (r) {
          el.setAttribute('data-reacted', ''); el.style.setProperty('--reaction-color', r.c || 'var(--primary)');
          trig.innerHTML = '<span class="reaction-emoji" aria-hidden="true">' + r.e + '</span><span>' + R.esc(r.l) + '</span>';
          trig.setAttribute('aria-pressed', 'true'); restart(trig, 'data-pop', 600);
          if (!R.reducedMotion) burst(trig.querySelector('.reaction-emoji'), [r.c || '#3b82f6', '#facc15', '#f472b6'], 8, 18);
        } else {
          el.removeAttribute('data-reacted'); trig.innerHTML = idle; trig.setAttribute('aria-pressed', 'false');
        }
        R.emit(el, 'change', { reaction: r ? r.l : null, emoji: r ? r.e : null });
      }
      function choose(i) { close(); apply(list[i]); trig.focus(); }
      offs.push(R.on(trig, 'click', function () {
        if (trig._long) { trig._long = false; return; }
        close(); apply(current ? null : list[0]);
      }));
      offs.push(R.on(trig, 'pointerenter', function (e) { if (e.pointerType !== 'mouse') return; clearTimeout(leaveT); hoverT = setTimeout(function () { open(false); }, 450); }));
      offs.push(R.on(trig, 'pointerleave', function (e) { clearTimeout(hoverT); if (e.pointerType === 'mouse') leaveT = setTimeout(close, 350); }));
      offs.push(R.on(trig, 'pointerdown', function (e) { if (e.pointerType === 'mouse') return; longT = setTimeout(function () { trig._long = true; open(false); }, 420); }));
      offs.push(R.on(trig, 'pointerup', function () { clearTimeout(longT); }));
      offs.push(R.on(trig, 'contextmenu', function (e) { if (picker) e.preventDefault(); }));
      offs.push(R.on(trig, 'keydown', function (e) { if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); open(true); } }));
      return function () { offs.forEach(function (f) { f(); }); clearTimeout(hoverT); clearTimeout(leaveT); close(); };
    }
  });

  /* ---------- Notification bell ---------- */
  var BELL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="bell-body" d="M6 9a6 6 0 0 1 12 0c0 6.5 2.5 8.5 2.5 8.5h-17S6 15.5 6 9z"/><path class="bell-clapper" d="M10 20.5a2.2 2.2 0 0 0 4 0"/></svg>';
  function setBell(el, n, ring) {
    var b = el.querySelector('.bell-badge');
    if (!b) { b = D.createElement('span'); b.className = 'bell-badge'; b.setAttribute('aria-hidden', 'true'); el.appendChild(b); }
    var prev = parseInt(el.getAttribute('data-count') || '0', 10);
    n = Math.max(0, n | 0);
    if (n > 0) { el.setAttribute('data-count', n); b.textContent = n > 99 ? '99+' : n; } else el.removeAttribute('data-count');
    var base = el.getAttribute('data-label') || 'Notifications';
    el.setAttribute('aria-label', n ? base + ', ' + n + ' unread' : base);
    if (ring !== false && n > prev) { restart(el, 'data-ring', 1000); restart(el, 'data-bump', 900); }
  }
  R.define('bell', {
    selector: '.bell',
    mount: function (el) {
      if (!el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', BELL);
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      if (!el.getAttribute('data-label')) el.setAttribute('data-label', el.getAttribute('aria-label') || 'Notifications');
      setBell(el, R.attr(el, 'data-count', 0), false);
      return R.on(el, 'pointerenter', function () { if (!el.hasAttribute('data-ring') && !R.reducedMotion) restart(el, 'data-ring', 1000); });
    }
  });
  /** Ranj.bell(el, count) — set the unread count; rings + bumps when it goes up. */
  R.bell = function (el, n) { if (typeof el === 'string') el = D.querySelector(el); if (el) setBell(el, n); };
})(window.Ranj);
