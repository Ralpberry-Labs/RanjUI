RanjDocs.add({
  id: 'time-picker',
  name: 'Time picker',
  group: 'Forms',
  description: 'An input with a popover of scrolling hour, minute and AM/PM columns. Type “930p” or “21:30” directly, limit to a window with min/max, and post a 24-hour <code>HH:MM</code> value.',
  tags: ['new', 'js'],
  keywords: ['time', 'clock', 'hour', 'minute', 'timepicker', 'schedule'],
  demos: [
    {
      title: '12-hour',
      description: 'In the popover, ↑ ↓ change the value, ← → switch columns, Enter closes.',
      height: 120,
      html: `
<div class="field" style="width:14rem;max-width:100%">
  <label class="label">Start time</label>
  <div class="time-picker" data-value="09:30" data-step="15" data-name="start"></div>
</div>`
    },
    {
      title: '24-hour with business hours',
      height: 120,
      html: `
<div class="form-grid" style="width:30rem;max-width:100%">
  <div class="field"><label class="label">Opens</label><div class="time-picker" data-format="24" data-value="08:00" data-min="06:00" data-max="12:00" data-step="30"></div></div>
  <div class="field"><label class="label">Closes</label><div class="time-picker" data-format="24" data-value="18:00" data-min="12:00" data-max="23:30" data-step="30"></div></div>
</div>`
    }
  ],
  api: [
    { name: '.time-picker', type: 'class', desc: 'Container; builds an input with a clock icon (or wraps yours).' },
    { name: 'data-value / data-min / data-max', type: 'attr', desc: '<code>HH:MM</code> (24h) or forms like <code>9:30pm</code>.' },
    { name: 'data-format', type: 'attr', default: '12', desc: '<code>12</code> or <code>24</code>.' },
    { name: 'data-step', type: 'attr', default: '5', desc: 'Minute step.' },
    { name: 'data-name', type: 'attr', desc: 'Hidden input with the 24-hour value.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value: "21:30", minutes: 1290 }</code>' }
  ]
});
