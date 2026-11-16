/*!
 * Ranj UI — command palette. Fuzzy filter with match highlighting, groups, keyboard,
 * recent items (data-recent="storage-key"), opt-in global hotkey (data-hotkey="k" → ⌘K / Ctrl+K).
 * Inline: <div class="command">…</div> · Modal: <div class="command-overlay" id="x"><div class="command-dialog">…</div></div>
 * Items: .command-item[data-value][data-keywords][data-href][data-keep-open]
 * API: Ranj.command.open(id) / close(id) / toggle(id). Events: ranj:select { value, item } (cancelable) from the item.
 */
(function (R) {
  'use strict';
  var d = document;

  function score(q, s) {
    if (!q) return 1;
    var i = s.indexOf(q);
    if (i === 0) return 2000 - s.length;
    if (i > 0) return (/[\s\-_/]/.test(s[i - 1]) ? 1500 : 1000) - i;
    var si = 0, sc = 0, prev = -2, run = 0;
    for (var k = 0; k < q.length; k++) {
      var c = q[k]; if (c === ' ') continue;
      var f = s.indexOf(c, si); if (f < 0) return 0;
      sc += 10;
      if (f === prev + 1) { run++; sc += 12 * run; } else run = 0;
      if (f === 0 || /[\s\-_/]/.test(s[f - 1])) sc += 18;
      sc -= Math.min(10, f - si) * .6;
      prev = f; si = f + 1;
    }
    return Math.max(1, sc);
  }
  function matchIdx(q, s) {
    var out = [], i = s.indexOf(q);
    if (q && i > -1) { for (var k = 0; k < q.length; k++) out.push(i + k); return out; }
    var si = 0;
    for (var j = 0; j < q.length; j++) { if (q[j] === ' ') continue; var f = s.indexOf(q[j], si); if (f < 0) return []; out.push(f); si = f + 1; }
    return out;
  }

  R.define('command', {
    selector: '.command,.command-dialog',
    mount: function (root) {
      var input = root.querySelector('.command-input');
      var list = root.querySelector('.command-list');
      if (!input || !list) return;
      var ov = root.closest('.command-overlay');
      var key = root.getAttribute('data-recent') || (ov && ov.getAttribute('data-recent'));
      var recentLabel = root.getAttribute('data-recent-label') || 'Recent';
      var items = [], active = null, recentGroup = null;

      R.ensureId(list, 'cmd-list');
      list.setAttribute('role', 'listbox');
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-controls', list.id);
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('spellcheck', 'false');

      function collect() {
        items = R.$$('.command-item', list).filter(function (it) { return !it.hasAttribute('data-recent-clone'); });
        items.forEach(function (it, n) {
          it.setAttribute('role', 'option');
          R.ensureId(it, 'cmd-opt');
          it.__order = n;
          if (!it.__label) {
            var lab = it.querySelector('.command-label');
            if (!lab) {
              var tn = Array.prototype.filter.call(it.childNodes, function (c) { return c.nodeType === 3 && c.textContent.trim(); })[0];
              if (tn) { lab = d.createElement('span'); lab.className = 'command-label'; lab.textContent = tn.textContent.trim(); it.replaceChild(lab, tn); }
            }
            it.__label = lab;
            it.__text = lab ? lab.textContent : it.textContent.trim();
          }
          if (!it.hasAttribute('data-value')) it.setAttribute('data-value', it.__text.trim());
        });
        R.$$('.command-group', list).forEach(function (g) {
          g.setAttribute('role', 'group');
          var l = g.querySelector('.command-group-label');
          if (l) g.setAttribute('aria-labelledby', R.ensureId(l, 'cmd-g'));
        });
      }
      collect();

      function visible() { return R.$$('.command-item', list).filter(function (i) { return !i.hidden && !i.closest('[hidden]') && i.getAttribute('aria-disabled') !== 'true'; }); }
      function setActive(it, scroll) {
        if (active === it) return;
        if (active) active.removeAttribute('aria-selected');
        active = it;
        if (it) {
          it.setAttribute('aria-selected', 'true');
          input.setAttribute('aria-activedescendant', it.id);
          if (scroll) it.scrollIntoView({ block: 'nearest' });
        } else input.removeAttribute('aria-activedescendant');
      }
      function readRecent() { if (!key) return []; try { return JSON.parse(localStorage.getItem('ranj-cmd:' + key) || '[]'); } catch (e) { return []; } }
      function pushRecent(v) {
        if (!key) return;
        var r = readRecent().filter(function (x) { return x !== v; }); r.unshift(v);
        try { localStorage.setItem('ranj-cmd:' + key, JSON.stringify(r.slice(0, 4))); } catch (e) {}
      }
      function buildRecent() {
        if (recentGroup) { recentGroup.remove(); recentGroup = null; }
        var r = readRecent(); if (!r.length) return;
        var g = d.createElement('div'); g.className = 'command-group'; g.setAttribute('data-recent-group', ''); g.setAttribute('role', 'group');
        g.innerHTML = '<div class="command-group-label">' + R.esc(recentLabel) + '</div>';
        r.forEach(function (v) {
          var src = items.filter(function (i) { return i.getAttribute('data-value') === v; })[0];
          if (!src) return;
          var c = src.cloneNode(true); c.id = R.uid('cmd-opt'); c.setAttribute('data-recent-clone', ''); c.removeAttribute('aria-selected'); c.removeAttribute('hidden'); c.__src = src;
          var cl = c.querySelector('.command-label'); if (cl) cl.textContent = src.__text;
          g.appendChild(c);
        });
        if (g.children.length < 2) return;
        var first = list.querySelector('.command-group,.command-item');
        list.insertBefore(g, first || null);
        var sep = d.createElement('div'); sep.className = 'command-separator'; sep.setAttribute('data-recent-sep', '');
        g.appendChild(sep);
        recentGroup = g;
      }

      function filter() {
        var q = input.value.trim().toLowerCase();
        var groups = R.$$('.command-group', list).filter(function (g) { return !g.hasAttribute('data-recent-group'); });
        if (recentGroup) recentGroup.hidden = !!q;
        items.forEach(function (it) {
          var hay = (it.__text + ' ' + (it.getAttribute('data-keywords') || '') + ' ' + (it.getAttribute('data-value') || '')).toLowerCase();
          var s = it.hasAttribute('data-always') ? 1 : score(q, hay);
          it.__score = s;
          it.hidden = !s;
          if (it.__label) {
            var t = it.__text, idx = q ? matchIdx(q, t.toLowerCase()) : [];
            if (idx.length) {
              var html = '', set = {}; idx.forEach(function (n) { set[n] = 1; });
              for (var c = 0; c < t.length; c++) html += set[c] ? '<mark>' + R.esc(t[c]) + '</mark>' : R.esc(t[c]);
              it.__label.innerHTML = html.replace(/<\/mark><mark>/g, '');
            } else if (it.__label.firstElementChild) it.__label.textContent = t;
          }
        });
        groups.forEach(function (g) {
          var gi = items.filter(function (i) { return i.parentNode === g; });
          gi.sort(function (a, b) { return q ? (b.__score - a.__score) || (a.__order - b.__order) : a.__order - b.__order; });
          gi.forEach(function (i) { g.appendChild(i); });
          g.hidden = !gi.some(function (i) { return !i.hidden; });
        });
        R.$$('.command-separator', list).forEach(function (s) { if (!s.hasAttribute('data-recent-sep')) s.hidden = !!q; });
        var any = items.some(function (i) { return !i.hidden; });
        if (any) root.removeAttribute('data-empty'); else root.setAttribute('data-empty', '');
        var v = visible();
        setActive(null);
        setActive(v[0] || null, true);
        list.scrollTop = 0;
        R.emit(root, 'filter', { query: q, count: items.filter(function (i) { return !i.hidden; }).length });
      }

      function select(it) {
        if (!it || it.getAttribute('aria-disabled') === 'true') return;
        var src = it.__src || it;
        var ok = R.emit(src, 'select', { value: src.getAttribute('data-value'), item: src, query: input.value });
        if (!ok) return;
        pushRecent(src.getAttribute('data-value'));
        var href = src.getAttribute('data-href') || (src.tagName === 'A' ? src.getAttribute('href') : null);
        if (ov && !src.hasAttribute('data-keep-open') && R.dialog) R.dialog.close(ov, { reason: 'select' });
        if (href && src.tagName !== 'A') location.href = href;
      }

      function reset() {
        input.value = '';
        buildRecent();
        filter();
      }

      var offs = [
        R.on(input, 'input', filter),
        R.on(input, 'keydown', function (e) {
          var v = visible(), i = v.indexOf(active);
          if (e.key === 'ArrowDown' || (e.ctrlKey && (e.key === 'n' || e.key === 'j'))) { e.preventDefault(); setActive(v[(i + 1) % v.length] || null, true); }
          else if (e.key === 'ArrowUp' || (e.ctrlKey && (e.key === 'p' || e.key === 'k'))) { e.preventDefault(); setActive(v[i <= 0 ? v.length - 1 : i - 1] || null, true); }
          else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); setActive(v[0], true); }
          else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); setActive(v[v.length - 1], true); }
          else if (e.key === 'Enter') { e.preventDefault(); select(active); }
          else if (e.key === 'Escape' && !ov && input.value) { e.preventDefault(); e.stopPropagation(); input.value = ''; filter(); }
        }),
        R.on(list, 'pointermove', function (e) {
          var it = e.target.closest('.command-item');
          if (it && !it.hidden && it !== active && it.getAttribute('aria-disabled') !== 'true') setActive(it, false);
        }),
        R.on(list, 'click', function (e) {
          var it = e.target.closest('.command-item');
          if (it) { if (it.tagName === 'A' && ov && !it.hasAttribute('data-keep-open')) { /* navigate */ } else e.preventDefault(); select(it); }
        }),
        R.on(root, 'click', '.command-esc,[data-command-close]', function () { if (ov && R.dialog) R.dialog.close(ov, { reason: 'button' }); })
      ];
      if (ov) offs.push(R.on(ov, 'ranj:open', function (e) { if (e.target === ov) reset(); }));
      root.__command = { filter: filter, reset: reset, refresh: function () { collect(); filter(); }, select: select };
      reset();
      return function () { offs.forEach(function (f) { f(); }); if (recentGroup) recentGroup.remove(); };
    }
  });

  // Opt-in global hotkey: <div class="command-overlay" data-hotkey="k">
  R.define('command-hotkey', {
    setup: function () {
      d.addEventListener('keydown', function (e) {
        if (!(e.metaKey || e.ctrlKey) || e.altKey || !e.key) return;
        var k = e.key.toLowerCase();
        var ov = R.$$('.command-overlay[data-hotkey]').filter(function (o) { return o.getAttribute('data-hotkey').toLowerCase() === k; })[0];
        if (!ov || !R.dialog) return;
        e.preventDefault();
        R.dialog.toggle(ov);
      });
    }
  });

  R.command = {
    open: function (id) { return R.dialog && R.dialog.open(id); },
    close: function (id) { return R.dialog && R.dialog.close(id); },
    toggle: function (id) { return R.dialog && R.dialog.toggle(id); },
    refresh: function (el) { el = typeof el === 'string' ? d.getElementById(el) : el; var r = el && (el.__command ? el : el.querySelector('.command,.command-dialog')); if (r && r.__command) r.__command.refresh(); }
  };
})(window.Ranj);
