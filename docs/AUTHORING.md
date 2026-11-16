# Authoring Ranj UI components

Ranj UI is a **zero-dependency** HTML/CSS/vanilla-JS component library (no React, no Tailwind, no build step for users).
Quality bar: shadcn/ui + Radix level polish and accessibility, ReactBits / Jitter / Ripplix level motion. Every component must look
stunning in **both light and dark mode** and at **phone width (375px)**.

## Files you own

For a component `foo` in source group `<g>` (one of `base`, `forms`, `overlays`, `motion`, `fx`):

| File | Purpose |
|---|---|
| `src/components/<g>/foo.css` | All styles. Use tokens only (see below). |
| `src/components/<g>/foo.js` | Optional behaviour, registered with `Ranj.define`. |
| `docs/registry/<g>-foo.js` | Docs entry with live demos (required for every component). |

Several tiny related things may share one file (e.g. `loaders.css` holding 15 loaders), but then give each its own registry entry
(or one entry with many demos when they are variants of one thing).

**Never edit** `src/core/*`, `docs/index.html`, `docs/docs.js`, `docs/docs.css`, `docs/docs-core.js`, `build.mjs`, or other people's files.
If you need a helper that core lacks, write it privately inside your own file.

## CSS rules

- Class names are short and unprefixed (`.btn`, `.card`, `.switch`); modifiers are `.btn-outline`, `.btn-sm`. State uses attributes:
  `[data-state="open"|"closed"|"checked"|"active"]`, `[aria-selected="true"]`, `[aria-expanded="true"]`, `[disabled]`, `[aria-invalid="true"]`.
- Colors **only** through tokens from `src/core/tokens.css`: `--bg --bg-subtle --fg --card --card-fg --popover --popover-fg --primary
  --primary-hover --primary-fg --primary-soft --primary-soft-fg --secondary --secondary-fg --secondary-hover --muted --muted-fg --border
  --border-strong --input --ring --destructive(-hover/-fg/-soft/-soft-fg) --success(...) --warning(...) --info(...)`, plus `--hue` (OKLCH hue, use
  `oklch(L C var(--hue))` for brand-tinted extras) and `color-mix(in oklab, …)`. Hard-coded colors are OK only for intentionally fixed art
  (e.g. aurora gradients) and must still look right on both themes.
- Shape/elevation/motion tokens: `--radius --radius-xs/sm/lg/xl/2xl/full`, `--shadow-xs..xl --shadow-glow`, `--ease --ease-out --ease-in-out
  --ease-spring --ease-bounce --dur-fast --dur --dur-slow --dur-slower --transition`, layers `--z-dropdown --z-sticky --z-overlay --z-modal
  --z-popover --z-toast --z-tooltip`, control heights `--control-h --control-h-sm --control-h-lg`, fonts `--font-sans --font-display --font-mono`.
- Expose per-component knobs as CSS custom properties with defaults (e.g. `.marquee { --duration: 30s; --gap: 1rem; }`).
- Shared keyframes exist in core: `r-spin r-pulse r-ping r-fade-in r-fade-out r-zoom-in r-slide-up r-slide-down r-shimmer r-shake`. Prefix your
  own keyframes with your component name (`@keyframes switch-pop`).
- Animate `transform`/`opacity`/`filter` where possible. `prefers-reduced-motion` is globally handled in core, but JS effects must check
  `Ranj.reducedMotion` and render the final state.
- Must work inside any container (no `100vw` assumptions; backgrounds fill their parent with `position:absolute; inset:0` on a
  `position:relative` host).

## JS rules

The bundle is plain concatenated scripts. Wrap every file in an IIFE and register with the core runtime:

```js
(function (R) {
  'use strict';
  R.define('carousel', {
    selector: '.carousel',            // auto-mounted on load AND when added to the DOM later
    setup: function () {              // optional, runs once: delegated document listeners
      R.on(document, 'click', '[data-x-open]', function (e, el) { … });
    },
    mount: function (el, R) {         // once per element; must be idempotent-safe
      var o = R.opts(el, { autoplay: 0, loop: true });   // reads data-autoplay, data-loop with types
      …
      return function destroy() { … };  // remove window/document listeners, timers, observers, rAF
    }
  });
  R.foo = function () {};               // optional imperative API
})(window.Ranj);
```

