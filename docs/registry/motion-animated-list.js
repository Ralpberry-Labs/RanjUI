RanjDocs.add({
  id: 'animated-list',
  name: 'Animated List',
  group: 'Motion',
  description: 'Items arrive one by one like a live notification feed: each new item springs in at the top and smoothly pushes the rest down, the oldest gracefully exiting.',
  tags: ['new', 'fx', 'js'],
  keywords: ['notifications', 'feed', 'activity', 'stream', 'toast list', 'live'],
  demos: [
    {
      title: 'Notification feed',
      height: 460,
      html: `
<div class="demo-animated-list-phone">
  <div class="demo-animated-list-time">9:41</div>
  <div class="animated-list" data-loop data-max="4" data-interval="1400">
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#22c55e,#16a34a)">💸</span><div class="al-notif-body"><div class="al-notif-title">Payment received <small>now</small></div><div class="al-notif-text">Maya sent you $48.00 for dinner</div></div></div>
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#6366f1,#8b5cf6)">💬</span><div class="al-notif-body"><div class="al-notif-title">Jordan <small>now</small></div><div class="al-notif-text">Are we still on for 7pm? 🍜</div></div></div>
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#f59e0b,#f97316)">⭐</span><div class="al-notif-body"><div class="al-notif-title">New review <small>2m</small></div><div class="al-notif-text">“Best onboarding I've seen” — 5 stars</div></div></div>
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#0ea5e9,#2563eb)">🚀</span><div class="al-notif-body"><div class="al-notif-title">Deploy finished <small>4m</small></div><div class="al-notif-text">ranj-docs is live on production</div></div></div>
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#ec4899,#db2777)">❤️</span><div class="al-notif-body"><div class="al-notif-title">Priya liked your post <small>6m</small></div><div class="al-notif-text">“Shipping the new dock today”</div></div></div>
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#14b8a6,#0d9488)">📅</span><div class="al-notif-body"><div class="al-notif-title">Design review <small>in 10m</small></div><div class="al-notif-text">Room 4B · with Alex, Sam and 3 others</div></div></div>
  </div>
</div>`,
      css: `.demo-animated-list-phone { width: min(100%, 360px); height: 400px; padding: 1.25rem .9rem; border-radius: 2rem; overflow: hidden; background: linear-gradient(160deg, color-mix(in oklab, var(--primary) 30%, var(--bg)), color-mix(in oklab, oklch(.7 .2 calc(var(--hue) + 80)) 25%, var(--bg))); border: 1px solid var(--border); box-shadow: var(--shadow-xl); }
.demo-animated-list-time { text-align: center; font-family: var(--font-display); font-size: 3rem; font-weight: 700; letter-spacing: -.03em; line-height: 1; margin-bottom: 1rem; opacity: .85; }`
    },
    {
      title: 'Chat style, adding programmatically',
      description: '<code>.animated-list-up</code> appends at the bottom. The instance exposes <code>add(node)</code>.',
      height: 380,
      html: `
<div class="demo-animated-list-chat">
  <div class="animated-list animated-list-up demo-animated-list-msgs" data-max="5" data-interval="900">
    <div class="demo-animated-list-msg">Hey! Did the build pass? 👀</div>
    <div class="demo-animated-list-msg me">Yep, all green ✅</div>
    <div class="demo-animated-list-msg">Ship it 🚢</div>
  </div>
  <button class="btn btn-primary btn-sm" data-demo-add>Send a message</button>
</div>`,
      js: `var list = root.querySelector('.animated-list'), i = 0;
var lines = ['On it!', 'Looks great on mobile too', 'Merged 🎉', 'Coffee later?', 'Pushing a fix now'];
root.querySelector('[data-demo-add]').onclick = function () {
  var inst = Ranj.instance(list, 'animated-list'); if (!inst) return;
  var m = document.createElement('div'); m.className = 'demo-animated-list-msg me'; m.textContent = lines[i++ % lines.length];
  inst.add(m);
};`,
      css: `.demo-animated-list-chat { width: min(100%, 360px); display: grid; gap: 1rem; }
.demo-animated-list-msgs { --al-gap: .45rem; min-height: 250px; justify-content: flex-end; }
.demo-animated-list-msg { width: fit-content; max-width: 80%; padding: .55rem .9rem; border-radius: 1.1rem 1.1rem 1.1rem .3rem; background: var(--secondary); font-size: .9rem; }
.demo-animated-list-msg.me { margin-left: auto; border-radius: 1.1rem 1.1rem .3rem 1.1rem; background: var(--primary); color: var(--primary-fg); }`
    }
  ],
  api: [
    { name: '.animated-list', type: 'class', desc: 'Container; each direct child becomes an item.' },
    { name: '.animated-list-up', type: 'class', desc: 'New items append at the bottom (chat) instead of the top (feed).' },
    { name: '.al-notif', type: 'class', desc: 'Ready-made notification card (<code>.al-notif-icon</code>, <code>-body</code>, <code>-title</code>, <code>-text</code>).' },
    { name: 'data-interval', type: 'attr', default: '1100', desc: 'Milliseconds between items.' },
    { name: 'data-max', type: 'attr', default: 'all', desc: 'Max visible items; older ones exit.' },
    { name: 'data-loop', type: 'attr', default: 'false', desc: 'Keep cycling the items forever.' },
    { name: 'data-trigger / data-delay', type: 'attr', default: 'view / 200', desc: 'Start on view (or <code>load</code>) after a delay.' },
    { name: '--al-gap / --al-dur', type: 'var', default: '.625rem / 600ms', desc: 'Item spacing and transition time.' },
    { name: 'Ranj.instance(el, "animated-list")', type: 'js', desc: 'Returns <code>{ add(node), pause(), resume() }</code>.' },
    { name: 'ranj:item', type: 'event', desc: 'detail: <code>{ item }</code> as each item enters.' }
  ]
});
