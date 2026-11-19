"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import ProductGrid from "./ProductGrid";

export default function CatalogControls({
  products,
  tags,
  initialTag,
}: {
  products: Product[];
  tags: { tag: string; count: number }[];
  initialTag?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState(initialTag || "");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter(p => {
      if (tag && !p.tags.includes(tag)) return false;
      if (!needle) return true;
      return (
        p.title.toLowerCase().includes(needle) ||
        p.tags.some(t => t.toLowerCase().includes(needle))
      );
    });
  }, [products, q, tag]);

  function chooseTag(next: string) {
    setTag(next);
    router.replace(next ? `/designs?tag=${encodeURIComponent(next)}` : "/designs", {
      scroll: false,
    });
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="md:w-72">
          <label htmlFor="design-search" className="sr-only">
            Search designs
          </label>
          <input
            id="design-search"
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search designs…"
            className="w-full border border-ink/30 bg-white px-3 py-2 text-sm placeholder:text-ink/40"
          />
        </div>
        <p className="text-xs uppercase tracking-wider text-ink/60" aria-live="polite">
          {filtered.length} design{filtered.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
        <button
          type="button"
          onClick={() => chooseTag("")}
          aria-pressed={!tag}
          className={`px-3 py-1 text-xs uppercase tracking-wider border ${!tag ? "bg-ink text-white border-ink" : "border-ink/30 bg-white hover:border-ink"}`}
        >
          All
        </button>
        {tags.map(t => (
          <button
            key={t.tag}
            type="button"
            onClick={() => chooseTag(t.tag)}
            aria-pressed={tag === t.tag}
            className={`px-3 py-1 text-xs uppercase tracking-wider border ${tag === t.tag ? "bg-ink text-white border-ink" : "border-ink/30 bg-white hover:border-ink"}`}
          >
            {t.tag} ({t.count})
          </button>
        ))}
      </div>
      <div className="mt-10">
        {filtered.length ? (
          <ProductGrid products={filtered} />
        ) : (
          <p className="py-16 text-center text-sm text-ink/60">
            No designs match — try another search or tag.
          </p>
        )}
      </div>
    </>
  );
}
