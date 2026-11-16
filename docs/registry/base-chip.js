(function () {
  var I = RB.ic;
  var X = I('x');
  function rm(t) { return '<span class="chip" data-value="' + t + '">' + t + '<button type="button" class="chip-remove" aria-label="Remove ' + t + '">' + X + '</button></span>'; }
  RanjDocs.add({
    id: 'chip',
    name: 'Chip',
    group: 'Base',
    description: 'Compact, interactive pills for filters, selections and tags. Toggle with <code>aria-pressed</code>, remove with a close button, or type new ones into a chip input.',
    tags: ['new', 'js'],
    keywords: ['tag', 'filter', 'pill', 'token', 'tag input', 'choice chip'],
    demos: [
      {
        title: 'Filter chips',
        description: 'Click to toggle. Listens for <code>ranj:change</code> on the group.',
        html: `<div class="stack gap-3" style="align-items:center">
  <div class="chip-group" aria-label="Filter by category">
    <button type="button" class="chip" aria-pressed="true">${I('check', 'class="chip-check"')} Design <span class="chip-count">24</span></button>
    <button type="button" class="chip" aria-pressed="false">${I('check', 'class="chip-check"')} Engineering <span class="chip-count">58</span></button>
    <button type="button" class="chip" aria-pressed="true">${I('check', 'class="chip-check"')} Product <span class="chip-count">17</span></button>
    <button type="button" class="chip" aria-pressed="false">${I('check', 'class="chip-check"')} Marketing <span class="chip-count">9</span></button>
  </div>
  <p class="small muted demo-chip-out" style="font-weight:400">Showing: Design, Product</p>
</div>`,
        js: "var out = root.querySelector('.demo-chip-out');\nroot.querySelector('.chip-group').addEventListener('ranj:change', function (e) {\n  out.textContent = 'Showing: ' + (e.detail.values.map(function (v) { return v.replace(/\\s*\\d+$/, ''); }).join(', ') || 'everything');\n});"
      },
      {
        title: 'Single choice',
        html: `<div class="chip-group" data-single data-required aria-label="Size">
  <button type="button" class="chip chip-lg" aria-pressed="false">XS</button>
  <button type="button" class="chip chip-lg" aria-pressed="true">S</button>
  <button type="button" class="chip chip-lg" aria-pressed="false">M</button>
  <button type="button" class="chip chip-lg" aria-pressed="false">L</button>
  <button type="button" class="chip chip-lg" aria-pressed="false" disabled style="opacity:.45;text-decoration:line-through">XL</button>
</div>`
      },
      {
        title: 'Removable',
        html: `<div class="chip-group">
  ${rm('Lisbon')}
  ${rm('Berlin')}
  ${rm('Tokyo')}
  <span class="chip" data-value="Ana Silva"><img class="avatar" src="${RB.face(20)}" alt="">Ana Silva<button type="button" class="chip-remove" aria-label="Remove Ana Silva">${X}</button></span>
</div>`
      },
      {
        title: 'Chip input',
        description: 'Type and press Enter or comma. Backspace on an empty field removes the last chip.',
        html: `<div class="chip-input" style="width:min(100%,26rem)">
  ${rm('frontend')}
  ${rm('a11y')}
  <input type="text" placeholder="Add a topic…" aria-label="Add a topic">
</div>`
      },
      {
        title: 'Tags',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="tag">v2.4.0</span><span class="tag">MIT</span><span class="tag tag-soft">${I('tag')} design-system</span><span class="tag tag-soft">css</span><span class="chip chip-sm chip-soft">Read-only chip</span>
</div>`
      }
    ],
    api: [
      { name: '.chip', type: 'class', desc: 'Pill. Use a <code>&lt;button&gt;</code> with <code>aria-pressed</code> to make it toggleable.' },
      { name: '.chip-group', type: 'class', desc: 'Wrapping container. <code>data-single</code> allows one active chip; <code>data-required</code> prevents none.' },
      { name: '.chip-check / .chip-count', type: 'class', desc: 'Check icon that slides in when pressed, and a muted count.' },
      { name: '.chip-remove', type: 'class', desc: 'Close button; removes the chip with an exit animation.' },
      { name: '.chip-input', type: 'class', desc: 'Field that turns typed text into chips (Enter, comma or Tab).' },
      { name: '.chip-sm', type: 'class', desc: 'Sizes and quieter styles. Also: <code>.chip-lg</code> <code>.chip-soft</code> <code>.chip-square</code> <code>.tag</code> <code>.tag-soft</code>' },
      { name: 'ranj:toggle', type: 'event', desc: 'On a chip. detail: <code>{ pressed, value }</code>' },
      { name: 'ranj:change', type: 'event', desc: 'On the group or input. detail: <code>{ values }</code>' },
      { name: 'ranj:remove / ranj:add', type: 'event', desc: 'Cancelable. detail: <code>{ value }</code>' },
      { name: 'Ranj.chip.remove(el)', type: 'js', desc: 'Imperative helpers. Also: <code>.create(text)</code> <code>.values(group)</code>' }
    ]
  });
})();
