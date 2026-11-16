/* Ranj UI — Kanban: drag cards between columns with pointer events (mouse, touch, pen) or the keyboard.
 * Emits ranj:move { id, card, from, to, index, fromIndex } on the board (cancelable). */
(function (R) {
  'use strict';
  R.define('kanban', {
    selector: '.kanban[data-kanban], .kanban:not([data-kanban="false"])',
    mount: function (board) {
      var offs = [], drag = null, live = document.createElement('div');
      live.className = 'kanban-sr'; live.setAttribute('aria-live', 'assertive'); board.appendChild(live);
      function lists() { return R.$$('.kanban-list', board); }
      function cards(list) { return R.$$(':scope > .kanban-card', list); }
      function colOf(list) { var c = list.closest('.kanban-column'); return c ? (c.getAttribute('data-column') || (c.querySelector('.kanban-title, h3') || {}).textContent || '') : ''; }
      function nameOf(card) { var t = card.querySelector('.kanban-card-title'); return (t ? t.textContent : card.textContent).trim().slice(0, 60); }
      function counts() {
        lists().forEach(function (l) {
          var col = l.closest('.kanban-column'), c = col && col.querySelector('.kanban-count'), n = cards(l).length;
          if (c) { if (c.textContent !== String(n)) c.textContent = n; var lim = +(col.getAttribute('data-limit') || 0); c.classList.toggle('is-over-limit', lim > 0 && n > lim); }
          l.classList.toggle('is-empty', !n && !l.querySelector('.kanban-placeholder'));
        });
      }
      function prep() {
        R.$$('.kanban-card', board).forEach(function (c) {
          if (!c.hasAttribute('tabindex')) c.tabIndex = 0;
          c.setAttribute('aria-roledescription', 'Draggable card');
          if (!c.hasAttribute('aria-grabbed')) c.setAttribute('aria-grabbed', 'false');
        });
        lists().forEach(function (l) { l.setAttribute('role', 'list'); });
        counts();
      }
      prep();

      /* FLIP helper for smooth reflow of siblings */
      function snapshot(els) { var m = new Map(); els.forEach(function (e) { m.set(e, e.getBoundingClientRect()); }); return m; }
      function flip(before) {
        if (R.reducedMotion) return;
        before.forEach(function (r, e) {
          if (!e.isConnected || e.classList.contains('is-source')) return;
          var n = e.getBoundingClientRect(), dx = r.left - n.left, dy = r.top - n.top;
          if (!dx && !dy) return;
          e.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,0,0,1)' });
        });
      }
      function allCards() { return R.$$('.kanban-card, .kanban-placeholder', board); }

      function commit(card, fromList, fromIndex) {
        var toList = card.parentElement, index = cards(toList).indexOf(card);
        if (toList === fromList && index === fromIndex) return true;
        var ok = R.emit(board, 'move', { id: card.getAttribute('data-id') || null, card: card, from: colOf(fromList), to: colOf(toList), index: index, fromIndex: fromIndex });
        if (!ok) { var ref = cards(fromList)[fromIndex]; fromList.insertBefore(card, ref && ref !== card ? ref : null); }
        counts();
        return ok;
      }

      /* ---------- Pointer drag ---------- */
      offs.push(R.on(board, 'pointerdown', '.kanban-card', function (e, card) {
        if (e.button !== 0 || e.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
        drag = { card: card, x0: e.clientX, y0: e.clientY, id: e.pointerId, started: false, type: e.pointerType };
        if (e.pointerType === 'touch') {
          // long-press on touch so the board can still scroll
          drag.timer = setTimeout(function () { if (drag && !drag.started) start(e.clientX, e.clientY); }, 220);
        }
      }));
      function start(x, y) {
        var card = drag.card, r = card.getBoundingClientRect();
        drag.started = true;
        drag.fromList = card.parentElement; drag.fromIndex = cards(drag.fromList).indexOf(card);
        drag.dx = x - r.left; drag.dy = y - r.top;
        var ph = document.createElement('div'); ph.className = 'kanban-placeholder'; ph.style.height = r.height + 'px';
        var ghost = card.cloneNode(true); ghost.classList.add('kanban-ghost'); ghost.removeAttribute('tabindex');
        ghost.style.width = r.width + 'px'; ghost.style.height = r.height + 'px';
        document.body.appendChild(ghost);
        drag.ph = ph; drag.ghost = ghost; drag.rot = 0;
        card.parentElement.insertBefore(ph, card);
        card.classList.add('is-source'); card.style.display = 'none';
        document.documentElement.classList.add('kanban-dragging');
        move(x, y);
        if (navigator.vibrate && drag.type === 'touch') try { navigator.vibrate(8); } catch (er) {}
      }
      function move(x, y) {
        var d = drag, vx = x - (d.lx == null ? x : d.lx); d.lx = x;
        d.rot = R.lerp(d.rot, R.clamp(vx * .6, -6, 6), .25);
        d.ghost.style.transform = 'translate3d(' + (x - d.dx) + 'px,' + (y - d.dy) + 'px,0) rotate(' + (R.reducedMotion ? 0 : d.rot.toFixed(2)) + 'deg) scale(1.03)';
        // find list under pointer
        var el = document.elementFromPoint(x, y), list = el && el.closest && el.closest('.kanban-list');
        if (!list || !board.contains(list)) { var col = el && el.closest && el.closest('.kanban-column'); list = col && board.contains(col) ? col.querySelector('.kanban-list') : null; }
        R.$$('.kanban-column.is-over', board).forEach(function (c) { if (!list || c !== list.closest('.kanban-column')) c.classList.remove('is-over'); });
        if (list) {
          var colEl = list.closest('.kanban-column'); if (colEl) colEl.classList.add('is-over');
          var sibs = cards(list).filter(function (c) { return c !== d.card; }), ref = null;
          for (var i = 0; i < sibs.length; i++) { var rr = sibs[i].getBoundingClientRect(); if (y < rr.top + rr.height / 2) { ref = sibs[i]; break; } }
          if (d.ph.parentElement !== list || d.ph.nextElementSibling !== ref) {
            var before = snapshot(allCards());
            list.insertBefore(d.ph, ref);
            flip(before);
            counts();
          }
          // auto-scroll inside list
          var lr = list.getBoundingClientRect();
          if (y < lr.top + 30) list.scrollTop -= 8; else if (y > lr.bottom - 30) list.scrollTop += 8;
        }
        // auto-scroll board horizontally
        var br = board.getBoundingClientRect();
        if (x < br.left + 40) board.scrollLeft -= 12; else if (x > br.right - 40) board.scrollLeft += 12;
      }
      offs.push(R.on(window, 'pointermove', function (e) {
        if (!drag || e.pointerId !== drag.id) return;
        if (!drag.started) {
          var dist = Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0);
          if (drag.type === 'touch') { if (dist > 10) { clearTimeout(drag.timer); drag = null; } return; }
          if (dist < 5) return;
          start(e.clientX, e.clientY);
        }
        e.preventDefault();
        move(e.clientX, e.clientY);
      }, { passive: false }));
      offs.push(R.on(window, 'touchmove', function (e) { if (drag && drag.started) e.preventDefault(); }, { passive: false }));
      function end(cancel) {
        var d = drag; drag = null;
        if (!d) return;
        clearTimeout(d.timer);
        if (!d.started) return;
        document.documentElement.classList.remove('kanban-dragging');
        R.$$('.kanban-column.is-over', board).forEach(function (c) { c.classList.remove('is-over'); });
        var card = d.card;
        if (cancel) { d.ph.remove(); } else { d.ph.parentElement.insertBefore(card, d.ph); d.ph.remove(); }
        card.style.display = '';
        var to = card.getBoundingClientRect(), g = d.ghost, gr = g.getBoundingClientRect();
        card.classList.remove('is-source');
        if (!R.reducedMotion) {
          card.animate([{ transform: 'translate(' + (gr.left - to.left) + 'px,' + (gr.top - to.top) + 'px) rotate(' + d.rot.toFixed(2) + 'deg) scale(1.03)', boxShadow: 'var(--shadow-xl)' }, { transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.9,.3,1.15)' });
        }
        g.remove();
        if (!cancel) {
          var ok = commit(card, d.fromList, d.fromIndex);
          if (ok) live.textContent = nameOf(card) + ' moved to ' + colOf(card.parentElement) + ', position ' + (cards(card.parentElement).indexOf(card) + 1);
        }
        counts();
      }
      offs.push(R.on(window, 'pointerup', function (e) { if (drag && e.pointerId === drag.id) end(false); }));
      offs.push(R.on(window, 'pointercancel', function (e) { if (drag && e.pointerId === drag.id) end(true); }));
      var popEsc = null;
      offs.push(R.on(document, 'keydown', function (e) { if (e.key === 'Escape' && drag && drag.started) { e.preventDefault(); end(true); } }));

      /* ---------- Keyboard: Space/Enter lift, arrows move, Space/Enter drop, Escape cancel ---------- */
      var held = null;
      function dropHeld(cancel) {
        if (!held) return;
        var h = held; held = null;
        h.card.setAttribute('aria-grabbed', 'false'); h.card.classList.remove('is-lifted');
        if (popEsc) { popEsc(); popEsc = null; }
        if (cancel) {
          var ref = cards(h.fromList).filter(function (c) { return c !== h.card; })[h.fromIndex];
          var before = snapshot(allCards()); h.fromList.insertBefore(h.card, ref || null); flip(before);
          live.textContent = 'Move cancelled.';
        } else if (commit(h.card, h.fromList, h.fromIndex)) live.textContent = nameOf(h.card) + ' dropped in ' + colOf(h.card.parentElement) + ', position ' + (cards(h.card.parentElement).indexOf(h.card) + 1);
        h.card.focus(); counts();
      }
      offs.push(R.on(board, 'keydown', '.kanban-card', function (e, card) {
        if (e.target !== card) return;
        var k = e.key;
        if (!held) {
          if (k === ' ' || k === 'Enter') {
            e.preventDefault();
            held = { card: card, fromList: card.parentElement, fromIndex: cards(card.parentElement).indexOf(card) };
            card.setAttribute('aria-grabbed', 'true'); card.classList.add('is-lifted');
            popEsc = R.pushLayer(function () { dropHeld(true); });
            live.textContent = nameOf(card) + ' lifted. Use arrow keys to move, Space to drop, Escape to cancel.';
          } else if (/^Arrow/.test(k)) {
            // focus navigation between cards
            var ls = lists(), li = ls.indexOf(card.parentElement), cs = cards(card.parentElement), ci = cs.indexOf(card), t = null;
            if (k === 'ArrowDown') t = cs[ci + 1]; else if (k === 'ArrowUp') t = cs[ci - 1];
            else { var nl = ls[li + (k === 'ArrowRight' ? 1 : -1)]; if (nl) { var nc = cards(nl); t = nc[Math.min(ci, nc.length - 1)]; } }
            if (t) { e.preventDefault(); t.focus(); }
          }
          return;
        }
        var list = card.parentElement, ls2 = lists(), li2 = ls2.indexOf(list), cs2 = cards(list), ci2 = cs2.indexOf(card);
        var before = snapshot(allCards());
        if (k === 'ArrowUp' && ci2 > 0) list.insertBefore(card, cs2[ci2 - 1]);
        else if (k === 'ArrowDown' && ci2 < cs2.length - 1) list.insertBefore(card, cs2[ci2 + 1].nextSibling);
        else if ((k === 'ArrowLeft' || k === 'ArrowRight') && ls2[li2 + (k === 'ArrowRight' ? 1 : -1)]) {
          var tl = ls2[li2 + (k === 'ArrowRight' ? 1 : -1)], tc = cards(tl);
          tl.insertBefore(card, tc[Math.min(ci2, tc.length)] || null);
          tl.closest('.kanban-column') && tl.closest('.kanban-column').scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: R.reducedMotion ? 'auto' : 'smooth' });
        } else if (k === ' ' || k === 'Enter') { e.preventDefault(); dropHeld(false); return; }
        else if (k === 'Tab') { dropHeld(true); return; }
        else return;
        e.preventDefault();
        flip(before); counts(); card.focus();
        live.textContent = colOf(card.parentElement) + ', position ' + (cards(card.parentElement).indexOf(card) + 1);
      }));

      // New cards added later get prepared
      var mo = new MutationObserver(function () { if (!drag) prep(); });
      mo.observe(board, { childList: true, subtree: true });

      board.ranjKanban = { refresh: prep };
      return function () { offs.forEach(function (f) { f(); }); mo.disconnect(); if (drag && drag.ghost) drag.ghost.remove(); live.remove(); if (popEsc) popEsc(); delete board.ranjKanban; };
    }
  });
})(window.Ranj);
