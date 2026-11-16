// Headless check of docs pages: reports console errors and saves screenshots.
// Usage: node scripts/check.mjs <component-id> [more ids...] [--dark] [--out=dir]
//   ids can also be "g/Motion" for a group page or "" for the docs home.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
const ROOT = new URL('..', import.meta.url).pathname;
const args = process.argv.slice(2);
const dark = args.includes('--dark');
const out = (args.find(a => a.startsWith('--out=')) || '--out=' + join(ROOT, '.shots')).slice(6);
const ids = args.filter(a => !a.startsWith('--'));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  try { const b = await readFile(join(ROOT, p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(0);
const port = server.address().port;
const { mkdirSync } = await import('node:fs'); mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, colorScheme: dark ? 'dark' : 'light' });
let errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', e => errors.push('[pageerror] ' + e.message));
await page.addInitScript(d => { try { localStorage.setItem('ranj-theme', d ? 'dark' : 'light'); } catch {} }, dark);
let failed = 0;
for (const id of (ids.length ? ids : [''])) {
  errors = [];
  const hash = id === '' ? '#/' : id.startsWith('g/') ? '#/' + id : '#/c/' + id;
  await page.goto(`http://localhost:${port}/docs/${hash}`);
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => ({ title: document.querySelector('.dx-h1')?.textContent, demos: document.querySelectorAll('[data-demo]').length, empty: [...document.querySelectorAll('[data-demo]')].filter(d => d.getBoundingClientRect().height < 20).length }));
  const file = join(out, (id || 'home').replace(/\//g, '_') + (dark ? '-dark' : '') + '.png');
  await page.screenshot({ path: file, fullPage: true });
  const bad = errors.filter(e => !/favicon|fonts\.g/.test(e));
  if (bad.length || !info.title) failed++;
  console.log(`${id || 'home'}: title=${JSON.stringify(info.title)} demos=${info.demos} collapsed=${info.empty} errors=${bad.length}${bad.length ? '\n  ' + bad.join('\n  ') : ''}\n  screenshot: ${file}`);
}
await browser.close(); server.close();
process.exit(failed ? 1 : 0);
