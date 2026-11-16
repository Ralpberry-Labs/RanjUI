(function () {
  var I = RB.ic, F = RB.face;
  var stars = '<span class="quote-stars" aria-label="5 out of 5 stars">' + [1, 2, 3, 4, 5].map(function () { return I('star'); }).join('') + '</span>';
  RanjDocs.add({
    id: 'blockquote',
    name: 'Blockquote',
    group: 'Base',
    description: 'Pull quotes and testimonial cards, from a simple bordered quote to a featured customer story.',
    tags: ['new'],
    keywords: ['quote', 'testimonial', 'review', 'pull quote', 'citation'],
    demos: [
      {
        title: 'Blockquote',
        center: false,
        html: `<blockquote class="blockquote" style="max-width:36rem;margin:0 auto">
  <p>Simplicity is about subtracting the obvious and adding the meaningful.</p>
  <cite>John Maeda, The Laws of Simplicity</cite>
</blockquote>`
      },
      {
        title: 'Pull quote',
        html: `<figure class="stack gap-4" style="max-width:40rem;align-items:center;text-align:center">
  <blockquote class="blockquote-lg">We replaced three internal UI kits with Ranj UI and shipped our redesign <span class="gradient-text">six weeks early</span>.</blockquote>
  <figcaption class="avatar-label"><img class="avatar" src="${F(30)}" alt=""><div style="text-align:left"><b>Priya Raman</b><span>VP Design, Northwind</span></div></figcaption>
</figure>`,
        height: 300
      },
      {
        title: 'Testimonial cards',
        center: false,
        html: `<div class="grid grid-auto" style="--min:240px;align-items:stretch">
  <figure class="quote-card">
    ${stars}
    <blockquote>The dark mode is the best I've seen in any library. We didn't change a single color.</blockquote>
    <figcaption><img class="avatar" src="${F(200)}" alt=""><div><b>Marcus Chen</b><span>Founder, Tally</span></div></figcaption>
  </figure>
  <figure class="quote-card quote-card-featured">
    <blockquote>Setup took <mark>eleven minutes</mark>. Our designers finally stopped filing "button looks off" tickets.</blockquote>
    <figcaption><span class="avatar avatar-gradient" style="--avatar-hue:330">SO</span><div><b>Sofia Ortega</b><span>Design lead, Fieldnote</span></div></figcaption>
  </figure>
  <figure class="quote-card">
    ${stars}
    <blockquote>Zero dependencies meant our security review took an afternoon instead of a sprint.</blockquote>
    <figcaption><img class="avatar" src="${F(100)}" alt=""><div><b>Daniel Okafor</b><span>CTO, Ledgerly</span></div></figcaption>
  </figure>
</div>`
      }
    ],
    api: [
      { name: '.blockquote', type: 'class', desc: 'Quote with a brand rule. <code>cite</code> or <code>footer</code> for attribution.' },
      { name: '.blockquote-lg', type: 'class', desc: 'Large display pull quote with an opening mark.' },
      { name: '.blockquote-plain', type: 'class', desc: 'Italic, no rule.' },
      { name: '.quote-card', type: 'class', desc: 'Testimonial card; featured adds a brand tint and larger type. Also: <code>.quote-card-featured</code>' },
      { name: '.quote-stars', type: 'class', desc: 'Star rating row (filled SVGs).' }
    ]
  });
})();
