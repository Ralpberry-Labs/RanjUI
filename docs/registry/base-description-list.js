(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'description-list',
    name: 'Description list',
    group: 'Base',
    description: 'Key / value pairs for details pages, settings summaries and receipts. Stacks on phones.',
    tags: ['new'],
    keywords: ['dl', 'key value', 'details', 'properties', 'receipt', 'summary'],
    demos: [
      {
        title: 'Details card',
        center: false,
        html: `<div class="card" style="max-width:36rem;margin:0 auto">
  <div class="card-header card-header-row"><div><div class="card-title">Deployment</div><div class="card-description">dpl_7Hq2xK9 · Production</div></div><span class="badge badge-soft badge-success badge-dot">Ready</span></div>
  <div class="card-content">
    <dl class="dl">
      <div><dt>Domain</dt><dd><a class="link" href="#">acme.com</a><span class="badge badge-outline badge-sm">+2</span></dd></div>
      <div><dt>Branch</dt><dd>${I('git', 'class="size-4"')} main</dd></div>
      <div><dt>Commit</dt><dd class="mono">a1f9c3e<span class="muted" style="font-family:var(--font-sans)">fix: rounding on annual invoices</span></dd></div>
      <div><dt>Created</dt><dd>Nov 16, 2026, 09:41 by Jun Kim</dd></div>
      <div><dt>Build time</dt><dd>48s</dd></div>
    </dl>
  </div>
</div>`
      },
      {
        title: 'Stat grid',
        center: false,
        html: `<dl class="dl dl-grid dl-card" style="padding:1.25rem;max-width:40rem;margin:0 auto">
  <div><dt>Plan</dt><dd>Pro</dd></div>
  <div><dt>Seats</dt><dd>18 / 20</dd></div>
  <div><dt>Next invoice</dt><dd>$432.00</dd></div>
  <div><dt>Region</dt><dd>eu-west-1</dd></div>
</dl>`
      },
      {
        title: 'Receipt',
        html: `<div class="card card-sm" style="width:min(100%,20rem)"><div class="card-content">
  <dl class="dl dl-inline">
    <div><dt>Pro plan × 18 seats</dt><dd>$432.00</dd></div>
    <div><dt>Extra build minutes</dt><dd>$12.40</dd></div>
    <div><dt>Annual discount</dt><dd class="text-success">−$86.40</dd></div>
    <div><dt>Tax (8.875%)</dt><dd>$31.79</dd></div>
    <div class="dl-total"><dt>Total</dt><dd>$389.79</dd></div>
  </dl>
</div></div>`
      },
      {
        title: 'Striped',
        center: false,
        html: `<dl class="dl dl-striped" style="max-width:32rem;margin:0 auto;--dl-key:9rem">
  <div><dt>Full name</dt><dd>Ana Silva</dd></div>
  <div><dt>Email</dt><dd>ana@linea.design</dd></div>
  <div><dt>Role</dt><dd>Owner</dd></div>
  <div><dt>API key</dt><dd class="mono">sk_live_••••••••3f9a<button class="btn btn-ghost btn-xs dl-action">${I('copy')} Copy</button></dd></div>
</dl>`
      }
    ],
    api: [
      { name: '.dl / .description-list', type: 'class', desc: 'On a <code>&lt;dl&gt;</code> whose children are <code>&lt;div&gt;&lt;dt/&gt;&lt;dd/&gt;&lt;/div&gt;</code>.' },
      { name: '--dl-key', type: 'var', default: '11rem', desc: 'Width of the key column.' },
      { name: '.dl-card', type: 'class', desc: 'Card surface, zebra rows, stacked grid, right-aligned receipt values, monospaced values. Also: <code>.dl-striped</code> <code>.dl-grid</code> <code>.dl-inline</code> <code>.dl-mono</code>' },
      { name: '.dl-total / .dl-action', type: 'class', desc: 'Receipt total row / push an action to the right of a value.' }
    ]
  });
})();
