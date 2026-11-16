(function () {
  var av = function (t, c) { return '<span class=\'listbox-avatar\' style=\'background:' + c + '\'>' + t + '</span>'; };
  RanjDocs.add({
    id: 'multi-select',
    name: 'Multi-select',
    group: 'Forms',
    description: 'Pick several options as chips inside the field. Type to filter, Enter toggles, Backspace selects then removes the last chip. Backed by a hidden <code>&lt;select multiple&gt;</code>.',
    tags: ['new', 'js'],
    keywords: ['chips', 'tags select', 'multiple', 'token input', 'people picker'],
    demos: [
      {
        title: 'Default',
        height: 340,
        html: `
<div class="field" style="width:24rem;max-width:100%">
  <label class="label">Skills</label>
  <div class="multi-select" data-placeholder="Add skills…">
    <select name="skills">
      <option selected>Figma</option><option>Framer</option><option selected>Prototyping</option><option>User research</option>
      <option>Motion design</option><option>Design systems</option><option>Illustration</option><option>Copywriting</option><option>Accessibility</option>
    </select>
  </div>
</div>`
      },
      {
        title: 'People with a limit',
        description: '<code>data-max="3"</code> disables the rest once three are picked.',
        height: 360,
        html: `
<div class="field" style="width:26rem;max-width:100%">
  <label class="label">Reviewers</label>
  <div class="multi-select" data-max="3" data-placeholder="Add up to 3 reviewers">
    <select name="reviewers">
      <optgroup label="Suggested">
        <option value="maya" data-icon="${av('MC', '#8b5cf6')}" selected>Maya Chen</option>
        <option value="ari" data-icon="${av('AR', '#0ea5e9')}">Ari Rahman</option>
      </optgroup>
      <optgroup label="Everyone">
        <option value="leo" data-icon="${av('LP', '#ec4899')}">Leo Park</option>
        <option value="jun" data-icon="${av('JW', '#f59e0b')}">Jun Watanabe</option>
        <option value="nia" data-icon="${av('NA', '#10b981')}">Nia Adeyemi</option>
        <option value="tom" data-icon="${av('TB', '#64748b')}">Tom Becker</option>
      </optgroup>
    </select>
  </div>
  <p class="field-hint" id="multi-select-out">Selected: maya</p>
</div>`,
        js: `
root.querySelector('.multi-select').addEventListener('ranj:change', e => root.querySelector('#multi-select-out').textContent = 'Selected: ' + (e.detail.value.join(', ') || 'none'));`
      },
      {
        title: 'Small',
        height: 300,
        html: `
<div class="multi-select multi-select-sm" style="width:18rem;max-width:100%" data-placeholder="Filter by status" data-options='["Backlog","Todo",{"value":"In progress","label":"In progress","selected":true},"In review","Done","Canceled"]'></div>`
      }
    ],
    api: [
      { name: '.multi-select', type: 'class', desc: 'Wrap a <code>&lt;select&gt;</code> (made <code>multiple</code>) or use <code>data-options</code>. Option attrs: <code>data-icon</code>, <code>disabled</code>, <code>&lt;optgroup&gt;</code>.' },
      { name: 'data-placeholder', type: 'attr', default: 'Select…', desc: 'Shown when empty.' },
      { name: 'data-max', type: 'attr', default: '0', desc: 'Maximum selections (0 = unlimited).' },
      { name: 'data-close-on-select', type: 'attr', desc: 'Close the list after each pick.' },
      { name: '.multi-select-sm', type: 'class', desc: 'Compact size.' },
      { name: 'Keyboard', type: 'attr', desc: '↑ ↓ move, Enter toggles, Backspace on empty input highlights then removes the last chip, ← → move between chips, Escape closes.' },
      { name: 'Ranj.instance(el, "multi-select")', type: 'js', desc: '<code>{ value: string[], open(), close() }</code>' },
      { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value: string[] }</code>' }
    ]
  });
})();
