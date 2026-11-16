(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'button-group',
    name: 'Button group',
    group: 'Base',
    description: 'Attach related buttons into one control: toolbars, segmented toggles, vertical stacks and split buttons.',
    tags: ['js'],
    keywords: ['segmented', 'toolbar', 'split button', 'toggle group', 'btn-group'],
    demos: [
      {
        title: 'Attached',
        html: `<div class="btn-group" role="group" aria-label="Pagination">
  <button class="btn btn-outline">${I('chevronRight', 'style="transform:scaleX(-1)"')} Prev</button>
  <button class="btn btn-outline">1</button><button class="btn btn-outline">2</button><button class="btn btn-outline">3</button>
  <button class="btn btn-outline">Next ${I('chevronRight')}</button>
</div>
<div class="btn-group" role="group" aria-label="Actions">
  <button class="btn">Save</button><button class="btn">Publish</button>
</div>`
      },
      {
        title: 'Toggle (single and multiple)',
        description: 'Add <code>data-toggle="single"</code> or <code>"multiple"</code>; buttons get <code>aria-pressed</code> and arrow-key navigation.',
        html: `<div class="btn-group" data-toggle="multiple" aria-label="Text style">
  <button class="btn btn-outline btn-icon" aria-label="Bold" aria-pressed="true">${I('bold')}</button>
  <button class="btn btn-outline btn-icon" aria-label="Italic">${I('italic')}</button>
  <button class="btn btn-outline btn-icon" aria-label="Underline">${I('underline')}</button>
</div>
<div class="btn-group" data-toggle="single" aria-label="Alignment">
  <button class="btn btn-outline btn-icon" aria-label="Left" aria-pressed="true">${I('alignLeft')}</button>
  <button class="btn btn-outline btn-icon" aria-label="Center">${I('alignCenter')}</button>
  <button class="btn btn-outline btn-icon" aria-label="Right">${I('alignRight')}</button>
</div>
<div class="btn-group btn-group-pill" data-toggle="single" aria-label="Billing period">
  <button class="btn btn-sm" aria-pressed="true">Monthly</button>
  <button class="btn btn-sm">Yearly <span class="badge badge-soft badge-success badge-sm">−20%</span></button>
</div>`
      },
      {
        title: 'Split button',
        html: `<div class="btn-group btn-split">
  <button class="btn">${I('git')} Merge pull request</button>
  <button class="btn" aria-label="More merge options" aria-haspopup="menu">${I('chevronDown')}</button>
</div>
<div class="btn-group btn-split">
  <button class="btn btn-outline">${I('download')} Export CSV</button>
  <button class="btn btn-outline" aria-label="More export formats">${I('chevronDown')}</button>
</div>`
      },
      {
        title: 'Vertical',
        html: `<div class="btn-group btn-group-vertical" data-toggle="single" style="width:12rem" aria-label="View">
  <button class="btn btn-outline" aria-pressed="true">${I('grid')} Board</button>
  <button class="btn btn-outline">${I('list')} List</button>
  <button class="btn btn-outline">${I('calendar')} Calendar</button>
</div>`
      }
    ],
    api: [
      { name: '.btn-group', type: 'class', desc: 'Attaches child <code>.btn</code>s.' },
      { name: '.btn-group-vertical', type: 'class', desc: 'Stack vertically.' },
      { name: '.btn-split', type: 'class', desc: 'Main action + narrow caret button.' },
      { name: '.btn-group-pill', type: 'class', desc: 'Segmented control on a muted track.' },
      { name: '.btn-toolbar', type: 'class', desc: 'Wrapping row of groups.' },
      { name: 'data-toggle', type: 'attr', desc: '<code>single</code> or <code>multiple</code>: manages <code>aria-pressed</code>.' },
      { name: 'ranj:change', type: 'event', desc: 'On toggle groups. detail: <code>{ value: [ ... ] }</code> (button <code>data-value</code> or text).' }
    ]
  });
})();
