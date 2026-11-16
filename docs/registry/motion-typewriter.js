RanjDocs.add({
  id: 'typewriter',
  name: 'Typewriter',
  group: 'Text Effects',
  description: 'Types phrases character by character with human-feeling jitter, pauses, deletes and moves on to the next. Bar, block or underscore caret.',
  tags: ['new', 'fx', 'js'],
  keywords: ['typing', 'typed', 'caret', 'cursor', 'type effect', 'terminal'],
  demos: [
    {
      title: 'Looping phrases',
      height: 220,
      html: `
<h2 class="demo-typewriter-h">Ranj UI is <span class="demo-typewriter-accent" data-typewriter data-words="fast.|accessible.|tiny.|a joy to use."></span></h2>`,
      css: `.demo-typewriter-h { font-size: clamp(1.8rem, 1.3rem + 2vw, 3rem); text-align: center; }
.demo-typewriter-accent { color: var(--primary); }`
    },
    {
      title: 'Terminal, block caret',
      bg: 'dark',
      height: 240,
      html: `
<div class="demo-typewriter-term">
  <span class="demo-typewriter-prompt">~/app ❯</span> <span data-typewriter data-cursor="block" data-speed="55" data-pause="2200" data-words="npm i @ranj/ui|npx ranj add marquee|git push origin main"></span>
</div>`,
      css: `.demo-typewriter-term { width: min(100%, 520px); padding: 1.1rem 1.25rem; border-radius: 12px; background: #0b0d12; border: 1px solid #23262f; color: #e5e7eb; font-family: var(--font-mono); font-size: .95rem; --tw-caret-color: #a78bfa; }
.demo-typewriter-prompt { color: #34d399; }`
    },
    {
      title: 'Type once, underscore caret',
      html: `
<p class="demo-typewriter-p" data-typewriter data-loop="false" data-cursor="underscore" data-speed="45">Hello, Alex. Your report is ready.</p>`,
      css: `.demo-typewriter-p { font-family: var(--font-mono); font-size: 1.1rem; }`
    }
  ],
  api: [
    { name: 'data-typewriter', type: 'attr', desc: 'Enables typing. Phrases come from <code>data-words</code> (pipe-separated), the attribute value, or the element text.' },
    { name: 'data-words', type: 'attr', desc: '<code>first|second|third</code>' },
    { name: 'data-speed / data-delete-speed', type: 'attr', default: '60 / 32', desc: 'Milliseconds per character.' },
    { name: 'data-pause', type: 'attr', default: '1600', desc: 'Hold time when a phrase is complete.' },
    { name: 'data-loop', type: 'attr', default: 'true', desc: '<code>false</code> types each phrase once and stops on the last.' },
    { name: 'data-cursor', type: 'attr', default: 'bar', desc: 'bar, block or underscore. <code>data-caret="false"</code> hides it.' },
    { name: 'data-variable', type: 'attr', default: 'true', desc: 'Random per-key jitter so it feels human.' },
    { name: 'data-start-delay', type: 'attr', default: '250', desc: 'Delay after entering view.' },
    { name: '--tw-caret-color / --tw-blink', type: 'var', default: 'var(--primary) / 1s', desc: 'Caret color and blink rate.' },
    { name: 'ranj:typed', type: 'event', desc: 'detail: <code>{ index, word }</code> whenever a phrase completes.' }
  ]
});
