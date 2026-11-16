(function () {
  // Fictional wordmarks drawn with simple shapes + text so the demo needs no assets.
  var L = [
    ['<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 21h20z"/></svg>', 'Vertex'],
    ['<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="12" r="6"/><circle cx="16" cy="12" r="6" opacity=".55"/></svg>', 'Lumen'],
    ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 18 12 6l8 12"/></svg>', 'Northwind'],
    ['<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="4" opacity=".5"/></svg>', 'Quadra'],
    ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/></svg>', 'Halfmoon'],
    ['<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 12c4-8 14-8 18 0-4 8-14 8-18 0z"/></svg>', 'Ellipse']
  ];
  function logos() { return L.map(function (l) { return '<a href="#" aria-label="' + l[1] + '">' + l[0] + '<span>' + l[1] + '</span></a>'; }).join('\n  '); }
  RanjDocs.add({
    id: 'logo-cloud',
    name: 'Logo cloud',
    group: 'Base',
    description: 'A static grid of customer or partner logos, muted until hovered. Use SVG wordmarks or grayscale images. For a scrolling version see Marquee.',
    tags: ['new'],
    keywords: ['logos', 'customers', 'trusted by', 'brands', 'partners', 'social proof'],
    demos: [
      {
        title: 'Trusted by',
        center: false,
        html: `<div>
  <p class="logo-cloud-title">Trusted by 4,000+ product teams</p>
  <div class="logo-cloud logo-cloud-focus">
  ${logos()}
  </div>
</div>`
      },
      {
        title: 'Bordered grid',
        center: false,
        html: `<div class="logo-cloud logo-cloud-grid" style="--logo-cols:3">
  ${logos()}
</div>`
      }
    ],
    api: [
      { name: '.logo-cloud', type: 'class', desc: 'Grid of logos; each child can hold an <code>svg</code>/<code>img</code> plus text.' },
      { name: '--logo-cols / --logo-h', type: 'var', default: '6 / 1.75rem', desc: 'Columns (drops to 3 then 2 on small screens) and logo height.' },
      { name: '.logo-cloud-focus', type: 'class', desc: 'Dim the others while one logo is hovered.' },
      { name: '.logo-cloud-grid', type: 'class', desc: 'Bordered tile grid.' },
      { name: '.logo-cloud-title', type: 'class', desc: 'Centered caption / fade the edges. Also: <code>.logo-cloud-fade</code>' }
    ]
  });
})();
