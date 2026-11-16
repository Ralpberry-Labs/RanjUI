RanjDocs.add({
  id: 'star-border',
  name: 'Star Border',
  group: 'Interactions',
  description: 'Two soft points of light glide along the top and bottom edges of a button or card, like stars skimming a horizon.',
  tags: ['new', 'fx'],
  keywords: ['star border', 'glowing button', 'light edge', 'animated border'],
  demos: [
    {
      title: 'Buttons',
      height: 240,
      html: `
<button class="star-border"><span class="star-border-inner">Join the waitlist</span></button>
<button class="star-border" style="--star-color: #f472b6; --star-speed: 4s"><span class="star-border-inner">Pink, faster</span></button>
<a href="#" onclick="return false" class="star-border" style="--star-color: #34d399; --star-thickness: 2px"><span class="star-border-inner">Thicker edge</span></a>`
    },
    {
      title: 'Dark hero CTA',
      bg: 'dark',
      height: 240,
      html: `
<button class="star-border demo-star-border-dark" style="--star-color: #fff"><span class="star-border-inner">✦ Start building for free</span></button>`,
      css: `.demo-star-border-dark .star-border-inner { background: linear-gradient(180deg, #111118, #060609); color: #fff; border-color: #2a2a33; padding: 1rem 2rem; font-size: 1.05rem; }`
    }
  ],
  api: [
    { name: '.star-border', type: 'class', desc: 'Outer wrapper (button, link or div).' },
    { name: '.star-border-inner', type: 'class', desc: 'The visible surface.' },
    { name: '--star-color / --star-speed / --star-thickness', type: 'var', default: 'accent tint / 6s / 1px', desc: 'Light color, travel time and edge thickness.' }
  ]
});
