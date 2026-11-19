import Link from "next/link";
import { FOOTER_LINKS } from "@/data/config";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:flex md:items-start md:gap-16">
        <Logo className="text-4xl md:text-5xl shrink-0" />
        <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 md:mt-2">
          Original designs for all your passions (and a few crowd-pleasers
          too)—all available up to 5XL. Take a look around and see what sparks
          your nerdy soul. Want a design on a different shirt style or product?
          Just hit the{" "}
          <Link href="/contact" className="underline underline-offset-4 hover:text-lime">
            contact page
          </Link>{" "}
          — we&apos;ll make it happen.
        </p>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs uppercase tracking-wider text-white/70 hover:text-lime">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-xs text-white/60">
            © 2026 Shirt Nerd XL. Requests only — no payment is collected on this site.
          </p>
        </div>
      </div>
    </footer>
  );
}
