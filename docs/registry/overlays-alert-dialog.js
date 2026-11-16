(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'alert-dialog',
    name: 'Alert Dialog',
    group: 'Overlays',
    description: 'An interrupting confirmation that needs an answer. The backdrop never dismisses it. Use it as markup, or call <code>Ranj.confirm()</code> and <code>Ranj.prompt()</code>, which return promises.',
    tags: ['js'],
    keywords: ['confirm', 'are you sure', 'prompt', 'delete confirmation', 'modal'],
    demos: [
      {
        title: 'Destructive confirmation',
        html: `
<button class="btn btn-destructive" data-dialog-open="alert-dialog-delete">${I.trash} Delete project</button>

<div class="dialog-overlay" id="alert-dialog-delete">
  <div class="dialog alert-dialog alert-dialog-danger">
    <div class="alert-dialog-body">
      <div class="alert-dialog-media">${I.alert}</div>
      <div class="alert-dialog-text">
        <h2 class="alert-dialog-title">Delete “Atlas Redesign”?</h2>
        <p class="alert-dialog-description">This permanently deletes the project, its 48 files and 312 comments. This action cannot be undone.</p>
      </div>
    </div>
    <div class="alert-dialog-footer">
      <button class="btn btn-outline" data-dialog-close autofocus>Cancel</button>
      <button class="btn btn-destructive" data-dialog-close>Delete project</button>
    </div>
  </div>
</div>`
      },
      {
        title: 'Ranj.confirm()',
        description: 'Builds the dialog for you and resolves to <code>true</code> or <code>false</code>. Pass <code>onConfirm</code> returning a promise to show a loading state until it settles.',
        html: `
<button class="btn btn-outline" id="alert-dialog-c1">${I.logout} Sign out</button>
<button class="btn btn-outline" id="alert-dialog-c2">${I.archive} Archive 12 threads</button>
<button class="btn btn-destructive" id="alert-dialog-c3">${I.trash} Revoke API key</button>
<p class="demo-alert-dialog-out" id="alert-dialog-out">Result appears here</p>`,
        js: `var out = root.querySelector('#alert-dialog-out');
function show(label, v) { out.textContent = label + ' → ' + JSON.stringify(v); }
root.querySelector('#alert-dialog-c1').onclick = function () {
  Ranj.confirm({ title: 'Sign out of Northwind?', description: 'You will need to sign in again on this device.', confirmText: 'Sign out' })
    .then(function (ok) { show('confirm', ok); });
};
root.querySelector('#alert-dialog-c2').onclick = function () {
  Ranj.confirm({ title: 'Archive 12 threads?', description: 'They move to Archive and stop notifying you. Saving takes a moment.', confirmText: 'Archive',
    onConfirm: function () { return new Promise(function (r) { setTimeout(r, 1400); }); } })
    .then(function (ok) { show('async confirm', ok); });
};
root.querySelector('#alert-dialog-c3').onclick = function () {
  Ranj.confirm({ title: 'Revoke “production-ci”?', description: 'Any service using this key will immediately lose access. Created by Ana Souza on Mar 4.', confirmText: 'Revoke key', danger: true })
    .then(function (ok) { show('danger', ok); });
};`,
        css: `.demo-alert-dialog-out { width: 100%; text-align: center; font-family: var(--font-mono); font-size: .75rem; color: var(--muted-fg); }`
      },
      {
        title: 'Ranj.prompt()',
        description: 'Asks for a value with optional validation. Resolves to the string, or <code>null</code> when cancelled.',
        html: `
<button class="btn" id="alert-dialog-p">${I.folder} New folder</button>
<p class="demo-alert-dialog-out" id="alert-dialog-pout">No folder yet</p>`,
        js: `var out = root.querySelector('#alert-dialog-pout');
root.querySelector('#alert-dialog-p').onclick = function () {
  Ranj.prompt({ title: 'Create folder', description: 'Folders help you group related documents.', label: 'Folder name', placeholder: 'e.g. Q4 Planning', confirmText: 'Create',
    validate: function (v) { return v.trim().length < 2 ? 'Use at least 2 characters' : /[\\/:*?]/.test(v) ? 'Avoid / : * ?' : true; } })
    .then(function (v) { out.textContent = v === null ? 'Cancelled' : 'Created “' + v + '”'; });
};`
      },
      {
        title: 'Centered',
        html: `
<button class="btn btn-outline" data-dialog-open="alert-dialog-session">${I.clock} Session timeout</button>

<div class="dialog-overlay" id="alert-dialog-session">
  <div class="dialog alert-dialog alert-dialog-centered" style="--dialog-w: 22rem">
    <div class="alert-dialog-body">
      <div class="alert-dialog-media">${I.clock}</div>
      <div class="alert-dialog-text">
        <h2 class="alert-dialog-title">Still there?</h2>
        <p class="alert-dialog-description">You'll be signed out in 2 minutes due to inactivity.</p>
      </div>
    </div>
    <div class="alert-dialog-footer">
      <button class="btn btn-outline" data-dialog-close>Sign out</button>
      <button class="btn" data-dialog-close autofocus>Stay signed in</button>
    </div>
  </div>
</div>`
      }
    ],
    api: [
      { name: '.alert-dialog', type: 'class', desc: 'Add to a <code>.dialog</code> inside a <code>.dialog-overlay</code>. Gets <code>role="alertdialog"</code>; backdrop clicks bump instead of closing.' },
      { name: '.alert-dialog-body / -footer', type: 'class', desc: 'Layout parts: <code>-media</code> (icon), <code>-text</code>, <code>-title</code>, <code>-description</code>. Stacks and centers on phones.' },
      { name: '.alert-dialog-danger', type: 'class', desc: 'Red icon tile.' },
      { name: '.alert-dialog-centered', type: 'class', desc: 'Centered layout with equal-width buttons.' },
      { name: 'Ranj.confirm(opts)', type: 'js', desc: '→ <code>Promise&lt;boolean&gt;</code>. opts: <code>title, description, confirmText, cancelText, danger, icon, centered, onConfirm(): Promise</code>.' },
      { name: 'Ranj.prompt(opts)', type: 'js', desc: '→ <code>Promise&lt;string|null&gt;</code>. Adds <code>label, placeholder, defaultValue, type, validate(v) → true | "error"</code>.' }
    ]
  });
})();
