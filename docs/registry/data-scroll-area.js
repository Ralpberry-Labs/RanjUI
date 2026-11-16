(function () {
var tags = ['v4.2.0', 'v4.1.3', 'v4.1.2', 'v4.1.1', 'v4.1.0', 'v4.0.2', 'v4.0.1', 'v4.0.0', 'v3.9.4', 'v3.9.3', 'v3.9.2', 'v3.9.1', 'v3.9.0', 'v3.8.6', 'v3.8.5', 'v3.8.4', 'v3.8.3', 'v3.8.2', 'v3.8.1', 'v3.8.0'];
var cover = function (id) { return 'https://images.unsplash.com/' + id + '?w=360&h=460&fit=crop&q=70&auto=format'; };
var art = [['photo-1506905925346-21bda4d32df4', 'Above the Clouds', 'Nora Lindqvist'], ['photo-1519681393784-d120267933ba', 'Night Walks', 'Kai Mendes'], ['photo-1501785888041-af3ef285b470', 'Still Water', 'Amara Okafor'], ['photo-1469474968028-56623f02e42e', 'Morning Light', 'Theo Brandt'], ['photo-1470071459604-3b5ec3a7fe05', 'Pine & Fog', 'Lena Park'], ['photo-1507525428034-b723cf961d3e', 'Low Tide', 'Ravi Shah'], ['photo-1433086966358-54859d0ed716', 'Falling', 'June Ito']];
RanjDocs.add({
  id: 'scroll-area',
  name: 'Scroll Area',
  group: 'Data Display',
  description: 'A scroll container with slim overlay scrollbars that fade in on hover or while scrolling, draggable thumbs, click-to-page tracks, and optional edge fades that appear only where more content is hidden. Without JS it falls back to thin native scrollbars.',
  tags: ['js'],
  keywords: ['scrollbar', 'overflow', 'custom scrollbar', 'scrollable', 'horizontal scroll', 'rail'],
  demos: [
    {
      title: 'Vertical list',
      html: `<div class="scroll-area demo-sa-box" style="height: 288px; width: 220px">
  <div style="padding: .75rem 1rem">
    <div class="demo-sa-head">Releases</div>
${tags.map(function (t, i) { return '    <div class="demo-sa-row"><span>' + t + '</span><small>' + ['Nov 14', 'Nov 02', 'Oct 27', 'Oct 19', 'Oct 08', 'Sep 30', 'Sep 21', 'Sep 12', 'Aug 29', 'Aug 18', 'Aug 06', 'Jul 30', 'Jul 21', 'Jul 09', 'Jun 28', 'Jun 17', 'Jun 05', 'May 26', 'May 14', 'May 02'][i] + '</small></div>'; }).join('\n')}
  </div>
</div>`,
      css: `.demo-sa-box { border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); }
.demo-sa-head { font-size: .8rem; font-weight: 600; margin-bottom: .5rem; }
.demo-sa-row { display: flex; justify-content: space-between; padding: .45rem 0; border-top: 1px solid var(--border); font-size: .85rem; font-family: var(--font-mono); }
.demo-sa-row small { color: var(--muted-fg); font-family: var(--font-sans); }`,
      height: 340
    },
    {
      title: 'Horizontal rail with fades',
      description: '<code>.scroll-area-x</code> scrolls sideways (the mouse wheel works too), <code>.scroll-area-fade</code> fades the edges that have more content, <code>.scroll-area-snap</code> snaps items.',
      center: false,
      html: `<div class="scroll-area scroll-area-x scroll-area-fade scroll-area-snap">
  <div class="scroll-rail">
${art.map(function (a) { return '    <figure class="demo-sa-cover"><img src="' + cover(a[0]) + '" alt=""><figcaption><b>' + a[1] + '</b><span>' + a[2] + '</span></figcaption></figure>'; }).join('\n')}
  </div>
</div>`,
      css: `.demo-sa-cover { width: 150px; margin: 0; }
.demo-sa-cover img { width: 150px; height: 190px; object-fit: cover; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.demo-sa-cover figcaption { margin-top: .5rem; font-size: .8rem; display: grid; }
.demo-sa-cover span { color: var(--muted-fg); font-size: .75rem; }`
    },
    {
      title: 'Both axes',
      description: 'Big content scrolls in both directions; each overlay bar is independent. <code>.scroll-area-always</code> keeps bars visible.',
      html: `<div class="scroll-area scroll-area-always scroll-area-fade demo-sa-box" style="width: min(100%, 420px); height: 240px">
  <pre class="demo-sa-code">{
  "name": "ranj-ui",
  "version": "2.0.0",
  "description": "The zero-dependency HTML/CSS/vanilla-JS component library with 150+ components, motion effects and micro-interactions.",
  "scripts": {
    "build": "node build.mjs",
    "dev": "node build.mjs --watch",
    "check": "node scripts/check.mjs --out=.shots && node scripts/check.mjs --dark --out=.shots"
  },
  "files": ["dist", "src"],
  "devDependencies": {
    "esbuild": "^0.24.0",
    "playwright": "^1.65.1"
  },
  "keywords": ["ui", "components", "component-library", "css-framework", "vanilla-js", "animations", "micro-interactions"]
}</pre>
</div>`,
      css: `.demo-sa-code { margin: 0; padding: 1rem 1.1rem; font: .8rem/1.7 var(--font-mono); width: max-content; color: var(--fg); background: none; border: 0; }`
    }
  ],
  api: [
    { name: '.scroll-area', type: 'class', desc: 'Scroll container. Give it a height or max-height. With ranj.js its content is wrapped in .scroll-area-viewport and overlay bars are added.' },
    { name: '.scroll-area-x / .scroll-area-y', type: 'class', desc: 'Restrict to one axis. Horizontal areas also scroll with a vertical mouse wheel.' },
    { name: '.scroll-area-fade', type: 'class', desc: 'Fades the edges that have hidden content (data-more-top/bottom/left/right are set for you).' },
    { name: '.scroll-area-always / .scroll-area-snap / .scroll-rail', type: 'class', desc: 'Always show bars; snap children; horizontal flex row of items.' },
    { name: 'data-native', type: 'attr', desc: 'Keep native (thin, styled) scrollbars and skip the JS overlay.' },
    { name: '--sa-size / --sa-thumb / --sa-thumb-hover / --sa-fade', type: 'var', default: '10px / fg 26% / fg 42% / 2.5rem', desc: 'Bar thickness, thumb colors, fade length.' },
    { name: 'el.ranjScrollArea', type: 'js', desc: '{ viewport, update() }: scroll the viewport element directly.' },
    { name: 'ranj:scroll', type: 'event', desc: 'detail: { top, left }' }
  ]
});
})();
