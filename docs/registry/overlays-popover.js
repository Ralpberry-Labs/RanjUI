(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'popover',
    name: 'Popover',
    group: 'Overlays',
    description: 'Rich, interactive content anchored to a trigger. Positioned with <code>position: fixed</code> so it escapes overflow-hidden parents, flips and shifts to stay on screen, and closes on outside click, Escape or when focus leaves.',
    tags: ['js'],
    keywords: ['floating', 'flyout', 'dropdown panel', 'callout', 'bubble'],
    demos: [
      {
        title: 'Dimensions form',
        html: `
<div class="popover" data-arrow>
  <button class="btn btn-outline" data-popover-trigger>${I.sliders} Dimensions</button>
  <div class="popover-content" style="--popover-w: 20rem">
    <div class="popover-header"><div class="popover-title">Dimensions</div><div class="popover-description">Set the dimensions for the layer.</div></div>
    <div class="demo-popover-grid">
      <label class="label" for="popover-w">Width</label><input class="input input-sm" id="popover-w" value="100%">
      <label class="label" for="popover-mw">Max. width</label><input class="input input-sm" id="popover-mw" value="300px">
      <label class="label" for="popover-h">Height</label><input class="input input-sm" id="popover-h" value="25px">
      <label class="label" for="popover-mh">Max. height</label><input class="input input-sm" id="popover-mh" value="none">
    </div>
  </div>
</div>`,
        css: `.demo-popover-grid { display: grid; grid-template-columns: 5.5rem 1fr; gap: .5rem .75rem; align-items: center; }
.demo-popover-grid .label { margin: 0; font-size: .8125rem; } .demo-popover-grid .input { height: 2rem; min-width: 0; }`
      },
      {
        title: 'Placements',
        description: '<code>data-placement</code> accepts top, right, bottom, left with optional -start / -end. It flips when there is no room.',
        html: `
${['top', 'right', 'bottom', 'left'].map(function (p) {
  return '<div class="popover" data-arrow data-placement="' + p + '"><button class="btn btn-secondary" data-popover-trigger>' + p[0].toUpperCase() + p.slice(1) + '</button><div class="popover-content popover-sm"><div class="popover-title">Placed ' + p + '</div><div class="popover-description">The arrow tracks the trigger even after shifting.</div></div></div>';
}).join('\n')}`
      },
      {
        title: 'Share with people',
        html: `
<div class="popover" data-placement="bottom-end">
  <button class="btn" data-popover-trigger>${I.share} Share</button>
  <div class="popover-content popover-lg">
    <button class="popover-close" data-popover-close aria-label="Close">${I.x}</button>
    <div class="popover-header"><div class="popover-title">Share “Q4 roadmap”</div><div class="popover-description">Anyone with the link can view.</div></div>
    <div class="demo-popover-link"><input class="input" value="northwind.app/s/q4-roadmap" readonly><button class="btn btn-secondary" data-tooltip="Copy link" id="popover-copy">${I.copy}</button></div>
    <div class="demo-popover-label">People with access</div>
    <div class="demo-popover-people">
      <div><span class="demo-ov-avatar" style="--h:15;width:30px;height:30px;font-size:11px">OM</span><span><b>Olivia Martin</b><small>olivia@northwind.app</small></span><em>Owner</em></div>
      <div><span class="demo-ov-avatar" style="--h:200;width:30px;height:30px;font-size:11px">IN</span><span><b>Isabella Nguyen</b><small>isabella@northwind.app</small></span><em>Can edit</em></div>
      <div><span class="demo-ov-avatar" style="--h:110;width:30px;height:30px;font-size:11px">WK</span><span><b>William Kim</b><small>will@northwind.app</small></span><em>Can view</em></div>
    </div>
  </div>
</div>`,
        js: `var b = root.querySelector('#popover-copy');
b.onclick = function () { b.setAttribute('data-tooltip', 'Copied!'); Ranj.tooltip.show(b); setTimeout(function () { b.setAttribute('data-tooltip', 'Copy link'); }, 1500); };`,
        css: `.demo-popover-link { display: flex; gap: .5rem; } .demo-popover-link .input { flex: 1; min-width: 0; } .demo-popover-link .btn { padding: 0; width: var(--control-h); flex-shrink: 0; } .demo-popover-link svg { width: 1rem; height: 1rem; }
.demo-popover-label { margin: 1rem 0 .5rem; font-size: .75rem; font-weight: 600; color: var(--muted-fg); }
.demo-popover-people { display: grid; gap: .65rem; }
.demo-popover-people > div { display: flex; align-items: center; gap: .65rem; }
.demo-popover-people span:nth-child(2) { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.3; }
.demo-popover-people b { font-size: .8125rem; font-weight: 600; } .demo-popover-people small { font-size: .75rem; color: var(--muted-fg); overflow: hidden; text-overflow: ellipsis; }
.demo-popover-people em { font-style: normal; font-size: .75rem; color: var(--muted-fg); }`
      },
      {
        title: 'Escapes overflow',
        description: 'Inside a clipped, scrollable box the popover still renders fully and follows its trigger while you scroll.',
        html: `
<div class="demo-popover-clip">
  <p>This box has <code>overflow: hidden auto</code>.</p>
  <div class="popover" data-arrow data-placement="right">
    <button class="btn btn-outline btn-sm" data-popover-trigger>${I.info} Details</button>
    <div class="popover-content popover-sm"><div class="popover-title">Not clipped</div><div class="popover-description">Fixed positioning + flip + shift.</div></div>
  </div>
  <p style="height:180px"></p>
</div>`,
        css: `.demo-popover-clip { width: 15rem; height: 8rem; overflow: hidden auto; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1rem; background: var(--card); font-size: .8125rem; color: var(--muted-fg); }
.demo-popover-clip p { margin-bottom: .75rem; } .demo-popover-clip code { font-family: var(--font-mono); font-size: .9em; }`
      }
    ],
    api: [
      { name: '.popover', type: 'class', desc: 'Wrapper holding a <code>[data-popover-trigger]</code> and a <code>.popover-content</code>.' },
      { name: '.popover-content', type: 'class', desc: 'The panel. Parts: <code>.popover-header .popover-title .popover-description .popover-footer .popover-close</code>. Sizes <code>.popover-sm / -lg</code>, <code>.popover-flush</code> removes padding.' },
      { name: 'data-placement', type: 'attr', default: 'bottom', desc: 'On <code>.popover</code>: side and alignment.' },
      { name: 'data-offset', type: 'attr', default: '8', desc: 'Gap in px.' },
      { name: 'data-arrow', type: 'attr', desc: 'Adds an arrow that points at the trigger.' },
      { name: 'data-trigger="hover"', type: 'attr', default: 'click', desc: 'Open on hover/focus instead of click.' },
      { name: 'data-popover-target="id"', type: 'attr', desc: 'Standalone trigger for a <code>.popover-content</code> elsewhere in the page.' },
      { name: 'data-popover-close', type: 'attr', desc: 'Inside content: closes the popover.' },
      { name: '--popover-w', type: 'var', default: '20rem', desc: 'Max width.' },
      { name: 'Ranj.popover.open(el) / close(el) / toggle(el)', type: 'js', desc: 'Programmatic control.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On <code>.popover</code>. Close detail: <code>{ reason }</code>.' }
    ]
  });
})();
