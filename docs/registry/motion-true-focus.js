RanjDocs.add({
  id: 'true-focus',
  name: 'True Focus',
  group: 'Text Effects',
  description: 'One word at a time comes into sharp focus while animated corner brackets glide to frame it; the rest stay softly blurred.',
  tags: ['new', 'fx', 'js'],
  keywords: ['focus', 'blur words', 'brackets', 'viewfinder', 'highlight word'],
  demos: [
    {
      title: 'Auto cycle',
      height: 240,
      html: `
<h1 class="demo-true-focus-h" data-true-focus>Design Build Ship Repeat</h1>`,
      css: `.demo-true-focus-h { font-size: clamp(2rem, 1rem + 4vw, 4rem); font-weight: 900; letter-spacing: -.03em; }`
    },
    {
      title: 'Follow the pointer',
      html: `
<h2 class="demo-true-focus-h2" data-true-focus data-trigger="hover" style="--tf-color: var(--success); --tf-blur: 3px">Hover any word in this line</h2>`,
      css: `.demo-true-focus-h2 { font-size: 2rem; font-weight: 800; letter-spacing: -.02em; }`
    }
  ],
  api: [
    { name: 'data-true-focus', type: 'attr', desc: 'Enable on a heading; each word becomes a focus target.' },
    { name: 'data-interval', type: 'attr', default: '1800', desc: 'Milliseconds per word in auto mode.' },
    { name: 'data-trigger', type: 'attr', default: 'auto', desc: '<code>hover</code> moves focus to the hovered word.' },
    { name: '--tf-blur / --tf-color / --tf-dur', type: 'var', default: '5px / var(--primary) / 500ms', desc: 'Blur amount, bracket color and glide time.' },
    { name: '--tf-corner / --tf-pad', type: 'var', default: '14px / .14em', desc: 'Bracket size and offset.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ index }</code>' }
  ]
});
