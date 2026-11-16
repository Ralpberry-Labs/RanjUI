(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'aspect-ratio',
    name: 'Aspect ratio',
    group: 'Layout',
    description: 'Lock media to a ratio. Images, video, iframes and canvas inside <code>.aspect</code> fill and crop automatically.',
    keywords: ['ratio', '16:9', 'video', 'embed', 'responsive media'],
    demos: [
      {
        title: 'Ratios',
        center: false,
        html: `<div class="grid grid-auto" style="--min:150px;align-items:end">
  <figure class="figure"><div class="aspect aspect-square rounded-lg">${RB.art(0, 'aspect-fill')}</div><figcaption>aspect-square · 1:1</figcaption></figure>
  <figure class="figure"><div class="aspect aspect-photo rounded-lg">${RB.art(1, 'aspect-fill')}</div><figcaption>aspect-photo · 4:3</figcaption></figure>
  <figure class="figure"><div class="aspect aspect-video rounded-lg">${RB.art(2, 'aspect-fill')}</div><figcaption>aspect-video · 16:9</figcaption></figure>
  <figure class="figure"><div class="aspect aspect-portrait rounded-lg">${RB.art(3, 'aspect-fill')}</div><figcaption>aspect-portrait · 3:4</figcaption></figure>
</div>`
      },
      {
        title: 'Video embed',
        description: 'Use a custom ratio with <code>--ratio</code>. Here: a 16:9 player with a play overlay.',
        html: `<div class="aspect img-frame demo-aspect-video" style="--ratio:16/9;width:min(100%,36rem)">
  ${RB.art(4, 'aspect-fill')}
  <button class="demo-aspect-play" aria-label="Play video">${I('play')}</button>
  <span class="badge badge-contrast" style="position:absolute;right:.75rem;bottom:.75rem">12:48</span>
</div>`,
        css: `.demo-aspect-play { position: absolute; inset: 0; margin: auto; width: 4rem; height: 4rem; border-radius: 50%; display: grid; place-items: center; color: #fff; background: rgb(255 255 255 / .18); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgb(255 255 255 / .35); transition: transform var(--dur) var(--ease-spring), background var(--transition); z-index: 1; }
.demo-aspect-play:hover { transform: scale(1.08); background: rgb(255 255 255 / .28); }
.demo-aspect-play svg { width: 1.4rem; height: 1.4rem; margin-left: 3px; fill: currentColor; }`
      }
    ],
    api: [
      { name: '.aspect', type: 'class', desc: 'Ratio box using <code>--ratio</code> (16 / 9). Media children fill it.' },
      { name: '.aspect-square', type: 'class', desc: 'Preset ratios (also usable on images directly). Also: <code>.aspect-video</code> <code>.aspect-photo</code> <code>.aspect-3-2</code> <code>.aspect-21-9</code> <code>.aspect-portrait</code> <code>.aspect-story</code> <code>.aspect-golden</code>' },
      { name: '.aspect-fill', type: 'class', desc: 'Make any child (div, svg) fill the ratio box.' },
      { name: '--ratio', type: 'var', default: '16 / 9', desc: 'Custom ratio.' }
    ]
  });
})();
