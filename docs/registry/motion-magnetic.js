RanjDocs.add({
  id: 'magnetic',
  name: 'Magnetic',
  group: 'Interactions',
  description: 'Elements are pulled toward the cursor when it comes near, then spring back. An optional inner layer travels further for a parallax feel.',
  tags: ['new', 'fx', 'js'],
  keywords: ['magnet', 'cursor pull', 'attract', 'hover follow', 'button'],
  demos: [
    {
      title: 'Buttons',
      height: 260,
      html: `
<div class="demo-magnetic-btns">
  <button class="btn btn-primary btn-lg" data-magnetic><span data-magnetic-inner>Get started →</span></button>
  <button class="btn btn-outline btn-lg" data-magnetic="0.5" data-magnetic-area="100">Stronger pull</button>
</div>`,
      css: `.demo-magnetic-btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 4rem 7rem; }`
    },
    {
      title: 'Social icons',
      height: 220,
      html: `
<div class="demo-magnetic-row">
  <a href="#" onclick="return false" class="demo-magnetic-ic" data-magnetic="0.45" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg></a>
  <a href="#" onclick="return false" class="demo-magnetic-ic" data-magnetic="0.45" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg></a>
  <a href="#" onclick="return false" class="demo-magnetic-ic" data-magnetic="0.45" aria-label="Dribbble"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><path d="M5 5.5c4 4 9.5 5 16 4M3 13c5-2 11-1.5 15.5 6.5M8.5 3.2c3 3.8 5.5 10 6.3 17.7"/></svg></a>
  <a href="#" onclick="return false" class="demo-magnetic-ic" data-magnetic="0.45" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg></a>
</div>`,
      css: `.demo-magnetic-row { display: flex; gap: 1.25rem; }
.demo-magnetic-ic { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; color: var(--fg); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-md); transition: background .2s, color .2s; }
.demo-magnetic-ic:hover { background: var(--fg); color: var(--bg); }
.demo-magnetic-ic svg { width: 22px; height: 22px; }`
    }
  ],
  api: [
    { name: 'data-magnetic', type: 'attr', default: '0.35', desc: 'Pull strength (fraction of the cursor offset).' },
    { name: 'data-magnetic-area', type: 'attr', default: '70', desc: 'Extra px around the element where the pull starts.' },
    { name: 'data-magnetic-inner', type: 'attr', desc: 'On a child: moves an extra 60% for depth.' }
  ],
  notes: '<p>Disabled for touch input and reduced motion. Uses one passive pointer listener per element, only while it is on screen.</p>'
});
