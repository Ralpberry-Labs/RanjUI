/* Ranj UI — Tree view.
 * <ul class="tree" data-tree> <li data-open>src <ul> <li>index.ts</li> </ul></li> </ul>
 * Turns nested lists into an accessible ARIA tree with expand/collapse, keyboard, file icons, selection and optional tri-state checkboxes. */
(function (R) {
  'use strict';
  var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
  var CHECK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>';
  var ICONS = {
    folder: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h3.6a2 2 0 0 1 1.5.7L12 6.3h6.5A2.5 2.5 0 0 1 21 8.8v8.7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/></svg>',
    'folder-open': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h3.6a2 2 0 0 1 1.5.7L12 6.3h6a2.5 2.5 0 0 1 2.5 2.5V10H8.2a2 2 0 0 0-1.9 1.4L3.4 19.6A2.5 2.5 0 0 1 3 18.2z" opacity=".55"/><path d="M6.7 11.6A1.5 1.5 0 0 1 8.1 10.5h13a1.2 1.2 0 0 1 1.1 1.6l-2 6.3A2.5 2.5 0 0 1 17.8 20H4.6a1 1 0 0 1-1-1.3z"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M10 12.5 8.5 14l1.5 1.5M14 12.5l1.5 1.5-1.5 1.5"/></svg>',
    img: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-9 9"/></svg>',
    md: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M6 15V9l2.5 3L11 9v6M15.5 9v6m0 0 2.5-2.5M15.5 15 13 12.5"/></svg>',
    json: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
  };
  var EXT = { ts: 'ts', tsx: 'ts', js: 'js', jsx: 'js', mjs: 'js', cjs: 'js', css: 'css', scss: 'css', html: 'html', json: 'json', md: 'md', mdx: 'md', png: 'img', jpg: 'img', jpeg: 'img', svg: 'img', webp: 'img', gif: 'img', lock: 'lock', env: 'env' };
  function kindOf(name) {
    var n = name.toLowerCase();
    if (/^\.env/.test(n)) return 'env';
    var m = /\.([a-z0-9]+)$/.exec(n); return m ? (EXT[m[1]] || 'file') : 'file';
  }
  function iconFor(kind, open) {
    if (kind === 'folder') return ICONS[open ? 'folder-open' : 'folder'];
    if (kind === 'ts' || kind === 'js' || kind === 'css' || kind === 'html') return ICONS.code;
    if (kind === 'none') return '';
    return ICONS[kind] || ICONS.file;
  }

  R.define('tree', {
    selector: '.tree[data-tree], [data-tree]:not(.tree)',
    mount: function (root) {
      var o = R.opts(root, { checkboxes: false, icons: true, select: 'single', openAll: false });
      root.classList.add('tree');
      root.setAttribute('role', 'tree');
      if (o.select === 'multiple') root.setAttribute('aria-multiselectable', 'true');
      var items = [];

      function build(ul, level) {
        [].slice.call(ul.children).forEach(function (li) {
          if (li.tagName !== 'LI' || li.__tree) return;
          li.__tree = true;
          var sub = null, label = [];
          [].slice.call(li.childNodes).forEach(function (n) {
            if (n.nodeType === 1 && (n.tagName === 'UL' || n.tagName === 'OL')) sub = n;
            else if (!(n.nodeType === 3 && !n.textContent.trim()) && !(n.nodeType === 1 && n.classList.contains('tree-row'))) label.push(n);
          });
          var row = li.querySelector(':scope > .tree-row');
          var hasKids = !!(sub && sub.children.length) || li.hasAttribute('data-lazy');
          var name = label.filter(function (n) { return !(n.nodeType === 1 && n.classList.contains('tree-meta')); }).map(function (n) { return n.textContent; }).join('').trim();
          var kind = li.getAttribute('data-icon') || (hasKids || sub ? 'folder' : kindOf(name));
          if (!row) {
            row = document.createElement('div'); row.className = 'tree-row';
            var lab = document.createElement('span'); lab.className = 'tree-label';
            label.forEach(function (n) { if (n.nodeType === 1 && n.classList.contains('tree-meta')) return; lab.appendChild(n); });
            var meta = label.filter(function (n) { return n.nodeType === 1 && n.classList.contains('tree-meta'); });
            row.innerHTML = '<span class="tree-toggle' + (hasKids || sub ? '' : ' is-leaf') + '" aria-hidden="true">' + CHEV + '</span>' +
              (o.checkboxes ? '<span class="tree-check" aria-hidden="true">' + CHECK + '<span class="tree-dash"></span></span>' : '') +
              (o.icons && kind !== 'none' ? '<span class="tree-icon" data-kind="' + kind + '" aria-hidden="true"></span>' : '');
            row.appendChild(lab);
            meta.forEach(function (m) { row.appendChild(m); });
            li.insertBefore(row, li.firstChild);
          }
          li.setAttribute('role', 'treeitem');
          li.setAttribute('aria-level', level);
          li.tabIndex = -1;
          if (o.select !== 'none' && !li.hasAttribute('aria-selected')) li.setAttribute('aria-selected', 'false');
          if (o.checkboxes && !li.hasAttribute('data-checked')) li.setAttribute('data-checked', 'false');
          li.__kind = kind;
          if (sub) {
            var wrap = document.createElement('div'); wrap.className = 'tree-group';
            li.insertBefore(wrap, sub); wrap.appendChild(sub);
            sub.setAttribute('role', 'group');
            var open = li.hasAttribute('data-open') || o.openAll || li.getAttribute('aria-expanded') === 'true';
            li.setAttribute('aria-expanded', open ? 'true' : 'false');
            build(sub, level + 1);
          }
          paintIcon(li);
          items.push(li);
        });
      }
      function paintIcon(li) {
        var ic = li.querySelector(':scope > .tree-row > .tree-icon');
        if (ic) ic.innerHTML = iconFor(li.__kind, li.getAttribute('aria-expanded') === 'true');
      }
      build(root, 1);
      if (o.checkboxes) items.slice().reverse().forEach(function (li) { if (li.hasAttribute('aria-expanded')) syncUp(li); });

      function visible() {
        return R.$$('li[role="treeitem"]', root).filter(function (li) {
          var p = li.parentElement.closest('li[role="treeitem"]');
          while (p) { if (p.getAttribute('aria-expanded') !== 'true') return false; p = p.parentElement.closest('li[role="treeitem"]'); }
          return true;
        });
      }
      var cur = R.$('li[aria-selected="true"]', root) || items[0];
      function focus(li) {
        if (!li) return;
        if (cur && cur !== li) cur.tabIndex = -1;
        cur = li; li.tabIndex = 0; li.focus({ preventScroll: false });
      }
      if (cur) { cur.tabIndex = 0; }
      // Make sure the first item reachable when selected is hidden in a collapsed branch
      if (cur && visible().indexOf(cur) < 0) { cur.tabIndex = -1; cur = visible()[0]; if (cur) cur.tabIndex = 0; }

      function setOpen(li, open) {
        if (!li.hasAttribute('aria-expanded')) return;
        var was = li.getAttribute('aria-expanded') === 'true';
        if (was === open) return;
        if (open && li.hasAttribute('data-lazy') && !R.emit(li, 'load', { item: li })) { /* consumer handles */ }
        li.setAttribute('aria-expanded', open ? 'true' : 'false');
        paintIcon(li);
        R.emit(li, open ? 'expand' : 'collapse', { item: li, label: labelOf(li) });
      }
      function labelOf(li) { var l = li.querySelector(':scope > .tree-row .tree-label'); return l ? l.textContent.trim() : ''; }
      function valueOf(li) { return li.getAttribute('data-value') || labelOf(li); }
      function select(li, additive) {
        if (o.select === 'none' || li.getAttribute('aria-disabled') === 'true') return;
        if (o.select !== 'multiple' || !additive) R.$$('li[aria-selected="true"]', root).forEach(function (x) { if (x !== li) x.setAttribute('aria-selected', 'false'); });
        var on = o.select === 'multiple' && additive ? li.getAttribute('aria-selected') !== 'true' : true;
        li.setAttribute('aria-selected', on ? 'true' : 'false');
        R.emit(root, 'select', { item: li, value: valueOf(li), label: labelOf(li), selected: R.$$('li[aria-selected="true"]', root).map(valueOf) });
      }
      // Checkbox tri-state
      function kids(li) { var g = li.querySelector(':scope > .tree-group > ul'); return g ? [].slice.call(g.children).filter(function (c) { return c.getAttribute('role') === 'treeitem'; }) : []; }
      function setDown(li, v) { li.setAttribute('data-checked', v ? 'true' : 'false'); kids(li).forEach(function (k) { setDown(k, v); }); }
      function syncUp(li) {
        var ks = kids(li); if (!ks.length) return;
        var t = ks.filter(function (k) { return k.getAttribute('data-checked') === 'true'; }).length;
        var m = ks.some(function (k) { return k.getAttribute('data-checked') === 'mixed'; });
        li.setAttribute('data-checked', t === ks.length ? 'true' : (t || m) ? 'mixed' : 'false');
      }
      function toggleCheck(li) {
        setDown(li, li.getAttribute('data-checked') !== 'true');
        var p = li.parentElement.closest('li[role="treeitem"]');
        while (p) { syncUp(p); p = p.parentElement.closest('li[role="treeitem"]'); }
        R.$$('li[role="treeitem"]', root).forEach(function (x) { x.setAttribute('aria-checked', x.getAttribute('data-checked') === 'mixed' ? 'mixed' : x.getAttribute('data-checked')); });
        R.emit(root, 'check', { item: li, checked: R.$$('li[data-checked="true"]', root).filter(function (x) { return !kids(x).length; }).map(valueOf) });
      }
      if (o.checkboxes) R.$$('li[role="treeitem"]', root).forEach(function (x) { x.setAttribute('aria-checked', x.getAttribute('data-checked')); });

      var offClick = R.on(root, 'click', '.tree-row', function (e, row) {
        var li = row.parentElement; if (!li || li.getAttribute('aria-disabled') === 'true') return;
        focus(li);
        if (e.target.closest('.tree-check')) { toggleCheck(li); return; }
        if (e.target.closest('.tree-toggle')) { setOpen(li, li.getAttribute('aria-expanded') !== 'true'); return; }
        if (li.hasAttribute('aria-expanded')) setOpen(li, li.getAttribute('aria-expanded') !== 'true');
        if (o.checkboxes && o.select === 'none') toggleCheck(li); else select(li, e.metaKey || e.ctrlKey);
      });
      var offKey = R.on(root, 'keydown', function (e) {
        var li = e.target.closest && e.target.closest('li[role="treeitem"]'); if (!li || !root.contains(li)) return;
        var vis = visible(), i = vis.indexOf(li), exp = li.getAttribute('aria-expanded');
        switch (e.key) {
          case 'ArrowDown': focus(vis[Math.min(vis.length - 1, i + 1)]); break;
          case 'ArrowUp': focus(vis[Math.max(0, i - 1)]); break;
          case 'Home': focus(vis[0]); break;
          case 'End': focus(vis[vis.length - 1]); break;
          case 'ArrowRight':
            if (exp === 'false') setOpen(li, true); else if (exp === 'true') focus(kids(li)[0]); else return; break;
          case 'ArrowLeft':
            if (exp === 'true') setOpen(li, false); else { var p = li.parentElement.closest('li[role="treeitem"]'); if (p) focus(p); else return; } break;
          case 'Enter': if (exp) setOpen(li, exp !== 'true'); select(li, e.metaKey || e.ctrlKey); break;
          case ' ': if (o.checkboxes) toggleCheck(li); else select(li, e.metaKey || e.ctrlKey); break;
          case '*': var par = li.parentElement; [].slice.call(par.children).forEach(function (s) { setOpen(s, true); }); break;
          default:
            if (e.key.length === 1 && /\S/.test(e.key)) {
              var k = e.key.toLowerCase(), order = vis.slice(i + 1).concat(vis.slice(0, i + 1));
              var hit = order.filter(function (x) { return labelOf(x).toLowerCase().indexOf(k) === 0; })[0];
              if (hit) focus(hit); else return;
            } else return;
        }
        e.preventDefault();
      });
      var offFocus = R.on(root, 'focusin', function (e) { var li = e.target.closest('li[role="treeitem"]'); if (li && li !== cur) { if (cur) cur.tabIndex = -1; cur = li; li.tabIndex = 0; } });

      var api = {
        expand: function (li) { setOpen(li, true); }, collapse: function (li) { setOpen(li, false); },
        expandAll: function () { items.forEach(function (li) { setOpen(li, true); }); },
        collapseAll: function () { items.forEach(function (li) { setOpen(li, false); }); },
        select: select,
        checked: function () { return R.$$('li[data-checked="true"]', root).filter(function (x) { return !kids(x).length; }).map(valueOf); }
      };
      root.ranjTree = api;
      return { destroy: function () { offClick(); offKey(); offFocus(); delete root.ranjTree; }, api: api };
    }
  });
})(window.Ranj);
