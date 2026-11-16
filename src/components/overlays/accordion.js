/*!
 * Ranj UI — accordion + collapsible.
 * Accordion: .accordion > .accordion-item[data-state] > .accordion-trigger + .accordion-content > .accordion-body
 *   Single by default (opening one closes others); data-multiple (v1) or data-type="multiple" for many.
 *   data-collapsible="false" keeps one item always open. ↑ ↓ Home End move between triggers.
 * Collapsible: .collapsible[data-state] > .collapsible-trigger + .collapsible-content
 * Events: ranj:change { item, open } on the accordion / collapsible. API: Ranj.accordion.toggle(item, open?), Ranj.collapsible.toggle(el, open?)
 */
(function (R) {
  'use strict';
  var d = document;

  function wrapInner(content, cls) {
    var kids = Array.prototype.filter.call(content.childNodes, function (n) { return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()); });
    if (kids.length === 1 && kids[0].nodeType === 1) return kids[0];
    var w = d.createElement('div'); w.className = cls;
    while (content.firstChild) w.appendChild(content.firstChild);
    content.appendChild(w);
    return w;
  }
  function setOpen(item, trigger, content, open) {
    item.setAttribute('data-state', open ? 'open' : 'closed');
    trigger.setAttribute('aria-expanded', String(open));
    if (content) { content.inert = !open; if (!open) content.setAttribute('aria-hidden', 'true'); else content.removeAttribute('aria-hidden'); }
  }

  R.define('accordion', {
    selector: '.accordion',
    mount: function (acc) {
      var multiple = acc.hasAttribute('data-multiple') || acc.getAttribute('data-type') === 'multiple';
      var collapsible = acc.getAttribute('data-collapsible') !== 'false';
      function items() { return R.$$('.accordion-item', acc).filter(function (i) { return i.closest('.accordion') === acc; }); }
      function parts(item) {
        return { t: item.querySelector(':scope > .accordion-trigger') || item.querySelector('.accordion-trigger'), c: item.querySelector(':scope > .accordion-content') };
      }
      items().forEach(function (item) {
        var p = parts(item); if (!p.t) return;
        if (p.t.tagName === 'BUTTON' && !p.t.getAttribute('type')) p.t.setAttribute('type', 'button');
        if (p.c) {
          wrapInner(p.c, 'accordion-body');
          p.c.setAttribute('role', 'region');
          p.t.setAttribute('aria-controls', R.ensureId(p.c, 'acc'));
          p.c.setAttribute('aria-labelledby', R.ensureId(p.t, 'acc-t'));
        }
        setOpen(item, p.t, p.c, item.getAttribute('data-state') === 'open' || item.hasAttribute('open'));
      });
      function toggle(item, force) {
        var p = parts(item); if (!p.t) return;
        var open = force != null ? !!force : item.getAttribute('data-state') !== 'open';
        if (!open && !collapsible && !multiple) return;
        if (open && !multiple) items().forEach(function (o) { if (o !== item && o.getAttribute('data-state') === 'open') { var q = parts(o); setOpen(o, q.t, q.c, false); R.emit(acc, 'change', { item: o, open: false }); } });
        setOpen(item, p.t, p.c, open);
        R.emit(acc, 'change', { item: item, open: open, value: item.getAttribute('data-value') });
      }
      var offs = [
        R.on(acc, 'click', '.accordion-trigger', function (e, t) { var item = t.closest('.accordion-item'); if (item && item.closest('.accordion') === acc) toggle(item); }),
        R.on(acc, 'keydown', '.accordion-trigger', function (e, t) {
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].indexOf(e.key) < 0) return;
          var ts = items().map(function (i) { return parts(i).t; }).filter(function (x) { return x && !x.disabled; });
          var i = ts.indexOf(t); if (i < 0) return;
          e.preventDefault();
          var n = e.key === 'ArrowDown' ? (i + 1) % ts.length : e.key === 'ArrowUp' ? (i - 1 + ts.length) % ts.length : e.key === 'Home' ? 0 : ts.length - 1;
          ts[n].focus();
        })
      ];
      acc.__acc = { toggle: toggle };
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  R.define('collapsible', {
    selector: '.collapsible',
    mount: function (el) {
      var t = R.$$('.collapsible-trigger', el).filter(function (x) { return x.closest('.collapsible') === el; })[0];
      var c = R.$$('.collapsible-content', el).filter(function (x) { return x.closest('.collapsible') === el; })[0];
      if (!t) return;
      if (t.tagName === 'BUTTON' && !t.getAttribute('type')) t.setAttribute('type', 'button');
      if (!/^(BUTTON|A|SUMMARY)$/.test(t.tagName) && !t.hasAttribute('tabindex')) { t.setAttribute('tabindex', '0'); t.setAttribute('role', 'button'); }
      if (c) { wrapInner(c, 'collapsible-inner'); t.setAttribute('aria-controls', R.ensureId(c, 'col')); }
      setOpen(el, t, c, el.getAttribute('data-state') === 'open');
      function toggle(force) {
        var open = force != null ? !!force : el.getAttribute('data-state') !== 'open';
        setOpen(el, t, c, open);
        R.emit(el, 'change', { open: open });
      }
      var offs = [
        R.on(t, 'click', function (e) { if (t.tagName === 'A') e.preventDefault(); toggle(); }),
        R.on(t, 'keydown', function (e) { if (t.getAttribute('role') === 'button' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggle(); } })
      ];
      el.__col = { toggle: toggle };
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  R.accordion = { toggle: function (item, open) { item = typeof item === 'string' ? d.querySelector(item) : item; var acc = item && item.closest('.accordion'); if (acc && acc.__acc) acc.__acc.toggle(item, open); } };
  R.collapsible = { toggle: function (el, open) { el = typeof el === 'string' ? d.querySelector(el) : el; if (el && el.__col) el.__col.toggle(open); } };
})(window.Ranj);
