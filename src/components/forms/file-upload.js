/* File upload — dropzone (drag-over state, click/keyboard to browse), file list with previews, sizes, remove,
   simulated progress, accept / max-size / max-files validation. Keeps input.files in sync so forms submit natively. */
(function (R) {
  'use strict';
  var F = R._forms;

  function parseSize(s) {
    if (!s) return 0;
    var m = String(s).trim().match(/^([\d.]+)\s*(b|kb|mb|gb)?$/i); if (!m) return parseFloat(s) || 0;
    var n = parseFloat(m[1]), u = (m[2] || 'b').toLowerCase();
    return n * ({ b: 1, kb: 1024, mb: 1048576, gb: 1073741824 })[u];
  }
  function human(b) {
    if (b < 1024) return b + ' B';
    var u = ['KB', 'MB', 'GB'], i = -1;
    do { b /= 1024; i++; } while (b >= 1024 && i < 2);
    return (b >= 100 ? Math.round(b) : b.toFixed(1)) + ' ' + u[i];
  }
  function accepts(file, accept) {
    if (!accept) return true;
    var name = file.name.toLowerCase(), type = (file.type || '').toLowerCase();
    return accept.split(',').some(function (a) {
      a = a.trim().toLowerCase(); if (!a) return false;
      if (a[0] === '.') return name.slice(-a.length) === a;
      if (/\/\*$/.test(a)) return type.indexOf(a.slice(0, -1)) === 0;
      return type === a;
    });
  }
  function ext(name) { var m = /\.([a-z0-9]{1,5})$/i.exec(name); return m ? m[1].toUpperCase() : 'FILE'; }
  function kind(file) {
    var t = file.type || '';
    if (/^image\//.test(t)) return 'image';
    if (/pdf/.test(t) || /\.pdf$/i.test(file.name)) return 'pdf';
    if (/^video\//.test(t)) return 'video';
    if (/^audio\//.test(t)) return 'audio';
    if (/zip|compressed|tar/.test(t) || /\.(zip|rar|7z|gz)$/i.test(file.name)) return 'archive';
    if (/sheet|excel|csv/.test(t) || /\.(xlsx?|csv)$/i.test(file.name)) return 'sheet';
    return 'doc';
  }

  R.define('dropzone', {
    selector: '.dropzone',
    mount: function (el) {
      var input = el.querySelector('input[type="file"]');
      if (!input) { input = document.createElement('input'); input.type = 'file'; el.appendChild(input); }
      var o = R.opts(el, { maxSize: '', maxFiles: 0, simulate: false, list: '', accept: '' });
      var accept = o.accept || input.accept || '';
      var maxSize = parseSize(o.maxSize), multi = input.multiple, maxFiles = multi ? o.maxFiles : 1;
      var imageMode = el.classList.contains('dropzone-image');
      input.classList.add('f-sr'); input.tabIndex = -1; input.setAttribute('aria-hidden', 'true');
      if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
      el.setAttribute('role', 'button');
      if (!el.hasAttribute('aria-label')) {
        var t = el.querySelector('.dropzone-title');
        el.setAttribute('aria-label', (t ? t.textContent.trim() + '. ' : '') + 'Press Enter to browse' + (accept ? ' (' + accept + ')' : '') + '.');
      }
      var list = o.list ? document.querySelector(o.list) : null;
      var ownList = false;
      if (!list && !imageMode) { list = document.createElement('ul'); list.className = 'file-list'; ownList = true; el.insertAdjacentElement('afterend', list); }
      if (list) { list.setAttribute('aria-live', 'polite'); list.setAttribute('aria-label', 'Selected files'); }
      var preview = imageMode ? (el.querySelector('.dropzone-preview') || (function () { var p = document.createElement('div'); p.className = 'dropzone-preview'; el.appendChild(p); return p; })()) : null;
      var entries = [];   // { file, url, row, pct, status, error, timer }
      var dragDepth = 0;

      function syncInput() {
        try {
          var dt = new DataTransfer();
          entries.forEach(function (e) { if (!e.error) dt.items.add(e.file); });
          input.files = dt.files;
        } catch (err) {}
        el.toggleAttribute('data-has-files', entries.some(function (e) { return !e.error; }));
        R.emit(el, 'change', { files: entries.filter(function (e) { return !e.error; }).map(function (e) { return e.file; }) });
      }
      function rowHTML(e) {
        var f = e.file, k = kind(f);
        var thumb = e.url ? '<img src="' + e.url + '" alt="">' : '<span class="file-ext" data-kind="' + k + '">' + R.esc(ext(f.name)) + '</span>';
        return '<div class="file-thumb">' + thumb + '</div>' +
          '<div class="file-main"><div class="file-top"><span class="file-name" title="' + R.esc(f.name) + '">' + R.esc(f.name) + '</span>' +
          '<span class="file-size">' + human(f.size) + '</span></div>' +
          (e.error ? '<div class="file-error">' + R.esc(e.error) + '</div>' :
            '<div class="file-progress"' + (o.simulate ? '' : ' hidden') + '><div class="file-bar"><span></span></div><span class="file-pct">0%</span></div>') +
          '</div>' +
          '<button type="button" class="file-remove" aria-label="Remove ' + R.esc(f.name) + '">' + F.icons.x + '</button>';
      }
      function progress(e, pct, status) {
        e.pct = pct; if (status) e.status = status;
        if (!e.row) return;
        var bar = e.row.querySelector('.file-bar span'), txt = e.row.querySelector('.file-pct'), wrap = e.row.querySelector('.file-progress');
        if (wrap) wrap.hidden = false;
        if (bar) bar.style.transform = 'scaleX(' + pct / 100 + ')';
        if (txt) txt.textContent = e.status === 'done' ? 'Uploaded' : Math.round(pct) + '%';
        e.row.setAttribute('data-status', e.status || 'uploading');
      }
      function simulate(e) {
        var pct = 0;
        e.status = 'uploading';
        e.timer = setInterval(function () {
          pct = Math.min(100, pct + Math.random() * 18 + 4 * (1 + 1e6 / Math.max(e.file.size, 2e5)) / 3);
          if (pct >= 100) { clearInterval(e.timer); progress(e, 100, 'done'); R.emit(el, 'uploaded', { file: e.file }); }
          else progress(e, pct, 'uploading');
        }, R.reducedMotion ? 30 : 220);
      }
      function add(files) {
        var arr = [].slice.call(files || []);
        if (!multi) { clear(true); arr = arr.slice(0, 1); }
        arr.forEach(function (f) {
          var e = { file: f, url: null, pct: 0, status: 'ready', error: '' };
          var valid = entries.filter(function (x) { return !x.error; }).length;
          if (!accepts(f, accept)) e.error = 'File type not allowed' + (accept ? ' — use ' + accept.replace(/,/g, ', ') : '');
          else if (maxSize && f.size > maxSize) e.error = 'Too large — max ' + human(maxSize);
          else if (maxFiles && valid >= maxFiles) e.error = 'Limit reached — up to ' + maxFiles + ' files';
          else if (entries.some(function (x) { return !x.error && x.file.name === f.name && x.file.size === f.size; })) e.error = 'Already added';
          if (!e.error && /^image\//.test(f.type) && window.URL && URL.createObjectURL) e.url = URL.createObjectURL(f);
          if (e.error) R.emit(el, 'reject', { file: f, reason: e.error });
          entries.push(e);
          if (list) {
            var li = document.createElement('li'); li.className = 'file-item'; if (e.error) li.setAttribute('data-error', '');
            li.innerHTML = rowHTML(e); e.row = li; list.appendChild(li);
          }
          if (imageMode && !e.error) { preview.innerHTML = '<img src="' + e.url + '" alt="">'; el.setAttribute('data-has-preview', ''); }
          if (!e.error && o.simulate) simulate(e);
        });
        if (arr.some(function (f) { return entries.filter(function (x) { return x.file === f && x.error; }).length; })) F.shake(el);
        syncInput();
      }
      function removeEntry(e) {
        var i = entries.indexOf(e); if (i < 0) return;
        clearInterval(e.timer);
        if (e.url) URL.revokeObjectURL(e.url);
        entries.splice(i, 1);
        if (e.row) {
          var row = e.row;
          if (R.reducedMotion) row.remove();
          else { row.style.height = row.offsetHeight + 'px'; row.setAttribute('data-leaving', ''); void row.offsetHeight; row.style.height = '0px'; setTimeout(function () { row.remove(); }, 260); }
        }
        if (imageMode) { preview.innerHTML = ''; el.removeAttribute('data-has-preview'); }
        syncInput();
      }
      function clear(silent) {
        entries.slice().forEach(function (e) { clearInterval(e.timer); if (e.url) URL.revokeObjectURL(e.url); if (e.row) e.row.remove(); });
        entries = [];
        if (imageMode) { preview.innerHTML = ''; el.removeAttribute('data-has-preview'); }
        if (!silent) syncInput();
      }
      function browse() { input.value = ''; input.click(); }

      var offs = [
        R.on(el, 'click', function (e) { if (e.target === input || e.target.closest('a, .dropzone-clear')) return; browse(); }),
        R.on(el, 'keydown', function (e) { if (e.target === el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); browse(); } }),
        R.on(input, 'change', function () { if (input.files && input.files.length && !input.__syncing) { var fl = [].slice.call(input.files); add(fl); } }),
        R.on(el, 'dragenter', function (e) { e.preventDefault(); dragDepth++; el.setAttribute('data-dragover', ''); }),
        R.on(el, 'dragover', function (e) { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; }),
        R.on(el, 'dragleave', function () { if (--dragDepth <= 0) { dragDepth = 0; el.removeAttribute('data-dragover'); } }),
        R.on(el, 'drop', function (e) { e.preventDefault(); dragDepth = 0; el.removeAttribute('data-dragover'); if (e.dataTransfer && e.dataTransfer.files.length) add(e.dataTransfer.files); })
      ];
      if (list) offs.push(R.on(list, 'click', '.file-remove', function (ev, b) { var row = b.closest('.file-item'); var en = entries.filter(function (x) { return x.row === row; })[0]; if (en) removeEntry(en); el.focus(); }));
      var clr = el.querySelector('.dropzone-clear');
      if (clr) offs.push(R.on(clr, 'click', function (ev) { ev.stopPropagation(); clear(); }));
      if (input.form) offs.push(R.on(input.form, 'reset', function () { clear(); }));

      return {
        destroy: function () { offs.forEach(function (f) { f(); }); clear(true); if (ownList) list.remove(); },
        get files() { return entries.filter(function (e) { return !e.error; }).map(function (e) { return e.file; }); },
        add: add, clear: function () { clear(); },
        remove: function (file) { var e = entries.filter(function (x) { return x.file === file; })[0]; if (e) removeEntry(e); },
        progress: function (file, pct, status) { var e = entries.filter(function (x) { return x.file === file; })[0]; if (e) progress(e, pct, status || (pct >= 100 ? 'done' : 'uploading')); }
      };
    }
  });

  /** Ranj.fileUpload(el) → { files, add(files), remove(file), clear(), progress(file, pct, status) } */
  R.fileUpload = function (el) { if (typeof el === 'string') el = document.querySelector(el); return R.instance(el, 'dropzone'); };
  R.formatBytes = human;
})(window.Ranj);
