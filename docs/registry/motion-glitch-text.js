RanjDocs.add({
  id: 'glitch-text',
  name: 'Glitch Text',
  group: 'Text Effects',
  description: 'RGB-split slices jitter across the text like a corrupted signal. CSS driven; the script only copies the text into data-text for you.',
  tags: ['new', 'fx'],
  keywords: ['glitch', 'cyberpunk', 'distortion', 'rgb split', 'error'],
  demos: [
    {
      title: 'Always on',
      bg: 'dark',
      height: 260,
      html: `
<h1 class="glitch-text demo-glitch-text-h">SIGNAL LOST</h1>`,
      css: `.demo-glitch-text-h { font-size: clamp(2.5rem, 1.5rem + 5vw, 5.5rem); font-weight: 900; letter-spacing: -.02em; color: #fff; }`
    },
    {
      title: 'On hover, custom colors',
      html: `
<a href="#" onclick="return false" class="glitch-text glitch-text-hover demo-glitch-text-link" style="--glitch-a:#f59e0b; --glitch-b:#22c55e; --glitch-speed:1.2s">Enter the void →</a>`,
      css: `.demo-glitch-text-link { font-size: 2rem; font-weight: 800; color: var(--fg); text-decoration: none !important; }`
    }
  ],
  api: [
    { name: '.glitch-text', type: 'class', desc: 'Always-on glitch.' },
    { name: '.glitch-text-hover', type: 'class', desc: 'Only while hovered or focused.' },
    { name: 'data-text', type: 'attr', desc: 'Copy of the text for the slice layers (filled automatically by ranj.js).' },
    { name: '--glitch-a / --glitch-b', type: 'var', default: '#ff2bd6 / #00e5ff', desc: 'Offset channel colors.' },
    { name: '--glitch-speed', type: 'var', default: '2.4s', desc: 'Slice cycle duration.' },
    { name: '--glitch-bg', type: 'var', default: 'transparent', desc: 'Set to the surface color for a harder, cleaner slice.' }
  ]
});
