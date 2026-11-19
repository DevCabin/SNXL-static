import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "About",
  description:
    "ShirtNerdXL is an independent graphic tee brand — bold, humorous, geeky designs in sizes up to 5XL, printed on demand.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-14 md:py-20">
      <SectionTitle>About ShirtNerdXL</SectionTitle>
      <div className="mt-6 space-y-4 text-sm leading-7 text-ink/80">
        <p>
          ShirtNerdXL makes graphic tees for people whose passions don&apos;t fit
          on a billboard — retro monsters, deadpan developer humor, sci-fi love
          letters, jeep things, and jokes that only land if you were there in
          the 1990s.
        </p>
        <p>
          We started on Shopify and grew into a small independent catalog. Today
          the site is a showcase: you browse the designs, pick your size and
          color, and send a request. A human (not a checkout bot) reads it,
          confirms availability and pricing with you by email, and then your
          shirt is printed on demand through our print partner, Gelato.
        </p>
        <p>
          Every design is offered up to 5XL because great jokes don&apos;t stop
          at XL. If you want a design on a different shirt style or product,
          tell us — we love a side quest.
        </p>
      </div>
    </Container>
  );
}
