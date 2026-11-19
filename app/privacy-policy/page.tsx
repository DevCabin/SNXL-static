import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ShirtNerdXL handles the information you send through its request forms.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="max-w-3xl py-14 md:py-20">
      <SectionTitle>Privacy policy</SectionTitle>
      <div className="mt-6 space-y-4 text-sm leading-7 text-ink/80">
        <p>
          This website is a catalog with request forms. There is no account
          system, no checkout, and no advertising trackers installed by us.
        </p>
        <p>
          <strong>What we collect.</strong> When you send a request or contact
          form we receive the information you type: your name, email address,
          the shirt size/color you selected, the product reference, and any
          notes you add.
        </p>
        <p>
          <strong>How it is handled.</strong> Forms are delivered by Formspree,
          our form processor. Submissions are emailed to us so we can answer
          your request. We do not sell or share your information with anyone
          else, and we do not use it for automated marketing.
        </p>
        <p>
          <strong>What we never collect.</strong> We never ask for card numbers,
          passwords, or other sensitive payment information through this site.
        </p>
        <p>
          <strong>Retention.</strong> [PLACEHOLDER — OWNER APPROVAL: state how
          long request emails are kept, e.g. “for as long as needed to handle
          your request, then deleted.”]
        </p>
        <p>
          <strong>Your choices.</strong> You can email us at any time to ask
          what we hold about you or to have it deleted. [PLACEHOLDER — OWNER
          APPROVAL: add contact email address.]
        </p>
      </div>
    </Container>
  );
}
