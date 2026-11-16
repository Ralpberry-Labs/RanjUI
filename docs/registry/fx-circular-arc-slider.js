RanjDocs.add({
  id: 'circular-arc-slider',
  name: 'Circular Arc Slider',
  group: 'Micro-interactions',
  description: 'A 270 degree dial you drag around the arc, with a gradient value track, lit tick marks and a big readout.',
  tags: ['new', 'fx', 'js'],
  keywords: ['knob', 'dial', 'radial slider', 'thermostat', 'volume', 'circular range'],
  demos: [
    { title: 'Thermostat', description: 'Drag the thumb, click anywhere on the dial, or use the arrow keys.', height: 320, html: `
<div class="arc-slider" data-value="21.5" data-min="16" data-max="28" data-step="0.5" data-unit="°" data-label="Living room" style="--c1:#38bdf8;--c2:#f97316"></div>
<div style="display:grid;gap:.25rem;font-size:.9rem;min-width:140px"><small style="color:var(--muted-fg)">Target</small><b class="demo-arc-out" style="font-size:1.4rem">21.5°C</b><small style="color:var(--muted-fg)">Heating · Eco mode</small></div>`, js: `
var s = root.querySelector('.arc-slider'), out = root.querySelector('.demo-arc-out');
s.addEventListener('ranj:input', function (e) { out.textContent = e.detail.value.toFixed(1) + '°C'; });` },
    { title: 'Sizes', height: 260, html: `
<div class="arc-slider" data-value="64" data-unit="%" data-label="Volume" style="--size:170px"></div>
<div class="arc-slider" data-value="3200" data-min="0" data-max="6000" data-step="100" data-label="rpm" data-ticks="12" style="--size:130px;--stroke:10;--c1:#10b981;--c2:#a3e635"></div>` }
  ],
  api: [
    { name: '.arc-slider', type: 'class', desc: 'Empty element; SVG and readout injected. <code>role="slider"</code>, focusable.' },
    { name: 'data-value / data-min / data-max / data-step', type: 'attr', default: '50 / 0 / 100 / 1', desc: 'Range.' },
    { name: 'data-unit / data-label', type: 'attr', desc: 'Readout unit and caption.' },
    { name: 'data-ticks', type: 'attr', default: '24', desc: 'Number of tick marks.' },
    { name: '--size / --stroke / --c1 / --c2 / --track', type: 'var', desc: 'Size, track width and gradient colors.' },
    { name: 'Ranj.arcSlider(el, value)', type: 'js', desc: 'Set the value.' },
    { name: 'ranj:input / ranj:change', type: 'event', desc: 'detail: { value } while dragging / on release.' }
  ]
});
