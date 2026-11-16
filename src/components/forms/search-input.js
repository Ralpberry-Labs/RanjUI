/* Search input — icon, ⌘K / Ctrl K shortcut hint, loading spinner, clear, debounced ranj:search */
(function (R) {
  'use strict';
  var F = R._forms;
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  R.define('search-input', {
    selector: '.search-input',
    mount: function (el) {
      var inp = el.querySelector('input'); if (!inp) return;
      var o = R.opts(el, { shortcut: '', debounce: 250, minChars: 0 });
      el.classList.add('input-wrap');
      if (!inp.type || inp.type === 'text') inp.type = 'search';
      if (!inp.hasAttribute('aria-label') && !inp.id) inp.setAttribute('aria-label', inp.placeholder || 'Search');
      inp.autocomplete = 'off';
      if (!el.querySelector('.input-icon')) el.insertAdjacentHTML('afterbegin', '<span class="input-icon search-input-icon">' + F.icons.search + '</span>');
      var icon = el.querySelector('.input-icon');
      var spin = document.createElement('span'); spin.className = 'search-input-spinner'; spin.innerHTML = F.icons.spinner; spin.setAttribute('aria-hidden', 'true');
      icon.appendChild(spin);
      var clear = document.createElement('button'); clear.type = 'button'; clear.className = 'input-btn input-clear'; clear.tabIndex = -1;
      clear.setAttribute('aria-label', 'Clear search'); clear.innerHTML = F.icons.x;
      inp.insertAdjacentElement('afterend', clear);
      var kbd = null;
      if (o.shortcut) {
        kbd = document.createElement('kbd'); kbd.className = 'input-kbd search-input-kbd';
        var key = o.shortcut.length === 1 ? o.shortcut.toUpperCase() : o.shortcut;
        kbd.innerHTML = o.shortcut === '/' ? '/' : (mac ? '<span>⌘</span>' : '<span>Ctrl</span>') + key;
        kbd.setAttribute('aria-hidden', 'true');
        el.appendChild(kbd);
        inp.setAttribute('aria-keyshortcuts', o.shortcut === '/' ? '/' : (mac ? 'Meta+' : 'Control+') + key);
      }
      var t = 0, last = inp.value;
      function sync() { el.toggleAttribute('data-has-value', !!inp.value); }
      function fire(now) {
        clearTimeout(t);
        var run = function () { if (inp.value === last && !now) return; last = inp.value; if (inp.value.length >= o.minChars || !inp.value) R.emit(el, 'search', { value: inp.value, query: inp.value.trim() }); };
        if (now) run(); else t = setTimeout(run, o.debounce);
      }
      var offs = [
        R.on(inp, 'input', function () { sync(); R.emit(el, 'change', { value: inp.value }); fire(false); }),
        R.on(inp, 'keydown', function (e) {
          if (e.key === 'Enter') { fire(true); R.emit(el, 'submit', { value: inp.value }); }
          else if (e.key === 'Escape') { if (inp.value) { e.preventDefault(); e.stopPropagation(); inp.value = ''; sync(); R.emit(el, 'change', { value: '' }); fire(true); } else inp.blur(); }
        }),
        R.on(clear, 'click', function () { inp.value = ''; sync(); inp.focus(); R.emit(el, 'change', { value: '' }); fire(true); R.emit(el, 'clear', {}); })
      ];
      if (o.shortcut) offs.push(R.on(document, 'keydown', function (e) {
        var k = e.key && e.key.toLowerCase();
        var hit = o.shortcut === '/' ? (k === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable)
          : (k === o.shortcut.toLowerCase() && (mac ? e.metaKey : e.ctrlKey) && !e.altKey);
        if (hit && el.isConnected && el.offsetParent !== null) { e.preventDefault(); inp.focus(); inp.select(); }
      }));
      sync();
      return {
        destroy: function () { clearTimeout(t); offs.forEach(function (f) { f(); }); },
        loading: function (on) { el.toggleAttribute('data-loading', !!on); inp.setAttribute('aria-busy', String(!!on)); },
        get value() { return inp.value; }, set value(v) { inp.value = v; sync(); }
      };
    }
  });
  /** Ranj.searchLoading(el, bool) — toggle the spinner */
  R.searchLoading = function (el, on) { var i = R.instance(el, 'search-input'); if (i) i.loading(on); else el.toggleAttribute('data-loading', !!on); };
})(window.Ranj);
