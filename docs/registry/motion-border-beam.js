RanjDocs.add({
  id: 'border-beam',
  name: 'Border Beam',
  group: 'Interactions',
  description: 'A glowing comet of light travels around the element’s border forever. CSS-only, using an animated conic gradient masked to the border.',
  tags: ['new', 'fx'],
  keywords: ['beam', 'border animation', 'glowing border', 'light trail', 'pricing card'],
  demos: [
    {
      title: 'Pricing card',
      height: 460,
      html: `
<div class="card border-beam demo-border-beam-price">
  <div class="card-header"><span class="badge badge-soft">Most popular</span><h3 class="card-title">Pro</h3><p class="card-description">For teams shipping every day.</p></div>
  <div class="card-content">
    <p class="demo-border-beam-amt"><b>$24</b> / seat / month</p>
    <ul><li>Unlimited projects</li><li>Advanced analytics</li><li>Priority support</li><li>SSO &amp; audit logs</li></ul>
  </div>
  <div class="card-footer"><button class="btn btn-primary" style="width:100%">Start 14-day trial</button></div>
</div>`,
      css: `.demo-border-beam-price { width: min(100%, 330px); }
.demo-border-beam-amt { margin-bottom: 1rem; color: var(--muted-fg); } .demo-border-beam-amt b { font-size: 2.5rem; color: var(--fg); letter-spacing: -.04em; }
.demo-border-beam-price ul { list-style: none; display: grid; gap: .5rem; font-size: .9rem; }
.demo-border-beam-price li::before { content: '✓'; color: var(--success); font-weight: 700; margin-right: .6rem; }`
    },
    {
      title: 'Search field, dual beams & colors',
      height: 260,
      html: `
<div class="demo-border-beam-stack">
  <label class="border-beam demo-border-beam-search" style="--beam-speed: 4s"><span>⌕</span><input placeholder="Ask anything…" aria-label="Ask anything"></label>
  <div class="border-beam border-beam-dual demo-border-beam-chip" style="--beam-color:#22d3ee; --beam-color-2:#a3e635; --beam-length: 60deg">Dual beam · custom colors</div>
</div>`,
      css: `.demo-border-beam-stack { display: grid; gap: 1.5rem; justify-items: center; width: 100%; }
.demo-border-beam-search { width: min(100%, 420px); display: flex; align-items: center; gap: .6rem; padding: 0 1rem; height: 3rem; border-radius: 99px; background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-md); color: var(--muted-fg); }
.demo-border-beam-search input { flex: 1; border: 0; outline: 0; background: none; height: 100%; color: var(--fg); }
.demo-border-beam-chip { padding: .9rem 1.4rem; border-radius: var(--radius-lg); background: var(--card); border: 1px solid var(--border); font-weight: 600; }`
    }
  ],
  api: [
    { name: '.border-beam', type: 'class', desc: 'Add to any element with a border radius (it creates its own stacking context).' },
    { name: '.border-beam-dual', type: 'class', desc: 'Two beams chasing each other.' },
    { name: '--beam-color / --beam-color-2', type: 'var', default: 'accent / accent + 80°', desc: 'Head and tail colors.' },
    { name: '--beam-length', type: 'var', default: '80deg', desc: 'Beam length as an angle of the loop.' },
    { name: '--beam-width / --beam-speed', type: 'var', default: '1.5px / 6s', desc: 'Thickness and loop time.' },
    { name: '--beam-inset', type: 'var', default: '-1px', desc: 'Offset so the beam sits on a 1px border; use 0 for borderless elements.' }
  ]
});
