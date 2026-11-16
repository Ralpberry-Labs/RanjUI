/* Number input — − / + steppers with hold-to-repeat, min/max/step, keyboard, optional wheel, Intl formatting */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('number-input', {
    selector: '.number-input',
    mount: function (el) {
      var inp = el.querySelector('input'); if (!inp) return;
      var o = R.opts(el, { format: '', prefix: '', suffix: '', decimals: -1, wheel: false, locale: '' });
      var min = inp.min !== '' ? parseFloat(inp.min) : -Infinity, max = inp.max !== '' ? parseFloat(inp.max) : Infinity;
      var step = parseFloat(inp.step) || 1;
      var dec = o.decimals > -1 ? o.decimals : (String(step).split('.')[1] || '').length;
      var name = inp.name;
      // Use a text field so we can format; the real value lives in a hidden input
      inp.type = 'text';
      inp.setAttribute('inputmode', dec ? 'decimal' : 'numeric');
      inp.setAttribute('role', 'spinbutton');
      inp.setAttribute('autocomplete', 'off');
      if (name) { inp.removeAttribute('name'); }
      var hidden = F.hidden(el, name || null);
      var nf;
      var loc = o.locale || undefined;
      try {
        var p = o.format.split(':');
        if (p[0] === 'currency') nf = new Intl.NumberFormat(loc, { style: 'currency', currency: p[1] || 'USD', minimumFractionDigits: dec, maximumFractionDigits: dec });
        else if (p[0] === 'percent') nf = { format: function (v) { return v.toFixed(dec) + '%'; } };
        else nf = new Intl.NumberFormat(loc, { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: o.format !== 'plain' });
      } catch (e) { nf = { format: function (v) { return v.toFixed(dec); } }; }
      function fmt(v) { return v == null || isNaN(v) ? '' : o.prefix + nf.format(v) + o.suffix; }
      function parse(s) {
        s = String(s).replace(/[^\d.,\-]/g, '');
        if (!s) return null;
        // accept both 1,234.5 and 1.234,5
        var lc = s.lastIndexOf(','), ld = s.lastIndexOf('.');
        if (lc > ld && s.length - lc - 1 !== 3) s = s.replace(/\./g, '').replace(',', '.');
        else s = s.replace(/,/g, '');
        var v = parseFloat(s); return isNaN(v) ? null : v;
      }
      var val = parse(inp.value);
      if (inp.hasAttribute('value') && inp.getAttribute('value') !== '') val = parseFloat(inp.getAttribute('value'));

      // Build steppers if missing
      var dn = el.querySelector('[data-step-down]'), up = el.querySelector('[data-step-up]');
      if (!dn) { dn = document.createElement('button'); dn.setAttribute('data-step-down', ''); dn.innerHTML = F.icons.minus; el.insertBefore(dn, inp); }
      if (!up) { up = document.createElement('button'); up.setAttribute('data-step-up', ''); up.innerHTML = F.icons.plus; inp.insertAdjacentElement('afterend', up); }
      [dn, up].forEach(function (b, i) { b.type = 'button'; b.classList.add('number-input-btn'); b.tabIndex = -1; b.setAttribute('aria-label', (i ? 'Increase' : 'Decrease') + (inp.getAttribute('aria-label') ? ' ' + inp.getAttribute('aria-label').toLowerCase() : '')); });
      if (el.classList.contains('number-input-stacked')) {
        var stack = document.createElement('div'); stack.className = 'number-input-stack';
        up.innerHTML = F.icons.chevronDown; dn.innerHTML = F.icons.chevronDown;
        stack.appendChild(up); stack.appendChild(dn); el.appendChild(stack);
      }

      function render(focused) {
        inp.value = val == null ? '' : focused ? String(+val.toFixed(dec)) : fmt(val);
        if (hidden) hidden.value = val == null ? '' : String(+val.toFixed(dec));
        if (val != null) { inp.setAttribute('aria-valuenow', val); inp.setAttribute('aria-valuetext', fmt(val)); } else { inp.removeAttribute('aria-valuenow'); inp.removeAttribute('aria-valuetext'); }
        if (isFinite(min)) inp.setAttribute('aria-valuemin', min);
        if (isFinite(max)) inp.setAttribute('aria-valuemax', max);
        dn.disabled = inp.disabled || (val != null && val <= min);
        up.disabled = inp.disabled || (val != null && val >= max);
        el.toggleAttribute('data-at-min', val != null && val <= min);
        el.toggleAttribute('data-at-max', val != null && val >= max);
      }
      function set(v, dir) {
        if (v != null) v = R.clamp(+(+v).toFixed(dec), min, max);
        var changed = v !== val;
        val = v;
        render(document.activeElement === inp);
        if (changed) {
          if (dir && !R.reducedMotion) { inp.classList.remove('num-up', 'num-down'); void inp.offsetWidth; inp.classList.add(dir > 0 ? 'num-up' : 'num-down'); }
          if (hidden) try { hidden.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
          R.emit(el, 'change', { value: val });
        } else if (dir) F.shake(el);
        return changed;
      }
      function stepBy(n) {
        if (val == null) return set(isFinite(min) ? min : isFinite(max) ? Math.min(0, max) : 0, n);
        var base = val;
        // snap to step grid
        var origin = isFinite(min) ? min : 0;
        var next = Math.round((base + n * step - origin) / step) * step + origin;
        return set(next, n);
      }

      var hold = 0, rep = 0;
      function stopHold() { clearTimeout(hold); clearInterval(rep); hold = rep = 0; }
      function startHold(n) {
        stopHold();
        if (!stepBy(n)) return;
        var speed = 120;
        hold = setTimeout(function tick() {
          if (!stepBy(n)) { stopHold(); return; }
          speed = Math.max(30, speed * 0.88);
          hold = setTimeout(tick, speed);
        }, 420);
      }
      var offs = [
        R.on(dn, 'pointerdown', function (e) { if (e.button) return; e.preventDefault(); inp.focus({ preventScroll: true }); startHold(-1); }),
        R.on(up, 'pointerdown', function (e) { if (e.button) return; e.preventDefault(); inp.focus({ preventScroll: true }); startHold(1); }),
        R.on(window, 'pointerup', stopHold), R.on(window, 'pointercancel', stopHold), R.on(window, 'blur', stopHold),
        R.on(dn, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stepBy(-1); } }),
        R.on(up, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stepBy(1); } }),
        R.on(inp, 'focus', function () { render(true); setTimeout(function () { try { inp.select(); } catch (e) {} }, 0); }),
        R.on(inp, 'blur', function () { var v = parse(inp.value); set(v); render(false); }),
        R.on(inp, 'keydown', function (e) {
          var k = e.key, mult = e.shiftKey ? 10 : 1;
          if (k === 'ArrowUp') { e.preventDefault(); stepBy(mult); }
          else if (k === 'ArrowDown') { e.preventDefault(); stepBy(-mult); }
          else if (k === 'PageUp') { e.preventDefault(); stepBy(10); }
          else if (k === 'PageDown') { e.preventDefault(); stepBy(-10); }
          else if (k === 'Home' && isFinite(min)) { e.preventDefault(); set(min, -1); }
          else if (k === 'End' && isFinite(max)) { e.preventDefault(); set(max, 1); }
          else if (k === 'Enter') { set(parse(inp.value)); render(true); }
        }),
        R.on(inp, 'input', function () { inp.value = inp.value.replace(/[^\d.,\-]/g, ''); })
      ];
      if (o.wheel) offs.push(R.on(inp, 'wheel', function (e) { if (document.activeElement !== inp) return; e.preventDefault(); stepBy(e.deltaY < 0 ? 1 : -1); }, { passive: false }));
      if (inp.form) offs.push(R.on(inp.form, 'reset', function () { setTimeout(function () { val = parse(inp.getAttribute('value')); render(false); }, 0); }));
      render(false);
      return {
        destroy: function () { stopHold(); offs.forEach(function (f) { f(); }); },
        get value() { return val; }, set value(v) { set(v); },
        stepUp: function () { stepBy(1); }, stepDown: function () { stepBy(-1); }
      };
    }
  });
})(window.Ranj);
