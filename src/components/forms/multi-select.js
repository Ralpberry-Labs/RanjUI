/* Multi-select — chips inside the field, filterable listbox, backspace removes. Drives a hidden <select multiple>. */
(function (R) {
  'use strict';
  var F = R._forms;

  R.define('multi-select', {
    selector: '.multi-select',
    mount: function (el) {
      var o = R.opts(el, { placeholder: 'Select…', max: 0, name: '', closeOnSelect: false, empty: 'No matches.' });
      var sel = el.querySelector('select');
      if (!sel) {
        sel = document.createElement('select');
        var data = []; try { data = JSON.parse(el.getAttribute('data-options') || '[]'); } catch (e) {}
        data.forEach(function (d) { if (typeof d === 'string') d = { value: d, label: d }; var op = new Option(d.label, d.value, d.selected, d.selected); if (d.icon) op.setAttribute('data-icon', d.icon); if (d.group) op.setAttribute('data-group', d.group); sel.appendChild(op); });
        el.appendChild(sel);
      }
      if (!sel.multiple) { sel.multiple = true; R.$$('option', sel).forEach(function (op) { op.selected = op.defaultSelected; }); }
      if (o.name && !sel.name) sel.name = o.name;
      sel.classList.add('f-sr'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true'); sel.setAttribute('data-f-native', '');

      var box = document.createElement('div'); box.className = 'chip-box multi-select-box';
      var input = document.createElement('input');
      input.type = 'text'; input.className = 'multi-select-input'; input.autocomplete = 'off'; input.spellcheck = false;
      input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list'); input.setAttribute('aria-expanded', 'false');
      if (el.getAttribute('aria-label')) input.setAttribute('aria-label', el.getAttribute('aria-label'));
      var caret = document.createElement('button'); caret.type = 'button'; caret.className = 'input-btn'; caret.tabIndex = -1;
      caret.setAttribute('aria-label', 'Show options'); caret.innerHTML = F.icons.chevronDown;
      box.appendChild(input); box.appendChild(caret);
      el.insertBefore(box, sel);
      var live = document.createElement('span'); live.className = 'f-sr'; live.setAttribute('aria-live', 'polite'); el.appendChild(live);

      var panel = document.createElement('div'); panel.className = 'multi-select-panel'; panel.hidden = true;
      var list = F.makeList(panel, { host: input, multi: true, empty: o.empty, onPick: function (it) { toggle(it); } });
      input.setAttribute('aria-controls', panel.id);
      var closeFn = null;

      function options() { return F.itemsFromSelect(sel).map(function (it) { it.selected = it.option.selected; if (!it.group) it.group = it.option.getAttribute('data-group') || ''; return it; }); }
      function chips() {
        R.$$('.input-chip', box).forEach(function (c) { c.remove(); });
        var chosen = options().filter(function (i) { return i.selected; });
        chosen.forEach(function (it) {
          var c = document.createElement('span'); c.className = 'input-chip'; c.setAttribute('data-value', it.value);
          c.innerHTML = (it.icon ? '<span class="input-chip-icon">' + it.icon + '</span>' : '') + '<span class="input-chip-label">' + R.esc(it.label) + '</span>' +
            '<button type="button" class="input-chip-remove" tabindex="-1" aria-label="Remove ' + R.esc(it.label) + '">' + F.icons.x + '</button>';
          box.insertBefore(c, input);
        });
        if (box.__noAnim) R.$$('.input-chip', box).forEach(function (c) { c.style.animation = 'none'; });
        input.placeholder = chosen.length ? '' : o.placeholder;
        el.toggleAttribute('data-has-value', chosen.length > 0);
        el.toggleAttribute('data-full', !!o.max && chosen.length >= o.max);
        return chosen;
      }
      function render() {
        var full = !!o.max && options().filter(function (i) { return i.selected; }).length >= o.max;
        var items = options().map(function (it) { if (full && !it.selected) it.disabled = true; return it; });
        var keep = list.current() && list.current().value;
        list.set(items).render(input.value);
        var idx = keep != null ? list.shown().map(function (i) { return i.value; }).indexOf(keep) : -1;
        if (idx > -1) list.highlight(idx); else list.move('first');
      }
      function emit() {
        var vals = R.$$('option', sel).filter(function (op) { return op.selected; }).map(function (op) { return op.value; });
        el.__emitting = true;
        try { sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
        el.__emitting = false;
        R.emit(el, 'change', { value: vals });
      }
      function toggle(it) {
        if (!it || it.disabled) return;
        it.option.selected = !it.option.selected;
        live.textContent = it.label + (it.option.selected ? ' selected' : ' removed');
        box.__noAnim = false;
        var prevChips = R.$$('.input-chip', box).map(function (c) { return c.getAttribute('data-value'); });
        chips();
        R.$$('.input-chip', box).forEach(function (c) { if (prevChips.indexOf(c.getAttribute('data-value')) > -1) c.style.animation = 'none'; });
        if (input.value) { input.value = ''; }
        render(); emit();
        if (o.closeOnSelect) close();
        else if (closeFn) R.position(panel, box, { placement: 'bottom-start', offset: 6 });
      }
      function removeValue(v) {
        var op = R.$$('option', sel).filter(function (x) { return x.value === v; })[0]; if (!op) return;
        var chip = box.querySelector('.input-chip[data-value="' + CSS.escape(v) + '"]');
        op.selected = false; live.textContent = op.textContent.trim() + ' removed';
        var finish = function () { box.__noAnim = true; chips(); box.__noAnim = false; if (closeFn) { render(); R.position(panel, box, { placement: 'bottom-start', offset: 6 }); } emit(); };
        if (chip && !R.reducedMotion) { chip.setAttribute('data-leaving', ''); setTimeout(finish, 150); } else finish();
      }
      function open() {
        if (closeFn || sel.disabled) return;
        render();
        el.setAttribute('data-state', 'open'); input.setAttribute('aria-expanded', 'true');
        closeFn = F.float(panel, box, { matchWidth: true, onClose: function () { closeFn = null; el.setAttribute('data-state', 'closed'); input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); input.value = ''; } });
      }
      function close() { if (closeFn) closeFn(); }
      function clearActive() { R.$$('.input-chip[data-active]', box).forEach(function (c) { c.removeAttribute('data-active'); }); }

      var offs = [
        R.on(box, 'mousedown', function (e) {
          if (e.target.closest('.input-chip-remove')) { e.preventDefault(); return; }
          if (e.target !== input) { e.preventDefault(); input.focus(); if (closeFn && e.target.closest('.input-btn')) close(); else open(); }
        }),
        R.on(box, 'click', '.input-chip-remove', function (e, b) { e.stopPropagation(); removeValue(b.parentNode.getAttribute('data-value')); input.focus(); }),
        R.on(input, 'focus', function () { el.setAttribute('data-focus', ''); }),
        R.on(input, 'blur', function () { el.removeAttribute('data-focus'); clearActive(); setTimeout(function () { if (document.activeElement !== input) close(); }, 0); }),
        R.on(input, 'input', function () { clearActive(); if (!closeFn) open(); else render(); }),
        R.on(input, 'keydown', function (e) {
          var k = e.key, active = box.querySelector('.input-chip[data-active]');
          if (k === 'Backspace' && !input.value) {
            e.preventDefault();
            var all = R.$$('.input-chip', box);
            if (active) removeValue(active.getAttribute('data-value'));
            else if (all.length) all[all.length - 1].setAttribute('data-active', '');
            return;
          }
          if (k === 'ArrowLeft' && !input.selectionStart && !input.value) {
            var cs = R.$$('.input-chip', box); var i = active ? cs.indexOf(active) - 1 : cs.length - 1;
            clearActive(); if (cs[Math.max(0, i)]) cs[Math.max(0, i)].setAttribute('data-active', ''); return;
          }
          if (k === 'ArrowRight' && active) { var cs2 = R.$$('.input-chip', box), j = cs2.indexOf(active) + 1; clearActive(); if (cs2[j]) cs2[j].setAttribute('data-active', ''); return; }
          if (k === 'Delete' && active) { e.preventDefault(); removeValue(active.getAttribute('data-value')); return; }
          clearActive();
          if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); if (!closeFn) { open(); return; } list.move(k === 'ArrowDown' ? 1 : -1); }
          else if (k === 'Home' && closeFn && !input.value) { e.preventDefault(); list.move('first'); }
          else if (k === 'End' && closeFn && !input.value) { e.preventDefault(); list.move('last'); }
          else if (k === 'Enter') { if (closeFn && list.current()) { e.preventDefault(); toggle(list.current()); } else if (!closeFn) { e.preventDefault(); open(); } }
          else if (k === 'Tab') close();
        }),
        R.on(sel, 'change', function () { if (!el.__emitting) { box.__noAnim = true; chips(); box.__noAnim = false; } })
      ];
      box.__noAnim = true; chips(); box.__noAnim = false;
      return {
        destroy: function () { close(); offs.forEach(function (f) { f(); }); panel.remove(); },
        open: open, close: close,
        get value() { return R.$$('option', sel).filter(function (op) { return op.selected; }).map(function (op) { return op.value; }); },
        set value(arr) { R.$$('option', sel).forEach(function (op) { op.selected = arr.indexOf(op.value) > -1; }); chips(); }
      };
    }
  });
})(window.Ranj);
