RanjDocs.add({
  id: 'reveal',
  name: 'Reveal',
  group: 'Motion',
  description: 'Fade, slide, zoom, blur or flip anything into view as it scrolls in. Stagger a container’s children with one attribute, play once or every time.',
  tags: ['new', 'fx', 'js'],
  keywords: ['scroll animation', 'aos', 'animate on scroll', 'entrance', 'fade in', 'stagger', 'in view'],
  demos: [
    {
      title: 'Variants',
      description: 'Scroll inside the panel. These use <code>data-reveal-once="false"</code> so they replay every time.',
      pad: false, center: false,
      html: `
<div class="demo-reveal-scroll">
  <p class="demo-reveal-hint">Scroll ↓</p>
  <div class="demo-reveal-grid">
    <div class="demo-reveal-tile" data-reveal="fade-up" data-reveal-once="false">fade-up</div>
    <div class="demo-reveal-tile" data-reveal="fade-down" data-reveal-once="false">fade-down</div>
    <div class="demo-reveal-tile" data-reveal="fade-left" data-reveal-once="false">fade-left</div>
    <div class="demo-reveal-tile" data-reveal="fade-right" data-reveal-once="false">fade-right</div>
    <div class="demo-reveal-tile" data-reveal="zoom" data-reveal-once="false">zoom</div>
    <div class="demo-reveal-tile" data-reveal="blur" data-reveal-once="false">blur</div>
    <div class="demo-reveal-tile" data-reveal="flip" data-reveal-once="false">flip</div>
    <div class="demo-reveal-tile" data-reveal="fade" data-reveal-once="false">fade</div>
  </div>
  <div class="demo-reveal-pad"></div>
</div>`,
      css: `.demo-reveal-scroll { height: 360px; overflow-y: auto; padding: 0 1.5rem; }
.demo-reveal-hint { height: 260px; display: grid; place-items: center; color: var(--muted-fg); font-size: .875rem; }
.demo-reveal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; max-width: 760px; margin: 0 auto; }
.demo-reveal-tile { height: 110px; display: grid; place-items: center; border-radius: var(--radius-lg); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-sm); font-family: var(--font-mono); font-size: .8rem; color: var(--muted-fg); }
.demo-reveal-pad { height: 200px; }`
    },
    {
      title: 'Staggered features',
      description: 'Put <code>data-reveal-stagger</code> on a parent and its children animate in one after another.',
      height: 340,
      html: `
<div class="demo-reveal-features" data-reveal="fade-up" data-reveal-stagger="110">
  <div><span>⚡</span><h4>Instant</h4><p>Under 30 KB gzipped, no runtime framework.</p></div>
  <div><span>♿</span><h4>Accessible</h4><p>Keyboard, focus and ARIA handled for you.</p></div>
  <div><span>🎨</span><h4>Themeable</h4><p>One hue variable re-tints every component.</p></div>
  <div><span>🌗</span><h4>Dark mode</h4><p>Every token has a tuned dark counterpart.</p></div>
</div>`,
      css: `.demo-reveal-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; width: 100%; max-width: 900px; }
.demo-reveal-features > div { padding: 1.25rem; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
.demo-reveal-features span { font-size: 1.5rem; } .demo-reveal-features h4 { margin: .5rem 0 .25rem; } .demo-reveal-features p { color: var(--muted-fg); font-size: .875rem; }`
    },
    {
      title: 'Timing knobs',
      height: 220,
      html: `
<div class="demo-reveal-row">
  <div class="demo-reveal-chip" data-reveal="zoom">0ms</div>
  <div class="demo-reveal-chip" data-reveal="zoom" data-reveal-delay="300">300ms</div>
  <div class="demo-reveal-chip" data-reveal="zoom" data-reveal-delay="600" data-reveal-duration="1400">600ms, slow</div>
  <div class="demo-reveal-chip" data-reveal="fade-up" data-reveal-delay="900" data-reveal-distance="80px">900ms, far</div>
</div>`,
      css: `.demo-reveal-row { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; }
.demo-reveal-chip { padding: .75rem 1.1rem; border-radius: 99px; background: var(--primary-soft); color: var(--primary-soft-fg); font-weight: 600; font-size: .875rem; }`
    }
  ],
  api: [
    { name: 'data-reveal', type: 'attr', default: 'fade-up', desc: 'fade-up, fade-down, fade-left, fade-right, fade, zoom, blur, flip.' },
    { name: 'data-reveal-stagger', type: 'attr', default: '90', desc: 'Animate the children instead of the element, offset by this many ms.' },
    { name: 'data-reveal-delay / data-reveal-duration', type: 'attr', default: '0 / 800', desc: 'Milliseconds.' },
    { name: 'data-reveal-distance', type: 'attr', default: '28px', desc: 'Travel distance for fade-* variants.' },
    { name: 'data-reveal-once', type: 'attr', default: 'true', desc: '<code>false</code> hides again on leave and replays on re-entry.' },
    { name: 'data-reveal-threshold', type: 'attr', default: '0.15', desc: 'Visible fraction that triggers it.' },
    { name: '--reveal-ease', type: 'var', default: 'var(--ease-out)', desc: 'Timing function.' },
    { name: 'ranj:reveal', type: 'event', desc: 'Fires after the element has revealed.' }
  ],
  notes: '<p>Content is only hidden once ranj.js mounts, so pages stay readable without JavaScript. With reduced motion nothing is hidden.</p>'
});
