RanjDocs.add({
  id: 'decrypt-text',
  name: 'Decrypt Text',
  group: 'Text Effects',
  description: 'Characters scramble through random glyphs and decode into the real text, on view and again on hover. Choose the charset and reveal direction.',
  tags: ['new', 'fx', 'js'],
  keywords: ['scramble', 'decode', 'hacker', 'matrix', 'cipher', 'shuffle'],
  demos: [
    {
      title: 'Terminal',
      height: 300,
      bg: 'dark',
      html: `
<div class="demo-decrypt-text-term">
  <div class="demo-decrypt-text-bar"><i></i><i></i><i></i><span>secure-shell — 80×24</span></div>
  <p><span class="demo-decrypt-text-dim">$</span> <span data-decrypt data-speed="35">ssh ops@vault.internal --mfa</span></p>
  <p><span data-decrypt data-charset="hex" data-speed="30">Verifying key fingerprint 9F:2C:44:A1:0B</span></p>
  <p class="demo-decrypt-text-ok"><span data-decrypt data-charset="symbols" data-speed="45">ACCESS GRANTED — welcome back, Mira.</span></p>
</div>`,
      css: `.demo-decrypt-text-term { width: min(100%, 560px); border-radius: 12px; background: #0b0d12; border: 1px solid #23262f; color: #c9d1d9; font-family: var(--font-mono); font-size: .875rem; box-shadow: 0 30px 60px -20px rgb(0 0 0 / .6); overflow: hidden; }
.demo-decrypt-text-term p { padding: .2rem 1.1rem; }
.demo-decrypt-text-term p:last-child { padding-bottom: 1.1rem; }
.demo-decrypt-text-bar { display: flex; gap: .4rem; align-items: center; padding: .65rem .9rem; border-bottom: 1px solid #1d2028; margin-bottom: .6rem; color: #6b7280; font-size: .75rem; }
.demo-decrypt-text-bar i { width: .7rem; height: .7rem; border-radius: 50%; background: #ef4444; } .demo-decrypt-text-bar i:nth-child(2) { background: #f59e0b; } .demo-decrypt-text-bar i:nth-child(3) { background: #22c55e; }
.demo-decrypt-text-bar span { margin-left: .5rem; }
.demo-decrypt-text-dim { color: #6b7280; }
.demo-decrypt-text-ok { color: #4ade80; font-weight: 600; --dt-color: #22d3ee; }
.demo-decrypt-text-term .dt-enc { color: #818cf8; }`
    },
    {
      title: 'Hover navigation',
      description: 'Each link re-decodes when hovered or focused.',
      html: `
<nav class="demo-decrypt-text-nav">
  <a href="#" onclick="return false" data-decrypt data-trigger="hover">Work</a>
  <a href="#" onclick="return false" data-decrypt data-trigger="hover">Studio</a>
  <a href="#" onclick="return false" data-decrypt data-trigger="hover">Journal</a>
  <a href="#" onclick="return false" data-decrypt data-trigger="hover">Contact</a>
</nav>`,
      css: `.demo-decrypt-text-nav { display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .08em; font-weight: 600; }
.demo-decrypt-text-nav a { color: var(--fg); text-decoration: none !important; }`
    },
    {
      title: 'Reveal order & charsets',
      height: 260,
      html: `
<div class="demo-decrypt-text-list">
  <h3 data-decrypt data-order="center" data-speed="40">Revealed from the center out</h3>
  <h3 data-decrypt data-order="end" data-charset="binary">Right to left, in binary</h3>
  <h3 data-decrypt data-sequential="false" data-iterations="14" data-charset="alpha">All at once, then settle</h3>
</div>`,
      css: `.demo-decrypt-text-list { display: grid; gap: .75rem; text-align: center; }`
    }
  ],
  api: [
    { name: 'data-decrypt', type: 'attr', desc: 'Enables the effect on the element.' },
    { name: 'data-charset', type: 'attr', default: 'alnum', desc: '<code>alnum</code>, <code>alpha</code>, <code>hex</code>, <code>binary</code>, <code>symbols</code>, or any custom string of characters.' },
    { name: 'data-speed', type: 'attr', default: '40', desc: 'Milliseconds per scramble tick.' },
    { name: 'data-iterations', type: 'attr', default: '4', desc: 'Scramble ticks before characters start resolving.' },
    { name: 'data-step', type: 'attr', default: 'auto', desc: 'Characters resolved per tick.' },
    { name: 'data-order', type: 'attr', default: 'start', desc: 'Reveal order: start, end, center or random.' },
    { name: 'data-sequential', type: 'attr', default: 'true', desc: '<code>false</code> resolves characters in random order.' },
    { name: 'data-trigger', type: 'attr', default: 'view', desc: '<code>view</code>, <code>load</code> or <code>hover</code>.' },
    { name: 'data-hover', type: 'attr', default: 'true', desc: 'Also re-decode on hover/focus.' },
    { name: '--dt-color', type: 'var', default: 'var(--primary)', desc: 'Color of scrambled glyphs.' },
    { name: 'Ranj.decrypt(el)', type: 'js', desc: 'Replay the effect.' },
    { name: 'ranj:done', type: 'event', desc: 'Fires when fully decoded.' }
  ]
});
