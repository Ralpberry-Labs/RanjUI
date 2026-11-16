(function () {
  var I = window.__ovI;
  var close = '<button class="dialog-close" data-dialog-close aria-label="Close">' + I.x + '</button>';
  var tos = '';
  ['Acceptance of terms', 'Your account', 'Workspace content', 'Acceptable use', 'Billing & renewals', 'Data processing', 'Termination', 'Changes to these terms'].forEach(function (h, i) {
    tos += '<h4>' + (i + 1) + '. ' + h + '</h4><p>By accessing Northwind you agree to be bound by these terms. You are responsible for safeguarding the credentials used to access the service and for any activity under your account. We may update features over time, and will notify workspace owners at least 30 days before any change that materially reduces functionality.</p>';
  });

  RanjDocs.add({
    id: 'dialog',
    name: 'Dialog',
    group: 'Overlays',
    description: 'A modal window that traps focus, locks page scroll and closes with Escape, the backdrop or a close button. Returns focus to the trigger, supports nesting, sizes and scrollable bodies, and animates both in and out.',
    tags: ['js'],
    keywords: ['modal', 'popup', 'lightbox', 'window', 'overlay'],
    demos: [
      {
        title: 'Edit profile',
        html: `
<button class="btn btn-outline" data-dialog-open="dialog-profile">${I.pencil} Edit profile</button>

<div class="dialog-overlay" id="dialog-profile">
  <div class="dialog">
    <div class="dialog-header">
      <h2 class="dialog-title">Edit profile</h2>
      <p class="dialog-description">Make changes to your profile here. Click save when you're done.</p>
    </div>
    <div class="dialog-body">
      <form class="demo-dialog-form" id="dialog-profile-form">
        <label class="label" for="dialog-name">Name</label>
        <input class="input" id="dialog-name" value="Maya Okafor" autofocus>
        <label class="label" for="dialog-user">Username</label>
        <input class="input" id="dialog-user" value="@mayaokafor">
      </form>
    </div>
    <div class="dialog-footer">
      <button class="btn btn-outline" data-dialog-close>Cancel</button>
      <button class="btn" form="dialog-profile-form" type="submit">Save changes</button>
    </div>
    ${close}
  </div>
</div>`,
        js: `root.querySelector('#dialog-profile-form').addEventListener('submit', function (e) {
  e.preventDefault();
  Ranj.dialog.close('dialog-profile');
  Ranj.toast && Ranj.toast.success('Profile updated', { description: 'Your changes are live.' });
});`,
        css: `.demo-dialog-form { display: grid; grid-template-columns: 6rem 1fr; align-items: center; gap: .875rem 1rem; }
.demo-dialog-form .label { justify-self: end; margin: 0; }
@media (max-width: 480px) { .demo-dialog-form { grid-template-columns: 1fr; gap: .4rem; } .demo-dialog-form .label { justify-self: start; } .demo-dialog-form .input + .label { margin-top: .5rem; } }`
      },
      {
        title: 'Sizes',
        description: '<code>.dialog-sm</code>, default, <code>.dialog-lg</code>, <code>.dialog-xl</code> and <code>.dialog-full</code>. Override <code>--dialog-w</code> for anything else.',
        html: `
<button class="btn btn-outline" data-dialog-open="dialog-sm">Small</button>
<button class="btn btn-outline" data-dialog-open="dialog-md">Default</button>
<button class="btn btn-outline" data-dialog-open="dialog-lg">Large</button>
<button class="btn btn-outline" data-dialog-open="dialog-xl">Extra large</button>
<button class="btn btn-outline" data-dialog-open="dialog-full">Fullscreen</button>

<div class="dialog-overlay" id="dialog-sm"><div class="dialog dialog-sm">
  <div class="dialog-header"><h2 class="dialog-title">Rename file</h2><p class="dialog-description">24rem: quick, single-field tasks.</p></div>
  <div class="dialog-body"><input class="input" value="Q3 board update.pdf" style="width:100%"></div>
  <div class="dialog-footer"><button class="btn btn-outline" data-dialog-close>Cancel</button><button class="btn" data-dialog-close>Rename</button></div>${close}
</div></div>
<div class="dialog-overlay" id="dialog-md"><div class="dialog">
  <div class="dialog-header"><h2 class="dialog-title">Share “Launch plan”</h2><p class="dialog-description">32rem: the default for most forms and confirmations.</p></div>
  <div class="dialog-body"><div class="demo-dialog-share"><input class="input" value="https://northwind.app/d/launch-plan" readonly><button class="btn btn-secondary">${I.copy} Copy</button></div></div>
  <div class="dialog-footer"><button class="btn" data-dialog-close>Done</button></div>${close}
</div></div>
<div class="dialog-overlay" id="dialog-lg"><div class="dialog dialog-lg">
  <div class="dialog-header"><h2 class="dialog-title">Import contacts</h2><p class="dialog-description">42rem: room for previews and two-column layouts.</p></div>
  <div class="dialog-body"><div class="demo-dialog-drop">${I.upload}<b>Drop a CSV here</b><span>or click to browse · up to 10,000 rows</span></div></div>
  <div class="dialog-footer"><button class="btn btn-outline" data-dialog-close>Cancel</button><button class="btn" data-dialog-close>Continue</button></div>${close}
</div></div>
<div class="dialog-overlay" id="dialog-xl"><div class="dialog dialog-xl">
  <div class="dialog-header"><h2 class="dialog-title">Choose a template</h2><p class="dialog-description">56rem: galleries and pickers.</p></div>
  <div class="dialog-body"><div class="demo-dialog-grid">${['Roadmap', 'Sprint board', 'OKRs', 'Meeting notes', 'Bug tracker', 'Content calendar', 'CRM', 'Hiring pipeline'].map(function (t, i) { return '<button class="demo-dialog-tpl" style="--h:' + (i * 45) + '"><i></i>' + t + '</button>'; }).join('')}</div></div>
  <div class="dialog-footer"><button class="btn btn-outline" data-dialog-close>Cancel</button><button class="btn" data-dialog-close>Use template</button></div>${close}
</div></div>
<div class="dialog-overlay" id="dialog-full"><div class="dialog dialog-full">
  <div class="dialog-header"><h2 class="dialog-title">Focus mode</h2><p class="dialog-description">Fills the viewport minus a 1rem gutter.</p></div>
  <div class="dialog-body"><div class="demo-dialog-drop" style="height:100%;min-height:12rem">${I.fileText}<b>Untitled draft</b><span>Start writing…</span></div></div>
  <div class="dialog-footer"><button class="btn" data-dialog-close>Exit focus mode</button></div>${close}
</div></div>`,
        css: `.demo-dialog-share { display: flex; gap: .5rem; } .demo-dialog-share .input { flex: 1; min-width: 0; }
.demo-dialog-drop { display: grid; place-items: center; gap: .3rem; padding: 2.5rem 1rem; border: 1.5px dashed var(--border-strong); border-radius: var(--radius-lg); color: var(--muted-fg); text-align: center; font-size: .875rem; }
.demo-dialog-drop svg { width: 1.75rem; height: 1.75rem; color: var(--primary); } .demo-dialog-drop b { color: var(--fg); font-weight: 600; }
.demo-dialog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); gap: .75rem; }
.demo-dialog-tpl { display: flex; flex-direction: column; gap: .5rem; padding: .5rem .5rem .75rem; border: 1px solid var(--border); border-radius: var(--radius-lg); font-size: .8125rem; font-weight: 500; text-align: left; transition: border-color var(--transition), transform var(--transition); }
.demo-dialog-tpl:hover { border-color: var(--primary); transform: translateY(-2px); }
.demo-dialog-tpl i { height: 4.5rem; border-radius: var(--radius); background: linear-gradient(135deg, oklch(.8 .1 var(--h)), oklch(.65 .15 calc(var(--h) + 50))); }`
      },
      {
        title: 'Scrollable body',
        description: 'Add <code>.dialog-scroll</code> to pin the header and footer with hairlines while the body scrolls.',
        html: `
<button class="btn btn-outline" data-dialog-open="dialog-terms">${I.fileText} Review terms</button>

<div class="dialog-overlay" id="dialog-terms">
  <div class="dialog dialog-scroll dialog-lg">
    <div class="dialog-header">
      <h2 class="dialog-title">Terms of service</h2>
      <p class="dialog-description">Last updated November 2, 2026 · 6 min read</p>
    </div>
    <div class="dialog-body demo-dialog-prose">${tos}</div>
    <div class="dialog-footer">
      <label class="demo-dialog-check"><input type="checkbox" id="dialog-terms-ok"> I have read and agree</label>
      <button class="btn btn-outline" data-dialog-close>Decline</button>
      <button class="btn" data-dialog-close id="dialog-terms-accept" disabled>Accept</button>
    </div>
    ${close}
  </div>
</div>`,
        js: `var ok = root.querySelector('#dialog-terms-ok'), b = root.querySelector('#dialog-terms-accept');
ok.addEventListener('change', function () { b.disabled = !ok.checked; });`,
        css: `.demo-dialog-prose h4 { font-size: .875rem; font-weight: 600; margin: 1.1rem 0 .3rem; } .demo-dialog-prose h4:first-child { margin-top: 0; }
.demo-dialog-prose p { color: var(--muted-fg); font-size: .875rem; line-height: 1.65; }
.demo-dialog-check { display: inline-flex; align-items: center; gap: .5rem; margin-right: auto; font-size: .8125rem; color: var(--muted-fg); }
.demo-dialog-check input { accent-color: var(--primary); width: 1rem; height: 1rem; }`
      },
      {
        title: 'Nested dialogs',
        description: 'Open a dialog from inside a dialog. The one underneath recedes; Escape closes only the topmost.',
        html: `
<button class="btn" data-dialog-open="dialog-invite">${I.userPlus} Invite teammates</button>

<div class="dialog-overlay" id="dialog-invite">
  <div class="dialog">
    <div class="dialog-header">
      <h2 class="dialog-title">Invite to Acme Design</h2>
      <p class="dialog-description">Teammates get access to every project in this workspace.</p>
    </div>
    <div class="dialog-body">
      <div class="demo-dialog-invites">
        <div><span class="demo-ov-avatar" style="--h:20;width:32px;height:32px;font-size:12px">JL</span><span><b>Jonas Lind</b><small>jonas@acme.co</small></span><em>Editor</em></div>
        <div><span class="demo-ov-avatar" style="--h:160;width:32px;height:32px;font-size:12px">PR</span><span><b>Priya Raman</b><small>priya@acme.co</small></span><em>Viewer</em></div>
        <div><span class="demo-ov-avatar" style="--h:290;width:32px;height:32px;font-size:12px">DK</span><span><b>Diego Kim</b><small>diego@acme.co</small></span><em>Admin</em></div>
      </div>
    </div>
    <div class="dialog-footer">
      <button class="btn btn-ghost dialog-footer-start" data-dialog-open="dialog-invite-discard">Discard</button>
      <button class="btn btn-outline" data-dialog-close>Back</button>
      <button class="btn" data-dialog-close>Send 3 invites</button>
    </div>
    ${close}
  </div>
</div>

<div class="dialog-overlay" id="dialog-invite-discard">
  <div class="dialog dialog-sm alert-dialog">
    <div class="dialog-header">
      <div class="dialog-icon" style="background:var(--destructive-soft);color:var(--destructive-soft-fg)">${I.trash}</div>
      <h2 class="dialog-title">Discard 3 invites?</h2>
      <p class="dialog-description">The people you added won't be notified.</p>
    </div>
    <div class="dialog-footer">
      <button class="btn btn-outline" data-dialog-close>Keep editing</button>
      <button class="btn btn-destructive" id="dialog-discard-yes">Discard</button>
    </div>
  </div>
</div>`,
        js: `root.querySelector('#dialog-discard-yes').onclick = function () {
  Ranj.dialog.close('dialog-invite-discard');
  Ranj.dialog.close('dialog-invite');
};`,
        css: `.demo-dialog-invites { display: grid; gap: .25rem; }
.demo-dialog-invites > div { display: flex; align-items: center; gap: .75rem; padding: .5rem; border-radius: var(--radius); }
.demo-dialog-invites > div:hover { background: var(--muted); }
.demo-dialog-invites span:nth-child(2) { display: flex; flex-direction: column; line-height: 1.3; min-width: 0; flex: 1; }
.demo-dialog-invites b { font-size: .875rem; font-weight: 600; } .demo-dialog-invites small { color: var(--muted-fg); font-size: .75rem; }
.demo-dialog-invites em { font-style: normal; font-size: .75rem; color: var(--muted-fg); border: 1px solid var(--border); padding: .1rem .5rem; border-radius: 99px; }`
      },
      {
        title: 'Static backdrop & events',
        description: '<code>data-static</code> ignores backdrop clicks and Escape with a gentle bump instead. Listen for <code>ranj:open</code> / <code>ranj:close</code>, or call <code>Ranj.dialog.open(id)</code>.',
        html: `
<button class="btn" id="dialog-api-open">${I.rocket} Deploy to production</button>
<code class="demo-dialog-log" id="dialog-log">waiting…</code>

<div class="dialog-overlay dialog-overlay-blur" id="dialog-deploy" data-static>
  <div class="dialog dialog-sm">
    <div class="dialog-header">
      <div class="dialog-icon">${I.rocket}</div>
      <h2 class="dialog-title">Deploy northwind-web?</h2>
      <p class="dialog-description">Commit <code>a41f2c9</code> on <b>main</b> will be promoted to <b>northwind.app</b>. Click outside or press Esc: it won't close.</p>
    </div>
    <div class="dialog-footer">
      <button class="btn btn-outline" data-dialog-close data-value="cancel">Cancel</button>
      <button class="btn" data-dialog-close data-value="deploy">Deploy</button>
    </div>
  </div>
</div>`,
        js: `var log = root.querySelector('#dialog-log'), ov = root.querySelector('#dialog-deploy');
root.querySelector('#dialog-api-open').onclick = function () { Ranj.dialog.open('dialog-deploy'); };
ov.addEventListener('ranj:open', function () { log.textContent = 'ranj:open'; });
ov.addEventListener('ranj:close', function (e) { log.textContent = 'ranj:close · reason=' + e.detail.reason + (e.detail.value ? ' · value=' + e.detail.value : ''); });`,
        css: `.demo-dialog-log { font-family: var(--font-mono); font-size: .75rem; color: var(--muted-fg); background: var(--muted); padding: .35rem .6rem; border-radius: var(--radius-sm); }
#dialog-deploy .dialog-description code { font-family: var(--font-mono); font-size: .8em; background: var(--muted); padding: .1em .35em; border-radius: 4px; }`
      }
    ],
    api: [
      { name: '.dialog-overlay', type: 'class', desc: 'Full-screen layer + backdrop. Needs an <code>id</code>. Variants: <code>.dialog-overlay-blur</code>, <code>.dialog-overlay-clear</code>, <code>.dialog-overlay-top</code>.' },
      { name: '.dialog', type: 'class', desc: 'The panel. Parts: <code>.dialog-header .dialog-title .dialog-description .dialog-body .dialog-footer .dialog-close .dialog-icon</code>.' },
      { name: '.dialog-sm / -lg / -xl / -full', type: 'class', desc: 'Width presets (24 / 42 / 56rem / viewport).' },
      { name: '.dialog-scroll', type: 'class', desc: 'Pinned header & footer with dividers; body scrolls.' },
      { name: '--dialog-w', type: 'var', default: '32rem', desc: 'Max width of the panel.' },
      { name: 'data-dialog-open="id"', type: 'attr', desc: 'On any element: opens the dialog (focus returns here on close).' },
      { name: 'data-dialog-close', type: 'attr', desc: 'Inside a dialog: closes it. Optional <code>data-value</code> is passed in the close event.' },
      { name: 'data-static', type: 'attr', desc: 'On the overlay: backdrop click and Escape bump instead of closing.' },
      { name: 'autofocus', type: 'attr', desc: 'Element to focus on open (default: first focusable that is not the close button).' },
      { name: 'Ranj.dialog.open(id, { trigger, focus })', type: 'js', desc: 'Open by id or element. Also <code>close(id, { value })</code>, <code>toggle(id)</code>, <code>isOpen(id)</code>.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On the overlay. <code>close</code> detail: <code>{ reason: "escape"|"backdrop"|"button"|"api", value }</code>.' },
      { name: 'ranj:beforeclose', type: 'event', desc: 'Cancelable: call <code>preventDefault()</code> to keep it open (e.g. unsaved changes).' }
    ]
  });
})();
