RanjDocs.add({
  id: 'progress-pie',
  name: 'Progress Pie',
  group: 'Loaders',
  description: 'A filled pie that sweeps smoothly to its value. Handy inline next to file names, tasks and uploads.',
  tags: ['new', 'fx', 'js'],
  keywords: ['pie', 'progress circle', 'conic', 'upload progress'],
  demos: [
    { title: 'Values', html: `
<span class="loader-pie" data-value="12"></span>
<span class="loader-pie" data-value="38" style="--color:var(--info)"></span>
<span class="loader-pie" data-value="67" style="--color:var(--warning)"></span>
<span class="loader-pie" data-value="100" style="--color:var(--success)"></span>
<span class="loader-pie" data-indeterminate aria-label="Loading"></span>` },
    { title: 'Upload queue', height: 280, html: `
<div style="width:min(380px,100%);border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <div class="demo-pie-row"><span class="loader-pie" data-value="100" style="--size:22px;--color:var(--success)"></span><span>brand-guidelines.pdf</span><small>Done</small></div>
  <div class="demo-pie-row"><span class="loader-pie" data-value="45" style="--size:22px"></span><span>launch-video-final.mp4</span><small class="demo-pie-pct">45%</small></div>
  <div class="demo-pie-row"><span class="loader-pie" data-value="0" style="--size:22px"></span><span>press-kit.zip</span><small>Queued</small></div>
</div>`, css: `
.demo-pie-row { display: flex; align-items: center; gap: .75rem; padding: .75rem 1rem; font-size: .9rem; }
.demo-pie-row + .demo-pie-row { border-top: 1px solid var(--border); }
.demo-pie-row span:nth-child(2) { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.demo-pie-row small { color: var(--muted-fg); font-variant-numeric: tabular-nums; }`, js: `
var pie = root.querySelectorAll('.loader-pie')[1], pct = root.querySelector('.demo-pie-pct'), v = 45;
var t = setInterval(function () { v = v >= 100 ? 0 : Math.min(100, v + 7); Ranj.progress(pie, v); pct.textContent = v + '%'; }, 700);
return function () { clearInterval(t); };` }
  ],
  api: [
    { name: '.loader-pie', type: 'class', desc: 'Pie progress, <code>role="progressbar"</code>.' },
    { name: 'data-value', type: 'attr', default: '0', desc: '0..100, animated in when visible.' },
    { name: 'data-indeterminate', type: 'attr', desc: 'Spinning quarter for unknown progress.' },
    { name: '--size / --color', type: 'var', default: '48px / --primary', desc: 'Size and color.' },
    { name: 'Ranj.progress(el, value)', type: 'js', desc: 'Set the value.' }
  ]
});
