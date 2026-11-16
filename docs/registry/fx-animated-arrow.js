RanjDocs.add({
  id: 'animated-arrow',
  name: 'Animated Arrows',
  group: 'Micro-interactions',
  description: 'Link and button arrows that nudge, grow a shaft, or fly out while a fresh arrow slides in. CSS only.',
  tags: ['new', 'fx'],
  keywords: ['arrow', 'link arrow', 'hover arrow', 'cta', 'chevron nudge'],
  demos: [
    { title: 'Link arrows', description: 'Hover each link.', html: `
<a class="arrow-link" href="#">Read the case study <svg viewBox="0 0 16 16"><path class="al-line" d="M2 8h10"/><path class="al-head" d="M8 3.5 12.5 8 8 12.5"/></svg></a>
<a class="arrow-link arrow-link-underline" href="#">View pricing <svg viewBox="0 0 16 16"><path class="al-line" d="M2 8h10"/><path class="al-head" d="M8 3.5 12.5 8 8 12.5"/></svg></a>
<a class="arrow-link" href="#" style="color:var(--fg)">Open in new tab <span class="arrow-swap"><svg viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M5.5 4.5h6v6"/></svg><svg viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M5.5 4.5h6v6"/></svg></span></a>` },
    { title: 'Buttons', html: `
<a class="arrow-pill" href="#">Start building <span class="arrow-swap-wrap"><span class="arrow-swap arrow-swap-x" style="width:15px;height:15px"><svg viewBox="0 0 16 16"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg><svg viewBox="0 0 16 16"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg></span></span></a>
<button class="arrow-circle" aria-label="Next"><span class="arrow-swap arrow-swap-x"><svg viewBox="0 0 16 16"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg><svg viewBox="0 0 16 16"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg></span></button>
<button class="arrow-circle" aria-label="Open"><span class="arrow-swap"><svg viewBox="0 0 16 16"><path d="M4 12 12 4M5 4h7v7"/></svg><svg viewBox="0 0 16 16"><path d="M4 12 12 4M5 4h7v7"/></svg></span></button>` },
    { title: 'Feature card', height: 260, html: `
<a href="#" class="demo-arrow-card">
  <small>Guide</small>
  <b>Migrating from v1 to v2</b>
  <p>Every renamed class and attribute, with a codemod that does 90% of the work.</p>
  <span class="arrow-link">Start the guide <svg viewBox="0 0 16 16"><path class="al-line" d="M2 8h10"/><path class="al-head" d="M8 3.5 12.5 8 8 12.5"/></svg></span>
</a>`, css: `
.demo-arrow-card { display: grid; gap: .35rem; width: min(340px, 100%); padding: 1.2rem 1.3rem; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); color: var(--fg); transition: border-color .2s, box-shadow .2s, transform .2s; }
.demo-arrow-card:hover { text-decoration: none; border-color: var(--primary); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.demo-arrow-card small { color: var(--muted-fg); } .demo-arrow-card p { color: var(--muted-fg); font-size: .9rem; }
.demo-arrow-card:hover .al-line { opacity: 1; transform: scaleX(1); } .demo-arrow-card:hover .al-head { transform: translateX(1px); }` }
  ],
  api: [
    { name: '.arrow-link', type: 'class', desc: 'Link with an arrow whose shaft grows on hover (<code>.al-line</code> + <code>.al-head</code> paths).' },
    { name: '.arrow-link-underline', type: 'class', desc: 'Adds an underline that grows from the left.' },
    { name: '.arrow-swap / .arrow-swap-x', type: 'class', desc: 'Two stacked SVGs: the first flies out diagonally (or sideways) and the second slides in.' },
    { name: '.arrow-circle / .arrow-pill', type: 'class', desc: 'Ready-made circular and pill buttons.' }
  ]
});
