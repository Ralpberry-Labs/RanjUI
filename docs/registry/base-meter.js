(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'meter',
    name: 'Meter',
    group: 'Base',
    description: 'A value within a known range, like disk usage, quota or password strength. Unlike progress, a meter is not a task that finishes.',
    keywords: ['gauge', 'quota', 'usage', 'password strength', 'capacity'],
    demos: [
      {
        title: 'Usage',
        center: false,
        html: `<div class="card" style="max-width:26rem;margin:0 auto"><div class="card-header"><div class="card-title">Plan usage</div><div class="card-description">Resets on December 1</div></div>
<div class="card-content stack gap-5">
  <div><div class="progress-label"><span>Bandwidth</span><span>412 / 1,000 GB</span></div><div class="meter meter-success" role="meter" aria-valuenow="41" aria-valuemin="0" aria-valuemax="100" aria-label="Bandwidth" style="--value:41"><div class="meter-fill"></div></div></div>
  <div><div class="progress-label"><span>Build minutes</span><span>5,160 / 6,000</span></div><div class="meter meter-warning" role="meter" aria-valuenow="86" style="--value:86"><div class="meter-fill"></div></div></div>
  <div><div class="progress-label"><span>Seats</span><span>20 / 20</span></div><div class="meter meter-destructive" role="meter" aria-valuenow="100" style="--value:100"><div class="meter-fill"></div></div></div>
</div></div>`
      },
      {
        title: 'Password strength',
        description: 'Type a password. A few lines of JS set <code>data-level</code> on <code>.meter-segments</code>.',
        html: `<div class="stack gap-2" style="width:min(100%,20rem)">
  <label class="label" for="meter-pw">Password</label>
  <input id="meter-pw" class="input" type="text" value="hunter2" autocomplete="off">
  <div class="meter-segments" data-level="1" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  <span class="tiny muted demo-meter-msg">Weak: add length and symbols</span>
</div>`,
        js: [
          "var i = root.querySelector('input'), m = root.querySelector('.meter-segments'), msg = root.querySelector('.demo-meter-msg');",
          "var words = ['Too short', 'Weak: add length and symbols', 'Fair: try a longer phrase', 'Good', 'Strong password'];",
          "function score(v) { var s = 0; if (v.length >= 8) s++; if (v.length >= 12) s++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++; if (/[^\\w]/.test(v) || /\\d/.test(v)) s++; return v.length < 4 ? 0 : Math.max(1, s); }",
          "function upd() { var s = score(i.value); m.setAttribute('data-level', s); msg.textContent = words[s]; }",
          "i.addEventListener('input', upd); upd();"
        ].join('\n')
      },
      {
        title: 'Native meter and gradient',
        center: false,
        html: `<div class="stack gap-5" style="max-width:26rem;margin:0 auto">
  <div><div class="progress-label"><span>${I('gauge', 'class="size-4" style="display:inline;vertical-align:-3px"')} CPU</span><span>64%</span></div><meter class="meter-native" min="0" max="100" low="60" high="85" optimum="20" value="64">64%</meter></div>
  <div><div class="progress-label"><span>Memory</span><span>91%</span></div><meter class="meter-native" min="0" max="100" low="60" high="85" optimum="20" value="91">91%</meter></div>
  <div><div class="progress-label"><span>Risk score</span><span>7.2 / 10</span></div><div class="meter meter-gradient" style="--value:72"><div class="meter-fill"></div></div></div>
</div>`
      }
    ],
    api: [
      { name: '.meter > .meter-fill', type: 'class', desc: 'Track and fill driven by <code>--value</code> (0–100). Use <code>role="meter"</code>.' },
      { name: '.meter-success', type: 'class', desc: 'Tones; or set <code>--meter-color</code>. Also: <code>.meter-warning</code> <code>.meter-destructive</code>' },
      { name: '.meter-gradient', type: 'class', desc: 'Green → amber → red scale revealed up to the value.' },
      { name: '.meter-segments[data-level]', type: 'class', desc: 'Segmented strength meter, levels 0–4 (5 with five segments).' },
      { name: 'meter.meter-native', type: 'class', desc: 'Styles the native <code>&lt;meter&gt;</code> with low/high/optimum colors.' },
      { name: '--meter-h', type: 'var', default: '.625rem', desc: 'Track height.' }
    ]
  });
})();
