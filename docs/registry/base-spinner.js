(function () {
  var petals = '<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>';
  RanjDocs.add({
    id: 'spinner',
    name: 'Spinner',
    group: 'Base',
    description: 'Lightweight loading indicators: ring, gradient arc, dots, bars and iOS-style petals, in five sizes and any tone.',
    keywords: ['loader', 'loading', 'busy', 'activity indicator', 'throbber'],
    demos: [
      {
        title: 'Styles',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="spinner spinner-lg" role="status" aria-label="Loading"></span>
<span class="spinner spinner-lg spinner-arc" role="status" aria-label="Loading"></span>
<span class="spinner spinner-lg spinner-dots" role="status" aria-label="Loading"><span></span><span></span><span></span></span>
<span class="spinner spinner-lg spinner-bar" role="status" aria-label="Loading"><span></span><span></span><span></span><span></span></span>
<span class="spinner spinner-lg spinner-petals spinner-muted" role="status" aria-label="Loading">${petals}</span>
</div>`
      },
      {
        title: 'Sizes',
        html: `<span class="spinner spinner-xs"></span><span class="spinner spinner-sm"></span><span class="spinner"></span><span class="spinner spinner-lg"></span><span class="spinner spinner-xl"></span>
<span class="spinner spinner-xl spinner-arc" style="--spinner-width:5px"></span>`
      },
      {
        title: 'Tones',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="spinner spinner-lg spinner-arc spinner-success"></span>
<span class="spinner spinner-lg spinner-arc spinner-warning"></span>
<span class="spinner spinner-lg spinner-arc spinner-destructive"></span>
<span class="spinner spinner-lg spinner-arc spinner-info"></span>
<span class="spinner spinner-lg spinner-arc spinner-muted"></span>
</div>`
      },
      {
        title: 'In context',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn" disabled style="opacity:.85"><span class="spinner spinner-sm spinner-current"></span> Processing payment</button>
<span class="spinner-label"><span class="spinner spinner-sm spinner-muted"></span> Syncing 1,284 files…</span>
<div class="card card-sm" style="width:14rem"><div class="card-content stack gap-2" style="align-items:center;text-align:center"><span class="spinner spinner-lg spinner-arc"></span><b class="small">Building preview</b><span class="tiny muted">Usually takes about 20 seconds</span></div></div>
</div>`
      }
    ],
    api: [
      { name: '.spinner', type: 'class', desc: 'Ring spinner. Add <code>role="status"</code> and an <code>aria-label</code>.' },
      { name: '.spinner-arc', type: 'class', desc: 'Styles (dots need 3 spans, bar 4 spans, petals 8 <code>&lt;i&gt;</code>). Also: <code>.spinner-dots</code> <code>.spinner-bar</code> <code>.spinner-petals</code>' },
      { name: '.spinner-xs / -sm / -lg / -xl', type: 'class', desc: 'Sizes.' },
      { name: '.spinner-current', type: 'class', desc: 'Colors. Also: <code>.spinner-muted</code> <code>.spinner-success</code> <code>.spinner-warning</code> <code>.spinner-destructive</code> <code>.spinner-info</code> <code>.spinner-white</code>' },
      { name: '--spinner-size', type: 'var', default: '1.25rem / 2px / --primary / .7s', desc: 'Custom sizing, color and speed. Also: <code>--spinner-width</code> <code>--spinner-color</code> <code>--spinner-speed</code>' }
    ]
  });
})();
