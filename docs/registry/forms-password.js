RanjDocs.add({
  id: 'password',
  name: 'Password',
  group: 'Forms',
  description: 'Password field with an animated show/hide eye, a Caps Lock warning, and an optional strength meter with a live rules checklist.',
  tags: ['new', 'js'],
  keywords: ['password strength', 'show password', 'reveal', 'eye toggle', 'password rules', 'caps lock'],
  demos: [
    {
      title: 'Reveal toggle',
      html: `
<div class="field" style="width:20rem;max-width:100%">
  <div class="field-row"><label class="label">Password</label><a href="#" onclick="return false">Forgot?</a></div>
  <div class="password"><input class="input" type="password" value="correct-horse-battery" autocomplete="current-password"></div>
</div>`
    },
    {
      title: 'Strength meter',
      description: 'Type to watch the bars fill and the rules tick off.',
      html: `
<div class="field" style="width:24rem;max-width:100%">
  <label class="label">Create a password</label>
  <div class="password" data-strength><input class="input" type="password" placeholder="Make it memorable" autocomplete="new-password"></div>
</div>`
    },
    {
      title: 'Meter only, custom rules',
      html: `
<div class="field" style="width:24rem;max-width:100%">
  <label class="label">Vault passphrase</label>
  <div class="password" data-strength data-rules="length:12,number,symbol"><input class="input" type="password" value="Sunset2026" autocomplete="new-password"></div>
</div>`
    }
  ],
  api: [
    { name: '.password', type: 'class', desc: 'Wrap a password input (or put the class on an <code>.input-wrap</code>). Adds the eye button.' },
    { name: 'data-strength', type: 'attr', desc: 'Show the 4-bar meter and rules list below the field. <code>data-no-rules</code> hides the list.' },
    { name: 'data-rules', type: 'attr', default: 'length:8,lower,upper,number,symbol', desc: 'Which rules to check.' },
    { name: 'data-toggle="false" / data-capslock="false"', type: 'attr', desc: 'Turn off the eye button / Caps Lock hint.' },
    { name: 'Ranj.passwordScore(value, rules)', type: 'js', desc: 'Returns 0–4.' },
    { name: 'ranj:strength / ranj:reveal', type: 'event', desc: 'detail: <code>{ score, label }</code> / <code>{ visible }</code>' }
  ]
});
