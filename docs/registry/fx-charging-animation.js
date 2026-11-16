RanjDocs.add({
  id: 'charging-animation',
  name: 'Charging Animation',
  group: 'Micro-interactions',
  description: 'Liquid fills a ring or battery with rolling waves and rising bubbles while the percentage counts up.',
  tags: ['new', 'fx', 'js'],
  keywords: ['battery', 'charging', 'liquid', 'wave fill', 'power', 'progress'],
  demos: [
    { title: 'Ring', height: 320, html: `
<div class="charging" data-level="76" data-charging>
  <div class="charging-ring"><div class="charging-tank"><div class="charging-wave"></div><div class="charging-wave"></div><div class="charging-bubbles"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
    <div class="charging-info"><b data-charging-text>0%</b><small>42 min to full</small></div></div>
</div>` },
    { title: 'Battery + controls', height: 340, html: `
<div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap;justify-content:center">
  <div class="charging" data-level="14" data-charging>
    <div class="charging-battery"><div class="charging-tank"><div class="charging-wave"></div><div class="charging-wave"></div><div class="charging-bubbles"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
      <div class="charging-info"><b data-charging-text>0%</b></div></div>
  </div>
  <div style="display:grid;gap:.5rem"><button class="btn btn-sm" data-demo-lvl="100">Charge to 100%</button><button class="btn btn-sm btn-outline" data-demo-lvl="14">Back to 14%</button><button class="btn btn-sm btn-ghost" data-demo-plug>Unplug</button></div>
</div>`, js: `
var c = root.querySelector('.charging');
root.querySelectorAll('[data-demo-lvl]').forEach(function (b) { b.onclick = function () { Ranj.charging(c, +b.getAttribute('data-demo-lvl')); }; });
root.querySelector('[data-demo-plug]').onclick = function () { var on = c.toggleAttribute('data-charging'); this.textContent = on ? 'Unplug' : 'Plug in'; };` }
  ],
  api: [
    { name: '.charging', type: 'class', desc: 'Wrapper around <code>.charging-ring</code> or <code>.charging-battery</code>, each with a <code>.charging-tank</code> of two <code>.charging-wave</code> and optional <code>.charging-bubbles</code>.' },
    { name: 'data-level', type: 'attr', default: '0', desc: 'Target level 0..100, animated in when visible.' },
    { name: 'data-charging', type: 'attr', desc: 'Shows the bolt and bubbles.' },
    { name: 'data-low-at', type: 'attr', default: '20', desc: 'At or below this level the liquid turns red.' },
    { name: '[data-charging-text]', type: 'attr', desc: 'Receives the counting percentage.' },
    { name: '--liq / --liq2', type: 'var', desc: 'Liquid colors.' },
    { name: 'Ranj.charging(el, level)', type: 'js', desc: 'Animate to a new level.' }
  ]
});
