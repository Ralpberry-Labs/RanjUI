RanjDocs.add({
  id: 'click-spark',
  name: 'Click Spark',
  group: 'Interactions',
  description: 'Short spark lines burst outward from every click inside an area, drawn on a lightweight canvas that only animates while sparks are alive.',
  tags: ['new', 'fx', 'js'],
  keywords: ['click effect', 'burst', 'sparkle', 'particles', 'tap feedback'],
  demos: [
    {
      title: 'Click anywhere in the area',
      height: 300,
      html: `
<div class="demo-click-spark-area" data-click-spark>
  <p>Click anywhere in here ✨</p>
</div>`,
      css: `.demo-click-spark-area { width: 100%; max-width: 640px; height: 240px; border-radius: var(--radius-2xl); border: 1px dashed var(--border-strong); display: grid; place-items: center; color: var(--muted-fg); user-select: none; cursor: crosshair; }`
    },
    {
      title: 'Custom sparks on a button',
      html: `
<button class="btn btn-primary btn-lg" data-click-spark="#f59e0b" data-spark-count="12" data-spark-radius="34" data-spark-size="14">Celebrate</button>
<button class="btn btn-outline btn-lg" data-click-spark="#ec4899" data-spark-count="6" data-spark-width="3">Like ♥</button>`
    }
  ],
  api: [
    { name: 'data-click-spark', type: 'attr', default: 'var(--primary)', desc: 'Enable; value sets the spark color.' },
    { name: 'data-spark-count', type: 'attr', default: '8', desc: 'Lines per burst.' },
    { name: 'data-spark-size / data-spark-radius', type: 'attr', default: '12 / 22', desc: 'Line length and travel distance (px).' },
    { name: 'data-spark-duration / data-spark-width', type: 'attr', default: '450 / 2', desc: 'Milliseconds and stroke width.' }
  ]
});
