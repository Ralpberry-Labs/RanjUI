RanjDocs.add({
  id: 'send-button',
  name: 'Send Button',
  group: 'Micro-interactions',
  description: 'The paper plane takes off with a light trail, loops out of the button, and a check lands in its place.',
  tags: ['new', 'fx', 'js'],
  keywords: ['send', 'paper plane', 'submit', 'message sent', 'email'],
  demos: [
    { title: 'Default', html: `
<button class="fxb send-btn"><span class="fxb-icon"><svg class="fxb-plane" viewBox="0 0 24 24"><path d="M21.5 2.5 10.5 13.5"/><path d="M21.5 2.5 14.5 21.5l-4-8-8-4z"/></svg><svg class="fxb-check" viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="fxb-texts"><span data-for="idle">Send message</span><span data-for="busy">Sending</span><span data-for="done">Sent</span></span></button>` },
    { title: 'In a composer', height: 300, html: `
<div style="width:min(420px,100%);border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);overflow:hidden">
  <div style="padding:.7rem 1rem;border-bottom:1px solid var(--border);font-size:.85rem;color:var(--muted-fg)">To: <b style="color:var(--fg)">priya@northwind.io</b></div>
  <div style="padding:1rem;font-size:.92rem;min-height:96px">Hi Priya, the Q4 deck is attached. Let me know if the revenue slide needs another pass before Friday.</div>
  <div style="display:flex;justify-content:flex-end;padding:.6rem .75rem;border-top:1px solid var(--border)">
    <button class="fxb send-btn" style="height:var(--control-h)"><span class="fxb-icon"><svg class="fxb-plane" viewBox="0 0 24 24"><path d="M21.5 2.5 10.5 13.5"/><path d="M21.5 2.5 14.5 21.5l-4-8-8-4z"/></svg><svg class="fxb-check" viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="fxb-texts"><span data-for="idle">Send</span><span data-for="busy">Sending</span><span data-for="done">Sent</span></span></button>
  </div>
</div>` }
  ],
  api: [
    { name: '.fxb.send-btn', type: 'class', desc: 'Stateful button. Contains <code>.fxb-icon</code> (plane + check) and <code>.fxb-texts</code>.' },
    { name: '.fxb-texts > [data-for]', type: 'class', desc: 'One span per state: <code>idle busy done error</code>. Announced politely to screen readers.' },
    { name: 'data-duration', type: 'attr', default: '1100', desc: 'Simulated send time (ms).' },
    { name: 'data-manual', type: 'attr', desc: 'Stay busy until you call <code>Ranj.fxButton.done(el)</code> or <code>.error(el)</code>.' },
    { name: 'data-reset', type: 'attr', default: '2600', desc: 'Return to idle after this many ms; 0 keeps the done state.' },
    { name: 'Ranj.fxButton', type: 'js', desc: '<code>start(el) progress(el, 0..1) done(el) error(el) reset(el)</code>' },
    { name: 'ranj:start / ranj:done', type: 'event', desc: 'start is cancelable: call preventDefault() to stop it.' }
  ]
});
