(function () {
var u = function (id, extra) { return 'https://images.unsplash.com/' + id + '?w=1400&q=70&auto=format&fit=crop' + (extra || ''); };
RanjDocs.add({
  id: 'image-compare',
  name: 'Image Compare',
  group: 'Data Display',
  description: 'Before/after slider. Drag anywhere (the divider glides to where you press), hover-to-compare, or use the keyboard on the handle. Works horizontally or vertically with any two images or elements.',
  tags: ['new', 'js'],
  keywords: ['before after', 'comparison slider', 'juxtapose', 'reveal', 'diff'],
  demos: [
    {
      title: 'Photo edit',
      description: 'The second image is the “before” layer. <code>data-intro</code> plays a short hint when it scrolls into view.',
      center: false,
      html: `<div class="image-compare" data-intro style="aspect-ratio: 16 / 9; max-width: 820px; margin: auto" aria-label="Color grade comparison">
  <img src="${u('photo-1501785888041-af3ef285b470')}" alt="Edited photo of a mountain lake">
  <img src="${u('photo-1501785888041-af3ef285b470', '&sat=-100')}" alt="Original black and white photo" style="filter: grayscale(1) contrast(.9) brightness(1.05)">
  <span class="image-compare-label" data-side="before">Original</span>
  <span class="image-compare-label" data-side="after">Graded</span>
</div>`
    },
    {
      title: 'Hover and vertical',
      description: '<code>data-hover</code> follows the pointer without clicking. <code>.image-compare-vertical</code> splits top/bottom; <code>.image-compare-line</code> uses a slim pill handle.',
      center: false,
      html: `<div class="demo-ic-grid">
  <div class="image-compare" data-hover data-start="40" style="aspect-ratio: 4 / 3" aria-label="Day and night">
    <img src="${u('photo-1464822759023-fed622ff2c3b')}" alt="Mountains by day">
    <img src="${u('photo-1519681393784-d120267933ba')}" alt="Mountains at night">
    <span class="image-compare-label" data-side="before">Night</span>
    <span class="image-compare-label" data-side="after">Day</span>
  </div>
  <div class="image-compare image-compare-vertical image-compare-line" data-start="55" style="aspect-ratio: 4 / 3" aria-label="Season comparison">
    <img src="${u('photo-1470071459604-3b5ec3a7fe05')}" alt="Misty forest">
    <img src="${u('photo-1441974231531-c6227db76b6e')}" alt="Sunlit forest">
    <span class="image-compare-label" data-side="before">Sunny</span>
    <span class="image-compare-label" data-side="after">Foggy</span>
  </div>
</div>`,
      css: `.demo-ic-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; width: 100%; }`
    },
    {
      title: 'Any content: UI theme diff',
      description: 'Layers can be any element with <code>.image-compare-layer</code>; the second one is clipped.',
      center: false,
      html: `<div class="image-compare" data-start="50" style="max-width: 640px; margin: auto; border: 1px solid var(--border)" aria-label="Light and dark theme">
  <div class="image-compare-layer demo-ic-ui" data-theme="dark">
    <div class="demo-ic-card"><b>Revenue</b><strong>$48,290</strong><span>+12.4% vs. last month</span><i></i></div>
  </div>
  <div class="image-compare-layer image-compare-before demo-ic-ui" data-theme="light">
    <div class="demo-ic-card"><b>Revenue</b><strong>$48,290</strong><span>+12.4% vs. last month</span><i></i></div>
  </div>
  <span class="image-compare-label" data-side="before">Light</span>
  <span class="image-compare-label" data-side="after">Dark</span>
</div>`,
      css: `.demo-ic-ui { display: grid !important; place-items: center; padding: 3rem 1.5rem; background: var(--bg); color: var(--fg); min-height: 260px; }
.demo-ic-card { width: min(320px, 100%); padding: 1.25rem; border-radius: var(--radius-lg); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-lg); display: grid; gap: .25rem; }
.demo-ic-card b { font-size: .8rem; color: var(--muted-fg); font-weight: 500; }
.demo-ic-card strong { font-size: 1.8rem; letter-spacing: -.03em; }
.demo-ic-card span { font-size: .8rem; color: var(--success-soft-fg); }
.demo-ic-card i { height: 6px; border-radius: 9px; margin-top: .75rem; background: linear-gradient(90deg, var(--primary) 68%, var(--muted) 68%); }`
    }
  ],
  api: [
    { name: '.image-compare', type: 'class', desc: 'Container. First child is the "after" base layer; the second img (or .image-compare-before) is the clipped "before" layer.' },
    { name: '.image-compare-layer', type: 'class', desc: 'Use any element as a layer instead of an img.' },
    { name: '.image-compare-label[data-side="before|after"]', type: 'class', desc: 'Corner labels that fade when the divider reaches their edge.' },
    { name: '.image-compare-vertical / .image-compare-line', type: 'class', desc: 'Top/bottom split; slim pill handle.' },
    { name: 'data-start', type: 'attr', default: '50', desc: 'Initial divider position in percent.' },
    { name: 'data-hover', type: 'attr', default: 'false', desc: 'Follow the mouse without pressing.' },
    { name: 'data-intro', type: 'attr', default: 'false', desc: 'Wiggle hint when first scrolled into view (skipped with reduced motion).' },
    { name: 'data-step', type: 'attr', default: '5', desc: 'Arrow key step (Shift = 4×). Home/End jump to the edges.' },
    { name: '--pos / --handle / --line / --line-color', type: 'var', default: '50% / 2.5rem / 2px / #fff', desc: 'Divider position, knob size, line width and color.' },
    { name: 'el.ranjCompare', type: 'js', desc: '{ set(percent), value }' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { value } (0–100)' }
  ]
});
})();
