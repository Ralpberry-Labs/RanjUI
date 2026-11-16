RanjDocs.add({
  id: 'bg-mesh',
  name: 'Mesh Gradient',
  group: 'Backgrounds',
  description: 'Four color points orbit slowly to create a living mesh gradient. CSS only, using an animated @property angle.',
  tags: ['new', 'fx'],
  keywords: ['mesh', 'gradient', 'stripe', 'animated gradient'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-mesh"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Beta</b> Payments for indie makers</span>
    <h2>Get paid in every currency</h2>
    <p>Accept cards, wallets and bank transfers in 135 currencies with one integration.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Create account</a><a class="btn btn-outline" href="#">Read the docs</a></div>
  </div>
</div>` },
    { title: 'Pastel card', description: 'Any container works. Here it sits behind a pricing card.', height: 320, html: `
<div class="bg-host" style="width:min(360px,100%);border-radius:var(--radius-xl);border:1px solid var(--border);box-shadow:var(--shadow-lg)">
  <div class="bg-mesh" style="--c1:#a5b4fc;--c2:#f9a8d4;--c3:#99f6e4;--c4:#fde68a;--speed:14s"></div>
  <div class="bg-content" style="padding:1.75rem">
    <div style="font-size:.8rem;font-weight:600;opacity:.7">Pro plan</div>
    <div style="font-size:2.4rem;font-weight:800;letter-spacing:-.04em">$24<span style="font-size:1rem;opacity:.6">/mo</span></div>
    <p style="margin:.4rem 0 1.2rem;opacity:.75">Unlimited projects, priority support and custom domains.</p>
    <button class="btn btn-block">Upgrade now</button>
  </div>
</div>` }
  ],
  api: [
    { name: '.bg-mesh', type: 'class', desc: 'Animated mesh gradient layer.' },
    { name: '--c1 … --c4', type: 'var', default: 'hue based', desc: 'Point colors.' },
    { name: '--base', type: 'var', default: 'tinted --bg', desc: 'Base color underneath the points.' },
    { name: '--speed', type: 'var', default: '22s', desc: 'One full orbit.' }
  ]
});
