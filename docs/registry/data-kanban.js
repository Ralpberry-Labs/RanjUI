(function () {
var face = function (id) { return 'https://images.unsplash.com/' + id + '?w=64&h=64&fit=crop&crop=faces&q=70'; };
var P = { maya: face('photo-1494790108377-be9c29b29330'), jon: face('photo-1500648767791-00dcc994a43e'), priya: face('photo-1438761681033-6461ffad8d80'), leo: face('photo-1472099645785-5658abf4ff4e'), ava: face('photo-1534528741775-53994a69daeb') };
var L = { bug: '--c: oklch(.62 .2 25)', feat: '--c: oklch(.6 .18 285)', design: '--c: oklch(.65 .17 330)', infra: '--c: oklch(.62 .14 200)', docs: '--c: oklch(.65 .13 150)' };
var msg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
var clip = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/></svg>';
function card(id, title, label, lvl, who, extra) {
  return '<article class="kanban-card" data-id="' + id + '">\n' +
    '        <div class="kanban-card-top"><span class="kanban-id">' + id + '</span><span class="kanban-priority" data-level="' + lvl + '"><i></i><i></i><i></i></span></div>\n' +
    '        <div class="kanban-card-title">' + title + '</div>\n' +
    '        <div class="kanban-card-meta"><span class="kanban-label" style="' + L[label] + '">' + label + '</span>' + (extra || '') + '<img class="kanban-avatar" src="' + P[who] + '" alt="' + who + '"></div>\n' +
    '      </article>';
}
RanjDocs.add({
  id: 'kanban',
  name: 'Kanban',
  group: 'Data Display',
  description: 'A board of columns with cards you can drag between them using pointer events (mouse, pen, long-press on touch) or the keyboard. Cards tilt with your drag speed, siblings slide out of the way, columns auto-scroll, and every drop fires a cancelable <code>ranj:move</code>.',
  tags: ['new', 'js', 'fx'],
  keywords: ['board', 'trello', 'drag and drop', 'sortable', 'tasks', 'issues', 'linear', 'jira'],
  demos: [
    {
      title: 'Issue board',
      description: 'Drag cards around. With the keyboard: focus a card, press Space to lift, arrows to move, Space to drop, Escape to cancel. <code>data-limit</code> flags a column over its WIP limit.',
      center: false,
      height: 520,
      html: `<div class="kanban" data-kanban>
  <section class="kanban-column" data-column="backlog">
    <header class="kanban-header"><span class="kanban-dot" style="--c: var(--muted-fg)"></span><h3>Backlog</h3><span class="kanban-count"></span></header>
    <div class="kanban-list">
      ${card('ENG-1520', 'Audit log export to S3', 'infra', 1, 'leo')}
      ${card('ENG-1517', 'Keyboard shortcuts cheat sheet', 'docs', 1, 'ava')}
      ${card('ENG-1509', 'Dark mode for email templates', 'design', 2, 'priya')}
    </div>
  </section>
  <section class="kanban-column" data-column="todo">
    <header class="kanban-header"><span class="kanban-dot" style="--c: var(--info)"></span><h3>Todo</h3><span class="kanban-count"></span></header>
    <div class="kanban-list">
      ${card('ENG-1498', 'Charts flicker when the sidebar collapses', 'bug', 'urgent', 'maya', '<span>' + msg + '4</span>')}
      ${card('ENG-1493', 'Bulk-edit labels from the data table', 'feat', 2, 'jon')}
    </div>
  </section>
  <section class="kanban-column" data-column="in-progress" data-limit="2">
    <header class="kanban-header"><span class="kanban-dot" style="--c: var(--warning)"></span><h3>In progress</h3><span class="kanban-count"></span></header>
    <div class="kanban-list">
      ${card('ENG-1471', 'Apple Pay at checkout', 'feat', 3, 'priya', '<span>' + clip + '2</span>')}
      ${card('ENG-1466', 'Rate limiter returns 500 instead of 429', 'bug', 3, 'leo', '<span>' + msg + '11</span>')}
    </div>
  </section>
  <section class="kanban-column" data-column="done">
    <header class="kanban-header"><span class="kanban-dot" style="--c: var(--success)"></span><h3>Done</h3><span class="kanban-count"></span></header>
    <div class="kanban-list" data-empty="Nothing shipped yet this cycle"></div>
  </section>
</div>
<p class="demo-kanban-log" style="font-size:.8rem;color:var(--muted-fg);margin:.75rem 0 0">Last move: none</p>`,
      js: `const log = root.querySelector('.demo-kanban-log');
root.addEventListener('ranj:move', (e) => {
  const d = e.detail;
  log.textContent = 'Last move: ' + d.id + ' from ' + d.from + ' to ' + d.to + ' (position ' + (d.index + 1) + ')';
});`
    },
    {
      title: 'Simple lists',
      description: 'Any markup works: columns of <code>.kanban-list</code> with <code>.kanban-card</code> children. Cancel a move by calling <code>preventDefault()</code> on <code>ranj:move</code>; here, “Locked” rejects drops.',
      center: false,
      html: `<div class="kanban" style="--kanban-col: 14rem">
  <section class="kanban-column" data-column="Ideas"><header class="kanban-header"><h3>Ideas</h3><span class="kanban-count"></span></header>
    <div class="kanban-list"><div class="kanban-card">Referral program</div><div class="kanban-card">Annual billing discount</div><div class="kanban-card">Slack integration</div></div></section>
  <section class="kanban-column" data-column="Shortlist"><header class="kanban-header"><h3>Shortlist</h3><span class="kanban-count"></span></header>
    <div class="kanban-list"><div class="kanban-card">Onboarding checklist</div></div></section>
  <section class="kanban-column" data-column="Locked"><header class="kanban-header"><h3>Locked 🔒</h3><span class="kanban-count"></span></header>
    <div class="kanban-list"><div class="kanban-card">SOC 2 Type II</div></div></section>
</div>`,
      js: `root.addEventListener('ranj:move', (e) => { if (e.detail.to === 'Locked' || e.detail.from === 'Locked') e.preventDefault(); });`
    }
  ],
  api: [
    { name: '.kanban', type: 'class', desc: 'Board; scrolls horizontally on small screens. Set data-kanban="false" to make it static.' },
    { name: '.kanban-column[data-column]', type: 'class', desc: 'Column. data-column is the name reported in events; data-limit sets a WIP limit for the count badge.' },
    { name: '.kanban-header / .kanban-dot / .kanban-count', type: 'class', desc: 'Column header, colored status dot (--c), live card count.' },
    { name: '.kanban-list[data-empty]', type: 'class', desc: 'Drop zone holding cards; data-empty sets the empty-state text.' },
    { name: '.kanban-card[data-id]', type: 'class', desc: 'Draggable card. Interactive children (links, buttons, inputs) do not start a drag.' },
    { name: '.kanban-card-top / -title / -meta, .kanban-id, .kanban-label, .kanban-priority[data-level], .kanban-avatar', type: 'class', desc: 'Card content helpers (Linear-style).' },
    { name: '--kanban-col / --kanban-gap / --kanban-max-h', type: 'var', default: '16rem / 1rem / none', desc: 'Column width, spacing, max column height (lists scroll).' },
    { name: 'Keyboard', type: 'attr', desc: 'Arrows move focus between cards. Space/Enter lifts, arrows move the card, Space/Enter drops, Escape cancels. Moves are announced to screen readers.' },
    { name: 'el.ranjKanban.refresh()', type: 'js', desc: 'Re-scan cards and counts (also automatic when cards are added).' },
    { name: 'ranj:move', type: 'event', desc: 'detail: { id, card, from, to, index, fromIndex }. Cancelable: preventDefault() puts the card back.' }
  ]
});
})();
