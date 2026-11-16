(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'callout',
    name: 'Callout',
    group: 'Base',
    description: 'Inline notices that sit in the page flow: info, success, warning, danger, note and tip, each with an icon, optional actions and dismiss.',
    tags: ['new'],
    keywords: ['alert', 'notice', 'admonition', 'message', 'note', 'tip', 'warning box'],
    demos: [
      {
        title: 'Tones',
        center: false,
        html: `<div class="stack gap-3" style="max-width:40rem;margin:0 auto">
  <div class="callout callout-info" role="note">${I('info', 'class="callout-icon"')}<div class="callout-title">Heads up</div><div class="callout-body">API v1 will be retired on March 31, 2027. <a href="#">Read the migration guide</a>.</div></div>
  <div class="callout callout-success" role="status">${I('checkCircle', 'class="callout-icon"')}<div class="callout-title">Domain verified</div><div class="callout-body">acme.com is now serving traffic over HTTPS.</div></div>
  <div class="callout callout-warning" role="note">${I('alert', 'class="callout-icon"')}<div class="callout-title">You're at 86% of your build minutes</div><div class="callout-body">Builds will queue once you reach 6,000 minutes this month.</div></div>
  <div class="callout callout-danger" role="alert">${I('alertCircle', 'class="callout-icon"')}<div class="callout-title">Payment failed</div><div class="callout-body">We couldn't charge the card ending in 4242. Update it to avoid interruption.</div></div>
</div>`
      },
      {
        title: 'With actions and dismiss',
        center: false,
        html: `<div class="callout callout-outline" style="max-width:40rem;margin:0 auto">
  ${I('sparkles', 'class="callout-icon" style="color:var(--primary)"')}
  <div class="callout-title">Try the new AI review</div>
  <div class="callout-body">Get line-by-line suggestions on every pull request. Free during the beta.</div>
  <div class="callout-actions"><button class="btn btn-sm">Enable</button><button class="btn btn-sm btn-ghost">Learn more</button></div>
  <button class="callout-close" aria-label="Dismiss">${I('x')}</button>
</div>`
      },
      {
        title: 'Docs style',
        description: '<code>.callout-bar</code> for documentation; <code>.callout-note</code> for neutral asides.',
        center: false,
        html: `<div class="stack gap-3" style="max-width:40rem;margin:0 auto">
  <div class="callout callout-bar">${I('lightbulb', 'class="callout-icon"')}<div class="callout-title">Tip</div><div class="callout-body">Set <code>--hue</code> once on <code>:root</code> to re-brand every component.</div></div>
  <div class="callout callout-note callout-bar">${I('info', 'class="callout-icon"')}<div class="callout-body">This page documents version 2. For v1, see the legacy docs.</div></div>
  <div class="callout callout-danger callout-bar">${I('alert', 'class="callout-icon"')}<div class="callout-title">Breaking change</div><div class="callout-body"><code>.alert</code> is now <code>.callout</code> for inline notices.</div></div>
</div>`
      },
      {
        title: 'Solid',
        center: false,
        html: `<div class="stack gap-3" style="max-width:40rem;margin:0 auto">
  <div class="callout callout-solid callout-info">${I('info', 'class="callout-icon"')}<div class="callout-body">Scheduled maintenance Sunday 02:00–03:00 UTC.</div></div>
  <div class="callout callout-solid callout-warning">${I('alert', 'class="callout-icon"')}<div class="callout-body">Your trial ends in 3 days. Add a payment method to keep your projects.</div></div>
</div>`
      }
    ],
    api: [
      { name: '.callout', type: 'class', desc: 'Grid with an icon (<code>.callout-icon</code> or first <code>svg</code>), <code>.callout-title</code> and <code>.callout-body</code>.' },
      { name: '.callout-info', type: 'class', desc: 'Tones (default is brand). Also: <code>.callout-success</code> <code>.callout-warning</code> <code>.callout-danger</code> <code>.callout-note</code>' },
      { name: '.callout-bar', type: 'class', desc: 'Left accent bar, neutral card, or filled. Also: <code>.callout-outline</code> <code>.callout-solid</code>' },
      { name: '.callout-actions', type: 'class', desc: 'Button row under the text.' },
      { name: '.callout-close', type: 'class', desc: 'Dismiss button; hides the callout (ranj.js).' },
      { name: 'data-dismiss-key', type: 'attr', desc: 'Remember the dismissal in localStorage under this key.' },
      { name: 'ranj:dismiss', type: 'event', desc: 'Cancelable, fired before hiding.' }
    ]
  });
})();
