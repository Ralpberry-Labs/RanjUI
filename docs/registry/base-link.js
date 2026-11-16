(function () {
  RanjDocs.add({
    id: 'link',
    name: 'Link',
    group: 'Base',
    description: 'Text link styles: classic underline, animated draw-in, center-out, highlighter sweep, arrow and external.',
    tags: ['new'],
    keywords: ['anchor', 'a', 'href', 'underline', 'hyperlink', 'hover underline'],
    demos: [
      {
        title: 'Styles',
        center: false,
        description: 'Hover each one.',
        html: `<div class="demo-link-grid">
  <a class="link" href="#">Classic underline</a>
  <a class="link-underline" href="#">Draws in from the left</a>
  <a class="link-center" href="#">Grows from the center</a>
  <a class="link-highlight" href="#">Highlighter sweep</a>
  <a class="link-arrow" href="#">Read the changelog</a>
  <a class="link link-external" href="#" target="_blank" rel="noopener">GitHub repository</a>
  <a class="link link-muted" href="#">Muted link</a>
  <a class="link-underline link-primary" href="#">Primary animated</a>
</div>`,
        css: '.demo-link-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem 2rem; width: 100%; max-width: 40rem; margin: 0 auto; }\n.demo-link-grid > a { justify-self: start; }'
      },
      {
        title: 'In copy',
        center: false,
        html: `<p style="max-width:36rem;margin:0 auto">By continuing you agree to our <a class="link link-fg" href="#">Terms of Service</a> and <a class="link link-fg" href="#">Privacy Policy</a>. Questions? <a class="link-underline link-primary" href="#">Talk to a human</a> or browse the <a class="link-highlight" href="#">help center</a>.</p>`
      },
      {
        title: 'Footer links',
        center: false,
        html: `<nav class="cluster" style="--gap:1.5rem;justify-content:center" aria-label="Footer">
  <a class="link-underline link-muted small" style="--link-color:var(--muted-fg)" href="#">Pricing</a>
  <a class="link-underline small" style="--link-color:var(--muted-fg)" href="#">Docs</a>
  <a class="link-underline small" style="--link-color:var(--muted-fg)" href="#">Changelog</a>
  <a class="link-underline small" style="--link-color:var(--muted-fg)" href="#">Careers</a>
  <a class="link-underline small" style="--link-color:var(--muted-fg)" href="#">Status</a>
</nav>`
      }
    ],
    api: [
      { name: '.link', type: 'class', desc: 'Underlined brand link. <code>.link-muted</code>, <code>.link-fg</code>, <code>.link-plain</code>.' },
      { name: '.link-underline', type: 'class', desc: 'Underline draws in on hover (<code>.link-animated</code> alias). Add <code>.link-primary</code> for brand color.' },
      { name: '.link-center', type: 'class', desc: 'Underline grows from the center.' },
      { name: '.link-highlight', type: 'class', desc: 'Highlighter bar sweeps up behind the text.' },
      { name: '.link-arrow / .link-external', type: 'class', desc: 'Trailing → or ↗ that nudges on hover.' },
      { name: '--link-color / --link-line', type: 'var', desc: 'Text and underline color.' }
    ]
  });
})();
