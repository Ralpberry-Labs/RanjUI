RanjDocs.add({
  id: 'cursor',
  name: 'Cursor Follower',
  group: 'Interactions',
  description: 'Custom cursors that are strictly opt-in: place a .cursor-follower inside any container and it only takes over there. Dot + ring that grows on links, gooey blob, ink trail and color splash.',
  tags: ['new', 'fx', 'js'],
  keywords: ['custom cursor', 'mouse follower', 'blob cursor', 'cursor trail', 'splash cursor', 'pointer'],
  demos: [
    {
      title: 'Dot + ring',
      description: 'Hover the links; elements with <code>data-cursor-text</code> show a label.',
      height: 320,
      html: `
<div class="demo-cursor-area">
  <div class="cursor-follower"></div>
  <h3>Selected work</h3>
  <div class="demo-cursor-links">
    <a href="#" onclick="return false">Lumen rebrand</a>
    <a href="#" onclick="return false">Vertex app</a>
    <a href="#" onclick="return false">Nimbus site</a>
  </div>
  <div class="demo-cursor-thumb" data-cursor-text="View">Case study</div>
</div>`,
      css: `.demo-cursor-area { width: 100%; max-width: 680px; min-height: 260px; padding: 2rem; border-radius: var(--radius-2xl); background: var(--card); border: 1px solid var(--border); display: grid; gap: 1rem; align-content: center; justify-items: center; text-align: center; }
.demo-cursor-links { display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
.demo-cursor-links a { color: var(--fg); font-weight: 600; }
.demo-cursor-thumb { width: 200px; height: 90px; border-radius: var(--radius-lg); display: grid; place-items: center; color: #fff; font-weight: 600; background: linear-gradient(135deg, #f97316, #ec4899); }`
    },
    {
      title: 'Variants',
      height: 300,
      html: `
<div class="demo-cursor-grid">
  <div class="demo-cursor-pane"><div class="cursor-follower" data-variant="blob" style="--cursor-color: #8b5cf6"></div><span>blob</span></div>
  <div class="demo-cursor-pane"><div class="cursor-follower" data-variant="trail" style="--cursor-color: #0ea5e9"></div><span>trail</span></div>
  <div class="demo-cursor-pane demo-cursor-dark"><div class="cursor-follower" data-variant="splash"></div><span>splash</span></div>
</div>`,
      css: `.demo-cursor-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; width: 100%; max-width: 820px; }
.demo-cursor-pane { height: 220px; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); display: grid; place-items: center; color: var(--muted-fg); font-family: var(--font-mono); font-size: .8rem; }
.demo-cursor-dark { background: #09090b; border-color: #1f1f23; }`
    }
  ],
  api: [
    { name: '.cursor-follower', type: 'class', desc: 'Place inside the container it should own (it overlays the parent). Hidden on touch devices and with reduced motion.' },
    { name: 'data-variant', type: 'attr', default: 'ring', desc: '<code>ring</code> (dot + ring), <code>dot</code>, <code>blob</code>, <code>trail</code>, <code>splash</code>.' },
    { name: 'data-scope', type: 'attr', default: 'parent', desc: '<code>page</code> follows the cursor across the whole document (use deliberately).' },
    { name: 'data-hide', type: 'attr', default: 'true', desc: 'Hide the native cursor inside the scope.' },
    { name: 'data-smoothing', type: 'attr', default: '0.16', desc: 'Ring follow factor per frame (lower is lazier).' },
    { name: 'data-cursor-text', type: 'attr', desc: 'On any element in scope: label shown inside the enlarged ring.' },
    { name: 'data-cursor', type: 'attr', desc: 'Mark any element as hoverable (links and buttons already are).' },
    { name: '--cursor-color / --cursor-size', type: 'var', default: 'var(--primary) / 36px', desc: 'Color and ring diameter.' }
  ]
});
