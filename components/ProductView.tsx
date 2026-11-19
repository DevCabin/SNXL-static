"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { SUPPORTED_SIZES, priceForSize, formatPrice } from "@/lib/pricing";
import {
  strictSizes,
  strictColors,
  preferenceColors,
  bestMatchSku,
} from "@/lib/variants";
import VariantSelector from "./VariantSelector";
import RequestForm from "./RequestForm";
import { REQUEST_COPY } from "@/data/config";

export default function ProductView({ product }: { product: Product }) {
  const strict = product.selectionMode === "strict";
  const initialSize = useMemo(
    () => (strict ? strictSizes(product)[0] : SUPPORTED_SIZES[0]),
    [product, strict]
  );
  const initialColor = useMemo(
    () =>
      strict
        ? strictColors(product, initialSize)[0] || ""
        : preferenceColors(product)[0],
    [product, strict, initialSize]
  );
  const [size, setSize] = useState(initialSize);
  const [color, setColor] = useState(initialColor);

  function changeSize(next: string) {
    setSize(next);
    if (strict) {
      const colors = strictColors(product, next);
      setColor(colors[0] || "");
    }
  }

  const price = priceForSize(size);
  const sku = bestMatchSku(product, size, color);

  return (
    <div>
      <h1 className="font-display text-2xl uppercase leading-tight tracking-tight sm:text-3xl">
        {product.title}
      </h1>
      <p className="mt-3 text-lg font-bold">
        {price !== null ? formatPrice(price) : formatPrice(product.fromPrice)}
        <span className="ml-2 text-xs font-normal uppercase tracking-wider text-ink/60">
          shirt only — shipping &amp; taxes not included
        </span>
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-ink/60">
        L–3XL {formatPrice(24.99)} · 4XL–5XL {formatPrice(26.99)}
      </p>

      <div className="mt-6">
        <VariantSelector
          product={product}
          size={size}
          color={color}
          onSize={changeSize}
          onColor={setColor}
        />
      </div>

      <div className="mt-8 border border-ink/15 bg-white p-5">
        <p className="text-sm leading-6 text-ink/80">{REQUEST_COPY.intro}</p>
        <div className="mt-4">
          <RequestForm
            productTitle={product.title}
            productHandle={product.handle}
            sku={sku}
            size={size}
            color={color}
            displayedPrice={price !== null ? formatPrice(price) : ""}
          />
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-ink/60">
        Sending a request is not a purchase and does not place an order. We
        confirm availability, shipping and payment by email before anything is
        printed.
      </p>
    </div>
  );
}
