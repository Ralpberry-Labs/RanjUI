/* Inline edit — click (or Enter) to edit text in place; Enter saves, Escape cancels, blur saves */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('inline-edit', {
    selector: '.inline-edit',
    mount: function (el) {
      var o = R.opts(el, { name: '', placeholder: 'Click to edit', multiline: false, required: false, maxlength: 0, blur: 'save', label: '' });
      var display = el.querySelector('.inline-edit-text');
      if (!display) {
        display = document.createElement('span'); display.className = 'inline-edit-text';
        while (el.firstChild) display.appendChild(el.firstChild);
        el.appendChild(display);
      }
      var value = display.textContent.trim();
      var icon = document.createElement('span'); icon.className = 'inline-edit-icon'; icon.setAttribute('aria-hidden', 'true'); icon.innerHTML = F.icons.pencil;
      el.appendChild(icon);
      var hidden = F.hidden(el, o.name || null, value);
      el.setAttribute('role', 'button'); el.tabIndex = 0;
      function aria() { el.setAttribute('aria-label', (o.label ? 'Edit ' + o.label.toLowerCase() : 'Edit') + ': ' + (value || 'empty')); }
      function paintDisplay() { display.textContent = value || o.placeholder; el.toggleAttribute('data-empty', !value); aria(); }
      var editor = null, editing = false;

      function start() {
        if (editing || el.hasAttribute('data-disabled')) return;
        editing = true;
        el.setAttribute('data-editing', '');
        el.removeAttribute('role'); el.removeAttribute('tabindex'); el.removeAttribute('aria-label');
        editor = document.createElement(o.multiline ? 'textarea' : 'input');
        editor.className = 'inline-edit-input';
        if (!o.multiline) editor.type = 'text';
        editor.value = value;
        editor.placeholder = o.placeholder;
        editor.setAttribute('aria-label', o.label || 'Edit text');
        if (o.maxlength) editor.maxLength = o.maxlength;
        var cs = getComputedStyle(display);
        editor.style.font = cs.font; editor.style.letterSpacing = cs.letterSpacing; editor.style.lineHeight = cs.lineHeight;
        editor.style.minWidth = Math.max(display.offsetWidth + 24, 64) + 'px';
        display.hidden = true; icon.hidden = true;
        el.insertBefore(editor, display);
        var grow = function () {
          if (o.multiline) { editor.style.height = 'auto'; editor.style.height = editor.scrollHeight + 'px'; }
          else { editor.style.width = '1px'; editor.style.width = Math.max(editor.scrollWidth + 6, 64) + 'px'; }
        };
        editor.addEventListener('input', grow);
        editor.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); }
          else if (e.key === 'Enter' && (!o.multiline || e.metaKey || e.ctrlKey)) { e.preventDefault(); finish(true); }
        });
        editor.addEventListener('blur', function () { if (editing) finish(o.blur !== 'cancel'); });
        grow();
        editor.focus(); editor.select();
        R.emit(el, 'edit', { value: value });
      }
      function finish(save) {
        if (!editing) return;
        var next = editor.value.trim(), prev = value;
        if (save && o.required && !next) { F.shake(editor); editor.setAttribute('aria-invalid', 'true'); editor.focus(); return; }
        if (save && next !== prev) {
          var ok = R.emit(el, 'save', { value: next, previous: prev });
          if (!ok) save = false;
        }
        editing = false;
        var hadFocus = document.activeElement === editor;
        editor.remove(); editor = null;
        display.hidden = false; icon.hidden = false;
        el.removeAttribute('data-editing');
        el.setAttribute('role', 'button'); el.tabIndex = 0;
        if (save && next !== prev) {
          value = next; if (hidden) hidden.value = value;
          paintDisplay();
          if (!R.reducedMotion) { el.classList.remove('inline-edit-saved'); void el.offsetWidth; el.classList.add('inline-edit-saved'); }
          R.emit(el, 'change', { value: value, previous: prev });
        } else { paintDisplay(); R.emit(el, 'cancel', { value: value }); }
        if (hadFocus) el.focus({ preventScroll: true });
      }
      var offs = [
        R.on(el, 'click', function (e) { if (!editing && !e.target.closest('a')) start(); }),
        R.on(el, 'keydown', function (e) { if (!editing && (e.key === 'Enter' || e.key === ' ' || e.key === 'F2') && e.target === el) { e.preventDefault(); start(); } })
      ];
      paintDisplay();
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); },
        edit: start, save: function () { finish(true); }, cancel: function () { finish(false); },
        get value() { return value; }, set value(v) { value = String(v); if (hidden) hidden.value = value; paintDisplay(); }
      };
    }
  });
})(window.Ranj);
