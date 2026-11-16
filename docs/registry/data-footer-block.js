(function () {
  function ic(p) { return '<svg viewBox="0 0 24 24" fill="currentColor">' + p + '</svg>'; }
  var S = {
    x: ic('<path d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.4L5.4 21H2.3l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.3 4.7H5.5z"/>'),
    gh: ic('<path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/>'),
    li: ic('<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/>'),
    yt: ic('<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/>')
  };
  var mark = '<span class="block-brand-mark"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></span>';
  var socials = '<div class="block-socials"><a href="#" aria-label="X">' + S.x + '</a><a href="#" aria-label="GitHub">' + S.gh + '</a><a href="#" aria-label="LinkedIn">' + S.li + '</a><a href="#" aria-label="YouTube">' + S.yt + '</a></div>';
  function col(t, links) { return '      <nav aria-label="' + t + '"><h4>' + t + '</h4><ul>' + links.map(function (l) { return '<li><a href="#">' + l + '</a></li>'; }).join('') + '</ul></nav>'; }
  var cols = [
    col('Product', ['Deployments', 'Edge functions', 'Analytics <span class="block-new">New</span>', 'Storage', 'Pricing']),
    col('Resources', ['Documentation', 'Guides', 'Changelog', 'Templates', 'Status']),
    col('Company', ['About', 'Customers', 'Careers', 'Blog', 'Press kit']),
    col('Legal', ['Privacy', 'Terms', 'DPA', 'Security', 'Cookies'])
  ].join('\n');
  RanjDocs.add({
    id: 'footer-block',
    name: 'Footer',
    group: 'Blocks',
    description: 'Site footers: a full multi-column footer with newsletter, status and socials, and a minimal centered one.',
    tags: ['new'],
    keywords: ['site footer', 'sitemap', 'bottom navigation', 'links'],
    demos: [
      {
        title: 'Multi-column with newsletter',
        pad: false, center: false,
        html: `<footer class="block block-footer">
  <div class="block-container">
    <div class="block-footer-news">
      <div><h3>Get the Friday Deploy</h3><p>Product updates and performance tips, once a week.</p></div>
      <form class="block-form"><input class="block-input" type="email" placeholder="you@company.com" aria-label="Email address"><button class="block-btn block-btn-primary block-btn-lg" type="button">Subscribe</button></form>
    </div>
    <div class="block-footer-grid">
      <div class="block-footer-brand">
        <a class="block-brand" href="#">${mark}Northwind</a>
        <p>The frontend cloud for teams who ship daily. Made with care in Lisbon, Brooklyn and Bengaluru.</p>
        <span class="block-status">All systems operational</span>
      </div>
${cols}
    </div>
    <div class="block-footer-bottom">
      <span>© 2026 Northwind Labs, Inc. All rights reserved.</span>
      ${socials}
    </div>
    <div class="block-footer-big" aria-hidden="true">northwind</div>
  </div>
</footer>`
      },
      {
        title: 'Minimal centered',
        pad: false, center: false,
        html: `<footer class="block block-footer">
  <div class="block-container block-footer-simple">
    <a class="block-brand" href="#">${mark}Northwind</a>
    <nav aria-label="Footer"><a href="#">Product</a><a href="#">Pricing</a><a href="#">Docs</a><a href="#">Blog</a><a href="#">Careers</a><a href="#">Contact</a></nav>
    ${socials}
    <small>© 2026 Northwind Labs, Inc. · <a href="#">Privacy</a> · <a href="#">Terms</a></small>
  </div>
</footer>`
      }
    ],
    api: [
      { name: '.block-footer', type: 'class', desc: 'Footer section (on .block) with subtle background and top border.' },
      { name: '.block-footer-grid', type: 'class', desc: 'Brand column + four link columns; 4 → 2 columns on narrow widths.' },
      { name: '.block-footer-news', type: 'class', desc: 'Newsletter row above the link grid.' },
      { name: '.block-footer-bottom', type: 'class', desc: 'Copyright + socials bar.' },
      { name: '.block-footer-big', type: 'class', desc: 'Oversized faded wordmark.' },
      { name: '.block-footer-simple', type: 'class', desc: 'Minimal centered footer.' },
      { name: '.block-brand / .block-brand-mark', type: 'class', desc: 'Logo lockup with gradient mark.' },
      { name: '.block-socials / .block-status / .block-new', type: 'class', desc: 'Social icon buttons, live status pill, “New” tag.' }
    ]
  });
})();
