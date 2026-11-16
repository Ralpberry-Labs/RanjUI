RanjDocs.add({
  id: 'circular-text',
  name: 'Circular Text',
  group: 'Text Effects',
  description: 'Text set on a circle that rotates continuously, with hover behaviours that speed up, slow down, pause or reverse with eased momentum.',
  tags: ['new', 'fx', 'js'],
  keywords: ['rotating badge', 'circle text', 'spinning', 'stamp', 'seal'],
  demos: [
    {
      title: 'Badge with center icon',
      height: 280,
      html: `
<div class="circular-text demo-circular-text-a" data-text="Scroll to explore • Scroll to explore • ">
  <span class="demo-circular-text-core">↓</span>
</div>
<div class="circular-text demo-circular-text-b" data-text="Available for work ✦ 2026 ✦ " data-hover="slow" data-speed="14">
  <span class="demo-circular-text-avatar">AM</span>
</div>`,
      css: `.demo-circular-text-a { --size: 170px; --ct-font: 14px; color: var(--fg); }
.demo-circular-text-core { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: var(--primary); color: var(--primary-fg); font-size: 1.5rem; box-shadow: var(--shadow-glow); }
.demo-circular-text-b { --size: 150px; --ct-font: 12px; color: var(--muted-fg); }
.demo-circular-text-avatar { width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; color: #fff; background: linear-gradient(135deg, #f97316, #ec4899); }`
    },
    {
      title: 'Hover modes',
      description: '<code>data-hover</code>: speed (default), slow, pause, reverse, bonkers, none.',
      height: 240,
      html: `
<div class="circular-text demo-circular-text-m" data-text="speed up • speed up • speed up • "><b>speed</b></div>
<div class="circular-text demo-circular-text-m" data-hover="pause" data-text="pause • pause • pause • pause • "><b>pause</b></div>
<div class="circular-text demo-circular-text-m" data-hover="reverse" data-text="reverse • reverse • reverse • "><b>reverse</b></div>
<div class="circular-text demo-circular-text-m" data-hover="bonkers" data-text="go bonkers • go bonkers • "><b>bonkers</b></div>`,
      css: `.demo-circular-text-m { --size: 130px; --ct-font: 11px; margin: .5rem; }
.demo-circular-text-m b { font-size: .8rem; color: var(--muted-fg); }`
    }
  ],
  api: [
    { name: '.circular-text', type: 'class', desc: 'Container; children render in the center.' },
    { name: 'data-text', type: 'attr', desc: 'The text on the circle (repeat it with separators to fill the ring).' },
    { name: 'data-speed', type: 'attr', default: '20', desc: 'Seconds per revolution.' },
    { name: 'data-hover', type: 'attr', default: 'speed', desc: 'speed, slow, pause, reverse, bonkers, none.' },
    { name: 'data-reverse', type: 'attr', default: 'false', desc: 'Spin counter-clockwise.' },
    { name: '--size / --ct-font / --ct-spacing', type: 'var', default: '160px / 13px / .2em', desc: 'Diameter, font size and letter spacing.' }
  ]
});
