RanjDocs.add({
  id: 'color-picker',
  name: 'Color picker',
  group: 'Forms',
  description: 'Pick a color from swatches, a saturation/brightness area and a hue rail, or type a hex value — in a popover or inline. Fully keyboard-driven, with the native EyeDropper where supported.',
  tags: ['new', 'js'],
  keywords: ['colour', 'hex', 'hsv', 'swatches', 'eyedropper', 'brand color', 'theme'],
  demos: [
    {
      title: 'Popover',
      description: 'The panel retints the page accent live — try it.',
      height: 140,
      html: `
<div class="field" style="margin:0">
  <label class="label">Brand color</label>
  <div class="color-picker" data-value="#6366f1" data-name="brand"></div>
</div>
<div class="demo-color-preview"><button class="btn btn-primary btn-sm">Primary button</button><span class="demo-color-chip">Badge</span></div>`,
      js: `
const cp = root.querySelector('.color-picker'), prev = root.querySelector('.demo-color-preview');
const apply = hex => { prev.style.setProperty('--primary', hex); prev.style.setProperty('--primary-hover', hex); prev.style.setProperty('--demo-c', hex); };
cp.addEventListener('ranj:input', e => apply(e.detail.value));
apply('#6366f1');`,
      css: `.demo-color-preview { display: flex; gap: .6rem; align-items: center; } .demo-color-chip { padding: .2rem .6rem; border-radius: 99px; font-size: .75rem; font-weight: 600; color: var(--demo-c); background: color-mix(in oklab, var(--demo-c) 14%, transparent); }`
    },
    {
      title: 'Inline',
      html: `<div class="color-picker" data-inline data-value="#10b981" data-swatches="#f43f5e,#f97316,#eab308,#22c55e,#10b981,#14b8a6,#0ea5e9,#6366f1,#a855f7,#ec4899,#78716c,#18181b"></div>`
    },
    {
      title: 'Swatches only',
      description: 'For a short fixed palette, plain radios are enough: <code>.swatch-picker</code>.',
      html: `
<div class="swatch-picker" role="radiogroup" aria-label="Label color">
  <label><input type="radio" name="swatch-demo" value="slate" aria-label="Slate"><span style="--c:#64748b"></span></label>
  <label><input type="radio" name="swatch-demo" value="red" aria-label="Red"><span style="--c:#ef4444"></span></label>
  <label><input type="radio" name="swatch-demo" value="amber" aria-label="Amber" checked><span style="--c:#f59e0b"></span></label>
  <label><input type="radio" name="swatch-demo" value="green" aria-label="Green"><span style="--c:#22c55e"></span></label>
  <label><input type="radio" name="swatch-demo" value="blue" aria-label="Blue"><span style="--c:#3b82f6"></span></label>
  <label><input type="radio" name="swatch-demo" value="violet" aria-label="Violet"><span style="--c:#8b5cf6"></span></label>
  <label><input type="radio" name="swatch-demo" value="pink" aria-label="Pink"><span style="--c:#ec4899"></span></label>
</div>`
    }
  ],
  api: [
    { name: '.color-picker', type: 'class', desc: 'Trigger button + popover (or inline panel).' },
    { name: 'data-value', type: 'attr', default: '#6366f1', desc: 'Initial hex.' },
    { name: 'data-name', type: 'attr', desc: 'Hidden input with the hex value.' },
    { name: 'data-swatches', type: 'attr', desc: 'Comma-separated hex list; empty string hides swatches.' },
    { name: 'data-inline', type: 'attr', desc: 'Render the panel in place instead of a popover.' },
    { name: 'data-label', type: 'attr', default: 'Color', desc: 'Accessible name used in labels.' },
    { name: '.swatch-picker', type: 'class', desc: 'CSS-only radio swatches (<code>--c</code> on each span).' },
    { name: 'Keyboard', type: 'attr', desc: 'Area: ← → saturation, ↑ ↓ brightness (Shift ×10). Hue: ← → (Shift ×15), Home/End.' },
    { name: 'Ranj.color', type: 'js', desc: '<code>hexToRgb, rgbToHex, rgbToHsv, hsvToRgb</code> helpers.' },
    { name: 'ranj:input / ranj:change', type: 'event', desc: 'detail: <code>{ value: "#10b981", rgb, hsv }</code> — live while dragging / settled.' }
  ]
});
