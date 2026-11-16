RanjDocs.add({
  id: 'parallax',
  name: 'Parallax',
  group: 'Motion',
  description: 'Layers that drift at different speeds as you scroll, plus a pointer-driven scene where each layer moves by its depth. Transform-only, rAF-throttled.',
  tags: ['new', 'fx', 'js'],
  keywords: ['depth', 'scroll speed', 'mouse parallax', 'layers', '3d'],
  demos: [
    {
      title: 'Pointer scene',
      description: 'Move your pointer over the card. Each layer has its own <code>data-depth</code>.',
      height: 380,
      html: `
<div class="parallax-scene demo-parallax-scene" data-max="36" data-scene-tilt="4">
  <div class="demo-parallax-orb demo-parallax-orb-a" data-depth="-0.6"></div>
  <div class="demo-parallax-orb demo-parallax-orb-b" data-depth="0.9"></div>
  <div class="demo-parallax-card" data-depth="0.25">
    <small>Balance</small><b>$24,580.42</b><span>+3.2% this week</span>
  </div>
  <div class="demo-parallax-chip demo-parallax-chip-a" data-depth="1.2">💳 Card added</div>
  <div class="demo-parallax-chip demo-parallax-chip-b" data-depth="-1">📈 +$420</div>
</div>`,
      css: `.demo-parallax-scene { width: min(100%, 560px); height: 320px; border-radius: var(--radius-2xl); background: linear-gradient(135deg, color-mix(in oklab, var(--primary) 14%, var(--card)), var(--card)); border: 1px solid var(--border); display: grid; place-items: center; box-shadow: var(--shadow-lg); }
.demo-parallax-orb { position: absolute; border-radius: 50%; filter: blur(2px); }
.demo-parallax-orb-a { width: 160px; height: 160px; left: 8%; top: 10%; background: radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed); opacity: .55; }
.demo-parallax-orb-b { width: 90px; height: 90px; right: 10%; bottom: 12%; background: radial-gradient(circle at 30% 30%, #fbcfe8, #db2777); opacity: .6; }
.demo-parallax-card { position: relative; display: grid; gap: .2rem; padding: 1.25rem 1.5rem; min-width: 240px; border-radius: var(--radius-xl); background: color-mix(in oklab, var(--card) 80%, transparent); backdrop-filter: blur(12px); border: 1px solid var(--border); box-shadow: var(--shadow-xl); }
.demo-parallax-card small { color: var(--muted-fg); } .demo-parallax-card b { font-size: 2rem; letter-spacing: -.03em; } .demo-parallax-card span { color: var(--success); font-size: .85rem; font-weight: 600; }
.demo-parallax-chip { position: absolute; padding: .5rem .8rem; border-radius: 99px; background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-md); font-size: .8rem; font-weight: 600; }
.demo-parallax-chip-a { left: 9%; bottom: 18%; } .demo-parallax-chip-b { right: 8%; top: 16%; }`
    },
    {
      title: 'Scroll layers',
      description: 'Scroll the panel: <code>data-parallax</code> sets each layer’s speed (negative moves the other way).',
      pad: false, center: false,
      html: `
<div class="demo-parallax-box">
  <div class="demo-parallax-spacer">Scroll ↓</div>
  <section class="demo-parallax-hero">
    <div class="demo-parallax-sun" data-parallax="0.45"></div>
    <div class="demo-parallax-hill demo-parallax-hill-1" data-parallax="0.25"></div>
    <div class="demo-parallax-hill demo-parallax-hill-2" data-parallax="0.12"></div>
    <h2 data-parallax="-0.2">Mountains move</h2>
  </section>
  <div class="demo-parallax-spacer"></div>
</div>`,
      css: `.demo-parallax-box { height: 380px; overflow-y: auto; }
.demo-parallax-spacer { height: 260px; display: grid; place-items: center; color: var(--muted-fg); font-size: .875rem; }
.demo-parallax-hero { position: relative; height: 420px; overflow: hidden; margin: 0 1rem; border-radius: var(--radius-2xl); background: linear-gradient(180deg, #fde68a, #fb923c 55%, #be185d); display: grid; place-items: center; }
.demo-parallax-hero h2 { position: relative; z-index: 3; color: #fff; font-size: clamp(2rem, 1rem + 4vw, 3.5rem); text-shadow: 0 6px 30px rgb(0 0 0 / .25); }
.demo-parallax-sun { position: absolute; width: 140px; height: 140px; left: 50%; top: 18%; margin-left: -70px; border-radius: 50%; background: #fff7ed; box-shadow: 0 0 80px #fff7ed; }
.demo-parallax-hill { position: absolute; left: -10%; right: -10%; border-radius: 50% 50% 0 0; }
.demo-parallax-hill-1 { height: 55%; bottom: -12%; background: #9d174d; opacity: .75; }
.demo-parallax-hill-2 { height: 40%; bottom: -16%; background: #4c0519; z-index: 2; left: -30%; right: 10%; }`
    }
  ],
  api: [
    { name: 'data-parallax', type: 'attr', default: '0.2', desc: 'Scroll speed factor relative to the parent. Negative values move against the scroll.' },
    { name: 'data-parallax-axis', type: 'attr', default: 'y', desc: '<code>x</code> for horizontal drift.' },
    { name: '.parallax-scene', type: 'class', desc: 'Pointer-driven container.' },
    { name: 'data-depth', type: 'attr', desc: 'On children of a scene: movement factor (−2 … 2).' },
    { name: 'data-max / data-scene-tilt', type: 'attr', default: '40 / 0', desc: 'Scene: max layer travel in px, and optional 3D tilt in degrees.' }
  ]
});
