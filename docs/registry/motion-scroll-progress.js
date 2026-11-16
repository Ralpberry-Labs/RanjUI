RanjDocs.add({
  id: 'scroll-progress',
  name: 'Scroll Progress',
  group: 'Motion',
  description: 'A reading progress bar pinned to the top of the page, or a circular ring that doubles as a back-to-top button. Tracks the window, an article, or any scroll container.',
  tags: ['new', 'fx', 'js'],
  keywords: ['reading progress', 'progress bar', 'scroll indicator', 'back to top'],
  demos: [
    {
      title: 'In a scroll container',
      description: 'Scroll the article. The bar is sticky inside the box here; on a real page just drop <code>&lt;div class="scroll-progress"&gt;</code> anywhere.',
      pad: false, center: false,
      html: `
<div class="demo-scroll-progress-box">
  <div class="scroll-progress scroll-progress-sticky"></div>
  <article class="demo-scroll-progress-article">
    <p class="eyebrow">Engineering · 6 min read</p>
    <h2>How we made every animation run at 60fps</h2>
    <p>Performance is a feature. When an interface stutters, people stop trusting it. We set a simple rule for Ranj UI: every effect animates only transform, opacity or filter, and every loop pauses when it scrolls offscreen.</p>
    <p>That one rule removed almost all layout thrash. The browser can hand those properties to the compositor, so even a busy marquee costs nearly nothing on the main thread.</p>
    <p>The second rule: read, then write. Every effect batches its measurements first and applies styles after, in a single requestAnimationFrame. No interleaving, no forced reflow.</p>
    <p>Finally, everything respects reduced motion. If a user asks for less movement, effects jump to their final state instead of disappearing.</p>
    <p>The result is a library that feels alive without ever feeling heavy.</p>
  </article>
  <button class="scroll-ring demo-scroll-progress-ring" data-scroll-top aria-label="Back to top">↑</button>
</div>`,
      css: `.demo-scroll-progress-box { position: relative; height: 380px; overflow-y: auto; }
.demo-scroll-progress-article { max-width: 640px; margin: 0 auto; padding: 2rem 1.5rem 4rem; display: grid; gap: 1rem; }
.demo-scroll-progress-article p { color: var(--muted-fg); line-height: 1.75; }
.demo-scroll-progress-ring { position: sticky; bottom: 1rem; left: calc(100% - 4rem); margin: -3.5rem 1rem 1rem auto; background: var(--card); box-shadow: var(--shadow-md); font-weight: 700; color: var(--fg); }`
    },
    {
      title: 'Ring sizes',
      html: `
<div class="demo-scroll-progress-rings">
  <span class="scroll-ring" data-value="25">25</span>
  <span class="scroll-ring" data-value="60" style="--size: 56px">60</span>
  <span class="scroll-ring" data-value="90" style="--size: 72px">90</span>
</div>`,
      css: `.demo-scroll-progress-rings { display: flex; gap: 1.5rem; align-items: center; font-size: .8rem; font-weight: 700; }`
    }
  ],
  api: [
    { name: '.scroll-progress', type: 'class', desc: 'Fixed top bar (scaleX, GPU-cheap).' },
    { name: '.scroll-progress-sticky / -bottom', type: 'class', desc: 'Sticky inside a scroll container / pin to the bottom.' },
    { name: '.scroll-ring', type: 'class', desc: 'Circular indicator (SVG is injected).' },
    { name: 'data-target', type: 'attr', default: 'nearest scroller', desc: 'Selector of a scroll container or an article to track; falls back to the window.' },
    { name: 'data-value', type: 'attr', desc: 'Static value (0–1 or 0–100) instead of tracking scroll.' },
    { name: 'data-scroll-top', type: 'attr', desc: 'Clicking scrolls the target back to the top.' },
    { name: '--progress', type: 'var', desc: '0–1, written by the script (set it yourself for a static ring).' },
    { name: '--sp-height / --sp-color', type: 'var', default: '3px / accent gradient', desc: 'Bar thickness and fill.' }
  ]
});
