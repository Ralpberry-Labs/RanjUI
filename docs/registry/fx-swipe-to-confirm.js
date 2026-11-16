RanjDocs.add({
  id: 'swipe-to-confirm',
  name: 'Swipe to Confirm',
  group: 'Micro-interactions',
  description: 'Slide-to-unlock style confirmation for risky or important actions. Drag the handle past 88% or use the keyboard.',
  tags: ['new', 'fx', 'js'],
  keywords: ['slide to unlock', 'slider confirm', 'swipe button', 'drag to confirm', 'payment confirm'],
  demos: [
    { title: 'Payment', description: 'Drag the handle to the right. Keyboard: Enter, or the right arrow.', height: 240, html: `
<div style="display:grid;gap:1rem;width:340px;max-width:100%;text-align:center">
  <div style="text-align:center"><small style="color:var(--muted-fg)">Pay Blue Bottle Coffee</small><div style="font-size:2rem;font-weight:800;letter-spacing:-.03em">$12.40</div></div>
  <div class="swipe" data-reset="3000">
    <span class="swipe-fill"></span><span class="swipe-text">Slide to pay</span><span class="swipe-done">Payment sent</span>
    <span class="swipe-handle"></span>
  </div>
</div>` },
    { title: 'Danger action', html: `
<div class="swipe" style="--on:var(--destructive)" data-reset="2500">
  <span class="swipe-fill"></span><span class="swipe-text">Slide to delete project</span><span class="swipe-done">Deleted</span>
  <span class="swipe-handle"></span>
</div>` }
  ],
  api: [
    { name: '.swipe', type: 'class', desc: 'Track with <code>.swipe-fill</code>, <code>.swipe-text</code>, <code>.swipe-done</code> and <code>.swipe-handle</code>. Has <code>role="slider"</code>.' },
    { name: 'data-reset', type: 'attr', default: '0', desc: 'Return to start after N ms (0 = stay confirmed).' },
    { name: '--on / --h', type: 'var', default: '--primary / 58px', desc: 'Handle color and height.' },
    { name: 'Ranj.swipe.reset(el)', type: 'js', desc: 'Reset to the start.' },
    { name: 'ranj:confirm', type: 'event', desc: 'Fired once when confirmed.' }
  ]
});
