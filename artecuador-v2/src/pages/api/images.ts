export const prerender = false;

import type { APIRoute } from 'astro';
import { listImages, deleteImage, type MediaFolder } from '../../lib/storage';

/* SHA-256("admin:artecuador2026") — mismo hash que products.ts */
const ADMIN_HASH = 'da5c8060d7f3de5fc7aba7fdd418ff11009f70aca445a5248701694e60fb3ba8';

export const GET: APIRoute = async () => {
  const [products, clients] = await Promise.all([
    listImages('products'),
    listImages('clients'),
  ]);
  return new Response(JSON.stringify({ products, clients }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};

/** Elimina una imagen. Requiere token de admin. Body: { folder, filename } */
export const DELETE: APIRoute = async ({ request }) => {
  const token = (request.headers.get('Authorization') ?? '').replace('Bearer ', '');
  if (token !== ADMIN_HASH) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  let folder: string, filename: string;
  try {
    const body = await request.json();
    folder = body?.folder;
    filename = body?.filename;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!['products', 'clients'].includes(folder)) {
    return new Response(JSON.stringify({ error: 'Invalid folder' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }
  // Evita path traversal: solo un nombre de archivo simple
  if (!filename || /[/\\]/.test(filename) || filename.includes('..')) {
    return new Response(JSON.stringify({ error: 'Invalid filename' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await deleteImage(folder as MediaFolder, filename);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Cannot delete image' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};
