(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'dropdown-menu',
    name: 'Dropdown Menu',
    group: 'Overlays',
    description: 'A menu of actions opened from a button. Full keyboard support (arrows, Home/End, type-to-jump, → ← for submenus), checkbox and radio items, shortcuts, labels, separators and destructive items. v1 markup (<code>.dropdown</code> + <code>data-dropdown-trigger</code>) keeps working.',
    tags: ['js'],
    keywords: ['menu', 'actions', 'more', 'kebab', 'select menu', 'options'],
    demos: [
      {
        title: 'Account menu',
        description: 'Try it with the keyboard: Tab to the button, press ↓, type “s” to jump to Settings, → to open Invite users.',
        html: `
<div class="dropdown">
  <button class="btn btn-outline" data-dropdown-trigger>${I.avatar('MO', 20, 22)} Maya Okafor ${I.svg('chevronDown', null, 'class="dropdown-chevron"')}</button>
  <div class="dropdown-menu" style="--menu-w: 15rem">
    <div class="dropdown-header">${I.avatar('MO', 20, 34)}<div class="dropdown-header-text"><b>Maya Okafor</b><span>maya@northwind.app</span></div></div>
    <div class="dropdown-separator"></div>
    <button class="dropdown-item">${I.user} Profile <span class="dropdown-shortcut">⇧⌘P</span></button>
    <button class="dropdown-item">${I.card} Billing <span class="dropdown-shortcut">⌘B</span></button>
    <button class="dropdown-item">${I.settings} Settings <span class="dropdown-shortcut">⌘,</span></button>
    <button class="dropdown-item">${I.keyboard} Keyboard shortcuts <span class="dropdown-shortcut">⌘K</span></button>
    <div class="dropdown-separator"></div>
    <button class="dropdown-item">${I.users} Team</button>
    <div class="dropdown-sub">
      <button class="dropdown-item">${I.userPlus} Invite users</button>
      <div class="dropdown-menu">
        <button class="dropdown-item">${I.mail} Email</button>
        <button class="dropdown-item">${I.message} Message</button>
        <div class="dropdown-separator"></div>
        <button class="dropdown-item">${I.link} Copy invite link</button>
      </div>
    </div>
    <button class="dropdown-item">${I.plus} New team <span class="dropdown-shortcut">⌘T</span></button>
    <div class="dropdown-separator"></div>
    <a class="dropdown-item" href="#">${I.github} GitHub</a>
    <button class="dropdown-item">${I.lifebuoy} Support</button>
    <button class="dropdown-item" disabled>${I.cloud} API <span class="dropdown-shortcut">Soon</span></button>
    <div class="dropdown-separator"></div>
    <button class="dropdown-item">${I.logout} Log out <span class="dropdown-shortcut">⇧⌘Q</span></button>
  </div>
</div>`
      },
      {
        title: 'Checkbox & radio items',
        description: 'Checkable items stay open so you can toggle several. Listen for <code>ranj:select</code>.',
        html: `
<div class="dropdown">
  <button class="btn btn-outline" data-dropdown-trigger>${I.eye} View</button>
  <div class="dropdown-menu" style="--menu-w: 14rem">
    <div class="dropdown-label">Appearance</div>
    <button class="dropdown-item" aria-checked="true" data-value="statusbar">Status bar <span class="dropdown-shortcut">⌘/</span></button>
    <button class="dropdown-item" aria-checked="false" data-value="activity">Activity bar</button>
    <button class="dropdown-item" aria-checked="true" data-value="minimap">Minimap</button>
    <div class="dropdown-separator"></div>
    <div class="dropdown-label">Panel position</div>
    <div class="dropdown-radio-group">
      <button class="dropdown-item" aria-checked="false" data-value="top">Top</button>
      <button class="dropdown-item" aria-checked="true" data-value="bottom">Bottom</button>
      <button class="dropdown-item" aria-checked="false" data-value="right">Right</button>
    </div>
  </div>
</div>
<code class="demo-dd-log" id="dropdown-log">ranj:select →</code>`,
        js: `var log = root.querySelector('#dropdown-log');
root.addEventListener('ranj:select', function (e) { log.textContent = 'ranj:select → ' + e.detail.value + (e.detail.checked != null ? ' = ' + e.detail.checked : ''); });`,
        css: `.demo-dd-log { font-family: var(--font-mono); font-size: .75rem; color: var(--muted-fg); background: var(--muted); padding: .35rem .6rem; border-radius: var(--radius-sm); }`
      },
      {
        title: 'Row actions',
        description: 'An icon trigger aligned to the end (<code>data-placement="bottom-end"</code>) with a destructive item.',
        html: `
<div class="demo-dd-file">
  <span class="demo-dd-icon">${I.fileText}</span>
  <span><b>Q3 board update.pdf</b><small>2.4 MB · Edited 3h ago by Jonas</small></span>
  <div class="dropdown" data-placement="bottom-end">
    <button class="btn btn-ghost btn-icon btn-sm" data-dropdown-trigger aria-label="More actions">${I.more}</button>
    <div class="dropdown-menu">
      <button class="dropdown-item">${I.eye} Open</button>
      <button class="dropdown-item">${I.pencil} Rename <span class="dropdown-shortcut">F2</span></button>
      <button class="dropdown-item">${I.copy} Duplicate <span class="dropdown-shortcut">⌘D</span></button>
      <div class="dropdown-sub">
        <button class="dropdown-item">${I.folder} Move to</button>
        <div class="dropdown-menu">
          <button class="dropdown-item">${I.folder} Board meetings</button>
          <button class="dropdown-item">${I.folder} Finance</button>
          <button class="dropdown-item">${I.folder} Archive 2025</button>
        </div>
      </div>
      <button class="dropdown-item">${I.download} Download</button>
      <div class="dropdown-separator"></div>
      <button class="dropdown-item dropdown-item-destructive">${I.trash} Delete <span class="dropdown-shortcut">⌫</span></button>
    </div>
  </div>
</div>`,
        css: `.demo-dd-file { display: flex; align-items: center; gap: .75rem; width: min(26rem, calc(100vw - 4rem)); padding: .75rem .75rem .75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); }
.demo-dd-icon { display: grid; place-items: center; width: 2.25rem; height: 2.25rem; border-radius: var(--radius); background: var(--destructive-soft); color: var(--destructive-soft-fg); flex-shrink: 0; } .demo-dd-icon svg { width: 1.1rem; height: 1.1rem; }
.demo-dd-file > span:nth-child(2) { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.35; font-size: .875rem; }
.demo-dd-file b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .demo-dd-file small { color: var(--muted-fg); font-size: .75rem; }
.demo-dd-file .btn-icon svg { width: 1rem; height: 1rem; }`
      },
      {
        title: 'Glass menu',
        description: '<code>.menu-glass</code> gives a frosted, translucent surface.',
        bg: 'grid',
        html: `
<div class="demo-dd-glass">
  <div class="dropdown">
    <button class="btn" data-dropdown-trigger>${I.sparkles} Generate ${I.svg('chevronDown', null, 'class="dropdown-chevron"')}</button>
    <div class="dropdown-menu menu-glass">
      <button class="dropdown-item">${I.fileText} <span class="dropdown-item-text">Summary<span class="dropdown-item-desc">Key points in 5 bullets</span></span></button>
      <button class="dropdown-item">${I.wand} <span class="dropdown-item-text">Rewrite<span class="dropdown-item-desc">Clearer, same meaning</span></span></button>
      <button class="dropdown-item">${I.globe} <span class="dropdown-item-text">Translate<span class="dropdown-item-desc">Into 40+ languages</span></span></button>
    </div>
  </div>
</div>`,
        css: `.demo-dd-glass { width: min(30rem, calc(100vw - 4rem)); display: flex; justify-content: center; padding: 2rem 0 10rem; border-radius: var(--radius-xl); background: radial-gradient(circle at 20% 30%, oklch(.75 .15 calc(var(--hue) + 80) / .55), transparent 55%), radial-gradient(circle at 80% 70%, oklch(.7 .18 var(--hue) / .5), transparent 55%); }`
      }
    ],
    api: [
      { name: '.dropdown', type: 'class', desc: 'Wrapper with a <code>[data-dropdown-trigger]</code> and a <code>.dropdown-menu</code>. <code>.dropdown-right</code> aligns to the end (v1).' },
      { name: '.dropdown-item', type: 'class', desc: 'Button or link. <code>disabled</code> to disable; <code>.dropdown-item-destructive</code> for danger.' },
      { name: 'aria-checked / data-checkbox', type: 'attr', desc: 'Makes an item a checkbox item. Inside <code>.dropdown-radio-group</code> items become radios.' },
      { name: '.dropdown-sub', type: 'class', desc: 'Wrap an item + nested <code>.dropdown-menu</code> to create a submenu.' },
      { name: '.dropdown-label / -separator', type: 'class', desc: 'Structure and adornments; also <code>.dropdown-header</code>, <code>.dropdown-shortcut</code>, <code>.dropdown-item-desc</code>.' },
      { name: '.menu-glass', type: 'class', desc: 'Frosted translucent surface.' },
      { name: 'data-placement', type: 'attr', default: 'bottom-start', desc: 'On <code>.dropdown</code>. Flips automatically.' },
      { name: 'data-keep-open / data-close', type: 'attr', desc: 'Keep a normal item open after select / close after a checkable item.' },
      { name: '--menu-w', type: 'var', default: '12rem', desc: 'Minimum width.' },
      { name: 'Ranj.dropdown.open(el, "first") / close(el)', type: 'js', desc: 'Programmatic control (el = .dropdown or trigger).' },
      { name: 'ranj:select', type: 'event', desc: 'Bubbles from the item: <code>{ item, value, checked }</code>. Cancel to keep the menu open.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On <code>.dropdown</code>.' }
    ]
  });
})();
