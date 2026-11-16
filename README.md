<div align="center">

<img src="assets/logo.svg" width="72" height="72" alt="Ranj UI logo">

# Ranj UI

**The zero-dependency component library for the plain web.**
200+ components with live docs: forms, overlays, data display, text effects, animated backgrounds, micro-interactions and loaders.
One CSS file, one JS file, no framework, no build step.

[**Website**](https://ralpberry-labs.github.io/RanjUI/) · [**Docs**](https://ralpberry-labs.github.io/RanjUI/docs/) · [**Examples**](https://ralpberry-labs.github.io/RanjUI/examples/)

![license](https://img.shields.io/badge/license-MIT-8b5cf6) ![deps](https://img.shields.io/badge/dependencies-0-10b981) ![size](https://img.shields.io/badge/min%2Bgzip-~250KB-6366f1)

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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ralpberry-Labs/RanjUI@master/dist/ranj.min.css">
<script src="https://cdn.jsdelivr.net/gh/Ralpberry-Labs/RanjUI@master/dist/ranj.min.js" defer></script>
```

**npm**

```bash
npm install github:Ralpberry-Labs/RanjUI
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

| Group | Count | Components |
|---|---|---|
| **Foundations** | 6 | Colors · Icons · Motion tokens · Radius · Shadows & elevation · Typography |
| **Layout** | 5 | Aspect ratio · Container · Grid · Separator · Stack |
| **Base** | 22 | Avatar · Badge · Banner · Blockquote · Button · Button group · Callout · Card · Chip · Code block · Description list · Empty state · Icon box · Image · Kbd · Link · List group · Logo cloud · Meter · Progress · Skeleton · Spinner |
| **Data Display** | 21 | Bar Chart · Breadcrumb · Carousel · Countdown · Data Table · Donut & Pie Chart · Gallery · Gauge · Heatmap Calendar · Image Compare · Kanban · Line & Area Chart · Pagination · Rating · Resizable · Scroll Area · Sparkline · Stat · Table · Timeline · Tree View |
| **Forms** | 28 | Calendar · Checkbox · Color picker · Combobox · Custom select · Date picker · Field · File upload · Form layouts · Inline edit · Input · Multi-select · Number input · OTP input · Password · Radio · Range slider · Rating · Search input · Segmented control · Select · Slider · Switch · Tag input · Textarea · Time picker · Toggle · Toggle group |
| **Navigation** | 13 | Accordion · Back to Top · Bottom Navigation · Collapsible · Floating Action Menu · Menubar · Navbar · Navigation Menu · Scrollspy / Table of Contents · Side Rail · Sidebar · Stepper · Tabs |
| **Overlays** | 11 | Alert Dialog · Command Palette · Context Menu · Dialog · Drawer · Dropdown Menu · Hover Card · Popover · Product Tour · Sheet · Tooltip |
| **Feedback** | 4 | Action Loading Dialog · Alert · Notification Center · Toast |
| **Text Effects** | 15 | Blur Text · Circular Text · Count Up · Decrypt Text · Glitch Text · Gradient Text · Highlight Text · Rotating Text · Scroll Reveal Text · Shiny Text · Split Text · Text Pressure · True Focus · Typewriter · Wave Text |
| **Motion** | 14 | Animated List · Bento Grid · Dock · Flip Card · Flowing Menu · Infinite Scroll Columns · Marquee · Orbit · Parallax · Reveal · Scroll Progress · Stack Cards · Sticky Scroll Cards · Word Globe |
| **Interactions** | 13 | Border Beam · Click Spark · Confetti · Cursor Follower · Glare Hover · Hover Effects · Magnetic · Pixel Transition · Ripple · Shine Border · Spotlight Card · Star Border · Tilt |
| **Backgrounds** | 18 | Aurora · Dot Pattern · Flickering Grid · Gradient Orbs · Grain · Grid · Light Beams · Light Rays · Liquid Swirl · Mesh Gradient · Meteors · Particles · Retro Grid · Ripple · Silk · Squares · Starfield · Waves |
| **Micro-interactions** | 33 | Add to Cart · Animated Arrows · Animated Checkbox · Animated Status Icons · Back / Next Buttons · Bookmark Button · Charging Animation · Circular Arc Slider · Color Palette · Continue Button · Copy Button · Counters · Day / Night Toggle · Download Button · Glass Button · Glow Button · Gradient Border Button · Hamburger · Like Button · Liquid Glass Menu · Liquid Glass Toggle · Morph Icons · Notification Bell · Odometer · Reaction Button · Search Reveal · Send Button · Status Dot · Subscribe Input · Swipe to Confirm · Toggle Pack · Trace Button · Typing Indicator |
| **Loaders** | 6 | Infinite Loader · Loader Gallery · Page Loading Bar · Progress Donut · Progress Pie · Spinner to Success |
| **Blocks** | 9 | Call to Action · FAQ · Features · Footer · Hero · Pricing · Stats Section · Team · Testimonials |

Browse every component with live previews and copy-paste code at **[ralpberry-labs.github.io/RanjUI/docs](https://ralpberry-labs.github.io/RanjUI/docs/)**.

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
