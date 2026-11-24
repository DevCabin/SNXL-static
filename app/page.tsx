import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import ProductGrid from "@/components/ProductGrid";
import { getFeatured } from "@/lib/catalog";

export default function HomePage() {
  const featured = getFeatured();
  return (
    <>
      <section className="bg-charcoal text-white">
        <Container className="py-16 md:py-24 text-center">
          <h1 className="font-display text-4xl uppercase leading-tight tracking-tight sm:text-6xl">
            Wear your <span className="text-brandred">obsession</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Bold, humorous, geeky graphic tees — retro monsters, deadpan jokes,
            pop-culture love letters — printed on demand and available in sizes
            up to 5XL. No carts, no checkout: pick a design, send a request, and
            we&apos;ll handle the rest personally.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button href="/designs">Browse all designs</Button>
            <Button href="/how-ordering-works" className="bg-transparent text-white border border-white/40 hover:bg-white/10">
              How requests work
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <SectionTitle>Featured designs</SectionTitle>
          <div className="mt-8">
            <ProductGrid products={featured} />
          </div>
          <div className="mt-12 text-center">
            <Button href="/designs">View all</Button>
          </div>
        </Container>
      </section>

      <section className="bg-lime text-ink">
        <Container className="py-10 text-center">
          <p className="font-display text-2xl uppercase tracking-tight sm:text-3xl">
            Every design up to 5XL
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm font-bold uppercase tracking-wider">
            Great jokes don&apos;t stop at XL. Inclusive sizing on the whole catalog.
          </p>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <SectionTitle>How shirt requests work</SectionTitle>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              ["1. Browse", "Find a design you love and pick your size and color on its page."],
              ["2. Request", "Send the request form. No payment is collected — this is not a purchase."],
              ["3. We confirm", "We email you to confirm availability, shipping and payment, then print it via Gelato."],
            ].map(([title, body]) => (
              <li key={title} className="bg-white p-6">
                <p className="font-display text-lg uppercase tracking-tight">{title}</p>
                <p className="mt-3 text-sm leading-6 text-ink/70">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
