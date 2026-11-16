RanjDocs.add({
  id: 'range-slider',
  name: 'Range slider',
  group: 'Forms',
  description: 'A custom two-thumb slider for picking a range. Each thumb is a keyboard-accessible <code>role="slider"</code>, clicking the track moves the nearest thumb, and values post through hidden inputs.',
  tags: ['new', 'js'],
  keywords: ['dual slider', 'price range', 'min max', 'two thumbs', 'histogram'],
  demos: [
    {
      title: 'Price filter with histogram',
      description: 'Drag either thumb, click the track, or use ← → (Shift for bigger steps), PageUp/PageDown, Home/End.',
      html: `
<div class="demo-range-card">
  <div class="slider-head"><span class="label">Price range</span><output class="slider-output" data-slider-output></output></div>
  <div class="range-slider" data-min="0" data-max="1000" data-step="10" data-value="180,640" data-min-gap="50" data-name="price" data-bubble data-format="currency:USD" aria-label="Price"
    data-histogram="2,4,6,9,14,18,22,26,24,30,28,22,19,16,15,12,10,8,7,5,4,3,3,2"></div>
  <div class="demo-range-inputs"><span>Min <b data-out="min">$180</b></span><span>Max <b data-out="max">$640</b></span></div>
</div>`,
      js: `
const rs = root.querySelector('.range-slider'), f = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
rs.addEventListener('ranj:input', e => { root.querySelector('[data-out=min]').textContent = f.format(e.detail.value[0]); root.querySelector('[data-out=max]').textContent = f.format(e.detail.value[1]); });`,
      css: `
.demo-range-card { width: 26rem; max-width: 100%; padding: 1.25rem 1.25rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); box-shadow: var(--shadow-sm); }
.demo-range-card .slider-head { margin-bottom: 1rem; }
.demo-range-inputs { display: flex; justify-content: space-between; margin-top: .75rem; font-size: .8rem; color: var(--muted-fg); }
.demo-range-inputs b { color: var(--fg); font-weight: 600; margin-left: .25rem; font-variant-numeric: tabular-nums; }`
    },
    {
      title: 'Marks and single thumb',
      description: 'Give <code>data-value</code> one number for a single custom thumb.',
      html: `
<div style="width:26rem;max-width:100%;display:grid;gap:2.25rem">
  <div class="field">
    <div class="slider-head"><span class="label">Working hours</span><output class="slider-output" data-slider-output></output></div>
    <div class="range-slider" data-min="0" data-max="24" data-value="9,17" data-marks="0:12a,6:6a,12:12p,18:6p,24:12a" data-suffix=":00" aria-label="Working hours"></div>
  </div>
  <div class="field">
    <div class="slider-head"><span class="label">Discount</span><output class="slider-output" data-slider-output></output></div>
    <div class="range-slider slider-success" data-min="0" data-max="50" data-step="5" data-value="15" data-marks data-ticks-only data-bubble data-suffix="%" data-name="discount" aria-label="Discount"></div>
  </div>
</div>`
    }
  ],
  api: [
    { name: '.range-slider', type: 'class', desc: 'Custom slider. Reuses <code>.slider-sm/-lg</code> and color classes.' },
    { name: 'data-min / data-max / data-step', type: 'attr', default: '0 / 100 / 1', desc: 'Bounds and step.' },
    { name: 'data-value', type: 'attr', default: '25,75', desc: 'Two numbers for a range, one for a single thumb.' },
    { name: 'data-min-gap', type: 'attr', default: '0', desc: 'Minimum distance between thumbs.' },
    { name: 'data-name / data-name-min / data-name-max', type: 'attr', desc: 'Hidden inputs (<code>name[min]</code>, <code>name[max]</code> by default).' },
    { name: 'data-bubble, data-marks, data-format, data-prefix, data-suffix', type: 'attr', desc: 'Same as Slider.' },
    { name: 'data-histogram', type: 'attr', desc: 'Comma-separated bar heights drawn above the track, highlighted inside the range.' },
    { name: 'data-label-min / data-label-max', type: 'attr', default: 'Minimum / Maximum', desc: 'Accessible names of the thumbs.' },
    { name: 'Ranj.instance(el, "range-slider")', type: 'js', desc: '<code>{ value }</code> — get/set <code>[min, max]</code>.' },
    { name: 'ranj:input / ranj:change', type: 'event', desc: 'detail: <code>{ value: [min, max] }</code> (or a number for one thumb).' }
  ]
});
