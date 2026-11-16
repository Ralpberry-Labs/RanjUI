(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var card = s('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>');
  var bank = s('<path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>');
  var apple = s('<path d="M12 6.5c1-1.8 2.6-2.5 3.5-2.5.2 1.3-.4 2.7-1.2 3.6-.8.9-2 1.5-3 1.4-.1-1 .2-1.8.7-2.5Z"/><path d="M17 12.5c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2s1.5-.7 2.8-.7 1.7.7 2.8.7c1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.4-.9-2.4-3.9Z"/>');
  var check = s('<path d="M20 6 9 17l-5-5"/>');
  RanjDocs.add({
    id: 'radio',
    name: 'Radio',
    group: 'Forms',
    description: 'Native radios with a springy dot. Group them vertically or horizontally, add descriptions, or turn them into rich radio cards with icons and prices — arrow keys work out of the box.',
    keywords: ['radio button', 'option', 'radio group', 'radio card', 'plan picker', 'pricing'],
    demos: [
      {
        title: 'Default',
        html: `
<div class="field" style="margin:0">
  <span class="label">Notify me about</span>
  <div class="radio-group">
    <label class="radio"><input type="radio" name="radio-demo-a" checked><span class="radio-mark"></span>All new messages</label>
    <label class="radio"><input type="radio" name="radio-demo-a"><span class="radio-mark"></span>Direct messages and mentions</label>
    <label class="radio"><input type="radio" name="radio-demo-a"><span class="radio-mark"></span>Nothing</label>
    <label class="radio"><input type="radio" name="radio-demo-a" disabled><span class="radio-mark"></span>Only urgent (Pro)</label>
  </div>
</div>`
      },
      {
        title: 'Horizontal, sizes and descriptions',
        html: `
<div style="display:grid;gap:1.5rem;width:26rem;max-width:100%">
  <div class="radio-group radio-group-horizontal" role="radiogroup" aria-label="Size">
    <label class="radio radio-sm"><input type="radio" name="radio-demo-b"><span class="radio-mark"></span>Small</label>
    <label class="radio"><input type="radio" name="radio-demo-b" checked><span class="radio-mark"></span>Default</label>
    <label class="radio radio-lg"><input type="radio" name="radio-demo-b"><span class="radio-mark"></span>Large</label>
    <label class="radio radio-outline"><input type="radio" name="radio-demo-b"><span class="radio-mark"></span>Outline</label>
  </div>
  <div class="radio-group" role="radiogroup" aria-label="Shipping">
    <label class="radio"><input type="radio" name="radio-demo-c" checked><span class="radio-mark"></span><span class="radio-body"><span class="radio-label">Standard — Free</span><span class="radio-desc">4–6 business days</span></span></label>
    <label class="radio"><input type="radio" name="radio-demo-c"><span class="radio-mark"></span><span class="radio-body"><span class="radio-label">Express — $12</span><span class="radio-desc">Arrives Thursday, Nov 19</span></span></label>
  </div>
</div>`
      },
      {
        title: 'Pricing cards',
        html: `
<div class="card-grid" role="radiogroup" aria-label="Plan" style="width:40rem;max-width:100%">
  <label class="radio-card"><input type="radio" name="radio-demo-plan" value="starter"><span class="radio-card-check">${check}</span>
    <span class="radio-card-title">Starter</span><span class="radio-card-price">$0<small> /mo</small></span><span class="radio-card-desc">1 project, community support.</span></label>
  <label class="radio-card"><input type="radio" name="radio-demo-plan" value="pro" checked><span class="radio-card-check">${check}</span>
    <span class="radio-card-head"><span class="radio-card-title">Pro</span><span class="radio-card-badge">Popular</span></span><span class="radio-card-price">$24<small> /mo</small></span><span class="radio-card-desc">Unlimited projects, analytics, priority support.</span></label>
  <label class="radio-card"><input type="radio" name="radio-demo-plan" value="team"><span class="radio-card-check">${check}</span>
    <span class="radio-card-title">Team</span><span class="radio-card-price">$79<small> /mo</small></span><span class="radio-card-desc">SSO, roles, audit log for 10 seats.</span></label>
</div>`
      },
      {
        title: 'Payment method cards',
        html: `
<div class="card-grid" role="radiogroup" aria-label="Payment method" style="width:34rem;max-width:100%">
  <label class="radio-card radio-card-row"><input type="radio" name="radio-demo-pay" checked><span class="radio-card-icon">${card}</span><span class="radio-body"><span class="radio-card-title">Card</span><span class="radio-card-desc">Visa •••• 4242</span></span><span class="radio-mark" style="margin-left:auto"></span></label>
  <label class="radio-card radio-card-row"><input type="radio" name="radio-demo-pay"><span class="radio-card-icon">${bank}</span><span class="radio-body"><span class="radio-card-title">Bank</span><span class="radio-card-desc">ACH transfer</span></span><span class="radio-mark" style="margin-left:auto"></span></label>
  <label class="radio-card radio-card-row"><input type="radio" name="radio-demo-pay"><span class="radio-card-icon">${apple}</span><span class="radio-body"><span class="radio-card-title">Apple Pay</span><span class="radio-card-desc">Touch ID</span></span><span class="radio-mark" style="margin-left:auto"></span></label>
</div>`
      }
    ],
    api: [
      { name: '.radio', type: 'class', desc: '<code>&lt;label class="radio"&gt;&lt;input type="radio"&gt;&lt;span class="radio-mark"&gt;&lt;/span&gt;Text&lt;/label&gt;</code>' },
      { name: '.radio-sm / .radio-lg / .radio-outline', type: 'class', desc: 'Sizes and an outlined checked style.' },
      { name: '.radio-group / .radio-group-horizontal', type: 'class', desc: 'Stacks; add <code>role="radiogroup"</code> + <code>aria-label</code>.' },
      { name: '.radio-body / .radio-label / .radio-desc', type: 'class', desc: 'Label with description.' },
      { name: '.radio-card', type: 'class', desc: 'Selectable card. Parts: <code>.radio-card-title</code>, <code>-desc</code>, <code>-price</code>, <code>-badge</code>, <code>-icon</code>, <code>-check</code>, <code>-head</code>. <code>.radio-card-row</code> lays it out horizontally.' }
    ]
  });
})();
