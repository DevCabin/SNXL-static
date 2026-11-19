"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/lib/types";

export default function Gallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [idx, setIdx] = useState(0);
  const active = images[idx] || images[0];
  if (!active) return null;
  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt || title}
          width={active.width}
          height={active.height}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={idx === 0}
          className="h-full w-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label={`${title} image gallery`}>
          {images.map((im, i) => (
            <li key={im.url + i} className="shrink-0">
              <button
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`View image ${i + 1} of ${images.length}`}
                aria-current={i === idx}
                className={`block border-2 bg-white ${i === idx ? "border-ink" : "border-transparent hover:border-ink/40"}`}
              >
                <Image
                  src={im.url}
                  alt=""
                  width={im.width}
                  height={im.height}
                  sizes="72px"
                  loading="lazy"
                  className="h-24 w-20 object-contain p-1"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
