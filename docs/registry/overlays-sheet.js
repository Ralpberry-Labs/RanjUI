(function () {
  var I = window.__ovI;
  var close = '<button class="dialog-close" data-dialog-close aria-label="Close">' + I.x + '</button>';
  var cart = [['Linen overshirt', 'Sand · M', '$98', 30], ['Merino crew socks', 'Charcoal · 2 pack', '$24', 250], ['Canvas weekender', 'Olive', '$145', 120]].map(function (c) {
    return '<div class="demo-sheet-row"><i style="--h:' + c[3] + '"></i><span><b>' + c[0] + '</b><small>' + c[1] + '</small></span><em>' + c[2] + '</em></div>';
  }).join('');
  RanjDocs.add({
    id: 'sheet',
    name: 'Sheet',
    group: 'Overlays',
    description: 'A panel that slides in from any edge of the screen. Built on the dialog engine, so focus trapping, Escape, scroll lock and exit animations come for free.',
    tags: ['js'],
    keywords: ['side panel', 'slide over', 'offcanvas', 'flyout', 'drawer'],
    demos: [
      {
        title: 'Sides',
        html: `
<button class="btn btn-outline" data-sheet-open="sheet-right">Right</button>
<button class="btn btn-outline" data-sheet-open="sheet-left">Left</button>
<button class="btn btn-outline" data-sheet-open="sheet-top">Top</button>
<button class="btn btn-outline" data-sheet-open="sheet-bottom">Bottom</button>

<div class="dialog-overlay" id="sheet-right"><div class="sheet">
  <div class="sheet-header"><h2 class="sheet-title">Edit profile</h2><p class="sheet-description">Changes are saved to your public profile.</p></div>
  <div class="sheet-body demo-sheet-form">
    <label class="label">Display name</label><input class="input" value="Sofia Marquez">
    <label class="label">Title</label><input class="input" value="Staff Product Designer">
    <label class="label">Bio</label><textarea class="input" rows="4">Designing calm software at Northwind. Previously Linear & Figma.</textarea>
  </div>
  <div class="sheet-footer"><button class="btn btn-outline" data-dialog-close>Cancel</button><button class="btn" data-dialog-close>Save</button></div>${close}
</div></div>
<div class="dialog-overlay" id="sheet-left"><div class="sheet sheet-left sheet-sm">
  <div class="sheet-header"><h2 class="sheet-title">Northwind</h2></div>
  <nav class="sheet-body demo-sheet-nav">
    <a href="#" aria-current="page">${I.home} Home</a><a href="#">${I.inbox} Inbox <em>12</em></a><a href="#">${I.calendar} Calendar</a><a href="#">${I.users} Team</a><a href="#">${I.settings} Settings</a>
  </nav>${close}
</div></div>
<div class="dialog-overlay" id="sheet-top"><div class="sheet sheet-top">
  <div class="sheet-header"><h2 class="sheet-title">${I.sparkles} What's new in 4.2</h2><p class="sheet-description">Realtime cursors, a faster search index and 31 fixes.</p></div>
  <div class="sheet-footer"><button class="btn" data-dialog-close>Got it</button></div>${close}
</div></div>
<div class="dialog-overlay" id="sheet-bottom"><div class="sheet sheet-bottom">
  <div class="sheet-header"><h2 class="sheet-title">Cookie preferences</h2><p class="sheet-description">We use essential cookies to make Northwind work, and optional ones to understand usage.</p></div>
  <div class="sheet-footer"><button class="btn btn-outline" data-dialog-close>Essential only</button><button class="btn" data-dialog-close>Accept all</button></div>${close}
</div></div>`,
        css: `.demo-sheet-form { display: flex; flex-direction: column; gap: .4rem; } .demo-sheet-form .label { margin-top: .6rem; } .demo-sheet-form .label:first-child { margin-top: 0; } .demo-sheet-form textarea { height: auto; padding-top: .5rem; resize: vertical; }
.demo-sheet-nav { display: flex; flex-direction: column; gap: .15rem; padding-top: 0; }
.demo-sheet-nav a { display: flex; align-items: center; gap: .75rem; padding: .55rem .7rem; border-radius: var(--radius); color: var(--muted-fg); font-size: .875rem; font-weight: 500; }
.demo-sheet-nav a:hover { background: var(--muted); color: var(--fg); text-decoration: none; }
.demo-sheet-nav a[aria-current] { background: var(--muted); color: var(--fg); }
.demo-sheet-nav svg { width: 1.05rem; height: 1.05rem; } .demo-sheet-nav em { margin-left: auto; font-style: normal; font-size: .75rem; }
.sheet-title svg { display: inline; width: 1rem; height: 1rem; vertical-align: -2px; color: var(--primary); }`
      },
      {
        title: 'Floating cart',
        description: '<code>.sheet-floating</code> insets the panel with rounded corners.',
        html: `
<button class="btn" data-sheet-open="sheet-cart">${I.bag} Cart · 3</button>

<div class="dialog-overlay" id="sheet-cart"><div class="sheet sheet-floating">
  <div class="sheet-header"><h2 class="sheet-title">Your cart</h2><p class="sheet-description">Free shipping on orders over $150.</p></div>
  <div class="sheet-body">${cart}
    <div class="demo-sheet-total"><span>Subtotal</span><b>$267.00</b></div>
  </div>
  <div class="sheet-footer"><button class="btn" style="width:100%" data-dialog-close>Checkout</button></div>${close}
</div></div>`,
        css: `.demo-sheet-row { display: flex; align-items: center; gap: .875rem; padding: .75rem 0; border-bottom: 1px solid var(--border); }
.demo-sheet-row i { width: 3.5rem; height: 3.5rem; border-radius: var(--radius); background: linear-gradient(135deg, oklch(.85 .06 var(--h)), oklch(.7 .1 calc(var(--h) + 40))); flex-shrink: 0; }
.demo-sheet-row span { flex: 1; display: flex; flex-direction: column; font-size: .875rem; line-height: 1.35; } .demo-sheet-row small { color: var(--muted-fg); font-size: .75rem; }
.demo-sheet-row em { font-style: normal; font-weight: 600; font-size: .875rem; }
.demo-sheet-total { display: flex; justify-content: space-between; padding-top: 1rem; font-size: .9375rem; }`
      }
    ],
    api: [
      { name: '.sheet', type: 'class', desc: 'Panel inside a <code>.dialog-overlay</code> (or, v1-style, as the overlay\'s next sibling). Slides in from the right.' },
      { name: '.sheet-left / -top / -bottom', type: 'class', desc: 'Other edges.' },
      { name: '.sheet-sm / -lg / -xl', type: 'class', desc: '20 / 32 / 42rem.' },
      { name: '.sheet-floating', type: 'class', desc: 'Inset, rounded card.' },
      { name: '.sheet-header / -body / -footer', type: 'class', desc: 'Parts, plus <code>.sheet-title</code> and <code>.sheet-description</code>. The body scrolls.' },
      { name: '--sheet-size', type: 'var', default: '24rem', desc: 'Width (left/right) or max height (top/bottom).' },
      { name: 'data-sheet-open="id"', type: 'attr', desc: 'Alias of <code>data-dialog-open</code>. Close with <code>data-dialog-close</code>.' },
      { name: 'Ranj.sheet.open(id) / close(id)', type: 'js', desc: 'Same as <code>Ranj.dialog</code>.' }
    ]
  });
})();
