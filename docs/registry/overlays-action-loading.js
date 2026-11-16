(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'action-loading',
    name: 'Action Loading Dialog',
    group: 'Feedback',
    description: 'One dialog that walks through a whole action: confirm, then a loading state with rotating status text, then an animated success check (or an error). The panel morphs its height between steps instead of swapping modals.',
    tags: ['js', 'new'],
    keywords: ['loading dialog', 'progress modal', 'success state', 'payment', 'processing', 'async action'],
    demos: [
      {
        title: 'Payment',
        description: 'Confirm to see loading → success; the dialog closes itself 1.8s later.',
        html: `
<button class="btn" data-dialog-open="action-pay">${I.card} Pay $249.00</button>

<div class="dialog-overlay" id="action-pay">
  <div class="action-dialog" data-autoclose="1800" data-duration="2600" data-celebrate>
    <div class="action-view" data-view="confirm">
      <div class="action-media">${I.card}</div>
      <h3>Confirm payment</h3>
      <p>You'll be charged today and every year until you cancel.</p>
      <div class="action-summary">
        <div><span>Northwind Pro · annual</span><b>$228.00</b></div>
        <div><span>Tax</span><b>$21.00</b></div>
        <div><span>Visa •••• 4242</span><b>$249.00</b></div>
      </div>
      <div class="action-buttons"><button class="btn btn-outline" data-dialog-close>Cancel</button><button class="btn" data-action-run>Pay now</button></div>
    </div>
    <div class="action-view" data-view="loading">
      <div class="action-spinner"></div>
      <h3>Processing payment</h3>
      <p class="action-status" data-messages="Contacting your bank…|Verifying 3-D Secure…|Finalizing receipt…"></p>
      <div class="action-progress"></div>
    </div>
    <div class="action-view" data-view="success">
      <div class="action-check"></div>
      <h3>Payment complete</h3>
      <p>Receipt #NW-20931 is on its way to maya@northwind.app.</p>
      <div class="action-buttons"><button class="btn btn-secondary" data-dialog-close>Done</button></div>
    </div>
    <div class="action-view" data-view="error">
      <div class="action-cross"></div>
      <h3>Payment declined</h3>
      <p>Your bank declined the charge.</p>
      <div class="action-buttons"><button class="btn btn-outline" data-dialog-close>Close</button><button class="btn" data-action-view="confirm">Try again</button></div>
    </div>
  </div>
</div>`
      },
      {
        title: 'With your own task',
        description: '<code>Ranj.actionDialog.run(el, () => promise)</code> drives the states from a real async call. This one fails half the time.',
        html: `
<button class="btn btn-outline" id="action-export-go">${I.download} Export 12,480 rows</button>

<div class="dialog-overlay" id="action-export">
  <div class="action-dialog" data-autoclose="0">
    <div class="action-view" data-view="loading">
      <div class="action-spinner"></div>
      <h3>Preparing export</h3>
      <p class="action-status" data-messages="Querying 12,480 rows…|Formatting CSV…|Compressing…" data-interval="700"></p>
      <div class="action-progress"><span id="action-export-bar"></span></div>
    </div>
    <div class="action-view" data-view="success">
      <div class="action-check"></div>
      <h3>Export ready</h3>
      <p>customers-2026-11-16.csv.zip · 1.8 MB</p>
      <div class="action-buttons"><button class="btn btn-outline" data-dialog-close>Close</button><button class="btn" data-dialog-close>${I.download} Download</button></div>
    </div>
    <div class="action-view" data-view="error">
      <div class="action-cross"></div>
      <h3>Export failed</h3>
      <p>Something went wrong.</p>
      <div class="action-buttons"><button class="btn btn-outline" data-dialog-close>Close</button><button class="btn" id="action-export-retry">${I.refresh} Retry</button></div>
    </div>
  </div>
</div>`,
        js: `var bar = root.querySelector('#action-export-bar');
function task() {
  return new Promise(function (res, rej) {
    var p = 0; bar.style.setProperty('--p', '0%');
    var t = setInterval(function () { p = Math.min(100, p + 9 + Math.random() * 14); bar.style.setProperty('--p', p + '%');
      if (p >= 100) { clearInterval(t); Math.random() < .5 ? res() : rej(new Error('The warehouse timed out after 30s. Your data is safe.')); } }, 220);
  });
}
function go() { Ranj.actionDialog.run('action-export', task); }
root.querySelector('#action-export-go').onclick = go;
root.querySelector('#action-export-retry').onclick = go;`
      },
      {
        title: 'States',
        description: 'Inline (<code>.action-inline</code>) so you can see every state at once.',
        html: `
<div class="demo-action-row">
  <div class="action-dialog action-inline" data-view="loading">
    <div class="action-view" data-view="loading"><div class="action-spinner"></div><h3>Publishing site</h3><p class="action-status" data-messages="Building pages…|Optimizing images…|Uploading to edge…"></p><div class="action-progress"></div></div>
  </div>
  <div class="action-dialog action-inline" data-view="success">
    <div class="action-view" data-view="success"><div class="action-check"></div><h3>Site is live</h3><p>northwind.app was published to 34 regions.</p></div>
  </div>
  <div class="action-dialog action-inline" data-view="error">
    <div class="action-view" data-view="error"><div class="action-cross"></div><h3>Couldn't publish</h3><p>DNS for northwind.app isn't pointing to us yet.</p></div>
  </div>
</div>`,
        css: `.demo-action-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1rem; width: min(52rem, calc(100vw - 4rem)); align-items: start; }
.demo-action-row .action-dialog { max-width: none; }`
      }
    ],
    api: [
      { name: '.action-dialog', type: 'class', desc: 'Panel (inside a <code>.dialog-overlay</code>, or <code>.action-inline</code>). Holds <code>.action-view</code>s.' },
      { name: '.action-view[data-view]', type: 'class', desc: '<code>confirm</code>, <code>loading</code>, <code>success</code>, <code>error</code> (any names work). First one shows initially, or set <code>data-view</code> on the dialog.' },
      { name: '.action-spinner .action-progress .action-check .action-cross', type: 'class', desc: 'Visuals. Empty check/cross get an animated stroke icon. <code>.action-progress > span</code> with <code>--p</code> for determinate progress.' },
      { name: '.action-status[data-messages="a|b|c"]', type: 'class', desc: 'Rotating status text while loading (<code>data-interval</code>, ms).' },
      { name: 'data-action-run', type: 'attr', desc: 'Button: runs the task (see <code>task()</code>), or fires <code>ranj:run</code> with <code>{ done, fail }</code>; unhandled → simulated success after <code>data-duration</code>.' },
      { name: 'data-action-view="name"', type: 'attr', desc: 'Button: switch to a view (e.g. “Try again”).' },
      { name: 'data-autoclose', type: 'attr', default: '—', desc: 'Close the dialog this many ms after success.' },
      { name: 'data-celebrate', type: 'attr', desc: 'Small confetti burst on success.' },
      { name: 'Ranj.actionDialog.run(el, task, opts)', type: 'js', desc: 'Opens if needed, loading → success/error. opts: <code>autoClose, minDuration (900), success, error</code> (<code>{ title, text }</code> or fn).' },
      { name: 'Ranj.actionDialog.view(el, name) / task(el, fn)', type: 'js', desc: 'Switch view manually / register the task for <code>data-action-run</code>.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ view }</code> on the dialog.' }
    ]
  });
})();
