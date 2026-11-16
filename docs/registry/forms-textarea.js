(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var clip = s('<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>');
  var smile = s('<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>');
  var send = s('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>');
  RanjDocs.add({
    id: 'textarea',
    name: 'Textarea',
    group: 'Forms',
    description: 'Multi-line text with auto-grow (<code>data-autosize</code>) and a live character counter (<code>data-maxlength</code>) that warns near the limit.',
    tags: ['js'],
    keywords: ['multiline', 'autosize', 'auto grow', 'character count', 'counter', 'composer'],
    demos: [
      {
        title: 'Default',
        html: `
<div class="field" style="width:24rem;max-width:100%">
  <label class="label">Message</label>
  <textarea class="textarea" placeholder="Tell us a little about your project…"></textarea>
  <p class="field-hint">Markdown is supported.</p>
</div>`
      },
      {
        title: 'Auto-grow with counter',
        description: 'Type past a few lines — the box grows up to <code>data-max-rows</code>, then scrolls. The counter goes amber near the limit and red when over.',
        html: `
<div class="field" style="width:26rem;max-width:100%">
  <div class="field-row"><label class="label">Bio</label></div>
  <textarea class="textarea" data-autosize data-max-rows="8" data-maxlength="160" rows="2">Product designer in Brooklyn. Previously at Linear and Figma. Obsessed with type, motion and good coffee.</textarea>
  <p class="field-hint">Shown on your public profile.</p>
</div>`
      },
      {
        title: 'Composer',
        description: '<code>.textarea-box</code> adds a footer toolbar; <code>data-counter-ring</code> swaps the counter for a ring that counts down in the last 20 characters.',
        html: `
<div class="textarea-box" style="width:30rem;max-width:100%">
  <textarea class="textarea" data-autosize data-max-rows="6" data-maxlength="280" data-counter-ring rows="2" placeholder="What’s happening?"></textarea>
  <div class="textarea-foot">
    <button class="btn btn-ghost btn-icon btn-sm" type="button" aria-label="Attach">${clip}</button>
    <button class="btn btn-ghost btn-icon btn-sm" type="button" aria-label="Emoji">${smile}</button>
    <span class="field-counter"></span>
    <button class="btn btn-primary btn-sm" type="button">${send}Post</button>
  </div>
</div>`
      },
      {
        title: 'States',
        html: `
<div class="form-grid" style="width:34rem;max-width:100%">
  <textarea class="textarea textarea-filled" placeholder="Filled"></textarea>
  <textarea class="textarea" aria-invalid="true">Too short</textarea>
  <textarea class="textarea" disabled>Disabled</textarea>
  <textarea class="textarea textarea-sm" placeholder="Small"></textarea>
</div>`
      }
    ],
    api: [
      { name: '.textarea', type: 'class', desc: 'Styled textarea. <code>.textarea-sm</code>, <code>.textarea-filled</code>.' },
      { name: 'data-autosize', type: 'attr', desc: 'Grow with content. Pair with <code>data-max-rows</code> / <code>data-min-rows</code>.' },
      { name: 'data-maxlength', type: 'attr', desc: 'Soft limit with a live counter (works on inputs too). Uses <code>.field-counter</code> in the same field/box if present, else adds one.' },
      { name: 'data-counter-ring', type: 'attr', desc: 'Show a progress ring next to the count.' },
      { name: 'data-counter', type: 'attr', desc: 'Selector of an element to render the counter into.' },
      { name: '.textarea-box / .textarea-foot', type: 'class', desc: 'Composer shell with a toolbar row.' }
    ]
  });
})();
