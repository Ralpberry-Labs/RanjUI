RanjDocs.add({
  id: 'tag-input',
  name: 'Tag input',
  group: 'Forms',
  description: 'Free-form chips: type and press Enter or comma, paste a list to split it, Backspace to remove. Supports a maximum, duplicate protection and pattern checks (like emails).',
  tags: ['new', 'js'],
  keywords: ['tags', 'chips input', 'token field', 'keywords', 'email list', 'invite'],
  demos: [
    {
      title: 'Default',
      html: `
<div class="field" style="width:26rem;max-width:100%">
  <label class="label">Topics</label>
  <div class="tag-input" data-name="topics" data-value="design, motion, css" data-placeholder="Add a topic…"></div>
  <p class="field-hint">Press Enter or comma to add. Paste “a, b, c” to add many.</p>
</div>`
    },
    {
      title: 'Invite by email',
      description: '<code>data-pattern="email"</code> marks invalid entries, <code>data-max="5"</code> caps the list.',
      html: `
<div class="field" style="width:31rem;max-width:100%">
  <label class="label">Invite teammates</label>
  <div class="tag-input" data-name="emails[]" data-pattern="email" data-max="5" data-value="maya@acme.dev, leo@acme.dev, not-an-email" data-placeholder="name@company.com" data-add-on-blur>
    <div class="chip-box chip-box-primary"><input></div>
    <div class="tag-input-foot"><span>Separate emails with commas</span><span class="tag-input-count"></span></div>
  </div>
</div>`
    },
    {
      title: 'With suggestions',
      html: `
<div class="field" style="width:26rem;max-width:100%">
  <label class="label">Keywords</label>
  <div class="tag-input" id="tag-input-sugg" data-lowercase data-value="ui"></div>
  <div class="tag-input-suggest">
    <button type="button" data-tag="components">+ components</button><button type="button" data-tag="dark mode">+ dark mode</button>
    <button type="button" data-tag="vanilla js">+ vanilla js</button><button type="button" data-tag="accessibility">+ accessibility</button>
  </div>
</div>`,
      js: `
const ti = root.querySelector('#tag-input-sugg');
root.querySelectorAll('[data-tag]').forEach(b => b.onclick = () => Ranj.instance(ti, 'tag-input').add(b.dataset.tag));`
    }
  ],
  api: [
    { name: '.tag-input', type: 'class', desc: 'Container. A <code>.chip-box</code> with an <code>&lt;input&gt;</code> is created if missing. <code>.chip-box-primary</code> tints chips.' },
    { name: 'data-name', type: 'attr', desc: 'Hidden input name. Ending in <code>[]</code> creates one input per tag; otherwise tags are comma-joined.' },
    { name: 'data-value', type: 'attr', desc: 'Initial comma-separated tags.' },
    { name: 'data-max / data-max-length', type: 'attr', desc: 'Maximum number of tags / characters per tag.' },
    { name: 'data-pattern', type: 'attr', desc: 'Regex (or <code>email</code>) — non-matching tags are marked invalid.' },
    { name: 'data-separators', type: 'attr', default: ',;', desc: 'Keys that commit a tag (Enter always does).' },
    { name: 'data-allow-duplicates / data-lowercase / data-add-on-blur', type: 'attr', desc: 'Behaviour switches.' },
    { name: '.tag-input-count', type: 'class', desc: 'Element inside that shows <code>n / max</code>.' },
    { name: 'Ranj.instance(el, "tag-input")', type: 'js', desc: '<code>{ value, add(tag), remove(tag) }</code>' },
    { name: 'ranj:change / ranj:add / ranj:remove / ranj:reject', type: 'event', desc: '<code>change</code> detail: <code>{ value: string[] }</code>. Cancel <code>ranj:add</code> to block a tag.' }
  ]
});
