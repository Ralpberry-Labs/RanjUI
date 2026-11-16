/* Custom select — button + listbox popover that drives a hidden native <select> (forms submit natively) */
(function (R) {
  'use strict';
  var F = R._forms;

  function buildSelect(el) {
    var sel = el.querySelector('select');
    if (sel) return sel;
    sel = document.createElement('select');
    var data = [];
    try { data = JSON.parse(el.getAttribute('data-options') || '[]'); } catch (e) {}
    var groups = {};
    data.forEach(function (d) {
      if (typeof d === 'string') d = { value: d, label: d };
      var op = new Option(d.label || d.value, d.value == null ? d.label : d.value);
      if (d.icon) op.setAttribute('data-icon', d.icon);
      if (d.description) op.setAttribute('data-description', d.description);
      if (d.meta) op.setAttribute('data-meta', d.meta);
      if (d.disabled) op.disabled = true;
      if (d.selected) op.selected = op.defaultSelected = true;
      var parent = sel;
      if (d.group) { parent = groups[d.group]; if (!parent) { parent = groups[d.group] = document.createElement('optgroup'); parent.label = d.group; sel.appendChild(parent); } }
      parent.appendChild(op);
    });
    el.appendChild(sel);
    return sel;
  }

  R.define('custom-select', {
    selector: '.custom-select',
    mount: function (el) {
      var o = R.opts(el, { placeholder: 'Select…', search: false, searchPlaceholder: 'Search…', name: '', placement: 'bottom-start', empty: 'No results found.' });
      var sel = buildSelect(el);
      if (o.name && !sel.name) sel.name = o.name;
      var hasExplicit = R.$$('option', sel).some(function (op) { return op.hasAttribute('selected'); });
      if (!hasExplicit && el.hasAttribute('data-placeholder') && !R.$$('option', sel).some(function (op) { return op.value === ''; })) sel.selectedIndex = -1;
      sel.classList.add('f-sr'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true'); sel.setAttribute('data-f-native', '');

      var trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-select-trigger';
      trigger.setAttribute('role', 'combobox');
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      if (sel.getAttribute('aria-label')) trigger.setAttribute('aria-label', sel.getAttribute('aria-label'));
      if (el.getAttribute('aria-label')) trigger.setAttribute('aria-label', el.getAttribute('aria-label'));
      trigger.innerHTML = '<span class="custom-select-value"></span><span class="custom-select-caret">' + F.icons.chevronUpDown + '</span>';
      el.insertBefore(trigger, sel);
      var valueEl = trigger.firstChild;

      var panel = document.createElement('div');
      panel.className = 'custom-select-panel';
      panel.hidden = true;
      var header = null, search = null;
      if (o.search) {
        header = document.createElement('div'); header.className = 'listbox-search';
        header.innerHTML = F.icons.search + '<input type="text" autocomplete="off" spellcheck="false" aria-autocomplete="list" placeholder="' + R.esc(o.searchPlaceholder) + '">';
        search = header.querySelector('input');
        search.setAttribute('role', 'combobox');
        search.setAttribute('aria-expanded', 'true');
        search.setAttribute('aria-label', o.searchPlaceholder);
      }
      var list = F.makeList(panel, { host: search || trigger, empty: o.empty, header: header, onPick: function (it) { choose(it); close(); trigger.focus(); } });
      trigger.setAttribute('aria-controls', panel.id);
      if (search) search.setAttribute('aria-controls', panel.id);

      var closeFn = null, ta = F.typeahead();

      function refresh() {
        var items = F.itemsFromSelect(sel);
        list.set(items);
        var cur = items.filter(function (i) { return i.selected; })[0];
        if (cur) {
          valueEl.innerHTML = (cur.icon ? '<span class="custom-select-icon">' + cur.icon + '</span>' : '') + '<span class="custom-select-label">' + R.esc(cur.label) + '</span>';
          el.removeAttribute('data-placeholder-shown');
        } else {
          valueEl.innerHTML = '<span class="custom-select-label">' + R.esc(o.placeholder) + '</span>';
          el.setAttribute('data-placeholder-shown', '');
        }
        trigger.disabled = sel.disabled;
        el.toggleAttribute('data-disabled', sel.disabled);
        return items;
      }
      function choose(it) {
        if (!it || it.disabled) return;
        var changedNow = sel.value !== it.value || sel.selectedIndex < 0;
        it.option.selected = true;
        refresh();
        if (changedNow) {
          try { sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
          R.emit(el, 'change', { value: it.value, label: it.label });
        }
      }
      function open() {
        if (closeFn || sel.disabled) return;
        refresh();
        list.render('');
        el.setAttribute('data-state', 'open');
        trigger.setAttribute('aria-expanded', 'true');
        closeFn = F.float(panel, trigger, { matchWidth: true, placement: o.placement, onClose: function () {
          closeFn = null; el.setAttribute('data-state', 'closed'); trigger.setAttribute('aria-expanded', 'false'); trigger.removeAttribute('aria-activedescendant');
          if (search && document.activeElement === search) trigger.focus();
        } });
        var si = list.shown().map(function (i) { return i.selected; }).indexOf(true);
        if (si > -1) list.highlight(si); else list.move('first');
        if (search) { search.value = ''; setTimeout(function () { search.focus(); }, 0); }
      }
      function close() { if (closeFn) closeFn(); }

      function onKey(e) {
        var k = e.key, isOpen = !!closeFn;
        if (!isOpen) {
          if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') { e.preventDefault(); open(); if (k === 'ArrowUp' && list.index() < 0) list.move('last'); return; }
          if (k === 'Home' || k === 'End') { e.preventDefault(); refresh(); list.render(''); list.move(k === 'Home' ? 'first' : 'last'); choose(list.current()); return; }
          if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            refresh(); list.render('');
            var si = list.shown().map(function (i) { return i.selected; }).indexOf(true); list.highlight(si, false);
            if (list.seek(ta(k)) > -1) choose(list.current());
          }
          return;
        }
        if (k === 'ArrowDown') { e.preventDefault(); if (e.altKey) return; list.move(1); }
        else if (k === 'ArrowUp') { e.preventDefault(); if (e.altKey) { choose(list.current()); close(); return; } list.move(-1); }
        else if (k === 'Home' && e.currentTarget !== search) { e.preventDefault(); list.move('first'); }
        else if (k === 'End' && e.currentTarget !== search) { e.preventDefault(); list.move('last'); }
        else if (k === 'PageDown') { e.preventDefault(); list.move(8); }
        else if (k === 'PageUp') { e.preventDefault(); list.move(-8); }
        else if (k === 'Enter' || (k === ' ' && e.currentTarget !== search)) { e.preventDefault(); choose(list.current()); close(); trigger.focus(); }
        else if (k === 'Tab') { choose(list.current()); close(); }
        else if (k.length === 1 && e.currentTarget !== search && !e.metaKey && !e.ctrlKey) { list.seek(ta(k)); }
      }

      var offs = [
        R.on(trigger, 'click', function () { if (closeFn) close(); else open(); }),
        R.on(trigger, 'keydown', onKey),
        R.on(sel, 'change', function () { if (!closeFn) refresh(); }),
        R.on(sel.form || el, 'reset', function () { setTimeout(refresh, 0); })
      ];
      if (search) {
        offs.push(R.on(search, 'keydown', onKey));
        offs.push(R.on(search, 'input', function () { list.render(search.value); list.move('first'); }));
      }
      // Label click focuses the trigger
      var lab = sel.id && document.querySelector('label[for="' + sel.id + '"]');
      if (lab) { lab.htmlFor = R.ensureId(trigger, 'cs'); }
      refresh();

      return {
        destroy: function () { close(); offs.forEach(function (f) { f(); }); panel.remove(); },
        open: open, close: close, refresh: refresh,
        get value() { return sel.value; },
        set value(v) { sel.value = v; refresh(); }
      };
    }
  });
})(window.Ranj);
