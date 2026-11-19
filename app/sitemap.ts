import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { SITE_URL } from "@/data/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/designs",
    "/about",
    "/how-ordering-works",
    "/contact",
    "/privacy-policy",
    "/shipping-returns",
  ].map(path => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productRoutes = getProducts().map(p => ({
    url: `${SITE_URL}${p.urlPath}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
