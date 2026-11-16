RanjDocs.add({
  id: 'count-up',
  name: 'Count Up',
  group: 'Text Effects',
  description: 'Animates numbers to their value when they scroll into view, with prefix, suffix, decimals and thousands separators. Width is locked so layouts never jitter.',
  tags: ['new', 'fx', 'js'],
  keywords: ['counter', 'number animation', 'odometer', 'stats', 'kpi'],
  demos: [
    {
      title: 'Stats row',
      height: 240,
      html: `
<div class="demo-count-up-stats">
  <div><b data-count-up data-to="12480" data-suffix="+">0</b><span>Teams onboard</span></div>
  <div><b data-count-up data-to="99.98" data-suffix="%" data-from="90">0</b><span>Uptime last 12 months</span></div>
  <div><b data-count-up data-to="2.4" data-prefix="$" data-suffix="M" data-delay="200">0</b><span>Saved for customers</span></div>
  <div><b data-count-up data-to="38" data-suffix="ms" data-from="400" data-duration="2600">0</b><span>Median response</span></div>
</div>`,
      css: `.demo-count-up-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; width: 100%; max-width: 860px; }
.demo-count-up-stats > div { padding: 1.25rem; border-radius: var(--radius-lg); background: var(--card); border: 1px solid var(--border); display: grid; gap: .25rem; }
.demo-count-up-stats b { font-family: var(--font-display); font-size: 2.25rem; font-weight: 800; letter-spacing: -.03em; }
.demo-count-up-stats span { color: var(--muted-fg); font-size: .85rem; }`
    },
    {
      title: 'Live value',
      description: 'Call <code>Ranj.countUp(el, value)</code> to animate to a new number from wherever it is now.',
      html: `
<div class="demo-count-up-live">
  <span class="demo-count-up-label">Revenue today</span>
  <b data-count-up data-to="48210.5" data-prefix="$" data-decimals="2" data-trigger="load">0</b>
  <button class="btn btn-outline btn-sm" data-demo-bump>Simulate sale</button>
</div>`,
      js: `var n = root.querySelector('[data-count-up]'), v = 48210.5;
root.querySelector('[data-demo-bump]').onclick = function () { v += Math.round(Math.random() * 900 + 100) + .99; Ranj.countUp(n, v); };`,
      css: `.demo-count-up-live { display: grid; justify-items: center; gap: .5rem; }
.demo-count-up-label { color: var(--muted-fg); font-size: .85rem; }
.demo-count-up-live b { font-family: var(--font-display); font-size: 3rem; font-weight: 800; letter-spacing: -.03em; }`
    },
    {
      title: 'Separators & locales',
      html: `
<div class="demo-count-up-fmt">
  <span data-count-up data-to="1250000" data-separator=" " data-suffix=" €">0</span>
  <span data-count-up data-to="3141592.65" data-separator="." data-decimal="," data-decimals="2">0</span>
  <span data-count-up data-to="100" data-from="0" data-separator="" data-suffix="/100" data-duration="3000">0</span>
</div>`,
      css: `.demo-count-up-fmt { display: grid; gap: .5rem; text-align: center; font-size: 1.6rem; font-weight: 700; }`
    }
  ],
  api: [
    { name: 'data-count-up', type: 'attr', desc: 'Enables the counter. Target comes from <code>data-to</code> or the text.' },
    { name: 'data-to / data-from', type: 'attr', default: '— / 0', desc: 'End and start values (counting down works too).' },
    { name: 'data-duration / data-delay', type: 'attr', default: '2000 / 0', desc: 'Milliseconds. Ease-out-expo curve.' },
    { name: 'data-decimals', type: 'attr', default: 'auto', desc: 'Decimal places (inferred from <code>data-to</code>).' },
    { name: 'data-prefix / data-suffix', type: 'attr', desc: 'Text before / after the number.' },
    { name: 'data-separator / data-decimal', type: 'attr', default: ', / .', desc: 'Thousands separator (empty for none) and decimal mark.' },
    { name: 'data-trigger / data-repeat', type: 'attr', default: 'view / false', desc: '<code>load</code> to start immediately; repeat re-counts on re-entry.' },
    { name: 'Ranj.countUp(el, value)', type: 'js', desc: 'Animate to a new value.' },
    { name: 'ranj:done', type: 'event', desc: 'detail: <code>{ value }</code>' }
  ]
});
