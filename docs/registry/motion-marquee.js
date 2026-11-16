(function () {
  var L = {
    lumen: '<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="4.5" fill="#f59e0b"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>Lumen',
    vertex: '<svg viewBox="0 0 24 24"><path d="M12 2.5 22 20H2z" fill="#6366f1"/><path d="M12 9.5 16.5 17h-9z" fill="#c7d2fe"/></svg>Vertex',
    nimbus: '<svg viewBox="0 0 24 24"><path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.5a4.75 4.75 0 0 1-.5 9.5z" fill="#0ea5e9"/></svg>Nimbus',
    quanta: '<svg viewBox="0 0 24 24"><rect x="4.5" y="4.5" width="15" height="15" rx="3.5" transform="rotate(45 12 12)" fill="#10b981"/><circle cx="12" cy="12" r="3" fill="#d1fae5"/></svg>Quanta',
    helix: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round"><path d="M6 3c0 6 12 6 12 12s-12 6-12 6" stroke="#ec4899"/><path d="M18 3c0 6-12 6-12 12" stroke="#f9a8d4"/></svg>Helix',
    polaris: '<svg viewBox="0 0 24 24"><path d="m12 1.5 2.6 7.9H23l-6.8 4.9 2.6 8-6.8-4.9-6.8 4.9 2.6-8L1 9.4h8.4z" fill="#8b5cf6"/></svg>Polaris',
    orbitly: '<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#f43f5e" stroke-width="2" transform="rotate(-30 12 12)"/><circle cx="12" cy="12" r="3.6" fill="#f43f5e"/></svg>Orbitly',
    kinetic: '<svg viewBox="0 0 24 24" fill="#14b8a6"><rect x="3" y="12" width="4" height="9" rx="1.5"/><rect x="10" y="7" width="4" height="14" rx="1.5"/><rect x="17" y="3" width="4" height="18" rx="1.5"/></svg>Kinetic'
  };
  function logos(keys) { return keys.map(function (k) { return '    <span class="marquee-logo">' + L[k] + '</span>'; }).join('\n'); }
  var all = ['lumen', 'vertex', 'nimbus', 'quanta', 'helix', 'polaris', 'orbitly', 'kinetic'];
  var rot = function (n) { return all.slice(n).concat(all.slice(0, n)); };

  RanjDocs.add({
    id: 'marquee',
    name: 'Marquee',
    group: 'Motion',
    description: 'Infinite, seamless scrolling rows for logos, testimonials or tickers. Content is duplicated automatically to fill any width, with pause-on-hover, reverse, vertical, faded edges and a constant px/s speed.',
    tags: ['new', 'fx', 'js'],
    keywords: ['ticker', 'logo cloud', 'infinite scroll', 'carousel', 'logos', 'scrolling banner'],
    demos: [
      {
        title: 'Logo marquee',
        html: '\n<div class="marquee marquee-fade marquee-pause" data-speed="60" style="width:100%">\n  <div class="marquee-content">\n' + logos(all) + '\n  </div>\n</div>'
      },
      {
        title: 'Alternating logo wall',
        description: 'Stack rows in a <code>.marquee-wall</code> and reverse every other one.',
        height: 300,
        html: '\n<div class="marquee-wall demo-marquee-wall">\n  <div class="marquee marquee-fade marquee-pause" data-speed="45">\n    <div class="marquee-content">\n' + logos(all) + '\n    </div>\n  </div>\n  <div class="marquee marquee-fade marquee-pause marquee-reverse" data-speed="35">\n    <div class="marquee-content">\n' + logos(rot(3)) + '\n    </div>\n  </div>\n  <div class="marquee marquee-fade marquee-pause" data-speed="55">\n    <div class="marquee-content">\n' + logos(rot(5)) + '\n    </div>\n  </div>\n</div>',
        css: '.demo-marquee-wall { width: 100%; }'
      },
      {
        title: 'Skewed ticker',
        bg: 'none',
        pad: false,
        height: 220,
        html: `
<div class="demo-marquee-ticks">
  <div class="marquee marquee-skew demo-marquee-band" data-speed="90">
    <div class="marquee-content">
      <span>Zero dependencies</span><b>✦</b><span>160+ components</span><b>✦</b><span>Dark mode</span><b>✦</b><span>Accessible</span><b>✦</b><span>MIT licensed</span><b>✦</b>
    </div>
  </div>
</div>`,
        css: `.demo-marquee-ticks { width: 100%; overflow: hidden; padding: 3rem 0; }
.demo-marquee-band { --gap: 1.5rem; padding: 1rem 0; background: var(--primary); color: var(--primary-fg); font-family: var(--font-display); font-weight: 800; font-size: clamp(1.25rem, 1rem + 1.5vw, 2rem); letter-spacing: -.02em; text-transform: uppercase; box-shadow: var(--shadow-glow); }
.demo-marquee-band b { opacity: .6; }`
      },
      {
        title: 'Vertical',
        height: 340,
        html: `
<div class="marquee marquee-vertical marquee-fade marquee-pause demo-marquee-v" data-speed="30">
  <div class="marquee-content">
    <div class="demo-marquee-row"><b>Deploy succeeded</b><span>web-app · main · 42s</span></div>
    <div class="demo-marquee-row"><b>New signup</b><span>maya@lumen.io · Pro plan</span></div>
    <div class="demo-marquee-row"><b>Invoice paid</b><span>$1,240.00 · Vertex Inc.</span></div>
    <div class="demo-marquee-row"><b>PR merged</b><span>#482 Faster cold starts</span></div>
    <div class="demo-marquee-row"><b>Alert resolved</b><span>p95 latency back to 120ms</span></div>
  </div>
</div>`,
        css: `.demo-marquee-v { height: 280px; width: min(100%, 320px); --gap: .6rem; }
.demo-marquee-row { display: grid; gap: .1rem; padding: .8rem 1rem; border-radius: var(--radius-lg); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-sm); font-size: .85rem; }
.demo-marquee-row span { color: var(--muted-fg); font-size: .78rem; }`
      }
    ],
    api: [
      { name: '.marquee', type: 'class', desc: 'Container. Wrap content in <code>.marquee-content</code> (created automatically if missing).' },
      { name: '.marquee-reverse / .marquee-vertical', type: 'class', desc: 'Direction modifiers.' },
      { name: '.marquee-pause', type: 'class', desc: 'Pause on hover and focus-within. <code>data-paused</code> pauses programmatically.' },
      { name: '.marquee-fade', type: 'class', desc: 'Fade the edges with a mask (<code>--fade</code> sets the width).' },
      { name: '.marquee-wall / .marquee-skew', type: 'class', desc: 'Stack several rows / tilt a band.' },
      { name: '.marquee-logo', type: 'class', desc: 'Ready-made logo tile.' },
      { name: 'data-speed', type: 'attr', default: '0', desc: 'Constant speed in px per second (overrides <code>--duration</code>).' },
      { name: 'data-clones', type: 'attr', default: 'auto', desc: 'Force a number of duplicated copies.' },
      { name: '--duration / --gap', type: 'var', default: '30s / 1rem', desc: 'Loop time per copy and spacing.' }
    ],
    notes: '<p>Clones are <code>aria-hidden</code> and <code>inert</code>, so screen readers and keyboard users see the content once.</p>'
  });
})();
