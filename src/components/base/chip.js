/* Ranj UI — Chip: toggle, single-select groups, remove, and chip input */
(function (R) {
  'use strict';
  var X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  function removeChip(chip) {
    if (!chip || chip.hasAttribute('data-removing')) return;
    var label = (chip.getAttribute('data-value') || chip.textContent || '').trim();
    if (!R.emit(chip, 'remove', { value: label })) return; // cancelable
    var group = chip.parentElement;
    var next = chip.nextElementSibling || chip.previousElementSibling;
    var done = function () {
      chip.remove();
      if (group) R.emit(group, 'change', { values: values(group) });
      var f = next && (next.querySelector('.chip-remove, .badge-remove') || (next.matches('input') ? next : null));
      if (f) f.focus();
    };
    if (R.reducedMotion) return done();
    chip.setAttribute('data-removing', '');
    setTimeout(done, 200);
  }

  function values(group) {
    return R.$$('.chip, .badge', group).filter(function (c) {
      return !c.hasAttribute('aria-pressed') || c.getAttribute('aria-pressed') === 'true';
    }).map(function (c) { return (c.getAttribute('data-value') || c.textContent).trim(); });
  }

  function makeChip(text) {
    var c = document.createElement('span');
    c.className = 'chip chip-enter';
    c.setAttribute('data-value', text);
    c.innerHTML = R.esc(text) + '<button type="button" class="chip-remove" aria-label="Remove ' + R.esc(text) + '">' + X + '</button>';
    return c;
  }

  R.define('chip', {
    selector: '.chip-input',
    setup: function () {
      // Toggle chips (aria-pressed). In [data-single] groups only one can be on.
      R.on(document, 'click', '.chip[aria-pressed]', function (e, chip) {
        if (e.target.closest('.chip-remove')) return;
        var group = chip.closest('.chip-group');
        var on = chip.getAttribute('aria-pressed') !== 'true';
        if (group && group.hasAttribute('data-single')) {
          if (!on && group.hasAttribute('data-required')) return;
          R.$$('.chip[aria-pressed]', group).forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        }
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
        R.emit(chip, 'toggle', { pressed: on, value: (chip.getAttribute('data-value') || chip.textContent).trim() });
        if (group) R.emit(group, 'change', { values: values(group) });
      });
      R.on(document, 'click', '.chip-remove, .badge-remove', function (e, btn) {
        e.preventDefault(); e.stopPropagation();
        removeChip(btn.closest('.chip, .tag, .badge'));
      });
      R.on(document, 'keydown', '.chip[data-removable], .chip-input .chip', function (e, chip) {
        if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); removeChip(chip); }
      });
    },
    mount: function (el) {
      var input = R.$('input', el);
      if (!input) return;
      var offClick = R.on(el, 'click', function (e) { if (e.target === el) input.focus(); });
      var offKey = R.on(input, 'keydown', function (e) {
        var v = input.value.trim();
        if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && v) {
          if (e.key !== 'Tab') e.preventDefault(); else if (!v) return;
          var exists = R.$$('.chip', el).some(function (c) { return (c.getAttribute('data-value') || '').toLowerCase() === v.toLowerCase(); });
          if (!exists) {
            if (!R.emit(el, 'add', { value: v })) return;
            el.insertBefore(makeChip(v), input);
            R.emit(el, 'change', { values: values(el) });
          }
          input.value = '';
          if (e.key === 'Tab') e.preventDefault();
        } else if (e.key === 'Backspace' && !input.value) {
          var chips = R.$$('.chip', el), last = chips[chips.length - 1];
          if (last) removeChip(last);
        }
      });
      return function () { offClick(); offKey(); };
    }
  });
  R.chip = { remove: removeChip, values: values, create: makeChip };
})(window.Ranj);
