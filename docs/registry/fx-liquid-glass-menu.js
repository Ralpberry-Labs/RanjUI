RanjDocs.add({
  id: 'liquid-glass-menu',
  name: 'Liquid Glass Menu',
  group: 'Micro-interactions',
  description: 'A frosted glass tab bar or menu with a refracting lens that springs to the selected item and stretches as it moves.',
  tags: ['new', 'fx', 'js'],
  keywords: ['glass', 'tab bar', 'ios 26', 'glassmorphism', 'bottom navigation', 'segmented'],
  demos: [
    { title: 'Tab bar', description: 'Click the tabs, or focus one and use the arrow keys.', pad: false, center: false, height: 340, html: `
<div class="demo-lgm-wall">
  <div class="demo-lgm-feed">
    <div class="demo-lgm-photo" style="--a:#f97316;--b:#db2777"></div>
    <div class="demo-lgm-photo" style="--a:#22d3ee;--b:#6366f1"></div>
    <div class="demo-lgm-photo" style="--a:#a3e635;--b:#059669"></div>
  </div>
  <nav class="lg-menu" aria-label="Main">
    <a class="lg-menu-item" href="#" aria-current="page"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>Home</a>
    <a class="lg-menu-item" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>Search</a>
    <a class="lg-menu-item" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>Library</a>
    <a class="lg-menu-item" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>Profile</a>
  </nav>
</div>`, css: `
.demo-lgm-wall { position: relative; min-height: 340px; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; padding: 1.25rem; background: var(--bg-subtle); }
.demo-lgm-feed { position: absolute; inset: 1rem 1rem 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; }
.demo-lgm-photo { border-radius: 18px; background: radial-gradient(60% 50% at 30% 30%, rgb(255 255 255 / .5), transparent 60%), linear-gradient(160deg, var(--a), var(--b)); }
.demo-lgm-wall .lg-menu { position: relative; z-index: 1; }` },
    { title: 'Vertical menu', pad: false, center: false, height: 340, html: `
<div class="demo-lgm-wall2">
  <nav class="lg-menu lg-menu-vertical" aria-label="Account">
    <button class="lg-menu-item" aria-selected="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>Profile</button>
    <button class="lg-menu-item" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>Billing</button>
    <button class="lg-menu-item" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>Notifications</button>
    <button class="lg-menu-item" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Security</button>
  </nav>
</div>`, css: `
.demo-lgm-wall2 { min-height: 340px; display: grid; place-items: center; padding: 1.5rem; background: radial-gradient(35% 50% at 25% 35%, #fb7185, transparent 70%), radial-gradient(40% 55% at 75% 65%, #60a5fa, transparent 70%), radial-gradient(30% 40% at 55% 20%, #facc15, transparent 70%), var(--bg-subtle); }` }
  ],
  api: [
    { name: '.lg-menu', type: 'class', desc: 'Glass container. Items are <code>.lg-menu-item</code> links or buttons.' },
    { name: '.lg-menu-vertical', type: 'class', desc: 'Stacked menu layout.' },
    { name: '.lg-menu-dark', type: 'class', desc: 'Force the dark glass tint.' },
    { name: 'aria-current / aria-selected', type: 'attr', desc: 'Marks the active item; the lens moves there.' },
    { name: '--lg-tint / --lg-edge / --lg-active', type: 'var', desc: 'Glass tint, edge highlight and active item color.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { item, value }' }
  ]
});
