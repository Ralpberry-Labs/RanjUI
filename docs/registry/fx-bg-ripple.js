RanjDocs.add({
  id: 'bg-ripple',
  name: 'Ripple',
  group: 'Backgrounds',
  description: 'Concentric rings breathe outward from a point, like sonar. Great behind a single icon or call to action.',
  tags: ['new', 'fx', 'js'],
  keywords: ['ripple', 'rings', 'sonar', 'pulse', 'concentric'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-ripple bg-fade"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Beta</b> Find my devices</span>
    <h2>Lost your keys again?</h2>
    <p>Tap once and every tracker within 120 meters chirps.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Ping nearby</a></div>
  </div>
</div>` },
    { title: 'Behind an icon', center: false, pad: false, height: 280, html: `
<div class="bg-host" style="height:280px;display:grid;place-items:center">
  <div class="bg-ripple" data-rings="6" data-size="90" data-step="56"></div>
  <div class="bg-content" style="width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-fg);box-shadow:var(--shadow-glow)">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>
  </div>
</div>` }
  ],
  api: [
    { name: '.bg-ripple', type: 'class', desc: 'Ring container (rings generated with JS).' },
    { name: 'data-rings', type: 'attr', default: '8', desc: 'Number of rings.' },
    { name: 'data-size', type: 'attr', default: '130', desc: 'Innermost ring diameter (px).' },
    { name: 'data-step', type: 'attr', default: '84', desc: 'Growth per ring (px).' },
    { name: '--ring / --fill', type: 'var', desc: 'Ring border and fill colors.' },
    { name: '--speed', type: 'var', default: '3.4s', desc: 'Pulse cycle.' }
  ]
});
