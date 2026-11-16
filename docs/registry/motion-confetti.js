RanjDocs.add({
  id: 'confetti',
  name: 'Confetti',
  group: 'Interactions',
  description: 'Physics-based confetti on a temporary full-screen canvas: bursts from any point, presets for fireworks, school pride, realistic cannons, stars and emoji. Declarative with data-confetti or call Ranj.confetti().',
  tags: ['new', 'fx', 'js'],
  keywords: ['celebration', 'party', 'fireworks', 'success', 'canvas confetti', 'burst'],
  demos: [
    {
      title: 'Presets',
      height: 240,
      html: `
<button class="btn btn-primary" data-confetti>🎉 Burst</button>
<button class="btn btn-outline" data-confetti="realistic">Realistic</button>
<button class="btn btn-outline" data-confetti="fireworks">Fireworks</button>
<button class="btn btn-outline" data-confetti="pride" data-confetti-colors="#6366f1, #ffffff, #f59e0b">School pride</button>
<button class="btn btn-outline" data-confetti="stars">⭐ Stars</button>
<button class="btn btn-outline" data-confetti="🦄">🦄 Emoji</button>`
    },
    {
      title: 'JavaScript API',
      description: 'Fire it after something succeeds; it returns a Promise that resolves when the particles settle.',
      html: `
<form class="demo-confetti-form">
  <input class="input" placeholder="you@company.com" aria-label="Email" value="alex@ranj.dev">
  <button class="btn btn-primary" type="submit">Join waitlist</button>
</form>`,
      js: `var f = root.querySelector('form');
f.onsubmit = function (e) {
  e.preventDefault();
  var r = f.querySelector('button').getBoundingClientRect();
  Ranj.confetti({ x: (r.left + r.width / 2) / innerWidth, y: r.top / innerHeight, particleCount: 120, spread: 90, colors: ['#22c55e', '#86efac', '#facc15', '#ffffff'] })
    .then(function () { f.querySelector('button').textContent = "You're in ✓"; });
};`,
      css: `.demo-confetti-form { display: flex; gap: .5rem; flex-wrap: wrap; justify-content: center; } .demo-confetti-form .input { width: 240px; }`
    }
  ],
  api: [
    { name: 'data-confetti', type: 'attr', default: 'burst', desc: 'On a button: <code>realistic</code>, <code>fireworks</code>, <code>pride</code>, <code>stars</code>, or an emoji. Fires from the element.' },
    { name: 'data-confetti-colors', type: 'attr', desc: 'Comma-separated colors.' },
    { name: 'Ranj.confetti(opts)', type: 'js', desc: 'opts: <code>x, y</code> (0–1 viewport fractions or px), <code>particleCount</code> 80, <code>angle</code> 90, <code>spread</code> 60, <code>startVelocity</code> 45, <code>decay</code> .92, <code>gravity</code> 1, <code>drift</code> 0, <code>ticks</code> 200, <code>colors</code>, <code>shapes</code> (square, circle, strip, star or emoji), <code>scalar</code> 1. Returns a Promise.' },
    { name: 'Ranj.confetti.burst(el, opts)', type: 'js', desc: 'Burst from an element’s center.' },
    { name: 'Ranj.confetti.realistic / fireworks / schoolPride / stars (opts)', type: 'js', desc: 'Presets; fireworks and schoolPride accept <code>duration</code>.' },
    { name: 'Ranj.confetti.emoji(emoji, opts)', type: 'js', desc: 'Emoji confetti.' },
    { name: 'ranj:confetti', type: 'event', desc: 'detail: <code>{ preset, done }</code> from data-confetti buttons.' }
  ],
  notes: '<p>With reduced motion confetti is skipped (pass <code>force: true</code> to override). The canvas is created on demand and removed when idle.</p>'
});
