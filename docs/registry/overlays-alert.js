(function () {
  var I = window.__ovI;
  var x = '<button class="alert-close" aria-label="Dismiss">' + I.x + '</button>';
  RanjDocs.add({
    id: 'alert',
    name: 'Alert',
    group: 'Feedback',
    description: 'An inline message for status, warnings and errors. Soft, outline, accent and solid styles, optional actions, and a dismiss button that collapses the alert smoothly instead of popping it out.',
    tags: [],
    keywords: ['callout', 'notice', 'message', 'banner', 'inline notification', 'warning'],
    demos: [
      {
        title: 'Variants',
        center: false,
        html: `
<div class="demo-alert-stack">
  <div class="alert"><span class="alert-icon">${I.terminal}</span><div class="alert-content"><div class="alert-title">Heads up!</div><div class="alert-description">You can add components to your app using the CLI.</div></div></div>
  <div class="alert alert-info"><span class="alert-icon">${I.info}</span><div class="alert-content"><div class="alert-title">Scheduled maintenance</div><div class="alert-description">The API will be read-only on Saturday from 02:00 to 03:00 UTC.</div></div></div>
  <div class="alert alert-success"><span class="alert-icon">${I.checkCircle}</span><div class="alert-content"><div class="alert-title">Domain verified</div><div class="alert-description"><b>northwind.app</b> is connected and serving traffic over HTTPS.</div></div></div>
  <div class="alert alert-warning"><span class="alert-icon">${I.alert}</span><div class="alert-content"><div class="alert-title">Your trial ends in 3 days</div><div class="alert-description">Add a payment method to keep your projects and history. <a href="#">Upgrade now</a></div></div></div>
  <div class="alert alert-destructive"><span class="alert-icon">${I.alertCircle}</span><div class="alert-content"><div class="alert-title">Build failed</div><div class="alert-description">Type error in <code>src/billing/invoice.ts:42</code>. Fix it and push again.</div></div></div>
</div>`,
        css: `.demo-alert-stack { display: grid; gap: .75rem; max-width: 36rem; margin: 0 auto; } .demo-alert-stack code { font-family: var(--font-mono); font-size: .85em; }`
      },
      {
        title: 'Styles',
        center: false,
        html: `
<div class="demo-alert-stack">
  <div class="alert alert-info alert-accent"><span class="alert-icon">${I.info}</span><div class="alert-content"><div class="alert-title">Accent</div><div class="alert-description">A thicker leading edge for documentation callouts.</div></div></div>
  <div class="alert alert-success alert-outline"><span class="alert-icon">${I.checkCircle}</span><div class="alert-content"><div class="alert-title">Outline</div><div class="alert-description">Colored border and text on a transparent surface.</div></div></div>
  <div class="alert alert-primary alert-solid"><span class="alert-icon">${I.sparkles}</span><div class="alert-content"><div class="alert-title">Solid</div><div class="alert-description">High emphasis, for the one thing users must not miss.</div></div></div>
  <div class="alert alert-solid"><span class="alert-icon">${I.zap}</span><div class="alert-content"><div class="alert-title">Northwind 4 is here</div></div><div class="alert-actions-end"><button class="btn btn-sm btn-secondary">See what's new</button></div></div>
</div>`,
        css: `.demo-alert-stack { display: grid; gap: .75rem; max-width: 36rem; margin: 0 auto; }`
      },
      {
        title: 'Dismissible with actions',
        description: 'The close button animates the height away; neighbours slide up. Restore with <code>Ranj.alert.show(el)</code>.',
        center: false,
        html: `
<div class="demo-alert-stack">
  <div class="alert alert-warning" data-alert-hide id="alert-backup">
    <span class="alert-icon">${I.shield}</span>
    <div class="alert-content">
      <div class="alert-title">Turn on two-factor authentication</div>
      <div class="alert-description">Your account holds billing access for 4 workspaces. Protect it with an authenticator app.</div>
      <div class="alert-actions"><button class="btn btn-sm">Set up 2FA</button><button class="btn btn-sm btn-ghost" data-alert-close>Remind me later</button></div>
    </div>
    ${x}
  </div>
  <div class="alert alert-info" data-alert-hide id="alert-cookie"><span class="alert-icon">${I.info}</span><div class="alert-content"><div class="alert-description">We updated our privacy policy on November 1. <a href="#">Read the changes</a></div></div>${x}</div>
  <div class="alert" data-alert-hide id="alert-tip"><span class="alert-icon">${I.keyboard}</span><div class="alert-content"><div class="alert-description">Pro tip: press <b>G</b> then <b>I</b> to jump to your inbox.</div></div>${x}</div>
  <button class="btn btn-outline btn-sm" id="alert-reset" style="justify-self:center">${I.refresh} Restore alerts</button>
</div>`,
        js: `root.querySelector('#alert-reset').onclick = function () { root.querySelectorAll('.alert[hidden]').forEach(function (a, i) { setTimeout(function () { Ranj.alert.show(a); }, i * 80); }); };`,
        css: `.demo-alert-stack { display: grid; gap: .75rem; max-width: 36rem; margin: 0 auto; } #alert-reset svg { width: .9rem; height: .9rem; }`
      },
      {
        title: 'Banner',
        pad: false,
        center: false,
        html: `
<div style="width:100%">
  <div class="alert alert-primary alert-banner" data-alert-hide><span class="alert-icon">${I.gift}</span><div class="alert-content"><div class="alert-description"><b>Black Friday:</b> 40% off annual plans until Dec 2. <a href="#">Claim offer →</a></div></div>${x}</div>
  <div class="demo-alert-page">Your page content</div>
</div>`,
        css: `.demo-alert-page { display: grid; place-items: center; height: 9rem; color: var(--muted-fg); font-size: .875rem; }`
      }
    ],
    api: [
      { name: '.alert', type: 'class', desc: 'Container. Children: <code>.alert-icon</code> (or a leading svg), <code>.alert-content</code> with <code>.alert-title</code> / <code>.alert-description</code>.' },
      { name: '.alert-info / -success / -warning / -destructive / -primary', type: 'class', desc: 'Color variants (<code>.alert-error</code> and <code>.alert-danger</code> alias destructive).' },
      { name: '.alert-outline / -accent / -solid / -banner', type: 'class', desc: 'Styles.' },
      { name: '.alert-actions / .alert-actions-end', type: 'class', desc: 'Button row under the text, or trailing on the right.' },
      { name: '.alert-close / data-alert-close', type: 'class', desc: 'Dismiss button (animated collapse).' },
      { name: 'data-alert-hide', type: 'attr', desc: 'Hide instead of removing on dismiss.' },
      { name: 'Ranj.alert.dismiss(el) / show(el)', type: 'js', desc: 'Programmatic dismiss / restore (with enter animation).' },
      { name: 'ranj:close', type: 'event', desc: 'Cancelable, fired before collapsing.' }
    ]
  });
})();
