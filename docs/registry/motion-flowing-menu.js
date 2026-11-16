RanjDocs.add({
  id: 'flowing-menu',
  name: 'Flowing Menu',
  group: 'Motion',
  description: 'Big editorial menu rows where a marquee band slides in from whichever edge the cursor entered and exits toward the edge it leaves.',
  tags: ['new', 'fx', 'js'],
  keywords: ['menu hover', 'marquee menu', 'fullscreen menu', 'navigation', 'editorial'],
  demos: [
    {
      title: 'Studio menu',
      pad: false,
      html: `
<nav class="flowing-menu demo-flowing-menu" aria-label="Main">
  <a class="fm-item" href="#" onclick="return false" data-gradient="linear-gradient(135deg,#f97316,#ec4899)">Work</a>
  <a class="fm-item" href="#" onclick="return false" data-gradient="linear-gradient(135deg,#22d3ee,#6366f1)">Studio</a>
  <a class="fm-item" href="#" onclick="return false" data-gradient="linear-gradient(135deg,#a3e635,#14b8a6)">Journal</a>
  <a class="fm-item" href="#" onclick="return false" data-gradient="linear-gradient(135deg,#f472b6,#8b5cf6)">Contact</a>
</nav>`,
      css: `.demo-flowing-menu { width: 100%; }`
    },
    {
      title: 'Accent band',
      pad: false,
      html: `
<nav class="flowing-menu" style="--fm-bg: var(--primary); --fm-fg: var(--primary-fg); --fm-speed: 9s; width: 100%" aria-label="Services">
  <a class="fm-item" href="#" onclick="return false">Branding</a>
  <a class="fm-item" href="#" onclick="return false">Product design</a>
  <a class="fm-item" href="#" onclick="return false">Engineering</a>
</nav>`
    }
  ],
  api: [
    { name: '.flowing-menu', type: 'class', desc: 'Container (usually a <code>&lt;nav&gt;</code>).' },
    { name: '.fm-item', type: 'class', desc: 'A row (link). Band text defaults to the link text.' },
    { name: 'data-text', type: 'attr', desc: 'Override the band text.' },
    { name: 'data-image / data-gradient', type: 'attr', desc: 'Fill for the pill chips between repeats (image URL or any CSS background).' },
    { name: '--fm-bg / --fm-fg / --fm-speed', type: 'var', default: 'var(--fg) / var(--bg) / 14s', desc: 'Band colors and marquee loop time.' }
  ]
});
