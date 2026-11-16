RanjDocs.add({
  id: 'glass-button',
  name: 'Glass Button',
  group: 'Micro-interactions',
  description: 'Frosted glass buttons with a bright rim and a light sweep on hover. Made to sit on photos and gradients.',
  tags: ['new', 'fx'],
  keywords: ['glassmorphism', 'frosted', 'blur button', 'glass'],
  demos: [
    { title: 'On a wallpaper', pad: false, center: false, height: 280, html: `
<div style="min-height:280px;display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;justify-content:center;padding:2rem 1rem;background:radial-gradient(40% 60% at 25% 35%, #f97316, transparent 70%),radial-gradient(45% 60% at 75% 65%, #8b5cf6, transparent 70%),radial-gradient(30% 40% at 60% 20%, #22d3ee, transparent 70%),linear-gradient(135deg,#1e3a8a,#831843)">
  <button class="glass-btn">Continue</button>
  <button class="glass-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 5v14l11-7z"/></svg>Watch trailer</button>
  <button class="glass-btn" style="padding:0;width:var(--control-h-lg)" aria-label="Add"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
</div>` },
    { title: 'Theme-aware variant', description: '<code>.glass-btn-dark</code> tints with the page background, for lighter surfaces.', pad: false, center: false, height: 240, html: `
<div style="min-height:240px;display:flex;gap:.75rem;align-items:center;justify-content:center;padding:2rem 1rem;background:radial-gradient(40% 70% at 30% 50%, oklch(.8 .12 var(--hue)), transparent 70%),radial-gradient(40% 70% at 70% 50%, oklch(.85 .1 calc(var(--hue) + 90)), transparent 70%),var(--bg-subtle)">
  <button class="glass-btn glass-btn-dark">Open settings</button>
  <button class="glass-btn glass-btn-dark">Share</button>
</div>` }
  ],
  api: [
    { name: '.glass-btn', type: 'class', desc: 'White frosted glass with light text.' },
    { name: '.glass-btn-dark', type: 'class', desc: 'Tinted with <code>--bg</code> and using <code>--fg</code> text, adapts to the theme.' }
  ]
});
