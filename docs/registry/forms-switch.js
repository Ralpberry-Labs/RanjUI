(function () {
  var sun = '<svg class="switch-icon-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var moon = '<svg class="switch-icon-on" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';
  var x = '<svg class="switch-icon-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ok = '<svg class="switch-icon-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  RanjDocs.add({
    id: 'switch',
    name: 'Switch',
    group: 'Forms',
    description: 'An on/off toggle built on a checkbox with <code>role="switch"</code>. The thumb springs across and stretches while pressed; add icons, descriptions, colors or a loading spinner.',
    tags: ['js'],
    keywords: ['toggle switch', 'on off', 'settings', 'ios switch'],
    demos: [
      {
        title: 'Default',
        html: `
<div style="display:grid;gap:.9rem">
  <label class="switch"><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span>Airplane mode</label>
  <label class="switch"><input type="checkbox"><span class="switch-track"><span class="switch-thumb"></span></span>Bluetooth</label>
  <label class="switch"><input type="checkbox" disabled><span class="switch-track"><span class="switch-thumb"></span></span>Personal hotspot</label>
</div>`
      },
      {
        title: 'Sizes, colors and icons',
        html: `
<div style="display:flex;flex-wrap:wrap;gap:1.25rem 1.75rem;align-items:center;justify-content:center">
  <label class="switch switch-sm"><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span>Small</label>
  <label class="switch"><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span>Default</label>
  <label class="switch switch-lg"><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span>Large</label>
  <label class="switch switch-xl" aria-label="Dark mode"><input type="checkbox"><span class="switch-track"><span class="switch-thumb">${sun}${moon}</span></span></label>
  <label class="switch switch-lg switch-success" aria-label="Enabled"><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb">${x}${ok}</span></span></label>
  <label class="switch switch-lg switch-destructive"><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span>Danger</label>
</div>`
      },
      {
        title: 'Settings list with async save',
        description: 'Toggling shows a spinner via <code>Ranj.switchLoading()</code> while a fake request runs.',
        html: `
<div class="switch-list" style="width:28rem;max-width:100%">
  <label class="switch switch-row"><span class="switch-body"><span class="switch-label">Product updates</span><span class="switch-desc">New features and improvements, about once a month.</span></span><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span></label>
  <label class="switch switch-row"><span class="switch-body"><span class="switch-label">Comments on my posts</span><span class="switch-desc">Get notified when someone replies to you.</span></span><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span></label>
  <label class="switch switch-row"><span class="switch-body"><span class="switch-label">Marketing emails</span><span class="switch-desc">Tips, offers and partner news.</span></span><input type="checkbox"><span class="switch-track"><span class="switch-thumb"></span></span></label>
</div>`,
        js: `
root.querySelectorAll('.switch').forEach(sw => sw.addEventListener('ranj:change', () => {
  Ranj.switchLoading(sw, true);
  setTimeout(() => Ranj.switchLoading(sw, false), 900);
}));`
      }
    ],
    api: [
      { name: '.switch', type: 'class', desc: '<code>&lt;label class="switch"&gt;&lt;input type="checkbox"&gt;&lt;span class="switch-track"&gt;&lt;span class="switch-thumb"&gt;&lt;/span&gt;&lt;/span&gt;Label&lt;/label&gt;</code>. Track and <code>role="switch"</code> are added if missing.' },
      { name: '.switch-sm / .switch-lg / .switch-xl', type: 'class', desc: 'Sizes.' },
      { name: '.switch-success / -destructive / -warning', type: 'class', desc: 'On colors (or set <code>--on</code>).' },
      { name: '.switch-icon-on / .switch-icon-off', type: 'class', desc: 'SVGs inside the thumb that swap with a spin.' },
      { name: '.switch-row / .switch-list / .switch-reverse', type: 'class', desc: 'Settings-style rows with label left and switch right.' },
      { name: '.switch-body / .switch-label / .switch-desc', type: 'class', desc: 'Label with description.' },
      { name: 'data-loading', type: 'attr', desc: 'Spinner in the thumb, input locked.' },
      { name: 'Ranj.switchLoading(el, on)', type: 'js', desc: 'Toggle the loading state and <code>aria-busy</code>.' },
      { name: '--w / --h / --on', type: 'var', desc: 'Track width, height and on color.' },
      { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value, checked }</code>' }
    ]
  });
})();
