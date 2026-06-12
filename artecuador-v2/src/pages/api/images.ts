export const prerender = false;

import type { APIRoute } from 'astro';
import { listImages } from '../../lib/storage';

export const GET: APIRoute = async () => {
  const [products, clients] = await Promise.all([
    listImages('products'),
    listImages('clients'),
  ]);
  return new Response(JSON.stringify({ products, clients }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
