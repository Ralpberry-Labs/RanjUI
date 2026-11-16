(function () {
  var T = [
    ['Maya Chen', '@mayabuilds', 'Swapped our whole component layer to Ranj in an afternoon. The marquee alone saved me a day.', '#f97316,#ec4899'],
    ['Jordan Lee', '@jlee', 'The docs feel like a product. Copy, paste, done.', '#22c55e,#0ea5e9'],
    ['Priya Patel', '@priyacodes', 'Accessibility is not an afterthought here. Focus states are perfect out of the box.', '#8b5cf6,#6366f1'],
    ['Diego Alvarez', '@diegoa', 'Dark mode looks hand-tuned on every single component.', '#f59e0b,#ef4444'],
    ['Sam Okafor', '@samo', 'Zero dependencies and it still has the best motion I have seen.', '#14b8a6,#22c55e'],
    ['Lena Novak', '@lena', 'Our landing page conversion went up 18% after the redesign.', '#ec4899,#8b5cf6'],
    ['Alex Morgan', '@amorgan', 'The dock component made our internal tool feel premium.', '#0ea5e9,#6366f1'],
    ['Hana Sato', '@hanas', 'I keep finding little details — the stagger timing is chef’s kiss.', '#f43f5e,#f97316'],
    ['Omar Haddad', '@omarh', 'Shipped a prototype to a client the same day. They thought it took weeks.', '#10b981,#84cc16']
  ];
  function card(t) {
    var ini = t[0].split(' ').map(function (s) { return s[0]; }).join('');
    return '      <figure class="demo-scroll-columns-card"><blockquote>' + t[2] + '</blockquote><figcaption><span style="background:linear-gradient(135deg,' + t[3] + ')">' + ini + '</span><b>' + t[0] + '</b><small>' + t[1] + '</small></figcaption></figure>';
  }
  function col(list, extra) { return '  <div class="marquee marquee-vertical marquee-pause' + (extra || '') + '">\n    <div class="marquee-content">\n' + list.map(card).join('\n') + '\n    </div>\n  </div>'; }
  RanjDocs.add({
    id: 'scroll-columns',
    name: 'Infinite Scroll Columns',
    group: 'Motion',
    description: 'A staggered wall of columns auto-scrolling in opposite directions at different speeds, faded top and bottom. Pauses under the pointer.',
    tags: ['new', 'fx', 'js'],
    keywords: ['testimonials', 'wall of love', 'vertical marquee', 'masonry scroll', 'dual column', 'feed'],
    demos: [
      {
        title: 'Wall of love',
        height: 560,
        html: '\n<div class="scroll-columns demo-scroll-columns">\n' + col(T.slice(0, 3), '" data-speed="22') + '\n' + col(T.slice(3, 6), ' marquee-reverse" data-speed="28') + '\n' + col(T.slice(6, 9), '" data-speed="18') + '\n</div>',
        css: '.demo-scroll-columns { width: 100%; max-width: 920px; }\n.demo-scroll-columns-card { padding: 1.1rem 1.2rem; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-sm); display: grid; gap: .9rem; }\n.demo-scroll-columns-card blockquote { font-size: .92rem; line-height: 1.55; }\n.demo-scroll-columns-card figcaption { display: grid; grid-template-columns: auto 1fr; column-gap: .65rem; align-items: center; }\n.demo-scroll-columns-card figcaption span { grid-row: span 2; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; color: #fff; font-size: .72rem; font-weight: 700; }\n.demo-scroll-columns-card b { font-size: .85rem; line-height: 1.2; } .demo-scroll-columns-card small { color: var(--muted-fg); font-size: .75rem; }'
      },
      {
        title: 'Dual column image feed',
        height: 480,
        html: '\n<div class="scroll-columns demo-scroll-columns-shots" style="--sc-height: 420px">\n  <div class="marquee marquee-vertical" data-speed="30"><div class="marquee-content">\n    <div class="demo-scroll-columns-shot" style="--a:#6366f1;--b:#ec4899;height:220px">Onboarding</div>\n    <div class="demo-scroll-columns-shot" style="--a:#0ea5e9;--b:#22c55e;height:160px">Pricing</div>\n    <div class="demo-scroll-columns-shot" style="--a:#f59e0b;--b:#ef4444;height:260px">Checkout</div>\n  </div></div>\n  <div class="marquee marquee-vertical marquee-reverse" data-speed="30"><div class="marquee-content">\n    <div class="demo-scroll-columns-shot" style="--a:#14b8a6;--b:#6366f1;height:180px">Dashboard</div>\n    <div class="demo-scroll-columns-shot" style="--a:#ec4899;--b:#f97316;height:240px">Profile</div>\n    <div class="demo-scroll-columns-shot" style="--a:#8b5cf6;--b:#0ea5e9;height:200px">Settings</div>\n  </div></div>\n</div>',
        css: '.demo-scroll-columns-shots { width: min(100%, 440px); }\n.demo-scroll-columns-shot { border-radius: var(--radius-xl); display: flex; align-items: flex-end; padding: 1rem; color: #fff; font-weight: 700; background: linear-gradient(150deg, var(--a), var(--b)); box-shadow: var(--shadow-md); }'
      }
    ],
    api: [
      { name: '.scroll-columns', type: 'class', desc: 'Grid of columns with faded edges. Each column is a <code>.marquee.marquee-vertical</code>.' },
      { name: '.marquee-reverse', type: 'class', desc: 'On a column: scroll the other way.' },
      { name: 'data-speed', type: 'attr', desc: 'Per column, px/s — vary it for a staggered look.' },
      { name: '--sc-height / --sc-gap', type: 'var', default: '520px / 1rem', desc: 'Visible height and spacing.' }
    ],
    notes: '<p>Below 640px the third column hides, below 420px the second.</p>'
  });
})();
