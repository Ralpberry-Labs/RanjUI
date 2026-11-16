(function () {
  var I = window.__ovI;
  var songs = [['Midnight City', 'M83', 4.03], ['Breathe Deeper', 'Tame Impala', 6.12], ['Nightcall', 'Kavinsky', 4.18], ['Instant Crush', 'Daft Punk', 5.37], ['Redbone', 'Childish Gambino', 5.27], ['Retrograde', 'James Blake', 3.43], ['Sunflower', 'Rex Orange County', 4.12], ['Holocene', 'Bon Iver', 5.36], ['Motion Sickness', 'Phoebe Bridgers', 3.49], ['Ivy', 'Frank Ocean', 4.09]];
  var list = songs.map(function (s, i) { return '<div class="demo-drawer-song"><i style="--h:' + (i * 37) + '"></i><span><b>' + s[0] + '</b><small>' + s[1] + '</small></span><em>' + s[2].toFixed(2).replace('.', ':') + '</em></div>'; }).join('');
  RanjDocs.add({
    id: 'drawer',
    name: 'Drawer',
    group: 'Overlays',
    description: 'A bottom sheet for phones and tablets. Drag the handle (or the panel) to dismiss with velocity, rubber-band past the top, and snap between heights. Mouse and touch both work.',
    tags: ['js', 'new'],
    keywords: ['bottom sheet', 'vaul', 'swipe', 'mobile sheet', 'snap points', 'action sheet'],
    demos: [
      {
        title: 'Goal setter',
        description: 'Fling it down, or drag past a third of its height to close.',
        html: `
<button class="btn btn-outline" data-drawer-open="drawer-goal">${I.target} Set daily goal</button>

<div class="dialog-overlay" id="drawer-goal">
  <div class="drawer" style="--drawer-w: 28rem">
    <div class="drawer-handle"></div>
    <div class="drawer-header">
      <h2 class="drawer-title">Move goal</h2>
      <p class="drawer-description">Set your daily activity goal.</p>
    </div>
    <div class="drawer-body">
      <div class="demo-drawer-goal">
        <button class="demo-drawer-step" data-d="-10" aria-label="Decrease">${I.minus}</button>
        <div><b id="drawer-goal-val">350</b><small>calories / day</small></div>
        <button class="demo-drawer-step" data-d="10" aria-label="Increase">${I.plus}</button>
      </div>
      <div class="demo-drawer-bars">${[52, 74, 40, 88, 63, 95, 70, 58, 80, 45, 66, 90].map(function (h) { return '<i style="height:' + h + '%"></i>'; }).join('')}</div>
    </div>
    <div class="drawer-footer">
      <button class="btn" data-dialog-close>Submit</button>
      <button class="btn btn-outline" data-dialog-close>Cancel</button>
    </div>
  </div>
</div>`,
        js: `var v = 350, out = root.querySelector('#drawer-goal-val');
root.querySelectorAll('.demo-drawer-step').forEach(function (b) {
  b.onclick = function () { v = Math.max(200, Math.min(600, v + +b.dataset.d)); out.textContent = v; };
});`,
        css: `.demo-drawer-goal { display: flex; align-items: center; justify-content: center; gap: 2rem; padding: .5rem 0 1rem; }
.demo-drawer-goal div { display: flex; flex-direction: column; align-items: center; min-width: 7rem; }
.demo-drawer-goal b { font-size: 3.5rem; font-weight: 700; letter-spacing: -.04em; line-height: 1; font-variant-numeric: tabular-nums; }
.demo-drawer-goal small { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted-fg); margin-top: .35rem; }
.demo-drawer-step { width: 2.25rem; height: 2.25rem; display: grid; place-items: center; border-radius: 99px; border: 1px solid var(--border); }
.demo-drawer-step:hover { background: var(--muted); } .demo-drawer-step svg { width: 1rem; height: 1rem; }
.demo-drawer-bars { display: flex; align-items: flex-end; gap: .4rem; height: 5.5rem; padding: 0 .25rem; }
.demo-drawer-bars i { flex: 1; border-radius: 4px 4px 2px 2px; background: color-mix(in oklab, var(--primary) 75%, transparent); }`
      },
      {
        title: 'Snap points',
        description: '<code>data-snap-points="0.45, 1"</code> opens at 45% and snaps to full height. The list scrolls once fully open; at the top it hands the gesture back to the drawer.',
        html: `
<button class="btn" data-drawer-open="drawer-queue">${I.music} Up next</button>

<div class="dialog-overlay" id="drawer-queue">
  <div class="drawer" data-snap-points="0.45, 1" data-snap="0" style="height: 82dvh">
    <div class="drawer-handle"></div>
    <div class="drawer-header" style="text-align:left">
      <h2 class="drawer-title">Up next</h2>
      <p class="drawer-description">Late Night Drive · 10 songs, 46 min</p>
    </div>
    <div class="drawer-body">${list}</div>
  </div>
</div>`,
        css: `.demo-drawer-song { display: flex; align-items: center; gap: .875rem; padding: .55rem 0; }
.demo-drawer-song i { width: 2.75rem; height: 2.75rem; border-radius: var(--radius-sm); flex-shrink: 0; background: linear-gradient(135deg, oklch(.72 .15 var(--h)), oklch(.45 .17 calc(var(--h) + 70))); }
.demo-drawer-song span { flex: 1; display: flex; flex-direction: column; font-size: .875rem; line-height: 1.3; min-width: 0; }
.demo-drawer-song b { font-weight: 600; } .demo-drawer-song small, .demo-drawer-song em { color: var(--muted-fg); font-size: .75rem; font-style: normal; font-variant-numeric: tabular-nums; }`
      },
      {
        title: 'Share sheet',
        html: `
<button class="btn btn-outline" data-drawer-open="drawer-share">${I.share} Share</button>

<div class="dialog-overlay" id="drawer-share">
  <div class="drawer" style="--drawer-w: 26rem">
    <div class="drawer-handle"></div>
    <div class="drawer-header"><h2 class="drawer-title">Share “Kyoto, spring 2026”</h2><p class="drawer-description">142 photos · 3.1 GB</p></div>
    <div class="drawer-body">
      <div class="demo-drawer-people">
        ${[['AM', 15, 'Ava'], ['KO', 140, 'Kenji'], ['LB', 300, 'Lena'], ['TR', 60, 'Tomás'], ['SN', 210, 'Sana']].map(function (p) { return '<button data-dialog-close><span class="demo-ov-avatar" style="--h:' + p[1] + ';width:52px;height:52px;font-size:18px">' + p[0] + '</span>' + p[2] + '</button>'; }).join('')}
      </div>
      <div class="demo-drawer-actions">
        <button data-dialog-close>${I.link} Copy link</button><button data-dialog-close>${I.mail} Email</button><button data-dialog-close>${I.message} Messages</button><button data-dialog-close>${I.download} Save</button>
      </div>
    </div>
    <div class="drawer-footer"><button class="btn btn-secondary" data-dialog-close>Cancel</button></div>
  </div>
</div>`,
        css: `.demo-drawer-people { display: flex; gap: .75rem; overflow-x: auto; padding: .25rem 0 1rem; scrollbar-width: none; }
.demo-drawer-people button { display: flex; flex-direction: column; align-items: center; gap: .4rem; font-size: .75rem; color: var(--muted-fg); min-width: 4rem; }
.demo-drawer-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: .5rem; }
.demo-drawer-actions button { display: flex; flex-direction: column; align-items: center; gap: .45rem; padding: .85rem .25rem; border-radius: var(--radius-lg); background: var(--muted); font-size: .75rem; font-weight: 500; transition: transform var(--dur-fast) var(--ease); }
.demo-drawer-actions button:active { transform: scale(.95); } .demo-drawer-actions svg { width: 1.25rem; height: 1.25rem; }`
      }
    ],
    api: [
      { name: '.drawer', type: 'class', desc: 'Bottom sheet inside a <code>.dialog-overlay</code>. <code>.drawer-right</code> / <code>.drawer-left</code> for side drawers that swipe sideways.' },
      { name: '.drawer-handle', type: 'class', desc: 'Grab bar. Dragging works anywhere except inputs, buttons and scrolled lists.' },
      { name: '.drawer-header / -body / -footer', type: 'class', desc: 'Parts, plus <code>.drawer-title</code> and <code>.drawer-description</code>. The body scrolls.' },
      { name: 'data-snap-points', type: 'attr', desc: 'Comma-separated visible fractions, e.g. <code>"0.4, 1"</code>.' },
      { name: 'data-snap', type: 'attr', default: 'last', desc: 'Index of the snap point to open at.' },
      { name: '--drawer-w', type: 'var', default: '42rem', desc: 'Max width (centered on wide screens).' },
      { name: 'data-drawer-open="id"', type: 'attr', desc: 'Alias of <code>data-dialog-open</code>.' },
      { name: 'Ranj.drawer.open(id) / close(id) / snap(el, i)', type: 'js', desc: 'Programmatic control.' },
      { name: 'ranj:snap', type: 'event', desc: 'On the drawer: <code>{ index, point }</code>. Close reason is <code>"swipe"</code> when flung away.' }
    ]
  });
})();
