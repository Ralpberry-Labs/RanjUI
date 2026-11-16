/* Ranj UI — Motion
 * reveal, parallax (scroll + pointer), marquee, animated-list, stack-cards, flip-card, orbit, dock,
 * word-globe, scroll-progress, sticky-cards, flowing-menu
 */
(function (R) {
  'use strict';
  var d = document;

  /* ---------- private helpers ---------- */
  function scrollRoot(el) {
    var p = el.parentElement;
    while (p && p !== d.body && p !== d.documentElement) {
      var s = getComputedStyle(p);
      if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 1) return p;
      p = p.parentElement;
    }
    return null;
  }
  function viewRect(root) {
    if (root) return root.getBoundingClientRect();
    var h = window.innerHeight; return { top: 0, bottom: h, height: h };
  }
  function onScroll(fn) {
    var raf = 0, h = function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; fn(); }); };
    window.addEventListener('scroll', h, { capture: true, passive: true });
    window.addEventListener('resize', h);
    h();
    return function () { cancelAnimationFrame(raf); window.removeEventListener('scroll', h, { capture: true, passive: true }); window.removeEventListener('resize', h); };
  }
  function ro(el, fn) {
    if (!('ResizeObserver' in window)) return function () {};
    var raf = 0, o = new ResizeObserver(function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(fn); });
    [].concat(el).forEach(function (e) { o.observe(e); });
    return function () { cancelAnimationFrame(raf); o.disconnect(); };
  }
  function cssPx(el, name, fallback) {
    var v = getComputedStyle(el).getPropertyValue(name).trim();
    if (!v) return fallback;
    var n = parseFloat(v);
    if (/rem$/.test(v)) n *= parseFloat(getComputedStyle(d.documentElement).fontSize) || 16;
    return isNaN(n) ? fallback : n;
  }
  function stripClone(node) {
    node.setAttribute('aria-hidden', 'true');
    node.setAttribute('inert', '');
    node.removeAttribute('id');
    R.$$('[id]', node).forEach(function (n) { n.removeAttribute('id'); });
    R.$$('a,button,input,select,textarea,[tabindex]', node).forEach(function (n) { n.setAttribute('tabindex', '-1'); });
    return node;
  }

  /* ---------- Reveal ---------- */
  R.define('reveal', {
    selector: '[data-reveal]',
    mount: function (el) {
      if (R.reducedMotion) return;
      var o = R.opts(el, { revealDelay: 0, revealDuration: 0, revealOnce: true, revealThreshold: 0.15, revealDistance: '' });
      var stag = el.hasAttribute('data-reveal-stagger'), sv = parseFloat(el.getAttribute('data-reveal-stagger'));
      var kids = stag ? Array.prototype.slice.call(el.children) : [];
      kids.forEach(function (c, i) { c.style.setProperty('--ri', i); });
      if (stag && !isNaN(sv)) el.style.setProperty('--reveal-stagger', sv + 'ms');
      if (o.revealDelay) el.style.setProperty('--reveal-delay', o.revealDelay + 'ms');
      if (o.revealDuration) el.style.setProperty('--reveal-dur', o.revealDuration + 'ms');
      if (o.revealDistance) el.style.setProperty('--reveal-distance', o.revealDistance);
      el.setAttribute('data-reveal-state', 'out');
      var t = 0;
      function show() {
        el.setAttribute('data-reveal-state', 'in');
        clearTimeout(t);
        if (o.revealOnce) {
          var cs = getComputedStyle(el);
          var total = parseFloat(cs.getPropertyValue('--reveal-dur')) + parseFloat(cs.getPropertyValue('--reveal-delay')) + (stag ? kids.length * (parseFloat(cs.getPropertyValue('--reveal-stagger')) || 90) : 0);
          t = setTimeout(function () { el.setAttribute('data-reveal-state', 'done'); R.emit(el, 'reveal', {}); }, (total || 900) + 80);
        } else R.emit(el, 'reveal', {});
      }
      var stop = R.inView(el, show, { threshold: o.revealThreshold, repeat: !o.revealOnce, rootMargin: '0px 0px -6% 0px', onLeave: o.revealOnce ? null : function () { clearTimeout(t); el.setAttribute('data-reveal-state', 'out'); } });
      return function () { stop(); clearTimeout(t); el.removeAttribute('data-reveal-state'); };
    }
  });

  /* ---------- Parallax: scroll ---------- */
  R.define('parallax', {
    selector: '[data-parallax]',
    mount: function (el) {
      if (R.reducedMotion) return;
      var speed = parseFloat(el.getAttribute('data-parallax')); if (isNaN(speed)) speed = 0.2;
      var axis = el.getAttribute('data-parallax-axis') || 'y';
      var ref = el.parentElement || el, root = null;
      var stop = onScroll(function () {
        if (!root || !root.isConnected) root = scrollRoot(el);
        var vr = viewRect(root), r = ref.getBoundingClientRect();
        var off = (r.top + r.height / 2) - (vr.top + vr.height / 2);
        var v = (-off * speed).toFixed(2);
        el.style.transform = axis === 'x' ? 'translate3d(' + v + 'px,0,0)' : 'translate3d(0,' + v + 'px,0)';
      });
      return function () { stop(); el.style.transform = ''; };
    }
  });

  /* ---------- Parallax: pointer layers ---------- */
  R.define('parallax-scene', {
    selector: '.parallax-scene',
    mount: function (el) {
      if (R.reducedMotion) return;
      var o = R.opts(el, { max: 40, sceneTilt: 0 });
      var layers = R.$$('[data-depth]', el).map(function (n) { return { el: n, depth: parseFloat(n.getAttribute('data-depth')) || 0 }; });
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      function frame() {
        cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
        layers.forEach(function (l) { l.el.style.transform = 'translate3d(' + (cx * l.depth * o.max).toFixed(2) + 'px,' + (cy * l.depth * o.max).toFixed(2) + 'px,0)'; });
        if (o.sceneTilt) el.style.transform = 'perspective(1000px) rotateX(' + (-cy * o.sceneTilt).toFixed(2) + 'deg) rotateY(' + (cx * o.sceneTilt).toFixed(2) + 'deg)';
        raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(frame) : 0;
      }
      function kick() { if (!raf) raf = requestAnimationFrame(frame); }
      var offs = [
        R.on(el, 'pointermove', function (e) { var r = el.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ty = ((e.clientY - r.top) / r.height - 0.5) * 2; kick(); }),
        R.on(el, 'pointerleave', function () { tx = 0; ty = 0; kick(); })
      ];
      return function () { offs.forEach(function (f) { f(); }); cancelAnimationFrame(raf); layers.forEach(function (l) { l.el.style.transform = ''; }); el.style.transform = ''; };
    }
  });

  /* ---------- Marquee ---------- */
  R.define('marquee', {
    selector: '.marquee',
    mount: function (el) {
      var o = R.opts(el, { speed: 0, clones: 0 });
      var content = R.$('.marquee-content', el);
      if (!content) {
        content = d.createElement('div'); content.className = 'marquee-content';
        while (el.firstChild) content.appendChild(el.firstChild);
        el.appendChild(content);
      }
      var vertical = el.classList.contains('marquee-vertical');
      var clones = [], lastKey = '';
      function fill() {
        var cs = getComputedStyle(el), gap = parseFloat(vertical ? cs.rowGap : cs.columnGap) || 0;
        var size = vertical ? content.offsetHeight : content.offsetWidth;
        // measure the box without clones so content-sized containers can't feed back into more clones
        clones.forEach(function (c) { c.style.position = 'absolute'; });
        var box = vertical ? el.clientHeight : el.clientWidth;
        clones.forEach(function (c) { c.style.position = ''; });
        if (!size) return;
        var need = o.clones || Math.min(24, Math.max(1, Math.ceil(box / (size + gap))));
        var key = need + ':' + size;
        if (key !== lastKey) {
          lastKey = key;
          while (clones.length > need) clones.pop().remove();
          while (clones.length < need) { var c = stripClone(content.cloneNode(true)); el.appendChild(c); clones.push(c); }
          // restart every copy together so clones stay in phase with the original
          var all = [content].concat(clones);
          all.forEach(function (n) { n.style.animation = 'none'; });
          void el.offsetWidth;
          all.forEach(function (n) { n.style.animation = ''; });
        }
        if (o.speed > 0) el.style.setProperty('--duration', ((size + gap) / o.speed).toFixed(2) + 's');
      }
      fill();
      var stopRo = ro([el, content], fill);
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { if (el.isConnected) fill(); });
      return function () { stopRo(); clones.forEach(function (c) { c.remove(); }); };
    }
  });

  /* ---------- Animated list (notification feed) ---------- */
  R.define('animated-list', {
    selector: '.animated-list',
    mount: function (el) {
      var o = R.opts(el, { interval: 1100, loop: false, max: 0, trigger: 'view', delay: 200 });
      var up = el.classList.contains('animated-list-up');
      var items = Array.prototype.slice.call(el.children);
      var slots = items.map(function (it) {
        var s = d.createElement('div'); s.className = 'al-slot';
        var inner = d.createElement('div'); inner.className = 'al-inner';
        it.classList.add('al-item');
        el.insertBefore(s, it); inner.appendChild(it); s.appendChild(inner);
        s.setAttribute('data-al', 'hidden');
        return s;
      });
      var max = o.max || (o.loop ? Math.max(1, Math.min(slots.length - 1, 4)) : slots.length);
      var visible = [], k = 0, t = 0, timers = [], dur = 600;
      function enter(s) {
        if (up) el.appendChild(s); else el.insertBefore(s, el.firstChild);
        s.setAttribute('data-al', 'enter'); void s.offsetHeight;
        requestAnimationFrame(function () { s.removeAttribute('data-al'); });
        if (up) visible.push(s); else visible.unshift(s);
        if (visible.length > max) {
          var old = up ? visible.shift() : visible.pop();
          old.setAttribute('data-al', 'exit');
          timers.push(setTimeout(function () { if (old.getAttribute('data-al') === 'exit') old.setAttribute('data-al', 'hidden'); }, dur));
        }
        R.emit(el, 'item', { item: s.firstChild.firstChild });
      }
      function tick() {
        if (!o.loop && k >= slots.length) { R.emit(el, 'done', {}); return; }
        var s = slots[k % slots.length]; k++;
        if (visible.indexOf(s) < 0) enter(s);
        t = setTimeout(tick, o.interval);
      }
      if (R.reducedMotion) {
        slots.slice(0, max).forEach(function (s) { s.removeAttribute('data-al'); visible.push(s); });
      } else {
        var stopView = o.trigger === 'load' ? (t = setTimeout(tick, o.delay), function () {}) : R.inView(el, function () { t = setTimeout(tick, o.delay); });
      }
      return {
        destroy: function () {
          clearTimeout(t); timers.forEach(clearTimeout); if (stopView) stopView();
          items.forEach(function (it, i) { it.classList.remove('al-item'); el.insertBefore(it, slots[i]); });
          slots.forEach(function (s) { s.remove(); });
        },
        /** add(node) — push a new item to the feed right now */
        add: function (node) {
          var s = d.createElement('div'); s.className = 'al-slot';
          var inner = d.createElement('div'); inner.className = 'al-inner';
          node.classList.add('al-item'); inner.appendChild(node); s.appendChild(inner);
          enter(s);
        },
        pause: function () { clearTimeout(t); },
        resume: function () { clearTimeout(t); t = setTimeout(tick, o.interval); }
      };
    }
  });

  /* ---------- Stack cards (swipe deck) ---------- */
  R.define('stack-cards', {
    selector: '.stack-cards',
    mount: function (el) {
      var o = R.opts(el, { loop: true, threshold: 110, visible: 3 });
      var cards = R.$$(':scope > .stack-card', el);
      var order = cards.slice();
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'group');
      if (!el.hasAttribute('aria-roledescription')) el.setAttribute('aria-roledescription', 'card stack');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Card stack, use left and right arrow keys to swipe');
      function layout() {
        order.forEach(function (c, k) {
          c.style.setProperty('--sc-i', Math.min(k, o.visible));
          c.style.zIndex = String(order.length - k);
          c.toggleAttribute('data-sc-top', k === 0);
          c.setAttribute('aria-hidden', k === 0 ? 'false' : 'true');
          if (k > o.visible) c.setAttribute('data-sc-depth', 'hidden'); else c.removeAttribute('data-sc-depth');
        });
      }
      layout();
      var drag = null, busy = false;
      function fling(dir, card, vy) {
        card = card || order[0]; if (!card || busy) return;
        busy = true;
        var w = el.offsetWidth || 300;
        card.removeAttribute('data-sc-dragging');
        card.setAttribute('data-sc-flying', '');
        card.style.transform = 'translate(' + (dir * w * 1.7) + 'px,' + ((vy || 0) * 220 - 30) + 'px) rotate(' + (dir * 28) + 'deg)';
        R.emit(el, 'swipe', { direction: dir > 0 ? 'right' : 'left', card: card, index: cards.indexOf(card) });
        setTimeout(function () {
          card.setAttribute('data-sc-dragging', '');
          card.removeAttribute('data-sc-flying');
          card.style.transform = ''; card.style.removeProperty('--sc-drag');
          order.shift();
          if (o.loop) order.push(card); else { card.setAttribute('data-sc-depth', 'hidden'); card.removeAttribute('data-sc-top'); }
          layout();
          void card.offsetWidth;
          card.removeAttribute('data-sc-dragging');
          busy = false;
          if (!order.length) R.emit(el, 'empty', {});
        }, 420);
      }
      function down(e) {
        var card = e.target.closest('.stack-card');
        if (!card || card !== order[0] || busy || e.button > 0) return;
        if (e.target.closest('button, a, input, [data-no-drag]')) return;
        drag = { card: card, x: e.clientX, y: e.clientY, dx: 0, dy: 0, hist: [[e.clientX, e.clientY, performance.now()]], id: e.pointerId };
        try { card.setPointerCapture(e.pointerId); } catch (err) {}
        card.setAttribute('data-sc-dragging', '');
      }
      function move(e) {
        if (!drag || e.pointerId !== drag.id) return;
        drag.dx = e.clientX - drag.x; drag.dy = e.clientY - drag.y;
        drag.hist.push([e.clientX, e.clientY, performance.now()]); if (drag.hist.length > 5) drag.hist.shift();
        drag.card.style.transform = 'translate(' + drag.dx + 'px,' + drag.dy + 'px) rotate(' + (drag.dx * 0.07).toFixed(2) + 'deg)';
        drag.card.style.setProperty('--sc-drag', (drag.dx / o.threshold).toFixed(3));
      }
      function upH(e) {
        if (!drag || e.pointerId !== drag.id) return;
        var g = drag; drag = null;
        var h0 = g.hist[0], h1 = g.hist[g.hist.length - 1], dt = Math.max(1, h1[2] - h0[2]);
        var vx = (h1[0] - h0[0]) / dt, vy = (h1[1] - h0[1]) / dt;
        if (Math.abs(g.dx) > o.threshold || (Math.abs(vx) > 0.55 && Math.abs(g.dx) > 24)) fling(g.dx > 0 ? 1 : -1, g.card, vy);
        else { g.card.removeAttribute('data-sc-dragging'); g.card.style.transform = ''; g.card.style.removeProperty('--sc-drag'); }
      }
      var host = el.parentElement || el;
      var offs = [
        R.on(el, 'pointerdown', down), R.on(el, 'pointermove', move), R.on(el, 'pointerup', upH), R.on(el, 'pointercancel', upH),
        R.on(el, 'keydown', function (e) { if (e.key === 'ArrowLeft') { e.preventDefault(); fling(-1); } else if (e.key === 'ArrowRight') { e.preventDefault(); fling(1); } }),
        R.on(host, 'click', '[data-swipe]', function (e, b) { fling(b.getAttribute('data-swipe') === 'left' ? -1 : 1); })
      ];
      return {
        destroy: function () { offs.forEach(function (f) { f(); }); cards.forEach(function (c) { c.style.transform = ''; c.style.zIndex = ''; c.removeAttribute('data-sc-top'); c.removeAttribute('data-sc-depth'); c.removeAttribute('aria-hidden'); }); },
        swipe: function (dir) { fling(dir === 'left' ? -1 : 1); }
      };
    }
  });

  /* ---------- Flip card (click mode) ---------- */
  R.define('flip-card', {
    selector: '.flip-card-click',
    mount: function (el) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-pressed', 'false');
      function toggle() {
        var on = el.getAttribute('data-state') !== 'flipped';
        el.setAttribute('data-state', on ? 'flipped' : 'front'); el.setAttribute('aria-pressed', String(on));
        R.emit(el, 'flip', { flipped: on });
      }
      var offs = [
        R.on(el, 'click', function (e) { if (e.target.closest('a, button, input, select, textarea')) return; toggle(); }),
        R.on(el, 'keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); toggle(); } })
      ];
      return function () { offs.forEach(function (f) { f(); }); };
    }
  });

  /* ---------- Orbit ---------- */
  R.define('orbit', {
    selector: '.orbit-ring',
    mount: function (el) {
      var o = R.opts(el, { radius: 0, duration: 0, offset: 0 });
      var items = Array.prototype.slice.call(el.children);
      items.forEach(function (it, i) {
        it.classList.add('orbit-item');
        it.style.setProperty('--a', (o.offset + 360 / items.length * i).toFixed(2) + 'deg');
        if (!it.querySelector(':scope > .orbit-counter')) {
          var c = d.createElement('span'); c.className = 'orbit-counter';
          while (it.firstChild) c.appendChild(it.firstChild);
          it.appendChild(c);
        }
      });
      if (o.duration) el.style.setProperty('--duration', o.duration + 's');
      var stop = function () {};
      if (o.radius && o.radius <= 1) {
        var host = el.closest('.orbit') || el.parentElement;
        var fit = function () { el.style.setProperty('--radius', (host.offsetWidth / 2 * o.radius).toFixed(1) + 'px'); };
        fit(); stop = ro(host, fit);
      } else if (o.radius) el.style.setProperty('--radius', o.radius + 'px');
      return function () { stop(); };
    }
  });

  /* ---------- Dock magnification ---------- */
  R.define('dock', {
    selector: '.dock',
    mount: function (el) {
      var o = R.opts(el, { distance: 150, bounce: true });
      var items = R.$$('.dock-item', el);
      var base = cssPx(el, '--dock-size', 48), max = cssPx(el, '--dock-max', 84);
      var cur = items.map(function () { return base; }), mx = null, raf = 0;
      if (!el.hasAttribute('role')) el.setAttribute('role', 'toolbar');
      function frame() {
        raf = 0;
        var rects = items.map(function (it) { return it.getBoundingClientRect(); });
        var moving = false;
        for (var i = 0; i < items.length; i++) {
          var t = base;
          if (mx !== null) {
            var c = rects[i].left + rects[i].width / 2, f = Math.max(0, 1 - Math.abs(mx - c) / o.distance);
            t = base + (max - base) * (1 - Math.cos(Math.PI * f)) / 2;
          }
          var v = cur[i] + (t - cur[i]) * 0.28;
          if (Math.abs(v - t) < 0.3) v = t; else moving = true;
          cur[i] = v;
        }
        for (var j = 0; j < items.length; j++) { items[j].style.width = items[j].style.height = cur[j].toFixed(2) + 'px'; }
        if (moving) raf = requestAnimationFrame(frame);
        else if (mx === null) { el.removeAttribute('data-dock-active'); items.forEach(function (it) { it.style.width = it.style.height = ''; }); }
      }
      function kick() { if (!raf) raf = requestAnimationFrame(frame); }
      var offs = [R.on(el, 'click', '.dock-item', function (e, it) {
        if (o.bounce && !R.reducedMotion) { it.classList.remove('dock-bounce'); void it.offsetWidth; it.classList.add('dock-bounce'); }
        it.setAttribute('data-active', '');
        R.emit(el, 'select', { item: it, label: it.getAttribute('data-label') });
      }), R.on(el, 'animationend', '.dock-item', function (e, it) { it.classList.remove('dock-bounce'); })];
      if (!R.reducedMotion) offs.push(
        R.on(el, 'pointermove', function (e) { if (e.pointerType === 'touch' && e.buttons === 0) return; mx = e.clientX; el.setAttribute('data-dock-active', ''); kick(); }),
        R.on(el, 'pointerleave', function () { mx = null; kick(); })
      );
      offs.push(R.roving(el, '.dock-item', { orientation: 'horizontal' }));
      return function () { offs.forEach(function (f) { f(); }); cancelAnimationFrame(raf); items.forEach(function (it) { it.style.width = it.style.height = ''; }); };
    }
  });

  /* ---------- Word globe ---------- */
  R.define('word-globe', {
    selector: '.word-globe',
    mount: function (el) {
      var o = R.opts(el, { words: '', speed: 1, radius: 0.78 });
      var made = [];
      if (o.words) o.words.split('|').forEach(function (w) { var s = d.createElement('span'); s.textContent = w; el.appendChild(s); made.push(s); });
      var nodes = Array.prototype.slice.call(el.children), n = nodes.length;
      if (!el.hasAttribute('role')) { el.setAttribute('role', 'list'); nodes.forEach(function (x) { if (!x.hasAttribute('role')) x.setAttribute('role', 'listitem'); }); }
      var golden = Math.PI * (3 - Math.sqrt(5));
      var pts = nodes.map(function (node, i) {
        var y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), phi = i * golden;
        return { x: Math.cos(phi) * r, y: y, z: Math.sin(phi) * r, el: node, w: 0, h: 0 };
      });
      var R0 = 120;
      function measure() { R0 = el.offsetWidth / 2 * o.radius; pts.forEach(function (p) { p.w = p.el.offsetWidth; p.h = p.el.offsetHeight; }); }
      measure();
      var auto = 0.00035 * o.speed, vx = 0, vy = auto, hover = null, dragging = null;
      function rot(ax, ay) {
        var cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
        for (var i = 0; i < n; i++) {
          var p = pts[i];
          var x = p.x * cy + p.z * sy, z = -p.x * sy + p.z * cy; // around Y
          var y = p.y * cx - z * sx; z = p.y * sx + z * cx;       // around X
          p.x = x; p.y = y; p.z = z;
        }
      }
      function render() {
        for (var i = 0; i < n; i++) {
          var p = pts[i], s = 0.6 + (p.z + 1) * 0.3, op = 0.18 + (p.z + 1) * 0.41;
          p.el.style.transform = 'translate3d(' + (p.x * R0 - p.w / 2).toFixed(1) + 'px,' + (p.y * R0 - p.h / 2).toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
          p.el.style.opacity = op.toFixed(3);
          p.el.style.zIndex = String(Math.round((p.z + 1) * 50));
          p.el.style.filter = p.z < -0.35 ? 'blur(' + ((-p.z - 0.35) * 2.2).toFixed(2) + 'px)' : '';
        }
      }
      render();
      var offs = [ro(el, function () { measure(); render(); })];
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { if (el.isConnected) { measure(); render(); } });
      if (R.reducedMotion) return function () { offs.forEach(function (f) { f(); }); made.forEach(function (m) { m.remove(); }); };
      offs.push(
        R.on(el, 'pointerdown', function (e) { dragging = { x: e.clientX, y: e.clientY, t: performance.now() }; try { el.setPointerCapture(e.pointerId); } catch (err) {} }),
        R.on(el, 'pointermove', function (e) {
          var r = el.getBoundingClientRect();
          if (dragging) {
            var now = performance.now(), dt = Math.max(8, now - dragging.t);
            vy = (e.clientX - dragging.x) / R0 / dt; vx = -(e.clientY - dragging.y) / R0 / dt;
            dragging.x = e.clientX; dragging.y = e.clientY; dragging.t = now;
          } else hover = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
        }),
        R.on(el, 'pointerup', function () { dragging = null; }),
        R.on(el, 'pointercancel', function () { dragging = null; }),
        R.on(el, 'pointerleave', function () { hover = null; })
      );
      offs.push(R.loop(el, function (t, dt) {
        if (!dragging) {
          var tx = hover ? -hover.y * 0.0016 * o.speed : 0, ty = hover ? hover.x * 0.0016 * o.speed : auto;
          vx += (tx - vx) * Math.min(1, dt / 600); vy += (ty - vy) * Math.min(1, dt / 600);
        }
        rot(vx * dt, vy * dt);
        render();
      }));
      return function () { offs.forEach(function (f) { f(); }); nodes.forEach(function (x) { x.style.transform = x.style.opacity = x.style.zIndex = x.style.filter = ''; }); made.forEach(function (m) { m.remove(); }); };
    }
  });

  /* ---------- Scroll progress (bar + ring) ---------- */
  R.define('scroll-progress', {
    selector: '.scroll-progress, .scroll-ring',
    mount: function (el) {
      var sel = el.getAttribute('data-target'), target = null, made = null;
      if (el.classList.contains('scroll-ring') && !R.$('svg', el)) {
        made = d.createElementNS('http://www.w3.org/2000/svg', 'svg');
        made.setAttribute('viewBox', '0 0 36 36'); made.setAttribute('aria-hidden', 'true');
        made.innerHTML = '<circle class="sr-track" cx="18" cy="18" r="16"/><circle class="sr-bar" cx="18" cy="18" r="16" pathLength="1"/>';
        el.insertBefore(made, el.firstChild);
      }
      if (el.hasAttribute('data-value')) { // static ring / bar
        var v = parseFloat(el.getAttribute('data-value')) || 0; if (v > 1) v /= 100;
        el.style.setProperty('--progress', v);
        return function () { if (made) made.remove(); };
      }
      if (!el.hasAttribute('role')) { el.setAttribute('role', 'progressbar'); el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', '100'); el.setAttribute('aria-label', el.getAttribute('aria-label') || 'Reading progress'); }
      var last = -1;
      var stop = onScroll(function () {
        if (!target || !target.isConnected) target = sel ? (sel === 'parent' ? scrollRoot(el) : d.querySelector(sel)) : scrollRoot(el);
        var p;
        if (target && target.scrollHeight > target.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(target).overflowY)) {
          p = target.scrollTop / (target.scrollHeight - target.clientHeight);
        } else if (target) {
          var r = target.getBoundingClientRect(), vh = window.innerHeight;
          p = R.clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
        } else {
          var de = d.documentElement; p = (window.scrollY || de.scrollTop) / Math.max(1, de.scrollHeight - window.innerHeight);
        }
        p = R.clamp(Math.round(p * 1000) / 1000, 0, 1);
        if (p !== last) { last = p; el.style.setProperty('--progress', p); el.setAttribute('aria-valuenow', Math.round(p * 100)); }
      });
      var offClick = el.hasAttribute('data-scroll-top') ? R.on(el, 'click', function () { (target && target.scrollTo ? target : window).scrollTo({ top: 0, behavior: R.reducedMotion ? 'auto' : 'smooth' }); }) : function () {};
      return function () { stop(); offClick(); if (made) made.remove(); };
    }
  });

  /* ---------- Sticky stacking cards ---------- */
  R.define('sticky-cards', {
    selector: '.sticky-cards',
    mount: function (el) {
      var cards = R.$$(':scope > .sticky-card', el);
      cards.forEach(function (c, i) { c.style.setProperty('--sk-i', i); });
      if (R.reducedMotion) return function () {};
      var root = null, last = [];
      var stop = onScroll(function () {
        if (!root || !root.isConnected) root = scrollRoot(el);
        var vr = viewRect(root), n = cards.length;
        var rects = cards.map(function (c) { return c.getBoundingClientRect(); });
        var tops = cards.map(function (c) { return parseFloat(getComputedStyle(c).top) || 0; });
        var arrive = [];
        for (var j = 0; j < n; j++) {
          if (j === 0) { arrive.push(0); continue; }
          var stick = vr.top + tops[j], H = rects[j - 1].height || 1;
          arrive.push(R.clamp(1 - (rects[j].top - stick) / H, 0, 1));
        }
        for (var i = 0; i < n; i++) {
          var depth = 0; for (var k = i + 1; k < n; k++) depth += arrive[k];
          depth = Math.round(depth * 1000) / 1000;
          if (last[i] !== depth) { last[i] = depth; cards[i].style.setProperty('--depth', depth); }
        }
      });
      return function () { stop(); cards.forEach(function (c) { c.style.removeProperty('--depth'); }); };
    }
  });

  /* ---------- Flowing menu ---------- */
  R.define('flowing-menu', {
    selector: '.flowing-menu',
    mount: function (el) {
      var items = R.$$('.fm-item', el), bands = [];
      items.forEach(function (it) {
        var text = it.getAttribute('data-text') || it.textContent.trim();
        var img = it.getAttribute('data-image'), grad = it.getAttribute('data-gradient');
        var chip = img ? 'url("' + img.replace(/"/g, '') + '")' : grad || '';
        var band = d.createElement('div'); band.className = 'fm-band'; band.setAttribute('aria-hidden', 'true');
        var unit = '<span>' + R.esc(text) + '<i' + (chip ? ' style="--fm-chip:' + R.esc(chip) + '"' : '') + '></i></span>';
        var track = '<div class="fm-track">' + unit + unit + unit + unit + '</div>';
        band.innerHTML = track + track;
        it.appendChild(band); bands.push(band);
      });
      function edge(it, e) { var r = it.getBoundingClientRect(); return (e.clientY - r.top) < r.height / 2 ? -1 : 1; }
      function slide(band, from, to) {
        band.removeAttribute('data-anim');
        if (from !== null) { band.style.transform = 'translateY(' + (from * 101) + '%)'; void band.offsetWidth; }
        band.setAttribute('data-anim', '');
        band.style.transform = 'translateY(' + (to * 101) + '%)';
      }
      var offs = [
        R.on(el, 'pointerover', '.fm-item', function (e, it) {
          if (it.contains(e.relatedTarget)) return;
          var b = R.$('.fm-band', it); slide(b, R.reducedMotion ? 0 : edge(it, e), 0);
        }),
        R.on(el, 'pointerout', '.fm-item', function (e, it) {
          if (it.contains(e.relatedTarget)) return;
          var b = R.$('.fm-band', it); slide(b, null, R.reducedMotion ? 1 : edge(it, e));
        }),
        R.on(el, 'focusin', '.fm-item', function (e, it) { slide(R.$('.fm-band', it), 1, 0); }),
        R.on(el, 'focusout', '.fm-item', function (e, it) { slide(R.$('.fm-band', it), null, 1); })
      ];
      return function () { offs.forEach(function (f) { f(); }); bands.forEach(function (b) { b.remove(); }); };
    }
  });
})(window.Ranj);
