// Simple static server with /health endpoint
// Serves the Vite build output from dist/

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pkg from './package.json' with { type: 'json' }

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(__dirname, 'dist');
const PORT = parseInt(process.env.PORT ?? '3000', 10);

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer((req, res) => {
  const url = req.url ?? '/';

  // Health endpoint
  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // Static file serving
  let filePath = join(DIST, url === '/' ? 'index.html' : url);

  // SPA fallback: if file doesn't exist, serve index.html
  if (!existsSync(filePath)) {
    filePath = join(DIST, 'index.html');
  }

  try {
    let content = readFileSync(filePath);
    const ext = extname(filePath);
    const mime = MIME_TYPES[ext] ?? 'application/octet-stream';

    // Inject runtime env vars into HTML responses
    if (ext === '.html') {
      const runtimeConfig = JSON.stringify({
        APP_NAME: process.env.APP_NAME ?? '',
        VERSION: pkg.version,
      });
      const injection = `<script>window.__RUNTIME_CONFIG__=${runtimeConfig}</script>`;
      content = Buffer.from(
        content.toString().replace('</head>', `${injection}</head>`)
      );
    }

    res.writeHead(200, { 'Content-Type': mime });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`test-app listening on http://0.0.0.0:${PORT}`);
});
