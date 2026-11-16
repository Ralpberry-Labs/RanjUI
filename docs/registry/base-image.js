(function () {
  var A = RB.art;
  RanjDocs.add({
    id: 'image',
    name: 'Image',
    group: 'Base',
    description: 'Framed images with a hairline ring, rounded corners, captions, hover zoom, grayscale-to-color and overlay captions. Broken images fall back to a placeholder.',
    tags: ['new', 'js'],
    keywords: ['img', 'figure', 'photo', 'picture', 'caption', 'zoom', 'gallery'],
    demos: [
      {
        title: 'Figure with caption',
        html: `<figure class="figure" style="width:min(100%,30rem)">
  <div class="img-frame aspect-video">${A(1, 'img-art')}</div>
  <figcaption><b>Fig. 1</b> Sunrise over the Algarve coast, shot on a 35mm prime.</figcaption>
</figure>`
      },
      {
        title: 'Hover effects',
        description: 'Zoom, grayscale to color, and an overlay caption.',
        center: false,
        html: `<div class="grid grid-auto" style="--min:200px">
  <figure class="figure"><div class="img-frame img-zoom aspect-photo">${A(0, 'img-art')}</div><figcaption>.img-zoom</figcaption></figure>
  <figure class="figure"><div class="img-frame img-grayscale aspect-photo">${A(2, 'img-art')}</div><figcaption>.img-grayscale</figcaption></figure>
  <figure class="figure"><figure class="img-frame img-overlay img-zoom aspect-photo" style="margin:0">${A(3, 'img-art')}<figcaption>Joshua Tree · 4 photos</figcaption></figure><figcaption>.img-overlay</figcaption></figure>
</div>`
      },
      {
        title: 'Shapes and badges',
        html: `<div class="img-frame aspect-square" style="width:8rem;--img-radius:var(--radius-sm)">${A(4, 'img-art')}</div>
<div class="img-frame aspect-square" style="width:8rem">${A(1, 'img-art')}<span class="badge badge-contrast badge-sm">NEW</span></div>
<div class="img-frame aspect-square" style="width:8rem;--img-radius:50%">${A(2, 'img-art')}</div>
<div class="img-frame aspect-portrait" style="width:7rem">${A(0, 'img-art')}</div>`
      },
      {
        title: 'Broken image fallback',
        description: 'ranj.js marks failed images with <code>data-state="error"</code> and shows a placeholder.',
        html: `<figure class="figure" style="width:14rem"><div class="img-frame aspect-photo"><img src="data:image/png;base64,broken" alt="Missing product shot"></div><figcaption>product-hero.png</figcaption></figure>`
      }
    ],
    api: [
      { name: '.img-frame', type: 'class', desc: 'Clipping wrapper with a hairline inner ring. Children <code>img</code> / <code>.img-art</code> cover it.' },
      { name: '.img-zoom', type: 'class', desc: 'Hover effects. <code>--zoom</code> sets the scale (1.08). Also: <code>.img-grayscale</code> <code>.img-overlay</code>' },
      { name: '.img', type: 'class', desc: 'Classes for a bare <code>&lt;img&gt;</code>. Also: <code>.img-rounded</code> <code>.img-rounded-xl</code> <code>.img-circle</code> <code>.img-bordered</code>' },
      { name: '.figure / .figure-caption', type: 'class', desc: 'Image + caption stack.' },
      { name: '.img-grid', type: 'class', desc: 'Auto-fill gallery grid (<code>--min</code>).' },
      { name: '--img-radius', type: 'var', default: '--radius-xl', desc: 'Corner radius of a frame.' },
      { name: 'data-state="error"', type: 'attr', desc: 'Set automatically when the image fails to load.' }
    ]
  });
})();
