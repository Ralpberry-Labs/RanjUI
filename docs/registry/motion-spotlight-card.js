RanjDocs.add({
  id: 'spotlight-card',
  name: 'Spotlight Card',
  group: 'Interactions',
  description: 'A soft radial light follows the cursor inside the card and lights its border. In a spotlight grid the border glow spills across every nearby card.',
  tags: ['new', 'fx', 'js'],
  keywords: ['spotlight', 'glow card', 'cursor light', 'hover glow', 'border glow', 'linear style'],
  demos: [
    {
      title: 'Single card',
      height: 300,
      html: `
<div class="spotlight-card demo-spotlight-card-one">
  <span class="demo-spotlight-card-ic">✦</span>
  <h3>Edge functions</h3>
  <p>Run code in 300+ locations with cold starts under 5ms.</p>
</div>`,
      css: `.demo-spotlight-card-one { width: min(100%, 340px); padding: 1.75rem; display: grid; gap: .5rem; }
.demo-spotlight-card-one p, .demo-spotlight-card-grid p { color: var(--muted-fg); font-size: .9rem; }
.demo-spotlight-card-ic { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; background: var(--primary-soft); color: var(--primary); font-size: 1.1rem; margin-bottom: .5rem; }`
    },
    {
      title: 'Spotlight grid',
      description: 'Wrap cards in <code>.spotlight-grid</code>: move between cards and watch the borders light up across the gaps.',
      height: 380,
      bg: 'dark',
      html: `
<div class="spotlight-grid demo-spotlight-card-grid" style="--spot-color: rgb(167 139 250 / .18); --spot-border: rgb(196 181 253 / .9)">
  <div class="spotlight-card"><h4>Auth</h4><p>Passkeys, SSO and magic links.</p></div>
  <div class="spotlight-card"><h4>Storage</h4><p>S3-compatible, globally cached.</p></div>
  <div class="spotlight-card"><h4>Queues</h4><p>Exactly-once delivery with retries.</p></div>
  <div class="spotlight-card"><h4>Search</h4><p>Typo-tolerant full-text in 10ms.</p></div>
  <div class="spotlight-card"><h4>Cron</h4><p>Schedules with timezones that make sense.</p></div>
  <div class="spotlight-card"><h4>Logs</h4><p>Tail anything, retain for 90 days.</p></div>
</div>`,
      css: `.demo-spotlight-card-grid { width: 100%; max-width: 820px; }
.demo-spotlight-card-grid .spotlight-card { padding: 1.4rem; background: #0f0f14; border-color: #26262e; color: #f4f4f5; }
.demo-spotlight-card-grid h4 { margin-bottom: .25rem; }
.demo-spotlight-card-grid p { color: #a1a1aa; }`
    }
  ],
  api: [
    { name: '.spotlight-card', type: 'class', desc: 'Card with cursor light and border glow.' },
    { name: '.spotlight-grid / data-spotlight-group', type: 'class', desc: 'Grid (or any container with the attribute) that drives all child cards together.' },
    { name: '--spot-color / --spot-border / --spot-size', type: 'var', default: 'accent 20% / accent 85% / 420px', desc: 'Fill color, border light color and radius.' },
    { name: '--mx / --my', type: 'var', desc: 'Pointer position written per card (px).' }
  ]
});
