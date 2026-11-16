RanjDocs.add({
  id: 'date-picker',
  name: 'Date picker',
  group: 'Forms',
  description: 'An input with a calendar popover. Pick a single date or a range (with hover preview), jump months and years, use presets like “Last 7 days”, type a date directly, and respect min/max and disabled days. Values post as ISO dates.',
  tags: ['js'],
  keywords: ['datepicker', 'date range', 'calendar popover', 'range picker', 'presets', 'booking'],
  demos: [
    {
      title: 'Single date',
      description: 'Click the chevron (or Alt + ↓) to open; arrows move by day/week, PageUp/PageDown by month. You can also type “Dec 3 2026” or “12/03/2026”.',
      height: 140,
      html: `
<div class="field" style="width:18rem;max-width:100%">
  <label class="label">Due date</label>
  <div class="date-picker" data-name="due" data-value="+3d" data-open-on-click></div>
</div>`
    },
    {
      title: 'Range with presets',
      height: 140,
      html: `
<div class="field" style="width:20rem;max-width:100%">
  <label class="label">Reporting period</label>
  <div class="date-picker" data-mode="range" data-presets data-name="period" data-value="-6d,today" data-max="today"></div>
  <p class="field-hint" id="date-picker-out">Posts <code>period_start</code> and <code>period_end</code>.</p>
</div>`,
      js: `
root.querySelector('.date-picker').addEventListener('ranj:change', e => root.querySelector('#date-picker-out').textContent = 'Value: ' + e.detail.value.join(' → '));`
    },
    {
      title: 'Booking: future weekdays only',
      description: '<code>data-min="today"</code>, <code>data-max="+3m"</code>, <code>data-disabled="weekends"</code> and <code>data-no-gaps</code> so a stay can’t span blocked days.',
      height: 140,
      html: `
<div class="form-grid" style="width:34rem;max-width:100%">
  <div class="field"><label class="label">Appointment</label><div class="date-picker" data-min="today" data-max="+3m" data-disabled="weekends" data-presets data-format="long" data-open-on-click data-placeholder="Choose a weekday"></div></div>
  <div class="field"><label class="label">Check-in → check-out</label><div class="date-picker" data-mode="range" data-min="today" data-no-gaps data-auto-apply></div></div>
</div>`
    }
  ],
  api: [
    { name: '.date-picker', type: 'class', desc: 'Container; builds an <code>.input-wrap</code> (or wraps your input) with a calendar trigger.' },
    { name: 'data-mode', type: 'attr', default: 'single', desc: '<code>single</code> or <code>range</code>.' },
    { name: 'data-value', type: 'attr', desc: 'ISO date (<code>2026-11-16</code>), <code>today</code>, or relative (<code>+3d</code>, <code>-1w</code>, <code>+2m</code>, <code>+1y</code>). Range: two values separated by a comma.' },
    { name: 'data-min / data-max', type: 'attr', desc: 'Same formats as <code>data-value</code>.' },
    { name: 'data-disabled', type: 'attr', desc: '<code>weekends</code>, <code>past</code>, or a comma list of ISO dates. For a function use <code>Ranj.datePicker(el).setDisabled(fn)</code>.' },
    { name: 'data-presets', type: 'attr', desc: 'Show a presets sidebar (Today, Last 7 days, This month… for ranges). Custom: set <code>el.__presets = [{label, value}]</code> before mount.' },
    { name: 'data-name / data-name-start / data-name-end', type: 'attr', desc: 'Hidden ISO inputs. Range defaults to <code>name_start</code> / <code>name_end</code>.' },
    { name: 'data-months', type: 'attr', default: '1 (2 for ranges on wide screens)', desc: 'Months shown side by side.' },
    { name: 'data-format', type: 'attr', default: 'medium', desc: '<code>short</code>, <code>medium</code> or <code>long</code> display format (Intl, <code>data-locale</code>).' },
    { name: 'data-week-start', type: 'attr', default: '0', desc: '0 = Sunday, 1 = Monday.' },
    { name: 'data-open-on-click / data-auto-apply / data-no-gaps / data-close-on-select', type: 'attr', desc: 'Open when the text is clicked; apply ranges without the Apply button; reject ranges that include disabled days; keep single picker open.' },
    { name: 'Ranj.datePicker(el)', type: 'js', desc: '<code>{ value, open(), close(), setDisabled(fn) }</code>' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value: "2026-11-16", date }</code> or <code>{ value: [start, end], date: [Date, Date] }</code>' }
  ]
});
