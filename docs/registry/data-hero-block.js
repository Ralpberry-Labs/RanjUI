(function () {
  var U = function (id, w, h) { return 'https://images.unsplash.com/' + id + '?w=' + w + '&h=' + h + '&fit=crop&crop=faces&q=70'; };
  var arrow = '<svg class="block-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var arrowSm = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>';
  var play = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
  var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var faces = ['photo-1494790108377-be9c29b29330', 'photo-1500648767791-00dcc994a43e', 'photo-1438761681033-6461ffad8d80', 'photo-1506794778202-cad84cf45f1d', 'photo-1544005313-94ddf0286df2']
    .map(function (id) { return '<img src="' + U(id, 64, 64) + '" alt="">'; }).join('');
  var logos = ['Lumen', 'Fathom', 'Arcade', 'Parcel', 'Kite', 'Nord'].map(function (n) { return '<span>' + n + '</span>'; }).join('');
  RanjDocs.add({
    id: 'hero-block',
    name: 'Hero',
    group: 'Blocks',
    description: 'Landing-page heroes with a gradient headline, announcement pill, social proof and an app-window mockup, plus a split image variant.',
    tags: ['new'],
    keywords: ['landing', 'header', 'above the fold', 'headline', 'jumbotron'],
    demos: [
      {
        title: 'Centered with product shot',
        pad: false, center: false,
        html: `<section class="block block-hero">
  <div class="block-hero-bg"></div>
  <div class="block-container">
    <div class="block-hero-inner">
      <a class="block-announce" href="#"><span>Northwind 3.0: edge databases are here</span><span class="block-announce-tag">New</span><span class="block-announce-arrow">${arrowSm}</span></a>
      <h1 class="block-hero-title">Deploy at the speed of <span class="block-gradient-text">thought</span></h1>
      <p class="block-hero-lead">The frontend cloud for teams who ship daily. Git push, preview, merge, and your app is live in 42 regions before your coffee cools.</p>
      <div class="block-actions">
        <a class="block-btn block-btn-primary block-btn-lg" href="#">Start for free ${arrow}</a>
        <a class="block-btn block-btn-lg" href="#">${play} Watch the 2-min demo</a>
      </div>
      <div class="block-hero-proof"><div class="block-faces">${faces}</div><span>Loved by <b>18,000+</b> teams · <b>4.9</b> on G2</span></div>
    </div>
    <div class="block-window" aria-hidden="true">
      <div class="block-window-bar"><i></i><i></i><i></i><span class="block-window-url">app.northwind.dev/acme/analytics</span></div>
      <div class="block-window-body">
        <div class="block-window-side"><span class="on">Overview</span><span>Deployments</span><span>Analytics</span><span>Logs</span><span>Storage</span><span>Settings</span></div>
        <div class="block-window-main">
          <div class="block-kpis">
            <div class="block-kpi"><small>Visitors</small><b>284,190</b><em>+12.4%</em></div>
            <div class="block-kpi"><small>Revenue</small><b>$48,302</b><em>+8.1%</em></div>
            <div class="block-kpi"><small>p75 LCP</small><b>1.12 s</b><em>-0.3 s</em></div>
          </div>
          <div class="block-chart">
            <svg viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs><linearGradient id="block-hero-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--primary)" stop-opacity=".28"/><stop offset="1" stop-color="var(--primary)" stop-opacity="0"/></linearGradient></defs>
              <line class="grid" x1="0" y1="30" x2="400" y2="30"/><line class="grid" x1="0" y1="60" x2="400" y2="60"/><line class="grid" x1="0" y1="90" x2="400" y2="90"/>
              <path class="area" d="M0 96 C30 90 50 84 80 86 S130 64 160 70 S210 52 240 56 S300 30 330 36 S380 14 400 18 V120 H0Z"/>
              <path class="line2" d="M0 104 C40 100 70 98 100 96 S170 88 200 86 S270 72 300 72 S370 60 400 56"/>
              <path class="line" d="M0 96 C30 90 50 84 80 86 S130 64 160 70 S210 52 240 56 S300 30 330 36 S380 14 400 18"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
      },
      {
        title: 'Split with image',
        pad: false, center: false,
        html: `<section class="block block-hero block-hero-split">
  <div class="block-hero-bg"></div>
  <div class="block-container block-hero-grid">
    <div class="block-hero-inner">
      <span class="block-eyebrow"><span class="block-eyebrow-dot"></span>Now in 31 cities</span>
      <h1 class="block-hero-title">Workspaces your team will <span class="block-gradient-text">actually want</span> to visit</h1>
      <p class="block-hero-lead">Book a desk, a room or a whole floor in seconds. Flexible monthly plans from $149 per person, with coffee that is genuinely good.</p>
      <div class="block-actions">
        <a class="block-btn block-btn-dark block-btn-lg" href="#">Find a space ${arrow}</a>
        <a class="block-btn block-btn-ghost block-btn-lg" href="#">See pricing</a>
      </div>
      <div class="block-logos-label" style="margin:.75rem 0 0;text-align:left">Home base for teams at</div>
      <div class="block-logos" style="justify-content:flex-start;gap:.5rem 1.75rem">${logos}</div>
    </div>
    <div class="block-hero-media">
      <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=760&fit=crop&q=70" alt="Bright open-plan office with plants">
      <div class="block-float" style="left:1rem;bottom:1rem"><span class="block-float-dot">${check}</span><div><b>Desk 14B booked</b><small>Tomorrow · 9:00 to 17:30</small></div></div>
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-hero', type: 'class', desc: 'Hero section on .block. Add .block-hero-bg as first child for the grid + glow backdrop.' },
      { name: '.block-hero-title / .block-hero-lead', type: 'class', desc: 'Display headline (container-query fluid size) and lead paragraph.' },
      { name: '.block-gradient-text', type: 'class', desc: 'Brand gradient clipped to text; adapts to dark mode.' },
      { name: '.block-announce', type: 'class', desc: 'Announcement pill link with .block-announce-tag and .block-announce-arrow.' },
      { name: '.block-hero-proof / .block-faces', type: 'class', desc: 'Overlapping avatars + social proof line.' },
      { name: '.block-window', type: 'class', desc: 'App window mockup frame (.block-window-bar, -body, -side, -main, .block-kpi, .block-chart).' },
      { name: '.block-hero-split', type: 'class', desc: 'Left-aligned two-column hero; use .block-hero-grid and .block-hero-media.' },
      { name: '.block-float', type: 'class', desc: 'Floating glass notification card with gentle bob.' },
      { name: '.block-logos', type: 'class', desc: 'Row of wordmark logos.' }
    ]
  });
})();
