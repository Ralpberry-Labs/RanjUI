/* Ranj UI — Countdown to data-to (ISO date). Styles: default, .countdown-boxed, .countdown-inline, .countdown-flip. */
(function (R) {
  'use strict';
  var NAMES = { d: ['Days', 'd'], h: ['Hours', 'h'], m: ['Minutes', 'm'], s: ['Seconds', 's'] };
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function parts(ms) {
    var t = Math.max(0, Math.floor(ms / 1000));
    return { d: Math.floor(t / 86400), h: Math.floor(t % 86400 / 3600), m: Math.floor(t % 3600 / 60), s: t % 60 };
  }
  R.define('countdown', {
    selector: '.countdown[data-to], .countdown[data-seconds]',
    mount: function (el) {
      var o = R.opts(el, { to: '', seconds: 0, units: 'dhms', labels: true, separator: '', urgent: 0, hideZeroDays: false });
      var inline = el.classList.contains('countdown-inline'), flip = el.classList.contains('countdown-flip');
      var target = o.to ? new Date(o.to).getTime() : Date.now() + o.seconds * 1000;
      if (isNaN(target)) { console.warn('[Ranj] countdown: invalid data-to', o.to); return; }
      var units = o.units.split('').filter(function (u) { return NAMES[u]; });
      if (o.hideZeroDays && parts(target - Date.now()).d === 0) units = units.filter(function (u) { return u !== 'd'; });
      el.setAttribute('role', 'timer');
      el.setAttribute('aria-live', 'off');
      var sep = o.separator || (el.classList.contains('countdown-boxed') || flip ? ':' : '');
      el.innerHTML = units.map(function (u, i) {
        return (i && sep && !inline ? '<span class="countdown-sep" aria-hidden="true">' + R.esc(sep) + '</span>' : '') +
          '<span class="countdown-unit" data-unit="' + u + '"><span class="countdown-num"></span>' +
          (o.labels ? '<span class="countdown-label">' + (inline ? NAMES[u][1] : NAMES[u][0]) + '</span>' : '') + '</span>';
      }).join('');
      var nums = {}; units.forEach(function (u) { nums[u] = el.querySelector('[data-unit="' + u + '"] .countdown-num'); });
      var last = {}, timer = 0, done = false;
      function fmt(u, v) { return u === 'd' && v > 99 ? '' + v : pad(v); }
      function flipSet(box, str) {
        var cards = box.children;
        if (cards.length !== str.length) {
          box.innerHTML = str.split('').map(function (c) { return card(c); }).join('');
          return;
        }
        str.split('').forEach(function (c, i) {
          var cd = cards[i], cur = cd.getAttribute('data-v');
          if (cur === c) return;
          cd.setAttribute('data-v', c);
          cd.querySelector('.cd-top > span').textContent = c;
          cd.querySelector('.cd-flap-top > span').textContent = cur;
          cd.querySelector('.cd-flap-bottom > span').textContent = c;
          cd.querySelector('.cd-bottom > span').textContent = cur;
          if (R.reducedMotion) { cd.querySelector('.cd-bottom > span').textContent = c; cd.querySelector('.cd-flap-top > span').textContent = c; return; }
          cd.classList.remove('is-flipping'); void cd.offsetWidth; cd.classList.add('is-flipping');
          clearTimeout(cd.__t);
          cd.__t = setTimeout(function () { cd.querySelector('.cd-bottom > span').textContent = c; cd.querySelector('.cd-flap-top > span').textContent = c; cd.classList.remove('is-flipping'); }, 620);
        });
      }
      function card(c) {
        return '<span class="cd-card" data-v="' + c + '" aria-hidden="true"><span class="cd-half cd-top"><span>' + c + '</span></span><span class="cd-half cd-bottom"><span>' + c + '</span></span>' +
          '<span class="cd-half cd-flap-top"><span>' + c + '</span></span><span class="cd-half cd-flap-bottom"><span>' + c + '</span></span></span>';
      }
      function tick() {
        var left = target - Date.now(), p = parts(left);
        if (units.indexOf('d') < 0) p.h += p.d * 24;
        units.forEach(function (u) {
          var v = fmt(u, p[u]);
          if (last[u] === v) return;
          if (flip) flipSet(nums[u], v);
          else {
            nums[u].textContent = v;
            if (last[u] != null && !R.reducedMotion) { nums[u].classList.remove('is-tick'); void nums[u].offsetWidth; nums[u].classList.add('is-tick'); }
          }
          last[u] = v;
        });
        el.setAttribute('aria-label', units.map(function (u) { return p[u] + ' ' + NAMES[u][0].toLowerCase(); }).join(', ') + ' remaining');
        el.classList.toggle('is-urgent', o.urgent > 0 && left > 0 && left <= o.urgent * 1000);
        R.emit(el, 'tick', { remaining: Math.max(0, left), days: p.d, hours: p.h, minutes: p.m, seconds: p.s });
        if (left <= 0) {
          if (!done) { done = true; el.classList.add('is-done'); R.emit(el, 'done', {}); }
          return;
        }
        timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
      }
      tick();
      el.ranjCountdown = { set: function (d) { target = new Date(d).getTime(); done = false; el.classList.remove('is-done'); clearTimeout(timer); tick(); } };
      return function () { clearTimeout(timer); delete el.ranjCountdown; };
    }
  });
})(window.Ranj);
