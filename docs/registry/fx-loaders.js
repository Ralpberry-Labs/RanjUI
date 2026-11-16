RanjDocs.add({
  id: 'loaders',
  name: 'Loader Gallery',
  group: 'Loaders',
  description: 'Twenty-plus pure CSS loaders: spinners, dots, bars, shapes, progress bars and skeleton shimmer. Every one follows --size and --color.',
  tags: ['new', 'fx'],
  keywords: ['spinner', 'loading', 'loader', 'activity indicator', 'dots', 'equalizer', 'skeleton', 'progress bar'],
  demos: [
    { title: 'Spinners', html: `
<div class="demo-ld-grid">
  <figure><span class="loader-ring" role="status" aria-label="Loading"></span><figcaption>ring</figcaption></figure>
  <figure><span class="loader-dual-ring" role="status" aria-label="Loading"></span><figcaption>dual-ring</figcaption></figure>
  <figure><span class="loader-arc" role="status" aria-label="Loading"></span><figcaption>arc</figcaption></figure>
  <figure><span class="loader-orbit" role="status" aria-label="Loading"><i></i></span><figcaption>orbit</figcaption></figure>
  <figure><span class="loader-ripple" role="status" aria-label="Loading"></span><figcaption>ripple</figcaption></figure>
  <figure><span class="loader-blades" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><figcaption>blades</figcaption></figure>
  <figure><span class="loader-clock" role="status" aria-label="Loading"></span><figcaption>clock</figcaption></figure>
  <figure><span class="loader-hourglass" role="status" aria-label="Loading"></span><figcaption>hourglass</figcaption></figure>
  <figure><span class="loader-square" role="status" aria-label="Loading"></span><figcaption>square</figcaption></figure>
</div>`, css: `
.demo-ld-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: .75rem; width: 760px; max-width: 100%; }
.demo-ld-grid figure { margin: 0; display: grid; justify-items: center; align-content: center; gap: .9rem; height: 120px; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); }
.demo-ld-grid figcaption { font: 500 .72rem var(--font-mono); color: var(--muted-fg); }` },
    { title: 'Dots and shapes', html: `
<div class="demo-ld-grid">
  <figure><span class="loader-dots" role="status" aria-label="Loading"><i></i><i></i><i></i></span><figcaption>dots-bounce</figcaption></figure>
  <figure><span class="loader-dots-pulse" role="status" aria-label="Loading"><i></i><i></i><i></i></span><figcaption>dots-pulse</figcaption></figure>
  <figure><span class="loader-dots-wave" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i><i></i></span><figcaption>dots-wave</figcaption></figure>
  <figure><span class="typing typing-bubble" role="status" aria-label="Typing"><i></i><i></i><i></i></span><figcaption>typing</figcaption></figure>
  <figure><span class="loader-bars" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i><i></i></span><figcaption>bars</figcaption></figure>
  <figure><span class="loader-cube" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i></span><figcaption>folding-cube</figcaption></figure>
  <figure><span class="loader-dot-grid" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><figcaption>dot-grid</figcaption></figure>
  <figure><span class="loader-chomp" role="status" aria-label="Loading" style="--size:30px"><i></i><i></i><i></i></span><figcaption>chomp</figcaption></figure>
  <figure><span class="loader-helix" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><figcaption>helix</figcaption></figure>
  <figure><span class="loader-infinite" style="--size:32px"></span><figcaption>infinite</figcaption></figure>
  <figure><span class="loader-pie" data-indeterminate style="--size:36px"></span><figcaption>pie</figcaption></figure>
  <figure><span class="spin-success" style="--size:40px"></span><figcaption>spin-success</figcaption></figure>
</div>` },
    { title: 'Animated progress bars', html: `
<div style="width:440px;max-width:100%;display:grid;gap:1.1rem">
  <div><small class="demo-ld-lbl">Gradient flow</small><div class="loader-bar loader-bar-gradient" style="--p:72"><i></i></div></div>
  <div><small class="demo-ld-lbl">Striped</small><div class="loader-bar loader-bar-striped" style="--p:48;--h:12px"><i></i></div></div>
  <div><small class="demo-ld-lbl">Glow</small><div class="loader-bar loader-bar-glow" style="--p:63;--h:6px"><i></i></div></div>
  <div><small class="demo-ld-lbl">Shimmer</small><div class="loader-bar loader-bar-shimmer" style="--p:85;--color:var(--success)"><i></i></div></div>
  <div><small class="demo-ld-lbl">Indeterminate</small><div class="loader-bar loader-bar-indeterminate" style="--h:4px" role="progressbar" aria-label="Loading"><i></i></div></div>
</div>`, css: `.demo-ld-lbl { display: block; margin-bottom: .35rem; font-size: .75rem; color: var(--muted-fg); font-weight: 600; }` },
    { title: 'Skeleton shimmer', description: 'A wave of light sweeps across placeholder shapes while content loads.', height: 280, html: `
<div style="width:420px;max-width:100%;display:grid;gap:1rem">
  <div style="display:flex;gap:.8rem;align-items:center;padding:1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
    <span class="loader-skel loader-skel-circle" style="width:44px;height:44px;flex:none"></span>
    <div style="flex:1;display:grid;gap:.5rem"><span class="loader-skel loader-skel-text" style="width:55%"></span><span class="loader-skel loader-skel-text" style="width:85%"></span></div>
  </div>
  <div style="padding:1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);display:grid;gap:.6rem">
    <span class="loader-skel" style="height:120px;border-radius:var(--radius-lg)"></span>
    <span class="loader-skel loader-skel-text" style="width:70%"></span><span class="loader-skel loader-skel-text" style="width:40%"></span>
  </div>
</div>` },
    { title: 'Colors and sizes', html: `
<span class="loader-ring" style="--size:20px;--thick:3px"></span>
<span class="loader-ring" style="--size:32px;--color:var(--success)"></span>
<span class="loader-ring" style="--size:48px;--thick:6px;--color:#f43f5e"></span>
<span class="loader-bars" style="--size:24px;--color:var(--warning)"><i></i><i></i><i></i><i></i><i></i></span>
<span class="loader-dots" style="--size:28px;--color:var(--fg)"><i></i><i></i><i></i></span>
<button class="btn" disabled style="gap:.6rem"><span class="loader-ring" style="--size:16px;--thick:2.5px;--color:currentColor"></span>Saving</button>` }
  ],
  api: [
    { name: '.loader-ring / -dual-ring / -arc / -orbit / -ripple / -clock / -hourglass / -square', type: 'class', desc: 'Single-element spinners (<code>.loader-orbit</code> takes one <code>&lt;i&gt;</code>).' },
    { name: '.loader-blades', type: 'class', desc: '8 <code>&lt;i&gt;</code> children.' },
    { name: '.loader-dots / -dots-pulse', type: 'class', desc: '3 <code>&lt;i&gt;</code>. <code>.loader-dots-wave</code> takes 5.' },
    { name: '.loader-bars', type: 'class', desc: '5 <code>&lt;i&gt;</code> equalizer bars.' },
    { name: '.loader-cube / .loader-dot-grid / .loader-chomp / .loader-helix', type: 'class', desc: '4, 9, 3 and 8 <code>&lt;i&gt;</code> children.' },
    { name: '.loader-bar (+ -gradient -striped -glow -shimmer -indeterminate)', type: 'class', desc: 'Progress bar with an <code>&lt;i&gt;</code> fill. Value via <code>--p</code> (0..100) or <code>Ranj.progress(el, v)</code>.' },
    { name: '.loader-skel (+ -circle -text)', type: 'class', desc: 'Skeleton block with a light wave.' },
    { name: '--size / --color / --thick', type: 'var', default: '40px / --primary / 4px', desc: 'Every loader follows these.' }
  ]
});
