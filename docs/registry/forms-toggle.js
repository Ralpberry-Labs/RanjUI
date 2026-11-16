(function () {
  var s = function (d, extra) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + d + '</svg>'; };
  var bold = s('<path d="M6 12h9a4 4 0 0 1 0 8H6zM6 4h7a4 4 0 0 1 0 8H6z"/>', ' stroke-width="2.5"');
  var italic = s('<path d="M19 4h-9M14 20H5M15 4 9 20"/>');
  var under = s('<path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/>');
  var heart = s('<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>');
  var star = s('<path d="M12 2.6l2.9 6.06 6.6.8-4.87 4.56 1.27 6.54L12 17.3l-5.9 3.26 1.27-6.54L2.5 9.46l6.6-.8z"/>');
  var pin = s('<path d="M12 17v5M9 10.76V6h6v4.76l2 3.24H7z"/><path d="M8 3h8"/>');
  RanjDocs.add({
    id: 'toggle',
    name: 'Toggle',
    group: 'Forms',
    description: 'A two-state button with <code>aria-pressed</code>. Use it for favourites, pins and formatting buttons; icons pop when pressed.',
    tags: ['js'],
    keywords: ['toggle button', 'pressed', 'favorite', 'like button', 'bookmark'],
    demos: [
      {
        title: 'Default',
        html: `
<button class="toggle" aria-label="Bold">${bold}</button>
<button class="toggle" aria-pressed="true" aria-label="Italic">${italic}</button>
<button class="toggle toggle-outline">${under}Underline</button>
<button class="toggle toggle-outline toggle-primary" aria-pressed="true">${pin}Pinned</button>
<button class="toggle" disabled>${bold}Disabled</button>`
      },
      {
        title: 'Reactions',
        description: '<code>.toggle-pop</code> fills and bounces the icon.',
        html: `
<button class="toggle toggle-outline toggle-pop toggle-heart" aria-pressed="true" data-count="128">${heart}<span>128</span></button>
<button class="toggle toggle-outline toggle-pop toggle-star">${star}<span>Star</span></button>
<button class="toggle toggle-sm toggle-pop toggle-heart" aria-label="Like">${heart}</button>
<button class="toggle toggle-lg toggle-solid">${pin}Follow</button>`,
        js: `
const t = root.querySelector('[data-count]');
t.addEventListener('ranj:change', e => t.querySelector('span').textContent = e.detail.pressed ? 128 : 127);`
      }
    ],
    api: [
      { name: '.toggle', type: 'class', desc: 'Toggle button. State: <code>aria-pressed="true"</code> (v1 <code>.active</code> also works).' },
      { name: '.toggle-outline / .toggle-primary / .toggle-solid', type: 'class', desc: 'Variants for the pressed look.' },
      { name: '.toggle-sm / .toggle-lg', type: 'class', desc: 'Sizes.' },
      { name: '.toggle-pop / .toggle-heart / .toggle-star', type: 'class', desc: 'Fill-and-bounce icon reactions.' },
      { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ pressed, value }</code>' }
    ]
  });

  RanjDocs.add({
    id: 'toggle-group',
    name: 'Toggle group',
    group: 'Forms',
    description: 'A set of toggles where one (or several, with <code>data-multiple</code>) can be on. Arrow keys move focus with a roving tabindex, and <code>data-name</code> posts the value with forms.',
    tags: ['js'],
    keywords: ['button group', 'toolbar', 'text formatting', 'alignment', 'single select', 'multi select'],
    demos: [
      {
        title: 'Editor toolbar',
        description: 'Formatting is multiple; alignment is single and can’t be cleared (<code>data-required-one</code>).',
        html: `
<div class="toolbar" role="toolbar" aria-label="Formatting">
  <div class="toggle-group" data-multiple aria-label="Text style" data-name="style">
    <button class="toggle toggle-sm" data-value="bold" aria-label="Bold" aria-pressed="true">${bold}</button>
    <button class="toggle toggle-sm" data-value="italic" aria-label="Italic">${italic}</button>
    <button class="toggle toggle-sm" data-value="underline" aria-label="Underline">${under}</button>
  </div>
  <span class="toggle-group-sep"></span>
  <div class="toggle-group" data-required-one aria-label="Alignment" data-name="align">
    <button class="toggle toggle-sm" data-value="left" aria-label="Align left" aria-pressed="true">${s('<path d="M15 12H3M17 18H3M21 6H3"/>')}</button>
    <button class="toggle toggle-sm" data-value="center" aria-label="Align center">${s('<path d="M18 12H6M21 6H3M17 18H7"/>')}</button>
    <button class="toggle toggle-sm" data-value="right" aria-label="Align right">${s('<path d="M21 12H9M21 18H7M21 6H3"/>')}</button>
  </div>
</div>`
      },
      {
        title: 'Text options',
        html: `
<div style="display:grid;gap:1rem;justify-items:center">
  <div class="toggle-group toggle-group-primary" aria-label="Billing period">
    <button class="toggle" data-value="monthly" aria-pressed="true">Monthly</button>
    <button class="toggle" data-value="yearly">Yearly</button>
    <button class="toggle" data-value="lifetime" disabled>Lifetime</button>
  </div>
  <div class="toggle-group toggle-group-attached" data-multiple aria-label="Days">
    <button class="toggle" aria-pressed="true">Mon</button><button class="toggle" aria-pressed="true">Tue</button><button class="toggle">Wed</button>
    <button class="toggle" aria-pressed="true">Thu</button><button class="toggle">Fri</button>
  </div>
  <p class="field-hint" id="toggle-group-out">Click a day</p>
</div>`,
        js: `
root.querySelectorAll('.toggle-group').forEach(g => g.addEventListener('ranj:change', e => root.querySelector('#toggle-group-out').textContent = 'Value: ' + JSON.stringify(e.detail.value)));`
      }
    ],
    api: [
      { name: '.toggle-group', type: 'class', desc: 'Group of <code>.toggle</code> buttons (single choice by default).' },
      { name: 'data-multiple', type: 'attr', desc: 'Allow several pressed at once.' },
      { name: 'data-required-one', type: 'attr', desc: 'Single mode: clicking the pressed toggle doesn’t clear it.' },
      { name: 'data-name', type: 'attr', desc: 'Hidden input name; value is the pressed <code>data-value</code> (comma-joined when multiple).' },
      { name: '.toggle-group-attached / -primary / -sm / -vertical', type: 'class', desc: 'Joined borders, tinted pressed state, compact, vertical.' },
      { name: '.toolbar / .toggle-group-sep', type: 'class', desc: 'Toolbar container and divider.' },
      { name: 'Ranj.instance(el, "toggle-group")', type: 'js', desc: '<code>{ value }</code> get/set.' },
      { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value }</code> — a string, or an array with <code>data-multiple</code>.' }
    ]
  });
})();
