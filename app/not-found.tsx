import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <div className="flex justify-center">
        <Logo className="text-3xl" />
      </div>
      <h1 className="mt-6 font-display text-3xl uppercase tracking-tight sm:text-4xl">
        404 — this design may have retired
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink/70">
        The page you&apos;re looking for doesn&apos;t exist anymore. The catalog
        below has every design we currently offer.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button href="/designs">Browse all designs</Button>
        <Button href="/contact" className="bg-transparent border border-ink/40 hover:bg-ink/5">
          Contact us
        </Button>
      </div>
    </Container>
  );
}
