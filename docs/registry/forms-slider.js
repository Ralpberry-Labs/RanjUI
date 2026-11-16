(function () {
  var vol0 = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/></svg>';
  var vol2 = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';
  RanjDocs.add({
    id: 'slider',
    name: 'Slider',
    group: 'Forms',
    description: 'A native <code>&lt;input type="range"&gt;</code> with a filled track, a springy thumb, an optional value bubble, tick marks with labels, formatting and a vertical layout. It stays a real range input, so keyboard, forms and screen readers just work.',
    tags: ['js'],
    keywords: ['range', 'range input', 'volume', 'value bubble', 'ticks', 'marks', 'vertical slider'],
    demos: [
      {
        title: 'Default',
        html: `
<div style="width:22rem;max-width:100%;display:grid;gap:1.75rem">
  <div class="slider"><input type="range" min="0" max="100" value="40" aria-label="Opacity"></div>
  <div class="demo-slider-vol">${vol0}<div class="slider slider-sm"><input type="range" min="0" max="100" value="72" aria-label="Volume"></div>${vol2}</div>
</div>`,
        css: `.demo-slider-vol { display: flex; align-items: center; gap: .75rem; color: var(--muted-fg); } .demo-slider-vol svg { flex-shrink: 0; }`
      },
      {
        title: 'Value bubble & output',
        description: '<code>data-bubble</code> shows the value while hovering or dragging (<code>="always"</code> to pin it). Any <code>[data-slider-output]</code> in the same field mirrors the formatted value.',
        html: `
<div style="width:24rem;max-width:100%;display:grid;gap:2.25rem">
  <div class="field">
    <div class="slider-head"><label class="label">Monthly budget</label><output class="slider-output" data-slider-output></output></div>
    <div class="slider" data-bubble data-format="currency:USD"><input type="range" min="0" max="5000" step="50" value="1250"></div>
  </div>
  <div class="field">
    <div class="slider-head"><label class="label">Team size</label><output class="slider-output" data-slider-output></output></div>
    <div class="slider slider-gradient" data-bubble="always" data-suffix=" seats"><input type="range" min="1" max="50" value="12"></div>
  </div>
</div>`
      },
      {
        title: 'Marks & step labels',
        description: '<code>data-marks</code> draws ticks at each step (or at the values you list). <code>data-labels</code> names each step.',
        html: `
<div style="width:26rem;max-width:100%;display:grid;gap:1.75rem">
  <div class="slider" data-marks data-suffix="%"><input type="range" min="0" max="100" step="25" value="50" aria-label="Zoom"></div>
  <div class="field">
    <label class="label">How likely are you to recommend us?</label>
    <div class="slider slider-lg" data-marks data-bubble data-labels="Not at all|Unlikely|Maybe|Likely|Absolutely"><input type="range" min="1" max="5" value="4"></div>
  </div>
  <div class="slider slider-success" data-marks="0:XS,25:S,50:M,75:L,100:XL"><input type="range" min="0" max="100" step="25" value="75" aria-label="T-shirt size"></div>
</div>`
      },
      {
        title: 'Vertical equalizer',
        html: `
<div class="demo-slider-eq">
  <div class="slider slider-vertical slider-sm" data-bubble style="--length:9rem"><input type="range" min="-12" max="12" value="4" aria-label="60 Hz"></div>
  <div class="slider slider-vertical slider-sm" data-bubble style="--length:9rem"><input type="range" min="-12" max="12" value="7" aria-label="230 Hz"></div>
  <div class="slider slider-vertical slider-sm" data-bubble style="--length:9rem"><input type="range" min="-12" max="12" value="2" aria-label="910 Hz"></div>
  <div class="slider slider-vertical slider-sm" data-bubble style="--length:9rem"><input type="range" min="-12" max="12" value="-3" aria-label="3.6 kHz"></div>
  <div class="slider slider-vertical slider-sm" data-bubble style="--length:9rem"><input type="range" min="-12" max="12" value="5" aria-label="14 kHz"></div>
</div>`,
        css: `.demo-slider-eq { display: flex; gap: 1.5rem; padding: 1.5rem 1.75rem; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); }`
      },
      {
        title: 'Disabled',
        html: `<div class="slider" style="width:20rem;max-width:100%"><input type="range" value="30" disabled aria-label="Disabled"></div>`
      }
    ],
    api: [
      { name: '.slider', type: 'class', desc: 'Wrap an <code>&lt;input type="range"&gt;</code> (v1 markup).' },
      { name: '.slider-sm / .slider-lg', type: 'class', desc: 'Sizes.' },
      { name: '.slider-success / -warning / -destructive / -gradient', type: 'class', desc: 'Fill colors (or set <code>--fill-color</code>).' },
      { name: '.slider-vertical', type: 'class', desc: 'Vertical; set the height with <code>--length</code>.' },
      { name: 'data-bubble', type: 'attr', desc: 'Value bubble on hover/drag; <code>"always"</code> keeps it visible.' },
      { name: 'data-marks', type: 'attr', desc: 'Empty = one tick per step; or <code>"0,50,100"</code>; or <code>"0:Low,100:High"</code> with labels. <code>data-ticks-only</code> hides labels.' },
      { name: 'data-format', type: 'attr', desc: '<code>currency:EUR</code>, <code>percent</code> or <code>compact</code> (Intl).' },
      { name: 'data-prefix / data-suffix / data-labels', type: 'attr', desc: 'Text around the value, or a <code>|</code>-separated name per step. Also sets <code>aria-valuetext</code>.' },
      { name: '[data-slider-output]', type: 'attr', desc: 'Any element in the same field that should show the formatted value.' },
      { name: '--thumb / --track / --fill-color / --track-color', type: 'var', default: '1.125rem / .375rem', desc: 'Geometry and colors.' },
      { name: 'ranj:input / ranj:change', type: 'event', desc: 'detail: <code>{ value }</code> — while dragging / on release.' }
    ]
  });
})();
