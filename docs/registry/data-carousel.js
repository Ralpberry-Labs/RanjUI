(function () {
var img = function (id, w) { return 'https://images.unsplash.com/' + id + '?w=' + (w || 1200) + '&q=70&auto=format&fit=crop'; };
var L = ['photo-1506905925346-21bda4d32df4', 'photo-1519681393784-d120267933ba', 'photo-1501785888041-af3ef285b470', 'photo-1469474968028-56623f02e42e', 'photo-1470071459604-3b5ec3a7fe05', 'photo-1507525428034-b723cf961d3e', 'photo-1464822759023-fed622ff2c3b', 'photo-1433086966358-54859d0ed716', 'photo-1426604966848-d7adac402bff', 'photo-1475924156734-496f6cac6ec1'];
var places = [['Dolomites, Italy', 'Golden hour above the clouds'], ['Yosemite, California', 'Stars over the high Sierra'], ['Lake Braies, Italy', 'Glass-still water at dawn'], ['Isle of Skye, Scotland', 'Where the light breaks through'], ['Black Forest, Germany', 'Mist between the pines'], ['Maldives', 'Turquoise to the horizon']];
var arrows = '<button class="carousel-prev"></button><button class="carousel-next"></button>';
RanjDocs.add({
  id: 'carousel',
  name: 'Carousel',
  group: 'Data Display',
  description: 'A rewritten slider with real pointer-event drag and swipe (momentum and rubber-banding), keyboard support, dots with autoplay progress, thumbnails, infinite loop, several slides per view, a centered peek layout and crossfade. Autoplay pauses on hover, focus, when offscreen and when the tab is hidden.',
  tags: ['js', 'fx'],
  keywords: ['slider', 'slideshow', 'swiper', 'gallery', 'hero slider', 'peek', 'coverflow', 'swipe'],
  demos: [
    {
      title: 'Autoplay with captions',
      description: 'Loops forever. The active dot fills while it waits, and pauses while you hover. Drag, swipe or use the arrow keys.',
      center: false,
      html: `<div class="carousel carousel-fill carousel-dots-inside carousel-arrows-hover" data-loop data-autoplay="5000" aria-label="Destinations">
  <div class="carousel-viewport">
    <div class="carousel-track">
${places.slice(0, 5).map(function (p, i) { return '      <div class="carousel-slide"><img src="' + img(L[i]) + '" alt="' + p[0] + '"><div class="carousel-caption"><b>' + p[0] + '</b><span>' + p[1] + '</span></div></div>'; }).join('\n')}
    </div>
  </div>
  ${arrows}
  <div class="carousel-dots"></div>
</div>`
    },
    {
      title: 'Centered peek',
      description: 'Inspired by Ripplix’s Centered Peek Carousel: the active card sits in the middle at full scale while its neighbours peek in, dimmed. Click a neighbour to bring it forward. <code>--peek</code> sets the card width.',
      center: false,
      pad: false,
      html: `<div class="carousel carousel-peek demo-carousel-peekwrap" data-loop aria-label="Collections">
  <div class="carousel-viewport">
    <div class="carousel-track">
${['Alpine', 'Night sky', 'Lakes', 'Highlands', 'Forest', 'Coast', 'Peaks'].map(function (t, i) { return '      <div class="carousel-slide demo-carousel-peek"><img src="' + img(L[(i + 3) % L.length], 900) + '" alt=""><div class="carousel-caption"><b>' + t + '</b><span>' + (12 + i * 7) + ' photos · Updated ' + ['today', 'yesterday', '2d ago', 'last week', 'Nov 2', 'Oct 28', 'Oct 19'][i] + '</span></div></div>'; }).join('\n')}
    </div>
  </div>
  <div class="carousel-dots"></div>
</div>`,
      css: `.demo-carousel-peekwrap { --peek: 58%; padding: 1.5rem 0; }
@media (max-width: 640px) { .demo-carousel-peekwrap { --peek: 82%; } }
.demo-carousel-peek { aspect-ratio: 16 / 10; }`
    },
    {
      title: 'Multiple per view',
      description: 'Set <code>--per-view</code> (fractions give a peek) and change it in media queries; dots and snapping adapt. Controls can sit below the track.',
      center: false,
      html: `<div class="carousel carousel-cards demo-carousel-multi" aria-label="Plans">
  <div class="carousel-viewport">
    <div class="carousel-track">
${[['Notion', 'Docs, wikis and projects', '4.8', '$10'], ['Linear', 'Issue tracking that flies', '4.9', '$8'], ['Figma', 'Design together, live', '4.7', '$15'], ['Raycast', 'Your shortcut to everything', '4.9', '$8'], ['Arc', 'A calmer browser', '4.6', 'Free'], ['Vercel', 'Ship the frontend cloud', '4.8', '$20'], ['Supabase', 'Postgres, batteries included', '4.8', '$25']].map(function (a, i) { return '      <div class="carousel-slide"><div class="carousel-card"><div class="demo-carousel-app" style="--h:' + (250 + i * 37) + '">' + a[0][0] + '</div><b>' + a[0] + '</b><p>' + a[1] + '</p><div class="demo-carousel-meta"><span>★ ' + a[2] + '</span><span>' + a[3] + ' / seat</span></div></div></div>'; }).join('\n')}
    </div>
  </div>
  <div class="carousel-controls">
    <span class="carousel-counter"></span>
    <div class="carousel-dots"></div>
    <div class="carousel-controls-arrows">${arrows}</div>
  </div>
</div>`,
      css: `.demo-carousel-multi { --per-view: 3; --gap: 1rem; }
@media (max-width: 900px) { .demo-carousel-multi { --per-view: 2.2; } }
@media (max-width: 560px) { .demo-carousel-multi { --per-view: 1.25; --gap: .75rem; } }
.demo-carousel-app { width: 2.75rem; height: 2.75rem; border-radius: .8rem; display: grid; place-items: center; font-weight: 800; font-size: 1.2rem; color: #fff; margin-bottom: 1rem; background: linear-gradient(135deg, oklch(.68 .17 var(--h)), oklch(.5 .2 calc(var(--h) + 40))); box-shadow: 0 8px 20px -8px oklch(.5 .2 var(--h)); }
.carousel-card b { font-size: 1rem; }
.carousel-card p { color: var(--muted-fg); font-size: .875rem; margin: .2rem 0 1rem; }
.demo-carousel-meta { display: flex; justify-content: space-between; font-size: .8rem; color: var(--muted-fg); border-top: 1px solid var(--border); padding-top: .75rem; }`
    },
    {
      title: 'Thumbnails',
      description: 'An empty <code>.carousel-thumbs</code> is filled from the slide images (or <code>data-thumb</code>).',
      center: false,
      html: `<div class="carousel carousel-fill" style="--ratio: 3 / 2; max-width: 720px; margin: auto" aria-label="Product photos">
  <div class="carousel-viewport">
    <div class="carousel-track">
${L.slice(2, 8).map(function (id) { return '      <div class="carousel-slide"><img src="' + img(id, 1000) + '" alt=""></div>'; }).join('\n')}
    </div>
  </div>
  ${arrows}
  <div class="carousel-thumbs"></div>
</div>`
    },
    {
      title: 'Crossfade',
      description: '<code>.carousel-fade</code> stacks the slides and crossfades with a slow Ken Burns zoom. A <code>.carousel-play</code> button toggles autoplay.',
      center: false,
      html: `<div class="carousel carousel-fade carousel-fill carousel-dots-inside" data-autoplay="4000" style="--ratio: 21 / 9; --duration: 900ms" aria-label="Featured">
  <div class="carousel-viewport">
    <div class="carousel-track">
${places.slice(2, 6).map(function (p, i) { return '      <div class="carousel-slide"><img src="' + img(L[i + 6], 1400) + '" alt="' + p[0] + '"><div class="carousel-caption"><b>' + p[0] + '</b><span>' + p[1] + '</span></div></div>'; }).join('\n')}
    </div>
  </div>
  <div class="carousel-dots"></div>
  <button class="carousel-play demo-carousel-play" aria-pressed="false" aria-label="Pause slideshow"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg></button>
</div>`,
      css: `.demo-carousel-play { position: absolute; right: 1rem; bottom: .7rem; z-index: 3; width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: 99px; color: #fff; background: rgb(0 0 0 / .35); backdrop-filter: blur(8px); }
.demo-carousel-play svg { width: .85rem; height: .85rem; }
.demo-carousel-play[aria-pressed="true"] svg { display: none; }
.demo-carousel-play[aria-pressed="true"]::before { content: ''; width: 0; height: 0; border-left: 9px solid #fff; border-top: 6px solid transparent; border-bottom: 6px solid transparent; margin-left: 2px; }`
    }
  ],
  api: [
    { name: '.carousel > .carousel-viewport > .carousel-track > .carousel-slide', type: 'class', desc: 'Structure. The viewport is created if missing.' },
    { name: '.carousel-prev / .carousel-next', type: 'class', desc: 'Arrow buttons (icons added if empty). Generated automatically when absent; data-arrows="false" disables.' },
    { name: '.carousel-dots / .carousel-thumbs / .carousel-counter', type: 'class', desc: 'Empty containers filled with dots, thumbnails (from slide images or data-thumb) and a "3 / 8" counter.' },
    { name: '.carousel-controls', type: 'class', desc: 'Row below the viewport for counter, dots and arrows (.carousel-controls-arrows).' },
    { name: '.carousel-peek', type: 'class', desc: 'Centered peek layout: active slide centered, neighbours scaled and dimmed. Width from --peek.' },
    { name: '.carousel-fade', type: 'class', desc: 'Crossfade instead of sliding.' },
    { name: '.carousel-fill', type: 'class', desc: 'Slides use aspect-ratio var(--ratio, 16/9).' },
    { name: '.carousel-dots-inside / .carousel-arrows-hover / .carousel-cards', type: 'class', desc: 'Dots over the image, arrows only on hover/focus, card slides without clipping.' },
    { name: '.carousel-caption', type: 'class', desc: 'Gradient caption overlay that slides in on the active slide.' },
    { name: '.carousel-play', type: 'class', desc: 'Optional button that pauses/resumes autoplay (aria-pressed is managed).' },
    { name: 'data-loop', type: 'attr', default: 'false', desc: 'Infinite loop using clones (seamless in both directions).' },
    { name: 'data-autoplay', type: 'attr', default: '0', desc: 'Milliseconds per slide. Pauses on hover, focus, drag, offscreen and hidden tab; disabled with reduced motion.' },
    { name: 'data-start-index / data-drag / data-dots / data-pause-on-hover', type: 'attr', default: '0 / true / true / true', desc: 'Initial slide, pointer dragging, dot generation, hover pausing.' },
    { name: '--per-view / --gap', type: 'var', default: '1 / 1rem', desc: 'Slides per view (fractions allowed, change in media queries) and spacing.' },
    { name: '--duration / --ease-carousel / --peek / --ratio / --carousel-radius', type: 'var', default: '520ms', desc: 'Slide timing, easing, peek width (72%), slide ratio, corner radius.' },
    { name: 'el.ranjCarousel', type: 'js', desc: '{ next(), prev(), goTo(i), index, count, play(), pause() }' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { index, previous, count, user }' }
  ]
});
})();
