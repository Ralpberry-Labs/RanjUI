RanjDocs.add({
  id: 'trace-button',
  name: 'Trace Button',
  group: 'Micro-interactions',
  description: 'On hover a comet of light races around the border. Use the always-on variant for a featured action.',
  tags: ['new', 'fx'],
  keywords: ['border light', 'trace', 'animated border', 'comet', 'conic'],
  demos: [
    { title: 'Hover', html: `
<button class="trace-btn">Book a demo</button>
<button class="trace-btn" style="--trace:#10b981">Deploy to production</button>
<button class="trace-btn trace-btn-always" style="--trace:#f59e0b">Featured</button>` },
    { title: 'On dark', bg: 'dark', html: `
<button class="trace-btn trace-btn-dark trace-btn-always">Join the beta</button>
<button class="trace-btn trace-btn-dark" style="--trace:#f472b6;--bw:2px">Watch keynote</button>` }
  ],
  api: [
    { name: '.trace-btn', type: 'class', desc: 'Border light on hover and focus. CSS only.' },
    { name: '.trace-btn-always', type: 'class', desc: 'Light runs all the time.' },
    { name: '.trace-btn-dark', type: 'class', desc: 'Dark surface.' },
    { name: '--trace / --bw', type: 'var', default: '--primary / 1.5px', desc: 'Light color and border width.' }
  ]
});
