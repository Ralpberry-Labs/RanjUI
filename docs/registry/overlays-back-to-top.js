(function () {
  var I = window.__ovI;
  var paras = ['The first prototype of Northwind was a single HTML file and a spreadsheet. It worked, barely, and the people using it loved it anyway.',
    'By spring we had rewritten the sync engine twice. The second rewrite cut median save latency from 900ms to 60ms, and it still powers everything today.',
    'Growth came from teams inviting teams. We never ran an ad; the share button did the marketing for us.',
    'In 2025 we opened our first office in Lisbon. Half the company still works remotely, and we meet in person four times a year.',
    'What hasn’t changed is the bar: every feature is used internally for two weeks before it ships, and anything that feels slow is a bug.'];
  function article(id) {
    return '<div class="demo-btt-scroll" id="' + id + '"><article class="demo-btt-article">' + ['Origins', 'The rewrite', 'Growth', 'Lisbon', 'The bar'].map(function (h, i) {
      return '<h4 id="' + id + '-s' + i + '">' + h + '</h4><p>' + paras[i] + '</p><p>' + paras[(i + 2) % 5] + '</p>';
    }).join('') + '</article></div>';
  }
  var css = `.demo-btt-scroll { height: 320px; overflow-y: auto; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); scroll-behavior: auto; }
.demo-btt-article { padding: 1.5rem 1.75rem 4rem; max-width: 36rem; }
.demo-btt-article h4 { font-size: 1.05rem; font-weight: 650; letter-spacing: -.01em; margin: 1.75rem 0 .5rem; } .demo-btt-article h4:first-child { margin-top: 0; }
.demo-btt-article p { color: var(--muted-fg); font-size: .9063rem; line-height: 1.75; margin-bottom: .75rem; }`;

  RanjDocs.add({
    id: 'back-to-top',
    name: 'Back to Top',
    group: 'Navigation',
    description: 'A button that appears once the reader scrolls down, shows reading progress as a ring around the arrow, and smoothly returns to the top. Works for the page or any scroll container.',
    tags: ['js', 'new'],
    keywords: ['scroll to top', 'go up', 'reading progress', 'scroll progress'],
    demos: [
      {
        title: 'In a scroll container',
        description: 'Scroll the article: after 120px the button springs in and its ring tracks progress.',
        center: false,
        html: `
<div class="demo-btt-wrap">
  ${article('btt-article')}
  <button class="back-to-top back-to-top-absolute" data-target="#btt-article" data-offset="120"></button>
</div>`,
        css: css + `.demo-btt-wrap { position: relative; max-width: 36rem; margin: 0 auto; } .demo-btt-wrap .back-to-top { right: 1rem; bottom: 1rem; }`
      },
      {
        title: 'Variants',
        description: 'Solid, and a pill with a label.',
        center: false,
        html: `
<div class="demo-btt-wrap">
  ${article('btt-article-2')}
  <button class="back-to-top back-to-top-absolute back-to-top-solid" data-target="#btt-article-2" data-offset="80" style="right:4.25rem;bottom:1rem"></button>
  <button class="back-to-top back-to-top-absolute back-to-top-pill" data-target="#btt-article-2" data-offset="80" style="right:auto;left:1rem;bottom:1rem">${I.svg('arrowUp', 16, 'class="back-to-top-arrow"')} Top</button>
</div>`,
        css: `.demo-btt-wrap { position: relative; max-width: 36rem; margin: 0 auto; }`
      }
    ],
    api: [
      { name: '.back-to-top', type: 'class', desc: 'Fixed bottom-right button. Empty buttons get an arrow and a progress ring automatically.' },
      { name: '.back-to-top-absolute', type: 'class', desc: 'Position inside a relative wrapper (for scroll containers).' },
      { name: '.back-to-top-solid / -pill', type: 'class', desc: 'Primary fill; labelled pill without ring.' },
      { name: 'data-target', type: 'attr', default: 'window', desc: 'Selector of the scroll container to watch.' },
      { name: 'data-offset', type: 'attr', default: '320', desc: 'Scroll distance (px) before it appears.' },
      { name: '--p', type: 'var', desc: 'Scroll progress 0–1, set on the button (drive your own visuals with it).' }
    ]
  });

  RanjDocs.add({
    id: 'scrollspy',
    name: 'Scrollspy / Table of Contents',
    group: 'Navigation',
    description: 'An "On this page" list that highlights the section you are reading, with a glowing indicator that slides between links, passed-section styling, nested levels and smooth scrolling (without touching the URL hash).',
    tags: ['js', 'new'],
    keywords: ['toc', 'table of contents', 'on this page', 'scroll spy', 'anchor nav'],
    demos: [
      {
        title: 'Article outline',
        center: false,
        html: `
<div class="demo-spy">
  ${article('spy-article')}
  <nav class="toc" data-target="#spy-article" aria-label="On this page">
    <div class="toc-title">On this page</div>
    <a class="toc-link" href="#spy-article-s0">Origins</a>
    <a class="toc-link" href="#spy-article-s1">The rewrite</a>
    <a class="toc-link toc-sub" href="#spy-article-s2">Growth</a>
    <a class="toc-link toc-sub" href="#spy-article-s3">Lisbon</a>
    <a class="toc-link" href="#spy-article-s4">The bar</a>
    <div class="toc-progress"><span></span></div>
  </nav>
</div>`,
        css: css + `.demo-spy { display: grid; grid-template-columns: minmax(0, 1fr) 11rem; gap: 1.5rem; align-items: start; max-width: 48rem; margin: 0 auto; }
@media (max-width: 640px) { .demo-spy { grid-template-columns: minmax(0, 1fr); } .demo-spy .toc { order: -1; } }`
      },
      {
        title: 'Pill style',
        center: false,
        html: `
<div class="demo-spy">
  ${article('spy-article-2')}
  <nav class="toc toc-pills" data-target="#spy-article-2" aria-label="Sections">
    <div class="toc-title">Sections</div>
    <a class="toc-link" href="#spy-article-2-s0">Origins</a>
    <a class="toc-link" href="#spy-article-2-s1">The rewrite</a>
    <a class="toc-link" href="#spy-article-2-s2">Growth</a>
    <a class="toc-link" href="#spy-article-2-s3">Lisbon</a>
    <a class="toc-link" href="#spy-article-2-s4">The bar</a>
  </nav>
</div>`,
        css: `.demo-spy { display: grid; grid-template-columns: minmax(0, 1fr) 11rem; gap: 1.5rem; align-items: start; max-width: 48rem; margin: 0 auto; }`
      }
    ],
    api: [
      { name: '.toc', type: 'class', desc: 'List of <code>a.toc-link[href="#id"]</code>. Also works on any element with <code>data-scrollspy</code>.' },
      { name: '.toc-title / .toc-sub / .toc-progress', type: 'class', desc: 'Heading, nested level, reading progress bar (<code>&lt;div class="toc-progress"&gt;&lt;span&gt;&lt;/span&gt;&lt;/div&gt;</code>).' },
      { name: '.toc-pills', type: 'class', desc: 'Soft pill behind the active link instead of a rail.' },
      { name: 'data-target', type: 'attr', default: 'window', desc: 'Scroll container holding the sections.' },
      { name: 'data-offset', type: 'attr', default: '24', desc: 'Offset (px) for sticky headers.' },
      { name: 'aria-current="true"', type: 'attr', desc: 'Set on the active link (also <code>.active</code>); passed links get <code>data-passed</code>.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ id, link }</code> on the nav.' }
    ]
  });
})();
