RanjDocs.add({
  id: 'liquid-glass-toggle',
  name: 'Liquid Glass Toggle',
  group: 'Micro-interactions',
  description: 'A switch whose knob turns into a magnifying glass lens while you press it, refracting the track beneath.',
  tags: ['new', 'fx', 'js'],
  keywords: ['ios 26', 'glass switch', 'liquid glass', 'lens', 'switch'],
  demos: [
    { title: 'Press and hold', description: 'Hold the pointer down on a switch to see the lens.', html: `<button class="lg-toggle" aria-label="Wi-Fi"></button>
<button class="lg-toggle" aria-checked="true" aria-label="Bluetooth"></button>
<button class="lg-toggle lg-toggle-lg" aria-checked="true" style="--on:var(--primary)" aria-label="Focus mode"></button>` },
    { title: 'Over a wallpaper', description: '<code>.lg-toggle-glass</code> frosts the track so it works on photos and gradients.', pad: false, center: false, height: 320, html: `
<div class="demo-lgt-wall">
  <div class="demo-lgt-panel">
    <div class="demo-lgt-row"><span>Airplane mode</span><button class="lg-toggle lg-toggle-glass" style="--on:#f59e0b" aria-label="Airplane mode"></button></div>
    <div class="demo-lgt-row"><span>Wi-Fi</span><button class="lg-toggle lg-toggle-glass" aria-checked="true" aria-label="Wi-Fi"></button></div>
    <div class="demo-lgt-row"><span>Do not disturb</span><button class="lg-toggle lg-toggle-glass" style="--on:#8b5cf6" aria-checked="true" aria-label="Do not disturb"></button></div>
  </div>
</div>`, css: `
.demo-lgt-wall { min-height: 320px; display: grid; place-items: center; padding: 2rem 1rem; background: radial-gradient(40% 60% at 20% 30%, #f97316, transparent 70%), radial-gradient(40% 60% at 80% 70%, #6366f1, transparent 70%), radial-gradient(30% 40% at 60% 20%, #ec4899, transparent 70%), linear-gradient(135deg, #0ea5e9, #1e1b4b); }
.demo-lgt-panel { width: min(320px, 100%); padding: .5rem; border-radius: 22px; background: rgb(255 255 255 / .16); -webkit-backdrop-filter: blur(20px) saturate(1.6); backdrop-filter: blur(20px) saturate(1.6); box-shadow: inset 0 1px 1px rgb(255 255 255 / .5), 0 20px 40px rgb(0 0 0 / .25); color: #fff; }
.demo-lgt-row { display: flex; align-items: center; justify-content: space-between; padding: .7rem .8rem; font-weight: 600; font-size: .92rem; }
.demo-lgt-row + .demo-lgt-row { border-top: 1px solid rgb(255 255 255 / .15); }` }
  ],
  api: [
    { name: '.lg-toggle', type: 'class', desc: 'Empty <code>&lt;button&gt;</code>; knob injected by ranj.js.' },
    { name: '.lg-toggle-glass', type: 'class', desc: 'Frosted track for use over imagery.' },
    { name: '.lg-toggle-lg', type: 'class', desc: 'Larger size. Or set <code>--w</code> / <code>--h</code>.' },
    { name: '--on', type: 'var', default: '--success', desc: 'Track color when on.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { checked }' }
  ]
});
