(function () {
var file = function (n, active) { return '<div class="demo-rs-file' + (active ? ' is-active' : '') + '">' + n + '</div>'; };
RanjDocs.add({
  id: 'resizable',
  name: 'Resizable',
  group: 'Data Display',
  description: 'Panel groups with drag handles, horizontal or vertical and nestable. Sizes are percentages with min/max limits, panels can snap closed, handles are keyboard accessible (arrows, Home/End, Enter to collapse), double-click resets, and <code>data-autosave</code> remembers the layout.',
  tags: ['js'],
  keywords: ['split pane', 'splitter', 'panels', 'drag to resize', 'layout', 'ide'],
  demos: [
    {
      title: 'Editor layout',
      description: 'A nested group: sidebar | (editor / terminal). The sidebar collapses when dragged below half its minimum; focus a handle and press Enter to toggle it.',
      center: false,
      html: `<div class="resizable" style="height: 360px" data-autosave="docs-editor">
  <div class="resizable-panel demo-rs-side" data-size="24" data-min="16" data-max="40" data-collapsible>
    <div class="demo-rs-label">Explorer</div>
    ${file('app.tsx')}${file('DataTable.tsx', true)}${file('routes.ts')}${file('theme.css')}${file('package.json')}
  </div>
  <div class="resizable-handle" data-grip></div>
  <div class="resizable-panel" data-size="76">
    <div class="resizable resizable-vertical">
      <div class="resizable-panel demo-rs-code" data-size="68" data-min="25">
<pre><span class="k">export function</span> <span class="f">DataTable</span>({ rows }) {
  <span class="k">const</span> [sort, setSort] = useState(<span class="s">'mrr'</span>);
  <span class="k">return</span> &lt;Table rows={rows} sort={sort} /&gt;;
}</pre>
      </div>
      <div class="resizable-handle"></div>
      <div class="resizable-panel demo-rs-term" data-size="32" data-min="15">
        <div class="demo-rs-label">Terminal</div>
        <code>$ pnpm dev</code><code class="ok">✓ Ready in 412 ms · http://localhost:5173</code>
      </div>
    </div>
  </div>
</div>`,
      css: `.demo-rs-side { padding: .75rem .5rem; background: var(--bg-subtle); }
.demo-rs-label { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--muted-fg); padding: 0 .5rem .5rem; }
.demo-rs-file { font-size: .82rem; padding: .3rem .5rem; border-radius: var(--radius-sm); white-space: nowrap; color: var(--muted-fg); }
.demo-rs-file.is-active { background: var(--primary-soft); color: var(--primary-soft-fg); }
.demo-rs-code pre { margin: 0; padding: 1rem 1.2rem; font: .8rem/1.8 var(--font-mono); background: none; border: 0; }
.demo-rs-code .k { color: oklch(.6 .18 300); } .demo-rs-code .f { color: oklch(.6 .16 250); } .demo-rs-code .s { color: oklch(.6 .15 150); }
.demo-rs-term { padding: .75rem 1rem; background: #0b0b10; color: #d4d4d8; display: flex; flex-direction: column; gap: .2rem; }
.demo-rs-term .demo-rs-label { padding: 0 0 .35rem; color: #71717a; }
.demo-rs-term code { font: .78rem/1.6 var(--font-mono); background: none; padding: 0; }
.demo-rs-term .ok { color: #4ade80; }`
    },
    {
      title: 'Three columns with live sizes',
      description: '<code>data-labels</code> shows each panel’s size while you drag. Double-click a handle to split its neighbours evenly.',
      center: false,
      html: `<div class="resizable" data-labels style="height: 200px">
  <div class="resizable-panel demo-rs-box" data-size="25" data-min="15">Inbox</div>
  <div class="resizable-handle" data-grip></div>
  <div class="resizable-panel demo-rs-box" data-size="40" data-min="20">Conversation</div>
  <div class="resizable-handle" data-grip></div>
  <div class="resizable-panel demo-rs-box" data-size="35" data-min="20" data-max="45">Customer details</div>
</div>`,
      css: `.demo-rs-box { display: grid; place-items: center; text-align: center; padding: .75rem 1rem; font-size: .875rem; font-weight: 500; color: var(--muted-fg); }`
    }
  ],
  api: [
    { name: '.resizable', type: 'class', desc: 'Panel group (horizontal). Children alternate .resizable-panel and .resizable-handle. Groups can nest.' },
    { name: '.resizable-vertical', type: 'class', desc: 'Stack panels top to bottom.' },
    { name: '.resizable-panel[data-size]', type: 'attr', desc: 'Initial size in percent. Panels without one share the remainder.' },
    { name: 'data-min / data-max', type: 'attr', default: '0 / 100', desc: 'Size limits in percent (on a panel).' },
    { name: 'data-collapsible / data-collapsed-size', type: 'attr', default: '— / 0', desc: 'Snap the panel closed when dragged below half its minimum; Enter on the handle toggles it.' },
    { name: '.resizable-handle[data-grip]', type: 'attr', desc: 'Adds a visible grip pill to the handle.' },
    { name: 'data-autosave', type: 'attr', desc: 'On the group: localStorage key to remember sizes.' },
    { name: 'data-labels / data-step', type: 'attr', default: 'false / 5', desc: 'Show size badges while dragging; keyboard step in percent (Shift doubles).' },
    { name: '--handle-size / --handle-hit', type: 'var', default: '1px / 10px', desc: 'Visible line thickness and invisible grab area.' },
    { name: 'el.ranjResizable', type: 'js', desc: '{ sizes, setSizes([..]) }' },
    { name: 'ranj:resize', type: 'event', desc: 'After a drag or key press. detail: { sizes }' }
  ]
});
})();
