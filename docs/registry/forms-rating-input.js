RanjDocs.add({
  id: 'rating-input',
  name: 'Rating',
  group: 'Forms',
  description: 'Star (or heart) rating with hover preview, half steps, keyboard control as a <code>role="slider"</code>, word labels and a read-only display mode with partial fills.',
  tags: ['new', 'js'],
  keywords: ['stars', 'star rating', 'review', 'score', 'feedback', 'hearts'],
  demos: [
    {
      title: 'Leave a review',
      description: 'Hover to preview, click to set, click again to clear. Arrow keys and number keys work when focused.',
      html: `
<div class="demo-rating-card">
  <b>How was your stay at The Ludlow?</b>
  <div class="rating rating-lg" data-value="4" data-labels="Terrible|Poor|Okay|Great|Exceptional" data-name="score" aria-label="Your rating"></div>
</div>`,
      css: `.demo-rating-card { display: grid; gap: .75rem; justify-items: center; padding: 1.5rem; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-sm); }`
    },
    {
      title: 'Half steps, hearts and sizes',
      html: `
<div style="display:grid;gap:1rem;justify-items:center">
  <div class="rating" data-half data-value="3.5" data-show-value aria-label="Half-star rating"></div>
  <div class="rating rating-heart" data-icon="heart" data-value="2" data-max="5" aria-label="Love"></div>
  <div class="rating rating-sm rating-primary" data-value="3" data-max="10" aria-label="Out of ten"></div>
</div>`
    },
    {
      title: 'Read-only',
      html: `
<div class="demo-rating-row">
  <div class="rating rating-sm" data-readonly data-value="4.7" aria-label="Average rating"></div>
  <b>4.7</b><span>· 2,318 reviews</span>
</div>`,
      css: `.demo-rating-row { display: flex; align-items: center; gap: .45rem; font-size: .85rem; } .demo-rating-row span { color: var(--muted-fg); }`
    }
  ],
  api: [
    { name: '.rating', type: 'class', desc: 'Rating control. <code>.rating-sm</code>, <code>.rating-lg</code>, <code>.rating-heart</code>, <code>.rating-primary</code>.' },
    { name: 'data-value / data-max', type: 'attr', default: '0 / 5', desc: 'Current and maximum value.' },
    { name: 'data-half', type: 'attr', desc: 'Allow .5 steps (click the left half of a star).' },
    { name: 'data-readonly', type: 'attr', desc: 'Display only; any fraction renders as a partial fill.' },
    { name: 'data-labels', type: 'attr', desc: '<code>|</code>-separated words per star, shown beside and announced.' },
    { name: 'data-show-value / data-icon="heart" / data-clearable="false" / data-name', type: 'attr', desc: 'Show “3.5 / 5”, heart icons, prevent clearing, hidden input.' },
    { name: '--size / --on / --off', type: 'var', desc: 'Icon size and colors.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value, label }</code>' }
  ]
});
