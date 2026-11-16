RanjDocs.add({
  id: 'subscribe-input',
  name: 'Subscribe Input',
  group: 'Micro-interactions',
  description: 'An email field whose button stretches across it with a spinner, then turns into a success message. Invalid emails shake.',
  tags: ['new', 'fx', 'js'],
  keywords: ['newsletter', 'email signup', 'subscribe', 'waitlist', 'form'],
  demos: [
    { title: 'Newsletter', description: 'Try an invalid email first, then a real one.', height: 260, html: `
<div style="display:grid;justify-items:center;gap:.9rem;text-align:center;width:min(440px,100%)">
  <b style="font-size:1.2rem">Get the Friday digest</b>
  <p style="color:var(--muted-fg);font-size:.9rem;margin-top:-.4rem">One email a week with the best new components. No spam.</p>
  <form class="subscribe" novalidate>
    <input class="subscribe-input" type="email" placeholder="you@company.com" aria-label="Email address" autocomplete="email">
    <button class="subscribe-btn"><span>Subscribe</span><div class="subscribe-success"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>You're in! Check your inbox.</div></button>
  </form>
</div>` },
    { title: 'Your own backend', description: 'With <code>data-manual</code>, listen for <code>ranj:subscribe</code> and call <code>done()</code> or <code>fail(msg)</code>.', height: 200, html: `
<form class="subscribe" data-manual novalidate>
  <input class="subscribe-input" type="email" placeholder="Join the waitlist" aria-label="Email address">
  <button class="subscribe-btn"><span>Join waitlist</span><div class="subscribe-success"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>You're #1,284 on the list</div></button>
</form>`, js: `
root.querySelector('.subscribe').addEventListener('ranj:subscribe', function (e) {
  setTimeout(function () { /taken/.test(e.detail.email) ? e.detail.fail('That email is already on the list.') : e.detail.done(); }, 900);
});` }
  ],
  api: [
    { name: '.subscribe', type: 'class', desc: 'A <code>&lt;form&gt;</code> with <code>.subscribe-input</code>, <code>.subscribe-btn</code> and an optional <code>.subscribe-success</code>.' },
    { name: 'data-manual', type: 'attr', desc: 'Wait for <code>detail.done()</code> / <code>detail.fail(msg)</code> instead of auto success.' },
    { name: 'data-delay', type: 'attr', default: '1300', desc: 'Simulated request time (ms).' },
    { name: 'data-invalid', type: 'attr', desc: 'Custom invalid email message.' },
    { name: 'Ranj.subscribe.reset(el)', type: 'js', desc: 'Back to the empty idle state.' },
    { name: 'ranj:subscribe', type: 'event', desc: 'detail: { email, done(), fail(msg) }' }
  ]
});
