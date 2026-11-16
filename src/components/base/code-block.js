/* Ranj UI — Code block: copy, line numbers, highlighted lines, tabs, tiny highlighter */
(function (R) {
  'use strict';

  function ranges(str) {
    var set = {};
    String(str || '').split(',').forEach(function (part) {
      part = part.trim(); if (!part) return;
      var m = part.split('-'), a = parseInt(m[0], 10), b = parseInt(m[1] || m[0], 10);
      for (var i = a; i <= b; i++) set[i] = true;
    });
    return set;
  }

  /* Small, safe highlighter for js/ts/html/css/bash/json. Works line by line on escaped text. */
  var KW = /\b(const|let|var|function|return|if|else|for|while|import|from|export|default|new|class|extends|async|await|try|catch|throw|typeof|interface|type|true|false|null|undefined|this)\b/g;
  function hl(line, lang) {
    var s = R.esc(line), out = [];
    function stash(cls) { return function (m) { out.push('<span class="tok-' + cls + '">' + m + '</span>'); return '\u0000' + String.fromCharCode(0xE000 + out.length - 1); }; }
    if (lang === 'html' || lang === 'xml' || lang === 'svg') {
      s = s.replace(/&lt;!--[\s\S]*?--&gt;/g, stash('c'))
        .replace(/(&lt;\/?)([\w-]+)([^]*?)(\/?&gt;)/g, function (m, a, tag, rest, b) {
          rest = rest.replace(/([\w:@.-]+)(=)(&quot;[^]*?&quot;|&#39;[^]*?&#39;)/g, function (mm, n, eq, v) { return stash('a')(n) + eq + stash('s')(v); });
          return stash('p')(a) + stash('t')(tag) + rest + stash('p')(b);
        });
    } else if (lang === 'css' || lang === 'scss') {
      s = s.replace(/\/\*[^]*?\*\//g, stash('c'))
        .replace(/(&quot;[^]*?&quot;|&#39;[^]*?&#39;)/g, stash('s'))
        .replace(/([\w-]+)(?=\s*:[^:])/g, stash('a'))
        .replace(/#[0-9a-fA-F]{3,8}\b|\b\d+(\.\d+)?(px|rem|em|%|ms|s|deg|vh|vw|fr)?\b/g, stash('n'))
        .replace(/([.#][\w-]+)(?=[^;]*\{)/g, stash('t'));
    } else if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
      s = s.replace(/^(\$|&gt;)\s/, stash('prompt'))
        .replace(/(&quot;[^]*?&quot;|&#39;[^]*?&#39;)/g, stash('s'))
        .replace(/(^|\s)#.*$/g, stash('c'))
        .replace(/(^|\s)(--?[\w-]+)/g, function (m, sp, f) { return sp + stash('a')(f); })
        .replace(/^(\s*)(npm|npx|pnpm|yarn|bun|git|cd|node|curl|brew)\b/, function (m, sp, c) { return sp + stash('f')(c); });
    } else {
      s = s.replace(/(&quot;[^]*?&quot;|&#39;[^]*?&#39;|`[^`]*`)/g, stash('s'))
        .replace(/\/\/.*$|\/\*[^]*?\*\//g, stash('c'))
        .replace(KW, stash('k'))
        .replace(/\b\d+(\.\d+)?\b/g, stash('n'))
        .replace(/\b([a-zA-Z_$][\w$]*)(?=\()/g, stash('f'));
    }
    // Resolve stashed tokens (they may nest: resolve repeatedly)
    for (var i = 0; i < 4 && s.indexOf('\u0000') > -1; i++) s = s.replace(/\u0000([\uE000-\uF8FF])/g, function (m, c) { return out[c.charCodeAt(0) - 0xE000]; });
    return s;
  }

  function build(el) {
    R.$$('pre > code', el).forEach(function (code) {
      if (code.__lined) return; code.__lined = true;
      var lang = code.getAttribute('data-lang') || el.getAttribute('data-lang');
      var plain = !code.children.length;
      var raw = plain ? code.textContent : code.innerHTML;
      raw = raw.replace(/^\n/, '').replace(/\s+$/, '');
      var lines = raw.split('\n');
      var src = el.querySelector('[data-code-panel]') ? code.closest('[data-code-panel]') || el : el;
      var hlSet = ranges(src.getAttribute('data-highlight') || el.getAttribute('data-highlight'));
      var addSet = ranges(src.getAttribute('data-added') || el.getAttribute('data-added'));
      var delSet = ranges(src.getAttribute('data-removed') || el.getAttribute('data-removed'));
      code.innerHTML = lines.map(function (l, i) {
        var n = i + 1, cls = 'line' + (hlSet[n] ? ' hl' : '') + (addSet[n] ? ' add' : '') + (delSet[n] ? ' del' : '');
        var html = plain ? (lang ? hl(l, lang) : R.esc(l)) : l;
        return '<span class="' + cls + '">' + (html || '​') + '</span>';
      }).join('');
      code.setAttribute('data-raw', lines.map(function (l) { return plain ? l : l.replace(/<[^>]+>/g, ''); }).join('\n'));
    });
  }

  function textOf(el) {
    var panel = R.$('[data-code-panel]:not([hidden])', el) || el;
    var code = R.$('pre > code', panel) || R.$('code', panel);
    if (!code) return '';
    var raw = code.getAttribute('data-raw');
    if (raw != null) {
      var txt = document.createElement('textarea'); txt.innerHTML = raw; raw = txt.value;
      return raw.split('\n').map(function (l) { return l.replace(/^\$\s/, ''); }).join('\n');
    }
    return code.textContent.replace(/^\$\s/gm, '');
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext !== false) return navigator.clipboard.writeText(text);
    return new Promise(function (res) {
      var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove(); res();
    });
  }

  R.copy = R.copy || copyText;

  R.define('code-block', {
    selector: '.code-block, .code-inline',
    setup: function () {
      R.on(document, 'click', '.code-block-copy', function (e, btn) {
        var host = btn.closest('.code-block, .code-inline');
        var text = btn.getAttribute('data-copy-text') || (host ? textOf(host) : '');
        var done = function () {
          btn.setAttribute('data-copied', '');
          var label = btn.querySelector('.code-block-copy-label');
          if (label) { label.__old = label.__old || label.textContent; label.textContent = btn.getAttribute('data-copied-label') || 'Copied'; }
          var live = btn.getAttribute('aria-label'); btn.setAttribute('aria-label', 'Copied');
          clearTimeout(btn.__t);
          btn.__t = setTimeout(function () { btn.removeAttribute('data-copied'); if (label) label.textContent = label.__old; if (live) btn.setAttribute('aria-label', live); }, 1600);
          if (host) R.emit(host, 'copy', { text: text });
        };
        copyText(text).then(done, done);
      });
    },
    mount: function (el) {
      if (el.classList.contains('code-inline')) return;
      build(el);
      var tabs = R.$$('.code-block-tabs [data-code-tab]', el);
      if (!tabs.length) return;
      var list = R.$('.code-block-tabs', el);
      list.setAttribute('role', 'tablist');
      function select(btn, focus) {
        var key = btn.getAttribute('data-code-tab');
        tabs.forEach(function (t) {
          var on = t === btn;
          t.setAttribute('role', 'tab'); t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
        });
        R.$$('[data-code-panel]', el).forEach(function (p) { p.hidden = p.getAttribute('data-code-panel') !== key; p.setAttribute('role', 'tabpanel'); });
        if (focus) btn.focus();
        R.emit(el, 'change', { tab: key });
      }
      var initial = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
      select(initial);
      var off1 = R.on(list, 'click', '[data-code-tab]', function (e, btn) { select(btn); });
      var off2 = R.on(list, 'keydown', function (e) {
        var i = tabs.indexOf(document.activeElement); if (i < 0) return;
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (n == null) return; e.preventDefault(); select(tabs[(n + tabs.length) % tabs.length], true);
      });
      return function () { off1(); off2(); };
    }
  });
  R.highlight = hl;
})(window.Ranj);
