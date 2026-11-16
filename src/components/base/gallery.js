/* Ranj UI — Gallery lightbox. Any [data-gallery] container: clicking a .gallery-item (or a[data-lightbox]) opens a
 * fullscreen viewer with zoom-from-thumbnail, arrows, swipe, keyboard, captions, thumbnails, focus trap and Escape. */
(function (R) {
  'use strict';
  var I = {
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
  };
  function itemsOf(root) { return R.$$('.gallery-item, [data-lightbox]', root).filter(function (a) { return !a.closest('.lightbox'); }); }
  function srcOf(a) { var img = a.querySelector('img'); return a.getAttribute('data-src') || a.getAttribute('href') || (img && (img.currentSrc || img.src)) || ''; }
  function thumbOf(a) { var img = a.querySelector('img'); return (img && (img.currentSrc || img.src)) || srcOf(a); }
  function capOf(a) {
    var c = a.getAttribute('data-caption'); if (c != null) return R.esc(c);
    var el = a.querySelector('.gallery-caption'); if (el) return el.innerHTML;
    var img = a.querySelector('img'); return img && img.alt ? R.esc(img.alt) : '';
  }

  function open(root, start) {
    var items = itemsOf(root), n = items.length, i = R.clamp(start, 0, n - 1), o = R.opts(root, { thumbs: true, loop: true });
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', root.getAttribute('aria-label') || 'Image viewer');
    lb.innerHTML = '<div class="lightbox-bar"><span class="lightbox-count" aria-live="polite"></span><button type="button" class="lightbox-btn lightbox-close" aria-label="Close">' + I.x + '</button></div>' +
      '<div class="lightbox-stage"><img class="lightbox-img" alt="">' +
      (n > 1 ? '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous image">' + I.prev + '</button><button type="button" class="lightbox-btn lightbox-next" aria-label="Next image">' + I.next + '</button>' : '') + '</div>' +
      '<div><div class="lightbox-caption"></div>' + (o.thumbs && n > 1 ? '<div class="lightbox-thumbs">' + items.map(function (a, k) { return '<button type="button" data-i="' + k + '" aria-label="Image ' + (k + 1) + '"><img src="' + R.esc(thumbOf(a)) + '" alt=""></button>'; }).join('') + '</div>' : '') + '</div>';
    document.body.appendChild(lb);
    var img = lb.querySelector('.lightbox-img'), count = lb.querySelector('.lightbox-count'), cap = lb.querySelector('.lightbox-caption');
    var prevB = lb.querySelector('.lightbox-prev'), nextB = lb.querySelector('.lightbox-next'), thumbs = lb.querySelector('.lightbox-thumbs');
    R.scrollLock.lock();
    var offs = [], release = R.trapFocus(lb, lb.querySelector('.lightbox-close')), pop = R.pushLayer(close);

    function show(k, dir) {
      if (!o.loop) k = R.clamp(k, 0, n - 1);
      i = ((k % n) + n) % n;
      var a = items[i];
      img.classList.remove('is-entering-next', 'is-entering-prev');
      var full = srcOf(a), th = thumbOf(a), want = i;
      img.alt = (a.querySelector('img') || {}).alt || '';
      if (th && th !== full) {
        img.src = th;
        var pre = new Image();
        pre.onload = function () { if (i === want && img.isConnected) img.src = full; };
        pre.src = full;
      } else img.src = full;
      if (dir && !R.reducedMotion) { void img.offsetWidth; img.classList.add(dir > 0 ? 'is-entering-next' : 'is-entering-prev'); }
      img.style.transform = '';
      count.textContent = (i + 1) + ' / ' + n;
      cap.innerHTML = capOf(a);
      if (!o.loop) { if (prevB) prevB.disabled = i === 0; if (nextB) nextB.disabled = i === n - 1; }
      if (thumbs) R.$$('button', thumbs).forEach(function (b, k2) {
        if (k2 === i) { b.setAttribute('aria-current', 'true'); b.scrollIntoView({ block: 'nearest', inline: 'center' }); } else b.removeAttribute('aria-current');
      });
      // preload neighbours
      [i + 1, i - 1].forEach(function (j) { var s = items[((j % n) + n) % n]; if (s) { var p = new Image(); p.src = srcOf(s); } });
      R.emit(root, 'change', { index: i, item: a });
    }

    // Zoom from the thumbnail (FLIP)
    var from = items[i], fromImg = from.querySelector('img');
    show(i, 0);
    if (fromImg && !R.reducedMotion) {
      var fr = fromImg.getBoundingClientRect();
      var go = function () {
        var to = img.getBoundingClientRect(); if (!to.width) return;
        var s = Math.max(fr.width / to.width, fr.height / to.height);
        img.animate([
          { transform: 'translate(' + (fr.left + fr.width / 2 - (to.left + to.width / 2)) + 'px,' + (fr.top + fr.height / 2 - (to.top + to.height / 2)) + 'px) scale(' + s + ')', clipPath: 'inset(' + Math.max(0, (to.height * s - fr.height) / 2 / s) + 'px ' + Math.max(0, (to.width * s - fr.width) / 2 / s) + 'px round 12px)' },
          { transform: 'none', clipPath: 'inset(0 round 8px)' }
        ], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
      };
      if (img.complete && img.naturalWidth) go(); else img.addEventListener('load', go, { once: true });
    }

    function close() {
      if (lb.classList.contains('is-closing')) return;
      lb.classList.add('is-closing');
      pop(); offs.forEach(function (f) { f(); });
      var target = items[i];
      setTimeout(function () { lb.remove(); R.scrollLock.unlock(); release(); if (target && target.focus) try { target.focus({ preventScroll: true }); } catch (e) {} }, R.reducedMotion ? 0 : 190);
      R.emit(root, 'close', { index: i });
    }
    offs.push(R.on(lb, 'click', function (e) {
      var t = e.target;
      if (t.closest('.lightbox-close')) close();
      else if (t.closest('.lightbox-prev')) show(i - 1, -1);
      else if (t.closest('.lightbox-next')) show(i + 1, 1);
      else if (t.closest('.lightbox-thumbs button')) { var k = +t.closest('button').getAttribute('data-i'); show(k, k > i ? 1 : -1); }
      else if (t === lb || t.classList.contains('lightbox-stage') || t.classList.contains('lightbox-caption')) close();
    }));
    offs.push(R.on(lb, 'keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1, -1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1, 1); }
      else if (e.key === 'Home') { e.preventDefault(); show(0, -1); }
      else if (e.key === 'End') { e.preventDefault(); show(n - 1, 1); }
    }));
    // Swipe
    var sw = null;
    offs.push(R.on(img, 'pointerdown', function (e) { sw = { x: e.clientX, y: e.clientY, id: e.pointerId }; try { img.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); }));
    offs.push(R.on(img, 'pointermove', function (e) {
      if (!sw || e.pointerId !== sw.id) return;
      var dx = e.clientX - sw.x, dy = e.clientY - sw.y;
      img.style.transition = 'none';
      img.style.transform = Math.abs(dy) > Math.abs(dx) && dy > 0 ? 'translateY(' + dy + 'px) scale(' + Math.max(.85, 1 - dy / 1200) + ')' : 'translateX(' + dx + 'px)';
      lb.style.backgroundColor = Math.abs(dy) > Math.abs(dx) && dy > 0 ? 'rgb(6 6 8 / ' + Math.max(.4, .92 - dy / 600) + ')' : '';
    }));
    offs.push(R.on(img, 'pointerup', function (e) {
      if (!sw) return; var dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
      img.style.transition = ''; lb.style.backgroundColor = '';
      if (dy > 110 && Math.abs(dy) > Math.abs(dx)) close();
      else if (dx < -60) show(i + 1, 1);
      else if (dx > 60) show(i - 1, -1);
      else img.style.transform = '';
    }));
    offs.push(R.on(img, 'pointercancel', function () { sw = null; img.style.transition = ''; img.style.transform = ''; lb.style.backgroundColor = ''; }));
    R.emit(root, 'open', { index: i });
    return { close: close, show: function (k) { show(k, k > i ? 1 : -1); } };
  }

  R.define('gallery', {
    selector: '[data-gallery]',
    mount: function (root) {
      itemsOf(root).forEach(function (a) {
        if (a.tagName !== 'A' && a.tagName !== 'BUTTON' && !a.hasAttribute('tabindex')) { a.tabIndex = 0; a.setAttribute('role', 'button'); }
        if (!a.hasAttribute('aria-label')) { var im = a.querySelector('img'); a.setAttribute('aria-label', 'Open image' + (im && im.alt ? ': ' + im.alt : '')); }
      });
      var off1 = R.on(root, 'click', '.gallery-item, [data-lightbox]', function (e, a) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
        e.preventDefault();
        open(root, itemsOf(root).indexOf(a));
      });
      var off2 = R.on(root, 'keydown', '.gallery-item, [data-lightbox]', function (e, a) {
        if ((e.key === 'Enter' || e.key === ' ') && a.tagName !== 'A' && a.tagName !== 'BUTTON') { e.preventDefault(); open(root, itemsOf(root).indexOf(a)); }
      });
      root.ranjGallery = { open: function (k) { return open(root, k || 0); } };
      return function () { off1(); off2(); delete root.ranjGallery; };
    }
  });
  R.lightbox = function (root, index) { return open(root, index || 0); };
})(window.Ranj);
