import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-block bg-lime px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:bg-lime-dark disabled:cursor-not-allowed disabled:opacity-60";

export default function Button({
  href,
  children,
  type = "button",
  disabled,
  className = "",
}: {
  href?: string;
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} className={`${base} ${className}`}>
      {children}
    </button>
  );
}
