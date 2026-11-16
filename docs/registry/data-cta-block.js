(function () {
  var arrow = '<svg class="block-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  RanjDocs.add({
    id: 'cta-block',
    name: 'Call to Action',
    group: 'Blocks',
    description: 'Closing call-to-action sections: a glowing gradient panel and a split newsletter / signup card.',
    tags: ['new'],
    keywords: ['cta', 'signup', 'newsletter', 'banner', 'conversion'],
    demos: [
      {
        title: 'Gradient panel',
        description: 'Follows the brand hue; try another accent in the theme customizer.',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-cta">
      <h2 class="block-title">Ship your next release this afternoon</h2>
      <p class="block-lead">Join 18,000 teams deploying on Northwind. Import a repository and go live in under a minute.</p>
      <div class="block-actions" style="margin-top:.75rem">
        <a class="block-btn block-btn-lg" href="#">Start building free ${arrow}</a>
        <a class="block-btn block-btn-lg block-btn-glass" href="#">Talk to sales</a>
      </div>
      <p class="block-cta-fine">Free forever on Hobby · No credit card required</p>
    </div>
  </div>
</section>`
      },
      {
        title: 'Split signup',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container">
    <div class="block-cta-split">
      <div class="block-head block-head-start" style="margin:0">
        <span class="block-eyebrow">Newsletter</span>
        <h2 class="block-title">The Friday Deploy</h2>
        <p class="block-lead">One email a week with product updates, performance tips and the best things our community built. 41,000 readers.</p>
      </div>
      <form class="demo-cta-block-form">
        <div class="block-form">
          <input class="block-input" type="email" placeholder="you@company.com" aria-label="Email address" required>
          <button class="block-btn block-btn-primary block-btn-lg" type="submit">Subscribe</button>
        </div>
        <p class="block-form-note">No spam. Unsubscribe with one click.</p>
      </form>
    </div>
  </div>
</section>`,
        js: `const form = root.querySelector('form');
form.addEventListener('submit', e => { e.preventDefault(); form.querySelector('button').textContent = 'Subscribed ✓'; });`
      }
    ],
    api: [
      { name: '.block-cta', type: 'class', desc: 'Centered gradient panel tinted by --hue; white buttons inside.' },
      { name: '.block-btn-glass', type: 'class', desc: 'Translucent secondary button for use on .block-cta.' },
      { name: '.block-cta-split', type: 'class', desc: 'Two-column card: copy + form.' },
      { name: '.block-form / .block-input', type: 'class', desc: 'Inline email form that wraps on narrow widths.' },
      { name: '.block-btn (+ -primary, -dark, -ghost, -lg, -block)', type: 'class', desc: 'Self-contained buttons used across all blocks.' }
    ]
  });
})();
