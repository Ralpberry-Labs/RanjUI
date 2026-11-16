RanjDocs.add({
  id: 'animated-status-icons',
  name: 'Animated Status Icons',
  group: 'Micro-interactions',
  description: 'Success, error, warning and info icons that draw themselves stroke by stroke when they scroll into view.',
  tags: ['new', 'fx', 'js'],
  keywords: ['success check', 'error', 'warning', 'info', 'checkmark animation', 'svg draw'],
  demos: [
    { title: 'All four', description: 'Press Replay in the toolbar to draw them again.', html: `
<span class="status-icon" data-type="success"></span>
<span class="status-icon" data-type="error"></span>
<span class="status-icon" data-type="warning"></span>
<span class="status-icon" data-type="info"></span>` },
    { title: 'Payment result', height: 320, html: `
<div style="width:min(340px,100%);display:grid;justify-items:center;gap:.6rem;text-align:center;padding:1.75rem 1.5rem;border:1px solid var(--border);border-radius:var(--radius-2xl);background:var(--card);box-shadow:var(--shadow-lg)">
  <span class="status-icon status-icon-lg" data-type="success"></span>
  <b style="font-size:1.15rem">Payment successful</b>
  <p style="color:var(--muted-fg);font-size:.9rem">$249.00 was charged to Visa ending 4242. A receipt is on its way.</p>
  <div style="display:flex;gap:.5rem;margin-top:.4rem"><button class="btn btn-sm" data-demo-si="success">Success</button><button class="btn btn-sm btn-outline" data-demo-si="error">Error</button></div>
</div>`, js: `
var icon = root.querySelector('.status-icon'), title = root.querySelector('b'), text = root.querySelector('p');
root.querySelectorAll('[data-demo-si]').forEach(function (b) { b.onclick = function () {
  var ok = b.getAttribute('data-demo-si') === 'success';
  Ranj.statusIcon(icon, ok ? 'success' : 'error');
  title.textContent = ok ? 'Payment successful' : 'Payment declined';
  text.textContent = ok ? '$249.00 was charged to Visa ending 4242. A receipt is on its way.' : 'Your bank declined the charge. Try another card or contact your bank.';
}; });` }
  ],
  api: [
    { name: '.status-icon', type: 'class', desc: 'Empty span; SVG injected and played on scroll into view.' },
    { name: 'data-type', type: 'attr', default: 'success', desc: '<code>success error warning info</code>.' },
    { name: '.status-icon-sm / .status-icon-lg', type: 'class', desc: 'Sizes (28 / 72px). Or set <code>--size</code>.' },
    { name: '--c / --dur', type: 'var', desc: 'Color and draw duration.' },
    { name: 'Ranj.statusIcon(el, [type])', type: 'js', desc: 'Replay, optionally switching type.' }
  ]
});
