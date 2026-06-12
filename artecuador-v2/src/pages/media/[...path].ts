export const prerender = false;

import type { APIRoute } from 'astro';

import { getImageFromBucket } from '../../lib/storage';

/*
 * Fallback para imágenes subidas al bucket S3/R2 desde el panel admin.
 * El static server del adapter node sirve primero los archivos de
 * dist/client/media (las imágenes del repo); solo los paths que no existen
 * como archivo llegan a esta ruta.
 */
export const GET: APIRoute = async ({ params }) => {
  const relPath = params.path ?? '';
  // Solo nombres simples dentro de products/ o clients/ — sin traversal
  if (!/^(products|clients)\/[a-z0-9._-]+$/i.test(relPath)) {
    return new Response('Not found', { status: 404 });
  }

  const img = await getImageFromBucket(`media/${relPath}`);
  if (!img) return new Response('Not found', { status: 404 });

  return new Response(img.body, {
    headers: {
      'Content-Type': img.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
