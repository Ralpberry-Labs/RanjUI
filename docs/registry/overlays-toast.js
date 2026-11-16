(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'toast',
    name: 'Toast',
    group: 'Feedback',
    description: 'Sonner-quality notifications. Toasts stack into a tidy pile, fan out on hover (pausing their timers), swipe away sideways, and come in success, error, warning, info and loading flavors, with actions, promise tracking, six positions and a polite live region.',
    tags: ['js'],
    keywords: ['notification', 'snackbar', 'sonner', 'alert', 'message', 'flash'],
    demos: [
      {
        title: 'Types',
        description: 'Fire a few in a row, then hover the stack to expand it.',
        html: `
<button class="btn btn-outline" id="toast-default">Default</button>
<button class="btn btn-outline" id="toast-success">${I.checkCircle} Success</button>
<button class="btn btn-outline" id="toast-error">${I.alertCircle} Error</button>
<button class="btn btn-outline" id="toast-warning">${I.alert} Warning</button>
<button class="btn btn-outline" id="toast-info">${I.info} Info</button>
<button class="btn btn-outline" id="toast-loading">Loading</button>`,
        js: `var $ = function (s) { return root.querySelector(s); };
$('#toast-default').onclick = function () { Ranj.toast('Event has been created', { description: 'Sunday, December 03, 2026 at 9:00 AM' }); };
$('#toast-success').onclick = function () { Ranj.toast.success('Payment received', { description: '$2,400.00 from Lumen Studio · Invoice #1042' }); };
$('#toast-error').onclick = function () { Ranj.toast.error('Upload failed', { description: 'brand-video.mp4 exceeds the 2 GB limit.' }); };
$('#toast-warning').onclick = function () { Ranj.toast.warning('Storage almost full', { description: 'You have used 9.4 GB of 10 GB.' }); };
$('#toast-info').onclick = function () { Ranj.toast.info('New version available', { description: 'Reload to get v4.2.1.' }); };
$('#toast-loading').onclick = function () { var id = Ranj.toast.loading('Syncing 248 contacts…'); setTimeout(function () { Ranj.toast.update(id, { type: 'success', title: 'Contacts synced', description: '248 contacts are up to date.' }); }, 2200); };`
      },
      {
        title: 'Promise',
        description: '<code>Ranj.toast.promise()</code> shows a loading state and morphs into success or error when the promise settles.',
        html: `
<button class="btn" id="toast-promise-ok">${I.rocket} Deploy</button>
<button class="btn btn-outline" id="toast-promise-fail">${I.upload} Publish (fails)</button>`,
        js: `function wait(ms, fail) { return new Promise(function (res, rej) { setTimeout(function () { fail ? rej(new Error('Build step "lint" exited with code 1')) : res({ url: 'northwind-git-main.vercel.app' }); }, ms); }); }
root.querySelector('#toast-promise-ok').onclick = function () {
  Ranj.toast.promise(wait(2000), { loading: 'Deploying northwind-web…', success: function (r) { return { title: 'Deployed in 41s', description: r.url }; }, error: 'Deploy failed' });
};
root.querySelector('#toast-promise-fail').onclick = function () {
  Ranj.toast.promise(wait(1600, true), { loading: 'Publishing changelog…', success: 'Published', error: function (e) { return { title: 'Publish failed', description: e.message }; } });
};`
      },
      {
        title: 'Actions & rich colors',
        html: `
<button class="btn btn-outline" id="toast-undo">${I.trash} Delete message</button>
<button class="btn btn-outline" id="toast-invite">${I.userPlus} Invite request</button>
<button class="btn btn-outline" id="toast-rich">${I.sparkles} Rich colors</button>`,
        js: `root.querySelector('#toast-undo').onclick = function () {
  Ranj.toast('Message deleted', { description: 'Moved to Trash.', action: { label: 'Undo', onClick: function () { Ranj.toast.success('Message restored'); } } });
};
root.querySelector('#toast-invite').onclick = function () {
  Ranj.toast('Priya Raman wants to join Design', { description: 'priya@acme.co · requested 2 min ago', duration: 8000,
    cancel: { label: 'Decline' }, action: { label: 'Approve', onClick: function () { Ranj.toast.success('Priya joined Design'); } } });
};
var n = 0;
root.querySelector('#toast-rich').onclick = function () {
  var t = ['success', 'error', 'warning', 'info'][n++ % 4];
  var copy = { success: ['Backup complete', '14.2 GB archived to cold storage.'], error: ['Card declined', 'Your bank rejected the charge of $49.00.'], warning: ['Unusual sign-in', 'New login from Lisbon, Portugal.'], info: ['Scheduled maintenance', 'Saturday 02:00–03:00 UTC.'] }[t];
  Ranj.toast({ type: t, title: copy[0], description: copy[1], rich: true });
};`
      },
      {
        title: 'Positions',
        html: `
<div class="demo-toast-pos">
  ${['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(function (p) { return '<button class="btn btn-secondary btn-sm" data-toast="Saved to ' + p + '" data-toast-description="Toasts from each corner keep their own stack." data-toast-position="' + p + '">' + p + '</button>'; }).join('')}
</div>`,
        css: `.demo-toast-pos { display: grid; grid-template-columns: repeat(3, auto); gap: .5rem; } @media (max-width: 480px) { .demo-toast-pos { grid-template-columns: repeat(2, auto); } }`
      },
      {
        title: 'Static preview',
        description: 'The same styles render inline with <code>.toast.toast-static</code>, handy for layouts and empty states.',
        html: `
<div class="demo-toast-static">
  <div class="toast toast-static toast-success"><div class="toast-icon">${'<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.7 7.7a1 1 0 0 0-1.4-1.4L10.5 13l-1.8-1.8a1 1 0 1 0-1.4 1.4l2.5 2.5a1 1 0 0 0 1.4 0l5.5-5.4Z" clip-rule="evenodd"/></svg>'}</div><div class="toast-content"><div class="toast-title">Changes saved</div><div class="toast-description">Your workspace settings are up to date.</div></div></div>
  <div class="toast toast-static"><div class="toast-content"><div class="toast-title">Archived 3 conversations</div></div><div class="toast-actions"><button class="toast-action">Undo</button></div></div>
  <div class="toast toast-static toast-error toast-rich"><div class="toast-icon">${'<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5a1 1 0 0 1 1 1v4.5a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm0 8.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" clip-rule="evenodd"/></svg>'}</div><div class="toast-content"><div class="toast-title">Connection lost</div><div class="toast-description">Retrying in 5 seconds…</div></div></div>
</div>`,
        css: `.demo-toast-static { display: grid; gap: .75rem; width: min(22.5rem, calc(100vw - 4rem)); }`
      }
    ],
    api: [
      { name: 'Ranj.toast(title | opts, opts?)', type: 'js', desc: 'Shows a toast, returns its id. opts: <code>title, description, type, duration (4000), position, action {label, onClick}, cancel, icon, avatar, rich, progress, closeButton, dismissible, html, id, onDismiss, onAutoClose</code>.' },
      { name: 'Ranj.toast.success / error / warning / info / loading', type: 'js', desc: '<code>(title, opts)</code> shortcuts. Loading toasts stay until updated.' },
      { name: 'Ranj.toast.promise(p, msgs)', type: 'js', desc: '<code>{ loading, success, error }</code>; success/error may be strings, <code>{title, description}</code> or functions of the result.' },
      { name: 'Ranj.toast.update(id, opts)', type: 'js', desc: 'Morph an existing toast (also: pass the same <code>id</code> again).' },
      { name: 'Ranj.toast.dismiss(id?)', type: 'js', desc: 'Dismiss one, or all when no id.' },
      { name: 'Ranj.toast.config(opts)', type: 'js', desc: 'Defaults: <code>position, duration, visible (3), gap, rich, closeButton, expand, progress, max (8)</code>.' },
      { name: 'data-toast="title"', type: 'attr', desc: 'Declarative trigger; add <code>data-toast-type</code>, <code>-description</code>, <code>-position</code>, <code>-duration</code>.' },
      { name: '.toast-static', type: 'class', desc: 'Render a toast inline (no stack, no timer).' },
      { name: '--toast-w / --toast-offset', type: 'var', default: '22.5rem / 1.5rem', desc: 'On <code>.toaster</code>: width and distance from the edge.' },
      { name: 'ranj:toastdismiss', type: 'event', desc: 'On the toaster: <code>{ id, reason: "timeout"|"close"|"swipe"|"action"|"api" }</code>.' }
    ]
  });
})();
