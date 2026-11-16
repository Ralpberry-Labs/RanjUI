(function () {
  var I = {
    figma: '<svg viewBox="0 0 24 24"><circle cx="15" cy="12" r="3.2" fill="#1abcfe"/><path d="M8.8 2.5h3.2v6.4H8.8a3.2 3.2 0 0 1 0-6.4z" fill="#f24e1e"/><path d="M12 2.5h3.2a3.2 3.2 0 0 1 0 6.4H12z" fill="#ff7262"/><path d="M8.8 8.9H12v6.3H8.8a3.2 3.2 0 0 1 0-6.3z" fill="#a259ff"/><path d="M8.8 15.2H12v3.2a3.2 3.2 0 1 1-3.2-3.2z" fill="#0acf83"/></svg>',
    bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="#f59e0b"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5"/></svg>',
    cloud: '<svg viewBox="0 0 24 24"><path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.5a4.75 4.75 0 0 1-.5 9.5z" fill="#0ea5e9"/></svg>',
    db: '<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" fill="#ec4899"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="#8b5cf6"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2.5" fill="#f43f5e"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="#f43f5e" stroke-width="2.2"/></svg>'
  };
  function icons(keys) { return keys.map(function (k) { return '    <span class="orbit-icon">' + I[k] + '</span>'; }).join('\n'); }
  RanjDocs.add({
    id: 'orbit',
    name: 'Orbit',
    group: 'Motion',
    description: 'Icons orbiting a center on one or more rings. Items are spaced automatically, stay upright while they travel, and rings can spin in opposite directions.',
    tags: ['new', 'fx', 'js'],
    keywords: ['orbiting circles', 'integrations', 'planets', 'rotate around', 'satellite'],
    demos: [
      {
        title: 'Integrations',
        height: 420,
        html: '\n<div class="orbit" style="--orbit-size: 360px">\n  <div class="orbit-center demo-orbit-core">R</div>\n  <div class="orbit-ring orbit-pause" style="--radius: 82px; --duration: 18s">\n' + icons(['bolt', 'code', 'cloud']) + '\n  </div>\n  <div class="orbit-ring orbit-reverse orbit-pause" style="--radius: 150px; --duration: 32s">\n' + icons(['figma', 'db', 'heart', 'chat', 'lock']) + '\n  </div>\n</div>',
        css: '.demo-orbit-core { width: 72px; height: 72px; border-radius: 22px; display: grid; place-items: center; font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: #fff; background: linear-gradient(135deg, var(--primary), oklch(.7 .2 calc(var(--hue) + 60))); box-shadow: var(--shadow-glow); }'
      },
      {
        title: 'Responsive radius & solid rings',
        description: 'A <code>data-radius</code> ≤ 1 is a fraction of the orbit radius (half its width), so it scales with the container.',
        height: 340,
        html: '\n<div class="orbit" style="--orbit-size: 300px">\n  <div class="orbit-center demo-orbit-sun">☀️</div>\n  <div class="orbit-ring orbit-solid" data-radius="0.38" data-duration="10">\n    <span class="demo-orbit-planet" style="background:#94a3b8"></span>\n  </div>\n  <div class="orbit-ring orbit-solid" data-radius="0.62" data-duration="16" data-offset="120">\n    <span class="demo-orbit-planet" style="background:#f59e0b;width:16px;height:16px"></span>\n  </div>\n  <div class="orbit-ring orbit-solid" data-radius="0.9" data-duration="26" data-offset="240">\n    <span class="demo-orbit-planet" style="background:#3b82f6;width:20px;height:20px"></span>\n    <span class="demo-orbit-planet" style="background:#ef4444"></span>\n  </div>\n</div>',
        css: '.demo-orbit-sun { font-size: 2.5rem; filter: drop-shadow(0 0 18px #fbbf24); } .demo-orbit-planet { display: block; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 12px currentColor; }'
      }
    ],
    api: [
      { name: '.orbit', type: 'class', desc: 'Square stage (<code>--orbit-size</code>, default 340px).' },
      { name: '.orbit-center', type: 'class', desc: 'Content in the middle.' },
      { name: '.orbit-ring', type: 'class', desc: 'A ring; its children orbit, evenly spaced.' },
      { name: '.orbit-reverse / .orbit-solid / .orbit-pause', type: 'class', desc: 'Spin the other way / solid path / pause while the orbit is hovered.' },
      { name: '.orbit-icon', type: 'class', desc: 'Round icon tile.' },
      { name: 'data-radius', type: 'attr', desc: 'px, or a fraction (≤ 1) of the orbit radius.' },
      { name: 'data-duration / data-offset', type: 'attr', desc: 'Seconds per revolution / starting angle in degrees.' },
      { name: '--radius / --duration / --path', type: 'var', default: '120px / 24s / faint', desc: 'Ring knobs (CSS-only usage: set <code>--a</code> per item).' }
    ]
  });
})();
