export const prerender = false;

import type { APIRoute } from 'astro';
import { getCatalog, saveCatalog } from '../../lib/storage';

/* SHA-256("admin:artecuador2026") — mismo hash que Nav.astro */
const ADMIN_HASH = 'da5c8060d7f3de5fc7aba7fdd418ff11009f70aca445a5248701694e60fb3ba8';

export const GET: APIRoute = async () => {
  try {
    const catalog = await getCatalog();
    return new Response(JSON.stringify(catalog), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Cannot read catalog' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const token = (request.headers.get('Authorization') ?? '').replace('Bearer ', '');
  if (token !== ADMIN_HASH) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.text();
    const parsed = JSON.parse(body);
    await saveCatalog(parsed);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const isBadJson = e instanceof SyntaxError;
    return new Response(JSON.stringify({ error: isBadJson ? 'Invalid JSON' : 'Cannot write catalog' }), {
      status: isBadJson ? 400 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
