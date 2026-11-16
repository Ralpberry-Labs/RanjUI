RanjDocs.add({
  id: 'inline-edit',
  name: 'Inline edit',
  group: 'Forms',
  description: 'Click-to-edit text. Enter saves, Escape cancels, blur saves; the field sizes to the text and flashes green when saved. Cancel <code>ranj:save</code> to reject a value.',
  tags: ['new', 'js'],
  keywords: ['editable', 'click to edit', 'in place edit', 'contenteditable', 'rename'],
  demos: [
    {
      title: 'Project header',
      description: 'Click the title or description, or Tab to them and press Enter.',
      html: `
<div class="demo-ie-card">
  <span class="demo-ie-crumb">Projects /</span>
  <h3><span class="inline-edit" data-name="title" data-required data-label="Project name">Q4 launch plan</span></h3>
  <p><span class="inline-edit" data-name="description" data-multiline data-placeholder="Add a description…" data-label="Description">Everything we need to ship the new onboarding flow before the holidays.</span></p>
  <div class="demo-ie-meta">Owner: <span class="inline-edit" data-label="Owner">Maya Chen</span> · Budget: <span class="inline-edit" data-label="Budget" id="inline-edit-budget">$48,000</span></div>
  <p class="field-hint" id="inline-edit-log">Budget must start with $.</p>
</div>`,
      js: `
const b = root.querySelector('#inline-edit-budget'), log = root.querySelector('#inline-edit-log');
b.addEventListener('ranj:save', e => { if (!/^\\$[\\d,]+$/.test(e.detail.value)) { e.preventDefault(); log.textContent = '“' + e.detail.value + '” isn’t a valid amount — reverted.'; } });
root.addEventListener('ranj:change', e => { if (e.target.classList.contains('inline-edit')) log.textContent = 'Saved: ' + e.detail.previous + ' → ' + e.detail.value; });`,
      css: `
.demo-ie-card { width: 30rem; max-width: 100%; padding: 1.5rem; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); }
.demo-ie-crumb { font-size: .8rem; color: var(--muted-fg); }
.demo-ie-card h3 { font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; margin: .25rem 0 .5rem; }
.demo-ie-card > p:not(.field-hint) { color: var(--muted-fg); font-size: .9rem; margin-bottom: .9rem; }
.demo-ie-meta { font-size: .85rem; color: var(--muted-fg); }
.demo-ie-meta .inline-edit { color: var(--fg); font-weight: 500; }`
    }
  ],
  api: [
    { name: '.inline-edit', type: 'class', desc: 'Element whose text becomes editable. <code>.inline-edit-block</code> for full width.' },
    { name: 'data-multiline', type: 'attr', desc: 'Use a textarea (⌘/Ctrl + Enter saves).' },
    { name: 'data-required', type: 'attr', desc: 'Empty values shake and stay in edit mode.' },
    { name: 'data-placeholder / data-label / data-name / data-maxlength', type: 'attr', desc: 'Empty text, accessible name, hidden input, length limit.' },
    { name: 'data-blur', type: 'attr', default: 'save', desc: '<code>save</code> or <code>cancel</code> when focus leaves.' },
    { name: 'Ranj.instance(el, "inline-edit")', type: 'js', desc: '<code>{ value, edit(), save(), cancel() }</code>' },
    { name: 'ranj:save', type: 'event', desc: 'Cancelable. detail: <code>{ value, previous }</code>' },
    { name: 'ranj:change / ranj:edit / ranj:cancel', type: 'event', desc: '<code>change</code> detail: <code>{ value, previous }</code>' }
  ]
});
