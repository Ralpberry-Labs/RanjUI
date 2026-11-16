/* Combobox — editable input + filtered listbox (aria-activedescendant), create-new, async sources.
   v1 markup (.combobox > .combobox-input + .combobox-list > .combobox-option) still works. */
(function (R) {
  'use strict';
  var F = R._forms;

  function readItems(el) {
    var items = [];
    var data = el.getAttribute('data-options');
    if (data) { try { items = JSON.parse(data); } catch (e) {} }
    var ul = el.querySelector('.combobox-list');
    if (ul) {
      var group = '';
      R.$$('.combobox-option, .combobox-group', ul).forEach(function (li) {
        if (li.classList.contains('combobox-group')) { group = li.textContent.trim(); return; }
        items.push({
          value: li.getAttribute('data-value') || li.textContent.trim(), label: li.getAttribute('data-label') || li.textContent.trim(),
          desc: li.getAttribute('data-description') || '', icon: li.getAttribute('data-icon') || '', meta: li.getAttribute('data-meta') || '',
          disabled: li.hasAttribute('data-disabled') || li.getAttribute('aria-disabled') === 'true', group: li.getAttribute('data-group') || group,
          selected: li.hasAttribute('data-selected')
        });
      });
      ul.remove();
    }
    var dl = el.querySelector('datalist');
    if (dl) { R.$$('option', dl).forEach(function (op) { items.push({ value: op.value, label: op.label || op.value }); }); dl.remove(); }
    return items.map(function (it) { return typeof it === 'string' ? { value: it, label: it } : it; });
  }

  R.define('combobox', {
    selector: '.combobox',
    mount: function (el) {
      var o = R.opts(el, { name: '', create: false, strict: false, openOnFocus: true, debounce: 180, minChars: 0, empty: 'No results found.', placement: 'bottom-start' });
      var input = el.querySelector('.combobox-input, input:not([type="hidden"])');
      if (!input) return;
      input.classList.add('combobox-input');
      var wrap = input.closest('.input-wrap');
      if (!wrap || !el.contains(wrap)) {
        wrap = document.createElement('div');
        wrap.className = 'input-wrap combobox-wrap';
        ['input-sm', 'input-lg', 'input-filled'].forEach(function (c) { if (input.classList.contains(c)) { wrap.classList.add(c); input.classList.remove(c); } });
        input.classList.remove('input');
        input.parentNode.insertBefore(wrap, input);
        wrap.appendChild(input);
      }
      var toggle = wrap.querySelector('.combobox-toggle');
      if (!toggle && !el.hasAttribute('data-no-toggle')) {
        toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'input-btn combobox-toggle';
        toggle.tabIndex = -1; toggle.setAttribute('aria-label', 'Show options'); toggle.innerHTML = F.icons.chevronDown;
        wrap.appendChild(toggle);
      }
      var spinner = document.createElement('span'); spinner.className = 'input-icon combobox-spinner'; spinner.hidden = true; spinner.innerHTML = F.icons.spinner;
      wrap.insertBefore(spinner, toggle || null);

      var items = readItems(el), source = null, selected = items.filter(function (i) { return i.selected; })[0] || null;
      var hidden = F.hidden(el, o.name || null, selected ? selected.value : '');
      if (selected && !input.value) input.value = selected.label;

      var panel = document.createElement('div'); panel.className = 'combobox-list'; panel.hidden = true;
      var list = F.makeList(panel, { host: input, empty: o.empty, onPick: function (it) { pick(it); close(); } });
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-controls', panel.id);
      input.setAttribute('autocomplete', 'off');
      if (!input.hasAttribute('spellcheck')) input.spellcheck = false;

      var closeFn = null, req = 0, timer = 0;

      function build(q, base) {
        var arr = (base || items).map(function (it) {
          var c = {}; for (var k in it) c[k] = it[k];
          c.selected = !!selected && selected.value === it.value; return c;
        });
        var qt = (q || '').trim();
        if (o.create && qt && !arr.some(function (i) { return F.norm(i.label) === F.norm(qt); })) arr.push({ value: qt, label: qt, create: true });
        list.set(arr).render(q, base ? false : true);
        var first = list.shown().map(function (i) { return i.selected; }).indexOf(true);
        if (first > -1 && !qt) list.highlight(first); else if (qt || el.hasAttribute('data-autohighlight')) list.move('first'); else list.highlight(-1);
        el.toggleAttribute('data-empty', !list.shown().length);
      }
      function update() {
        var q = input.value;
        if (source) {
          clearTimeout(timer);
          if (q.trim().length < o.minChars) { list.set([]); list.render(''); panel.querySelector('.listbox-empty').textContent = 'Type ' + o.minChars + '+ characters to search'; return; }
          var my = ++req;
          spinner.hidden = false; el.setAttribute('data-loading', '');
          if (!list.shown().length) panel.innerHTML = '<div class="listbox-loading">' + F.icons.spinner + 'Searching…</div>';
          timer = setTimeout(function () {
            Promise.resolve(source(q)).then(function (res) {
              if (my !== req) return;
              spinner.hidden = true; el.removeAttribute('data-loading');
              build(q, (res || []).map(function (it) { return typeof it === 'string' ? { value: it, label: it } : it; }));
              if (closeFn) R.position(panel, wrap, { placement: o.placement, offset: 6 });
            }, function () { if (my === req) { spinner.hidden = true; el.removeAttribute('data-loading'); list.set([]); list.render(''); panel.querySelector('.listbox-empty').textContent = 'Couldn’t load results.'; } });
          }, o.debounce);
        } else build(q);
      }
      function open() {
        if (closeFn || input.disabled || input.readOnly) return;
        el.setAttribute('data-state', 'open');
        input.setAttribute('aria-expanded', 'true');
        update();
        closeFn = F.float(panel, wrap, { matchWidth: true, placement: o.placement, onClose: function () {
          closeFn = null; el.setAttribute('data-state', 'closed'); input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant');
        } });
      }
      function close() { if (closeFn) closeFn(); }
      function pick(it) {
        if (!it || it.disabled) return;
        var isNew = !!it.create;
        if (isNew) {
          it = { value: it.value, label: it.label };
          items.push(it);
          R.emit(el, 'create', { value: it.value, label: it.label });
        }
        selected = it;
        input.value = it.label;
        if (hidden) hidden.value = it.value;
        F.changed(el, { value: it.value, label: it.label, item: it, created: isNew }, null);
        try { input.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
      }
      function revert() {
        if (!o.strict) {
          if (selected && input.value !== selected.label) { selected = null; if (hidden) hidden.value = ''; }
          if (!selected && hidden && o.create === false) hidden.value = '';
          return;
        }
        var match = items.filter(function (i) { return F.norm(i.label) === F.norm(input.value.trim()); })[0];
        if (match) { if (!selected || selected.value !== match.value) pick(match); }
        else input.value = selected ? selected.label : '';
      }

      var offs = [
        R.on(input, 'input', function () { if (!closeFn) open(); else update(); }),
        R.on(input, 'focus', function () { if (o.openOnFocus && !el.__skipFocusOpen) open(); el.__skipFocusOpen = false; }),
        R.on(input, 'click', function () { open(); }),
        R.on(input, 'blur', function () { setTimeout(function () { if (document.activeElement !== input) { close(); revert(); } }, 0); }),
        R.on(input, 'keydown', function (e) {
          var k = e.key;
          if (k === 'ArrowDown' || k === 'ArrowUp') {
            e.preventDefault();
            if (!closeFn) { open(); if (k === 'ArrowUp') list.move('last'); return; }
            if (e.altKey && k === 'ArrowUp') { close(); return; }
            list.move(k === 'ArrowDown' ? 1 : -1);
          } else if (k === 'PageDown' && closeFn) { e.preventDefault(); list.move(8); }
          else if (k === 'PageUp' && closeFn) { e.preventDefault(); list.move(-8); }
          else if (k === 'Enter') {
            if (closeFn && list.current()) { e.preventDefault(); pick(list.current()); close(); }
            else if (closeFn && o.create && input.value.trim()) { e.preventDefault(); pick({ value: input.value.trim(), label: input.value.trim(), create: true }); close(); }
          } else if (k === 'Escape') {
            if (!closeFn && input.value) { e.preventDefault(); input.value = ''; selected = null; if (hidden) hidden.value = ''; F.changed(el, { value: '', label: '' }); }
          } else if (k === 'Tab' && closeFn) {
            if (list.current() && el.hasAttribute('data-autohighlight')) pick(list.current());
            close();
          }
        })
      ];
      if (toggle) offs.push(R.on(toggle, 'click', function () { if (closeFn) close(); else { el.__skipFocusOpen = true; input.focus(); open(); } }));

      var inst = {
        destroy: function () { close(); clearTimeout(timer); offs.forEach(function (f) { f(); }); panel.remove(); },
        open: open, close: close,
        setItems: function (arr) { items = arr.map(function (it) { return typeof it === 'string' ? { value: it, label: it } : it; }); if (closeFn) update(); },
        setSource: function (fn) { source = fn; },
        get value() { return selected ? selected.value : ''; },
        set value(v) { var m = items.filter(function (i) { return String(i.value) === String(v); })[0]; if (m) pick(m); else { selected = null; input.value = ''; if (hidden) hidden.value = ''; } }
      };
      return inst;
    }
  });

  /** Ranj.combobox(el, { source(query) → items|Promise, items: [] }) → instance */
  R.combobox = function (el, opts) {
    if (typeof el === 'string') el = document.querySelector(el);
    R.init(el.parentNode || el);
    var inst = R.instance(el, 'combobox');
    if (inst && opts) { if (opts.source) inst.setSource(opts.source); if (opts.items) inst.setItems(opts.items); }
    return inst;
  };
})(window.Ranj);
