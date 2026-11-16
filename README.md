<div align="center">

<img src="assets/logo.svg" width="72" height="72" alt="Ranj UI logo">

# Ranj UI

**The zero-dependency component library for the plain web.**
__COUNT__ components with live docs: forms, overlays, data display, text effects, animated backgrounds, micro-interactions and loaders.
One CSS file, one JS file, no framework, no build step.

[**Website**](https://alps-is-core.github.io/RanjUI/) · [**Docs**](https://alps-is-core.github.io/RanjUI/docs/) · [**Examples**](https://alps-is-core.github.io/RanjUI/examples/)

![license](https://img.shields.io/badge/license-MIT-8b5cf6) ![deps](https://img.shields.io/badge/dependencies-0-10b981) ![size](https://img.shields.io/badge/min%2Bgzip-__GZ__-6366f1)

</div>

---

## Why Ranj UI

- **Zero dependencies.** Semantic HTML plus classes and `data-*` attributes. Works with plain HTML, htmx, Alpine, Astro, Rails, Django, Laravel, React, Vue. Anything that outputs HTML.
- **Auto-mounting.** Components mount on load *and* whenever HTML is added later (MutationObserver), and clean up after themselves when removed.
- **Accessible.** Focus traps, roving tabindex, ARIA wiring, an Escape-key layer stack, and `prefers-reduced-motion` support everywhere.
- **Motion built in.** Text effects, scroll reveals, magnetic/tilt/spotlight interactions, canvas backgrounds that pause offscreen, and Jitter-grade micro-interactions.
- **One-number theming.** OKLCH tokens driven by a single `--hue`. Dark mode, 13 accent presets, radius and density scales, all switchable per element.

## Install

**CDN**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Alps-is-Core/RanjUI@master/dist/ranj.min.css">
<script src="https://cdn.jsdelivr.net/gh/Alps-is-Core/RanjUI@master/dist/ranj.min.js" defer></script>
```

**npm**

```bash
npm install github:Alps-is-Core/RanjUI
```

```js
import 'ranj-ui/dist/ranj.css';
import 'ranj-ui/dist/ranj.js';
```

**Only what you need:** `ranj-core` (required) + any of `ranj-base`, `ranj-forms`, `ranj-overlays`, `ranj-motion`, `ranj-fx` in `dist/`.

## Quick start

```html
<button class="btn" onclick="Ranj.toast({ title: 'Saved', type: 'success' })">Save</button>

<h1 data-split-text>Ship beautiful interfaces</h1>

<div class="hero" style="position:relative">
  <div class="bg-aurora"></div>
</div>
```

```js
Ranj.theme.set('dark');            // or toggle(), accent('rose'), radius('full')
const ok = await Ranj.confirm({ title: 'Delete project?', danger: true });
Ranj.toast.promise(save(), { loading: 'Saving…', success: 'Saved', error: 'Failed' });
Ranj.confetti();
```

## What's inside

__TABLE__

Browse every component with live previews and copy-paste code at **[alps-is-core.github.io/RanjUI/docs](https://alps-is-core.github.io/RanjUI/docs/)**.

## Theming

```html
<html data-theme="dark" data-accent="violet" data-radius="lg" data-density="compact">
```

```css
:root { --hue: 162; --radius: .75rem; --font-sans: "Geist", system-ui; }
```

## Development

```bash
npm install
npm run build    # src/ → dist/ (+ minified)
npm run dev      # rebuild on change
npm run serve    # http://localhost:4321/docs/
node scripts/check.mjs button dialog --dark   # headless screenshot + console check
```

Source layout: `src/core` (tokens, reset, runtime), `src/components/{base,forms,overlays,motion,fx}`, docs entries in `docs/registry/`. See [docs/AUTHORING.md](docs/AUTHORING.md).

## Upgrading from RanjuUI v1

The project was renamed from **RanjuUI** to **Ranj UI**. v1 class names keep working, and `window.Ranju` is an alias of `window.Ranj`. Rename `ranju.css`/`ranju.js` to `dist/ranj.css`/`dist/ranj.js`.

## License

[MIT](LICENSE)
