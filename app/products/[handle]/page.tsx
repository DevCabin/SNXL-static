import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import Gallery from "@/components/Gallery";
import ProductView from "@/components/ProductView";
import ProductGrid from "@/components/ProductGrid";
import { getByHandle, getProducts, getRelated } from "@/lib/catalog";
import { productMetadata, productJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return getProducts().map(p => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = getByHandle(handle);
  if (!product) return { title: "Design not found" };
  return productMetadata(product);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getByHandle(handle);
  if (!product) notFound();
  const related = getRelated(product);

  return (
    <>
      <Container className="py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-wider text-ink/60">
          <ol className="flex gap-2">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li aria-hidden="true">/</li>
            <li><a href="/designs" className="hover:underline">Designs</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{product.title}</li>
          </ol>
        </nav>
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Gallery images={product.gallery} title={product.title} />
          <ProductView product={product} />
        </div>
        <section className="mt-14 max-w-3xl">
          <SectionTitle className="text-xl sm:text-2xl">About this design</SectionTitle>
          <div
            className="prose-sm mt-4 space-y-3 text-sm leading-7 text-ink/80 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:font-display [&_h2]:uppercase [&_h3]:font-display [&_h3]:uppercase [&_li]:ml-5 [&_li]:list-disc"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtmlSafe }}
          />
        </section>
      </Container>
      {related.length > 0 && (
        <section className="border-t border-ink/10 py-12">
          <Container>
            <SectionTitle className="text-xl sm:text-2xl">Related products</SectionTitle>
            <div className="mt-6">
              <ProductGrid products={related} />
            </div>
          </Container>
        </section>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productJsonLd(product), breadcrumbJsonLd(product)]),
        }}
      />
    </>
  );
}
