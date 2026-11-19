# ShirtNerdXL image backup

Standalone Node.js 20+ utility (no dependencies). The bundled `products.json` contains only the 53 selected launch products.

## Run

```bash
node --version                 # 20 or higher
node scripts/download-images.mjs --dry-run
node scripts/download-images.mjs
```

To retry failures, **run the same command again**. Valid images already downloaded are reused. For a slower connection, try:

```bash
node scripts/download-images.mjs --concurrency=2 --retries=6
```

## Output

- `public/products/<shopify-handle>/*` — actual downloaded images, organized by product.
- `products.local.json` — complete launch catalog with local `/products/...` paths in `images[].url` and `variants[].imageUrl`. Original remote image URLs remain in `sourceUrl` and `sourceImageUrl` for provenance.
- `reports/image-download-report.csv` — per-image outcome, including failures.
- `reports/summary.json` — counts and products missing all local images.

The downloader includes Shopify product-gallery images **and** any variant-specific image URLs. It validates file signatures, enforces a per-file size cap, retries transient errors, and handles interruption/resumption. Product-level duplicates are retained; identical source URLs within the same product download only once. No print-ready Gelato art is created by this utility.

**Before closing Shopify:** verify `failed: 0` in `reports/summary.json`, inspect some sample images visually, and retain a copy of the entire directory. Saving Gelato designs as templates is a separate task. 

## Next.js handoff

Copy `public/products` into the Next.js project's `public/products` directory and use `products.local.json` as the source catalog. The URLs are served from `/products/...`.

**Note:** This only downloads files currently reachable on Shopify's image CDN; the script cannot recover deleted or inaccessible files.
