import type { Metadata } from "next";
import { getProducts, getTags } from "@/lib/catalog";
import CatalogControls from "@/components/CatalogControls";

export const metadata: Metadata = {
  title: "All Designs",
  description:
    "Browse every ShirtNerdXL graphic tee — funny, sci-fi, gamer and random nerdy designs in sizes up to 5XL.",
  alternates: { canonical: "/designs" },
};

export default async function DesignsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const products = getProducts();
  const tags = getTags();
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <h1 className="font-display text-3xl uppercase tracking-tight sm:text-4xl">
          All designs
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink/70">
          {products.length} original designs. Search or filter by tag — every
          design is available up to 5XL and ordered by request, never by
          checkout.
        </p>
        <div className="mt-8">
          <CatalogControls products={products} tags={tags} initialTag={tag} />
        </div>
      </div>
    </div>
  );
}
