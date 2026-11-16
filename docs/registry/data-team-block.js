(function () {
  var U = function (id, w, h) { return 'https://images.unsplash.com/' + id + '?w=' + w + '&h=' + h + '&fit=crop&crop=faces&q=70'; };
  var X = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.4L5.4 21H2.3l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.3 4.7H5.5z"/></svg>';
  var IN = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/></svg>';
  var people = [
    ['Maya Patel', 'Co-founder & CEO', 'photo-1494790108377-be9c29b29330', 'Previously led payments at Stripe Europe.'],
    ['Daniel Okafor', 'Co-founder & CTO', 'photo-1500648767791-00dcc994a43e', 'Built the edge runtime behind 4B requests a month.'],
    ['Sofia Lindqvist', 'Head of Design', 'photo-1438761681033-6461ffad8d80', 'Design systems at Spotify and Linear.'],
    ['Marcus Chen', 'VP Engineering', 'photo-1506794778202-cad84cf45f1d', 'Scaled infra teams from 4 to 60 engineers.'],
    ['Priya Raman', 'Head of Growth', 'photo-1544005313-94ddf0286df2', 'Grew Kite from 0 to 2M users.'],
    ['Leo Martins', 'Developer Advocate', 'photo-1507003211169-0a1dd7228f2d', 'Writes the changelog everyone reads.'],
    ['Hannah Becker', 'Customer Success', 'photo-1534528741775-53994a69daeb', 'Average first reply: 4 minutes.']
  ];
  function card(p) {
    return `      <article class="block-member">
        <div class="block-member-photo"><img src="${U(p[2], 400, 500)}" alt="${p[0]}" loading="lazy">
          <div class="block-member-social"><a href="#" aria-label="${p[0]} on X">${X}</a><a href="#" aria-label="${p[0]} on LinkedIn">${IN}</a></div>
        </div>
        <b>${p[0]}</b><span>${p[1]}</span>
        <p>${p[3]}</p>
      </article>`;
  }
  RanjDocs.add({
    id: 'team-block',
    name: 'Team',
    group: 'Blocks',
    description: 'Meet-the-team sections: portrait cards with hover-revealed social links, and a compact list.',
    tags: ['new'],
    keywords: ['people', 'about us', 'staff', 'members'],
    demos: [
      {
        title: 'Portrait grid',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow">Our team</span>
      <h2 class="block-title">The people behind Northwind</h2>
      <p class="block-lead">A remote team of 38 across 14 countries. We obsess over speed, craft and answering support tickets ourselves.</p>
    </div>
    <div class="block-team">
${people.slice(0, 7).map(card).join('\n')}
      <a class="block-hiring" href="#"><b>You?</b>We're hiring for 6 roles.<span>See open positions →</span></a>
    </div>
  </div>
</section>`
      },
      {
        title: 'Compact list',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container">
    <div class="block-head block-head-start">
      <h2 class="block-title">Leadership</h2>
    </div>
    <div class="block-team block-team-compact">
${people.slice(0, 6).map(function (p) { return `      <div class="block-member"><img src="${U(p[2], 120, 120)}" alt=""><b>${p[0]}</b><span>${p[1]}</span></div>`; }).join('\n')}
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-team', type: 'class', desc: 'Responsive 4 / 3 / 2 column grid.' },
      { name: '.block-member', type: 'class', desc: 'Person: .block-member-photo, <b> name, <span> role, optional <p> bio.' },
      { name: '.block-member-social', type: 'class', desc: 'Links revealed on hover / focus inside the photo.' },
      { name: '.block-team-compact', type: 'class', desc: 'Avatar-left rows in bordered tiles.' },
      { name: '.block-hiring', type: 'class', desc: 'Dashed “we are hiring” tile.' }
    ]
  });
})();
