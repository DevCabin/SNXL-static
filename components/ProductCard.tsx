import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, FROM_PRICE } from "@/lib/pricing";

export default function ProductCard({ product }: { product: Product }) {
  // Get the image to display - prefer primaryImage, fallback to first gallery image
  let img = null;
  
  if (product.primaryImage) {
    img = product.primaryImage;
  } else if (product.gallery && product.gallery.length > 0) {
    img = product.gallery[0];
  }
  
  return (
    <li>
      <Link
        href={product.urlPath}
        className="group block"
        aria-label={`${product.title}, from ${formatPrice(FROM_PRICE)}`}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
          {img ? (
            <Image
              src={img.url}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase text-ink/50">
              Image coming soon
            </div>
          )}
        </div>
        <h3 className="mt-3 text-center text-xs font-bold uppercase leading-5 tracking-wide group-hover:underline">
          {product.title}
        </h3>
        <p className="mt-1 text-center text-sm text-ink/70">
          From {formatPrice(FROM_PRICE)}
        </p>
      </Link>
    </li>
  );
}
