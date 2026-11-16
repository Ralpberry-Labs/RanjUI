(function () {
  var items = [
    ['Can I try Northwind before paying?', 'Yes. Every paid plan starts with a 14-day trial with full Pro features. No credit card is needed, and your projects keep running on Hobby if you decide not to upgrade.'],
    ['How does per-seat billing work?', 'You pay for members who can deploy or change settings. Viewers, commenters and guests on preview links are always free. Seats are prorated to the day.'],
    ['What happens if I go over my bandwidth?', 'Nothing breaks. We email you at 80% and 100%, then bill overage at $0.06 per GB. You can set a hard spend cap in Settings → Billing.'],
    ['Do you offer discounts for startups and non-profits?', 'Startups under $5M raised get 50% off Pro for the first year, and registered non-profits get Team for free. <a href="#">Apply here</a>.'],
    ['Where is my data stored?', 'In the region you choose when creating a project: US East, EU Frankfurt or Asia Singapore. Data never leaves that region without your explicit permission.'],
    ['Can I cancel anytime?', 'Of course. Downgrade from the billing page in two clicks; you keep paid features until the end of the current period and get a prorated refund on yearly plans.']
  ];
  function list(n, open) {
    return items.slice(0, n).map(function (it, i) {
      return `      <details${i === 0 && open ? ' open' : ''}>
        <summary>${it[0]}</summary>
        <div class="block-faq-body">${it[1]}</div>
      </details>`;
    }).join('\n');
  }
  RanjDocs.add({
    id: 'faq-block',
    name: 'FAQ',
    group: 'Blocks',
    description: 'Frequently asked questions built on native <details>/<summary>: no JavaScript, keyboard accessible, with an animated plus icon.',
    tags: ['new'],
    keywords: ['questions', 'help', 'details', 'summary', 'accordion section'],
    demos: [
      {
        title: 'Cards',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow">FAQ</span>
      <h2 class="block-title">Questions, answered</h2>
      <p class="block-lead">Everything about plans, billing and data. Can't find it? Chat with us, we reply in about 4 minutes.</p>
    </div>
    <div class="block-faq">
${list(5, true)}
    </div>
  </div>
</section>`
      },
      {
        title: 'Split with contact',
        description: 'Add <code>.block-faq-flush</code> for divider-only rows.',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container block-faq-split">
    <div>
      <div class="block-head block-head-start" style="margin-bottom:0">
        <h2 class="block-title">Frequently asked questions</h2>
        <p class="block-lead">Billing, security and everything in between.</p>
      </div>
      <div class="block-faq-contact">
        <span class="block-avatar">JL</span>
        <div><b>Still have questions?</b>Talk to Julia from our support team at <a href="#">help@northwind.dev</a>.</div>
      </div>
    </div>
    <div class="block-faq block-faq-flush">
${list(6, false)}
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-faq', type: 'class', desc: 'Stack of <details> elements styled as cards.' },
      { name: '.block-faq-flush', type: 'class', desc: 'Divider-only rows instead of cards.' },
      { name: '.block-faq-body', type: 'class', desc: 'Answer content inside each <details>.' },
      { name: '.block-faq-split', type: 'class', desc: 'Heading column + questions column layout.' },
      { name: 'open', type: 'attr', desc: 'Native attribute on <details> to start expanded. Add name="faq" to make them exclusive (Chrome 120+, Safari 17.2+).' }
    ]
  });
})();
