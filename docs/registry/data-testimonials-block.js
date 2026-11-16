(function () {
  var U = function (id) { return 'https://images.unsplash.com/' + id + '?w=160&h=160&fit=crop&crop=faces&q=70'; };
  var star = '<svg viewBox="0 0 24 24"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
  var stars = '<div class="block-stars" aria-label="5 out of 5 stars">' + star + star + star + star + star + '</div>';
  function q(text, name, role, img, logo) {
    return `      <figure class="block-quote">
        ${stars}
        <blockquote>${text}</blockquote>
        <figcaption class="block-person"><img src="${U(img)}" alt="" loading="lazy"><div><b>${name}</b><span>${role}</span></div>${logo ? '<span class="block-person-logo">' + logo + '</span>' : ''}</figcaption>
      </figure>`;
  }
  RanjDocs.add({
    id: 'testimonials-block',
    name: 'Testimonials',
    group: 'Blocks',
    description: 'Social proof sections: a card grid, a masonry wall of love, and a single featured quote.',
    tags: ['new'],
    keywords: ['reviews', 'quotes', 'social proof', 'wall of love', 'customers'],
    demos: [
      {
        title: 'Card grid',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow">Customers</span>
      <h2 class="block-title">Loved by 12,000+ product teams</h2>
    </div>
    <div class="block-testimonials">
${q('We cut our release cycle from two weeks to <mark>twice a day</mark>. Preview links alone changed how design and engineering work together.', 'Maya Patel', 'VP Engineering', 'photo-1494790108377-be9c29b29330', 'Lumen')}
${q('Migrating 140 services took a weekend, not a quarter. Support answered every question in under an hour, including on Sunday.', 'Daniel Okafor', 'Staff Engineer', 'photo-1500648767791-00dcc994a43e', 'Fathom')}
${q('Our p95 latency in Asia dropped by <mark>61%</mark> the day we switched. Customers noticed before we announced it.', 'Sofia Lindqvist', 'CTO', 'photo-1438761681033-6461ffad8d80', 'Arcade')}
    </div>
  </div>
</section>`
      },
      {
        title: 'Wall of love',
        description: 'CSS multi-column masonry; cards keep their natural height.',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container">
    <div class="block-head">
      <h2 class="block-title">Don't take our word for it</h2>
      <p class="block-lead">Here is what builders say after their first month.</p>
    </div>
    <div class="block-wall">
${q('Honestly the best developer experience I have had since I started coding. It just gets out of the way.', 'Leo Martins', 'Indie hacker', 'photo-1507003211169-0a1dd7228f2d')}
${q('The analytics replaced three tools and saved us $2,400 a month. Our finance team sent a thank-you note.', 'Priya Raman', 'Head of Growth, Kite', 'photo-1544005313-94ddf0286df2')}
${q('Rollbacks are instant. We deploy on Fridays now and nobody panics.', 'Marcus Chen', 'Platform Lead', 'photo-1506794778202-cad84cf45f1d')}
${q('I onboarded our whole agency of 35 people in an afternoon. Permissions finally make sense, and client previews look professional out of the box.', 'Hannah Becker', 'Founder, Studio Nord', 'photo-1534528741775-53994a69daeb')}
${q('Their changelog is my favourite thing to read on Tuesdays.', 'Tomás Rivera', 'Frontend Engineer', 'photo-1472099645785-5658abf4ff4e')}
${q('Edge functions with zero cold starts. We moved our auth middleware over and shaved 180 ms off every page.', 'Aisha Khan', 'Senior SRE', 'photo-1517841905240-472988babdf9')}
    </div>
  </div>
</section>`
      },
      {
        title: 'Featured quote',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <figure class="block-quote-hero">
      <svg class="block-quote-mark" viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 6C6 7.4 4 10.3 4 14v4h6v-6H7c0-2.2 1.1-3.8 3.3-4.8zm10 0C16 7.4 14 10.3 14 14v4h6v-6h-3c0-2.2 1.1-3.8 3.3-4.8z"/></svg>
      <blockquote>“Northwind is the rare tool that made our engineers faster <span class="block-gradient-text">and</span> our infrastructure bill smaller. It paid for itself in the first month.”</blockquote>
      <figcaption class="block-person"><img src="${U('photo-1539571696357-5a69c17a67c6')}" alt=""><div><b>Ethan Brooks</b><span>Co-founder &amp; CEO, Parcel</span></div></figcaption>
    </figure>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-testimonials', type: 'class', desc: 'Responsive 3 / 2 / 1 column grid.' },
      { name: '.block-wall', type: 'class', desc: 'Masonry columns (min 17rem each).' },
      { name: '.block-quote', type: 'class', desc: 'Testimonial card (figure). Use <mark> inside the blockquote to highlight a phrase.' },
      { name: '.block-stars', type: 'class', desc: 'Row of star SVGs.' },
      { name: '.block-person', type: 'class', desc: 'Avatar + name + role; optional .block-person-logo on the right.' },
      { name: '.block-quote-hero', type: 'class', desc: 'Large centered single quote.' }
    ]
  });
})();
