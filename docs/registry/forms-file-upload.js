(function () {
  var up = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M12 12v9M8 16l4-4 4 4"/></svg>';
  var img = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg>';
  var cam = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>';
  RanjDocs.add({
    id: 'file-upload',
    name: 'File upload',
    group: 'Forms',
    description: 'A dropzone that lights up on drag-over, opens the file browser on click or Enter, lists files with image previews and sizes, validates type/size/count, and can simulate upload progress. The real <code>input.files</code> is kept in sync so forms submit natively.',
    tags: ['new', 'js'],
    keywords: ['dropzone', 'drag and drop', 'file input', 'uploader', 'attachments', 'avatar upload', 'progress'],
    demos: [
      {
        title: 'Dropzone with progress',
        description: 'Drop or browse a few files. Images get thumbnails; a 2 MB limit and image/PDF types are enforced.',
        height: 320,
        html: `
<div style="width:30rem;max-width:100%">
  <div class="dropzone" data-max-size="2MB" data-max-files="5" data-simulate>
    <input type="file" name="attachments" multiple accept="image/*,.pdf">
    <div class="dropzone-icon">${up}</div>
    <p class="dropzone-title"><span class="dropzone-link">Click to upload</span> or drag and drop</p>
    <p class="dropzone-title dropzone-over-text">Drop to upload</p>
    <p class="dropzone-hint">PNG, JPG, GIF or PDF · up to 2 MB · max 5 files</p>
  </div>
</div>`,
        js: `
// Pre-fill with sample files so the list is visible
const dz = root.querySelector('.dropzone');
const c = document.createElement('canvas'); c.width = c.height = 64;
const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 64, 64); gr.addColorStop(0, '#8b5cf6'); gr.addColorStop(1, '#ec4899'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
c.toBlob(b => {
  Ranj.fileUpload(dz).add([
    new File([b], 'hero-shot.png', { type: 'image/png' }),
    new File([new Uint8Array(840000)], 'Q4-board-deck.pdf', { type: 'application/pdf' }),
    new File([new Uint8Array(5200000)], 'raw-footage.mov', { type: 'video/quicktime' })
  ]);
});`
      },
      {
        title: 'Compact',
        html: `
<div style="width:26rem;max-width:100%">
  <div class="dropzone dropzone-sm" data-max-size="10MB">
    <input type="file" multiple>
    <div class="dropzone-icon">${up}</div>
    <div class="dropzone-text"><span class="dropzone-title">Attach files</span><span class="dropzone-hint">Drop here or click · up to 10 MB each</span></div>
  </div>
</div>`
      },
      {
        title: 'Avatar & cover image',
        description: '<code>.dropzone-image</code> previews a single image inside the zone.',
        html: `
<div style="display:flex;flex-wrap:wrap;gap:1.25rem;align-items:center;justify-content:center;width:34rem;max-width:100%">
  <div class="dropzone dropzone-image dropzone-avatar" aria-label="Upload avatar">
    <input type="file" accept="image/*" name="avatar">
    <div class="dropzone-icon">${cam}</div><span class="dropzone-hint">Avatar</span>
  </div>
  <div class="dropzone dropzone-image" style="flex:1;min-width:14rem;min-height:8rem" aria-label="Upload cover image">
    <input type="file" accept="image/*" name="cover">
    <div class="dropzone-icon">${img}</div><p class="dropzone-title">Cover image</p><p class="dropzone-hint">1600 × 900 recommended</p>
  </div>
</div>`
      }
    ],
    api: [
      { name: '.dropzone', type: 'class', desc: 'Container with an <code>&lt;input type="file"&gt;</code> (its <code>multiple</code>, <code>accept</code>, <code>name</code> are respected). Focusable; Enter/Space opens the browser.' },
      { name: '.dropzone-sm / .dropzone-image / .dropzone-avatar', type: 'class', desc: 'Row layout; single image preview inside the zone; round avatar.' },
      { name: '.dropzone-icon / -title / -hint / -link / -over-text', type: 'class', desc: 'Content parts. <code>-over-text</code> shows only while dragging.' },
      { name: 'data-max-size', type: 'attr', desc: 'Per-file limit like <code>5MB</code>, <code>500KB</code>.' },
      { name: 'data-max-files', type: 'attr', desc: 'Maximum number of files.' },
      { name: 'data-accept', type: 'attr', desc: 'Override the input’s <code>accept</code> for validation.' },
      { name: 'data-simulate', type: 'attr', desc: 'Animate fake progress bars (for demos and prototypes).' },
      { name: 'data-list', type: 'attr', desc: 'Selector of a <code>ul.file-list</code> to render into (default: one is added after the zone). <code>.file-list-grid</code> for a thumbnail grid.' },
      { name: 'Ranj.fileUpload(el)', type: 'js', desc: '<code>{ files, add(files), remove(file), clear(), progress(file, pct, status) }</code> — wire <code>progress</code> to your real upload.' },
      { name: 'Ranj.formatBytes(n)', type: 'js', desc: 'Human-readable size.' },
      { name: 'ranj:change / ranj:reject / ranj:uploaded', type: 'event', desc: '<code>{ files }</code> / <code>{ file, reason }</code> / <code>{ file }</code>' }
    ]
  });
})();
