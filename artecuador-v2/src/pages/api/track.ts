export const prerender = false;

import type { APIRoute } from 'astro';
import { recordVisit } from '../../lib/analytics';

/** Registra una visita. Público (sin auth) — solo incrementa contadores. */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    let path = '/';
    try {
      const body = await request.json();
      if (body?.path) path = String(body.path);
    } catch { /* cuerpo vacío o no-JSON: usar '/' */ }

    const xff = request.headers.get('x-forwarded-for');
    const ip = xff ? xff.split(',')[0].trim() : (clientAddress || '');

    await recordVisit(ip, path);
  } catch { /* nunca romper la navegación del visitante */ }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
