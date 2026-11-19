import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "How ShirtNerdXL shirts ship (printed on demand via Gelato) and what happens if something arrives wrong.",
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingReturnsPage() {
  return (
    <Container className="max-w-3xl py-14 md:py-20">
      <SectionTitle>Shipping &amp; returns</SectionTitle>
      <div className="mt-6 space-y-4 text-sm leading-7 text-ink/80">
        <p>
          Every ShirtNerdXL tee is printed on demand by our print partner,
          Gelato, after your request is confirmed. Because nothing is
          pre-stocked, we don&apos;t publish fixed turnaround promises — your
          confirmation email will include the best current estimate.
        </p>
        <p>
          <strong>Shipping rates &amp; times.</strong> [PLACEHOLDER — OWNER
          APPROVAL: add current Gelato shipping rates and delivery estimates per
          region, or link the confirmation-email estimate policy.]
        </p>
        <p>
          <strong>If something arrives wrong.</strong> Misprint, damage, or the
          wrong size/color? Email us with a photo and we&apos;ll make it right —
          reprint or refund, decided together. [PLACEHOLDER — OWNER APPROVAL:
          confirm the window, e.g. “within 30 days of delivery.”]
        </p>
        <p>
          <strong>Change of mind.</strong> Because shirts are made specifically
          for you, we can&apos;t promise returns for change of mind before or
          after printing. We&apos;ll always talk it through with you first.
        </p>
        <p className="text-xs text-ink/60">
          Nothing on this page is a binding guarantee; final terms are confirmed
          in your order email.
        </p>
      </div>
    </Container>
  );
}
