(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var mail = s('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
  var user = s('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>');
  var link = s('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>');
  var check = s('<path d="M20 6 9 17l-5-5"/>');
  var at = s('<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>');
  var copy = s('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>');
  RanjDocs.add({
    id: 'input',
    name: 'Input',
    group: 'Forms',
    description: 'Text inputs in three sizes and four variants, plus <code>.input-wrap</code> — one bordered shell that hosts icons, prefixes, suffixes, buttons and a clear ×. Floating labels are pure CSS.',
    keywords: ['text field', 'textbox', 'input group', 'addon', 'prefix', 'suffix', 'floating label', 'clearable'],
    demos: [
      {
        title: 'Default',
        html: `
<div style="width:20rem;max-width:100%">
  <label class="label" for="input-demo-email">Email</label>
  <input class="input" id="input-demo-email" type="email" placeholder="you@company.com">
</div>`
      },
      {
        title: 'Sizes',
        html: `
<div style="width:20rem;max-width:100%;display:grid;gap:.75rem">
  <input class="input input-sm" placeholder="Small — 32px">
  <input class="input" placeholder="Default — 38px">
  <input class="input input-lg" placeholder="Large — 44px">
  <input class="input input-xl" placeholder="Extra large — 52px">
</div>`
      },
      {
        title: 'Icons, prefixes and buttons',
        description: 'Everything inside <code>.input-wrap</code> sits in one focus ring. Add <code>data-clearable</code> for a clear button.',
        html: `
<div style="width:22rem;max-width:100%;display:grid;gap:.75rem">
  <div class="input-wrap"><span class="input-icon">${user}</span><input placeholder="Full name" value="Maya Chen"></div>
  <div class="input-wrap" data-clearable><span class="input-icon">${mail}</span><input type="email" value="maya@acme.dev" placeholder="Email"></div>
  <div class="input-wrap"><span class="input-prefix">https://</span><input value="acme.dev"><span class="input-icon" style="color:var(--success)">${check}</span></div>
  <div class="input-wrap"><span class="input-prefix">$</span><input inputmode="decimal" value="1,250.00"><span class="input-suffix">USD</span></div>
  <div class="input-wrap"><span class="input-icon">${link}</span><input readonly data-picker value="ranj.dev/invite/7Hq2-xP9"><button type="button" class="input-btn" aria-label="Copy link" id="input-demo-copy">${copy}</button></div>
</div>`,
        js: `
const b = root.querySelector('#input-demo-copy');
b.onclick = () => { const i = b.previousElementSibling; navigator.clipboard && navigator.clipboard.writeText(i.value).catch(() => {}); b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>'; b.style.color = 'var(--success)'; setTimeout(() => { b.innerHTML = ${JSON.stringify(copy)}; b.style.color = ''; }, 1400); };`
      },
      {
        title: 'Addons',
        description: 'v1 <code>.input-group</code> + <code>.input-group-text</code> still work and can hold buttons and selects.',
        html: `
<div style="width:24rem;max-width:100%;display:grid;gap:.75rem">
  <div class="input-group"><span class="input-group-text">${at}</span><input class="input" placeholder="username"></div>
  <div class="input-group"><input class="input" placeholder="acme"><span class="input-group-text">.ranj.app</span></div>
  <div class="input-group"><select class="select" style="flex:0 0 6.5rem"><option>+1 US</option><option>+44 UK</option><option>+91 IN</option></select><input class="input" type="tel" placeholder="(555) 010-2481"></div>
  <div class="input-group"><input class="input" placeholder="Enter coupon code" value="LAUNCH25"><button class="btn btn-outline">Apply</button></div>
</div>`
      },
      {
        title: 'Floating label & variants',
        html: `
<div class="form-grid" style="width:32rem;max-width:100%">
  <div class="input-floating"><input class="input" id="input-demo-f1" placeholder=" " value="Maya"><label for="input-demo-f1">First name</label></div>
  <div class="input-floating"><input class="input" id="input-demo-f2" placeholder=" "><label for="input-demo-f2">Last name</label></div>
  <input class="input input-filled" placeholder="Filled variant">
  <input class="input input-underline" placeholder="Underline variant (focus me)">
  <input class="input input-ghost" placeholder="Ghost variant">
  <input class="input" type="file">
</div>`
      },
      {
        title: 'States',
        html: `
<div class="form-grid" style="width:32rem;max-width:100%">
  <input class="input" placeholder="Default">
  <input class="input" value="Read only" readonly>
  <input class="input" value="Disabled" disabled>
  <input class="input" value="not-an-email" aria-invalid="true">
</div>`
      }
    ],
    api: [
      { name: '.input', type: 'class', desc: 'Styled text input (any type).' },
      { name: '.input-sm / .input-lg / .input-xl', type: 'class', desc: 'Sizes. Also work on <code>.input-wrap</code>.' },
      { name: '.input-filled / .input-underline / .input-ghost', type: 'class', desc: 'Variants. Underline animates a primary line on focus.' },
      { name: '.input-wrap', type: 'class', desc: 'Bordered shell with a bare <code>&lt;input&gt;</code> inside plus <code>.input-icon</code>, <code>.input-prefix</code>, <code>.input-suffix</code>, <code>.input-btn</code>, <code>.input-kbd</code>.' },
      { name: 'data-clearable', type: 'attr', desc: 'On <code>.input-wrap</code>: adds a clear button that shows when there is a value. <code>data-clear-on-escape</code> clears with Escape.' },
      { name: '.input-group / .input-group-text', type: 'class', desc: 'v1 attached addons. Children can be inputs, selects, text or <code>.btn</code>.' },
      { name: '.input-floating', type: 'class', desc: 'Floating label: put <code>placeholder=" "</code> on the input and the label after it.' },
      { name: 'aria-invalid="true" / data-valid="true"', type: 'attr', desc: 'Error and success border states.' },
      { name: '--field-bg / --field-border / --field-ring / --field-radius', type: 'var', desc: 'Shared control surface tokens used by every form control.' },
      { name: 'ranj:change / ranj:clear', type: 'event', desc: 'On <code>.input-wrap</code> when cleared. detail: <code>{ value }</code>' }
    ]
  });
})();
