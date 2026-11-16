RanjDocs.add({
  id: 'day-night-toggle',
  name: 'Day / Night Toggle',
  group: 'Micro-interactions',
  description: 'A theme switch where the sun rolls across, turns into a cratered moon, clouds sink away and stars twinkle in.',
  tags: ['new', 'fx', 'js'],
  keywords: ['theme toggle', 'dark mode switch', 'sun moon', 'light dark'],
  demos: [
    { title: 'Default', html: `<button class="daynight" aria-label="Dark mode"></button>
<button class="daynight" aria-checked="true" aria-label="Dark mode"></button>` },
    { title: 'Sizes', html: `<button class="daynight daynight-sm" aria-label="Dark mode"></button>
<button class="daynight" aria-label="Dark mode"></button>
<button class="daynight daynight-lg" aria-label="Dark mode"></button>` },
    { title: 'Controls the site theme', description: '<code>data-theme-toggle</code> wires it to <code>Ranj.theme</code>. Try it, the docs switch too.', height: 240, html: `
<div style="width:min(360px,100%);flex-direction:row;padding:1.1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <div><div style="font-weight:600">Appearance</div><div style="font-size:.85rem;color:var(--muted-fg)">Switch between light and dark</div></div>
  <button class="daynight" data-theme-toggle aria-label="Dark mode"></button>
</div>` }
  ],
  api: [
    { name: '.daynight', type: 'class', desc: 'Put on an empty <code>&lt;button&gt;</code>; ranj.js injects the sky, clouds, stars and knob.' },
    { name: '.daynight-sm / .daynight-lg', type: 'class', desc: 'Sizes. Or set <code>--h</code>.' },
    { name: 'aria-checked', type: 'attr', default: 'false', desc: '<code>true</code> = night.' },
    { name: 'data-theme-toggle', type: 'attr', desc: 'Sync with and set the document theme.' },
    { name: '--day-a / --day-b / --night-a / --night-b / --sun / --moon', type: 'var', desc: 'Palette.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { checked }' }
  ]
});
