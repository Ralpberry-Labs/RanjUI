RanjDocs.add({
  id: 'combobox',
  name: 'Combobox',
  group: 'Forms',
  description: 'An editable input with a filtered listbox: arrow keys move through matches (<code>aria-activedescendant</code>), Enter picks, and you can let people create new options or load results asynchronously.',
  tags: ['js'],
  keywords: ['autocomplete', 'typeahead', 'autosuggest', 'filter', 'async search', 'creatable'],
  demos: [
    {
      title: 'Default',
      height: 320,
      html: `
<div class="field" style="width:20rem;max-width:100%">
  <label class="label">Language</label>
  <div class="combobox" data-name="language" data-strict>
    <input class="combobox-input" placeholder="Search languages…">
    <ul class="combobox-list">
      <li class="combobox-option" data-value="ts">TypeScript</li>
      <li class="combobox-option" data-value="js">JavaScript</li>
      <li class="combobox-option" data-value="py">Python</li>
      <li class="combobox-option" data-value="rs">Rust</li>
      <li class="combobox-option" data-value="go">Go</li>
      <li class="combobox-option" data-value="swift">Swift</li>
      <li class="combobox-option" data-value="kt">Kotlin</li>
      <li class="combobox-option" data-value="rb">Ruby</li>
      <li class="combobox-option" data-value="ex" data-disabled>Elixir (unsupported)</li>
    </ul>
  </div>
  <p class="field-hint">v1 markup — <code>data-strict</code> only accepts listed values.</p>
</div>`
    },
    {
      title: 'Create new options',
      description: 'With <code>data-create</code>, a “Create …” row appears when nothing matches exactly.',
      height: 320,
      html: `
<div class="field" style="width:20rem;max-width:100%">
  <label class="label">Label</label>
  <div class="combobox" data-create data-name="label" data-autohighlight data-options='[{"value":"bug","label":"Bug","icon":"🐞","group":"Type"},{"value":"feature","label":"Feature","icon":"✨","group":"Type"},{"value":"docs","label":"Documentation","icon":"📚","group":"Type"},{"value":"p0","label":"P0 – Critical","group":"Priority"},{"value":"p1","label":"P1 – High","group":"Priority"},{"value":"p2","label":"P2 – Normal","group":"Priority"}]'>
    <input placeholder="Add a label…">
  </div>
  <p class="field-hint" id="combobox-created">Type “design” and press Enter.</p>
</div>`,
      js: `
root.querySelector('.combobox').addEventListener('ranj:create', e => root.querySelector('#combobox-created').textContent = 'Created “' + e.detail.label + '”');`
    },
    {
      title: 'Async results',
      description: 'Plug in any data source with <code>Ranj.combobox(el, { source })</code>. Requests are debounced and stale responses are dropped.',
      height: 340,
      html: `
<div class="field" style="width:22rem;max-width:100%">
  <label class="label">Ship to city</label>
  <div class="combobox" id="combobox-async" data-name="city" data-min-chars="1" data-no-toggle data-autohighlight>
    <div class="input-wrap"><span class="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span><input placeholder="Start typing a city…"></div>
  </div>
</div>`,
      js: `
const cities = [['Amsterdam','Netherlands'],['Austin','USA'],['Bangalore','India'],['Barcelona','Spain'],['Berlin','Germany'],['Boston','USA'],['Buenos Aires','Argentina'],['Cape Town','South Africa'],['Chicago','USA'],['Copenhagen','Denmark'],['Dubai','UAE'],['Dublin','Ireland'],['Lagos','Nigeria'],['Lisbon','Portugal'],['London','UK'],['Los Angeles','USA'],['Melbourne','Australia'],['Mexico City','Mexico'],['Montreal','Canada'],['Mumbai','India'],['Nairobi','Kenya'],['New York','USA'],['Paris','France'],['San Francisco','USA'],['São Paulo','Brazil'],['Seoul','South Korea'],['Singapore','Singapore'],['Stockholm','Sweden'],['Sydney','Australia'],['Tokyo','Japan'],['Toronto','Canada'],['Vancouver','Canada']];
Ranj.combobox(root.querySelector('#combobox-async'), {
  source: q => new Promise(res => setTimeout(() => res(cities
    .filter(c => c[0].toLowerCase().includes(q.toLowerCase().trim()))
    .map(c => ({ value: c[0], label: c[0], meta: c[1] }))), 450))
});`
    }
  ],
  api: [
    { name: '.combobox', type: 'class', desc: 'Container with an input (wrapped in <code>.input-wrap</code> automatically) and options from <code>.combobox-list &gt; .combobox-option</code>, a <code>&lt;datalist&gt;</code> or <code>data-options</code>.' },
    { name: '.combobox-option', type: 'class', desc: 'v1 option. Attributes: <code>data-value</code>, <code>data-description</code>, <code>data-icon</code>, <code>data-meta</code>, <code>data-group</code>, <code>data-disabled</code>, <code>data-selected</code>.' },
    { name: 'data-name', type: 'attr', desc: 'Hidden input name that receives the option value (the visible input shows the label).' },
    { name: 'data-create', type: 'attr', desc: 'Offer to create the typed value. Fires <code>ranj:create</code>.' },
    { name: 'data-strict', type: 'attr', desc: 'On blur, revert text that doesn’t match an option.' },
    { name: 'data-autohighlight', type: 'attr', desc: 'Highlight the first match as you type (Tab accepts it).' },
    { name: 'data-open-on-focus / data-no-toggle / data-min-chars / data-debounce', type: 'attr', default: 'true / – / 0 / 180', desc: 'Behaviour tweaks.' },
    { name: 'Ranj.combobox(el, {source, items})', type: 'js', desc: 'Returns the instance. <code>source(query)</code> may return an array or a Promise. Instance: <code>{ value, open(), close(), setItems(), setSource() }</code>.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value, label, item, created }</code>' }
  ]
});
