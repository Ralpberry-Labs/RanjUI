// Ranj UI build — concatenates src/ into dist/ bundles (and minifies with esbuild if installed).
// Usage: node build.mjs [--watch]
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, watch } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = new URL('.', import.meta.url).pathname;
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const GROUPS = ['base', 'forms', 'overlays', 'motion', 'fx'];
const CORE_CSS = ['tokens.css', 'reset.css', 'typography.css', 'layout.css'];
const CORE_TAIL_CSS = ['utilities.css'];
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const list = (dir, ext) => existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith(ext) && !f.startsWith('_')).sort().map(f => join(dir, f)) : [];
const read = f => readFileSync(f, 'utf8');
const banner = `/*! Ranj UI v${pkg.version} | MIT | https://alps-is-core.github.io/RanjUI/ */\n`;

function bundle() {
  if (!existsSync(DIST)) mkdirSync(DIST);
  const coreCss = CORE_CSS.map(f => join(SRC, 'core', f)).filter(existsSync);
  const tailCss = CORE_TAIL_CSS.map(f => join(SRC, 'core', f)).filter(existsSync);
  const extraCore = list(join(SRC, 'core'), '.css').filter(f => !coreCss.includes(f) && !tailCss.includes(f));
  const compCss = GROUPS.flatMap(g => list(join(SRC, 'components', g), '.css'));
  const cssFiles = [...coreCss, ...extraCore, ...compCss, ...tailCss];
  const jsFiles = [join(SRC, 'core', 'core.js'), ...list(join(SRC, 'core'), '.js').filter(f => !f.endsWith('core.js')), ...GROUPS.flatMap(g => list(join(SRC, 'components', g), '.js'))];

  const css = banner + cssFiles.map(f => `/* --- ${relative(SRC, f)} --- */\n` + read(f)).join('\n');
  const js = banner + jsFiles.map(f => `/* --- ${relative(SRC, f)} --- */\n` + read(f)).join('\n;\n');
  writeFileSync(join(DIST, 'ranj.css'), css);
  writeFileSync(join(DIST, 'ranj.js'), js);

  // Per-group bundles for people who only want part of it
  for (const g of GROUPS) {
    const gc = list(join(SRC, 'components', g), '.css'), gj = list(join(SRC, 'components', g), '.js');
    writeFileSync(join(DIST, `ranj-${g}.css`), banner + gc.map(read).join('\n'));
    writeFileSync(join(DIST, `ranj-${g}.js`), banner + gj.map(read).join('\n;\n'));
  }
  writeFileSync(join(DIST, 'ranj-core.css'), banner + [...coreCss, ...extraCore, ...tailCss].map(read).join('\n'));
  writeFileSync(join(DIST, 'ranj-core.js'), banner + read(join(SRC, 'core', 'core.js')));

  // Docs registry bundle
  const reg = list(join(ROOT, 'docs', 'registry'), '.js');
  writeFileSync(join(ROOT, 'docs', 'registry.bundle.js'), reg.map(f => `/* ${relative(ROOT, f)} */\n` + read(f)).join('\n;\n'));

  let min = '';
  try {
    execSync(`npx --no-install esbuild "${join(DIST, 'ranj.css')}" --minify --outfile="${join(DIST, 'ranj.min.css')}" --log-level=error`, { cwd: ROOT, stdio: 'pipe' });
    execSync(`npx --no-install esbuild "${join(DIST, 'ranj.js')}" --minify --outfile="${join(DIST, 'ranj.min.js')}" --log-level=error`, { cwd: ROOT, stdio: 'pipe' });
    const kb = f => (statSync(join(DIST, f)).size / 1024).toFixed(1) + 'KB';
    const gz = f => { try { return (execSync(`gzip -c "${join(DIST, f)}" | wc -c`).toString().trim() / 1024).toFixed(1) + 'KB gz'; } catch { return ''; } };
    min = ` | min: ${kb('ranj.min.css')} (${gz('ranj.min.css')}) css, ${kb('ranj.min.js')} (${gz('ranj.min.js')}) js`;
  } catch (e) { min = ' | (minify skipped: ' + (e.stderr?.toString().trim().split('\n')[0] || 'esbuild missing') + ')'; }
  console.log(`built ${cssFiles.length} css + ${jsFiles.length} js files, ${reg.length} registry files${min}`);
}

bundle();
if (process.argv.includes('--watch')) {
  let t; const kick = () => { clearTimeout(t); t = setTimeout(() => { try { bundle(); } catch (e) { console.error(e.message); } }, 80); };
  watch(SRC, { recursive: true }, kick);
  watch(join(ROOT, 'docs', 'registry'), kick);
  console.log('watching…');
}
