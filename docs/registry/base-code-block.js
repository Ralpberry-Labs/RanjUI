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
