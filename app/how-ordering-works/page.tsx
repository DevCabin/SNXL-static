import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "How Ordering Works",
  description:
    "ShirtNerdXL uses shirt requests instead of checkout: browse, request, we confirm by email, then your tee is printed on demand via Gelato.",
  alternates: { canonical: "/how-ordering-works" },
};

const steps = [
  ["Browse the catalog", "Every design lists its available sizes and colors. Nothing is hidden behind an account or a cart."],
  ["Send a shirt request", "Use the “Request This Shirt” form on any product page. No payment is collected on this site — ever."],
  ["We confirm by email", "A human replies to confirm availability, your size and color, shipping cost and payment details. Submitting a request does not place an order or charge you."],
  ["Printed & shipped", "Once we've agreed the details, your tee is printed on demand by our print partner Gelato and shipped to you. There is no automatic fulfillment — every order is placed by hand."],
];

export default function HowOrderingWorksPage() {
  return (
    <Container className="max-w-3xl py-14 md:py-20">
      <SectionTitle>How ordering works</SectionTitle>
      <p className="mt-4 text-sm leading-7 text-ink/80">
        ShirtNerdXL is an inquiry-based catalog, not a checkout store. Here is
        exactly what happens when you want a shirt:
      </p>
      <ol className="mt-8 space-y-6">
        {steps.map(([title, body], i) => (
          <li key={title} className="bg-white p-6">
            <p className="font-display text-lg uppercase tracking-tight">
              {i + 1}. {title}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink/70">{body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-8 border border-ink/20 bg-white p-4 text-xs leading-5 text-ink/70">
        Please note: we never ask for card numbers, passwords or other sensitive
        payment information through this website or its forms. Payment
        arrangements happen only in our email conversation with you.
      </p>
    </Container>
  );
}
