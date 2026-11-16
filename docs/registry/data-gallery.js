(function () {
var u = function (id, w, h) { return 'https://images.unsplash.com/' + id + '?w=' + w + (h ? '&h=' + h : '') + '&q=70&auto=format&fit=crop'; };
var P = [
  ['photo-1506905925346-21bda4d32df4', 'Seceda ridgeline', 'Dolomites · f/8 · 1/250s', 800, 1000],
  ['photo-1519681393784-d120267933ba', 'Milky Way over the Sierra', 'Yosemite · 25s · ISO 3200', 800, 560],
  ['photo-1501785888041-af3ef285b470', 'Lago di Braies', 'South Tyrol · f/11', 800, 600],
  ['photo-1469474968028-56623f02e42e', 'First light, Isle of Skye', 'Scotland · f/5.6', 800, 1100],
  ['photo-1470071459604-3b5ec3a7fe05', 'Fog in the pines', 'Black Forest · f/4', 800, 540],
  ['photo-1507525428034-b723cf961d3e', 'Low tide', 'Maldives · f/9', 800, 900],
  ['photo-1464822759023-fed622ff2c3b', 'Cloud sea', 'Mont Blanc · f/8', 800, 620],
  ['photo-1433086966358-54859d0ed716', 'Skógafoss', 'Iceland · 1/2s', 800, 1050],
  ['photo-1426604966848-d7adac402bff', 'Valley floor', 'Yosemite · f/10', 800, 560]
];
function item(p, cls, big) {
  return '  <a class="gallery-item' + (cls ? ' ' + cls : '') + '" href="' + u(p[0], 1800) + '"><img src="' + u(p[0], big ? 1000 : 600, p[4] && !big ? Math.round(600 * p[4] / p[3]) : 0) + '" alt="' + p[1] + '" loading="lazy"><span class="gallery-caption">' + p[1] + '<small>' + p[2] + '</small></span></a>';
}
RanjDocs.add({
  id: 'gallery',
  name: 'Gallery',
  group: 'Data Display',
  description: 'Responsive image grids (uniform, masonry, bento) with hover captions and a built-in lightbox: the photo zooms out of its thumbnail, then arrows, swipe, keyboard, thumbnails and swipe-down-to-close. Focus is trapped and returned; Escape closes.',
  tags: ['new', 'js', 'fx'],
  keywords: ['lightbox', 'photos', 'masonry', 'image grid', 'portfolio', 'bento', 'viewer', 'zoom'],
  demos: [
    {
      title: 'Masonry',
      description: 'Click any photo. Use ← → to browse, Escape to close, or swipe on touch.',
      center: false,
      html: `<div class="gallery gallery-masonry" data-gallery aria-label="Landscapes" style="--gallery-min: 13rem">
${P.map(function (p) { return item(p); }).join('\n')}
</div>`
    },
    {
      title: 'Bento',
      description: 'The first item spans 2×2; add <code>.is-wide</code> or <code>.is-tall</code> to others. <code>.gallery-more</code> with <code>data-more</code> shows a “+12” overlay.',
      center: false,
      html: `<div class="gallery gallery-bento" data-gallery aria-label="Trip highlights">
${item(P[0], '', true)}
${item(P[2], 'is-wide', true)}
${item(P[4], '', false)}
${item(P[6], '', false)}
${item(P[1], 'is-wide', true)}
${item(P[8], 'gallery-more', false).replace('class="gallery-item gallery-more"', 'class="gallery-item gallery-more" data-more="+12"')}
${item(P[5], '', false)}
</div>`
    },
    {
      title: 'Uniform grid',
      description: 'Square tiles with <code>--gallery-ratio: 1</code>. <code>data-loop="false"</code> stops at the ends; <code>data-thumbs="false"</code> hides the filmstrip.',
      center: false,
      html: `<div class="gallery" data-gallery data-loop="false" style="--gallery-min: 9rem; --gallery-ratio: 1; --gallery-gap: .5rem; --gallery-radius: var(--radius)" aria-label="Product shots">
${P.slice(0, 6).map(function (p) { return '  <a class="gallery-item" href="' + u(p[0], 1600) + '" data-caption="' + p[1] + '"><img src="' + u(p[0], 400, 400) + '" alt="' + p[1] + '" loading="lazy"></a>'; }).join('\n')}
</div>`
    }
  ],
  api: [
    { name: '[data-gallery]', type: 'attr', desc: 'Enables the lightbox for .gallery-item (or [data-lightbox]) children.' },
    { name: '.gallery', type: 'class', desc: 'Auto-fill grid with --gallery-ratio tiles.' },
    { name: '.gallery-masonry / .gallery-bento', type: 'class', desc: 'Column masonry with natural heights; bento grid (first item 2×2).' },
    { name: '.gallery-item / .gallery-caption', type: 'class', desc: 'Tile (an a with href to the full image, or any element with data-src) and its hover caption.' },
    { name: '.is-wide / .is-tall / .gallery-more[data-more]', type: 'class', desc: 'Bento spans; "+N more" overlay.' },
    { name: 'data-src / data-caption', type: 'attr', desc: 'On an item: full-size source (defaults to href, then img src) and lightbox caption (defaults to .gallery-caption, then alt).' },
    { name: 'data-loop / data-thumbs', type: 'attr', default: 'true / true', desc: 'Wrap around at the ends; show the thumbnail strip.' },
    { name: '--gallery-min / --gallery-gap / --gallery-ratio / --gallery-radius', type: 'var', default: '12rem / .75rem / 4/3', desc: 'Column min width, gap, tile ratio, corner radius.' },
    { name: 'Ranj.lightbox(root, index)', type: 'js', desc: 'Open the viewer programmatically. Returns { close(), show(i) }. Also el.ranjGallery.open(i).' },
    { name: 'ranj:open / ranj:change / ranj:close', type: 'event', desc: 'On the gallery. detail: { index, item }' }
  ]
});
})();
