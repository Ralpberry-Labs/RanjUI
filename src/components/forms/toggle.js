/* Toggle (aria-pressed button) + Toggle group (single | multiple, roving tabindex, hidden input) */
(function (R) {
  'use strict';
  var F = R._forms;

  function pressed(t) { return t.getAttribute('aria-pressed') === 'true'; }
  function setPressed(t, on) { t.setAttribute('aria-pressed', String(on)); t.classList.toggle('active', on); t.setAttribute('data-state', on ? 'on' : 'off'); }
  function valueOf(t) { return t.getAttribute('data-value') || t.getAttribute('value') || t.getAttribute('aria-label') || t.textContent.trim(); }

  R.define('toggle', {
    selector: '.toggle',
    setup: function () {
      R.on(document, 'click', '.toggle', function (e, t) {
        if (t.disabled || t.getAttribute('aria-disabled') === 'true') return;
        var group = t.closest('.toggle-group');
        if (group && group.__ranjGroup) { group.__ranjGroup(t); return; }
        setPressed(t, !pressed(t));
        R.emit(t, 'change', { pressed: pressed(t), value: pressed(t) });
      });
    },
    mount: function (t) {
      if (t.tagName === 'BUTTON' && !t.hasAttribute('type')) t.type = 'button';
      if (!t.hasAttribute('aria-pressed')) setPressed(t, t.classList.contains('active') || t.getAttribute('data-state') === 'on');
      else t.setAttribute('data-state', pressed(t) ? 'on' : 'off');
    }
  });

  R.define('toggle-group', {
    selector: '.toggle-group',
    mount: function (g) {
      var multi = g.hasAttribute('data-multiple');
      var required = g.hasAttribute('data-required-one');   // single: can't deselect the last one
      var o = R.opts(g, { name: '', orientation: g.classList.contains('toggle-group-vertical') ? 'vertical' : 'horizontal' });
      if (!g.hasAttribute('role')) g.setAttribute('role', 'group');
      var hidden = F.hidden(g, o.name || null);
      function items() { return R.$$('.toggle', g); }
      function enabled() { return items().filter(function (t) { return !t.disabled; }); }
      function value() { var v = items().filter(pressed).map(valueOf); return multi ? v : (v[0] || ''); }
      function sync() {
        var list = enabled(), on = list.filter(pressed)[0] || list[0];
        list.forEach(function (t) { t.tabIndex = t === on ? 0 : -1; });
        items().forEach(function (t) { if (t.disabled) t.tabIndex = -1; });
        if (hidden) hidden.value = multi ? value().join(',') : value();
      }
      g.__ranjGroup = function (t) {
        var was = pressed(t);
        if (multi) setPressed(t, !was);
        else {
          if (was && required) return;
          items().forEach(function (x) { setPressed(x, false); });
          setPressed(t, !was);
        }
        sync();
        t.tabIndex = 0; items().forEach(function (x) { if (x !== t) x.tabIndex = -1; });
        R.emit(g, 'change', { value: value() });
      };
      var offRov = R.roving(g, '.toggle', { orientation: o.orientation, onMove: function (t) { items().forEach(function (x) { x.tabIndex = x === t ? 0 : -1; }); } });
      sync();
      return {
        destroy: function () { offRov(); g.__ranjGroup = null; },
        get value() { return value(); },
        set value(v) { var arr = [].concat(v); items().forEach(function (t) { setPressed(t, arr.indexOf(valueOf(t)) > -1); }); sync(); }
      };
    }
  });
})(window.Ranj);
