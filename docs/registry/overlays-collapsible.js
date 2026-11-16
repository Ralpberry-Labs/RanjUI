(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'collapsible',
    name: 'Collapsible',
    group: 'Navigation',
    description: 'A single region that expands and collapses with a smooth height animation. Use it for "show more", advanced options or grouped lists.',
    tags: ['js'],
    keywords: ['disclosure', 'expand', 'show more', 'toggle', 'details'],
    demos: [
      {
        title: 'Starred repositories',
        html: `
<div class="collapsible demo-col" style="width: min(22rem, calc(100vw - 4rem))">
  <div class="demo-col-head">
    <span><b>@peduarte</b> starred 3 repositories</span>
    <button class="btn btn-ghost btn-sm collapsible-trigger" aria-label="Toggle">${I.svg('chevronsUpDown', 16)}</button>
  </div>
  <div class="demo-col-row">@radix-ui/primitives</div>
  <div class="collapsible-content">
    <div class="demo-col-list"><div class="demo-col-row">@radix-ui/colors</div><div class="demo-col-row">@stitches/react</div></div>
  </div>
</div>`,
        css: `.demo-col-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; font-size: .875rem; margin-bottom: .5rem; }
.demo-col-head b { font-weight: 600; } .demo-col-head .btn { width: 2rem; padding: 0; }
.demo-col-row { padding: .6rem 1rem; border: 1px solid var(--border); border-radius: var(--radius); font-family: var(--font-mono); font-size: .8125rem; background: var(--card); }
.demo-col-list { display: grid; gap: .5rem; padding-top: .5rem; }`
      },
      {
        title: 'Show more',
        description: '<code>.collapsible-peek</code> keeps a faded preview visible while collapsed (<code>--peek</code>).',
        html: `
<div class="collapsible collapsible-peek demo-col-article" style="--peek: 5.5rem; width: min(30rem, calc(100vw - 4rem))">
  <div class="collapsible-content">
    <div>
      <p>Northwind started as a weekend project to replace the spreadsheet our design team used to track feedback. Within a month, three other teams had asked for access.</p>
      <p>Today it powers reviews for over 4,000 companies. We still run it the same way: small team, weekly releases, and every feature dog-fooded for two weeks before it ships.</p>
      <p>We're hiring engineers who care about details. If that's you, say hello.</p>
    </div>
  </div>
  <button class="btn btn-link collapsible-trigger"><span class="demo-col-more">Read more</span><span class="demo-col-less">Show less</span> ${I.svg('chevronDown', 14, 'class="collapsible-chevron"')}</button>
</div>`,
        css: `.demo-col-article p { font-size: .9063rem; line-height: 1.7; color: var(--muted-fg); margin-bottom: .75rem; }
.demo-col-article .btn-link { display: inline-flex; align-items: center; gap: .25rem; margin-top: .25rem; font-size: .875rem; font-weight: 600; }
.demo-col-less { display: none; } .collapsible[data-state="open"] .demo-col-more { display: none; } .collapsible[data-state="open"] .demo-col-less { display: inline; }`
      },
      {
        title: 'Advanced options',
        html: `
<div class="collapsible demo-col-form" style="width: min(24rem, calc(100vw - 4rem))">
  <label class="label">Repository name</label>
  <input class="input" value="northwind-web">
  <button class="demo-col-adv collapsible-trigger">${I.sliders} Advanced options ${I.svg('chevronDown', 14, 'class="collapsible-chevron"')}</button>
  <div class="collapsible-content">
    <div class="demo-col-fields">
      <label class="label">Default branch</label><input class="input" value="main">
      <label class="label">Build command</label><input class="input" value="npm run build" style="font-family:var(--font-mono);font-size:.8125rem">
    </div>
  </div>
</div>`,
        css: `.demo-col-form { display: grid; gap: .4rem; } .demo-col-form .label { margin: 0; font-size: .8125rem; }
.demo-col-adv { display: inline-flex; align-items: center; gap: .4rem; justify-self: start; margin-top: .5rem; padding: .25rem 0; font-size: .8125rem; font-weight: 500; color: var(--muted-fg); }
.demo-col-adv:hover { color: var(--fg); } .demo-col-adv svg { width: .9rem; height: .9rem; }
.demo-col-fields { display: grid; gap: .4rem; padding-top: .5rem; }`
      }
    ],
    api: [
      { name: '.collapsible', type: 'class', desc: 'Root; holds a <code>.collapsible-trigger</code> and a <code>.collapsible-content</code> (content gets a single inner wrapper automatically).' },
      { name: 'data-state="open"', type: 'attr', desc: 'Open initially.' },
      { name: '.collapsible-peek', type: 'class', desc: 'Show a faded preview while collapsed. Height via <code>--peek</code> (5rem).' },
      { name: '.collapsible-chevron', type: 'class', desc: 'Any icon that should rotate when open.' },
      { name: 'Ranj.collapsible.toggle(el, open?)', type: 'js', desc: 'Programmatic toggle.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ open }</code>.' }
    ]
  });
})();
