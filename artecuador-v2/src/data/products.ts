import data from './products.json';

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

const raw = data as { sections: Section[]; clientImages: string[] };

export const sections: Section[] = raw.sections.map((s) => ({
  ...s,
  products: s.products.filter((p) => p.active !== false),
}));

export const clientImages = raw.clientImages;

export function allProducts() {
  return sections.flatMap((s) =>
    s.products.map((p) => ({ ...p, sectionId: s.id, sectionTitle: `${s.title} ${s.titleEm}` }))
  );
}
