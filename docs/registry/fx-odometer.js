RanjDocs.add({
  id: 'odometer',
  name: 'Odometer',
  group: 'Micro-interactions',
  description: 'A rolling digit counter. Each digit spins on its own strip with a slight stagger, and separators stay put.',
  tags: ['new', 'fx', 'js'],
  keywords: ['counter', 'number animation', 'rolling numbers', 'ticker', 'slot', 'count up'],
  demos: [
    { title: 'Live revenue', description: 'Counts up from <code>data-from</code> when it scrolls into view.', height: 260, html: `
<div style="display:grid;justify-items:center;gap:.3rem;text-align:center">
  <small style="color:var(--muted-fg);font-weight:600;letter-spacing:.08em;text-transform:uppercase">Revenue this month</small>
  <span class="odometer" data-from="0" data-value="1284930.55" data-prefix="$" style="font-size:clamp(2.2rem,6vw,3.6rem);font-weight:800;letter-spacing:-.04em"></span>
  <button class="btn btn-outline btn-sm" data-demo-odo style="margin-top:.6rem">Add a sale</button>
</div>`, js: `
var o = root.querySelector('.odometer'), v = 1284930.55;
root.querySelector('[data-demo-odo]').onclick = function () { v += Math.round(Math.random() * 90000) / 100 + 40; Ranj.odometer(o, v); };` },
    { title: 'Stats row', height: 220, html: `
<div style="display:flex;flex-wrap:wrap;gap:2.5rem;justify-content:center;text-align:center">
  <div><span class="odometer" data-from="0" data-value="48200" style="font-size:2.2rem;font-weight:800"></span><div style="color:var(--muted-fg);font-size:.85rem">Developers</div></div>
  <div><span class="odometer" data-from="0" data-value="99.98" data-suffix="%" style="font-size:2.2rem;font-weight:800"></span><div style="color:var(--muted-fg);font-size:.85rem">Uptime</div></div>
  <div><span class="odometer" data-from="0" data-value="312" style="font-size:2.2rem;font-weight:800;color:var(--primary)"></span><div style="color:var(--muted-fg);font-size:.85rem">Components</div></div>
</div>` }
  ],
  api: [
    { name: '.odometer', type: 'class', desc: 'Any inline element.' },
    { name: 'data-value', type: 'attr', desc: 'Number to show.' },
    { name: 'data-from', type: 'attr', desc: 'Start here and roll to the value when scrolled into view.' },
    { name: 'data-decimals', type: 'attr', default: 'auto', desc: 'Fixed decimal places.' },
    { name: 'data-prefix / data-suffix', type: 'attr', desc: 'Static text, e.g. <code>$</code> or <code>%</code>.' },
    { name: 'data-format', type: 'attr', default: 'grouped', desc: '<code>none</code> to skip thousands separators.' },
    { name: '--odo-dur', type: 'var', default: '1.4s', desc: 'Roll duration.' },
    { name: 'Ranj.odometer(el, value)', type: 'js', desc: 'Roll to a new value.' }
  ]
});
