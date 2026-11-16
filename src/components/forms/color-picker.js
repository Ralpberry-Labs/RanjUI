/* Color picker — saturation/value area, hue slider, hex input, swatches, eyedropper; popover or inline */
(function (R) {
  'use strict';
  var F = R._forms;
  var DEFAULT_SWATCHES = '#0f172a,#ef4444,#f97316,#f59e0b,#84cc16,#10b981,#06b6d4,#3b82f6,#6366f1,#8b5cf6,#d946ef,#ec4899';

  function hexToRgb(h) {
    h = String(h || '').trim().replace(/^#/, '');
    if (h.length === 3 || h.length === 4) h = h.split('').map(function (c) { return c + c; }).join('');
    if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  function rgbToHex(c) { return '#' + [c.r, c.g, c.b].map(function (v) { v = Math.round(v).toString(16); return v.length < 2 ? '0' + v : v; }).join(''); }
  function rgbToHsv(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return { h: h, s: mx ? d / mx : 0, v: mx };
  }
  function hsvToRgb(h, s, v) {
    var c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c, r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
  }
  function readable(c) { return (c.r * 299 + c.g * 587 + c.b * 114) / 1000 > 150 ? '#09090b' : '#ffffff'; }

  R.define('color-picker', {
    selector: '.color-picker',
    mount: function (el) {
      var o = R.opts(el, { value: '#6366f1', name: '', swatches: DEFAULT_SWATCHES, inline: false, placement: 'bottom-start', label: 'Color' });
      var rgb = hexToRgb(o.value) || { r: 99, g: 102, b: 241 }, hsv = rgbToHsv(rgb);
      var hidden = F.hidden(el, o.name || null, rgbToHex(rgb));
      var trigger = null;
      if (!o.inline) {
        trigger = el.querySelector('.color-picker-trigger');
        if (!trigger) {
          trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'color-picker-trigger';
          trigger.innerHTML = '<span class="color-swatch" aria-hidden="true"></span><span class="color-picker-hex"></span><span class="color-picker-caret">' + F.icons.chevronDown + '</span>';
          el.insertBefore(trigger, el.firstChild);
        }
        trigger.setAttribute('aria-haspopup', 'dialog'); trigger.setAttribute('aria-expanded', 'false');
      }
      var panel = document.createElement('div');
      panel.className = 'color-panel' + (o.inline ? '' : ' picker-popover');
      panel.setAttribute('role', o.inline ? 'group' : 'dialog');
      panel.setAttribute('aria-label', o.label + ' picker');
      var sw = o.swatches ? o.swatches.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];
      panel.innerHTML =
        '<div class="color-area" role="slider" tabindex="0" aria-label="Saturation and brightness" aria-valuemin="0" aria-valuemax="100"><div class="color-area-thumb"></div></div>' +
        '<div class="color-row">' +
          ('EyeDropper' in window ? '<button type="button" class="color-eyedropper" aria-label="Pick a color from the screen"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/></svg></button>' : '') +
          '<div class="color-hue" role="slider" tabindex="0" aria-label="Hue" aria-valuemin="0" aria-valuemax="360"><div class="color-hue-thumb"></div></div>' +
        '</div>' +
        '<div class="color-fields"><span class="color-swatch color-preview" aria-hidden="true"></span><label class="color-hex-field"><span>HEX</span><input type="text" class="color-hex-input" spellcheck="false" maxlength="7" aria-label="Hex color"></label></div>' +
        (sw.length ? '<div class="color-swatches" role="group" aria-label="Swatches">' + sw.map(function (c) { return '<button type="button" class="color-swatch-btn" data-color="' + R.esc(c) + '" style="--c:' + R.esc(c) + '" aria-label="' + R.esc(c) + '"></button>'; }).join('') + '</div>' : '');
      if (o.inline) el.appendChild(panel); else panel.hidden = true;
      var area = panel.querySelector('.color-area'), aThumb = panel.querySelector('.color-area-thumb');
      var hue = panel.querySelector('.color-hue'), hThumb = panel.querySelector('.color-hue-thumb');
      var hexIn = panel.querySelector('.color-hex-input');

      function paint(skipHex) {
        rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
        var hex = rgbToHex(rgb);
        el.style.setProperty('--color', hex);
        panel.style.setProperty('--color', hex);
        panel.style.setProperty('--hue-color', rgbToHex(hsvToRgb(hsv.h, 1, 1)));
        aThumb.style.left = (hsv.s * 100) + '%'; aThumb.style.top = ((1 - hsv.v) * 100) + '%';
        hThumb.style.left = (hsv.h / 360 * 100) + '%';
        area.setAttribute('aria-valuenow', Math.round(hsv.s * 100));
        area.setAttribute('aria-valuetext', 'Saturation ' + Math.round(hsv.s * 100) + '%, brightness ' + Math.round(hsv.v * 100) + '%');
        hue.setAttribute('aria-valuenow', Math.round(hsv.h)); hue.setAttribute('aria-valuetext', Math.round(hsv.h) + ' degrees');
        if (!skipHex) hexIn.value = hex.toUpperCase();
        if (trigger) { trigger.querySelector('.color-picker-hex').textContent = hex.toUpperCase(); trigger.setAttribute('aria-label', o.label + ': ' + hex.toUpperCase() + '. Change color'); }
        R.$$('.color-swatch-btn', panel).forEach(function (b) { var on = (hexToRgb(b.getAttribute('data-color')) && rgbToHex(hexToRgb(b.getAttribute('data-color')))) === hex; b.toggleAttribute('data-active', on); b.setAttribute('aria-pressed', String(on)); b.style.setProperty('--ck', readable(hexToRgb(b.getAttribute('data-color')) || rgb)); });
        if (hidden) hidden.value = hex;
        return hex;
      }
      var emitT = 0;
      function changed(final) {
        var hex = paint(document.activeElement === hexIn);
        R.emit(el, 'input', { value: hex, rgb: { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) }, hsv: hsv });
        clearTimeout(emitT);
        var fire = function () { if (hidden) try { hidden.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {} R.emit(el, 'change', { value: hex, rgb: { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) }, hsv: hsv }); };
        if (final) fire(); else emitT = setTimeout(fire, 120);
      }
      function setHex(h, final) { var c = hexToRgb(h); if (!c) return false; var nh = rgbToHsv(c); if (nh.s === 0 || nh.v === 0) nh.h = hsv.h; hsv = nh; changed(final); return true; }

      function drag(target, onMove) {
        return R.on(target, 'pointerdown', function (e) {
          if (e.button) return;
          e.preventDefault(); target.focus({ preventScroll: true });
          target.setAttribute('data-dragging', '');
          try { target.setPointerCapture(e.pointerId); } catch (err) {}
          var r = target.getBoundingClientRect();
          var mv = function (ev) { onMove(R.clamp((ev.clientX - r.left) / r.width, 0, 1), R.clamp((ev.clientY - r.top) / r.height, 0, 1)); };
          var up = function () { target.removeAttribute('data-dragging'); target.removeEventListener('pointermove', mv); target.removeEventListener('pointerup', up); target.removeEventListener('pointercancel', up); changed(true); };
          target.addEventListener('pointermove', mv); target.addEventListener('pointerup', up); target.addEventListener('pointercancel', up);
          mv(e);
        });
      }
      var offs = [
        drag(area, function (x, y) { hsv.s = x; hsv.v = 1 - y; changed(); }),
        drag(hue, function (x) { hsv.h = Math.min(359.9, x * 360); changed(); }),
        R.on(area, 'keydown', function (e) {
          var st = e.shiftKey ? .1 : .01, k = e.key;
          if (k === 'ArrowLeft') hsv.s = R.clamp(hsv.s - st, 0, 1); else if (k === 'ArrowRight') hsv.s = R.clamp(hsv.s + st, 0, 1);
          else if (k === 'ArrowUp') hsv.v = R.clamp(hsv.v + st, 0, 1); else if (k === 'ArrowDown') hsv.v = R.clamp(hsv.v - st, 0, 1); else return;
          e.preventDefault(); changed();
        }),
        R.on(hue, 'keydown', function (e) {
          var st = e.shiftKey ? 15 : 1, k = e.key;
          if (k === 'ArrowLeft' || k === 'ArrowDown') hsv.h = (hsv.h - st + 360) % 360; else if (k === 'ArrowRight' || k === 'ArrowUp') hsv.h = (hsv.h + st) % 360;
          else if (k === 'Home') hsv.h = 0; else if (k === 'End') hsv.h = 359; else return;
          e.preventDefault(); changed();
        }),
        R.on(hexIn, 'input', function () { var v = hexIn.value.trim(); if (v[0] !== '#') v = '#' + v; if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) setHex(v); }),
        R.on(hexIn, 'blur', function () { paint(); }),
        R.on(hexIn, 'keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); paint(); if (closeFn) { closeFn(); trigger.focus(); } } }),
        R.on(panel, 'click', '.color-swatch-btn', function (e, b) { setHex(b.getAttribute('data-color'), true); }),
        R.on(panel, 'click', '.color-eyedropper', function () {
          try { new window.EyeDropper().open().then(function (res) { setHex(res.sRGBHex, true); }, function () {}); } catch (e) {}
        })
      ];
      var closeFn = null;
      if (trigger) {
        offs.push(R.on(trigger, 'click', function () {
          if (closeFn) { closeFn(); return; }
          el.setAttribute('data-state', 'open'); trigger.setAttribute('aria-expanded', 'true');
          closeFn = F.float(panel, trigger, { placement: o.placement, offset: 6, onClose: function (why) { closeFn = null; el.setAttribute('data-state', 'closed'); trigger.setAttribute('aria-expanded', 'false'); if (why === 'escape') trigger.focus(); } });
          paint();
          setTimeout(function () { area.focus({ preventScroll: true }); }, 20);
        }));
        offs.push(R.on(panel, 'focusout', function (e) { if (closeFn && e.relatedTarget && !panel.contains(e.relatedTarget) && e.relatedTarget !== trigger) closeFn(); }));
      }
      paint();
      return {
        destroy: function () { if (closeFn) closeFn(); offs.forEach(function (f) { f(); }); if (!o.inline) panel.remove(); },
        get value() { return rgbToHex(rgb); },
        set value(v) { setHex(v, false); }
      };
    }
  });
  R.color = { hexToRgb: hexToRgb, rgbToHex: rgbToHex, rgbToHsv: rgbToHsv, hsvToRgb: hsvToRgb };
})(window.Ranj);
