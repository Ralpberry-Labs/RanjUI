// Screenshot an arbitrary page path: node scripts/shot.mjs /index.html out.png [--dark] [--w=1360] [--full]
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
const ROOT = new URL('..', import.meta.url).pathname;
const [path = '/index.html', out = '.shots/page.png', ...rest] = process.argv.slice(2);
const dark = rest.includes('--dark'), full = rest.includes('--full');
const w = +((rest.find(a => a.startsWith('--w=')) || '--w=1360').slice(4));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = createServer(async (req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; try { const b = await readFile(join(ROOT, p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); } }).listen(0);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: 900 } });
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
await page.addInitScript(d => localStorage.setItem('ranj-theme', d ? 'dark' : 'light'), dark);
await page.goto(`http://localhost:${server.address().port}${path}`);
await page.waitForTimeout(1500);
if (full) { for (let y = 0; y < 30000; y += 700) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(120); } await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(1200); }
await page.screenshot({ path: out, fullPage: full });
const sw = await page.evaluate(() => document.documentElement.scrollWidth);
console.log('errors:', errs.length ? errs : 'none', '| scrollWidth', sw, '| viewport', w);
await browser.close(); server.close();
