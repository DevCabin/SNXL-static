import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import RequestForm from "@/components/RequestForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions, custom requests, or a design on a different product? Send ShirtNerdXL a message — we reply by email.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container className="max-w-3xl py-14 md:py-20">
      <SectionTitle>Contact</SectionTitle>
      <p className="mt-4 text-sm leading-7 text-ink/80">
        Questions about a design, sizing, or something custom? Send a message
        and we&apos;ll get back to you by email. For a specific shirt, the
        request form on its product page is fastest.
      </p>
      <div className="mt-8 border border-ink/15 bg-white p-5">
        <RequestForm />
      </div>
    </Container>
  );
}
