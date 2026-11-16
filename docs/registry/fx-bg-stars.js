RanjDocs.add({
  id: 'bg-stars',
  name: 'Starfield',
  group: 'Backgrounds',
  description: 'Twinkling stars drifting with depth, or a warp-speed tunnel. Press and hold to accelerate.',
  tags: ['new', 'fx', 'js'],
  keywords: ['stars', 'space', 'warp', 'hyperspace', 'galaxy', 'canvas'],
  demos: [
    { title: 'Warp speed', description: 'Press and hold anywhere on the hero to boost.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-stars bg-stars-sky" data-mode="warp"></div>
  <div class="bg-hero bg-hero-dark">
    <span class="bg-hero-badge"><b>2x</b> Faster builds this week</span>
    <h2>Builds that break the light barrier</h2>
    <p>Remote caching makes your second build almost instant.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Enable caching</a></div>
  </div>
</div>` },
    { title: 'Twinkling drift', description: 'Theme-aware by default: light dots in dark mode, dark dots in light mode.', center: false, pad: false, height: 320, html: `
<div class="bg-host" style="height:320px">
  <div class="bg-stars"></div>
  <div class="bg-hero"><h2>Calm, quiet, focused</h2><p>A meditation timer for deep work sessions.</p><div class="bg-hero-actions"><a class="btn" href="#">Start a session</a></div></div>
</div>` }
  ],
  api: [
    { name: '.bg-stars', type: 'class', desc: 'Canvas starfield.' },
    { name: '.bg-stars-sky', type: 'class', desc: 'Paints a fixed deep-space backdrop and white stars in both themes.' },
    { name: 'data-mode', type: 'attr', default: 'drift', desc: '<code>drift</code> or <code>warp</code>.' },
    { name: 'data-speed', type: 'attr', default: '1', desc: 'Speed multiplier.' },
    { name: 'data-boost', type: 'attr', default: 'true', desc: 'Press and hold to accelerate.' },
    { name: 'data-count', type: 'attr', default: 'auto', desc: 'Star count.' }
  ]
});
