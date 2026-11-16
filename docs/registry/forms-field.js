(function () {
  var mail = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
  RanjDocs.add({
    id: 'field',
    name: 'Field',
    group: 'Forms',
    description: 'Wraps a control with its label, hint and error message, and wires up <code>for</code>, <code>aria-describedby</code> and <code>aria-invalid</code> for you. <code>Ranj.validate(form)</code> uses native constraint validation to show inline errors with a shake.',
    tags: ['js'],
    keywords: ['form group', 'label', 'hint', 'helper text', 'error', 'validation', 'form-group'],
    demos: [
      {
        title: 'Label, hint and error',
        html: `
<div style="width:22rem;max-width:100%">
  <div class="field">
    <label class="label">Workspace name</label>
    <input class="input" value="Acme Robotics">
    <p class="field-hint">This is how your team will see it in the sidebar.</p>
  </div>
  <div class="field">
    <div class="field-row"><label class="label label-required">Work email</label><a href="#">Why?</a></div>
    <input class="input" type="email" value="maya@acme" aria-invalid="true">
    <p class="field-error">Enter a valid email, like name@company.com.</p>
  </div>
  <div class="field">
    <label class="label">Billing contact <span class="label-optional">(optional)</span></label>
    <input class="input" placeholder="finance@acme.com">
  </div>
</div>`
      },
      {
        title: 'Validation with Ranj.validate',
        description: 'Add <code>data-validate</code> to a form. Errors appear on submit, then update live as people fix them. Customise messages with <code>data-error-required</code>, <code>data-error-type</code>, <code>data-match</code> and friends.',
        height: 460,
        html: `
<form class="demo-field-card" data-validate style="width:24rem;max-width:100%">
  <div class="field">
    <label class="label">Full name</label>
    <input class="input" name="name" required minlength="2" data-error-required="Tell us what to call you." placeholder="Maya Chen">
  </div>
  <div class="field">
    <label class="label">Email</label>
    <div class="input-wrap"><span class="input-icon">${mail}</span><input type="email" name="email" required placeholder="you@company.com"></div>
  </div>
  <div class="field">
    <label class="label">Password</label>
    <input class="input" type="password" id="field-demo-pw" required minlength="8" placeholder="At least 8 characters">
    <p class="field-hint">Use 8 or more characters.</p>
  </div>
  <div class="field">
    <label class="label">Confirm password</label>
    <input class="input" type="password" required data-match="#field-demo-pw" data-error-match="Passwords don’t match yet.">
  </div>
  <div class="field">
    <label class="checkbox"><input type="checkbox" required data-error-required="Please accept the terms to continue."><span class="checkbox-mark"></span>I agree to the Terms and Privacy Policy</label>
  </div>
  <div class="demo-field-actions"><button type="reset" class="btn btn-outline">Reset</button><button class="btn btn-primary">Create account</button></div>
  <p class="demo-field-ok" hidden>All good! Account created.</p>
</form>`,
        js: `
const form = root.querySelector('form');
form.addEventListener('submit', e => { e.preventDefault(); form.querySelector('.demo-field-ok').hidden = false; });
form.addEventListener('ranj:invalid', () => form.querySelector('.demo-field-ok').hidden = true);
form.addEventListener('reset', () => form.querySelector('.demo-field-ok').hidden = true);`,
        css: `
.demo-field-card { padding: 1.5rem; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); }
.demo-field-actions { display: flex; justify-content: flex-end; gap: .5rem; margin-top: 1.25rem; }
.demo-field-ok { margin-top: .75rem; font-size: .85rem; color: var(--success-soft-fg); font-weight: 500; text-align: right; }`
      },
      {
        title: 'Horizontal layout',
        description: '<code>.field-horizontal</code> puts the label in a left column and stacks on narrow screens.',
        html: `
<div style="width:34rem;max-width:100%">
  <div class="field field-horizontal">
    <div class="field-label-block"><label class="label">Display name</label><p class="field-hint">Shown on your profile.</p></div>
    <input class="input" value="Maya Chen">
  </div>
  <div class="field field-horizontal">
    <div class="field-label-block"><label class="label">Username</label><p class="field-hint">Your public URL.</p></div>
    <div class="input-group"><span class="input-group-text">ranj.dev/</span><input class="input" value="maya"></div>
  </div>
  <div class="field field-horizontal">
    <label class="label">Timezone</label>
    <select class="select"><option>(GMT−05:00) New York</option><option>(GMT+00:00) London</option><option>(GMT+05:30) Mumbai</option></select>
  </div>
</div>`
      },
      {
        title: 'States',
        html: `
<div class="form-grid" style="width:34rem;max-width:100%">
  <div class="field"><label class="label">Default</label><input class="input" placeholder="Placeholder"></div>
  <div class="field"><label class="label">Valid</label><input class="input" value="acme-robotics" data-valid="true"><p class="field-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>Subdomain is available</p></div>
  <div class="field"><label class="label">Invalid</label><input class="input" value="ac" aria-invalid="true"><p class="field-error">Use at least 3 characters.</p></div>
  <div class="field" data-disabled><label class="label">Disabled</label><input class="input" value="Locked by admin" disabled></div>
</div>`
      }
    ],
    api: [
      { name: '.field', type: 'class', desc: 'Vertical stack of label, control, hint and error. Auto-wires label <code>for</code> and <code>aria-describedby</code>.' },
      { name: '.field-horizontal', type: 'class', desc: 'Label column on the left, control on the right; stacks under 560px. Use <code>.field-label-block</code> for label + hint.' },
      { name: '.field-inline', type: 'class', desc: 'Control and label in a row.' },
      { name: '.field-row', type: 'class', desc: 'Puts something (link, counter) on the label line.' },
      { name: '.label', type: 'class', desc: 'Form label. Add <code>.label-required</code> or <code>data-required</code> for an asterisk (added automatically when the control is <code>required</code>).' },
      { name: '.label-optional', type: 'class', desc: 'Muted “(optional)” suffix inside a label.' },
      { name: '.field-hint / .field-error / .field-success', type: 'class', desc: 'Helper, error and success messages.' },
      { name: '.form-grid', type: 'class', desc: 'Responsive 2-column grid of fields (<code>--cols</code>), with <code>.span-2</code> / <code>.span-full</code>.' },
      { name: '.form-section / .fieldset / .form-actions', type: 'class', desc: 'Settings-style sections, fieldsets with <code>legend</code>, and a right-aligned button row.' },
      { name: 'form[data-validate]', type: 'attr', desc: 'Validate on submit (blocks submit when invalid), then live on input/blur.' },
      { name: 'data-error-required / -type / -minlength / -pattern / -min / -max', type: 'attr', desc: 'Custom error messages per constraint. <code>data-error</code> overrides all.' },
      { name: 'data-match', type: 'attr', desc: 'CSS selector of another input that must have the same value (password confirm).' },
      { name: 'Ranj.validate(form, {focus, shake})', type: 'js', desc: 'Validates every field, shows errors, focuses the first invalid one. Returns <code>true</code> when valid.' },
      { name: 'Ranj.fieldError(el, message)', type: 'js', desc: 'Show (or clear with <code>""</code>) a server-side error on a field or control.' },
      { name: 'ranj:valid / ranj:invalid', type: 'event', desc: 'Fired on the form after <code>Ranj.validate</code>.' }
    ]
  });
})();
