RanjDocs.add({
  id: 'status-dot',
  name: 'Status Dot',
  group: 'Micro-interactions',
  description: 'Presence dots for online, away, busy and offline, with a soft pulse for live states. Pin one to an avatar.',
  tags: ['new', 'fx'],
  keywords: ['presence', 'online', 'away', 'busy', 'offline', 'avatar status', 'live'],
  demos: [
    { title: 'States', html: `
<span class="status-pill"><span class="status-dot" data-status="online"></span>Online</span>
<span class="status-pill"><span class="status-dot" data-status="away"></span>Away</span>
<span class="status-pill"><span class="status-dot" data-status="busy"></span>Do not disturb</span>
<span class="status-pill"><span class="status-dot" data-status="offline"></span>Offline</span>` },
    { title: 'On avatars', html: `
<span class="status-anchor"><span style="display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#6366f1);color:#fff;font-weight:700">AK</span><span class="status-dot" data-status="online" aria-label="Online" style="--size:12px"></span></span>
<span class="status-anchor"><span style="display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f97316);color:#fff;font-weight:700">JR</span><span class="status-dot" data-status="away" aria-label="Away" style="--size:12px"></span></span>
<span class="status-anchor"><span style="display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#34d399,#0ea5e9);color:#fff;font-weight:700">SN</span><span class="status-dot" data-status="busy" aria-label="Busy" style="--size:12px"></span></span>
<span class="status-anchor"><span style="display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:var(--muted);color:var(--muted-fg);font-weight:700">TB</span><span class="status-dot" data-status="offline" aria-label="Offline" style="--size:12px"></span></span>` },
    { title: 'Live badge', html: `<span class="status-pill" style="color:var(--destructive);border-color:color-mix(in oklab,var(--destructive) 30%,transparent)"><span class="status-dot" data-status="busy" style="--c:var(--destructive)"></span>LIVE · 2.4k watching</span>
<span class="status-pill"><span class="status-dot"></span>All systems operational</span>` }
  ],
  api: [
    { name: '.status-dot', type: 'class', desc: 'The dot. Add <code>aria-label</code> when it is the only indicator.' },
    { name: 'data-status', type: 'attr', default: 'online', desc: '<code>online away busy offline</code>.' },
    { name: '.status-dot-static', type: 'class', desc: 'No pulse.' },
    { name: '.status-anchor', type: 'class', desc: 'Wrap an avatar to pin the dot to its corner.' },
    { name: '.status-pill', type: 'class', desc: 'Dot with a label.' },
    { name: '--c / --size', type: 'var', desc: 'Color and size.' }
  ]
});
