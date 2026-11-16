RanjDocs.add({
  id: 'stack-cards',
  name: 'Stack Cards',
  group: 'Motion',
  description: 'A swipeable card deck: drag with rotation and LIKE / NOPE stamps, fling with velocity, or use arrow keys and buttons. Swiped cards go to the back.',
  tags: ['new', 'fx', 'js'],
  keywords: ['tinder', 'swipe', 'deck', 'cards', 'drag', 'fling', 'stack'],
  demos: [
    {
      title: 'Travel deck',
      height: 560,
      html: `
<div class="demo-stack-cards-wrap">
  <div class="stack-cards" aria-label="Destinations">
    <div class="stack-card"><div class="demo-stack-cards-photo" style="background:linear-gradient(160deg,#fda4af,#be185d 60%,#4c0519)">🗼</div><div class="demo-stack-cards-info"><b>Kyoto, Japan</b><span>Temples, tea houses &amp; maple season</span></div><span class="sc-stamp sc-stamp-like">LIKE</span><span class="sc-stamp sc-stamp-nope">NOPE</span></div>
    <div class="stack-card"><div class="demo-stack-cards-photo" style="background:linear-gradient(160deg,#a5f3fc,#0891b2 60%,#083344)">🏝️</div><div class="demo-stack-cards-info"><b>Palawan, Philippines</b><span>Limestone lagoons &amp; island hopping</span></div><span class="sc-stamp sc-stamp-like">LIKE</span><span class="sc-stamp sc-stamp-nope">NOPE</span></div>
    <div class="stack-card"><div class="demo-stack-cards-photo" style="background:linear-gradient(160deg,#fde68a,#ea580c 60%,#431407)">🏜️</div><div class="demo-stack-cards-info"><b>Wadi Rum, Jordan</b><span>Red dunes under a sky full of stars</span></div><span class="sc-stamp sc-stamp-like">LIKE</span><span class="sc-stamp sc-stamp-nope">NOPE</span></div>
    <div class="stack-card"><div class="demo-stack-cards-photo" style="background:linear-gradient(160deg,#bbf7d0,#15803d 60%,#052e16)">🏔️</div><div class="demo-stack-cards-info"><b>Dolomites, Italy</b><span>Via ferrata and alpine huts</span></div><span class="sc-stamp sc-stamp-like">LIKE</span><span class="sc-stamp sc-stamp-nope">NOPE</span></div>
  </div>
  <div class="demo-stack-cards-actions">
    <button class="demo-stack-cards-btn nope" data-swipe="left" aria-label="Nope">✕</button>
    <button class="demo-stack-cards-btn like" data-swipe="right" aria-label="Like">♥</button>
  </div>
  <p class="demo-stack-cards-log">Drag, flick, or use ← →</p>
</div>`,
      js: `var log = root.querySelector('.demo-stack-cards-log');
root.addEventListener('ranj:swipe', function (e) { log.textContent = (e.detail.direction === 'right' ? '♥ Liked ' : '✕ Passed ') + e.detail.card.querySelector('b').textContent; });`,
      css: `.demo-stack-cards-wrap { display: grid; justify-items: center; gap: 1.25rem; padding-top: .5rem; }
.demo-stack-cards-photo { height: 72%; display: grid; place-items: center; font-size: 5rem; }
.demo-stack-cards-info { padding: 1rem 1.2rem; display: grid; gap: .15rem; } .demo-stack-cards-info b { font-size: 1.15rem; } .demo-stack-cards-info span { color: var(--muted-fg); font-size: .85rem; }
.demo-stack-cards-actions { display: flex; gap: 1.25rem; margin-top: 1rem; }
.demo-stack-cards-btn { width: 3.5rem; height: 3.5rem; border-radius: 50%; display: grid; place-items: center; font-size: 1.4rem; background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-md); transition: transform .2s var(--ease-spring); }
.demo-stack-cards-btn:hover { transform: scale(1.1); } .demo-stack-cards-btn.nope { color: #ef4444; } .demo-stack-cards-btn.like { color: #22c55e; }
.demo-stack-cards-log { color: var(--muted-fg); font-size: .85rem; min-height: 1.4em; }`
    }
  ],
  api: [
    { name: '.stack-cards', type: 'class', desc: 'Deck container (focusable; ← → swipe).' },
    { name: '.stack-card', type: 'class', desc: 'Each card.' },
    { name: '.sc-stamp-like / .sc-stamp-nope', type: 'class', desc: 'Optional stamps that fade in with drag direction (driven by <code>--sc-drag</code>).' },
    { name: 'data-swipe="left|right"', type: 'attr', desc: 'Put on buttons next to the deck (same parent).' },
    { name: 'data-loop', type: 'attr', default: 'true', desc: '<code>false</code> removes swiped cards instead of recycling them.' },
    { name: 'data-threshold', type: 'attr', default: '110', desc: 'Drag distance in px that commits a swipe (fast flicks also count).' },
    { name: 'data-visible', type: 'attr', default: '3', desc: 'Cards shown behind the top one.' },
    { name: '--sc-w / --sc-h / --sc-offset / --sc-scale', type: 'var', default: '300px / 380px / 14px / .05', desc: 'Size and stacking geometry.' },
    { name: 'Ranj.instance(el, "stack-cards").swipe(dir)', type: 'js', desc: 'Swipe programmatically.' },
    { name: 'ranj:swipe', type: 'event', desc: 'detail: <code>{ direction, card, index }</code>' },
    { name: 'ranj:empty', type: 'event', desc: 'All cards swiped (when not looping).' }
  ]
});
