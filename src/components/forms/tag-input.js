/* Tag input — type and press Enter / comma to add, paste to split, Backspace to remove, max tags, pattern check */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('tag-input', {
    selector: '.tag-input',
    mount: function (el) {
      var o = R.opts(el, { name: '', value: '', max: 0, placeholder: 'Add a tag…', separators: ',;', pattern: '', allowDuplicates: false, lowercase: false, maxLength: 0, suggestions: '' });
      var box = el.querySelector('.chip-box');
      if (!box) { box = document.createElement('div'); box.className = 'chip-box tag-input-box'; el.appendChild(box); }
      var input = box.querySelector('input');
      if (!input) { input = document.createElement('input'); input.type = 'text'; box.appendChild(input); }
      input.classList.add('tag-input-field'); input.autocomplete = 'off';
      if (el.getAttribute('aria-label') && !input.hasAttribute('aria-label')) input.setAttribute('aria-label', el.getAttribute('aria-label'));
      var describe = document.createElement('span'); describe.className = 'f-sr'; describe.id = R.uid('tagh');
      describe.textContent = 'Press Enter or comma to add. Backspace removes the last tag.';
      el.appendChild(describe);
      input.setAttribute('aria-describedby', ((input.getAttribute('aria-describedby') || '') + ' ' + describe.id).trim());
      var live = document.createElement('span'); live.className = 'f-sr'; live.setAttribute('aria-live', 'polite'); el.appendChild(live);
      var re = o.pattern ? new RegExp(o.pattern === 'email' ? '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' : o.pattern) : null;
      var multi = /\[\]$/.test(o.name);
      var tags = [];
      R.$$('.input-chip', box).forEach(function (c) { tags.push(c.getAttribute('data-value') || c.textContent.trim()); c.remove(); });
      if (o.value) String(o.value).split(',').forEach(function (t) { t = t.trim(); if (t) tags.push(t); });
      var count = el.querySelector('.tag-input-count');

      function sync(anim) {
        R.$$('.input-chip', box).forEach(function (c) { c.remove(); });
        tags.forEach(function (t, i) {
          var c = document.createElement('span'); c.className = 'input-chip'; c.setAttribute('data-value', t);
          if (re && !re.test(t)) c.setAttribute('data-invalid', '');
          if (anim !== i) c.style.animation = 'none';
          c.innerHTML = '<span class="input-chip-label">' + R.esc(t) + '</span><button type="button" class="input-chip-remove" tabindex="-1" aria-label="Remove ' + R.esc(t) + '">' + F.icons.x + '</button>';
          box.insertBefore(c, input);
        });
        input.placeholder = tags.length ? (el.getAttribute('data-placeholder-more') || '') : o.placeholder;
        var full = !!o.max && tags.length >= o.max;
        el.toggleAttribute('data-full', full);
        input.readOnly = full;
        if (full) input.placeholder = '';
        if (count) count.textContent = tags.length + (o.max ? ' / ' + o.max : '');
        // hidden inputs
        R.$$('input[data-f-hidden]', el).forEach(function (h) { h.remove(); });
        if (o.name) {
          if (multi) tags.forEach(function (t) { var h = document.createElement('input'); h.type = 'hidden'; h.name = o.name; h.value = t; h.setAttribute('data-f-hidden', ''); el.appendChild(h); });
          else F.hidden(el, o.name, tags.join(','));
        }
      }
      function emit() { R.emit(el, 'change', { value: tags.slice() }); }
      function add(raw) {
        var t = String(raw).trim().replace(/\s+/g, ' ');
        if (!t) return false;
        if (o.lowercase) t = t.toLowerCase();
        if (o.maxLength) t = t.slice(0, o.maxLength);
        if (o.max && tags.length >= o.max) { F.shake(box); R.emit(el, 'reject', { value: t, reason: 'max' }); return false; }
        if (!o.allowDuplicates) {
          var i = tags.map(function (x) { return x.toLowerCase(); }).indexOf(t.toLowerCase());
          if (i > -1) { var c = R.$$('.input-chip', box)[i]; F.shake(c); R.emit(el, 'reject', { value: t, reason: 'duplicate' }); return false; }
        }
        var ev = R.emit(el, 'add', { value: t });
        if (!ev) return false;
        tags.push(t); sync(tags.length - 1); live.textContent = t + ' added';
        return true;
      }
      function removeAt(i) {
        if (i < 0 || i >= tags.length) return;
        var chip = R.$$('.input-chip', box)[i], t = tags[i];
        var done = function () { tags.splice(i, 1); sync(-1); live.textContent = t + ' removed'; R.emit(el, 'remove', { value: t }); emit(); };
        if (chip && !R.reducedMotion) { chip.setAttribute('data-leaving', ''); setTimeout(done, 150); } else done();
      }
      function commit() {
        var v = input.value;
        if (!v.trim()) return false;
        var parts = v.split(new RegExp('[' + o.separators.replace(/[\]\\^-]/g, '\\$&') + '\\n]'));
        var any = false;
        parts.forEach(function (p) { if (add(p)) any = true; });
        input.value = '';
        if (any) emit();
        return true;
      }
      function clearActive() { R.$$('.input-chip[data-active]', box).forEach(function (c) { c.removeAttribute('data-active'); }); }

      var offs = [
        R.on(box, 'mousedown', function (e) { if (e.target !== input) { e.preventDefault(); input.focus(); } }),
        R.on(box, 'click', '.input-chip-remove', function (e, b) { removeAt(R.$$('.input-chip', box).indexOf(b.parentNode)); input.focus(); }),
        R.on(input, 'keydown', function (e) {
          var k = e.key, active = box.querySelector('.input-chip[data-active]');
          if (e.isComposing) return;
          if (k === 'Enter' || (o.separators.indexOf(k) > -1 && k.length === 1) || (k === 'Tab' && input.value.trim())) {
            if (input.value.trim()) { e.preventDefault(); commit(); }
            else if (k !== 'Tab' && k !== 'Enter') e.preventDefault();
            return;
          }
          if (k === 'Backspace' && !input.value) {
            e.preventDefault();
            if (active) removeAt(R.$$('.input-chip', box).indexOf(active));
            else { var all = R.$$('.input-chip', box); if (all.length) all[all.length - 1].setAttribute('data-active', ''); }
            return;
          }
          if (k === 'Escape' && active) { clearActive(); return; }
          clearActive();
        }),
        R.on(input, 'paste', function (e) {
          var text = (e.clipboardData || window.clipboardData).getData('text');
          if (!text || !new RegExp('[' + o.separators.replace(/[\]\\^-]/g, '\\$&') + '\\n\\t]').test(text)) return;
          e.preventDefault();
          var any = false;
          text.split(new RegExp('[' + o.separators.replace(/[\]\\^-]/g, '\\$&') + '\\n\\t]')).forEach(function (p) { if (add(p)) any = true; });
          if (any) emit();
        }),
        R.on(input, 'blur', function () { clearActive(); if (el.hasAttribute('data-add-on-blur')) commit(); })
      ];
      sync(-1);
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); },
        add: function (t) { if (add(t)) emit(); }, remove: function (t) { removeAt(tags.indexOf(t)); },
        get value() { return tags.slice(); },
        set value(arr) { tags = (arr || []).slice(); sync(-1); }
      };
    }
  });
})(window.Ranj);
