export type Badge = 'feat' | 'new' | 'limit';

export interface Product {
  slug: string;
  img: string;
  alt: string;
  badge?: Badge;
  category: string;
  name: string;
  desc: string;
  price: string;
  active?: boolean;
}

export interface Section {
  id: string;
  label: string;
  title: string;
  titleEm: string;
  alt: boolean;
  products: Product[];
}

/*
 * Los datos se leen en runtime (no en build) para que lo guardado desde el
 * panel admin se refleje en el sitio sin redeploy. Las páginas que los usan
 * son server-rendered (prerender = false).
 */
import { getCatalog } from '../lib/storage';

export async function getSections(): Promise<Section[]> {
  const { sections } = await getCatalog();
  return sections.map((s) => ({
    ...s,
    products: s.products.filter((p) => p.active !== false),
  }));
}

export async function getClientImages(): Promise<string[]> {
  return (await getCatalog()).clientImages;
}

export async function allProducts() {
  const sections = await getSections();
  return sections.flatMap((s) =>
    s.products.map((p) => ({ ...p, sectionId: s.id, sectionTitle: `${s.title} ${s.titleEm}` }))
  );
}
