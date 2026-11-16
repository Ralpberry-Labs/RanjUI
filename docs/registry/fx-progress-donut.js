RanjDocs.add({
  id: 'progress-donut',
  name: 'Progress Donut',
  group: 'Loaders',
  description: 'A ring with the percentage in the middle. Optional gradient stroke; values animate when they scroll into view.',
  tags: ['new', 'fx', 'js'],
  keywords: ['donut', 'ring progress', 'radial progress', 'percentage', 'circular progress'],
  demos: [
    { title: 'Values', html: `
<span class="loader-donut" data-value="24"></span>
<span class="loader-donut loader-donut-gradient" data-value="68"></span>
<span class="loader-donut" data-value="92" style="--color:var(--success);--thick:6px"></span>
<span class="loader-donut" data-value="8" style="--color:var(--destructive);--size:56px"></span>` },
    { title: 'Storage card', height: 280, html: `
<div style="width:min(360px,100%);display:flex;align-items:center;gap:1.2rem;padding:1.25rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <span class="loader-donut loader-donut-gradient" data-value="73" style="--size:96px;--thick:10px" aria-label="Storage used"></span>
  <div><b style="font-size:1.05rem">73 GB of 100 GB</b><p style="color:var(--muted-fg);font-size:.85rem;margin:.2rem 0 .7rem">Photos are using most of your space.</p><button class="btn btn-sm btn-outline" data-demo-free>Free up space</button></div>
</div>`, js: `
var d = root.querySelector('.loader-donut'), b = root.querySelector('b');
root.querySelector('[data-demo-free]').onclick = function () { Ranj.progress(d, 41); b.textContent = '41 GB of 100 GB'; };` }
  ],
  api: [
    { name: '.loader-donut', type: 'class', desc: 'Ring progress with a centered label (auto-added).' },
    { name: '.loader-donut-gradient', type: 'class', desc: 'Gradient stroke.' },
    { name: 'data-value', type: 'attr', default: '0', desc: '0..100.' },
    { name: 'data-no-label', type: 'attr', desc: 'Hide the percentage text.' },
    { name: '--size / --thick / --color', type: 'var', default: '72px / 8px / --primary', desc: 'Geometry and color.' },
    { name: 'Ranj.progress(el, value)', type: 'js', desc: 'Set the value.' }
  ]
});
