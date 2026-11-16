(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'tooltip',
    name: 'Tooltip',
    group: 'Overlays',
    description: 'Add <code>data-tooltip="text"</code> to any element, no wrapper needed. Shows after a short delay on hover and instantly on keyboard focus; once one is open, moving to the next shows it immediately. Escapes overflow, flips at edges and updates live when the text changes.',
    tags: ['js'],
    keywords: ['hint', 'title', 'label', 'info bubble', 'data-tooltip'],
    demos: [
      {
        title: 'Toolbar',
        description: 'Hover across the buttons: after the first one, the rest appear without delay.',
        html: `
<div class="demo-tooltip-bar">
  <button class="demo-tooltip-btn" data-tooltip="Bold" data-tooltip-kbd="⌘ B" aria-label="Bold"><b>B</b></button>
  <button class="demo-tooltip-btn" data-tooltip="Italic" data-tooltip-kbd="⌘ I" aria-label="Italic"><i style="font-family:Georgia,serif">I</i></button>
  <button class="demo-tooltip-btn" data-tooltip="Underline" data-tooltip-kbd="⌘ U" aria-label="Underline"><u>U</u></button>
  <span class="demo-tooltip-sep"></span>
  <button class="demo-tooltip-btn" data-tooltip="Insert link" data-tooltip-kbd="⌘ K" aria-label="Insert link">${I.link}</button>
  <button class="demo-tooltip-btn" data-tooltip="Add image" aria-label="Add image">${I.image}</button>
  <button class="demo-tooltip-btn" data-tooltip="Code block" data-tooltip-kbd="⌘ ⌥ C" aria-label="Code block">${I.code}</button>
  <span class="demo-tooltip-sep"></span>
  <button class="demo-tooltip-btn" data-tooltip="Undo" data-tooltip-kbd="⌘ Z" aria-label="Undo">${I.undo}</button>
  <button class="demo-tooltip-btn" data-tooltip="Redo" data-tooltip-kbd="⇧ ⌘ Z" aria-label="Redo">${I.redo}</button>
</div>`,
        css: `.demo-tooltip-bar { display: inline-flex; align-items: center; gap: .125rem; padding: .25rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); box-shadow: var(--shadow-sm); max-width: 100%; overflow-x: auto; }
.demo-tooltip-btn { width: 2.125rem; height: 2.125rem; display: grid; place-items: center; border-radius: var(--radius-sm); color: var(--fg); font-size: .9375rem; flex-shrink: 0; }
.demo-tooltip-btn:hover { background: var(--muted); } .demo-tooltip-btn svg { width: 1rem; height: 1rem; }
.demo-tooltip-sep { width: 1px; height: 1.25rem; background: var(--border); margin: 0 .25rem; flex-shrink: 0; }`
      },
      {
        title: 'Placements & variants',
        html: `
<button class="btn btn-outline" data-tooltip="Above" data-tooltip-placement="top">Top</button>
<button class="btn btn-outline" data-tooltip="To the right" data-tooltip-placement="right">Right</button>
<button class="btn btn-outline" data-tooltip="Below" data-tooltip-placement="bottom">Bottom</button>
<button class="btn btn-outline" data-tooltip="To the left" data-tooltip-placement="left">Left</button>
<button class="btn btn-outline" data-tooltip="Brand-colored" data-tooltip-variant="primary">Primary</button>
<button class="btn btn-outline" data-tooltip="No arrow, no delay" data-tooltip-arrow="false" data-tooltip-delay="0">Instant</button>`
      },
      {
        title: 'On anything',
        description: 'Links, icons, avatars, disabled-looking chips, even text. Changing the attribute updates an open tooltip.',
        html: `
<p class="demo-tooltip-text">Deploys run on <a href="#" data-tooltip="Edge network in 34 regions">Northwind Edge</a> and finish in
<abbr data-tooltip="Median over the last 30 days" tabindex="0">~41s</abbr>.</p>
<div class="demo-tooltip-row">
  <span class="demo-ov-avatar" style="--h:15;width:36px;height:36px;font-size:13px" data-tooltip="Lena Fischer · online" tabindex="0">LF</span>
  <span class="demo-ov-avatar" style="--h:150;width:36px;height:36px;font-size:13px" data-tooltip="Omar Haddad · away" tabindex="0">OH</span>
  <span class="demo-ov-avatar" style="--h:260;width:36px;height:36px;font-size:13px" data-tooltip="Mei Tanaka · in a meeting" tabindex="0">MT</span>
  <button class="btn btn-secondary btn-sm" id="tooltip-copy" data-tooltip="Copy invite link">${I.copy} Copy link</button>
</div>`,
        js: `var b = root.querySelector('#tooltip-copy');
b.addEventListener('click', function () {
  b.setAttribute('data-tooltip', 'Copied!'); Ranj.tooltip.show(b);
  setTimeout(function () { b.setAttribute('data-tooltip', 'Copy invite link'); }, 1600);
});`,
        css: `.demo-tooltip-text { font-size: .9375rem; color: var(--muted-fg); text-align: center; width: 100%; }
.demo-tooltip-text abbr { text-decoration: underline dotted; text-underline-offset: 3px; color: var(--fg); cursor: help; }
.demo-tooltip-row { display: flex; align-items: center; gap: .5rem; } .demo-tooltip-row .btn svg { width: .9rem; height: .9rem; }`
      },
      {
        title: 'Rich content',
        description: 'Wrap a trigger and a <code>.tooltip-content</code> in <code>.tooltip</code> for formatted content.',
        html: `
<span class="tooltip" data-placement="bottom">
  <button class="btn btn-outline">${I.zap} Usage: 82%</button>
  <div class="tooltip-content tooltip-rich">
    <b>Pro plan · 8.2k of 10k builds</b><br>
    Resets in 6 days. Upgrade to Scale for unlimited builds and priority queues.
  </div>
</span>`
      }
    ],
    api: [
      { name: 'data-tooltip="text"', type: 'attr', desc: 'On any element. Plain text (escaped).' },
      { name: 'data-tooltip-placement', type: 'attr', default: 'top', desc: 'top | right | bottom | left (+ -start / -end).' },
      { name: 'data-tooltip-delay', type: 'attr', default: '400', desc: 'Hover delay in ms. Skipped while another tooltip was just open.' },
      { name: 'data-tooltip-kbd', type: 'attr', desc: 'Keyboard shortcut chips, space separated: <code>"⌘ K"</code>.' },
      { name: 'data-tooltip-variant', type: 'attr', desc: '<code>primary</code> or <code>rich</code>.' },
      { name: 'data-tooltip-arrow="false"', type: 'attr', desc: 'Hide the arrow.' },
      { name: '.tooltip > .tooltip-content', type: 'class', desc: 'Rich tooltip markup (v1 compatible). <code>data-placement</code> on <code>.tooltip</code>.' },
      { name: '.tooltip-rich / .tooltip-primary', type: 'class', desc: 'Surface variants for rich tooltips.' },
      { name: 'Ranj.tooltip.show(el) / hide()', type: 'js', desc: 'Show one programmatically (e.g. "Copied!").' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On the trigger.' }
    ]
  });
})();
