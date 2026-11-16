(function () {
  var av = function (t, c) { return '<span class=\'listbox-avatar\' style=\'background:' + c + '\'>' + t + '</span>'; };
  RanjDocs.add({
    id: 'custom-select',
    name: 'Custom select',
    group: 'Forms',
    description: 'A fully styled select: a button that opens a listbox popover with icons, descriptions, groups, disabled options, typeahead and an optional search box. It drives a hidden native <code>&lt;select&gt;</code>, so forms submit and validate natively.',
    tags: ['new', 'js'],
    keywords: ['listbox', 'dropdown', 'select menu', 'picker', 'typeahead', 'searchable select'],
    demos: [
      {
        title: 'Default',
        description: 'Try the keyboard: focus it and type a letter, or use ↑ ↓ Home End Enter Escape.',
        height: 300,
        html: `
<div class="field" style="width:18rem;max-width:100%">
  <label class="label">Framework</label>
  <div class="custom-select" data-placeholder="Select a framework">
    <select name="framework">
      <option value="next">Next.js</option>
      <option value="svelte">SvelteKit</option>
      <option value="astro">Astro</option>
      <option value="remix">Remix</option>
      <option value="nuxt" disabled>Nuxt (coming soon)</option>
      <option value="solid">SolidStart</option>
    </select>
  </div>
</div>`
      },
      {
        title: 'Icons, descriptions and groups',
        height: 300,
        html: `
<div class="form-grid" style="width:34rem;max-width:100%">
  <div class="field"><label class="label">Plan</label>
    <div class="custom-select">
      <select name="plan">
        <option value="hobby" data-icon="🌱" data-description="For side projects">Hobby</option>
        <option value="pro" data-icon="⚡" data-description="For growing teams" selected>Pro</option>
        <option value="enterprise" data-icon="🏢" data-description="SSO, audit logs, SLA">Enterprise</option>
      </select>
    </div>
  </div>
  <div class="field"><label class="label">Assignee</label>
    <div class="custom-select">
      <select name="assignee">
        <optgroup label="Design">
          <option value="maya" data-icon="${av('MC', '#8b5cf6')}" data-meta="Lead">Maya Chen</option>
          <option value="leo" data-icon="${av('LP', '#ec4899')}">Leo Park</option>
        </optgroup>
        <optgroup label="Engineering">
          <option value="ari" data-icon="${av('AR', '#0ea5e9')}" selected>Ari Rahman</option>
          <option value="sam" data-icon="${av('SO', '#10b981')}" data-meta="On leave" disabled>Sam Okafor</option>
          <option value="jun" data-icon="${av('JW', '#f59e0b')}">Jun Watanabe</option>
        </optgroup>
      </select>
    </div>
  </div>
</div>`
      },
      {
        title: 'Searchable',
        description: '<code>data-search</code> adds a filter box — matches are highlighted.',
        height: 360,
        html: `
<div class="field" style="width:18rem;max-width:100%">
  <label class="label">Country</label>
  <div class="custom-select" data-search data-placeholder="Select country" data-search-placeholder="Search countries…">
    <select name="country" required>
      <option data-icon="🇦🇷">Argentina</option><option data-icon="🇦🇺">Australia</option><option data-icon="🇧🇷">Brazil</option>
      <option data-icon="🇨🇦">Canada</option><option data-icon="🇫🇷">France</option><option data-icon="🇩🇪">Germany</option>
      <option data-icon="🇮🇳">India</option><option data-icon="🇯🇵">Japan</option><option data-icon="🇲🇽">Mexico</option>
      <option data-icon="🇳🇱">Netherlands</option><option data-icon="🇳🇬">Nigeria</option><option data-icon="🇰🇷">South Korea</option>
      <option data-icon="🇪🇸">Spain</option><option data-icon="🇸🇪">Sweden</option><option data-icon="🇬🇧">United Kingdom</option><option data-icon="🇺🇸">United States</option>
    </select>
  </div>
  <p class="field-hint" id="custom-select-out">Value: —</p>
</div>`,
        js: `
const cs = root.querySelector('.custom-select'), out = root.querySelector('#custom-select-out');
cs.addEventListener('ranj:change', e => out.textContent = 'Value: ' + e.detail.value);`
      },
      {
        title: 'Sizes & from data',
        description: 'Build options from JSON with <code>data-options</code>.',
        height: 280,
        html: `
<div style="display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;justify-content:center">
  <div class="custom-select custom-select-sm" style="width:9rem" data-options='["Last 24 hours","Last 7 days","Last 30 days"]'></div>
  <div class="custom-select" style="width:11rem" data-options='[{"value":"asc","label":"Oldest first"},{"value":"desc","label":"Newest first","selected":true}]'></div>
  <div class="custom-select custom-select-lg" style="width:12rem" data-placeholder="Priority" data-options='[{"value":"urgent","label":"Urgent","icon":"🔴"},{"value":"high","label":"High","icon":"🟠"},{"value":"low","label":"Low","icon":"🟢"}]'></div>
  <div class="custom-select custom-select-ghost" data-options='["Public","Team only","Private"]'></div>
</div>`
      }
    ],
    api: [
      { name: '.custom-select', type: 'class', desc: 'Wrap a native <code>&lt;select&gt;</code>. Options can use <code>data-icon</code> (HTML/emoji), <code>data-description</code>, <code>data-meta</code>, <code>disabled</code>, and <code>&lt;optgroup&gt;</code>.' },
      { name: '.custom-select-sm / -lg / -ghost', type: 'class', desc: 'Sizes and a borderless variant.' },
      { name: 'data-placeholder', type: 'attr', default: 'Select…', desc: 'Shown when nothing is selected (no option is pre-selected).' },
      { name: 'data-search', type: 'attr', desc: 'Adds a search box at the top of the list. <code>data-search-placeholder</code>, <code>data-empty</code>.' },
      { name: 'data-options', type: 'attr', desc: 'JSON array of strings or <code>{value,label,icon,description,meta,group,disabled,selected}</code>.' },
      { name: 'data-name', type: 'attr', desc: 'Name for the generated native select.' },
      { name: 'Ranj.instance(el, "custom-select")', type: 'js', desc: '<code>{ value, open(), close(), refresh() }</code> — call <code>refresh()</code> after changing the native options.' },
      { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value, label }</code>. The native select also fires <code>change</code>.' }
    ]
  });
})();
