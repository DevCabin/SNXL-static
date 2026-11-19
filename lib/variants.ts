import type { Product, VariantCombo } from "./types";
import { SUPPORTED_SIZES } from "./pricing";

export const PREFERENCE_COLOR_FALLBACK = "As pictured";

/** Strict mode: only catalog-known combos whose size we support. */
export function strictSizes(product: Product): string[] {
  return SUPPORTED_SIZES.filter(s =>
    product.knownCombos.some(c => c.size === s)
  );
}

export function strictColors(product: Product, size: string): string[] {
  return [...new Set(
    product.knownCombos.filter(c => c.size === size && c.color).map(c => c.color)
  )];
}

export function strictCombo(
  product: Product,
  size: string,
  color: string
): VariantCombo | undefined {
  return product.knownCombos.find(c => c.size === size && c.color === color);
}

/** Preference mode: supported sizes + known colors (or fallback). */
export function preferenceColors(product: Product): string[] {
  return product.colorsKnown.length ? product.colorsKnown : [PREFERENCE_COLOR_FALLBACK];
}

/** Best SKU to attach to a request: exact combo → size match → color match → null. */
export function bestMatchSku(
  product: Product,
  size: string,
  color: string
): string | null {
  const exact = product.knownCombos.find(c => c.size === size && c.color === color);
  if (exact) return exact.sku;
  const bySize = product.knownCombos.find(c => c.size === size);
  if (bySize) return bySize.sku;
  const byColor = product.knownCombos.find(c => c.color === color);
  if (byColor) return byColor.sku;
  return null;
}
