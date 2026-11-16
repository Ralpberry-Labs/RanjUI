(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var list = s('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>');
  var grid = s('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>');
  var board = s('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>');
  var sun = s('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>');
  var moon = s('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>');
  var mon = s('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>');
  RanjDocs.add({
    id: 'segmented',
    name: 'Segmented control',
    group: 'Forms',
    description: 'iOS-style segmented control: native radios under the hood (arrow keys, forms, no JS required) with a thumb that glides to the selected segment.',
    tags: ['new', 'js'],
    keywords: ['segmented', 'tabs', 'radio buttons', 'view switcher', 'pill tabs'],
    demos: [
      {
        title: 'Default',
        html: `
<div class="segmented" aria-label="Range">
  <label><input type="radio" name="seg-a" value="day">Day</label>
  <label><input type="radio" name="seg-a" value="week" checked>Week</label>
  <label><input type="radio" name="seg-a" value="month">Month</label>
  <label><input type="radio" name="seg-a" value="year">Year</label>
</div>`
      },
      {
        title: 'Icons, counts and variants',
        html: `
<div style="display:grid;gap:1.1rem;justify-items:center">
  <div class="segmented" aria-label="View"><label><input type="radio" name="seg-b" checked>${list}List</label><label><input type="radio" name="seg-b">${grid}Grid</label><label><input type="radio" name="seg-b">${board}Board</label></div>
  <div class="segmented segmented-pill segmented-primary" aria-label="Inbox"><label><input type="radio" name="seg-c" checked>All <span class="segmented-count">24</span></label><label><input type="radio" name="seg-c">Unread <span class="segmented-count">3</span></label><label><input type="radio" name="seg-c">Archived</label></div>
  <div class="segmented segmented-sm" aria-label="Theme"><label aria-label="Light"><input type="radio" name="seg-d">${sun}</label><label aria-label="Dark"><input type="radio" name="seg-d" checked>${moon}</label><label aria-label="System"><input type="radio" name="seg-d">${mon}</label></div>
  <div class="segmented segmented-underline" aria-label="Section"><label><input type="radio" name="seg-e" checked>Overview</label><label><input type="radio" name="seg-e">Activity</label><label><input type="radio" name="seg-e">Settings</label></div>
</div>`
      },
      {
        title: 'Full width in a pricing toggle',
        html: `
<div style="width:22rem;max-width:100%;display:grid;gap:.9rem">
  <div class="segmented segmented-block segmented-lg" aria-label="Billing">
    <label><input type="radio" name="seg-f" value="monthly">Monthly</label>
    <label><input type="radio" name="seg-f" value="yearly" checked>Yearly <span class="segmented-count">−20%</span></label>
  </div>
  <p class="demo-seg-price"><b>$19</b> per seat / month, billed yearly</p>
</div>`,
        js: `
const p = root.querySelector('.demo-seg-price');
root.querySelector('.segmented').addEventListener('ranj:change', e => p.innerHTML = e.detail.value === 'yearly' ? '<b>$19</b> per seat / month, billed yearly' : '<b>$24</b> per seat / month, billed monthly');`,
        css: `.demo-seg-price { text-align: center; font-size: .85rem; color: var(--muted-fg); } .demo-seg-price b { font-size: 1.5rem; color: var(--fg); margin-right: .2rem; }`
      }
    ],
    api: [
      { name: '.segmented', type: 'class', desc: 'Container of <code>&lt;label&gt;&lt;input type="radio"&gt;Text&lt;/label&gt;</code>. Gets <code>role="radiogroup"</code>; give it an <code>aria-label</code>.' },
      { name: '.segmented-sm / .segmented-lg / .segmented-block', type: 'class', desc: 'Sizes and full width.' },
      { name: '.segmented-pill / .segmented-primary / .segmented-underline', type: 'class', desc: 'Variants.' },
      { name: '.segmented-count', type: 'class', desc: 'Small badge inside a segment.' },
      { name: '--seg-bg / --seg-thumb', type: 'var', desc: 'Track and thumb colors.' },
      { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value }</code> (the radio’s value).' }
    ]
  });
})();
