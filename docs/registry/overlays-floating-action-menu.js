(function () {
  var I = window.__ovI;
  function act(icon, label, cls) { return '<button class="fab-action' + (cls ? ' ' + cls : '') + '" data-label="' + label + '">' + I[icon] + '</button>'; }
  RanjDocs.add({
    id: 'floating-action-menu',
    name: 'Floating Action Menu',
    group: 'Navigation',
    description: 'A floating action button that springs open into a stack of secondary actions, vertically with labels or along an arc. The plus rotates into a close icon; actions stagger in and out.',
    tags: ['js', 'new'],
    keywords: ['fab', 'speed dial', 'action button', 'radial menu', 'quick actions'],
    demos: [
      {
        title: 'Speed dial',
        height: 360,
        html: `
<div class="demo-fab-stage">
  <div class="fab-menu" data-direction="up">
    <div class="fab-actions">
      ${act('camera', 'Take photo')}${act('image', 'Upload image')}${act('fileText', 'New document')}${act('folder', 'New folder', 'fab-action-primary')}
    </div>
    <button class="fab" aria-label="Create">${I.plus}</button>
  </div>
</div>
<code class="demo-fab-log" id="fab-log">ranj:select →</code>`,
        js: `var log = root.querySelector('#fab-log');
root.addEventListener('ranj:select', function (e) { log.textContent = 'ranj:select → ' + e.detail.action; });`,
        css: `.demo-fab-stage { position: relative; width: 16rem; height: 18rem; display: flex; align-items: flex-end; justify-content: flex-end; padding: 1rem; border-radius: var(--radius-xl); border: 1px dashed var(--border-strong); }
.demo-fab-log { font-family: var(--font-mono); font-size: .75rem; color: var(--muted-fg); background: var(--muted); padding: .35rem .6rem; border-radius: var(--radius-sm); }`
      },
      {
        title: 'Radial',
        description: '<code>.fab-radial</code> fans actions along an arc: <code>data-arc</code> (degrees) centered on <code>data-start</code>.',
        height: 320,
        html: `
<div class="demo-fab-stage" style="justify-content:center;align-items:flex-end;width:20rem;height:15rem">
  <div class="fab-menu fab-radial" data-arc="160" data-start="-90">
    <div class="fab-actions">
      ${act('heart', 'Like')}${act('message', 'Comment')}${act('share', 'Share')}${act('bookmark', 'Save')}${act('send', 'Send')}
    </div>
    <button class="fab" aria-label="Actions">${I.plus}</button>
  </div>
</div>`
      },
      {
        title: 'Horizontal',
        height: 200,
        html: `
<div class="fab-menu" data-direction="right" style="--fab-size: 3rem; --fab-action: 2.5rem">
  <div class="fab-actions">${act('layers', 'Layers')}${act('pencil', 'Draw')}${act('scissors', 'Cut')}${act('clipboard', 'Paste')}${act('trash', 'Delete')}</div>
  <button class="fab" aria-label="Tools">${I.plus}</button>
</div>`,
        css: `.fab-menu[data-direction="right"] .fab-action[data-label]::after { right: auto; left: 50%; top: auto; bottom: calc(100% + .5rem); transform: translate(-50%, 4px); }
.fab-menu[data-direction="right"][data-open] .fab-action[data-label]::after { opacity: 0; }
.fab-menu[data-direction="right"][data-open] .fab-action:hover::after, .fab-menu[data-direction="right"][data-open] .fab-action:focus-visible::after { opacity: 1; transform: translate(-50%, 0); }`
      }
    ],
    api: [
      { name: '.fab-menu', type: 'class', desc: 'Wrapper: <code>.fab-actions</code> of <code>.fab-action</code>s, then the <code>.fab</code> button. <code>.fab-menu-fixed</code> pins it bottom-right.' },
      { name: 'data-direction', type: 'attr', default: 'up', desc: 'up | down | left | right.' },
      { name: '.fab-radial + data-arc / data-start / data-radius', type: 'class', desc: 'Arc layout (degrees; radius in px, default <code>--fab-radius</code>).' },
      { name: 'data-label', type: 'attr', desc: 'On actions: label pill (vertical) or tooltip (radial), also the accessible name.' },
      { name: 'data-label-side="right"', type: 'attr', desc: 'Put labels on the right.' },
      { name: '.fab-action-primary', type: 'class', desc: 'Tinted action.' },
      { name: '.fab-scrim', type: 'class', desc: 'Optional sibling after the menu: dims the page while open.' },
      { name: '--fab-size / --fab-action / --fab-gap / --fab-radius', type: 'var', default: '3.5rem / 2.75rem / .75rem / 6rem', desc: 'Sizing.' },
      { name: 'ranj:open / ranj:close / ranj:select', type: 'event', desc: '<code>select</code> detail: <code>{ action }</code>.' }
    ]
  });
})();
