(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'separator',
    name: 'Separator',
    group: 'Layout',
    description: 'Horizontal and vertical dividers, with optional labels like "OR", plus dashed, dotted, gradient and glow styles.',
    keywords: ['divider', 'hr', 'rule', 'line', 'or'],
    demos: [
      {
        title: 'Default',
        center: false,
        html: `<div style="max-width:24rem;margin:0 auto">
  <div class="stack gap-1"><b class="small">Ranj UI</b><span class="small muted" style="font-weight:400">An open-source component library.</span></div>
  <hr class="separator">
  <div class="hstack small" style="height:1.25rem">
    <a class="link-underline" href="#">Blog</a><span class="separator separator-vertical"></span>
    <a class="link-underline" href="#">Docs</a><span class="separator separator-vertical"></span>
    <a class="link-underline" href="#">Source</a>
  </div>
</div>`
      },
      {
        title: 'With label (sign-in)',
        html: `<div class="card" style="width:min(100%,22rem)">
  <div class="card-content stack gap-3">
    <button class="btn btn-outline btn-block">${I('github')} Continue with GitHub</button>
    <button class="btn btn-outline btn-block">${I('mail')} Continue with email</button>
    <div class="separator separator-label">or</div>
    <button class="btn btn-ghost btn-block">Use a passkey</button>
  </div>
</div>`
      },
      {
        title: 'Styles',
        center: false,
        html: `<div class="stack gap-2" style="max-width:32rem;margin:0 auto">
  <hr class="separator separator-strong">
  <hr class="separator separator-dashed">
  <div class="separator separator-dotted"></div>
  <hr class="separator separator-gradient">
  <hr class="separator separator-glow">
  <div class="separator separator-label normal-case">Today</div>
  <div class="separator separator-label separator-start">Earlier this week</div>
  <div class="separator separator-label"><button class="btn btn-outline btn-xs btn-pill">${I('chevronDown')} Show 12 more</button></div>
</div>`
      }
    ],
    api: [
      { name: '.separator / .divider', type: 'class', desc: '1px horizontal rule. Works on <code>&lt;hr&gt;</code> or <code>&lt;div&gt;</code>.' },
      { name: '.separator-vertical', type: 'class', desc: 'Vertical rule that stretches to the row height.' },
      { name: '.separator-label', type: 'class', desc: 'Lines on both sides of text or a button. <code>.separator-start</code>/<code>.separator-end</code> align the label.' },
      { name: '.separator-dashed', type: 'class', desc: 'Visual styles. Also: <code>.separator-dotted</code> <code>.separator-gradient</code> <code>.separator-glow</code> <code>.separator-strong</code> <code>.separator-thick</code>' },
      { name: '.separator-flush', type: 'class', desc: 'Remove the default margin.' },
      { name: '--sep-color / --sep-space', type: 'var', desc: 'Line color and margin.' },
      { name: 'role="separator"', type: 'attr', desc: 'Add to a <code>div</code> separator when it separates content semantically.' }
    ]
  });
})();
