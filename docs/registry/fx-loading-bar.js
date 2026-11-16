RanjDocs.add({
  id: 'loading-bar',
  name: 'Page Loading Bar',
  group: 'Loaders',
  description: 'A slim glowing bar across the top of the page that trickles forward while you load, then finishes and fades. NProgress-style API.',
  tags: ['new', 'fx', 'js'],
  keywords: ['nprogress', 'top bar', 'route loading', 'page progress', 'youtube bar'],
  demos: [
    { title: 'In a browser window', description: 'Uses <code>Ranj.loadingBar.create({ parent })</code> so the bar stays inside the demo. The global <code>Ranj.loadingBar</code> sits at the top of the viewport.', height: 300, center: false, html: `
<div class="demo-lb-win">
  <div class="demo-lb-chrome"><i></i><i></i><i></i><span>acme.app/dashboard</span></div>
  <div class="demo-lb-page">
    <div style="display:flex;gap:.5rem;flex-wrap:wrap"><button class="btn btn-sm" data-lb="start">Start</button><button class="btn btn-sm btn-outline" data-lb="inc">Inc</button><button class="btn btn-sm btn-outline" data-lb="done">Done</button><button class="btn btn-sm btn-ghost" data-lb="global">Try the real one</button></div>
    <span class="loader-skel loader-skel-text" style="width:60%;margin-top:1rem"></span><span class="loader-skel loader-skel-text" style="width:85%"></span><span class="loader-skel loader-skel-text" style="width:40%"></span>
  </div>
</div>`, css: `
.demo-lb-win { width: min(560px, calc(100% - 2rem)); margin: 1.5rem auto; border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden; background: var(--card); box-shadow: var(--shadow-lg); }
.demo-lb-chrome { display: flex; align-items: center; gap: .35rem; padding: .55rem .8rem; border-bottom: 1px solid var(--border); background: var(--bg-subtle); }
.demo-lb-chrome i { width: 10px; height: 10px; border-radius: 50%; background: var(--border-strong); }
.demo-lb-chrome span { margin-left: .6rem; font-size: .75rem; color: var(--muted-fg); padding: .15rem .6rem; border-radius: 99px; background: var(--bg); flex: 1; }
.demo-lb-page { position: relative; padding: 1.2rem; display: grid; gap: .5rem; min-height: 170px; align-content: start; }`, js: `
var bar = Ranj.loadingBar.create({ parent: root.querySelector('.demo-lb-page') });
root.querySelectorAll('[data-lb]').forEach(function (b) { b.onclick = function () {
  var a = b.getAttribute('data-lb');
  if (a === 'global') { Ranj.loadingBar.start(); setTimeout(function () { Ranj.loadingBar.done(); }, 2200); return; }
  bar[a]();
}; });
bar.start(); var t = setTimeout(function () { bar.done(); }, 2400);
return function () { clearTimeout(t); bar.done(); };` }
  ],
  api: [
    { name: 'Ranj.loadingBar.start()', type: 'js', desc: 'Show the bar and trickle forward.' },
    { name: 'Ranj.loadingBar.set(p) / inc([amount])', type: 'js', desc: 'Jump to 0..1, or nudge forward.' },
    { name: 'Ranj.loadingBar.done()', type: 'js', desc: 'Complete and fade out.' },
    { name: 'Ranj.loadingBar.create({ parent, color, height })', type: 'js', desc: 'An independent bar inside a container.' },
    { name: '.loading-bar', type: 'class', desc: 'Style hook. <code>--color</code>, <code>--h</code> (default 3px).' }
  ]
});
