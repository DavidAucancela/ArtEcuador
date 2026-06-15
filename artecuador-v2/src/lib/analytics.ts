/**
 * Contador de visitas propio.
 *
 * Registra cada visita de las páginas públicas: total, por día, por país,
 * por ciudad, por página, y una lista de las visitas más recientes. La ciudad
 * y el país se resuelven con la API gratuita de ip-api.com a partir de la IP
 * del visitante (la app corre en Railway sin proxy de Cloudflare, así que no
 * hay headers de geolocalización).
 *
 * Los datos viven en el bucket (data/analytics.json) o en el filesystem en dev,
 * vía getAnalyticsRaw/saveAnalyticsRaw de storage.ts.
 */
import { getAnalyticsRaw, saveAnalyticsRaw } from './storage';

export interface VisitRecord {
  at: string;          // ISO timestamp
  path: string;
  city: string;
  country: string;
  countryCode: string;
}

export interface Analytics {
  total: number;
  byDay: Record<string, number>;       // "YYYY-MM-DD" → count
  byCountry: Record<string, number>;   // countryCode → count
  countryNames: Record<string, string>;// countryCode → nombre legible
  byCity: Record<string, number>;      // "Ciudad, CC" → count
  byPath: Record<string, number>;      // ruta → count
  recent: VisitRecord[];               // últimas 50, más reciente primero
  updatedAt: string;
}

const RECENT_MAX = 50;

function emptyAnalytics(): Analytics {
  return {
    total: 0,
    byDay: {},
    byCountry: {},
    countryNames: {},
    byCity: {},
    byPath: {},
    recent: [],
    updatedAt: new Date().toISOString(),
  };
}

// Cache en memoria del mismo proceso para no leer el bucket en cada visita.
let cache: Analytics | null = null;

export async function getStats(): Promise<Analytics> {
  if (cache) return cache;
  const raw = (await getAnalyticsRaw()) as Analytics | null;
  cache = raw ? { ...emptyAnalytics(), ...raw } : emptyAnalytics();
  return cache;
}

function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  if (ip === '::1' || ip.startsWith('127.') || ip === 'localhost') return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.')) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  if (ip.startsWith('::ffff:127.') || ip.startsWith('fc') || ip.startsWith('fd')) return true;
  return false;
}

interface Geo { city: string; country: string; countryCode: string; }

async function geolocate(ip: string): Promise<Geo | null> {
  if (isPrivateIp(ip)) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,city`,
      { signal: ctrl.signal },
    );
    clearTimeout(t);
    const d: any = await res.json();
    if (d?.status !== 'success') return null;
    return { city: d.city || '', country: d.country || '', countryCode: d.countryCode || '' };
  } catch {
    return null;
  }
}

const inc = (obj: Record<string, number>, key: string) => { obj[key] = (obj[key] || 0) + 1; };

export async function recordVisit(ip: string, rawPath: string): Promise<void> {
  const a = await getStats();
  const path = (rawPath || '/').slice(0, 200);
  const geo = await geolocate(ip);

  const day = new Date().toISOString().slice(0, 10);
  a.total++;
  inc(a.byDay, day);
  inc(a.byPath, path);

  let city = 'Desconocida';
  let country = 'Desconocido';
  let cc = '??';
  if (geo) {
    cc = geo.countryCode || '??';
    country = geo.country || 'Desconocido';
    inc(a.byCountry, cc);
    a.countryNames[cc] = country;
    if (geo.city) {
      city = geo.city;
      inc(a.byCity, `${geo.city}, ${cc}`);
    }
  } else {
    inc(a.byCountry, '??');
    a.countryNames['??'] = 'Desconocido';
  }

  a.recent.unshift({ at: new Date().toISOString(), path, city, country, countryCode: cc });
  if (a.recent.length > RECENT_MAX) a.recent.length = RECENT_MAX;
  a.updatedAt = new Date().toISOString();

  cache = a;
  await saveAnalyticsRaw(a);
}
