RanjDocs.add({
  id: 'rating',
  name: 'Rating',
  group: 'Data Display',
  description: 'Read-only star ratings (<code>.stars</code>) from a single CSS variable: any fraction (4.3, 3.5…) fills exactly to the glyph. Sizes, colors, heart/circle shapes, and a review summary with distribution bars. No JavaScript.',
  tags: ['new'],
  keywords: ['stars', 'reviews', 'score', 'star rating', 'read-only rating', 'feedback'],
  demos: [
    {
      title: 'Values and fractions',
      html: `<div style="display:grid;gap:.75rem;justify-items:start">
  <span class="stars-group"><span class="stars" style="--value: 5" role="img" aria-label="Rated 5 out of 5"></span><b>5.0</b></span>
  <span class="stars-group"><span class="stars" style="--value: 4.5" role="img" aria-label="Rated 4.5 out of 5"></span><b>4.5</b></span>
  <span class="stars-group"><span class="stars" style="--value: 3.7" role="img" aria-label="Rated 3.7 out of 5"></span><b>3.7</b></span>
  <span class="stars-group"><span class="stars" style="--value: 2.2" role="img" aria-label="Rated 2.2 out of 5"></span><b>2.2</b></span>
  <span class="stars-group"><span class="stars" style="--value: 1" role="img" aria-label="Rated 1 out of 5"></span><b>1.0</b></span>
</div>`
    },
    {
      title: 'Sizes, colors and shapes',
      html: `<div style="display:grid;gap:.9rem;justify-items:start">
  <span class="stars stars-xs" style="--value: 4.5" role="img" aria-label="4.5 out of 5"></span>
  <span class="stars stars-sm" style="--value: 4.5" role="img" aria-label="4.5 out of 5"></span>
  <span class="stars stars-lg" style="--value: 4.5" role="img" aria-label="4.5 out of 5"></span>
  <span class="stars stars-xl stars-primary" style="--value: 3.5" role="img" aria-label="3.5 out of 5"></span>
  <span class="stars stars-lg stars-heart stars-rose" style="--value: 4" role="img" aria-label="4 out of 5 hearts"></span>
  <span class="stars stars-circle" style="--value: 7; --max: 10" role="img" aria-label="7 out of 10"></span>
</div>`
    },
    {
      title: 'Review summary',
      center: false,
      html: `<div class="rating-summary" style="max-width: 520px; margin: auto">
  <div class="rating-score">
    <strong>4.8</strong>
    <span class="stars" style="--value: 4.8" role="img" aria-label="Rated 4.8 out of 5"></span>
    <small>2,148 verified reviews</small>
  </div>
  <div class="rating-bars">
    <div class="rating-bar"><span>5★</span><div class="rating-bar-track"><i style="--w: 84%"></i></div><span>1,804</span></div>
    <div class="rating-bar"><span>4★</span><div class="rating-bar-track"><i style="--w: 11%"></i></div><span>236</span></div>
    <div class="rating-bar"><span>3★</span><div class="rating-bar-track"><i style="--w: 3%"></i></div><span>64</span></div>
    <div class="rating-bar"><span>2★</span><div class="rating-bar-track"><i style="--w: 1%"></i></div><span>26</span></div>
    <div class="rating-bar"><span>1★</span><div class="rating-bar-track"><i style="--w: 1%"></i></div><span>18</span></div>
  </div>
</div>`
    },
    {
      title: 'In a product card',
      html: `<div class="demo-rating-card">
  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=70&auto=format&fit=crop" alt="Headphones">
  <div>
    <b>Aurora ANC Headphones</b>
    <span class="stars-group"><span class="stars stars-sm" style="--value: 4.6" role="img" aria-label="Rated 4.6 out of 5"></span><b>4.6</b><span>(892)</span></span>
    <strong>$249</strong>
  </div>
</div>`,
      css: `.demo-rating-card { width: 280px; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; background: var(--card); box-shadow: var(--shadow-sm); }
.demo-rating-card img { aspect-ratio: 4/3; width: 100%; object-fit: cover; }
.demo-rating-card > div { padding: 1rem; display: grid; gap: .4rem; }
.demo-rating-card strong { font-size: 1.15rem; }`
    }
  ],
  api: [
    { name: '.stars', type: 'class', desc: 'Star strip. Give it role="img" and an aria-label with the score.' },
    { name: '--value', type: 'var', default: '0', desc: 'Score; fractions fill part of a star.' },
    { name: '--max', type: 'var', default: '5', desc: 'Number of glyphs.' },
    { name: '--size / --gap', type: 'var', default: '1.1rem / .15rem', desc: 'Glyph size and spacing.' },
    { name: '--star-on / --star-off / --star', type: 'var', desc: 'Fill color, empty color, glyph mask (any SVG url).' },
    { name: '.stars-xs / -sm / -lg / -xl', type: 'class', desc: 'Sizes.' },
    { name: '.stars-primary / -success / -rose', type: 'class', desc: 'Fill colors (amber by default).' },
    { name: '.stars-heart / .stars-circle', type: 'class', desc: 'Alternative glyphs.' },
    { name: '.stars-group', type: 'class', desc: 'Inline stars + bold score + muted count.' },
    { name: '.rating-summary / .rating-score / .rating-bars / .rating-bar / .rating-bar-track', type: 'class', desc: 'Review summary with distribution bars (set --w on the bar fill).' }
  ]
});
