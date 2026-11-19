import type { ReactNode } from "react";

export default function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`font-display text-3xl uppercase tracking-tight sm:text-4xl ${className}`}>
      {children}
    </h2>
  );
}