Core API on `window.Ranj` (`R`): `$ $$ on(el, evt, [selector], fn) → off`, `attr`, `opts(el, defaults)`, `emit(el, name, detail)` (fires
`ranj:name`), `uid ensureId clamp lerp esc`, `inView(el, fn, {threshold, repeat, onLeave}) → stop`, `loop(el, frame(t, dt)) → stop` (rAF paused
offscreen/hidden), `focusables(root)`, `trapFocus(root, initial) → release`, `scrollLock.lock()/unlock()`, `pushLayer(closeFn) → pop`
(Escape stack: Escape closes only the topmost), `position(floating, anchorElOr{x,y}, {placement:'bottom-start', offset:8, flip, shift})`,
`autoPosition(...) → stop`, `onOutside([els], fn) → off`, `roving(container, itemSelector, {orientation, onMove}) → off`, `reducedMotion`,
`theme.get/set/toggle/accent/radius`, `init(root)`, `destroy(root)`, `define`.

- ES5-compatible syntax style (var/function) is preferred but modern syntax that Safari 16+/Chrome 110+ support is fine. **No external libraries.**
- Accessibility: correct roles, `aria-*` sync, full keyboard support (arrows/Home/End/Enter/Space/Escape as applicable), focus return.
- Floating things (menus, popovers, tooltips) use `R.position`/`R.autoPosition` with `position: fixed`, so they escape overflow-hidden parents.
- Overlays use `R.trapFocus`, `R.scrollLock`, `R.pushLayer`.
- Canvas effects: size with `ResizeObserver` and `devicePixelRatio` (cap at 2), drive via `R.loop` so they pause offscreen, read colors from
  CSS vars (re-read on `ranj:theme` event) or `data-*` options, and clean up in `destroy`.
- Fire meaningful events via `R.emit(el, 'change', {...})` etc. and document them.

## Registry (docs) entry

`docs/registry/<g>-foo.js`:

```js
RanjDocs.add({
  id: 'foo',                       // url: docs/#/c/foo — globally unique, kebab-case
  name: 'Foo',
  group: 'Forms',                  // sidebar group, one of: Foundations, Layout, Base, Data Display, Forms, Navigation, Overlays, Feedback,
                                   // Text Effects, Motion, Interactions, Backgrounds, Micro-interactions, Loaders, Blocks
  description: 'One or two sentences. Plain, specific.',
  tags: ['new', 'js'],             // 'new' for components that did not exist in v1, 'js' if it needs ranj.js, 'fx' for showy effects
  keywords: ['synonym', 'other name'],
  demos: [
    { title: 'Default', html: `<div class="foo">…</div>` },
    { title: 'Sizes', description: 'Optional sentence.', html: `…`, height: 260 },
    { title: 'With JS', html: `<button class="btn" id="go">Go</button>`,
      js: `root.querySelector('#go').onclick = () => Ranj.toast({ title: 'Hi' });`,   // runs with (root, Ranj); may return a cleanup fn
      css: `.demo-foo-extra { … }` }   // demo-only CSS, prefix selectors with .demo-<id>- to avoid clashes
  ],
  api: [
    { name: '.foo-lg', type: 'class', desc: 'Larger size.' },
    { name: 'data-autoplay', type: 'attr', default: '0', desc: 'Milliseconds between slides; 0 disables.' },
    { name: '--duration', type: 'var', default: '30s', desc: '…' },
    { name: 'Ranj.foo(opts)', type: 'js', desc: '…' },
    { name: 'ranj:change', type: 'event', desc: 'detail: { value }' }
  ]
});
```

Demo options: `height` (min px), `center` (default true: flex-centered with gap), `pad: false` (edge-to-edge, good for backgrounds/heroes),
`bg: 'dots' (default) | 'grid' | 'dark' | 'none'`. Demos must look **great** — realistic content (names, numbers, copy), not lorem ipsum.
Give each component 2–6 demos showing variants, sizes, states and a realistic composition. Don't put `<script>` tags in `html`; use `js`.
Demo HTML must not use ids that could clash with other demos on a group page; prefix ids with the component id.

## Verify (required)

```bash
node build.mjs                          # rebuild dist/ and docs/registry.bundle.js
node scripts/check.mjs foo bar --out=.shots/<yourname>          # light: console errors + full-page screenshot per component
node scripts/check.mjs foo bar --dark --out=.shots/<yourname>    # dark
```

Open the PNGs with the Read tool and actually look at them. Fix anything ugly, broken, overflowing, or unreadable in either theme. Zero console
errors. Other agents are building in parallel, so `dist/` may contain their in-progress work. Ignore errors that clearly come from their
components, but never leave errors from yours.
