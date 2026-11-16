(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  RanjDocs.add({
    id: 'checkbox',
    name: 'Checkbox',
    group: 'Forms',
    description: 'A real <code>&lt;input type="checkbox"&gt;</code> with a custom box: the check draws itself in, the box pops, and indeterminate, sizes, descriptions and selectable cards are built in.',
    keywords: ['check', 'tick', 'indeterminate', 'select all', 'checkbox card', 'todo'],
    demos: [
      {
        title: 'Default',
        html: `
<div class="checkbox-group">
  <label class="checkbox"><input type="checkbox" checked><span class="checkbox-mark"></span>Email me about product updates</label>
  <label class="checkbox"><input type="checkbox"><span class="checkbox-mark"></span>Send weekly digest</label>
  <label class="checkbox"><input type="checkbox" disabled><span class="checkbox-mark"></span>SMS alerts (verify phone first)</label>
  <label class="checkbox"><input type="checkbox" checked disabled><span class="checkbox-mark"></span>Security notices (required)</label>
</div>`
      },
      {
        title: 'Select all (indeterminate)',
        description: 'A checkbox with <code>data-check-all="name"</code> controls every checkbox with that name and shows the mixed state.',
        html: `
<div class="demo-checkbox-list" data-check-scope>
  <label class="checkbox demo-checkbox-head"><input type="checkbox" data-check-all="files"><span class="checkbox-mark"></span>Select all files</label>
  <label class="checkbox"><input type="checkbox" name="files" checked><span class="checkbox-mark"></span>Q4-roadmap.pdf <small>2.4 MB</small></label>
  <label class="checkbox"><input type="checkbox" name="files"><span class="checkbox-mark"></span>brand-guidelines.fig <small>18 MB</small></label>
  <label class="checkbox"><input type="checkbox" name="files" checked><span class="checkbox-mark"></span>customer-interviews.mp4 <small>412 MB</small></label>
</div>`,
        css: `
.demo-checkbox-list { display: flex; flex-direction: column; width: 22rem; max-width: 100%; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); overflow: hidden; }
.demo-checkbox-list .checkbox { padding: .7rem .9rem; border-top: 1px solid var(--border); }
.demo-checkbox-list .checkbox small { margin-left: auto; color: var(--muted-fg); font-size: .75rem; }
.demo-checkbox-list .demo-checkbox-head { border-top: 0; background: var(--bg-subtle); font-weight: 500; }`
      },
      {
        title: 'With description, sizes and colors',
        html: `
<div style="display:grid;gap:1.25rem;width:24rem;max-width:100%">
  <label class="checkbox"><input type="checkbox" checked><span class="checkbox-mark"></span>
    <span class="checkbox-body"><span class="checkbox-label">Two-factor authentication</span><span class="checkbox-desc">Require a code from your authenticator app when signing in on a new device.</span></span>
  </label>
  <div class="checkbox-group checkbox-group-horizontal">
    <label class="checkbox checkbox-sm"><input type="checkbox" checked><span class="checkbox-mark"></span>Small</label>
    <label class="checkbox"><input type="checkbox" checked><span class="checkbox-mark"></span>Default</label>
    <label class="checkbox checkbox-lg"><input type="checkbox" checked><span class="checkbox-mark"></span>Large</label>
    <label class="checkbox checkbox-round checkbox-success"><input type="checkbox" checked><span class="checkbox-mark"></span>Round</label>
    <label class="checkbox checkbox-destructive"><input type="checkbox" checked><span class="checkbox-mark"></span>Danger</label>
    <label class="checkbox"><input type="checkbox" data-indeterminate><span class="checkbox-mark"></span>Mixed</label>
  </div>
</div>`
      },
      {
        title: 'Todo list',
        description: '<code>.checkbox-strike</code> crosses out completed items.',
        html: `
<div class="checkbox-group" style="width:20rem;max-width:100%">
  <label class="checkbox checkbox-strike checkbox-round"><input type="checkbox" checked><span class="checkbox-mark"></span><span>Draft launch announcement</span></label>
  <label class="checkbox checkbox-strike checkbox-round"><input type="checkbox" checked><span class="checkbox-mark"></span><span>Record product demo</span></label>
  <label class="checkbox checkbox-strike checkbox-round"><input type="checkbox"><span class="checkbox-mark"></span><span>Schedule social posts</span></label>
  <label class="checkbox checkbox-strike checkbox-round"><input type="checkbox"><span class="checkbox-mark"></span><span>Email the beta list</span></label>
</div>`
      },
      {
        title: 'Checkbox cards',
        html: `
<div class="card-grid" style="width:40rem;max-width:100%">
  <label class="checkbox-card"><input type="checkbox" checked><span class="checkbox-mark"></span>
    <span class="checkbox-body"><span class="checkbox-label">Analytics</span><span class="checkbox-desc">Funnels, retention and live dashboards.</span></span></label>
  <label class="checkbox-card"><input type="checkbox"><span class="checkbox-mark"></span>
    <span class="checkbox-body"><span class="checkbox-label">Session replay</span><span class="checkbox-desc">Watch how people really use your app.</span></span></label>
  <label class="checkbox-card"><input type="checkbox" checked><span class="checkbox-mark"></span>
    <span class="checkbox-body"><span class="checkbox-label">Feature flags</span><span class="checkbox-desc">Ship safely to 1% first.</span></span></label>
</div>`
      }
    ],
    api: [
      { name: '.checkbox', type: 'class', desc: '<code>&lt;label class="checkbox"&gt;&lt;input type="checkbox"&gt;&lt;span class="checkbox-mark"&gt;&lt;/span&gt;Text&lt;/label&gt;</code>. The mark is inserted if missing. A bare <code>&lt;input class="checkbox"&gt;</code> also works.' },
      { name: '.checkbox-sm / .checkbox-lg / .checkbox-round', type: 'class', desc: 'Sizes and a circular box.' },
      { name: '.checkbox-success / .checkbox-destructive', type: 'class', desc: 'Colors (or set <code>--check</code>).' },
      { name: '.checkbox-strike', type: 'class', desc: 'Strike through the label when checked.' },
      { name: '.checkbox-body / .checkbox-label / .checkbox-desc', type: 'class', desc: 'Label with a description line.' },
      { name: '.checkbox-card / .card-grid', type: 'class', desc: 'Selectable card and a responsive grid for them.' },
      { name: '.checkbox-group / .checkbox-group-horizontal', type: 'class', desc: 'Stacks.' },
      { name: 'data-indeterminate', type: 'attr', desc: 'Start in the mixed state.' },
      { name: 'data-check-all="name"', type: 'attr', desc: '“Select all” for checkboxes with that name (scoped to the form or <code>[data-check-scope]</code>).' },
      { name: '--size / --check', type: 'var', default: '1.0625rem / --primary', desc: 'Box size and checked color.' }
    ]
  });
})();
