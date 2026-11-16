(function () {
  var I = RB.ic;
  var close = '<button class="banner-close" aria-label="Dismiss announcement">' + I('x') + '</button>';
  RanjDocs.add({
    id: 'banner',
    name: 'Banner',
    group: 'Base',
    description: 'A full-width announcement bar for the top of the page: launches, promos, incidents and cookie notices. Dismissible, optionally remembered.',
    tags: ['new', 'js'],
    keywords: ['announcement', 'top bar', 'promo bar', 'notification bar', 'hello bar'],
    demos: [
      {
        title: 'Gradient launch',
        pad: false,
        center: false,
        height: 90,
        html: `<div class="banner banner-gradient banner-glow" role="region" aria-label="Announcement">
  <div class="banner-content"><span class="banner-pill">New</span><span>Ranj UI 2.0 is here, with 150+ components</span><a class="banner-link" href="#">Read the post ${I('arrowRight')}</a></div>
  ${close}
</div>`
      },
      {
        title: 'Styles',
        pad: false,
        center: false,
        html: `<div class="stack gap-3" style="padding:1rem">
  <div class="banner banner-floating" role="region" aria-label="Announcement"><div class="banner-content">${I('zap')}<b>Black Friday:</b> 40% off annual plans<span class="banner-sep"></span><a class="banner-link" href="#">Claim offer ${I('arrowRight')}</a></div>${close}</div>
  <div class="banner banner-primary banner-floating"><div class="banner-content">${I('rocket')} We just raised our Series B. <a href="#">Learn more</a></div>${close}</div>
  <div class="banner banner-soft banner-floating"><div class="banner-content">${I('sparkles')} AI search is now in beta for all workspaces.</div>${close}</div>
  <div class="banner banner-muted banner-floating"><div class="banner-content">${I('info')} You're viewing a read-only snapshot from Nov 2, 2026.</div></div>
  <div class="banner banner-warning banner-floating"><div class="banner-content">${I('alert')} Degraded performance in eu-west-1. <a href="#">Status page</a></div>${close}</div>
</div>`
      },
      {
        title: 'Remembered dismissal',
        description: 'With <code>data-dismiss-key</code> the banner stays hidden across reloads. Use the reset button to bring it back.',
        pad: false,
        center: false,
        html: `<div class="stack gap-3" style="padding:1rem">
  <div class="banner banner-primary banner-floating" data-dismiss-key="demo-banner-v2"><div class="banner-content">${I('bell')} Turn on desktop notifications to never miss a mention. <a href="#">Enable</a></div>${close}</div>
  <button class="btn btn-outline btn-sm demo-banner-reset" style="align-self:center">${I('refresh')} Reset banner</button>
</div>`,
        js: "root.querySelector('.demo-banner-reset').addEventListener('click', function () { Ranj.banner.reset(root.querySelector('.banner')); });"
      }
    ],
    api: [
      { name: '.banner', type: 'class', desc: 'High-contrast bar (inverted colors). Put text in <code>.banner-content</code>.' },
      { name: '.banner-primary', type: 'class', desc: 'Color styles. <code>.banner-glow</code> adds a moving highlight. Also: <code>.banner-soft</code> <code>.banner-muted</code> <code>.banner-warning</code> <code>.banner-danger</code> <code>.banner-gradient</code>' },
      { name: '.banner-floating', type: 'class', desc: 'Rounded with a shadow, for use inside a page.' },
      { name: '.banner-pill', type: 'class', desc: 'Label pill, arrow link, divider. Also: <code>.banner-link</code> <code>.banner-sep</code>' },
      { name: '.banner-close', type: 'class', desc: 'Dismiss button (collapses smoothly).' },
      { name: 'data-dismiss-key', type: 'attr', desc: 'Remember dismissal in localStorage.' },
      { name: 'Ranj.banner.close(el)', type: 'js', desc: 'Close, or clear the remembered dismissal and show it again. Also: <code>.reset(el)</code>' },
      { name: 'ranj:dismiss / ranj:dismissed', type: 'event', desc: 'Before (cancelable) and after hiding.' }
    ]
  });
})();
