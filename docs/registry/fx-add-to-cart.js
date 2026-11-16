RanjDocs.add({
  id: 'add-to-cart',
  name: 'Add to Cart',
  group: 'Micro-interactions',
  description: 'A cart rolls in, catches a falling box, wobbles and drives off. The header cart badge bumps with the new count.',
  tags: ['new', 'fx', 'js'],
  keywords: ['cart', 'shopping', 'ecommerce', 'add to bag', 'badge'],
  demos: [
    { title: 'Product card', height: 420, html: `
<div class="demo-cart-shop">
  <header><b>Fieldnotes</b><span class="demo-cart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M2.5 3.5h2.6l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.1l1.7-6.8H6"/></svg><span class="demo-cart-badge" id="add-to-cart-badge">2</span></span></header>
  <div class="demo-cart-img"></div>
  <div class="demo-cart-body">
    <div><b>Linen Weekender Bag</b><small>Natural · 32L</small></div><b style="font-size:1.1rem">$148</b>
  </div>
  <button class="fxb cart-btn" data-cart-target="#add-to-cart-badge" style="width:calc(100% - 2rem);margin:0 1rem 1rem">
    <span class="fxb-icon"><svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M2.5 3.5h2.6l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.1l1.7-6.8H6"/></svg><svg class="fxb-check" viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
    <span class="fxb-texts"><span data-for="idle">Add to cart</span><span data-for="done">Added to cart</span></span>
    <svg class="cart-btn-cart" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M2.5 3.5h2.6l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.1l1.7-6.8H6"/></svg><span class="cart-btn-box"></span>
  </button>
</div>`, css: `
.demo-cart-shop { width: min(300px, 100%); border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); overflow: hidden; }
.demo-cart-shop header { display: flex; justify-content: space-between; align-items: center; padding: .7rem 1rem; border-bottom: 1px solid var(--border); }
.demo-cart-icon { position: relative; width: 22px; height: 22px; } .demo-cart-icon svg { width: 22px; height: 22px; }
.demo-cart-badge { position: absolute; top: -7px; right: -9px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: var(--primary); color: var(--primary-fg); font-size: .65rem; font-weight: 700; line-height: 18px; text-align: center; display: inline-block; }
.demo-cart-img { height: 140px; background: radial-gradient(30% 40% at 50% 55%, #d6c3a3, transparent 70%), linear-gradient(160deg, #f5efe6, #e7dccb); }
[data-theme="dark"] .demo-cart-img { background: radial-gradient(30% 40% at 50% 55%, #8a7658, transparent 70%), linear-gradient(160deg, #2a251f, #1c1915); }
.demo-cart-body { display: flex; gap: .75rem; justify-content: space-between; align-items: flex-start; padding: .9rem 1rem; }
.demo-cart-body small { display: block; color: var(--muted-fg); font-size: .8rem; }` }
  ],
  api: [
    { name: '.fxb.cart-btn', type: 'class', desc: 'Contains <code>.fxb-icon</code>, <code>.fxb-texts</code>, the animated <code>.cart-btn-cart</code> SVG and <code>.cart-btn-box</code>.' },
    { name: 'data-cart-target', type: 'attr', desc: 'Selector of a badge; its number increments and it gets <code>.cart-badge-bump</code>.' },
    { name: 'data-duration / data-manual / data-reset', type: 'attr', desc: 'See Send Button.' },
    { name: '.cart-badge-bump', type: 'class', desc: 'Bump animation you can use on any badge.' }
  ]
});
