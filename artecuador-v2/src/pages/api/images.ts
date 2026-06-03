export const prerender = false;

import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

async function listImages(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir);
    return files.filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase())).sort();
  } catch {
    return [];
  }
}

export const GET: APIRoute = async () => {
  // Dev: public/media/ (symlink → ../../media)
  // Production (node standalone): dist/client/media/ (where the static server reads from)
  const base = import.meta.env.PROD
    ? path.join(process.cwd(), 'dist', 'client', 'media')
    : path.join(process.cwd(), 'public', 'media');

  const [products, clients] = await Promise.all([
    listImages(path.join(base, 'products')),
    listImages(path.join(base, 'clients')),
  ]);
  return new Response(JSON.stringify({ products, clients }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
