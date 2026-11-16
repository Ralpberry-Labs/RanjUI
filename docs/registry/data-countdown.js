RanjDocs.add({
  id: 'countdown',
  name: 'Countdown',
  group: 'Data Display',
  description: 'Live countdown to any ISO date (<code>data-to</code>) or a number of seconds. Plain, boxed, inline and a split-flap clock with real 3D flips. Fires <code>ranj:tick</code> and <code>ranj:done</code>.',
  tags: ['new', 'js'],
  keywords: ['timer', 'launch', 'flip clock', 'deadline', 'sale ends', 'clock'],
  demos: [
    {
      title: 'Launch countdown',
      html: `<div style="display:grid;gap:.75rem;justify-items:center;text-align:center">
  <span style="font-size:.8rem;font-weight:600;color:var(--primary);letter-spacing:.06em;text-transform:uppercase">Ranj UI 3.0 ships in</span>
  <div class="countdown countdown-lg" data-to="2027-01-15T17:00:00Z"></div>
</div>`
    },
    {
      title: 'Flip clock',
      description: '<code>.countdown-flip</code>: each digit is a split-flap card that folds over when it changes.',
      html: `<div class="countdown countdown-flip" data-to="2027-01-01T00:00:00"></div>`,
      height: 240
    },
    {
      title: 'Boxed',
      html: `<div class="countdown countdown-boxed" data-to="2026-12-24T18:00:00"></div>`
    },
    {
      title: 'Inline: flash sale banner',
      description: '<code>data-urgent="3600"</code> turns the numbers red in the last hour. <code>data-units="hms"</code> folds days into hours; <code>data-seconds</code> counts down from mount.',
      center: false,
      html: `<div class="demo-cd-banner">
  <span>⚡ <b>Black Friday:</b> 40% off every annual plan.</span>
  <span>Ends in <span class="countdown countdown-inline" data-seconds="8049" data-units="hms" data-urgent="3600"></span></span>
</div>`,
      css: `.demo-cd-banner { display: flex; flex-wrap: wrap; justify-content: center; gap: .35rem 1rem; padding: .8rem 1rem; border-radius: var(--radius-lg); background: var(--fg); color: var(--bg); font-size: .875rem; }`
    },
    {
      title: 'Done state',
      description: 'When time runs out the element gets <code>.is-done</code> and fires <code>ranj:done</code>.',
      html: `<div style="display:grid;gap:.6rem;justify-items:center">
  <div class="countdown countdown-boxed countdown-sm demo-cd-done" data-seconds="8" data-units="ms"></div>
  <span class="demo-cd-msg" style="font-size:.85rem;color:var(--muted-fg)">Your OTP expires soon…</span>
</div>`,
      js: `const cd = root.querySelector('.demo-cd-done');
cd.addEventListener('ranj:done', () => { root.querySelector('.demo-cd-msg').textContent = 'Code expired. Request a new one.'; });`
    }
  ],
  api: [
    { name: '.countdown[data-to]', type: 'attr', desc: 'ISO date/time to count down to (local time unless it has Z or an offset).' },
    { name: 'data-seconds', type: 'attr', desc: 'Alternative: count down this many seconds from mount.' },
    { name: 'data-units', type: 'attr', default: 'dhms', desc: 'Which units to show. Leaving out d folds days into hours.' },
    { name: 'data-labels / data-separator', type: 'attr', default: 'true / auto', desc: 'Unit labels; separator text (":" for boxed and flip).' },
    { name: 'data-urgent', type: 'attr', default: '0', desc: 'Seconds left at which .is-urgent is added (red numbers).' },
    { name: 'data-hide-zero-days', type: 'attr', default: 'false', desc: 'Drop the days unit when under 24h.' },
    { name: '.countdown-boxed / .countdown-inline / .countdown-flip', type: 'class', desc: 'Visual styles.' },
    { name: '.countdown-sm / .countdown-lg', type: 'class', desc: 'Sizes.' },
    { name: '--cd-size / --cd-gap / --flip-bg / --flip-fg / --flip-dur', type: 'var', default: '2.5rem / .75rem', desc: 'Digit size, unit spacing, flip card colors and speed.' },
    { name: 'el.ranjCountdown.set(date)', type: 'js', desc: 'Change the target.' },
    { name: 'ranj:tick', type: 'event', desc: 'Every second. detail: { remaining, days, hours, minutes, seconds }' },
    { name: 'ranj:done', type: 'event', desc: 'Once, when it reaches zero.' }
  ]
});
