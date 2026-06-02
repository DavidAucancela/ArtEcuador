export const prerender = false;

import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

const ADMIN_HASH = 'da5c8060d7f3de5fc7aba7fdd418ff11009f70aca445a5248701694e60fb3ba8';
const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

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
    return new Response(JSON.stringify({ error: 'Archivo demasiado grande (máx 10 MB)' }), {
      status: 413, headers: { 'Content-Type': 'application/json' },
    });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTS.has(ext)) {
    return new Response(JSON.stringify({ error: 'Tipo de archivo no permitido' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Sanitize filename: kebab-case, only safe chars
  const baseName = path.basename(file.name, ext)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  const destDir = path.join(process.cwd(), 'public', 'media', folder);
  await fs.mkdir(destDir, { recursive: true });

  // Avoid overwriting: add suffix if file exists
  let filename = baseName + ext;
  let counter = 1;
  while (true) {
    try {
      await fs.access(path.join(destDir, filename));
      filename = `${baseName}-${counter}${ext}`;
      counter++;
    } catch {
      break; // file doesn't exist, safe to write
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(destDir, filename), buffer);

  return new Response(JSON.stringify({ ok: true, filename }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
