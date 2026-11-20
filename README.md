# ShirtNerdXL 2.0 — Static Next.js Catalog

**Version 2.1.0** (see `package.json`) — feature-complete storefront: 53 static product pages, request-form ordering, full SEO, self-hosted images and favicon. Pre-deployment state: all validation gates passing; owner tasks pending (see below).

Inquiry-based T-shirt storefront for shirtnerdxl.com. Next.js (TypeScript, App Router) + Tailwind CSS v4, fully static-generated, hosted on Vercel. **No cart, no checkout, no database, no Shopify, no Stripe, no Gelato API.** Customers browse designs, pick size/color, and send a Formspree request; the owner confirms and fulfills manually via Gelato.

> Resumable agent build plan & progress log: see `PLAN.md`.

## Quick start

```bash
node --version          # 20+
npm install
npm run dev             # http://localhost:3000
npm run build && npm start
```

Product data is generated, never hand-edited:

```bash
npm run optimize-images   # one-time; re-encodes public/products (masters in image-masters/)
npm run normalize         # products.local.json -> data/catalog.json + data/review-flags.json
npm run validate          # static QA gates (run after npm run build)
```

## Data pipeline

1. `products.local.json` (from the image-rescue kit) is the source catalog: 53 products, local image paths.
2. `scripts/optimize-images.mjs` keeps `public/products/` under Vercel's 100 MB Hobby static-upload cap (WebP, ≤1400 px). Originals live in `image-masters/` (gitignored — back it up!).
3. `scripts/normalize-catalog.mjs` sanitizes HTML, fixes alt text, reads image dimensions, splits variants into known combos vs unreconciled rows (see `reports/variant-review.md`), and applies the supported-size rule (L–5XL).
4. To swap catalog sources, re-run normalize with a different input — components never change.

## Pricing

Centralized in `lib/pricing.ts`: L–3XL $24.99, 4XL–5XL $26.99. Original Shopify prices are preserved per variant as `originalPrice` (not displayed). Sizes outside L–5XL are hidden pending owner review.

## Variant selection (hybrid model)

- **strict** — product has catalog-known size/color combos in L–5XL: only those exact combos are selectable.
- **preference** — otherwise: standard L–5XL sizes + known colors, labeled "Request preference — not confirmed availability". The request carries size/color text plus the best-match SKU when known.
- Ambiguous variants are preserved and listed in `data/review-flags.json` + `reports/variant-review.md`.

## Formspree

Single shared endpoint `https://formspree.io/f/xoedlbzy` (constant in `data/config.ts`). JSON POST with `Accept: application/json`; honeypot field `_gotcha`; success shown only on HTTP 200. Optional: enable Turnstile in the Formspree dashboard.

## Environment variables

| Var | Required | Default | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | no | `https://shirtnerdxl.com` | Canonical/OG/sitemap base URL |

## Deployment (Vercel)

1. Push this repo to GitHub; in Vercel: **Add New → Project → import repo**.
2. Framework preset: Next.js (auto). Build command `next build`, output auto. No env vars required for first deploy.
3. Deploy → preview URL → smoke-test products, form, sitemap.
4. Production domain: add `shirtnerdxl.com` + `www` in Vercel project settings and follow the DNS checklist below. **Do not switch DNS or cancel Shopify without owner approval.**

### DNS migration checklist (owner)
- [ ] Lower DNS TTL to 300 s at least 24 h before switching.
- [ ] In Vercel: add apex domain (A/ALIAS per Vercel instructions) and `www` (CNAME).
- [ ] Wait for Vercel certificate "Verified/Issued".
- [ ] Switch DNS records; verify https://shirtnerdxl.com and www resolve to Vercel.
- [ ] Keep Shopify alive until propagation is confirmed, then run the pre-cancellation checklist.

### Pre-cancellation Shopify checklist (owner)
- [ ] Image archive verified (`reports/summary.json` failed: 0) and backed up incl. `image-masters/`.
- [ ] Gelato designs saved as reusable templates (separate task!).
- [ ] Formspree test submission received and deleted.
- [ ] Old URL decisions reviewed (`reports/url-audit.md`).
- [ ] Final full-site backup stored offline.

## Project structure

```
app/          routes: /, /designs, /products/[handle], support pages, sitemap, robots
components/   Header, Footer, Gallery, VariantSelector, RequestForm, ProductCard…
data/         catalog.json (generated), review-flags.json (generated), config.ts
lib/          catalog, pricing, variants, seo, types
public/products/  optimized images (committed, ~21 MB)
public/favicon.png  self-hosted brand favicon (rescued from Shopify CDN)
scripts/      download-images.mjs, optimize-images.mjs, normalize-catalog.mjs,
              validate.mjs, image-dims.mjs
launch/       original handoff package (read-only source)
reports/      rescue + optimization + variant-review + url-audit
```

## Image rescue kit (historical)

`scripts/download-images.mjs` re-downloads any missing Shopify CDN images into `public/products/` (run `node scripts/download-images.mjs --dry-run` first). See `README image rescue.md`. After any rescue run: re-run `npm run optimize-images && npm run normalize`.

## Status & changelog

- **2.1.0** — favicon self-hosted (`public/favicon.png`, was Shopify CDN); README/status refresh.
- **2.0.0** — full storefront build: home, catalog with search/tag filters, 53 SSG product pages with hybrid variant selection, Formspree request forms, support pages, sitemap/robots/JSON-LD, branded 404, validation suite (`npm run validate` 8/8 gates), Vercel deployment docs.
- **1.x** — image rescue kit: 557/557 Shopify images archived locally (`reports/summary.json` failed: 0), optimized to ~21 MB WebP for Vercel Hobby limits.

Validation snapshot (2026-11-20): `next build` green with 53 SSG routes · 10 routes curl-verified 200 + unknown handle 404 · canonical/OG/JSON-LD present · sitemap 60 URLs · Formspree controlled test `{"ok":true}` · zero `cdn.shopify.com` references in app code, data, or build.

**Pending owner tasks:** delete the `[TEST]` Formspree submission · approve `[PLACEHOLDER]` copy (privacy retention, shipping rates/window, contact email) · save Gelato design templates · offline backup incl. `image-masters/` · Vercel import + DNS switch + Shopify cancellation (explicit approval only).

SNXL-static
