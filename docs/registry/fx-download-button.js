RanjDocs.add({
  id: 'download-button',
  name: 'Download Button',
  group: 'Micro-interactions',
  description: 'Idle, then a filling progress ring and bar with a live percentage, then a drawn check.',
  tags: ['new', 'fx', 'js'],
  keywords: ['download', 'progress button', 'file', 'loading button'],
  demos: [
    { title: 'File row', height: 260, html: `
<div style="width:min(460px,100%);display:flex;align-items:center;gap:.9rem;padding:.85rem 1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);flex-wrap:wrap">
  <span style="width:40px;height:40px;border-radius:var(--radius);display:grid;place-items:center;background:var(--destructive-soft);color:var(--destructive-soft-fg);font-size:.7rem;font-weight:800">PDF</span>
  <div style="flex:1;min-width:140px"><b style="display:block;font-size:.92rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Annual-report-2026.pdf</b><small style="color:var(--muted-fg)">18.4 MB · Updated today</small></div>
  <button class="fxb dl-btn" style="height:var(--control-h)"><span class="fxb-icon"><svg class="fxb-arrow" viewBox="0 0 24 24"><path class="dl-shaft" d="M12 4v11"/><path d="M7 10.5l5 5 5-5"/><path d="M5 20h14"/></svg><svg class="fxb-ring" viewBox="0 0 24 24"><circle class="ring-track" cx="12" cy="12" r="9"/><circle class="ring-val" pathLength="1" cx="12" cy="12" r="9"/></svg><svg class="fxb-check" viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="fxb-texts"><span data-for="idle">Download</span><span data-for="busy">Downloading <small data-progress-text>0%</small></span><span data-for="done">Saved</span></span></button>
</div>` },
    { title: 'Controlled progress', description: '<code>data-manual</code> + <code>Ranj.fxButton.progress()</code> for real uploads or downloads.', html: `
<button class="fxb dl-btn" data-manual data-reset="0"><span class="fxb-icon"><svg class="fxb-arrow" viewBox="0 0 24 24"><path class="dl-shaft" d="M12 4v11"/><path d="M7 10.5l5 5 5-5"/><path d="M5 20h14"/></svg><svg class="fxb-ring" viewBox="0 0 24 24"><circle class="ring-track" cx="12" cy="12" r="9"/><circle class="ring-val" pathLength="1" cx="12" cy="12" r="9"/></svg><svg class="fxb-check" viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="fxb-texts"><span data-for="idle">Export 1,204 rows</span><span data-for="busy">Exporting <small data-progress-text>0%</small></span><span data-for="done">Export ready</span></span></button>
<button class="btn btn-outline btn-sm" data-demo-reset>Reset</button>`, js: `
var b = root.querySelector('.dl-btn');
b.addEventListener('ranj:start', function () { var p = 0; var t = setInterval(function () { p += 0.07 + Math.random() * 0.06; Ranj.fxButton.progress(b, p); if (p >= 1) { clearInterval(t); Ranj.fxButton.done(b); } }, 160); });
root.querySelector('[data-demo-reset]').onclick = function () { Ranj.fxButton.reset(b); };` }
  ],
  api: [
    { name: '.fxb.dl-btn', type: 'class', desc: 'Download button. Icons: <code>.fxb-arrow</code>, <code>.fxb-ring</code>, <code>.fxb-check</code>.' },
    { name: '[data-progress-text]', type: 'attr', desc: 'Any element inside gets the live percentage.' },
    { name: 'data-duration', type: 'attr', default: '2400', desc: 'Simulated duration (ms).' },
    { name: 'data-manual / data-reset', type: 'attr', desc: 'See Send Button.' },
    { name: '--p', type: 'var', default: '0', desc: 'Progress 0..1 (set by JS).' },
    { name: 'Ranj.fxButton.progress(el, p)', type: 'js', desc: 'Set progress 0..1.' }
  ]
});
