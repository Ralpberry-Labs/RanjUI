/* Ranj UI — Animated icons: hamburger, morph icons, status icons */
(function (R) {
  'use strict';
  if (!R) return;
  var D = document;

  /* Hamburger: toggles aria-expanded (and the element in aria-controls gets data-state) */
  R.define('hamburger', {
    selector: '.hamburger',
    mount: function (el) {
      if (!el.children.length) el.innerHTML = '<span></span><span></span><span></span>';
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      if (!el.hasAttribute('aria-expanded')) el.setAttribute('aria-expanded', 'false');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Menu');
      return R.on(el, 'click', function () {
        if (el.hasAttribute('data-manual')) return;
        var open = el.getAttribute('aria-expanded') !== 'true';
        el.setAttribute('aria-expanded', String(open));
        var t = el.getAttribute('aria-controls') && D.getElementById(el.getAttribute('aria-controls'));
        if (t) t.setAttribute('data-state', open ? 'open' : 'closed');
        R.emit(el, 'change', { open: open });
      });
    }
  });

  var MORPH = {
    'play-pause': '<span class="morph-box" aria-hidden="true"><i></i><i></i></span>',
    'plus-close': '<span class="morph-box" aria-hidden="true"><i class="mb"></i><i class="mb"></i></span>',
    chevron: '<span class="morph-box" aria-hidden="true"><i class="mb"></i><i class="mb"></i></span>',
    'search-close': '<span class="morph-box" aria-hidden="true"><i class="morph-ring"></i><i class="mb"></i><i class="mb"></i></span>',
    volume: '<span class="morph-box" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path class="mv-wave" d="M15.5 9.5a4 4 0 0 1 0 5"/><path class="mv-wave" d="M18.5 6.5a8 8 0 0 1 0 11"/><path class="mv-x" pathLength="1" d="M16 9.5l5 5"/><path class="mv-x" pathLength="1" d="M21 9.5l-5 5"/></svg></span>',
    weather: '<span class="morph-box" aria-hidden="true"><svg viewBox="0 0 32 32"><g class="mw-sun"><g class="mw-rays"><path d="M16 3v2.5M16 22.5V25M5 14h2.5M24.5 14H27M8.2 6.2l1.8 1.8M22 20l1.8 1.8M8.2 21.8 10 20M22 8l1.8-1.8"/></g><circle cx="16" cy="14" r="5.5"/></g>' +
      '<path class="mw-cloud" d="M10.5 26h12.2a5.3 5.3 0 0 0 .6-10.6 7.2 7.2 0 0 0-13.6 2.3A4.2 4.2 0 0 0 10.5 26z"/><g class="mw-drops"><line x1="12" y1="28" x2="11" y2="30.5"/><line x1="17" y1="28" x2="16" y2="30.5"/><line x1="22" y1="28" x2="21" y2="30.5"/></g></svg></span>'
  };
  var LABELS = { 'play-pause': ['Play', 'Pause'], 'plus-close': ['Open', 'Close'], chevron: ['Expand', 'Collapse'], 'search-close': ['Search', 'Close search'], volume: ['Mute', 'Unmute'] };
  var WEATHER = ['sun', 'cloud', 'rain'];

  R.define('morph-icon', {
    selector: '.morph-icon',
    mount: function (el) {
      var kind = el.getAttribute('data-morph') || 'play-pause';
      if (!el.querySelector('.morph-box') && MORPH[kind]) el.insertAdjacentHTML('afterbegin', MORPH[kind]);
      if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.type = 'button';
      var weather = kind === 'weather';
      if (weather) { if (!el.getAttribute('data-state')) el.setAttribute('data-state', 'sun'); }
      else if (!el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', 'false');
      function label() {
        if (el.hasAttribute('data-keep-label')) return;
        if (weather) el.setAttribute('aria-label', 'Weather: ' + el.getAttribute('data-state'));
        else if (LABELS[kind]) el.setAttribute('aria-label', LABELS[kind][el.getAttribute('aria-pressed') === 'true' ? 1 : 0]);
      }
      label();
      return R.on(el, 'click', function () {
        if (weather) {
          var i = (WEATHER.indexOf(el.getAttribute('data-state')) + 1) % 3;
          el.setAttribute('data-state', WEATHER[i]); label();
          R.emit(el, 'change', { state: WEATHER[i] });
        } else {
          var on = el.getAttribute('aria-pressed') !== 'true';
          el.setAttribute('aria-pressed', String(on)); label();
          R.emit(el, 'change', { pressed: on });
        }
      });
    }
  });

  /* Status icons: drawn SVG that plays when it scrolls into view */
  var SI = {
    success: '<circle class="si-bg" cx="24" cy="24" r="22"/><circle class="si-ring" pathLength="1" cx="24" cy="24" r="21" transform="rotate(-90 24 24)"/><path class="si-mark" pathLength="1" d="M15 24.5l6 6L33.5 18"/>',
    error: '<circle class="si-bg" cx="24" cy="24" r="22"/><circle class="si-ring" pathLength="1" cx="24" cy="24" r="21" transform="rotate(-90 24 24)"/><path class="si-mark" pathLength="1" d="M17 17l14 14"/><path class="si-mark" pathLength="1" d="M31 17 17 31"/>',
    warning: '<path class="si-bg" d="M24 4 45 41H3z"/><path class="si-ring" pathLength="1" d="M24 5.5 2.8 42h42.4z" stroke-linejoin="round"/><path class="si-mark" pathLength="1" d="M24 18v11"/><circle class="si-dot" cx="24" cy="35" r="2"/>',
    info: '<circle class="si-bg" cx="24" cy="24" r="22"/><circle class="si-ring" pathLength="1" cx="24" cy="24" r="21" transform="rotate(-90 24 24)"/><circle class="si-dot" cx="24" cy="15.5" r="2.2"/><path class="si-mark" pathLength="1" d="M24 21.5v12"/>'
  };
  function play(el) {
    var t = el.getAttribute('data-type') || 'success';
    el.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true">' + (SI[t] || SI.success) + '</svg>';
    if (R.reducedMotion) { R.$$('.si-ring, .si-mark', el).forEach(function (p) { p.style.strokeDashoffset = '0'; }); R.$$('.si-dot', el).forEach(function (p) { p.style.opacity = 1; }); R.$$('.si-bg', el).forEach(function (p) { p.style.opacity = .14; }); return; }
    el.removeAttribute('data-play'); void el.offsetWidth; el.setAttribute('data-play', '');
  }
  R.define('status-icon', {
    selector: '.status-icon',
    mount: function (el) {
      if (!el.hasAttribute('role')) el.setAttribute('role', 'img');
      if (!el.hasAttribute('aria-label')) { var t = el.getAttribute('data-type') || 'success'; el.setAttribute('aria-label', t.charAt(0).toUpperCase() + t.slice(1)); }
      el.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"></svg>';
      return R.inView(el, function () { play(el); }, { threshold: 0.4 });
    }
  });
  /** Ranj.statusIcon(el, [type]) — (re)play the draw animation, optionally switching type. */
  R.statusIcon = function (el, type) { if (typeof el === 'string') el = D.querySelector(el); if (!el) return; if (type) { el.setAttribute('data-type', type); el.setAttribute('aria-label', type.charAt(0).toUpperCase() + type.slice(1)); } play(el); };
})(window.Ranj);
