RanjDocs.add({
  id: 'bg-aurora',
  name: 'Aurora',
  group: 'Backgrounds',
  description: 'Soft, blurred color blobs that drift and breathe. Pure CSS, follows your accent hue, and works in light and dark.',
  tags: ['new', 'fx'],
  keywords: ['gradient', 'blob', 'northern lights', 'hero background', 'blur'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-aurora"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>New</b> Ranj UI 2.0 is live</span>
    <h2>Ship interfaces that feel alive</h2>
    <p>Two files, zero dependencies. Drop in the stylesheet and script, and every component just works.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Get started</a><a class="btn btn-outline" href="#">Browse components</a></div>
  </div>
</div>` },
    { title: 'Ribbon curtains', description: 'Add <code>.bg-aurora-ribbon</code> for northern-lights curtains falling from the top.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-aurora bg-aurora-ribbon"></div>
  <div class="bg-hero">
    <h2>Analytics that light up your night</h2>
    <p>Real-time dashboards for teams who ship every day.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Start free trial</a></div>
  </div>
</div>` },
    { title: 'Custom colors + grain', description: 'Override <code>--c1</code> to <code>--c4</code>, and stack <code>.bg-noise</code> on top for a printed feel.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-aurora" style="--c1:#fb923c;--c2:#f472b6;--c3:#facc15;--c4:#c084fc;--speed:10s"></div>
  <div class="bg-noise"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Summer</b> Festival lineup announced</span>
    <h2>Sunset Sessions 2026</h2>
    <p>Three days of music on the bay. August 14 to 16, San Francisco.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Get tickets</a></div>
  </div>
</div>` }
  ],
  api: [
    { name: '.bg-aurora', type: 'class', desc: 'Fills its nearest positioned parent. Use <code>.bg-host</code> on the parent for overflow + stacking.' },
    { name: '.bg-aurora-ribbon', type: 'class', desc: 'Curtain variant.' },
    { name: '--c1 … --c4', type: 'var', default: 'hue based', desc: 'Blob colors. Default to your accent hue with offsets.' },
    { name: '--speed', type: 'var', default: '16s', desc: 'Drift cycle length.' },
    { name: '--blur', type: 'var', default: '64px', desc: 'Blur radius.' },
    { name: '--opacity', type: 'var', default: '.5', desc: 'Overall strength.' },
    { name: '.bg-host / .bg-hero / .bg-content', type: 'class', desc: 'Helpers shared by all backgrounds: host clips and isolates, content sits above.' }
  ]
});
