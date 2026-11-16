RanjDocs.add({
  id: 'notification-bell',
  name: 'Notification Bell',
  group: 'Micro-interactions',
  description: 'A bell that swings with a lagging clapper and a badge that bumps and pings when new notifications arrive.',
  tags: ['new', 'fx', 'js'],
  keywords: ['bell', 'notifications', 'badge', 'inbox', 'alert', 'ring'],
  demos: [
    { title: 'In a header', description: 'Simulate incoming notifications; clicking the bell marks them read.', height: 220, html: `
<div style="width:min(460px,100%);display:flex;align-items:center;justify-content:space-between;padding:.6rem .8rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <b style="padding-left:.3rem">Acme Cloud</b>
  <div style="display:flex;align-items:center;gap:.5rem">
    <button class="btn btn-outline btn-sm" data-demo-notify>Simulate notification</button>
    <button class="bell" data-count="2" aria-label="Notifications"></button>
  </div>
</div>`, js: `
var bell = root.querySelector('.bell');
root.querySelector('[data-demo-notify]').onclick = function () { Ranj.bell(bell, (+bell.getAttribute('data-count') || 0) + 1); };
bell.onclick = function () { Ranj.bell(bell, 0); };` },
    { title: 'Sizes', html: `<button class="bell" style="--size:18px" data-count="1" aria-label="Notifications"></button>
<button class="bell" data-count="12" aria-label="Notifications"></button>
<button class="bell" style="--size:30px;--on:var(--primary)" data-count="128" aria-label="Notifications"></button>` }
  ],
  api: [
    { name: '.bell', type: 'class', desc: 'A <code>&lt;button&gt;</code>; icon and badge injected. Rings on hover.' },
    { name: 'data-count', type: 'attr', default: '0', desc: 'Initial unread count.' },
    { name: 'Ranj.bell(el, n)', type: 'js', desc: 'Set the count. Rings and bumps the badge when it increases. Updates <code>aria-label</code>.' },
    { name: '--size / --on', type: 'var', default: '22px / --destructive', desc: 'Icon size and badge color.' }
  ]
});
