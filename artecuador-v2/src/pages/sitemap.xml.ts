export const prerender = false;

import { allProducts } from '../data/products';

const siteUrl = 'https://artecuador.com';

export async function GET() {
  const now = new Date().toISOString().split('T')[0];
  const products = await allProducts();
  const productUrls = products
    .map((p) => `  <url><loc>${siteUrl}/productos/${p.slug}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
${productUrls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
