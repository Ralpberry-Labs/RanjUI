RanjDocs.add({
  id: 'morph-icons',
  name: 'Morph Icons',
  group: 'Micro-interactions',
  description: 'Icons that morph between two states: play and pause, plus and close, chevron, search and close, volume and mute, and a three-step weather icon.',
  tags: ['new', 'fx', 'js'],
  keywords: ['morph', 'play pause', 'icon animation', 'weather icon', 'toggle icon'],
  demos: [
    { title: 'Toggle icons', description: 'Click to morph.', html: `
<button class="morph-icon morph-icon-solid" data-morph="play-pause"></button>
<button class="morph-icon" data-morph="plus-close"></button>
<button class="morph-icon" data-morph="chevron"></button>
<button class="morph-icon" data-morph="search-close"></button>
<button class="morph-icon" data-morph="volume"></button>` },
    { title: 'Weather: sun, cloud, rain', description: 'Click to cycle through the three states.', html: `
<button class="morph-icon" data-morph="weather" style="--size:44px"></button>
<button class="morph-icon" data-morph="weather" data-state="cloud" style="--size:44px"></button>
<button class="morph-icon" data-morph="weather" data-state="rain" style="--size:44px"></button>` },
    { title: 'Mini player', height: 200, html: `
<div style="width:min(380px,100%);display:flex;align-items:center;gap:.9rem;padding:.75rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <div style="width:52px;height:52px;flex:none;border-radius:var(--radius-lg);background:linear-gradient(135deg,#f472b6,#6366f1)"></div>
  <div style="flex:1;min-width:0"><b style="display:block;font-size:.92rem">Midnight Drive</b><small style="color:var(--muted-fg)">Kavinsky Echoes · 3:42</small></div>
  <button class="morph-icon" data-morph="volume" style="--size:18px;background:transparent"></button>
  <button class="morph-icon morph-icon-solid" data-morph="play-pause" aria-pressed="true" style="--size:18px"></button>
</div>` }
  ],
  api: [
    { name: '.morph-icon', type: 'class', desc: 'Button; inner shapes injected from <code>data-morph</code>.' },
    { name: 'data-morph', type: 'attr', default: 'play-pause', desc: '<code>play-pause plus-close chevron search-close volume weather</code>.' },
    { name: 'aria-pressed', type: 'attr', desc: 'Second state for two-state icons. <code>aria-label</code> updates automatically.' },
    { name: 'data-state', type: 'attr', default: 'sun', desc: 'Weather state: <code>sun cloud rain</code>.' },
    { name: '.morph-icon-solid', type: 'class', desc: 'Filled accent background.' },
    { name: '--size / --speed', type: 'var', default: '22px / .45s', desc: 'Icon size and morph duration.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { pressed } or { state }' }
  ]
});
