import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-display uppercase tracking-tight text-white ${className}`}
      aria-label="ShirtNerdXL home"
    >
      ShirtNerd<span className="text-brandred">XL</span>
    </Link>
  );
}
