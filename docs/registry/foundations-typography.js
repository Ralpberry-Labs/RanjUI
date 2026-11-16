(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'typography',
    name: 'Typography',
    group: 'Foundations',
    description: 'Fluid headings, display sizes, lead and helper text, inline code, gradient text and a <code>.prose</code> class that styles long-form content with no extra markup.',
    tags: ['new'],
    keywords: ['type', 'heading', 'font', 'prose', 'text', 'h1', 'lead', 'gradient text', 'article'],
    demos: [
      {
        title: 'Type scale',
        center: false,
        html: `<div class="demo-typography-scale">
  <div><span>display-1</span><p class="display-1">Ship faster</p></div>
  <div><span>h1</span><h1>Build interfaces people love</h1></div>
  <div><span>h2</span><h2>Designed for the plain web</h2></div>
  <div><span>h3</span><h3>Zero dependencies, zero build step</h3></div>
  <div><span>h4</span><h4>One CSS file and one script</h4></div>
  <div><span>h5</span><h5>Works with any framework</h5></div>
  <div><span>h6</span><h6>Accessible by default</h6></div>
  <div><span>lead</span><p class="lead">Ranj UI gives you 150+ polished components and effects that look great in light and dark mode.</p></div>
  <div><span>body</span><p>Every component reads design tokens, so changing one hue re-themes your whole product, including focus rings and soft fills.</p></div>
  <div><span>large</span><p class="large">Are you sure you want to continue?</p></div>
  <div><span>small</span><p class="small">Last edited 3 minutes ago</p></div>
  <div><span>muted</span><p class="muted small">Enter your email address to receive updates.</p></div>
</div>`,
        css: `.demo-typography-scale { display: grid; }
.demo-typography-scale > div { display: grid; grid-template-columns: 6rem minmax(0, 1fr); gap: 1rem; align-items: baseline; padding: .9rem 0; border-bottom: 1px dashed var(--border); }
.demo-typography-scale > div:last-child { border-bottom: 0; }
.demo-typography-scale span { font-family: var(--font-mono); font-size: .72rem; color: var(--muted-fg); }
@media (max-width: 600px) { .demo-typography-scale > div { grid-template-columns: 1fr; gap: .25rem; } }`
      },
      {
        title: 'Hero headline',
        description: 'Eyebrow, balanced display heading with <code>.gradient-text</code>, and a lead paragraph.',
        html: `<div class="stack center-text" style="max-width:42rem;align-items:center">
  <span class="eyebrow">Ranj UI 2.0</span>
  <h1 class="display-2">The interface kit with <span class="gradient-text gradient-text-animated">taste built in</span></h1>
  <p class="lead">Drop in one stylesheet and get buttons, dialogs, charts and motion that feel like they came from a design team of twenty.</p>
  <div class="cluster" style="justify-content:center">
    <a class="btn btn-lg" href="#">Get started ${I('arrowRight')}</a>
    <a class="btn btn-lg btn-outline" href="#">${I('github')} Star on GitHub</a>
  </div>
</div>`,
        height: 380
      },
      {
        title: 'Prose',
        description: 'Wrap rendered Markdown or CMS HTML in <code>.prose</code>. Sizes: <code>.prose-sm</code>, <code>.prose-lg</code>.',
        center: false,
        html: `<article class="prose" style="margin:0 auto">
  <h2>Shipping our new billing system</h2>
  <p>Last quarter we moved <strong>40,000 customers</strong> from a legacy invoicing tool to usage-based pricing without a single failed charge. Here is what we learned, and the <a href="#">migration checklist</a> we wish we had on day one.</p>
  <h3>What we changed</h3>
  <ul>
    <li>Metering moved to an append-only event log, deduplicated by <code>idempotency_key</code>.</li>
    <li>Invoices are drafted 72 hours before they finalize, so support can fix mistakes.</li>
    <li>Every price change ships behind a flag and a dry-run report.</li>
  </ul>
  <blockquote>The safest migration is the one your customers never notice.</blockquote>
  <h3>The dry-run script</h3>
  <pre><code>npx billing migrate --dry-run --since 2026-01-01</code></pre>
  <table>
    <thead><tr><th>Plan</th><th>Customers</th><th>Avg. change</th></tr></thead>
    <tbody><tr><td>Starter</td><td>31,204</td><td>−4.2%</td></tr><tr><td>Growth</td><td>7,880</td><td>+1.1%</td></tr><tr><td>Enterprise</td><td>916</td><td>0.0%</td></tr></tbody>
  </table>
  <hr>
  <p>Press <kbd>⌘</kbd> <kbd>K</kbd> anywhere in the dashboard to open the new billing command menu.</p>
</article>`
      },
      {
        title: 'Inline elements',
        center: false,
        html: `<div class="stack" style="max-width:40rem;margin:0 auto">
  <p>Run <code>npm run build</code> to write the bundles to <code>dist/</code>.</p>
  <p>Press <kbd class="kbd">⌘</kbd> <kbd class="kbd">Shift</kbd> <kbd class="kbd">P</kbd> to open the command palette.</p>
  <p>Results for <mark>quarterly revenue</mark> across 3 workspaces.</p>
  <p>The <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.2 contrast ratio is 4.5:1 for body text, H<sub>2</sub>O, x<sup>2</sup>.</p>
  <p class="muted">Muted helper text <a href="#">with a link</a> inside it.</p>
</div>`
      },
      {
        title: 'Font families',
        center: false,
        html: `<div class="grid grid-auto" style="--min:200px">
  <div class="card card-sm"><div class="card-content"><p class="tiny muted">--font-sans</p><p class="font-sans text-2xl font-semibold">Inter</p><p class="small muted">Body and UI</p></div></div>
  <div class="card card-sm"><div class="card-content"><p class="tiny muted">--font-display</p><p class="font-display text-2xl font-bold tracking-tight">Inter Tight</p><p class="small muted">Headings</p></div></div>
  <div class="card card-sm"><div class="card-content"><p class="tiny muted">--font-mono</p><p class="font-mono text-2xl">JetBrains</p><p class="small muted">Code and numbers</p></div></div>
</div>`
      }
    ],
    api: [
      { name: 'h1–h6 / .h1–.h6', type: 'class', desc: 'Fluid heading sizes with balanced wrapping. Use the classes to style any element as a heading.' },
      { name: '.display-1 / .display-2', type: 'class', desc: 'Oversized hero headings.' },
      { name: '.eyebrow', type: 'class', desc: 'Small uppercase label above a heading.' },
      { name: '.lead', type: 'class', desc: 'Intro paragraph, emphasized, helper and muted text. Also: <code>.large</code> <code>.small</code> <code>.tiny</code> <code>.muted</code>' },
      { name: '.gradient-text', type: 'class', desc: 'Brand gradient fill; set <code>--gradient</code> to customize. Add <code>.gradient-text-animated</code> to pan it.' },
      { name: '.prose / .prose-sm / .prose-lg', type: 'class', desc: 'Styles headings, lists, quotes, code, tables, images and hr inside rich content.' },
      { name: '.text-balance', type: 'class', desc: 'Wrapping and numeric helpers. Also: <code>.text-pretty</code> <code>.tabular-nums</code>' },
      { name: '--font-sans', type: 'var', desc: 'Font stacks. Also: <code>--font-display</code> <code>--font-mono</code>' },
      { name: '--text-xs … --text-7xl', type: 'var', desc: 'Font size scale.' }
    ]
  });
})();
