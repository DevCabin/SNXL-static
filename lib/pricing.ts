/** Single source of truth for customer-facing pricing (PLAN D2). */
export const SUPPORTED_SIZES = ["L", "XL", "2XL", "3XL", "4XL", "5XL"] as const;

export const STANDARD_PRICES: Record<string, number> = {
  L: 24.99,
  XL: 24.99,
  "2XL": 24.99,
  "3XL": 24.99,
  "4XL": 26.99,
  "5XL": 26.99,
};

export const FROM_PRICE = Math.min(...Object.values(STANDARD_PRICES));

export function priceForSize(size: string): number | null {
  return STANDARD_PRICES[size] ?? null;
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
