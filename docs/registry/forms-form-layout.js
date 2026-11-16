(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var mail = s('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
  var card = s('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>');
  var lock = s('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>');
  var check = s('<path d="M20 6 9 17l-5-5"/>');
  var gh = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>';
  var google = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.7-2.8Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4Z"/></svg>';
  RanjDocs.add({
    id: 'form-layout',
    name: 'Form layouts',
    group: 'Forms',
    description: 'Complete, realistic forms composed from the Forms components: sign-up, checkout and account settings. Copy one and change the fields.',
    tags: ['new', 'js'],
    keywords: ['sign up form', 'register', 'checkout form', 'payment form', 'settings page', 'profile form', 'fieldset'],
    demos: [
      {
        title: 'Sign up',
        height: 640,
        html: `
<form class="demo-fl-card demo-fl-signup" data-validate>
  <div class="demo-fl-head"><div class="demo-fl-logo">R</div><h3>Create your account</h3><p>Start your 14-day free trial. No card needed.</p></div>
  <div class="demo-fl-oauth"><button type="button" class="btn btn-outline">${google}Google</button><button type="button" class="btn btn-outline">${gh}GitHub</button></div>
  <div class="demo-fl-or"><span>or continue with email</span></div>
  <div class="form-grid">
    <div class="field"><label class="label">First name</label><input class="input" name="first" required autocomplete="given-name" placeholder="Maya"></div>
    <div class="field"><label class="label">Last name</label><input class="input" name="last" required autocomplete="family-name" placeholder="Chen"></div>
    <div class="field span-2"><label class="label">Work email</label><div class="input-wrap"><span class="input-icon">${mail}</span><input type="email" name="email" required autocomplete="email" placeholder="maya@company.com"></div></div>
    <div class="field span-2"><label class="label">Password</label><div class="password" data-strength data-no-rules><input class="input" type="password" name="password" required minlength="8" autocomplete="new-password" placeholder="8+ characters"></div></div>
    <div class="field span-2"><label class="label">Team size</label>
      <div class="segmented segmented-block segmented-sm" aria-label="Team size"><label><input type="radio" name="size" value="1" checked>Just me</label><label><input type="radio" name="size" value="2-10">2–10</label><label><input type="radio" name="size" value="11-50">11–50</label><label><input type="radio" name="size" value="50+">50+</label></div>
    </div>
    <div class="field span-2"><label class="checkbox"><input type="checkbox" name="terms" required data-error-required="You need to accept the terms."><span class="checkbox-mark"></span><span>I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a></span></label></div>
  </div>
  <button class="btn btn-primary btn-block demo-fl-submit">Create account</button>
  <p class="demo-fl-foot">Already have an account? <a href="#">Sign in</a></p>
</form>`,
        js: `
const f = root.querySelector('form');
f.addEventListener('submit', e => { e.preventDefault(); const b = f.querySelector('.demo-fl-submit'); b.textContent = 'Account created ✓'; setTimeout(() => b.textContent = 'Create account', 1800); });`,
        css: `
.demo-fl-card { width: 27rem; max-width: 100%; padding: 1.75rem; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-2xl); box-shadow: var(--shadow-lg); }
.demo-fl-head { text-align: center; margin-bottom: 1.25rem; }
.demo-fl-logo { width: 2.5rem; height: 2.5rem; margin: 0 auto .75rem; display: grid; place-items: center; border-radius: var(--radius-lg); font-weight: 800; color: var(--primary-fg); background: linear-gradient(135deg, var(--primary), oklch(.6 .22 calc(var(--hue) + 50))); box-shadow: var(--shadow-glow); }
.demo-fl-head h3 { font-size: 1.25rem; font-weight: 700; letter-spacing: -.02em; }
.demo-fl-head p { font-size: .85rem; color: var(--muted-fg); margin-top: .2rem; }
.demo-fl-oauth { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
.demo-fl-oauth svg { width: 1rem; height: 1rem; }
.demo-fl-or { display: flex; align-items: center; gap: .75rem; margin: 1.1rem 0; font-size: .75rem; color: var(--muted-fg); }
.demo-fl-or::before, .demo-fl-or::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.demo-fl-submit { width: 100%; margin-top: 1.25rem; }
.demo-fl-foot { text-align: center; font-size: .82rem; color: var(--muted-fg); margin-top: 1rem; }
.demo-fl-checkout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 16.5rem); gap: 1.25rem; width: 44rem; max-width: 100%; align-items: start; }
.demo-fl-main { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-xl); }
.demo-fl-main legend { margin-bottom: .75rem; }
.demo-fl-summary { position: sticky; top: 1rem; display: flex; flex-direction: column; gap: .9rem; padding: 1.25rem; background: var(--bg-subtle); border: 1px solid var(--border); border-radius: var(--radius-xl); }
.demo-fl-summary h4 { font-size: .95rem; font-weight: 600; }
.demo-fl-item { display: flex; align-items: center; gap: .6rem; font-size: .82rem; }
.demo-fl-item > div:nth-child(2) { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.demo-fl-item small { color: var(--muted-fg); }
.demo-fl-thumb { width: 2.4rem; height: 2.4rem; display: grid; place-items: center; font-size: 1.2rem; border-radius: var(--radius); background: var(--card); border: 1px solid var(--border); flex-shrink: 0; }
.demo-fl-item .number-input input { width: 1.8rem; }
.demo-fl-summary dl { display: grid; gap: .45rem; font-size: .85rem; padding-top: .9rem; border-top: 1px solid var(--border); }
.demo-fl-summary dl div { display: flex; justify-content: space-between; } .demo-fl-summary dt { color: var(--muted-fg); }
.demo-fl-summary dd { font-variant-numeric: tabular-nums; margin: 0; }
.demo-fl-total { padding-top: .5rem; border-top: 1px dashed var(--border); font-weight: 700; font-size: 1rem; } .demo-fl-total dt { color: var(--fg) !important; }
.demo-fl-summary .btn svg { width: 1rem; height: 1rem; }
@media (max-width: 760px) { .demo-fl-checkout { grid-template-columns: 1fr; } .demo-fl-summary { position: static; } }
.demo-fl-settings { width: 44rem; max-width: 100%; }
.demo-fl-avatar-row { display: flex; align-items: center; gap: 1rem; font-size: .9rem; }
.demo-fl-settings .btn svg { width: 1rem; height: 1rem; }
`
      },
      {
        title: 'Checkout',
        height: 700,
        html: `
<form class="demo-fl-checkout" data-validate>
  <div class="demo-fl-main">
    <fieldset class="fieldset">
      <legend>Contact</legend>
      <div class="field"><label class="label">Email</label><input class="input" type="email" required value="maya@acme.dev" autocomplete="email"></div>
    </fieldset>
    <fieldset class="fieldset">
      <legend>Shipping</legend>
      <div class="form-grid">
        <div class="field span-2"><label class="label">Full name</label><input class="input" required value="Maya Chen" autocomplete="name"></div>
        <div class="field span-2"><label class="label">Address</label><input class="input" required value="148 Wythe Ave, Apt 3" autocomplete="street-address"></div>
        <div class="field"><label class="label">City</label><input class="input" required value="Brooklyn" autocomplete="address-level2"></div>
        <div class="field"><label class="label">ZIP</label><input class="input" required value="11249" inputmode="numeric" pattern="[0-9]{5}" data-error-pattern="Use a 5-digit ZIP." autocomplete="postal-code"></div>
        <div class="field span-2"><label class="label">Country</label>
          <div class="custom-select" data-search><select name="country"><option data-icon="🇺🇸" selected>United States</option><option data-icon="🇨🇦">Canada</option><option data-icon="🇬🇧">United Kingdom</option><option data-icon="🇩🇪">Germany</option><option data-icon="🇯🇵">Japan</option></select></div>
        </div>
      </div>
    </fieldset>
    <fieldset class="fieldset">
      <legend>Delivery</legend>
      <div class="card-grid" role="radiogroup" aria-label="Delivery">
        <label class="radio-card radio-card-row"><input type="radio" name="ship" checked><span class="radio-mark"></span><span class="radio-body"><span class="radio-card-title">Standard</span><span class="radio-card-desc">4–6 days · Free</span></span></label>
        <label class="radio-card radio-card-row"><input type="radio" name="ship"><span class="radio-mark"></span><span class="radio-body"><span class="radio-card-title">Express</span><span class="radio-card-desc">Tomorrow · $12</span></span></label>
      </div>
    </fieldset>
    <fieldset class="fieldset">
      <legend>Payment</legend>
      <div class="form-grid">
        <div class="field span-2"><label class="label">Card number</label><div class="input-wrap"><span class="input-icon">${card}</span><input inputmode="numeric" required autocomplete="cc-number" placeholder="1234 1234 1234 1234" pattern="[0-9 ]{15,19}" data-error-pattern="Check the card number."><span class="input-icon">${lock}</span></div></div>
        <div class="field"><label class="label">Expiry</label><input class="input" required placeholder="MM / YY" autocomplete="cc-exp"></div>
        <div class="field"><label class="label">CVC</label><input class="input" required placeholder="123" inputmode="numeric" maxlength="4" autocomplete="cc-csc"></div>
      </div>
    </fieldset>
  </div>
  <aside class="demo-fl-summary">
    <h4>Order summary</h4>
    <div class="demo-fl-item"><span class="demo-fl-thumb">🎧</span><div><b>Studio headphones</b><small>Midnight</small></div><div class="number-input number-input-pill number-input-sm"><input type="number" min="1" max="9" value="1" aria-label="Quantity"></div></div>
    <div class="demo-fl-item"><span class="demo-fl-thumb">🔌</span><div><b>USB-C cable 2m</b><small>Braided</small></div><div class="number-input number-input-pill number-input-sm"><input type="number" min="1" max="9" value="2" aria-label="Quantity"></div></div>
    <div class="input-group"><input class="input input-sm" placeholder="Discount code"><button type="button" class="btn btn-outline btn-sm">Apply</button></div>
    <dl><div><dt>Subtotal</dt><dd>$227.00</dd></div><div><dt>Shipping</dt><dd>Free</dd></div><div><dt>Tax</dt><dd>$20.15</dd></div><div class="demo-fl-total"><dt>Total</dt><dd>$247.15</dd></div></dl>
    <button class="btn btn-primary btn-block">${lock}Pay $247.15</button>
  </aside>
</form>`,
        js: `root.querySelector('form').addEventListener('submit', e => e.preventDefault());`
      },
      {
        title: 'Account settings',
        height: 600,
        html: `
<form class="demo-fl-settings" onsubmit="return false">
  <section class="form-section">
    <div class="form-section-head"><h3>Profile</h3><p>This information is shown publicly on your profile.</p></div>
    <div class="form-stack">
      <div class="demo-fl-avatar-row">
        <div class="dropzone dropzone-image dropzone-avatar" aria-label="Upload photo" style="width:4.5rem;height:4.5rem;padding:.5rem"><input type="file" accept="image/*"><span class="dropzone-hint">Photo</span></div>
        <div><b>Profile photo</b><p class="field-hint" style="margin:0">JPG or PNG, at least 256 × 256.</p></div>
      </div>
      <div class="form-grid">
        <div class="field"><label class="label">Display name</label><input class="input" value="Maya Chen"></div>
        <div class="field"><label class="label">Username</label><div class="input-wrap"><span class="input-prefix">ranj.dev/</span><input value="maya"></div></div>
      </div>
      <div class="field"><label class="label">Bio</label><textarea class="textarea" data-autosize data-maxlength="160" rows="2">Product designer in Brooklyn. Into type, motion and good coffee.</textarea></div>
      <div class="field"><label class="label">Expertise</label><div class="tag-input" data-value="Design systems, Prototyping, Motion" data-max="6"></div></div>
    </div>
  </section>
  <section class="form-section">
    <div class="form-section-head"><h3>Preferences</h3><p>Language, region and appearance.</p></div>
    <div class="form-stack">
      <div class="form-grid">
        <div class="field"><label class="label">Language</label><div class="custom-select"><select><option selected>English (US)</option><option>Deutsch</option><option>Español</option><option>日本語</option></select></div></div>
        <div class="field"><label class="label">Week starts on</label><div class="segmented segmented-block" aria-label="Week starts on"><label><input type="radio" name="wk" checked>Sunday</label><label><input type="radio" name="wk">Monday</label></div></div>
      </div>
      <div class="field"><label class="label">Accent color</label><div class="color-picker" data-value="#6366f1"></div></div>
    </div>
  </section>
  <section class="form-section">
    <div class="form-section-head"><h3>Notifications</h3><p>Choose what we email you about.</p></div>
    <div class="switch-list">
      <label class="switch switch-row"><span class="switch-body"><span class="switch-label">Mentions</span><span class="switch-desc">When someone @mentions you.</span></span><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span></label>
      <label class="switch switch-row"><span class="switch-body"><span class="switch-label">Weekly summary</span><span class="switch-desc">Every Monday at 9 AM.</span></span><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span></label>
      <label class="switch switch-row"><span class="switch-body"><span class="switch-label">Product news</span><span class="switch-desc">About once a month.</span></span><input type="checkbox"><span class="switch-track"><span class="switch-thumb"></span></span></label>
    </div>
  </section>
  <div class="form-actions"><button type="reset" class="btn btn-ghost">Cancel</button><button class="btn btn-primary">${check}Save changes</button></div>
</form>`
      }
    ],
    api: [
      { name: '.form-grid', type: 'class', desc: 'Two-column field grid (<code>--cols</code>), one column under 560px. <code>.span-2</code>, <code>.span-full</code>.' },
      { name: '.form-stack', type: 'class', desc: 'Vertical rhythm for fields.' },
      { name: '.form-section', type: 'class', desc: 'Settings section: heading + description on the left (<code>.form-section-head</code>), fields on the right; stacks under 720px.' },
      { name: '.fieldset / legend / .fieldset-desc', type: 'class', desc: 'Grouped fields with a title.' },
      { name: '.form-actions / .form-actions-between', type: 'class', desc: 'Button row aligned right / spread.' }
    ]
  });
})();
