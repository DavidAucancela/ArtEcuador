export const prerender = false;

import type { APIRoute } from 'astro';
import { getStats } from '../../lib/analytics';

/* SHA-256("admin:artecuador2026") — mismo hash que products.ts */
const ADMIN_HASH = 'da5c8060d7f3de5fc7aba7fdd418ff11009f70aca445a5248701694e60fb3ba8';

/** Devuelve las estadísticas de visitas. Requiere token de admin. */
export const GET: APIRoute = async ({ request }) => {
  const token = (request.headers.get('Authorization') ?? '').replace('Bearer ', '');
  if (token !== ADMIN_HASH) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const stats = await getStats();
    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Cannot read stats' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};
