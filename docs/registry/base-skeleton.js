(function () {
  RanjDocs.add({
    id: 'skeleton',
    name: 'Skeleton',
    group: 'Base',
    description: 'Placeholder shapes that hold layout while content loads. Shimmer by default, or <code>.skeleton-pulse</code>. Presets for text, avatars, cards and tables.',
    keywords: ['loading', 'placeholder', 'shimmer', 'ghost', 'content loader'],
    demos: [
      {
        title: 'Profile row',
        html: `<div class="skeleton-row" style="width:min(100%,22rem)" aria-busy="true" aria-label="Loading">
  <div class="skeleton skeleton-avatar" style="--size:3rem"></div>
  <div class="skeleton-stack"><div class="skeleton skeleton-text" style="--w:60%"></div><div class="skeleton skeleton-text" style="--w:85%"></div></div>
</div>`
      },
      {
        title: 'Card',
        center: false,
        html: `<div class="grid grid-auto" style="--min:220px">
  <div class="skeleton-card" aria-busy="true">
    <div class="skeleton skeleton-image"></div>
    <div class="skeleton skeleton-heading"></div>
    <div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text"></div></div>
    <div class="skeleton-row"><div class="skeleton skeleton-avatar" style="--size:1.75rem"></div><div class="skeleton skeleton-text" style="--w:40%"></div></div>
  </div>
  <div class="skeleton-card" aria-busy="true">
    <div class="skeleton skeleton-image skeleton-pulse"></div>
    <div class="skeleton skeleton-heading skeleton-pulse"></div>
    <div><div class="skeleton skeleton-text skeleton-pulse"></div><div class="skeleton skeleton-text skeleton-pulse"></div><div class="skeleton skeleton-text skeleton-pulse"></div></div>
    <div class="skeleton-row"><div class="skeleton skeleton-btn skeleton-pulse"></div><div class="skeleton skeleton-btn skeleton-pulse" style="--w:4rem"></div></div>
  </div>
</div>`
      },
      {
        title: 'Table',
        center: false,
        html: `<div class="skeleton-table" aria-busy="true" aria-label="Loading invoices">
  <div><div class="skeleton skeleton-line" style="--w:40%"></div><div class="skeleton skeleton-line" style="--w:60%"></div><div class="skeleton skeleton-line" style="--w:50%"></div><div class="skeleton skeleton-line"></div></div>
  <div><div class="skeleton-row"><div class="skeleton skeleton-avatar" style="--size:2rem"></div><div class="skeleton skeleton-text" style="--w:70%"></div></div><div class="skeleton skeleton-badge"></div><div class="skeleton skeleton-text" style="--w:70%"></div><div class="skeleton skeleton-text"></div></div>
  <div><div class="skeleton-row"><div class="skeleton skeleton-avatar" style="--size:2rem"></div><div class="skeleton skeleton-text" style="--w:55%"></div></div><div class="skeleton skeleton-badge"></div><div class="skeleton skeleton-text" style="--w:60%"></div><div class="skeleton skeleton-text"></div></div>
  <div><div class="skeleton-row"><div class="skeleton skeleton-avatar" style="--size:2rem"></div><div class="skeleton skeleton-text" style="--w:80%"></div></div><div class="skeleton skeleton-badge"></div><div class="skeleton skeleton-text" style="--w:75%"></div><div class="skeleton skeleton-text"></div></div>
</div>`
      },
      {
        title: 'Load then reveal',
        description: 'Swap skeletons for real content. Click Reload to see it again.',
        html: `<div class="card demo-skeleton-live" style="width:min(100%,22rem)"><div class="card-content"></div></div>
<button class="btn btn-outline btn-sm demo-skeleton-reload">Reload</button>`,
        js: [
          "var box = root.querySelector('.demo-skeleton-live .card-content'), t;",
          "var sk = '<div class=\"skeleton-row\"><div class=\"skeleton skeleton-avatar\"></div><div class=\"skeleton-stack\"><div class=\"skeleton skeleton-text\" style=\"--w:50%\"></div><div class=\"skeleton skeleton-text\" style=\"--w:80%\"></div></div></div><div style=\"margin-top:1rem\"><div class=\"skeleton skeleton-text\"></div><div class=\"skeleton skeleton-text\"></div></div>';",
          "var real = '<div class=\"avatar-label animate-fade-in\"><span class=\"avatar avatar-gradient\" style=\"--avatar-hue:200\">LP</span><div><b>Leo Park</b><span>Shipped the new onboarding</span></div></div><p class=\"small muted animate-fade-in\" style=\"margin-top:1rem;font-weight:400\">Activation is up 18% in the first week. Next: a guided tour for teams.</p>';",
          "function run() { box.setAttribute('aria-busy', 'true'); box.innerHTML = sk; clearTimeout(t); t = setTimeout(function () { box.innerHTML = real; box.removeAttribute('aria-busy'); }, 1600); }",
          "run(); root.querySelector('.demo-skeleton-reload').onclick = run;",
          "return function () { clearTimeout(t); };"
        ].join('\n')
      }
    ],
    api: [
      { name: '.skeleton', type: 'class', desc: 'Shimmering block. Size it yourself or use a preset.' },
      { name: '.skeleton-pulse', type: 'class', desc: 'Pulse instead of shimmer / no animation. Also: <code>.skeleton-static</code>' },
      { name: '.skeleton-text', type: 'class', desc: 'Shape presets. Width via <code>--w</code>, avatar size via <code>--size</code>, image ratio via <code>--ratio</code>. Also: <code>.skeleton-heading</code> <code>.skeleton-line</code> <code>.skeleton-avatar</code> <code>.skeleton-btn</code> <code>.skeleton-badge</code> <code>.skeleton-image</code>' },
      { name: '.skeleton-card', type: 'class', desc: 'Layout presets. Table columns via <code>--cols</code>. Also: <code>.skeleton-row</code> <code>.skeleton-stack</code> <code>.skeleton-table</code>' },
      { name: '--skeleton-from', type: 'var', desc: 'Theme tokens for the shimmer colors. Also: <code>--skeleton-to</code>' },
      { name: 'aria-busy="true"', type: 'attr', desc: 'Set on the loading region for screen readers.' }
    ]
  });
})();
