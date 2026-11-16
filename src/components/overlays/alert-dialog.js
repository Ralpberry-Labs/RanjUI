/*!
 * Ranj UI — alert dialog helpers.
 * Ranj.confirm({ title, description, confirmText, cancelText, danger, icon, onConfirm }) → Promise<boolean>
 * Ranj.prompt({ title, description, label, placeholder, defaultValue, type, confirmText, validate }) → Promise<string|null>
 */
(function (R) {
  'use strict';
  var K = R.__ov, d = document;
  var ICONS = {
    danger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    question: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
  };

  function build(o, kind) {
    var ov = d.createElement('div');
    ov.className = 'dialog-overlay';
    ov.id = R.uid('confirm');
    var icon = o.icon === false ? '' : (o.icon || (o.danger ? ICONS.danger : kind === 'prompt' ? ICONS.edit : ICONS.question));
    var field = '';
    if (kind === 'prompt') {
      var fid = R.uid('prompt');
      field = '<div class="alert-dialog-field">' + (o.label ? '<label class="label" for="' + fid + '">' + R.esc(o.label) + '</label>' : '') +
        '<input class="input" id="' + fid + '" type="' + R.esc(o.type || 'text') + '" autocomplete="off" placeholder="' + R.esc(o.placeholder || '') + '" value="' + R.esc(o.defaultValue || '') + '" data-autofocus>' +
        '<div class="alert-dialog-error" role="alert"></div></div>';
    }
    ov.innerHTML =
      '<div class="dialog alert-dialog' + (o.danger ? ' alert-dialog-danger' : '') + (o.centered ? ' alert-dialog-centered' : '') + '" role="alertdialog">' +
        '<form class="alert-dialog-form" novalidate>' +
          '<div class="alert-dialog-body">' + (icon ? '<div class="alert-dialog-media">' + icon + '</div>' : '') +
            '<div class="alert-dialog-text"><h2 class="alert-dialog-title">' + (o.html ? o.title : R.esc(o.title || 'Are you sure?')) + '</h2>' +
            (o.description ? '<p class="alert-dialog-description">' + (o.html ? o.description : R.esc(o.description)) + '</p>' : '') + field + '</div>' +
          '</div>' +
          '<div class="alert-dialog-footer">' +
            (o.cancelText === false ? '' : '<button type="button" class="btn btn-outline" data-act="cancel"' + (kind === 'confirm' && o.danger ? ' data-autofocus' : '') + '>' + R.esc(o.cancelText || 'Cancel') + '</button>') +
            '<button type="submit" class="btn' + (o.danger ? ' btn-destructive' : '') + '" data-act="ok"' + (kind === 'confirm' && !o.danger ? ' data-autofocus' : '') + '>' + R.esc(o.confirmText || (kind === 'prompt' ? 'Save' : 'Continue')) + '</button>' +
          '</div>' +
        '</form>' +
      '</div>';
    d.body.appendChild(ov);
    return ov;
  }

  function run(o, kind) {
    if (typeof o === 'string') o = { title: o };
    o = o || {};
    return new Promise(function (resolve) {
      var ov = build(o, kind), form = ov.querySelector('form'), ok = ov.querySelector('[data-act="ok"]');
      var input = ov.querySelector('.input'), err = ov.querySelector('.alert-dialog-error'), result = kind === 'prompt' ? null : false, busy = false;
      function finish(v) { result = v; R.dialog.close(ov, { reason: 'button', force: true }); }
      ov.addEventListener('ranj:beforeclose', function (e) { if (busy) e.preventDefault(); });
      ov.addEventListener('ranj:close', function () {
        resolve(result);
        setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 600);
      }, { once: true });
      ov.querySelector('[data-act="cancel"]') && ov.querySelector('[data-act="cancel"]').addEventListener('click', function () { if (!busy) finish(kind === 'prompt' ? null : false); });
      if (input) input.addEventListener('input', function () { err.textContent = ''; input.parentNode.removeAttribute('data-invalid'); input.removeAttribute('aria-invalid'); });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (busy) return;
        var val = input ? input.value : true;
        if (input && o.validate) {
          var msg = o.validate(val);
          if (msg !== true && msg !== undefined && msg !== null && msg !== '') {
            err.textContent = typeof msg === 'string' ? msg : 'Invalid value';
            input.parentNode.setAttribute('data-invalid', ''); input.setAttribute('aria-invalid', 'true'); input.focus();
            return;
          }
        }
        if (o.onConfirm) {
          var p = o.onConfirm(val);
          if (p && p.then) {
            busy = true; ok.classList.add('btn-loading'); ok.setAttribute('aria-busy', 'true'); ok.disabled = true;
            p.then(function () { busy = false; finish(kind === 'prompt' ? val : true); }, function (er) {
              busy = false; ok.classList.remove('btn-loading'); ok.disabled = false; ok.removeAttribute('aria-busy');
              if (err) err.textContent = (er && er.message) || 'Something went wrong';
            });
            return;
          }
        }
        finish(kind === 'prompt' ? val : true);
      });
      requestAnimationFrame(function () { R.dialog.open(ov); });
    });
  }

  R.confirm = function (o) { return run(o, 'confirm'); };
  R.prompt = function (o) { return run(o, 'prompt'); };
})(window.Ranj);
