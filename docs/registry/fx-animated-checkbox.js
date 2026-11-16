RanjDocs.add({
  id: 'animated-checkbox',
  name: 'Animated Checkbox',
  group: 'Micro-interactions',
  description: 'A native checkbox with a bouncy box, a hand-drawn check stroke, a ripple ring and optional strike-through. CSS only.',
  tags: ['new', 'fx'],
  keywords: ['checkbox', 'todo', 'check', 'strike through', 'task list'],
  demos: [
    { title: 'Todo list', height: 300, html: `
<div style="width:min(360px,100%);padding:1.1rem 1.25rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);display:grid;gap:.85rem">
  <div style="display:flex;justify-content:space-between;align-items:baseline"><b>Today</b><small style="color:var(--muted-fg)">Tue, Nov 17</small></div>
  <label class="check-anim check-anim-strike"><input type="checkbox" checked><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="check-anim-text">Review Sam's pull request</span></label>
  <label class="check-anim check-anim-strike"><input type="checkbox"><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="check-anim-text">Book flights to Lisbon</span></label>
  <label class="check-anim check-anim-strike"><input type="checkbox"><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="check-anim-text">Pick up oat milk</span></label>
  <label class="check-anim check-anim-strike"><input type="checkbox"><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="check-anim-text">Call the dentist before 5pm</span></label>
</div>` },
    { title: 'Shapes and colors', html: `
<label class="check-anim"><input type="checkbox" checked><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>Square</label>
<label class="check-anim check-anim-circle" style="--on:var(--success)"><input type="checkbox" checked><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>Circle</label>
<label class="check-anim check-anim-lg" style="--on:#f43f5e"><input type="checkbox"><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>Large</label>
<label class="check-anim"><input type="checkbox" disabled><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>Disabled</label>` }
  ],
  api: [
    { name: '.check-anim', type: 'class', desc: 'A <code>&lt;label&gt;</code> wrapping a real checkbox, the box and the text. The path needs <code>pathLength="1"</code>.' },
    { name: '.check-anim-strike', type: 'class', desc: 'Strike through and dim the text when checked.' },
    { name: '.check-anim-circle / .check-anim-lg', type: 'class', desc: 'Round box, larger size.' },
    { name: '--on / --size', type: 'var', default: '--primary / 22px', desc: 'Checked color and box size.' }
  ]
});
