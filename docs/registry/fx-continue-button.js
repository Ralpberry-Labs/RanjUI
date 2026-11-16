RanjDocs.add({
  id: 'continue-button',
  name: 'Continue Button',
  group: 'Micro-interactions',
  description: 'Collapses into a round spinner, then pops into a green check. Springs back to its full width afterwards.',
  tags: ['new', 'fx', 'js'],
  keywords: ['continue', 'next', 'loading button', 'submit', 'morph spinner'],
  demos: [
    { title: 'Default', html: `
<button class="fxb continue-btn"><span class="fxb-texts"><span data-for="idle">Continue</span></span><svg class="fxb-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg><i class="fxb-spin"></i><span class="fxb-done"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></button>` },
    { title: 'Checkout step', height: 300, html: `
<div style="width:min(380px,100%);padding:1.25rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);display:grid;gap:.8rem">
  <div><small style="color:var(--muted-fg)">Step 2 of 3</small><div style="font-weight:700;font-size:1.05rem">Shipping address</div></div>
  <div style="padding:.75rem .9rem;border:1px solid var(--primary);border-radius:var(--radius-lg);font-size:.9rem;background:var(--primary-soft);color:var(--primary-soft-fg)">221B Baker Street, London NW1 6XE</div>
  <div style="display:flex;justify-content:flex-end"><button class="fxb continue-btn" data-duration="1300"><span class="fxb-texts"><span data-for="idle">Continue to payment</span></span><svg class="fxb-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg><i class="fxb-spin"></i><span class="fxb-done"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></button></div>
</div>` }
  ],
  api: [
    { name: '.fxb.continue-btn', type: 'class', desc: 'Contains label, <code>.fxb-arrow</code>, <code>.fxb-spin</code> and <code>.fxb-done</code>.' },
    { name: 'data-duration / data-manual / data-reset', type: 'attr', desc: 'Timing, see Send Button.' },
    { name: 'Ranj.fxButton', type: 'js', desc: 'Drive it manually: <code>done(el)</code>, <code>error(el)</code>, <code>reset(el)</code>.' }
  ]
});
