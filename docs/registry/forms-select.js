(function () {
  var globe = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>';
  RanjDocs.add({
    id: 'select',
    name: 'Select',
    group: 'Forms',
    description: 'The native <code>&lt;select&gt;</code>, styled to match inputs — keeps the OS picker on mobile and works without JS. For a fully custom listbox, see Custom select.',
    keywords: ['dropdown', 'native select', 'picker', 'option', 'optgroup'],
    demos: [
      {
        title: 'Default',
        html: `
<div class="field" style="width:20rem;max-width:100%">
  <label class="label">Country</label>
  <select class="select">
    <option value="" disabled selected>Select a country</option>
    <option>United States</option><option>Canada</option><option>United Kingdom</option><option>Germany</option><option>India</option><option>Japan</option>
  </select>
</div>`
      },
      {
        title: 'Groups, icon and sizes',
        html: `
<div style="width:20rem;max-width:100%;display:grid;gap:.75rem">
  <select class="select select-sm"><option>Small</option></select>
  <div class="select-wrapper"><span class="select-icon">${globe}</span>
    <select class="select">
      <optgroup label="Americas"><option>(GMT−08:00) Los Angeles</option><option selected>(GMT−05:00) New York</option></optgroup>
      <optgroup label="Europe"><option>(GMT+00:00) London</option><option>(GMT+01:00) Berlin</option></optgroup>
      <optgroup label="Asia"><option>(GMT+05:30) Mumbai</option><option>(GMT+09:00) Tokyo</option></optgroup>
    </select>
  </div>
  <select class="select select-lg"><option>Large</option></select>
</div>`
      },
      {
        title: 'Variants & states',
        html: `
<div class="form-grid" style="width:30rem;max-width:100%">
  <select class="select select-filled"><option>Filled</option></select>
  <div><select class="select select-ghost"><option>Sort: Newest</option><option>Sort: Popular</option></select></div>
  <select class="select" aria-invalid="true"><option>Invalid</option></select>
  <select class="select" disabled><option>Disabled</option></select>
  <select class="select span-full" multiple size="4"><option selected>Design</option><option>Engineering</option><option selected>Marketing</option><option>Sales</option></select>
</div>`
      }
    ],
    api: [
      { name: '.select', type: 'class', desc: 'Styled native select with a chevron. Works for <code>multiple</code> / <code>size</code> too.' },
      { name: '.select-sm / .select-lg', type: 'class', desc: 'Sizes.' },
      { name: '.select-filled / .select-ghost', type: 'class', desc: 'Variants. Ghost is compact for toolbars (“Sort by”).' },
      { name: '.select-wrapper + .select-icon', type: 'class', desc: 'v1 wrapper; add a leading icon.' },
      { name: '.select-base', type: 'class', desc: 'Opt in to the new styleable native picker (<code>appearance: base-select</code>) where supported.' }
    ]
  });
})();
