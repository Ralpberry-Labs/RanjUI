(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'empty-state',
    name: 'Empty state',
    group: 'Base',
    description: 'What people see when there is nothing here yet. Explain why, then offer the next step.',
    keywords: ['blank slate', 'no results', 'zero state', 'no data', 'placeholder'],
    demos: [
      {
        title: 'First run',
        html: `<div class="empty-state empty-state-bordered" style="width:min(100%,34rem)">
  <div class="empty-state-stack"><span>${I('fileCode')}</span><span>${I('image')}</span><span>${I('folder')}</span></div>
  <h3 class="empty-state-title">No projects yet</h3>
  <p class="empty-state-description">Projects hold your deployments, domains and environment variables. Import a Git repository to create your first one.</p>
  <div class="empty-state-actions"><button class="btn">${I('plus')} New project</button><button class="btn btn-outline">${I('github')} Import from GitHub</button></div>
</div>`,
        height: 380
      },
      {
        title: 'No search results',
        html: `<div class="empty-state empty-state-card" style="width:min(100%,26rem)">
  <div class="empty-state-icon">${I('search')}</div>
  <h3 class="empty-state-title">No results for "invoice 2025"</h3>
  <p class="empty-state-description">Try a different keyword, or check the spelling. Archived items are not included.</p>
  <div class="empty-state-actions"><button class="btn btn-secondary btn-sm">Clear search</button><button class="btn btn-ghost btn-sm">Search archive</button></div>
</div>`
      },
      {
        title: 'Inbox zero and offline',
        center: false,
        html: `<div class="grid grid-auto" style="--min:240px">
  <div class="empty-state empty-state-sm">
    <div class="empty-state-icon empty-state-icon-primary">${I('inbox')}</div>
    <h3 class="empty-state-title">You're all caught up</h3>
    <p class="empty-state-description">New mentions and assignments will show up here.</p>
  </div>
  <div class="empty-state empty-state-sm">
    <div class="empty-state-icon">${I('wifiOff')}</div>
    <h3 class="empty-state-title">You're offline</h3>
    <p class="empty-state-description">We'll sync your changes when you reconnect.</p>
    <div class="empty-state-actions"><button class="btn btn-outline btn-sm">${I('refresh')} Retry</button></div>
  </div>
</div>`
      }
    ],
    api: [
      { name: '.empty-state', type: 'class', desc: 'Centered column.' },
      { name: '.empty-state-bordered', type: 'class', desc: 'Dashed drop-zone look, card surface, compact. Also: <code>.empty-state-card</code> <code>.empty-state-sm</code>' },
      { name: '.empty-state-icon', type: 'class', desc: 'Icon tile with a soft halo. Also: <code>.empty-state-icon-primary</code>' },
      { name: '.empty-state-stack', type: 'class', desc: 'Fanned three-card illustration (three children with icons).' },
      { name: '.empty-state-title', type: 'class', desc: 'Text and action slots. Also: <code>.empty-state-description</code> <code>.empty-state-actions</code> <code>.empty-state-footer</code>' }
    ]
  });
})();
