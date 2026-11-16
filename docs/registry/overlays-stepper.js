(function () {
  var I = window.__ovI;
  function step(t, d, icon) { return '<li class="stepper-item"><span class="stepper-indicator">' + (icon ? I[icon] : '') + '</span><div class="stepper-text"><span class="stepper-title">' + t + '</span>' + (d ? '<span class="stepper-desc">' + d + '</span>' : '') + '</div></li>'; }
  RanjDocs.add({
    id: 'stepper',
    name: 'Stepper',
    group: 'Navigation',
    description: 'Shows progress through a multi-step flow. Completed steps get an animated check and the connector fills as you advance; steps can be clickable, and next/back buttons and panels wire up with attributes.',
    tags: ['js', 'new'],
    keywords: ['steps', 'wizard', 'progress', 'checkout steps', 'onboarding', 'timeline'],
    demos: [
      {
        title: 'Checkout wizard',
        center: false,
        html: `
<div class="demo-step-wrap">
  <ol class="stepper" id="stepper-checkout" data-current="1" data-clickable>
    ${step('Cart', '3 items')}${step('Shipping', 'Address & speed')}${step('Payment', 'Card or wallet')}${step('Review', 'Confirm order')}
  </ol>
  <div class="demo-step-panel" data-stepper-panels="stepper-checkout">
    <div data-step-panel="0"><b>Your cart</b><p>Linen overshirt, Merino socks, Canvas weekender · $267.00</p></div>
    <div data-step-panel="1"><b>Shipping</b><p>Deliver to 221B Baker Street, London. Express (2 days) selected.</p></div>
    <div data-step-panel="2"><b>Payment</b><p>Visa ending 4242 · billing address same as shipping.</p></div>
    <div data-step-panel="3"><b>Review</b><p>Everything look right? You won't be charged until you place the order.</p></div>
    <div data-step-panel="4"><b>${I.svg('checkCircle', 18, 'style="display:inline;vertical-align:-3px;color:var(--success)"')} Order placed</b><p>Confirmation #NW-88412 sent to your inbox.</p></div>
  </div>
  <div class="demo-step-btns">
    <button class="btn btn-outline" data-stepper-prev="stepper-checkout">Back</button>
    <button class="btn" data-stepper-next="stepper-checkout" data-last-label="Place order"><span data-label>Continue</span></button>
  </div>
</div>`,
        css: `.demo-step-wrap { max-width: 40rem; margin: 0 auto; display: grid; gap: 1.5rem; }
.demo-step-panel > div { padding: 1rem 1.25rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); animation: r-slide-up .35s var(--ease-out); }
.demo-step-panel b { font-size: .9375rem; } .demo-step-panel p { color: var(--muted-fg); font-size: .875rem; margin-top: .2rem; }
.demo-step-btns { display: flex; justify-content: space-between; }`
      },
      {
        title: 'Vertical with icons',
        description: 'Steps can carry an icon; an error state flags a step that needs attention.',
        html: `
<ol class="stepper stepper-vertical" id="stepper-deploy" data-current="2" style="max-width: 22rem">
  <li class="stepper-item"><span class="stepper-indicator">${I.code}</span><div class="stepper-text"><span class="stepper-title">Build</span><span class="stepper-desc">Compiled in 38s</span></div></li>
  <li class="stepper-item"><span class="stepper-indicator">${I.shield}</span><div class="stepper-text"><span class="stepper-title">Security scan</span><span class="stepper-desc">0 vulnerabilities</span></div></li>
  <li class="stepper-item"><span class="stepper-indicator">${I.globe}</span><div class="stepper-text"><span class="stepper-title">Deploy to edge</span><span class="stepper-desc">Propagating to 34 regions…</span><div class="stepper-body"><button class="btn btn-sm" id="stepper-deploy-ok">Mark done</button> <button class="btn btn-sm btn-outline" id="stepper-deploy-err">Simulate error</button></div></div></li>
  <li class="stepper-item"><span class="stepper-indicator">${I.checkCircle}</span><div class="stepper-text"><span class="stepper-title">Live</span><span class="stepper-desc">northwind.app</span></div></li>
</ol>`,
        js: `var s = Ranj.stepper(root.querySelector('#stepper-deploy'));
root.querySelector('#stepper-deploy-ok').onclick = function () { s.next(); };
root.querySelector('#stepper-deploy-err').onclick = function () { s.error(2); };`
      },
      {
        title: 'Compact, left-aligned',
        center: false,
        html: `<ol class="stepper stepper-start stepper-sm" data-current="2" data-clickable="all" style="max-width: 36rem; margin: 0 auto">${step('Account')}${step('Workspace')}${step('Invite team')}${step('Done')}</ol>`
      }
    ],
    api: [
      { name: '.stepper > .stepper-item', type: 'class', desc: 'Steps. Each has a <code>.stepper-indicator</code> (empty → number, or an svg) and <code>.stepper-text</code> with <code>.stepper-title</code> / <code>.stepper-desc</code>; <code>.stepper-body</code> shows only on the current step.' },
      { name: '.stepper-vertical / -start / -sm', type: 'class', desc: 'Vertical layout, left-aligned horizontal layout, compact size.' },
      { name: 'data-current', type: 'attr', default: '0', desc: '0-based current step; equal to the step count means all done.' },
      { name: 'data-clickable', type: 'attr', desc: 'Click/Enter completed steps to go back; <code>="all"</code> allows any step.' },
      { name: 'data-stepper-next / -prev="id"', type: 'attr', desc: 'Buttons that drive a stepper (disabled at the ends). <code>data-last-label</code> renames Next on the last step.' },
      { name: 'data-stepper-panels="id" + data-step-panel="n"', type: 'attr', desc: 'Panels shown for the current step.' },
      { name: '--step-size / --step-line', type: 'var', default: '2rem / 2px', desc: 'Indicator size and connector thickness.' },
      { name: 'Ranj.stepper(el)', type: 'js', desc: '→ <code>{ next(), prev(), go(i), error(i, on?), index }</code>.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ index, total, done }</code>.' }
    ]
  });
})();
