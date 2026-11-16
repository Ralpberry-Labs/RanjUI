/* Password — reveal toggle, caps-lock hint, strength meter with rules checklist */
(function (R) {
  'use strict';
  var F = R._forms;
  var RULES = {
    length: function (n) { return { label: 'At least ' + n + ' characters', test: function (v) { return v.length >= n; } }; },
    lower: function () { return { label: 'A lowercase letter', test: function (v) { return /[a-z]/.test(v); } }; },
    upper: function () { return { label: 'An uppercase letter', test: function (v) { return /[A-Z]/.test(v); } }; },
    number: function () { return { label: 'A number', test: function (v) { return /\d/.test(v); } }; },
    symbol: function () { return { label: 'A symbol (!@#$…)', test: function (v) { return /[^A-Za-z0-9\s]/.test(v); } }; }
  };
  var LEVELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  var COMMON = /^(password|123456|qwerty|letmein|welcome|admin|iloveyou|abc123|111111|monkey)/i;

  function score(v, rules) {
    if (!v) return 0;
    var passed = rules.filter(function (r) { return r.test(v); }).length;
    var s = Math.round(passed / rules.length * 3);
    if (v.length >= 12) s++;
    if (v.length >= 16 && passed >= rules.length - 1) s++;
    if (COMMON.test(v) || /^(.)\1+$/.test(v)) s = Math.min(s, 1);
    if (v.length < 6) s = Math.min(s, 1);
    return R.clamp(s, v ? 1 : 0, 4);
  }

  R.define('password', {
    selector: '.password',
    mount: function (el) {
      var inp = el.querySelector('input'); if (!inp) return;
      var o = R.opts(el, { strength: false, rules: 'length:8,lower,upper,number,symbol', toggle: true, capslock: true });
      var wrap = el.classList.contains('input-wrap') ? el : inp.closest('.input-wrap');
      if (!wrap || !el.contains(wrap) && wrap !== el) {
        wrap = document.createElement('div'); wrap.className = 'input-wrap';
        inp.classList.remove('input');
        inp.parentNode.insertBefore(wrap, inp); wrap.appendChild(inp);
      }
      var offs = [], btn = null;
      if (o.toggle) {
        btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'input-btn password-toggle';
        btn.setAttribute('aria-label', 'Show password'); btn.setAttribute('aria-pressed', 'false');
        if (inp.id) btn.setAttribute('aria-controls', inp.id);
        btn.innerHTML = '<span class="password-eye">' + F.icons.eye + '</span><span class="password-eye-off">' + F.icons.eyeOff + '</span>';
        wrap.appendChild(btn);
        offs.push(R.on(btn, 'mousedown', function (e) { e.preventDefault(); }));
        offs.push(R.on(btn, 'click', function () {
          var show = inp.type === 'password';
          var a = inp.selectionStart, b = inp.selectionEnd;
          inp.type = show ? 'text' : 'password';
          btn.setAttribute('aria-pressed', String(show));
          btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
          el.toggleAttribute('data-revealed', show);
          if (document.activeElement === inp) try { inp.setSelectionRange(a, b); } catch (e) {}
          R.emit(el, 'reveal', { visible: show });
        }));
      }
      var caps = null;
      if (o.capslock) {
        caps = document.createElement('p'); caps.className = 'field-hint password-caps'; caps.hidden = true;
        caps.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 4 8 8h-4v4H8v-4H4z"/><path d="M8 20h8"/></svg>Caps Lock is on';
        caps.setAttribute('aria-live', 'polite');
        wrap.insertAdjacentElement('afterend', caps);
        var ck = function (e) { if (e.getModifierState) caps.hidden = !e.getModifierState('CapsLock'); };
        offs.push(R.on(inp, 'keydown', ck), R.on(inp, 'keyup', ck), R.on(inp, 'blur', function () { caps.hidden = true; }));
      }
      if (o.strength) {
        var rules = o.rules.split(',').map(function (r) { var p = r.trim().split(':'); return RULES[p[0]] ? RULES[p[0]](parseInt(p[1], 10) || 8) : null; }).filter(Boolean);
        var meter = document.createElement('div'); meter.className = 'password-meter'; meter.setAttribute('data-score', '0');
        meter.innerHTML = '<div class="password-bars" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
          '<div class="password-meter-text"><span class="password-level">Enter a password</span></div>';
        var listEl = null;
        if (!el.hasAttribute('data-no-rules')) {
          listEl = document.createElement('ul'); listEl.className = 'password-rules';
          listEl.innerHTML = rules.map(function (r) { return '<li><span class="password-rule-icon" aria-hidden="true">' + F.icons.check + '</span><span>' + R.esc(r.label) + '</span><span class="f-sr"> — not met</span></li>'; }).join('');
        }
        var after = caps || wrap;
        after.insertAdjacentElement('afterend', meter);
        if (listEl) meter.insertAdjacentElement('afterend', listEl);
        var level = meter.querySelector('.password-level');
        level.setAttribute('aria-live', 'polite');
        R.ensureId(meter, 'pwm');
        inp.setAttribute('aria-describedby', ((inp.getAttribute('aria-describedby') || '') + ' ' + meter.id).trim());
        var upd = function () {
          var v = inp.value, s = score(v, rules);
          meter.setAttribute('data-score', String(s));
          level.textContent = v ? LEVELS[s] : 'Enter a password';
          if (listEl) R.$$('li', listEl).forEach(function (li, i) { var ok = rules[i].test(v); li.toggleAttribute('data-met', ok); li.lastChild.textContent = ok ? ' — met' : ' — not met'; });
          R.emit(el, 'strength', { score: s, label: LEVELS[s] });
        };
        offs.push(R.on(inp, 'input', upd));
        upd();
      }
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });
  R.passwordScore = function (v, rules) {
    rules = (rules || 'length:8,lower,upper,number,symbol').split(',').map(function (r) { var p = r.split(':'); return RULES[p[0]](parseInt(p[1], 10) || 8); });
    return score(v, rules);
  };
})(window.Ranj);
