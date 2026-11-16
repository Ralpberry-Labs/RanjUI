RanjDocs.add({
  id: 'copy-button',
  name: 'Copy Button',
  group: 'Micro-interactions',
  description: 'Copies text to the clipboard; the icon spins into a drawn check with a little Copied tooltip.',
  tags: ['new', 'fx', 'js'],
  keywords: ['copy', 'clipboard', 'copy to clipboard', 'code copy'],
  demos: [
    { title: 'Install command', html: `
<div style="display:flex;align-items:center;gap:.5rem;padding:.35rem .35rem .35rem 1rem;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--bg-subtle);font-family:var(--font-mono);font-size:.85rem">
  <span style="color:var(--muted-fg)">$</span><span>npm install ranj-ui</span>
  <button class="copy-btn" data-copy="npm install ranj-ui"></button>
</div>` },
    { title: 'API key and share link', height: 260, html: `
<div style="width:min(420px,100%);display:grid;gap:1rem">
  <div><small style="color:var(--muted-fg);font-weight:600">Secret key</small>
    <div style="display:flex;align-items:center;gap:.4rem;margin-top:.3rem;padding:.3rem .3rem .3rem .8rem;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--card)"><code id="copy-button-key" style="flex:1;font-size:.8rem;overflow:hidden;text-overflow:ellipsis">sk_live_51Hx3eJ2kQ9vT7cW</code><button class="copy-btn" data-copy-target="#copy-button-key"></button></div></div>
  <div><small style="color:var(--muted-fg);font-weight:600">Invite link</small>
    <div style="display:flex;gap:.4rem;margin-top:.3rem"><input class="input" id="copy-button-link" readonly value="https://acme.app/join/7hd92k" style="flex:1;min-width:0;height:2.25rem;padding:0 .75rem;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--card)"><button class="copy-btn copy-btn-text" data-copy-target="#copy-button-link" style="height:2.25rem;border:1px solid var(--border)"><span class="copy-btn-label">Copy link</span></button></div></div>
</div>` }
  ],
  api: [
    { name: '.copy-btn', type: 'class', desc: 'Icon button; icons injected if missing.' },
    { name: '.copy-btn-text', type: 'class', desc: 'Wider variant with a <code>.copy-btn-label</code> that swaps to the copied label.' },
    { name: 'data-copy', type: 'attr', desc: 'Literal text to copy.' },
    { name: 'data-copy-target', type: 'attr', desc: 'Selector; copies its value (inputs) or text.' },
    { name: 'data-copied-label', type: 'attr', default: 'Copied!', desc: 'Tooltip / label after copying.' },
    { name: 'Ranj.copyText(text)', type: 'js', desc: 'Promise-based clipboard helper with a fallback.' },
    { name: 'ranj:copy', type: 'event', desc: 'detail: { text }' }
  ]
});
