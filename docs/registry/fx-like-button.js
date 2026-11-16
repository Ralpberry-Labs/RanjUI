RanjDocs.add({
  id: 'like-button',
  name: 'Like Button',
  group: 'Micro-interactions',
  description: 'A heart that pops, rings and bursts into colorful particles while the count rolls up.',
  tags: ['new', 'fx', 'js'],
  keywords: ['heart', 'favorite', 'like', 'love', 'burst', 'social'],
  demos: [
    { title: 'On a post', height: 360, html: `
<article class="demo-like-post">
  <header><span class="demo-like-av">MK</span><div><b>Maya Kobayashi</b><small>2h · Kyoto</small></div></header>
  <div class="demo-like-img"></div>
  <p>First snow at Kinkaku-ji this morning. Worth the 5am alarm.</p>
  <footer>
    <button class="like-btn" aria-label="Like"><span class="like-btn-count">1,284</span></button>
    <button class="bookmark-btn" aria-label="Save"><span class="bookmark-btn-label"><span>Save</span><span>Saved</span></span></button>
  </footer>
</article>`, css: `
.demo-like-post { width: min(380px, 100%); border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); overflow: hidden; }
.demo-like-post header { display: flex; align-items: center; gap: .65rem; padding: .85rem 1rem; }
.demo-like-post header b { display: block; font-size: .9rem; } .demo-like-post header small { color: var(--muted-fg); font-size: .75rem; }
.demo-like-av { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; font-size: .75rem; font-weight: 700; color: #fff; background: linear-gradient(135deg, #f472b6, #8b5cf6); }
.demo-like-img { height: 150px; background: radial-gradient(40% 50% at 70% 30%, #fff8, transparent), linear-gradient(160deg, #93c5fd, #c4b5fd 50%, #fbcfe8); }
.demo-like-post p { padding: .8rem 1rem .2rem; font-size: .9rem; }
.demo-like-post footer { display: flex; justify-content: space-between; padding: .3rem .5rem .6rem; }` },
    { title: 'Sizes and colors', html: `<button class="like-btn" aria-label="Like"></button>
<button class="like-btn" aria-pressed="true" aria-label="Like"><span class="like-btn-count">42</span></button>
<button class="like-btn like-btn-lg" style="--on:#8b5cf6" aria-label="Like"><span class="like-btn-count">9,999</span></button>` }
  ],
  api: [
    { name: '.like-btn', type: 'class', desc: 'A <code>&lt;button&gt;</code>. The heart is injected; add <code>.like-btn-count</code> for a rolling count.' },
    { name: '.like-btn-lg', type: 'class', desc: 'Larger heart.' },
    { name: 'aria-pressed', type: 'attr', default: 'false', desc: 'Liked state.' },
    { name: '--on', type: 'var', default: '#f43f5e', desc: 'Liked color (particles follow it).' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { pressed }' }
  ]
});
