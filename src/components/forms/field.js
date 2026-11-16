/* Field — aria wiring (label/hint/error) and Ranj.validate(form) built on native constraint validation */
(function (R) {
  'use strict';
  var F = R._forms;
  var ERR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5.2M12 16.3v.2"/></svg>';
  var CONTROL = 'input:not([type="hidden"]):not([data-f-hidden]), select, textarea';
  var VISIBLE = '[data-field-control], .custom-select-trigger, .combobox-input, .multi-select-input, .tag-input-field, .otp-slot, [role="slider"], [role="switch"], ' + CONTROL;

  function labelOf(field) { return field.querySelector(':scope > .label, :scope > .field-row > .label, :scope > .field-label-block > .label, :scope > label:not(.checkbox):not(.radio):not(.switch):not(.radio-card):not(.checkbox-card)'); }
  function visibleControl(field) {
    var list = R.$$(VISIBLE, field).filter(function (c) {
      if (c.classList.contains('f-sr') || c.getAttribute('aria-hidden') === 'true' || c.hasAttribute('data-f-native')) return false;
      if (c.type === 'file' && c.closest('.dropzone')) return false;
      return true;
    });
    return list[0] || null;
  }
  function natives(root) {
    return R.$$(CONTROL, root).filter(function (c) { return !c.disabled && c.willValidate !== false && !c.closest('fieldset[disabled]'); });
  }

  function wire(field) {
    var label = labelOf(field), ctrl = visibleControl(field);
    var hint = field.querySelector(':scope > .field-hint, :scope > .field-label-block > .field-hint, :scope > .field-row ~ .field-hint');
    var err = field.querySelector('.field-error');
    var group = R.$$('input[type="checkbox"], input[type="radio"]', field).length > 1;
    if (label) R.ensureId(label, 'lbl');
    if (hint) R.ensureId(hint, 'hint');
    if (err) { R.ensureId(err, 'err'); err.setAttribute('aria-live', 'polite'); }
    if (group) {
      if (!field.hasAttribute('role')) field.setAttribute('role', 'group');
      if (label) field.setAttribute('aria-labelledby', label.id);
      return;
    }
    if (!ctrl) return;
    var labelable = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(ctrl.tagName);
    if (label) {
      if (label.tagName === 'LABEL' && labelable && !label.htmlFor && !label.contains(ctrl)) label.htmlFor = R.ensureId(ctrl, 'ctl');
      else if (!labelable && !ctrl.hasAttribute('aria-labelledby') && !ctrl.hasAttribute('aria-label')) ctrl.setAttribute('aria-labelledby', label.id);
      else if (ctrl.tagName === 'BUTTON' && !ctrl.hasAttribute('aria-labelledby')) {
        ctrl.setAttribute('aria-labelledby', label.id + ' ' + R.ensureId(ctrl, 'ctl'));
      }
    }
    var ids = (ctrl.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    [hint, err].forEach(function (x) { if (x && ids.indexOf(x.id) < 0) ids.push(x.id); });
    if (ids.length) ctrl.setAttribute('aria-describedby', ids.join(' '));
    var nat = natives(field)[0];
    if (label && nat && nat.required && !label.classList.contains('label-required')) label.setAttribute('data-required', '');
    if (err && err.textContent.trim()) { field.setAttribute('data-invalid', ''); ctrl.setAttribute('aria-invalid', 'true'); }
  }

  function message(c) {
    var v = c.validity, d = function (k) { return c.getAttribute('data-error-' + k) || c.getAttribute('data-error'); };
    var name = (c.getAttribute('data-label') || '').trim();
    if (v.valueMissing) return d('required') || (c.type === 'checkbox' ? 'Please check this box to continue.' : c.tagName === 'SELECT' ? 'Please choose an option.' : (name ? name + ' is required.' : 'This field is required.'));
    if (v.typeMismatch) return d('type') || (c.type === 'email' ? 'Enter a valid email, like name@company.com.' : c.type === 'url' ? 'Enter a full URL, like https://example.com.' : c.validationMessage);
    if (v.tooShort) return d('minlength') || 'Use at least ' + c.minLength + ' characters (you have ' + c.value.length + ').';
    if (v.tooLong) return d('maxlength') || 'Use ' + c.maxLength + ' characters or fewer.';
    if (v.rangeUnderflow) return d('min') || 'Must be ' + c.min + ' or more.';
    if (v.rangeOverflow) return d('max') || 'Must be ' + c.max + ' or less.';
    if (v.stepMismatch) return d('step') || c.validationMessage;
    if (v.patternMismatch) return d('pattern') || c.title || 'Please match the requested format.';
    if (v.customError) return c.validationMessage;
    return c.validationMessage;
  }

  function errorEl(field, create) {
    var e = field.querySelector('.field-error');
    if (!e && create) {
      e = document.createElement('p'); e.className = 'field-error';
      e.setAttribute('aria-live', 'polite'); R.ensureId(e, 'err');
      field.appendChild(e);
      var c = visibleControl(field);
      if (c) { var ids = (c.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean); ids.push(e.id); c.setAttribute('aria-describedby', ids.join(' ')); }
    }
    return e;
  }

  function setError(target, msg, opts) {
    opts = opts || {};
    var field = target.classList && target.classList.contains('field') ? target : target.closest('.field');
    var ctrls = field ? natives(field) : [target];
    var vis = field ? visibleControl(field) : target;
    if (msg) {
      if (field) {
        var wasInvalid = field.hasAttribute('data-invalid');
        field.setAttribute('data-invalid', '');
        var e = errorEl(field, true);
        if (e.__msg !== msg) { e.innerHTML = ERR_ICON + '<span>' + R.esc(msg) + '</span>'; e.__msg = msg; e.removeAttribute('data-live'); void e.offsetWidth; e.setAttribute('data-live', ''); }
        if (opts.shake !== false && (!wasInvalid || opts.shake)) F.shake(shakeTarget(field, vis));
      }
      ctrls.forEach(function (c) { c.setAttribute('aria-invalid', 'true'); });
      if (vis) vis.setAttribute('aria-invalid', 'true');
      var box = vis && vis.closest('.custom-select, .combobox, .multi-select, .tag-input, .otp, .date-picker, .time-picker');
      if (box) box.setAttribute('aria-invalid', 'true');
    } else {
      if (field) {
        field.removeAttribute('data-invalid');
        var e2 = errorEl(field, false); if (e2) { e2.innerHTML = ''; e2.__msg = ''; }
        R.$$('[aria-invalid="true"]', field).forEach(function (x) { x.removeAttribute('aria-invalid'); });
      } else ctrls.forEach(function (c) { c.removeAttribute('aria-invalid'); });
    }
  }
  function shakeTarget(field, vis) {
    if (!vis) return field;
    var n = vis;
    while (n.parentElement && n.parentElement !== field) n = n.parentElement;
    return n.parentElement === field ? n : vis;
  }

  /** Validate one field (or bare control). Returns true when valid. */
  function check(target, opts) {
    var field = target.classList && target.classList.contains('field') ? target : null;
    var ctrls = field ? natives(field) : [target];
    var msg = '';
    for (var i = 0; i < ctrls.length && !msg; i++) {
      var c = ctrls[i];
      var match = c.getAttribute('data-match');
      if (match) {
        var other = (c.form || document).querySelector(match);
        c.setCustomValidity(other && c.value && other.value !== c.value ? (c.getAttribute('data-error-match') || 'These don’t match.') : '');
      }
      if (c.checkValidity && !c.checkValidity()) msg = message(c);
    }
    if (!msg && field) {
      var req = field.querySelector('[data-required]:not(.label)');
      if (req) {
        var hid = R.$$('input[type="hidden"]', req).filter(function (h) { return h.value; });
        if (!hid.length) msg = req.getAttribute('data-error-required') || req.getAttribute('data-error') || 'This field is required.';
      }
    }
    setError(field || target, msg, opts);
    return !msg;
  }

  /** Ranj.validate(form, { focus: true, shake: true }) → boolean */
  R.validate = function (form, opts) {
    opts = opts || {};
    if (typeof form === 'string') form = document.querySelector(form);
    if (!form) return true;
    var ok = true, first = null;
    var fields = R.$$('.field', form);
    fields.forEach(function (f) {
      if (f.closest('fieldset[disabled]')) return;
      if (!natives(f).length && !f.querySelector('[data-required]:not(.label)')) return;
      if (!check(f, { shake: opts.shake })) { ok = false; if (!first) first = f; }
    });
    natives(form).forEach(function (c) {
      if (c.closest('.field')) return;
      if (!check(c, opts)) { ok = false; if (!first) first = c; }
    });
    if (!ok && opts.focus !== false && first) {
      var v = first.classList && first.classList.contains('field') ? visibleControl(first) : first;
      if (v && v.focus) try { v.focus({ preventScroll: false }); } catch (e) {}
    }
    form.setAttribute('data-validated', '');
    R.emit(form, ok ? 'valid' : 'invalid', {});
    return ok;
  };
  R.fieldError = function (el, msg) { setError(el, msg, { shake: true }); };
  R.validateField = function (el) { return check(el); };

  R.define('field', {
    selector: '.field',
    mount: function (field) { wire(field); }
  });

  R.define('form-validate', {
    selector: 'form[data-validate]',
    mount: function (form) {
      form.noValidate = true;
      var offs = [];
      offs.push(R.on(form, 'submit', function (e) {
        if (!R.validate(form)) { e.preventDefault(); e.stopImmediatePropagation(); }
      }));
      function live(e) {
        var field = e.target.closest && e.target.closest('.field');
        if (!field || !form.contains(field)) return;
        if (form.hasAttribute('data-validated') || field.hasAttribute('data-invalid') || (e.type === 'focusout' && field.hasAttribute('data-touched'))) check(field, { shake: false });
      }
      offs.push(R.on(form, 'input', function (e) { var f = e.target.closest && e.target.closest('.field'); if (f) { f.setAttribute('data-touched', ''); if (f.hasAttribute('data-invalid')) check(f, { shake: false }); } }));
      offs.push(R.on(form, 'change', live));
      offs.push(R.on(form, 'ranj:change', live));
      offs.push(R.on(form, 'focusout', function (e) {
        var f = e.target.closest && e.target.closest('.field');
        if (f && !f.contains(e.relatedTarget) && f.hasAttribute('data-touched')) check(f, { shake: false });
      }));
      offs.push(R.on(form, 'reset', function () {
        form.removeAttribute('data-validated');
        R.$$('.field', form).forEach(function (f) { f.removeAttribute('data-touched'); setError(f, ''); });
      }));
      return function () { offs.forEach(function (o) { o(); }); };
    }
  });
})(window.Ranj);
