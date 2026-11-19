"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/data/config";
import Logo from "./Logo";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = pathname;

  return (
    <header className="bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-4 md:justify-center md:py-6">
          <Logo className="text-2xl md:text-3xl" />
          <button
            type="button"
            className="md:hidden p-2 -mr-2"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(v => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        <nav aria-label="Main" className="hidden md:block pb-4">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-2">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`text-xs uppercase tracking-widest hover:text-lime ${current === l.href ? "underline underline-offset-8" : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {open && (
          <nav id="mobile-nav" aria-label="Main" className="md:hidden pb-4">
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-widest hover:text-lime"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
