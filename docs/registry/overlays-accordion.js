(function () {
  var I = window.__ovI;
  var faq = [
    ['Is it accessible?', 'Yes. It follows the WAI-ARIA accordion pattern: buttons with <code>aria-expanded</code>, labelled regions, and ↑ ↓ Home End to move between headers.'],
    ['Is it styled?', 'It comes with sensible defaults that match the rest of Ranj UI, and every color, radius and duration comes from a design token.'],
    ['Is it animated?', 'Height animates with the CSS grid-rows trick, so content of any size opens smoothly, with no <code>max-height</code> guesswork.'],
    ['Can I open more than one?', 'Add <code>data-multiple</code> to the accordion and items open independently.']
  ];
  function items(list, open) { return list.map(function (f, i) { return '<div class="accordion-item"' + (i === open ? ' data-state="open"' : '') + '><button class="accordion-trigger">' + f[0] + '</button><div class="accordion-content"><div class="accordion-body">' + f[1] + '</div></div></div>'; }).join(''); }
  RanjDocs.add({
    id: 'accordion',
    name: 'Accordion',
    group: 'Navigation',
    description: 'Stacked headings that expand to reveal content, with real height animation (grid-rows trick), single or multiple mode, keyboard navigation and bordered, card and flush styles. v1 markup keeps working.',
    tags: ['js'],
    keywords: ['faq', 'expand', 'collapse', 'disclosure', 'details'],
    demos: [
      {
        title: 'Default',
        center: false,
        html: `<div class="accordion" style="max-width: 34rem; margin: 0 auto">${items(faq, 0)}</div>`,
        css: `.accordion-body code { font-family: var(--font-mono); font-size: .85em; background: var(--muted); padding: .1em .35em; border-radius: 4px; }`
      },
      {
        title: 'Cards with icons (multiple)',
        center: false,
        html: `
<div class="accordion accordion-card" data-multiple style="max-width: 34rem; margin: 0 auto">
  <div class="accordion-item" data-state="open">
    <button class="accordion-trigger"><span class="accordion-icon">${I.card}</span><span class="accordion-title">Billing & payments<span class="accordion-meta" style="display:block">Invoices, cards, refunds</span></span></button>
    <div class="accordion-content"><div class="accordion-body">Invoices are issued on the 1st of each month and paid automatically with the card on file. Refunds land in 5–10 business days.</div></div>
  </div>
  <div class="accordion-item">
    <button class="accordion-trigger"><span class="accordion-icon">${I.shield}</span><span class="accordion-title">Security<span class="accordion-meta" style="display:block">SSO, 2FA, audit logs</span></span></button>
    <div class="accordion-content"><div class="accordion-body">Enforce SAML SSO for every member, require two-factor authentication, and export 12 months of audit logs from Settings → Security.</div></div>
  </div>
  <div class="accordion-item">
    <button class="accordion-trigger"><span class="accordion-icon">${I.users}</span><span class="accordion-title">Team management<span class="accordion-meta" style="display:block">Roles and seats</span></span></button>
    <div class="accordion-content"><div class="accordion-body">Owners can invite members, assign Admin, Editor or Viewer roles, and transfer ownership. Seats are prorated to the day.</div></div>
  </div>
</div>`
      },
      {
        title: 'Flush with plus icon',
        center: false,
        html: `<div class="accordion accordion-flush accordion-plus" style="max-width: 34rem; margin: 0 auto">${items([
          ['How long does shipping take?', 'Orders ship within 24 hours. Standard delivery takes 3–5 business days in the US and 5–9 internationally.'],
          ['What is your return policy?', 'Return anything within 60 days, worn or not. Print a free label from your order page.'],
          ['Do you offer gift wrapping?', 'Yes: add it at checkout for $5. We include a handwritten note if you leave one.']
        ], -1)}</div>`
      }
    ],
    api: [
      { name: '.accordion > .accordion-item', type: 'class', desc: 'Items: <code>.accordion-trigger</code> + <code>.accordion-content</code> &gt; <code>.accordion-body</code> (added if missing).' },
      { name: '.accordion-card / -flush / -plus', type: 'class', desc: 'Separated cards, frameless dividers, plus/minus icon.' },
      { name: '.accordion-icon / .accordion-meta / .accordion-title', type: 'class', desc: 'Leading icon tile, secondary text, title wrapper.' },
      { name: 'data-state="open"', type: 'attr', desc: 'On an item: open initially.' },
      { name: 'data-multiple', type: 'attr', desc: 'Allow several open items (also <code>data-type="multiple"</code>).' },
      { name: 'data-collapsible="false"', type: 'attr', desc: 'Single mode: one item always stays open.' },
      { name: 'Ranj.accordion.toggle(item, open?)', type: 'js', desc: 'Programmatic toggle.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ item, open }</code> on the accordion.' }
    ]
  });
})();
