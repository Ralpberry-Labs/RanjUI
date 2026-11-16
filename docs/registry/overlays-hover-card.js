(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'hover-card',
    name: 'Hover Card',
    group: 'Overlays',
    description: 'A preview card for sighted pointer users: opens after a short hover delay, stays open while you move into it, and also opens on keyboard focus.',
    tags: ['js'],
    keywords: ['preview', 'profile card', 'link preview', 'popover on hover'],
    demos: [
      {
        title: 'Profile preview',
        html: `
<div class="demo-hc-text">Designed by
<span class="hover-card">
  <a href="#" class="hover-card-trigger">@rauno</a>
  <div class="hover-card-content">
    <div class="demo-hc-profile">
      <span class="demo-ov-avatar" style="--h:285;width:48px;height:48px;font-size:17px">RF</span>
      <div>
        <div class="demo-hc-name">Rauno Freiberg <span class="demo-hc-badge">${I.check}</span></div>
        <div class="demo-hc-handle">@rauno · Staff Design Engineer</div>
        <p>Making interfaces feel inevitable. Building at Northwind, writing about craft.</p>
        <div class="demo-hc-meta"><span>${I.pin} Helsinki</span><span>${I.calendar} Joined March 2019</span></div>
        <div class="demo-hc-stats"><span><b>1,204</b> following</span><span><b>48.3k</b> followers</span></div>
      </div>
    </div>
  </div>
</span>
and shipped last week.</div>`,
        css: `.demo-hc-text { font-size: .9375rem; color: var(--muted-fg); }
.demo-hc-profile { display: flex; gap: .875rem; }
.demo-hc-name { display: flex; align-items: center; gap: .3rem; font-weight: 600; font-size: .9375rem; }
.demo-hc-badge { display: grid; place-items: center; width: 1rem; height: 1rem; border-radius: 99px; background: var(--primary); color: var(--primary-fg); } .demo-hc-badge svg { width: .65rem; height: .65rem; stroke-width: 3.5; }
.demo-hc-handle { font-size: .8125rem; color: var(--muted-fg); }
.demo-hc-profile p { margin: .5rem 0; font-size: .8125rem; line-height: 1.5; }
.demo-hc-meta, .demo-hc-stats { display: flex; flex-wrap: wrap; gap: .25rem .875rem; font-size: .75rem; color: var(--muted-fg); }
.demo-hc-meta span { display: inline-flex; align-items: center; gap: .3rem; } .demo-hc-meta svg { width: .8rem; height: .8rem; }
.demo-hc-stats { margin-top: .4rem; } .demo-hc-stats b { color: var(--fg); font-weight: 600; }`
      },
      {
        title: 'Link preview',
        html: `
<div class="demo-hc-text">Read the
<span class="hover-card" data-placement="top" data-open-delay="300">
  <a href="#" class="hover-card-trigger">launch post</a>
  <div class="hover-card-content hover-card-flush" style="--hover-card-w: 18rem">
    <div class="demo-hc-cover">${I.sparkles}</div>
    <div style="padding: .875rem 1rem 1rem">
      <div class="demo-hc-site">${I.globe} northwind.app/blog</div>
      <div class="demo-hc-title">Introducing Northwind 4: realtime everything</div>
      <div class="demo-hc-handle" style="margin-top:.25rem">Multiplayer cursors, live comments, and a new sync engine that is 6× faster.</div>
    </div>
  </div>
</span>
before the webinar.</div>`,
        css: `.demo-hc-cover { height: 7rem; display: grid; place-items: center; color: #fff; background: radial-gradient(circle at 30% 20%, oklch(.75 .17 calc(var(--hue) + 60)), transparent 60%), linear-gradient(135deg, oklch(.55 .22 var(--hue)), oklch(.4 .2 calc(var(--hue) + 40))); }
.demo-hc-cover svg { width: 2rem; height: 2rem; }
.demo-hc-site { display: flex; align-items: center; gap: .35rem; font-size: .7rem; color: var(--muted-fg); text-transform: uppercase; letter-spacing: .05em; } .demo-hc-site svg { width: .75rem; height: .75rem; }
.demo-hc-title { font-weight: 600; font-size: .9rem; margin-top: .3rem; line-height: 1.35; }`
      }
    ],
    api: [
      { name: '.hover-card', type: 'class', desc: 'Wrapper: first child is the trigger, plus a <code>.hover-card-content</code>.' },
      { name: '.hover-card-trigger', type: 'class', desc: 'Optional underlined link style for inline triggers.' },
      { name: '.hover-card-flush', type: 'class', desc: 'Content without padding (for covers/media).' },
      { name: 'data-placement', type: 'attr', default: 'bottom', desc: 'Side and alignment.' },
      { name: 'data-open-delay / data-close-delay', type: 'attr', default: '500 / 250', desc: 'Milliseconds.' },
      { name: 'data-arrow', type: 'attr', desc: 'Show an arrow.' },
      { name: '--hover-card-w', type: 'var', default: '20rem', desc: 'Card width.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On <code>.hover-card</code>.' }
    ]
  });
})();
