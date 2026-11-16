RanjDocs.add({
  id: 'table',
  name: 'Table',
  group: 'Data Display',
  description: 'Clean, dense table styles with striped, hover, bordered, compact and sticky-header variants, tinted row status, tabular numbers and a scrolling wrapper so wide tables never break a phone layout.',
  tags: [],
  keywords: ['grid', 'rows', 'columns', 'spreadsheet', 'invoice list', 'tabular'],
  demos: [
    {
      title: 'Invoices',
      center: false,
      html: `<div class="table-wrapper">
  <table class="table table-hover">
    <thead>
      <tr><th>Invoice</th><th>Customer</th><th>Status</th><th>Issued</th><th class="num">Amount</th></tr>
    </thead>
    <tbody>
      <tr><td class="mono">INV-2041</td><td><div class="table-cell-user"><span class="table-avatar">NV</span><div><b>Northwind Ventures</b><small>billing@northwind.io</small></div></div></td><td><span class="table-status is-success">Paid</span></td><td class="muted nowrap">Nov 12, 2026</td><td class="num">$12,480.00</td></tr>
      <tr><td class="mono">INV-2040</td><td><div class="table-cell-user"><span class="table-avatar">LH</span><div><b>Lumen Health</b><small>ap@lumenhealth.com</small></div></div></td><td><span class="table-status is-warning">Pending</span></td><td class="muted nowrap">Nov 09, 2026</td><td class="num">$3,920.50</td></tr>
      <tr><td class="mono">INV-2039</td><td><div class="table-cell-user"><span class="table-avatar">OS</span><div><b>Orbit Studio</b><small>hello@orbit.studio</small></div></div></td><td><span class="table-status is-danger">Overdue</span></td><td class="muted nowrap">Oct 28, 2026</td><td class="num">$8,150.00</td></tr>
      <tr><td class="mono">INV-2038</td><td><div class="table-cell-user"><span class="table-avatar">PK</span><div><b>Parcel &amp; Key</b><small>finance@parcelkey.co</small></div></div></td><td><span class="table-status is-success">Paid</span></td><td class="muted nowrap">Oct 21, 2026</td><td class="num">$1,299.00</td></tr>
      <tr><td class="mono">INV-2037</td><td><div class="table-cell-user"><span class="table-avatar">FA</span><div><b>Fernhill Analytics</b><small>ops@fernhill.ai</small></div></div></td><td><span class="table-status is-info">Draft</span></td><td class="muted nowrap">Oct 17, 2026</td><td class="num">$24,000.00</td></tr>
    </tbody>
    <tfoot>
      <tr><td colspan="4">Total outstanding</td><td class="num">$49,849.50</td></tr>
    </tfoot>
  </table>
</div>`
    },
    {
      title: 'Striped, bordered and compact',
      description: 'Combine <code>.table-striped</code>, <code>.table-bordered</code> and <code>.table-compact</code> for spreadsheet-like density.',
      center: false,
      html: `<div class="table-wrapper">
  <table class="table table-striped table-bordered table-compact">
    <thead>
      <tr><th>Region</th><th class="num">Q1</th><th class="num">Q2</th><th class="num">Q3</th><th class="num">Q4</th><th class="num">YoY</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row">North America</th><td class="num">$4.21M</td><td class="num">$4.68M</td><td class="num">$5.02M</td><td class="num">$5.74M</td><td class="num pos">+18.4%</td></tr>
      <tr><th scope="row">Europe</th><td class="num">$2.94M</td><td class="num">$3.10M</td><td class="num">$3.07M</td><td class="num">$3.55M</td><td class="num pos">+9.7%</td></tr>
      <tr><th scope="row">Asia Pacific</th><td class="num">$1.82M</td><td class="num">$2.06M</td><td class="num">$2.41M</td><td class="num">$2.89M</td><td class="num pos">+31.2%</td></tr>
      <tr><th scope="row">Latin America</th><td class="num">$0.74M</td><td class="num">$0.71M</td><td class="num">$0.69M</td><td class="num">$0.80M</td><td class="num neg">−2.3%</td></tr>
      <tr><th scope="row">Middle East &amp; Africa</th><td class="num">$0.51M</td><td class="num">$0.58M</td><td class="num">$0.62M</td><td class="num">$0.70M</td><td class="num pos">+12.9%</td></tr>
    </tbody>
  </table>
</div>`
    },
    {
      title: 'Sticky header',
      description: 'Give the wrapper a <code>max-height</code> and add <code>.table-sticky</code>; the header stays pinned with a frosted background.',
      center: false,
      html: `<div class="table-wrapper" style="max-height: 280px">
  <table class="table table-sticky table-hover">
    <thead><tr><th>Time</th><th>Event</th><th>Actor</th><th>IP address</th></tr></thead>
    <tbody>
      <tr><td class="mono nowrap">14:32:08</td><td>API key rotated</td><td>maya@acme.dev</td><td class="mono muted">10.24.1.18</td></tr>
      <tr><td class="mono nowrap">14:30:51</td><td>Deploy <b>web@a91f3c</b> promoted</td><td>ci-bot</td><td class="mono muted">34.122.8.7</td></tr>
      <tr><td class="mono nowrap">14:22:17</td><td>Member invited</td><td>jon@acme.dev</td><td class="mono muted">10.24.1.44</td></tr>
      <tr><td class="mono nowrap">14:09:02</td><td>SSO enforced for workspace</td><td>maya@acme.dev</td><td class="mono muted">10.24.1.18</td></tr>
      <tr><td class="mono nowrap">13:58:40</td><td>Webhook endpoint added</td><td>priya@acme.dev</td><td class="mono muted">10.24.2.91</td></tr>
      <tr><td class="mono nowrap">13:41:13</td><td>Billing plan changed to Scale</td><td>owner</td><td class="mono muted">10.24.0.2</td></tr>
      <tr><td class="mono nowrap">13:12:55</td><td>Failed sign-in attempt</td><td>unknown</td><td class="mono muted">185.220.101.4</td></tr>
      <tr><td class="mono nowrap">12:47:30</td><td>Environment variable updated</td><td>jon@acme.dev</td><td class="mono muted">10.24.1.44</td></tr>
      <tr><td class="mono nowrap">12:15:09</td><td>Domain verified</td><td>priya@acme.dev</td><td class="mono muted">10.24.2.91</td></tr>
      <tr><td class="mono nowrap">11:58:44</td><td>Audit log exported</td><td>maya@acme.dev</td><td class="mono muted">10.24.1.18</td></tr>
    </tbody>
  </table>
</div>`
    },
    {
      title: 'Row status',
      description: 'Set <code>data-status="success|warning|danger|info"</code> on a row for a soft tint and left accent.',
      center: false,
      html: `<div class="table-wrapper">
  <table class="table">
    <thead><tr><th>Service</th><th>Region</th><th class="num">p95 latency</th><th class="num">Error rate</th><th>Status</th></tr></thead>
    <tbody>
      <tr data-status="success"><td><b>api-gateway</b></td><td class="muted">us-east-1</td><td class="num">82 ms</td><td class="num">0.02%</td><td><span class="table-status is-success">Operational</span></td></tr>
      <tr data-status="warning"><td><b>search-indexer</b></td><td class="muted">eu-west-2</td><td class="num">640 ms</td><td class="num">0.9%</td><td><span class="table-status is-warning">Degraded</span></td></tr>
      <tr data-status="danger"><td><b>payments-worker</b></td><td class="muted">us-west-2</td><td class="num">2,410 ms</td><td class="num">7.4%</td><td><span class="table-status is-danger">Incident</span></td></tr>
      <tr data-status="info"><td><b>media-cdn</b></td><td class="muted">ap-south-1</td><td class="num">—</td><td class="num">—</td><td><span class="table-status is-info">Maintenance</span></td></tr>
      <tr><td><b>auth</b></td><td class="muted">us-east-1</td><td class="num">41 ms</td><td class="num">0.00%</td><td><span class="table-status is-success">Operational</span></td></tr>
    </tbody>
  </table>
</div>`
    },
    {
      title: 'Stacked on phones',
      description: 'Add <code>.table-stack</code> and a <code>data-label</code> on each cell: below 560px every row becomes a card. Shrink your browser to see it.',
      center: false,
      html: `<div class="table-wrapper">
  <table class="table table-stack">
    <thead><tr><th>Order</th><th>Product</th><th>Qty</th><th class="num">Total</th></tr></thead>
    <tbody>
      <tr><td data-label="Order" class="mono">#10482</td><td data-label="Product">Aeron Chair, Graphite</td><td data-label="Qty">2</td><td data-label="Total" class="num">$2,790.00</td></tr>
      <tr><td data-label="Order" class="mono">#10481</td><td data-label="Product">Studio Display 27″</td><td data-label="Qty">1</td><td data-label="Total" class="num">$1,599.00</td></tr>
      <tr><td data-label="Order" class="mono">#10480</td><td data-label="Product">MX Keys Mini</td><td data-label="Qty">6</td><td data-label="Total" class="num">$594.00</td></tr>
    </tbody>
  </table>
</div>`
    }
  ],
  api: [
    { name: '.table', type: 'class', desc: 'Base table. Uses tabular numbers and separate borders so rounded wrappers clip cleanly.' },
    { name: '.table-wrapper', type: 'class', desc: 'Bordered, rounded, horizontally scrolling container. Alias: .table-wrap. Add .table-flush to drop the frame.' },
    { name: '.table-striped / .table-hover / .table-bordered', type: 'class', desc: 'Zebra rows, hover highlight, vertical cell borders.' },
    { name: '.table-compact / .table-lg / .table-borderless', type: 'class', desc: 'Density and border variants. .table-sm is an alias of .table-compact.' },
    { name: '.table-sticky', type: 'class', desc: 'Pins the header while the wrapper scrolls (give the wrapper a max-height).' },
    { name: '.table-sticky-col', type: 'class', desc: 'Pins the first column while scrolling horizontally.' },
    { name: '.table-stack', type: 'class', desc: 'Below 560px rows become label/value cards. Needs data-label on cells.' },
    { name: '.num / .mono / .muted / .nowrap / .shrink / .pos / .neg', type: 'class', desc: 'Cell helpers: right-aligned numbers, monospace, muted text, no wrapping, shrink-to-fit, positive/negative values.' },
    { name: '.table-status.is-success|warning|danger|info|primary', type: 'class', desc: 'Self-contained status pill with a dot.' },
    { name: '.table-cell-user', type: 'class', desc: 'Avatar + name + secondary line cell layout (.table-avatar for initials).' },
    { name: 'tr[data-status]', type: 'attr', desc: 'success | warning | danger | info. Tints the row and adds a left accent.' },
    { name: 'tr[aria-selected="true"]', type: 'attr', desc: 'Selected row styling.' },
    { name: '--table-px / --table-py', type: 'var', default: '1rem / .75rem', desc: 'Cell padding.' },
    { name: '--table-stripe / --table-hover / --table-head-bg', type: 'var', desc: 'Row and header fills.' }
  ]
});
