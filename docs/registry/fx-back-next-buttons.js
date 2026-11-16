RanjDocs.add({
  id: 'back-next-buttons',
  name: 'Back / Next Buttons',
  group: 'Micro-interactions',
  description: 'Paired step buttons whose arrows slip out and back in while the pill stretches toward the direction of travel.',
  tags: ['new', 'fx'],
  keywords: ['back', 'next', 'previous', 'wizard', 'stepper', 'pagination'],
  demos: [
    { title: 'Default', html: `
<button class="step-btn step-btn-back"><span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></span> Back</button>
<button class="step-btn step-btn-next">Next <span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button>
<button class="step-btn step-btn-back step-btn-icon" aria-label="Previous"><span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></span></button>
<button class="step-btn step-btn-next step-btn-icon" aria-label="Next"><span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button>` },
    { title: 'Onboarding wizard', height: 320, html: `
<div class="demo-step-card">
  <div class="demo-step-dots"><i></i><i></i><i></i><i></i></div>
  <b class="demo-step-title"></b>
  <p class="demo-step-text"></p>
  <div class="demo-step-actions"><button class="step-btn step-btn-back" data-step="-1"><span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></span> Back</button><button class="step-btn step-btn-next" data-step="1"><span class="demo-step-next">Next</span> <span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button></div>
</div>`, css: `
.demo-step-card { width: min(400px, 100%); padding: 1.4rem; border: 1px solid var(--border); border-radius: var(--radius-2xl); background: var(--card); display: grid; gap: .6rem; }
.demo-step-dots { display: flex; gap: .35rem; } .demo-step-dots i { height: 6px; width: 6px; border-radius: 3px; background: var(--border-strong); transition: width .4s var(--ease-spring), background .3s; }
.demo-step-dots i.on { width: 22px; background: var(--primary); }
.demo-step-title { font-size: 1.1rem; } .demo-step-text { color: var(--muted-fg); font-size: .9rem; min-height: 3em; }
.demo-step-actions { display: flex; justify-content: space-between; margin-top: .4rem; }`, js: `
var steps = [['Welcome to Orbit', 'Let us set up your workspace in under a minute.'], ['Invite your team', 'Add teammates by email or share an invite link.'], ['Connect your tools', 'Slack, GitHub and Linear sync in one click.'], ['You are all set', 'Your workspace is ready. Time to ship something great.']];
var i = 0, dots = root.querySelectorAll('.demo-step-dots i');
function render() { root.querySelector('.demo-step-title').textContent = steps[i][0]; root.querySelector('.demo-step-text').textContent = steps[i][1];
  dots.forEach(function (d, k) { d.classList.toggle('on', k === i); }); root.querySelector('[data-step="-1"]').disabled = i === 0;
  root.querySelector('.demo-step-next').textContent = i === steps.length - 1 ? 'Finish' : 'Next'; }
root.querySelectorAll('[data-step]').forEach(function (b) { b.onclick = function () { i = Math.max(0, Math.min(steps.length - 1, i + +b.getAttribute('data-step'))); render(); }; });
render();` }
  ],
  api: [
    { name: '.step-btn-next / .step-btn-back', type: 'class', desc: 'Filled forward and outlined back buttons.' },
    { name: '.arrow-slot', type: 'class', desc: 'Two stacked arrow SVGs; the first slides out and the second slides in on hover.' },
    { name: '.step-btn-icon', type: 'class', desc: 'Square icon-only version.' }
  ]
});
