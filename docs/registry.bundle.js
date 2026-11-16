/* docs/registry/base-_helpers.js */
/* Shared demo helpers for the Foundations / Layout / Base registry entries.
   Icons are Lucide (ISC) paths so the copied HTML is self-contained. */
(function (w) {
  var P = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    arrowUpRight: '<path d="M7 7h10v10M7 17 17 7"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
    alertCircle: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
    sparkles: '<path d="M9.94 14.06 8 20l-1.94-5.94L0 12l6.06-1.94L8 4l1.94 6.06L16 12z" transform="translate(2 -1) scale(.9)"/><path d="M20 3v4M22 5h-4"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    dollar: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
    trendUp: '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
    trendDown: '<path d="M22 17 13.5 8.5 8.5 13.5 2 7"/><path d="M16 17h6v-6"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    fileCode: '<path d="M10 12.5 8 15l2 2.5M14 12.5l2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    calendar: '<path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4M21 2l-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
    creditCard: '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
    terminal: '<path d="m4 17 6-6-6-6M12 19h8"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    git: '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>',
    edit: '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>',
    more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    mapPin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    bold: '<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',
    italic: '<path d="M19 4h-9M14 20H5M15 4 9 20"/>',
    underline: '<path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/>',
    alignLeft: '<path d="M15 12H3M17 18H3M21 6H3"/>',
    alignCenter: '<path d="M17 12H7M19 18H5M21 6H3"/>',
    alignRight: '<path d="M21 12H9M21 18H7M21 6H3"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    list: '<path d="M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13"/>',
    command: '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>',
    package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12M3.3 7l8.7 5 8.7-5"/>',
    wifiOff: '<path d="M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 4.17-2.65M10.66 5c4.01-.36 8.14.9 11.34 3.76M16.85 11.25a10 10 0 0 1 2.22 1.68M5 13a10 10 0 0 1 5.24-2.76M2 2l20 20"/>',
    externalLink: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    gauge: '<path d="m12 14 4-4M3.34 19a10 10 0 1 1 17.32 0"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>'
  };
  function ic(name, attrs) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + (attrs ? ' ' + attrs : '') + ' aria-hidden="true">' + (P[name] || '') + '</svg>';
  }

  /* Decorative scenes (fixed art) used as image placeholders: no network needed. */
  var n = 0;
  var SCENES = [
    ['#1e1b4b', '#7c3aed', '#f472b6', '#fbbf24'],   // dusk
    ['#082f49', '#0ea5e9', '#5eead4', '#f0fdfa'],   // ocean
    ['#14532d', '#22c55e', '#bef264', '#fefce8'],   // meadow
    ['#431407', '#ea580c', '#fdba74', '#fff7ed'],   // desert
    ['#0f172a', '#334155', '#94a3b8', '#e2e8f0']    // fog
  ];
  function art(i, cls) {
    var c = SCENES[(i || 0) % SCENES.length], id = 'rbart' + (++n);
    return '<svg class="' + (cls || 'card-art') + '" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Landscape illustration">' +
      '<defs><linearGradient id="' + id + 's" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".55" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient>' +
      '<radialGradient id="' + id + 'g" cx=".7" cy=".42" r=".35"><stop offset="0" stop-color="' + c[3] + '" stop-opacity=".95"/><stop offset="1" stop-color="' + c[3] + '" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="400" height="260" fill="url(#' + id + 's)"/><circle cx="280" cy="110" r="90" fill="url(#' + id + 'g)"/><circle cx="280" cy="112" r="22" fill="' + c[3] + '" opacity=".9"/>' +
      '<path d="M0 190 70 130l50 38 70-70 80 82 50-40 80 64v56H0z" fill="' + c[0] + '" opacity=".55"/>' +
      '<path d="M0 215 90 165l60 34 70-44 90 60 90-36v81H0z" fill="' + c[0] + '" opacity=".85"/></svg>';
  }
  /* Data-URI portrait (silhouette on a tinted background) for avatar demos. */
  function face(h) {
    var bg = 'hsl(' + h + ' 70% 86%)', fg = 'hsl(' + h + ' 45% 52%)', sk = 'hsl(' + ((h + 20) % 360) + ' 40% 68%)';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="' + bg + '"/><circle cx="32" cy="26" r="12" fill="' + sk + '"/><path d="M20 22c0-9 6-13 12-13s13 4 12 14c-3-5-8-6-12-6s-9 1-12 5z" fill="' + fg + '"/><path d="M8 64c2-14 12-20 24-20s22 6 24 20z" fill="' + fg + '"/></svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }
  w.RB = { ic: ic, art: art, face: face };
})(window);

;
/* docs/registry/base-avatar.js */
(function () {
  var I = RB.ic, F = RB.face;
  RanjDocs.add({
    id: 'avatar',
    name: 'Avatar',
    group: 'Base',
    description: 'Profile images with initials and icon fallbacks, six sizes, status dots, rings, square shape, and groups that collapse to "+3" or fan out on hover.',
    keywords: ['profile', 'user', 'picture', 'initials', 'avatar group', 'facepile', 'presence'],
    demos: [
      {
        title: 'Image, initials and fallback',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="avatar"><img src="${F(20)}" alt="Ana Silva"></span>
<span class="avatar avatar-tint" style="--avatar-hue:150">JK</span>
<span class="avatar avatar-gradient" style="--avatar-hue:290">MR</span>
<span class="avatar avatar-tint" style="--avatar-hue:40">TW</span>
<span class="avatar" aria-label="Unknown user">${I('user')}</span>
</div>`
      },
      {
        title: 'Sizes',
        html: `<span class="avatar avatar-xs"><img src="${F(200)}" alt=""></span>
<span class="avatar avatar-sm"><img src="${F(200)}" alt=""></span>
<span class="avatar"><img src="${F(200)}" alt=""></span>
<span class="avatar avatar-lg"><img src="${F(200)}" alt=""></span>
<span class="avatar avatar-xl"><img src="${F(200)}" alt=""></span>
<span class="avatar avatar-2xl"><img src="${F(200)}" alt="Leo Park"></span>`
      },
      {
        title: 'Status, ring and square',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="avatar avatar-lg" data-status="online"><img src="${F(10)}" alt="Online"></span>
<span class="avatar avatar-lg" data-status="away"><img src="${F(90)}" alt="Away"></span>
<span class="avatar avatar-lg avatar-tint" style="--avatar-hue:250" data-status="busy">DN</span>
<span class="avatar avatar-lg avatar-tint" style="--avatar-hue:180" data-status="offline">EO</span>
<span class="avatar avatar-lg avatar-ring"><img src="${F(330)}" alt="Ring"></span>
<span class="avatar avatar-lg avatar-ring-gradient"><img src="${F(30)}" alt="Story ring"></span>
<span class="avatar avatar-lg avatar-square avatar-gradient" style="--avatar-hue:200">AC</span>
<span class="avatar avatar-lg avatar-square" data-status="online"><img src="${F(260)}" alt="Square"></span>
</div>`
      },
      {
        title: 'Groups',
        description: 'The second group fans out on hover or focus.',
        html: `<div class="stack gap-6" style="align-items:center">
  <div class="avatar-group">
    <span class="avatar"><img src="${F(20)}" alt="Ana"></span>
    <span class="avatar"><img src="${F(140)}" alt="Jun"></span>
    <span class="avatar avatar-tint" style="--avatar-hue:290">MR</span>
    <span class="avatar"><img src="${F(220)}" alt="Leo"></span>
    <span class="avatar avatar-more" aria-label="3 more">+3</span>
  </div>
  <div class="avatar-group avatar-group-lg avatar-group-expand" tabindex="0" aria-label="7 collaborators">
    <span class="avatar"><img src="${F(0)}" alt="Ava"></span>
    <span class="avatar"><img src="${F(60)}" alt="Ben"></span>
    <span class="avatar avatar-gradient" style="--avatar-hue:250">CK</span>
    <span class="avatar"><img src="${F(180)}" alt="Dee"></span>
    <span class="avatar"><img src="${F(300)}" alt="Eli"></span>
  </div>
</div>`,
        height: 240
      },
      {
        title: 'With name',
        html: `<div class="card card-sm" style="width:min(100%,22rem)"><div class="card-content stack stack-divided gap-3">
  <div class="split"><div class="avatar-label"><span class="avatar" data-status="online"><img src="${F(20)}" alt=""></span><div><b>Ana Silva</b><span>ana@linea.design</span></div></div><span class="badge badge-soft">Owner</span></div>
  <div class="split"><div class="avatar-label"><span class="avatar avatar-tint" style="--avatar-hue:150">JK</span><div><b>Jun Kim</b><span>jun@linea.design</span></div></div><span class="badge badge-outline">Editor</span></div>
  <div class="split"><div class="avatar-label"><span class="avatar" data-status="away"><img src="${F(220)}" alt=""></span><div><b>Leo Park</b><span>leo@linea.design</span></div></div><span class="badge badge-outline">Viewer</span></div>
</div></div>`
      }
    ],
    api: [
      { name: '.avatar', type: 'class', desc: 'Circle with an <code>&lt;img&gt;</code>, initials text or an SVG icon.' },
      { name: '.avatar-xs', type: 'class', desc: '24 / 32 / (40) / 56 / 80 / 112px. Also: <code>.avatar-sm</code> <code>.avatar-lg</code> <code>.avatar-xl</code> <code>.avatar-2xl</code>' },
      { name: '.avatar-tint', type: 'class', desc: 'Initials colored by <code>--avatar-hue</code>. Also: <code>.avatar-gradient</code>' },
      { name: 'data-status', type: 'attr', desc: '<code>online</code> · <code>away</code> · <code>busy</code> · <code>offline</code> presence dot.' },
      { name: '.avatar-ring', type: 'class', desc: 'Brand ring or story-style gradient ring. Also: <code>.avatar-ring-gradient</code>' },
      { name: '.avatar-square', type: 'class', desc: 'Rounded square for teams and orgs.' },
      { name: '.avatar-group / .avatar-more', type: 'class', desc: 'Overlapping stack and the "+N" overflow chip. Sizes: <code>.avatar-group-sm</code>, <code>-lg</code>.' },
      { name: '.avatar-group-expand', type: 'class', desc: 'Fans the stack out on hover/focus.' },
      { name: '.avatar-label', type: 'class', desc: 'Avatar + name + secondary line.' },
      { name: '--avatar-size', type: 'var', desc: 'Size, initials hue, and group overlap. Also: <code>--avatar-hue</code> <code>--avatar-overlap</code>' }
    ]
  });
})();

;
/* docs/registry/base-badge.js */
(function () {
  var I = RB.ic;
  var tones = [['', 'Primary'], ['badge-secondary', 'Neutral'], ['badge-success', 'Paid'], ['badge-warning', 'Pending'], ['badge-destructive', 'Overdue'], ['badge-info', 'Draft']];
  function row(extra) { return tones.map(function (t) { return '<span class="badge ' + t[0] + (extra ? ' ' + extra : '') + '">' + t[1] + '</span>'; }).join('\n'); }
  RanjDocs.add({
    id: 'badge',
    name: 'Badge',
    group: 'Base',
    description: 'Small status labels in solid, soft, outline and dot styles across six tones, plus live pulse, counts and removable badges.',
    keywords: ['label', 'status', 'pill', 'tag', 'count', 'notification', 'indicator'],
    demos: [
      {
        title: 'Tones and styles',
        description: 'Solid, <code>.badge-soft</code> and <code>.badge-outline</code> across every tone.',
        html: '<div class="demo-badge-matrix">\n  <span>Solid</span><div class="cluster">' + row('') + '</div>\n  <span>Soft</span><div class="cluster">' + row('badge-soft') + '</div>\n  <span>Outline</span><div class="cluster">' + row('badge-outline') + '</div>\n</div>',
        css: '.demo-badge-matrix { display: grid; grid-template-columns: 4.5rem auto; gap: 1rem 1.25rem; align-items: center; }\n.demo-badge-matrix > span { font-size: .75rem; color: var(--muted-fg); font-weight: 500; }\n@media (max-width: 480px) { .demo-badge-matrix { grid-template-columns: 1fr; gap: .4rem; } }'
      },
      {
        title: 'Dot, pulse and icons',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="badge badge-dot badge-success">Operational</span>
<span class="badge badge-dot badge-warning">Degraded</span>
<span class="badge badge-dot badge-destructive">Outage</span>
<span class="badge badge-soft badge-success badge-pulse">Live</span>
<span class="badge badge-soft badge-destructive badge-pulse">Recording</span>
<span class="badge badge-soft badge-info">${I('clock')} 2h left</span>
<span class="badge badge-soft">${I('sparkles')} AI</span>
<span class="badge badge-gradient">${I('zap')} Pro</span>
<span class="badge badge-contrast badge-square">v2.4.0</span>
</div>`
      },
      {
        title: 'Counts and indicators',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="badge-anchor"><button class="btn btn-outline btn-icon" aria-label="Notifications, 3 unread">${I('bell')}</button><span class="badge badge-destructive badge-count">3</span></span>
<span class="badge-anchor"><button class="btn btn-outline btn-icon" aria-label="Inbox, 128 unread">${I('inbox')}</button><span class="badge badge-count">99+</span></span>
<span class="badge-anchor"><span class="avatar avatar-tint" style="--avatar-hue:200">LP</span><span class="badge-indicator" style="background:var(--success)"></span></span>
<button class="btn btn-ghost">Messages <span class="badge badge-secondary badge-count">12</span></button>
</div>`
      },
      {
        title: 'Removable and sizes',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="badge badge-soft badge-lg">react <button class="badge-remove" aria-label="Remove react">${I('x')}</button></span>
<span class="badge badge-soft badge-lg">typescript <button class="badge-remove" aria-label="Remove typescript">${I('x')}</button></span>
<span class="badge badge-outline badge-lg">design <button class="badge-remove" aria-label="Remove design">${I('x')}</button></span>
<span class="badge badge-sm">Small</span><span class="badge">Default</span><span class="badge badge-lg">Large</span>
</div>`
      }
    ],
    api: [
      { name: '.badge', type: 'class', desc: 'Solid primary badge.' },
      { name: '.badge-secondary', type: 'class', desc: 'Tones (<code>.badge-neutral</code>, <code>.badge-danger</code> are aliases). Also: <code>.badge-success</code> <code>.badge-warning</code> <code>.badge-destructive</code> <code>.badge-info</code> <code>.badge-contrast</code>' },
      { name: '.badge-soft', type: 'class', desc: 'Styles; combine with any tone. Also: <code>.badge-outline</code> <code>.badge-dot</code> <code>.badge-ghost</code> <code>.badge-gradient</code>' },
      { name: '.badge-pulse', type: 'class', desc: 'Pulsing live dot.' },
      { name: '.badge-count + .badge-anchor', type: 'class', desc: 'Numeric counter pinned to the corner of its anchor.' },
      { name: '.badge-indicator', type: 'class', desc: 'Bare dot indicator for an anchor.' },
      { name: '.badge-remove', type: 'class', desc: 'Close button; removed by ranj.js with an exit animation (fires cancelable <code>ranj:remove</code>).' },
      { name: '.badge-sm', type: 'class', desc: 'Sizes and shape. Also: <code>.badge-lg</code> <code>.badge-square</code>' }
    ]
  });
})();

;
/* docs/registry/base-banner.js */
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

;
/* docs/registry/base-blockquote.js */
(function () {
  var I = RB.ic, F = RB.face;
  var stars = '<span class="quote-stars" aria-label="5 out of 5 stars">' + [1, 2, 3, 4, 5].map(function () { return I('star'); }).join('') + '</span>';
  RanjDocs.add({
    id: 'blockquote',
    name: 'Blockquote',
    group: 'Base',
    description: 'Pull quotes and testimonial cards, from a simple bordered quote to a featured customer story.',
    tags: ['new'],
    keywords: ['quote', 'testimonial', 'review', 'pull quote', 'citation'],
    demos: [
      {
        title: 'Blockquote',
        center: false,
        html: `<blockquote class="blockquote" style="max-width:36rem;margin:0 auto">
  <p>Simplicity is about subtracting the obvious and adding the meaningful.</p>
  <cite>John Maeda, The Laws of Simplicity</cite>
</blockquote>`
      },
      {
        title: 'Pull quote',
        html: `<figure class="stack gap-4" style="max-width:40rem;align-items:center;text-align:center">
  <blockquote class="blockquote-lg">We replaced three internal UI kits with Ranj UI and shipped our redesign <span class="gradient-text">six weeks early</span>.</blockquote>
  <figcaption class="avatar-label"><img class="avatar" src="${F(30)}" alt=""><div style="text-align:left"><b>Priya Raman</b><span>VP Design, Northwind</span></div></figcaption>
</figure>`,
        height: 300
      },
      {
        title: 'Testimonial cards',
        center: false,
        html: `<div class="grid grid-auto" style="--min:240px;align-items:stretch">
  <figure class="quote-card">
    ${stars}
    <blockquote>The dark mode is the best I've seen in any library. We didn't change a single color.</blockquote>
    <figcaption><img class="avatar" src="${F(200)}" alt=""><div><b>Marcus Chen</b><span>Founder, Tally</span></div></figcaption>
  </figure>
  <figure class="quote-card quote-card-featured">
    <blockquote>Setup took <mark>eleven minutes</mark>. Our designers finally stopped filing "button looks off" tickets.</blockquote>
    <figcaption><span class="avatar avatar-gradient" style="--avatar-hue:330">SO</span><div><b>Sofia Ortega</b><span>Design lead, Fieldnote</span></div></figcaption>
  </figure>
  <figure class="quote-card">
    ${stars}
    <blockquote>Zero dependencies meant our security review took an afternoon instead of a sprint.</blockquote>
    <figcaption><img class="avatar" src="${F(100)}" alt=""><div><b>Daniel Okafor</b><span>CTO, Ledgerly</span></div></figcaption>
  </figure>
</div>`
      }
    ],
    api: [
      { name: '.blockquote', type: 'class', desc: 'Quote with a brand rule. <code>cite</code> or <code>footer</code> for attribution.' },
      { name: '.blockquote-lg', type: 'class', desc: 'Large display pull quote with an opening mark.' },
      { name: '.blockquote-plain', type: 'class', desc: 'Italic, no rule.' },
      { name: '.quote-card', type: 'class', desc: 'Testimonial card; featured adds a brand tint and larger type. Also: <code>.quote-card-featured</code>' },
      { name: '.quote-stars', type: 'class', desc: 'Star rating row (filled SVGs).' }
    ]
  });
})();

;
/* docs/registry/base-button-group.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'button-group',
    name: 'Button group',
    group: 'Base',
    description: 'Attach related buttons into one control: toolbars, segmented toggles, vertical stacks and split buttons.',
    tags: ['js'],
    keywords: ['segmented', 'toolbar', 'split button', 'toggle group', 'btn-group'],
    demos: [
      {
        title: 'Attached',
        html: `<div class="btn-group" role="group" aria-label="Pagination">
  <button class="btn btn-outline">${I('chevronRight', 'style="transform:scaleX(-1)"')} Prev</button>
  <button class="btn btn-outline">1</button><button class="btn btn-outline">2</button><button class="btn btn-outline">3</button>
  <button class="btn btn-outline">Next ${I('chevronRight')}</button>
</div>
<div class="btn-group" role="group" aria-label="Actions">
  <button class="btn">Save</button><button class="btn">Publish</button>
</div>`
      },
      {
        title: 'Toggle (single and multiple)',
        description: 'Add <code>data-toggle="single"</code> or <code>"multiple"</code>; buttons get <code>aria-pressed</code> and arrow-key navigation.',
        html: `<div class="btn-group" data-toggle="multiple" aria-label="Text style">
  <button class="btn btn-outline btn-icon" aria-label="Bold" aria-pressed="true">${I('bold')}</button>
  <button class="btn btn-outline btn-icon" aria-label="Italic">${I('italic')}</button>
  <button class="btn btn-outline btn-icon" aria-label="Underline">${I('underline')}</button>
</div>
<div class="btn-group" data-toggle="single" aria-label="Alignment">
  <button class="btn btn-outline btn-icon" aria-label="Left" aria-pressed="true">${I('alignLeft')}</button>
  <button class="btn btn-outline btn-icon" aria-label="Center">${I('alignCenter')}</button>
  <button class="btn btn-outline btn-icon" aria-label="Right">${I('alignRight')}</button>
</div>
<div class="btn-group btn-group-pill" data-toggle="single" aria-label="Billing period">
  <button class="btn btn-sm" aria-pressed="true">Monthly</button>
  <button class="btn btn-sm">Yearly <span class="badge badge-soft badge-success badge-sm">−20%</span></button>
</div>`
      },
      {
        title: 'Split button',
        html: `<div class="btn-group btn-split">
  <button class="btn">${I('git')} Merge pull request</button>
  <button class="btn" aria-label="More merge options" aria-haspopup="menu">${I('chevronDown')}</button>
</div>
<div class="btn-group btn-split">
  <button class="btn btn-outline">${I('download')} Export CSV</button>
  <button class="btn btn-outline" aria-label="More export formats">${I('chevronDown')}</button>
</div>`
      },
      {
        title: 'Vertical',
        html: `<div class="btn-group btn-group-vertical" data-toggle="single" style="width:12rem" aria-label="View">
  <button class="btn btn-outline" aria-pressed="true">${I('grid')} Board</button>
  <button class="btn btn-outline">${I('list')} List</button>
  <button class="btn btn-outline">${I('calendar')} Calendar</button>
</div>`
      }
    ],
    api: [
      { name: '.btn-group', type: 'class', desc: 'Attaches child <code>.btn</code>s.' },
      { name: '.btn-group-vertical', type: 'class', desc: 'Stack vertically.' },
      { name: '.btn-split', type: 'class', desc: 'Main action + narrow caret button.' },
      { name: '.btn-group-pill', type: 'class', desc: 'Segmented control on a muted track.' },
      { name: '.btn-toolbar', type: 'class', desc: 'Wrapping row of groups.' },
      { name: 'data-toggle', type: 'attr', desc: '<code>single</code> or <code>multiple</code>: manages <code>aria-pressed</code>.' },
      { name: 'ranj:change', type: 'event', desc: 'On toggle groups. detail: <code>{ value: [ ... ] }</code> (button <code>data-value</code> or text).' }
    ]
  });
})();

;
/* docs/registry/base-button.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'button',
    name: 'Button',
    group: 'Base',
    description: 'Thirteen variants from quiet ghost to glossy 3D, five sizes, icon-only and pill shapes, loading state, and keyboard hints. All v1 classes still work.',
    tags: ['js'],
    keywords: ['btn', 'cta', 'action', 'submit', 'gradient button', 'shine', 'glow', '3d', 'pushable', 'loading'],
    demos: [
      {
        title: 'Variants',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-link">Link</button>
<button class="btn btn-soft">Soft</button>
<button class="btn btn-destructive">Delete</button>
<button class="btn btn-success">${I('check')} Approve</button>
<button class="btn btn-contrast">Contrast</button>
</div>`
      },
      {
        title: 'Expressive',
        description: 'Gradient, shine sweep (hover), continuous shimmer, glow, glass and 3D pushable.',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn btn-gradient btn-lg">${I('sparkles')} Generate</button>
<button class="btn btn-shine btn-lg">Hover to shine</button>
<button class="btn btn-shimmer btn-contrast btn-lg btn-pill">Get early access ${I('arrowRight')}</button>
<button class="btn btn-glow btn-lg">${I('zap')} Upgrade to Pro</button>
<button class="btn btn-3d btn-lg">Press me</button>
<button class="btn btn-3d btn-success btn-lg">Claim reward</button>
</div>`,
        height: 200
      },
      {
        title: 'Glass',
        center: false,
        bg: 'none',
        pad: false,
        height: 220,
        html: `<div class="demo-button-glass">
  ${RB.art(0, 'demo-button-art')}
  <div class="cluster" style="position:relative;justify-content:center">
    <button class="btn btn-glass btn-lg">${I('play')} Watch trailer</button>
    <button class="btn btn-glass btn-lg btn-icon btn-pill" aria-label="Like">${I('heart')}</button>
  </div>
</div>`,
        css: '.demo-button-glass { position: relative; width: 100%; display: grid; place-items: center; min-height: 220px; overflow: hidden; }\n.demo-button-art { position: absolute; inset: 0; width: 100%; height: 100%; }\n.demo-button-glass .btn-glass { --btn-fg: #fff; --btn-bg: rgb(255 255 255 / .14); --btn-bg-hover: rgb(255 255 255 / .24); --btn-border: rgb(255 255 255 / .3); }'
      },
      {
        title: 'Sizes',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn btn-xs">Extra small</button>
<button class="btn btn-sm">Small</button>
<button class="btn">Medium</button>
<button class="btn btn-lg">Large</button>
<button class="btn btn-xl">Extra large</button>
</div>`
      },
      {
        title: 'Icons, pills and keyboard hints',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn btn-outline btn-icon" aria-label="Search">${I('search')}</button>
<button class="btn btn-secondary btn-icon btn-pill" aria-label="Notifications">${I('bell')}</button>
<button class="btn btn-icon btn-sm" aria-label="Add">${I('plus')}</button>
<button class="btn btn-pill">${I('download')} Download</button>
<button class="btn btn-outline">${I('search')} Search docs <kbd class="kbd">⌘K</kbd></button>
<button class="btn">Save changes <kbd class="kbd">⌘S</kbd></button>
</div>`
      },
      {
        title: 'Loading, disabled and full width',
        description: 'Click to load. Use <code>data-loading="true"</code> or <code>Ranj.button.loading(el, true)</code>; add <code>.btn-loading-inline</code> to keep the label visible.',
        html: `<div class="stack gap-3" style="width:min(100%,20rem)">
  <button class="btn btn-block demo-button-load">${I('send')} Send invoice</button>
  <button class="btn btn-outline btn-block btn-loading-inline" data-loading="true">Saving draft</button>
  <button class="btn btn-secondary btn-block" disabled>Disabled</button>
</div>`,
        js: "root.querySelector('.demo-button-load').addEventListener('click', function (e) {\n  var b = e.currentTarget; Ranj.button.loading(b, true);\n  setTimeout(function () { Ranj.button.loading(b, false); }, 1600);\n});"
      }
    ],
    api: [
      { name: '.btn', type: 'class', desc: 'Base button (primary). Works on <code>button</code> and <code>a</code>.' },
      { name: '.btn-secondary', type: 'class', desc: 'Variants. <code>.btn-soft</code> combines with a tone: <code>.btn-soft.btn-destructive</code>. Also: <code>.btn-outline</code> <code>.btn-ghost</code> <code>.btn-link</code> <code>.btn-soft</code> <code>.btn-destructive</code> <code>.btn-success</code> <code>.btn-warning</code> <code>.btn-contrast</code>' },
      { name: '.btn-gradient', type: 'class', desc: 'Expressive styles. Combine freely with variants and sizes. Also: <code>.btn-shine</code> <code>.btn-shimmer</code> <code>.btn-glow</code> <code>.btn-glass</code> <code>.btn-3d</code>' },
      { name: '.btn-xs / -sm / -lg / -xl', type: 'class', desc: 'Sizes (follow the density tokens <code>--control-h*</code>).' },
      { name: '.btn-icon', type: 'class', desc: 'Square icon-only, fully rounded, full width. Also: <code>.btn-pill</code> <code>.btn-block</code>' },
      { name: 'data-loading="true"', type: 'attr', desc: 'Shows a spinner, hides the label and blocks clicks. <code>.btn-loading</code> works too.' },
      { name: '.btn-loading-inline', type: 'class', desc: 'Keep the label visible next to the spinner.' },
      { name: '--btn-bg', type: 'var', desc: 'Per-button overrides for custom variants. Also: <code>--btn-fg</code> <code>--btn-bg-hover</code> <code>--btn-border</code> <code>--btn-h</code> <code>--btn-px</code> <code>--btn-radius</code>' },
      { name: '--btn-depth', type: 'var', default: '4px', desc: 'Depth of <code>.btn-3d</code>.' },
      { name: 'Ranj.button.loading(el, on)', type: 'js', desc: 'Toggle the loading state (also sets <code>disabled</code> and <code>aria-busy</code>).' }
    ]
  });
})();

;
/* docs/registry/base-callout.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'callout',
    name: 'Callout',
    group: 'Base',
    description: 'Inline notices that sit in the page flow: info, success, warning, danger, note and tip, each with an icon, optional actions and dismiss.',
    tags: ['new'],
    keywords: ['alert', 'notice', 'admonition', 'message', 'note', 'tip', 'warning box'],
    demos: [
      {
        title: 'Tones',
        center: false,
        html: `<div class="stack gap-3" style="max-width:40rem;margin:0 auto">
  <div class="callout callout-info" role="note">${I('info', 'class="callout-icon"')}<div class="callout-title">Heads up</div><div class="callout-body">API v1 will be retired on March 31, 2027. <a href="#">Read the migration guide</a>.</div></div>
  <div class="callout callout-success" role="status">${I('checkCircle', 'class="callout-icon"')}<div class="callout-title">Domain verified</div><div class="callout-body">acme.com is now serving traffic over HTTPS.</div></div>
  <div class="callout callout-warning" role="note">${I('alert', 'class="callout-icon"')}<div class="callout-title">You're at 86% of your build minutes</div><div class="callout-body">Builds will queue once you reach 6,000 minutes this month.</div></div>
  <div class="callout callout-danger" role="alert">${I('alertCircle', 'class="callout-icon"')}<div class="callout-title">Payment failed</div><div class="callout-body">We couldn't charge the card ending in 4242. Update it to avoid interruption.</div></div>
</div>`
      },
      {
        title: 'With actions and dismiss',
        center: false,
        html: `<div class="callout callout-outline" style="max-width:40rem;margin:0 auto">
  ${I('sparkles', 'class="callout-icon" style="color:var(--primary)"')}
  <div class="callout-title">Try the new AI review</div>
  <div class="callout-body">Get line-by-line suggestions on every pull request. Free during the beta.</div>
  <div class="callout-actions"><button class="btn btn-sm">Enable</button><button class="btn btn-sm btn-ghost">Learn more</button></div>
  <button class="callout-close" aria-label="Dismiss">${I('x')}</button>
</div>`
      },
      {
        title: 'Docs style',
        description: '<code>.callout-bar</code> for documentation; <code>.callout-note</code> for neutral asides.',
        center: false,
        html: `<div class="stack gap-3" style="max-width:40rem;margin:0 auto">
  <div class="callout callout-bar">${I('lightbulb', 'class="callout-icon"')}<div class="callout-title">Tip</div><div class="callout-body">Set <code>--hue</code> once on <code>:root</code> to re-brand every component.</div></div>
  <div class="callout callout-note callout-bar">${I('info', 'class="callout-icon"')}<div class="callout-body">This page documents version 2. For v1, see the legacy docs.</div></div>
  <div class="callout callout-danger callout-bar">${I('alert', 'class="callout-icon"')}<div class="callout-title">Breaking change</div><div class="callout-body"><code>.alert</code> is now <code>.callout</code> for inline notices.</div></div>
</div>`
      },
      {
        title: 'Solid',
        center: false,
        html: `<div class="stack gap-3" style="max-width:40rem;margin:0 auto">
  <div class="callout callout-solid callout-info">${I('info', 'class="callout-icon"')}<div class="callout-body">Scheduled maintenance Sunday 02:00–03:00 UTC.</div></div>
  <div class="callout callout-solid callout-warning">${I('alert', 'class="callout-icon"')}<div class="callout-body">Your trial ends in 3 days. Add a payment method to keep your projects.</div></div>
</div>`
      }
    ],
    api: [
      { name: '.callout', type: 'class', desc: 'Grid with an icon (<code>.callout-icon</code> or first <code>svg</code>), <code>.callout-title</code> and <code>.callout-body</code>.' },
      { name: '.callout-info', type: 'class', desc: 'Tones (default is brand). Also: <code>.callout-success</code> <code>.callout-warning</code> <code>.callout-danger</code> <code>.callout-note</code>' },
      { name: '.callout-bar', type: 'class', desc: 'Left accent bar, neutral card, or filled. Also: <code>.callout-outline</code> <code>.callout-solid</code>' },
      { name: '.callout-actions', type: 'class', desc: 'Button row under the text.' },
      { name: '.callout-close', type: 'class', desc: 'Dismiss button; hides the callout (ranj.js).' },
      { name: 'data-dismiss-key', type: 'attr', desc: 'Remember the dismissal in localStorage under this key.' },
      { name: 'ranj:dismiss', type: 'event', desc: 'Cancelable, fired before hiding.' }
    ]
  });
})();

;
/* docs/registry/base-card.js */
(function () {
  var I = RB.ic;
  var check = I('check');
  RanjDocs.add({
    id: 'card',
    name: 'Card',
    group: 'Base',
    description: 'A surface for grouped content, with header/content/footer slots and ready-made variants: interactive, glass, animated gradient border, image, pricing, profile and stat.',
    keywords: ['panel', 'tile', 'surface', 'pricing card', 'profile card', 'stat card', 'kpi', 'glass card'],
    demos: [
      {
        title: 'Default',
        html: `<div class="card" style="width:min(100%,24rem)">
  <div class="card-header">
    <div class="card-title">Create project</div>
    <div class="card-description">Deploy your new project in one click.</div>
  </div>
  <div class="card-content stack gap-3">
    <div class="stack gap-1"><label class="label" for="card-name">Name</label><input id="card-name" class="input" placeholder="acme-dashboard"></div>
    <div class="stack gap-1"><span class="label">Framework</span><div class="cluster"><button type="button" class="chip chip-sm" aria-pressed="true">Next.js</button><button type="button" class="chip chip-sm" aria-pressed="false">Astro</button><button type="button" class="chip chip-sm" aria-pressed="false">Vanilla</button></div></div>
  </div>
  <div class="card-footer" style="justify-content:space-between"><button class="btn btn-outline">Cancel</button><button class="btn">Deploy</button></div>
</div>`,
        height: 360
      },
      {
        title: 'Interactive and image cards',
        description: '<code>.card-interactive</code> lifts on hover; images zoom gently.',
        center: false,
        html: `<div class="grid grid-auto" style="--min:220px;--gap:1.25rem">
  <a class="card card-interactive" href="#">
    <div class="card-image">${RB.art(0)}</div>
    <div class="card-content stack gap-2"><span class="badge badge-soft badge-sm" style="align-self:start">Guide</span><div class="card-title">Designing calm dashboards</div><p class="card-description">How to cut chart noise by half without losing signal.</p></div>
    <div class="card-footer small muted">${I('clock', 'class="size-4"')} 8 min read</div>
  </a>
  <a class="card card-interactive" href="#">
    <div class="card-image">${RB.art(1)}</div>
    <div class="card-content stack gap-2"><span class="badge badge-soft badge-info badge-sm" style="align-self:start">Changelog</span><div class="card-title">Edge functions are GA</div><p class="card-description">Run code in 38 regions with 9 ms cold starts.</p></div>
    <div class="card-footer small muted">${I('calendar', 'class="size-4"')} Nov 12, 2026</div>
  </a>
  <div class="card card-cover card-interactive">
    ${RB.art(3)}
    <div class="card-overlay stack gap-1"><span class="small" style="opacity:.8">Case study</span><div class="h4">How Lumen cut infra costs 41%</div></div>
  </div>
</div>`
      },
      {
        title: 'Pricing',
        center: false,
        html: `<div class="grid grid-auto" style="--min:230px;--gap:1.25rem;align-items:start;padding-top:.75rem">
  <div class="card card-pricing">
    <div class="card-content">
      <div class="card-title">Hobby</div><p class="card-description">For side projects.</p>
      <div class="price"><span class="price-amount">$0</span><span class="price-period">/ month</span></div>
      <ul class="card-features"><li>${check} 1 project</li><li>${check} 10k requests / day</li><li>${check} Community support</li><li data-off>${I('x')} Custom domains</li></ul>
      <button class="btn btn-outline btn-block">Start free</button>
    </div>
  </div>
  <div class="card card-pricing card-gradient">
    <span class="card-ribbon">Most popular</span>
    <div class="card-content">
      <div class="card-title">Pro</div><p class="card-description">For growing teams.</p>
      <div class="price"><span class="price-amount">$24</span><span class="price-period">/ user / month</span></div>
      <ul class="card-features"><li>${check} Unlimited projects</li><li>${check} 1M requests / day</li><li>${check} Custom domains + SSL</li><li>${check} Priority support</li></ul>
      <button class="btn btn-block btn-shine">Upgrade to Pro</button>
    </div>
  </div>
  <div class="card card-pricing">
    <div class="card-content">
      <div class="card-title">Enterprise</div><p class="card-description">Security and scale.</p>
      <div class="price"><span class="price-amount" style="font-size:2.1rem">Custom</span></div>
      <ul class="card-features"><li>${check} SSO & SCIM</li><li>${check} 99.99% uptime SLA</li><li>${check} Audit logs</li><li>${check} Dedicated engineer</li></ul>
      <button class="btn btn-secondary btn-block">Contact sales</button>
    </div>
  </div>
</div>`
      },
      {
        title: 'Stat cards',
        center: false,
        html: `<div class="grid grid-auto" style="--min:200px">
  <div class="card card-stat"><div class="stat-label">Revenue ${I('dollar')}</div><div class="stat-value">$48,294</div><div class="stat-meta"><span class="stat-trend up">${I('trendUp')} 12.4%</span> vs last month</div>
    <svg class="stat-spark" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M0 24 12 20 24 22 36 14 48 16 60 9 72 12 84 5 100 3" vector-effect="non-scaling-stroke"/></svg></div>
  <div class="card card-stat"><div class="stat-label">Active users ${I('users')}</div><div class="stat-value">2,841</div><div class="stat-meta"><span class="stat-trend up">${I('trendUp')} 4.1%</span> vs last week</div>
    <svg class="stat-spark" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M0 18 12 20 24 14 36 17 48 12 60 15 72 9 84 11 100 6" vector-effect="non-scaling-stroke"/></svg></div>
  <div class="card card-stat"><div class="stat-label">Churn ${I('activity')}</div><div class="stat-value">1.8%</div><div class="stat-meta"><span class="stat-trend down">${I('trendDown')} 0.3%</span> vs last month</div>
    <svg class="stat-spark" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none" stroke="var(--destructive)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M0 8 12 10 24 9 36 14 48 12 60 18 72 16 84 21 100 24" vector-effect="non-scaling-stroke"/></svg></div>
</div>`
      },
      {
        title: 'Profile and glass',
        center: false,
        bg: 'none',
        pad: false,
        height: 420,
        html: `<div class="demo-card-scene">
  ${RB.art(0, 'demo-card-bg')}
  <div class="card card-profile" style="width:16rem">
    <div class="card-banner"></div>
    <img class="avatar avatar-xl" src="${RB.face(20)}" alt="Ana Silva">
    <div class="card-content stack gap-1" style="padding-top:.75rem">
      <div class="card-title">Ana Silva</div>
      <p class="card-description">Staff designer at Linea · Lisbon</p>
      <div class="cluster" style="justify-content:center;margin-top:.75rem"><button class="btn btn-sm">Follow</button><button class="btn btn-sm btn-outline">Message</button></div>
    </div>
    <div class="card-stats"><div><b>184</b><span>Posts</span></div><div><b>12.4k</b><span>Followers</span></div><div><b>312</b><span>Following</span></div></div>
  </div>
  <div class="card card-glass" style="width:16rem">
    <div class="card-header"><div class="card-title">Now playing</div><div class="card-description">Discover Weekly</div></div>
    <div class="card-content stack gap-3">
      <div class="avatar-label"><span class="avatar avatar-lg avatar-square avatar-gradient" style="--avatar-hue:330">${I('play')}</span><div><b>Midnight City</b><span>M83 · Hurry Up, We're Dreaming</span></div></div>
      <div class="progress progress-sm" style="--value:42"><div class="progress-fill"></div></div>
      <div class="split small muted" style="font-weight:400"><span>1:48</span><span>4:03</span></div>
    </div>
  </div>
</div>`,
        css: `.demo-card-scene { position: relative; width: 100%; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1.5rem; padding: 2rem 1rem; min-height: 420px; overflow: hidden; }
.demo-card-bg { position: absolute; inset: 0; width: 100%; height: 100%; }
.demo-card-scene > .card { position: relative; }`
      }
    ],
    api: [
      { name: '.card', type: 'class', desc: 'Surface with border, radius and a hairline shadow.' },
      { name: '.card-header', type: 'class', desc: 'Slots (v1 compatible). <code>.card-header-row</code> puts an action on the right; <code>.card-footer-bordered</code> adds a tinted footer bar. Also: <code>.card-title</code> <code>.card-description</code> <code>.card-content</code> <code>.card-footer</code>' },
      { name: '.card-interactive', type: 'class', desc: 'Lift + deeper shadow on hover. Also: <code>.card-hover</code>' },
      { name: '.card-glass', type: 'class', desc: 'Frosted translucent surface.' },
      { name: '.card-gradient', type: 'class', desc: 'Animated conic gradient border; <code>.card-gradient-static</code> to stop it.' },
      { name: '.card-image', type: 'class', desc: 'Top media, full-bleed background media, and a legible text overlay. Also: <code>.card-cover</code> <code>.card-overlay</code>' },
      { name: '.card-pricing', type: 'class', desc: 'Pricing parts. <code>li[data-off]</code> marks a missing feature. Also: <code>.price</code> <code>.card-features</code> <code>.card-ribbon</code>' },
      { name: '.card-profile', type: 'class', desc: 'Profile layout. Also: <code>.card-banner</code> <code>.card-stats</code>' },
      { name: '.card-stat', type: 'class', desc: 'KPI tile. Also: <code>.stat-label</code> <code>.stat-value</code> <code>.stat-meta</code> <code>.stat-trend.up|down</code> <code>.stat-spark</code>' },
      { name: '.card-sm', type: 'class', desc: 'Padding, elevation, highlight and horizontal layout. Also: <code>.card-lg</code> <code>.card-flat</code> <code>.card-elevated</code> <code>.card-featured</code> <code>.card-row</code>' },
      { name: '--card-pad / --card-radius', type: 'var', default: '1.5rem / --radius-xl', desc: 'Spacing and corner radius.' }
    ]
  });
})();

;
/* docs/registry/base-chip.js */
(function () {
  var I = RB.ic;
  var X = I('x');
  function rm(t) { return '<span class="chip" data-value="' + t + '">' + t + '<button type="button" class="chip-remove" aria-label="Remove ' + t + '">' + X + '</button></span>'; }
  RanjDocs.add({
    id: 'chip',
    name: 'Chip',
    group: 'Base',
    description: 'Compact, interactive pills for filters, selections and tags. Toggle with <code>aria-pressed</code>, remove with a close button, or type new ones into a chip input.',
    tags: ['new', 'js'],
    keywords: ['tag', 'filter', 'pill', 'token', 'tag input', 'choice chip'],
    demos: [
      {
        title: 'Filter chips',
        description: 'Click to toggle. Listens for <code>ranj:change</code> on the group.',
        html: `<div class="stack gap-3" style="align-items:center">
  <div class="chip-group" aria-label="Filter by category">
    <button type="button" class="chip" aria-pressed="true">${I('check', 'class="chip-check"')} Design <span class="chip-count">24</span></button>
    <button type="button" class="chip" aria-pressed="false">${I('check', 'class="chip-check"')} Engineering <span class="chip-count">58</span></button>
    <button type="button" class="chip" aria-pressed="true">${I('check', 'class="chip-check"')} Product <span class="chip-count">17</span></button>
    <button type="button" class="chip" aria-pressed="false">${I('check', 'class="chip-check"')} Marketing <span class="chip-count">9</span></button>
  </div>
  <p class="small muted demo-chip-out" style="font-weight:400">Showing: Design, Product</p>
</div>`,
        js: "var out = root.querySelector('.demo-chip-out');\nroot.querySelector('.chip-group').addEventListener('ranj:change', function (e) {\n  out.textContent = 'Showing: ' + (e.detail.values.map(function (v) { return v.replace(/\\s*\\d+$/, ''); }).join(', ') || 'everything');\n});"
      },
      {
        title: 'Single choice',
        html: `<div class="chip-group" data-single data-required aria-label="Size">
  <button type="button" class="chip chip-lg" aria-pressed="false">XS</button>
  <button type="button" class="chip chip-lg" aria-pressed="true">S</button>
  <button type="button" class="chip chip-lg" aria-pressed="false">M</button>
  <button type="button" class="chip chip-lg" aria-pressed="false">L</button>
  <button type="button" class="chip chip-lg" aria-pressed="false" disabled style="opacity:.45;text-decoration:line-through">XL</button>
</div>`
      },
      {
        title: 'Removable',
        html: `<div class="chip-group">
  ${rm('Lisbon')}
  ${rm('Berlin')}
  ${rm('Tokyo')}
  <span class="chip" data-value="Ana Silva"><img class="avatar" src="${RB.face(20)}" alt="">Ana Silva<button type="button" class="chip-remove" aria-label="Remove Ana Silva">${X}</button></span>
</div>`
      },
      {
        title: 'Chip input',
        description: 'Type and press Enter or comma. Backspace on an empty field removes the last chip.',
        html: `<div class="chip-input" style="width:min(100%,26rem)">
  ${rm('frontend')}
  ${rm('a11y')}
  <input type="text" placeholder="Add a topic…" aria-label="Add a topic">
</div>`
      },
      {
        title: 'Tags',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="tag">v2.4.0</span><span class="tag">MIT</span><span class="tag tag-soft">${I('tag')} design-system</span><span class="tag tag-soft">css</span><span class="chip chip-sm chip-soft">Read-only chip</span>
</div>`
      }
    ],
    api: [
      { name: '.chip', type: 'class', desc: 'Pill. Use a <code>&lt;button&gt;</code> with <code>aria-pressed</code> to make it toggleable.' },
      { name: '.chip-group', type: 'class', desc: 'Wrapping container. <code>data-single</code> allows one active chip; <code>data-required</code> prevents none.' },
      { name: '.chip-check / .chip-count', type: 'class', desc: 'Check icon that slides in when pressed, and a muted count.' },
      { name: '.chip-remove', type: 'class', desc: 'Close button; removes the chip with an exit animation.' },
      { name: '.chip-input', type: 'class', desc: 'Field that turns typed text into chips (Enter, comma or Tab).' },
      { name: '.chip-sm', type: 'class', desc: 'Sizes and quieter styles. Also: <code>.chip-lg</code> <code>.chip-soft</code> <code>.chip-square</code> <code>.tag</code> <code>.tag-soft</code>' },
      { name: 'ranj:toggle', type: 'event', desc: 'On a chip. detail: <code>{ pressed, value }</code>' },
      { name: 'ranj:change', type: 'event', desc: 'On the group or input. detail: <code>{ values }</code>' },
      { name: 'ranj:remove / ranj:add', type: 'event', desc: 'Cancelable. detail: <code>{ value }</code>' },
      { name: 'Ranj.chip.remove(el)', type: 'js', desc: 'Imperative helpers. Also: <code>.create(text)</code> <code>.values(group)</code>' }
    ]
  });
})();

;
/* docs/registry/base-code-block.js */
(function () {
  var I = RB.ic;
  var copyBtn = '<button class="code-block-copy" aria-label="Copy code">' + I('copy', 'class="icon-copy"') + I('check', 'class="icon-done"') + '</button>';
  RanjDocs.add({
    id: 'code-block',
    name: 'Code block',
    group: 'Base',
    description: 'Syntax-highlighted code with a filename header, copy button, line numbers, highlighted and diff lines, and package-manager tabs. Includes a tiny built-in highlighter for JS, HTML, CSS and shell.',
    tags: ['new', 'js'],
    keywords: ['code', 'snippet', 'pre', 'syntax highlighting', 'copy', 'terminal', 'diff'],
    demos: [
      {
        title: 'With filename and line numbers',
        center: false,
        html: `<div class="code-block" data-lang="js" data-line-numbers data-highlight="4-6">
  <div class="code-block-header"><span class="code-block-filename">${I('fileCode')} app/api/checkout.js</span><span class="code-block-lang">js</span>${copyBtn}</div>
  <pre><code>import { stripe } from './lib/stripe';

export async function POST(req) {
  const { priceId, seats } = await req.json();
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: seats }],
    mode: 'subscription',
    success_url: 'https://acme.com/welcome', // redirect after pay
  });
  return Response.json({ url: session.url });
}</code></pre>
</div>`
      },
      {
        title: 'Install tabs',
        center: false,
        html: `<div class="code-block" data-lang="bash">
  <div class="code-block-header">
    <div class="code-block-tabs"><button data-code-tab="npm">npm</button><button data-code-tab="pnpm">pnpm</button><button data-code-tab="yarn">yarn</button><button data-code-tab="bun">bun</button></div>
    ${copyBtn}
  </div>
  <div data-code-panel="npm"><pre><code>$ npm install ranj-ui</code></pre></div>
  <div data-code-panel="pnpm"><pre><code>$ pnpm add ranj-ui</code></pre></div>
  <div data-code-panel="yarn"><pre><code>$ yarn add ranj-ui</code></pre></div>
  <div data-code-panel="bun"><pre><code>$ bun add ranj-ui</code></pre></div>
</div>`
      },
      {
        title: 'Diff',
        center: false,
        html: `<div class="code-block" data-lang="css" data-removed="2" data-added="3-4">
  <div class="code-block-header"><span class="code-block-filename">${I('file')} theme.css</span>${copyBtn}</div>
  <pre><code>:root {
  --hue: 252;
  --hue: 162;
  --radius: 0.75rem;
  --font-sans: 'Inter', system-ui, sans-serif;
}</code></pre>
</div>`
      },
      {
        title: 'Terminal and inline command',
        center: false,
        html: `<div class="stack gap-4" style="align-items:center">
  <div class="code-block code-block-dark" data-lang="bash" style="width:100%">
    <div class="code-block-header"><span class="code-block-dots mac"><i></i><i></i><i></i></span><span class="code-block-filename">zsh — ~/acme</span>${copyBtn}</div>
    <pre><code>$ git clone https://github.com/acme/web.git
$ cd web && npm install
$ npm run dev -- --port 3000   # starts on localhost</code></pre>
  </div>
  <div class="code-inline"><code>npx ranj-ui init</code>${copyBtn}</div>
</div>`
      },
      {
        title: 'HTML without header',
        description: 'The copy button floats in the corner and appears on hover.',
        center: false,
        html: `<div class="code-block" data-lang="html">
  ${copyBtn}
  <pre><code>&lt;button class="btn btn-gradient"&gt;
  Get started
&lt;/button&gt;</code></pre>
</div>`
      }
    ],
    api: [
      { name: '.code-block', type: 'class', desc: 'Container. Theme-aware (light code in light mode); <code>.code-block-dark</code> forces dark.' },
      { name: '.code-block-header', type: 'class', desc: 'Header parts. Also: <code>.code-block-filename</code> <code>.code-block-lang</code> <code>.code-block-dots(.mac)</code>' },
      { name: '.code-block-copy', type: 'class', desc: 'Copy button with <code>.icon-copy</code> / <code>.icon-done</code> icons. Strips <code>$ </code> prompts. <code>data-copy-text</code> overrides.' },
      { name: 'data-lang', type: 'attr', desc: '<code>js</code>, <code>ts</code>, <code>html</code>, <code>css</code>, <code>bash</code>, <code>json</code>: built-in highlighting for plain-text code. Skip it if you bring your own highlighter (e.g. Shiki output).' },
      { name: 'data-line-numbers', type: 'attr', desc: 'Show line numbers (not copied).' },
      { name: 'data-highlight', type: 'attr', desc: 'Line ranges like <code>"2,4-6"</code>. Also: <code>data-added</code> <code>data-removed</code>' },
      { name: 'data-code-tab', type: 'attr', desc: 'Tabbed variants with arrow-key navigation. Also: <code>data-code-panel</code>' },
      { name: '.code-inline', type: 'class', desc: 'One-line command with a copy button.' },
      { name: '.code-block-wrap', type: 'var', desc: 'Wrap long lines / max height before scrolling (32rem). Also: <code>--code-max-h</code>' },
      { name: '--tok-k', type: 'var', desc: 'Token colors. Also: <code>--tok-s</code> <code>--tok-n</code> <code>--tok-c</code> <code>--tok-t</code> <code>--tok-a</code> <code>--tok-f</code> <code>--tok-p</code>' },
      { name: 'ranj:copy / ranj:change', type: 'event', desc: 'detail: <code>{ text }</code> / <code>{ tab }</code>' },
      { name: 'Ranj.copy(text)', type: 'js', desc: 'Clipboard helper and the line highlighter. Also: <code>Ranj.highlight(line, lang)</code>' }
    ]
  });
})();

;
/* docs/registry/base-description-list.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'description-list',
    name: 'Description list',
    group: 'Base',
    description: 'Key / value pairs for details pages, settings summaries and receipts. Stacks on phones.',
    tags: ['new'],
    keywords: ['dl', 'key value', 'details', 'properties', 'receipt', 'summary'],
    demos: [
      {
        title: 'Details card',
        center: false,
        html: `<div class="card" style="max-width:36rem;margin:0 auto">
  <div class="card-header card-header-row"><div><div class="card-title">Deployment</div><div class="card-description">dpl_7Hq2xK9 · Production</div></div><span class="badge badge-soft badge-success badge-dot">Ready</span></div>
  <div class="card-content">
    <dl class="dl">
      <div><dt>Domain</dt><dd><a class="link" href="#">acme.com</a><span class="badge badge-outline badge-sm">+2</span></dd></div>
      <div><dt>Branch</dt><dd>${I('git', 'class="size-4"')} main</dd></div>
      <div><dt>Commit</dt><dd class="mono">a1f9c3e<span class="muted" style="font-family:var(--font-sans)">fix: rounding on annual invoices</span></dd></div>
      <div><dt>Created</dt><dd>Nov 16, 2026, 09:41 by Jun Kim</dd></div>
      <div><dt>Build time</dt><dd>48s</dd></div>
    </dl>
  </div>
</div>`
      },
      {
        title: 'Stat grid',
        center: false,
        html: `<dl class="dl dl-grid dl-card" style="padding:1.25rem;max-width:40rem;margin:0 auto">
  <div><dt>Plan</dt><dd>Pro</dd></div>
  <div><dt>Seats</dt><dd>18 / 20</dd></div>
  <div><dt>Next invoice</dt><dd>$432.00</dd></div>
  <div><dt>Region</dt><dd>eu-west-1</dd></div>
</dl>`
      },
      {
        title: 'Receipt',
        html: `<div class="card card-sm" style="width:min(100%,20rem)"><div class="card-content">
  <dl class="dl dl-inline">
    <div><dt>Pro plan × 18 seats</dt><dd>$432.00</dd></div>
    <div><dt>Extra build minutes</dt><dd>$12.40</dd></div>
    <div><dt>Annual discount</dt><dd class="text-success">−$86.40</dd></div>
    <div><dt>Tax (8.875%)</dt><dd>$31.79</dd></div>
    <div class="dl-total"><dt>Total</dt><dd>$389.79</dd></div>
  </dl>
</div></div>`
      },
      {
        title: 'Striped',
        center: false,
        html: `<dl class="dl dl-striped" style="max-width:32rem;margin:0 auto;--dl-key:9rem">
  <div><dt>Full name</dt><dd>Ana Silva</dd></div>
  <div><dt>Email</dt><dd>ana@linea.design</dd></div>
  <div><dt>Role</dt><dd>Owner</dd></div>
  <div><dt>API key</dt><dd class="mono">sk_live_••••••••3f9a<button class="btn btn-ghost btn-xs dl-action">${I('copy')} Copy</button></dd></div>
</dl>`
      }
    ],
    api: [
      { name: '.dl / .description-list', type: 'class', desc: 'On a <code>&lt;dl&gt;</code> whose children are <code>&lt;div&gt;&lt;dt/&gt;&lt;dd/&gt;&lt;/div&gt;</code>.' },
      { name: '--dl-key', type: 'var', default: '11rem', desc: 'Width of the key column.' },
      { name: '.dl-card', type: 'class', desc: 'Card surface, zebra rows, stacked grid, right-aligned receipt values, monospaced values. Also: <code>.dl-striped</code> <code>.dl-grid</code> <code>.dl-inline</code> <code>.dl-mono</code>' },
      { name: '.dl-total / .dl-action', type: 'class', desc: 'Receipt total row / push an action to the right of a value.' }
    ]
  });
})();

;
/* docs/registry/base-empty-state.js */
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

;
/* docs/registry/base-icon-box.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'icon-box',
    name: 'Icon box',
    group: 'Base',
    description: 'A tinted tile that frames an icon, plus <code>.feature</code> layouts for feature grids. Soft, solid gradient, outline and glow styles.',
    tags: ['new'],
    keywords: ['feature icon', 'icon tile', 'icon container', 'features', 'benefits'],
    demos: [
      {
        title: 'Styles and tones',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="icon-box">${I('zap')}</span>
<span class="icon-box icon-box-success">${I('checkCircle')}</span>
<span class="icon-box icon-box-warning">${I('alert')}</span>
<span class="icon-box icon-box-destructive">${I('trash')}</span>
<span class="icon-box icon-box-info">${I('info')}</span>
<span class="icon-box icon-box-neutral">${I('settings')}</span>
<span class="icon-box icon-box-solid">${I('sparkles')}</span>
<span class="icon-box icon-box-solid" style="--icon-box-hue:150">${I('shield')}</span>
<span class="icon-box icon-box-solid" style="--icon-box-hue:30">${I('rocket')}</span>
<span class="icon-box icon-box-outline">${I('command')}</span>
<span class="icon-box icon-box-glow icon-box-circle">${I('star')}</span>
</div>`
      },
      {
        title: 'Sizes',
        html: `<span class="icon-box icon-box-sm">${I('globe')}</span><span class="icon-box">${I('globe')}</span><span class="icon-box icon-box-lg">${I('globe')}</span><span class="icon-box icon-box-xl icon-box-solid icon-box-glow">${I('globe')}</span>`
      },
      {
        title: 'Feature grid',
        center: false,
        html: `<div class="grid grid-auto" style="--min:220px;--gap:1.25rem">
  <div class="feature feature-card"><span class="icon-box icon-box-outline">${I('zap')}</span><div class="feature-title">Edge rendering</div><p class="feature-text">Pages render in the region closest to each visitor, in under 50 ms.</p></div>
  <div class="feature feature-card"><span class="icon-box icon-box-outline">${I('database')}</span><div class="feature-title">Managed Postgres</div><p class="feature-text">Branching databases for every preview, with point-in-time restore.</p></div>
  <div class="feature feature-card"><span class="icon-box icon-box-outline">${I('shield')}</span><div class="feature-title">Firewall included</div><p class="feature-text">Bot protection and rate limits with no config and no extra bill.</p></div>
</div>`
      },
      {
        title: 'Feature rows',
        center: false,
        html: `<div class="stack gap-6" style="max-width:30rem;margin:0 auto">
  <div class="feature feature-row"><span class="icon-box icon-box-solid">${I('rocket')}</span><div><div class="feature-title">Ship in minutes</div><p class="feature-text">Connect a repo and every push becomes a live URL.</p></div></div>
  <div class="feature feature-row"><span class="icon-box icon-box-solid" style="--icon-box-hue:150">${I('chart')}</span><div><div class="feature-title">Analytics built in</div><p class="feature-text">Privacy-friendly traffic and Web Vitals, no script tag.</p></div></div>
  <div class="feature feature-row"><span class="icon-box icon-box-solid" style="--icon-box-hue:30">${I('users')}</span><div><div class="feature-title">Made for teams</div><p class="feature-text">Comments on previews, roles, and SSO on every plan.</p></div></div>
</div>`
      }
    ],
    api: [
      { name: '.icon-box', type: 'class', desc: 'Soft brand tile; the icon scales to 46% of the box.' },
      { name: '.icon-box-success', type: 'class', desc: 'Tones. Also: <code>.icon-box-warning</code> <code>.icon-box-destructive</code> <code>.icon-box-info</code> <code>.icon-box-neutral</code>' },
      { name: '.icon-box-solid', type: 'class', desc: 'Glossy gradient (hue via <code>--icon-box-hue</code>), bordered tile, halo glow, circle. Also: <code>.icon-box-outline</code> <code>.icon-box-glow</code> <code>.icon-box-circle</code>' },
      { name: '.icon-box-sm / -lg / -xl', type: 'class', desc: '32 / (44) / 56 / 72px; or set <code>--icon-box-size</code>.' },
      { name: '.feature', type: 'class', desc: 'Icon + title + text block. <code>.feature-row</code> puts the icon on the left; <code>.feature-card</code> adds a hover card. Also: <code>.feature-title</code> <code>.feature-text</code>' }
    ]
  });
})();

;
/* docs/registry/base-image.js */
(function () {
  var A = RB.art;
  RanjDocs.add({
    id: 'image',
    name: 'Image',
    group: 'Base',
    description: 'Framed images with a hairline ring, rounded corners, captions, hover zoom, grayscale-to-color and overlay captions. Broken images fall back to a placeholder.',
    tags: ['new', 'js'],
    keywords: ['img', 'figure', 'photo', 'picture', 'caption', 'zoom', 'gallery'],
    demos: [
      {
        title: 'Figure with caption',
        html: `<figure class="figure" style="width:min(100%,30rem)">
  <div class="img-frame aspect-video">${A(1, 'img-art')}</div>
  <figcaption><b>Fig. 1</b> Sunrise over the Algarve coast, shot on a 35mm prime.</figcaption>
</figure>`
      },
      {
        title: 'Hover effects',
        description: 'Zoom, grayscale to color, and an overlay caption.',
        center: false,
        html: `<div class="grid grid-auto" style="--min:200px">
  <figure class="figure"><div class="img-frame img-zoom aspect-photo">${A(0, 'img-art')}</div><figcaption>.img-zoom</figcaption></figure>
  <figure class="figure"><div class="img-frame img-grayscale aspect-photo">${A(2, 'img-art')}</div><figcaption>.img-grayscale</figcaption></figure>
  <figure class="figure"><figure class="img-frame img-overlay img-zoom aspect-photo" style="margin:0">${A(3, 'img-art')}<figcaption>Joshua Tree · 4 photos</figcaption></figure><figcaption>.img-overlay</figcaption></figure>
</div>`
      },
      {
        title: 'Shapes and badges',
        html: `<div class="img-frame aspect-square" style="width:8rem;--img-radius:var(--radius-sm)">${A(4, 'img-art')}</div>
<div class="img-frame aspect-square" style="width:8rem">${A(1, 'img-art')}<span class="badge badge-contrast badge-sm">NEW</span></div>
<div class="img-frame aspect-square" style="width:8rem;--img-radius:50%">${A(2, 'img-art')}</div>
<div class="img-frame aspect-portrait" style="width:7rem">${A(0, 'img-art')}</div>`
      },
      {
        title: 'Broken image fallback',
        description: 'ranj.js marks failed images with <code>data-state="error"</code> and shows a placeholder.',
        html: `<figure class="figure" style="width:14rem"><div class="img-frame aspect-photo"><img src="data:image/png;base64,broken" alt="Missing product shot"></div><figcaption>product-hero.png</figcaption></figure>`
      }
    ],
    api: [
      { name: '.img-frame', type: 'class', desc: 'Clipping wrapper with a hairline inner ring. Children <code>img</code> / <code>.img-art</code> cover it.' },
      { name: '.img-zoom', type: 'class', desc: 'Hover effects. <code>--zoom</code> sets the scale (1.08). Also: <code>.img-grayscale</code> <code>.img-overlay</code>' },
      { name: '.img', type: 'class', desc: 'Classes for a bare <code>&lt;img&gt;</code>. Also: <code>.img-rounded</code> <code>.img-rounded-xl</code> <code>.img-circle</code> <code>.img-bordered</code>' },
      { name: '.figure / .figure-caption', type: 'class', desc: 'Image + caption stack.' },
      { name: '.img-grid', type: 'class', desc: 'Auto-fill gallery grid (<code>--min</code>).' },
      { name: '--img-radius', type: 'var', default: '--radius-xl', desc: 'Corner radius of a frame.' },
      { name: 'data-state="error"', type: 'attr', desc: 'Set automatically when the image fails to load.' }
    ]
  });
})();

;
/* docs/registry/base-kbd.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'kbd',
    name: 'Kbd',
    group: 'Base',
    description: 'Keyboard keys and shortcut combos with a subtle keycap bevel. Looks right inside buttons, menus and body text.',
    keywords: ['keyboard', 'shortcut', 'hotkey', 'key', 'keycap'],
    demos: [
      {
        title: 'Keys and combos',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<kbd class="kbd">⌘</kbd>
<kbd class="kbd">Shift</kbd>
<kbd class="kbd">Esc</kbd>
<kbd class="kbd">↵</kbd>
<span class="kbd-combo"><kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd></span>
<span class="kbd-combo"><kbd class="kbd">Ctrl</kbd><span class="kbd-sep">+</span><kbd class="kbd">Shift</kbd><span class="kbd-sep">+</span><kbd class="kbd">P</kbd></span>
<span class="kbd-combo"><kbd class="kbd">G</kbd><span class="kbd-sep">then</span><kbd class="kbd">I</kbd></span>
</div>`
      },
      {
        title: 'Sizes',
        html: `<kbd class="kbd kbd-sm">⌘K</kbd><kbd class="kbd">⌘K</kbd><kbd class="kbd kbd-lg">⌘K</kbd><kbd class="kbd kbd-lg kbd-mono">Tab</kbd>`
      },
      {
        title: 'Shortcut list',
        html: `<div class="list-group list-group-sm" style="width:min(100%,22rem)">
  <div class="list-group-item"><span class="list-group-content">Search</span><span class="kbd-combo"><kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd></span></div>
  <div class="list-group-item"><span class="list-group-content">New issue</span><kbd class="kbd">C</kbd></div>
  <div class="list-group-item"><span class="list-group-content">Go to inbox</span><span class="kbd-combo"><kbd class="kbd">G</kbd><span class="kbd-sep">then</span><kbd class="kbd">I</kbd></span></div>
  <div class="list-group-item"><span class="list-group-content">Toggle sidebar</span><span class="kbd-combo"><kbd class="kbd">⌘</kbd><kbd class="kbd">\\</kbd></span></div>
</div>`
      },
      {
        title: 'Live keys',
        description: 'Press arrow keys while this demo is focused: keys use <code>data-state="active"</code> to look pressed.',
        html: `<div class="demo-kbd-pad" tabindex="0" aria-label="Arrow key visualizer">
  <span></span><kbd class="kbd kbd-lg" data-key="ArrowUp">↑</kbd><span></span>
  <kbd class="kbd kbd-lg" data-key="ArrowLeft">←</kbd><kbd class="kbd kbd-lg" data-key="ArrowDown">↓</kbd><kbd class="kbd kbd-lg" data-key="ArrowRight">→</kbd>
</div>`,
        css: '.demo-kbd-pad { display: grid; grid-template-columns: repeat(3, 2.25rem); gap: .35rem; padding: 1rem; border-radius: var(--radius-lg); outline-offset: 4px; }\n.demo-kbd-pad .kbd { width: 2.25rem; }',
        js: "var pad = root.querySelector('.demo-kbd-pad');\nfunction set(e, on) { var k = pad.querySelector('[data-key=\"' + e.key + '\"]'); if (!k) return; e.preventDefault(); if (on) k.setAttribute('data-state', 'active'); else k.removeAttribute('data-state'); }\npad.addEventListener('keydown', function (e) { set(e, true); });\npad.addEventListener('keyup', function (e) { set(e, false); });"
      }
    ],
    api: [
      { name: '.kbd', type: 'class', desc: 'A single key. Use the <code>&lt;kbd&gt;</code> element.' },
      { name: '.kbd-combo', type: 'class', desc: 'Groups keys; add <code>.kbd-sep</code> spans for "+" or "then".' },
      { name: '.kbd-sm', type: 'class', desc: 'Sizes, monospaced and borderless. Also: <code>.kbd-lg</code> <code>.kbd-mono</code> <code>.kbd-ghost</code>' },
      { name: 'data-state="active"', type: 'attr', desc: 'Pressed look for live visualizers.' }
    ]
  });
})();

;
/* docs/registry/base-link.js */
(function () {
  RanjDocs.add({
    id: 'link',
    name: 'Link',
    group: 'Base',
    description: 'Text link styles: classic underline, animated draw-in, center-out, highlighter sweep, arrow and external.',
    tags: ['new'],
    keywords: ['anchor', 'a', 'href', 'underline', 'hyperlink', 'hover underline'],
    demos: [
      {
        title: 'Styles',
        center: false,
        description: 'Hover each one.',
        html: `<div class="demo-link-grid">
  <a class="link" href="#">Classic underline</a>
  <a class="link-underline" href="#">Draws in from the left</a>
  <a class="link-center" href="#">Grows from the center</a>
  <a class="link-highlight" href="#">Highlighter sweep</a>
  <a class="link-arrow" href="#">Read the changelog</a>
  <a class="link link-external" href="#" target="_blank" rel="noopener">GitHub repository</a>
  <a class="link link-muted" href="#">Muted link</a>
  <a class="link-underline link-primary" href="#">Primary animated</a>
</div>`,
        css: '.demo-link-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem 2rem; width: 100%; max-width: 40rem; margin: 0 auto; }\n.demo-link-grid > a { justify-self: start; }'
      },
      {
        title: 'In copy',
        center: false,
        html: `<p style="max-width:36rem;margin:0 auto">By continuing you agree to our <a class="link link-fg" href="#">Terms of Service</a> and <a class="link link-fg" href="#">Privacy Policy</a>. Questions? <a class="link-underline link-primary" href="#">Talk to a human</a> or browse the <a class="link-highlight" href="#">help center</a>.</p>`
      },
      {
        title: 'Footer links',
        center: false,
        html: `<nav class="cluster" style="--gap:1.5rem;justify-content:center" aria-label="Footer">
  <a class="link-underline link-muted small" style="--link-color:var(--muted-fg)" href="#">Pricing</a>
  <a class="link-underline small" style="--link-color:var(--muted-fg)" href="#">Docs</a>
  <a class="link-underline small" style="--link-color:var(--muted-fg)" href="#">Changelog</a>
  <a class="link-underline small" style="--link-color:var(--muted-fg)" href="#">Careers</a>
  <a class="link-underline small" style="--link-color:var(--muted-fg)" href="#">Status</a>
</nav>`
      }
    ],
    api: [
      { name: '.link', type: 'class', desc: 'Underlined brand link. <code>.link-muted</code>, <code>.link-fg</code>, <code>.link-plain</code>.' },
      { name: '.link-underline', type: 'class', desc: 'Underline draws in on hover (<code>.link-animated</code> alias). Add <code>.link-primary</code> for brand color.' },
      { name: '.link-center', type: 'class', desc: 'Underline grows from the center.' },
      { name: '.link-highlight', type: 'class', desc: 'Highlighter bar sweeps up behind the text.' },
      { name: '.link-arrow / .link-external', type: 'class', desc: 'Trailing → or ↗ that nudges on hover.' },
      { name: '--link-color / --link-line', type: 'var', desc: 'Text and underline color.' }
    ]
  });
})();

;
/* docs/registry/base-list-group.js */
(function () {
  var I = RB.ic, F = RB.face;
  var chev = I('chevronRight', 'class="list-group-chevron"');
  RanjDocs.add({
    id: 'list-group',
    name: 'List group',
    group: 'Base',
    description: 'A bordered list of rows with icons, descriptions, meta and actions. Good for settings, files, notifications and navigation.',
    tags: ['new'],
    keywords: ['list', 'rows', 'item group', 'settings list', 'menu list'],
    demos: [
      {
        title: 'Settings',
        center: false,
        html: `<nav class="list-group" style="max-width:26rem;margin:0 auto" aria-label="Settings">
  <a class="list-group-item" href="#"><span class="list-group-icon">${I('user')}</span><span class="list-group-content"><span class="list-group-title">Profile</span><span class="list-group-description">Name, photo and bio</span></span>${chev}</a>
  <a class="list-group-item" href="#" aria-current="true"><span class="list-group-icon">${I('lock')}</span><span class="list-group-content"><span class="list-group-title">Security</span><span class="list-group-description">Passkeys and two-factor</span></span>${chev}</a>
  <a class="list-group-item" href="#"><span class="list-group-icon">${I('bell')}</span><span class="list-group-content"><span class="list-group-title">Notifications</span><span class="list-group-description">Email, push and Slack</span></span><span class="badge badge-soft badge-sm">3 new</span>${chev}</a>
  <a class="list-group-item" href="#"><span class="list-group-icon">${I('creditCard')}</span><span class="list-group-content"><span class="list-group-title">Billing</span><span class="list-group-description">Pro plan · renews Dec 1</span></span>${chev}</a>
</nav>`
      },
      {
        title: 'Files with hover actions',
        center: false,
        html: `<ul class="list-group list-group-hover-actions" style="max-width:30rem;margin:0 auto">
  <li class="list-group-header">Recent files</li>
  <li class="list-group-item"><span class="list-group-icon" style="background:var(--info-soft);color:var(--info-soft-fg)">${I('fileCode')}</span><span class="list-group-content"><span class="list-group-title">checkout-flow.tsx</span><span class="list-group-description">Edited by Jun Kim</span></span><span class="list-group-meta">2m ago</span><span class="list-group-action"><button class="btn btn-ghost btn-icon btn-sm" aria-label="Download">${I('download')}</button><button class="btn btn-ghost btn-icon btn-sm" aria-label="More">${I('more')}</button></span></li>
  <li class="list-group-item"><span class="list-group-icon" style="background:var(--success-soft);color:var(--success-soft-fg)">${I('image')}</span><span class="list-group-content"><span class="list-group-title">hero-dark@2x.png</span><span class="list-group-description">2.4 MB · 2880×1620</span></span><span class="list-group-meta">1h ago</span><span class="list-group-action"><button class="btn btn-ghost btn-icon btn-sm" aria-label="Download">${I('download')}</button><button class="btn btn-ghost btn-icon btn-sm" aria-label="More">${I('more')}</button></span></li>
  <li class="list-group-item"><span class="list-group-icon" style="background:var(--warning-soft);color:var(--warning-soft-fg)">${I('folder')}</span><span class="list-group-content"><span class="list-group-title">Brand assets</span><span class="list-group-description">48 files</span></span><span class="list-group-meta">Yesterday</span><span class="list-group-action"><button class="btn btn-ghost btn-icon btn-sm" aria-label="Download">${I('download')}</button><button class="btn btn-ghost btn-icon btn-sm" aria-label="More">${I('more')}</button></span></li>
</ul>`
      },
      {
        title: 'Notifications',
        center: false,
        html: `<ul class="list-group" style="max-width:28rem;margin:0 auto">
  <li class="list-group-item" style="align-items:flex-start"><img class="avatar avatar-sm" src="${F(20)}" alt=""><span class="list-group-content"><span class="small"><b>Ana Silva</b> commented on <b>Q4 roadmap</b></span><span class="list-group-description">"Can we move the pricing launch up a week?"</span></span><span class="badge-indicator" style="background:var(--primary);margin-top:.4rem"></span></li>
  <li class="list-group-item" style="align-items:flex-start"><span class="avatar avatar-sm avatar-tint" style="--avatar-hue:150">JK</span><span class="list-group-content"><span class="small"><b>Jun Kim</b> assigned you <b>ACME-482</b></span><span class="list-group-description">Fix rounding on annual invoices</span></span><span class="list-group-meta">1h</span></li>
  <li class="list-group-item" style="align-items:flex-start"><span class="list-group-icon" style="width:2rem;height:2rem;background:var(--success-soft);color:var(--success-soft-fg)">${I('rocket')}</span><span class="list-group-content"><span class="small"><b>Production deploy</b> succeeded</span><span class="list-group-description">v2.14.0 · 48s</span></span><span class="list-group-meta">3h</span></li>
</ul>`
      },
      {
        title: 'Inset navigation',
        html: `<nav class="list-group list-group-inset" style="width:14rem" aria-label="Workspace">
  <a class="list-group-item" href="#" aria-current="true"><span>${I('inbox', 'class="size-4"')}</span><span class="list-group-content">Inbox</span><span class="list-group-meta">12</span></a>
  <a class="list-group-item" href="#"><span>${I('layers', 'class="size-4"')}</span><span class="list-group-content">Projects</span></a>
  <a class="list-group-item" href="#"><span>${I('users', 'class="size-4"')}</span><span class="list-group-content">Team</span></a>
  <a class="list-group-item" href="#"><span>${I('settings', 'class="size-4"')}</span><span class="list-group-content">Settings</span></a>
</nav>`
      }
    ],
    api: [
      { name: '.list-group', type: 'class', desc: 'Bordered container (<code>ul</code>, <code>nav</code> or <code>div</code>). v1 <code>.item-group</code> still works.' },
      { name: '.list-group-item', type: 'class', desc: 'Row. Hover state when it is an <code>a</code>, <code>button</code> or has <code>data-clickable</code>.' },
      { name: 'aria-current="true"', type: 'attr', desc: 'Selected row with an accent bar. <code>aria-disabled</code> dims it.' },
      { name: '.list-group-icon', type: 'class', desc: 'Row parts. Also: <code>.list-group-content</code> <code>.list-group-title</code> <code>.list-group-description</code> <code>.list-group-meta</code> <code>.list-group-action</code> <code>.list-group-chevron</code>' },
      { name: '.list-group-header', type: 'class', desc: 'Section label row.' },
      { name: '.list-group-hover-actions', type: 'class', desc: 'Reveal actions on hover/focus (always visible on touch).' },
      { name: '.list-group-flush', type: 'class', desc: 'No border, sidebar style, compact, counters. Also: <code>.list-group-inset</code> <code>.list-group-sm</code> <code>.list-group-numbered</code>' }
    ]
  });
})();

;
/* docs/registry/base-logo-cloud.js */
(function () {
  // Fictional wordmarks drawn with simple shapes + text so the demo needs no assets.
  var L = [
    ['<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 21h20z"/></svg>', 'Vertex'],
    ['<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="12" r="6"/><circle cx="16" cy="12" r="6" opacity=".55"/></svg>', 'Lumen'],
    ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 18 12 6l8 12"/></svg>', 'Northwind'],
    ['<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="4" opacity=".5"/></svg>', 'Quadra'],
    ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/></svg>', 'Halfmoon'],
    ['<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 12c4-8 14-8 18 0-4 8-14 8-18 0z"/></svg>', 'Ellipse']
  ];
  function logos() { return L.map(function (l) { return '<a href="#" aria-label="' + l[1] + '">' + l[0] + '<span>' + l[1] + '</span></a>'; }).join('\n  '); }
  RanjDocs.add({
    id: 'logo-cloud',
    name: 'Logo cloud',
    group: 'Base',
    description: 'A static grid of customer or partner logos, muted until hovered. Use SVG wordmarks or grayscale images. For a scrolling version see Marquee.',
    tags: ['new'],
    keywords: ['logos', 'customers', 'trusted by', 'brands', 'partners', 'social proof'],
    demos: [
      {
        title: 'Trusted by',
        center: false,
        html: `<div>
  <p class="logo-cloud-title">Trusted by 4,000+ product teams</p>
  <div class="logo-cloud logo-cloud-focus">
  ${logos()}
  </div>
</div>`
      },
      {
        title: 'Bordered grid',
        center: false,
        html: `<div class="logo-cloud logo-cloud-grid" style="--logo-cols:3">
  ${logos()}
</div>`
      }
    ],
    api: [
      { name: '.logo-cloud', type: 'class', desc: 'Grid of logos; each child can hold an <code>svg</code>/<code>img</code> plus text.' },
      { name: '--logo-cols / --logo-h', type: 'var', default: '6 / 1.75rem', desc: 'Columns (drops to 3 then 2 on small screens) and logo height.' },
      { name: '.logo-cloud-focus', type: 'class', desc: 'Dim the others while one logo is hovered.' },
      { name: '.logo-cloud-grid', type: 'class', desc: 'Bordered tile grid.' },
      { name: '.logo-cloud-title', type: 'class', desc: 'Centered caption / fade the edges. Also: <code>.logo-cloud-fade</code>' }
    ]
  });
})();

;
/* docs/registry/base-meter.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'meter',
    name: 'Meter',
    group: 'Base',
    description: 'A value within a known range, like disk usage, quota or password strength. Unlike progress, a meter is not a task that finishes.',
    keywords: ['gauge', 'quota', 'usage', 'password strength', 'capacity'],
    demos: [
      {
        title: 'Usage',
        center: false,
        html: `<div class="card" style="max-width:26rem;margin:0 auto"><div class="card-header"><div class="card-title">Plan usage</div><div class="card-description">Resets on December 1</div></div>
<div class="card-content stack gap-5">
  <div><div class="progress-label"><span>Bandwidth</span><span>412 / 1,000 GB</span></div><div class="meter meter-success" role="meter" aria-valuenow="41" aria-valuemin="0" aria-valuemax="100" aria-label="Bandwidth" style="--value:41"><div class="meter-fill"></div></div></div>
  <div><div class="progress-label"><span>Build minutes</span><span>5,160 / 6,000</span></div><div class="meter meter-warning" role="meter" aria-valuenow="86" style="--value:86"><div class="meter-fill"></div></div></div>
  <div><div class="progress-label"><span>Seats</span><span>20 / 20</span></div><div class="meter meter-destructive" role="meter" aria-valuenow="100" style="--value:100"><div class="meter-fill"></div></div></div>
</div></div>`
      },
      {
        title: 'Password strength',
        description: 'Type a password. A few lines of JS set <code>data-level</code> on <code>.meter-segments</code>.',
        html: `<div class="stack gap-2" style="width:min(100%,20rem)">
  <label class="label" for="meter-pw">Password</label>
  <input id="meter-pw" class="input" type="text" value="hunter2" autocomplete="off">
  <div class="meter-segments" data-level="1" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  <span class="tiny muted demo-meter-msg">Weak: add length and symbols</span>
</div>`,
        js: [
          "var i = root.querySelector('input'), m = root.querySelector('.meter-segments'), msg = root.querySelector('.demo-meter-msg');",
          "var words = ['Too short', 'Weak: add length and symbols', 'Fair: try a longer phrase', 'Good', 'Strong password'];",
          "function score(v) { var s = 0; if (v.length >= 8) s++; if (v.length >= 12) s++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++; if (/[^\\w]/.test(v) || /\\d/.test(v)) s++; return v.length < 4 ? 0 : Math.max(1, s); }",
          "function upd() { var s = score(i.value); m.setAttribute('data-level', s); msg.textContent = words[s]; }",
          "i.addEventListener('input', upd); upd();"
        ].join('\n')
      },
      {
        title: 'Native meter and gradient',
        center: false,
        html: `<div class="stack gap-5" style="max-width:26rem;margin:0 auto">
  <div><div class="progress-label"><span>${I('gauge', 'class="size-4" style="display:inline;vertical-align:-3px"')} CPU</span><span>64%</span></div><meter class="meter-native" min="0" max="100" low="60" high="85" optimum="20" value="64">64%</meter></div>
  <div><div class="progress-label"><span>Memory</span><span>91%</span></div><meter class="meter-native" min="0" max="100" low="60" high="85" optimum="20" value="91">91%</meter></div>
  <div><div class="progress-label"><span>Risk score</span><span>7.2 / 10</span></div><div class="meter meter-gradient" style="--value:72"><div class="meter-fill"></div></div></div>
</div>`
      }
    ],
    api: [
      { name: '.meter > .meter-fill', type: 'class', desc: 'Track and fill driven by <code>--value</code> (0–100). Use <code>role="meter"</code>.' },
      { name: '.meter-success', type: 'class', desc: 'Tones; or set <code>--meter-color</code>. Also: <code>.meter-warning</code> <code>.meter-destructive</code>' },
      { name: '.meter-gradient', type: 'class', desc: 'Green → amber → red scale revealed up to the value.' },
      { name: '.meter-segments[data-level]', type: 'class', desc: 'Segmented strength meter, levels 0–4 (5 with five segments).' },
      { name: 'meter.meter-native', type: 'class', desc: 'Styles the native <code>&lt;meter&gt;</code> with low/high/optimum colors.' },
      { name: '--meter-h', type: 'var', default: '.625rem', desc: 'Track height.' }
    ]
  });
})();

;
/* docs/registry/base-progress.js */
(function () {
  RanjDocs.add({
    id: 'progress',
    name: 'Progress',
    group: 'Base',
    description: 'Show how far along a task is: linear bars in five sizes and tones, striped and animated, indeterminate, segmented multi-value, stepped and circular.',
    keywords: ['progress bar', 'loading bar', 'upload', 'percent', 'ring', 'stacked bar'],
    demos: [
      {
        title: 'With label',
        center: false,
        html: `<div class="stack gap-6" style="max-width:28rem;margin:0 auto">
  <div><div class="progress-label"><span>Uploading design-system.fig</span><span>62%</span></div>
    <div class="progress" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" aria-label="Upload" style="--value:62"><div class="progress-fill"></div></div></div>
  <div><div class="progress-label"><span>Onboarding</span><span>4 of 5 steps</span></div>
    <div class="progress progress-sm progress-success" role="progressbar" aria-valuenow="80" style="--value:80"><div class="progress-fill"></div></div></div>
  <div class="progress-inline"><div class="progress progress-xs progress-gradient" style="--value:34"><div class="progress-fill"></div></div><span>34%</span></div>
</div>`
      },
      {
        title: 'Sizes and tones',
        center: false,
        html: `<div class="stack gap-4" style="max-width:28rem;margin:0 auto">
  <div class="progress progress-xs" style="--value:30"><div class="progress-fill"></div></div>
  <div class="progress progress-sm progress-info" style="--value:45"><div class="progress-fill"></div></div>
  <div class="progress progress-success" style="--value:60"><div class="progress-fill"></div></div>
  <div class="progress progress-lg progress-warning" style="--value:75"><div class="progress-fill"></div></div>
  <div class="progress progress-xl progress-destructive" style="--value:92"><div class="progress-fill"></div></div>
</div>`
      },
      {
        title: 'Striped, animated and indeterminate',
        center: false,
        html: `<div class="stack gap-4" style="max-width:28rem;margin:0 auto">
  <div class="progress progress-lg progress-striped" style="--value:55"><div class="progress-fill"></div></div>
  <div class="progress progress-lg progress-striped progress-animated progress-success" style="--value:70"><div class="progress-fill"></div></div>
  <div class="progress progress-sm progress-indeterminate" role="progressbar" aria-label="Loading"><div class="progress-fill"></div></div>
</div>`
      },
      {
        title: 'Segmented storage',
        center: false,
        html: `<div class="card" style="max-width:28rem;margin:0 auto"><div class="card-content">
  <div class="progress-label"><span>Storage</span><span>71.4 GB of 100 GB</span></div>
  <div class="progress progress-lg progress-stacked" role="img" aria-label="Storage: 32 GB photos, 21 GB video, 12 GB documents, 6 GB other">
    <div class="progress-fill" style="--value:32;background:var(--primary)"></div>
    <div class="progress-fill" style="--value:21;background:oklch(0.7 0.17 calc(var(--hue) + 70))"></div>
    <div class="progress-fill" style="--value:12;background:var(--warning)"></div>
    <div class="progress-fill" style="--value:6.4;background:var(--muted-fg)"></div>
  </div>
  <div class="progress-legend"><span><i style="--c:var(--primary)"></i>Photos 32 GB</span><span><i style="--c:oklch(0.7 0.17 calc(var(--hue) + 70))"></i>Video 21 GB</span><span><i style="--c:var(--warning)"></i>Docs 12 GB</span><span><i style="--c:var(--muted-fg)"></i>Other</span></div>
</div></div>`
      },
      {
        title: 'Steps and ring',
        html: `<div class="cluster" style="justify-content:center;gap:2rem">
<div class="stack gap-2" style="width:min(100%,16rem)"><div class="progress-label" style="margin:0"><span>Course progress</span><span>7 / 10</span></div><div class="progress-steps" style="--steps:10;--value:7"></div></div>
<div class="progress-ring-wrap"><div class="progress-ring" style="--value:72"></div><span>72%</span></div>
<div class="progress-ring-wrap"><div class="progress-ring" style="--value:38;--size:5rem;--thickness:.55rem;--progress-color:var(--success)"></div><span>38%</span></div>
<div class="demo-progress-live progress-ring-wrap"><div class="progress-ring" style="--value:0;--size:4rem;--progress-color:var(--warning)"></div><span>0%</span></div>
</div>`,
        js: "var w = root.querySelector('.demo-progress-live'), r = w.querySelector('.progress-ring'), s = w.querySelector('span'), v = 0;\nvar iv = setInterval(function () { v = (v + 3) % 103; r.style.setProperty('--value', v); s.textContent = v + '%'; }, 80);\nreturn function () { clearInterval(iv); };"
      }
    ],
    api: [
      { name: '.progress > .progress-fill', type: 'class', desc: 'Track and fill. Set <code>--value</code> (0–100) on either, or a width on the fill (v1).' },
      { name: '--value', type: 'var', default: '0', desc: 'Percent complete.' },
      { name: '.progress-xs / -sm / -lg / -xl', type: 'class', desc: 'Heights.' },
      { name: '.progress-success', type: 'class', desc: 'Colors; or set <code>--progress-color</code>. Also: <code>.progress-warning</code> <code>.progress-destructive</code> <code>.progress-info</code> <code>.progress-gradient</code>' },
      { name: '.progress-striped', type: 'class', desc: 'Stripes, moving stripes, glowing fill. Also: <code>.progress-animated</code> <code>.progress-glow</code>' },
      { name: '.progress-indeterminate', type: 'class', desc: 'Looping bar for unknown duration (also <code>data-state="indeterminate"</code>).' },
      { name: '.progress-stacked', type: 'class', desc: 'Multiple fills side by side for segmented values. Pair with <code>.progress-legend</code>.' },
      { name: '.progress-steps', type: 'class', desc: 'Discrete blocks: <code>--steps</code> and <code>--value</code>.' },
      { name: '.progress-ring', type: 'class', desc: 'Circular progress: <code>--value</code>, <code>--size</code>, <code>--thickness</code>. Wrap it in <code>.progress-ring-wrap</code> to overlay a label.' },
      { name: '.progress-label', type: 'class', desc: 'Label row above, or value to the right. Also: <code>.progress-inline</code>' },
      { name: 'role="progressbar"', type: 'attr', desc: 'Required for accessibility on determinate bars.' }
    ]
  });
})();

;
/* docs/registry/base-skeleton.js */
(function () {
  RanjDocs.add({
    id: 'skeleton',
    name: 'Skeleton',
    group: 'Base',
    description: 'Placeholder shapes that hold layout while content loads. Shimmer by default, or <code>.skeleton-pulse</code>. Presets for text, avatars, cards and tables.',
    keywords: ['loading', 'placeholder', 'shimmer', 'ghost', 'content loader'],
    demos: [
      {
        title: 'Profile row',
        html: `<div class="skeleton-row" style="width:min(100%,22rem)" aria-busy="true" aria-label="Loading">
  <div class="skeleton skeleton-avatar" style="--size:3rem"></div>
  <div class="skeleton-stack"><div class="skeleton skeleton-text" style="--w:60%"></div><div class="skeleton skeleton-text" style="--w:85%"></div></div>
</div>`
      },
      {
        title: 'Card',
        center: false,
        html: `<div class="grid grid-auto" style="--min:220px">
  <div class="skeleton-card" aria-busy="true">
    <div class="skeleton skeleton-image"></div>
    <div class="skeleton skeleton-heading"></div>
    <div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text"></div></div>
    <div class="skeleton-row"><div class="skeleton skeleton-avatar" style="--size:1.75rem"></div><div class="skeleton skeleton-text" style="--w:40%"></div></div>
  </div>
  <div class="skeleton-card" aria-busy="true">
    <div class="skeleton skeleton-image skeleton-pulse"></div>
    <div class="skeleton skeleton-heading skeleton-pulse"></div>
    <div><div class="skeleton skeleton-text skeleton-pulse"></div><div class="skeleton skeleton-text skeleton-pulse"></div><div class="skeleton skeleton-text skeleton-pulse"></div></div>
    <div class="skeleton-row"><div class="skeleton skeleton-btn skeleton-pulse"></div><div class="skeleton skeleton-btn skeleton-pulse" style="--w:4rem"></div></div>
  </div>
</div>`
      },
      {
        title: 'Table',
        center: false,
        html: `<div class="skeleton-table" aria-busy="true" aria-label="Loading invoices">
  <div><div class="skeleton skeleton-line" style="--w:40%"></div><div class="skeleton skeleton-line" style="--w:60%"></div><div class="skeleton skeleton-line" style="--w:50%"></div><div class="skeleton skeleton-line"></div></div>
  <div><div class="skeleton-row"><div class="skeleton skeleton-avatar" style="--size:2rem"></div><div class="skeleton skeleton-text" style="--w:70%"></div></div><div class="skeleton skeleton-badge"></div><div class="skeleton skeleton-text" style="--w:70%"></div><div class="skeleton skeleton-text"></div></div>
  <div><div class="skeleton-row"><div class="skeleton skeleton-avatar" style="--size:2rem"></div><div class="skeleton skeleton-text" style="--w:55%"></div></div><div class="skeleton skeleton-badge"></div><div class="skeleton skeleton-text" style="--w:60%"></div><div class="skeleton skeleton-text"></div></div>
  <div><div class="skeleton-row"><div class="skeleton skeleton-avatar" style="--size:2rem"></div><div class="skeleton skeleton-text" style="--w:80%"></div></div><div class="skeleton skeleton-badge"></div><div class="skeleton skeleton-text" style="--w:75%"></div><div class="skeleton skeleton-text"></div></div>
</div>`
      },
      {
        title: 'Load then reveal',
        description: 'Swap skeletons for real content. Click Reload to see it again.',
        html: `<div class="card demo-skeleton-live" style="width:min(100%,22rem)"><div class="card-content"></div></div>
<button class="btn btn-outline btn-sm demo-skeleton-reload">Reload</button>`,
        js: [
          "var box = root.querySelector('.demo-skeleton-live .card-content'), t;",
          "var sk = '<div class=\"skeleton-row\"><div class=\"skeleton skeleton-avatar\"></div><div class=\"skeleton-stack\"><div class=\"skeleton skeleton-text\" style=\"--w:50%\"></div><div class=\"skeleton skeleton-text\" style=\"--w:80%\"></div></div></div><div style=\"margin-top:1rem\"><div class=\"skeleton skeleton-text\"></div><div class=\"skeleton skeleton-text\"></div></div>';",
          "var real = '<div class=\"avatar-label animate-fade-in\"><span class=\"avatar avatar-gradient\" style=\"--avatar-hue:200\">LP</span><div><b>Leo Park</b><span>Shipped the new onboarding</span></div></div><p class=\"small muted animate-fade-in\" style=\"margin-top:1rem;font-weight:400\">Activation is up 18% in the first week. Next: a guided tour for teams.</p>';",
          "function run() { box.setAttribute('aria-busy', 'true'); box.innerHTML = sk; clearTimeout(t); t = setTimeout(function () { box.innerHTML = real; box.removeAttribute('aria-busy'); }, 1600); }",
          "run(); root.querySelector('.demo-skeleton-reload').onclick = run;",
          "return function () { clearTimeout(t); };"
        ].join('\n')
      }
    ],
    api: [
      { name: '.skeleton', type: 'class', desc: 'Shimmering block. Size it yourself or use a preset.' },
      { name: '.skeleton-pulse', type: 'class', desc: 'Pulse instead of shimmer / no animation. Also: <code>.skeleton-static</code>' },
      { name: '.skeleton-text', type: 'class', desc: 'Shape presets. Width via <code>--w</code>, avatar size via <code>--size</code>, image ratio via <code>--ratio</code>. Also: <code>.skeleton-heading</code> <code>.skeleton-line</code> <code>.skeleton-avatar</code> <code>.skeleton-btn</code> <code>.skeleton-badge</code> <code>.skeleton-image</code>' },
      { name: '.skeleton-card', type: 'class', desc: 'Layout presets. Table columns via <code>--cols</code>. Also: <code>.skeleton-row</code> <code>.skeleton-stack</code> <code>.skeleton-table</code>' },
      { name: '--skeleton-from', type: 'var', desc: 'Theme tokens for the shimmer colors. Also: <code>--skeleton-to</code>' },
      { name: 'aria-busy="true"', type: 'attr', desc: 'Set on the loading region for screen readers.' }
    ]
  });
})();

;
/* docs/registry/base-spinner.js */
(function () {
  var petals = '<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>';
  RanjDocs.add({
    id: 'spinner',
    name: 'Spinner',
    group: 'Base',
    description: 'Lightweight loading indicators: ring, gradient arc, dots, bars and iOS-style petals, in five sizes and any tone.',
    keywords: ['loader', 'loading', 'busy', 'activity indicator', 'throbber'],
    demos: [
      {
        title: 'Styles',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="spinner spinner-lg" role="status" aria-label="Loading"></span>
<span class="spinner spinner-lg spinner-arc" role="status" aria-label="Loading"></span>
<span class="spinner spinner-lg spinner-dots" role="status" aria-label="Loading"><span></span><span></span><span></span></span>
<span class="spinner spinner-lg spinner-bar" role="status" aria-label="Loading"><span></span><span></span><span></span><span></span></span>
<span class="spinner spinner-lg spinner-petals spinner-muted" role="status" aria-label="Loading">${petals}</span>
</div>`
      },
      {
        title: 'Sizes',
        html: `<span class="spinner spinner-xs"></span><span class="spinner spinner-sm"></span><span class="spinner"></span><span class="spinner spinner-lg"></span><span class="spinner spinner-xl"></span>
<span class="spinner spinner-xl spinner-arc" style="--spinner-width:5px"></span>`
      },
      {
        title: 'Tones',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<span class="spinner spinner-lg spinner-arc spinner-success"></span>
<span class="spinner spinner-lg spinner-arc spinner-warning"></span>
<span class="spinner spinner-lg spinner-arc spinner-destructive"></span>
<span class="spinner spinner-lg spinner-arc spinner-info"></span>
<span class="spinner spinner-lg spinner-arc spinner-muted"></span>
</div>`
      },
      {
        title: 'In context',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn" disabled style="opacity:.85"><span class="spinner spinner-sm spinner-current"></span> Processing payment</button>
<span class="spinner-label"><span class="spinner spinner-sm spinner-muted"></span> Syncing 1,284 files…</span>
<div class="card card-sm" style="width:14rem"><div class="card-content stack gap-2" style="align-items:center;text-align:center"><span class="spinner spinner-lg spinner-arc"></span><b class="small">Building preview</b><span class="tiny muted">Usually takes about 20 seconds</span></div></div>
</div>`
      }
    ],
    api: [
      { name: '.spinner', type: 'class', desc: 'Ring spinner. Add <code>role="status"</code> and an <code>aria-label</code>.' },
      { name: '.spinner-arc', type: 'class', desc: 'Styles (dots need 3 spans, bar 4 spans, petals 8 <code>&lt;i&gt;</code>). Also: <code>.spinner-dots</code> <code>.spinner-bar</code> <code>.spinner-petals</code>' },
      { name: '.spinner-xs / -sm / -lg / -xl', type: 'class', desc: 'Sizes.' },
      { name: '.spinner-current', type: 'class', desc: 'Colors. Also: <code>.spinner-muted</code> <code>.spinner-success</code> <code>.spinner-warning</code> <code>.spinner-destructive</code> <code>.spinner-info</code> <code>.spinner-white</code>' },
      { name: '--spinner-size', type: 'var', default: '1.25rem / 2px / --primary / .7s', desc: 'Custom sizing, color and speed. Also: <code>--spinner-width</code> <code>--spinner-color</code> <code>--spinner-speed</code>' }
    ]
  });
})();

;
/* docs/registry/data-bar-chart.js */
RanjDocs.add({
  id: 'bar-chart',
  name: 'Bar Chart',
  group: 'Data Display',
  description: 'Vertical bar chart in SVG with grid, axes, grouped or stacked series, hover tooltip and a grow-in animation.',
  tags: ['new', 'js'],
  keywords: ['column chart', 'histogram', 'stacked bar', 'grouped bar', 'graph'],
  demos: [
    {
      title: 'Monthly revenue',
      center: false,
      html: `<div class="chart-card" style="max-width:820px;margin:auto">
  <div class="chart-head">
    <div><div class="chart-title">Net revenue · 2026</div><div class="chart-kpi">$1,284,630 <span class="chart-delta">▲ 18.2%</span></div></div>
    <div class="chart-sub">Jan – Dec, USD</div>
  </div>
  <div class="bar-chart" data-format="currency" data-name="Revenue" aria-label="Net revenue by month"
    data-labels="Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec"
    data-values="78400,81200,92600,88100,97300,104800,99600,112400,118900,121300,138200,151830"></div>
</div>`
    },
    {
      title: 'Grouped series',
      description: 'Pass data-series as JSON: [{ "name", "values", "color" }]. A legend appears automatically.',
      center: false,
      html: `<div class="chart-card" style="max-width:820px;margin:auto">
  <div class="chart-head"><div><div class="chart-title">New signups by quarter</div><div class="chart-kpi">9,412</div></div></div>
  <div class="bar-chart" data-height="240" data-labels="Q1,Q2,Q3,Q4"
    data-series='[{"name":"2025","values":[1420,1690,1810,2050],"color":"chart-7"},{"name":"2026","values":[1980,2240,2390,2802],"color":"chart-1"}]'></div>
</div>`
    },
    {
      title: 'Stacked',
      center: false,
      html: `<div class="chart-card" style="max-width:820px;margin:auto">
  <div class="chart-head"><div><div class="chart-title">MRR by plan</div><div class="chart-kpi">$212.4k</div></div><div class="chart-sub">Last 8 months</div></div>
  <div class="bar-chart" data-stacked data-format="currency" data-height="260" data-radius="5"
    data-labels="Apr,May,Jun,Jul,Aug,Sep,Oct,Nov"
    data-series='[{"name":"Starter","values":[22100,23400,24200,25900,26300,27800,28400,29100]},{"name":"Pro","values":[61200,64800,68900,71300,75600,79200,83400,88600]},{"name":"Enterprise","values":[58000,61000,61000,72000,76000,81000,89000,94700]}]'></div>
</div>`
    },
    {
      title: 'Imperative API',
      description: 'Ranj.chart.bar(el, opts) sets the data and re-renders; values accept arrays.',
      center: false,
      html: `<div class="chart-card" style="max-width:640px;margin:auto">
  <div class="chart-head">
    <div><div class="chart-title">Orders by weekday</div><div class="chart-sub">Click to load another week</div></div>
    <button type="button" class="demo-bar-chart-btn" data-shuffle>Next week →</button>
  </div>
  <div data-orders></div>
</div>`,
      css: `.demo-bar-chart-btn { font-size: .8rem; font-weight: 500; padding: .4rem .8rem; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); color: var(--fg); }
.demo-bar-chart-btn:hover { background: var(--muted); }`,
      js: `const el = root.querySelector('[data-orders]');
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const week = () => days.map((d, i) => Math.round((i > 4 ? 340 : 520) + Math.random() * 260));
Ranj.chart.bar(el, { labels: days, values: week(), color: 'chart-3', height: 220, name: 'Orders' });
root.querySelector('[data-shuffle]').onclick = () => Ranj.chart.bar(el, { values: week() });`
    }
  ],
  api: [
    { name: '.bar-chart', type: 'class', desc: 'Host element; fills its container width.' },
    { name: 'data-labels', type: 'attr', desc: 'Comma-separated x-axis labels.' },
    { name: 'data-values', type: 'attr', desc: 'Single series as comma-separated numbers.' },
    { name: 'data-series', type: 'attr', desc: 'JSON array of { name, values, color } for multiple series.' },
    { name: 'data-stacked', type: 'attr', default: 'false', desc: 'Stack series instead of grouping them.' },
    { name: 'data-height', type: 'attr', default: '260', desc: 'Height in px.' },
    { name: 'data-format', type: 'attr', desc: 'number | currency | percent | compact, plus data-currency, data-prefix, data-suffix, data-decimals.' },
    { name: 'data-radius', type: 'attr', default: '4', desc: 'Top corner radius.' },
    { name: 'data-legend', type: 'attr', default: 'auto', desc: 'true | false; auto shows it for 2+ series.' },
    { name: 'data-y-axis / data-x-axis / data-grid', type: 'attr', default: 'true', desc: 'Toggle axes and grid lines.' },
    { name: 'data-y-ticks', type: 'attr', default: '5', desc: 'Approximate number of y ticks (nice-rounded).' },
    { name: 'data-color', type: 'attr', desc: 'Color for a single series (token name or CSS color).' },
    { name: 'data-static', type: 'attr', desc: 'Skip the grow-in animation.' },
    { name: 'Ranj.chart.bar(el, opts)', type: 'js', desc: 'Same options as attributes (camelCase), arrays/objects allowed. Returns el.' },
    { name: 'Ranj.chart.format(value, opts)', type: 'js', desc: 'The number formatter used by all charts.' }
  ]
});

;
/* docs/registry/data-breadcrumb.js */
(function () {
var home = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>';
var folder = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-8l-2-3H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1z"/></svg>';
var file = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/></svg>';
RanjDocs.add({
  id: 'breadcrumb',
  name: 'Breadcrumb',
  group: 'Data Display',
  description: 'Shows where the current page sits in a hierarchy. Slash, chevron, arrow and dot separators, icons, pill and step styles, and a collapsed “…” variant that expands in place without a dropdown.',
  tags: [],
  keywords: ['path', 'trail', 'navigation', 'crumbs'],
  demos: [
    {
      title: 'Separators',
      html: `<div style="display:grid;gap:1rem">
  <nav aria-label="Breadcrumb"><ol class="breadcrumb">
    <li><a href="#">Dashboard</a></li><li><a href="#">Projects</a></li><li aria-current="page">Atlas redesign</li>
  </ol></nav>
  <nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-chevron">
    <li><a href="#">Dashboard</a></li><li><a href="#">Projects</a></li><li aria-current="page">Atlas redesign</li>
  </ol></nav>
  <nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-arrow">
    <li><a href="#">Dashboard</a></li><li><a href="#">Projects</a></li><li aria-current="page">Atlas redesign</li>
  </ol></nav>
  <nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-dot">
    <li><a href="#">Dashboard</a></li><li><a href="#">Projects</a></li><li aria-current="page">Atlas redesign</li>
  </ol></nav>
</div>`
    },
    {
      title: 'With icons',
      html: `<nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-chevron">
  <li><a href="#" aria-label="Home">${home}</a></li>
  <li><a href="#">${folder}acme-web</a></li>
  <li><a href="#">${folder}src</a></li>
  <li><a href="#">${folder}components</a></li>
  <li aria-current="page">${file}DataTable.tsx</li>
</ol></nav>`
    },
    {
      title: 'Collapsed',
      description: 'Middle crumbs carry <code>.breadcrumb-hidden</code>; the list has <code>.breadcrumb-collapsed</code>. Clicking “…” reveals the full path. No dropdown needed.',
      html: `<nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-chevron breadcrumb-collapsed">
  <li><a href="#">Acme Inc.</a></li>
  <li class="breadcrumb-ellipsis"><button type="button" aria-label="Show full path">…</button></li>
  <li class="breadcrumb-hidden"><a href="#">Engineering</a></li>
  <li class="breadcrumb-hidden"><a href="#">Platform</a></li>
  <li class="breadcrumb-hidden"><a href="#">Q4 Planning</a></li>
  <li><a href="#">Roadmap</a></li>
  <li aria-current="page">Edge caching RFC</li>
</ol></nav>`
    },
    {
      title: 'Pill and steps',
      html: `<div style="display:grid;gap:1.25rem;justify-items:center">
  <nav aria-label="Breadcrumb"><ol class="breadcrumb breadcrumb-chevron breadcrumb-pill">
    <li><a href="#">${home}Home</a></li><li><a href="#">Settings</a></li><li aria-current="page">Billing</li>
  </ol></nav>
  <nav aria-label="Checkout steps"><ol class="breadcrumb breadcrumb-steps">
    <li><a href="#">1. Cart</a></li><li><a href="#">2. Shipping</a></li><li aria-current="step">3. Payment</li>
  </ol></nav>
</div>`,
      css: `.breadcrumb-steps [aria-current="step"] { padding: .3rem .7rem; border-radius: var(--radius-sm); background: var(--primary-soft); color: var(--primary-soft-fg); font-weight: 500; }`
    }
  ],
  api: [
    { name: '.breadcrumb', type: 'class', desc: 'An ol/ul of li items. Links are muted; the last item uses aria-current="page". Wrap it in nav aria-label="Breadcrumb".' },
    { name: '.breadcrumb-chevron / -arrow / -dot / -slash', type: 'class', desc: 'Separator style (slash is the default).' },
    { name: '.breadcrumb-pill / .breadcrumb-steps', type: 'class', desc: 'Contained pill or step-chip appearance.' },
    { name: '.breadcrumb-collapsed + .breadcrumb-hidden + .breadcrumb-ellipsis', type: 'class', desc: 'Hide middle items behind a "…" button. With ranj.js, clicking it reveals them (ranj:expand fires).' },
    { name: '.breadcrumb-responsive', type: 'class', desc: 'Below 520px, hides every item except the first and last two (pair with a .breadcrumb-ellipsis item).' },
    { name: '.breadcrumb-truncate', type: 'class', desc: 'Long crumbs get an ellipsis at 12rem.' },
    { name: '--bc-sep', type: 'var', default: "'/'", desc: 'Separator content: any string, e.g. "›" or "·".' },
    { name: '--bc-gap', type: 'var', default: '.5rem', desc: 'Space around separators.' },
    { name: 'ranj:expand', type: 'event', desc: 'Fired on the list when a collapsed path is expanded.' }
  ]
});
})();

;
/* docs/registry/data-carousel.js */
(function () {
var img = function (id, w) { return 'https://images.unsplash.com/' + id + '?w=' + (w || 1200) + '&q=70&auto=format&fit=crop'; };
var L = ['photo-1506905925346-21bda4d32df4', 'photo-1519681393784-d120267933ba', 'photo-1501785888041-af3ef285b470', 'photo-1469474968028-56623f02e42e', 'photo-1470071459604-3b5ec3a7fe05', 'photo-1507525428034-b723cf961d3e', 'photo-1464822759023-fed622ff2c3b', 'photo-1433086966358-54859d0ed716', 'photo-1426604966848-d7adac402bff', 'photo-1475924156734-496f6cac6ec1'];
var places = [['Dolomites, Italy', 'Golden hour above the clouds'], ['Yosemite, California', 'Stars over the high Sierra'], ['Lake Braies, Italy', 'Glass-still water at dawn'], ['Isle of Skye, Scotland', 'Where the light breaks through'], ['Black Forest, Germany', 'Mist between the pines'], ['Maldives', 'Turquoise to the horizon']];
var arrows = '<button class="carousel-prev"></button><button class="carousel-next"></button>';
RanjDocs.add({
  id: 'carousel',
  name: 'Carousel',
  group: 'Data Display',
  description: 'A rewritten slider with real pointer-event drag and swipe (momentum and rubber-banding), keyboard support, dots with autoplay progress, thumbnails, infinite loop, several slides per view, a centered peek layout and crossfade. Autoplay pauses on hover, focus, when offscreen and when the tab is hidden.',
  tags: ['js', 'fx'],
  keywords: ['slider', 'slideshow', 'swiper', 'gallery', 'hero slider', 'peek', 'coverflow', 'swipe'],
  demos: [
    {
      title: 'Autoplay with captions',
      description: 'Loops forever. The active dot fills while it waits, and pauses while you hover. Drag, swipe or use the arrow keys.',
      center: false,
      html: `<div class="carousel carousel-fill carousel-dots-inside carousel-arrows-hover" data-loop data-autoplay="5000" aria-label="Destinations">
  <div class="carousel-viewport">
    <div class="carousel-track">
${places.slice(0, 5).map(function (p, i) { return '      <div class="carousel-slide"><img src="' + img(L[i]) + '" alt="' + p[0] + '"><div class="carousel-caption"><b>' + p[0] + '</b><span>' + p[1] + '</span></div></div>'; }).join('\n')}
    </div>
  </div>
  ${arrows}
  <div class="carousel-dots"></div>
</div>`
    },
    {
      title: 'Centered peek',
      description: 'Inspired by Ripplix’s Centered Peek Carousel: the active card sits in the middle at full scale while its neighbours peek in, dimmed. Click a neighbour to bring it forward. <code>--peek</code> sets the card width.',
      center: false,
      pad: false,
      html: `<div class="carousel carousel-peek demo-carousel-peekwrap" data-loop aria-label="Collections">
  <div class="carousel-viewport">
    <div class="carousel-track">
${['Alpine', 'Night sky', 'Lakes', 'Highlands', 'Forest', 'Coast', 'Peaks'].map(function (t, i) { return '      <div class="carousel-slide demo-carousel-peek"><img src="' + img(L[(i + 3) % L.length], 900) + '" alt=""><div class="carousel-caption"><b>' + t + '</b><span>' + (12 + i * 7) + ' photos · Updated ' + ['today', 'yesterday', '2d ago', 'last week', 'Nov 2', 'Oct 28', 'Oct 19'][i] + '</span></div></div>'; }).join('\n')}
    </div>
  </div>
  <div class="carousel-dots"></div>
</div>`,
      css: `.demo-carousel-peekwrap { --peek: 58%; padding: 1.5rem 0; }
@media (max-width: 640px) { .demo-carousel-peekwrap { --peek: 82%; } }
.demo-carousel-peek { aspect-ratio: 16 / 10; }`
    },
    {
      title: 'Multiple per view',
      description: 'Set <code>--per-view</code> (fractions give a peek) and change it in media queries; dots and snapping adapt. Controls can sit below the track.',
      center: false,
      html: `<div class="carousel carousel-cards demo-carousel-multi" aria-label="Plans">
  <div class="carousel-viewport">
    <div class="carousel-track">
${[['Notion', 'Docs, wikis and projects', '4.8', '$10'], ['Linear', 'Issue tracking that flies', '4.9', '$8'], ['Figma', 'Design together, live', '4.7', '$15'], ['Raycast', 'Your shortcut to everything', '4.9', '$8'], ['Arc', 'A calmer browser', '4.6', 'Free'], ['Vercel', 'Ship the frontend cloud', '4.8', '$20'], ['Supabase', 'Postgres, batteries included', '4.8', '$25']].map(function (a, i) { return '      <div class="carousel-slide"><div class="carousel-card"><div class="demo-carousel-app" style="--h:' + (250 + i * 37) + '">' + a[0][0] + '</div><b>' + a[0] + '</b><p>' + a[1] + '</p><div class="demo-carousel-meta"><span>★ ' + a[2] + '</span><span>' + a[3] + ' / seat</span></div></div></div>'; }).join('\n')}
    </div>
  </div>
  <div class="carousel-controls">
    <span class="carousel-counter"></span>
    <div class="carousel-dots"></div>
    <div class="carousel-controls-arrows">${arrows}</div>
  </div>
</div>`,
      css: `.demo-carousel-multi { --per-view: 3; --gap: 1rem; }
@media (max-width: 900px) { .demo-carousel-multi { --per-view: 2.2; } }
@media (max-width: 560px) { .demo-carousel-multi { --per-view: 1.25; --gap: .75rem; } }
.demo-carousel-app { width: 2.75rem; height: 2.75rem; border-radius: .8rem; display: grid; place-items: center; font-weight: 800; font-size: 1.2rem; color: #fff; margin-bottom: 1rem; background: linear-gradient(135deg, oklch(.68 .17 var(--h)), oklch(.5 .2 calc(var(--h) + 40))); box-shadow: 0 8px 20px -8px oklch(.5 .2 var(--h)); }
.carousel-card b { font-size: 1rem; }
.carousel-card p { color: var(--muted-fg); font-size: .875rem; margin: .2rem 0 1rem; }
.demo-carousel-meta { display: flex; justify-content: space-between; font-size: .8rem; color: var(--muted-fg); border-top: 1px solid var(--border); padding-top: .75rem; }`
    },
    {
      title: 'Thumbnails',
      description: 'An empty <code>.carousel-thumbs</code> is filled from the slide images (or <code>data-thumb</code>).',
      center: false,
      html: `<div class="carousel carousel-fill" style="--ratio: 3 / 2; max-width: 720px; margin: auto" aria-label="Product photos">
  <div class="carousel-viewport">
    <div class="carousel-track">
${L.slice(2, 8).map(function (id) { return '      <div class="carousel-slide"><img src="' + img(id, 1000) + '" alt=""></div>'; }).join('\n')}
    </div>
  </div>
  ${arrows}
  <div class="carousel-thumbs"></div>
</div>`
    },
    {
      title: 'Crossfade',
      description: '<code>.carousel-fade</code> stacks the slides and crossfades with a slow Ken Burns zoom. A <code>.carousel-play</code> button toggles autoplay.',
      center: false,
      html: `<div class="carousel carousel-fade carousel-fill carousel-dots-inside" data-autoplay="4000" style="--ratio: 21 / 9; --duration: 900ms" aria-label="Featured">
  <div class="carousel-viewport">
    <div class="carousel-track">
${places.slice(2, 6).map(function (p, i) { return '      <div class="carousel-slide"><img src="' + img(L[i + 6], 1400) + '" alt="' + p[0] + '"><div class="carousel-caption"><b>' + p[0] + '</b><span>' + p[1] + '</span></div></div>'; }).join('\n')}
    </div>
  </div>
  <div class="carousel-dots"></div>
  <button class="carousel-play demo-carousel-play" aria-pressed="false" aria-label="Pause slideshow"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg></button>
</div>`,
      css: `.demo-carousel-play { position: absolute; right: 1rem; bottom: .7rem; z-index: 3; width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: 99px; color: #fff; background: rgb(0 0 0 / .35); backdrop-filter: blur(8px); }
.demo-carousel-play svg { width: .85rem; height: .85rem; }
.demo-carousel-play[aria-pressed="true"] svg { display: none; }
.demo-carousel-play[aria-pressed="true"]::before { content: ''; width: 0; height: 0; border-left: 9px solid #fff; border-top: 6px solid transparent; border-bottom: 6px solid transparent; margin-left: 2px; }`
    }
  ],
  api: [
    { name: '.carousel > .carousel-viewport > .carousel-track > .carousel-slide', type: 'class', desc: 'Structure. The viewport is created if missing.' },
    { name: '.carousel-prev / .carousel-next', type: 'class', desc: 'Arrow buttons (icons added if empty). Generated automatically when absent; data-arrows="false" disables.' },
    { name: '.carousel-dots / .carousel-thumbs / .carousel-counter', type: 'class', desc: 'Empty containers filled with dots, thumbnails (from slide images or data-thumb) and a "3 / 8" counter.' },
    { name: '.carousel-controls', type: 'class', desc: 'Row below the viewport for counter, dots and arrows (.carousel-controls-arrows).' },
    { name: '.carousel-peek', type: 'class', desc: 'Centered peek layout: active slide centered, neighbours scaled and dimmed. Width from --peek.' },
    { name: '.carousel-fade', type: 'class', desc: 'Crossfade instead of sliding.' },
    { name: '.carousel-fill', type: 'class', desc: 'Slides use aspect-ratio var(--ratio, 16/9).' },
    { name: '.carousel-dots-inside / .carousel-arrows-hover / .carousel-cards', type: 'class', desc: 'Dots over the image, arrows only on hover/focus, card slides without clipping.' },
    { name: '.carousel-caption', type: 'class', desc: 'Gradient caption overlay that slides in on the active slide.' },
    { name: '.carousel-play', type: 'class', desc: 'Optional button that pauses/resumes autoplay (aria-pressed is managed).' },
    { name: 'data-loop', type: 'attr', default: 'false', desc: 'Infinite loop using clones (seamless in both directions).' },
    { name: 'data-autoplay', type: 'attr', default: '0', desc: 'Milliseconds per slide. Pauses on hover, focus, drag, offscreen and hidden tab; disabled with reduced motion.' },
    { name: 'data-start-index / data-drag / data-dots / data-pause-on-hover', type: 'attr', default: '0 / true / true / true', desc: 'Initial slide, pointer dragging, dot generation, hover pausing.' },
    { name: '--per-view / --gap', type: 'var', default: '1 / 1rem', desc: 'Slides per view (fractions allowed, change in media queries) and spacing.' },
    { name: '--duration / --ease-carousel / --peek / --ratio / --carousel-radius', type: 'var', default: '520ms', desc: 'Slide timing, easing, peek width (72%), slide ratio, corner radius.' },
    { name: 'el.ranjCarousel', type: 'js', desc: '{ next(), prev(), goTo(i), index, count, play(), pause() }' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { index, previous, count, user }' }
  ]
});
})();

;
/* docs/registry/data-countdown.js */
RanjDocs.add({
  id: 'countdown',
  name: 'Countdown',
  group: 'Data Display',
  description: 'Live countdown to any ISO date (<code>data-to</code>) or a number of seconds. Plain, boxed, inline and a split-flap clock with real 3D flips. Fires <code>ranj:tick</code> and <code>ranj:done</code>.',
  tags: ['new', 'js'],
  keywords: ['timer', 'launch', 'flip clock', 'deadline', 'sale ends', 'clock'],
  demos: [
    {
      title: 'Launch countdown',
      html: `<div style="display:grid;gap:.75rem;justify-items:center;text-align:center">
  <span style="font-size:.8rem;font-weight:600;color:var(--primary);letter-spacing:.06em;text-transform:uppercase">Ranj UI 3.0 ships in</span>
  <div class="countdown countdown-lg" data-to="2027-01-15T17:00:00Z"></div>
</div>`
    },
    {
      title: 'Flip clock',
      description: '<code>.countdown-flip</code>: each digit is a split-flap card that folds over when it changes.',
      html: `<div class="countdown countdown-flip" data-to="2027-01-01T00:00:00"></div>`,
      height: 240
    },
    {
      title: 'Boxed',
      html: `<div class="countdown countdown-boxed" data-to="2026-12-24T18:00:00"></div>`
    },
    {
      title: 'Inline: flash sale banner',
      description: '<code>data-urgent="3600"</code> turns the numbers red in the last hour. <code>data-units="hms"</code> folds days into hours; <code>data-seconds</code> counts down from mount.',
      center: false,
      html: `<div class="demo-cd-banner">
  <span>⚡ <b>Black Friday:</b> 40% off every annual plan.</span>
  <span>Ends in <span class="countdown countdown-inline" data-seconds="8049" data-units="hms" data-urgent="3600"></span></span>
</div>`,
      css: `.demo-cd-banner { display: flex; flex-wrap: wrap; justify-content: center; gap: .35rem 1rem; padding: .8rem 1rem; border-radius: var(--radius-lg); background: var(--fg); color: var(--bg); font-size: .875rem; }`
    },
    {
      title: 'Done state',
      description: 'When time runs out the element gets <code>.is-done</code> and fires <code>ranj:done</code>.',
      html: `<div style="display:grid;gap:.6rem;justify-items:center">
  <div class="countdown countdown-boxed countdown-sm demo-cd-done" data-seconds="8" data-units="ms"></div>
  <span class="demo-cd-msg" style="font-size:.85rem;color:var(--muted-fg)">Your OTP expires soon…</span>
</div>`,
      js: `const cd = root.querySelector('.demo-cd-done');
cd.addEventListener('ranj:done', () => { root.querySelector('.demo-cd-msg').textContent = 'Code expired. Request a new one.'; });`
    }
  ],
  api: [
    { name: '.countdown[data-to]', type: 'attr', desc: 'ISO date/time to count down to (local time unless it has Z or an offset).' },
    { name: 'data-seconds', type: 'attr', desc: 'Alternative: count down this many seconds from mount.' },
    { name: 'data-units', type: 'attr', default: 'dhms', desc: 'Which units to show. Leaving out d folds days into hours.' },
    { name: 'data-labels / data-separator', type: 'attr', default: 'true / auto', desc: 'Unit labels; separator text (":" for boxed and flip).' },
    { name: 'data-urgent', type: 'attr', default: '0', desc: 'Seconds left at which .is-urgent is added (red numbers).' },
    { name: 'data-hide-zero-days', type: 'attr', default: 'false', desc: 'Drop the days unit when under 24h.' },
    { name: '.countdown-boxed / .countdown-inline / .countdown-flip', type: 'class', desc: 'Visual styles.' },
    { name: '.countdown-sm / .countdown-lg', type: 'class', desc: 'Sizes.' },
    { name: '--cd-size / --cd-gap / --flip-bg / --flip-fg / --flip-dur', type: 'var', default: '2.5rem / .75rem', desc: 'Digit size, unit spacing, flip card colors and speed.' },
    { name: 'el.ranjCountdown.set(date)', type: 'js', desc: 'Change the target.' },
    { name: 'ranj:tick', type: 'event', desc: 'Every second. detail: { remaining, days, hours, minutes, seconds }' },
    { name: 'ranj:done', type: 'event', desc: 'Once, when it reaches zero.' }
  ]
});

;
/* docs/registry/data-cta-block.js */
(function () {
  var arrow = '<svg class="block-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  RanjDocs.add({
    id: 'cta-block',
    name: 'Call to Action',
    group: 'Blocks',
    description: 'Closing call-to-action sections: a glowing gradient panel and a split newsletter / signup card.',
    tags: ['new'],
    keywords: ['cta', 'signup', 'newsletter', 'banner', 'conversion'],
    demos: [
      {
        title: 'Gradient panel',
        description: 'Follows the brand hue; try another accent in the theme customizer.',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-cta">
      <h2 class="block-title">Ship your next release this afternoon</h2>
      <p class="block-lead">Join 18,000 teams deploying on Northwind. Import a repository and go live in under a minute.</p>
      <div class="block-actions" style="margin-top:.75rem">
        <a class="block-btn block-btn-lg" href="#">Start building free ${arrow}</a>
        <a class="block-btn block-btn-lg block-btn-glass" href="#">Talk to sales</a>
      </div>
      <p class="block-cta-fine">Free forever on Hobby · No credit card required</p>
    </div>
  </div>
</section>`
      },
      {
        title: 'Split signup',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container">
    <div class="block-cta-split">
      <div class="block-head block-head-start" style="margin:0">
        <span class="block-eyebrow">Newsletter</span>
        <h2 class="block-title">The Friday Deploy</h2>
        <p class="block-lead">One email a week with product updates, performance tips and the best things our community built. 41,000 readers.</p>
      </div>
      <form class="demo-cta-block-form">
        <div class="block-form">
          <input class="block-input" type="email" placeholder="you@company.com" aria-label="Email address" required>
          <button class="block-btn block-btn-primary block-btn-lg" type="submit">Subscribe</button>
        </div>
        <p class="block-form-note">No spam. Unsubscribe with one click.</p>
      </form>
    </div>
  </div>
</section>`,
        js: `const form = root.querySelector('form');
form.addEventListener('submit', e => { e.preventDefault(); form.querySelector('button').textContent = 'Subscribed ✓'; });`
      }
    ],
    api: [
      { name: '.block-cta', type: 'class', desc: 'Centered gradient panel tinted by --hue; white buttons inside.' },
      { name: '.block-btn-glass', type: 'class', desc: 'Translucent secondary button for use on .block-cta.' },
      { name: '.block-cta-split', type: 'class', desc: 'Two-column card: copy + form.' },
      { name: '.block-form / .block-input', type: 'class', desc: 'Inline email form that wraps on narrow widths.' },
      { name: '.block-btn (+ -primary, -dark, -ghost, -lg, -block)', type: 'class', desc: 'Self-contained buttons used across all blocks.' }
    ]
  });
})();

;
/* docs/registry/data-data-table.js */
RanjDocs.add({
  id: 'data-table',
  name: 'Data Table',
  group: 'Data Display',
  description: 'A plain <code>&lt;table&gt;</code> upgraded with type-aware sorting, instant search, column visibility, row selection with select-all, pagination and a floating bulk-action bar. Or render it straight from JSON with <code>Ranj.dataTable()</code>.',
  tags: ['new', 'js'],
  keywords: ['datagrid', 'grid', 'sortable table', 'filter', 'pagination', 'bulk actions', 'tanstack'],
  demos: [
    {
      title: 'Enhanced HTML table',
      description: 'Mark sortable headers with <code>data-sort</code>; numbers, currency and dates are detected automatically. Select rows to reveal the bulk bar. Shift-click selects a range.',
      center: false,
      height: 520,
      html: `<table class="table table-hover" data-table data-page-size="5" data-bulk="Export,Send reminder,Archive">
  <thead>
    <tr>
      <th data-sort>Customer</th>
      <th data-sort>Plan</th>
      <th data-sort>Status</th>
      <th data-sort class="num">MRR</th>
      <th data-sort>Signed up</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><div class="table-cell-user"><span class="table-avatar">AK</span><div><b>Aria Kim</b><small>aria@lumenhealth.com</small></div></div></td><td>Scale</td><td><span class="table-status is-success">Active</span></td><td class="num">$2,400</td><td class="nowrap">Mar 04, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">DO</span><div><b>Daniel Okafor</b><small>dan@orbit.studio</small></div></div></td><td>Pro</td><td><span class="table-status is-warning">Past due</span></td><td class="num">$490</td><td class="nowrap">Jan 18, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">SR</span><div><b>Sofia Rossi</b><small>sofia@fernhill.ai</small></div></div></td><td>Enterprise</td><td><span class="table-status is-success">Active</span></td><td class="num">$12,000</td><td class="nowrap">Aug 22, 2025</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">ML</span><div><b>Marcus Lee</b><small>marcus@parcelkey.co</small></div></div></td><td>Starter</td><td><span class="table-status is-info">Trial</span></td><td class="num">$0</td><td class="nowrap">Nov 10, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">PN</span><div><b>Priya Nair</b><small>priya@northwind.io</small></div></div></td><td>Scale</td><td><span class="table-status is-success">Active</span></td><td class="num">$3,150</td><td class="nowrap">Jun 30, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">TB</span><div><b>Tomás Bauer</b><small>tomas@kitebase.de</small></div></div></td><td>Pro</td><td><span class="table-status is-danger">Churned</span></td><td class="num">$0</td><td class="nowrap">Feb 02, 2025</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">HY</span><div><b>Hana Yamada</b><small>hana@sora.jp</small></div></div></td><td>Pro</td><td><span class="table-status is-success">Active</span></td><td class="num">$590</td><td class="nowrap">Sep 14, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">EW</span><div><b>Elijah Ward</b><small>eli@quarry.dev</small></div></div></td><td>Enterprise</td><td><span class="table-status is-success">Active</span></td><td class="num">$8,750</td><td class="nowrap">Apr 11, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">CM</span><div><b>Camille Martin</b><small>camille@atelier.fr</small></div></div></td><td>Starter</td><td><span class="table-status is-success">Active</span></td><td class="num">$49</td><td class="nowrap">Oct 05, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">RG</span><div><b>Rahul Gupta</b><small>rahul@tiller.in</small></div></div></td><td>Scale</td><td><span class="table-status is-warning">Past due</span></td><td class="num">$1,980</td><td class="nowrap">Jul 27, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">LS</span><div><b>Lena Schmidt</b><small>lena@brightloop.io</small></div></div></td><td>Pro</td><td><span class="table-status is-success">Active</span></td><td class="num">$490</td><td class="nowrap">May 19, 2026</td></tr>
    <tr><td><div class="table-cell-user"><span class="table-avatar">JA</span><div><b>Jamal Ahmed</b><small>jamal@cobalt.ae</small></div></div></td><td>Enterprise</td><td><span class="table-status is-info">Trial</span></td><td class="num">$0</td><td class="nowrap">Nov 14, 2026</td></tr>
  </tbody>
</table>`,
      js: `const table = root.querySelector('table');
table.addEventListener('ranj:bulk', (e) => {
  Ranj.toast?.({ title: e.detail.action.replace('-', ' '), description: e.detail.count + ' customer(s)' });
});`
    },
    {
      title: 'Rendered from JSON',
      description: '<code>Ranj.dataTable(el, { columns, rows })</code> builds the table for you. <code>render</code> returns HTML for a cell while the raw value is still used for sorting and search.',
      center: false,
      height: 560,
      html: `<div class="demo-dt-json"></div>`,
      js: `const people = ['Maya Chen','Jon Rivera','Priya Nair','Leo Park','Ava Novak','Sam Okoro','Iris Lund','Noah Berg'];
const branches = ['main','feat/checkout-v2','fix/rate-limit','chore/deps','feat/ai-search','release/4.2'];
const states = [['Ready','success'],['Building','info'],['Failed','danger'],['Queued','warning'],['Canceled','']];
const rand = (i, n) => Math.abs(Math.sin(i * 97.13) * 10000) % n | 0;
const rows = Array.from({ length: 46 }, (_, i) => {
  const s = states[i % 9 === 4 ? 2 : i % 7 === 3 ? 1 : i % 11 === 6 ? 3 : i % 13 === 8 ? 4 : 0];
  return {
    id: 'dpl_' + (0x9a3f1 + i * 7919).toString(16),
    branch: branches[rand(i, branches.length)],
    author: people[rand(i + 3, people.length)],
    status: s[0], tone: s[1],
    duration: 28 + rand(i + 9, 190),
    created: new Date(Date.UTC(2026, 10, 16, 14) - i * 3.7 * 3600e3)
  };
});
const fmtDur = (s) => (s >= 60 ? Math.floor(s / 60) + 'm ' : '') + (s % 60) + 's';
const fmtDate = (d) => d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const dt = Ranj.dataTable(root.querySelector('.demo-dt-json'), {
  pageSize: 8,
  select: true,
  bulk: [{ label: 'Redeploy' }, { label: 'Delete', danger: true, onClick: (sel, t) => t.removeRows(r => sel.includes(r)) }],
  searchPlaceholder: 'Filter deployments…',
  columns: [
    { key: 'id', label: 'Deployment', render: (v) => '<span class="mono">' + v + '</span>' },
    { key: 'branch', label: 'Branch', render: (v) => '<span class="nowrap">' + v + '</span>' },
    { key: 'author', label: 'Author', render: (v) => '<div class="table-cell-user"><span class="table-avatar">' + v.split(' ').map(p => p[0]).join('') + '</span><b>' + v + '</b></div>' },
    { key: 'status', label: 'Status', render: (v, r) => '<span class="table-status ' + (r.tone ? 'is-' + r.tone : '') + '">' + v + '</span>' },
    { key: 'duration', label: 'Duration', type: 'number', render: fmtDur },
    { key: 'created', label: 'Created', type: 'date', render: (v) => '<span class="nowrap muted">' + fmtDate(v) + '</span>' }
  ],
  rows
});
dt.sortBy(5, 'desc');`
    },
    {
      title: 'Sort only, compact',
      description: 'Turn features off with <code>data-search="false"</code>, <code>data-columns-menu="false"</code>, <code>data-pagination="false"</code>. <code>data-sort-all</code> makes every column sortable.',
      center: false,
      html: `<table class="table table-compact table-striped" data-table data-sort-all data-search="false" data-columns-menu="false" data-pagination="false">
  <thead><tr><th>Ticker</th><th>Company</th><th class="num">Price</th><th class="num">Change</th><th class="num">Market cap</th></tr></thead>
  <tbody>
    <tr><td class="mono">NVDA</td><td>NVIDIA</td><td class="num">$184.20</td><td class="num pos">+2.41%</td><td class="num">4.48T</td></tr>
    <tr><td class="mono">AAPL</td><td>Apple</td><td class="num">$268.05</td><td class="num neg">−0.62%</td><td class="num">3.97T</td></tr>
    <tr><td class="mono">MSFT</td><td>Microsoft</td><td class="num">$511.34</td><td class="num pos">+0.88%</td><td class="num">3.80T</td></tr>
    <tr><td class="mono">AMZN</td><td>Amazon</td><td class="num">$232.87</td><td class="num pos">+1.15%</td><td class="num">2.48T</td></tr>
    <tr><td class="mono">TSLA</td><td>Tesla</td><td class="num">$402.10</td><td class="num neg">−3.27%</td><td class="num">1.29T</td></tr>
  </tbody>
</table>`
    },
    {
      title: 'Empty state',
      description: 'When a search matches nothing the table shows a friendly message with a reset button.',
      center: false,
      html: `<table class="table" data-table data-page-size="5" data-search-placeholder="Search team…">
  <thead><tr><th data-sort>Name</th><th data-sort>Role</th><th data-sort>Location</th></tr></thead>
  <tbody>
    <tr><td>Maya Chen</td><td>Engineering Manager</td><td>San Francisco</td></tr>
    <tr><td>Jon Rivera</td><td>Product Designer</td><td>Lisbon</td></tr>
    <tr><td>Priya Nair</td><td>Staff Engineer</td><td>Bengaluru</td></tr>
  </tbody>
</table>`,
      js: `setTimeout(() => {
  const input = root.querySelector('.dt-search input');
  if (input) { input.value = 'kubernetes'; input.dispatchEvent(new Event('input', { bubbles: true })); }
}, 120);`
    }
  ],
  api: [
    { name: 'table[data-table]', type: 'attr', desc: 'Enhances the table. It is wrapped in .data-table > .table-wrapper automatically (existing wrappers are reused).' },
    { name: 'th[data-sort]', type: 'attr', desc: 'Makes a column sortable (click cycles ascending, descending, none). data-sort="asc|desc" sets the initial order.' },
    { name: 'th[data-type]', type: 'attr', default: 'auto', desc: 'number | date | text. Auto-detected from cell text ($1,200, 4.2k, −3%, Nov 12, 2026…).' },
    { name: 'th[data-hidden] / th[data-hideable="false"]', type: 'attr', desc: 'Start a column hidden / keep it out of the Columns menu.' },
    { name: 'td[data-value]', type: 'attr', desc: 'Raw value used for sorting instead of the cell text.' },
    { name: 'data-sort-all', type: 'attr', desc: 'Every column is sortable.' },
    { name: 'data-page-size', type: 'attr', default: '10', desc: 'Rows per page. data-page-sizes="5,10,20,50" sets the selector options.' },
    { name: 'data-pagination / data-search / data-columns-menu', type: 'attr', default: 'true', desc: 'Set to "false" to turn a feature off.' },
    { name: 'data-select', type: 'attr', default: 'false', desc: 'Adds a checkbox column with select-all (indeterminate when partial). Implied by data-bulk.' },
    { name: 'data-bulk', type: 'attr', desc: 'Comma-separated bulk actions, e.g. "Export,Archive,Delete". Delete/Remove/Archive are styled as destructive.' },
    { name: 'data-search-placeholder', type: 'attr', default: 'Search…', desc: 'Search input placeholder.' },
    { name: 'Ranj.dataTable(el, opts)', type: 'js', desc: 'Render from JSON: { columns: [{ key, label, type, render(v,row), sortable, hidden, hideable, align, width }], rows, pageSize, select, bulk: [{ label, danger, onClick(rows, table) }], searchPlaceholder, maxHeight }. Returns the instance.' },
    { name: 'instance methods', type: 'js', desc: 'sortBy(col, "asc"|"desc"|"none"), search(q), goTo(page), setPageSize(n), selectAll(bool), getSelected(), setColumn(i|key, visible), removeRows(fn), setRows(rows) (JSON tables), destroy().' },
    { name: 'ranj:sort', type: 'event', desc: 'detail: { key, column, dir }' },
    { name: 'ranj:search', type: 'event', desc: 'detail: { query, count }' },
    { name: 'ranj:page', type: 'event', desc: 'detail: { page, pageSize, pages }' },
    { name: 'ranj:select', type: 'event', desc: 'detail: { rows, count }' },
    { name: 'ranj:bulk', type: 'event', desc: 'detail: { action, rows, count }. Cancelable: preventDefault() skips the action’s onClick.' },
    { name: 'ranj:columns', type: 'event', desc: 'detail: { key, visible, hidden }' }
  ]
});

;
/* docs/registry/data-donut-chart.js */
RanjDocs.add({
  id: 'donut-chart',
  name: 'Donut & Pie Chart',
  group: 'Data Display',
  description: 'Donut or pie chart with an interactive legend and a center label that follows the hovered slice.',
  tags: ['new', 'js'],
  keywords: ['pie chart', 'ring chart', 'share', 'breakdown', 'composition'],
  demos: [
    {
      title: 'Revenue by region',
      center: false,
      html: `<div class="chart-card" style="max-width:620px;margin:auto">
  <div class="chart-head"><div><div class="chart-title">Revenue by region</div><div class="chart-sub">Q3 2026 · hover a slice or a row</div></div></div>
  <div class="donut-chart" data-format="currency" data-label="Total revenue"
    data-labels="North America,Europe,Asia Pacific,Latin America,Middle East"
    data-values="482300,318900,204600,86400,41200"></div>
</div>`
    },
    {
      title: 'Pie with legend below',
      center: false,
      html: `<div class="chart-card" style="max-width:340px;margin:auto">
  <div class="chart-title" style="margin-bottom:1rem">Traffic by browser</div>
  <div class="donut-chart" data-pie data-size="180" data-legend="bottom" data-suffix="%"
    data-labels="Chrome,Safari,Edge,Firefox,Other" data-values="64.2,19.8,7.1,5.4,3.5"
    data-colors="chart-1,chart-2,chart-3,chart-4,muted-fg"></div>
</div>`
    },
    {
      title: 'Compact, no legend',
      html: `<div class="demo-donut-row">
  <div class="demo-donut-item"><div class="donut-chart" data-size="120" data-thickness="12" data-legend="none" data-label="of 2 TB" data-value="68%" data-labels="Used,Free" data-values="1360,640" data-colors="chart-1,border" data-suffix=" GB"></div><b>Storage</b></div>
  <div class="demo-donut-item"><div class="donut-chart" data-size="120" data-thickness="12" data-legend="none" data-label="tickets" data-labels="Resolved,Pending,Escalated" data-values="412,86,23" data-colors="success,warning,destructive"></div><b>Support</b></div>
  <div class="demo-donut-item"><div class="donut-chart" data-size="120" data-thickness="12" data-legend="none" data-label="seats" data-labels="Active,Invited,Idle" data-values="148,22,30" data-colors="chart-3,chart-4,chart-7"></div><b>Licenses</b></div>
</div>`,
      css: `.demo-donut-row { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; }
.demo-donut-item { display: grid; justify-items: center; gap: .6rem; font-size: .85rem; }
.demo-donut-item .donut-chart { width: 120px; }`
    }
  ],
  api: [
    { name: '.donut-chart', type: 'class', desc: 'Host element.' },
    { name: 'data-values', type: 'attr', desc: 'Comma-separated slice values.' },
    { name: 'data-labels', type: 'attr', desc: 'Comma-separated slice names.' },
    { name: 'data-colors', type: 'attr', desc: 'Optional comma-separated colors (token names or CSS); defaults to --chart-1…8.' },
    { name: 'data-pie', type: 'attr', default: 'false', desc: 'Render a full pie instead of a ring.' },
    { name: 'data-size', type: 'attr', default: '200', desc: 'Diameter in px (shrinks to fit).' },
    { name: 'data-thickness', type: 'attr', default: '12% of size', desc: 'Ring thickness in px.' },
    { name: 'data-label', type: 'attr', default: 'Total', desc: 'Caption under the center value.' },
    { name: 'data-value', type: 'attr', desc: 'Override the center value text (defaults to the formatted total).' },
    { name: 'data-legend', type: 'attr', default: 'auto', desc: 'right | bottom | none; auto picks right when there is room.' },
    { name: 'data-gap', type: 'attr', default: '0.7', desc: 'Gap between slices, in percent of the circle.' },
    { name: 'data-format', type: 'attr', desc: 'number | currency | percent | compact, plus prefix/suffix/decimals.' },
    { name: 'Ranj.chart.donut(el, opts)', type: 'js', desc: 'Set options and render.' }
  ]
});

;
/* docs/registry/data-faq-block.js */
(function () {
  var items = [
    ['Can I try Northwind before paying?', 'Yes. Every paid plan starts with a 14-day trial with full Pro features. No credit card is needed, and your projects keep running on Hobby if you decide not to upgrade.'],
    ['How does per-seat billing work?', 'You pay for members who can deploy or change settings. Viewers, commenters and guests on preview links are always free. Seats are prorated to the day.'],
    ['What happens if I go over my bandwidth?', 'Nothing breaks. We email you at 80% and 100%, then bill overage at $0.06 per GB. You can set a hard spend cap in Settings → Billing.'],
    ['Do you offer discounts for startups and non-profits?', 'Startups under $5M raised get 50% off Pro for the first year, and registered non-profits get Team for free. <a href="#">Apply here</a>.'],
    ['Where is my data stored?', 'In the region you choose when creating a project: US East, EU Frankfurt or Asia Singapore. Data never leaves that region without your explicit permission.'],
    ['Can I cancel anytime?', 'Of course. Downgrade from the billing page in two clicks; you keep paid features until the end of the current period and get a prorated refund on yearly plans.']
  ];
  function list(n, open) {
    return items.slice(0, n).map(function (it, i) {
      return `      <details${i === 0 && open ? ' open' : ''}>
        <summary>${it[0]}</summary>
        <div class="block-faq-body">${it[1]}</div>
      </details>`;
    }).join('\n');
  }
  RanjDocs.add({
    id: 'faq-block',
    name: 'FAQ',
    group: 'Blocks',
    description: 'Frequently asked questions built on native <details>/<summary>: no JavaScript, keyboard accessible, with an animated plus icon.',
    tags: ['new'],
    keywords: ['questions', 'help', 'details', 'summary', 'accordion section'],
    demos: [
      {
        title: 'Cards',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow">FAQ</span>
      <h2 class="block-title">Questions, answered</h2>
      <p class="block-lead">Everything about plans, billing and data. Can't find it? Chat with us, we reply in about 4 minutes.</p>
    </div>
    <div class="block-faq">
${list(5, true)}
    </div>
  </div>
</section>`
      },
      {
        title: 'Split with contact',
        description: 'Add <code>.block-faq-flush</code> for divider-only rows.',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container block-faq-split">
    <div>
      <div class="block-head block-head-start" style="margin-bottom:0">
        <h2 class="block-title">Frequently asked questions</h2>
        <p class="block-lead">Billing, security and everything in between.</p>
      </div>
      <div class="block-faq-contact">
        <span class="block-avatar">JL</span>
        <div><b>Still have questions?</b>Talk to Julia from our support team at <a href="#">help@northwind.dev</a>.</div>
      </div>
    </div>
    <div class="block-faq block-faq-flush">
${list(6, false)}
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-faq', type: 'class', desc: 'Stack of <details> elements styled as cards.' },
      { name: '.block-faq-flush', type: 'class', desc: 'Divider-only rows instead of cards.' },
      { name: '.block-faq-body', type: 'class', desc: 'Answer content inside each <details>.' },
      { name: '.block-faq-split', type: 'class', desc: 'Heading column + questions column layout.' },
      { name: 'open', type: 'attr', desc: 'Native attribute on <details> to start expanded. Add name="faq" to make them exclusive (Chrome 120+, Safari 17.2+).' }
    ]
  });
})();

;
/* docs/registry/data-features-block.js */
(function () {
  function ic(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var I = {
    bolt: ic('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
    shield: ic('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>'),
    globe: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    branch: ic('<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7v10M18 10c0 4-6 3-12 7"/>'),
    chart: ic('<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>'),
    lock: ic('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    sparkle: ic('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
    layers: ic('<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>')
  };
  var arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function f(icon, tone, t, d) { return `      <article class="block-feature">
        <div class="block-icon" data-tone="${tone}">${I[icon]}</div>
        <h3>${t}</h3>
        <p>${d}</p>
      </article>`; }
  RanjDocs.add({
    id: 'features-block',
    name: 'Features',
    group: 'Blocks',
    description: 'Feature sections: an icon card grid, a bento layout with visuals, and a compact two-column list.',
    tags: ['new'],
    keywords: ['feature grid', 'bento', 'benefits', 'services'],
    demos: [
      {
        title: 'Icon grid',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow">Platform</span>
      <h2 class="block-title">Everything you need to ship faster</h2>
      <p class="block-lead">From the first commit to millions of requests, Northwind handles the infrastructure so your team can focus on the product.</p>
    </div>
    <div class="block-features">
${f('bolt', 0, 'Instant deploys', 'Push to main and go live in under 20 seconds with incremental builds and smart caching.')}
${f('globe', 1, 'Global edge network', 'Serve every request from 42 regions with automatic failover and 12 ms median latency.')}
${f('branch', 2, 'Preview every PR', 'Each pull request gets its own URL, seeded database and shareable comments.')}
${f('shield', 3, 'Secure by default', 'Managed TLS, DDoS protection and SOC 2 Type II controls on every plan.')}
${f('chart', 4, 'Real-time analytics', 'Core Web Vitals, traffic and error rates without adding a single script.')}
${f('lock', 5, 'Granular access', 'Roles, SSO and audit logs so the right people touch the right things.')}
    </div>
  </div>
</section>`
      },
      {
        title: 'Bento',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container">
    <div class="block-head block-head-start">
      <span class="block-eyebrow">Why teams switch</span>
      <h2 class="block-title">Built for the way you actually work</h2>
    </div>
    <div class="block-bento">
      <article class="block-feature span-4">
        <div class="block-visual block-visual-grid">
          <div class="demo-features-block-bars"><i style="--h:38%"></i><i style="--h:52%"></i><i style="--h:44%"></i><i style="--h:68%"></i><i style="--h:60%"></i><i style="--h:82%"></i><i style="--h:74%"></i><i style="--h:94%"></i></div>
        </div>
        <div class="block-feature-body">
          <h3>Analytics that answer questions</h3>
          <p>Slice revenue, retention and funnels by any property. Results in under 200 ms, even on billions of events.</p>
        </div>
      </article>
      <article class="block-feature span-2">
        <div class="block-visual"><div class="demo-features-block-orb">${I.sparkle}</div></div>
        <div class="block-feature-body">
          <h3>AI summaries</h3>
          <p>A plain-English digest of what changed every Monday.</p>
        </div>
      </article>
      <article class="block-feature span-3">
        <div class="block-feature-body">
          <div class="block-icon" data-tone="2">${I.layers}</div>
          <h3>Workspaces for every team</h3>
          <p>Separate data, dashboards and permissions for marketing, product and finance, with one bill.</p>
          <a class="block-link" href="#">Learn about workspaces ${arrow}</a>
        </div>
      </article>
      <article class="block-feature span-3">
        <div class="block-feature-body">
          <div class="block-icon" data-tone="4">${I.shield}</div>
          <h3>Enterprise-grade privacy</h3>
          <p>EU data residency, field-level encryption and automatic PII redaction, all on by default.</p>
          <a class="block-link" href="#">Read the security whitepaper ${arrow}</a>
        </div>
      </article>
    </div>
  </div>
</section>`,
        css: `.demo-features-block-bars { position: absolute; inset: 1.5rem 1.5rem 0; display: flex; align-items: flex-end; gap: 6%; }
.demo-features-block-bars i { flex: 1; height: var(--h); border-radius: 6px 6px 0 0; background: linear-gradient(180deg, var(--primary), color-mix(in oklab, var(--primary) 30%, transparent)); opacity: .85; }
.demo-features-block-bars i:nth-child(odd) { opacity: .45; }
.demo-features-block-orb { position: absolute; inset: 0; display: grid; place-items: center; }
.demo-features-block-orb svg { width: 4.5rem; height: 4.5rem; padding: 1.1rem; border-radius: 50%; color: #fff; background: radial-gradient(circle at 30% 30%, oklch(0.75 0.17 calc(var(--hue) + 60)), var(--primary)); box-shadow: 0 0 0 10px color-mix(in oklab, var(--primary) 12%, transparent), 0 0 0 22px color-mix(in oklab, var(--primary) 6%, transparent), 0 20px 40px -10px var(--primary); }`
      },
      {
        title: 'Two-column list',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head block-head-start">
      <h2 class="block-title">Less glue code. More product.</h2>
      <p class="block-lead">The boring parts, handled.</p>
    </div>
    <div class="block-features-list">
      <article class="block-feature"><div class="block-icon">${I.bolt}</div><div><h3>Background jobs</h3><p>Retries, cron and fan-out queues with a dashboard you will actually open.</p></div></article>
      <article class="block-feature"><div class="block-icon">${I.lock}</div><div><h3>Auth in one line</h3><p>Passkeys, magic links and OAuth for 30 providers, with session management built in.</p></div></article>
      <article class="block-feature"><div class="block-icon">${I.layers}</div><div><h3>Typed database</h3><p>Postgres with branching, migrations and generated TypeScript types on every push.</p></div></article>
      <article class="block-feature"><div class="block-icon">${I.chart}</div><div><h3>Usage-based billing</h3><p>Meter anything, invoice through Stripe, and show customers live usage.</p></div></article>
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-features', type: 'class', desc: 'Responsive 3 / 2 / 1 column grid of .block-feature cards.' },
      { name: '.block-feature', type: 'class', desc: 'Card with hover lift and a brand-tinted glow.' },
      { name: '.block-icon', type: 'class', desc: 'Tinted icon tile. data-tone="1…5" rotates the hue for variety.' },
      { name: '.block-bento + .span-2/.span-3/.span-4', type: 'class', desc: 'Six-column bento grid; collapses to one column under 760px.' },
      { name: '.block-visual / .block-visual-grid', type: 'class', desc: 'Art area at the top of a bento card.' },
      { name: '.block-features-list', type: 'class', desc: 'Icon-left, borderless two-column list.' },
      { name: '.block-head / .block-head-start', type: 'class', desc: 'Centered or left-aligned section heading with .block-eyebrow, .block-title, .block-lead.' }
    ]
  });
})();

;
/* docs/registry/data-footer-block.js */
(function () {
  function ic(p) { return '<svg viewBox="0 0 24 24" fill="currentColor">' + p + '</svg>'; }
  var S = {
    x: ic('<path d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.4L5.4 21H2.3l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.3 4.7H5.5z"/>'),
    gh: ic('<path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/>'),
    li: ic('<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/>'),
    yt: ic('<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/>')
  };
  var mark = '<span class="block-brand-mark"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></span>';
  var socials = '<div class="block-socials"><a href="#" aria-label="X">' + S.x + '</a><a href="#" aria-label="GitHub">' + S.gh + '</a><a href="#" aria-label="LinkedIn">' + S.li + '</a><a href="#" aria-label="YouTube">' + S.yt + '</a></div>';
  function col(t, links) { return '      <nav aria-label="' + t + '"><h4>' + t + '</h4><ul>' + links.map(function (l) { return '<li><a href="#">' + l + '</a></li>'; }).join('') + '</ul></nav>'; }
  var cols = [
    col('Product', ['Deployments', 'Edge functions', 'Analytics <span class="block-new">New</span>', 'Storage', 'Pricing']),
    col('Resources', ['Documentation', 'Guides', 'Changelog', 'Templates', 'Status']),
    col('Company', ['About', 'Customers', 'Careers', 'Blog', 'Press kit']),
    col('Legal', ['Privacy', 'Terms', 'DPA', 'Security', 'Cookies'])
  ].join('\n');
  RanjDocs.add({
    id: 'footer-block',
    name: 'Footer',
    group: 'Blocks',
    description: 'Site footers: a full multi-column footer with newsletter, status and socials, and a minimal centered one.',
    tags: ['new'],
    keywords: ['site footer', 'sitemap', 'bottom navigation', 'links'],
    demos: [
      {
        title: 'Multi-column with newsletter',
        pad: false, center: false,
        html: `<footer class="block block-footer">
  <div class="block-container">
    <div class="block-footer-news">
      <div><h3>Get the Friday Deploy</h3><p>Product updates and performance tips, once a week.</p></div>
      <form class="block-form"><input class="block-input" type="email" placeholder="you@company.com" aria-label="Email address"><button class="block-btn block-btn-primary block-btn-lg" type="button">Subscribe</button></form>
    </div>
    <div class="block-footer-grid">
      <div class="block-footer-brand">
        <a class="block-brand" href="#">${mark}Northwind</a>
        <p>The frontend cloud for teams who ship daily. Made with care in Lisbon, Brooklyn and Bengaluru.</p>
        <span class="block-status">All systems operational</span>
      </div>
${cols}
    </div>
    <div class="block-footer-bottom">
      <span>© 2026 Northwind Labs, Inc. All rights reserved.</span>
      ${socials}
    </div>
    <div class="block-footer-big" aria-hidden="true">northwind</div>
  </div>
</footer>`
      },
      {
        title: 'Minimal centered',
        pad: false, center: false,
        html: `<footer class="block block-footer">
  <div class="block-container block-footer-simple">
    <a class="block-brand" href="#">${mark}Northwind</a>
    <nav aria-label="Footer"><a href="#">Product</a><a href="#">Pricing</a><a href="#">Docs</a><a href="#">Blog</a><a href="#">Careers</a><a href="#">Contact</a></nav>
    ${socials}
    <small>© 2026 Northwind Labs, Inc. · <a href="#">Privacy</a> · <a href="#">Terms</a></small>
  </div>
</footer>`
      }
    ],
    api: [
      { name: '.block-footer', type: 'class', desc: 'Footer section (on .block) with subtle background and top border.' },
      { name: '.block-footer-grid', type: 'class', desc: 'Brand column + four link columns; 4 → 2 columns on narrow widths.' },
      { name: '.block-footer-news', type: 'class', desc: 'Newsletter row above the link grid.' },
      { name: '.block-footer-bottom', type: 'class', desc: 'Copyright + socials bar.' },
      { name: '.block-footer-big', type: 'class', desc: 'Oversized faded wordmark.' },
      { name: '.block-footer-simple', type: 'class', desc: 'Minimal centered footer.' },
      { name: '.block-brand / .block-brand-mark', type: 'class', desc: 'Logo lockup with gradient mark.' },
      { name: '.block-socials / .block-status / .block-new', type: 'class', desc: 'Social icon buttons, live status pill, “New” tag.' }
    ]
  });
})();

;
/* docs/registry/data-gallery.js */
(function () {
var u = function (id, w, h) { return 'https://images.unsplash.com/' + id + '?w=' + w + (h ? '&h=' + h : '') + '&q=70&auto=format&fit=crop'; };
var P = [
  ['photo-1506905925346-21bda4d32df4', 'Seceda ridgeline', 'Dolomites · f/8 · 1/250s', 800, 1000],
  ['photo-1519681393784-d120267933ba', 'Milky Way over the Sierra', 'Yosemite · 25s · ISO 3200', 800, 560],
  ['photo-1501785888041-af3ef285b470', 'Lago di Braies', 'South Tyrol · f/11', 800, 600],
  ['photo-1469474968028-56623f02e42e', 'First light, Isle of Skye', 'Scotland · f/5.6', 800, 1100],
  ['photo-1470071459604-3b5ec3a7fe05', 'Fog in the pines', 'Black Forest · f/4', 800, 540],
  ['photo-1507525428034-b723cf961d3e', 'Low tide', 'Maldives · f/9', 800, 900],
  ['photo-1464822759023-fed622ff2c3b', 'Cloud sea', 'Mont Blanc · f/8', 800, 620],
  ['photo-1433086966358-54859d0ed716', 'Skógafoss', 'Iceland · 1/2s', 800, 1050],
  ['photo-1426604966848-d7adac402bff', 'Valley floor', 'Yosemite · f/10', 800, 560]
];
function item(p, cls, big) {
  return '  <a class="gallery-item' + (cls ? ' ' + cls : '') + '" href="' + u(p[0], 1800) + '"><img src="' + u(p[0], big ? 1000 : 600, p[4] && !big ? Math.round(600 * p[4] / p[3]) : 0) + '" alt="' + p[1] + '" loading="lazy"><span class="gallery-caption">' + p[1] + '<small>' + p[2] + '</small></span></a>';
}
RanjDocs.add({
  id: 'gallery',
  name: 'Gallery',
  group: 'Data Display',
  description: 'Responsive image grids (uniform, masonry, bento) with hover captions and a built-in lightbox: the photo zooms out of its thumbnail, then arrows, swipe, keyboard, thumbnails and swipe-down-to-close. Focus is trapped and returned; Escape closes.',
  tags: ['new', 'js', 'fx'],
  keywords: ['lightbox', 'photos', 'masonry', 'image grid', 'portfolio', 'bento', 'viewer', 'zoom'],
  demos: [
    {
      title: 'Masonry',
      description: 'Click any photo. Use ← → to browse, Escape to close, or swipe on touch.',
      center: false,
      html: `<div class="gallery gallery-masonry" data-gallery aria-label="Landscapes" style="--gallery-min: 13rem">
${P.map(function (p) { return item(p); }).join('\n')}
</div>`
    },
    {
      title: 'Bento',
      description: 'The first item spans 2×2; add <code>.is-wide</code> or <code>.is-tall</code> to others. <code>.gallery-more</code> with <code>data-more</code> shows a “+12” overlay.',
      center: false,
      html: `<div class="gallery gallery-bento" data-gallery aria-label="Trip highlights">
${item(P[0], '', true)}
${item(P[2], 'is-wide', true)}
${item(P[4], '', false)}
${item(P[6], '', false)}
${item(P[1], 'is-wide', true)}
${item(P[8], 'gallery-more', false).replace('class="gallery-item gallery-more"', 'class="gallery-item gallery-more" data-more="+12"')}
${item(P[5], '', false)}
</div>`
    },
    {
      title: 'Uniform grid',
      description: 'Square tiles with <code>--gallery-ratio: 1</code>. <code>data-loop="false"</code> stops at the ends; <code>data-thumbs="false"</code> hides the filmstrip.',
      center: false,
      html: `<div class="gallery" data-gallery data-loop="false" style="--gallery-min: 9rem; --gallery-ratio: 1; --gallery-gap: .5rem; --gallery-radius: var(--radius)" aria-label="Product shots">
${P.slice(0, 6).map(function (p) { return '  <a class="gallery-item" href="' + u(p[0], 1600) + '" data-caption="' + p[1] + '"><img src="' + u(p[0], 400, 400) + '" alt="' + p[1] + '" loading="lazy"></a>'; }).join('\n')}
</div>`
    }
  ],
  api: [
    { name: '[data-gallery]', type: 'attr', desc: 'Enables the lightbox for .gallery-item (or [data-lightbox]) children.' },
    { name: '.gallery', type: 'class', desc: 'Auto-fill grid with --gallery-ratio tiles.' },
    { name: '.gallery-masonry / .gallery-bento', type: 'class', desc: 'Column masonry with natural heights; bento grid (first item 2×2).' },
    { name: '.gallery-item / .gallery-caption', type: 'class', desc: 'Tile (an a with href to the full image, or any element with data-src) and its hover caption.' },
    { name: '.is-wide / .is-tall / .gallery-more[data-more]', type: 'class', desc: 'Bento spans; "+N more" overlay.' },
    { name: 'data-src / data-caption', type: 'attr', desc: 'On an item: full-size source (defaults to href, then img src) and lightbox caption (defaults to .gallery-caption, then alt).' },
    { name: 'data-loop / data-thumbs', type: 'attr', default: 'true / true', desc: 'Wrap around at the ends; show the thumbnail strip.' },
    { name: '--gallery-min / --gallery-gap / --gallery-ratio / --gallery-radius', type: 'var', default: '12rem / .75rem / 4/3', desc: 'Column min width, gap, tile ratio, corner radius.' },
    { name: 'Ranj.lightbox(root, index)', type: 'js', desc: 'Open the viewer programmatically. Returns { close(), show(i) }. Also el.ranjGallery.open(i).' },
    { name: 'ranj:open / ranj:change / ranj:close', type: 'event', desc: 'On the gallery. detail: { index, item }' }
  ]
});
})();

;
/* docs/registry/data-gauge.js */
RanjDocs.add({
  id: 'gauge',
  name: 'Gauge',
  group: 'Data Display',
  description: 'Radial progress as a full ring, a 270° arc or a half dial. The value counts up as the arc sweeps in.',
  tags: ['new', 'js'],
  keywords: ['radial progress', 'progress ring', 'dial', 'meter', 'score'],
  demos: [
    {
      title: 'Ring, arc and half',
      html: `<div class="demo-gauge-row">
  <div class="chart-card demo-gauge-card"><div class="gauge" data-value="72" data-label="Quota reached" data-color="chart-1"></div><div class="chart-sub">$1.08M of $1.5M</div></div>
  <div class="chart-card demo-gauge-card"><div class="gauge" data-type="arc" data-value="94" data-suffix="" data-label="Performance" data-color="success"></div><div class="chart-sub">Lighthouse, mobile</div></div>
  <div class="chart-card demo-gauge-card"><div class="gauge" data-type="half" data-value="63" data-label="CPU load" data-color="warning" data-size="180"></div><div class="chart-sub">8 cores · us-east-1</div></div>
</div>`,
      css: `.demo-gauge-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; }
.demo-gauge-card { display: grid; justify-items: center; gap: .5rem; min-width: 200px; }`
    },
    {
      title: 'Sizes and colors',
      html: `<div class="demo-gauge-goals">
  <div><div class="gauge" data-size="96" data-value="82" data-color="chart-1"></div><span>Onboarding</span></div>
  <div><div class="gauge" data-size="96" data-value="45" data-color="chart-4"></div><span>Activation</span></div>
  <div><div class="gauge" data-size="96" data-value="91" data-color="chart-3"></div><span>Retention</span></div>
  <div><div class="gauge" data-size="96" data-value="28" data-color="chart-5"></div><span>Expansion</span></div>
  <div><div class="gauge" data-size="64" data-thickness="6" data-value="60" data-color="chart-2" data-text="3/5"></div><span>Tasks</span></div>
</div>`,
      css: `.demo-gauge-goals { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1.5rem 2rem; }
.demo-gauge-goals > div { display: grid; justify-items: center; gap: .4rem; font-size: .8rem; color: var(--muted-fg); }`
    },
    {
      title: 'Live value',
      description: 'Update data-value and the gauge re-renders.',
      html: `<div class="chart-card demo-gauge-card" style="min-width:260px">
  <div class="gauge" data-type="arc" data-size="200" data-value="38" data-label="Disk usage" data-color="info" data-static></div>
  <input type="range" min="0" max="100" value="38" aria-label="Disk usage" style="width:100%;accent-color:var(--primary)">
</div>`,
      css: `.demo-gauge-card { display: grid; justify-items: center; gap: .75rem; }`,
      js: `const g = root.querySelector('.gauge');
root.querySelector('input').oninput = (e) => {
  const v = +e.target.value;
  g.dataset.value = v;
  g.dataset.color = v > 85 ? 'destructive' : v > 65 ? 'warning' : 'info';
};`
    }
  ],
  api: [
    { name: '.gauge', type: 'class', desc: 'Host element (inline-flex).' },
    { name: 'data-value', type: 'attr', default: '0', desc: 'Current value.' },
    { name: 'data-min / data-max', type: 'attr', default: '0 / 100', desc: 'Range.' },
    { name: 'data-type', type: 'attr', default: 'ring', desc: 'ring (360°) | arc (270°) | half (180°, shows min/max).' },
    { name: 'data-size', type: 'attr', default: '160', desc: 'Diameter in px.' },
    { name: 'data-thickness', type: 'attr', default: '8.5% of size', desc: 'Stroke width in px.' },
    { name: 'data-color', type: 'attr', default: 'primary', desc: 'Token name (success, chart-3 …) or CSS color.' },
    { name: 'data-label', type: 'attr', desc: 'Caption under the value.' },
    { name: 'data-text', type: 'attr', desc: 'Replace the center number with custom text.' },
    { name: 'data-suffix', type: 'attr', default: '%', desc: 'Suffix after the value; also data-prefix, data-format, data-decimals.' },
    { name: 'data-static', type: 'attr', desc: 'Skip the sweep / count-up animation.' },
    { name: 'Ranj.chart.gauge(el, opts)', type: 'js', desc: 'Set options and render.' }
  ]
});

;
/* docs/registry/data-heatmap.js */
RanjDocs.add({
  id: 'heatmap',
  name: 'Heatmap Calendar',
  group: 'Data Display',
  description: 'GitHub-style contribution calendar: one cell per day, five intensity levels, month and weekday labels, tooltips. Scrolls horizontally on small screens.',
  tags: ['new', 'js'],
  keywords: ['contribution graph', 'calendar heatmap', 'activity', 'streak'],
  demos: [
    {
      title: 'Contributions',
      description: 'Without data-values a deterministic sample is generated from data-seed.',
      center: false,
      html: `<div class="chart-card" style="max-width:860px;margin:auto">
  <div class="chart-head"><div><div class="chart-title">Activity</div><div class="chart-sub">Commits, reviews and merged pull requests</div></div></div>
  <div class="heatmap" data-seed="42" data-end="2026-11-14"></div>
</div>`
    },
    {
      title: 'Custom color and range',
      center: false,
      html: `<div class="demo-heatmap-grid">
  <div class="chart-card">
    <div class="chart-title" style="margin-bottom:.75rem">Production deploys · last 26 weeks</div>
    <div class="heatmap" data-weeks="26" data-seed="9" data-end="2026-11-14" data-color="success" data-label="deploys"></div>
  </div>
  <div class="chart-card">
    <div class="chart-title" style="margin-bottom:.75rem">Incidents · last 26 weeks</div>
    <div class="heatmap" data-weeks="26" data-seed="3" data-end="2026-11-14" data-color="destructive" data-label="incidents" data-summary="true"></div>
  </div>
</div>`,
      css: `.demo-heatmap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(330px, 1fr)); gap: 1rem; width: 100%; }
@media (max-width: 420px) { .demo-heatmap-grid { grid-template-columns: 1fr; } }`
    },
    {
      title: 'From your data',
      description: 'data-values is one number per day, oldest first, ending on data-end (default: today).',
      center: false,
      html: `<div class="chart-card" style="max-width:520px;margin:auto">
  <div class="chart-title" style="margin-bottom:.75rem">Workouts</div>
  <div class="heatmap" data-weeks="12" data-cell="14" data-color="chart-6" data-label="workouts" data-end="2026-11-14" data-legend="false"
    data-values="1,0,1,0,1,1,0,1,0,1,1,0,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,0,1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1,1,0,1,0,1,2,0,1,1,1,0,0,1,2,1,0,1,1,0,1,1,1,0,2,1,0,1,1,1,0,1,2,1,1,0,1"></div>
</div>`
    }
  ],
  api: [
    { name: '.heatmap', type: 'class', desc: 'Host element.' },
    { name: 'data-values', type: 'attr', desc: 'One count per day, oldest first. The last value lands on data-end.' },
    { name: 'data-end', type: 'attr', default: 'today', desc: 'Last day shown (YYYY-MM-DD).' },
    { name: 'data-weeks', type: 'attr', default: '53', desc: 'Number of week columns.' },
    { name: 'data-seed', type: 'attr', desc: 'Generate deterministic sample data when no values are given.' },
    { name: 'data-color', type: 'attr', default: 'primary', desc: 'Base color for the intensity scale.' },
    { name: 'data-label', type: 'attr', default: 'contributions', desc: 'Unit used in tooltip and summary.' },
    { name: 'data-cell', type: 'attr', default: 'auto (9–15px)', desc: 'Cell size in px.' },
    { name: 'data-legend / data-summary', type: 'attr', default: 'true', desc: 'Show the Less–More legend and the total line.' },
    { name: 'Ranj.chart.heatmap(el, opts)', type: 'js', desc: 'Set options and render.' }
  ]
});

;
/* docs/registry/data-hero-block.js */
(function () {
  var U = function (id, w, h) { return 'https://images.unsplash.com/' + id + '?w=' + w + '&h=' + h + '&fit=crop&crop=faces&q=70'; };
  var arrow = '<svg class="block-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var arrowSm = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>';
  var play = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
  var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var faces = ['photo-1494790108377-be9c29b29330', 'photo-1500648767791-00dcc994a43e', 'photo-1438761681033-6461ffad8d80', 'photo-1506794778202-cad84cf45f1d', 'photo-1544005313-94ddf0286df2']
    .map(function (id) { return '<img src="' + U(id, 64, 64) + '" alt="">'; }).join('');
  var logos = ['Lumen', 'Fathom', 'Arcade', 'Parcel', 'Kite', 'Nord'].map(function (n) { return '<span>' + n + '</span>'; }).join('');
  RanjDocs.add({
    id: 'hero-block',
    name: 'Hero',
    group: 'Blocks',
    description: 'Landing-page heroes with a gradient headline, announcement pill, social proof and an app-window mockup, plus a split image variant.',
    tags: ['new'],
    keywords: ['landing', 'header', 'above the fold', 'headline', 'jumbotron'],
    demos: [
      {
        title: 'Centered with product shot',
        pad: false, center: false,
        html: `<section class="block block-hero">
  <div class="block-hero-bg"></div>
  <div class="block-container">
    <div class="block-hero-inner">
      <a class="block-announce" href="#"><span>Northwind 3.0: edge databases are here</span><span class="block-announce-tag">New</span><span class="block-announce-arrow">${arrowSm}</span></a>
      <h1 class="block-hero-title">Deploy at the speed of <span class="block-gradient-text">thought</span></h1>
      <p class="block-hero-lead">The frontend cloud for teams who ship daily. Git push, preview, merge, and your app is live in 42 regions before your coffee cools.</p>
      <div class="block-actions">
        <a class="block-btn block-btn-primary block-btn-lg" href="#">Start for free ${arrow}</a>
        <a class="block-btn block-btn-lg" href="#">${play} Watch the 2-min demo</a>
      </div>
      <div class="block-hero-proof"><div class="block-faces">${faces}</div><span>Loved by <b>18,000+</b> teams · <b>4.9</b> on G2</span></div>
    </div>
    <div class="block-window" aria-hidden="true">
      <div class="block-window-bar"><i></i><i></i><i></i><span class="block-window-url">app.northwind.dev/acme/analytics</span></div>
      <div class="block-window-body">
        <div class="block-window-side"><span class="on">Overview</span><span>Deployments</span><span>Analytics</span><span>Logs</span><span>Storage</span><span>Settings</span></div>
        <div class="block-window-main">
          <div class="block-kpis">
            <div class="block-kpi"><small>Visitors</small><b>284,190</b><em>+12.4%</em></div>
            <div class="block-kpi"><small>Revenue</small><b>$48,302</b><em>+8.1%</em></div>
            <div class="block-kpi"><small>p75 LCP</small><b>1.12 s</b><em>-0.3 s</em></div>
          </div>
          <div class="block-chart">
            <svg viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs><linearGradient id="block-hero-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--primary)" stop-opacity=".28"/><stop offset="1" stop-color="var(--primary)" stop-opacity="0"/></linearGradient></defs>
              <line class="grid" x1="0" y1="30" x2="400" y2="30"/><line class="grid" x1="0" y1="60" x2="400" y2="60"/><line class="grid" x1="0" y1="90" x2="400" y2="90"/>
              <path class="area" d="M0 96 C30 90 50 84 80 86 S130 64 160 70 S210 52 240 56 S300 30 330 36 S380 14 400 18 V120 H0Z"/>
              <path class="line2" d="M0 104 C40 100 70 98 100 96 S170 88 200 86 S270 72 300 72 S370 60 400 56"/>
              <path class="line" d="M0 96 C30 90 50 84 80 86 S130 64 160 70 S210 52 240 56 S300 30 330 36 S380 14 400 18"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
      },
      {
        title: 'Split with image',
        pad: false, center: false,
        html: `<section class="block block-hero block-hero-split">
  <div class="block-hero-bg"></div>
  <div class="block-container block-hero-grid">
    <div class="block-hero-inner">
      <span class="block-eyebrow"><span class="block-eyebrow-dot"></span>Now in 31 cities</span>
      <h1 class="block-hero-title">Workspaces your team will <span class="block-gradient-text">actually want</span> to visit</h1>
      <p class="block-hero-lead">Book a desk, a room or a whole floor in seconds. Flexible monthly plans from $149 per person, with coffee that is genuinely good.</p>
      <div class="block-actions">
        <a class="block-btn block-btn-dark block-btn-lg" href="#">Find a space ${arrow}</a>
        <a class="block-btn block-btn-ghost block-btn-lg" href="#">See pricing</a>
      </div>
      <div class="block-logos-label" style="margin:.75rem 0 0;text-align:left">Home base for teams at</div>
      <div class="block-logos" style="justify-content:flex-start;gap:.5rem 1.75rem">${logos}</div>
    </div>
    <div class="block-hero-media">
      <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=760&fit=crop&q=70" alt="Bright open-plan office with plants">
      <div class="block-float" style="left:1rem;bottom:1rem"><span class="block-float-dot">${check}</span><div><b>Desk 14B booked</b><small>Tomorrow · 9:00 to 17:30</small></div></div>
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-hero', type: 'class', desc: 'Hero section on .block. Add .block-hero-bg as first child for the grid + glow backdrop.' },
      { name: '.block-hero-title / .block-hero-lead', type: 'class', desc: 'Display headline (container-query fluid size) and lead paragraph.' },
      { name: '.block-gradient-text', type: 'class', desc: 'Brand gradient clipped to text; adapts to dark mode.' },
      { name: '.block-announce', type: 'class', desc: 'Announcement pill link with .block-announce-tag and .block-announce-arrow.' },
      { name: '.block-hero-proof / .block-faces', type: 'class', desc: 'Overlapping avatars + social proof line.' },
      { name: '.block-window', type: 'class', desc: 'App window mockup frame (.block-window-bar, -body, -side, -main, .block-kpi, .block-chart).' },
      { name: '.block-hero-split', type: 'class', desc: 'Left-aligned two-column hero; use .block-hero-grid and .block-hero-media.' },
      { name: '.block-float', type: 'class', desc: 'Floating glass notification card with gentle bob.' },
      { name: '.block-logos', type: 'class', desc: 'Row of wordmark logos.' }
    ]
  });
})();

;
/* docs/registry/data-image-compare.js */
(function () {
var u = function (id, extra) { return 'https://images.unsplash.com/' + id + '?w=1400&q=70&auto=format&fit=crop' + (extra || ''); };
RanjDocs.add({
  id: 'image-compare',
  name: 'Image Compare',
  group: 'Data Display',
  description: 'Before/after slider. Drag anywhere (the divider glides to where you press), hover-to-compare, or use the keyboard on the handle. Works horizontally or vertically with any two images or elements.',
  tags: ['new', 'js'],
  keywords: ['before after', 'comparison slider', 'juxtapose', 'reveal', 'diff'],
  demos: [
    {
      title: 'Photo edit',
      description: 'The second image is the “before” layer. <code>data-intro</code> plays a short hint when it scrolls into view.',
      center: false,
      html: `<div class="image-compare" data-intro style="aspect-ratio: 16 / 9; max-width: 820px; margin: auto" aria-label="Color grade comparison">
  <img src="${u('photo-1501785888041-af3ef285b470')}" alt="Edited photo of a mountain lake">
  <img src="${u('photo-1501785888041-af3ef285b470', '&sat=-100')}" alt="Original black and white photo" style="filter: grayscale(1) contrast(.9) brightness(1.05)">
  <span class="image-compare-label" data-side="before">Original</span>
  <span class="image-compare-label" data-side="after">Graded</span>
</div>`
    },
    {
      title: 'Hover and vertical',
      description: '<code>data-hover</code> follows the pointer without clicking. <code>.image-compare-vertical</code> splits top/bottom; <code>.image-compare-line</code> uses a slim pill handle.',
      center: false,
      html: `<div class="demo-ic-grid">
  <div class="image-compare" data-hover data-start="40" style="aspect-ratio: 4 / 3" aria-label="Day and night">
    <img src="${u('photo-1464822759023-fed622ff2c3b')}" alt="Mountains by day">
    <img src="${u('photo-1519681393784-d120267933ba')}" alt="Mountains at night">
    <span class="image-compare-label" data-side="before">Night</span>
    <span class="image-compare-label" data-side="after">Day</span>
  </div>
  <div class="image-compare image-compare-vertical image-compare-line" data-start="55" style="aspect-ratio: 4 / 3" aria-label="Season comparison">
    <img src="${u('photo-1470071459604-3b5ec3a7fe05')}" alt="Misty forest">
    <img src="${u('photo-1441974231531-c6227db76b6e')}" alt="Sunlit forest">
    <span class="image-compare-label" data-side="before">Sunny</span>
    <span class="image-compare-label" data-side="after">Foggy</span>
  </div>
</div>`,
      css: `.demo-ic-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; width: 100%; }`
    },
    {
      title: 'Any content: UI theme diff',
      description: 'Layers can be any element with <code>.image-compare-layer</code>; the second one is clipped.',
      center: false,
      html: `<div class="image-compare" data-start="50" style="max-width: 640px; margin: auto; border: 1px solid var(--border)" aria-label="Light and dark theme">
  <div class="image-compare-layer demo-ic-ui" data-theme="dark">
    <div class="demo-ic-card"><b>Revenue</b><strong>$48,290</strong><span>+12.4% vs. last month</span><i></i></div>
  </div>
  <div class="image-compare-layer image-compare-before demo-ic-ui" data-theme="light">
    <div class="demo-ic-card"><b>Revenue</b><strong>$48,290</strong><span>+12.4% vs. last month</span><i></i></div>
  </div>
  <span class="image-compare-label" data-side="before">Light</span>
  <span class="image-compare-label" data-side="after">Dark</span>
</div>`,
      css: `.demo-ic-ui { display: grid !important; place-items: center; padding: 3rem 1.5rem; background: var(--bg); color: var(--fg); min-height: 260px; }
.demo-ic-card { width: min(320px, 100%); padding: 1.25rem; border-radius: var(--radius-lg); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-lg); display: grid; gap: .25rem; }
.demo-ic-card b { font-size: .8rem; color: var(--muted-fg); font-weight: 500; }
.demo-ic-card strong { font-size: 1.8rem; letter-spacing: -.03em; }
.demo-ic-card span { font-size: .8rem; color: var(--success-soft-fg); }
.demo-ic-card i { height: 6px; border-radius: 9px; margin-top: .75rem; background: linear-gradient(90deg, var(--primary) 68%, var(--muted) 68%); }`
    }
  ],
  api: [
    { name: '.image-compare', type: 'class', desc: 'Container. First child is the "after" base layer; the second img (or .image-compare-before) is the clipped "before" layer.' },
    { name: '.image-compare-layer', type: 'class', desc: 'Use any element as a layer instead of an img.' },
    { name: '.image-compare-label[data-side="before|after"]', type: 'class', desc: 'Corner labels that fade when the divider reaches their edge.' },
    { name: '.image-compare-vertical / .image-compare-line', type: 'class', desc: 'Top/bottom split; slim pill handle.' },
    { name: 'data-start', type: 'attr', default: '50', desc: 'Initial divider position in percent.' },
    { name: 'data-hover', type: 'attr', default: 'false', desc: 'Follow the mouse without pressing.' },
    { name: 'data-intro', type: 'attr', default: 'false', desc: 'Wiggle hint when first scrolled into view (skipped with reduced motion).' },
    { name: 'data-step', type: 'attr', default: '5', desc: 'Arrow key step (Shift = 4×). Home/End jump to the edges.' },
    { name: '--pos / --handle / --line / --line-color', type: 'var', default: '50% / 2.5rem / 2px / #fff', desc: 'Divider position, knob size, line width and color.' },
    { name: 'el.ranjCompare', type: 'js', desc: '{ set(percent), value }' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { value } (0–100)' }
  ]
});
})();

;
/* docs/registry/data-kanban.js */
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

;
/* docs/registry/data-line-chart.js */
RanjDocs.add({
  id: 'line-chart',
  name: 'Line & Area Chart',
  group: 'Data Display',
  description: 'Smooth line or gradient area chart with axes, grid, a crosshair and a multi-series tooltip. Arrow keys step through points.',
  tags: ['new', 'js'],
  keywords: ['area chart', 'time series', 'trend', 'graph', 'plot'],
  demos: [
    {
      title: 'Area',
      center: false,
      html: `<div class="chart-card" style="max-width:820px;margin:auto">
  <div class="chart-head">
    <div><div class="chart-title">Monthly recurring revenue</div><div class="chart-kpi">$212,430 <span class="chart-delta">▲ 6.8% MoM</span></div></div>
    <div class="chart-sub">Dec 2025 – Nov 2026</div>
  </div>
  <div class="line-chart" data-type="area" data-format="currency" data-name="MRR" aria-label="MRR over the last 12 months"
    data-labels="Dec,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov"
    data-values="118400,124900,131200,129800,141300,152600,158900,171200,176400,189300,198900,212430"></div>
</div>`
    },
    {
      title: 'Multiple series',
      center: false,
      html: `<div class="chart-card" style="max-width:820px;margin:auto">
  <div class="chart-head"><div><div class="chart-title">Sessions by channel</div><div class="chart-kpi">284,912</div></div><div class="chart-sub">Last 14 days</div></div>
  <div class="line-chart" data-height="280"
    data-labels="Nov 3,Nov 4,Nov 5,Nov 6,Nov 7,Nov 8,Nov 9,Nov 10,Nov 11,Nov 12,Nov 13,Nov 14,Nov 15,Nov 16"
    data-series='[{"name":"Organic","values":[9800,10400,11200,10900,11800,8400,7900,11900,12600,13100,12800,13900,9600,9200]},{"name":"Paid","values":[6200,6900,7400,7100,7800,5100,4800,6600,7100,7500,8200,8800,6300,6000]},{"name":"Referral","values":[2100,2300,2200,2600,2900,1800,1700,2800,3100,3400,3300,3700,2500,2400]}]'></div>
</div>`
    },
    {
      title: 'Stacked areas, compact',
      description: 'Hide axes with data-y-axis="false"; fit the y range with data-zero="false".',
      center: false,
      html: `<div class="demo-line-chart-grid">
  <div class="chart-card">
    <div class="chart-title">CPU utilisation</div><div class="chart-kpi" style="font-size:1.35rem">63%</div>
    <div class="line-chart" data-type="area" data-color="chart-3" data-height="120" data-y-axis="false" data-x-axis="false" data-grid="false" data-suffix="%"
      data-values="41,44,39,52,58,55,61,57,66,72,64,59,63"></div>
  </div>
  <div class="chart-card">
    <div class="chart-title">p95 latency</div><div class="chart-kpi" style="font-size:1.35rem">184 ms</div>
    <div class="line-chart" data-type="area" data-color="chart-5" data-zero="false" data-height="120" data-y-axis="false" data-x-axis="false" data-grid="false" data-suffix=" ms"
      data-values="210,204,198,221,236,212,199,191,188,195,190,186,184"></div>
  </div>
</div>`,
      css: `.demo-line-chart-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; width: 100%; max-width: 820px; margin: auto; }`
    }
  ],
  api: [
    { name: '.line-chart', type: 'class', desc: 'Host element; fills its container width.' },
    { name: 'data-labels', type: 'attr', desc: 'Comma-separated x-axis labels.' },
    { name: 'data-values', type: 'attr', desc: 'Single series as comma-separated numbers.' },
    { name: 'data-series', type: 'attr', desc: 'JSON array of { name, values, color }.' },
    { name: 'data-type', type: 'attr', default: 'line', desc: 'line | area (gradient fill).' },
    { name: 'data-curve', type: 'attr', default: 'true', desc: 'Monotone smoothing; false for straight segments.' },
    { name: 'data-dots', type: 'attr', default: 'false', desc: 'Draw a dot on every point.' },
    { name: 'data-zero', type: 'attr', default: 'true', desc: 'Start the y axis at zero; false fits the data range.' },
    { name: 'data-height', type: 'attr', default: '260', desc: 'Height in px.' },
    { name: 'data-stroke', type: 'attr', default: '2', desc: 'Line width.' },
    { name: 'data-format', type: 'attr', desc: 'number | currency | percent | compact, plus data-prefix, data-suffix, data-decimals.' },
    { name: 'data-legend / data-y-axis / data-x-axis / data-grid', type: 'attr', desc: 'Toggle chrome.' },
    { name: 'Ranj.chart.line(el, opts)', type: 'js', desc: 'Set options and render.' }
  ]
});

;
/* docs/registry/data-pagination.js */
RanjDocs.add({
  id: 'pagination',
  name: 'Pagination',
  group: 'Data Display',
  description: 'Page navigation with smart ellipses, prev/next, compact jump-to-page and dot styles. Write the markup yourself, or let <code>data-pagination</code> render and manage it and listen for <code>ranj:change</code>.',
  tags: ['js'],
  keywords: ['pager', 'pages', 'paging', 'next', 'previous'],
  demos: [
    {
      title: 'Numbered with ellipsis',
      description: 'Rendered from <code>data-total</code> and <code>data-page</code>. Arrow keys move between pages.',
      html: `<nav class="pagination" data-pagination data-total="24" data-page="7"></nav>`
    },
    {
      title: 'Styles',
      description: 'Solid, outline, joined and rounded. Every style works with hand-written markup too.',
      html: `<div style="display:grid;gap:1.25rem;justify-items:center">
  <nav class="pagination pagination-solid" data-pagination data-total="12" data-page="3" data-labels="false"></nav>
  <nav class="pagination pagination-outline pagination-rounded" data-pagination data-total="12" data-page="5" data-labels="false"></nav>
  <nav class="pagination pagination-joined" data-pagination data-total="9" data-page="2" data-labels="false"></nav>
</div>`
    },
    {
      title: 'Hand-written markup',
      description: 'No JavaScript needed: links with <code>aria-current="page"</code>.',
      html: `<nav aria-label="Pagination">
  <ul class="pagination">
    <li><a class="pagination-prev" href="#" aria-label="Previous page"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg><span class="pagination-label">Previous</span></a></li>
    <li><a href="#">1</a></li>
    <li><a href="#" aria-current="page">2</a></li>
    <li><a href="#">3</a></li>
    <li><span class="pagination-ellipsis">…</span></li>
    <li><a href="#">18</a></li>
    <li><a class="pagination-next" href="#" aria-label="Next page"><span class="pagination-label">Next</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></a></li>
  </ul>
</nav>`
    },
    {
      title: 'Simple, compact and dots',
      center: false,
      html: `<div style="display:grid;gap:1.5rem;max-width:560px;margin:auto">
  <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">
    <span class="pagination-info">Showing <b>41–60</b> of <b>1,284</b> orders</span>
    <nav class="pagination pagination-sm" data-pagination data-mode="simple" data-total="65" data-page="3"></nav>
  </div>
  <div style="display:flex;justify-content:center"><nav class="pagination pagination-compact" data-pagination data-mode="compact" data-total="128" data-page="12" data-labels="false"></nav></div>
  <div style="display:flex;justify-content:center"><nav class="pagination pagination-dots" data-pagination data-mode="dots" data-total="6" data-page="2"></nav></div>
</div>`
    },
    {
      title: 'Controlled with JS',
      html: `<div style="display:grid;gap:1rem;justify-items:center">
  <nav class="pagination pagination-solid demo-pagination-js"></nav>
  <p class="pagination-info demo-pagination-out">Viewing page <b>1</b> of 40</p>
</div>`,
      js: `const out = root.querySelector('.demo-pagination-out');
Ranj.pagination(root.querySelector('.demo-pagination-js'), {
  total: 40, page: 1, siblings: 2,
  onChange: (page) => { out.innerHTML = 'Viewing page <b>' + page + '</b> of 40'; }
});`
    }
  ],
  api: [
    { name: '.pagination', type: 'class', desc: 'Container (nav, ul or div). Items are a/button; current item uses aria-current="page".' },
    { name: '.pagination-solid / -outline / -joined / -rounded', type: 'class', desc: 'Visual styles.' },
    { name: '.pagination-sm / .pagination-lg', type: 'class', desc: 'Sizes.' },
    { name: '.pagination-compact / .pagination-dots / .pagination-simple', type: 'class', desc: 'Layouts for the compact, dots and simple modes.' },
    { name: '.pagination-ellipsis / .pagination-info / .pagination-label', type: 'class', desc: 'Gap marker, "Page 3 of 9" text, Prev/Next labels (hidden below 480px).' },
    { name: 'data-pagination', type: 'attr', desc: 'Render and manage the pager from data attributes.' },
    { name: 'data-total / data-page', type: 'attr', default: '1 / 1', desc: 'Page count and current page.' },
    { name: 'data-siblings / data-boundaries', type: 'attr', default: '1 / 1', desc: 'Pages shown around the current page and at each end.' },
    { name: 'data-mode', type: 'attr', default: 'numbers', desc: 'numbers | simple | compact | dots.' },
    { name: 'data-labels', type: 'attr', default: 'true', desc: 'Show "Previous"/"Next" text.' },
    { name: '--pg-size / --pg-gap', type: 'var', default: '2.25rem / .25rem', desc: 'Item size and spacing.' },
    { name: 'Ranj.pagination(el, opts)', type: 'js', desc: '{ total, page, siblings, boundaries, mode, labels, onChange(page, prev) } → { set(n), setTotal(n), page }.' },
    { name: 'Ranj.pagination.range(page, total, siblings, boundaries)', type: 'js', desc: 'Returns the page list with "…" gaps, for custom renderers.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { page, previous, total, user }' }
  ]
});

;
/* docs/registry/data-pricing-block.js */
(function () {
  var arrow = '<svg class="block-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var spark = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/></svg>';
  RanjDocs.add({
    id: 'pricing-block',
    name: 'Pricing',
    group: 'Blocks',
    description: 'Three-tier pricing section with an animated monthly / yearly switch, a highlighted plan, feature checklists and a comparison table.',
    tags: ['new', 'js'],
    keywords: ['pricing table', 'plans', 'tiers', 'billing toggle', 'subscription'],
    demos: [
      {
        title: 'Three tiers with billing toggle',
        description: 'Any element inside <code>.block-pricing</code> with <code>data-monthly</code> / <code>data-yearly</code> swaps its text when the period changes.',
        pad: false, center: false,
        html: `<section class="block block-pricing" data-period="monthly">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow"><span class="block-eyebrow-dot"></span>Pricing</span>
      <h2 class="block-title">Simple pricing that scales with your team</h2>
      <p class="block-lead">Start free, upgrade when you ship. Every plan includes unlimited projects, SSL and global edge caching.</p>
    </div>
    <div class="block-pricing-center">
      <div class="block-pricing-toggle">
        <button type="button" data-period="monthly">Monthly</button>
        <button type="button" data-period="yearly">Yearly <span class="block-save">-20%</span></button>
      </div>
    </div>
    <div class="block-pricing-grid">
      <article class="block-plan">
        <div>
          <div class="block-plan-name">Hobby</div>
          <p class="block-plan-desc">For side projects and weekend experiments.</p>
        </div>
        <div>
          <div class="block-plan-price"><span class="block-plan-amount">$0</span><span class="block-plan-per">/ month</span></div>
          <p class="block-plan-note">Free forever, no card needed</p>
        </div>
        <a class="block-btn block-btn-block" href="#">Start for free</a>
        <hr>
        <ul class="block-checks">
          <li>3 projects, 1 seat</li>
          <li>100 GB bandwidth</li>
          <li>Community support</li>
          <li class="is-off">Preview environments</li>
          <li class="is-off">SSO &amp; audit log</li>
        </ul>
      </article>
      <article class="block-plan block-plan-featured">
        <span class="block-plan-tag">Most popular</span>
        <div>
          <div class="block-plan-name">Pro ${spark}</div>
          <p class="block-plan-desc">For growing products that need room to breathe.</p>
        </div>
        <div>
          <div class="block-plan-price"><span class="block-plan-amount" data-monthly="$29" data-yearly="$24">$29</span><span class="block-plan-per">/ seat / month</span></div>
          <p class="block-plan-note" data-monthly="Billed monthly, cancel anytime" data-yearly="$288 billed yearly, save $60">Billed monthly, cancel anytime</p>
        </div>
        <a class="block-btn block-btn-primary block-btn-block" href="#">Start 14-day trial ${arrow}</a>
        <hr>
        <ul class="block-checks">
          <li>Unlimited projects</li>
          <li>1 TB bandwidth</li>
          <li>Preview environments for every PR</li>
          <li>Email support, 24h response</li>
          <li class="is-off">SSO &amp; audit log</li>
        </ul>
      </article>
      <article class="block-plan">
        <div>
          <div class="block-plan-name">Team</div>
          <p class="block-plan-desc">For companies with security and compliance needs.</p>
        </div>
        <div>
          <div class="block-plan-price"><span class="block-plan-amount" data-monthly="$79" data-yearly="$66">$79</span><span class="block-plan-per">/ seat / month</span></div>
          <p class="block-plan-note" data-monthly="Billed monthly" data-yearly="$792 billed yearly, save $156">Billed monthly</p>
        </div>
        <a class="block-btn block-btn-dark block-btn-block" href="#">Contact sales</a>
        <hr>
        <ul class="block-checks">
          <li>Everything in Pro</li>
          <li>10 TB bandwidth</li>
          <li>SAML SSO &amp; SCIM</li>
          <li>Audit log, 1-year retention</li>
          <li>99.99% uptime SLA</li>
        </ul>
      </article>
    </div>
  </div>
</section>`,
        js: `root.querySelector('.block-pricing').addEventListener('ranj:change', e => console.log('period', e.detail.period));`
      },
      {
        title: 'Plan comparison',
        description: 'A comparison table that scrolls horizontally inside its own wrapper on narrow screens.',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container">
    <div class="block-head">
      <h2 class="block-title">Compare every feature</h2>
      <p class="block-lead">All the details, side by side.</p>
    </div>
    <div class="block-compare-wrap">
      <table class="block-compare">
        <thead><tr><th>Feature</th><th>Hobby</th><th>Pro</th><th>Team</th></tr></thead>
        <tbody>
          <tr><th>Projects</th><td>3</td><td>Unlimited</td><td>Unlimited</td></tr>
          <tr><th>Bandwidth</th><td>100 GB</td><td>1 TB</td><td>10 TB</td></tr>
          <tr><th>Build minutes</th><td>6,000</td><td>24,000</td><td>Custom</td></tr>
          <tr><th>Preview environments</th><td class="no">—</td><td class="yes">✓</td><td class="yes">✓</td></tr>
          <tr><th>Password protection</th><td class="no">—</td><td class="yes">✓</td><td class="yes">✓</td></tr>
          <tr><th>SAML SSO &amp; SCIM</th><td class="no">—</td><td class="no">—</td><td class="yes">✓</td></tr>
          <tr><th>Uptime SLA</th><td class="no">—</td><td>99.9%</td><td>99.99%</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-pricing', type: 'class', desc: 'Section root; mounts the period toggle.' },
      { name: '.block-pricing-toggle', type: 'class', desc: 'Segmented switch holding buttons with data-period. A sliding thumb is inserted automatically.' },
      { name: '.block-plan / .block-plan-featured', type: 'class', desc: 'Plan card / highlighted plan with glow.' },
      { name: '.block-plan-tag', type: 'class', desc: 'Floating “Most popular” label on a plan.' },
      { name: '.block-checks', type: 'class', desc: 'Checklist; add .is-off to an item for an excluded feature.' },
      { name: '.block-compare-wrap / .block-compare', type: 'class', desc: 'Scrollable comparison table. Use td.yes / td.no.' },
      { name: 'data-period', type: 'attr', default: 'monthly', desc: 'Current period on .block-pricing; any name works (matches data-<period> on values).' },
      { name: 'data-monthly / data-yearly', type: 'attr', desc: 'Text shown for each period on any descendant.' },
      { name: 'el.blockPricing.set(period)', type: 'js', desc: 'Switch period programmatically.' },
      { name: 'ranj:change', type: 'event', desc: 'detail: { period }' }
    ]
  });
})();

;
/* docs/registry/data-rating.js */
RanjDocs.add({
  id: 'rating',
  name: 'Rating',
  group: 'Data Display',
  description: 'Read-only star ratings (<code>.stars</code>) from a single CSS variable: any fraction (4.3, 3.5…) fills exactly to the glyph. Sizes, colors, heart/circle shapes, and a review summary with distribution bars. No JavaScript.',
  tags: ['new'],
  keywords: ['stars', 'reviews', 'score', 'star rating', 'read-only rating', 'feedback'],
  demos: [
    {
      title: 'Values and fractions',
      html: `<div style="display:grid;gap:.75rem;justify-items:start">
  <span class="stars-group"><span class="stars" style="--value: 5" role="img" aria-label="Rated 5 out of 5"></span><b>5.0</b></span>
  <span class="stars-group"><span class="stars" style="--value: 4.5" role="img" aria-label="Rated 4.5 out of 5"></span><b>4.5</b></span>
  <span class="stars-group"><span class="stars" style="--value: 3.7" role="img" aria-label="Rated 3.7 out of 5"></span><b>3.7</b></span>
  <span class="stars-group"><span class="stars" style="--value: 2.2" role="img" aria-label="Rated 2.2 out of 5"></span><b>2.2</b></span>
  <span class="stars-group"><span class="stars" style="--value: 1" role="img" aria-label="Rated 1 out of 5"></span><b>1.0</b></span>
</div>`
    },
    {
      title: 'Sizes, colors and shapes',
      html: `<div style="display:grid;gap:.9rem;justify-items:start">
  <span class="stars stars-xs" style="--value: 4.5" role="img" aria-label="4.5 out of 5"></span>
  <span class="stars stars-sm" style="--value: 4.5" role="img" aria-label="4.5 out of 5"></span>
  <span class="stars stars-lg" style="--value: 4.5" role="img" aria-label="4.5 out of 5"></span>
  <span class="stars stars-xl stars-primary" style="--value: 3.5" role="img" aria-label="3.5 out of 5"></span>
  <span class="stars stars-lg stars-heart stars-rose" style="--value: 4" role="img" aria-label="4 out of 5 hearts"></span>
  <span class="stars stars-circle" style="--value: 7; --max: 10" role="img" aria-label="7 out of 10"></span>
</div>`
    },
    {
      title: 'Review summary',
      center: false,
      html: `<div class="rating-summary" style="max-width: 520px; margin: auto">
  <div class="rating-score">
    <strong>4.8</strong>
    <span class="stars" style="--value: 4.8" role="img" aria-label="Rated 4.8 out of 5"></span>
    <small>2,148 verified reviews</small>
  </div>
  <div class="rating-bars">
    <div class="rating-bar"><span>5★</span><div class="rating-bar-track"><i style="--w: 84%"></i></div><span>1,804</span></div>
    <div class="rating-bar"><span>4★</span><div class="rating-bar-track"><i style="--w: 11%"></i></div><span>236</span></div>
    <div class="rating-bar"><span>3★</span><div class="rating-bar-track"><i style="--w: 3%"></i></div><span>64</span></div>
    <div class="rating-bar"><span>2★</span><div class="rating-bar-track"><i style="--w: 1%"></i></div><span>26</span></div>
    <div class="rating-bar"><span>1★</span><div class="rating-bar-track"><i style="--w: 1%"></i></div><span>18</span></div>
  </div>
</div>`
    },
    {
      title: 'In a product card',
      html: `<div class="demo-rating-card">
  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=70&auto=format&fit=crop" alt="Headphones">
  <div>
    <b>Aurora ANC Headphones</b>
    <span class="stars-group"><span class="stars stars-sm" style="--value: 4.6" role="img" aria-label="Rated 4.6 out of 5"></span><b>4.6</b><span>(892)</span></span>
    <strong>$249</strong>
  </div>
</div>`,
      css: `.demo-rating-card { width: 280px; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; background: var(--card); box-shadow: var(--shadow-sm); }
.demo-rating-card img { aspect-ratio: 4/3; width: 100%; object-fit: cover; }
.demo-rating-card > div { padding: 1rem; display: grid; gap: .4rem; }
.demo-rating-card strong { font-size: 1.15rem; }`
    }
  ],
  api: [
    { name: '.stars', type: 'class', desc: 'Star strip. Give it role="img" and an aria-label with the score.' },
    { name: '--value', type: 'var', default: '0', desc: 'Score; fractions fill part of a star.' },
    { name: '--max', type: 'var', default: '5', desc: 'Number of glyphs.' },
    { name: '--size / --gap', type: 'var', default: '1.1rem / .15rem', desc: 'Glyph size and spacing.' },
    { name: '--star-on / --star-off / --star', type: 'var', desc: 'Fill color, empty color, glyph mask (any SVG url).' },
    { name: '.stars-xs / -sm / -lg / -xl', type: 'class', desc: 'Sizes.' },
    { name: '.stars-primary / -success / -rose', type: 'class', desc: 'Fill colors (amber by default).' },
    { name: '.stars-heart / .stars-circle', type: 'class', desc: 'Alternative glyphs.' },
    { name: '.stars-group', type: 'class', desc: 'Inline stars + bold score + muted count.' },
    { name: '.rating-summary / .rating-score / .rating-bars / .rating-bar / .rating-bar-track', type: 'class', desc: 'Review summary with distribution bars (set --w on the bar fill).' }
  ]
});

;
/* docs/registry/data-resizable.js */
(function () {
var file = function (n, active) { return '<div class="demo-rs-file' + (active ? ' is-active' : '') + '">' + n + '</div>'; };
RanjDocs.add({
  id: 'resizable',
  name: 'Resizable',
  group: 'Data Display',
  description: 'Panel groups with drag handles, horizontal or vertical and nestable. Sizes are percentages with min/max limits, panels can snap closed, handles are keyboard accessible (arrows, Home/End, Enter to collapse), double-click resets, and <code>data-autosave</code> remembers the layout.',
  tags: ['js'],
  keywords: ['split pane', 'splitter', 'panels', 'drag to resize', 'layout', 'ide'],
  demos: [
    {
      title: 'Editor layout',
      description: 'A nested group: sidebar | (editor / terminal). The sidebar collapses when dragged below half its minimum; focus a handle and press Enter to toggle it.',
      center: false,
      html: `<div class="resizable" style="height: 360px" data-autosave="docs-editor">
  <div class="resizable-panel demo-rs-side" data-size="24" data-min="16" data-max="40" data-collapsible>
    <div class="demo-rs-label">Explorer</div>
    ${file('app.tsx')}${file('DataTable.tsx', true)}${file('routes.ts')}${file('theme.css')}${file('package.json')}
  </div>
  <div class="resizable-handle" data-grip></div>
  <div class="resizable-panel" data-size="76">
    <div class="resizable resizable-vertical">
      <div class="resizable-panel demo-rs-code" data-size="68" data-min="25">
<pre><span class="k">export function</span> <span class="f">DataTable</span>({ rows }) {
  <span class="k">const</span> [sort, setSort] = useState(<span class="s">'mrr'</span>);
  <span class="k">return</span> &lt;Table rows={rows} sort={sort} /&gt;;
}</pre>
      </div>
      <div class="resizable-handle"></div>
      <div class="resizable-panel demo-rs-term" data-size="32" data-min="15">
        <div class="demo-rs-label">Terminal</div>
        <code>$ pnpm dev</code><code class="ok">✓ Ready in 412 ms · http://localhost:5173</code>
      </div>
    </div>
  </div>
</div>`,
      css: `.demo-rs-side { padding: .75rem .5rem; background: var(--bg-subtle); }
.demo-rs-label { font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--muted-fg); padding: 0 .5rem .5rem; }
.demo-rs-file { font-size: .82rem; padding: .3rem .5rem; border-radius: var(--radius-sm); white-space: nowrap; color: var(--muted-fg); }
.demo-rs-file.is-active { background: var(--primary-soft); color: var(--primary-soft-fg); }
.demo-rs-code pre { margin: 0; padding: 1rem 1.2rem; font: .8rem/1.8 var(--font-mono); background: none; border: 0; }
.demo-rs-code .k { color: oklch(.6 .18 300); } .demo-rs-code .f { color: oklch(.6 .16 250); } .demo-rs-code .s { color: oklch(.6 .15 150); }
.demo-rs-term { padding: .75rem 1rem; background: #0b0b10; color: #d4d4d8; display: flex; flex-direction: column; gap: .2rem; }
.demo-rs-term .demo-rs-label { padding: 0 0 .35rem; color: #71717a; }
.demo-rs-term code { font: .78rem/1.6 var(--font-mono); background: none; padding: 0; }
.demo-rs-term .ok { color: #4ade80; }`
    },
    {
      title: 'Three columns with live sizes',
      description: '<code>data-labels</code> shows each panel’s size while you drag. Double-click a handle to split its neighbours evenly.',
      center: false,
      html: `<div class="resizable" data-labels style="height: 200px">
  <div class="resizable-panel demo-rs-box" data-size="25" data-min="15">Inbox</div>
  <div class="resizable-handle" data-grip></div>
  <div class="resizable-panel demo-rs-box" data-size="40" data-min="20">Conversation</div>
  <div class="resizable-handle" data-grip></div>
  <div class="resizable-panel demo-rs-box" data-size="35" data-min="20" data-max="45">Customer details</div>
</div>`,
      css: `.demo-rs-box { display: grid; place-items: center; text-align: center; padding: .75rem 1rem; font-size: .875rem; font-weight: 500; color: var(--muted-fg); }`
    }
  ],
  api: [
    { name: '.resizable', type: 'class', desc: 'Panel group (horizontal). Children alternate .resizable-panel and .resizable-handle. Groups can nest.' },
    { name: '.resizable-vertical', type: 'class', desc: 'Stack panels top to bottom.' },
    { name: '.resizable-panel[data-size]', type: 'attr', desc: 'Initial size in percent. Panels without one share the remainder.' },
    { name: 'data-min / data-max', type: 'attr', default: '0 / 100', desc: 'Size limits in percent (on a panel).' },
    { name: 'data-collapsible / data-collapsed-size', type: 'attr', default: '— / 0', desc: 'Snap the panel closed when dragged below half its minimum; Enter on the handle toggles it.' },
    { name: '.resizable-handle[data-grip]', type: 'attr', desc: 'Adds a visible grip pill to the handle.' },
    { name: 'data-autosave', type: 'attr', desc: 'On the group: localStorage key to remember sizes.' },
    { name: 'data-labels / data-step', type: 'attr', default: 'false / 5', desc: 'Show size badges while dragging; keyboard step in percent (Shift doubles).' },
    { name: '--handle-size / --handle-hit', type: 'var', default: '1px / 10px', desc: 'Visible line thickness and invisible grab area.' },
    { name: 'el.ranjResizable', type: 'js', desc: '{ sizes, setSizes([..]) }' },
    { name: 'ranj:resize', type: 'event', desc: 'After a drag or key press. detail: { sizes }' }
  ]
});
})();

;
/* docs/registry/data-scroll-area.js */
(function () {
var tags = ['v4.2.0', 'v4.1.3', 'v4.1.2', 'v4.1.1', 'v4.1.0', 'v4.0.2', 'v4.0.1', 'v4.0.0', 'v3.9.4', 'v3.9.3', 'v3.9.2', 'v3.9.1', 'v3.9.0', 'v3.8.6', 'v3.8.5', 'v3.8.4', 'v3.8.3', 'v3.8.2', 'v3.8.1', 'v3.8.0'];
var cover = function (id) { return 'https://images.unsplash.com/' + id + '?w=360&h=460&fit=crop&q=70&auto=format'; };
var art = [['photo-1506905925346-21bda4d32df4', 'Above the Clouds', 'Nora Lindqvist'], ['photo-1519681393784-d120267933ba', 'Night Walks', 'Kai Mendes'], ['photo-1501785888041-af3ef285b470', 'Still Water', 'Amara Okafor'], ['photo-1469474968028-56623f02e42e', 'Morning Light', 'Theo Brandt'], ['photo-1470071459604-3b5ec3a7fe05', 'Pine & Fog', 'Lena Park'], ['photo-1507525428034-b723cf961d3e', 'Low Tide', 'Ravi Shah'], ['photo-1433086966358-54859d0ed716', 'Falling', 'June Ito']];
RanjDocs.add({
  id: 'scroll-area',
  name: 'Scroll Area',
  group: 'Data Display',
  description: 'A scroll container with slim overlay scrollbars that fade in on hover or while scrolling, draggable thumbs, click-to-page tracks, and optional edge fades that appear only where more content is hidden. Without JS it falls back to thin native scrollbars.',
  tags: ['js'],
  keywords: ['scrollbar', 'overflow', 'custom scrollbar', 'scrollable', 'horizontal scroll', 'rail'],
  demos: [
    {
      title: 'Vertical list',
      html: `<div class="scroll-area demo-sa-box" style="height: 288px; width: 220px">
  <div style="padding: .75rem 1rem">
    <div class="demo-sa-head">Releases</div>
${tags.map(function (t, i) { return '    <div class="demo-sa-row"><span>' + t + '</span><small>' + ['Nov 14', 'Nov 02', 'Oct 27', 'Oct 19', 'Oct 08', 'Sep 30', 'Sep 21', 'Sep 12', 'Aug 29', 'Aug 18', 'Aug 06', 'Jul 30', 'Jul 21', 'Jul 09', 'Jun 28', 'Jun 17', 'Jun 05', 'May 26', 'May 14', 'May 02'][i] + '</small></div>'; }).join('\n')}
  </div>
</div>`,
      css: `.demo-sa-box { border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); }
.demo-sa-head { font-size: .8rem; font-weight: 600; margin-bottom: .5rem; }
.demo-sa-row { display: flex; justify-content: space-between; padding: .45rem 0; border-top: 1px solid var(--border); font-size: .85rem; font-family: var(--font-mono); }
.demo-sa-row small { color: var(--muted-fg); font-family: var(--font-sans); }`,
      height: 340
    },
    {
      title: 'Horizontal rail with fades',
      description: '<code>.scroll-area-x</code> scrolls sideways (the mouse wheel works too), <code>.scroll-area-fade</code> fades the edges that have more content, <code>.scroll-area-snap</code> snaps items.',
      center: false,
      html: `<div class="scroll-area scroll-area-x scroll-area-fade scroll-area-snap">
  <div class="scroll-rail">
${art.map(function (a) { return '    <figure class="demo-sa-cover"><img src="' + cover(a[0]) + '" alt=""><figcaption><b>' + a[1] + '</b><span>' + a[2] + '</span></figcaption></figure>'; }).join('\n')}
  </div>
</div>`,
      css: `.demo-sa-cover { width: 150px; margin: 0; }
.demo-sa-cover img { width: 150px; height: 190px; object-fit: cover; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.demo-sa-cover figcaption { margin-top: .5rem; font-size: .8rem; display: grid; }
.demo-sa-cover span { color: var(--muted-fg); font-size: .75rem; }`
    },
    {
      title: 'Both axes',
      description: 'Big content scrolls in both directions; each overlay bar is independent. <code>.scroll-area-always</code> keeps bars visible.',
      html: `<div class="scroll-area scroll-area-always scroll-area-fade demo-sa-box" style="width: min(100%, 420px); height: 240px">
  <pre class="demo-sa-code">{
  "name": "ranj-ui",
  "version": "2.0.0",
  "description": "The zero-dependency HTML/CSS/vanilla-JS component library with 150+ components, motion effects and micro-interactions.",
  "scripts": {
    "build": "node build.mjs",
    "dev": "node build.mjs --watch",
    "check": "node scripts/check.mjs --out=.shots && node scripts/check.mjs --dark --out=.shots"
  },
  "files": ["dist", "src"],
  "devDependencies": {
    "esbuild": "^0.24.0",
    "playwright": "^1.65.1"
  },
  "keywords": ["ui", "components", "component-library", "css-framework", "vanilla-js", "animations", "micro-interactions"]
}</pre>
</div>`,
      css: `.demo-sa-code { margin: 0; padding: 1rem 1.1rem; font: .8rem/1.7 var(--font-mono); width: max-content; color: var(--fg); background: none; border: 0; }`
    }
  ],
  api: [
    { name: '.scroll-area', type: 'class', desc: 'Scroll container. Give it a height or max-height. With ranj.js its content is wrapped in .scroll-area-viewport and overlay bars are added.' },
    { name: '.scroll-area-x / .scroll-area-y', type: 'class', desc: 'Restrict to one axis. Horizontal areas also scroll with a vertical mouse wheel.' },
    { name: '.scroll-area-fade', type: 'class', desc: 'Fades the edges that have hidden content (data-more-top/bottom/left/right are set for you).' },
    { name: '.scroll-area-always / .scroll-area-snap / .scroll-rail', type: 'class', desc: 'Always show bars; snap children; horizontal flex row of items.' },
    { name: 'data-native', type: 'attr', desc: 'Keep native (thin, styled) scrollbars and skip the JS overlay.' },
    { name: '--sa-size / --sa-thumb / --sa-thumb-hover / --sa-fade', type: 'var', default: '10px / fg 26% / fg 42% / 2.5rem', desc: 'Bar thickness, thumb colors, fade length.' },
    { name: 'el.ranjScrollArea', type: 'js', desc: '{ viewport, update() }: scroll the viewport element directly.' },
    { name: 'ranj:scroll', type: 'event', desc: 'detail: { top, left }' }
  ]
});
})();

;
/* docs/registry/data-sparkline.js */
RanjDocs.add({
  id: 'sparkline',
  name: 'Sparkline',
  group: 'Data Display',
  description: 'Word-sized trend line, area or bar chart that fills its container. Hover for values; draws itself in when it scrolls into view.',
  tags: ['new', 'js'],
  keywords: ['trend', 'mini chart', 'micro chart', 'inline chart', 'kpi'],
  demos: [
    {
      title: 'KPI cards',
      center: false,
      html: `<div class="demo-sparkline-grid">
  <div class="chart-card">
    <div class="chart-title">Monthly recurring revenue</div>
    <div class="chart-kpi">$48,290 <span class="chart-delta">▲ 12.4%</span></div>
    <span class="sparkline" data-type="area" data-color="success" data-format="currency"
      data-values="31200,32900,32100,34800,36500,35900,38700,40100,41800,43900,46200,48290"
      style="--h: 56px; margin-top: .75rem"></span>
  </div>
  <div class="chart-card">
    <div class="chart-title">Churn rate</div>
    <div class="chart-kpi">2.8% <span class="chart-delta is-down">▼ 0.6 pts</span></div>
    <span class="sparkline" data-type="area" data-color="destructive" data-format="percent" data-decimals="1"
      data-values="4.1,3.9,4.3,3.8,3.6,3.7,3.4,3.3,3.5,3.1,3.0,2.8" style="--h: 56px; margin-top: .75rem"></span>
  </div>
  <div class="chart-card">
    <div class="chart-title">Weekly active users</div>
    <div class="chart-kpi">18.6k <span class="chart-delta">▲ 4.1%</span></div>
    <span class="sparkline" data-type="bar" data-color="primary"
      data-values="12100,13400,12900,14800,15200,14900,16100,16600,17200,16900,17800,18600" style="--h: 56px; margin-top: .75rem"></span>
  </div>
</div>`,
      css: `.demo-sparkline-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; width: 100%; }`
    },
    {
      title: 'Types and colors',
      description: 'Line (default), area and bar. Color takes primary, success, warning, destructive, info, chart-1…chart-8 or any CSS color.',
      center: false,
      html: `<div class="demo-sparkline-types">
  <span class="sparkline" data-values="8,12,9,14,13,18,16,22,19,25,23,29"></span>
  <span class="sparkline" data-type="area" data-color="chart-2" data-values="20,18,24,21,27,25,30,28,26,33,31,36"></span>
  <span class="sparkline" data-type="bar" data-color="chart-4" data-values="5,9,7,12,10,8,14,11,13,9,15,17"></span>
  <span class="sparkline" data-curve="false" data-color="chart-5" data-values="30,26,28,22,24,19,21,16,18,13,15,11"></span>
</div>`,
      css: `.demo-sparkline-types { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.75rem; width: 100%; max-width: 760px; margin: auto; }`
    },
    {
      title: 'Inline in a list',
      description: 'Add .sparkline-inline to sit in a line of text (5.5em × 1.25em).',
      html: `<div class="chart-card demo-sparkline-list">
  <div class="demo-sparkline-row"><span><b>api-gateway</b><small>p95 latency</small></span>
    <span class="sparkline sparkline-inline" data-color="success" data-suffix=" ms" data-values="182,176,170,168,171,160,152,149,151,143"></span><b>143 ms</b></div>
  <div class="demo-sparkline-row"><span><b>checkout-svc</b><small>p95 latency</small></span>
    <span class="sparkline sparkline-inline" data-color="warning" data-suffix=" ms" data-values="210,215,232,228,251,244,262,270,266,284"></span><b>284 ms</b></div>
  <div class="demo-sparkline-row"><span><b>search-index</b><small>p95 latency</small></span>
    <span class="sparkline sparkline-inline" data-color="destructive" data-suffix=" ms" data-values="90,94,92,118,140,133,162,190,214,236"></span><b>236 ms</b></div>
  <div class="demo-sparkline-row"><span><b>auth</b><small>p95 latency</small></span>
    <span class="sparkline sparkline-inline" data-color="success" data-suffix=" ms" data-values="64,66,61,63,60,62,58,57,59,55"></span><b>55 ms</b></div>
</div>`,
      css: `.demo-sparkline-list { width: 100%; max-width: 420px; padding: .5rem 1.1rem; }
.demo-sparkline-row { display: grid; grid-template-columns: 1fr auto 4.5rem; align-items: center; gap: 1rem; padding: .7rem 0; border-bottom: 1px solid var(--border); font-size: .875rem; }
.demo-sparkline-row:last-child { border-bottom: 0; }
.demo-sparkline-row small { display: block; color: var(--muted-fg); font-size: .75rem; }
.demo-sparkline-row > b { text-align: right; font-variant-numeric: tabular-nums; }`
    },
    {
      title: 'Live data',
      description: 'Change data-values (or call Ranj.chart.sparkline) and it re-renders.',
      html: `<div class="chart-card" style="width:100%;max-width:420px">
  <div class="chart-head" style="margin-bottom:.5rem">
    <div><div class="chart-title">Requests / second</div><div class="chart-kpi" data-live-value>1,204</div></div>
    <span class="chart-delta" style="background:var(--info-soft);color:var(--info-soft-fg)">● Live</span>
  </div>
  <span class="sparkline" data-live data-type="area" data-color="info" data-dot data-tooltip="false" style="--h: 72px"
    data-values="1100,1180,1150,1220,1190,1260,1210,1240,1300,1270,1230,1204"></span>
</div>`,
      js: `const s = root.querySelector('[data-live]'), out = root.querySelector('[data-live-value]');
const t = setInterval(() => {
  const v = s.dataset.values.split(',').map(Number);
  const next = Math.max(800, Math.round(v[v.length - 1] + (Math.random() - .48) * 90));
  v.push(next); v.shift();
  s.dataset.values = v.join(',');
  out.textContent = next.toLocaleString();
}, 1200);
return () => clearInterval(t);`
    }
  ],
  api: [
    { name: '.sparkline', type: 'class', desc: 'Block-level, 100% wide, height from --h.' },
    { name: '.sparkline-inline', type: 'class', desc: 'Inline size for use inside text or table cells.' },
    { name: 'data-values', type: 'attr', desc: 'Comma-separated numbers, oldest first.' },
    { name: 'data-type', type: 'attr', default: 'line', desc: 'line | area | bar.' },
    { name: 'data-color', type: 'attr', default: 'primary', desc: 'primary, success, warning, destructive, info, chart-1…8 or any CSS color.' },
    { name: 'data-curve', type: 'attr', default: 'true', desc: 'Smooth monotone curve; false for straight segments.' },
    { name: 'data-dot', type: 'attr', default: 'true', desc: 'Dot on the last point (line/area).' },
    { name: 'data-min / data-max', type: 'attr', desc: 'Fix the vertical range instead of fitting the data.' },
    { name: 'data-stroke', type: 'attr', default: '1.75', desc: 'Line width in px.' },
    { name: 'data-labels', type: 'attr', desc: 'Optional comma-separated labels shown in the tooltip.' },
    { name: 'data-tooltip', type: 'attr', default: 'true', desc: 'Hover tooltip with the value.' },
    { name: 'data-format', type: 'attr', desc: 'number | currency | percent | compact (also data-prefix, data-suffix, data-decimals, data-currency).' },
    { name: 'data-static', type: 'attr', desc: 'Skip the draw-in animation.' },
    { name: '--h', type: 'var', default: '40px', desc: 'Height.' },
    { name: '--chart-1 … --chart-8', type: 'var', desc: 'Categorical palette derived from --hue (shared by all charts).' },
    { name: 'Ranj.chart.sparkline(el, opts)', type: 'js', desc: 'Set options (same names as the attributes, arrays allowed) and render.' }
  ]
});

;
/* docs/registry/data-stat.js */
(function () {
var I = {
  dollar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 6.5c0-1.9-2.2-3.5-5-3.5s-5 1.6-5 3.5S9.2 10 12 10s5 1.6 5 3.5S14.8 17 12 17s-5-1.6-5-3.5"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 3.1a4 4 0 0 1 0 7.8M22 21a7 7 0 0 0-4-6.3"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6"/></svg>',
  pulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>'
};
RanjDocs.add({
  id: 'stat',
  name: 'Stat',
  group: 'Data Display',
  description: 'KPI cards for dashboards: label, big tabular value, colored delta, icon, and a slot for a sparkline, progress toward a target or a share bar. <code>.stat-grid</code> lays them out responsively, or joins them into one divided card.',
  tags: ['new'],
  keywords: ['kpi', 'metric', 'stats', 'number card', 'dashboard', 'statistic', 'stat grid'],
  demos: [
    {
      title: 'KPI cards with sparklines',
      center: false,
      html: `<div class="stat-grid">
  <div class="stat">
    <div class="stat-head"><span class="stat-label">Revenue</span><span class="stat-icon">${I.dollar}</span></div>
    <div class="stat-value">$184,920</div>
    <div class="stat-foot"><span class="stat-delta is-up">12.4%</span><span class="stat-help">vs. October</span></div>
    <div class="stat-chart"><span class="sparkline" data-type="area" data-color="success" data-format="currency" data-values="121400,128900,126300,139800,144100,141900,152800,158300,163900,171200,176800,184920"></span></div>
  </div>
  <div class="stat">
    <div class="stat-head"><span class="stat-label">Active subscribers</span><span class="stat-icon is-info">${I.users}</span></div>
    <div class="stat-value">12,847</div>
    <div class="stat-foot"><span class="stat-delta is-up">3.1%</span><span class="stat-help">+386 this month</span></div>
    <div class="stat-chart"><span class="sparkline" data-type="area" data-color="info" data-values="10920,11080,11240,11190,11420,11610,11830,12020,12190,12340,12461,12847"></span></div>
  </div>
  <div class="stat">
    <div class="stat-head"><span class="stat-label">Churn</span><span class="stat-icon is-danger">${I.pulse}</span></div>
    <div class="stat-value">2.41<span class="stat-unit">%</span></div>
    <div class="stat-foot"><span class="stat-delta is-down is-inverse">0.38 pts</span><span class="stat-help">lower is better</span></div>
    <div class="stat-chart"><span class="sparkline" data-type="line" data-color="destructive" data-format="percent" data-decimals="2" data-values="3.4,3.2,3.3,3.0,2.95,3.1,2.86,2.79,2.82,2.66,2.79,2.41"></span></div>
  </div>
  <div class="stat">
    <div class="stat-head"><span class="stat-label">Avg. order value</span><span class="stat-icon is-warning">${I.cart}</span></div>
    <div class="stat-value">$86.30</div>
    <div class="stat-foot"><span class="stat-delta is-flat">0.0%</span><span class="stat-help">flat week over week</span></div>
    <div class="stat-chart"><span class="sparkline" data-type="bar" data-color="warning" data-format="currency" data-values="84,88,85,87,86,89,83,86,87,85,86,86.3"></span></div>
  </div>
</div>`
    },
    {
      title: 'Divided grid',
      description: '<code>.stat-grid-divided</code> joins the cells into one card. Use buttons with <code>.is-active</code> to make it a metric switcher.',
      center: false,
      html: `<div class="stat-grid stat-grid-divided" style="--stat-min: 11rem" role="tablist">
  <button class="stat is-active" role="tab" aria-selected="true"><span class="stat-label">Visitors</span><span class="stat-value">48.2k</span><span class="stat-delta stat-delta-pill is-up">18%</span></button>
  <button class="stat" role="tab" aria-selected="false"><span class="stat-label">Page views</span><span class="stat-value">213k</span><span class="stat-delta stat-delta-pill is-up">9%</span></button>
  <button class="stat" role="tab" aria-selected="false"><span class="stat-label">Bounce rate</span><span class="stat-value">38.6%</span><span class="stat-delta stat-delta-pill is-down is-inverse">4%</span></button>
  <button class="stat" role="tab" aria-selected="false"><span class="stat-label">Visit duration</span><span class="stat-value">2m 41s</span><span class="stat-delta stat-delta-pill is-down">7%</span></button>
</div>`,
      js: `const tabs = [...root.querySelectorAll('.stat')];
tabs.forEach(t => t.addEventListener('click', () => tabs.forEach(x => { x.classList.toggle('is-active', x === t); x.setAttribute('aria-selected', x === t); })));`
    },
    {
      title: 'Targets and breakdowns',
      center: false,
      html: `<div class="stat-grid" style="--stat-min: 15rem">
  <div class="stat stat-accent">
    <div class="stat-head"><span class="stat-label">Q4 sales quota</span><span class="stat-delta stat-delta-pill is-up">On track</span></div>
    <div class="stat-value">$1.84M <span class="stat-of">of $2.5M</span></div>
    <div class="stat-progress">
      <div class="stat-progress-bar"><span style="--value: 73.6%"></span></div>
      <div class="stat-progress-meta"><span>73.6% attained</span><span>45 days left</span></div>
    </div>
  </div>
  <div class="stat">
    <div class="stat-head"><span class="stat-label">Traffic by source</span></div>
    <div class="stat-value">96,410 <span class="stat-of">sessions</span></div>
    <div class="stat-split">
      <span style="--v: 46; --c: var(--chart-1, var(--primary))"></span>
      <span style="--v: 28; --c: var(--chart-2, var(--info))"></span>
      <span style="--v: 17; --c: var(--chart-3, var(--success))"></span>
      <span style="--v: 9; --c: var(--chart-4, var(--warning))"></span>
    </div>
    <div class="stat-legend">
      <span style="--c: var(--chart-1, var(--primary))">Organic <b>46%</b></span>
      <span style="--c: var(--chart-2, var(--info))">Direct <b>28%</b></span>
      <span style="--c: var(--chart-3, var(--success))">Social <b>17%</b></span>
      <span style="--c: var(--chart-4, var(--warning))">Email <b>9%</b></span>
    </div>
  </div>
  <div class="stat stat-primary stat-glow">
    <div class="stat-head"><span class="stat-label">API requests today</span><span class="stat-icon">${I.zap}</span></div>
    <div class="stat-value">3.92M</div>
    <div class="stat-foot"><span class="stat-delta stat-delta-pill is-up">21%</span><span class="stat-help">99.98% success</span></div>
  </div>
</div>`
    },
    {
      title: 'Side chart and plain',
      description: '<code>.stat-side</code> puts the chart next to the number; <code>.stat-plain</code> drops the card for use inside your own layouts.',
      center: false,
      html: `<div class="stat-grid" style="--stat-min: 16rem">
  <div class="stat">
    <span class="stat-label">Net revenue retention</span>
    <div class="stat-side">
      <div><div class="stat-value">118%</div><div class="stat-foot"><span class="stat-delta is-up">6 pts</span><span class="stat-help">YoY</span></div></div>
      <div class="stat-chart"><span class="sparkline" data-type="area" data-color="chart-2" data-values="104,106,105,109,111,110,113,114,116,118" style="--h: 52px"></span></div>
    </div>
  </div>
  <div class="stat">
    <span class="stat-label">Uptime, last 90 days</span>
    <div class="stat-side">
      <div><div class="stat-value">99.982%</div><div class="stat-foot"><span class="stat-help">2 incidents · 23 min</span></div></div>
      <div class="stat-chart"><span class="sparkline" data-type="bar" data-color="success" data-values="100,100,99.9,100,100,100,99.4,100,100,100,100,99.95" data-min="98" style="--h: 52px"></span></div>
    </div>
  </div>
  <div class="stat stat-plain">
    <span class="stat-label">Customers</span>
    <div class="stat-value">2,318 <span class="stat-delta stat-delta-pill is-up">142</span></div>
    <span class="stat-help" style="font-size:.8125rem">Across 41 countries</span>
  </div>
</div>`
    }
  ],
  api: [
    { name: '.stat', type: 'class', desc: 'KPI card. Children: .stat-head, .stat-label, .stat-icon, .stat-value, .stat-unit, .stat-of, .stat-foot, .stat-help.' },
    { name: '.stat-delta.is-up|is-down|is-flat', type: 'class', desc: 'Colored change with an arrow. Add .is-inverse when lower is better (churn, latency). .stat-delta-pill adds a tinted background; .no-icon hides the arrow.' },
    { name: '.stat-icon.is-success|warning|danger|info|muted', type: 'class', desc: 'Tinted icon tile (primary by default).' },
    { name: '.stat-chart / .stat-chart-bleed / .stat-side', type: 'class', desc: 'Slot for a .sparkline (see Sparkline). Bleed runs it edge to edge; side places it next to the value.' },
    { name: '.stat-progress / .stat-progress-bar / .stat-progress-meta', type: 'class', desc: 'Progress toward a target. Set --value on the inner span.' },
    { name: '.stat-split / .stat-legend', type: 'class', desc: 'Segmented share bar and legend. Set --v (weight) and --c (color) on each span.' },
    { name: '.stat-accent / .stat-glow / .stat-primary / .stat-plain', type: 'class', desc: 'Gradient top edge, soft corner glow, solid brand card, no card chrome.' },
    { name: '.stat-grid', type: 'class', desc: 'Responsive auto-fit grid. --stat-min sets the minimum card width (14rem).' },
    { name: '.stat-grid-divided', type: 'class', desc: 'One card with divided cells. .stat.is-active highlights a cell.' },
    { name: '--stat-pad', type: 'var', default: '1.25rem', desc: 'Card padding.' }
  ]
});
})();

;
/* docs/registry/data-stats-block.js */
(function () {
  var up = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';
  RanjDocs.add({
    id: 'stats-block',
    name: 'Stats Section',
    group: 'Blocks',
    description: 'Big-number sections that prove traction: a bordered metric strip, a copy-plus-stats split and a dark gradient band.',
    tags: ['new'],
    keywords: ['metrics', 'numbers', 'kpi section', 'traction'],
    demos: [
      {
        title: 'Metric strip',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head">
      <h2 class="block-title">Trusted at serious scale</h2>
      <p class="block-lead">Numbers from the last 30 days across every Northwind region.</p>
    </div>
    <div class="block-stats">
      <div class="block-stat"><div class="block-stat-value">4.2<small>B</small></div><div class="block-stat-label">Requests served</div><div class="block-stat-desc">Peak of 310k per second on Black Friday.</div></div>
      <div class="block-stat"><div class="block-stat-value">99.99<small>%</small></div><div class="block-stat-label">Uptime</div><div class="block-stat-desc">Backed by a financial SLA on Team.</div></div>
      <div class="block-stat"><div class="block-stat-value">12<small>ms</small></div><div class="block-stat-label">Median latency</div><div class="block-stat-desc">Measured from 42 edge locations.</div></div>
      <div class="block-stat"><div class="block-stat-value">18<small>k</small></div><div class="block-stat-label">Teams shipping</div><div class="block-stat-desc">From two-person startups to the Fortune 500.</div></div>
    </div>
  </div>
</section>`
      },
      {
        title: 'Split with copy',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container block-split">
    <div class="block-head block-head-start" style="margin-bottom:0">
      <span class="block-eyebrow">Impact</span>
      <h2 class="block-title">Results our customers see in the first quarter</h2>
      <p class="block-lead">We surveyed 1,240 teams six months after they migrated. The short version: less waiting, more shipping.</p>
    </div>
    <div class="block-stats-plain">
      <div class="block-stat"><div class="block-stat-value">3.4×</div><div class="block-stat-label">More deploys per week</div><span class="block-stat-delta">${up} from 9 to 31</span></div>
      <div class="block-stat"><div class="block-stat-value">-47<small>%</small></div><div class="block-stat-label">Infrastructure spend</div><span class="block-stat-delta">${up} $18k saved / mo</span></div>
      <div class="block-stat"><div class="block-stat-value">8<small>min</small></div><div class="block-stat-label">Mean time to recovery</div><div class="block-stat-desc">Down from 2.5 hours.</div></div>
      <div class="block-stat"><div class="block-stat-value">72</div><div class="block-stat-label">Net promoter score</div><div class="block-stat-desc">Industry average is 31.</div></div>
    </div>
  </div>
</section>`
      },
      {
        title: 'Dark band',
        description: 'Fixed dark art that looks the same in both themes.',
        pad: false, center: false,
        html: `<section class="block block-band">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow">2026 in numbers</span>
      <h2 class="block-title">A record year, thanks to you</h2>
    </div>
    <div class="block-stats">
      <div class="block-stat"><div class="block-stat-value">$48<small>M</small></div><div class="block-stat-label">ARR</div><div class="block-stat-desc">Up 212% year over year.</div></div>
      <div class="block-stat"><div class="block-stat-value">190</div><div class="block-stat-label">Countries</div><div class="block-stat-desc">With paying customers.</div></div>
      <div class="block-stat"><div class="block-stat-value">1.6<small>M</small></div><div class="block-stat-label">Developers</div><div class="block-stat-desc">Signed up since launch.</div></div>
      <div class="block-stat"><div class="block-stat-value">4.9<small>/5</small></div><div class="block-stat-label">G2 rating</div><div class="block-stat-desc">From 3,800 reviews.</div></div>
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-stats', type: 'class', desc: 'Bordered 4-up strip with dividers; 2×2 under 760px.' },
      { name: '.block-stat', type: 'class', desc: 'One metric: .block-stat-value (with optional <small> unit), .block-stat-label, .block-stat-desc, .block-stat-delta.' },
      { name: '.block-stats-plain', type: 'class', desc: 'Borderless 2-column stats with an accent rule.' },
      { name: '.block-split', type: 'class', desc: 'Two-column copy + content layout.' },
      { name: '.block-band', type: 'class', desc: 'Dark gradient section (on .block).' }
    ]
  });
})();

;
/* docs/registry/data-table.js */
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

;
/* docs/registry/data-team-block.js */
(function () {
  var U = function (id, w, h) { return 'https://images.unsplash.com/' + id + '?w=' + w + '&h=' + h + '&fit=crop&crop=faces&q=70'; };
  var X = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.4L5.4 21H2.3l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.3 4.7H5.5z"/></svg>';
  var IN = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/></svg>';
  var people = [
    ['Maya Patel', 'Co-founder & CEO', 'photo-1494790108377-be9c29b29330', 'Previously led payments at Stripe Europe.'],
    ['Daniel Okafor', 'Co-founder & CTO', 'photo-1500648767791-00dcc994a43e', 'Built the edge runtime behind 4B requests a month.'],
    ['Sofia Lindqvist', 'Head of Design', 'photo-1438761681033-6461ffad8d80', 'Design systems at Spotify and Linear.'],
    ['Marcus Chen', 'VP Engineering', 'photo-1506794778202-cad84cf45f1d', 'Scaled infra teams from 4 to 60 engineers.'],
    ['Priya Raman', 'Head of Growth', 'photo-1544005313-94ddf0286df2', 'Grew Kite from 0 to 2M users.'],
    ['Leo Martins', 'Developer Advocate', 'photo-1507003211169-0a1dd7228f2d', 'Writes the changelog everyone reads.'],
    ['Hannah Becker', 'Customer Success', 'photo-1534528741775-53994a69daeb', 'Average first reply: 4 minutes.']
  ];
  function card(p) {
    return `      <article class="block-member">
        <div class="block-member-photo"><img src="${U(p[2], 400, 500)}" alt="${p[0]}" loading="lazy">
          <div class="block-member-social"><a href="#" aria-label="${p[0]} on X">${X}</a><a href="#" aria-label="${p[0]} on LinkedIn">${IN}</a></div>
        </div>
        <b>${p[0]}</b><span>${p[1]}</span>
        <p>${p[3]}</p>
      </article>`;
  }
  RanjDocs.add({
    id: 'team-block',
    name: 'Team',
    group: 'Blocks',
    description: 'Meet-the-team sections: portrait cards with hover-revealed social links, and a compact list.',
    tags: ['new'],
    keywords: ['people', 'about us', 'staff', 'members'],
    demos: [
      {
        title: 'Portrait grid',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow">Our team</span>
      <h2 class="block-title">The people behind Northwind</h2>
      <p class="block-lead">A remote team of 38 across 14 countries. We obsess over speed, craft and answering support tickets ourselves.</p>
    </div>
    <div class="block-team">
${people.slice(0, 7).map(card).join('\n')}
      <a class="block-hiring" href="#"><b>You?</b>We're hiring for 6 roles.<span>See open positions →</span></a>
    </div>
  </div>
</section>`
      },
      {
        title: 'Compact list',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container">
    <div class="block-head block-head-start">
      <h2 class="block-title">Leadership</h2>
    </div>
    <div class="block-team block-team-compact">
${people.slice(0, 6).map(function (p) { return `      <div class="block-member"><img src="${U(p[2], 120, 120)}" alt=""><b>${p[0]}</b><span>${p[1]}</span></div>`; }).join('\n')}
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-team', type: 'class', desc: 'Responsive 4 / 3 / 2 column grid.' },
      { name: '.block-member', type: 'class', desc: 'Person: .block-member-photo, <b> name, <span> role, optional <p> bio.' },
      { name: '.block-member-social', type: 'class', desc: 'Links revealed on hover / focus inside the photo.' },
      { name: '.block-team-compact', type: 'class', desc: 'Avatar-left rows in bordered tiles.' },
      { name: '.block-hiring', type: 'class', desc: 'Dashed “we are hiring” tile.' }
    ]
  });
})();

;
/* docs/registry/data-testimonials-block.js */
(function () {
  var U = function (id) { return 'https://images.unsplash.com/' + id + '?w=160&h=160&fit=crop&crop=faces&q=70'; };
  var star = '<svg viewBox="0 0 24 24"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
  var stars = '<div class="block-stars" aria-label="5 out of 5 stars">' + star + star + star + star + star + '</div>';
  function q(text, name, role, img, logo) {
    return `      <figure class="block-quote">
        ${stars}
        <blockquote>${text}</blockquote>
        <figcaption class="block-person"><img src="${U(img)}" alt="" loading="lazy"><div><b>${name}</b><span>${role}</span></div>${logo ? '<span class="block-person-logo">' + logo + '</span>' : ''}</figcaption>
      </figure>`;
  }
  RanjDocs.add({
    id: 'testimonials-block',
    name: 'Testimonials',
    group: 'Blocks',
    description: 'Social proof sections: a card grid, a masonry wall of love, and a single featured quote.',
    tags: ['new'],
    keywords: ['reviews', 'quotes', 'social proof', 'wall of love', 'customers'],
    demos: [
      {
        title: 'Card grid',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <div class="block-head">
      <span class="block-eyebrow">Customers</span>
      <h2 class="block-title">Loved by 12,000+ product teams</h2>
    </div>
    <div class="block-testimonials">
${q('We cut our release cycle from two weeks to <mark>twice a day</mark>. Preview links alone changed how design and engineering work together.', 'Maya Patel', 'VP Engineering', 'photo-1494790108377-be9c29b29330', 'Lumen')}
${q('Migrating 140 services took a weekend, not a quarter. Support answered every question in under an hour, including on Sunday.', 'Daniel Okafor', 'Staff Engineer', 'photo-1500648767791-00dcc994a43e', 'Fathom')}
${q('Our p95 latency in Asia dropped by <mark>61%</mark> the day we switched. Customers noticed before we announced it.', 'Sofia Lindqvist', 'CTO', 'photo-1438761681033-6461ffad8d80', 'Arcade')}
    </div>
  </div>
</section>`
      },
      {
        title: 'Wall of love',
        description: 'CSS multi-column masonry; cards keep their natural height.',
        pad: false, center: false,
        html: `<section class="block block-subtle">
  <div class="block-container">
    <div class="block-head">
      <h2 class="block-title">Don't take our word for it</h2>
      <p class="block-lead">Here is what builders say after their first month.</p>
    </div>
    <div class="block-wall">
${q('Honestly the best developer experience I have had since I started coding. It just gets out of the way.', 'Leo Martins', 'Indie hacker', 'photo-1507003211169-0a1dd7228f2d')}
${q('The analytics replaced three tools and saved us $2,400 a month. Our finance team sent a thank-you note.', 'Priya Raman', 'Head of Growth, Kite', 'photo-1544005313-94ddf0286df2')}
${q('Rollbacks are instant. We deploy on Fridays now and nobody panics.', 'Marcus Chen', 'Platform Lead', 'photo-1506794778202-cad84cf45f1d')}
${q('I onboarded our whole agency of 35 people in an afternoon. Permissions finally make sense, and client previews look professional out of the box.', 'Hannah Becker', 'Founder, Studio Nord', 'photo-1534528741775-53994a69daeb')}
${q('Their changelog is my favourite thing to read on Tuesdays.', 'Tomás Rivera', 'Frontend Engineer', 'photo-1472099645785-5658abf4ff4e')}
${q('Edge functions with zero cold starts. We moved our auth middleware over and shaved 180 ms off every page.', 'Aisha Khan', 'Senior SRE', 'photo-1517841905240-472988babdf9')}
    </div>
  </div>
</section>`
      },
      {
        title: 'Featured quote',
        pad: false, center: false,
        html: `<section class="block">
  <div class="block-container">
    <figure class="block-quote-hero">
      <svg class="block-quote-mark" viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 6C6 7.4 4 10.3 4 14v4h6v-6H7c0-2.2 1.1-3.8 3.3-4.8zm10 0C16 7.4 14 10.3 14 14v4h6v-6h-3c0-2.2 1.1-3.8 3.3-4.8z"/></svg>
      <blockquote>“Northwind is the rare tool that made our engineers faster <span class="block-gradient-text">and</span> our infrastructure bill smaller. It paid for itself in the first month.”</blockquote>
      <figcaption class="block-person"><img src="${U('photo-1539571696357-5a69c17a67c6')}" alt=""><div><b>Ethan Brooks</b><span>Co-founder &amp; CEO, Parcel</span></div></figcaption>
    </figure>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.block-testimonials', type: 'class', desc: 'Responsive 3 / 2 / 1 column grid.' },
      { name: '.block-wall', type: 'class', desc: 'Masonry columns (min 17rem each).' },
      { name: '.block-quote', type: 'class', desc: 'Testimonial card (figure). Use <mark> inside the blockquote to highlight a phrase.' },
      { name: '.block-stars', type: 'class', desc: 'Row of star SVGs.' },
      { name: '.block-person', type: 'class', desc: 'Avatar + name + role; optional .block-person-logo on the right.' },
      { name: '.block-quote-hero', type: 'class', desc: 'Large centered single quote.' }
    ]
  });
})();

;
/* docs/registry/data-timeline.js */
(function () {
var I = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="M12 15 9 12a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/></svg>',
  git: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 3-10.5 6"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>'
};
var face = function (id) { return 'https://images.unsplash.com/' + id + '?w=96&h=96&fit=crop&crop=faces&q=70'; };
RanjDocs.add({
  id: 'timeline',
  name: 'Timeline',
  group: 'Data Display',
  description: 'Chronological events with icon, avatar or dot markers connected by a line. Vertical, alternating (collapses on narrow containers), activity feed and horizontal layouts, with an optional reveal-on-scroll.',
  tags: ['new'],
  keywords: ['history', 'changelog', 'activity', 'feed', 'events', 'roadmap', 'steps', 'audit log'],
  demos: [
    {
      title: 'Deployment history',
      center: false,
      html: `<ol class="timeline" style="max-width: 560px; margin: auto">
  <li class="timeline-item">
    <span class="timeline-marker is-primary is-pulse">${I.rocket}</span>
    <div class="timeline-content">
      <div class="timeline-head"><span class="timeline-title">Promoted to production</span><time class="timeline-time">2 min ago</time></div>
      <p class="timeline-body">Build <b>#4821</b> rolled out to 100% of traffic in us-east-1 and eu-west-2.</p>
    </div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker is-success">${I.check}</span>
    <div class="timeline-content">
      <div class="timeline-head"><span class="timeline-title">Checks passed</span><time class="timeline-time">9 min ago</time></div>
      <p class="timeline-body">412 tests, lint, type-check and Lighthouse (score 98) all green.</p>
    </div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker is-warning">${I.alert}</span>
    <div class="timeline-content">
      <div class="timeline-head"><span class="timeline-title">Bundle size warning</span><time class="timeline-time">11 min ago</time></div>
      <p class="timeline-body">checkout.js grew by 14.2 kB gzipped (budget: 10 kB).</p>
    </div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker">${I.git}</span>
    <div class="timeline-content">
      <div class="timeline-head"><span class="timeline-title">Merged <span style="font-family:var(--font-mono);font-weight:500">feat/apple-pay</span></span><time class="timeline-time">14 min ago</time></div>
      <p class="timeline-body">Maya Chen merged 7 commits into main.</p>
    </div>
  </li>
</ol>`
    },
    {
      title: 'Activity feed',
      description: '<code>.timeline-feed</code> for inline sentences with avatar markers, small icon markers and nested cards.',
      center: false,
      html: `<ol class="timeline timeline-feed" style="max-width: 620px; margin: auto">
  <li class="timeline-item">
    <span class="timeline-marker"><img src="${face('photo-1494790108377-be9c29b29330')}" alt=""></span>
    <div class="timeline-content">
      <b>Sofia Rossi</b> commented on <b>ENG-1432</b><time class="timeline-time">12m</time>
      <div class="timeline-card">Repro'd on Safari 17.4 only. The <code>ResizeObserver</code> loop fires before layout settles; wrapping in rAF fixes it. PR incoming.</div>
    </div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker is-small">${I.tag}</span>
    <div class="timeline-content"><b>Daniel Okafor</b> added labels <span class="timeline-tag">bug</span> <span class="timeline-tag">p1</span><time class="timeline-time">40m</time></div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker is-small">${I.user}</span>
    <div class="timeline-content"><b>Daniel Okafor</b> assigned the issue to <b>Sofia Rossi</b><time class="timeline-time">41m</time></div>
  </li>
  <li class="timeline-item">
    <span class="timeline-marker"><img src="${face('photo-1500648767791-00dcc994a43e')}" alt=""></span>
    <div class="timeline-content">
      <b>Marcus Lee</b> opened this issue<time class="timeline-time">2h</time>
      <div class="timeline-card">Charts flicker when the dashboard sidebar collapses. Happens on every resize in Safari, never in Chrome.</div>
    </div>
  </li>
</ol>`
    },
    {
      title: 'Alternating roadmap',
      description: 'Center line with items on alternating sides. Below 640px of container width it falls back to a single column. <code>.timeline-reveal</code> fades items in on scroll.',
      center: false,
      html: `<ol class="timeline timeline-alternate timeline-boxed timeline-reveal">
  <li class="timeline-item is-done">
    <span class="timeline-aside">Q1 2026</span>
    <span class="timeline-marker is-success">${I.check}</span>
    <div class="timeline-content"><span class="timeline-eyebrow">Shipped</span><div class="timeline-title">Realtime collaboration</div><p class="timeline-body">Live cursors, presence and conflict-free editing for every document.</p><div class="timeline-tags"><span class="timeline-tag">Editor</span><span class="timeline-tag">CRDT</span></div></div>
  </li>
  <li class="timeline-item is-done">
    <span class="timeline-aside">Q2 2026</span>
    <span class="timeline-marker is-success">${I.check}</span>
    <div class="timeline-content"><span class="timeline-eyebrow">Shipped</span><div class="timeline-title">Public API v2</div><p class="timeline-body">REST and webhooks with typed SDKs for TypeScript, Python and Go.</p><div class="timeline-tags"><span class="timeline-tag">Platform</span></div></div>
  </li>
  <li class="timeline-item">
    <span class="timeline-aside">Q3–Q4 2026</span>
    <span class="timeline-marker is-primary is-pulse">${I.rocket}</span>
    <div class="timeline-content"><span class="timeline-eyebrow">In progress</span><div class="timeline-title">AI workspace search</div><p class="timeline-body">Ask questions across docs, issues and chat with cited answers.</p><div class="timeline-tags"><span class="timeline-tag">AI</span><span class="timeline-tag">Search</span></div></div>
  </li>
  <li class="timeline-item">
    <span class="timeline-aside">2027</span>
    <span class="timeline-marker"></span>
    <div class="timeline-content"><span class="timeline-eyebrow" style="color:var(--muted-fg)">Planned</span><div class="timeline-title">Self-hosted edition</div><p class="timeline-body">Single-binary deploy with SSO, audit logs and air-gapped licensing.</p></div>
  </li>
</ol>`
    },
    {
      title: 'Horizontal',
      description: 'Scrolls sideways on small screens.',
      center: false,
      html: `<ol class="timeline timeline-horizontal">
  <li class="timeline-item is-done"><span class="timeline-marker is-success">${I.check}</span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Order placed</span><time class="timeline-time">Nov 12, 09:14</time></div></div></li>
  <li class="timeline-item is-done"><span class="timeline-marker is-success">${I.check}</span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Packed</span><time class="timeline-time">Nov 12, 16:40</time></div></div></li>
  <li class="timeline-item"><span class="timeline-marker is-primary is-pulse">${I.rocket}</span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">In transit</span><time class="timeline-time">Nov 14, 07:02</time></div><p class="timeline-body">Newark, NJ hub</p></div></li>
  <li class="timeline-item"><span class="timeline-marker"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Out for delivery</span><time class="timeline-time">Expected Nov 17</time></div></div></li>
  <li class="timeline-item"><span class="timeline-marker"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Delivered</span><time class="timeline-time">—</time></div></div></li>
</ol>`
    },
    {
      title: 'Compact dots',
      html: `<ol class="timeline timeline-sm" style="max-width: 360px">
  <li class="timeline-item"><span class="timeline-marker is-primary"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Invoice paid</span><time class="timeline-time">Today</time></div></div></li>
  <li class="timeline-item"><span class="timeline-marker"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Reminder sent</span><time class="timeline-time">Nov 10</time></div></div></li>
  <li class="timeline-item"><span class="timeline-marker is-danger"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Payment failed</span><time class="timeline-time">Nov 08</time></div></div></li>
  <li class="timeline-item"><span class="timeline-marker"></span><div class="timeline-content"><div class="timeline-head"><span class="timeline-title">Invoice issued</span><time class="timeline-time">Nov 01</time></div></div></li>
</ol>`
    }
  ],
  api: [
    { name: '.timeline', type: 'class', desc: 'An ol of .timeline-item. Each item has a .timeline-marker and a .timeline-content.' },
    { name: '.timeline-marker', type: 'class', desc: 'Icon, initials or img. Empty marker renders a dot. Tones: .is-primary, .is-success, .is-warning, .is-danger, .is-info; .is-pulse adds a live ping; .is-small (feed) shrinks it.' },
    { name: '.timeline-head / -title / -time / -body / -eyebrow / -card / -tags / -tag', type: 'class', desc: 'Content parts.' },
    { name: '.timeline-item.is-done', type: 'class', desc: 'Tints the connector line below the item with the brand color.' },
    { name: '.timeline-boxed', type: 'class', desc: 'Puts each item’s content in a card.' },
    { name: '.timeline-feed', type: 'class', desc: 'Activity-feed layout for inline sentences with avatars.' },
    { name: '.timeline-alternate', type: 'class', desc: 'Center line, alternating sides from 640px of container width. .timeline-aside shows a date on the opposite side.' },
    { name: '.timeline-horizontal', type: 'class', desc: 'Left-to-right steps; scrolls horizontally when space runs out.' },
    { name: '.timeline-sm', type: 'class', desc: 'Compact dot timeline.' },
    { name: '.timeline-reveal', type: 'class', desc: 'With ranj.js, items fade up as they enter the viewport (instant with reduced motion).' },
    { name: '--tl-marker / --tl-dot / --tl-gap', type: 'var', default: '2rem / .75rem / 1.75rem', desc: 'Marker size, dot size, space between items.' },
    { name: '--tl-line / --tl-line-w / --tl-ring', type: 'var', default: 'var(--border) / 2px / var(--bg)', desc: 'Connector color and width; ring around markers (set to your surface color).' }
  ]
});
})();

;
/* docs/registry/data-tree-view.js */
RanjDocs.add({
  id: 'tree-view',
  name: 'Tree View',
  group: 'Data Display',
  description: 'Write a nested list, get an accessible file tree: animated expand/collapse, indent guides, file-type icons, selection, tri-state checkboxes and full keyboard support (arrows, Home/End, type-ahead, *).',
  tags: ['new', 'js'],
  keywords: ['file tree', 'explorer', 'folders', 'hierarchy', 'nested list', 'treeview', 'sidebar tree'],
  demos: [
    {
      title: 'File explorer',
      description: 'Icons are picked from the file extension. Add <code>data-open</code> to expand a folder and <code>.tree-meta</code> for trailing info like git status.',
      html: `<ul class="tree tree-panel" data-tree aria-label="Project files" style="width: 300px">
  <li data-open>acme-web
    <ul>
      <li data-open>src
        <ul>
          <li data-open>components
            <ul>
              <li>Button.tsx</li>
              <li aria-selected="true">DataTable.tsx <span class="tree-meta is-modified">M</span></li>
              <li>Sidebar.tsx <span class="tree-meta is-added">U</span></li>
            </ul>
          </li>
          <li>hooks
            <ul><li>useDebounce.ts</li><li>useMediaQuery.ts</li></ul>
          </li>
          <li>styles
            <ul><li>globals.css</li><li>tokens.css</li></ul>
          </li>
          <li>main.tsx</li>
        </ul>
      </li>
      <li>public
        <ul><li>favicon.svg</li><li>og-image.png</li></ul>
      </li>
      <li>.env.local</li>
      <li>package.json</li>
      <li>pnpm-lock.yaml</li>
      <li>README.md</li>
    </ul>
  </li>
</ul>`,
      height: 460
    },
    {
      title: 'Checkboxes',
      description: '<code>data-checkboxes</code> adds tri-state checkboxes that cascade down and roll up. Listen for <code>ranj:check</code>.',
      html: `<div style="display:grid;gap:.75rem;width:320px">
  <ul class="tree tree-panel" data-tree data-checkboxes data-select="none" aria-label="Permissions">
    <li data-open data-icon="none">Billing
      <ul>
        <li data-icon="none" data-checked="true">View invoices</li>
        <li data-icon="none" data-checked="true">Download receipts</li>
        <li data-icon="none">Change payment method</li>
      </ul>
    </li>
    <li data-open data-icon="none">Projects
      <ul>
        <li data-icon="none" data-checked="true">Create projects</li>
        <li data-icon="none" data-checked="true">Archive projects</li>
      </ul>
    </li>
    <li data-icon="none">Members
      <ul>
        <li data-icon="none">Invite members</li>
        <li data-icon="none">Remove members</li>
        <li data-icon="none">Change roles</li>
      </ul>
    </li>
  </ul>
  <p class="demo-tree-out" style="font-size:.8rem;color:var(--muted-fg);margin:0">4 permissions granted</p>
</div>`,
      js: `const out = root.querySelector('.demo-tree-out');
root.addEventListener('ranj:check', (e) => { out.textContent = e.detail.checked.length + ' permission' + (e.detail.checked.length === 1 ? '' : 's') + ' granted'; });`,
      height: 400
    },
    {
      title: 'Navigation tree',
      description: 'No guides, custom icons via <code>data-icon</code>, and the <code>ranj:select</code> event.',
      html: `<div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-start">
  <ul class="tree tree-no-guides tree-sm" data-tree aria-label="Docs" style="width: 240px">
    <li data-open data-icon="md">Getting started
      <ul><li data-icon="none">Installation</li><li data-icon="none" aria-selected="true">Theming</li><li data-icon="none">Dark mode</li></ul>
    </li>
    <li data-icon="code">Components
      <ul><li data-icon="none">Button</li><li data-icon="none">Data table</li><li data-icon="none">Tree view</li></ul>
    </li>
    <li data-icon="json">API reference
      <ul><li data-icon="none">Ranj.define</li><li data-icon="none">Ranj.position</li></ul>
    </li>
  </ul>
  <div class="demo-tree-sel" style="font-size:.85rem;color:var(--muted-fg);padding:.4rem .2rem">Selected: <b style="color:var(--fg)">Theming</b></div>
</div>`,
      js: `const sel = root.querySelector('.demo-tree-sel b');
root.addEventListener('ranj:select', (e) => { sel.textContent = e.detail.label; });`
    }
  ],
  api: [
    { name: '.tree[data-tree]', type: 'attr', desc: 'Nested ul/li becomes an ARIA tree. Text before a nested list is the label.' },
    { name: 'li[data-open]', type: 'attr', desc: 'Start expanded.' },
    { name: 'li[data-icon]', type: 'attr', default: 'auto', desc: 'folder | file | code | ts | js | css | html | json | md | img | lock | env | none. Auto: folders for branches, extension for files.' },
    { name: 'li[data-value]', type: 'attr', desc: 'Value reported in events (defaults to the label).' },
    { name: 'li[aria-selected] / [aria-disabled] / [data-checked]', type: 'attr', desc: 'Initial selection, disabled item, initial check state.' },
    { name: 'data-checkboxes', type: 'attr', default: 'false', desc: 'Tri-state checkboxes that cascade to children and roll up to parents.' },
    { name: 'data-select', type: 'attr', default: 'single', desc: 'single | multiple (Cmd/Ctrl-click) | none.' },
    { name: 'data-open-all / data-icons', type: 'attr', default: 'false / true', desc: 'Expand everything; show file icons.' },
    { name: '.tree-panel / .tree-sm / .tree-no-guides', type: 'class', desc: 'Card frame, compact rows, hide indent guides.' },
    { name: '.tree-meta', type: 'class', desc: 'Right-aligned trailing info in a row. Tones: .is-added, .is-modified, .is-deleted.' },
    { name: '--tree-indent / --tree-row-h', type: 'var', default: '1.1rem / 1.9rem', desc: 'Indent per level and row height. --tree-guide sets the guide color.' },
    { name: 'el.ranjTree', type: 'js', desc: '{ expand(li), collapse(li), expandAll(), collapseAll(), select(li), checked() }' },
    { name: 'ranj:select', type: 'event', desc: 'On the tree. detail: { item, value, label, selected }' },
    { name: 'ranj:check', type: 'event', desc: 'On the tree. detail: { item, checked: [leaf values] }' },
    { name: 'ranj:expand / ranj:collapse', type: 'event', desc: 'On the item. detail: { item, label }' }
  ]
});

;
/* docs/registry/forms-calendar.js */
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

;
/* docs/registry/forms-checkbox.js */
(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  RanjDocs.add({
    id: 'checkbox',
    name: 'Checkbox',
    group: 'Forms',
    description: 'A real <code>&lt;input type="checkbox"&gt;</code> with a custom box: the check draws itself in, the box pops, and indeterminate, sizes, descriptions and selectable cards are built in.',
    keywords: ['check', 'tick', 'indeterminate', 'select all', 'checkbox card', 'todo'],
    demos: [
      {
        title: 'Default',
        html: `
<div class="checkbox-group">
  <label class="checkbox"><input type="checkbox" checked><span class="checkbox-mark"></span>Email me about product updates</label>
  <label class="checkbox"><input type="checkbox"><span class="checkbox-mark"></span>Send weekly digest</label>
  <label class="checkbox"><input type="checkbox" disabled><span class="checkbox-mark"></span>SMS alerts (verify phone first)</label>
  <label class="checkbox"><input type="checkbox" checked disabled><span class="checkbox-mark"></span>Security notices (required)</label>
</div>`
      },
      {
        title: 'Select all (indeterminate)',
        description: 'A checkbox with <code>data-check-all="name"</code> controls every checkbox with that name and shows the mixed state.',
        html: `
<div class="demo-checkbox-list" data-check-scope>
  <label class="checkbox demo-checkbox-head"><input type="checkbox" data-check-all="files"><span class="checkbox-mark"></span>Select all files</label>
  <label class="checkbox"><input type="checkbox" name="files" checked><span class="checkbox-mark"></span>Q4-roadmap.pdf <small>2.4 MB</small></label>
  <label class="checkbox"><input type="checkbox" name="files"><span class="checkbox-mark"></span>brand-guidelines.fig <small>18 MB</small></label>
  <label class="checkbox"><input type="checkbox" name="files" checked><span class="checkbox-mark"></span>customer-interviews.mp4 <small>412 MB</small></label>
</div>`,
        css: `
.demo-checkbox-list { display: flex; flex-direction: column; width: 22rem; max-width: 100%; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); overflow: hidden; }
.demo-checkbox-list .checkbox { padding: .7rem .9rem; border-top: 1px solid var(--border); }
.demo-checkbox-list .checkbox small { margin-left: auto; color: var(--muted-fg); font-size: .75rem; }
.demo-checkbox-list .demo-checkbox-head { border-top: 0; background: var(--bg-subtle); font-weight: 500; }`
      },
      {
        title: 'With description, sizes and colors',
        html: `
<div style="display:grid;gap:1.25rem;width:24rem;max-width:100%">
  <label class="checkbox"><input type="checkbox" checked><span class="checkbox-mark"></span>
    <span class="checkbox-body"><span class="checkbox-label">Two-factor authentication</span><span class="checkbox-desc">Require a code from your authenticator app when signing in on a new device.</span></span>
  </label>
  <div class="checkbox-group checkbox-group-horizontal">
    <label class="checkbox checkbox-sm"><input type="checkbox" checked><span class="checkbox-mark"></span>Small</label>
    <label class="checkbox"><input type="checkbox" checked><span class="checkbox-mark"></span>Default</label>
    <label class="checkbox checkbox-lg"><input type="checkbox" checked><span class="checkbox-mark"></span>Large</label>
    <label class="checkbox checkbox-round checkbox-success"><input type="checkbox" checked><span class="checkbox-mark"></span>Round</label>
    <label class="checkbox checkbox-destructive"><input type="checkbox" checked><span class="checkbox-mark"></span>Danger</label>
    <label class="checkbox"><input type="checkbox" data-indeterminate><span class="checkbox-mark"></span>Mixed</label>
  </div>
</div>`
      },
      {
        title: 'Todo list',
        description: '<code>.checkbox-strike</code> crosses out completed items.',
        html: `
<div class="checkbox-group" style="width:20rem;max-width:100%">
  <label class="checkbox checkbox-strike checkbox-round"><input type="checkbox" checked><span class="checkbox-mark"></span><span>Draft launch announcement</span></label>
  <label class="checkbox checkbox-strike checkbox-round"><input type="checkbox" checked><span class="checkbox-mark"></span><span>Record product demo</span></label>
  <label class="checkbox checkbox-strike checkbox-round"><input type="checkbox"><span class="checkbox-mark"></span><span>Schedule social posts</span></label>
  <label class="checkbox checkbox-strike checkbox-round"><input type="checkbox"><span class="checkbox-mark"></span><span>Email the beta list</span></label>
</div>`
      },
      {
        title: 'Checkbox cards',
        html: `
<div class="card-grid" style="width:40rem;max-width:100%">
  <label class="checkbox-card"><input type="checkbox" checked><span class="checkbox-mark"></span>
    <span class="checkbox-body"><span class="checkbox-label">Analytics</span><span class="checkbox-desc">Funnels, retention and live dashboards.</span></span></label>
  <label class="checkbox-card"><input type="checkbox"><span class="checkbox-mark"></span>
    <span class="checkbox-body"><span class="checkbox-label">Session replay</span><span class="checkbox-desc">Watch how people really use your app.</span></span></label>
  <label class="checkbox-card"><input type="checkbox" checked><span class="checkbox-mark"></span>
    <span class="checkbox-body"><span class="checkbox-label">Feature flags</span><span class="checkbox-desc">Ship safely to 1% first.</span></span></label>
</div>`
      }
    ],
    api: [
      { name: '.checkbox', type: 'class', desc: '<code>&lt;label class="checkbox"&gt;&lt;input type="checkbox"&gt;&lt;span class="checkbox-mark"&gt;&lt;/span&gt;Text&lt;/label&gt;</code>. The mark is inserted if missing. A bare <code>&lt;input class="checkbox"&gt;</code> also works.' },
      { name: '.checkbox-sm / .checkbox-lg / .checkbox-round', type: 'class', desc: 'Sizes and a circular box.' },
      { name: '.checkbox-success / .checkbox-destructive', type: 'class', desc: 'Colors (or set <code>--check</code>).' },
      { name: '.checkbox-strike', type: 'class', desc: 'Strike through the label when checked.' },
      { name: '.checkbox-body / .checkbox-label / .checkbox-desc', type: 'class', desc: 'Label with a description line.' },
      { name: '.checkbox-card / .card-grid', type: 'class', desc: 'Selectable card and a responsive grid for them.' },
      { name: '.checkbox-group / .checkbox-group-horizontal', type: 'class', desc: 'Stacks.' },
      { name: 'data-indeterminate', type: 'attr', desc: 'Start in the mixed state.' },
      { name: 'data-check-all="name"', type: 'attr', desc: '“Select all” for checkboxes with that name (scoped to the form or <code>[data-check-scope]</code>).' },
      { name: '--size / --check', type: 'var', default: '1.0625rem / --primary', desc: 'Box size and checked color.' }
    ]
  });
})();

;
/* docs/registry/forms-color-picker.js */
RanjDocs.add({
  id: 'color-picker',
  name: 'Color picker',
  group: 'Forms',
  description: 'Pick a color from swatches, a saturation/brightness area and a hue rail, or type a hex value — in a popover or inline. Fully keyboard-driven, with the native EyeDropper where supported.',
  tags: ['new', 'js'],
  keywords: ['colour', 'hex', 'hsv', 'swatches', 'eyedropper', 'brand color', 'theme'],
  demos: [
    {
      title: 'Popover',
      description: 'The panel retints the page accent live — try it.',
      height: 140,
      html: `
<div class="field" style="margin:0">
  <label class="label">Brand color</label>
  <div class="color-picker" data-value="#6366f1" data-name="brand"></div>
</div>
<div class="demo-color-preview"><button class="btn btn-primary btn-sm">Primary button</button><span class="demo-color-chip">Badge</span></div>`,
      js: `
const cp = root.querySelector('.color-picker'), prev = root.querySelector('.demo-color-preview');
const apply = hex => { prev.style.setProperty('--primary', hex); prev.style.setProperty('--primary-hover', hex); prev.style.setProperty('--demo-c', hex); };
cp.addEventListener('ranj:input', e => apply(e.detail.value));
apply('#6366f1');`,
      css: `.demo-color-preview { display: flex; gap: .6rem; align-items: center; } .demo-color-chip { padding: .2rem .6rem; border-radius: 99px; font-size: .75rem; font-weight: 600; color: var(--demo-c); background: color-mix(in oklab, var(--demo-c) 14%, transparent); }`
    },
    {
      title: 'Inline',
      html: `<div class="color-picker" data-inline data-value="#10b981" data-swatches="#f43f5e,#f97316,#eab308,#22c55e,#10b981,#14b8a6,#0ea5e9,#6366f1,#a855f7,#ec4899,#78716c,#18181b"></div>`
    },
    {
      title: 'Swatches only',
      description: 'For a short fixed palette, plain radios are enough: <code>.swatch-picker</code>.',
      html: `
<div class="swatch-picker" role="radiogroup" aria-label="Label color">
  <label><input type="radio" name="swatch-demo" value="slate" aria-label="Slate"><span style="--c:#64748b"></span></label>
  <label><input type="radio" name="swatch-demo" value="red" aria-label="Red"><span style="--c:#ef4444"></span></label>
  <label><input type="radio" name="swatch-demo" value="amber" aria-label="Amber" checked><span style="--c:#f59e0b"></span></label>
  <label><input type="radio" name="swatch-demo" value="green" aria-label="Green"><span style="--c:#22c55e"></span></label>
  <label><input type="radio" name="swatch-demo" value="blue" aria-label="Blue"><span style="--c:#3b82f6"></span></label>
  <label><input type="radio" name="swatch-demo" value="violet" aria-label="Violet"><span style="--c:#8b5cf6"></span></label>
  <label><input type="radio" name="swatch-demo" value="pink" aria-label="Pink"><span style="--c:#ec4899"></span></label>
</div>`
    }
  ],
  api: [
    { name: '.color-picker', type: 'class', desc: 'Trigger button + popover (or inline panel).' },
    { name: 'data-value', type: 'attr', default: '#6366f1', desc: 'Initial hex.' },
    { name: 'data-name', type: 'attr', desc: 'Hidden input with the hex value.' },
    { name: 'data-swatches', type: 'attr', desc: 'Comma-separated hex list; empty string hides swatches.' },
    { name: 'data-inline', type: 'attr', desc: 'Render the panel in place instead of a popover.' },
    { name: 'data-label', type: 'attr', default: 'Color', desc: 'Accessible name used in labels.' },
    { name: '.swatch-picker', type: 'class', desc: 'CSS-only radio swatches (<code>--c</code> on each span).' },
    { name: 'Keyboard', type: 'attr', desc: 'Area: ← → saturation, ↑ ↓ brightness (Shift ×10). Hue: ← → (Shift ×15), Home/End.' },
    { name: 'Ranj.color', type: 'js', desc: '<code>hexToRgb, rgbToHex, rgbToHsv, hsvToRgb</code> helpers.' },
    { name: 'ranj:input / ranj:change', type: 'event', desc: 'detail: <code>{ value: "#10b981", rgb, hsv }</code> — live while dragging / settled.' }
  ]
});

;
/* docs/registry/forms-combobox.js */
RanjDocs.add({
  id: 'combobox',
  name: 'Combobox',
  group: 'Forms',
  description: 'An editable input with a filtered listbox: arrow keys move through matches (<code>aria-activedescendant</code>), Enter picks, and you can let people create new options or load results asynchronously.',
  tags: ['js'],
  keywords: ['autocomplete', 'typeahead', 'autosuggest', 'filter', 'async search', 'creatable'],
  demos: [
    {
      title: 'Default',
      height: 320,
      html: `
<div class="field" style="width:20rem;max-width:100%">
  <label class="label">Language</label>
  <div class="combobox" data-name="language" data-strict>
    <input class="combobox-input" placeholder="Search languages…">
    <ul class="combobox-list">
      <li class="combobox-option" data-value="ts">TypeScript</li>
      <li class="combobox-option" data-value="js">JavaScript</li>
      <li class="combobox-option" data-value="py">Python</li>
      <li class="combobox-option" data-value="rs">Rust</li>
      <li class="combobox-option" data-value="go">Go</li>
      <li class="combobox-option" data-value="swift">Swift</li>
      <li class="combobox-option" data-value="kt">Kotlin</li>
      <li class="combobox-option" data-value="rb">Ruby</li>
      <li class="combobox-option" data-value="ex" data-disabled>Elixir (unsupported)</li>
    </ul>
  </div>
  <p class="field-hint">v1 markup — <code>data-strict</code> only accepts listed values.</p>
</div>`
    },
    {
      title: 'Create new options',
      description: 'With <code>data-create</code>, a “Create …” row appears when nothing matches exactly.',
      height: 320,
      html: `
<div class="field" style="width:20rem;max-width:100%">
  <label class="label">Label</label>
  <div class="combobox" data-create data-name="label" data-autohighlight data-options='[{"value":"bug","label":"Bug","icon":"🐞","group":"Type"},{"value":"feature","label":"Feature","icon":"✨","group":"Type"},{"value":"docs","label":"Documentation","icon":"📚","group":"Type"},{"value":"p0","label":"P0 – Critical","group":"Priority"},{"value":"p1","label":"P1 – High","group":"Priority"},{"value":"p2","label":"P2 – Normal","group":"Priority"}]'>
    <input placeholder="Add a label…">
  </div>
  <p class="field-hint" id="combobox-created">Type “design” and press Enter.</p>
</div>`,
      js: `
root.querySelector('.combobox').addEventListener('ranj:create', e => root.querySelector('#combobox-created').textContent = 'Created “' + e.detail.label + '”');`
    },
    {
      title: 'Async results',
      description: 'Plug in any data source with <code>Ranj.combobox(el, { source })</code>. Requests are debounced and stale responses are dropped.',
      height: 340,
      html: `
<div class="field" style="width:22rem;max-width:100%">
  <label class="label">Ship to city</label>
  <div class="combobox" id="combobox-async" data-name="city" data-min-chars="1" data-no-toggle data-autohighlight>
    <div class="input-wrap"><span class="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span><input placeholder="Start typing a city…"></div>
  </div>
</div>`,
      js: `
const cities = [['Amsterdam','Netherlands'],['Austin','USA'],['Bangalore','India'],['Barcelona','Spain'],['Berlin','Germany'],['Boston','USA'],['Buenos Aires','Argentina'],['Cape Town','South Africa'],['Chicago','USA'],['Copenhagen','Denmark'],['Dubai','UAE'],['Dublin','Ireland'],['Lagos','Nigeria'],['Lisbon','Portugal'],['London','UK'],['Los Angeles','USA'],['Melbourne','Australia'],['Mexico City','Mexico'],['Montreal','Canada'],['Mumbai','India'],['Nairobi','Kenya'],['New York','USA'],['Paris','France'],['San Francisco','USA'],['São Paulo','Brazil'],['Seoul','South Korea'],['Singapore','Singapore'],['Stockholm','Sweden'],['Sydney','Australia'],['Tokyo','Japan'],['Toronto','Canada'],['Vancouver','Canada']];
Ranj.combobox(root.querySelector('#combobox-async'), {
  source: q => new Promise(res => setTimeout(() => res(cities
    .filter(c => c[0].toLowerCase().includes(q.toLowerCase().trim()))
    .map(c => ({ value: c[0], label: c[0], meta: c[1] }))), 450))
});`
    }
  ],
  api: [
    { name: '.combobox', type: 'class', desc: 'Container with an input (wrapped in <code>.input-wrap</code> automatically) and options from <code>.combobox-list &gt; .combobox-option</code>, a <code>&lt;datalist&gt;</code> or <code>data-options</code>.' },
    { name: '.combobox-option', type: 'class', desc: 'v1 option. Attributes: <code>data-value</code>, <code>data-description</code>, <code>data-icon</code>, <code>data-meta</code>, <code>data-group</code>, <code>data-disabled</code>, <code>data-selected</code>.' },
    { name: 'data-name', type: 'attr', desc: 'Hidden input name that receives the option value (the visible input shows the label).' },
    { name: 'data-create', type: 'attr', desc: 'Offer to create the typed value. Fires <code>ranj:create</code>.' },
    { name: 'data-strict', type: 'attr', desc: 'On blur, revert text that doesn’t match an option.' },
    { name: 'data-autohighlight', type: 'attr', desc: 'Highlight the first match as you type (Tab accepts it).' },
    { name: 'data-open-on-focus / data-no-toggle / data-min-chars / data-debounce', type: 'attr', default: 'true / – / 0 / 180', desc: 'Behaviour tweaks.' },
    { name: 'Ranj.combobox(el, {source, items})', type: 'js', desc: 'Returns the instance. <code>source(query)</code> may return an array or a Promise. Instance: <code>{ value, open(), close(), setItems(), setSource() }</code>.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value, label, item, created }</code>' }
  ]
});

;
/* docs/registry/forms-custom-select.js */
(function () {
  var av = function (t, c) { return '<span class=\'listbox-avatar\' style=\'background:' + c + '\'>' + t + '</span>'; };
  RanjDocs.add({
    id: 'custom-select',
    name: 'Custom select',
    group: 'Forms',
    description: 'A fully styled select: a button that opens a listbox popover with icons, descriptions, groups, disabled options, typeahead and an optional search box. It drives a hidden native <code>&lt;select&gt;</code>, so forms submit and validate natively.',
    tags: ['new', 'js'],
    keywords: ['listbox', 'dropdown', 'select menu', 'picker', 'typeahead', 'searchable select'],
    demos: [
      {
        title: 'Default',
        description: 'Try the keyboard: focus it and type a letter, or use ↑ ↓ Home End Enter Escape.',
        height: 300,
        html: `
<div class="field" style="width:18rem;max-width:100%">
  <label class="label">Framework</label>
  <div class="custom-select" data-placeholder="Select a framework">
    <select name="framework">
      <option value="next">Next.js</option>
      <option value="svelte">SvelteKit</option>
      <option value="astro">Astro</option>
      <option value="remix">Remix</option>
      <option value="nuxt" disabled>Nuxt (coming soon)</option>
      <option value="solid">SolidStart</option>
    </select>
  </div>
</div>`
      },
      {
        title: 'Icons, descriptions and groups',
        height: 300,
        html: `
<div class="form-grid" style="width:34rem;max-width:100%">
  <div class="field"><label class="label">Plan</label>
    <div class="custom-select">
      <select name="plan">
        <option value="hobby" data-icon="🌱" data-description="For side projects">Hobby</option>
        <option value="pro" data-icon="⚡" data-description="For growing teams" selected>Pro</option>
        <option value="enterprise" data-icon="🏢" data-description="SSO, audit logs, SLA">Enterprise</option>
      </select>
    </div>
  </div>
  <div class="field"><label class="label">Assignee</label>
    <div class="custom-select">
      <select name="assignee">
        <optgroup label="Design">
          <option value="maya" data-icon="${av('MC', '#8b5cf6')}" data-meta="Lead">Maya Chen</option>
          <option value="leo" data-icon="${av('LP', '#ec4899')}">Leo Park</option>
        </optgroup>
        <optgroup label="Engineering">
          <option value="ari" data-icon="${av('AR', '#0ea5e9')}" selected>Ari Rahman</option>
          <option value="sam" data-icon="${av('SO', '#10b981')}" data-meta="On leave" disabled>Sam Okafor</option>
          <option value="jun" data-icon="${av('JW', '#f59e0b')}">Jun Watanabe</option>
        </optgroup>
      </select>
    </div>
  </div>
</div>`
      },
      {
        title: 'Searchable',
        description: '<code>data-search</code> adds a filter box — matches are highlighted.',
        height: 360,
        html: `
<div class="field" style="width:18rem;max-width:100%">
  <label class="label">Country</label>
  <div class="custom-select" data-search data-placeholder="Select country" data-search-placeholder="Search countries…">
    <select name="country" required>
      <option data-icon="🇦🇷">Argentina</option><option data-icon="🇦🇺">Australia</option><option data-icon="🇧🇷">Brazil</option>
      <option data-icon="🇨🇦">Canada</option><option data-icon="🇫🇷">France</option><option data-icon="🇩🇪">Germany</option>
      <option data-icon="🇮🇳">India</option><option data-icon="🇯🇵">Japan</option><option data-icon="🇲🇽">Mexico</option>
      <option data-icon="🇳🇱">Netherlands</option><option data-icon="🇳🇬">Nigeria</option><option data-icon="🇰🇷">South Korea</option>
      <option data-icon="🇪🇸">Spain</option><option data-icon="🇸🇪">Sweden</option><option data-icon="🇬🇧">United Kingdom</option><option data-icon="🇺🇸">United States</option>
    </select>
  </div>
  <p class="field-hint" id="custom-select-out">Value: —</p>
</div>`,
        js: `
const cs = root.querySelector('.custom-select'), out = root.querySelector('#custom-select-out');
cs.addEventListener('ranj:change', e => out.textContent = 'Value: ' + e.detail.value);`
      },
      {
        title: 'Sizes & from data',
        description: 'Build options from JSON with <code>data-options</code>.',
        height: 280,
        html: `
<div style="display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;justify-content:center">
  <div class="custom-select custom-select-sm" style="width:9rem" data-options='["Last 24 hours","Last 7 days","Last 30 days"]'></div>
  <div class="custom-select" style="width:11rem" data-options='[{"value":"asc","label":"Oldest first"},{"value":"desc","label":"Newest first","selected":true}]'></div>
  <div class="custom-select custom-select-lg" style="width:12rem" data-placeholder="Priority" data-options='[{"value":"urgent","label":"Urgent","icon":"🔴"},{"value":"high","label":"High","icon":"🟠"},{"value":"low","label":"Low","icon":"🟢"}]'></div>
  <div class="custom-select custom-select-ghost" data-options='["Public","Team only","Private"]'></div>
</div>`
      }
    ],
    api: [
      { name: '.custom-select', type: 'class', desc: 'Wrap a native <code>&lt;select&gt;</code>. Options can use <code>data-icon</code> (HTML/emoji), <code>data-description</code>, <code>data-meta</code>, <code>disabled</code>, and <code>&lt;optgroup&gt;</code>.' },
      { name: '.custom-select-sm / -lg / -ghost', type: 'class', desc: 'Sizes and a borderless variant.' },
      { name: 'data-placeholder', type: 'attr', default: 'Select…', desc: 'Shown when nothing is selected (no option is pre-selected).' },
      { name: 'data-search', type: 'attr', desc: 'Adds a search box at the top of the list. <code>data-search-placeholder</code>, <code>data-empty</code>.' },
      { name: 'data-options', type: 'attr', desc: 'JSON array of strings or <code>{value,label,icon,description,meta,group,disabled,selected}</code>.' },
      { name: 'data-name', type: 'attr', desc: 'Name for the generated native select.' },
      { name: 'Ranj.instance(el, "custom-select")', type: 'js', desc: '<code>{ value, open(), close(), refresh() }</code> — call <code>refresh()</code> after changing the native options.' },
      { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value, label }</code>. The native select also fires <code>change</code>.' }
    ]
  });
})();

;
/* docs/registry/forms-date-picker.js */
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

;
/* docs/registry/forms-field.js */
(function () {
  var mail = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
  RanjDocs.add({
    id: 'field',
    name: 'Field',
    group: 'Forms',
    description: 'Wraps a control with its label, hint and error message, and wires up <code>for</code>, <code>aria-describedby</code> and <code>aria-invalid</code> for you. <code>Ranj.validate(form)</code> uses native constraint validation to show inline errors with a shake.',
    tags: ['js'],
    keywords: ['form group', 'label', 'hint', 'helper text', 'error', 'validation', 'form-group'],
    demos: [
      {
        title: 'Label, hint and error',
        html: `
<div style="width:22rem;max-width:100%">
  <div class="field">
    <label class="label">Workspace name</label>
    <input class="input" value="Acme Robotics">
    <p class="field-hint">This is how your team will see it in the sidebar.</p>
  </div>
  <div class="field">
    <div class="field-row"><label class="label label-required">Work email</label><a href="#">Why?</a></div>
    <input class="input" type="email" value="maya@acme" aria-invalid="true">
    <p class="field-error">Enter a valid email, like name@company.com.</p>
  </div>
  <div class="field">
    <label class="label">Billing contact <span class="label-optional">(optional)</span></label>
    <input class="input" placeholder="finance@acme.com">
  </div>
</div>`
      },
      {
        title: 'Validation with Ranj.validate',
        description: 'Add <code>data-validate</code> to a form. Errors appear on submit, then update live as people fix them. Customise messages with <code>data-error-required</code>, <code>data-error-type</code>, <code>data-match</code> and friends.',
        height: 460,
        html: `
<form class="demo-field-card" data-validate style="width:24rem;max-width:100%">
  <div class="field">
    <label class="label">Full name</label>
    <input class="input" name="name" required minlength="2" data-error-required="Tell us what to call you." placeholder="Maya Chen">
  </div>
  <div class="field">
    <label class="label">Email</label>
    <div class="input-wrap"><span class="input-icon">${mail}</span><input type="email" name="email" required placeholder="you@company.com"></div>
  </div>
  <div class="field">
    <label class="label">Password</label>
    <input class="input" type="password" id="field-demo-pw" required minlength="8" placeholder="At least 8 characters">
    <p class="field-hint">Use 8 or more characters.</p>
  </div>
  <div class="field">
    <label class="label">Confirm password</label>
    <input class="input" type="password" required data-match="#field-demo-pw" data-error-match="Passwords don’t match yet.">
  </div>
  <div class="field">
    <label class="checkbox"><input type="checkbox" required data-error-required="Please accept the terms to continue."><span class="checkbox-mark"></span>I agree to the Terms and Privacy Policy</label>
  </div>
  <div class="demo-field-actions"><button type="reset" class="btn btn-outline">Reset</button><button class="btn btn-primary">Create account</button></div>
  <p class="demo-field-ok" hidden>All good! Account created.</p>
</form>`,
        js: `
const form = root.querySelector('form');
form.addEventListener('submit', e => { e.preventDefault(); form.querySelector('.demo-field-ok').hidden = false; });
form.addEventListener('ranj:invalid', () => form.querySelector('.demo-field-ok').hidden = true);
form.addEventListener('reset', () => form.querySelector('.demo-field-ok').hidden = true);`,
        css: `
.demo-field-card { padding: 1.5rem; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); }
.demo-field-actions { display: flex; justify-content: flex-end; gap: .5rem; margin-top: 1.25rem; }
.demo-field-ok { margin-top: .75rem; font-size: .85rem; color: var(--success-soft-fg); font-weight: 500; text-align: right; }`
      },
      {
        title: 'Horizontal layout',
        description: '<code>.field-horizontal</code> puts the label in a left column and stacks on narrow screens.',
        html: `
<div style="width:34rem;max-width:100%">
  <div class="field field-horizontal">
    <div class="field-label-block"><label class="label">Display name</label><p class="field-hint">Shown on your profile.</p></div>
    <input class="input" value="Maya Chen">
  </div>
  <div class="field field-horizontal">
    <div class="field-label-block"><label class="label">Username</label><p class="field-hint">Your public URL.</p></div>
    <div class="input-group"><span class="input-group-text">ranj.dev/</span><input class="input" value="maya"></div>
  </div>
  <div class="field field-horizontal">
    <label class="label">Timezone</label>
    <select class="select"><option>(GMT−05:00) New York</option><option>(GMT+00:00) London</option><option>(GMT+05:30) Mumbai</option></select>
  </div>
</div>`
      },
      {
        title: 'States',
        html: `
<div class="form-grid" style="width:34rem;max-width:100%">
  <div class="field"><label class="label">Default</label><input class="input" placeholder="Placeholder"></div>
  <div class="field"><label class="label">Valid</label><input class="input" value="acme-robotics" data-valid="true"><p class="field-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>Subdomain is available</p></div>
  <div class="field"><label class="label">Invalid</label><input class="input" value="ac" aria-invalid="true"><p class="field-error">Use at least 3 characters.</p></div>
  <div class="field" data-disabled><label class="label">Disabled</label><input class="input" value="Locked by admin" disabled></div>
</div>`
      }
    ],
    api: [
      { name: '.field', type: 'class', desc: 'Vertical stack of label, control, hint and error. Auto-wires label <code>for</code> and <code>aria-describedby</code>.' },
      { name: '.field-horizontal', type: 'class', desc: 'Label column on the left, control on the right; stacks under 560px. Use <code>.field-label-block</code> for label + hint.' },
      { name: '.field-inline', type: 'class', desc: 'Control and label in a row.' },
      { name: '.field-row', type: 'class', desc: 'Puts something (link, counter) on the label line.' },
      { name: '.label', type: 'class', desc: 'Form label. Add <code>.label-required</code> or <code>data-required</code> for an asterisk (added automatically when the control is <code>required</code>).' },
      { name: '.label-optional', type: 'class', desc: 'Muted “(optional)” suffix inside a label.' },
      { name: '.field-hint / .field-error / .field-success', type: 'class', desc: 'Helper, error and success messages.' },
      { name: '.form-grid', type: 'class', desc: 'Responsive 2-column grid of fields (<code>--cols</code>), with <code>.span-2</code> / <code>.span-full</code>.' },
      { name: '.form-section / .fieldset / .form-actions', type: 'class', desc: 'Settings-style sections, fieldsets with <code>legend</code>, and a right-aligned button row.' },
      { name: 'form[data-validate]', type: 'attr', desc: 'Validate on submit (blocks submit when invalid), then live on input/blur.' },
      { name: 'data-error-required / -type / -minlength / -pattern / -min / -max', type: 'attr', desc: 'Custom error messages per constraint. <code>data-error</code> overrides all.' },
      { name: 'data-match', type: 'attr', desc: 'CSS selector of another input that must have the same value (password confirm).' },
      { name: 'Ranj.validate(form, {focus, shake})', type: 'js', desc: 'Validates every field, shows errors, focuses the first invalid one. Returns <code>true</code> when valid.' },
      { name: 'Ranj.fieldError(el, message)', type: 'js', desc: 'Show (or clear with <code>""</code>) a server-side error on a field or control.' },
      { name: 'ranj:valid / ranj:invalid', type: 'event', desc: 'Fired on the form after <code>Ranj.validate</code>.' }
    ]
  });
})();

;
/* docs/registry/forms-file-upload.js */
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

;
/* docs/registry/forms-form-layout.js */
(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var mail = s('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
  var card = s('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>');
  var lock = s('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>');
  var check = s('<path d="M20 6 9 17l-5-5"/>');
  var gh = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>';
  var google = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.7-2.8Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4Z"/></svg>';
  RanjDocs.add({
    id: 'form-layout',
    name: 'Form layouts',
    group: 'Forms',
    description: 'Complete, realistic forms composed from the Forms components: sign-up, checkout and account settings. Copy one and change the fields.',
    tags: ['new', 'js'],
    keywords: ['sign up form', 'register', 'checkout form', 'payment form', 'settings page', 'profile form', 'fieldset'],
    demos: [
      {
        title: 'Sign up',
        height: 640,
        html: `
<form class="demo-fl-card demo-fl-signup" data-validate>
  <div class="demo-fl-head"><div class="demo-fl-logo">R</div><h3>Create your account</h3><p>Start your 14-day free trial. No card needed.</p></div>
  <div class="demo-fl-oauth"><button type="button" class="btn btn-outline">${google}Google</button><button type="button" class="btn btn-outline">${gh}GitHub</button></div>
  <div class="demo-fl-or"><span>or continue with email</span></div>
  <div class="form-grid">
    <div class="field"><label class="label">First name</label><input class="input" name="first" required autocomplete="given-name" placeholder="Maya"></div>
    <div class="field"><label class="label">Last name</label><input class="input" name="last" required autocomplete="family-name" placeholder="Chen"></div>
    <div class="field span-2"><label class="label">Work email</label><div class="input-wrap"><span class="input-icon">${mail}</span><input type="email" name="email" required autocomplete="email" placeholder="maya@company.com"></div></div>
    <div class="field span-2"><label class="label">Password</label><div class="password" data-strength data-no-rules><input class="input" type="password" name="password" required minlength="8" autocomplete="new-password" placeholder="8+ characters"></div></div>
    <div class="field span-2"><label class="label">Team size</label>
      <div class="segmented segmented-block segmented-sm" aria-label="Team size"><label><input type="radio" name="size" value="1" checked>Just me</label><label><input type="radio" name="size" value="2-10">2–10</label><label><input type="radio" name="size" value="11-50">11–50</label><label><input type="radio" name="size" value="50+">50+</label></div>
    </div>
    <div class="field span-2"><label class="checkbox"><input type="checkbox" name="terms" required data-error-required="You need to accept the terms."><span class="checkbox-mark"></span><span>I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a></span></label></div>
  </div>
  <button class="btn btn-primary btn-block demo-fl-submit">Create account</button>
  <p class="demo-fl-foot">Already have an account? <a href="#">Sign in</a></p>
</form>`,
        js: `
const f = root.querySelector('form');
f.addEventListener('submit', e => { e.preventDefault(); const b = f.querySelector('.demo-fl-submit'); b.textContent = 'Account created ✓'; setTimeout(() => b.textContent = 'Create account', 1800); });`,
        css: `
.demo-fl-card { width: 27rem; max-width: 100%; padding: 1.75rem; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-2xl); box-shadow: var(--shadow-lg); }
.demo-fl-head { text-align: center; margin-bottom: 1.25rem; }
.demo-fl-logo { width: 2.5rem; height: 2.5rem; margin: 0 auto .75rem; display: grid; place-items: center; border-radius: var(--radius-lg); font-weight: 800; color: var(--primary-fg); background: linear-gradient(135deg, var(--primary), oklch(.6 .22 calc(var(--hue) + 50))); box-shadow: var(--shadow-glow); }
.demo-fl-head h3 { font-size: 1.25rem; font-weight: 700; letter-spacing: -.02em; }
.demo-fl-head p { font-size: .85rem; color: var(--muted-fg); margin-top: .2rem; }
.demo-fl-oauth { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
.demo-fl-oauth svg { width: 1rem; height: 1rem; }
.demo-fl-or { display: flex; align-items: center; gap: .75rem; margin: 1.1rem 0; font-size: .75rem; color: var(--muted-fg); }
.demo-fl-or::before, .demo-fl-or::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.demo-fl-submit { width: 100%; margin-top: 1.25rem; }
.demo-fl-foot { text-align: center; font-size: .82rem; color: var(--muted-fg); margin-top: 1rem; }
.demo-fl-checkout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 16.5rem); gap: 1.25rem; width: 44rem; max-width: 100%; align-items: start; }
.demo-fl-main { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-xl); }
.demo-fl-main legend { margin-bottom: .75rem; }
.demo-fl-summary { position: sticky; top: 1rem; display: flex; flex-direction: column; gap: .9rem; padding: 1.25rem; background: var(--bg-subtle); border: 1px solid var(--border); border-radius: var(--radius-xl); }
.demo-fl-summary h4 { font-size: .95rem; font-weight: 600; }
.demo-fl-item { display: flex; align-items: center; gap: .6rem; font-size: .82rem; }
.demo-fl-item > div:nth-child(2) { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.demo-fl-item small { color: var(--muted-fg); }
.demo-fl-thumb { width: 2.4rem; height: 2.4rem; display: grid; place-items: center; font-size: 1.2rem; border-radius: var(--radius); background: var(--card); border: 1px solid var(--border); flex-shrink: 0; }
.demo-fl-item .number-input input { width: 1.8rem; }
.demo-fl-summary dl { display: grid; gap: .45rem; font-size: .85rem; padding-top: .9rem; border-top: 1px solid var(--border); }
.demo-fl-summary dl div { display: flex; justify-content: space-between; } .demo-fl-summary dt { color: var(--muted-fg); }
.demo-fl-summary dd { font-variant-numeric: tabular-nums; margin: 0; }
.demo-fl-total { padding-top: .5rem; border-top: 1px dashed var(--border); font-weight: 700; font-size: 1rem; } .demo-fl-total dt { color: var(--fg) !important; }
.demo-fl-summary .btn svg { width: 1rem; height: 1rem; }
@media (max-width: 760px) { .demo-fl-checkout { grid-template-columns: 1fr; } .demo-fl-summary { position: static; } }
.demo-fl-settings { width: 44rem; max-width: 100%; }
.demo-fl-avatar-row { display: flex; align-items: center; gap: 1rem; font-size: .9rem; }
.demo-fl-settings .btn svg { width: 1rem; height: 1rem; }
`
      },
      {
        title: 'Checkout',
        height: 700,
        html: `
<form class="demo-fl-checkout" data-validate>
  <div class="demo-fl-main">
    <fieldset class="fieldset">
      <legend>Contact</legend>
      <div class="field"><label class="label">Email</label><input class="input" type="email" required value="maya@acme.dev" autocomplete="email"></div>
    </fieldset>
    <fieldset class="fieldset">
      <legend>Shipping</legend>
      <div class="form-grid">
        <div class="field span-2"><label class="label">Full name</label><input class="input" required value="Maya Chen" autocomplete="name"></div>
        <div class="field span-2"><label class="label">Address</label><input class="input" required value="148 Wythe Ave, Apt 3" autocomplete="street-address"></div>
        <div class="field"><label class="label">City</label><input class="input" required value="Brooklyn" autocomplete="address-level2"></div>
        <div class="field"><label class="label">ZIP</label><input class="input" required value="11249" inputmode="numeric" pattern="[0-9]{5}" data-error-pattern="Use a 5-digit ZIP." autocomplete="postal-code"></div>
        <div class="field span-2"><label class="label">Country</label>
          <div class="custom-select" data-search><select name="country"><option data-icon="🇺🇸" selected>United States</option><option data-icon="🇨🇦">Canada</option><option data-icon="🇬🇧">United Kingdom</option><option data-icon="🇩🇪">Germany</option><option data-icon="🇯🇵">Japan</option></select></div>
        </div>
      </div>
    </fieldset>
    <fieldset class="fieldset">
      <legend>Delivery</legend>
      <div class="card-grid" role="radiogroup" aria-label="Delivery">
        <label class="radio-card radio-card-row"><input type="radio" name="ship" checked><span class="radio-mark"></span><span class="radio-body"><span class="radio-card-title">Standard</span><span class="radio-card-desc">4–6 days · Free</span></span></label>
        <label class="radio-card radio-card-row"><input type="radio" name="ship"><span class="radio-mark"></span><span class="radio-body"><span class="radio-card-title">Express</span><span class="radio-card-desc">Tomorrow · $12</span></span></label>
      </div>
    </fieldset>
    <fieldset class="fieldset">
      <legend>Payment</legend>
      <div class="form-grid">
        <div class="field span-2"><label class="label">Card number</label><div class="input-wrap"><span class="input-icon">${card}</span><input inputmode="numeric" required autocomplete="cc-number" placeholder="1234 1234 1234 1234" pattern="[0-9 ]{15,19}" data-error-pattern="Check the card number."><span class="input-icon">${lock}</span></div></div>
        <div class="field"><label class="label">Expiry</label><input class="input" required placeholder="MM / YY" autocomplete="cc-exp"></div>
        <div class="field"><label class="label">CVC</label><input class="input" required placeholder="123" inputmode="numeric" maxlength="4" autocomplete="cc-csc"></div>
      </div>
    </fieldset>
  </div>
  <aside class="demo-fl-summary">
    <h4>Order summary</h4>
    <div class="demo-fl-item"><span class="demo-fl-thumb">🎧</span><div><b>Studio headphones</b><small>Midnight</small></div><div class="number-input number-input-pill number-input-sm"><input type="number" min="1" max="9" value="1" aria-label="Quantity"></div></div>
    <div class="demo-fl-item"><span class="demo-fl-thumb">🔌</span><div><b>USB-C cable 2m</b><small>Braided</small></div><div class="number-input number-input-pill number-input-sm"><input type="number" min="1" max="9" value="2" aria-label="Quantity"></div></div>
    <div class="input-group"><input class="input input-sm" placeholder="Discount code"><button type="button" class="btn btn-outline btn-sm">Apply</button></div>
    <dl><div><dt>Subtotal</dt><dd>$227.00</dd></div><div><dt>Shipping</dt><dd>Free</dd></div><div><dt>Tax</dt><dd>$20.15</dd></div><div class="demo-fl-total"><dt>Total</dt><dd>$247.15</dd></div></dl>
    <button class="btn btn-primary btn-block">${lock}Pay $247.15</button>
  </aside>
</form>`,
        js: `root.querySelector('form').addEventListener('submit', e => e.preventDefault());`
      },
      {
        title: 'Account settings',
        height: 600,
        html: `
<form class="demo-fl-settings" onsubmit="return false">
  <section class="form-section">
    <div class="form-section-head"><h3>Profile</h3><p>This information is shown publicly on your profile.</p></div>
    <div class="form-stack">
      <div class="demo-fl-avatar-row">
        <div class="dropzone dropzone-image dropzone-avatar" aria-label="Upload photo" style="width:4.5rem;height:4.5rem;padding:.5rem"><input type="file" accept="image/*"><span class="dropzone-hint">Photo</span></div>
        <div><b>Profile photo</b><p class="field-hint" style="margin:0">JPG or PNG, at least 256 × 256.</p></div>
      </div>
      <div class="form-grid">
        <div class="field"><label class="label">Display name</label><input class="input" value="Maya Chen"></div>
        <div class="field"><label class="label">Username</label><div class="input-wrap"><span class="input-prefix">ranj.dev/</span><input value="maya"></div></div>
      </div>
      <div class="field"><label class="label">Bio</label><textarea class="textarea" data-autosize data-maxlength="160" rows="2">Product designer in Brooklyn. Into type, motion and good coffee.</textarea></div>
      <div class="field"><label class="label">Expertise</label><div class="tag-input" data-value="Design systems, Prototyping, Motion" data-max="6"></div></div>
    </div>
  </section>
  <section class="form-section">
    <div class="form-section-head"><h3>Preferences</h3><p>Language, region and appearance.</p></div>
    <div class="form-stack">
      <div class="form-grid">
        <div class="field"><label class="label">Language</label><div class="custom-select"><select><option selected>English (US)</option><option>Deutsch</option><option>Español</option><option>日本語</option></select></div></div>
        <div class="field"><label class="label">Week starts on</label><div class="segmented segmented-block" aria-label="Week starts on"><label><input type="radio" name="wk" checked>Sunday</label><label><input type="radio" name="wk">Monday</label></div></div>
      </div>
      <div class="field"><label class="label">Accent color</label><div class="color-picker" data-value="#6366f1"></div></div>
    </div>
  </section>
  <section class="form-section">
    <div class="form-section-head"><h3>Notifications</h3><p>Choose what we email you about.</p></div>
    <div class="switch-list">
      <label class="switch switch-row"><span class="switch-body"><span class="switch-label">Mentions</span><span class="switch-desc">When someone @mentions you.</span></span><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span></label>
      <label class="switch switch-row"><span class="switch-body"><span class="switch-label">Weekly summary</span><span class="switch-desc">Every Monday at 9 AM.</span></span><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span></label>
      <label class="switch switch-row"><span class="switch-body"><span class="switch-label">Product news</span><span class="switch-desc">About once a month.</span></span><input type="checkbox"><span class="switch-track"><span class="switch-thumb"></span></span></label>
    </div>
  </section>
  <div class="form-actions"><button type="reset" class="btn btn-ghost">Cancel</button><button class="btn btn-primary">${check}Save changes</button></div>
</form>`
      }
    ],
    api: [
      { name: '.form-grid', type: 'class', desc: 'Two-column field grid (<code>--cols</code>), one column under 560px. <code>.span-2</code>, <code>.span-full</code>.' },
      { name: '.form-stack', type: 'class', desc: 'Vertical rhythm for fields.' },
      { name: '.form-section', type: 'class', desc: 'Settings section: heading + description on the left (<code>.form-section-head</code>), fields on the right; stacks under 720px.' },
      { name: '.fieldset / legend / .fieldset-desc', type: 'class', desc: 'Grouped fields with a title.' },
      { name: '.form-actions / .form-actions-between', type: 'class', desc: 'Button row aligned right / spread.' }
    ]
  });
})();

;
/* docs/registry/forms-inline-edit.js */
RanjDocs.add({
  id: 'inline-edit',
  name: 'Inline edit',
  group: 'Forms',
  description: 'Click-to-edit text. Enter saves, Escape cancels, blur saves; the field sizes to the text and flashes green when saved. Cancel <code>ranj:save</code> to reject a value.',
  tags: ['new', 'js'],
  keywords: ['editable', 'click to edit', 'in place edit', 'contenteditable', 'rename'],
  demos: [
    {
      title: 'Project header',
      description: 'Click the title or description, or Tab to them and press Enter.',
      html: `
<div class="demo-ie-card">
  <span class="demo-ie-crumb">Projects /</span>
  <h3><span class="inline-edit" data-name="title" data-required data-label="Project name">Q4 launch plan</span></h3>
  <p><span class="inline-edit" data-name="description" data-multiline data-placeholder="Add a description…" data-label="Description">Everything we need to ship the new onboarding flow before the holidays.</span></p>
  <div class="demo-ie-meta">Owner: <span class="inline-edit" data-label="Owner">Maya Chen</span> · Budget: <span class="inline-edit" data-label="Budget" id="inline-edit-budget">$48,000</span></div>
  <p class="field-hint" id="inline-edit-log">Budget must start with $.</p>
</div>`,
      js: `
const b = root.querySelector('#inline-edit-budget'), log = root.querySelector('#inline-edit-log');
b.addEventListener('ranj:save', e => { if (!/^\\$[\\d,]+$/.test(e.detail.value)) { e.preventDefault(); log.textContent = '“' + e.detail.value + '” isn’t a valid amount — reverted.'; } });
root.addEventListener('ranj:change', e => { if (e.target.classList.contains('inline-edit')) log.textContent = 'Saved: ' + e.detail.previous + ' → ' + e.detail.value; });`,
      css: `
.demo-ie-card { width: 30rem; max-width: 100%; padding: 1.5rem; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); }
.demo-ie-crumb { font-size: .8rem; color: var(--muted-fg); }
.demo-ie-card h3 { font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; margin: .25rem 0 .5rem; }
.demo-ie-card > p:not(.field-hint) { color: var(--muted-fg); font-size: .9rem; margin-bottom: .9rem; }
.demo-ie-meta { font-size: .85rem; color: var(--muted-fg); }
.demo-ie-meta .inline-edit { color: var(--fg); font-weight: 500; }`
    }
  ],
  api: [
    { name: '.inline-edit', type: 'class', desc: 'Element whose text becomes editable. <code>.inline-edit-block</code> for full width.' },
    { name: 'data-multiline', type: 'attr', desc: 'Use a textarea (⌘/Ctrl + Enter saves).' },
    { name: 'data-required', type: 'attr', desc: 'Empty values shake and stay in edit mode.' },
    { name: 'data-placeholder / data-label / data-name / data-maxlength', type: 'attr', desc: 'Empty text, accessible name, hidden input, length limit.' },
    { name: 'data-blur', type: 'attr', default: 'save', desc: '<code>save</code> or <code>cancel</code> when focus leaves.' },
    { name: 'Ranj.instance(el, "inline-edit")', type: 'js', desc: '<code>{ value, edit(), save(), cancel() }</code>' },
    { name: 'ranj:save', type: 'event', desc: 'Cancelable. detail: <code>{ value, previous }</code>' },
    { name: 'ranj:change / ranj:edit / ranj:cancel', type: 'event', desc: '<code>change</code> detail: <code>{ value, previous }</code>' }
  ]
});

;
/* docs/registry/forms-input.js */
(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var mail = s('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
  var user = s('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>');
  var link = s('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>');
  var check = s('<path d="M20 6 9 17l-5-5"/>');
  var at = s('<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>');
  var copy = s('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>');
  RanjDocs.add({
    id: 'input',
    name: 'Input',
    group: 'Forms',
    description: 'Text inputs in three sizes and four variants, plus <code>.input-wrap</code> — one bordered shell that hosts icons, prefixes, suffixes, buttons and a clear ×. Floating labels are pure CSS.',
    keywords: ['text field', 'textbox', 'input group', 'addon', 'prefix', 'suffix', 'floating label', 'clearable'],
    demos: [
      {
        title: 'Default',
        html: `
<div style="width:20rem;max-width:100%">
  <label class="label" for="input-demo-email">Email</label>
  <input class="input" id="input-demo-email" type="email" placeholder="you@company.com">
</div>`
      },
      {
        title: 'Sizes',
        html: `
<div style="width:20rem;max-width:100%;display:grid;gap:.75rem">
  <input class="input input-sm" placeholder="Small — 32px">
  <input class="input" placeholder="Default — 38px">
  <input class="input input-lg" placeholder="Large — 44px">
  <input class="input input-xl" placeholder="Extra large — 52px">
</div>`
      },
      {
        title: 'Icons, prefixes and buttons',
        description: 'Everything inside <code>.input-wrap</code> sits in one focus ring. Add <code>data-clearable</code> for a clear button.',
        html: `
<div style="width:22rem;max-width:100%;display:grid;gap:.75rem">
  <div class="input-wrap"><span class="input-icon">${user}</span><input placeholder="Full name" value="Maya Chen"></div>
  <div class="input-wrap" data-clearable><span class="input-icon">${mail}</span><input type="email" value="maya@acme.dev" placeholder="Email"></div>
  <div class="input-wrap"><span class="input-prefix">https://</span><input value="acme.dev"><span class="input-icon" style="color:var(--success)">${check}</span></div>
  <div class="input-wrap"><span class="input-prefix">$</span><input inputmode="decimal" value="1,250.00"><span class="input-suffix">USD</span></div>
  <div class="input-wrap"><span class="input-icon">${link}</span><input readonly data-picker value="ranj.dev/invite/7Hq2-xP9"><button type="button" class="input-btn" aria-label="Copy link" id="input-demo-copy">${copy}</button></div>
</div>`,
        js: `
const b = root.querySelector('#input-demo-copy');
b.onclick = () => { const i = b.previousElementSibling; navigator.clipboard && navigator.clipboard.writeText(i.value).catch(() => {}); b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>'; b.style.color = 'var(--success)'; setTimeout(() => { b.innerHTML = ${JSON.stringify(copy)}; b.style.color = ''; }, 1400); };`
      },
      {
        title: 'Addons',
        description: 'v1 <code>.input-group</code> + <code>.input-group-text</code> still work and can hold buttons and selects.',
        html: `
<div style="width:24rem;max-width:100%;display:grid;gap:.75rem">
  <div class="input-group"><span class="input-group-text">${at}</span><input class="input" placeholder="username"></div>
  <div class="input-group"><input class="input" placeholder="acme"><span class="input-group-text">.ranj.app</span></div>
  <div class="input-group"><select class="select" style="flex:0 0 6.5rem"><option>+1 US</option><option>+44 UK</option><option>+91 IN</option></select><input class="input" type="tel" placeholder="(555) 010-2481"></div>
  <div class="input-group"><input class="input" placeholder="Enter coupon code" value="LAUNCH25"><button class="btn btn-outline">Apply</button></div>
</div>`
      },
      {
        title: 'Floating label & variants',
        html: `
<div class="form-grid" style="width:32rem;max-width:100%">
  <div class="input-floating"><input class="input" id="input-demo-f1" placeholder=" " value="Maya"><label for="input-demo-f1">First name</label></div>
  <div class="input-floating"><input class="input" id="input-demo-f2" placeholder=" "><label for="input-demo-f2">Last name</label></div>
  <input class="input input-filled" placeholder="Filled variant">
  <input class="input input-underline" placeholder="Underline variant (focus me)">
  <input class="input input-ghost" placeholder="Ghost variant">
  <input class="input" type="file">
</div>`
      },
      {
        title: 'States',
        html: `
<div class="form-grid" style="width:32rem;max-width:100%">
  <input class="input" placeholder="Default">
  <input class="input" value="Read only" readonly>
  <input class="input" value="Disabled" disabled>
  <input class="input" value="not-an-email" aria-invalid="true">
</div>`
      }
    ],
    api: [
      { name: '.input', type: 'class', desc: 'Styled text input (any type).' },
      { name: '.input-sm / .input-lg / .input-xl', type: 'class', desc: 'Sizes. Also work on <code>.input-wrap</code>.' },
      { name: '.input-filled / .input-underline / .input-ghost', type: 'class', desc: 'Variants. Underline animates a primary line on focus.' },
      { name: '.input-wrap', type: 'class', desc: 'Bordered shell with a bare <code>&lt;input&gt;</code> inside plus <code>.input-icon</code>, <code>.input-prefix</code>, <code>.input-suffix</code>, <code>.input-btn</code>, <code>.input-kbd</code>.' },
      { name: 'data-clearable', type: 'attr', desc: 'On <code>.input-wrap</code>: adds a clear button that shows when there is a value. <code>data-clear-on-escape</code> clears with Escape.' },
      { name: '.input-group / .input-group-text', type: 'class', desc: 'v1 attached addons. Children can be inputs, selects, text or <code>.btn</code>.' },
      { name: '.input-floating', type: 'class', desc: 'Floating label: put <code>placeholder=" "</code> on the input and the label after it.' },
      { name: 'aria-invalid="true" / data-valid="true"', type: 'attr', desc: 'Error and success border states.' },
      { name: '--field-bg / --field-border / --field-ring / --field-radius', type: 'var', desc: 'Shared control surface tokens used by every form control.' },
      { name: 'ranj:change / ranj:clear', type: 'event', desc: 'On <code>.input-wrap</code> when cleared. detail: <code>{ value }</code>' }
    ]
  });
})();

;
/* docs/registry/forms-multi-select.js */
(function () {
  var av = function (t, c) { return '<span class=\'listbox-avatar\' style=\'background:' + c + '\'>' + t + '</span>'; };
  RanjDocs.add({
    id: 'multi-select',
    name: 'Multi-select',
    group: 'Forms',
    description: 'Pick several options as chips inside the field. Type to filter, Enter toggles, Backspace selects then removes the last chip. Backed by a hidden <code>&lt;select multiple&gt;</code>.',
    tags: ['new', 'js'],
    keywords: ['chips', 'tags select', 'multiple', 'token input', 'people picker'],
    demos: [
      {
        title: 'Default',
        height: 340,
        html: `
<div class="field" style="width:24rem;max-width:100%">
  <label class="label">Skills</label>
  <div class="multi-select" data-placeholder="Add skills…">
    <select name="skills">
      <option selected>Figma</option><option>Framer</option><option selected>Prototyping</option><option>User research</option>
      <option>Motion design</option><option>Design systems</option><option>Illustration</option><option>Copywriting</option><option>Accessibility</option>
    </select>
  </div>
</div>`
      },
      {
        title: 'People with a limit',
        description: '<code>data-max="3"</code> disables the rest once three are picked.',
        height: 360,
        html: `
<div class="field" style="width:26rem;max-width:100%">
  <label class="label">Reviewers</label>
  <div class="multi-select" data-max="3" data-placeholder="Add up to 3 reviewers">
    <select name="reviewers">
      <optgroup label="Suggested">
        <option value="maya" data-icon="${av('MC', '#8b5cf6')}" selected>Maya Chen</option>
        <option value="ari" data-icon="${av('AR', '#0ea5e9')}">Ari Rahman</option>
      </optgroup>
      <optgroup label="Everyone">
        <option value="leo" data-icon="${av('LP', '#ec4899')}">Leo Park</option>
        <option value="jun" data-icon="${av('JW', '#f59e0b')}">Jun Watanabe</option>
        <option value="nia" data-icon="${av('NA', '#10b981')}">Nia Adeyemi</option>
        <option value="tom" data-icon="${av('TB', '#64748b')}">Tom Becker</option>
      </optgroup>
    </select>
  </div>
  <p class="field-hint" id="multi-select-out">Selected: maya</p>
</div>`,
        js: `
root.querySelector('.multi-select').addEventListener('ranj:change', e => root.querySelector('#multi-select-out').textContent = 'Selected: ' + (e.detail.value.join(', ') || 'none'));`
      },
      {
        title: 'Small',
        height: 300,
        html: `
<div class="multi-select multi-select-sm" style="width:18rem;max-width:100%" data-placeholder="Filter by status" data-options='["Backlog","Todo",{"value":"In progress","label":"In progress","selected":true},"In review","Done","Canceled"]'></div>`
      }
    ],
    api: [
      { name: '.multi-select', type: 'class', desc: 'Wrap a <code>&lt;select&gt;</code> (made <code>multiple</code>) or use <code>data-options</code>. Option attrs: <code>data-icon</code>, <code>disabled</code>, <code>&lt;optgroup&gt;</code>.' },
      { name: 'data-placeholder', type: 'attr', default: 'Select…', desc: 'Shown when empty.' },
      { name: 'data-max', type: 'attr', default: '0', desc: 'Maximum selections (0 = unlimited).' },
      { name: 'data-close-on-select', type: 'attr', desc: 'Close the list after each pick.' },
      { name: '.multi-select-sm', type: 'class', desc: 'Compact size.' },
      { name: 'Keyboard', type: 'attr', desc: '↑ ↓ move, Enter toggles, Backspace on empty input highlights then removes the last chip, ← → move between chips, Escape closes.' },
      { name: 'Ranj.instance(el, "multi-select")', type: 'js', desc: '<code>{ value: string[], open(), close() }</code>' },
      { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value: string[] }</code>' }
    ]
  });
})();

;
/* docs/registry/forms-number-input.js */
RanjDocs.add({
  id: 'number-input',
  name: 'Number input',
  group: 'Forms',
  description: 'A number field with − / + steppers that repeat and accelerate while held, min/max/step clamping, ↑ ↓ (Shift ×10) and PageUp/PageDown keys, optional mouse-wheel, and locale-aware formatting.',
  tags: ['new', 'js'],
  keywords: ['stepper', 'spinbutton', 'quantity', 'counter', 'numeric input', 'currency input'],
  demos: [
    {
      title: 'Default',
      description: 'Press and hold a button to repeat.',
      html: `
<div class="form-grid" style="width:30rem;max-width:100%">
  <div class="field"><label class="label">Guests</label><div class="number-input"><input type="number" min="1" max="12" value="2" name="guests"></div><p class="field-hint">Up to 12 per booking.</p></div>
  <div class="field"><label class="label">Weight (kg)</label><div class="number-input number-input-stacked" data-wheel><input type="number" min="0" step="0.5" value="72.5"></div><p class="field-hint">Scroll the wheel while focused.</p></div>
</div>`
    },
    {
      title: 'Formatting',
      html: `
<div class="form-grid" style="width:30rem;max-width:100%">
  <div class="field"><label class="label">Price</label><div class="number-input number-input-stacked" data-format="currency:USD" data-decimals="2"><input type="number" min="0" step="0.5" value="1249"></div></div>
  <div class="field"><label class="label">Discount</label><div class="number-input" data-format="percent"><input type="number" min="0" max="100" step="5" value="15"></div></div>
  <div class="field"><label class="label">Monthly visitors</label><div class="number-input" ><input type="number" min="0" step="1000" value="125000"></div></div>
  <div class="field"><label class="label">Temperature</label><div class="number-input" data-suffix=" °C"><input type="number" min="-20" max="40" value="21"></div></div>
</div>`
    },
    {
      title: 'Cart quantity',
      html: `
<div class="demo-num-item">
  <div class="demo-num-img">🎧</div>
  <div><b>Studio headphones</b><small>Midnight · $189</small></div>
  <div class="number-input number-input-pill number-input-sm"><input type="number" min="0" max="9" value="1" aria-label="Quantity"></div>
  <b class="demo-num-total">$189</b>
</div>`,
      js: `
const n = root.querySelector('.number-input'), t = root.querySelector('.demo-num-total');
n.addEventListener('ranj:change', e => t.textContent = '$' + (e.detail.value * 189).toLocaleString());`,
      css: `
.demo-num-item { display: flex; align-items: center; gap: .9rem; width: 28rem; max-width: 100%; padding: .75rem; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); box-shadow: var(--shadow-xs); flex-wrap: wrap; }
.demo-num-img { width: 3rem; height: 3rem; display: grid; place-items: center; font-size: 1.5rem; border-radius: var(--radius-lg); background: var(--muted); }
.demo-num-item > div:nth-child(2) { flex: 1; display: flex; flex-direction: column; font-size: .9rem; min-width: 8rem; }
.demo-num-item small { color: var(--muted-fg); font-size: .78rem; }
.demo-num-total { min-width: 3.5rem; text-align: right; font-variant-numeric: tabular-nums; }`
    }
  ],
  api: [
    { name: '.number-input', type: 'class', desc: 'Wrap an <code>&lt;input type="number"&gt;</code> with <code>min</code>, <code>max</code>, <code>step</code>, <code>value</code>, <code>name</code>. Steppers are added; the value posts via a hidden input.' },
    { name: '.number-input-stacked / -pill / -sm / -lg / -inline', type: 'class', desc: 'Chevrons on the right, round cart style, sizes, auto width.' },
    { name: 'data-format', type: 'attr', desc: '<code>currency:EUR</code>, <code>percent</code>, or <code>plain</code> (no grouping).' },
    { name: 'data-decimals / data-prefix / data-suffix / data-locale', type: 'attr', desc: 'Formatting details.' },
    { name: 'data-wheel', type: 'attr', desc: 'Mouse wheel steps the value while focused.' },
    { name: 'Ranj.instance(el, "number-input")', type: 'js', desc: '<code>{ value, stepUp(), stepDown() }</code>' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value }</code> (number or <code>null</code>)' }
  ]
});

;
/* docs/registry/forms-otp-input.js */
RanjDocs.add({
  id: 'otp-input',
  name: 'OTP input',
  group: 'Forms',
  description: 'One-time-code boxes that auto-advance as you type, fill all at once on paste or SMS autofill, step back on Backspace, and fire <code>ranj:complete</code> when full.',
  tags: ['new', 'js'],
  keywords: ['one time password', 'verification code', 'pin input', '2fa', 'mfa', 'sms code'],
  demos: [
    {
      title: 'Verify your email',
      description: 'The code is <b>424242</b>. Try pasting <code>123-456</code> into any box.',
      html: `
<div class="demo-otp-card">
  <div class="demo-otp-icon">✉️</div>
  <h4>Check your inbox</h4>
  <p>We sent a 6-digit code to <b>maya@acme.dev</b></p>
  <div class="otp" data-length="6" data-group="3" data-name="code" aria-label="Verification code"></div>
  <p class="demo-otp-msg" aria-live="polite">Didn’t get it? <a href="#" onclick="return false">Resend in 0:42</a></p>
</div>`,
      js: `
const otp = root.querySelector('.otp'), msg = root.querySelector('.demo-otp-msg');
otp.addEventListener('ranj:complete', e => {
  const inst = Ranj.otp(otp);
  if (e.detail.value === '424242') { inst.setState('success'); msg.innerHTML = '<span style="color:var(--success-soft-fg);font-weight:500">Verified — welcome back!</span>'; }
  else { inst.setState('error'); msg.innerHTML = '<span style="color:var(--destructive);font-weight:500">That code didn’t work. Try 424242.</span>'; }
});`,
      css: `
.demo-otp-card { width: 24rem; max-width: 100%; padding: 1.75rem 1.25rem; text-align: center; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; align-items: center; }
.demo-otp-icon { font-size: 1.5rem; width: 3rem; height: 3rem; display: grid; place-items: center; border-radius: 50%; background: var(--primary-soft); margin-bottom: .75rem; }
.demo-otp-card h4 { font-size: 1.05rem; font-weight: 600; }
.demo-otp-card > p { font-size: .85rem; color: var(--muted-fg); margin: .25rem 0 1.25rem; }
.demo-otp-card .demo-otp-msg { margin: 1.1rem 0 0; font-size: .8rem; }`
    },
    {
      title: 'Variants',
      html: `
<div style="display:grid;gap:1.25rem;justify-items:center">
  <div class="otp otp-joined" data-length="6" data-group="3" aria-label="Joined"></div>
  <div class="otp otp-sm" data-length="4" data-masked aria-label="PIN"></div>
  <div class="otp otp-lg" data-length="5" data-type="alphanumeric" aria-label="Invite code"></div>
</div>`
    }
  ],
  api: [
    { name: '.otp', type: 'class', desc: 'Container; slots are generated (or use your own <code>input.otp-slot</code>s).' },
    { name: '.otp-joined / .otp-sm / .otp-lg', type: 'class', desc: 'Attached boxes and sizes.' },
    { name: 'data-length', type: 'attr', default: '6', desc: 'Number of boxes.' },
    { name: 'data-group', type: 'attr', desc: 'Insert a separator every N boxes.' },
    { name: 'data-type', type: 'attr', default: 'numeric', desc: '<code>numeric</code>, <code>alpha</code> or <code>alphanumeric</code> (uppercased).' },
    { name: 'data-masked', type: 'attr', desc: 'Hide characters like a password.' },
    { name: 'data-name / data-autofocus / data-free', type: 'attr', desc: 'Hidden input name, focus on load, allow focusing any box (by default focus jumps to the first empty one).' },
    { name: 'Ranj.otp(el)', type: 'js', desc: '<code>{ value, clear(), setState("error" | "success" | null) }</code>. Error shakes the boxes.' },
    { name: 'ranj:change / ranj:complete', type: 'event', desc: 'detail: <code>{ value, complete }</code> / <code>{ value }</code>' }
  ]
});

;
/* docs/registry/forms-password.js */
RanjDocs.add({
  id: 'password',
  name: 'Password',
  group: 'Forms',
  description: 'Password field with an animated show/hide eye, a Caps Lock warning, and an optional strength meter with a live rules checklist.',
  tags: ['new', 'js'],
  keywords: ['password strength', 'show password', 'reveal', 'eye toggle', 'password rules', 'caps lock'],
  demos: [
    {
      title: 'Reveal toggle',
      html: `
<div class="field" style="width:20rem;max-width:100%">
  <div class="field-row"><label class="label">Password</label><a href="#" onclick="return false">Forgot?</a></div>
  <div class="password"><input class="input" type="password" value="correct-horse-battery" autocomplete="current-password"></div>
</div>`
    },
    {
      title: 'Strength meter',
      description: 'Type to watch the bars fill and the rules tick off.',
      html: `
<div class="field" style="width:24rem;max-width:100%">
  <label class="label">Create a password</label>
  <div class="password" data-strength><input class="input" type="password" placeholder="Make it memorable" autocomplete="new-password"></div>
</div>`
    },
    {
      title: 'Meter only, custom rules',
      html: `
<div class="field" style="width:24rem;max-width:100%">
  <label class="label">Vault passphrase</label>
  <div class="password" data-strength data-rules="length:12,number,symbol"><input class="input" type="password" value="Sunset2026" autocomplete="new-password"></div>
</div>`
    }
  ],
  api: [
    { name: '.password', type: 'class', desc: 'Wrap a password input (or put the class on an <code>.input-wrap</code>). Adds the eye button.' },
    { name: 'data-strength', type: 'attr', desc: 'Show the 4-bar meter and rules list below the field. <code>data-no-rules</code> hides the list.' },
    { name: 'data-rules', type: 'attr', default: 'length:8,lower,upper,number,symbol', desc: 'Which rules to check.' },
    { name: 'data-toggle="false" / data-capslock="false"', type: 'attr', desc: 'Turn off the eye button / Caps Lock hint.' },
    { name: 'Ranj.passwordScore(value, rules)', type: 'js', desc: 'Returns 0–4.' },
    { name: 'ranj:strength / ranj:reveal', type: 'event', desc: 'detail: <code>{ score, label }</code> / <code>{ visible }</code>' }
  ]
});

;
/* docs/registry/forms-radio.js */
(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var card = s('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>');
  var bank = s('<path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>');
  var apple = s('<path d="M12 6.5c1-1.8 2.6-2.5 3.5-2.5.2 1.3-.4 2.7-1.2 3.6-.8.9-2 1.5-3 1.4-.1-1 .2-1.8.7-2.5Z"/><path d="M17 12.5c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2s1.5-.7 2.8-.7 1.7.7 2.8.7c1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.4-.9-2.4-3.9Z"/>');
  var check = s('<path d="M20 6 9 17l-5-5"/>');
  RanjDocs.add({
    id: 'radio',
    name: 'Radio',
    group: 'Forms',
    description: 'Native radios with a springy dot. Group them vertically or horizontally, add descriptions, or turn them into rich radio cards with icons and prices — arrow keys work out of the box.',
    keywords: ['radio button', 'option', 'radio group', 'radio card', 'plan picker', 'pricing'],
    demos: [
      {
        title: 'Default',
        html: `
<div class="field" style="margin:0">
  <span class="label">Notify me about</span>
  <div class="radio-group">
    <label class="radio"><input type="radio" name="radio-demo-a" checked><span class="radio-mark"></span>All new messages</label>
    <label class="radio"><input type="radio" name="radio-demo-a"><span class="radio-mark"></span>Direct messages and mentions</label>
    <label class="radio"><input type="radio" name="radio-demo-a"><span class="radio-mark"></span>Nothing</label>
    <label class="radio"><input type="radio" name="radio-demo-a" disabled><span class="radio-mark"></span>Only urgent (Pro)</label>
  </div>
</div>`
      },
      {
        title: 'Horizontal, sizes and descriptions',
        html: `
<div style="display:grid;gap:1.5rem;width:26rem;max-width:100%">
  <div class="radio-group radio-group-horizontal" role="radiogroup" aria-label="Size">
    <label class="radio radio-sm"><input type="radio" name="radio-demo-b"><span class="radio-mark"></span>Small</label>
    <label class="radio"><input type="radio" name="radio-demo-b" checked><span class="radio-mark"></span>Default</label>
    <label class="radio radio-lg"><input type="radio" name="radio-demo-b"><span class="radio-mark"></span>Large</label>
    <label class="radio radio-outline"><input type="radio" name="radio-demo-b"><span class="radio-mark"></span>Outline</label>
  </div>
  <div class="radio-group" role="radiogroup" aria-label="Shipping">
    <label class="radio"><input type="radio" name="radio-demo-c" checked><span class="radio-mark"></span><span class="radio-body"><span class="radio-label">Standard — Free</span><span class="radio-desc">4–6 business days</span></span></label>
    <label class="radio"><input type="radio" name="radio-demo-c"><span class="radio-mark"></span><span class="radio-body"><span class="radio-label">Express — $12</span><span class="radio-desc">Arrives Thursday, Nov 19</span></span></label>
  </div>
</div>`
      },
      {
        title: 'Pricing cards',
        html: `
<div class="card-grid" role="radiogroup" aria-label="Plan" style="width:40rem;max-width:100%">
  <label class="radio-card"><input type="radio" name="radio-demo-plan" value="starter"><span class="radio-card-check">${check}</span>
    <span class="radio-card-title">Starter</span><span class="radio-card-price">$0<small> /mo</small></span><span class="radio-card-desc">1 project, community support.</span></label>
  <label class="radio-card"><input type="radio" name="radio-demo-plan" value="pro" checked><span class="radio-card-check">${check}</span>
    <span class="radio-card-head"><span class="radio-card-title">Pro</span><span class="radio-card-badge">Popular</span></span><span class="radio-card-price">$24<small> /mo</small></span><span class="radio-card-desc">Unlimited projects, analytics, priority support.</span></label>
  <label class="radio-card"><input type="radio" name="radio-demo-plan" value="team"><span class="radio-card-check">${check}</span>
    <span class="radio-card-title">Team</span><span class="radio-card-price">$79<small> /mo</small></span><span class="radio-card-desc">SSO, roles, audit log for 10 seats.</span></label>
</div>`
      },
      {
        title: 'Payment method cards',
        html: `
<div class="card-grid" role="radiogroup" aria-label="Payment method" style="width:34rem;max-width:100%">
  <label class="radio-card radio-card-row"><input type="radio" name="radio-demo-pay" checked><span class="radio-card-icon">${card}</span><span class="radio-body"><span class="radio-card-title">Card</span><span class="radio-card-desc">Visa •••• 4242</span></span><span class="radio-mark" style="margin-left:auto"></span></label>
  <label class="radio-card radio-card-row"><input type="radio" name="radio-demo-pay"><span class="radio-card-icon">${bank}</span><span class="radio-body"><span class="radio-card-title">Bank</span><span class="radio-card-desc">ACH transfer</span></span><span class="radio-mark" style="margin-left:auto"></span></label>
  <label class="radio-card radio-card-row"><input type="radio" name="radio-demo-pay"><span class="radio-card-icon">${apple}</span><span class="radio-body"><span class="radio-card-title">Apple Pay</span><span class="radio-card-desc">Touch ID</span></span><span class="radio-mark" style="margin-left:auto"></span></label>
</div>`
      }
    ],
    api: [
      { name: '.radio', type: 'class', desc: '<code>&lt;label class="radio"&gt;&lt;input type="radio"&gt;&lt;span class="radio-mark"&gt;&lt;/span&gt;Text&lt;/label&gt;</code>' },
      { name: '.radio-sm / .radio-lg / .radio-outline', type: 'class', desc: 'Sizes and an outlined checked style.' },
      { name: '.radio-group / .radio-group-horizontal', type: 'class', desc: 'Stacks; add <code>role="radiogroup"</code> + <code>aria-label</code>.' },
      { name: '.radio-body / .radio-label / .radio-desc', type: 'class', desc: 'Label with description.' },
      { name: '.radio-card', type: 'class', desc: 'Selectable card. Parts: <code>.radio-card-title</code>, <code>-desc</code>, <code>-price</code>, <code>-badge</code>, <code>-icon</code>, <code>-check</code>, <code>-head</code>. <code>.radio-card-row</code> lays it out horizontally.' }
    ]
  });
})();

;
/* docs/registry/forms-range-slider.js */
RanjDocs.add({
  id: 'range-slider',
  name: 'Range slider',
  group: 'Forms',
  description: 'A custom two-thumb slider for picking a range. Each thumb is a keyboard-accessible <code>role="slider"</code>, clicking the track moves the nearest thumb, and values post through hidden inputs.',
  tags: ['new', 'js'],
  keywords: ['dual slider', 'price range', 'min max', 'two thumbs', 'histogram'],
  demos: [
    {
      title: 'Price filter with histogram',
      description: 'Drag either thumb, click the track, or use ← → (Shift for bigger steps), PageUp/PageDown, Home/End.',
      html: `
<div class="demo-range-card">
  <div class="slider-head"><span class="label">Price range</span><output class="slider-output" data-slider-output></output></div>
  <div class="range-slider" data-min="0" data-max="1000" data-step="10" data-value="180,640" data-min-gap="50" data-name="price" data-bubble data-format="currency:USD" aria-label="Price"
    data-histogram="2,4,6,9,14,18,22,26,24,30,28,22,19,16,15,12,10,8,7,5,4,3,3,2"></div>
  <div class="demo-range-inputs"><span>Min <b data-out="min">$180</b></span><span>Max <b data-out="max">$640</b></span></div>
</div>`,
      js: `
const rs = root.querySelector('.range-slider'), f = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
rs.addEventListener('ranj:input', e => { root.querySelector('[data-out=min]').textContent = f.format(e.detail.value[0]); root.querySelector('[data-out=max]').textContent = f.format(e.detail.value[1]); });`,
      css: `
.demo-range-card { width: 26rem; max-width: 100%; padding: 1.25rem 1.25rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); box-shadow: var(--shadow-sm); }
.demo-range-card .slider-head { margin-bottom: 1rem; }
.demo-range-inputs { display: flex; justify-content: space-between; margin-top: .75rem; font-size: .8rem; color: var(--muted-fg); }
.demo-range-inputs b { color: var(--fg); font-weight: 600; margin-left: .25rem; font-variant-numeric: tabular-nums; }`
    },
    {
      title: 'Marks and single thumb',
      description: 'Give <code>data-value</code> one number for a single custom thumb.',
      html: `
<div style="width:26rem;max-width:100%;display:grid;gap:2.25rem">
  <div class="field">
    <div class="slider-head"><span class="label">Working hours</span><output class="slider-output" data-slider-output></output></div>
    <div class="range-slider" data-min="0" data-max="24" data-value="9,17" data-marks="0:12a,6:6a,12:12p,18:6p,24:12a" data-suffix=":00" aria-label="Working hours"></div>
  </div>
  <div class="field">
    <div class="slider-head"><span class="label">Discount</span><output class="slider-output" data-slider-output></output></div>
    <div class="range-slider slider-success" data-min="0" data-max="50" data-step="5" data-value="15" data-marks data-ticks-only data-bubble data-suffix="%" data-name="discount" aria-label="Discount"></div>
  </div>
</div>`
    }
  ],
  api: [
    { name: '.range-slider', type: 'class', desc: 'Custom slider. Reuses <code>.slider-sm/-lg</code> and color classes.' },
    { name: 'data-min / data-max / data-step', type: 'attr', default: '0 / 100 / 1', desc: 'Bounds and step.' },
    { name: 'data-value', type: 'attr', default: '25,75', desc: 'Two numbers for a range, one for a single thumb.' },
    { name: 'data-min-gap', type: 'attr', default: '0', desc: 'Minimum distance between thumbs.' },
    { name: 'data-name / data-name-min / data-name-max', type: 'attr', desc: 'Hidden inputs (<code>name[min]</code>, <code>name[max]</code> by default).' },
    { name: 'data-bubble, data-marks, data-format, data-prefix, data-suffix', type: 'attr', desc: 'Same as Slider.' },
    { name: 'data-histogram', type: 'attr', desc: 'Comma-separated bar heights drawn above the track, highlighted inside the range.' },
    { name: 'data-label-min / data-label-max', type: 'attr', default: 'Minimum / Maximum', desc: 'Accessible names of the thumbs.' },
    { name: 'Ranj.instance(el, "range-slider")', type: 'js', desc: '<code>{ value }</code> — get/set <code>[min, max]</code>.' },
    { name: 'ranj:input / ranj:change', type: 'event', desc: 'detail: <code>{ value: [min, max] }</code> (or a number for one thumb).' }
  ]
});

;
/* docs/registry/forms-rating-input.js */
RanjDocs.add({
  id: 'rating-input',
  name: 'Rating',
  group: 'Forms',
  description: 'Star (or heart) rating with hover preview, half steps, keyboard control as a <code>role="slider"</code>, word labels and a read-only display mode with partial fills.',
  tags: ['new', 'js'],
  keywords: ['stars', 'star rating', 'review', 'score', 'feedback', 'hearts'],
  demos: [
    {
      title: 'Leave a review',
      description: 'Hover to preview, click to set, click again to clear. Arrow keys and number keys work when focused.',
      html: `
<div class="demo-rating-card">
  <b>How was your stay at The Ludlow?</b>
  <div class="rating rating-lg" data-value="4" data-labels="Terrible|Poor|Okay|Great|Exceptional" data-name="score" aria-label="Your rating"></div>
</div>`,
      css: `.demo-rating-card { display: grid; gap: .75rem; justify-items: center; padding: 1.5rem; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-sm); }`
    },
    {
      title: 'Half steps, hearts and sizes',
      html: `
<div style="display:grid;gap:1rem;justify-items:center">
  <div class="rating" data-half data-value="3.5" data-show-value aria-label="Half-star rating"></div>
  <div class="rating rating-heart" data-icon="heart" data-value="2" data-max="5" aria-label="Love"></div>
  <div class="rating rating-sm rating-primary" data-value="3" data-max="10" aria-label="Out of ten"></div>
</div>`
    },
    {
      title: 'Read-only',
      html: `
<div class="demo-rating-row">
  <div class="rating rating-sm" data-readonly data-value="4.7" aria-label="Average rating"></div>
  <b>4.7</b><span>· 2,318 reviews</span>
</div>`,
      css: `.demo-rating-row { display: flex; align-items: center; gap: .45rem; font-size: .85rem; } .demo-rating-row span { color: var(--muted-fg); }`
    }
  ],
  api: [
    { name: '.rating', type: 'class', desc: 'Rating control. <code>.rating-sm</code>, <code>.rating-lg</code>, <code>.rating-heart</code>, <code>.rating-primary</code>.' },
    { name: 'data-value / data-max', type: 'attr', default: '0 / 5', desc: 'Current and maximum value.' },
    { name: 'data-half', type: 'attr', desc: 'Allow .5 steps (click the left half of a star).' },
    { name: 'data-readonly', type: 'attr', desc: 'Display only; any fraction renders as a partial fill.' },
    { name: 'data-labels', type: 'attr', desc: '<code>|</code>-separated words per star, shown beside and announced.' },
    { name: 'data-show-value / data-icon="heart" / data-clearable="false" / data-name', type: 'attr', desc: 'Show “3.5 / 5”, heart icons, prevent clearing, hidden input.' },
    { name: '--size / --on / --off', type: 'var', desc: 'Icon size and colors.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value, label }</code>' }
  ]
});

;
/* docs/registry/forms-search-input.js */
RanjDocs.add({
  id: 'search-input',
  name: 'Search input',
  group: 'Forms',
  description: 'A search field with a ⌘K / Ctrl K shortcut hint that focuses it from anywhere, a spinner that replaces the icon while loading, a clear button, Escape to clear, and a debounced <code>ranj:search</code> event.',
  tags: ['new', 'js'],
  keywords: ['search bar', 'search box', 'cmd k', 'keyboard shortcut', 'filter', 'debounce'],
  demos: [
    {
      title: 'Live search',
      description: 'Press ⌘K (or Ctrl K) to focus. Results load after you pause typing.',
      height: 300,
      html: `
<div style="width:26rem;max-width:100%">
  <div class="input-wrap search-input" data-shortcut="k"><input placeholder="Search components…"></div>
  <div class="search-results" id="search-input-results"></div>
</div>`,
      js: `
const names = ['Accordion','Alert','Avatar','Badge','Button','Calendar','Card','Checkbox','Color picker','Combobox','Date picker','Dialog','Drawer','File upload','Input','Multi-select','Number input','OTP input','Password','Popover','Radio','Range slider','Rating','Search input','Segmented control','Select','Slider','Switch','Tabs','Tag input','Textarea','Time picker','Toast','Toggle','Tooltip'];
const el = root.querySelector('.search-input'), out = root.querySelector('#search-input-results');
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
el.addEventListener('ranj:search', e => {
  const q = e.detail.query.toLowerCase();
  if (!q) { out.innerHTML = ''; return; }
  Ranj.searchLoading(el, true);
  setTimeout(() => {
    Ranj.searchLoading(el, false);
    const hits = names.filter(n => n.toLowerCase().includes(q)).slice(0, 5);
    out.innerHTML = hits.length ? hits.map((n, i) => { const k = n.toLowerCase().indexOf(q); return '<div class="search-result" style="animation-delay:' + i * 30 + 'ms">' + esc(n.slice(0, k)) + '<mark>' + esc(n.slice(k, k + q.length)) + '</mark>' + esc(n.slice(k + q.length)) + '<small>Forms</small></div>'; }).join('') : '<div class="search-result" style="color:var(--muted-fg)">No components match “' + esc(q) + '”</div>';
  }, 500);
});`
    },
    {
      title: 'Variants',
      html: `
<div style="width:24rem;max-width:100%;display:grid;gap:.75rem">
  <div class="input-wrap search-input search-input-pill input-filled" data-shortcut="/"><input placeholder="Type / to search"></div>
  <div class="input-wrap search-input input-sm"><input placeholder="Filter rows…" value="invoice"></div>
  <div class="input-wrap search-input search-input-lg" data-loading><input placeholder="Searching…" value="quarterly revenue"></div>
</div>`
    }
  ],
  api: [
    { name: '.search-input', type: 'class', desc: 'Put on an <code>.input-wrap</code> containing an input. Adds the icon, spinner and clear button.' },
    { name: '.search-input-pill / .search-input-lg', type: 'class', desc: 'Rounded and large variants; combine with <code>.input-filled</code>, <code>.input-sm</code>.' },
    { name: 'data-shortcut', type: 'attr', desc: 'A letter for ⌘/Ctrl + key, or <code>/</code>. Shows a hint and focuses the input from anywhere.' },
    { name: 'data-debounce / data-min-chars', type: 'attr', default: '250 / 0', desc: 'Delay and minimum length before <code>ranj:search</code>.' },
    { name: 'data-loading', type: 'attr', desc: 'Show the spinner.' },
    { name: 'Ranj.searchLoading(el, on)', type: 'js', desc: 'Toggle the spinner and <code>aria-busy</code>.' },
    { name: 'ranj:search / ranj:change / ranj:submit / ranj:clear', type: 'event', desc: '<code>search</code> detail: <code>{ value, query }</code> (debounced); <code>submit</code> on Enter.' }
  ]
});

;
/* docs/registry/forms-segmented.js */
(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var list = s('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>');
  var grid = s('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>');
  var board = s('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>');
  var sun = s('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>');
  var moon = s('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>');
  var mon = s('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>');
  RanjDocs.add({
    id: 'segmented',
    name: 'Segmented control',
    group: 'Forms',
    description: 'iOS-style segmented control: native radios under the hood (arrow keys, forms, no JS required) with a thumb that glides to the selected segment.',
    tags: ['new', 'js'],
    keywords: ['segmented', 'tabs', 'radio buttons', 'view switcher', 'pill tabs'],
    demos: [
      {
        title: 'Default',
        html: `
<div class="segmented" aria-label="Range">
  <label><input type="radio" name="seg-a" value="day">Day</label>
  <label><input type="radio" name="seg-a" value="week" checked>Week</label>
  <label><input type="radio" name="seg-a" value="month">Month</label>
  <label><input type="radio" name="seg-a" value="year">Year</label>
</div>`
      },
      {
        title: 'Icons, counts and variants',
        html: `
<div style="display:grid;gap:1.1rem;justify-items:center">
  <div class="segmented" aria-label="View"><label><input type="radio" name="seg-b" checked>${list}List</label><label><input type="radio" name="seg-b">${grid}Grid</label><label><input type="radio" name="seg-b">${board}Board</label></div>
  <div class="segmented segmented-pill segmented-primary" aria-label="Inbox"><label><input type="radio" name="seg-c" checked>All <span class="segmented-count">24</span></label><label><input type="radio" name="seg-c">Unread <span class="segmented-count">3</span></label><label><input type="radio" name="seg-c">Archived</label></div>
  <div class="segmented segmented-sm" aria-label="Theme"><label aria-label="Light"><input type="radio" name="seg-d">${sun}</label><label aria-label="Dark"><input type="radio" name="seg-d" checked>${moon}</label><label aria-label="System"><input type="radio" name="seg-d">${mon}</label></div>
  <div class="segmented segmented-underline" aria-label="Section"><label><input type="radio" name="seg-e" checked>Overview</label><label><input type="radio" name="seg-e">Activity</label><label><input type="radio" name="seg-e">Settings</label></div>
</div>`
      },
      {
        title: 'Full width in a pricing toggle',
        html: `
<div style="width:22rem;max-width:100%;display:grid;gap:.9rem">
  <div class="segmented segmented-block segmented-lg" aria-label="Billing">
    <label><input type="radio" name="seg-f" value="monthly">Monthly</label>
    <label><input type="radio" name="seg-f" value="yearly" checked>Yearly <span class="segmented-count">−20%</span></label>
  </div>
  <p class="demo-seg-price"><b>$19</b> per seat / month, billed yearly</p>
</div>`,
        js: `
const p = root.querySelector('.demo-seg-price');
root.querySelector('.segmented').addEventListener('ranj:change', e => p.innerHTML = e.detail.value === 'yearly' ? '<b>$19</b> per seat / month, billed yearly' : '<b>$24</b> per seat / month, billed monthly');`,
        css: `.demo-seg-price { text-align: center; font-size: .85rem; color: var(--muted-fg); } .demo-seg-price b { font-size: 1.5rem; color: var(--fg); margin-right: .2rem; }`
      }
    ],
    api: [
      { name: '.segmented', type: 'class', desc: 'Container of <code>&lt;label&gt;&lt;input type="radio"&gt;Text&lt;/label&gt;</code>. Gets <code>role="radiogroup"</code>; give it an <code>aria-label</code>.' },
      { name: '.segmented-sm / .segmented-lg / .segmented-block', type: 'class', desc: 'Sizes and full width.' },
      { name: '.segmented-pill / .segmented-primary / .segmented-underline', type: 'class', desc: 'Variants.' },
      { name: '.segmented-count', type: 'class', desc: 'Small badge inside a segment.' },
      { name: '--seg-bg / --seg-thumb', type: 'var', desc: 'Track and thumb colors.' },
      { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value }</code> (the radio’s value).' }
    ]
  });
})();

;
/* docs/registry/forms-select.js */
(function () {
  var globe = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>';
  RanjDocs.add({
    id: 'select',
    name: 'Select',
    group: 'Forms',
    description: 'The native <code>&lt;select&gt;</code>, styled to match inputs — keeps the OS picker on mobile and works without JS. For a fully custom listbox, see Custom select.',
    keywords: ['dropdown', 'native select', 'picker', 'option', 'optgroup'],
    demos: [
      {
        title: 'Default',
        html: `
<div class="field" style="width:20rem;max-width:100%">
  <label class="label">Country</label>
  <select class="select">
    <option value="" disabled selected>Select a country</option>
    <option>United States</option><option>Canada</option><option>United Kingdom</option><option>Germany</option><option>India</option><option>Japan</option>
  </select>
</div>`
      },
      {
        title: 'Groups, icon and sizes',
        html: `
<div style="width:20rem;max-width:100%;display:grid;gap:.75rem">
  <select class="select select-sm"><option>Small</option></select>
  <div class="select-wrapper"><span class="select-icon">${globe}</span>
    <select class="select">
      <optgroup label="Americas"><option>(GMT−08:00) Los Angeles</option><option selected>(GMT−05:00) New York</option></optgroup>
      <optgroup label="Europe"><option>(GMT+00:00) London</option><option>(GMT+01:00) Berlin</option></optgroup>
      <optgroup label="Asia"><option>(GMT+05:30) Mumbai</option><option>(GMT+09:00) Tokyo</option></optgroup>
    </select>
  </div>
  <select class="select select-lg"><option>Large</option></select>
</div>`
      },
      {
        title: 'Variants & states',
        html: `
<div class="form-grid" style="width:30rem;max-width:100%">
  <select class="select select-filled"><option>Filled</option></select>
  <div><select class="select select-ghost"><option>Sort: Newest</option><option>Sort: Popular</option></select></div>
  <select class="select" aria-invalid="true"><option>Invalid</option></select>
  <select class="select" disabled><option>Disabled</option></select>
  <select class="select span-full" multiple size="4"><option selected>Design</option><option>Engineering</option><option selected>Marketing</option><option>Sales</option></select>
</div>`
      }
    ],
    api: [
      { name: '.select', type: 'class', desc: 'Styled native select with a chevron. Works for <code>multiple</code> / <code>size</code> too.' },
      { name: '.select-sm / .select-lg', type: 'class', desc: 'Sizes.' },
      { name: '.select-filled / .select-ghost', type: 'class', desc: 'Variants. Ghost is compact for toolbars (“Sort by”).' },
      { name: '.select-wrapper + .select-icon', type: 'class', desc: 'v1 wrapper; add a leading icon.' },
      { name: '.select-base', type: 'class', desc: 'Opt in to the new styleable native picker (<code>appearance: base-select</code>) where supported.' }
    ]
  });
})();

;
/* docs/registry/forms-slider.js */
(function () {
  var vol0 = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/></svg>';
  var vol2 = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';
  RanjDocs.add({
    id: 'slider',
    name: 'Slider',
    group: 'Forms',
    description: 'A native <code>&lt;input type="range"&gt;</code> with a filled track, a springy thumb, an optional value bubble, tick marks with labels, formatting and a vertical layout. It stays a real range input, so keyboard, forms and screen readers just work.',
    tags: ['js'],
    keywords: ['range', 'range input', 'volume', 'value bubble', 'ticks', 'marks', 'vertical slider'],
    demos: [
      {
        title: 'Default',
        html: `
<div style="width:22rem;max-width:100%;display:grid;gap:1.75rem">
  <div class="slider"><input type="range" min="0" max="100" value="40" aria-label="Opacity"></div>
  <div class="demo-slider-vol">${vol0}<div class="slider slider-sm"><input type="range" min="0" max="100" value="72" aria-label="Volume"></div>${vol2}</div>
</div>`,
        css: `.demo-slider-vol { display: flex; align-items: center; gap: .75rem; color: var(--muted-fg); } .demo-slider-vol svg { flex-shrink: 0; }`
      },
      {
        title: 'Value bubble & output',
        description: '<code>data-bubble</code> shows the value while hovering or dragging (<code>="always"</code> to pin it). Any <code>[data-slider-output]</code> in the same field mirrors the formatted value.',
        html: `
<div style="width:24rem;max-width:100%;display:grid;gap:2.25rem">
  <div class="field">
    <div class="slider-head"><label class="label">Monthly budget</label><output class="slider-output" data-slider-output></output></div>
    <div class="slider" data-bubble data-format="currency:USD"><input type="range" min="0" max="5000" step="50" value="1250"></div>
  </div>
  <div class="field">
    <div class="slider-head"><label class="label">Team size</label><output class="slider-output" data-slider-output></output></div>
    <div class="slider slider-gradient" data-bubble="always" data-suffix=" seats"><input type="range" min="1" max="50" value="12"></div>
  </div>
</div>`
      },
      {
        title: 'Marks & step labels',
        description: '<code>data-marks</code> draws ticks at each step (or at the values you list). <code>data-labels</code> names each step.',
        html: `
<div style="width:26rem;max-width:100%;display:grid;gap:1.75rem">
  <div class="slider" data-marks data-suffix="%"><input type="range" min="0" max="100" step="25" value="50" aria-label="Zoom"></div>
  <div class="field">
    <label class="label">How likely are you to recommend us?</label>
    <div class="slider slider-lg" data-marks data-bubble data-labels="Not at all|Unlikely|Maybe|Likely|Absolutely"><input type="range" min="1" max="5" value="4"></div>
  </div>
  <div class="slider slider-success" data-marks="0:XS,25:S,50:M,75:L,100:XL"><input type="range" min="0" max="100" step="25" value="75" aria-label="T-shirt size"></div>
</div>`
      },
      {
        title: 'Vertical equalizer',
        html: `
<div class="demo-slider-eq">
  <div class="slider slider-vertical slider-sm" data-bubble style="--length:9rem"><input type="range" min="-12" max="12" value="4" aria-label="60 Hz"></div>
  <div class="slider slider-vertical slider-sm" data-bubble style="--length:9rem"><input type="range" min="-12" max="12" value="7" aria-label="230 Hz"></div>
  <div class="slider slider-vertical slider-sm" data-bubble style="--length:9rem"><input type="range" min="-12" max="12" value="2" aria-label="910 Hz"></div>
  <div class="slider slider-vertical slider-sm" data-bubble style="--length:9rem"><input type="range" min="-12" max="12" value="-3" aria-label="3.6 kHz"></div>
  <div class="slider slider-vertical slider-sm" data-bubble style="--length:9rem"><input type="range" min="-12" max="12" value="5" aria-label="14 kHz"></div>
</div>`,
        css: `.demo-slider-eq { display: flex; gap: 1.5rem; padding: 1.5rem 1.75rem; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); }`
      },
      {
        title: 'Disabled',
        html: `<div class="slider" style="width:20rem;max-width:100%"><input type="range" value="30" disabled aria-label="Disabled"></div>`
      }
    ],
    api: [
      { name: '.slider', type: 'class', desc: 'Wrap an <code>&lt;input type="range"&gt;</code> (v1 markup).' },
      { name: '.slider-sm / .slider-lg', type: 'class', desc: 'Sizes.' },
      { name: '.slider-success / -warning / -destructive / -gradient', type: 'class', desc: 'Fill colors (or set <code>--fill-color</code>).' },
      { name: '.slider-vertical', type: 'class', desc: 'Vertical; set the height with <code>--length</code>.' },
      { name: 'data-bubble', type: 'attr', desc: 'Value bubble on hover/drag; <code>"always"</code> keeps it visible.' },
      { name: 'data-marks', type: 'attr', desc: 'Empty = one tick per step; or <code>"0,50,100"</code>; or <code>"0:Low,100:High"</code> with labels. <code>data-ticks-only</code> hides labels.' },
      { name: 'data-format', type: 'attr', desc: '<code>currency:EUR</code>, <code>percent</code> or <code>compact</code> (Intl).' },
      { name: 'data-prefix / data-suffix / data-labels', type: 'attr', desc: 'Text around the value, or a <code>|</code>-separated name per step. Also sets <code>aria-valuetext</code>.' },
      { name: '[data-slider-output]', type: 'attr', desc: 'Any element in the same field that should show the formatted value.' },
      { name: '--thumb / --track / --fill-color / --track-color', type: 'var', default: '1.125rem / .375rem', desc: 'Geometry and colors.' },
      { name: 'ranj:input / ranj:change', type: 'event', desc: 'detail: <code>{ value }</code> — while dragging / on release.' }
    ]
  });
})();

;
/* docs/registry/forms-switch.js */
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

;
/* docs/registry/forms-tag-input.js */
RanjDocs.add({
  id: 'tag-input',
  name: 'Tag input',
  group: 'Forms',
  description: 'Free-form chips: type and press Enter or comma, paste a list to split it, Backspace to remove. Supports a maximum, duplicate protection and pattern checks (like emails).',
  tags: ['new', 'js'],
  keywords: ['tags', 'chips input', 'token field', 'keywords', 'email list', 'invite'],
  demos: [
    {
      title: 'Default',
      html: `
<div class="field" style="width:26rem;max-width:100%">
  <label class="label">Topics</label>
  <div class="tag-input" data-name="topics" data-value="design, motion, css" data-placeholder="Add a topic…"></div>
  <p class="field-hint">Press Enter or comma to add. Paste “a, b, c” to add many.</p>
</div>`
    },
    {
      title: 'Invite by email',
      description: '<code>data-pattern="email"</code> marks invalid entries, <code>data-max="5"</code> caps the list.',
      html: `
<div class="field" style="width:31rem;max-width:100%">
  <label class="label">Invite teammates</label>
  <div class="tag-input" data-name="emails[]" data-pattern="email" data-max="5" data-value="maya@acme.dev, leo@acme.dev, not-an-email" data-placeholder="name@company.com" data-add-on-blur>
    <div class="chip-box chip-box-primary"><input></div>
    <div class="tag-input-foot"><span>Separate emails with commas</span><span class="tag-input-count"></span></div>
  </div>
</div>`
    },
    {
      title: 'With suggestions',
      html: `
<div class="field" style="width:26rem;max-width:100%">
  <label class="label">Keywords</label>
  <div class="tag-input" id="tag-input-sugg" data-lowercase data-value="ui"></div>
  <div class="tag-input-suggest">
    <button type="button" data-tag="components">+ components</button><button type="button" data-tag="dark mode">+ dark mode</button>
    <button type="button" data-tag="vanilla js">+ vanilla js</button><button type="button" data-tag="accessibility">+ accessibility</button>
  </div>
</div>`,
      js: `
const ti = root.querySelector('#tag-input-sugg');
root.querySelectorAll('[data-tag]').forEach(b => b.onclick = () => Ranj.instance(ti, 'tag-input').add(b.dataset.tag));`
    }
  ],
  api: [
    { name: '.tag-input', type: 'class', desc: 'Container. A <code>.chip-box</code> with an <code>&lt;input&gt;</code> is created if missing. <code>.chip-box-primary</code> tints chips.' },
    { name: 'data-name', type: 'attr', desc: 'Hidden input name. Ending in <code>[]</code> creates one input per tag; otherwise tags are comma-joined.' },
    { name: 'data-value', type: 'attr', desc: 'Initial comma-separated tags.' },
    { name: 'data-max / data-max-length', type: 'attr', desc: 'Maximum number of tags / characters per tag.' },
    { name: 'data-pattern', type: 'attr', desc: 'Regex (or <code>email</code>) — non-matching tags are marked invalid.' },
    { name: 'data-separators', type: 'attr', default: ',;', desc: 'Keys that commit a tag (Enter always does).' },
    { name: 'data-allow-duplicates / data-lowercase / data-add-on-blur', type: 'attr', desc: 'Behaviour switches.' },
    { name: '.tag-input-count', type: 'class', desc: 'Element inside that shows <code>n / max</code>.' },
    { name: 'Ranj.instance(el, "tag-input")', type: 'js', desc: '<code>{ value, add(tag), remove(tag) }</code>' },
    { name: 'ranj:change / ranj:add / ranj:remove / ranj:reject', type: 'event', desc: '<code>change</code> detail: <code>{ value: string[] }</code>. Cancel <code>ranj:add</code> to block a tag.' }
  ]
});

;
/* docs/registry/forms-textarea.js */
(function () {
  var s = function (d) { return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var clip = s('<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>');
  var smile = s('<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>');
  var send = s('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>');
  RanjDocs.add({
    id: 'textarea',
    name: 'Textarea',
    group: 'Forms',
    description: 'Multi-line text with auto-grow (<code>data-autosize</code>) and a live character counter (<code>data-maxlength</code>) that warns near the limit.',
    tags: ['js'],
    keywords: ['multiline', 'autosize', 'auto grow', 'character count', 'counter', 'composer'],
    demos: [
      {
        title: 'Default',
        html: `
<div class="field" style="width:24rem;max-width:100%">
  <label class="label">Message</label>
  <textarea class="textarea" placeholder="Tell us a little about your project…"></textarea>
  <p class="field-hint">Markdown is supported.</p>
</div>`
      },
      {
        title: 'Auto-grow with counter',
        description: 'Type past a few lines — the box grows up to <code>data-max-rows</code>, then scrolls. The counter goes amber near the limit and red when over.',
        html: `
<div class="field" style="width:26rem;max-width:100%">
  <div class="field-row"><label class="label">Bio</label></div>
  <textarea class="textarea" data-autosize data-max-rows="8" data-maxlength="160" rows="2">Product designer in Brooklyn. Previously at Linear and Figma. Obsessed with type, motion and good coffee.</textarea>
  <p class="field-hint">Shown on your public profile.</p>
</div>`
      },
      {
        title: 'Composer',
        description: '<code>.textarea-box</code> adds a footer toolbar; <code>data-counter-ring</code> swaps the counter for a ring that counts down in the last 20 characters.',
        html: `
<div class="textarea-box" style="width:30rem;max-width:100%">
  <textarea class="textarea" data-autosize data-max-rows="6" data-maxlength="280" data-counter-ring rows="2" placeholder="What’s happening?"></textarea>
  <div class="textarea-foot">
    <button class="btn btn-ghost btn-icon btn-sm" type="button" aria-label="Attach">${clip}</button>
    <button class="btn btn-ghost btn-icon btn-sm" type="button" aria-label="Emoji">${smile}</button>
    <span class="field-counter"></span>
    <button class="btn btn-primary btn-sm" type="button">${send}Post</button>
  </div>
</div>`
      },
      {
        title: 'States',
        html: `
<div class="form-grid" style="width:34rem;max-width:100%">
  <textarea class="textarea textarea-filled" placeholder="Filled"></textarea>
  <textarea class="textarea" aria-invalid="true">Too short</textarea>
  <textarea class="textarea" disabled>Disabled</textarea>
  <textarea class="textarea textarea-sm" placeholder="Small"></textarea>
</div>`
      }
    ],
    api: [
      { name: '.textarea', type: 'class', desc: 'Styled textarea. <code>.textarea-sm</code>, <code>.textarea-filled</code>.' },
      { name: 'data-autosize', type: 'attr', desc: 'Grow with content. Pair with <code>data-max-rows</code> / <code>data-min-rows</code>.' },
      { name: 'data-maxlength', type: 'attr', desc: 'Soft limit with a live counter (works on inputs too). Uses <code>.field-counter</code> in the same field/box if present, else adds one.' },
      { name: 'data-counter-ring', type: 'attr', desc: 'Show a progress ring next to the count.' },
      { name: 'data-counter', type: 'attr', desc: 'Selector of an element to render the counter into.' },
      { name: '.textarea-box / .textarea-foot', type: 'class', desc: 'Composer shell with a toolbar row.' }
    ]
  });
})();

;
/* docs/registry/forms-time-picker.js */
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

;
/* docs/registry/forms-toggle.js */
(function () {
  var s = function (d, extra) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + d + '</svg>'; };
  var bold = s('<path d="M6 12h9a4 4 0 0 1 0 8H6zM6 4h7a4 4 0 0 1 0 8H6z"/>', ' stroke-width="2.5"');
  var italic = s('<path d="M19 4h-9M14 20H5M15 4 9 20"/>');
  var under = s('<path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/>');
  var heart = s('<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>');
  var star = s('<path d="M12 2.6l2.9 6.06 6.6.8-4.87 4.56 1.27 6.54L12 17.3l-5.9 3.26 1.27-6.54L2.5 9.46l6.6-.8z"/>');
  var pin = s('<path d="M12 17v5M9 10.76V6h6v4.76l2 3.24H7z"/><path d="M8 3h8"/>');
  RanjDocs.add({
    id: 'toggle',
    name: 'Toggle',
    group: 'Forms',
    description: 'A two-state button with <code>aria-pressed</code>. Use it for favourites, pins and formatting buttons; icons pop when pressed.',
    tags: ['js'],
    keywords: ['toggle button', 'pressed', 'favorite', 'like button', 'bookmark'],
    demos: [
      {
        title: 'Default',
        html: `
<button class="toggle" aria-label="Bold">${bold}</button>
<button class="toggle" aria-pressed="true" aria-label="Italic">${italic}</button>
<button class="toggle toggle-outline">${under}Underline</button>
<button class="toggle toggle-outline toggle-primary" aria-pressed="true">${pin}Pinned</button>
<button class="toggle" disabled>${bold}Disabled</button>`
      },
      {
        title: 'Reactions',
        description: '<code>.toggle-pop</code> fills and bounces the icon.',
        html: `
<button class="toggle toggle-outline toggle-pop toggle-heart" aria-pressed="true" data-count="128">${heart}<span>128</span></button>
<button class="toggle toggle-outline toggle-pop toggle-star">${star}<span>Star</span></button>
<button class="toggle toggle-sm toggle-pop toggle-heart" aria-label="Like">${heart}</button>
<button class="toggle toggle-lg toggle-solid">${pin}Follow</button>`,
        js: `
const t = root.querySelector('[data-count]');
t.addEventListener('ranj:change', e => t.querySelector('span').textContent = e.detail.pressed ? 128 : 127);`
      }
    ],
    api: [
      { name: '.toggle', type: 'class', desc: 'Toggle button. State: <code>aria-pressed="true"</code> (v1 <code>.active</code> also works).' },
      { name: '.toggle-outline / .toggle-primary / .toggle-solid', type: 'class', desc: 'Variants for the pressed look.' },
      { name: '.toggle-sm / .toggle-lg', type: 'class', desc: 'Sizes.' },
      { name: '.toggle-pop / .toggle-heart / .toggle-star', type: 'class', desc: 'Fill-and-bounce icon reactions.' },
      { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ pressed, value }</code>' }
    ]
  });

  RanjDocs.add({
    id: 'toggle-group',
    name: 'Toggle group',
    group: 'Forms',
    description: 'A set of toggles where one (or several, with <code>data-multiple</code>) can be on. Arrow keys move focus with a roving tabindex, and <code>data-name</code> posts the value with forms.',
    tags: ['js'],
    keywords: ['button group', 'toolbar', 'text formatting', 'alignment', 'single select', 'multi select'],
    demos: [
      {
        title: 'Editor toolbar',
        description: 'Formatting is multiple; alignment is single and can’t be cleared (<code>data-required-one</code>).',
        html: `
<div class="toolbar" role="toolbar" aria-label="Formatting">
  <div class="toggle-group" data-multiple aria-label="Text style" data-name="style">
    <button class="toggle toggle-sm" data-value="bold" aria-label="Bold" aria-pressed="true">${bold}</button>
    <button class="toggle toggle-sm" data-value="italic" aria-label="Italic">${italic}</button>
    <button class="toggle toggle-sm" data-value="underline" aria-label="Underline">${under}</button>
  </div>
  <span class="toggle-group-sep"></span>
  <div class="toggle-group" data-required-one aria-label="Alignment" data-name="align">
    <button class="toggle toggle-sm" data-value="left" aria-label="Align left" aria-pressed="true">${s('<path d="M15 12H3M17 18H3M21 6H3"/>')}</button>
    <button class="toggle toggle-sm" data-value="center" aria-label="Align center">${s('<path d="M18 12H6M21 6H3M17 18H7"/>')}</button>
    <button class="toggle toggle-sm" data-value="right" aria-label="Align right">${s('<path d="M21 12H9M21 18H7M21 6H3"/>')}</button>
  </div>
</div>`
      },
      {
        title: 'Text options',
        html: `
<div style="display:grid;gap:1rem;justify-items:center">
  <div class="toggle-group toggle-group-primary" aria-label="Billing period">
    <button class="toggle" data-value="monthly" aria-pressed="true">Monthly</button>
    <button class="toggle" data-value="yearly">Yearly</button>
    <button class="toggle" data-value="lifetime" disabled>Lifetime</button>
  </div>
  <div class="toggle-group toggle-group-attached" data-multiple aria-label="Days">
    <button class="toggle" aria-pressed="true">Mon</button><button class="toggle" aria-pressed="true">Tue</button><button class="toggle">Wed</button>
    <button class="toggle" aria-pressed="true">Thu</button><button class="toggle">Fri</button>
  </div>
  <p class="field-hint" id="toggle-group-out">Click a day</p>
</div>`,
        js: `
root.querySelectorAll('.toggle-group').forEach(g => g.addEventListener('ranj:change', e => root.querySelector('#toggle-group-out').textContent = 'Value: ' + JSON.stringify(e.detail.value)));`
      }
    ],
    api: [
      { name: '.toggle-group', type: 'class', desc: 'Group of <code>.toggle</code> buttons (single choice by default).' },
      { name: 'data-multiple', type: 'attr', desc: 'Allow several pressed at once.' },
      { name: 'data-required-one', type: 'attr', desc: 'Single mode: clicking the pressed toggle doesn’t clear it.' },
      { name: 'data-name', type: 'attr', desc: 'Hidden input name; value is the pressed <code>data-value</code> (comma-joined when multiple).' },
      { name: '.toggle-group-attached / -primary / -sm / -vertical', type: 'class', desc: 'Joined borders, tinted pressed state, compact, vertical.' },
      { name: '.toolbar / .toggle-group-sep', type: 'class', desc: 'Toolbar container and divider.' },
      { name: 'Ranj.instance(el, "toggle-group")', type: 'js', desc: '<code>{ value }</code> get/set.' },
      { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ value }</code> — a string, or an array with <code>data-multiple</code>.' }
    ]
  });
})();

;
/* docs/registry/foundations-colors.js */
(function () {
  var groups = [
    ['Surfaces', ['bg', 'bg-subtle', 'card', 'popover', 'muted', 'secondary', 'secondary-hover']],
    ['Text', ['fg', 'muted-fg', 'card-fg', 'secondary-fg', 'popover-fg']],
    ['Brand', ['primary', 'primary-hover', 'primary-fg', 'primary-soft', 'primary-soft-fg', 'ring']],
    ['Lines', ['border', 'border-strong', 'input']],
    ['Destructive', ['destructive', 'destructive-hover', 'destructive-soft', 'destructive-soft-fg']],
    ['Success', ['success', 'success-fg', 'success-soft', 'success-soft-fg']],
    ['Warning', ['warning', 'warning-fg', 'warning-soft', 'warning-soft-fg']],
    ['Info', ['info', 'info-fg', 'info-soft', 'info-soft-fg']]
  ];
  var sw = groups.map(function (g) {
    return '<div class="demo-colors-group"><div class="demo-colors-label">' + g[0] + '</div><div class="demo-colors-row">' +
      g[1].map(function (t) {
        return '<button type="button" class="demo-colors-sw" data-token="--' + t + '" title="Copy var(--' + t + ')"><span class="demo-colors-chip" style="background:var(--' + t + ')"></span><b>--' + t + '</b><code data-val></code></button>';
      }).join('') + '</div></div>';
  }).join('\n');

  var scale = [97, 93, 86, 77, 67, 58, 50, 42, 34, 26, 19].map(function (l, i) {
    var name = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950][i];
    var c = (l > 90 ? .04 : l > 80 ? .09 : l > 60 ? .17 : l > 40 ? .21 : .14);
    return '<div class="demo-colors-step" style="background:oklch(' + (l / 100) + ' ' + c + ' var(--hue));color:' + (l > 62 ? '#18181b' : '#fff') + '"><b>' + name + '</b></div>';
  }).join('');

  RanjDocs.add({
    id: 'colors',
    name: 'Colors',
    group: 'Foundations',
    description: 'Every semantic color token, rendered live from the current theme. Toggle light/dark or pick an accent in the customizer and the swatches update. Click a swatch to copy its <code>var()</code>.',
    tags: ['new'],
    keywords: ['palette', 'tokens', 'theme', 'swatch', 'oklch', 'design tokens'],
    demos: [
      {
        title: 'Semantic tokens',
        description: 'Components only read these names, so re-theming is a matter of overriding a few variables.',
        center: false,
        html: '<div class="demo-colors">\n' + sw + '\n</div>',
        css: [
          '.demo-colors { display: grid; gap: 1.5rem; }',
          '.demo-colors-label { font-size: .72rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted-fg); margin-bottom: .6rem; }',
          '.demo-colors-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: .6rem; }',
          '.demo-colors-sw { display: grid; grid-template-columns: 2.25rem 1fr; grid-template-rows: auto auto; column-gap: .65rem; align-items: center; padding: .5rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); text-align: left; transition: border-color var(--transition), transform var(--transition); min-width: 0; }',
          '.demo-colors-sw:hover { border-color: var(--border-strong); transform: translateY(-1px); }',
          '.demo-colors-chip { grid-row: span 2; width: 2.25rem; height: 2.25rem; border-radius: var(--radius); box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--fg) 12%, transparent); }',
          '.demo-colors-sw b { font-family: var(--font-mono); font-size: .72rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
          '.demo-colors-sw code { background: none; padding: 0; font-size: .68rem; color: var(--muted-fg); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
          '.demo-colors-sw[data-copied] code { color: var(--success-soft-fg); }'
        ].join('\n'),
        js: [
          "var cv = document.createElement('canvas'); cv.width = cv.height = 1; var cx = cv.getContext('2d', { willReadFrequently: true });",
          "function hex(v) {",
          "  cx.clearRect(0, 0, 1, 1); cx.fillStyle = v; cx.fillRect(0, 0, 1, 1);",
          "  var d = cx.getImageData(0, 0, 1, 1).data, h = '#' + [d[0], d[1], d[2]].map(function (n) { return n.toString(16).padStart(2, '0'); }).join('');",
          "  return d[3] < 255 ? h + ' · ' + Math.round(d[3] / 2.55) + '%' : h;",
          "}",
          "function paint() {",
          "  root.querySelectorAll('[data-token]').forEach(function (b) {",
          "    var probe = b.querySelector('.demo-colors-chip');",
          "    b.querySelector('[data-val]').textContent = hex(getComputedStyle(probe).backgroundColor);",
          "  });",
          "}",
          "paint();",
          "var t = setTimeout(paint, 60);",
          "var onTheme = function () { setTimeout(paint, 30); };",
          "document.addEventListener('ranj:theme', onTheme);",
          "var mo = new MutationObserver(onTheme); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-accent', 'data-theme', 'style'] });",
          "root.addEventListener('click', function (e) {",
          "  var b = e.target.closest('[data-token]'); if (!b) return;",
          "  (Ranj.copy || function (x) { return navigator.clipboard.writeText(x); })('var(' + b.dataset.token + ')');",
          "  var v = b.querySelector('[data-val]'), old = v.textContent; b.setAttribute('data-copied', ''); v.textContent = 'Copied';",
          "  setTimeout(function () { b.removeAttribute('data-copied'); v.textContent = old; }, 1100);",
          "});",
          "return function () { clearTimeout(t); document.removeEventListener('ranj:theme', onTheme); mo.disconnect(); };"
        ].join('\n')
      },
      {
        title: 'Brand scale from one hue',
        description: 'The brand is driven by <code>--hue</code>. Use <code>oklch(L C var(--hue))</code> for tinted extras; drag to re-hue this panel only.',
        center: false,
        html: '<div class="demo-colors-hue">\n  <div class="demo-colors-scale">' + scale + '</div>\n  <label class="demo-colors-slider"><span>--hue</span><input type="range" min="0" max="360" value="252" aria-label="Hue"><output>252</output></label>\n  <div class="cluster">\n    <button class="btn">Primary</button><button class="btn btn-soft">Soft</button><button class="btn btn-outline">Outline</button>\n    <span class="badge badge-soft badge-dot">Active</span><span class="badge">New</span>\n  </div>\n</div>',
        css: [
          '.demo-colors-hue { display: grid; gap: 1.25rem; --primary: oklch(0.55 0.22 var(--hue)); --primary-hover: oklch(0.49 0.22 var(--hue)); --primary-soft: oklch(0.96 0.03 var(--hue)); --primary-soft-fg: oklch(0.45 0.2 var(--hue)); --ring: color-mix(in oklab, var(--primary) 55%, transparent); }',
          '[data-theme="dark"] .demo-colors-hue { --primary: oklch(0.66 0.2 var(--hue)); --primary-hover: oklch(0.72 0.18 var(--hue)); --primary-soft: oklch(0.27 0.07 var(--hue)); --primary-soft-fg: oklch(0.82 0.12 var(--hue)); }',
          '.demo-colors-scale { display: grid; grid-template-columns: repeat(11, 1fr); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); }',
          '.demo-colors-step { height: 4.5rem; display: flex; align-items: flex-end; padding: .4rem; font-size: .68rem; }',
          '@media (max-width: 600px) { .demo-colors-scale { grid-template-columns: repeat(6, 1fr); } .demo-colors-step { height: 3rem; } }',
          '.demo-colors-slider { display: flex; align-items: center; gap: .75rem; font-family: var(--font-mono); font-size: .8rem; color: var(--muted-fg); }',
          '.demo-colors-slider input { flex: 1; accent-color: var(--primary); }',
          '.demo-colors-slider output { width: 2.5rem; text-align: right; color: var(--fg); font-variant-numeric: tabular-nums; }'
        ].join('\n'),
        js: "var box = root.querySelector('.demo-colors-hue'), r = box.querySelector('input'), o = box.querySelector('output');\nr.addEventListener('input', function () { box.style.setProperty('--hue', r.value); o.textContent = r.value; });"
      },
      {
        title: 'Status pairs',
        center: false,
        description: 'Each status ships a solid color plus a <code>-soft</code> background and readable <code>-soft-fg</code> text, tuned per theme.',
        html: [
          '<div class="demo-colors-status">',
          '  <div style="background:var(--success-soft);color:var(--success-soft-fg)">' + RB.ic('checkCircle') + '<div><b>Payment received</b><span>$1,240.00 from Northwind Traders</span></div></div>',
          '  <div style="background:var(--warning-soft);color:var(--warning-soft-fg)">' + RB.ic('alert') + '<div><b>Usage at 86%</b><span>You will hit the API cap in 4 days</span></div></div>',
          '  <div style="background:var(--destructive-soft);color:var(--destructive-soft-fg)">' + RB.ic('alertCircle') + '<div><b>Deploy failed</b><span>Build exited with code 1 on main</span></div></div>',
          '  <div style="background:var(--info-soft);color:var(--info-soft-fg)">' + RB.ic('info') + '<div><b>Maintenance window</b><span>Sunday 02:00–03:00 UTC</span></div></div>',
          '</div>'
        ].join('\n'),
        css: '.demo-colors-status { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: .75rem; width: 100%; }\n.demo-colors-status > div { display: flex; gap: .75rem; padding: .9rem 1rem; border-radius: var(--radius-lg); font-size: .85rem; }\n.demo-colors-status svg { width: 1.1rem; height: 1.1rem; flex-shrink: 0; margin-top: .1rem; }\n.demo-colors-status b { display: block; font-weight: 600; }\n.demo-colors-status span { opacity: .85; }'
      }
    ],
    api: [
      { name: '--hue', type: 'var', default: '252', desc: 'OKLCH hue that drives every brand color.' },
      { name: '--primary / --primary-fg', type: 'var', desc: 'Brand fill and the text that sits on it.' },
      { name: '--primary-soft', type: 'var', desc: 'Tinted background and its readable text. Also: <code>--primary-soft-fg</code>' },
      { name: '--bg', type: 'var', desc: 'Page and raised surfaces. Also: <code>--bg-subtle</code> <code>--card</code> <code>--popover</code>' },
      { name: '--muted / --muted-fg', type: 'var', desc: 'Quiet fills and secondary text.' },
      { name: '--border', type: 'var', desc: 'Hairlines, control borders and the focus ring. Also: <code>--border-strong</code> <code>--input</code> <code>--ring</code>' },
      { name: '--{tone}-soft / -soft-fg', type: 'var', desc: 'Status colors with soft variants.' },
      { name: 'data-accent', type: 'attr', desc: 'Preset hues on <code>&lt;html&gt;</code>: blue, indigo, violet, purple, pink, rose, orange, amber, lime, green, teal, cyan, mono.' }
    ]
  });
})();

;
/* docs/registry/foundations-icons.js */
(function () {
  var I = RB.ic;
  var names = ['search', 'bell', 'settings', 'user', 'mail', 'calendar', 'heart', 'star', 'download', 'upload', 'trash', 'edit', 'lock', 'globe', 'zap', 'rocket', 'cloud', 'database', 'terminal', 'git', 'chart', 'layers', 'shield', 'package'];
  RanjDocs.add({
    id: 'icons',
    name: 'Icons',
    group: 'Foundations',
    description: 'Ranj UI ships no icon font. Paste inline SVG (we recommend <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a>): icons inherit <code>currentColor</code> and size themselves inside buttons, badges, chips and inputs.',
    tags: ['new'],
    keywords: ['svg', 'lucide', 'heroicons', 'icon', 'glyph', 'symbol'],
    demos: [
      {
        title: 'Inline SVG grid',
        description: 'Copy any SVG from Lucide. Use <code>stroke="currentColor"</code> so color follows text.',
        center: false,
        html: '<div class="demo-icons-grid">\n' + names.map(function (n) { return '  <div title="' + n + '">' + I(n) + '<span>' + n + '</span></div>'; }).join('\n') + '\n</div>',
        css: `.demo-icons-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: .5rem; }
.demo-icons-grid > div { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 1rem .5rem .75rem; border-radius: var(--radius-lg); border: 1px solid transparent; color: var(--fg); transition: background var(--transition), border-color var(--transition), color var(--transition); }
.demo-icons-grid > div:hover { background: var(--card); border-color: var(--border); color: var(--primary); }
.demo-icons-grid svg { width: 1.5rem; height: 1.5rem; }
.demo-icons-grid span { font-size: .7rem; color: var(--muted-fg); }`
      },
      {
        title: 'Sizes, stroke and color',
        description: 'Set width/height (or <code>.size-4</code>, <code>.size-5</code>, <code>.size-6</code>), change <code>stroke-width</code>, and color with any text utility.',
        html: `<div class="cluster" style="gap:1.5rem">
  <span class="size-4">${I('rocket', 'class="size-4"')}</span>
  ${I('rocket', 'class="size-5"')}
  ${I('rocket', 'class="size-6"')}
  ${I('rocket', 'class="size-8" stroke-width="1.5"')}
  ${I('rocket', 'class="size-10" stroke-width="1.25"')}
  <span class="separator-vertical separator" style="height:2rem"></span>
  ${I('heart', 'class="size-6 text-destructive"')}
  ${I('checkCircle', 'class="size-6 text-success"')}
  ${I('alert', 'class="size-6 text-warning"')}
  ${I('sparkles', 'class="size-6 text-primary"')}
</div>`
      },
      {
        title: 'Icons inside components',
        description: 'No extra classes needed: components size their icons at about 1.1em.',
        html: `<div class="cluster" style="justify-content:center;max-width:46rem">
<button class="btn">${I('download')} Download</button>
<button class="btn btn-outline">Continue ${I('arrowRight')}</button>
<button class="btn btn-secondary btn-icon" aria-label="Settings">${I('settings')}</button>
<span class="badge badge-soft badge-success">${I('check')} Verified</span>
<span class="chip">${I('mapPin')} Lisbon</span>
<span class="icon-box">${I('zap')}</span>
</div>`
      },
      {
        title: 'Using Lucide from a CDN',
        description: 'Prefer not to paste SVG? Load Lucide once and use <code>&lt;i data-lucide="name"&gt;</code>. Ranj UI styles the generated SVG the same way.',
        center: false,
        html: `<div class="code-block" data-lang="html">
  <div class="code-block-header"><span class="code-block-filename">${I('fileCode')} index.html</span><button class="code-block-copy" aria-label="Copy code">${I('copy', 'class="icon-copy"')}${I('check', 'class="icon-done"')}</button></div>
  <pre><code>&lt;script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"&gt;&lt;/script&gt;

&lt;button class="btn"&gt;&lt;i data-lucide="download"&gt;&lt;/i&gt; Download&lt;/button&gt;

&lt;script&gt;
  lucide.createIcons();
  // Re-run after injecting HTML, or on ranj:ready
  document.addEventListener('ranj:ready', () =&gt; lucide.createIcons());
&lt;/script&gt;</code></pre>
</div>`
      }
    ],
    api: [
      { name: '.btn > svg', type: 'class', desc: 'Auto-sized to the component (about 1–1.1em) and non-interactive. Also: <code>.badge > svg</code> <code>.chip > svg</code>' },
      { name: '.size-4', type: 'class', desc: 'Square sizing utilities for icons. Also: <code>.size-5</code> <code>.size-6</code> <code>.size-8</code> <code>.size-10</code>' },
      { name: 'stroke="currentColor"', type: 'attr', desc: 'Lets icons follow the surrounding text color, including hover and dark mode.' },
      { name: 'aria-hidden="true"', type: 'attr', desc: 'Decorative icons should be hidden; icon-only buttons need an <code>aria-label</code>.' }
    ]
  });
})();

;
/* docs/registry/foundations-motion-tokens.js */
(function () {
  var I = RB.ic;
  var eases = [
    ['--ease', 'UI default: hovers, color, small moves'],
    ['--ease-out', 'Things entering: menus, toasts, reveals'],
    ['--ease-in-out', 'Moving between two on-screen states'],
    ['--ease-spring', 'Playful overshoot: toggles, pops'],
    ['--ease-bounce', 'Anticipation + overshoot, use rarely']
  ];
  var rows = eases.map(function (e) {
    return '<div class="demo-motion-row"><div class="demo-motion-meta"><code>' + e[0] + '</code><span>' + e[1] + '</span></div><div class="demo-motion-track"><i style="--e:var(' + e[0] + ')"></i></div></div>';
  }).join('\n  ');
  var durs = [['--dur-fast', '120ms'], ['--dur', '200ms'], ['--dur-slow', '350ms'], ['--dur-slower', '600ms']].map(function (d) {
    return '<div class="demo-motion-dur"><div class="demo-motion-track"><i style="--d:var(' + d[0] + ')"></i></div><code>' + d[0] + '</code><span>' + d[1] + '</span></div>';
  }).join('\n  ');
  RanjDocs.add({
    id: 'motion-tokens',
    name: 'Motion tokens',
    group: 'Foundations',
    description: 'Five easing curves and four durations used across every component. Hover or press Play to compare them side by side.',
    tags: ['new'],
    keywords: ['easing', 'duration', 'animation', 'transition', 'cubic-bezier', 'spring'],
    demos: [
      {
        title: 'Easing curves',
        center: false,
        html: '<div class="demo-motion" data-run="false">\n  <button class="btn btn-sm btn-outline demo-motion-play">' + I('play') + ' Play</button>\n  ' + rows + '\n</div>',
        css: `.demo-motion { display: grid; gap: .9rem; }
.demo-motion-play { justify-self: start; }
.demo-motion-row { display: grid; grid-template-columns: 15rem minmax(0, 1fr); gap: 1.25rem; align-items: center; }
.demo-motion-meta { display: flex; flex-direction: column; gap: .1rem; }
.demo-motion-meta code { font-size: .78rem; justify-self: start; width: fit-content; }
.demo-motion-meta span { font-size: .75rem; color: var(--muted-fg); }
.demo-motion-track { position: relative; height: 2.25rem; border-radius: var(--radius-full); background: var(--muted); }
.demo-motion-track i { position: absolute; left: .25rem; top: .25rem; width: 1.75rem; height: 1.75rem; border-radius: 50%; background: var(--primary); box-shadow: 0 4px 12px -2px color-mix(in oklab, var(--primary) 60%, transparent); transition: left 1s var(--e, var(--ease)); }
.demo-motion[data-run="true"] .demo-motion-track i { left: calc(100% - 2rem); }
@media (max-width: 640px) { .demo-motion-row { grid-template-columns: 1fr; gap: .4rem; } }`,
        js: "var m = root.querySelector('.demo-motion');\nvar go = function () { m.dataset.run = m.dataset.run === 'true' ? 'false' : 'true'; };\nroot.querySelector('.demo-motion-play').addEventListener('click', go);\nvar t = setTimeout(go, 400), iv = setInterval(go, 2200);\nreturn function () { clearTimeout(t); clearInterval(iv); };"
      },
      {
        title: 'Durations',
        center: false,
        html: '<div class="demo-motion demo-motion-d" data-run="false">\n  ' + durs + '\n</div>',
        css: `.demo-motion-dur { display: grid; grid-template-columns: minmax(0, 1fr) 8rem 3.5rem; gap: 1rem; align-items: center; font-size: .8rem; }
.demo-motion-dur span { color: var(--muted-fg); text-align: right; font-variant-numeric: tabular-nums; }
.demo-motion-d .demo-motion-track i { transition: left var(--d) var(--ease-out); }`,
        js: "var m = root.querySelector('.demo-motion-d');\nvar iv = setInterval(function () { m.dataset.run = m.dataset.run === 'true' ? 'false' : 'true'; }, 1100);\nreturn function () { clearInterval(iv); };"
      },
      {
        title: 'In practice',
        description: 'Hover the cards: lift uses <code>--ease-out</code>, the icon pops with <code>--ease-spring</code>.',
        html: `<div class="feature feature-card" style="width:15rem"><span class="icon-box">${I('zap')}</span><div class="feature-title">Instant previews</div><p class="feature-text">Every push gets a URL in under 10 seconds.</p></div>
<div class="feature feature-card" style="width:15rem"><span class="icon-box icon-box-success">${I('shield')}</span><div class="feature-title">Secure by default</div><p class="feature-text">SSO, audit logs and SOC 2 on every plan.</p></div>`
      }
    ],
    api: [
      { name: '--ease', type: 'var', default: 'cubic-bezier(.2, 0, 0, 1)', desc: 'Default UI curve.' },
      { name: '--ease-out', type: 'var', default: 'cubic-bezier(.16, 1, .3, 1)', desc: 'Entering elements.' },
      { name: '--ease-in-out', type: 'var', default: 'cubic-bezier(.65, 0, .35, 1)', desc: 'State to state.' },
      { name: '--ease-spring', type: 'var', default: 'cubic-bezier(.34, 1.56, .64, 1)', desc: 'Overshoot.' },
      { name: '--ease-bounce', type: 'var', default: 'cubic-bezier(.68, -.6, .32, 1.6)', desc: 'Anticipation and overshoot.' },
      { name: '--dur-fast', type: 'var', desc: '120 / 200 / 350 / 600 ms. Also: <code>--dur</code> <code>--dur-slow</code> <code>--dur-slower</code>' },
      { name: '--transition', type: 'var', desc: 'Shorthand: <code>var(--dur) var(--ease)</code>.' },
      { name: 'prefers-reduced-motion', type: 'attr', desc: 'All CSS animation collapses to one frame when the user asks for less motion.' }
    ]
  });
})();

;
/* docs/registry/foundations-radius.js */
(function () {
  var tiles = ['xs', 'sm', '', 'lg', 'xl', '2xl', 'full'].map(function (s) {
    var t = s ? '--radius-' + s : '--radius';
    return '<div class="demo-radius-tile"><div style="border-radius:var(' + t + ')"></div><b>' + (s || 'base') + '</b><code>' + t + '</code></div>';
  }).join('\n  ');
  RanjDocs.add({
    id: 'radius',
    name: 'Radius',
    group: 'Foundations',
    description: 'One <code>--radius</code> value drives the whole corner scale, so a single change makes the library sharper or softer.',
    tags: ['new'],
    keywords: ['border-radius', 'corners', 'rounded', 'shape'],
    demos: [
      {
        title: 'Radius scale',
        center: false,
        html: '<div class="demo-radius-grid">\n  ' + tiles + '\n</div>',
        css: `.demo-radius-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1.25rem; }
.demo-radius-tile { display: flex; flex-direction: column; gap: .2rem; }
.demo-radius-tile div { height: 5rem; margin-bottom: .5rem; background: var(--primary-soft); border: 2px solid color-mix(in oklab, var(--primary) 55%, transparent); }
.demo-radius-tile b { font-size: .85rem; } .demo-radius-tile code { font-size: .7rem; background: none; padding: 0; color: var(--muted-fg); }`
      },
      {
        title: 'Radius presets',
        center: false,
        description: 'Set <code>data-radius</code> on <code>&lt;html&gt;</code> (or override <code>--radius</code> on any section) to reshape every component.',
        html: `<div class="demo-radius-presets">
  <div class="btn-group btn-group-pill" data-toggle="single" aria-label="Radius">
    <button class="btn btn-sm" data-value="0rem">None</button><button class="btn btn-sm" data-value=".35rem">Small</button><button class="btn btn-sm" data-value=".625rem" aria-pressed="true">Medium</button><button class="btn btn-sm" data-value=".9rem">Large</button><button class="btn btn-sm" data-value="1.25rem">Full</button>
  </div>
  <div class="demo-radius-preview">
    <div class="card card-sm" style="width:min(100%,20rem)">
      <div class="card-header"><div class="card-title">Invite teammates</div><div class="card-description">They will get an email with a magic link.</div></div>
      <div class="card-content cluster"><span class="chip">design@acme.co</span><span class="badge badge-soft">Editor</span></div>
      <div class="card-footer"><button class="btn btn-outline btn-sm">Cancel</button><button class="btn btn-sm">Send invites</button></div>
    </div>
  </div>
</div>`,
        css: `.demo-radius-presets { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; width: 100%; }
.demo-radius-preview { --radius-xs: calc(var(--radius) * .4); --radius-sm: calc(var(--radius) * .7); --radius-lg: calc(var(--radius) * 1.3); --radius-xl: calc(var(--radius) * 1.8); display: flex; justify-content: center; width: 100%; }`,
        js: "var p = root.querySelector('.demo-radius-preview');\nroot.querySelector('.btn-group').addEventListener('ranj:change', function (e) { p.style.setProperty('--radius', e.detail.value[0]); });",
        height: 320
      }
    ],
    api: [
      { name: '--radius', type: 'var', default: '0.625rem', desc: 'Base radius. Everything else is derived from it.' },
      { name: '--radius-xs', type: 'var', desc: '0.4×, 0.7×, 1.3×, 1.8×, 2.6× the base. Also: <code>--radius-sm</code> <code>--radius-lg</code> <code>--radius-xl</code> <code>--radius-2xl</code>' },
      { name: '--radius-full', type: 'var', default: '9999px', desc: 'Pills and circles.' },
      { name: 'data-radius', type: 'attr', desc: 'none · sm · md · lg · full on <code>&lt;html&gt;</code>.' },
      { name: '.rounded-* ', type: 'class', desc: 'Utility classes: none, xs, sm, (base), lg, xl, 2xl, full.' }
    ]
  });
})();

;
/* docs/registry/foundations-shadows.js */
(function () {
  var I = RB.ic;
  var tiles = ['xs', 'sm', '', 'md', 'lg', 'xl', 'glow'].map(function (s) {
    var t = s ? '--shadow-' + s : '--shadow';
    return '<div class="demo-shadows-tile" style="box-shadow:var(' + t + ')"><b>' + (s || 'default') + '</b><code>' + t + '</code></div>';
  }).join('\n  ');
  RanjDocs.add({
    id: 'shadows',
    name: 'Shadows & elevation',
    group: 'Foundations',
    description: 'Seven layered shadows tuned separately for light and dark themes, plus a brand glow. Higher layers sit closer to the viewer.',
    tags: ['new'],
    keywords: ['elevation', 'box-shadow', 'depth', 'glow', 'z-index'],
    demos: [
      {
        title: 'Shadow scale',
        center: false,
        bg: 'none',
        html: '<div class="demo-shadows-grid">\n  ' + tiles + '\n</div>',
        css: `.demo-shadows-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.5rem; padding: .5rem; }
.demo-shadows-tile { display: flex; flex-direction: column; justify-content: flex-end; gap: .2rem; height: 7.5rem; padding: .9rem; border-radius: var(--radius-lg); background: var(--card); border: 1px solid color-mix(in oklab, var(--border) 50%, transparent); }
.demo-shadows-tile b { font-size: .9rem; } .demo-shadows-tile code { font-size: .7rem; background: none; padding: 0; color: var(--muted-fg); }`
      },
      {
        title: 'Elevation in context',
        center: false,
        description: 'Page (0) → card (xs) → raised card (md) → popover (lg) → modal (xl). Pair each level with its <code>--z-*</code> layer.',
        height: 340,
        html: `<div class="demo-shadows-stage">
  <div class="card" style="width:min(100%,22rem)">
    <div class="card-header"><div class="card-title">Team activity</div><div class="card-description">Last 24 hours</div></div>
    <div class="card-content stack gap-3">
      <div class="avatar-label"><span class="avatar avatar-sm avatar-tint" style="--avatar-hue:20">MR</span><div><b>Maya Rossi merged #482</b><span>Fix billing rounding</span></div></div>
      <div class="avatar-label"><span class="avatar avatar-sm avatar-tint" style="--avatar-hue:160">JK</span><div><b>Jun Kim deployed to prod</b><span>v2.14.0 · 3m ago</span></div></div>
    </div>
  </div>
  <div class="demo-shadows-pop">
    <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;width:100%">${I('edit')} Edit</button>
    <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;width:100%">${I('copy')} Duplicate</button>
    <hr class="separator separator-flush" style="margin:.25rem 0">
    <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;width:100%;color:var(--destructive)">${I('trash')} Delete</button>
  </div>
</div>`,
        css: `.demo-shadows-stage { position: relative; display: flex; justify-content: center; width: 100%; padding-right: 4rem; }
.demo-shadows-pop { position: absolute; right: max(0px, calc(50% - 15rem)); top: 55%; width: 11rem; padding: .3rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--popover); box-shadow: var(--shadow-lg); }
@media (max-width: 600px) { .demo-shadows-stage { padding-right: 0; } .demo-shadows-pop { right: 0; top: 70%; } }`
      }
    ],
    api: [
      { name: '--shadow-xs … --shadow-xl', type: 'var', desc: 'Elevation scale (redefined in dark mode with deeper, darker shadows).' },
      { name: '--shadow-glow', type: 'var', desc: 'Brand-colored ring + glow, follows <code>--hue</code>.' },
      { name: '.shadow-xs … .shadow-xl', type: 'class', desc: 'Utility classes. Also: <code>.shadow-glow</code>' },
      { name: '--z-dropdown … --z-tooltip', type: 'var', desc: 'Layer order: dropdown 50, sticky 60, overlay 80, modal 90, popover 100, toast 110, tooltip 120.' }
    ]
  });
})();

;
/* docs/registry/foundations-typography.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'typography',
    name: 'Typography',
    group: 'Foundations',
    description: 'Fluid headings, display sizes, lead and helper text, inline code, gradient text and a <code>.prose</code> class that styles long-form content with no extra markup.',
    tags: ['new'],
    keywords: ['type', 'heading', 'font', 'prose', 'text', 'h1', 'lead', 'gradient text', 'article'],
    demos: [
      {
        title: 'Type scale',
        center: false,
        html: `<div class="demo-typography-scale">
  <div><span>display-1</span><p class="display-1">Ship faster</p></div>
  <div><span>h1</span><h1>Build interfaces people love</h1></div>
  <div><span>h2</span><h2>Designed for the plain web</h2></div>
  <div><span>h3</span><h3>Zero dependencies, zero build step</h3></div>
  <div><span>h4</span><h4>One CSS file and one script</h4></div>
  <div><span>h5</span><h5>Works with any framework</h5></div>
  <div><span>h6</span><h6>Accessible by default</h6></div>
  <div><span>lead</span><p class="lead">Ranj UI gives you 150+ polished components and effects that look great in light and dark mode.</p></div>
  <div><span>body</span><p>Every component reads design tokens, so changing one hue re-themes your whole product, including focus rings and soft fills.</p></div>
  <div><span>large</span><p class="large">Are you sure you want to continue?</p></div>
  <div><span>small</span><p class="small">Last edited 3 minutes ago</p></div>
  <div><span>muted</span><p class="muted small">Enter your email address to receive updates.</p></div>
</div>`,
        css: `.demo-typography-scale { display: grid; }
.demo-typography-scale > div { display: grid; grid-template-columns: 6rem minmax(0, 1fr); gap: 1rem; align-items: baseline; padding: .9rem 0; border-bottom: 1px dashed var(--border); }
.demo-typography-scale > div:last-child { border-bottom: 0; }
.demo-typography-scale span { font-family: var(--font-mono); font-size: .72rem; color: var(--muted-fg); }
@media (max-width: 600px) { .demo-typography-scale > div { grid-template-columns: 1fr; gap: .25rem; } }`
      },
      {
        title: 'Hero headline',
        description: 'Eyebrow, balanced display heading with <code>.gradient-text</code>, and a lead paragraph.',
        html: `<div class="stack center-text" style="max-width:42rem;align-items:center">
  <span class="eyebrow">Ranj UI 2.0</span>
  <h1 class="display-2">The interface kit with <span class="gradient-text gradient-text-animated">taste built in</span></h1>
  <p class="lead">Drop in one stylesheet and get buttons, dialogs, charts and motion that feel like they came from a design team of twenty.</p>
  <div class="cluster" style="justify-content:center">
    <a class="btn btn-lg" href="#">Get started ${I('arrowRight')}</a>
    <a class="btn btn-lg btn-outline" href="#">${I('github')} Star on GitHub</a>
  </div>
</div>`,
        height: 380
      },
      {
        title: 'Prose',
        description: 'Wrap rendered Markdown or CMS HTML in <code>.prose</code>. Sizes: <code>.prose-sm</code>, <code>.prose-lg</code>.',
        center: false,
        html: `<article class="prose" style="margin:0 auto">
  <h2>Shipping our new billing system</h2>
  <p>Last quarter we moved <strong>40,000 customers</strong> from a legacy invoicing tool to usage-based pricing without a single failed charge. Here is what we learned, and the <a href="#">migration checklist</a> we wish we had on day one.</p>
  <h3>What we changed</h3>
  <ul>
    <li>Metering moved to an append-only event log, deduplicated by <code>idempotency_key</code>.</li>
    <li>Invoices are drafted 72 hours before they finalize, so support can fix mistakes.</li>
    <li>Every price change ships behind a flag and a dry-run report.</li>
  </ul>
  <blockquote>The safest migration is the one your customers never notice.</blockquote>
  <h3>The dry-run script</h3>
  <pre><code>npx billing migrate --dry-run --since 2026-01-01</code></pre>
  <table>
    <thead><tr><th>Plan</th><th>Customers</th><th>Avg. change</th></tr></thead>
    <tbody><tr><td>Starter</td><td>31,204</td><td>−4.2%</td></tr><tr><td>Growth</td><td>7,880</td><td>+1.1%</td></tr><tr><td>Enterprise</td><td>916</td><td>0.0%</td></tr></tbody>
  </table>
  <hr>
  <p>Press <kbd>⌘</kbd> <kbd>K</kbd> anywhere in the dashboard to open the new billing command menu.</p>
</article>`
      },
      {
        title: 'Inline elements',
        center: false,
        html: `<div class="stack" style="max-width:40rem;margin:0 auto">
  <p>Run <code>npm run build</code> to write the bundles to <code>dist/</code>.</p>
  <p>Press <kbd class="kbd">⌘</kbd> <kbd class="kbd">Shift</kbd> <kbd class="kbd">P</kbd> to open the command palette.</p>
  <p>Results for <mark>quarterly revenue</mark> across 3 workspaces.</p>
  <p>The <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.2 contrast ratio is 4.5:1 for body text, H<sub>2</sub>O, x<sup>2</sup>.</p>
  <p class="muted">Muted helper text <a href="#">with a link</a> inside it.</p>
</div>`
      },
      {
        title: 'Font families',
        center: false,
        html: `<div class="grid grid-auto" style="--min:200px">
  <div class="card card-sm"><div class="card-content"><p class="tiny muted">--font-sans</p><p class="font-sans text-2xl font-semibold">Inter</p><p class="small muted">Body and UI</p></div></div>
  <div class="card card-sm"><div class="card-content"><p class="tiny muted">--font-display</p><p class="font-display text-2xl font-bold tracking-tight">Inter Tight</p><p class="small muted">Headings</p></div></div>
  <div class="card card-sm"><div class="card-content"><p class="tiny muted">--font-mono</p><p class="font-mono text-2xl">JetBrains</p><p class="small muted">Code and numbers</p></div></div>
</div>`
      }
    ],
    api: [
      { name: 'h1–h6 / .h1–.h6', type: 'class', desc: 'Fluid heading sizes with balanced wrapping. Use the classes to style any element as a heading.' },
      { name: '.display-1 / .display-2', type: 'class', desc: 'Oversized hero headings.' },
      { name: '.eyebrow', type: 'class', desc: 'Small uppercase label above a heading.' },
      { name: '.lead', type: 'class', desc: 'Intro paragraph, emphasized, helper and muted text. Also: <code>.large</code> <code>.small</code> <code>.tiny</code> <code>.muted</code>' },
      { name: '.gradient-text', type: 'class', desc: 'Brand gradient fill; set <code>--gradient</code> to customize. Add <code>.gradient-text-animated</code> to pan it.' },
      { name: '.prose / .prose-sm / .prose-lg', type: 'class', desc: 'Styles headings, lists, quotes, code, tables, images and hr inside rich content.' },
      { name: '.text-balance', type: 'class', desc: 'Wrapping and numeric helpers. Also: <code>.text-pretty</code> <code>.tabular-nums</code>' },
      { name: '--font-sans', type: 'var', desc: 'Font stacks. Also: <code>--font-display</code> <code>--font-mono</code>' },
      { name: '--text-xs … --text-7xl', type: 'var', desc: 'Font size scale.' }
    ]
  });
})();

;
/* docs/registry/fx-add-to-cart.js */
RanjDocs.add({
  id: 'add-to-cart',
  name: 'Add to Cart',
  group: 'Micro-interactions',
  description: 'A cart rolls in, catches a falling box, wobbles and drives off. The header cart badge bumps with the new count.',
  tags: ['new', 'fx', 'js'],
  keywords: ['cart', 'shopping', 'ecommerce', 'add to bag', 'badge'],
  demos: [
    { title: 'Product card', height: 420, html: `
<div class="demo-cart-shop">
  <header><b>Fieldnotes</b><span class="demo-cart-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M2.5 3.5h2.6l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.1l1.7-6.8H6"/></svg><span class="demo-cart-badge" id="add-to-cart-badge">2</span></span></header>
  <div class="demo-cart-img"></div>
  <div class="demo-cart-body">
    <div><b>Linen Weekender Bag</b><small>Natural · 32L</small></div><b style="font-size:1.1rem">$148</b>
  </div>
  <button class="fxb cart-btn" data-cart-target="#add-to-cart-badge" style="width:calc(100% - 2rem);margin:0 1rem 1rem">
    <span class="fxb-icon"><svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M2.5 3.5h2.6l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.1l1.7-6.8H6"/></svg><svg class="fxb-check" viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
    <span class="fxb-texts"><span data-for="idle">Add to cart</span><span data-for="done">Added to cart</span></span>
    <svg class="cart-btn-cart" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M2.5 3.5h2.6l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.1l1.7-6.8H6"/></svg><span class="cart-btn-box"></span>
  </button>
</div>`, css: `
.demo-cart-shop { width: min(300px, 100%); border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); overflow: hidden; }
.demo-cart-shop header { display: flex; justify-content: space-between; align-items: center; padding: .7rem 1rem; border-bottom: 1px solid var(--border); }
.demo-cart-icon { position: relative; width: 22px; height: 22px; } .demo-cart-icon svg { width: 22px; height: 22px; }
.demo-cart-badge { position: absolute; top: -7px; right: -9px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: var(--primary); color: var(--primary-fg); font-size: .65rem; font-weight: 700; line-height: 18px; text-align: center; display: inline-block; }
.demo-cart-img { height: 140px; background: radial-gradient(30% 40% at 50% 55%, #d6c3a3, transparent 70%), linear-gradient(160deg, #f5efe6, #e7dccb); }
[data-theme="dark"] .demo-cart-img { background: radial-gradient(30% 40% at 50% 55%, #8a7658, transparent 70%), linear-gradient(160deg, #2a251f, #1c1915); }
.demo-cart-body { display: flex; gap: .75rem; justify-content: space-between; align-items: flex-start; padding: .9rem 1rem; }
.demo-cart-body small { display: block; color: var(--muted-fg); font-size: .8rem; }` }
  ],
  api: [
    { name: '.fxb.cart-btn', type: 'class', desc: 'Contains <code>.fxb-icon</code>, <code>.fxb-texts</code>, the animated <code>.cart-btn-cart</code> SVG and <code>.cart-btn-box</code>.' },
    { name: 'data-cart-target', type: 'attr', desc: 'Selector of a badge; its number increments and it gets <code>.cart-badge-bump</code>.' },
    { name: 'data-duration / data-manual / data-reset', type: 'attr', desc: 'See Send Button.' },
    { name: '.cart-badge-bump', type: 'class', desc: 'Bump animation you can use on any badge.' }
  ]
});

;
/* docs/registry/fx-animated-arrow.js */
RanjDocs.add({
  id: 'animated-arrow',
  name: 'Animated Arrows',
  group: 'Micro-interactions',
  description: 'Link and button arrows that nudge, grow a shaft, or fly out while a fresh arrow slides in. CSS only.',
  tags: ['new', 'fx'],
  keywords: ['arrow', 'link arrow', 'hover arrow', 'cta', 'chevron nudge'],
  demos: [
    { title: 'Link arrows', description: 'Hover each link.', html: `
<a class="arrow-link" href="#">Read the case study <svg viewBox="0 0 16 16"><path class="al-line" d="M2 8h10"/><path class="al-head" d="M8 3.5 12.5 8 8 12.5"/></svg></a>
<a class="arrow-link arrow-link-underline" href="#">View pricing <svg viewBox="0 0 16 16"><path class="al-line" d="M2 8h10"/><path class="al-head" d="M8 3.5 12.5 8 8 12.5"/></svg></a>
<a class="arrow-link" href="#" style="color:var(--fg)">Open in new tab <span class="arrow-swap"><svg viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M5.5 4.5h6v6"/></svg><svg viewBox="0 0 16 16"><path d="M4.5 11.5l7-7M5.5 4.5h6v6"/></svg></span></a>` },
    { title: 'Buttons', html: `
<a class="arrow-pill" href="#">Start building <span class="arrow-swap-wrap"><span class="arrow-swap arrow-swap-x" style="width:15px;height:15px"><svg viewBox="0 0 16 16"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg><svg viewBox="0 0 16 16"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg></span></span></a>
<button class="arrow-circle" aria-label="Next"><span class="arrow-swap arrow-swap-x"><svg viewBox="0 0 16 16"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg><svg viewBox="0 0 16 16"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg></span></button>
<button class="arrow-circle" aria-label="Open"><span class="arrow-swap"><svg viewBox="0 0 16 16"><path d="M4 12 12 4M5 4h7v7"/></svg><svg viewBox="0 0 16 16"><path d="M4 12 12 4M5 4h7v7"/></svg></span></button>` },
    { title: 'Feature card', height: 260, html: `
<a href="#" class="demo-arrow-card">
  <small>Guide</small>
  <b>Migrating from v1 to v2</b>
  <p>Every renamed class and attribute, with a codemod that does 90% of the work.</p>
  <span class="arrow-link">Start the guide <svg viewBox="0 0 16 16"><path class="al-line" d="M2 8h10"/><path class="al-head" d="M8 3.5 12.5 8 8 12.5"/></svg></span>
</a>`, css: `
.demo-arrow-card { display: grid; gap: .35rem; width: min(340px, 100%); padding: 1.2rem 1.3rem; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); color: var(--fg); transition: border-color .2s, box-shadow .2s, transform .2s; }
.demo-arrow-card:hover { text-decoration: none; border-color: var(--primary); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.demo-arrow-card small { color: var(--muted-fg); } .demo-arrow-card p { color: var(--muted-fg); font-size: .9rem; }
.demo-arrow-card:hover .al-line { opacity: 1; transform: scaleX(1); } .demo-arrow-card:hover .al-head { transform: translateX(1px); }` }
  ],
  api: [
    { name: '.arrow-link', type: 'class', desc: 'Link with an arrow whose shaft grows on hover (<code>.al-line</code> + <code>.al-head</code> paths).' },
    { name: '.arrow-link-underline', type: 'class', desc: 'Adds an underline that grows from the left.' },
    { name: '.arrow-swap / .arrow-swap-x', type: 'class', desc: 'Two stacked SVGs: the first flies out diagonally (or sideways) and the second slides in.' },
    { name: '.arrow-circle / .arrow-pill', type: 'class', desc: 'Ready-made circular and pill buttons.' }
  ]
});

;
/* docs/registry/fx-animated-checkbox.js */
RanjDocs.add({
  id: 'animated-checkbox',
  name: 'Animated Checkbox',
  group: 'Micro-interactions',
  description: 'A native checkbox with a bouncy box, a hand-drawn check stroke, a ripple ring and optional strike-through. CSS only.',
  tags: ['new', 'fx'],
  keywords: ['checkbox', 'todo', 'check', 'strike through', 'task list'],
  demos: [
    { title: 'Todo list', height: 300, html: `
<div style="width:min(360px,100%);padding:1.1rem 1.25rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);display:grid;gap:.85rem">
  <div style="display:flex;justify-content:space-between;align-items:baseline"><b>Today</b><small style="color:var(--muted-fg)">Tue, Nov 17</small></div>
  <label class="check-anim check-anim-strike"><input type="checkbox" checked><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="check-anim-text">Review Sam's pull request</span></label>
  <label class="check-anim check-anim-strike"><input type="checkbox"><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="check-anim-text">Book flights to Lisbon</span></label>
  <label class="check-anim check-anim-strike"><input type="checkbox"><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="check-anim-text">Pick up oat milk</span></label>
  <label class="check-anim check-anim-strike"><input type="checkbox"><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="check-anim-text">Call the dentist before 5pm</span></label>
</div>` },
    { title: 'Shapes and colors', html: `
<label class="check-anim"><input type="checkbox" checked><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>Square</label>
<label class="check-anim check-anim-circle" style="--on:var(--success)"><input type="checkbox" checked><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>Circle</label>
<label class="check-anim check-anim-lg" style="--on:#f43f5e"><input type="checkbox"><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>Large</label>
<label class="check-anim"><input type="checkbox" disabled><span class="check-anim-box"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>Disabled</label>` }
  ],
  api: [
    { name: '.check-anim', type: 'class', desc: 'A <code>&lt;label&gt;</code> wrapping a real checkbox, the box and the text. The path needs <code>pathLength="1"</code>.' },
    { name: '.check-anim-strike', type: 'class', desc: 'Strike through and dim the text when checked.' },
    { name: '.check-anim-circle / .check-anim-lg', type: 'class', desc: 'Round box, larger size.' },
    { name: '--on / --size', type: 'var', default: '--primary / 22px', desc: 'Checked color and box size.' }
  ]
});

;
/* docs/registry/fx-animated-status-icons.js */
RanjDocs.add({
  id: 'animated-status-icons',
  name: 'Animated Status Icons',
  group: 'Micro-interactions',
  description: 'Success, error, warning and info icons that draw themselves stroke by stroke when they scroll into view.',
  tags: ['new', 'fx', 'js'],
  keywords: ['success check', 'error', 'warning', 'info', 'checkmark animation', 'svg draw'],
  demos: [
    { title: 'All four', description: 'Press Replay in the toolbar to draw them again.', html: `
<span class="status-icon" data-type="success"></span>
<span class="status-icon" data-type="error"></span>
<span class="status-icon" data-type="warning"></span>
<span class="status-icon" data-type="info"></span>` },
    { title: 'Payment result', height: 320, html: `
<div style="width:min(340px,100%);display:grid;justify-items:center;gap:.6rem;text-align:center;padding:1.75rem 1.5rem;border:1px solid var(--border);border-radius:var(--radius-2xl);background:var(--card);box-shadow:var(--shadow-lg)">
  <span class="status-icon status-icon-lg" data-type="success"></span>
  <b style="font-size:1.15rem">Payment successful</b>
  <p style="color:var(--muted-fg);font-size:.9rem">$249.00 was charged to Visa ending 4242. A receipt is on its way.</p>
  <div style="display:flex;gap:.5rem;margin-top:.4rem"><button class="btn btn-sm" data-demo-si="success">Success</button><button class="btn btn-sm btn-outline" data-demo-si="error">Error</button></div>
</div>`, js: `
var icon = root.querySelector('.status-icon'), title = root.querySelector('b'), text = root.querySelector('p');
root.querySelectorAll('[data-demo-si]').forEach(function (b) { b.onclick = function () {
  var ok = b.getAttribute('data-demo-si') === 'success';
  Ranj.statusIcon(icon, ok ? 'success' : 'error');
  title.textContent = ok ? 'Payment successful' : 'Payment declined';
  text.textContent = ok ? '$249.00 was charged to Visa ending 4242. A receipt is on its way.' : 'Your bank declined the charge. Try another card or contact your bank.';
}; });` }
  ],
  api: [
    { name: '.status-icon', type: 'class', desc: 'Empty span; SVG injected and played on scroll into view.' },
    { name: 'data-type', type: 'attr', default: 'success', desc: '<code>success error warning info</code>.' },
    { name: '.status-icon-sm / .status-icon-lg', type: 'class', desc: 'Sizes (28 / 72px). Or set <code>--size</code>.' },
    { name: '--c / --dur', type: 'var', desc: 'Color and draw duration.' },
    { name: 'Ranj.statusIcon(el, [type])', type: 'js', desc: 'Replay, optionally switching type.' }
  ]
});

;
/* docs/registry/fx-back-next-buttons.js */
RanjDocs.add({
  id: 'back-next-buttons',
  name: 'Back / Next Buttons',
  group: 'Micro-interactions',
  description: 'Paired step buttons whose arrows slip out and back in while the pill stretches toward the direction of travel.',
  tags: ['new', 'fx'],
  keywords: ['back', 'next', 'previous', 'wizard', 'stepper', 'pagination'],
  demos: [
    { title: 'Default', html: `
<button class="step-btn step-btn-back"><span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></span> Back</button>
<button class="step-btn step-btn-next">Next <span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button>
<button class="step-btn step-btn-back step-btn-icon" aria-label="Previous"><span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></span></button>
<button class="step-btn step-btn-next step-btn-icon" aria-label="Next"><span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button>` },
    { title: 'Onboarding wizard', height: 320, html: `
<div class="demo-step-card">
  <div class="demo-step-dots"><i></i><i></i><i></i><i></i></div>
  <b class="demo-step-title"></b>
  <p class="demo-step-text"></p>
  <div class="demo-step-actions"><button class="step-btn step-btn-back" data-step="-1"><span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></span> Back</button><button class="step-btn step-btn-next" data-step="1"><span class="demo-step-next">Next</span> <span class="arrow-slot"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button></div>
</div>`, css: `
.demo-step-card { width: min(400px, 100%); padding: 1.4rem; border: 1px solid var(--border); border-radius: var(--radius-2xl); background: var(--card); display: grid; gap: .6rem; }
.demo-step-dots { display: flex; gap: .35rem; } .demo-step-dots i { height: 6px; width: 6px; border-radius: 3px; background: var(--border-strong); transition: width .4s var(--ease-spring), background .3s; }
.demo-step-dots i.on { width: 22px; background: var(--primary); }
.demo-step-title { font-size: 1.1rem; } .demo-step-text { color: var(--muted-fg); font-size: .9rem; min-height: 3em; }
.demo-step-actions { display: flex; justify-content: space-between; margin-top: .4rem; }`, js: `
var steps = [['Welcome to Orbit', 'Let us set up your workspace in under a minute.'], ['Invite your team', 'Add teammates by email or share an invite link.'], ['Connect your tools', 'Slack, GitHub and Linear sync in one click.'], ['You are all set', 'Your workspace is ready. Time to ship something great.']];
var i = 0, dots = root.querySelectorAll('.demo-step-dots i');
function render() { root.querySelector('.demo-step-title').textContent = steps[i][0]; root.querySelector('.demo-step-text').textContent = steps[i][1];
  dots.forEach(function (d, k) { d.classList.toggle('on', k === i); }); root.querySelector('[data-step="-1"]').disabled = i === 0;
  root.querySelector('.demo-step-next').textContent = i === steps.length - 1 ? 'Finish' : 'Next'; }
root.querySelectorAll('[data-step]').forEach(function (b) { b.onclick = function () { i = Math.max(0, Math.min(steps.length - 1, i + +b.getAttribute('data-step'))); render(); }; });
render();` }
  ],
  api: [
    { name: '.step-btn-next / .step-btn-back', type: 'class', desc: 'Filled forward and outlined back buttons.' },
    { name: '.arrow-slot', type: 'class', desc: 'Two stacked arrow SVGs; the first slides out and the second slides in on hover.' },
    { name: '.step-btn-icon', type: 'class', desc: 'Square icon-only version.' }
  ]
});

;
/* docs/registry/fx-bg-aurora.js */
RanjDocs.add({
  id: 'bg-aurora',
  name: 'Aurora',
  group: 'Backgrounds',
  description: 'Soft, blurred color blobs that drift and breathe. Pure CSS, follows your accent hue, and works in light and dark.',
  tags: ['new', 'fx'],
  keywords: ['gradient', 'blob', 'northern lights', 'hero background', 'blur'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-aurora"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>New</b> Ranj UI 2.0 is live</span>
    <h2>Ship interfaces that feel alive</h2>
    <p>Two files, zero dependencies. Drop in the stylesheet and script, and every component just works.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Get started</a><a class="btn btn-outline" href="#">Browse components</a></div>
  </div>
</div>` },
    { title: 'Ribbon curtains', description: 'Add <code>.bg-aurora-ribbon</code> for northern-lights curtains falling from the top.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-aurora bg-aurora-ribbon"></div>
  <div class="bg-hero">
    <h2>Analytics that light up your night</h2>
    <p>Real-time dashboards for teams who ship every day.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Start free trial</a></div>
  </div>
</div>` },
    { title: 'Custom colors + grain', description: 'Override <code>--c1</code> to <code>--c4</code>, and stack <code>.bg-noise</code> on top for a printed feel.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-aurora" style="--c1:#fb923c;--c2:#f472b6;--c3:#facc15;--c4:#c084fc;--speed:10s"></div>
  <div class="bg-noise"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Summer</b> Festival lineup announced</span>
    <h2>Sunset Sessions 2026</h2>
    <p>Three days of music on the bay. August 14 to 16, San Francisco.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Get tickets</a></div>
  </div>
</div>` }
  ],
  api: [
    { name: '.bg-aurora', type: 'class', desc: 'Fills its nearest positioned parent. Use <code>.bg-host</code> on the parent for overflow + stacking.' },
    { name: '.bg-aurora-ribbon', type: 'class', desc: 'Curtain variant.' },
    { name: '--c1 … --c4', type: 'var', default: 'hue based', desc: 'Blob colors. Default to your accent hue with offsets.' },
    { name: '--speed', type: 'var', default: '16s', desc: 'Drift cycle length.' },
    { name: '--blur', type: 'var', default: '64px', desc: 'Blur radius.' },
    { name: '--opacity', type: 'var', default: '.5', desc: 'Overall strength.' },
    { name: '.bg-host / .bg-hero / .bg-content', type: 'class', desc: 'Helpers shared by all backgrounds: host clips and isolates, content sits above.' }
  ]
});

;
/* docs/registry/fx-bg-beams.js */
RanjDocs.add({
  id: 'bg-beams',
  name: 'Light Beams',
  group: 'Backgrounds',
  description: 'Glowing streaks fall along faint vertical rails while two soft light cones sweep behind them.',
  tags: ['new', 'fx', 'js'],
  keywords: ['beams', 'rails', 'streaks', 'falling lines', 'spotlight'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-beams"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Launch</b> Realtime sync is here</span>
    <h2>Data that moves at light speed</h2>
    <p>Sub-50ms sync between every client, server and edge cache.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Get the SDK</a><a class="btn btn-outline" href="#">Benchmarks</a></div>
  </div>
</div>` },
    { title: 'More beams, custom color', center: false, pad: false, height: 320, html: `
<div class="bg-host" style="height:320px">
  <div class="bg-beams" data-count="14" style="--gap:48px;--beam:#22d3ee"></div>
  <div class="bg-hero"><h2>Pipeline status: green</h2><p>1,284 jobs ran in the last hour.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-beams', type: 'class', desc: 'Rails and sweeping cones are CSS; falling beams need ranj.js.' },
    { name: 'data-count', type: 'attr', default: '7', desc: 'Number of falling beams.' },
    { name: '--gap', type: 'var', default: '72px', desc: 'Rail spacing.' },
    { name: '--beam', type: 'var', default: '--primary', desc: 'Beam color.' }
  ]
});

;
/* docs/registry/fx-bg-dots.js */
RanjDocs.add({
  id: 'bg-dots',
  name: 'Dot Pattern',
  group: 'Backgrounds',
  description: 'A soft dot matrix that fades at the edges. Move the cursor over it and a spotlight of accent dots follows.',
  tags: ['new', 'fx', 'js'],
  keywords: ['dots', 'pattern', 'spotlight', 'hover', 'matrix'],
  demos: [
    { title: 'Hover spotlight', description: 'Move your pointer over the hero.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-dot-pattern"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>AI</b> Now with natural language search</span>
    <h2>Find anything in your docs</h2>
    <p>Ask a question, get the exact paragraph. Works across Notion, Drive and GitHub.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Try it free</a></div>
  </div>
</div>` },
    { title: 'Dense, larger spotlight', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-dot-pattern" style="--gap:14px;--dot:1px;--spot-size:260px;--spot:oklch(.7 .2 calc(var(--hue) + 60))"></div>
  <div class="bg-hero"><h2>Hover me</h2><p>Spotlight size, dot gap and colors are all CSS variables.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-dot-pattern', type: 'class', desc: 'Dot matrix layer. Spotlight needs ranj.js.' },
    { name: 'data-no-spotlight', type: 'attr', desc: 'Disable the cursor spotlight.' },
    { name: '--gap', type: 'var', default: '22px', desc: 'Distance between dots.' },
    { name: '--dot', type: 'var', default: '1.3px', desc: 'Dot radius.' },
    { name: '--dot-color / --spot', type: 'var', desc: 'Base and spotlight colors.' },
    { name: '--spot-size', type: 'var', default: '180px', desc: 'Spotlight radius.' }
  ]
});

;
/* docs/registry/fx-bg-flicker-grid.js */
RanjDocs.add({
  id: 'bg-flicker-grid',
  name: 'Flickering Grid',
  group: 'Backgrounds',
  description: 'Thousands of tiny squares twinkling at random, like a data center seen from far away.',
  tags: ['new', 'fx', 'js'],
  keywords: ['flicker', 'pixels', 'matrix', 'led', 'canvas'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-flicker-grid bg-fade"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>GPU</b> H200 clusters available</span>
    <h2>Compute for the next frontier</h2>
    <p>Spin up 8 to 4,096 GPUs in minutes, billed by the second.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Reserve capacity</a></div>
  </div>
</div>` },
    { title: 'Bigger pixels, faster', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-flicker-grid bg-fade-b" data-square="8" data-gap="4" data-rate="1.2" data-max="0.45" data-color="#f59e0b"></div>
  <div class="bg-hero"><h2>Retro LED wall</h2></div>
</div>` }
  ],
  api: [
    { name: '.bg-flicker-grid', type: 'class', desc: 'Canvas flickering grid.' },
    { name: 'data-square', type: 'attr', default: '4', desc: 'Square size (px).' },
    { name: 'data-gap', type: 'attr', default: '6', desc: 'Gap between squares (px).' },
    { name: 'data-rate', type: 'attr', default: '0.35', desc: 'Flicker chance per square per second.' },
    { name: 'data-max', type: 'attr', default: '0.32', desc: 'Max opacity.' },
    { name: 'data-color', type: 'attr', default: '--primary', desc: 'Square color.' }
  ]
});

;
/* docs/registry/fx-bg-gradient-orbs.js */
RanjDocs.add({
  id: 'bg-gradient-orbs',
  name: 'Gradient Orbs',
  group: 'Backgrounds',
  description: 'Large blurred orbs that wander on their own and softly chase the cursor, each with its own lag.',
  tags: ['new', 'fx', 'js'],
  keywords: ['orbs', 'blobs', 'cursor follow', 'glow', 'interactive gradient'],
  demos: [
    { title: 'Cursor follow', description: 'Move your pointer over the hero.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-gradient-orbs"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Design</b> Figma plugin available</span>
    <h2>Color systems that adapt</h2>
    <p>Generate accessible palettes from a single brand color.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Generate palette</a></div>
  </div>
</div>` },
    { title: 'Custom colors, idle only', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-gradient-orbs" data-follow="false" data-count="3" data-colors="#22d3ee,#a78bfa,#f472b6"></div>
  <div class="bg-hero"><h2>Ambient mode</h2><p>Orbs drift on their own when <code>data-follow="false"</code>.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-gradient-orbs', type: 'class', desc: 'Orb container.' },
    { name: 'data-count', type: 'attr', default: '4', desc: 'Number of orbs.' },
    { name: 'data-follow', type: 'attr', default: 'true', desc: 'Chase the cursor.' },
    { name: 'data-colors', type: 'attr', desc: 'Comma-separated colors (default <code>--c1 … --c4</code>).' },
    { name: '--blur / --opacity', type: 'var', default: '70px / .6', desc: 'Softness and strength.' }
  ]
});

;
/* docs/registry/fx-bg-grid.js */
RanjDocs.add({
  id: 'bg-grid',
  name: 'Grid',
  group: 'Backgrounds',
  description: 'A fine line grid with a radial fade. Add a scanning light, or let random cells glow on and off.',
  tags: ['new', 'fx', 'js'],
  keywords: ['grid', 'lines', 'graph paper', 'blueprint', 'scan'],
  demos: [
    { title: 'Glowing cells', description: '<code>data-cells="10"</code> lights random cells (needs ranj.js). Without it the grid is pure CSS.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-line-grid" data-cells="10"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>v4</b> Edge functions in 30 regions</span>
    <h2>Deploy at the speed of thought</h2>
    <p>Push to main and your app is live worldwide in under ten seconds.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Deploy now</a><a class="btn btn-outline" href="#">Talk to sales</a></div>
  </div>
</div>` },
    { title: 'Scan line', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-line-grid bg-line-grid-scan" style="--cell:28px"></div>
  <div class="bg-hero">
    <h2>Security scanning, continuously</h2>
    <p>Every commit checked for leaked secrets and vulnerable packages.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Scan my repo</a></div>
  </div>
</div>` }
  ],
  api: [
    { name: '.bg-line-grid', type: 'class', desc: 'Line grid with radial mask.' },
    { name: '.bg-line-grid-scan', type: 'class', desc: 'Adds a light band sweeping down.' },
    { name: 'data-cells', type: 'attr', default: '—', desc: 'Number of randomly glowing cells (JS).' },
    { name: '--cell', type: 'var', default: '40px', desc: 'Cell size.' },
    { name: '--line', type: 'var', default: 'fg 10%', desc: 'Line color.' },
    { name: '--glow', type: 'var', default: '--primary', desc: 'Scan and cell color.' }
  ]
});

;
/* docs/registry/fx-bg-light-rays.js */
RanjDocs.add({
  id: 'bg-light-rays',
  name: 'Light Rays',
  group: 'Backgrounds',
  description: 'God rays pour down from the top and sway slowly, like light through a cathedral window.',
  tags: ['new', 'fx'],
  keywords: ['god rays', 'sun rays', 'spotlight', 'volumetric light'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-light-rays"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Studio</b> Now with 8K exports</span>
    <h2>Every frame, perfectly lit</h2>
    <p>Pro color grading in your browser. No installs, no render farm.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Open the studio</a><a class="btn btn-outline" href="#">Watch reel</a></div>
  </div>
</div>` },
    { title: 'Warm rays on dark', center: false, pad: false, height: 320, html: `
<div class="bg-host" style="height:320px;background:#0c0a09">
  <div class="bg-light-rays" style="--ray:#fcd34d;--opacity:.6"></div>
  <div class="bg-hero bg-hero-dark"><h2>Golden hour, all day</h2><p>Smart bulbs that follow the sun.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-light-rays', type: 'class', desc: 'Two layers of conic rays with soft sway.' },
    { name: '--ray', type: 'var', default: 'primary + white', desc: 'Ray color.' },
    { name: '--opacity', type: 'var', default: '.55', desc: 'Ray strength.' },
    { name: '--speed', type: 'var', default: '14s', desc: 'Sway cycle.' }
  ]
});

;
/* docs/registry/fx-bg-liquid.js */
RanjDocs.add({
  id: 'bg-liquid',
  name: 'Liquid Swirl',
  group: 'Backgrounds',
  description: 'Psychedelic swirling paint that twists around the center. Turn on pixel mode for a retro card-game look.',
  tags: ['new', 'fx', 'js'],
  keywords: ['swirl', 'liquid', 'paint', 'psychedelic', 'balatro', 'marble', 'canvas'],
  demos: [
    { title: 'Smooth', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-liquid"></div>
  <div class="bg-hero bg-hero-dark">
    <span class="bg-hero-badge"><b>Fest</b> Doors open at 8pm</span>
    <h2 style="text-shadow:0 2px 24px rgb(0 0 0 / .35)">Kaleidoscope Night</h2>
    <p style="text-shadow:0 1px 12px rgb(0 0 0 / .4)">Live visuals, analog synths and a 4am sunrise set.</p>
    <div class="bg-hero-actions"><a class="btn btn-contrast" href="#">RSVP</a></div>
  </div>
</div>` },
    { title: 'Pixel mode', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-liquid" data-pixel data-res="8" data-colors="#ef4444,#2563eb,#111827"></div>
  <div class="bg-hero bg-hero-dark"><h2 style="font-family:var(--font-mono);letter-spacing:0">HIGH SCORE 1,048,576</h2></div>
</div>` }
  ],
  api: [
    { name: '.bg-liquid', type: 'class', desc: 'Canvas swirl.' },
    { name: 'data-colors', type: 'attr', default: '--c1, --c2, --c3', desc: 'Three paint colors.' },
    { name: 'data-swirl', type: 'attr', default: '2.6', desc: 'Twist strength.' },
    { name: 'data-pixel', type: 'attr', desc: 'Nearest-neighbour upscaling for a pixel-art look.' },
    { name: 'data-res', type: 'attr', default: '5', desc: 'Pixels per sample.' },
    { name: 'data-speed', type: 'attr', default: '1', desc: 'Flow speed.' }
  ]
});

;
/* docs/registry/fx-bg-mesh.js */
RanjDocs.add({
  id: 'bg-mesh',
  name: 'Mesh Gradient',
  group: 'Backgrounds',
  description: 'Four color points orbit slowly to create a living mesh gradient. CSS only, using an animated @property angle.',
  tags: ['new', 'fx'],
  keywords: ['mesh', 'gradient', 'stripe', 'animated gradient'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-mesh"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Beta</b> Payments for indie makers</span>
    <h2>Get paid in every currency</h2>
    <p>Accept cards, wallets and bank transfers in 135 currencies with one integration.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Create account</a><a class="btn btn-outline" href="#">Read the docs</a></div>
  </div>
</div>` },
    { title: 'Pastel card', description: 'Any container works. Here it sits behind a pricing card.', height: 320, html: `
<div class="bg-host" style="width:min(360px,100%);border-radius:var(--radius-xl);border:1px solid var(--border);box-shadow:var(--shadow-lg)">
  <div class="bg-mesh" style="--c1:#a5b4fc;--c2:#f9a8d4;--c3:#99f6e4;--c4:#fde68a;--speed:14s"></div>
  <div class="bg-content" style="padding:1.75rem">
    <div style="font-size:.8rem;font-weight:600;opacity:.7">Pro plan</div>
    <div style="font-size:2.4rem;font-weight:800;letter-spacing:-.04em">$24<span style="font-size:1rem;opacity:.6">/mo</span></div>
    <p style="margin:.4rem 0 1.2rem;opacity:.75">Unlimited projects, priority support and custom domains.</p>
    <button class="btn btn-block">Upgrade now</button>
  </div>
</div>` }
  ],
  api: [
    { name: '.bg-mesh', type: 'class', desc: 'Animated mesh gradient layer.' },
    { name: '--c1 … --c4', type: 'var', default: 'hue based', desc: 'Point colors.' },
    { name: '--base', type: 'var', default: 'tinted --bg', desc: 'Base color underneath the points.' },
    { name: '--speed', type: 'var', default: '22s', desc: 'One full orbit.' }
  ]
});

;
/* docs/registry/fx-bg-meteors.js */
RanjDocs.add({
  id: 'bg-meteors',
  name: 'Meteors',
  group: 'Backgrounds',
  description: 'Shooting stars streak across the area at random intervals, each with a fading tail.',
  tags: ['new', 'fx', 'js'],
  keywords: ['shooting stars', 'meteor shower', 'comets'],
  demos: [
    { title: 'Night hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px;background:radial-gradient(120% 90% at 50% 0%, #1e1b4b, #07070d 70%)">
  <div class="bg-meteors" style="--meteor:#e0e7ff"></div>
  <div class="bg-hero bg-hero-dark">
    <span class="bg-hero-badge"><b>Live</b> Perseids peak tonight</span>
    <h2>Never miss a meteor shower</h2>
    <p>Sky alerts tuned to your exact location and cloud cover.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Download the app</a></div>
  </div>
</div>` },
    { title: 'Theme-aware', description: 'By default meteors use the foreground color mixed with your accent.', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-meteors" data-count="20" data-angle="160"></div>
  <div class="bg-hero"><h2>Make a wish</h2><p>Twenty meteors at a shallower 160 degree angle.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-meteors', type: 'class', desc: 'Meteor container (spawns spans with JS).' },
    { name: 'data-count', type: 'attr', default: '14', desc: 'Number of meteors.' },
    { name: 'data-angle', type: 'attr', default: '145', desc: 'Travel direction in degrees.' },
    { name: '--meteor', type: 'var', desc: 'Meteor color.' }
  ]
});

;
/* docs/registry/fx-bg-noise.js */
RanjDocs.add({
  id: 'bg-noise',
  name: 'Grain',
  group: 'Backgrounds',
  description: 'A film-grain overlay made from an inline SVG turbulence filter. Stack it on any background or image.',
  tags: ['new', 'fx'],
  keywords: ['noise', 'grain', 'texture', 'film', 'feTurbulence'],
  demos: [
    { title: 'Grain over a gradient', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px;background:linear-gradient(135deg, oklch(.62 .2 var(--hue)), oklch(.7 .18 calc(var(--hue) + 70)))">
  <div class="bg-noise" style="--opacity:.35"></div>
  <div class="bg-hero bg-hero-dark">
    <h2>Print-quality brand pages</h2>
    <p>A little grain makes flat gradients feel tactile and expensive.</p>
    <div class="bg-hero-actions"><a class="btn btn-contrast" href="#">See examples</a></div>
  </div>
</div>` },
    { title: 'Animated grain on a card', description: '<code>.bg-noise-animated</code> jitters the texture like real film.', height: 280, html: `
<div class="bg-host" style="width:min(380px,100%);padding:1.75rem;border-radius:var(--radius-xl);background:var(--card);border:1px solid var(--border);box-shadow:var(--shadow-md)">
  <div class="bg-noise bg-noise-animated"></div>
  <div class="bg-content">
    <div style="font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted-fg)">Now showing</div>
    <div style="font-size:1.6rem;font-weight:800;letter-spacing:-.03em;margin:.25rem 0">The Last Light</div>
    <p style="color:var(--muted-fg)">A 35mm documentary about the final drive-in theater in Nevada.</p>
  </div>
</div>` }
  ],
  api: [
    { name: '.bg-noise', type: 'class', desc: 'Static grain overlay.' },
    { name: '.bg-noise-animated', type: 'class', desc: 'Stepped jitter animation.' },
    { name: '--opacity', type: 'var', default: '.22 / .12 dark', desc: 'Grain strength.' },
    { name: '--size', type: 'var', default: '160px', desc: 'Tile size (bigger = coarser).' }
  ]
});

;
/* docs/registry/fx-bg-particles.js */
RanjDocs.add({
  id: 'bg-particles',
  name: 'Particles',
  group: 'Backgrounds',
  description: 'A drifting constellation of particles joined by lines. The cursor gently pushes them away.',
  tags: ['new', 'fx', 'js'],
  keywords: ['particles', 'constellation', 'network', 'nodes', 'canvas'],
  demos: [
    { title: 'Hero', description: 'Move your pointer through the particles.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-particles"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Graph</b> Map every dependency</span>
    <h2>See how your services connect</h2>
    <p>Automatic service maps from your traces. No config, no agents to babysit.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Connect a cluster</a></div>
  </div>
</div>` },
    { title: 'Dots only, more of them', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-particles" data-lines="false" data-count="180" data-speed="0.6" data-color="#f472b6"></div>
  <div class="bg-hero"><h2>Snow globe mode</h2><p><code>data-lines="false"</code> and a custom color.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-particles', type: 'class', desc: 'Canvas particle field.' },
    { name: 'data-count', type: 'attr', default: 'auto', desc: 'Particle count (auto scales with area, max 150).' },
    { name: 'data-link', type: 'attr', default: '120', desc: 'Max distance for connecting lines (px).' },
    { name: 'data-lines', type: 'attr', default: 'true', desc: 'Draw connecting lines.' },
    { name: 'data-speed', type: 'attr', default: '0.35', desc: 'Drift speed.' },
    { name: 'data-repel', type: 'attr', default: '110', desc: 'Cursor repel radius (px).' },
    { name: 'data-color / --color', type: 'attr', default: '--primary', desc: 'Particle color.' }
  ]
});

;
/* docs/registry/fx-bg-retro-grid.js */
RanjDocs.add({
  id: 'bg-retro-grid',
  name: 'Retro Grid',
  group: 'Backgrounds',
  description: 'A synthwave floor grid racing toward a glowing horizon, built with a single CSS perspective transform.',
  tags: ['new', 'fx'],
  keywords: ['synthwave', 'outrun', 'perspective', '80s', 'vaporwave', 'grid floor'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-retro-grid"></div>
  <div class="bg-hero" style="justify-content:flex-start;padding-top:3rem">
    <span class="bg-hero-badge"><b>Drop</b> Neon Highway vinyl, out now</span>
    <h2>Drive into the night</h2>
    <p>Twelve tracks of analog synths, recorded live to tape.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Listen now</a></div>
  </div>
</div>` },
    { title: 'Sunset palette', center: false, pad: false, height: 320, html: `
<div class="bg-host" style="height:320px;background:linear-gradient(#1a0b2e, #3b0d45 55%, #12051f);--bg:#12051f">
  <div class="bg-retro-grid" style="--line:#f472b6;--cell:44px;--speed:.9s"></div>
  <div class="bg-hero bg-hero-dark" style="justify-content:flex-start;padding-top:3rem"><h2 style="background:linear-gradient(#fde68a,#f472b6);-webkit-background-clip:text;background-clip:text;color:transparent">ARCADE 1986</h2><p>Insert coin to continue.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-retro-grid', type: 'class', desc: 'Perspective grid floor with a horizon glow.' },
    { name: '--line', type: 'var', default: 'primary 55%', desc: 'Grid line color.' },
    { name: '--cell', type: 'var', default: '56px', desc: 'Cell size.' },
    { name: '--angle', type: 'var', default: '68deg', desc: 'Tilt of the floor.' },
    { name: '--speed', type: 'var', default: '1.4s', desc: 'Time to travel one cell.' }
  ]
});

;
/* docs/registry/fx-bg-ripple.js */
RanjDocs.add({
  id: 'bg-ripple',
  name: 'Ripple',
  group: 'Backgrounds',
  description: 'Concentric rings breathe outward from a point, like sonar. Great behind a single icon or call to action.',
  tags: ['new', 'fx', 'js'],
  keywords: ['ripple', 'rings', 'sonar', 'pulse', 'concentric'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-ripple bg-fade"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Beta</b> Find my devices</span>
    <h2>Lost your keys again?</h2>
    <p>Tap once and every tracker within 120 meters chirps.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Ping nearby</a></div>
  </div>
</div>` },
    { title: 'Behind an icon', center: false, pad: false, height: 280, html: `
<div class="bg-host" style="height:280px;display:grid;place-items:center">
  <div class="bg-ripple" data-rings="6" data-size="90" data-step="56"></div>
  <div class="bg-content" style="width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--primary-fg);box-shadow:var(--shadow-glow)">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>
  </div>
</div>` }
  ],
  api: [
    { name: '.bg-ripple', type: 'class', desc: 'Ring container (rings generated with JS).' },
    { name: 'data-rings', type: 'attr', default: '8', desc: 'Number of rings.' },
    { name: 'data-size', type: 'attr', default: '130', desc: 'Innermost ring diameter (px).' },
    { name: 'data-step', type: 'attr', default: '84', desc: 'Growth per ring (px).' },
    { name: '--ring / --fill', type: 'var', desc: 'Ring border and fill colors.' },
    { name: '--speed', type: 'var', default: '3.4s', desc: 'Pulse cycle.' }
  ]
});

;
/* docs/registry/fx-bg-silk.js */
RanjDocs.add({
  id: 'bg-silk',
  name: 'Silk',
  group: 'Backgrounds',
  description: 'Smooth folds of fabric with soft specular highlights. Rendered at low resolution and upscaled, so it stays cheap.',
  tags: ['new', 'fx', 'js'],
  keywords: ['silk', 'fabric', 'satin', 'flowing', 'canvas', 'shader'],
  demos: [
    { title: 'Hero', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-silk"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>FW26</b> The Evening Collection</span>
    <h2>Made to move with you</h2>
    <p>Mulberry silk, cut and sewn in Como. Limited to 400 pieces.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Shop the collection</a></div>
  </div>
</div>` },
    { title: 'Champagne', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-silk" data-color="#d6b58a" data-scale="1.6" data-speed="0.7"></div>
  <div class="bg-hero"><h2>Maison Lumière</h2><p>Fine fragrance since 1921.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-silk', type: 'class', desc: 'Canvas silk.' },
    { name: 'data-color / --color', type: 'attr', default: '--c1', desc: 'Fabric color (shading adapts to theme).' },
    { name: 'data-scale', type: 'attr', default: '2.2', desc: 'Fold density.' },
    { name: 'data-speed', type: 'attr', default: '1', desc: 'Flow speed.' },
    { name: 'data-res', type: 'attr', default: '6', desc: 'Pixels per sample (higher = cheaper, softer).' }
  ]
});

;
/* docs/registry/fx-bg-squares.js */
RanjDocs.add({
  id: 'bg-squares',
  name: 'Squares',
  group: 'Backgrounds',
  description: 'A slowly sliding grid of squares. Cells light up under the cursor and leave a fading trail, with random flickers.',
  tags: ['new', 'fx', 'js'],
  keywords: ['squares', 'grid', 'hover trail', 'tiles', 'canvas'],
  demos: [
    { title: 'Hover trail', description: 'Sweep your pointer across the grid.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-squares bg-fade"></div>
  <div class="bg-hero">
    <span class="bg-hero-badge"><b>Open source</b> 12k stars on GitHub</span>
    <h2>Build blocks, not boilerplate</h2>
    <p>A component kit with 200+ pieces that snap together.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Star on GitHub</a></div>
  </div>
</div>` },
    { title: 'Big tiles moving up', center: false, pad: false, height: 300, html: `
<div class="bg-host" style="height:300px">
  <div class="bg-squares" data-size="64" data-direction="up" data-speed="0.5" style="--fill:#10b981"></div>
  <div class="bg-hero"><h2>All systems operational</h2><p>99.998% uptime over the last 90 days.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-squares', type: 'class', desc: 'Canvas square grid.' },
    { name: 'data-size', type: 'attr', default: '40', desc: 'Square size (px).' },
    { name: 'data-direction', type: 'attr', default: 'diagonal', desc: '<code>diagonal up down left right none</code>.' },
    { name: 'data-speed', type: 'attr', default: '0.35', desc: 'Slide speed (px per frame).' },
    { name: 'data-flicker', type: 'attr', default: 'true', desc: 'Random cell flicker.' },
    { name: '--fill', type: 'var', default: '--primary', desc: 'Highlight color.' }
  ]
});

;
/* docs/registry/fx-bg-stars.js */
RanjDocs.add({
  id: 'bg-stars',
  name: 'Starfield',
  group: 'Backgrounds',
  description: 'Twinkling stars drifting with depth, or a warp-speed tunnel. Press and hold to accelerate.',
  tags: ['new', 'fx', 'js'],
  keywords: ['stars', 'space', 'warp', 'hyperspace', 'galaxy', 'canvas'],
  demos: [
    { title: 'Warp speed', description: 'Press and hold anywhere on the hero to boost.', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-stars bg-stars-sky" data-mode="warp"></div>
  <div class="bg-hero bg-hero-dark">
    <span class="bg-hero-badge"><b>2x</b> Faster builds this week</span>
    <h2>Builds that break the light barrier</h2>
    <p>Remote caching makes your second build almost instant.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Enable caching</a></div>
  </div>
</div>` },
    { title: 'Twinkling drift', description: 'Theme-aware by default: light dots in dark mode, dark dots in light mode.', center: false, pad: false, height: 320, html: `
<div class="bg-host" style="height:320px">
  <div class="bg-stars"></div>
  <div class="bg-hero"><h2>Calm, quiet, focused</h2><p>A meditation timer for deep work sessions.</p><div class="bg-hero-actions"><a class="btn" href="#">Start a session</a></div></div>
</div>` }
  ],
  api: [
    { name: '.bg-stars', type: 'class', desc: 'Canvas starfield.' },
    { name: '.bg-stars-sky', type: 'class', desc: 'Paints a fixed deep-space backdrop and white stars in both themes.' },
    { name: 'data-mode', type: 'attr', default: 'drift', desc: '<code>drift</code> or <code>warp</code>.' },
    { name: 'data-speed', type: 'attr', default: '1', desc: 'Speed multiplier.' },
    { name: 'data-boost', type: 'attr', default: 'true', desc: 'Press and hold to accelerate.' },
    { name: 'data-count', type: 'attr', default: 'auto', desc: 'Star count.' }
  ]
});

;
/* docs/registry/fx-bg-waves.js */
RanjDocs.add({
  id: 'bg-waves',
  name: 'Waves',
  group: 'Backgrounds',
  description: 'Layered sine waves rolling across the bottom, or a bundle of thin flowing lines.',
  tags: ['new', 'fx', 'js'],
  keywords: ['waves', 'ocean', 'sine', 'flowing lines', 'canvas'],
  demos: [
    { title: 'Layered waves', center: false, pad: false, height: 360, html: `
<div class="bg-host" style="height:360px">
  <div class="bg-waves"></div>
  <div class="bg-hero" style="justify-content:flex-start;padding-top:3.5rem">
    <span class="bg-hero-badge"><b>New</b> Tide tables for 4,000 beaches</span>
    <h2>Catch the perfect wave</h2>
    <p>Swell, wind and tide forecasts in one clean view.</p>
    <div class="bg-hero-actions"><a class="btn" href="#">Check today's surf</a></div>
  </div>
</div>` },
    { title: 'Flowing lines', center: false, pad: false, height: 320, html: `
<div class="bg-host" style="height:320px">
  <div class="bg-waves" data-style="lines" data-amplitude="34"></div>
  <div class="bg-hero"><h2>Sound, visualised</h2><p>Lossless streaming with a real-time spectrum.</p></div>
</div>` }
  ],
  api: [
    { name: '.bg-waves', type: 'class', desc: 'Canvas waves. Colors come from <code>--c1 … --c4</code>.' },
    { name: 'data-style', type: 'attr', default: 'fill', desc: '<code>fill</code> or <code>lines</code>.' },
    { name: 'data-layers', type: 'attr', default: '4', desc: 'Number of filled layers.' },
    { name: 'data-lines', type: 'attr', default: '22', desc: 'Line count in lines mode.' },
    { name: 'data-amplitude', type: 'attr', default: '28', desc: 'Wave height (px).' },
    { name: 'data-speed', type: 'attr', default: '1', desc: 'Speed multiplier.' }
  ]
});

;
/* docs/registry/fx-bookmark-button.js */
RanjDocs.add({
  id: 'bookmark-button',
  name: 'Bookmark Button',
  group: 'Micro-interactions',
  description: 'The ribbon fills from the bottom, hops and sparkles, while the label flips from Save to Saved.',
  tags: ['new', 'fx', 'js'],
  keywords: ['bookmark', 'save', 'favorite', 'read later'],
  demos: [
    { title: 'Article row', height: 240, html: `
<div style="width:min(440px,100%);display:flex;gap:1rem;align-items:center;padding:1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <div style="width:72px;height:72px;flex:none;border-radius:var(--radius-lg);background:linear-gradient(135deg,#fde68a,#f97316)"></div>
  <div style="flex:1;min-width:0"><small style="color:var(--muted-fg)">Design · 6 min read</small><div style="font-weight:700;line-height:1.3">Why great buttons feel physical</div></div>
  <button class="bookmark-btn" aria-label="Save article"></button>
</div>` },
    { title: 'With label and count', html: `<button class="bookmark-btn"><span class="bookmark-btn-label"><span>Save</span><span>Saved</span></span></button>
<button class="bookmark-btn" aria-pressed="true" style="--on:var(--primary)" aria-label="Saved"><span class="bookmark-btn-count">318</span></button>` }
  ],
  api: [
    { name: '.bookmark-btn', type: 'class', desc: 'A <code>&lt;button&gt;</code>; icon injected.' },
    { name: '.bookmark-btn-label', type: 'class', desc: 'Two spans: idle and saved text.' },
    { name: '.bookmark-btn-count', type: 'class', desc: 'Rolling count.' },
    { name: '--on', type: 'var', default: '--warning', desc: 'Fill color.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { pressed }' }
  ]
});

;
/* docs/registry/fx-charging-animation.js */
RanjDocs.add({
  id: 'charging-animation',
  name: 'Charging Animation',
  group: 'Micro-interactions',
  description: 'Liquid fills a ring or battery with rolling waves and rising bubbles while the percentage counts up.',
  tags: ['new', 'fx', 'js'],
  keywords: ['battery', 'charging', 'liquid', 'wave fill', 'power', 'progress'],
  demos: [
    { title: 'Ring', height: 320, html: `
<div class="charging" data-level="76" data-charging>
  <div class="charging-ring"><div class="charging-tank"><div class="charging-wave"></div><div class="charging-wave"></div><div class="charging-bubbles"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
    <div class="charging-info"><b data-charging-text>0%</b><small>42 min to full</small></div></div>
</div>` },
    { title: 'Battery + controls', height: 340, html: `
<div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap;justify-content:center">
  <div class="charging" data-level="14" data-charging>
    <div class="charging-battery"><div class="charging-tank"><div class="charging-wave"></div><div class="charging-wave"></div><div class="charging-bubbles"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
      <div class="charging-info"><b data-charging-text>0%</b></div></div>
  </div>
  <div style="display:grid;gap:.5rem"><button class="btn btn-sm" data-demo-lvl="100">Charge to 100%</button><button class="btn btn-sm btn-outline" data-demo-lvl="14">Back to 14%</button><button class="btn btn-sm btn-ghost" data-demo-plug>Unplug</button></div>
</div>`, js: `
var c = root.querySelector('.charging');
root.querySelectorAll('[data-demo-lvl]').forEach(function (b) { b.onclick = function () { Ranj.charging(c, +b.getAttribute('data-demo-lvl')); }; });
root.querySelector('[data-demo-plug]').onclick = function () { var on = c.toggleAttribute('data-charging'); this.textContent = on ? 'Unplug' : 'Plug in'; };` }
  ],
  api: [
    { name: '.charging', type: 'class', desc: 'Wrapper around <code>.charging-ring</code> or <code>.charging-battery</code>, each with a <code>.charging-tank</code> of two <code>.charging-wave</code> and optional <code>.charging-bubbles</code>.' },
    { name: 'data-level', type: 'attr', default: '0', desc: 'Target level 0..100, animated in when visible.' },
    { name: 'data-charging', type: 'attr', desc: 'Shows the bolt and bubbles.' },
    { name: 'data-low-at', type: 'attr', default: '20', desc: 'At or below this level the liquid turns red.' },
    { name: '[data-charging-text]', type: 'attr', desc: 'Receives the counting percentage.' },
    { name: '--liq / --liq2', type: 'var', desc: 'Liquid colors.' },
    { name: 'Ranj.charging(el, level)', type: 'js', desc: 'Animate to a new level.' }
  ]
});

;
/* docs/registry/fx-circular-arc-slider.js */
RanjDocs.add({
  id: 'circular-arc-slider',
  name: 'Circular Arc Slider',
  group: 'Micro-interactions',
  description: 'A 270 degree dial you drag around the arc, with a gradient value track, lit tick marks and a big readout.',
  tags: ['new', 'fx', 'js'],
  keywords: ['knob', 'dial', 'radial slider', 'thermostat', 'volume', 'circular range'],
  demos: [
    { title: 'Thermostat', description: 'Drag the thumb, click anywhere on the dial, or use the arrow keys.', height: 320, html: `
<div class="arc-slider" data-value="21.5" data-min="16" data-max="28" data-step="0.5" data-unit="°" data-label="Living room" style="--c1:#38bdf8;--c2:#f97316"></div>
<div style="display:grid;gap:.25rem;font-size:.9rem;min-width:140px"><small style="color:var(--muted-fg)">Target</small><b class="demo-arc-out" style="font-size:1.4rem">21.5°C</b><small style="color:var(--muted-fg)">Heating · Eco mode</small></div>`, js: `
var s = root.querySelector('.arc-slider'), out = root.querySelector('.demo-arc-out');
s.addEventListener('ranj:input', function (e) { out.textContent = e.detail.value.toFixed(1) + '°C'; });` },
    { title: 'Sizes', height: 260, html: `
<div class="arc-slider" data-value="64" data-unit="%" data-label="Volume" style="--size:170px"></div>
<div class="arc-slider" data-value="3200" data-min="0" data-max="6000" data-step="100" data-label="rpm" data-ticks="12" style="--size:130px;--stroke:10;--c1:#10b981;--c2:#a3e635"></div>` }
  ],
  api: [
    { name: '.arc-slider', type: 'class', desc: 'Empty element; SVG and readout injected. <code>role="slider"</code>, focusable.' },
    { name: 'data-value / data-min / data-max / data-step', type: 'attr', default: '50 / 0 / 100 / 1', desc: 'Range.' },
    { name: 'data-unit / data-label', type: 'attr', desc: 'Readout unit and caption.' },
    { name: 'data-ticks', type: 'attr', default: '24', desc: 'Number of tick marks.' },
    { name: '--size / --stroke / --c1 / --c2 / --track', type: 'var', desc: 'Size, track width and gradient colors.' },
    { name: 'Ranj.arcSlider(el, value)', type: 'js', desc: 'Set the value.' },
    { name: 'ranj:input / ranj:change', type: 'event', desc: 'detail: { value } while dragging / on release.' }
  ]
});

;
/* docs/registry/fx-color-palette.js */
RanjDocs.add({
  id: 'color-palette',
  name: 'Color Palette',
  group: 'Micro-interactions',
  description: 'Swatches that spring wider on hover to reveal the name and hex. Click to copy. Text color adapts to each swatch.',
  tags: ['new', 'fx', 'js'],
  keywords: ['swatches', 'palette', 'colors', 'copy hex', 'brand colors'],
  demos: [
    { title: 'Brand palette', description: 'Hover a swatch, click to copy its hex.', height: 260, html: `
<div class="palette">
  <button class="palette-swatch" style="--c:#0f172a" data-name="Midnight"></button>
  <button class="palette-swatch" style="--c:#3730a3" data-name="Indigo"></button>
  <button class="palette-swatch" style="--c:#7c3aed" data-name="Violet"></button>
  <button class="palette-swatch" style="--c:#db2777" data-name="Fuchsia"></button>
  <button class="palette-swatch" style="--c:#fb923c" data-name="Apricot"></button>
  <button class="palette-swatch" style="--c:#fde68a" data-name="Butter"></button>
</div>` },
    { title: 'Your accent scale', description: 'Swatches can use CSS variables; hex values update when the theme or accent changes.', height: 260, html: `
<div class="palette" style="height:120px">
  <button class="palette-swatch" style="--c:oklch(.95 .03 var(--hue))" data-name="50"></button>
  <button class="palette-swatch" style="--c:oklch(.85 .08 var(--hue))" data-name="200"></button>
  <button class="palette-swatch" style="--c:oklch(.7 .16 var(--hue))" data-name="400"></button>
  <button class="palette-swatch" style="--c:var(--primary)" data-name="Primary"></button>
  <button class="palette-swatch" style="--c:oklch(.42 .18 var(--hue))" data-name="700"></button>
  <button class="palette-swatch" style="--c:oklch(.28 .12 var(--hue))" data-name="900"></button>
</div>` }
  ],
  api: [
    { name: '.palette', type: 'class', desc: 'Row of <code>.palette-swatch</code> buttons. <code>.palette-vertical</code> stacks them.' },
    { name: '--c', type: 'var', desc: 'Swatch color (any CSS color).' },
    { name: 'data-name / data-hex', type: 'attr', desc: 'Label, and an optional explicit hex to copy.' },
    { name: 'ranj:copy', type: 'event', desc: 'detail: { hex, name }' }
  ]
});

;
/* docs/registry/fx-continue-button.js */
RanjDocs.add({
  id: 'continue-button',
  name: 'Continue Button',
  group: 'Micro-interactions',
  description: 'Collapses into a round spinner, then pops into a green check. Springs back to its full width afterwards.',
  tags: ['new', 'fx', 'js'],
  keywords: ['continue', 'next', 'loading button', 'submit', 'morph spinner'],
  demos: [
    { title: 'Default', html: `
<button class="fxb continue-btn"><span class="fxb-texts"><span data-for="idle">Continue</span></span><svg class="fxb-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg><i class="fxb-spin"></i><span class="fxb-done"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></button>` },
    { title: 'Checkout step', height: 300, html: `
<div style="width:min(380px,100%);padding:1.25rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);display:grid;gap:.8rem">
  <div><small style="color:var(--muted-fg)">Step 2 of 3</small><div style="font-weight:700;font-size:1.05rem">Shipping address</div></div>
  <div style="padding:.75rem .9rem;border:1px solid var(--primary);border-radius:var(--radius-lg);font-size:.9rem;background:var(--primary-soft);color:var(--primary-soft-fg)">221B Baker Street, London NW1 6XE</div>
  <div style="display:flex;justify-content:flex-end"><button class="fxb continue-btn" data-duration="1300"><span class="fxb-texts"><span data-for="idle">Continue to payment</span></span><svg class="fxb-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg><i class="fxb-spin"></i><span class="fxb-done"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></button></div>
</div>` }
  ],
  api: [
    { name: '.fxb.continue-btn', type: 'class', desc: 'Contains label, <code>.fxb-arrow</code>, <code>.fxb-spin</code> and <code>.fxb-done</code>.' },
    { name: 'data-duration / data-manual / data-reset', type: 'attr', desc: 'Timing, see Send Button.' },
    { name: 'Ranj.fxButton', type: 'js', desc: 'Drive it manually: <code>done(el)</code>, <code>error(el)</code>, <code>reset(el)</code>.' }
  ]
});

;
/* docs/registry/fx-copy-button.js */
RanjDocs.add({
  id: 'copy-button',
  name: 'Copy Button',
  group: 'Micro-interactions',
  description: 'Copies text to the clipboard; the icon spins into a drawn check with a little Copied tooltip.',
  tags: ['new', 'fx', 'js'],
  keywords: ['copy', 'clipboard', 'copy to clipboard', 'code copy'],
  demos: [
    { title: 'Install command', html: `
<div style="display:flex;align-items:center;gap:.5rem;padding:.35rem .35rem .35rem 1rem;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--bg-subtle);font-family:var(--font-mono);font-size:.85rem">
  <span style="color:var(--muted-fg)">$</span><span>npm install ranj-ui</span>
  <button class="copy-btn" data-copy="npm install ranj-ui"></button>
</div>` },
    { title: 'API key and share link', height: 260, html: `
<div style="width:min(420px,100%);display:grid;gap:1rem">
  <div><small style="color:var(--muted-fg);font-weight:600">Secret key</small>
    <div style="display:flex;align-items:center;gap:.4rem;margin-top:.3rem;padding:.3rem .3rem .3rem .8rem;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--card)"><code id="copy-button-key" style="flex:1;font-size:.8rem;overflow:hidden;text-overflow:ellipsis">sk_live_51Hx3eJ2kQ9vT7cW</code><button class="copy-btn" data-copy-target="#copy-button-key"></button></div></div>
  <div><small style="color:var(--muted-fg);font-weight:600">Invite link</small>
    <div style="display:flex;gap:.4rem;margin-top:.3rem"><input class="input" id="copy-button-link" readonly value="https://acme.app/join/7hd92k" style="flex:1;min-width:0;height:2.25rem;padding:0 .75rem;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--card)"><button class="copy-btn copy-btn-text" data-copy-target="#copy-button-link" style="height:2.25rem;border:1px solid var(--border)"><span class="copy-btn-label">Copy link</span></button></div></div>
</div>` }
  ],
  api: [
    { name: '.copy-btn', type: 'class', desc: 'Icon button; icons injected if missing.' },
    { name: '.copy-btn-text', type: 'class', desc: 'Wider variant with a <code>.copy-btn-label</code> that swaps to the copied label.' },
    { name: 'data-copy', type: 'attr', desc: 'Literal text to copy.' },
    { name: 'data-copy-target', type: 'attr', desc: 'Selector; copies its value (inputs) or text.' },
    { name: 'data-copied-label', type: 'attr', default: 'Copied!', desc: 'Tooltip / label after copying.' },
    { name: 'Ranj.copyText(text)', type: 'js', desc: 'Promise-based clipboard helper with a fallback.' },
    { name: 'ranj:copy', type: 'event', desc: 'detail: { text }' }
  ]
});

;
/* docs/registry/fx-counters.js */
RanjDocs.add({
  id: 'counters',
  name: 'Counters',
  group: 'Micro-interactions',
  description: 'Stepper counters in three styles: frosted glass, a ring of dots that light up, and a progress ring. Hold a button to repeat.',
  tags: ['new', 'fx', 'js'],
  keywords: ['stepper', 'counter', 'quantity', 'increment', 'number input', 'dial'],
  demos: [
    { title: 'Frosted glass', pad: false, center: false, height: 320, html: `
<div style="min-height:320px;display:grid;place-items:center;padding:2rem 1rem;background:radial-gradient(40% 60% at 30% 35%, #f472b6, transparent 70%),radial-gradient(45% 60% at 70% 65%, #38bdf8, transparent 70%),linear-gradient(135deg,#6d28d9,#0f172a)">
  <div class="counter counter-glass" data-value="2" data-min="1" data-max="12" tabindex="0" aria-label="Guests">
    <span class="counter-label">Guests</span>
    <div class="counter-row"><button class="counter-btn" data-counter="dec"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button><span class="counter-value odometer" data-counter-value>2</span><button class="counter-btn" data-counter="inc"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>
  </div>
</div>` },
    { title: 'Dotted circle', height: 340, html: `
<div class="counter counter-dots" data-value="18" data-min="0" data-max="30" data-dots="30" tabindex="0" aria-label="Daily glasses of water goal">
  <div class="counter-dots-ring"><div class="counter-center"><span class="counter-value" data-counter-value>18</span><span class="counter-label">minutes focus</span></div></div>
  <div class="counter-row"><button class="counter-btn" data-counter="dec"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button><button class="counter-btn" data-counter="inc"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>
</div>` },
    { title: 'Progress ring', height: 340, html: `
<div class="counter counter-ring" data-value="6" data-min="0" data-max="8" tabindex="0" aria-label="Glasses of water">
  <div class="counter-ring-wrap"><svg viewBox="0 0 100 100"><circle class="cr-track" cx="50" cy="50" r="44"/><circle class="cr-val" cx="50" cy="50" r="44" pathLength="1"/></svg>
    <div class="counter-center"><span class="counter-value odometer" data-counter-value>6</span><span class="counter-label">of 8 glasses</span></div></div>
  <div class="counter-row"><button class="counter-btn" data-counter="dec"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button><button class="counter-btn" data-counter="inc"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>
</div>` }
  ],
  api: [
    { name: '.counter', type: 'class', desc: 'Root. Add <code>.counter-glass</code>, <code>.counter-dots</code> or <code>.counter-ring</code>.' },
    { name: 'data-value / data-min / data-max / data-step', type: 'attr', default: '0 / 0 / 99 / 1', desc: 'Range.' },
    { name: '[data-counter="inc|dec"]', type: 'attr', desc: 'Buttons. Hold to repeat. Arrow keys, Home and End work when the root is focused.' },
    { name: '[data-counter-value]', type: 'attr', desc: 'Displays the value; add <code>.odometer</code> for rolling digits.' },
    { name: 'data-dots', type: 'attr', default: '30', desc: 'Dot count for <code>.counter-dots</code>.' },
    { name: '--p', type: 'var', desc: 'Progress 0..1, set on the root for your own styling.' },
    { name: 'Ranj.counter(el, value)', type: 'js', desc: 'Set the value.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { value }' }
  ]
});

;
/* docs/registry/fx-day-night-toggle.js */
RanjDocs.add({
  id: 'day-night-toggle',
  name: 'Day / Night Toggle',
  group: 'Micro-interactions',
  description: 'A theme switch where the sun rolls across, turns into a cratered moon, clouds sink away and stars twinkle in.',
  tags: ['new', 'fx', 'js'],
  keywords: ['theme toggle', 'dark mode switch', 'sun moon', 'light dark'],
  demos: [
    { title: 'Default', html: `<button class="daynight" aria-label="Dark mode"></button>
<button class="daynight" aria-checked="true" aria-label="Dark mode"></button>` },
    { title: 'Sizes', html: `<button class="daynight daynight-sm" aria-label="Dark mode"></button>
<button class="daynight" aria-label="Dark mode"></button>
<button class="daynight daynight-lg" aria-label="Dark mode"></button>` },
    { title: 'Controls the site theme', description: '<code>data-theme-toggle</code> wires it to <code>Ranj.theme</code>. Try it, the docs switch too.', height: 240, html: `
<div style="width:min(360px,100%);flex-direction:row;padding:1.1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <div><div style="font-weight:600">Appearance</div><div style="font-size:.85rem;color:var(--muted-fg)">Switch between light and dark</div></div>
  <button class="daynight" data-theme-toggle aria-label="Dark mode"></button>
</div>` }
  ],
  api: [
    { name: '.daynight', type: 'class', desc: 'Put on an empty <code>&lt;button&gt;</code>; ranj.js injects the sky, clouds, stars and knob.' },
    { name: '.daynight-sm / .daynight-lg', type: 'class', desc: 'Sizes. Or set <code>--h</code>.' },
    { name: 'aria-checked', type: 'attr', default: 'false', desc: '<code>true</code> = night.' },
    { name: 'data-theme-toggle', type: 'attr', desc: 'Sync with and set the document theme.' },
    { name: '--day-a / --day-b / --night-a / --night-b / --sun / --moon', type: 'var', desc: 'Palette.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { checked }' }
  ]
});

;
/* docs/registry/fx-download-button.js */
RanjDocs.add({
  id: 'download-button',
  name: 'Download Button',
  group: 'Micro-interactions',
  description: 'Idle, then a filling progress ring and bar with a live percentage, then a drawn check.',
  tags: ['new', 'fx', 'js'],
  keywords: ['download', 'progress button', 'file', 'loading button'],
  demos: [
    { title: 'File row', height: 260, html: `
<div style="width:min(460px,100%);display:flex;align-items:center;gap:.9rem;padding:.85rem 1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);flex-wrap:wrap">
  <span style="width:40px;height:40px;border-radius:var(--radius);display:grid;place-items:center;background:var(--destructive-soft);color:var(--destructive-soft-fg);font-size:.7rem;font-weight:800">PDF</span>
  <div style="flex:1;min-width:140px"><b style="display:block;font-size:.92rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Annual-report-2026.pdf</b><small style="color:var(--muted-fg)">18.4 MB · Updated today</small></div>
  <button class="fxb dl-btn" style="height:var(--control-h)"><span class="fxb-icon"><svg class="fxb-arrow" viewBox="0 0 24 24"><path class="dl-shaft" d="M12 4v11"/><path d="M7 10.5l5 5 5-5"/><path d="M5 20h14"/></svg><svg class="fxb-ring" viewBox="0 0 24 24"><circle class="ring-track" cx="12" cy="12" r="9"/><circle class="ring-val" pathLength="1" cx="12" cy="12" r="9"/></svg><svg class="fxb-check" viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="fxb-texts"><span data-for="idle">Download</span><span data-for="busy">Downloading <small data-progress-text>0%</small></span><span data-for="done">Saved</span></span></button>
</div>` },
    { title: 'Controlled progress', description: '<code>data-manual</code> + <code>Ranj.fxButton.progress()</code> for real uploads or downloads.', html: `
<button class="fxb dl-btn" data-manual data-reset="0"><span class="fxb-icon"><svg class="fxb-arrow" viewBox="0 0 24 24"><path class="dl-shaft" d="M12 4v11"/><path d="M7 10.5l5 5 5-5"/><path d="M5 20h14"/></svg><svg class="fxb-ring" viewBox="0 0 24 24"><circle class="ring-track" cx="12" cy="12" r="9"/><circle class="ring-val" pathLength="1" cx="12" cy="12" r="9"/></svg><svg class="fxb-check" viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="fxb-texts"><span data-for="idle">Export 1,204 rows</span><span data-for="busy">Exporting <small data-progress-text>0%</small></span><span data-for="done">Export ready</span></span></button>
<button class="btn btn-outline btn-sm" data-demo-reset>Reset</button>`, js: `
var b = root.querySelector('.dl-btn');
b.addEventListener('ranj:start', function () { var p = 0; var t = setInterval(function () { p += 0.07 + Math.random() * 0.06; Ranj.fxButton.progress(b, p); if (p >= 1) { clearInterval(t); Ranj.fxButton.done(b); } }, 160); });
root.querySelector('[data-demo-reset]').onclick = function () { Ranj.fxButton.reset(b); };` }
  ],
  api: [
    { name: '.fxb.dl-btn', type: 'class', desc: 'Download button. Icons: <code>.fxb-arrow</code>, <code>.fxb-ring</code>, <code>.fxb-check</code>.' },
    { name: '[data-progress-text]', type: 'attr', desc: 'Any element inside gets the live percentage.' },
    { name: 'data-duration', type: 'attr', default: '2400', desc: 'Simulated duration (ms).' },
    { name: 'data-manual / data-reset', type: 'attr', desc: 'See Send Button.' },
    { name: '--p', type: 'var', default: '0', desc: 'Progress 0..1 (set by JS).' },
    { name: 'Ranj.fxButton.progress(el, p)', type: 'js', desc: 'Set progress 0..1.' }
  ]
});

;
/* docs/registry/fx-glass-button.js */
RanjDocs.add({
  id: 'glass-button',
  name: 'Glass Button',
  group: 'Micro-interactions',
  description: 'Frosted glass buttons with a bright rim and a light sweep on hover. Made to sit on photos and gradients.',
  tags: ['new', 'fx'],
  keywords: ['glassmorphism', 'frosted', 'blur button', 'glass'],
  demos: [
    { title: 'On a wallpaper', pad: false, center: false, height: 280, html: `
<div style="min-height:280px;display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;justify-content:center;padding:2rem 1rem;background:radial-gradient(40% 60% at 25% 35%, #f97316, transparent 70%),radial-gradient(45% 60% at 75% 65%, #8b5cf6, transparent 70%),radial-gradient(30% 40% at 60% 20%, #22d3ee, transparent 70%),linear-gradient(135deg,#1e3a8a,#831843)">
  <button class="glass-btn">Continue</button>
  <button class="glass-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 5v14l11-7z"/></svg>Watch trailer</button>
  <button class="glass-btn" style="padding:0;width:var(--control-h-lg)" aria-label="Add"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
</div>` },
    { title: 'Theme-aware variant', description: '<code>.glass-btn-dark</code> tints with the page background, for lighter surfaces.', pad: false, center: false, height: 240, html: `
<div style="min-height:240px;display:flex;gap:.75rem;align-items:center;justify-content:center;padding:2rem 1rem;background:radial-gradient(40% 70% at 30% 50%, oklch(.8 .12 var(--hue)), transparent 70%),radial-gradient(40% 70% at 70% 50%, oklch(.85 .1 calc(var(--hue) + 90)), transparent 70%),var(--bg-subtle)">
  <button class="glass-btn glass-btn-dark">Open settings</button>
  <button class="glass-btn glass-btn-dark">Share</button>
</div>` }
  ],
  api: [
    { name: '.glass-btn', type: 'class', desc: 'White frosted glass with light text.' },
    { name: '.glass-btn-dark', type: 'class', desc: 'Tinted with <code>--bg</code> and using <code>--fg</code> text, adapts to the theme.' }
  ]
});

;
/* docs/registry/fx-glow-button.js */
RanjDocs.add({
  id: 'glow-button',
  name: 'Glow Button',
  group: 'Micro-interactions',
  description: 'A dark pill with a rotating color aura behind it and a soft light that follows your cursor across the surface.',
  tags: ['new', 'fx', 'js'],
  keywords: ['glow', 'neon button', 'aura', 'cta', 'gradient glow'],
  demos: [
    { title: 'Default', description: 'Hover to intensify the glow and move the light.', html: `
<button class="glow-btn">Get early access</button>
<button class="glow-btn glow-btn-primary">Start free trial</button>
<button class="glow-btn" style="--g1:#f97316;--g2:#ec4899;--g3:#facc15">Launch party</button>` },
    { title: 'Hero call to action', pad: false, center: false, height: 300, html: `
<div class="bg-host" style="height:300px;background:#07070b">
  <div class="bg-dot-pattern" style="--dot-color:rgb(255 255 255 / .12)"></div>
  <div class="bg-hero bg-hero-dark"><h2>Your AI pair designer</h2><p>Describe a screen. Get production-ready HTML in seconds.</p><div class="bg-hero-actions"><button class="glow-btn">Try it free</button></div></div>
</div>` }
  ],
  api: [
    { name: '.glow-btn', type: 'class', desc: 'Glow button. Cursor light uses ranj.js (optional).' },
    { name: '.glow-btn-primary', type: 'class', desc: 'Accent-colored surface.' },
    { name: '--g1 / --g2 / --g3', type: 'var', desc: 'Aura colors.' }
  ]
});

;
/* docs/registry/fx-gradient-border-button.js */
RanjDocs.add({
  id: 'gradient-border-button',
  name: 'Gradient Border Button',
  group: 'Micro-interactions',
  description: 'A rotating conic gradient border. On hover the fill melts away and the gradient floods the button.',
  tags: ['new', 'fx'],
  keywords: ['gradient border', 'animated border', 'rainbow button', 'conic'],
  demos: [
    { title: 'Default', description: 'Hover to flood the button with the gradient.', html: `
<button class="gborder-btn">Upgrade to Pro</button>
<button class="gborder-btn" style="--g1:#22d3ee;--g2:#a78bfa;--g3:#f472b6">Generate with AI</button>
<button class="gborder-btn gborder-btn-static">Static gradient</button>` },
    { title: 'Keep the fill', description: '<code>.gborder-btn-keep</code> glows instead of filling on hover.', html: `
<button class="gborder-btn gborder-btn-keep" style="--bw:1.5px">Connect wallet</button>
<button class="gborder-btn gborder-btn-keep" style="--bw:3px;--g1:#f59e0b;--g2:#ef4444;--g3:#f59e0b">Hot deal</button>` }
  ],
  api: [
    { name: '.gborder-btn', type: 'class', desc: 'Rotating gradient border; fills on hover.' },
    { name: '.gborder-btn-static', type: 'class', desc: 'No rotation.' },
    { name: '.gborder-btn-keep', type: 'class', desc: 'Keep the inner fill on hover and glow instead.' },
    { name: '--g1 / --g2 / --g3 / --bw', type: 'var', desc: 'Gradient colors and border width.' }
  ]
});

;
/* docs/registry/fx-hamburger.js */
RanjDocs.add({
  id: 'hamburger',
  name: 'Hamburger',
  group: 'Micro-interactions',
  description: 'Menu icons that morph into a close X or a back arrow. Five motion styles, all CSS transitions.',
  tags: ['new', 'fx', 'js'],
  keywords: ['menu icon', 'burger', 'nav toggle', 'close', 'x'],
  demos: [
    { title: 'Variants', description: 'Click each one.', html: `
<div class="demo-ham-row">
  <div><button class="hamburger" aria-label="Menu"></button><small>Default</small></div>
  <div><button class="hamburger hamburger-spin" aria-label="Menu"></button><small>Spin</small></div>
  <div><button class="hamburger hamburger-arrow" aria-label="Menu"></button><small>Arrow</small></div>
  <div><button class="hamburger hamburger-squeeze" aria-label="Menu"></button><small>Squeeze</small></div>
  <div><button class="hamburger hamburger-stagger" aria-label="Menu"></button><small>Stagger</small></div>
</div>`, css: `
.demo-ham-row { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; }
.demo-ham-row > div { display: flex; flex-direction: column; align-items: center; gap: .4rem; }
.demo-ham-row small { color: var(--muted-fg); font-size: .75rem; }` },
    { title: 'Controls a menu', description: '<code>aria-controls</code> sets <code>data-state</code> on the target.', height: 300, center: false, html: `
<div class="demo-ham-nav">
  <header><b>Northwind</b><button class="hamburger hamburger-spin" aria-controls="hamburger-demo-menu" aria-label="Menu"></button></header>
  <nav id="hamburger-demo-menu" data-state="closed"><a href="#">Products</a><a href="#">Pricing</a><a href="#">Customers</a><a href="#">Careers</a></nav>
</div>`, css: `
.demo-ham-nav { width: min(380px, 100%); margin: 1.5rem auto; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); overflow: hidden; }
.demo-ham-nav header { display: flex; align-items: center; justify-content: space-between; padding: .4rem .5rem .4rem 1rem; }
.demo-ham-nav nav { display: grid; padding: 0 .5rem; max-height: 0; opacity: 0; transition: max-height .4s var(--ease-out), opacity .3s, padding .3s; }
.demo-ham-nav nav[data-state="open"] { max-height: 220px; opacity: 1; padding: .25rem .5rem .6rem; }
.demo-ham-nav nav a { padding: .55rem .6rem; border-radius: var(--radius); color: var(--fg); font-weight: 500; }
.demo-ham-nav nav a:hover { background: var(--muted); text-decoration: none; }` },
    { title: 'Sizes', html: `<button class="hamburger" style="--size:16px;--gap:4.5px" aria-label="Menu"></button>
<button class="hamburger" aria-label="Menu"></button>
<button class="hamburger" style="--size:30px;--thick:3px;--gap:8px" aria-label="Menu"></button>` }
  ],
  api: [
    { name: '.hamburger', type: 'class', desc: 'Empty <code>&lt;button&gt;</code>; three bars injected.' },
    { name: '.hamburger-spin / -arrow / -squeeze / -stagger', type: 'class', desc: 'Motion styles.' },
    { name: 'aria-expanded', type: 'attr', default: 'false', desc: 'Open state.' },
    { name: 'aria-controls', type: 'attr', desc: 'Target id; receives <code>data-state="open|closed"</code>.' },
    { name: 'data-manual', type: 'attr', desc: 'Do not toggle on click; set <code>aria-expanded</code> yourself.' },
    { name: '--size / --thick / --gap / --speed', type: 'var', default: '22px / 2px / 6px / .22s', desc: 'Geometry and timing.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { open }' }
  ]
});

;
/* docs/registry/fx-infinite-loader.js */
RanjDocs.add({
  id: 'infinite-loader',
  name: 'Infinite Loader',
  group: 'Loaders',
  description: 'A glowing segment chasing itself around an infinity path. SVG drawn by ranj.js, animated with CSS.',
  tags: ['new', 'fx', 'js'],
  keywords: ['infinity', 'loop', 'lemniscate', 'svg loader', 'path animation'],
  demos: [
    { title: 'Default and gradient', html: `
<span class="loader-infinite"></span>
<span class="loader-infinite loader-infinite-gradient" style="--size:56px"></span>
<span class="loader-infinite" style="--size:28px;--color:var(--success)"></span>` },
    { title: 'Full-screen loading state', pad: false, center: false, height: 300, html: `
<div style="min-height:300px;display:grid;place-items:center;align-content:center;gap:1rem;text-align:center;background:var(--bg-subtle)">
  <span class="loader-infinite loader-infinite-gradient" style="--size:48px"></span>
  <div><b>Syncing your workspace</b><div style="color:var(--muted-fg);font-size:.88rem">Pulling 1,204 files from the cloud</div></div>
</div>` }
  ],
  api: [
    { name: '.loader-infinite', type: 'class', desc: 'Empty element; SVG injected. Width is 2 × <code>--size</code>.' },
    { name: '.loader-infinite-gradient', type: 'class', desc: 'Accent-to-complement gradient stroke.' },
    { name: '--size / --color', type: 'var', default: '40px / --primary', desc: 'Height and color.' }
  ]
});

;
/* docs/registry/fx-ios-toggle-pack.js */
RanjDocs.add({
  id: 'ios-toggle-pack',
  name: 'Toggle Pack',
  group: 'Micro-interactions',
  description: 'Five stylish switch variants: squishy knob, X to check morph, neon glow, inline labels and a jelly bounce.',
  tags: ['new', 'fx', 'js'],
  keywords: ['switch', 'toggle', 'ios switch', 'neon', 'squish', 'checkbox switch'],
  demos: [
    { title: 'All variants', description: 'Press and hold the squish one to see it stretch.', html: `
<div class="demo-tglp-grid">
  <div><button class="tgl tgl-squish" aria-checked="true" aria-label="Squish"></button><span>Squish</span></div>
  <div><button class="tgl tgl-icon" aria-label="Icon morph"></button><span>Icon morph</span></div>
  <div><button class="tgl tgl-neon" aria-checked="true" aria-label="Neon"></button><span>Neon</span></div>
  <div><button class="tgl tgl-text" data-on="ON" data-off="OFF" aria-label="Labels"></button><span>Labels</span></div>
  <div><button class="tgl tgl-bounce" aria-label="Bounce"></button><span>Bounce</span></div>
</div>`, css: `
.demo-tglp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); gap: 1.5rem 1rem; width: 560px; max-width: 100%; }
.demo-tglp-grid > div { display: flex; flex-direction: column; align-items: center; gap: .6rem; font-size: .8rem; color: var(--muted-fg); }` },
    { title: 'Settings list', height: 300, html: `
<div style="width:min(380px,100%);border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);overflow:hidden">
  <label class="demo-tglp-row"><span><b>Push notifications</b><small>Mentions, replies and DMs</small></span><button class="tgl tgl-icon" aria-checked="true" aria-label="Push notifications"></button></label>
  <label class="demo-tglp-row"><span><b>Weekly digest</b><small>Every Monday at 9:00</small></span><button class="tgl tgl-squish" aria-label="Weekly digest"></button></label>
  <label class="demo-tglp-row"><span><b>Beta features</b><small>Try things before everyone else</small></span><button class="tgl tgl-sm" aria-checked="true" aria-label="Beta features"></button></label>
</div>`, css: `
.demo-tglp-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .9rem 1.1rem; }
.demo-tglp-row + .demo-tglp-row { border-top: 1px solid var(--border); }
.demo-tglp-row b { display: block; font-weight: 600; font-size: .92rem; }
.demo-tglp-row small { color: var(--muted-fg); font-size: .8rem; }` },
    { title: 'Neon on dark', bg: 'dark', html: `<button class="tgl tgl-neon tgl-lg" aria-checked="true" aria-label="Neon"></button>
<button class="tgl tgl-neon tgl-lg" style="--on:#f472b6" aria-label="Neon pink"></button>
<button class="tgl tgl-neon tgl-lg" style="--on:#a3e635" aria-checked="true" aria-label="Neon lime"></button>` }
  ],
  api: [
    { name: '.tgl', type: 'class', desc: 'Base switch on an empty <code>&lt;button&gt;</code>.' },
    { name: '.tgl-squish / .tgl-icon / .tgl-neon / .tgl-text / .tgl-bounce', type: 'class', desc: 'Variants.' },
    { name: '.tgl-sm / .tgl-lg', type: 'class', desc: 'Sizes.' },
    { name: 'data-on / data-off', type: 'attr', desc: 'Labels for <code>.tgl-text</code>.' },
    { name: '--on / --w / --h / --knob', type: 'var', desc: 'On color, track size, knob color.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { checked }' }
  ]
});

;
/* docs/registry/fx-like-button.js */
RanjDocs.add({
  id: 'like-button',
  name: 'Like Button',
  group: 'Micro-interactions',
  description: 'A heart that pops, rings and bursts into colorful particles while the count rolls up.',
  tags: ['new', 'fx', 'js'],
  keywords: ['heart', 'favorite', 'like', 'love', 'burst', 'social'],
  demos: [
    { title: 'On a post', height: 360, html: `
<article class="demo-like-post">
  <header><span class="demo-like-av">MK</span><div><b>Maya Kobayashi</b><small>2h · Kyoto</small></div></header>
  <div class="demo-like-img"></div>
  <p>First snow at Kinkaku-ji this morning. Worth the 5am alarm.</p>
  <footer>
    <button class="like-btn" aria-label="Like"><span class="like-btn-count">1,284</span></button>
    <button class="bookmark-btn" aria-label="Save"><span class="bookmark-btn-label"><span>Save</span><span>Saved</span></span></button>
  </footer>
</article>`, css: `
.demo-like-post { width: min(380px, 100%); border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); overflow: hidden; }
.demo-like-post header { display: flex; align-items: center; gap: .65rem; padding: .85rem 1rem; }
.demo-like-post header b { display: block; font-size: .9rem; } .demo-like-post header small { color: var(--muted-fg); font-size: .75rem; }
.demo-like-av { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; font-size: .75rem; font-weight: 700; color: #fff; background: linear-gradient(135deg, #f472b6, #8b5cf6); }
.demo-like-img { height: 150px; background: radial-gradient(40% 50% at 70% 30%, #fff8, transparent), linear-gradient(160deg, #93c5fd, #c4b5fd 50%, #fbcfe8); }
.demo-like-post p { padding: .8rem 1rem .2rem; font-size: .9rem; }
.demo-like-post footer { display: flex; justify-content: space-between; padding: .3rem .5rem .6rem; }` },
    { title: 'Sizes and colors', html: `<button class="like-btn" aria-label="Like"></button>
<button class="like-btn" aria-pressed="true" aria-label="Like"><span class="like-btn-count">42</span></button>
<button class="like-btn like-btn-lg" style="--on:#8b5cf6" aria-label="Like"><span class="like-btn-count">9,999</span></button>` }
  ],
  api: [
    { name: '.like-btn', type: 'class', desc: 'A <code>&lt;button&gt;</code>. The heart is injected; add <code>.like-btn-count</code> for a rolling count.' },
    { name: '.like-btn-lg', type: 'class', desc: 'Larger heart.' },
    { name: 'aria-pressed', type: 'attr', default: 'false', desc: 'Liked state.' },
    { name: '--on', type: 'var', default: '#f43f5e', desc: 'Liked color (particles follow it).' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { pressed }' }
  ]
});

;
/* docs/registry/fx-liquid-glass-menu.js */
RanjDocs.add({
  id: 'liquid-glass-menu',
  name: 'Liquid Glass Menu',
  group: 'Micro-interactions',
  description: 'A frosted glass tab bar or menu with a refracting lens that springs to the selected item and stretches as it moves.',
  tags: ['new', 'fx', 'js'],
  keywords: ['glass', 'tab bar', 'ios 26', 'glassmorphism', 'bottom navigation', 'segmented'],
  demos: [
    { title: 'Tab bar', description: 'Click the tabs, or focus one and use the arrow keys.', pad: false, center: false, height: 340, html: `
<div class="demo-lgm-wall">
  <div class="demo-lgm-feed">
    <div class="demo-lgm-photo" style="--a:#f97316;--b:#db2777"></div>
    <div class="demo-lgm-photo" style="--a:#22d3ee;--b:#6366f1"></div>
    <div class="demo-lgm-photo" style="--a:#a3e635;--b:#059669"></div>
  </div>
  <nav class="lg-menu" aria-label="Main">
    <a class="lg-menu-item" href="#" aria-current="page"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>Home</a>
    <a class="lg-menu-item" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>Search</a>
    <a class="lg-menu-item" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>Library</a>
    <a class="lg-menu-item" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>Profile</a>
  </nav>
</div>`, css: `
.demo-lgm-wall { position: relative; min-height: 340px; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; padding: 1.25rem; background: var(--bg-subtle); }
.demo-lgm-feed { position: absolute; inset: 1rem 1rem 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; }
.demo-lgm-photo { border-radius: 18px; background: radial-gradient(60% 50% at 30% 30%, rgb(255 255 255 / .5), transparent 60%), linear-gradient(160deg, var(--a), var(--b)); }
.demo-lgm-wall .lg-menu { position: relative; z-index: 1; }` },
    { title: 'Vertical menu', pad: false, center: false, height: 340, html: `
<div class="demo-lgm-wall2">
  <nav class="lg-menu lg-menu-vertical" aria-label="Account">
    <button class="lg-menu-item" aria-selected="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>Profile</button>
    <button class="lg-menu-item" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>Billing</button>
    <button class="lg-menu-item" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>Notifications</button>
    <button class="lg-menu-item" aria-selected="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Security</button>
  </nav>
</div>`, css: `
.demo-lgm-wall2 { min-height: 340px; display: grid; place-items: center; padding: 1.5rem; background: radial-gradient(35% 50% at 25% 35%, #fb7185, transparent 70%), radial-gradient(40% 55% at 75% 65%, #60a5fa, transparent 70%), radial-gradient(30% 40% at 55% 20%, #facc15, transparent 70%), var(--bg-subtle); }` }
  ],
  api: [
    { name: '.lg-menu', type: 'class', desc: 'Glass container. Items are <code>.lg-menu-item</code> links or buttons.' },
    { name: '.lg-menu-vertical', type: 'class', desc: 'Stacked menu layout.' },
    { name: '.lg-menu-dark', type: 'class', desc: 'Force the dark glass tint.' },
    { name: 'aria-current / aria-selected', type: 'attr', desc: 'Marks the active item; the lens moves there.' },
    { name: '--lg-tint / --lg-edge / --lg-active', type: 'var', desc: 'Glass tint, edge highlight and active item color.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { item, value }' }
  ]
});

;
/* docs/registry/fx-liquid-glass-toggle.js */
RanjDocs.add({
  id: 'liquid-glass-toggle',
  name: 'Liquid Glass Toggle',
  group: 'Micro-interactions',
  description: 'A switch whose knob turns into a magnifying glass lens while you press it, refracting the track beneath.',
  tags: ['new', 'fx', 'js'],
  keywords: ['ios 26', 'glass switch', 'liquid glass', 'lens', 'switch'],
  demos: [
    { title: 'Press and hold', description: 'Hold the pointer down on a switch to see the lens.', html: `<button class="lg-toggle" aria-label="Wi-Fi"></button>
<button class="lg-toggle" aria-checked="true" aria-label="Bluetooth"></button>
<button class="lg-toggle lg-toggle-lg" aria-checked="true" style="--on:var(--primary)" aria-label="Focus mode"></button>` },
    { title: 'Over a wallpaper', description: '<code>.lg-toggle-glass</code> frosts the track so it works on photos and gradients.', pad: false, center: false, height: 320, html: `
<div class="demo-lgt-wall">
  <div class="demo-lgt-panel">
    <div class="demo-lgt-row"><span>Airplane mode</span><button class="lg-toggle lg-toggle-glass" style="--on:#f59e0b" aria-label="Airplane mode"></button></div>
    <div class="demo-lgt-row"><span>Wi-Fi</span><button class="lg-toggle lg-toggle-glass" aria-checked="true" aria-label="Wi-Fi"></button></div>
    <div class="demo-lgt-row"><span>Do not disturb</span><button class="lg-toggle lg-toggle-glass" style="--on:#8b5cf6" aria-checked="true" aria-label="Do not disturb"></button></div>
  </div>
</div>`, css: `
.demo-lgt-wall { min-height: 320px; display: grid; place-items: center; padding: 2rem 1rem; background: radial-gradient(40% 60% at 20% 30%, #f97316, transparent 70%), radial-gradient(40% 60% at 80% 70%, #6366f1, transparent 70%), radial-gradient(30% 40% at 60% 20%, #ec4899, transparent 70%), linear-gradient(135deg, #0ea5e9, #1e1b4b); }
.demo-lgt-panel { width: min(320px, 100%); padding: .5rem; border-radius: 22px; background: rgb(255 255 255 / .16); -webkit-backdrop-filter: blur(20px) saturate(1.6); backdrop-filter: blur(20px) saturate(1.6); box-shadow: inset 0 1px 1px rgb(255 255 255 / .5), 0 20px 40px rgb(0 0 0 / .25); color: #fff; }
.demo-lgt-row { display: flex; align-items: center; justify-content: space-between; padding: .7rem .8rem; font-weight: 600; font-size: .92rem; }
.demo-lgt-row + .demo-lgt-row { border-top: 1px solid rgb(255 255 255 / .15); }` }
  ],
  api: [
    { name: '.lg-toggle', type: 'class', desc: 'Empty <code>&lt;button&gt;</code>; knob injected by ranj.js.' },
    { name: '.lg-toggle-glass', type: 'class', desc: 'Frosted track for use over imagery.' },
    { name: '.lg-toggle-lg', type: 'class', desc: 'Larger size. Or set <code>--w</code> / <code>--h</code>.' },
    { name: '--on', type: 'var', default: '--success', desc: 'Track color when on.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { checked }' }
  ]
});

;
/* docs/registry/fx-loaders.js */
RanjDocs.add({
  id: 'loaders',
  name: 'Loader Gallery',
  group: 'Loaders',
  description: 'Twenty-plus pure CSS loaders: spinners, dots, bars, shapes, progress bars and skeleton shimmer. Every one follows --size and --color.',
  tags: ['new', 'fx'],
  keywords: ['spinner', 'loading', 'loader', 'activity indicator', 'dots', 'equalizer', 'skeleton', 'progress bar'],
  demos: [
    { title: 'Spinners', html: `
<div class="demo-ld-grid">
  <figure><span class="loader-ring" role="status" aria-label="Loading"></span><figcaption>ring</figcaption></figure>
  <figure><span class="loader-dual-ring" role="status" aria-label="Loading"></span><figcaption>dual-ring</figcaption></figure>
  <figure><span class="loader-arc" role="status" aria-label="Loading"></span><figcaption>arc</figcaption></figure>
  <figure><span class="loader-orbit" role="status" aria-label="Loading"><i></i></span><figcaption>orbit</figcaption></figure>
  <figure><span class="loader-ripple" role="status" aria-label="Loading"></span><figcaption>ripple</figcaption></figure>
  <figure><span class="loader-blades" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><figcaption>blades</figcaption></figure>
  <figure><span class="loader-clock" role="status" aria-label="Loading"></span><figcaption>clock</figcaption></figure>
  <figure><span class="loader-hourglass" role="status" aria-label="Loading"></span><figcaption>hourglass</figcaption></figure>
  <figure><span class="loader-square" role="status" aria-label="Loading"></span><figcaption>square</figcaption></figure>
</div>`, css: `
.demo-ld-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: .75rem; width: 760px; max-width: 100%; }
.demo-ld-grid figure { margin: 0; display: grid; justify-items: center; align-content: center; gap: .9rem; height: 120px; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); }
.demo-ld-grid figcaption { font: 500 .72rem var(--font-mono); color: var(--muted-fg); }` },
    { title: 'Dots and shapes', html: `
<div class="demo-ld-grid">
  <figure><span class="loader-dots" role="status" aria-label="Loading"><i></i><i></i><i></i></span><figcaption>dots-bounce</figcaption></figure>
  <figure><span class="loader-dots-pulse" role="status" aria-label="Loading"><i></i><i></i><i></i></span><figcaption>dots-pulse</figcaption></figure>
  <figure><span class="loader-dots-wave" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i><i></i></span><figcaption>dots-wave</figcaption></figure>
  <figure><span class="typing typing-bubble" role="status" aria-label="Typing"><i></i><i></i><i></i></span><figcaption>typing</figcaption></figure>
  <figure><span class="loader-bars" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i><i></i></span><figcaption>bars</figcaption></figure>
  <figure><span class="loader-cube" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i></span><figcaption>folding-cube</figcaption></figure>
  <figure><span class="loader-dot-grid" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><figcaption>dot-grid</figcaption></figure>
  <figure><span class="loader-chomp" role="status" aria-label="Loading" style="--size:30px"><i></i><i></i><i></i></span><figcaption>chomp</figcaption></figure>
  <figure><span class="loader-helix" role="status" aria-label="Loading"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><figcaption>helix</figcaption></figure>
  <figure><span class="loader-infinite" style="--size:32px"></span><figcaption>infinite</figcaption></figure>
  <figure><span class="loader-pie" data-indeterminate style="--size:36px"></span><figcaption>pie</figcaption></figure>
  <figure><span class="spin-success" style="--size:40px"></span><figcaption>spin-success</figcaption></figure>
</div>` },
    { title: 'Animated progress bars', html: `
<div style="width:440px;max-width:100%;display:grid;gap:1.1rem">
  <div><small class="demo-ld-lbl">Gradient flow</small><div class="loader-bar loader-bar-gradient" style="--p:72"><i></i></div></div>
  <div><small class="demo-ld-lbl">Striped</small><div class="loader-bar loader-bar-striped" style="--p:48;--h:12px"><i></i></div></div>
  <div><small class="demo-ld-lbl">Glow</small><div class="loader-bar loader-bar-glow" style="--p:63;--h:6px"><i></i></div></div>
  <div><small class="demo-ld-lbl">Shimmer</small><div class="loader-bar loader-bar-shimmer" style="--p:85;--color:var(--success)"><i></i></div></div>
  <div><small class="demo-ld-lbl">Indeterminate</small><div class="loader-bar loader-bar-indeterminate" style="--h:4px" role="progressbar" aria-label="Loading"><i></i></div></div>
</div>`, css: `.demo-ld-lbl { display: block; margin-bottom: .35rem; font-size: .75rem; color: var(--muted-fg); font-weight: 600; }` },
    { title: 'Skeleton shimmer', description: 'A wave of light sweeps across placeholder shapes while content loads.', height: 280, html: `
<div style="width:420px;max-width:100%;display:grid;gap:1rem">
  <div style="display:flex;gap:.8rem;align-items:center;padding:1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
    <span class="loader-skel loader-skel-circle" style="width:44px;height:44px;flex:none"></span>
    <div style="flex:1;display:grid;gap:.5rem"><span class="loader-skel loader-skel-text" style="width:55%"></span><span class="loader-skel loader-skel-text" style="width:85%"></span></div>
  </div>
  <div style="padding:1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);display:grid;gap:.6rem">
    <span class="loader-skel" style="height:120px;border-radius:var(--radius-lg)"></span>
    <span class="loader-skel loader-skel-text" style="width:70%"></span><span class="loader-skel loader-skel-text" style="width:40%"></span>
  </div>
</div>` },
    { title: 'Colors and sizes', html: `
<span class="loader-ring" style="--size:20px;--thick:3px"></span>
<span class="loader-ring" style="--size:32px;--color:var(--success)"></span>
<span class="loader-ring" style="--size:48px;--thick:6px;--color:#f43f5e"></span>
<span class="loader-bars" style="--size:24px;--color:var(--warning)"><i></i><i></i><i></i><i></i><i></i></span>
<span class="loader-dots" style="--size:28px;--color:var(--fg)"><i></i><i></i><i></i></span>
<button class="btn" disabled style="gap:.6rem"><span class="loader-ring" style="--size:16px;--thick:2.5px;--color:currentColor"></span>Saving</button>` }
  ],
  api: [
    { name: '.loader-ring / -dual-ring / -arc / -orbit / -ripple / -clock / -hourglass / -square', type: 'class', desc: 'Single-element spinners (<code>.loader-orbit</code> takes one <code>&lt;i&gt;</code>).' },
    { name: '.loader-blades', type: 'class', desc: '8 <code>&lt;i&gt;</code> children.' },
    { name: '.loader-dots / -dots-pulse', type: 'class', desc: '3 <code>&lt;i&gt;</code>. <code>.loader-dots-wave</code> takes 5.' },
    { name: '.loader-bars', type: 'class', desc: '5 <code>&lt;i&gt;</code> equalizer bars.' },
    { name: '.loader-cube / .loader-dot-grid / .loader-chomp / .loader-helix', type: 'class', desc: '4, 9, 3 and 8 <code>&lt;i&gt;</code> children.' },
    { name: '.loader-bar (+ -gradient -striped -glow -shimmer -indeterminate)', type: 'class', desc: 'Progress bar with an <code>&lt;i&gt;</code> fill. Value via <code>--p</code> (0..100) or <code>Ranj.progress(el, v)</code>.' },
    { name: '.loader-skel (+ -circle -text)', type: 'class', desc: 'Skeleton block with a light wave.' },
    { name: '--size / --color / --thick', type: 'var', default: '40px / --primary / 4px', desc: 'Every loader follows these.' }
  ]
});

;
/* docs/registry/fx-loading-bar.js */
RanjDocs.add({
  id: 'loading-bar',
  name: 'Page Loading Bar',
  group: 'Loaders',
  description: 'A slim glowing bar across the top of the page that trickles forward while you load, then finishes and fades. NProgress-style API.',
  tags: ['new', 'fx', 'js'],
  keywords: ['nprogress', 'top bar', 'route loading', 'page progress', 'youtube bar'],
  demos: [
    { title: 'In a browser window', description: 'Uses <code>Ranj.loadingBar.create({ parent })</code> so the bar stays inside the demo. The global <code>Ranj.loadingBar</code> sits at the top of the viewport.', height: 300, center: false, html: `
<div class="demo-lb-win">
  <div class="demo-lb-chrome"><i></i><i></i><i></i><span>acme.app/dashboard</span></div>
  <div class="demo-lb-page">
    <div style="display:flex;gap:.5rem;flex-wrap:wrap"><button class="btn btn-sm" data-lb="start">Start</button><button class="btn btn-sm btn-outline" data-lb="inc">Inc</button><button class="btn btn-sm btn-outline" data-lb="done">Done</button><button class="btn btn-sm btn-ghost" data-lb="global">Try the real one</button></div>
    <span class="loader-skel loader-skel-text" style="width:60%;margin-top:1rem"></span><span class="loader-skel loader-skel-text" style="width:85%"></span><span class="loader-skel loader-skel-text" style="width:40%"></span>
  </div>
</div>`, css: `
.demo-lb-win { width: min(560px, calc(100% - 2rem)); margin: 1.5rem auto; border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden; background: var(--card); box-shadow: var(--shadow-lg); }
.demo-lb-chrome { display: flex; align-items: center; gap: .35rem; padding: .55rem .8rem; border-bottom: 1px solid var(--border); background: var(--bg-subtle); }
.demo-lb-chrome i { width: 10px; height: 10px; border-radius: 50%; background: var(--border-strong); }
.demo-lb-chrome span { margin-left: .6rem; font-size: .75rem; color: var(--muted-fg); padding: .15rem .6rem; border-radius: 99px; background: var(--bg); flex: 1; }
.demo-lb-page { position: relative; padding: 1.2rem; display: grid; gap: .5rem; min-height: 170px; align-content: start; }`, js: `
var bar = Ranj.loadingBar.create({ parent: root.querySelector('.demo-lb-page') });
root.querySelectorAll('[data-lb]').forEach(function (b) { b.onclick = function () {
  var a = b.getAttribute('data-lb');
  if (a === 'global') { Ranj.loadingBar.start(); setTimeout(function () { Ranj.loadingBar.done(); }, 2200); return; }
  bar[a]();
}; });
bar.start(); var t = setTimeout(function () { bar.done(); }, 2400);
return function () { clearTimeout(t); bar.done(); };` }
  ],
  api: [
    { name: 'Ranj.loadingBar.start()', type: 'js', desc: 'Show the bar and trickle forward.' },
    { name: 'Ranj.loadingBar.set(p) / inc([amount])', type: 'js', desc: 'Jump to 0..1, or nudge forward.' },
    { name: 'Ranj.loadingBar.done()', type: 'js', desc: 'Complete and fade out.' },
    { name: 'Ranj.loadingBar.create({ parent, color, height })', type: 'js', desc: 'An independent bar inside a container.' },
    { name: '.loading-bar', type: 'class', desc: 'Style hook. <code>--color</code>, <code>--h</code> (default 3px).' }
  ]
});

;
/* docs/registry/fx-morph-icons.js */
RanjDocs.add({
  id: 'morph-icons',
  name: 'Morph Icons',
  group: 'Micro-interactions',
  description: 'Icons that morph between two states: play and pause, plus and close, chevron, search and close, volume and mute, and a three-step weather icon.',
  tags: ['new', 'fx', 'js'],
  keywords: ['morph', 'play pause', 'icon animation', 'weather icon', 'toggle icon'],
  demos: [
    { title: 'Toggle icons', description: 'Click to morph.', html: `
<button class="morph-icon morph-icon-solid" data-morph="play-pause"></button>
<button class="morph-icon" data-morph="plus-close"></button>
<button class="morph-icon" data-morph="chevron"></button>
<button class="morph-icon" data-morph="search-close"></button>
<button class="morph-icon" data-morph="volume"></button>` },
    { title: 'Weather: sun, cloud, rain', description: 'Click to cycle through the three states.', html: `
<button class="morph-icon" data-morph="weather" style="--size:44px"></button>
<button class="morph-icon" data-morph="weather" data-state="cloud" style="--size:44px"></button>
<button class="morph-icon" data-morph="weather" data-state="rain" style="--size:44px"></button>` },
    { title: 'Mini player', height: 200, html: `
<div style="width:min(380px,100%);display:flex;align-items:center;gap:.9rem;padding:.75rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <div style="width:52px;height:52px;flex:none;border-radius:var(--radius-lg);background:linear-gradient(135deg,#f472b6,#6366f1)"></div>
  <div style="flex:1;min-width:0"><b style="display:block;font-size:.92rem">Midnight Drive</b><small style="color:var(--muted-fg)">Kavinsky Echoes · 3:42</small></div>
  <button class="morph-icon" data-morph="volume" style="--size:18px;background:transparent"></button>
  <button class="morph-icon morph-icon-solid" data-morph="play-pause" aria-pressed="true" style="--size:18px"></button>
</div>` }
  ],
  api: [
    { name: '.morph-icon', type: 'class', desc: 'Button; inner shapes injected from <code>data-morph</code>.' },
    { name: 'data-morph', type: 'attr', default: 'play-pause', desc: '<code>play-pause plus-close chevron search-close volume weather</code>.' },
    { name: 'aria-pressed', type: 'attr', desc: 'Second state for two-state icons. <code>aria-label</code> updates automatically.' },
    { name: 'data-state', type: 'attr', default: 'sun', desc: 'Weather state: <code>sun cloud rain</code>.' },
    { name: '.morph-icon-solid', type: 'class', desc: 'Filled accent background.' },
    { name: '--size / --speed', type: 'var', default: '22px / .45s', desc: 'Icon size and morph duration.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { pressed } or { state }' }
  ]
});

;
/* docs/registry/fx-notification-bell.js */
RanjDocs.add({
  id: 'notification-bell',
  name: 'Notification Bell',
  group: 'Micro-interactions',
  description: 'A bell that swings with a lagging clapper and a badge that bumps and pings when new notifications arrive.',
  tags: ['new', 'fx', 'js'],
  keywords: ['bell', 'notifications', 'badge', 'inbox', 'alert', 'ring'],
  demos: [
    { title: 'In a header', description: 'Simulate incoming notifications; clicking the bell marks them read.', height: 220, html: `
<div style="width:min(460px,100%);display:flex;align-items:center;justify-content:space-between;padding:.6rem .8rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <b style="padding-left:.3rem">Acme Cloud</b>
  <div style="display:flex;align-items:center;gap:.5rem">
    <button class="btn btn-outline btn-sm" data-demo-notify>Simulate notification</button>
    <button class="bell" data-count="2" aria-label="Notifications"></button>
  </div>
</div>`, js: `
var bell = root.querySelector('.bell');
root.querySelector('[data-demo-notify]').onclick = function () { Ranj.bell(bell, (+bell.getAttribute('data-count') || 0) + 1); };
bell.onclick = function () { Ranj.bell(bell, 0); };` },
    { title: 'Sizes', html: `<button class="bell" style="--size:18px" data-count="1" aria-label="Notifications"></button>
<button class="bell" data-count="12" aria-label="Notifications"></button>
<button class="bell" style="--size:30px;--on:var(--primary)" data-count="128" aria-label="Notifications"></button>` }
  ],
  api: [
    { name: '.bell', type: 'class', desc: 'A <code>&lt;button&gt;</code>; icon and badge injected. Rings on hover.' },
    { name: 'data-count', type: 'attr', default: '0', desc: 'Initial unread count.' },
    { name: 'Ranj.bell(el, n)', type: 'js', desc: 'Set the count. Rings and bumps the badge when it increases. Updates <code>aria-label</code>.' },
    { name: '--size / --on', type: 'var', default: '22px / --destructive', desc: 'Icon size and badge color.' }
  ]
});

;
/* docs/registry/fx-odometer.js */
RanjDocs.add({
  id: 'odometer',
  name: 'Odometer',
  group: 'Micro-interactions',
  description: 'A rolling digit counter. Each digit spins on its own strip with a slight stagger, and separators stay put.',
  tags: ['new', 'fx', 'js'],
  keywords: ['counter', 'number animation', 'rolling numbers', 'ticker', 'slot', 'count up'],
  demos: [
    { title: 'Live revenue', description: 'Counts up from <code>data-from</code> when it scrolls into view.', height: 260, html: `
<div style="display:grid;justify-items:center;gap:.3rem;text-align:center">
  <small style="color:var(--muted-fg);font-weight:600;letter-spacing:.08em;text-transform:uppercase">Revenue this month</small>
  <span class="odometer" data-from="0" data-value="1284930.55" data-prefix="$" style="font-size:clamp(2.2rem,6vw,3.6rem);font-weight:800;letter-spacing:-.04em"></span>
  <button class="btn btn-outline btn-sm" data-demo-odo style="margin-top:.6rem">Add a sale</button>
</div>`, js: `
var o = root.querySelector('.odometer'), v = 1284930.55;
root.querySelector('[data-demo-odo]').onclick = function () { v += Math.round(Math.random() * 90000) / 100 + 40; Ranj.odometer(o, v); };` },
    { title: 'Stats row', height: 220, html: `
<div style="display:flex;flex-wrap:wrap;gap:2.5rem;justify-content:center;text-align:center">
  <div><span class="odometer" data-from="0" data-value="48200" style="font-size:2.2rem;font-weight:800"></span><div style="color:var(--muted-fg);font-size:.85rem">Developers</div></div>
  <div><span class="odometer" data-from="0" data-value="99.98" data-suffix="%" style="font-size:2.2rem;font-weight:800"></span><div style="color:var(--muted-fg);font-size:.85rem">Uptime</div></div>
  <div><span class="odometer" data-from="0" data-value="312" style="font-size:2.2rem;font-weight:800;color:var(--primary)"></span><div style="color:var(--muted-fg);font-size:.85rem">Components</div></div>
</div>` }
  ],
  api: [
    { name: '.odometer', type: 'class', desc: 'Any inline element.' },
    { name: 'data-value', type: 'attr', desc: 'Number to show.' },
    { name: 'data-from', type: 'attr', desc: 'Start here and roll to the value when scrolled into view.' },
    { name: 'data-decimals', type: 'attr', default: 'auto', desc: 'Fixed decimal places.' },
    { name: 'data-prefix / data-suffix', type: 'attr', desc: 'Static text, e.g. <code>$</code> or <code>%</code>.' },
    { name: 'data-format', type: 'attr', default: 'grouped', desc: '<code>none</code> to skip thousands separators.' },
    { name: '--odo-dur', type: 'var', default: '1.4s', desc: 'Roll duration.' },
    { name: 'Ranj.odometer(el, value)', type: 'js', desc: 'Roll to a new value.' }
  ]
});

;
/* docs/registry/fx-progress-donut.js */
RanjDocs.add({
  id: 'progress-donut',
  name: 'Progress Donut',
  group: 'Loaders',
  description: 'A ring with the percentage in the middle. Optional gradient stroke; values animate when they scroll into view.',
  tags: ['new', 'fx', 'js'],
  keywords: ['donut', 'ring progress', 'radial progress', 'percentage', 'circular progress'],
  demos: [
    { title: 'Values', html: `
<span class="loader-donut" data-value="24"></span>
<span class="loader-donut loader-donut-gradient" data-value="68"></span>
<span class="loader-donut" data-value="92" style="--color:var(--success);--thick:6px"></span>
<span class="loader-donut" data-value="8" style="--color:var(--destructive);--size:56px"></span>` },
    { title: 'Storage card', height: 280, html: `
<div style="width:min(360px,100%);display:flex;align-items:center;gap:1.2rem;padding:1.25rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <span class="loader-donut loader-donut-gradient" data-value="73" style="--size:96px;--thick:10px" aria-label="Storage used"></span>
  <div><b style="font-size:1.05rem">73 GB of 100 GB</b><p style="color:var(--muted-fg);font-size:.85rem;margin:.2rem 0 .7rem">Photos are using most of your space.</p><button class="btn btn-sm btn-outline" data-demo-free>Free up space</button></div>
</div>`, js: `
var d = root.querySelector('.loader-donut'), b = root.querySelector('b');
root.querySelector('[data-demo-free]').onclick = function () { Ranj.progress(d, 41); b.textContent = '41 GB of 100 GB'; };` }
  ],
  api: [
    { name: '.loader-donut', type: 'class', desc: 'Ring progress with a centered label (auto-added).' },
    { name: '.loader-donut-gradient', type: 'class', desc: 'Gradient stroke.' },
    { name: 'data-value', type: 'attr', default: '0', desc: '0..100.' },
    { name: 'data-no-label', type: 'attr', desc: 'Hide the percentage text.' },
    { name: '--size / --thick / --color', type: 'var', default: '72px / 8px / --primary', desc: 'Geometry and color.' },
    { name: 'Ranj.progress(el, value)', type: 'js', desc: 'Set the value.' }
  ]
});

;
/* docs/registry/fx-progress-pie.js */
RanjDocs.add({
  id: 'progress-pie',
  name: 'Progress Pie',
  group: 'Loaders',
  description: 'A filled pie that sweeps smoothly to its value. Handy inline next to file names, tasks and uploads.',
  tags: ['new', 'fx', 'js'],
  keywords: ['pie', 'progress circle', 'conic', 'upload progress'],
  demos: [
    { title: 'Values', html: `
<span class="loader-pie" data-value="12"></span>
<span class="loader-pie" data-value="38" style="--color:var(--info)"></span>
<span class="loader-pie" data-value="67" style="--color:var(--warning)"></span>
<span class="loader-pie" data-value="100" style="--color:var(--success)"></span>
<span class="loader-pie" data-indeterminate aria-label="Loading"></span>` },
    { title: 'Upload queue', height: 280, html: `
<div style="width:min(380px,100%);border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <div class="demo-pie-row"><span class="loader-pie" data-value="100" style="--size:22px;--color:var(--success)"></span><span>brand-guidelines.pdf</span><small>Done</small></div>
  <div class="demo-pie-row"><span class="loader-pie" data-value="45" style="--size:22px"></span><span>launch-video-final.mp4</span><small class="demo-pie-pct">45%</small></div>
  <div class="demo-pie-row"><span class="loader-pie" data-value="0" style="--size:22px"></span><span>press-kit.zip</span><small>Queued</small></div>
</div>`, css: `
.demo-pie-row { display: flex; align-items: center; gap: .75rem; padding: .75rem 1rem; font-size: .9rem; }
.demo-pie-row + .demo-pie-row { border-top: 1px solid var(--border); }
.demo-pie-row span:nth-child(2) { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.demo-pie-row small { color: var(--muted-fg); font-variant-numeric: tabular-nums; }`, js: `
var pie = root.querySelectorAll('.loader-pie')[1], pct = root.querySelector('.demo-pie-pct'), v = 45;
var t = setInterval(function () { v = v >= 100 ? 0 : Math.min(100, v + 7); Ranj.progress(pie, v); pct.textContent = v + '%'; }, 700);
return function () { clearInterval(t); };` }
  ],
  api: [
    { name: '.loader-pie', type: 'class', desc: 'Pie progress, <code>role="progressbar"</code>.' },
    { name: 'data-value', type: 'attr', default: '0', desc: '0..100, animated in when visible.' },
    { name: 'data-indeterminate', type: 'attr', desc: 'Spinning quarter for unknown progress.' },
    { name: '--size / --color', type: 'var', default: '48px / --primary', desc: 'Size and color.' },
    { name: 'Ranj.progress(el, value)', type: 'js', desc: 'Set the value.' }
  ]
});

;
/* docs/registry/fx-reaction-button.js */
RanjDocs.add({
  id: 'reaction-button',
  name: 'Reaction Button',
  group: 'Micro-interactions',
  description: 'Hover (or long-press on touch) to pop up an emoji picker. Emojis spring in one by one and grow under the cursor.',
  tags: ['new', 'fx', 'js'],
  keywords: ['emoji', 'reactions', 'react', 'like picker', 'emoji picker'],
  demos: [
    { title: 'On a comment', description: 'Hover the Like button, or focus it and press the up arrow.', height: 300, html: `
<div style="width:min(420px,100%);padding:1rem 1.1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <div style="display:flex;gap:.65rem;align-items:flex-start">
    <span style="width:34px;height:34px;flex:none;border-radius:50%;background:linear-gradient(135deg,#34d399,#0ea5e9)"></span>
    <div><b style="font-size:.9rem">Diego Alvarez</b><p style="font-size:.9rem;margin-top:.15rem">Just shipped the new onboarding flow. Activation is up 18% in the first week!</p></div>
  </div>
  <div style="display:flex;gap:.25rem;margin-top:.6rem;margin-left:2.6rem">
    <div class="reaction"><button class="reaction-trigger"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm0 0 4-7a2.5 2.5 0 0 1 3 3l-1 4h6a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 16.8 21H7"/></svg>Like</button></div>
    <button class="btn btn-ghost btn-sm">Reply</button>
  </div>
</div>` },
    { title: 'Custom set', description: 'Pass your own reactions as JSON.', html: `
<div class="reaction" data-reactions='[{"e":"🚀","l":"Ship it","c":"#8b5cf6"},{"e":"👀","l":"Looking","c":"#0ea5e9"},{"e":"✅","l":"Done","c":"#10b981"},{"e":"🎉","l":"Party","c":"#f59e0b"}]'>
  <button class="reaction-trigger"><span class="reaction-emoji">🙂</span>React</button>
</div>` }
  ],
  api: [
    { name: '.reaction', type: 'class', desc: 'Wrapper around a <code>.reaction-trigger</code> button.' },
    { name: 'data-reactions', type: 'attr', desc: 'JSON array of <code>{ e, l, c }</code> (emoji, label, color). The first one is used on a plain click.' },
    { name: 'Keyboard', type: 'js', desc: 'Up or Down arrow opens the picker, Left/Right moves, Enter picks, Escape closes.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { reaction, emoji } (null when cleared)' }
  ]
});

;
/* docs/registry/fx-search-reveal.js */
RanjDocs.add({
  id: 'search-reveal',
  name: 'Search Reveal',
  group: 'Micro-interactions',
  description: 'A search icon that springs open into a full search field. Escape or blurring while empty closes it again.',
  tags: ['new', 'fx', 'js'],
  keywords: ['search bar', 'expanding search', 'search icon', 'collapsible search'],
  demos: [
    { title: 'Default', description: 'Click the magnifier. Press / anywhere on the page to open it too.', html: `
<div class="search-reveal" data-shortcut="/">
  <button class="search-reveal-btn"></button>
  <input class="search-reveal-input" type="search" placeholder="Search docs, components…">
  <kbd class="search-reveal-kbd">/</kbd>
  <button class="search-reveal-clear"></button>
</div>` },
    { title: 'In a toolbar', height: 220, html: `
<div style="width:520px;max-width:100%;display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.5rem .6rem .5rem 1rem;border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card)">
  <b>Inbox <span style="color:var(--muted-fg);font-weight:500">· 24</span></b>
  <div class="search-reveal" style="--open:min(280px, 60vw);--h:38px;--closed:38px">
    <button class="search-reveal-btn"></button>
    <input class="search-reveal-input" type="search" placeholder="Search mail">
    <button class="search-reveal-clear"></button>
  </div>
</div>` }
  ],
  api: [
    { name: '.search-reveal', type: 'class', desc: 'Wrapper with <code>.search-reveal-btn</code>, <code>.search-reveal-input</code>, optional <code>.search-reveal-kbd</code> and <code>.search-reveal-clear</code>.' },
    { name: 'data-state', type: 'attr', default: 'closed', desc: '<code>open</code> to start expanded.' },
    { name: 'data-shortcut', type: 'attr', desc: 'Key that opens it from anywhere, e.g. <code>/</code>.' },
    { name: 'data-keep-open', type: 'attr', desc: 'Do not collapse on blur.' },
    { name: '--open / --closed / --h', type: 'var', default: '300px / 44px / 44px', desc: 'Widths and height.' },
    { name: 'ranj:search', type: 'event', desc: 'detail: { query } on Enter.' },
    { name: 'ranj:open / ranj:close', type: 'event', desc: 'Fired on toggle.' }
  ]
});

;
/* docs/registry/fx-send-button.js */
RanjDocs.add({
  id: 'send-button',
  name: 'Send Button',
  group: 'Micro-interactions',
  description: 'The paper plane takes off with a light trail, loops out of the button, and a check lands in its place.',
  tags: ['new', 'fx', 'js'],
  keywords: ['send', 'paper plane', 'submit', 'message sent', 'email'],
  demos: [
    { title: 'Default', html: `
<button class="fxb send-btn"><span class="fxb-icon"><svg class="fxb-plane" viewBox="0 0 24 24"><path d="M21.5 2.5 10.5 13.5"/><path d="M21.5 2.5 14.5 21.5l-4-8-8-4z"/></svg><svg class="fxb-check" viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="fxb-texts"><span data-for="idle">Send message</span><span data-for="busy">Sending</span><span data-for="done">Sent</span></span></button>` },
    { title: 'In a composer', height: 300, html: `
<div style="width:min(420px,100%);border:1px solid var(--border);border-radius:var(--radius-xl);background:var(--card);overflow:hidden">
  <div style="padding:.7rem 1rem;border-bottom:1px solid var(--border);font-size:.85rem;color:var(--muted-fg)">To: <b style="color:var(--fg)">priya@northwind.io</b></div>
  <div style="padding:1rem;font-size:.92rem;min-height:96px">Hi Priya, the Q4 deck is attached. Let me know if the revenue slide needs another pass before Friday.</div>
  <div style="display:flex;justify-content:flex-end;padding:.6rem .75rem;border-top:1px solid var(--border)">
    <button class="fxb send-btn" style="height:var(--control-h)"><span class="fxb-icon"><svg class="fxb-plane" viewBox="0 0 24 24"><path d="M21.5 2.5 10.5 13.5"/><path d="M21.5 2.5 14.5 21.5l-4-8-8-4z"/></svg><svg class="fxb-check" viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="fxb-texts"><span data-for="idle">Send</span><span data-for="busy">Sending</span><span data-for="done">Sent</span></span></button>
  </div>
</div>` }
  ],
  api: [
    { name: '.fxb.send-btn', type: 'class', desc: 'Stateful button. Contains <code>.fxb-icon</code> (plane + check) and <code>.fxb-texts</code>.' },
    { name: '.fxb-texts > [data-for]', type: 'class', desc: 'One span per state: <code>idle busy done error</code>. Announced politely to screen readers.' },
    { name: 'data-duration', type: 'attr', default: '1100', desc: 'Simulated send time (ms).' },
    { name: 'data-manual', type: 'attr', desc: 'Stay busy until you call <code>Ranj.fxButton.done(el)</code> or <code>.error(el)</code>.' },
    { name: 'data-reset', type: 'attr', default: '2600', desc: 'Return to idle after this many ms; 0 keeps the done state.' },
    { name: 'Ranj.fxButton', type: 'js', desc: '<code>start(el) progress(el, 0..1) done(el) error(el) reset(el)</code>' },
    { name: 'ranj:start / ranj:done', type: 'event', desc: 'start is cancelable: call preventDefault() to stop it.' }
  ]
});

;
/* docs/registry/fx-spinner-success.js */
RanjDocs.add({
  id: 'spinner-success',
  name: 'Spinner to Success',
  group: 'Loaders',
  description: 'A spinning arc that closes into a full circle, fills, and draws a check (or an X for errors).',
  tags: ['new', 'fx', 'js'],
  keywords: ['success animation', 'loading to done', 'checkmark', 'spinner check', 'complete'],
  demos: [
    { title: 'Play it', height: 260, html: `
<span class="spin-success" style="--size:72px"></span>
<div style="display:grid;gap:.4rem">
  <button class="btn btn-sm" data-ss="success">Succeed</button>
  <button class="btn btn-sm btn-outline" data-ss="error">Fail</button>
  <button class="btn btn-sm btn-ghost" data-ss="loading">Restart</button>
</div>`, js: `
var s = root.querySelector('.spin-success');
root.querySelectorAll('[data-ss]').forEach(function (b) { b.onclick = function () { Ranj.spinSuccess(s, b.getAttribute('data-ss')); }; });` },
    { title: 'Upload complete', height: 280, html: `
<div style="width:min(340px,100%);display:grid;justify-items:center;gap:.6rem;padding:1.6rem;text-align:center;border:1px solid var(--border);border-radius:var(--radius-2xl);background:var(--card)">
  <span class="spin-success" data-auto="1800" style="--size:56px"></span>
  <b>Uploading 3 photos</b><small style="color:var(--muted-fg)">IMG_2041.heic, IMG_2042.heic, IMG_2050.heic</small>
</div>`, js: `
var s = root.querySelector('.spin-success'), b = root.querySelector('b');
s.addEventListener('ranj:change', function (e) { if (e.detail.state === 'success') b.textContent = 'Uploaded 3 photos'; });` }
  ],
  api: [
    { name: '.spin-success', type: 'class', desc: 'Empty element; SVG injected. <code>role="status"</code> with a label that follows the state.' },
    { name: 'data-state', type: 'attr', default: 'loading', desc: '<code>loading success error</code>.' },
    { name: 'data-auto / data-auto-state', type: 'attr', desc: 'Switch to a state automatically after N ms (demo helper).' },
    { name: '--size / --color / --ok / --bad', type: 'var', desc: 'Size and colors.' },
    { name: 'Ranj.spinSuccess(el, state)', type: 'js', desc: 'Change state; loading restarts the spinner.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { state }' }
  ]
});

;
/* docs/registry/fx-status-dot.js */
RanjDocs.add({
  id: 'status-dot',
  name: 'Status Dot',
  group: 'Micro-interactions',
  description: 'Presence dots for online, away, busy and offline, with a soft pulse for live states. Pin one to an avatar.',
  tags: ['new', 'fx'],
  keywords: ['presence', 'online', 'away', 'busy', 'offline', 'avatar status', 'live'],
  demos: [
    { title: 'States', html: `
<span class="status-pill"><span class="status-dot" data-status="online"></span>Online</span>
<span class="status-pill"><span class="status-dot" data-status="away"></span>Away</span>
<span class="status-pill"><span class="status-dot" data-status="busy"></span>Do not disturb</span>
<span class="status-pill"><span class="status-dot" data-status="offline"></span>Offline</span>` },
    { title: 'On avatars', html: `
<span class="status-anchor"><span style="display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#6366f1);color:#fff;font-weight:700">AK</span><span class="status-dot" data-status="online" aria-label="Online" style="--size:12px"></span></span>
<span class="status-anchor"><span style="display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f97316);color:#fff;font-weight:700">JR</span><span class="status-dot" data-status="away" aria-label="Away" style="--size:12px"></span></span>
<span class="status-anchor"><span style="display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#34d399,#0ea5e9);color:#fff;font-weight:700">SN</span><span class="status-dot" data-status="busy" aria-label="Busy" style="--size:12px"></span></span>
<span class="status-anchor"><span style="display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:var(--muted);color:var(--muted-fg);font-weight:700">TB</span><span class="status-dot" data-status="offline" aria-label="Offline" style="--size:12px"></span></span>` },
    { title: 'Live badge', html: `<span class="status-pill" style="color:var(--destructive);border-color:color-mix(in oklab,var(--destructive) 30%,transparent)"><span class="status-dot" data-status="busy" style="--c:var(--destructive)"></span>LIVE · 2.4k watching</span>
<span class="status-pill"><span class="status-dot"></span>All systems operational</span>` }
  ],
  api: [
    { name: '.status-dot', type: 'class', desc: 'The dot. Add <code>aria-label</code> when it is the only indicator.' },
    { name: 'data-status', type: 'attr', default: 'online', desc: '<code>online away busy offline</code>.' },
    { name: '.status-dot-static', type: 'class', desc: 'No pulse.' },
    { name: '.status-anchor', type: 'class', desc: 'Wrap an avatar to pin the dot to its corner.' },
    { name: '.status-pill', type: 'class', desc: 'Dot with a label.' },
    { name: '--c / --size', type: 'var', desc: 'Color and size.' }
  ]
});

;
/* docs/registry/fx-subscribe-input.js */
RanjDocs.add({
  id: 'subscribe-input',
  name: 'Subscribe Input',
  group: 'Micro-interactions',
  description: 'An email field whose button stretches across it with a spinner, then turns into a success message. Invalid emails shake.',
  tags: ['new', 'fx', 'js'],
  keywords: ['newsletter', 'email signup', 'subscribe', 'waitlist', 'form'],
  demos: [
    { title: 'Newsletter', description: 'Try an invalid email first, then a real one.', height: 260, html: `
<div style="display:grid;justify-items:center;gap:.9rem;text-align:center;width:min(440px,100%)">
  <b style="font-size:1.2rem">Get the Friday digest</b>
  <p style="color:var(--muted-fg);font-size:.9rem;margin-top:-.4rem">One email a week with the best new components. No spam.</p>
  <form class="subscribe" novalidate>
    <input class="subscribe-input" type="email" placeholder="you@company.com" aria-label="Email address" autocomplete="email">
    <button class="subscribe-btn"><span>Subscribe</span><div class="subscribe-success"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>You're in! Check your inbox.</div></button>
  </form>
</div>` },
    { title: 'Your own backend', description: 'With <code>data-manual</code>, listen for <code>ranj:subscribe</code> and call <code>done()</code> or <code>fail(msg)</code>.', height: 200, html: `
<form class="subscribe" data-manual novalidate>
  <input class="subscribe-input" type="email" placeholder="Join the waitlist" aria-label="Email address">
  <button class="subscribe-btn"><span>Join waitlist</span><div class="subscribe-success"><svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>You're #1,284 on the list</div></button>
</form>`, js: `
root.querySelector('.subscribe').addEventListener('ranj:subscribe', function (e) {
  setTimeout(function () { /taken/.test(e.detail.email) ? e.detail.fail('That email is already on the list.') : e.detail.done(); }, 900);
});` }
  ],
  api: [
    { name: '.subscribe', type: 'class', desc: 'A <code>&lt;form&gt;</code> with <code>.subscribe-input</code>, <code>.subscribe-btn</code> and an optional <code>.subscribe-success</code>.' },
    { name: 'data-manual', type: 'attr', desc: 'Wait for <code>detail.done()</code> / <code>detail.fail(msg)</code> instead of auto success.' },
    { name: 'data-delay', type: 'attr', default: '1300', desc: 'Simulated request time (ms).' },
    { name: 'data-invalid', type: 'attr', desc: 'Custom invalid email message.' },
    { name: 'Ranj.subscribe.reset(el)', type: 'js', desc: 'Back to the empty idle state.' },
    { name: 'ranj:subscribe', type: 'event', desc: 'detail: { email, done(), fail(msg) }' }
  ]
});

;
/* docs/registry/fx-swipe-to-confirm.js */
RanjDocs.add({
  id: 'swipe-to-confirm',
  name: 'Swipe to Confirm',
  group: 'Micro-interactions',
  description: 'Slide-to-unlock style confirmation for risky or important actions. Drag the handle past 88% or use the keyboard.',
  tags: ['new', 'fx', 'js'],
  keywords: ['slide to unlock', 'slider confirm', 'swipe button', 'drag to confirm', 'payment confirm'],
  demos: [
    { title: 'Payment', description: 'Drag the handle to the right. Keyboard: Enter, or the right arrow.', height: 240, html: `
<div style="display:grid;gap:1rem;width:340px;max-width:100%;text-align:center">
  <div style="text-align:center"><small style="color:var(--muted-fg)">Pay Blue Bottle Coffee</small><div style="font-size:2rem;font-weight:800;letter-spacing:-.03em">$12.40</div></div>
  <div class="swipe" data-reset="3000">
    <span class="swipe-fill"></span><span class="swipe-text">Slide to pay</span><span class="swipe-done">Payment sent</span>
    <span class="swipe-handle"></span>
  </div>
</div>` },
    { title: 'Danger action', html: `
<div class="swipe" style="--on:var(--destructive)" data-reset="2500">
  <span class="swipe-fill"></span><span class="swipe-text">Slide to delete project</span><span class="swipe-done">Deleted</span>
  <span class="swipe-handle"></span>
</div>` }
  ],
  api: [
    { name: '.swipe', type: 'class', desc: 'Track with <code>.swipe-fill</code>, <code>.swipe-text</code>, <code>.swipe-done</code> and <code>.swipe-handle</code>. Has <code>role="slider"</code>.' },
    { name: 'data-reset', type: 'attr', default: '0', desc: 'Return to start after N ms (0 = stay confirmed).' },
    { name: '--on / --h', type: 'var', default: '--primary / 58px', desc: 'Handle color and height.' },
    { name: 'Ranj.swipe.reset(el)', type: 'js', desc: 'Reset to the start.' },
    { name: 'ranj:confirm', type: 'event', desc: 'Fired once when confirmed.' }
  ]
});

;
/* docs/registry/fx-trace-button.js */
RanjDocs.add({
  id: 'trace-button',
  name: 'Trace Button',
  group: 'Micro-interactions',
  description: 'On hover a comet of light races around the border. Use the always-on variant for a featured action.',
  tags: ['new', 'fx'],
  keywords: ['border light', 'trace', 'animated border', 'comet', 'conic'],
  demos: [
    { title: 'Hover', html: `
<button class="trace-btn">Book a demo</button>
<button class="trace-btn" style="--trace:#10b981">Deploy to production</button>
<button class="trace-btn trace-btn-always" style="--trace:#f59e0b">Featured</button>` },
    { title: 'On dark', bg: 'dark', html: `
<button class="trace-btn trace-btn-dark trace-btn-always">Join the beta</button>
<button class="trace-btn trace-btn-dark" style="--trace:#f472b6;--bw:2px">Watch keynote</button>` }
  ],
  api: [
    { name: '.trace-btn', type: 'class', desc: 'Border light on hover and focus. CSS only.' },
    { name: '.trace-btn-always', type: 'class', desc: 'Light runs all the time.' },
    { name: '.trace-btn-dark', type: 'class', desc: 'Dark surface.' },
    { name: '--trace / --bw', type: 'var', default: '--primary / 1.5px', desc: 'Light color and border width.' }
  ]
});

;
/* docs/registry/fx-typing-indicator.js */
RanjDocs.add({
  id: 'typing-indicator',
  name: 'Typing Indicator',
  group: 'Micro-interactions',
  description: 'Three dots that bounce, wave or pulse while someone is writing. CSS only.',
  tags: ['new', 'fx'],
  keywords: ['typing', 'chat', 'dots', 'is typing', 'loading dots'],
  demos: [
    { title: 'In a chat', height: 300, html: `
<div style="width:min(360px,100%);display:grid;gap:.5rem">
  <div style="justify-self:end;max-width:80%;padding:.6rem .9rem;border-radius:18px 18px 5px 18px;background:var(--primary);color:var(--primary-fg);font-size:.9rem">Are we still on for dinner at 8?</div>
  <div style="display:flex;align-items:flex-end;gap:.5rem"><span style="width:28px;height:28px;border-radius:50%;flex:none;background:linear-gradient(135deg,#fb923c,#f43f5e)"></span><div class="typing typing-bubble" aria-label="Lena is typing"><i></i><i></i><i></i></div></div>
  <small style="color:var(--muted-fg);padding-left:2.3rem">Lena is typing…</small>
</div>` },
    { title: 'Styles', html: `
<div class="typing typing-bubble"><i></i><i></i><i></i></div>
<div class="typing typing-bubble typing-wave"><i></i><i></i><i></i></div>
<div class="typing typing-bubble typing-pulse"><i></i><i></i><i></i></div>
<div class="typing" style="--c:var(--primary);--dot:9px"><i></i><i></i><i></i></div>` }
  ],
  api: [
    { name: '.typing', type: 'class', desc: 'Container with three <code>&lt;i&gt;</code> dots. Give it an <code>aria-label</code>.' },
    { name: '.typing-bubble', type: 'class', desc: 'Chat bubble background.' },
    { name: '.typing-wave / .typing-pulse', type: 'class', desc: 'Alternate motions.' },
    { name: '--c / --dot', type: 'var', default: '--muted-fg / 7px', desc: 'Dot color and size.' }
  ]
});

;
/* docs/registry/layout-aspect-ratio.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'aspect-ratio',
    name: 'Aspect ratio',
    group: 'Layout',
    description: 'Lock media to a ratio. Images, video, iframes and canvas inside <code>.aspect</code> fill and crop automatically.',
    keywords: ['ratio', '16:9', 'video', 'embed', 'responsive media'],
    demos: [
      {
        title: 'Ratios',
        center: false,
        html: `<div class="grid grid-auto" style="--min:150px;align-items:end">
  <figure class="figure"><div class="aspect aspect-square rounded-lg">${RB.art(0, 'aspect-fill')}</div><figcaption>aspect-square · 1:1</figcaption></figure>
  <figure class="figure"><div class="aspect aspect-photo rounded-lg">${RB.art(1, 'aspect-fill')}</div><figcaption>aspect-photo · 4:3</figcaption></figure>
  <figure class="figure"><div class="aspect aspect-video rounded-lg">${RB.art(2, 'aspect-fill')}</div><figcaption>aspect-video · 16:9</figcaption></figure>
  <figure class="figure"><div class="aspect aspect-portrait rounded-lg">${RB.art(3, 'aspect-fill')}</div><figcaption>aspect-portrait · 3:4</figcaption></figure>
</div>`
      },
      {
        title: 'Video embed',
        description: 'Use a custom ratio with <code>--ratio</code>. Here: a 16:9 player with a play overlay.',
        html: `<div class="aspect img-frame demo-aspect-video" style="--ratio:16/9;width:min(100%,36rem)">
  ${RB.art(4, 'aspect-fill')}
  <button class="demo-aspect-play" aria-label="Play video">${I('play')}</button>
  <span class="badge badge-contrast" style="position:absolute;right:.75rem;bottom:.75rem">12:48</span>
</div>`,
        css: `.demo-aspect-play { position: absolute; inset: 0; margin: auto; width: 4rem; height: 4rem; border-radius: 50%; display: grid; place-items: center; color: #fff; background: rgb(255 255 255 / .18); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgb(255 255 255 / .35); transition: transform var(--dur) var(--ease-spring), background var(--transition); z-index: 1; }
.demo-aspect-play:hover { transform: scale(1.08); background: rgb(255 255 255 / .28); }
.demo-aspect-play svg { width: 1.4rem; height: 1.4rem; margin-left: 3px; fill: currentColor; }`
      }
    ],
    api: [
      { name: '.aspect', type: 'class', desc: 'Ratio box using <code>--ratio</code> (16 / 9). Media children fill it.' },
      { name: '.aspect-square', type: 'class', desc: 'Preset ratios (also usable on images directly). Also: <code>.aspect-video</code> <code>.aspect-photo</code> <code>.aspect-3-2</code> <code>.aspect-21-9</code> <code>.aspect-portrait</code> <code>.aspect-story</code> <code>.aspect-golden</code>' },
      { name: '.aspect-fill', type: 'class', desc: 'Make any child (div, svg) fill the ratio box.' },
      { name: '--ratio', type: 'var', default: '16 / 9', desc: 'Custom ratio.' }
    ]
  });
})();

;
/* docs/registry/layout-container.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'container',
    name: 'Container',
    group: 'Layout',
    description: 'Centers content with a max width and fluid side padding that grows from 1rem on phones to 2rem on desktop.',
    keywords: ['wrapper', 'max-width', 'page', 'section', 'layout'],
    demos: [
      {
        title: 'Sizes',
        description: 'Each band is a container; the dashed area is the padding.',
        center: false,
        pad: false,
        html: `<div class="demo-container-bands">
  <div class="container container-xs"><div>container-xs · 480px</div></div>
  <div class="container container-sm"><div>container-sm · 640px</div></div>
  <div class="container container-md"><div>container-md · 768px</div></div>
  <div class="container container-lg"><div>container-lg · 1024px</div></div>
  <div class="container"><div>container · 1200px</div></div>
</div>`,
        css: `.demo-container-bands { display: grid; gap: .6rem; padding: 1.5rem 0; }
.demo-container-bands .container { background: repeating-linear-gradient(-45deg, transparent 0 6px, color-mix(in oklab, var(--primary) 9%, transparent) 6px 7px); }
.demo-container-bands .container > div { padding: .65rem 1rem; border-radius: var(--radius); background: var(--primary-soft); color: var(--primary-soft-fg); font-family: var(--font-mono); font-size: .75rem; font-weight: 500; border: 1px solid color-mix(in oklab, var(--primary) 30%, transparent); }`
      },
      {
        title: 'Page section',
        description: 'Combine <code>.section</code>, <code>.container</code> and <code>.section-header</code> for a landing-page band.',
        center: false,
        pad: false,
        html: `<section class="section section-sm section-muted">
  <div class="container container-lg">
    <div class="section-header">
      <span class="eyebrow">Why teams switch</span>
      <h2 class="h2">Everything you need, nothing you don't</h2>
      <p class="lead">Fast to start, easy to theme, and built to last for years.</p>
    </div>
    <div class="grid grid-auto" style="--min:220px;--gap:1.5rem">
      <div class="feature"><span class="icon-box">${I('zap')}</span><div class="feature-title">Fast by default</div><p class="feature-text">55 KB of gzipped CSS for 150+ components, no runtime framework.</p></div>
      <div class="feature"><span class="icon-box">${I('palette')}</span><div class="feature-title">One-hue theming</div><p class="feature-text">Change <code>--hue</code> and every state color follows.</p></div>
      <div class="feature"><span class="icon-box">${I('shield')}</span><div class="feature-title">Accessible</div><p class="feature-text">Keyboard support, focus rings and ARIA wired in.</p></div>
    </div>
  </div>
</section>`
      }
    ],
    api: [
      { name: '.container', type: 'class', desc: 'Centered, max 1200px, fluid padding.' },
      { name: '.container-sm', type: 'class', desc: 'Sizes <code>.container-xs</code> <code>-sm</code> <code>-md</code> <code>-lg</code> <code>-xl</code> <code>-2xl</code>: 480 / 640 / 768 / 1024 / 1280 / 1440px.' },
      { name: '.container-prose', type: 'class', desc: '68ch reading width, no max width, no padding. Also: <code>.container-full</code> <code>.container-flush</code>' },
      { name: '--container-max', type: 'var', desc: 'Override the width or padding for any container. Also: <code>--container-pad</code>' },
      { name: '.section', type: 'class', desc: 'Vertical rhythm for page bands. Also: <code>.section-sm</code> <code>.section-lg</code> <code>.section-muted</code>' },
      { name: '.section-header', type: 'class', desc: 'Centered eyebrow + heading + lead block; add <code>.align-start</code> for left aligned.' }
    ]
  });
})();

;
/* docs/registry/layout-grid.js */
(function () {
  var I = RB.ic;
  function boxes(n, label) { var s = ''; for (var i = 1; i <= n; i++) s += '<div class="demo-grid-box">' + (label || i) + '</div>'; return s; }
  RanjDocs.add({
    id: 'grid',
    name: 'Grid',
    group: 'Layout',
    description: '12-column CSS grid with responsive <code>sm-</code>, <code>md-</code>, <code>lg-</code> and <code>xl-</code> variants, an auto-fit grid that needs no breakpoints, and a bento layout.',
    keywords: ['columns', 'responsive', 'bento', 'auto-fit', 'css grid'],
    demos: [
      {
        title: 'Responsive columns',
        description: '1 column on phones, 2 from <code>sm</code>, 4 from <code>lg</code>.',
        center: false,
        html: '<div class="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-4 gap-4">' + boxes(8) + '</div>',
        css: '.demo-grid-box { display: grid; place-items: center; min-height: 3.5rem; border-radius: var(--radius); background: var(--primary-soft); color: var(--primary-soft-fg); font-family: var(--font-mono); font-size: .8rem; font-weight: 600; border: 1px solid color-mix(in oklab, var(--primary) 25%, transparent); }'
      },
      {
        title: 'Spans',
        center: false,
        html: `<div class="grid grid-cols-12 gap-3">
  <div class="demo-grid-box col-span-12">col-span-12</div>
  <div class="demo-grid-box col-span-8">col-span-8</div><div class="demo-grid-box col-span-4">4</div>
  <div class="demo-grid-box col-span-6">col-span-6</div><div class="demo-grid-box col-span-6">col-span-6</div>
  <div class="demo-grid-box col-span-3">3</div><div class="demo-grid-box col-span-3">3</div><div class="demo-grid-box col-span-3">3</div><div class="demo-grid-box col-span-3">3</div>
</div>`
      },
      {
        title: 'Auto-fit (no breakpoints)',
        description: 'As many columns as fit, each at least <code>--min</code> wide.',
        center: false,
        html: '<div class="grid grid-auto" style="--min:160px">' + boxes(6, 'min 160px') + '</div>'
      },
      {
        title: 'Bento',
        center: false,
        html: `<div class="bento" style="--row:150px">
  <div class="card col-span-2 row-span-2 demo-grid-bento"><span class="icon-box icon-box-solid icon-box-lg">${I('rocket')}</span><div><h3 class="h3">Deploy on push</h3><p class="muted small" style="font-weight:400">Every commit becomes a preview URL your whole team can comment on.</p></div></div>
  <div class="card col-span-2 demo-grid-bento"><div class="card-stat" style="padding:0;border:0"><div class="stat-label">Uptime, 90 days</div><div class="stat-value">99.998%</div></div></div>
  <div class="card demo-grid-bento"><span class="icon-box icon-box-success">${I('shield')}</span><b class="small">SOC 2 Type II</b></div>
  <div class="card demo-grid-bento"><span class="icon-box icon-box-info">${I('globe')}</span><b class="small">38 edge regions</b></div>
</div>`,
        css: '.demo-grid-bento { padding: 1.25rem; justify-content: space-between; gap: 1rem; }'
      }
    ],
    api: [
      { name: '.grid', type: 'class', desc: 'Grid with <code>--gap</code> (1rem).' },
      { name: '.grid-cols-1 … .grid-cols-12', type: 'class', desc: 'Fixed column counts. 3+ columns drop to 2 (and 2 to 1) under 640px unless you add <code>.grid-keep</code>.' },
      { name: '.sm-/.md-/.lg-/.xl-grid-cols-N', type: 'class', desc: 'Responsive column counts at 640 / 768 / 1024 / 1280px.' },
      { name: '.col-span-N', type: 'class', desc: 'Spanning, with <code>.md-col-span-N</code> and <code>.lg-col-span-N</code> variants. Also: <code>.col-span-full</code> <code>.row-span-N</code>' },
      { name: '.grid-auto / .grid-auto-fill', type: 'class', desc: 'Auto-fit grid driven by <code>--min</code> (220px).' },
      { name: '.bento', type: 'class', desc: '4-column dense grid (2 on mobile) with <code>--row</code> height.' },
      { name: '.split-even / .sidebar-layout', type: 'class', desc: 'Two equal columns that stack when narrow / sidebar + main that wraps intrinsically.' }
    ]
  });
})();

;
/* docs/registry/layout-separator.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'separator',
    name: 'Separator',
    group: 'Layout',
    description: 'Horizontal and vertical dividers, with optional labels like "OR", plus dashed, dotted, gradient and glow styles.',
    keywords: ['divider', 'hr', 'rule', 'line', 'or'],
    demos: [
      {
        title: 'Default',
        center: false,
        html: `<div style="max-width:24rem;margin:0 auto">
  <div class="stack gap-1"><b class="small">Ranj UI</b><span class="small muted" style="font-weight:400">An open-source component library.</span></div>
  <hr class="separator">
  <div class="hstack small" style="height:1.25rem">
    <a class="link-underline" href="#">Blog</a><span class="separator separator-vertical"></span>
    <a class="link-underline" href="#">Docs</a><span class="separator separator-vertical"></span>
    <a class="link-underline" href="#">Source</a>
  </div>
</div>`
      },
      {
        title: 'With label (sign-in)',
        html: `<div class="card" style="width:min(100%,22rem)">
  <div class="card-content stack gap-3">
    <button class="btn btn-outline btn-block">${I('github')} Continue with GitHub</button>
    <button class="btn btn-outline btn-block">${I('mail')} Continue with email</button>
    <div class="separator separator-label">or</div>
    <button class="btn btn-ghost btn-block">Use a passkey</button>
  </div>
</div>`
      },
      {
        title: 'Styles',
        center: false,
        html: `<div class="stack gap-2" style="max-width:32rem;margin:0 auto">
  <hr class="separator separator-strong">
  <hr class="separator separator-dashed">
  <div class="separator separator-dotted"></div>
  <hr class="separator separator-gradient">
  <hr class="separator separator-glow">
  <div class="separator separator-label normal-case">Today</div>
  <div class="separator separator-label separator-start">Earlier this week</div>
  <div class="separator separator-label"><button class="btn btn-outline btn-xs btn-pill">${I('chevronDown')} Show 12 more</button></div>
</div>`
      }
    ],
    api: [
      { name: '.separator / .divider', type: 'class', desc: '1px horizontal rule. Works on <code>&lt;hr&gt;</code> or <code>&lt;div&gt;</code>.' },
      { name: '.separator-vertical', type: 'class', desc: 'Vertical rule that stretches to the row height.' },
      { name: '.separator-label', type: 'class', desc: 'Lines on both sides of text or a button. <code>.separator-start</code>/<code>.separator-end</code> align the label.' },
      { name: '.separator-dashed', type: 'class', desc: 'Visual styles. Also: <code>.separator-dotted</code> <code>.separator-gradient</code> <code>.separator-glow</code> <code>.separator-strong</code> <code>.separator-thick</code>' },
      { name: '.separator-flush', type: 'class', desc: 'Remove the default margin.' },
      { name: '--sep-color / --sep-space', type: 'var', desc: 'Line color and margin.' },
      { name: 'role="separator"', type: 'attr', desc: 'Add to a <code>div</code> separator when it separates content semantically.' }
    ]
  });
})();

;
/* docs/registry/layout-stack.js */
(function () {
  var I = RB.ic;
  RanjDocs.add({
    id: 'stack',
    name: 'Stack',
    group: 'Layout',
    description: 'Flexbox primitives for spacing things in a line: vertical <code>.stack</code>, horizontal <code>.hstack</code>, wrapping <code>.cluster</code>, and <code>.split</code> for "left thing, right thing".',
    keywords: ['flex', 'vstack', 'hstack', 'cluster', 'split', 'spacing', 'gap'],
    demos: [
      {
        title: 'Stack and hstack',
        center: false,
        html: `<div class="grid grid-cols-2" style="--gap:2rem">
  <div class="stack gap-3">
    <div class="demo-stack-box">.stack</div><div class="demo-stack-box">gap-3</div><div class="demo-stack-box">children</div>
  </div>
  <div class="hstack gap-2" style="align-self:start;flex-wrap:wrap">
    <div class="demo-stack-box">.hstack</div><div class="demo-stack-box">gap-2</div><div class="demo-stack-box">row</div>
  </div>
</div>`,
        css: '.demo-stack-box { padding: .6rem .9rem; border-radius: var(--radius); background: var(--primary-soft); color: var(--primary-soft-fg); font-family: var(--font-mono); font-size: .75rem; border: 1px solid color-mix(in oklab, var(--primary) 25%, transparent); }'
      },
      {
        title: 'Split: header row',
        description: 'The first child grows; the rest wrap below on narrow screens.',
        center: false,
        html: `<div class="split" style="max-width:44rem;margin:0 auto">
  <div class="stack gap-1">
    <h3 class="h4">API keys</h3>
    <p class="small muted" style="font-weight:400">Keys give full access to your workspace. Keep them secret.</p>
  </div>
  <div class="cluster">
    <button class="btn btn-outline btn-sm">${I('download')} Export</button>
    <button class="btn btn-sm">${I('plus')} New key</button>
  </div>
</div>`
      },
      {
        title: 'Cluster: wrapping tags',
        html: `<div class="cluster" style="max-width:28rem">
  <span class="chip">${I('mapPin')} Remote</span><span class="chip">Full-time</span><span class="chip">$140k – $180k</span><span class="chip">TypeScript</span><span class="chip">Postgres</span><span class="chip">Design systems</span><span class="chip">4-day week</span>
</div>`
      },
      {
        title: 'Divided stack',
        center: false,
        html: `<div class="stack stack-divided gap-4" style="max-width:26rem;margin:0 auto">
  <div class="split"><span class="small">Two-factor authentication</span><span class="badge badge-soft badge-success badge-dot">Enabled</span></div>
  <div class="split"><span class="small">Login alerts</span><span class="badge badge-soft badge-dot badge-neutral">Email</span></div>
  <div class="split"><span class="small">Session timeout</span><span class="small muted">30 minutes</span></div>
</div>`
      }
    ],
    api: [
      { name: '.stack / .vstack', type: 'class', desc: 'Column flex with <code>--gap</code> (default 1rem).' },
      { name: '.hstack', type: 'class', desc: 'Row flex, items centered, default gap .75rem.' },
      { name: '.gap-0 … .gap-16', type: 'class', desc: 'Gap scale (also sets <code>--gap</code>).' },
      { name: '.stack-divided', type: 'class', desc: 'Hairline between children.' },
      { name: '.cluster', type: 'class', desc: 'Wrapping row of items. <code>.cluster-between</code>, <code>.cluster-end</code>.' },
      { name: '.split', type: 'class', desc: 'Space-between row whose first child grows and wraps under <code>--split-basis</code> (10rem).' },
      { name: '.center / .spacer', type: 'class', desc: 'Center both axes / flexible spacer.' },
      { name: '.md-hstack / .sm-hstack', type: 'class', desc: 'Stack on mobile, row from that breakpoint up.' }
    ]
  });
})();

;
/* docs/registry/motion-animated-list.js */
RanjDocs.add({
  id: 'animated-list',
  name: 'Animated List',
  group: 'Motion',
  description: 'Items arrive one by one like a live notification feed: each new item springs in at the top and smoothly pushes the rest down, the oldest gracefully exiting.',
  tags: ['new', 'fx', 'js'],
  keywords: ['notifications', 'feed', 'activity', 'stream', 'toast list', 'live'],
  demos: [
    {
      title: 'Notification feed',
      height: 460,
      html: `
<div class="demo-animated-list-phone">
  <div class="demo-animated-list-time">9:41</div>
  <div class="animated-list" data-loop data-max="4" data-interval="1400">
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#22c55e,#16a34a)">💸</span><div class="al-notif-body"><div class="al-notif-title">Payment received <small>now</small></div><div class="al-notif-text">Maya sent you $48.00 for dinner</div></div></div>
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#6366f1,#8b5cf6)">💬</span><div class="al-notif-body"><div class="al-notif-title">Jordan <small>now</small></div><div class="al-notif-text">Are we still on for 7pm? 🍜</div></div></div>
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#f59e0b,#f97316)">⭐</span><div class="al-notif-body"><div class="al-notif-title">New review <small>2m</small></div><div class="al-notif-text">“Best onboarding I've seen” — 5 stars</div></div></div>
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#0ea5e9,#2563eb)">🚀</span><div class="al-notif-body"><div class="al-notif-title">Deploy finished <small>4m</small></div><div class="al-notif-text">ranj-docs is live on production</div></div></div>
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#ec4899,#db2777)">❤️</span><div class="al-notif-body"><div class="al-notif-title">Priya liked your post <small>6m</small></div><div class="al-notif-text">“Shipping the new dock today”</div></div></div>
    <div class="al-notif"><span class="al-notif-icon" style="background:linear-gradient(135deg,#14b8a6,#0d9488)">📅</span><div class="al-notif-body"><div class="al-notif-title">Design review <small>in 10m</small></div><div class="al-notif-text">Room 4B · with Alex, Sam and 3 others</div></div></div>
  </div>
</div>`,
      css: `.demo-animated-list-phone { width: min(100%, 360px); height: 400px; padding: 1.25rem .9rem; border-radius: 2rem; overflow: hidden; background: linear-gradient(160deg, color-mix(in oklab, var(--primary) 30%, var(--bg)), color-mix(in oklab, oklch(.7 .2 calc(var(--hue) + 80)) 25%, var(--bg))); border: 1px solid var(--border); box-shadow: var(--shadow-xl); }
.demo-animated-list-time { text-align: center; font-family: var(--font-display); font-size: 3rem; font-weight: 700; letter-spacing: -.03em; line-height: 1; margin-bottom: 1rem; opacity: .85; }`
    },
    {
      title: 'Chat style, adding programmatically',
      description: '<code>.animated-list-up</code> appends at the bottom. The instance exposes <code>add(node)</code>.',
      height: 380,
      html: `
<div class="demo-animated-list-chat">
  <div class="animated-list animated-list-up demo-animated-list-msgs" data-max="5" data-interval="900">
    <div class="demo-animated-list-msg">Hey! Did the build pass? 👀</div>
    <div class="demo-animated-list-msg me">Yep, all green ✅</div>
    <div class="demo-animated-list-msg">Ship it 🚢</div>
  </div>
  <button class="btn btn-primary btn-sm" data-demo-add>Send a message</button>
</div>`,
      js: `var list = root.querySelector('.animated-list'), i = 0;
var lines = ['On it!', 'Looks great on mobile too', 'Merged 🎉', 'Coffee later?', 'Pushing a fix now'];
root.querySelector('[data-demo-add]').onclick = function () {
  var inst = Ranj.instance(list, 'animated-list'); if (!inst) return;
  var m = document.createElement('div'); m.className = 'demo-animated-list-msg me'; m.textContent = lines[i++ % lines.length];
  inst.add(m);
};`,
      css: `.demo-animated-list-chat { width: min(100%, 360px); display: grid; gap: 1rem; }
.demo-animated-list-msgs { --al-gap: .45rem; min-height: 250px; justify-content: flex-end; }
.demo-animated-list-msg { width: fit-content; max-width: 80%; padding: .55rem .9rem; border-radius: 1.1rem 1.1rem 1.1rem .3rem; background: var(--secondary); font-size: .9rem; }
.demo-animated-list-msg.me { margin-left: auto; border-radius: 1.1rem 1.1rem .3rem 1.1rem; background: var(--primary); color: var(--primary-fg); }`
    }
  ],
  api: [
    { name: '.animated-list', type: 'class', desc: 'Container; each direct child becomes an item.' },
    { name: '.animated-list-up', type: 'class', desc: 'New items append at the bottom (chat) instead of the top (feed).' },
    { name: '.al-notif', type: 'class', desc: 'Ready-made notification card (<code>.al-notif-icon</code>, <code>-body</code>, <code>-title</code>, <code>-text</code>).' },
    { name: 'data-interval', type: 'attr', default: '1100', desc: 'Milliseconds between items.' },
    { name: 'data-max', type: 'attr', default: 'all', desc: 'Max visible items; older ones exit.' },
    { name: 'data-loop', type: 'attr', default: 'false', desc: 'Keep cycling the items forever.' },
    { name: 'data-trigger / data-delay', type: 'attr', default: 'view / 200', desc: 'Start on view (or <code>load</code>) after a delay.' },
    { name: '--al-gap / --al-dur', type: 'var', default: '.625rem / 600ms', desc: 'Item spacing and transition time.' },
    { name: 'Ranj.instance(el, "animated-list")', type: 'js', desc: 'Returns <code>{ add(node), pause(), resume() }</code>.' },
    { name: 'ranj:item', type: 'event', desc: 'detail: <code>{ item }</code> as each item enters.' }
  ]
});

;
/* docs/registry/motion-bento-grid.js */
RanjDocs.add({
  id: 'bento-grid',
  name: 'Bento Grid',
  group: 'Motion',
  description: 'Feature cards on the core .bento layout with a cursor-following glow: the fill lights the hovered card while the border light spills across neighbours.',
  tags: ['new', 'fx', 'js'],
  keywords: ['bento', 'feature grid', 'cards', 'glow', 'spotlight', 'landing page'],
  demos: [
    {
      title: 'Feature bento',
      pad: false,
      html: `
<div class="demo-bento-grid-wrap">
<div class="bento" data-spotlight-group style="--row: 170px">
  <div class="bento-card col-span-2 row-span-2">
    <div class="bento-visual"><div class="demo-bento-grid-chart"><i style="height:40%"></i><i style="height:62%"></i><i style="height:48%"></i><i style="height:80%"></i><i style="height:66%"></i><i style="height:94%"></i><i style="height:72%"></i></div></div>
    <h3>Real-time analytics</h3><p>Every event streams to your dashboard in under 200ms, no polling.</p>
  </div>
  <div class="bento-card col-span-2">
    <div class="bento-visual"><div class="demo-bento-grid-avatars"><span>AM</span><span>JL</span><span>SK</span><span>+9</span></div></div>
    <h3>Multiplayer by default</h3><p>Presence, cursors and comments built in.</p>
  </div>
  <div class="bento-card">
    <div class="bento-visual demo-bento-grid-big">99.99%</div>
    <h3>Uptime</h3><p>Across 14 regions.</p>
  </div>
  <div class="bento-card">
    <div class="bento-visual demo-bento-grid-big">⌘K</div>
    <h3>Command menu</h3><p>Do anything, fast.</p>
  </div>
  <div class="bento-card col-span-4" style="min-height: 120px">
    <h3>Ship faster with Ranj UI</h3><p>Copy a component, paste it in, and it just works — in plain HTML, React, Vue, Svelte or anything else.</p>
  </div>
</div>
</div>`,
      css: `.demo-bento-grid-wrap { width: 100%; padding: 1.5rem; max-width: 960px; margin: 0 auto; }
.demo-bento-grid-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; width: 80%; }
.demo-bento-grid-chart i { flex: 1; border-radius: 6px 6px 2px 2px; background: linear-gradient(180deg, var(--primary), color-mix(in oklab, var(--primary) 30%, transparent)); }
.demo-bento-grid-avatars { display: flex; } .demo-bento-grid-avatars span { width: 44px; height: 44px; margin-left: -10px; border-radius: 50%; display: grid; place-items: center; font-size: .75rem; font-weight: 700; color: #fff; border: 3px solid var(--card); background: linear-gradient(135deg, #f97316, #ec4899); }
.demo-bento-grid-avatars span:nth-child(2) { background: linear-gradient(135deg, #22c55e, #0ea5e9); } .demo-bento-grid-avatars span:nth-child(3) { background: linear-gradient(135deg, #8b5cf6, #6366f1); } .demo-bento-grid-avatars span:nth-child(4) { background: var(--secondary); color: var(--fg); }
.demo-bento-grid-big { font-family: var(--font-display); font-size: 2.25rem; font-weight: 800; letter-spacing: -.04em; }`
    }
  ],
  api: [
    { name: '.bento', type: 'class', desc: 'Core layout grid (4 columns, 2 on mobile). Use <code>col-span-*</code> / <code>row-span-*</code>; <code>--row</code> sets row height.' },
    { name: '.bento-card', type: 'class', desc: 'Card with hover lift and spotlight glow. <code>.bento-visual</code> fills the space above the copy.' },
    { name: 'data-spotlight-group', type: 'attr', desc: 'On the grid: one pointer handler drives every card so border light crosses card boundaries.' },
    { name: '--spot / --spot-border / --spot-size', type: 'var', desc: 'Glow fill color, border light color and radius.' }
  ]
});

;
/* docs/registry/motion-blur-text.js */
RanjDocs.add({
  id: 'blur-text',
  name: 'Blur Text',
  group: 'Text Effects',
  description: 'Words (or letters) sharpen out of a soft blur as they drop into place. A calmer cousin of Split Text, made for subheads and taglines.',
  tags: ['new', 'fx', 'js'],
  keywords: ['blur in', 'focus', 'text animation', 'fade'],
  demos: [
    {
      title: 'By word',
      height: 260,
      html: `
<h2 class="demo-blur-text-h" data-blur-text>Isn't this so cool?! Words come into focus one at a time.</h2>`,
      css: `.demo-blur-text-h { max-width: 640px; text-align: center; font-size: clamp(1.6rem, 1.2rem + 1.6vw, 2.5rem); }`
    },
    {
      title: 'By letter, from below',
      html: `
<h2 class="demo-blur-text-h" data-blur-text="chars" data-direction="bottom" data-stagger="35">Sharpen up.</h2>`,
      css: `.demo-blur-text-h { text-align: center; }`
    },
    {
      title: 'Hero subhead',
      height: 300,
      html: `
<div class="demo-blur-text-hero">
  <h1 class="display-2" data-blur-text data-stagger="90">Ship calm software.</h1>
  <p class="lead" data-blur-text data-stagger="30" data-delay="500">Observability for teams that would rather sleep through the night than babysit dashboards.</p>
</div>`,
      css: `.demo-blur-text-hero { text-align: center; max-width: 640px; display: grid; gap: 1rem; }`
    }
  ],
  api: [
    { name: 'data-blur-text', type: 'attr', default: 'words', desc: '<code>words</code> or <code>chars</code>.' },
    { name: 'data-direction', type: 'attr', default: 'top', desc: '<code>top</code> drops in from above, <code>bottom</code> rises.' },
    { name: 'data-stagger / data-delay / data-duration', type: 'attr', default: '60 / 0 / 900', desc: 'Timing in ms.' },
    { name: 'data-trigger / data-repeat', type: 'attr', desc: 'Same as Split Text.' }
  ]
});

;
/* docs/registry/motion-border-beam.js */
RanjDocs.add({
  id: 'border-beam',
  name: 'Border Beam',
  group: 'Interactions',
  description: 'A glowing comet of light travels around the element’s border forever. CSS-only, using an animated conic gradient masked to the border.',
  tags: ['new', 'fx'],
  keywords: ['beam', 'border animation', 'glowing border', 'light trail', 'pricing card'],
  demos: [
    {
      title: 'Pricing card',
      height: 460,
      html: `
<div class="card border-beam demo-border-beam-price">
  <div class="card-header"><span class="badge badge-soft">Most popular</span><h3 class="card-title">Pro</h3><p class="card-description">For teams shipping every day.</p></div>
  <div class="card-content">
    <p class="demo-border-beam-amt"><b>$24</b> / seat / month</p>
    <ul><li>Unlimited projects</li><li>Advanced analytics</li><li>Priority support</li><li>SSO &amp; audit logs</li></ul>
  </div>
  <div class="card-footer"><button class="btn btn-primary" style="width:100%">Start 14-day trial</button></div>
</div>`,
      css: `.demo-border-beam-price { width: min(100%, 330px); }
.demo-border-beam-amt { margin-bottom: 1rem; color: var(--muted-fg); } .demo-border-beam-amt b { font-size: 2.5rem; color: var(--fg); letter-spacing: -.04em; }
.demo-border-beam-price ul { list-style: none; display: grid; gap: .5rem; font-size: .9rem; }
.demo-border-beam-price li::before { content: '✓'; color: var(--success); font-weight: 700; margin-right: .6rem; }`
    },
    {
      title: 'Search field, dual beams & colors',
      height: 260,
      html: `
<div class="demo-border-beam-stack">
  <label class="border-beam demo-border-beam-search" style="--beam-speed: 4s"><span>⌕</span><input placeholder="Ask anything…" aria-label="Ask anything"></label>
  <div class="border-beam border-beam-dual demo-border-beam-chip" style="--beam-color:#22d3ee; --beam-color-2:#a3e635; --beam-length: 60deg">Dual beam · custom colors</div>
</div>`,
      css: `.demo-border-beam-stack { display: grid; gap: 1.5rem; justify-items: center; width: 100%; }
.demo-border-beam-search { width: min(100%, 420px); display: flex; align-items: center; gap: .6rem; padding: 0 1rem; height: 3rem; border-radius: 99px; background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-md); color: var(--muted-fg); }
.demo-border-beam-search input { flex: 1; border: 0; outline: 0; background: none; height: 100%; color: var(--fg); }
.demo-border-beam-chip { padding: .9rem 1.4rem; border-radius: var(--radius-lg); background: var(--card); border: 1px solid var(--border); font-weight: 600; }`
    }
  ],
  api: [
    { name: '.border-beam', type: 'class', desc: 'Add to any element with a border radius (it creates its own stacking context).' },
    { name: '.border-beam-dual', type: 'class', desc: 'Two beams chasing each other.' },
    { name: '--beam-color / --beam-color-2', type: 'var', default: 'accent / accent + 80°', desc: 'Head and tail colors.' },
    { name: '--beam-length', type: 'var', default: '80deg', desc: 'Beam length as an angle of the loop.' },
    { name: '--beam-width / --beam-speed', type: 'var', default: '1.5px / 6s', desc: 'Thickness and loop time.' },
    { name: '--beam-inset', type: 'var', default: '-1px', desc: 'Offset so the beam sits on a 1px border; use 0 for borderless elements.' }
  ]
});

;
/* docs/registry/motion-circular-text.js */
RanjDocs.add({
  id: 'circular-text',
  name: 'Circular Text',
  group: 'Text Effects',
  description: 'Text set on a circle that rotates continuously, with hover behaviours that speed up, slow down, pause or reverse with eased momentum.',
  tags: ['new', 'fx', 'js'],
  keywords: ['rotating badge', 'circle text', 'spinning', 'stamp', 'seal'],
  demos: [
    {
      title: 'Badge with center icon',
      height: 280,
      html: `
<div class="circular-text demo-circular-text-a" data-text="Scroll to explore • Scroll to explore • ">
  <span class="demo-circular-text-core">↓</span>
</div>
<div class="circular-text demo-circular-text-b" data-text="Available for work ✦ 2026 ✦ " data-hover="slow" data-speed="14">
  <span class="demo-circular-text-avatar">AM</span>
</div>`,
      css: `.demo-circular-text-a { --size: 170px; --ct-font: 14px; color: var(--fg); }
.demo-circular-text-core { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: var(--primary); color: var(--primary-fg); font-size: 1.5rem; box-shadow: var(--shadow-glow); }
.demo-circular-text-b { --size: 150px; --ct-font: 12px; color: var(--muted-fg); }
.demo-circular-text-avatar { width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; color: #fff; background: linear-gradient(135deg, #f97316, #ec4899); }`
    },
    {
      title: 'Hover modes',
      description: '<code>data-hover</code>: speed (default), slow, pause, reverse, bonkers, none.',
      height: 240,
      html: `
<div class="circular-text demo-circular-text-m" data-text="speed up • speed up • speed up • "><b>speed</b></div>
<div class="circular-text demo-circular-text-m" data-hover="pause" data-text="pause • pause • pause • pause • "><b>pause</b></div>
<div class="circular-text demo-circular-text-m" data-hover="reverse" data-text="reverse • reverse • reverse • "><b>reverse</b></div>
<div class="circular-text demo-circular-text-m" data-hover="bonkers" data-text="go bonkers • go bonkers • "><b>bonkers</b></div>`,
      css: `.demo-circular-text-m { --size: 130px; --ct-font: 11px; margin: .5rem; }
.demo-circular-text-m b { font-size: .8rem; color: var(--muted-fg); }`
    }
  ],
  api: [
    { name: '.circular-text', type: 'class', desc: 'Container; children render in the center.' },
    { name: 'data-text', type: 'attr', desc: 'The text on the circle (repeat it with separators to fill the ring).' },
    { name: 'data-speed', type: 'attr', default: '20', desc: 'Seconds per revolution.' },
    { name: 'data-hover', type: 'attr', default: 'speed', desc: 'speed, slow, pause, reverse, bonkers, none.' },
    { name: 'data-reverse', type: 'attr', default: 'false', desc: 'Spin counter-clockwise.' },
    { name: '--size / --ct-font / --ct-spacing', type: 'var', default: '160px / 13px / .2em', desc: 'Diameter, font size and letter spacing.' }
  ]
});

;
/* docs/registry/motion-click-spark.js */
RanjDocs.add({
  id: 'click-spark',
  name: 'Click Spark',
  group: 'Interactions',
  description: 'Short spark lines burst outward from every click inside an area, drawn on a lightweight canvas that only animates while sparks are alive.',
  tags: ['new', 'fx', 'js'],
  keywords: ['click effect', 'burst', 'sparkle', 'particles', 'tap feedback'],
  demos: [
    {
      title: 'Click anywhere in the area',
      height: 300,
      html: `
<div class="demo-click-spark-area" data-click-spark>
  <p>Click anywhere in here ✨</p>
</div>`,
      css: `.demo-click-spark-area { width: 100%; max-width: 640px; height: 240px; border-radius: var(--radius-2xl); border: 1px dashed var(--border-strong); display: grid; place-items: center; color: var(--muted-fg); user-select: none; cursor: crosshair; }`
    },
    {
      title: 'Custom sparks on a button',
      html: `
<button class="btn btn-primary btn-lg" data-click-spark="#f59e0b" data-spark-count="12" data-spark-radius="34" data-spark-size="14">Celebrate</button>
<button class="btn btn-outline btn-lg" data-click-spark="#ec4899" data-spark-count="6" data-spark-width="3">Like ♥</button>`
    }
  ],
  api: [
    { name: 'data-click-spark', type: 'attr', default: 'var(--primary)', desc: 'Enable; value sets the spark color.' },
    { name: 'data-spark-count', type: 'attr', default: '8', desc: 'Lines per burst.' },
    { name: 'data-spark-size / data-spark-radius', type: 'attr', default: '12 / 22', desc: 'Line length and travel distance (px).' },
    { name: 'data-spark-duration / data-spark-width', type: 'attr', default: '450 / 2', desc: 'Milliseconds and stroke width.' }
  ]
});

;
/* docs/registry/motion-confetti.js */
RanjDocs.add({
  id: 'confetti',
  name: 'Confetti',
  group: 'Interactions',
  description: 'Physics-based confetti on a temporary full-screen canvas: bursts from any point, presets for fireworks, school pride, realistic cannons, stars and emoji. Declarative with data-confetti or call Ranj.confetti().',
  tags: ['new', 'fx', 'js'],
  keywords: ['celebration', 'party', 'fireworks', 'success', 'canvas confetti', 'burst'],
  demos: [
    {
      title: 'Presets',
      height: 240,
      html: `
<button class="btn btn-primary" data-confetti>🎉 Burst</button>
<button class="btn btn-outline" data-confetti="realistic">Realistic</button>
<button class="btn btn-outline" data-confetti="fireworks">Fireworks</button>
<button class="btn btn-outline" data-confetti="pride" data-confetti-colors="#6366f1, #ffffff, #f59e0b">School pride</button>
<button class="btn btn-outline" data-confetti="stars">⭐ Stars</button>
<button class="btn btn-outline" data-confetti="🦄">🦄 Emoji</button>`
    },
    {
      title: 'JavaScript API',
      description: 'Fire it after something succeeds; it returns a Promise that resolves when the particles settle.',
      html: `
<form class="demo-confetti-form">
  <input class="input" placeholder="you@company.com" aria-label="Email" value="alex@ranj.dev">
  <button class="btn btn-primary" type="submit">Join waitlist</button>
</form>`,
      js: `var f = root.querySelector('form');
f.onsubmit = function (e) {
  e.preventDefault();
  var r = f.querySelector('button').getBoundingClientRect();
  Ranj.confetti({ x: (r.left + r.width / 2) / innerWidth, y: r.top / innerHeight, particleCount: 120, spread: 90, colors: ['#22c55e', '#86efac', '#facc15', '#ffffff'] })
    .then(function () { f.querySelector('button').textContent = "You're in ✓"; });
};`,
      css: `.demo-confetti-form { display: flex; gap: .5rem; flex-wrap: wrap; justify-content: center; } .demo-confetti-form .input { width: 240px; }`
    }
  ],
  api: [
    { name: 'data-confetti', type: 'attr', default: 'burst', desc: 'On a button: <code>realistic</code>, <code>fireworks</code>, <code>pride</code>, <code>stars</code>, or an emoji. Fires from the element.' },
    { name: 'data-confetti-colors', type: 'attr', desc: 'Comma-separated colors.' },
    { name: 'Ranj.confetti(opts)', type: 'js', desc: 'opts: <code>x, y</code> (0–1 viewport fractions or px), <code>particleCount</code> 80, <code>angle</code> 90, <code>spread</code> 60, <code>startVelocity</code> 45, <code>decay</code> .92, <code>gravity</code> 1, <code>drift</code> 0, <code>ticks</code> 200, <code>colors</code>, <code>shapes</code> (square, circle, strip, star or emoji), <code>scalar</code> 1. Returns a Promise.' },
    { name: 'Ranj.confetti.burst(el, opts)', type: 'js', desc: 'Burst from an element’s center.' },
    { name: 'Ranj.confetti.realistic / fireworks / schoolPride / stars (opts)', type: 'js', desc: 'Presets; fireworks and schoolPride accept <code>duration</code>.' },
    { name: 'Ranj.confetti.emoji(emoji, opts)', type: 'js', desc: 'Emoji confetti.' },
    { name: 'ranj:confetti', type: 'event', desc: 'detail: <code>{ preset, done }</code> from data-confetti buttons.' }
  ],
  notes: '<p>With reduced motion confetti is skipped (pass <code>force: true</code> to override). The canvas is created on demand and removed when idle.</p>'
});

;
/* docs/registry/motion-count-up.js */
RanjDocs.add({
  id: 'count-up',
  name: 'Count Up',
  group: 'Text Effects',
  description: 'Animates numbers to their value when they scroll into view, with prefix, suffix, decimals and thousands separators. Width is locked so layouts never jitter.',
  tags: ['new', 'fx', 'js'],
  keywords: ['counter', 'number animation', 'odometer', 'stats', 'kpi'],
  demos: [
    {
      title: 'Stats row',
      height: 240,
      html: `
<div class="demo-count-up-stats">
  <div><b data-count-up data-to="12480" data-suffix="+">0</b><span>Teams onboard</span></div>
  <div><b data-count-up data-to="99.98" data-suffix="%" data-from="90">0</b><span>Uptime last 12 months</span></div>
  <div><b data-count-up data-to="2.4" data-prefix="$" data-suffix="M" data-delay="200">0</b><span>Saved for customers</span></div>
  <div><b data-count-up data-to="38" data-suffix="ms" data-from="400" data-duration="2600">0</b><span>Median response</span></div>
</div>`,
      css: `.demo-count-up-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; width: 100%; max-width: 860px; }
.demo-count-up-stats > div { padding: 1.25rem; border-radius: var(--radius-lg); background: var(--card); border: 1px solid var(--border); display: grid; gap: .25rem; }
.demo-count-up-stats b { font-family: var(--font-display); font-size: 2.25rem; font-weight: 800; letter-spacing: -.03em; }
.demo-count-up-stats span { color: var(--muted-fg); font-size: .85rem; }`
    },
    {
      title: 'Live value',
      description: 'Call <code>Ranj.countUp(el, value)</code> to animate to a new number from wherever it is now.',
      html: `
<div class="demo-count-up-live">
  <span class="demo-count-up-label">Revenue today</span>
  <b data-count-up data-to="48210.5" data-prefix="$" data-decimals="2" data-trigger="load">0</b>
  <button class="btn btn-outline btn-sm" data-demo-bump>Simulate sale</button>
</div>`,
      js: `var n = root.querySelector('[data-count-up]'), v = 48210.5;
root.querySelector('[data-demo-bump]').onclick = function () { v += Math.round(Math.random() * 900 + 100) + .99; Ranj.countUp(n, v); };`,
      css: `.demo-count-up-live { display: grid; justify-items: center; gap: .5rem; }
.demo-count-up-label { color: var(--muted-fg); font-size: .85rem; }
.demo-count-up-live b { font-family: var(--font-display); font-size: 3rem; font-weight: 800; letter-spacing: -.03em; }`
    },
    {
      title: 'Separators & locales',
      html: `
<div class="demo-count-up-fmt">
  <span data-count-up data-to="1250000" data-separator=" " data-suffix=" €">0</span>
  <span data-count-up data-to="3141592.65" data-separator="." data-decimal="," data-decimals="2">0</span>
  <span data-count-up data-to="100" data-from="0" data-separator="" data-suffix="/100" data-duration="3000">0</span>
</div>`,
      css: `.demo-count-up-fmt { display: grid; gap: .5rem; text-align: center; font-size: 1.6rem; font-weight: 700; }`
    }
  ],
  api: [
    { name: 'data-count-up', type: 'attr', desc: 'Enables the counter. Target comes from <code>data-to</code> or the text.' },
    { name: 'data-to / data-from', type: 'attr', default: '— / 0', desc: 'End and start values (counting down works too).' },
    { name: 'data-duration / data-delay', type: 'attr', default: '2000 / 0', desc: 'Milliseconds. Ease-out-expo curve.' },
    { name: 'data-decimals', type: 'attr', default: 'auto', desc: 'Decimal places (inferred from <code>data-to</code>).' },
    { name: 'data-prefix / data-suffix', type: 'attr', desc: 'Text before / after the number.' },
    { name: 'data-separator / data-decimal', type: 'attr', default: ', / .', desc: 'Thousands separator (empty for none) and decimal mark.' },
    { name: 'data-trigger / data-repeat', type: 'attr', default: 'view / false', desc: '<code>load</code> to start immediately; repeat re-counts on re-entry.' },
    { name: 'Ranj.countUp(el, value)', type: 'js', desc: 'Animate to a new value.' },
    { name: 'ranj:done', type: 'event', desc: 'detail: <code>{ value }</code>' }
  ]
});

;
/* docs/registry/motion-cursor.js */
RanjDocs.add({
  id: 'cursor',
  name: 'Cursor Follower',
  group: 'Interactions',
  description: 'Custom cursors that are strictly opt-in: place a .cursor-follower inside any container and it only takes over there. Dot + ring that grows on links, gooey blob, ink trail and color splash.',
  tags: ['new', 'fx', 'js'],
  keywords: ['custom cursor', 'mouse follower', 'blob cursor', 'cursor trail', 'splash cursor', 'pointer'],
  demos: [
    {
      title: 'Dot + ring',
      description: 'Hover the links; elements with <code>data-cursor-text</code> show a label.',
      height: 320,
      html: `
<div class="demo-cursor-area">
  <div class="cursor-follower"></div>
  <h3>Selected work</h3>
  <div class="demo-cursor-links">
    <a href="#" onclick="return false">Lumen rebrand</a>
    <a href="#" onclick="return false">Vertex app</a>
    <a href="#" onclick="return false">Nimbus site</a>
  </div>
  <div class="demo-cursor-thumb" data-cursor-text="View">Case study</div>
</div>`,
      css: `.demo-cursor-area { width: 100%; max-width: 680px; min-height: 260px; padding: 2rem; border-radius: var(--radius-2xl); background: var(--card); border: 1px solid var(--border); display: grid; gap: 1rem; align-content: center; justify-items: center; text-align: center; }
.demo-cursor-links { display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
.demo-cursor-links a { color: var(--fg); font-weight: 600; }
.demo-cursor-thumb { width: 200px; height: 90px; border-radius: var(--radius-lg); display: grid; place-items: center; color: #fff; font-weight: 600; background: linear-gradient(135deg, #f97316, #ec4899); }`
    },
    {
      title: 'Variants',
      height: 300,
      html: `
<div class="demo-cursor-grid">
  <div class="demo-cursor-pane"><div class="cursor-follower" data-variant="blob" style="--cursor-color: #8b5cf6"></div><span>blob</span></div>
  <div class="demo-cursor-pane"><div class="cursor-follower" data-variant="trail" style="--cursor-color: #0ea5e9"></div><span>trail</span></div>
  <div class="demo-cursor-pane demo-cursor-dark"><div class="cursor-follower" data-variant="splash"></div><span>splash</span></div>
</div>`,
      css: `.demo-cursor-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; width: 100%; max-width: 820px; }
.demo-cursor-pane { height: 220px; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); display: grid; place-items: center; color: var(--muted-fg); font-family: var(--font-mono); font-size: .8rem; }
.demo-cursor-dark { background: #09090b; border-color: #1f1f23; }`
    }
  ],
  api: [
    { name: '.cursor-follower', type: 'class', desc: 'Place inside the container it should own (it overlays the parent). Hidden on touch devices and with reduced motion.' },
    { name: 'data-variant', type: 'attr', default: 'ring', desc: '<code>ring</code> (dot + ring), <code>dot</code>, <code>blob</code>, <code>trail</code>, <code>splash</code>.' },
    { name: 'data-scope', type: 'attr', default: 'parent', desc: '<code>page</code> follows the cursor across the whole document (use deliberately).' },
    { name: 'data-hide', type: 'attr', default: 'true', desc: 'Hide the native cursor inside the scope.' },
    { name: 'data-smoothing', type: 'attr', default: '0.16', desc: 'Ring follow factor per frame (lower is lazier).' },
    { name: 'data-cursor-text', type: 'attr', desc: 'On any element in scope: label shown inside the enlarged ring.' },
    { name: 'data-cursor', type: 'attr', desc: 'Mark any element as hoverable (links and buttons already are).' },
    { name: '--cursor-color / --cursor-size', type: 'var', default: 'var(--primary) / 36px', desc: 'Color and ring diameter.' }
  ]
});

;
/* docs/registry/motion-decrypt-text.js */
RanjDocs.add({
  id: 'decrypt-text',
  name: 'Decrypt Text',
  group: 'Text Effects',
  description: 'Characters scramble through random glyphs and decode into the real text, on view and again on hover. Choose the charset and reveal direction.',
  tags: ['new', 'fx', 'js'],
  keywords: ['scramble', 'decode', 'hacker', 'matrix', 'cipher', 'shuffle'],
  demos: [
    {
      title: 'Terminal',
      height: 300,
      bg: 'dark',
      html: `
<div class="demo-decrypt-text-term">
  <div class="demo-decrypt-text-bar"><i></i><i></i><i></i><span>secure-shell — 80×24</span></div>
  <p><span class="demo-decrypt-text-dim">$</span> <span data-decrypt data-speed="35">ssh ops@vault.internal --mfa</span></p>
  <p><span data-decrypt data-charset="hex" data-speed="30">Verifying key fingerprint 9F:2C:44:A1:0B</span></p>
  <p class="demo-decrypt-text-ok"><span data-decrypt data-charset="symbols" data-speed="45">ACCESS GRANTED — welcome back, Mira.</span></p>
</div>`,
      css: `.demo-decrypt-text-term { width: min(100%, 560px); border-radius: 12px; background: #0b0d12; border: 1px solid #23262f; color: #c9d1d9; font-family: var(--font-mono); font-size: .875rem; box-shadow: 0 30px 60px -20px rgb(0 0 0 / .6); overflow: hidden; }
.demo-decrypt-text-term p { padding: .2rem 1.1rem; }
.demo-decrypt-text-term p:last-child { padding-bottom: 1.1rem; }
.demo-decrypt-text-bar { display: flex; gap: .4rem; align-items: center; padding: .65rem .9rem; border-bottom: 1px solid #1d2028; margin-bottom: .6rem; color: #6b7280; font-size: .75rem; }
.demo-decrypt-text-bar i { width: .7rem; height: .7rem; border-radius: 50%; background: #ef4444; } .demo-decrypt-text-bar i:nth-child(2) { background: #f59e0b; } .demo-decrypt-text-bar i:nth-child(3) { background: #22c55e; }
.demo-decrypt-text-bar span { margin-left: .5rem; }
.demo-decrypt-text-dim { color: #6b7280; }
.demo-decrypt-text-ok { color: #4ade80; font-weight: 600; --dt-color: #22d3ee; }
.demo-decrypt-text-term .dt-enc { color: #818cf8; }`
    },
    {
      title: 'Hover navigation',
      description: 'Each link re-decodes when hovered or focused.',
      html: `
<nav class="demo-decrypt-text-nav">
  <a href="#" onclick="return false" data-decrypt data-trigger="hover">Work</a>
  <a href="#" onclick="return false" data-decrypt data-trigger="hover">Studio</a>
  <a href="#" onclick="return false" data-decrypt data-trigger="hover">Journal</a>
  <a href="#" onclick="return false" data-decrypt data-trigger="hover">Contact</a>
</nav>`,
      css: `.demo-decrypt-text-nav { display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .08em; font-weight: 600; }
.demo-decrypt-text-nav a { color: var(--fg); text-decoration: none !important; }`
    },
    {
      title: 'Reveal order & charsets',
      height: 260,
      html: `
<div class="demo-decrypt-text-list">
  <h3 data-decrypt data-order="center" data-speed="40">Revealed from the center out</h3>
  <h3 data-decrypt data-order="end" data-charset="binary">Right to left, in binary</h3>
  <h3 data-decrypt data-sequential="false" data-iterations="14" data-charset="alpha">All at once, then settle</h3>
</div>`,
      css: `.demo-decrypt-text-list { display: grid; gap: .75rem; text-align: center; }`
    }
  ],
  api: [
    { name: 'data-decrypt', type: 'attr', desc: 'Enables the effect on the element.' },
    { name: 'data-charset', type: 'attr', default: 'alnum', desc: '<code>alnum</code>, <code>alpha</code>, <code>hex</code>, <code>binary</code>, <code>symbols</code>, or any custom string of characters.' },
    { name: 'data-speed', type: 'attr', default: '40', desc: 'Milliseconds per scramble tick.' },
    { name: 'data-iterations', type: 'attr', default: '4', desc: 'Scramble ticks before characters start resolving.' },
    { name: 'data-step', type: 'attr', default: 'auto', desc: 'Characters resolved per tick.' },
    { name: 'data-order', type: 'attr', default: 'start', desc: 'Reveal order: start, end, center or random.' },
    { name: 'data-sequential', type: 'attr', default: 'true', desc: '<code>false</code> resolves characters in random order.' },
    { name: 'data-trigger', type: 'attr', default: 'view', desc: '<code>view</code>, <code>load</code> or <code>hover</code>.' },
    { name: 'data-hover', type: 'attr', default: 'true', desc: 'Also re-decode on hover/focus.' },
    { name: '--dt-color', type: 'var', default: 'var(--primary)', desc: 'Color of scrambled glyphs.' },
    { name: 'Ranj.decrypt(el)', type: 'js', desc: 'Replay the effect.' },
    { name: 'ranj:done', type: 'event', desc: 'Fires when fully decoded.' }
  ]
});

;
/* docs/registry/motion-dock.js */
(function () {
  var apps = [
    ['Files', 'linear-gradient(180deg,#60a5fa,#2563eb)', '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="4" width="17" height="16" rx="3" fill="#fff" fill-opacity=".18"/><path d="M12 4v16M8 9.5v1.5M16 9.5v1.5M8.5 15.5c2 1.5 5 1.5 7 0"/></svg>', true],
    ['Browser', 'linear-gradient(180deg,#e0f2fe,#38bdf8)', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="#0369a1" stroke-width="1.4"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z" fill="#ef4444"/><path d="m8.5 15.5 2.2-4.8 2.6 2.6z" fill="#fff"/></svg>', true],
    ['Messages', 'linear-gradient(180deg,#86efac,#16a34a)', '<svg viewBox="0 0 24 24"><path d="M12 4.5c4.7 0 8.5 3 8.5 6.8S16.7 18 12 18c-.9 0-1.8-.1-2.6-.3L5 19.5l1.2-3.3C4.5 15 3.5 13.2 3.5 11.3 3.5 7.5 7.3 4.5 12 4.5z" fill="#fff"/></svg>'],
    ['Mail', 'linear-gradient(180deg,#7dd3fc,#1d4ed8)', '<svg viewBox="0 0 24 24"><rect x="3.5" y="6" width="17" height="12" rx="2" fill="#fff"/><path d="m4 7 8 6 8-6" fill="none" stroke="#1d4ed8" stroke-width="1.6"/></svg>', true],
    ['Music', 'linear-gradient(180deg,#fb7185,#e11d48)', '<svg viewBox="0 0 24 24"><path d="M9 17.5V7l10-2v10.5" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="7" cy="17.5" r="2.4" fill="#fff"/><circle cx="17" cy="15.5" r="2.4" fill="#fff"/></svg>'],
    ['Photos', 'linear-gradient(180deg,#fff,#f4f4f5)', '<svg viewBox="0 0 24 24"><g opacity=".9"><ellipse cx="12" cy="7" rx="2.6" ry="4" fill="#f59e0b"/><ellipse cx="12" cy="17" rx="2.6" ry="4" fill="#3b82f6"/><ellipse cx="7" cy="12" rx="4" ry="2.6" fill="#22c55e"/><ellipse cx="17" cy="12" rx="4" ry="2.6" fill="#ec4899"/><ellipse cx="8.5" cy="8.5" rx="2.4" ry="3.6" transform="rotate(-45 8.5 8.5)" fill="#eab308"/><ellipse cx="15.5" cy="15.5" rx="2.4" ry="3.6" transform="rotate(-45 15.5 15.5)" fill="#8b5cf6"/><ellipse cx="15.5" cy="8.5" rx="2.4" ry="3.6" transform="rotate(45 15.5 8.5)" fill="#f97316"/><ellipse cx="8.5" cy="15.5" rx="2.4" ry="3.6" transform="rotate(45 8.5 15.5)" fill="#14b8a6"/></g></svg>'],
    ['Calendar', 'linear-gradient(180deg,#fff,#f4f4f5)', '<svg viewBox="0 0 24 24"><text x="12" y="8.5" text-anchor="middle" font-size="4.6" font-weight="700" fill="#ef4444" font-family="system-ui">MON</text><text x="12" y="19.5" text-anchor="middle" font-size="11" font-weight="300" fill="#18181b" font-family="system-ui">16</text></svg>'],
    ['Notes', 'linear-gradient(180deg,#fef08a 0 28%,#fefce8 28%)', '<svg viewBox="0 0 24 24" stroke="#a16207" stroke-width="1" opacity=".55"><path d="M5 11h14M5 14.5h14M5 18h10"/></svg>'],
    ['Settings', 'linear-gradient(180deg,#d4d4d8,#71717a)', '<svg viewBox="0 0 24 24" fill="none" stroke="#27272a" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6"/><circle cx="12" cy="12" r="6.5"/></svg>']
  ];
  function dock(list, extra) {
    return list.map(function (a) {
      return '  <button class="dock-item" data-label="' + a[0] + '" aria-label="' + a[0] + '"' + (a[3] ? ' data-active' : '') + '><span class="dock-icon" style="background:' + a[1] + '">' + a[2] + '</span></button>';
    }).join('\n') + (extra || '');
  }
  var trash = '\n  <span class="dock-sep" aria-hidden="true"></span>\n  <button class="dock-item" data-label="Trash" aria-label="Trash"><span class="dock-icon" style="background:linear-gradient(180deg,rgb(255 255 255 / .55),rgb(255 255 255 / .2));backdrop-filter:blur(4px)"><svg viewBox="0 0 24 24" fill="none" stroke="#52525b" stroke-width="1.4"><path d="M6 7h12l-1 13H7z" fill="rgb(255 255 255 / .5)"/><path d="M9.5 10v7M12 10v7M14.5 10v7M5 7h14"/></svg></span></button>';
  RanjDocs.add({
    id: 'dock',
    name: 'Dock',
    group: 'Motion',
    description: 'A macOS-style dock whose icons magnify smoothly with pointer proximity, with tooltips, running indicators, a bounce on click and arrow-key navigation.',
    tags: ['new', 'fx', 'js'],
    keywords: ['macos dock', 'magnification', 'app bar', 'toolbar', 'fisheye'],
    demos: [
      {
        title: 'Desktop dock',
        description: 'Glide across the icons. Click one to bounce it.',
        height: 300,
        pad: false,
        html: '\n<div class="demo-dock-desk">\n<div class="dock">\n' + dock(apps, trash) + '\n</div>\n</div>',
        css: '.demo-dock-desk { width: 100%; min-height: 300px; display: flex; align-items: flex-end; justify-content: center; padding: 1.5rem 1rem; background: radial-gradient(120% 90% at 20% 0%, #c4b5fd, transparent 60%), radial-gradient(100% 80% at 90% 10%, #f9a8d4, transparent 55%), linear-gradient(180deg, #818cf8, #312e81); }\n[data-theme="dark"] .demo-dock-desk { background: radial-gradient(120% 90% at 20% 0%, #4c1d95, transparent 60%), radial-gradient(100% 80% at 90% 10%, #831843, transparent 55%), linear-gradient(180deg, #1e1b4b, #09090b); }\n@media (max-width: 600px) { .demo-dock-desk .dock { --dock-size: 34px; --dock-max: 54px; --dock-gap: .3rem; } .demo-dock-desk .dock-item:nth-child(n+7):nth-child(-n+9) { display: none; } }'
      },
      {
        title: 'Compact, tighter range',
        height: 200,
        html: '\n<div class="dock" style="--dock-size: 40px; --dock-max: 64px" data-distance="110">\n' + dock(apps.slice(0, 6)) + '\n</div>'
      }
    ],
    api: [
      { name: '.dock', type: 'class', desc: 'The bar (role="toolbar"; ← → move focus).' },
      { name: '.dock-item', type: 'class', desc: 'A button or link. <code>data-label</code> shows a tooltip; <code>data-active</code> shows the running dot.' },
      { name: '.dock-icon / .dock-sep', type: 'class', desc: 'Icon tile inside an item / divider.' },
      { name: 'data-distance', type: 'attr', default: '150', desc: 'Influence radius in px.' },
      { name: 'data-bounce', type: 'attr', default: 'true', desc: 'Bounce the icon on click.' },
      { name: '--dock-size / --dock-max / --dock-gap', type: 'var', default: '48px / 84px / .5rem', desc: 'Resting size, max magnified size, spacing (px values).' },
      { name: 'ranj:select', type: 'event', desc: 'detail: <code>{ item, label }</code>' }
    ]
  });
})();

;
/* docs/registry/motion-flip-card.js */
RanjDocs.add({
  id: 'flip-card',
  name: 'Flip Card',
  group: 'Motion',
  description: 'A two-sided card that flips in 3D on hover, or on click and keyboard with .flip-card-click. Horizontal or vertical axis, auto height.',
  tags: ['new', 'fx'],
  keywords: ['3d flip', 'card flip', 'back side', 'reveal card', 'rotate'],
  demos: [
    {
      title: 'Payment card (hover)',
      height: 280,
      html: `
<div class="flip-card" style="--flip-w: 340px">
  <div class="flip-card-inner">
    <div class="flip-card-front demo-flip-card-cc">
      <div class="demo-flip-card-row"><span class="demo-flip-card-chip"></span><b>RANJ</b></div>
      <div class="demo-flip-card-num">4921 •••• •••• 0428</div>
      <div class="demo-flip-card-row"><span>ALEX MORGAN</span><span>09/29</span></div>
    </div>
    <div class="flip-card-back demo-flip-card-cc demo-flip-card-back">
      <div class="demo-flip-card-stripe"></div>
      <div class="demo-flip-card-cvc"><span>CVC</span><b>•••</b></div>
      <small>Hover away to flip back</small>
    </div>
  </div>
</div>`,
      css: `.demo-flip-card-cc { aspect-ratio: 1.586; padding: 1.25rem 1.4rem; color: #fff; display: flex; flex-direction: column; justify-content: space-between; background: radial-gradient(120% 120% at 0% 0%, #818cf8, #4338ca 45%, #1e1b4b); box-shadow: 0 25px 50px -15px rgb(30 27 75 / .6); }
.demo-flip-card-row { display: flex; justify-content: space-between; align-items: center; font-size: .8rem; letter-spacing: .08em; }
.demo-flip-card-row b { font-size: 1.1rem; letter-spacing: .15em; }
.demo-flip-card-chip { width: 42px; height: 32px; border-radius: 6px; background: linear-gradient(135deg, #fde68a, #d97706); }
.demo-flip-card-num { font-family: var(--font-mono); font-size: 1.2rem; letter-spacing: .1em; }
.demo-flip-card-back { justify-content: flex-start; gap: 1rem; padding: 1.25rem 0; background: linear-gradient(135deg, #312e81, #1e1b4b); }
.demo-flip-card-stripe { height: 42px; background: #0b0a1f; }
.demo-flip-card-cvc { display: flex; justify-content: flex-end; align-items: center; gap: .6rem; margin: 0 1.4rem; padding: .4rem .7rem; border-radius: 4px; background: #e0e7ff; color: #1e1b4b; font-size: .75rem; }
.demo-flip-card-back small { margin: auto 1.4rem 0; opacity: .6; font-size: .72rem; }`
    },
    {
      title: 'Click to flip (vertical)',
      height: 320,
      html: `
<div class="flip-card flip-card-click flip-card-vertical" style="--flip-w: 280px" aria-label="Profile card, press to flip">
  <div class="flip-card-inner">
    <div class="flip-card-front demo-flip-card-face">
      <div class="demo-flip-card-avatar">SK</div>
      <b>Sana Kapoor</b><span>Staff Design Engineer</span>
      <small>Click to see stats ↻</small>
    </div>
    <div class="flip-card-back demo-flip-card-face demo-flip-card-face-back">
      <div class="demo-flip-card-stats"><div><b>128</b><span>Shipped</span></div><div><b>4.9</b><span>Rating</span></div><div><b>9y</b><span>Exp.</span></div></div>
      <a class="btn btn-primary btn-sm" href="#" onclick="return false">View profile</a>
    </div>
  </div>
</div>`,
      css: `.demo-flip-card-face { min-height: 240px; padding: 1.5rem; display: grid; place-content: center; justify-items: center; gap: .3rem; text-align: center; background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-lg); }
.demo-flip-card-face span { color: var(--muted-fg); font-size: .875rem; } .demo-flip-card-face small { margin-top: .75rem; color: var(--muted-fg); font-size: .75rem; }
.demo-flip-card-avatar { width: 72px; height: 72px; border-radius: 50%; display: grid; place-items: center; margin-bottom: .5rem; font-weight: 800; font-size: 1.4rem; color: #fff; background: linear-gradient(135deg, #14b8a6, #6366f1); }
.demo-flip-card-face-back { gap: 1.25rem; background: linear-gradient(160deg, var(--primary-soft), var(--card)); }
.demo-flip-card-stats { display: flex; gap: 1.5rem; } .demo-flip-card-stats div { display: grid; } .demo-flip-card-stats b { font-size: 1.5rem; }`
    }
  ],
  api: [
    { name: '.flip-card', type: 'class', desc: 'Wrapper; flips on hover and focus-within.' },
    { name: '.flip-card-inner / -front / -back', type: 'class', desc: 'Required structure. Height follows the taller face.' },
    { name: '.flip-card-click', type: 'class', desc: 'Flip on click / Enter / Space instead of hover (ranj.js sets role and aria-pressed).' },
    { name: '.flip-card-vertical', type: 'class', desc: 'Flip around the X axis.' },
    { name: 'data-state="flipped"', type: 'attr', desc: 'Set to flip programmatically.' },
    { name: '--flip-dur / --flip-w / --flip-h', type: 'var', default: '700ms / 280px / auto', desc: 'Duration, width and min height.' },
    { name: 'ranj:flip', type: 'event', desc: 'detail: <code>{ flipped }</code> (click mode).' }
  ]
});

;
/* docs/registry/motion-flowing-menu.js */
RanjDocs.add({
  id: 'flowing-menu',
  name: 'Flowing Menu',
  group: 'Motion',
  description: 'Big editorial menu rows where a marquee band slides in from whichever edge the cursor entered and exits toward the edge it leaves.',
  tags: ['new', 'fx', 'js'],
  keywords: ['menu hover', 'marquee menu', 'fullscreen menu', 'navigation', 'editorial'],
  demos: [
    {
      title: 'Studio menu',
      pad: false,
      html: `
<nav class="flowing-menu demo-flowing-menu" aria-label="Main">
  <a class="fm-item" href="#" onclick="return false" data-gradient="linear-gradient(135deg,#f97316,#ec4899)">Work</a>
  <a class="fm-item" href="#" onclick="return false" data-gradient="linear-gradient(135deg,#22d3ee,#6366f1)">Studio</a>
  <a class="fm-item" href="#" onclick="return false" data-gradient="linear-gradient(135deg,#a3e635,#14b8a6)">Journal</a>
  <a class="fm-item" href="#" onclick="return false" data-gradient="linear-gradient(135deg,#f472b6,#8b5cf6)">Contact</a>
</nav>`,
      css: `.demo-flowing-menu { width: 100%; }`
    },
    {
      title: 'Accent band',
      pad: false,
      html: `
<nav class="flowing-menu" style="--fm-bg: var(--primary); --fm-fg: var(--primary-fg); --fm-speed: 9s; width: 100%" aria-label="Services">
  <a class="fm-item" href="#" onclick="return false">Branding</a>
  <a class="fm-item" href="#" onclick="return false">Product design</a>
  <a class="fm-item" href="#" onclick="return false">Engineering</a>
</nav>`
    }
  ],
  api: [
    { name: '.flowing-menu', type: 'class', desc: 'Container (usually a <code>&lt;nav&gt;</code>).' },
    { name: '.fm-item', type: 'class', desc: 'A row (link). Band text defaults to the link text.' },
    { name: 'data-text', type: 'attr', desc: 'Override the band text.' },
    { name: 'data-image / data-gradient', type: 'attr', desc: 'Fill for the pill chips between repeats (image URL or any CSS background).' },
    { name: '--fm-bg / --fm-fg / --fm-speed', type: 'var', default: 'var(--fg) / var(--bg) / 14s', desc: 'Band colors and marquee loop time.' }
  ]
});

;
/* docs/registry/motion-glare-hover.js */
RanjDocs.add({
  id: 'glare-hover',
  name: 'Glare Hover',
  group: 'Interactions',
  description: 'A diagonal band of light sweeps across the surface on hover, like light catching glass. Pure CSS; a loop variant sweeps on its own.',
  tags: ['new', 'fx'],
  keywords: ['shine', 'sheen', 'glass', 'light sweep', 'hover shine'],
  demos: [
    {
      title: 'Cards & buttons',
      height: 300,
      html: `
<div class="glare-hover demo-glare-hover-card"><b>Hover me</b><span>The glare follows a 45° path.</span></div>
<button class="btn btn-primary btn-lg glare-hover">Upgrade to Pro</button>
<div class="glare-hover glare-hover-loop demo-glare-hover-card demo-glare-hover-dark" style="--glare-color: rgb(255 255 255 / .35)"><b>Looping</b><span>.glare-hover-loop</span></div>`,
      css: `.demo-glare-hover-card { width: 220px; height: 150px; border-radius: var(--radius-xl); padding: 1.25rem; display: flex; flex-direction: column; justify-content: flex-end; color: #fff; background: linear-gradient(135deg, #f97316, #db2777); box-shadow: var(--shadow-lg); }
.demo-glare-hover-card span { opacity: .8; font-size: .85rem; }
.demo-glare-hover-dark { background: linear-gradient(135deg, #1e293b, #0f172a); }`
    }
  ],
  api: [
    { name: '.glare-hover', type: 'class', desc: 'Sweep on hover / focus-visible.' },
    { name: '.glare-hover-loop', type: 'class', desc: 'Sweep automatically every 3.5s.' },
    { name: '--glare-color', type: 'var', default: 'rgb(255 255 255 / .55)', desc: 'Light color.' },
    { name: '--glare-angle / --glare-band / --glare-dur', type: 'var', default: '-45deg / 18% / 750ms', desc: 'Angle, band width and sweep time.' }
  ]
});

;
/* docs/registry/motion-glitch-text.js */
RanjDocs.add({
  id: 'glitch-text',
  name: 'Glitch Text',
  group: 'Text Effects',
  description: 'RGB-split slices jitter across the text like a corrupted signal. CSS driven; the script only copies the text into data-text for you.',
  tags: ['new', 'fx'],
  keywords: ['glitch', 'cyberpunk', 'distortion', 'rgb split', 'error'],
  demos: [
    {
      title: 'Always on',
      bg: 'dark',
      height: 260,
      html: `
<h1 class="glitch-text demo-glitch-text-h">SIGNAL LOST</h1>`,
      css: `.demo-glitch-text-h { font-size: clamp(2.5rem, 1.5rem + 5vw, 5.5rem); font-weight: 900; letter-spacing: -.02em; color: #fff; }`
    },
    {
      title: 'On hover, custom colors',
      html: `
<a href="#" onclick="return false" class="glitch-text glitch-text-hover demo-glitch-text-link" style="--glitch-a:#f59e0b; --glitch-b:#22c55e; --glitch-speed:1.2s">Enter the void →</a>`,
      css: `.demo-glitch-text-link { font-size: 2rem; font-weight: 800; color: var(--fg); text-decoration: none !important; }`
    }
  ],
  api: [
    { name: '.glitch-text', type: 'class', desc: 'Always-on glitch.' },
    { name: '.glitch-text-hover', type: 'class', desc: 'Only while hovered or focused.' },
    { name: 'data-text', type: 'attr', desc: 'Copy of the text for the slice layers (filled automatically by ranj.js).' },
    { name: '--glitch-a / --glitch-b', type: 'var', default: '#ff2bd6 / #00e5ff', desc: 'Offset channel colors.' },
    { name: '--glitch-speed', type: 'var', default: '2.4s', desc: 'Slice cycle duration.' },
    { name: '--glitch-bg', type: 'var', default: 'transparent', desc: 'Set to the surface color for a harder, cleaner slice.' }
  ]
});

;
/* docs/registry/motion-gradient-text.js */
RanjDocs.add({
  id: 'gradient-text',
  name: 'Gradient Text',
  group: 'Text Effects',
  description: 'Text filled with a slowly flowing gradient. The default follows your accent hue; presets and a single CSS variable give you any palette.',
  tags: ['new', 'fx'],
  keywords: ['animated gradient', 'rainbow', 'colorful text', 'aurora'],
  demos: [
    {
      title: 'Hero',
      height: 260,
      html: `
<h1 class="display-1 demo-gradient-text-h">Design at the <span class="gradient-text">speed of thought</span></h1>`,
      css: `.demo-gradient-text-h { text-align: center; max-width: 820px; }`
    },
    {
      title: 'Presets',
      height: 320,
      html: `
<div class="demo-gradient-text-list">
  <h2 class="gradient-text gradient-text-aurora">Aurora</h2>
  <h2 class="gradient-text gradient-text-sunset">Sunset</h2>
  <h2 class="gradient-text gradient-text-ocean">Ocean</h2>
  <h2 class="gradient-text gradient-text-candy">Candy</h2>
  <h2 class="gradient-text gradient-text-mono">Monochrome</h2>
</div>`,
      css: `.demo-gradient-text-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem 2rem; width: 100%; max-width: 820px; text-align: center; }
.demo-gradient-text-list h2 { font-size: 2.25rem; }`
    },
    {
      title: 'Custom colors, angle & speed',
      description: 'Pass any comma-separated color list through <code>--gt-colors</code>.',
      html: `
<h2 class="gradient-text demo-gradient-text-custom" style="--gt-colors: #84cc16, #22d3ee, #6366f1, #84cc16; --gt-speed: 3s; --gt-angle: 120deg">Fresh greens &amp; blues</h2>
<h2 class="gradient-text gradient-text-static gradient-text-sunset demo-gradient-text-custom">Static, no motion</h2>`,
      css: `.demo-gradient-text-custom { font-size: 2.5rem; }`
    }
  ],
  api: [
    { name: '.gradient-text', type: 'class', desc: 'Animated gradient fill. Works inline across line breaks.' },
    { name: '.gradient-text-aurora / -sunset / -ocean / -candy / -mono', type: 'class', desc: 'Palette presets.' },
    { name: '.gradient-text-static', type: 'class', desc: 'No animation.' },
    { name: '--gt-colors', type: 'var', default: 'accent hues', desc: 'Comma-separated color stops.' },
    { name: '--gt-speed', type: 'var', default: '6s', desc: 'Half-cycle duration (it flows back and forth).' },
    { name: '--gt-angle / --gt-mult', type: 'var', default: '90deg / 3', desc: 'Gradient angle and how much wider than the text it is.' }
  ],
  notes: '<p>Combine with <a href="#/c/split-text">Split Text</a>: each piece receives its slice of the gradient, so the color stays continuous while letters animate.</p>'
});

;
/* docs/registry/motion-highlight-text.js */
RanjDocs.add({
  id: 'highlight-text',
  name: 'Highlight Text',
  group: 'Text Effects',
  description: 'Hand-drawn annotations that draw themselves when the text scrolls into view: marker, underline, scribble, double, circle, box and strike-through.',
  tags: ['new', 'fx', 'js'],
  keywords: ['marker', 'annotate', 'rough notation', 'underline', 'circle', 'emphasis', 'highlighter'],
  demos: [
    {
      title: 'In a paragraph',
      height: 300,
      html: `
<p class="demo-highlight-text-p">
  Ranj UI is <mark class="hl-text">zero dependency</mark>, so it works in
  <mark class="hl-text" data-variant="underline" data-delay="500">any stack</mark>. It ships
  <mark class="hl-text" data-variant="circle" data-delay="1000">160+</mark> components that are
  <mark class="hl-text" data-variant="box" data-delay="1500">accessible</mark> by default, and it's
  <mark class="hl-text" data-variant="strike" data-delay="2000">expensive</mark> free forever.
</p>`,
      css: `.demo-highlight-text-p { max-width: 640px; font-size: clamp(1.25rem, 1rem + 1vw, 1.75rem); font-weight: 600; line-height: 1.7; letter-spacing: -.015em; text-align: center; }`
    },
    {
      title: 'All variants',
      height: 280,
      html: `
<div class="demo-highlight-text-grid">
  <span><mark class="hl-text">marker</mark></span>
  <span><mark class="hl-text" data-variant="underline">underline</mark></span>
  <span><mark class="hl-text" data-variant="scribble">scribble</mark></span>
  <span><mark class="hl-text" data-variant="double">double</mark></span>
  <span><mark class="hl-text" data-variant="circle">circle</mark></span>
  <span><mark class="hl-text" data-variant="box">box</mark></span>
  <span><mark class="hl-text" data-variant="strike">strike</mark></span>
  <span><mark class="hl-text" data-variant="underline" style="--hl-stroke: var(--destructive); --hl-width: 4px">custom</mark></span>
</div>`,
      css: `.demo-highlight-text-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1.75rem 1rem; width: 100%; max-width: 720px; text-align: center; font-size: 1.4rem; font-weight: 700; }`
    }
  ],
  api: [
    { name: '.hl-text', type: 'class', desc: 'Put on a <code>&lt;mark&gt;</code> or <code>&lt;span&gt;</code>. Default is a marker highlight that wraps across lines.' },
    { name: 'data-variant', type: 'attr', default: 'marker', desc: 'marker, underline, scribble, double, circle, box, strike (SVG variants are single-line).' },
    { name: 'data-delay / data-duration', type: 'attr', default: '0 / 900', desc: 'Milliseconds; chain several by staggering delays.' },
    { name: 'data-trigger / data-repeat', type: 'attr', default: 'view / false', desc: '<code>load</code> or <code>hover</code>; repeat redraws on re-entry.' },
    { name: '--hl-color', type: 'var', default: 'soft yellow', desc: 'Marker fill.' },
    { name: '--hl-stroke / --hl-width', type: 'var', default: 'var(--primary) / 2.5px', desc: 'Line color and thickness.' }
  ]
});

;
/* docs/registry/motion-hover-effects.js */
RanjDocs.add({
  id: 'hover-effects',
  name: 'Hover Effects',
  group: 'Interactions',
  description: 'Tiny CSS utilities for tactile feedback: lift, press, scale, glow, sheen, underline, float, wiggle and jelly. Mix them on anything.',
  tags: ['new', 'fx'],
  keywords: ['hover lift', 'press scale', 'utilities', 'micro interaction', 'glow hover', 'underline animation'],
  demos: [
    {
      title: 'Cards',
      height: 280,
      html: `
<div class="demo-hover-effects-card fx-lift">.fx-lift</div>
<div class="demo-hover-effects-card fx-glow-hover">.fx-glow-hover</div>
<div class="demo-hover-effects-card fx-scale">.fx-scale</div>
<div class="demo-hover-effects-card fx-sheen fx-lift">.fx-sheen</div>`,
      css: `.demo-hover-effects-card { width: 170px; height: 120px; border-radius: var(--radius-xl); display: grid; place-items: center; background: var(--card); border: 1px solid var(--border); font-family: var(--font-mono); font-size: .8rem; box-shadow: var(--shadow-sm); cursor: pointer; }`
    },
    {
      title: 'Buttons & links',
      height: 220,
      html: `
<button class="btn btn-primary btn-lg fx-press">.fx-press</button>
<button class="btn btn-outline btn-lg fx-jelly">.fx-jelly</button>
<button class="btn btn-secondary btn-lg fx-wiggle">.fx-wiggle 🔔</button>
<a href="#" onclick="return false" class="fx-underline demo-hover-effects-link">.fx-underline link</a>
<span class="fx-float demo-hover-effects-float">🎈 .fx-float</span>`,
      css: `.demo-hover-effects-link { color: var(--fg); font-weight: 600; } .demo-hover-effects-float { display: inline-block; font-weight: 600; }`
    }
  ],
  api: [
    { name: '.fx-lift', type: 'class', desc: 'Rise 4px with a bigger shadow.' },
    { name: '.fx-press', type: 'class', desc: 'Scale to .96 while pressed.' },
    { name: '.fx-scale', type: 'class', desc: 'Springy 1.04 scale on hover.' },
    { name: '.fx-glow-hover', type: 'class', desc: 'Accent ring and glow on hover.' },
    { name: '.fx-sheen', type: 'class', desc: 'One light sweep per hover.' },
    { name: '.fx-underline', type: 'class', desc: 'Underline grows from the left.' },
    { name: '.fx-float', type: 'class', desc: 'Gentle idle float loop.' },
    { name: '.fx-wiggle / .fx-jelly', type: 'class', desc: 'Playful hover animations.' },
    { name: '.fx-icon-slide', type: 'class', desc: 'Nudges the trailing icon of a button on hover.' }
  ]
});

;
/* docs/registry/motion-magnetic.js */
RanjDocs.add({
  id: 'magnetic',
  name: 'Magnetic',
  group: 'Interactions',
  description: 'Elements are pulled toward the cursor when it comes near, then spring back. An optional inner layer travels further for a parallax feel.',
  tags: ['new', 'fx', 'js'],
  keywords: ['magnet', 'cursor pull', 'attract', 'hover follow', 'button'],
  demos: [
    {
      title: 'Buttons',
      height: 260,
      html: `
<div class="demo-magnetic-btns">
  <button class="btn btn-primary btn-lg" data-magnetic><span data-magnetic-inner>Get started →</span></button>
  <button class="btn btn-outline btn-lg" data-magnetic="0.5" data-magnetic-area="100">Stronger pull</button>
</div>`,
      css: `.demo-magnetic-btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 4rem 7rem; }`
    },
    {
      title: 'Social icons',
      height: 220,
      html: `
<div class="demo-magnetic-row">
  <a href="#" onclick="return false" class="demo-magnetic-ic" data-magnetic="0.45" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg></a>
  <a href="#" onclick="return false" class="demo-magnetic-ic" data-magnetic="0.45" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg></a>
  <a href="#" onclick="return false" class="demo-magnetic-ic" data-magnetic="0.45" aria-label="Dribbble"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><path d="M5 5.5c4 4 9.5 5 16 4M3 13c5-2 11-1.5 15.5 6.5M8.5 3.2c3 3.8 5.5 10 6.3 17.7"/></svg></a>
  <a href="#" onclick="return false" class="demo-magnetic-ic" data-magnetic="0.45" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg></a>
</div>`,
      css: `.demo-magnetic-row { display: flex; gap: 1.25rem; }
.demo-magnetic-ic { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; color: var(--fg); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-md); transition: background .2s, color .2s; }
.demo-magnetic-ic:hover { background: var(--fg); color: var(--bg); }
.demo-magnetic-ic svg { width: 22px; height: 22px; }`
    }
  ],
  api: [
    { name: 'data-magnetic', type: 'attr', default: '0.35', desc: 'Pull strength (fraction of the cursor offset).' },
    { name: 'data-magnetic-area', type: 'attr', default: '70', desc: 'Extra px around the element where the pull starts.' },
    { name: 'data-magnetic-inner', type: 'attr', desc: 'On a child: moves an extra 60% for depth.' }
  ],
  notes: '<p>Disabled for touch input and reduced motion. Uses one passive pointer listener per element, only while it is on screen.</p>'
});

;
/* docs/registry/motion-marquee.js */
(function () {
  var L = {
    lumen: '<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="4.5" fill="#f59e0b"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>Lumen',
    vertex: '<svg viewBox="0 0 24 24"><path d="M12 2.5 22 20H2z" fill="#6366f1"/><path d="M12 9.5 16.5 17h-9z" fill="#c7d2fe"/></svg>Vertex',
    nimbus: '<svg viewBox="0 0 24 24"><path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.5a4.75 4.75 0 0 1-.5 9.5z" fill="#0ea5e9"/></svg>Nimbus',
    quanta: '<svg viewBox="0 0 24 24"><rect x="4.5" y="4.5" width="15" height="15" rx="3.5" transform="rotate(45 12 12)" fill="#10b981"/><circle cx="12" cy="12" r="3" fill="#d1fae5"/></svg>Quanta',
    helix: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round"><path d="M6 3c0 6 12 6 12 12s-12 6-12 6" stroke="#ec4899"/><path d="M18 3c0 6-12 6-12 12" stroke="#f9a8d4"/></svg>Helix',
    polaris: '<svg viewBox="0 0 24 24"><path d="m12 1.5 2.6 7.9H23l-6.8 4.9 2.6 8-6.8-4.9-6.8 4.9 2.6-8L1 9.4h8.4z" fill="#8b5cf6"/></svg>Polaris',
    orbitly: '<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#f43f5e" stroke-width="2" transform="rotate(-30 12 12)"/><circle cx="12" cy="12" r="3.6" fill="#f43f5e"/></svg>Orbitly',
    kinetic: '<svg viewBox="0 0 24 24" fill="#14b8a6"><rect x="3" y="12" width="4" height="9" rx="1.5"/><rect x="10" y="7" width="4" height="14" rx="1.5"/><rect x="17" y="3" width="4" height="18" rx="1.5"/></svg>Kinetic'
  };
  function logos(keys) { return keys.map(function (k) { return '    <span class="marquee-logo">' + L[k] + '</span>'; }).join('\n'); }
  var all = ['lumen', 'vertex', 'nimbus', 'quanta', 'helix', 'polaris', 'orbitly', 'kinetic'];
  var rot = function (n) { return all.slice(n).concat(all.slice(0, n)); };

  RanjDocs.add({
    id: 'marquee',
    name: 'Marquee',
    group: 'Motion',
    description: 'Infinite, seamless scrolling rows for logos, testimonials or tickers. Content is duplicated automatically to fill any width, with pause-on-hover, reverse, vertical, faded edges and a constant px/s speed.',
    tags: ['new', 'fx', 'js'],
    keywords: ['ticker', 'logo cloud', 'infinite scroll', 'carousel', 'logos', 'scrolling banner'],
    demos: [
      {
        title: 'Logo marquee',
        html: '\n<div class="marquee marquee-fade marquee-pause" data-speed="60" style="width:100%">\n  <div class="marquee-content">\n' + logos(all) + '\n  </div>\n</div>'
      },
      {
        title: 'Alternating logo wall',
        description: 'Stack rows in a <code>.marquee-wall</code> and reverse every other one.',
        height: 300,
        html: '\n<div class="marquee-wall demo-marquee-wall">\n  <div class="marquee marquee-fade marquee-pause" data-speed="45">\n    <div class="marquee-content">\n' + logos(all) + '\n    </div>\n  </div>\n  <div class="marquee marquee-fade marquee-pause marquee-reverse" data-speed="35">\n    <div class="marquee-content">\n' + logos(rot(3)) + '\n    </div>\n  </div>\n  <div class="marquee marquee-fade marquee-pause" data-speed="55">\n    <div class="marquee-content">\n' + logos(rot(5)) + '\n    </div>\n  </div>\n</div>',
        css: '.demo-marquee-wall { width: 100%; }'
      },
      {
        title: 'Skewed ticker',
        bg: 'none',
        pad: false,
        height: 220,
        html: `
<div class="demo-marquee-ticks">
  <div class="marquee marquee-skew demo-marquee-band" data-speed="90">
    <div class="marquee-content">
      <span>Zero dependencies</span><b>✦</b><span>160+ components</span><b>✦</b><span>Dark mode</span><b>✦</b><span>Accessible</span><b>✦</b><span>MIT licensed</span><b>✦</b>
    </div>
  </div>
</div>`,
        css: `.demo-marquee-ticks { width: 100%; overflow: hidden; padding: 3rem 0; }
.demo-marquee-band { --gap: 1.5rem; padding: 1rem 0; background: var(--primary); color: var(--primary-fg); font-family: var(--font-display); font-weight: 800; font-size: clamp(1.25rem, 1rem + 1.5vw, 2rem); letter-spacing: -.02em; text-transform: uppercase; box-shadow: var(--shadow-glow); }
.demo-marquee-band b { opacity: .6; }`
      },
      {
        title: 'Vertical',
        height: 340,
        html: `
<div class="marquee marquee-vertical marquee-fade marquee-pause demo-marquee-v" data-speed="30">
  <div class="marquee-content">
    <div class="demo-marquee-row"><b>Deploy succeeded</b><span>web-app · main · 42s</span></div>
    <div class="demo-marquee-row"><b>New signup</b><span>maya@lumen.io · Pro plan</span></div>
    <div class="demo-marquee-row"><b>Invoice paid</b><span>$1,240.00 · Vertex Inc.</span></div>
    <div class="demo-marquee-row"><b>PR merged</b><span>#482 Faster cold starts</span></div>
    <div class="demo-marquee-row"><b>Alert resolved</b><span>p95 latency back to 120ms</span></div>
  </div>
</div>`,
        css: `.demo-marquee-v { height: 280px; width: min(100%, 320px); --gap: .6rem; }
.demo-marquee-row { display: grid; gap: .1rem; padding: .8rem 1rem; border-radius: var(--radius-lg); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-sm); font-size: .85rem; }
.demo-marquee-row span { color: var(--muted-fg); font-size: .78rem; }`
      }
    ],
    api: [
      { name: '.marquee', type: 'class', desc: 'Container. Wrap content in <code>.marquee-content</code> (created automatically if missing).' },
      { name: '.marquee-reverse / .marquee-vertical', type: 'class', desc: 'Direction modifiers.' },
      { name: '.marquee-pause', type: 'class', desc: 'Pause on hover and focus-within. <code>data-paused</code> pauses programmatically.' },
      { name: '.marquee-fade', type: 'class', desc: 'Fade the edges with a mask (<code>--fade</code> sets the width).' },
      { name: '.marquee-wall / .marquee-skew', type: 'class', desc: 'Stack several rows / tilt a band.' },
      { name: '.marquee-logo', type: 'class', desc: 'Ready-made logo tile.' },
      { name: 'data-speed', type: 'attr', default: '0', desc: 'Constant speed in px per second (overrides <code>--duration</code>).' },
      { name: 'data-clones', type: 'attr', default: 'auto', desc: 'Force a number of duplicated copies.' },
      { name: '--duration / --gap', type: 'var', default: '30s / 1rem', desc: 'Loop time per copy and spacing.' }
    ],
    notes: '<p>Clones are <code>aria-hidden</code> and <code>inert</code>, so screen readers and keyboard users see the content once.</p>'
  });
})();

;
/* docs/registry/motion-orbit.js */
(function () {
  var I = {
    figma: '<svg viewBox="0 0 24 24"><circle cx="15" cy="12" r="3.2" fill="#1abcfe"/><path d="M8.8 2.5h3.2v6.4H8.8a3.2 3.2 0 0 1 0-6.4z" fill="#f24e1e"/><path d="M12 2.5h3.2a3.2 3.2 0 0 1 0 6.4H12z" fill="#ff7262"/><path d="M8.8 8.9H12v6.3H8.8a3.2 3.2 0 0 1 0-6.3z" fill="#a259ff"/><path d="M8.8 15.2H12v3.2a3.2 3.2 0 1 1-3.2-3.2z" fill="#0acf83"/></svg>',
    bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="#f59e0b"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5"/></svg>',
    cloud: '<svg viewBox="0 0 24 24"><path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.5a4.75 4.75 0 0 1-.5 9.5z" fill="#0ea5e9"/></svg>',
    db: '<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" fill="#ec4899"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="#8b5cf6"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2.5" fill="#f43f5e"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="#f43f5e" stroke-width="2.2"/></svg>'
  };
  function icons(keys) { return keys.map(function (k) { return '    <span class="orbit-icon">' + I[k] + '</span>'; }).join('\n'); }
  RanjDocs.add({
    id: 'orbit',
    name: 'Orbit',
    group: 'Motion',
    description: 'Icons orbiting a center on one or more rings. Items are spaced automatically, stay upright while they travel, and rings can spin in opposite directions.',
    tags: ['new', 'fx', 'js'],
    keywords: ['orbiting circles', 'integrations', 'planets', 'rotate around', 'satellite'],
    demos: [
      {
        title: 'Integrations',
        height: 420,
        html: '\n<div class="orbit" style="--orbit-size: 360px">\n  <div class="orbit-center demo-orbit-core">R</div>\n  <div class="orbit-ring orbit-pause" style="--radius: 82px; --duration: 18s">\n' + icons(['bolt', 'code', 'cloud']) + '\n  </div>\n  <div class="orbit-ring orbit-reverse orbit-pause" style="--radius: 150px; --duration: 32s">\n' + icons(['figma', 'db', 'heart', 'chat', 'lock']) + '\n  </div>\n</div>',
        css: '.demo-orbit-core { width: 72px; height: 72px; border-radius: 22px; display: grid; place-items: center; font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: #fff; background: linear-gradient(135deg, var(--primary), oklch(.7 .2 calc(var(--hue) + 60))); box-shadow: var(--shadow-glow); }'
      },
      {
        title: 'Responsive radius & solid rings',
        description: 'A <code>data-radius</code> ≤ 1 is a fraction of the orbit radius (half its width), so it scales with the container.',
        height: 340,
        html: '\n<div class="orbit" style="--orbit-size: 300px">\n  <div class="orbit-center demo-orbit-sun">☀️</div>\n  <div class="orbit-ring orbit-solid" data-radius="0.38" data-duration="10">\n    <span class="demo-orbit-planet" style="background:#94a3b8"></span>\n  </div>\n  <div class="orbit-ring orbit-solid" data-radius="0.62" data-duration="16" data-offset="120">\n    <span class="demo-orbit-planet" style="background:#f59e0b;width:16px;height:16px"></span>\n  </div>\n  <div class="orbit-ring orbit-solid" data-radius="0.9" data-duration="26" data-offset="240">\n    <span class="demo-orbit-planet" style="background:#3b82f6;width:20px;height:20px"></span>\n    <span class="demo-orbit-planet" style="background:#ef4444"></span>\n  </div>\n</div>',
        css: '.demo-orbit-sun { font-size: 2.5rem; filter: drop-shadow(0 0 18px #fbbf24); } .demo-orbit-planet { display: block; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 12px currentColor; }'
      }
    ],
    api: [
      { name: '.orbit', type: 'class', desc: 'Square stage (<code>--orbit-size</code>, default 340px).' },
      { name: '.orbit-center', type: 'class', desc: 'Content in the middle.' },
      { name: '.orbit-ring', type: 'class', desc: 'A ring; its children orbit, evenly spaced.' },
      { name: '.orbit-reverse / .orbit-solid / .orbit-pause', type: 'class', desc: 'Spin the other way / solid path / pause while the orbit is hovered.' },
      { name: '.orbit-icon', type: 'class', desc: 'Round icon tile.' },
      { name: 'data-radius', type: 'attr', desc: 'px, or a fraction (≤ 1) of the orbit radius.' },
      { name: 'data-duration / data-offset', type: 'attr', desc: 'Seconds per revolution / starting angle in degrees.' },
      { name: '--radius / --duration / --path', type: 'var', default: '120px / 24s / faint', desc: 'Ring knobs (CSS-only usage: set <code>--a</code> per item).' }
    ]
  });
})();

;
/* docs/registry/motion-parallax.js */
RanjDocs.add({
  id: 'parallax',
  name: 'Parallax',
  group: 'Motion',
  description: 'Layers that drift at different speeds as you scroll, plus a pointer-driven scene where each layer moves by its depth. Transform-only, rAF-throttled.',
  tags: ['new', 'fx', 'js'],
  keywords: ['depth', 'scroll speed', 'mouse parallax', 'layers', '3d'],
  demos: [
    {
      title: 'Pointer scene',
      description: 'Move your pointer over the card. Each layer has its own <code>data-depth</code>.',
      height: 380,
      html: `
<div class="parallax-scene demo-parallax-scene" data-max="36" data-scene-tilt="4">
  <div class="demo-parallax-orb demo-parallax-orb-a" data-depth="-0.6"></div>
  <div class="demo-parallax-orb demo-parallax-orb-b" data-depth="0.9"></div>
  <div class="demo-parallax-card" data-depth="0.25">
    <small>Balance</small><b>$24,580.42</b><span>+3.2% this week</span>
  </div>
  <div class="demo-parallax-chip demo-parallax-chip-a" data-depth="1.2">💳 Card added</div>
  <div class="demo-parallax-chip demo-parallax-chip-b" data-depth="-1">📈 +$420</div>
</div>`,
      css: `.demo-parallax-scene { width: min(100%, 560px); height: 320px; border-radius: var(--radius-2xl); background: linear-gradient(135deg, color-mix(in oklab, var(--primary) 14%, var(--card)), var(--card)); border: 1px solid var(--border); display: grid; place-items: center; box-shadow: var(--shadow-lg); }
.demo-parallax-orb { position: absolute; border-radius: 50%; filter: blur(2px); }
.demo-parallax-orb-a { width: 160px; height: 160px; left: 8%; top: 10%; background: radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed); opacity: .55; }
.demo-parallax-orb-b { width: 90px; height: 90px; right: 10%; bottom: 12%; background: radial-gradient(circle at 30% 30%, #fbcfe8, #db2777); opacity: .6; }
.demo-parallax-card { position: relative; display: grid; gap: .2rem; padding: 1.25rem 1.5rem; min-width: 240px; border-radius: var(--radius-xl); background: color-mix(in oklab, var(--card) 80%, transparent); backdrop-filter: blur(12px); border: 1px solid var(--border); box-shadow: var(--shadow-xl); }
.demo-parallax-card small { color: var(--muted-fg); } .demo-parallax-card b { font-size: 2rem; letter-spacing: -.03em; } .demo-parallax-card span { color: var(--success); font-size: .85rem; font-weight: 600; }
.demo-parallax-chip { position: absolute; padding: .5rem .8rem; border-radius: 99px; background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-md); font-size: .8rem; font-weight: 600; }
.demo-parallax-chip-a { left: 9%; bottom: 18%; } .demo-parallax-chip-b { right: 8%; top: 16%; }`
    },
    {
      title: 'Scroll layers',
      description: 'Scroll the panel: <code>data-parallax</code> sets each layer’s speed (negative moves the other way).',
      pad: false, center: false,
      html: `
<div class="demo-parallax-box">
  <div class="demo-parallax-spacer">Scroll ↓</div>
  <section class="demo-parallax-hero">
    <div class="demo-parallax-sun" data-parallax="0.45"></div>
    <div class="demo-parallax-hill demo-parallax-hill-1" data-parallax="0.25"></div>
    <div class="demo-parallax-hill demo-parallax-hill-2" data-parallax="0.12"></div>
    <h2 data-parallax="-0.2">Mountains move</h2>
  </section>
  <div class="demo-parallax-spacer"></div>
</div>`,
      css: `.demo-parallax-box { height: 380px; overflow-y: auto; }
.demo-parallax-spacer { height: 260px; display: grid; place-items: center; color: var(--muted-fg); font-size: .875rem; }
.demo-parallax-hero { position: relative; height: 420px; overflow: hidden; margin: 0 1rem; border-radius: var(--radius-2xl); background: linear-gradient(180deg, #fde68a, #fb923c 55%, #be185d); display: grid; place-items: center; }
.demo-parallax-hero h2 { position: relative; z-index: 3; color: #fff; font-size: clamp(2rem, 1rem + 4vw, 3.5rem); text-shadow: 0 6px 30px rgb(0 0 0 / .25); }
.demo-parallax-sun { position: absolute; width: 140px; height: 140px; left: 50%; top: 18%; margin-left: -70px; border-radius: 50%; background: #fff7ed; box-shadow: 0 0 80px #fff7ed; }
.demo-parallax-hill { position: absolute; left: -10%; right: -10%; border-radius: 50% 50% 0 0; }
.demo-parallax-hill-1 { height: 55%; bottom: -12%; background: #9d174d; opacity: .75; }
.demo-parallax-hill-2 { height: 40%; bottom: -16%; background: #4c0519; z-index: 2; left: -30%; right: 10%; }`
    }
  ],
  api: [
    { name: 'data-parallax', type: 'attr', default: '0.2', desc: 'Scroll speed factor relative to the parent. Negative values move against the scroll.' },
    { name: 'data-parallax-axis', type: 'attr', default: 'y', desc: '<code>x</code> for horizontal drift.' },
    { name: '.parallax-scene', type: 'class', desc: 'Pointer-driven container.' },
    { name: 'data-depth', type: 'attr', desc: 'On children of a scene: movement factor (−2 … 2).' },
    { name: 'data-max / data-scene-tilt', type: 'attr', default: '40 / 0', desc: 'Scene: max layer travel in px, and optional 3D tilt in degrees.' }
  ]
});

;
/* docs/registry/motion-pixel-transition.js */
RanjDocs.add({
  id: 'pixel-transition',
  name: 'Pixel Transition',
  group: 'Interactions',
  description: 'On hover, a grid of pixels fills in random order, swaps the content underneath, then dissolves away to reveal the second side.',
  tags: ['new', 'fx', 'js'],
  keywords: ['pixel', 'dissolve', 'image reveal', 'hover reveal', 'mosaic', 'transition'],
  demos: [
    {
      title: 'Product reveal',
      height: 360,
      html: `
<div class="pixel-transition demo-pixel-transition" data-grid="12" style="--pixel-color: #fafafa">
  <div class="pt-front demo-pixel-transition-face" style="background:linear-gradient(150deg,#1e1b4b,#4338ca)"><span>🎧</span><b>Aero One</b></div>
  <div class="pt-back demo-pixel-transition-face" style="background:linear-gradient(150deg,#fde68a,#f97316)"><b>$249</b><small>Spatial audio · 40h battery</small></div>
</div>
<div class="pixel-transition demo-pixel-transition" data-grid="7" data-duration="900" style="--pixel-color: var(--primary)">
  <div class="pt-front demo-pixel-transition-face" style="background:var(--card);color:var(--fg);border:1px solid var(--border)"><span>👾</span><b>Chunky pixels</b></div>
  <div class="pt-back demo-pixel-transition-face" style="background:var(--primary)"><b>Hello!</b><small>data-grid="7"</small></div>
</div>`,
      css: `.demo-pixel-transition { width: 240px; aspect-ratio: 1; box-shadow: var(--shadow-lg); }
.demo-pixel-transition-face { display: grid; place-content: center; justify-items: center; gap: .35rem; color: #fff; text-align: center; }
.demo-pixel-transition-face span { font-size: 4rem; } .demo-pixel-transition-face b { font-size: 1.4rem; } .demo-pixel-transition-face small { opacity: .85; }`
    }
  ],
  api: [
    { name: '.pixel-transition', type: 'class', desc: 'Container with <code>.pt-front</code> and <code>.pt-back</code> children.' },
    { name: 'data-grid', type: 'attr', default: '10', desc: 'Pixels per row (rows follow the aspect ratio).' },
    { name: 'data-duration', type: 'attr', default: '700', desc: 'Total transition time in ms.' },
    { name: 'data-trigger', type: 'attr', default: 'hover', desc: '<code>click</code> to toggle on click. Touch devices and Enter/Space always toggle.' },
    { name: '--pixel-color', type: 'var', default: 'var(--fg)', desc: 'Pixel color.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ active }</code>' }
  ]
});

;
/* docs/registry/motion-reveal.js */
RanjDocs.add({
  id: 'reveal',
  name: 'Reveal',
  group: 'Motion',
  description: 'Fade, slide, zoom, blur or flip anything into view as it scrolls in. Stagger a container’s children with one attribute, play once or every time.',
  tags: ['new', 'fx', 'js'],
  keywords: ['scroll animation', 'aos', 'animate on scroll', 'entrance', 'fade in', 'stagger', 'in view'],
  demos: [
    {
      title: 'Variants',
      description: 'Scroll inside the panel. These use <code>data-reveal-once="false"</code> so they replay every time.',
      pad: false, center: false,
      html: `
<div class="demo-reveal-scroll">
  <p class="demo-reveal-hint">Scroll ↓</p>
  <div class="demo-reveal-grid">
    <div class="demo-reveal-tile" data-reveal="fade-up" data-reveal-once="false">fade-up</div>
    <div class="demo-reveal-tile" data-reveal="fade-down" data-reveal-once="false">fade-down</div>
    <div class="demo-reveal-tile" data-reveal="fade-left" data-reveal-once="false">fade-left</div>
    <div class="demo-reveal-tile" data-reveal="fade-right" data-reveal-once="false">fade-right</div>
    <div class="demo-reveal-tile" data-reveal="zoom" data-reveal-once="false">zoom</div>
    <div class="demo-reveal-tile" data-reveal="blur" data-reveal-once="false">blur</div>
    <div class="demo-reveal-tile" data-reveal="flip" data-reveal-once="false">flip</div>
    <div class="demo-reveal-tile" data-reveal="fade" data-reveal-once="false">fade</div>
  </div>
  <div class="demo-reveal-pad"></div>
</div>`,
      css: `.demo-reveal-scroll { height: 360px; overflow-y: auto; padding: 0 1.5rem; }
.demo-reveal-hint { height: 260px; display: grid; place-items: center; color: var(--muted-fg); font-size: .875rem; }
.demo-reveal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; max-width: 760px; margin: 0 auto; }
.demo-reveal-tile { height: 110px; display: grid; place-items: center; border-radius: var(--radius-lg); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-sm); font-family: var(--font-mono); font-size: .8rem; color: var(--muted-fg); }
.demo-reveal-pad { height: 200px; }`
    },
    {
      title: 'Staggered features',
      description: 'Put <code>data-reveal-stagger</code> on a parent and its children animate in one after another.',
      height: 340,
      html: `
<div class="demo-reveal-features" data-reveal="fade-up" data-reveal-stagger="110">
  <div><span>⚡</span><h4>Instant</h4><p>Under 30 KB gzipped, no runtime framework.</p></div>
  <div><span>♿</span><h4>Accessible</h4><p>Keyboard, focus and ARIA handled for you.</p></div>
  <div><span>🎨</span><h4>Themeable</h4><p>One hue variable re-tints every component.</p></div>
  <div><span>🌗</span><h4>Dark mode</h4><p>Every token has a tuned dark counterpart.</p></div>
</div>`,
      css: `.demo-reveal-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; width: 100%; max-width: 900px; }
.demo-reveal-features > div { padding: 1.25rem; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
.demo-reveal-features span { font-size: 1.5rem; } .demo-reveal-features h4 { margin: .5rem 0 .25rem; } .demo-reveal-features p { color: var(--muted-fg); font-size: .875rem; }`
    },
    {
      title: 'Timing knobs',
      height: 220,
      html: `
<div class="demo-reveal-row">
  <div class="demo-reveal-chip" data-reveal="zoom">0ms</div>
  <div class="demo-reveal-chip" data-reveal="zoom" data-reveal-delay="300">300ms</div>
  <div class="demo-reveal-chip" data-reveal="zoom" data-reveal-delay="600" data-reveal-duration="1400">600ms, slow</div>
  <div class="demo-reveal-chip" data-reveal="fade-up" data-reveal-delay="900" data-reveal-distance="80px">900ms, far</div>
</div>`,
      css: `.demo-reveal-row { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; }
.demo-reveal-chip { padding: .75rem 1.1rem; border-radius: 99px; background: var(--primary-soft); color: var(--primary-soft-fg); font-weight: 600; font-size: .875rem; }`
    }
  ],
  api: [
    { name: 'data-reveal', type: 'attr', default: 'fade-up', desc: 'fade-up, fade-down, fade-left, fade-right, fade, zoom, blur, flip.' },
    { name: 'data-reveal-stagger', type: 'attr', default: '90', desc: 'Animate the children instead of the element, offset by this many ms.' },
    { name: 'data-reveal-delay / data-reveal-duration', type: 'attr', default: '0 / 800', desc: 'Milliseconds.' },
    { name: 'data-reveal-distance', type: 'attr', default: '28px', desc: 'Travel distance for fade-* variants.' },
    { name: 'data-reveal-once', type: 'attr', default: 'true', desc: '<code>false</code> hides again on leave and replays on re-entry.' },
    { name: 'data-reveal-threshold', type: 'attr', default: '0.15', desc: 'Visible fraction that triggers it.' },
    { name: '--reveal-ease', type: 'var', default: 'var(--ease-out)', desc: 'Timing function.' },
    { name: 'ranj:reveal', type: 'event', desc: 'Fires after the element has revealed.' }
  ],
  notes: '<p>Content is only hidden once ranj.js mounts, so pages stay readable without JavaScript. With reduced motion nothing is hidden.</p>'
});

;
/* docs/registry/motion-ripple.js */
RanjDocs.add({
  id: 'ripple',
  name: 'Ripple',
  group: 'Interactions',
  description: 'Material-style ink ripple that grows from the exact press point. Add data-ripple to any element; it holds while pressed and fades on release.',
  tags: ['new', 'fx', 'js'],
  keywords: ['ink', 'material', 'press effect', 'click effect', 'wave'],
  demos: [
    {
      title: 'Buttons',
      html: `
<button class="btn btn-primary btn-lg" data-ripple="light">Primary</button>
<button class="btn btn-outline btn-lg" data-ripple>Outline</button>
<button class="btn btn-secondary btn-lg" data-ripple="#6366f1">Tinted</button>
<button class="btn btn-ghost btn-lg" data-ripple>Ghost</button>`
    },
    {
      title: 'List and card surfaces',
      height: 320,
      html: `
<div class="demo-ripple-list" role="list">
  <button class="demo-ripple-row" data-ripple role="listitem"><span>📥</span>Inbox<b>12</b></button>
  <button class="demo-ripple-row" data-ripple role="listitem"><span>⭐</span>Starred<b>3</b></button>
  <button class="demo-ripple-row" data-ripple role="listitem"><span>📤</span>Sent<b></b></button>
  <button class="demo-ripple-row" data-ripple role="listitem"><span>🗑️</span>Trash<b></b></button>
</div>
<div class="demo-ripple-tile" data-ripple="light" tabindex="0">Press and hold</div>`,
      css: `.demo-ripple-list { width: 260px; padding: .4rem; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-md); display: grid; }
.demo-ripple-row { display: flex; align-items: center; gap: .75rem; padding: .7rem .8rem; border-radius: var(--radius); text-align: left; font-weight: 500; }
.demo-ripple-row b { margin-left: auto; font-size: .75rem; color: var(--muted-fg); }
.demo-ripple-row:hover { background: var(--muted); }
.demo-ripple-tile { width: 220px; height: 180px; border-radius: var(--radius-2xl); display: grid; place-items: center; color: #fff; font-weight: 700; user-select: none; cursor: pointer; background: linear-gradient(135deg, #0ea5e9, #6366f1); box-shadow: var(--shadow-lg); }`
    }
  ],
  api: [
    { name: 'data-ripple', type: 'attr', default: 'currentColor', desc: 'Enable. Value: <code>light</code>, <code>dark</code> or any CSS color.' },
    { name: '--ripple-opacity / --ripple-dur / --ripple-fade', type: 'var', default: '.22 / 550ms / 450ms', desc: 'Ink strength, grow time and fade time.' },
    { name: 'Ranj.ripple(el, x?, y?)', type: 'js', desc: 'Trigger a ripple (centered by default). Enter/Space trigger one too.' }
  ]
});

;
/* docs/registry/motion-rotating-text.js */
RanjDocs.add({
  id: 'rotating-text',
  name: 'Rotating Text',
  group: 'Text Effects',
  description: 'Cycles through a list of words with staggered per-letter transitions while the container smoothly animates its width to fit each word.',
  tags: ['new', 'fx', 'js'],
  keywords: ['word rotator', 'text loop', 'flip words', 'changing text', 'cycle'],
  demos: [
    {
      title: 'Hero with pill',
      height: 240,
      html: `
<h1 class="display-2 demo-rotating-text-h">Creative <span class="rotating-text rotating-text-pill" data-words="thinking|coding|components|vibes"></span></h1>`,
      css: `.demo-rotating-text-h { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .25em; text-align: center; }`
    },
    {
      title: 'Transitions',
      description: '<code>data-transition</code>: slide (default), drop, flip, blur, fade.',
      height: 340,
      html: `
<div class="demo-rotating-text-grid">
  <p>We help you <span class="rotating-text" data-words="launch|grow|scale|win"></span></p>
  <p>We help you <span class="rotating-text" data-transition="drop" data-interval="2400" data-words="launch|grow|scale|win"></span></p>
  <p>We help you <span class="rotating-text" data-transition="flip" data-interval="2600" data-words="launch|grow|scale|win"></span></p>
  <p>We help you <span class="rotating-text" data-transition="blur" data-interval="2800" data-words="launch|grow|scale|win"></span></p>
  <p>We help you <span class="rotating-text" data-transition="fade" data-interval="3000" data-words="launch|grow|scale|win"></span></p>
</div>`,
      css: `.demo-rotating-text-grid { display: grid; gap: .6rem; font-size: 1.6rem; font-weight: 700; letter-spacing: -.02em; text-align: center; }
.demo-rotating-text-grid .rotating-text { color: var(--primary); }`
    },
    {
      title: 'Whole words, children as source',
      description: 'Words can come from child elements; <code>data-split="words"</code> staggers by word for phrases.',
      html: `
<p class="demo-rotating-text-p">Built for <span class="rotating-text gradient-text gradient-text-sunset" data-split="words" data-interval="2600"><span>product designers</span><span>indie hackers</span><span>design engineers</span><span>agencies</span></span></p>`,
      css: `.demo-rotating-text-p { font-size: 1.75rem; font-weight: 800; letter-spacing: -.03em; text-align: center; }`
    }
  ],
  api: [
    { name: '.rotating-text', type: 'class', desc: 'Container. Words come from <code>data-words</code> or its child elements.' },
    { name: '.rotating-text-pill', type: 'class', desc: 'Accent pill background that resizes with each word.' },
    { name: 'data-words', type: 'attr', desc: 'Pipe-separated list: <code>launch|grow|scale</code>.' },
    { name: 'data-interval', type: 'attr', default: '2200', desc: 'Milliseconds each word stays.' },
    { name: 'data-transition', type: 'attr', default: 'slide', desc: 'slide, drop, flip, blur, fade.' },
    { name: 'data-split', type: 'attr', default: 'chars', desc: '<code>chars</code>, <code>words</code> or <code>none</code> (stagger unit).' },
    { name: 'data-align', type: 'attr', default: 'start', desc: 'Alignment while width animates: start, center, end.' },
    { name: 'data-pause', type: 'attr', default: 'true', desc: 'Pause while hovered.' },
    { name: 'data-loop', type: 'attr', default: 'true', desc: '<code>false</code> stops on the last word.' },
    { name: '--rt-dur / --rt-stagger / --rt-width-dur', type: 'var', default: '650ms / 22ms / 550ms', desc: 'Timing knobs.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ index, word }</code>' }
  ]
});

;
/* docs/registry/motion-scroll-columns.js */
(function () {
  var T = [
    ['Maya Chen', '@mayabuilds', 'Swapped our whole component layer to Ranj in an afternoon. The marquee alone saved me a day.', '#f97316,#ec4899'],
    ['Jordan Lee', '@jlee', 'The docs feel like a product. Copy, paste, done.', '#22c55e,#0ea5e9'],
    ['Priya Patel', '@priyacodes', 'Accessibility is not an afterthought here. Focus states are perfect out of the box.', '#8b5cf6,#6366f1'],
    ['Diego Alvarez', '@diegoa', 'Dark mode looks hand-tuned on every single component.', '#f59e0b,#ef4444'],
    ['Sam Okafor', '@samo', 'Zero dependencies and it still has the best motion I have seen.', '#14b8a6,#22c55e'],
    ['Lena Novak', '@lena', 'Our landing page conversion went up 18% after the redesign.', '#ec4899,#8b5cf6'],
    ['Alex Morgan', '@amorgan', 'The dock component made our internal tool feel premium.', '#0ea5e9,#6366f1'],
    ['Hana Sato', '@hanas', 'I keep finding little details — the stagger timing is chef’s kiss.', '#f43f5e,#f97316'],
    ['Omar Haddad', '@omarh', 'Shipped a prototype to a client the same day. They thought it took weeks.', '#10b981,#84cc16']
  ];
  function card(t) {
    var ini = t[0].split(' ').map(function (s) { return s[0]; }).join('');
    return '      <figure class="demo-scroll-columns-card"><blockquote>' + t[2] + '</blockquote><figcaption><span style="background:linear-gradient(135deg,' + t[3] + ')">' + ini + '</span><b>' + t[0] + '</b><small>' + t[1] + '</small></figcaption></figure>';
  }
  function col(list, extra) { return '  <div class="marquee marquee-vertical marquee-pause' + (extra || '') + '">\n    <div class="marquee-content">\n' + list.map(card).join('\n') + '\n    </div>\n  </div>'; }
  RanjDocs.add({
    id: 'scroll-columns',
    name: 'Infinite Scroll Columns',
    group: 'Motion',
    description: 'A staggered wall of columns auto-scrolling in opposite directions at different speeds, faded top and bottom. Pauses under the pointer.',
    tags: ['new', 'fx', 'js'],
    keywords: ['testimonials', 'wall of love', 'vertical marquee', 'masonry scroll', 'dual column', 'feed'],
    demos: [
      {
        title: 'Wall of love',
        height: 560,
        html: '\n<div class="scroll-columns demo-scroll-columns">\n' + col(T.slice(0, 3), '" data-speed="22') + '\n' + col(T.slice(3, 6), ' marquee-reverse" data-speed="28') + '\n' + col(T.slice(6, 9), '" data-speed="18') + '\n</div>',
        css: '.demo-scroll-columns { width: 100%; max-width: 920px; }\n.demo-scroll-columns-card { padding: 1.1rem 1.2rem; border-radius: var(--radius-xl); background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-sm); display: grid; gap: .9rem; }\n.demo-scroll-columns-card blockquote { font-size: .92rem; line-height: 1.55; }\n.demo-scroll-columns-card figcaption { display: grid; grid-template-columns: auto 1fr; column-gap: .65rem; align-items: center; }\n.demo-scroll-columns-card figcaption span { grid-row: span 2; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; color: #fff; font-size: .72rem; font-weight: 700; }\n.demo-scroll-columns-card b { font-size: .85rem; line-height: 1.2; } .demo-scroll-columns-card small { color: var(--muted-fg); font-size: .75rem; }'
      },
      {
        title: 'Dual column image feed',
        height: 480,
        html: '\n<div class="scroll-columns demo-scroll-columns-shots" style="--sc-height: 420px">\n  <div class="marquee marquee-vertical" data-speed="30"><div class="marquee-content">\n    <div class="demo-scroll-columns-shot" style="--a:#6366f1;--b:#ec4899;height:220px">Onboarding</div>\n    <div class="demo-scroll-columns-shot" style="--a:#0ea5e9;--b:#22c55e;height:160px">Pricing</div>\n    <div class="demo-scroll-columns-shot" style="--a:#f59e0b;--b:#ef4444;height:260px">Checkout</div>\n  </div></div>\n  <div class="marquee marquee-vertical marquee-reverse" data-speed="30"><div class="marquee-content">\n    <div class="demo-scroll-columns-shot" style="--a:#14b8a6;--b:#6366f1;height:180px">Dashboard</div>\n    <div class="demo-scroll-columns-shot" style="--a:#ec4899;--b:#f97316;height:240px">Profile</div>\n    <div class="demo-scroll-columns-shot" style="--a:#8b5cf6;--b:#0ea5e9;height:200px">Settings</div>\n  </div></div>\n</div>',
        css: '.demo-scroll-columns-shots { width: min(100%, 440px); }\n.demo-scroll-columns-shot { border-radius: var(--radius-xl); display: flex; align-items: flex-end; padding: 1rem; color: #fff; font-weight: 700; background: linear-gradient(150deg, var(--a), var(--b)); box-shadow: var(--shadow-md); }'
      }
    ],
    api: [
      { name: '.scroll-columns', type: 'class', desc: 'Grid of columns with faded edges. Each column is a <code>.marquee.marquee-vertical</code>.' },
      { name: '.marquee-reverse', type: 'class', desc: 'On a column: scroll the other way.' },
      { name: 'data-speed', type: 'attr', desc: 'Per column, px/s — vary it for a staggered look.' },
      { name: '--sc-height / --sc-gap', type: 'var', default: '520px / 1rem', desc: 'Visible height and spacing.' }
    ],
    notes: '<p>Below 640px the third column hides, below 420px the second.</p>'
  });
})();

;
/* docs/registry/motion-scroll-progress.js */
RanjDocs.add({
  id: 'scroll-progress',
  name: 'Scroll Progress',
  group: 'Motion',
  description: 'A reading progress bar pinned to the top of the page, or a circular ring that doubles as a back-to-top button. Tracks the window, an article, or any scroll container.',
  tags: ['new', 'fx', 'js'],
  keywords: ['reading progress', 'progress bar', 'scroll indicator', 'back to top'],
  demos: [
    {
      title: 'In a scroll container',
      description: 'Scroll the article. The bar is sticky inside the box here; on a real page just drop <code>&lt;div class="scroll-progress"&gt;</code> anywhere.',
      pad: false, center: false,
      html: `
<div class="demo-scroll-progress-box">
  <div class="scroll-progress scroll-progress-sticky"></div>
  <article class="demo-scroll-progress-article">
    <p class="eyebrow">Engineering · 6 min read</p>
    <h2>How we made every animation run at 60fps</h2>
    <p>Performance is a feature. When an interface stutters, people stop trusting it. We set a simple rule for Ranj UI: every effect animates only transform, opacity or filter, and every loop pauses when it scrolls offscreen.</p>
    <p>That one rule removed almost all layout thrash. The browser can hand those properties to the compositor, so even a busy marquee costs nearly nothing on the main thread.</p>
    <p>The second rule: read, then write. Every effect batches its measurements first and applies styles after, in a single requestAnimationFrame. No interleaving, no forced reflow.</p>
    <p>Finally, everything respects reduced motion. If a user asks for less movement, effects jump to their final state instead of disappearing.</p>
    <p>The result is a library that feels alive without ever feeling heavy.</p>
  </article>
  <button class="scroll-ring demo-scroll-progress-ring" data-scroll-top aria-label="Back to top">↑</button>
</div>`,
      css: `.demo-scroll-progress-box { position: relative; height: 380px; overflow-y: auto; }
.demo-scroll-progress-article { max-width: 640px; margin: 0 auto; padding: 2rem 1.5rem 4rem; display: grid; gap: 1rem; }
.demo-scroll-progress-article p { color: var(--muted-fg); line-height: 1.75; }
.demo-scroll-progress-ring { position: sticky; bottom: 1rem; left: calc(100% - 4rem); margin: -3.5rem 1rem 1rem auto; background: var(--card); box-shadow: var(--shadow-md); font-weight: 700; color: var(--fg); }`
    },
    {
      title: 'Ring sizes',
      html: `
<div class="demo-scroll-progress-rings">
  <span class="scroll-ring" data-value="25">25</span>
  <span class="scroll-ring" data-value="60" style="--size: 56px">60</span>
  <span class="scroll-ring" data-value="90" style="--size: 72px">90</span>
</div>`,
      css: `.demo-scroll-progress-rings { display: flex; gap: 1.5rem; align-items: center; font-size: .8rem; font-weight: 700; }`
    }
  ],
  api: [
    { name: '.scroll-progress', type: 'class', desc: 'Fixed top bar (scaleX, GPU-cheap).' },
    { name: '.scroll-progress-sticky / -bottom', type: 'class', desc: 'Sticky inside a scroll container / pin to the bottom.' },
    { name: '.scroll-ring', type: 'class', desc: 'Circular indicator (SVG is injected).' },
    { name: 'data-target', type: 'attr', default: 'nearest scroller', desc: 'Selector of a scroll container or an article to track; falls back to the window.' },
    { name: 'data-value', type: 'attr', desc: 'Static value (0–1 or 0–100) instead of tracking scroll.' },
    { name: 'data-scroll-top', type: 'attr', desc: 'Clicking scrolls the target back to the top.' },
    { name: '--progress', type: 'var', desc: '0–1, written by the script (set it yourself for a static ring).' },
    { name: '--sp-height / --sp-color', type: 'var', default: '3px / accent gradient', desc: 'Bar thickness and fill.' }
  ]
});

;
/* docs/registry/motion-scroll-reveal-text.js */
RanjDocs.add({
  id: 'scroll-reveal-text',
  name: 'Scroll Reveal Text',
  group: 'Text Effects',
  description: 'A paragraph whose words light up one after another as you scroll through it, scrubbed directly by scroll position. Works in the page or any scroll container.',
  tags: ['new', 'fx', 'js'],
  keywords: ['scroll text', 'scrub', 'reading', 'opacity', 'apple style'],
  demos: [
    {
      title: 'Scroll inside the box',
      description: 'Scroll the panel; words brighten as the paragraph passes through the viewport.',
      pad: false,
      center: false,
      html: `
<div class="demo-scroll-reveal-text-box">
  <p class="demo-scroll-reveal-text-hint">Scroll ↓</p>
  <p class="demo-scroll-reveal-text-p" data-scroll-reveal>
    We believe the best interfaces disappear. They respond before you finish the thought, explain themselves through motion, and never make you wait. Every component in Ranj UI is built around that idea — small, fast, accessible, and genuinely delightful to use.
  </p>
  <div class="demo-scroll-reveal-text-end"></div>
</div>`,
      css: `.demo-scroll-reveal-text-box { height: 380px; overflow-y: auto; padding: 0 clamp(1rem, 5vw, 4rem); }
.demo-scroll-reveal-text-hint { height: 300px; display: grid; place-items: center; color: var(--muted-fg); font-size: .875rem; }
.demo-scroll-reveal-text-p { font-family: var(--font-display); font-size: clamp(1.5rem, 1rem + 2vw, 2.5rem); font-weight: 700; line-height: 1.25; letter-spacing: -.03em; max-width: 820px; margin: 0 auto; }
.demo-scroll-reveal-text-end { height: 300px; }`
    },
    {
      title: 'With blur and tilt',
      pad: false,
      center: false,
      html: `
<div class="demo-scroll-reveal-text-box">
  <p class="demo-scroll-reveal-text-hint">Scroll ↓</p>
  <p class="demo-scroll-reveal-text-p" data-scroll-reveal data-blur data-rotate>
    Motion should feel like physics, not decoration. When it is done right, nobody notices the animation — they just notice that everything makes sense.
  </p>
  <div class="demo-scroll-reveal-text-end"></div>
</div>`,
      css: ``
    }
  ],
  api: [
    { name: 'data-scroll-reveal', type: 'attr', desc: 'Enable on a paragraph or heading.' },
    { name: 'data-start / data-end', type: 'attr', default: '0.9 / 0.35', desc: 'Viewport fractions where the reveal starts (top edge) and finishes (bottom edge).' },
    { name: 'data-blur', type: 'attr', desc: 'Unrevealed words are also blurred.' },
    { name: 'data-rotate', type: 'attr', desc: 'Paragraph straightens from a 3° tilt as it reveals.' },
    { name: '--sr-min', type: 'var', default: '.14', desc: 'Opacity of words not yet revealed.' },
    { name: '--p', type: 'var', desc: 'Live progress 0–1 written on the element; use it in your own CSS.' }
  ]
});

;
/* docs/registry/motion-shine-border.js */
RanjDocs.add({
  id: 'shine-border',
  name: 'Shine Border',
  group: 'Interactions',
  description: 'A full multicolor gradient rotates around the border, optionally with a blurred glow behind the element or a gentle pulse.',
  tags: ['new', 'fx'],
  keywords: ['rainbow border', 'gradient border', 'conic border', 'glow', 'animated outline'],
  demos: [
    {
      title: 'Card with glow',
      height: 320,
      html: `
<div class="shine-border shine-border-glow demo-shine-border-card">
  <span class="demo-shine-border-tag">NEW</span>
  <h3>Ranj AI</h3>
  <p>Describe a screen, get production-ready Ranj UI markup in seconds.</p>
  <button class="btn btn-primary btn-sm">Try it free</button>
</div>`,
      css: `.demo-shine-border-card { width: min(100%, 340px); padding: 1.75rem; border-radius: var(--radius-2xl); background: var(--card); display: grid; gap: .6rem; justify-items: start; }
.demo-shine-border-card p { color: var(--muted-fg); font-size: .9rem; }
.demo-shine-border-tag { font-size: .7rem; font-weight: 800; letter-spacing: .12em; padding: .2rem .55rem; border-radius: 99px; background: linear-gradient(90deg, #a855f7, #3b82f6); color: #fff; }`
    },
    {
      title: 'Variants',
      height: 220,
      html: `
<div class="shine-border demo-shine-border-chip">Default</div>
<div class="shine-border shine-border-pulse demo-shine-border-chip" style="--shine-colors: #f97316, #facc15, #f43f5e, #f97316">Pulse · warm</div>
<div class="shine-border demo-shine-border-chip" style="--shine-width: 3px; --shine-speed: 3s; --shine-colors: #22d3ee, transparent 30%, transparent 70%, #22d3ee">Fast, partial</div>`,
      css: `.demo-shine-border-chip { padding: .9rem 1.3rem; border-radius: var(--radius-lg); background: var(--card); font-weight: 600; font-size: .9rem; }`
    }
  ],
  api: [
    { name: '.shine-border', type: 'class', desc: 'Rotating gradient border on any element.' },
    { name: '.shine-border-glow', type: 'class', desc: 'Adds a blurred glow behind.' },
    { name: '.shine-border-pulse', type: 'class', desc: 'Border breathes in opacity.' },
    { name: '--shine-colors', type: 'var', desc: 'Comma-separated conic stops (repeat the first at the end for a seamless loop).' },
    { name: '--shine-width / --shine-speed / --shine-inset', type: 'var', default: '2px / 7s / -1px', desc: 'Thickness, rotation time and offset.' }
  ]
});

;
/* docs/registry/motion-shiny-text.js */
RanjDocs.add({
  id: 'shiny-text',
  name: 'Shiny Text',
  group: 'Text Effects',
  description: 'A soft band of light sweeps across muted text on a loop. Pure CSS, great for announcement pills and secondary buttons.',
  tags: ['new', 'fx'],
  keywords: ['shimmer', 'shine', 'sheen', 'gloss', 'announcement'],
  demos: [
    {
      title: 'Announcement pill',
      html: `
<a href="#" class="demo-shiny-text-pill" onclick="return false">
  <span class="demo-shiny-text-dot"></span>
  <span class="shiny-text">Introducing Ranj UI v2 — 160 components</span>
  <span aria-hidden="true">→</span>
</a>`,
      css: `.demo-shiny-text-pill { display: inline-flex; align-items: center; gap: .6rem; padding: .45rem .9rem .45rem .6rem; border-radius: 99px; border: 1px solid var(--border); background: var(--card); font-size: .875rem; font-weight: 500; color: var(--muted-fg); text-decoration: none !important; box-shadow: var(--shadow-sm); }
.demo-shiny-text-dot { width: .5rem; height: .5rem; border-radius: 50%; background: var(--success); box-shadow: 0 0 0 4px color-mix(in oklab, var(--success) 25%, transparent); }`
    },
    {
      title: 'Display size & colors',
      height: 280,
      html: `
<div class="demo-shiny-text-stack">
  <h2 class="display-2 shiny-text">Shine on.</h2>
  <h3 class="shiny-text shiny-text-primary" style="--shine-speed: 2.2s">Primary tint, faster</h3>
  <h3 class="shiny-text shiny-text-gold">Gold edition</h3>
</div>`,
      css: `.demo-shiny-text-stack { display: grid; gap: .5rem; text-align: center; }`
    },
    {
      title: 'Only while hovered',
      html: `
<button class="btn btn-outline btn-lg"><span class="shiny-text shiny-text-hover">Hover me to shine</span></button>`
    }
  ],
  api: [
    { name: '.shiny-text', type: 'class', desc: 'Base effect.' },
    { name: '.shiny-text-primary / .shiny-text-gold', type: 'class', desc: 'Color presets.' },
    { name: '.shiny-text-hover', type: 'class', desc: 'Pauses until the text (or its parent) is hovered.' },
    { name: '--shine-speed', type: 'var', default: '3s', desc: 'Loop length.' },
    { name: '--shine-base / --shine-color', type: 'var', desc: 'Resting text color and highlight color.' },
    { name: '--shine-width / --shine-angle', type: 'var', default: '30% / 110deg', desc: 'Band width and angle.' }
  ]
});

;
/* docs/registry/motion-split-text.js */
RanjDocs.add({
  id: 'split-text',
  name: 'Split Text',
  group: 'Text Effects',
  description: 'Splits a heading into characters, words or lines and reveals them with a stagger when it scrolls into view. Seven entrance effects, any order, and inline markup like gradient text is kept intact.',
  tags: ['new', 'fx', 'js'],
  keywords: ['text animation', 'stagger', 'reveal', 'letters', 'chars', 'words', 'lines', 'headline', 'hero'],
  demos: [
    {
      title: 'Hero headline',
      description: 'Characters rise in with a 28ms stagger, the gradient survives the split, and the lead paragraph blurs in by word.',
      height: 340,
      html: `
<div class="demo-split-text-hero">
  <span class="badge badge-soft" data-blur-text data-delay="0">Ranj UI v2 is here</span>
  <h1 class="display-2" data-split-text="chars" data-stagger="24" data-delay="150">Build interfaces that <span class="gradient-text">feel alive</span></h1>
  <p class="lead" data-split-text="words" data-effect="blur" data-stagger="35" data-delay="900">Zero-dependency components with motion baked in. Copy, paste, ship.</p>
</div>`,
      css: `.demo-split-text-hero { text-align: center; max-width: 760px; display: grid; justify-items: center; gap: 1rem; }`
    },
    {
      title: 'Effects',
      description: 'Set <code>data-effect</code> to fade-up (default), fade, fade-down, blur, rotate-in, scale, flip, mask or elastic. Press Replay to watch again.',
      height: 380,
      html: `
<div class="demo-split-text-grid">
  <div><small>fade-up</small><h2 data-split-text>Momentum</h2></div>
  <div><small>blur</small><h2 data-split-text data-effect="blur">Momentum</h2></div>
  <div><small>rotate-in</small><h2 data-split-text data-effect="rotate-in">Momentum</h2></div>
  <div><small>scale</small><h2 data-split-text data-effect="scale">Momentum</h2></div>
  <div><small>flip</small><h2 data-split-text data-effect="flip" data-stagger="45">Momentum</h2></div>
  <div><small>mask</small><h2 data-split-text data-effect="mask">Momentum</h2></div>
  <div><small>elastic</small><h2 data-split-text data-effect="elastic" data-stagger="40">Momentum</h2></div>
  <div><small>order: center</small><h2 data-split-text data-effect="scale" data-order="center" data-stagger="50">Momentum</h2></div>
</div>`,
      css: `.demo-split-text-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1rem; width: 100%; max-width: 900px; }
.demo-split-text-grid > div { padding: 1.25rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); text-align: center; }
.demo-split-text-grid small { display: block; color: var(--muted-fg); font-family: var(--font-mono); font-size: .72rem; margin-bottom: .35rem; }
.demo-split-text-grid h2 { font-size: 1.9rem; }`
    },
    {
      title: 'Lines with mask',
      description: 'Line mode groups words by their rendered row; combined with the mask effect each line slides up from behind a clip.',
      height: 300,
      html: `
<p class="demo-split-text-quote" data-split-text="lines" data-effect="mask" data-stagger="140">“Motion is the difference between an interface that works and one that people remember. Every transition should explain where something came from and where it went.”</p>`,
      css: `.demo-split-text-quote { max-width: 620px; font-family: var(--font-display); font-size: clamp(1.25rem, 1rem + 1vw, 1.75rem); font-weight: 600; line-height: 1.35; letter-spacing: -.02em; text-align: center; }`
    },
    {
      title: 'Replay on hover',
      description: '<code>data-trigger="hover"</code> plays once on load and replays every time the pointer enters.',
      html: `
<a href="#" class="demo-split-text-link" data-split-text data-trigger="hover" data-effect="flip" data-stagger="22" onclick="return false">Hover to replay this →</a>`,
      css: `.demo-split-text-link { font-size: 1.5rem; font-weight: 700; color: var(--fg); text-decoration: none !important; }`
    }
  ],
  api: [
    { name: 'data-split-text', type: 'attr', default: 'chars', desc: 'Split mode: <code>chars</code>, <code>words</code> or <code>lines</code>.' },
    { name: 'data-effect', type: 'attr', default: 'fade-up', desc: 'fade-up, fade, fade-down, blur, rotate-in, scale, flip, mask, elastic.' },
    { name: 'data-stagger', type: 'attr', default: '30', desc: 'Milliseconds between pieces (lines default to 120).' },
    { name: 'data-duration', type: 'attr', default: '700', desc: 'Per-piece animation length in ms.' },
    { name: 'data-delay', type: 'attr', default: '0', desc: 'Delay before the first piece, in ms.' },
    { name: 'data-order', type: 'attr', default: 'start', desc: 'start, end, center or random.' },
    { name: 'data-trigger', type: 'attr', default: 'view', desc: '<code>view</code> (on scroll into view), <code>load</code>, or <code>hover</code> (replays on pointer enter).' },
    { name: 'data-repeat', type: 'attr', default: 'false', desc: 'Re-hide when leaving the viewport and replay on re-entry.' },
    { name: 'data-split-skip', type: 'attr', desc: 'Put on a child element to leave its text unsplit.' },
    { name: '--st-ease', type: 'var', default: 'var(--ease-out)', desc: 'Timing function. Also <code>--st-distance</code> (rise distance, default .6em).' },
    { name: 'Ranj.splitText(el, mode)', type: 'js', desc: 'Low-level splitter. Returns <code>{ pieces, words, chars, restore() }</code>.' },
    { name: 'ranj:done', type: 'event', desc: 'Fires after the last piece finished.' }
  ],
  notes: '<p>The parent keeps an <code>aria-label</code> with the full sentence and every piece is <code>aria-hidden</code>, so screen readers read it normally. With reduced motion the text appears immediately.</p>'
});

;
/* docs/registry/motion-spotlight-card.js */
RanjDocs.add({
  id: 'spotlight-card',
  name: 'Spotlight Card',
  group: 'Interactions',
  description: 'A soft radial light follows the cursor inside the card and lights its border. In a spotlight grid the border glow spills across every nearby card.',
  tags: ['new', 'fx', 'js'],
  keywords: ['spotlight', 'glow card', 'cursor light', 'hover glow', 'border glow', 'linear style'],
  demos: [
    {
      title: 'Single card',
      height: 300,
      html: `
<div class="spotlight-card demo-spotlight-card-one">
  <span class="demo-spotlight-card-ic">✦</span>
  <h3>Edge functions</h3>
  <p>Run code in 300+ locations with cold starts under 5ms.</p>
</div>`,
      css: `.demo-spotlight-card-one { width: min(100%, 340px); padding: 1.75rem; display: grid; gap: .5rem; }
.demo-spotlight-card-one p, .demo-spotlight-card-grid p { color: var(--muted-fg); font-size: .9rem; }
.demo-spotlight-card-ic { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; background: var(--primary-soft); color: var(--primary); font-size: 1.1rem; margin-bottom: .5rem; }`
    },
    {
      title: 'Spotlight grid',
      description: 'Wrap cards in <code>.spotlight-grid</code>: move between cards and watch the borders light up across the gaps.',
      height: 380,
      bg: 'dark',
      html: `
<div class="spotlight-grid demo-spotlight-card-grid" style="--spot-color: rgb(167 139 250 / .18); --spot-border: rgb(196 181 253 / .9)">
  <div class="spotlight-card"><h4>Auth</h4><p>Passkeys, SSO and magic links.</p></div>
  <div class="spotlight-card"><h4>Storage</h4><p>S3-compatible, globally cached.</p></div>
  <div class="spotlight-card"><h4>Queues</h4><p>Exactly-once delivery with retries.</p></div>
  <div class="spotlight-card"><h4>Search</h4><p>Typo-tolerant full-text in 10ms.</p></div>
  <div class="spotlight-card"><h4>Cron</h4><p>Schedules with timezones that make sense.</p></div>
  <div class="spotlight-card"><h4>Logs</h4><p>Tail anything, retain for 90 days.</p></div>
</div>`,
      css: `.demo-spotlight-card-grid { width: 100%; max-width: 820px; }
.demo-spotlight-card-grid .spotlight-card { padding: 1.4rem; background: #0f0f14; border-color: #26262e; color: #f4f4f5; }
.demo-spotlight-card-grid h4 { margin-bottom: .25rem; }
.demo-spotlight-card-grid p { color: #a1a1aa; }`
    }
  ],
  api: [
    { name: '.spotlight-card', type: 'class', desc: 'Card with cursor light and border glow.' },
    { name: '.spotlight-grid / data-spotlight-group', type: 'class', desc: 'Grid (or any container with the attribute) that drives all child cards together.' },
    { name: '--spot-color / --spot-border / --spot-size', type: 'var', default: 'accent 20% / accent 85% / 420px', desc: 'Fill color, border light color and radius.' },
    { name: '--mx / --my', type: 'var', desc: 'Pointer position written per card (px).' }
  ]
});

;
/* docs/registry/motion-stack-cards.js */
RanjDocs.add({
  id: 'stack-cards',
  name: 'Stack Cards',
  group: 'Motion',
  description: 'A swipeable card deck: drag with rotation and LIKE / NOPE stamps, fling with velocity, or use arrow keys and buttons. Swiped cards go to the back.',
  tags: ['new', 'fx', 'js'],
  keywords: ['tinder', 'swipe', 'deck', 'cards', 'drag', 'fling', 'stack'],
  demos: [
    {
      title: 'Travel deck',
      height: 560,
      html: `
<div class="demo-stack-cards-wrap">
  <div class="stack-cards" aria-label="Destinations">
    <div class="stack-card"><div class="demo-stack-cards-photo" style="background:linear-gradient(160deg,#fda4af,#be185d 60%,#4c0519)">🗼</div><div class="demo-stack-cards-info"><b>Kyoto, Japan</b><span>Temples, tea houses &amp; maple season</span></div><span class="sc-stamp sc-stamp-like">LIKE</span><span class="sc-stamp sc-stamp-nope">NOPE</span></div>
    <div class="stack-card"><div class="demo-stack-cards-photo" style="background:linear-gradient(160deg,#a5f3fc,#0891b2 60%,#083344)">🏝️</div><div class="demo-stack-cards-info"><b>Palawan, Philippines</b><span>Limestone lagoons &amp; island hopping</span></div><span class="sc-stamp sc-stamp-like">LIKE</span><span class="sc-stamp sc-stamp-nope">NOPE</span></div>
    <div class="stack-card"><div class="demo-stack-cards-photo" style="background:linear-gradient(160deg,#fde68a,#ea580c 60%,#431407)">🏜️</div><div class="demo-stack-cards-info"><b>Wadi Rum, Jordan</b><span>Red dunes under a sky full of stars</span></div><span class="sc-stamp sc-stamp-like">LIKE</span><span class="sc-stamp sc-stamp-nope">NOPE</span></div>
    <div class="stack-card"><div class="demo-stack-cards-photo" style="background:linear-gradient(160deg,#bbf7d0,#15803d 60%,#052e16)">🏔️</div><div class="demo-stack-cards-info"><b>Dolomites, Italy</b><span>Via ferrata and alpine huts</span></div><span class="sc-stamp sc-stamp-like">LIKE</span><span class="sc-stamp sc-stamp-nope">NOPE</span></div>
  </div>
  <div class="demo-stack-cards-actions">
    <button class="demo-stack-cards-btn nope" data-swipe="left" aria-label="Nope">✕</button>
    <button class="demo-stack-cards-btn like" data-swipe="right" aria-label="Like">♥</button>
  </div>
  <p class="demo-stack-cards-log">Drag, flick, or use ← →</p>
</div>`,
      js: `var log = root.querySelector('.demo-stack-cards-log');
root.addEventListener('ranj:swipe', function (e) { log.textContent = (e.detail.direction === 'right' ? '♥ Liked ' : '✕ Passed ') + e.detail.card.querySelector('b').textContent; });`,
      css: `.demo-stack-cards-wrap { display: grid; justify-items: center; gap: 1.25rem; padding-top: .5rem; }
.demo-stack-cards-photo { height: 72%; display: grid; place-items: center; font-size: 5rem; }
.demo-stack-cards-info { padding: 1rem 1.2rem; display: grid; gap: .15rem; } .demo-stack-cards-info b { font-size: 1.15rem; } .demo-stack-cards-info span { color: var(--muted-fg); font-size: .85rem; }
.demo-stack-cards-actions { display: flex; gap: 1.25rem; margin-top: 1rem; }
.demo-stack-cards-btn { width: 3.5rem; height: 3.5rem; border-radius: 50%; display: grid; place-items: center; font-size: 1.4rem; background: var(--card); border: 1px solid var(--border); box-shadow: var(--shadow-md); transition: transform .2s var(--ease-spring); }
.demo-stack-cards-btn:hover { transform: scale(1.1); } .demo-stack-cards-btn.nope { color: #ef4444; } .demo-stack-cards-btn.like { color: #22c55e; }
.demo-stack-cards-log { color: var(--muted-fg); font-size: .85rem; min-height: 1.4em; }`
    }
  ],
  api: [
    { name: '.stack-cards', type: 'class', desc: 'Deck container (focusable; ← → swipe).' },
    { name: '.stack-card', type: 'class', desc: 'Each card.' },
    { name: '.sc-stamp-like / .sc-stamp-nope', type: 'class', desc: 'Optional stamps that fade in with drag direction (driven by <code>--sc-drag</code>).' },
    { name: 'data-swipe="left|right"', type: 'attr', desc: 'Put on buttons next to the deck (same parent).' },
    { name: 'data-loop', type: 'attr', default: 'true', desc: '<code>false</code> removes swiped cards instead of recycling them.' },
    { name: 'data-threshold', type: 'attr', default: '110', desc: 'Drag distance in px that commits a swipe (fast flicks also count).' },
    { name: 'data-visible', type: 'attr', default: '3', desc: 'Cards shown behind the top one.' },
    { name: '--sc-w / --sc-h / --sc-offset / --sc-scale', type: 'var', default: '300px / 380px / 14px / .05', desc: 'Size and stacking geometry.' },
    { name: 'Ranj.instance(el, "stack-cards").swipe(dir)', type: 'js', desc: 'Swipe programmatically.' },
    { name: 'ranj:swipe', type: 'event', desc: 'detail: <code>{ direction, card, index }</code>' },
    { name: 'ranj:empty', type: 'event', desc: 'All cards swiped (when not looping).' }
  ]
});

;
/* docs/registry/motion-star-border.js */
RanjDocs.add({
  id: 'star-border',
  name: 'Star Border',
  group: 'Interactions',
  description: 'Two soft points of light glide along the top and bottom edges of a button or card, like stars skimming a horizon.',
  tags: ['new', 'fx'],
  keywords: ['star border', 'glowing button', 'light edge', 'animated border'],
  demos: [
    {
      title: 'Buttons',
      height: 240,
      html: `
<button class="star-border"><span class="star-border-inner">Join the waitlist</span></button>
<button class="star-border" style="--star-color: #f472b6; --star-speed: 4s"><span class="star-border-inner">Pink, faster</span></button>
<a href="#" onclick="return false" class="star-border" style="--star-color: #34d399; --star-thickness: 2px"><span class="star-border-inner">Thicker edge</span></a>`
    },
    {
      title: 'Dark hero CTA',
      bg: 'dark',
      height: 240,
      html: `
<button class="star-border demo-star-border-dark" style="--star-color: #fff"><span class="star-border-inner">✦ Start building for free</span></button>`,
      css: `.demo-star-border-dark .star-border-inner { background: linear-gradient(180deg, #111118, #060609); color: #fff; border-color: #2a2a33; padding: 1rem 2rem; font-size: 1.05rem; }`
    }
  ],
  api: [
    { name: '.star-border', type: 'class', desc: 'Outer wrapper (button, link or div).' },
    { name: '.star-border-inner', type: 'class', desc: 'The visible surface.' },
    { name: '--star-color / --star-speed / --star-thickness', type: 'var', default: 'accent tint / 6s / 1px', desc: 'Light color, travel time and edge thickness.' }
  ]
});

;
/* docs/registry/motion-sticky-cards.js */
RanjDocs.add({
  id: 'sticky-cards',
  name: 'Sticky Scroll Cards',
  group: 'Motion',
  description: 'Cards pin as you scroll and stack on top of each other; the ones underneath scale down and dim in proportion to how many cards cover them.',
  tags: ['new', 'fx', 'js'],
  keywords: ['stacking cards', 'sticky', 'scroll stack', 'deck', 'card stack scroll'],
  demos: [
    {
      title: 'Process steps',
      description: 'Scroll inside the panel.',
      pad: false, center: false,
      html: `
<div class="demo-sticky-cards-box">
  <p class="demo-sticky-cards-hint">Scroll ↓</p>
  <div class="sticky-cards">
    <div class="sticky-card demo-sticky-cards-card" style="--c1:#6366f1;--c2:#8b5cf6"><span>01</span><h3>Discover</h3><p>Interviews, analytics and a teardown of what already works.</p></div>
    <div class="sticky-card demo-sticky-cards-card" style="--c1:#0ea5e9;--c2:#14b8a6"><span>02</span><h3>Design</h3><p>Flows, wireframes and a living prototype you can click through.</p></div>
    <div class="sticky-card demo-sticky-cards-card" style="--c1:#f59e0b;--c2:#ef4444"><span>03</span><h3>Build</h3><p>Production code with Ranj UI, reviewed and tested every day.</p></div>
    <div class="sticky-card demo-sticky-cards-card" style="--c1:#ec4899;--c2:#f43f5e"><span>04</span><h3>Launch</h3><p>Ship, measure, iterate. We stay on for the first 90 days.</p></div>
  </div>
  <div style="height: 180px"></div>
</div>`,
      css: `.demo-sticky-cards-box { height: 420px; overflow-y: auto; padding: 0 1.25rem; }
.demo-sticky-cards-hint { height: 120px; display: grid; place-items: center; color: var(--muted-fg); font-size: .875rem; }
.demo-sticky-cards-card { max-width: 560px; margin: 0 auto; width: 100%; min-height: 240px; padding: 1.75rem; border-radius: var(--radius-2xl); color: #fff; display: grid; align-content: end; gap: .35rem; background: linear-gradient(140deg, var(--c1), var(--c2)); box-shadow: 0 -10px 40px -12px rgb(0 0 0 / .35); }
.demo-sticky-cards-card span { font-family: var(--font-mono); opacity: .7; } .demo-sticky-cards-card h3 { font-size: 2rem; } .demo-sticky-cards-card p { opacity: .9; }`
    }
  ],
  api: [
    { name: '.sticky-cards', type: 'class', desc: 'Container; children with <code>.sticky-card</code> pin and stack.' },
    { name: '--top / --step', type: 'var', default: '1.5rem / 14px', desc: 'Pin offset and extra offset per card (so edges peek out).' },
    { name: '--scale-step', type: 'var', default: '.05', desc: 'Scale lost per covering card.' },
    { name: '--depth', type: 'var', desc: 'Written per card: how many cards cover it (fractional). Use it for your own effects.' }
  ]
});

;
/* docs/registry/motion-text-pressure.js */
RanjDocs.add({
  id: 'text-pressure',
  name: 'Text Pressure',
  group: 'Text Effects',
  description: 'Letters near the cursor swell in weight and height using the Inter variable font axis, easing back as the pointer moves away.',
  tags: ['new', 'fx', 'js'],
  keywords: ['variable font', 'font weight', 'cursor', 'proximity', 'hover text', 'interactive type'],
  demos: [
    {
      title: 'Move across the word',
      height: 300,
      html: `
<div class="demo-text-pressure-area">
  <h1 class="demo-text-pressure-h" data-text-pressure data-min="200" data-max="900">PRESSURE</h1>
  <p>Move your pointer over the letters</p>
</div>`,
      css: `.demo-text-pressure-area { width: 100%; padding: 2rem 0; display: grid; justify-items: center; gap: 1rem; }
.demo-text-pressure-h { font-family: var(--font-sans); font-size: clamp(3rem, 1rem + 9vw, 8rem); letter-spacing: -.02em; }
.demo-text-pressure-area p { color: var(--muted-fg); font-size: .85rem; }`
    },
    {
      title: 'Subtle, weight only',
      html: `
<h2 class="demo-text-pressure-sub" data-text-pressure data-min="300" data-max="800" data-scale="0" data-radius="120">Hover over this sentence</h2>`,
      css: `.demo-text-pressure-sub { font-family: var(--font-sans); font-size: 2.25rem; letter-spacing: -.02em; }`
    }
  ],
  api: [
    { name: 'data-text-pressure', type: 'attr', desc: 'Enable on a heading. Uses <code>font-variation-settings: "wght"</code>, so a variable font (Inter) is required.' },
    { name: 'data-min / data-max', type: 'attr', default: '300 / 900', desc: 'Weight range.' },
    { name: 'data-radius', type: 'attr', default: '2.6 × font size', desc: 'Influence radius in px.' },
    { name: 'data-scale', type: 'attr', default: '0.18', desc: 'Extra vertical stretch at full pressure (0 to disable).' },
    { name: 'data-area', type: 'attr', default: 'parent', desc: 'Selector of the element that listens for the pointer; or mark an ancestor with <code>data-pressure-area</code>.' }
  ]
});

;
/* docs/registry/motion-tilt.js */
RanjDocs.add({
  id: 'tilt',
  name: 'Tilt',
  group: 'Interactions',
  description: '3D tilt that follows the pointer with spring smoothing, an optional moving glare, and child layers that float at different depths.',
  tags: ['new', 'fx', 'js'],
  keywords: ['3d card', 'parallax tilt', 'hover tilt', 'vanilla tilt', 'glare', 'holographic'],
  demos: [
    {
      title: 'Card with glare',
      height: 360,
      html: `
<div class="demo-tilt-card" data-tilt data-tilt-glare data-tilt-max="14">
  <div class="demo-tilt-top" data-tilt-depth="40"><span>NOVA</span><b>PRO</b></div>
  <div class="demo-tilt-orb" data-tilt-depth="70"></div>
  <div class="demo-tilt-bottom" data-tilt-depth="30"><b>Nova Pro Max</b><span>From $1,299</span></div>
</div>`,
      css: `.demo-tilt-card { width: min(100%, 300px); aspect-ratio: 3 / 4; border-radius: 1.5rem; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; color: #fff; background: radial-gradient(90% 70% at 70% 30%, #a78bfa, transparent 70%), radial-gradient(80% 60% at 20% 90%, #f472b6, transparent 70%), #1e1b4b; box-shadow: 0 30px 60px -20px rgb(30 27 75 / .7); }
.demo-tilt-top { display: flex; justify-content: space-between; font-weight: 800; letter-spacing: .2em; font-size: .8rem; }
.demo-tilt-orb { width: 120px; height: 120px; margin: 0 auto; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff, #c4b5fd 30%, #6d28d9 70%); box-shadow: 0 20px 50px -10px #7c3aed; }
.demo-tilt-bottom { display: grid; } .demo-tilt-bottom b { font-size: 1.4rem; } .demo-tilt-bottom span { opacity: .75; font-size: .875rem; }`
    },
    {
      title: 'Subtle, reversed',
      description: '<code>data-tilt-reverse</code> tilts away from the pointer; small angles suit content cards.',
      height: 280,
      html: `
<div class="card demo-tilt-plain" data-tilt data-tilt-max="6" data-tilt-scale="1.02" data-tilt-reverse data-tilt-glare data-tilt-glare-max="0.25">
  <div class="card-header"><h3 class="card-title">Q3 revenue</h3><p class="card-description">Up 24% vs last quarter</p></div>
  <div class="card-content"><b class="demo-tilt-num">$1.82M</b></div>
</div>`,
      css: `.demo-tilt-plain { width: min(100%, 320px); } .demo-tilt-num { font-size: 2.5rem; letter-spacing: -.04em; }`
    }
  ],
  api: [
    { name: 'data-tilt', type: 'attr', desc: 'Enable on any element.' },
    { name: 'data-tilt-max', type: 'attr', default: '12', desc: 'Max rotation in degrees.' },
    { name: 'data-tilt-scale', type: 'attr', default: '1.03', desc: 'Scale while hovered.' },
    { name: 'data-tilt-perspective', type: 'attr', default: '900', desc: 'Perspective in px.' },
    { name: 'data-tilt-glare / data-tilt-glare-max', type: 'attr', default: 'false / 0.45', desc: 'Add a glare layer and its max intensity.' },
    { name: 'data-tilt-reverse', type: 'attr', desc: 'Tilt away from the pointer.' },
    { name: 'data-tilt-depth', type: 'attr', desc: 'On children: translateZ in px for layered depth.' },
    { name: '--px / --py', type: 'var', desc: 'Pointer position 0–1 written on the element, for custom effects.' }
  ]
});

;
/* docs/registry/motion-true-focus.js */
RanjDocs.add({
  id: 'true-focus',
  name: 'True Focus',
  group: 'Text Effects',
  description: 'One word at a time comes into sharp focus while animated corner brackets glide to frame it; the rest stay softly blurred.',
  tags: ['new', 'fx', 'js'],
  keywords: ['focus', 'blur words', 'brackets', 'viewfinder', 'highlight word'],
  demos: [
    {
      title: 'Auto cycle',
      height: 240,
      html: `
<h1 class="demo-true-focus-h" data-true-focus>Design Build Ship Repeat</h1>`,
      css: `.demo-true-focus-h { font-size: clamp(2rem, 1rem + 4vw, 4rem); font-weight: 900; letter-spacing: -.03em; }`
    },
    {
      title: 'Follow the pointer',
      html: `
<h2 class="demo-true-focus-h2" data-true-focus data-trigger="hover" style="--tf-color: var(--success); --tf-blur: 3px">Hover any word in this line</h2>`,
      css: `.demo-true-focus-h2 { font-size: 2rem; font-weight: 800; letter-spacing: -.02em; }`
    }
  ],
  api: [
    { name: 'data-true-focus', type: 'attr', desc: 'Enable on a heading; each word becomes a focus target.' },
    { name: 'data-interval', type: 'attr', default: '1800', desc: 'Milliseconds per word in auto mode.' },
    { name: 'data-trigger', type: 'attr', default: 'auto', desc: '<code>hover</code> moves focus to the hovered word.' },
    { name: '--tf-blur / --tf-color / --tf-dur', type: 'var', default: '5px / var(--primary) / 500ms', desc: 'Blur amount, bracket color and glide time.' },
    { name: '--tf-corner / --tf-pad', type: 'var', default: '14px / .14em', desc: 'Bracket size and offset.' },
    { name: 'ranj:change', type: 'event', desc: 'detail: <code>{ index }</code>' }
  ]
});

;
/* docs/registry/motion-typewriter.js */
RanjDocs.add({
  id: 'typewriter',
  name: 'Typewriter',
  group: 'Text Effects',
  description: 'Types phrases character by character with human-feeling jitter, pauses, deletes and moves on to the next. Bar, block or underscore caret.',
  tags: ['new', 'fx', 'js'],
  keywords: ['typing', 'typed', 'caret', 'cursor', 'type effect', 'terminal'],
  demos: [
    {
      title: 'Looping phrases',
      height: 220,
      html: `
<h2 class="demo-typewriter-h">Ranj UI is <span class="demo-typewriter-accent" data-typewriter data-words="fast.|accessible.|tiny.|a joy to use."></span></h2>`,
      css: `.demo-typewriter-h { font-size: clamp(1.8rem, 1.3rem + 2vw, 3rem); text-align: center; }
.demo-typewriter-accent { color: var(--primary); }`
    },
    {
      title: 'Terminal, block caret',
      bg: 'dark',
      height: 240,
      html: `
<div class="demo-typewriter-term">
  <span class="demo-typewriter-prompt">~/app ❯</span> <span data-typewriter data-cursor="block" data-speed="55" data-pause="2200" data-words="npm i @ranj/ui|npx ranj add marquee|git push origin main"></span>
</div>`,
      css: `.demo-typewriter-term { width: min(100%, 520px); padding: 1.1rem 1.25rem; border-radius: 12px; background: #0b0d12; border: 1px solid #23262f; color: #e5e7eb; font-family: var(--font-mono); font-size: .95rem; --tw-caret-color: #a78bfa; }
.demo-typewriter-prompt { color: #34d399; }`
    },
    {
      title: 'Type once, underscore caret',
      html: `
<p class="demo-typewriter-p" data-typewriter data-loop="false" data-cursor="underscore" data-speed="45">Hello, Alex. Your report is ready.</p>`,
      css: `.demo-typewriter-p { font-family: var(--font-mono); font-size: 1.1rem; }`
    }
  ],
  api: [
    { name: 'data-typewriter', type: 'attr', desc: 'Enables typing. Phrases come from <code>data-words</code> (pipe-separated), the attribute value, or the element text.' },
    { name: 'data-words', type: 'attr', desc: '<code>first|second|third</code>' },
    { name: 'data-speed / data-delete-speed', type: 'attr', default: '60 / 32', desc: 'Milliseconds per character.' },
    { name: 'data-pause', type: 'attr', default: '1600', desc: 'Hold time when a phrase is complete.' },
    { name: 'data-loop', type: 'attr', default: 'true', desc: '<code>false</code> types each phrase once and stops on the last.' },
    { name: 'data-cursor', type: 'attr', default: 'bar', desc: 'bar, block or underscore. <code>data-caret="false"</code> hides it.' },
    { name: 'data-variable', type: 'attr', default: 'true', desc: 'Random per-key jitter so it feels human.' },
    { name: 'data-start-delay', type: 'attr', default: '250', desc: 'Delay after entering view.' },
    { name: '--tw-caret-color / --tw-blink', type: 'var', default: 'var(--primary) / 1s', desc: 'Caret color and blink rate.' },
    { name: 'ranj:typed', type: 'event', desc: 'detail: <code>{ index, word }</code> whenever a phrase completes.' }
  ]
});

;
/* docs/registry/motion-wave-text.js */
RanjDocs.add({
  id: 'wave-text',
  name: 'Wave Text',
  group: 'Text Effects',
  description: 'Letters bob in a continuous travelling wave. Variants scale, recolor or squash like jelly; a hover mode lifts each letter in sequence.',
  tags: ['new', 'fx', 'js'],
  keywords: ['bounce', 'bob', 'wavy', 'loading text', 'jelly'],
  demos: [
    {
      title: 'Variants',
      height: 300,
      html: `
<div class="demo-wave-text-list">
  <h2 data-wave-text>Loading your workspace…</h2>
  <h2 data-wave-text data-wave="scale">Scale wave</h2>
  <h2 data-wave-text data-wave="color" style="--wt-step: 50ms">Color sweep</h2>
  <h2 data-wave-text data-wave="jelly" style="--wt-dur: 2.2s">Jelly letters</h2>
</div>`,
      css: `.demo-wave-text-list { display: grid; gap: 1rem; text-align: center; }`
    },
    {
      title: 'Lift on hover',
      html: `
<a href="#" onclick="return false" class="demo-wave-text-link" data-wave-text data-trigger="hover">Hover this link</a>`,
      css: `.demo-wave-text-link { font-size: 2rem; font-weight: 800; color: var(--fg); text-decoration: none !important; letter-spacing: -.02em; }`
    }
  ],
  api: [
    { name: 'data-wave-text', type: 'attr', default: 'chars', desc: 'Enable; value <code>words</code> waves by word.' },
    { name: 'data-wave', type: 'attr', default: 'bob', desc: 'bob, scale, color, jelly.' },
    { name: 'data-trigger="hover"', type: 'attr', desc: 'Static until hovered, then letters lift in sequence.' },
    { name: '--wt-amp / --wt-dur / --wt-step', type: 'var', default: '.22em / 1.6s / 70ms', desc: 'Height, cycle length and per-letter offset.' }
  ]
});

;
/* docs/registry/motion-word-globe.js */
RanjDocs.add({
  id: 'word-globe',
  name: 'Word Globe',
  group: 'Motion',
  description: 'Words evenly distributed on a 3D sphere that slowly spins, steers toward the pointer and can be dragged and flung with inertia. Depth drives scale, opacity and blur.',
  tags: ['new', 'fx', 'js'],
  keywords: ['tag cloud', 'sphere', '3d text', 'skills globe', 'orbital text', 'tag sphere'],
  demos: [
    {
      title: 'Skills globe',
      description: 'Drag to spin it; hover steers it.',
      height: 420,
      html: `
<div class="word-globe" style="--globe-size: 380px">
  <span class="wg-accent">HTML</span><span>CSS</span><span class="wg-accent">JavaScript</span><span>TypeScript</span><span>React</span><span>Vue</span><span>Svelte</span><span>Astro</span><span class="wg-accent">Figma</span><span>Node</span><span>Deno</span><span>Bun</span><span>Vite</span><span>Tailwind</span><span>Motion</span><span>A11y</span><span>WebGL</span><span>SVG</span><span>Canvas</span><span class="wg-accent">Ranj UI</span><span>Rust</span><span>Go</span><span>Postgres</span><span>Redis</span><span>GraphQL</span><span>Docker</span><span>Edge</span><span>Workers</span><span>OKLCH</span><span>Grid</span>
</div>`
    },
    {
      title: 'From data-words, tinted',
      height: 360,
      html: `
<div class="word-globe" style="--globe-size: 300px; --globe-color: var(--primary)" data-speed="1.6" data-words="design|motion|type|color|grid|space|rhythm|contrast|depth|texture|balance|scale|weight|tone|form|light"></div>`
    }
  ],
  api: [
    { name: '.word-globe', type: 'class', desc: 'Container; each child is a word (or use <code>data-words</code>).' },
    { name: '.wg-accent', type: 'class', desc: 'Highlight a word.' },
    { name: 'data-words', type: 'attr', desc: 'Pipe-separated words to generate.' },
    { name: 'data-speed', type: 'attr', default: '1', desc: 'Auto-rotation and steering multiplier.' },
    { name: 'data-radius', type: 'attr', default: '0.78', desc: 'Sphere radius as a fraction of half the width.' },
    { name: '--globe-size / --globe-color / --globe-accent', type: 'var', default: '340px / var(--fg) / var(--primary)', desc: 'Size and colors.' }
  ]
});

;
/* docs/registry/overlays-00-icons.js */
/* Shared inline icons for the Overlays / Navigation / Feedback docs demos (lucide-style, 24px grid). */
(function (w) {
  var P = {
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
    keyboard: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    lifebuoy: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    pencil: '<path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5zM15 5l4 4"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    fileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronsUpDown: '<path d="m7 15 5 5 5-5M7 9l5-5 5 5"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
    alertCircle: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    sparkles: '<path d="M9.94 14.06 8.5 18.5l-1.44-4.44L2.62 12.62 7.06 11.2 8.5 6.75l1.44 4.44 4.44 1.43zM18 3l.9 2.1L21 6l-2.1.9L18 9l-.9-2.1L15 6l2.1-.9zM18 15l.6 1.4L20 17l-1.4.6L18 19l-.6-1.4L16 17l1.4-.6z"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    layout: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    chart: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
    pie: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    star: '<path d="M11.53 2.3a.53.53 0 0 1 .94 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.13a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.9l5.16-.76a2.12 2.12 0 0 0 1.6-1.16z"/>',
    more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    moreV: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    arrowUp: '<path d="m5 12 7-7 7 7M12 19V5"/>',
    arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    pin: '<path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    video: '<path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.87a.5.5 0 0 0-.75-.43L16 10.5"/><rect width="14" height="12" x="2" y="6" rx="2"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    terminal: '<path d="m4 17 6-6-6-6M12 19h8"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.8 5.4a2 2 0 0 1-1.28 1.28l-5.4 1.8 1.8-5.4a2 2 0 0 1 1.28-1.28z"/>',
    package: '<path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
    archive: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    wand: '<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72ZM14 7l3 3M5 6v4M19 14v4M10 2v2M7 8H3M21 16h-4M11 3H9"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
    clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
    redo: '<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>',
    print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
    command: '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>',
    panel: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    wifi: '<path d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.86a10 10 0 0 1 14 0M8.5 16.43a5 5 0 0 1 7 0"/>',
    battery: '<rect width="16" height="10" x="2" y="7" rx="2"/><path d="M22 11v2"/>'
  };
  function icon(name, size, extra) {
    return '<svg ' + (size ? 'width="' + size + '" height="' + size + '" ' : '') + 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra ? ' ' + extra : '') + '>' + (P[name] || '') + '</svg>';
  }
  var I = {};
  Object.keys(P).forEach(function (k) { I[k] = icon(k); });
  I.svg = icon;
  // Tiny avatar helper (initials on a hue-tinted disc) — no network images needed.
  I.avatar = function (initials, hue, size) {
    size = size || 36;
    return '<span class="demo-ov-avatar" style="--h:' + (hue == null ? 252 : hue) + ';width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * .38) + 'px">' + initials + '</span>';
  };
  w.__ovI = I;
  // demo-only avatar style (shared)
  if (!document.getElementById('demo-ov-shared')) {
    var s = document.createElement('style'); s.id = 'demo-ov-shared';
    s.textContent = '.demo-ov-avatar{display:inline-grid;place-items:center;flex-shrink:0;border-radius:999px;font-weight:600;letter-spacing:.02em;color:oklch(.98 .02 var(--h));background:linear-gradient(135deg,oklch(.68 .16 var(--h)),oklch(.52 .2 calc(var(--h) + 40)));box-shadow:inset 0 0 0 1px rgb(255 255 255 / .15)}';
    document.head.appendChild(s);
  }
})(window);

;
/* docs/registry/overlays-accordion.js */
(function () {
  var I = window.__ovI;
  var faq = [
    ['Is it accessible?', 'Yes. It follows the WAI-ARIA accordion pattern: buttons with <code>aria-expanded</code>, labelled regions, and ↑ ↓ Home End to move between headers.'],
    ['Is it styled?', 'It comes with sensible defaults that match the rest of Ranj UI, and every color, radius and duration comes from a design token.'],
    ['Is it animated?', 'Height animates with the CSS grid-rows trick, so content of any size opens smoothly, with no <code>max-height</code> guesswork.'],
    ['Can I open more than one?', 'Add <code>data-multiple</code> to the accordion and items open independently.']
  ];
  function items(list, open) { return list.map(function (f, i) { return '<div class="accordion-item"' + (i === open ? ' data-state="open"' : '') + '><button class="accordion-trigger">' + f[0] + '</button><div class="accordion-content"><div class="accordion-body">' + f[1] + '</div></div></div>'; }).join(''); }
  RanjDocs.add({
    id: 'accordion',
    name: 'Accordion',
    group: 'Navigation',
    description: 'Stacked headings that expand to reveal content, with real height animation (grid-rows trick), single or multiple mode, keyboard navigation and bordered, card and flush styles. v1 markup keeps working.',
    tags: ['js'],
    keywords: ['faq', 'expand', 'collapse', 'disclosure', 'details'],
    demos: [
      {
        title: 'Default',
        center: false,
        html: `<div class="accordion" style="max-width: 34rem; margin: 0 auto">${items(faq, 0)}</div>`,
        css: `.accordion-body code { font-family: var(--font-mono); font-size: .85em; background: var(--muted); padding: .1em .35em; border-radius: 4px; }`
      },
      {
        title: 'Cards with icons (multiple)',
        center: false,
        html: `
<div class="accordion accordion-card" data-multiple style="max-width: 34rem; margin: 0 auto">
  <div class="accordion-item" data-state="open">
    <button class="accordion-trigger"><span class="accordion-icon">${I.card}</span><span class="accordion-title">Billing & payments<span class="accordion-meta" style="display:block">Invoices, cards, refunds</span></span></button>
    <div class="accordion-content"><div class="accordion-body">Invoices are issued on the 1st of each month and paid automatically with the card on file. Refunds land in 5–10 business days.</div></div>
  </div>
  <div class="accordion-item">
    <button class="accordion-trigger"><span class="accordion-icon">${I.shield}</span><span class="accordion-title">Security<span class="accordion-meta" style="display:block">SSO, 2FA, audit logs</span></span></button>
    <div class="accordion-content"><div class="accordion-body">Enforce SAML SSO for every member, require two-factor authentication, and export 12 months of audit logs from Settings → Security.</div></div>
  </div>
  <div class="accordion-item">
    <button class="accordion-trigger"><span class="accordion-icon">${I.users}</span><span class="accordion-title">Team management<span class="accordion-meta" style="display:block">Roles and seats</span></span></button>
    <div class="accordion-content"><div class="accordion-body">Owners can invite members, assign Admin, Editor or Viewer roles, and transfer ownership. Seats are prorated to the day.</div></div>
  </div>
</div>`
      },
      {
        title: 'Flush with plus icon',
        center: false,
        html: `<div class="accordion accordion-flush accordion-plus" style="max-width: 34rem; margin: 0 auto">${items([
          ['How long does shipping take?', 'Orders ship within 24 hours. Standard delivery takes 3–5 business days in the US and 5–9 internationally.'],
          ['What is your return policy?', 'Return anything within 60 days, worn or not. Print a free label from your order page.'],
          ['Do you offer gift wrapping?', 'Yes: add it at checkout for $5. We include a handwritten note if you leave one.']
        ], -1)}</div>`
      }
    ],
    api: [
      { name: '.accordion > .accordion-item', type: 'class', desc: 'Items: <code>.accordion-trigger</code> + <code>.accordion-content</code> &gt; <code>.accordion-body</code> (added if missing).' },
      { name: '.accordion-card / -flush / -plus', type: 'class', desc: 'Separated cards, frameless dividers, plus/minus icon.' },
      { name: '.accordion-icon / .accordion-meta / .accordion-title', type: 'class', desc: 'Leading icon tile, secondary text, title wrapper.' },
      { name: 'data-state="open"', type: 'attr', desc: 'On an item: open initially.' },
      { name: 'data-multiple', type: 'attr', desc: 'Allow several open items (also <code>data-type="multiple"</code>).' },
      { name: 'data-collapsible="false"', type: 'attr', desc: 'Single mode: one item always stays open.' },
      { name: 'Ranj.accordion.toggle(item, open?)', type: 'js', desc: 'Programmatic toggle.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ item, open }</code> on the accordion.' }
    ]
  });
})();

;
/* docs/registry/overlays-action-loading.js */
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

;
/* docs/registry/overlays-alert-dialog.js */
(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'alert-dialog',
    name: 'Alert Dialog',
    group: 'Overlays',
    description: 'An interrupting confirmation that needs an answer. The backdrop never dismisses it. Use it as markup, or call <code>Ranj.confirm()</code> and <code>Ranj.prompt()</code>, which return promises.',
    tags: ['js'],
    keywords: ['confirm', 'are you sure', 'prompt', 'delete confirmation', 'modal'],
    demos: [
      {
        title: 'Destructive confirmation',
        html: `
<button class="btn btn-destructive" data-dialog-open="alert-dialog-delete">${I.trash} Delete project</button>

<div class="dialog-overlay" id="alert-dialog-delete">
  <div class="dialog alert-dialog alert-dialog-danger">
    <div class="alert-dialog-body">
      <div class="alert-dialog-media">${I.alert}</div>
      <div class="alert-dialog-text">
        <h2 class="alert-dialog-title">Delete “Atlas Redesign”?</h2>
        <p class="alert-dialog-description">This permanently deletes the project, its 48 files and 312 comments. This action cannot be undone.</p>
      </div>
    </div>
    <div class="alert-dialog-footer">
      <button class="btn btn-outline" data-dialog-close autofocus>Cancel</button>
      <button class="btn btn-destructive" data-dialog-close>Delete project</button>
    </div>
  </div>
</div>`
      },
      {
        title: 'Ranj.confirm()',
        description: 'Builds the dialog for you and resolves to <code>true</code> or <code>false</code>. Pass <code>onConfirm</code> returning a promise to show a loading state until it settles.',
        html: `
<button class="btn btn-outline" id="alert-dialog-c1">${I.logout} Sign out</button>
<button class="btn btn-outline" id="alert-dialog-c2">${I.archive} Archive 12 threads</button>
<button class="btn btn-destructive" id="alert-dialog-c3">${I.trash} Revoke API key</button>
<p class="demo-alert-dialog-out" id="alert-dialog-out">Result appears here</p>`,
        js: `var out = root.querySelector('#alert-dialog-out');
function show(label, v) { out.textContent = label + ' → ' + JSON.stringify(v); }
root.querySelector('#alert-dialog-c1').onclick = function () {
  Ranj.confirm({ title: 'Sign out of Northwind?', description: 'You will need to sign in again on this device.', confirmText: 'Sign out' })
    .then(function (ok) { show('confirm', ok); });
};
root.querySelector('#alert-dialog-c2').onclick = function () {
  Ranj.confirm({ title: 'Archive 12 threads?', description: 'They move to Archive and stop notifying you. Saving takes a moment.', confirmText: 'Archive',
    onConfirm: function () { return new Promise(function (r) { setTimeout(r, 1400); }); } })
    .then(function (ok) { show('async confirm', ok); });
};
root.querySelector('#alert-dialog-c3').onclick = function () {
  Ranj.confirm({ title: 'Revoke “production-ci”?', description: 'Any service using this key will immediately lose access. Created by Ana Souza on Mar 4.', confirmText: 'Revoke key', danger: true })
    .then(function (ok) { show('danger', ok); });
};`,
        css: `.demo-alert-dialog-out { width: 100%; text-align: center; font-family: var(--font-mono); font-size: .75rem; color: var(--muted-fg); }`
      },
      {
        title: 'Ranj.prompt()',
        description: 'Asks for a value with optional validation. Resolves to the string, or <code>null</code> when cancelled.',
        html: `
<button class="btn" id="alert-dialog-p">${I.folder} New folder</button>
<p class="demo-alert-dialog-out" id="alert-dialog-pout">No folder yet</p>`,
        js: `var out = root.querySelector('#alert-dialog-pout');
root.querySelector('#alert-dialog-p').onclick = function () {
  Ranj.prompt({ title: 'Create folder', description: 'Folders help you group related documents.', label: 'Folder name', placeholder: 'e.g. Q4 Planning', confirmText: 'Create',
    validate: function (v) { return v.trim().length < 2 ? 'Use at least 2 characters' : /[\\/:*?]/.test(v) ? 'Avoid / : * ?' : true; } })
    .then(function (v) { out.textContent = v === null ? 'Cancelled' : 'Created “' + v + '”'; });
};`
      },
      {
        title: 'Centered',
        html: `
<button class="btn btn-outline" data-dialog-open="alert-dialog-session">${I.clock} Session timeout</button>

<div class="dialog-overlay" id="alert-dialog-session">
  <div class="dialog alert-dialog alert-dialog-centered" style="--dialog-w: 22rem">
    <div class="alert-dialog-body">
      <div class="alert-dialog-media">${I.clock}</div>
      <div class="alert-dialog-text">
        <h2 class="alert-dialog-title">Still there?</h2>
        <p class="alert-dialog-description">You'll be signed out in 2 minutes due to inactivity.</p>
      </div>
    </div>
    <div class="alert-dialog-footer">
      <button class="btn btn-outline" data-dialog-close>Sign out</button>
      <button class="btn" data-dialog-close autofocus>Stay signed in</button>
    </div>
  </div>
</div>`
      }
    ],
    api: [
      { name: '.alert-dialog', type: 'class', desc: 'Add to a <code>.dialog</code> inside a <code>.dialog-overlay</code>. Gets <code>role="alertdialog"</code>; backdrop clicks bump instead of closing.' },
      { name: '.alert-dialog-body / -footer', type: 'class', desc: 'Layout parts: <code>-media</code> (icon), <code>-text</code>, <code>-title</code>, <code>-description</code>. Stacks and centers on phones.' },
      { name: '.alert-dialog-danger', type: 'class', desc: 'Red icon tile.' },
      { name: '.alert-dialog-centered', type: 'class', desc: 'Centered layout with equal-width buttons.' },
      { name: 'Ranj.confirm(opts)', type: 'js', desc: '→ <code>Promise&lt;boolean&gt;</code>. opts: <code>title, description, confirmText, cancelText, danger, icon, centered, onConfirm(): Promise</code>.' },
      { name: 'Ranj.prompt(opts)', type: 'js', desc: '→ <code>Promise&lt;string|null&gt;</code>. Adds <code>label, placeholder, defaultValue, type, validate(v) → true | "error"</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-alert.js */
(function () {
  var I = window.__ovI;
  var x = '<button class="alert-close" aria-label="Dismiss">' + I.x + '</button>';
  RanjDocs.add({
    id: 'alert',
    name: 'Alert',
    group: 'Feedback',
    description: 'An inline message for status, warnings and errors. Soft, outline, accent and solid styles, optional actions, and a dismiss button that collapses the alert smoothly instead of popping it out.',
    tags: [],
    keywords: ['callout', 'notice', 'message', 'banner', 'inline notification', 'warning'],
    demos: [
      {
        title: 'Variants',
        center: false,
        html: `
<div class="demo-alert-stack">
  <div class="alert"><span class="alert-icon">${I.terminal}</span><div class="alert-content"><div class="alert-title">Heads up!</div><div class="alert-description">You can add components to your app using the CLI.</div></div></div>
  <div class="alert alert-info"><span class="alert-icon">${I.info}</span><div class="alert-content"><div class="alert-title">Scheduled maintenance</div><div class="alert-description">The API will be read-only on Saturday from 02:00 to 03:00 UTC.</div></div></div>
  <div class="alert alert-success"><span class="alert-icon">${I.checkCircle}</span><div class="alert-content"><div class="alert-title">Domain verified</div><div class="alert-description"><b>northwind.app</b> is connected and serving traffic over HTTPS.</div></div></div>
  <div class="alert alert-warning"><span class="alert-icon">${I.alert}</span><div class="alert-content"><div class="alert-title">Your trial ends in 3 days</div><div class="alert-description">Add a payment method to keep your projects and history. <a href="#">Upgrade now</a></div></div></div>
  <div class="alert alert-destructive"><span class="alert-icon">${I.alertCircle}</span><div class="alert-content"><div class="alert-title">Build failed</div><div class="alert-description">Type error in <code>src/billing/invoice.ts:42</code>. Fix it and push again.</div></div></div>
</div>`,
        css: `.demo-alert-stack { display: grid; gap: .75rem; max-width: 36rem; margin: 0 auto; } .demo-alert-stack code { font-family: var(--font-mono); font-size: .85em; }`
      },
      {
        title: 'Styles',
        center: false,
        html: `
<div class="demo-alert-stack">
  <div class="alert alert-info alert-accent"><span class="alert-icon">${I.info}</span><div class="alert-content"><div class="alert-title">Accent</div><div class="alert-description">A thicker leading edge for documentation callouts.</div></div></div>
  <div class="alert alert-success alert-outline"><span class="alert-icon">${I.checkCircle}</span><div class="alert-content"><div class="alert-title">Outline</div><div class="alert-description">Colored border and text on a transparent surface.</div></div></div>
  <div class="alert alert-primary alert-solid"><span class="alert-icon">${I.sparkles}</span><div class="alert-content"><div class="alert-title">Solid</div><div class="alert-description">High emphasis, for the one thing users must not miss.</div></div></div>
  <div class="alert alert-solid"><span class="alert-icon">${I.zap}</span><div class="alert-content"><div class="alert-title">Northwind 4 is here</div></div><div class="alert-actions-end"><button class="btn btn-sm btn-secondary">See what's new</button></div></div>
</div>`,
        css: `.demo-alert-stack { display: grid; gap: .75rem; max-width: 36rem; margin: 0 auto; }`
      },
      {
        title: 'Dismissible with actions',
        description: 'The close button animates the height away; neighbours slide up. Restore with <code>Ranj.alert.show(el)</code>.',
        center: false,
        html: `
<div class="demo-alert-stack">
  <div class="alert alert-warning" data-alert-hide id="alert-backup">
    <span class="alert-icon">${I.shield}</span>
    <div class="alert-content">
      <div class="alert-title">Turn on two-factor authentication</div>
      <div class="alert-description">Your account holds billing access for 4 workspaces. Protect it with an authenticator app.</div>
      <div class="alert-actions"><button class="btn btn-sm">Set up 2FA</button><button class="btn btn-sm btn-ghost" data-alert-close>Remind me later</button></div>
    </div>
    ${x}
  </div>
  <div class="alert alert-info" data-alert-hide id="alert-cookie"><span class="alert-icon">${I.info}</span><div class="alert-content"><div class="alert-description">We updated our privacy policy on November 1. <a href="#">Read the changes</a></div></div>${x}</div>
  <div class="alert" data-alert-hide id="alert-tip"><span class="alert-icon">${I.keyboard}</span><div class="alert-content"><div class="alert-description">Pro tip: press <b>G</b> then <b>I</b> to jump to your inbox.</div></div>${x}</div>
  <button class="btn btn-outline btn-sm" id="alert-reset" style="justify-self:center">${I.refresh} Restore alerts</button>
</div>`,
        js: `root.querySelector('#alert-reset').onclick = function () { root.querySelectorAll('.alert[hidden]').forEach(function (a, i) { setTimeout(function () { Ranj.alert.show(a); }, i * 80); }); };`,
        css: `.demo-alert-stack { display: grid; gap: .75rem; max-width: 36rem; margin: 0 auto; } #alert-reset svg { width: .9rem; height: .9rem; }`
      },
      {
        title: 'Banner',
        pad: false,
        center: false,
        html: `
<div style="width:100%">
  <div class="alert alert-primary alert-banner" data-alert-hide><span class="alert-icon">${I.gift}</span><div class="alert-content"><div class="alert-description"><b>Black Friday:</b> 40% off annual plans until Dec 2. <a href="#">Claim offer →</a></div></div>${x}</div>
  <div class="demo-alert-page">Your page content</div>
</div>`,
        css: `.demo-alert-page { display: grid; place-items: center; height: 9rem; color: var(--muted-fg); font-size: .875rem; }`
      }
    ],
    api: [
      { name: '.alert', type: 'class', desc: 'Container. Children: <code>.alert-icon</code> (or a leading svg), <code>.alert-content</code> with <code>.alert-title</code> / <code>.alert-description</code>.' },
      { name: '.alert-info / -success / -warning / -destructive / -primary', type: 'class', desc: 'Color variants (<code>.alert-error</code> and <code>.alert-danger</code> alias destructive).' },
      { name: '.alert-outline / -accent / -solid / -banner', type: 'class', desc: 'Styles.' },
      { name: '.alert-actions / .alert-actions-end', type: 'class', desc: 'Button row under the text, or trailing on the right.' },
      { name: '.alert-close / data-alert-close', type: 'class', desc: 'Dismiss button (animated collapse).' },
      { name: 'data-alert-hide', type: 'attr', desc: 'Hide instead of removing on dismiss.' },
      { name: 'Ranj.alert.dismiss(el) / show(el)', type: 'js', desc: 'Programmatic dismiss / restore (with enter animation).' },
      { name: 'ranj:close', type: 'event', desc: 'Cancelable, fired before collapsing.' }
    ]
  });
})();

;
/* docs/registry/overlays-back-to-top.js */
(function () {
  var I = window.__ovI;
  var paras = ['The first prototype of Northwind was a single HTML file and a spreadsheet. It worked, barely, and the people using it loved it anyway.',
    'By spring we had rewritten the sync engine twice. The second rewrite cut median save latency from 900ms to 60ms, and it still powers everything today.',
    'Growth came from teams inviting teams. We never ran an ad; the share button did the marketing for us.',
    'In 2025 we opened our first office in Lisbon. Half the company still works remotely, and we meet in person four times a year.',
    'What hasn’t changed is the bar: every feature is used internally for two weeks before it ships, and anything that feels slow is a bug.'];
  function article(id) {
    return '<div class="demo-btt-scroll" id="' + id + '"><article class="demo-btt-article">' + ['Origins', 'The rewrite', 'Growth', 'Lisbon', 'The bar'].map(function (h, i) {
      return '<h4 id="' + id + '-s' + i + '">' + h + '</h4><p>' + paras[i] + '</p><p>' + paras[(i + 2) % 5] + '</p>';
    }).join('') + '</article></div>';
  }
  var css = `.demo-btt-scroll { height: 320px; overflow-y: auto; border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); scroll-behavior: auto; }
.demo-btt-article { padding: 1.5rem 1.75rem 4rem; max-width: 36rem; }
.demo-btt-article h4 { font-size: 1.05rem; font-weight: 650; letter-spacing: -.01em; margin: 1.75rem 0 .5rem; } .demo-btt-article h4:first-child { margin-top: 0; }
.demo-btt-article p { color: var(--muted-fg); font-size: .9063rem; line-height: 1.75; margin-bottom: .75rem; }`;

  RanjDocs.add({
    id: 'back-to-top',
    name: 'Back to Top',
    group: 'Navigation',
    description: 'A button that appears once the reader scrolls down, shows reading progress as a ring around the arrow, and smoothly returns to the top. Works for the page or any scroll container.',
    tags: ['js', 'new'],
    keywords: ['scroll to top', 'go up', 'reading progress', 'scroll progress'],
    demos: [
      {
        title: 'In a scroll container',
        description: 'Scroll the article: after 120px the button springs in and its ring tracks progress.',
        center: false,
        html: `
<div class="demo-btt-wrap">
  ${article('btt-article')}
  <button class="back-to-top back-to-top-absolute" data-target="#btt-article" data-offset="120"></button>
</div>`,
        css: css + `.demo-btt-wrap { position: relative; max-width: 36rem; margin: 0 auto; } .demo-btt-wrap .back-to-top { right: 1rem; bottom: 1rem; }`
      },
      {
        title: 'Variants',
        description: 'Solid, and a pill with a label.',
        center: false,
        html: `
<div class="demo-btt-wrap">
  ${article('btt-article-2')}
  <button class="back-to-top back-to-top-absolute back-to-top-solid" data-target="#btt-article-2" data-offset="80" style="right:4.25rem;bottom:1rem"></button>
  <button class="back-to-top back-to-top-absolute back-to-top-pill" data-target="#btt-article-2" data-offset="80" style="right:auto;left:1rem;bottom:1rem">${I.svg('arrowUp', 16, 'class="back-to-top-arrow"')} Top</button>
</div>`,
        css: `.demo-btt-wrap { position: relative; max-width: 36rem; margin: 0 auto; }`
      }
    ],
    api: [
      { name: '.back-to-top', type: 'class', desc: 'Fixed bottom-right button. Empty buttons get an arrow and a progress ring automatically.' },
      { name: '.back-to-top-absolute', type: 'class', desc: 'Position inside a relative wrapper (for scroll containers).' },
      { name: '.back-to-top-solid / -pill', type: 'class', desc: 'Primary fill; labelled pill without ring.' },
      { name: 'data-target', type: 'attr', default: 'window', desc: 'Selector of the scroll container to watch.' },
      { name: 'data-offset', type: 'attr', default: '320', desc: 'Scroll distance (px) before it appears.' },
      { name: '--p', type: 'var', desc: 'Scroll progress 0–1, set on the button (drive your own visuals with it).' }
    ]
  });

  RanjDocs.add({
    id: 'scrollspy',
    name: 'Scrollspy / Table of Contents',
    group: 'Navigation',
    description: 'An "On this page" list that highlights the section you are reading, with a glowing indicator that slides between links, passed-section styling, nested levels and smooth scrolling (without touching the URL hash).',
    tags: ['js', 'new'],
    keywords: ['toc', 'table of contents', 'on this page', 'scroll spy', 'anchor nav'],
    demos: [
      {
        title: 'Article outline',
        center: false,
        html: `
<div class="demo-spy">
  ${article('spy-article')}
  <nav class="toc" data-target="#spy-article" aria-label="On this page">
    <div class="toc-title">On this page</div>
    <a class="toc-link" href="#spy-article-s0">Origins</a>
    <a class="toc-link" href="#spy-article-s1">The rewrite</a>
    <a class="toc-link toc-sub" href="#spy-article-s2">Growth</a>
    <a class="toc-link toc-sub" href="#spy-article-s3">Lisbon</a>
    <a class="toc-link" href="#spy-article-s4">The bar</a>
    <div class="toc-progress"><span></span></div>
  </nav>
</div>`,
        css: css + `.demo-spy { display: grid; grid-template-columns: minmax(0, 1fr) 11rem; gap: 1.5rem; align-items: start; max-width: 48rem; margin: 0 auto; }
@media (max-width: 640px) { .demo-spy { grid-template-columns: minmax(0, 1fr); } .demo-spy .toc { order: -1; } }`
      },
      {
        title: 'Pill style',
        center: false,
        html: `
<div class="demo-spy">
  ${article('spy-article-2')}
  <nav class="toc toc-pills" data-target="#spy-article-2" aria-label="Sections">
    <div class="toc-title">Sections</div>
    <a class="toc-link" href="#spy-article-2-s0">Origins</a>
    <a class="toc-link" href="#spy-article-2-s1">The rewrite</a>
    <a class="toc-link" href="#spy-article-2-s2">Growth</a>
    <a class="toc-link" href="#spy-article-2-s3">Lisbon</a>
    <a class="toc-link" href="#spy-article-2-s4">The bar</a>
  </nav>
</div>`,
        css: `.demo-spy { display: grid; grid-template-columns: minmax(0, 1fr) 11rem; gap: 1.5rem; align-items: start; max-width: 48rem; margin: 0 auto; }`
      }
    ],
    api: [
      { name: '.toc', type: 'class', desc: 'List of <code>a.toc-link[href="#id"]</code>. Also works on any element with <code>data-scrollspy</code>.' },
      { name: '.toc-title / .toc-sub / .toc-progress', type: 'class', desc: 'Heading, nested level, reading progress bar (<code>&lt;div class="toc-progress"&gt;&lt;span&gt;&lt;/span&gt;&lt;/div&gt;</code>).' },
      { name: '.toc-pills', type: 'class', desc: 'Soft pill behind the active link instead of a rail.' },
      { name: 'data-target', type: 'attr', default: 'window', desc: 'Scroll container holding the sections.' },
      { name: 'data-offset', type: 'attr', default: '24', desc: 'Offset (px) for sticky headers.' },
      { name: 'aria-current="true"', type: 'attr', desc: 'Set on the active link (also <code>.active</code>); passed links get <code>data-passed</code>.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ id, link }</code> on the nav.' }
    ]
  });
})();

;
/* docs/registry/overlays-bottom-nav.js */
(function () {
  var I = window.__ovI;
  function item(icon, label, cur, badge) {
    return '<a class="bottom-nav-item" href="#"' + (cur ? ' aria-current="page"' : '') + '><span class="bottom-nav-icon">' + I[icon] + (badge != null ? '<span class="bottom-nav-badge">' + badge + '</span>' : '') + '</span><span class="bottom-nav-label">' + label + '</span></a>';
  }
  function phone(inner, cls) { return '<div class="demo-bn-phone ' + (cls || '') + '"><div class="demo-bn-screen"><div class="demo-bn-bar"></div><div class="demo-bn-card"></div><div class="demo-bn-card short"></div><div class="demo-bn-card"></div></div>' + inner + '</div>'; }
  var css = `.demo-bn-phone { position: relative; display: flex; flex-direction: column; width: 18.5rem; max-width: calc(100vw - 3rem); height: 25rem; border-radius: 2rem; overflow: hidden; border: 1px solid var(--border); background: var(--bg); box-shadow: var(--shadow-lg); }
.demo-bn-screen { flex: 1; display: flex; flex-direction: column; gap: .75rem; padding: 1.25rem 1rem; }
.demo-bn-bar { height: 1.75rem; width: 60%; border-radius: 99px; background: var(--muted); }
.demo-bn-card { height: 5.5rem; border-radius: 1rem; background: var(--muted); opacity: .7; } .demo-bn-card.short { height: 3.5rem; }
.demo-bn-grad { background: linear-gradient(170deg, color-mix(in oklab, var(--primary) 18%, var(--bg)), var(--bg) 55%); }
.demo-bn-grad .demo-bn-card { background: var(--card); opacity: 1; border: 1px solid var(--border); }`;
  RanjDocs.add({
    id: 'bottom-nav',
    name: 'Bottom Navigation',
    group: 'Navigation',
    description: 'A mobile tab bar with an animated active pill that glides between destinations. Material-style by default, an expanding label variant, and a floating glass bar.',
    tags: ['js', 'new'],
    keywords: ['tab bar', 'mobile navigation', 'bottom bar', 'app bar', 'dock'],
    demos: [
      {
        title: 'Variants',
        html: `
${phone('<nav class="bottom-nav">' + item('home', 'Home', true) + item('compass', 'Explore') + item('bell', 'Activity', false, 3) + item('user', 'Profile') + '</nav>')}
${phone('<nav class="bottom-nav bottom-nav-expand">' + item('home', 'Home') + item('search', 'Search', true) + item('heart', 'Saved', false, '') + item('user', 'Account') + '</nav>')}
${phone('<nav class="bottom-nav bottom-nav-float">' + item('home', 'Home', true) + item('calendar', 'Plans') + item('message', 'Chat', false, 2) + item('settings', 'Settings') + '</nav>', 'demo-bn-grad')}`,
        css: css
      }
    ],
    api: [
      { name: '.bottom-nav', type: 'class', desc: 'Bar. <code>.bottom-nav-fixed</code> pins it to the viewport bottom (with safe-area padding).' },
      { name: '.bottom-nav-item', type: 'class', desc: 'Destination: <code>.bottom-nav-icon</code> (svg + optional <code>.bottom-nav-badge</code>, empty = dot) and <code>.bottom-nav-label</code>. <code>aria-current="page"</code> marks the active one.' },
      { name: '.bottom-nav-expand', type: 'class', desc: 'Active item grows to reveal its label inside the pill.' },
      { name: '.bottom-nav-float', type: 'class', desc: 'Floating, frosted, rounded bar.' },
      { name: 'data-static', type: 'attr', desc: "Don't change selection on click (for router-driven apps)." },
      { name: 'Ranj.bottomNav.select(el, index)', type: 'js', desc: 'Select programmatically.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ item, index, value }</code>.' }
    ]
  });

  RanjDocs.add({
    id: 'side-rail',
    name: 'Side Rail',
    group: 'Navigation',
    description: 'A slim vertical icon rail that expands over the page on hover or focus to reveal labels, with a springy indicator that slides to the active item. Its layout footprint never changes, so content does not jump.',
    tags: ['js', 'new'],
    keywords: ['navigation rail', 'icon sidebar', 'mini sidebar', 'expand on hover'],
    demos: [
      {
        title: 'Expand on hover',
        pad: false, center: false, height: 440,
        html: `
<div class="demo-rail">
  <nav class="side-rail" aria-label="Main">
    <div class="side-rail-brand"><span class="side-rail-logo">${I.zap}</span><span>Voltage</span></div>
    <a class="side-rail-item" href="#" aria-current="page">${I.home}<span class="side-rail-label">Home</span></a>
    <a class="side-rail-item" href="#">${I.inbox}<span class="side-rail-label">Inbox</span><span class="side-rail-badge">8</span></a>
    <a class="side-rail-item" href="#">${I.chart}<span class="side-rail-label">Reports</span></a>
    <a class="side-rail-item" href="#">${I.calendar}<span class="side-rail-label">Schedule</span></a>
    <a class="side-rail-item" href="#">${I.users}<span class="side-rail-label">Customers</span></a>
    <div class="side-rail-spacer"></div>
    <div class="side-rail-sep"></div>
    <a class="side-rail-item" href="#">${I.settings}<span class="side-rail-label">Settings</span></a>
  </nav>
  <main class="demo-rail-main"><h4>Good morning, Dana</h4><p>Hover the rail to expand it. It floats over this content instead of pushing it.</p><div class="demo-rail-grid"><div></div><div></div><div></div><div></div></div></main>
</div>`,
        css: `.demo-rail { display: flex; height: 440px; background: var(--bg); }
.demo-rail-main { flex: 1; min-width: 0; padding: 1.5rem; } .demo-rail-main h4 { font-size: 1.15rem; font-weight: 700; letter-spacing: -.02em; } .demo-rail-main p { color: var(--muted-fg); font-size: .875rem; margin: .25rem 0 1rem; }
.demo-rail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr)); gap: .75rem; } .demo-rail-grid div { height: 6rem; border-radius: var(--radius-lg); background: var(--muted); }`
      }
    ],
    api: [
      { name: '.side-rail', type: 'class', desc: 'Rail. Children: <code>.side-rail-brand</code>, <code>.side-rail-item</code> (svg + <code>.side-rail-label</code> + optional <code>.side-rail-badge</code>), <code>.side-rail-spacer</code>, <code>.side-rail-sep</code>.' },
      { name: 'data-expanded / data-pinned', type: 'attr', desc: 'Keep expanded; pinned also pushes content instead of overlaying it.' },
      { name: '--rail-w / --rail-open', type: 'var', default: '4.25rem / 14rem', desc: 'Collapsed and expanded widths.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ item, index, value }</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-collapsible.js */
(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'collapsible',
    name: 'Collapsible',
    group: 'Navigation',
    description: 'A single region that expands and collapses with a smooth height animation. Use it for "show more", advanced options or grouped lists.',
    tags: ['js'],
    keywords: ['disclosure', 'expand', 'show more', 'toggle', 'details'],
    demos: [
      {
        title: 'Starred repositories',
        html: `
<div class="collapsible demo-col" style="width: min(22rem, calc(100vw - 4rem))">
  <div class="demo-col-head">
    <span><b>@peduarte</b> starred 3 repositories</span>
    <button class="btn btn-ghost btn-sm collapsible-trigger" aria-label="Toggle">${I.svg('chevronsUpDown', 16)}</button>
  </div>
  <div class="demo-col-row">@radix-ui/primitives</div>
  <div class="collapsible-content">
    <div class="demo-col-list"><div class="demo-col-row">@radix-ui/colors</div><div class="demo-col-row">@stitches/react</div></div>
  </div>
</div>`,
        css: `.demo-col-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; font-size: .875rem; margin-bottom: .5rem; }
.demo-col-head b { font-weight: 600; } .demo-col-head .btn { width: 2rem; padding: 0; }
.demo-col-row { padding: .6rem 1rem; border: 1px solid var(--border); border-radius: var(--radius); font-family: var(--font-mono); font-size: .8125rem; background: var(--card); }
.demo-col-list { display: grid; gap: .5rem; padding-top: .5rem; }`
      },
      {
        title: 'Show more',
        description: '<code>.collapsible-peek</code> keeps a faded preview visible while collapsed (<code>--peek</code>).',
        html: `
<div class="collapsible collapsible-peek demo-col-article" style="--peek: 5.5rem; width: min(30rem, calc(100vw - 4rem))">
  <div class="collapsible-content">
    <div>
      <p>Northwind started as a weekend project to replace the spreadsheet our design team used to track feedback. Within a month, three other teams had asked for access.</p>
      <p>Today it powers reviews for over 4,000 companies. We still run it the same way: small team, weekly releases, and every feature dog-fooded for two weeks before it ships.</p>
      <p>We're hiring engineers who care about details. If that's you, say hello.</p>
    </div>
  </div>
  <button class="btn btn-link collapsible-trigger"><span class="demo-col-more">Read more</span><span class="demo-col-less">Show less</span> ${I.svg('chevronDown', 14, 'class="collapsible-chevron"')}</button>
</div>`,
        css: `.demo-col-article p { font-size: .9063rem; line-height: 1.7; color: var(--muted-fg); margin-bottom: .75rem; }
.demo-col-article .btn-link { display: inline-flex; align-items: center; gap: .25rem; margin-top: .25rem; font-size: .875rem; font-weight: 600; }
.demo-col-less { display: none; } .collapsible[data-state="open"] .demo-col-more { display: none; } .collapsible[data-state="open"] .demo-col-less { display: inline; }`
      },
      {
        title: 'Advanced options',
        html: `
<div class="collapsible demo-col-form" style="width: min(24rem, calc(100vw - 4rem))">
  <label class="label">Repository name</label>
  <input class="input" value="northwind-web">
  <button class="demo-col-adv collapsible-trigger">${I.sliders} Advanced options ${I.svg('chevronDown', 14, 'class="collapsible-chevron"')}</button>
  <div class="collapsible-content">
    <div class="demo-col-fields">
      <label class="label">Default branch</label><input class="input" value="main">
      <label class="label">Build command</label><input class="input" value="npm run build" style="font-family:var(--font-mono);font-size:.8125rem">
    </div>
  </div>
</div>`,
        css: `.demo-col-form { display: grid; gap: .4rem; } .demo-col-form .label { margin: 0; font-size: .8125rem; }
.demo-col-adv { display: inline-flex; align-items: center; gap: .4rem; justify-self: start; margin-top: .5rem; padding: .25rem 0; font-size: .8125rem; font-weight: 500; color: var(--muted-fg); }
.demo-col-adv:hover { color: var(--fg); } .demo-col-adv svg { width: .9rem; height: .9rem; }
.demo-col-fields { display: grid; gap: .4rem; padding-top: .5rem; }`
      }
    ],
    api: [
      { name: '.collapsible', type: 'class', desc: 'Root; holds a <code>.collapsible-trigger</code> and a <code>.collapsible-content</code> (content gets a single inner wrapper automatically).' },
      { name: 'data-state="open"', type: 'attr', desc: 'Open initially.' },
      { name: '.collapsible-peek', type: 'class', desc: 'Show a faded preview while collapsed. Height via <code>--peek</code> (5rem).' },
      { name: '.collapsible-chevron', type: 'class', desc: 'Any icon that should rotate when open.' },
      { name: 'Ranj.collapsible.toggle(el, open?)', type: 'js', desc: 'Programmatic toggle.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ open }</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-command.js */
(function () {
  var I = window.__ovI;
  function item(icon, label, extra, attrs) {
    return '<div class="command-item"' + (attrs || '') + '>' + I[icon] + label + (extra || '') + '</div>';
  }
  function kbd() { return '<span class="command-shortcut">' + Array.prototype.map.call(arguments, function (k) { return '<kbd>' + k + '</kbd>'; }).join('') + '</span>'; }
  var searchIcon = I.search;
  var palette = `
  <div class="command-input-wrapper">${searchIcon}<input class="command-input" placeholder="Type a command or search…"><span class="command-esc" data-command-close>esc</span></div>
  <div class="command-list">
    <div class="command-empty">No results found. Try “invoice” or “theme”.</div>
    <div class="command-group">
      <div class="command-group-label">Suggestions</div>
      ${item('calendar', 'Calendar', '', ' data-keywords="schedule events dates"')}
      ${item('sparkles', 'Search with AI', '<span class="command-meta">New</span>', ' data-keywords="ask assistant gpt"')}
      ${item('rocket', 'Deploy to production', kbd('⌘', '⇧', 'D'), ' data-keywords="ship release"')}
    </div>
    <div class="command-separator"></div>
    <div class="command-group">
      <div class="command-group-label">Projects</div>
      ${item('folder', 'Atlas redesign', '<span class="command-meta">12 files</span>')}
      ${item('folder', 'Billing migration', '<span class="command-meta">48 files</span>', ' data-keywords="stripe invoices"')}
      ${item('folder', 'Mobile onboarding', '<span class="command-meta">7 files</span>')}
    </div>
    <div class="command-separator"></div>
    <div class="command-group">
      <div class="command-group-label">Settings</div>
      ${item('user', 'Profile', kbd('⌘', 'P'))}
      ${item('card', 'Billing & invoices', kbd('⌘', 'B'), ' data-keywords="payment plan subscription"')}
      ${item('moon', 'Toggle dark theme', kbd('⌘', '⇧', 'L'), ' data-value="theme" data-keywords="appearance light mode"')}
      ${item('keyboard', 'Keyboard shortcuts', kbd('?'))}
      ${item('logout', 'Sign out', '', ' aria-disabled="true"')}
    </div>
  </div>`;

  RanjDocs.add({
    id: 'command',
    name: 'Command Palette',
    group: 'Overlays',
    description: 'A fast, keyboard-first launcher. Fuzzy matching with highlighted characters, ranked results, groups, recent items and an opt-in global shortcut. Use it inline or as a modal.',
    tags: ['js'],
    keywords: ['cmdk', 'command k', 'spotlight', 'launcher', 'search', 'quick open', 'kbar'],
    demos: [
      {
        title: 'Inline',
        description: 'Type “bill”, “dpl” or “thm”: matches are fuzzy, ranked, and highlighted.',
        html: `<div class="command demo-cmd-inline">${palette}
  <div class="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> select</span><span class="command-footer-end">${I.svg('command', 13)} Northwind</span></div>
</div>`,
        css: `.demo-cmd-inline { width: min(34rem, calc(100vw - 4rem)); }`,
        js: `root.addEventListener('ranj:select', function (e) {
  if (e.detail.value === 'theme') Ranj.theme.toggle();
  else Ranj.toast && Ranj.toast(e.detail.value, { description: 'Selected from the command palette' });
});`
      },
      {
        title: 'Modal with ⌘J and recents',
        description: '<code>data-hotkey="j"</code> on the overlay opens it with ⌘J / Ctrl+J from anywhere. <code>data-recent</code> remembers your last picks.',
        html: `
<button class="btn btn-outline demo-cmd-trigger" id="command-open">${searchIcon}<span>Search Northwind…</span><kbd>⌘J</kbd></button>

<div class="command-overlay" id="command-demo" data-hotkey="j" data-recent="docs-demo">
  <div class="command-dialog">${palette}
    <div class="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>
  </div>
</div>`,
        js: `root.querySelector('#command-open').onclick = function () { Ranj.command.open('command-demo'); };
root.querySelector('#command-demo').addEventListener('ranj:select', function (e) {
  if (e.detail.value === 'theme') Ranj.theme.toggle();
  else Ranj.toast && Ranj.toast.success(e.detail.value);
});`,
        css: `.demo-cmd-trigger { width: min(20rem, calc(100vw - 4rem)); justify-content: flex-start; color: var(--muted-fg); font-weight: 400; }
.demo-cmd-trigger svg { width: 1rem; height: 1rem; } .demo-cmd-trigger span { flex: 1; text-align: left; }
.demo-cmd-trigger kbd { font-family: var(--font-sans); font-size: .6875rem; padding: .1rem .4rem; border: 1px solid var(--border); border-radius: 5px; background: var(--bg-subtle); }`
      }
    ],
    api: [
      { name: '.command', type: 'class', desc: 'Inline palette. In a modal use <code>.command-overlay#id > .command-dialog</code>.' },
      { name: '.command-input-wrapper > .command-input', type: 'class', desc: 'Search field (becomes a combobox).' },
      { name: '.command-list', type: 'class', desc: 'Holds <code>.command-group</code>s (with <code>.command-group-label</code>), <code>.command-separator</code> and <code>.command-empty</code>.' },
      { name: '.command-item', type: 'class', desc: 'An option. Adornments: <code>.command-shortcut</code> (with kbd), <code>.command-meta</code>, <code>.command-item-icon</code>.' },
      { name: 'data-value / data-keywords', type: 'attr', desc: 'On items: value reported on select, extra search terms.' },
      { name: 'data-href', type: 'attr', desc: 'On items: navigate on select.' },
      { name: 'data-keep-open', type: 'attr', desc: 'On items: keep the modal open after select.' },
      { name: 'data-hotkey="k"', type: 'attr', desc: 'On the overlay: ⌘/Ctrl + key toggles it (opt-in).' },
      { name: 'data-recent="key"', type: 'attr', desc: 'Remember the last 4 picks in localStorage and show them first.' },
      { name: '--command-w', type: 'var', default: '40rem', desc: 'Max width.' },
      { name: 'Ranj.command.open(id) / close(id) / toggle(id)', type: 'js', desc: 'Control the modal. <code>Ranj.command.refresh(el)</code> after changing items.' },
      { name: 'ranj:select', type: 'event', desc: 'From the item: <code>{ value, item, query }</code>. Cancelable.' },
      { name: 'ranj:filter', type: 'event', desc: 'On the palette: <code>{ query, count }</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-context-menu.js */
(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'context-menu',
    name: 'Context Menu',
    group: 'Overlays',
    description: 'A menu that opens at the pointer on right-click, on long-press for touch, or with Shift+F10 / the Menu key. Shares the dropdown engine: submenus, checkbox and radio items, type-ahead and flipping at screen edges.',
    tags: ['js'],
    keywords: ['right click', 'long press', 'menu', 'contextmenu'],
    demos: [
      {
        title: 'Browser-style',
        html: `
<div class="context-area" data-context-menu="context-menu-a" tabindex="0">
  <span>${I.svg('command', 22)}</span>
  <b style="color:var(--fg);font-weight:600">Right-click here</b>
  <span>or long-press on touch · Shift+F10 when focused</span>
</div>
<div class="context-menu" id="context-menu-a">
  <button class="context-menu-item">${I.chevronLeft} Back <span class="shortcut">⌘[</span></button>
  <button class="context-menu-item" disabled>${I.chevronRight} Forward <span class="shortcut">⌘]</span></button>
  <button class="context-menu-item">${I.refresh} Reload <span class="shortcut">⌘R</span></button>
  <div class="context-menu-sub">
    <button class="context-menu-item">${I.layers} More tools</button>
    <div class="context-menu">
      <button class="context-menu-item">${I.download} Save page as… <span class="shortcut">⇧⌘S</span></button>
      <button class="context-menu-item">${I.link} Create shortcut…</button>
      <button class="context-menu-item">${I.pencil} Name window…</button>
      <div class="context-menu-separator"></div>
      <button class="context-menu-item">${I.terminal} Developer tools <span class="shortcut">⌥⌘I</span></button>
    </div>
  </div>
  <div class="context-menu-separator"></div>
  <button class="context-menu-item" aria-checked="true">Show bookmarks bar <span class="shortcut">⇧⌘B</span></button>
  <button class="context-menu-item" aria-checked="false">Show full URLs</button>
  <div class="context-menu-separator"></div>
  <div class="context-menu-label">People</div>
  <div class="menu-radio-group">
    <button class="context-menu-item" aria-checked="true">Pedro Duarte</button>
    <button class="context-menu-item" aria-checked="false">Colm Tuite</button>
  </div>
</div>`
      },
      {
        title: 'File grid',
        description: 'One menu shared by many items. <code>ranj:open</code> tells you which element was right-clicked.',
        html: `
<div class="demo-ctx-grid" data-context-menu="context-menu-files">
  ${[['Brand guidelines', 'fileText', 15], ['Product shots', 'image', 150], ['Pitch deck', 'chart', 260], ['Contracts', 'folder', 60], ['Podcast ep. 12', 'music', 320], ['Launch video', 'video', 200]].map(function (f) { return '<button class="demo-ctx-file" style="--h:' + f[2] + '">' + I[f[1]] + '<span>' + f[0] + '</span></button>'; }).join('')}
</div>
<div class="context-menu" id="context-menu-files">
  <div class="context-menu-label" id="context-menu-files-name">File</div>
  <button class="context-menu-item">${I.eye} Open</button>
  <button class="context-menu-item">${I.share} Share… <span class="shortcut">⌘S</span></button>
  <button class="context-menu-item">${I.star} Add to starred</button>
  <button class="context-menu-item">${I.copy} Duplicate <span class="shortcut">⌘D</span></button>
  <div class="context-menu-separator"></div>
  <button class="context-menu-item dropdown-item-destructive">${I.trash} Move to trash <span class="shortcut">⌫</span></button>
</div>`,
        js: `var label = root.querySelector('#context-menu-files-name'), files = root.querySelectorAll('.demo-ctx-file');
root.querySelector('#context-menu-files').addEventListener('ranj:open', function (e) {
  var f = e.detail.target.closest('.demo-ctx-file');
  files.forEach(function (x) { x.classList.toggle('is-ctx', x === f); });
  label.textContent = f ? f.textContent.trim() : 'Folder';
});
root.querySelector('#context-menu-files').addEventListener('ranj:close', function () { files.forEach(function (x) { x.classList.remove('is-ctx'); }); });`,
        css: `.demo-ctx-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 7rem)); gap: .5rem; padding: .75rem; border-radius: var(--radius-xl); border: 1px solid var(--border); background: var(--card); }
.demo-ctx-file { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: .875rem .25rem .625rem; border-radius: var(--radius-lg); font-size: .75rem; color: var(--fg); text-align: center; border: 1px solid transparent; }
.demo-ctx-file:hover { background: var(--muted); }
.demo-ctx-file.is-ctx { background: var(--primary-soft); border-color: color-mix(in oklab, var(--primary) 40%, transparent); }
.demo-ctx-file svg { width: 2.4rem; height: 2.4rem; padding: .55rem; border-radius: var(--radius); color: oklch(.5 .17 var(--h)); background: oklch(.94 .04 var(--h)); }
[data-theme="dark"] .demo-ctx-file svg { color: oklch(.8 .12 var(--h)); background: oklch(.3 .06 var(--h)); }
.demo-ctx-file span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`
      }
    ],
    api: [
      { name: 'data-context-menu="menuId"', type: 'attr', desc: 'On the area. Leave empty to use the first <code>.context-menu</code> inside it.' },
      { name: '.context-menu', type: 'class', desc: 'The menu. Items: <code>.context-menu-item</code> (or <code>.dropdown-item</code>), <code>.context-menu-separator</code>, <code>.context-menu-label</code>, <code>.shortcut</code>.' },
      { name: '.context-menu-sub', type: 'class', desc: 'Item + nested <code>.context-menu</code> → submenu.' },
      { name: 'aria-checked / .menu-radio-group', type: 'attr', desc: 'Checkbox and radio items.' },
      { name: '.context-area', type: 'class', desc: 'Optional dashed drop-zone style for the trigger area.' },
      { name: 'Ranj.contextMenu.open(area, x, y) / close()', type: 'js', desc: 'Programmatic control.' },
      { name: 'ranj:open', type: 'event', desc: 'On the menu: <code>{ x, y, target }</code> where target is the element that was right-clicked.' },
      { name: 'ranj:select / ranj:close', type: 'event', desc: 'Same as the dropdown menu.' }
    ]
  });
})();

;
/* docs/registry/overlays-dialog.js */
(function () {
  var I = window.__ovI;
  var close = '<button class="dialog-close" data-dialog-close aria-label="Close">' + I.x + '</button>';
  var tos = '';
  ['Acceptance of terms', 'Your account', 'Workspace content', 'Acceptable use', 'Billing & renewals', 'Data processing', 'Termination', 'Changes to these terms'].forEach(function (h, i) {
    tos += '<h4>' + (i + 1) + '. ' + h + '</h4><p>By accessing Northwind you agree to be bound by these terms. You are responsible for safeguarding the credentials used to access the service and for any activity under your account. We may update features over time, and will notify workspace owners at least 30 days before any change that materially reduces functionality.</p>';
  });

  RanjDocs.add({
    id: 'dialog',
    name: 'Dialog',
    group: 'Overlays',
    description: 'A modal window that traps focus, locks page scroll and closes with Escape, the backdrop or a close button. Returns focus to the trigger, supports nesting, sizes and scrollable bodies, and animates both in and out.',
    tags: ['js'],
    keywords: ['modal', 'popup', 'lightbox', 'window', 'overlay'],
    demos: [
      {
        title: 'Edit profile',
        html: `
<button class="btn btn-outline" data-dialog-open="dialog-profile">${I.pencil} Edit profile</button>

<div class="dialog-overlay" id="dialog-profile">
  <div class="dialog">
    <div class="dialog-header">
      <h2 class="dialog-title">Edit profile</h2>
      <p class="dialog-description">Make changes to your profile here. Click save when you're done.</p>
    </div>
    <div class="dialog-body">
      <form class="demo-dialog-form" id="dialog-profile-form">
        <label class="label" for="dialog-name">Name</label>
        <input class="input" id="dialog-name" value="Maya Okafor" autofocus>
        <label class="label" for="dialog-user">Username</label>
        <input class="input" id="dialog-user" value="@mayaokafor">
      </form>
    </div>
    <div class="dialog-footer">
      <button class="btn btn-outline" data-dialog-close>Cancel</button>
      <button class="btn" form="dialog-profile-form" type="submit">Save changes</button>
    </div>
    ${close}
  </div>
</div>`,
        js: `root.querySelector('#dialog-profile-form').addEventListener('submit', function (e) {
  e.preventDefault();
  Ranj.dialog.close('dialog-profile');
  Ranj.toast && Ranj.toast.success('Profile updated', { description: 'Your changes are live.' });
});`,
        css: `.demo-dialog-form { display: grid; grid-template-columns: 6rem 1fr; align-items: center; gap: .875rem 1rem; }
.demo-dialog-form .label { justify-self: end; margin: 0; }
@media (max-width: 480px) { .demo-dialog-form { grid-template-columns: 1fr; gap: .4rem; } .demo-dialog-form .label { justify-self: start; } .demo-dialog-form .input + .label { margin-top: .5rem; } }`
      },
      {
        title: 'Sizes',
        description: '<code>.dialog-sm</code>, default, <code>.dialog-lg</code>, <code>.dialog-xl</code> and <code>.dialog-full</code>. Override <code>--dialog-w</code> for anything else.',
        html: `
<button class="btn btn-outline" data-dialog-open="dialog-sm">Small</button>
<button class="btn btn-outline" data-dialog-open="dialog-md">Default</button>
<button class="btn btn-outline" data-dialog-open="dialog-lg">Large</button>
<button class="btn btn-outline" data-dialog-open="dialog-xl">Extra large</button>
<button class="btn btn-outline" data-dialog-open="dialog-full">Fullscreen</button>

<div class="dialog-overlay" id="dialog-sm"><div class="dialog dialog-sm">
  <div class="dialog-header"><h2 class="dialog-title">Rename file</h2><p class="dialog-description">24rem: quick, single-field tasks.</p></div>
  <div class="dialog-body"><input class="input" value="Q3 board update.pdf" style="width:100%"></div>
  <div class="dialog-footer"><button class="btn btn-outline" data-dialog-close>Cancel</button><button class="btn" data-dialog-close>Rename</button></div>${close}
</div></div>
<div class="dialog-overlay" id="dialog-md"><div class="dialog">
  <div class="dialog-header"><h2 class="dialog-title">Share “Launch plan”</h2><p class="dialog-description">32rem: the default for most forms and confirmations.</p></div>
  <div class="dialog-body"><div class="demo-dialog-share"><input class="input" value="https://northwind.app/d/launch-plan" readonly><button class="btn btn-secondary">${I.copy} Copy</button></div></div>
  <div class="dialog-footer"><button class="btn" data-dialog-close>Done</button></div>${close}
</div></div>
<div class="dialog-overlay" id="dialog-lg"><div class="dialog dialog-lg">
  <div class="dialog-header"><h2 class="dialog-title">Import contacts</h2><p class="dialog-description">42rem: room for previews and two-column layouts.</p></div>
  <div class="dialog-body"><div class="demo-dialog-drop">${I.upload}<b>Drop a CSV here</b><span>or click to browse · up to 10,000 rows</span></div></div>
  <div class="dialog-footer"><button class="btn btn-outline" data-dialog-close>Cancel</button><button class="btn" data-dialog-close>Continue</button></div>${close}
</div></div>
<div class="dialog-overlay" id="dialog-xl"><div class="dialog dialog-xl">
  <div class="dialog-header"><h2 class="dialog-title">Choose a template</h2><p class="dialog-description">56rem: galleries and pickers.</p></div>
  <div class="dialog-body"><div class="demo-dialog-grid">${['Roadmap', 'Sprint board', 'OKRs', 'Meeting notes', 'Bug tracker', 'Content calendar', 'CRM', 'Hiring pipeline'].map(function (t, i) { return '<button class="demo-dialog-tpl" style="--h:' + (i * 45) + '"><i></i>' + t + '</button>'; }).join('')}</div></div>
  <div class="dialog-footer"><button class="btn btn-outline" data-dialog-close>Cancel</button><button class="btn" data-dialog-close>Use template</button></div>${close}
</div></div>
<div class="dialog-overlay" id="dialog-full"><div class="dialog dialog-full">
  <div class="dialog-header"><h2 class="dialog-title">Focus mode</h2><p class="dialog-description">Fills the viewport minus a 1rem gutter.</p></div>
  <div class="dialog-body"><div class="demo-dialog-drop" style="height:100%;min-height:12rem">${I.fileText}<b>Untitled draft</b><span>Start writing…</span></div></div>
  <div class="dialog-footer"><button class="btn" data-dialog-close>Exit focus mode</button></div>${close}
</div></div>`,
        css: `.demo-dialog-share { display: flex; gap: .5rem; } .demo-dialog-share .input { flex: 1; min-width: 0; }
.demo-dialog-drop { display: grid; place-items: center; gap: .3rem; padding: 2.5rem 1rem; border: 1.5px dashed var(--border-strong); border-radius: var(--radius-lg); color: var(--muted-fg); text-align: center; font-size: .875rem; }
.demo-dialog-drop svg { width: 1.75rem; height: 1.75rem; color: var(--primary); } .demo-dialog-drop b { color: var(--fg); font-weight: 600; }
.demo-dialog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); gap: .75rem; }
.demo-dialog-tpl { display: flex; flex-direction: column; gap: .5rem; padding: .5rem .5rem .75rem; border: 1px solid var(--border); border-radius: var(--radius-lg); font-size: .8125rem; font-weight: 500; text-align: left; transition: border-color var(--transition), transform var(--transition); }
.demo-dialog-tpl:hover { border-color: var(--primary); transform: translateY(-2px); }
.demo-dialog-tpl i { height: 4.5rem; border-radius: var(--radius); background: linear-gradient(135deg, oklch(.8 .1 var(--h)), oklch(.65 .15 calc(var(--h) + 50))); }`
      },
      {
        title: 'Scrollable body',
        description: 'Add <code>.dialog-scroll</code> to pin the header and footer with hairlines while the body scrolls.',
        html: `
<button class="btn btn-outline" data-dialog-open="dialog-terms">${I.fileText} Review terms</button>

<div class="dialog-overlay" id="dialog-terms">
  <div class="dialog dialog-scroll dialog-lg">
    <div class="dialog-header">
      <h2 class="dialog-title">Terms of service</h2>
      <p class="dialog-description">Last updated November 2, 2026 · 6 min read</p>
    </div>
    <div class="dialog-body demo-dialog-prose">${tos}</div>
    <div class="dialog-footer">
      <label class="demo-dialog-check"><input type="checkbox" id="dialog-terms-ok"> I have read and agree</label>
      <button class="btn btn-outline" data-dialog-close>Decline</button>
      <button class="btn" data-dialog-close id="dialog-terms-accept" disabled>Accept</button>
    </div>
    ${close}
  </div>
</div>`,
        js: `var ok = root.querySelector('#dialog-terms-ok'), b = root.querySelector('#dialog-terms-accept');
ok.addEventListener('change', function () { b.disabled = !ok.checked; });`,
        css: `.demo-dialog-prose h4 { font-size: .875rem; font-weight: 600; margin: 1.1rem 0 .3rem; } .demo-dialog-prose h4:first-child { margin-top: 0; }
.demo-dialog-prose p { color: var(--muted-fg); font-size: .875rem; line-height: 1.65; }
.demo-dialog-check { display: inline-flex; align-items: center; gap: .5rem; margin-right: auto; font-size: .8125rem; color: var(--muted-fg); }
.demo-dialog-check input { accent-color: var(--primary); width: 1rem; height: 1rem; }`
      },
      {
        title: 'Nested dialogs',
        description: 'Open a dialog from inside a dialog. The one underneath recedes; Escape closes only the topmost.',
        html: `
<button class="btn" data-dialog-open="dialog-invite">${I.userPlus} Invite teammates</button>

<div class="dialog-overlay" id="dialog-invite">
  <div class="dialog">
    <div class="dialog-header">
      <h2 class="dialog-title">Invite to Acme Design</h2>
      <p class="dialog-description">Teammates get access to every project in this workspace.</p>
    </div>
    <div class="dialog-body">
      <div class="demo-dialog-invites">
        <div><span class="demo-ov-avatar" style="--h:20;width:32px;height:32px;font-size:12px">JL</span><span><b>Jonas Lind</b><small>jonas@acme.co</small></span><em>Editor</em></div>
        <div><span class="demo-ov-avatar" style="--h:160;width:32px;height:32px;font-size:12px">PR</span><span><b>Priya Raman</b><small>priya@acme.co</small></span><em>Viewer</em></div>
        <div><span class="demo-ov-avatar" style="--h:290;width:32px;height:32px;font-size:12px">DK</span><span><b>Diego Kim</b><small>diego@acme.co</small></span><em>Admin</em></div>
      </div>
    </div>
    <div class="dialog-footer">
      <button class="btn btn-ghost dialog-footer-start" data-dialog-open="dialog-invite-discard">Discard</button>
      <button class="btn btn-outline" data-dialog-close>Back</button>
      <button class="btn" data-dialog-close>Send 3 invites</button>
    </div>
    ${close}
  </div>
</div>

<div class="dialog-overlay" id="dialog-invite-discard">
  <div class="dialog dialog-sm alert-dialog">
    <div class="dialog-header">
      <div class="dialog-icon" style="background:var(--destructive-soft);color:var(--destructive-soft-fg)">${I.trash}</div>
      <h2 class="dialog-title">Discard 3 invites?</h2>
      <p class="dialog-description">The people you added won't be notified.</p>
    </div>
    <div class="dialog-footer">
      <button class="btn btn-outline" data-dialog-close>Keep editing</button>
      <button class="btn btn-destructive" id="dialog-discard-yes">Discard</button>
    </div>
  </div>
</div>`,
        js: `root.querySelector('#dialog-discard-yes').onclick = function () {
  Ranj.dialog.close('dialog-invite-discard');
  Ranj.dialog.close('dialog-invite');
};`,
        css: `.demo-dialog-invites { display: grid; gap: .25rem; }
.demo-dialog-invites > div { display: flex; align-items: center; gap: .75rem; padding: .5rem; border-radius: var(--radius); }
.demo-dialog-invites > div:hover { background: var(--muted); }
.demo-dialog-invites span:nth-child(2) { display: flex; flex-direction: column; line-height: 1.3; min-width: 0; flex: 1; }
.demo-dialog-invites b { font-size: .875rem; font-weight: 600; } .demo-dialog-invites small { color: var(--muted-fg); font-size: .75rem; }
.demo-dialog-invites em { font-style: normal; font-size: .75rem; color: var(--muted-fg); border: 1px solid var(--border); padding: .1rem .5rem; border-radius: 99px; }`
      },
      {
        title: 'Static backdrop & events',
        description: '<code>data-static</code> ignores backdrop clicks and Escape with a gentle bump instead. Listen for <code>ranj:open</code> / <code>ranj:close</code>, or call <code>Ranj.dialog.open(id)</code>.',
        html: `
<button class="btn" id="dialog-api-open">${I.rocket} Deploy to production</button>
<code class="demo-dialog-log" id="dialog-log">waiting…</code>

<div class="dialog-overlay dialog-overlay-blur" id="dialog-deploy" data-static>
  <div class="dialog dialog-sm">
    <div class="dialog-header">
      <div class="dialog-icon">${I.rocket}</div>
      <h2 class="dialog-title">Deploy northwind-web?</h2>
      <p class="dialog-description">Commit <code>a41f2c9</code> on <b>main</b> will be promoted to <b>northwind.app</b>. Click outside or press Esc: it won't close.</p>
    </div>
    <div class="dialog-footer">
      <button class="btn btn-outline" data-dialog-close data-value="cancel">Cancel</button>
      <button class="btn" data-dialog-close data-value="deploy">Deploy</button>
    </div>
  </div>
</div>`,
        js: `var log = root.querySelector('#dialog-log'), ov = root.querySelector('#dialog-deploy');
root.querySelector('#dialog-api-open').onclick = function () { Ranj.dialog.open('dialog-deploy'); };
ov.addEventListener('ranj:open', function () { log.textContent = 'ranj:open'; });
ov.addEventListener('ranj:close', function (e) { log.textContent = 'ranj:close · reason=' + e.detail.reason + (e.detail.value ? ' · value=' + e.detail.value : ''); });`,
        css: `.demo-dialog-log { font-family: var(--font-mono); font-size: .75rem; color: var(--muted-fg); background: var(--muted); padding: .35rem .6rem; border-radius: var(--radius-sm); }
#dialog-deploy .dialog-description code { font-family: var(--font-mono); font-size: .8em; background: var(--muted); padding: .1em .35em; border-radius: 4px; }`
      }
    ],
    api: [
      { name: '.dialog-overlay', type: 'class', desc: 'Full-screen layer + backdrop. Needs an <code>id</code>. Variants: <code>.dialog-overlay-blur</code>, <code>.dialog-overlay-clear</code>, <code>.dialog-overlay-top</code>.' },
      { name: '.dialog', type: 'class', desc: 'The panel. Parts: <code>.dialog-header .dialog-title .dialog-description .dialog-body .dialog-footer .dialog-close .dialog-icon</code>.' },
      { name: '.dialog-sm / -lg / -xl / -full', type: 'class', desc: 'Width presets (24 / 42 / 56rem / viewport).' },
      { name: '.dialog-scroll', type: 'class', desc: 'Pinned header & footer with dividers; body scrolls.' },
      { name: '--dialog-w', type: 'var', default: '32rem', desc: 'Max width of the panel.' },
      { name: 'data-dialog-open="id"', type: 'attr', desc: 'On any element: opens the dialog (focus returns here on close).' },
      { name: 'data-dialog-close', type: 'attr', desc: 'Inside a dialog: closes it. Optional <code>data-value</code> is passed in the close event.' },
      { name: 'data-static', type: 'attr', desc: 'On the overlay: backdrop click and Escape bump instead of closing.' },
      { name: 'autofocus', type: 'attr', desc: 'Element to focus on open (default: first focusable that is not the close button).' },
      { name: 'Ranj.dialog.open(id, { trigger, focus })', type: 'js', desc: 'Open by id or element. Also <code>close(id, { value })</code>, <code>toggle(id)</code>, <code>isOpen(id)</code>.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On the overlay. <code>close</code> detail: <code>{ reason: "escape"|"backdrop"|"button"|"api", value }</code>.' },
      { name: 'ranj:beforeclose', type: 'event', desc: 'Cancelable: call <code>preventDefault()</code> to keep it open (e.g. unsaved changes).' }
    ]
  });
})();

;
/* docs/registry/overlays-drawer.js */
(function () {
  var I = window.__ovI;
  var songs = [['Midnight City', 'M83', 4.03], ['Breathe Deeper', 'Tame Impala', 6.12], ['Nightcall', 'Kavinsky', 4.18], ['Instant Crush', 'Daft Punk', 5.37], ['Redbone', 'Childish Gambino', 5.27], ['Retrograde', 'James Blake', 3.43], ['Sunflower', 'Rex Orange County', 4.12], ['Holocene', 'Bon Iver', 5.36], ['Motion Sickness', 'Phoebe Bridgers', 3.49], ['Ivy', 'Frank Ocean', 4.09]];
  var list = songs.map(function (s, i) { return '<div class="demo-drawer-song"><i style="--h:' + (i * 37) + '"></i><span><b>' + s[0] + '</b><small>' + s[1] + '</small></span><em>' + s[2].toFixed(2).replace('.', ':') + '</em></div>'; }).join('');
  RanjDocs.add({
    id: 'drawer',
    name: 'Drawer',
    group: 'Overlays',
    description: 'A bottom sheet for phones and tablets. Drag the handle (or the panel) to dismiss with velocity, rubber-band past the top, and snap between heights. Mouse and touch both work.',
    tags: ['js', 'new'],
    keywords: ['bottom sheet', 'vaul', 'swipe', 'mobile sheet', 'snap points', 'action sheet'],
    demos: [
      {
        title: 'Goal setter',
        description: 'Fling it down, or drag past a third of its height to close.',
        html: `
<button class="btn btn-outline" data-drawer-open="drawer-goal">${I.target} Set daily goal</button>

<div class="dialog-overlay" id="drawer-goal">
  <div class="drawer" style="--drawer-w: 28rem">
    <div class="drawer-handle"></div>
    <div class="drawer-header">
      <h2 class="drawer-title">Move goal</h2>
      <p class="drawer-description">Set your daily activity goal.</p>
    </div>
    <div class="drawer-body">
      <div class="demo-drawer-goal">
        <button class="demo-drawer-step" data-d="-10" aria-label="Decrease">${I.minus}</button>
        <div><b id="drawer-goal-val">350</b><small>calories / day</small></div>
        <button class="demo-drawer-step" data-d="10" aria-label="Increase">${I.plus}</button>
      </div>
      <div class="demo-drawer-bars">${[52, 74, 40, 88, 63, 95, 70, 58, 80, 45, 66, 90].map(function (h) { return '<i style="height:' + h + '%"></i>'; }).join('')}</div>
    </div>
    <div class="drawer-footer">
      <button class="btn" data-dialog-close>Submit</button>
      <button class="btn btn-outline" data-dialog-close>Cancel</button>
    </div>
  </div>
</div>`,
        js: `var v = 350, out = root.querySelector('#drawer-goal-val');
root.querySelectorAll('.demo-drawer-step').forEach(function (b) {
  b.onclick = function () { v = Math.max(200, Math.min(600, v + +b.dataset.d)); out.textContent = v; };
});`,
        css: `.demo-drawer-goal { display: flex; align-items: center; justify-content: center; gap: 2rem; padding: .5rem 0 1rem; }
.demo-drawer-goal div { display: flex; flex-direction: column; align-items: center; min-width: 7rem; }
.demo-drawer-goal b { font-size: 3.5rem; font-weight: 700; letter-spacing: -.04em; line-height: 1; font-variant-numeric: tabular-nums; }
.demo-drawer-goal small { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted-fg); margin-top: .35rem; }
.demo-drawer-step { width: 2.25rem; height: 2.25rem; display: grid; place-items: center; border-radius: 99px; border: 1px solid var(--border); }
.demo-drawer-step:hover { background: var(--muted); } .demo-drawer-step svg { width: 1rem; height: 1rem; }
.demo-drawer-bars { display: flex; align-items: flex-end; gap: .4rem; height: 5.5rem; padding: 0 .25rem; }
.demo-drawer-bars i { flex: 1; border-radius: 4px 4px 2px 2px; background: color-mix(in oklab, var(--primary) 75%, transparent); }`
      },
      {
        title: 'Snap points',
        description: '<code>data-snap-points="0.45, 1"</code> opens at 45% and snaps to full height. The list scrolls once fully open; at the top it hands the gesture back to the drawer.',
        html: `
<button class="btn" data-drawer-open="drawer-queue">${I.music} Up next</button>

<div class="dialog-overlay" id="drawer-queue">
  <div class="drawer" data-snap-points="0.45, 1" data-snap="0" style="height: 82dvh">
    <div class="drawer-handle"></div>
    <div class="drawer-header" style="text-align:left">
      <h2 class="drawer-title">Up next</h2>
      <p class="drawer-description">Late Night Drive · 10 songs, 46 min</p>
    </div>
    <div class="drawer-body">${list}</div>
  </div>
</div>`,
        css: `.demo-drawer-song { display: flex; align-items: center; gap: .875rem; padding: .55rem 0; }
.demo-drawer-song i { width: 2.75rem; height: 2.75rem; border-radius: var(--radius-sm); flex-shrink: 0; background: linear-gradient(135deg, oklch(.72 .15 var(--h)), oklch(.45 .17 calc(var(--h) + 70))); }
.demo-drawer-song span { flex: 1; display: flex; flex-direction: column; font-size: .875rem; line-height: 1.3; min-width: 0; }
.demo-drawer-song b { font-weight: 600; } .demo-drawer-song small, .demo-drawer-song em { color: var(--muted-fg); font-size: .75rem; font-style: normal; font-variant-numeric: tabular-nums; }`
      },
      {
        title: 'Share sheet',
        html: `
<button class="btn btn-outline" data-drawer-open="drawer-share">${I.share} Share</button>

<div class="dialog-overlay" id="drawer-share">
  <div class="drawer" style="--drawer-w: 26rem">
    <div class="drawer-handle"></div>
    <div class="drawer-header"><h2 class="drawer-title">Share “Kyoto, spring 2026”</h2><p class="drawer-description">142 photos · 3.1 GB</p></div>
    <div class="drawer-body">
      <div class="demo-drawer-people">
        ${[['AM', 15, 'Ava'], ['KO', 140, 'Kenji'], ['LB', 300, 'Lena'], ['TR', 60, 'Tomás'], ['SN', 210, 'Sana']].map(function (p) { return '<button data-dialog-close><span class="demo-ov-avatar" style="--h:' + p[1] + ';width:52px;height:52px;font-size:18px">' + p[0] + '</span>' + p[2] + '</button>'; }).join('')}
      </div>
      <div class="demo-drawer-actions">
        <button data-dialog-close>${I.link} Copy link</button><button data-dialog-close>${I.mail} Email</button><button data-dialog-close>${I.message} Messages</button><button data-dialog-close>${I.download} Save</button>
      </div>
    </div>
    <div class="drawer-footer"><button class="btn btn-secondary" data-dialog-close>Cancel</button></div>
  </div>
</div>`,
        css: `.demo-drawer-people { display: flex; gap: .75rem; overflow-x: auto; padding: .25rem 0 1rem; scrollbar-width: none; }
.demo-drawer-people button { display: flex; flex-direction: column; align-items: center; gap: .4rem; font-size: .75rem; color: var(--muted-fg); min-width: 4rem; }
.demo-drawer-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: .5rem; }
.demo-drawer-actions button { display: flex; flex-direction: column; align-items: center; gap: .45rem; padding: .85rem .25rem; border-radius: var(--radius-lg); background: var(--muted); font-size: .75rem; font-weight: 500; transition: transform var(--dur-fast) var(--ease); }
.demo-drawer-actions button:active { transform: scale(.95); } .demo-drawer-actions svg { width: 1.25rem; height: 1.25rem; }`
      }
    ],
    api: [
      { name: '.drawer', type: 'class', desc: 'Bottom sheet inside a <code>.dialog-overlay</code>. <code>.drawer-right</code> / <code>.drawer-left</code> for side drawers that swipe sideways.' },
      { name: '.drawer-handle', type: 'class', desc: 'Grab bar. Dragging works anywhere except inputs, buttons and scrolled lists.' },
      { name: '.drawer-header / -body / -footer', type: 'class', desc: 'Parts, plus <code>.drawer-title</code> and <code>.drawer-description</code>. The body scrolls.' },
      { name: 'data-snap-points', type: 'attr', desc: 'Comma-separated visible fractions, e.g. <code>"0.4, 1"</code>.' },
      { name: 'data-snap', type: 'attr', default: 'last', desc: 'Index of the snap point to open at.' },
      { name: '--drawer-w', type: 'var', default: '42rem', desc: 'Max width (centered on wide screens).' },
      { name: 'data-drawer-open="id"', type: 'attr', desc: 'Alias of <code>data-dialog-open</code>.' },
      { name: 'Ranj.drawer.open(id) / close(id) / snap(el, i)', type: 'js', desc: 'Programmatic control.' },
      { name: 'ranj:snap', type: 'event', desc: 'On the drawer: <code>{ index, point }</code>. Close reason is <code>"swipe"</code> when flung away.' }
    ]
  });
})();

;
/* docs/registry/overlays-dropdown-menu.js */
(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'dropdown-menu',
    name: 'Dropdown Menu',
    group: 'Overlays',
    description: 'A menu of actions opened from a button. Full keyboard support (arrows, Home/End, type-to-jump, → ← for submenus), checkbox and radio items, shortcuts, labels, separators and destructive items. v1 markup (<code>.dropdown</code> + <code>data-dropdown-trigger</code>) keeps working.',
    tags: ['js'],
    keywords: ['menu', 'actions', 'more', 'kebab', 'select menu', 'options'],
    demos: [
      {
        title: 'Account menu',
        description: 'Try it with the keyboard: Tab to the button, press ↓, type “s” to jump to Settings, → to open Invite users.',
        html: `
<div class="dropdown">
  <button class="btn btn-outline" data-dropdown-trigger>${I.avatar('MO', 20, 22)} Maya Okafor ${I.svg('chevronDown', null, 'class="dropdown-chevron"')}</button>
  <div class="dropdown-menu" style="--menu-w: 15rem">
    <div class="dropdown-header">${I.avatar('MO', 20, 34)}<div class="dropdown-header-text"><b>Maya Okafor</b><span>maya@northwind.app</span></div></div>
    <div class="dropdown-separator"></div>
    <button class="dropdown-item">${I.user} Profile <span class="dropdown-shortcut">⇧⌘P</span></button>
    <button class="dropdown-item">${I.card} Billing <span class="dropdown-shortcut">⌘B</span></button>
    <button class="dropdown-item">${I.settings} Settings <span class="dropdown-shortcut">⌘,</span></button>
    <button class="dropdown-item">${I.keyboard} Keyboard shortcuts <span class="dropdown-shortcut">⌘K</span></button>
    <div class="dropdown-separator"></div>
    <button class="dropdown-item">${I.users} Team</button>
    <div class="dropdown-sub">
      <button class="dropdown-item">${I.userPlus} Invite users</button>
      <div class="dropdown-menu">
        <button class="dropdown-item">${I.mail} Email</button>
        <button class="dropdown-item">${I.message} Message</button>
        <div class="dropdown-separator"></div>
        <button class="dropdown-item">${I.link} Copy invite link</button>
      </div>
    </div>
    <button class="dropdown-item">${I.plus} New team <span class="dropdown-shortcut">⌘T</span></button>
    <div class="dropdown-separator"></div>
    <a class="dropdown-item" href="#">${I.github} GitHub</a>
    <button class="dropdown-item">${I.lifebuoy} Support</button>
    <button class="dropdown-item" disabled>${I.cloud} API <span class="dropdown-shortcut">Soon</span></button>
    <div class="dropdown-separator"></div>
    <button class="dropdown-item">${I.logout} Log out <span class="dropdown-shortcut">⇧⌘Q</span></button>
  </div>
</div>`
      },
      {
        title: 'Checkbox & radio items',
        description: 'Checkable items stay open so you can toggle several. Listen for <code>ranj:select</code>.',
        html: `
<div class="dropdown">
  <button class="btn btn-outline" data-dropdown-trigger>${I.eye} View</button>
  <div class="dropdown-menu" style="--menu-w: 14rem">
    <div class="dropdown-label">Appearance</div>
    <button class="dropdown-item" aria-checked="true" data-value="statusbar">Status bar <span class="dropdown-shortcut">⌘/</span></button>
    <button class="dropdown-item" aria-checked="false" data-value="activity">Activity bar</button>
    <button class="dropdown-item" aria-checked="true" data-value="minimap">Minimap</button>
    <div class="dropdown-separator"></div>
    <div class="dropdown-label">Panel position</div>
    <div class="dropdown-radio-group">
      <button class="dropdown-item" aria-checked="false" data-value="top">Top</button>
      <button class="dropdown-item" aria-checked="true" data-value="bottom">Bottom</button>
      <button class="dropdown-item" aria-checked="false" data-value="right">Right</button>
    </div>
  </div>
</div>
<code class="demo-dd-log" id="dropdown-log">ranj:select →</code>`,
        js: `var log = root.querySelector('#dropdown-log');
root.addEventListener('ranj:select', function (e) { log.textContent = 'ranj:select → ' + e.detail.value + (e.detail.checked != null ? ' = ' + e.detail.checked : ''); });`,
        css: `.demo-dd-log { font-family: var(--font-mono); font-size: .75rem; color: var(--muted-fg); background: var(--muted); padding: .35rem .6rem; border-radius: var(--radius-sm); }`
      },
      {
        title: 'Row actions',
        description: 'An icon trigger aligned to the end (<code>data-placement="bottom-end"</code>) with a destructive item.',
        html: `
<div class="demo-dd-file">
  <span class="demo-dd-icon">${I.fileText}</span>
  <span><b>Q3 board update.pdf</b><small>2.4 MB · Edited 3h ago by Jonas</small></span>
  <div class="dropdown" data-placement="bottom-end">
    <button class="btn btn-ghost btn-icon btn-sm" data-dropdown-trigger aria-label="More actions">${I.more}</button>
    <div class="dropdown-menu">
      <button class="dropdown-item">${I.eye} Open</button>
      <button class="dropdown-item">${I.pencil} Rename <span class="dropdown-shortcut">F2</span></button>
      <button class="dropdown-item">${I.copy} Duplicate <span class="dropdown-shortcut">⌘D</span></button>
      <div class="dropdown-sub">
        <button class="dropdown-item">${I.folder} Move to</button>
        <div class="dropdown-menu">
          <button class="dropdown-item">${I.folder} Board meetings</button>
          <button class="dropdown-item">${I.folder} Finance</button>
          <button class="dropdown-item">${I.folder} Archive 2025</button>
        </div>
      </div>
      <button class="dropdown-item">${I.download} Download</button>
      <div class="dropdown-separator"></div>
      <button class="dropdown-item dropdown-item-destructive">${I.trash} Delete <span class="dropdown-shortcut">⌫</span></button>
    </div>
  </div>
</div>`,
        css: `.demo-dd-file { display: flex; align-items: center; gap: .75rem; width: min(26rem, calc(100vw - 4rem)); padding: .75rem .75rem .75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); }
.demo-dd-icon { display: grid; place-items: center; width: 2.25rem; height: 2.25rem; border-radius: var(--radius); background: var(--destructive-soft); color: var(--destructive-soft-fg); flex-shrink: 0; } .demo-dd-icon svg { width: 1.1rem; height: 1.1rem; }
.demo-dd-file > span:nth-child(2) { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.35; font-size: .875rem; }
.demo-dd-file b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .demo-dd-file small { color: var(--muted-fg); font-size: .75rem; }
.demo-dd-file .btn-icon svg { width: 1rem; height: 1rem; }`
      },
      {
        title: 'Glass menu',
        description: '<code>.menu-glass</code> gives a frosted, translucent surface.',
        bg: 'grid',
        html: `
<div class="demo-dd-glass">
  <div class="dropdown">
    <button class="btn" data-dropdown-trigger>${I.sparkles} Generate ${I.svg('chevronDown', null, 'class="dropdown-chevron"')}</button>
    <div class="dropdown-menu menu-glass">
      <button class="dropdown-item">${I.fileText} <span class="dropdown-item-text">Summary<span class="dropdown-item-desc">Key points in 5 bullets</span></span></button>
      <button class="dropdown-item">${I.wand} <span class="dropdown-item-text">Rewrite<span class="dropdown-item-desc">Clearer, same meaning</span></span></button>
      <button class="dropdown-item">${I.globe} <span class="dropdown-item-text">Translate<span class="dropdown-item-desc">Into 40+ languages</span></span></button>
    </div>
  </div>
</div>`,
        css: `.demo-dd-glass { width: min(30rem, calc(100vw - 4rem)); display: flex; justify-content: center; padding: 2rem 0 10rem; border-radius: var(--radius-xl); background: radial-gradient(circle at 20% 30%, oklch(.75 .15 calc(var(--hue) + 80) / .55), transparent 55%), radial-gradient(circle at 80% 70%, oklch(.7 .18 var(--hue) / .5), transparent 55%); }`
      }
    ],
    api: [
      { name: '.dropdown', type: 'class', desc: 'Wrapper with a <code>[data-dropdown-trigger]</code> and a <code>.dropdown-menu</code>. <code>.dropdown-right</code> aligns to the end (v1).' },
      { name: '.dropdown-item', type: 'class', desc: 'Button or link. <code>disabled</code> to disable; <code>.dropdown-item-destructive</code> for danger.' },
      { name: 'aria-checked / data-checkbox', type: 'attr', desc: 'Makes an item a checkbox item. Inside <code>.dropdown-radio-group</code> items become radios.' },
      { name: '.dropdown-sub', type: 'class', desc: 'Wrap an item + nested <code>.dropdown-menu</code> to create a submenu.' },
      { name: '.dropdown-label / -separator', type: 'class', desc: 'Structure and adornments; also <code>.dropdown-header</code>, <code>.dropdown-shortcut</code>, <code>.dropdown-item-desc</code>.' },
      { name: '.menu-glass', type: 'class', desc: 'Frosted translucent surface.' },
      { name: 'data-placement', type: 'attr', default: 'bottom-start', desc: 'On <code>.dropdown</code>. Flips automatically.' },
      { name: 'data-keep-open / data-close', type: 'attr', desc: 'Keep a normal item open after select / close after a checkable item.' },
      { name: '--menu-w', type: 'var', default: '12rem', desc: 'Minimum width.' },
      { name: 'Ranj.dropdown.open(el, "first") / close(el)', type: 'js', desc: 'Programmatic control (el = .dropdown or trigger).' },
      { name: 'ranj:select', type: 'event', desc: 'Bubbles from the item: <code>{ item, value, checked }</code>. Cancel to keep the menu open.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On <code>.dropdown</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-floating-action-menu.js */
(function () {
  var I = window.__ovI;
  function act(icon, label, cls) { return '<button class="fab-action' + (cls ? ' ' + cls : '') + '" data-label="' + label + '">' + I[icon] + '</button>'; }
  RanjDocs.add({
    id: 'floating-action-menu',
    name: 'Floating Action Menu',
    group: 'Navigation',
    description: 'A floating action button that springs open into a stack of secondary actions, vertically with labels or along an arc. The plus rotates into a close icon; actions stagger in and out.',
    tags: ['js', 'new'],
    keywords: ['fab', 'speed dial', 'action button', 'radial menu', 'quick actions'],
    demos: [
      {
        title: 'Speed dial',
        height: 360,
        html: `
<div class="demo-fab-stage">
  <div class="fab-menu" data-direction="up">
    <div class="fab-actions">
      ${act('camera', 'Take photo')}${act('image', 'Upload image')}${act('fileText', 'New document')}${act('folder', 'New folder', 'fab-action-primary')}
    </div>
    <button class="fab" aria-label="Create">${I.plus}</button>
  </div>
</div>
<code class="demo-fab-log" id="fab-log">ranj:select →</code>`,
        js: `var log = root.querySelector('#fab-log');
root.addEventListener('ranj:select', function (e) { log.textContent = 'ranj:select → ' + e.detail.action; });`,
        css: `.demo-fab-stage { position: relative; width: 16rem; height: 18rem; display: flex; align-items: flex-end; justify-content: flex-end; padding: 1rem; border-radius: var(--radius-xl); border: 1px dashed var(--border-strong); }
.demo-fab-log { font-family: var(--font-mono); font-size: .75rem; color: var(--muted-fg); background: var(--muted); padding: .35rem .6rem; border-radius: var(--radius-sm); }`
      },
      {
        title: 'Radial',
        description: '<code>.fab-radial</code> fans actions along an arc: <code>data-arc</code> (degrees) centered on <code>data-start</code>.',
        height: 320,
        html: `
<div class="demo-fab-stage" style="justify-content:center;align-items:flex-end;width:20rem;height:15rem">
  <div class="fab-menu fab-radial" data-arc="160" data-start="-90">
    <div class="fab-actions">
      ${act('heart', 'Like')}${act('message', 'Comment')}${act('share', 'Share')}${act('bookmark', 'Save')}${act('send', 'Send')}
    </div>
    <button class="fab" aria-label="Actions">${I.plus}</button>
  </div>
</div>`
      },
      {
        title: 'Horizontal',
        height: 200,
        html: `
<div class="fab-menu" data-direction="right" style="--fab-size: 3rem; --fab-action: 2.5rem">
  <div class="fab-actions">${act('layers', 'Layers')}${act('pencil', 'Draw')}${act('scissors', 'Cut')}${act('clipboard', 'Paste')}${act('trash', 'Delete')}</div>
  <button class="fab" aria-label="Tools">${I.plus}</button>
</div>`,
        css: `.fab-menu[data-direction="right"] .fab-action[data-label]::after { right: auto; left: 50%; top: auto; bottom: calc(100% + .5rem); transform: translate(-50%, 4px); }
.fab-menu[data-direction="right"][data-open] .fab-action[data-label]::after { opacity: 0; }
.fab-menu[data-direction="right"][data-open] .fab-action:hover::after, .fab-menu[data-direction="right"][data-open] .fab-action:focus-visible::after { opacity: 1; transform: translate(-50%, 0); }`
      }
    ],
    api: [
      { name: '.fab-menu', type: 'class', desc: 'Wrapper: <code>.fab-actions</code> of <code>.fab-action</code>s, then the <code>.fab</code> button. <code>.fab-menu-fixed</code> pins it bottom-right.' },
      { name: 'data-direction', type: 'attr', default: 'up', desc: 'up | down | left | right.' },
      { name: '.fab-radial + data-arc / data-start / data-radius', type: 'class', desc: 'Arc layout (degrees; radius in px, default <code>--fab-radius</code>).' },
      { name: 'data-label', type: 'attr', desc: 'On actions: label pill (vertical) or tooltip (radial), also the accessible name.' },
      { name: 'data-label-side="right"', type: 'attr', desc: 'Put labels on the right.' },
      { name: '.fab-action-primary', type: 'class', desc: 'Tinted action.' },
      { name: '.fab-scrim', type: 'class', desc: 'Optional sibling after the menu: dims the page while open.' },
      { name: '--fab-size / --fab-action / --fab-gap / --fab-radius', type: 'var', default: '3.5rem / 2.75rem / .75rem / 6rem', desc: 'Sizing.' },
      { name: 'ranj:open / ranj:close / ranj:select', type: 'event', desc: '<code>select</code> detail: <code>{ action }</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-hover-card.js */
(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'hover-card',
    name: 'Hover Card',
    group: 'Overlays',
    description: 'A preview card for sighted pointer users: opens after a short hover delay, stays open while you move into it, and also opens on keyboard focus.',
    tags: ['js'],
    keywords: ['preview', 'profile card', 'link preview', 'popover on hover'],
    demos: [
      {
        title: 'Profile preview',
        html: `
<div class="demo-hc-text">Designed by
<span class="hover-card">
  <a href="#" class="hover-card-trigger">@rauno</a>
  <div class="hover-card-content">
    <div class="demo-hc-profile">
      <span class="demo-ov-avatar" style="--h:285;width:48px;height:48px;font-size:17px">RF</span>
      <div>
        <div class="demo-hc-name">Rauno Freiberg <span class="demo-hc-badge">${I.check}</span></div>
        <div class="demo-hc-handle">@rauno · Staff Design Engineer</div>
        <p>Making interfaces feel inevitable. Building at Northwind, writing about craft.</p>
        <div class="demo-hc-meta"><span>${I.pin} Helsinki</span><span>${I.calendar} Joined March 2019</span></div>
        <div class="demo-hc-stats"><span><b>1,204</b> following</span><span><b>48.3k</b> followers</span></div>
      </div>
    </div>
  </div>
</span>
and shipped last week.</div>`,
        css: `.demo-hc-text { font-size: .9375rem; color: var(--muted-fg); }
.demo-hc-profile { display: flex; gap: .875rem; }
.demo-hc-name { display: flex; align-items: center; gap: .3rem; font-weight: 600; font-size: .9375rem; }
.demo-hc-badge { display: grid; place-items: center; width: 1rem; height: 1rem; border-radius: 99px; background: var(--primary); color: var(--primary-fg); } .demo-hc-badge svg { width: .65rem; height: .65rem; stroke-width: 3.5; }
.demo-hc-handle { font-size: .8125rem; color: var(--muted-fg); }
.demo-hc-profile p { margin: .5rem 0; font-size: .8125rem; line-height: 1.5; }
.demo-hc-meta, .demo-hc-stats { display: flex; flex-wrap: wrap; gap: .25rem .875rem; font-size: .75rem; color: var(--muted-fg); }
.demo-hc-meta span { display: inline-flex; align-items: center; gap: .3rem; } .demo-hc-meta svg { width: .8rem; height: .8rem; }
.demo-hc-stats { margin-top: .4rem; } .demo-hc-stats b { color: var(--fg); font-weight: 600; }`
      },
      {
        title: 'Link preview',
        html: `
<div class="demo-hc-text">Read the
<span class="hover-card" data-placement="top" data-open-delay="300">
  <a href="#" class="hover-card-trigger">launch post</a>
  <div class="hover-card-content hover-card-flush" style="--hover-card-w: 18rem">
    <div class="demo-hc-cover">${I.sparkles}</div>
    <div style="padding: .875rem 1rem 1rem">
      <div class="demo-hc-site">${I.globe} northwind.app/blog</div>
      <div class="demo-hc-title">Introducing Northwind 4: realtime everything</div>
      <div class="demo-hc-handle" style="margin-top:.25rem">Multiplayer cursors, live comments, and a new sync engine that is 6× faster.</div>
    </div>
  </div>
</span>
before the webinar.</div>`,
        css: `.demo-hc-cover { height: 7rem; display: grid; place-items: center; color: #fff; background: radial-gradient(circle at 30% 20%, oklch(.75 .17 calc(var(--hue) + 60)), transparent 60%), linear-gradient(135deg, oklch(.55 .22 var(--hue)), oklch(.4 .2 calc(var(--hue) + 40))); }
.demo-hc-cover svg { width: 2rem; height: 2rem; }
.demo-hc-site { display: flex; align-items: center; gap: .35rem; font-size: .7rem; color: var(--muted-fg); text-transform: uppercase; letter-spacing: .05em; } .demo-hc-site svg { width: .75rem; height: .75rem; }
.demo-hc-title { font-weight: 600; font-size: .9rem; margin-top: .3rem; line-height: 1.35; }`
      }
    ],
    api: [
      { name: '.hover-card', type: 'class', desc: 'Wrapper: first child is the trigger, plus a <code>.hover-card-content</code>.' },
      { name: '.hover-card-trigger', type: 'class', desc: 'Optional underlined link style for inline triggers.' },
      { name: '.hover-card-flush', type: 'class', desc: 'Content without padding (for covers/media).' },
      { name: 'data-placement', type: 'attr', default: 'bottom', desc: 'Side and alignment.' },
      { name: 'data-open-delay / data-close-delay', type: 'attr', default: '500 / 250', desc: 'Milliseconds.' },
      { name: 'data-arrow', type: 'attr', desc: 'Show an arrow.' },
      { name: '--hover-card-w', type: 'var', default: '20rem', desc: 'Card width.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On <code>.hover-card</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-menubar.js */
(function () {
  var I = window.__ovI;
  function mi(label, sc, attrs) { return '<button class="menu-item"' + (attrs || '') + '>' + label + (sc ? '<span class="menu-shortcut">' + sc + '</span>' : '') + '</button>'; }
  var sep = '<div class="menu-separator"></div>';
  RanjDocs.add({
    id: 'menubar',
    name: 'Menubar',
    group: 'Navigation',
    description: 'A desktop-app style menu bar (File, Edit, View…). Click or press ↓ to open, hover to switch between menus while one is open, and use ← → to walk across menus, including from inside a submenu.',
    tags: ['js'],
    keywords: ['app menu', 'file menu', 'toolbar menu', 'desktop'],
    demos: [
      {
        title: 'Editor menubar',
        height: 300,
        html: `
<div class="menubar">
  <span class="menubar-brand">${I.svg('command', 15)}</span>
  <div class="menubar-menu">
    <button class="menubar-trigger">File</button>
    <div class="menubar-content">
      ${mi('New Tab', '⌘T')}${mi('New Window', '⌘N')}${mi('New Incognito Window', '', ' disabled')}${sep}
      <div class="menu-sub"><button class="menu-item">Share</button><div class="menubar-content">${mi('Email link')}${mi('Messages')}${mi('Notes')}</div></div>
      ${sep}${mi('Print…', '⌘P')}
    </div>
  </div>
  <div class="menubar-menu">
    <button class="menubar-trigger">Edit</button>
    <div class="menubar-content">
      ${mi('Undo', '⌘Z')}${mi('Redo', '⇧⌘Z')}${sep}
      <div class="menu-sub"><button class="menu-item">Find</button><div class="menubar-content">${mi('Search the web')}${sep}${mi('Find…', '⌘F')}${mi('Find Next', '⌘G')}${mi('Find Previous', '⇧⌘G')}</div></div>
      ${sep}${mi('Cut', '⌘X')}${mi('Copy', '⌘C')}${mi('Paste', '⌘V')}
    </div>
  </div>
  <div class="menubar-menu">
    <button class="menubar-trigger">View</button>
    <div class="menubar-content">
      ${mi('Always Show Bookmarks Bar', '', ' aria-checked="false"')}${mi('Always Show Full URLs', '', ' aria-checked="true"')}${sep}
      ${mi('Reload', '⌘R')}${mi('Force Reload', '⇧⌘R', ' disabled')}${sep}${mi('Toggle Fullscreen', '⌃⌘F')}${sep}${mi('Hide Sidebar')}
    </div>
  </div>
  <div class="menubar-menu">
    <button class="menubar-trigger">Profiles</button>
    <div class="menubar-content">
      <div class="menu-radio-group">${mi('Andy', '', ' aria-checked="false"')}${mi('Benoit', '', ' aria-checked="true"')}${mi('Luis', '', ' aria-checked="false"')}</div>
      ${sep}${mi('Edit…')}${sep}${mi('Add Profile…')}
    </div>
  </div>
</div>`
      }
    ],
    api: [
      { name: '.menubar', type: 'class', desc: 'Bar (<code>role="menubar"</code>). <code>.menubar-flat</code> removes the frame; <code>.menubar-brand</code> for a logo.' },
      { name: '.menubar-menu > .menubar-trigger + .menubar-content', type: 'class', desc: 'One menu. v1 <code>.menubar-item</code> also works as a trigger.' },
      { name: '.menu-item / .menu-separator / .menu-label / .menu-shortcut', type: 'class', desc: 'Menu contents (same engine and options as the dropdown menu).' },
      { name: '.menu-sub', type: 'class', desc: 'Item + nested <code>.menubar-content</code> → submenu.' },
      { name: 'aria-checked / .menu-radio-group', type: 'attr', desc: 'Checkbox and radio items.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On <code>.menubar</code>; <code>ranj:select</code> bubbles from items.' }
    ]
  });
})();

;
/* docs/registry/overlays-navbar.js */
(function () {
  var I = window.__ovI;
  var logo = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--fg)"/><path d="M10 22V10l12 12V10" stroke="var(--bg)" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var links = '<a class="navbar-link" href="#" aria-current="page">Product</a><a class="navbar-link" href="#">Solutions</a><a class="navbar-link" href="#">Customers</a><a class="navbar-link" href="#">Pricing</a><a class="navbar-link" href="#">Docs</a>';
  var mobile = '<div class="navbar-mobile"><a class="navbar-link" href="#" aria-current="page">Product</a><a class="navbar-link" href="#">Solutions</a><a class="navbar-link" href="#">Customers</a><a class="navbar-link" href="#">Pricing</a><a class="navbar-link" href="#">Docs</a><hr><div class="navbar-mobile-actions"><a class="btn btn-outline" href="#">Sign in</a><a class="btn" href="#">Start for free</a></div></div>';
  var page = '<div class="demo-nb-hero"><span class="demo-nb-chip">' + I.sparkles + ' Northwind 4 is live</span><h3>Ship the product, not the process.</h3><p>Plan, build and launch with the tools your team already loves. Scroll this box to see the header react.</p></div><div class="demo-nb-fill"></div>';
  RanjDocs.add({
    id: 'navbar',
    name: 'Navbar',
    group: 'Navigation',
    description: 'A responsive site header. Links collapse into an animated hamburger panel when the bar itself gets narrow (container query, so it works in any column), a pill glides between hovered links, and sticky variants blur and lift once you scroll.',
    tags: ['js'],
    keywords: ['header', 'top bar', 'app bar', 'menu', 'hamburger', 'site navigation'],
    demos: [
      {
        title: 'Sticky & blurred',
        description: 'Scroll inside the frame: the bar turns translucent with a soft shadow.',
        pad: false, center: false, height: 380,
        html: `
<div class="demo-nb-frame">
  <header class="navbar navbar-sticky navbar-blur">
    <a class="navbar-brand" href="#">${logo} Northwind</a>
    <nav class="navbar-nav">${links}</nav>
    <div class="navbar-actions"><a class="btn btn-ghost btn-sm" href="#">Sign in</a><a class="btn btn-sm" href="#">Start for free</a></div>
    <button class="navbar-toggle"></button>
    ${mobile}
  </header>
  ${page}
</div>`,
        css: `.demo-nb-frame { position: relative; height: 380px; overflow-y: auto; background: var(--bg); }
.demo-nb-hero { display: flex; flex-direction: column; align-items: center; text-align: center; gap: .75rem; padding: 3.5rem 1.5rem 2rem;
  background: radial-gradient(60% 80% at 50% 0%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%); }
.demo-nb-hero h3 { font-size: clamp(1.5rem, 4vw, 2.25rem); font-weight: 700; letter-spacing: -.035em; line-height: 1.1; max-width: 22ch; }
.demo-nb-hero p { color: var(--muted-fg); max-width: 40ch; font-size: .9375rem; }
.demo-nb-chip { display: inline-flex; align-items: center; gap: .35rem; font-size: .75rem; font-weight: 500; padding: .25rem .7rem; border-radius: 99px; border: 1px solid var(--border); background: var(--card); }
.demo-nb-chip svg { width: .8rem; height: .8rem; color: var(--primary); }
.demo-nb-fill { height: 600px; margin: 0 1.5rem; border-radius: var(--radius-xl); background: repeating-linear-gradient(180deg, var(--muted) 0 64px, transparent 64px 80px); opacity: .6; }`
      },
      {
        title: 'Mobile menu',
        description: 'The same markup in a 360px column. Tap the burger: the panel drops in with staggered links.',
        pad: false, height: 420,
        html: `
<div class="demo-nb-phone">
  <header class="navbar">
    <a class="navbar-brand" href="#">${logo} Northwind</a>
    <nav class="navbar-nav">${links}</nav>
    <div class="navbar-actions"><a class="btn btn-sm" href="#">Start for free</a></div>
    <button class="navbar-toggle"></button>
    ${mobile}
  </header>
  ${page}
</div>`,
        css: `.demo-nb-phone { position: relative; width: min(360px, calc(100vw - 2rem)); height: 420px; overflow: hidden; border: 1px solid var(--border); border-radius: 1.75rem; background: var(--bg); box-shadow: var(--shadow-lg); margin: 1.5rem 0; }`
      },
      {
        title: 'Floating pill',
        description: '<code>.navbar-floating</code> with centered links (<code>.navbar-center</code>) and a CTA that stays on mobile (<code>.navbar-actions-keep</code>).',
        pad: false, center: false, height: 200,
        html: `
<div class="demo-nb-float">
  <header class="navbar navbar-floating navbar-center navbar-blur">
    <a class="navbar-brand" href="#">${logo}</a>
    <nav class="navbar-nav"><a class="navbar-link" href="#" aria-current="page">Work</a><a class="navbar-link" href="#">Studio</a><a class="navbar-link" href="#">Journal</a><a class="navbar-link" href="#">Contact</a></nav>
    <div class="navbar-actions navbar-actions-keep"><a class="btn btn-sm" href="#" style="border-radius:99px">Let's talk ${I.arrowRight}</a></div>
    <button class="navbar-toggle"></button>
    <div class="navbar-mobile"><a class="navbar-link" href="#" aria-current="page">Work</a><a class="navbar-link" href="#">Studio</a><a class="navbar-link" href="#">Journal</a><a class="navbar-link" href="#">Contact</a></div>
  </header>
</div>`,
        css: `.demo-nb-float { min-height: 200px; padding-top: .5rem; background: linear-gradient(135deg, color-mix(in oklab, var(--primary) 10%, var(--bg)), var(--bg) 60%); }
.demo-nb-float .btn svg { width: .9rem; height: .9rem; }`
      }
    ],
    api: [
      { name: '.navbar', type: 'class', desc: 'Header bar. Children: <code>.navbar-brand</code>, <code>.navbar-nav</code> of <code>.navbar-link</code>s (<code>aria-current="page"</code>), <code>.navbar-actions</code>, <code>.navbar-toggle</code>, <code>.navbar-mobile</code>.' },
      { name: '.navbar-sticky / -blur / -transparent / -shrink', type: 'class', desc: 'Stick to the top, frosted background, transparent until scrolled, shrink height on scroll.' },
      { name: '.navbar-floating / -center', type: 'class', desc: 'Rounded floating pill; centered link group.' },
      { name: '.navbar-actions-keep', type: 'class', desc: 'Keep these actions visible on mobile.' },
      { name: '--navbar-h', type: 'var', default: '4rem', desc: 'Bar height. Collapses to the burger below 48rem of navbar width.' },
      { name: 'data-offset', type: 'attr', default: '8', desc: 'Scroll distance before <code>data-scrolled</code> is set.' },
      { name: 'data-no-hover', type: 'attr', desc: 'Disable the gliding hover pill.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'Mobile panel opened / closed.' }
    ]
  });
})();

;
/* docs/registry/overlays-navigation-menu.js */
(function () {
  var I = window.__ovI;
  function card(icon, t, d) { return '<a class="nav-menu-card" href="#"><span class="nav-menu-card-icon">' + I[icon] + '</span><span><b>' + t + '</b><span>' + d + '</span></span></a>'; }
  RanjDocs.add({
    id: 'navigation-menu',
    name: 'Navigation Menu',
    group: 'Navigation',
    description: 'A mega menu for site headers. One shared panel morphs its size as you move between items, content slides in from the direction you travelled, and a small arrow tracks the active trigger. Works with hover, click and keyboard.',
    tags: ['js', 'new'],
    keywords: ['mega menu', 'dropdown navigation', 'header menu', 'flyout'],
    demos: [
      {
        title: 'Mega menu',
        description: 'Hover across Products → Solutions → Resources and watch the panel morph.',
        height: 460, center: false,
        html: `
<nav class="nav-menu demo-navm" aria-label="Main">
  <ul class="nav-menu-list">
    <li class="nav-menu-item">
      <button class="nav-menu-trigger">Products</button>
      <div class="nav-menu-content">
        <div class="demo-navm-products">
          <a class="nav-menu-feature" href="#">${I.svg('sparkles', 22)}<b>Northwind AI</b><span>Draft, summarize and search across every doc in your workspace.</span></a>
          <div class="nav-menu-grid" style="--cols:1">
            ${card('layout', 'Docs', 'Collaborative pages with blocks and embeds.')}
            ${card('grid', 'Boards', 'Kanban, timelines and sprints.')}
            ${card('chart', 'Insights', 'Dashboards that update in realtime.')}
          </div>
        </div>
      </div>
    </li>
    <li class="nav-menu-item">
      <button class="nav-menu-trigger">Solutions</button>
      <div class="nav-menu-content">
        <div class="nav-menu-label">By team</div>
        <div class="nav-menu-grid">
          ${card('pencil', 'Design', 'Critique, specs and handoff.')}
          ${card('code', 'Engineering', 'Roadmaps linked to your PRs.')}
          ${card('rocket', 'Product', 'Discovery to launch in one place.')}
          ${card('target', 'Marketing', 'Campaign plans and briefs.')}
          ${card('users', 'HR', 'Onboarding that people finish.')}
          ${card('shield', 'Enterprise', 'SSO, audit logs, data residency.')}
        </div>
        <div class="nav-menu-footer"><span>New: Northwind for startups, free for a year.</span><a href="#">Apply ${I.svg('arrowRight', 12)}</a></div>
      </div>
    </li>
    <li class="nav-menu-item">
      <button class="nav-menu-trigger">Resources</button>
      <div class="nav-menu-content">
        <div class="nav-menu-grid" style="--cols:1; width: 17rem">
          ${card('book', 'Guides', 'Best practices from 4,000 teams.')}
          ${card('video', 'Webinars', 'Live sessions every Thursday.')}
          ${card('lifebuoy', 'Help center', 'Answers in under a minute.')}
        </div>
      </div>
    </li>
    <li class="nav-menu-item"><a class="nav-menu-link" href="#">Pricing</a></li>
    <li class="nav-menu-item"><a class="nav-menu-link" href="#">Changelog</a></li>
  </ul>
</nav>`,
        css: `.demo-navm { margin: 0 auto; width: max-content; max-width: 100%; }
.demo-navm .nav-menu-list { flex-wrap: wrap; justify-content: center; }
.demo-navm-products { display: grid; grid-template-columns: 13rem 17rem; gap: .5rem; }
.nav-menu-feature svg { margin-bottom: auto; }
.nav-menu-footer a { display: inline-flex; align-items: center; gap: .25rem; font-weight: 600; }
@media (max-width: 640px) { .demo-navm-products { grid-template-columns: minmax(0, 1fr); } .demo-navm-products .nav-menu-feature { min-height: 8rem; } }`
      }
    ],
    api: [
      { name: '.nav-menu > .nav-menu-list > .nav-menu-item', type: 'class', desc: 'Structure. An item holds a <code>.nav-menu-trigger</code> + <code>.nav-menu-content</code>, or a plain <code>.nav-menu-link</code>.' },
      { name: '.nav-menu-content', type: 'class', desc: 'Panel content, moved into a shared <code>.nav-menu-viewport</code> that animates width/height.' },
      { name: '.nav-menu-grid / -card / -feature / -label / -footer', type: 'class', desc: 'Content helpers. <code>--cols</code> sets grid columns.' },
      { name: 'data-delay / data-close-delay', type: 'attr', default: '120 / 260', desc: 'Hover intent timings (ms).' },
      { name: 'data-align="center"', type: 'attr', desc: 'Center the panel under the list instead of under the trigger.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ value, open }</code> on <code>.nav-menu</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-notification-center.js */
(function () {
  var I = window.__ovI;
  function av(t, h) { return '<span class="demo-ov-avatar" style="--h:' + h + ';width:36px;height:36px;font-size:13px">' + t + '</span>'; }
  function badge(icon, color) { return '<span class="notif-badge" style="background:' + color + '">' + I[icon] + '</span>'; }
  var items = [
    [1, av('SC', 15) + badge('message', 'var(--info)'), '<b>Sofia Chen</b> commented on <b>Pricing page v3</b>', '<div class="notif-quote">Love the new tiers. Can we A/B the annual toggle?</div>', '2 min ago'],
    [1, av('MK', 140) + badge('userPlus', 'var(--success)'), '<b>Marcus Kim</b> requested access to <b>Design System</b>', '<div class="notif-actions"><button class="btn btn-sm">Approve</button><button class="btn btn-sm btn-outline">Decline</button></div>', '18 min ago'],
    [1, '<span class="demo-notif-sys" style="--h:20">' + I.alert + '</span>', '<b>Usage alert:</b> 92% of your monthly build minutes used', '', '1 hour ago'],
    [0, av('AR', 290) + badge('star', 'var(--warning)'), '<b>Aisha Rahman</b> starred <b>northwind/ui</b>', '', 'Yesterday'],
    [0, '<span class="demo-notif-sys" style="--h:150">' + I.checkCircle + '</span>', 'Deployment <b>#1842</b> to production succeeded', '', 'Yesterday']
  ].map(function (n) {
    return '<div class="notif-item"' + (n[0] ? ' data-unread' : '') + '><div class="notif-media">' + n[1] + '</div><div class="notif-body"><p>' + n[2] + '</p>' + n[3] + '<small>' + n[4] + '</small></div></div>';
  }).join('');
  var pushes = [
    ['Messages', 'Ava Martinez', 'Running 5 min late, grab us a table by the window?', 'now', '#34c759', 'message'],
    ['Calendar', 'Design review', 'Starts in 10 minutes · Room 4B', '2m ago', '#ff3b30', 'calendar'],
    ['Mail', 'Stripe', 'Your payout of $12,480.00 is on the way.', '9m ago', '#0a84ff', 'mail'],
    ['Fitness', 'Close your rings', 'You are 120 calories away from your Move goal.', '1h ago', '#ff2d55', 'heart']
  ].map(function (p) {
    return '<div class="push-card"><div class="push-icon" style="--push-icon-bg:' + p[4] + '">' + I[p[5]] + '</div><div class="push-text"><div class="push-top"><b>' + p[1] + '</b><small>' + p[3] + '</small></div><p>' + p[2] + '</p></div></div>';
  }).join('');

  RanjDocs.add({
    id: 'notification-center',
    name: 'Notification Center',
    group: 'Feedback',
    description: 'An inbox behind a bell: live unread count, filter tabs, mark-all-read, and new items that ring the bell as they arrive. Plus an iOS-style stack of push notifications that fans out when tapped.',
    tags: ['js', 'new'],
    keywords: ['inbox', 'bell', 'notifications', 'activity feed', 'push', 'ios', 'lock screen'],
    demos: [
      {
        title: 'Inbox',
        height: 300,
        html: `
<div class="notification-center" id="notif-demo">
  <button class="notif-trigger" data-label="Notifications">${I.bell}<span class="notif-count">3</span></button>
  <div class="notif-panel">
    <div class="notif-header"><b>Notifications</b><button class="notif-mark-all">Mark all as read</button></div>
    <div class="notif-tabs" role="tablist"><button data-filter="all">All</button><button data-filter="unread">Unread <span>3</span></button></div>
    <div class="notif-list">${items}</div>
    <div class="notif-empty">${I.checkCircle}<b style="color:var(--fg)">You're all caught up</b>New activity will show up here.</div>
    <div class="notif-footer"><button data-notif-close>View all activity</button></div>
  </div>
</div>
<button class="btn btn-outline btn-sm" id="notif-add">${I.plus} Simulate new</button>`,
        js: `var people = [['Leo Park', 'mentioned you in', 'Q4 OKRs', 60], ['Nina Rossi', 'assigned you', 'Fix checkout flicker', 200], ['Tom Becker', 'replied to', 'Onboarding copy', 320]], n = 0;
root.querySelector('#notif-add').onclick = function () {
  var p = people[n++ % people.length];
  Ranj.notifications.add('#notif-demo', { html: '<div class="notif-media"><span class="demo-ov-avatar" style="--h:' + p[3] + ';width:36px;height:36px;font-size:13px">' + p[0].split(' ').map(function (s) { return s[0]; }).join('') + '</span></div><div class="notif-body"><p><b>' + p[0] + '</b> ' + p[1] + ' <b>' + p[2] + '</b></p><small>Just now</small></div>' });
};`,
        css: `.demo-notif-sys { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 99px; color: oklch(.55 .17 var(--h)); background: oklch(.95 .04 var(--h)); }
[data-theme="dark"] .demo-notif-sys { color: oklch(.8 .13 var(--h)); background: oklch(.3 .06 var(--h)); }
.demo-notif-sys svg { width: 1.1rem; height: 1.1rem; } #notif-add svg { width: .9rem; height: .9rem; }`
      },
      {
        title: 'iOS push stack',
        description: 'Tap the pile to fan it out; new notifications drop in from the top.',
        height: 460,
        pad: false,
        center: false,
        html: `
<div class="demo-push-phone">
  <div class="demo-push-time"><small>Monday, November 16</small><b>9:41</b></div>
  <div class="push-stack" id="push-demo">
    <div class="push-stack-head"><b>Notification Centre</b><span><button data-push-collapse>Show less</button> <button data-push-clear>Clear</button></span></div>
    <div class="push-cards">${pushes}</div>
    <div class="push-more"></div>
  </div>
  <button class="demo-push-btn" id="push-add">${I.bell} Send notification</button>
</div>`,
        js: `var q = [['Slack', '#4a154b', 'message', 'Jonas in #launch', 'Ship it, the build is green.'], ['Uber Eats', '#06c167', 'bag', 'Order on the way', 'Your Pad Thai arrives in 12 min.'], ['Photos', '#ff9f0a', 'image', 'On this day', '3 years ago in Lisbon: 24 photos.']], k = 0;
root.querySelector('#push-add').onclick = function () {
  var p = q[k++ % q.length];
  Ranj.push('#push-demo', { title: p[3], body: p[4], time: 'now', color: p[1], icon: window.__ovI[p[2]] });
};`,
        css: `.demo-push-phone { position: relative; width: 100%; min-height: 460px; display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 1.75rem 1rem 1.25rem; overflow: hidden;
  background: radial-gradient(120% 80% at 10% 0%, #f9a8d4 0%, transparent 55%), radial-gradient(100% 70% at 100% 30%, #818cf8 0%, transparent 60%), radial-gradient(120% 90% at 50% 120%, #22d3ee 0%, transparent 60%), #6d28d9; }
.demo-push-time { display: flex; flex-direction: column; align-items: center; color: #fff; line-height: 1; text-shadow: 0 2px 16px rgb(0 0 0 / .2); }
.demo-push-time small { font-size: .9rem; font-weight: 600; opacity: .9; } .demo-push-time b { font-size: 4.25rem; font-weight: 700; letter-spacing: -.04em; margin-top: .2rem; }
.demo-push-phone .push-stack { margin-bottom: 2rem; }
.demo-push-btn { margin-top: auto; display: inline-flex; align-items: center; gap: .4rem; padding: .5rem .9rem; border-radius: 99px; font-size: .8125rem; font-weight: 600; color: #fff; background: rgb(255 255 255 / .2); -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px); }
.demo-push-btn svg { width: .9rem; height: .9rem; }`
      }
    ],
    api: [
      { name: '.notification-center', type: 'class', desc: 'Wrapper with a <code>.notif-trigger</code> (bell + <code>.notif-count</code>) and a <code>.notif-panel</code>.' },
      { name: '.notif-panel', type: 'class', desc: 'Parts: <code>.notif-header .notif-mark-all .notif-tabs .notif-list .notif-empty .notif-footer</code>.' },
      { name: '.notif-item[data-unread]', type: 'class', desc: 'One notification (<code>.notif-media</code>, <code>.notif-body</code>, <code>.notif-quote</code>, <code>.notif-actions</code>). Clicking marks it read.' },
      { name: 'data-filter="all|unread"', type: 'attr', desc: 'On tab buttons inside <code>.notif-tabs</code>.' },
      { name: 'data-placement', type: 'attr', default: 'bottom-end', desc: 'Panel placement.' },
      { name: 'Ranj.notifications.add(el, n)', type: 'js', desc: '<code>{ html }</code> or <code>{ title, text, time, media, href }</code>. Rings the bell and pops the count.' },
      { name: 'Ranj.notifications.markAllRead(el)', type: 'js', desc: 'Also <code>open(el)</code> / <code>close(el)</code>.' },
      { name: '.push-stack > .push-cards > .push-card', type: 'class', desc: 'iOS-style pile. Card parts: <code>.push-icon</code> (<code>--push-icon-bg</code>), <code>.push-text</code>, <code>.push-top</code>.' },
      { name: 'Ranj.push(stack, n)', type: 'js', desc: 'Prepend a card: <code>{ title, body, time, icon, color }</code>.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ unread }</code> on the center; <code>{ count }</code> on a push stack.' }
    ]
  });
})();

;
/* docs/registry/overlays-popover.js */
(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'popover',
    name: 'Popover',
    group: 'Overlays',
    description: 'Rich, interactive content anchored to a trigger. Positioned with <code>position: fixed</code> so it escapes overflow-hidden parents, flips and shifts to stay on screen, and closes on outside click, Escape or when focus leaves.',
    tags: ['js'],
    keywords: ['floating', 'flyout', 'dropdown panel', 'callout', 'bubble'],
    demos: [
      {
        title: 'Dimensions form',
        html: `
<div class="popover" data-arrow>
  <button class="btn btn-outline" data-popover-trigger>${I.sliders} Dimensions</button>
  <div class="popover-content" style="--popover-w: 20rem">
    <div class="popover-header"><div class="popover-title">Dimensions</div><div class="popover-description">Set the dimensions for the layer.</div></div>
    <div class="demo-popover-grid">
      <label class="label" for="popover-w">Width</label><input class="input input-sm" id="popover-w" value="100%">
      <label class="label" for="popover-mw">Max. width</label><input class="input input-sm" id="popover-mw" value="300px">
      <label class="label" for="popover-h">Height</label><input class="input input-sm" id="popover-h" value="25px">
      <label class="label" for="popover-mh">Max. height</label><input class="input input-sm" id="popover-mh" value="none">
    </div>
  </div>
</div>`,
        css: `.demo-popover-grid { display: grid; grid-template-columns: 5.5rem 1fr; gap: .5rem .75rem; align-items: center; }
.demo-popover-grid .label { margin: 0; font-size: .8125rem; } .demo-popover-grid .input { height: 2rem; min-width: 0; }`
      },
      {
        title: 'Placements',
        description: '<code>data-placement</code> accepts top, right, bottom, left with optional -start / -end. It flips when there is no room.',
        html: `
${['top', 'right', 'bottom', 'left'].map(function (p) {
  return '<div class="popover" data-arrow data-placement="' + p + '"><button class="btn btn-secondary" data-popover-trigger>' + p[0].toUpperCase() + p.slice(1) + '</button><div class="popover-content popover-sm"><div class="popover-title">Placed ' + p + '</div><div class="popover-description">The arrow tracks the trigger even after shifting.</div></div></div>';
}).join('\n')}`
      },
      {
        title: 'Share with people',
        html: `
<div class="popover" data-placement="bottom-end">
  <button class="btn" data-popover-trigger>${I.share} Share</button>
  <div class="popover-content popover-lg">
    <button class="popover-close" data-popover-close aria-label="Close">${I.x}</button>
    <div class="popover-header"><div class="popover-title">Share “Q4 roadmap”</div><div class="popover-description">Anyone with the link can view.</div></div>
    <div class="demo-popover-link"><input class="input" value="northwind.app/s/q4-roadmap" readonly><button class="btn btn-secondary" data-tooltip="Copy link" id="popover-copy">${I.copy}</button></div>
    <div class="demo-popover-label">People with access</div>
    <div class="demo-popover-people">
      <div><span class="demo-ov-avatar" style="--h:15;width:30px;height:30px;font-size:11px">OM</span><span><b>Olivia Martin</b><small>olivia@northwind.app</small></span><em>Owner</em></div>
      <div><span class="demo-ov-avatar" style="--h:200;width:30px;height:30px;font-size:11px">IN</span><span><b>Isabella Nguyen</b><small>isabella@northwind.app</small></span><em>Can edit</em></div>
      <div><span class="demo-ov-avatar" style="--h:110;width:30px;height:30px;font-size:11px">WK</span><span><b>William Kim</b><small>will@northwind.app</small></span><em>Can view</em></div>
    </div>
  </div>
</div>`,
        js: `var b = root.querySelector('#popover-copy');
b.onclick = function () { b.setAttribute('data-tooltip', 'Copied!'); Ranj.tooltip.show(b); setTimeout(function () { b.setAttribute('data-tooltip', 'Copy link'); }, 1500); };`,
        css: `.demo-popover-link { display: flex; gap: .5rem; } .demo-popover-link .input { flex: 1; min-width: 0; } .demo-popover-link .btn { padding: 0; width: var(--control-h); flex-shrink: 0; } .demo-popover-link svg { width: 1rem; height: 1rem; }
.demo-popover-label { margin: 1rem 0 .5rem; font-size: .75rem; font-weight: 600; color: var(--muted-fg); }
.demo-popover-people { display: grid; gap: .65rem; }
.demo-popover-people > div { display: flex; align-items: center; gap: .65rem; }
.demo-popover-people span:nth-child(2) { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.3; }
.demo-popover-people b { font-size: .8125rem; font-weight: 600; } .demo-popover-people small { font-size: .75rem; color: var(--muted-fg); overflow: hidden; text-overflow: ellipsis; }
.demo-popover-people em { font-style: normal; font-size: .75rem; color: var(--muted-fg); }`
      },
      {
        title: 'Escapes overflow',
        description: 'Inside a clipped, scrollable box the popover still renders fully and follows its trigger while you scroll.',
        html: `
<div class="demo-popover-clip">
  <p>This box has <code>overflow: hidden auto</code>.</p>
  <div class="popover" data-arrow data-placement="right">
    <button class="btn btn-outline btn-sm" data-popover-trigger>${I.info} Details</button>
    <div class="popover-content popover-sm"><div class="popover-title">Not clipped</div><div class="popover-description">Fixed positioning + flip + shift.</div></div>
  </div>
  <p style="height:180px"></p>
</div>`,
        css: `.demo-popover-clip { width: 15rem; height: 8rem; overflow: hidden auto; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1rem; background: var(--card); font-size: .8125rem; color: var(--muted-fg); }
.demo-popover-clip p { margin-bottom: .75rem; } .demo-popover-clip code { font-family: var(--font-mono); font-size: .9em; }`
      }
    ],
    api: [
      { name: '.popover', type: 'class', desc: 'Wrapper holding a <code>[data-popover-trigger]</code> and a <code>.popover-content</code>.' },
      { name: '.popover-content', type: 'class', desc: 'The panel. Parts: <code>.popover-header .popover-title .popover-description .popover-footer .popover-close</code>. Sizes <code>.popover-sm / -lg</code>, <code>.popover-flush</code> removes padding.' },
      { name: 'data-placement', type: 'attr', default: 'bottom', desc: 'On <code>.popover</code>: side and alignment.' },
      { name: 'data-offset', type: 'attr', default: '8', desc: 'Gap in px.' },
      { name: 'data-arrow', type: 'attr', desc: 'Adds an arrow that points at the trigger.' },
      { name: 'data-trigger="hover"', type: 'attr', default: 'click', desc: 'Open on hover/focus instead of click.' },
      { name: 'data-popover-target="id"', type: 'attr', desc: 'Standalone trigger for a <code>.popover-content</code> elsewhere in the page.' },
      { name: 'data-popover-close', type: 'attr', desc: 'Inside content: closes the popover.' },
      { name: '--popover-w', type: 'var', default: '20rem', desc: 'Max width.' },
      { name: 'Ranj.popover.open(el) / close(el) / toggle(el)', type: 'js', desc: 'Programmatic control.' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On <code>.popover</code>. Close detail: <code>{ reason }</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-sheet.js */
(function () {
  var I = window.__ovI;
  var close = '<button class="dialog-close" data-dialog-close aria-label="Close">' + I.x + '</button>';
  var cart = [['Linen overshirt', 'Sand · M', '$98', 30], ['Merino crew socks', 'Charcoal · 2 pack', '$24', 250], ['Canvas weekender', 'Olive', '$145', 120]].map(function (c) {
    return '<div class="demo-sheet-row"><i style="--h:' + c[3] + '"></i><span><b>' + c[0] + '</b><small>' + c[1] + '</small></span><em>' + c[2] + '</em></div>';
  }).join('');
  RanjDocs.add({
    id: 'sheet',
    name: 'Sheet',
    group: 'Overlays',
    description: 'A panel that slides in from any edge of the screen. Built on the dialog engine, so focus trapping, Escape, scroll lock and exit animations come for free.',
    tags: ['js'],
    keywords: ['side panel', 'slide over', 'offcanvas', 'flyout', 'drawer'],
    demos: [
      {
        title: 'Sides',
        html: `
<button class="btn btn-outline" data-sheet-open="sheet-right">Right</button>
<button class="btn btn-outline" data-sheet-open="sheet-left">Left</button>
<button class="btn btn-outline" data-sheet-open="sheet-top">Top</button>
<button class="btn btn-outline" data-sheet-open="sheet-bottom">Bottom</button>

<div class="dialog-overlay" id="sheet-right"><div class="sheet">
  <div class="sheet-header"><h2 class="sheet-title">Edit profile</h2><p class="sheet-description">Changes are saved to your public profile.</p></div>
  <div class="sheet-body demo-sheet-form">
    <label class="label">Display name</label><input class="input" value="Sofia Marquez">
    <label class="label">Title</label><input class="input" value="Staff Product Designer">
    <label class="label">Bio</label><textarea class="input" rows="4">Designing calm software at Northwind. Previously Linear & Figma.</textarea>
  </div>
  <div class="sheet-footer"><button class="btn btn-outline" data-dialog-close>Cancel</button><button class="btn" data-dialog-close>Save</button></div>${close}
</div></div>
<div class="dialog-overlay" id="sheet-left"><div class="sheet sheet-left sheet-sm">
  <div class="sheet-header"><h2 class="sheet-title">Northwind</h2></div>
  <nav class="sheet-body demo-sheet-nav">
    <a href="#" aria-current="page">${I.home} Home</a><a href="#">${I.inbox} Inbox <em>12</em></a><a href="#">${I.calendar} Calendar</a><a href="#">${I.users} Team</a><a href="#">${I.settings} Settings</a>
  </nav>${close}
</div></div>
<div class="dialog-overlay" id="sheet-top"><div class="sheet sheet-top">
  <div class="sheet-header"><h2 class="sheet-title">${I.sparkles} What's new in 4.2</h2><p class="sheet-description">Realtime cursors, a faster search index and 31 fixes.</p></div>
  <div class="sheet-footer"><button class="btn" data-dialog-close>Got it</button></div>${close}
</div></div>
<div class="dialog-overlay" id="sheet-bottom"><div class="sheet sheet-bottom">
  <div class="sheet-header"><h2 class="sheet-title">Cookie preferences</h2><p class="sheet-description">We use essential cookies to make Northwind work, and optional ones to understand usage.</p></div>
  <div class="sheet-footer"><button class="btn btn-outline" data-dialog-close>Essential only</button><button class="btn" data-dialog-close>Accept all</button></div>${close}
</div></div>`,
        css: `.demo-sheet-form { display: flex; flex-direction: column; gap: .4rem; } .demo-sheet-form .label { margin-top: .6rem; } .demo-sheet-form .label:first-child { margin-top: 0; } .demo-sheet-form textarea { height: auto; padding-top: .5rem; resize: vertical; }
.demo-sheet-nav { display: flex; flex-direction: column; gap: .15rem; padding-top: 0; }
.demo-sheet-nav a { display: flex; align-items: center; gap: .75rem; padding: .55rem .7rem; border-radius: var(--radius); color: var(--muted-fg); font-size: .875rem; font-weight: 500; }
.demo-sheet-nav a:hover { background: var(--muted); color: var(--fg); text-decoration: none; }
.demo-sheet-nav a[aria-current] { background: var(--muted); color: var(--fg); }
.demo-sheet-nav svg { width: 1.05rem; height: 1.05rem; } .demo-sheet-nav em { margin-left: auto; font-style: normal; font-size: .75rem; }
.sheet-title svg { display: inline; width: 1rem; height: 1rem; vertical-align: -2px; color: var(--primary); }`
      },
      {
        title: 'Floating cart',
        description: '<code>.sheet-floating</code> insets the panel with rounded corners.',
        html: `
<button class="btn" data-sheet-open="sheet-cart">${I.bag} Cart · 3</button>

<div class="dialog-overlay" id="sheet-cart"><div class="sheet sheet-floating">
  <div class="sheet-header"><h2 class="sheet-title">Your cart</h2><p class="sheet-description">Free shipping on orders over $150.</p></div>
  <div class="sheet-body">${cart}
    <div class="demo-sheet-total"><span>Subtotal</span><b>$267.00</b></div>
  </div>
  <div class="sheet-footer"><button class="btn" style="width:100%" data-dialog-close>Checkout</button></div>${close}
</div></div>`,
        css: `.demo-sheet-row { display: flex; align-items: center; gap: .875rem; padding: .75rem 0; border-bottom: 1px solid var(--border); }
.demo-sheet-row i { width: 3.5rem; height: 3.5rem; border-radius: var(--radius); background: linear-gradient(135deg, oklch(.85 .06 var(--h)), oklch(.7 .1 calc(var(--h) + 40))); flex-shrink: 0; }
.demo-sheet-row span { flex: 1; display: flex; flex-direction: column; font-size: .875rem; line-height: 1.35; } .demo-sheet-row small { color: var(--muted-fg); font-size: .75rem; }
.demo-sheet-row em { font-style: normal; font-weight: 600; font-size: .875rem; }
.demo-sheet-total { display: flex; justify-content: space-between; padding-top: 1rem; font-size: .9375rem; }`
      }
    ],
    api: [
      { name: '.sheet', type: 'class', desc: 'Panel inside a <code>.dialog-overlay</code> (or, v1-style, as the overlay\'s next sibling). Slides in from the right.' },
      { name: '.sheet-left / -top / -bottom', type: 'class', desc: 'Other edges.' },
      { name: '.sheet-sm / -lg / -xl', type: 'class', desc: '20 / 32 / 42rem.' },
      { name: '.sheet-floating', type: 'class', desc: 'Inset, rounded card.' },
      { name: '.sheet-header / -body / -footer', type: 'class', desc: 'Parts, plus <code>.sheet-title</code> and <code>.sheet-description</code>. The body scrolls.' },
      { name: '--sheet-size', type: 'var', default: '24rem', desc: 'Width (left/right) or max height (top/bottom).' },
      { name: 'data-sheet-open="id"', type: 'attr', desc: 'Alias of <code>data-dialog-open</code>. Close with <code>data-dialog-close</code>.' },
      { name: 'Ranj.sheet.open(id) / close(id)', type: 'js', desc: 'Same as <code>Ranj.dialog</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-sidebar.js */
(function () {
  var I = window.__ovI;
  function it(icon, label, extra, attrs) { return '<a class="sidebar-item" href="#"' + (attrs || '') + '>' + I[icon] + '<span class="sidebar-item-text">' + label + '</span>' + (extra || '') + '</a>'; }
  var sidebar = `
  <aside class="sidebar" id="sidebar-app">
    <div class="sidebar-header">
      <a class="sidebar-brand" href="#"><span class="sidebar-logo">${I.layers}</span><span class="sidebar-brand-text">Acme Inc.<small>Enterprise</small></span></a>
    </div>
    <div class="sidebar-content">
      <div class="sidebar-group">
        <div class="sidebar-label">Platform</div>
        ${it('home', 'Dashboard', '', ' aria-current="page"')}
        ${it('inbox', 'Inbox', '<span class="sidebar-badge">12</span>')}
        ${it('chart', 'Analytics')}
        <div class="sidebar-sub" data-state="open">
          <button class="sidebar-item">${I.folder}<span class="sidebar-item-text">Projects</span></button>
          <div class="sidebar-sub-content"><div>
            <a class="sidebar-item" href="#"><span class="sidebar-item-text">Atlas redesign</span></a>
            <a class="sidebar-item" href="#"><span class="sidebar-item-text">Mobile app</span></a>
            <a class="sidebar-item" href="#"><span class="sidebar-item-text">Billing v2</span></a>
          </div></div>
        </div>
        ${it('calendar', 'Calendar')}
      </div>
      <div class="sidebar-group">
        <div class="sidebar-label">Team</div>
        ${it('users', 'Members', '<span class="sidebar-badge sidebar-badge-muted">24</span>')}
        ${it('settings', 'Settings', '<span class="sidebar-kbd">⌘,</span>')}
      </div>
    </div>
    <div class="sidebar-footer">
      <div class="sidebar-user"><span class="demo-ov-avatar" style="--h:20;width:32px;height:32px;font-size:12px;flex-shrink:0">SC</span><span class="sidebar-user-text"><b>Sofia Chen</b><small>sofia@acme.co</small></span></div>
    </div>
  </aside>
  <div class="sidebar-backdrop"></div>`;
  RanjDocs.add({
    id: 'sidebar',
    name: 'Sidebar',
    group: 'Navigation',
    description: 'Application navigation with groups, icons, badges and nested sections. Collapses to an icon rail with automatic tooltips, and becomes an off-canvas drawer when its layout is narrow (container query, so it adapts inside any panel).',
    tags: ['js'],
    keywords: ['app shell', 'side nav', 'drawer', 'navigation rail', 'dashboard layout'],
    demos: [
      {
        title: 'App shell',
        description: 'Use the toggle to collapse to a rail; hover the icons for tooltips. Narrow the window (or view on a phone) and it turns into a drawer.',
        pad: false, center: false, height: 520,
        html: `
<div class="sidebar-shell demo-sb" >
  ${sidebar}
  <main class="sidebar-main">
    <div class="demo-sb-top"><button class="sidebar-trigger" data-sidebar-toggle="sidebar-app" aria-label="Toggle sidebar">${I.panel}</button><span class="demo-sb-crumb">Acme Inc. <i>/</i> <b>Dashboard</b></span></div>
    <div class="demo-sb-body">
      <div class="demo-sb-cards"><div></div><div></div><div></div></div>
      <div class="demo-sb-big"></div>
    </div>
  </main>
</div>`,
        js: `var crumb = root.querySelector('.demo-sb-crumb b');
root.querySelector('.sidebar').addEventListener('ranj:change', function (e) { if (e.detail.value) crumb.textContent = e.detail.value; });`,
        css: `.demo-sb { height: 520px; }
.demo-sb-top { display: flex; align-items: center; gap: .5rem; height: 3.5rem; padding: 0 1rem; border-bottom: 1px solid var(--border); }
.demo-sb-crumb { font-size: .8125rem; color: var(--muted-fg); } .demo-sb-crumb i { font-style: normal; margin: 0 .25rem; opacity: .5; } .demo-sb-crumb b { color: var(--fg); font-weight: 500; }
.demo-sb-body { flex: 1; display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }
.demo-sb-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; } .demo-sb-cards div { aspect-ratio: 16/10; border-radius: var(--radius-lg); background: var(--muted); }
.demo-sb-big { flex: 1; border-radius: var(--radius-lg); background: var(--muted); opacity: .6; }`
      },
      {
        title: 'Phone width',
        description: 'The same sidebar inside a 360px layout is off-canvas: the toggle slides it in over a backdrop; Escape or a tap outside closes it.',
        pad: false, height: 520,
        html: `
<div class="sidebar-shell demo-sb demo-sb-phone">
  ${sidebar.replace('id="sidebar-app"', 'id="sidebar-phone"')}
  <main class="sidebar-main">
    <div class="demo-sb-top"><button class="sidebar-trigger" data-sidebar-toggle="sidebar-phone" aria-label="Open navigation">${I.menu}</button><span class="demo-sb-crumb"><b>Dashboard</b></span></div>
    <div class="demo-sb-body"><div class="demo-sb-cards" style="grid-template-columns:1fr 1fr"><div></div><div></div></div><div class="demo-sb-big"></div></div>
  </main>
</div>`,
        css: `.demo-sb-phone { width: min(360px, calc(100vw - 2rem)); height: 480px; margin: 1.25rem 0; border: 1px solid var(--border); border-radius: 1.75rem; box-shadow: var(--shadow-lg); }`
      }
    ],
    api: [
      { name: '.sidebar-shell', type: 'class', desc: 'Flex container holding <code>.sidebar</code>, an optional <code>.sidebar-backdrop</code> and <code>.sidebar-main</code>. Below 40rem wide the sidebar goes off-canvas.' },
      { name: '.sidebar', type: 'class', desc: 'Parts: <code>.sidebar-header</code>, <code>.sidebar-content</code> (groups), <code>.sidebar-footer</code>, <code>.sidebar-brand</code>, <code>.sidebar-user</code>.' },
      { name: '.sidebar-group / .sidebar-label', type: 'class', desc: 'Section with a small caps heading.' },
      { name: '.sidebar-item', type: 'class', desc: 'Link/button with an svg icon and <code>.sidebar-item-text</code>; <code>aria-current="page"</code> for the active one. Adornments: <code>.sidebar-badge</code>, <code>.sidebar-kbd</code>, <code>.sidebar-dot</code>.' },
      { name: '.sidebar-sub', type: 'class', desc: 'Nested section: first <code>.sidebar-item</code> toggles a <code>.sidebar-sub-content</code> (one wrapper div inside).' },
      { name: '.sidebar-collapsed', type: 'class', desc: 'Icon rail (v1 class). Items get tooltips automatically.' },
      { name: 'data-sidebar-toggle="id"', type: 'attr', desc: 'Collapses / expands, or opens off-canvas on narrow layouts. <code>.sidebar-trigger</code> styles an icon button.' },
      { name: 'data-persist="key"', type: 'attr', desc: 'Remember the collapsed state in localStorage.' },
      { name: '--sidebar-w / --sidebar-rail', type: 'var', default: '16rem / 3.75rem', desc: 'Expanded and rail widths.' },
      { name: 'Ranj.sidebar.toggle(el) / collapse(el) / expand(el)', type: 'js', desc: 'Programmatic control.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ collapsed }</code> or <code>{ item, value }</code> when an item is selected.' }
    ]
  });
})();

;
/* docs/registry/overlays-stepper.js */
(function () {
  var I = window.__ovI;
  function step(t, d, icon) { return '<li class="stepper-item"><span class="stepper-indicator">' + (icon ? I[icon] : '') + '</span><div class="stepper-text"><span class="stepper-title">' + t + '</span>' + (d ? '<span class="stepper-desc">' + d + '</span>' : '') + '</div></li>'; }
  RanjDocs.add({
    id: 'stepper',
    name: 'Stepper',
    group: 'Navigation',
    description: 'Shows progress through a multi-step flow. Completed steps get an animated check and the connector fills as you advance; steps can be clickable, and next/back buttons and panels wire up with attributes.',
    tags: ['js', 'new'],
    keywords: ['steps', 'wizard', 'progress', 'checkout steps', 'onboarding', 'timeline'],
    demos: [
      {
        title: 'Checkout wizard',
        center: false,
        html: `
<div class="demo-step-wrap">
  <ol class="stepper" id="stepper-checkout" data-current="1" data-clickable>
    ${step('Cart', '3 items')}${step('Shipping', 'Address & speed')}${step('Payment', 'Card or wallet')}${step('Review', 'Confirm order')}
  </ol>
  <div class="demo-step-panel" data-stepper-panels="stepper-checkout">
    <div data-step-panel="0"><b>Your cart</b><p>Linen overshirt, Merino socks, Canvas weekender · $267.00</p></div>
    <div data-step-panel="1"><b>Shipping</b><p>Deliver to 221B Baker Street, London. Express (2 days) selected.</p></div>
    <div data-step-panel="2"><b>Payment</b><p>Visa ending 4242 · billing address same as shipping.</p></div>
    <div data-step-panel="3"><b>Review</b><p>Everything look right? You won't be charged until you place the order.</p></div>
    <div data-step-panel="4"><b>${I.svg('checkCircle', 18, 'style="display:inline;vertical-align:-3px;color:var(--success)"')} Order placed</b><p>Confirmation #NW-88412 sent to your inbox.</p></div>
  </div>
  <div class="demo-step-btns">
    <button class="btn btn-outline" data-stepper-prev="stepper-checkout">Back</button>
    <button class="btn" data-stepper-next="stepper-checkout" data-last-label="Place order"><span data-label>Continue</span></button>
  </div>
</div>`,
        css: `.demo-step-wrap { max-width: 40rem; margin: 0 auto; display: grid; gap: 1.5rem; }
.demo-step-panel > div { padding: 1rem 1.25rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); animation: r-slide-up .35s var(--ease-out); }
.demo-step-panel b { font-size: .9375rem; } .demo-step-panel p { color: var(--muted-fg); font-size: .875rem; margin-top: .2rem; }
.demo-step-btns { display: flex; justify-content: space-between; }`
      },
      {
        title: 'Vertical with icons',
        description: 'Steps can carry an icon; an error state flags a step that needs attention.',
        html: `
<ol class="stepper stepper-vertical" id="stepper-deploy" data-current="2" style="max-width: 22rem">
  <li class="stepper-item"><span class="stepper-indicator">${I.code}</span><div class="stepper-text"><span class="stepper-title">Build</span><span class="stepper-desc">Compiled in 38s</span></div></li>
  <li class="stepper-item"><span class="stepper-indicator">${I.shield}</span><div class="stepper-text"><span class="stepper-title">Security scan</span><span class="stepper-desc">0 vulnerabilities</span></div></li>
  <li class="stepper-item"><span class="stepper-indicator">${I.globe}</span><div class="stepper-text"><span class="stepper-title">Deploy to edge</span><span class="stepper-desc">Propagating to 34 regions…</span><div class="stepper-body"><button class="btn btn-sm" id="stepper-deploy-ok">Mark done</button> <button class="btn btn-sm btn-outline" id="stepper-deploy-err">Simulate error</button></div></div></li>
  <li class="stepper-item"><span class="stepper-indicator">${I.checkCircle}</span><div class="stepper-text"><span class="stepper-title">Live</span><span class="stepper-desc">northwind.app</span></div></li>
</ol>`,
        js: `var s = Ranj.stepper(root.querySelector('#stepper-deploy'));
root.querySelector('#stepper-deploy-ok').onclick = function () { s.next(); };
root.querySelector('#stepper-deploy-err').onclick = function () { s.error(2); };`
      },
      {
        title: 'Compact, left-aligned',
        center: false,
        html: `<ol class="stepper stepper-start stepper-sm" data-current="2" data-clickable="all" style="max-width: 36rem; margin: 0 auto">${step('Account')}${step('Workspace')}${step('Invite team')}${step('Done')}</ol>`
      }
    ],
    api: [
      { name: '.stepper > .stepper-item', type: 'class', desc: 'Steps. Each has a <code>.stepper-indicator</code> (empty → number, or an svg) and <code>.stepper-text</code> with <code>.stepper-title</code> / <code>.stepper-desc</code>; <code>.stepper-body</code> shows only on the current step.' },
      { name: '.stepper-vertical / -start / -sm', type: 'class', desc: 'Vertical layout, left-aligned horizontal layout, compact size.' },
      { name: 'data-current', type: 'attr', default: '0', desc: '0-based current step; equal to the step count means all done.' },
      { name: 'data-clickable', type: 'attr', desc: 'Click/Enter completed steps to go back; <code>="all"</code> allows any step.' },
      { name: 'data-stepper-next / -prev="id"', type: 'attr', desc: 'Buttons that drive a stepper (disabled at the ends). <code>data-last-label</code> renames Next on the last step.' },
      { name: 'data-stepper-panels="id" + data-step-panel="n"', type: 'attr', desc: 'Panels shown for the current step.' },
      { name: '--step-size / --step-line', type: 'var', default: '2rem / 2px', desc: 'Indicator size and connector thickness.' },
      { name: 'Ranj.stepper(el)', type: 'js', desc: '→ <code>{ next(), prev(), go(i), error(i, on?), index }</code>.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ index, total, done }</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-tabs.js */
(function () {
  var I = window.__ovI;
  function panel(v, html) { return '<div class="tab-panel" data-tab-panel="' + v + '">' + html + '</div>'; }
  var account = '<div class="demo-tabs-card"><b>Account</b><p>Make changes to your account here. Click save when you\'re done.</p><label class="label">Name</label><input class="input" value="Pedro Duarte"><label class="label">Username</label><input class="input" value="@peduarte"><button class="btn btn-sm" style="justify-self:start;margin-top:.5rem">Save changes</button></div>';
  var password = '<div class="demo-tabs-card"><b>Password</b><p>Change your password here. After saving, you\'ll be logged out.</p><label class="label">Current password</label><input class="input" type="password" value="hunter22"><label class="label">New password</label><input class="input" type="password"><button class="btn btn-sm" style="justify-self:start;margin-top:.5rem">Save password</button></div>';
  RanjDocs.add({
    id: 'tabs',
    name: 'Tabs',
    group: 'Navigation',
    description: 'Switch between related panels. A sliding indicator glides to the selected tab in every style (underline, pills, segmented, vertical); arrow keys move and select; panels can render lazily on first open. v1 markup keeps working.',
    tags: ['js'],
    keywords: ['tab bar', 'segmented control', 'tablist', 'switcher'],
    demos: [
      {
        title: 'Underline',
        center: false,
        html: `
<div class="tabs" style="max-width: 32rem; margin: 0 auto">
  <div class="tabs-list">
    <button class="tabs-trigger" data-tab="overview" aria-selected="true">${I.layout} Overview</button>
    <button class="tabs-trigger" data-tab="activity">${I.chart} Activity <span class="tabs-badge">12</span></button>
    <button class="tabs-trigger" data-tab="settings">${I.settings} Settings</button>
    <button class="tabs-trigger" data-tab="billing" disabled>${I.card} Billing</button>
  </div>
  <div class="tabs-content">
    ${panel('overview', '<div class="demo-tabs-stats"><div><small>Visitors</small><b>24.8k</b><em>+18%</em></div><div><small>Conversion</small><b>3.42%</b><em>+0.4%</em></div><div><small>Revenue</small><b>$9,120</b><em>+12%</em></div></div>')}
    ${panel('activity', '<ul class="demo-tabs-feed"><li><span class="demo-ov-avatar" style="--h:20;width:26px;height:26px;font-size:10px">AK</span><span><b>Alex Kim</b> merged <code>#482</code> into main</span><small>2m</small></li><li><span class="demo-ov-avatar" style="--h:170;width:26px;height:26px;font-size:10px">JS</span><span><b>Jo Silva</b> opened an issue</span><small>1h</small></li><li><span class="demo-ov-avatar" style="--h:300;width:26px;height:26px;font-size:10px">RT</span><span><b>Ravi Tan</b> deployed v2.3.0</span><small>3h</small></li></ul>')}
    ${panel('settings', '<p class="demo-tabs-p">Project settings live here: domains, environment variables and access control.</p>')}
    ${panel('billing', '<p class="demo-tabs-p">Billing</p>')}
  </div>
</div>`,
        css: `.demo-tabs-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; }
.demo-tabs-stats div { display: flex; flex-direction: column; padding: .85rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); }
.demo-tabs-stats small { color: var(--muted-fg); font-size: .75rem; } .demo-tabs-stats b { font-size: 1.35rem; letter-spacing: -.02em; } .demo-tabs-stats em { font-style: normal; font-size: .75rem; color: var(--success); }
.demo-tabs-feed { list-style: none; display: grid; gap: .25rem; }
.demo-tabs-feed li { display: flex; align-items: center; gap: .625rem; padding: .5rem; border-radius: var(--radius); font-size: .8438rem; color: var(--muted-fg); }
.demo-tabs-feed li:hover { background: var(--muted); } .demo-tabs-feed b { color: var(--fg); font-weight: 600; } .demo-tabs-feed span:nth-child(2) { flex: 1; } .demo-tabs-feed small { font-size: .72rem; }
.demo-tabs-feed code { font-family: var(--font-mono); font-size: .8em; }
.demo-tabs-p { color: var(--muted-fg); font-size: .875rem; }
@media (max-width: 480px) { .demo-tabs-stats { grid-template-columns: 1fr 1fr; } }`
      },
      {
        title: 'Segmented (enclosed)',
        description: 'The shadcn classic. Add <code>.tabs-full</code> to stretch the triggers.',
        center: false,
        html: `
<div class="tabs tabs-enclosed tabs-full" style="max-width: 25rem; margin: 0 auto">
  <div class="tabs-list">
    <button class="tabs-trigger" data-tab="account">Account</button>
    <button class="tabs-trigger" data-tab="password">Password</button>
  </div>
  <div class="tabs-content">
    ${panel('account', account)}
    ${panel('password', password)}
  </div>
</div>`,
        css: `.demo-tabs-card { display: grid; gap: .45rem; padding: 1.25rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); }
.demo-tabs-card b { font-size: 1rem; } .demo-tabs-card p { color: var(--muted-fg); font-size: .8125rem; margin-bottom: .5rem; } .demo-tabs-card .label { margin: .25rem 0 0; font-size: .8125rem; }`
      },
      {
        title: 'Pills',
        html: `
<div class="tabs tabs-pills">
  <div class="tabs-list">
    <button class="tabs-trigger">All</button>
    <button class="tabs-trigger">Design <span class="tabs-badge">8</span></button>
    <button class="tabs-trigger">Engineering</button>
    <button class="tabs-trigger">Marketing</button>
    <button class="tabs-trigger">Sales</button>
  </div>
</div>`
      },
      {
        title: 'Vertical & lazy panels',
        description: 'Panels with <code>data-lazy</code> render their <code>&lt;template&gt;</code> the first time they open. Becomes horizontal on phones.',
        center: false,
        html: `
<div class="tabs tabs-vertical tabs-pills" style="max-width: 36rem; margin: 0 auto">
  <div class="tabs-list">
    <button class="tabs-trigger" data-tab="general">${I.settings} General</button>
    <button class="tabs-trigger" data-tab="security">${I.shield} Security</button>
    <button class="tabs-trigger" data-tab="notifications">${I.bell} Notifications</button>
    <button class="tabs-trigger" data-tab="integrations">${I.layers} Integrations</button>
  </div>
  <div class="tabs-content">
    <div class="tab-panel" data-tab-panel="general"><h4 class="demo-tabs-h">General</h4><p class="demo-tabs-p">Workspace name, URL and default language.</p></div>
    <div class="tab-panel" data-tab-panel="security" data-lazy><template><h4 class="demo-tabs-h">Security</h4><p class="demo-tabs-p">Loaded lazily at <b id="tabs-lazy-time"></b>. Enforce SSO, 2FA and session length.</p></template></div>
    <div class="tab-panel" data-tab-panel="notifications"><h4 class="demo-tabs-h">Notifications</h4><p class="demo-tabs-p">Choose what lands in your inbox and what stays in the app.</p></div>
    <div class="tab-panel" data-tab-panel="integrations"><h4 class="demo-tabs-h">Integrations</h4><p class="demo-tabs-p">Slack, GitHub, Linear, Figma and 40 more.</p></div>
  </div>
</div>`,
        js: `root.querySelector('.tabs').addEventListener('ranj:change', function (e) {
  var t = root.querySelector('#tabs-lazy-time'); if (t && !t.textContent) t.textContent = new Date().toLocaleTimeString();
});`,
        css: `.demo-tabs-h { font-size: 1rem; font-weight: 600; margin-bottom: .25rem; }`
      }
    ],
    api: [
      { name: '.tabs > .tabs-list > .tabs-trigger', type: 'class', desc: 'Triggers (buttons). <code>.tabs-badge</code> for counts.' },
      { name: '.tab-panel[data-tab-panel]', type: 'class', desc: 'Panels, matched to triggers by <code>data-tab</code> (or by order). Wrap in <code>.tabs-content</code>.' },
      { name: '.tabs-pills / -enclosed / -vertical', type: 'class', desc: 'Styles; combine <code>.tabs-vertical.tabs-pills</code>. <code>.tabs-full</code> stretches, <code>.tabs-sm / -lg</code> sizes.' },
      { name: 'aria-selected="true"', type: 'attr', desc: 'Initially selected trigger (or <code>data-default</code> on <code>.tabs</code>).' },
      { name: 'data-activation="manual"', type: 'attr', desc: 'Arrows move focus only; Enter/Space selects.' },
      { name: 'data-lazy', type: 'attr', desc: 'On a panel: render its <code>&lt;template&gt;</code> on first activation (fires <code>ranj:load</code>).' },
      { name: 'data-indicator="false"', type: 'attr', desc: 'Disable the sliding indicator.' },
      { name: 'Ranj.tabs.select(el, value)', type: 'js', desc: 'Select by value or index.' },
      { name: 'ranj:change', type: 'event', desc: '<code>{ value, index, trigger }</code> on <code>.tabs</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-toast.js */
(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'toast',
    name: 'Toast',
    group: 'Feedback',
    description: 'Sonner-quality notifications. Toasts stack into a tidy pile, fan out on hover (pausing their timers), swipe away sideways, and come in success, error, warning, info and loading flavors, with actions, promise tracking, six positions and a polite live region.',
    tags: ['js'],
    keywords: ['notification', 'snackbar', 'sonner', 'alert', 'message', 'flash'],
    demos: [
      {
        title: 'Types',
        description: 'Fire a few in a row, then hover the stack to expand it.',
        html: `
<button class="btn btn-outline" id="toast-default">Default</button>
<button class="btn btn-outline" id="toast-success">${I.checkCircle} Success</button>
<button class="btn btn-outline" id="toast-error">${I.alertCircle} Error</button>
<button class="btn btn-outline" id="toast-warning">${I.alert} Warning</button>
<button class="btn btn-outline" id="toast-info">${I.info} Info</button>
<button class="btn btn-outline" id="toast-loading">Loading</button>`,
        js: `var $ = function (s) { return root.querySelector(s); };
$('#toast-default').onclick = function () { Ranj.toast('Event has been created', { description: 'Sunday, December 03, 2026 at 9:00 AM' }); };
$('#toast-success').onclick = function () { Ranj.toast.success('Payment received', { description: '$2,400.00 from Lumen Studio · Invoice #1042' }); };
$('#toast-error').onclick = function () { Ranj.toast.error('Upload failed', { description: 'brand-video.mp4 exceeds the 2 GB limit.' }); };
$('#toast-warning').onclick = function () { Ranj.toast.warning('Storage almost full', { description: 'You have used 9.4 GB of 10 GB.' }); };
$('#toast-info').onclick = function () { Ranj.toast.info('New version available', { description: 'Reload to get v4.2.1.' }); };
$('#toast-loading').onclick = function () { var id = Ranj.toast.loading('Syncing 248 contacts…'); setTimeout(function () { Ranj.toast.update(id, { type: 'success', title: 'Contacts synced', description: '248 contacts are up to date.' }); }, 2200); };`
      },
      {
        title: 'Promise',
        description: '<code>Ranj.toast.promise()</code> shows a loading state and morphs into success or error when the promise settles.',
        html: `
<button class="btn" id="toast-promise-ok">${I.rocket} Deploy</button>
<button class="btn btn-outline" id="toast-promise-fail">${I.upload} Publish (fails)</button>`,
        js: `function wait(ms, fail) { return new Promise(function (res, rej) { setTimeout(function () { fail ? rej(new Error('Build step "lint" exited with code 1')) : res({ url: 'northwind-git-main.vercel.app' }); }, ms); }); }
root.querySelector('#toast-promise-ok').onclick = function () {
  Ranj.toast.promise(wait(2000), { loading: 'Deploying northwind-web…', success: function (r) { return { title: 'Deployed in 41s', description: r.url }; }, error: 'Deploy failed' });
};
root.querySelector('#toast-promise-fail').onclick = function () {
  Ranj.toast.promise(wait(1600, true), { loading: 'Publishing changelog…', success: 'Published', error: function (e) { return { title: 'Publish failed', description: e.message }; } });
};`
      },
      {
        title: 'Actions & rich colors',
        html: `
<button class="btn btn-outline" id="toast-undo">${I.trash} Delete message</button>
<button class="btn btn-outline" id="toast-invite">${I.userPlus} Invite request</button>
<button class="btn btn-outline" id="toast-rich">${I.sparkles} Rich colors</button>`,
        js: `root.querySelector('#toast-undo').onclick = function () {
  Ranj.toast('Message deleted', { description: 'Moved to Trash.', action: { label: 'Undo', onClick: function () { Ranj.toast.success('Message restored'); } } });
};
root.querySelector('#toast-invite').onclick = function () {
  Ranj.toast('Priya Raman wants to join Design', { description: 'priya@acme.co · requested 2 min ago', duration: 8000,
    cancel: { label: 'Decline' }, action: { label: 'Approve', onClick: function () { Ranj.toast.success('Priya joined Design'); } } });
};
var n = 0;
root.querySelector('#toast-rich').onclick = function () {
  var t = ['success', 'error', 'warning', 'info'][n++ % 4];
  var copy = { success: ['Backup complete', '14.2 GB archived to cold storage.'], error: ['Card declined', 'Your bank rejected the charge of $49.00.'], warning: ['Unusual sign-in', 'New login from Lisbon, Portugal.'], info: ['Scheduled maintenance', 'Saturday 02:00–03:00 UTC.'] }[t];
  Ranj.toast({ type: t, title: copy[0], description: copy[1], rich: true });
};`
      },
      {
        title: 'Positions',
        html: `
<div class="demo-toast-pos">
  ${['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(function (p) { return '<button class="btn btn-secondary btn-sm" data-toast="Saved to ' + p + '" data-toast-description="Toasts from each corner keep their own stack." data-toast-position="' + p + '">' + p + '</button>'; }).join('')}
</div>`,
        css: `.demo-toast-pos { display: grid; grid-template-columns: repeat(3, auto); gap: .5rem; } @media (max-width: 480px) { .demo-toast-pos { grid-template-columns: repeat(2, auto); } }`
      },
      {
        title: 'Static preview',
        description: 'The same styles render inline with <code>.toast.toast-static</code>, handy for layouts and empty states.',
        html: `
<div class="demo-toast-static">
  <div class="toast toast-static toast-success"><div class="toast-icon">${'<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.7 7.7a1 1 0 0 0-1.4-1.4L10.5 13l-1.8-1.8a1 1 0 1 0-1.4 1.4l2.5 2.5a1 1 0 0 0 1.4 0l5.5-5.4Z" clip-rule="evenodd"/></svg>'}</div><div class="toast-content"><div class="toast-title">Changes saved</div><div class="toast-description">Your workspace settings are up to date.</div></div></div>
  <div class="toast toast-static"><div class="toast-content"><div class="toast-title">Archived 3 conversations</div></div><div class="toast-actions"><button class="toast-action">Undo</button></div></div>
  <div class="toast toast-static toast-error toast-rich"><div class="toast-icon">${'<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5a1 1 0 0 1 1 1v4.5a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm0 8.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" clip-rule="evenodd"/></svg>'}</div><div class="toast-content"><div class="toast-title">Connection lost</div><div class="toast-description">Retrying in 5 seconds…</div></div></div>
</div>`,
        css: `.demo-toast-static { display: grid; gap: .75rem; width: min(22.5rem, calc(100vw - 4rem)); }`
      }
    ],
    api: [
      { name: 'Ranj.toast(title | opts, opts?)', type: 'js', desc: 'Shows a toast, returns its id. opts: <code>title, description, type, duration (4000), position, action {label, onClick}, cancel, icon, avatar, rich, progress, closeButton, dismissible, html, id, onDismiss, onAutoClose</code>.' },
      { name: 'Ranj.toast.success / error / warning / info / loading', type: 'js', desc: '<code>(title, opts)</code> shortcuts. Loading toasts stay until updated.' },
      { name: 'Ranj.toast.promise(p, msgs)', type: 'js', desc: '<code>{ loading, success, error }</code>; success/error may be strings, <code>{title, description}</code> or functions of the result.' },
      { name: 'Ranj.toast.update(id, opts)', type: 'js', desc: 'Morph an existing toast (also: pass the same <code>id</code> again).' },
      { name: 'Ranj.toast.dismiss(id?)', type: 'js', desc: 'Dismiss one, or all when no id.' },
      { name: 'Ranj.toast.config(opts)', type: 'js', desc: 'Defaults: <code>position, duration, visible (3), gap, rich, closeButton, expand, progress, max (8)</code>.' },
      { name: 'data-toast="title"', type: 'attr', desc: 'Declarative trigger; add <code>data-toast-type</code>, <code>-description</code>, <code>-position</code>, <code>-duration</code>.' },
      { name: '.toast-static', type: 'class', desc: 'Render a toast inline (no stack, no timer).' },
      { name: '--toast-w / --toast-offset', type: 'var', default: '22.5rem / 1.5rem', desc: 'On <code>.toaster</code>: width and distance from the edge.' },
      { name: 'ranj:toastdismiss', type: 'event', desc: 'On the toaster: <code>{ id, reason: "timeout"|"close"|"swipe"|"action"|"api" }</code>.' }
    ]
  });
})();

;
/* docs/registry/overlays-tooltip.js */
(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'tooltip',
    name: 'Tooltip',
    group: 'Overlays',
    description: 'Add <code>data-tooltip="text"</code> to any element, no wrapper needed. Shows after a short delay on hover and instantly on keyboard focus; once one is open, moving to the next shows it immediately. Escapes overflow, flips at edges and updates live when the text changes.',
    tags: ['js'],
    keywords: ['hint', 'title', 'label', 'info bubble', 'data-tooltip'],
    demos: [
      {
        title: 'Toolbar',
        description: 'Hover across the buttons: after the first one, the rest appear without delay.',
        html: `
<div class="demo-tooltip-bar">
  <button class="demo-tooltip-btn" data-tooltip="Bold" data-tooltip-kbd="⌘ B" aria-label="Bold"><b>B</b></button>
  <button class="demo-tooltip-btn" data-tooltip="Italic" data-tooltip-kbd="⌘ I" aria-label="Italic"><i style="font-family:Georgia,serif">I</i></button>
  <button class="demo-tooltip-btn" data-tooltip="Underline" data-tooltip-kbd="⌘ U" aria-label="Underline"><u>U</u></button>
  <span class="demo-tooltip-sep"></span>
  <button class="demo-tooltip-btn" data-tooltip="Insert link" data-tooltip-kbd="⌘ K" aria-label="Insert link">${I.link}</button>
  <button class="demo-tooltip-btn" data-tooltip="Add image" aria-label="Add image">${I.image}</button>
  <button class="demo-tooltip-btn" data-tooltip="Code block" data-tooltip-kbd="⌘ ⌥ C" aria-label="Code block">${I.code}</button>
  <span class="demo-tooltip-sep"></span>
  <button class="demo-tooltip-btn" data-tooltip="Undo" data-tooltip-kbd="⌘ Z" aria-label="Undo">${I.undo}</button>
  <button class="demo-tooltip-btn" data-tooltip="Redo" data-tooltip-kbd="⇧ ⌘ Z" aria-label="Redo">${I.redo}</button>
</div>`,
        css: `.demo-tooltip-bar { display: inline-flex; align-items: center; gap: .125rem; padding: .25rem; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--card); box-shadow: var(--shadow-sm); max-width: 100%; overflow-x: auto; }
.demo-tooltip-btn { width: 2.125rem; height: 2.125rem; display: grid; place-items: center; border-radius: var(--radius-sm); color: var(--fg); font-size: .9375rem; flex-shrink: 0; }
.demo-tooltip-btn:hover { background: var(--muted); } .demo-tooltip-btn svg { width: 1rem; height: 1rem; }
.demo-tooltip-sep { width: 1px; height: 1.25rem; background: var(--border); margin: 0 .25rem; flex-shrink: 0; }`
      },
      {
        title: 'Placements & variants',
        html: `
<button class="btn btn-outline" data-tooltip="Above" data-tooltip-placement="top">Top</button>
<button class="btn btn-outline" data-tooltip="To the right" data-tooltip-placement="right">Right</button>
<button class="btn btn-outline" data-tooltip="Below" data-tooltip-placement="bottom">Bottom</button>
<button class="btn btn-outline" data-tooltip="To the left" data-tooltip-placement="left">Left</button>
<button class="btn btn-outline" data-tooltip="Brand-colored" data-tooltip-variant="primary">Primary</button>
<button class="btn btn-outline" data-tooltip="No arrow, no delay" data-tooltip-arrow="false" data-tooltip-delay="0">Instant</button>`
      },
      {
        title: 'On anything',
        description: 'Links, icons, avatars, disabled-looking chips, even text. Changing the attribute updates an open tooltip.',
        html: `
<p class="demo-tooltip-text">Deploys run on <a href="#" data-tooltip="Edge network in 34 regions">Northwind Edge</a> and finish in
<abbr data-tooltip="Median over the last 30 days" tabindex="0">~41s</abbr>.</p>
<div class="demo-tooltip-row">
  <span class="demo-ov-avatar" style="--h:15;width:36px;height:36px;font-size:13px" data-tooltip="Lena Fischer · online" tabindex="0">LF</span>
  <span class="demo-ov-avatar" style="--h:150;width:36px;height:36px;font-size:13px" data-tooltip="Omar Haddad · away" tabindex="0">OH</span>
  <span class="demo-ov-avatar" style="--h:260;width:36px;height:36px;font-size:13px" data-tooltip="Mei Tanaka · in a meeting" tabindex="0">MT</span>
  <button class="btn btn-secondary btn-sm" id="tooltip-copy" data-tooltip="Copy invite link">${I.copy} Copy link</button>
</div>`,
        js: `var b = root.querySelector('#tooltip-copy');
b.addEventListener('click', function () {
  b.setAttribute('data-tooltip', 'Copied!'); Ranj.tooltip.show(b);
  setTimeout(function () { b.setAttribute('data-tooltip', 'Copy invite link'); }, 1600);
});`,
        css: `.demo-tooltip-text { font-size: .9375rem; color: var(--muted-fg); text-align: center; width: 100%; }
.demo-tooltip-text abbr { text-decoration: underline dotted; text-underline-offset: 3px; color: var(--fg); cursor: help; }
.demo-tooltip-row { display: flex; align-items: center; gap: .5rem; } .demo-tooltip-row .btn svg { width: .9rem; height: .9rem; }`
      },
      {
        title: 'Rich content',
        description: 'Wrap a trigger and a <code>.tooltip-content</code> in <code>.tooltip</code> for formatted content.',
        html: `
<span class="tooltip" data-placement="bottom">
  <button class="btn btn-outline">${I.zap} Usage: 82%</button>
  <div class="tooltip-content tooltip-rich">
    <b>Pro plan · 8.2k of 10k builds</b><br>
    Resets in 6 days. Upgrade to Scale for unlimited builds and priority queues.
  </div>
</span>`
      }
    ],
    api: [
      { name: 'data-tooltip="text"', type: 'attr', desc: 'On any element. Plain text (escaped).' },
      { name: 'data-tooltip-placement', type: 'attr', default: 'top', desc: 'top | right | bottom | left (+ -start / -end).' },
      { name: 'data-tooltip-delay', type: 'attr', default: '400', desc: 'Hover delay in ms. Skipped while another tooltip was just open.' },
      { name: 'data-tooltip-kbd', type: 'attr', desc: 'Keyboard shortcut chips, space separated: <code>"⌘ K"</code>.' },
      { name: 'data-tooltip-variant', type: 'attr', desc: '<code>primary</code> or <code>rich</code>.' },
      { name: 'data-tooltip-arrow="false"', type: 'attr', desc: 'Hide the arrow.' },
      { name: '.tooltip > .tooltip-content', type: 'class', desc: 'Rich tooltip markup (v1 compatible). <code>data-placement</code> on <code>.tooltip</code>.' },
      { name: '.tooltip-rich / .tooltip-primary', type: 'class', desc: 'Surface variants for rich tooltips.' },
      { name: 'Ranj.tooltip.show(el) / hide()', type: 'js', desc: 'Show one programmatically (e.g. "Copied!").' },
      { name: 'ranj:open / ranj:close', type: 'event', desc: 'On the trigger.' }
    ]
  });
})();

;
/* docs/registry/overlays-tour.js */
(function () {
  var I = window.__ovI;
  RanjDocs.add({
    id: 'tour',
    name: 'Product Tour',
    group: 'Overlays',
    description: 'A guided walkthrough: a spotlight cutout glides from one element to the next while a step card explains it, with progress dots, back/next and keyboard arrows. Start it from JavaScript or declare steps in your markup.',
    tags: ['js', 'new'],
    keywords: ['walkthrough', 'onboarding', 'coachmark', 'spotlight', 'guide', 'intro', 'shepherd'],
    demos: [
      {
        title: 'Onboarding walkthrough',
        height: 340,
        html: `
<div class="demo-tour-app">
  <div class="demo-tour-top">
    <b class="demo-tour-logo">${I.layers} Northwind</b>
    <div class="demo-tour-search" id="tour-search">${I.search} Search… <kbd>⌘K</kbd></div>
    <button class="btn btn-sm" id="tour-new">${I.plus} New project</button>
    <span class="demo-ov-avatar" id="tour-avatar" style="--h:20;width:30px;height:30px;font-size:11px">MO</span>
  </div>
  <div class="demo-tour-main">
    <div class="demo-tour-stats" id="tour-stats">
      <div><small>Revenue</small><b>$48.2k</b><em>+12.4%</em></div>
      <div><small>Active users</small><b>2,931</b><em>+4.1%</em></div>
      <div><small>Churn</small><b>1.8%</b><em class="down">−0.3%</em></div>
    </div>
    <button class="btn" id="tour-start">${I.compass} Take the tour</button>
  </div>
</div>`,
        js: `root.querySelector('#tour-start').onclick = function () {
  Ranj.tour([
    { title: 'Welcome to Northwind', body: 'A 30-second tour of the essentials. Use ← → or the buttons.', media: '${I.svg('sparkles', 34).replace(/'/g, "\\'")}' },
    { target: root.querySelector('#tour-search'), title: 'Search everything', body: 'Jump to any project, doc or person. Press <b>⌘K</b> from anywhere.', placement: 'bottom' },
    { target: root.querySelector('#tour-new'), title: 'Start a project', body: 'Templates for roadmaps, sprints and OKRs are one click away.', placement: 'bottom' },
    { target: root.querySelector('#tour-stats'), title: 'Your numbers, live', body: 'These update in realtime as data flows in from Stripe and Segment.', placement: 'top' },
    { target: root.querySelector('#tour-avatar'), title: 'Make it yours', body: 'Set your theme, notifications and integrations in your profile.', placement: 'bottom-end' }
  ], { onEnd: function (done) { if (done && Ranj.toast) Ranj.toast.success('Tour complete', { description: 'You can restart it any time.' }); } });
};`,
        css: `.demo-tour-app { width: min(40rem, calc(100vw - 4rem)); border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--card); overflow: hidden; }
.demo-tour-top { display: flex; align-items: center; gap: .75rem; padding: .7rem .9rem; border-bottom: 1px solid var(--border); }
.demo-tour-logo { display: flex; align-items: center; gap: .4rem; font-size: .875rem; white-space: nowrap; } .demo-tour-logo svg { width: 1.1rem; height: 1.1rem; color: var(--primary); }
.demo-tour-search { flex: 1; display: flex; align-items: center; gap: .45rem; height: 2rem; padding: 0 .65rem; border: 1px solid var(--border); border-radius: var(--radius); font-size: .8125rem; color: var(--muted-fg); min-width: 0; }
.demo-tour-search svg { width: .9rem; height: .9rem; } .demo-tour-search kbd { margin-left: auto; font-family: var(--font-sans); font-size: .65rem; }
.demo-tour-top .btn svg { width: .9rem; height: .9rem; }
.demo-tour-main { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; padding: 1.25rem; }
.demo-tour-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; width: 100%; }
.demo-tour-stats div { display: flex; flex-direction: column; padding: .75rem .9rem; border: 1px solid var(--border); border-radius: var(--radius-lg); }
.demo-tour-stats small { font-size: .72rem; color: var(--muted-fg); } .demo-tour-stats b { font-size: 1.25rem; letter-spacing: -.02em; }
.demo-tour-stats em { font-style: normal; font-size: .72rem; color: var(--success); } .demo-tour-stats em.down { color: var(--success); }
@media (max-width: 560px) { .demo-tour-search { display: none; } .demo-tour-stats { grid-template-columns: 1fr 1fr; } .demo-tour-stats div:last-child { display: none; } }`
      },
      {
        title: 'Declarative steps',
        description: 'Mark elements with <code>data-tour="name"</code>, <code>data-tour-step</code>, <code>data-tour-title</code> and <code>data-tour-body</code>, then add <code>data-tour-start="name"</code> to a button. No JavaScript needed.',
        html: `
<div class="demo-tour-row">
  <button class="btn btn-outline" data-tour="editor" data-tour-step="1" data-tour-title="Write" data-tour-body="Draft with markdown shortcuts. Type / for blocks.">${I.pencil} Write</button>
  <button class="btn btn-outline" data-tour="editor" data-tour-step="2" data-tour-title="Collaborate" data-tour-body="Mention a teammate with @ to pull them into a thread.">${I.users} Collaborate</button>
  <button class="btn btn-outline" data-tour="editor" data-tour-step="3" data-tour-title="Publish" data-tour-body="Share a link or publish to your docs site in one click." data-tour-placement="top">${I.send} Publish</button>
</div>
<button class="btn" data-tour-start="editor">${I.compass} Start tour</button>`,
        css: `.demo-tour-row { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; width: 100%; margin-bottom: .5rem; }`
      }
    ],
    api: [
      { name: 'Ranj.tour(steps, opts)', type: 'js', desc: 'Starts a tour and returns <code>{ next, prev, go(i), end(), index }</code>. Step: <code>{ target, title, body, placement, media, padding, radius, badge, onEnter }</code>; no target → centered card.' },
      { name: 'opts', type: 'js', desc: '<code>onEnd(completed)</code>, <code>onStep(i)</code>, <code>nextText</code>, <code>backText</code>, <code>doneText</code>, <code>skip</code> (true), <code>allowInteraction</code>, <code>startAt</code>, <code>padding</code>.' },
      { name: 'Ranj.tour("name")', type: 'js', desc: 'Builds steps from <code>[data-tour="name"]</code> elements ordered by <code>data-tour-step</code>.' },
      { name: 'data-tour-start="name"', type: 'attr', desc: 'Button that starts a declarative tour.' },
      { name: 'data-tour-title / -body / -placement', type: 'attr', desc: 'Step content on the target element.' },
      { name: '--tour-mask', type: 'var', desc: 'Color of the dimmed area around the spotlight.' },
      { name: 'ranj:tourstep / ranj:tourend', type: 'event', desc: 'On <code>document</code>: <code>{ index, step }</code> / <code>{ completed }</code>.' }
    ]
  });
})();
