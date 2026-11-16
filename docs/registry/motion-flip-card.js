RanjDocs.add({
  id: 'flip-card',
  name: 'Flip Card',
  group: 'Motion',
  description: 'A two-sided card that flips in 3D on hover, or on click and keyboard with .flip-card-click. Horizontal or vertical axis, auto height.',
  tags: ['new', 'fx'],
  keywords: ['3d flip', 'card flip', 'back side', 'reveal card', 'rotate'],
  demos: [
    {
      title: 'Payment card (hover)',
      height: 280,
      html: `
<div class="flip-card" style="--flip-w: 340px">
  <div class="flip-card-inner">
    <div class="flip-card-front demo-flip-card-cc">
      <div class="demo-flip-card-row"><span class="demo-flip-card-chip"></span><b>RANJ</b></div>
      <div class="demo-flip-card-num">4921 •••• •••• 0428</div>
      <div class="demo-flip-card-row"><span>ALEX MORGAN</span><span>09/29</span></div>
    </div>
    <div class="flip-card-back demo-flip-card-cc demo-flip-card-back">
      <div class="demo-flip-card-stripe"></div>
      <div class="demo-flip-card-cvc"><span>CVC</span><b>•••</b></div>
      <small>Hover away to flip back</small>
    </div>
  </div>
</div>`,
      css: `.demo-flip-card-cc { aspect-ratio: 1.586; padding: 1.25rem 1.4rem; color: #fff; display: flex; flex-direction: column; justify-content: space-between; background: radial-gradient(120% 120% at 0% 0%, #818cf8, #4338ca 45%, #1e1b4b); box-shadow: 0 25px 50px -15px rgb(30 27 75 / .6); }
.demo-flip-card-row { display: flex; justify-content: space-between; align-items: center; font-size: .8rem; letter-spacing: .08em; }
.demo-flip-card-row b { font-size: 1.1rem; letter-spacing: .15em; }
.demo-flip-card-chip { width: 42px; height: 32px; border-radius: 6px; background: linear-gradient(135deg, #fde68a, #d97706); }
.demo-flip-card-num { font-family: var(--font-mono); font-size: 1.2rem; letter-spacing: .1em; }
.demo-flip-card-back { justify-content: flex-start; gap: 1rem; padding: 1.25rem 0; background: linear-gradient(135deg, #312e81, #1e1b4b); }
.demo-flip-card-stripe { height: 42px; background: #0b0a1f; }
.demo-flip-card-cvc { display: flex; justify-content: flex-end; align-items: center; gap: .6rem; margin: 0 1.4rem; padding: .4rem .7rem; border-radius: 4px; background: #e0e7ff; color: #1e1b4b; font-size: .75rem; }
.demo-flip-card-back small { margin: auto 1.4rem 0; opacity: .6; font-size: .72rem; }`
    },
    {
      title: 'Click to flip (vertical)',
      height: 320,
      html: `
<div class="flip-card flip-card-click flip-card-vertical" style="--flip-w: 280px" aria-label="Profile card, press to flip">
  <div class="flip-card-inner">
    <div class="flip-card-front demo-flip-card-face">
      <div class="demo-flip-card-avatar">SK</div>
      <b>Sana Kapoor</b><span>Staff Design Engineer</span>
      <small>Click to see stats ↻</small>
    </div>
    <div class="flip-card-back demo-flip-card-face demo-flip-card-face-back">
      <div class="demo-flip-card-stats"><div><b>128</b><span>Shipped</span></div><div><b>4.9</b><span>Rating</span></div><div><b>9y</b><span>Exp.</span></div></div>
      <a class="btn btn-primary btn-sm" href="#" onclick="return false">View profile</a>
    </div>
  </div>
</div>`,
      css: `.demo-flip-card-face { min-height: 240px; padding: 1.5rem; display: grid; place-content: center; justify-items: center; gap: .3rem; text-align: center; background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-lg); }
.demo-flip-card-face span { color: var(--muted-fg); font-size: .875rem; } .demo-flip-card-face small { margin-top: .75rem; color: var(--muted-fg); font-size: .75rem; }
.demo-flip-card-avatar { width: 72px; height: 72px; border-radius: 50%; display: grid; place-items: center; margin-bottom: .5rem; font-weight: 800; font-size: 1.4rem; color: #fff; background: linear-gradient(135deg, #14b8a6, #6366f1); }
.demo-flip-card-face-back { gap: 1.25rem; background: linear-gradient(160deg, var(--primary-soft), var(--card)); }
.demo-flip-card-stats { display: flex; gap: 1.5rem; } .demo-flip-card-stats div { display: grid; } .demo-flip-card-stats b { font-size: 1.5rem; }`
    }
  ],
  api: [
    { name: '.flip-card', type: 'class', desc: 'Wrapper; flips on hover and focus-within.' },
    { name: '.flip-card-inner / -front / -back', type: 'class', desc: 'Required structure. Height follows the taller face.' },
    { name: '.flip-card-click', type: 'class', desc: 'Flip on click / Enter / Space instead of hover (ranj.js sets role and aria-pressed).' },
    { name: '.flip-card-vertical', type: 'class', desc: 'Flip around the X axis.' },
    { name: 'data-state="flipped"', type: 'attr', desc: 'Set to flip programmatically.' },
    { name: '--flip-dur / --flip-w / --flip-h', type: 'var', default: '700ms / 280px / auto', desc: 'Duration, width and min height.' },
    { name: 'ranj:flip', type: 'event', desc: 'detail: <code>{ flipped }</code> (click mode).' }
  ]
});
