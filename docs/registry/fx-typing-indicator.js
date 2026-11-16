RanjDocs.add({
  id: 'typing-indicator',
  name: 'Typing Indicator',
  group: 'Micro-interactions',
  description: 'Three dots that bounce, wave or pulse while someone is writing. CSS only.',
  tags: ['new', 'fx'],
  keywords: ['typing', 'chat', 'dots', 'is typing', 'loading dots'],
  demos: [
    { title: 'In a chat', height: 300, html: `
<div style="width:min(360px,100%);display:grid;gap:.5rem">
  <div style="justify-self:end;max-width:80%;padding:.6rem .9rem;border-radius:18px 18px 5px 18px;background:var(--primary);color:var(--primary-fg);font-size:.9rem">Are we still on for dinner at 8?</div>
  <div style="display:flex;align-items:flex-end;gap:.5rem"><span style="width:28px;height:28px;border-radius:50%;flex:none;background:linear-gradient(135deg,#fb923c,#f43f5e)"></span><div class="typing typing-bubble" aria-label="Lena is typing"><i></i><i></i><i></i></div></div>
  <small style="color:var(--muted-fg);padding-left:2.3rem">Lena is typing…</small>
</div>` },
    { title: 'Styles', html: `
<div class="typing typing-bubble"><i></i><i></i><i></i></div>
<div class="typing typing-bubble typing-wave"><i></i><i></i><i></i></div>
<div class="typing typing-bubble typing-pulse"><i></i><i></i><i></i></div>
<div class="typing" style="--c:var(--primary);--dot:9px"><i></i><i></i><i></i></div>` }
  ],
  api: [
    { name: '.typing', type: 'class', desc: 'Container with three <code>&lt;i&gt;</code> dots. Give it an <code>aria-label</code>.' },
    { name: '.typing-bubble', type: 'class', desc: 'Chat bubble background.' },
    { name: '.typing-wave / .typing-pulse', type: 'class', desc: 'Alternate motions.' },
    { name: '--c / --dot', type: 'var', default: '--muted-fg / 7px', desc: 'Dot color and size.' }
  ]
});
