RanjDocs.add({
  id: 'number-input',
  name: 'Number input',
  group: 'Forms',
  description: 'A number field with − / + steppers that repeat and accelerate while held, min/max/step clamping, ↑ ↓ (Shift ×10) and PageUp/PageDown keys, optional mouse-wheel, and locale-aware formatting.',
  tags: ['new', 'js'],
  keywords: ['stepper', 'spinbutton', 'quantity', 'counter', 'numeric input', 'currency input'],
  demos: [
    {
      title: 'Default',
      description: 'Press and hold a button to repeat.',
      html: `
<div class="form-grid" style="width:30rem;max-width:100%">
  <div class="field"><label class="label">Guests</label><div class="number-input"><input type="number" min="1" max="12" value="2" name="guests"></div><p class="field-hint">Up to 12 per booking.</p></div>
  <div class="field"><label class="label">Weight (kg)</label><div class="number-input number-input-stacked" data-wheel><input type="number" min="0" step="0.5" value="72.5"></div><p class="field-hint">Scroll the wheel while focused.</p></div>
</div>`
    },
    {
      title: 'Formatting',
      html: `
<div class="form-grid" style="width:30rem;max-width:100%">
  <div class="field"><label class="label">Price</label><div class="number-input number-input-stacked" data-format="currency:USD" data-decimals="2"><input type="number" min="0" step="0.5" value="1249"></div></div>
  <div class="field"><label class="label">Discount</label><div class="number-input" data-format="percent"><input type="number" min="0" max="100" step="5" value="15"></div></div>
  <div class="field"><label class="label">Monthly visitors</label><div class="number-input" ><input type="number" min="0" step="1000" value="125000"></div></div>
  <div class="field"><label class="label">Temperature</label><div class="number-input" data-suffix=" °C"><input type="number" min="-20" max="40" value="21"></div></div>
</div>`
    },
    {
      title: 'Cart quantity',
      html: `
<div class="demo-num-item">
  <div class="demo-num-img">🎧</div>
  <div><b>Studio headphones</b><small>Midnight · $189</small></div>
  <div class="number-input number-input-pill number-input-sm"><input type="number" min="0" max="9" value="1" aria-label="Quantity"></div>
  <b class="demo-num-total">$189</b>
</div>`,
      js: `
const n = root.querySelector('.number-input'), t = root.querySelector('.demo-num-total');
n.addEventListener('ranj:change', e => t.textContent = '$' + (e.detail.value * 189).toLocaleString());`,
      css: `
.demo-num-item { display: flex; align-items: center; gap: .9rem; width: 28rem; max-width: 100%; padding: .75rem; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); box-shadow: var(--shadow-xs); flex-wrap: wrap; }
.demo-num-img { width: 3rem; height: 3rem; display: grid; place-items: center; font-size: 1.5rem; border-radius: var(--radius-lg); background: var(--muted); }
.demo-num-item > div:nth-child(2) { flex: 1; display: flex; flex-direction: column; font-size: .9rem; min-width: 8rem; }
.demo-num-item small { color: var(--muted-fg); font-size: .78rem; }
.demo-num-total { min-width: 3.5rem; text-align: right; font-variant-numeric: tabular-nums; }`
    }
  ],
  api: [
    { name: '.number-input', type: 'class', desc: 'Wrap an <code>&lt;input type="number"&gt;</code> with <code>min</code>, <code>max</code>, <code>step</code>, <code>value</code>, <code>name</code>. Steppers are added; the value posts via a hidden input.' },
    { name: '.number-input-stacked / -pill / -sm / -lg / -inline', type: 'class', desc: 'Chevrons on the right, round cart style, sizes, auto width.' },
    { name: 'data-format', type: 'attr', desc: '<code>currency:EUR</code>, <code>percent</code>, or <code>plain</code> (no grouping).' },
    { name: 'data-decimals / data-prefix / data-suffix / data-locale', type: 'attr', desc: 'Formatting details.' },
    { name: 'data-wheel', type: 'attr', desc: 'Mouse wheel steps the value while focused.' },
    { name: 'Ranj.instance(el, "number-input")', type: 'js', desc: '<code>{ value, stepUp(), stepDown() }</code>' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value }</code> (number or <code>null</code>)' }
  ]
});
