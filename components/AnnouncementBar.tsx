import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-lime text-ink">
      <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs font-bold uppercase tracking-wider sm:px-6">
        <Link href="/how-ordering-works" className="hover:underline underline-offset-4">
          No payment online — request any design up to 5XL and we&apos;ll handle the rest →
        </Link>
      </p>
    </div>
  );
}
