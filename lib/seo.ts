import type { Metadata } from "next";
import type { Product } from "./types";
import { SITE_URL } from "@/data/config";

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function productDescription(product: Product): string {
  const text = stripHtml(product.descriptionHtmlSafe);
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}…` : text;
}

export function productMetadata(product: Product): Metadata {
  return {
    title: product.title,
    description: productDescription(product),
    alternates: { canonical: product.urlPath },
    openGraph: {
      title: product.title,
      description: productDescription(product),
      url: product.urlPath,
      type: "website",
      images: product.primaryImage
        ? [
            {
              url: product.primaryImage.url,
              width: product.primaryImage.width,
              height: product.primaryImage.height,
              alt: product.primaryImage.alt,
            },
          ]
        : [],
    },
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: productDescription(product),
    image: product.gallery.slice(0, 5).map(g => `${SITE_URL}${g.url}`),
    brand: { "@type": "Brand", name: "ShirtNerdXL" },
  };
}

export function breadcrumbJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Designs", item: `${SITE_URL}/designs` },
      { "@type": "ListItem", position: 3, name: product.title, item: `${SITE_URL}${product.urlPath}` },
    ],
  };
}
