(function () {
  var apps = [
    ['Files', 'linear-gradient(180deg,#60a5fa,#2563eb)', '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="4" width="17" height="16" rx="3" fill="#fff" fill-opacity=".18"/><path d="M12 4v16M8 9.5v1.5M16 9.5v1.5M8.5 15.5c2 1.5 5 1.5 7 0"/></svg>', true],
    ['Browser', 'linear-gradient(180deg,#e0f2fe,#38bdf8)', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="#0369a1" stroke-width="1.4"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z" fill="#ef4444"/><path d="m8.5 15.5 2.2-4.8 2.6 2.6z" fill="#fff"/></svg>', true],
    ['Messages', 'linear-gradient(180deg,#86efac,#16a34a)', '<svg viewBox="0 0 24 24"><path d="M12 4.5c4.7 0 8.5 3 8.5 6.8S16.7 18 12 18c-.9 0-1.8-.1-2.6-.3L5 19.5l1.2-3.3C4.5 15 3.5 13.2 3.5 11.3 3.5 7.5 7.3 4.5 12 4.5z" fill="#fff"/></svg>'],
    ['Mail', 'linear-gradient(180deg,#7dd3fc,#1d4ed8)', '<svg viewBox="0 0 24 24"><rect x="3.5" y="6" width="17" height="12" rx="2" fill="#fff"/><path d="m4 7 8 6 8-6" fill="none" stroke="#1d4ed8" stroke-width="1.6"/></svg>', true],
    ['Music', 'linear-gradient(180deg,#fb7185,#e11d48)', '<svg viewBox="0 0 24 24"><path d="M9 17.5V7l10-2v10.5" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="7" cy="17.5" r="2.4" fill="#fff"/><circle cx="17" cy="15.5" r="2.4" fill="#fff"/></svg>'],
    ['Photos', 'linear-gradient(180deg,#fff,#f4f4f5)', '<svg viewBox="0 0 24 24"><g opacity=".9"><ellipse cx="12" cy="7" rx="2.6" ry="4" fill="#f59e0b"/><ellipse cx="12" cy="17" rx="2.6" ry="4" fill="#3b82f6"/><ellipse cx="7" cy="12" rx="4" ry="2.6" fill="#22c55e"/><ellipse cx="17" cy="12" rx="4" ry="2.6" fill="#ec4899"/><ellipse cx="8.5" cy="8.5" rx="2.4" ry="3.6" transform="rotate(-45 8.5 8.5)" fill="#eab308"/><ellipse cx="15.5" cy="15.5" rx="2.4" ry="3.6" transform="rotate(-45 15.5 15.5)" fill="#8b5cf6"/><ellipse cx="15.5" cy="8.5" rx="2.4" ry="3.6" transform="rotate(45 15.5 8.5)" fill="#f97316"/><ellipse cx="8.5" cy="15.5" rx="2.4" ry="3.6" transform="rotate(45 8.5 15.5)" fill="#14b8a6"/></g></svg>'],
    ['Calendar', 'linear-gradient(180deg,#fff,#f4f4f5)', '<svg viewBox="0 0 24 24"><text x="12" y="8.5" text-anchor="middle" font-size="4.6" font-weight="700" fill="#ef4444" font-family="system-ui">MON</text><text x="12" y="19.5" text-anchor="middle" font-size="11" font-weight="300" fill="#18181b" font-family="system-ui">16</text></svg>'],
    ['Notes', 'linear-gradient(180deg,#fef08a 0 28%,#fefce8 28%)', '<svg viewBox="0 0 24 24" stroke="#a16207" stroke-width="1" opacity=".55"><path d="M5 11h14M5 14.5h14M5 18h10"/></svg>'],
    ['Settings', 'linear-gradient(180deg,#d4d4d8,#71717a)', '<svg viewBox="0 0 24 24" fill="none" stroke="#27272a" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6"/><circle cx="12" cy="12" r="6.5"/></svg>']
  ];
  function dock(list, extra) {
    return list.map(function (a) {
      return '  <button class="dock-item" data-label="' + a[0] + '" aria-label="' + a[0] + '"' + (a[3] ? ' data-active' : '') + '><span class="dock-icon" style="background:' + a[1] + '">' + a[2] + '</span></button>';
    }).join('\n') + (extra || '');
  }
  var trash = '\n  <span class="dock-sep" aria-hidden="true"></span>\n  <button class="dock-item" data-label="Trash" aria-label="Trash"><span class="dock-icon" style="background:linear-gradient(180deg,rgb(255 255 255 / .55),rgb(255 255 255 / .2));backdrop-filter:blur(4px)"><svg viewBox="0 0 24 24" fill="none" stroke="#52525b" stroke-width="1.4"><path d="M6 7h12l-1 13H7z" fill="rgb(255 255 255 / .5)"/><path d="M9.5 10v7M12 10v7M14.5 10v7M5 7h14"/></svg></span></button>';
  RanjDocs.add({
    id: 'dock',
    name: 'Dock',
    group: 'Motion',
    description: 'A macOS-style dock whose icons magnify smoothly with pointer proximity, with tooltips, running indicators, a bounce on click and arrow-key navigation.',
    tags: ['new', 'fx', 'js'],
    keywords: ['macos dock', 'magnification', 'app bar', 'toolbar', 'fisheye'],
    demos: [
      {
        title: 'Desktop dock',
        description: 'Glide across the icons. Click one to bounce it.',
        height: 300,
        pad: false,
        html: '\n<div class="demo-dock-desk">\n<div class="dock">\n' + dock(apps, trash) + '\n</div>\n</div>',
        css: '.demo-dock-desk { width: 100%; min-height: 300px; display: flex; align-items: flex-end; justify-content: center; padding: 1.5rem 1rem; background: radial-gradient(120% 90% at 20% 0%, #c4b5fd, transparent 60%), radial-gradient(100% 80% at 90% 10%, #f9a8d4, transparent 55%), linear-gradient(180deg, #818cf8, #312e81); }\n[data-theme="dark"] .demo-dock-desk { background: radial-gradient(120% 90% at 20% 0%, #4c1d95, transparent 60%), radial-gradient(100% 80% at 90% 10%, #831843, transparent 55%), linear-gradient(180deg, #1e1b4b, #09090b); }\n@media (max-width: 600px) { .demo-dock-desk .dock { --dock-size: 34px; --dock-max: 54px; --dock-gap: .3rem; } .demo-dock-desk .dock-item:nth-child(n+7):nth-child(-n+9) { display: none; } }'
      },
      {
        title: 'Compact, tighter range',
        height: 200,
        html: '\n<div class="dock" style="--dock-size: 40px; --dock-max: 64px" data-distance="110">\n' + dock(apps.slice(0, 6)) + '\n</div>'
      }
    ],
    api: [
      { name: '.dock', type: 'class', desc: 'The bar (role="toolbar"; ← → move focus).' },
      { name: '.dock-item', type: 'class', desc: 'A button or link. <code>data-label</code> shows a tooltip; <code>data-active</code> shows the running dot.' },
      { name: '.dock-icon / .dock-sep', type: 'class', desc: 'Icon tile inside an item / divider.' },
      { name: 'data-distance', type: 'attr', default: '150', desc: 'Influence radius in px.' },
      { name: 'data-bounce', type: 'attr', default: 'true', desc: 'Bounce the icon on click.' },
      { name: '--dock-size / --dock-max / --dock-gap', type: 'var', default: '48px / 84px / .5rem', desc: 'Resting size, max magnified size, spacing (px values).' },
      { name: 'ranj:select', type: 'event', desc: 'detail: <code>{ item, label }</code>' }
    ]
  });
})();
