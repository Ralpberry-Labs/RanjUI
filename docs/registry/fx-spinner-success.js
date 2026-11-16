RanjDocs.add({
  id: 'spinner-success',
  name: 'Spinner to Success',
  group: 'Loaders',
  description: 'A spinning arc that closes into a full circle, fills, and draws a check (or an X for errors).',
  tags: ['new', 'fx', 'js'],
  keywords: ['success animation', 'loading to done', 'checkmark', 'spinner check', 'complete'],
  demos: [
    { title: 'Play it', height: 260, html: `
<span class="spin-success" style="--size:72px"></span>
<div style="display:grid;gap:.4rem">
  <button class="btn btn-sm" data-ss="success">Succeed</button>
  <button class="btn btn-sm btn-outline" data-ss="error">Fail</button>
  <button class="btn btn-sm btn-ghost" data-ss="loading">Restart</button>
</div>`, js: `
var s = root.querySelector('.spin-success');
root.querySelectorAll('[data-ss]').forEach(function (b) { b.onclick = function () { Ranj.spinSuccess(s, b.getAttribute('data-ss')); }; });` },
    { title: 'Upload complete', height: 280, html: `
<div style="width:min(340px,100%);display:grid;justify-items:center;gap:.6rem;padding:1.6rem;text-align:center;border:1px solid var(--border);border-radius:var(--radius-2xl);background:var(--card)">
  <span class="spin-success" data-auto="1800" style="--size:56px"></span>
  <b>Uploading 3 photos</b><small style="color:var(--muted-fg)">IMG_2041.heic, IMG_2042.heic, IMG_2050.heic</small>
</div>`, js: `
var s = root.querySelector('.spin-success'), b = root.querySelector('b');
s.addEventListener('ranj:change', function (e) { if (e.detail.state === 'success') b.textContent = 'Uploaded 3 photos'; });` }
  ],
  api: [
    { name: '.spin-success', type: 'class', desc: 'Empty element; SVG injected. <code>role="status"</code> with a label that follows the state.' },
    { name: 'data-state', type: 'attr', default: 'loading', desc: '<code>loading success error</code>.' },
    { name: 'data-auto / data-auto-state', type: 'attr', desc: 'Switch to a state automatically after N ms (demo helper).' },
    { name: '--size / --color / --ok / --bad', type: 'var', desc: 'Size and colors.' },
    { name: 'Ranj.spinSuccess(el, state)', type: 'js', desc: 'Change state; loading restarts the spinner.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { state }' }
  ]
});
