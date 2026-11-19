import type { Catalog, Product } from "./types";
import raw from "@/data/catalog.json";
import { FEATURED_HANDLES } from "@/data/config";

const catalog = raw as unknown as Catalog;

export function getCatalog(): Catalog {
  return catalog;
}

export function getProducts(): Product[] {
  return catalog.products;
}

export function getByHandle(handle: string): Product | undefined {
  return catalog.products.find(p => p.handle === handle);
}

export function getFeatured(): Product[] {
  return FEATURED_HANDLES.map(h => getByHandle(h)).filter(
    (p): p is Product => Boolean(p)
  );
}

export function getTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of catalog.products) {
    for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getRelated(product: Product, limit = 4): Product[] {
  return catalog.products
    .filter(p => p.handle !== product.handle && p.tags.some(t => product.tags.includes(t)))
    .slice(0, limit);
}
