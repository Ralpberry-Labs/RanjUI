(function () {
  var I = window.__ovI;
  var logo = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--fg)"/><path d="M10 22V10l12 12V10" stroke="var(--bg)" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var links = '<a class="navbar-link" href="#" aria-current="page">Product</a><a class="navbar-link" href="#">Solutions</a><a class="navbar-link" href="#">Customers</a><a class="navbar-link" href="#">Pricing</a><a class="navbar-link" href="#">Docs</a>';
  var mobile = '<div class="navbar-mobile"><a class="navbar-link" href="#" aria-current="page">Product</a><a class="navbar-link" href="#">Solutions</a><a class="navbar-link" href="#">Customers</a><a class="navbar-link" href="#">Pricing</a><a class="navbar-link" href="#">Docs</a><hr><div class="navbar-mobile-actions"><a class="btn btn-outline" href="#">Sign in</a><a class="btn" href="#">Start for free</a></div></div>';
  var page = '<div class="demo-nb-hero"><span class="demo-nb-chip">' + I.sparkles + ' Northwind 4 is live</span><h3>Ship the product, not the process.</h3><p>Plan, build and launch with the tools your team already loves. Scroll this box to see the header react.</p></div><div class="demo-nb-fill"></div>';
  RanjDocs.add({
    id: 'navbar',
    name: 'Navbar',
    group: 'Navigation',
    description: 'A responsive site header. Links collapse into an animated hamburger panel when the bar itself gets narrow (container query, so it works in any column), a pill glides between hovered links, and sticky variants blur and lift once you scroll.',
    tags: ['js'],
    keywords: ['header', 'top bar', 'app bar', 'menu', 'hamburger', 'site navigation'],
    demos: [
      {
        title: 'Sticky & blurred',
        description: 'Scroll inside the frame: the bar turns translucent with a soft shadow.',
        pad: false, center: false, height: 380,
        html: `
<div class="demo-nb-frame">
  <header class="navbar navbar-sticky navbar-blur">
    <a class="navbar-brand" href="#">${logo} Northwind</a>
    <nav class="navbar-nav">${links}</nav>
    <div class="navbar-actions"><a class="btn btn-ghost btn-sm" href="#">Sign in</a><a class="btn btn-sm" href="#">Start for free</a></div>
    <button class="navbar-toggle"></button>
    ${mobile}
  </header>
  ${page}
</div>`,
        css: `.demo-nb-frame { position: relative; height: 380px; overflow-y: auto; background: var(--bg); }
.demo-nb-hero { display: flex; flex-direction: column; align-items: center; text-align: center; gap: .75rem; padding: 3.5rem 1.5rem 2rem;
  background: radial-gradient(60% 80% at 50% 0%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%); }
.demo-nb-hero h3 { font-size: clamp(1.5rem, 4vw, 2.25rem); font-weight: 700; letter-spacing: -.035em; line-height: 1.1; max-width: 22ch; }
.demo-nb-hero p { color: var(--muted-fg); max-width: 40ch; font-size: .9375rem; }
.demo-nb-chip { display: inline-flex; align-items: center; gap: .35rem; font-size: .75rem; font-weight: 500; padding: .25rem .7rem; border-radius: 99px; border: 1px solid var(--border); background: var(--card); }
.demo-nb-chip svg { width: .8rem; height: .8rem; color: var(--primary); }
.demo-nb-fill { height: 600px; margin: 0 1.5rem; border-radius: var(--radius-xl); background: repeating-linear-gradient(180deg, var(--muted) 0 64px, transparent 64px 80px); opacity: .6; }`
      },
      {
        title: 'Mobile menu',
        description: 'The same markup in a 360px column. Tap the burger: the panel drops in with staggered links.',
        pad: false, height: 420,
        html: `
<div class="demo-nb-phone">
  <header class="navbar">
    <a class="navbar-brand" href="#">${logo} Northwind</a>
    <nav class="navbar-nav">${links}</nav>
    <div class="navbar-actions"><a class="btn btn-sm" href="#">Start for free</a></div>
    <button class="navbar-toggle"></button>
    ${mobile}
  </header>
  ${page}
</div>`,
        css: `.demo-nb-phone { position: relative; width: min(360px, calc(100vw - 2rem)); height: 420px; overflow: hidden; border: 1px solid var(--border); border-radius: 1.75rem; background: var(--bg); box-shadow: var(--shadow-lg); margin: 1.5rem 0; }`
      },
      {
        title: 'Floating pill',
        description: '<code>.navbar-floating</code> with centered links (<code>.navbar-center</code>) and a CTA that stays on mobile (<code>.navbar-actions-keep</code>).',
        pad: false, center: false, height: 200,
        html: `
<div class="demo-nb-float">
  <header class="navbar navbar-floating navbar-center navbar-blur">
    <a class="navbar-brand" href="#">${logo}</a>
    <nav class="navbar-nav"><a class="navbar-link" href="#" aria-current="page">Work</a><a class="navbar-link" href="#">Studio</a><a class="navbar-link" href="#">Journal</a><a class="navbar-link" href="#">Contact</a></nav>
    <div class="navbar-actions navbar-actions-keep"><a class="btn btn-sm" href="#" style="border-radius:99px">Let's talk ${I.arrowRight}</a></div>
    <button class="navbar-toggle"></button>
    <div class="navbar-mobile"><a class="navbar-link" href="#" aria-current="page">Work</a><a class="navbar-link" href="#">Studio</a><a class="navbar-link" href="#">Journal</a><a class="navbar-link" href="#">Contact</a></div>
  </header>
</div>`,
        css: `.demo-nb-float { min-height: 200px; padding-top: .5rem; background: linear-gradient(135deg, color-mix(in oklab, var(--primary) 10%, var(--bg)), var(--bg) 60%); }
.demo-nb-float .btn svg { width: .9rem; height: .9rem; }`
      }
    ],
    api: [
      { name: '.navbar', type: 'class', desc: 'Header bar. Children: <code>.navbar-brand</code>, <code>.navbar-nav</code> of <code>.navbar-link</code>s (<code>aria-current="page"</code>), <code>.navbar-actions</code>, <code>.navbar-toggle</code>, <code>.navbar-mobile</code>.' },
      { name: '.navbar-sticky / -blur / -transparent / -shrink', type: 'class', desc: 'Stick to the top, frosted background, transparent until scrolled, shrink height on scroll.' },
      { name: '.navbar-floating / -center', type: 'class', desc: 'Rounded floating pill; centered link group.' },
      { name: '.navbar-actions-keep', type: 'class', desc: 'Keep these actions visible on mobile.' },
      { name: '--navbar-h', type: 'var', default: '4rem', desc: 'Bar height. Collapses to the burger below 48rem of navbar width.' },
      { name: 'data-offset', type: 'attr', default: '8', desc: 'Scroll distance before <code>data-scrolled</code> is set.' },
      { name: 'data-no-hover', type: 'attr', desc: 'Disable the gliding hover pill.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'Mobile panel opened / closed.' }
    ]
  });
})();
