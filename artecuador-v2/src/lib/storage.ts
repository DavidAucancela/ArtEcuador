/**
 * Capa de almacenamiento del catálogo e imágenes.
 *
 * Dos modos según variables de entorno:
 *  - S3/R2 (producción): si S3_BUCKET + S3_ENDPOINT + S3_ACCESS_KEY_ID +
 *    S3_SECRET_ACCESS_KEY están definidas, products.json y las imágenes
 *    subidas viven en el bucket y sobreviven a los redeploys de Railway.
 *  - Filesystem (dev / sin configurar): mismo comportamiento de siempre,
 *    lee y escribe src/data/products.json y media/ localmente.
 */
import fs from 'fs/promises';
import path from 'path';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import type { Section } from '../data/products';

export interface Catalog {
  sections: Section[];
  clientImages: string[];
}

const CATALOG_KEY = 'data/products.json';

const LOCAL_JSON = path.join(process.cwd(), 'src/data/products.json');
// Dev: public/media/ (symlink → ../../media)
// Producción (node standalone): dist/client/media/ (donde lee el static server)
const LOCAL_MEDIA = import.meta.env.PROD
  ? path.join(process.cwd(), 'dist', 'client', 'media')
  : path.join(process.cwd(), 'public', 'media');

const S3_BUCKET = process.env.S3_BUCKET;
const s3Enabled = Boolean(
  S3_BUCKET && process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
);

let s3: S3Client | null = null;
function client(): S3Client {
  if (!s3) {
    s3 = new S3Client({
      region: process.env.S3_REGION ?? 'auto',
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }
  return s3;
}

/* ── Catálogo ──────────────────────────────────────────────────── */

// Cache en memoria para no pegarle al bucket en cada componente/request.
// Se invalida al guardar (mismo proceso Node) y expira por TTL como red de
// seguridad ante ediciones externas al bucket.
const CACHE_TTL_MS = 60_000;
let cached: { catalog: Catalog; at: number } | null = null;

async function readLocalCatalog(): Promise<Catalog> {
  return JSON.parse(await fs.readFile(LOCAL_JSON, 'utf-8'));
}

export async function getCatalog(): Promise<Catalog> {
  if (!s3Enabled) return readLocalCatalog();

  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.catalog;

  let catalog: Catalog;
  try {
    const res = await client().send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: CATALOG_KEY }));
    catalog = JSON.parse(await res.Body!.transformToString());
  } catch (e: any) {
    if (e?.name !== 'NoSuchKey') throw e;
    // Primera vez con el bucket vacío: sembrar con el JSON del build
    catalog = await readLocalCatalog();
    await client().send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: CATALOG_KEY,
      Body: JSON.stringify(catalog, null, 2),
      ContentType: 'application/json',
    }));
  }
  cached = { catalog, at: Date.now() };
  return catalog;
}

export async function saveCatalog(catalog: Catalog): Promise<void> {
  if (s3Enabled) {
    await client().send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: CATALOG_KEY,
      Body: JSON.stringify(catalog, null, 2),
      ContentType: 'application/json',
    }));
    cached = { catalog, at: Date.now() };
  } else {
    await fs.writeFile(LOCAL_JSON, JSON.stringify(catalog, null, 2), 'utf-8');
  }
}

/* ── Imágenes ──────────────────────────────────────────────────── */

export type MediaFolder = 'products' | 'clients';

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
};

export function contentTypeFor(filename: string): string {
  return CONTENT_TYPES[path.extname(filename).toLowerCase()] ?? 'application/octet-stream';
}

async function listLocalImages(folder: MediaFolder): Promise<string[]> {
  try {
    const files = await fs.readdir(path.join(LOCAL_MEDIA, folder));
    return files.filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()));
  } catch {
    return [];
  }
}

/** Une las imágenes del repo (baked en el build) con las subidas al bucket. */
export async function listImages(folder: MediaFolder): Promise<string[]> {
  const names = new Set(await listLocalImages(folder));
  if (s3Enabled) {
    const res = await client().send(new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: `media/${folder}/`,
    }));
    for (const obj of res.Contents ?? []) {
      const name = obj.Key!.slice(`media/${folder}/`.length);
      if (name && IMAGE_EXTS.has(path.extname(name).toLowerCase())) names.add(name);
    }
  }
  return [...names].sort();
}

export async function imageExists(folder: MediaFolder, filename: string): Promise<boolean> {
  try {
    await fs.access(path.join(LOCAL_MEDIA, folder, filename));
    return true;
  } catch { /* sigue al bucket */ }
  if (!s3Enabled) return false;
  try {
    await client().send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: `media/${folder}/${filename}` }));
    return true;
  } catch {
    return false;
  }
}

export async function deleteImage(folder: MediaFolder, filename: string): Promise<void> {
  // Borra la copia local (dev) y/o la subida al bucket. Las imágenes "baked"
  // del repo solo desaparecen del contenedor en ejecución (efímero).
  try {
    await fs.unlink(path.join(LOCAL_MEDIA, folder, filename));
  } catch { /* puede no existir localmente */ }
  if (s3Enabled) {
    try {
      await client().send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: `media/${folder}/${filename}` }));
    } catch { /* puede no existir en el bucket */ }
  }
}

export async function saveImage(folder: MediaFolder, filename: string, buffer: Buffer): Promise<void> {
  if (s3Enabled) {
    await client().send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: `media/${folder}/${filename}`,
      Body: buffer,
      ContentType: contentTypeFor(filename),
    }));
  } else {
    const dir = path.join(LOCAL_MEDIA, folder);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), buffer);
  }
}

/* ── Analítica (contador de visitas) ──────────────────────────── */

const ANALYTICS_KEY = 'data/analytics.json';
const LOCAL_ANALYTICS = path.join(process.cwd(), 'src/data/analytics.json');

/** Lee el blob de analítica. Devuelve null si aún no existe. */
export async function getAnalyticsRaw(): Promise<any | null> {
  if (s3Enabled) {
    try {
      const res = await client().send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: ANALYTICS_KEY }));
      return JSON.parse(await res.Body!.transformToString());
    } catch (e: any) {
      if (e?.name === 'NoSuchKey') return null;
      throw e;
    }
  }
  try {
    return JSON.parse(await fs.readFile(LOCAL_ANALYTICS, 'utf-8'));
  } catch {
    return null;
  }
}

export async function saveAnalyticsRaw(data: any): Promise<void> {
  if (s3Enabled) {
    await client().send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: ANALYTICS_KEY,
      Body: JSON.stringify(data),
      ContentType: 'application/json',
    }));
  } else {
    await fs.writeFile(LOCAL_ANALYTICS, JSON.stringify(data, null, 2), 'utf-8');
  }
}

/** Para la ruta proxy /media/* — devuelve null si no existe en el bucket. */
export async function getImageFromBucket(key: string): Promise<{ body: Uint8Array; contentType: string } | null> {
  if (!s3Enabled) return null;
  try {
    const res = await client().send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    return {
      body: await res.Body!.transformToByteArray(),
      contentType: res.ContentType ?? contentTypeFor(key),
    };
  } catch {
    return null;
  }
}
