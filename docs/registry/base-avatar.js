(function () {
  var I = RB.ic, F = RB.face;
  RanjDocs.add({
    id: 'avatar',
    name: 'Avatar',
    group: 'Base',
    description: 'Profile images with initials and icon fallbacks, six sizes, status dots, rings, square shape, and groups that collapse to "+3" or fan out on hover.',
    keywords: ['profile', 'user', 'picture', 'initials', 'avatar group', 'facepile', 'presence'],
    demos: [
      {
        title: 'Image, initials and fallback',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="avatar"><img src="${F(20)}" alt="Ana Silva"></span>
<span class="avatar avatar-tint" style="--avatar-hue:150">JK</span>
<span class="avatar avatar-gradient" style="--avatar-hue:290">MR</span>
<span class="avatar avatar-tint" style="--avatar-hue:40">TW</span>
<span class="avatar" aria-label="Unknown user">${I('user')}</span>
</div>`
      },
      {
        title: 'Sizes',
        html: `<span class="avatar avatar-xs"><img src="${F(200)}" alt=""></span>
<span class="avatar avatar-sm"><img src="${F(200)}" alt=""></span>
<span class="avatar"><img src="${F(200)}" alt=""></span>
<span class="avatar avatar-lg"><img src="${F(200)}" alt=""></span>
<span class="avatar avatar-xl"><img src="${F(200)}" alt=""></span>
<span class="avatar avatar-2xl"><img src="${F(200)}" alt="Leo Park"></span>`
      },
      {
        title: 'Status, ring and square',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="avatar avatar-lg" data-status="online"><img src="${F(10)}" alt="Online"></span>
<span class="avatar avatar-lg" data-status="away"><img src="${F(90)}" alt="Away"></span>
<span class="avatar avatar-lg avatar-tint" style="--avatar-hue:250" data-status="busy">DN</span>
<span class="avatar avatar-lg avatar-tint" style="--avatar-hue:180" data-status="offline">EO</span>
<span class="avatar avatar-lg avatar-ring"><img src="${F(330)}" alt="Ring"></span>
<span class="avatar avatar-lg avatar-ring-gradient"><img src="${F(30)}" alt="Story ring"></span>
<span class="avatar avatar-lg avatar-square avatar-gradient" style="--avatar-hue:200">AC</span>
<span class="avatar avatar-lg avatar-square" data-status="online"><img src="${F(260)}" alt="Square"></span>
</div>`
      },
      {
        title: 'Groups',
        description: 'The second group fans out on hover or focus.',
        html: `<div class="stack gap-6" style="align-items:center">
  <div class="avatar-group">
    <span class="avatar"><img src="${F(20)}" alt="Ana"></span>
    <span class="avatar"><img src="${F(140)}" alt="Jun"></span>
    <span class="avatar avatar-tint" style="--avatar-hue:290">MR</span>
    <span class="avatar"><img src="${F(220)}" alt="Leo"></span>
    <span class="avatar avatar-more" aria-label="3 more">+3</span>
  </div>
  <div class="avatar-group avatar-group-lg avatar-group-expand" tabindex="0" aria-label="7 collaborators">
    <span class="avatar"><img src="${F(0)}" alt="Ava"></span>
    <span class="avatar"><img src="${F(60)}" alt="Ben"></span>
    <span class="avatar avatar-gradient" style="--avatar-hue:250">CK</span>
    <span class="avatar"><img src="${F(180)}" alt="Dee"></span>
    <span class="avatar"><img src="${F(300)}" alt="Eli"></span>
  </div>
</div>`,
        height: 240
      },
      {
        title: 'With name',
        html: `<div class="card card-sm" style="width:min(100%,22rem)"><div class="card-content stack stack-divided gap-3">
  <div class="split"><div class="avatar-label"><span class="avatar" data-status="online"><img src="${F(20)}" alt=""></span><div><b>Ana Silva</b><span>ana@linea.design</span></div></div><span class="badge badge-soft">Owner</span></div>
  <div class="split"><div class="avatar-label"><span class="avatar avatar-tint" style="--avatar-hue:150">JK</span><div><b>Jun Kim</b><span>jun@linea.design</span></div></div><span class="badge badge-outline">Editor</span></div>
  <div class="split"><div class="avatar-label"><span class="avatar" data-status="away"><img src="${F(220)}" alt=""></span><div><b>Leo Park</b><span>leo@linea.design</span></div></div><span class="badge badge-outline">Viewer</span></div>
</div></div>`
      }
    ],
    api: [
      { name: '.avatar', type: 'class', desc: 'Circle with an <code>&lt;img&gt;</code>, initials text or an SVG icon.' },
      { name: '.avatar-xs', type: 'class', desc: '24 / 32 / (40) / 56 / 80 / 112px. Also: <code>.avatar-sm</code> <code>.avatar-lg</code> <code>.avatar-xl</code> <code>.avatar-2xl</code>' },
      { name: '.avatar-tint', type: 'class', desc: 'Initials colored by <code>--avatar-hue</code>. Also: <code>.avatar-gradient</code>' },
      { name: 'data-status', type: 'attr', desc: '<code>online</code> · <code>away</code> · <code>busy</code> · <code>offline</code> presence dot.' },
      { name: '.avatar-ring', type: 'class', desc: 'Brand ring or story-style gradient ring. Also: <code>.avatar-ring-gradient</code>' },
      { name: '.avatar-square', type: 'class', desc: 'Rounded square for teams and orgs.' },
      { name: '.avatar-group / .avatar-more', type: 'class', desc: 'Overlapping stack and the "+N" overflow chip. Sizes: <code>.avatar-group-sm</code>, <code>-lg</code>.' },
      { name: '.avatar-group-expand', type: 'class', desc: 'Fans the stack out on hover/focus.' },
      { name: '.avatar-label', type: 'class', desc: 'Avatar + name + secondary line.' },
      { name: '--avatar-size', type: 'var', desc: 'Size, initials hue, and group overlap. Also: <code>--avatar-hue</code> <code>--avatar-overlap</code>' }
    ]
  });
})();
