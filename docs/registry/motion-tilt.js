RanjDocs.add({
  id: 'tilt',
  name: 'Tilt',
  group: 'Interactions',
  description: '3D tilt that follows the pointer with spring smoothing, an optional moving glare, and child layers that float at different depths.',
  tags: ['new', 'fx', 'js'],
  keywords: ['3d card', 'parallax tilt', 'hover tilt', 'vanilla tilt', 'glare', 'holographic'],
  demos: [
    {
      title: 'Card with glare',
      height: 360,
      html: `
<div class="demo-tilt-card" data-tilt data-tilt-glare data-tilt-max="14">
  <div class="demo-tilt-top" data-tilt-depth="40"><span>NOVA</span><b>PRO</b></div>
  <div class="demo-tilt-orb" data-tilt-depth="70"></div>
  <div class="demo-tilt-bottom" data-tilt-depth="30"><b>Nova Pro Max</b><span>From $1,299</span></div>
</div>`,
      css: `.demo-tilt-card { width: min(100%, 300px); aspect-ratio: 3 / 4; border-radius: 1.5rem; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; color: #fff; background: radial-gradient(90% 70% at 70% 30%, #a78bfa, transparent 70%), radial-gradient(80% 60% at 20% 90%, #f472b6, transparent 70%), #1e1b4b; box-shadow: 0 30px 60px -20px rgb(30 27 75 / .7); }
.demo-tilt-top { display: flex; justify-content: space-between; font-weight: 800; letter-spacing: .2em; font-size: .8rem; }
.demo-tilt-orb { width: 120px; height: 120px; margin: 0 auto; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff, #c4b5fd 30%, #6d28d9 70%); box-shadow: 0 20px 50px -10px #7c3aed; }
.demo-tilt-bottom { display: grid; } .demo-tilt-bottom b { font-size: 1.4rem; } .demo-tilt-bottom span { opacity: .75; font-size: .875rem; }`
    },
    {
      title: 'Subtle, reversed',
      description: '<code>data-tilt-reverse</code> tilts away from the pointer; small angles suit content cards.',
      height: 280,
      html: `
<div class="card demo-tilt-plain" data-tilt data-tilt-max="6" data-tilt-scale="1.02" data-tilt-reverse data-tilt-glare data-tilt-glare-max="0.25">
  <div class="card-header"><h3 class="card-title">Q3 revenue</h3><p class="card-description">Up 24% vs last quarter</p></div>
  <div class="card-content"><b class="demo-tilt-num">$1.82M</b></div>
</div>`,
      css: `.demo-tilt-plain { width: min(100%, 320px); } .demo-tilt-num { font-size: 2.5rem; letter-spacing: -.04em; }`
    }
  ],
  api: [
    { name: 'data-tilt', type: 'attr', desc: 'Enable on any element.' },
    { name: 'data-tilt-max', type: 'attr', default: '12', desc: 'Max rotation in degrees.' },
    { name: 'data-tilt-scale', type: 'attr', default: '1.03', desc: 'Scale while hovered.' },
    { name: 'data-tilt-perspective', type: 'attr', default: '900', desc: 'Perspective in px.' },
    { name: 'data-tilt-glare / data-tilt-glare-max', type: 'attr', default: 'false / 0.45', desc: 'Add a glare layer and its max intensity.' },
    { name: 'data-tilt-reverse', type: 'attr', desc: 'Tilt away from the pointer.' },
    { name: 'data-tilt-depth', type: 'attr', desc: 'On children: translateZ in px for layered depth.' },
    { name: '--px / --py', type: 'var', desc: 'Pointer position 0–1 written on the element, for custom effects.' }
  ]
});
