"use client";

import type { Product } from "@/lib/types";
import { SUPPORTED_SIZES } from "@/lib/pricing";
import {
  strictSizes,
  strictColors,
  preferenceColors,
} from "@/lib/variants";
import { REQUEST_COPY } from "@/data/config";

function OptionButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-14 border px-3 py-2 text-xs font-bold uppercase tracking-wider ${
        active
          ? "border-ink bg-ink text-white"
          : "border-ink/30 bg-white hover:border-ink"
      }`}
    >
      {label}
    </button>
  );
}

export default function VariantSelector({
  product,
  size,
  color,
  onSize,
  onColor,
}: {
  product: Product;
  size: string;
  color: string;
  onSize: (s: string) => void;
  onColor: (c: string) => void;
}) {
  const strict = product.selectionMode === "strict";
  const sizes = strict ? strictSizes(product) : [...SUPPORTED_SIZES];
  const colors = strict ? strictColors(product, size) : preferenceColors(product);

  return (
    <div className="space-y-5">
      {!strict && (
        <p className="border border-ink/20 bg-white px-3 py-2 text-xs uppercase tracking-wider text-ink/70">
          {REQUEST_COPY.preferenceLabel}
        </p>
      )}
      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-widest">Size</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map(s => (
            <OptionButton key={s} label={s} active={size === s} onClick={() => onSize(s)} />
          ))}
        </div>
      </fieldset>
      {colors.length > 0 && (
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-widest">Color</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map(c => (
              <OptionButton key={c} label={c} active={color === c} onClick={() => onColor(c)} />
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
