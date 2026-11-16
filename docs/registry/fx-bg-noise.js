RanjDocs.add({
  id: 'bg-noise',
  name: 'Grain',
  group: 'Backgrounds',
  description: 'A film-grain overlay made from an inline SVG turbulence filter. Stack it on any background or image.',
  tags: ['new', 'fx'],
  keywords: ['noise', 'grain', 'texture', 'film', 'feTurbulence'],
  demos: [
    { title: 'Grain over a gradient', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px;background:linear-gradient(135deg, oklch(.62 .2 var(--hue)), oklch(.7 .18 calc(var(--hue) + 70)))">
  <div class="bg-noise" style="--opacity:.35"></div>
  <div class="bg-hero bg-hero-dark">
    <h2>Print-quality brand pages</h2>
    <p>A little grain makes flat gradients feel tactile and expensive.</p>
    <div class="bg-hero-actions"><a class="btn btn-contrast" href="#">See examples</a></div>
  </div>
</div>` },
    { title: 'Animated grain on a card', description: '<code>.bg-noise-animated</code> jitters the texture like real film.', height: 280, html: `
<div class="bg-host" style="width:min(380px,100%);padding:1.75rem;border-radius:var(--radius-xl);background:var(--card);border:1px solid var(--border);box-shadow:var(--shadow-md)">
  <div class="bg-noise bg-noise-animated"></div>
  <div class="bg-content">
    <div style="font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted-fg)">Now showing</div>
    <div style="font-size:1.6rem;font-weight:800;letter-spacing:-.03em;margin:.25rem 0">The Last Light</div>
    <p style="color:var(--muted-fg)">A 35mm documentary about the final drive-in theater in Nevada.</p>
  </div>
</div>` }
  ],
  api: [
    { name: '.bg-noise', type: 'class', desc: 'Static grain overlay.' },
    { name: '.bg-noise-animated', type: 'class', desc: 'Stepped jitter animation.' },
    { name: '--opacity', type: 'var', default: '.22 / .12 dark', desc: 'Grain strength.' },
    { name: '--size', type: 'var', default: '160px', desc: 'Tile size (bigger = coarser).' }
  ]
});
