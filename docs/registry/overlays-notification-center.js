(function () {
  var I = window.__ovI;
  function av(t, h) { return '<span class="demo-ov-avatar" style="--h:' + h + ';width:36px;height:36px;font-size:13px">' + t + '</span>'; }
  function badge(icon, color) { return '<span class="notif-badge" style="background:' + color + '">' + I[icon] + '</span>'; }
  var items = [
    [1, av('SC', 15) + badge('message', 'var(--info)'), '<b>Sofia Chen</b> commented on <b>Pricing page v3</b>', '<div class="notif-quote">Love the new tiers. Can we A/B the annual toggle?</div>', '2 min ago'],
    [1, av('MK', 140) + badge('userPlus', 'var(--success)'), '<b>Marcus Kim</b> requested access to <b>Design System</b>', '<div class="notif-actions"><button class="btn btn-sm">Approve</button><button class="btn btn-sm btn-outline">Decline</button></div>', '18 min ago'],
    [1, '<span class="demo-notif-sys" style="--h:20">' + I.alert + '</span>', '<b>Usage alert:</b> 92% of your monthly build minutes used', '', '1 hour ago'],
    [0, av('AR', 290) + badge('star', 'var(--warning)'), '<b>Aisha Rahman</b> starred <b>northwind/ui</b>', '', 'Yesterday'],
    [0, '<span class="demo-notif-sys" style="--h:150">' + I.checkCircle + '</span>', 'Deployment <b>#1842</b> to production succeeded', '', 'Yesterday']
  ].map(function (n) {
    return '<div class="notif-item"' + (n[0] ? ' data-unread' : '') + '><div class="notif-media">' + n[1] + '</div><div class="notif-body"><p>' + n[2] + '</p>' + n[3] + '<small>' + n[4] + '</small></div></div>';
  }).join('');
  var pushes = [
    ['Messages', 'Ava Martinez', 'Running 5 min late, grab us a table by the window?', 'now', '#34c759', 'message'],
    ['Calendar', 'Design review', 'Starts in 10 minutes · Room 4B', '2m ago', '#ff3b30', 'calendar'],
    ['Mail', 'Stripe', 'Your payout of $12,480.00 is on the way.', '9m ago', '#0a84ff', 'mail'],
    ['Fitness', 'Close your rings', 'You are 120 calories away from your Move goal.', '1h ago', '#ff2d55', 'heart']
  ].map(function (p) {
    return '<div class="push-card"><div class="push-icon" style="--push-icon-bg:' + p[4] + '">' + I[p[5]] + '</div><div class="push-text"><div class="push-top"><b>' + p[1] + '</b><small>' + p[3] + '</small></div><p>' + p[2] + '</p></div></div>';
  }).join('');

  RanjDocs.add({
    id: 'notification-center',
    name: 'Notification Center',
    group: 'Feedback',
    description: 'An inbox behind a bell: live unread count, filter tabs, mark-all-read, and new items that ring the bell as they arrive. Plus an iOS-style stack of push notifications that fans out when tapped.',
    tags: ['js', 'new'],
    keywords: ['inbox', 'bell', 'notifications', 'activity feed', 'push', 'ios', 'lock screen'],
    demos: [
      {
        title: 'Inbox',
        height: 300,
        html: `
<div class="notification-center" id="notif-demo">
  <button class="notif-trigger" data-label="Notifications">${I.bell}<span class="notif-count">3</span></button>
  <div class="notif-panel">
    <div class="notif-header"><b>Notifications</b><button class="notif-mark-all">Mark all as read</button></div>
    <div class="notif-tabs" role="tablist"><button data-filter="all">All</button><button data-filter="unread">Unread <span>3</span></button></div>
    <div class="notif-list">${items}</div>
    <div class="notif-empty">${I.checkCircle}<b style="color:var(--fg)">You're all caught up</b>New activity will show up here.</div>
    <div class="notif-footer"><button data-notif-close>View all activity</button></div>
  </div>
</div>
<button class="btn btn-outline btn-sm" id="notif-add">${I.plus} Simulate new</button>`,
        js: `var people = [['Leo Park', 'mentioned you in', 'Q4 OKRs', 60], ['Nina Rossi', 'assigned you', 'Fix checkout flicker', 200], ['Tom Becker', 'replied to', 'Onboarding copy', 320]], n = 0;
root.querySelector('#notif-add').onclick = function () {
  var p = people[n++ % people.length];
  Ranj.notifications.add('#notif-demo', { html: '<div class="notif-media"><span class="demo-ov-avatar" style="--h:' + p[3] + ';width:36px;height:36px;font-size:13px">' + p[0].split(' ').map(function (s) { return s[0]; }).join('') + '</span></div><div class="notif-body"><p><b>' + p[0] + '</b> ' + p[1] + ' <b>' + p[2] + '</b></p><small>Just now</small></div>' });
};`,
        css: `.demo-notif-sys { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 99px; color: oklch(.55 .17 var(--h)); background: oklch(.95 .04 var(--h)); }
[data-theme="dark"] .demo-notif-sys { color: oklch(.8 .13 var(--h)); background: oklch(.3 .06 var(--h)); }
.demo-notif-sys svg { width: 1.1rem; height: 1.1rem; } #notif-add svg { width: .9rem; height: .9rem; }`
      },
      {
        title: 'iOS push stack',
        description: 'Tap the pile to fan it out; new notifications drop in from the top.',
        height: 460,
        pad: false,
        center: false,
        html: `
<div class="demo-push-phone">
  <div class="demo-push-time"><small>Monday, November 16</small><b>9:41</b></div>
  <div class="push-stack" id="push-demo">
    <div class="push-stack-head"><b>Notification Centre</b><span><button data-push-collapse>Show less</button> <button data-push-clear>Clear</button></span></div>
    <div class="push-cards">${pushes}</div>
    <div class="push-more"></div>
  </div>
  <button class="demo-push-btn" id="push-add">${I.bell} Send notification</button>
</div>`,
        js: `var q = [['Slack', '#4a154b', 'message', 'Jonas in #launch', 'Ship it, the build is green.'], ['Uber Eats', '#06c167', 'bag', 'Order on the way', 'Your Pad Thai arrives in 12 min.'], ['Photos', '#ff9f0a', 'image', 'On this day', '3 years ago in Lisbon: 24 photos.']], k = 0;
root.querySelector('#push-add').onclick = function () {
  var p = q[k++ % q.length];
  Ranj.push('#push-demo', { title: p[3], body: p[4], time: 'now', color: p[1], icon: window.__ovI[p[2]] });
};`,
        css: `.demo-push-phone { position: relative; width: 100%; min-height: 460px; display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 1.75rem 1rem 1.25rem; overflow: hidden;
  background: radial-gradient(120% 80% at 10% 0%, #f9a8d4 0%, transparent 55%), radial-gradient(100% 70% at 100% 30%, #818cf8 0%, transparent 60%), radial-gradient(120% 90% at 50% 120%, #22d3ee 0%, transparent 60%), #6d28d9; }
.demo-push-time { display: flex; flex-direction: column; align-items: center; color: #fff; line-height: 1; text-shadow: 0 2px 16px rgb(0 0 0 / .2); }
.demo-push-time small { font-size: .9rem; font-weight: 600; opacity: .9; } .demo-push-time b { font-size: 4.25rem; font-weight: 700; letter-spacing: -.04em; margin-top: .2rem; }
.demo-push-phone .push-stack { margin-bottom: 2rem; }
.demo-push-btn { margin-top: auto; display: inline-flex; align-items: center; gap: .4rem; padding: .5rem .9rem; border-radius: 99px; font-size: .8125rem; font-weight: 600; color: #fff; background: rgb(255 255 255 / .2); -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); }
.demo-push-btn svg { width: .9rem; height: .9rem; }`
      }
    ],
    api: [
      { name: '.notification-center', type: 'class', desc: 'Wrapper with a <code>.notif-trigger</code> (bell + <code>.notif-count</code>) and a <code>.notif-panel</code>.' },
      { name: '.notif-panel', type: 'class', desc: 'Parts: <code>.notif-header .notif-mark-all .notif-tabs .notif-list .notif-empty .notif-footer</code>.' },
      { name: '.notif-item[data-unread]', type: 'class', desc: 'One notification (<code>.notif-media</code>, <code>.notif-body</code>, <code>.notif-quote</code>, <code>.notif-actions</code>). Clicking marks it read.' },
      { name: 'data-filter="all|unread"', type: 'attr', desc: 'On tab buttons inside <code>.notif-tabs</code>.' },
      { name: 'data-placement', type: 'attr', default: 'bottom-end', desc: 'Panel placement.' },
      { name: 'Ranj.notifications.add(el, n)', type: 'js', desc: '<code>{ html }</code> or <code>{ title, text, time, media, href }</code>. Rings the bell and pops the count.' },
      { name: 'Ranj.notifications.markAllRead(el)', type: 'js', desc: 'Also <code>open(el)</code> / <code>close(el)</code>.' },
      { name: '.push-stack > .push-cards > .push-card', type: 'class', desc: 'iOS-style pile. Card parts: <code>.push-icon</code> (<code>--push-icon-bg</code>), <code>.push-text</code>, <code>.push-top</code>.' },
      { name: 'Ranj.push(stack, n)', type: 'js', desc: 'Prepend a card: <code>{ title, body, time, icon, color }</code>.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ unread }</code> on the center; <code>{ count }</code> on a push stack.' }
    ]
  });
})();
