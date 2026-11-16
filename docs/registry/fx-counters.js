RanjDocs.add({
  id: 'counters',
  name: 'Counters',
  group: 'Micro-interactions',
  description: 'Stepper counters in three styles: frosted glass, a ring of dots that light up, and a progress ring. Hold a button to repeat.',
  tags: ['new', 'fx', 'js'],
  keywords: ['stepper', 'counter', 'quantity', 'increment', 'number input', 'dial'],
  demos: [
    { title: 'Frosted glass', pad: false, center: false, height: 320, html: `
<div style="min-height:320px;display:grid;place-items:center;padding:2rem 1rem;background:radial-gradient(40% 60% at 30% 35%, #f472b6, transparent 70%),radial-gradient(45% 60% at 70% 65%, #38bdf8, transparent 70%),linear-gradient(135deg,#6d28d9,#0f172a)">
  <div class="counter counter-glass" data-value="2" data-min="1" data-max="12" tabindex="0" aria-label="Guests">
    <span class="counter-label">Guests</span>
    <div class="counter-row"><button class="counter-btn" data-counter="dec"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button><span class="counter-value odometer" data-counter-value>2</span><button class="counter-btn" data-counter="inc"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>
  </div>
</div>` },
    { title: 'Dotted circle', height: 340, html: `
<div class="counter counter-dots" data-value="18" data-min="0" data-max="30" data-dots="30" tabindex="0" aria-label="Daily glasses of water goal">
  <div class="counter-dots-ring"><div class="counter-center"><span class="counter-value" data-counter-value>18</span><span class="counter-label">minutes focus</span></div></div>
  <div class="counter-row"><button class="counter-btn" data-counter="dec"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button><button class="counter-btn" data-counter="inc"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>
</div>` },
    { title: 'Progress ring', height: 340, html: `
<div class="counter counter-ring" data-value="6" data-min="0" data-max="8" tabindex="0" aria-label="Glasses of water">
  <div class="counter-ring-wrap"><svg viewBox="0 0 100 100"><circle class="cr-track" cx="50" cy="50" r="44"/><circle class="cr-val" cx="50" cy="50" r="44" pathLength="1"/></svg>
    <div class="counter-center"><span class="counter-value odometer" data-counter-value>6</span><span class="counter-label">of 8 glasses</span></div></div>
  <div class="counter-row"><button class="counter-btn" data-counter="dec"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button><button class="counter-btn" data-counter="inc"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>
</div>` }
  ],
  api: [
    { name: '.counter', type: 'class', desc: 'Root. Add <code>.counter-glass</code>, <code>.counter-dots</code> or <code>.counter-ring</code>.' },
    { name: 'data-value / data-min / data-max / data-step', type: 'attr', default: '0 / 0 / 99 / 1', desc: 'Range.' },
    { name: '[data-counter="inc|dec"]', type: 'attr', desc: 'Buttons. Hold to repeat. Arrow keys, Home and End work when the root is focused.' },
    { name: '[data-counter-value]', type: 'attr', desc: 'Displays the value; add <code>.odometer</code> for rolling digits.' },
    { name: 'data-dots', type: 'attr', default: '30', desc: 'Dot count for <code>.counter-dots</code>.' },
    { name: '--p', type: 'var', desc: 'Progress 0..1, set on the root for your own styling.' },
    { name: 'Ranj.counter(el, value)', type: 'js', desc: 'Set the value.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { value }' }
  ]
});
