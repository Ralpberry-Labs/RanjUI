(function () {
  var arrow = '<svg class="block-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var spark = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/></svg>';
  RanjDocs.add({
    id: 'pricing-block',
    name: 'Pricing',
    group: 'Blocks',
    description: 'Three-tier pricing section with an animated monthly / yearly switch, a highlighted plan, feature checklists and a comparison table.',
    tags: ['new', 'js'],
    keywords: ['pricing table', 'plans', 'tiers', 'billing toggle', 'subscription'],
    demos: [
      {
        title: 'Three tiers with billing toggle',
        description: 'Any element inside <code>.block-pricing</code> with <code>data-monthly</code> / <code>data-yearly</code> swaps its text when the period changes.',
        pad: false, center: false,
        html: `<section class="block block-pricing" data-period="monthly">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow"><span class="block-eyebrow-dot"></span>Pricing</span>
      <h2 class="block-title">Simple pricing that scales with your team</h2>
      <p class="block-lead">Start free, upgrade when you ship. Every plan includes unlimited projects, SSL and global edge caching.</p>
    </div>
    <div class="block-pricing-center">
      <div class="block-pricing-toggle">
        <button type="button" data-period="monthly">Monthly</button>
        <button type="button" data-period="yearly">Yearly <span class="block-save">-20%</span></button>
      </div>
    </div>
    <div class="block-pricing-grid">
      <article class="block-plan">
        <div>
          <div class="block-plan-name">Hobby</div>
          <p class="block-plan-desc">For side projects and weekend experiments.</p>
        </div>
        <div>
          <div class="block-plan-price"><span class="block-plan-amount">$0</span><span class="block-plan-per">/ month</span></div>
          <p class="block-plan-note">Free forever, no card needed</p>
        </div>
        <a class="block-btn block-btn-block" href="#">Start for free</a>
        <hr>
        <ul class="block-checks">
          <li>3 projects, 1 seat</li>
          <li>100 GB bandwidth</li>
          <li>Community support</li>
          <li class="is-off">Preview environments</li>
          <li class="is-off">SSO &amp; audit log</li>
        </ul>
      </article>
      <article class="block-plan block-plan-featured">
        <span class="block-plan-tag">Most popular</span>
        <div>
          <div class="block-plan-name">Pro ${spark}</div>
          <p class="block-plan-desc">For growing products that need room to breathe.</p>
        </div>
        <div>
          <div class="block-plan-price"><span class="block-plan-amount" data-monthly="$29" data-yearly="$24">$29</span><span class="block-plan-per">/ seat / month</span></div>
          <p class="block-plan-note" data-monthly="Billed monthly, cancel anytime" data-yearly="$288 billed yearly, save $60">Billed monthly, cancel anytime</p>
        </div>
        <a class="block-btn block-btn-primary block-btn-block" href="#">Start 14-day trial ${arrow}</a>
        <hr>
        <ul class="block-checks">
          <li>Unlimited projects</li>
          <li>1 TB bandwidth</li>
          <li>Preview environments for every PR</li>
          <li>Email support, 24h response</li>
          <li class="is-off">SSO &amp; audit log</li>
        </ul>
      </article>
      <article class="block-plan">
        <div>
          <div class="block-plan-name">Team</div>
          <p class="block-plan-desc">For companies with security and compliance needs.</p>
        </div>
        <div>
          <div class="block-plan-price"><span class="block-plan-amount" data-monthly="$79" data-yearly="$66">$79</span><span class="block-plan-per">/ seat / month</span></div>
          <p class="block-plan-note" data-monthly="Billed monthly" data-yearly="$792 billed yearly, save $156">Billed monthly</p>
        </div>
        <a class="block-btn block-btn-dark block-btn-block" href="#">Contact sales</a>
        <hr>
        <ul class="block-checks">
          <li>Everything in Pro</li>
          <li>10 TB bandwidth</li>
          <li>SAML SSO &amp; SCIM</li>
          <li>Audit log, 1-year retention</li>
          <li>99.99% uptime SLA</li>
        </ul>
      </article>
    </div>
  </div>
</section>`,
        js: `root.querySelector('.block-pricing').addEventListener('ranj:change', e => console.log('period', e.detail.period));`
      },
      {
        title: 'Plan comparison',
        description: 'A comparison table that scrolls horizontally inside its own wrapper on narrow screens.',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container">
    <div class="block-head">
      <h2 class="block-title">Compare every feature</h2>
      <p class="block-lead">All the details, side by side.</p>
    </div>
    <div class="block-compare-wrap">
      <table class="block-compare">
        <thead><tr><th>Feature</th><th>Hobby</th><th>Pro</th><th>Team</th></tr></thead>
        <tbody>
          <tr><th>Projects</th><td>3</td><td>Unlimited</td><td>Unlimited</td></tr>
          <tr><th>Bandwidth</th><td>100 GB</td><td>1 TB</td><td>10 TB</td></tr>
          <tr><th>Build minutes</th><td>6,000</td><td>24,000</td><td>Custom</td></tr>
          <tr><th>Preview environments</th><td class="no">—</td><td class="yes">✓</td><td class="yes">✓</td></tr>
          <tr><th>Password protection</th><td class="no">—</td><td class="yes">✓</td><td class="yes">✓</td></tr>
          <tr><th>SAML SSO &amp; SCIM</th><td class="no">—</td><td class="no">—</td><td class="yes">✓</td></tr>
          <tr><th>Uptime SLA</th><td class="no">—</td><td>99.9%</td><td>99.99%</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-pricing', type: 'class', desc: 'Section root; mounts the period toggle.' },
      { name: '.block-pricing-toggle', type: 'class', desc: 'Segmented switch holding buttons with data-period. A sliding thumb is inserted automatically.' },
      { name: '.block-plan / .block-plan-featured', type: 'class', desc: 'Plan card / highlighted plan with glow.' },
      { name: '.block-plan-tag', type: 'class', desc: 'Floating “Most popular” label on a plan.' },
      { name: '.block-checks', type: 'class', desc: 'Checklist; add .is-off to an item for an excluded feature.' },
      { name: '.block-compare-wrap / .block-compare', type: 'class', desc: 'Scrollable comparison table. Use td.yes / td.no.' },
      { name: 'data-period', type: 'attr', default: 'monthly', desc: 'Current period on .block-pricing; any name works (matches data-<period> on values).' },
      { name: 'data-monthly / data-yearly', type: 'attr', desc: 'Text shown for each period on any descendant.' },
      { name: 'el.blockPricing.set(period)', type: 'js', desc: 'Switch period programmatically.' },
      { name: 'ranj:change', type: 'event', desc: 'detail: { period }' }
    ]
  });
})();
