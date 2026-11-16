(function () {
  RanjDocs.add({
    id: 'progress',
    name: 'Progress',
    group: 'Base',
    description: 'Show how far along a task is: linear bars in five sizes and tones, striped and animated, indeterminate, segmented multi-value, stepped and circular.',
    keywords: ['progress bar', 'loading bar', 'upload', 'percent', 'ring', 'stacked bar'],
    demos: [
      {
        title: 'With label',
        center: false,
        html: `<div class="stack gap-6" style="max-width:28rem;margin:0 auto">
  <div><div class="progress-label"><span>Uploading design-system.fig</span><span>62%</span></div>
    <div class="progress" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" aria-label="Upload" style="--value:62"><div class="progress-fill"></div></div></div>
  <div><div class="progress-label"><span>Onboarding</span><span>4 of 5 steps</span></div>
    <div class="progress progress-sm progress-success" role="progressbar" aria-valuenow="80" style="--value:80"><div class="progress-fill"></div></div></div>
  <div class="progress-inline"><div class="progress progress-xs progress-gradient" style="--value:34"><div class="progress-fill"></div></div><span>34%</span></div>
</div>`
      },
      {
        title: 'Sizes and tones',
        center: false,
        html: `<div class="stack gap-4" style="max-width:28rem;margin:0 auto">
  <div class="progress progress-xs" style="--value:30"><div class="progress-fill"></div></div>
  <div class="progress progress-sm progress-info" style="--value:45"><div class="progress-fill"></div></div>
  <div class="progress progress-success" style="--value:60"><div class="progress-fill"></div></div>
  <div class="progress progress-lg progress-warning" style="--value:75"><div class="progress-fill"></div></div>
  <div class="progress progress-xl progress-destructive" style="--value:92"><div class="progress-fill"></div></div>
</div>`
      },
      {
        title: 'Striped, animated and indeterminate',
        center: false,
        html: `<div class="stack gap-4" style="max-width:28rem;margin:0 auto">
  <div class="progress progress-lg progress-striped" style="--value:55"><div class="progress-fill"></div></div>
  <div class="progress progress-lg progress-striped progress-animated progress-success" style="--value:70"><div class="progress-fill"></div></div>
  <div class="progress progress-sm progress-indeterminate" role="progressbar" aria-label="Loading"><div class="progress-fill"></div></div>
</div>`
      },
      {
        title: 'Segmented storage',
        center: false,
        html: `<div class="card" style="max-width:28rem;margin:0 auto"><div class="card-content">
  <div class="progress-label"><span>Storage</span><span>71.4 GB of 100 GB</span></div>
  <div class="progress progress-lg progress-stacked" role="img" aria-label="Storage: 32 GB photos, 21 GB video, 12 GB documents, 6 GB other">
    <div class="progress-fill" style="--value:32;background:var(--primary)"></div>
    <div class="progress-fill" style="--value:21;background:oklch(0.7 0.17 calc(var(--hue) + 70))"></div>
    <div class="progress-fill" style="--value:12;background:var(--warning)"></div>
    <div class="progress-fill" style="--value:6.4;background:var(--muted-fg)"></div>
  </div>
  <div class="progress-legend"><span><i style="--c:var(--primary)"></i>Photos 32 GB</span><span><i style="--c:oklch(0.7 0.17 calc(var(--hue) + 70))"></i>Video 21 GB</span><span><i style="--c:var(--warning)"></i>Docs 12 GB</span><span><i style="--c:var(--muted-fg)"></i>Other</span></div>
</div></div>`
      },
      {
        title: 'Steps and ring',
        html: `<div class="cluster" style="justify-content:center;gap:2rem">
<div class="stack gap-2" style="width:min(100%,16rem)"><div class="progress-label" style="margin:0"><span>Course progress</span><span>7 / 10</span></div><div class="progress-steps" style="--steps:10;--value:7"></div></div>
<div class="progress-ring-wrap"><div class="progress-ring" style="--value:72"></div><span>72%</span></div>
<div class="progress-ring-wrap"><div class="progress-ring" style="--value:38;--size:5rem;--thickness:.55rem;--progress-color:var(--success)"></div><span>38%</span></div>
<div class="demo-progress-live progress-ring-wrap"><div class="progress-ring" style="--value:0;--size:4rem;--progress-color:var(--warning)"></div><span>0%</span></div>
</div>`,
        js: "var w = root.querySelector('.demo-progress-live'), r = w.querySelector('.progress-ring'), s = w.querySelector('span'), v = 0;\nvar iv = setInterval(function () { v = (v + 3) % 103; r.style.setProperty('--value', v); s.textContent = v + '%'; }, 80);\nreturn function () { clearInterval(iv); };"
      }
    ],
    api: [
      { name: '.progress > .progress-fill', type: 'class', desc: 'Track and fill. Set <code>--value</code> (0–100) on either, or a width on the fill (v1).' },
      { name: '--value', type: 'var', default: '0', desc: 'Percent complete.' },
      { name: '.progress-xs / -sm / -lg / -xl', type: 'class', desc: 'Heights.' },
      { name: '.progress-success', type: 'class', desc: 'Colors; or set <code>--progress-color</code>. Also: <code>.progress-warning</code> <code>.progress-destructive</code> <code>.progress-info</code> <code>.progress-gradient</code>' },
      { name: '.progress-striped', type: 'class', desc: 'Stripes, moving stripes, glowing fill. Also: <code>.progress-animated</code> <code>.progress-glow</code>' },
      { name: '.progress-indeterminate', type: 'class', desc: 'Looping bar for unknown duration (also <code>data-state="indeterminate"</code>).' },
      { name: '.progress-stacked', type: 'class', desc: 'Multiple fills side by side for segmented values. Pair with <code>.progress-legend</code>.' },
      { name: '.progress-steps', type: 'class', desc: 'Discrete blocks: <code>--steps</code> and <code>--value</code>.' },
      { name: '.progress-ring', type: 'class', desc: 'Circular progress: <code>--value</code>, <code>--size</code>, <code>--thickness</code>. Wrap it in <code>.progress-ring-wrap</code> to overlay a label.' },
      { name: '.progress-label', type: 'class', desc: 'Label row above, or value to the right. Also: <code>.progress-inline</code>' },
      { name: 'role="progressbar"', type: 'attr', desc: 'Required for accessibility on determinate bars.' }
    ]
  });
})();
