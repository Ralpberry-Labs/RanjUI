RanjDocs.add({
  id: 'hover-effects',
  name: 'Hover Effects',
  group: 'Interactions',
  description: 'Tiny CSS utilities for tactile feedback: lift, press, scale, glow, sheen, underline, float, wiggle and jelly. Mix them on anything.',
  tags: ['new', 'fx'],
  keywords: ['hover lift', 'press scale', 'utilities', 'micro interaction', 'glow hover', 'underline animation'],
  demos: [
    {
      title: 'Cards',
      height: 280,
      html: `
<div class="demo-hover-effects-card fx-lift">.fx-lift</div>
<div class="demo-hover-effects-card fx-glow-hover">.fx-glow-hover</div>
<div class="demo-hover-effects-card fx-scale">.fx-scale</div>
<div class="demo-hover-effects-card fx-sheen fx-lift">.fx-sheen</div>`,
      css: `.demo-hover-effects-card { width: 170px; height: 120px; border-radius: var(--radius-xl); display: grid; place-items: center; background: var(--card); border: 1px solid var(--border); font-family: var(--font-mono); font-size: .8rem; box-shadow: var(--shadow-sm); cursor: pointer; }`
    },
    {
      title: 'Buttons & links',
      height: 220,
      html: `
<button class="btn btn-primary btn-lg fx-press">.fx-press</button>
<button class="btn btn-outline btn-lg fx-jelly">.fx-jelly</button>
<button class="btn btn-secondary btn-lg fx-wiggle">.fx-wiggle 🔔</button>
<a href="#" onclick="return false" class="fx-underline demo-hover-effects-link">.fx-underline link</a>
<span class="fx-float demo-hover-effects-float">🎈 .fx-float</span>`,
      css: `.demo-hover-effects-link { color: var(--fg); font-weight: 600; } .demo-hover-effects-float { display: inline-block; font-weight: 600; }`
    }
  ],
  api: [
    { name: '.fx-lift', type: 'class', desc: 'Rise 4px with a bigger shadow.' },
    { name: '.fx-press', type: 'class', desc: 'Scale to .96 while pressed.' },
    { name: '.fx-scale', type: 'class', desc: 'Springy 1.04 scale on hover.' },
    { name: '.fx-glow-hover', type: 'class', desc: 'Accent ring and glow on hover.' },
    { name: '.fx-sheen', type: 'class', desc: 'One light sweep per hover.' },
    { name: '.fx-underline', type: 'class', desc: 'Underline grows from the left.' },
    { name: '.fx-float', type: 'class', desc: 'Gentle idle float loop.' },
    { name: '.fx-wiggle / .fx-jelly', type: 'class', desc: 'Playful hover animations.' },
    { name: '.fx-icon-slide', type: 'class', desc: 'Nudges the trailing icon of a button on hover.' }
  ]
});
