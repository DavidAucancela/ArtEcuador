export const prerender = false;

import type { APIRoute } from 'astro';
import path from 'path';
import { saveImage, imageExists, type MediaFolder } from '../../lib/storage';

const ADMIN_HASH = 'da5c8060d7f3de5fc7aba7fdd418ff11009f70aca445a5248701694e60fb3ba8';
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg':  '.jpg',
  'image/jpg':   '.jpg',
  'image/png':   '.png',
  'image/webp':  '.webp',
  'image/gif':   '.gif',
  'image/avif':  '.avif',
};

const HEIC_TYPES = new Set(['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']);

export const POST: APIRoute = async ({ request }) => {
  const token = (request.headers.get('Authorization') ?? '').replace('Bearer ', '');
  if (token !== ADMIN_HASH) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid form data' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string | null) ?? 'products';

  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!['products', 'clients'].includes(folder)) {
    return new Response(JSON.stringify({ error: 'Invalid folder' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  if (file.size > MAX_SIZE) {
    return new Response(JSON.stringify({ error: 'Archivo demasiado grande (máx 20 MB)' }), {
      status: 413, headers: { 'Content-Type': 'application/json' },
    });
  }

  // HEIC/HEIF: common on iPhone — reject with helpful message
  const mimeType = file.type.toLowerCase();
  if (HEIC_TYPES.has(mimeType) || /\.(heic|heif)$/i.test(file.name)) {
    return new Response(JSON.stringify({
      error: 'Formato HEIC/HEIF no soportado. Abre la foto en tu galería y compártela como JPG antes de subirla.',
    }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Determine extension: prefer the filename's ext, fall back to MIME type
  let ext = path.extname(file.name).toLowerCase();
  if (!ext && MIME_TO_EXT[mimeType]) {
    ext = MIME_TO_EXT[mimeType];
  }

  if (!ALLOWED_EXTS.has(ext)) {
    const allowed = [...ALLOWED_EXTS].join(', ');
    return new Response(JSON.stringify({
      error: `Formato no permitido (${ext || file.type || 'desconocido'}). Usa: ${allowed}`,
    }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Sanitize filename: kebab-case, only safe chars
  const rawBase = path.basename(file.name, path.extname(file.name)) || 'foto';
  const baseName = rawBase
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'foto';

  // Avoid overwriting: add suffix if file exists
  let filename = baseName + ext;
  let counter = 1;
  while (await imageExists(folder as MediaFolder, filename)) {
    filename = `${baseName}-${counter}${ext}`;
    counter++;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await saveImage(folder as MediaFolder, filename, buffer);

  return new Response(JSON.stringify({ ok: true, filename }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
