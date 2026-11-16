RanjDocs.add({
  id: 'rotating-text',
  name: 'Rotating Text',
  group: 'Text Effects',
  description: 'Cycles through a list of words with staggered per-letter transitions while the container smoothly animates its width to fit each word.',
  tags: ['new', 'fx', 'js'],
  keywords: ['word rotator', 'text loop', 'flip words', 'changing text', 'cycle'],
  demos: [
    {
      title: 'Hero with pill',
      height: 240,
      html: `
<h1 class="display-2 demo-rotating-text-h">Creative <span class="rotating-text rotating-text-pill" data-words="thinking|coding|components|vibes"></span></h1>`,
      css: `.demo-rotating-text-h { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .25em; text-align: center; }`
    },
    {
      title: 'Transitions',
      description: '<code>data-transition</code>: slide (default), drop, flip, blur, fade.',
      height: 340,
      html: `
<div class="demo-rotating-text-grid">
  <p>We help you <span class="rotating-text" data-words="launch|grow|scale|win"></span></p>
  <p>We help you <span class="rotating-text" data-transition="drop" data-interval="2400" data-words="launch|grow|scale|win"></span></p>
  <p>We help you <span class="rotating-text" data-transition="flip" data-interval="2600" data-words="launch|grow|scale|win"></span></p>
  <p>We help you <span class="rotating-text" data-transition="blur" data-interval="2800" data-words="launch|grow|scale|win"></span></p>
  <p>We help you <span class="rotating-text" data-transition="fade" data-interval="3000" data-words="launch|grow|scale|win"></span></p>
</div>`,
      css: `.demo-rotating-text-grid { display: grid; gap: .6rem; font-size: 1.6rem; font-weight: 700; letter-spacing: -.02em; text-align: center; }
.demo-rotating-text-grid .rotating-text { color: var(--primary); }`
    },
    {
      title: 'Whole words, children as source',
      description: 'Words can come from child elements; <code>data-split="words"</code> staggers by word for phrases.',
      html: `
<p class="demo-rotating-text-p">Built for <span class="rotating-text gradient-text gradient-text-sunset" data-split="words" data-interval="2600"><span>product designers</span><span>indie hackers</span><span>design engineers</span><span>agencies</span></span></p>`,
      css: `.demo-rotating-text-p { font-size: 1.75rem; font-weight: 800; letter-spacing: -.03em; text-align: center; }`
    }
  ],
  api: [
    { name: '.rotating-text', type: 'class', desc: 'Container. Words come from <code>data-words</code> or its child elements.' },
    { name: '.rotating-text-pill', type: 'class', desc: 'Accent pill background that resizes with each word.' },
    { name: 'data-words', type: 'attr', desc: 'Pipe-separated list: <code>launch|grow|scale</code>.' },
    { name: 'data-interval', type: 'attr', default: '2200', desc: 'Milliseconds each word stays.' },
    { name: 'data-transition', type: 'attr', default: 'slide', desc: 'slide, drop, flip, blur, fade.' },
    { name: 'data-split', type: 'attr', default: 'chars', desc: '<code>chars</code>, <code>words</code> or <code>none</code> (stagger unit).' },
    { name: 'data-align', type: 'attr', default: 'start', desc: 'Alignment while width animates: start, center, end.' },
    { name: 'data-pause', type: 'attr', default: 'true', desc: 'Pause while hovered.' },
    { name: 'data-loop', type: 'attr', default: 'true', desc: '<code>false</code> stops on the last word.' },
    { name: '--rt-dur / --rt-stagger / --rt-width-dur', type: 'var', default: '650ms / 22ms / 550ms', desc: 'Timing knobs.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ index, word }</code>' }
  ]
});
