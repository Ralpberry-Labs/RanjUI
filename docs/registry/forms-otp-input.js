RanjDocs.add({
  id: 'otp-input',
  name: 'OTP input',
  group: 'Forms',
  description: 'One-time-code boxes that auto-advance as you type, fill all at once on paste or SMS autofill, step back on Backspace, and fire <code>ranj:complete</code> when full.',
  tags: ['new', 'js'],
  keywords: ['one time password', 'verification code', 'pin input', '2fa', 'mfa', 'sms code'],
  demos: [
    {
      title: 'Verify your email',
      description: 'The code is <b>424242</b>. Try pasting <code>123-456</code> into any box.',
      html: `
<div class="demo-otp-card">
  <div class="demo-otp-icon">✉️</div>
  <h4>Check your inbox</h4>
  <p>We sent a 6-digit code to <b>maya@acme.dev</b></p>
  <div class="otp" data-length="6" data-group="3" data-name="code" aria-label="Verification code"></div>
  <p class="demo-otp-msg" aria-live="polite">Didn’t get it? <a href="#" onclick="return false">Resend in 0:42</a></p>
</div>`,
      js: `
const otp = root.querySelector('.otp'), msg = root.querySelector('.demo-otp-msg');
otp.addEventListener('ranj:complete', e => {
  const inst = Ranj.otp(otp);
  if (e.detail.value === '424242') { inst.setState('success'); msg.innerHTML = '<span style="color:var(--success-soft-fg);font-weight:500">Verified — welcome back!</span>'; }
  else { inst.setState('error'); msg.innerHTML = '<span style="color:var(--destructive);font-weight:500">That code didn’t work. Try 424242.</span>'; }
});`,
      css: `
.demo-otp-card { width: 24rem; max-width: 100%; padding: 1.75rem 1.25rem; text-align: center; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; align-items: center; }
.demo-otp-icon { font-size: 1.5rem; width: 3rem; height: 3rem; display: grid; place-items: center; border-radius: 50%; background: var(--primary-soft); margin-bottom: .75rem; }
.demo-otp-card h4 { font-size: 1.05rem; font-weight: 600; }
.demo-otp-card > p { font-size: .85rem; color: var(--muted-fg); margin: .25rem 0 1.25rem; }
.demo-otp-card .demo-otp-msg { margin: 1.1rem 0 0; font-size: .8rem; }`
    },
    {
      title: 'Variants',
      html: `
<div style="display:grid;gap:1.25rem;justify-items:center">
  <div class="otp otp-joined" data-length="6" data-group="3" aria-label="Joined"></div>
  <div class="otp otp-sm" data-length="4" data-masked aria-label="PIN"></div>
  <div class="otp otp-lg" data-length="5" data-type="alphanumeric" aria-label="Invite code"></div>
</div>`
    }
  ],
  api: [
    { name: '.otp', type: 'class', desc: 'Container; slots are generated (or use your own <code>input.otp-slot</code>s).' },
    { name: '.otp-joined / .otp-sm / .otp-lg', type: 'class', desc: 'Attached boxes and sizes.' },
    { name: 'data-length', type: 'attr', default: '6', desc: 'Number of boxes.' },
    { name: 'data-group', type: 'attr', desc: 'Insert a separator every N boxes.' },
    { name: 'data-type', type: 'attr', default: 'numeric', desc: '<code>numeric</code>, <code>alpha</code> or <code>alphanumeric</code> (uppercased).' },
    { name: 'data-masked', type: 'attr', desc: 'Hide characters like a password.' },
    { name: 'data-name / data-autofocus / data-free', type: 'attr', desc: 'Hidden input name, focus on load, allow focusing any box (by default focus jumps to the first empty one).' },
    { name: 'Ranj.otp(el)', type: 'js', desc: '<code>{ value, clear(), setState("error" | "success" | null) }</code>. Error shakes the boxes.' },
    { name: 'ranj:change / ranj:complete', type: 'event', desc: 'detail: <code>{ value, complete }</code> / <code>{ value }</code>' }
  ]
});
