#!/usr/bin/env node
// Admin panel server — pure Node.js, no npm dependencies
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PRODUCTS_JSON = path.join(__dirname, '../src/data/products.json');
const ADMIN_HTML    = path.join(__dirname, 'index.html');
const MEDIA_DIR     = path.join(__dirname, '../../media');
const PORT          = 4000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
};

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function send(res, status, contentType, body) {
  cors(res);
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(body);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, 'text/plain', 'Not found');
      return;
    }
    cors(res);
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`);
  const method = req.method.toUpperCase();

  // OPTIONS preflight
  if (method === 'OPTIONS') {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // GET / → admin panel
  if (method === 'GET' && pathname === '/') {
    sendFile(res, ADMIN_HTML);
    return;
  }

  // GET /api/products → read products.json
  if (method === 'GET' && pathname === '/api/products') {
    fs.readFile(PRODUCTS_JSON, 'utf8', (err, data) => {
      if (err) {
        send(res, 500, 'application/json', JSON.stringify({ error: 'Cannot read products.json' }));
        return;
      }
      send(res, 200, 'application/json; charset=utf-8', data);
    });
    return;
  }

  // POST /api/products → write products.json
  if (method === 'POST' && pathname === '/api/products') {
    try {
      const body = await readBody(req);
      const parsed = JSON.parse(body); // validate JSON
      const pretty = JSON.stringify(parsed, null, 2);
      fs.writeFile(PRODUCTS_JSON, pretty, 'utf8', (err) => {
        if (err) {
          send(res, 500, 'application/json', JSON.stringify({ error: 'Cannot write products.json' }));
          return;
        }
        send(res, 200, 'application/json', JSON.stringify({ ok: true }));
      });
    } catch (e) {
      send(res, 400, 'application/json', JSON.stringify({ error: 'Invalid JSON' }));
    }
    return;
  }

  // GET /media/* → serve from shared media folder
  if (method === 'GET' && pathname.startsWith('/media/')) {
    const relative = pathname.slice(7); // strip leading "/media/"
    const filePath = path.join(MEDIA_DIR, relative);
    // Prevent path traversal
    if (!filePath.startsWith(MEDIA_DIR)) {
      send(res, 403, 'text/plain', 'Forbidden');
      return;
    }
    sendFile(res, filePath);
    return;
  }

  // 404 for everything else
  send(res, 404, 'text/plain', 'Not found');
});

server.listen(PORT, () => {
  console.log(`Panel admin: http://localhost:${PORT}`);
});
