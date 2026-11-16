RanjDocs.add({
  id: 'reaction-button',
  name: 'Reaction Button',
  group: 'Micro-interactions',
  description: 'Hover (or long-press on touch) to pop up an emoji picker. Emojis spring in one by one and grow under the cursor.',
  tags: ['new', 'fx', 'js'],
  keywords: ['emoji', 'reactions', 'react', 'like picker', 'emoji picker'],
  demos: [
    { title: 'On a comment', description: 'Hover the Like button, or focus it and press the up arrow.', height: 300, html: `
<div style="width:min(420px,100%);padding:1rem 1.1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <div style="display:flex;gap:.65rem;align-items:flex-start">
    <span style="width:34px;height:34px;flex:none;border-radius:50%;background:linear-gradient(135deg,#34d399,#0ea5e9)"></span>
    <div><b style="font-size:.9rem">Diego Alvarez</b><p style="font-size:.9rem;margin-top:.15rem">Just shipped the new onboarding flow. Activation is up 18% in the first week!</p></div>
  </div>
  <div style="display:flex;gap:.25rem;margin-top:.6rem;margin-left:2.6rem">
    <div class="reaction"><button class="reaction-trigger"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm0 0 4-7a2.5 2.5 0 0 1 3 3l-1 4h6a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 16.8 21H7"/></svg>Like</button></div>
    <button class="btn btn-ghost btn-sm">Reply</button>
  </div>
</div>` },
    { title: 'Custom set', description: 'Pass your own reactions as JSON.', html: `
<div class="reaction" data-reactions='[{"e":"🚀","l":"Ship it","c":"#8b5cf6"},{"e":"👀","l":"Looking","c":"#0ea5e9"},{"e":"✅","l":"Done","c":"#10b981"},{"e":"🎉","l":"Party","c":"#f59e0b"}]'>
  <button class="reaction-trigger"><span class="reaction-emoji">🙂</span>React</button>
</div>` }
  ],
  api: [
    { name: '.reaction', type: 'class', desc: 'Wrapper around a <code>.reaction-trigger</code> button.' },
    { name: 'data-reactions', type: 'attr', desc: 'JSON array of <code>{ e, l, c }</code> (emoji, label, color). The first one is used on a plain click.' },
    { name: 'Keyboard', type: 'js', desc: 'Up or Down arrow opens the picker, Left/Right moves, Enter picks, Escape closes.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { reaction, emoji } (null when cleared)' }
  ]
});
