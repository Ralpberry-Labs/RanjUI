RanjDocs.add({
  id: 'calendar',
  name: 'Calendar',
  group: 'Forms',
  description: 'An inline month calendar with full keyboard grid navigation, a month/year switcher (click the title), today marker, min/max, disabled dates, and single, range or multiple selection. v1 <code>.calendar</code> auto-mount and <code>Ranj.calendar(el, { onSelect })</code> still work.',
  tags: ['js'],
  keywords: ['month view', 'date grid', 'inline calendar', 'range calendar', 'multi date'],
  demos: [
    {
      title: 'Default',
      description: 'Focus a day and use the arrow keys, Home/End, PageUp/PageDown (Shift for years).',
      html: `<div class="calendar" data-value="today"></div>`
    },
    {
      title: 'Range across two months',
      html: `<div class="calendar" data-mode="range" data-months="2" data-value="+2d,+9d" data-week-start="1"></div>`
    },
    {
      title: 'Multiple dates, disabled weekends',
      html: `
<div style="display:flex;flex-wrap:wrap;gap:1.25rem;align-items:flex-start;justify-content:center">
  <div class="calendar calendar-round" data-mode="multiple" data-disabled="weekends" data-min="today" data-today-button data-name="shifts"></div>
  <div class="demo-cal-side"><b>Shifts picked</b><ul id="calendar-out"><li>None yet</li></ul></div>
</div>`,
      js: `
const out = root.querySelector('#calendar-out'), f = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
root.querySelector('.calendar').addEventListener('ranj:change', e => out.innerHTML = e.detail.date.length ? e.detail.date.map(d => '<li>' + f.format(d) + '</li>').join('') : '<li>None yet</li>');`,
      css: `.demo-cal-side { min-width: 10rem; font-size: .85rem; } .demo-cal-side ul { list-style: none; padding: 0; margin: .5rem 0 0; display: grid; gap: .3rem; color: var(--muted-fg); }`
    },
    {
      title: 'v1 API',
      html: `<div class="calendar calendar-sm" data-manual id="calendar-v1"></div><p class="field-hint" id="calendar-v1-out">Pick a day</p>`,
      js: `
Ranj.calendar(root.querySelector('#calendar-v1'), {
  onSelect: d => root.querySelector('#calendar-v1-out').textContent = 'You picked ' + d.toDateString()
});`
    }
  ],
  api: [
    { name: '.calendar', type: 'class', desc: 'Auto-mounted inline calendar (skip with <code>data-manual</code>). <code>.calendar-sm</code>, <code>.calendar-lg</code>, <code>.calendar-round</code>.' },
    { name: 'data-mode', type: 'attr', default: 'single', desc: '<code>single</code>, <code>range</code> or <code>multiple</code>.' },
    { name: 'data-value / data-min / data-max', type: 'attr', desc: 'ISO, <code>today</code> or relative (<code>+7d</code>, <code>-1m</code>). Lists are comma-separated.' },
    { name: 'data-disabled', type: 'attr', desc: '<code>weekends</code>, <code>past</code> or ISO list.' },
    { name: 'data-months / data-week-start / data-locale', type: 'attr', desc: 'Months side by side, first weekday, Intl locale.' },
    { name: 'data-name', type: 'attr', desc: 'Hidden input (range: <code>name_start</code>/<code>name_end</code>).' },
    { name: 'data-today-button / data-outside="false" / data-no-views', type: 'attr', desc: 'Footer Today button; hide days from other months; disable the month/year switcher.' },
    { name: 'Ranj.calendar(el, opts)', type: 'js', desc: 'opts: <code>{ mode, value, min, max, disabled (fn | list), weekStart, months, onSelect(date, detail) }</code>. Returns <code>{ get(), set(v), goTo(date), focus(), configure(opts) }</code>.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value (ISO or ISO[]), date, complete }</code>' }
  ]
});
