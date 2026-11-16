/* OTP input — n slots, auto-advance, paste fills all, backspace goes back, masked, complete event */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('otp', {
    selector: '.otp',
    mount: function (el) {
      var o = R.opts(el, { length: 6, name: '', group: 0, type: 'numeric', masked: false, autofocus: false, label: 'Verification code' });
      var slots = R.$$('input.otp-slot', el);
      if (!slots.length) {
        var html = '';
        for (var i = 0; i < o.length; i++) {
          if (o.group && i && i % o.group === 0) html += '<span class="otp-sep" aria-hidden="true"></span>';
          html += '<input class="otp-slot">';
        }
        el.insertAdjacentHTML('beforeend', html);
        slots = R.$$('input.otp-slot', el);
      }
      var n = slots.length;
      var re = o.type === 'alphanumeric' ? /[a-z0-9]/i : o.type === 'alpha' ? /[a-z]/i : /\d/;
      if (!el.hasAttribute('role')) el.setAttribute('role', 'group');
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) el.setAttribute('aria-label', o.label);
      slots.forEach(function (s, i) {
        s.type = o.masked ? 'password' : 'text';
        s.setAttribute('inputmode', o.type === 'numeric' ? 'numeric' : 'text');
        s.setAttribute('autocomplete', i === 0 ? 'one-time-code' : 'off');
        s.setAttribute('aria-label', 'Character ' + (i + 1) + ' of ' + n);
        s.setAttribute('maxlength', i === 0 ? String(n) : '1');
        s.spellcheck = false;
        if (o.type !== 'numeric') s.setAttribute('autocapitalize', 'characters');
      });
      var hidden = F.hidden(el, o.name || null, '');

      function value() { return slots.map(function (s) { return s.value; }).join(''); }
      function sync(silent) {
        var v = value();
        if (hidden) hidden.value = v;
        slots.forEach(function (s) { s.toggleAttribute('data-filled', !!s.value); });
        el.toggleAttribute('data-complete', v.length === n);
        if (el.getAttribute('data-state') === 'error') el.removeAttribute('data-state');
        if (silent === true) return;
        R.emit(el, 'change', { value: v, complete: v.length === n });
        if (v.length === n && el.__last !== v) { R.emit(el, 'complete', { value: v }); }
        el.__last = v;
      }
      function clean(str) { return String(str).split('').filter(function (c) { return re.test(c); }).map(function (c) { return o.type === 'numeric' ? c : c.toUpperCase(); }); }
      function fill(start, chars) {
        var i = start;
        chars.forEach(function (c) { if (i < n) { slots[i].value = c; pop(slots[i]); i++; } });
        sync();
        focusAt(Math.min(i, n - 1));
      }
      function pop(s) { if (R.reducedMotion) return; s.classList.remove('otp-pop'); void s.offsetWidth; s.classList.add('otp-pop'); }
      function focusAt(i) { var s = slots[R.clamp(i, 0, n - 1)]; s.focus(); try { s.setSelectionRange(0, s.value.length); } catch (e) {} }
      function firstEmpty() { for (var i = 0; i < n; i++) if (!slots[i].value) return i; return n - 1; }

      var offs = [];
      slots.forEach(function (s, i) {
        offs.push(R.on(s, 'input', function () {
          var chars = clean(s.value);
          if (!chars.length) { s.value = ''; sync(); return; }
          if (chars.length > 1) { s.value = ''; fill(chars.length >= n ? 0 : i, chars); return; }
          s.value = chars[0]; pop(s); sync();
          if (i < n - 1) focusAt(i + 1);
        }));
        offs.push(R.on(s, 'keydown', function (e) {
          var k = e.key;
          if (k === 'Backspace') {
            e.preventDefault();
            if (s.value) { s.value = ''; sync(); }
            else if (i > 0) { slots[i - 1].value = ''; sync(); focusAt(i - 1); }
          } else if (k === 'Delete') { e.preventDefault(); s.value = ''; sync(); }
          else if (k === 'ArrowLeft') { e.preventDefault(); focusAt(i - 1); }
          else if (k === 'ArrowRight') { e.preventDefault(); focusAt(i + 1); }
          else if (k === 'Home') { e.preventDefault(); focusAt(0); }
          else if (k === 'End') { e.preventDefault(); focusAt(firstEmpty()); }
          else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            if (!re.test(k)) { e.preventDefault(); return; }
            if (s.value) { e.preventDefault(); s.value = o.type === 'numeric' ? k : k.toUpperCase(); pop(s); sync(); if (i < n - 1) focusAt(i + 1); }
          }
        }));
        offs.push(R.on(s, 'paste', function (e) {
          var t = (e.clipboardData || window.clipboardData).getData('text');
          var chars = clean(t);
          e.preventDefault();
          if (!chars.length) return;
          fill(chars.length >= n ? 0 : i, chars);
        }));
        offs.push(R.on(s, 'focus', function () {
          // Don't let people skip ahead past empty slots
          var fe = firstEmpty();
          if (!s.value && i > fe && !el.hasAttribute('data-free')) { focusAt(fe); return; }
          setTimeout(function () { try { s.setSelectionRange(0, s.value.length); } catch (e) {} }, 0);
        }));
      });
      if (o.autofocus) setTimeout(function () { focusAt(0); }, 50);
      sync(true);
      el.__last = value();
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); },
        get value() { return value(); },
        set value(v) { slots.forEach(function (s) { s.value = ''; }); fill(0, clean(v)); },
        clear: function () { slots.forEach(function (s) { s.value = ''; }); sync(); focusAt(0); },
        setState: function (st) {
          if (st) el.setAttribute('data-state', st); else el.removeAttribute('data-state');
          if (st === 'error') F.shake(el);
          slots.forEach(function (s) { if (st === 'error') s.setAttribute('aria-invalid', 'true'); else s.removeAttribute('aria-invalid'); });
        }
      };
    }
  });

  /** Ranj.otp(el) → instance { value, clear(), setState('error'|'success'|null) } */
  R.otp = function (el) { if (typeof el === 'string') el = document.querySelector(el); return R.instance(el, 'otp'); };
})(window.Ranj);
